import { StyleSheet } from "react-native";
import { colors } from "../constants/colors";

export const styles = StyleSheet.create({
  background: {
	flex: 1,
  },

  overlay: {
	flex: 1,
	backgroundColor: "rgba(15, 23, 42, 0.72)",
	justifyContent: "center",
	paddingHorizontal: 24,
  },

  formCard: {
	backgroundColor: "rgba(15, 23, 42, 0.88)",
	borderRadius: 24,
	padding: 22,
	gap: 12,
	borderWidth: 1,
	borderColor: "rgba(255, 255, 255, 0.12)",
  },

  title: {
	color: colors.text,
	fontSize: 34,
	fontWeight: "800",
	marginBottom: 16,
	textAlign: "center",
  },

  label: {
	color: "#cbd5e1",
	fontSize: 14,
	fontWeight: "600",
  },

  input: {
	backgroundColor: "rgba(30, 41, 59, 0.94)",
	borderWidth: 1,
	borderColor: colors.borderCol,
	borderRadius: 16,
	paddingVertical: 15,
	paddingHorizontal: 16,
	fontSize: 16,
	color: colors.text,
  },

  button: {
	backgroundColor: colors.primary,
	paddingVertical: 16,
	borderRadius: 16,
	alignItems: "center",
	marginTop: 12,
  },

  buttonPressed: {
	opacity: 0.75,
  },

  buttonDisabled: {
	opacity: 0.5,
  },

  buttonText: {
	color: colors.text,
	fontSize: 16,
	fontWeight: "700",
  },

  secondaryButton: {
	paddingVertical: 14,
	alignItems: "center",
  },

  secondaryButtonText: {
	color: "#ffb86b",
	fontSize: 15,
	fontWeight: "600",
  },

  linkContainer: {
	flexDirection: "row",
	justifyContent: "center",
	gap: 4,
	marginTop: 16,
	alignItems: "center",
  },

  linkText: {
	color: "#cbd5e1",
  },

  linkAccent: {
	color: colors.primary,
	fontWeight: "700",
  },

  error: {
	color: "#fb7185",
	fontSize: 12,
	marginTop: -6,
  },

  debug: {
	color: colors.secondaryText,
	fontSize: 10,
	opacity: 0.5,
	marginTop: 8,
  },
});

