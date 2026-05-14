export type DayFilter = "all" | "today" | "tomorrow" | "week";

export function isValidString(value: unknown) {
	return typeof value === "string" && value.trim().length > 0;
}

export function isValidNumber(value: unknown) {
	return typeof value === "number" && !Number.isNaN(value);
}

export function getDayFilter(value: unknown): DayFilter {
	if (value === "today" || value === "tomorrow" || value === "week") {
		return value;
	}

	return "all";
}

export function getOptionalStringValue(value: unknown) {
	if (!isValidString(value)) {
		return null;
	}

	const stringValue = value as string;
	return stringValue.trim();
}

export function getOptionalNumberValue(value: unknown) {
	if (!isValidNumber(value)) {
		return null;
	}

	return value;
}

export function getRequiredEventFieldsError(body: {
	current_clerk_user_id?: unknown;
	sport_name?: unknown;
	event_name?: unknown;
	available_date?: unknown;
	time_from?: unknown;
	location_name?: unknown;
	max_participants?: unknown;
}) {
	if (
		!isValidString(body.current_clerk_user_id) ||
		!isValidString(body.sport_name) ||
		!isValidString(body.event_name) ||
		!isValidString(body.available_date) ||
		!isValidString(body.time_from) ||
		!isValidString(body.location_name) ||
		!isValidNumber(body.max_participants)
	) {
		return "Missing required event fields.";
	}

	if (!isValidNumber(body.max_participants)) {
		return "Missing required event fields.";
	}

	const maxParticipants = body.max_participants as number;

	if (maxParticipants < 2 || maxParticipants > 100) {
		return "Max participants must be between 2 and 100.";
	}

	return null;
}
