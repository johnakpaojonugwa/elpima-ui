import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowDownAZ,
  ArrowLeft,
  ArrowUpDown,
  Check,
  Clock,
  Edit3,
  Eye,
  FileSpreadsheet,
  Filter,
  KeyRound,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  Trash2,
  UserCheck,
  X,
} from "lucide-react";
import {
  useCreateManagerMutation,
  useDeleteManagerMutation,
  useManagersQuery,
  useUpdateManagerMutation,
  useUpdateManagerStatusMutation,
} from "@/hooks/queries";
import type { Manager } from "@/types/domain";
import { FloatingSelect } from "@/components/app";
import { formatLiveDate } from "@/utils/date";

interface ManagersModuleProps {
  onToast?: (message: string) => void;
}

export const ManagersModule: React.FC<ManagersModuleProps> = ({ onToast }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    data: managers = [],
    isLoading,
    isFetching,
    refetch,
  } = useManagersQuery();

  const createManager = useCreateManagerMutation();
  const updateManager = useUpdateManagerMutation();
  const updateStatus = useUpdateManagerStatusMutation();
  const deleteManager = useDeleteManagerMutation();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "suspended"
  >("all");
  const [sortBy, setSortBy] = useState<"name_asc" | "quotes_desc" | "newest">(
    "name_asc",
  );

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingManager, setEditingManager] = useState<Manager | null>(null);
  const [viewingManager, setViewingManager] = useState<Manager | null>(null);
  const [deletingManager, setDeletingManager] = useState<Manager | null>(null);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const idParam = searchParams.get("id");
    if (idParam && managers.length > 0 && !viewingManager) {
      const matched = managers.find((m) => m.id === idParam);
      if (matched) {
        setViewingManager(matched);
      }
    }
  }, [searchParams, managers]);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+234");
  const [password, setPassword] = useState("");

  const filteredManagers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return managers
      .filter((m) => {
        if (statusFilter === "active" && !m.isActive) return false;
        if (statusFilter === "suspended" && m.isActive) return false;
        if (
          q &&
          !m.fullName.toLowerCase().includes(q) &&
          !m.email.toLowerCase().includes(q) &&
          !(m.phone ?? "").toLowerCase().includes(q)
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "quotes_desc") {
          return (
            (b._count?.assignedQuotes ?? 0) - (a._count?.assignedQuotes ?? 0)
          );
        }
        if (sortBy === "newest") {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
        return a.fullName.localeCompare(b.fullName);
      });
  }, [managers, search, statusFilter, sortBy]);

  const openCreateModal = () => {
    setEditingManager(null);
    setFormError("");
    setFullName("");
    setEmail("");
    setPhone("+234");
    setPassword("ManagerPassword123!");
    setIsModalOpen(true);
  };

  const openEditModal = (manager: Manager) => {
    setEditingManager(manager);
    setFormError("");
    setFullName(manager.fullName);
    setEmail(manager.email);
    setPhone(manager.phone ?? "+234");
    setPassword("");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (fullName.trim().length < 2) {
      setFormError("Full name is required.");
      return;
    }
    if (!email.trim()) {
      setFormError("Official email address is required.");
      return;
    }

    try {
      if (editingManager) {
        await updateManager.mutateAsync({
          id: editingManager.id,
          payload: {
            fullName: fullName.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim() || undefined,
            ...(password.trim() ? { password: password.trim() } : {}),
          },
        });
        onToast?.(`Updated manager ${fullName.trim()}`);
      } else {
        if (password.trim().length < 8) {
          setFormError("Temporary password must be at least 8 characters.");
          return;
        }
        await createManager.mutateAsync({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim() || undefined,
          password: password.trim(),
        });
        onToast?.(`Provisioned Supervising Manager ${fullName.trim()}`);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(
        err?.normalizedMessage ||
          err?.response?.data?.message ||
          "Failed to save Supervising Manager account.",
      );
    }
  };

  const handleToggleStatus = async (manager: Manager) => {
    try {
      await updateStatus.mutateAsync({
        id: manager.id,
        payload: { isActive: !manager.isActive },
      });
      onToast?.(
        `${manager.fullName} account ${!manager.isActive ? "activated" : "suspended"}`,
      );
    } catch (err: any) {
      onToast?.(err?.normalizedMessage || "Failed to update account status");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingManager) return;
    try {
      await deleteManager.mutateAsync(deletingManager.id);
      onToast?.(`Removed manager ${deletingManager.fullName}`);
      setDeletingManager(null);
    } catch (err: any) {
      onToast?.(err?.normalizedMessage || "Failed to delete manager");
      setDeletingManager(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-gray-100 space-y-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/super-admin/dashboard")}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#2E7D5B] hover:text-[#236246] transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Overview Dashboard</span>
          </button>

          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
            Full Team Directory ({filteredManagers.length} managers)
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2E7D5B]/10 text-[#2E7D5B] flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                Supervising Managers — Full Details
              </h1>
              <p className="text-xs text-gray-500">
                Provision, audit, and manage staff accounts handling catalog and
                hospital RFQ operations
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
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2E7D5B] hover:bg-[#256649] text-xs font-bold text-white shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Provision Manager</span>
            </button>
          </div>
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
            placeholder="Search managers by name, email, or phone..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#2E7D5B]"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <FloatingSelect
            value={statusFilter}
            onChange={(val) =>
              setStatusFilter(val as "all" | "active" | "suspended")
            }
            menuTitle="Filter by Account Status"
            icon={<Filter className="w-3.5 h-3.5" />}
            isActiveFilter={statusFilter !== "all"}
            minWidth={205}
            className="text-xs"
            options={[
              {
                value: "all",
                label: "All Account Statuses",
                icon: <Filter className="w-3.5 h-3.5" />,
              },
              {
                value: "active",
                label: "Active Only",
                icon: <UserCheck className="w-3.5 h-3.5" />,
              },
              {
                value: "suspended",
                label: "Suspended Only",
                icon: <ShieldAlert className="w-3.5 h-3.5" />,
              },
            ]}
          />

          <FloatingSelect
            value={sortBy}
            onChange={(val) => setSortBy(val as any)}
            menuTitle="Sort Managers"
            icon={<ArrowUpDown className="w-3.5 h-3.5" />}
            isActiveFilter={sortBy !== "name_asc"}
            align="right"
            minWidth={225}
            className="text-xs"
            options={[
              {
                value: "name_asc",
                label: "Name (A - Z)",
                icon: <ArrowDownAZ className="w-3.5 h-3.5" />,
              },
              {
                value: "quotes_desc",
                label: "Most Assigned Quotes",
                icon: <FileSpreadsheet className="w-3.5 h-3.5" />,
              },
              {
                value: "newest",
                label: "Newest Provisioned",
                icon: <Clock className="w-3.5 h-3.5" />,
              },
            ]}
          />
        </div>
      </div>

      {/* Managers Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/70 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                <th className="py-3.5 pl-5 pr-3">Manager</th>
                <th className="py-3.5 px-3">Phone / WhatsApp</th>
                <th className="py-3.5 px-3">Assigned RFQs</th>
                <th className="py-3.5 px-3">Last Login</th>
                <th className="py-3.5 px-3">Provisioned</th>
                <th className="py-3.5 px-3">Account Status</th>
                <th className="py-3.5 pl-3 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    Loading Supervising Managers...
                  </td>
                </tr>
              ) : filteredManagers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    No Supervising Manager accounts found.
                  </td>
                </tr>
              ) : (
                filteredManagers.map((manager) => (
                  <tr
                    key={manager.id}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="py-3.5 pl-5 pr-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#2E7D5B]/15 text-[#2E7D5B] font-bold flex items-center justify-center">
                          {manager.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">
                            {manager.fullName}
                          </p>
                          <p className="text-[11px] text-gray-500">
                            {manager.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-gray-600">
                      {manager.phone || "—"}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 font-bold text-[11px]">
                        {manager._count?.assignedQuotes ?? 0} quotes
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-gray-500 whitespace-nowrap">
                      {manager.lastLoginAt
                        ? formatLiveDate(manager.lastLoginAt, true)
                        : "Never logged in"}
                    </td>
                    <td className="py-3.5 px-3 text-gray-500 whitespace-nowrap">
                      {formatLiveDate(manager.createdAt)}
                    </td>
                    <td className="py-3.5 px-3">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(manager)}
                        disabled={updateStatus.isPending}
                        title="Click to toggle Active / Suspended"
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer ${
                          manager.isActive
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                        }`}
                      >
                        {manager.isActive ? "Active" : "Suspended"}
                      </button>
                    </td>
                    <td className="py-3.5 pl-3 pr-5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setViewingManager(manager)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#2E7D5B]/10 text-[#2E7D5B] hover:bg-[#2E7D5B] hover:text-white font-bold transition cursor-pointer"
                          title="Inspect full manager details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Full Details</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditModal(manager)}
                          className="p-2 rounded-lg text-sky-600 hover:bg-sky-50 cursor-pointer"
                          title="Edit Details / Reset Password"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingManager(manager)}
                          className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                          title="Remove Manager"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision / Edit Manager Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 text-xs">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-base font-extrabold text-gray-900">
                {editingManager
                  ? `Edit Manager: ${editingManager.fullName}`
                  : "Provision New Supervising Manager"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 pt-4">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
                  {formError}
                </div>
              )}

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  FULL NAME *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Amina Ibrahim"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  OFFICIAL EMAIL ADDRESS *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="amina.ibrahim@elpimasurgicals.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  PHONE / WHATSAPP NUMBER
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+2348022222222"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  {editingManager
                    ? "NEW PASSWORD (Leave blank to keep current)"
                    : "TEMPORARY PASSWORD (Min 8 chars) *"}
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={
                      editingManager
                        ? "Enter new password to reset..."
                        : "ManagerPassword123!"
                    }
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 font-mono"
                    required={!editingManager}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createManager.isPending || updateManager.isPending}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#2E7D5B] text-white font-bold cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {editingManager ? "Save Changes" : "Provision Account"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Manager Profile & Activity Details Modal */}
      {viewingManager && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4 text-xs">
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#2E7D5B]/15 text-[#2E7D5B] text-base font-extrabold flex items-center justify-center">
                  {viewingManager.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-gray-900">
                      {viewingManager.fullName}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        viewingManager.isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {viewingManager.isActive ? "Active" : "Suspended"}
                    </span>
                  </div>
                  <p className="text-gray-500 mt-0.5">{viewingManager.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setViewingManager(null);
                  if (searchParams.get("id")) {
                    setSearchParams({});
                  }
                }}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div>
                <p className="text-[10px] font-bold uppercase text-gray-400">
                  Portal Role
                </p>
                <p className="font-mono font-bold text-gray-900 mt-0.5">
                  {viewingManager.role || "SUPERVISING_MANAGER"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-gray-400">
                  Phone / WhatsApp
                </p>
                <p className="font-mono font-semibold text-gray-900 mt-0.5">
                  {viewingManager.phone || "Not configured"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-gray-400">
                  Assigned Hospital RFQs
                </p>
                <p className="font-extrabold text-[#2E7D5B] text-sm mt-0.5">
                  {viewingManager._count?.assignedQuotes ?? 0} quote inquiries
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-gray-400">
                  Last Portal Login
                </p>
                <p className="font-semibold text-gray-900 mt-0.5">
                  {viewingManager.lastLoginAt
                    ? formatLiveDate(viewingManager.lastLoginAt, true)
                    : "Never logged in"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-gray-400">
                  Account Provisioned
                </p>
                <p className="font-semibold text-gray-900 mt-0.5">
                  {formatLiveDate(viewingManager.createdAt, true)}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-gray-400">
                  Staff ID
                </p>
                <p className="font-mono text-[11px] text-gray-600 mt-0.5 truncate">
                  {viewingManager.id}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  const target = viewingManager;
                  setViewingManager(null);
                  handleToggleStatus(target);
                }}
                className={`px-3.5 py-2 rounded-xl font-bold cursor-pointer ${
                  viewingManager.isActive
                    ? "bg-amber-50 text-amber-800 hover:bg-amber-100"
                    : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                }`}
              >
                {viewingManager.isActive
                  ? "Suspend Account"
                  : "Activate Account"}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setViewingManager(null);
                    if (searchParams.get("id")) {
                      setSearchParams({});
                    }
                  }}
                  className="px-4 py-2 rounded-xl border border-gray-200 font-semibold text-gray-700"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const target = viewingManager;
                    setViewingManager(null);
                    openEditModal(target);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2E7D5B] text-white font-bold cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit / Reset Password</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deletingManager && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center gap-2.5 text-rose-600 mb-2">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="text-base font-extrabold text-gray-900">
                Remove Supervising Manager?
              </h3>
            </div>
            <p className="text-xs text-gray-600">
              Permanently remove <strong>{deletingManager.fullName}</strong> (
              {deletingManager.email})? All active sessions for this user will
              be revoked immediately.
            </p>
            <div className="flex justify-end gap-2.5 mt-5">
              <button
                type="button"
                onClick={() => setDeletingManager(null)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleteManager.isPending}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold"
              >
                {deleteManager.isPending ? "Removing..." : "Confirm Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagersModule;

