import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import type { Control } from 'react-hook-form';
import type { CreateGradeInput, UpdateGradeInput } from '@/lib/validation/grades';

interface GradeDescriptionFieldProps {
  control: Control<CreateGradeInput | UpdateGradeInput>;
  disabled: boolean;
}

export const GradeDescriptionField = ({
  control,
  disabled,
}: GradeDescriptionFieldProps) => (
  <FormField
    control={control}
    name="description"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Описание</FormLabel>
        <FormControl>
          <Textarea
            placeholder="Введите описание группы (необязательно)"
            disabled={disabled}
            rows={3}
            {...field}
            value={field.value || ''}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

