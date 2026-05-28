// Header for chat room screens, with title/subtitle based on chat type.
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { colors } from "../../constants/colors";
import { styles } from "../../styles/chatRoom.styles";
import { ChatSummary } from "../../types/chats";
import { getChatRoomSubtitle, getChatRoomTitle } from "../../utils/chatDisplay";

type ChatHeaderProps = {
  chat: ChatSummary | null;
  topInset: number;
  onBack: () => void;
};

export function ChatHeader({ chat, topInset, onBack }: ChatHeaderProps) {
  return (
    <View style={[styles.header, { paddingTop: topInset + 8 }]}>
      <Pressable
        style={({ pressed }) => [
          styles.backButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={onBack}
      >
        <Ionicons name="chevron-back" size={25} color={colors.text} />
      </Pressable>

      <View style={styles.headerInfo}>
        <Text style={styles.title} numberOfLines={1}>
          {getChatRoomTitle(chat)}
        </Text>

        <Text style={styles.subtitle} numberOfLines={1}>
          {getChatRoomSubtitle(chat)}
        </Text>
      </View>
    </View>
  );
}
