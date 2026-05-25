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

  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 10,
    marginTop: 8,
  },

  myEventsList: {
    paddingRight: 8,
    paddingBottom: 12,
  },

  myEventCard: {
    width: 170,
    minHeight: 112,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    marginRight: 8,
    position: "relative",
  },

  myEventCardActive: {
    borderColor: colors.primary,
    borderWidth: 2,
  },

  myEventCardContent: {
    minHeight: 110,
    padding: 12,
    paddingRight: 40,
  },

  myEventDeleteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(251, 113, 133, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },

  myEventTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 4,
  },

  myEventSport: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 6,
  },

  myEventMeta: {
    color: colors.secondaryText,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 3,
  },

  myEventsLoadingBlock: {
    height: 92,
    alignItems: "center",
    justifyContent: "center",
  },

  noMyEventsBlock: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },

  noMyEventsTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 4,
  },

  noMyEventsText: {
    color: colors.secondaryText,
    fontSize: 13,
    fontWeight: "600",
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

  locationSelectButton: {
    minHeight: 62,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 10,
  },

  locationSelectButtonActive: {
    borderColor: colors.primary,
  },

  locationSelectIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.borderCol,
    alignItems: "center",
    justifyContent: "center",
  },

  locationSelectTextBlock: {
    flex: 1,
  },

  locationSelectTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 3,
  },

  locationSelectMeta: {
    color: colors.secondaryText,
    fontSize: 12,
    fontWeight: "700",
  },

  formatSelector: {
    flexDirection: "row",
    gap: 10,
  },

  formatButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  formatButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  formatButtonText: {
    color: colors.secondaryText,
    fontSize: 14,
    fontWeight: "900",
  },

  formatButtonTextActive: {
    color: colors.background,
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

  counterButtonDisabled: {
    opacity: 0.45,
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

  editActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 22,
  },

  cancelButton: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  saveButton: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  cancelButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900",
  },

  saveButtonText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: "900",
  },

  buttonPressed: {
    opacity: 0.75,
  },

  locationPickerContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },

  locationPickerHeader: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },

  locationPickerTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900",
  },

  locationPickerHeaderButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },

  locationPickerMapWrapper: {
    flex: 1,
    overflow: "hidden",
  },

  locationPickerMap: {
    flex: 1,
  },

  locationPickerLoading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  locationPickerLoadingText: {
    color: colors.secondaryText,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 10,
  },

  locationPickerFooter: {
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 28,
  },

  locationPickerSummary: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },

  locationPickerSummaryTextBlock: {
    flex: 1,
  },

  locationPickerSummaryTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 3,
  },

  locationPickerSummaryText: {
    color: colors.secondaryText,
    fontSize: 12,
    fontWeight: "700",
  },

  locationPickerConfirmButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  locationPickerConfirmText: {
    color: colors.background,
    fontSize: 15,
    fontWeight: "900",
  },
});
