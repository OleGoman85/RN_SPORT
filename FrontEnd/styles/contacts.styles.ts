import { StyleSheet } from "react-native";
import { colors } from "../constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: 14,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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

  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  centerBlock: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 80,
  },

  loadingText: {
    color: colors.secondaryText,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 12,
  },

  emptyBlock: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 18,
    gap: 8,
  },

  emptyTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900",
  },

  emptyText: {
    color: colors.secondaryText,
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 19,
  },

  listContent: {
    paddingBottom: 110,
    gap: 12,
  },

  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 12,
    gap: 12,
  },

  contactInfo: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },

  contactName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
  },

  contactNickname: {
    color: "#9A7CFF",
    fontSize: 13,
    fontWeight: "900",
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
    fontWeight: "700",
  },

  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 2,
  },

  statText: {
    color: colors.secondaryText,
    fontSize: 11,
    fontWeight: "800",
  },

  cardActions: {
    gap: 8,
  },

  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  removeButton: {
    borderColor: "rgba(251, 113, 133, 0.35)",
  },

  buttonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
});
