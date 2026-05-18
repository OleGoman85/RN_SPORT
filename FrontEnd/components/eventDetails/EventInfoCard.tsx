import { Ionicons } from "@expo/vector-icons";
import { Image, Text, View } from "react-native";
import { colors } from "../../constants/colors";
import { styles } from "../../styles/eventDetailsModal.styles";
import { SportEvent } from "../../types/events";
import {
  formatDate,
  formatTime,
  getSportImage,
} from "../../utils/eventDetails";

type EventInfoCardProps = {
  event: SportEvent;
};

export function EventInfoCard({ event }: EventInfoCardProps) {
  const sportImage = getSportImage(event.sport_name);

  return (
    <View style={styles.eventCard}>
      <View style={styles.eventInfoSide}>
        <Text style={styles.eventTitle}>{event.event_name}</Text>

        <View style={styles.eventInfoRow}>
          <Ionicons name="football-outline" size={18} color={colors.primary} />

          <Text style={styles.eventInfoText}>{event.sport_name}</Text>
        </View>

        <View style={styles.eventInfoRow}>
          <Ionicons name="calendar-outline" size={18} color={colors.primary} />

          <Text style={styles.eventInfoText}>
            {formatDate(event.available_date)} · {formatTime(event.time_from)}
          </Text>
        </View>

        <View style={styles.eventInfoRow}>
          <Ionicons name="location-outline" size={18} color={colors.primary} />

          <Text style={styles.eventInfoText}>
            {event.location_name}
            {event.event_city ? `, ${event.event_city}` : ""}
          </Text>
        </View>

        <View style={styles.eventInfoRow}>
          <Ionicons name="people-outline" size={18} color={colors.primary} />

          <Text style={styles.eventInfoText}>
            {event.current_participants}/{event.max_participants} participants
          </Text>
        </View>

        {event.event_description ? (
          <Text style={styles.eventDescription}>{event.event_description}</Text>
        ) : null}
      </View>

      <View style={styles.eventImageSide}>
        {event.event_image_url ? (
          <Image
            source={{ uri: event.event_image_url }}
            style={styles.eventImage}
          />
        ) : sportImage ? (
          <Image source={sportImage} style={styles.eventImage} />
        ) : (
          <View style={styles.eventImageFallback}>
            <Ionicons name="image-outline" size={34} color={colors.primary} />
          </View>
        )}
      </View>
    </View>
  );
}
