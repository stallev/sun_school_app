'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LessonFileUploader } from '../LessonFileUploader';
import { LessonFileList } from '../LessonFileList';
import type { LessonFile } from '@/API';

interface LessonFormProps {
  mode: 'create' | 'edit';
  gradeId: string;
  academicYearId: string;
  lessonId?: string;
  initialFiles?: LessonFile[];
}

/**
 * Form component for creating/editing lessons with file attachments
 * @description Main form component that integrates lesson data and file management
 */
export const LessonForm = ({
  mode,
  lessonId,
  initialFiles = [],
}: LessonFormProps) => {
  const [files, setFiles] = useState<LessonFile[]>(initialFiles);

  useEffect(() => {
    setFiles(initialFiles);
  }, [initialFiles]);

  const handleUploadSuccess = (file: LessonFile) => {
    setFiles((prev) => [...prev, file]);
  };

  const handleDeleteSuccess = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  if (!lessonId && mode === 'edit') {
    return <div>Lesson ID is required for edit mode</div>;
  }

  const currentLessonId = lessonId || 'new';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Lesson Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Lesson form fields will be added here (title, date, content, etc.)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Attached Files</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {lessonId && (
            <LessonFileUploader
              lessonId={lessonId}
              currentFileCount={files.length}
              onUploadSuccess={handleUploadSuccess}
            />
          )}
          <LessonFileList
            files={files}
            lessonId={currentLessonId}
            onDeleteSuccess={handleDeleteSuccess}
            maxFiles={10}
          />
        </CardContent>
      </Card>
    </div>
  );
};

