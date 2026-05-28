// Owns reading, sending, and marking messages as read.
import { sql } from "../../config/db";
import { ensureParticipant } from "./chatParticipants";
import { getChatSummaryForUser } from "./chatSummaries";
import { ChatServiceError } from "./chatTypes";
import { getUserByClerkId } from "./chatUsers";

// Loads one message with sender profile fields for frontend rendering.
async function getMessageById(messageId: number) {
	const messages = await sql`
    SELECT
      chat_messages.id,
      chat_messages.chat_id,
      chat_messages.sender_user_id,
      users.clerk_user_id AS sender_clerk_user_id,
      users.first_name AS sender_first_name,
      users.last_name AS sender_last_name,
      users.nickname AS sender_nickname,
      users.avatar_url AS sender_avatar_url,
      chat_messages.message_text,
      chat_messages.created_at
    FROM chat_messages
    INNER JOIN users
      ON users.id = chat_messages.sender_user_id
    WHERE chat_messages.id = ${messageId}
  `;

	return messages[0] ?? null;
}

// Loads a chat with its messages and marks it read for the current user.
export async function getMessagesForChat(
	chatId: number,
	currentClerkUserId: string,
) {
	const currentUser = await getUserByClerkId(currentClerkUserId);

	if (!currentUser) {
		throw new ChatServiceError("Current user profile was not found.", 404);
	}

	await ensureParticipant(chatId, currentUser.id);

	const chat = await getChatSummaryForUser(chatId, currentUser.id);

	const messages = await sql`
    SELECT
      chat_messages.id,
      chat_messages.chat_id,
      chat_messages.sender_user_id,
      users.clerk_user_id AS sender_clerk_user_id,
      users.first_name AS sender_first_name,
      users.last_name AS sender_last_name,
      users.nickname AS sender_nickname,
      users.avatar_url AS sender_avatar_url,
      chat_messages.message_text,
      chat_messages.created_at
    FROM chat_messages
    INNER JOIN users
      ON users.id = chat_messages.sender_user_id
    WHERE chat_messages.chat_id = ${chatId}
    ORDER BY chat_messages.created_at ASC
  `;

	await markChatRead(chatId, currentClerkUserId);

	return {
		chat,
		messages,
	};
}

// Inserts one message, updates chat ordering, and returns the inserted message.
export async function sendChatMessage(
	chatId: number,
	currentClerkUserId: string,
	messageText: string,
) {
	const currentUser = await getUserByClerkId(currentClerkUserId);

	if (!currentUser) {
		throw new ChatServiceError("Current user profile was not found.", 404);
	}

	await ensureParticipant(chatId, currentUser.id);

	const insertedMessages = await sql`
    INSERT INTO chat_messages (chat_id, sender_user_id, message_text)
    VALUES (${chatId}, ${currentUser.id}, ${messageText.trim()})
    RETURNING id
  `;

	await sql`
    UPDATE chats
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = ${chatId}
  `;

	await markChatRead(chatId, currentClerkUserId);

	return getMessageById(insertedMessages[0].id);
}

// Updates last_read_at so unread badges stop counting older messages.
export async function markChatRead(chatId: number, currentClerkUserId: string) {
	const currentUser = await getUserByClerkId(currentClerkUserId);

	if (!currentUser) {
		throw new ChatServiceError("Current user profile was not found.", 404);
	}

	await ensureParticipant(chatId, currentUser.id);

	await sql`
    UPDATE chat_participants
    SET last_read_at = CURRENT_TIMESTAMP
    WHERE chat_id = ${chatId}
    AND user_id = ${currentUser.id}
  `;

	return true;
}
