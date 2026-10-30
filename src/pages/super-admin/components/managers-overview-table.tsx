// src/pages/super-admin/components/managers-overview-table.tsx
import React, { useMemo, useRef, useState } from "react";
import {
  ArrowDownAZ,
  ArrowUpDown,
  Check,
  FileSpreadsheet,
  Filter,
  MoreHorizontal,
  ShieldAlert,
  UserCheck,
} from "lucide-react";
import { FloatingPopover, FloatingSelect } from "@/components/app";
import type { SupervisingManagerRowItem } from "../dashboard/types";

interface ManagersOverviewTableProps {
  managers: SupervisingManagerRowItem[];
  onSeeAll?: () => void;
  onViewManager?: (manager: SupervisingManagerRowItem) => void;
}

export const ManagersOverviewTable: React.FC<ManagersOverviewTableProps> = ({
  managers,
  onSeeAll,
  onViewManager,
}) => {
  const [activePopoverManager, setActivePopoverManager] =
    useState<SupervisingManagerRowItem | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "Active" | "Suspended"
  >("all");
  const [sortBy, setSortBy] = useState<"default" | "name_asc" | "quotes_desc">(
    "default"
  );

  const displayedManagers = useMemo(() => {
    const filtered = managers.filter((managerItem) => {
      if (statusFilter !== "all" && managerItem.accountStatus !== statusFilter) {
        return false;
      }
      return true;
    });

    if (sortBy === "name_asc") {
      return [...filtered].sort((firstManager, secondManager) =>
        firstManager.fullName.localeCompare(secondManager.fullName)
      );
    }
    if (sortBy === "quotes_desc") {
      return [...filtered].sort(
        (firstManager, secondManager) =>
          secondManager.assignedQuotesCount - firstManager.assignedQuotesCount
      );
    }
    return filtered;
  }, [managers, statusFilter, sortBy]);

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/80 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h3 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
          Supervising Managers
        </h3>

        <div className="flex items-center gap-2">
          <FloatingSelect
            size="sm"
            iconOnly
            align="right"
            minWidth={195}
            menuTitle="Filter Status"
            icon={<Filter className="w-4 h-4" />}
            isActiveFilter={statusFilter !== "all"}
            value={statusFilter}
            onChange={(val) =>
              setStatusFilter(val as "all" | "Active" | "Suspended")
            }
            options={[
              {
                value: "all",
                label: "All Statuses",
                icon: <Filter className="w-3.5 h-3.5" />,
              },
              {
                value: "Active",
                label: "Active Only",
                icon: <UserCheck className="w-3.5 h-3.5" />,
              },
              {
                value: "Suspended",
                label: "Suspended Only",
                icon: <ShieldAlert className="w-3.5 h-3.5" />,
              },
            ]}
          />

          <FloatingSelect
            size="sm"
            iconOnly
            align="right"
            minWidth={205}
            menuTitle="Sort Managers"
            icon={<ArrowUpDown className="w-4 h-4" />}
            isActiveFilter={sortBy !== "default"}
            value={sortBy}
            onChange={(val) =>
              setSortBy(val as "default" | "name_asc" | "quotes_desc")
            }
            options={[
              {
                value: "default",
                label: "Default Order",
                icon: <ArrowUpDown className="w-3.5 h-3.5" />,
              },
              {
                value: "name_asc",
                label: "Name (A - Z)",
                icon: <ArrowDownAZ className="w-3.5 h-3.5" />,
              },
              {
                value: "quotes_desc",
                label: "Most Assigned Quotes",
                icon: <FileSpreadsheet className="w-3.5 h-3.5" />,
              },
            ]}
          />

          <button
            type="button"
            onClick={onSeeAll}
            className="ml-1 text-xs sm:text-sm font-semibold text-[#2E7D5B] hover:text-[#236246] transition-colors cursor-pointer"
          >
            See All
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[720px]">
          <thead>
            <tr className="border-b border-stone-100 text-stone-500 font-medium text-xs">
              <th className="py-3 px-3 w-12 font-medium">No</th>
              <th className="py-3 px-3 font-medium">Full Name</th>
              <th className="py-3 px-3 font-medium">Official Email</th>
              <th className="py-3 px-3 font-medium">Phone</th>
              <th className="py-3 px-3 font-medium">Assigned Quotes</th>
              <th className="py-3 px-3 font-medium">Last Login</th>
              <th className="py-3 px-3 font-medium">Status</th>
              <th className="py-3 px-3 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100/80">
            {displayedManagers.map((mgr) => (
              <tr
                key={mgr.id}
                className="hover:bg-stone-50/70 transition-colors group"
              >
                <td className="py-3.5 px-3 font-bold text-stone-800">
                  {mgr.no}
                </td>
                <td className="py-3.5 px-3 font-bold text-stone-900">
                  {mgr.fullName}
                </td>
                <td className="py-3.5 px-3 text-stone-600">{mgr.email}</td>
                <td className="py-3.5 px-3 text-stone-600 font-mono text-xs">
                  {mgr.phone}
                </td>
                <td className="py-3.5 px-3 font-bold text-stone-900">
                  {mgr.assignedQuotesCount}
                </td>
                <td className="py-3.5 px-3 text-stone-600">{mgr.lastLogin}</td>
                <td className="py-3.5 px-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      mgr.accountStatus === "Active"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {mgr.accountStatus}
                  </span>
                </td>
                <td className="py-3.5 px-3 text-right">
                  <button
                    type="button"
                    onClick={(e) => {
                      triggerRef.current = e.currentTarget;
                      setActivePopoverManager((curr) =>
                        curr?.id === mgr.id ? null : mgr
                      );
                    }}
                    aria-label={`Actions for ${mgr.fullName}`}
                    className="inline-flex items-center justify-center p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {activePopoverManager && (
        <FloatingPopover
          isOpen={Boolean(activePopoverManager)}
          onClose={() => setActivePopoverManager(null)}
          triggerRef={triggerRef}
          matchWidth={false}
          minWidth={185}
          maxWidth={220}
          align="right"
          offset={6}
          className="rounded-2xl p-2 shadow-xl border border-gray-100 bg-white select-none space-y-1"
        >
          <button
            type="button"
            onClick={() => {
              onViewManager?.(activePopoverManager);
              setActivePopoverManager(null);
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-gray-50/80 transition-colors text-left cursor-pointer text-gray-900"
          >
            <Check className="w-4 h-4 text-[#2E7D5B] stroke-[2.8] shrink-0" />
            <span className="font-semibold text-gray-900 text-xs sm:text-sm">
              View Profile
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              onSeeAll?.();
              setActivePopoverManager(null);
            }}
            className="w-full flex items-center px-3.5 py-2.5 rounded-xl hover:bg-gray-50/80 transition-colors text-left cursor-pointer text-gray-800 text-xs sm:text-sm font-medium"
          >
            <span>Manage Account</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePopoverManager(null)}
            className="w-full flex items-center px-3.5 py-2.5 rounded-xl hover:bg-gray-50/80 transition-colors text-left cursor-pointer text-gray-500 text-xs sm:text-sm font-medium"
          >
            <span>Close</span>
          </button>
        </FloatingPopover>
      )}
    </div>
  );
};

export default ManagersOverviewTable;

