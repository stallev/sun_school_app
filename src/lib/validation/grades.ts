/**
 * Grade validation schemas
 * Validates grade creation and update data
 * Based on CreateGradeInput and UpdateGradeInput from GraphQL schema
 */

import { z } from 'zod';
import { uuidSchema, dateTimeSchema } from './common';

/**
 * Create grade schema
 * Validates data for creating a new grade
 * Corresponds to CreateGradeInput from GraphQL schema
 */
export const createGradeSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Название группы обязательно')
      .max(100, 'Название группы должно быть не более 100 символов'),
    description: z
      .string()
      .max(500, 'Описание должно быть не более 500 символов')
      .optional(),
    minAge: z
      .number()
      .int()
      .min(0, 'Минимальный возраст должен быть не менее 0')
      .max(18, 'Минимальный возраст должен быть не более 18')
      .optional(),
    maxAge: z
      .number()
      .int()
      .min(0, 'Максимальный возраст должен быть не менее 0')
      .max(18, 'Максимальный возраст должен быть не более 18')
      .optional(),
    active: z.boolean(),
  })
  .refine(
    (data) => {
      // If both ages are provided, maxAge must be >= minAge
      if (data.minAge !== undefined && data.maxAge !== undefined) {
        return data.maxAge >= data.minAge;
      }
      return true;
    },
    {
      message: 'Максимальный возраст должен быть больше или равен минимальному возрасту',
      path: ['maxAge'],
    }
  );

export type CreateGradeInput = z.infer<typeof createGradeSchema>;

/**
 * Update grade schema
 * Validates data for updating an existing grade
 * Corresponds to UpdateGradeInput from GraphQL schema
 */
export const updateGradeSchema = z
  .object({
    id: uuidSchema,
    name: z
      .string()
      .min(1, 'Название группы обязательно')
      .max(100, 'Название группы должно быть не более 100 символов')
      .optional(),
    description: z
      .string()
      .max(500, 'Описание должно быть не более 500 символов')
      .optional(),
    minAge: z
      .number()
      .int()
      .min(0)
      .max(18)
      .optional(),
    maxAge: z
      .number()
      .int()
      .min(0)
      .max(18)
      .optional(),
    active: z.boolean().optional(),
    pupilIds: z
      .array(uuidSchema)
      .optional()
      .describe('Массив ID учеников для назначения на группу (только в режиме редактирования)'),
  })
  .refine(
    (data) => {
      // If both ages are provided, maxAge must be >= minAge
      if (data.minAge !== undefined && data.maxAge !== undefined) {
        return data.maxAge >= data.minAge;
      }
      return true;
    },
    {
      message: 'Максимальный возраст должен быть больше или равен минимальному возрасту',
      path: ['maxAge'],
    }
  );

export type UpdateGradeInput = z.infer<typeof updateGradeSchema>;

/**
 * Assign teacher to grade schema
 * Validates data for assigning a teacher to a grade
 * Corresponds to CreateUserGradeInput from GraphQL schema
 */
export const assignTeacherSchema = z.object({
  gradeId: uuidSchema,
  userId: uuidSchema,
  assignedAt: dateTimeSchema,
});

export type AssignTeacherInput = z.infer<typeof assignTeacherSchema>;

/**
 * Grade ID schema
 * Validates grade ID for delete and get operations
 * Accepts both UUID and regular string formats
 */
export const gradeIdSchema = z.object({
  id: z.string().min(1, 'ID обязательно для заполнения'),
});

export type GradeIdInput = z.infer<typeof gradeIdSchema>;

