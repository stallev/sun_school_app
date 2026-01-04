/**
 * Lesson Access Control Utilities
 * Provides functions for checking access rights to lessons and grades
 * 
 * Authorization rules:
 * - TEACHER: Can only access lessons for their assigned grades
 * - ADMIN, SUPERADMIN: Can access all lessons
 */

import { getLesson } from '../db/queries';
import { checkRole } from '../auth/cognito';
import { getTeacherGradeIdsWithCache } from './teacher-grade-cache';

/**
 * User role type for access control
 */
export type UserRole = 'TEACHER' | 'ADMIN' | 'SUPERADMIN';

/**
 * Get user role from Cognito groups
 * @param user - User object with groups array
 * @returns User role or null if no valid role found
 */
export function getUserRole(user: { groups: string[] } | null): UserRole | null {
  if (!user) {
    return null;
  }

  // Check role precedence: SUPERADMIN > ADMIN > TEACHER
  if (checkRole(user, ['SUPERADMIN'])) {
    return 'SUPERADMIN';
  }
  if (checkRole(user, ['ADMIN'])) {
    return 'ADMIN';
  }
  if (checkRole(user, ['TEACHER'])) {
    return 'TEACHER';
  }

  return null;
}

/**
 * Check if Teacher has access to a specific grade
 * Uses cached grade IDs to avoid repeated AppSync queries
 * 
 * Performance:
 * - First call: GraphQL query + cache in cookie (~100-200ms)
 * - Subsequent calls: Read from cookie + in-memory check (~1ms)
 * 
 * @param userId - Teacher's user ID
 * @param gradeId - Grade ID to check
 * @returns true if Teacher has access, false otherwise
 */
async function checkTeacherGradeAccess(
  userId: string,
  gradeId: string
): Promise<boolean> {
  try {
    // Get all teacher's grade IDs (from cache or AppSync)
    // This function handles caching automatically:
    // 1. Checks cookie cache first
    // 2. If cache miss, fetches from AppSync and caches result
    const gradeIds = await getTeacherGradeIdsWithCache(userId);
    
    // Simple in-memory check - O(1) operation
    // Much faster than GraphQL query for each access check
    return gradeIds.includes(gradeId);
  } catch (error) {
    console.error('Error checking teacher grade access:', error);
    // Fail-safe: return false on error (deny access)
    return false;
  }
}

/**
 * Check if user has access to a grade for lesson operations
 * 
 * Authorization:
 * - ADMIN, SUPERADMIN: Always have access (returns true)
 * - TEACHER: Must be assigned to the grade (checks UserGrade relationship)
 * 
 * @param userId - User ID
 * @param gradeId - Grade ID to check
 * @param userRole - User role (TEACHER, ADMIN, SUPERADMIN)
 * @returns true if user has access, false otherwise
 * @throws Error if userRole is invalid or access check fails
 */
export async function checkGradeAccessForLesson(
  userId: string,
  gradeId: string,
  userRole: UserRole
): Promise<boolean> {
  // Admin and Superadmin have access to all grades
  if (userRole === 'ADMIN' || userRole === 'SUPERADMIN') {
    return true;
  }

  // Teacher must be assigned to the grade
  if (userRole === 'TEACHER') {
    return await checkTeacherGradeAccess(userId, gradeId);
  }

  // Invalid role
  throw new Error(`Invalid user role: ${userRole}`);
}

/**
 * Check if user has access to a specific lesson
 * 
 * Authorization:
 * - ADMIN, SUPERADMIN: Always have access (returns true)
 * - TEACHER: Must be assigned to the lesson's grade (checks UserGrade relationship)
 * 
 * @param userId - User ID
 * @param lessonId - Lesson ID to check
 * @param userRole - User role (TEACHER, ADMIN, SUPERADMIN)
 * @returns true if user has access, false otherwise
 * @throws Error if lesson not found, userRole is invalid, or access check fails
 */
export async function checkLessonAccess(
  userId: string,
  lessonId: string,
  userRole: UserRole
): Promise<boolean> {
  // Get lesson to check its gradeId
  const lesson = await getLesson(lessonId);
  if (!lesson) {
    throw new Error(`Lesson not found: ${lessonId}`);
  }

  // Check access to the lesson's grade
  return await checkGradeAccessForLesson(userId, lesson.gradeId, userRole);
}

