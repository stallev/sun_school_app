/**
 * Server Actions for Golden Verses management
 * Operations for selecting golden verses in lesson forms
 * 
 * Authorization:
 * - Teacher, Admin, SUPERADMIN: Read access to golden verses
 */

'use server';

import { getAuthenticatedUser, checkRole } from '../lib/auth/cognito';
import { listGoldenVerses } from '../lib/db/queries';
import * as APITypes from '../API';

/**
 * Response type for Server Actions
 */
type ActionResponse<T> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string };

/**
 * Serializable Golden Verse type for selection
 */
type GoldenVerseForSelection = {
  id: string;
  reference: string;
  text: string;
  bookId: string;
  chapter: number;
  verseStart: number;
  verseEnd?: number | null;
};

/**
 * List golden verses for selection in forms
 * Returns all golden verses with basic information for selection component
 * 
 * Authorization: Teacher, Admin, SUPERADMIN
 */
export async function listGoldenVersesForSelectionAction(): Promise<
  ActionResponse<GoldenVerseForSelection[]>
> {
  try {
    // Check authentication
    const user = await getAuthenticatedUser();
    if (!user) {
      return { success: false, error: 'Необходима аутентификация' };
    }

    // Check authorization - Teacher, Admin, SUPERADMIN can read golden verses
    const isAuthorized = checkRole(user, ['TEACHER', 'ADMIN', 'SUPERADMIN']);

    if (!isAuthorized) {
      return { success: false, error: 'Недостаточно прав доступа' };
    }

    // Fetch all golden verses
    // Use a large limit to get all verses (or implement pagination if needed)
    const result = await listGoldenVerses(undefined, 1000);

    if (!result || !result.items) {
      return { success: true, data: [] };
    }

    // Transform to selection format
    const verses: GoldenVerseForSelection[] = result.items
      .filter((item): item is APITypes.GoldenVerse => item !== null)
      .map((verse) => ({
        id: verse.id,
        reference: verse.reference,
        text: verse.text,
        bookId: verse.bookId,
        chapter: verse.chapter,
        verseStart: verse.verseStart,
        verseEnd: verse.verseEnd ?? undefined,
      }));

    return { success: true, data: verses };
  } catch (error) {
    console.error('Error listing golden verses for selection:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Ошибка при загрузке золотых стихов',
    };
  }
}

