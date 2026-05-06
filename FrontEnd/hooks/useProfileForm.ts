import { useUser } from "@clerk/expo";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import { uploadAvatarToServer } from "../services/avatarApi";
import { loadUserProfile, saveUserProfile } from "../services/profileApi";
import { SelectedSport } from "../types/profile";

export function useProfileForm() {
	const { user } = useUser();

	// ===== STATE =====
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [nickname, setNickname] = useState("");
	const [aboutMe, setAboutMe] = useState("");
	const [age, setAge] = useState("");
	const [sex, setSex] = useState("");
	const [country, setCountry] = useState("");
	const [city, setCity] = useState("");
	const [avatarUrl, setAvatarUrl] = useState("");
	const [latitude, setLatitude] = useState<number | null>(null);
	const [longitude, setLongitude] = useState<number | null>(null);
	const [selectedSports, setSelectedSports] = useState<SelectedSport[]>([]);
	const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
	const [isSaving, setIsSaving] = useState(false);
	const [isProfileLoading, setIsProfileLoading] = useState(true);
	const [isAvatarUploading, setIsAvatarUploading] = useState(false);

	const email = user?.primaryEmailAddress?.emailAddress ?? "";

	// ===== LOAD PROFILE =====
	useEffect(() => {
		const loadProfile = async () => {
			if (!user?.id) {
				return;
			}

			try {
				const data = await loadUserProfile(user.id);

				if (!data) {
					setIsProfileLoading(false);
					return;
				}

				setFirstName(data.first_name ?? "");
				setLastName(data.last_name ?? "");
				setNickname(data.nickname ?? "");
				setAboutMe(data.about_me ?? "");
				setAge(data.age ? String(data.age) : "");
				setSex(data.sex ?? "");
				setCountry(data.country ?? "");
				setCity(data.city ?? "");
				setAvatarUrl(data.avatar_url ?? "");
				setLatitude(data.latitude ? Number(data.latitude) : null);
				setLongitude(data.longitude ? Number(data.longitude) : null);

				setSelectedSports(
					Array.isArray(data.sports)
						? data.sports.map((sport: SelectedSport) => ({
								sport_name: sport.sport_name,
								level: sport.level,
							}))
						: [],
				);

				setSelectedLanguages(
					Array.isArray(data.languages)
						? data.languages.map(
								(languageItem: { language: string }) => languageItem.language,
							)
						: [],
				);
			} catch (error) {
				console.log("Could not load profile:", error);
			} finally {
				setIsProfileLoading(false);
			}
		};

		loadProfile();
	}, [user?.id]);

	// ===== VALIDATION =====
	const isFormValid =
		firstName.trim() &&
		lastName.trim() &&
		nickname.trim() &&
		aboutMe.trim() &&
		age.trim() &&
		sex.trim() &&
		country.trim() &&
		city.trim() &&
		avatarUrl.trim() &&
		selectedSports.length > 0 &&
		selectedLanguages.length > 0;

	// ===== PICK AVATAR FROM GALLERY =====
	const handlePickAvatarFromGallery = async () => {
		try {
			const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

			if (!permission.granted) {
				Alert.alert("Permission denied", "Gallery permission is required.");
				return;
			}

			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ["images"],
				allowsEditing: true,
				aspect: [1, 1],
				quality: 0.8,
			});

			if (result.canceled) {
				return;
			}

			setIsAvatarUploading(true);

			const uploadedAvatarUrl = await uploadAvatarToServer(result.assets[0].uri);

			setAvatarUrl(uploadedAvatarUrl);

			Alert.alert("Success", "Avatar uploaded successfully");
		} catch (error) {
			console.log("Gallery upload error:", error);
			Alert.alert("Error", "Could not upload avatar.");
		} finally {
			setIsAvatarUploading(false);
		}
	};

	// ===== TAKE AVATAR PHOTO =====
	const handleTakeAvatarPhoto = async () => {
		try {
			if (Platform.OS === "ios" && __DEV__) {
				console.log("Camera can be unavailable on iOS simulator.");
			}

			const permission = await ImagePicker.requestCameraPermissionsAsync();

			if (!permission.granted) {
				Alert.alert("Permission denied", "Camera permission is required.");
				return;
			}

			const result = await ImagePicker.launchCameraAsync({
				allowsEditing: true,
				aspect: [1, 1],
				quality: 0.8,
			});

			if (result.canceled) {
				return;
			}

			setIsAvatarUploading(true);

			const uploadedAvatarUrl = await uploadAvatarToServer(result.assets[0].uri);

			setAvatarUrl(uploadedAvatarUrl);

			Alert.alert("Success", "Avatar uploaded successfully");
		} catch (error) {
			console.log("Camera upload error:", error);

			Alert.alert(
				"Camera error",
				"Could not take or upload photo. Please try Gallery.",
			);
		} finally {
			setIsAvatarUploading(false);
		}
	};

	// ===== USE MY LOCATION =====
	const handleUseMyLocation = async () => {
		try {
			const permission = await Location.requestForegroundPermissionsAsync();

			if (permission.status !== "granted") {
				Alert.alert("Location permission denied");
				return;
			}

			const currentLocation = await Location.getCurrentPositionAsync({});

			setLatitude(currentLocation.coords.latitude);
			setLongitude(currentLocation.coords.longitude);

			const address = await Location.reverseGeocodeAsync({
				latitude: currentLocation.coords.latitude,
				longitude: currentLocation.coords.longitude,
			});

			if (address.length > 0) {
				setCountry(address[0].country ?? "");
				setCity(address[0].city ?? address[0].region ?? "");
			}
		} catch (error) {
			console.log("Location error:", error);

			Alert.alert(
				"Location error",
				"Could not get your location. You can enter country and city manually.",
			);
		}
	};

	// ===== TOGGLE SPORT =====
	const handleToggleSport = (sportName: string) => {
		const alreadySelected = selectedSports.find(
			(sport) => sport.sport_name === sportName,
		);

		if (alreadySelected) {
			setSelectedSports((currentSports) =>
				currentSports.filter((sport) => sport.sport_name !== sportName),
			);
			return;
		}

		setSelectedSports((currentSports) => [
			...currentSports,
			{
				sport_name: sportName,
				level: "Beginner",
			},
		]);
	};

	// ===== CHANGE SPORT LEVEL =====
	const handleChangeSportLevel = (sportName: string, level: string) => {
		setSelectedSports((currentSports) =>
			currentSports.map((sport) => {
				if (sport.sport_name === sportName) {
					return {
						...sport,
						level,
					};
				}

				return sport;
			}),
		);
	};

	// ===== GET SPORT LEVEL =====
	const getSportLevel = (sportName: string) => {
		const selectedSport = selectedSports.find(
			(sport) => sport.sport_name === sportName,
		);

		return selectedSport?.level;
	};

	// ===== TOGGLE LANGUAGE =====
	const handleToggleLanguage = (language: string) => {
		const alreadySelected = selectedLanguages.includes(language);

		if (alreadySelected) {
			setSelectedLanguages((currentLanguages) =>
				currentLanguages.filter(
					(currentLanguage) => currentLanguage !== language,
				),
			);
			return;
		}

		setSelectedLanguages((currentLanguages) => [
			...currentLanguages,
			language,
		]);
	};

	// ===== SAVE PROFILE =====
	const handleSaveProfile = async () => {
		if (!user?.id || !email) {
			Alert.alert("User is not loaded yet");
			return;
		}

		if (!isFormValid) {
			Alert.alert("Please fill all required fields");
			return;
		}

		setIsSaving(true);

		try {
			await saveUserProfile({
				clerk_user_id: user.id,
				email,
				first_name: firstName,
				last_name: lastName,
				nickname,
				about_me: aboutMe,
				age: Number(age),
				sex,
				country,
				city,
				avatar_url: avatarUrl,
				latitude,
				longitude,
				sports: selectedSports,
				languages: selectedLanguages,
			});

			Alert.alert("Success", "Profile saved successfully");
		} catch (error) {
			console.log("Save profile error:", error);
			Alert.alert("Error", "Could not save profile");
		} finally {
			setIsSaving(false);
		}
	};

	return {
		// state
		firstName,
		lastName,
		nickname,
		aboutMe,
		age,
		sex,
		country,
		city,
		avatarUrl,
		latitude,
		longitude,
		selectedSports,
		selectedLanguages,
		isSaving,
		isProfileLoading,
		isAvatarUploading,
		isFormValid,

		// setters
		setFirstName,
		setLastName,
		setNickname,
		setAboutMe,
		setAge,
		setSex,
		setCountry,
		setCity,

		// handlers
		handlePickAvatarFromGallery,
		handleTakeAvatarPhoto,
		handleUseMyLocation,
		handleToggleSport,
		handleChangeSportLevel,
		getSportLevel,
		handleToggleLanguage,
		handleSaveProfile,
	};
}
