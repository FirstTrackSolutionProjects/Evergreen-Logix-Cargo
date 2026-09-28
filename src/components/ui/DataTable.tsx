import type { ReactNode } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Skeleton } from './Skeleton';
import styles from './DataTable.module.css';

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  sortableKey?: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
  isLoading?: boolean;
  emptyState?: ReactNode;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (sortBy: string, direction: 'asc' | 'desc') => void;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  isLoading = false,
  emptyState,
  sortBy,
  sortDirection,
  onSort,
}: DataTableProps<T>) {
  const handleSort = (column: Column<T>) => {
    if (!column.sortableKey || !onSort) return;
    if (sortBy !== column.sortableKey) {
      onSort(column.sortableKey, 'asc');
    } else {
      onSort(column.sortableKey, sortDirection === 'asc' ? 'desc' : 'asc');
    }
  };

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => {
              const isSorted = sortBy === col.sortableKey;
              const sortable = Boolean(col.sortableKey && onSort);

              return (
                <th
                  key={col.key}
                  className={cn(
                    styles.th,
                    col.align === 'right' && styles.alignRight,
                    col.align === 'center' && styles.alignCenter,
                    sortable && styles.sortable,
                    isSorted && styles.sorted,
                  )}
                  style={col.width ? { width: col.width } : undefined}
                  onClick={() => handleSort(col)}
                >
                  <span className={styles.thContent}>
                    {col.header}
                    {sortable && (
                      <span className={styles.sortIcon}>
                        {isSorted && sortDirection === 'asc' ? (
                          <ArrowUp size={13} />
                        ) : isSorted && sortDirection === 'desc' ? (
                          <ArrowDown size={13} />
                        ) : (
                          <ArrowDown size={13} className={styles.sortIconIdle} />
                        )}
                      </span>
                    )}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, rowIndex) => (
              <tr key={`skeleton-${rowIndex}`}>
                {columns.map((col) => (
                  <td key={`${col.key}-${rowIndex}`} className={styles.td}>
                    <Skeleton height={16} />
                  </td>
                ))}
              </tr>
            ))
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className={styles.emptyCell}>
                {emptyState}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={rowKey(row)} className={styles.row}>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      styles.td,
                      col.align === 'right' && styles.alignRight,
                      col.align === 'center' && styles.alignCenter,
                    )}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}