/**
 * User validation schemas
 * Validates user creation and update data
 * Based on CreateUserInput and UpdateUserInput from GraphQL schema
 */

import { z } from 'zod';
import { uuidSchema, emailSchema } from './common';

/**
 * User role enum
 * Corresponds to UserRole from GraphQL schema
 */
export const userRoleEnum = z.enum(
  ['TEACHER', 'ADMIN', 'SUPERADMIN', 'PARENT', 'PUPIL'],
  {
    message: 'Роль должна быть TEACHER, ADMIN, SUPERADMIN, PARENT или PUPIL',
  }
);

/**
 * Create user schema
 * Validates data for creating a new user
 * Corresponds to CreateUserInput from GraphQL schema
 */
export const createUserSchema = z.object({
  name: z
    .string()
    .min(1, 'Имя пользователя обязательно')
    .max(100, 'Имя пользователя должно быть не более 100 символов'),
  email: emailSchema,
  role: userRoleEnum,
  photo: z.string().url('Неверный формат URL фотографии').optional(),
  active: z.boolean().default(true),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

/**
 * Update user schema
 * Validates data for updating an existing user
 * Corresponds to UpdateUserInput from GraphQL schema
 */
export const updateUserSchema = z.object({
  id: uuidSchema,
  name: z
    .string()
    .min(1, 'Имя пользователя обязательно')
    .max(100, 'Имя пользователя должно быть не более 100 символов')
    .optional(),
  email: emailSchema.optional(),
  role: userRoleEnum.optional(),
  photo: z.string().url('Неверный формат URL фотографии').optional(),
  active: z.boolean().optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

/**
 * User ID schema
 * Validates user ID for delete and get operations
 */
export const userIdSchema = z.object({
  id: uuidSchema,
});

export type UserIdInput = z.infer<typeof userIdSchema>;

