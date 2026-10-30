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

function normalizeNotification(rawNotification: any): NotificationItem {
  return {
    id: String(
      rawNotification.id ||
        rawNotification._id ||
        `${Date.now()}-${Math.random()}`,
    ),
    category:
      rawNotification.category === "system" ||
      rawNotification.category === "general"
        ? rawNotification.category
        : (rawNotification.type || "").toLowerCase().includes("system")
          ? "system"
          : "general",
    day: normalizeDay(
      rawNotification.day,
      rawNotification.timestamp,
      rawNotification.createdAt,
    ),
    title: rawNotification.title || "Notification",
    description:
      rawNotification.description ||
      rawNotification.message ||
      rawNotification.body ||
      "",
    timestamp: normalizeTimestamp(
      rawNotification.timestamp,
      rawNotification.createdAt,
    ),
    isRead: Boolean(rawNotification.isRead ?? rawNotification.read ?? false),
    iconType: normalizeIconType(
      rawNotification.iconType,
      rawNotification.type,
      rawNotification.category,
    ),
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
      const response = await apiClient.get("/api/v1/notifications", {
        headers: authHeader,
      });

      const rawList = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.notifications)
          ? response.data.notifications
          : Array.isArray(response.data?.data)
            ? response.data.data
            : [];

      return rawList.map(normalizeNotification);
    },
    enabled: !!token,
  });

  // 2. Fetch unread count for bell badge
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      const response = await apiClient.get("/api/v1/notifications/unread-count", {
        headers: authHeader,
      });

      if (typeof response.data === "number") return response.data;
      if (typeof response.data?.unreadCount === "number")
        return response.data.unreadCount;
      if (typeof response.data?.count === "number") return response.data.count;
      return 0;
    },
    enabled: !!token,
  });

  // 3. Mark single notification as read mutation
  const toggleReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      await apiClient.patch(
        `/api/v1/notifications/${notificationId}/read`,
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

          const notificationItem = rawData?.data || rawData;

          // Invalidate queries so modal and badge update in real-time
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
          queryClient.invalidateQueries({
            queryKey: ["notifications", "unread-count"],
          });

          // Trigger pop-up toast alert using existing toast system
          const title = notificationItem?.title || "New Notification";
          const description =
            notificationItem?.description || notificationItem?.message;
          const toastMessage = description
            ? `${title}: ${description}`
            : title;

          toast.info(toastMessage);
        } catch (parseError) {
          console.error(
            "Failed to parse SSE notification payload:",
            parseError,
          );
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
    } catch (initializationError) {
      console.warn(
        "EventSource initialization failed:",
        initializationError,
      );
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
    toggleRead: (notificationId: string) =>
      toggleReadMutation.mutate(notificationId),
  };
}

export default useNotifications;

