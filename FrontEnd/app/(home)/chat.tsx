import {Text, View } from "react-native";
import { styles } from "../styles/chat.styles";

export default function ChatScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat</Text>
      <Text style={styles.subtitle}>Chat screen will be here.</Text>
    </View>
  );
}
