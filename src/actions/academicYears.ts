/**
 * Server Actions for Academic Years management
 * CRUD operations for academic years with role-based access control
 * 
 * Authorization:
 * - Admin/SUPERADMIN: Full access (create, update, complete, activate)
 * - Teacher: Read-only access to assigned grades only
 */

'use server';

import { getAuthenticatedUser, checkRole } from '../lib/auth/cognito';
import {
  createAcademicYearSchema,
  updateAcademicYearSchema,
} from '../lib/validation/academicYears';
import { gradeIdStringSchema, academicYearIdStringSchema } from '../lib/validation/common';
import {
  createAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
} from '../lib/db/mutations';
import {
  getAcademicYear,
  getAcademicYearsByGrade,
  listAcademicYears,
  getLessonsByAcademicYear,
} from '../lib/db/queries';
import { getTeacherGradeIdsWithCache } from '../lib/utils/teacher-grade-cache';
import { revalidatePath, revalidateTag } from 'next/cache';
import { getActiveYear } from '../lib/utils/academicYears';
import * as APITypes from '../API';

/**
 * Response type for Server Actions
 */
type ActionResponse<T> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string };

/**
 * Serializable Academic Year type for Server Actions
 */
type SerializableAcademicYear = {
  id: string;
  gradeId: string;
  name: string;
  startDate: string;
  endDate: string;
  status: APITypes.AcademicYearStatus;
  createdAt: string;
  updatedAt: string;
};



/**
 * Create a new academic year
 * Authorization: ADMIN, SUPERADMIN only
 * 
 * @param input - Academic year creation data
 * @returns ActionResponse with created academic year
 */
export async function createAcademicYearAction(
  input: unknown
): Promise<ActionResponse<SerializableAcademicYear>> {
  try {
    // 1. Validate input
    const validationResult = createAcademicYearSchema.safeParse(input);
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
        error: 'Unauthorized: You must be logged in to create an academic year',
      };
    }

    // 3. Check authorization (Admin only)
    if (!checkRole(user, ['ADMIN', 'SUPERADMIN'])) {
      return {
        success: false,
        error: 'Forbidden: Only administrators can create academic years',
      };
    }

    // 4. Check business rules: if creating ACTIVE year, ensure no other ACTIVE year exists
    if (validatedData.status === APITypes.AcademicYearStatus.ACTIVE) {
      const existingActiveYear = await getActiveYear(validatedData.gradeId);
      if (existingActiveYear) {
        return {
          success: false,
          error: `Cannot create active academic year: Group already has an active year "${existingActiveYear.name}"`,
        };
      }
    }

    // 5. Create academic year
    const academicYear = await createAcademicYear({
      gradeId: validatedData.gradeId,
      name: validatedData.name,
      startDate: validatedData.startDate,
      endDate: validatedData.endDate,
      status: validatedData.status as APITypes.AcademicYearStatus,
    });

    // 6. Serialize for Server Component
    const serializedYear: SerializableAcademicYear = {
      id: academicYear.id,
      gradeId: academicYear.gradeId,
      name: academicYear.name,
      startDate: academicYear.startDate,
      endDate: academicYear.endDate,
      status: academicYear.status,
      createdAt: academicYear.createdAt,
      updatedAt: academicYear.updatedAt,
    };

    // 7. Revalidate cache
    revalidateTag('academic-years');
    revalidateTag(`grade-${validatedData.gradeId}`);
    revalidatePath(`/grades/${validatedData.gradeId}/academic-years`);
    revalidatePath(`/grades/${validatedData.gradeId}`);

    return {
      success: true,
      data: serializedYear,
      message: 'Учебный год успешно создан',
    };
  } catch (error) {
    console.error('Error creating academic year:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to create academic year: Unknown error',
    };
  }
}

/**
 * Update an existing academic year
 * Authorization: ADMIN, SUPERADMIN only
 * 
 * @param input - Academic year update data
 * @returns ActionResponse with updated academic year
 */
export async function updateAcademicYearAction(
  input: unknown
): Promise<ActionResponse<SerializableAcademicYear>> {
  try {
    // 1. Validate input
    const validationResult = updateAcademicYearSchema.safeParse(input);
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
        error: 'Unauthorized: You must be logged in to update an academic year',
      };
    }

    // 3. Check authorization (Admin only)
    if (!checkRole(user, ['ADMIN', 'SUPERADMIN'])) {
      return {
        success: false,
        error: 'Forbidden: Only administrators can update academic years',
      };
    }

    // 4. Get existing academic year to check current status
    const existingYear = await getAcademicYear(validatedData.id);
    if (!existingYear) {
      return {
        success: false,
        error: 'Academic year not found',
      };
    }

    // 5. Check business rules: if status is changing to ACTIVE, ensure no other ACTIVE year exists
    if (validatedData.status === APITypes.AcademicYearStatus.ACTIVE && existingYear.status !== APITypes.AcademicYearStatus.ACTIVE) {
      const existingActiveYear = await getActiveYear(existingYear.gradeId);
      if (existingActiveYear && existingActiveYear.id !== validatedData.id) {
        return {
          success: false,
          error: `Cannot activate academic year: Group already has an active year "${existingActiveYear.name}"`,
        };
      }
    }

    // 6. Update academic year
    const updateInput: APITypes.UpdateAcademicYearInput = {
      id: validatedData.id,
    };

    if (validatedData.gradeId !== undefined) {
      updateInput.gradeId = validatedData.gradeId;
    }
    if (validatedData.name !== undefined) {
      updateInput.name = validatedData.name;
    }
    if (validatedData.startDate !== undefined) {
      updateInput.startDate = validatedData.startDate;
    }
    if (validatedData.endDate !== undefined) {
      updateInput.endDate = validatedData.endDate;
    }
    if (validatedData.status !== undefined) {
      updateInput.status = validatedData.status as APITypes.AcademicYearStatus;
    }

    const academicYear = await updateAcademicYear(updateInput);

    // 7. Serialize for Server Component
    const serializedYear: SerializableAcademicYear = {
      id: academicYear.id,
      gradeId: academicYear.gradeId,
      name: academicYear.name,
      startDate: academicYear.startDate,
      endDate: academicYear.endDate,
      status: academicYear.status,
      createdAt: academicYear.createdAt,
      updatedAt: academicYear.updatedAt,
    };

    // 8. Revalidate cache
    revalidateTag('academic-years');
    revalidateTag(`grade-${academicYear.gradeId}`);
    revalidateTag(`academic-year-${academicYear.id}`);
    revalidatePath(`/grades/${academicYear.gradeId}/academic-years`);
    revalidatePath(`/grades/${academicYear.gradeId}`);

    return {
      success: true,
      data: serializedYear,
      message: 'Учебный год успешно обновлен',
    };
  } catch (error) {
    console.error('Error updating academic year:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to update academic year: Unknown error',
    };
  }
}

/**
 * Get active academic year for a grade
 * Authorization:
 * - ADMIN, SUPERADMIN: Access to all grades
 * - Teacher: Access only to assigned grades
 * 
 * @param input - Grade ID
 * @returns ActionResponse with active academic year or null
 */
export async function getActiveAcademicYearAction(
  input: unknown
): Promise<ActionResponse<SerializableAcademicYear | null>> {
  try {
    // 1. Validate input
    const validationResult = gradeIdStringSchema.safeParse(input);
    if (!validationResult.success) {
      return {
        success: false,
        error: `Validation failed: ${validationResult.error.issues.map((e) => e.message).join(', ')}`,
      };
    }

    const gradeId = validationResult.data;

    // 2. Check authentication
    const user = await getAuthenticatedUser();
    if (!user) {
      return {
        success: false,
        error: 'Unauthorized: You must be logged in to view academic years',
      };
    }

    // 3. Check authorization and access
    const isAdmin = checkRole(user, ['ADMIN', 'SUPERADMIN']);
    const isTeacher = checkRole(user, ['TEACHER']);

    if (!isAdmin && !isTeacher) {
      return {
        success: false,
        error: 'Forbidden: You do not have permission to view academic years',
      };
    }

    // 4. For Teacher, check if they have access to this grade
    if (isTeacher && !isAdmin) {
      const gradeIds = await getTeacherGradeIdsWithCache(user.id);
      const hasAccess = gradeIds.includes(gradeId);
      if (!hasAccess) {
        return {
          success: false,
          error: 'Forbidden: You do not have access to this grade',
        };
      }
    }

    // 5. Get active academic year
    const activeYear = await getActiveYear(gradeId);

    if (!activeYear) {
      return {
        success: true,
        data: null,
      };
    }

    // 6. Serialize for Server Component
    const serializedYear: SerializableAcademicYear = {
      id: activeYear.id,
      gradeId: activeYear.gradeId,
      name: activeYear.name,
      startDate: activeYear.startDate,
      endDate: activeYear.endDate,
      status: activeYear.status,
      createdAt: activeYear.createdAt,
      updatedAt: activeYear.updatedAt,
    };

    return {
      success: true,
      data: serializedYear,
    };
  } catch (error) {
    console.error('Error getting active academic year:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to get active academic year: Unknown error',
    };
  }
}

/**
 * List all academic years for a grade
 * Authorization:
 * - ADMIN, SUPERADMIN: Access to all grades
 * - Teacher: Access only to assigned grades
 * 
 * @param input - Grade ID
 * @returns ActionResponse with list of academic years
 */
export async function listAcademicYearsAction(
  input: unknown
): Promise<ActionResponse<SerializableAcademicYear[]>> {
  try {
    // 1. Validate input
    const validationResult = gradeIdStringSchema.safeParse(input);
    if (!validationResult.success) {
      return {
        success: false,
        error: `Validation failed: ${validationResult.error.issues.map((e) => e.message).join(', ')}`,
      };
    }

    const gradeId = validationResult.data;

    // 2. Check authentication
    const user = await getAuthenticatedUser();
    if (!user) {
      return {
        success: false,
        error: 'Unauthorized: You must be logged in to view academic years',
      };
    }

    // 3. Check authorization and access
    const isAdmin = checkRole(user, ['ADMIN', 'SUPERADMIN']);
    const isTeacher = checkRole(user, ['TEACHER']);

    if (!isAdmin && !isTeacher) {
      return {
        success: false,
        error: 'Forbidden: You do not have permission to view academic years',
      };
    }

    // 4. For Teacher, check if they have access to this grade
    if (isTeacher && !isAdmin) {
      const gradeIds = await getTeacherGradeIdsWithCache(user.id);
      const hasAccess = gradeIds.includes(gradeId);
      if (!hasAccess) {
        return {
          success: false,
          error: 'Forbidden: You do not have access to this grade',
        };
      }
    }

    // 5. Get academic years by grade ID (sorted by startDate descending)
    const result = await getAcademicYearsByGrade(gradeId, 1000);

    if (!result || !result.items) {
      return {
        success: true,
        data: [],
      };
    }

    // 6. Serialize and sort by startDate (newest first)
    const academicYears = result.items
      .filter((year): year is APITypes.AcademicYear => year !== null)
      .map((year) => ({
        id: year.id,
        gradeId: year.gradeId,
        name: year.name,
        startDate: year.startDate,
        endDate: year.endDate,
        status: year.status,
        createdAt: year.createdAt,
        updatedAt: year.updatedAt,
      }))
      .sort((a, b) => {
        // Sort by startDate descending (newest first)
        const dateA = new Date(a.startDate).getTime();
        const dateB = new Date(b.startDate).getTime();
        return dateB - dateA;
      });

    return {
      success: true,
      data: academicYears,
    };
  } catch (error) {
    console.error('Error listing academic years:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to list academic years: Unknown error',
    };
  }
}

/**
 * Complete (finish) an active academic year
 * Authorization: ADMIN, SUPERADMIN only
 * 
 * @param input - Grade ID
 * @returns ActionResponse with updated academic year
 */
export async function completeAcademicYearAction(
  input: unknown
): Promise<ActionResponse<SerializableAcademicYear>> {
  try {
    // 1. Validate input
    const validationResult = gradeIdStringSchema.safeParse(input);
    if (!validationResult.success) {
      return {
        success: false,
        error: `Validation failed: ${validationResult.error.issues.map((e) => e.message).join(', ')}`,
      };
    }

    const gradeId = validationResult.data;

    // 2. Check authentication
    const user = await getAuthenticatedUser();
    if (!user) {
      return {
        success: false,
        error: 'Unauthorized: You must be logged in to complete an academic year',
      };
    }

    // 3. Check authorization (Admin only)
    if (!checkRole(user, ['ADMIN', 'SUPERADMIN'])) {
      return {
        success: false,
        error: 'Forbidden: Only administrators can complete academic years',
      };
    }

    // 4. Get active academic year
    const activeYear = await getActiveYear(gradeId);
    if (!activeYear) {
      return {
        success: false,
        error: 'No active academic year found for this grade',
      };
    }

    // 5. Update status to FINISHED
    const academicYear = await updateAcademicYear({
      id: activeYear.id,
      status: APITypes.AcademicYearStatus.FINISHED,
    });

    // 6. Serialize for Server Component
    const serializedYear: SerializableAcademicYear = {
      id: academicYear.id,
      gradeId: academicYear.gradeId,
      name: academicYear.name,
      startDate: academicYear.startDate,
      endDate: academicYear.endDate,
      status: academicYear.status,
      createdAt: academicYear.createdAt,
      updatedAt: academicYear.updatedAt,
    };

    // 7. Revalidate cache
    revalidateTag('academic-years');
    revalidateTag(`grade-${gradeId}`);
    revalidateTag(`academic-year-${academicYear.id}`);
    revalidatePath(`/grades/${gradeId}/academic-years`);
    revalidatePath(`/grades/${gradeId}`);

    return {
      success: true,
      data: serializedYear,
      message: 'Учебный год успешно завершен',
    };
  } catch (error) {
    console.error('Error completing academic year:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to complete academic year: Unknown error',
    };
  }
}

/**
 * Activate a finished academic year
 * Authorization: ADMIN, SUPERADMIN only
 * 
 * This function is part of Task 12.05 but implemented here as required by Task 12.01
 * 
 * @param input - Academic year ID
 * @returns ActionResponse with updated academic year
 */
export async function activateAcademicYearAction(
  input: unknown
): Promise<ActionResponse<SerializableAcademicYear>> {
  try {
    // 1. Validate input
    const validationResult = academicYearIdStringSchema.safeParse(input);
    if (!validationResult.success) {
      return {
        success: false,
        error: `Validation failed: ${validationResult.error.issues.map((e) => e.message).join(', ')}`,
      };
    }

    const academicYearId = validationResult.data;

    // 2. Check authentication
    const user = await getAuthenticatedUser();
    if (!user) {
      return {
        success: false,
        error: 'Unauthorized: You must be logged in to activate an academic year',
      };
    }

    // 3. Check authorization (Admin only)
    if (!checkRole(user, ['ADMIN', 'SUPERADMIN'])) {
      return {
        success: false,
        error: 'Forbidden: Only administrators can activate academic years',
      };
    }

    // 4. Get academic year
    const academicYear = await getAcademicYear(academicYearId);
    if (!academicYear) {
      return {
        success: false,
        error: 'Academic year not found',
      };
    }

    // 5. Check that year has status FINISHED
    if (academicYear.status !== APITypes.AcademicYearStatus.FINISHED) {
      return {
        success: false,
        error: `Cannot activate academic year: Year must have status FINISHED, but current status is ${academicYear.status}`,
      };
    }

    // 6. Check that there is no other active year in the group
    const existingActiveYear = await getActiveYear(academicYear.gradeId);
    if (existingActiveYear) {
      return {
        success: false,
        error: `Cannot activate academic year: Group already has an active year "${existingActiveYear.name}". Please complete the active year first.`,
      };
    }

    // 7. Update status to ACTIVE
    const updatedYear = await updateAcademicYear({
      id: academicYearId,
      status: APITypes.AcademicYearStatus.ACTIVE,
    });

    // 8. Serialize for Server Component
    const serializedYear: SerializableAcademicYear = {
      id: updatedYear.id,
      gradeId: updatedYear.gradeId,
      name: updatedYear.name,
      startDate: updatedYear.startDate,
      endDate: updatedYear.endDate,
      status: updatedYear.status,
      createdAt: updatedYear.createdAt,
      updatedAt: updatedYear.updatedAt,
    };

    // 9. Revalidate cache
    revalidateTag('academic-years');
    revalidateTag(`grade-${updatedYear.gradeId}`);
    revalidateTag(`academic-year-${updatedYear.id}`);
    revalidatePath(`/grades/${updatedYear.gradeId}/academic-years`);
    revalidatePath(`/grades/${updatedYear.gradeId}`);

    return {
      success: true,
      data: serializedYear,
      message: 'Учебный год успешно активирован',
    };
  } catch (error) {
    console.error('Error activating academic year:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to activate academic year: Unknown error',
    };
  }
}

/**
 * Complete all active academic years globally
 * Authorization: ADMIN, SUPERADMIN only
 * 
 * This function completes all active academic years across all grades simultaneously.
 * Useful for ending the academic year school-wide.
 * 
 * @returns ActionResponse with count of completed years and list of completed years
 */
export async function completeAllAcademicYearsAction(): Promise<
  ActionResponse<{
    count: number;
    completedYears: SerializableAcademicYear[];
  }>
> {
  try {
    // 1. Check authentication
    const user = await getAuthenticatedUser();
    if (!user) {
      return {
        success: false,
        error: 'Unauthorized: You must be logged in to complete academic years',
      };
    }

    // 2. Check authorization (Admin only)
    if (!checkRole(user, ['ADMIN', 'SUPERADMIN'])) {
      return {
        success: false,
        error: 'Forbidden: Only administrators can complete academic years globally',
      };
    }

    // 3. Get all active academic years (with pagination handling)
    const allActiveYears: APITypes.AcademicYear[] = [];
    let nextToken: string | undefined = undefined;
    const limit = 1000; // Maximum items per request

    do {
      const result = await listAcademicYears(
        {
          status: { eq: APITypes.AcademicYearStatus.ACTIVE },
        },
        limit,
        nextToken
      );

      if (result?.items) {
        const validItems = result.items.filter(
          (item): item is APITypes.AcademicYear => item !== null
        );
        allActiveYears.push(...validItems);
      }

      nextToken = result?.nextToken || undefined;
    } while (nextToken);

    // 4. If no active years found, return success with empty result
    if (allActiveYears.length === 0) {
      return {
        success: true,
        data: {
          count: 0,
          completedYears: [],
        },
        message: 'Активные учебные годы не найдены',
      };
    }

    // 5. Update all active years to FINISHED status (batch operation)
    const updatePromises = allActiveYears.map((year) =>
      updateAcademicYear({
        id: year.id,
        status: APITypes.AcademicYearStatus.FINISHED,
      })
    );

    const updatedYears = await Promise.all(updatePromises);

    // 6. Serialize for Server Component
    const serializedYears: SerializableAcademicYear[] = updatedYears.map((year) => ({
      id: year.id,
      gradeId: year.gradeId,
      name: year.name,
      startDate: year.startDate,
      endDate: year.endDate,
      status: year.status,
      createdAt: year.createdAt,
      updatedAt: year.updatedAt,
    }));

    // 7. Revalidate cache for all affected grades
    const uniqueGradeIds = [...new Set(updatedYears.map((year) => year.gradeId))];
    revalidateTag('academic-years');
    uniqueGradeIds.forEach((gradeId) => {
      revalidateTag(`grade-${gradeId}`);
      revalidatePath(`/grades/${gradeId}/academic-years`);
      revalidatePath(`/grades/${gradeId}`);
    });

    return {
      success: true,
      data: {
        count: serializedYears.length,
        completedYears: serializedYears,
      },
      message: `Успешно завершено ${serializedYears.length} учебных ${serializedYears.length === 1 ? 'год' : serializedYears.length < 5 ? 'года' : 'лет'}`,
    };
  } catch (error) {
    console.error('Error completing all academic years:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to complete all academic years: Unknown error',
    };
  }
}

/**
 * Delete an academic year
 * Authorization: ADMIN, SUPERADMIN only
 * Business rule: Can only delete if academic year has no lessons
 * 
 * @param input - Academic year ID
 * @returns ActionResponse with deletion confirmation
 */
export async function deleteAcademicYearAction(
  input: unknown
): Promise<ActionResponse<{ id: string }>> {
  try {
    // 1. Validate input
    const validationResult = academicYearIdStringSchema.safeParse(input);
    if (!validationResult.success) {
      return {
        success: false,
        error: `Validation failed: ${validationResult.error.issues.map((e) => e.message).join(', ')}`,
      };
    }

    const academicYearId = validationResult.data;

    // 2. Check authentication
    const user = await getAuthenticatedUser();
    if (!user) {
      return {
        success: false,
        error: 'Unauthorized: You must be logged in to delete an academic year',
      };
    }

    // 3. Check authorization (Admin only)
    if (!checkRole(user, ['ADMIN', 'SUPERADMIN'])) {
      return {
        success: false,
        error: 'Forbidden: Only administrators can delete academic years',
      };
    }

    // 4. Get academic year to check existence and get gradeId for cache revalidation
    const academicYear = await getAcademicYear(academicYearId);
    if (!academicYear) {
      return {
        success: false,
        error: 'Academic year not found',
      };
    }

    // 5. Check if academic year has lessons
    const lessonsResult = await getLessonsByAcademicYear(academicYearId, 1);
    const hasLessons = lessonsResult?.items && lessonsResult.items.length > 0;
    
    if (hasLessons) {
      return {
        success: false,
        error: 'Невозможно удалить учебный год: в нем есть уроки. Сначала удалите все уроки.',
      };
    }

    // 6. Delete academic year
    await deleteAcademicYear(academicYearId);

    // 7. Revalidate cache
    revalidateTag('academic-years');
    revalidateTag(`grade-${academicYear.gradeId}`);
    revalidateTag(`academic-year-${academicYearId}`);
    revalidatePath(`/grades/${academicYear.gradeId}/academic-years`);
    revalidatePath(`/grades/${academicYear.gradeId}`);

    return {
      success: true,
      data: { id: academicYearId },
      message: 'Учебный год успешно удален',
    };
  } catch (error) {
    console.error('Error deleting academic year:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to delete academic year: Unknown error',
    };
  }
}

