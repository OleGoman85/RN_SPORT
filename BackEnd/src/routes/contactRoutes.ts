import express from "express";
import {
	addContact,
	getContactsByClerkUserId,
	removeContact,
} from "../services/contactService";
import { getUserIdByClerkId } from "../services/eventService";
import { isValidString } from "../utils/eventValidation";

const router = express.Router();

router.get("/:clerkUserId", async (req, res) => {
	try {
		const { clerkUserId } = req.params;

		if (!isValidString(clerkUserId)) {
			return res.status(400).json({ message: "User id is required." });
		}

		const contacts = await getContactsByClerkUserId(clerkUserId);

		return res.status(200).json({ contacts });
	} catch (error) {
		console.log("Error loading contacts", error);
		return res.status(500).json({ message: "Internal server error" });
	}
});

router.post("/", async (req, res) => {
	try {
		const { current_clerk_user_id, contact_clerk_user_id } = req.body;

		if (
			!isValidString(current_clerk_user_id) ||
			!isValidString(contact_clerk_user_id)
		) {
			return res.status(400).json({
				message: "Current user id and contact user id are required.",
			});
		}

		if (current_clerk_user_id === contact_clerk_user_id) {
			return res.status(400).json({
				message: "You cannot add yourself to contacts.",
			});
		}

		const ownerUserId = await getUserIdByClerkId(current_clerk_user_id);
		const contactUserId = await getUserIdByClerkId(contact_clerk_user_id);

		if (!ownerUserId || !contactUserId) {
			return res.status(404).json({
				message: "User profile was not found.",
			});
		}

		const result = await addContact(ownerUserId, contactUserId);

		return res.status(result.is_new ? 201 : 200).json(result);
	} catch (error) {
		console.log("Error adding contact", error);
		return res.status(500).json({ message: "Internal server error" });
	}
});

router.delete("/:contactClerkUserId", async (req, res) => {
	try {
		const { contactClerkUserId } = req.params;
		const { current_clerk_user_id } = req.body;

		if (
			!isValidString(current_clerk_user_id) ||
			!isValidString(contactClerkUserId)
		) {
			return res.status(400).json({
				message: "Current user id and contact user id are required.",
			});
		}

		const ownerUserId = await getUserIdByClerkId(current_clerk_user_id);
		const contactUserId = await getUserIdByClerkId(contactClerkUserId);

		if (!ownerUserId || !contactUserId) {
			return res.status(404).json({
				message: "User profile was not found.",
			});
		}

		const wasRemoved = await removeContact(ownerUserId, contactUserId);

		if (!wasRemoved) {
			return res.status(404).json({
				message: "Contact was not found.",
			});
		}

		return res.status(200).json({ success: true });
	} catch (error) {
		console.log("Error removing contact", error);
		return res.status(500).json({ message: "Internal server error" });
	}
});

export default router;
