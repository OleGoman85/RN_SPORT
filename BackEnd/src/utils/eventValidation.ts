// Validation helpers for sport event route payloads and filters.
export type DayFilter = "all" | "today" | "tomorrow" | "week";
export type EventFormat = "1v1" | "team";
export type EventFormatFilter = "all" | EventFormat;

// Checks required string fields after trimming whitespace.
export function isValidString(value: unknown) {
	return typeof value === "string" && value.trim().length > 0;
}

// Checks numeric payload fields and rejects NaN.
export function isValidNumber(value: unknown): value is number {
	return typeof value === "number" && !Number.isNaN(value);
}

function isValidLatitude(value: unknown) {
	return isValidNumber(value) && value >= -90 && value <= 90;
}

function isValidLongitude(value: unknown) {
	return isValidNumber(value) && value >= -180 && value <= 180;
}

// Converts query day filters into a safe known value.
export function getDayFilter(value: unknown): DayFilter {
	if (value === "today" || value === "tomorrow" || value === "week") {
		return value;
	}

	return "all";
}

// Narrows unknown payload values to allowed event formats.
export function isEventFormat(value: unknown): value is EventFormat {
	return value === "1v1" || value === "team";
}

// Converts query event format filters into a safe known value.
export function getEventFormatFilter(value: unknown): EventFormatFilter {
	if (isEventFormat(value)) {
		return value;
	}

	return "all";
}

// Returns a trimmed string or null for optional DB fields.
export function getOptionalStringValue(value: unknown) {
	if (!isValidString(value)) {
		return null;
	}

	const stringValue = value as string;
	return stringValue.trim();
}

// Returns a number or null for optional DB numeric fields.
export function getOptionalNumberValue(value: unknown) {
	if (!isValidNumber(value)) {
		return null;
	}

	return value;
}

// Validates the create/update event body and returns the first user-facing error.
export function getRequiredEventFieldsError(body: {
	current_clerk_user_id?: unknown;
	sport_name?: unknown;
	event_name?: unknown;
	available_date?: unknown;
	time_from?: unknown;
	location_name?: unknown;
	latitude?: unknown;
	longitude?: unknown;
	max_participants?: unknown;
	event_format?: unknown;
}) {
	if (
		!isValidString(body.current_clerk_user_id) ||
		!isValidString(body.sport_name) ||
		!isValidString(body.event_name) ||
		!isValidString(body.available_date) ||
		!isValidString(body.time_from) ||
		!isValidString(body.location_name) ||
		!isValidLatitude(body.latitude) ||
		!isValidLongitude(body.longitude) ||
		!isValidNumber(body.max_participants)
	) {
		return "Missing required event fields.";
	}

	if (!isEventFormat(body.event_format)) {
		return "Event format must be 1v1 or team.";
	}

	if (!isValidNumber(body.max_participants)) {
		return "Missing required event fields.";
	}

	const maxParticipants = body.max_participants as number;
	const eventFormat = body.event_format;

	if (eventFormat === "1v1" && maxParticipants !== 2) {
		return "1v1 events must have exactly 2 participants.";
	}

	if (maxParticipants < 2 || maxParticipants > 100) {
		return "Max participants must be between 2 and 100.";
	}

	return null;
}
