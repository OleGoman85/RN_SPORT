import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

const WelcomeScreen = () => {
  return (
	<View style={styles.container}>
		<ImageBackground
			source={require("./assets/images/running.png")}
			style={styles.image}
			resizeMode='cover'>
			<View style={styles.overlay}>
				<View style={styles.content}>
					<Text style={styles.title}>
						Find your{"\n"}
						sport body
					</Text>
					<Text style={styles.subtitle}>
						Find people nearby who share your passion for sports.
					</Text>
					<Pressable
						style={({pressed})=>[
							styles.button,
							pressed && styles.buttonPressed
						]}
						onPress={()=>router.push("/(auth)/sign-in")}>
							<Text style={styles.buttonText}>
								Get started
							</Text>
					</Pressable>
				</View>
			</View>
		</ImageBackground>
	</View>
  )
}

export default WelcomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  image: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "flex-end",
  },

  content: {
    paddingHorizontal: 24,
    paddingBottom: 56,
  },

  title: {
    color: "#ffffff",
    fontSize: 42,
    fontWeight: "800",
    lineHeight: 48,
    marginBottom: 16,
  },

  subtitle: {
    color: "#e5e5e5",
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 28,
  },

  button: {
    backgroundColor: "#ff7a00",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },

  buttonPressed: {
    opacity: 0.75,
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
