/**
 * Server Actions for Lessons management
 * Handles lesson CRUD operations and data retrieval
 * 
 * Authorization: TEACHER, ADMIN, SUPERADMIN
 */

'use server';

import { getAuthenticatedUser, checkRole } from '../lib/auth/cognito';
import { getLessonWithNestedData, getAcademicYear } from '../lib/db/queries';
import { createLesson } from '../lib/db/mutations';
import { createLessonSchema } from '../lib/validation/lessons';
import { getActiveYear } from '../lib/utils/academicYears';
import { revalidatePath, revalidateTag } from 'next/cache';
import { executeGraphQL } from '../lib/db/amplify';
import type { LessonNestedData } from '../types/nested-queries';
import * as APITypes from '../API';

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

/**
 * Serializable Lesson type for Server Actions
 */
type SerializableLesson = {
  id: string;
  academicYearId: string;
  gradeId: string;
  teacherId: string;
  title: string;
  content: string | null;
  lessonDate: string;
  order: number;
  createdAt: string;
  updatedAt: string;
};

/**
 * Check if Teacher has access to a specific grade
 * @param userId - Teacher's user ID
 * @param gradeId - Grade ID to check
 * @returns true if Teacher has access, false otherwise
 */
async function checkTeacherGradeAccess(
  userId: string,
  gradeId: string
): Promise<boolean> {
  try {
    const queries = await import('../graphql/queries');
    const query = (queries as Record<string, string>).userGradesByGradeIdAndUserId;

    if (!query) {
      console.error('Query userGradesByGradeIdAndUserId not found');
      return false;
    }

    const result = await executeGraphQL<{
      userGradesByGradeIdAndUserId?: {
        items?: Array<{ userId: string; gradeId: string }>;
      };
    }>(query, {
      gradeId,
      userId: { eq: userId },
      limit: 1,
    });

    const items = result.data?.userGradesByGradeIdAndUserId?.items || [];
    return items.length > 0 && items.some((item) => item.userId === userId);
  } catch (error) {
    console.error('Error checking teacher grade access:', error);
    return false;
  }
}

/**
 * Create a new lesson
 * Authorization: TEACHER (own grade), ADMIN, SUPERADMIN
 * 
 * @param input - Lesson creation data
 * @returns ActionResponse with created lesson
 */
export async function createLessonAction(
  input: unknown
): Promise<ActionResponse<SerializableLesson>> {
  try {
    // 1. Validate input
    const validationResult = createLessonSchema.safeParse(input);
    if (!validationResult.success) {
      return {
        success: false,
        error: `Validation failed: ${validationResult.error.issues.map((e) => e.message).join(', ')}`,
      };
    }

    const validatedData = validationResult.data;

    // 2. Check authentication
    const user = await getAuthenticatedUser();
    if (!user) {
      return {
        success: false,
        error: 'Unauthorized: You must be logged in to create a lesson',
      };
    }

    // 3. Check authorization
    const isAdmin = checkRole(user, ['ADMIN', 'SUPERADMIN']);
    const isTeacher = checkRole(user, ['TEACHER']);

    if (!isAdmin && !isTeacher) {
      return {
        success: false,
        error: 'Forbidden: You do not have permission to create lessons',
      };
    }

    // 4. For Teacher, check if they have access to this grade
    if (isTeacher && !isAdmin) {
      const hasAccess = await checkTeacherGradeAccess(user.id, validatedData.gradeId);
      if (!hasAccess) {
        return {
          success: false,
          error: 'Forbidden: You do not have access to this grade',
        };
      }
    }

    // 5. Check that active academic year exists for the grade
    const activeYear = await getActiveYear(validatedData.gradeId);
    if (!activeYear) {
      return {
        success: false,
        error: 'Для создания урока необходимо наличие активного учебного года. Обратитесь к администратору.',
      };
    }

    // 6. Verify that the provided academicYearId matches the active year
    if (validatedData.academicYearId !== activeYear.id) {
      return {
        success: false,
        error: `Урок можно создать только для активного учебного года "${activeYear.name}". Выбранный год не является активным.`,
      };
    }

    // 7. Verify that the academic year is still ACTIVE (double-check)
    const academicYear = await getAcademicYear(validatedData.academicYearId);
    if (!academicYear) {
      return {
        success: false,
        error: 'Academic year not found',
      };
    }

    if (academicYear.status !== APITypes.AcademicYearStatus.ACTIVE) {
      return {
        success: false,
        error: `Урок можно создать только для активного учебного года. Текущий статус года: ${academicYear.status}`,
      };
    }

    // 8. Create lesson
    const lesson = await createLesson({
      academicYearId: validatedData.academicYearId,
      gradeId: validatedData.gradeId,
      teacherId: validatedData.teacherId,
      title: validatedData.title,
      content: validatedData.content ?? null,
      lessonDate: validatedData.lessonDate,
      order: validatedData.order,
    });

    // 9. Serialize for Server Component
    const serializedLesson: SerializableLesson = {
      id: lesson.id,
      academicYearId: lesson.academicYearId,
      gradeId: lesson.gradeId,
      teacherId: lesson.teacherId,
      title: lesson.title,
      content: lesson.content ?? null,
      lessonDate: lesson.lessonDate,
      order: lesson.order,
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt,
    };

    // 10. Revalidate cache
    revalidateTag(`academic-year-${validatedData.academicYearId}`);
    revalidateTag(`grade-${validatedData.gradeId}`);
    revalidatePath(`/grades/${validatedData.gradeId}`);
    revalidatePath(`/grades/${validatedData.gradeId}/lessons`);

    return {
      success: true,
      data: serializedLesson,
      message: 'Lesson created successfully',
    };
  } catch (error) {
    console.error('Error creating lesson:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to create lesson: Unknown error',
    };
  }
}

