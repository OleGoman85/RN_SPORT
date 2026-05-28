// Owns the Contacts tab state: private chats, event chats, contacts, badges, and actions.
import { useUser } from "@clerk/expo";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import {
	hidePastEventChat,
	loadChats,
	openPrivateChat,
} from "../services/chatsApi";
import {
	loadContacts,
	removeContactFromBook,
} from "../services/contactsApi";
import { ChatSummary } from "../types/chats";
import { ContactUser } from "../types/contacts";
import { ContactsTab, isPastEventChat } from "../utils/chatDisplay";
import { getFullName } from "../utils/eventDetails";

// Provides data and actions for the Messages | Event Chats | Contacts screen.
export function useContactsChatsScreen() {
	const { user } = useUser();
	const { tab } = useLocalSearchParams<{ tab?: string }>();

	const [activeTab, setActiveTab] = useState<ContactsTab>("messages");
	const [contacts, setContacts] = useState<ContactUser[]>([]);
	const [privateChats, setPrivateChats] = useState<ChatSummary[]>([]);
	const [eventChats, setEventChats] = useState<ChatSummary[]>([]);
	const [isLoadingContacts, setIsLoadingContacts] = useState(true);
	const [isLoadingChats, setIsLoadingChats] = useState(true);
	const [selectedProfileClerkUserId, setSelectedProfileClerkUserId] = useState<
		string | null
	>(null);

	useEffect(() => {
		if (tab === "messages" || tab === "eventChats" || tab === "contacts") {
			setActiveTab(tab);
		}
	}, [tab]);

	// Loads contacts plus both chat lists; silent refresh keeps badges fresh.
	const loadScreenData = useCallback(
		async (showLoader = true) => {
			if (!user?.id) {
				setContacts([]);
				setPrivateChats([]);
				setEventChats([]);
				setIsLoadingContacts(false);
				setIsLoadingChats(false);
				return;
			}

			try {
				if (showLoader) {
					setIsLoadingContacts(true);
					setIsLoadingChats(true);
				}

				const [loadedContacts, loadedPrivateChats, loadedEventChats] =
					await Promise.all([
						loadContacts(user.id),
						loadChats(user.id, "private"),
						loadChats(user.id, "event"),
					]);

				setContacts(loadedContacts);
				setPrivateChats(loadedPrivateChats);
				setEventChats(loadedEventChats);
			} catch (error) {
				console.log("Contacts screen loading error:", error);

				if (showLoader) {
					Alert.alert("Error", "Could not load contacts and chats.");
				}
			} finally {
				if (showLoader) {
					setIsLoadingContacts(false);
					setIsLoadingChats(false);
				}
			}
		},
		[user?.id],
	);

	// Refreshes lists when the tab is focused and then polls for unread updates.
	useFocusEffect(
		useCallback(() => {
			loadScreenData(true);

			const intervalId = setInterval(() => {
				loadScreenData(false);
			}, 12000);

			return () => clearInterval(intervalId);
		}, [loadScreenData]),
	);

	// Navigates from a list item into the shared chat room screen.
	const openChatRoom = useCallback((chatId: number) => {
		router.push({
			pathname: "/(home)/chat-room/[chatId]",
			params: {
				chatId: String(chatId),
			},
		});
	}, []);

	// Opens or creates a private chat with a saved contact.
	const handleMessagePress = useCallback(
		async (contact: ContactUser) => {
			if (!user?.id) {
				Alert.alert("Error", "User is not loaded yet.");
				return;
			}

			try {
				const chat = await openPrivateChat(user.id, contact.clerk_user_id);

				openChatRoom(chat.id);
			} catch (error) {
				console.log("Open private chat error:", error);
				Alert.alert(
					"Could not open chat",
					error instanceof Error ? error.message : "Please try again.",
				);
			}
		},
		[openChatRoom, user?.id],
	);

	// Removes one saved player from the current user's contacts.
	const handleRemoveContact = useCallback(
		(contact: ContactUser) => {
			if (!user?.id) {
				return;
			}

			Alert.alert(
				"Remove contact",
				`Remove ${getFullName(contact)} from your contacts?`,
				[
					{
						text: "Cancel",
						style: "cancel",
					},
					{
						text: "Remove",
						style: "destructive",
						onPress: async () => {
							try {
								await removeContactFromBook(user.id, contact.clerk_user_id);

								setContacts((currentContacts) =>
									currentContacts.filter(
										(item) => item.clerk_user_id !== contact.clerk_user_id,
									),
								);
							} catch (error) {
								console.log("Remove contact error:", error);
								Alert.alert("Error", "Could not remove contact.");
							}
						},
					},
				],
			);
		},
		[user?.id],
	);

	// Hides a past event chat only for the current user.
	const handleHideEventChat = useCallback(
		(chat: ChatSummary) => {
			if (!user?.id || !isPastEventChat(chat)) {
				return;
			}

			Alert.alert(
				"Hide event chat",
				"Remove this past event chat from your list?",
				[
					{
						text: "Cancel",
						style: "cancel",
					},
					{
						text: "Hide",
						style: "destructive",
						onPress: async () => {
							try {
								await hidePastEventChat(chat.id, user.id);

								setEventChats((currentChats) =>
									currentChats.filter((item) => item.id !== chat.id),
								);
							} catch (error) {
								console.log("Hide event chat error:", error);
								Alert.alert(
									"Could not hide chat",
									error instanceof Error ? error.message : "Please try again.",
								);
							}
						},
					},
				],
			);
		},
		[user?.id],
	);

	const activeChats = activeTab === "messages" ? privateChats : eventChats;
	const isLoadingActive =
		activeTab === "contacts" ? isLoadingContacts : isLoadingChats;
	const privateUnreadCount = useMemo(
		() => privateChats.reduce((total, chat) => total + chat.unread_count, 0),
		[privateChats],
	);
	const eventUnreadCount = useMemo(
		() => eventChats.reduce((total, chat) => total + chat.unread_count, 0),
		[eventChats],
	);

	return {
		activeChats,
		activeTab,
		contacts,
		eventUnreadCount,
		handleHideEventChat,
		handleMessagePress,
		handleRemoveContact,
		isLoadingActive,
		openChatRoom,
		privateUnreadCount,
		selectedProfileClerkUserId,
		setActiveTab,
		setSelectedProfileClerkUserId,
	};
}
