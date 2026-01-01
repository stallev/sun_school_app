'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { deleteLessonFileAction, getLessonFileUrlAction } from '@/actions/lesson-files';
import { formatFileSize, getFileTypeIcon } from '@/lib/utils/fileValidation';
import { toast } from 'sonner';
import { FileText, Download, Trash2, Image, File } from 'lucide-react';
import type { LessonFile } from '@/API';

interface LessonFileItemProps {
  file: LessonFile;
  lessonId: string;
  onDeleteSuccess?: (fileId: string) => void;
  onDeleteError?: (error: string) => void;
  readonly?: boolean;
}

/**
 * Component for displaying a single lesson file item
 * @description Shows file metadata, download/delete actions
 */
export const LessonFileItem = ({
  file,
  onDeleteSuccess,
  onDeleteError,
  readonly = false,
}: LessonFileItemProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDownload = async () => {
    try {
      const result = await getLessonFileUrlAction(file.s3Key);
      if (result.success && result.data) {
        window.open(result.data.url, '_blank');
      } else {
        const error = 'error' in result ? result.error : 'Failed to get file URL';
        toast.error(error);
      }
      } catch {
        toast.error('Failed to download file');
      }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const result = await deleteLessonFileAction({ id: file.id });
      if (result.success) {
        toast.success('File deleted successfully');
        setShowDeleteDialog(false);
        onDeleteSuccess?.(file.id);
      } else {
        const error = result.error || 'Failed to delete file';
        toast.error(error);
        onDeleteError?.(error);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to delete file: Unknown error';
      toast.error(errorMessage);
      onDeleteError?.(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  const getFileIcon = () => {
    const iconName = getFileTypeIcon(file.mimeType);
    if (iconName === 'image') return <Image className="h-5 w-5" aria-hidden="true" />;
    if (iconName === 'file-text') return <FileText className="h-5 w-5" aria-hidden="true" />;
    return <File className="h-5 w-5" aria-hidden="true" />;
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex-shrink-0 text-muted-foreground">{getFileIcon()}</div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate" title={file.fileName}>
              {file.fileName}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {formatFileSize(file.fileSize)}
              </Badge>
              {file.description && (
                <span className="text-xs text-muted-foreground truncate" title={file.description}>
                  {file.description}
                </span>
              )}
            </div>
          </div>
        </div>
        {!readonly && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              aria-label={`Download ${file.fileName}`}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              aria-label={`Delete ${file.fileName}`}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        )}
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete File</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{file.fileName}&quot;? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

