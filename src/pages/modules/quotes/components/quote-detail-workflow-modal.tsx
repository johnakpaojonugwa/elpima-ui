// src/pages/modules/quotes/components/quote-detail-workflow-modal.tsx
import React, { useEffect, useState } from "react";
import {
  Check,
  Download,
  ExternalLink,
  MessageSquare,
  UserCheck,
  X,
} from "lucide-react";
import { FloatingSelect } from "@/components/app";
import {
  useAssignQuoteMutation,
  useDownloadQuotePdfMutation,
  useUpdateQuoteStatusMutation,
} from "@/hooks/queries";
import type { Manager, QuoteInquiry, QuoteStatus } from "@/types/domain";
import { formatLiveDate } from "@/utils/date";

const STATUS_BADGE: Record<QuoteStatus, string> = {
  NEW: "bg-amber-50 text-amber-700 border-amber-200",
  CONTACTED: "bg-blue-50 text-blue-700 border-blue-200",
  QUOTED: "bg-indigo-50 text-indigo-700 border-indigo-200",
  FULFILLED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-rose-50 text-rose-700 border-rose-200",
};

export interface QuoteDetailWorkflowModalProps {
  quote: QuoteInquiry | null;
  isSuperAdmin: boolean;
  managers: Manager[];
  onClose: () => void;
  onToast?: (message: string) => void;
}

export const QuoteDetailWorkflowModal: React.FC<
  QuoteDetailWorkflowModalProps
> = ({ quote, isSuperAdmin, managers, onClose, onToast }) => {
  const downloadPdf = useDownloadQuotePdfMutation();
  const assignQuote = useAssignQuoteMutation();
  const updateStatus = useUpdateQuoteStatusMutation();

  const [statusInput, setStatusInput] = useState<QuoteStatus>("NEW");
  const [adminNotesInput, setAdminNotesInput] = useState("");
  const [assignedManagerId, setAssignedManagerId] = useState("");

  useEffect(() => {
    if (quote) {
      setStatusInput(quote.status);
      setAdminNotesInput(quote.adminNotes || "");
      setAssignedManagerId(quote.assignedToId || "");
    }
  }, [quote]);

  if (!quote) return null;

  const buildWhatsAppUrl = (targetQuote: QuoteInquiry) => {
    if (targetQuote.whatsappLink) return targetQuote.whatsappLink;
    const cleanPhone = targetQuote.customerPhone.replace(/\D/g, "");
    const message = encodeURIComponent(
      `Hello ${targetQuote.customerName}, regarding your Elpima Surgicals quotation request (${targetQuote.reference}) for ${targetQuote.hospitalClinic || "your facility"}:`,
    );
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  const handleAssignManager = async () => {
    if (!assignedManagerId) return;
    try {
      await assignQuote.mutateAsync({
        id: quote.id,
        payload: { assignedToId: assignedManagerId },
      });
      onToast?.("Quote inquiry successfully assigned to manager");
    } catch (err: any) {
      onToast?.(err?.normalizedMessage || "Could not assign quote inquiry");
    }
  };

  const handleSaveStatusAndNotes = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateStatus.mutateAsync({
        id: quote.id,
        payload: {
          status: statusInput,
          adminNotes: adminNotesInput.trim() || undefined,
        },
      });
      onToast?.(`Status updated to ${statusInput}`);
      onClose();
    } catch (err: any) {
      onToast?.(err?.normalizedMessage || "Could not update quote status");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-gray-200 space-y-5 text-xs">
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-extrabold text-[#2E7D5B]">
                {quote.reference}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  STATUS_BADGE[quote.status]
                }`}
              >
                {quote.status}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  quote.priority === "URGENT"
                    ? "bg-rose-100 text-rose-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {quote.priority}
              </span>
            </div>
            <h3 className="text-base font-extrabold text-gray-900 mt-1">
              {quote.customerName} —{" "}
              {quote.hospitalClinic ||
                quote.hospitalName ||
                "Direct Hospital Inquiry"}
            </h3>
            <p className="text-gray-500">
              Submitted {formatLiveDate(quote.createdAt, true)} •{" "}
              {quote.location || "Nigeria"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Contact Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href={buildWhatsAppUrl(quote)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Message on WhatsApp ({quote.customerPhone})</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={() => downloadPdf.mutate(quote.reference)}
            disabled={downloadPdf.isPending}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 font-bold cursor-pointer disabled:opacity-50"
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
            Requested Surgical Equipment ({quote.items?.length ?? 0})
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
                {(quote.items ?? []).map((item) => (
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

        {quote.customerNotes && (
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80">
            <p className="font-bold text-amber-900 mb-0.5">
              Customer / Hospital Notes:
            </p>
            <p className="text-amber-800">{quote.customerNotes}</p>
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
                  onChange={(selectedManagerId) =>
                    setAssignedManagerId(selectedManagerId)
                  }
                  placeholder="Select Supervising Manager..."
                  matchWidth
                  className="w-full text-xs"
                  options={[
                    { value: "", label: "Select Supervising Manager..." },
                    ...managers.map((managerItem) => ({
                      value: managerItem.id,
                      label: managerItem.fullName,
                      description: managerItem.email,
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
                onChange={(selectedStatus) =>
                  setStatusInput(selectedStatus as QuoteStatus)
                }
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
              onChange={(changeEvent) =>
                setAdminNotesInput(changeEvent.target.value)
              }
              placeholder="Record agreed pricing, proforma invoice number, or delivery schedule..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-200 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={updateStatus.isPending}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#2E7D5B] hover:bg-[#256649] text-white font-bold cursor-pointer disabled:opacity-50"
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
  );
};

export default QuoteDetailWorkflowModal;

