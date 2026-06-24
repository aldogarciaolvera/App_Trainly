import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export interface StoredAuthSession {
  accessToken: string;
  refreshToken: string | null;
  expiresAt: string | null;
}

const sessionKey = "trainly.auth.session";
let webSession: StoredAuthSession | null = null;

export const authTokenStorage = {
  async get(): Promise<StoredAuthSession | null> {
    if (Platform.OS === "web") return webSession;
    const value = await SecureStore.getItemAsync(sessionKey);
    if (!value) return null;

    try {
      return JSON.parse(value) as StoredAuthSession;
    } catch {
      await SecureStore.deleteItemAsync(sessionKey);
      return null;
    }
  },

  async set(session: StoredAuthSession): Promise<void> {
    if (Platform.OS === "web") {
      webSession = session;
      return;
    }
    await SecureStore.setItemAsync(sessionKey, JSON.stringify(session));
  },

  async clear(): Promise<void> {
    if (Platform.OS === "web") {
      webSession = null;
      return;
    }
    await SecureStore.deleteItemAsync(sessionKey);
  },

  async getAccessToken(): Promise<string | null> {
    return (await this.get())?.accessToken ?? null;
  }
};
