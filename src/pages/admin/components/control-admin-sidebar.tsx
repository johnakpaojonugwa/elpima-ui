// src/pages/admin/components/control-admin-sidebar.tsx
import React, { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { LayoutGrid, LogOut } from "lucide-react";
import { useAuthStore } from "@/store";
import { CONTROL_ADMIN_NAV_ITEMS } from "../dashboard/constants";
import type { ControlAdminNavItem } from "../dashboard/types";

interface ControlAdminSidebarProps {
  isCollapsed?: boolean;
  activeTab?: string;
  onSelectTab?: (selectedTabId: string) => void;
}

export const ControlAdminSidebar: React.FC<ControlAdminSidebarProps> = ({
  isCollapsed = false,
  activeTab,
  onSelectTab,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((s) => s.logout);

  const currentPath = location.pathname.toLowerCase();

  const effectiveActiveTab = useMemo(() => {
    if (activeTab) return activeTab;
    if (
      currentPath === "/admin" ||
      currentPath === "/admin/dashboard" ||
      currentPath === "/admin/overview"
    ) {
      return "overview";
    }
    const matchedItem = CONTROL_ADMIN_NAV_ITEMS.find((navItem) =>
      currentPath.includes(navItem.id),
    );
    return matchedItem?.id ?? "overview";
  }, [currentPath, activeTab]);

  const handleNavigate = (navItem: ControlAdminNavItem) => {
    if (onSelectTab) {
      onSelectTab(navItem.id);
    }
    if (navItem.path) {
      navigate(navItem.path);
    }
  };

  return (
    <AnimatePresence initial={false}>
      {!isCollapsed && (
        <motion.aside
          id="control-admin-desktop-sidebar"
          key="control-admin-desktop-sidebar"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16, transition: { duration: 0.22 } }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="sidebar-desktop-panel flex w-64 xl:w-68 shrink-0 sticky top-22 self-start my-4 ml-4 lg:ml-6 h-[calc(100vh-6.5rem)] bg-[#101726] text-white rounded-[28px] shadow-lg flex-col overflow-hidden select-none border border-white/5"
        >
          {/* Main Navigation List */}
          <nav
            aria-label="Control Admin Navigation"
            className="flex-1 overflow-y-auto admin-sidebar-scrollbar px-3.5 py-6 space-y-1.5"
          >
            {CONTROL_ADMIN_NAV_ITEMS.map((navItem: ControlAdminNavItem) => {
              const Icon = navItem.icon ?? LayoutGrid;
              const isSelected = effectiveActiveTab === navItem.id;

              return (
                <button
                  key={navItem.id}
                  type="button"
                  onClick={() => handleNavigate(navItem)}
                  className={`w-full flex items-center justify-between gap-3.5 px-4 py-3.5 rounded-xl text-[14px] font-medium transition-all duration-150 text-left cursor-pointer ${
                    isSelected
                      ? "bg-[#232E42] text-white shadow-xs"
                      : "text-white/80 hover:bg-white/8 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-3.5 truncate">
                    <Icon
                      className={`w-5 h-5 shrink-0 ${
                        isSelected ? "text-white" : "text-white/80"
                      }`}
                    />
                    <span className="truncate tracking-tight">{navItem.label}</span>
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

          {/* Footer Logout */}
          <div className="p-3.5 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                logout();
                navigate("/auth", { replace: true });
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-[18px] h-[18px]" />
              <span>Log Out</span>
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default ControlAdminSidebar;
