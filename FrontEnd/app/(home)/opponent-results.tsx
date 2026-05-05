import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { colors } from "../../constants/colors";
import { styles } from "../../styles/opponentResults.styles";
import { OpponentSearchResult } from "../../types/opponentSearch";

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
    return (
      <View style={styles.card}>
        {item.avatar_url ? (
          <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarPlaceholderText}>?</Text>
          </View>
        )}

        <View style={styles.cardInfo}>
          <Text style={styles.nickname}>{item.nickname}</Text>

          <Text style={styles.fullName}>
            {item.first_name} {item.last_name}
          </Text>

          <Text style={styles.text}>
            {item.city}, {item.country}
          </Text>

          <Text style={styles.text}>
            {item.sport_name} · {item.level}
          </Text>

          <Text style={styles.text}>
            Age: {item.age} · {item.sex}
          </Text>

          {item.about_me && (
            <Text style={styles.aboutMe} numberOfLines={3}>
              {item.about_me}
            </Text>
          )}
        </View>
      </View>
    );
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
          <Ionicons
            name="search"
            size={54}
            color={colors.secondaryText}
          />

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
