// Shared frontend types for editable user profiles and profile API payloads.
export type SelectedSport = {
  sport_name: string;
  level: string;
};

export type UserLanguage = {
  language: string;
};

export type UserProfile = {
  id: number;
  clerk_user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  nickname: string;
  about_me: string;
  date_of_birth: string | null;
  age?: number | null;
  sex: string;
  country: string;
  city: string;
  avatar_url: string;
  latitude: string | number | null;
  longitude: string | number | null;
  rating_avg: string | number | null;
  rating_count: number;
  games_count: number;
  sports: SelectedSport[];
  languages: UserLanguage[];
};

export type SaveProfileParams = {
  clerk_user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  nickname: string;
  about_me: string;
  date_of_birth: string;
  sex: string;
  country: string;
  city: string;
  avatar_url: string;
  latitude: number | null;
  longitude: number | null;
  sports: SelectedSport[];
  languages: string[];
};
