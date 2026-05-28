// Owns profile form state, validation, loading saved profile data, and saving updates.
import { useUser } from "@clerk/expo";
import { useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { loadUserProfile, saveUserProfile } from "../services/profileApi";
import { SelectedSport } from "../types/profile";
import { useAvatarUpload } from "./useAvatarUpload";
import { useBirthDateFields } from "./useBirthDateFields";
import { useCurrentLocation } from "./useCurrentLocation";

// Provides all profile field state and actions used by the Profile tab.
export function useProfileForm() {
	const { user } = useUser();

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [nickname, setNickname] = useState("");
	const [aboutMe, setAboutMe] = useState("");
	const [sex, setSex] = useState("");
	const [country, setCountry] = useState("");
	const [city, setCity] = useState("");

	const [selectedSports, setSelectedSports] = useState<SelectedSport[]>([]);
	const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

	const [isSaving, setIsSaving] = useState(false);

	const {
		birthDay,
		setBirthDay,
		birthMonth,
		setBirthMonth,
		birthYear,
		setBirthYear,
		birthDateIsValid,
		dateOfBirth,
		setBirthDateFromProfile,
	} = useBirthDateFields();

	const {
		avatarUrl,
		setAvatarUrl,
		isAvatarUploading,
		handlePickAvatarFromGallery,
		handleTakeAvatarPhoto,
	} = useAvatarUpload();

	const {
		latitude,
		setLatitude,
		longitude,
		setLongitude,
		handleUseMyLocation,
	} = useCurrentLocation();

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

	// Loads saved profile data and hydrates the form when Clerk user is available.
	useEffect(() => {
		async function loadProfile() {
			if (!user?.id) {
				return;
			}

			try {
				const profile = await loadUserProfile(user.id);

				if (!profile) {
					setFirstName(user.firstName ?? "");
					setLastName(user.lastName ?? "");
					return;
				}

				setFirstName(profile.first_name ?? "");
				setLastName(profile.last_name ?? "");
				setNickname(profile.nickname ?? "");
				setAboutMe(profile.about_me ?? "");
				setBirthDateFromProfile(profile.date_of_birth);
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
	}, [
		user?.id,
		user?.firstName,
		user?.lastName,
		setAvatarUrl,
		setBirthDateFromProfile,
		setLatitude,
		setLongitude,
	]);

	// Adds/removes a sport from the selected sports list.
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

	// Changes the selected level for one sport.
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

	// Finds the selected level for rendering sport selector state.
	const getSportLevel = (sportName: string) => {
		return selectedSports.find((sport) => sport.sport_name === sportName)?.level;
	};

	// Adds/removes one spoken language.
	const handleToggleLanguage = (language: string) => {
		setSelectedLanguages((currentLanguages) => {
			if (currentLanguages.includes(language)) {
				return currentLanguages.filter((item) => item !== language);
			}

			return [...currentLanguages, language];
		});
	};

	// Validates and sends the full profile payload to the backend.
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
				date_of_birth: dateOfBirth,
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
