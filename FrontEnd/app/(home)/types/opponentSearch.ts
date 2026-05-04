import {
	MatchType,
	OpponentLanguage,
	OpponentLevel,
	OpponentSex,
} from "../constants/opponentSearchOptions";

export type SearchLocationMode = "near_me" | "city";

export type OpponentSearchFilters = {
	sportName: string;
	level: OpponentLevel;
	languages: OpponentLanguage[];
	ageMin: number;
	ageMax: number;
	dates: string[];
	timeFrom: string;
	timeTo: string;
	sex: OpponentSex[];
	locationMode: SearchLocationMode;
	radiusKm: number;
	city: string;
	matchType: MatchType;
};
