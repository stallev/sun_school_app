/**
 * Lesson validation schemas
 * Validates lesson creation and update data
 * Based on CreateLessonInput and UpdateLessonInput from GraphQL schema
 */

import { z } from 'zod';
import { uuidSchema, dateSchema } from './common';

/**
 * Create lesson schema
 * Validates data for creating a new lesson
 * Corresponds to CreateLessonInput from GraphQL schema
 */
export const createLessonSchema = z.object({
  academicYearId: uuidSchema,
  gradeId: uuidSchema,
  teacherId: uuidSchema,
  title: z
    .string()
    .min(1, 'Название урока обязательно')
    .max(200, 'Название урока должно быть не более 200 символов'),
  content: z.string().optional(), // Rich text content from BlockNote
  lessonDate: dateSchema,
  order: z.number().int().min(1, 'Порядковый номер должен быть не менее 1'),
});

export type CreateLessonInput = z.infer<typeof createLessonSchema>;

/**
 * Update lesson schema
 * Validates data for updating an existing lesson
 * Corresponds to UpdateLessonInput from GraphQL schema
 * All fields are optional except id
 */
export const updateLessonSchema = z.object({
  id: uuidSchema,
  academicYearId: uuidSchema.optional(),
  gradeId: uuidSchema.optional(),
  teacherId: uuidSchema.optional(),
  title: z
    .string()
    .min(1, 'Название урока обязательно')
    .max(200, 'Название урока должно быть не более 200 символов')
    .optional(),
  content: z.string().optional(),
  lessonDate: dateSchema.optional(),
  order: z.number().int().min(1, 'Порядковый номер должен быть не менее 1').optional(),
});

export type UpdateLessonInput = z.infer<typeof updateLessonSchema>;

/**
 * Lesson ID schema
 * Validates lesson ID for delete and get operations
 */
export const lessonIdSchema = z.object({
  id: uuidSchema,
});

export type LessonIdInput = z.infer<typeof lessonIdSchema>;

