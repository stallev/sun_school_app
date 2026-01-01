import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { Control } from 'react-hook-form';
import type { CreateGradeInput, UpdateGradeInput } from '@/lib/validation/grades';

interface GradeActiveFieldProps {
  control: Control<CreateGradeInput | UpdateGradeInput>;
  disabled: boolean;
}

export const GradeActiveField = ({ control, disabled }: GradeActiveFieldProps) => (
  <FormField
    control={control}
    name="active"
    render={({ field }) => (
      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <FormLabel className="text-base">Активна</FormLabel>
          <p className="text-sm text-muted-foreground">Группа будет видна в системе</p>
        </div>
        <FormControl>
          <input
            type="checkbox"
            checked={field.value ?? true}
            disabled={disabled}
            onChange={(e) => field.onChange(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
            aria-label="Grade active status"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

