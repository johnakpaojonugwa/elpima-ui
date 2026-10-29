import type { ComponentType } from "react";

export type ControlAdminRole = "Catalog Ops" | "Quote Desk";

export type ControlAdminStatDirection = "up" | "down";

export interface ControlAdminStatCard {
  id: string;
  label: string;
  value: string;
  change: string;
  direction: ControlAdminStatDirection;
  comparisonText: string;
  icon: ComponentType<{ className?: string }>;
}

export interface ControlAdminNavItem {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  badge?: string;
  active?: boolean;
  path?: string;
  children?: { id: string; label: string; path: string }[];
}

export interface ControlAdminRecentActivityRow {
  id: string;
  action: string;
  module: "Products" | "Quotes" | "Categories" | "Specialties" | "Uploads";
  reference: string;
  actor: string;
  timestamp: string;
  status: "Completed" | "Pending Review" | "In Progress";
}

export interface ControlAdminQuotePoint {
  day: string;
  value: number;
}

export interface ControlAdminStockPoint {
  category: string;
  inStock: number;
  lowStock: number;
}

