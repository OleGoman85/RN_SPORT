import express from "express";
import { sql } from "../config/db";

const router = express.Router();

function isValidString(value: unknown) {
	return typeof value === "string" && value.trim().length > 0;
}

function isValidDateString(value: unknown) {
	if (!isValidString(value)) {
		return false;
	}

	const date = new Date(value as string);

	return !Number.isNaN(date.getTime());
}

function getOptionalString(value: unknown) {
	if (typeof value !== "string") {
		return null;
	}

	const trimmedValue = value.trim();

	return trimmedValue.length > 0 ? trimmedValue : null;
}

router.get("/:clerkUserId", async (req, res) => {
	try {
		const { clerkUserId } = req.params;

		const users = await sql`
      SELECT
        id,
        clerk_user_id,
        email,
        first_name,
        last_name,
        nickname,
        about_me,
        TO_CHAR(date_of_birth, 'YYYY-MM-DD') AS date_of_birth,
        sex,
        country,
        city,
        avatar_url,
        latitude,
        longitude,
        rating_avg,
        rating_count,
        games_count,
        created_at,
        updated_at
      FROM users
      WHERE clerk_user_id = ${clerkUserId}
    `;

		if (users.length === 0) {
			return res.status(404).json({
				message: "User not found",
			});
		}

		const userSports = await sql`
      SELECT sport_name, level
      FROM user_sports
      WHERE user_id = ${users[0].id}
      ORDER BY sport_name ASC
    `;

		const userLanguages = await sql`
      SELECT language
      FROM user_languages
      WHERE user_id = ${users[0].id}
      ORDER BY language ASC
    `;

		return res.status(200).json({
			...users[0],
			sports: userSports,
			languages: userLanguages,
		});
	} catch (error) {
		console.log("Error getting user", error);

		return res.status(500).json({
			message: "Internal server error",
		});
	}
});

router.post("/", async (req, res) => {
	try {
		const {
			clerk_user_id,
			email,
			first_name,
			last_name,
			nickname,
			about_me,
			date_of_birth,
			sex,
			country,
			city,
			avatar_url,
			latitude,
			longitude,
			sports,
			languages,
		} = req.body;

		if (
			!isValidString(clerk_user_id) ||
			!isValidString(email) ||
			!isValidString(first_name) ||
			!isValidString(last_name) ||
			!isValidString(nickname) ||
			!isValidDateString(date_of_birth) ||
			!isValidString(sex) ||
			!["Male", "Female"].includes(sex) ||
			!isValidString(country) ||
			!isValidString(city) ||
			!isValidString(avatar_url) ||
			!Array.isArray(sports) ||
			!Array.isArray(languages) ||
			sports.length === 0 ||
			languages.length === 0
		) {
			return res.status(400).json({
				message: "All required profile fields must be filled.",
			});
		}

		const users = await sql`
      INSERT INTO users (
        clerk_user_id,
        email,
        first_name,
        last_name,
        nickname,
        about_me,
        date_of_birth,
        sex,
        country,
        city,
        avatar_url,
        latitude,
        longitude,
        updated_at
      )
      VALUES (
        ${clerk_user_id},
        ${email},
        ${first_name.trim()},
        ${last_name.trim()},
        ${nickname.trim()},
        ${getOptionalString(about_me)},
        ${date_of_birth}::date,
        ${sex},
        ${country.trim()},
        ${city.trim()},
        ${avatar_url},
        ${latitude},
        ${longitude},
        CURRENT_TIMESTAMP
      )
      ON CONFLICT (clerk_user_id)
      DO UPDATE SET
        email = EXCLUDED.email,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        nickname = EXCLUDED.nickname,
        about_me = EXCLUDED.about_me,
        date_of_birth = EXCLUDED.date_of_birth,
        sex = EXCLUDED.sex,
        country = EXCLUDED.country,
        city = EXCLUDED.city,
        avatar_url = EXCLUDED.avatar_url,
        latitude = EXCLUDED.latitude,
        longitude = EXCLUDED.longitude,
        updated_at = CURRENT_TIMESTAMP
      RETURNING
        id,
        clerk_user_id,
        email,
        first_name,
        last_name,
        nickname,
        about_me,
        TO_CHAR(date_of_birth, 'YYYY-MM-DD') AS date_of_birth,
        sex,
        country,
        city,
        avatar_url,
        latitude,
        longitude,
        rating_avg,
        rating_count,
        games_count,
        created_at,
        updated_at
    `;

		const savedUser = users[0];

		await sql`
      DELETE FROM user_sports
      WHERE user_id = ${savedUser.id}
    `;

		await sql`
      DELETE FROM user_languages
      WHERE user_id = ${savedUser.id}
    `;

		for (const sport of sports) {
			if (!sport.sport_name || !sport.level) {
				continue;
			}

			await sql`
        INSERT INTO user_sports (
          user_id,
          sport_name,
          level
        )
        VALUES (
          ${savedUser.id},
          ${sport.sport_name},
          ${sport.level}
        )
      `;
		}

		for (const language of languages) {
			if (!language) {
				continue;
			}

			await sql`
        INSERT INTO user_languages (
          user_id,
          language
        )
        VALUES (
          ${savedUser.id},
          ${language}
        )
      `;
		}

		const savedSports = await sql`
      SELECT sport_name, level
      FROM user_sports
      WHERE user_id = ${savedUser.id}
      ORDER BY sport_name ASC
    `;

		const savedLanguages = await sql`
      SELECT language
      FROM user_languages
      WHERE user_id = ${savedUser.id}
      ORDER BY language ASC
    `;

		return res.status(200).json({
			...savedUser,
			sports: savedSports,
			languages: savedLanguages,
		});
	} catch (error) {
		console.log("Error saving user", error);

		return res.status(500).json({
			message: "Internal server error",
		});
	}
});

export default router;
