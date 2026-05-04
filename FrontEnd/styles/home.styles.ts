import { StyleSheet } from "react-native";
import { colors } from "../app/constants/colors";


export const styles = StyleSheet.create({
  container: {
	flex: 1,
	backgroundColor: colors.background,
	paddingHorizontal: 12,
  },

  header: {
	flexDirection: "row",
	alignItems: "center",
	justifyContent: "space-between",
	paddingTop: 14,
	marginBottom: 14,
	gap: 10,
  },

  roundButton: {
	width: 44,
	height: 44,
	borderRadius: 22,
	backgroundColor: "rgba(255, 255, 255, 0.14)",
	justifyContent: "center",
	alignItems: "center",
  },

  headerTitle: {
	flex: 1,
	color: colors.primary,
	fontSize: 20,
	fontWeight: "800",
	lineHeight: 25,
	textAlign: "center",
  },

  searchContainer: {
	flexDirection: "row",
	gap: 10,
	marginBottom: 14,
  },

  searchInput: {
	flex: 1,
	height: 48,
	backgroundColor: "rgba(30, 41, 59, 0.94)",
	borderWidth: 1,
	borderColor: colors.borderCol,
	borderRadius: 16,
	paddingHorizontal: 16,
	color: colors.primary,
	fontSize: 16,
  },

  sortButton: {
	width: 48,
	height: 48,
	borderRadius: 16,
	backgroundColor: colors.primary,
	justifyContent: "center",
	alignItems: "center",
  },

  buttonPressed: {
	opacity: 0.75,
  },

  listContent: {
	paddingBottom: 24,
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
	borderColor: "rgba(255, 255, 255, 0.12)",
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
	padding: 7,
  },

  cardTitle: {
	color: colors.primary,
	fontSize: 12,
	fontWeight: "800",
	marginBottom: 4,
  },

  cardText: {
	color: "#cbd5e1",
	fontSize: 10,
	fontWeight: "500",
  },
});

