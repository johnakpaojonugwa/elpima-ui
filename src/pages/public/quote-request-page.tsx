import type React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, MessageSquare, ExternalLink } from "lucide-react";
import { useCreateQuoteMutation } from "@/hooks/queries";
import { ROUTES } from "@/routes";
import { useQuoteBag } from "@/store";

const QuoteRequestPage: React.FC = () => {
  const { items, removeItem, clearBag } = useQuoteBag();
  const createQuote = useCreateQuoteMutation();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [hospitalClinic, setHospitalClinic] = useState("");
  const [location, setLocation] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submittedQuote, setSubmittedQuote] = useState<{
    reference: string;
    whatsappLink?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitError("");

    try {
      const result = await createQuote.mutateAsync({
        payload: {
          customerName,
          customerPhone,
          customerEmail: customerEmail || undefined,
          hospitalClinic: hospitalClinic || undefined,
          location: location || undefined,
          customerNotes: customerNotes || undefined,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            customRequirement: item.notes,
          })),
        },
      });

      clearBag();
      setSubmittedQuote({
        reference: result.reference,
        whatsappLink: result.whatsappLink,
      });

      if (result.whatsappLink) {
        try {
          window.open(result.whatsappLink, "_blank", "noopener,noreferrer");
        } catch {
          // Popup blocked - user can click button on success screen
        }
      }
    } catch (err: any) {
      setSubmitError(
        err?.normalizedMessage ||
          err?.response?.data?.message ||
          "Failed to submit quote request. Please try again.",
      );
    }
  };

  if (submittedQuote) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
        <div className="mx-auto max-w-xl w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Quote Request Submitted
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Your official inquiry has been recorded with reference{" "}
            <strong className="font-mono text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
              {submittedQuote.reference}
            </strong>
            .
          </p>

          <p className="mt-4 text-xs text-slate-500">
            Our surgical procurement desk is ready to review your equipment
            inquiry and dispatch your proforma invoice.
          </p>

          {submittedQuote.whatsappLink && (
            <div className="mt-6">
              <a
                href={submittedQuote.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-[#25D366] hover:bg-[#20ba59] px-6 py-3.5 text-base font-bold text-white shadow-sm transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Chat on WhatsApp Desk</span>
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
              <p className="mt-2 text-[11px] text-slate-400">
                Click above if the WhatsApp window did not open automatically.
              </p>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-slate-100 flex justify-center">
            <Link
              to={ROUTES.PUBLIC.CATALOG}
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 hover:underline"
            >
              ← Return to Equipment Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 shadow-xs">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">
            Request Proforma Quote (RFQ)
          </h1>
          <Link
            to={ROUTES.PUBLIC.CATALOG}
            className="text-sm font-medium text-sky-600 hover:underline"
          >
            + Add Equipment
          </Link>
        </div>

        {submitError && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs">
            {submitError}
          </div>
        )}

        {items.length === 0 ? (
          <p className="mt-6 text-sm text-slate-500">
            Your quote bag is currently empty. Browse the catalog to add
            surgical or diagnostic equipment.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 p-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between py-2 text-sm"
                >
                  <div>
                    <p className="font-medium text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="text-xs font-medium text-rose-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input
                required
                placeholder="Full Name *"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="rounded-lg border border-slate-300 px-3.5 py-2 text-sm"
              />
              <input
                required
                placeholder="Phone / WhatsApp Number *"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="rounded-lg border border-slate-300 px-3.5 py-2 text-sm"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="rounded-lg border border-slate-300 px-3.5 py-2 text-sm"
              />
              <input
                placeholder="Hospital / Clinic / Organization"
                value={hospitalClinic}
                onChange={(e) => setHospitalClinic(e.target.value)}
                className="rounded-lg border border-slate-300 px-3.5 py-2 text-sm"
              />
              <input
                placeholder="City / State (e.g. Lagos, Abuja)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="rounded-lg border border-slate-300 px-3.5 py-2 text-sm sm:col-span-2"
              />
              <textarea
                placeholder="Additional specifications or delivery notes..."
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                rows={3}
                className="rounded-lg border border-slate-300 px-3.5 py-2 text-sm sm:col-span-2"
              />
            </div>

            <button
              type="submit"
              disabled={createQuote.isPending}
              className="w-full rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
            >
              {createQuote.isPending
                ? "Generating Quote & WhatsApp Link..."
                : "Submit Quote Inquiry"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default QuoteRequestPage;

