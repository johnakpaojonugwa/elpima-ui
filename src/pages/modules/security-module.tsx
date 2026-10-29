import React, { useEffect, useState } from "react";
import {
  Check,
  Copy,
  KeyRound,
  Laptop,
  LogOut,
  QrCode,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Trash2,
  UserCheck,
} from "lucide-react";
import {
  useActiveSessionsQuery,
  useAuthProfileQuery,
  useChangePasswordMutation,
  useDisable2FAMutation,
  useEnable2FAMutation,
  useLogoutAllMutation,
  useRegenerateBackupCodesMutation,
  useRevokeSessionMutation,
  useSetup2FAMutation,
  useTwoFactorStatusQuery,
  useUpdateProfileMutation,
} from "@/hooks/queries";
import { useAuthStore } from "@/store";
import type { TwoFactorSetupResponse } from "@/types/auth";
import { formatLiveDate } from "@/utils/date";

interface SecurityModuleProps {
  onToast?: (message: string) => void;
}

export const SecurityModule: React.FC<SecurityModuleProps> = ({ onToast }) => {
  const storeUser = useAuthStore((s) => s.user);
  const { data: liveProfile } = useAuthProfileQuery();
  const { data: twoFactorStatus, refetch: refetch2FA } =
    useTwoFactorStatusQuery();
  const {
    data: sessions = [],
    isLoading: sessionsLoading,
    refetch: refetchSessions,
  } = useActiveSessionsQuery();

  const updateProfile = useUpdateProfileMutation();
  const changePassword = useChangePasswordMutation();
  const setup2FA = useSetup2FAMutation();
  const enable2FA = useEnable2FAMutation();
  const disable2FA = useDisable2FAMutation();
  const regenerateCodes = useRegenerateBackupCodesMutation();
  const revokeSession = useRevokeSessionMutation();
  const logoutAll = useLogoutAllMutation();

  const currentUser = liveProfile ?? storeUser;

  // Profile form
  const [fullName, setFullName] = useState(currentUser?.fullName ?? "");
  const [phone, setPhone] = useState(currentUser?.phone ?? "+234");
  const [profileMsg, setProfileMsg] = useState("");

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName ?? "");
      setPhone(currentUser.phone ?? "");
    }
  }, [currentUser]);

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // 2FA state
  const [setupData, setSetupData] = useState<TwoFactorSetupResponse | null>(
    null,
  );
  const [totpCode, setTotpCode] = useState("");
  const [disablePassword, setDisablePassword] = useState("");
  const [disableCode, setDisableCode] = useState("");
  const [regenPassword, setRegenPassword] = useState("");
  const [regenCode, setRegenCode] = useState("");
  const [newBackupCodes, setNewBackupCodes] = useState<string[] | null>(null);
  const [twoFactorError, setTwoFactorError] = useState("");

  const is2FAEnabled =
    twoFactorStatus?.isTwoFactorEnabled ??
    currentUser?.isTwoFactorEnabled ??
    false;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg("");
    try {
      await updateProfile.mutateAsync({
        fullName: fullName.trim(),
        phone: phone.trim() || undefined,
      });
      setProfileMsg("Profile updated successfully.");
      onToast?.("Staff profile updated");
    } catch (err: any) {
      setProfileMsg(err?.normalizedMessage || "Could not update profile.");
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    try {
      await changePassword.mutateAsync({
        currentPassword,
        newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      onToast?.("Password updated & other sessions revoked");
    } catch (err: any) {
      setPasswordError(
        err?.normalizedMessage ||
          err?.response?.data?.message ||
          "Password change failed. Check your current password.",
      );
    }
  };

  const handleInitiate2FASetup = async () => {
    setTwoFactorError("");
    try {
      const res = await setup2FA.mutateAsync();
      setSetupData(res);
    } catch (err: any) {
      setTwoFactorError(err?.normalizedMessage || "Could not initialize 2FA.");
    }
  };

  const handleConfirmEnable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setTwoFactorError("");
    if (totpCode.trim().length < 6) {
      setTwoFactorError("Enter the 6-digit code from your authenticator app.");
      return;
    }
    try {
      await enable2FA.mutateAsync({ code: totpCode.trim() });
      setSetupData(null);
      setTotpCode("");
      refetch2FA();
      onToast?.("Two-Factor Authentication (2FA) enabled!");
    } catch (err: any) {
      setTwoFactorError(
        err?.normalizedMessage || "Invalid 6-digit TOTP verification code.",
      );
    }
  };

  const handleDisable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setTwoFactorError("");
    try {
      await disable2FA.mutateAsync({
        password: disablePassword,
        code: disableCode.trim(),
      });
      setDisablePassword("");
      setDisableCode("");
      refetch2FA();
      onToast?.("Two-Factor Authentication disabled");
    } catch (err: any) {
      setTwoFactorError(
        err?.normalizedMessage || "Failed to disable 2FA. Check password/code.",
      );
    }
  };

  const handleRegenerateCodes = async (e: React.FormEvent) => {
    e.preventDefault();
    setTwoFactorError("");
    try {
      const res = await regenerateCodes.mutateAsync({
        password: regenPassword,
        code: regenCode.trim(),
      });
      setNewBackupCodes(res.backupCodes);
      setRegenPassword("");
      setRegenCode("");
      refetch2FA();
      onToast?.("Generated 8 new recovery backup codes");
    } catch (err: any) {
      setTwoFactorError(
        err?.normalizedMessage || "Failed to regenerate backup codes.",
      );
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await revokeSession.mutateAsync(sessionId);
      onToast?.("Device session terminated");
    } catch (err: any) {
      onToast?.(err?.normalizedMessage || "Failed to revoke session");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2E7D5B]/10 text-[#2E7D5B] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              Security, 2FA & Active Sessions
            </h1>
            <p className="text-xs text-gray-500">
              Manage your staff profile, TOTP Authenticator 2FA, recovery codes,
              and logged-in devices
            </p>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold ${
            is2FAEnabled
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-amber-50 text-amber-700 border border-amber-200"
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>{is2FAEnabled ? "2FA Active" : "2FA Not Enabled"}</span>
        </span>
      </div>

      {/* Grid: Profile + Change Password */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Card */}
        <form
          onSubmit={handleSaveProfile}
          className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-gray-100 space-y-4 text-xs"
        >
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <UserCheck className="w-4 h-4 text-[#2E7D5B]" />
            <h2 className="text-sm font-bold text-gray-900">
              Staff Identity & Contact (PATCH /api/v1/auth/me)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                FULL NAME
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                PHONE NUMBER
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-400 mb-1">
                OFFICIAL EMAIL
              </label>
              <input
                type="email"
                value={currentUser?.email ?? ""}
                disabled
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-gray-500"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-400 mb-1">
                ASSIGNED PORTAL ROLE
              </label>
              <input
                type="text"
                value={currentUser?.role ?? "SUPERVISING_MANAGER"}
                disabled
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-100 bg-gray-50 font-mono text-gray-500"
              />
            </div>
          </div>

          {profileMsg && (
            <p className="text-emerald-700 font-semibold">{profileMsg}</p>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={updateProfile.isPending}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2E7D5B] hover:bg-[#256649] text-white font-bold cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>
                {updateProfile.isPending ? "Saving..." : "Update Profile"}
              </span>
            </button>
          </div>
        </form>

        {/* Change Password Card */}
        <form
          onSubmit={handleSavePassword}
          className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-gray-100 space-y-4 text-xs"
        >
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <KeyRound className="w-4 h-4 text-[#2E7D5B]" />
            <h2 className="text-sm font-bold text-gray-900">
              Change Password (POST /api/v1/auth/change-password)
            </h2>
          </div>

          {passwordError && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
              {passwordError}
            </div>
          )}

          <div>
            <label className="block font-bold text-gray-700 mb-1">
              CURRENT PASSWORD *
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">
              NEW PASSWORD (Min 8 chars) *
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter strong new password"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200"
              required
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={changePassword.isPending}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>
                {changePassword.isPending
                  ? "Updating..."
                  : "Update Password & Revoke Other Sessions"}
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* Two-Factor Authentication (TOTP) Section */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-gray-100 space-y-4 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-[#2E7D5B]" />
            <h2 className="text-sm font-bold text-gray-900">
              Two-Factor Authentication (TOTP Authenticator App)
            </h2>
          </div>
          {is2FAEnabled && (
            <span className="text-[11px] font-semibold text-emerald-700">
              Backup Codes Remaining:{" "}
              <strong>{twoFactorStatus?.backupCodesRemaining ?? 8}</strong>
            </span>
          )}
        </div>

        {twoFactorError && (
          <div className="p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
            {twoFactorError}
          </div>
        )}

        {!is2FAEnabled ? (
          !setupData ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div>
                <p className="font-bold text-gray-900">
                  Protect your account with TOTP Two-Factor Authentication
                </p>
                <p className="text-gray-500 mt-0.5">
                  Requires Google Authenticator, Authy, or 1Password when
                  signing in.
                </p>
              </div>
              <button
                type="button"
                onClick={handleInitiate2FASetup}
                disabled={setup2FA.isPending}
                className="px-4 py-2.5 rounded-xl bg-[#2E7D5B] text-white font-bold shrink-0 cursor-pointer"
              >
                {setup2FA.isPending
                  ? "Generating QR..."
                  : "Setup 2FA Authenticator"}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-gray-50 border border-gray-200">
              <div className="space-y-3">
                <p className="font-bold text-gray-900">
                  1. Scan QR Code in Authenticator App
                </p>
                {setupData.qrCodeUrl && (
                  <img
                    src={setupData.qrCodeUrl}
                    alt="2FA QR Code"
                    className="w-44 h-44 rounded-xl border border-gray-200 bg-white p-2"
                  />
                )}
                <p className="text-[11px] text-gray-500">
                  Manual Secret Key:{" "}
                  <code className="font-mono font-bold text-gray-900 bg-white px-2 py-0.5 rounded border">
                    {setupData.secret}
                  </code>
                </p>

                {setupData.backupCodes?.length > 0 && (
                  <div>
                    <p className="font-bold text-gray-800 mb-1">
                      Emergency Recovery Backup Codes (Save these safely):
                    </p>
                    <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px] bg-white p-3 rounded-xl border border-gray-200">
                      {setupData.backupCodes.map((c) => (
                        <span key={c} className="text-gray-800">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleConfirmEnable2FA} className="space-y-3">
                <p className="font-bold text-gray-900">
                  2. Verify 6-Digit Authenticator Code
                </p>
                <p className="text-gray-500">
                  Enter the 6-digit code shown in your authenticator app to
                  activate 2FA.
                </p>
                <input
                  type="text"
                  maxLength={6}
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value)}
                  placeholder="123456"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 font-mono text-sm tracking-widest bg-white"
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSetupData(null)}
                    className="px-4 py-2 rounded-xl border border-gray-200 bg-white font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={enable2FA.isPending}
                    className="px-5 py-2 rounded-xl bg-[#2E7D5B] text-white font-bold cursor-pointer"
                  >
                    {enable2FA.isPending
                      ? "Verifying..."
                      : "Verify & Enable 2FA"}
                  </button>
                </div>
              </form>
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Regenerate Backup Codes */}
            <form
              onSubmit={handleRegenerateCodes}
              className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3"
            >
              <h3 className="font-bold text-gray-900">
                Regenerate 8 Backup Recovery Codes
              </h3>
              <input
                type="password"
                value={regenPassword}
                onChange={(e) => setRegenPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white"
                required
              />
              <input
                type="text"
                value={regenCode}
                onChange={(e) => setRegenCode(e.target.value)}
                placeholder="6-digit TOTP code"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white font-mono"
                required
              />
              <button
                type="submit"
                disabled={regenerateCodes.isPending}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold cursor-pointer"
              >
                Regenerate Backup Codes
              </button>

              {newBackupCodes && (
                <div className="p-3 rounded-xl bg-white border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-800">
                      New Backup Codes:
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          newBackupCodes.join("\n"),
                        );
                        onToast?.("Backup codes copied");
                      }}
                      className="inline-flex items-center gap-1 text-emerald-700 font-bold"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-1 font-mono text-[11px]">
                    {newBackupCodes.map((c) => (
                      <span key={c}>{c}</span>
                    ))}
                  </div>
                </div>
              )}
            </form>

            {/* Disable 2FA */}
            <form
              onSubmit={handleDisable2FA}
              className="p-4 rounded-xl bg-rose-50/40 border border-rose-200/80 space-y-3"
            >
              <h3 className="font-bold text-rose-900">
                Disable Two-Factor Authentication
              </h3>
              <input
                type="password"
                value={disablePassword}
                onChange={(e) => setDisablePassword(e.target.value)}
                placeholder="Current password"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white"
                required
              />
              <input
                type="text"
                value={disableCode}
                onChange={(e) => setDisableCode(e.target.value)}
                placeholder="6-digit TOTP or backup code"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white font-mono"
                required
              />
              <button
                type="submit"
                disabled={disable2FA.isPending}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
              >
                Disable 2FA
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Active Device Sessions Table */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-gray-100 space-y-4 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <Laptop className="w-4 h-4 text-[#2E7D5B]" />
            <h2 className="text-sm font-bold text-gray-900">
              Active Device Sessions (GET /api/v1/auth/sessions)
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => refetchSessions()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
            <button
              type="button"
              onClick={() => logoutAll.mutate()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Revoke All Devices</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-[11px] font-bold uppercase text-gray-400">
                <th className="py-2.5 pr-3">Device / Browser User-Agent</th>
                <th className="py-2.5 px-3">IP Address</th>
                <th className="py-2.5 px-3">Started</th>
                <th className="py-2.5 px-3">Expires</th>
                <th className="py-2.5 pl-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sessionsLoading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
                    Loading active sessions...
                  </td>
                </tr>
              ) : sessions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    Current browser session active ({formatLiveDate(new Date(), true)})
                  </td>
                </tr>
              ) : (
                sessions.map((sess) => (
                  <tr key={sess.id}>
                    <td className="py-3 pr-3 font-medium text-gray-900 max-w-[280px] truncate">
                      {sess.userAgent || "Web Browser Session"}
                    </td>
                    <td className="py-3 px-3 font-mono text-gray-500">
                      {sess.ipAddress || "127.0.0.1"}
                    </td>
                    <td className="py-3 px-3 text-gray-500">
                      {formatLiveDate(sess.createdAt, true)}
                    </td>
                    <td className="py-3 px-3 text-gray-500">
                      {formatLiveDate(sess.expiresAt, true)}
                    </td>
                    <td className="py-3 pl-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleRevokeSession(sess.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-rose-600 hover:bg-rose-50 font-semibold cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Terminate</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SecurityModule;

