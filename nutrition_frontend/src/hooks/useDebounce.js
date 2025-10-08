import { useEffect, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * useDebounce
 * Returns the debounced version of a changing value by a given delay.
 */
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
}
