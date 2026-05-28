// Scrollable body of the event details modal.
import { ScrollView, Text, View } from "react-native";
import { styles } from "../../styles/eventDetailsModal.styles";
import { EventCreator, EventMember, SportEvent } from "../../types/events";
import { CreatorProfile } from "./CreatorProfile";
import { EventInfoCard } from "./EventInfoCard";
import { MemberCard } from "./MemberCard";

type EventDetailsContentProps = {
  creator: EventCreator;
  event: SportEvent;
  members: EventMember[];
  onSelectMember: (clerkUserId: string) => void;
};

export function EventDetailsContent({
  creator,
  event,
  members,
  onSelectMember,
}: EventDetailsContentProps) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <CreatorProfile creator={creator} />

      <EventInfoCard event={event} />

      <View style={styles.joinedSection}>
        <Text style={styles.joinedTitle}>Joined players</Text>

        {members.length === 0 ? (
          <Text style={styles.emptyText}>Nobody has joined yet.</Text>
        ) : (
          members.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onPress={() => onSelectMember(member.clerk_user_id)}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}
