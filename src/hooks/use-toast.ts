import { useCallback, useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

type Listener = (toasts: ToastItem[]) => void;

let memoryToasts: ToastItem[] = [];
const listeners = new Set<Listener>();

function emitChange() {
  for (const listener of listeners) {
    listener(memoryToasts);
  }
}

export function dismissToast(toastId: string) {
  memoryToasts = memoryToasts.filter((toastItem) => toastItem.id !== toastId);
  emitChange();
}

export function showToast(
  message: string,
  type: ToastType = "info",
  durationMs = 3500,
) {
  const toastId = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  memoryToasts = [...memoryToasts, { id: toastId, message, type }];
  emitChange();

  if (durationMs > 0) {
    setTimeout(() => {
      dismissToast(toastId);
    }, durationMs);
  }

  return toastId;
}

export const toast = {
  show: (toastMessage: string, duration?: number) =>
    showToast(toastMessage, "info", duration),
  success: (toastMessage: string, duration?: number) =>
    showToast(toastMessage, "success", duration),
  error: (toastMessage: string, duration?: number) =>
    showToast(toastMessage, "error", duration),
  info: (toastMessage: string, duration?: number) =>
    showToast(toastMessage, "info", duration),
  warning: (toastMessage: string, duration?: number) =>
    showToast(toastMessage, "warning", duration),
  dismiss: dismissToast,
};

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>(memoryToasts);

  useEffect(() => {
    listeners.add(setToasts);
    return () => {
      listeners.delete(setToasts);
    };
  }, []);

  const trigger = useCallback(
    (message: string, type: ToastType = "info", durationMs = 3500) =>
      showToast(message, type, durationMs),
    [],
  );

  const latestToast = toasts.length > 0 ? toasts[toasts.length - 1] : null;

  return {
    toasts,
    message: latestToast?.message ?? null,
    show: trigger,
    toast: trigger,
    success: toast.success,
    error: toast.error,
    info: toast.info,
    warning: toast.warning,
    dismiss: dismissToast,
  };
}
