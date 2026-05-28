// Horizontal list of the current user's active events for editing/deleting.
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { colors } from "../../constants/colors";
import { styles } from "../../styles/createEvent.styles";
import { SportEvent } from "../../types/events";
import { normalizeTime } from "../../utils/eventForm";

type MyEventsListProps = {
  myEvents: SportEvent[];
  editingEventId: number | null;
  isLoadingMyEvents: boolean;
  isSaving: boolean;
  onSelectEvent: (event: SportEvent) => void;
  onDeleteEvent: (event: SportEvent) => void;
};

export function MyEventsList({
  myEvents,
  editingEventId,
  isLoadingMyEvents,
  isSaving,
  onSelectEvent,
  onDeleteEvent,
}: MyEventsListProps) {
  const renderMyEventItem = ({ item }: { item: SportEvent }) => {
    const isSelected = editingEventId === item.id;
    const eventFormatLabel = item.event_format === "1v1" ? "1v1" : "Team";

    return (
      <View
        style={[
          styles.myEventCard,
          isSelected && styles.myEventCardActive,
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            styles.myEventCardContent,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => onSelectEvent(item)}
        >
          <Text style={styles.myEventTitle} numberOfLines={1}>
            {item.event_name}
          </Text>

          <Text style={styles.myEventSport} numberOfLines={1}>
            {item.sport_name}
          </Text>

          <Text style={styles.myEventMeta} numberOfLines={1}>
            {item.available_date.slice(0, 10)} · {normalizeTime(item.time_from)}
          </Text>

          <Text style={styles.myEventMeta} numberOfLines={1}>
            {eventFormatLabel}
          </Text>

          <Text style={styles.myEventMeta} numberOfLines={1}>
            {item.current_participants}/{item.max_participants} players
          </Text>
        </Pressable>

        <Pressable
          disabled={isSaving}
          style={({ pressed }) => [
            styles.myEventDeleteButton,
            (pressed || isSaving) && styles.buttonPressed,
          ]}
          onPress={() => onDeleteEvent(item)}
        >
          <Ionicons name="close" size={17} color="#fb7185" />
        </Pressable>
      </View>
    );
  };

  return (
    <>
      <Text style={styles.sectionTitle}>My Events</Text>

      {isLoadingMyEvents ? (
        <View style={styles.myEventsLoadingBlock}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : myEvents.length === 0 ? (
        <View style={styles.noMyEventsBlock}>
          <Text style={styles.noMyEventsTitle}>No events yet</Text>

          <Text style={styles.noMyEventsText}>
            Create your first event below.
          </Text>
        </View>
      ) : (
        <FlatList
          data={myEvents}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderMyEventItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.myEventsList}
        />
      )}
    </>
  );
}
