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
  useCreateProductMutation,
  useDeleteProductMutation,
  useProductsQuery,
  useSpecialtiesQuery,
  useToggleProductStockMutation,
  useUpdateProductMutation,
  useUploadSingleImageMutation,
} from "@/hooks/queries";
import { useAuthStore } from "@/store";
import { FloatingSelect } from "@/components/app";
import type {
  CreateProductPayload,
  Product,
  ProductSortOption,
} from "@/types/domain";
import { formatLiveDate } from "@/utils/date";
import {
  deriveCategoryCodePrefix,
  generateClinicalSku,
  getDefaultSpecsForCategorySlug,
  HAS_PRODUCT_BLUEPRINTS,
  slugifyText,
} from "@/constants/clinical-taxonomy";

const COMPLIANCE_PRESETS = [
  "ISO 13485",
  "CE Mark",
  "CE Class IIa",
  "NAFDAC Approved",
  "FDA Registered",
  "ISO 9001",
  "IEC 60601-1",
];

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
  const createProduct = useCreateProductMutation();
  const updateProduct = useUpdateProductMutation();
  const toggleStock = useToggleProductStockMutation();
  const deleteProduct = useDeleteProductMutation();
  const uploadImage = useUploadSingleImageMutation();

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [formError, setFormError] = useState("");

  // Form state
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [specialtyId, setSpecialtyId] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [leadTime, setLeadTime] = useState("In Stock — Immediate Dispatch");
  const [minOrderQuantity, setMinOrderQuantity] = useState(1);
  const [inStock, setInStock] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [compliance, setCompliance] = useState<string[]>([
    "ISO 13485",
    "CE Mark",
  ]);
  const [customCompliance, setCustomCompliance] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
  ]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [specRows, setSpecRows] = useState<
    Array<{ key: string; value: string }>
  >([
    { key: "Material", value: "Medical Grade Stainless Steel" },
    { key: "Sterilization", value: "Steam Autoclavable (134°C)" },
  ]);

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

  const [selectedBlueprintSku, setSelectedBlueprintSku] = useState("");

  const resolveCategoryCodeById = (targetCategoryId: string): string => {
    const categoryItem = categories.find(
      (existingCategory) => existingCategory.id === targetCategoryId,
    );
    if (!categoryItem) return "END";
    return deriveCategoryCodePrefix(
      categoryItem.name,
      categoryItem.slug,
      categoryItem.description ?? undefined,
    );
  };

  const openCreateModal = () => {
    const initialCategory = categories[0];
    const initialCategoryCode = initialCategory
      ? deriveCategoryCodePrefix(
          initialCategory.name,
          initialCategory.slug,
          initialCategory.description ?? undefined,
        )
      : "END";
    const nextModelSeq = (meta?.total ?? products.length) + 1;

    setEditingProduct(null);
    setSelectedBlueprintSku("");
    setFormError("");
    setName("");
    setSku(
      generateClinicalSku(initialCategoryCode, "Surgical Stapler", nextModelSeq),
    );
    setSlug("");
    setCategoryId(initialCategory?.id ?? "");
    setSpecialtyId(specialties[0]?.id ?? "");
    setShortDescription("");
    setDescription("");
    setLeadTime("In Stock — Dispatched within 24 hours");
    setMinOrderQuantity(5);
    setInStock(true);
    setIsFeatured(false);
    setIsActive(true);
    setCompliance(["ISO 13485", "CE Mark", "NAFDAC Approved"]);
    setImageUrls([
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
    ]);
    setSpecRows(getDefaultSpecsForCategorySlug(initialCategory?.slug));
    setIsFormOpen(true);
  };

  const handleNameChange = (nextName: string) => {
    setName(nextName);
    if (!editingProduct) {
      setSlug(slugifyText(nextName));
      const categoryCode = resolveCategoryCodeById(categoryId);
      const nextModelSeq = (meta?.total ?? products.length) + 1;
      setSku(generateClinicalSku(categoryCode, nextName, nextModelSeq));
    }
  };

  const handleCategoryChange = (nextCategoryId: string) => {
    setCategoryId(nextCategoryId);
    const categoryItem = categories.find(
      (existingCategory) => existingCategory.id === nextCategoryId,
    );
    const categoryCode = resolveCategoryCodeById(nextCategoryId);
    if (!editingProduct) {
      const nextModelSeq = (meta?.total ?? products.length) + 1;
      setSku(
        generateClinicalSku(
          categoryCode,
          name || "Surgical Stapler",
          nextModelSeq,
        ),
      );
      if (!selectedBlueprintSku && categoryItem?.slug) {
        setSpecRows(getDefaultSpecsForCategorySlug(categoryItem.slug, name));
      }
    }
  };

  const handleRegenerateSku = () => {
    const categoryCode = resolveCategoryCodeById(categoryId);
    const nextModelSeq = (meta?.total ?? products.length) + 1;
    setSku(
      generateClinicalSku(
        categoryCode,
        name || "Surgical Stapler",
        nextModelSeq,
      ),
    );
  };

  const handleLoadCategorySpecs = () => {
    const categoryItem = categories.find(
      (existingCategory) => existingCategory.id === categoryId,
    );
    setSpecRows(getDefaultSpecsForCategorySlug(categoryItem?.slug, name));
  };

  const handleApplyBlueprint = (blueprintSku: string) => {
    setSelectedBlueprintSku(blueprintSku);
    const bp = HAS_PRODUCT_BLUEPRINTS.find((item) => item.sku === blueprintSku);
    if (!bp) return;

    const matchedCat = categories.find((c) => c.slug === bp.categorySlug);
    const matchedSpec = specialties.find((s) => s.slug === bp.specialtySlug);

    setName(bp.name);
    setSku(bp.sku);
    setSlug(bp.slug);
    if (matchedCat) setCategoryId(matchedCat.id);
    if (matchedSpec) setSpecialtyId(matchedSpec.id);
    setShortDescription(bp.shortDescription);
    setDescription(bp.description);
    setLeadTime(bp.leadTime);
    setMinOrderQuantity(bp.minOrderQuantity);
    setInStock(true);
    setIsFeatured(bp.isFeatured);
    setIsActive(true);
    setCompliance(bp.compliance);
    setSpecRows(
      Object.entries(bp.specifications).map(([key, value]) => ({
        key,
        value,
      })),
    );
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setSelectedBlueprintSku("");
    setFormError("");
    setName(product.name);
    setSku(product.sku ?? "");
    setSlug(product.slug ?? "");
    setCategoryId(product.categoryId || product.category?.id || "");
    setSpecialtyId(product.specialtyId || product.specialty?.id || "");
    setShortDescription(product.shortDescription ?? "");
    setDescription(product.description ?? product.fullDescription ?? "");
    setLeadTime(product.leadTime ?? "In Stock — Dispatched within 24 hours");
    setMinOrderQuantity(product.minOrderQuantity ?? 1);
    setInStock(product.inStock);
    setIsFeatured(product.isFeatured);
    setIsActive(product.isActive);
    setCompliance(
      product.compliance?.length
        ? product.compliance
        : (product.certifications ?? ["ISO 13485", "CE Mark", "NAFDAC Approved"]),
    );
    setImageUrls(
      product.images?.length
        ? product.images
        : [
            "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
          ],
    );
    const specsObj = product.specifications ?? {};
    const entries = Object.entries(specsObj).map(([k, v]) => ({
      key: k,
      value: String(v ?? ""),
    }));
    setSpecRows(
      entries.length > 0
        ? entries
        : getDefaultSpecsForCategorySlug(product.category?.slug, product.name),
    );
    setIsFormOpen(true);
  };

  const handleFileUpload = async (
    changeEvent: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = changeEvent.target.files?.[0];
    if (!file) return;

    const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"];
    if (!ALLOWED_MIME.includes(file.type)) {
      setFormError(
        `Invalid format for "${file.name}". Only JPEG, PNG, and WebP are allowed.`,
      );
      changeEvent.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setFormError(`"${file.name}" exceeds the 5MB size limit (${sizeMb}MB).`);
      changeEvent.target.value = "";
      return;
    }

    try {
      const uploaded = await uploadImage.mutateAsync(file);
      if (uploaded?.url) {
        setImageUrls((previousImageUrls) => [...previousImageUrls, uploaded.url]);
        onToast?.("Product image uploaded successfully");
      }
    } catch (uploadError: any) {
      setFormError(
        uploadError?.normalizedMessage ||
          uploadError?.response?.data?.message ||
          "Image upload failed. Ensure file is JPEG/PNG/WebP under 5MB.",
      );
    } finally {
      changeEvent.target.value = "";
    }
  };

  const handleSaveProduct = async (submitEvent: React.FormEvent) => {
    submitEvent.preventDefault();
    setFormError("");

    if (!name.trim()) {
      setFormError("Product name is required.");
      return;
    }
    if (!categoryId) {
      setFormError("Please select a surgical category.");
      return;
    }
    const validImages = imageUrls
      .map((imageUrl) => imageUrl.trim())
      .filter(
        (imageUrl) =>
          imageUrl &&
          (imageUrl.startsWith("https://") ||
            imageUrl.startsWith("/") ||
            imageUrl.startsWith("http://localhost")),
      );
    if (validImages.length === 0) {
      setFormError(
        "At least one valid product image URL (starting with https://) is required.",
      );
      return;
    }

    const specifications: Record<string, string> = {};
    specRows.forEach((row) => {
      if (row.key.trim() && row.value.trim()) {
        specifications[row.key.trim()] = row.value.trim();
      }
    });

    const payload: CreateProductPayload = {
      name: name.trim(),
      ...(slug.trim() ? { slug: slug.trim().toLowerCase() } : {}),
      sku: sku.trim() || null,
      categoryId,
      specialtyId: specialtyId || null,
      shortDescription: shortDescription.trim() || null,
      description: description.trim() || null,
      specifications,
      compliance,
      images: validImages,
      inStock,
      leadTime: leadTime.trim() || null,
      minOrderQuantity: Number(minOrderQuantity) || 1,
      isFeatured,
      isActive,
    };

    try {
      if (editingProduct) {
        await updateProduct.mutateAsync({
          id: editingProduct.id,
          payload,
        });
        onToast?.(`Updated "${name.trim()}"`);
      } else {
        await createProduct.mutateAsync(payload);
        onToast?.(`Created "${name.trim()}"`);
      }
      setIsFormOpen(false);
    } catch (mutationError: any) {
      setFormError(
        mutationError?.normalizedMessage ||
          mutationError?.response?.data?.message ||
          "Failed to save product. Check all fields and try again.",
      );
    }
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
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-gray-50/40 text-xs">
            <span className="text-gray-500">
              Page <strong>{meta.page}</strong> of{" "}
              <strong>{meta.totalPages ?? meta.pages}</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() =>
                  setPage((previousPage) => Math.max(1, previousPage - 1))
                }
                className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 font-semibold disabled:opacity-40 hover:bg-gray-50 cursor-pointer"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= (meta.totalPages ?? meta.pages ?? 1)}
                onClick={() => setPage((previousPage) => previousPage + 1)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 font-semibold disabled:opacity-40 hover:bg-gray-50 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= CREATE / EDIT PRODUCT MODAL ================= */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-gray-900">
                  {editingProduct
                    ? `Edit Equipment: ${editingProduct.name}`
                    : "Add New Surgical Equipment SKU"}
                </h2>
                <p className="text-xs text-gray-500">
                  All fields sync directly with the Elpima Surgicals catalog API
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSaveProduct}
              className="flex-1 overflow-y-auto p-6 space-y-5 text-xs"
            >
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-medium">
                  {formError}
                </div>
              )}

              {/* Quick-Fill HAS Medical Stapler Blueprint Selector */}
              {!editingProduct && (
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#2E7D5B]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>
                        HAS Medical Stapler Blueprint Template (16 Clinical Models)
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-semibold text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                      SKU Formula: ELP-[CAT]-[DEV]-[###]
                    </span>
                  </div>
                  <FloatingSelect
                    value={selectedBlueprintSku}
                    onChange={(selectedSku) => handleApplyBlueprint(selectedSku)}
                    menuTitle="Select HAS Medical Stapler Model Blueprint"
                    placeholder="Choose one of the 16 HAS Medical Stapler models to auto-fill specs & SKU..."
                    icon={<Wand2 className="w-3.5 h-3.5" />}
                    isActiveFilter={Boolean(selectedBlueprintSku)}
                    matchWidth
                    className="w-full text-xs"
                    options={[
                      {
                        value: "",
                        label: "Custom Surgical Equipment (Manual Entry)",
                      },
                      ...HAS_PRODUCT_BLUEPRINTS.map((bp) => ({
                        value: bp.sku,
                        label: `${bp.sku} — ${bp.name} (${bp.modelRef})`,
                      })),
                    ]}
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">
                    EQUIPMENT NAME *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(changeEvent) =>
                      handleNameChange(changeEvent.target.value)
                    }
                    placeholder="e.g. Disposable Endo Cutter Stapler"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2E7D5B]"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-gray-700">
                      CLINICAL SKU CODE *
                    </label>
                    <button
                      type="button"
                      onClick={handleRegenerateSku}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2E7D5B] hover:underline cursor-pointer"
                      title="Generate ELP-[CAT]-[DEV]-[###] SKU from Category & Name"
                    >
                      <Wand2 className="w-3 h-3" />
                      <span>Auto-Generate SKU</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={sku}
                    onChange={(changeEvent) =>
                      setSku(changeEvent.target.value.toUpperCase())
                    }
                    placeholder="ELP-END-ECS-002"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 font-mono font-bold text-[#2E7D5B] focus:outline-none focus:border-[#2E7D5B]"
                  />
                  <p className="text-[10px] text-gray-400 mt-1 font-mono">
                    Standard: ELP-[END|OPN|SPC|CLS|LAP]-[3-Letter Device]-[Model #]
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    URL SLUG (Auto-generated from Name)
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(changeEvent) => setSlug(changeEvent.target.value)}
                    placeholder="disposable-endo-cutter-stapler"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 font-mono focus:outline-none focus:border-[#2E7D5B]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    SURGICAL CATEGORY *
                  </label>
                  <FloatingSelect
                    value={categoryId}
                    onChange={(selectedCategoryId) =>
                      handleCategoryChange(selectedCategoryId)
                    }
                    placeholder="Select Category"
                    matchWidth
                    className="w-full text-xs"
                    options={[
                      { value: "", label: "Select Category" },
                      ...categories.map((categoryItem) => {
                        const prefix = deriveCategoryCodePrefix(
                          categoryItem.name,
                          categoryItem.slug,
                          categoryItem.description ?? undefined,
                        );
                        return {
                          value: categoryItem.id,
                          label: `[${prefix}] ${categoryItem.name}`,
                        };
                      }),
                    ]}
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    MEDICAL SPECIALTY
                  </label>
                  <FloatingSelect
                    value={specialtyId}
                    onChange={(selectedSpecialtyId) =>
                      setSpecialtyId(selectedSpecialtyId)
                    }
                    placeholder="None / General Clinical"
                    matchWidth
                    className="w-full text-xs"
                    options={[
                      { value: "", label: "None / General Clinical" },
                      ...specialties.map((specialtyItem) => ({
                        value: specialtyItem.id,
                        label: specialtyItem.name,
                      })),
                    ]}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">
                    SHORT SUMMARY
                  </label>
                  <input
                    type="text"
                    value={shortDescription}
                    onChange={(changeEvent) =>
                      setShortDescription(changeEvent.target.value)
                    }
                    placeholder="Brief clinical summary shown on catalog cards..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2E7D5B]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">
                    DETAILED CLINICAL DESCRIPTION
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(changeEvent) =>
                      setDescription(changeEvent.target.value)
                    }
                    placeholder="Detailed engineering, material, and surgical application overview..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2E7D5B]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    DISPATCH LEAD TIME
                  </label>
                  <input
                    type="text"
                    value={leadTime}
                    onChange={(changeEvent) =>
                      setLeadTime(changeEvent.target.value)
                    }
                    placeholder="In Stock — Dispatched within 24 hours"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2E7D5B]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    MINIMUM ORDER QUANTITY (MOQ)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={minOrderQuantity}
                    onChange={(changeEvent) =>
                      setMinOrderQuantity(Number(changeEvent.target.value) || 1)
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2E7D5B]"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-5 pt-1">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(changeEvent) =>
                      setInStock(changeEvent.target.checked)
                    }
                    className="rounded text-[#2E7D5B]"
                  />
                  <span className="font-semibold text-gray-800">
                    In Stock & Available
                  </span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(changeEvent) =>
                      setIsFeatured(changeEvent.target.checked)
                    }
                    className="rounded text-[#2E7D5B]"
                  />
                  <span className="font-semibold text-gray-800">
                    Featured on Homepage
                  </span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(changeEvent) =>
                      setIsActive(changeEvent.target.checked)
                    }
                    className="rounded text-[#2E7D5B]"
                  />
                  <span className="font-semibold text-gray-800">
                    Active in Public Storefront
                  </span>
                </label>
              </div>

              {/* Compliance Standards */}
              <div>
                <label className="block font-bold text-gray-700 mb-2">
                  REGULATORY COMPLIANCE & CERTIFICATIONS
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {COMPLIANCE_PRESETS.map((preset) => {
                    const active = compliance.includes(preset);
                    return (
                      <button
                        key={preset}
                        type="button"
                        onClick={() =>
                          setCompliance((previousCompliance) =>
                            active
                              ? previousCompliance.filter((item) => item !== preset)
                              : [...previousCompliance, preset],
                          )
                        }
                        className={`px-3 py-1 rounded-full text-[11px] font-semibold border transition cursor-pointer ${
                          active
                            ? "bg-[#2E7D5B] text-white border-[#2E7D5B]"
                            : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        {preset}
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customCompliance}
                    onChange={(changeEvent) =>
                      setCustomCompliance(changeEvent.target.value)
                    }
                    placeholder="Add custom standard (e.g. SONCAP)..."
                    className="flex-1 px-3 py-2 rounded-xl border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        customCompliance.trim() &&
                        !compliance.includes(customCompliance.trim())
                      ) {
                        setCompliance((previousCompliance) => [
                          ...previousCompliance,
                          customCompliance.trim(),
                        ]);
                        setCustomCompliance("");
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 font-semibold text-gray-700"
                  >
                    Add Tag
                  </button>
                </div>
              </div>

              {/* Technical Specifications Key-Value Builder */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div>
                    <label className="font-bold text-gray-700">
                      TECHNICAL SPECIFICATIONS (HAS CLINICAL FORMAT)
                    </label>
                    <p className="text-[10px] text-gray-400">
                      Standard parameters: Model Reference, Sizes/Lengths, Staple Rows/Heights, Material & EO Sterilization
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleLoadCategorySpecs}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-[#2E7D5B] font-bold hover:bg-emerald-100 cursor-pointer"
                      title="Load the default clinical specification parameters for the selected category"
                    >
                      <Wand2 className="w-3 h-3" />
                      <span>Load Category Spec Schema</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setSpecRows((previousRows) => [
                          ...previousRows,
                          { key: "", value: "" },
                        ])
                      }
                      className="text-[#2E7D5B] font-bold hover:underline cursor-pointer"
                    >
                      + Add Specification Row
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  {specRows.map((specificationRow, rowIndex) => (
                    <div key={rowIndex} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={specificationRow.key}
                        onChange={(changeEvent) =>
                          setSpecRows((previousRows) =>
                            previousRows.map((rowItem, itemIndex) =>
                              itemIndex === rowIndex
                                ? { ...rowItem, key: changeEvent.target.value }
                                : rowItem,
                            ),
                          )
                        }
                        placeholder="Parameter (e.g. Diameter)"
                        className="w-1/3 px-3 py-2 rounded-xl border border-gray-200"
                      />
                      <input
                        type="text"
                        value={specificationRow.value}
                        onChange={(changeEvent) =>
                          setSpecRows((previousRows) =>
                            previousRows.map((rowItem, itemIndex) =>
                              itemIndex === rowIndex
                                ? { ...rowItem, value: changeEvent.target.value }
                                : rowItem,
                            ),
                          )
                        }
                        placeholder="Value (e.g. 10mm x 300mm)"
                        className="flex-1 px-3 py-2 rounded-xl border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setSpecRows((previousRows) =>
                            previousRows.filter(
                              (_, itemIndex) => itemIndex !== rowIndex,
                            ),
                          )
                        }
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Images & Direct File Upload */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-gray-700">
                    PRODUCT IMAGES (Min 1 required) *
                  </label>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 font-semibold cursor-pointer hover:bg-emerald-100">
                    <ImagePlus className="w-3.5 h-3.5" />
                    <span>
                      {uploadImage.isPending
                        ? "Uploading..."
                        : "Upload Image File"}
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="space-y-2 mb-2">
                  {imageUrls.map((imageUrl, imageIndex) => (
                    <div key={imageIndex} className="flex items-center gap-2">
                      <img
                        src={imageUrl}
                        alt=""
                        className="w-8 h-8 rounded-lg object-cover border border-gray-200 shrink-0"
                      />
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(changeEvent) =>
                          setImageUrls((previousUrls) =>
                            previousUrls.map((urlItem, itemIndex) =>
                              itemIndex === imageIndex
                                ? changeEvent.target.value
                                : urlItem,
                            ),
                          )
                        }
                        className="flex-1 px-3 py-2 rounded-xl border border-gray-200 font-mono text-[11px]"
                      />
                      {imageUrls.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setImageUrls((previousUrls) =>
                              previousUrls.filter(
                                (_, itemIndex) => itemIndex !== imageIndex,
                              ),
                            )
                          }
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(changeEvent) =>
                      setNewImageUrl(changeEvent.target.value)
                    }
                    placeholder="Paste additional image URL (https://...)"
                    className="flex-1 px-3 py-2 rounded-xl border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newImageUrl.trim()) {
                        setImageUrls((previousUrls) => [
                          ...previousUrls,
                          newImageUrl.trim(),
                        ]);
                        setNewImageUrl("");
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 font-semibold text-gray-700"
                  >
                    Add URL
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createProduct.isPending || updateProduct.isPending}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2E7D5B] hover:bg-[#256649] text-white font-bold shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {createProduct.isPending || updateProduct.isPending
                      ? "Saving..."
                      : editingProduct
                        ? "Save Changes"
                        : "Create Equipment"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= VIEW PRODUCT DETAILS MODAL ================= */}
      {viewingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={viewingProduct.images?.[0]}
                  alt={viewingProduct.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-gray-200"
                />
                <div>
                  <span className="text-[11px] font-mono font-semibold text-[#2E7D5B]">
                    SKU: {viewingProduct.sku || "N/A"}
                  </span>
                  <h3 className="text-lg font-extrabold text-gray-900">
                    {viewingProduct.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {viewingProduct.category?.name} •{" "}
                    {viewingProduct.specialty?.name || "General Surgery"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingProduct(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {viewingProduct.shortDescription && (
              <p className="text-xs font-medium text-gray-700 bg-gray-50 p-3.5 rounded-xl">
                {viewingProduct.shortDescription}
              </p>
            )}

            {(viewingProduct.description || viewingProduct.fullDescription) && (
              <div className="text-xs text-gray-600 leading-relaxed">
                <h4 className="font-bold text-gray-800 uppercase mb-1">
                  Clinical Description
                </h4>
                <p>
                  {viewingProduct.description || viewingProduct.fullDescription}
                </p>
              </div>
            )}

            {viewingProduct.specifications &&
              Object.keys(viewingProduct.specifications).length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-800 uppercase mb-2">
                    Technical Specifications
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {Object.entries(viewingProduct.specifications).map(
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
              <span>
                Last Updated: {formatLiveDate(viewingProduct.updatedAt, true)}
              </span>
              <button
                type="button"
                onClick={() => {
                  const target = viewingProduct;
                  setViewingProduct(null);
                  openEditModal(target);
                }}
                className="px-4 py-2 rounded-xl bg-[#2E7D5B] text-white font-bold"
              >
                Edit SKU
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
            <h3 className="text-base font-extrabold text-gray-900">
              Delete Surgical Equipment?
            </h3>
            <p className="text-xs text-gray-600 mt-1.5">
              Are you sure you want to remove{" "}
              <strong>{deletingProduct.name}</strong> from the catalog?
            </p>
            <div className="flex justify-end gap-2.5 mt-5">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleteProduct.isPending}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white"
              >
                {deleteProduct.isPending ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsModule;

