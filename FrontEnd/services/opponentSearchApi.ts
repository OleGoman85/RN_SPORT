import {
	OpponentSearchFilters,
	OpponentSearchResponse,
} from "../types/opponentSearch";

const API_URL = "http://192.168.32.127:5001";

export type SearchOpponentsParams = OpponentSearchFilters & {
	current_clerk_user_id: string;
	latitude: number | null;
	longitude: number | null;
};

export async function searchOpponents(
	filters: SearchOpponentsParams,
): Promise<OpponentSearchResponse> {
	const response = await fetch(`${API_URL}/api/sports/search-opponents`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(filters),
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message ?? "Search failed");
	}

	return {
		eventOpponents: data.eventOpponents ?? [],
		profileOpponents: data.profileOpponents ?? [],
		opponents: data.opponents ?? [],
	};
}
