// src/pages/modules/products/components/product-delete-dialog.tsx
import React from "react";
import type { Product } from "@/types/domain";

export interface ProductDeleteDialogProps {
  product: Product | null;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ProductDeleteDialog: React.FC<ProductDeleteDialogProps> = ({
  product,
  isDeleting,
  onCancel,
  onConfirm,
}) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
        <h3 className="text-base font-extrabold text-gray-900">
          Delete Surgical Equipment?
        </h3>
        <p className="text-xs text-gray-600 mt-1.5">
          Are you sure you want to remove <strong>{product.name}</strong> from the
          catalog?
        </p>
        <div className="flex justify-end gap-2.5 mt-5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white cursor-pointer disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Confirm Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDeleteDialog;

