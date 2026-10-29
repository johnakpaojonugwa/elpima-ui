import type React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";

interface SuperAdminGuardProps {
  children?: React.ReactNode;
}

/**
 * SuperAdminGuard (Strict RBAC Guard)
 * Protects routes restricted exclusively to `SUPER_ADMIN` (e.g. Managers, Store Settings, Audit Logs).
 * Redirects `SUPERVISING_MANAGER` users to `/admin/dashboard`.
 */
export const SuperAdminGuard: React.FC<SuperAdminGuardProps> = ({
  children,
}) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const accessToken = useAuthStore((s) => s.accessToken || s.access_token);
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (!isAuthenticated || !accessToken || !user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (user.role !== "SUPER_ADMIN") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default SuperAdminGuard;

