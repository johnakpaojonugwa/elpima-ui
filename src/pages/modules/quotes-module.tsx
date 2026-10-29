import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpDown,
  Check,
  Clock,
  Download,
  ExternalLink,
  Eye,
  FileSpreadsheet,
  Filter,
  MessageSquare,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Trash2,
  UserCheck,
  X,
} from "lucide-react";
import {
  useAssignQuoteMutation,
  useCreateQuoteMutation,
  useDeleteQuoteMutation,
  useDownloadQuotePdfMutation,
  useManagersQuery,
  useProductsQuery,
  useQuoteOverviewStatsQuery,
  useQuotesQuery,
  useUpdateQuoteStatusMutation,
} from "@/hooks/queries";
import { useAuthStore } from "@/store";
import { FloatingSelect } from "@/components/app";
import type {
  QuoteInquiry,
  QuotePriority,
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
  const updateStatus = useUpdateQuoteStatusMutation();
  const assignQuote = useAssignQuoteMutation();
  const deleteQuote = useDeleteQuoteMutation();
  const downloadPdf = useDownloadQuotePdfMutation();
  const createQuote = useCreateQuoteMutation();

  // Active modals
  const [selectedQuote, setSelectedQuote] = useState<QuoteInquiry | null>(null);
  const [statusInput, setStatusInput] = useState<QuoteStatus>("CONTACTED");
  const [adminNotesInput, setAdminNotesInput] = useState("");
  const [assignedManagerId, setAssignedManagerId] = useState("");

  // Create Walk-in / Manual RFQ Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("+234");
  const [customerEmail, setCustomerEmail] = useState("");
  const [hospitalClinic, setHospitalClinic] = useState("");
  const [location, setLocation] = useState("Lagos, Nigeria");
  const [priority, setPriority] = useState<QuotePriority>("STANDARD");
  const [customerNotes, setCustomerNotes] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedQty, setSelectedQty] = useState(1);
  const [createError, setCreateError] = useState("");

  const rawQuotes = quotesRes?.items ?? [];
  const meta = quotesRes?.meta;
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
        (q) => q.reference.toLowerCase() === refParam.toLowerCase(),
      );
      if (matched) {
        openQuoteModal(matched);
      }
    }
  }, [searchParams, rawQuotes]);

  const openQuoteModal = (quote: QuoteInquiry) => {
    setSelectedQuote(quote);
    setStatusInput(quote.status);
    setAdminNotesInput(quote.adminNotes ?? "");
    setAssignedManagerId(quote.assignedToId ?? quote.assignedTo?.id ?? "");
  };

  const handleSaveStatusAndNotes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuote) return;
    try {
      const updated = await updateStatus.mutateAsync({
        id: selectedQuote.id,
        payload: {
          status: statusInput,
          adminNotes: adminNotesInput.trim() || undefined,
        },
      });
      setSelectedQuote((prev) =>
        prev
          ? {
              ...prev,
              status: updated?.status ?? statusInput,
              adminNotes: updated?.adminNotes ?? adminNotesInput,
            }
          : null,
      );
      onToast?.(
        `Quote ${selectedQuote.reference} updated to ${statusInput}`,
      );
    } catch (err: any) {
      onToast?.(err?.normalizedMessage || "Failed to update quote status");
    }
  };

  const handleAssignManager = async () => {
    if (!selectedQuote || !assignedManagerId) return;
    try {
      await assignQuote.mutateAsync({
        id: selectedQuote.id,
        payload: { assignedToId: assignedManagerId },
      });
      const managerObj = managers.find((m) => m.id === assignedManagerId);
      setSelectedQuote((prev) =>
        prev
          ? {
              ...prev,
              assignedToId: assignedManagerId,
              assignedTo: managerObj
                ? { id: managerObj.id, fullName: managerObj.fullName }
                : prev.assignedTo,
            }
          : null,
      );
      onToast?.(`Assigned quote ${selectedQuote.reference} to manager`);
    } catch (err: any) {
      onToast?.(err?.normalizedMessage || "Failed to assign manager");
    }
  };

  const handleDeleteQuote = async (quote: QuoteInquiry) => {
    try {
      await deleteQuote.mutateAsync(quote.id);
      if (selectedQuote?.id === quote.id) {
        setSelectedQuote(null);
      }
      onToast?.(`Deleted quote ${quote.reference}`);
    } catch (err: any) {
      onToast?.(err?.normalizedMessage || "Failed to delete quote");
    }
  };

  const handleCreateWalkInQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    const targetProductId = selectedProductId || availableProducts[0]?.id;
    if (!targetProductId) {
      setCreateError("Please select a surgical product for the quote.");
      return;
    }
    if (!customerName.trim() || !customerPhone.trim()) {
      setCreateError("Customer name and WhatsApp phone number are required.");
      return;
    }

    try {
      const res = await createQuote.mutateAsync({
        payload: {
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerEmail: customerEmail.trim() || undefined,
          hospitalClinic: hospitalClinic.trim() || undefined,
          location: location.trim() || undefined,
          priority,
          customerNotes: customerNotes.trim() || undefined,
          items: [
            {
              productId: targetProductId,
              quantity: Number(selectedQty) || 1,
            },
          ],
        },
      });
      setIsCreateOpen(false);
      setCustomerName("");
      setCustomerEmail("");
      setHospitalClinic("");
      setCustomerNotes("");
      onToast?.(`Created RFQ ${res.reference}`);
    } catch (err: any) {
      setCreateError(
        err?.normalizedMessage ||
          err?.response?.data?.message ||
          "Failed to create quote request.",
      );
    }
  };

  const buildWhatsAppUrl = (quote: QuoteInquiry) => {
    if (quote.whatsappLink) return quote.whatsappLink;
    const cleanPhone = quote.customerPhone.replace(/\D/g, "");
    const message = encodeURIComponent(
      `Hello ${quote.customerName}, regarding your Elpima Surgicals quotation request (${quote.reference}) for ${quote.hospitalClinic || "your facility"}:`,
    );
    return `https://wa.me/${cleanPhone}?text=${message}`;
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
              onClick={() => {
                setSelectedProductId(availableProducts[0]?.id ?? "");
                setIsCreateOpen(true);
              }}
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
              rawQuotes.filter((q) => q.status === "NEW").length,
            filter: "NEW",
            tone: "text-sky-700",
          },
          {
            label: "Contacted",
            val:
              statsOverview?.CONTACTED ??
              rawQuotes.filter((q) => q.status === "CONTACTED").length,
            filter: "CONTACTED",
            tone: "text-amber-700",
          },
          {
            label: "Quoted",
            val:
              statsOverview?.QUOTED ??
              rawQuotes.filter((q) => q.status === "QUOTED").length,
            filter: "QUOTED",
            tone: "text-indigo-700",
          },
          {
            label: "Fulfilled",
            val:
              statsOverview?.FULFILLED ??
              rawQuotes.filter((q) => q.status === "FULFILLED").length,
            filter: "FULFILLED",
            tone: "text-emerald-700",
          },
          {
            label: "Urgent Pending",
            val:
              statsOverview?.urgentPending ??
              rawQuotes.filter((q) => q.priority === "URGENT").length,
            filter: "URGENT_PRIORITY",
            tone: "text-rose-600",
          },
        ].map((card) => (
          <button
            key={card.label}
            type="button"
            onClick={() => {
              if (card.filter === "URGENT_PRIORITY") {
                setPriorityFilter((p) => (p === "URGENT" ? "" : "URGENT"));
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
            onChange={(e) => {
              setSearch(e.target.value);
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
          onChange={(val) => {
            setStatusFilter(val);
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
          onChange={(val) => {
            setPriorityFilter(val);
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
          onChange={(val) => setSortBy(val as any)}
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
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-gray-50/40 text-xs">
            <span className="text-gray-500">
              Page <strong>{meta.page}</strong> of{" "}
              <strong>{meta.totalPages}</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white font-semibold disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white font-semibold disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= QUOTE DETAIL & WORKFLOW MODAL ================= */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-gray-200 space-y-5 text-xs">
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-extrabold text-[#2E7D5B]">
                    {selectedQuote.reference}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      STATUS_BADGE[selectedQuote.status]
                    }`}
                  >
                    {selectedQuote.status}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      selectedQuote.priority === "URGENT"
                        ? "bg-rose-100 text-rose-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {selectedQuote.priority}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-gray-900 mt-1">
                  {selectedQuote.customerName} —{" "}
                  {selectedQuote.hospitalClinic ||
                    selectedQuote.hospitalName ||
                    "Direct Hospital Inquiry"}
                </h3>
                <p className="text-gray-500">
                  Submitted {formatLiveDate(selectedQuote.createdAt, true)} •{" "}
                  {selectedQuote.location || "Nigeria"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedQuote(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Contact Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href={buildWhatsAppUrl(selectedQuote)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Message on WhatsApp ({selectedQuote.customerPhone})</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => downloadPdf.mutate(selectedQuote.reference)}
                disabled={downloadPdf.isPending}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 font-bold cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>
                  {downloadPdf.isPending
                    ? "Generating PDF..."
                    : "Download Proforma PDF"}
                </span>
              </button>
            </div>

            {/* Requested Surgical Items */}
            <div>
              <h4 className="font-bold text-gray-800 uppercase mb-2">
                Requested Surgical Equipment ({selectedQuote.items?.length ?? 0}
                )
              </h4>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold uppercase text-gray-500">
                      <th className="py-2.5 px-3">Equipment Name</th>
                      <th className="py-2.5 px-3">SKU</th>
                      <th className="py-2.5 px-3 text-right">Quantity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(selectedQuote.items ?? []).map((item) => (
                      <tr key={item.id}>
                        <td className="py-2.5 px-3 font-semibold text-gray-900">
                          {item.productName ||
                            item.product?.name ||
                            "Surgical Equipment Item"}
                          {item.customRequirement && (
                            <p className="text-[11px] font-normal text-gray-500">
                              Note: {item.customRequirement}
                            </p>
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-gray-500">
                          {item.productSku || item.product?.sku || "—"}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-gray-900">
                          {item.quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {selectedQuote.customerNotes && (
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80">
                <p className="font-bold text-amber-900 mb-0.5">
                  Customer / Hospital Notes:
                </p>
                <p className="text-amber-800">{selectedQuote.customerNotes}</p>
              </div>
            )}

            {/* Super-Admin: Assign to Supervising Manager */}
            {isSuperAdmin && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <label className="block font-bold text-slate-800 uppercase">
                  Assign to Supervising Manager (Super-Admin)
                </label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <FloatingSelect
                      value={assignedManagerId}
                      onChange={(val) => setAssignedManagerId(val)}
                      placeholder="Select Supervising Manager..."
                      matchWidth
                      className="w-full text-xs"
                      options={[
                        { value: "", label: "Select Supervising Manager..." },
                        ...managers.map((m) => ({
                          value: m.id,
                          label: m.fullName,
                          description: m.email,
                        })),
                      ]}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAssignManager}
                    disabled={!assignedManagerId || assignQuote.isPending}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white font-bold disabled:opacity-40 cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Assign</span>
                  </button>
                </div>
              </div>
            )}

            {/* Update Quote Status & Internal Notes */}
            <form
              onSubmit={handleSaveStatusAndNotes}
              className="space-y-3 pt-2 border-t border-gray-100"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    WORKFLOW STATUS
                  </label>
                  <FloatingSelect
                    value={statusInput}
                    onChange={(val) => setStatusInput(val as QuoteStatus)}
                    matchWidth
                    className="w-full text-xs"
                    options={[
                      { value: "NEW", label: "NEW" },
                      { value: "CONTACTED", label: "CONTACTED" },
                      { value: "QUOTED", label: "QUOTED" },
                      { value: "FULFILLED", label: "FULFILLED" },
                      { value: "CANCELLED", label: "CANCELLED" },
                    ]}
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  INTERNAL ADMIN / PROCUREMENT NOTES
                </label>
                <textarea
                  rows={3}
                  value={adminNotesInput}
                  onChange={(e) => setAdminNotesInput(e.target.value)}
                  placeholder="Record agreed pricing, proforma invoice number, or delivery schedule..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedQuote(null)}
                  className="px-4 py-2 rounded-xl border border-gray-200 font-semibold text-gray-700"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={updateStatus.isPending}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#2E7D5B] hover:bg-[#256649] text-white font-bold cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {updateStatus.isPending
                      ? "Saving..."
                      : "Save Status & Notes"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= CREATE MANUAL / WALK-IN RFQ MODAL ================= */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 text-xs">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-base font-extrabold text-gray-900">
                Log Hospital / Walk-In Quote Request
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleCreateWalkInQuote}
              className="space-y-3.5 pt-4"
            >
              {createError && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
                  {createError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    CONTACT PERSON / DOCTOR *
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Dr. Tunde Bakare"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    WHATSAPP PHONE *
                  </label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+2348030000000"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    HOSPITAL / CLINIC NAME
                  </label>
                  <input
                    type="text"
                    value={hospitalClinic}
                    onChange={(e) => setHospitalClinic(e.target.value)}
                    placeholder="Reddington Multi-Specialist Hospital"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    CITY / STATE
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Victoria Island, Lagos"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="procurement@hospital.com"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    PRIORITY
                  </label>
                  <FloatingSelect
                    value={priority}
                    onChange={(val) => setPriority(val as QuotePriority)}
                    matchWidth
                    className="w-full text-xs"
                    options={[
                      { value: "STANDARD", label: "STANDARD" },
                      { value: "URGENT", label: "URGENT" },
                    ]}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">
                    PRIMARY EQUIPMENT SKU *
                  </label>
                  <FloatingSelect
                    value={selectedProductId}
                    onChange={(val) => setSelectedProductId(val)}
                    placeholder="Select surgical product..."
                    matchWidth
                    className="w-full text-xs"
                    options={availableProducts.map((prod) => ({
                      value: prod.id,
                      label: prod.name,
                      description: prod.sku ? `SKU: ${prod.sku}` : undefined,
                    }))}
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    QUANTITY *
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={selectedQty}
                    onChange={(e) =>
                      setSelectedQty(Number(e.target.value) || 1)
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  CUSTOMER REQUIREMENTS / NOTES
                </label>
                <textarea
                  rows={2}
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="Include installation & theater nurse training..."
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createQuote.isPending}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#2E7D5B] text-white font-bold cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {createQuote.isPending ? "Submitting..." : "Create RFQ"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotesModule;

