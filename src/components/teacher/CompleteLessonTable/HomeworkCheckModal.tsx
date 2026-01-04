'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { updateHomeworkCheckAction } from '@/actions/homework';
import { updateHomeworkCheckSchema, type UpdateHomeworkCheckInput } from '@/lib/validation/homework';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import type * as APITypes from '@/API';
import type { LessonNestedData } from '@/types/nested-queries';

interface HomeworkCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  homeworkCheck: NonNullable<NonNullable<LessonNestedData['homeworkChecks']>['items'][0]>;
  pupil: APITypes.Pupil;
  lessonId: string;
  gradeSettings: APITypes.GradeSettings;
  goldenVerseLabels: Array<{ order: number; reference: string }>;
  showGoldenVerses: boolean;
  showTest: boolean;
  showNotebook: boolean;
  showSinging: boolean;
}

/**
 * Modal component for full homework check editing
 * Provides complete form with all fields and validation
 */
export const HomeworkCheckModal = ({
  isOpen,
  onClose,
  homeworkCheck,
  pupil,
  lessonId,
  gradeSettings,
  goldenVerseLabels,
  showGoldenVerses,
  showTest,
  showNotebook,
  showSinging,
}: HomeworkCheckModalProps) => {
  const router = useRouter();

  const form = useForm<UpdateHomeworkCheckInput>({
    resolver: zodResolver(updateHomeworkCheckSchema),
    defaultValues: {
      id: homeworkCheck.id,
      goldenVerse1Score: homeworkCheck.goldenVerse1Score ?? undefined,
      goldenVerse2Score: homeworkCheck.goldenVerse2Score ?? undefined,
      goldenVerse3Score: homeworkCheck.goldenVerse3Score ?? undefined,
      testScore: homeworkCheck.testScore ?? undefined,
      notebookScore: homeworkCheck.notebookScore ?? undefined,
      singing: homeworkCheck.singing ?? false,
    },
  });

  // Reset form when modal opens/closes or homeworkCheck changes
  useEffect(() => {
    if (isOpen && homeworkCheck) {
      form.reset({
        id: homeworkCheck?.id ?? '',
        goldenVerse1Score: homeworkCheck?.goldenVerse1Score ?? undefined,
        goldenVerse2Score: homeworkCheck?.goldenVerse2Score ?? undefined,
        goldenVerse3Score: homeworkCheck?.goldenVerse3Score ?? undefined,
        testScore: homeworkCheck?.testScore ?? undefined,
        notebookScore: homeworkCheck?.notebookScore ?? undefined,
        singing: homeworkCheck?.singing ?? false,
      });
    }
  }, [isOpen, homeworkCheck, form]);

  const onSubmit = async (data: UpdateHomeworkCheckInput) => {
    try {
      const result = await updateHomeworkCheckAction(data);

      if (result.success) {
        toast.success('Проверка обновлена');
        onClose();
        router.refresh();
      } else {
        toast.error(result.error || 'Ошибка сохранения');
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Не удалось сохранить изменения'
      );
    }
  };

  const pupilName = `${pupil.lastName || ''} ${pupil.firstName || ''} ${pupil.middleName || ''}`.trim();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>✏️ Редактирование проверки: {pupilName}</DialogTitle>
          <DialogDescription>
            Урок: {lessonId} | Измените оценки и сохраните изменения
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Присутствие */}
            <FormField
              control={form.control}
              name="singing"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Присутствие</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Ученик присутствовал на уроке
                    </p>
                  </div>
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value ?? false}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="h-4 w-4 rounded border-primary text-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Золотые стихи */}
            {showGoldenVerses && goldenVerseLabels.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">📖 Золотые стихи</h3>
                {goldenVerseLabels.map((label) => {
                  const fieldName = `goldenVerse${label.order}Score` as
                    | 'goldenVerse1Score'
                    | 'goldenVerse2Score'
                    | 'goldenVerse3Score';
                  return (
                    <FormField
                      key={label.order}
                      control={form.control}
                      name={fieldName}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {label.reference} (0-2 балла)
                          </FormLabel>
                          <Select
                            value={field.value !== undefined ? String(field.value) : '0'}
                            onValueChange={(value) => field.onChange(parseInt(value, 10))}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите оценку" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="0">0 - не знает</SelectItem>
                              <SelectItem value="1">1 - с подсказкой</SelectItem>
                              <SelectItem value="2">2 - наизусть</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  );
                })}
              </div>
            )}

            {/* Тест */}
            {showTest && (
              <FormField
                control={form.control}
                name="testScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {gradeSettings.labelTest || 'Тест'} (0-10 баллов)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={10}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseInt(e.target.value, 10) : undefined
                          )
                        }
                        placeholder="Введите баллы"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Тетрадь */}
            {showNotebook && (
              <FormField
                control={form.control}
                name="notebookScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {gradeSettings.labelNotebook || 'Тетрадь'} (0-10 баллов)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={10}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseInt(e.target.value, 10) : undefined
                          )
                        }
                        placeholder="Введите баллы"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Спевка */}
            {showSinging && (
              <FormField
                control={form.control}
                name="singing"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        {gradeSettings.labelSinging || 'Спевка'}
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Ученик был на спевке
                      </p>
                    </div>
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value ?? false}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="h-4 w-4 rounded border-primary text-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Отмена
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

