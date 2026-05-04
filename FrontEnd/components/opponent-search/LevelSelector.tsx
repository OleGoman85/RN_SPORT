import { View } from "react-native";
import {
  opponentLevels,
  OpponentLevel,
} from "../../constants/opponentSearchOptions";
import { styles } from "../../styles/opponentSearch.styles";
import { OptionButton } from "./OptionButton";
import { OpponentSection } from "./OpponentSection";

type LevelSelectorProps = {
  level: OpponentLevel;
  onChangeLevel: (level: OpponentLevel) => void;
};

export const LevelSelector = ({ level, onChangeLevel }: LevelSelectorProps) => {
  return (
    <OpponentSection title="Opponent level">
      <View style={styles.optionsWrap}>
        {opponentLevels.map((item) => (
          <OptionButton
            key={item}
            title={item}
            isSelected={level === item}
            onPress={() => onChangeLevel(item)}
          />
        ))}
      </View>
    </OpponentSection>
  );
};
