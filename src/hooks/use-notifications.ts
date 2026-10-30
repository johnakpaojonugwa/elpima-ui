// src/hooks/use-notifications.ts
import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, API_BASE_URL } from "@/libs/api-client";
import { useAuthStore } from "@/store";
import { toast } from "@/hooks/use-toast";
import type { NotificationItem } from "@/pages/super-admin/components/super-admin-notifications-modal";

function normalizeDay(
  day?: string,
  timestamp?: string,
  createdAt?: string,
): "Today" | "Yesterday" {
  if (day === "Today" || day === "Yesterday") return day;
  const dateStr = createdAt || timestamp;
  if (!dateStr) return "Today";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Today";
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const itemDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const diffDays = Math.round(
    (today.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  return diffDays <= 0 ? "Today" : "Yesterday";
}

function normalizeTimestamp(timestamp?: string, createdAt?: string): string {
  if (timestamp && isNaN(Date.parse(timestamp))) {
    return timestamp;
  }
  const dateStr = createdAt || timestamp;
  if (!dateStr) return "Just Now";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return timestamp || "Just Now";
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSec < 60) return "Just Now";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} minutes ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} hours ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function normalizeIconType(
  iconType?: string,
  type?: string,
  category?: string,
): NotificationItem["iconType"] {
  if (
    iconType === "urgent" ||
    iconType === "quote" ||
    iconType === "product" ||
    iconType === "manager" ||
    iconType === "system-db" ||
    iconType === "system-shield"
  ) {
    return iconType;
  }
  const combined = `${iconType || ""} ${type || ""} ${category || ""}`.toLowerCase();
  if (combined.includes("urgent") || combined.includes("alert")) return "urgent";
  if (combined.includes("quote") || combined.includes("rfq")) return "quote";
  if (
    combined.includes("product") ||
    combined.includes("stock") ||
    combined.includes("catalog")
  ) {
    return "product";
  }
  if (combined.includes("manager") || combined.includes("user")) return "manager";
  if (
    combined.includes("shield") ||
    combined.includes("security") ||
    combined.includes("auth")
  ) {
    return "system-shield";
  }
  if (
    combined.includes("db") ||
    combined.includes("database") ||
    combined.includes("system")
  ) {
    return "system-db";
  }
  return "quote";
}

function normalizeNotification(raw: any): NotificationItem {
  return {
    id: String(raw.id || raw._id || `${Date.now()}-${Math.random()}`),
    category:
      raw.category === "system" || raw.category === "general"
        ? raw.category
        : (raw.type || "").toLowerCase().includes("system")
          ? "system"
          : "general",
    day: normalizeDay(raw.day, raw.timestamp, raw.createdAt),
    title: raw.title || "Notification",
    description: raw.description || raw.message || raw.body || "",
    timestamp: normalizeTimestamp(raw.timestamp, raw.createdAt),
    isRead: Boolean(raw.isRead ?? raw.read ?? false),
    iconType: normalizeIconType(raw.iconType, raw.type, raw.category),
  };
}

export function useNotifications(explicitToken?: string) {
  const queryClient = useQueryClient();
  const storeToken = useAuthStore(
    (state) => state.accessToken || state.access_token,
  );
  const token = explicitToken || storeToken;

  const authHeader = token ? { Authorization: `Bearer ${token}` } : undefined;

  // 1. Fetch notifications
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/notifications", {
        headers: authHeader,
      });

      const rawList = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.notifications)
          ? res.data.notifications
          : Array.isArray(res.data?.data)
            ? res.data.data
            : [];

      return rawList.map(normalizeNotification);
    },
    enabled: !!token,
  });

  // 2. Fetch unread count for bell badge
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/notifications/unread-count", {
        headers: authHeader,
      });

      if (typeof res.data === "number") return res.data;
      if (typeof res.data?.unreadCount === "number") return res.data.unreadCount;
      if (typeof res.data?.count === "number") return res.data.count;
      return 0;
    },
    enabled: !!token,
  });

  // 3. Mark single notification as read mutation
  const toggleReadMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.patch(
        `/api/v1/notifications/${id}/read`,
        { isRead: true },
        { headers: authHeader },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      });
    },
  });

  // 4. Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      await apiClient.post(
        "/api/v1/notifications/mark-all-read",
        {},
        { headers: authHeader },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      });
    },
  });

  // 5. Real-Time SSE Stream Listener
  useEffect(() => {
    if (!token) return;

    const cleanBaseUrl = API_BASE_URL.replace(/\/+$/, "").replace(
      /\/(api\/)?v1$/i,
      "",
    );
    const sseUrl = `${cleanBaseUrl}/api/v1/notifications/stream?token=${encodeURIComponent(token)}`;

    let eventSource: EventSource | null = null;

    try {
      eventSource = new EventSource(sseUrl);

      const handleNotificationMessage = (event: MessageEvent) => {
        try {
          const rawData =
            typeof event.data === "string"
              ? JSON.parse(event.data)
              : event.data;

          const item = rawData?.data || rawData;

          // Invalidate queries so modal and badge update in real-time
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
          queryClient.invalidateQueries({
            queryKey: ["notifications", "unread-count"],
          });

          // Trigger pop-up toast alert using existing toast system
          const title = item?.title || "New Notification";
          const description = item?.description || item?.message;
          const toastMessage = description
            ? `${title}: ${description}`
            : title;

          toast.info(toastMessage);
        } catch (err) {
          console.error("Failed to parse SSE notification payload:", err);
        }
      };

      eventSource.addEventListener(
        "notification",
        handleNotificationMessage as EventListener,
      );
      eventSource.onmessage = handleNotificationMessage;

      eventSource.onerror = () => {
        // EventSource will automatically attempt to reconnect on network drop
      };
    } catch (err) {
      console.warn("EventSource initialization failed:", err);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [token, queryClient]);

  return {
    notifications: (data || []) as NotificationItem[],
    unreadCount,
    isLoading,
    refetch,
    markAllAsRead: () => markAllAsReadMutation.mutate(),
    toggleRead: (id: string) => toggleReadMutation.mutate(id),
  };
}

export default useNotifications;

