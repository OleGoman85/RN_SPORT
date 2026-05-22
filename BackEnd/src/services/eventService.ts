import { sql } from "../config/db";
import {
	DayFilter,
	EventFormat,
	EventFormatFilter,
	getOptionalNumberValue,
	getOptionalStringValue,
} from "../utils/eventValidation";

type EventPayload = {
	current_clerk_user_id: string;
	sport_name: string;
	event_format: EventFormat;
	event_name: string;
	event_description?: string | null;
	available_date: string;
	time_from: string;
	location_name: string;
	city?: string | null;
	latitude?: number | null;
	longitude?: number | null;
	max_participants: number;
	event_image_url?: string | null;
};

export async function getUserIdByClerkId(clerkUserId: string) {
	const users = await sql`
    SELECT id
    FROM users
    WHERE clerk_user_id = ${clerkUserId}
  `;

	return users[0]?.id ?? null;
}

export async function getEventById(eventId: number) {
	const events = await sql`
    SELECT
      sport_events.id,
      sport_events.user_id,
      sport_events.sport_name,
      sport_events.event_format,
      sport_events.event_name,
      sport_events.event_description,
      TO_CHAR(sport_events.available_date, 'YYYY-MM-DD') AS available_date,
      sport_events.time_from,
      sport_events.location_name,
      sport_events.city AS event_city,
      sport_events.latitude AS event_latitude,
      sport_events.longitude AS event_longitude,
      sport_events.max_participants,
      sport_events.current_participants,
      sport_events.event_image_url,
      sport_events.is_active,
      sport_events.created_at,
      sport_events.updated_at,

      users.clerk_user_id,
      users.first_name,
      users.last_name,
      users.nickname,
      users.about_me,
      TO_CHAR(users.date_of_birth, 'YYYY-MM-DD') AS date_of_birth,
      users.sex,
      users.country,
      users.city,
      users.avatar_url,
      users.rating_avg,
      users.rating_count,
      users.games_count,

      NULL AS distance_km
    FROM sport_events
    INNER JOIN users ON users.id = sport_events.user_id
    WHERE sport_events.id = ${eventId}
  `;

	return events[0] ?? null;
}

export async function getEventMembers(eventId: number) {
	return sql`
    SELECT
      users.id,
      users.clerk_user_id,
      users.nickname,
      users.first_name,
      users.last_name,
      users.avatar_url,
      users.city,
      users.rating_avg,
      users.rating_count,
      sport_event_members.created_at AS joined_at
    FROM sport_event_members
    INNER JOIN users ON users.id = sport_event_members.user_id
    WHERE sport_event_members.event_id = ${eventId}
    ORDER BY sport_event_members.created_at ASC
  `;
}

export async function getEventDetailsById(eventId: number) {
	const event = await getEventById(eventId);

	if (!event) {
		return null;
	}

	const members = await getEventMembers(eventId);

	const creatorStats = await sql`
    SELECT
      (
        SELECT COUNT(*)::int
        FROM sport_events
        WHERE user_id = ${event.user_id}
      ) AS events_created_count,
      (
        SELECT COUNT(*)::int
        FROM sport_event_members
        WHERE user_id = ${event.user_id}
      ) AS participated_events_count
  `;

	const creatorLanguages = await sql`
    SELECT language
    FROM user_languages
    WHERE user_id = ${event.user_id}
    ORDER BY language ASC
  `;

	const creatorSports = await sql`
    SELECT sport_name, level
    FROM user_sports
    WHERE user_id = ${event.user_id}
    ORDER BY sport_name ASC
  `;

	return {
		event,
		creator: {
			id: event.user_id,
			clerk_user_id: event.clerk_user_id,
			first_name: event.first_name,
			last_name: event.last_name,
			nickname: event.nickname,
			about_me: event.about_me,
			date_of_birth: event.date_of_birth,
			sex: event.sex,
			country: event.country,
			city: event.city,
			avatar_url: event.avatar_url,
			rating_avg: event.rating_avg,
			rating_count: event.rating_count,
			games_count: event.games_count,
			events_created_count: creatorStats[0]?.events_created_count ?? 0,
			participated_events_count:
				creatorStats[0]?.participated_events_count ?? 0,
			languages: creatorLanguages.map((item) => item.language),
			sports: creatorSports,
		},
		members,
	};
}

export async function getPublicEvents(params: {
	dayFilter: DayFilter;
	eventFormat: EventFormatFilter;
	search: string;
	sport: string;
	latitude: number;
	longitude: number;
	hasCoordinates: boolean;
}) {
	return sql`
    SELECT
      sport_events.id,
      sport_events.user_id,
      sport_events.sport_name,
      sport_events.event_format,
      sport_events.event_name,
      sport_events.event_description,
      TO_CHAR(sport_events.available_date, 'YYYY-MM-DD') AS available_date,
      sport_events.time_from,
      sport_events.location_name,
      sport_events.city AS event_city,
      sport_events.latitude AS event_latitude,
      sport_events.longitude AS event_longitude,
      sport_events.max_participants,
      sport_events.current_participants,
      sport_events.event_image_url,
      sport_events.is_active,
      sport_events.created_at,
      sport_events.updated_at,

      users.clerk_user_id,
      users.first_name,
      users.last_name,
      users.nickname,
      users.about_me,
      TO_CHAR(users.date_of_birth, 'YYYY-MM-DD') AS date_of_birth,
      users.sex,
      users.country,
      users.city,
      users.avatar_url,
      users.rating_avg,
      users.rating_count,
      users.games_count,

      CASE
        WHEN ${params.hasCoordinates} = TRUE
        AND sport_events.latitude IS NOT NULL
        AND sport_events.longitude IS NOT NULL
        THEN (
          6371 * acos(
            LEAST(
              1,
              GREATEST(
                -1,
                cos(radians(${params.hasCoordinates ? params.latitude : 0}))
                * cos(radians(sport_events.latitude::float))
                * cos(radians(sport_events.longitude::float) - radians(${params.hasCoordinates ? params.longitude : 0}))
                + sin(radians(${params.hasCoordinates ? params.latitude : 0}))
                * sin(radians(sport_events.latitude::float))
              )
            )
          )
        )
        ELSE NULL
      END AS distance_km
    FROM sport_events
    INNER JOIN users ON users.id = sport_events.user_id
    WHERE sport_events.is_active = TRUE
    AND sport_events.available_date >= CURRENT_DATE
    AND (${params.sport} = '' OR LOWER(sport_events.sport_name) = LOWER(${params.sport}))
    AND (${params.eventFormat} = 'all' OR sport_events.event_format = ${params.eventFormat})
    AND (
      ${params.search} = ''
      OR LOWER(sport_events.sport_name) LIKE LOWER(${"%" + params.search + "%"})
      OR LOWER(sport_events.event_name) LIKE LOWER(${"%" + params.search + "%"})
    )
    AND (
      ${params.dayFilter} = 'all'
      OR (${params.dayFilter} = 'today' AND sport_events.available_date = CURRENT_DATE)
      OR (${params.dayFilter} = 'tomorrow' AND sport_events.available_date = CURRENT_DATE + INTERVAL '1 day')
      OR (
        ${params.dayFilter} = 'week'
        AND sport_events.available_date >= CURRENT_DATE
        AND sport_events.available_date < CURRENT_DATE + INTERVAL '7 days'
      )
    )
    ORDER BY
      distance_km ASC NULLS LAST,
      sport_events.available_date ASC,
      sport_events.time_from ASC,
      sport_events.created_at DESC
  `;
}

export async function getMyEvents(clerkUserId: string) {
	return sql`
    SELECT
      sport_events.id,
      sport_events.user_id,
      sport_events.sport_name,
      sport_events.event_format,
      sport_events.event_name,
      sport_events.event_description,
      TO_CHAR(sport_events.available_date, 'YYYY-MM-DD') AS available_date,
      sport_events.time_from,
      sport_events.location_name,
      sport_events.city AS event_city,
      sport_events.latitude AS event_latitude,
      sport_events.longitude AS event_longitude,
      sport_events.max_participants,
      sport_events.current_participants,
      sport_events.event_image_url,
      sport_events.is_active,
      sport_events.created_at,
      sport_events.updated_at,

      users.clerk_user_id,
      users.first_name,
      users.last_name,
      users.nickname,
      users.about_me,
      TO_CHAR(users.date_of_birth, 'YYYY-MM-DD') AS date_of_birth,
      users.sex,
      users.country,
      users.city,
      users.avatar_url,
      users.rating_avg,
      users.rating_count,
      users.games_count,

      NULL AS distance_km
    FROM sport_events
    INNER JOIN users ON users.id = sport_events.user_id
    WHERE users.clerk_user_id = ${clerkUserId}
    AND sport_events.is_active = TRUE
    ORDER BY
      sport_events.available_date ASC,
      sport_events.time_from ASC,
      sport_events.updated_at DESC
  `;
}

export async function createEvent(payload: EventPayload, userId: number) {
	const createdEvents = await sql`
    INSERT INTO sport_events (
      user_id,
      sport_name,
      event_format,
      event_name,
      event_description,
      available_date,
      time_from,
      location_name,
      city,
      latitude,
      longitude,
      max_participants,
      current_participants,
      event_image_url,
      is_active
    )
    VALUES (
      ${userId},
      ${payload.sport_name.trim()},
      ${payload.event_format},
      ${payload.event_name.trim()},
      ${getOptionalStringValue(payload.event_description)},
      ${payload.available_date}::date,
      ${payload.time_from}::time,
      ${payload.location_name.trim()},
      ${getOptionalStringValue(payload.city)},
      ${getOptionalNumberValue(payload.latitude)},
      ${getOptionalNumberValue(payload.longitude)},
      ${payload.max_participants},
      1,
      ${getOptionalStringValue(payload.event_image_url)},
      TRUE
    )
    RETURNING id
  `;

	await sql`
    INSERT INTO sport_event_members (event_id, user_id)
    VALUES (${createdEvents[0].id}, ${userId})
    ON CONFLICT (event_id, user_id)
    DO NOTHING
  `;

	return getEventById(createdEvents[0].id);
}

export async function updateEvent(
	payload: EventPayload,
	eventId: number,
	userId: number,
) {
	const updatedEvents = await sql`
    UPDATE sport_events
    SET
      sport_name = ${payload.sport_name.trim()},
      event_format = ${payload.event_format},
      event_name = ${payload.event_name.trim()},
      event_description = ${getOptionalStringValue(payload.event_description)},
      available_date = ${payload.available_date}::date,
      time_from = ${payload.time_from}::time,
      location_name = ${payload.location_name.trim()},
      city = ${getOptionalStringValue(payload.city)},
      latitude = ${getOptionalNumberValue(payload.latitude)},
      longitude = ${getOptionalNumberValue(payload.longitude)},
      max_participants = ${payload.max_participants},
      event_image_url = ${getOptionalStringValue(payload.event_image_url)},
      is_active = TRUE,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${eventId}
    AND user_id = ${userId}
    AND is_active = TRUE
    RETURNING id
  `;

	if (updatedEvents.length === 0) {
		return null;
	}

	return getEventById(updatedEvents[0].id);
}

export async function softDeleteEvent(eventId: number, userId: number) {
	const deletedEvents = await sql`
    UPDATE sport_events
    SET is_active = FALSE,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ${eventId}
    AND user_id = ${userId}
    RETURNING id
  `;

	if (deletedEvents.length === 0) {
		return null;
	}

	return getEventById(deletedEvents[0].id);
}
