// src/pages/super-admin/components/super-admin-header.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Bell,
  Menu,
  X,
  ChevronDown,
  LogOut,
  LayoutGrid,
  Package,
  Layers,
  FileSpreadsheet,
  UserCheck,
  ImageUp,
  ClipboardList,
  ShieldCheck,
  Settings,
} from "lucide-react";
import { useAuthStore } from "@/store";
import { useSuperAdminProfile } from "@/hooks/use-super-admin-profile";
import { SUPER_ADMIN_NAV_ITEMS } from "../dashboard/constants";
import type { SuperAdminNavItem } from "../dashboard/types";
import {
  SuperAdminNotificationsModal,
  INITIAL_SUPER_ADMIN_NOTIFICATIONS,
} from "./super-admin-notifications-modal";

const NAV_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutGrid,
  Package,
  Layers,
  FileSpreadsheet,
  UserCheck,
  ImageUp,
  ClipboardList,
  ShieldCheck,
  Settings,
};

interface SuperAdminHeaderProps {
  onToggleMobileSidebar: () => void;
  isMobileSidebarOpen: boolean;
  isCollapsed?: boolean;
  currentDateLabel?: string;
}

export const SuperAdminHeader: React.FC<SuperAdminHeaderProps> = ({
  onToggleMobileSidebar,
  isMobileSidebarOpen,
  isCollapsed = false,
  currentDateLabel,
}) => {
  const navigate = useNavigate();
  const logout = useAuthStore((authState) => authState.logout);
  const profile = useSuperAdminProfile();

  const [searchQuery, setSearchQuery] = useState("");
  const [openMobileSubmenus, setOpenMobileSubmenus] = useState<
    Record<string, boolean>
  >({
    catalog: true,
  });

  const handleToggleMobileSubmenu = (menuId: string) => {
    setOpenMobileSubmenus((previousOpenState) => ({
      ...previousOpenState,
      [menuId]: !previousOpenState[menuId],
    }));
  };

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

  const handleNav = (path: string) => {
    navigate(path);
    onToggleMobileSidebar();
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white px-4 sm:px-5 lg:px-6 py-3.5 border-b border-gray-200/70">
        <div className="w-full flex items-center justify-between gap-4">
          {/* Left: hamburger (<=1124px) + brand + super-admin identity block */}
          <div className="flex items-center gap-3 min-w-0">
            <AnimatePresence>
              {isCollapsed && (
                <motion.button
                  key="super-admin-hamburger"
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
              onClick={() => navigate("/super-admin/dashboard")}
              role="button"
              tabIndex={0}
              aria-label="Go to Super Admin Dashboard"
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

            {/* Desktop: Super Admin Identity Block */}
            <div className="hidden md:block ml-4 pl-4 border-l border-gray-200">
              <h1 className="text-[#171A1F] font-semibold text-[15px] leading-tight truncate">
                {profile.name}
              </h1>
              <p className="text-[#999999] text-xs font-medium truncate">
                {profile.roleLabel}
              </p>
            </div>
          </div>

          {/* Right: search, date pill, notification bell, avatar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Input Pill */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const q = searchQuery.trim();
                if (!q) return;
                if (q.toUpperCase().startsWith("ELP-")) {
                  navigate(
                    `/super-admin/quotes?reference=${encodeURIComponent(q)}`,
                  );
                } else {
                  navigate(`/super-admin/products`);
                }
              }}
              className="hidden md:flex items-center relative text-[#408561]"
            >
              <Search className="absolute text-base left-3 w-4 h-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(changeEvent) =>
                  setSearchQuery(changeEvent.target.value)
                }
                placeholder="Search products, quotes..."
                className="bg-[#D3E5DC] outline-none text-sm placeholder:text-[#408561] text-[#171A1F] rounded-full pr-3 pl-9 h-10 w-44 lg:w-60 focus:ring-2 focus:ring-[#2e7d5b]/30 transition"
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
                onClick={() => navigate("/super-admin/security")}
                role="button"
                tabIndex={0}
                className="w-9 h-9 flex items-center justify-center bg-gray-300 rounded-full overflow-hidden shadow-2xs border border-white cursor-pointer"
                title={`${profile.name} — Security & Profile`}
              >
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile & Tablet Drawer Portal (<=1124px) */}
      <AnimatePresence mode="wait">
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 z-50 flex sidebar-drawer-portal"
            aria-modal="true"
            role="dialog"
          >
            <motion.div
              key="super-admin-mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-[2px]"
              onClick={onToggleMobileSidebar}
              aria-hidden="true"
            />
            <motion.aside
              key="super-admin-mobile-drawer"
              initial={{ x: "-105%" }}
              animate={{ x: 0 }}
              exit={{ x: "-105%", transition: { duration: 0.22 } }}
              transition={{
                type: "spring",
                damping: 27,
                stiffness: 280,
                mass: 0.75,
              }}
              className="relative my-3 ml-3 w-72 max-w-[calc(100vw-2rem)] h-[calc(100vh-1.5rem)] bg-[#101828] text-white rounded-3xl shadow-2xl z-10 flex flex-col overflow-hidden will-change-transform"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-white text-xs font-semibold truncate max-w-[140px]">
                      {profile.name}
                    </p>
                    <p className="text-white/50 text-[10px]">
                      {profile.roleLabel}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onToggleMobileSidebar}
                  className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation items in drawer */}
              <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
                {SUPER_ADMIN_NAV_ITEMS.map((navItem: SuperAdminNavItem) => {
                  const Icon = NAV_ICONS[navItem.iconName] ?? LayoutGrid;
                  const hasSub = !!navItem.subItems?.length;
                  const isSubmenuOpen = openMobileSubmenus[navItem.id] ?? false;

                  if (hasSub) {
                    return (
                      <div key={navItem.id} className="space-y-1">
                        <button
                          type="button"
                          onClick={() => handleToggleMobileSubmenu(navItem.id)}
                          className="w-full flex items-center justify-between py-2.5 px-3.5 rounded-xl text-left text-sm font-medium text-white/80 hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-[18px] h-[18px] shrink-0 text-white/80" />
                            <span>{navItem.label}</span>
                          </div>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isSubmenuOpen
                                ? "rotate-180 text-white"
                                : "text-white/60"
                            }`}
                          />
                        </button>
                        {isSubmenuOpen && (
                          <div className="ml-7 pl-3 border-l border-white/20 space-y-1 pt-1">
                            {navItem.subItems?.map((subItem) => (
                              <button
                                key={subItem.id}
                                type="button"
                                onClick={() => handleNav(subItem.path)}
                                className="w-full text-left text-xs py-1.5 px-3 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                              >
                                {subItem.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <button
                      key={navItem.id}
                      onClick={() => handleNav(navItem.path)}
                      className="w-full flex items-center gap-3 py-2.5 px-3.5 rounded-xl text-left text-sm font-medium text-white/80 hover:bg-white/10 transition-colors"
                    >
                      <Icon className="w-[18px] h-[18px] shrink-0 text-white/80" />
                      <span>{navItem.label}</span>
                    </button>
                  );
                })}
              </nav>

              <button
                onClick={() => {
                  logout();
                  navigate("/auth", { replace: true });
                }}
                className="flex items-center gap-3 px-6 py-4 text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 border-t border-white/10 cursor-pointer"
              >
                <LogOut className="w-[18px] h-[18px]" />
                <span>Logout</span>
              </button>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Super Admin Notifications Modal */}
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

export default SuperAdminHeader;

