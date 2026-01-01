/**
 * Load Teachers on Auth Component
 * Client Component that loads teachers into Zustand store after authentication
 * Only for ADMIN and SUPERADMIN users
 */

'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/providers/store-provider';
import { getCurrentUser } from '@/actions/auth';
import { useShallow } from 'zustand/react/shallow';

/**
 * Component that loads teachers into store after authentication
 * Should be placed in (private)/layout.tsx
 */
export const LoadTeachersOnAuth = () => {
  const fetchTeachers = useAppStore((state) => state?.fetchTeachers);
  const teachers = useAppStore(
    useShallow((state) => ({
      teachers: state?.teachers ?? [],
      loading: state?.loading ?? false,
      isStale: state?.isTeachersDataStale() ?? true,
    }))
  );

  useEffect(() => {
    const loadTeachersIfAdmin = async () => {
      // Guard clause: wait for hydration
      if (!fetchTeachers || !teachers) {
        return;
      }

      try {
        // Check if user is authenticated and is admin
        const userResult = await getCurrentUser();

        if (
          userResult.success &&
          userResult.data &&
          (userResult.data.role === 'ADMIN' || userResult.data.role === 'SUPERADMIN')
        ) {
          // Check if we need to fetch (data is stale or empty)
          if (teachers.isStale || teachers.teachers.length === 0) {
            await fetchTeachers();
          }
        }
      } catch (error) {
        console.error('Error loading teachers on auth:', error);
      }
    };

    loadTeachersIfAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchTeachers]);

  // This component doesn't render anything
  return null;
};

