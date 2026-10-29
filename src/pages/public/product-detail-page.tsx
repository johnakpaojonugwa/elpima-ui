import type React from "react";
import { Link, useParams } from "react-router-dom";
import {
  useProductBySlugQuery,
  useRelatedProductsQuery,
} from "@/hooks/queries";
import { ROUTES } from "@/routes";
import { useQuoteBag } from "@/store";

const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useProductBySlugQuery(slug);
  const { data: relatedProducts } = useRelatedProductsQuery(slug);
  const addItem = useQuoteBag((s) => s.addItem);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6">
        <p className="text-lg font-semibold text-slate-900">
          Product not found
        </p>
        <Link
          to={ROUTES.PUBLIC.CATALOG}
          className="mt-3 text-sm font-medium text-sky-600 hover:underline"
        >
          Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-8 shadow-xs">
        <Link
          to={ROUTES.PUBLIC.CATALOG}
          className="text-xs font-semibold text-sky-600 hover:underline"
        >
          ← Back to Catalog
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">
          {product.name}
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          SKU: {product.sku || "N/A"} | Brand: {product.brand || "Elpima"}
        </p>
        <p className="mt-4 text-sm text-slate-700">
          {product.fullDescription || product.shortDescription}
        </p>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              addItem({
                productId: product.id,
                name: product.name,
                slug: product.slug,
                sku: product.sku,
                category: product.category?.name,
                image: product.images?.[0],
              })
            }
            className="rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-700"
          >
            Add to Quote Bag
          </button>
          <Link
            to={ROUTES.PUBLIC.QUOTE_REQUEST}
            className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Proceed to Quote Request
          </Link>
        </div>

        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-10 border-t border-slate-200 pt-6">
            <h2 className="text-sm font-semibold text-slate-900">
              Related Equipment
            </h2>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/products/${rel.slug}`}
                  className="rounded-lg border border-slate-200 p-3 text-sm hover:border-sky-500"
                >
                  {rel.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;

