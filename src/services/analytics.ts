import { fetchOne } from "@/libs/api-helpers";
import type { HealthCheckResponse } from "@/types/api";
import type { DashboardAnalytics } from "@/types/domain";

export const analyticsService = {
  /**
   * Retrieve aggregated catalog, quote, team, and audit KPIs for the Admin/Manager dashboard.
   */
  getDashboardStats: (): Promise<DashboardAnalytics> =>
    fetchOne<DashboardAnalytics>("/api/v1/analytics/dashboard"),

  /**
   * Check API server health status (`/health`).
   */
  getHealthStatus: (): Promise<HealthCheckResponse> =>
    fetchOne<HealthCheckResponse>("/health"),
};

