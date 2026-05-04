import { styles } from "../../../styles/profile.styles";
import { Text, View } from "react-native";


export function ProfileHeader() {
  return (
    <View style={styles.topBlock}>
      <Text style={styles.title}>Profile</Text>

      <Text style={styles.subtitle}>
        Tell people who you are and what sports you play.
      </Text>
    </View>
  );
}
