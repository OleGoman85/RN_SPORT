import { neon } from "@neondatabase/serverless";
import "dotenv/config";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
	throw new Error("DATABASE_URL is missing in .env");
}

export const sql = neon(databaseUrl);

export async function initDB() {
	try {
		await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        clerk_user_id TEXT UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        nickname VARCHAR(100),
        about_me TEXT,
        age INT,
        sex VARCHAR(20),
        country VARCHAR(100),
        city VARCHAR(100),
        avatar_url TEXT,
        latitude DECIMAL(9,6),
        longitude DECIMAL(9,6),
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `;

		await sql`
      CREATE TABLE IF NOT EXISTS user_sports (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        sport_name VARCHAR(100) NOT NULL,
        level VARCHAR(50) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, sport_name)
      )
    `;

		await sql`
      CREATE TABLE IF NOT EXISTS user_languages (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        language VARCHAR(50) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, language)
      )
    `;

		console.log("Database initialized successfully");
	} catch (error) {
		console.log("Error initializing DB", error);
		process.exit(1);
	}
}
