// Home tab screen: nearby event discovery, sport shortcuts, and unread chat badge.
import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import * as Location from "expo-location";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { EventCard } from "../../../components/EventCard";
import { EventDetailsModal } from "../../../components/eventDetails/EventDetailsModal";
import { colors } from "../../../constants/colors";
import { Sport, sports } from "../../../data/sports";
import { loadUnreadChatCounts } from "../../../services/chatsApi";
import { loadSportEvents } from "../../../services/eventsApi";
import { styles } from "../../../styles/home.styles";
import { UnreadChatCounts } from "../../../types/chats";
import { SportEvent } from "../../../types/events";

function formatBadgeCount(count: number) {
  return count > 9 ? "9+" : String(count);
}

export default function HomeScreen() {
  const { user } = useUser();

  const [searchText, setSearchText] = useState("");
  const [selectedSport, setSelectedSport] = useState("");
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<UnreadChatCounts>({
    private: 0,
    event: 0,
    total: 0,
  });

  const filteredSports = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) {
      return sports;
    }

    return sports.filter((sport) => sport.name.toLowerCase().includes(query));
  }, [searchText]);

  const loadLocationAndEvents = useCallback(
    async (sportName = selectedSport) => {
      try {
        setIsLoading(true);

        let currentLatitude = latitude;
        let currentLongitude = longitude;

        if (currentLatitude === null || currentLongitude === null) {
          try {
            const permission =
              await Location.requestForegroundPermissionsAsync();

            if (permission.status === "granted") {
              const currentPosition = await Location.getCurrentPositionAsync(
                {},
              );

              currentLatitude = currentPosition.coords.latitude;
              currentLongitude = currentPosition.coords.longitude;

              setLatitude(currentLatitude);
              setLongitude(currentLongitude);
            }
          } catch (error) {
            console.log("Home location unavailable:", error);

            currentLatitude = null;
            currentLongitude = null;
          }
        }

        const loadedEvents = await loadSportEvents({
          search: searchText,
          sport: sportName,
          latitude: currentLatitude,
          longitude: currentLongitude,
        });

        setEvents(loadedEvents.slice(0, 10));
      } catch (error) {
        console.log("Home events loading error:", error);
        Alert.alert("Error", "Could not load nearby events.");
      } finally {
        setIsLoading(false);
      }
    },
    [latitude, longitude, searchText, selectedSport],
  );

  useFocusEffect(
    useCallback(() => {
      loadLocationAndEvents();
    }, [loadLocationAndEvents]),
  );

  const loadUnreadCounts = useCallback(async () => {
    if (!user?.id) {
      setUnreadCounts({
        private: 0,
        event: 0,
        total: 0,
      });
      return;
    }

    try {
      const loadedUnreadCounts = await loadUnreadChatCounts(user.id);

      setUnreadCounts(loadedUnreadCounts);
    } catch (error) {
      console.log("Home unread counts loading error:", error);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      loadUnreadCounts();

      const intervalId = setInterval(loadUnreadCounts, 12000);

      return () => clearInterval(intervalId);
    }, [loadUnreadCounts]),
  );

  const handleSearchSubmit = useCallback(() => {
    loadLocationAndEvents();
  }, [loadLocationAndEvents]);

  const handleSportPress = useCallback(
    (sport: Sport) => {
      const nextSport = selectedSport === sport.name ? "" : sport.name;

      setSelectedSport(nextSport);
      loadLocationAndEvents(nextSport);
    },
    [loadLocationAndEvents, selectedSport],
  );

  const handleEventPress = useCallback((eventId: number) => {
    setSelectedEventId(eventId);
    setIsDetailsVisible(true);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setIsDetailsVisible(false);
    setSelectedEventId(null);
  }, []);

  const handleEventUpdated = useCallback((updatedEvent: SportEvent) => {
    setEvents((currentEvents) =>
      currentEvents.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event,
      ),
    );
  }, []);

  const handleNotificationPress = useCallback(() => {
    const targetTab =
      unreadCounts.total === 0 || unreadCounts.private > 0
        ? "messages"
        : "eventChats";

    router.push({
      pathname: "/(home)/(tabs)/contacts",
      params: {
        tab: targetTab,
      },
    });
  }, [unreadCounts.private, unreadCounts.total]);

  const renderSportItem = useCallback(
    ({ item }: { item: Sport }) => {
      const isSelected = selectedSport === item.name;

      return (
        <Pressable
          style={({ pressed }) => [
            styles.sportItem,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => handleSportPress(item)}
        >
          <View
            style={[styles.sportIcon, isSelected && styles.sportIconActive]}
          >
            <Image source={item.image} style={styles.sportImage} />
          </View>

          <Text
            style={[styles.sportName, isSelected && styles.sportNameActive]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
        </Pressable>
      );
    },
    [handleSportPress, selectedSport],
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Home</Text>
          <Text style={styles.subtitle}>Find sport events near you.</Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.notificationButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleNotificationPress}
        >
          <Ionicons
            name="notifications-outline"
            size={22}
            color={colors.text}
          />

          {unreadCounts.total > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>
                {formatBadgeCount(unreadCounts.total)}
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={colors.secondaryText} />

        <TextInput
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearchSubmit}
          placeholder="Search sport or event..."
          placeholderTextColor={colors.secondaryText}
          returnKeyType="search"
        />
      </View>

      <View style={styles.sportsContainer}>
        <FlatList
          data={filteredSports}
          keyExtractor={(item) => item.id}
          renderItem={renderSportItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sportsList}
        />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {selectedSport ? `${selectedSport} Events` : "Nearby Events"}
        </Text>

        <Pressable onPress={() => router.push("/(home)/(tabs)/events")}>
          <Text style={styles.sectionLink}>See all</Text>
        </Pressable>
      </View>

      {isLoading ? (
        <View style={styles.loadingBlock}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : events.length === 0 ? (
        <View style={styles.emptyBlock}>
          <Text style={styles.emptyTitle}>No events yet</Text>

          <Text style={styles.emptyText}>
            Try another sport or create your own event with the plus button.
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.eventsList}
        >
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onPress={() => handleEventPress(event.id)}
            />
          ))}
        </ScrollView>
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
