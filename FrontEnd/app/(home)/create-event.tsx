import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { EventFormActions } from "../../components/create-event/EventFormActions";
import { EventFormFields } from "../../components/create-event/EventFormFields";
import { MyEventsList } from "../../components/create-event/MyEventsList";
import { SportPicker } from "../../components/create-event/SportPicker";
import { colors } from "../../constants/colors";
import { useCreateEventForm } from "../../hooks/useCreateEventForm";
import { styles } from "../../styles/createEvent.styles";

export default function CreateEventScreen() {
  const form = useCreateEventForm();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [
            styles.closeButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>

        <Text style={styles.title}>
          {form.isEditing ? "Edit Event" : "Create Event"}
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.closeButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={form.resetForm}
        >
          <Ionicons name="refresh" size={21} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <MyEventsList
          myEvents={form.myEvents}
          editingEventId={form.editingEventId}
          isLoadingMyEvents={form.isLoadingMyEvents}
          isSaving={form.isSaving}
          onSelectEvent={form.fillFormFromEvent}
          onDeleteEvent={form.handleDeleteEvent}
        />

        <SportPicker
          searchText={form.searchText}
          setSearchText={form.setSearchText}
          selectedSportName={form.selectedSportName}
          filteredSports={form.filteredSports}
          onSelectSport={form.setSelectedSportName}
        />

        <EventFormFields
          eventName={form.eventName}
          setEventName={form.setEventName}
          eventFormat={form.eventFormat}
          onChangeEventFormat={form.handleChangeEventFormat}
          date={form.date}
          setDate={form.setDate}
          time={form.time}
          setTime={form.setTime}
          locationName={form.locationName}
          setLocationName={form.setLocationName}
          city={form.city}
          setCity={form.setCity}
          maxParticipants={form.maxParticipants}
          setMaxParticipants={form.setMaxParticipants}
          description={form.description}
          setDescription={form.setDescription}
        />

        <EventFormActions
          isEditing={form.isEditing}
          isSaving={form.isSaving}
          onCreate={form.handleCreateEvent}
          onUpdate={form.handleUpdateEvent}
          onCancel={form.resetForm}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
