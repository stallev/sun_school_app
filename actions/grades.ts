/**
 * Server Actions for Grades management
 * CRUD operations for grades with role-based access control
 * 
 * Authorization:
 * - Admin/SUPERADMIN: Full access (create, update, delete, get, list all)
 * - Teacher: Read-only access to assigned grades only
 */

'use server';

import { getAuthenticatedUser, checkRole } from '../src/lib/auth/cognito';
import {
  createGradeSchema,
  updateGradeSchema,
  gradeIdSchema,
} from '../src/lib/validation/grades';
import { createGrade, updateGrade, deleteGrade } from '../src/lib/db/mutations';
import {
  getGrade,
  listGrades,
  getGradeWithRelations,
  getLessonsByAcademicYear,
  getHomeworkChecksByLesson,
  getLessonGoldenVersesByLesson,
  getGoldenVerse,
} from '../src/lib/db/queries';
import { executeGraphQL } from '../src/lib/db/amplify';
import {
  serializeGrade,
  getHomeworkCheckStats,
  sortAcademicYearsByStartDate,
} from '../src/lib/utils/grades';
import { revalidatePath } from 'next/cache';
import type * as APITypes from '../src/API';

/**
 * Response type for Server Actions
 */
type ActionResponse<T> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string };

/**
 * Serializable Grade type for Server Actions
 */
type SerializableGrade = {
  id: string;
  name: string;
  description?: string | null;
  minAge?: number | null;
  maxAge?: number | null;
  active: boolean;
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
    const queries = await import('../src/graphql/queries');
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
 * Get grades assigned to a Teacher
 * @param userId - Teacher's user ID
 * @returns Array of grade IDs assigned to the teacher
 */
async function getTeacherGradeIds(userId: string): Promise<string[]> {
  try {
    const queries = await import('../src/graphql/queries');
    const query = (queries as Record<string, string>).userGradesByUserIdAndGradeId;

    if (!query) {
      console.error('Query userGradesByUserIdAndGradeId not found');
      return [];
    }

    const result = await executeGraphQL<{
      userGradesByUserIdAndGradeId?: {
        items?: Array<{ gradeId: string }>;
      };
    }>(query, {
      userId,
      limit: 100, // Reasonable limit for teacher's grades
    });

    const items = result.data?.userGradesByUserIdAndGradeId?.items || [];
    return items.map((item) => item.gradeId).filter(Boolean);
  } catch (error) {
    console.error('Error getting teacher grade IDs:', error);
    return [];
  }
}

/**
 * Create a new grade
 * Authorization: ADMIN, SUPERADMIN only
 * 
 * @param input - Grade creation data
 * @returns ActionResponse with created grade
 */
export async function createGradeAction(
  input: unknown
): Promise<ActionResponse<APITypes.Grade>> {
  try {
    // 1. Validate input
    const validationResult = createGradeSchema.safeParse(input);
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
        error: 'Unauthorized: You must be logged in to create a grade',
      };
    }

    // 3. Check authorization (Admin only)
    if (!checkRole(user, ['ADMIN', 'SUPERADMIN'])) {
      return {
        success: false,
        error: 'Forbidden: Only administrators can create grades',
      };
    }

    // 4. Create grade
    const grade = await createGrade({
      name: validatedData.name,
      description: validatedData.description || null,
      minAge: validatedData.minAge ?? null,
      maxAge: validatedData.maxAge ?? null,
      active: validatedData.active,
    });

    // 5. Revalidate cache
    revalidatePath('/grades');
    revalidatePath('/(private)/grades');

    return {
      success: true,
      data: grade,
      message: 'Grade created successfully',
    };
  } catch (error) {
    console.error('Error creating grade:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to create grade: Unknown error',
    };
  }
}

/**
 * Update an existing grade
 * Authorization: ADMIN, SUPERADMIN only
 * 
 * @param input - Grade update data
 * @returns ActionResponse with updated grade
 */
export async function updateGradeAction(
  input: unknown
): Promise<ActionResponse<APITypes.Grade>> {
  try {
    // 1. Validate input
    const validationResult = updateGradeSchema.safeParse(input);
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
        error: 'Unauthorized: You must be logged in to update a grade',
      };
    }

    // 3. Check authorization (Admin only)
    if (!checkRole(user, ['ADMIN', 'SUPERADMIN'])) {
      return {
        success: false,
        error: 'Forbidden: Only administrators can update grades',
      };
    }

    // 4. Update grade
    const grade = await updateGrade({
      id: validatedData.id,
      name: validatedData.name,
      description: validatedData.description,
      minAge: validatedData.minAge,
      maxAge: validatedData.maxAge,
      active: validatedData.active,
    });

    // 5. Revalidate cache
    revalidatePath('/grades');
    revalidatePath(`/grades/${validatedData.id}`);
    revalidatePath('/(private)/grades');

    return {
      success: true,
      data: grade,
      message: 'Grade updated successfully',
    };
  } catch (error) {
    console.error('Error updating grade:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to update grade: Unknown error',
    };
  }
}

/**
 * Delete a grade
 * Authorization: ADMIN, SUPERADMIN only
 * 
 * @param input - Grade ID
 * @returns ActionResponse with deletion confirmation
 */
export async function deleteGradeAction(
  input: unknown
): Promise<ActionResponse<{ id: string }>> {
  try {
    // 1. Validate input
    const validationResult = gradeIdSchema.safeParse(input);
    if (!validationResult.success) {
      return {
        success: false,
        error: `Validation failed: ${validationResult.error.issues.map((e) => e.message).join(', ')}`,
      };
    }

    const { id } = validationResult.data;

    // 2. Check authentication
    const user = await getAuthenticatedUser();
    if (!user) {
      return {
        success: false,
        error: 'Unauthorized: You must be logged in to delete a grade',
      };
    }

    // 3. Check authorization (Admin only)
    if (!checkRole(user, ['ADMIN', 'SUPERADMIN'])) {
      return {
        success: false,
        error: 'Forbidden: Only administrators can delete grades',
      };
    }

    // 4. Delete grade
    await deleteGrade(id);

    // 5. Revalidate cache
    revalidatePath('/grades');
    revalidatePath(`/grades/${id}`);
    revalidatePath('/(private)/grades');

    return {
      success: true,
      data: { id },
      message: 'Grade deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting grade:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to delete grade: Unknown error',
    };
  }
}

/**
 * Get a single grade by ID
 * Authorization: 
 * - ADMIN, SUPERADMIN: Access to all grades
 * - Teacher: Access only to assigned grades
 * 
 * @param input - Grade ID
 * @returns ActionResponse with grade data
 */
export async function getGradeAction(
  input: unknown
): Promise<ActionResponse<SerializableGrade>> {
  try {
    // 1. Validate input
    const validationResult = gradeIdSchema.safeParse(input);
    if (!validationResult.success) {
      return {
        success: false,
        error: `Validation failed: ${validationResult.error.issues.map((e) => e.message).join(', ')}`,
      };
    }

    const { id } = validationResult.data;

    // 2. Check authentication
    const user = await getAuthenticatedUser();
    if (!user) {
      return {
        success: false,
        error: 'Unauthorized: You must be logged in to view a grade',
      };
    }

    // 3. Check authorization and access
    const isAdmin = checkRole(user, ['ADMIN', 'SUPERADMIN']);
    const isTeacher = checkRole(user, ['TEACHER']);

    if (!isAdmin && !isTeacher) {
      return {
        success: false,
        error: 'Forbidden: You do not have permission to view grades',
      };
    }

    // 4. For Teacher, check if they have access to this grade
    if (isTeacher && !isAdmin) {
      const hasAccess = await checkTeacherGradeAccess(user.id, id);
      if (!hasAccess) {
        return {
          success: false,
          error: 'Forbidden: You do not have access to this grade',
        };
      }
    }

    // 5. Get grade
    const grade = await getGrade(id);
    if (!grade) {
      return {
        success: false,
        error: 'Grade not found',
      };
    }

    // 6. Serialize grade for Server Component
    const serializedGrade = serializeGrade(grade);
    if (!serializedGrade) {
      return {
        success: false,
        error: 'Grade not found',
      };
    }

    return {
      success: true,
      data: serializedGrade,
    };
  } catch (error) {
    console.error('Error getting grade:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to get grade: Unknown error',
    };
  }
}

/**
 * List all grades
 * Authorization:
 * - ADMIN, SUPERADMIN: All grades
 * - Teacher: Only assigned grades
 * 
 * @returns ActionResponse with list of grades
 */
export async function listGradesAction(): Promise<
  ActionResponse<APITypes.Grade[]>
> {
  try {
    // 1. Check authentication
    const user = await getAuthenticatedUser();
    if (!user) {
      return {
        success: false,
        error: 'Unauthorized: You must be logged in to view grades',
      };
    }

    // 2. Check authorization
    const isAdmin = checkRole(user, ['ADMIN', 'SUPERADMIN']);
    const isTeacher = checkRole(user, ['TEACHER']);

    if (!isAdmin && !isTeacher) {
      return {
        success: false,
        error: 'Forbidden: You do not have permission to view grades',
      };
    }

    // 3. Get grades based on role
    if (isAdmin) {
      // Admin: Get all grades
      const result = await listGrades();
      const grades = (result?.items || []) as APITypes.Grade[];
      return {
        success: true,
        data: grades,
      };
    } else {
      // Teacher: Get only assigned grades
      const teacherGradeIds = await getTeacherGradeIds(user.id);
      if (teacherGradeIds.length === 0) {
        return {
          success: true,
          data: [],
        };
      }

      // Get grades by IDs
      const gradePromises = teacherGradeIds.map((gradeId) => getGrade(gradeId));
      const gradeResults = await Promise.allSettled(gradePromises);
      const grades = gradeResults
        .filter(
          (
            result
          ): result is PromiseFulfilledResult<APITypes.Grade> =>
            result.status === 'fulfilled' && result.value !== null
        )
        .map((result) => result.value);

      return {
        success: true,
        data: grades,
      };
    }
  } catch (error) {
    console.error('Error listing grades:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to list grades: Unknown error',
    };
  }
}

/**
 * Lesson with statistics and golden verses
 * Serializable for Server Components
 */
export type LessonWithStats = {
  lesson: {
    id: string;
    academicYearId: string;
    gradeId: string;
    teacherId: string;
    title: string;
    content?: string | null;
    lessonDate: string;
    order: number;
    createdAt: string;
    updatedAt: string;
  };
  homeworkStats: {
    total: number;
    checked: number;
    percentage: number;
  };
  goldenVerses: Array<{
    id: string;
    reference: string;
    order: number;
  }>;
};

/**
 * Academic year with lessons
 * Serializable for Server Components
 */
export type AcademicYearWithLessons = {
  academicYear: {
    id: string;
    gradeId: string;
    name: string;
    startDate: string;
    endDate: string;
    status: APITypes.AcademicYearStatus;
    createdAt: string;
    updatedAt: string;
  };
  lessons: LessonWithStats[];
};

/**
 * Grade with full data including academic years, lessons, and statistics
 * Serializable for Server Components
 */
export type GradeWithFullData = {
  grade: SerializableGrade;
  pupils: Array<{
    id: string;
    gradeId: string;
    firstName: string;
    lastName: string;
    middleName?: string | null;
    dateOfBirth: string;
    photo?: string | null;
    active: boolean;
    createdAt: string;
    updatedAt: string;
  }>;
  teachers: Array<{
    id: string;
    email: string;
    name: string;
    role: APITypes.UserRole;
    photo?: string | null;
    active: boolean;
    createdAt: string;
    updatedAt: string;
  }>;
  academicYears: AcademicYearWithLessons[];
  settings: APITypes.GradeSettings | null;
};

/**
 * Get grade with all related data including academic years, lessons, and statistics
 * Authorization:
 * - ADMIN, SUPERADMIN: Access to all grades
 * - Teacher: Access only to assigned grades
 *
 * @param input - Grade ID
 * @returns ActionResponse with full grade data
 */
export async function getGradeWithFullDataAction(
  input: unknown
): Promise<ActionResponse<GradeWithFullData>> {
  try {
    // 1. Validate input
    const validationResult = gradeIdSchema.safeParse(input);
    if (!validationResult.success) {
      return {
        success: false,
        error: `Validation failed: ${validationResult.error.issues.map((e) => e.message).join(', ')}`,
      };
    }

    const { id } = validationResult.data;

    // 2. Check authentication
    const user = await getAuthenticatedUser();
    if (!user) {
      return {
        success: false,
        error: 'Unauthorized: You must be logged in to view a grade',
      };
    }

    // 3. Check authorization and access
    const isAdmin = checkRole(user, ['ADMIN', 'SUPERADMIN']);
    const isTeacher = checkRole(user, ['TEACHER']);

    if (!isAdmin && !isTeacher) {
      return {
        success: false,
        error: 'Forbidden: You do not have permission to view grades',
      };
    }

    // 4. For Teacher, check if they have access to this grade
    if (isTeacher && !isAdmin) {
      const hasAccess = await checkTeacherGradeAccess(user.id, id);
      if (!hasAccess) {
        return {
          success: false,
          error: 'Forbidden: You do not have access to this grade',
        };
      }
    }

    // 5. Get grade with relations
    const gradeData = await getGradeWithRelations(id);

    if (!gradeData.grade) {
      return {
        success: false,
        error: 'Grade not found',
      };
    }

    // 6. Serialize grade
    const serializedGrade = serializeGrade(gradeData.grade);
    if (!serializedGrade) {
      return {
        success: false,
        error: 'Grade not found',
      };
    }

    // 7. Get lessons for each academic year and calculate statistics
    const academicYearsWithLessons: AcademicYearWithLessons[] = [];

    // Sort academic years by start date (newest first)
    const sortedAcademicYears = sortAcademicYearsByStartDate(gradeData.academicYears);

    // Get total pupils count for statistics
    const totalPupils = gradeData.pupils.length;

    // Process each academic year
    for (const academicYear of sortedAcademicYears) {
      // Get lessons for this academic year
      const lessonsResult = await getLessonsByAcademicYear(academicYear.id);
      const lessons = (lessonsResult?.items as APITypes.Lesson[]) || [];

      // Process each lesson to get statistics and golden verses
      const lessonsWithStats: LessonWithStats[] = await Promise.all(
        lessons.map(async (lesson) => {
          // Get homework checks for this lesson
          const homeworkChecksResult = await getHomeworkChecksByLesson(lesson.id);
          const homeworkChecks =
            (homeworkChecksResult?.items as APITypes.HomeworkCheck[]) || [];

          // Calculate statistics
          const homeworkStats = getHomeworkCheckStats(homeworkChecks, totalPupils);

          // Get golden verses for this lesson
          const goldenVersesResult = await getLessonGoldenVersesByLesson(lesson.id);
          const lessonGoldenVerses =
            (goldenVersesResult?.items as APITypes.LessonGoldenVerse[]) || [];

          // Get golden verse references by fetching GoldenVerse objects
          const goldenVersesPromises = lessonGoldenVerses.map(async (lgv) => {
            const goldenVerse = await getGoldenVerse(lgv.goldenVerseId);
            return {
              id: lgv.goldenVerseId,
              reference: goldenVerse?.reference || `Стих #${lgv.order || 0}`,
              order: lgv.order || 0,
            };
          });

          const goldenVerses = await Promise.all(goldenVersesPromises);
          goldenVerses.sort((a, b) => a.order - b.order);

          // Serialize lesson for Server Component
          const serializedLesson = {
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
            lesson: serializedLesson,
            homeworkStats,
            goldenVerses,
          };
        })
      );

      // Serialize academic year for Server Component
      const serializedAcademicYear = {
        id: academicYear.id,
        gradeId: academicYear.gradeId,
        name: academicYear.name,
        startDate: academicYear.startDate,
        endDate: academicYear.endDate,
        status: academicYear.status,
        createdAt: academicYear.createdAt,
        updatedAt: academicYear.updatedAt,
      };

      academicYearsWithLessons.push({
        academicYear: serializedAcademicYear,
        lessons: lessonsWithStats,
      });
    }

    // 8. Serialize pupils and teachers for Server Component
    const serializedPupils = gradeData.pupils.map((pupil) => ({
      id: pupil.id,
      gradeId: pupil.gradeId,
      firstName: pupil.firstName,
      lastName: pupil.lastName,
      middleName: pupil.middleName ?? null,
      dateOfBirth: pupil.dateOfBirth,
      photo: pupil.photo ?? null,
      active: pupil.active,
      createdAt: pupil.createdAt,
      updatedAt: pupil.updatedAt,
    }));

    const serializedTeachers = gradeData.teachers.map((teacher) => ({
      id: teacher.id,
      email: teacher.email,
      name: teacher.name,
      role: teacher.role,
      photo: teacher.photo ?? null,
      active: teacher.active,
      createdAt: teacher.createdAt,
      updatedAt: teacher.updatedAt,
    }));

    // 9. Return full data
    return {
      success: true,
      data: {
        grade: serializedGrade,
        pupils: serializedPupils,
        teachers: serializedTeachers,
        academicYears: academicYearsWithLessons,
        settings: gradeData.settings,
      },
    };
  } catch (error) {
    console.error('Error getting grade with full data:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to get grade with full data: Unknown error',
    };
  }
}

