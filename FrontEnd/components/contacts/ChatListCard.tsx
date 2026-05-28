// One row in Messages/Event Chats lists, including unread and hide controls.
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { UserAvatar } from "../eventDetails/UserAvatar";
import { colors } from "../../constants/colors";
import { styles } from "../../styles/contacts.styles";
import { ChatSummary } from "../../types/chats";
import {
  formatBadgeCount,
  formatChatTime,
  getChatListSubtitle,
  getChatListTitle,
  isPastEventChat,
} from "../../utils/chatDisplay";

type ChatListCardProps = {
  chat: ChatSummary;
  onOpen: (chatId: number) => void;
  onHidePastEventChat: (chat: ChatSummary) => void;
};

export function ChatListCard({
  chat,
  onOpen,
  onHidePastEventChat,
}: ChatListCardProps) {
  const title = getChatListTitle(chat);
  const chatTime = formatChatTime(chat.last_message_at ?? chat.updated_at);
  const isPrivate = chat.type === "private";
  const canHideEventChat = isPastEventChat(chat);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.chatCard,
        pressed && styles.buttonPressed,
      ]}
      onPress={() => onOpen(chat.id)}
    >
      {isPrivate ? (
        <UserAvatar avatarUrl={chat.other_avatar_url} name={title} size={52} />
      ) : (
        <View style={styles.eventChatAvatar}>
          <Ionicons name="calendar" size={22} color={colors.background} />
        </View>
      )}

      <View style={styles.chatInfo}>
        <View style={styles.chatTitleRow}>
          <Text style={styles.chatTitle} numberOfLines={1}>
            {title}
          </Text>

          {chatTime && (
            <Text style={styles.chatTime} numberOfLines={1}>
              {chatTime}
            </Text>
          )}
        </View>

        <Text style={styles.chatSubtitle} numberOfLines={2}>
          {getChatListSubtitle(chat)}
        </Text>
      </View>

      {(chat.unread_count > 0 || canHideEventChat) && (
        <View style={styles.chatActions}>
          {chat.unread_count > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>
                {formatBadgeCount(chat.unread_count)}
              </Text>
            </View>
          )}

          {canHideEventChat && (
            <Pressable
              style={({ pressed }) => [
                styles.hideChatButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={(event) => {
                event.stopPropagation();
                onHidePastEventChat(chat);
              }}
            >
              <Ionicons name="close" size={18} color="#fb7185" />
            </Pressable>
          )}
        </View>
      )}
    </Pressable>
  );
}
