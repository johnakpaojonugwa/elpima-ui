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
  const [description, setDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState(1);
  const [imageUrl, setImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true);

  const filteredCategories = useMemo(() => {
    const q = search.trim().toLowerCase();
    return categories
      .filter((cat) => {
        if (statusFilter === "active" && !cat.isActive) return false;
        if (statusFilter === "inactive" && cat.isActive) return false;
        if (
          q &&
          !cat.name.toLowerCase().includes(q) &&
          !cat.slug.toLowerCase().includes(q) &&
          !(cat.description ?? "").toLowerCase().includes(q)
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "name_asc") return a.name.localeCompare(b.name);
        if (sortBy === "name_desc") return b.name.localeCompare(a.name);
        if (sortBy === "products_desc") {
          return (b._count?.products ?? 0) - (a._count?.products ?? 0);
        }
        return (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
      });
  }, [categories, search, statusFilter, sortBy]);

  const openCreate = () => {
    setEditingCategory(null);
    setFormError("");
    setName("");
    setSlug("");
    setDescription("");
    setDisplayOrder(categories.length + 1);
    setImageUrl("");
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormError("");
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description ?? "");
    setDisplayOrder(cat.displayOrder ?? 0);
    setImageUrl(cat.imageUrl ?? "");
    setIsActive(cat.isActive);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (name.trim().length < 2) {
      setFormError("Category name must be at least 2 characters.");
      return;
    }

    const payload = {
      name: name.trim(),
      ...(slug.trim() ? { slug: slug.trim().toLowerCase() } : {}),
      description: description.trim() || undefined,
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
        onToast?.(`Category "${name.trim()}" updated`);
      } else {
        await createCategory.mutateAsync(payload);
        onToast?.(`Category "${name.trim()}" created`);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(
        err?.normalizedMessage ||
          err?.response?.data?.message ||
          "Failed to save category.",
      );
    }
  };

  const handleToggleActive = async (cat: Category) => {
    try {
      await updateCategory.mutateAsync({
        id: cat.id,
        payload: { isActive: !cat.isActive },
      });
      onToast?.(
        `Category "${cat.name}" ${!cat.isActive ? "activated" : "hidden"}`,
      );
    } catch (err: any) {
      onToast?.(err?.normalizedMessage || "Failed to update status");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;
    try {
      await deleteCategory.mutateAsync(deletingCategory.id);
      onToast?.(`Deleted category "${deletingCategory.name}"`);
      setDeletingCategory(null);
    } catch (err: any) {
      onToast?.(
        err?.normalizedMessage ||
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
              Organize surgical instruments into structured clinical taxonomy
              groups
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
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories by name, slug, or description..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#2E7D5B]"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <FloatingSelect
            value={statusFilter}
            onChange={(val) =>
              setStatusFilter(val as "all" | "active" | "inactive")
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
            onChange={(val) => setSortBy(val as any)}
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
          <table className="w-full min-w-[760px] text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/70 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                <th className="py-3.5 pl-5 pr-3">Order</th>
                <th className="py-3.5 px-3">Category Name & Slug</th>
                <th className="py-3.5 px-3">Description</th>
                <th className="py-3.5 px-3">Linked SKUs</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Updated</th>
                <th className="py-3.5 pl-3 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    Loading surgical categories...
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    No categories found.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="py-3.5 pl-5 pr-3 font-mono font-bold text-gray-600">
                      #{cat.displayOrder ?? 0}
                    </td>
                    <td className="py-3.5 px-3">
                      <p className="font-bold text-gray-900">{cat.name}</p>
                      <p className="text-[11px] font-mono text-gray-400">
                        /{cat.slug}
                      </p>
                    </td>
                    <td className="py-3.5 px-3 text-gray-600 max-w-[280px] truncate">
                      {cat.description || "—"}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 font-bold text-[11px]">
                        {cat._count?.products ?? 0} products
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(cat)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer ${
                          cat.isActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {cat.isActive ? "Active" : "Hidden"}
                      </button>
                    </td>
                    <td className="py-3.5 px-3 text-gray-500 whitespace-nowrap">
                      {formatLiveDate(cat.updatedAt || cat.createdAt)}
                    </td>
                    <td className="py-3.5 pl-3 pr-5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEdit(cat)}
                          className="p-2 rounded-lg text-sky-600 hover:bg-sky-50 cursor-pointer"
                          title="Edit Category"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        {isSuperAdmin && (
                          <button
                            type="button"
                            onClick={() => setDeletingCategory(cat)}
                            className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                            title="Delete Category"
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
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-base font-extrabold text-gray-900">
                {editingCategory ? "Edit Category" : "Create Surgical Category"}
              </h3>
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

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  CATEGORY NAME *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Laparoscopy & Minimally Invasive"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    SLUG (Optional)
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="laparoscopy-minimally-invasive"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 font-mono"
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
                    onChange={(e) =>
                      setDisplayOrder(Number(e.target.value) || 0)
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  DESCRIPTION
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Telescopes, trocars, graspers, clip appliers..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  COVER IMAGE URL (Optional)
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200"
                />
              </div>

              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
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

