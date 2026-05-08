import { StyleSheet } from "react-native";
import { colors } from "../constants/colors";

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
		paddingHorizontal: 16,
	},

	header: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		paddingTop: 14,
		marginBottom: 14,
	},

	backButton: {
		width: 44,
		height: 44,
		borderRadius: 22,
		backgroundColor: "rgba(255, 255, 255, 0.12)",
		justifyContent: "center",
		alignItems: "center",
	},

	buttonPressed: {
		opacity: 0.75,
	},

	headerTextBlock: {
		flex: 1,
	},

	title: {
		color: colors.text,
		fontSize: 28,
		fontWeight: "900",
	},

	subtitle: {
		color: colors.secondaryText,
		fontSize: 14,
		marginTop: 3,
	},

	tabs: {
		flexDirection: "row",
		backgroundColor: "rgba(15, 23, 42, 0.95)",
		borderWidth: 1,
		borderColor: colors.borderCol,
		borderRadius: 16,
		padding: 4,
		marginBottom: 14,
	},

	tabButton: {
		flex: 1,
		borderRadius: 12,
		paddingVertical: 11,
		alignItems: "center",
	},

	tabButtonActive: {
		backgroundColor: colors.primary,
	},

	tabText: {
		color: colors.secondaryText,
		fontSize: 14,
		fontWeight: "900",
	},

	tabTextActive: {
		color: colors.text,
	},

	listContent: {
		paddingBottom: 28,
		gap: 12,
	},

	card: {
		backgroundColor: colors.card,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 22,
		padding: 12,
		gap: 12,
	},

	topRow: {
		flexDirection: "row",
		gap: 12,
	},

	avatar: {
		width: 78,
		height: 78,
		borderRadius: 39,
		borderWidth: 2,
		borderColor: colors.primary,
	},

	avatarPlaceholder: {
		width: 78,
		height: 78,
		borderRadius: 39,
		backgroundColor: "rgba(15, 23, 42, 0.95)",
		borderWidth: 2,
		borderColor: colors.primary,
		justifyContent: "center",
		alignItems: "center",
	},

	avatarPlaceholderText: {
		color: colors.primary,
		fontSize: 28,
		fontWeight: "900",
	},

	cardInfo: {
		flex: 1,
	},

	nameRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		gap: 8,
		alignItems: "center",
	},

	nickname: {
		color: colors.primary,
		fontSize: 19,
		fontWeight: "900",
		flex: 1,
	},

	ratingText: {
		color: "#facc15",
		fontSize: 12,
		fontWeight: "900",
	},

	fullName: {
		color: colors.text,
		fontSize: 15,
		fontWeight: "800",
		marginTop: 2,
	},

	text: {
		color: colors.secondaryText,
		fontSize: 13,
		marginTop: 4,
	},

	infoBlock: {
		backgroundColor: "rgba(15, 23, 42, 0.78)",
		borderWidth: 1,
		borderColor: colors.borderCol,
		borderRadius: 16,
		padding: 12,
		gap: 3,
	},

	infoTitle: {
		color: colors.text,
		fontSize: 18,
		fontWeight: "900",
		marginBottom: 4,
	},

	aboutMe: {
		color: "#cbd5e1",
		fontSize: 13,
		lineHeight: 18,
	},

	joinButton: {
		backgroundColor: colors.primary,
		borderRadius: 16,
		paddingVertical: 13,
		alignItems: "center",
	},

	joinButtonText: {
		color: colors.text,
		fontSize: 15,
		fontWeight: "900",
	},

	messageButton: {
		backgroundColor: colors.primary,
		borderRadius: 16,
		paddingVertical: 13,
		alignItems: "center",
	},

	messageButtonText: {
		color: colors.text,
		fontSize: 15,
		fontWeight: "900",
	},

	deleteButton: {
		backgroundColor: "rgba(251, 113, 133, 0.16)",
		borderWidth: 1,
		borderColor: "#fb7185",
		borderRadius: 16,
		paddingVertical: 13,
		alignItems: "center",
	},

	deleteButtonText: {
		color: "#fb7185",
		fontSize: 15,
		fontWeight: "900",
	},

	emptyBlock: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 26,
	},

	emptyTitle: {
		color: colors.text,
		fontSize: 24,
		fontWeight: "900",
		marginTop: 16,
		marginBottom: 8,
		textAlign: "center",
	},

	emptyText: {
		color: colors.secondaryText,
		fontSize: 15,
		lineHeight: 22,
		textAlign: "center",
	},
});
