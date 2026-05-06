import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { colors } from "../../constants/colors";
import { styles } from "../../styles/opponentResults.styles";
import { OpponentSearchResult } from "../../types/opponentSearch";

type OpponentCardProps = {
  opponent: OpponentSearchResult;
};

function getInitials(opponent: OpponentSearchResult) {
  const firstLetter = opponent.first_name?.[0] ?? "";
  const lastLetter = opponent.last_name?.[0] ?? "";

  if (firstLetter || lastLetter) {
    return `${firstLetter}${lastLetter}`.toUpperCase();
  }

  return opponent.nickname?.[0]?.toUpperCase() ?? "?";
}

function OpponentCard({ opponent }: OpponentCardProps) {
  const [imageFailed, setImageFailed] = useState(false);

  const shouldShowAvatar =
    Boolean(opponent.avatar_url) &&
    opponent.avatar_url.startsWith("http") &&
    !imageFailed;

  return (
    <View style={styles.card}>
      {shouldShowAvatar ? (
        <Image
          source={{ uri: opponent.avatar_url }}
          style={styles.avatar}
          resizeMode="cover"
          onError={() => {
            console.log("Avatar failed to load:", opponent.avatar_url);
            setImageFailed(true);
          }}
        />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarPlaceholderText}>
            {getInitials(opponent)}
          </Text>
        </View>
      )}

      <View style={styles.cardInfo}>
        <Text style={styles.nickname}>{opponent.nickname}</Text>

        <Text style={styles.fullName}>
          {opponent.first_name} {opponent.last_name}
        </Text>

        <Text style={styles.text}>
          {opponent.city}, {opponent.country}
        </Text>

        <Text style={styles.text}>
          {opponent.sport_name} · {opponent.level}
        </Text>

        <Text style={styles.text}>
          Age: {opponent.age} · {opponent.sex}
        </Text>

        {opponent.about_me && (
          <Text style={styles.aboutMe} numberOfLines={3}>
            {opponent.about_me}
          </Text>
        )}
      </View>
    </View>
  );
}

export default function OpponentResultsScreen() {
  const params = useLocalSearchParams<{
    sportName?: string;
    opponents?: string;
  }>();

  const sportName = params.sportName ?? "Sport";

  const opponents: OpponentSearchResult[] = params.opponents
    ? JSON.parse(params.opponents)
    : [];

  const renderOpponentCard = ({ item }: { item: OpponentSearchResult }) => {
    return <OpponentCard opponent={item} />;
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
            {sportName} · {opponents.length} found
          </Text>
        </View>
      </View>

      {opponents.length === 0 ? (
        <View style={styles.emptyBlock}>
          <Ionicons name="search" size={54} color={colors.secondaryText} />

          <Text style={styles.emptyTitle}>No players found</Text>

          <Text style={styles.emptyText}>
            Nobody matched your filters. Try changing age, level, language or
            location.
          </Text>
        </View>
      ) : (
        <FlatList
          data={opponents}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderOpponentCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
