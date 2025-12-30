'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  createGradeSchema,
  updateGradeSchema,
  type CreateGradeInput,
  type UpdateGradeInput,
} from '@/lib/validation/grades';
import { createGradeAction, updateGradeAction } from '../../../../actions/grades';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import type { Control } from 'react-hook-form';
import { PupilSelector } from './pupil-selector';

interface GradeFormProps {
  gradeId?: string;
  initialData?: Partial<CreateGradeInput & UpdateGradeInput>;
  onSuccess?: () => void;
}

interface AgeFieldProps {
  control: Control<CreateGradeInput | UpdateGradeInput>;
  name: 'minAge' | 'maxAge';
  label: string;
  placeholder: string;
  disabled: boolean;
}

const AgeField = ({
  control,
  name,
  label,
  placeholder,
  disabled,
}: AgeFieldProps) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input
            type="number"
            placeholder={placeholder}
            disabled={disabled}
            value={field.value ?? ''}
            onChange={(e) => {
              const value = e.target.value;
              field.onChange(value === '' ? undefined : Number(value));
            }}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export const GradeForm = ({
  gradeId,
  initialData,
  onSuccess,
}: GradeFormProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const isEditMode = !!gradeId;

  const schema = isEditMode ? updateGradeSchema : createGradeSchema;
  const defaultValues: Partial<CreateGradeInput & UpdateGradeInput> = {
    name: initialData?.name || '',
    description: initialData?.description || '',
    minAge: initialData?.minAge,
    maxAge: initialData?.maxAge,
    active: initialData?.active ?? true,
    ...(isEditMode && { 
      id: gradeId,
      pupilIds: initialData?.pupilIds || [],
    }),
  };

  const form = useForm<CreateGradeInput | UpdateGradeInput>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = (data: CreateGradeInput | UpdateGradeInput) => {
    startTransition(async () => {
      try {
        const result = isEditMode
          ? await updateGradeAction(data as UpdateGradeInput)
          : await createGradeAction(data as CreateGradeInput);

        if (result.success) {
          toast.success(
            result.message ||
              (isEditMode
                ? 'Группа успешно обновлена'
                : 'Группа успешно создана')
          );
          onSuccess?.();
          if (!isEditMode && result.data) {
            router.push(`/grades/${result.data.id}`);
            router.refresh();
          } else if (isEditMode) {
            router.refresh();
          }
        } else {
          toast.error(result.error || 'Произошла ошибка');
        }
      } catch (error) {
        console.error('Form submission error:', error);
        toast.error(
          error instanceof Error
            ? error.message
            : 'Произошла непредвиденная ошибка'
        );
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название группы</FormLabel>
              <FormControl>
                <Input
                  placeholder="Введите название группы"
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Введите описание группы (необязательно)"
                  disabled={isPending}
                  rows={3}
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <AgeField
            control={form.control}
            name="minAge"
            label="Минимальный возраст"
            placeholder="0"
            disabled={isPending}
          />
          <AgeField
            control={form.control}
            name="maxAge"
            label="Максимальный возраст"
            placeholder="18"
            disabled={isPending}
          />
        </div>

        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Активна</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Группа будет видна в системе
                </p>
              </div>
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value ?? true}
                  disabled={isPending}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Pupil selector - only in edit mode */}
        {isEditMode && (
          <div className="space-y-2">
            <PupilSelector disabled={isPending} />
          </div>
        )}

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditMode ? 'Сохранение...' : 'Создание...'}
            </>
          ) : (
            isEditMode ? 'Сохранить изменения' : 'Создать группу'
          )}
        </Button>
      </form>
    </Form>
  );
};

