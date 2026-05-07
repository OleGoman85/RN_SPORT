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
				rating_avg DECIMAL(3,2) NOT NULL DEFAULT 0,
				rating_count INT NOT NULL DEFAULT 0,
				games_count INT NOT NULL DEFAULT 0,
				created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
				updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
			)
		`;

		await sql`
			ALTER TABLE users
			ADD COLUMN IF NOT EXISTS rating_avg DECIMAL(3,2) NOT NULL DEFAULT 0
		`;

		await sql`
			ALTER TABLE users
			ADD COLUMN IF NOT EXISTS rating_count INT NOT NULL DEFAULT 0
		`;

		await sql`
			ALTER TABLE users
			ADD COLUMN IF NOT EXISTS games_count INT NOT NULL DEFAULT 0
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

		await sql`
			CREATE TABLE IF NOT EXISTS user_availability (
				id SERIAL PRIMARY KEY,
				user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
				sport_name VARCHAR(100) NOT NULL,
				available_date DATE NOT NULL,
				time_from TIME NOT NULL,
				time_to TIME NOT NULL,
				match_type VARCHAR(50) NOT NULL DEFAULT 'Any',
				created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
			)
		`;

		await sql`
			CREATE TABLE IF NOT EXISTS sport_events (
				id SERIAL PRIMARY KEY,
				user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
				sport_name VARCHAR(100) NOT NULL,
				level VARCHAR(50) NOT NULL,
				available_date DATE NOT NULL,
				time_from TIME NOT NULL,
				time_to TIME NOT NULL,
				match_type VARCHAR(50) NOT NULL DEFAULT 'Any',
				location_mode VARCHAR(50) NOT NULL,
				radius_km INT,
				city VARCHAR(100),
				latitude DECIMAL(9,6),
				longitude DECIMAL(9,6),
				is_active BOOLEAN NOT NULL DEFAULT TRUE,
				created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
			)
		`;

		await sql`
			CREATE TABLE IF NOT EXISTS user_ratings (
				id SERIAL PRIMARY KEY,
				rated_user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
				rater_user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
				stars INT NOT NULL,
				reliable BOOLEAN NOT NULL DEFAULT FALSE,
				friendly BOOLEAN NOT NULL DEFAULT FALSE,
				fair_play BOOLEAN NOT NULL DEFAULT FALSE,
				comment TEXT,
				created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
				UNIQUE(rated_user_id, rater_user_id)
			)
		`;

		await sql`
			CREATE UNIQUE INDEX IF NOT EXISTS unique_user_availability
			ON user_availability (
				user_id,
				sport_name,
				available_date,
				time_from,
				time_to,
				match_type
			)
		`;

		console.log("Database initialized successfully");
	} catch (error) {
		console.log("Error initializing DB", error);
		process.exit(1);
	}
}
