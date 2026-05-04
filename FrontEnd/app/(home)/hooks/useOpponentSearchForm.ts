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
	SearchLocationMode,
} from "../types/opponentSearch";

const formatTime = (date: Date) => {
	return date.toLocaleTimeString("en-GB", {
		hour: "2-digit",
		minute: "2-digit",
	});
};

export function useOpponentSearchForm(sportName: string) {
	const [level, setLevel] = useState<OpponentLevel>("Any");
	const [languages, setLanguages] = useState<OpponentLanguage[]>(["Any"]);
	const [ageMin, setAgeMin] = useState(18);
	const [ageMax, setAgeMax] = useState(45);
	const [sex, setSex] = useState<OpponentSex[]>(["Male", "Female"]);
	const [selectedDates, setSelectedDates] = useState<string[]>([]);

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
			const withoutAny = currentLanguages.filter(
				(currentLanguage) => currentLanguage !== "Any",
			);

			if (withoutAny.includes(language)) {
				const nextLanguages = withoutAny.filter(
					(currentLanguage) => currentLanguage !== language,
				);

				return nextLanguages.length === 0 ? ["Any"] : nextLanguages;
			}

			return [...withoutAny, language];
		});
	};

	const handleToggleSex = (selectedSex: OpponentSex) => {
		setSex((currentSex) => {
			if (currentSex.includes(selectedSex)) {
				const nextSex = currentSex.filter((item) => item !== selectedSex);

				return nextSex.length === 0 ? currentSex : nextSex;
			}

			return [...currentSex, selectedSex];
		});
	};

	const buildFilters = (): OpponentSearchFilters | null => {
		if (selectedDates.length === 0) {
			Alert.alert("Missing dates", "Please select at least one date.");
			return null;
		}

		if (locationMode === "city" && !city.trim()) {
			Alert.alert("Missing city", "Please enter city for search.");
			return null;
		}

		return {
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
	};

	const handleSearch = () => {
		const filters = buildFilters();

		if (!filters) {
			return;
		}

		console.log("🔎 Opponent search filters:");
		console.log(filters);

		Alert.alert("🎉 Search filters ready 🎉");
	};

	return {
		level,
		setLevel,
		languages,
		ageMin,
		setAgeMin,
		ageMax,
		setAgeMax,
		sex,
		selectedDates,
		timeFrom,
		setTimeFrom,
		timeTo,
		setTimeTo,
		locationMode,
		setLocationMode,
		radiusKm,
		setRadiusKm,
		city,
		setCity,
		matchType,
		setMatchType,
		handleToggleDate,
		handleToggleLanguage,
		handleToggleSex,
		handleSearch,
	};
}
