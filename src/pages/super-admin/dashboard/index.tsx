// src/pages/super-admin/dashboard/index.tsx
import { Outlet } from "react-router-dom";
import { SuperAdminHeader } from "../components/super-admin-header";
import { SuperAdminSidebar } from "../components/super-admin-sidebar";
import { useSidebarState } from "@/hooks/use-sidebar-state";

export function SuperAdminDashboardPage() {
  const {
    isCollapsed,
    isMobileOpen: isMobileSidebarOpen,
    setIsMobileOpen: setIsMobileSidebarOpen,
  } = useSidebarState();

  return (
    <div className="min-h-screen bg-[#eff2f5] flex flex-col font-sans text-gray-800 antialiased selection:bg-[#2e7d5b]/20 selection:text-[#2e7d5b]">
      {/* Super Admin Top Header */}
      <SuperAdminHeader
        isMobileSidebarOpen={isMobileSidebarOpen}
        onToggleMobileSidebar={() =>
          setIsMobileSidebarOpen((isCurrentlyOpen) => !isCurrentlyOpen)
        }
        isCollapsed={isCollapsed}
      />

      {/* Main Body with Sidebar + Outlet Content */}
      <div className="flex-1 w-full pl-3 sm:pl-5 lg:pl-6 pr-3 sm:pr-5 lg:pr-6 py-5 sm:py-6 flex items-start gap-6 lg:gap-8">
        {/* Desktop Left Sidebar */}
        <SuperAdminSidebar isCollapsed={isCollapsed} />

        {/* Central Content Area rendered via declarative React Router Outlet */}
        <main id="super-admin-dashboard-content" className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default SuperAdminDashboardPage;
