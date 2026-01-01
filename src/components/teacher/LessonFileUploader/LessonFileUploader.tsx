'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { uploadLessonFileAction } from '@/actions/lesson-files';
import { validateFile } from '@/lib/utils/fileValidation';
import { toast } from 'sonner';
import type { LessonFile } from '@/API';
import { Upload } from 'lucide-react';

interface LessonFileUploaderProps {
  lessonId: string;
  onUploadSuccess?: (file: LessonFile) => void;
  onUploadError?: (error: string) => void;
  disabled?: boolean;
  maxFiles?: number;
  currentFileCount?: number;
}

/**
 * Component for uploading lesson files with drag-and-drop support
 * @description Allows teachers to upload files (images, PDFs, documents) to lessons
 * @example
 * ```tsx
 * <LessonFileUploader
 *   lessonId="lesson-123"
 *   currentFileCount={3}
 *   onUploadSuccess={(file) => console.log('Uploaded:', file)}
 * />
 * ```
 */
export const LessonFileUploader = ({
  lessonId,
  onUploadSuccess,
  onUploadError,
  disabled = false,
  maxFiles = 10,
  currentFileCount = 0,
}: LessonFileUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const handleUpload = useCallback(
    async (file: File) => {
      if (currentFileCount >= maxFiles) {
        const error = `Maximum file limit reached (${maxFiles} files). Current count: ${currentFileCount}`;
        toast.error(error);
        onUploadError?.(error);
        return;
      }

      const validation = validateFile(file);
      if (!validation.valid) {
        toast.error(validation.error || 'File validation failed');
        onUploadError?.(validation.error || 'File validation failed');
        return;
      }

      setUploading(true);
      setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }));

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('lessonId', lessonId);

        const result = await uploadLessonFileAction(formData);

        if (result.success && result.data) {
          toast.success('File uploaded successfully');
          onUploadSuccess?.(result.data);
          setUploadProgress((prev) => {
            const next = { ...prev };
            delete next[file.name];
            return next;
          });
        } else {
          const error = 'error' in result ? result.error : 'Failed to upload file';
          toast.error(error);
          onUploadError?.(error);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to upload file: Unknown error';
        toast.error(errorMessage);
        onUploadError?.(errorMessage);
      } finally {
        setUploading(false);
        setUploadProgress((prev) => {
          const next = { ...prev };
          delete next[file.name];
          return next;
        });
      }
    },
    [lessonId, maxFiles, currentFileCount, onUploadSuccess, onUploadError]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        handleUpload(file);
      });
    },
    [handleUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: disabled || uploading || currentFileCount >= maxFiles,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const isDisabled = disabled || uploading || currentFileCount >= maxFiles;

  return (
    <Card>
      <CardContent className="pt-6">
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-colors
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
            ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50'}
          `}
          aria-label="File upload area"
          role="button"
          tabIndex={isDisabled ? -1 : 0}
        >
          <input {...getInputProps()} aria-label="File input" />
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          {isDragActive ? (
            <p className="text-lg font-medium">Drop files here...</p>
          ) : (
            <>
              <p className="text-lg font-medium mb-2">
                Drag and drop files here, or click to select
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Supported: Images (JPEG, PNG, GIF, WebP), PDF, Documents (DOC, DOCX)
              </p>
              <p className="text-xs text-muted-foreground">
                Max file size: 10MB • Max files: {maxFiles} (Current: {currentFileCount})
              </p>
            </>
          )}
        </div>
        {uploading && (
          <div className="mt-4 space-y-2">
            {Object.entries(uploadProgress).map(([fileName, progress]) => (
              <div key={fileName} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="truncate">{fileName}</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

