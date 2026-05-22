import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { colors } from "../../constants/colors";
import { loadPublicUserProfile } from "../../services/profileApi";
import { styles } from "../../styles/eventDetailsModal.styles";
import { EventCreator } from "../../types/events";
import { CreatorProfile } from "./CreatorProfile";

type UserProfileModalProps = {
  clerkUserId: string | null;
  visible: boolean;
  onClose: () => void;
};

type UserProfileSheetContentProps = {
  clerkUserId: string;
  onClose: () => void;
};

export function UserProfileSheetContent({
  clerkUserId,
  onClose,
}: UserProfileSheetContentProps) {
  const [profile, setProfile] = useState<EventCreator | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setProfile(null);

    async function loadProfile() {
      try {
        setIsLoading(true);

        const loadedProfile = await loadPublicUserProfile(clerkUserId);

        setProfile(loadedProfile);
      } catch (error) {
        console.log("Public profile loading error:", error);
        Alert.alert("Error", "Could not load user profile.");
        onClose();
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [clerkUserId, onClose]);

  return (
    <>
      <View style={styles.dragHandle} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Player profile</Text>

        <Pressable
          style={({ pressed }) => [
            styles.closeButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={onClose}
        >
          <Ionicons name="close" size={28} color={colors.text} />
        </Pressable>
      </View>

      {isLoading || !profile ? (
        <View style={styles.loadingBlock}>
          <ActivityIndicator size="large" color={colors.primary} />

          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.profileModalContent}
        >
          <CreatorProfile creator={profile} />
        </ScrollView>
      )}
    </>
  );
}

export function UserProfileModal({
  clerkUserId,
  visible,
  onClose,
}: UserProfileModalProps) {
  const profileClerkUserId = visible ? clerkUserId : null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.sheet}>
          {profileClerkUserId ? (
            <UserProfileSheetContent
              clerkUserId={profileClerkUserId}
              onClose={onClose}
            />
          ) : null}
        </View>
      </View>
    </Modal>
  );
}
