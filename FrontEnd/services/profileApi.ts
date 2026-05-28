// Frontend API service for editable profiles and public player previews.
import { SaveProfileParams, UserProfile } from "../types/profile";
import { EventCreator } from "../types/events";
import { API_URL } from "./apiConfig";

// Loads the current user's full editable profile.
export async function loadUserProfile(
  clerkUserId: string,
): Promise<UserProfile | null> {
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

// Loads a public player profile for preview modals. (Joined players)
export async function loadPublicUserProfile(
  clerkUserId: string,
): Promise<EventCreator> {
  const response = await fetch(
    `${API_URL}/api/users/${encodeURIComponent(clerkUserId)}/public-profile`,
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? "Profile loading failed");
  }

  return data.profile;
}

// Creates or updates the current user's profile.
export async function saveUserProfile(
  profileData: SaveProfileParams,
): Promise<UserProfile> {
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
