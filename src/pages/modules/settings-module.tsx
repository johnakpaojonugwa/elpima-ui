import React, { useEffect, useState } from "react";
import {
  Check,
  ExternalLink,
  MessageSquare,
  RefreshCw,
  Settings,
} from "lucide-react";
import {
  useStoreSettingsQuery,
  useUpdateStoreSettingsMutation,
} from "@/hooks/queries";
import { formatLiveDate } from "@/utils/date";

interface SettingsModuleProps {
  onToast?: (message: string) => void;
}

export const SettingsModule: React.FC<SettingsModuleProps> = ({ onToast }) => {
  const {
    data: settings,
    isLoading,
    isFetching,
    refetch,
  } = useStoreSettingsQuery();
  const updateSettings = useUpdateStoreSettingsMutation();

  const [companyName, setCompanyName] = useState("Elpima Surgicals Limited");
  const [whatsappNumber, setWhatsappNumber] = useState("2348000000000");
  const [companyEmail, setCompanyEmail] = useState("info@elpimasurgicals.com");
  const [companyPhone, setCompanyPhone] = useState("+2348000000000");
  const [companyAddress, setCompanyAddress] = useState(
    "Victoria Island, Lagos, Nigeria",
  );
  const [quoteDisclaimer, setQuoteDisclaimer] = useState(
    "Prices are confirmed upon official quotation request via WhatsApp and may vary based on quantity and specifications.",
  );
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (settings) {
      setCompanyName(settings.companyName || "Elpima Surgicals Limited");
      setWhatsappNumber(settings.whatsappNumber || "2348000000000");
      setCompanyEmail(settings.companyEmail || "info@elpimasurgicals.com");
      setCompanyPhone(settings.companyPhone || "+2348000000000");
      setCompanyAddress(
        settings.companyAddress || "Victoria Island, Lagos, Nigeria",
      );
      setQuoteDisclaimer(settings.quoteDisclaimer || "");
    }
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      await updateSettings.mutateAsync({
        companyName: companyName.trim(),
        whatsappNumber: whatsappNumber.trim(),
        companyEmail: companyEmail.trim(),
        companyPhone: companyPhone.trim(),
        companyAddress: companyAddress.trim(),
        quoteDisclaimer: quoteDisclaimer.trim(),
      });
      onToast?.("Storefront & WhatsApp RFQ settings updated!");
    } catch (err: any) {
      setErrorMsg(
        err?.normalizedMessage ||
          err?.response?.data?.message ||
          "Failed to update store settings.",
      );
    }
  };

  const cleanWhatsApp = whatsappNumber.replace(/\D/g, "") || "2348000000000";
  const testWhatsAppLink = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
    `Hello ${companyName}, testing official WhatsApp RFQ routing.`,
  )}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2E7D5B]/10 text-[#2E7D5B] flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              Global Store & WhatsApp Quotation Settings
            </h1>
            <p className="text-xs text-gray-500">
              Configure the official WhatsApp quotation desk number, company
              contact details, and RFQ proforma disclaimer
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
          <span>Reload</span>
        </button>
      </div>

      {isLoading ? (
        <div className="bg-white p-12 rounded-2xl text-center text-xs text-gray-400">
          Loading store configuration...
        </div>
      ) : (
        <form
          onSubmit={handleSave}
          className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100 space-y-5 text-xs"
        >
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                COMPANY / ORGANIZATION NAME *
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                OFFICIAL WHATSAPP RFQ NUMBER (International digits) *
              </label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="2348000000000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 font-mono"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                OFFICIAL SALES EMAIL
              </label>
              <input
                type="email"
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                OFFICE TELEPHONE
              </label>
              <input
                type="text"
                value={companyPhone}
                onChange={(e) => setCompanyPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-gray-700 mb-1">
                HEADQUARTERS / SHOWROOM ADDRESS
              </label>
              <input
                type="text"
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-gray-700 mb-1">
                PROFORMA QUOTATION DISCLAIMER
              </label>
              <textarea
                rows={3}
                value={quoteDisclaimer}
                onChange={(e) => setQuoteDisclaimer(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <a
                href={testWhatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Test WhatsApp Deep-Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="text-[11px] text-gray-400">
                Last synced: {formatLiveDate(settings?.updatedAt, true)}
              </span>
            </div>

            <button
              type="submit"
              disabled={updateSettings.isPending}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2E7D5B] hover:bg-[#256649] text-white font-bold shadow-xs cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>
                {updateSettings.isPending
                  ? "Saving Settings..."
                  : "Save Store Settings"}
              </span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SettingsModule;

