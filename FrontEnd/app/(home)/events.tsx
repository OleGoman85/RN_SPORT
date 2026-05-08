import { useUser } from "@clerk/expo";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { colors } from "../../constants/colors";
import { sports } from "../../data/sports";
import { loadSportEvents } from "../../services/eventsApi";
import { styles } from "../../styles/events.styles";
import { SportEvent } from "../../types/opponentSearch";

type SortMode = "date" | "sport" | "city";

function getSportImage(sportName: string) {
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

function formatRating(event: SportEvent) {
  if (!event.rating_avg || event.rating_count === 0) {
    return "New";
  }

  return `${Number(event.rating_avg).toFixed(1)} (${event.games_count} games)`;
}

function EventDetailsModal({
  event,
  isMyEvent,
  onClose,
}: {
  event: SportEvent | null;
  isMyEvent: boolean;
  onClose: () => void;
}) {
  if (!event) {
    return null;
  }

  return (
    <Modal visible={Boolean(event)} animationType="fade" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Image
              source={getSportImage(event.sport_name)}
              style={styles.modalSportImage}
            />

            <View style={styles.modalHeaderInfo}>
              <Text style={styles.modalTitle}>{event.sport_name}</Text>

              <Text style={styles.modalSubtitle}>
                {event.nickname} · {event.city}
              </Text>

              <Text style={styles.ratingText}>★ {formatRating(event)}</Text>
            </View>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.infoText}>Level: {event.level}</Text>

            <Text style={styles.infoText}>
              Date: {formatDate(event.available_date)}
            </Text>

            <Text style={styles.infoText}>
              Time: {event.time_from.slice(0, 5)} - {event.time_to.slice(0, 5)}
            </Text>

            <Text style={styles.infoText}>Match type: {event.match_type}</Text>

            <Text style={styles.infoText}>
              Location:{" "}
              {event.location_mode === "city"
                ? event.event_city
                : `${event.radius_km} km radius`}
            </Text>
          </View>

          <View style={styles.profileBlock}>
            <Text style={styles.profileTitle}>Player profile</Text>

            <Text style={styles.profileText}>
              {event.first_name} {event.last_name}
            </Text>

            <Text style={styles.profileText}>
              Age: {event.age} · {event.sex}
            </Text>

            <Text style={styles.profileText}>
              {event.city}, {event.country}
            </Text>

            {event.about_me && (
              <Text style={styles.aboutMe}>{event.about_me}</Text>
            )}
          </View>

          <View style={styles.modalActions}>
            <Pressable
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>

            {isMyEvent ? (
              <>
                <Pressable
                  style={({ pressed }) => [
                    styles.secondaryButton,
                    pressed && styles.buttonPressed,
                  ]}
                >
                  <Text style={styles.secondaryButtonText}>Edit</Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    styles.deleteButton,
                    pressed && styles.buttonPressed,
                  ]}
                >
                  <Text style={styles.actionButtonText}>Delete</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Pressable
                  style={({ pressed }) => [
                    styles.secondaryButton,
                    pressed && styles.buttonPressed,
                  ]}
                >
                  <Text style={styles.secondaryButtonText}>Message</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

function EventCard({
  event,
  onPress,
}: {
  event: SportEvent;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
    >
      <Image
        source={getSportImage(event.sport_name)}
        style={styles.cardImage}
      />

      <View style={styles.cardContent}>
        <Text style={styles.sportName} numberOfLines={1}>
          {event.sport_name}
        </Text>

        <Text style={styles.nickname} numberOfLines={1}>
          {event.nickname}
        </Text>

        <Text style={styles.cardText} numberOfLines={1}>
          {event.city}
        </Text>

        <Text style={styles.cardText}>{formatDate(event.available_date)}</Text>

        <Text style={styles.ratingText} numberOfLines={1}>
          ★ {formatRating(event)}
        </Text>
      </View>
    </Pressable>
  );
}

export default function EventsScreen() {
  const { user } = useUser();

  const [events, setEvents] = useState<SportEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<SportEvent | null>(null);
  const [cityFilter, setCityFilter] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("date");

  const loadEvents = async () => {
    try {
      setIsLoading(true);

      const loadedEvents = await loadSportEvents();

      setEvents(loadedEvents);
    } catch (error) {
      console.log("Events loading error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadEvents();
    }, []),
  );

  const visibleEvents = useMemo(() => {
    const filteredEvents = events.filter((event) => {
      if (!cityFilter.trim()) {
        return true;
      }

      return event.city.toLowerCase().includes(cityFilter.toLowerCase());
    });

    return [...filteredEvents].sort((firstEvent, secondEvent) => {
      if (sortMode === "sport") {
        return firstEvent.sport_name.localeCompare(secondEvent.sport_name);
      }

      if (sortMode === "city") {
        return firstEvent.city.localeCompare(secondEvent.city);
      }

      return (
        new Date(firstEvent.available_date).getTime() -
        new Date(secondEvent.available_date).getTime()
      );
    });
  }, [events, cityFilter, sortMode]);

  const isMySelectedEvent =
    Boolean(selectedEvent) && selectedEvent?.clerk_user_id === user?.id;

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />

        <Text style={styles.loadingText}>Loading events...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Events</Text>

        <Text style={styles.subtitle}>
          Open sport requests from other users.
        </Text>
      </View>

      <View style={styles.filterBlock}>
        <TextInput
          style={styles.searchInput}
          value={cityFilter}
          onChangeText={setCityFilter}
          placeholder="Filter by city..."
          placeholderTextColor={colors.secondaryText}
        />

        <View style={styles.sortRow}>
          <Pressable
            style={[
              styles.sortButton,
              sortMode === "date" && styles.sortButtonActive,
            ]}
            onPress={() => setSortMode("date")}
          >
            <Text style={styles.sortButtonText}>Date</Text>
          </Pressable>

          <Pressable
            style={[
              styles.sortButton,
              sortMode === "sport" && styles.sortButtonActive,
            ]}
            onPress={() => setSortMode("sport")}
          >
            <Text style={styles.sortButtonText}>Sport</Text>
          </Pressable>

          <Pressable
            style={[
              styles.sortButton,
              sortMode === "city" && styles.sortButtonActive,
            ]}
            onPress={() => setSortMode("city")}
          >
            <Text style={styles.sortButtonText}>City</Text>
          </Pressable>
        </View>
      </View>

      {visibleEvents.length === 0 ? (
        <View style={styles.emptyBlock}>
          <Text style={styles.emptyTitle}>No events found</Text>

          <Text style={styles.emptyText}>
            Try changing city filter or search parameters.
          </Text>
        </View>
      ) : (
        <FlatList
          data={visibleEvents}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <EventCard event={item} onPress={() => setSelectedEvent(item)} />
          )}
          numColumns={3}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <EventDetailsModal
        event={selectedEvent}
        isMyEvent={isMySelectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </View>
  );
}
