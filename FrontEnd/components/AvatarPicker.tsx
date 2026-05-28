// Profile form control for choosing avatar from gallery or camera.
import { styles } from "../styles/profile.styles";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";
import { colors } from "../constants/colors";

type AvatarPickerProps = {
  avatarUrl: string;
  isAvatarUploading: boolean;
  onPickFromGallery: () => void;
  onTakePhoto: () => void;
};

export function AvatarPicker({
  avatarUrl,
  isAvatarUploading,
  onPickFromGallery,
  onTakePhoto,
}: AvatarPickerProps) {
  return (
    <View style={styles.avatarBlock}>
      <View style={styles.avatarWrapper}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>Avatar required</Text>
          </View>
        )}

        {isAvatarUploading && (
          <View style={styles.avatarLoaderOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />

            <Text style={styles.avatarLoaderText}>Uploading...</Text>
          </View>
        )}
      </View>

      <View style={styles.avatarButtons}>
        <Pressable
          style={({ pressed }) => [
            styles.smallButton,
            isAvatarUploading && styles.buttonDisabled,
            pressed && !isAvatarUploading && styles.buttonPressed,
          ]}
          onPress={onPickFromGallery}
          disabled={isAvatarUploading}
        >
          <Text style={styles.smallButtonText}>Gallery</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.smallButton,
            isAvatarUploading && styles.buttonDisabled,
            pressed && !isAvatarUploading && styles.buttonPressed,
          ]}
          onPress={onTakePhoto}
          disabled={isAvatarUploading}
        >
          <Text style={styles.smallButtonText}>Camera</Text>
        </Pressable>
      </View>
    </View>
  );
}
