export type SearchLocationMode = "near_me" | "city";

export type MatchType = "Any" | "Casual" | "Training" | "Competitive";

export type OpponentSearchFilters = {
	sportName: string;
	level: string;
	languages: string[];
	ageMin: string;
	ageMax: string;
	sex: string[];
	date: string;
	timeFrom: string;
	timeTo: string;
	locationMode: SearchLocationMode;
	radiusKm: number;
	city: string;
	matchType: MatchType;
};
