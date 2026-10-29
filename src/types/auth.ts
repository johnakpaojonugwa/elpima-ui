/**
 * Authentication, 2FA, Session & RBAC Types for Elpima Surgicals API (/api/v1/auth)
 */

export type UserRole = "SUPER_ADMIN" | "SUPERVISING_MANAGER";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  phone: string | null;
  isActive?: boolean;
  isTwoFactorEnabled: boolean;
  lastLoginAt: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  twoFactorCode?: string;
}

export interface Verify2FALoginPayload {
  tempToken: string;
  code: string;
}

export interface AuthenticatedSessionData {
  requires2FA?: false;
  accessToken: string;
  refreshToken: string;
  token: string;
  expiresIn: string;
  user: AuthUser;
}

export interface TwoFactorChallengeData {
  requires2FA: true;
  tempToken: string;
  message: string;
}

export type LoginResponseData =
  | AuthenticatedSessionData
  | TwoFactorChallengeData;

export interface RefreshTokenPayload {
  refreshToken: string;
}

export interface RefreshTokenResponseData {
  accessToken: string;
  refreshToken: string;
  token: string;
  expiresIn: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfilePayload {
  fullName?: string;
  phone?: string;
}

export interface TwoFactorStatusResponse {
  isTwoFactorEnabled: boolean;
  backupCodesRemaining: number;
}

export interface TwoFactorSetupResponse {
  secret: string;
  uri: string;
  qrCodeUrl: string;
  backupCodes: string[];
  instructions: string;
}

export interface Enable2FAPayload {
  code: string;
}

export interface Disable2FAPayload {
  password: string;
  code: string;
}

export interface RegenerateBackupCodesPayload {
  password: string;
  code: string;
}

export interface RegenerateBackupCodesResponse {
  backupCodes: string[];
}

export interface ActiveSession {
  id: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  expiresAt: string;
}
