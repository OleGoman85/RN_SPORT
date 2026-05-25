import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";
import MapView, {
  LatLng,
  MapPressEvent,
  Marker,
  Region,
} from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../constants/colors";
import { styles } from "../../styles/createEvent.styles";
import { EventLocationSelection } from "../../types/events";

type LocationPickerModalProps = {
  visible: boolean;
  initialLocation: EventLocationSelection | null;
  onClose: () => void;
  onConfirm: (location: EventLocationSelection) => void;
};

const fallbackCoordinate = {
  latitude: 60.1699,
  longitude: 24.9384,
};

function getRegionFromCoordinate(coordinate: LatLng): Region {
  return {
    latitude: coordinate.latitude,
    longitude: coordinate.longitude,
    latitudeDelta: 0.025,
    longitudeDelta: 0.025,
  };
}

function getLocationName(address: Location.LocationGeocodedAddress) {
  const street = [address.street, address.streetNumber]
    .filter(Boolean)
    .join(" ");

  return (
    address.name ||
    street ||
    address.district ||
    address.city ||
    "Selected location"
  );
}

async function getLocationDetails(coordinate: LatLng) {
  try {
    const addresses = await Location.reverseGeocodeAsync(coordinate);
    const address = addresses[0];

    if (!address) {
      return {
        locationName: "Selected location",
        city: null,
      };
    }

    return {
      locationName: getLocationName(address),
      city: address.city ?? address.subregion ?? address.region ?? null,
    };
  } catch (error) {
    console.log("Reverse geocode error:", error);

    return {
      locationName: "Selected location",
      city: null,
    };
  }
}

export function LocationPickerModal({
  visible,
  initialLocation,
  onClose,
  onConfirm,
}: LocationPickerModalProps) {
  const insets = useSafeAreaInsets();

  const [region, setRegion] = useState<Region>(
    getRegionFromCoordinate(fallbackCoordinate),
  );
  const [selectedCoordinate, setSelectedCoordinate] = useState<LatLng | null>(
    null,
  );
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isSavingLocation, setIsSavingLocation] = useState(false);

  const loadCurrentLocation = useCallback(async () => {
    try {
      setIsLoadingLocation(true);

      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== "granted") {
        Alert.alert(
          "Permission required",
          "Location permission is required to open the map near you.",
        );

        return null;
      }

      const currentPosition = await Location.getCurrentPositionAsync({});

      return {
        latitude: currentPosition.coords.latitude,
        longitude: currentPosition.coords.longitude,
      };
    } catch (error) {
      console.log("Map location error:", error);
      Alert.alert("Error", "Could not get current location.");

      return null;
    } finally {
      setIsLoadingLocation(false);
    }
  }, []);

  useEffect(() => {
    if (!visible) {
      return;
    }

    let isMounted = true;

    async function prepareMap() {
      if (initialLocation) {
        const coordinate = {
          latitude: initialLocation.latitude,
          longitude: initialLocation.longitude,
        };

        setSelectedCoordinate(coordinate);
        setRegion(getRegionFromCoordinate(coordinate));
        return;
      }

      const currentCoordinate = await loadCurrentLocation();
      const coordinate = currentCoordinate ?? fallbackCoordinate;

      if (!isMounted) {
        return;
      }

      setSelectedCoordinate(coordinate);
      setRegion(getRegionFromCoordinate(coordinate));
    }

    prepareMap();

    return () => {
      isMounted = false;
    };
  }, [initialLocation, loadCurrentLocation, visible]);

  const handleMapPress = (event: MapPressEvent) => {
    const coordinate = event.nativeEvent.coordinate;

    setSelectedCoordinate(coordinate);
    setRegion(getRegionFromCoordinate(coordinate));
  };

  const handleUseCurrentLocation = async () => {
    const currentCoordinate = await loadCurrentLocation();

    if (!currentCoordinate) {
      return;
    }

    setSelectedCoordinate(currentCoordinate);
    setRegion(getRegionFromCoordinate(currentCoordinate));
  };

  const handleConfirm = async () => {
    if (!selectedCoordinate) {
      Alert.alert("Location required", "Please choose a point on the map.");
      return;
    }

    try {
      setIsSavingLocation(true);

      const details = await getLocationDetails(selectedCoordinate);

      onConfirm({
        latitude: selectedCoordinate.latitude,
        longitude: selectedCoordinate.longitude,
        locationName: details.locationName,
        city: details.city,
      });
    } finally {
      setIsSavingLocation(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.locationPickerContainer}>
        <View
          style={[
            styles.locationPickerHeader,
            {
              height: 58 + insets.top,
              paddingTop: insets.top,
            },
          ]}
        >
          <Pressable
            style={({ pressed }) => [
              styles.closeButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={onClose}
          >
            <Ionicons name="close" size={24} color={colors.text} />
          </Pressable>

          <Text style={styles.locationPickerTitle}>Event Location</Text>

          <Pressable
            style={({ pressed }) => [
              styles.locationPickerHeaderButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleUseCurrentLocation}
            disabled={isLoadingLocation}
          >
            <Ionicons name="navigate" size={19} color={colors.primary} />
          </Pressable>
        </View>

        <View style={styles.locationPickerMapWrapper}>
          {isLoadingLocation ? (
            <View style={styles.locationPickerLoading}>
              <ActivityIndicator size="large" color={colors.primary} />

              <Text style={styles.locationPickerLoadingText}>
                Loading map...
              </Text>
            </View>
          ) : (
            <MapView
              style={styles.locationPickerMap}
              region={region}
              onRegionChangeComplete={setRegion}
              onPress={handleMapPress}
            >
              {selectedCoordinate ? (
                <Marker
                  coordinate={selectedCoordinate}
                  draggable
                  onDragEnd={(event) => {
                    const coordinate = event.nativeEvent.coordinate;

                    setSelectedCoordinate(coordinate);
                    setRegion(getRegionFromCoordinate(coordinate));
                  }}
                />
              ) : null}
            </MapView>
          )}
        </View>

        <View
          style={[
            styles.locationPickerFooter,
            {
              paddingBottom: Math.max(insets.bottom, 16) + 12,
            },
          ]}
        >
          <View style={styles.locationPickerSummary}>
            <Ionicons name="location" size={20} color={colors.primary} />

            <View style={styles.locationPickerSummaryTextBlock}>
              <Text style={styles.locationPickerSummaryTitle}>
                {selectedCoordinate ? "Location selected" : "No location"}
              </Text>

              <Text style={styles.locationPickerSummaryText}>
                {selectedCoordinate
                  ? `${selectedCoordinate.latitude.toFixed(
                      5,
                    )}, ${selectedCoordinate.longitude.toFixed(5)}`
                  : "Choose a point on the map"}
              </Text>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.locationPickerConfirmButton,
              (pressed || isSavingLocation || !selectedCoordinate) &&
                styles.buttonPressed,
            ]}
            onPress={handleConfirm}
            disabled={isSavingLocation || !selectedCoordinate}
          >
            <Text style={styles.locationPickerConfirmText}>
              {isSavingLocation ? "Saving..." : "Save Location"}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
