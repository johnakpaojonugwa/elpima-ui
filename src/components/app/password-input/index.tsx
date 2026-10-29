import React, { useState } from "react";
import { Eye, EyeOff, Check, Shield, ShieldCheck } from "lucide-react";
import { TextBoxProps } from "../textbox";
import { evaluatePassword } from "./password-strength";
import { ErrorMessage } from "../error-message";

export interface PasswordInputProps
  extends Omit<TextBoxProps, "type" | "rightElement"> {
  showStrengthMeter?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  disabled,
  error,
  helperText,
  label = "PASSWORD",
  id = "password",
  placeholder = "••••••••",
  required,
  showStrengthMeter = true,
  onChange,
  onFocus,
  onBlur,
  className = "",
  containerClassName = "",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const stringVal = typeof value === "string" ? value : "";
  const evaluation = evaluatePassword(stringVal);

  const toggleVisibility = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!disabled) {
      setShowPassword((prev) => !prev);
    }
  };

  const inputId = id || "password-input";

  return (
    <div className={`w-full flex flex-col ${containerClassName}`}>
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

        {showStrengthMeter && stringVal.length > 0 && (
          <div
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold transition-all duration-200 ${evaluation.badgeBg} ${evaluation.badgeText}`}
          >
            {evaluation.score >= 3 ? (
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
            ) : (
              <Shield className="w-3 h-3 text-amber-500" />
            )}
            <span>{evaluation.label}</span>
          </div>
        )}
      </div>

      <div className="relative flex items-center w-full">
        <input
          id={inputId}
          type={showPassword ? "text" : "password"}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          onChange={onChange}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={`w-full text-sm text-stone-900 placeholder:text-stone-400 bg-[#F4F4F5] hover:bg-[#EAEAEB] focus:bg-white transition-all duration-150 rounded-xl px-4 py-3.5 pr-11 outline-none border ${
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

        <button
          type="button"
          tabIndex={-1}
          onClick={toggleVisibility}
          disabled={disabled}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className={`absolute right-3.5 p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors ${
            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          }`}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>

      <ErrorMessage id={`${inputId}-error`} error={error} />

      {!error && helperText && (
        <p className="text-xs text-stone-500 mt-1.5">{helperText}</p>
      )}

      {showStrengthMeter && stringVal.length > 0 && (
        <div className="mt-2.5 space-y-2 animate-in fade-in duration-150">
          <div className="grid grid-cols-4 gap-1.5">
            {[1, 2, 3, 4].map((step) => {
              const isActive = evaluation.score >= step;
              return (
                <div
                  key={step}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    isActive ? evaluation.color : "bg-stone-200"
                  }`}
                />
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-stone-500">
            <span>{evaluation.suggestion}</span>
          </div>

          {(isFocused || evaluation.score < 3) && (
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {[
                { label: "8+ chars", met: evaluation.criteria.minLength },
                { label: "Uppercase", met: evaluation.criteria.hasUppercase },
                { label: "Lowercase", met: evaluation.criteria.hasLowercase },
                { label: "Number", met: evaluation.criteria.hasNumber },
                { label: "Symbol", met: evaluation.criteria.hasSpecial },
              ].map((item, idx) => (
                <span
                  key={idx}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors border ${
                    item.met
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : "bg-stone-100 text-stone-500 border-stone-200/60"
                  }`}
                >
                  {item.met ? (
                    <Check className="w-2.5 h-2.5 text-emerald-600 stroke-[2.5]" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
                  )}
                  {item.label}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

