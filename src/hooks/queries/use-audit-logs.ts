import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { auditService } from "@/services/audit";
import type { AuditLogListQuery } from "@/types/domain";
import { queryKeys } from "./keys";

export function useAuditLogsQuery(params?: AuditLogListQuery, enabled = true) {
  return useQuery({
    queryKey: queryKeys.auditLogs.list(params),
    queryFn: () => auditService.listAuditLogs(params),
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useAuditLogByIdQuery(id?: string) {
  return useQuery({
    queryKey: queryKeys.auditLogs.detail(id ?? ""),
    queryFn: () => auditService.getAuditLogById(id!),
    enabled: Boolean(id),
  });
}

