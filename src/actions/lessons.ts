/**
 * Server Actions for Lessons management
 * Handles lesson CRUD operations and data retrieval
 * 
 * Authorization: TEACHER, ADMIN, SUPERADMIN
 */

'use server';

import { getAuthenticatedUser, checkRole } from '../lib/auth/cognito';
import { getLessonWithNestedData } from '../lib/db/queries';
import type { LessonNestedData } from '../types/nested-queries';

/**
 * Response type for Server Actions
 */
type ActionResponse<T> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string };

/**
 * Get lesson with all related data using single nested GraphQL query
 * Includes: homeworkChecks (with pupil), goldenVerses (with goldenVerse and book), files
 * 
 * Authorization: TEACHER, ADMIN, SUPERADMIN
 * 
 * @param input - Lesson ID (string or object with id field)
 * @returns ActionResponse with lesson data including all nested relationships
 */
export async function getLessonWithRelationsAction(
  input: unknown
): Promise<ActionResponse<LessonNestedData>> {
  try {
    // 1. Validate input
    let lessonId: string;
    if (typeof input === 'string') {
      lessonId = input;
    } else if (typeof input === 'object' && input !== null && 'id' in input) {
      lessonId = String(input.id);
    } else {
      return {
        success: false,
        error: 'Invalid input: lessonId is required',
      };
    }

    if (!lessonId || lessonId.trim() === '') {
      return {
        success: false,
        error: 'Lesson ID is required',
      };
    }

    // 2. Check authentication
    const user = await getAuthenticatedUser();
    if (!user) {
      return {
        success: false,
        error: 'Unauthorized: You must be logged in to view a lesson',
      };
    }

    // 3. Check authorization
    if (!checkRole(user, ['TEACHER', 'ADMIN', 'SUPERADMIN'])) {
      return {
        success: false,
        error: 'Forbidden: You do not have permission to view lessons',
      };
    }

    // 4. Get lesson with nested data using single GraphQL query
    const lessonData = await getLessonWithNestedData(lessonId);

    if (!lessonData) {
      return {
        success: false,
        error: 'Lesson not found',
      };
    }

    // 5. Return lesson data with all nested relationships
    return {
      success: true,
      data: lessonData,
    };
  } catch (error) {
    console.error('Error getting lesson with relations:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to get lesson with relations: Unknown error',
    };
  }
}

