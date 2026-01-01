/**
 * Store Provider for Zustand
 * React Context Provider for SSR-safe store access
 */

'use client';

import { type ReactNode, createContext, useRef, useContext } from 'react';
import { type AppState, createAppStore } from '@/store/store';
import { useStore } from '@/hooks/useStore';

export type AppStoreApi = ReturnType<typeof createAppStore>;

export const AppStoreContext = createContext<AppStoreApi | undefined>(undefined);

/**
 * Store Provider component
 * Provides Zustand store via React Context for SSR compatibility
 */
export const AppStoreProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<AppStoreApi | undefined>(undefined);
  if (!storeRef.current) {
    storeRef.current = createAppStore({});
  }
  return (
    <AppStoreContext.Provider value={storeRef.current}>
      {children}
    </AppStoreContext.Provider>
  );
};

/**
 * Hook to access app store
 * @template T - Return type from selector
 * @param selector - Function to select data from store
 * @returns Selected data or undefined (during hydration)
 */
export const useAppStore = <T,>(selector: (store: AppState) => T): T | undefined => {
  const appStoreContext = useContext(AppStoreContext);
  if (!appStoreContext) {
    throw new Error('useAppStore must be used within AppStoreProvider');
  }
  return useStore(appStoreContext, selector);
};

