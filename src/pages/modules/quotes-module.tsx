import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpDown,
  Check,
  Clock,
  Download,
  Eye,
  FileSpreadsheet,
  Filter,
  MessageSquare,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react";
import {
  useDeleteQuoteMutation,
  useDownloadQuotePdfMutation,
  useManagersQuery,
  useProductsQuery,
  useQuoteOverviewStatsQuery,
  useQuotesQuery,
} from "@/hooks/queries";
import { useAuthStore } from "@/store";
import { FloatingSelect, Pagination } from "@/components/app";
import {
  CreateWalkInQuoteModal,
  QuoteDetailWorkflowModal,
} from "./quotes";
import type {
  QuoteInquiry,
  QuoteStatus,
} from "@/types/domain";
import { formatLiveDate } from "@/utils/date";

const STATUS_BADGE: Record<QuoteStatus, string> = {
  NEW: "bg-sky-50 text-sky-700 border-sky-200",
  CONTACTED: "bg-amber-50 text-amber-700 border-amber-200",
  QUOTED: "bg-indigo-50 text-indigo-700 border-indigo-200",
  FULFILLED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-rose-50 text-rose-700 border-rose-200",
};

interface QuotesModuleProps {
  onToast?: (message: string) => void;
}

export const QuotesModule: React.FC<QuotesModuleProps> = ({ onToast }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const userRole = useAuthStore((s) => s.user?.role) ?? "SUPERVISING_MANAGER";
  const isSuperAdmin = userRole === "SUPER_ADMIN";
  const basePortalPath = isSuperAdmin ? "/super-admin" : "/admin";

  // Query Filters & Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [search, setSearch] = useState(searchParams.get("reference") ?? "");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "urgent_first">(
    "newest",
  );

  // Live API Queries
  const {
    data: quotesRes,
    isLoading,
    isFetching,
    refetch,
  } = useQuotesQuery({
    page,
    limit,
    search: search.trim() || undefined,
    status: statusFilter || undefined,
    priority: priorityFilter || undefined,
  });

  const { data: statsOverview } = useQuoteOverviewStatsQuery();
  const { data: managers = [] } = useManagersQuery(isSuperAdmin);
  const { data: productsRes } = useProductsQuery({ limit: 50 });

  // Mutations
  const deleteQuote = useDeleteQuoteMutation();
  const downloadPdf = useDownloadQuotePdfMutation();

  // Active modals
  const [selectedQuote, setSelectedQuote] = useState<QuoteInquiry | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const rawQuotes = quotesRes?.items ?? [];
  const meta = quotesRes?.pagination;
  const availableProducts = productsRes?.items ?? [];

  const sortedQuotes = useMemo(() => {
    const list = [...rawQuotes];
    return list.sort((a, b) => {
      if (sortBy === "urgent_first") {
        if (a.priority === "URGENT" && b.priority !== "URGENT") return -1;
        if (b.priority === "URGENT" && a.priority !== "URGENT") return 1;
      }
      if (sortBy === "oldest") {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [rawQuotes, sortBy]);

  // Open quote modal automatically if URL has ?reference=...
  useEffect(() => {
    const refParam = searchParams.get("reference");
    if (refParam && rawQuotes.length > 0 && !selectedQuote) {
      const matched = rawQuotes.find(
        (quoteItem) =>
          quoteItem.reference.toLowerCase() === refParam.toLowerCase(),
      );
      if (matched) {
        openQuoteModal(matched);
      }
    }
  }, [searchParams, rawQuotes]);

  const openQuoteModal = (quote: QuoteInquiry) => {
    setSelectedQuote(quote);
  };

  const handleDeleteQuote = async (quote: QuoteInquiry) => {
    try {
      await deleteQuote.mutateAsync(quote.id);
      if (selectedQuote?.id === quote.id) {
        setSelectedQuote(null);
      }
      onToast?.(`Deleted quote ${quote.reference}`);
    } catch (mutationError: any) {
      onToast?.(mutationError?.normalizedMessage || "Failed to delete quote");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-gray-100 space-y-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(`${basePortalPath}/dashboard`)}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#2E7D5B] hover:text-[#236246] transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Overview Dashboard</span>
          </button>

          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
            Full RFQ Inquiries Directory ({sortedQuotes.length} shown)
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2E7D5B]/10 text-[#2E7D5B] flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                Hospital Quote Inquiries (RFQ Desk) — Full Details
              </h1>
              <p className="text-xs text-gray-500">
                Review B2B surgical equipment quote requests, dispatch WhatsApp
                proformas, and track fulfillment
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 cursor-pointer"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2E7D5B] hover:bg-[#256649] text-xs font-bold text-white shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Log Hospital RFQ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Status KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          {
            label: "Total Inquiries",
            val: statsOverview?.total ?? meta?.total ?? rawQuotes.length,
            filter: "",
            tone: "text-gray-900",
          },
          {
            label: "New RFQs",
            val:
              statsOverview?.NEW ??
              rawQuotes.filter((quoteItem) => quoteItem.status === "NEW").length,
            filter: "NEW",
            tone: "text-sky-700",
          },
          {
            label: "Contacted",
            val:
              statsOverview?.CONTACTED ??
              rawQuotes.filter((quoteItem) => quoteItem.status === "CONTACTED").length,
            filter: "CONTACTED",
            tone: "text-amber-700",
          },
          {
            label: "Quoted",
            val:
              statsOverview?.QUOTED ??
              rawQuotes.filter((quoteItem) => quoteItem.status === "QUOTED").length,
            filter: "QUOTED",
            tone: "text-indigo-700",
          },
          {
            label: "Fulfilled",
            val:
              statsOverview?.FULFILLED ??
              rawQuotes.filter((quoteItem) => quoteItem.status === "FULFILLED").length,
            filter: "FULFILLED",
            tone: "text-emerald-700",
          },
          {
            label: "Urgent Pending",
            val:
              statsOverview?.urgentPending ??
              rawQuotes.filter((quoteItem) => quoteItem.priority === "URGENT").length,
            filter: "URGENT_PRIORITY",
            tone: "text-rose-600",
          },
        ].map((card) => (
          <button
            key={card.label}
            type="button"
            onClick={() => {
              if (card.filter === "URGENT_PRIORITY") {
                setPriorityFilter((currentPriority) =>
                  currentPriority === "URGENT" ? "" : "URGENT",
                );
              } else {
                setStatusFilter(card.filter);
              }
              setPage(1);
            }}
            className={`text-left bg-white p-3.5 rounded-2xl border transition cursor-pointer ${
              (card.filter && statusFilter === card.filter) ||
              (card.filter === "URGENT_PRIORITY" && priorityFilter === "URGENT")
                ? "border-[#2E7D5B] ring-2 ring-[#2E7D5B]/20"
                : "border-gray-100 hover:border-gray-200"
            }`}
          >
            <p className="text-[11px] font-semibold text-gray-500">
              {card.label}
            </p>
            <p className={`text-xl font-extrabold mt-1 ${card.tone}`}>
              {card.val}
            </p>
          </button>
        ))}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-100 grid grid-cols-1 md:grid-cols-5 gap-3">
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(changeEvent) => {
              setSearch(changeEvent.target.value);
              if (searchParams.get("reference")) {
                setSearchParams({});
              }
              setPage(1);
            }}
            placeholder="Search by RFQ reference (ELP-...), hospital, doctor, or phone..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#2E7D5B]"
          />
        </div>

        <FloatingSelect
          value={statusFilter}
          onChange={(selectedValue) => {
            setStatusFilter(selectedValue);
            setPage(1);
          }}
          menuTitle="Filter by RFQ Status"
          icon={<Filter className="w-3.5 h-3.5" />}
          isActiveFilter={Boolean(statusFilter)}
          matchWidth
          className="w-full text-xs"
          options={[
            {
              value: "",
              label: "All Statuses",
              icon: <Filter className="w-3.5 h-3.5" />,
            },
            {
              value: "NEW",
              label: "Status: NEW",
              icon: <FileSpreadsheet className="w-3.5 h-3.5" />,
            },
            {
              value: "CONTACTED",
              label: "Status: CONTACTED",
              icon: <MessageSquare className="w-3.5 h-3.5" />,
            },
            {
              value: "QUOTED",
              label: "Status: QUOTED",
              icon: <FileSpreadsheet className="w-3.5 h-3.5" />,
            },
            {
              value: "FULFILLED",
              label: "Status: FULFILLED",
              icon: <Check className="w-3.5 h-3.5" />,
            },
            {
              value: "CANCELLED",
              label: "Status: CANCELLED",
              icon: <X className="w-3.5 h-3.5" />,
            },
          ]}
        />

        <FloatingSelect
          value={priorityFilter}
          onChange={(selectedValue) => {
            setPriorityFilter(selectedValue);
            setPage(1);
          }}
          menuTitle="Filter by Priority"
          icon={<SlidersHorizontal className="w-3.5 h-3.5" />}
          isActiveFilter={Boolean(priorityFilter)}
          matchWidth
          className="w-full text-xs"
          options={[
            {
              value: "",
              label: "All Priorities",
              icon: <SlidersHorizontal className="w-3.5 h-3.5" />,
            },
            {
              value: "URGENT",
              label: "Priority: URGENT",
              icon: <AlertTriangle className="w-3.5 h-3.5" />,
            },
            {
              value: "STANDARD",
              label: "Priority: STANDARD",
              icon: <Check className="w-3.5 h-3.5" />,
            },
          ]}
        />

        <FloatingSelect
          value={sortBy}
          onChange={(selectedValue) => setSortBy(selectedValue as any)}
          menuTitle="Sort Quotes"
          icon={<ArrowUpDown className="w-3.5 h-3.5" />}
          isActiveFilter={sortBy !== "newest"}
          align="right"
          matchWidth
          className="w-full text-xs"
          options={[
            {
              value: "newest",
              label: "Newest First",
              icon: <Clock className="w-3.5 h-3.5" />,
            },
            {
              value: "urgent_first",
              label: "Urgent Priority First",
              icon: <AlertTriangle className="w-3.5 h-3.5" />,
            },
            {
              value: "oldest",
              label: "Oldest First",
              icon: <Clock className="w-3.5 h-3.5" />,
            },
          ]}
        />
      </div>

      {/* Quotes Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[940px] text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/70 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                <th className="py-3.5 pl-5 pr-3">Reference</th>
                <th className="py-3.5 px-3">Customer & Facility</th>
                <th className="py-3.5 px-3">Items</th>
                <th className="py-3.5 px-3">Priority</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Assigned Manager</th>
                <th className="py-3.5 px-3">Date</th>
                <th className="py-3.5 pl-3 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    Loading live quote inquiries...
                  </td>
                </tr>
              ) : sortedQuotes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    No quote inquiries matched your filter criteria.
                  </td>
                </tr>
              ) : (
                sortedQuotes.map((quote) => (
                  <tr
                    key={quote.id}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="py-3.5 pl-5 pr-3 font-mono font-bold text-[#2E7D5B]">
                      {quote.reference}
                    </td>

                    <td className="py-3.5 px-3">
                      <p className="font-bold text-gray-900">
                        {quote.customerName}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {quote.hospitalClinic ||
                          quote.hospitalName ||
                          quote.location ||
                          "Direct Facility"}
                      </p>
                      <p className="text-[10px] font-mono text-gray-400">
                        {quote.customerPhone}
                      </p>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px]">
                        {quote.items?.length ?? 1} item(s)
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          quote.priority === "URGENT"
                            ? "bg-rose-50 text-rose-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {quote.priority === "URGENT" && (
                          <AlertTriangle className="w-3 h-3" />
                        )}
                        {quote.priority}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          STATUS_BADGE[quote.status] ??
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {quote.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-gray-600">
                      {quote.assignedTo?.fullName || (
                        <span className="text-gray-400 italic">Unassigned</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-gray-500 whitespace-nowrap">
                      {formatLiveDate(quote.createdAt, true)}
                    </td>

                    <td className="py-3.5 pl-3 pr-5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openQuoteModal(quote)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#2E7D5B]/10 text-[#2E7D5B] hover:bg-[#2E7D5B] hover:text-white font-bold transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Manage</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => downloadPdf.mutate(quote.reference)}
                          className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
                          title="Download Proforma PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        {isSuperAdmin && (
                          <button
                            type="button"
                            onClick={() => handleDeleteQuote(quote)}
                            className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                            title="Delete Quote"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
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

      {/* ================= QUOTE DETAIL & WORKFLOW MODAL ================= */}
      <QuoteDetailWorkflowModal
        quote={selectedQuote}
        isSuperAdmin={isSuperAdmin}
        managers={managers}
        onClose={() => setSelectedQuote(null)}
        onToast={onToast}
      />

      {/* ================= CREATE MANUAL / WALK-IN RFQ MODAL ================= */}
      <CreateWalkInQuoteModal
        isOpen={isCreateOpen}
        availableProducts={availableProducts}
        onClose={() => setIsCreateOpen(false)}
        onToast={onToast}
      />
    </div>
  );
};

export default QuotesModule;

