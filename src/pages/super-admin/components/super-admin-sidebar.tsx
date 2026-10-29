// src/pages/super-admin/components/super-admin-sidebar.tsx
import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutGrid,
  Package,
  Layers,
  FileSpreadsheet,
  UserCheck,
  ImageUp,
  ClipboardList,
  ShieldCheck,
  Settings,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/store";
import { SUPER_ADMIN_NAV_ITEMS } from "../dashboard/constants";
import type { SuperAdminNavItem } from "../dashboard/types";

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

interface SuperAdminSidebarProps {
  isCollapsed?: boolean;
  activeTab?: string;
  onSelectTab?: (tabId: string) => void;
}

export const SuperAdminSidebar: React.FC<SuperAdminSidebarProps> = ({
  isCollapsed = false,
  activeTab,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((s) => s.logout);

  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    catalog: true,
  });

  const handleToggleSubmenu = (menuId: string) => {
    setOpenSubmenus((previousOpenState) => ({
      ...previousOpenState,
      [menuId]: !previousOpenState[menuId],
    }));
  };

  const currentPath = location.pathname.toLowerCase();

  const effectiveActiveTab = useMemo(() => {
    if (activeTab) return activeTab;
    if (
      currentPath === "/super-admin" ||
      currentPath === "/super-admin/dashboard" ||
      currentPath === "/super-admin/overview"
    ) {
      return "overview";
    }
    if (
      currentPath.includes("/categories") ||
      currentPath.includes("/specialties")
    ) {
      return "catalog";
    }
    const matched = SUPER_ADMIN_NAV_ITEMS.find((item) =>
      currentPath.includes(item.id),
    );
    return matched?.id ?? "overview";
  }, [currentPath, activeTab]);

  return (
    <AnimatePresence initial={false}>
      {!isCollapsed && (
        <motion.aside
          id="super-admin-desktop-sidebar"
          key="super-admin-desktop-sidebar"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16, transition: { duration: 0.22 } }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="sidebar-desktop-panel flex w-64 xl:w-68 shrink-0 sticky top-22 self-start my-4 ml-4 lg:ml-6 h-[calc(100vh-6.5rem)] bg-[#101828] text-white rounded-[28px] shadow-lg flex-col overflow-hidden select-none border border-white/5"
        >
          {/* Main Navigation List */}
          <nav
            aria-label="Super admin navigation"
            className="flex-1 overflow-y-auto admin-sidebar-scrollbar px-3.5 py-6 space-y-1.5"
          >
            {SUPER_ADMIN_NAV_ITEMS.map(
              (navItem: SuperAdminNavItem, itemIndex: number) => {
                const Icon = NAV_ICONS[navItem.iconName] ?? LayoutGrid;
                const hasSub = !!navItem.subItems?.length;
                const isMainActive = effectiveActiveTab === navItem.id;
                const isSubmenuOpen = openSubmenus[navItem.id] ?? false;

                if (hasSub) {
                  const isAnySubActive = navItem.subItems?.some((subItem) =>
                    currentPath.includes(subItem.id),
                  );

                  return (
                    <div key={navItem.id} className="space-y-1">
                      <button
                        type="button"
                        onClick={() => handleToggleSubmenu(navItem.id)}
                        className={`w-full flex items-center justify-between py-2.5 px-3.5 rounded-xl text-left text-sm font-medium transition-all cursor-pointer ${
                          isAnySubActive || isMainActive
                            ? "text-white"
                            : "text-white/70 hover:bg-white/8 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-[18px] h-[18px] shrink-0 text-white/80" />
                          <span className="tracking-tight">
                            {navItem.label}
                          </span>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isSubmenuOpen
                              ? "rotate-180 text-white"
                              : "text-white/50"
                          }`}
                        />
                      </button>

                      {/* Submenu Tree with visual hierarchy connectors */}
                      {isSubmenuOpen && (
                        <div className="relative ml-5 pl-4 border-l border-white/20 space-y-1.5 py-1">
                          {navItem.subItems?.map((subItem) => {
                            const isSubActive = currentPath.includes(
                              subItem.id,
                            );

                            return (
                              <div
                                key={subItem.id}
                                className="relative flex items-center"
                              >
                                <span className="absolute -left-4 w-3 h-px bg-white/20" />
                                <button
                                  type="button"
                                  onClick={() => navigate(subItem.path)}
                                  className={`w-full text-left text-xs py-2 px-3 rounded-lg transition-all cursor-pointer ${
                                    isSubActive
                                      ? "bg-[#283242] text-white font-medium shadow-xs"
                                      : "text-white/60 hover:text-white hover:bg-white/5"
                                  }`}
                                >
                                  {subItem.label}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <motion.button
                    key={navItem.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.22, delay: itemIndex * 0.02 }}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(navItem.path)}
                    className={`w-full flex items-center gap-3 py-2.5 px-3.5 rounded-xl text-left text-sm font-medium transition-colors cursor-pointer ${
                      isMainActive
                        ? "bg-white/15 text-white font-semibold"
                        : "text-white/70 hover:bg-white/8 hover:text-white"
                    }`}
                  >
                    <Icon className="w-[18px] h-[18px] shrink-0 text-white/80" />
                    <span className="tracking-tight">{navItem.label}</span>
                  </motion.button>
                );
              },
            )}
          </nav>

          {/* Footer Logout */}
          <div className="p-3.5 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                logout();
                navigate("/auth", { replace: true });
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
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

export default SuperAdminSidebar;

