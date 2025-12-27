/**
 * Server Actions for Books management
 * Used to seed the Books table with all 66 books of the Bible
 */

'use server';

import { booksSeedData, type BookSeedData } from '../scripts/seed-books-data';
import { getAuthenticatedUser, checkRole } from '../src/lib/auth/cognito';
import { amplifyData } from '../src/lib/db/amplify';
import { z } from 'zod';

/**
 * Response type for Server Actions
 */
type ActionResponse<T> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string };

/**
 * Zod schema for book data validation
 */
const BookSeedSchema = z.object({
  fullName: z.string().min(1),
  shortName: z.string().min(1),
  abbreviation: z.string().min(1),
  testament: z.enum(['OLD', 'NEW']),
  order: z.number().int().min(1).max(66),
});

/**
 * Seed Books table with all 66 books of the Bible
 * Only ADMIN and SUPERADMIN can execute this action
 * 
 * @returns ActionResponse with number of created books
 */
export async function seedBooks(): Promise<
  ActionResponse<{ created: number; skipped: number }>
> {
  try {
    // 1. Check authentication
    const user = await getAuthenticatedUser();
    if (!user) {
      return {
        success: false,
        error: 'Unauthorized: You must be logged in to seed books',
      };
    }

    // 2. Check authorization (only ADMIN and SUPERADMIN)
    if (!checkRole(user, ['ADMIN', 'SUPERADMIN'])) {
      return {
        success: false,
        error: 'Forbidden: Only administrators can seed books',
      };
    }

    // 3. Check if books already exist
    const existingBooks = await amplifyData.listBooks();
    const existingCount = existingBooks?.items?.length || 0;

    if (existingCount >= 66) {
      return {
        success: true,
        data: { created: 0, skipped: 66 },
        message: 'Books table is already populated with all 66 books',
      };
    }

    // 4. Validate all book data
    const validationResults = booksSeedData.map(
      (book: BookSeedData, index: number) => {
        const result = BookSeedSchema.safeParse(book);
        if (!result.success) {
          return {
            index,
            book,
            error: result.error,
          };
        }
        return null;
      }
    );

    const validationErrors = validationResults.filter(
      (result: { index: number; book: BookSeedData; error: z.ZodError } | null) =>
        result !== null
    );

    if (validationErrors.length > 0) {
      return {
        success: false,
        error: `Validation failed for ${validationErrors.length} books. First error: ${validationErrors[0]?.error.message}`,
      };
    }

    // 5. Create books (skip if already exists)
    let created = 0;
    let skipped = 0;

    for (const bookData of booksSeedData) {
      try {
        // Check if book with same shortName already exists
        const existing = await amplifyData.listBooks({
          shortName: { eq: bookData.shortName },
        });

        if (existing?.items && existing.items.length > 0) {
          skipped++;
          continue;
        }

        // Create book
        await amplifyData.createBook({
          fullName: bookData.fullName,
          shortName: bookData.shortName,
          abbreviation: bookData.abbreviation,
          testament: bookData.testament,
          order: bookData.order,
        });

        created++;
      } catch (error) {
        // If error is about duplicate, skip
        if (
          error instanceof Error &&
          (error.message.includes('already exists') ||
            error.message.includes('duplicate'))
        ) {
          skipped++;
        } else {
          // Log error but continue with other books
          console.error(
            `Error creating book ${bookData.shortName}:`,
            error
          );
          skipped++;
        }
      }
    }

    return {
      success: true,
      data: { created, skipped },
      message: `Successfully seeded books: ${created} created, ${skipped} skipped`,
    };
  } catch (error) {
    console.error('Error seeding books:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to seed books: Unknown error',
    };
  }
}

