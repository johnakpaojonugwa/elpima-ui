import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ArrowDownAZ,
  ArrowUpDown,
  ArrowUpZA,
  Check,
  Clock,
  Edit3,
  Eye,
  Filter,
  FolderTree,
  ImagePlus,
  Package,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  Stethoscope,
  TrendingUp,
  Trash2,
  Wand2,
  X,
} from "lucide-react";
import {
  useCategoriesQuery,
  useDeleteProductMutation,
  useProductsQuery,
  useSpecialtiesQuery,
  useToggleProductStockMutation,
} from "@/hooks/queries";
import { useAuthStore } from "@/store";
import { FloatingSelect, Pagination } from "@/components/app";
import { ProductDeleteDialog } from "./products/components/product-delete-dialog";
import { ProductDetailModal } from "./products/components/product-detail-modal";
import { ProductFormModal } from "./products/components/product-form-modal";
import type {
  Product,
  ProductSortOption,
} from "@/types/domain";
import { formatLiveDate } from "@/utils/date";

interface ProductsModuleProps {
  onToast?: (message: string) => void;
}

export const ProductsModule: React.FC<ProductsModuleProps> = ({ onToast }) => {
  const userRole = useAuthStore((s) => s.user?.role) ?? "SUPERVISING_MANAGER";
  const isSuperAdmin = userRole === "SUPER_ADMIN";

  const [searchParams] = useSearchParams();
  const urlSearch = searchParams.get("search") || "";

  // Filters & Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [search, setSearch] = useState(urlSearch);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [stockFilter, setStockFilter] = useState<"" | "true" | "false">("");
  const [featuredFilter, setFeaturedFilter] = useState<"" | "true">("");
  const [sort, setSort] = useState<ProductSortOption>("newest");

  // Sync search state when URL search param changes (e.g. from top header search bar)
  useEffect(() => {
    const q = searchParams.get("search");
    if (q !== null && q !== search) {
      setSearch(q);
      setPage(1);
    }
  }, [searchParams]);

  // Queries
  const {
    data: productsRes,
    isLoading,
    isFetching,
    refetch,
  } = useProductsQuery({
    page,
    limit,
    search: search.trim() || undefined,
    category: selectedCategory || undefined,
    specialty: selectedSpecialty || undefined,
    inStock: stockFilter || undefined,
    featured: featuredFilter || undefined,
    sort,
  });

  const { data: categories = [] } = useCategoriesQuery();
  const { data: specialties = [] } = useSpecialtiesQuery();

  // Mutations
  const toggleStock = useToggleProductStockMutation();
  const deleteProduct = useDeleteProductMutation();

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const products = productsRes?.items ?? [];
  const meta = productsRes?.pagination;

  const statsSummary = useMemo(() => {
    const total = meta?.total ?? products.length;
    const inStockCount = products.filter(
      (productItem) => productItem.inStock,
    ).length;
    const featuredCount = products.filter(
      (productItem) => productItem.isFeatured,
    ).length;
    return { total, inStockCount, featuredCount };
  }, [products, meta]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleQuickToggleStock = async (product: Product) => {
    try {
      await toggleStock.mutateAsync({
        id: product.id,
        payload: {
          inStock: !product.inStock,
          leadTime: !product.inStock
            ? "In Stock — Dispatched within 24 hours"
            : "Available on Order (5-7 days)",
        },
      });
      onToast?.(
        `${product.name} marked as ${!product.inStock ? "In Stock" : "Out of Stock"}`,
      );
    } catch (mutationError: any) {
      onToast?.(mutationError?.normalizedMessage || "Could not update stock status");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    try {
      await deleteProduct.mutateAsync(deletingProduct.id);
      onToast?.(`Deleted "${deletingProduct.name}"`);
      setDeletingProduct(null);
    } catch (mutationError: any) {
      onToast?.(mutationError?.normalizedMessage || "Could not delete product");
    }
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setSelectedSpecialty("");
    setStockFilter("");
    setFeaturedFilter("");
    setSort("newest");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-gray-100">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#2E7D5B]/10 text-[#2E7D5B] flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                Surgical Equipment Catalog
              </h1>
              <p className="text-xs text-gray-500">
                Manage medical devices, technical specifications, compliance
                certificates, and live stock availability
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2E7D5B] hover:bg-[#256649] text-xs font-bold text-white shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Equipment SKU</span>
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500">
              Total Matching SKUs
            </p>
            <p className="text-2xl font-extrabold text-gray-900 mt-1">
              {statsSummary.total}
            </p>
          </div>
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
            Live Catalog
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500">
              In Stock (Current Page)
            </p>
            <p className="text-2xl font-extrabold text-emerald-700 mt-1">
              {statsSummary.inStockCount}
            </p>
          </div>
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-sky-50 text-sky-700">
            Ready for RFQ
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500">
              Featured Instruments
            </p>
            <p className="text-2xl font-extrabold text-amber-600 mt-1">
              {statsSummary.featuredCount}
            </p>
          </div>
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">
            Storefront Spotlight
          </span>
        </div>
      </div>

      {/* Filters & Sort Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-gray-100 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(changeEvent) => {
                setSearch(changeEvent.target.value);
                setPage(1);
              }}
              placeholder="Search by product name, SKU, or keyword..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#2E7D5B]"
            />
          </div>

          {/* Category Filter */}
          <FloatingSelect
            value={selectedCategory}
            onChange={(selectedValue) => {
              setSelectedCategory(selectedValue);
              setPage(1);
            }}
            menuTitle="Filter by Category"
            icon={<FolderTree className="w-3.5 h-3.5" />}
            isActiveFilter={Boolean(selectedCategory)}
            matchWidth
            className="w-full text-xs"
            options={[
              {
                value: "",
                label: "All Categories",
                icon: <FolderTree className="w-3.5 h-3.5" />,
              },
              ...categories.map((categoryItem) => ({
                value: categoryItem.slug,
                label: categoryItem.name,
                icon: <FolderTree className="w-3.5 h-3.5" />,
              })),
            ]}
          />

          {/* Specialty Filter */}
          <FloatingSelect
            value={selectedSpecialty}
            onChange={(selectedValue) => {
              setSelectedSpecialty(selectedValue);
              setPage(1);
            }}
            menuTitle="Filter by Specialty"
            icon={<Stethoscope className="w-3.5 h-3.5" />}
            isActiveFilter={Boolean(selectedSpecialty)}
            matchWidth
            className="w-full text-xs"
            options={[
              {
                value: "",
                label: "All Specialties",
                icon: <Stethoscope className="w-3.5 h-3.5" />,
              },
              ...specialties.map((specialtyItem) => ({
                value: specialtyItem.slug,
                label: specialtyItem.name,
                icon: <Stethoscope className="w-3.5 h-3.5" />,
              })),
            ]}
          />

          {/* Stock Filter */}
          <FloatingSelect
            value={stockFilter}
            onChange={(selectedValue) => {
              setStockFilter(selectedValue as "" | "true" | "false");
              setPage(1);
            }}
            menuTitle="Filter by Availability"
            icon={<SlidersHorizontal className="w-3.5 h-3.5" />}
            isActiveFilter={Boolean(stockFilter)}
            matchWidth
            className="w-full text-xs"
            options={[
              {
                value: "",
                label: "All Stock Status",
                icon: <Filter className="w-3.5 h-3.5" />,
              },
              {
                value: "true",
                label: "In Stock Only",
                icon: <Check className="w-3.5 h-3.5" />,
              },
              {
                value: "false",
                label: "Out of Stock",
                icon: <X className="w-3.5 h-3.5" />,
              },
            ]}
          />

          {/* Sort */}
          <FloatingSelect
            value={sort}
            onChange={(selectedValue) => {
              setSort(selectedValue as ProductSortOption);
              setPage(1);
            }}
            menuTitle="Sort Equipment"
            icon={<ArrowUpDown className="w-3.5 h-3.5" />}
            isActiveFilter={sort !== "newest"}
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
                value: "oldest",
                label: "Oldest First",
                icon: <Clock className="w-3.5 h-3.5" />,
              },
              {
                value: "name_asc",
                label: "Name (A - Z)",
                icon: <ArrowDownAZ className="w-3.5 h-3.5" />,
              },
              {
                value: "name_desc",
                label: "Name (Z - A)",
                icon: <ArrowUpZA className="w-3.5 h-3.5" />,
              },
              {
                value: "popular",
                label: "Most Viewed",
                icon: <TrendingUp className="w-3.5 h-3.5" />,
              },
            ]}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setFeaturedFilter((prev) => (prev === "true" ? "" : "true"));
                setPage(1);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                featuredFilter === "true"
                  ? "bg-amber-50 border-amber-300 text-amber-800"
                  : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>Featured Only</span>
            </button>

            {(search ||
              selectedCategory ||
              selectedSpecialty ||
              stockFilter ||
              featuredFilter ||
              sort !== "newest") && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear Filters</span>
              </button>
            )}
          </div>

          <p className="text-[11px] text-gray-400">
            Showing page {meta?.page ?? 1} of {meta?.totalPages ?? 1} (
            {statsSummary.total} total equipment records)
          </p>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/70 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                <th className="py-3.5 pl-5 pr-3">Instrument / SKU</th>
                <th className="py-3.5 px-3">Category & Specialty</th>
                <th className="py-3.5 px-3">Compliance</th>
                <th className="py-3.5 px-3">Stock & Lead Time</th>
                <th className="py-3.5 px-3">Updated</th>
                <th className="py-3.5 pl-3 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    Loading live surgical catalog from Elpima API...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    <Filter className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                    <p className="font-semibold text-gray-700">
                      No surgical equipment matched your filters
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Try clearing your search filters or add a new equipment
                      SKU.
                    </p>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="py-3.5 pl-5 pr-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            product.images?.[0] ||
                            "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=200&q=80"
                          }
                          alt={product.name}
                          className="w-11 h-11 rounded-xl object-cover border border-gray-200 shrink-0 bg-gray-100"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-gray-900 truncate max-w-[260px]">
                              {product.name}
                            </p>
                            {product.isFeatured && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800">
                                ★ Featured
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] font-mono text-gray-500 mt-0.5">
                            SKU: {product.sku || "N/A"} • MOQ:{" "}
                            {product.minOrderQuantity ?? 1}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <p className="font-semibold text-gray-800">
                        {product.category?.name || "Uncategorized"}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {product.specialty?.name || "General Clinical"}
                      </p>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {(product.compliance?.length
                          ? product.compliance
                          : (product.certifications ?? [])
                        )
                          .slice(0, 3)
                          .map((cert) => (
                            <span
                              key={cert}
                              className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold"
                            >
                              {cert}
                            </span>
                          ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <button
                        type="button"
                        onClick={() => handleQuickToggleStock(product)}
                        disabled={toggleStock.isPending}
                        title="Click to toggle stock availability"
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition cursor-pointer ${
                          product.inStock
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            product.inStock ? "bg-emerald-600" : "bg-rose-600"
                          }`}
                        />
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </button>
                      <p className="text-[10px] text-gray-400 mt-1 truncate max-w-[160px]">
                        {product.leadTime || "Immediate dispatch"}
                      </p>
                    </td>

                    <td className="py-3.5 px-3 text-gray-500 whitespace-nowrap">
                      {formatLiveDate(product.updatedAt || product.createdAt)}
                    </td>

                    <td className="py-3.5 pl-3 pr-5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setViewingProduct(product)}
                          className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition cursor-pointer"
                          title="Inspect specifications"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditModal(product)}
                          className="p-2 rounded-lg text-sky-600 hover:bg-sky-50 transition cursor-pointer"
                          title="Edit product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        {isSuperAdmin && (
                          <button
                            type="button"
                            onClick={() => setDeletingProduct(product)}
                            className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title="Delete product (Super-Admin)"
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

        {/* Pagination Footer */}
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

      {/* ================= CREATE / EDIT PRODUCT MODAL ================= */}
      <ProductFormModal
        isOpen={isFormOpen}
        editingProduct={editingProduct}
        categories={categories}
        specialties={specialties}
        totalProductsCount={meta?.total ?? products.length}
        onClose={() => setIsFormOpen(false)}
        onToast={onToast}
      />

      {/* ================= VIEW PRODUCT DETAILS MODAL ================= */}
      <ProductDetailModal
        product={viewingProduct}
        onClose={() => setViewingProduct(null)}
        onEdit={(target) => {
          setViewingProduct(null);
          openEditModal(target);
        }}
      />

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      <ProductDeleteDialog
        product={deletingProduct}
        isDeleting={deleteProduct.isPending}
        onCancel={() => setDeletingProduct(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default ProductsModule;

