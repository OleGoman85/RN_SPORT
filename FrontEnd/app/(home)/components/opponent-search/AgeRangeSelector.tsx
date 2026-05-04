import Slider from "@react-native-community/slider";
import { Text, View } from "react-native";
import { styles } from "../../../../styles/opponentSearch.styles";
import { OpponentSection } from "./OpponentSection";
import { colors } from "../../../constants/colors";

type AgeRangeSelectorProps = {
  ageMin: number;
  ageMax: number;
  onChangeAgeMin: (value: number) => void;
  onChangeAgeMax: (value: number) => void;
};

export const AgeRangeSelector = ({
  ageMin,
  ageMax,
  onChangeAgeMin,
  onChangeAgeMax,
}: AgeRangeSelectorProps) => {
  const handleChangeMinAge = (value: number) => {
    const nextValue = Math.round(value);

    if (nextValue > ageMax) {
      onChangeAgeMin(ageMax);
      return;
    }

    onChangeAgeMin(nextValue);
  };

  const handleChangeMaxAge = (value: number) => {
    const nextValue = Math.round(value);

    if (nextValue < ageMin) {
      onChangeAgeMax(ageMin);
      return;
    }

    onChangeAgeMax(nextValue);
  };

  return (
    <OpponentSection title="Age range">
      <View style={styles.sliderHeader}>
        <Text style={styles.sliderText}>From {ageMin}</Text>
        <Text style={styles.sliderText}>To {ageMax}</Text>
      </View>

      <Text style={styles.sliderLabel}>Minimum age</Text>

      <Slider
        minimumValue={18}
        maximumValue={90}
        step={1}
        value={ageMin}
        onValueChange={handleChangeMinAge}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor={colors.borderCol}
        thumbTintColor={colors.primary}
      />

      <Text style={styles.sliderLabel}>Maximum age</Text>

      <Slider
        minimumValue={16}
        maximumValue={80}
        step={1}
        value={ageMax}
        onValueChange={handleChangeMaxAge}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor={colors.borderCol}
        thumbTintColor={colors.primary}
      />
    </OpponentSection>
  );
};
