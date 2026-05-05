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

export type OpponentSearchResult = {
	id: number;
	clerk_user_id: string;
	email: string;
	first_name: string;
	last_name: string;
	nickname: string;
	about_me: string;
	age: number;
	sex: string;
	country: string;
	city: string;
	avatar_url: string;
	latitude: string | number | null;
	longitude: string | number | null;
	sport_name: string;
	level: string;
};
