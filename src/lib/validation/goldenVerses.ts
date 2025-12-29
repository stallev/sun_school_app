/**
 * Golden verse validation schemas
 * Validates golden verse creation and update data
 * Based on CreateGoldenVerseInput and UpdateGoldenVerseInput from GraphQL schema
 */

import { z } from 'zod';
import { uuidSchema } from './common';

/**
 * Create golden verse schema
 * Validates data for creating a new golden verse
 * Corresponds to CreateGoldenVerseInput from GraphQL schema
 */
export const createGoldenVerseSchema = z
  .object({
    bookId: uuidSchema,
    reference: z
      .string()
      .min(1, 'Ссылка на стих обязательна')
      .max(100, 'Ссылка на стих должна быть не более 100 символов'),
    chapter: z.number().int().min(1, 'Номер главы должен быть не менее 1'),
    verseStart: z.number().int().min(1, 'Начальный стих должен быть не менее 1'),
    verseEnd: z
      .number()
      .int()
      .min(1, 'Конечный стих должен быть не менее 1')
      .optional(),
    text: z
      .string()
      .min(1, 'Текст стиха обязателен')
      .max(1000, 'Текст стиха должен быть не более 1000 символов'),
  })
  .refine(
    (data) => {
      // If verseEnd is provided, it must be >= verseStart
      if (data.verseEnd !== undefined) {
        return data.verseEnd >= data.verseStart;
      }
      return true;
    },
    {
      message: 'Конечный стих должен быть больше или равен начальному стиху',
      path: ['verseEnd'],
    }
  );

export type CreateGoldenVerseInput = z.infer<typeof createGoldenVerseSchema>;

/**
 * Update golden verse schema
 * Validates data for updating an existing golden verse
 * Corresponds to UpdateGoldenVerseInput from GraphQL schema
 */
export const updateGoldenVerseSchema = z
  .object({
    id: uuidSchema,
    bookId: uuidSchema.optional(),
    reference: z
      .string()
      .min(1, 'Ссылка на стих обязательна')
      .max(100, 'Ссылка на стих должна быть не более 100 символов')
      .optional(),
    chapter: z.number().int().min(1).optional(),
    verseStart: z.number().int().min(1).optional(),
    verseEnd: z.number().int().min(1).optional(),
    text: z
      .string()
      .min(1, 'Текст стиха обязателен')
      .max(1000, 'Текст стиха должен быть не более 1000 символов')
      .optional(),
  })
  .refine(
    (data) => {
      // If both verseStart and verseEnd are provided, verseEnd must be >= verseStart
      if (data.verseStart !== undefined && data.verseEnd !== undefined) {
        return data.verseEnd >= data.verseStart;
      }
      return true;
    },
    {
      message: 'Конечный стих должен быть больше или равен начальному стиху',
      path: ['verseEnd'],
    }
  );

export type UpdateGoldenVerseInput = z.infer<typeof updateGoldenVerseSchema>;

/**
 * Golden verse ID schema
 * Validates golden verse ID for delete and get operations
 */
export const goldenVerseIdSchema = z.object({
  id: uuidSchema,
});

export type GoldenVerseIdInput = z.infer<typeof goldenVerseIdSchema>;

/**
 * Search golden verses schema
 * Validates search query for golden verses
 */
export const searchGoldenVersesSchema = z.object({
  query: z
    .string()
    .min(1, 'Поисковый запрос обязателен')
    .max(100, 'Поисковый запрос должен быть не более 100 символов'),
  limit: z
    .number()
    .int()
    .min(1, 'Лимит должен быть не менее 1')
    .max(50, 'Лимит должен быть не более 50')
    .default(10),
});

export type SearchGoldenVersesInput = z.infer<typeof searchGoldenVersesSchema>;

