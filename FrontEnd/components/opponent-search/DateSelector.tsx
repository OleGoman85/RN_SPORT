import { Calendar } from "react-native-calendars";
import { Text, View } from "react-native";
import { colors } from "../../constants/colors";
import { styles } from "../../styles/opponentSearch.styles";
import { OpponentSection } from "./OpponentSection";

type DateSelectorProps = {
  selectedDates: string[];
  onToggleDate: (date: string) => void;
};

export const DateSelector = ({
  selectedDates,
  onToggleDate,
}: DateSelectorProps) => {
  const markedDates = selectedDates.reduce(
    (acc, date) => {
      acc[date] = {
        selected: true,
        selectedColor: colors.primary,
        selectedTextColor: colors.text,
      };

      return acc;
    },
    {} as Record<
      string,
      { selected: boolean; selectedColor: string; selectedTextColor: string }
    >,
  );

  return (
    <OpponentSection
      title="Dates"
      helperText="You can select one or several dates."
    >
      <Calendar
        markedDates={markedDates}
        onDayPress={(day) => onToggleDate(day.dateString)}
        theme={{
          calendarBackground: colors.background,
          dayTextColor: colors.text,
          monthTextColor: colors.text,
          textDisabledColor: "#475569",
          arrowColor: colors.primary,
          todayTextColor: colors.primary,
          selectedDayBackgroundColor: colors.primary,
          selectedDayTextColor: colors.text,
        }}
      />

      {selectedDates.length > 0 && (
        <View style={styles.selectedDatesBlock}>
          <Text style={styles.selectedDatesTitle}>Selected dates:</Text>

          <Text style={styles.selectedDatesText}>
            {selectedDates.join(", ")}
          </Text>
        </View>
      )}
    </OpponentSection>
  );
};

/*
selectedDates = ["2026-05-10", "2026-05-12"]

but  CALENDER needs
{
  "2026-05-10": {
    selected: true,
    selectedColor: "#ff7a00",
    selectedTextColor: "#ffffff"
  },
  "2026-05-12": {
    selected: true,
    selectedColor: "#ff7a00",
    selectedTextColor: "#ffffff"
  }
}

before reduce
["2026-05-10", "2026-05-12"]

after raduce
{
  "2026-05-10": { selected: true, ... },
  "2026-05-12": { selected: true, ... }
}

acc — is the accumulator, or "box" where we store the result.
date — date is the current date from the array.

{
  "2026-05-10": {
    selected: true,
    selectedColor: colors.primary,
    selectedTextColor: colors.text
  }
}
*/
