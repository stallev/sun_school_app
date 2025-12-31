/**
 * Admin Slice for Zustand Store
 * Manages teachers data for admin users
 * Data persists in localStorage with 24-hour expiration
 */

import { StateCreator } from 'zustand';
import { listTeachersForSelectionAction } from '@/actions/grades';

export interface Teacher {
  id: string;
  name: string;
  email: string;
}

export interface AdminSlice {
  // State
  teachers: Teacher[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  // Actions
  fetchTeachers: () => Promise<void>;
  resetTeachers: () => void;
  isTeachersDataStale: () => boolean;
}

/**
 * Check if teachers data is stale (older than 24 hours)
 */
const isDataStale = (lastFetched: number | null): boolean => {
  if (!lastFetched) return true;
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000; // 86400000 ms
  return Date.now() - lastFetched > TWENTY_FOUR_HOURS;
};

export const createAdminSlice: StateCreator<AdminSlice> = (set, get) => ({
  // Initial state
  teachers: [],
  loading: false,
  error: null,
  lastFetched: null,

  // Check if data is stale
  isTeachersDataStale: () => {
    return isDataStale(get().lastFetched);
  },

  // Fetch teachers from server
  fetchTeachers: async () => {
    // Check if data is fresh
    if (!get().isTeachersDataStale() && get().teachers.length > 0) {
      return; // Data is fresh, no need to fetch
    }

    set({ loading: true, error: null });

    try {
      const result = await listTeachersForSelectionAction();

      if (result.success && result.data) {
        set({
          teachers: result.data,
          loading: false,
          lastFetched: Date.now(),
          error: null,
        });
      } else {
        const errorMessage =
          result.success === false ? result.error : 'Failed to fetch teachers';
        set({
          loading: false,
          error: errorMessage,
        });
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  },

  // Reset teachers data
  resetTeachers: () => {
    set({
      teachers: [],
      loading: false,
      error: null,
      lastFetched: null,
    });
  },
});

