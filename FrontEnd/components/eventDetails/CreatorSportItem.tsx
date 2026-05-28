// Compact sport+level item for event creator/public profile sections.
import { Ionicons } from "@expo/vector-icons";
import { Image, Text, View } from "react-native";
import { colors } from "../../constants/colors";
import { styles } from "../../styles/eventDetailsModal.styles";
import { UserSportProfile } from "../../types/events";
import { getLevelDisplayName, getSportImage } from "../../utils/eventDetails";

type CreatorSportItemProps = {
  sport: UserSportProfile;
};

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

export function CreatorSportItem({ sport }: CreatorSportItemProps) {
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
