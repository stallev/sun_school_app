/**
 * Homework utilities
 * Provides functions for calculating homework check points
 */

import type * as APITypes from '../../API';

/**
 * Calculate homework check points based on scores and grade settings
 * Formula: points = (goldenVerse1Score + goldenVerse2Score + goldenVerse3Score) + 
 *                  testScore + notebookScore + (singing ? gradeSettings.pointsSinging : 0)
 * 
 * @param homeworkCheck - Homework check data (partial, may not have all fields)
 * @param gradeSettings - Grade settings with points configuration
 * @returns Calculated points (0 if pupil was absent)
 */
export function calculateHomeworkPoints(
  homeworkCheck: {
    goldenVerse1Score?: number | null;
    goldenVerse2Score?: number | null;
    goldenVerse3Score?: number | null;
    testScore?: number | null;
    notebookScore?: number | null;
    singing?: boolean | null;
  },
  gradeSettings: APITypes.GradeSettings
): number {
  // If pupil was absent, all points = 0
  // Note: We don't have isPresent field in the check, so we assume if all scores are null/0, pupil was absent
  const hasAnyScore =
    (homeworkCheck.goldenVerse1Score ?? 0) > 0 ||
    (homeworkCheck.goldenVerse2Score ?? 0) > 0 ||
    (homeworkCheck.goldenVerse3Score ?? 0) > 0 ||
    (homeworkCheck.testScore ?? 0) > 0 ||
    (homeworkCheck.notebookScore ?? 0) > 0 ||
    homeworkCheck.singing === true;

  // If no scores and not singing, return 0 (likely absent)
  if (!hasAnyScore && homeworkCheck.singing !== true) {
    return 0;
  }

  // Calculate points
  const goldenVersePoints =
    (homeworkCheck.goldenVerse1Score ?? 0) +
    (homeworkCheck.goldenVerse2Score ?? 0) +
    (homeworkCheck.goldenVerse3Score ?? 0);

  const testPoints = homeworkCheck.testScore ?? 0;
  const notebookPoints = homeworkCheck.notebookScore ?? 0;
  const singingPoints = homeworkCheck.singing ? gradeSettings.pointsSinging : 0;

  return goldenVersePoints + testPoints + notebookPoints + singingPoints;
}

