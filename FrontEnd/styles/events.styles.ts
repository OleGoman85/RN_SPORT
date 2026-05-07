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

	avatarButton: {
		width: 64,
		height: 64,
		borderRadius: 32,
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

	nameRow: {
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

	buttonPressed: {
		opacity: 0.75,
	},

	profileModalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.72)",
		justifyContent: "center",
		padding: 18,
	},

	profileModalCard: {
		maxHeight: "86%",
		backgroundColor: colors.background,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 26,
		padding: 18,
	},

	profileHeader: {
		alignItems: "center",
		marginBottom: 18,
	},

	profileAvatar: {
		width: 110,
		height: 110,
		borderRadius: 55,
		borderWidth: 3,
		borderColor: colors.primary,
		marginBottom: 12,
	},

	profileAvatarPlaceholder: {
		width: 110,
		height: 110,
		borderRadius: 55,
		backgroundColor: "rgba(15, 23, 42, 0.95)",
		borderWidth: 3,
		borderColor: colors.primary,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 12,
	},

	profileAvatarText: {
		color: colors.primary,
		fontSize: 34,
		fontWeight: "900",
	},

	profileNickname: {
		color: colors.primary,
		fontSize: 24,
		fontWeight: "900",
	},

	profileName: {
		color: colors.text,
		fontSize: 16,
		fontWeight: "800",
		marginTop: 4,
	},

	profileRating: {
		color: "#facc15",
		fontSize: 14,
		fontWeight: "900",
		marginTop: 8,
	},

	profileInfoBlock: {
		backgroundColor: "rgba(15, 23, 42, 0.78)",
		borderWidth: 1,
		borderColor: colors.borderCol,
		borderRadius: 18,
		padding: 14,
		gap: 7,
	},

	profileInfoText: {
		color: colors.secondaryText,
		fontSize: 14,
		fontWeight: "700",
	},

	profileAboutBlock: {
		marginTop: 14,
		backgroundColor: "rgba(15, 23, 42, 0.78)",
		borderWidth: 1,
		borderColor: colors.borderCol,
		borderRadius: 18,
		padding: 14,
	},

	profileAboutTitle: {
		color: colors.text,
		fontSize: 17,
		fontWeight: "900",
		marginBottom: 8,
	},

	profileAboutText: {
		color: "#cbd5e1",
		fontSize: 14,
		lineHeight: 20,
	},

	profileCloseButton: {
		backgroundColor: colors.primary,
		borderRadius: 16,
		paddingVertical: 14,
		alignItems: "center",
		marginTop: 16,
	},

	profileCloseButtonText: {
		color: colors.text,
		fontSize: 15,
		fontWeight: "900",
	},
});
