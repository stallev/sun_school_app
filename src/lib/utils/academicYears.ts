/**
 * Academic Years Utilities
 * Provides utility functions for working with academic years
 */

import { executeGraphQL } from '../db/amplify';
import { academicYearsByStatusAndGradeId } from '../../graphql/queries';
import * as APITypes from '../../API';

/**
 * Get active academic year for a grade
 * 
 * Searches for an academic year with status ACTIVE for the specified grade.
 * Returns the active year or null if no active year exists.
 * 
 * @param gradeId - Grade ID to check
 * @returns Active academic year or null
 * @throws Error if GraphQL query fails (errors are logged and null is returned)
 */
export async function getActiveYear(
  gradeId: string
): Promise<APITypes.AcademicYear | null> {
  try {
    const result = await executeGraphQL<{
      academicYearsByStatusAndGradeId?: {
        items?: Array<APITypes.AcademicYear>;
      };
    }>(academicYearsByStatusAndGradeId, {
      status: APITypes.AcademicYearStatus.ACTIVE,
      gradeId: { eq: gradeId },
      limit: 1,
    });

    const items = result.data?.academicYearsByStatusAndGradeId?.items || [];
    return items.length > 0 && items[0] ? items[0] : null;
  } catch (error) {
    console.error('Error getting active academic year:', error);
    return null;
  }
}

