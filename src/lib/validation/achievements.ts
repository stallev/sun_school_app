/**
 * Achievement validation schemas
 * Validates achievement creation and update data
 * Based on CreateAchievementInput and UpdateAchievementInput from GraphQL schema
 */

import { z } from 'zod';
import { uuidSchema, dateTimeSchema } from './common';

/**
 * Create achievement schema
 * Validates data for creating a new achievement
 * Corresponds to CreateAchievementInput from GraphQL schema
 */
export const createAchievementSchema = z.object({
  name: z
    .string()
    .min(1, 'Название достижения обязательно')
    .max(100, 'Название достижения должно быть не более 100 символов'),
  description: z.string().min(1, 'Описание достижения обязательно'),
  icon: z
    .string()
    .max(100, 'Иконка должна быть не более 100 символов')
    .optional(),
  criteria: z.string().min(1, 'Критерии достижения обязательны'), // JSON string
});

export type CreateAchievementInput = z.infer<typeof createAchievementSchema>;

/**
 * Update achievement schema
 * Validates data for updating an existing achievement
 * Corresponds to UpdateAchievementInput from GraphQL schema
 */
export const updateAchievementSchema = z.object({
  id: uuidSchema,
  name: z
    .string()
    .min(1, 'Название достижения обязательно')
    .max(100, 'Название достижения должно быть не более 100 символов')
    .optional(),
  description: z.string().min(1, 'Описание достижения обязательно').optional(),
  icon: z.string().max(100, 'Иконка должна быть не более 100 символов').optional(),
  criteria: z.string().min(1, 'Критерии достижения обязательны').optional(),
});

export type UpdateAchievementInput = z.infer<typeof updateAchievementSchema>;

/**
 * Award achievement to pupil schema
 * Validates data for awarding an achievement to a pupil
 * Corresponds to CreatePupilAchievementInput from GraphQL schema
 */
export const awardAchievementSchema = z.object({
  pupilId: uuidSchema,
  achievementId: uuidSchema,
  awardedAt: dateTimeSchema,
});

export type AwardAchievementInput = z.infer<typeof awardAchievementSchema>;

/**
 * Achievement ID schema
 * Validates achievement ID for delete and get operations
 */
export const achievementIdSchema = z.object({
  id: uuidSchema,
});

export type AchievementIdInput = z.infer<typeof achievementIdSchema>;

