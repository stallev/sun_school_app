/**
 * Server Actions for Grades management
 * CRUD operations for grades with role-based access control
 * 
 * Authorization:
 * - Admin/SUPERADMIN: Full access (create, update, delete, get, list all)
 * - Teacher: Read-only access to assigned grades only
 */

'use server';

import { getAuthenticatedUser, checkRole } from '../lib/auth/cognito';
import {
  createGradeSchema,
  updateGradeSchema,
  gradeIdSchema,
} from '../lib/validation/grades';
import { createGrade, updateGrade, deleteGrade, updatePupil, createUserGrade, deleteUserGrade } from '../lib/db/mutations';
import {
  getGrade,
  listGrades,
  getGradeWithRelations,
  getLessonsByAcademicYear,
  getHomeworkChecksByLesson,
  getLessonGoldenVersesByLesson,
  getGoldenVerse,
  listPupils,
  getPupilsByGrade,
  listUsers,
} from '../lib/db/queries';
import { executeGraphQL } from '../lib/db/amplify';
import {
  serializeGrade,
  getHomeworkCheckStats,
  sortAcademicYearsByStartDate,
} from '../lib/utils/grades';
import { revalidatePath } from 'next/cache';
import * as APITypes from '../API';

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
 * Get grades assigned to a Teacher
 * @param userId - Teacher's user ID
 * @returns Array of grade IDs assigned to the teacher
 */
async function getTeacherGradeIds(userId: string): Promise<string[]> {
  try {
    const queries = await import('../graphql/queries');
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

    // 5. Handle pupil assignments if pupilIds provided
    if (validatedData.pupilIds !== undefined) {
      try {
        // Get current pupils in the grade
        const currentPupilsResult = await getPupilsByGrade(validatedData.id, 1000);
        const currentPupilIds =
          currentPupilsResult?.items
            ?.filter((p): p is NonNullable<typeof p> => p !== null)
            .map((p) => p.id) || [];

        const newPupilIds = validatedData.pupilIds || [];
        
        // Find pupils to add (in newPupilIds but not in currentPupilIds)
        const pupilsToAdd = newPupilIds.filter((id) => !currentPupilIds.includes(id));
        
        // Find pupils to remove (in currentPupilIds but not in newPupilIds)
        const pupilsToRemove = currentPupilIds.filter((id) => !newPupilIds.includes(id));

        // Add pupils to grade
        await Promise.allSettled(
          pupilsToAdd.map((pupilId) =>
            updatePupil({
              id: pupilId,
              gradeId: validatedData.id,
            })
          )
        );

        // Note: According to GraphQL schema, gradeId is required (ID!)
        // We cannot set it to null or empty string
        // For MVP, we'll only add pupils to the grade
        // Removal of pupils from grade should be handled through a separate interface
        // or by assigning them to another grade
        // For now, we log pupils that should be removed but don't actually remove them
        if (pupilsToRemove.length > 0) {
          console.log(
            `Note: ${pupilsToRemove.length} pupil(s) should be removed from grade ${validatedData.id}, but removal is not implemented yet. Pupil IDs: ${pupilsToRemove.join(', ')}`
          );
        }
      } catch (error) {
        console.error('Error updating pupil assignments:', error);
        // Don't fail the entire operation if pupil assignment fails
        // The grade update was successful, pupil assignment can be retried
      }
    }

    // 6. Handle teacher assignments if teacherIds provided
    if (validatedData.teacherIds !== undefined) {
      try {
        // Get current teachers via UserGrade junction table
        const queries = await import('../graphql/queries');
        const query = (queries as Record<string, string>).userGradesByGradeIdAndUserId;
        
        if (query) {
          const result = await executeGraphQL<{
            userGradesByGradeIdAndUserId?: {
              items?: Array<{ id: string; userId: string }>;
            };
          }>(query, { gradeId: validatedData.id });
          
          const currentUserGrades = result.data?.userGradesByGradeIdAndUserId?.items || [];
          const currentTeacherIds = currentUserGrades.map((ug) => ug.userId).filter(Boolean);
          
          const newTeacherIds = validatedData.teacherIds || [];
          
          // Find teachers to add (in newTeacherIds but not in currentTeacherIds)
          const teachersToAdd = newTeacherIds.filter((id) => !currentTeacherIds.includes(id));
          
          // Find teachers to remove (in currentTeacherIds but not in newTeacherIds)
          const teachersToRemove = currentUserGrades.filter(
            (ug) => !newTeacherIds.includes(ug.userId)
          );

          // Add teachers to grade
          const assignedAt = new Date().toISOString();
          await Promise.allSettled(
            teachersToAdd.map((teacherId) =>
              createUserGrade({
                userId: teacherId,
                gradeId: validatedData.id,
                assignedAt,
              })
            )
          );

          // Remove teachers from grade
          await Promise.allSettled(
            teachersToRemove.map((userGrade) => deleteUserGrade(userGrade.id))
          );
        }
      } catch (error) {
        console.error('Error updating teacher assignments:', error);
        // Don't fail the entire operation if teacher assignment fails
      }
    }

    // 6. Revalidate cache
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

      // Process each lesson sequentially to avoid AppSync rate limits and auth context loss
      // TODO: Replace with controlled parallelism (p-limit) in Phase 2
      const lessonsWithStats: LessonWithStats[] = [];
      for (const lesson of lessons) {
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

        // Get golden verse references by fetching GoldenVerse objects sequentially
        const goldenVerses: Array<{
          id: string;
          reference: string;
          order: number;
        }> = [];
        for (const lgv of lessonGoldenVerses) {
          const goldenVerse = await getGoldenVerse(lgv.goldenVerseId);
          goldenVerses.push({
            id: lgv.goldenVerseId,
            reference: goldenVerse?.reference || `Стих #${lgv.order || 0}`,
            order: lgv.order || 0,
          });
        }
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

        lessonsWithStats.push({
          lesson: serializedLesson,
          homeworkStats,
          goldenVerses,
        });
      }

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

/**
 * Get list of all pupils for selection
 * Used in grade edit form for pupil selection
 * 
 * Authorization: ADMIN, SUPERADMIN only
 */
export async function listPupilsForSelectionAction(): Promise<
  ActionResponse<
    Array<{
      id: string;
      firstName: string;
      lastName: string;
      middleName?: string | null;
      dateOfBirth: string;
      age?: number;
    }>
  >
> {
  try {
    // 1. Check authentication
    const user = await getAuthenticatedUser();
    if (!user) {
      return {
        success: false,
        error: 'Unauthorized: User not authenticated',
      };
    }

    // 2. Check authorization (Admin only)
    const isAdmin = checkRole(user, ['ADMIN', 'SUPERADMIN']);
    if (!isAdmin) {
      return {
        success: false,
        error: 'Forbidden: Admin access required',
      };
    }

    // 3. Get all active pupils
    const pupilsResult = await listPupils(
      { active: { eq: true } },
      1000 // Large limit to get all pupils
    );

    if (!pupilsResult || !pupilsResult.items) {
      return {
        success: true,
        data: [],
      };
    }

    // 4. Calculate age and serialize
    const serializedPupils = pupilsResult.items
      .filter((pupil): pupil is NonNullable<typeof pupil> => pupil !== null)
      .map((pupil) => {
        // Calculate age from dateOfBirth
        let age: number | undefined;
        if (pupil.dateOfBirth) {
          const birthDate = new Date(pupil.dateOfBirth);
          const today = new Date();
          age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
        }

        return {
          id: pupil.id,
          firstName: pupil.firstName,
          lastName: pupil.lastName,
          middleName: pupil.middleName ?? null,
          dateOfBirth: pupil.dateOfBirth,
          age,
        };
      });

    return {
      success: true,
      data: serializedPupils,
    };
  } catch (error) {
    console.error('Error listing pupils for selection:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to list pupils: Unknown error',
    };
  }
}

/**
 * Get list of all teachers for selection
 * Used in grade form for teacher selection
 * 
 * Authorization: ADMIN, SUPERADMIN only
 */
export async function listTeachersForSelectionAction(): Promise<
  ActionResponse<
    Array<{
      id: string;
      name: string;
      email: string;
    }>
  >
> {
  try {
    // 1. Check authentication
    const user = await getAuthenticatedUser();
    if (!user) {
      return {
        success: false,
        error: 'Unauthorized: User not authenticated',
      };
    }

    // 2. Check authorization (Admin only)
    const isAdmin = checkRole(user, ['ADMIN', 'SUPERADMIN']);
    if (!isAdmin) {
      return {
        success: false,
        error: 'Forbidden: Admin access required',
      };
    }

    // 3. Get all active teachers
    const usersResult = await listUsers(
      {
        and: [
          { role: { eq: APITypes.UserRole.TEACHER } },
          { active: { eq: true } },
        ],
      },
      1000 // Large limit to get all teachers
    );

    if (!usersResult || !usersResult.items) {
      return {
        success: true,
        data: [],
      };
    }

    // 4. Serialize teachers
    const serializedTeachers = usersResult.items
      .filter((teacher): teacher is NonNullable<typeof teacher> => teacher !== null)
      .map((teacher) => ({
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
      }));

    return {
      success: true,
      data: serializedTeachers,
    };
  } catch (error) {
    console.error('Error listing teachers for selection:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to list teachers: Unknown error',
    };
  }
}

