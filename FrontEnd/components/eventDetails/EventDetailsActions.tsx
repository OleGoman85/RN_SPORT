// Bottom action area for joining/opening chats/adding contact in event details.
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { colors } from "../../constants/colors";
import { styles } from "../../styles/eventDetailsModal.styles";

type EventDetailsActionsProps = {
  isAddingContact: boolean;
  isAlreadyJoined: boolean;
  isCreator: boolean;
  isEventFull: boolean;
  isJoining: boolean;
  isOpeningChat: boolean;
  onAddContact: () => void;
  onMainAction: () => void;
  onMessage: () => void;
};

function getMainButtonText({
  isAlreadyJoined,
  isCreator,
  isEventFull,
  isJoining,
  isOpeningChat,
}: Pick<
  EventDetailsActionsProps,
  | "isAlreadyJoined"
  | "isCreator"
  | "isEventFull"
  | "isJoining"
  | "isOpeningChat"
>) {
  if (isOpeningChat) {
    return "Opening chat...";
  }

  if (isCreator || isAlreadyJoined) {
    return "Open Event Chat";
  }

  if (isEventFull) {
    return "Event is full";
  }

  if (isJoining) {
    return "Joining...";
  }

  return "Join Event";
}

export function EventDetailsActions({
  isAddingContact,
  isAlreadyJoined,
  isCreator,
  isEventFull,
  isJoining,
  isOpeningChat,
  onAddContact,
  onMainAction,
  onMessage,
}: EventDetailsActionsProps) {
  const isMainDisabled =
    isJoining ||
    isOpeningChat ||
    (!isCreator && !isAlreadyJoined && isEventFull);

  return (
    <View style={styles.actions}>
      <Pressable
        disabled={isMainDisabled}
        style={({ pressed }) => [
          styles.joinButton,
          ((!isCreator && !isAlreadyJoined && isEventFull) || isOpeningChat) &&
            styles.disabledButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={onMainAction}
      >
        <Text style={styles.joinButtonText}>
          {getMainButtonText({
            isAlreadyJoined,
            isCreator,
            isEventFull,
            isJoining,
            isOpeningChat,
          })}
        </Text>
      </Pressable>

      <View style={styles.secondaryActions}>
        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={onMessage}
        >
          <Ionicons name="chatbubble-outline" size={22} color={colors.text} />

          <Text style={styles.secondaryButtonText}>Message</Text>
        </Pressable>

        <Pressable
          disabled={isAddingContact || isCreator}
          style={({ pressed }) => [
            styles.secondaryButton,
            (isAddingContact || isCreator) && styles.disabledButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={onAddContact}
        >
          <Ionicons
            name={isCreator ? "person-circle-outline" : "person-add-outline"}
            size={22}
            color={colors.text}
          />

          <Text style={styles.secondaryButtonText}>
            {isCreator ? "Your profile" : isAddingContact ? "Saving..." : "Add"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
