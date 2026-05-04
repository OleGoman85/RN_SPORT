import { StyleSheet } from "react-native";
import { colors } from "../app/constants/colors";

export const styles = StyleSheet.create({
  container: {
	flex: 1,
	backgroundColor: colors.background,
	paddingHorizontal: 24,
	justifyContent: "center",
	gap: 12,
  },

  title: {
	color: colors.text,
	fontSize: 34,
	fontWeight: "800",
	marginBottom: 20,
	textAlign: 'center'
  },

  label: {
	color: "#cbd5e1",
	fontSize: 14,
	fontWeight: "600",
  },

  input: {
	backgroundColor: "#1e293b",
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

