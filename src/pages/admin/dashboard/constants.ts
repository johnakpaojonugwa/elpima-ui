import {
  FileSpreadsheet,
  FolderTree,
  ImageUp,
  LayoutGrid,
  Package,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { formatLiveDate, getOffsetIsoDate } from "@/utils/date";
import type {
  ControlAdminNavItem,
  ControlAdminQuotePoint,
  ControlAdminRecentActivityRow,
  ControlAdminStatCard,
  ControlAdminStockPoint,
} from "./types";

export const CONTROL_ADMIN_NAV_ITEMS: ControlAdminNavItem[] = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutGrid,
    active: true,
    path: "/admin/dashboard",
  },
  {
    id: "products",
    label: "Products",
    icon: Package,
    path: "/admin/products",
  },
  {
    id: "categories",
    label: "Categories",
    icon: FolderTree,
    path: "/admin/categories",
  },
  {
    id: "specialties",
    label: "Medical Specialties",
    icon: Stethoscope,
    path: "/admin/specialties",
  },
  {
    id: "quotes",
    label: "Quote Inquiries",
    icon: FileSpreadsheet,
    badge: "New",
    path: "/admin/quotes",
  },
  {
    id: "uploads",
    label: "Media Uploads",
    icon: ImageUp,
    path: "/admin/uploads",
  },
  {
    id: "security",
    label: "Security & 2FA",
    icon: ShieldCheck,
    path: "/admin/security",
  },
];

export const CONTROL_ADMIN_STATS: ControlAdminStatCard[] = [
  {
    id: "active-products",
    label: "Active Catalog SKUs",
    value: "342",
    change: "9.4%",
    direction: "up",
    comparisonText: "Compared to last month",
    icon: Package,
  },
  {
    id: "open-quotes",
    label: "Pending Quote Inquiries",
    value: "28",
    change: "14.2%",
    direction: "up",
    comparisonText: "Requires manager follow-up",
    icon: FileSpreadsheet,
  },
  {
    id: "categories-count",
    label: "Active Categories",
    value: "18",
    change: "2.1%",
    direction: "up",
    comparisonText: "Across 12 specialties",
    icon: FolderTree,
  },
  {
    id: "media-assets",
    label: "Uploaded Media & Specs",
    value: "1,180",
    change: "6.8%",
    direction: "up",
    comparisonText: "Cloudinary CDN synced",
    icon: ImageUp,
  },
];

export const CONTROL_ADMIN_QUOTE_VOLUME: ControlAdminQuotePoint[] = [
  { day: "Mon", value: 14 },
  { day: "Tue", value: 22 },
  { day: "Wed", value: 19 },
  { day: "Thu", value: 31 },
  { day: "Fri", value: 27 },
  { day: "Sat", value: 16 },
  { day: "Sun", value: 24 },
];

export const CONTROL_ADMIN_STOCK_BY_CATEGORY: ControlAdminStockPoint[] = [
  { category: "Diagnostic Imaging", inStock: 68, lowStock: 7 },
  { category: "Patient Monitoring", inStock: 94, lowStock: 11 },
  { category: "Surgical Systems", inStock: 52, lowStock: 4 },
  { category: "ICU & Ventilation", inStock: 41, lowStock: 9 },
  { category: "Laboratory Tech", inStock: 87, lowStock: 5 },
];

export const CONTROL_ADMIN_RECENT_ACTIVITIES: ControlAdminRecentActivityRow[] = [
  {
    id: "act-1",
    action: "Verified stock & specs for HD Laparoscopic 30° Optical Telescope",
    module: "Products",
    reference: "ELP-LAP-TEL-3010",
    actor: "Manager Desk",
    timestamp: formatLiveDate(getOffsetIsoDate(12), true),
    status: "Completed",
  },
  {
    id: "act-2",
    action: "Reviewed institutional quote from Reddington Hospital",
    module: "Quotes",
    reference: "ELP-202610-084",
    actor: "Manager Desk",
    timestamp: formatLiveDate(getOffsetIsoDate(38), true),
    status: "In Progress",
  },
  {
    id: "act-3",
    action: "Uploaded high-res surgical equipment gallery images",
    module: "Uploads",
    reference: "MEDIA-SYNC",
    actor: "Manager Desk",
    timestamp: formatLiveDate(getOffsetIsoDate(65), true),
    status: "Completed",
  },
  {
    id: "act-4",
    action: "Updated Laparoscopy & Bariatric specialty classification",
    module: "Specialties",
    reference: "laparoscopy-bariatric",
    actor: "Manager Desk",
    timestamp: formatLiveDate(getOffsetIsoDate(180), true),
    status: "Completed",
  },
  {
    id: "act-5",
    action: "New bulk quote inquiry from Lagoon Hospitals Group",
    module: "Quotes",
    reference: "ELP-202610-089",
    actor: "WhatsApp RFQ Engine",
    timestamp: formatLiveDate(getOffsetIsoDate(300), true),
    status: "Pending Review",
  },
];

