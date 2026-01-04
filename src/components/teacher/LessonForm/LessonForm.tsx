'use client';

import { Form } from '@/components/ui/form';
import { FormProvider, type FieldErrors } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLessonForm } from '@/hooks/useLessonForm';
import { LessonTitleField } from '@/components/molecules/lessons/lesson-title-field';
import { LessonDateField } from '@/components/molecules/lessons/lesson-date-field';
import { LessonContentField } from '@/components/molecules/lessons/lesson-content-field';
import { LessonSubmitButton } from '@/components/molecules/lessons/lesson-submit-button';
import { GoldenVerseSelector } from '@/components/shared/golden-verse-selector';
import type { CreateLessonInput, UpdateLessonInput } from '@/lib/validation/lessons';

interface LessonFormProps {
  mode: 'create' | 'edit';
  gradeId: string;
  lessonId?: string;
  initialData?: {
    title?: string;
    content?: string;
    lessonDate?: string;
    goldenVerseIds?: string[];
  };
  onSuccess?: () => void;
}

export const LessonForm = ({
  mode,
  gradeId,
  lessonId,
  initialData,
  onSuccess,
}: LessonFormProps) => {
  const { form, isPending, isEditMode, onSubmit, yearError } = useLessonForm({
    lessonId,
    gradeId,
    initialData,
    onSuccess,
  });

  if (!lessonId && mode === 'edit') {
    return <div>Lesson ID is required for edit mode</div>;
  }

  // Wrapper для onSubmit с логированием успешной валидации
  const handleSubmit = (data: CreateLessonInput | UpdateLessonInput) => {
    console.log('✅ Валидация прошла успешно');
    console.log('📋 Данные формы:', data);
    onSubmit(data);
  };

  // Обработчик ошибок валидации
  const handleSubmitError = (errors: FieldErrors<CreateLessonInput | UpdateLessonInput>) => {
    console.error('❌ Ошибки валидации формы:');
    console.error('🔴 Объект ошибок:', errors);

    // Детальный вывод ошибок по полям
    Object.keys(errors).forEach((fieldName) => {
      const fieldError = errors[fieldName as keyof (CreateLessonInput | UpdateLessonInput)];
      if (fieldError) {
        const fieldValue = form.getValues(fieldName as keyof (CreateLessonInput | UpdateLessonInput));
        console.error(`  📌 Поле "${fieldName}":`, {
          type: fieldError.type,
          message: fieldError.message,
          value: fieldValue,
        });
      }
    });

    // Вывод всех значений формы для отладки
    console.log('📋 Текущие значения формы:', form.getValues());
    console.log('🔍 Состояние формы:', {
      isValid: form.formState.isValid,
      isDirty: form.formState.isDirty,
      isSubmitting: form.formState.isSubmitting,
      errors: form.formState.errors,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit, handleSubmitError)}
        className="w-full space-y-4 align-start"
      >
        {yearError && (
          <Alert variant="destructive">
            <AlertDescription>{yearError}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Информация об уроке</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <LessonTitleField control={form.control} disabled={isPending} />
            <LessonDateField control={form.control} disabled={isPending} />
            <LessonContentField control={form.control} disabled={isPending} />
            <FormProvider {...form}>
              <GoldenVerseSelector disabled={isPending} />
            </FormProvider>
          </CardContent>
        </Card>

        <LessonSubmitButton
          isPending={isPending}
          isEditMode={isEditMode}
        />
      </form>
    </Form>
  );
};
