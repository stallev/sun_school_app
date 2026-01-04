import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  createLessonSchema,
  updateLessonSchema,
  type CreateLessonInput,
  type UpdateLessonInput,
} from '@/lib/validation/lessons';
import { createLessonAction, updateLessonAction } from '@/actions/lessons';
import { getActiveAcademicYearAction } from '@/actions/academicYears';
import { getCurrentUser } from '@/actions/auth';
import { toast } from 'sonner';

interface UseLessonFormProps {
  lessonId?: string;
  gradeId: string;
  initialData?: Partial<CreateLessonInput & UpdateLessonInput>;
  onSuccess?: () => void;
}

export const useLessonForm = ({
  lessonId,
  gradeId,
  initialData,
  onSuccess,
}: UseLessonFormProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const isEditMode = !!lessonId;
  const [isLoadingYear, setIsLoadingYear] = useState(false);
  const [yearError, setYearError] = useState<string | null>(null);

  const schema = isEditMode ? updateLessonSchema : createLessonSchema;
  const defaultValues: Partial<CreateLessonInput & UpdateLessonInput> = {
    title: initialData?.title || '',
    content: initialData?.content || '',
    lessonDate: initialData?.lessonDate || new Date().toISOString().split('T')[0],
    order: initialData?.order || 1,
    goldenVerseIds: initialData?.goldenVerseIds || [],
    ...(isEditMode
      ? {
          id: lessonId,
          academicYearId: initialData?.academicYearId,
          gradeId: initialData?.gradeId || gradeId,
          teacherId: initialData?.teacherId,
        }
      : {
          gradeId,
          academicYearId: '',
          teacherId: '',
        }),
  };

  const form = useForm<CreateLessonInput | UpdateLessonInput>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // Load active academic year and teacher ID on mount (for create mode)
  useEffect(() => {
    const loadInitialData = async () => {
      if (isEditMode) {
        // For edit mode, initial data should be provided
        return;
      }

      setIsLoadingYear(true);
      setYearError(null);

      // Load active academic year
      const yearResult = await getActiveAcademicYearAction(gradeId);
      if (yearResult.success && yearResult.data) {
        form.setValue('academicYearId', yearResult.data.id);
        console.log('✅ Academic Year ID установлен:', yearResult.data.id);
      } else {
        const errorMessage =
          (!yearResult.success && 'error' in yearResult
            ? yearResult.error
            : null) ||
          'Активный учебный год не найден. Обратитесь к администратору.';
        setYearError(errorMessage);
        toast.error(errorMessage);
        console.error('❌ Ошибка получения academic year ID');
      }

      // Load current user (teacher ID)
      const userResult = await getCurrentUser();
      if (userResult.success && userResult.data) {
        form.setValue('teacherId', userResult.data.id);
        console.log('✅ Teacher ID установлен:', userResult.data.id);
      } else {
        toast.error('Ошибка получения информации о пользователе');
        console.error('❌ Ошибка получения teacher ID');
      }

      setIsLoadingYear(false);

      // Логирование финального состояния формы после загрузки
      const formValues = form.getValues();
      console.log('📋 Состояние формы после загрузки данных:', {
        academicYearId: formValues.academicYearId,
        teacherId: formValues.teacherId,
        gradeId: formValues.gradeId,
        isValid: form.formState.isValid,
        errors: form.formState.errors,
      });
    };

    loadInitialData();
  }, [gradeId, isEditMode, form]);

  const onSubmit = (data: CreateLessonInput | UpdateLessonInput) => {
    console.log('🚀 Начало отправки формы');
    console.log('📦 Данные для отправки:', data);

    startTransition(async () => {
      try {
        if (isEditMode) {
          // Update lesson
          const result = await updateLessonAction(data as UpdateLessonInput);

          if (result.success) {
            toast.success('Урок успешно обновлен');
            onSuccess?.();
            if (result.data) {
              router.push(`/lessons/${result.data.id}`);
              router.refresh();
            }
          } else {
            toast.error(result.error || 'Произошла ошибка при обновлении урока');
          }
        } else {
          // Create lesson
          const result = await createLessonAction(data as CreateLessonInput);

          if (result.success) {
            toast.success('Урок успешно создан');
            onSuccess?.();
            if (result.data) {
              router.push(`/lessons/${result.data.id}`);
              router.refresh();
            }
          } else {
            toast.error(result.error || 'Произошла ошибка при создании урока');
          }
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
    isPending: isPending || isLoadingYear,
    isEditMode,
    onSubmit,
    yearError,
  };
};

