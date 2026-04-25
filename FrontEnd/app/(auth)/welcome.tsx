import { router } from "expo-router";
import { ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/running.png")}
        style={styles.image}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
            <Text style={styles.title}>
              Find your{"\n"}
              sport buddy
            </Text>

            <Text style={styles.subtitle}>
              Find people nearby who share your passion for sports.
            </Text>

            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => router.push("/(auth)/sign-in")}
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.signInButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => router.push("/(auth)/sign-in")}
            >
              <Text style={styles.signInText}>Sign In</Text>
            </Pressable>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  image: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },

  content: {
    paddingHorizontal: 24,
    paddingBottom: 60,
  },

  title: {
    color: "#fff",
    fontSize: 42,
    fontWeight: "800",
    lineHeight: 48,
    marginBottom: 16,
  },

  subtitle: {
    color: "#e5e5e5",
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 30,
  },

  button: {
    backgroundColor: "#ff7a00",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 12,
  },

  signInButton: {
    paddingVertical: 14,
    alignItems: "center",
  },

  buttonPressed: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  signInText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    opacity: 0.9,
  },
});
