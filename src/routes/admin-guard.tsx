import type React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";
import type { UserRole } from "@/types/auth";

interface AdminGuardProps {
  children?: React.ReactNode;
  allowedRoles?: UserRole[];
}

/**
 * AdminGuard (Protected Staff Guard)
 * Protects routes accessible to both `SUPERVISING_MANAGER` and `SUPER_ADMIN`.
 */
export const AdminGuard: React.FC<AdminGuardProps> = ({
  children,
  allowedRoles = ["SUPERVISING_MANAGER", "SUPER_ADMIN"],
}) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const accessToken = useAuthStore((s) => s.accessToken || s.access_token);
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (!isAuthenticated || !accessToken || !user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/auth" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default AdminGuard;

