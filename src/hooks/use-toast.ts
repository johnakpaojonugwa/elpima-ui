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

export function dismissToast(id: string) {
  memoryToasts = memoryToasts.filter((t) => t.id !== id);
  emitChange();
}

export function showToast(
  message: string,
  type: ToastType = "info",
  durationMs = 3500,
) {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  memoryToasts = [...memoryToasts, { id, message, type }];
  emitChange();

  if (durationMs > 0) {
    setTimeout(() => {
      dismissToast(id);
    }, durationMs);
  }

  return id;
}

export const toast = {
  show: (msg: string, duration?: number) => showToast(msg, "info", duration),
  success: (msg: string, duration?: number) =>
    showToast(msg, "success", duration),
  error: (msg: string, duration?: number) => showToast(msg, "error", duration),
  info: (msg: string, duration?: number) => showToast(msg, "info", duration),
  warning: (msg: string, duration?: number) =>
    showToast(msg, "warning", duration),
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
