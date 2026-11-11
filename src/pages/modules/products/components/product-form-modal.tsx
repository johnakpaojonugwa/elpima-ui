// src/pages/modules/products/components/product-form-modal.tsx
import React, { useEffect, useState } from "react";
import { Check, ImagePlus, Sparkles, Wand2, X } from "lucide-react";
import { FloatingSelect } from "@/components/app";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadSingleImageMutation,
} from "@/hooks/queries";
import type {
  Category,
  CreateProductPayload,
  Product,
  Specialty,
} from "@/types/domain";
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

export interface ProductFormModalProps {
  isOpen: boolean;
  editingProduct: Product | null;
  categories: Category[];
  specialties: Specialty[];
  totalProductsCount: number;
  onClose: () => void;
  onToast?: (message: string) => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  editingProduct,
  categories,
  specialties,
  totalProductsCount,
  onClose,
  onToast,
}) => {
  const createProduct = useCreateProductMutation();
  const updateProduct = useUpdateProductMutation();
  const uploadImage = useUploadSingleImageMutation();

  const [formError, setFormError] = useState("");
  const [selectedBlueprintSku, setSelectedBlueprintSku] = useState("");

  // Form fields
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [specialtyId, setSpecialtyId] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [leadTime, setLeadTime] = useState("In Stock — Dispatched within 24 hours");
  const [minOrderQuantity, setMinOrderQuantity] = useState(1);
  const [inStock, setInStock] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [compliance, setCompliance] = useState<string[]>([
    "ISO 13485",
    "CE Mark",
    "NAFDAC Approved",
  ]);
  const [customCompliance, setCustomCompliance] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
  ]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [specRows, setSpecRows] = useState<Array<{ key: string; value: string }>>([
    { key: "Material", value: "Medical Grade Stainless Steel" },
    { key: "Sterilization", value: "Steam Autoclavable (134°C)" },
  ]);

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

  // Sync form state when modal opens or editingProduct changes
  useEffect(() => {
    if (!isOpen) return;

    if (editingProduct) {
      setSelectedBlueprintSku("");
      setFormError("");
      setName(editingProduct.name);
      setSku(editingProduct.sku ?? "");
      setSlug(editingProduct.slug ?? "");
      setCategoryId(
        editingProduct.categoryId || editingProduct.category?.id || "",
      );
      setSpecialtyId(
        editingProduct.specialtyId || editingProduct.specialty?.id || "",
      );
      setShortDescription(editingProduct.shortDescription ?? "");
      setDescription(
        editingProduct.description ?? editingProduct.fullDescription ?? "",
      );
      setLeadTime(
        editingProduct.leadTime ?? "In Stock — Dispatched within 24 hours",
      );
      setMinOrderQuantity(editingProduct.minOrderQuantity ?? 1);
      setInStock(editingProduct.inStock);
      setIsFeatured(editingProduct.isFeatured);
      setIsActive(editingProduct.isActive);
      setCompliance(
        editingProduct.compliance?.length
          ? editingProduct.compliance
          : (editingProduct.certifications ?? [
              "ISO 13485",
              "CE Mark",
              "NAFDAC Approved",
            ]),
      );
      setImageUrls(
        editingProduct.images?.length
          ? editingProduct.images
          : [
              "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
            ],
      );
      const specsObj = editingProduct.specifications ?? {};
      const entries = Object.entries(specsObj).map(([k, v]) => ({
        key: k,
        value: String(v ?? ""),
      }));
      setSpecRows(
        entries.length > 0
          ? entries
          : getDefaultSpecsForCategorySlug(
              editingProduct.category?.slug,
              editingProduct.name,
            ),
      );
    } else {
      const initialCategory = categories[0];
      const initialCategoryCode = initialCategory
        ? deriveCategoryCodePrefix(
            initialCategory.name,
            initialCategory.slug,
            initialCategory.description ?? undefined,
          )
        : "END";
      const nextModelSeq = totalProductsCount + 1;

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
    }
  }, [isOpen, editingProduct, categories, specialties, totalProductsCount]);

  if (!isOpen) return null;

  const handleNameChange = (nextName: string) => {
    setName(nextName);
    if (!editingProduct) {
      setSlug(slugifyText(nextName));
      const categoryCode = resolveCategoryCodeById(categoryId);
      const nextModelSeq = totalProductsCount + 1;
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
      const nextModelSeq = totalProductsCount + 1;
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
    const nextModelSeq = totalProductsCount + 1;
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
      onClose();
    } catch (mutationError: any) {
      setFormError(
        mutationError?.normalizedMessage ||
          mutationError?.response?.data?.message ||
          "Could not save equipment. Please verify all clinical fields.",
      );
    }
  };

  return (
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
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
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
                className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 font-semibold text-gray-700 cursor-pointer"
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
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
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
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
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
                className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 font-semibold text-gray-700 cursor-pointer"
              >
                Add URL
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
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
  );
};

export default ProductFormModal;

