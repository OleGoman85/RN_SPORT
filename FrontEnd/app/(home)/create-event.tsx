import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/expo";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, FlatList, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { colors } from "../../constants/colors";
import { sports, Sport } from "../../data/sports";
import { createSportEvent } from "../../services/eventsApi";
import { styles } from "../../styles/createEvent.styles";

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

export default function CreateEventScreen() {
  const { user } = useUser();

  const [searchText, setSearchText] = useState("");
  const [selectedSportName, setSelectedSportName] = useState(sports[0]?.name ?? "");
  const [eventName, setEventName] = useState("");
  const [date, setDate] = useState(getTodayDate());
  const [time, setTime] = useState("19:00");
  const [locationName, setLocationName] = useState("");
  const [city, setCity] = useState("Helsinki");
  const [maxParticipants, setMaxParticipants] = useState(2);
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const filteredSports = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) {
      return sports;
    }

    return sports.filter((sport) => sport.name.toLowerCase().includes(query));
  }, [searchText]);

  const handleCreateEvent = async () => {
    if (!user?.id) {
      Alert.alert("Error", "User is not loaded yet.");
      return;
    }

    if (!selectedSportName || !eventName.trim() || !date.trim() || !time.trim() || !locationName.trim()) {
      Alert.alert("Missing data", "Sport, event name, date, time and location are required.");
      return;
    }

    try {
      setIsSaving(true);

      await createSportEvent({
        current_clerk_user_id: user.id,
        sport_name: selectedSportName,
        event_name: eventName.trim(),
        event_description: description.trim() || null,
        available_date: date.trim(),
        time_from: time.trim(),
        location_name: locationName.trim(),
        city: city.trim() || null,
        latitude: null,
        longitude: null,
        max_participants: maxParticipants,
        event_image_url: null,
      });

      Alert.alert("Success", "Event created successfully.");
      router.replace("/(home)/(tabs)/events");
    } catch (error) {
      console.log("Create event error:", error);
      Alert.alert("Error", "Could not create event.");
    } finally {
      setIsSaving(false);
    }
  };

  const renderSportItem = ({ item }: { item: Sport }) => {
    const isSelected = selectedSportName === item.name;

    return (
      <Pressable
        style={({ pressed }) => [styles.sportItem, pressed && styles.buttonPressed]}
        onPress={() => setSelectedSportName(item.name)}
      >
        <View style={[styles.sportIcon, isSelected && styles.sportIconActive]}>
          <Image source={item.image} style={styles.sportImage} />
        </View>

        <Text style={[styles.sportName, isSelected && styles.sportNameActive]} numberOfLines={1}>
          {item.name}
        </Text>
      </Pressable>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <Pressable style={({ pressed }) => [styles.closeButton, pressed && styles.buttonPressed]} onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>

        <Text style={styles.title}>Create Event</Text>

        <View style={styles.closeButton} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
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

        <Text style={styles.label}>Event Name</Text>
        <TextInput
          style={styles.input}
          value={eventName}
          onChangeText={setEventName}
          placeholder="Lts's begin"
          placeholderTextColor={colors.secondaryText}
        />

        <View style={styles.twoColumns}>
          <View style={styles.column}>
            <Text style={styles.label}>Date</Text>
            <TextInput
              style={styles.input}
              value={date}
              onChangeText={setDate}
              placeholder="2026-05-20"
              placeholderTextColor={colors.secondaryText}
            />
          </View>

          <View style={styles.column}>
            <Text style={styles.label}>Time</Text>
            <TextInput
              style={styles.input}
              value={time}
              onChangeText={setTime}
              placeholder="19:00"
              placeholderTextColor={colors.secondaryText}
            />
          </View>
        </View>

        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          value={locationName}
          onChangeText={setLocationName}
          placeholder="Central Park"
          placeholderTextColor={colors.secondaryText}
        />

        <Text style={styles.label}>City</Text>
        <TextInput
          style={styles.input}
          value={city}
          onChangeText={setCity}
          placeholder="Helsinki"
          placeholderTextColor={colors.secondaryText}
        />

        <Text style={styles.label}>Max participants</Text>
        <View style={styles.counter}>
          <Pressable style={styles.counterButton} onPress={() => setMaxParticipants((value) => Math.max(2, value - 1))}>
            <Ionicons name="remove" size={22} color={colors.text} />
          </Pressable>

          <Text style={styles.counterValue}>{maxParticipants}</Text>

          <Pressable style={styles.counterButton} onPress={() => setMaxParticipants((value) => Math.min(100, value + 1))}>
            <Ionicons name="add" size={22} color={colors.text} />
          </Pressable>
        </View>

        <Text style={styles.label}>Description optional</Text>
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          value={description}
          onChangeText={setDescription}
          placeholder="Just for fun and good vibes!"
          placeholderTextColor={colors.secondaryText}
          multiline
        />

        <Pressable
          style={({ pressed }) => [styles.createButton, (pressed || isSaving) && styles.buttonPressed]}
          onPress={handleCreateEvent}
          disabled={isSaving}
        >
          <Text style={styles.createButtonText}>{isSaving ? "Creating..." : "Create Event"}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
