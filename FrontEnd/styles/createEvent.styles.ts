import { StyleSheet } from "react-native";
import { colors } from "../constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },

  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  searchBox: {
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 8,
    marginBottom: 12,
  },

  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
  },

  sportsList: {
    paddingRight: 6,
    paddingBottom: 14,
  },

  sportItem: {
    width: 66,
    alignItems: "center",
    marginRight: 4,
  },

  sportIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
    overflow: "hidden",
  },

  sportIconActive: {
    borderColor: colors.primary,
    borderWidth: 2,
  },

  sportImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  sportName: {
    color: colors.secondaryText,
    fontSize: 10,
    fontWeight: "700",
    textAlign: "center",
  },

  sportNameActive: {
    color: colors.primary,
  },

  label: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 8,
    marginTop: 12,
  },

  input: {
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: "600",
  },

  twoColumns: {
    flexDirection: "row",
    gap: 12,
  },

  column: {
    flex: 1,
  },

  counter: {
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },

  counterButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.borderCol,
    alignItems: "center",
    justifyContent: "center",
  },

  counterValue: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
  },

  descriptionInput: {
    height: 96,
    textAlignVertical: "top",
    paddingTop: 12,
  },

  createButton: {
    height: 54,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
  },

  createButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "900",
  },

  buttonPressed: {
    opacity: 0.75,
  },
});
