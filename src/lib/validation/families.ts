/**
 * Family validation schemas
 * Validates family creation and update data
 * Based on CreateFamilyInput, UpdateFamilyInput, and CreateFamilyMemberInput from GraphQL schema
 */

import { z } from 'zod';
import { uuidSchema, optionalEmailSchema } from './common';

/**
 * Create family schema
 * Validates data for creating a new family
 * Corresponds to CreateFamilyInput from GraphQL schema
 */
export const createFamilySchema = z.object({
  name: z
    .string()
    .min(1, 'Название семьи обязательно')
    .max(100, 'Название семьи должно быть не более 100 символов'),
  phone: z.string().optional(),
  email: optionalEmailSchema,
  address: z
    .string()
    .max(200, 'Адрес должен быть не более 200 символов')
    .optional(),
  // Mother fields
  motherFirstName: z.string().max(50, 'Имя матери должно быть не более 50 символов').optional(),
  motherLastName: z.string().max(50, 'Фамилия матери должна быть не более 50 символов').optional(),
  motherMiddleName: z.string().max(50, 'Отчество матери должно быть не более 50 символов').optional(),
  motherPhone: z.string().optional(),
  // Father fields
  fatherFirstName: z.string().max(50, 'Имя отца должно быть не более 50 символов').optional(),
  fatherLastName: z.string().max(50, 'Фамилия отца должна быть не более 50 символов').optional(),
  fatherMiddleName: z.string().max(50, 'Отчество отца должно быть не более 50 символов').optional(),
  fatherPhone: z.string().optional(),
});

export type CreateFamilyInput = z.infer<typeof createFamilySchema>;

/**
 * Update family schema
 * Validates data for updating an existing family
 * Corresponds to UpdateFamilyInput from GraphQL schema
 */
export const updateFamilySchema = z.object({
  id: uuidSchema,
  name: z
    .string()
    .min(1, 'Название семьи обязательно')
    .max(100, 'Название семьи должно быть не более 100 символов')
    .optional(),
  phone: z.string().optional(),
  email: optionalEmailSchema,
  address: z
    .string()
    .max(200, 'Адрес должен быть не более 200 символов')
    .optional(),
});

export type UpdateFamilyInput = z.infer<typeof updateFamilySchema>;

/**
 * Create family member schema
 * Validates data for adding a member to a family
 * Corresponds to CreateFamilyMemberInput from GraphQL schema
 */
export const createFamilyMemberSchema = z.object({
  familyId: uuidSchema,
  pupilId: uuidSchema,
});

export type CreateFamilyMemberInput = z.infer<typeof createFamilyMemberSchema>;

/**
 * Create user family schema
 * Validates data for linking a user to a family
 * Corresponds to CreateUserFamilyInput from GraphQL schema
 */
export const createUserFamilySchema = z.object({
  familyId: uuidSchema,
  userId: uuidSchema,
  phone: z.string().min(1, 'Телефон обязателен'),
});

export type CreateUserFamilyInput = z.infer<typeof createUserFamilySchema>;

/**
 * Family ID schema
 * Validates family ID for delete and get operations
 */
export const familyIdSchema = z.object({
  id: uuidSchema,
});

export type FamilyIdInput = z.infer<typeof familyIdSchema>;

