import { Pressable, Text, TextInput, View } from "react-native";
import { colors } from "../../constants/colors";
import { AvatarPicker } from "./AvatarPicker";
import { styles } from "../../styles/profile.styles";
import { sexOptions } from "../constants/profileOptions";

type ProfileInfoCardProps = {
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  nickname: string;
  setNickname: (value: string) => void;
  aboutMe: string;
  setAboutMe: (value: string) => void;
  age: string;
  setAge: (value: string) => void;
  sex: string;
  setSex: (value: string) => void;
  country: string;
  setCountry: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  avatarUrl: string;
  latitude: number | null;
  longitude: number | null;
  onPickFromGallery: () => void;
  onTakePhoto: () => void;
  onUseLocation: () => void;
};

export function ProfileInfoCard({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  nickname,
  setNickname,
  aboutMe,
  setAboutMe,
  age,
  setAge,
  sex,
  setSex,
  country,
  setCountry,
  city,
  setCity,
  avatarUrl,
  latitude,
  longitude,
  onPickFromGallery,
  onTakePhoto,
  onUseLocation,
}: ProfileInfoCardProps) {
  return (
    <View style={styles.card}>
      {/* AVATAR */}
      <AvatarPicker
        avatarUrl={avatarUrl}
        onPickFromGallery={onPickFromGallery}
        onTakePhoto={onTakePhoto}
      />

      <View style={styles.twoColumns}>
        {/* Firstname */}
        <View style={styles.column}>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First name"
            placeholderTextColor={colors.secondaryText}
          />
          {/* Nickname */}
          <TextInput
            style={styles.input}
            value={nickname}
            onChangeText={setNickname}
            placeholder="Nickname"
            placeholderTextColor={colors.secondaryText}
          />
          {/* Country */}
          <TextInput
            style={styles.input}
            value={country}
            onChangeText={setCountry}
            placeholder="Country"
            placeholderTextColor={colors.secondaryText}
          />
        </View>

        <View style={styles.column}>
          {/* Lastname */}
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last name"
            placeholderTextColor={colors.secondaryText}
          />
          {/* Age */}
          <TextInput
            style={styles.input}
            value={age}
            onChangeText={setAge}
            placeholder="Age"
            placeholderTextColor={colors.secondaryText}
            keyboardType="numeric"
          />
          {/* City */}
          <TextInput
            style={styles.input}
            value={city}
            onChangeText={setCity}
            placeholder="City"
            placeholderTextColor={colors.secondaryText}
          />
        </View>
      </View>
      {/* Sex */}
      <Text style={styles.miniTitle}>Sex</Text>

      <View style={styles.optionRow}>
        {sexOptions.map((option) => {
          const isSelected = sex === option;

          return (
            <Pressable
              key={option}
              style={[
                styles.optionButton,
                isSelected && styles.optionButtonActive,
              ]}
              onPress={() => setSex(option)}
            >
              <Text
                style={[
                  styles.optionButtonText,
                  isSelected && styles.optionButtonTextActive,
                ]}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {/* About Me */}
      <TextInput
        style={[styles.input, styles.textArea]}
        value={aboutMe}
        onChangeText={setAboutMe}
        placeholder="About me"
        placeholderTextColor={colors.secondaryText}
        multiline
      />
      {/* Location */}
      <View style={styles.locationHeader}>
        <View style={styles.locationTextBlock}>
          <Text style={styles.miniTitle}>Location</Text>

          <Text style={styles.helperText}>
            Simulator can show San Francisco. You can type city manually.
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.locationButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={onUseLocation}
        >
          <Text style={styles.locationButtonText}>Use location</Text>
        </Pressable>
      </View>

      {latitude !== null && longitude !== null && (
        <Text style={styles.coordinates}>
          Location: {latitude.toFixed(4)}, {longitude.toFixed(4)}
        </Text>
      )}
    </View>
  );
}
