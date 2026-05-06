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
	publishToEvents: boolean;
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
	available_date: string;
	time_from: string;
	time_to: string;
	match_type: string;
	distance_km: number | null;
};

export type SportEvent = {
	id: number;
	sport_name: string;
	level: string;
	available_date: string;
	time_from: string;
	time_to: string;
	match_type: string;
	location_mode: string;
	radius_km: number | null;
	event_city: string | null;
	event_latitude: string | number | null;
	event_longitude: string | number | null;
	created_at: string;
	clerk_user_id: string;
	first_name: string;
	last_name: string;
	nickname: string;
	about_me: string;
	age: number;
	sex: string;
	country: string;
	city: string;
	avatar_url: string;
};
