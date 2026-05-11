export type EventDayFilter = "all" | "today" | "tomorrow" | "week";

export type SportEvent = {
  id: number;
  sport_name: string;
  event_name: string;
  event_description: string | null;
  available_date: string;
  time_from: string;
  location_name: string;
  event_city: string | null;
  event_latitude: string | number | null;
  event_longitude: string | number | null;
  max_participants: number;
  current_participants: number;
  event_image_url: string | null;
  created_at: string;
  clerk_user_id: string;
  first_name: string | null;
  last_name: string | null;
  nickname: string | null;
  about_me: string | null;
  age: number | null;
  sex: string | null;
  country: string | null;
  city: string | null;
  avatar_url: string | null;
  rating_avg: string | number;
  rating_count: number;
  games_count: number;
  distance_km: string | number | null;
};

export type LoadSportEventsParams = {
  day?: EventDayFilter;
  search?: string;
  sport?: string;
  latitude?: number | null;
  longitude?: number | null;
};

export type CreateSportEventParams = {
  current_clerk_user_id: string;
  sport_name: string;
  event_name: string;
  event_description?: string | null;
  available_date: string;
  time_from: string;
  location_name: string;
  city?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  max_participants: number;
  event_image_url?: string | null;
};
