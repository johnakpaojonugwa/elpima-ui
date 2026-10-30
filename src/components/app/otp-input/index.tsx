import React, { useRef, useEffect, useCallback } from "react";
import { ErrorMessage } from "../error-message";

export interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (otp: string) => void;
  onComplete?: (otp: string) => void;
  disabled?: boolean;
  error?: string;
  autoFocus?: boolean;
  className?: string;
  idPrefix?: string;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled = false,
  error,
  autoFocus = true,
  className = "",
  idPrefix = "otp-input",
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length }, (_, i) => value[i] || "");

  useEffect(() => {
    if (autoFocus && !disabled) {
      const firstEmptyIndex = digits.findIndex(
        (digitCharacter) => !digitCharacter,
      );
      const targetIndex = firstEmptyIndex !== -1 ? firstEmptyIndex : 0;
      inputRefs.current[targetIndex]?.focus();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (
    changeEvent: React.ChangeEvent<HTMLInputElement>,
    digitIndex: number,
  ) => {
    const rawInputValue = changeEvent.target.value;
    const cleanDigit = rawInputValue.replace(/\D/g, "");

    if (!cleanDigit) {
      const newDigits = [...digits];
      newDigits[digitIndex] = "";
      onChange(newDigits.join(""));
      return;
    }

    const lastChar = cleanDigit[cleanDigit.length - 1];
    const newDigits = [...digits];
    newDigits[digitIndex] = lastChar;
    const newOtp = newDigits.join("");
    onChange(newOtp);

    if (digitIndex < length - 1) {
      inputRefs.current[digitIndex + 1]?.focus();
      inputRefs.current[digitIndex + 1]?.select();
    }

    if (newOtp.length === length && !newOtp.includes(" ")) {
      onComplete?.(newOtp);
    }
  };

  const handleKeyDown = (
    keyboardEvent: React.KeyboardEvent<HTMLInputElement>,
    digitIndex: number,
  ) => {
    if (keyboardEvent.key === "Backspace") {
      keyboardEvent.preventDefault();
      if (digits[digitIndex]) {
        const newDigits = [...digits];
        newDigits[digitIndex] = "";
        onChange(newDigits.join(""));
      } else if (digitIndex > 0) {
        const newDigits = [...digits];
        newDigits[digitIndex - 1] = "";
        onChange(newDigits.join(""));
        inputRefs.current[digitIndex - 1]?.focus();
      }
    } else if (keyboardEvent.key === "ArrowLeft" && digitIndex > 0) {
      keyboardEvent.preventDefault();
      inputRefs.current[digitIndex - 1]?.focus();
      inputRefs.current[digitIndex - 1]?.select();
    } else if (keyboardEvent.key === "ArrowRight" && digitIndex < length - 1) {
      keyboardEvent.preventDefault();
      inputRefs.current[digitIndex + 1]?.focus();
      inputRefs.current[digitIndex + 1]?.select();
    } else if (keyboardEvent.key === "Delete") {
      keyboardEvent.preventDefault();
      const newDigits = [...digits];
      newDigits[digitIndex] = "";
      onChange(newDigits.join(""));
    }
  };

  const handlePaste = useCallback(
    (
      clipboardEvent: React.ClipboardEvent<HTMLInputElement>,
      activeIndex: number,
    ) => {
      clipboardEvent.preventDefault();
      const clipboardText = clipboardEvent.clipboardData.getData("text/plain");
      const pastedDigits = clipboardText.replace(/\D/g, "");
      if (!pastedDigits) return;

      const newDigits = [...digits];
      const startIndex = pastedDigits.length >= length ? 0 : activeIndex;

      let lastFilledIndex = startIndex;
      for (
        let charIndex = 0;
        charIndex < pastedDigits.length && startIndex + charIndex < length;
        charIndex++
      ) {
        newDigits[startIndex + charIndex] = pastedDigits[charIndex];
        lastFilledIndex = startIndex + charIndex;
      }

      const newOtp = newDigits.join("");
      onChange(newOtp);

      const nextFocus = Math.min(lastFilledIndex + 1, length - 1);
      inputRefs.current[nextFocus]?.focus();
      inputRefs.current[nextFocus]?.select();

      if (newOtp.length === length) {
        onComplete?.(newOtp);
      }
    },
    [digits, length, onChange, onComplete],
  );

  return (
    <div className={`w-full flex flex-col items-center ${className}`}>
      <div
        className="flex items-center justify-center gap-2 sm:gap-3 select-none"
        role="group"
        aria-label="Verification code inputs"
      >
        {Array.from({ length }, (_, digitIndex) => {
          const digit = digits[digitIndex] || "";
          const isFilled = Boolean(digit);

          return (
            <div key={digitIndex} className="relative">
              <input
                id={`${idPrefix}-${digitIndex}`}
                ref={(inputElement) => {
                  inputRefs.current[digitIndex] = inputElement;
                }}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                disabled={disabled}
                onChange={(changeEvent) =>
                  handleChange(changeEvent, digitIndex)
                }
                onKeyDown={(keyboardEvent) =>
                  handleKeyDown(keyboardEvent, digitIndex)
                }
                onPaste={(clipboardEvent) =>
                  handlePaste(clipboardEvent, digitIndex)
                }
                onFocus={(focusEvent) => focusEvent.target.select()}
                aria-label={`Digit ${digitIndex + 1} of ${length}`}
                className={`w-11 h-12 sm:w-12 sm:h-13 text-center text-lg sm:text-xl font-bold rounded-lg border transition-all duration-150 outline-none select-all ${
                  disabled
                    ? "bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed"
                    : error
                      ? "bg-[#F4F4F5] border-rose-400 text-stone-900 ring-2 ring-rose-500/15"
                      : isFilled
                        ? "bg-white border-stone-400 text-stone-900 shadow-2xs focus:border-[#2D7A58] focus:ring-2 focus:ring-[#2D7A58]/20"
                        : "bg-[#F8F8F9] hover:bg-[#F2F2F4] border-stone-300 text-stone-900 focus:bg-white focus:border-[#2D7A58] focus:ring-2 focus:ring-[#2D7A58]/20"
                }`}
              />

              {!isFilled && (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center justify-center pointer-events-none text-stone-300 text-sm font-semibold select-none"
                >
                  -
                </span>
              )}
            </div>
          );
        })}
      </div>

      <ErrorMessage
        id={`${idPrefix}-error`}
        error={error}
        className="mt-3 text-center"
      />
    </div>
  );
};

