// Empty state shown before a chat has any messages.
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { colors } from "../../constants/colors";
import { styles } from "../../styles/chatRoom.styles";

export function EmptyMessages() {
  return (
    <View style={styles.emptyBlock}>
      <Ionicons
        name="chatbubble-ellipses-outline"
        size={30}
        color={colors.primary}
      />

      <Text style={styles.emptyTitle}>No messages yet</Text>

      <Text style={styles.emptyText}>
        Start the conversation with a short message.
      </Text>
    </View>
  );
}
