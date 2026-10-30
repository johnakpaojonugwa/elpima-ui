import { useRef, useState } from "react";
import {
  ArrowUpDown,
  ArrowUpRight,
  Check,
  Clock,
  FileSpreadsheet,
  Filter,
  FolderTree,
  ImageUp,
  MoreHorizontal,
  Package,
  Search,
  Stethoscope,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FloatingPopover, FloatingSelect } from "@/components/app";
import type { ControlAdminRecentActivityRow } from "../dashboard/types";

interface ControlAdminRecentActivitiesTableProps {
  rows: ControlAdminRecentActivityRow[];
  onSeeAll?: () => void;
}

const MODULE_PATH_MAP: Record<ControlAdminRecentActivityRow["module"], string> =
  {
    Products: "/admin/products",
    Quotes: "/admin/quotes",
    Categories: "/admin/categories",
    Specialties: "/admin/specialties",
    Uploads: "/admin/uploads",
  };

export function ControlAdminRecentActivitiesTable({
  rows,
  onSeeAll,
}: ControlAdminRecentActivitiesTableProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<"latest" | "module_asc">("latest");
  const [activePopoverRow, setActivePopoverRow] =
    useState<ControlAdminRecentActivityRow | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const filtered = rows
    .filter((activityRow) => {
      if (moduleFilter !== "All" && activityRow.module !== moduleFilter)
        return false;
      if (!search.trim()) return true;
      const searchQuery = search.toLowerCase();
      return (
        activityRow.action.toLowerCase().includes(searchQuery) ||
        activityRow.reference.toLowerCase().includes(searchQuery) ||
        activityRow.module.toLowerCase().includes(searchQuery)
      );
    })
    .sort((firstRow, secondRow) => {
      if (sortOrder === "module_asc") {
        return firstRow.module.localeCompare(secondRow.module);
      }
      return 0;
    });

  return (
    <section className="rounded-[20px] bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)] sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 sm:text-base">
            Recent Catalog & Quote Operations
          </h3>
          <p className="text-xs text-slate-500">
            Live activity feed across products, categories, medical specialties,
            and quote inquiries
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(changeEvent) => setSearch(changeEvent.target.value)}
              placeholder="Filter operations..."
              className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#2E7D5B]"
            />
          </div>

          <FloatingSelect
            size="sm"
            iconOnly
            align="right"
            minWidth={195}
            menuTitle="Filter by Module"
            icon={<Filter className="w-4 h-4" />}
            isActiveFilter={moduleFilter !== "All"}
            value={moduleFilter}
            onChange={(selectedValue) => setModuleFilter(selectedValue)}
            options={[
              {
                value: "All",
                label: "All Modules",
                icon: <Filter className="w-3.5 h-3.5" />,
              },
              {
                value: "Products",
                label: "Products",
                icon: <Package className="w-3.5 h-3.5" />,
              },
              {
                value: "Quotes",
                label: "Quotes",
                icon: <FileSpreadsheet className="w-3.5 h-3.5" />,
              },
              {
                value: "Categories",
                label: "Categories",
                icon: <FolderTree className="w-3.5 h-3.5" />,
              },
              {
                value: "Specialties",
                label: "Specialties",
                icon: <Stethoscope className="w-3.5 h-3.5" />,
              },
              {
                value: "Uploads",
                label: "Uploads",
                icon: <ImageUp className="w-3.5 h-3.5" />,
              },
            ]}
          />

          <FloatingSelect
            size="sm"
            iconOnly
            align="right"
            minWidth={195}
            menuTitle="Sort Operations"
            icon={<ArrowUpDown className="w-4 h-4" />}
            isActiveFilter={sortOrder !== "latest"}
            value={sortOrder}
            onChange={(selectedValue) =>
              setSortOrder(selectedValue as "latest" | "module_asc")
            }
            options={[
              {
                value: "latest",
                label: "Newest Activity",
                icon: <Clock className="w-3.5 h-3.5" />,
              },
              {
                value: "module_asc",
                label: "Module (A - Z)",
                icon: <ArrowUpDown className="w-3.5 h-3.5" />,
              },
            ]}
          />

          <button
            type="button"
            onClick={() => (onSeeAll ? onSeeAll() : navigate("/admin/activities"))}
            className="ml-1 text-xs sm:text-sm font-semibold text-[#2E7D5B] hover:text-[#236246] transition-colors cursor-pointer"
          >
            See All
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <th className="py-3 pr-3">Operation</th>
              <th className="px-3 py-3">Module</th>
              <th className="px-3 py-3">Reference</th>
              <th className="px-3 py-3">Date & Time</th>
              <th className="px-3 py-3">Status</th>
              <th className="py-3 pl-3 text-right">Open</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filtered.map((row) => (
              <tr key={row.id} className="transition hover:bg-slate-50/70">
                <td className="py-3.5 pr-3 font-medium text-slate-900">
                  {row.action}
                </td>
                <td className="px-3 py-3.5">
                  <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                    {row.module}
                  </span>
                </td>
                <td className="px-3 py-3.5 font-mono text-[11px] text-slate-500">
                  {row.reference}
                </td>
                <td className="px-3 py-3.5 text-slate-500 whitespace-nowrap">
                  {row.timestamp}
                </td>
                <td className="px-3 py-3.5">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      row.status === "Completed"
                        ? "bg-emerald-50 text-emerald-700"
                        : row.status === "In Progress"
                          ? "bg-sky-50 text-sky-700"
                          : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="py-3.5 pl-3 text-right">
                  <button
                    type="button"
                    onClick={(clickEvent) => {
                      triggerRef.current = clickEvent.currentTarget;
                      setActivePopoverRow((currentRow) =>
                        currentRow?.id === row.id ? null : row,
                      );
                    }}
                    aria-label={`Actions for ${row.reference}`}
                    className="inline-flex items-center justify-center p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {activePopoverRow && (
        <FloatingPopover
          isOpen={Boolean(activePopoverRow)}
          onClose={() => setActivePopoverRow(null)}
          triggerRef={triggerRef}
          matchWidth={false}
          minWidth={195}
          maxWidth={230}
          align="right"
          offset={6}
          className="rounded-2xl p-2 shadow-xl border border-gray-100 bg-white select-none space-y-1"
        >
          <button
            type="button"
            onClick={() => {
              setActivePopoverRow(null);
              if (onSeeAll) {
                onSeeAll();
              } else {
                navigate("/admin/activities");
              }
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-gray-50/80 transition-colors text-left cursor-pointer text-gray-900"
          >
            <Check className="w-4 h-4 text-[#2E7D5B] stroke-[2.8] shrink-0" />
            <span className="font-semibold text-gray-900 text-xs sm:text-sm">
              View Full Details
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              const targetPath =
                MODULE_PATH_MAP[activePopoverRow.module] || "/admin/products";
              setActivePopoverRow(null);
              navigate(targetPath);
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-gray-50/80 transition-colors text-left cursor-pointer text-gray-800 text-xs sm:text-sm font-medium"
          >
            <span>Open {activePopoverRow.module}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
          </button>

          <button
            type="button"
            onClick={() => setActivePopoverRow(null)}
            className="w-full flex items-center px-3.5 py-2.5 rounded-xl hover:bg-gray-50/80 transition-colors text-left cursor-pointer text-gray-500 text-xs sm:text-sm font-medium"
          >
            <span>Close</span>
          </button>
        </FloatingPopover>
      )}
    </section>
  );
}
