// Shared frontend types for private chats, event chats, messages, and unread counts.
export type ChatType = "private" | "event";

export type ChatSummary = {
  id: number;
  type: ChatType;
  event_id: number | null;
  created_at: string;
  updated_at: string;
  last_message_text: string | null;
  last_message_at: string | null;
  unread_count: number;

  other_clerk_user_id: string | null;
  other_first_name: string | null;
  other_last_name: string | null;
  other_nickname: string | null;
  other_avatar_url: string | null;

  event_name: string | null;
  sport_name: string | null;
  event_format: "1v1" | "team" | null;
  available_date: string | null;
  time_from: string | null;
  event_image_url: string | null;
  current_participants: number | null;
  max_participants: number | null;
};

export type ChatMessage = {
  id: number;
  chat_id: number;
  sender_user_id: number;
  sender_clerk_user_id: string;
  sender_first_name: string | null;
  sender_last_name: string | null;
  sender_nickname: string | null;
  sender_avatar_url: string | null;
  message_text: string;
  created_at: string;
};

export type ChatMessagesResponse = {
  chat: ChatSummary | null;
  messages: ChatMessage[];
};

export type UnreadChatCounts = {
  private: number;
  event: number;
  total: number;
};
