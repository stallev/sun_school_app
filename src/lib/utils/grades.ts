/**
 * Grade serialization utilities
 * Converts Grade objects to serializable format for Server Components
 */

import type * as APITypes from '@/API';

/**
 * Serializable Grade type (only fields from Grade table, no relations)
 */
export type SerializableGrade = {
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
 * Serialize Grade object for Server Component
 * Removes relations and ensures all fields are serializable
 * @param grade - Grade object from GraphQL
 * @returns Serializable Grade object
 */
export function serializeGrade(grade: APITypes.Grade | null): SerializableGrade | null {
  if (!grade) {
    return null;
  }

  return {
    id: grade.id,
    name: grade.name,
    description: grade.description ?? null,
    minAge: grade.minAge ?? null,
    maxAge: grade.maxAge ?? null,
    active: grade.active,
    createdAt: grade.createdAt,
    updatedAt: grade.updatedAt,
  };
}

/**
 * Group lessons by academic year ID
 * @param lessons - Array of lessons
 * @returns Map of academic year ID to lessons array
 * @internal - Currently not used, but kept for future use
 */
export function _getLessonsByAcademicYearId(
  lessons: APITypes.Lesson[]
): Map<string, APITypes.Lesson[]> {
  const grouped = new Map<string, APITypes.Lesson[]>();

  for (const lesson of lessons) {
    if (!lesson.academicYearId) continue;

    const existing = grouped.get(lesson.academicYearId) || [];
    existing.push(lesson);
    grouped.set(lesson.academicYearId, existing);
  }

  // Sort lessons by order within each academic year
  for (const [yearId, yearLessons] of grouped.entries()) {
    yearLessons.sort((a, b) => (a.order || 0) - (b.order || 0));
    grouped.set(yearId, yearLessons);
  }

  return grouped;
}

/**
 * Homework check statistics for a lesson
 */
export type HomeworkCheckStats = {
  total: number; // Total number of pupils in grade
  checked: number; // Number of homework checks completed
  percentage: number; // Percentage of checked (0-100)
};

/**
 * Calculate homework check statistics for a lesson
 * @param homeworkChecks - Array of homework checks for the lesson
 * @param totalPupils - Total number of pupils in the grade
 * @returns Statistics object
 */
export function getHomeworkCheckStats(
  homeworkChecks: APITypes.HomeworkCheck[],
  totalPupils: number
): HomeworkCheckStats {
  const checked = homeworkChecks.length;
  const total = Math.max(totalPupils, checked); // At least as many as checked
  const percentage = total > 0 ? Math.round((checked / total) * 100) : 0;

  return {
    total,
    checked,
    percentage,
  };
}

/**
 * Format academic year status for display
 * @param status - Academic year status
 * @returns Formatted status string
 */
export function formatAcademicYearStatus(
  status: APITypes.AcademicYearStatus | null | undefined
): string {
  if (!status) return 'Неизвестно';

  switch (status) {
    case 'ACTIVE':
      return 'АКТИВНЫЙ';
    case 'FINISHED':
      return 'ЗАВЕРШЕН';
    default:
      return status;
  }
}

/**
 * Get active academic year from array of academic years
 * @param academicYears - Array of academic years
 * @returns Active academic year or null
 */
export function getActiveAcademicYear(
  academicYears: APITypes.AcademicYear[]
): APITypes.AcademicYear | null {
  return academicYears.find((year) => year.status === 'ACTIVE') || null;
}

/**
 * Sort academic years by start date (newest first)
 * @param academicYears - Array of academic years
 * @returns Sorted array (newest first)
 */
export function sortAcademicYearsByStartDate(
  academicYears: APITypes.AcademicYear[]
): APITypes.AcademicYear[] {
  return [...academicYears].sort((a, b) => {
    const dateA = new Date(a.startDate).getTime();
    const dateB = new Date(b.startDate).getTime();
    return dateB - dateA; // Descending (newest first)
  });
}

