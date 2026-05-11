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
    marginBottom: 14,
  },

  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
  },

  filtersRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },

  filterButton: {
    flex: 1,
    minHeight: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },

  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  filterText: {
    color: colors.secondaryText,
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center",
  },

  filterTextActive: {
    color: colors.background,
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

  listContent: {
    paddingBottom: 110,
  },

  buttonPressed: {
    opacity: 0.75,
  },
});
