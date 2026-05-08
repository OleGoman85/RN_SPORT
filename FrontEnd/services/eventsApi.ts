import { SportEvent, UpdateSportEventParams } from "../types/opponentSearch";

const API_URL = "http://192.168.32.127:5001";

export async function loadSportEvents(): Promise<SportEvent[]> {
	const response = await fetch(`${API_URL}/api/sports/events`);

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message ?? "Events loading failed");
	}

	return data.events;
}

export async function updateSportEvent(
	eventId: number,
	eventData: UpdateSportEventParams,
): Promise<SportEvent> {
	const response = await fetch(`${API_URL}/api/sports/events/${eventId}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(eventData),
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message ?? "Event update failed");
	}

	return data.event;
}

export async function deleteSportEvent(
	eventId: number,
	currentClerkUserId: string,
): Promise<void> {
	const response = await fetch(`${API_URL}/api/sports/events/${eventId}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			current_clerk_user_id: currentClerkUserId,
		}),
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message ?? "Event delete failed");
	}
}
