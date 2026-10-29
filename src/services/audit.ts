import { fetchList, fetchOne } from "@/libs/api-helpers";
import type { Page } from "@/types/api";
import type { AuditLog, AuditLogListQuery } from "@/types/domain";

export const auditService = {
  /**
   * Retrieve paginated system audit logs with optional `entityType` and `action` filters (Super-Admin only).
   */
  listAuditLogs: (params?: AuditLogListQuery): Promise<Page<AuditLog>> =>
    fetchList<AuditLog>("/api/v1/audit-logs", { params }),

  /**
   * Retrieve a single audit log entry by ID (Super-Admin only).
   */
  getAuditLogById: (id: string): Promise<AuditLog> =>
    fetchOne<AuditLog>(`/api/v1/audit-logs/${id}`),
};

