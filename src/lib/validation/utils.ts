/**
 * Validation utility functions
 * Helper functions for formatting and handling Zod validation errors
 * Following principles from docs/guidelines/react/ai_react_utilities_guidelines.md
 */

import { z } from 'zod';

/**
 * Formats Zod validation errors into a record of field names to error messages
 * Useful for displaying errors in forms
 *
 * @param error - Zod error object
 * @returns Record mapping field paths to arrays of error messages
 *
 * @example
 * ```ts
 * try {
 *   schema.parse(data);
 * } catch (error) {
 *   if (error instanceof z.ZodError) {
 *     const fieldErrors = formatValidationErrors(error);
 *     // { email: ['Неверный формат email'], password: ['Пароль обязателен'] }
 *   }
 * }
 * ```
 */
export function formatValidationErrors(
  error: z.ZodError
): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const path = issue.path.join('.');
    if (!fieldErrors[path]) {
      fieldErrors[path] = [];
    }
    fieldErrors[path].push(issue.message);
  }

  return fieldErrors;
}

/**
 * Gets the first error message for a specific field from a Zod error
 * Returns undefined if no error exists for the field
 *
 * @param error - Zod error object
 * @param field - Field path (supports dot notation for nested fields)
 * @returns First error message for the field, or undefined if no error
 *
 * @example
 * ```ts
 * try {
 *   schema.parse(data);
 * } catch (error) {
 *   if (error instanceof z.ZodError) {
 *     const emailError = getFieldError(error, 'email');
 *     // 'Неверный формат email' or undefined
 *   }
 * }
 * ```
 */
export function getFieldError(
  error: z.ZodError,
  field: string
): string | undefined {
  const fieldErrors = formatValidationErrors(error);
  const errors = fieldErrors[field];
  return errors && errors.length > 0 ? errors[0] : undefined;
}

/**
 * Formats Zod error for Server Actions response
 * Returns a structured object with a general message and field-specific errors
 *
 * @param error - Zod error object
 * @returns Object with message and fieldErrors
 *
 * @example
 * ```ts
 * try {
 *   schema.parse(data);
 * } catch (error) {
 *   if (error instanceof z.ZodError) {
 *     return {
 *       success: false,
 *       error: formatZodErrorForServer(error)
 *     };
 *   }
 * }
 * ```
 */
export function formatZodErrorForServer(error: z.ZodError): {
  message: string;
  fieldErrors: Record<string, string[]>;
} {
  const fieldErrors = formatValidationErrors(error);
  const firstError = error.issues[0];
  const message =
    firstError?.message || 'Ошибка валидации данных. Проверьте введенные данные.';

  return {
    message,
    fieldErrors,
  };
}

/**
 * Safely parses data with a Zod schema
 * Returns a discriminated union with success flag
 *
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Object with success flag and either data or error
 *
 * @example
 * ```ts
 * const result = safeParse(schema, userInput);
 * if (result.success) {
 *   // result.data is typed correctly
 * } else {
 *   // result.error contains ZodError
 * }
 * ```
 */
export function safeParse<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
):
  | { success: true; data: z.infer<T> }
  | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}

