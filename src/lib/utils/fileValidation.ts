/**
 * File validation utilities for lesson file uploads
 */

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_PDF_TYPES = ['application/pdf'];
const ALLOWED_DOCUMENT_TYPES = [
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const ALLOWED_MIME_TYPES = [
  ...ALLOWED_IMAGE_TYPES,
  ...ALLOWED_PDF_TYPES,
  ...ALLOWED_DOCUMENT_TYPES,
];

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate file type and size
 * @param file - File to validate
 * @returns Validation result with error message if invalid
 */
export const validateFile = (file: File): FileValidationResult => {
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: 'File size exceeds 10MB limit',
    };
  }

  if (file.size === 0) {
    return {
      valid: false,
      error: 'File is empty',
    };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error:
        'File type not supported. Allowed: images (jpeg, png, gif, webp), PDF, documents (doc, docx)',
    };
  }

  return { valid: true };
};

/**
 * Format file size for display
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "1.5 MB", "500 KB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  const sizeValue = Math.round((bytes / Math.pow(k, i)) * 100) / 100;
  return `${sizeValue} ${sizes[i]}`;
};

/**
 * Get file type icon name based on MIME type
 * @param mimeType - MIME type of the file
 * @returns Icon name for the file type
 */
export const getFileTypeIcon = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) {
    return 'image';
  }
  if (mimeType === 'application/pdf') {
    return 'file-text';
  }
  if (
    mimeType === 'application/msword' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return 'file-text';
  }
  return 'file';
};

