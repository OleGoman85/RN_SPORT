// Public chat API endpoints: open chats, list chats, messages, unread badges, hide old event chats.
import express from "express";
import {
	archivePastEventChat,
	ChatServiceError,
	getChatsForUser,
	getMessagesForChat,
	getUnreadCountsForUser,
	markChatRead,
	openEventChat,
	openPrivateChat,
	sendChatMessage,
} from "../services/chatService";
import { isValidString } from "../utils/eventValidation";

const router = express.Router();

function sendChatError(error: unknown, res: express.Response) {
	if (error instanceof ChatServiceError) {
		return res.status(error.statusCode).json({ message: error.message });
	}

	console.log("Chat route error", error);
	return res.status(500).json({ message: "Internal server error" });
}

// Creates or opens a private chat. A new chat requires a saved contact.
router.post("/private", async (req, res) => {
	try {
		const { current_clerk_user_id, target_clerk_user_id } = req.body;

		if (
			!isValidString(current_clerk_user_id) ||
			!isValidString(target_clerk_user_id)
		) {
			return res.status(400).json({
				message: "Current user id and target user id are required.",
			});
		}

		const chat = await openPrivateChat(
			current_clerk_user_id,
			target_clerk_user_id,
		);

		return res.status(200).json({ chat });
	} catch (error) {
		return sendChatError(error, res);
	}
});

// Creates or opens an event chat for event creator and joined players.
router.post("/event/:eventId", async (req, res) => {
	try {
		const numericEventId = Number(req.params.eventId);
		const { current_clerk_user_id } = req.body;

		if (Number.isNaN(numericEventId)) {
			return res.status(400).json({ message: "Invalid event id." });
		}

		if (!isValidString(current_clerk_user_id)) {
			return res.status(400).json({ message: "Current user id is required." });
		}

		const chat = await openEventChat(current_clerk_user_id, numericEventId);

		return res.status(200).json({ chat });
	} catch (error) {
		return sendChatError(error, res);
	}
});

// Loads total unread message counts for notification badges.
router.get("/unread/:clerkUserId", async (req, res) => {
	try {
		const { clerkUserId } = req.params;

		if (!isValidString(clerkUserId)) {
			return res.status(400).json({ message: "User id is required." });
		}

		const unread = await getUnreadCountsForUser(clerkUserId);

		return res.status(200).json({ unread });
	} catch (error) {
		return sendChatError(error, res);
	}
});

// Loads messages for one chat after checking that current user is a participant.
router.get("/:chatId/messages", async (req, res) => {
	try {
		const numericChatId = Number(req.params.chatId);
		const currentClerkUserId =
			typeof req.query.current_clerk_user_id === "string"
				? req.query.current_clerk_user_id
				: "";

		if (Number.isNaN(numericChatId)) {
			return res.status(400).json({ message: "Invalid chat id." });
		}

		if (!isValidString(currentClerkUserId)) {
			return res.status(400).json({ message: "Current user id is required." });
		}

		const result = await getMessagesForChat(numericChatId, currentClerkUserId);

		return res.status(200).json(result);
	} catch (error) {
		return sendChatError(error, res);
	}
});

// Saves one message in an existing chat.
router.post("/:chatId/messages", async (req, res) => {
	try {
		const numericChatId = Number(req.params.chatId);
		const { current_clerk_user_id, message_text } = req.body;

		if (Number.isNaN(numericChatId)) {
			return res.status(400).json({ message: "Invalid chat id." });
		}

		if (!isValidString(current_clerk_user_id)) {
			return res.status(400).json({ message: "Current user id is required." });
		}

		if (!isValidString(message_text)) {
			return res.status(400).json({ message: "Message text is required." });
		}

		const message = await sendChatMessage(
			numericChatId,
			current_clerk_user_id,
			message_text,
		);

		return res.status(201).json({ message });
	} catch (error) {
		return sendChatError(error, res);
	}
});

// Marks one chat as read for the current user.
router.post("/:chatId/read", async (req, res) => {
	try {
		const numericChatId = Number(req.params.chatId);
		const { current_clerk_user_id } = req.body;

		if (Number.isNaN(numericChatId)) {
			return res.status(400).json({ message: "Invalid chat id." });
		}

		if (!isValidString(current_clerk_user_id)) {
			return res.status(400).json({ message: "Current user id is required." });
		}

		await markChatRead(numericChatId, current_clerk_user_id);

		return res.status(200).json({ success: true });
	} catch (error) {
		return sendChatError(error, res);
	}
});

// Hides a past event chat from the current user's chat list.
router.delete("/:chatId", async (req, res) => {
	try {
		const numericChatId = Number(req.params.chatId);
		const { current_clerk_user_id } = req.body;

		if (Number.isNaN(numericChatId)) {
			return res.status(400).json({ message: "Invalid chat id." });
		}

		if (!isValidString(current_clerk_user_id)) {
			return res.status(400).json({ message: "Current user id is required." });
		}

		await archivePastEventChat(numericChatId, current_clerk_user_id);

		return res.status(200).json({ success: true });
	} catch (error) {
		return sendChatError(error, res);
	}
});

// Loads chat list for Messages / Event Chats sections.
router.get("/:clerkUserId", async (req, res) => {
	try {
		const { clerkUserId } = req.params;
		const type =
			req.query.type === "private" || req.query.type === "event"
				? req.query.type
				: "all";

		if (!isValidString(clerkUserId)) {
			return res.status(400).json({ message: "User id is required." });
		}

		const chats = await getChatsForUser(clerkUserId, type);

		return res.status(200).json({ chats });
	} catch (error) {
		return sendChatError(error, res);
	}
});

export default router;
