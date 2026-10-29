import React, { forwardRef } from "react";
import { ErrorMessage } from "../error-message";

export interface TextBoxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  containerClassName?: string;
}

export const TextBox = forwardRef<HTMLInputElement, TextBoxProps>(
  (
    {
      label,
      id,
      error,
      helperText,
      leftIcon,
      rightElement,
      disabled,
      className = "",
      containerClassName = "",
      required,
      ...props
    },
    ref,
  ) => {
    const inputId =
      id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className={`w-full flex flex-col ${containerClassName}`}>
        {label && (
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor={inputId}
              className={`text-xs font-bold tracking-wider uppercase transition-colors ${
                disabled ? "text-stone-400" : "text-stone-700"
              }`}
            >
              {label}
              {required && (
                <span className="text-rose-500 ml-1 font-semibold">*</span>
              )}
            </label>
          </div>
        )}

        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-stone-400 z-10">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                  ? `${inputId}-helper`
                  : undefined
            }
            className={`w-full text-sm text-stone-900 placeholder:text-stone-400 bg-[#F4F4F5] hover:bg-[#EAEAEB] focus:bg-white transition-all duration-150 rounded-xl px-4 py-3.5 outline-none border ${
              leftIcon ? "pl-10" : ""
            } ${rightElement ? "pr-11" : ""} ${
              error
                ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15"
                : "border-stone-200/90 focus:border-[#2D7A58] focus:ring-2 focus:ring-[#2D7A58]/20"
            } ${
              disabled
                ? "bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed opacity-60"
                : ""
            } ${className}`}
            {...props}
          />

          {rightElement && (
            <div className="absolute right-3.5 flex items-center z-10">
              {rightElement}
            </div>
          )}
        </div>

        <ErrorMessage id={`${inputId}-error`} error={error} />

        {!error && helperText && (
          <p id={`${inputId}-helper`} className="text-xs text-stone-500 mt-1.5">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

TextBox.displayName = "TextBox";

