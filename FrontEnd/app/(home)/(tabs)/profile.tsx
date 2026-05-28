// Profile tab screen: editable player profile form.
import { useClerk } from "@clerk/expo";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
} from "react-native";
import { LanguagesSelector } from "../../../components/LanguagesSelector";
import { ProfileHeader } from "../../../components/ProfileHeader";
import { ProfileInfoCard } from "../../../components/ProfileInfoCard";
import { SportsSelector } from "../../../components/SportsSelector";
import { useProfileForm } from "../../../hooks/useProfileForm";
import { styles } from "../../../styles/profile.styles";

export default function ProfileScreen() {
  const { signOut } = useClerk();

  const profileForm = useProfileForm();

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader />

        <ProfileInfoCard
          firstName={profileForm.firstName}
          setFirstName={profileForm.setFirstName}
          lastName={profileForm.lastName}
          setLastName={profileForm.setLastName}
          nickname={profileForm.nickname}
          setNickname={profileForm.setNickname}
          aboutMe={profileForm.aboutMe}
          setAboutMe={profileForm.setAboutMe}
          birthDay={profileForm.birthDay}
          setBirthDay={profileForm.setBirthDay}
          birthMonth={profileForm.birthMonth}
          setBirthMonth={profileForm.setBirthMonth}
          birthYear={profileForm.birthYear}
          setBirthYear={profileForm.setBirthYear}
          sex={profileForm.sex}
          setSex={profileForm.setSex}
          country={profileForm.country}
          setCountry={profileForm.setCountry}
          city={profileForm.city}
          setCity={profileForm.setCity}
          avatarUrl={profileForm.avatarUrl}
          isAvatarUploading={profileForm.isAvatarUploading}
          latitude={profileForm.latitude}
          longitude={profileForm.longitude}
          onPickFromGallery={profileForm.handlePickAvatarFromGallery}
          onTakePhoto={profileForm.handleTakeAvatarPhoto}
          onUseLocation={profileForm.handleUseMyLocation}
        />

        <SportsSelector
          getSportLevel={profileForm.getSportLevel}
          onToggleSport={profileForm.handleToggleSport}
          onChangeSportLevel={profileForm.handleChangeSportLevel}
        />

        <LanguagesSelector
          selectedLanguages={profileForm.selectedLanguages}
          onToggleLanguage={profileForm.handleToggleLanguage}
        />

        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            (!profileForm.isFormValid ||
              profileForm.isSaving ||
              profileForm.isAvatarUploading) &&
              styles.buttonDisabled,
            pressed && styles.buttonPressed,
          ]}
          onPress={profileForm.handleSaveProfile}
          disabled={
            !profileForm.isFormValid ||
            profileForm.isSaving ||
            profileForm.isAvatarUploading
          }
        >
          <Text style={styles.saveButtonText}>
            {profileForm.isSaving ? "Saving..." : "Save Profile"}
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => signOut()}
        >
          <Text style={styles.logoutButtonText}>Log out</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
