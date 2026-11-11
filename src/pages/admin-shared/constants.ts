// src/pages/admin-shared/constants.ts
import { formatLiveDate, getOffsetIsoDate } from "@/utils/date";
import type { NotificationItem, RecentQuoteItem } from "./types";

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

export const INITIAL_ADMIN_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    category: "general",
    day: "Today",
    title: "Urgent Hospital RFQ Submitted",
    description:
      "Lagoon Specialist Hospital requested a quote for 4 ICU & Surgical units (ELP-20261029-4821)",
    timestamp: "Just Now",
    isRead: false,
    iconType: "urgent",
  },
  {
    id: "notif-2",
    category: "general",
    day: "Today",
    title: "Low Inventory Alert",
    description:
      "Disposable Curved Cutter Stapler stock fell below critical threshold (2 units remaining)",
    timestamp: "24m ago",
    isRead: false,
    iconType: "product",
  },
  {
    id: "notif-3",
    category: "system",
    day: "Today",
    title: "Automated Backup Completed",
    description:
      "Database snapshot and product images archived to multi-region cloud bucket successfully",
    timestamp: "2h ago",
    isRead: true,
    iconType: "system-db",
  },
  {
    id: "notif-4",
    category: "general",
    day: "Yesterday",
    title: "Staff Member Onboarded",
    description:
      "New Supervising Manager account provisioned for Catalog Operations team",
    timestamp: "Yesterday",
    isRead: true,
    iconType: "manager",
  },
  {
    id: "notif-5",
    category: "system",
    day: "Yesterday",
    title: "Security Audit Triggered",
    description:
      "Elevated role permission verification executed across all authenticated sessions",
    timestamp: "Yesterday",
    isRead: true,
    iconType: "system-shield",
  },
];

