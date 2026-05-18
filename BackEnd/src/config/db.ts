import { neon } from '@neondatabase/serverless'
import 'dotenv/config'

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
	throw new Error('DATABASE_URL is missing in .env')
}

export const sql = neon(databaseUrl)

export async function initDB() {
	try {
		await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        clerk_user_id TEXT UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,

        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        nickname VARCHAR(100) NOT NULL,

        about_me TEXT,

        date_of_birth DATE NOT NULL,
        sex VARCHAR(20) NOT NULL,

        country VARCHAR(100) NOT NULL,
        city VARCHAR(100) NOT NULL,
        avatar_url TEXT NOT NULL,

        latitude DECIMAL(9,6),
        longitude DECIMAL(9,6),

        rating_avg DECIMAL(3,2) NOT NULL DEFAULT 0,
        rating_count INT NOT NULL DEFAULT 0,
        games_count INT NOT NULL DEFAULT 0,

        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT users_sex_check
          CHECK (sex IN ('Male', 'Female'))
      )
    `

		await sql`
	   CREATE TABLE IF NOT EXISTS user_sports (
		 id SERIAL PRIMARY KEY,
		 user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
		 sport_name VARCHAR(100) NOT NULL,
		 level VARCHAR(50) NOT NULL DEFAULT 'Beginner',
		 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
		 UNIQUE(user_id, sport_name),
		 CONSTRAINT user_sports_level_check
		 CHECK (level IN ('Beginner', 'Amateur', 'Professional'))
	  )
    `

		await sql`
      CREATE TABLE IF NOT EXISTS user_languages (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        language VARCHAR(50) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, language)
      )
    `

		await sql`
      CREATE TABLE IF NOT EXISTS sport_events (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,

        sport_name VARCHAR(100) NOT NULL,
        event_name VARCHAR(160) NOT NULL,
        event_description TEXT,

        available_date DATE NOT NULL,
        time_from TIME NOT NULL,

        location_name VARCHAR(180) NOT NULL,
        city VARCHAR(100),
        latitude DECIMAL(9,6),
        longitude DECIMAL(9,6),

        max_participants INT NOT NULL DEFAULT 2,
        current_participants INT NOT NULL DEFAULT 1,

        event_image_url TEXT,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,

        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT sport_events_max_participants_check
          CHECK (max_participants >= 2),

        CONSTRAINT sport_events_current_participants_check
          CHECK (
            current_participants >= 1
            AND current_participants <= max_participants
          )
      )
    `

		await sql`
      CREATE TABLE IF NOT EXISTS sport_event_members (
        id SERIAL PRIMARY KEY,
        event_id INT NOT NULL REFERENCES sport_events(id) ON DELETE CASCADE,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(event_id, user_id)
      )
    `

		await sql`
      CREATE INDEX IF NOT EXISTS index_sport_events_active_date
      ON sport_events (is_active, available_date, time_from)
    `

		await sql`
      CREATE INDEX IF NOT EXISTS index_sport_events_sport_name
      ON sport_events (sport_name)
    `

		await sql`
      CREATE INDEX IF NOT EXISTS index_sport_events_city
      ON sport_events (city)
    `

		await sql`
      CREATE INDEX IF NOT EXISTS index_sport_event_members_event_id
      ON sport_event_members (event_id)
    `

		await sql`
      CREATE INDEX IF NOT EXISTS index_sport_event_members_user_id
      ON sport_event_members (user_id)
    `

		console.log('Database initialized successfully')
	} catch (error) {
		console.log('Error initializing DB', error)
		process.exit(1)
	}
}
