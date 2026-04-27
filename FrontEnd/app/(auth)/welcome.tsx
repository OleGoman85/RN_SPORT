import { router } from "expo-router";
import { ImageBackground, Pressable, Text, View } from "react-native";
import { styles } from "../styles/welcome.styles";

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

