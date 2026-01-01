/**
 * Grade settings validation schemas
 * Validates grade settings creation and update data
 * Based on CreateGradeSettingsInput and UpdateGradeSettingsInput from GraphQL schema
 */

import { z } from 'zod';
import { uuidSchema, nonEmptyStringSchema } from './common';

/**
 * Create grade settings schema
 * Validates data for creating grade settings
 * Corresponds to CreateGradeSettingsInput from GraphQL schema
 */
export const createGradeSettingsSchema = z.object({
  gradeId: uuidSchema,
  enableGoldenVerse: z.boolean(),
  enableTest: z.boolean(),
  enableNotebook: z.boolean(),
  enableSinging: z.boolean(),
  pointsGoldenVerse: z
    .number()
    .int()
    .min(0, 'Баллы за золотой стих не могут быть отрицательными'),
  pointsTest: z
    .number()
    .int()
    .min(0, 'Баллы за тест не могут быть отрицательными'),
  pointsNotebook: z
    .number()
    .int()
    .min(0, 'Баллы за тетрадь не могут быть отрицательными'),
  pointsSinging: z
    .number()
    .int()
    .min(0, 'Баллы за пение не могут быть отрицательными'),
  labelGoldenVerse: nonEmptyStringSchema,
  labelTest: nonEmptyStringSchema,
  labelNotebook: nonEmptyStringSchema,
  labelSinging: nonEmptyStringSchema,
});

export type CreateGradeSettingsInput = z.infer<typeof createGradeSettingsSchema>;

/**
 * Update grade settings schema
 * Validates data for updating grade settings
 * Corresponds to UpdateGradeSettingsInput from GraphQL schema
 */
export const updateGradeSettingsSchema = z.object({
  id: uuidSchema,
  gradeId: uuidSchema.optional(),
  enableGoldenVerse: z.boolean().optional(),
  enableTest: z.boolean().optional(),
  enableNotebook: z.boolean().optional(),
  enableSinging: z.boolean().optional(),
  pointsGoldenVerse: z.number().int().min(0).optional(),
  pointsTest: z.number().int().min(0).optional(),
  pointsNotebook: z.number().int().min(0).optional(),
  pointsSinging: z.number().int().min(0).optional(),
  labelGoldenVerse: nonEmptyStringSchema.optional(),
  labelTest: nonEmptyStringSchema.optional(),
  labelNotebook: nonEmptyStringSchema.optional(),
  labelSinging: nonEmptyStringSchema.optional(),
});

export type UpdateGradeSettingsInput = z.infer<typeof updateGradeSettingsSchema>;

/**
 * Grade settings ID schema
 * Validates grade settings ID for delete and get operations
 */
export const gradeSettingsIdSchema = z.object({
  id: uuidSchema,
});

export type GradeSettingsIdInput = z.infer<typeof gradeSettingsIdSchema>;

