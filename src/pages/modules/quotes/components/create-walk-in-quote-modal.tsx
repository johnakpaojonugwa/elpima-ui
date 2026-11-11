// src/pages/modules/quotes/components/create-walk-in-quote-modal.tsx
import React, { useState } from "react";
import { Check, X } from "lucide-react";
import { FloatingSelect } from "@/components/app";
import { useCreateQuoteMutation } from "@/hooks/queries";
import type { Product, QuotePriority } from "@/types/domain";

export interface CreateWalkInQuoteModalProps {
  isOpen: boolean;
  availableProducts: Product[];
  onClose: () => void;
  onToast?: (message: string) => void;
}

export const CreateWalkInQuoteModal: React.FC<CreateWalkInQuoteModalProps> = ({
  isOpen,
  availableProducts,
  onClose,
  onToast,
}) => {
  const createQuote = useCreateQuoteMutation();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [hospitalClinic, setHospitalClinic] = useState("");
  const [location, setLocation] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [priority, setPriority] = useState<QuotePriority>("STANDARD");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedQty, setSelectedQty] = useState(1);
  const [createError, setCreateError] = useState("");

  if (!isOpen) return null;

  const handleCreateWalkInQuote = async (submitEvent: React.FormEvent) => {
    submitEvent.preventDefault();
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
      const quoteResponse = await createQuote.mutateAsync({
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
      onClose();
      setCustomerName("");
      setCustomerEmail("");
      setHospitalClinic("");
      setCustomerNotes("");
      onToast?.(`Created RFQ ${quoteResponse.reference}`);
    } catch (mutationError: any) {
      setCreateError(
        mutationError?.normalizedMessage ||
          mutationError?.response?.data?.message ||
          "Failed to create quote request.",
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 text-xs">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <h3 className="text-base font-extrabold text-gray-900">
            Log Hospital / Walk-In Quote Request
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleCreateWalkInQuote} className="space-y-3.5 pt-4">
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
                onChange={(changeEvent) =>
                  setCustomerName(changeEvent.target.value)
                }
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
                onChange={(changeEvent) =>
                  setCustomerPhone(changeEvent.target.value)
                }
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
                onChange={(changeEvent) =>
                  setHospitalClinic(changeEvent.target.value)
                }
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
                onChange={(changeEvent) => setLocation(changeEvent.target.value)}
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
                onChange={(changeEvent) =>
                  setCustomerEmail(changeEvent.target.value)
                }
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
                onChange={(selectedPriority) =>
                  setPriority(selectedPriority as QuotePriority)
                }
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
                onChange={(productId) => setSelectedProductId(productId)}
                placeholder="Select surgical product..."
                matchWidth
                className="w-full text-xs"
                options={availableProducts.map((productItem) => ({
                  value: productItem.id,
                  label: productItem.name,
                  description: productItem.sku
                    ? `SKU: ${productItem.sku}`
                    : undefined,
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
                onChange={(changeEvent) =>
                  setSelectedQty(Number(changeEvent.target.value) || 1)
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
              onChange={(changeEvent) =>
                setCustomerNotes(changeEvent.target.value)
              }
              placeholder="Include installation & theater nurse training..."
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-200 font-semibold cursor-pointer hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createQuote.isPending}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#2E7D5B] text-white font-bold cursor-pointer hover:bg-[#256649] disabled:opacity-50"
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
  );
};

export default CreateWalkInQuoteModal;
