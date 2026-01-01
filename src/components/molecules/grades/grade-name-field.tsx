import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { Control } from 'react-hook-form';
import type { CreateGradeInput, UpdateGradeInput } from '@/lib/validation/grades';

interface GradeNameFieldProps {
  control: Control<CreateGradeInput | UpdateGradeInput>;
  disabled: boolean;
}

export const GradeNameField = ({ control, disabled }: GradeNameFieldProps) => (
  <FormField
    control={control}
    name="name"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Название группы</FormLabel>
        <FormControl>
          <Input placeholder="Введите название группы" disabled={disabled} {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

