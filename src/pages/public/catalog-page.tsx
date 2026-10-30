import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  CheckCircle2,
  ExternalLink,
  FolderTree,
  Grid3X3,
  List,
  Package,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  X,
} from "lucide-react";
import { FloatingSelect, Pagination } from "@/components/app";
import {
  useCategoriesQuery,
  useProductsQuery,
  useSpecialtiesQuery,
} from "@/hooks/queries";
import { ROUTES } from "@/routes";
import { useQuoteBagStore } from "@/store/quote-bag-store";
import { toast } from "@/hooks/use-toast";
import type { Product } from "@/types/domain";

export const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const categoryFilter = searchParams.get("category") || "";
  const specialtyFilter = searchParams.get("specialty") || "";
  const inStockFilter = searchParams.get("inStock") === "true";
  const initialPage = Number(searchParams.get("page")) || 1;

  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [page, setPage] = useState(initialPage);
  const [onlyInStock, setOnlyInStock] = useState(inStockFilter);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const addItemToQuoteBag = useQuoteBagStore((state) => state.addItem);
  const quoteItems = useQuoteBagStore((state) => state.items);
  const totalQuoteCount = quoteItems.reduce(
    (accumulator, currentItem) => accumulator + currentItem.quantity,
    0,
  );

  // Debounce search input by 300ms
  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(searchTimeout);
  }, [search]);

  const { data: productsData, isLoading: isLoadingProducts } = useProductsQuery({
    search: debouncedSearch.trim() || undefined,
    category: categoryFilter || undefined,
    specialty: specialtyFilter || undefined,
    page,
    limit: 12,
  });

  const { data: categories = [] } = useCategoriesQuery();
  const { data: specialties = [] } = useSpecialtiesQuery();

  const updateSearchParameter = (
    parameterKey: string,
    parameterValue: string | boolean | undefined,
  ) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    if (parameterValue !== undefined && parameterValue !== "") {
      nextSearchParams.set(parameterKey, String(parameterValue));
    } else {
      nextSearchParams.delete(parameterKey);
    }
    setPage(1);
    nextSearchParams.delete("page");
    setSearchParams(nextSearchParams);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const nextSearchParams = new URLSearchParams(searchParams);
    if (newPage > 1) {
      nextSearchParams.set("page", String(newPage));
    } else {
      nextSearchParams.delete("page");
    }
    setSearchParams(nextSearchParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearAllFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setOnlyInStock(false);
    setPage(1);
    setSearchParams(new URLSearchParams());
  };

  const displayedProducts = useMemo(() => {
    if (!productsData?.items) return [];
    if (onlyInStock) {
      return productsData.items.filter((productItem: Product) => productItem.inStock);
    }
    return productsData.items;
  }, [productsData, onlyInStock]);

  const handleAddProductToQuote = (product: Product) => {
    addItemToQuoteBag({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      category: product.category?.name,
      image: product.images?.[0],
    });
    toast.success(`"${product.name}" added to RFQ Bag`);
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-16 playpen-sans">
      {/* SECTION 1: GET-TREAT STYLE PAGE HEADER */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 pt-40 w-[90%] md:w-[95%] lg:w-[80%] mx-auto pb-10">
        <div>
          <h1 className="font-[500] md:font-semibold lg:font-semibold text-[28px] md:text-5xl lg:text-5xl mb-4 md:mb-0 text-teal-600">
            EQUIPMENT CATALOG
          </h1>
        </div>
        <div>
          <p className="text-md tracking-wider md:mr-10 text-[#6F7787] md:text-stone-800 leading-relaxed font-light">
            Certified surgical instruments, anesthesia telemetry, endoscopic towers, and hospital theater equipment with authenticated NAFDAC and CE lot numbers across Nigeria.
          </p>
        </div>
      </section>

      <div className="w-[90%] md:w-[95%] lg:w-[80%] mx-auto space-y-8">
        {/* Filter Controls Bar */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-2xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-stone-100 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-stone-500 mb-1">
                <Link to={ROUTES.PUBLIC.HOME} className="hover:text-teal-700 transition-colors">
                  HOME
                </Link>
                <span>/</span>
                <span className="text-teal-700">TECHNICAL EQUIPMENT DIRECTORY</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-teal-600 tracking-tight">
                Hospital Surgical & Diagnostic Inventory
              </h2>
            </div>

            {/* Quick Quote Bag Floating Pill */}
            <Link
              to={ROUTES.PUBLIC.QUOTE_REQUEST}
              className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#FAF6EE] border border-[#D4AF37]/50 text-[#8E702D] hover:bg-[#F3EDE0] transition-colors shadow-2xs self-start"
            >
              <ShoppingBag className="w-4 h-4 text-teal-700" />
              <div className="text-left font-mono">
                <p className="text-xs font-bold">RFQ BATCH</p>
                <p className="text-[11px] text-stone-500">
                  {totalQuoteCount} {totalQuoteCount === 1 ? "unit" : "units"} queued
                </p>
              </div>
            </Link>
          </div>

          {/* Search Bar & Multi-Select Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[280px] max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={search}
                onChange={(changeEvent) => setSearch(changeEvent.target.value)}
                placeholder="Search by instrument name, brand, or SKU..."
                className="w-full rounded-xl border border-stone-300 bg-stone-50/60 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-600 focus:outline-none transition-all font-sans"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <FloatingSelect
              value={categoryFilter}
              onChange={(selectedValue) =>
                updateSearchParameter("category", selectedValue)
              }
              menuTitle="Filter by Equipment Category"
              icon={<FolderTree className="w-4 h-4" />}
              isActiveFilter={Boolean(categoryFilter)}
              minWidth={240}
              options={[
                {
                  value: "",
                  label: "All Equipment Categories",
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
              value={specialtyFilter}
              onChange={(selectedValue) =>
                updateSearchParameter("specialty", selectedValue)
              }
              menuTitle="Filter by Surgical Specialty"
              icon={<Stethoscope className="w-4 h-4" />}
              isActiveFilter={Boolean(specialtyFilter)}
              minWidth={240}
              options={[
                {
                  value: "",
                  label: "All Surgical Specialties",
                  icon: <Stethoscope className="w-3.5 h-3.5" />,
                },
                ...specialties.map((specialtyItem) => ({
                  value: specialtyItem.slug,
                  label: specialtyItem.name,
                  icon: <Stethoscope className="w-3.5 h-3.5" />,
                })),
              ]}
            />

            {/* In-Stock Toggle */}
            <button
              type="button"
              onClick={() => {
                const nextState = !onlyInStock;
                setOnlyInStock(nextState);
                updateSearchParameter("inStock", nextState ? true : undefined);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-mono font-bold transition-colors cursor-pointer ${
                onlyInStock
                  ? "bg-teal-50 border-teal-600 text-teal-800"
                  : "bg-white border-stone-300 text-stone-700 hover:bg-stone-50"
              }`}
            >
              <CheckCircle2
                className={`w-3.5 h-3.5 ${
                  onlyInStock ? "text-teal-600" : "text-stone-400"
                }`}
              />
              <span>IMMEDIATE DISPATCH</span>
            </button>

            {/* View Mode Switcher */}
            <div className="hidden sm:inline-flex items-center border border-stone-200 rounded-xl bg-stone-100 p-0.5 ml-auto">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white text-teal-700 shadow-2xs"
                    : "text-stone-500 hover:text-stone-800"
                }`}
                title="Grid View"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  viewMode === "table"
                    ? "bg-white text-teal-700 shadow-2xs"
                    : "text-stone-500 hover:text-stone-800"
                }`}
                title="Table Procurement View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Reset Filters */}
            {(search || categoryFilter || specialtyFilter || onlyInStock) && (
              <button
                type="button"
                onClick={handleClearAllFilters}
                className="inline-flex items-center gap-1 px-3 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold font-mono transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>CLEAR FILTERS</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Counter & Telemetry Bar */}
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-stone-600 font-mono px-1">
            <span>
              SHOWING <strong className="text-stone-900 font-bold">{displayedProducts.length}</strong> INSTRUMENTS
              {productsData?.pagination?.total
                ? ` [OF ${productsData.pagination.total} TOTAL SKUS]`
                : ""}
            </span>

            <span className="text-[#8E702D] font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              DIN EN ISO 13485:2016 QUALITY VERIFIED
            </span>
          </div>

          {isLoadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((loadingSkeletonIndex) => (
                <div
                  key={loadingSkeletonIndex}
                  className="rounded-3xl border border-stone-200 bg-white p-6 space-y-4 animate-pulse"
                >
                  <div className="h-48 bg-stone-100 rounded-2xl" />
                  <div className="h-4 bg-stone-200 rounded w-1/3" />
                  <div className="h-6 bg-stone-200 rounded w-3/4" />
                  <div className="h-10 bg-stone-100 rounded-xl" />
                </div>
              ))}
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="rounded-3xl border border-stone-200 bg-white p-12 text-center space-y-4 shadow-2xs">
              <div className="w-14 h-14 rounded-2xl bg-[#FAF6EE] text-[#D4AF37] border border-[#D4AF37]/30 flex items-center justify-center mx-auto">
                <Package className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">
                No Clinical Instruments Found
              </h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                No surgical equipment matched your current search filters. Adjust your search terms or reset filters to browse the complete directory.
              </p>
              <button
                type="button"
                onClick={handleClearAllFilters}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs font-mono shadow-xs transition-colors cursor-pointer"
              >
                RESET ALL FILTERS
              </button>
            </div>
          ) : viewMode === "grid" ? (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {displayedProducts.map((productItem: Product) => (
                <div
                  key={productItem.id}
                  className="group bg-white rounded-3xl border border-stone-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                >
                  {/* Visual Header */}
                  <div className="relative h-56 bg-stone-100 overflow-hidden border-b border-stone-100">
                    <img
                      src={
                        productItem.images?.[0] ||
                        "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop"
                      }
                      alt={productItem.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />

                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-teal-700 text-white shadow-2xs">
                        {productItem.category?.name || "Equipment"}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold shadow-2xs ${
                          productItem.inStock
                            ? "bg-emerald-600 text-white"
                            : "bg-amber-600 text-white"
                        }`}
                      >
                        {productItem.inStock ? "IN STOCK" : productItem.leadTime || "LEAD TIME"}
                      </span>
                    </div>

                    <div className="absolute bottom-2 left-3 px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[10px] font-mono text-[#D4AF37]">
                      SKU: {productItem.sku || "ELP-MED"}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-stone-500">
                        <span>{productItem.specialty?.name || "Clinical Surgery"}</span>
                        <span className="text-stone-400">
                          {productItem.brand || "Elpima Certified"}
                        </span>
                      </div>

                      <Link
                        to={`/products/${productItem.slug}`}
                        className="block mt-1 font-bold text-base text-stone-900 group-hover:text-teal-700 transition-colors line-clamp-1"
                      >
                        {productItem.name}
                      </Link>

                      <p className="text-xs text-stone-600 line-clamp-2 mt-2 leading-relaxed">
                        {productItem.shortDescription ||
                          productItem.description ||
                          "Hospital-ready surgical device with CE conformity, manufacturer warranty, and local biomedical engineer calibration."}
                      </p>
                    </div>

                    {/* Technical Micro-Pills */}
                    <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70 text-[11px] font-mono flex items-center justify-between">
                      <span className="text-stone-500">Sterilization:</span>
                      <span className="text-teal-700 font-bold">134°C Autoclavable</span>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddProductToQuote(productItem)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold font-mono shadow-2xs transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>ADD TO RFQ BAG</span>
                      </button>

                      <Link
                        to={`/products/${productItem.slug}`}
                        className="p-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-[#FAF6EE] hover:text-[#8E702D] hover:border-[#D4AF37]/50 transition-colors"
                        title="View Full Clinical Specifications"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Table Procurement Scan View */
            <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-mono font-bold uppercase text-stone-500">
                      <th className="py-4 px-5">SKU & Code</th>
                      <th className="py-4 px-4">Instrument / Equipment</th>
                      <th className="py-4 px-4">Category</th>
                      <th className="py-4 px-4">Specialty</th>
                      <th className="py-4 px-4">Status</th>
                      <th className="py-4 px-5 text-right">Procurement Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-sans">
                    {displayedProducts.map((productItem: Product) => (
                      <tr
                        key={productItem.id}
                        className="hover:bg-teal-50/20 transition-colors"
                      >
                        <td className="py-3.5 px-5 font-mono text-[11px] font-bold text-[#8E702D]">
                          {productItem.sku || "ELP-MED"}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-stone-900">
                          <Link
                            to={`/products/${productItem.slug}`}
                            className="hover:text-teal-700 transition-colors"
                          >
                            {productItem.name}
                          </Link>
                        </td>
                        <td className="py-3.5 px-4 text-stone-600">
                          {productItem.category?.name || "Equipment"}
                        </td>
                        <td className="py-3.5 px-4 text-stone-600">
                          {productItem.specialty?.name || "Surgery"}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                              productItem.inStock
                                ? "bg-emerald-50 text-emerald-800"
                                : "bg-amber-50 text-amber-800"
                            }`}
                          >
                            {productItem.inStock ? "In Stock" : "Lead Time"}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <button
                            type="button"
                            onClick={() => handleAddProductToQuote(productItem)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-mono text-xs font-bold transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add to RFQ</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Standardized Pagination Component */}
          {Boolean(
            productsData?.pagination &&
              (productsData.pagination.totalPages ?? 1) > 1,
          ) && (
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
              <Pagination
                currentPage={productsData?.pagination?.page ?? 1}
                totalPages={productsData?.pagination?.totalPages ?? 1}
                onPageChange={handlePageChange}
                className="pt-0"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;
