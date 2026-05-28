// Segmented tabs inside Contacts with unread badges for chat sections.
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { colors } from "../../constants/colors";
import { styles } from "../../styles/contacts.styles";
import { ContactsTab, formatBadgeCount } from "../../utils/chatDisplay";

const tabs: {
  label: string;
  value: ContactsTab;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  {
    label: "Messages",
    value: "messages",
    icon: "chatbubble-outline",
  },
  {
    label: "Event Chats",
    value: "eventChats",
    icon: "calendar-outline",
  },
  {
    label: "Contacts",
    value: "contacts",
    icon: "people-outline",
  },
];

type ContactsTabsProps = {
  activeTab: ContactsTab;
  privateUnreadCount: number;
  eventUnreadCount: number;
  onChangeTab: (tab: ContactsTab) => void;
};

export function ContactsTabs({
  activeTab,
  privateUnreadCount,
  eventUnreadCount,
  onChangeTab,
}: ContactsTabsProps) {
  return (
    <View style={styles.segmentedTabs}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;
        const unreadCount =
          tab.value === "messages"
            ? privateUnreadCount
            : tab.value === "eventChats"
              ? eventUnreadCount
              : 0;

        return (
          <Pressable
            key={tab.value}
            style={({ pressed }) => [
              styles.segmentButton,
              isActive && styles.activeSegmentButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => onChangeTab(tab.value)}
          >
            <Ionicons
              name={tab.icon}
              size={16}
              color={isActive ? colors.background : colors.secondaryText}
            />

            <View style={styles.segmentLabelWrap}>
              <Text
                style={[
                  styles.segmentText,
                  isActive && styles.activeSegmentText,
                ]}
                numberOfLines={1}
              >
                {tab.label}
              </Text>

              {unreadCount > 0 && (
                <View
                  style={[
                    styles.segmentBadge,
                    isActive && styles.activeSegmentBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.segmentBadgeText,
                      isActive && styles.activeSegmentBadgeText,
                    ]}
                  >
                    {formatBadgeCount(unreadCount)}
                  </Text>
                </View>
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
