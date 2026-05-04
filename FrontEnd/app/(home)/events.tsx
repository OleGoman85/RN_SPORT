import { Text, View } from "react-native";
import { styles } from "../../styles/events.styles";

export default function EventsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Events</Text>
      <Text style={styles.subtitle}>Events screen will be here.</Text>
    </View>
  );
}
