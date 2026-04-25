

import {neon} from "@neondatabase/serverless"
import "dotenv/config"


// Create SQL connection using our DB URL
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is missing in .env");
}

export const sql = neon(databaseUrl);

export async function initDB() {
	try {
		// 1. USERS
		await sql`CREATE TABLE IF NOT EXISTS users (
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
			experience_level VARCHAR(50),
			latitude DECIMAL(9,6),
			longitude DECIMAL(9,6),
			created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
		)`

		// // 2. SPORTS (каталог спортов)
		// await sql`CREATE TABLE IF NOT EXISTS sports (
		// 	id SERIAL PRIMARY KEY,
		// 	name VARCHAR(100) UNIQUE NOT NULL,
		// 	image_url TEXT,
		// 	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
		// )`

		// // 3. LANGUAGES (каталог языков)
		// await sql`CREATE TABLE IF NOT EXISTS languages (
		// 	id SERIAL PRIMARY KEY,
		// 	name VARCHAR(100) UNIQUE NOT NULL
		// )`

		// // 4. USER_SPORTS (связка user ↔ sport)
		// await sql`CREATE TABLE IF NOT EXISTS user_sports (
		// 	id SERIAL PRIMARY KEY,
		// 	user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
		// 	sport_id INT NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
		// 	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
		// 	UNIQUE(user_id, sport_id)
		// )`

		// // 5. USER_LANGUAGES (связка user ↔ language)
		// await sql`CREATE TABLE IF NOT EXISTS user_languages (
		// 	id SERIAL PRIMARY KEY,
		// 	user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
		// 	language_id INT NOT NULL REFERENCES languages(id) ON DELETE CASCADE,
		// 	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
		// 	UNIQUE(user_id, language_id)
		// )`

		// // 6. SEED: добавляем спорт (если нет)
		// await sql`
		// 	INSERT INTO sports (name, image_url)
		// 	VALUES
		// 		('Football', '/images/football.jpg'),
		// 		('Basketball', '/images/basketball.jpg'),
		// 		('Tennis', '/images/tennis.jpg'),
		// 		('Cycling', '/images/cycling.jpg'),
		// 		('Boxing', '/images/boxing.jpg'),
		// 		('Badminton', '/images/badminton.jpg')
		// 	ON CONFLICT (name) DO NOTHING
		// `

		// // 7. SEED: добавляем языки
		// await sql`
		// 	INSERT INTO languages (name)
		// 	VALUES
		// 		('English'),
		// 		('Russian'),
		// 		('German'),
		// 		('French'),
		// 		('Spanish'),
		// 		('Japanese')
		// 	ON CONFLICT (name) DO NOTHING
		// `

		console.log("Database initialized successfully")
	} catch (error) {
		console.log("Error initializing DB", error)
		process.exit(1)
	}
}


// export async function initDB() {
// 	try {
// 		await sql`CREATE TABLE IF NOT EXISTS transactions(
// 			id SERIAL PRIMARY KEY,
// 			user_id VARCHAR(255) NOT NULL,
// 			title VARCHAR(255) NOT NULL,
// 			amount DECIMAL (10,2) NOT NULL,
// 			category VARCHAR (255) NOT NULL,
// 			created_at DATE NOT NULL DEFAULT CURRENT_DATE
// 		)`
// 		console.log('Database initialized successfully')
// 		// TEST
// 		// await sql`
// 		// 	INSERT INTO transactions(user_id, title, amount, category)
// 		// 	VALUES('535', 'Book', 30.5, 'Books')`
// 		// const data = await sql`SELECT * FROM transactions`
// 		// console.log(data)
// 	} catch (error) {
// 		console.log('Error initializing DB', error)
// 		process.exit(1) // status code 1 means failure, 0 success
// 	}
// }
