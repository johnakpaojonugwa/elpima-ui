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
  { category: "Endoscopic & Powered [END]", inStock: 4, lowStock: 0 },
  { category: "Open Linear & Circular [OPN]", inStock: 3, lowStock: 0 },
  { category: "Anorectal & Urological [SPC]", inStock: 2, lowStock: 0 },
  { category: "Wound & Fascial Closure [CLS]", inStock: 2, lowStock: 0 },
  { category: "Laparoscopic Access [LAP]", inStock: 5, lowStock: 0 },
];

export const CONTROL_ADMIN_RECENT_ACTIVITIES: ControlAdminRecentActivityRow[] = [
  {
    id: "act-1",
    action: "Verified stock & specs for Disposable Endo Cutter Stapler (#p2)",
    module: "Products",
    reference: "ELP-END-ECS-002",
    actor: "Manager Desk",
    timestamp: formatLiveDate(getOffsetIsoDate(12), true),
    status: "Completed",
  },
  {
    id: "act-2",
    action: "Reviewed institutional quote from Cedarcrest Hospitals, Abuja",
    module: "Quotes",
    reference: "ELP-20261029-7390",
    actor: "Manager Desk",
    timestamp: formatLiveDate(getOffsetIsoDate(38), true),
    status: "In Progress",
  },
  {
    id: "act-3",
    action: "Verified Powered Endoscopic Linear Stapler (#p11) specs",
    module: "Products",
    reference: "ELP-END-PEL-011",
    actor: "Manager Desk",
    timestamp: formatLiveDate(getOffsetIsoDate(65), true),
    status: "Completed",
  },
  {
    id: "act-4",
    action: "Updated Gastrointestinal & Colorectal Surgery specialty",
    module: "Specialties",
    reference: "gastrointestinal-colorectal-surgery",
    actor: "Manager Desk",
    timestamp: formatLiveDate(getOffsetIsoDate(180), true),
    status: "Completed",
  },
  {
    id: "act-5",
    action: "New urgent quote inquiry from Lagoon Specialist Hospital",
    module: "Quotes",
    reference: "ELP-20261029-4812",
    actor: "WhatsApp RFQ Engine",
    timestamp: formatLiveDate(getOffsetIsoDate(300), true),
    status: "Pending Review",
  },
];

