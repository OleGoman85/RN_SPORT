// One message bubble, styled differently for current user vs other users.
import { Text, View } from "react-native";
import { styles } from "../../styles/chatRoom.styles";
import { ChatMessage } from "../../types/chats";
import { formatMessageTime, getSenderName } from "../../utils/chatDisplay";

type MessageBubbleProps = {
  message: ChatMessage;
  currentClerkUserId: string | null;
  showSenderName: boolean;
};

export function MessageBubble({
  message,
  currentClerkUserId,
  showSenderName,
}: MessageBubbleProps) {
  const isMine = message.sender_clerk_user_id === currentClerkUserId;

  return (
    <View
      style={[
        styles.messageRow,
        isMine ? styles.myMessageRow : styles.otherMessageRow,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          isMine ? styles.myMessageBubble : styles.otherMessageBubble,
        ]}
      >
        {!isMine && showSenderName && (
          <Text style={styles.senderName} numberOfLines={1}>
            {getSenderName(message)}
          </Text>
        )}

        <Text style={[styles.messageText, isMine && styles.myMessageText]}>
          {message.message_text}
        </Text>

        <Text style={[styles.messageTime, isMine && styles.myMessageTime]}>
          {formatMessageTime(message.created_at)}
        </Text>
      </View>
    </View>
  );
}
