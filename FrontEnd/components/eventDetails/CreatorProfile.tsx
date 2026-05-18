import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, View } from "react-native";
import { colors } from "../../constants/colors";
import { styles } from "../../styles/eventDetailsModal.styles";
import { EventCreator } from "../../types/events";
import {
  calculateAge,
  formatRating,
  getFullName,
  getNickname,
} from "../../utils/eventDetails";
import { CreatorSportItem } from "./CreatorSportItem";
import { CreatorStat } from "./CreatorStat";
import { UserAvatar } from "./UserAvatar";

type CreatorProfileProps = {
  creator: EventCreator;
};

export function CreatorProfile({ creator }: CreatorProfileProps) {
  const fullName = getFullName(creator);
  const nickname = getNickname(creator);
  const languages = creator.languages?.join(", ") || "Not added";
  const creatorSports = creator.sports ?? [];
  const creatorAge = calculateAge(creator.date_of_birth);

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
              {creatorAge !== null
                ? `${creatorAge} years old`
                : "Age not added"}
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
