export type EventDayFilter = "all" | "today" | "tomorrow" | "week";
export type EventFormat = "1v1" | "team";
export type EventFormatFilter = "all" | EventFormat;

export type UserSportProfile = {
  sport_name: string;
  level: string;
};

export type SportEvent = {
  id: number;
  user_id: number;
  clerk_user_id: string;
  sport_name: string;
  event_format: EventFormat;
  event_name: string;
  event_description: string | null;
  available_date: string;
  time_from: string;
  location_name: string;
  city: string | null;
  event_city?: string | null;
  latitude?: string | number | null;
  longitude?: string | number | null;
  event_latitude?: string | number | null;
  event_longitude?: string | number | null;
  max_participants: number;
  current_participants: number;
  event_image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  first_name: string | null;
  last_name: string | null;
  nickname: string | null;
  about_me?: string | null;
  date_of_birth: string | null;
  age?: number | null;
  avatar_url: string | null;
  rating_avg?: string | number | null;
  rating_count?: number | null;
  games_count?: number | null;
  distance_km?: string | number | null;
};

export type EventCreator = {
  id: number;
  clerk_user_id: string;
  first_name: string | null;
  last_name: string | null;
  nickname: string | null;
  about_me: string | null;
  date_of_birth: string | null;
  age?: number | null;
  sex: string | null;
  country: string | null;
  city: string | null;
  avatar_url: string | null;
  rating_avg: string | number | null;
  rating_count: number;
  games_count: number;
  events_created_count: number;
  participated_events_count: number;
  languages: string[];
  sports: UserSportProfile[];
};

export type EventMember = {
  id: number;
  clerk_user_id: string;
  nickname: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  city: string | null;
  rating_avg: string | number | null;
  rating_count: number;
  joined_at: string;
};

export type EventDetails = {
  event: SportEvent;
  creator: EventCreator;
  members: EventMember[];
};

export type LoadSportEventsParams = {
  day?: EventDayFilter;
  eventFormat?: EventFormatFilter;
  search?: string;
  sport?: string;
  latitude?: number | null;
  longitude?: number | null;
};

export type CreateSportEventParams = {
  current_clerk_user_id: string;
  sport_name: string;
  event_format: EventFormat;
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
