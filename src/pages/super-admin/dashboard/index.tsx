// src/pages/super-admin/dashboard/index.tsx
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Check } from "lucide-react";

import { SuperAdminHeader } from "../components/super-admin-header";
import { SuperAdminSidebar } from "../components/super-admin-sidebar";
import { SuperAdminStatCards } from "../components/super-admin-stat-cards";
import { SuperAdminRevenueChart } from "../components/super-admin-revenue-chart";
import { SuperAdminUserGrowthChart } from "../components/super-admin-user-growth-chart";
import { SuperAdminActivityTable } from "../components/super-admin-activity-table";
import { RecentQuotesTable } from "../components/recent-quotes-table";
import { ManagersOverviewTable } from "../components/managers-overview-table";

import {
  ActivitiesModule,
  ProductsModule,
  CategoriesModule,
  SpecialtiesModule,
  QuotesModule,
  ManagersModule,
  UploadsModule,
  AuditLogsModule,
  SecurityModule,
  SettingsModule,
} from "@/pages/modules";

import {
  MOCK_SUPER_ADMIN_STATS,
  SUPER_ADMIN_QUOTE_VOLUME_BY_PERIOD,
  CATALOG_FULFILLMENT_BY_PERIOD,
  MOCK_ADMIN_ACTIVITIES,
  MOCK_RECENT_QUOTES,
  MOCK_MANAGERS,
} from "./constants";
import type {
  RecentQuoteItem,
  SupervisingManagerRowItem,
  SuperAdminStatCard,
  AdminActivityItem,
} from "./types";
import { useSidebarState } from "@/hooks/use-sidebar-state";
import { useToast } from "@/hooks/use-toast";
import {
  useDashboardAnalyticsQuery,
  useManagersQuery,
} from "@/hooks/queries";
import { ErrorBoundary } from "@/components/app/error-boundary";
import { formatLiveDate } from "@/utils/date";

export function SuperAdminDashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase();

  // Sidebar responsive state (collapses at <=1124px)
  const {
    isCollapsed,
    isMobileOpen: isMobileSidebarOpen,
    setIsMobileOpen: setIsMobileSidebarOpen,
  } = useSidebarState();

  const toast = useToast();

  // Live API queries from elpima-api (/api/v1/analytics/dashboard & /api/v1/managers)
  const { data: liveAnalytics } = useDashboardAnalyticsQuery();
  const { data: liveManagers } = useManagersQuery();

  const stats: SuperAdminStatCard[] = useMemo(() => {
    if (!liveAnalytics) return MOCK_SUPER_ADMIN_STATS;
    return [
      {
        id: "total-products",
        title: "Catalog Products",
        value: String(liveAnalytics.catalog.totalProducts),
        change: `${liveAnalytics.catalog.inStockProducts} in stock`,
        trend: "up",
        bgClass: "bg-[#cfeee1]",
        iconName: "Package",
      },
      {
        id: "total-quotes",
        title: "Quote Inquiries (RFQ)",
        value: String(liveAnalytics.quotes.total),
        change: `${liveAnalytics.quotes.byStatus?.FULFILLED ?? 0} fulfilled`,
        trend: "up",
        bgClass: "bg-[#fde2e4]",
        iconName: "FileSpreadsheet",
      },
      {
        id: "urgent-quotes",
        title: "Urgent Pending RFQs",
        value: String(liveAnalytics.quotes.urgentPending),
        change: "Requires priority dispatch",
        trend: liveAnalytics.quotes.urgentPending > 0 ? "down" : "up",
        bgClass: "bg-[#dbe4ff]",
        iconName: "AlertTriangle",
      },
      {
        id: "active-managers",
        title: "Supervising Managers",
        value: String(liveAnalytics.team.activeManagers),
        change: `${liveAnalytics.catalog.totalCategories} categories`,
        trend: "up",
        bgClass: "bg-[#d6dafa]",
        iconName: "UserCheck",
      },
    ];
  }, [liveAnalytics]);

  const activities: AdminActivityItem[] = useMemo(() => {
    if (!liveAnalytics?.audit?.recentEvents?.length) {
      return MOCK_ADMIN_ACTIVITIES;
    }
    return liveAnalytics.audit.recentEvents.map((ev, index) => ({
      id: ev.id,
      no: index + 1,
      adminName:
        ev.actor?.fullName || ev.user?.fullName || "System Admin",
      role: ev.actor?.role || ev.user?.role || "SUPER_ADMIN",
      action: ev.action,
      target: `${ev.entityType}${ev.entityId ? ` (${ev.entityId.slice(0, 8)})` : ""}`,
      date: formatLiveDate(ev.createdAt, true),
      status: "Success",
    }));
  }, [liveAnalytics]);

  const recentQuotes: RecentQuoteItem[] = useMemo(() => {
    if (!liveAnalytics?.quotes?.recent?.length) {
      return MOCK_RECENT_QUOTES;
    }
    return liveAnalytics.quotes.recent.map((q, idx) => ({
      id: q.id,
      no: idx + 1,
      reference: q.reference,
      customerName: q.customerName,
      hospitalClinic:
        q.hospitalClinic ||
        q.hospitalName ||
        q.location ||
        "Direct Hospital Inquiry",
      phone: q.customerPhone || "+2348000000000",
      priority: q.priority,
      status: q.status,
      itemsCount: q.items?.length ?? 1,
      dateCreated: formatLiveDate(q.createdAt),
    }));
  }, [liveAnalytics]);

  const managersList: SupervisingManagerRowItem[] = useMemo(() => {
    if (!liveManagers?.length) {
      return MOCK_MANAGERS;
    }
    return liveManagers.map((m, idx) => ({
      id: m.id,
      no: idx + 1,
      fullName: m.fullName,
      email: m.email,
      phone: m.phone || "N/A",
      assignedQuotesCount: m._count?.assignedQuotes ?? 0,
      lastLogin: m.lastLoginAt
        ? formatLiveDate(m.lastLoginAt, true)
        : "Never",
      accountStatus: m.isActive ? "Active" : "Suspended",
    }));
  }, [liveManagers]);

  const handleSeeAll = (section: string) => {
    if (section === "Audit Logs") {
      navigate("/super-admin/audit-logs");
    } else if (section === "Quotes") {
      navigate("/super-admin/quotes");
    } else if (section === "Managers") {
      navigate("/super-admin/managers");
    }
  };

  const handleViewQuote = (quote: RecentQuoteItem) => {
    navigate(
      `/super-admin/quotes?reference=${encodeURIComponent(quote.reference)}`,
    );
  };

  const handleViewManager = (manager: SupervisingManagerRowItem) => {
    navigate(`/super-admin/managers?id=${encodeURIComponent(manager.id)}`);
  };

  const renderActiveContent = () => {
    if (currentPath.includes("/activities")) {
      return <ActivitiesModule />;
    }
    if (currentPath.includes("/products")) {
      return <ProductsModule onToast={toast.show} />;
    }
    if (currentPath.includes("/categories")) {
      return <CategoriesModule onToast={toast.show} />;
    }
    if (currentPath.includes("/specialties")) {
      return <SpecialtiesModule onToast={toast.show} />;
    }
    if (currentPath.includes("/quotes")) {
      return <QuotesModule onToast={toast.show} />;
    }
    if (currentPath.includes("/managers")) {
      return <ManagersModule onToast={toast.show} />;
    }
    if (currentPath.includes("/uploads")) {
      return <UploadsModule onToast={toast.show} />;
    }
    if (currentPath.includes("/audit-logs")) {
      return <AuditLogsModule />;
    }
    if (currentPath.includes("/security")) {
      return <SecurityModule onToast={toast.show} />;
    }
    if (currentPath.includes("/settings")) {
      return <SettingsModule onToast={toast.show} />;
    }

    // Default: Overview Dashboard
    return (
      <>
        <div className="w-full text-center pb-4 sm:pb-6">
          <h1 className="text-2xl sm:text-[28px] font-extrabold text-[#111827] tracking-tight">
            Overview
          </h1>
        </div>

        <div className="space-y-6 sm:space-y-7">
          {/* 1. Stat Cards Row (4 pastel cards) */}
          <ErrorBoundary label="SuperAdminStatCards">
            <SuperAdminStatCards cards={stats} />
          </ErrorBoundary>

          {/* 2. Charts Row (RFQ Quote Volume & Inquiries vs Fulfilled) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
            <ErrorBoundary label="SuperAdminRevenueChart">
              <SuperAdminRevenueChart
                dataByPeriod={SUPER_ADMIN_QUOTE_VOLUME_BY_PERIOD}
                initialPeriod="Weekly"
              />
            </ErrorBoundary>

            <ErrorBoundary label="SuperAdminUserGrowthChart">
              <SuperAdminUserGrowthChart
                dataByPeriod={CATALOG_FULFILLMENT_BY_PERIOD}
                initialPeriod="Weekly"
              />
            </ErrorBoundary>
          </div>

          {/* 3. System Audit Logs & Staff Activity Table Card */}
          <ErrorBoundary label="SuperAdminActivityTable">
            <SuperAdminActivityTable
              activities={activities}
              onSeeAll={() => handleSeeAll("Audit Logs")}
            />
          </ErrorBoundary>

          {/* 4. Recent Hospital Quote Inquiries (RFQ) Table Card */}
          <ErrorBoundary label="RecentQuotesTable">
            <RecentQuotesTable
              quotes={recentQuotes}
              onSeeAll={() => handleSeeAll("Quotes")}
              onViewQuote={handleViewQuote}
            />
          </ErrorBoundary>

          {/* 5. Supervising Managers Overview Table Card */}
          <ErrorBoundary label="ManagersOverviewTable">
            <ManagersOverviewTable
              managers={managersList}
              onSeeAll={() => handleSeeAll("Managers")}
              onViewManager={handleViewManager}
            />
          </ErrorBoundary>
        </div>
      </>
    );
  };

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

      {/* Main Body with Sidebar + Active Module Content */}
      <div className="flex-1 w-full pl-3 sm:pl-5 lg:pl-6 pr-3 sm:pr-5 lg:pr-6 py-5 sm:py-6 flex items-start gap-6 lg:gap-8">
        {/* Desktop Left Sidebar */}
        <SuperAdminSidebar isCollapsed={isCollapsed} />

        {/* Central Content Area */}
        <main id="super-admin-dashboard-content" className="flex-1 min-w-0">
          {renderActiveContent()}
        </main>
      </div>

      {/* Floating Toast Feedback */}
      {toast.message && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#1e293b] text-white text-xs sm:text-sm font-medium px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 animate-in slide-in-from-bottom-5 duration-200">
          <div className="p-1 rounded-full bg-emerald-500 text-white shrink-0">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

export default SuperAdminDashboardPage;
