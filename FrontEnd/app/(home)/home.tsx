import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { sports, type Sport } from "./data/sports";
import { styles } from "../styles/home.styles";
import { colors } from "../constants/colors";

export default function HomeScreen() {
  const [searchText, setSearchText] = useState("");
  const [isAscending, setIsAscending] = useState(true);

  const filteredSports = sports
    .filter((sport) =>
      sport.name.toLowerCase().includes(searchText.toLowerCase()),
    )
    .sort((firstSport, secondSport) => {
      if (isAscending) {
        return firstSport.name.localeCompare(secondSport.name);
      }

      return secondSport.name.localeCompare(firstSport.name);
    });

  const renderSportCard = ({ item }: { item: Sport }) => {
    return (
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={() => console.log("Selected sport:", item.name)}
      >
        <Image source={item.image} style={styles.cardImage} />

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.name}</Text>

          <Text style={styles.cardText}>
            World: {item.worldPlayers.toLocaleString()}
          </Text>

          <Text style={styles.cardText}>
            City: {item.cityPlayers.toLocaleString()}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>

        <Text style={styles.headerTitle}>
          Life begins at the end of your comfort zone!
        </Text>

      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search sport..."
          placeholderTextColor={colors.secondaryText}
        />

        <Pressable
          style={({ pressed }) => [
            styles.sortButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => setIsAscending((currentValue) => !currentValue)}
        >
          <Ionicons
            name={isAscending ? "arrow-down" : "arrow-up"}
            size={22}
            color={colors.text}
          />
        </Pressable>
      </View>

      <FlatList
        data={filteredSports}
        keyExtractor={(item) => item.id}
        renderItem={renderSportCard}
        numColumns={3}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
