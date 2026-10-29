import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/services/analytics";
import { queryKeys } from "./keys";

export function useDashboardAnalyticsQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.analytics.dashboard(),
    queryFn: () => analyticsService.getDashboardStats(),
    enabled,
  });
}

export function useHealthCheckQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.analytics.health(),
    queryFn: () => analyticsService.getHealthStatus(),
    enabled,
    staleTime: 60 * 1000,
  });
}

