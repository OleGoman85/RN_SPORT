// Owns one chat room: loading messages, polling, sending, and local input state.
import { useUser } from "@clerk/expo";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { loadChatMessages, sendChatMessage } from "../services/chatsApi";
import { ChatMessage, ChatSummary } from "../types/chats";
import { getUniqueMessages } from "../utils/chatDisplay";

// Reads chatId from the route and provides everything the chat-room screen needs.
export function useChatRoom() {
	const { user } = useUser();
	const { chatId } = useLocalSearchParams<{ chatId: string }>();

	const [chat, setChat] = useState<ChatSummary | null>(null);
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [messageText, setMessageText] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [isSending, setIsSending] = useState(false);

	const numericChatId = Number(chatId);

	// Loads the full message list; silent polling uses showLoader=false.
	const loadMessages = useCallback(
		async (showLoader = true) => {
			if (!user?.id || Number.isNaN(numericChatId)) {
				setIsLoading(false);
				return;
			}

			try {
				if (showLoader) {
					setIsLoading(true);
				}

				const result = await loadChatMessages(numericChatId, user.id);

				setChat(result.chat);
				setMessages(getUniqueMessages(result.messages));
			} catch (error) {
				console.log("Chat loading error:", error);

				if (showLoader) {
					Alert.alert(
						"Could not load chat",
						error instanceof Error ? error.message : "Please try again.",
					);
				}
			} finally {
				if (showLoader) {
					setIsLoading(false);
				}
			}
		},
		[numericChatId, user?.id],
	);

	// Polls while the chat screen is mounted so new messages appear without leaving.
	useEffect(() => {
		loadMessages(true);

		const intervalId = setInterval(() => {
			loadMessages(false);
		}, 5000);

		return () => clearInterval(intervalId);
	}, [loadMessages]);

	// Sends the typed message and merges it into local state without duplicates.
	const handleSendPress = useCallback(async () => {
		const trimmedMessage = messageText.trim();

		if (!user?.id || Number.isNaN(numericChatId) || !trimmedMessage) {
			return;
		}

		try {
			setIsSending(true);

			const sentMessage = await sendChatMessage(
				numericChatId,
				user.id,
				trimmedMessage,
			);

			setMessages((currentMessages) =>
				getUniqueMessages([...currentMessages, sentMessage]),
			);
			setMessageText("");
		} catch (error) {
			console.log("Send message error:", error);
			Alert.alert(
				"Could not send message",
				error instanceof Error ? error.message : "Please try again.",
			);
		} finally {
			setIsSending(false);
		}
	}, [messageText, numericChatId, user?.id]);

	return {
		chat,
		currentClerkUserId: user?.id ?? null,
		handleSendPress,
		isLoading,
		isSending,
		messageText,
		messages,
		setMessageText,
	};
}
