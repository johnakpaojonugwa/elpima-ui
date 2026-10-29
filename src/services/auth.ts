import { apiClient } from "@/libs/api-client";
import { fetchOne } from "@/libs/api-helpers";
import type {
  ActiveSession,
  AuthenticatedSessionData,
  AuthUser,
  ChangePasswordPayload,
  Disable2FAPayload,
  Enable2FAPayload,
  ForgotPasswordPayload,
  LoginPayload,
  LoginResponseData,
  RefreshTokenPayload,
  RefreshTokenResponseData,
  RegenerateBackupCodesPayload,
  RegenerateBackupCodesResponse,
  ResetPasswordPayload,
  TwoFactorSetupResponse,
  TwoFactorStatusResponse,
  UpdateProfilePayload,
  Verify2FALoginPayload,
} from "@/types/auth";

export const authService = {
  // ==========================================
  // Public Authentication Endpoints
  // ==========================================

  /**
   * Authenticate staff/admin credentials.
   * Returns either full session tokens OR `{ requires2FA: true, tempToken, message }` if 2FA is enabled.
   */
  login: async (payload: LoginPayload): Promise<LoginResponseData> => {
    const res = await apiClient.post<LoginResponseData>(
      "/api/v1/auth/login",
      payload,
    );
    return res.data;
  },

  /** Alias matching get-treat-ui convention */
  signIn: async (payload: LoginPayload): Promise<LoginResponseData> => {
    const res = await apiClient.post<LoginResponseData>(
      "/api/v1/auth/login",
      payload,
    );
    return res.data;
  },

  /**
   * Complete 2FA login challenge using temporary token + 6-digit TOTP or backup code.
   */
  verify2FA: async (
    payload: Verify2FALoginPayload,
  ): Promise<AuthenticatedSessionData> => {
    const res = await apiClient.post<AuthenticatedSessionData>(
      "/api/v1/auth/2fa/verify",
      payload,
    );
    return res.data;
  },

  /**
   * Rotate refresh token and issue a fresh access token + refresh token pair.
   */
  refreshToken: async (
    payload: RefreshTokenPayload,
  ): Promise<RefreshTokenResponseData> => {
    const res = await apiClient.post<RefreshTokenResponseData>(
      "/api/v1/auth/refresh-token",
      payload,
    );
    return res.data;
  },

  /**
   * Request password reset token / link for staff account.
   */
  forgotPassword: async (payload: ForgotPasswordPayload) => {
    const res = await apiClient.post(
      "/api/v1/auth/forgot-password",
      payload,
    );
    return res.data;
  },

  /**
   * Reset staff password using a valid one-time reset token.
   */
  resetPassword: async (payload: ResetPasswordPayload) => {
    const res = await apiClient.post(
      "/api/v1/auth/reset-password",
      payload,
    );
    return res.data;
  },

  // ==========================================
  // Protected Profile & Session Endpoints
  // ==========================================

  /**
   * Retrieve current authenticated staff/admin profile.
   */
  getProfile: (): Promise<AuthUser> =>
    fetchOne<AuthUser>("/api/v1/auth/me"),

  /** Alias for `getProfile` */
  getMe: (): Promise<AuthUser> => fetchOne<AuthUser>("/api/v1/auth/me"),

  /**
   * Update current authenticated user's profile (`fullName`, `phone`).
   */
  updateProfile: async (payload: UpdateProfilePayload): Promise<AuthUser> => {
    const res = await apiClient.patch<AuthUser>("/api/v1/auth/me", payload);
    return res.data;
  },

  /**
   * Change current password (automatically revokes other active sessions).
   */
  changePassword: async (payload: ChangePasswordPayload) => {
    const res = await apiClient.post(
      "/api/v1/auth/change-password",
      payload,
    );
    return res.data;
  },

  /**
   * Logout current session and revoke refresh token if provided.
   */
  logout: async (refreshToken?: string | null) => {
    const res = await apiClient.post(
      "/api/v1/auth/logout",
      refreshToken ? { refreshToken } : {},
    );
    return res.data;
  },

  /**
   * Revoke all active sessions for the current user across all devices.
   */
  logoutAll: async () => {
    const res = await apiClient.post("/api/v1/auth/logout-all");
    return res.data;
  },

  // ==========================================
  // Two-Factor Authentication (2FA) Management
  // ==========================================

  /**
   * Check 2FA status and remaining backup codes count.
   */
  get2FAStatus: (): Promise<TwoFactorStatusResponse> =>
    fetchOne<TwoFactorStatusResponse>("/api/v1/auth/2fa/status"),

  /**
   * Generate TOTP secret, otpauth URI, QR code URL, and initial backup codes.
   */
  setup2FA: async (): Promise<TwoFactorSetupResponse> => {
    const res = await apiClient.post<TwoFactorSetupResponse>(
      "/api/v1/auth/2fa/setup",
    );
    return res.data;
  },

  /**
   * Verify TOTP code and activate 2FA on the user's account.
   */
  enable2FA: async (
    payload: Enable2FAPayload,
  ): Promise<{ isTwoFactorEnabled: boolean }> => {
    const res = await apiClient.post<{ isTwoFactorEnabled: boolean }>(
      "/api/v1/auth/2fa/enable",
      payload,
    );
    return res.data;
  },

  /**
   * Disable 2FA on the user's account (requires password + TOTP/backup code).
   */
  disable2FA: async (
    payload: Disable2FAPayload,
  ): Promise<{ isTwoFactorEnabled: boolean }> => {
    const res = await apiClient.post<{ isTwoFactorEnabled: boolean }>(
      "/api/v1/auth/2fa/disable",
      payload,
    );
    return res.data;
  },

  /**
   * Regenerate 8 new one-time recovery backup codes.
   */
  regenerateBackupCodes: async (
    payload: RegenerateBackupCodesPayload,
  ): Promise<RegenerateBackupCodesResponse> => {
    const res = await apiClient.post<RegenerateBackupCodesResponse>(
      "/api/v1/auth/2fa/backup-codes",
      payload,
    );
    return res.data;
  },

  // ==========================================
  // Device Session Management
  // ==========================================

  /**
   * List all active non-revoked sessions for the current user.
   */
  getActiveSessions: (): Promise<ActiveSession[]> =>
    fetchOne<ActiveSession[]>("/api/v1/auth/sessions"),

  /**
   * Revoke a specific session by ID.
   */
  revokeSession: async (sessionId: string) => {
    const res = await apiClient.delete(`/api/v1/auth/sessions/${sessionId}`);
    return res.data;
  },
};

