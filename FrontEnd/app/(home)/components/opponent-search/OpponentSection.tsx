import { ReactNode } from "react";
import { Text, View } from "react-native";
import { styles } from "../../../../styles/opponentSearch.styles";

type OpponentSectionProps = {
  title: string;
  helperText?: string;
  children: ReactNode;
};

export const OpponentSection=({
  title,
  helperText,
  children,
}: OpponentSectionProps) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>

      {children}

      {helperText && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
}
