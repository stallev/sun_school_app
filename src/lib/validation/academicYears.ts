/**
 * Academic year validation schemas
 * Validates academic year creation and update data
 * Based on CreateAcademicYearInput and UpdateAcademicYearInput from GraphQL schema
 */

import { z } from 'zod';
import { dateSchema, gradeIdStringSchema, academicYearIdStringSchema } from './common';

/**
 * Academic year status enum
 * Corresponds to AcademicYearStatus from GraphQL schema
 */
export const academicYearStatusEnum = z.enum(['ACTIVE', 'FINISHED'], {
  message: 'Статус должен быть ACTIVE или FINISHED',
});

/**
 * Create academic year schema
 * Validates data for creating a new academic year
 * Corresponds to CreateAcademicYearInput from GraphQL schema
 */
export const createAcademicYearSchema = z
  .object({
    gradeId: gradeIdStringSchema,
    name: z
      .string()
      .min(1, 'Название учебного года обязательно')
      .max(100, 'Название учебного года должно быть не более 100 символов'),
    startDate: dateSchema,
    endDate: dateSchema,
    status: academicYearStatusEnum,
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end > start;
    },
    {
      message: 'Дата окончания должна быть позже даты начала',
      path: ['endDate'],
    }
  );

export type CreateAcademicYearInput = z.infer<typeof createAcademicYearSchema>;

/**
 * Update academic year schema
 * Validates data for updating an existing academic year
 * Corresponds to UpdateAcademicYearInput from GraphQL schema
 */
export const updateAcademicYearSchema = z
  .object({
    id: academicYearIdStringSchema,
    gradeId: gradeIdStringSchema.optional(),
    name: z
      .string()
      .min(1, 'Название учебного года обязательно')
      .max(100, 'Название учебного года должно быть не более 100 символов')
      .optional(),
    startDate: dateSchema.optional(),
    endDate: dateSchema.optional(),
    status: academicYearStatusEnum.optional(),
  })
  .refine(
    (data) => {
      // If both dates are provided, endDate must be > startDate
      if (data.startDate && data.endDate) {
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        return end > start;
      }
      return true;
    },
    {
      message: 'Дата окончания должна быть позже даты начала',
      path: ['endDate'],
    }
  );

export type UpdateAcademicYearInput = z.infer<typeof updateAcademicYearSchema>;

/**
 * Academic year ID schema
 * Validates academic year ID for delete and get operations
 */
export const academicYearIdSchema = z.object({
  id: academicYearIdStringSchema,
});

export type AcademicYearIdInput = z.infer<typeof academicYearIdSchema>;

