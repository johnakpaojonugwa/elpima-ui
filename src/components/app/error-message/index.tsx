import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle } from "lucide-react";

export interface ErrorMessageProps {
  id?: string;
  error?: string;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  id,
  error,
  className = "",
}) => {
  return (
    <AnimatePresence initial={false}>
      {error ? (
        <motion.div
          key="error-message"
          initial={{ opacity: 0, height: 0, y: -6 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0, y: -6 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          <div
            id={id}
            role="alert"
            aria-live="polite"
            className={`text-xs text-rose-600 font-medium pt-1.5 flex items-center gap-1.5 ${className}`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="leading-tight">{error}</span>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

