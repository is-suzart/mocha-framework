import React, { useMemo } from 'react';
import { FormControlSize, FormControlShape, FormControlColor } from './FormControls';
import { usePrefix } from './PrefixContext';
import { cn, cnEl } from './cn';

// Ellipsis Dots constant
export const DOTS = '...';

export interface UsePaginationRangeProps {
  currentPage: number;
  totalPages: number;
  siblingCount?: number;
}

/**
 * Custom hook to generate the pagination numbers array with ellipsis folding.
 */
export const usePaginationRange = ({
  currentPage,
  totalPages,
  siblingCount = 1,
}: UsePaginationRangeProps): (number | typeof DOTS)[] => {
  const paginationRange = useMemo(() => {
    const totalPageNumbers = siblingCount * 2 + 5;

    // Case 1: If total pages is less than the count of buttons we want to show
    if (totalPageNumbers >= totalPages) {
      return Array.from({ length: Math.max(totalPages, 1) }, (_, idx) => idx + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    // Case 2: Only right dots
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, idx) => idx + 1);
      return [...leftRange, DOTS, totalPages];
    }

    // Case 3: Only left dots
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, idx) => totalPages - rightItemCount + idx + 1
      );
      return [firstPageIndex, DOTS, ...rightRange];
    }

    // Case 4: Both left and right dots
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, idx) => leftSiblingIndex + idx
      );
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }

    return [];
  }, [currentPage, totalPages, siblingCount]);

  return paginationRange;
};

/* ==========================================================================
   1. Pagination Component
   ========================================================================== */

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  size?: FormControlSize;
  shape?: FormControlShape;
  color?: FormControlColor;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  showPageInput?: boolean;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  size = 'md',
  shape = 'rounded',
  color = 'mauve',
  showFirstLast = true,
  showPrevNext = true,
  showPageInput = false,
  disabled = false,
  className = '',
  ariaLabel = 'Pagination',
}) => {
  const prefix = usePrefix();
  const paginationRange = usePaginationRange({
    currentPage,
    totalPages,
    siblingCount,
  });

  const [inputVal, setInputVal] = React.useState<string>('');

  const isInputActive = inputVal.trim() !== '';
  const inputPageNum = Number(inputVal);
  const isValidPage = !isNaN(inputPageNum) && inputPageNum >= 1 && inputPageNum <= totalPages;

  const handlePageInputSubmit = () => {
    if (isValidPage) {
      onPageChange(inputPageNum);
      setInputVal('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handlePageInputSubmit();
    }
  };

  const handlePageSelect = (page: number) => {
    if (disabled || page === currentPage || page < 1 || page > totalPages) {
      return;
    }
    onPageChange(page);
  };

  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages || totalPages === 0;

  // Build root class list
  const containerClasses = [
    cn(prefix, 'pagination'),
    `${prefix}-pagination--${size}`,
    `${prefix}-pagination--${shape}`,
    `${prefix}-pagination--${color}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <nav className={containerClasses} aria-label={ariaLabel}>
      {/* First Page Button */}
      {showFirstLast && (
        <button
          type="button"
          className={`${prefix}-pagination-item`}
          onClick={() => handlePageSelect(1)}
          disabled={disabled || isFirst}
          aria-label="Go to first page"
          title="First Page"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="11 17 6 12 11 7" />
            <polyline points="18 17 13 12 18 7" />
          </svg>
        </button>
      )}

      {/* Previous Page Button */}
      {showPrevNext && (
        <button
          type="button"
          className={`${prefix}-pagination-item`}
          onClick={() => handlePageSelect(currentPage - 1)}
          disabled={disabled || isFirst}
          aria-label="Go to previous page"
          title="Previous Page"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      {/* Page Items list */}
      {paginationRange.map((pageNumber, idx) => {
        if (pageNumber === DOTS) {
          return (
            <span key={`dots-${idx}`} className={`${prefix}-pagination-ellipsis`} aria-hidden="true">
              &#8230;
            </span>
          );
        }

        const isCurrent = pageNumber === currentPage;

        return (
          <button
            key={`page-${pageNumber}`}
            type="button"
            className={`${prefix}-pagination-item ${isCurrent ? `${prefix}-pagination-item--active` : ''}`}
            onClick={() => handlePageSelect(pageNumber as number)}
            disabled={disabled}
            aria-label={`Go to page ${pageNumber}`}
            aria-current={isCurrent ? 'page' : undefined}
          >
            {pageNumber}
          </button>
        );
      })}

      {/* Manual Page Input field */}
      {showPageInput && (
        <div className={`${prefix}-pagination-input-container`}>
          <input
            type="number"
            className={`${prefix}-pagination-input`}
            min={1}
            max={totalPages}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="#"
            disabled={disabled || totalPages <= 1}
            aria-label="Input page number manually"
          />
        </div>
      )}

      {/* Next Page or Confirm Button */}
      {showPrevNext && (
        isInputActive ? (
          <button
            type="button"
            className={`${prefix}-pagination-item ${prefix}-pagination-item--confirm`}
            onClick={handlePageInputSubmit}
            disabled={disabled || !isValidPage}
            aria-label="Confirm page selection"
            title="Confirm Page"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
        ) : (
          <button
            type="button"
            className={`${prefix}-pagination-item`}
            onClick={() => handlePageSelect(currentPage + 1)}
            disabled={disabled || isLast}
            aria-label="Go to next page"
            title="Next Page"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )
      )}

      {/* Last Page Button */}
      {showFirstLast && (
        <button
          type="button"
          className={`${prefix}-pagination-item`}
          onClick={() => handlePageSelect(totalPages)}
          disabled={disabled || isLast}
          aria-label="Go to last page"
          title="Last Page"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="13 17 18 12 13 7" />
            <polyline points="6 17 11 12 6 7" />
          </svg>
        </button>
      )}
    </nav>
  );
};

/* ==========================================================================
   2. PageSizeSelector Component
   ========================================================================== */

export interface PageSizeSelectorProps {
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
  size?: FormControlSize;
  shape?: FormControlShape;
  color?: FormControlColor;
  disabled?: boolean;
  label?: React.ReactNode;
  className?: string;
  id?: string;
}

export const PageSizeSelector: React.FC<PageSizeSelectorProps> = ({
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50, 100],
  size = 'md',
  shape = 'rounded',
  color = 'mauve',
  disabled = false,
  label = 'Itens por página:',
  className = '',
  id,
}) => {
  const prefix = usePrefix();
  const uniqueId = useMemo(() => id || `${prefix}-page-size-${Math.random().toString(36).substr(2, 9)}`, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onPageSizeChange(Number(e.target.value));
  };

  const containerClasses = [
    cn(prefix, 'page-size-selector'),
    `${prefix}-page-size-selector--${size}`,
    `${prefix}-page-size-selector--${shape}`,
    `${prefix}-page-size-selector--${color}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={uniqueId} className={cnEl(prefix, 'page-size-selector', 'label')}>
          {label}
        </label>
      )}
      <select
        id={uniqueId}
        className={cnEl(prefix, 'page-size-selector', 'select')}
        value={pageSize}
        onChange={handleChange}
        disabled={disabled}
      >
        {pageSizeOptions.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};
