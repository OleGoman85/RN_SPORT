import { Image, Pressable, Text, View } from "react-native";
import { sports } from "../data/sports";
import { sportLevels } from "../constants/profileOptions";
import { styles } from "../../styles/profile.styles";

type SportsSelectorProps = {
  getSportLevel: (sportName: string) => string | undefined;
  onToggleSport: (sportName: string) => void;
  onChangeSportLevel: (sportName: string, level: string) => void;
};

export function SportsSelector({
  getSportLevel,
  onToggleSport,
  onChangeSportLevel,
}: SportsSelectorProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>My Sports</Text>

      <Text style={styles.helperText}>
        Choose sports and set your level for each one.
      </Text>

      <View style={styles.sportsList}>
        {sports.map((sport) => {
          const selectedLevel = getSportLevel(sport.name);
          const isSelected = Boolean(selectedLevel);

          return (
            <View
              key={sport.id}
              style={[
                styles.sportCard,
                isSelected && styles.sportCardSelected,
              ]}
            >
              <Pressable
                style={styles.sportHeader}
                onPress={() => onToggleSport(sport.name)}
              >
                <Image source={sport.image} style={styles.sportImage} />

                <View style={styles.sportInfo}>
                  <Text style={styles.sportName}>{sport.name}</Text>

                  <Text style={styles.sportStatus}>
                    {isSelected ? "Selected" : "Tap to select"}
                  </Text>
                </View>
              </Pressable>

              {isSelected && (
                <View style={styles.levelRow}>
                  {sportLevels.map((level) => (
                    <Pressable
                      key={level}
                      style={[
                        styles.levelButton,
                        selectedLevel === level && styles.levelButtonActive,
                      ]}
                      onPress={() => onChangeSportLevel(sport.name, level)}
                    >
                      <Text
                        style={[
                          styles.levelButtonText,
                          selectedLevel === level &&
                            styles.levelButtonTextActive,
                        ]}
                      >
                        {level}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}
