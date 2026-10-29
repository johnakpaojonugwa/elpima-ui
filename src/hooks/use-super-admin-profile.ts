import { useMemo } from "react";
import { useCurrentUser } from "./use-current-user";

const DEFAULT_STAFF_AVATAR =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80";

export interface StaffProfileView {
  id: string;
  name: string;
  firstName: string;
  email: string;
  role: "SUPER_ADMIN" | "SUPERVISING_MANAGER";
  roleLabel: string;
  avatarUrl: string;
}

/**
 * Reads the signed-in staff user from the auth store and returns a normalized
 * identity view for the Super-Admin and Control Admin (Supervising Manager) headers.
 */
export function useSuperAdminProfile(): StaffProfileView {
  const user = useCurrentUser();

  return useMemo(() => {
    const fullName =
      user.raw?.fullName ||
      user.fullName ||
      (user.isSuperAdmin ? "Dr. Emeka Okafor" : "Amina Ibrahim");
    const role = user.raw?.role ?? "SUPER_ADMIN";
    const roleLabel =
      role === "SUPER_ADMIN"
        ? "Super Admin • Elpima Surgicals"
        : "Supervising Manager";

    return {
      id: user.id || "elpima-staff-1",
      name: fullName,
      firstName: fullName.split(" ")[0] || "Admin",
      email: user.email || "admin@elpimasurgicals.com",
      role,
      roleLabel,
      avatarUrl: DEFAULT_STAFF_AVATAR,
    };
  }, [user]);
}

export default useSuperAdminProfile;

