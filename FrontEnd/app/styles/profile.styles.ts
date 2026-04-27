import { StyleSheet } from "react-native";
import { colors } from "../constants/colors";


export const styles = StyleSheet.create({
  keyboardContainer: {
	flex: 1,
	backgroundColor: colors.background,
  },

  container: {
	flex: 1,
	backgroundColor: colors.background,
  },

  content: {
	padding: 16,
	paddingBottom: 44,
  },

  topBlock: {
	marginBottom: 16,
  },

  title: {
	color: colors.text,
	fontSize: 34,
	fontWeight: "900",
	marginBottom: 6,
  },

  subtitle: {
	color: colors.secondaryText,
	fontSize: 15,
	lineHeight: 21,
  },

  card: {
	backgroundColor: colors.card,
	borderWidth: 1,
	borderColor: colors.border,
	borderRadius: 24,
	padding: 14,
	marginBottom: 16,
  },

  avatarBlock: {
	alignItems: "center",
	marginBottom: 18,
	gap: 14,
  },

  avatar: {
	width: 112,
	height: 112,
	borderRadius: 56,
	borderWidth: 3,
	borderColor: colors.primary,
  },

  avatarPlaceholder: {
	width: 112,
	height: 112,
	borderRadius: 56,
	backgroundColor: "rgba(15, 23, 42, 0.95)",
	borderWidth: 2,
	borderColor: "rgba(255, 122, 0, 0.7)",
	justifyContent: "center",
	alignItems: "center",
	padding: 10,
  },

  avatarText: {
	color: "#cbd5e1",
	fontSize: 12,
	fontWeight: "700",
	textAlign: "center",
  },

  avatarButtons: {
	flexDirection: "row",
	gap: 12,
  },

  smallButton: {
	backgroundColor: "rgba(255, 122, 0, 0.18)",
	borderWidth: 1,
	borderColor: colors.primary,
	paddingVertical: 10,
	paddingHorizontal: 18,
	borderRadius: 14,
  },

  smallButtonText: {
	color: "#ffb86b",
	fontSize: 14,
	fontWeight: "800",
  },

  twoColumns: {
	flexDirection: "row",
	gap: 10,
  },

  column: {
	flex: 1,
  },

  input: {
	width: "100%",
	backgroundColor: "rgba(15, 23, 42, 0.94)",
	borderWidth: 1,
	borderColor: "#334155",
	borderRadius: 16,
	paddingVertical: 14,
	paddingHorizontal: 14,
	color: colors.text,
	fontSize: 15,
	marginBottom: 10,
  },

  textArea: {
	height: 105,
	textAlignVertical: "top",
  },

  miniTitle: {
	color: colors.text,
	fontSize: 16,
	fontWeight: "900",
	marginBottom: 10,
  },

  optionRow: {
	flexDirection: "row",
	gap: 8,
	marginBottom: 10,
  },

  optionButton: {
	flex: 1,
	backgroundColor: "rgba(15, 23, 42, 0.94)",
	borderWidth: 1,
	borderColor: "#334155",
	borderRadius: 14,
	paddingVertical: 12,
	alignItems: "center",
  },

  optionButtonActive: {
	backgroundColor: colors.primary,
	borderColor: colors.primary,
  },

  optionButtonText: {
	color: "#cbd5e1",
	fontSize: 13,
	fontWeight: "800",
  },

  optionButtonTextActive: {
	color: colors.text,
  },

  locationHeader: {
	flexDirection: "row",
	justifyContent: "space-between",
	alignItems: "center",
	gap: 12,
	marginTop: 4,
  },

  locationTextBlock: {
	flex: 1,
  },

  locationButton: {
	backgroundColor: "rgba(255, 122, 0, 0.18)",
	borderWidth: 1,
	borderColor: colors.primary,
	paddingVertical: 11,
	paddingHorizontal: 13,
	borderRadius: 14,
  },

  locationButtonText: {
	color: "#ffb86b",
	fontSize: 12,
	fontWeight: "900",
  },

  helperText: {
	color: colors.secondaryText,
	fontSize: 13,
	lineHeight: 18,
	marginBottom: 12,
  },

  coordinates: {
	color: colors.secondaryText,
	fontSize: 13,
	marginTop: 10,
  },

  sectionTitle: {
	color: colors.text,
	fontSize: 22,
	fontWeight: "900",
	marginBottom: 8,
  },

  sportsList: {
	gap: 12,
  },

  sportCard: {
	backgroundColor: "rgba(15, 23, 42, 0.94)",
	borderWidth: 1,
	borderColor: "#334155",
	borderRadius: 18,
	overflow: "hidden",
  },

  sportCardSelected: {
	borderColor: colors.primary,
  },

  sportHeader: {
	flexDirection: "row",
	alignItems: "center",
	padding: 10,
	gap: 12,
  },

  sportImage: {
	width: 54,
	height: 54,
	borderRadius: 14,
  },

  sportInfo: {
	flex: 1,
  },

  sportName: {
	color: colors.text,
	fontSize: 16,
	fontWeight: "900",
  },

  sportStatus: {
	color: colors.secondaryText,
	fontSize: 13,
	marginTop: 4,
  },

  levelRow: {
	flexDirection: "row",
	gap: 8,
	paddingHorizontal: 10,
	paddingBottom: 10,
  },

  levelButton: {
	flex: 1,
	paddingVertical: 10,
	borderRadius: 12,
	backgroundColor: "rgba(30, 41, 59, 0.9)",
	borderWidth: 1,
	borderColor: "#334155",
	alignItems: "center",
  },

  levelButtonActive: {
	backgroundColor: colors.primary,
	borderColor: colors.primary,
  },

  levelButtonText: {
	color: "#cbd5e1",
	fontSize: 12,
	fontWeight: "800",
  },

  levelButtonTextActive: {
	color: colors.text,
  },

  languagesContainer: {
	flexDirection: "row",
	flexWrap: "wrap",
	gap: 10,
  },

  languageButton: {
	backgroundColor: "rgba(15, 23, 42, 0.94)",
	borderWidth: 1,
	borderColor: "#334155",
	paddingVertical: 11,
	paddingHorizontal: 16,
	borderRadius: 14,
  },

  languageButtonActive: {
	backgroundColor: colors.primary,
	borderColor: colors.primary,
  },

  languageButtonText: {
	color: "#cbd5e1",
	fontSize: 14,
	fontWeight: "800",
  },

  languageButtonTextActive: {
	color: colors.text,
  },

  saveButton: {
	backgroundColor: colors.primary,
	paddingVertical: 16,
	borderRadius: 18,
	alignItems: "center",
	marginTop: 4,
  },

  saveButtonText: {
	color: colors.text,
	fontSize: 16,
	fontWeight: "900",
  },

  logoutButton: {
	paddingVertical: 16,
	alignItems: "center",
	marginTop: 10,
  },

  logoutButtonText: {
	color: "#fb7185",
	fontSize: 16,
	fontWeight: "900",
  },

  buttonPressed: {
	opacity: 0.75,
  },

  buttonDisabled: {
	opacity: 0.45,
  },
});
