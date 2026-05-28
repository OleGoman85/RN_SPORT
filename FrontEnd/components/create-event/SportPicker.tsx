// Searchable sport picker used by the create/edit event form.
import { Ionicons } from "@expo/vector-icons";
import {
  FlatList,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { colors } from "../../constants/colors";
import { Sport } from "../../data/sports";
import { styles } from "../../styles/createEvent.styles";

type SportPickerProps = {
  searchText: string;
  setSearchText: (value: string) => void;
  selectedSportName: string;
  filteredSports: Sport[];
  onSelectSport: (sportName: string) => void;
};

export function SportPicker({
  searchText,
  setSearchText,
  selectedSportName,
  filteredSports,
  onSelectSport,
}: SportPickerProps) {
  const renderSportItem = ({ item }: { item: Sport }) => {
    const isSelected = selectedSportName === item.name;

    return (
      <Pressable
        style={({ pressed }) => [
          styles.sportItem,
          pressed && styles.buttonPressed,
        ]}
        onPress={() => onSelectSport(item.name)}
      >
        <View style={[styles.sportIcon, isSelected && styles.sportIconActive]}>
          <Image source={item.image} style={styles.sportImage} />
        </View>

        <Text
          style={[styles.sportName, isSelected && styles.sportNameActive]}
          numberOfLines={1}
        >
          {item.name}
        </Text>
      </Pressable>
    );
  };

  return (
    <>
      <Text style={styles.sectionTitle}>Choose Sport</Text>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={colors.secondaryText} />

        <TextInput
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search sport..."
          placeholderTextColor={colors.secondaryText}
        />
      </View>

      <FlatList
        data={filteredSports}
        keyExtractor={(item) => item.id}
        renderItem={renderSportItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.sportsList}
      />
    </>
  );
}
