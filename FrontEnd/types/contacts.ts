export type ContactUser = {
  id: number;
  clerk_user_id: string;
  first_name: string | null;
  last_name: string | null;
  nickname: string | null;
  about_me: string | null;
  date_of_birth: string | null;
  sex: string | null;
  country: string | null;
  city: string | null;
  avatar_url: string | null;
  rating_avg: string | number | null;
  rating_count: number;
  games_count: number;
  events_created_count: number;
  participated_events_count: number;
  saved_at: string;
};
