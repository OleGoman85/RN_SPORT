import express from "express";
import { sql } from "../config/db";

const router = express.Router();

type DayFilter = "all" | "today" | "tomorrow" | "week";

function isValidString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidNumber(value: unknown) {
  return typeof value === "number" && !Number.isNaN(value);
}

function getDayFilter(value: unknown): DayFilter {
  if (value === "today" || value === "tomorrow" || value === "week") {
    return value;
  }

  return "all";
}

router.get("/events", async (req, res) => {
  try {
    const dayFilter = getDayFilter(req.query.day);
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const sport = typeof req.query.sport === "string" ? req.query.sport.trim() : "";
    const latitude = Number(req.query.latitude);
    const longitude = Number(req.query.longitude);
    const hasCoordinates = !Number.isNaN(latitude) && !Number.isNaN(longitude);

    const events = await sql`
      SELECT
        sport_events.id,
        sport_events.sport_name,
        sport_events.event_name,
        sport_events.event_description,
        sport_events.available_date,
        sport_events.time_from,
        sport_events.location_name,
        sport_events.city AS event_city,
        sport_events.latitude AS event_latitude,
        sport_events.longitude AS event_longitude,
        sport_events.max_participants,
        sport_events.current_participants,
        sport_events.event_image_url,
        sport_events.created_at,
        users.clerk_user_id,
        users.first_name,
        users.last_name,
        users.nickname,
        users.about_me,
        users.age,
        users.sex,
        users.country,
        users.city,
        users.avatar_url,
        users.rating_avg,
        users.rating_count,
        users.games_count,
        CASE
          WHEN ${hasCoordinates} = TRUE
          AND sport_events.latitude IS NOT NULL
          AND sport_events.longitude IS NOT NULL
          THEN (
            6371 * acos(
              LEAST(
                1,
                GREATEST(
                  -1,
                  cos(radians(${hasCoordinates ? latitude : 0}))
                  * cos(radians(sport_events.latitude::float))
                  * cos(radians(sport_events.longitude::float) - radians(${hasCoordinates ? longitude : 0}))
                  + sin(radians(${hasCoordinates ? latitude : 0}))
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
      AND (${sport} = '' OR LOWER(sport_events.sport_name) = LOWER(${sport}))
      AND (
        ${search} = ''
        OR LOWER(sport_events.sport_name) LIKE LOWER(${'%' + search + '%'})
        OR LOWER(sport_events.event_name) LIKE LOWER(${'%' + search + '%'})
      )
      AND (
        ${dayFilter} = 'all'
        OR (${dayFilter} = 'today' AND sport_events.available_date = CURRENT_DATE)
        OR (${dayFilter} = 'tomorrow' AND sport_events.available_date = CURRENT_DATE + INTERVAL '1 day')
        OR (
          ${dayFilter} = 'week'
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

    return res.status(200).json({ events });
  } catch (error) {
    console.log("Error loading events", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/events", async (req, res) => {
  try {
    const {
      current_clerk_user_id,
      sport_name,
      event_name,
      event_description,
      available_date,
      time_from,
      location_name,
      city,
      latitude,
      longitude,
      max_participants,
      event_image_url,
    } = req.body;

    if (
      !isValidString(current_clerk_user_id) ||
      !isValidString(sport_name) ||
      !isValidString(event_name) ||
      !isValidString(available_date) ||
      !isValidString(time_from) ||
      !isValidString(location_name) ||
      !isValidNumber(max_participants)
    ) {
      return res.status(400).json({ message: "Missing required event fields." });
    }

    if (max_participants < 1 || max_participants > 100) {
      return res.status(400).json({ message: "Max participants must be between 1 and 100." });
    }

    const users = await sql`
      SELECT id
      FROM users
      WHERE clerk_user_id = ${current_clerk_user_id}
    `;

    if (users.length === 0) {
      return res.status(404).json({ message: "Current user profile was not found." });
    }

    const createdEvents = await sql`
      INSERT INTO sport_events (
        user_id,
        sport_name,
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
        ${users[0].id},
        ${sport_name.trim()},
        ${event_name.trim()},
        ${isValidString(event_description) ? event_description.trim() : null},
        ${available_date}::date,
        ${time_from}::time,
        ${location_name.trim()},
        ${isValidString(city) ? city.trim() : null},
        ${isValidNumber(latitude) ? latitude : null},
        ${isValidNumber(longitude) ? longitude : null},
        ${max_participants},
        1,
        ${isValidString(event_image_url) ? event_image_url.trim() : null},
        TRUE
      )
      RETURNING *
    `;

    await sql`
      INSERT INTO sport_event_members (event_id, user_id)
      VALUES (${createdEvents[0].id}, ${users[0].id})
      ON CONFLICT (event_id, user_id)
      DO NOTHING
    `;

    return res.status(201).json({ event: createdEvents[0] });
  } catch (error) {
    console.log("Error creating event", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/events/:eventId/join", async (req, res) => {
  try {
    const numericEventId = Number(req.params.eventId);
    const { current_clerk_user_id } = req.body;

    if (Number.isNaN(numericEventId)) {
      return res.status(400).json({ message: "Invalid event id." });
    }

    if (!isValidString(current_clerk_user_id)) {
      return res.status(400).json({ message: "Current user id is required." });
    }

    const users = await sql`
      SELECT id
      FROM users
      WHERE clerk_user_id = ${current_clerk_user_id}
    `;

    if (users.length === 0) {
      return res.status(404).json({ message: "Current user profile was not found." });
    }

    const events = await sql`
      SELECT id, user_id, max_participants, current_participants
      FROM sport_events
      WHERE id = ${numericEventId}
      AND is_active = TRUE
    `;

    if (events.length === 0) {
      return res.status(404).json({ message: "Event was not found." });
    }

    if (events[0].user_id === users[0].id) {
      return res.status(400).json({ message: "You are already the creator of this event." });
    }

    if (events[0].current_participants >= events[0].max_participants) {
      return res.status(400).json({ message: "This event is full." });
    }

    const insertedMembers = await sql`
      INSERT INTO sport_event_members (event_id, user_id)
      VALUES (${numericEventId}, ${users[0].id})
      ON CONFLICT (event_id, user_id)
      DO NOTHING
      RETURNING *
    `;

    if (insertedMembers.length > 0) {
      await sql`
        UPDATE sport_events
        SET current_participants = current_participants + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${numericEventId}
      `;
    }

    const updatedEvents = await sql`
      SELECT
        sport_events.id,
        sport_events.sport_name,
        sport_events.event_name,
        sport_events.event_description,
        sport_events.available_date,
        sport_events.time_from,
        sport_events.location_name,
        sport_events.city AS event_city,
        sport_events.latitude AS event_latitude,
        sport_events.longitude AS event_longitude,
        sport_events.max_participants,
        sport_events.current_participants,
        sport_events.event_image_url,
        sport_events.created_at,
        users.clerk_user_id,
        users.first_name,
        users.last_name,
        users.nickname,
        users.about_me,
        users.age,
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
      WHERE sport_events.id = ${numericEventId}
    `;

    return res.status(200).json({ event: updatedEvents[0] });
  } catch (error) {
    console.log("Error joining event", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/events/:eventId", async (req, res) => {
  try {
    const numericEventId = Number(req.params.eventId);
    const { current_clerk_user_id } = req.body;

    if (Number.isNaN(numericEventId)) {
      return res.status(400).json({ message: "Invalid event id." });
    }

    if (!isValidString(current_clerk_user_id)) {
      return res.status(400).json({ message: "Current user id is required." });
    }

    const users = await sql`
      SELECT id
      FROM users
      WHERE clerk_user_id = ${current_clerk_user_id}
    `;

    if (users.length === 0) {
      return res.status(404).json({ message: "Current user profile was not found." });
    }

    const deletedEvents = await sql`
      UPDATE sport_events
      SET is_active = FALSE,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${numericEventId}
      AND user_id = ${users[0].id}
      RETURNING *
    `;

    if (deletedEvents.length === 0) {
      return res.status(404).json({ message: "Event was not found or you are not the creator." });
    }

    return res.status(200).json({ event: deletedEvents[0] });
  } catch (error) {
    console.log("Error deleting event", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
