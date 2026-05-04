import { StyleSheet } from "react-native";
import { colors } from "../app/constants/colors";

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.72)",
    justifyContent: "flex-end",
  },

  modalCard: {
    maxHeight: "90%",
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },

  header: {
    marginBottom: 16,
  },

  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 4,
  },

  subtitle: {
    color: colors.secondaryText,
    fontSize: 14,
    lineHeight: 20,
  },

  section: {
    marginBottom: 18,
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 10,
  },

  distanceTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
    marginTop: 14,
    marginBottom: 10,
  },

  optionsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  optionButton: {
    backgroundColor: "rgba(15, 23, 42, 0.95)",
    borderWidth: 1,
    borderColor: colors.borderCol,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
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

  buttonPressed: {
    opacity: 0.75,
  },

  sliderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  sliderText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "900",
  },

  sliderLabel: {
    color: colors.secondaryText,
    fontSize: 13,
    fontWeight: "800",
    marginTop: 8,
    marginBottom: 2,
  },

  timeButtonsRow: {
    flexDirection: "row",
    gap: 10,
  },

  timeButton: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.95)",
    borderWidth: 1,
    borderColor: colors.borderCol,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },

  timeButtonLabel: {
    color: colors.secondaryText,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 4,
  },

  timeButtonText: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
  },

  doneButton: {
    backgroundColor: "rgba(255, 122, 0, 0.18)",
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 12,
  },

  doneButtonText: {
    color: "#ffb86b",
    fontSize: 14,
    fontWeight: "900",
  },

  inputRow: {
    flexDirection: "row",
    gap: 10,
  },

  inputRowWithTopMargin: {
    marginTop: 10,
  },

  input: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.95)",
    borderWidth: 1,
    borderColor: colors.borderCol,
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 14,
    color: colors.text,
    fontSize: 14,
  },

  cityInput: {
    backgroundColor: "rgba(15, 23, 42, 0.95)",
    borderWidth: 1,
    borderColor: colors.borderCol,
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 14,
    color: colors.text,
    fontSize: 14,
    marginTop: 14,
  },

  selectedDatesBlock: {
    backgroundColor: "rgba(15, 23, 42, 0.95)",
    borderWidth: 1,
    borderColor: colors.borderCol,
    borderRadius: 14,
    padding: 12,
    marginTop: 12,
  },

  selectedDatesTitle: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 4,
  },

  selectedDatesText: {
    color: colors.text,
    fontSize: 13,
    lineHeight: 18,
  },

  helperText: {
    color: colors.secondaryText,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 8,
  },

  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
    paddingBottom: 8,
  },

  closeButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
  },

  closeButtonText: {
    color: colors.secondaryText,
    fontSize: 15,
    fontWeight: "900",
  },

  searchButton: {
    flex: 2,
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
  },

  searchButtonText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900",
  },
  pickerContainer: {
  backgroundColor: colors.timeBg,
  borderRadius: 16,
  paddingVertical: 8,
  marginTop: 12,
  overflow: "hidden",
  fontWeight: "900"
},
});
