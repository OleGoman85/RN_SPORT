// Helpers used by the create/edit event form.
import { SportEvent } from "../types/events";

// Returns today's date in the YYYY-MM-DD format expected by inputs/backend.
export function getTodayDate() {
	return new Date().toISOString().slice(0, 10);
}

// Normalizes backend time strings to HH:mm for the form input.
export function normalizeTime(time: string) {
	return time.length >= 5 ? time.slice(0, 5) : time;
}

// Reads city from either the event-specific alias or the creator/user field fallback.
export function getEventCity(event: SportEvent) {
	const eventWithCity = event as SportEvent & {
		event_city?: string | null;
	};

	return eventWithCity.event_city ?? event.city ?? "";
}
