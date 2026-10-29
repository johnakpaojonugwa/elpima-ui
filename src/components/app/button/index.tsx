import React from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className = "",
  type = "button",
  ...props
}) => {
  const variantStyles = {
    primary:
      "bg-[#2D7A58] hover:bg-[#256649] active:bg-[#1E523A] text-white shadow-sm hover:shadow-md transition-all border border-transparent",
    secondary:
      "bg-stone-800 hover:bg-stone-900 active:bg-black text-white shadow-sm border border-transparent",
    outline:
      "bg-transparent hover:bg-stone-100/80 active:bg-stone-200/60 text-stone-700 border border-stone-300",
    ghost:
      "bg-transparent hover:bg-stone-100 text-stone-700 active:bg-stone-200/50 border border-transparent",
  };

  const sizeStyles = {
    sm: "px-3.5 py-2 text-xs font-bold rounded-lg gap-1.5",
    md: "px-5 py-3.5 text-sm font-bold rounded-xl gap-2",
    lg: "px-6 py-4 text-base font-bold rounded-xl gap-2.5",
  };

  const isButtonDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      disabled={isButtonDisabled}
      aria-busy={isLoading}
      className={`relative inline-flex items-center justify-center font-semibold select-none transition-all duration-150 active:scale-[0.99] cursor-pointer ${
        variantStyles[variant]
      } ${sizeStyles[size]} ${
        isButtonDisabled
          ? "opacity-60 cursor-not-allowed pointer-events-none hover:shadow-none"
          : ""
      } ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />
          <span>Please wait...</span>
        </span>
      ) : (
        <span className="inline-flex items-center gap-2">
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </span>
      )}
    </button>
  );
};

