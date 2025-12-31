/**
 * Zod validation schemas for LessonFile operations
 * Used in Server Actions for file upload, update, and delete operations
 */

import { z } from 'zod';

// ============================================
// Common schemas
// ============================================

/**
 * File type enum
 */
export const lessonFileTypeSchema = z.enum(['image', 'pdf', 'document']);

/**
 * MIME type validation
 */
const mimeTypeSchema = z.string().min(1).max(100);

/**
 * File size validation (1 byte - 10MB)
 */
const fileSizeSchema = z.number().int().min(1).max(10 * 1024 * 1024); // 10MB max

// ============================================
// Create LessonFile schema
// ============================================

/**
 * Schema for creating a new lesson file
 */
export const createLessonFileSchema = z.object({
  lessonId: z.string().uuid('Lesson ID must be a valid UUID'),
  fileName: z.string().min(1, 'File name is required').max(255, 'File name must be 255 characters or less'),
  fileType: lessonFileTypeSchema,
  mimeType: mimeTypeSchema,
  fileSize: fileSizeSchema,
  s3Key: z.string().min(1, 'S3 key is required'),
  s3Url: z.string().url('S3 URL must be a valid URL'),
  order: z.number().int().min(0, 'Order must be 0 or greater'),
  description: z.string().max(500, 'Description must be 500 characters or less').optional().nullable(),
});

/**
 * Type inferred from createLessonFileSchema
 */
export type CreateLessonFileInput = z.infer<typeof createLessonFileSchema>;

// ============================================
// Update LessonFile schema
// ============================================

/**
 * Schema for updating an existing lesson file
 */
export const updateLessonFileSchema = z.object({
  id: z.string().uuid('File ID must be a valid UUID'),
  fileName: z.string().min(1).max(255).optional(),
  description: z.string().max(500).optional().nullable(),
  order: z.number().int().min(0).optional(),
});

/**
 * Type inferred from updateLessonFileSchema
 */
export type UpdateLessonFileInput = z.infer<typeof updateLessonFileSchema>;

// ============================================
// Delete LessonFile schema
// ============================================

/**
 * Schema for deleting a lesson file
 */
export const deleteLessonFileSchema = z.object({
  id: z.string().uuid('File ID must be a valid UUID'),
});

/**
 * Type inferred from deleteLessonFileSchema
 */
export type DeleteLessonFileInput = z.infer<typeof deleteLessonFileSchema>;

// ============================================
// Upload file validation schema
// ============================================

/**
 * Schema for validating file upload from FormData
 * Used in uploadLessonFileAction
 */
export const uploadFileSchema = z.object({
  lessonId: z.string().uuid('Lesson ID must be a valid UUID'),
  fileName: z.string().min(1).max(255),
  fileType: lessonFileTypeSchema,
  mimeType: mimeTypeSchema,
  fileSize: fileSizeSchema,
  order: z.number().int().min(0),
  description: z.string().max(500).optional().nullable(),
});

/**
 * Type inferred from uploadFileSchema
 */
export type UploadFileInput = z.infer<typeof uploadFileSchema>;

