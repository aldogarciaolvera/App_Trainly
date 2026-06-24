const apiUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

if (!apiUrl) {
  throw new Error("EXPO_PUBLIC_API_URL is required.");
}

export const environment = {
  apiUrl,
  useDummyData: process.env.EXPO_PUBLIC_USE_DUMMY_DATA !== "false"
} as const;
