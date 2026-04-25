import { useClerk } from "@clerk/expo";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const { signOut } = useClerk();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home screen</Text>

      <Pressable style={styles.button} onPress={() => signOut()}>
        <Text style={styles.buttonText}>Log out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a", // темный фон под стиль
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#ff7a00",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 14,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
