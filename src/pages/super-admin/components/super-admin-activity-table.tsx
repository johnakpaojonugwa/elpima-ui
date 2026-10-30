// src/pages/super-admin/components/super-admin-activity-table.tsx
import React, { useMemo, useState } from "react";
import {
  ArrowDownAZ,
  ArrowUpDown,
  Clock,
  Filter,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { FloatingSelect } from "@/components/app";
import type { AdminActivityItem } from "../dashboard/types";

interface SuperAdminActivityTableProps {
  activities: AdminActivityItem[];
  onSeeAll?: () => void;
}

export const SuperAdminActivityTable: React.FC<SuperAdminActivityTableProps> = ({
  activities,
  onSeeAll,
}) => {
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"latest" | "staff_asc">("latest");

  const displayedActivities = useMemo(() => {
    const filtered = activities.filter((item) => {
      if (roleFilter === "super_admin") {
        return item.role.toLowerCase().includes("super");
      }
      if (roleFilter === "manager") {
        return item.role.toLowerCase().includes("manager");
      }
      return true;
    });

    if (sortBy === "staff_asc") {
      return [...filtered].sort((firstActivity, secondActivity) =>
        firstActivity.adminName.localeCompare(secondActivity.adminName)
      );
    }
    return filtered;
  }, [activities, roleFilter, sortBy]);

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/80 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h3 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
          System Audit Logs & Staff Activity
        </h3>

        <div className="flex items-center gap-2">
          <FloatingSelect
            size="sm"
            iconOnly
            align="right"
            minWidth={195}
            menuTitle="Filter by Role"
            icon={<Filter className="w-4 h-4" />}
            isActiveFilter={roleFilter !== "all"}
            value={roleFilter}
            onChange={(val) => setRoleFilter(val)}
            options={[
              {
                value: "all",
                label: "All Staff Roles",
                icon: <Filter className="w-3.5 h-3.5" />,
              },
              {
                value: "super_admin",
                label: "Super-Admin Only",
                icon: <ShieldCheck className="w-3.5 h-3.5" />,
              },
              {
                value: "manager",
                label: "Supervising Managers",
                icon: <UserCheck className="w-3.5 h-3.5" />,
              },
            ]}
          />

          <FloatingSelect
            size="sm"
            iconOnly
            align="right"
            minWidth={195}
            menuTitle="Sort Audit Events"
            icon={<ArrowUpDown className="w-4 h-4" />}
            isActiveFilter={sortBy !== "latest"}
            value={sortBy}
            onChange={(val) => setSortBy(val as "latest" | "staff_asc")}
            options={[
              {
                value: "latest",
                label: "Latest Events First",
                icon: <Clock className="w-3.5 h-3.5" />,
              },
              {
                value: "staff_asc",
                label: "Staff Name (A - Z)",
                icon: <ArrowDownAZ className="w-3.5 h-3.5" />,
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
              <th className="py-3 px-3 font-medium">Staff / Admin</th>
              <th className="py-3 px-3 font-medium">Role</th>
              <th className="py-3 px-3 font-medium">Action</th>
              <th className="py-3 px-3 font-medium">Target Entity</th>
              <th className="py-3 px-3 font-medium">Timestamp</th>
              <th className="py-3 px-3 text-right font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100/80">
            {displayedActivities.map((activityItem) => (
              <tr
                key={activityItem.id}
                className="hover:bg-stone-50/70 transition-colors group"
              >
                <td className="py-3.5 px-3 font-bold text-stone-800">
                  {activityItem.no}
                </td>
                <td className="py-3.5 px-3 font-bold text-stone-900">
                  {activityItem.adminName}
                </td>
                <td className="py-3.5 px-3 text-stone-600 font-medium">
                  {activityItem.role}
                </td>
                <td className="py-3.5 px-3 text-stone-700 font-mono text-xs">
                  {activityItem.action}
                </td>
                <td className="py-3.5 px-3 text-stone-800 font-medium">
                  {activityItem.target}
                </td>
                <td className="py-3.5 px-3 text-stone-800 font-medium">
                  {activityItem.date}
                </td>
                <td className="py-3.5 px-3 text-right">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#d1fae5] text-[#065f46]">
                    {activityItem.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuperAdminActivityTable;

