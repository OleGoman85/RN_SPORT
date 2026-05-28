// DB helpers for resolving app users used by chat services.
import { sql } from "../../config/db";

// Finds the internal DB user row from a Clerk user id.
export async function getUserByClerkId(clerkUserId: string) {
	const users = await sql`
    SELECT
      id,
      clerk_user_id,
      first_name,
      last_name,
      nickname,
      avatar_url
    FROM users
    WHERE clerk_user_id = ${clerkUserId}
  `;

	return users[0] ?? null;
}
