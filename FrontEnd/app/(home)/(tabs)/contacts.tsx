import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { UserAvatar } from "../../../components/eventDetails/UserAvatar";
import { colors } from "../../../constants/colors";
import {
  loadContacts,
  removeContactFromBook,
} from "../../../services/contactsApi";
import { styles } from "../../../styles/contacts.styles";
import { ContactUser } from "../../../types/contacts";
import {
  formatRating,
  getFullName,
  getNickname,
} from "../../../utils/eventDetails";

export default function ContactsScreen() {
  const { user } = useUser();

  const [contacts, setContacts] = useState<ContactUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSavedContacts = useCallback(async () => {
    if (!user?.id) {
      setContacts([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      const loadedContacts = await loadContacts(user.id);

      setContacts(loadedContacts);
    } catch (error) {
      console.log("Contacts loading error:", error);
      Alert.alert("Error", "Could not load contacts.");
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      loadSavedContacts();
    }, [loadSavedContacts]),
  );

  const handleMessagePress = (contact: ContactUser) => {
    Alert.alert(
      "Messages coming soon",
      `Chat with ${getFullName(contact)} will be connected next.`,
    );
  };

  const handleRemoveContact = (contact: ContactUser) => {
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
  };

  const renderContact = ({ item }: { item: ContactUser }) => {
    const fullName = getFullName(item);

    return (
      <View style={styles.contactCard}>
        <UserAvatar avatarUrl={item.avatar_url} name={fullName} size={58} />

        <View style={styles.contactInfo}>
          <Text style={styles.contactName} numberOfLines={1}>
            {fullName}
          </Text>

          <Text style={styles.contactNickname} numberOfLines={1}>
            {getNickname(item)}
          </Text>

          <View style={styles.metaRow}>
            <Ionicons
              name="location-outline"
              size={15}
              color={colors.primary}
            />

            <Text style={styles.metaText} numberOfLines={1}>
              {item.city ?? "City not added"}
              {item.country ? `, ${item.country}` : ""}
            </Text>
          </View>

          <View style={styles.statsRow}>
            <Text style={styles.statText}>
              {formatRating(item.rating_avg)} trust
            </Text>

            <Text style={styles.statText}>
              {item.events_created_count} events
            </Text>
          </View>
        </View>

        <View style={styles.cardActions}>
          <Pressable
            style={({ pressed }) => [
              styles.iconButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => handleMessagePress(item)}
          >
            <Ionicons name="chatbubble-outline" size={20} color={colors.text} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.iconButton,
              styles.removeButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => handleRemoveContact(item)}
          >
            <Ionicons name="trash-outline" size={20} color="#fb7185" />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Contacts</Text>

          <Text style={styles.subtitle}>Saved players from events.</Text>
        </View>

        <View style={styles.headerIcon}>
          <Ionicons name="people-outline" size={22} color={colors.text} />
        </View>
      </View>

      {isLoading ? (
        <View style={styles.centerBlock}>
          <ActivityIndicator size="large" color={colors.primary} />

          <Text style={styles.loadingText}>Loading contacts...</Text>
        </View>
      ) : contacts.length === 0 ? (
        <View style={styles.emptyBlock}>
          <Ionicons
            name="person-add-outline"
            size={28}
            color={colors.primary}
          />

          <Text style={styles.emptyTitle}>No contacts yet</Text>

          <Text style={styles.emptyText}>
            Save players from event details to see them here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={contacts}
          keyExtractor={(item) => item.clerk_user_id}
          renderItem={renderContact}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
