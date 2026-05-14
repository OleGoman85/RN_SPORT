import { Ionicons } from "@expo/vector-icons";
import { Dispatch, SetStateAction } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { colors } from "../../constants/colors";
import { styles } from "../../styles/createEvent.styles";

type EventFormFieldsProps = {
  eventName: string;
  setEventName: (value: string) => void;
  date: string;
  setDate: (value: string) => void;
  time: string;
  setTime: (value: string) => void;
  locationName: string;
  setLocationName: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  maxParticipants: number;
  setMaxParticipants: Dispatch<SetStateAction<number>>;
  description: string;
  setDescription: (value: string) => void;
};

export function EventFormFields({
  eventName,
  setEventName,
  date,
  setDate,
  time,
  setTime,
  locationName,
  setLocationName,
  city,
  setCity,
  maxParticipants,
  setMaxParticipants,
  description,
  setDescription,
}: EventFormFieldsProps) {
  return (
    <>
      <Text style={styles.label}>Event Name</Text>

      <TextInput
        style={styles.input}
        value={eventName}
        onChangeText={setEventName}
        placeholder="5v5 Football Match"
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
        <Pressable
          style={styles.counterButton}
          onPress={() => setMaxParticipants((value) => Math.max(2, value - 1))}
        >
          <Ionicons name="remove" size={22} color={colors.text} />
        </Pressable>

        <Text style={styles.counterValue}>{maxParticipants}</Text>

        <Pressable
          style={styles.counterButton}
          onPress={() =>
            setMaxParticipants((value) => Math.min(100, value + 1))
          }
        >
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
    </>
  );
}
