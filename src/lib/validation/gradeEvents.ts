/**
 * Grade event validation schemas
 * Validates grade event creation and update data
 * Based on CreateGradeEventInput and UpdateGradeEventInput from GraphQL schema
 */

import { z } from 'zod';
import { uuidSchema, dateSchema } from './common';

/**
 * Grade event type enum
 * Corresponds to GradeEventType from GraphQL schema
 */
export const gradeEventTypeEnum = z.enum(
  ['LESSON', 'OUTDOOR_EVENT', 'LESSON_SKIPPING'],
  {
    message: 'Тип события должен быть LESSON, OUTDOOR_EVENT или LESSON_SKIPPING',
  }
);

/**
 * Create grade event schema
 * Validates data for creating a new grade event
 * Corresponds to CreateGradeEventInput from GraphQL schema
 */
export const createGradeEventSchema = z.object({
  gradeId: uuidSchema,
  eventType: gradeEventTypeEnum,
  title: z
    .string()
    .min(1, 'Название события обязательно')
    .max(200, 'Название события должно быть не более 200 символов'),
  description: z
    .string()
    .max(1000, 'Описание события должно быть не более 1000 символов')
    .optional(),
  eventDate: dateSchema,
});

export type CreateGradeEventInput = z.infer<typeof createGradeEventSchema>;

/**
 * Update grade event schema
 * Validates data for updating an existing grade event
 * Corresponds to UpdateGradeEventInput from GraphQL schema
 */
export const updateGradeEventSchema = z.object({
  id: uuidSchema,
  gradeId: uuidSchema.optional(),
  eventType: gradeEventTypeEnum.optional(),
  title: z
    .string()
    .min(1, 'Название события обязательно')
    .max(200, 'Название события должно быть не более 200 символов')
    .optional(),
  description: z
    .string()
    .max(1000, 'Описание события должно быть не более 1000 символов')
    .optional(),
  eventDate: dateSchema.optional(),
});

export type UpdateGradeEventInput = z.infer<typeof updateGradeEventSchema>;

/**
 * Grade event ID schema
 * Validates grade event ID for delete and get operations
 */
export const gradeEventIdSchema = z.object({
  id: uuidSchema,
});

export type GradeEventIdInput = z.infer<typeof gradeEventIdSchema>;

