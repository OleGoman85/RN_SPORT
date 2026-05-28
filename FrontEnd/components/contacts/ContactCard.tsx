// One saved contact card with profile, message, and remove actions.
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { colors } from "../../constants/colors";
import { styles } from "../../styles/contacts.styles";
import { ContactUser } from "../../types/contacts";
import {
  formatRating,
  getFullName,
  getNickname,
} from "../../utils/eventDetails";
import { UserAvatar } from "../eventDetails/UserAvatar";

type ContactCardProps = {
  contact: ContactUser;
  onOpenProfile: (clerkUserId: string) => void;
  onMessage: (contact: ContactUser) => void;
  onRemove: (contact: ContactUser) => void;
};

export function ContactCard({
  contact,
  onOpenProfile,
  onMessage,
  onRemove,
}: ContactCardProps) {
  const fullName = getFullName(contact);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.contactCard,
        pressed && styles.buttonPressed,
      ]}
      onPress={() => onOpenProfile(contact.clerk_user_id)}
    >
      <UserAvatar avatarUrl={contact.avatar_url} name={fullName} size={58} />

      <View style={styles.contactInfo}>
        <Text style={styles.contactName} numberOfLines={1}>
          {fullName}
        </Text>

        <Text style={styles.contactNickname} numberOfLines={1}>
          {getNickname(contact)}
        </Text>

        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={15} color={colors.primary} />

          <Text style={styles.metaText} numberOfLines={1}>
            {contact.city ?? "City not added"}
            {contact.country ? `, ${contact.country}` : ""}
          </Text>
        </View>

        <View style={styles.statsRow}>
          <Text style={styles.statText}>
            {formatRating(contact.rating_avg)} trust
          </Text>

          <Text style={styles.statText}>
            {contact.events_created_count} events
          </Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        <Pressable
          style={({ pressed }) => [
            styles.iconButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={(event) => {
            event.stopPropagation();
            onMessage(contact);
          }}
        >
          <Ionicons name="chatbubble-outline" size={20} color={colors.text} />
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.iconButton,
            styles.removeButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={(event) => {
            event.stopPropagation();
            onRemove(contact);
          }}
        >
          <Ionicons name="trash-outline" size={20} color="#fb7185" />
        </Pressable>
      </View>
    </Pressable>
  );
}
