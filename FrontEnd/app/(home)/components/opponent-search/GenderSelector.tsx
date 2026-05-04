import { View } from "react-native";
import {
  opponentSexOptions,
  OpponentSex,
} from "../../constants/opponentSearchOptions";
import { styles } from "../../../../styles/opponentSearch.styles";
import { OptionButton } from "./OptionButton";
import { OpponentSection } from "./OpponentSection";

type GenderSelectorProps = {
  sex: OpponentSex[];
  onToggleSex: (sex: OpponentSex) => void;
};

export const GenderSelector = ({ sex, onToggleSex }: GenderSelectorProps) => {
  return (
    <OpponentSection
      title="Gender"
      helperText="You can select both options to search everyone."
    >
      <View style={styles.optionsWrap}>
        {opponentSexOptions.map((item) => (
          <OptionButton
            key={item}
            title={item}
            isSelected={sex.includes(item)}
            onPress={() => onToggleSex(item)}
          />
        ))}
      </View>
    </OpponentSection>
  );
};
