// Chat room route: renders one private or event chat by chatId.
import { router } from "expo-router";
import { useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChatComposer } from "../../../components/chat/ChatComposer";
import { ChatHeader } from "../../../components/chat/ChatHeader";
import { EmptyMessages } from "../../../components/chat/EmptyMessages";
import { MessageBubble } from "../../../components/chat/MessageBubble";
import { colors } from "../../../constants/colors";
import { useChatRoom } from "../../../hooks/useChatRoom";
import { styles } from "../../../styles/chatRoom.styles";
import { ChatMessage } from "../../../types/chats";

export default function ChatRoomScreen() {
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<ChatMessage>>(null);
  const chatRoom = useChatRoom();

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <MessageBubble
      message={item}
      currentClerkUserId={chatRoom.currentClerkUserId}
      showSenderName={chatRoom.chat?.type === "event"}
    />
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ChatHeader
        chat={chatRoom.chat}
        topInset={insets.top}
        onBack={() => router.back()}
      />

      {chatRoom.isLoading ? (
        <View style={styles.centerBlock}>
          <ActivityIndicator size="large" color={colors.primary} />

          <Text style={styles.centerText}>Loading messages...</Text>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={chatRoom.messages}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() =>
            listRef.current?.scrollToEnd({ animated: true })
          }
          ListEmptyComponent={<EmptyMessages />}
          showsVerticalScrollIndicator={false}
        />
      )}

      <ChatComposer
        bottomInset={insets.bottom}
        isSending={chatRoom.isSending}
        messageText={chatRoom.messageText}
        onChangeMessageText={chatRoom.setMessageText}
        onSend={chatRoom.handleSendPress}
      />
    </KeyboardAvoidingView>
  );
}
