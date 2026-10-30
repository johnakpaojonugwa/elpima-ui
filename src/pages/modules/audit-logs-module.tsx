import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpDown,
  ClipboardList,
  Clock,
  Eye,
  Filter,
  RefreshCw,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { useAuditLogsQuery } from "@/hooks/queries";
import { FloatingSelect, Pagination } from "@/components/app";
import type { AuditLog } from "@/types/domain";
import { formatLiveDate } from "@/utils/date";

export const AuditLogsModule: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit] = useState(25);
  const [entityType, setEntityType] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const {
    data: auditRes,
    isLoading,
    isFetching,
    refetch,
  } = useAuditLogsQuery({
    page,
    limit,
    entityType: entityType || undefined,
    action: actionFilter || undefined,
  });

  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const rawLogs = auditRes?.items ?? [];
  const meta = auditRes?.pagination;

  const filteredLogs = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = rawLogs.filter((log) => {
      if (!q) return true;
      const actorName = (
        log.actor?.fullName ||
        log.user?.fullName ||
        "System"
      ).toLowerCase();
      return (
        log.action.toLowerCase().includes(q) ||
        log.entityType.toLowerCase().includes(q) ||
        (log.entityId ?? "").toLowerCase().includes(q) ||
        actorName.includes(q) ||
        (log.ipAddress ?? "").toLowerCase().includes(q)
      );
    });

    return list.sort((a, b) => {
      if (sortOrder === "oldest") {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [rawLogs, search, sortOrder]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-gray-100 space-y-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/super-admin/dashboard")}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#2E7D5B] hover:text-[#236246] transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Overview Dashboard</span>
          </button>

          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
            Full Audit Log ({meta?.total ?? filteredLogs.length} events)
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2E7D5B]/10 text-[#2E7D5B] flex items-center justify-center">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                Immutable System Audit Trail — Full Details
              </h1>
              <p className="text-xs text-gray-500">
                Trace every administrative mutation, login, quote assignment,
                and stock update with IP & actor metadata
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`}
            />
            <span>Refresh Logs</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-100 grid grid-cols-1 md:grid-cols-5 gap-3">
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by actor name, action, entity ID, or IP address..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#2E7D5B]"
          />
        </div>

        <FloatingSelect
          value={entityType}
          onChange={(val) => {
            setEntityType(val);
            setPage(1);
          }}
          menuTitle="Filter by Entity Type"
          icon={<Filter className="w-3.5 h-3.5" />}
          isActiveFilter={Boolean(entityType)}
          matchWidth
          className="w-full text-xs"
          options={[
            {
              value: "",
              label: "All Entity Types",
              icon: <Filter className="w-3.5 h-3.5" />,
            },
            {
              value: "product",
              label: "Entity: product",
              icon: <ClipboardList className="w-3.5 h-3.5" />,
            },
            {
              value: "quote",
              label: "Entity: quote",
              icon: <ClipboardList className="w-3.5 h-3.5" />,
            },
            {
              value: "category",
              label: "Entity: category",
              icon: <ClipboardList className="w-3.5 h-3.5" />,
            },
            {
              value: "specialty",
              label: "Entity: specialty",
              icon: <ClipboardList className="w-3.5 h-3.5" />,
            },
            {
              value: "user",
              label: "Entity: user",
              icon: <ClipboardList className="w-3.5 h-3.5" />,
            },
            {
              value: "settings",
              label: "Entity: settings",
              icon: <ClipboardList className="w-3.5 h-3.5" />,
            },
          ]}
        />

        <input
          type="text"
          value={actionFilter}
          onChange={(e) => {
            setActionFilter(e.target.value);
            setPage(1);
          }}
          placeholder="Filter action (e.g. CREATE_PRODUCT)"
          className="px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-mono"
        />

        <FloatingSelect
          value={sortOrder}
          onChange={(val) => setSortOrder(val as "newest" | "oldest")}
          menuTitle="Sort Audit Events"
          icon={<ArrowUpDown className="w-3.5 h-3.5" />}
          isActiveFilter={sortOrder !== "newest"}
          align="right"
          matchWidth
          className="w-full text-xs"
          options={[
            {
              value: "newest",
              label: "Newest Events First",
              icon: <Clock className="w-3.5 h-3.5" />,
            },
            {
              value: "oldest",
              label: "Oldest Events First",
              icon: <Clock className="w-3.5 h-3.5" />,
            },
          ]}
        />
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/70 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                <th className="py-3.5 pl-5 pr-3">Timestamp</th>
                <th className="py-3.5 px-3">Actor & Role</th>
                <th className="py-3.5 px-3">Action</th>
                <th className="py-3.5 px-3">Entity</th>
                <th className="py-3.5 px-3">IP Address</th>
                <th className="py-3.5 pl-3 pr-5 text-right">Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    Loading immutable audit logs...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    No audit log events matched your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const actorName =
                    log.actor?.fullName ||
                    log.user?.fullName ||
                    "System / Public";
                  const actorRole =
                    log.actor?.role ||
                    log.user?.role ||
                    log.actorRole ||
                    "SYSTEM";

                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-gray-50/80 transition-colors"
                    >
                      <td className="py-3.5 pl-5 pr-3 text-gray-500 whitespace-nowrap font-mono text-[11px]">
                        {formatLiveDate(log.createdAt, true)}
                      </td>

                      <td className="py-3.5 px-3">
                        <p className="font-bold text-gray-900">{actorName}</p>
                        <span className="inline-flex px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold">
                          {actorRole}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-mono text-[11px] font-bold">
                          {log.action}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <p className="font-semibold text-gray-800 uppercase text-[11px]">
                          {log.entityType}
                        </p>
                        <p className="font-mono text-[10px] text-gray-400 truncate max-w-[160px]">
                          {log.entityId || "—"}
                        </p>
                      </td>

                      <td className="py-3.5 px-3 font-mono text-[11px] text-gray-500">
                        {log.ipAddress || "127.0.0.1"}
                      </td>

                      <td className="py-3.5 pl-3 pr-5 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedLog(log)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 font-semibold text-gray-700 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && (meta.totalPages ?? meta.pages ?? 1) > 1 && (
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/40">
            <Pagination
              currentPage={page}
              totalPages={meta.totalPages ?? meta.pages ?? 1}
              onPageChange={(targetPage) => setPage(targetPage)}
              className="pt-0"
            />
          </div>
        )}
      </div>

      {/* Audit Metadata Inspector Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-gray-200 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#2E7D5B]" />
                <h3 className="text-base font-extrabold text-gray-900">
                  Audit Event Details
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3.5 rounded-xl">
              <div>
                <p className="text-[10px] font-bold uppercase text-gray-400">
                  Action
                </p>
                <p className="font-mono font-bold text-gray-900">
                  {selectedLog.action}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-gray-400">
                  Timestamp
                </p>
                <p className="font-semibold text-gray-900">
                  {formatLiveDate(selectedLog.createdAt, true)}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-gray-400">
                  Actor
                </p>
                <p className="font-semibold text-gray-900">
                  {selectedLog.actor?.fullName ||
                    selectedLog.user?.fullName ||
                    "System"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-gray-400">
                  Entity
                </p>
                <p className="font-mono text-gray-800">
                  {selectedLog.entityType} ({selectedLog.entityId || "N/A"})
                </p>
              </div>
            </div>

            <div>
              <p className="font-bold text-gray-700 uppercase mb-1.5">
                Event Metadata (JSON)
              </p>
              <pre className="p-3.5 rounded-xl bg-slate-900 text-emerald-300 font-mono text-[11px] overflow-x-auto max-h-64">
                {JSON.stringify(selectedLog.metadata ?? {}, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-xl bg-gray-900 text-white font-bold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogsModule;

