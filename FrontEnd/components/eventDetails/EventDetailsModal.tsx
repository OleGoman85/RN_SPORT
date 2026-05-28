// Event details modal shell; behavior lives in useEventDetailsModal.
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Modal, Pressable, Text, View } from "react-native";
import { colors } from "../../constants/colors";
import { useEventDetailsModal } from "../../hooks/useEventDetailsModal";
import { styles } from "../../styles/eventDetailsModal.styles";
import { SportEvent } from "../../types/events";
import { EventDetailsActions } from "./EventDetailsActions";
import { EventDetailsContent } from "./EventDetailsContent";
import { UserProfileSheetContent } from "./UserProfileModal";

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
  const modal = useEventDetailsModal({
    eventId,
    visible,
    onClose,
    onEventUpdated,
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={modal.handleSheetClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={modal.handleSheetClose} />

        <View style={styles.sheet}>
          {modal.selectedProfileClerkUserId ? (
            <UserProfileSheetContent
              clerkUserId={modal.selectedProfileClerkUserId}
              onClose={() => modal.setSelectedProfileClerkUserId(null)}
            />
          ) : (
            <>
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

              {modal.isLoading || !modal.creator || !modal.event ? (
                <View style={styles.loadingBlock}>
                  <ActivityIndicator size="large" color={colors.primary} />

                  <Text style={styles.loadingText}>Loading event...</Text>
                </View>
              ) : (
                <>
                  <EventDetailsContent
                    creator={modal.creator}
                    event={modal.event}
                    members={modal.members}
                    onSelectMember={modal.setSelectedProfileClerkUserId}
                  />

                  <EventDetailsActions
                    isAddingContact={modal.isAddingContact}
                    isAlreadyJoined={modal.isAlreadyJoined}
                    isCreator={modal.isCreator}
                    isEventFull={modal.isEventFull}
                    isJoining={modal.isJoining}
                    isOpeningChat={modal.isOpeningChat}
                    onAddContact={modal.handleAddContactPress}
                    onMainAction={modal.handleMainActionPress}
                    onMessage={modal.handleMessagePress}
                  />
                </>
              )}
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}
