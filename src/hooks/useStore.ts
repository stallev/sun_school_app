/**
 * Hydration-safe hook for Zustand store
 * Prevents hydration mismatch between server and client
 */

import { useState, useEffect } from 'react';
import { useStore as useZustandStore } from 'zustand';

/**
 * Hydration-safe store hook
 * Returns undefined until hydration is complete
 * @template T - Store type
 * @template F - Return type from selector
 */
export const useStore = <T, F>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  store: any,
  callback: (state: T) => F
): F | undefined => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = useZustandStore(store, callback as any) as F;
  const [data, setData] = useState<F>();

  useEffect(() => {
    setData(result);
  }, [result]);

  return data;
};


