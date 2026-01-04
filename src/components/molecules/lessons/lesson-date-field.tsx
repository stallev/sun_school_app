import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { Control } from 'react-hook-form';
import type { CreateLessonInput, UpdateLessonInput } from '@/lib/validation/lessons';

interface LessonDateFieldProps {
  control: Control<CreateLessonInput | UpdateLessonInput>;
  disabled: boolean;
}

export const LessonDateField = ({ control, disabled }: LessonDateFieldProps) => (
  <FormField
    control={control}
    name="lessonDate"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Дата урока *</FormLabel>
        <FormControl>
          <Input type="date" disabled={disabled} {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

