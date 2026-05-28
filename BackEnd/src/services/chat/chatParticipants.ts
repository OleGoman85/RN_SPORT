// Owns chat participant access checks and membership synchronization.
import { sql } from "../../config/db";
import { ChatServiceError } from "./chatTypes";

// Stops users from reading/writing chats where they are not participants.
export async function ensureParticipant(chatId: number, userId: number) {
	const participants = await sql`
    SELECT id
    FROM chat_participants
    WHERE chat_id = ${chatId}
    AND user_id = ${userId}
  `;

	if (participants.length === 0) {
		throw new ChatServiceError("You do not have access to this chat.", 403);
	}
}

// Adds one user to a chat without duplicating an existing participant row.
export async function insertChatParticipant(chatId: number, userId: number) {
	await sql`
    INSERT INTO chat_participants (chat_id, user_id)
    VALUES (${chatId}, ${userId})
    ON CONFLICT (chat_id, user_id)
    DO NOTHING
  `;
}

// Makes a previously hidden chat visible again for one user.
export async function unarchiveChatParticipant(
	chatId: number,
	userId: number,
) {
	await sql`
    UPDATE chat_participants
    SET archived_at = NULL
    WHERE chat_id = ${chatId}
    AND user_id = ${userId}
  `;
}

// Ensures event chat participants match creator + joined event members.
export async function syncEventChatParticipants(
	chatId: number,
	eventId: number,
) {
	await sql`
    INSERT INTO chat_participants (chat_id, user_id)
    SELECT ${chatId}, event_users.user_id
    FROM (
      SELECT user_id
      FROM sport_events
      WHERE id = ${eventId}

      UNION

      SELECT user_id
      FROM sport_event_members
      WHERE event_id = ${eventId}
    ) AS event_users
    ON CONFLICT (chat_id, user_id)
    DO NOTHING
  `;
}

// Creates missing event chats for every event connected to one user.
export async function ensureEventChatsForUser(userId: number) {
	const events = await sql`
    SELECT sport_events.id
    FROM sport_events
    LEFT JOIN sport_event_members
      ON sport_event_members.event_id = sport_events.id
      AND sport_event_members.user_id = ${userId}
    WHERE sport_events.user_id = ${userId}
    OR sport_event_members.user_id = ${userId}
    GROUP BY sport_events.id
  `;

	for (const event of events) {
		const chats = await sql`
      INSERT INTO chats (type, event_id)
      VALUES ('event', ${event.id})
      ON CONFLICT (event_id)
      DO UPDATE SET updated_at = chats.updated_at
      RETURNING id
    `;

		await syncEventChatParticipants(chats[0].id, event.id);
	}
}
