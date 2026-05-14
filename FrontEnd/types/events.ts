export type EventDayFilter = "all" | "today" | "tomorrow" | "week";

export type SportEvent = {
  id: number;
  user_id: number;
  clerk_user_id: string;
  sport_name: string;
  event_name: string;
  event_description: string | null;
  available_date: string;
  time_from: string;
  location_name: string;
  city: string | null;
  latitude: string | number | null;
  longitude: string | number | null;
  max_participants: number;
  current_participants: number;
  event_image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  first_name: string | null;
  last_name: string | null;
  nickname: string | null;
  avatar_url: string | null;
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
  event_description: string | null;
  available_date: string;
  time_from: string;
  location_name: string;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  max_participants: number;
  event_image_url: string | null;
};

export type UpdateSportEventParams = CreateSportEventParams;
