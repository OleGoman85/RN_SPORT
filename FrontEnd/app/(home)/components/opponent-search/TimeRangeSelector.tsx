import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform, Pressable, Text, View } from "react-native";
import { styles } from "../../../../styles/opponentSearch.styles";
import { OpponentSection } from "./OpponentSection";
import { useState } from "react";

type TimeRangeSelectorProps = {
  timeFrom: Date;
  timeTo: Date;
  onChangeTimeFrom: (value: Date) => void;
  onChangeTimeTo: (value: Date) => void;
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const TimeRangeSelector = ({
  timeFrom,
  timeTo,
  onChangeTimeFrom,
  onChangeTimeTo,
}: TimeRangeSelectorProps) => {
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  return (
    <OpponentSection title="Time range">
      <View style={styles.timeButtonsRow}>
        <Pressable
          style={({ pressed }) => [
            styles.timeButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => {
            setShowFromPicker(true);
            setShowToPicker(false);
          }}
        >
          <Text style={styles.timeButtonLabel}>From</Text>
          <Text style={styles.timeButtonText}>{formatTime(timeFrom)}</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.timeButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => {
            setShowToPicker(true);
            setShowFromPicker(false);
          }}
        >
          <Text style={styles.timeButtonLabel}>To</Text>
          <Text style={styles.timeButtonText}>{formatTime(timeTo)}</Text>
        </Pressable>
      </View>

      {showFromPicker && (
        <View style={styles.pickerContainer}>
          <DateTimePicker
            value={timeFrom}
            mode="time"
            is24Hour
            display={Platform.OS === "ios" ? "spinner" : "default"}
            themeVariant="light"
            onChange={(_, selectedTime) => {
              if (Platform.OS !== "ios") {
                setShowFromPicker(false);
              }

              if (selectedTime) {
                onChangeTimeFrom(selectedTime);
              }
            }}
          />
        </View>
      )}

      {showToPicker && (
        <View style={styles.pickerContainer}>
          <DateTimePicker
            value={timeTo}
            mode="time"
            is24Hour
            display={Platform.OS === "ios" ? "spinner" : "default"}
            themeVariant="light"
            onChange={(_, selectedTime) => {
              if (Platform.OS !== "ios") {
                setShowToPicker(false);
              }

              if (selectedTime) {
                onChangeTimeTo(selectedTime);
              }
            }}
          />
        </View>
      )}

      {Platform.OS === "ios" && (showFromPicker || showToPicker) && (
        <Pressable
          style={({ pressed }) => [
            styles.doneButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => {
            setShowFromPicker(false);
            setShowToPicker(false);
          }}
        >
          <Text style={styles.doneButtonText}>Done</Text>
        </Pressable>
      )}
    </OpponentSection>
  );
};
