import { StyleSheet } from "react-native";
import { colors } from "../constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  headerInfo: {
    flex: 1,
    minWidth: 0,
  },

  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
  },

  subtitle: {
    color: colors.secondaryText,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2,
  },

  centerBlock: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 10,
  },

  centerText: {
    color: colors.secondaryText,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },

  messagesContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 18,
    gap: 10,
  },

  emptyBlock: {
    marginTop: 60,
    alignItems: "center",
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
    fontWeight: "700",
    textAlign: "center",
  },

  messageRow: {
    flexDirection: "row",
  },

  myMessageRow: {
    justifyContent: "flex-end",
  },

  otherMessageRow: {
    justifyContent: "flex-start",
  },

  messageBubble: {
    maxWidth: "78%",
    borderRadius: 18,
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderWidth: 1,
  },

  myMessageBubble: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    borderBottomRightRadius: 6,
  },

  otherMessageBubble: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderBottomLeftRadius: 6,
  },

  senderName: {
    color: "#C4B5FD",
    fontSize: 11,
    fontWeight: "900",
    marginBottom: 3,
  },

  messageText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 20,
  },

  myMessageText: {
    color: colors.background,
  },

  messageTime: {
    color: colors.secondaryText,
    fontSize: 10,
    fontWeight: "800",
    marginTop: 4,
    alignSelf: "flex-end",
  },

  myMessageTime: {
    color: "rgba(15, 23, 42, 0.72)",
  },

  composerWrap: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },

  input: {
    flex: 1,
    minHeight: 46,
    maxHeight: 110,
    borderRadius: 18,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 10,
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
  },

  sendButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  disabledButton: {
    opacity: 0.55,
  },

  buttonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
});
