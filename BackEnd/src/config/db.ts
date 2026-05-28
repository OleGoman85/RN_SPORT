// Neon/Postgres connection and startup-time table/index initialization.
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
        event_format VARCHAR(20) NOT NULL DEFAULT 'team',
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
          ),

        CONSTRAINT sport_events_event_format_check
          CHECK (event_format IN ('1v1', 'team'))
      )
    `

		await sql`
      ALTER TABLE sport_events
      ADD COLUMN IF NOT EXISTS event_format VARCHAR(20) NOT NULL DEFAULT 'team'
    `

		await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'sport_events_event_format_check'
        ) THEN
          ALTER TABLE sport_events
          ADD CONSTRAINT sport_events_event_format_check
          CHECK (event_format IN ('1v1', 'team'));
        END IF;
      END;
      $$
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
      CREATE TABLE IF NOT EXISTS user_contacts (
        id SERIAL PRIMARY KEY,
        owner_user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        contact_user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(owner_user_id, contact_user_id),
        CONSTRAINT user_contacts_no_self_check
          CHECK (owner_user_id <> contact_user_id)
      )
    `

		await sql`
      CREATE TABLE IF NOT EXISTS chats (
        id SERIAL PRIMARY KEY,
        type VARCHAR(20) NOT NULL,
        event_id INT UNIQUE REFERENCES sport_events(id) ON DELETE CASCADE,
        private_key VARCHAR(80) UNIQUE,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT chats_type_check
          CHECK (type IN ('private', 'event')),

        CONSTRAINT chats_shape_check
          CHECK (
            (
              type = 'private'
              AND private_key IS NOT NULL
              AND event_id IS NULL
            )
            OR (
              type = 'event'
              AND event_id IS NOT NULL
              AND private_key IS NULL
            )
          )
      )
    `

		await sql`
      CREATE TABLE IF NOT EXISTS chat_participants (
        id SERIAL PRIMARY KEY,
        chat_id INT NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        last_read_at TIMESTAMP,
        archived_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(chat_id, user_id)
      )
    `

		await sql`
      ALTER TABLE chat_participants
      ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP
    `

		await sql`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id SERIAL PRIMARY KEY,
        chat_id INT NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
        sender_user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        message_text TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
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
      CREATE INDEX IF NOT EXISTS index_sport_events_event_format
      ON sport_events (event_format)
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

		await sql`
      CREATE INDEX IF NOT EXISTS index_user_contacts_owner_user_id
      ON user_contacts (owner_user_id)
    `

		await sql`
      CREATE INDEX IF NOT EXISTS index_user_contacts_contact_user_id
      ON user_contacts (contact_user_id)
    `

		await sql`
      CREATE INDEX IF NOT EXISTS index_chats_type_updated_at
      ON chats (type, updated_at DESC)
    `

		await sql`
      CREATE INDEX IF NOT EXISTS index_chat_participants_user_id
      ON chat_participants (user_id)
    `

		await sql`
      CREATE INDEX IF NOT EXISTS index_chat_participants_chat_id
      ON chat_participants (chat_id)
    `

		await sql`
      CREATE INDEX IF NOT EXISTS index_chat_participants_archived_at
      ON chat_participants (archived_at)
    `

		await sql`
      CREATE INDEX IF NOT EXISTS index_chat_messages_chat_id_created_at
      ON chat_messages (chat_id, created_at ASC)
    `

		console.log('Database initialized successfully')
	} catch (error) {
		console.log('Error initializing DB', error)
		process.exit(1)
	}
}
