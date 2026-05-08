import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/expo";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, FlatList, Image, Pressable, Text, View } from "react-native";
import { colors } from "../../constants/colors";
import { deleteSportEvent } from "../../services/eventsApi";
import { styles } from "../../styles/opponentResults.styles";
import { OpponentSearchResult, SportEvent } from "../../types/opponentSearch";

type ActiveTab = "events" | "players";

type EventCardProps = {
  event: SportEvent;
  currentClerkUserId: string | undefined;
  onDeleteEvent: (eventId: number) => void;
};

type PlayerCardProps = {
  player: OpponentSearchResult;
};

function getEventInitials(event: SportEvent) {
  const firstLetter = event.first_name?.[0] ?? "";
  const lastLetter = event.last_name?.[0] ?? "";

  if (firstLetter || lastLetter) {
    return `${firstLetter}${lastLetter}`.toUpperCase();
  }

  return event.nickname?.[0]?.toUpperCase() ?? "?";
}

function getPlayerInitials(player: OpponentSearchResult) {
  const firstLetter = player.first_name?.[0] ?? "";
  const lastLetter = player.last_name?.[0] ?? "";

  if (firstLetter || lastLetter) {
    return `${firstLetter}${lastLetter}`.toUpperCase();
  }

  return player.nickname?.[0]?.toUpperCase() ?? "?";
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function EventCard({
  event,
  currentClerkUserId,
  onDeleteEvent,
}: EventCardProps) {
  const [imageFailed, setImageFailed] = useState(false);

  const isMyEvent = event.clerk_user_id === currentClerkUserId;

  const shouldShowAvatar =
    Boolean(event.avatar_url) &&
    event.avatar_url.startsWith("http") &&
    !imageFailed;

  const handlePressDelete = () => {
    Alert.alert(
      "Delete event",
      "Are you sure you want to delete this published event?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDeleteEvent(event.id),
        },
      ],
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        {shouldShowAvatar ? (
          <Image
            source={{ uri: event.avatar_url }}
            style={styles.avatar}
            resizeMode="cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarPlaceholderText}>
              {getEventInitials(event)}
            </Text>
          </View>
        )}

        <View style={styles.cardInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.nickname}>{event.nickname}</Text>

            <Text style={styles.ratingText}>
              ★ {Number(event.rating_avg).toFixed(1)} ({event.games_count}{" "}
              games)
            </Text>
          </View>

          <Text style={styles.fullName}>
            {event.first_name} {event.last_name}
          </Text>

          <Text style={styles.text}>
            {event.city}, {event.country}
          </Text>
        </View>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.infoTitle}>{event.sport_name}</Text>

        <Text style={styles.text}>Level: {event.level}</Text>

        <Text style={styles.text}>
          Date: {formatDate(event.available_date)}
        </Text>

        <Text style={styles.text}>
          Time: {event.time_from.slice(0, 5)} - {event.time_to.slice(0, 5)}
        </Text>

        <Text style={styles.text}>Match type: {event.match_type}</Text>

        <Text style={styles.text}>
          Location:{" "}
          {event.location_mode === "city"
            ? event.event_city
            : `${event.radius_km} km radius`}
        </Text>
      </View>

      {event.about_me && (
        <Text style={styles.aboutMe} numberOfLines={4}>
          {event.about_me}
        </Text>
      )}

      {isMyEvent ? (
        <Pressable
          style={({ pressed }) => [
            styles.deleteButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handlePressDelete}
        >
          <Text style={styles.deleteButtonText}>Delete my event</Text>
        </Pressable>
      ) : (
        <Pressable
          style={({ pressed }) => [
            styles.joinButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.joinButtonText}>Join</Text>
        </Pressable>
      )}
    </View>
  );
}

function PlayerCard({ player }: PlayerCardProps) {
  const [imageFailed, setImageFailed] = useState(false);

  const shouldShowAvatar =
    Boolean(player.avatar_url) &&
    player.avatar_url.startsWith("http") &&
    !imageFailed;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        {shouldShowAvatar ? (
          <Image
            source={{ uri: player.avatar_url }}
            style={styles.avatar}
            resizeMode="cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarPlaceholderText}>
              {getPlayerInitials(player)}
            </Text>
          </View>
        )}

        <View style={styles.cardInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.nickname}>{player.nickname}</Text>

            <Text style={styles.ratingText}>
              ★ {Number(player.rating_avg).toFixed(1)} ({player.games_count}{" "}
              games)
            </Text>
          </View>

          <Text style={styles.fullName}>
            {player.first_name} {player.last_name}
          </Text>

          <Text style={styles.text}>
            {player.city}, {player.country}
          </Text>

          <Text style={styles.text}>
            {player.sport_name} · {player.level}
          </Text>

          <Text style={styles.text}>
            Age: {player.age} · {player.sex}
          </Text>
        </View>
      </View>

      {player.about_me && (
        <Text style={styles.aboutMe} numberOfLines={4}>
          {player.about_me}
        </Text>
      )}

      <Pressable
        style={({ pressed }) => [
          styles.messageButton,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.messageButtonText}>Message</Text>
      </Pressable>
    </View>
  );
}

export default function OpponentResultsScreen() {
  const { user } = useUser();

  const params = useLocalSearchParams<{
    sportName?: string;
    events?: string;
    players?: string;
    initialTab?: ActiveTab;
    publishedEventIds?: string;
  }>();

  const sportName = params.sportName ?? "Sport";

  const parsedEvents: SportEvent[] = useMemo(() => {
    if (!params.events) {
      return [];
    }

    return JSON.parse(params.events);
  }, [params.events]);

  const parsedPlayers: OpponentSearchResult[] = useMemo(() => {
    if (!params.players) {
      return [];
    }

    return JSON.parse(params.players);
  }, [params.players]);

  const [events, setEvents] = useState<SportEvent[]>(parsedEvents);
  const [players] = useState<OpponentSearchResult[]>(parsedPlayers);
  const [activeTab, setActiveTab] = useState<ActiveTab>(
    params.initialTab === "players" ? "players" : "events",
  );

  const totalFound = events.length + players.length;

  const handleDeleteEvent = async (eventId: number) => {
    if (!user?.id) {
      Alert.alert("User is not loaded yet");
      return;
    }

    try {
      await deleteSportEvent(eventId, user.id);

      setEvents((currentEvents) =>
        currentEvents.filter((event) => event.id !== eventId),
      );

      Alert.alert("Success", "Event deleted successfully");
    } catch (error) {
      console.log("Delete event error:", error);
      Alert.alert("Error", "Could not delete event");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>

        <View style={styles.headerTextBlock}>
          <Text style={styles.title}>Search results</Text>

          <Text style={styles.subtitle}>
            {sportName} · {totalFound} found
          </Text>
        </View>
      </View>

      <View style={styles.tabs}>
        <Pressable
          style={[
            styles.tabButton,
            activeTab === "events" && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab("events")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "events" && styles.tabTextActive,
            ]}
          >
            Events ({events.length})
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.tabButton,
            activeTab === "players" && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab("players")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "players" && styles.tabTextActive,
            ]}
          >
            Players ({players.length})
          </Text>
        </Pressable>
      </View>

      {totalFound === 0 ? (
        <View style={styles.emptyBlock}>
          <Ionicons name="search" size={54} color={colors.secondaryText} />

          <Text style={styles.emptyTitle}>No matches found</Text>

          <Text style={styles.emptyText}>
            Try changing age, level, language, city or distance. You can also
            check the Events tab later because new sport requests may appear.
          </Text>
        </View>
      ) : activeTab === "events" ? (
        events.length === 0 ? (
          <View style={styles.emptyBlock}>
            <Text style={styles.emptyTitle}>No matching events</Text>

            <Text style={styles.emptyText}>
              No active event matched your filters. Try the Players tab or
              change your search parameters.
            </Text>
          </View>
        ) : (
          <FlatList
            data={events}
            keyExtractor={(item) => `event-${item.id}`}
            renderItem={({ item }) => (
              <EventCard
                event={item}
                currentClerkUserId={user?.id}
                onDeleteEvent={handleDeleteEvent}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )
      ) : players.length === 0 ? (
        <View style={styles.emptyBlock}>
          <Text style={styles.emptyTitle}>No matching players</Text>

          <Text style={styles.emptyText}>
            No user profile matched your filters. Try the Events tab or change
            your search parameters.
          </Text>
        </View>
      ) : (
        <FlatList
          data={players}
          keyExtractor={(item) => `player-${item.id}`}
          renderItem={({ item }) => <PlayerCard player={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
