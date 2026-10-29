import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";
import { authService } from "@/services/auth";
import type {
  AuthenticatedSessionData,
  AuthUser,
  LoginPayload,
  LoginResponseData,
  UpdateProfilePayload,
  Verify2FALoginPayload,
} from "@/types/auth";

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  access_token: string | null;
  refreshToken: string | null;
  refresh_token: string | null;
  isAuthenticated: boolean;
  requires2FA: boolean;
  tempToken: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (payload: LoginPayload) => Promise<LoginResponseData>;
  signIn: (payload: LoginPayload) => Promise<LoginResponseData>;
  verify2FA: (
    payload: Verify2FALoginPayload,
  ) => Promise<AuthenticatedSessionData>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  fetchProfile: () => Promise<AuthUser | null>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<AuthUser>;
  setUser: (user: AuthUser | null) => void;
  setTokens: (accessToken: string | null, refreshToken?: string | null) => void;
  clear2FAChallenge: () => void;
  clearError: () => void;
}

function extractErrorMessage(err: any, fallback: string): string {
  return (
    err?.normalizedMessage ||
    err?.response?.data?.error?.message ||
    err?.response?.data?.message ||
    err?.response?.data?.msg ||
    err?.message ||
    fallback
  );
}

function persistDirectTokens(
  accessToken: string | null,
  refreshToken?: string | null,
) {
  if (typeof window === "undefined") return;
  try {
    if (accessToken) {
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("accessToken", accessToken);
    } else {
      localStorage.removeItem("access_token");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("token");
      localStorage.removeItem("jwt");
    }

    if (refreshToken !== undefined) {
      if (refreshToken) {
        localStorage.setItem("refresh_token", refreshToken);
        localStorage.setItem("refreshToken", refreshToken);
      } else {
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("refreshToken");
      }
    }
  } catch {
    // ignore storage errors
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      access_token: null,
      refreshToken: null,
      refresh_token: null,
      isAuthenticated: false,
      requires2FA: false,
      tempToken: null,
      isLoading: false,
      error: null,

      login: async (payload: LoginPayload) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(payload);

          if ("requires2FA" in response && response.requires2FA === true) {
            set({
              requires2FA: true,
              tempToken: response.tempToken,
              isLoading: false,
              error: null,
            });
            return response;
          }

          const sessionData = response as AuthenticatedSessionData;
          const access = sessionData.accessToken || sessionData.token;
          const refresh = sessionData.refreshToken;

          persistDirectTokens(access, refresh);

          set({
            user: sessionData.user,
            accessToken: access,
            access_token: access,
            refreshToken: refresh,
            refresh_token: refresh,
            isAuthenticated: true,
            requires2FA: false,
            tempToken: null,
            isLoading: false,
            error: null,
          });

          return sessionData;
        } catch (err: any) {
          const message = extractErrorMessage(
            err,
            "Invalid email or password.",
          );
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      signIn: async (payload: LoginPayload) => {
        return get().login(payload);
      },

      verify2FA: async (payload: Verify2FALoginPayload) => {
        set({ isLoading: true, error: null });
        try {
          const sessionData = await authService.verify2FA(payload);
          const access = sessionData.accessToken || sessionData.token;
          const refresh = sessionData.refreshToken;

          persistDirectTokens(access, refresh);

          set({
            user: sessionData.user,
            accessToken: access,
            access_token: access,
            refreshToken: refresh,
            refresh_token: refresh,
            isAuthenticated: true,
            requires2FA: false,
            tempToken: null,
            isLoading: false,
            error: null,
          });

          return sessionData;
        } catch (err: any) {
          const message = extractErrorMessage(
            err,
            "Invalid two-factor authentication code.",
          );
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      logout: async () => {
        const currentRefreshToken =
          get().refreshToken ||
          get().refresh_token ||
          (typeof window !== "undefined"
            ? localStorage.getItem("refresh_token") ||
              localStorage.getItem("refreshToken")
            : null);

        try {
          if (get().isAuthenticated || currentRefreshToken) {
            await authService.logout(currentRefreshToken);
          }
        } catch {
          // Proceed with local teardown even if server logout fails
        } finally {
          persistDirectTokens(null, null);
          set({
            user: null,
            accessToken: null,
            access_token: null,
            refreshToken: null,
            refresh_token: null,
            isAuthenticated: false,
            requires2FA: false,
            tempToken: null,
            isLoading: false,
            error: null,
          });
        }
      },

      logoutAll: async () => {
        try {
          await authService.logoutAll();
        } finally {
          persistDirectTokens(null, null);
          set({
            user: null,
            accessToken: null,
            access_token: null,
            refreshToken: null,
            refresh_token: null,
            isAuthenticated: false,
            requires2FA: false,
            tempToken: null,
            isLoading: false,
            error: null,
          });
        }
      },

      refreshSession: async () => {
        const storedRefresh =
          get().refreshToken ||
          get().refresh_token ||
          (typeof window !== "undefined"
            ? localStorage.getItem("refresh_token") ||
              localStorage.getItem("refreshToken")
            : null);

        if (!storedRefresh) return false;

        try {
          const refreshed = await authService.refreshToken({
            refreshToken: storedRefresh,
          });
          const nextAccess = refreshed.accessToken || refreshed.token;
          const nextRefresh = refreshed.refreshToken || storedRefresh;

          persistDirectTokens(nextAccess, nextRefresh);

          set({
            accessToken: nextAccess,
            access_token: nextAccess,
            refreshToken: nextRefresh,
            refresh_token: nextRefresh,
            isAuthenticated: true,
          });
          return true;
        } catch {
          persistDirectTokens(null, null);
          set({
            user: null,
            accessToken: null,
            access_token: null,
            refreshToken: null,
            refresh_token: null,
            isAuthenticated: false,
          });
          return false;
        }
      },

      fetchProfile: async () => {
        try {
          const profile = await authService.getProfile();
          set({
            user: profile,
            isAuthenticated: true,
          });
          return profile;
        } catch {
          return null;
        }
      },

      updateProfile: async (payload: UpdateProfilePayload) => {
        set({ isLoading: true, error: null });
        try {
          const updatedUser = await authService.updateProfile(payload);
          set({
            user: updatedUser,
            isLoading: false,
          });
          return updatedUser;
        } catch (err: any) {
          const message = extractErrorMessage(
            err,
            "Failed to update user profile.",
          );
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      setUser: (user) => {
        set({
          user,
          isAuthenticated: Boolean(user),
        });
      },

      setTokens: (accessToken, refreshToken) => {
        persistDirectTokens(accessToken, refreshToken);
        set((state) => ({
          accessToken,
          access_token: accessToken,
          refreshToken:
            refreshToken !== undefined ? refreshToken : state.refreshToken,
          refresh_token:
            refreshToken !== undefined ? refreshToken : state.refresh_token,
          isAuthenticated: Boolean(accessToken),
        }));
      },

      clear2FAChallenge: () =>
        set({
          requires2FA: false,
          tempToken: null,
        }),

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        access_token: state.access_token,
        refreshToken: state.refreshToken,
        refresh_token: state.refresh_token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

/**
 * Shallow-selected convenience hook matching get-treat-ui's `useAuth()` pattern.
 */
export function useAuth() {
  return useAuthStore(
    useShallow((state) => ({
      user: state.user,
      accessToken: state.accessToken,
      access_token: state.access_token,
      refreshToken: state.refreshToken,
      refresh_token: state.refresh_token,
      isAuthenticated: state.isAuthenticated,
      requires2FA: state.requires2FA,
      tempToken: state.tempToken,
      isLoading: state.isLoading,
      error: state.error,
      login: state.login,
      signIn: state.signIn,
      verify2FA: state.verify2FA,
      logout: state.logout,
      logoutAll: state.logoutAll,
      refreshSession: state.refreshSession,
      fetchProfile: state.fetchProfile,
      updateProfile: state.updateProfile,
      setUser: state.setUser,
      setTokens: state.setTokens,
      clear2FAChallenge: state.clear2FAChallenge,
      clearError: state.clearError,
    })),
  );
}

