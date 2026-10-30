// src/pages/super-admin/components/recent-quotes-table.tsx
import React, { useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowUpDown,
  Check,
  Clock,
  FileSpreadsheet,
  Filter,
  MoreHorizontal,
} from "lucide-react";
import { FloatingPopover, FloatingSelect } from "@/components/app";
import type { RecentQuoteItem } from "../dashboard/types";

interface RecentQuotesTableProps {
  quotes: RecentQuoteItem[];
  onSeeAll?: () => void;
  onViewQuote?: (quote: RecentQuoteItem) => void;
}

export const RecentQuotesTable: React.FC<RecentQuotesTableProps> = ({
  quotes,
  onSeeAll,
  onViewQuote,
}) => {
  const [activePopoverQuote, setActivePopoverQuote] =
    useState<RecentQuoteItem | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"default" | "urgent_first">("default");

  const displayedQuotes = useMemo(() => {
    const filtered = quotes.filter((quoteItem) => {
      if (statusFilter !== "all" && quoteItem.status !== statusFilter)
        return false;
      return true;
    });
    if (sortBy === "urgent_first") {
      return [...filtered].sort((firstQuote, secondQuote) => {
        if (
          firstQuote.priority === "URGENT" &&
          secondQuote.priority !== "URGENT"
        )
          return -1;
        if (
          secondQuote.priority === "URGENT" &&
          firstQuote.priority !== "URGENT"
        )
          return 1;
        return 0;
      });
    }
    return filtered;
  }, [quotes, statusFilter, sortBy]);

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/80 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h3 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
          Recent Hospital Quote Inquiries (RFQ)
        </h3>

        <div className="flex items-center gap-2">
          <FloatingSelect
            size="sm"
            iconOnly
            align="right"
            minWidth={195}
            menuTitle="Filter RFQ Status"
            icon={<Filter className="w-4 h-4" />}
            isActiveFilter={statusFilter !== "all"}
            value={statusFilter}
            onChange={(selectedValue) => setStatusFilter(selectedValue)}
            options={[
              {
                value: "all",
                label: "All Statuses",
                icon: <Filter className="w-3.5 h-3.5" />,
              },
              {
                value: "NEW",
                label: "NEW",
                icon: <FileSpreadsheet className="w-3.5 h-3.5" />,
              },
              {
                value: "CONTACTED",
                label: "CONTACTED",
                icon: <Clock className="w-3.5 h-3.5" />,
              },
              {
                value: "QUOTED",
                label: "QUOTED",
                icon: <FileSpreadsheet className="w-3.5 h-3.5" />,
              },
              {
                value: "FULFILLED",
                label: "FULFILLED",
                icon: <Check className="w-3.5 h-3.5" />,
              },
            ]}
          />

          <FloatingSelect
            size="sm"
            iconOnly
            align="right"
            minWidth={205}
            menuTitle="Sort Inquiries"
            icon={<ArrowUpDown className="w-4 h-4" />}
            isActiveFilter={sortBy !== "default"}
            value={sortBy}
            onChange={(selectedValue) =>
              setSortBy(selectedValue as "default" | "urgent_first")
            }
            options={[
              {
                value: "default",
                label: "Newest Inquiries First",
                icon: <Clock className="w-3.5 h-3.5" />,
              },
              {
                value: "urgent_first",
                label: "Urgent Priority First",
                icon: <AlertTriangle className="w-3.5 h-3.5" />,
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
        <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[780px]">
          <thead>
            <tr className="border-b border-stone-100 text-stone-500 font-medium text-xs">
              <th className="py-3 px-3 w-12 font-medium">No</th>
              <th className="py-3 px-3 font-medium">Reference</th>
              <th className="py-3 px-3 font-medium">Customer</th>
              <th className="py-3 px-3 font-medium">Hospital / Clinic</th>
              <th className="py-3 px-3 font-medium">Priority</th>
              <th className="py-3 px-3 font-medium">Status</th>
              <th className="py-3 px-3 font-medium">Date</th>
              <th className="py-3 px-3 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100/80">
            {displayedQuotes.map((quoteItem) => (
              <tr
                key={quoteItem.id}
                className="hover:bg-stone-50/70 transition-colors group"
              >
                <td className="py-3.5 px-3 font-bold text-stone-800">
                  {quoteItem.no}
                </td>
                <td className="py-3.5 px-3 font-mono font-bold text-stone-900">
                  {quoteItem.reference}
                </td>
                <td className="py-3.5 px-3 font-medium text-stone-800">
                  {quoteItem.customerName}
                </td>
                <td className="py-3.5 px-3 text-stone-600">
                  {quoteItem.hospitalClinic}
                </td>
                <td className="py-3.5 px-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      quoteItem.priority === "URGENT"
                        ? "bg-rose-100 text-rose-700"
                        : "bg-stone-100 text-stone-700"
                    }`}
                  >
                    {quoteItem.priority}
                  </span>
                </td>
                <td className="py-3.5 px-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      quoteItem.status === "FULFILLED"
                        ? "bg-emerald-100 text-emerald-800"
                        : quoteItem.status === "QUOTED"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {quoteItem.status}
                  </span>
                </td>
                <td className="py-3.5 px-3 text-stone-600">
                  {quoteItem.dateCreated}
                </td>
                <td className="py-3.5 px-3 text-right">
                  <button
                    type="button"
                    onClick={(clickEvent) => {
                      triggerRef.current = clickEvent.currentTarget;
                      setActivePopoverQuote((currentQuote) =>
                        currentQuote?.id === quoteItem.id ? null : quoteItem,
                      );
                    }}
                    aria-label={`Actions for quote ${quoteItem.reference}`}
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

      {activePopoverQuote && (
        <FloatingPopover
          isOpen={Boolean(activePopoverQuote)}
          onClose={() => setActivePopoverQuote(null)}
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
              onViewQuote?.(activePopoverQuote);
              setActivePopoverQuote(null);
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-gray-50/80 transition-colors text-left cursor-pointer text-gray-900"
          >
            <Check className="w-4 h-4 text-[#2E7D5B] stroke-[2.8] shrink-0" />
            <span className="font-semibold text-gray-900 text-xs sm:text-sm">
              Inspect Quote
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              onSeeAll?.();
              setActivePopoverQuote(null);
            }}
            className="w-full flex items-center px-3.5 py-2.5 rounded-xl hover:bg-gray-50/80 transition-colors text-left cursor-pointer text-gray-800 text-xs sm:text-sm font-medium"
          >
            <span>Open in RFQ Desk</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePopoverQuote(null)}
            className="w-full flex items-center px-3.5 py-2.5 rounded-xl hover:bg-gray-50/80 transition-colors text-left cursor-pointer text-gray-500 text-xs sm:text-sm font-medium"
          >
            <span>Close</span>
          </button>
        </FloatingPopover>
      )}
    </div>
  );
};

export default RecentQuotesTable;

