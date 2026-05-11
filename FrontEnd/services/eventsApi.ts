import {
  CreateSportEventParams,
  EventDayFilter,
  LoadSportEventsParams,
  SportEvent,
} from "../types/events";

const API_URL = "http://192.168.32.127:5001";

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
