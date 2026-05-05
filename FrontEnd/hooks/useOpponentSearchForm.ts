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
import {
	OpponentSearchFilters,
	OpponentSearchResult,
	SearchLocationMode,
} from "../types/opponentSearch";

const API_URL = "http://192.168.32.127:5001";

const formatTime = (date: Date) => {
	return date.toLocaleTimeString("en-GB", {
		hour: "2-digit",
		minute: "2-digit",
	});
};

export function useOpponentSearchForm(sportName: string) {
	const { user } = useUser();

	// ===== STATE =====
	const [level, setLevel] = useState<OpponentLevel>("Any");
	const [languages, setLanguages] = useState<OpponentLanguage[]>(["Any"]);
	const [ageMin, setAgeMin] = useState(18);
	const [ageMax, setAgeMax] = useState(45);
	const [sex, setSex] = useState<OpponentSex[]>(["Male", "Female"]);
	const [selectedDates, setSelectedDates] = useState<string[]>([]);

	const [timeFrom, setTimeFrom] = useState(() => {
		const d = new Date();
		d.setHours(18, 0, 0, 0);
		return d;
	});

	const [timeTo, setTimeTo] = useState(() => {
		const d = new Date();
		d.setHours(21, 0, 0, 0);
		return d;
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

	// ===== DATE =====
	const handleToggleDate = (date: string) => {
		setSelectedDates((current) => {
			if (current.includes(date)) {
				return current.filter((d) => d !== date);
			}

			return [...current, date].sort();
		});
	};

	// ===== LANGUAGE =====
	const handleToggleLanguage = (language: OpponentLanguage) => {
		if (language === "Any") {
			setLanguages(["Any"]);
			return;
		}

		setLanguages((current) => {
			const withoutAny = current.filter((l) => l !== "Any");

			if (withoutAny.includes(language)) {
				const next = withoutAny.filter((l) => l !== language);
				return next.length === 0 ? ["Any"] : next;
			}

			return [...withoutAny, language];
		});
	};

	// ===== SEX =====
	const handleToggleSex = (selectedSex: OpponentSex) => {
		setSex((current) => {
			if (current.includes(selectedSex)) {
				const next = current.filter((s) => s !== selectedSex);
				return next.length === 0 ? current : next;
			}

			return [...current, selectedSex];
		});
	};

	// ===== LOCATION =====
	const handleUseMyLocation = async () => {
		try {
			const permission = await Location.requestForegroundPermissionsAsync();

			if (permission.status !== "granted") {
				Alert.alert("Location permission denied");
				return;
			}

			const loc = await Location.getCurrentPositionAsync({});

			setLatitude(loc.coords.latitude);
			setLongitude(loc.coords.longitude);
		} catch (err) {
			console.log(err);
			Alert.alert("Could not get location");
		}
	};

	// ===== SEARCH =====
	const handleSearch = async (): Promise<OpponentSearchResult[] | null> => {
		if (selectedDates.length === 0) {
			Alert.alert("Missing dates", "Please select at least one date.");
			return null;
		}

		if (locationMode === "city" && !city.trim()) {
			Alert.alert("Missing city", "Please enter city.");
			return null;
		}

		if (locationMode === "near_me" && (!latitude || !longitude)) {
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
			dates: selectedDates,
			timeFrom: formatTime(timeFrom),
			timeTo: formatTime(timeTo),
			locationMode,
			radiusKm,
			city,
			matchType,
		};

		console.log("🔎 Sending filters:", filters);

		setIsLoading(true);

		try {
			const response = await fetch(`${API_URL}/api/sports/search-opponents`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					current_clerk_user_id: user?.id,
					latitude,
					longitude,
					...filters,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				Alert.alert("Error", data.message || "Search failed");
				return null;
			}

			console.log("✅ Results:", data.opponents);

			setResults(data.opponents);

			return data.opponents;
		} catch (error) {
			console.log(error);
			Alert.alert("Error", "Could not connect to server");
			return null;
		} finally {
			setIsLoading(false);
		}
	};

	return {
		// state
		level,
		setLevel,
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
		results,
		isLoading,
		latitude,
		longitude,

		// setters
		setAgeMin,
		setAgeMax,
		setTimeFrom,
		setTimeTo,
		setLocationMode,
		setRadiusKm,
		setCity,
		setMatchType,

		// handlers
		handleToggleDate,
		handleToggleLanguage,
		handleToggleSex,
		handleUseMyLocation,
		handleSearch,
	};
}
