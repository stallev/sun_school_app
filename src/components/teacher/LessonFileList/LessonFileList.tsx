'use client';

import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { LessonFileItem } from './LessonFileItem';
import type { LessonFile } from '@/API';

interface LessonFileListProps {
  files: LessonFile[];
  lessonId: string;
  onDeleteSuccess?: (fileId: string) => void;
  onDeleteError?: (error: string) => void;
  readonly?: boolean;
  maxFiles?: number;
}

/**
 * Component for displaying a list of lesson files
 * @description Shows sorted list of files with delete/download actions
 */
export const LessonFileList = ({
  files,
  lessonId,
  onDeleteSuccess,
  onDeleteError,
  readonly = false,
  maxFiles = 10,
}: LessonFileListProps) => {
  const sortedFiles = useMemo(() => {
    return [...files].sort((a, b) => a.order - b.order);
  }, [files]);

  if (sortedFiles.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No files attached to this lesson</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Attached Files</h3>
        <Badge variant="secondary">
          {sortedFiles.length} / {maxFiles}
        </Badge>
      </div>
      <div className="space-y-2">
        {sortedFiles.map((file) => (
          <LessonFileItem
            key={file.id}
            file={file}
            lessonId={lessonId}
            onDeleteSuccess={onDeleteSuccess}
            onDeleteError={onDeleteError}
            readonly={readonly}
          />
        ))}
      </div>
    </div>
  );
};

