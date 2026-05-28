// Events tab screen: searchable/filterable list of public sport events.
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import * as Location from "expo-location";
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
import { EventDetailsModal } from "../../../components/eventDetails/EventDetailsModal";
import { colors } from "../../../constants/colors";
import {
  eventDayFilters,
  eventFormatFilters,
  eventRadiusFilters,
  loadSportEvents,
} from "../../../services/eventsApi";
import { styles } from "../../../styles/events.styles";
import {
  EventDayFilter,
  EventFormatFilter,
  EventRadiusFilter,
  SportEvent,
} from "../../../types/events";

export default function EventsScreen() {
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [activeFilter, setActiveFilter] = useState<EventDayFilter>("all");
  const [activeFormatFilter, setActiveFormatFilter] =
    useState<EventFormatFilter>("all");
  const [activeRadiusFilter, setActiveRadiusFilter] =
    useState<EventRadiusFilter>("all");
  const [searchText, setSearchText] = useState("");
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadCurrentLocation = useCallback(async () => {
    try {
      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== "granted") {
        Alert.alert(
          "Permission required",
          "Location permission is required to use nearby filters.",
        );

        return null;
      }

      const currentPosition = await Location.getCurrentPositionAsync({});

      return {
        latitude: currentPosition.coords.latitude,
        longitude: currentPosition.coords.longitude,
      };
    } catch (error) {
      console.log("Device location loading error:", error);

      Alert.alert("Error", "Could not get current location.");

      return null;
    }
  }, []);

  const loadSearchCoordinates = useCallback(async () => {
    if (activeRadiusFilter === "all") {
      return null;
    }

    const currentCoordinates = await loadCurrentLocation();

    if (!currentCoordinates) {
      setActiveRadiusFilter("all");

      return null;
    }

    return currentCoordinates;
  }, [activeRadiusFilter, loadCurrentLocation]);

  const handleRadiusFilterPress = (filter: EventRadiusFilter) => {
    setActiveRadiusFilter(filter);
  };

  const loadEvents = useCallback(async () => {
    try {
      setIsLoading(true);

      const searchCoordinates = await loadSearchCoordinates();
      const radiusKm =
        activeRadiusFilter !== "all" && searchCoordinates
          ? activeRadiusFilter
          : null;

      const loadedEvents = await loadSportEvents({
        day: activeFilter,
        eventFormat: activeFormatFilter,
        radiusKm,
        search: searchText,
        latitude: searchCoordinates?.latitude ?? null,
        longitude: searchCoordinates?.longitude ?? null,
      });

      setEvents(loadedEvents);
    } catch (error) {
      console.log("Events loading error:", error);
      Alert.alert("Error", "Could not load events.");
    } finally {
      setIsLoading(false);
    }
  }, [
    activeFilter,
    activeFormatFilter,
    activeRadiusFilter,
    loadSearchCoordinates,
    searchText,
  ]);

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

  const handleFormatFilterPress = (filter: EventFormatFilter) => {
    setActiveFormatFilter(filter);
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
                filter.value === "all" && styles.dayFilterButtonSmall,
                filter.value === "today" && styles.dayFilterButtonMedium,
                (filter.value === "tomorrow" || filter.value === "week") &&
                  styles.dayFilterButtonLarge,
                isActive && styles.filterButtonActive,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => handleFilterPress(filter.value)}
            >
              <Text
                style={[styles.filterText, isActive && styles.filterTextActive]}
                numberOfLines={1}
              >
                {filter.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.filtersRow}>
        {eventFormatFilters.map((filter) => {
          const isActive = activeFormatFilter === filter.value;

          return (
            <Pressable
              key={filter.value}
              style={({ pressed }) => [
                styles.filterButton,
                isActive && styles.filterButtonActive,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => handleFormatFilterPress(filter.value)}
            >
              <Text
                style={[styles.filterText, isActive && styles.filterTextActive]}
                numberOfLines={1}
              >
                {filter.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.radiusHeaderRow}>
        <View style={styles.radiusTitleRow}>
          <Ionicons name="navigate-outline" size={15} color={colors.primary} />

          <Text style={styles.radiusTitle}>
            Nearby:{" "}
            {activeRadiusFilter === "all" ? "All" : `${activeRadiusFilter} km`}
          </Text>
        </View>
      </View>

      <View style={styles.radiusFiltersRow}>
        {eventRadiusFilters.map((filter) => {
          const isActive = activeRadiusFilter === filter.value;

          return (
            <Pressable
              key={filter.value}
              style={({ pressed }) => [
                styles.radiusFilterButton,
                isActive && styles.filterButtonActive,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => handleRadiusFilterPress(filter.value)}
            >
              <Text
                style={[styles.filterText, isActive && styles.filterTextActive]}
                numberOfLines={1}
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
