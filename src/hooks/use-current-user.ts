import { useMemo } from "react";
import { useAuthStore } from "@/store/auth-store";
import type { AuthUser, UserRole } from "@/types/auth";

export interface CurrentUserInfo {
  id: string;
  name: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  isSuperAdmin: boolean;
  isSupervisingManager: boolean;
  isTwoFactorEnabled: boolean;
  initials: string;
  raw: AuthUser | null;
}

const FALLBACK_USER: CurrentUserInfo = {
  id: "",
  name: "Elpima Staff",
  fullName: "Elpima Staff",
  email: "",
  phone: "",
  role: "SUPERVISING_MANAGER",
  isSuperAdmin: false,
  isSupervisingManager: true,
  isTwoFactorEnabled: false,
  initials: "ES",
  raw: null,
};

function computeInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "ES";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function useCurrentUser(): CurrentUserInfo {
  const user = useAuthStore((s) => s.user);

  return useMemo(() => {
    if (!user) return FALLBACK_USER;

    const fullName = user.fullName || user.email || "Elpima Staff";
    const role: UserRole =
      user.role === "SUPER_ADMIN" ? "SUPER_ADMIN" : "SUPERVISING_MANAGER";

    return {
      id: user.id,
      name: fullName,
      fullName,
      email: user.email,
      phone: user.phone || "",
      role,
      isSuperAdmin: role === "SUPER_ADMIN",
      isSupervisingManager: role === "SUPERVISING_MANAGER",
      isTwoFactorEnabled: Boolean(user.isTwoFactorEnabled),
      initials: computeInitials(fullName),
      raw: user,
    };
  }, [user]);
}

