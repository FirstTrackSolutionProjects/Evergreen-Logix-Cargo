import { useState } from 'react';

export function usePagination(initialPage = 1, initialLimit = 10) {
  const [page, setPage] = useState<number>(initialPage);
  const [limit, setLimit] = useState<number>(initialLimit);

  const resetPage = () => setPage(1);

  return {
    page,
    limit,
    setPage,
    setLimit,
    resetPage,
  };
}