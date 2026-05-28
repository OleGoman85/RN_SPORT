// Main create/edit event form fields.
import { Ionicons } from "@expo/vector-icons";
import { Dispatch, SetStateAction } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { colors } from "../../constants/colors";
import { styles } from "../../styles/createEvent.styles";
import { EventFormat } from "../../types/events";

type EventFormFieldsProps = {
  eventName: string;
  setEventName: (value: string) => void;
  eventFormat: EventFormat | "";
  onChangeEventFormat: (value: EventFormat) => void;
  date: string;
  setDate: (value: string) => void;
  time: string;
  setTime: (value: string) => void;
  locationName: string;
  latitude: number | null;
  longitude: number | null;
  onOpenLocationPicker: () => void;
  maxParticipants: number;
  setMaxParticipants: Dispatch<SetStateAction<number>>;
  description: string;
  setDescription: (value: string) => void;
};

export function EventFormFields({
  eventName,
  setEventName,
  eventFormat,
  onChangeEventFormat,
  date,
  setDate,
  time,
  setTime,
  locationName,
  latitude,
  longitude,
  onOpenLocationPicker,
  maxParticipants,
  setMaxParticipants,
  description,
  setDescription,
}: EventFormFieldsProps) {
  const hasLocation = latitude !== null && longitude !== null;

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

      <Text style={styles.label}>Event Format</Text>

      <View style={styles.formatSelector}>
        {[
          { label: "1v1", value: "1v1" as const },
          { label: "Team", value: "team" as const },
        ].map((format) => {
          const isActive = eventFormat === format.value;

          return (
            <Pressable
              key={format.value}
              style={({ pressed }) => [
                styles.formatButton,
                isActive && styles.formatButtonActive,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => onChangeEventFormat(format.value)}
            >
              <Text
                style={[
                  styles.formatButtonText,
                  isActive && styles.formatButtonTextActive,
                ]}
              >
                {format.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

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

      <Pressable
        style={({ pressed }) => [
          styles.locationSelectButton,
          hasLocation && styles.locationSelectButtonActive,
          pressed && styles.buttonPressed,
        ]}
        onPress={onOpenLocationPicker}
      >
        <View style={styles.locationSelectIcon}>
          <Ionicons name="location" size={21} color={colors.primary} />
        </View>

        <View style={styles.locationSelectTextBlock}>
          <Text style={styles.locationSelectTitle} numberOfLines={1}>
            {hasLocation ? locationName || "Selected location" : "Choose on map"}
          </Text>

          <Text style={styles.locationSelectMeta} numberOfLines={1}>
            {hasLocation
              ? `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
              : "Location is required"}
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={20}
          color={colors.secondaryText}
        />
      </Pressable>

      <Text style={styles.label}>Max participants</Text>

      <View style={styles.counter}>
        <Pressable
          disabled={eventFormat === "1v1"}
          style={[
            styles.counterButton,
            eventFormat === "1v1" && styles.counterButtonDisabled,
          ]}
          onPress={() => setMaxParticipants((value) => Math.max(2, value - 1))}
        >
          <Ionicons name="remove" size={22} color={colors.text} />
        </Pressable>

        <Text style={styles.counterValue}>{maxParticipants}</Text>

        <Pressable
          disabled={eventFormat === "1v1"}
          style={[
            styles.counterButton,
            eventFormat === "1v1" && styles.counterButtonDisabled,
          ]}
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
