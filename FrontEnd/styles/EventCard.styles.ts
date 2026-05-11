import { StyleSheet } from "react-native";
import { colors } from "../constants/colors";

export const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 10,
    marginBottom: 12,
  },
  compactCard: {
    marginBottom: 10,
  },
  cardPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
  image: {
    width: 88,
    height: 88,
    borderRadius: 14,
    backgroundColor: colors.borderCol,
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  titleRow: {
    gap: 2,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  sportName: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  metaText: {
    flex: 1,
    color: colors.secondaryText,
    fontSize: 12,
    fontWeight: "600",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  playersText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "800",
  },
  distanceText: {
    color: colors.secondaryText,
    fontSize: 11,
    fontWeight: "700",
  },
});
