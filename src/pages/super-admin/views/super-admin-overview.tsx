// src/pages/super-admin/views/super-admin-overview.tsx
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { SuperAdminStatCards } from "../components/super-admin-stat-cards";
import { SuperAdminRevenueChart } from "../components/super-admin-revenue-chart";
import { SuperAdminUserGrowthChart } from "../components/super-admin-user-growth-chart";
import { SuperAdminActivityTable } from "../components/super-admin-activity-table";
import { ManagersOverviewTable } from "../components/managers-overview-table";
import {
  RecentQuotesTable,
  MOCK_RECENT_QUOTES,
  type RecentQuoteItem,
} from "@/pages/admin-shared";

import {
  useDashboardAnalyticsQuery,
  useManagersQuery,
} from "@/hooks/queries";
import { ErrorBoundary } from "@/components/app/error-boundary";
import { formatLiveDate } from "@/utils/date";
import {
  CATALOG_FULFILLMENT_BY_PERIOD,
  MOCK_ADMIN_ACTIVITIES,
  MOCK_MANAGERS,
  SUPER_ADMIN_QUOTE_VOLUME_BY_PERIOD,
} from "../dashboard/constants";
import type {
  AdminActivityItem,
  SuperAdminStatCard,
  SupervisingManagerRowItem,
} from "../dashboard/types";

export function SuperAdminOverview() {
  const navigate = useNavigate();

  // Live API queries from elpima-api (/api/v1/analytics/dashboard & /api/v1/managers)
  const { data: liveAnalytics, isLoading: isAnalyticsLoading } =
    useDashboardAnalyticsQuery();
  const { data: liveManagers } = useManagersQuery();

  const stats: SuperAdminStatCard[] = useMemo(() => {
    if (!liveAnalytics) return [];
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
          <SuperAdminStatCards
            cards={stats}
            isLoading={isAnalyticsLoading || !liveAnalytics}
          />
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
}

export default SuperAdminOverview;

