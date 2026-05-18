import { useUser } from "@clerk/expo";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Platform } from "react-native";
import { uploadAvatarToServer } from "../services/avatarApi";
import { loadUserProfile, saveUserProfile } from "../services/profileApi";
import { SelectedSport } from "../types/profile";

export function useProfileForm() {
	const { user } = useUser();

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [nickname, setNickname] = useState("");
	const [aboutMe, setAboutMe] = useState("");

	const [birthDay, setBirthDay] = useState("");
	const [birthMonth, setBirthMonth] = useState("");
	const [birthYear, setBirthYear] = useState("");

	const [sex, setSex] = useState("");
	const [country, setCountry] = useState("");
	const [city, setCity] = useState("");
	const [avatarUrl, setAvatarUrl] = useState("");
	const [latitude, setLatitude] = useState<number | null>(null);
	const [longitude, setLongitude] = useState<number | null>(null);

	const [selectedSports, setSelectedSports] = useState<SelectedSport[]>([]);
	const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

	const [isSaving, setIsSaving] = useState(false);
	const [isAvatarUploading, setIsAvatarUploading] = useState(false);

	const buildDateOfBirth = useCallback(() => {
		const day = birthDay.trim().padStart(2, "0");
		const month = birthMonth.trim().padStart(2, "0");
		const year = birthYear.trim();

		return `${year}-${month}-${day}`;
	}, [birthDay, birthMonth, birthYear]);

	function splitDateOfBirth(dateOfBirth: string | null) {
		if (!dateOfBirth) {
			return {
				day: "",
				month: "",
				year: "",
			};
		}

		const [year, month, day] = dateOfBirth.split("-");

		return {
			day: day ?? "",
			month: month ?? "",
			year: year ?? "",
		};
	}

	const birthDateIsValid = useMemo(() => {
		if (!birthDay.trim() || !birthMonth.trim() || !birthYear.trim()) {
			return false;
		}

		const day = Number(birthDay);
		const month = Number(birthMonth);
		const year = Number(birthYear);

		if (
			Number.isNaN(day) ||
			Number.isNaN(month) ||
			Number.isNaN(year) ||
			day < 1 ||
			day > 31 ||
			month < 1 ||
			month > 12 ||
			birthYear.trim().length !== 4
		) {
			return false;
		}

		const dateOfBirth = buildDateOfBirth();
		const date = new Date(dateOfBirth);
		const today = new Date();

		if (Number.isNaN(date.getTime())) {
			return false;
		}

		if (date > today) {
			return false;
		}

		return (
			date.getFullYear() === year &&
			date.getMonth() + 1 === month &&
			date.getDate() === day
		);
	}, [birthDay, birthMonth, birthYear, buildDateOfBirth]);

	const isFormValid = useMemo(() => {
		return (
			firstName.trim().length > 0 &&
			lastName.trim().length > 0 &&
			nickname.trim().length > 0 &&
			aboutMe.trim().length > 0 &&
			birthDateIsValid &&
			sex.trim().length > 0 &&
			country.trim().length > 0 &&
			city.trim().length > 0 &&
			avatarUrl.trim().length > 0 &&
			selectedSports.length > 0 &&
			selectedLanguages.length > 0
		);
	}, [
		firstName,
		lastName,
		nickname,
		aboutMe,
		birthDateIsValid,
		sex,
		country,
		city,
		avatarUrl,
		selectedSports,
		selectedLanguages,
	]);

	useEffect(() => {
		async function loadProfile() {
			if (!user?.id) {
				return;
			}

			try {
				const profile = await loadUserProfile(user.id);

				if (!profile) {
					if (user.primaryEmailAddress?.emailAddress) {
						setFirstName(user.firstName ?? "");
						setLastName(user.lastName ?? "");
					}

					return;
				}

				const birthDate = splitDateOfBirth(profile.date_of_birth);

				setFirstName(profile.first_name ?? "");
				setLastName(profile.last_name ?? "");
				setNickname(profile.nickname ?? "");
				setAboutMe(profile.about_me ?? "");
				setBirthDay(birthDate.day);
				setBirthMonth(birthDate.month);
				setBirthYear(birthDate.year);
				setSex(profile.sex ?? "");
				setCountry(profile.country ?? "");
				setCity(profile.city ?? "");
				setAvatarUrl(profile.avatar_url ?? "");
				setLatitude(profile.latitude ? Number(profile.latitude) : null);
				setLongitude(profile.longitude ? Number(profile.longitude) : null);
				setSelectedSports(profile.sports ?? []);
				setSelectedLanguages(
					profile.languages?.map((item) => item.language) ?? [],
				);
			} catch (error) {
				console.log("Profile loading error:", error);
				Alert.alert("Error", "Could not load profile.");
			}
		}

		loadProfile();
	}, [user?.id, user?.firstName, user?.lastName, user?.primaryEmailAddress]);

	const handleToggleSport = (sportName: string) => {
		setSelectedSports((currentSports) => {
			const alreadySelected = currentSports.some(
				(sport) => sport.sport_name === sportName,
			);

			if (alreadySelected) {
				return currentSports.filter((sport) => sport.sport_name !== sportName);
			}

			return [
				...currentSports,
				{
					sport_name: sportName,
					level: "Beginner",
				},
			];
		});
	};

	const handleChangeSportLevel = (sportName: string, level: string) => {
		setSelectedSports((currentSports) =>
			currentSports.map((sport) =>
				sport.sport_name === sportName
					? {
						...sport,
						level,
					}
					: sport,
			),
		);
	};

	const getSportLevel = (sportName: string) => {
		return selectedSports.find((sport) => sport.sport_name === sportName)?.level;
	};

	const handleToggleLanguage = (language: string) => {
		setSelectedLanguages((currentLanguages) => {
			if (currentLanguages.includes(language)) {
				return currentLanguages.filter((item) => item !== language);
			}

			return [...currentLanguages, language];
		});
	};

	const handlePickAvatarFromGallery = async () => {
		try {
			const permission =
				await ImagePicker.requestMediaLibraryPermissionsAsync();

			if (!permission.granted) {
				Alert.alert("Permission required", "Gallery permission is required.");
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

			await uploadAvatar(result.assets[0].uri);
		} catch (error) {
			console.log("Gallery avatar error:", error);
			Alert.alert("Error", "Could not select avatar.");
		}
	};

	const handleTakeAvatarPhoto = async () => {
		try {
			const permission = await ImagePicker.requestCameraPermissionsAsync();

			if (!permission.granted) {
				Alert.alert("Permission required", "Camera permission is required.");
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

			await uploadAvatar(result.assets[0].uri);
		} catch (error) {
			console.log("Camera avatar error:", error);
			Alert.alert("Error", "Could not take photo.");
		}
	};

	const uploadAvatar = async (imageUri: string) => {
		try {
			setIsAvatarUploading(true);

			const uploadedAvatarUrl = await uploadAvatarToServer(imageUri);

			setAvatarUrl(uploadedAvatarUrl);
		} catch (error) {
			console.log("Avatar upload error:", error);
			Alert.alert("Error", "Could not upload avatar.");
		} finally {
			setIsAvatarUploading(false);
		}
	};

	const handleUseMyLocation = async () => {
		try {
			const permission = await Location.requestForegroundPermissionsAsync();

			if (permission.status !== "granted") {
				Alert.alert("Permission required", "Location permission is required.");
				return;
			}

			const currentPosition = await Location.getCurrentPositionAsync({});

			setLatitude(currentPosition.coords.latitude);
			setLongitude(currentPosition.coords.longitude);
		} catch (error) {
			console.log("Location error:", error);

			if (Platform.OS === "android" || Platform.OS === "ios") {
				Alert.alert("Error", "Could not get current location.");
			}
		}
	};

	const handleSaveProfile = async () => {
		if (!user?.id || !user.primaryEmailAddress?.emailAddress) {
			Alert.alert("Error", "User is not loaded yet.");
			return;
		}

		if (!isFormValid) {
			Alert.alert("Error", "Please fill all required profile fields.");
			return;
		}

		try {
			setIsSaving(true);

			await saveUserProfile({
				clerk_user_id: user.id,
				email: user.primaryEmailAddress.emailAddress,
				first_name: firstName.trim(),
				last_name: lastName.trim(),
				nickname: nickname.trim(),
				about_me: aboutMe.trim(),
				date_of_birth: buildDateOfBirth(),
				sex,
				country: country.trim(),
				city: city.trim(),
				avatar_url: avatarUrl,
				latitude,
				longitude,
				sports: selectedSports,
				languages: selectedLanguages,
			});

			Alert.alert("Success", "Profile saved successfully.");
		} catch (error) {
			console.log("Profile saving error:", error);

			Alert.alert(
				"Error",
				error instanceof Error ? error.message : "Could not save profile.",
			);
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

		birthDay,
		setBirthDay,
		birthMonth,
		setBirthMonth,
		birthYear,
		setBirthYear,

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
		isAvatarUploading,
		isFormValid,

		getSportLevel,
		handleToggleSport,
		handleChangeSportLevel,
		handleToggleLanguage,
		handlePickAvatarFromGallery,
		handleTakeAvatarPhoto,
		handleUseMyLocation,
		handleSaveProfile,
	};
}
