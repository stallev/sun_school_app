/**
 * Academic Year Complete Button Component
 * Client Component for completing an active academic year with confirmation dialog
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CheckCircle2 } from 'lucide-react';
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
import { completeAcademicYearAction } from '@/actions/academicYears';

interface AcademicYearCompleteButtonProps {
  gradeId: string;
  academicYearId: string;
  academicYearName: string;
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  fullWidth?: boolean;
}

/**
 * Academic year complete button component
 * @param gradeId - Grade ID for the academic year
 * @param academicYearId - Academic year ID to complete
 * @param academicYearName - Academic year name for display
 * @param variant - Button variant
 * @param size - Button size
 * @param className - Additional CSS classes
 * @param fullWidth - Whether button should take full width
 */
export function AcademicYearCompleteButton({
  gradeId,
  academicYearId: _academicYearId,
  academicYearName,
  variant = 'outline',
  size = 'sm',
  className,
  fullWidth = false,
}: AcademicYearCompleteButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleComplete = async () => {
    setIsPending(true);
    setError(null);

    try {
      const result = await completeAcademicYearAction(gradeId);

      if (result.success) {
        toast.success(result.message || 'Учебный год успешно завершен');
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
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Завершить год
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Завершить учебный год</DialogTitle>
          <DialogDescription>
            Вы уверены, что хотите завершить учебный год &quot;{academicYearName}&quot;? После
            завершения создание уроков для этого года будет заблокировано.
          </DialogDescription>
        </DialogHeader>
        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isPending}>
            Отмена
          </Button>
          <Button onClick={handleComplete} disabled={isPending} variant="destructive">
            {isPending ? 'Завершение...' : 'Завершить'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

