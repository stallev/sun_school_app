/**
 * Teacher Grade IDs Cache Utilities
 * Caches teacher's assigned grade IDs in httpOnly cookies to avoid repeated AppSync queries
 */

import { cookies } from 'next/headers';
import { executeGraphQL } from '../db/amplify';
import { userGradesByUserIdAndGradeId } from '../../graphql/queries';

const COOKIE_NAME = 'teacher-grade-ids';
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

/**
 * Cookie options for teacher grade IDs cache
 */
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  maxAge: COOKIE_MAX_AGE,
};

/**
 * Get cached teacher grade IDs from cookie
 * @param userId - Teacher's user ID
 * @returns Array of grade IDs or null if not cached
 */
export async function getCachedTeacherGradeIds(
  userId: string
): Promise<string[] | null> {
  try {
    const cookieStore = await cookies();
    const cached = cookieStore.get(COOKIE_NAME)?.value;

    if (!cached) {
      return null;
    }

    // Parse cached data: { userId: string, gradeIds: string[], cachedAt: number }
    const data = JSON.parse(cached);

    // Verify that cache belongs to current user
    if (data.userId !== userId) {
      // Cache is for different user, invalidate it
      await invalidateTeacherGradeCache();
      return null;
    }

    // Check if cache is expired (24 hours)
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
    if (data.cachedAt && Date.now() - data.cachedAt > TWENTY_FOUR_HOURS) {
      // Cache expired, invalidate it
      await invalidateTeacherGradeCache();
      return null;
    }

    return data.gradeIds || [];
  } catch (error) {
    console.error('Error reading cached teacher grade IDs:', error);
    // If parsing fails, invalidate cache
    await invalidateTeacherGradeCache();
    return null;
  }
}

/**
 * Set teacher grade IDs in cookie cache
 * @param userId - Teacher's user ID
 * @param gradeIds - Array of grade IDs to cache
 */
export async function setCachedTeacherGradeIds(
  userId: string,
  gradeIds: string[]
): Promise<void> {
  try {
    const cookieStore = await cookies();
    const data = {
      userId,
      gradeIds,
      cachedAt: Date.now(),
    };

    cookieStore.set(COOKIE_NAME, JSON.stringify(data), cookieOptions);
  } catch (error) {
    console.error('Error setting cached teacher grade IDs:', error);
    // Don't throw - caching is optional, app should work without it
  }
}

/**
 * Invalidate teacher grade IDs cache
 */
export async function invalidateTeacherGradeCache(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, '', {
      ...cookieOptions,
      maxAge: 0,
    });
  } catch (error) {
    console.error('Error invalidating teacher grade cache:', error);
  }
}

/**
 * Get teacher grade IDs with automatic caching
 * First checks cache, if not found - fetches from AppSync and caches result
 * @param userId - Teacher's user ID
 * @returns Array of grade IDs assigned to the teacher
 */
export async function getTeacherGradeIdsWithCache(
  userId: string
): Promise<string[]> {
  // 1. Check cache first
  const cached = await getCachedTeacherGradeIds(userId);
  if (cached !== null) {
    return cached;
  }

  // 2. Cache miss - fetch from AppSync
  try {
    const result = await executeGraphQL<{
      userGradesByUserIdAndGradeId?: {
        items?: Array<{ gradeId: string }>;
      };
    }>(userGradesByUserIdAndGradeId, {
      userId,
      limit: 100, // Reasonable limit for teacher's grades
    });

    const items = result.data?.userGradesByUserIdAndGradeId?.items || [];
    const gradeIds = items.map((item) => item.gradeId).filter(Boolean);

    // 3. Cache the result
    await setCachedTeacherGradeIds(userId, gradeIds);

    return gradeIds;
  } catch (error) {
    console.error('Error getting teacher grade IDs:', error);
    return [];
  }
}

