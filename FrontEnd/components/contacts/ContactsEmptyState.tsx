// Empty state for Messages, Event Chats, or Contacts section.
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { colors } from "../../constants/colors";
import { styles } from "../../styles/contacts.styles";
import { ContactsTab } from "../../utils/chatDisplay";

type ContactsEmptyStateProps = {
  activeTab: ContactsTab;
};

export function ContactsEmptyState({ activeTab }: ContactsEmptyStateProps) {
  if (activeTab === "contacts") {
    return (
      <View style={styles.emptyBlock}>
        <Ionicons name="person-add-outline" size={28} color={colors.primary} />

        <Text style={styles.emptyTitle}>No contacts yet</Text>

        <Text style={styles.emptyText}>
          Save players from event details to see them here.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.emptyBlock}>
      <Ionicons
        name={
          activeTab === "messages" ? "chatbubble-outline" : "calendar-outline"
        }
        size={28}
        color={colors.primary}
      />

      <Text style={styles.emptyTitle}>
        {activeTab === "messages" ? "No messages yet" : "No event chats yet"}
      </Text>

      <Text style={styles.emptyText}>
        {activeTab === "messages"
          ? "Open a saved contact and start a private chat."
          : "Join or create events to see their chats here."}
      </Text>
    </View>
  );
}
