import { Text, TextInput, View } from "react-native";
import { radiusOptions } from "../../constants/opponentSearchOptions";
import { SearchLocationMode } from "../../types/opponentSearch";
import { colors } from "../../constants/colors";
import { styles } from "../../styles/opponentSearch.styles";
import { OptionButton } from "./OptionButton";
import { OpponentSection } from "./OpponentSection";

type LocationSelectorProps = {
  locationMode: SearchLocationMode;
  radiusKm: number;
  city: string;
  onChangeLocationMode: (mode: SearchLocationMode) => void;
  onChangeRadiusKm: (radius: number) => void;
  onChangeCity: (city: string) => void;
};

export const LocationSelector = ({
  locationMode,
  radiusKm,
  city,
  onChangeLocationMode,
  onChangeRadiusKm,
  onChangeCity,
}: LocationSelectorProps) => {
  return (
    <OpponentSection title="Location">
      <View style={styles.optionsWrap}>
        <OptionButton
          title="Near me"
          isSelected={locationMode === "near_me"}
          onPress={() => onChangeLocationMode("near_me")}
        />

        <OptionButton
          title="Specific city"
          isSelected={locationMode === "city"}
          onPress={() => onChangeLocationMode("city")}
        />
      </View>

      {locationMode === "near_me" ? (
        <>
          <Text style={styles.distanceTitle}>Distance: {radiusKm} km</Text>

          <View style={styles.optionsWrap}>
            {radiusOptions.map((item) => (
              <OptionButton
                key={item}
                title={`${item} km`}
                isSelected={radiusKm === item}
                onPress={() => onChangeRadiusKm(item)}
              />
            ))}
          </View>
        </>
      ) : (
        <TextInput
          style={styles.cityInput}
          value={city}
          onChangeText={onChangeCity}
          placeholder="Enter city"
          placeholderTextColor={colors.secondaryText}
        />
      )}
    </OpponentSection>
  );
};
