// Frontend API service for private chats, event chats, messages, and unread badges.
import {
	ChatMessagesResponse,
	ChatSummary,
	UnreadChatCounts,
} from "../types/chats";
import { API_URL } from "./apiConfig";

// Reads backend JSON safely, including empty responses and plain-text errors.
async function readJsonResponse(response: Response) {
	const text = await response.text();

	if (!text) {
		return {};
	}

	try {
		return JSON.parse(text);
	} catch {
		throw new Error(text);
	}
}

// Opens an existing private chat or creates it if the target user is a contact.
export async function openPrivateChat(
	currentClerkUserId: string,
	targetClerkUserId: string,
): Promise<ChatSummary> {
	const response = await fetch(`${API_URL}/api/chats/private`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			current_clerk_user_id: currentClerkUserId,
			target_clerk_user_id: targetClerkUserId,
		}),
	});

	const data = await readJsonResponse(response);

	if (!response.ok) {
		throw new Error(data.message ?? "Could not open private chat.");
	}

	return data.chat;
}

// Opens an event chat for the creator or joined players.
export async function openEventChat(
	currentClerkUserId: string,
	eventId: number,
): Promise<ChatSummary> {
	const response = await fetch(`${API_URL}/api/chats/event/${eventId}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			current_clerk_user_id: currentClerkUserId,
		}),
	});

	const data = await readJsonResponse(response);

	if (!response.ok) {
		throw new Error(data.message ?? "Could not open event chat.");
	}

	return data.chat;
}

// Loads private or event chat summaries for the Contacts tab sections.
export async function loadChats(
	currentClerkUserId: string,
	type?: ChatSummary["type"],
): Promise<ChatSummary[]> {
	const query = type ? `?type=${encodeURIComponent(type)}` : "";
	const response = await fetch(
		`${API_URL}/api/chats/${encodeURIComponent(currentClerkUserId)}${query}`,
	);

	const data = await readJsonResponse(response);

	if (!response.ok) {
		throw new Error(data.message ?? "Could not load chats.");
	}

	return data.chats ?? [];
}

// Loads unread message counts for app-level and tab-level badges.
export async function loadUnreadChatCounts(
	currentClerkUserId: string,
): Promise<UnreadChatCounts> {
	const response = await fetch(
		`${API_URL}/api/chats/unread/${encodeURIComponent(currentClerkUserId)}`,
	);

	const data = await readJsonResponse(response);

	if (!response.ok) {
		throw new Error(data.message ?? "Could not load unread messages.");
	}

	return data.unread ?? { private: 0, event: 0, total: 0 };
}

// Loads one chat and its messages.
export async function loadChatMessages(
	chatId: number,
	currentClerkUserId: string,
): Promise<ChatMessagesResponse> {
	const query = new URLSearchParams({
		current_clerk_user_id: currentClerkUserId,
	});

	const response = await fetch(
		`${API_URL}/api/chats/${chatId}/messages?${query.toString()}`,
	);

	const data = await readJsonResponse(response);

	if (!response.ok) {
		throw new Error(data.message ?? "Could not load messages.");
	}

	return {
		chat: data.chat ?? null,
		messages: data.messages ?? [],
	};
}

// Sends one text message to an existing chat.
export async function sendChatMessage(
	chatId: number,
	currentClerkUserId: string,
	messageText: string,
) {
	const response = await fetch(`${API_URL}/api/chats/${chatId}/messages`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			current_clerk_user_id: currentClerkUserId,
			message_text: messageText,
		}),
	});

	const data = await readJsonResponse(response);

	if (!response.ok) {
		throw new Error(data.message ?? "Could not send message.");
	}

	return data.message;
}

// Marks a chat as read for unread badges.
export async function markChatRead(chatId: number, currentClerkUserId: string) {
	const response = await fetch(`${API_URL}/api/chats/${chatId}/read`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			current_clerk_user_id: currentClerkUserId,
		}),
	});

	const data = await readJsonResponse(response);

	if (!response.ok) {
		throw new Error(data.message ?? "Could not mark chat as read.");
	}

	return data;
}

// Hides one past event chat from the current user's Event Chats list.
export async function hidePastEventChat(
	chatId: number,
	currentClerkUserId: string,
) {
	const response = await fetch(`${API_URL}/api/chats/${chatId}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			current_clerk_user_id: currentClerkUserId,
		}),
	});

	const data = await readJsonResponse(response);

	if (!response.ok) {
		throw new Error(data.message ?? "Could not hide event chat.");
	}

	return data;
}
