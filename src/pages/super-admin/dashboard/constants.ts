// src/pages/super-admin/dashboard/constants.ts
import { formatLiveDate, getOffsetIsoDate } from "@/utils/date";
import type {
  SuperAdminNavItem,
  SuperAdminStatCard,
  DashboardTimePeriod,
  QuoteTrendDataPoint,
  CatalogFulfillmentDataPoint,
  AdminActivityItem,
  RecentQuoteItem,
  SupervisingManagerRowItem,
} from "./types";

/**
 * Super-Admin Navigation Links aligned with all 10 elpima-api modules:
 * - Analytics (/api/v1/analytics/dashboard)
 * - Products (/api/v1/products)
 * - Categories (/api/v1/categories) & Specialties (/api/v1/specialties)
 * - Quotes / RFQ (/api/v1/quotes)
 * - Managers (/api/v1/managers)
 * - Upload (/api/v1/upload)
 * - Audit Logs (/api/v1/audit-logs)
 * - Auth & 2FA & Sessions (/api/v1/auth/2fa/*, /api/v1/auth/sessions)
 * - Store Settings (/api/v1/settings)
 */
export const SUPER_ADMIN_NAV_ITEMS: SuperAdminNavItem[] = [
  {
    id: "overview",
    label: "Overview",
    iconName: "LayoutGrid",
    path: "/super-admin/dashboard",
  },
  {
    id: "products",
    label: "Products",
    iconName: "Package",
    path: "/super-admin/products",
  },
  {
    id: "catalog",
    label: "Catalog Taxonomy",
    iconName: "Layers",
    path: "/super-admin/categories",
    subItems: [
      {
        id: "categories",
        label: "Categories",
        path: "/super-admin/categories",
      },
      {
        id: "specialties",
        label: "Medical Specialties",
        path: "/super-admin/specialties",
      },
    ],
  },
  {
    id: "quotes",
    label: "Quote Inquiries",
    iconName: "FileSpreadsheet",
    path: "/super-admin/quotes",
  },
  {
    id: "managers",
    label: "Managers",
    iconName: "UserCheck",
    path: "/super-admin/managers",
  },
  {
    id: "uploads",
    label: "Media Uploads",
    iconName: "ImageUp",
    path: "/super-admin/uploads",
  },
  {
    id: "audit-logs",
    label: "Audit Logs",
    iconName: "ClipboardList",
    path: "/super-admin/audit-logs",
  },
  {
    id: "security",
    label: "Security & 2FA",
    iconName: "ShieldCheck",
    path: "/super-admin/security",
  },
  {
    id: "settings",
    label: "Store Settings",
    iconName: "Settings",
    path: "/super-admin/settings",
  },
];

export const MOCK_SUPER_ADMIN_STATS: SuperAdminStatCard[] = [
  {
    id: "total-products",
    title: "Catalog Products",
    value: "128",
    change: "12% this month",
    trend: "up",
    bgClass: "bg-[#cfeee1]", // Soft mint green
    iconName: "Package",
  },
  {
    id: "total-quotes",
    title: "Quote Inquiries (RFQ)",
    value: "342",
    change: "18% this month",
    trend: "up",
    bgClass: "bg-[#fde2e4]", // Soft blush pink
    iconName: "FileSpreadsheet",
  },
  {
    id: "urgent-quotes",
    title: "Urgent Pending RFQs",
    value: "9",
    change: "4% this week",
    trend: "down",
    bgClass: "bg-[#dbe4ff]", // Soft periwinkle
    iconName: "AlertTriangle",
  },
  {
    id: "active-managers",
    title: "Supervising Managers",
    value: "12",
    change: "100% active",
    trend: "up",
    bgClass: "bg-[#d6dafa]", // Soft lilac
    iconName: "UserCheck",
  },
];

export const SUPER_ADMIN_QUOTE_VOLUME_BY_PERIOD: Record<
  DashboardTimePeriod,
  QuoteTrendDataPoint[]
> = {
  Weekly: [
    { periodLabel: "Mon", month: "Mon", quotes: 24 },
    { periodLabel: "Tue", month: "Tue", quotes: 38 },
    { periodLabel: "Wed", month: "Wed", quotes: 31 },
    { periodLabel: "Thu", month: "Thu", quotes: 49 },
    { periodLabel: "Fri", month: "Fri", quotes: 62 },
    { periodLabel: "Sat", month: "Sat", quotes: 41 },
    { periodLabel: "Sun", month: "Sun", quotes: 29 },
  ],
  Monthly: [
    { periodLabel: "JAN", month: "JAN", quotes: 120 },
    { periodLabel: "FEB", month: "FEB", quotes: 145 },
    { periodLabel: "MAR", month: "MAR", quotes: 168 },
    { periodLabel: "APR", month: "APR", quotes: 152 },
    { periodLabel: "MAY", month: "MAY", quotes: 189 },
    { periodLabel: "JUN", month: "JUN", quotes: 210 },
    { periodLabel: "JUL", month: "JUL", quotes: 195 },
    { periodLabel: "AUG", month: "AUG", quotes: 240 },
    { periodLabel: "SEP", month: "SEP", quotes: 265 },
    { periodLabel: "OCT", month: "OCT", quotes: 310 },
    { periodLabel: "NOV", month: "NOV", quotes: 342 },
    { periodLabel: "DEC", month: "DEC", quotes: 390 },
  ],
  Yearly: [
    { periodLabel: "2021", month: "2021", quotes: 620 },
    { periodLabel: "2022", month: "2022", quotes: 980 },
    { periodLabel: "2023", month: "2023", quotes: 1450 },
    { periodLabel: "2024", month: "2024", quotes: 2120 },
    { periodLabel: "2025", month: "2025", quotes: 2890 },
    { periodLabel: "2026", month: "2026", quotes: 3640 },
  ],
};

export const CATALOG_FULFILLMENT_BY_PERIOD: Record<
  DashboardTimePeriod,
  CatalogFulfillmentDataPoint[]
> = {
  Weekly: [
    { periodLabel: "MON", day: "MON", inquiries: 28, fulfilled: 19 },
    { periodLabel: "TUE", day: "TUE", inquiries: 42, fulfilled: 31 },
    { periodLabel: "WED", day: "WED", inquiries: 36, fulfilled: 29 },
    { periodLabel: "THU", day: "THU", inquiries: 54, fulfilled: 44 },
    { periodLabel: "FRI", day: "FRI", inquiries: 62, fulfilled: 51 },
    { periodLabel: "SAT", day: "SAT", inquiries: 38, fulfilled: 30 },
    { periodLabel: "SUN", day: "SUN", inquiries: 25, fulfilled: 20 },
  ],
  Monthly: [
    { periodLabel: "JAN", day: "JAN", inquiries: 120, fulfilled: 92 },
    { periodLabel: "FEB", day: "FEB", inquiries: 145, fulfilled: 118 },
    { periodLabel: "MAR", day: "MAR", inquiries: 168, fulfilled: 134 },
    { periodLabel: "APR", day: "APR", inquiries: 152, fulfilled: 125 },
    { periodLabel: "MAY", day: "MAY", inquiries: 189, fulfilled: 160 },
    { periodLabel: "JUN", day: "JUN", inquiries: 210, fulfilled: 178 },
    { periodLabel: "JUL", day: "JUL", inquiries: 195, fulfilled: 164 },
    { periodLabel: "AUG", day: "AUG", inquiries: 240, fulfilled: 205 },
    { periodLabel: "SEP", day: "SEP", inquiries: 265, fulfilled: 228 },
    { periodLabel: "OCT", day: "OCT", inquiries: 310, fulfilled: 274 },
    { periodLabel: "NOV", day: "NOV", inquiries: 342, fulfilled: 301 },
    { periodLabel: "DEC", day: "DEC", inquiries: 390, fulfilled: 348 },
  ],
  Yearly: [
    { periodLabel: "2021", day: "2021", inquiries: 620, fulfilled: 490 },
    { periodLabel: "2022", day: "2022", inquiries: 980, fulfilled: 810 },
    { periodLabel: "2023", day: "2023", inquiries: 1450, fulfilled: 1210 },
    { periodLabel: "2024", day: "2024", inquiries: 2120, fulfilled: 1840 },
    { periodLabel: "2025", day: "2025", inquiries: 2890, fulfilled: 2520 },
    { periodLabel: "2026", day: "2026", inquiries: 3640, fulfilled: 3210 },
  ],
};

export const MOCK_ADMIN_ACTIVITIES: AdminActivityItem[] = [
  {
    id: "act-1",
    no: 1,
    adminName: "Super Admin",
    role: "SUPER_ADMIN",
    action: "UPDATED_QUOTE_STATUS",
    target: "ELP-20261029-7390 (QUOTED)",
    date: formatLiveDate(getOffsetIsoDate(15), true),
    status: "Success",
  },
  {
    id: "act-2",
    no: 2,
    adminName: "Supervising Manager",
    role: "SUPERVISING_MANAGER",
    action: "CREATED_PRODUCT",
    target: "Disposable Endo Cutter Stapler (ELP-END-ECS-002)",
    date: formatLiveDate(getOffsetIsoDate(95), true),
    status: "Success",
  },
  {
    id: "act-3",
    no: 3,
    adminName: "Super Admin",
    role: "SUPER_ADMIN",
    action: "ASSIGNED_QUOTE",
    target: "ELP-20261029-4812 -> Supervising Manager",
    date: formatLiveDate(getOffsetIsoDate(240), true),
    status: "Success",
  },
];

export const MOCK_RECENT_QUOTES: RecentQuoteItem[] = [
  {
    id: "q-1",
    no: 1,
    reference: "ELP-20261029-4812",
    customerName: "Dr. Babatunde Adeyemi",
    hospitalClinic: "Lagoon Specialist Hospital, Victoria Island, Lagos",
    phone: "+2348032145678",
    priority: "URGENT",
    status: "NEW",
    itemsCount: 3,
    dateCreated: formatLiveDate(getOffsetIsoDate(20)),
  },
  {
    id: "q-2",
    no: 2,
    reference: "ELP-20261029-7390",
    customerName: "Mrs. Ngozi Eze",
    hospitalClinic: "Cedarcrest Hospitals, Gudu District, Abuja",
    phone: "+2348098765432",
    priority: "STANDARD",
    status: "QUOTED",
    itemsCount: 3,
    dateCreated: formatLiveDate(getOffsetIsoDate(180)),
  },
  {
    id: "q-3",
    no: 3,
    reference: "ELP-20261028-1104",
    customerName: "Dr. Yusuf Danjuma",
    hospitalClinic: "Aminu Kano Teaching Hospital, Kano",
    phone: "+2348023456789",
    priority: "URGENT",
    status: "FULFILLED",
    itemsCount: 3,
    dateCreated: formatLiveDate(getOffsetIsoDate(420)),
  },
];

export const MOCK_MANAGERS: SupervisingManagerRowItem[] = [
  {
    id: "mgr-1",
    no: 1,
    fullName: "Supervising Manager",
    email: "manager@elpimasurgicals.com",
    phone: "+2348022222222",
    assignedQuotesCount: 18,
    lastLogin: formatLiveDate(getOffsetIsoDate(10), true),
    accountStatus: "Active",
  },
];

