// Owns event details modal state: loading details, joining, contacts, and chat actions.
import { useUser } from "@clerk/expo";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { openEventChat, openPrivateChat } from "../services/chatsApi";
import { addContactToBook } from "../services/contactsApi";
import {
	joinSportEvent,
	loadSportEventDetails,
} from "../services/eventsApi";
import { EventDetails, SportEvent } from "../types/events";

type UseEventDetailsModalParams = {
	eventId: number | null;
	visible: boolean;
	onClose: () => void;
	onEventUpdated?: (event: SportEvent) => void;
};

// Provides all behavior needed by EventDetailsModal while keeping the JSX small.
export function useEventDetailsModal({
	eventId,
	visible,
	onClose,
	onEventUpdated,
}: UseEventDetailsModalParams) {
	const { user } = useUser();

	const [details, setDetails] = useState<EventDetails | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isJoining, setIsJoining] = useState(false);
	const [isAddingContact, setIsAddingContact] = useState(false);
	const [isOpeningChat, setIsOpeningChat] = useState(false);
	const [selectedProfileClerkUserId, setSelectedProfileClerkUserId] = useState<
		string | null
	>(null);

	// Loads full event details whenever a new visible event id is opened.
	useEffect(() => {
		if (!visible || eventId === null) {
			return;
		}

		const numericEventId = eventId;

		async function loadDetails() {
			try {
				setIsLoading(true);

				const loadedDetails = await loadSportEventDetails(numericEventId);

				setDetails(loadedDetails);
			} catch (error) {
				console.log("Event details loading error:", error);
				Alert.alert("Error", "Could not load event details.");
				onClose();
			} finally {
				setIsLoading(false);
			}
		}

		loadDetails();
	}, [eventId, visible, onClose]);

	useEffect(() => {
		if (!visible) {
			setSelectedProfileClerkUserId(null);
		}
	}, [visible]);

	const creator = details?.creator;
	const event = details?.event;

	const members = useMemo(() => {
		return details?.members ?? [];
	}, [details?.members]);

	const isCreator = Boolean(
		creator && user?.id && creator.clerk_user_id === user.id,
	);

	const isAlreadyJoined = useMemo(() => {
		return members.some((member) => member.clerk_user_id === user?.id);
	}, [members, user?.id]);

	const isEventFull =
		event !== undefined && event.current_participants >= event.max_participants;

	// Closes the nested player profile sheet before closing the whole modal.
	const handleSheetClose = useCallback(() => {
		if (selectedProfileClerkUserId !== null) {
			setSelectedProfileClerkUserId(null);
			return;
		}

		onClose();
	}, [onClose, selectedProfileClerkUserId]);

	// Leaves the modal and navigates to the shared chat room screen.
	const openChatRoom = useCallback(
		(chatId: number) => {
			onClose();
			router.push({
				pathname: "/(home)/chat-room/[chatId]",
				params: {
					chatId: String(chatId),
				},
			});
		},
		[onClose],
	);

	// Joins the event and refreshes modal data so participants update immediately.
	const handleJoinEvent = useCallback(async () => {
		if (!eventId || !user?.id) {
			Alert.alert("Error", "User is not loaded yet.");
			return;
		}

		try {
			setIsJoining(true);

			const updatedEvent = await joinSportEvent(eventId, user.id);
			const updatedDetails = await loadSportEventDetails(eventId);

			setDetails(updatedDetails);
			onEventUpdated?.(updatedEvent);

			Alert.alert("Success", "You joined this event.");
		} catch (error) {
			console.log("Join event error:", error);

			Alert.alert(
				"Could not join event",
				error instanceof Error ? error.message : "Please try again.",
			);
		} finally {
			setIsJoining(false);
		}
	}, [eventId, onEventUpdated, user?.id]);

	// Opens the event chat for creators and joined players.
	const handleOpenEventChatPress = useCallback(async () => {
		if (!eventId || !user?.id) {
			Alert.alert("Error", "User is not loaded yet.");
			return;
		}

		if (!isCreator && !isAlreadyJoined) {
			Alert.alert("Join first", "Join this event before opening its chat.");
			return;
		}

		try {
			setIsOpeningChat(true);

			const chat = await openEventChat(user.id, eventId);

			openChatRoom(chat.id);
		} catch (error) {
			console.log("Open event chat error:", error);
			Alert.alert(
				"Could not open event chat",
				error instanceof Error ? error.message : "Please try again.",
			);
		} finally {
			setIsOpeningChat(false);
		}
	}, [eventId, isAlreadyJoined, isCreator, openChatRoom, user?.id]);

	// Main button means Join Event before joining, Open Event Chat after joining.
	const handleMainActionPress = useCallback(() => {
		if (isCreator || isAlreadyJoined) {
			handleOpenEventChatPress();
			return;
		}

		handleJoinEvent();
	}, [handleJoinEvent, handleOpenEventChatPress, isAlreadyJoined, isCreator]);

	// Opens a private chat with the event creator.
	const handleMessagePress = useCallback(async () => {
		if (!creator || !user?.id) {
			Alert.alert("Error", "User is not loaded yet.");
			return;
		}

		if (isCreator) {
			Alert.alert("Message", "This is your own event.");
			return;
		}

		try {
			setIsOpeningChat(true);

			const chat = await openPrivateChat(user.id, creator.clerk_user_id);

			openChatRoom(chat.id);
		} catch (error) {
			console.log("Open private chat error:", error);
			Alert.alert(
				"Add contact first",
				error instanceof Error
					? error.message
					: "Private messages are available for saved contacts.",
			);
		} finally {
			setIsOpeningChat(false);
		}
	}, [creator, isCreator, openChatRoom, user?.id]);

	// Saves the event creator into the current user's contacts.
	const handleAddContactPress = useCallback(async () => {
		if (!creator || !user?.id) {
			Alert.alert("Error", "User is not loaded yet.");
			return;
		}

		if (isCreator) {
			Alert.alert("Contact", "This is your own profile.");
			return;
		}

		try {
			setIsAddingContact(true);

			const result = await addContactToBook(user.id, creator.clerk_user_id);

			Alert.alert(
				"Contact saved",
				result.is_new
					? "This player was added to your contacts."
					: "This player is already in your contacts.",
			);
		} catch (error) {
			console.log("Add contact error:", error);

			Alert.alert(
				"Could not add contact",
				error instanceof Error ? error.message : "Please try again.",
			);
		} finally {
			setIsAddingContact(false);
		}
	}, [creator, isCreator, user?.id]);

	return {
		creator,
		event,
		handleAddContactPress,
		handleMainActionPress,
		handleMessagePress,
		handleSheetClose,
		isAddingContact,
		isAlreadyJoined,
		isCreator,
		isEventFull,
		isJoining,
		isLoading,
		isOpeningChat,
		members,
		selectedProfileClerkUserId,
		setSelectedProfileClerkUserId,
	};
}
