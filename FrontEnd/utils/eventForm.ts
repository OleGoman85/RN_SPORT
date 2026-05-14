import { SportEvent } from "../types/events";

export function getTodayDate() {
	return new Date().toISOString().slice(0, 10);
}

export function normalizeTime(time: string) {
	return time.length >= 5 ? time.slice(0, 5) : time;
}

export function getEventCity(event: SportEvent) {
	const eventWithCity = event as SportEvent & {
		event_city?: string | null;
	};

	return eventWithCity.event_city ?? event.city ?? "";
}
