import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	Image,
	Pressable,
	Text,
	View,
} from "react-native";
import { colors } from "../../constants/colors";
import { loadSportEvents } from "../../services/eventsApi";
import { styles } from "../../styles/events.styles";
import { SportEvent } from "../../types/opponentSearch";

function getInitials(event: SportEvent) {
	const firstLetter = event.first_name?.[0] ?? "";
	const lastLetter = event.last_name?.[0] ?? "";

	if (firstLetter || lastLetter) {
		return `${firstLetter}${lastLetter}`.toUpperCase();
	}

	return event.nickname?.[0]?.toUpperCase() ?? "?";
}

function formatDate(date: string) {
	return new Date(date).toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
}

function EventCard({ event }: { event: SportEvent }) {
	const [imageFailed, setImageFailed] = useState(false);

	const shouldShowAvatar =
		Boolean(event.avatar_url) &&
		event.avatar_url.startsWith("http") &&
		!imageFailed;

	return (
		<View style={styles.card}>
			<View style={styles.topRow}>
				{shouldShowAvatar ? (
					<Image
						source={{ uri: event.avatar_url }}
						style={styles.avatar}
						onError={() => setImageFailed(true)}
					/>
				) : (
					<View style={styles.avatarPlaceholder}>
						<Text style={styles.avatarPlaceholderText}>
							{getInitials(event)}
						</Text>
					</View>
				)}

				<View style={styles.userInfo}>
					<Text style={styles.nickname}>{event.nickname}</Text>

					<Text style={styles.name}>
						{event.first_name} {event.last_name}
					</Text>

					<Text style={styles.location}>
						{event.city}, {event.country}
					</Text>
				</View>
			</View>

			<View style={styles.infoBlock}>
				<Text style={styles.sport}>{event.sport_name}</Text>

				<Text style={styles.text}>Level: {event.level}</Text>

				<Text style={styles.text}>
					Date: {formatDate(event.available_date)}
				</Text>

				<Text style={styles.text}>
					Time: {event.time_from.slice(0, 5)} - {event.time_to.slice(0, 5)}
				</Text>

				<Text style={styles.text}>Match type: {event.match_type}</Text>

				<Text style={styles.text}>
					Location:{" "}
					{event.location_mode === "city"
						? event.event_city
						: `${event.radius_km} km radius`}
				</Text>
			</View>

			{event.about_me && (
				<Text style={styles.aboutMe} numberOfLines={3}>
					{event.about_me}
				</Text>
			)}

			<Pressable style={styles.joinButton}>
				<Text style={styles.joinButtonText}>I want to join</Text>
			</Pressable>
		</View>
	);
}

export default function EventsScreen() {
	const [events, setEvents] = useState<SportEvent[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const loadEvents = async () => {
		try {
			setIsLoading(true);

			const loadedEvents = await loadSportEvents();

			setEvents(loadedEvents);
		} catch (error) {
			console.log("Events loading error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useFocusEffect(
		useCallback(() => {
			loadEvents();
		}, []),
	);

	if (isLoading) {
		return (
			<View style={styles.centerContainer}>
				<ActivityIndicator size="large" color={colors.primary} />

				<Text style={styles.loadingText}>Loading events...</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>Events</Text>

				<Text style={styles.subtitle}>
					Open sport requests from other users.
				</Text>
			</View>

			{events.length === 0 ? (
				<View style={styles.emptyBlock}>
					<Text style={styles.emptyTitle}>No events yet</Text>

					<Text style={styles.emptyText}>
						When users publish their searches, they will appear here.
					</Text>
				</View>
			) : (
				<FlatList
					data={events}
					keyExtractor={(item) => String(item.id)}
					renderItem={({ item }) => <EventCard event={item} />}
					contentContainerStyle={styles.listContent}
					showsVerticalScrollIndicator={false}
				/>
			)}
		</View>
	);
}
