import React from "react";
import { useToast, dismissToast } from "@/hooks/use-toast";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

export const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toastItem) => {
        const bg =
          toastItem.type === "success"
            ? "bg-emerald-50 text-emerald-950 border-emerald-200"
            : toastItem.type === "error"
              ? "bg-rose-50 text-rose-950 border-rose-200"
              : toastItem.type === "warning"
                ? "bg-amber-50 text-amber-950 border-amber-200"
                : "bg-stone-900 text-white border-stone-800";

        const iconColor =
          toastItem.type === "success"
            ? "text-emerald-600"
            : toastItem.type === "error"
              ? "text-rose-600"
              : toastItem.type === "warning"
                ? "text-amber-600"
                : "text-stone-300";

        const Icon =
          toastItem.type === "success"
            ? CheckCircle2
            : toastItem.type === "error"
              ? AlertCircle
              : toastItem.type === "warning"
                ? AlertTriangle
                : Info;

        return (
          <div
            key={toastItem.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border shadow-lg transition-all animate-in fade-in slide-in-from-top-2 duration-200 ${bg}`}
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
            <p className="text-xs sm:text-sm font-medium flex-1 leading-snug">
              {toastItem.message}
            </p>
            <button
              type="button"
              onClick={() => dismissToast(toastItem.id)}
              className="p-1 rounded-lg opacity-70 hover:opacity-100 transition cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;

