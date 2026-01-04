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
import { invalidateTeacherGradeCache, getTeacherGradeIdsWithCache } from '../lib/utils/teacher-grade-cache';
import {
  getGrade,
  listGrades,
  getGradeWithNestedData,
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
import { revalidatePath, revalidateTag } from 'next/cache';
import * as APITypes from '../API';
import type { UserGradeNestedData } from '../types/nested-queries';

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

    // 5. Handle teacher assignments if teacherIds provided
    if (validatedData.teacherIds && validatedData.teacherIds.length > 0) {
      try {
        const assignedAt = new Date().toISOString();
        await Promise.allSettled(
          validatedData.teacherIds.map((teacherId) =>
            createUserGrade({
              userId: teacherId,
              gradeId: grade.id,
              assignedAt,
            })
          )
        );
      } catch (error) {
        console.error('Error assigning teachers to grade:', error);
        // Don't fail the entire operation if teacher assignment fails
        // The grade was created successfully, teacher assignment can be retried
      }
    }

    // 6. Revalidate cache
    // Use tags for precise cache invalidation
    revalidateTag('grades');
    revalidateTag(`grade-${grade.id}`);
    // Also revalidate paths for compatibility
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
        // Use GraphQL query userGradesByGradeIdAndUserId (UserGrade has @model(queries: null))
        const queries = await import('../graphql/queries');
        const { executeGraphQL } = await import('../lib/db/amplify');
        const query = (queries as Record<string, string>).userGradesByGradeIdAndUserId;
        
        if (!query) {
          console.error('Query userGradesByGradeIdAndUserId not found');
          throw new Error('Query userGradesByGradeIdAndUserId not found');
        }
        
        // Get all UserGrade records for this grade
        // Query requires gradeId, userId is optional - omit it to get all
        const result = await executeGraphQL<{
          userGradesByGradeIdAndUserId?: {
            items?: Array<{ id: string; userId: string }>;
          };
        }>(query, { 
          gradeId: validatedData.id,
        });
        
        const currentUserGrades = result.data?.userGradesByGradeIdAndUserId?.items || [];
        
        // Дедупликация по userId - если есть несколько записей UserGrade с одним userId, берем только одну
        const uniqueUserGrades = currentUserGrades.filter((ug, index, self) => 
          index === self.findIndex((u) => u.userId === ug.userId)
        );
        const currentTeacherIds = uniqueUserGrades.map((ug) => ug.userId).filter(Boolean);
        
        const newTeacherIds = validatedData.teacherIds || [];
        
        // Find teachers to add (in newTeacherIds but not in currentTeacherIds)
        const teachersToAdd = newTeacherIds.filter((id) => !currentTeacherIds.includes(id));
        
        // Find teachers to remove (in currentTeacherIds but not in newTeacherIds)
        const teachersToRemove = uniqueUserGrades.filter(
          (ug) => !newTeacherIds.includes(ug.userId)
        );

        // Add teachers to grade
        const assignedAt = new Date().toISOString();
        const addResults = await Promise.allSettled(
          teachersToAdd.map(async (teacherId) => {
            // Проверка: не создаем дубликат, если запись уже существует
            const existingUserGrade = uniqueUserGrades.find(
              (ug) => ug.userId === teacherId
            );
            if (!existingUserGrade && teacherId && validatedData.id) {
              try {
                const result = await createUserGrade({
                  userId: teacherId,
                  gradeId: validatedData.id,
                  assignedAt,
                });
                console.log(`Successfully created UserGrade for teacher ${teacherId} and grade ${validatedData.id}`);
                return result;
              } catch (createError) {
                console.error(`Error creating UserGrade for teacher ${teacherId} and grade ${validatedData.id}:`, {
                  error: createError,
                  errorType: createError instanceof Error ? createError.constructor.name : typeof createError,
                  errorMessage: createError instanceof Error ? createError.message : String(createError),
                  errorStack: createError instanceof Error ? createError.stack : undefined,
                  errorKeys: createError && typeof createError === 'object' ? Object.keys(createError) : [],
                  fullError: createError,
                  input: {
                    userId: teacherId,
                    gradeId: validatedData.id,
                    assignedAt,
                  },
                });
                throw createError;
              }
            }
            return Promise.resolve();
          })
        );

        // Log any failures when adding teachers
        addResults.forEach((result, index) => {
          if (result.status === 'rejected') {
            const error = result.reason;
            console.error(`Failed to add teacher ${teachersToAdd[index]}:`, {
              error,
              errorType: error instanceof Error ? error.constructor.name : typeof error,
              errorMessage: error instanceof Error ? error.message : String(error),
              errorStack: error instanceof Error ? error.stack : undefined,
              errorKeys: error && typeof error === 'object' ? Object.keys(error) : [],
              fullError: error,
              teacherId: teachersToAdd[index],
              gradeId: validatedData.id,
            });
          }
        });

        // Remove teachers from grade
        const removeResults = await Promise.allSettled(
          teachersToRemove.map((userGrade) => {
            try {
              return deleteUserGrade(userGrade.id);
            } catch (deleteError) {
              console.error(`Error deleting UserGrade ${userGrade.id}:`, {
                error: deleteError,
                errorType: deleteError instanceof Error ? deleteError.constructor.name : typeof deleteError,
                errorMessage: deleteError instanceof Error ? deleteError.message : String(deleteError),
                errorStack: deleteError instanceof Error ? deleteError.stack : undefined,
                errorKeys: deleteError && typeof deleteError === 'object' ? Object.keys(deleteError) : [],
                fullError: deleteError,
                userGradeId: userGrade.id,
                userId: userGrade.userId,
                gradeId: validatedData.id,
              });
              throw deleteError;
            }
          })
        );

        // Log any failures when removing teachers
        removeResults.forEach((result, index) => {
          if (result.status === 'rejected') {
            const error = result.reason;
            const userGrade = teachersToRemove[index];
            console.error(`Failed to remove teacher ${userGrade?.userId}:`, {
              error,
              errorType: error instanceof Error ? error.constructor.name : typeof error,
              errorMessage: error instanceof Error ? error.message : String(error),
              errorStack: error instanceof Error ? error.stack : undefined,
              errorKeys: error && typeof error === 'object' ? Object.keys(error) : [],
              fullError: error,
              userGradeId: userGrade?.id,
              userId: userGrade?.userId,
              gradeId: validatedData.id,
            });
          }
        });

        // Invalidate cache for affected teachers
        // When teacher assignments change, their cached grade IDs become stale
        try {
          // Collect all affected teacher IDs (added and removed)
          const allAffectedTeacherIds = [
            ...teachersToAdd,
            ...teachersToRemove.map((ug) => ug.userId),
          ];

          // Remove duplicates
          const uniqueTeacherIds = Array.from(new Set(allAffectedTeacherIds));

          if (uniqueTeacherIds.length > 0) {
            // Invalidate cache for affected teachers
            // Note: Current implementation clears cache for current request's user
            // For MVP, we clear all teacher caches (simple and safe approach)
            // Cache will be automatically refreshed on next access check
            await invalidateTeacherGradeCache();
            
            console.log(
              `Invalidated teacher grade cache for ${uniqueTeacherIds.length} affected teachers`
            );
          }
        } catch (error) {
          // Don't fail the operation if cache invalidation fails
          // Cache invalidation is optimization, not critical functionality
          console.error('Error invalidating teacher grade cache:', error);
        }
      } catch (error) {
        console.error('Error updating teacher assignments:', error);
        // Don't fail the entire operation if teacher assignment fails
        // But log the error for debugging
      }
    }

    // 6. Revalidate cache
    // Use tags for precise cache invalidation
    revalidateTag('grades');
    revalidateTag(`grade-${validatedData.id}`);
    // Also revalidate paths for compatibility
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
    // Use tags for precise cache invalidation
    revalidateTag('grades');
    revalidateTag(`grade-${id}`);
    // Also revalidate paths for compatibility
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
      const gradeIds = await getTeacherGradeIdsWithCache(user.id);
      const hasAccess = gradeIds.includes(id);
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
      const teacherGradeIds = await getTeacherGradeIdsWithCache(user.id);
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
      const gradeIds = await getTeacherGradeIdsWithCache(user.id);
      const hasAccess = gradeIds.includes(id);
      if (!hasAccess) {
        return {
          success: false,
          error: 'Forbidden: You do not have access to this grade',
        };
      }
    }

    // 5. Get grade with nested data using single GraphQL query
    const gradeNestedData = await getGradeWithNestedData(id);

    if (!gradeNestedData) {
      return {
        success: false,
        error: 'Grade not found',
      };
    }

    // 6. Serialize grade (extract base Grade fields from GradeNestedData)
    const baseGrade: APITypes.Grade = {
      id: gradeNestedData.id,
      name: gradeNestedData.name,
      description: gradeNestedData.description ?? null,
      minAge: gradeNestedData.minAge ?? null,
      maxAge: gradeNestedData.maxAge ?? null,
      active: gradeNestedData.active,
      createdAt: gradeNestedData.createdAt,
      updatedAt: gradeNestedData.updatedAt,
      __typename: 'Grade',
    };
    const serializedGrade = serializeGrade(baseGrade);
    if (!serializedGrade) {
      return {
        success: false,
        error: 'Grade not found',
      };
    }

    // 7. Extract and serialize pupils
    const serializedPupils = (gradeNestedData.pupils?.items || [])
      .filter((pupil): pupil is APITypes.Pupil => pupil !== null)
      .map((pupil) => ({
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

    // 8. Extract and serialize teachers from UserGrade nested data
    const serializedTeachers = (gradeNestedData.teachers?.items || [])
      .filter((userGrade): userGrade is UserGradeNestedData => 
        userGrade !== null && userGrade.user !== null && userGrade.user !== undefined
      )
      .map((userGrade) => {
        const user = userGrade.user!;
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          photo: user.photo ?? null,
          active: user.active,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      })
      // Дедупликация по userId - оставляем только уникальных преподавателей
      .filter((teacher, index, self) => 
        index === self.findIndex((t) => t.id === teacher.id)
      );

    // 9. Get active pupils count and IDs for statistics
    const activePupils = serializedPupils.filter((p) => p.active);
    const totalPupils = activePupils.length;
    const activePupilIds = new Set(activePupils.map((p) => p.id));

    // 10. Process academic years with lessons
    const academicYearsWithLessons: AcademicYearWithLessons[] = [];

    // Get academic years from nested data
    const academicYearsItems = (gradeNestedData.academicYears?.items || [])
      .filter((ay): ay is NonNullable<typeof ay> => ay !== null);

    // Convert to APITypes.AcademicYear for sorting
    const academicYearsForSorting: APITypes.AcademicYear[] = academicYearsItems.map((ay) => ({
      id: ay.id,
      gradeId: ay.gradeId,
      name: ay.name,
      startDate: ay.startDate,
      endDate: ay.endDate,
      status: ay.status,
      createdAt: ay.createdAt,
      updatedAt: ay.updatedAt,
      __typename: 'AcademicYear',
    }));

    // Sort academic years by start date (newest first)
    const sortedAcademicYears = sortAcademicYearsByStartDate(academicYearsForSorting);

    // Process each academic year
    for (const sortedYear of sortedAcademicYears) {
      // Find corresponding nested data
      const academicYear = academicYearsItems.find((ay) => ay.id === sortedYear.id);
      if (!academicYear) continue;

      // Get lessons from nested data
      const lessons = (academicYear.lessons?.items || [])
        .filter((lesson): lesson is NonNullable<typeof lesson> => lesson !== null);

      const lessonsWithStats: LessonWithStats[] = [];

      // Process each lesson
      for (const lesson of lessons) {
        // Extract homework checks from nested data
        const homeworkChecksItems = (lesson.homeworkChecks?.items || [])
          .filter((hc): hc is NonNullable<typeof hc> => hc !== null);
        
        const homeworkChecks: APITypes.HomeworkCheck[] = homeworkChecksItems.map((hc) => ({
          id: hc.id,
          lessonId: hc.lessonId,
          pupilId: hc.pupilId,
          gradeId: hc.gradeId,
          goldenVerse1Score: hc.goldenVerse1Score ?? null,
          goldenVerse2Score: hc.goldenVerse2Score ?? null,
          goldenVerse3Score: hc.goldenVerse3Score ?? null,
          testScore: hc.testScore ?? null,
          notebookScore: hc.notebookScore ?? null,
          singing: hc.singing ?? null,
          points: hc.points ?? null,
          createdAt: hc.createdAt,
          updatedAt: hc.updatedAt,
          __typename: 'HomeworkCheck',
          pupil: hc.pupil || null, // pupil is already included via @belongsTo
        }));

        // Calculate statistics (only for active pupils)
        const homeworkStats = getHomeworkCheckStats(homeworkChecks, totalPupils, activePupilIds);

        // Extract golden verses from nested data
        const lessonGoldenVersesItems = (lesson.goldenVerses?.items || [])
          .filter((lgv): lgv is NonNullable<typeof lgv> => lgv !== null);

        // Transform golden verses to required format
        const goldenVerses: Array<{
          id: string;
          reference: string;
          order: number;
        }> = lessonGoldenVersesItems.map((lgv) => ({
          id: lgv.goldenVerseId,
          reference: lgv.goldenVerse?.reference || `Стих #${lgv.order || 0}`,
          order: lgv.order || 0,
        }));
        goldenVerses.sort((a, b) => a.order - b.order);

        // Serialize lesson for Server Component
        const serializedLesson = {
          id: lesson.id,
          academicYearId: lesson.academicYearId,
          gradeId: lesson.gradeId,
          teacherId: lesson.teacherId || '',
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
        id: sortedYear.id,
        gradeId: sortedYear.gradeId,
        name: sortedYear.name,
        startDate: sortedYear.startDate,
        endDate: sortedYear.endDate,
        status: sortedYear.status,
        createdAt: sortedYear.createdAt,
        updatedAt: sortedYear.updatedAt,
      };

      academicYearsWithLessons.push({
        academicYear: serializedAcademicYear,
        lessons: lessonsWithStats,
      });
    }

    // 11. Return full data
    return {
      success: true,
      data: {
        grade: serializedGrade,
        pupils: serializedPupils,
        teachers: serializedTeachers,
        academicYears: academicYearsWithLessons,
        settings: gradeNestedData.settings ?? null,
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

