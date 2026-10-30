// src/pages/admin/dashboard/index.tsx
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Check,
  FileSpreadsheet,
  FolderTree,
  ImageUp,
  Package,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { ControlAdminHeader } from "../components/control-admin-header";
import { ControlAdminQuoteVolumeChart } from "../components/control-admin-quote-volume-chart";
import { ControlAdminRecentActivitiesTable } from "../components/control-admin-recent-activities-table";
import { ControlAdminSidebar } from "../components/control-admin-sidebar";
import { ControlAdminStatCards } from "../components/control-admin-stat-cards";
import { ControlAdminStockStatsChart } from "../components/control-admin-stock-stats-chart";
import { RecentQuotesTable } from "@/pages/super-admin/components/recent-quotes-table";
import { MOCK_RECENT_QUOTES } from "@/pages/super-admin/dashboard/constants";
import type { RecentQuoteItem } from "@/pages/super-admin/dashboard/types";

import {
  ActivitiesModule,
  ProductsModule,
  CategoriesModule,
  SpecialtiesModule,
  QuotesModule,
  UploadsModule,
  SecurityModule,
} from "@/pages/modules";

import { useSidebarState } from "@/hooks/use-sidebar-state";
import { useToast } from "@/hooks/use-toast";
import { ErrorBoundary } from "@/components/app/error-boundary";
import {
  useCategoriesQuery,
  useDashboardAnalyticsQuery,
} from "@/hooks/queries";
import { formatLiveDate } from "@/utils/date";
import {
  CONTROL_ADMIN_QUOTE_VOLUME,
  CONTROL_ADMIN_RECENT_ACTIVITIES,
  CONTROL_ADMIN_STATS,
  CONTROL_ADMIN_STOCK_BY_CATEGORY,
} from "./constants";
import type {
  ControlAdminRecentActivityRow,
  ControlAdminRole,
  ControlAdminStatCard,
  ControlAdminStockPoint,
} from "./types";

export function ControlAdminDashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase();
  const toast = useToast();

  const {
    isCollapsed,
    isMobileOpen: isMobileSidebarOpen,
    setIsMobileOpen: setIsMobileSidebarOpen,
  } = useSidebarState();

  const [selectedRole, setSelectedRole] =
    useState<ControlAdminRole>("Catalog Ops");
  const { data: liveAnalytics } = useDashboardAnalyticsQuery();
  const { data: liveCategories = [] } = useCategoriesQuery();

  const stats: ControlAdminStatCard[] = useMemo(() => {
    if (!liveAnalytics) return CONTROL_ADMIN_STATS;
    return [
      {
        id: "active-products",
        label: "Active Catalog SKUs",
        value: String(liveAnalytics.catalog.totalProducts),
        change: "9.4%",
        direction: "up",
        comparisonText: `${liveAnalytics.catalog.inStockProducts} in stock`,
        icon: Package,
      },
      {
        id: "open-quotes",
        label: "Pending Quote Inquiries",
        value: String(liveAnalytics.quotes.total),
        change: "14.2%",
        direction: "up",
        comparisonText: `${liveAnalytics.quotes.urgentPending} urgent inquiries`,
        icon: FileSpreadsheet,
      },
      {
        id: "categories-count",
        label: "Active Categories",
        value: String(liveAnalytics.catalog.totalCategories),
        change: "2.1%",
        direction: "up",
        comparisonText: `Across ${liveAnalytics.catalog.totalSpecialties} specialties`,
        icon: FolderTree,
      },
      {
        id: "media-assets",
        label: "Featured Medical SKUs",
        value: String(liveAnalytics.catalog.featuredProducts),
        change: "6.8%",
        direction: "up",
        comparisonText: "Cloudinary CDN synced",
        icon: ImageUp,
      },
    ];
  }, [liveAnalytics]);

  const liveStockByCategory: ControlAdminStockPoint[] = useMemo(() => {
    if (!liveCategories.length) return CONTROL_ADMIN_STOCK_BY_CATEGORY;
    return liveCategories.slice(0, 6).map((categoryItem) => ({
      category:
        categoryItem.name.length > 18
          ? `${categoryItem.name.slice(0, 18)}…`
          : categoryItem.name,
      inStock: Math.max(1, categoryItem._count?.products ?? 4),
      lowStock: 0,
    }));
  }, [liveCategories]);

  const liveRecentActivities: ControlAdminRecentActivityRow[] = useMemo(() => {
    if (
      !liveAnalytics?.quotes?.recent?.length &&
      !liveAnalytics?.audit?.recentEvents?.length
    ) {
      return CONTROL_ADMIN_RECENT_ACTIVITIES;
    }

    const fromQuotes: ControlAdminRecentActivityRow[] = (
      liveAnalytics.quotes?.recent ?? []
    ).map((quoteItem) => ({
      id: `q-${quoteItem.id}`,
      action: `Hospital RFQ from ${quoteItem.customerName} (${quoteItem.hospitalClinic || quoteItem.hospitalName || "Direct Facility"})`,
      module: "Quotes",
      reference: quoteItem.reference,
      actor: quoteItem.customerName,
      timestamp: formatLiveDate(quoteItem.createdAt, true),
      status:
        quoteItem.status === "FULFILLED"
          ? "Completed"
          : quoteItem.status === "NEW"
            ? "Pending Review"
            : "In Progress",
    }));

    const fromAudit: ControlAdminRecentActivityRow[] = (
      liveAnalytics.audit?.recentEvents ?? []
    ).map((ev) => ({
      id: `ev-${ev.id}`,
      action: `${ev.action} on ${ev.entityType}`,
      module:
        ev.entityType === "quote"
          ? "Quotes"
          : ev.entityType === "category"
            ? "Categories"
            : ev.entityType === "specialty"
              ? "Specialties"
              : "Products",
      reference: ev.entityId ? ev.entityId.slice(0, 12) : "SYSTEM",
      actor: ev.actor?.fullName || ev.user?.fullName || "Manager Desk",
      timestamp: formatLiveDate(ev.createdAt, true),
      status: "Completed",
    }));

    const combined = [...fromQuotes, ...fromAudit];
    return combined.length > 0 ? combined : CONTROL_ADMIN_RECENT_ACTIVITIES;
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

  const handleSelectRole = (targetRole: ControlAdminRole) => {
    setSelectedRole(targetRole);
    toast.show(`Switched to Supervising Manager (${targetRole}) view`);
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
    if (currentPath.includes("/uploads")) {
      return <UploadsModule onToast={toast.show} />;
    }
    if (currentPath.includes("/security")) {
      return <SecurityModule onToast={toast.show} />;
    }

    return (
      <>
        {/* Header row: Centered "Overview" + Role Focus Switch Toggle */}
        <div className="relative w-full flex flex-col sm:flex-row items-center justify-center pb-5 sm:pb-6">
          <h1 className="text-2xl sm:text-[28px] font-extrabold text-[#111827] tracking-tight text-center">
            Overview
          </h1>

          <div className="mt-3 sm:mt-0 sm:absolute sm:right-0 inline-flex items-center p-1 bg-white border border-gray-200/90 shadow-xs rounded-full gap-1">
            <button
              type="button"
              onClick={() => handleSelectRole("Catalog Ops")}
              aria-pressed={selectedRole === "Catalog Ops"}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                selectedRole === "Catalog Ops"
                  ? "bg-[#2E7D5B] text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Catalog Ops</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectRole("Quote Desk")}
              aria-pressed={selectedRole === "Quote Desk"}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                selectedRole === "Quote Desk"
                  ? "bg-[#2E7D5B] text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Quote Desk</span>
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedRole}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="space-y-6 sm:space-y-7"
          >
            {/* 1. Stat Cards Row */}
            <ErrorBoundary label="ControlAdminStatCards">
              <ControlAdminStatCards cards={stats} />
            </ErrorBoundary>

            {/* 2. Recent Activities Table */}
            <ErrorBoundary label="ControlAdminRecentActivitiesTable">
              <ControlAdminRecentActivitiesTable
                rows={liveRecentActivities}
                onSeeAll={() => navigate("/admin/activities")}
              />
            </ErrorBoundary>

            {/* 3. Recent Hospital Quote Inquiries (RFQ) Table */}
            <ErrorBoundary label="RecentQuotesTable">
              <RecentQuotesTable
                quotes={recentQuotes}
                onSeeAll={() => navigate("/admin/quotes")}
                onViewQuote={(quote) =>
                  navigate(
                    `/admin/quotes?reference=${encodeURIComponent(
                      quote.reference
                    )}`
                  )
                }
              />
            </ErrorBoundary>

            {/* 4. Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
              <ErrorBoundary label="ControlAdminQuoteVolumeChart">
                <ControlAdminQuoteVolumeChart
                  data={CONTROL_ADMIN_QUOTE_VOLUME}
                />
              </ErrorBoundary>

              <ErrorBoundary label="ControlAdminStockStatsChart">
                <ControlAdminStockStatsChart data={liveStockByCategory} />
              </ErrorBoundary>
            </div>
          </motion.div>
        </AnimatePresence>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-[#eff2f5] flex flex-col font-sans text-gray-800 antialiased selection:bg-[#2e7d5b]/20 selection:text-[#2e7d5b]">
      {/* Control Admin Header */}
      <ControlAdminHeader
        isMobileSidebarOpen={isMobileSidebarOpen}
        onToggleMobileSidebar={() =>
          setIsMobileSidebarOpen((isCurrentlyOpen) => !isCurrentlyOpen)
        }
        isCollapsed={isCollapsed}
        selectedRole={selectedRole}
      />

      {/* Main Body with Sidebar + Active Module Content */}
      <div className="flex-1 w-full pl-3 sm:pl-5 lg:pl-6 pr-3 sm:pr-5 lg:pr-6 py-5 sm:py-6 flex items-start gap-6 lg:gap-8">
        {/* Desktop Left Sidebar */}
        <ControlAdminSidebar isCollapsed={isCollapsed} />

        {/* Central Content Area */}
        <main id="control-admin-dashboard-content" className="flex-1 min-w-0">
          {renderActiveContent()}
        </main>
      </div>

      {/* Floating Toast Notification */}
      {toast.message && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#1e293b] text-white text-xs sm:text-sm font-medium px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 animate-in slide-in-from-bottom-5 duration-200">
          <div className="p-1 rounded-full bg-[#2E7D5B] text-white shrink-0">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

export default ControlAdminDashboardPage;
