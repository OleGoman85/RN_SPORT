import { useUser } from "@clerk/expo";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Alert } from "react-native";
import { sports } from "../data/sports";
import {
	createSportEvent,
	deleteSportEvent,
	loadMySportEvents,
	updateSportEvent,
} from "../services/eventsApi";
import {
	EventFormat,
	EventLocationSelection,
	SportEvent,
} from "../types/events";
import {
	getEventCity,
	getTodayDate,
	normalizeTime,
} from "../utils/eventForm";

function getNumericCoordinate(value: string | number | null | undefined) {
	if (value === null || value === undefined) {
		return null;
	}

	const numericValue = Number(value);

	return Number.isNaN(numericValue) ? null : numericValue;
}

export function useCreateEventForm() {
	const { user } = useUser();

	const [searchText, setSearchText] = useState("");
	const [selectedSportName, setSelectedSportName] = useState(
		sports[0]?.name ?? "",
	);
	const [eventName, setEventName] = useState("");
	const [eventFormat, setEventFormat] = useState<EventFormat | "">("");
	const [date, setDate] = useState(getTodayDate());
	const [time, setTime] = useState("19:00");
	const [locationName, setLocationName] = useState("");
	const [city, setCity] = useState<string | null>(null);
	const [latitude, setLatitude] = useState<number | null>(null);
	const [longitude, setLongitude] = useState<number | null>(null);
	const [isLocationPickerVisible, setIsLocationPickerVisible] = useState(false);
	const [maxParticipants, setMaxParticipants] = useState(2);
	const [description, setDescription] = useState("");
	const [isSaving, setIsSaving] = useState(false);
	const [isLoadingMyEvents, setIsLoadingMyEvents] = useState(false);
	const [myEvents, setMyEvents] = useState<SportEvent[]>([]);
	const [editingEventId, setEditingEventId] = useState<number | null>(null);

	const isEditing = editingEventId !== null;

	const filteredSports = useMemo(() => {
		const query = searchText.trim().toLowerCase();

		if (!query) {
			return sports;
		}

		return sports.filter((sport) =>
			sport.name.toLowerCase().includes(query),
		);
	}, [searchText]);

	const selectedEditingEvent = useMemo(() => {
		if (editingEventId === null) {
			return null;
		}

		return myEvents.find((event) => event.id === editingEventId) ?? null;
	}, [editingEventId, myEvents]);

	const loadMyEvents = useCallback(async () => {
		if (!user?.id) {
			return;
		}

		try {
			setIsLoadingMyEvents(true);

			const loadedEvents = await loadMySportEvents(user.id);

			setMyEvents(loadedEvents);
		} catch (error) {
			console.log("Load my events error:", error);
			Alert.alert("Error", "Could not load your events.");
		} finally {
			setIsLoadingMyEvents(false);
		}
	}, [user?.id]);

	useFocusEffect(
		useCallback(() => {
			loadMyEvents();
		}, [loadMyEvents]),
	);

	const resetForm = () => {
		setSelectedSportName(sports[0]?.name ?? "");
		setEventName("");
		setEventFormat("");
		setDate(getTodayDate());
		setTime("19:00");
		setLocationName("");
		setCity(null);
		setLatitude(null);
		setLongitude(null);
		setIsLocationPickerVisible(false);
		setMaxParticipants(2);
		setDescription("");
		setEditingEventId(null);
	};

	const fillFormFromEvent = (event: SportEvent) => {
		setEditingEventId(event.id);
		setSelectedSportName(event.sport_name);
		setEventName(event.event_name);
		setEventFormat(event.event_format ?? "team");
		setDate(event.available_date.slice(0, 10));
		setTime(normalizeTime(event.time_from));
		setLocationName(event.location_name);
		setCity(getEventCity(event) || null);
		setLatitude(getNumericCoordinate(event.event_latitude ?? event.latitude));
		setLongitude(getNumericCoordinate(event.event_longitude ?? event.longitude));
		setMaxParticipants(event.max_participants);
		setDescription(event.event_description ?? "");
	};

	const validateForm = () => {
		if (!user?.id) {
			Alert.alert("Error", "User is not loaded yet.");
			return false;
		}

		if (
			!selectedSportName ||
			!eventFormat ||
			!eventName.trim() ||
			!date.trim() ||
			!time.trim() ||
			latitude === null ||
			longitude === null
		) {
			Alert.alert(
				"Missing data",
				"Sport, format, event name, date, time and map location are required.",
			);
			return false;
		}

		if (eventFormat === "1v1" && maxParticipants !== 2) {
			Alert.alert("Check participants", "1v1 events must have 2 participants.");
			return false;
		}

		return true;
	};

	const handleChangeEventFormat = (value: EventFormat) => {
		setEventFormat(value);

		if (value === "1v1") {
			setMaxParticipants(2);
		}
	};

	const handleOpenLocationPicker = () => {
		setIsLocationPickerVisible(true);
	};

	const handleCloseLocationPicker = () => {
		setIsLocationPickerVisible(false);
	};

	const handleConfirmLocation = (location: EventLocationSelection) => {
		setLocationName(location.locationName);
		setCity(location.city);
		setLatitude(location.latitude);
		setLongitude(location.longitude);
		setIsLocationPickerVisible(false);
	};

	const buildEventPayload = () => {
		return {
			current_clerk_user_id: user!.id,
			sport_name: selectedSportName,
			event_format: eventFormat as EventFormat,
			event_name: eventName.trim(),
			event_description: description.trim() || null,
			available_date: date.trim(),
			time_from: time.trim(),
			location_name: locationName.trim() || "Selected location",
			city,
			latitude,
			longitude,
			max_participants: maxParticipants,
			event_image_url: selectedEditingEvent?.event_image_url ?? null,
		};
	};

	const handleCreateEvent = async () => {
		if (!validateForm() || !user?.id) {
			return;
		}

		try {
			setIsSaving(true);

			const createdEvent = await createSportEvent(buildEventPayload());

			setMyEvents((currentEvents) => [createdEvent, ...currentEvents]);

			Alert.alert("Success", "Event created successfully.");
			resetForm();
			router.replace("/(home)/(tabs)/events");
		} catch (error) {
			console.log("Create event error:", error);
			Alert.alert("Error", "Could not create event.");
		} finally {
			setIsSaving(false);
		}
	};

	const handleUpdateEvent = async () => {
		if (!validateForm() || !user?.id || editingEventId === null) {
			return;
		}

		try {
			setIsSaving(true);

			const updatedEvent = await updateSportEvent(
				editingEventId,
				buildEventPayload(),
			);

			setMyEvents((currentEvents) =>
				currentEvents.map((event) =>
					event.id === updatedEvent.id ? updatedEvent : event,
				),
			);

			Alert.alert("Success", "Event updated successfully.");
			resetForm();
		} catch (error) {
			console.log("Update event error:", error);
			Alert.alert("Error", "Could not update event.");
		} finally {
			setIsSaving(false);
		}
	};

	const handleDeleteEvent = (eventToDelete: SportEvent) => {
		if (!user?.id || isSaving) {
			return;
		}

		Alert.alert("Delete event", `Delete "${eventToDelete.event_name}"?`, [
			{
				text: "Cancel",
				style: "cancel",
			},
			{
				text: "Delete",
				style: "destructive",
				onPress: async () => {
					try {
						setIsSaving(true);

						await deleteSportEvent(eventToDelete.id, user.id);

						setMyEvents((currentEvents) =>
							currentEvents.filter((event) => event.id !== eventToDelete.id),
						);

						Alert.alert("Success", "Event deleted.");

						if (editingEventId === eventToDelete.id) {
							resetForm();
						}
					} catch (error) {
						console.log("Delete event error:", error);
						Alert.alert("Error", "Could not delete event.");
					} finally {
						setIsSaving(false);
					}
				},
			},
		]);
	};

	return {
		searchText,
		setSearchText,
		selectedSportName,
		setSelectedSportName,
		eventFormat,
		handleChangeEventFormat,
		eventName,
		setEventName,
		date,
		setDate,
		time,
		setTime,
		locationName,
		latitude,
		longitude,
		isLocationPickerVisible,
		handleOpenLocationPicker,
		handleCloseLocationPicker,
		handleConfirmLocation,
		city,
		maxParticipants,
		setMaxParticipants,
		description,
		setDescription,
		isSaving,
		isLoadingMyEvents,
		myEvents,
		editingEventId,
		isEditing,
		filteredSports,
		resetForm,
		fillFormFromEvent,
		handleCreateEvent,
		handleUpdateEvent,
		handleDeleteEvent,
	};
}
