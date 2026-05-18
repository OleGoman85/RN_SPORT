import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert } from "react-native";
import { uploadAvatarToServer } from "../services/avatarApi";

export function useAvatarUpload() {
	const [avatarUrl, setAvatarUrl] = useState("");
	const [isAvatarUploading, setIsAvatarUploading] = useState(false);

	const uploadAvatar = async (imageUri: string) => {
		try {
			setIsAvatarUploading(true);

			const uploadedAvatarUrl = await uploadAvatarToServer(imageUri);

			setAvatarUrl(uploadedAvatarUrl);
		} catch (error) {
			console.log("Avatar upload error:", error);
			Alert.alert("Error", "Could not upload avatar.");
		} finally {
			setIsAvatarUploading(false);
		}
	};

	const handlePickAvatarFromGallery = async () => {
		try {
			const permission =
				await ImagePicker.requestMediaLibraryPermissionsAsync();

			if (!permission.granted) {
				Alert.alert("Permission required", "Gallery permission is required.");
				return;
			}

			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ["images"],
				allowsEditing: true,
				aspect: [1, 1],
				quality: 0.8,
			});

			if (result.canceled) {
				return;
			}

			await uploadAvatar(result.assets[0].uri);
		} catch (error) {
			console.log("Gallery avatar error:", error);
			Alert.alert("Error", "Could not select avatar.");
		}
	};

	const handleTakeAvatarPhoto = async () => {
		try {
			const permission = await ImagePicker.requestCameraPermissionsAsync();

			if (!permission.granted) {
				Alert.alert("Permission required", "Camera permission is required.");
				return;
			}

			const result = await ImagePicker.launchCameraAsync({
				allowsEditing: true,
				aspect: [1, 1],
				quality: 0.8,
			});

			if (result.canceled) {
				return;
			}

			await uploadAvatar(result.assets[0].uri);
		} catch (error) {
			console.log("Camera avatar error:", error);
			Alert.alert("Error", "Could not take photo.");
		}
	};

	return {
		avatarUrl,
		setAvatarUrl,
		isAvatarUploading,
		handlePickAvatarFromGallery,
		handleTakeAvatarPhoto,
	};
}
