// Contacts tab screen: renders Messages, Event Chats, and saved Contacts sections.
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { ChatListCard } from "../../../components/contacts/ChatListCard";
import { ContactCard } from "../../../components/contacts/ContactCard";
import { ContactsEmptyState } from "../../../components/contacts/ContactsEmptyState";
import { ContactsTabs } from "../../../components/contacts/ContactsTabs";
import { UserProfileModal } from "../../../components/eventDetails/UserProfileModal";
import { colors } from "../../../constants/colors";
import { useContactsChatsScreen } from "../../../hooks/useContactsChatsScreen";
import { styles } from "../../../styles/contacts.styles";
import { ChatSummary } from "../../../types/chats";
import { ContactUser } from "../../../types/contacts";

export default function ContactsScreen() {
  const screen = useContactsChatsScreen();

  const renderContact = ({ item }: { item: ContactUser }) => (
    <ContactCard
      contact={item}
      onOpenProfile={screen.setSelectedProfileClerkUserId}
      onMessage={screen.handleMessagePress}
      onRemove={screen.handleRemoveContact}
    />
  );

  const renderChat = ({ item }: { item: ChatSummary }) => (
    <ChatListCard
      chat={item}
      onOpen={screen.openChatRoom}
      onHidePastEventChat={screen.handleHideEventChat}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Contacts</Text>

          <Text style={styles.subtitle}>Messages, events, saved players.</Text>
        </View>

        <View style={styles.headerIcon}>
          <Ionicons name="people-outline" size={22} color={colors.text} />
        </View>
      </View>

      <ContactsTabs
        activeTab={screen.activeTab}
        privateUnreadCount={screen.privateUnreadCount}
        eventUnreadCount={screen.eventUnreadCount}
        onChangeTab={screen.setActiveTab}
      />

      {screen.isLoadingActive ? (
        <View style={styles.centerBlock}>
          <ActivityIndicator size="large" color={colors.primary} />

          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : screen.activeTab === "contacts" ? (
        screen.contacts.length === 0 ? (
          <ContactsEmptyState activeTab={screen.activeTab} />
        ) : (
          <FlatList
            data={screen.contacts}
            keyExtractor={(item) => item.clerk_user_id}
            renderItem={renderContact}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )
      ) : screen.activeChats.length === 0 ? (
        <ContactsEmptyState activeTab={screen.activeTab} />
      ) : (
        <FlatList
          data={screen.activeChats}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderChat}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <UserProfileModal
        clerkUserId={screen.selectedProfileClerkUserId}
        visible={screen.selectedProfileClerkUserId !== null}
        onClose={() => screen.setSelectedProfileClerkUserId(null)}
      />
    </View>
  );
}
