import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { Control } from 'react-hook-form';
import type { CreateGradeInput, UpdateGradeInput } from '@/lib/validation/grades';

interface GradeAgeFieldProps {
  control: Control<CreateGradeInput | UpdateGradeInput>;
  name: 'minAge' | 'maxAge';
  label: string;
  placeholder: string;
  disabled: boolean;
}

export const GradeAgeField = ({
  control,
  name,
  label,
  placeholder,
  disabled,
}: GradeAgeFieldProps) => (
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

