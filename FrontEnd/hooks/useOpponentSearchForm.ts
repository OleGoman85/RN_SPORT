import { useUser } from "@clerk/expo";
import * as Location from "expo-location";
import { useState } from "react";
import { Alert } from "react-native";
import {
	MatchType,
	OpponentLanguage,
	OpponentLevel,
	OpponentSex,
} from "../constants/opponentSearchOptions";
import { searchOpponents } from "../services/opponentSearchApi";
import {
	OpponentSearchFilters,
	OpponentSearchResponse,
	OpponentSearchResult,
	SearchLocationMode,
} from "../types/opponentSearch";

const formatTime = (date: Date) => {
	return date.toLocaleTimeString("en-GB", {
		hour: "2-digit",
		minute: "2-digit",
	});
};

export function useOpponentSearchForm(sportName: string) {
	const { user } = useUser();

	const [level, setLevel] = useState<OpponentLevel>("Any");
	const [languages, setLanguages] = useState<OpponentLanguage[]>(["Any"]);
	const [ageMin, setAgeMin] = useState(18);
	const [ageMax, setAgeMax] = useState(45);
	const [sex, setSex] = useState<OpponentSex[]>(["Male", "Female"]);
	const [selectedDates, setSelectedDates] = useState<string[]>([]);
	const [publishToEvents, setPublishToEvents] = useState(true);

	const [timeFrom, setTimeFrom] = useState(() => {
		const date = new Date();
		date.setHours(18, 0, 0, 0);
		return date;
	});

	const [timeTo, setTimeTo] = useState(() => {
		const date = new Date();
		date.setHours(21, 0, 0, 0);
		return date;
	});

	const [locationMode, setLocationMode] =
		useState<SearchLocationMode>("near_me");
	const [radiusKm, setRadiusKm] = useState(10);
	const [city, setCity] = useState("");
	const [matchType, setMatchType] = useState<MatchType>("Any");
	const [latitude, setLatitude] = useState<number | null>(null);
	const [longitude, setLongitude] = useState<number | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [results, setResults] = useState<OpponentSearchResult[]>([]);

	const handleToggleDate = (date: string) => {
		setSelectedDates((currentDates) => {
			if (currentDates.includes(date)) {
				return currentDates.filter((currentDate) => currentDate !== date);
			}

			return [...currentDates, date].sort();
		});
	};

	const handleToggleLanguage = (language: OpponentLanguage) => {
		if (language === "Any") {
			setLanguages(["Any"]);
			return;
		}

		setLanguages((currentLanguages) => {
			const languagesWithoutAny = currentLanguages.filter(
				(currentLanguage) => currentLanguage !== "Any",
			);

			if (languagesWithoutAny.includes(language)) {
				const nextLanguages = languagesWithoutAny.filter(
					(currentLanguage) => currentLanguage !== language,
				);

				return nextLanguages.length === 0 ? ["Any"] : nextLanguages;
			}

			return [...languagesWithoutAny, language];
		});
	};

	const handleToggleSex = (selectedSex: OpponentSex) => {
		setSex((currentSex) => {
			if (currentSex.includes(selectedSex)) {
				const nextSex = currentSex.filter(
					(currentSelectedSex) => currentSelectedSex !== selectedSex,
				);

				return nextSex.length === 0 ? currentSex : nextSex;
			}

			return [...currentSex, selectedSex];
		});
	};

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
		} catch (error) {
			console.log("Location error:", error);
			Alert.alert("Could not get location");
		}
	};

	const handleSearch = async (): Promise<OpponentSearchResponse | null> => {
		if (!user?.id) {
			Alert.alert("User is not loaded yet");
			return null;
		}

		if (selectedDates.length === 0) {
			Alert.alert("Missing dates", "Please select at least one date.");
			return null;
		}

		if (locationMode === "city" && !city.trim()) {
			Alert.alert("Missing city", "Please enter city.");
			return null;
		}

		if (locationMode === "near_me" && (latitude === null || longitude === null)) {
			Alert.alert("Location required", "Please enable location.");
			return null;
		}

		const filters: OpponentSearchFilters = {
			sportName,
			level,
			languages,
			ageMin,
			ageMax,
			sex,
			publishToEvents,
			dates: selectedDates,
			timeFrom: formatTime(timeFrom),
			timeTo: formatTime(timeTo),
			locationMode,
			radiusKm,
			city,
			matchType,
		};

		setIsLoading(true);

		try {
			const response = await searchOpponents({
				current_clerk_user_id: user.id,
				latitude,
				longitude,
				...filters,
			});

			setResults(response.opponents);

			return response;
		} catch (error) {
			console.log("Search error:", error);
			Alert.alert("Error", "Could not search opponents");
			return null;
		} finally {
			setIsLoading(false);
		}
	};

	return {
		level,
		languages,
		ageMin,
		ageMax,
		sex,
		selectedDates,
		timeFrom,
		timeTo,
		locationMode,
		radiusKm,
		city,
		matchType,
		latitude,
		longitude,
		results,
		isLoading,
		publishToEvents,

		setLevel,
		setAgeMin,
		setAgeMax,
		setTimeFrom,
		setTimeTo,
		setLocationMode,
		setRadiusKm,
		setCity,
		setMatchType,
		setPublishToEvents,

		handleToggleDate,
		handleToggleLanguage,
		handleToggleSex,
		handleUseMyLocation,
		handleSearch,
	};
}
