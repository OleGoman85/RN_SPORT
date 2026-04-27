import { StyleSheet } from "react-native";
import { colors } from "../constants/colors";

export const styles = StyleSheet.create({
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
	backgroundColor: colors.primary,
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
