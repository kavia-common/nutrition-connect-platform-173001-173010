import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * usePagination
 * Generic pagination state manager.
 * - total may be unknown; if provided, hasNext is computed from page/size/total.
 * - onPageChange is called when page changes.
 */
export function usePagination({ initialPage = 1, pageSize = 10, total = null, onPageChange = null } = {}) {
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(pageSize);
  const totalRef = useRef(total);

  useEffect(() => {
    totalRef.current = total;
  }, [total]);

  const hasPrev = useMemo(() => page > 1, [page]);
  const hasNext = useMemo(() => {
    if (typeof totalRef.current !== 'number') return true;
    return page * size < totalRef.current;
  }, [page, size]);

  const next = useCallback(() => setPage((p) => p + 1), []);
  const prev = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
  const setPageSafe = useCallback((p) => setPage(Math.max(1, p)), []);
  const setPageSize = useCallback((s) => setSize(Math.max(1, s)), []);

  useEffect(() => {
    onPageChange?.({ page, pageSize: size });
  }, [page, size, onPageChange]);

  return {
    page,
    pageSize: size,
    hasPrev,
    hasNext,
    next,
    prev,
    setPage: setPageSafe,
    setPageSize,
  };
}
