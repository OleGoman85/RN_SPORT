import { View } from "react-native";
import {
  opponentLanguages,
  OpponentLanguage,
} from "../../constants/opponentSearchOptions";
import { styles } from "../../styles/opponentSearch.styles";
import { OptionButton } from "./OptionButton";
import { OpponentSection } from "./OpponentSection";

type LanguagesSelectorProps = {
  languages: OpponentLanguage[];
  onToggleLanguage: (language: OpponentLanguage) => void;
};

export const LanguagesSelector = ({
  languages,
  onToggleLanguage,
}: LanguagesSelectorProps) => {
  return (
    <OpponentSection title="Languages">
      <View style={styles.optionsWrap}>
        {opponentLanguages.map((item) => (
          <OptionButton
            key={item}
            title={item}
            isSelected={languages.includes(item)}
            onPress={() => onToggleLanguage(item)}
          />
        ))}
      </View>
    </OpponentSection>
  );
};
