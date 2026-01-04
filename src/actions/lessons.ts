/**
 * Server Actions for Lessons management
 * Handles lesson CRUD operations and data retrieval
 * 
 * Authorization: TEACHER, ADMIN, SUPERADMIN
 */

'use server';

import { getAuthenticatedUser, checkRole } from '../lib/auth/cognito';
import {
  getLessonWithNestedData,
  getAcademicYear,
  getLesson,
  listLessons,
  listHomeworkChecks,
} from '../lib/db/queries';
import {
  createLesson,
  updateLesson,
  deleteLesson,
  deleteHomeworkCheck,
} from '../lib/db/mutations';
import {
  createLessonSchema,
  updateLessonSchema,
  lessonIdSchema,
} from '../lib/validation/lessons';
import { getActiveYear } from '../lib/utils/academicYears';
import {
  checkGradeAccessForLesson,
  checkLessonAccess,
  getUserRole,
} from '../lib/utils/lessons';
import { getGradeSettingsByGrade } from '../lib/db/queries';
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

    // 4. Check access to lesson using utility function
    const userRole = getUserRole(user);
    if (!userRole) {
      return {
        success: false,
        error: 'Forbidden: Invalid user role',
      };
    }

    const hasAccess = await checkLessonAccess(user.id, lessonId, userRole);
    if (!hasAccess) {
      return {
        success: false,
        error: 'Forbidden: You do not have access to this lesson',
      };
    }

    // 5. Get lesson with nested data using single GraphQL query
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

    // 4. Check access to grade using utility function
    const userRole = getUserRole(user);
    if (!userRole) {
      return {
        success: false,
        error: 'Forbidden: Invalid user role',
      };
    }

    const hasAccess = await checkGradeAccessForLesson(
      user.id,
      validatedData.gradeId,
      userRole
    );
    if (!hasAccess) {
      return {
        success: false,
        error: 'Forbidden: You do not have access to this grade',
      };
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
    revalidateTag('lessons');
    revalidatePath(`/grades/${validatedData.gradeId}`);
    revalidatePath(`/grades/${validatedData.gradeId}/lessons`);
    revalidatePath(`/grades/${validatedData.gradeId}/academic-years/${validatedData.academicYearId}/lessons`);

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

/**
 * Update an existing lesson
 * Authorization: TEACHER (own grade), ADMIN, SUPERADMIN
 *
 * @param input - Lesson update data
 * @returns ActionResponse with updated lesson
 */
export async function updateLessonAction(
  input: unknown
): Promise<ActionResponse<SerializableLesson>> {
  try {
    // 1. Validate input
    const validationResult = updateLessonSchema.safeParse(input);
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
        error: 'Unauthorized: You must be logged in to update a lesson',
      };
    }

    // 3. Check authorization
    const isAdmin = checkRole(user, ['ADMIN', 'SUPERADMIN']);
    const isTeacher = checkRole(user, ['TEACHER']);

    if (!isAdmin && !isTeacher) {
      return {
        success: false,
        error: 'Forbidden: You do not have permission to update lessons',
      };
    }

    // 4. Get existing lesson to check access
    const existingLesson = await getLesson(validatedData.id);
    if (!existingLesson) {
      return {
        success: false,
        error: 'Lesson not found',
      };
    }

    // 5. Check access to existing lesson's grade using utility function
    const userRole = getUserRole(user);
    if (!userRole) {
      return {
        success: false,
        error: 'Forbidden: Invalid user role',
      };
    }

    const hasAccess = await checkGradeAccessForLesson(
      user.id,
      existingLesson.gradeId,
      userRole
    );
    if (!hasAccess) {
      return {
        success: false,
        error: 'Forbidden: You do not have access to this lesson',
      };
    }

    // 6. If gradeId is being changed, check access to new grade
    if (validatedData.gradeId && validatedData.gradeId !== existingLesson.gradeId) {
      const hasAccessToNewGrade = await checkGradeAccessForLesson(
        user.id,
        validatedData.gradeId,
        userRole
      );
      if (!hasAccessToNewGrade) {
        return {
          success: false,
          error: 'Forbidden: You do not have access to the new grade',
        };
      }
    }

    // 7. If academicYearId is being changed, verify it's active
    if (
      validatedData.academicYearId &&
      validatedData.academicYearId !== existingLesson.academicYearId
    ) {
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
          error: `Урок можно обновить только для активного учебного года. Текущий статус года: ${academicYear.status}`,
        };
      }
    }

    // 8. Prepare update input (only include fields that are provided)
    const updateInput: APITypes.UpdateLessonInput = {
      id: validatedData.id,
    };

    if (validatedData.academicYearId !== undefined) {
      updateInput.academicYearId = validatedData.academicYearId;
    }
    if (validatedData.gradeId !== undefined) {
      updateInput.gradeId = validatedData.gradeId;
    }
    if (validatedData.teacherId !== undefined) {
      updateInput.teacherId = validatedData.teacherId;
    }
    if (validatedData.title !== undefined) {
      updateInput.title = validatedData.title;
    }
    if (validatedData.content !== undefined) {
      updateInput.content = validatedData.content ?? null;
    }
    if (validatedData.lessonDate !== undefined) {
      updateInput.lessonDate = validatedData.lessonDate;
    }
    if (validatedData.order !== undefined) {
      updateInput.order = validatedData.order;
    }

    // 9. Update lesson
    const lesson = await updateLesson(updateInput);

    // 10. Serialize for Server Component
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

    // 11. Revalidate cache
    revalidateTag(`academic-year-${lesson.academicYearId}`);
    revalidateTag(`grade-${lesson.gradeId}`);
    revalidateTag(`lesson-${lesson.id}`);
    revalidateTag('lessons');
    revalidatePath(`/grades/${lesson.gradeId}`);
    revalidatePath(`/grades/${lesson.gradeId}/lessons`);
    revalidatePath(`/grades/${lesson.gradeId}/academic-years/${lesson.academicYearId}/lessons`);
    revalidatePath(`/lessons/${lesson.id}`);

    return {
      success: true,
      data: serializedLesson,
      message: 'Lesson updated successfully',
    };
  } catch (error) {
    console.error('Error updating lesson:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to update lesson: Unknown error',
    };
  }
}

/**
 * Get a single lesson by ID
 * Authorization: TEACHER (own grade), ADMIN, SUPERADMIN
 *
 * @param input - Lesson ID (string or object with id field)
 * @returns ActionResponse with lesson data
 */
export async function getLessonAction(
  input: unknown
): Promise<ActionResponse<SerializableLesson>> {
  try {
    // 1. Validate input
    let lessonId: string;
    if (typeof input === 'string') {
      lessonId = input;
    } else if (typeof input === 'object' && input !== null && 'id' in input) {
      lessonId = String(input.id);
    } else {
      const validationResult = lessonIdSchema.safeParse(input);
      if (!validationResult.success) {
        return {
          success: false,
          error: `Validation failed: ${validationResult.error.issues.map((e) => e.message).join(', ')}`,
        };
      }
      lessonId = validationResult.data.id;
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
    const isAdmin = checkRole(user, ['ADMIN', 'SUPERADMIN']);
    const isTeacher = checkRole(user, ['TEACHER']);

    if (!isAdmin && !isTeacher) {
      return {
        success: false,
        error: 'Forbidden: You do not have permission to view lessons',
      };
    }

    // 4. Check access to lesson using utility function
    const userRole = getUserRole(user);
    if (!userRole) {
      return {
        success: false,
        error: 'Forbidden: Invalid user role',
      };
    }

    const hasAccess = await checkLessonAccess(user.id, lessonId, userRole);
    if (!hasAccess) {
      return {
        success: false,
        error: 'Forbidden: You do not have access to this lesson',
      };
    }

    // 5. Get lesson
    const lesson = await getLesson(lessonId);
    if (!lesson) {
      return {
        success: false,
        error: 'Lesson not found',
      };
    }

    // 6. Serialize for Server Component
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

    return {
      success: true,
      data: serializedLesson,
    };
  } catch (error) {
    console.error('Error getting lesson:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to get lesson: Unknown error',
    };
  }
}

/**
 * List lessons with optional filtering
 * Authorization: TEACHER (own grades), ADMIN, SUPERADMIN
 *
 * @param input - Filter parameters (gradeId, academicYearId)
 * @returns ActionResponse with list of lessons
 */
export async function listLessonsAction(
  input: unknown
): Promise<ActionResponse<SerializableLesson[]>> {
  try {
    // 1. Validate input
    let gradeId: string | undefined;
    let academicYearId: string | undefined;

    if (typeof input === 'object' && input !== null) {
      if ('gradeId' in input && typeof input.gradeId === 'string') {
        gradeId = input.gradeId;
      }
      if (
        'academicYearId' in input &&
        typeof input.academicYearId === 'string'
      ) {
        academicYearId = input.academicYearId;
      }
    }

    // 2. Check authentication
    const user = await getAuthenticatedUser();
    if (!user) {
      return {
        success: false,
        error: 'Unauthorized: You must be logged in to view lessons',
      };
    }

    // 3. Check authorization
    const isAdmin = checkRole(user, ['ADMIN', 'SUPERADMIN']);
    const isTeacher = checkRole(user, ['TEACHER']);

    if (!isAdmin && !isTeacher) {
      return {
        success: false,
        error: 'Forbidden: You do not have permission to view lessons',
      };
    }

    // 4. For Teacher, check if they have access to the grade (if specified)
    if (gradeId) {
      const userRole = getUserRole(user);
      if (!userRole) {
        return {
          success: false,
          error: 'Forbidden: Invalid user role',
        };
      }

      const hasAccess = await checkGradeAccessForLesson(
        user.id,
        gradeId,
        userRole
      );
      if (!hasAccess) {
        return {
          success: false,
          error: 'Forbidden: You do not have access to this grade',
        };
      }
    }

    // 5. Build filter
    const filter: APITypes.ModelLessonFilterInput = {};
    if (gradeId) {
      filter.gradeId = { eq: gradeId };
    }
    if (academicYearId) {
      filter.academicYearId = { eq: academicYearId };
    }

    // 6. Get lessons
    const result = await listLessons(filter);

    if (!result || !result.items) {
      return {
        success: true,
        data: [],
      };
    }

    // 7. For Teacher, filter lessons to only their grades
    let lessons = result.items as APITypes.Lesson[];
    if (isTeacher && !isAdmin && !gradeId) {
      // Get all grades the teacher has access to
      const queries = await import('../graphql/queries');
      const userGradesQuery = (queries as Record<string, string>)
        .userGradesByUserIdAndGradeId;

      if (userGradesQuery) {
        const userGradesResult = await executeGraphQL<{
          userGradesByUserIdAndGradeId?: {
            items?: Array<{ gradeId: string }>;
          };
        }>(userGradesQuery, {
          userId: user.id,
          limit: 100, // Reasonable limit for teacher's grades
        });

        const teacherGradeIds =
          userGradesResult.data?.userGradesByUserIdAndGradeId?.items
            ?.map((ug) => ug.gradeId)
            .filter(Boolean) || [];

        lessons = lessons.filter((lesson) =>
          teacherGradeIds.includes(lesson.gradeId)
        );
      } else {
        // If query not found, return empty array for safety
        return {
          success: true,
          data: [],
        };
      }
    }

    // 8. Serialize for Server Component
    const serializedLessons: SerializableLesson[] = lessons.map((lesson) => ({
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
    }));

    return {
      success: true,
      data: serializedLessons,
    };
  } catch (error) {
    console.error('Error listing lessons:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to list lessons: Unknown error',
    };
  }
}

/**
 * Delete a lesson with cascade deletion of homework checks
 * Authorization: TEACHER (own grade), ADMIN, SUPERADMIN
 *
 * @param input - Lesson ID (string or object with id field)
 * @returns ActionResponse with deletion confirmation
 */
export async function deleteLessonAction(
  input: unknown
): Promise<ActionResponse<{ lessonId: string; deletedAt: string }>> {
  try {
    // 1. Validate input
    let lessonId: string;
    if (typeof input === 'string') {
      lessonId = input;
    } else if (typeof input === 'object' && input !== null && 'id' in input) {
      lessonId = String(input.id);
    } else {
      const validationResult = lessonIdSchema.safeParse(input);
      if (!validationResult.success) {
        return {
          success: false,
          error: `Validation failed: ${validationResult.error.issues.map((e) => e.message).join(', ')}`,
        };
      }
      lessonId = validationResult.data.id;
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
        error: 'Unauthorized: You must be logged in to delete a lesson',
      };
    }

    // 3. Check authorization
    const isAdmin = checkRole(user, ['ADMIN', 'SUPERADMIN']);
    const isTeacher = checkRole(user, ['TEACHER']);

    if (!isAdmin && !isTeacher) {
      return {
        success: false,
        error: 'Forbidden: You do not have permission to delete lessons',
      };
    }

    // 4. Get existing lesson to check access and get related data
    const existingLesson = await getLesson(lessonId);
    if (!existingLesson) {
      return {
        success: false,
        error: 'Lesson not found',
      };
    }

    // 5. Check access to lesson using utility function
    const userRole = getUserRole(user);
    if (!userRole) {
      return {
        success: false,
        error: 'Forbidden: Invalid user role',
      };
    }

    const hasAccess = await checkGradeAccessForLesson(
      user.id,
      existingLesson.gradeId,
      userRole
    );
    if (!hasAccess) {
      return {
        success: false,
        error: 'Forbidden: You do not have access to this lesson',
      };
    }

    // 6. Get all homework checks for this lesson (cascade deletion)
    const homeworkChecksResult = await listHomeworkChecks({
      lessonId: { eq: lessonId },
    });

    const homeworkChecks = (
      homeworkChecksResult?.items?.filter(
        (item): item is APITypes.HomeworkCheck => item !== null
      ) || []
    ) as APITypes.HomeworkCheck[];

    // 7. Delete all homework checks
    const deletionErrors: string[] = [];
    for (const homeworkCheck of homeworkChecks) {
      try {
        await deleteHomeworkCheck(homeworkCheck.id);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Unknown error deleting homework check';
        deletionErrors.push(
          `Failed to delete homework check ${homeworkCheck.id}: ${errorMessage}`
        );
        console.error(
          `Error deleting homework check ${homeworkCheck.id}:`,
          error
        );
        // Continue with deletion of other checks
      }
    }

    // 8. If there were errors deleting homework checks, log but continue
    if (deletionErrors.length > 0) {
      console.warn(
        `Some homework checks could not be deleted: ${deletionErrors.join(', ')}`
      );
    }

    // 9. Delete the lesson
    const deletedLesson = await deleteLesson(lessonId);

    // 10. Revalidate cache
    revalidateTag(`academic-year-${existingLesson.academicYearId}`);
    revalidateTag(`grade-${existingLesson.gradeId}`);
    revalidateTag(`lesson-${lessonId}`);
    revalidateTag('lessons');
    revalidatePath(`/grades/${existingLesson.gradeId}`);
    revalidatePath(`/grades/${existingLesson.gradeId}/lessons`);
    revalidatePath(`/grades/${existingLesson.gradeId}/academic-years/${existingLesson.academicYearId}/lessons`);

    return {
      success: true,
      data: {
        lessonId: deletedLesson.id,
        deletedAt: new Date().toISOString(),
      },
      message: `Lesson deleted successfully. ${homeworkChecks.length} homework check(s) were also deleted.`,
    };
  } catch (error) {
    console.error('Error deleting lesson:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to delete lesson: Unknown error',
    };
  }
}

/**
 * Get lesson complete data for complete table page
 * Includes: lesson, homework checks (with pupils), golden verses, grade settings
 * 
 * Authorization: TEACHER (own grade), ADMIN, SUPERADMIN
 * 
 * @param input - Lesson ID (string or object with id field)
 * @returns ActionResponse with lesson complete data including grade settings
 */
export async function getLessonCompleteAction(
  input: unknown
): Promise<
  ActionResponse<{
    lesson: LessonNestedData;
    gradeSettings: APITypes.GradeSettings | null;
  }>
> {
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

    // 4. Check access to lesson using utility function
    const userRole = getUserRole(user);
    if (!userRole) {
      return {
        success: false,
        error: 'Forbidden: Invalid user role',
      };
    }

    const hasAccess = await checkLessonAccess(user.id, lessonId, userRole);
    if (!hasAccess) {
      return {
        success: false,
        error: 'Forbidden: You do not have access to this lesson',
      };
    }

    // 5. Get lesson with nested data using single GraphQL query
    const lessonData = await getLessonWithNestedData(lessonId);

    if (!lessonData) {
      return {
        success: false,
        error: 'Lesson not found',
      };
    }

    // 6. Get grade settings for column visibility
    const gradeSettings = await getGradeSettingsByGrade(lessonData.gradeId);

    // 7. Return lesson data with grade settings
    return {
      success: true,
      data: {
        lesson: lessonData,
        gradeSettings,
      },
    };
  } catch (error) {
    console.error('Error getting lesson complete:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to get lesson complete: Unknown error',
    };
  }
}

