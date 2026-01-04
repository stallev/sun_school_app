import { Controller } from 'react-hook-form';
import { FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RichTextEditor } from '@/components/shared/rich-text-editor';
import type { Control, Path } from 'react-hook-form';
import type { CreateLessonInput, UpdateLessonInput } from '@/lib/validation/lessons';

interface LessonContentFieldProps {
  control: Control<CreateLessonInput | UpdateLessonInput>;
  disabled: boolean;
}

export const LessonContentField = ({ control, disabled }: LessonContentFieldProps) => (
  <Controller
    control={control}
    name={'content' as Path<CreateLessonInput | UpdateLessonInput>}
    render={({ field, fieldState }) => (
      <FormItem>
        <FormLabel>Описание урока</FormLabel>
        <RichTextEditor
          value={typeof field.value === 'string' ? field.value : ''}
          onChange={field.onChange}
          onBlur={field.onBlur}
          placeholder="Начните вводить описание урока..."
          className={fieldState.error ? 'border-destructive' : ''}
          disabled={disabled}
        />
        <FormMessage />
      </FormItem>
    )}
  />
);

