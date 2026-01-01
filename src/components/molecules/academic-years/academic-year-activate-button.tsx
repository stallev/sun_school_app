/**
 * Academic Year Activate Button Component
 * Client Component for activating a finished academic year with confirmation dialog
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
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
import { activateAcademicYearAction } from '@/actions/academicYears';

interface AcademicYearActivateButtonProps {
  academicYearId: string;
  academicYearName: string;
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  fullWidth?: boolean;
}

/**
 * Academic year activate button component
 * @param academicYearId - Academic year ID to activate
 * @param academicYearName - Academic year name for display
 * @param variant - Button variant
 * @param size - Button size
 * @param className - Additional CSS classes
 * @param fullWidth - Whether button should take full width
 */
export function AcademicYearActivateButton({
  academicYearId,
  academicYearName,
  variant = 'outline',
  size = 'sm',
  className,
  fullWidth = false,
}: AcademicYearActivateButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleActivate = async () => {
    setIsPending(true);
    setError(null);

    try {
      const result = await activateAcademicYearAction(academicYearId);

      if (result.success) {
        toast.success(result.message || 'Учебный год успешно активирован');
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
        <Button variant={variant} size={size} className={className} style={fullWidth ? { width: '100%' } : undefined}>
          Активировать
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Активировать учебный год</DialogTitle>
          <DialogDescription>
            Вы уверены, что хотите активировать учебный год &quot;{academicYearName}&quot;? Убедитесь,
            что в группе нет другого активного года.
          </DialogDescription>
        </DialogHeader>
        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isPending}>
            Отмена
          </Button>
          <Button onClick={handleActivate} disabled={isPending}>
            {isPending ? 'Активация...' : 'Активировать'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

