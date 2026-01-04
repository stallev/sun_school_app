/**
 * Grade Actions Component
 * Displays action buttons for the grade with icons (Create Lesson, Settings, Schedule, Edit, Delete)
 * Mobile-first responsive design with conditional rendering for Admin
 */

'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Calendar, Pencil, Settings, Trash2, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RoutePath } from '@/lib/routes/RoutePath';
import { deleteGradeAction } from '@/actions/grades';

interface GradeActionsProps {
  gradeId: string;
  isAdmin: boolean;
}

/**
 * Grade actions component
 * @param gradeId - Grade ID for navigation
 * @param isAdmin - Whether current user is Admin (for conditional rendering)
 */
export const GradeActions = ({ gradeId, isAdmin }: GradeActionsProps) => {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await deleteGradeAction({ id: gradeId });
        if (result.success) {
          toast.success('Группа успешно удалена');
          setShowDeleteDialog(false);
          router.push(RoutePath.grades.base);
          router.refresh();
        } else {
          toast.error(result.error || 'Не удалось удалить группу');
        }
      } catch (error) {
        console.error('Error deleting grade:', error);
        toast.error(
          error instanceof Error ? error.message : 'Произошла непредвиденная ошибка'
        );
      }
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold md:text-xl">Действия</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              size="icon"
              className="h-10 w-10"
              variant="default"
              aria-label="Создать урок"
            >
              <Link href={`${RoutePath.lessons.new}?gradeId=${gradeId}`}>
                <Plus className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="icon"
              className="h-10 w-10"
              variant="outline"
              aria-label="Расписание"
            >
              <Link href={RoutePath.grades.schedule.base(gradeId)}>
                <Calendar className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="icon"
              className="h-10 w-10"
              variant="outline"
              aria-label="Учебные годы"
            >
              <Link href={RoutePath.grades.academicYears(gradeId)}>
                <BookOpen className="h-5 w-5" />
              </Link>
            </Button>
            {isAdmin && (
              <>
                <Button
                  asChild
                  size="icon"
                  className="h-10 w-10"
                  variant="outline"
                  aria-label="Редактировать"
                >
                  <Link href={RoutePath.grades.edit(gradeId)}>
                    <Pencil className="h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="icon"
                  className="h-10 w-10"
                  variant="outline"
                  aria-label="Настройки"
                >
                  <Link href={RoutePath.grades.settings(gradeId)}>
                    <Settings className="h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="icon"
                  className="h-10 w-10"
                  variant="outline"
                  aria-label="Удалить"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить группу?</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить группу? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isPending}
            >
              Отмена
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
              {isPending ? 'Удаление...' : 'Удалить'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

