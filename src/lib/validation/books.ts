/**
 * Book validation schemas
 * Validates Bible book creation and update data
 * Based on CreateBookInput and UpdateBookInput from GraphQL schema
 */

import { z } from 'zod';
import { uuidSchema } from './common';

/**
 * Testament enum
 * Validates testament value (OLD or NEW)
 */
export const testamentEnum = z.enum(['OLD', 'NEW'], {
  message: 'Завет должен быть OLD или NEW',
});

/**
 * Create book schema
 * Validates data for creating a new Bible book
 * Corresponds to CreateBookInput from GraphQL schema
 */
export const createBookSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Полное название книги обязательно')
    .max(100, 'Полное название книги должно быть не более 100 символов'),
  shortName: z
    .string()
    .min(1, 'Сокращенное название книги обязательно')
    .max(50, 'Сокращенное название книги должно быть не более 50 символов'),
  abbreviation: z
    .string()
    .min(1, 'Аббревиатура обязательна')
    .max(10, 'Аббревиатура должна быть не более 10 символов'),
  testament: testamentEnum,
  order: z
    .number()
    .int()
    .min(1, 'Порядок должен быть от 1 до 66')
    .max(66, 'Порядок должен быть от 1 до 66'),
});

export type CreateBookInput = z.infer<typeof createBookSchema>;

/**
 * Update book schema
 * Validates data for updating an existing Bible book
 * Corresponds to UpdateBookInput from GraphQL schema
 */
export const updateBookSchema = z.object({
  id: uuidSchema,
  fullName: z
    .string()
    .min(1, 'Полное название книги обязательно')
    .max(100, 'Полное название книги должно быть не более 100 символов')
    .optional(),
  shortName: z
    .string()
    .min(1, 'Сокращенное название книги обязательно')
    .max(50, 'Сокращенное название книги должно быть не более 50 символов')
    .optional(),
  abbreviation: z
    .string()
    .min(1, 'Аббревиатура обязательна')
    .max(10, 'Аббревиатура должна быть не более 10 символов')
    .optional(),
  testament: testamentEnum.optional(),
  order: z
    .number()
    .int()
    .min(1)
    .max(66)
    .optional(),
});

export type UpdateBookInput = z.infer<typeof updateBookSchema>;

/**
 * Book ID schema
 * Validates book ID for delete and get operations
 */
export const bookIdSchema = z.object({
  id: uuidSchema,
});

export type BookIdInput = z.infer<typeof bookIdSchema>;

/**
 * List books schema
 * Validates query parameters for listing books
 */
export const listBooksSchema = z.object({
  testament: testamentEnum.optional(),
  limit: z
    .number()
    .int()
    .min(1, 'Лимит должен быть не менее 1')
    .max(100, 'Лимит должен быть не более 100')
    .default(66),
});

export type ListBooksInput = z.infer<typeof listBooksSchema>;

/**
 * Search books schema
 * Validates search query for books
 */
export const searchBooksSchema = z.object({
  query: z
    .string()
    .min(1, 'Поисковый запрос обязателен')
    .max(100, 'Поисковый запрос должен быть не более 100 символов'),
  limit: z
    .number()
    .int()
    .min(1, 'Лимит должен быть не менее 1')
    .max(66, 'Лимит не может превышать 66 книг')
    .default(10),
});

export type SearchBooksInput = z.infer<typeof searchBooksSchema>;

