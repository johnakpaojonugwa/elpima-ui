// src/pages/admin/components/control-admin-header.tsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Bell,
  Menu,
  X,
  LogOut,
  LayoutGrid,
} from "lucide-react";
import { useAuthStore } from "@/store";
import { useSuperAdminProfile } from "@/hooks/use-super-admin-profile";
import { CONTROL_ADMIN_NAV_ITEMS } from "../dashboard/constants";
import type { ControlAdminNavItem, ControlAdminRole } from "../dashboard/types";
import {
  SuperAdminNotificationsModal,
  INITIAL_SUPER_ADMIN_NOTIFICATIONS,
} from "@/pages/super-admin/components/super-admin-notifications-modal";

interface ControlAdminHeaderProps {
  onToggleMobileSidebar: () => void;
  isMobileSidebarOpen: boolean;
  isCollapsed?: boolean;
  currentDateLabel?: string;
  selectedRole?: ControlAdminRole;
}

export const ControlAdminHeader: React.FC<ControlAdminHeaderProps> = ({
  onToggleMobileSidebar,
  isMobileSidebarOpen,
  isCollapsed = false,
  currentDateLabel,
  selectedRole = "Catalog Ops",
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((authState) => authState.logout);
  const profile = useSuperAdminProfile();

  const [searchQuery, setSearchQuery] = useState("");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(
    INITIAL_SUPER_ADMIN_NOTIFICATIONS,
  );

  const unreadCount = notifications.filter(
    (notificationItem) => !notificationItem.isRead,
  ).length;

  const handleMarkAllAsRead = () => {
    setNotifications((previousNotifications) =>
      previousNotifications.map((notificationItem) => ({
        ...notificationItem,
        isRead: true,
      })),
    );
  };

  const handleToggleRead = (id: string) => {
    setNotifications((previousNotifications) =>
      previousNotifications.map((notificationItem) =>
        notificationItem.id === id
          ? { ...notificationItem, isRead: !notificationItem.isRead }
          : notificationItem,
      ),
    );
  };

  const dateLabel =
    currentDateLabel ??
    new Date().toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

  const handleNavigatePath = (targetPath?: string) => {
    if (!targetPath) return;
    navigate(targetPath);
    if (isMobileSidebarOpen) {
      onToggleMobileSidebar();
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/auth", { replace: true });
  };

  const currentPath = location.pathname.toLowerCase();
  const actorRoleLabel =
    selectedRole === "Catalog Ops"
      ? "Supervising Manager (Catalog Ops)"
      : "Supervising Manager (Quote Desk)";

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white px-4 sm:px-5 lg:px-6 py-3.5 border-b border-gray-200/70">
        <div className="w-full flex items-center justify-between gap-4">
          {/* Left: hamburger button (<=1124px) + brand logo + identity block */}
          <div className="flex items-center gap-3 min-w-0">
            <AnimatePresence>
              {isCollapsed && (
                <motion.button
                  key="control-admin-hamburger"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  onClick={onToggleMobileSidebar}
                  aria-label="Toggle navigation menu"
                  className="sidebar-hamburger-btn p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  {isMobileSidebarOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </motion.button>
              )}
            </AnimatePresence>

            <div
              onClick={() => navigate("/admin/dashboard")}
              role="button"
              tabIndex={0}
              onKeyDown={(keyboardEvent) => {
                if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
                  navigate("/admin/dashboard");
                }
              }}
              aria-label="Go to Supervising Manager Dashboard"
              className="flex items-center select-none cursor-pointer"
            >
              <span className="font-extrabold text-2xl sm:text-[26px] tracking-tight text-[#ea580c] flex items-center relative">
                <span className="relative inline-block">
                  E
                  <span className="absolute -top-1.5 left-0.5 w-2.5 h-1.5 bg-[#2e7d5b] rounded-full transform -rotate-12" />
                </span>
                <span className="text-[#ea580c]">lpima</span>
              </span>
            </div>

            {/* Desktop: Manager Identity Block */}
            <div className="hidden md:block ml-4 pl-4 border-l border-gray-200">
              <h1 className="text-[#171A1F] font-semibold text-[15px] leading-tight truncate">
                {profile.name || "Supervising Manager"}
              </h1>
              <p className="text-[#999999] text-xs font-medium truncate">
                {actorRoleLabel}
              </p>
            </div>
          </div>

          {/* Right: search pill, date, notification bell, user avatar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Input Pill */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const q = searchQuery.trim();
                if (!q) return;
                if (q.toUpperCase().startsWith("ELP-")) {
                  navigate(
                    `/admin/quotes?reference=${encodeURIComponent(q)}`,
                  );
                } else {
                  navigate(`/admin/products`);
                }
              }}
              className="hidden md:flex items-center relative text-[#408561]"
            >
              <Search className="absolute text-base left-3 w-4 h-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(changeEvent) => setSearchQuery(changeEvent.target.value)}
                placeholder="Search SKUs, quotes..."
                className="bg-[#D3E5DC] outline-none text-sm placeholder:text-[#408561] text-[#171A1F] rounded-full pr-3 pl-9 h-10 w-40 lg:w-56 focus:ring-2 focus:ring-[#2e7d5b]/30 transition"
              />
            </form>

            {/* Date + Bell + Avatar Container Pill */}
            <div className="flex items-center gap-3 p-1 pl-3 h-11 text-[#408561] border border-[#408561] rounded-full">
              <p className="text-xs font-semibold hidden md:block select-none">
                {dateLabel}
              </p>

              <button
                type="button"
                onClick={() => setIsNotificationsOpen(true)}
                className="relative cursor-pointer p-1 rounded-full hover:bg-stone-100/70 transition"
                title="Notifications"
                aria-label="View notifications"
              >
                {unreadCount > 0 && (
                  <span className="absolute w-2.5 h-2.5 bg-red-500 rounded-full top-0.5 right-0.5 ring-2 ring-white" />
                )}
                <Bell className="text-gray-600 w-5 h-5 hover:text-gray-900 transition-colors" />
              </button>

              <div
                onClick={() => navigate("/admin/security")}
                role="button"
                tabIndex={0}
                className="w-9 h-9 flex items-center justify-center bg-gray-300 rounded-full overflow-hidden shadow-2xs border border-white cursor-pointer"
                title={`${profile.name || "Supervising Manager"} — Security & Profile`}
              >
                <img
                  src={profile.avatarUrl}
                  alt={profile.name || "Supervising Manager"}
                  className="w-full h-full object-cover"
                  onError={(imageErrorEvent) => {
                    (imageErrorEvent.currentTarget as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile & Tablet Drawer Portal */}
      <AnimatePresence mode="wait">
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 z-50 flex sidebar-drawer-portal"
            role="dialog"
            aria-modal="true"
            aria-label="Control Admin Mobile Navigation"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onToggleMobileSidebar}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Mobile Drawer Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-[85%] max-w-[320px] bg-[#101726] text-white h-full flex flex-col z-10 shadow-2xl overflow-hidden"
            >
              {/* Header inside drawer */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <div>
                  <span className="font-extrabold text-xl text-[#ea580c] flex items-center">
                    <span className="relative inline-block">
                      E
                      <span className="absolute -top-1 left-0.5 w-2 h-1 bg-[#2e7d5b] rounded-full transform -rotate-12" />
                    </span>
                    <span className="text-[#ea580c]">lpima</span>
                  </span>
                  <p className="text-white/60 text-[11px] font-medium mt-0.5">
                    {actorRoleLabel}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onToggleMobileSidebar}
                  className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
                  aria-label="Close navigation"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5">
                {CONTROL_ADMIN_NAV_ITEMS.map((navItem: ControlAdminNavItem) => {
                  const Icon = navItem.icon ?? LayoutGrid;
                  const isActive =
                    navItem.id === "overview"
                      ? currentPath === "/admin/dashboard" ||
                        currentPath === "/admin" ||
                        currentPath === "/admin/overview"
                      : currentPath.includes(navItem.id);

                  return (
                    <button
                      key={navItem.id}
                      type="button"
                      onClick={() => handleNavigatePath(navItem.path)}
                      className={`w-full flex items-center justify-between gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-[#1E293B] text-white shadow-xs"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span className="flex items-center gap-3.5 truncate">
                        <Icon className="w-5 h-5 shrink-0" />
                        <span className="truncate">{navItem.label}</span>
                      </span>
                      {navItem.badge ? (
                        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                          {navItem.badge}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </nav>

              {/* Drawer Footer with Logout */}
              <div className="p-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Notifications Modal */}
      <SuperAdminNotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllAsRead}
        onToggleRead={handleToggleRead}
      />
    </>
  );
};

export default ControlAdminHeader;
