import React, {
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";

export interface FloatingPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
  className?: string;
  matchWidth?: boolean;
  minWidth?: number;
  maxWidth?: number;
  placement?: "bottom" | "top" | "auto";
  offset?: number;
  align?: "left" | "right";
}

interface Coords {
  top?: number;
  bottom?: number;
  left: number;
  width: number;
  maxHeight: number;
  isUpwards: boolean;
}

export const FloatingPopover: React.FC<FloatingPopoverProps> = ({
  isOpen,
  onClose,
  triggerRef,
  children,
  className = "",
  matchWidth = true,
  minWidth = 200,
  maxWidth = 480,
  placement = "auto",
  offset = 6,
  align = "left",
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<Coords | null>(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Check vertical space
    const spaceBelow = viewportHeight - rect.bottom - offset - 16;
    const spaceAbove = rect.top - offset - 16;

    const shouldOpenUpwards =
      placement === "top" ||
      (placement === "auto" && spaceBelow < 260 && spaceAbove > spaceBelow);

    const availableHeight = shouldOpenUpwards ? spaceAbove : spaceBelow;
    const maxHeight = Math.max(180, Math.min(availableHeight, 380));

    // Calculate horizontal bounds
    let width = matchWidth
      ? rect.width
      : Math.max(minWidth, Math.min(rect.width, maxWidth));
    if (width > viewportWidth - 24) {
      width = viewportWidth - 24;
    }

    let left = align === "right" ? rect.right - width : rect.left;
    if (left + width > viewportWidth - 12) {
      left = Math.max(12, viewportWidth - width - 12);
    }
    if (left < 12) {
      left = 12;
    }

    if (shouldOpenUpwards) {
      setCoords({
        bottom: viewportHeight - rect.top + offset,
        left,
        width,
        maxHeight,
        isUpwards: true,
      });
    } else {
      setCoords({
        top: rect.bottom + offset,
        left,
        width,
        maxHeight,
        isUpwards: false,
      });
    }
  }, [triggerRef, offset, placement, matchWidth, minWidth, maxWidth, align]);

  useLayoutEffect(() => {
    if (isOpen) {
      updatePosition();
    }
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) return;

    // Update position on scroll (capture phase catches nested container scrolling)
    const handleScroll = (e: Event) => {
      // Don't reposition if user is scrolling inside the popover itself!
      if (popoverRef.current && popoverRef.current.contains(e.target as Node)) {
        return;
      }
      updatePosition();
    };

    const handleResize = () => {
      updatePosition();
    };

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (triggerRef.current && triggerRef.current.contains(target)) {
        return;
      }
      if (popoverRef.current && popoverRef.current.contains(target)) {
        return;
      }
      onClose();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, updatePosition, triggerRef]);

  if (!isOpen || !coords) return null;

  return createPortal(
    <div
      ref={popoverRef}
      style={{
        position: "fixed",
        top: coords.top !== undefined ? `${coords.top}px` : undefined,
        bottom: coords.bottom !== undefined ? `${coords.bottom}px` : undefined,
        left: `${coords.left}px`,
        width: `${coords.width}px`,
        maxHeight: `${coords.maxHeight}px`,
        zIndex: 9999,
      }}
      className={`bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150 ${className}`}
    >
      {children}
    </div>,
    document.body
  );
};

export interface FloatingSelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface FloatingSelectProps {
  id?: string;
  label?: string;
  menuTitle?: string;
  value: string;
  options: FloatingSelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  iconOnly?: boolean;
  isActiveFilter?: boolean;
  disabled?: boolean;
  required?: boolean;
  size?: "sm" | "md";
  align?: "left" | "right";
  matchWidth?: boolean;
  minWidth?: number;
  className?: string;
  containerClassName?: string;
}

export const FloatingSelect: React.FC<FloatingSelectProps> = ({
  id,
  label,
  menuTitle,
  value,
  options,
  onChange,
  placeholder = "Select option",
  icon,
  iconOnly = false,
  isActiveFilter = false,
  disabled = false,
  required = false,
  size = "md",
  align = "left",
  matchWidth = false,
  minWidth = 210,
  className = "",
  containerClassName = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (nextValue: string) => {
    if (disabled) return;
    onChange(nextValue);
    setIsOpen(false);
  };

  const sizeClasses = iconOnly
    ? size === "sm"
      ? "p-2 text-xs rounded-xl"
      : "p-2.5 text-xs rounded-xl"
    : size === "sm"
      ? "px-3 py-1.5 text-xs rounded-xl gap-2"
      : "px-3.5 py-2.5 text-xs sm:text-sm rounded-xl gap-2";

  const triggerIcon = selectedOption?.icon ?? icon;

  return (
    <div className={`flex flex-col relative ${containerClassName}`}>
      {label && (
        <label
          htmlFor={id}
          className={`text-xs font-bold text-stone-700 uppercase tracking-wider mb-1 block ${
            disabled ? "text-stone-400" : ""
          }`}
        >
          {label}
          {required && (
            <span className="text-rose-500 ml-1 font-semibold">*</span>
          )}
        </label>
      )}

      <button
        id={id}
        ref={triggerRef}
        type="button"
        disabled={disabled}
        title={selectedOption ? selectedOption.label : placeholder}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`relative inline-flex items-center justify-between text-left transition-all duration-150 border outline-none cursor-pointer select-none ${sizeClasses} ${
          disabled
            ? "bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed opacity-60"
            : isOpen
              ? "bg-white border-[#2E7D5B] ring-2 ring-[#2E7D5B]/15 text-stone-900"
              : isActiveFilter
                ? "bg-emerald-50/70 hover:bg-emerald-50 border-[#2E7D5B]/40 text-[#2E7D5B]"
                : "bg-white hover:bg-stone-50 border-stone-200 text-stone-800 focus:border-[#2E7D5B] focus:ring-2 focus:ring-[#2E7D5B]/15"
        } ${className}`}
      >
        <span className="inline-flex items-center gap-2 min-w-0">
          {triggerIcon && (
            <span
              className={`shrink-0 flex items-center justify-center ${
                isOpen || isActiveFilter ? "text-[#2E7D5B]" : "text-stone-500"
              }`}
            >
              {triggerIcon}
            </span>
          )}
          {!iconOnly && (
            <span
              className={`truncate ${
                selectedOption
                  ? isActiveFilter
                    ? "font-bold text-[#2E7D5B]"
                    : "font-medium text-stone-800"
                  : "text-stone-400"
              }`}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          )}
        </span>

        {!iconOnly && (
          <ChevronDown
            className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
              isOpen
                ? "rotate-180 text-[#2E7D5B]"
                : isActiveFilter
                  ? "text-[#2E7D5B]"
                  : "text-stone-500"
            }`}
          />
        )}

        {iconOnly && isActiveFilter && (
          <span className="w-2 h-2 rounded-full bg-[#2E7D5B] absolute -top-0.5 -right-0.5 ring-2 ring-white" />
        )}
      </button>

      <FloatingPopover
        isOpen={isOpen && !disabled}
        onClose={() => setIsOpen(false)}
        triggerRef={triggerRef}
        matchWidth={matchWidth && !iconOnly}
        minWidth={minWidth}
        maxWidth={360}
        align={align}
        className="py-1.5 overflow-y-auto"
      >
        {menuTitle && (
          <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400 border-b border-stone-100 mb-1">
            {menuTitle}
          </div>
        )}
        {options.map((option) => {
          const isSelected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={isSelected}
              onClick={() => handleSelect(option.value)}
              className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 text-xs sm:text-[13px] text-left transition-colors cursor-pointer ${
                isSelected
                  ? "bg-emerald-50/90 text-[#2E7D5B] font-semibold"
                  : "hover:bg-stone-50 text-stone-700 font-medium"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                {option.icon && (
                  <span
                    className={`shrink-0 ${
                      isSelected ? "text-[#2E7D5B]" : "text-stone-400"
                    }`}
                  >
                    {option.icon}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <div className="truncate">{option.label}</div>
                  {option.description && (
                    <div className="text-[11px] text-stone-400 truncate mt-0.5">
                      {option.description}
                    </div>
                  )}
                </div>
              </div>
              {isSelected && (
                <Check className="w-4 h-4 text-[#2E7D5B] stroke-[2.5] shrink-0" />
              )}
            </button>
          );
        })}
      </FloatingPopover>
    </div>
  );
};
