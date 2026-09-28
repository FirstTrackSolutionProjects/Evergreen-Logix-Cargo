import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  currentCount: number;
  onPageChange: (page: number) => void;
}

function buildPageList(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [1];

  if (current > 4) pages.push('ellipsis');

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 3) pages.push('ellipsis');
  pages.push(total);

  return pages;
}

export function Pagination({
  currentPage,
  totalPages,
  totalCount,
  currentCount,
  onPageChange,
}: PaginationProps) {
  if (totalCount === 0) return null;

  const start = (currentPage - 1) * (currentCount || 1) + 1;
  const end = start + currentCount - 1;
  const pages = buildPageList(currentPage, totalPages);

  return (
    <div className={styles.wrapper}>
      <span className={styles.hint}>
        Showing <strong>{start}</strong>–<strong>{end}</strong> of <strong>{totalCount}</strong> results
      </span>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.navButton}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {pages.map((page, index) =>
          page === 'ellipsis' ? (
            <span key={`ellipsis-${index}`} className={styles.ellipsis}>
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              className={`${styles.pageButton} ${page === currentPage ? styles.active : ''}`}
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          ),
        )}

        <button
          type="button"
          className={styles.navButton}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}