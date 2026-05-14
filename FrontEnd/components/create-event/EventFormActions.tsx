import { Pressable, Text, View } from "react-native";
import { styles } from "../../styles/createEvent.styles";

type EventFormActionsProps = {
  isEditing: boolean;
  isSaving: boolean;
  onCreate: () => void;
  onUpdate: () => void;
  onDelete: () => void;
  onCancel: () => void;
};

export function EventFormActions({
  isEditing,
  isSaving,
  onCreate,
  onUpdate,
  onDelete,
  onCancel,
}: EventFormActionsProps) {
  if (isEditing) {
    return (
      <View style={styles.editActions}>
        <Pressable
          style={({ pressed }) => [
            styles.deleteButton,
            (pressed || isSaving) && styles.buttonPressed,
          ]}
          onPress={onDelete}
          disabled={isSaving}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.cancelButton,
            (pressed || isSaving) && styles.buttonPressed,
          ]}
          onPress={onCancel}
          disabled={isSaving}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            (pressed || isSaving) && styles.buttonPressed,
          ]}
          onPress={onUpdate}
          disabled={isSaving}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? "Saving..." : "Save"}
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.createButton,
        (pressed || isSaving) && styles.buttonPressed,
      ]}
      onPress={onCreate}
      disabled={isSaving}
    >
      <Text style={styles.createButtonText}>
        {isSaving ? "Creating..." : "Create Event"}
      </Text>
    </Pressable>
  );
}
