import React, { useMemo, useState } from "react";
import {
  ArrowDownAZ,
  ArrowUpDown,
  ArrowUpZA,
  Check,
  Edit3,
  Filter,
  FolderTree,
  Package,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import {
  useCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from "@/hooks/queries";
import { useAuthStore } from "@/store";
import { FloatingSelect } from "@/components/app";
import type { Category } from "@/types/domain";
import { formatLiveDate } from "@/utils/date";
import {
  CLINICAL_CATEGORY_PRESETS,
  deriveCategoryCodePrefix,
  slugifyText,
  type ClinicalCategoryPreset,
} from "@/constants/clinical-taxonomy";

interface CategoriesModuleProps {
  onToast?: (message: string) => void;
}

export const CategoriesModule: React.FC<CategoriesModuleProps> = ({
  onToast,
}) => {
  const userRole = useAuthStore((s) => s.user?.role) ?? "SUPERVISING_MANAGER";
  const isSuperAdmin = userRole === "SUPER_ADMIN";

  const {
    data: categories = [],
    isLoading,
    isFetching,
    refetch,
  } = useCategoriesQuery({ includeInactive: true });

  const createCategory = useCreateCategoryMutation();
  const updateCategory = useUpdateCategoryMutation();
  const deleteCategory = useDeleteCategoryMutation();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [sortBy, setSortBy] = useState<
    "order" | "name_asc" | "name_desc" | "products_desc"
  >("order");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null,
  );
  const [formError, setFormError] = useState("");

  // Form fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [codePrefix, setCodePrefix] = useState("END");
  const [description, setDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState(1);
  const [imageUrl, setImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true);

  const filteredCategories = useMemo(() => {
    const searchQuery = search.trim().toLowerCase();
    return categories
      .filter((categoryItem) => {
        if (statusFilter === "active" && !categoryItem.isActive) return false;
        if (statusFilter === "inactive" && categoryItem.isActive) return false;
        const prefix = deriveCategoryCodePrefix(
          categoryItem.name,
          categoryItem.slug,
          categoryItem.description ?? undefined,
        ).toLowerCase();
        if (
          searchQuery &&
          !categoryItem.name.toLowerCase().includes(searchQuery) &&
          !categoryItem.slug.toLowerCase().includes(searchQuery) &&
          !prefix.includes(searchQuery) &&
          !(categoryItem.description ?? "").toLowerCase().includes(searchQuery)
        ) {
          return false;
        }
        return true;
      })
      .sort((firstCategory, secondCategory) => {
        if (sortBy === "name_asc")
          return firstCategory.name.localeCompare(secondCategory.name);
        if (sortBy === "name_desc")
          return secondCategory.name.localeCompare(firstCategory.name);
        if (sortBy === "products_desc") {
          return (
            (secondCategory._count?.products ?? 0) -
            (firstCategory._count?.products ?? 0)
          );
        }
        return (
          (firstCategory.displayOrder ?? 0) - (secondCategory.displayOrder ?? 0)
        );
      });
  }, [categories, search, statusFilter, sortBy]);

  const openCreate = () => {
    setEditingCategory(null);
    setFormError("");
    setName("");
    setSlug("");
    setCodePrefix("END");
    setDescription("");
    setDisplayOrder(categories.length + 1);
    setImageUrl(
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=900&q=80",
    );
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEdit = (targetCategory: Category) => {
    setEditingCategory(targetCategory);
    setFormError("");
    setName(targetCategory.name);
    setSlug(targetCategory.slug);
    setCodePrefix(
      deriveCategoryCodePrefix(
        targetCategory.name,
        targetCategory.slug,
        targetCategory.description ?? undefined,
      ),
    );
    setDescription(
      (targetCategory.description ?? "").replace(
        /\s*\(Prefix:\s*[A-Z0-9]{3}\)/i,
        "",
      ),
    );
    setDisplayOrder(targetCategory.displayOrder ?? 0);
    setImageUrl(targetCategory.imageUrl ?? "");
    setIsActive(targetCategory.isActive);
    setIsModalOpen(true);
  };

  const applyCategoryPreset = (preset: ClinicalCategoryPreset) => {
    setName(preset.name);
    setSlug(preset.slug);
    setCodePrefix(preset.codePrefix);
    setDescription(
      preset.description.replace(/\s*\(Prefix:\s*[A-Z0-9]{3}\)/i, ""),
    );
    setDisplayOrder(preset.displayOrder);
    setImageUrl(preset.imageUrl);
    setIsActive(true);
  };

  const handleNameChange = (nextName: string) => {
    setName(nextName);
    const autoSlug = slugifyText(nextName);
    if (!editingCategory) {
      setSlug(autoSlug);
      setCodePrefix(deriveCategoryCodePrefix(nextName, autoSlug));
    }
  };

  const handleSave = async (submitEvent: React.FormEvent) => {
    submitEvent.preventDefault();
    setFormError("");
    if (name.trim().length < 2) {
      setFormError("Category name must be at least 2 characters.");
      return;
    }

    const normalizedPrefix = (
      codePrefix.trim() || deriveCategoryCodePrefix(name, slug)
    )
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 3)
      .padEnd(3, "X");

    const cleanDescription = description
      .trim()
      .replace(/\s*\(Prefix:\s*[A-Z0-9]{3}\)/i, "");
    const formattedDescription = cleanDescription
      ? `${cleanDescription} (Prefix: ${normalizedPrefix})`
      : `Clinical surgical equipment category for ${name.trim()}. (Prefix: ${normalizedPrefix})`;

    const finalSlug = (slug.trim() || slugifyText(name)).toLowerCase();

    const payload = {
      name: name.trim(),
      slug: finalSlug,
      description: formattedDescription,
      imageUrl: imageUrl.trim() || null,
      displayOrder: Number(displayOrder) || 0,
      isActive,
    };

    try {
      if (editingCategory) {
        await updateCategory.mutateAsync({
          id: editingCategory.id,
          payload,
        });
        onToast?.(
          `Category "${name.trim()}" [${normalizedPrefix}] updated`,
        );
      } else {
        await createCategory.mutateAsync(payload);
        onToast?.(
          `Category "${name.trim()}" [${normalizedPrefix}] created`,
        );
      }
      setIsModalOpen(false);
    } catch (mutationError: any) {
      setFormError(
        mutationError?.normalizedMessage ||
          mutationError?.response?.data?.message ||
          "Failed to save category.",
      );
    }
  };

  const handleToggleActive = async (targetCategory: Category) => {
    try {
      await updateCategory.mutateAsync({
        id: targetCategory.id,
        payload: { isActive: !targetCategory.isActive },
      });
      onToast?.(
        `Category "${targetCategory.name}" ${!targetCategory.isActive ? "activated" : "hidden"}`,
      );
    } catch (mutationError: any) {
      onToast?.(
        mutationError?.normalizedMessage || "Failed to update status",
      );
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;
    try {
      await deleteCategory.mutateAsync(deletingCategory.id);
      onToast?.(`Deleted category "${deletingCategory.name}"`);
      setDeletingCategory(null);
    } catch (mutationError: any) {
      onToast?.(
        mutationError?.normalizedMessage ||
          "Cannot delete category with linked products.",
      );
      setDeletingCategory(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2E7D5B]/10 text-[#2E7D5B] flex items-center justify-center">
            <FolderTree className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              Surgical Equipment Categories
            </h1>
            <p className="text-xs text-gray-500">
              Clinical taxonomy groups with standardized SKU prefixes (
              <span className="font-mono font-semibold text-gray-700">
                ELP-[CAT]-[DEV]-[###]
              </span>
              )
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2E7D5B] hover:bg-[#256649] text-xs font-bold text-white shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Category</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-100 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(changeEvent) => setSearch(changeEvent.target.value)}
            placeholder="Search categories by name, SKU prefix (END, OPN, SPC, CLS, LAP), slug..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#2E7D5B]"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <FloatingSelect
            value={statusFilter}
            onChange={(selectedValue) =>
              setStatusFilter(selectedValue as "all" | "active" | "inactive")
            }
            menuTitle="Filter by Status"
            icon={<Filter className="w-3.5 h-3.5" />}
            isActiveFilter={statusFilter !== "all"}
            minWidth={190}
            className="text-xs"
            options={[
              {
                value: "all",
                label: "All Statuses",
                icon: <Filter className="w-3.5 h-3.5" />,
              },
              {
                value: "active",
                label: "Active Only",
                icon: <Check className="w-3.5 h-3.5" />,
              },
              {
                value: "inactive",
                label: "Inactive Only",
                icon: <X className="w-3.5 h-3.5" />,
              },
            ]}
          />

          <FloatingSelect
            value={sortBy}
            onChange={(selectedValue) => setSortBy(selectedValue as any)}
            menuTitle="Sort Categories"
            icon={<ArrowUpDown className="w-3.5 h-3.5" />}
            isActiveFilter={sortBy !== "order"}
            align="right"
            minWidth={210}
            className="text-xs"
            options={[
              {
                value: "order",
                label: "Display Order",
                icon: <SlidersHorizontal className="w-3.5 h-3.5" />,
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
                value: "products_desc",
                label: "Most Products",
                icon: <Package className="w-3.5 h-3.5" />,
              },
            ]}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/70 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                <th className="py-3.5 pl-5 pr-3">Order</th>
                <th className="py-3.5 px-3">SKU Prefix</th>
                <th className="py-3.5 px-3">Category Name & Slug</th>
                <th className="py-3.5 px-3">Clinical Scope & Description</th>
                <th className="py-3.5 px-3">Linked SKUs</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Updated</th>
                <th className="py-3.5 pl-3 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    Loading surgical categories...
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    No categories found.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((categoryItem) => {
                  const prefix = deriveCategoryCodePrefix(
                    categoryItem.name,
                    categoryItem.slug,
                    categoryItem.description ?? undefined,
                  );
                  return (
                    <tr
                      key={categoryItem.id}
                      className="hover:bg-gray-50/80 transition-colors"
                    >
                      <td className="py-3.5 pl-5 pr-3 font-mono font-bold text-gray-600">
                        #{categoryItem.displayOrder ?? 0}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#2E7D5B]/10 text-[#2E7D5B] font-mono font-extrabold text-[11px]">
                          <Tag className="w-3 h-3" />
                          ELP-{prefix}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <p className="font-bold text-gray-900">
                          {categoryItem.name}
                        </p>
                        <p className="text-[11px] font-mono text-gray-400">
                          /{categoryItem.slug}
                        </p>
                      </td>
                      <td className="py-3.5 px-3 text-gray-600 max-w-[300px] truncate">
                        {categoryItem.description || "—"}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 font-bold text-[11px]">
                          {categoryItem._count?.products ?? 0} products
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(categoryItem)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer ${
                            categoryItem.isActive
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {categoryItem.isActive ? "Active" : "Hidden"}
                        </button>
                      </td>
                      <td className="py-3.5 px-3 text-gray-500 whitespace-nowrap">
                        {formatLiveDate(
                          categoryItem.updatedAt || categoryItem.createdAt,
                        )}
                      </td>
                      <td className="py-3.5 pl-3 pr-5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEdit(categoryItem)}
                            className="p-2 rounded-lg text-sky-600 hover:bg-sky-50 cursor-pointer"
                            title="Edit Category"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          {isSuperAdmin && (
                            <button
                              type="button"
                              onClick={() => setDeletingCategory(categoryItem)}
                              className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                              title="Delete Category"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-extrabold text-gray-900">
                  {editingCategory
                    ? "Edit Surgical Category"
                    : "Create Surgical Equipment Category"}
                </h3>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Follows the HAS Medical Stapler clinical taxonomy &{" "}
                  <span className="font-mono font-semibold text-[#2E7D5B]">
                    ELP-[CAT]-[DEV]-[###]
                  </span>{" "}
                  SKU standard
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 pt-4 text-xs">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
                  {formError}
                </div>
              )}

              {/* Quick-Fill Clinical Taxonomy Presets */}
              {!editingCategory && (
                <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#2E7D5B]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      Quick-Fill Clinical Taxonomy Blueprint (5 Core Groups):
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {CLINICAL_CATEGORY_PRESETS.map((preset) => (
                      <button
                        key={preset.slug}
                        type="button"
                        onClick={() => applyCategoryPreset(preset)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition cursor-pointer ${
                          slug === preset.slug
                            ? "bg-[#2E7D5B] text-white border-[#2E7D5B]"
                            : "bg-white text-gray-700 border-gray-200 hover:border-[#2E7D5B]"
                        }`}
                      >
                        <span className="font-mono font-bold mr-1">
                          [{preset.codePrefix}]
                        </span>
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  CATEGORY NAME *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(changeEvent) =>
                    handleNameChange(changeEvent.target.value)
                  }
                  placeholder="e.g. Endoscopic & Powered Staplers"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2E7D5B]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    SKU CODE PREFIX *
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={codePrefix}
                    onChange={(changeEvent) =>
                      setCodePrefix(
                        changeEvent.target.value
                          .toUpperCase()
                          .replace(/[^A-Z0-9]/g, ""),
                      )
                    }
                    placeholder="END"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 font-mono font-bold uppercase text-[#2E7D5B] focus:outline-none focus:border-[#2E7D5B]"
                    required
                  />
                  <p className="text-[10px] text-gray-400 mt-1 font-mono">
                    SKU: ELP-{(codePrefix || "END").padEnd(3, "X")}-DEV-001
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    URL SLUG
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(changeEvent) =>
                      setSlug(changeEvent.target.value)
                    }
                    placeholder="endoscopic-powered-staplers"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 font-mono focus:outline-none focus:border-[#2E7D5B]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    DISPLAY ORDER
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={displayOrder}
                    onChange={(changeEvent) =>
                      setDisplayOrder(Number(changeEvent.target.value) || 0)
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2E7D5B]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  CLINICAL SCOPE & DESCRIPTION
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(changeEvent) =>
                    setDescription(changeEvent.target.value)
                  }
                  placeholder="Minimally invasive laparoscopic, thoracoscopic, and battery-powered articulating linear cutter staplers..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2E7D5B]"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  The tag{" "}
                  <span className="font-mono font-semibold text-gray-600">
                    (Prefix: {(codePrefix || "END").padEnd(3, "X")})
                  </span>{" "}
                  will be appended automatically for SKU auto-generation.
                </p>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  COVER IMAGE URL (Optional)
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(changeEvent) =>
                    setImageUrl(changeEvent.target.value)
                  }
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2E7D5B]"
                />
              </div>

              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(changeEvent) =>
                    setIsActive(changeEvent.target.checked)
                  }
                />
                <span className="font-semibold text-gray-700">
                  Active & visible in public storefront
                </span>
              </label>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 font-semibold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    createCategory.isPending || updateCategory.isPending
                  }
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#2E7D5B] text-white font-bold cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {editingCategory ? "Update Category" : "Create Category"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
            <h3 className="text-base font-extrabold text-gray-900">
              Delete Category?
            </h3>
            <p className="text-xs text-gray-600 mt-1.5">
              Delete <strong>{deletingCategory.name}</strong>? Categories with
              active products cannot be deleted until their products are
              reassigned.
            </p>
            <div className="flex justify-end gap-2.5 mt-5">
              <button
                type="button"
                onClick={() => setDeletingCategory(null)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleteCategory.isPending}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold"
              >
                {deleteCategory.isPending ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesModule;
