/**
 * Server Actions for Homework Check management
 * Handles homework check CRUD operations
 * 
 * Authorization: TEACHER, ADMIN, SUPERADMIN
 */

'use server';

import { getAuthenticatedUser, checkRole } from '../lib/auth/cognito';
import { updateHomeworkCheck } from '../lib/db/mutations';
import { getHomeworkCheck, getLesson } from '../lib/db/queries';
import { getGradeSettingsByGrade } from '../lib/db/queries';
import { updateHomeworkCheckSchema } from '../lib/validation/homework';
import { checkLessonAccess, getUserRole } from '../lib/utils/lessons';
import { calculateHomeworkPoints } from '../lib/utils/homework';
import { revalidatePath, revalidateTag } from 'next/cache';
import type * as APITypes from '../API';

/**
 * Response type for Server Actions
 */
type ActionResponse<T> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string };

/**
 * Update homework check with automatic points calculation
 * 
 * Authorization: TEACHER (own grade), ADMIN, SUPERADMIN
 * 
 * @param input - UpdateHomeworkCheckInput with homework check data
 * @returns ActionResponse with updated homework check
 */
export async function updateHomeworkCheckAction(
  input: unknown
): Promise<ActionResponse<APITypes.HomeworkCheck>> {
  try {
    // 1. Validate input
    const validationResult = updateHomeworkCheckSchema.safeParse(input);
    if (!validationResult.success) {
      return {
        success: false,
        error: `Validation error: ${validationResult.error.issues.map((e) => e.message).join(', ')}`,
      };
    }

    const validatedData = validationResult.data;

    // 2. Check authentication
    const user = await getAuthenticatedUser();
    if (!user) {
      return {
        success: false,
        error: 'Unauthorized: You must be logged in to update homework check',
      };
    }

    // 3. Check authorization
    if (!checkRole(user, ['TEACHER', 'ADMIN', 'SUPERADMIN'])) {
      return {
        success: false,
        error: 'Forbidden: You do not have permission to update homework checks',
      };
    }

    // 4. Get existing homework check to verify it exists and get lessonId
    const existingCheck = await getHomeworkCheck(validatedData.id);
    if (!existingCheck) {
      return {
        success: false,
        error: 'Homework check not found',
      };
    }

    // 5. Get lesson to check access
    const lesson = await getLesson(existingCheck.lessonId);
    if (!lesson) {
      return {
        success: false,
        error: 'Lesson not found',
      };
    }

    // 6. Check access to lesson using utility function
    const userRole = getUserRole(user);
    if (!userRole) {
      return {
        success: false,
        error: 'Forbidden: Invalid user role',
      };
    }

    const hasAccess = await checkLessonAccess(user.id, lesson.id, userRole);
    if (!hasAccess) {
      return {
        success: false,
        error: 'Forbidden: You do not have access to this lesson',
      };
    }

    // 7. Get grade settings for points calculation
    const gradeSettings = await getGradeSettingsByGrade(lesson.gradeId);
    if (!gradeSettings) {
      return {
        success: false,
        error: 'Grade settings not found',
      };
    }

    // 8. Prepare update data
    const updateData: APITypes.UpdateHomeworkCheckInput = {
      id: validatedData.id,
    };

    // Add optional fields if provided
    if (validatedData.lessonId !== undefined) {
      updateData.lessonId = validatedData.lessonId;
    }
    if (validatedData.pupilId !== undefined) {
      updateData.pupilId = validatedData.pupilId;
    }
    if (validatedData.gradeId !== undefined) {
      updateData.gradeId = validatedData.gradeId;
    }
    if (validatedData.singing !== undefined) {
      updateData.singing = validatedData.singing;
    }
    if (validatedData.goldenVerse1Score !== undefined) {
      updateData.goldenVerse1Score = validatedData.goldenVerse1Score;
    }
    if (validatedData.goldenVerse2Score !== undefined) {
      updateData.goldenVerse2Score = validatedData.goldenVerse2Score;
    }
    if (validatedData.goldenVerse3Score !== undefined) {
      updateData.goldenVerse3Score = validatedData.goldenVerse3Score;
    }
    if (validatedData.testScore !== undefined) {
      updateData.testScore = validatedData.testScore;
    }
    if (validatedData.notebookScore !== undefined) {
      updateData.notebookScore = validatedData.notebookScore;
    }

    // 9. Calculate points automatically
    // Merge existing data with new data for calculation
    const mergedData = {
      goldenVerse1Score: validatedData.goldenVerse1Score ?? existingCheck.goldenVerse1Score ?? null,
      goldenVerse2Score: validatedData.goldenVerse2Score ?? existingCheck.goldenVerse2Score ?? null,
      goldenVerse3Score: validatedData.goldenVerse3Score ?? existingCheck.goldenVerse3Score ?? null,
      testScore: validatedData.testScore ?? existingCheck.testScore ?? null,
      notebookScore: validatedData.notebookScore ?? existingCheck.notebookScore ?? null,
      singing: validatedData.singing ?? existingCheck.singing ?? false,
    };

    const calculatedPoints = calculateHomeworkPoints(mergedData, gradeSettings);
    updateData.points = calculatedPoints;

    // 10. Update homework check
    const updatedCheck = await updateHomeworkCheck(updateData);

    // 11. Revalidate cache
    revalidateTag(`lesson-${lesson.id}`);
    revalidateTag(`homework-check-${validatedData.id}`);
    revalidatePath(`/lessons/${lesson.id}`);
    revalidatePath(`/lessons/${lesson.id}/complete-table`);
    revalidatePath(`/lessons/${lesson.id}/checking-homework`);

    return {
      success: true,
      data: updatedCheck,
      message: 'Homework check updated successfully',
    };
  } catch (error) {
    console.error('Error updating homework check:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to update homework check: Unknown error',
    };
  }
}

