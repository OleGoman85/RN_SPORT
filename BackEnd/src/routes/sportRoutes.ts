import express from "express";
import { sql } from "../config/db";
import {
  createEvent,
  getEventById,
  getEventDetailsById,
  getMyEvents,
  getPublicEvents,
  getUserIdByClerkId,
  softDeleteEvent,
  updateEvent,
} from "../services/eventService";
import {
  getDayFilter,
  getRequiredEventFieldsError,
  isValidString,
} from "../utils/eventValidation";

const router = express.Router();

router.get("/events", async (req, res) => {
  try {
    const dayFilter = getDayFilter(req.query.day);
    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";
    const sport =
      typeof req.query.sport === "string" ? req.query.sport.trim() : "";
    const latitude = Number(req.query.latitude);
    const longitude = Number(req.query.longitude);
    const hasCoordinates = !Number.isNaN(latitude) && !Number.isNaN(longitude);

    const events = await getPublicEvents({
      dayFilter,
      search,
      sport,
      latitude,
      longitude,
      hasCoordinates,
    });

    return res.status(200).json({ events });
  } catch (error) {
    console.log("Error loading events", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/events/:eventId/details", async (req, res) => {
  try {
    const numericEventId = Number(req.params.eventId);

    if (Number.isNaN(numericEventId)) {
      return res.status(400).json({ message: "Invalid event id." });
    }

    const details = await getEventDetailsById(numericEventId);

    if (!details || !details.event.is_active) {
      return res.status(404).json({ message: "Event was not found." });
    }

    return res.status(200).json(details);
  } catch (error) {
    console.log("Error loading event details", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/my-events/:clerkUserId", async (req, res) => {
  try {
    const { clerkUserId } = req.params;

    if (!isValidString(clerkUserId)) {
      return res.status(400).json({ message: "User id is required." });
    }

    const events = await getMyEvents(clerkUserId);

    return res.status(200).json({ events });
  } catch (error) {
    console.log("Error loading my events", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/events", async (req, res) => {
  try {
    const errorMessage = getRequiredEventFieldsError(req.body);

    if (errorMessage) {
      return res.status(400).json({ message: errorMessage });
    }

    const userId = await getUserIdByClerkId(req.body.current_clerk_user_id);

    if (!userId) {
      return res.status(404).json({
        message: "Current user profile was not found.",
      });
    }

    const createdEvent = await createEvent(req.body, userId);

    return res.status(201).json({ event: createdEvent });
  } catch (error) {
    console.log("Error creating event", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/events/:eventId", async (req, res) => {
  try {
    const numericEventId = Number(req.params.eventId);

    if (Number.isNaN(numericEventId)) {
      return res.status(400).json({ message: "Invalid event id." });
    }

    const errorMessage = getRequiredEventFieldsError(req.body);

    if (errorMessage) {
      return res.status(400).json({ message: errorMessage });
    }

    const userId = await getUserIdByClerkId(req.body.current_clerk_user_id);

    if (!userId) {
      return res.status(404).json({
        message: "Current user profile was not found.",
      });
    }

    const currentEvent = await getEventById(numericEventId);

    if (!currentEvent || !currentEvent.is_active) {
      return res.status(404).json({ message: "Event was not found." });
    }

    if (currentEvent.user_id !== userId) {
      return res.status(403).json({
        message: "You can edit only your own events.",
      });
    }

    if (req.body.max_participants < currentEvent.current_participants) {
      return res.status(400).json({
        message: "Max participants cannot be lower than current participants.",
      });
    }

    const updatedEvent = await updateEvent(req.body, numericEventId, userId);

    if (!updatedEvent) {
      return res.status(404).json({
        message: "Event was not found or you are not the creator.",
      });
    }

    return res.status(200).json({ event: updatedEvent });
  } catch (error) {
    console.log("Error updating event", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/events/:eventId/join", async (req, res) => {
  try {
    const numericEventId = Number(req.params.eventId);
    const { current_clerk_user_id } = req.body;

    if (Number.isNaN(numericEventId)) {
      return res.status(400).json({ message: "Invalid event id." });
    }

    if (!isValidString(current_clerk_user_id)) {
      return res.status(400).json({ message: "Current user id is required." });
    }

    const userId = await getUserIdByClerkId(current_clerk_user_id);

    if (!userId) {
      return res.status(404).json({
        message: "Current user profile was not found.",
      });
    }

    const event = await getEventById(numericEventId);

    if (!event || !event.is_active) {
      return res.status(404).json({ message: "Event was not found." });
    }

    if (event.user_id === userId) {
      return res.status(400).json({
        message: "You are already the creator of this event.",
      });
    }

    if (event.current_participants >= event.max_participants) {
      return res.status(400).json({ message: "This event is full." });
    }

    const insertedMembers = await sql`
      INSERT INTO sport_event_members (event_id, user_id)
      VALUES (${numericEventId}, ${userId})
      ON CONFLICT (event_id, user_id)
      DO NOTHING
      RETURNING *
    `;

    if (insertedMembers.length > 0) {
      await sql`
        UPDATE sport_events
        SET current_participants = current_participants + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${numericEventId}
      `;
    }

    const updatedEvent = await getEventById(numericEventId);

    return res.status(200).json({ event: updatedEvent });
  } catch (error) {
    console.log("Error joining event", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/events/:eventId", async (req, res) => {
  try {
    const numericEventId = Number(req.params.eventId);
    const { current_clerk_user_id } = req.body;

    if (Number.isNaN(numericEventId)) {
      return res.status(400).json({ message: "Invalid event id." });
    }

    if (!isValidString(current_clerk_user_id)) {
      return res.status(400).json({ message: "Current user id is required." });
    }

    const userId = await getUserIdByClerkId(current_clerk_user_id);

    if (!userId) {
      return res.status(404).json({
        message: "Current user profile was not found.",
      });
    }

    const deletedEvent = await softDeleteEvent(numericEventId, userId);

    if (!deletedEvent) {
      return res.status(404).json({
        message: "Event was not found or you are not the creator.",
      });
    }

    return res.status(200).json({ event: deletedEvent });
  } catch (error) {
    console.log("Error deleting event", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
