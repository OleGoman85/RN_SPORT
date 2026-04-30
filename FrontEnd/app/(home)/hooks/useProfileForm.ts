import { useUser } from "@clerk/expo";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import { SelectedSport } from "../types/profile";


const API_URL = "http://localhost:5001";

export function useProfileForm() {
	const { user } = useUser();

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
	// selectedSports = [
	// 	{ sport_name: "Football", level: "Beginner" },
	// 	{ sport_name: "Tennis", level: "Amateur" }
	// ]
	const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
	const [isSaving, setIsSaving] = useState(false);
	const [isProfileLoading, setIsProfileLoading] = useState(true);

	const email = user?.primaryEmailAddress?.emailAddress ?? "";

	useEffect(() => {
		const loadProfile = async () => {
			if (!user?.id) {
				return;
			}

			try {
				const response = await fetch(
					`${API_URL}/api/users/${encodeURIComponent(user.id)}`,
				);

				if (response.status === 404) {
					setIsProfileLoading(false);
					return;
				}

				const data = await response.json();

				if (!response.ok) {
					console.log("Profile loading error:", data);
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
			// result = {
			// 		canceled: false,
			// 		assets: [
			// 			{
			// 			uri: "file:///some/path/avatar.jpg",
			// 			width: 1000,
			// 			height: 1000
			// 			}
			// 		]
			// 		}

			if (!result.canceled) {
				setAvatarUrl(result.assets[0].uri);
			}
		} catch (error) {
			console.log("Gallery error:", error);
			Alert.alert("Error", "Could not open gallery.");
		}
	};

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

			if (!result.canceled) {
				setAvatarUrl(result.assets[0].uri);
			}
		} catch (error) {
			console.log("Camera error:", error);

			Alert.alert(
				"Camera is not available",
				"Camera may not work on simulator. Please test camera on a real device or choose avatar from Gallery.",
			);
		}
	};

	const handleUseMyLocation = async () => {
		try {
			const permission = await Location.requestForegroundPermissionsAsync();
			// permission = {
			// 	granted: true,
			// 	status: "granted"
			// 	}

			if (permission.status !== "granted") {
				Alert.alert("Location permission denied");
				return;
			}

			const currentLocation = await Location.getCurrentPositionAsync({});
			// 			// currentLocation = {
			// 			// 	coords: {
			// 			// 		latitude: 60.1699,
			// 			// 		longitude: 24.9384,
			// 			// 		accuracy: 10
			// 			// 	}
			// 			// 	}

			setLatitude(currentLocation.coords.latitude);
			setLongitude(currentLocation.coords.longitude);

			const address = await Location.reverseGeocodeAsync({
				latitude: currentLocation.coords.latitude,
				longitude: currentLocation.coords.longitude,
			});
			// adress = [
			// 	{
			// 		city: "Helsinki",
			// 		country: "Finland",
			// 		region: "Uusimaa",
			// 		street: "...",
			// 	}
			// 	]

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

	const getSportLevel = (sportName: string) => {
		const selectedSport = selectedSports.find(
			(sport) => sport.sport_name === sportName,
		);

		return selectedSport?.level;
	};

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
			const response = await fetch(`${API_URL}/api/users`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
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
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				Alert.alert("Error", data.message ?? "Failed to save profile");
				return;
			}

			Alert.alert("Success", "Profile saved successfully");
		} catch (error) {
			console.log(error);
			Alert.alert("Error", "Could not connect to server");
		} finally {
			setIsSaving(false);
		}
	};

	return {
		firstName,
		setFirstName,
		lastName,
		setLastName,
		nickname,
		setNickname,
		aboutMe,
		setAboutMe,
		age,
		setAge,
		sex,
		setSex,
		country,
		setCountry,
		city,
		setCity,
		avatarUrl,
		latitude,
		longitude,
		selectedSports,
		selectedLanguages,
		isSaving,
		isProfileLoading,
		isFormValid,
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
