// Shared chat formatting helpers used by chat lists, badges, and chat room UI.
import { ChatMessage, ChatSummary } from "../types/chats";

export type ContactsTab = "messages" | "eventChats" | "contacts";

// Keeps badge labels compact in small UI circles.
export function formatBadgeCount(count: number) {
	return count > 9 ? "9+" : String(count);
}

// Builds the display name for the other person in a private chat.
export function getPrivateChatName(chat: ChatSummary) {
	const fullName = [chat.other_first_name, chat.other_last_name]
		.filter(Boolean)
		.join(" ")
		.trim();

	return fullName || chat.other_nickname || "Player";
}

// Chooses the title shown in Messages/Event Chats lists.
export function getChatListTitle(chat: ChatSummary) {
	if (chat.type === "event") {
		return chat.event_name ?? "Event chat";
	}

	return getPrivateChatName(chat);
}

// Chooses preview text under one chat list card.
export function getChatListSubtitle(chat: ChatSummary) {
	if (chat.last_message_text) {
		return chat.last_message_text;
	}

	if (chat.type === "event") {
		const eventFormat = chat.event_format === "1v1" ? "1v1" : "Team";

		return `${chat.sport_name ?? "Event"} · ${eventFormat}`;
	}

	return chat.other_nickname ? `@${chat.other_nickname}` : "No messages yet";
}

// Chooses the chat room header title.
export function getChatRoomTitle(chat: ChatSummary | null) {
	if (!chat) {
		return "Chat";
	}

	if (chat.type === "event") {
		return chat.event_name ?? "Event chat";
	}

	return getPrivateChatName(chat);
}

// Chooses the chat room header subtitle.
export function getChatRoomSubtitle(chat: ChatSummary | null) {
	if (!chat) {
		return "Messages";
	}

	if (chat.type === "event") {
		const format = chat.event_format === "1v1" ? "1v1" : "Team";
		const participants =
			chat.current_participants !== null && chat.max_participants !== null
				? ` · ${chat.current_participants}/${chat.max_participants}`
				: "";

		return `${chat.sport_name ?? "Event"} · ${format}${participants}`;
	}

	return chat.other_nickname ? `@${chat.other_nickname}` : "Private messages";
}

// Builds a sender label for messages inside event chats.
export function getSenderName(message: ChatMessage) {
	const fullName = [message.sender_first_name, message.sender_last_name]
		.filter(Boolean)
		.join(" ")
		.trim();

	return fullName || message.sender_nickname || "Player";
}

// Formats chat list dates.
export function formatChatTime(date: string | null) {
	if (!date) {
		return "";
	}

	const parsedDate = new Date(date);

	if (Number.isNaN(parsedDate.getTime())) {
		return "";
	}

	return parsedDate.toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "short",
	});
}

// Formats message bubble timestamps.
export function formatMessageTime(date: string) {
	const parsedDate = new Date(date);

	if (Number.isNaN(parsedDate.getTime())) {
		return "";
	}

	return parsedDate.toLocaleTimeString("en-GB", {
		hour: "2-digit",
		minute: "2-digit",
	});
}

// Removes duplicate messages caused by polling/send timing and sorts them chronologically.
export function getUniqueMessages(messages: ChatMessage[]) {
	const messageMap = new Map<number, ChatMessage>();

	messages.forEach((message) => {
		messageMap.set(message.id, message);
	});

	return Array.from(messageMap.values()).sort((firstMessage, secondMessage) => {
		const firstDate = new Date(firstMessage.created_at).getTime();
		const secondDate = new Date(secondMessage.created_at).getTime();

		if (firstDate !== secondDate) {
			return firstDate - secondDate;
		}

		return firstMessage.id - secondMessage.id;
	});
}

// Returns local YYYY-MM-DD for comparing event dates without time zones.
function getLocalDateValue(date: Date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
}

// Past event chats can be hidden from the current user's Event Chats list.
export function isPastEventChat(chat: ChatSummary) {
	if (chat.type !== "event" || !chat.available_date) {
		return false;
	}

	return chat.available_date < getLocalDateValue(new Date());
}
