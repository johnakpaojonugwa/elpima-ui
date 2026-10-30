import type React from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Package,
  Plus,
  ShieldCheck,
} from "lucide-react";
import {
  useProductBySlugQuery,
  useRelatedProductsQuery,
} from "@/hooks/queries";
import { ROUTES } from "@/routes";
import { useQuoteBagStore } from "@/store/quote-bag-store";
import { toast } from "@/hooks/use-toast";
import type { Product } from "@/types/domain";

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading: isLoadingProduct } = useProductBySlugQuery(slug);
  const { data: relatedProducts = [] } = useRelatedProductsQuery(slug);
  const addItemToQuoteBag = useQuoteBagStore((state) => state.addItem);

  const handleAddToBag = () => {
    if (!product) return;
    addItemToQuoteBag({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      category: product.category?.name,
      image: product.images?.[0],
    });
    toast.success(`Added "${product.name}" to Quote Bag`);
  };

  if (isLoadingProduct) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-stone-200 border-t-teal-600" />
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Loading clinical equipment specifications...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="max-w-md rounded-3xl border border-stone-200 bg-white p-8 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Package className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-stone-900">
            Clinical Instrument Not Found
          </h2>
          <p className="text-xs text-stone-500">
            The requested medical equipment or instrument set could not be located in our active database.
          </p>
          <div className="pt-2">
            <Link
              to={ROUTES.PUBLIC.CATALOG}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Equipment Catalog</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
          <Link to={ROUTES.PUBLIC.HOME} className="hover:text-teal-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to={ROUTES.PUBLIC.CATALOG} className="hover:text-teal-600 transition-colors">
            Equipment Catalog
          </Link>
          <span>/</span>
          <span className="text-stone-900 font-bold truncate max-w-xs">{product.name}</span>
        </div>

        {/* Product Details Main Card */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10">
            {/* Visual Column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 aspect-square">
                <img
                  src={
                    product.images?.[0] ||
                    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop"
                  }
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-teal-700 text-white shadow-2xs">
                    {product.category?.name || "Medical Device"}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md ${
                      product.inStock
                        ? "bg-emerald-600 text-white"
                        : "bg-amber-600 text-white"
                    }`}
                  >
                    {product.inStock ? "In Stock" : product.leadTime || "Lead Time Required"}
                  </span>
                </div>
              </div>

              {/* Quality & Traceability Badges */}
              <div className="p-4 rounded-2xl bg-[#FAF6EE] border border-[#D4AF37]/30 text-xs space-y-2">
                <div className="flex items-center gap-2 text-[#8E702D] font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>Clinical Quality & Traceability Guarantee</span>
                </div>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  Supplied with authentic CE & ISO 13485 conformity certificate, biomedical engineer inspection seal, and manufacturer warranty.
                </p>
              </div>
            </div>

            {/* Specifications Column */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold">
                    {product.specialty?.name || "Clinical Surgery"}
                  </span>
                  <span className="text-xs text-stone-500 font-mono">
                    SKU: <strong className="text-stone-800">{product.sku || "ELP-MED"}</strong>
                  </span>
                  <span className="text-stone-300">•</span>
                  <span className="text-xs text-stone-500">
                    Brand: <strong className="text-stone-800">{product.brand || "Elpima Quality"}</strong>
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-teal-600 tracking-tight">
                  {product.name}
                </h1>

                <p className="text-sm text-stone-600 leading-relaxed">
                  {product.fullDescription ||
                    product.shortDescription ||
                    "Certified hospital surgical equipment with manufacturer warranty, biomedical engineering calibration, and turnkey hospital delivery."}
                </p>

                {/* Technical Metadata Matrix */}
                <div className="grid grid-cols-2 gap-3 pt-3 text-xs">
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                    <span className="text-stone-400 block text-[10px] font-bold uppercase">
                      Compliance Standard
                    </span>
                    <span className="font-semibold text-stone-800">
                      ISO 13485:2016 & CE
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                    <span className="text-stone-400 block text-[10px] font-bold uppercase">
                      Warranty
                    </span>
                    <span className="font-semibold text-stone-800">
                      12 - 24 Months OEM
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                    <span className="text-stone-400 block text-[10px] font-bold uppercase">
                      Biomedical Support
                    </span>
                    <span className="font-semibold text-stone-800">
                      Local Calibration Included
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                    <span className="text-stone-400 block text-[10px] font-bold uppercase">
                      Logistics Coverage
                    </span>
                    <span className="font-semibold text-stone-800">
                      Nationwide (Nigeria)
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-stone-100 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleAddToBag}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Quote Request Bag</span>
                </button>

                <Link
                  to={ROUTES.PUBLIC.QUOTE_REQUEST}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border-2 border-[#D4AF37] bg-[#FAF6EE] hover:bg-[#F3EDE0] text-[#8E702D] font-bold text-xs sm:text-sm transition-colors shadow-2xs"
                >
                  <FileText className="w-4 h-4 text-[#D4AF37]" />
                  <span>Proceed to Proforma RFQ</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Related Equipment Section */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-stone-900 tracking-tight">
              Complementary Surgical & Medical Equipment
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProductItem: Product) => (
                <Link
                  key={relatedProductItem.id}
                  to={`/products/${relatedProductItem.slug}`}
                  className="p-5 rounded-2xl border border-stone-200 bg-white hover:border-teal-500 shadow-2xs hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span className="font-medium text-teal-700">
                      {relatedProductItem.category?.name || "Equipment"}
                    </span>
                    <span className="font-mono text-[10px]">
                      {relatedProductItem.sku || "ELP"}
                    </span>
                  </div>
                  <h4 className="mt-2 font-bold text-sm text-stone-900 group-hover:text-teal-700 transition-colors">
                    {relatedProductItem.name}
                  </h4>
                  <p className="mt-1 text-xs text-stone-600 line-clamp-2">
                    {relatedProductItem.shortDescription ||
                      "Hospital-grade surgical instrument with manufacturer warranty."}
                  </p>
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
