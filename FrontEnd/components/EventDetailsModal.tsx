import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/expo";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { colors } from "../constants/colors";
import { sports } from "../data/sports";
import { joinSportEvent, loadSportEventDetails } from "../services/eventsApi";
import { styles } from "../styles/eventDetailsModal.styles";
import {
  EventCreator,
  EventDetails,
  EventMember,
  SportEvent,
  UserSportProfile,
} from "../types/events";

type EventDetailsModalProps = {
  eventId: number | null;
  visible: boolean;
  onClose: () => void;
  onEventUpdated?: (event: SportEvent) => void;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(time: string) {
  return time.slice(0, 5);
}

function formatRating(rating: string | number | null | undefined) {
  const numericRating = Number(rating);

  if (Number.isNaN(numericRating) || numericRating <= 0) {
    return "No rating";
  }

  return numericRating.toFixed(1);
}

function getNickname(user: {
  nickname: string | null;
  first_name?: string | null;
  last_name?: string | null;
}) {
  if (user.nickname) {
    return `@${user.nickname.replace(/^@/, "")}`;
  }

  const fullName = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();

  return fullName ? `@${fullName.replace(/\s+/g, "")}` : "@Unknown";
}

function getFullName(user: {
  first_name?: string | null;
  last_name?: string | null;
  nickname?: string | null;
}) {
  const fullName = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();

  return fullName || user.nickname || "Unknown user";
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function getLevelStyle(level: string) {
  const normalizedLevel = level.toLowerCase();

  if (normalizedLevel.includes("professional")) {
    return styles.profLevelBadge;
  }

  if (normalizedLevel.includes("amateur")) {
    return styles.amateurLevelBadge;
  }

  if (normalizedLevel.includes("beginner")) {
    return styles.beginnerLevelBadge;
  }

  return styles.defaultLevelBadge;
}

function getLevelDisplayName(level: string) {
  const normalizedLevel = level.toLowerCase();

  if (normalizedLevel.includes("beginner")) {
    return "Begin";
  }

  if (normalizedLevel.includes("amateur")) {
    return "Amat";
  }

  if (normalizedLevel.includes("professional")) {
    return "Pro";
  }

  return level;
}

function getSportImage(sportName: string) {
  return sports.find(
    (sport) => sport.name.toLowerCase() === sportName.toLowerCase(),
  )?.image;
}

function UserAvatar({
  avatarUrl,
  name,
  size,
}: {
  avatarUrl: string | null;
  name: string;
  size: number;
}) {
  const [hasImageError, setHasImageError] = useState(false);

  const initials = getInitials(name);

  if (avatarUrl && !hasImageError) {
    return (
      <Image
        source={{ uri: avatarUrl }}
        style={[
          styles.avatarImage,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
        onError={() => setHasImageError(true)}
      />
    );
  }

  return (
    <View
      style={[
        styles.initialsAvatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      <Text
        style={[
          styles.initialsText,
          {
            fontSize: size * 0.34,
          },
        ]}
      >
        {initials || "?"}
      </Text>
    </View>
  );
}

function CreatorStat({
  icon,
  value,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: string | number;
  label: string;
}) {
  return (
    <View style={styles.creatorStatItem}>
      <Ionicons name={icon} size={28} color={colors.primary} />

      <Text style={styles.creatorStatValue}>{value}</Text>

      <Text style={styles.creatorStatLabel}>{label}</Text>
    </View>
  );
}

function CreatorSportItem({ sport }: { sport: UserSportProfile }) {
  const sportImage = getSportImage(sport.sport_name);

  return (
    <View style={styles.creatorSportItem}>
      <View style={styles.creatorSportImageWrap}>
        {sportImage ? (
          <Image source={sportImage} style={styles.creatorSportImage} />
        ) : (
          <Ionicons name="football-outline" size={28} color={colors.primary} />
        )}
      </View>

      <View style={[styles.levelBadge, getLevelStyle(sport.level)]}>
        <Text style={styles.levelText}>{getLevelDisplayName(sport.level)}</Text>
      </View>
    </View>
  );
}

function MemberCard({ member }: { member: EventMember }) {
  const memberName = getFullName(member);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.memberCard,
        pressed && styles.buttonPressed,
      ]}
      onPress={() => {
        Alert.alert(
          "Coming soon",
          "User profile preview will be connected later.",
        );
      }}
    >
      <UserAvatar avatarUrl={member.avatar_url} name={memberName} size={46} />

      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{getNickname(member)}</Text>

        <Text style={styles.memberRating}>
          {formatRating(member.rating_avg)}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color={colors.secondaryText} />
    </Pressable>
  );
}

function CreatorProfile({ creator }: { creator: EventCreator }) {
  const fullName = getFullName(creator);
  const nickname = getNickname(creator);
  const languages = creator.languages?.join(", ") || "Not added";
  const creatorSports = creator.sports ?? [];

  return (
    <>
      <View style={styles.creatorTopBlock}>
        <UserAvatar avatarUrl={creator.avatar_url} name={fullName} size={104} />

        <View style={styles.creatorMainInfo}>
          <Text style={styles.creatorNickname}>{nickname}</Text>

          <Text style={styles.creatorFullName}>{fullName}</Text>

          <View style={styles.creatorSmallRow}>
            <Ionicons
              name="location-outline"
              size={17}
              color={colors.primary}
            />

            <Text style={styles.creatorMetaText}>
              {creator.city ?? "City not added"}
              {creator.country ? `, ${creator.country}` : ""}
            </Text>
          </View>

          <View style={styles.creatorSmallRow}>
            <Ionicons
              name="calendar-outline"
              size={17}
              color={colors.primary}
            />

            <Text style={styles.creatorMetaText}>
              {creator.age ? `${creator.age} years old` : "Age not added"}
            </Text>
          </View>
        </View>

        <View style={styles.creatorStatsColumn}>
          <CreatorStat
            icon="calendar-outline"
            value={creator.events_created_count}
            label="Events"
          />

          <CreatorStat
            icon="star-outline"
            value={formatRating(creator.rating_avg)}
            label="Trust"
          />

          <CreatorStat
            icon="people-outline"
            value={creator.participated_events_count ?? 0}
            label="Participated"
          />
        </View>
      </View>

      <View style={styles.aboutLanguagesCard}>
        <View style={styles.aboutColumn}>
          <View style={styles.blockTitleRow}>
            <Ionicons name="chatbox-outline" size={22} color={colors.primary} />

            <Text style={styles.blockTitle}>About me</Text>
          </View>

          <Text style={styles.aboutText}>
            {creator.about_me || "No profile description yet."}
          </Text>
        </View>

        <View style={styles.verticalDivider} />

        <View style={styles.languagesColumn}>
          <View style={styles.blockTitleRow}>
            <Ionicons name="globe-outline" size={22} color={colors.primary} />

            <Text style={styles.blockTitle}>Languages</Text>
          </View>

          <Text style={styles.languagesText}>{languages}</Text>
        </View>
      </View>

      {creatorSports.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.creatorSportsList}
        >
          {creatorSports.map((sport) => (
            <CreatorSportItem key={sport.sport_name} sport={sport} />
          ))}
        </ScrollView>
      ) : null}
    </>
  );
}

function EventInfoCard({ event }: { event: SportEvent }) {
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

export function EventDetailsModal({
  eventId,
  visible,
  onClose,
  onEventUpdated,
}: EventDetailsModalProps) {
  const { user } = useUser();

  const [details, setDetails] = useState<EventDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    if (!visible || eventId === null) {
      return;
    }

    const numericEventId = eventId;

    async function loadDetails() {
      try {
        setIsLoading(true);

        const loadedDetails = await loadSportEventDetails(numericEventId);

        setDetails(loadedDetails);
      } catch (error) {
        console.log("Event details loading error:", error);
        Alert.alert("Error", "Could not load event details.");
        onClose();
      } finally {
        setIsLoading(false);
      }
    }

    loadDetails();
  }, [eventId, visible, onClose]);

  const creator = details?.creator;
  const event = details?.event;
  const members = useMemo(() => {
    return details?.members ?? [];
  }, [details?.members]);

  const isCreator = creator?.clerk_user_id === user?.id;

  const isAlreadyJoined = useMemo(() => {
    return members.some((member) => member.clerk_user_id === user?.id);
  }, [members, user?.id]);

  const isEventFull =
    event !== undefined && event.current_participants >= event.max_participants;

  const handleJoinEvent = async () => {
    if (!eventId || !user?.id) {
      Alert.alert("Error", "User is not loaded yet.");
      return;
    }

    try {
      setIsJoining(true);

      const updatedEvent = await joinSportEvent(eventId, user.id);
      const updatedDetails = await loadSportEventDetails(eventId);

      setDetails(updatedDetails);
      onEventUpdated?.(updatedEvent);

      Alert.alert("Success", "You joined this event.");
    } catch (error) {
      console.log("Join event error:", error);

      Alert.alert(
        "Could not join event",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setIsJoining(false);
    }
  };

  const handleMessagePress = () => {
    Alert.alert("Coming soon", "Chat will be connected later.");
  };

  const handleAddContactPress = () => {
    Alert.alert("Coming soon", "Contacts will be connected later.");
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.sheet}>
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

          {isLoading || !details || !creator || !event ? (
            <View style={styles.loadingBlock}>
              <ActivityIndicator size="large" color={colors.primary} />

              <Text style={styles.loadingText}>Loading event...</Text>
            </View>
          ) : (
            <>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
                <CreatorProfile creator={creator} />

                <EventInfoCard event={event} />

                <View style={styles.joinedSection}>
                  <Text style={styles.joinedTitle}>Joined players</Text>

                  {members.length === 0 ? (
                    <Text style={styles.emptyText}>Nobody has joined yet.</Text>
                  ) : (
                    members.map((member) => (
                      <MemberCard key={member.id} member={member} />
                    ))
                  )}
                </View>
              </ScrollView>

              <View style={styles.actions}>
                <Pressable
                  disabled={
                    isJoining || isCreator || isAlreadyJoined || isEventFull
                  }
                  style={({ pressed }) => [
                    styles.joinButton,
                    (isCreator || isAlreadyJoined || isEventFull) &&
                      styles.disabledButton,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={handleJoinEvent}
                >
                  <Text style={styles.joinButtonText}>
                    {isCreator
                      ? "Your event"
                      : isAlreadyJoined
                        ? "Already joined"
                        : isEventFull
                          ? "Event is full"
                          : isJoining
                            ? "Joining..."
                            : "Join Event"}
                  </Text>
                </Pressable>

                <View style={styles.secondaryActions}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.secondaryButton,
                      pressed && styles.buttonPressed,
                    ]}
                    onPress={handleMessagePress}
                  >
                    <Ionicons
                      name="chatbubble-outline"
                      size={22}
                      color={colors.text}
                    />

                    <Text style={styles.secondaryButtonText}>Message</Text>
                  </Pressable>

                  <Pressable
                    style={({ pressed }) => [
                      styles.secondaryButton,
                      pressed && styles.buttonPressed,
                    ]}
                    onPress={handleAddContactPress}
                  >
                    <Ionicons
                      name="person-add-outline"
                      size={22}
                      color={colors.text}
                    />

                    <Text style={styles.secondaryButtonText}>Add</Text>
                  </Pressable>
                </View>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}
