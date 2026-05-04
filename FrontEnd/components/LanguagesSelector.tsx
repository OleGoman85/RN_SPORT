import { Pressable, Text, View } from "react-native";
import { languageOptions } from "../constants/profileOptions";
import { styles } from "../styles/profile.styles";

type LanguagesSelectorProps = {
  selectedLanguages: string[];
  onToggleLanguage: (language: string) => void;
};

export function LanguagesSelector({
  selectedLanguages,
  onToggleLanguage,
}: LanguagesSelectorProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Languages</Text>

      <Text style={styles.helperText}>Select languages you speak.</Text>

      <View style={styles.languagesContainer}>
        {languageOptions.map((language) => {
          const isSelected = selectedLanguages.includes(language);

          return (
            <Pressable
              key={language}
              style={[
                styles.languageButton,
                isSelected && styles.languageButtonActive,
              ]}
              onPress={() => onToggleLanguage(language)}
            >
              <Text
                style={[
                  styles.languageButtonText,
                  isSelected && styles.languageButtonTextActive,
                ]}
              >
                {language}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
