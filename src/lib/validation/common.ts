/**
 * Common validation schemas
 * Reusable Zod schemas for common validation patterns
 * Used across all entity validation schemas
 */

import { z } from 'zod';

/**
 * UUID validation schema
 * Validates GraphQL ID type (UUID format)
 * Uses flexible UUID validation that accepts any UUID-like format (8-4-4-4-12 hex characters)
 * This is more permissive than strict RFC 4122 validation to support AWS Cognito and other UUID generators
 * @example "123e4567-e89b-12d3-a456-426614174000"
 * @example "c46814c8-9011-7070-d574-20d53a5d8ff8" (AWS Cognito format)
 */
export const uuidSchema = z
  .string()
  .trim()
  .regex(
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
    'Неверный формат UUID'
  );

/**
 * Date validation schema (AWSDate)
 * Validates ISO 8601 date string in YYYY-MM-DD format
 * @example "2025-01-15"
 */
export const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Неверный формат даты (требуется YYYY-MM-DD)');

/**
 * Optional date schema
 * Date that can be undefined or null
 */
export const optionalDateSchema = dateSchema.optional();

/**
 * DateTime validation schema (AWSDateTime)
 * Validates ISO 8601 datetime string
 * @example "2025-01-15T10:30:00Z"
 */
export const dateTimeSchema = z.string().datetime({
  message: 'Неверный формат даты и времени (требуется ISO 8601)',
});

/**
 * Optional DateTime schema
 * DateTime that can be undefined or null
 */
export const optionalDateTimeSchema = dateTimeSchema.optional();

/**
 * Email validation schema (AWSEmail)
 * Validates email address format
 * @example "user@example.com"
 */
export const emailSchema = z.string().email('Неверный формат email адреса');

/**
 * Optional email schema
 * Email that can be undefined or null
 */
export const optionalEmailSchema = emailSchema.optional();

/**
 * Password validation schema
 * Validates password according to Cognito password policy:
 * - Minimum 8 characters
 * - Maximum 100 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 */
export const passwordSchema = z
  .string()
  .min(8, 'Пароль должен содержать минимум 8 символов')
  .max(100, 'Пароль должен содержать не более 100 символов')
  .regex(/[A-Z]/, 'Пароль должен содержать хотя бы одну заглавную букву')
  .regex(/[a-z]/, 'Пароль должен содержать хотя бы одну строчную букву')
  .regex(/[0-9]/, 'Пароль должен содержать хотя бы одну цифру');

/**
 * Non-empty string schema
 * Validates that string is not empty
 */
export const nonEmptyStringSchema = z
  .string()
  .min(1, 'Это поле обязательно для заполнения');

/**
 * Grade ID string schema
 * Validates grade ID as a string (can be UUID or string like "grade-3")
 * GraphQL ID type accepts both formats
 * Use this for direct gradeId validation (not wrapped in object)
 */
export const gradeIdStringSchema = z
  .string()
  .min(1, 'ID группы обязательно для заполнения');

/**
 * Academic Year ID string schema
 * Validates academic year ID as a string (can be UUID or string like "year-123")
 * GraphQL ID type accepts both formats
 * Use this for direct academicYearId validation (not wrapped in object)
 */
export const academicYearIdStringSchema = z
  .string()
  .min(1, 'ID учебного года обязательно для заполнения');

