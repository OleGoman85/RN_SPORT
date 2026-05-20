import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { colors } from "../../constants/colors";
import { addContactToBook } from "../../services/contactsApi";
import {
  joinSportEvent,
  loadSportEventDetails,
} from "../../services/eventsApi";
import { styles } from "../../styles/eventDetailsModal.styles";
import { EventDetails, SportEvent } from "../../types/events";
import { CreatorProfile } from "./CreatorProfile";
import { EventInfoCard } from "./EventInfoCard";
import { MemberCard } from "./MemberCard";

type EventDetailsModalProps = {
  eventId: number | null;
  visible: boolean;
  onClose: () => void;
  onEventUpdated?: (event: SportEvent) => void;
};

export function EventDetailsModal({
  eventId,
  visible,
  onClose,
  onEventUpdated,
}: EventDetailsModalProps) {
  const { user } = useUser();

  const [details, setDetails] = useState<EventDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isAddingContact, setIsAddingContact] = useState(false);

  useEffect(() => {
    if (!visible || eventId === null) {
      return;
    }

    const numericEventId = eventId;

    async function loadDetails() {
      try {
        setIsLoading(true);

        const loadedDetails = await loadSportEventDetails(numericEventId);

        setDetails(loadedDetails);
      } catch (error) {
        console.log("Event details loading error:", error);
        Alert.alert("Error", "Could not load event details.");
        onClose();
      } finally {
        setIsLoading(false);
      }
    }

    loadDetails();
  }, [eventId, visible, onClose]);

  const creator = details?.creator;
  const event = details?.event;

  const members = useMemo(() => {
    return details?.members ?? [];
  }, [details?.members]);

  const isCreator = Boolean(
    creator && user?.id && creator.clerk_user_id === user.id,
  );

  const isAlreadyJoined = useMemo(() => {
    return members.some((member) => member.clerk_user_id === user?.id);
  }, [members, user?.id]);

  const isEventFull =
    event !== undefined && event.current_participants >= event.max_participants;

  const handleJoinEvent = async () => {
    if (!eventId || !user?.id) {
      Alert.alert("Error", "User is not loaded yet.");
      return;
    }

    try {
      setIsJoining(true);

      const updatedEvent = await joinSportEvent(eventId, user.id);
      const updatedDetails = await loadSportEventDetails(eventId);

      setDetails(updatedDetails);
      onEventUpdated?.(updatedEvent);

      Alert.alert("Success", "You joined this event.");
    } catch (error) {
      console.log("Join event error:", error);

      Alert.alert(
        "Could not join event",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setIsJoining(false);
    }
  };

  const handleMessagePress = () => {
    Alert.alert("Coming soon", "Chat will be connected later.");
  };

  const handleAddContactPress = async () => {
    if (!creator || !user?.id) {
      Alert.alert("Error", "User is not loaded yet.");
      return;
    }

    if (isCreator) {
      Alert.alert("Contact", "This is your own profile.");
      return;
    }

    try {
      setIsAddingContact(true);

      const result = await addContactToBook(user.id, creator.clerk_user_id);

      Alert.alert(
        "Contact saved",
        result.is_new
          ? "This player was added to your contacts."
          : "This player is already in your contacts.",
      );
    } catch (error) {
      console.log("Add contact error:", error);

      Alert.alert(
        "Could not add contact",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setIsAddingContact(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.sheet}>
          <View style={styles.dragHandle} />

          <View style={styles.header}>
            <Text style={styles.headerTitle}>Event details</Text>

            <Pressable
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={onClose}
            >
              <Ionicons name="close" size={28} color={colors.text} />
            </Pressable>
          </View>

          {isLoading || !details || !creator || !event ? (
            <View style={styles.loadingBlock}>
              <ActivityIndicator size="large" color={colors.primary} />

              <Text style={styles.loadingText}>Loading event...</Text>
            </View>
          ) : (
            <>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
                <CreatorProfile creator={creator} />

                <EventInfoCard event={event} />

                <View style={styles.joinedSection}>
                  <Text style={styles.joinedTitle}>Joined players</Text>

                  {members.length === 0 ? (
                    <Text style={styles.emptyText}>Nobody has joined yet.</Text>
                  ) : (
                    members.map((member) => (
                      <MemberCard key={member.id} member={member} />
                    ))
                  )}
                </View>
              </ScrollView>

              <View style={styles.actions}>
                <Pressable
                  disabled={
                    isJoining || isCreator || isAlreadyJoined || isEventFull
                  }
                  style={({ pressed }) => [
                    styles.joinButton,
                    (isCreator || isAlreadyJoined || isEventFull) &&
                      styles.disabledButton,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={handleJoinEvent}
                >
                  <Text style={styles.joinButtonText}>
                    {isCreator
                      ? "Your event"
                      : isAlreadyJoined
                        ? "Already joined"
                        : isEventFull
                          ? "Event is full"
                          : isJoining
                            ? "Joining..."
                            : "Join Event"}
                  </Text>
                </Pressable>

                <View style={styles.secondaryActions}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.secondaryButton,
                      pressed && styles.buttonPressed,
                    ]}
                    onPress={handleMessagePress}
                  >
                    <Ionicons
                      name="chatbubble-outline"
                      size={22}
                      color={colors.text}
                    />

                    <Text style={styles.secondaryButtonText}>Message</Text>
                  </Pressable>

                  <Pressable
                    disabled={isAddingContact || isCreator}
                    style={({ pressed }) => [
                      styles.secondaryButton,
                      (isAddingContact || isCreator) && styles.disabledButton,
                      pressed && styles.buttonPressed,
                    ]}
                    onPress={handleAddContactPress}
                  >
                    <Ionicons
                      name={
                        isCreator
                          ? "person-circle-outline"
                          : "person-add-outline"
                      }
                      size={22}
                      color={colors.text}
                    />

                    <Text style={styles.secondaryButtonText}>
                      {isCreator
                        ? "Your profile"
                        : isAddingContact
                          ? "Saving..."
                          : "Add"}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}
