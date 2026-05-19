import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  View,
} from "react-native";
import { colors } from "../constants/colors";
import { sports } from "../data/sports";
import { styles } from "../styles/EventCard.styles";
import { SportEvent } from "../types/events";

type EventCardProps = {
  event: SportEvent;
  compact?: boolean;
  onPress?: () => void;
};

function getSportImage(sportName: string): ImageSourcePropType {
  const sport = sports.find(
    (item) => item.name.toLowerCase() === sportName.toLowerCase(),
  );

  return sport?.image ?? sports[0].image;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

function formatTime(time: string) {
  return time.slice(0, 5);
}

function formatDistance(distance: string | number | null | undefined) {
  if (distance === null || distance === undefined) {
    return null;
  }

  const numericDistance = Number(distance);

  if (Number.isNaN(numericDistance)) {
    return null;
  }

  if (numericDistance < 1) {
    return `${Math.round(numericDistance * 1000)} m away`;
  }

  return `${numericDistance.toFixed(1)} km away`;
}

export function EventCard({ event, compact = false, onPress }: EventCardProps) {
  const imageSource = event.event_image_url
    ? { uri: event.event_image_url }
    : getSportImage(event.sport_name);

  const distanceText = formatDistance(event.distance_km);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        compact && styles.compactCard,
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
    >
      <Image source={imageSource} style={styles.image} />

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {event.event_name}
          </Text>

          <Text style={styles.sportName} numberOfLines={1}>
            {event.sport_name}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Ionicons
            name="time-outline"
            size={14}
            color={colors.secondaryText}
          />

          <Text style={styles.metaText} numberOfLines={1}>
            {formatDate(event.available_date)} · {formatTime(event.time_from)}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Ionicons
            name="location-outline"
            size={14}
            color={colors.secondaryText}
          />

          <Text style={styles.metaText} numberOfLines={1}>
            {event.location_name}
          </Text>
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.playersText}>
            {event.current_participants}/{event.max_participants} players
          </Text>

          {distanceText && (
            <Text style={styles.distanceText}>{distanceText}</Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}
