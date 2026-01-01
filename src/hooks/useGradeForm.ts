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
import { createGradeAction, updateGradeAction } from '@/actions/grades';
import { toast } from 'sonner';

interface UseGradeFormProps {
  gradeId?: string;
  initialData?: Partial<CreateGradeInput & UpdateGradeInput>;
  onSuccess?: () => void;
}

export const useGradeForm = ({
  gradeId,
  initialData,
  onSuccess,
}: UseGradeFormProps) => {
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
    ...(isEditMode
      ? {
          id: gradeId,
          pupilIds: initialData?.pupilIds || [],
          teacherIds: initialData?.teacherIds || [],
        }
      : {
          teacherIds: initialData?.teacherIds || [],
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

  return {
    form,
    isPending,
    isEditMode,
    onSubmit,
  };
};

