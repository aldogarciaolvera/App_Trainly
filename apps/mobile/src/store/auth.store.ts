import { ApiError } from "@trainly/services";
import type { LoginRequest, RegisterRequest, UserProfile } from "@trainly/types";
import { create } from "zustand";
import { services } from "../services/trainly.services";
import {
  authTokenStorage,
  type StoredAuthSession
} from "../storage/auth-token.storage";

export type AuthStatus = "idle" | "loading" | "authenticated" | "anonymous" | "error";

interface AuthState {
  status: AuthStatus;
  user: UserProfile | null;
  error: string | null;
  hydrate: () => Promise<void>;
  register: (request: RegisterRequest) => Promise<void>;
  login: (request: LoginRequest) => Promise<void>;
  refresh: () => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  status: "idle",
  user: null,
  error: null,

  async hydrate(): Promise<void> {
    if (get().status !== "idle") return;
    set({ status: "loading", error: null });

    const session = await authTokenStorage.get();
    if (!session) {
      set({ status: "anonymous", user: null });
      return;
    }

    try {
      if (isExpired(session)) {
        if (!session.refreshToken || !(await refreshStoredSession(session))) {
          await clearLocalSession(set);
          return;
        }
      }

      const user = await services.users.getMe();
      set({ status: "authenticated", user, error: null });
    } catch (error: unknown) {
      if (error instanceof ApiError && error.status === 401) {
        await clearLocalSession(set);
        return;
      }
      set({ status: "error", user: null, error: getErrorMessage(error) });
    }
  },

  async register(request: RegisterRequest): Promise<void> {
    set({ status: "loading", error: null });
    try {
      const response = await services.auth.register(request);
      await authTokenStorage.set({
        accessToken: response.token,
        refreshToken: null,
        expiresAt: null
      });
      const user = await services.users.getMe();
      set({ status: "authenticated", user, error: null });
    } catch (error: unknown) {
      await authTokenStorage.clear();
      set({ status: "anonymous", user: null, error: getErrorMessage(error) });
      throw error;
    }
  },

  async login(request: LoginRequest): Promise<void> {
    set({ status: "loading", error: null });
    try {
      const response = await services.auth.login(request);
      await authTokenStorage.set({
        accessToken: response.token,
        refreshToken: response.refreshToken,
        expiresAt: response.expiresAt
      });
      const user = await services.users.getMe();
      set({ status: "authenticated", user, error: null });
    } catch (error: unknown) {
      await authTokenStorage.clear();
      set({ status: "anonymous", user: null, error: getErrorMessage(error) });
      throw error;
    }
  },

  async refresh(): Promise<boolean> {
    const session = await authTokenStorage.get();
    if (!session?.refreshToken) return false;

    try {
      const refreshed = await refreshStoredSession(session);
      if (!refreshed) return false;
      const user = await services.users.getMe();
      set({ status: "authenticated", user, error: null });
      return true;
    } catch (error: unknown) {
      if (error instanceof ApiError && error.status === 401) {
        await clearLocalSession(set);
      }
      return false;
    }
  },

  async logout(): Promise<void> {
    try {
      await services.auth.logout();
    } catch {
      // Local logout must still succeed when the API is unavailable.
    } finally {
      await clearLocalSession(set);
    }
  },

  clearError(): void {
    set({ error: null });
  }
}));

async function refreshStoredSession(session: StoredAuthSession): Promise<boolean> {
  if (!session.refreshToken) return false;
  const response = await services.auth.refresh({ refreshToken: session.refreshToken });
  await authTokenStorage.set({
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
    expiresAt: response.expiresAt
  });
  return true;
}

function isExpired(session: StoredAuthSession): boolean {
  return session.expiresAt !== null && Date.parse(session.expiresAt) <= Date.now();
}

async function clearLocalSession(
  set: (state: Partial<AuthState>) => void
): Promise<void> {
  await authTokenStorage.clear();
  set({ status: "anonymous", user: null, error: null });
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Ocurrió un error inesperado.";
}
