/**
 * Authentication validation schemas
 * Uses Zod for type-safe validation
 */

import { z } from 'zod';
import { emailSchema, passwordSchema } from './common';

/**
 * Sign in schema
 * Validates user credentials for authentication
 */
export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Пароль обязателен'),
});

export type SignInInput = z.infer<typeof signInSchema>;

/**
 * Sign up schema
 * Validates user registration data with password confirmation
 */
export const signUpSchema = z
  .object({
    name: z.string().min(1, 'Имя обязательно').max(100, 'Имя слишком длинное'),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export type SignUpInput = z.infer<typeof signUpSchema>;

