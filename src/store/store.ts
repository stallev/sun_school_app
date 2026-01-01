/**
 * Main Zustand Store
 * Combines all slices and configures middleware (persist, devtools)
 * SSR-safe implementation using zustand/vanilla
 */

import { createStore } from 'zustand/vanilla';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { createAdminSlice, type AdminSlice } from './createAdminSlice';

/**
 * Combined application state
 */
export type AppState = AdminSlice;

/**
 * Create app store with middleware
 * @param initState - Optional initial state for hydration
 */
export const createAppStore = (initState: Partial<AppState> = {}) => {
  return createStore<AppState>()(
    devtools(
      persist(
        (...a) => ({
          ...createAdminSlice(...a),
          ...initState,
        }),
        {
          name: 'app-store',
          storage: createJSONStorage(() => {
            // SSR-safe storage
            if (typeof window !== 'undefined') {
              return window.localStorage;
            }
            return {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            };
          }),
          partialize: (state) => ({
            // Only persist teachers and lastFetched
            teachers: state.teachers,
            lastFetched: state.lastFetched,
          }),
          // Check if data is stale on rehydration
          onRehydrateStorage: () => (state) => {
            if (state) {
              const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
              const isStale =
                !state.lastFetched ||
                Date.now() - state.lastFetched > TWENTY_FOUR_HOURS;

              if (isStale) {
                // Clear stale data
                state.teachers = [];
                state.lastFetched = null;
              }
            }
          },
        }
      ),
      { name: 'AppStore', enabled: process.env.NODE_ENV === 'development' }
    )
  );
};


