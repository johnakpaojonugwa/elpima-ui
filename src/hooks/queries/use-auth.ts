import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth";
import { useAuthStore } from "@/store/auth-store";
import type {
  ChangePasswordPayload,
  Disable2FAPayload,
  Enable2FAPayload,
  ForgotPasswordPayload,
  LoginPayload,
  RegenerateBackupCodesPayload,
  ResetPasswordPayload,
  UpdateProfilePayload,
  Verify2FALoginPayload,
} from "@/types/auth";
import { queryKeys } from "./keys";

export function useAuthProfileQuery(enabled = true) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setUser = useAuthStore((s) => s.setUser);

  return useQuery({
    queryKey: queryKeys.auth.profile(),
    queryFn: async () => {
      const profile = await authService.getProfile();
      setUser(profile);
      return profile;
    },
    enabled: enabled && isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
}

export function useTwoFactorStatusQuery(enabled = true) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.auth.twoFactorStatus(),
    queryFn: () => authService.get2FAStatus(),
    enabled: enabled && isAuthenticated,
  });
}

export function useActiveSessionsQuery(enabled = true) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.auth.sessions(),
    queryFn: () => authService.getActiveSessions(),
    enabled: enabled && isAuthenticated,
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const loginAction = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginAction(payload),
    onSuccess: (data) => {
      if (!("requires2FA" in data && data.requires2FA)) {
        queryClient.setQueryData(queryKeys.auth.profile(), data.user);
      }
    },
  });
}

export function useVerify2FAMutation() {
  const queryClient = useQueryClient();
  const verify2FAAction = useAuthStore((s) => s.verify2FA);

  return useMutation({
    mutationFn: (payload: Verify2FALoginPayload) => verify2FAAction(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.auth.profile(), data.user);
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const logoutAction = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: () => logoutAction(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

export function useLogoutAllMutation() {
  const queryClient = useQueryClient();
  const logoutAllAction = useAuthStore((s) => s.logoutAll);

  return useMutation({
    mutationFn: () => logoutAllAction(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  const updateProfileAction = useAuthStore((s) => s.updateProfile);

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateProfileAction(payload),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(queryKeys.auth.profile(), updatedUser);
    },
  });
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      authService.changePassword(payload),
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) =>
      authService.forgotPassword(payload),
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) =>
      authService.resetPassword(payload),
  });
}

export function useSetup2FAMutation() {
  return useMutation({
    mutationFn: () => authService.setup2FA(),
  });
}

export function useEnable2FAMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Enable2FAPayload) => authService.enable2FA(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.auth.twoFactorStatus(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.auth.profile(),
      });
    },
  });
}

export function useDisable2FAMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Disable2FAPayload) => authService.disable2FA(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.auth.twoFactorStatus(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.auth.profile(),
      });
    },
  });
}

export function useRegenerateBackupCodesMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegenerateBackupCodesPayload) =>
      authService.regenerateBackupCodes(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.auth.twoFactorStatus(),
      });
    },
  });
}

export function useRevokeSessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => authService.revokeSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.auth.sessions(),
      });
    },
  });
}

