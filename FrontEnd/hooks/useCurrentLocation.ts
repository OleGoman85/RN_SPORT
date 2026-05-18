import * as Location from "expo-location";
import { useState } from "react";
import { Alert, Platform } from "react-native";

export function useCurrentLocation() {
	const [latitude, setLatitude] = useState<number | null>(null);
	const [longitude, setLongitude] = useState<number | null>(null);

	const handleUseMyLocation = async () => {
		try {
			const permission = await Location.requestForegroundPermissionsAsync();

			if (permission.status !== "granted") {
				Alert.alert("Permission required", "Location permission is required.");
				return;
			}

			const currentPosition = await Location.getCurrentPositionAsync({});

			setLatitude(currentPosition.coords.latitude);
			setLongitude(currentPosition.coords.longitude);
		} catch (error) {
			console.log("Location error:", error);

			if (Platform.OS === "android" || Platform.OS === "ios") {
				Alert.alert("Error", "Could not get current location.");
			}
		}
	};

	return {
		latitude,
		setLatitude,
		longitude,
		setLongitude,
		handleUseMyLocation,
	};
}
