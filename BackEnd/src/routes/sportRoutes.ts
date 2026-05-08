import express from "express";
import { sql } from "../config/db";

const router = express.Router();

function isValidString(value: unknown) {
	return typeof value === "string" && value.trim().length > 0;
}

function isValidNumber(value: unknown) {
	return typeof value === "number" && !Number.isNaN(value);
}

function isValidStringArray(value: unknown) {
	return (
		Array.isArray(value) &&
		value.length > 0 &&
		value.every((item) => typeof item === "string")
	);
}

router.get("/events", async (req, res) => {
	try {
		const events = await sql`
			SELECT
				sport_events.id,
				sport_events.user_id,
				sport_events.sport_name,
				sport_events.level,
				sport_events.available_date,
				sport_events.time_from,
				sport_events.time_to,
				sport_events.match_type,
				sport_events.location_mode,
				sport_events.radius_km,
				sport_events.city AS event_city,
				sport_events.latitude AS event_latitude,
				sport_events.longitude AS event_longitude,
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
				users.avatar_url
			FROM sport_events

			INNER JOIN users
				ON users.id = sport_events.user_id

			WHERE sport_events.is_active = TRUE
			AND sport_events.available_date >= CURRENT_DATE

			ORDER BY
				sport_events.available_date ASC,
				sport_events.time_from ASC,
				sport_events.created_at DESC
		`;

		return res.status(200).json({
			events,
		});
	} catch (error) {
		console.log("Error loading events", error);

		return res.status(500).json({
			message: "Internal server error",
		});
	}
});

router.put("/events/:eventId", async (req, res) => {
	try {
		const { eventId } = req.params;

		const {
			current_clerk_user_id,
			available_date,
			time_from,
			time_to,
			match_type,
			location_mode,
			radius_km,
			city,
			latitude,
			longitude,
		} = req.body;

		if (!isValidString(current_clerk_user_id)) {
			return res.status(400).json({
				message: "Current user id is required.",
			});
		}

		if (
			!isValidString(available_date) ||
			!isValidString(time_from) ||
			!isValidString(time_to) ||
			!isValidString(match_type) ||
			!isValidString(location_mode)
		) {
			return res.status(400).json({
				message: "Missing required event fields.",
			});
		}

		if (location_mode !== "near_me" && location_mode !== "city") {
			return res.status(400).json({
				message: "Invalid location mode.",
			});
		}

		if (location_mode === "city" && !isValidString(city)) {
			return res.status(400).json({
				message: "City is required.",
			});
		}

		const currentUsers = await sql`
			SELECT id
			FROM users
			WHERE clerk_user_id = ${current_clerk_user_id}
		`;

		if (currentUsers.length === 0) {
			return res.status(404).json({
				message: "Current user profile was not found.",
			});
		}

		const currentUserId = currentUsers[0].id;

		const updatedEvents = await sql`
			UPDATE sport_events
			SET
				available_date = ${available_date}::date,
				time_from = ${time_from}::time,
				time_to = ${time_to}::time,
				match_type = ${match_type},
				location_mode = ${location_mode},
				radius_km = ${radius_km},
				city = ${city},
				latitude = ${latitude},
				longitude = ${longitude}
			WHERE id = ${Number(eventId)}
			AND user_id = ${currentUserId}
			AND is_active = TRUE
			RETURNING *
		`;

		if (updatedEvents.length === 0) {
			return res.status(404).json({
				message: "Event was not found or you are not allowed to edit it.",
			});
		}

		return res.status(200).json({
			event: updatedEvents[0],
		});
	} catch (error) {
		console.log("Error updating event", error);

		return res.status(500).json({
			message: "Internal server error",
		});
	}
});

router.delete("/events/:eventId", async (req, res) => {
	try {
		const { eventId } = req.params;
		const { current_clerk_user_id } = req.body;

		if (!isValidString(current_clerk_user_id)) {
			return res.status(400).json({
				message: "Current user id is required.",
			});
		}

		const currentUsers = await sql`
			SELECT id
			FROM users
			WHERE clerk_user_id = ${current_clerk_user_id}
		`;

		if (currentUsers.length === 0) {
			return res.status(404).json({
				message: "Current user profile was not found.",
			});
		}

		const currentUserId = currentUsers[0].id;

		const deletedEvents = await sql`
			UPDATE sport_events
			SET is_active = FALSE
			WHERE id = ${Number(eventId)}
			AND user_id = ${currentUserId}
			AND is_active = TRUE
			RETURNING *
		`;

		if (deletedEvents.length === 0) {
			return res.status(404).json({
				message: "Event was not found or you are not allowed to delete it.",
			});
		}

		return res.status(200).json({
			message: "Event deleted successfully.",
		});
	} catch (error) {
		console.log("Error deleting event", error);

		return res.status(500).json({
			message: "Internal server error",
		});
	}
});

router.post("/search-opponents", async (req, res) => {
	try {
		console.log("🔎 Incoming opponent search filters:");
		console.log(req.body);

		const {
			current_clerk_user_id,
			sportName,
			level,
			languages,
			ageMin,
			ageMax,
			sex,
			locationMode,
			radiusKm,
			city,
			latitude,
			longitude,
			dates,
			timeFrom,
			timeTo,
			matchType,
			publishToEvents,
		} = req.body;

		if (
			!isValidString(current_clerk_user_id) ||
			!isValidString(sportName) ||
			!isValidString(level) ||
			!Array.isArray(languages) ||
			!Array.isArray(sex) ||
			!isValidNumber(ageMin) ||
			!isValidNumber(ageMax) ||
			!isValidString(locationMode) ||
			!isValidStringArray(dates) ||
			!isValidString(timeFrom) ||
			!isValidString(timeTo) ||
			!isValidString(matchType)
		) {
			return res.status(400).json({
				message: "Missing required search filters.",
			});
		}

		if (locationMode !== "near_me" && locationMode !== "city") {
			return res.status(400).json({
				message: "Invalid location mode.",
			});
		}

		if (locationMode === "city" && !isValidString(city)) {
			return res.status(400).json({
				message: "City is required for city search.",
			});
		}

		if (
			locationMode === "near_me" &&
			(!isValidNumber(latitude) ||
				!isValidNumber(longitude) ||
				!isValidNumber(radiusKm))
		) {
			return res.status(400).json({
				message: "Latitude, longitude and radius are required.",
			});
		}

		const currentUsers = await sql`
			SELECT id
			FROM users
			WHERE clerk_user_id = ${current_clerk_user_id}
		`;

		if (currentUsers.length === 0) {
			return res.status(404).json({
				message: "Current user profile was not found.",
			});
		}

		const currentUserId = currentUsers[0].id;

		for (const date of dates) {
			await sql`
				INSERT INTO user_availability (
					user_id,
					sport_name,
					available_date,
					time_from,
					time_to,
					match_type
				)
				VALUES (
					${currentUserId},
					${sportName},
					${date}::date,
					${timeFrom}::time,
					${timeTo}::time,
					${matchType}
				)
				ON CONFLICT (
					user_id,
					sport_name,
					available_date,
					time_from,
					time_to,
					match_type
				)
				DO NOTHING
			`;

			if (publishToEvents === true) {
				await sql`
					INSERT INTO sport_events (
						user_id,
						sport_name,
						level,
						available_date,
						time_from,
						time_to,
						match_type,
						location_mode,
						radius_km,
						city,
						latitude,
						longitude
					)
					VALUES (
						${currentUserId},
						${sportName},
						${level},
						${date}::date,
						${timeFrom}::time,
						${timeTo}::time,
						${matchType},
						${locationMode},
						${radiusKm},
						${city},
						${latitude},
						${longitude}
					)
				`;
			}
		}

		const searchLevel = level === "Any" ? null : level;
		const searchLanguages = languages.includes("Any") ? [] : languages;
		const searchMatchType = matchType === "Any" ? null : matchType;

		const eventOpponents = await sql`
			SELECT DISTINCT
				users.id,
				users.clerk_user_id,
				users.email,
				users.first_name,
				users.last_name,
				users.nickname,
				users.about_me,
				users.age,
				users.sex,
				users.country,
				users.city,
				users.avatar_url,
				users.latitude,
				users.longitude,
				user_sports.sport_name,
				user_sports.level,
				user_availability.available_date,
				user_availability.time_from,
				user_availability.time_to,
				user_availability.match_type,
				'event' AS match_source,

				CASE
					WHEN ${locationMode} = 'near_me'
					AND users.latitude IS NOT NULL
					AND users.longitude IS NOT NULL
					THEN (
						6371 * acos(
							LEAST(
								1,
								GREATEST(
									-1,
									cos(radians(${latitude}))
									* cos(radians(users.latitude::float))
									* cos(radians(users.longitude::float) - radians(${longitude}))
									+ sin(radians(${latitude}))
									* sin(radians(users.latitude::float))
								)
							)
						)
					)
					ELSE NULL
				END AS distance_km

			FROM users

			INNER JOIN user_sports
				ON user_sports.user_id = users.id

			INNER JOIN user_availability
				ON user_availability.user_id = users.id
				AND user_availability.sport_name = ${sportName}

			LEFT JOIN user_languages
				ON user_languages.user_id = users.id

			WHERE users.clerk_user_id != ${current_clerk_user_id}

			AND user_sports.sport_name = ${sportName}

			AND (
				${searchLevel}::text IS NULL
				OR user_sports.level = ${searchLevel}
			)

			AND users.age >= ${ageMin}
			AND users.age <= ${ageMax}

			AND users.sex = ANY(${sex})

			AND (
				${searchLanguages.length}::int = 0
				OR user_languages.language = ANY(${searchLanguages})
			)

			AND user_availability.available_date = ANY(${dates}::date[])

			AND user_availability.time_from <= ${timeTo}::time
			AND user_availability.time_to >= ${timeFrom}::time

			AND (
				${searchMatchType}::text IS NULL
				OR user_availability.match_type = 'Any'
				OR user_availability.match_type = ${searchMatchType}
			)

			AND (
				${locationMode} != 'city'
				OR LOWER(users.city) = LOWER(${city})
			)

			AND (
				${locationMode} != 'near_me'
				OR (
					users.latitude IS NOT NULL
					AND users.longitude IS NOT NULL
					AND (
						6371 * acos(
							LEAST(
								1,
								GREATEST(
									-1,
									cos(radians(${latitude}))
									* cos(radians(users.latitude::float))
									* cos(radians(users.longitude::float) - radians(${longitude}))
									+ sin(radians(${latitude}))
									* sin(radians(users.latitude::float))
								)
							)
						)
					) <= ${radiusKm}
				)
			)
		`;

		const profileOpponents = await sql`
			SELECT DISTINCT
				users.id,
				users.clerk_user_id,
				users.email,
				users.first_name,
				users.last_name,
				users.nickname,
				users.about_me,
				users.age,
				users.sex,
				users.country,
				users.city,
				users.avatar_url,
				users.latitude,
				users.longitude,
				user_sports.sport_name,
				user_sports.level,
				NULL AS available_date,
				NULL AS time_from,
				NULL AS time_to,
				'Any' AS match_type,
				'profile' AS match_source,

				CASE
					WHEN ${locationMode} = 'near_me'
					AND users.latitude IS NOT NULL
					AND users.longitude IS NOT NULL
					THEN (
						6371 * acos(
							LEAST(
								1,
								GREATEST(
									-1,
									cos(radians(${latitude}))
									* cos(radians(users.latitude::float))
									* cos(radians(users.longitude::float) - radians(${longitude}))
									+ sin(radians(${latitude}))
									* sin(radians(users.latitude::float))
								)
							)
						)
					)
					ELSE NULL
				END AS distance_km

			FROM users

			INNER JOIN user_sports
				ON user_sports.user_id = users.id

			LEFT JOIN user_languages
				ON user_languages.user_id = users.id

			WHERE users.clerk_user_id != ${current_clerk_user_id}

			AND user_sports.sport_name = ${sportName}

			AND (
				${searchLevel}::text IS NULL
				OR user_sports.level = ${searchLevel}
			)

			AND users.age >= ${ageMin}
			AND users.age <= ${ageMax}

			AND users.sex = ANY(${sex})

			AND (
				${searchLanguages.length}::int = 0
				OR user_languages.language = ANY(${searchLanguages})
			)

			AND (
				${locationMode} != 'city'
				OR LOWER(users.city) = LOWER(${city})
			)

			AND (
				${locationMode} != 'near_me'
				OR (
					users.latitude IS NOT NULL
					AND users.longitude IS NOT NULL
					AND (
						6371 * acos(
							LEAST(
								1,
								GREATEST(
									-1,
									cos(radians(${latitude}))
									* cos(radians(users.latitude::float))
									* cos(radians(users.longitude::float) - radians(${longitude}))
									+ sin(radians(${latitude}))
									* sin(radians(users.latitude::float))
								)
							)
						)
					) <= ${radiusKm}
				)
			)

			AND NOT EXISTS (
				SELECT 1
				FROM user_availability
				WHERE user_availability.user_id = users.id
				AND user_availability.sport_name = ${sportName}
			)
		`;

		return res.status(200).json({
			eventOpponents,
			profileOpponents,
			opponents: [...eventOpponents, ...profileOpponents],
		});
	} catch (error) {
		console.log("Error searching opponents", error);

		return res.status(500).json({
			message: "Internal server error",
		});
	}
});

export default router;
