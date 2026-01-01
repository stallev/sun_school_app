/**
 * Homework check validation schemas
 * Validates homework check creation and update data
 * Based on CreateHomeworkCheckInput and UpdateHomeworkCheckInput from GraphQL schema
 */

import { z } from 'zod';
import { uuidSchema } from './common';

/**
 * Create homework check schema
 * Validates data for creating a new homework check
 * Corresponds to CreateHomeworkCheckInput from GraphQL schema
 */
export const createHomeworkCheckSchema = z.object({
  lessonId: uuidSchema,
  pupilId: uuidSchema,
  gradeId: uuidSchema,
  points: z.number().int().min(0, 'Баллы не могут быть отрицательными'),
  singing: z.boolean(),
  goldenVerse1Score: z
    .number()
    .int()
    .min(0, 'Баллы за первый золотой стих должны быть от 0 до 2')
    .max(2, 'Баллы за первый золотой стих должны быть от 0 до 2')
    .optional(),
  goldenVerse2Score: z
    .number()
    .int()
    .min(0, 'Баллы за второй золотой стих должны быть от 0 до 2')
    .max(2, 'Баллы за второй золотой стих должны быть от 0 до 2')
    .optional(),
  goldenVerse3Score: z
    .number()
    .int()
    .min(0, 'Баллы за третий золотой стих должны быть от 0 до 2')
    .max(2, 'Баллы за третий золотой стих должны быть от 0 до 2')
    .optional(),
  testScore: z
    .number()
    .int()
    .min(0, 'Баллы за тест должны быть от 0 до 10')
    .max(10, 'Баллы за тест должны быть от 0 до 10')
    .optional(),
  notebookScore: z
    .number()
    .int()
    .min(0, 'Баллы за тетрадь должны быть от 0 до 10')
    .max(10, 'Баллы за тетрадь должны быть от 0 до 10')
    .optional(),
});

export type CreateHomeworkCheckInput = z.infer<typeof createHomeworkCheckSchema>;

/**
 * Update homework check schema
 * Validates data for updating an existing homework check
 * Corresponds to UpdateHomeworkCheckInput from GraphQL schema
 */
export const updateHomeworkCheckSchema = z.object({
  id: uuidSchema,
  lessonId: uuidSchema.optional(),
  pupilId: uuidSchema.optional(),
  gradeId: uuidSchema.optional(),
  points: z.number().int().min(0).optional(),
  singing: z.boolean().optional(),
  goldenVerse1Score: z.number().int().min(0).max(2).optional(),
  goldenVerse2Score: z.number().int().min(0).max(2).optional(),
  goldenVerse3Score: z.number().int().min(0).max(2).optional(),
  testScore: z.number().int().min(0).max(10).optional(),
  notebookScore: z.number().int().min(0).max(10).optional(),
});

export type UpdateHomeworkCheckInput = z.infer<typeof updateHomeworkCheckSchema>;

/**
 * Homework check ID schema
 * Validates homework check ID for delete and get operations
 */
export const homeworkCheckIdSchema = z.object({
  id: uuidSchema,
});

export type HomeworkCheckIdInput = z.infer<typeof homeworkCheckIdSchema>;

