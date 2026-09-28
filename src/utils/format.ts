export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return '—';
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return '—';
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatCurrency(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return '₹0.00';
  const num = typeof value === 'string' ? Number(value) : value;
  if (Number.isNaN(num)) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

export function formatFullName(
  first: string | null | undefined,
  middle: string | null | undefined,
  last: string | null | undefined,
): string {
  return [first, middle, last].filter(Boolean).join(' ').trim() || '—';
}

export function formatWeight(value: number | string, unit: string): string {
  const num = typeof value === 'string' ? Number(value) : value;
  return `${Number.isFinite(num) ? num : 0} ${unit}`;
}