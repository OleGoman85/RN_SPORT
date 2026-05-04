import { Pressable, Text } from "react-native";
import { styles } from "../../../../styles/opponentSearch.styles";

type OptionButtonProps = {
  title: string;
  isSelected: boolean;
  onPress: () => void;
};

export const OptionButton = ({
  title,
  isSelected,
  onPress,
}: OptionButtonProps) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.optionButton,
        isSelected && styles.optionButtonActive,
        pressed && styles.buttonPressed,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.optionButtonText,
          isSelected && styles.optionButtonTextActive,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
};
