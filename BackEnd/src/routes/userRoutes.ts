import express from "express";
import { sql } from "../config/db";

const router = express.Router();

router.get("/:clerkUserId", async (req, res) => {
  try {
    const { clerkUserId } = req.params;

    console.log("🔍 Getting user profile:", clerkUserId);

    const users = await sql`
      SELECT *
      FROM users
      WHERE clerk_user_id = ${clerkUserId}
    `;

    if (users.length === 0) {
      console.log("❌ User not found:", clerkUserId);

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

    console.log("✅ User profile loaded:", {
      user: users[0],
      sports: userSports,
      languages: userLanguages,
    });

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
    console.log("📥 Incoming user data:");
    console.log(req.body);

    const {
      clerk_user_id,
      email,
      first_name,
      last_name,
      nickname,
      about_me,
      age,
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
      !clerk_user_id ||
      !email ||
      !first_name ||
      !last_name ||
      !nickname ||
      !about_me ||
      !age ||
      !sex ||
      !country ||
      !city ||
      !avatar_url ||
      !sports ||
      !languages ||
      !Array.isArray(sports) ||
      !Array.isArray(languages) ||
      sports.length === 0 ||
      languages.length === 0
    ) {
      console.log("❌ Validation failed:", {
        clerk_user_id,
        email,
        first_name,
        last_name,
        nickname,
        about_me,
        age,
        sex,
        country,
        city,
        avatar_url,
        sports,
        languages,
      });

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
        age,
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
        ${first_name},
        ${last_name},
        ${nickname},
        ${about_me},
        ${age},
        ${sex},
        ${country},
        ${city},
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
        age = EXCLUDED.age,
        sex = EXCLUDED.sex,
        country = EXCLUDED.country,
        city = EXCLUDED.city,
        avatar_url = EXCLUDED.avatar_url,
        latitude = EXCLUDED.latitude,
        longitude = EXCLUDED.longitude,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;

    const savedUser = users[0];

    console.log("💾 Saved user in DB:");
    console.log(savedUser);

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
    const savedSports = await sql`
      SELECT sport_name, level
      FROM user_sports
      WHERE user_id = ${savedUser.id}
      ORDER BY sport_name ASC
    `;


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

    const savedLanguages = await sql`
      SELECT language
      FROM user_languages
      WHERE user_id = ${savedUser.id}
      ORDER BY language ASC
    `;

    console.log("🏀 Saved sports:");
    console.log(savedSports);

    console.log("🌍 Saved languages:");
    console.log(savedLanguages);

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

/**
 const clerkUserId = req.params.clerkUserId;

 if URL		/api/users/user_123

 clerkUserId = "user_123"

 ====

			same
const { clerkUserId } = req.params;
 */
