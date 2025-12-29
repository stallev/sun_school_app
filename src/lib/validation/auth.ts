/**
 * Authentication validation schemas
 * Uses Zod for type-safe validation
 */

import { z } from 'zod';

/**
 * Sign in schema
 */
export const signInSchema = z.object({
  email: z.string().email('Неверный формат email адреса'),
  password: z.string().min(1, 'Пароль обязателен'),
});

export type SignInInput = z.infer<typeof signInSchema>;

