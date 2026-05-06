import { StyleSheet } from "react-native";
import { colors } from "../constants/colors";

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
		paddingHorizontal: 16,
	},

	centerContainer: {
		flex: 1,
		backgroundColor: colors.background,
		justifyContent: "center",
		alignItems: "center",
	},

	loadingText: {
		color: colors.secondaryText,
		fontSize: 15,
		marginTop: 12,
	},

	header: {
		paddingTop: 14,
		marginBottom: 18,
	},

	title: {
		color: colors.text,
		fontSize: 34,
		fontWeight: "900",
	},

	subtitle: {
		color: colors.secondaryText,
		fontSize: 15,
		marginTop: 4,
		lineHeight: 21,
	},

	listContent: {
		paddingBottom: 28,
		gap: 14,
	},

	card: {
		backgroundColor: colors.card,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 22,
		padding: 14,
	},

	topRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		marginBottom: 14,
	},

	avatar: {
		width: 64,
		height: 64,
		borderRadius: 32,
		borderWidth: 2,
		borderColor: colors.primary,
	},

	avatarPlaceholder: {
		width: 64,
		height: 64,
		borderRadius: 32,
		backgroundColor: "rgba(15, 23, 42, 0.95)",
		borderWidth: 2,
		borderColor: colors.primary,
		justifyContent: "center",
		alignItems: "center",
	},

	avatarPlaceholderText: {
		color: colors.primary,
		fontSize: 24,
		fontWeight: "900",
	},

	userInfo: {
		flex: 1,
	},

	nickname: {
		color: colors.primary,
		fontSize: 19,
		fontWeight: "900",
	},

	name: {
		color: colors.text,
		fontSize: 14,
		fontWeight: "800",
		marginTop: 2,
	},

	location: {
		color: colors.secondaryText,
		fontSize: 13,
		marginTop: 3,
	},

	infoBlock: {
		backgroundColor: "rgba(15, 23, 42, 0.78)",
		borderWidth: 1,
		borderColor: colors.borderCol,
		borderRadius: 16,
		padding: 12,
		gap: 5,
	},

	sport: {
		color: colors.text,
		fontSize: 18,
		fontWeight: "900",
		marginBottom: 4,
	},

	text: {
		color: colors.secondaryText,
		fontSize: 13,
	},

	aboutMe: {
		color: "#cbd5e1",
		fontSize: 13,
		lineHeight: 18,
		marginTop: 12,
	},

	joinButton: {
		backgroundColor: colors.primary,
		borderRadius: 16,
		paddingVertical: 13,
		alignItems: "center",
		marginTop: 14,
	},

	joinButtonText: {
		color: colors.text,
		fontSize: 15,
		fontWeight: "900",
	},

	emptyBlock: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 28,
	},

	emptyTitle: {
		color: colors.text,
		fontSize: 24,
		fontWeight: "900",
		marginBottom: 8,
	},

	emptyText: {
		color: colors.secondaryText,
		fontSize: 15,
		textAlign: "center",
		lineHeight: 22,
	},
});
