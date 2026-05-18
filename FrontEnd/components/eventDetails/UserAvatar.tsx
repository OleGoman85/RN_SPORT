import { useState } from "react";
import { Image, Text, View } from "react-native";
import { styles } from "../../styles/eventDetailsModal.styles";
import { getInitials } from "../../utils/eventDetails";

type UserAvatarProps = {
  avatarUrl: string | null;
  name: string;
  size: number;
};

export function UserAvatar({ avatarUrl, name, size }: UserAvatarProps) {
  const [hasImageError, setHasImageError] = useState(false);

  const initials = getInitials(name);

  if (avatarUrl && !hasImageError) {
    return (
      <Image
        source={{ uri: avatarUrl }}
        style={[
          styles.avatarImage,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
        onError={() => setHasImageError(true)}
      />
    );
  }

  return (
    <View
      style={[
        styles.initialsAvatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      <Text
        style={[
          styles.initialsText,
          {
            fontSize: size * 0.34,
          },
        ]}
      >
        {initials || "?"}
      </Text>
    </View>
  );
}
