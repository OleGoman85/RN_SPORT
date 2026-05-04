import { styles } from "../styles/profile.styles";
import { Image, Pressable, Text, View } from "react-native";

type AvatarPickerProps = {
  avatarUrl: string;
  onPickFromGallery: () => void;
  onTakePhoto: () => void;
};

export function AvatarPicker({
  avatarUrl,
  onPickFromGallery,
  onTakePhoto,
}: AvatarPickerProps) {
  return (
    <View style={styles.avatarBlock}>
      {avatarUrl ? (
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>Avatar required</Text>
        </View>
      )}

      <View style={styles.avatarButtons}>
        <Pressable
          style={({ pressed }) => [
            styles.smallButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={onPickFromGallery}
        >
          <Text style={styles.smallButtonText}>Gallery</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.smallButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={onTakePhoto}
        >
          <Text style={styles.smallButtonText}>Camera</Text>
        </Pressable>
      </View>
    </View>
  );
}
