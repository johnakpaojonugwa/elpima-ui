import React, { useMemo, useState } from "react";
import {
  ArrowDownAZ,
  ArrowUpDown,
  ArrowUpZA,
  Check,
  Clock,
  Edit3,
  Package,
  Plus,
  RefreshCw,
  Search,
  Stethoscope,
  Trash2,
  X,
} from "lucide-react";
import {
  useCreateSpecialtyMutation,
  useDeleteSpecialtyMutation,
  useSpecialtiesQuery,
  useUpdateSpecialtyMutation,
} from "@/hooks/queries";
import { useAuthStore } from "@/store";
import { FloatingSelect } from "@/components/app";
import type { Specialty } from "@/types/domain";
import { formatLiveDate } from "@/utils/date";

interface SpecialtiesModuleProps {
  onToast?: (message: string) => void;
}

export const SpecialtiesModule: React.FC<SpecialtiesModuleProps> = ({
  onToast,
}) => {
  const userRole = useAuthStore((s) => s.user?.role) ?? "SUPERVISING_MANAGER";
  const isSuperAdmin = userRole === "SUPER_ADMIN";

  const {
    data: specialties = [],
    isLoading,
    isFetching,
    refetch,
  } = useSpecialtiesQuery();

  const createSpecialty = useCreateSpecialtyMutation();
  const updateSpecialty = useUpdateSpecialtyMutation();
  const deleteSpecialty = useDeleteSpecialtyMutation();

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<
    "name_asc" | "name_desc" | "products_desc" | "newest"
  >("name_asc");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState<Specialty | null>(
    null,
  );
  const [deletingSpecialty, setDeletingSpecialty] = useState<Specialty | null>(
    null,
  );
  const [formError, setFormError] = useState("");

  // Form fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const filteredSpecialties = useMemo(() => {
    const q = search.trim().toLowerCase();
    return specialties
      .filter((spec) => {
        if (!q) return true;
        return (
          spec.name.toLowerCase().includes(q) ||
          spec.slug.toLowerCase().includes(q) ||
          (spec.description ?? "").toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sortBy === "name_desc") return b.name.localeCompare(a.name);
        if (sortBy === "products_desc") {
          return (b._count?.products ?? 0) - (a._count?.products ?? 0);
        }
        if (sortBy === "newest") {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
        return a.name.localeCompare(b.name);
      });
  }, [specialties, search, sortBy]);

  const openCreate = () => {
    setEditingSpecialty(null);
    setFormError("");
    setName("");
    setSlug("");
    setDescription("");
    setImageUrl("");
    setIsModalOpen(true);
  };

  const openEdit = (spec: Specialty) => {
    setEditingSpecialty(spec);
    setFormError("");
    setName(spec.name);
    setSlug(spec.slug);
    setDescription(spec.description ?? "");
    setImageUrl(spec.imageUrl ?? "");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (name.trim().length < 2) {
      setFormError("Specialty name is required (min 2 characters).");
      return;
    }

    const payload = {
      name: name.trim(),
      ...(slug.trim() ? { slug: slug.trim().toLowerCase() } : {}),
      description: description.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
    };

    try {
      if (editingSpecialty) {
        await updateSpecialty.mutateAsync({
          id: editingSpecialty.id,
          payload,
        });
        onToast?.(`Specialty "${name.trim()}" updated`);
      } else {
        await createSpecialty.mutateAsync(payload);
        onToast?.(`Specialty "${name.trim()}" created`);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(
        err?.normalizedMessage ||
          err?.response?.data?.message ||
          "Failed to save specialty.",
      );
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingSpecialty) return;
    try {
      await deleteSpecialty.mutateAsync(deletingSpecialty.id);
      onToast?.(`Deleted specialty "${deletingSpecialty.name}"`);
      setDeletingSpecialty(null);
    } catch (err: any) {
      onToast?.(err?.normalizedMessage || "Failed to delete specialty.");
      setDeletingSpecialty(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2E7D5B]/10 text-[#2E7D5B] flex items-center justify-center">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              Medical & Surgical Specialties
            </h1>
            <p className="text-xs text-gray-500">
              Filter and classify surgical equipment by hospital clinical
              department
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
            <span>New Specialty</span>
          </button>
        </div>
      </div>

      {/* Search & Sort Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-100 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search medical specialties..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#2E7D5B]"
          />
        </div>

        <FloatingSelect
          value={sortBy}
          onChange={(val) => setSortBy(val as any)}
          menuTitle="Sort Specialties"
          icon={<ArrowUpDown className="w-3.5 h-3.5" />}
          isActiveFilter={sortBy !== "name_asc"}
          align="right"
          minWidth={210}
          className="text-xs"
          options={[
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
            {
              value: "newest",
              label: "Newest Added",
              icon: <Clock className="w-3.5 h-3.5" />,
            },
          ]}
        />
      </div>

      {/* Specialties Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/70 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                <th className="py-3.5 pl-5 pr-3">#</th>
                <th className="py-3.5 px-3">Specialty Name & Slug</th>
                <th className="py-3.5 px-3">Clinical Description</th>
                <th className="py-3.5 px-3">Linked SKUs</th>
                <th className="py-3.5 px-3">Created</th>
                <th className="py-3.5 pl-3 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    Loading surgical specialties...
                  </td>
                </tr>
              ) : filteredSpecialties.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    No medical specialties found.
                  </td>
                </tr>
              ) : (
                filteredSpecialties.map((spec, index) => (
                  <tr
                    key={spec.id}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="py-3.5 pl-5 pr-3 font-mono text-gray-500">
                      {index + 1}
                    </td>
                    <td className="py-3.5 px-3">
                      <p className="font-bold text-gray-900">{spec.name}</p>
                      <p className="text-[11px] font-mono text-gray-400">
                        /{spec.slug}
                      </p>
                    </td>
                    <td className="py-3.5 px-3 text-gray-600 max-w-[300px] truncate">
                      {spec.description ||
                        "Clinical surgical specialty department"}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold text-[11px]">
                        {spec._count?.products ?? 0} instruments
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-gray-500 whitespace-nowrap">
                      {formatLiveDate(spec.createdAt)}
                    </td>
                    <td className="py-3.5 pl-3 pr-5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEdit(spec)}
                          className="p-2 rounded-lg text-sky-600 hover:bg-sky-50 cursor-pointer"
                          title="Edit Specialty"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        {isSuperAdmin && (
                          <button
                            type="button"
                            onClick={() => setDeletingSpecialty(spec)}
                            className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                            title="Delete Specialty"
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
                {editingSpecialty
                  ? "Edit Medical Specialty"
                  : "Create Medical Specialty"}
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
                  SPECIALTY NAME *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Cardiothoracic & Vascular Surgery"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  SLUG (Optional — auto-generated if empty)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="cardiothoracic-vascular-surgery"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  DESCRIPTION
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Clinical scope and instruments used in this surgical specialty..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  IMAGE URL (Optional)
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200"
                />
              </div>

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
                    createSpecialty.isPending || updateSpecialty.isPending
                  }
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#2E7D5B] text-white font-bold cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {editingSpecialty ? "Save Specialty" : "Create Specialty"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deletingSpecialty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
            <h3 className="text-base font-extrabold text-gray-900">
              Delete Medical Specialty?
            </h3>
            <p className="text-xs text-gray-600 mt-1.5">
              Are you sure you want to delete{" "}
              <strong>{deletingSpecialty.name}</strong>?
            </p>
            <div className="flex justify-end gap-2.5 mt-5">
              <button
                type="button"
                onClick={() => setDeletingSpecialty(null)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleteSpecialty.isPending}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold"
              >
                {deleteSpecialty.isPending ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecialtiesModule;

