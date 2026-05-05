import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { styles } from "../../styles/opponentSearch.styles";
import { useOpponentSearchForm } from "../../hooks/useOpponentSearchForm";
import { OpponentSearchResult } from "../../types/opponentSearch";
import { AgeRangeSelector } from "./AgeRangeSelector";
import { DateSelector } from "./DateSelector";
import { GenderSelector } from "./GenderSelector";
import { LanguagesSelector } from "./LanguagesSelector";
import { LevelSelector } from "./LevelSelector";
import { LocationSelector } from "./LocationSelector";
import { MatchTypeSelector } from "./MatchTypeSelector";
import { TimeRangeSelector } from "./TimeRangeSelector";

type OpponentSearchModalProps = {
  visible: boolean;
  sportName: string;
  onClose: () => void;
  onSearchFinished: (opponents: OpponentSearchResult[]) => void;
};

export const OpponentSearchModal = ({
  visible,
  sportName,
  onClose,
  onSearchFinished,
}: OpponentSearchModalProps) => {
  const opponentSearchForm = useOpponentSearchForm(sportName);

  const handlePressSearch = async () => {
    const opponents = await opponentSearchForm.handleSearch();

    if (opponents === null) {
      return;
    }

    onClose();
    onSearchFinished(opponents);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Text style={styles.title}>Find opponents</Text>

              <Text style={styles.subtitle}>
                Sport: {sportName || "Not selected"}
              </Text>
            </View>

            <LevelSelector
              level={opponentSearchForm.level}
              onChangeLevel={opponentSearchForm.setLevel}
            />

            <LanguagesSelector
              languages={opponentSearchForm.languages}
              onToggleLanguage={opponentSearchForm.handleToggleLanguage}
            />

            <AgeRangeSelector
              ageMin={opponentSearchForm.ageMin}
              ageMax={opponentSearchForm.ageMax}
              onChangeAgeMin={opponentSearchForm.setAgeMin}
              onChangeAgeMax={opponentSearchForm.setAgeMax}
            />

            <GenderSelector
              sex={opponentSearchForm.sex}
              onToggleSex={opponentSearchForm.handleToggleSex}
            />

            <DateSelector
              selectedDates={opponentSearchForm.selectedDates}
              onToggleDate={opponentSearchForm.handleToggleDate}
            />

            <TimeRangeSelector
              timeFrom={opponentSearchForm.timeFrom}
              timeTo={opponentSearchForm.timeTo}
              onChangeTimeFrom={opponentSearchForm.setTimeFrom}
              onChangeTimeTo={opponentSearchForm.setTimeTo}
            />

            <LocationSelector
              locationMode={opponentSearchForm.locationMode}
              radiusKm={opponentSearchForm.radiusKm}
              city={opponentSearchForm.city}
              latitude={opponentSearchForm.latitude}
              longitude={opponentSearchForm.longitude}
              onChangeLocationMode={opponentSearchForm.setLocationMode}
              onChangeRadiusKm={opponentSearchForm.setRadiusKm}
              onChangeCity={opponentSearchForm.setCity}
              onUseLocation={opponentSearchForm.handleUseMyLocation}
            />

            <MatchTypeSelector
              matchType={opponentSearchForm.matchType}
              onChangeMatchType={opponentSearchForm.setMatchType}
            />

            <View style={styles.actions}>
              <Pressable
                style={({ pressed }) => [
                  styles.closeButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={onClose}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.searchButton,
                  opponentSearchForm.isLoading && styles.buttonDisabled,
                  pressed && styles.buttonPressed,
                ]}
                onPress={handlePressSearch}
                disabled={opponentSearchForm.isLoading}
              >
                <Text style={styles.searchButtonText}>
                  {opponentSearchForm.isLoading ? "Searching..." : "Search"}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
