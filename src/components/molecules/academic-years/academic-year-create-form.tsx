/**
 * Academic Year Create Form Component
 * Client Component for creating a new academic year with form fields
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { createAcademicYearSchema } from '@/lib/validation/academicYears';
import type { CreateAcademicYearInput } from '@/lib/validation/academicYears';
import * as APITypes from '@/API';

interface AcademicYearCreateFormProps {
  gradeId: string;
  onSubmit: (data: CreateAcademicYearInput) => Promise<void>;
  onCancel: () => void;
  isPending?: boolean;
}

/**
 * Academic year create form component
 * @param gradeId - Grade ID for the academic year
 * @param onSubmit - Callback when form is submitted
 * @param onCancel - Callback when form is cancelled
 * @param isPending - Whether form submission is in progress
 */
export function AcademicYearCreateForm({
  gradeId,
  onSubmit,
  onCancel,
  isPending = false,
}: AcademicYearCreateFormProps) {
  // Get current year for default values
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const defaultStartDate = new Date(currentYear, 8, 1); // September 1
  const defaultEndDate = new Date(nextYear, 4, 31); // May 31

  const form = useForm<CreateAcademicYearInput>({
    resolver: zodResolver(createAcademicYearSchema),
    defaultValues: {
      gradeId,
      name: `${currentYear}-${nextYear}`,
      startDate: format(defaultStartDate, 'yyyy-MM-dd'),
      endDate: format(defaultEndDate, 'yyyy-MM-dd'),
      status: APITypes.AcademicYearStatus.ACTIVE,
    },
  });

  const handleSubmit = async (data: CreateAcademicYearInput) => {
    await onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Name field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название учебного года</FormLabel>
              <FormControl>
                <Input
                  placeholder="Например: 2024-2025"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormDescription>
                Введите название учебного года (например, 2024-2025)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Start date field */}
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Дата начала</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                      disabled={isPending}
                    >
                      {field.value ? (
                        format(new Date(field.value), 'PPP', { locale: ru })
                      ) : (
                        <span>Выберите дату начала</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        field.onChange(format(date, 'yyyy-MM-dd'));
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>Выберите дату начала учебного года</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* End date field */}
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Дата окончания</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                      disabled={isPending}
                    >
                      {field.value ? (
                        format(new Date(field.value), 'PPP', { locale: ru })
                      ) : (
                        <span>Выберите дату окончания</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        field.onChange(format(date, 'yyyy-MM-dd'));
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>Выберите дату окончания учебного года</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Hidden status field */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <Input type="hidden" {...field} value={field.value} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Hidden gradeId field */}
        <FormField
          control={form.control}
          name="gradeId"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <Input type="hidden" {...field} value={field.value} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Form actions */}
        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
          >
            Отмена
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Создание...' : 'Создать'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

