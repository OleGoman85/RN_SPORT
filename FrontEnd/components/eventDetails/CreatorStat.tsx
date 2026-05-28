// Small creator stat cell used in event details.
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { colors } from "../../constants/colors";
import { styles } from "../../styles/eventDetailsModal.styles";

type CreatorStatProps = {
  icon: keyof typeof Ionicons.glyphMap;
  value: string | number;
  label: string;
};

export function CreatorStat({ icon, value, label }: CreatorStatProps) {
  return (
    <View style={styles.creatorStatItem}>
      <Ionicons name={icon} size={28} color={colors.primary} />

      <Text style={styles.creatorStatValue}>{value}</Text>

      <Text style={styles.creatorStatLabel}>{label}</Text>
    </View>
  );
}
