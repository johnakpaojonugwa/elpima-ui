// src/pages/super-admin/dashboard/types.ts

export interface SuperAdminSubNavItem {
  id: string;
  label: string;
  path: string;
}

export interface SuperAdminNavItem {
  id: string;
  label: string;
  iconName: string;
  path: string;
  badge?: string | number;
  subItems?: SuperAdminSubNavItem[];
}

export interface SuperAdminStatCard {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  bgClass: string;
  iconName: "Package" | "FileSpreadsheet" | "AlertTriangle" | "UserCheck";
}

export type DashboardTimePeriod = "Weekly" | "Monthly" | "Yearly";

export interface QuoteTrendDataPoint {
  periodLabel: string;
  month?: string;
  quotes: number;
}

export interface CatalogFulfillmentDataPoint {
  periodLabel: string;
  day?: string;
  inquiries: number;
  fulfilled: number;
}

export interface AdminActivityItem {
  id: string;
  no: number;
  adminName: string;
  role: string;
  action: string;
  target: string;
  date: string;
  status: "Success" | "Failed" | "Pending";
}

export interface RecentQuoteItem {
  id: string;
  no: number;
  reference: string;
  customerName: string;
  hospitalClinic: string;
  phone: string;
  priority: "STANDARD" | "URGENT";
  status: "NEW" | "CONTACTED" | "QUOTED" | "FULFILLED" | "CANCELLED";
  itemsCount: number;
  dateCreated: string;
}

export interface SupervisingManagerRowItem {
  id: string;
  no: number;
  fullName: string;
  email: string;
  phone: string;
  assignedQuotesCount: number;
  lastLogin: string;
  accountStatus: "Active" | "Suspended";
}

