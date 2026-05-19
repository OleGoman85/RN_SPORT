const apiUrl = process.env.EXPO_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error("EXPO_PUBLIC_API_URL is missing in FrontEnd/.env");
}

export const API_URL = apiUrl.replace(/\/$/, "");
