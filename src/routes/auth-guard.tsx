import type React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";

interface AuthGuardProps {
  children?: React.ReactNode;
}

/**
 * AuthGuard (Guest Guard)
 * Protects public authentication routes (e.g. /auth) from already-authenticated staff.
 * Redirects SUPER_ADMIN to `/super-admin/dashboard` and SUPERVISING_MANAGER to `/admin/dashboard`.
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const accessToken = useAuthStore((s) => s.accessToken || s.access_token);
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (isAuthenticated && accessToken && user) {
    const defaultRedirect =
      user.role === "SUPER_ADMIN"
        ? "/super-admin/dashboard"
        : "/admin/dashboard";
    const from = (location.state as { from?: { pathname?: string } })?.from
      ?.pathname;

    return <Navigate to={from || defaultRedirect} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default AuthGuard;

