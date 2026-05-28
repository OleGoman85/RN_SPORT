// Reusable labeled text input card for profile fields.
import { Pressable, Text, TextInput, View } from "react-native";
import { colors } from "../constants/colors";
import { styles } from "../styles/profile.styles";
import { AvatarPicker } from "./AvatarPicker";

const sexOptions = ["Male", "Female"];

type ProfileInfoCardProps = {
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  nickname: string;
  setNickname: (value: string) => void;
  aboutMe: string;
  setAboutMe: (value: string) => void;
  birthDay: string;
  setBirthDay: (value: string) => void;
  birthMonth: string;
  setBirthMonth: (value: string) => void;
  birthYear: string;
  setBirthYear: (value: string) => void;
  sex: string;
  setSex: (value: string) => void;
  country: string;
  setCountry: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  avatarUrl: string;
  isAvatarUploading: boolean;
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
  birthDay,
  setBirthDay,
  birthMonth,
  setBirthMonth,
  birthYear,
  setBirthYear,
  sex,
  setSex,
  country,
  setCountry,
  city,
  setCity,
  avatarUrl,
  isAvatarUploading,
  latitude,
  longitude,
  onPickFromGallery,
  onTakePhoto,
  onUseLocation,
}: ProfileInfoCardProps) {
  return (
    <View style={styles.card}>
      <AvatarPicker
        avatarUrl={avatarUrl}
        isAvatarUploading={isAvatarUploading}
        onPickFromGallery={onPickFromGallery}
        onTakePhoto={onTakePhoto}
      />

      <View style={styles.twoColumns}>
        <View style={styles.column}>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First name"
            placeholderTextColor={colors.secondaryText}
          />

          <TextInput
            style={styles.input}
            value={nickname}
            onChangeText={setNickname}
            placeholder="Nickname"
            placeholderTextColor={colors.secondaryText}
          />

          <TextInput
            style={styles.input}
            value={country}
            onChangeText={setCountry}
            placeholder="Country"
            placeholderTextColor={colors.secondaryText}
          />
        </View>

        <View style={styles.column}>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last name"
            placeholderTextColor={colors.secondaryText}
          />

          <TextInput
            style={styles.input}
            value={city}
            onChangeText={setCity}
            placeholder="City"
            placeholderTextColor={colors.secondaryText}
          />
        </View>
      </View>

      <Text style={styles.miniTitle}>Date of birth</Text>

      <View style={styles.threeColumns}>
        <TextInput
          style={[styles.input, styles.dateInput]}
          value={birthDay}
          onChangeText={setBirthDay}
          placeholder="DD"
          placeholderTextColor={colors.secondaryText}
          keyboardType="numeric"
          maxLength={2}
        />

        <TextInput
          style={[styles.input, styles.dateInput]}
          value={birthMonth}
          onChangeText={setBirthMonth}
          placeholder="MM"
          placeholderTextColor={colors.secondaryText}
          keyboardType="numeric"
          maxLength={2}
        />

        <TextInput
          style={[styles.input, styles.dateInput]}
          value={birthYear}
          onChangeText={setBirthYear}
          placeholder="YYYY"
          placeholderTextColor={colors.secondaryText}
          keyboardType="numeric"
          maxLength={4}
        />
      </View>

      <Text style={styles.helperText}>
        Other users will see only your age, not your birthday.
      </Text>

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

      <TextInput
        style={[styles.input, styles.textArea]}
        value={aboutMe}
        onChangeText={setAboutMe}
        placeholder="About me"
        placeholderTextColor={colors.secondaryText}
        multiline
      />

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
