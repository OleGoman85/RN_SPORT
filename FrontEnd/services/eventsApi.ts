// Frontend API service for public events, event details, My Events, and joining.
import {
  CreateSportEventParams,
  EventDayFilter,
  EventDetails,
  EventFormatFilter,
  EventRadiusFilter,
  LoadSportEventsParams,
  SportEvent,
  UpdateSportEventParams,
} from "../types/events";
import { API_URL } from "./apiConfig";

// Converts event filters from the UI into URL query parameters.
function buildEventsQuery(params: LoadSportEventsParams = {}) {
  const query = new URLSearchParams();

  if (params.day && params.day !== "all") {
    query.set("day", params.day);
  }

  if (params.search?.trim()) {
    query.set("search", params.search.trim());
  }

  if (params.sport?.trim()) {
    query.set("sport", params.sport.trim());
  }

  if (params.eventFormat && params.eventFormat !== "all") {
    query.set("event_format", params.eventFormat);
  }

  if (typeof params.radiusKm === "number") {
    query.set("radius_km", String(params.radiusKm));
  }

  if (
    typeof params.latitude === "number" &&
    typeof params.longitude === "number"
  ) {
    query.set("latitude", String(params.latitude));
    query.set("longitude", String(params.longitude));
  }

  const queryString = query.toString();

  return queryString ? `?${queryString}` : "";
}

// Reads backend JSON safely, including empty responses and plain-text errors.
async function readJsonResponse(response: Response) {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(text);
  }
}

export const eventDayFilters: {
  label: string;
  value: EventDayFilter;
}[] = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Today",
    value: "today",
  },
  {
    label: "Tomorrow",
    value: "tomorrow",
  },
  {
    label: "This Week",
    value: "week",
  },
];

export const eventFormatFilters: {
  label: string;
  value: EventFormatFilter;
}[] = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "1v1",
    value: "1v1",
  },
  {
    label: "Team",
    value: "team",
  },
];

export const eventRadiusFilters: {
  label: string;
  value: EventRadiusFilter;
}[] = [
  {
    label: "5 km",
    value: 5,
  },
  {
    label: "10 km",
    value: 10,
  },
  {
    label: "25 km",
    value: 25,
  },
  {
    label: "50 km",
    value: 50,
  },
  {
    label: "All",
    value: "all",
  },
];

// Loads public events for Home/Events screens with optional filters.
export async function loadSportEvents(
  params: LoadSportEventsParams = {},
): Promise<SportEvent[]> {
  const response = await fetch(
    `${API_URL}/api/sports/events${buildEventsQuery(params)}`,
  );

  const data = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(data.message ?? "Could not load events.");
  }

  return data.events ?? [];
}

// Loads one event with creator profile, event info, and joined members.
export async function loadSportEventDetails(
  eventId: number,
): Promise<EventDetails> {
  const response = await fetch(`${API_URL}/api/sports/events/${eventId}/details`);

  const data = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(data.message ?? "Could not load event details.");
  }

  return data as EventDetails;
}

// Loads active events created by the current user for the edit-event list.
export async function loadMySportEvents(
  currentClerkUserId: string,
): Promise<SportEvent[]> {
  const response = await fetch(
    `${API_URL}/api/sports/my-events/${currentClerkUserId}`,
  );

  const data = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(data.message ?? "Could not load your events.");
  }

  return data.events ?? [];
}

// Sends create-event form data to the backend and returns the created event.
export async function createSportEvent(
  params: CreateSportEventParams,
): Promise<SportEvent> {
  const response = await fetch(`${API_URL}/api/sports/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  const data = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(data.message ?? "Could not create event.");
  }

  return data.event;
}

// Sends edited event data to the backend and returns the updated event.
export async function updateSportEvent(
  eventId: number,
  params: UpdateSportEventParams,
): Promise<SportEvent> {
  const response = await fetch(`${API_URL}/api/sports/events/${eventId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  const data = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(data.message ?? "Could not update event.");
  }

  return data.event;
}

// Soft-deletes one event owned by the current user.
export async function deleteSportEvent(
  eventId: number,
  currentClerkUserId: string,
): Promise<SportEvent> {
  const response = await fetch(`${API_URL}/api/sports/events/${eventId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      current_clerk_user_id: currentClerkUserId,
    }),
  });

  const data = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(data.message ?? "Could not delete event.");
  }

  return data.event;
}

// Adds the current user as a participant of one event.
export async function joinSportEvent(
  eventId: number,
  currentClerkUserId: string,
): Promise<SportEvent> {
  const response = await fetch(`${API_URL}/api/sports/events/${eventId}/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      current_clerk_user_id: currentClerkUserId,
    }),
  });

  const data = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(data.message ?? "Could not join event.");
  }

  return data.event;
}
