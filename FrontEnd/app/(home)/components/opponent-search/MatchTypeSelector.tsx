import { View } from "react-native";
import {
  matchTypes,
  MatchType,
} from "../../constants/opponentSearchOptions";
import { styles } from "../../../../styles/opponentSearch.styles";
import { OptionButton } from "./OptionButton";
import { OpponentSection } from "./OpponentSection";

type MatchTypeSelectorProps = {
  matchType: MatchType;
  onChangeMatchType: (matchType: MatchType) => void;
};

export const MatchTypeSelector = ({
  matchType,
  onChangeMatchType,
}: MatchTypeSelectorProps) => {
  return (
    <OpponentSection title="Match type">
      <View style={styles.optionsWrap}>
        {matchTypes.map((item) => (
          <OptionButton
            key={item}
            title={item}
            isSelected={matchType === item}
            onPress={() => onChangeMatchType(item)}
          />
        ))}
      </View>
    </OpponentSection>
  );
};
