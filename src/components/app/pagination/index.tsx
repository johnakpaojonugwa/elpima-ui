import React, { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (targetPage: number) => void;
  siblingCount?: number;
  disabled?: boolean;
  className?: string;
  showSummary?: boolean;
  alwaysShow?: boolean;
}

const ELLIPSIS = "…";

/**
 * Builds a compact list of pages with ellipsis around gaps
 */
function buildPageWindow(
  currentPage: number,
  totalPages: number,
  siblingCount: number,
): (number | typeof ELLIPSIS)[] {
  const totalNumbers = siblingCount * 2 + 5;

  if (totalPages <= totalNumbers) {
    return Array.from(
      { length: Math.max(1, totalPages) },
      (_, pageIndex) => pageIndex + 1,
    );
  }

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  const pages: (number | typeof ELLIPSIS)[] = [];

  pages.push(1);

  if (showLeftEllipsis) {
    pages.push(ELLIPSIS);
  } else {
    for (
      let pageNumber = 2;
      pageNumber < leftSibling;
      pageNumber++
    ) {
      pages.push(pageNumber);
    }
  }

  for (
    let pageNumber = leftSibling;
    pageNumber <= rightSibling;
    pageNumber++
  ) {
    if (pageNumber !== 1 && pageNumber !== totalPages) {
      pages.push(pageNumber);
    }
  }

  if (showRightEllipsis) {
    pages.push(ELLIPSIS);
  } else {
    for (
      let pageNumber = rightSibling + 1;
      pageNumber < totalPages;
      pageNumber++
    ) {
      pages.push(pageNumber);
    }
  }

  if (totalPages > 1) pages.push(totalPages);

  return pages;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  disabled = false,
  className = "",
  showSummary = true,
  alwaysShow = false,
}) => {
  const pages = useMemo(
    () => buildPageWindow(currentPage, totalPages, siblingCount),
    [currentPage, totalPages, siblingCount],
  );

  if (totalPages <= 1 && !alwaysShow) return null;

  const goTo = (targetPage: number) => {
    if (disabled) return;
    if (targetPage < 1 || targetPage > totalPages) return;
    if (targetPage === currentPage) return;
    onPageChange(targetPage);
  };

  const baseButtonClassName =
    "inline-flex items-center justify-center min-w-9 h-9 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer select-none";

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={`flex flex-col sm:flex-row items-center ${
        showSummary ? "justify-between" : "justify-center"
      } gap-4 pt-4 ${className}`}
    >
      {showSummary && (
        <p className="text-xs sm:text-sm text-stone-500 order-2 sm:order-1">
          Page <span className="font-semibold text-stone-800">{currentPage}</span>{" "}
          of <span className="font-semibold text-stone-800">{totalPages}</span>
        </p>
      )}

      <div className="flex items-center gap-1.5 order-1 sm:order-2">
        {/* Previous */}
        <button
          type="button"
          onClick={() => goTo(currentPage - 1)}
          disabled={disabled || currentPage === 1}
          aria-label="Previous page"
          className={`${baseButtonClassName} ${
            disabled || currentPage === 1
              ? "text-stone-300 cursor-not-allowed"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Numbers and Ellipsis */}
        {pages.map((pageItem, itemIndex) => {
          if (pageItem === ELLIPSIS) {
            return (
              <span
                key={`ellipsis-${itemIndex}`}
                className="inline-flex items-center justify-center min-w-9 h-9 text-stone-400 text-xs sm:text-sm select-none"
                aria-hidden="true"
              >
                {ELLIPSIS}
              </span>
            );
          }

          const isActive = pageItem === currentPage;
          return (
            <button
              key={pageItem}
              type="button"
              onClick={() => goTo(pageItem)}
              disabled={disabled}
              aria-current={isActive ? "page" : undefined}
              className={`${baseButtonClassName} ${
                isActive
                  ? "bg-[#2D7A58] text-white shadow-2xs"
                  : disabled
                  ? "text-stone-300 cursor-not-allowed"
                  : "text-stone-700 hover:bg-stone-100"
              }`}
            >
              {pageItem}
            </button>
          );
        })}

        {/* Next */}
        <button
          type="button"
          onClick={() => goTo(currentPage + 1)}
          disabled={disabled || currentPage === totalPages}
          aria-label="Next page"
          className={`${baseButtonClassName} ${
            disabled || currentPage === totalPages
              ? "text-stone-300 cursor-not-allowed"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
