import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { EventCard } from "../../../components/EventCard";
import { EventDetailsModal } from "../../../components/EventDetailsModal";
import { colors } from "../../../constants/colors";
import { eventDayFilters, loadSportEvents } from "../../../services/eventsApi";
import { styles } from "../../../styles/events.styles";
import { EventDayFilter, SportEvent } from "../../../types/events";

export default function EventsScreen() {
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [activeFilter, setActiveFilter] = useState<EventDayFilter>("all");
  const [searchText, setSearchText] = useState("");
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadEvents = useCallback(async () => {
    try {
      setIsLoading(true);

      const loadedEvents = await loadSportEvents({
        day: activeFilter,
        search: searchText,
      });

      setEvents(loadedEvents);
    } catch (error) {
      console.log("Events loading error:", error);
      Alert.alert("Error", "Could not load events.");
    } finally {
      setIsLoading(false);
    }
  }, [activeFilter, searchText]);

  useFocusEffect(
    useCallback(() => {
      loadEvents();
    }, [loadEvents]),
  );

  const handleSubmitSearch = () => {
    loadEvents();
  };

  const handleFilterPress = (filter: EventDayFilter) => {
    setActiveFilter(filter);
  };

  const handleEventPress = (eventId: number) => {
    setSelectedEventId(eventId);
    setIsDetailsVisible(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsVisible(false);
    setSelectedEventId(null);
  };

  const handleEventUpdated = (updatedEvent: SportEvent) => {
    setEvents((currentEvents) =>
      currentEvents.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event,
      ),
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Events</Text>

          <Text style={styles.subtitle}>
            Find events by day and sport name.
          </Text>
        </View>

        <View style={styles.headerIcon}>
          <Ionicons name="calendar-outline" size={22} color={colors.text} />
        </View>
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={colors.secondaryText} />

        <TextInput
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSubmitSearch}
          placeholder="Search sport or event..."
          placeholderTextColor={colors.secondaryText}
          returnKeyType="search"
        />
      </View>

      <View style={styles.filtersRow}>
        {eventDayFilters.map((filter) => {
          const isActive = activeFilter === filter.value;

          return (
            <Pressable
              key={filter.value}
              style={({ pressed }) => [
                styles.filterButton,
                isActive && styles.filterButtonActive,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => handleFilterPress(filter.value)}
            >
              <Text
                style={[styles.filterText, isActive && styles.filterTextActive]}
              >
                {filter.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {isLoading ? (
        <View style={styles.centerBlock}>
          <ActivityIndicator size="large" color={colors.primary} />

          <Text style={styles.loadingText}>Loading events...</Text>
        </View>
      ) : events.length === 0 ? (
        <View style={styles.emptyBlock}>
          <Text style={styles.emptyTitle}>No events found</Text>

          <Text style={styles.emptyText}>Try another day or sport name.</Text>
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <EventCard event={item} onPress={() => handleEventPress(item.id)} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <EventDetailsModal
        eventId={selectedEventId}
        visible={isDetailsVisible}
        onClose={handleCloseDetails}
        onEventUpdated={handleEventUpdated}
      />
    </View>
  );
}
