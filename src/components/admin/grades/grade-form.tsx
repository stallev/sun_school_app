'use client';

import { Form } from '@/components/ui/form';
import { useGradeForm } from '@/hooks/useGradeForm';
import { GradeNameField } from '@/components/molecules/grades/grade-name-field';
import { GradeDescriptionField } from '@/components/molecules/grades/grade-description-field';
import { GradeAgeField } from '@/components/molecules/grades/grade-age-field';
import { GradeActiveField } from '@/components/molecules/grades/grade-active-field';
import { GradeSubmitButton } from '@/components/molecules/grades/grade-submit-button';
import { PupilSelector } from './pupil-selector';
import { TeacherSelector } from './teacher-selector';
import type { CreateGradeInput, UpdateGradeInput } from '@/lib/validation/grades';

interface GradeFormProps {
  gradeId?: string;
  initialData?: Partial<CreateGradeInput & UpdateGradeInput>;
  onSuccess?: () => void;
}

export const GradeForm = ({ gradeId, initialData, onSuccess }: GradeFormProps) => {
  const { form, isPending, isEditMode, onSubmit } = useGradeForm({
    gradeId,
    initialData,
    onSuccess,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <GradeNameField control={form.control} disabled={isPending} />
        <GradeDescriptionField control={form.control} disabled={isPending} />
        <div className="grid grid-cols-2 gap-4">
          <GradeAgeField
            control={form.control}
            name="minAge"
            label="Минимальный возраст"
            placeholder="0"
            disabled={isPending}
          />
          <GradeAgeField
            control={form.control}
            name="maxAge"
            label="Максимальный возраст"
            placeholder="18"
            disabled={isPending}
          />
        </div>
        <GradeActiveField control={form.control} disabled={isPending} />
        <div className="space-y-2">
          <TeacherSelector disabled={isPending} />
        </div>
        {isEditMode && (
          <div className="space-y-2">
            <PupilSelector disabled={isPending} />
          </div>
        )}
        <GradeSubmitButton isPending={isPending} isEditMode={isEditMode} />
      </form>
    </Form>
  );
};

