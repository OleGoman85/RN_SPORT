// Builds chat list summaries, unread counts, and notification badge counts.
import { sql } from "../../config/db";
import { ensureEventChatsForUser } from "./chatParticipants";
import { ChatServiceError, ChatType } from "./chatTypes";
import { getUserByClerkId } from "./chatUsers";

// Loads one chat card summary for a specific current user.
export async function getChatSummaryForUser(chatId: number, userId: number) {
	const chats = await sql`
    SELECT
      chats.id,
      chats.type,
      chats.event_id,
      chats.created_at,
      chats.updated_at,
      last_message.message_text AS last_message_text,
      last_message.created_at AS last_message_at,
      COALESCE(unread_messages.unread_count, 0)::int AS unread_count,

      other_users.clerk_user_id AS other_clerk_user_id,
      other_users.first_name AS other_first_name,
      other_users.last_name AS other_last_name,
      other_users.nickname AS other_nickname,
      other_users.avatar_url AS other_avatar_url,

      sport_events.event_name,
      sport_events.sport_name,
      sport_events.event_format,
      TO_CHAR(sport_events.available_date, 'YYYY-MM-DD') AS available_date,
      sport_events.time_from,
      sport_events.event_image_url,
      sport_events.current_participants,
      sport_events.max_participants
    FROM chats
    INNER JOIN chat_participants AS current_participant
      ON current_participant.chat_id = chats.id
      AND current_participant.user_id = ${userId}
      AND current_participant.archived_at IS NULL
    LEFT JOIN chat_participants AS other_participant
      ON other_participant.chat_id = chats.id
      AND other_participant.user_id <> ${userId}
      AND chats.type = 'private'
    LEFT JOIN users AS other_users
      ON other_users.id = other_participant.user_id
    LEFT JOIN sport_events
      ON sport_events.id = chats.event_id
    LEFT JOIN LATERAL (
      SELECT message_text, created_at
      FROM chat_messages
      WHERE chat_messages.chat_id = chats.id
      ORDER BY created_at DESC
      LIMIT 1
    ) AS last_message ON TRUE
    LEFT JOIN LATERAL (
      SELECT COUNT(*)::int AS unread_count
      FROM chat_messages
      WHERE chat_messages.chat_id = chats.id
      AND chat_messages.sender_user_id <> ${userId}
      AND (
        current_participant.last_read_at IS NULL
        OR chat_messages.created_at > current_participant.last_read_at
      )
    ) AS unread_messages ON TRUE
    WHERE chats.id = ${chatId}
  `;

	return chats[0] ?? null;
}

// Loads private/event chat cards for the Contacts tab lists.
export async function getChatsForUser(
	currentClerkUserId: string,
	typeFilter: ChatType | "all" = "all",
) {
	const currentUser = await getUserByClerkId(currentClerkUserId);

	if (!currentUser) {
		throw new ChatServiceError("Current user profile was not found.", 404);
	}

	if (typeFilter === "event" || typeFilter === "all") {
		await ensureEventChatsForUser(currentUser.id);
	}

	return sql`
    SELECT
      chats.id,
      chats.type,
      chats.event_id,
      chats.created_at,
      chats.updated_at,
      last_message.message_text AS last_message_text,
      last_message.created_at AS last_message_at,
      COALESCE(unread_messages.unread_count, 0)::int AS unread_count,

      other_users.clerk_user_id AS other_clerk_user_id,
      other_users.first_name AS other_first_name,
      other_users.last_name AS other_last_name,
      other_users.nickname AS other_nickname,
      other_users.avatar_url AS other_avatar_url,

      sport_events.event_name,
      sport_events.sport_name,
      sport_events.event_format,
      TO_CHAR(sport_events.available_date, 'YYYY-MM-DD') AS available_date,
      sport_events.time_from,
      sport_events.event_image_url,
      sport_events.current_participants,
      sport_events.max_participants
    FROM chats
    INNER JOIN chat_participants AS current_participant
      ON current_participant.chat_id = chats.id
      AND current_participant.user_id = ${currentUser.id}
      AND current_participant.archived_at IS NULL
    LEFT JOIN chat_participants AS other_participant
      ON other_participant.chat_id = chats.id
      AND other_participant.user_id <> ${currentUser.id}
      AND chats.type = 'private'
    LEFT JOIN users AS other_users
      ON other_users.id = other_participant.user_id
    LEFT JOIN sport_events
      ON sport_events.id = chats.event_id
    LEFT JOIN LATERAL (
      SELECT message_text, created_at
      FROM chat_messages
      WHERE chat_messages.chat_id = chats.id
      ORDER BY created_at DESC
      LIMIT 1
    ) AS last_message ON TRUE
    LEFT JOIN LATERAL (
      SELECT COUNT(*)::int AS unread_count
      FROM chat_messages
      WHERE chat_messages.chat_id = chats.id
      AND chat_messages.sender_user_id <> ${currentUser.id}
      AND (
        current_participant.last_read_at IS NULL
        OR chat_messages.created_at > current_participant.last_read_at
      )
    ) AS unread_messages ON TRUE
    WHERE (${typeFilter} = 'all' OR chats.type = ${typeFilter})
    ORDER BY
      COALESCE(last_message.created_at, chats.updated_at) DESC,
      chats.updated_at DESC
  `;
}

// Counts unread private/event messages for Home and Contacts badges.
export async function getUnreadCountsForUser(currentClerkUserId: string) {
	const currentUser = await getUserByClerkId(currentClerkUserId);

	if (!currentUser) {
		throw new ChatServiceError("Current user profile was not found.", 404);
	}

	await ensureEventChatsForUser(currentUser.id);

	const counts = await sql`
    SELECT
      COALESCE(
        COUNT(*) FILTER (WHERE chats.type = 'private'),
        0
      )::int AS private,
      COALESCE(
        COUNT(*) FILTER (WHERE chats.type = 'event'),
        0
      )::int AS event,
      COUNT(*)::int AS total
    FROM chat_messages
    INNER JOIN chats
      ON chats.id = chat_messages.chat_id
    INNER JOIN chat_participants AS current_participant
      ON current_participant.chat_id = chats.id
      AND current_participant.user_id = ${currentUser.id}
      AND current_participant.archived_at IS NULL
    WHERE chat_messages.sender_user_id <> ${currentUser.id}
    AND (
      current_participant.last_read_at IS NULL
      OR chat_messages.created_at > current_participant.last_read_at
    )
  `;

	return {
		private: counts[0]?.private ?? 0,
		event: counts[0]?.event ?? 0,
		total: counts[0]?.total ?? 0,
	};
}
