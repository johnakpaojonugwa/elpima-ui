// src/pages/super-admin/components/super-admin-notifications-modal.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  CheckCheck,
  Package,
  FileSpreadsheet,
  AlertTriangle,
  UserCheck,
  ShieldAlert,
  Database,
  Bell,
} from "lucide-react";

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

export const INITIAL_SUPER_ADMIN_NOTIFICATIONS: NotificationItem[] = [
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
    title: "Proforma Quote Dispatched via WhatsApp",
    description:
      "Amina Ibrahim marked ELP-20261028-9104 as QUOTED for Cedarcrest Hospitals",
    timestamp: "35 minutes ago",
    isRead: false,
    iconType: "quote",
  },
  {
    id: "notif-3",
    category: "general",
    day: "Today",
    title: "Equipment Stock Status Updated",
    description:
      "Mindray BeneVision N15 Patient Monitor toggled to In Stock",
    timestamp: "2 hours ago",
    isRead: true,
    iconType: "product",
  },
  {
    id: "notif-4",
    category: "general",
    day: "Yesterday",
    title: "New Supervising Manager Provisioned",
    description:
      "Chukwudi Nnamdi activated 2FA on his Supervising Manager account",
    timestamp: "Yesterday",
    isRead: true,
    iconType: "manager",
  },
  {
    id: "notif-sys-1",
    category: "system",
    day: "Today",
    title: "Cloudinary Media Pipeline Healthy",
    description:
      "Product image optimization and WebP transformation active across all uploads",
    timestamp: "1 hour ago",
    isRead: false,
    iconType: "system-db",
  },
  {
    id: "notif-sys-2",
    category: "system",
    day: "Yesterday",
    title: "Zero-Trust Session & Audit Verification",
    description:
      "All JWT refresh token rotations and audit log signatures verified",
    timestamp: "Yesterday",
    isRead: true,
    iconType: "system-shield",
  },
];

interface SuperAdminNotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onToggleRead?: (id: string) => void;
}

export const SuperAdminNotificationsModal: React.FC<
  SuperAdminNotificationsModalProps
> = ({ isOpen, onClose, notifications, onMarkAllAsRead, onToggleRead }) => {
  const [activeTab, setActiveTab] = useState<NotificationCategory>("general");

  useEffect(() => {
    const handleKeyDown = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const filteredNotifications = notifications.filter(
    (item) => item.category === activeTab,
  );

  const todayItems = filteredNotifications.filter(
    (notificationItem) => notificationItem.day === "Today",
  );
  const yesterdayItems = filteredNotifications.filter(
    (notificationItem) => notificationItem.day === "Yesterday",
  );

  const renderIcon = (type: NotificationItem["iconType"]) => {
    switch (type) {
      case "urgent":
        return (
          <div className="w-11 h-11 rounded-2xl bg-[#fee2e2] text-[#ef4444] flex items-center justify-center shrink-0 border border-rose-100/60 shadow-2xs">
            <AlertTriangle className="w-5 h-5" />
          </div>
        );
      case "quote":
        return (
          <div className="w-11 h-11 rounded-2xl bg-[#fff7ed] text-[#ea580c] flex items-center justify-center shrink-0 border border-amber-100/60 shadow-2xs">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
        );
      case "product":
        return (
          <div className="w-11 h-11 rounded-2xl bg-[#ecfdf5] text-[#10b981] flex items-center justify-center shrink-0 border border-emerald-100/60 shadow-2xs">
            <Package className="w-5 h-5" />
          </div>
        );
      case "manager":
        return (
          <div className="w-11 h-11 rounded-2xl bg-[#eff6ff] text-[#3b82f6] flex items-center justify-center shrink-0 border border-blue-100/60 shadow-2xs">
            <UserCheck className="w-5 h-5" />
          </div>
        );
      case "system-db":
        return (
          <div className="w-11 h-11 rounded-2xl bg-[#eff6ff] text-[#3b82f6] flex items-center justify-center shrink-0 border border-blue-100/60 shadow-2xs">
            <Database className="w-5 h-5" />
          </div>
        );
      case "system-shield":
        return (
          <div className="w-11 h-11 rounded-2xl bg-[#f5f3ff] text-[#8b5cf6] flex items-center justify-center shrink-0 border border-purple-100/60 shadow-2xs">
            <ShieldAlert className="w-5 h-5" />
          </div>
        );
      default:
        return (
          <div className="w-11 h-11 rounded-2xl bg-stone-100 text-stone-600 flex items-center justify-center shrink-0 shadow-2xs">
            <Bell className="w-5 h-5" />
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-5 sm:pt-14 md:pt-16 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px]"
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-[580px] bg-white rounded-[28px] shadow-2xl border border-stone-200/90 overflow-hidden z-10 my-auto sm:my-0 flex flex-col max-h-[90vh]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="notifications-title"
          >
            <div className="p-6 pb-4 border-b border-stone-200/80">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2
                    id="notifications-title"
                    className="text-2xl sm:text-[26px] font-black text-[#111827] tracking-tight leading-tight"
                  >
                    Notifications
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 font-normal pt-1">
                    Keep track of hospital RFQ inquiries and catalog alerts
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition cursor-pointer"
                  aria-label="Close notifications"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
                </button>
              </div>

              <div className="flex items-center justify-between pt-5 -mb-4">
                <div className="flex items-center gap-6">
                  <button
                    type="button"
                    onClick={() => setActiveTab("general")}
                    className={`pb-3 text-xs sm:text-sm font-bold transition-all relative cursor-pointer ${
                      activeTab === "general"
                        ? "text-[#111827]"
                        : "text-stone-400 hover:text-stone-600"
                    }`}
                  >
                    <span>General Update</span>
                    {activeTab === "general" && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#2E7D5B] rounded-full" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("system")}
                    className={`pb-3 text-xs sm:text-sm font-semibold transition-all relative cursor-pointer ${
                      activeTab === "system"
                        ? "text-[#111827]"
                        : "text-stone-400 hover:text-stone-600"
                    }`}
                  >
                    <span>System</span>
                    {activeTab === "system" && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#2E7D5B] rounded-full" />
                    )}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={onMarkAllAsRead}
                  className="flex items-center gap-1.5 pb-3 text-xs sm:text-sm font-bold text-[#2E7D5B] hover:text-[#25684c] hover:underline cursor-pointer transition select-none"
                >
                  <CheckCheck className="w-4 h-4 stroke-[2.5]" />
                  <span>Mark all as read</span>
                </button>
              </div>
            </div>

            <div className="p-6 pt-4 overflow-y-auto space-y-5 flex-1 divide-y divide-stone-100">
              {filteredNotifications.length === 0 ? (
                <div className="py-16 text-center space-y-2">
                  <Bell className="w-8 h-8 text-stone-300 mx-auto" />
                  <p className="text-sm font-semibold text-stone-600">
                    No notifications in this category.
                  </p>
                </div>
              ) : (
                <>
                  {todayItems.length > 0 && (
                    <div className="space-y-3.5 pt-1">
                      <h3 className="text-xs sm:text-sm font-bold text-stone-900 tracking-tight select-none">
                        Today
                      </h3>

                      <div className="space-y-2.5">
                        {todayItems.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => onToggleRead?.(item.id)}
                            className="flex items-start justify-between gap-3 p-2 -mx-2 rounded-2xl hover:bg-stone-50/90 transition cursor-pointer select-none group"
                          >
                            <div className="flex items-start gap-3.5 min-w-0">
                              {renderIcon(item.iconType)}
                              <div className="space-y-0.5 min-w-0 pt-0.5">
                                <h4 className="text-xs sm:text-sm font-bold text-[#111827] group-hover:text-[#2E7D5B] transition-colors leading-tight">
                                  {item.title}
                                </h4>
                                <p className="text-[11px] sm:text-xs text-stone-500 font-normal leading-relaxed line-clamp-2">
                                  {item.description}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-col items-end justify-between self-stretch shrink-0 pt-0.5">
                              {!item.isRead ? (
                                <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
                              ) : (
                                <span className="w-2 h-2" />
                              )}
                              <span className="text-[11px] text-stone-400 font-normal">
                                {item.timestamp}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {yesterdayItems.length > 0 && (
                    <div className="space-y-3.5 pt-4">
                      <h3 className="text-xs sm:text-sm font-bold text-stone-900 tracking-tight select-none">
                        Yesterday
                      </h3>

                      <div className="space-y-2.5">
                        {yesterdayItems.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => onToggleRead?.(item.id)}
                            className="flex items-start justify-between gap-3 p-2 -mx-2 rounded-2xl hover:bg-stone-50/90 transition cursor-pointer select-none group"
                          >
                            <div className="flex items-start gap-3.5 min-w-0">
                              {renderIcon(item.iconType)}
                              <div className="space-y-0.5 min-w-0 pt-0.5">
                                <h4 className="text-xs sm:text-sm font-bold text-[#111827] group-hover:text-[#2E7D5B] transition-colors leading-tight">
                                  {item.title}
                                </h4>
                                <p className="text-[11px] sm:text-xs text-stone-500 font-normal leading-relaxed line-clamp-2">
                                  {item.description}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-col items-end justify-between self-stretch shrink-0 pt-0.5">
                              {!item.isRead ? (
                                <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
                              ) : (
                                <span className="w-2 h-2" />
                              )}
                              <span className="text-[11px] text-stone-400 font-normal">
                                {item.timestamp}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

