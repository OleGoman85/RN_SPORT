import express from "express";
import { sql } from "../config/db";

const router = express.Router();

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
		} = req.body;

		if (
			!current_clerk_user_id ||
			!sportName ||
			!Array.isArray(languages) ||
			!Array.isArray(sex) ||
			typeof ageMin !== "number" ||
			typeof ageMax !== "number"
		) {
			return res.status(400).json({
				message: "Missing required search filters.",
			});
		}

		const searchLanguages = languages.includes("Any") ? [] : languages;
		const searchLevel = level === "Any" ? null : level;

		const users = await sql`
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
		user_sports.level
		FROM users
		INNER JOIN user_sports
		ON user_sports.user_id = users.id
		LEFT JOIN user_languages
		ON user_languages.user_id = users.id
		WHERE users.clerk_user_id != ${current_clerk_user_id}
		AND user_sports.sport_name = ${sportName}
		AND (${searchLevel}::text IS NULL OR user_sports.level = ${searchLevel})
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
			AND ${latitude}::float IS NOT NULL
			AND ${longitude}::float IS NOT NULL
			AND (
				6371 * acos(
				cos(radians(${latitude}))
				* cos(radians(users.latitude::float))
				* cos(radians(users.longitude::float) - radians(${longitude}))
				+ sin(radians(${latitude}))
				* sin(radians(users.latitude::float))
				)
			) <= ${radiusKm}
			)
		)
		ORDER BY users.nickname ASC
	`;

		console.log("✅ Found opponents:");
		console.log(users);

		return res.status(200).json({
			opponents: users,
		});
	} catch (error) {
		console.log("Error searching opponents", error);

		return res.status(500).json({
			message: "Internal server error",
		});
	}
});

export default router;
