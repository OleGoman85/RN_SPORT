import { StyleSheet } from "react-native";
import { colors } from "../constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: 14,
  },

  sportsContainer: {
  height: 95,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "900",
  },

  subtitle: {
    color: colors.secondaryText,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 4,
  },

  notificationButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  notificationBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },

  notificationBadgeText: {
    color: colors.background,
    fontSize: 10,
    fontWeight: "900",
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
    paddingBottom: 12,
  },

  sportItem: {
    width: 66,
    alignItems: "center",
    marginRight: 1,
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

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
    marginBottom: 12,
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
  },

  sectionLink: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "800",
  },

  loadingBlock: {
    paddingVertical: 30,
    alignItems: "center",
  },

  emptyBlock: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 18,
  },

  emptyTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 6,
  },

  emptyText: {
    color: colors.secondaryText,
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 19,
  },

  eventsList: {
    paddingBottom: 110,
  },

  buttonPressed: {
    opacity: 0.75,
  },
});
