export const opponentLevels = [
  "Any",
  "Beginner",
  "Amateur",
  "Professional",
] as const;

export const opponentLanguages = [
  "Any",
  "English",
  "Russian",
  "German",
  "French",
  "Spanish",
  "Japanese",
  "Finnish",
  "Chinese",
  "Arabic",
] as const;

export const opponentSexOptions = ["Male", "Female"] as const;

export const matchTypes = [
  "Any",
  "Casual",
  "Training",
  "Competitive",
] as const;

export const radiusOptions = [1, 3, 5, 10, 20, 50] as const;

export type OpponentLevel = (typeof opponentLevels)[number];
export type OpponentLanguage = (typeof opponentLanguages)[number];
export type OpponentSex = (typeof opponentSexOptions)[number];
export type MatchType = (typeof matchTypes)[number];
