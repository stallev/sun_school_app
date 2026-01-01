/**
 * Pupil validation schemas
 * Validates pupil creation and update data
 * Based on CreatePupilInput and UpdatePupilInput from GraphQL schema
 */

import { z } from 'zod';
import { uuidSchema, dateSchema } from './common';

/**
 * Create pupil schema
 * Validates data for creating a new pupil
 * Corresponds to CreatePupilInput from GraphQL schema
 */
export const createPupilSchema = z.object({
  gradeId: uuidSchema,
  firstName: z
    .string()
    .min(1, 'Имя обязательно')
    .max(50, 'Имя должно быть не более 50 символов'),
  lastName: z
    .string()
    .min(1, 'Фамилия обязательна')
    .max(50, 'Фамилия должна быть не более 50 символов'),
  middleName: z
    .string()
    .max(50, 'Отчество должно быть не более 50 символов')
    .optional(),
  dateOfBirth: dateSchema,
  photo: z.string().url('Неверный формат URL фотографии').optional(),
  active: z.boolean().default(true),
});

export type CreatePupilInput = z.infer<typeof createPupilSchema>;

/**
 * Update pupil schema
 * Validates data for updating an existing pupil
 * Corresponds to UpdatePupilInput from GraphQL schema
 */
export const updatePupilSchema = z.object({
  id: uuidSchema,
  gradeId: uuidSchema.optional(),
  firstName: z
    .string()
    .min(1, 'Имя обязательно')
    .max(50, 'Имя должно быть не более 50 символов')
    .optional(),
  lastName: z
    .string()
    .min(1, 'Фамилия обязательна')
    .max(50, 'Фамилия должна быть не более 50 символов')
    .optional(),
  middleName: z
    .string()
    .max(50, 'Отчество должно быть не более 50 символов')
    .optional(),
  dateOfBirth: dateSchema.optional(),
  photo: z.string().url('Неверный формат URL фотографии').optional(),
  active: z.boolean().optional(),
});

export type UpdatePupilInput = z.infer<typeof updatePupilSchema>;

/**
 * Pupil ID schema
 * Validates pupil ID for delete and get operations
 */
export const pupilIdSchema = z.object({
  id: uuidSchema,
});

export type PupilIdInput = z.infer<typeof pupilIdSchema>;

