import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowDownAZ,
  ArrowLeft,
  ArrowUpDown,
  ArrowUpRight,
  Check,
  Clock,
  Eye,
  FileSpreadsheet,
  Filter,
  FolderTree,
  ImageUp,
  Package,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Stethoscope,
  X,
} from "lucide-react";
import { FloatingSelect } from "@/components/app";
import {
  useCategoriesQuery,
  useDashboardAnalyticsQuery,
  useProductsQuery,
  useQuotesQuery,
  useSpecialtiesQuery,
} from "@/hooks/queries";
import { useAuthStore } from "@/store";
import { formatLiveDate } from "@/utils/date";

export interface FullActivityDetailItem {
  id: string;
  title: string;
  description: string;
  module: "Products" | "Quotes" | "Categories" | "Specialties" | "Uploads";
  reference: string;
  actorName: string;
  actorRole: string;
  facilityOrTarget: string;
  status: "Completed" | "In Progress" | "Pending Review";
  createdAt: string;
  formattedDate: string;
  targetPath: string;
  metadata: Record<string, string | number | boolean | null | undefined>;
}

export const ActivitiesModule: React.FC = () => {
  const navigate = useNavigate();
  const userRole = useAuthStore((s) => s.user?.role) ?? "SUPERVISING_MANAGER";
  const isSuperAdmin = userRole === "SUPER_ADMIN";
  const basePortalPath = isSuperAdmin ? "/super-admin" : "/admin";

  const {
    data: analytics,
    isLoading: analyticsLoading,
    isFetching,
    refetch,
  } = useDashboardAnalyticsQuery();
  const { data: quotesRes, isLoading: quotesLoading } = useQuotesQuery({
    page: 1,
    limit: 30,
  });
  const { data: productsRes, isLoading: productsLoading } = useProductsQuery({
    page: 1,
    limit: 30,
  });
  const { data: categories = [] } = useCategoriesQuery({
    includeInactive: true,
  });
  const { data: specialties = [] } = useSpecialtiesQuery();

  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "module_asc">(
    "newest"
  );
  const [selectedActivity, setSelectedActivity] =
    useState<FullActivityDetailItem | null>(null);

  const allActivities: FullActivityDetailItem[] = useMemo(() => {
    const items: FullActivityDetailItem[] = [];

    // 1. Live Quote Inquiries
    (quotesRes?.items ?? analytics?.quotes?.recent ?? []).forEach(
      (quoteItem: any) => {
        const statusLabel: FullActivityDetailItem["status"] =
          quoteItem.status === "FULFILLED"
            ? "Completed"
            : quoteItem.status === "NEW"
              ? "Pending Review"
              : "In Progress";

        items.push({
          id: `quote-${quoteItem.id}`,
          title: `Hospital RFQ Inquiry — ${quoteItem.reference}`,
          description: `Quotation request submitted by ${quoteItem.customerName} for ${
            quoteItem.hospitalClinic ||
            quoteItem.hospitalName ||
            "Direct Clinical Facility"
          } (${quoteItem.items?.length ?? 1} surgical item(s), priority: ${quoteItem.priority}).`,
          module: "Quotes",
          reference: quoteItem.reference,
          actorName: quoteItem.customerName,
          actorRole: quoteItem.assignedTo?.fullName
            ? `Assigned: ${quoteItem.assignedTo.fullName}`
            : "Hospital Procurement",
          facilityOrTarget:
            quoteItem.hospitalClinic ||
            quoteItem.hospitalName ||
            quoteItem.location ||
            "Nigeria Medical Facility",
          status: statusLabel,
          createdAt: quoteItem.createdAt || new Date().toISOString(),
          formattedDate: formatLiveDate(quoteItem.createdAt, true),
          targetPath: `${basePortalPath}/quotes?reference=${encodeURIComponent(
            quoteItem.reference,
          )}`,
          metadata: {
            Reference: quoteItem.reference,
            Customer: quoteItem.customerName,
            Phone: quoteItem.customerPhone || "N/A",
            Hospital:
              quoteItem.hospitalClinic ||
              quoteItem.hospitalName ||
              "Direct Facility",
            Location: quoteItem.location || "Nigeria",
            Priority: quoteItem.priority,
            WorkflowStatus: quoteItem.status,
            ItemsRequested: quoteItem.items?.length ?? 1,
          },
        });
      },
    );

    // 2. Live Audit Events (if available)
    (analytics?.audit?.recentEvents ?? []).forEach((ev: any) => {
      const entityLower = (ev.entityType || "").toLowerCase();
      const mod: FullActivityDetailItem["module"] =
        entityLower === "quote"
          ? "Quotes"
          : entityLower === "category"
            ? "Categories"
            : entityLower === "specialty"
              ? "Specialties"
              : "Products";

      items.push({
        id: `audit-${ev.id}`,
        title: `${ev.action} on ${ev.entityType.toUpperCase()}`,
        description: `Administrative action "${ev.action}" executed by ${
          ev.actor?.fullName || ev.user?.fullName || "System Administrator"
        } on ${ev.entityType}.`,
        module: mod,
        reference: ev.entityId ? ev.entityId.slice(0, 12) : "SYS-AUDIT",
        actorName:
          ev.actor?.fullName || ev.user?.fullName || "System Administrator",
        actorRole: ev.actor?.role || ev.user?.role || "STAFF",
        facilityOrTarget: `${ev.entityType} ${
          ev.entityId ? `(#${ev.entityId.slice(0, 8)})` : ""
        }`,
        status: "Completed",
        createdAt: ev.createdAt || new Date().toISOString(),
        formattedDate: formatLiveDate(ev.createdAt, true),
        targetPath: `${basePortalPath}/${mod.toLowerCase()}`,
        metadata: {
          Action: ev.action,
          EntityType: ev.entityType,
          EntityID: ev.entityId || "N/A",
          Actor:
            ev.actor?.fullName || ev.user?.fullName || "System Administrator",
          ActorRole: ev.actor?.role || ev.user?.role || "STAFF",
          IPAddress: ev.ipAddress || "127.0.0.1",
        },
      });
    });

    // 3. Live Catalog Product Updates
    (productsRes?.items ?? []).slice(0, 12).forEach((productItem) => {
      items.push({
        id: `prod-${productItem.id}`,
        title: `Catalog SKU Synced — ${productItem.name}`,
        description: `Surgical instrument "${productItem.name}" (SKU: ${
          productItem.sku || "N/A"
        }) verified in "${
          productItem.category?.name || "General"
        }" category. Stock status: ${
          productItem.inStock ? "In Stock" : "Out of Stock"
        }.`,
        module: "Products",
        reference: productItem.sku || productItem.slug.slice(0, 12).toUpperCase(),
        actorName: "Catalog Operations",
        actorRole: userRole,
        facilityOrTarget: productItem.category?.name || "Surgical Catalog",
        status: productItem.inStock ? "Completed" : "In Progress",
        createdAt:
          productItem.updatedAt || productItem.createdAt || new Date().toISOString(),
        formattedDate: formatLiveDate(
          productItem.updatedAt || productItem.createdAt,
          true,
        ),
        targetPath: `${basePortalPath}/products`,
        metadata: {
          ProductName: productItem.name,
          SKU: productItem.sku || "N/A",
          Category: productItem.category?.name || "Uncategorized",
          Specialty: productItem.specialty?.name || "General Clinical",
          InStock: productItem.inStock ? "Yes" : "No",
          LeadTime: productItem.leadTime || "Immediate Dispatch",
          MOQ: productItem.minOrderQuantity ?? 1,
        },
      });
    });

    // 4. Categories & Specialties
    categories.slice(0, 5).forEach((categoryItem) => {
      items.push({
        id: `cat-${categoryItem.id}`,
        title: `Surgical Category Active — ${categoryItem.name}`,
        description: `Taxonomy group "${categoryItem.name}" (/catalog?category=${
          categoryItem.slug
        }) with ${categoryItem._count?.products ?? 0} linked surgical SKUs.`,
        module: "Categories",
        reference: `CAT-${categoryItem.slug.slice(0, 8).toUpperCase()}`,
        actorName: "Taxonomy Manager",
        actorRole: userRole,
        facilityOrTarget: `${categoryItem._count?.products ?? 0} Linked SKUs`,
        status: "Completed",
        createdAt:
          categoryItem.updatedAt || categoryItem.createdAt || new Date().toISOString(),
        formattedDate: formatLiveDate(
          categoryItem.updatedAt || categoryItem.createdAt,
          true,
        ),
        targetPath: `${basePortalPath}/categories`,
        metadata: {
          CategoryName: categoryItem.name,
          Slug: categoryItem.slug,
          DisplayOrder: categoryItem.displayOrder ?? 0,
          LinkedProducts: categoryItem._count?.products ?? 0,
          Active: categoryItem.isActive ? "Yes" : "No",
        },
      });
    });

    specialties.slice(0, 4).forEach((specialtyItem) => {
      items.push({
        id: `spec-${specialtyItem.id}`,
        title: `Medical Specialty Configured — ${specialtyItem.name}`,
        description: `Clinical department "${specialtyItem.name}" mapped to ${
          specialtyItem._count?.products ?? 0
        } surgical instruments.`,
        module: "Specialties",
        reference: `SPEC-${specialtyItem.slug.slice(0, 8).toUpperCase()}`,
        actorName: "Clinical Taxonomy",
        actorRole: userRole,
        facilityOrTarget: specialtyItem.name,
        status: "Completed",
        createdAt: specialtyItem.createdAt || new Date().toISOString(),
        formattedDate: formatLiveDate(specialtyItem.createdAt, true),
        targetPath: `${basePortalPath}/specialties`,
        metadata: {
          SpecialtyName: specialtyItem.name,
          Slug: specialtyItem.slug,
          LinkedProducts: specialtyItem._count?.products ?? 0,
        },
      });
    });

    return items;
  }, [
    quotesRes,
    analytics,
    productsRes,
    categories,
    specialties,
    basePortalPath,
    userRole,
  ]);

  const filteredActivities = useMemo(() => {
    const searchQuery = search.trim().toLowerCase();
    return allActivities
      .filter((item) => {
        if (moduleFilter !== "All" && item.module !== moduleFilter)
          return false;
        if (statusFilter !== "All" && item.status !== statusFilter)
          return false;
        if (!searchQuery) return true;
        return (
          item.title.toLowerCase().includes(searchQuery) ||
          item.description.toLowerCase().includes(searchQuery) ||
          item.reference.toLowerCase().includes(searchQuery) ||
          item.actorName.toLowerCase().includes(searchQuery) ||
          item.facilityOrTarget.toLowerCase().includes(searchQuery)
        );
      })
      .sort((firstActivity, secondActivity) => {
        if (sortBy === "module_asc") {
          return firstActivity.module.localeCompare(secondActivity.module);
        }
        if (sortBy === "oldest") {
          return (
            new Date(firstActivity.createdAt).getTime() -
            new Date(secondActivity.createdAt).getTime()
          );
        }
        return (
          new Date(secondActivity.createdAt).getTime() -
          new Date(firstActivity.createdAt).getTime()
        );
      });
  }, [allActivities, search, moduleFilter, statusFilter, sortBy]);

  const isLoading = analyticsLoading && quotesLoading && productsLoading;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb + Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-gray-100 space-y-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(`${basePortalPath}/dashboard`)}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#2E7D5B] hover:text-[#236246] transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Overview Dashboard</span>
          </button>

          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
            Full Operations Feed ({filteredActivities.length} records)
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2E7D5B]/10 text-[#2E7D5B] flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                All Catalog, RFQ & System Operations
              </h1>
              <p className="text-xs text-gray-500">
                Complete live activity log with full operational metadata across
                products, quotes, categories, and specialties
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`}
            />
            <span>Refresh Feed</span>
          </button>
        </div>
      </div>

      {/* Search, Filter & Sort Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-100 grid grid-cols-1 md:grid-cols-5 gap-3">
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(changeEvent) => setSearch(changeEvent.target.value)}
            placeholder="Search operations by reference, actor, facility, or SKU..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#2E7D5B]"
          />
        </div>

        <FloatingSelect
          value={moduleFilter}
          onChange={(selectedValue) => setModuleFilter(selectedValue)}
          menuTitle="Filter by Module"
          icon={<Filter className="w-3.5 h-3.5" />}
          isActiveFilter={moduleFilter !== "All"}
          matchWidth
          className="w-full text-xs"
          options={[
            {
              value: "All",
              label: "All Modules",
              icon: <Filter className="w-3.5 h-3.5" />,
            },
            {
              value: "Quotes",
              label: "Quotes (RFQ)",
              icon: <FileSpreadsheet className="w-3.5 h-3.5" />,
            },
            {
              value: "Products",
              label: "Products",
              icon: <Package className="w-3.5 h-3.5" />,
            },
            {
              value: "Categories",
              label: "Categories",
              icon: <FolderTree className="w-3.5 h-3.5" />,
            },
            {
              value: "Specialties",
              label: "Specialties",
              icon: <Stethoscope className="w-3.5 h-3.5" />,
            },
            {
              value: "Uploads",
              label: "Uploads",
              icon: <ImageUp className="w-3.5 h-3.5" />,
            },
          ]}
        />

        <FloatingSelect
          value={statusFilter}
          onChange={(selectedValue) => setStatusFilter(selectedValue)}
          menuTitle="Filter by Status"
          icon={<SlidersHorizontal className="w-3.5 h-3.5" />}
          isActiveFilter={statusFilter !== "All"}
          matchWidth
          className="w-full text-xs"
          options={[
            {
              value: "All",
              label: "All Statuses",
              icon: <SlidersHorizontal className="w-3.5 h-3.5" />,
            },
            {
              value: "Completed",
              label: "Completed",
              icon: <Check className="w-3.5 h-3.5" />,
            },
            {
              value: "In Progress",
              label: "In Progress",
              icon: <Clock className="w-3.5 h-3.5" />,
            },
            {
              value: "Pending Review",
              label: "Pending Review",
              icon: <Clock className="w-3.5 h-3.5" />,
            },
          ]}
        />

        <FloatingSelect
          value={sortBy}
          onChange={(selectedValue) =>
            setSortBy(selectedValue as "newest" | "oldest" | "module_asc")
          }
          menuTitle="Sort Operations"
          icon={<ArrowUpDown className="w-3.5 h-3.5" />}
          isActiveFilter={sortBy !== "newest"}
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
              value: "module_asc",
              label: "Module (A - Z)",
              icon: <ArrowDownAZ className="w-3.5 h-3.5" />,
            },
          ]}
        />
      </div>

      {/* Full Details Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/70 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                <th className="py-3.5 pl-5 pr-3">Operation & Summary</th>
                <th className="py-3.5 px-3">Module</th>
                <th className="py-3.5 px-3">Reference</th>
                <th className="py-3.5 px-3">Actor / Source</th>
                <th className="py-3.5 px-3">Facility / Target</th>
                <th className="py-3.5 px-3">Date & Time</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 pl-3 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    Loading full operations history...
                  </td>
                </tr>
              ) : filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    No operations matched your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredActivities.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="py-3.5 pl-5 pr-3 max-w-[300px]">
                      <p className="font-bold text-gray-900 truncate">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                        {item.module}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 font-mono font-bold text-[#2E7D5B]">
                      {item.reference}
                    </td>

                    <td className="py-3.5 px-3">
                      <p className="font-semibold text-gray-800">
                        {item.actorName}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {item.actorRole}
                      </p>
                    </td>

                    <td className="py-3.5 px-3 text-gray-600 max-w-[180px] truncate">
                      {item.facilityOrTarget}
                    </td>

                    <td className="py-3.5 px-3 text-gray-500 whitespace-nowrap">
                      {item.formattedDate}
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          item.status === "Completed"
                            ? "bg-emerald-50 text-emerald-700"
                            : item.status === "In Progress"
                              ? "bg-sky-50 text-sky-700"
                              : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="py-3.5 pl-3 pr-5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedActivity(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#2E7D5B]/10 text-[#2E7D5B] hover:bg-[#2E7D5B] hover:text-white font-bold transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Full Details</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => navigate(item.targetPath)}
                          className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 cursor-pointer"
                          title="Open in module workspace"
                        >
                          <ArrowUpRight className="w-4 h-4" />
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

      {/* Full Operation Details Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-gray-200 space-y-4 text-xs">
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-[#2E7D5B] font-mono font-bold text-[11px]">
                    {selectedActivity.reference}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px]">
                    {selectedActivity.module}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-gray-900 mt-1.5">
                  {selectedActivity.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedActivity(null)}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-600 leading-relaxed bg-gray-50 p-3.5 rounded-xl border border-gray-100">
              {selectedActivity.description}
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {Object.entries(selectedActivity.metadata).map(([k, v]) => (
                <div
                  key={k}
                  className="p-2.5 rounded-xl border border-gray-100 bg-white flex flex-col"
                >
                  <span className="text-[10px] font-bold uppercase text-gray-400">
                    {k}
                  </span>
                  <span className="font-semibold text-gray-900 mt-0.5 truncate">
                    {String(v ?? "—")}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <span className="text-gray-400">
                Recorded: {selectedActivity.formattedDate}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedActivity(null)}
                  className="px-4 py-2 rounded-xl border border-gray-200 font-semibold text-gray-700"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const target = selectedActivity.targetPath;
                    setSelectedActivity(null);
                    navigate(target);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2E7D5B] text-white font-bold cursor-pointer"
                >
                  <span>Open Workspace</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivitiesModule;

