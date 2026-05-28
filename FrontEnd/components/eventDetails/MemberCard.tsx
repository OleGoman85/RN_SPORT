// One joined player row inside event details.
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { colors } from "../../constants/colors";
import { styles } from "../../styles/eventDetailsModal.styles";
import { EventMember } from "../../types/events";
import {
  formatRating,
  getFullName,
  getNickname,
} from "../../utils/eventDetails";
import { UserAvatar } from "./UserAvatar";

type MemberCardProps = {
  member: EventMember;
  onPress: () => void;
};

export function MemberCard({ member, onPress }: MemberCardProps) {
  const memberName = getFullName(member);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.memberCard,
        pressed && styles.buttonPressed,
      ]}
      onPress={onPress}
    >
      <UserAvatar avatarUrl={member.avatar_url} name={memberName} size={46} />

      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{getNickname(member)}</Text>

        <Text style={styles.memberRating}>
          {formatRating(member.rating_avg)}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color={colors.secondaryText} />
    </Pressable>
  );
}
