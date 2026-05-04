import { StyleSheet } from "react-native";
import { colors } from "../app/constants/colors";


export const styles = StyleSheet.create({
  container: {
	flex: 1,
	backgroundColor: colors.background,
	justifyContent: "center",
	alignItems: "center",
  },

  title: {
	color: colors.primary,
	fontSize: 30,
	fontWeight: "800",
  },

  subtitle: {
	color: colors.secondaryText,
	fontSize: 16,
	marginTop: 8,
  },
});
