// src/pages/admin-shared/types.ts

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

export type NotificationCategory = "general" | "system";

export interface NotificationItem {
  id: string;
  category: NotificationCategory;
  day: "Today" | "Yesterday";
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  iconType:
    | "quote"
    | "urgent"
    | "product"
    | "manager"
    | "system-db"
    | "system-shield";
}

