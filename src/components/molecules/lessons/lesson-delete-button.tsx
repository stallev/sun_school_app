'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';
import { deleteLessonAction } from '@/actions/lessons';
import { toast } from 'sonner';

interface LessonDeleteButtonProps {
  lessonId: string;
  lessonTitle: string;
  redirectPath: string;
}

/**
 * Lesson Delete Button Component
 * Displays delete button with confirmation dialog
 */
export const LessonDeleteButton = ({
  lessonId,
  lessonTitle,
  redirectPath,
}: LessonDeleteButtonProps) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const result = await deleteLessonAction(lessonId);

      if (result.success) {
        toast.success('Урок успешно удален');
        setOpen(false);
        router.push(redirectPath);
        router.refresh();
      } else {
        toast.error(result.error || 'Не удалось удалить урок');
      }
    } catch (_error) {
      toast.error('Ошибка при удалении урока');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4 mr-2" />
          Удалить
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Удалить урок?</DialogTitle>
          <DialogDescription>
            Вы уверены, что хотите удалить урок &quot;{lessonTitle}&quot;?
            Это действие нельзя отменить. Все связанные проверки домашних заданий также будут удалены.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isDeleting}
          >
            Отмена
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Удаление...' : 'Удалить'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

