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
  /** Optional row selection support */
  selectable?: boolean;
  selectedRowKeys?: Array<string | number>;
  onSelectionChange?: (keys: Array<string | number>) => void;
  /** Disable selection for specific rows (e.g. already-assigned shipments) */
  isRowSelectable?: (row: T) => boolean;
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
  selectable = false,
  selectedRowKeys = [],
  onSelectionChange,
  isRowSelectable,
}: DataTableProps<T>) {
  const handleSort = (column: Column<T>) => {
    if (!column.sortableKey || !onSort) return;
    if (sortBy !== column.sortableKey) {
      onSort(column.sortableKey, 'asc');
    } else {
      onSort(column.sortableKey, sortDirection === 'asc' ? 'desc' : 'asc');
    }
  };

  const selectedSet = new Set(selectedRowKeys);

  const selectableRows = isRowSelectable ? rows.filter(isRowSelectable) : rows;
  const allPageSelected =
    selectable &&
    selectableRows.length > 0 &&
    selectableRows.every((r) => selectedSet.has(rowKey(r)));
  const somePageSelected =
    selectable && !allPageSelected && selectableRows.some((r) => selectedSet.has(rowKey(r)));

  const handleSelectAll = () => {
    if (!onSelectionChange) return;
    const pageKeys = selectableRows.map(rowKey);
    if (allPageSelected) {
      // Deselect only the current page's rows; preserve selections on other pages
      onSelectionChange(selectedRowKeys.filter((k) => !pageKeys.includes(k)));
    } else {
      // Union current selections with this page's rows (Set de-dupes)
      onSelectionChange(Array.from(new Set([...selectedRowKeys, ...pageKeys])));
    }
  };

  const handleSelectRow = (key: string | number) => {
    if (!onSelectionChange) return;
    if (selectedSet.has(key)) {
      onSelectionChange(selectedRowKeys.filter((k) => k !== key));
    } else {
      onSelectionChange([...selectedRowKeys, key]);
    }
  };

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {selectable && (
              <th className={cn(styles.th, styles.checkboxCell)}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={allPageSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = somePageSelected;
                  }}
                  onChange={handleSelectAll}
                  aria-label="Select all rows on this page"
                />
              </th>
            )}
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
                {selectable && (
                  <td className={cn(styles.td, styles.checkboxCell)}>
                    <Skeleton width={16} height={16} />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={`${col.key}-${rowIndex}`} className={styles.td}>
                    <Skeleton height={16} />
                  </td>
                ))}
              </tr>
            ))
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className={styles.emptyCell}>
                {emptyState}
              </td>
            </tr>
          ) : (
            rows.map((row) => {
              const key = rowKey(row);
              const isSelected = selectedSet.has(key);
              const rowSelectable = isRowSelectable ? isRowSelectable(row) : true;

              return (
                <tr key={key} className={cn(styles.row, isSelected && styles.rowSelected)}>
                  {selectable && (
                    <td className={cn(styles.td, styles.checkboxCell)}>
                      <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={isSelected}
                        disabled={!rowSelectable}
                        onChange={() => handleSelectRow(key)}
                        aria-label="Select row"
                      />
                    </td>
                  )}
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
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}