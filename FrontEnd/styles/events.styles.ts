import { StyleSheet } from "react-native";
import { colors } from "../constants/colors";

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
		paddingHorizontal: 12,
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
		marginBottom: 14,
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

	filterBlock: {
		marginBottom: 14,
		gap: 10,
	},

	searchInput: {
		height: 48,
		backgroundColor: "rgba(30, 41, 59, 0.94)",
		borderWidth: 1,
		borderColor: colors.borderCol,
		borderRadius: 16,
		paddingHorizontal: 16,
		color: colors.text,
		fontSize: 15,
	},

	sortRow: {
		flexDirection: "row",
		gap: 8,
	},

	sortButton: {
		flex: 1,
		backgroundColor: "rgba(15, 23, 42, 0.95)",
		borderWidth: 1,
		borderColor: colors.borderCol,
		borderRadius: 14,
		paddingVertical: 10,
		alignItems: "center",
	},

	sortButtonActive: {
		backgroundColor: colors.primary,
		borderColor: colors.primary,
	},

	sortButtonText: {
		color: colors.text,
		fontSize: 13,
		fontWeight: "900",
	},

	listContent: {
		paddingBottom: 28,
	},

	row: {
		gap: 10,
		marginBottom: 12,
	},

	card: {
		flex: 1,
		backgroundColor: "rgba(30, 41, 59, 0.94)",
		borderRadius: 16,
		overflow: "hidden",
		borderWidth: 1,
		borderColor: colors.border,
	},

	cardPressed: {
		opacity: 0.78,
		transform: [
			{
				scale: 0.98,
			},
		],
	},

	cardImage: {
		width: "100%",
		height: 82,
	},

	cardContent: {
		padding: 8,
	},

	sportName: {
		color: colors.primary,
		fontSize: 12,
		fontWeight: "900",
		marginBottom: 3,
	},

	nickname: {
		color: colors.text,
		fontSize: 12,
		fontWeight: "800",
		marginBottom: 3,
	},

	cardText: {
		color: "#cbd5e1",
		fontSize: 10,
		fontWeight: "600",
		marginBottom: 2,
	},

	ratingText: {
		color: "#ffb86b",
		fontSize: 11,
		fontWeight: "900",
		marginTop: 2,
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

	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.72)",
		justifyContent: "center",
		padding: 18,
	},

	modalCard: {
		backgroundColor: colors.background,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 24,
		padding: 16,
	},

	modalHeader: {
		flexDirection: "row",
		gap: 12,
		marginBottom: 14,
	},

	modalSportImage: {
		width: 86,
		height: 86,
		borderRadius: 18,
	},

	modalHeaderInfo: {
		flex: 1,
		justifyContent: "center",
	},

	modalTitle: {
		color: colors.primary,
		fontSize: 24,
		fontWeight: "900",
	},

	modalSubtitle: {
		color: colors.text,
		fontSize: 15,
		fontWeight: "800",
		marginTop: 4,
	},

	infoBlock: {
		backgroundColor: "rgba(15, 23, 42, 0.78)",
		borderWidth: 1,
		borderColor: colors.borderCol,
		borderRadius: 16,
		padding: 12,
		gap: 5,
		marginBottom: 12,
	},

	infoText: {
		color: colors.secondaryText,
		fontSize: 13,
		fontWeight: "700",
	},

	profileBlock: {
		backgroundColor: "rgba(15, 23, 42, 0.78)",
		borderWidth: 1,
		borderColor: colors.borderCol,
		borderRadius: 16,
		padding: 12,
		marginBottom: 14,
	},

	profileTitle: {
		color: colors.text,
		fontSize: 16,
		fontWeight: "900",
		marginBottom: 8,
	},

	profileText: {
		color: colors.secondaryText,
		fontSize: 13,
		fontWeight: "700",
		marginBottom: 4,
	},

	aboutMe: {
		color: "#cbd5e1",
		fontSize: 13,
		lineHeight: 18,
		marginTop: 8,
	},

	modalActions: {
		flexDirection: "row",
		gap: 8,
	},

	closeButton: {
		flex: 1,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 14,
		paddingVertical: 13,
		alignItems: "center",
	},

	closeButtonText: {
		color: colors.secondaryText,
		fontSize: 13,
		fontWeight: "900",
	},

	secondaryButton: {
		flex: 1,
		backgroundColor: "rgba(255, 122, 0, 0.18)",
		borderWidth: 1,
		borderColor: colors.primary,
		borderRadius: 14,
		paddingVertical: 13,
		alignItems: "center",
	},

	secondaryButtonText: {
		color: "#ffb86b",
		fontSize: 13,
		fontWeight: "900",
	},

	joinButton: {
		flex: 1,
		backgroundColor: colors.primary,
		borderRadius: 14,
		paddingVertical: 13,
		alignItems: "center",
	},

	deleteButton: {
		flex: 1,
		backgroundColor: "#ef4444",
		borderRadius: 14,
		paddingVertical: 13,
		alignItems: "center",
	},

	actionButtonText: {
		color: colors.text,
		fontSize: 13,
		fontWeight: "900",
	},

	buttonPressed: {
		opacity: 0.75,
	},
});
