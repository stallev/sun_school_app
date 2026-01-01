/**
 * Academic Year Activate Handler Component
 * Client Component for handling academic year activation via query parameter
 * Shows confirmation dialog when ?activate=yearId is present in URL
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { activateAcademicYearAction } from '@/actions/academicYears';
import * as APITypes from '@/API';

interface AcademicYearActivateHandlerProps {
  academicYears: Array<{
    id: string;
    name: string;
    status: APITypes.AcademicYearStatus;
  }>;
}

/**
 * Academic year activate handler component
 * @param academicYears - Array of academic years to find the one to activate
 */
export function AcademicYearActivateHandler({
  academicYears,
}: AcademicYearActivateHandlerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [academicYearToActivate, setAcademicYearToActivate] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    const activateId = searchParams.get('activate');
    if (activateId) {
      const year = academicYears.find((y) => y.id === activateId);
      if (year && year.status === APITypes.AcademicYearStatus.FINISHED) {
        setAcademicYearToActivate({ id: year.id, name: year.name });
        setIsOpen(true);
      }
    }
  }, [searchParams, academicYears]);

  const handleActivate = async () => {
    if (!academicYearToActivate) return;

    setIsPending(true);
    setError(null);

    try {
      const result = await activateAcademicYearAction(academicYearToActivate.id);

      if (result.success) {
        toast.success(result.message || 'Учебный год успешно активирован');
        setIsOpen(false);
        // Remove query parameter and refresh
        router.replace(window.location.pathname);
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

  const handleCancel = () => {
    setIsOpen(false);
    setError(null);
    setAcademicYearToActivate(null);
    // Remove query parameter
    const url = new URL(window.location.href);
    url.searchParams.delete('activate');
    router.replace(url.pathname + url.search);
  };

  if (!academicYearToActivate) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) {
        handleCancel();
      }
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Активировать учебный год</DialogTitle>
          <DialogDescription>
            Вы уверены, что хотите активировать учебный год &quot;
            {academicYearToActivate.name}&quot;? Убедитесь, что в группе нет другого активного
            года.
          </DialogDescription>
        </DialogHeader>
        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isPending}>
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

