/**
 * Server Actions for LessonFile management
 * Handles file upload, deletion, and URL generation for lesson files
 * 
 * Authorization: TEACHER, ADMIN, SUPERADMIN
 */

'use server';

import { getAuthenticatedUser, checkRole } from '../lib/auth/cognito';
import {
  deleteLessonFileSchema,
} from '../lib/validation/lesson-files';
import { amplifyData } from '../lib/db/amplify';
import { revalidatePath } from 'next/cache';
import { uploadData, remove, getUrl } from 'aws-amplify/storage';
import { randomUUID } from 'crypto';
import { configureAmplify } from '../lib/amplify/config';
import type * as APITypes from '../API';

/**
 * Response type for Server Actions
 */
type ActionResponse<T> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string };

/**
 * Sanitize file name for S3 key
 * Replaces special characters with underscore
 */
function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
}

/**
 * Determine file type from MIME type
 */
function getFileTypeFromMimeType(mimeType: string): 'image' | 'pdf' | 'document' {
  if (mimeType.startsWith('image/')) {
    return 'image';
  }
  if (mimeType === 'application/pdf') {
    return 'pdf';
  }
  if (
    mimeType === 'application/msword' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return 'document';
  }
  throw new Error(`Unsupported MIME type: ${mimeType}`);
}

/**
 * Validate file type and size
 */
function validateFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const allowedPdfTypes = ['application/pdf'];
  const allowedDocumentTypes = [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (file.size > maxSize) {
    return { valid: false, error: 'File size exceeds 10MB limit' };
  }

  if (file.size === 0) {
    return { valid: false, error: 'File is empty' };
  }

  const isAllowed =
    allowedImageTypes.includes(file.type) ||
    allowedPdfTypes.includes(file.type) ||
    allowedDocumentTypes.includes(file.type);

  if (!isAllowed) {
    return {
      valid: false,
      error: 'File type not supported. Allowed: images (jpeg, png, gif, webp), PDF, documents (doc, docx)',
    };
  }

  return { valid: true };
}

/**
 * Check if lesson has reached maximum file limit (10 files)
 */
async function checkFileLimit(lessonId: string): Promise<{ allowed: boolean; count: number }> {
  try {
    const queries = await import('../graphql/queries');
    const { executeGraphQL } = await import('../lib/db/amplify');
    
    const query = (queries as Record<string, string>).lessonFilesByLessonIdAndOrder;
    if (!query) {
      // If query doesn't exist, assume limit not reached
      return { allowed: true, count: 0 };
    }

    const result = await executeGraphQL<{
      lessonFilesByLessonIdAndOrder?: {
        items?: Array<{ id: string }>;
      };
    }>(query, {
      lessonId,
      limit: 10,
    });

    const count = result.data?.lessonFilesByLessonIdAndOrder?.items?.length || 0;
    return { allowed: count < 10, count };
  } catch (error) {
    console.error('Error checking file limit:', error);
    // On error, allow upload (fail open)
    return { allowed: true, count: 0 };
  }
}

/**
 * Upload a file to a lesson
 * Authorization: TEACHER, ADMIN, SUPERADMIN
 * 
 * @param formData - FormData containing file and metadata
 * @returns ActionResponse with created LessonFile
 */
export async function uploadLessonFileAction(
  formData: FormData
): Promise<ActionResponse<APITypes.LessonFile>> {
  try {
    // Ensure Amplify is configured before using storage
    configureAmplify();

    // 1. Check authentication
    const user = await getAuthenticatedUser();
    if (!user) {
      return {
        success: false,
        error: 'Unauthorized: You must be logged in to upload files',
      };
    }

    // 2. Check authorization
    if (!checkRole(user, ['TEACHER', 'ADMIN', 'SUPERADMIN'])) {
      return {
        success: false,
        error: 'Forbidden: Only teachers and administrators can upload files',
      };
    }

    // 3. Extract file and metadata from FormData
    const file = formData.get('file') as File | null;
    const lessonId = formData.get('lessonId') as string | null;
    const description = formData.get('description') as string | null;
    const orderStr = formData.get('order') as string | null;

    if (!file || !lessonId) {
      return {
        success: false,
        error: 'Missing required fields: file and lessonId are required',
      };
    }

    // 4. Validate file
    const fileValidation = validateFile(file);
    if (!fileValidation.valid) {
      return {
        success: false,
        error: fileValidation.error || 'File validation failed',
      };
    }

    // 5. Check file limit
    const limitCheck = await checkFileLimit(lessonId);
    if (!limitCheck.allowed) {
      return {
        success: false,
        error: `Maximum file limit reached (10 files). Current count: ${limitCheck.count}`,
      };
    }

    // 6. Determine file type
    const fileType = getFileTypeFromMimeType(file.type);

    // 7. Generate S3 key (path format for AWS Amplify Storage)
    const uuid = randomUUID();
    const sanitizedFileName = sanitizeFileName(file.name);
    const s3Path = `protected/lessons/${lessonId}/${uuid}_${sanitizedFileName}`;

    // 8. Upload file to S3
    await uploadData({
      path: s3Path,
      data: file,
      options: {
        contentType: file.type,
      },
    }).result;

    // 9. Get S3 URL
    const urlResult = await getUrl({
      path: s3Path,
      options: {
        expiresIn: 3600, // 1 hour
      },
    });

    const s3Url = urlResult.url.toString();

    // 10. Get lesson to obtain gradeId for cache revalidation
    const lesson = await amplifyData.get('Lesson', lessonId) as APITypes.Lesson | null;
    const gradeId = lesson?.gradeId || '';

    // 11. Create LessonFile record
    const order = orderStr ? parseInt(orderStr, 10) : limitCheck.count;
    const lessonFile = await amplifyData.create('LessonFile', {
      input: {
        lessonId,
        fileName: file.name,
        fileType,
        mimeType: file.type,
        fileSize: file.size,
        s3Key: s3Path,
        s3Url,
        order: isNaN(order) ? limitCheck.count : order,
        description: description || null,
      },
    }) as APITypes.LessonFile;

    // 12. Revalidate cache
    revalidatePath(`/lessons/${lessonId}`);
    if (gradeId) {
      revalidatePath(`/grades/${gradeId}`);
    }

    return {
      success: true,
      data: lessonFile,
      message: 'File uploaded successfully',
    };
  } catch (error) {
    console.error('Error uploading lesson file:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to upload file: Unknown error',
    };
  }
}

/**
 * Delete a lesson file
 * Authorization: TEACHER, ADMIN, SUPERADMIN
 * 
 * @param input - File ID
 * @returns ActionResponse with deletion confirmation
 */
export async function deleteLessonFileAction(
  input: unknown
): Promise<ActionResponse<{ id: string }>> {
  try {
    // Ensure Amplify is configured before using storage
    configureAmplify();

    // 1. Validate input
    const validationResult = deleteLessonFileSchema.safeParse(input);
    if (!validationResult.success) {
      return {
        success: false,
        error: `Validation failed: ${validationResult.error.issues.map((e) => e.message).join(', ')}`,
      };
    }

    const { id } = validationResult.data;

    // 2. Check authentication
    const user = await getAuthenticatedUser();
    if (!user) {
      return {
        success: false,
        error: 'Unauthorized: You must be logged in to delete files',
      };
    }

    // 3. Check authorization
    if (!checkRole(user, ['TEACHER', 'ADMIN', 'SUPERADMIN'])) {
      return {
        success: false,
        error: 'Forbidden: Only teachers and administrators can delete files',
      };
    }

    // 4. Get file information
    const lessonFile = await amplifyData.get('LessonFile', id) as APITypes.LessonFile | null;
    if (!lessonFile) {
      return {
        success: false,
        error: 'File not found',
      };
    }

    // 5. Get lesson to obtain gradeId for cache revalidation
    const lesson = await amplifyData.get('Lesson', lessonFile.lessonId) as APITypes.Lesson | null;
    const gradeId = lesson?.gradeId || '';

    // 6. Delete file from S3
    try {
      await remove({
        path: lessonFile.s3Key,
      });
    } catch (error) {
      console.error('Error deleting file from S3:', error);
      // Continue with database deletion even if S3 deletion fails
    }

    // 7. Delete LessonFile record
    await amplifyData.delete('LessonFile', id);

    // 8. Revalidate cache
    revalidatePath(`/lessons/${lessonFile.lessonId}`);
    if (gradeId) {
      revalidatePath(`/grades/${gradeId}`);
    }

    return {
      success: true,
      data: { id },
      message: 'File deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting lesson file:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to delete file: Unknown error',
    };
  }
}

/**
 * Get temporary URL for downloading a lesson file
 * Authorization: TEACHER, ADMIN, SUPERADMIN
 * 
 * @param input - S3 key
 * @returns ActionResponse with temporary URL
 */
export async function getLessonFileUrlAction(
  input: unknown
): Promise<ActionResponse<{ url: string; expiresAt: string }>> {
  try {
    // Ensure Amplify is configured before using storage
    configureAmplify();

    // 1. Validate input
    if (typeof input !== 'string' || !input) {
      return {
        success: false,
        error: 'S3 key is required',
      };
    }

    const s3Key = input;

    // 2. Check authentication
    const user = await getAuthenticatedUser();
    if (!user) {
      return {
        success: false,
        error: 'Unauthorized: You must be logged in to access files',
      };
    }

    // 3. Check authorization
    if (!checkRole(user, ['TEACHER', 'ADMIN', 'SUPERADMIN'])) {
      return {
        success: false,
        error: 'Forbidden: Only teachers and administrators can access files',
      };
    }

    // 4. Get temporary URL
    const urlResult = await getUrl({
      path: s3Key,
      options: {
        expiresIn: 3600, // 1 hour
      },
    });

    return {
      success: true,
      data: {
        url: urlResult.url.toString(),
        expiresAt: urlResult.expiresAt?.toISOString() || new Date(Date.now() + 3600 * 1000).toISOString(),
      },
    };
  } catch (error) {
    console.error('Error getting lesson file URL:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to get file URL: Unknown error',
    };
  }
}

