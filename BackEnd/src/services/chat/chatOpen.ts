// Opens/creates private and event chats, plus hides past event chats per user.
import { sql } from "../../config/db";
import {
	insertChatParticipant,
	syncEventChatParticipants,
	unarchiveChatParticipant,
} from "./chatParticipants";
import { getChatSummaryForUser } from "./chatSummaries";
import { ChatServiceError } from "./chatTypes";
import { getUserByClerkId } from "./chatUsers";

// Sorts two user ids so the same pair always maps to one private chat key.
function getPrivateKey(firstUserId: number, secondUserId: number) {
	const [first, second] = [firstUserId, secondUserId].sort((a, b) => a - b);

	return `${first}:${second}`;
}

// Opens an existing private chat or creates one if current user saved the target contact.
export async function openPrivateChat(
	currentClerkUserId: string,
	targetClerkUserId: string,
) {
	const currentUser = await getUserByClerkId(currentClerkUserId);
	const targetUser = await getUserByClerkId(targetClerkUserId);

	if (!currentUser || !targetUser) {
		throw new ChatServiceError("User profile was not found.", 404);
	}

	if (currentUser.id === targetUser.id) {
		throw new ChatServiceError("You cannot open a chat with yourself.", 400);
	}

	const privateKey = getPrivateKey(currentUser.id, targetUser.id);
	const existingChats = await sql`
    SELECT id
    FROM chats
    WHERE type = 'private'
    AND private_key = ${privateKey}
  `;

	if (existingChats.length === 0) {
		const contacts = await sql`
      SELECT id
      FROM user_contacts
      WHERE owner_user_id = ${currentUser.id}
      AND contact_user_id = ${targetUser.id}
    `;

		if (contacts.length === 0) {
			throw new ChatServiceError(
				"Add this player to contacts before messaging.",
				403,
			);
		}
	}

	const chats = await sql`
    INSERT INTO chats (type, private_key)
    VALUES ('private', ${privateKey})
    ON CONFLICT (private_key)
    DO UPDATE SET updated_at = chats.updated_at
    RETURNING id
  `;

	await insertChatParticipant(chats[0].id, currentUser.id);
	await insertChatParticipant(chats[0].id, targetUser.id);
	await unarchiveChatParticipant(chats[0].id, currentUser.id);

	return getChatSummaryForUser(chats[0].id, currentUser.id);
}

// Opens/creates the shared chat room for one event.
export async function openEventChat(
	currentClerkUserId: string,
	eventId: number,
) {
	const currentUser = await getUserByClerkId(currentClerkUserId);

	if (!currentUser) {
		throw new ChatServiceError("Current user profile was not found.", 404);
	}

	const events = await sql`
    SELECT id, user_id
    FROM sport_events
    WHERE id = ${eventId}
  `;

	if (events.length === 0) {
		throw new ChatServiceError("Event was not found.", 404);
	}

	const members = await sql`
    SELECT id
    FROM sport_event_members
    WHERE event_id = ${eventId}
    AND user_id = ${currentUser.id}
  `;

	if (events[0].user_id !== currentUser.id && members.length === 0) {
		throw new ChatServiceError("Join this event before opening its chat.", 403);
	}

	const chats = await sql`
    INSERT INTO chats (type, event_id)
    VALUES ('event', ${eventId})
    ON CONFLICT (event_id)
    DO UPDATE SET updated_at = chats.updated_at
    RETURNING id
  `;

	await syncEventChatParticipants(chats[0].id, eventId);
	await unarchiveChatParticipant(chats[0].id, currentUser.id);

	return getChatSummaryForUser(chats[0].id, currentUser.id);
}

// Hides a past event chat from only the current user's chat list.
export async function archivePastEventChat(
	chatId: number,
	currentClerkUserId: string,
) {
	const currentUser = await getUserByClerkId(currentClerkUserId);

	if (!currentUser) {
		throw new ChatServiceError("Current user profile was not found.", 404);
	}

	const chats = await sql`
    SELECT
      chats.id,
      sport_events.available_date < CURRENT_DATE AS is_past
    FROM chats
    INNER JOIN sport_events
      ON sport_events.id = chats.event_id
    INNER JOIN chat_participants AS current_participant
      ON current_participant.chat_id = chats.id
      AND current_participant.user_id = ${currentUser.id}
    WHERE chats.id = ${chatId}
    AND chats.type = 'event'
  `;

	if (chats.length === 0) {
		throw new ChatServiceError("Event chat was not found.", 404);
	}

	if (!chats[0].is_past) {
		throw new ChatServiceError("Only past event chats can be hidden.", 400);
	}

	await sql`
    UPDATE chat_participants
    SET archived_at = CURRENT_TIMESTAMP
    WHERE chat_id = ${chatId}
    AND user_id = ${currentUser.id}
  `;

	return true;
}
