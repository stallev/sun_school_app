import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { Control } from 'react-hook-form';
import type { CreateLessonInput, UpdateLessonInput } from '@/lib/validation/lessons';

interface LessonTitleFieldProps {
  control: Control<CreateLessonInput | UpdateLessonInput>;
  disabled: boolean;
}

export const LessonTitleField = ({ control, disabled }: LessonTitleFieldProps) => (
  <FormField
    control={control}
    name="title"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Тема урока *</FormLabel>
        <FormControl>
          <Input
            placeholder="Введите тему урока"
            disabled={disabled}
            {...field}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

