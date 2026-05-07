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
		marginBottom: 18,
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

	listContent: {
		paddingBottom: 28,
		gap: 12,
	},

	card: {
		flexDirection: "row",
		backgroundColor: colors.card,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 22,
		padding: 12,
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

	nicknameRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		gap: 8,
	},

	nickname: {
		color: colors.primary,
		fontSize: 19,
		fontWeight: "900",
		flex: 1,
	},

	ratingBadge: {
		color: "#facc15",
		fontSize: 12,
		fontWeight: "900",
		backgroundColor: "rgba(250, 204, 21, 0.12)",
		borderWidth: 1,
		borderColor: "rgba(250, 204, 21, 0.35)",
		borderRadius: 12,
		paddingVertical: 4,
		paddingHorizontal: 8,
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

	matchSource: {
		color: "#ffb86b",
		fontSize: 13,
		fontWeight: "900",
		marginTop: 6,
	},

	aboutMe: {
		color: "#cbd5e1",
		fontSize: 13,
		lineHeight: 18,
		marginTop: 8,
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
	},

	emptyText: {
		color: colors.secondaryText,
		fontSize: 15,
		lineHeight: 22,
		textAlign: "center",
	},
});
