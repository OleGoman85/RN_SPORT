import { SelectedSport } from "../types/profile";

const API_URL = "http://192.168.32.127:5001";

export type SaveProfileParams = {
	clerk_user_id: string;
	email: string;
	first_name: string;
	last_name: string;
	nickname: string;
	about_me: string;
	age: number;
	sex: string;
	country: string;
	city: string;
	avatar_url: string;
	latitude: number | null;
	longitude: number | null;
	sports: SelectedSport[];
	languages: string[];
};

export async function loadUserProfile(clerkUserId: string) {
	const response = await fetch(
		`${API_URL}/api/users/${encodeURIComponent(clerkUserId)}`,
	);

	if (response.status === 404) {
		return null;
	}

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message ?? "Profile loading failed");
	}

	return data;
}

export async function saveUserProfile(profileData: SaveProfileParams) {
	const response = await fetch(`${API_URL}/api/users`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(profileData),
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message ?? "Failed to save profile");
	}

	return data;
}
