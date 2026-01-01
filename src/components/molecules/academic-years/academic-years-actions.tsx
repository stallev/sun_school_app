/**
 * Academic Years Actions Component
 * Client Component for managing academic years (create, complete)
 * Admin only actions
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, CheckCircle } from 'lucide-react';
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
import {
  createAcademicYearAction,
  completeAllAcademicYearsAction,
} from '@/actions/academicYears';
import { AcademicYearCreateForm } from './academic-year-create-form';
import type { CreateAcademicYearInput } from '@/lib/validation/academicYears';

interface AcademicYearsActionsProps {
  gradeId: string;
}

/**
 * Academic years actions component
 * @param gradeId - Grade ID
 * @param activeYear - Active academic year or null
 */
export function AcademicYearsActions({
  gradeId,
}: AcademicYearsActionsProps) {
  const router = useRouter();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCompleteAllOpen, setIsCompleteAllOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (data: CreateAcademicYearInput) => {
    setIsPending(true);
    setError(null);

    try {
      const result = await createAcademicYearAction(data);

      if (result.success) {
        toast.success(result.message || 'Учебный год успешно создан');
        setIsCreateOpen(false);
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

  const handleCompleteAll = async () => {
    setIsPending(true);
    setError(null);

    try {
      const result = await completeAllAcademicYearsAction();

      if (result.success) {
        toast.success(result.message || 'Все активные учебные годы успешно завершены');
        setIsCompleteAllOpen(false);
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
    <div className="flex flex-wrap gap-2">
      {/* Create new year button */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="h-9">
            <Plus className="mr-2 h-4 w-4" />
            Создать год
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Создать новый учебный год</DialogTitle>
            <DialogDescription>
              Заполните форму для создания нового активного учебного года. Если уже есть активный год, он
              должен быть завершен перед созданием нового.
            </DialogDescription>
          </DialogHeader>
          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <AcademicYearCreateForm
            gradeId={gradeId}
            onSubmit={handleCreate}
            onCancel={() => setIsCreateOpen(false)}
            isPending={isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Complete all active years button */}
      <Dialog open={isCompleteAllOpen} onOpenChange={setIsCompleteAllOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="h-9">
            <CheckCircle className="mr-2 h-4 w-4" />
            Завершить все годы
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Завершить все активные учебные годы</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите завершить все активные учебные годы во всех группах одновременно?
              После завершения создание уроков для этих годов будет заблокировано.
            </DialogDescription>
          </DialogHeader>
          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCompleteAllOpen(false)} disabled={isPending}>
              Отмена
            </Button>
            <Button onClick={handleCompleteAll} disabled={isPending} variant="destructive">
              {isPending ? 'Завершение...' : 'Завершить все'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

