import { SportEvent } from "../types/opponentSearch";

const API_URL = "http://192.168.32.127:5001";

export async function loadSportEvents(): Promise<SportEvent[]> {
	const response = await fetch(`${API_URL}/api/sports/events`);

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message ?? "Events loading failed");
	}

	return data.events;
}
