// src/pages/modules/products/components/product-detail-modal.tsx
import React from "react";
import { X } from "lucide-react";
import type { Product } from "@/types/domain";
import { formatLiveDate } from "@/utils/date";

export interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onEdit: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onEdit,
}) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl border border-gray-200 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={product.images?.[0]}
              alt={product.name}
              className="w-16 h-16 rounded-2xl object-cover border border-gray-200"
            />
            <div>
              <span className="text-[11px] font-mono font-semibold text-[#2E7D5B]">
                SKU: {product.sku || "N/A"}
              </span>
              <h3 className="text-lg font-extrabold text-gray-900">
                {product.name}
              </h3>
              <p className="text-xs text-gray-500">
                {product.category?.name} •{" "}
                {product.specialty?.name || "General Surgery"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {product.shortDescription && (
          <p className="text-xs font-medium text-gray-700 bg-gray-50 p-3.5 rounded-xl">
            {product.shortDescription}
          </p>
        )}

        {(product.description || product.fullDescription) && (
          <div className="text-xs text-gray-600 leading-relaxed">
            <h4 className="font-bold text-gray-800 uppercase mb-1">
              Clinical Description
            </h4>
            <p>{product.description || product.fullDescription}</p>
          </div>
        )}

        {product.specifications &&
          Object.keys(product.specifications).length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-gray-800 uppercase mb-2">
                Technical Specifications
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {Object.entries(product.specifications).map(
                  ([specificationKey, specificationValue]) => (
                    <div
                      key={specificationKey}
                      className="flex justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100"
                    >
                      <span className="text-gray-500 font-medium">
                        {specificationKey}
                      </span>
                      <span className="text-gray-900 font-bold">
                        {String(specificationValue)}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-500">
          <span>Last Updated: {formatLiveDate(product.updatedAt, true)}</span>
          <button
            type="button"
            onClick={() => onEdit(product)}
            className="px-4 py-2 rounded-xl bg-[#2E7D5B] text-white font-bold cursor-pointer hover:bg-[#236246] transition-colors"
          >
            Edit SKU
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;

