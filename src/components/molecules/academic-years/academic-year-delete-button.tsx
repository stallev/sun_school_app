/**
 * Academic Year Delete Button Component
 * Client Component for deleting an academic year with confirmation dialog
 * Only allows deletion if academic year has no lessons
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
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
import { deleteAcademicYearAction } from '@/actions/academicYears';

interface AcademicYearDeleteButtonProps {
  academicYearId: string;
  academicYearName: string;
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  fullWidth?: boolean;
}

/**
 * Academic year delete button component
 * @param academicYearId - Academic year ID to delete
 * @param academicYearName - Academic year name for display
 * @param variant - Button variant
 * @param size - Button size
 * @param className - Additional CSS classes
 * @param fullWidth - Whether button should take full width
 */
export function AcademicYearDeleteButton({
  academicYearId,
  academicYearName,
  variant = 'destructive',
  size = 'sm',
  className,
  fullWidth = false,
}: AcademicYearDeleteButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsPending(true);
    setError(null);

    try {
      const result = await deleteAcademicYearAction(academicYearId);

      if (result.success) {
        toast.success(result.message || 'Учебный год успешно удален');
        setIsOpen(false);
        router.refresh();
      } else {
        setError(result.error);
        toast.error(result.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={className}
          style={fullWidth ? { width: '100%' } : undefined}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Удалить
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Удалить учебный год</DialogTitle>
          <DialogDescription>
            Вы уверены, что хотите удалить учебный год &quot;{academicYearName}&quot;?
            <br />
            <br />
            <strong>Внимание:</strong> Удаление возможно только если в учебном году нет уроков.
            Это действие нельзя отменить.
          </DialogDescription>
        </DialogHeader>
        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isPending}>
            Отмена
          </Button>
          <Button onClick={handleDelete} disabled={isPending} variant="destructive">
            {isPending ? 'Удаление...' : 'Удалить'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

