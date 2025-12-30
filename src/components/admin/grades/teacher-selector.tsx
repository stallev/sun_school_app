'use client';

import { useState, useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { Search, X, User } from 'lucide-react';
import { useAppStore } from '@/providers/store-provider';
import { useShallow } from 'zustand/react/shallow';
import { listTeachersForSelectionAction } from '@/actions/grades';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { CreateGradeInput, UpdateGradeInput } from '@/lib/validation/grades';

interface TeacherSelectorProps {
  disabled?: boolean;
}

/**
 * TeacherSelector component
 * Multi-select component for selecting teachers in grade form
 * Loads data from Zustand store (with fallback to Server Action if needed)
 */
export const TeacherSelector = ({ disabled = false }: TeacherSelectorProps) => {
  const { control, watch, setValue } = useFormContext<CreateGradeInput | UpdateGradeInput>();
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Get teachers from Zustand store
  const storeTeachers = useAppStore(
    useShallow((state) => ({
      teachers: state?.teachers ?? [],
      loading: state?.loading ?? false,
      isStale: state?.isTeachersDataStale() ?? true,
    }))
  );
  const fetchTeachers = useAppStore((state) => state?.fetchTeachers);

  const [teachers, setTeachers] = useState<Array<{ id: string; name: string; email: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sync teachers from store to local state
  useEffect(() => {
    if (storeTeachers && storeTeachers.teachers.length > 0) {
      setTeachers(storeTeachers.teachers);
      setIsLoading(storeTeachers.loading);
    }
  }, [storeTeachers?.teachers, storeTeachers?.loading]);

  // Load teachers from store or Server Action on mount
  useEffect(() => {
    const loadTeachers = async () => {
      // Wait for hydration
      if (!storeTeachers) {
        return;
      }

      setIsLoading(true);
      try {
        // Try to use store data if available and fresh
        if (!storeTeachers.isStale && storeTeachers.teachers.length > 0) {
          setTeachers(storeTeachers.teachers);
          setIsLoading(false);
          return;
        }

        // If store is stale or empty, try to fetch
        if (fetchTeachers) {
          await fetchTeachers();
        } else {
          // Fallback to Server Action
          await loadFromServer();
        }
      } catch (error) {
        console.error('Error loading teachers:', error);
        // Fallback to Server Action
        await loadFromServer();
      }
    };

    const loadFromServer = async () => {
      try {
        const result = await listTeachersForSelectionAction();
        if (result.success && result.data) {
          setTeachers(result.data);
        }
      } catch (error) {
        console.error('Error loading teachers from server:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTeachers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const watchedTeacherIds = watch('teacherIds');
  const selectedTeacherIds = useMemo(() => watchedTeacherIds || [], [watchedTeacherIds]);

  // Filter teachers by search query
  const filteredTeachers = useMemo(() => {
    if (!searchQuery.trim()) {
      return teachers;
    }

    const query = searchQuery.toLowerCase();
    return teachers.filter((teacher) => {
      const name = teacher.name.toLowerCase();
      const email = teacher.email.toLowerCase();
      return name.includes(query) || email.includes(query);
    });
  }, [teachers, searchQuery]);

  // Get selected teachers
  const selectedTeachers = useMemo(() => {
    return teachers.filter((teacher) => selectedTeacherIds.includes(teacher.id));
  }, [teachers, selectedTeacherIds]);

  // Toggle teacher selection
  const toggleTeacher = (teacherId: string) => {
    const currentIds = selectedTeacherIds;
    if (currentIds.includes(teacherId)) {
      setValue('teacherIds', currentIds.filter((id) => id !== teacherId), {
        shouldValidate: true,
      });
    } else {
      setValue('teacherIds', [...currentIds, teacherId], {
        shouldValidate: true,
      });
    }
  };

  // Remove teacher from selection
  const removeTeacher = (teacherId: string) => {
    const currentIds = selectedTeacherIds;
    setValue(
      'teacherIds',
      currentIds.filter((id) => id !== teacherId),
      {
        shouldValidate: true,
      }
    );
  };

  return (
    <FormField
      control={control}
      name="teacherIds"
      render={() => (
        <FormItem>
          <FormLabel>Назначить преподавателей *</FormLabel>
          <FormControl>
            <div className="space-y-4">
              {/* Search input with popover */}
              <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    disabled={disabled || isLoading}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    {isLoading ? 'Загрузка...' : '🔍 Поиск преподавателей...'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0" align="start">
                  <div className="flex items-center border-b px-3">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <Input
                      placeholder="Поиск по имени или email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="border-0 focus-visible:ring-0"
                    />
                  </div>
                  <div className="max-h-[300px] overflow-y-auto p-1">
                    {filteredTeachers.length === 0 ? (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        {searchQuery ? 'Преподаватели не найдены' : 'Нет доступных преподавателей'}
                      </div>
                    ) : (
                      filteredTeachers.map((teacher) => {
                        const isSelected = selectedTeacherIds.includes(teacher.id);
                        return (
                          <button
                            key={teacher.id}
                            type="button"
                            onClick={() => toggleTeacher(teacher.id)}
                            className={`w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent ${
                              isSelected ? 'bg-accent' : ''
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <div className="flex flex-col">
                                <span>{teacher.name}</span>
                                <span className="text-xs text-muted-foreground">{teacher.email}</span>
                              </div>
                              {isSelected && (
                                <span className="ml-auto text-xs text-muted-foreground">✓</span>
                              )}
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Selected teachers */}
              {selectedTeachers.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Выбранные преподаватели ({selectedTeachers.length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTeachers.map((teacher) => (
                      <Badge
                        key={teacher.id}
                        variant="secondary"
                        className="flex items-center gap-1 pr-1"
                      >
                        <User className="h-3 w-3" />
                        <span>{teacher.name}</span>
                        <button
                          type="button"
                          onClick={() => removeTeacher(teacher.id)}
                          disabled={disabled}
                          className="ml-1 rounded-full hover:bg-destructive/20 focus:outline-none focus:ring-2 focus:ring-ring"
                          aria-label={`Удалить ${teacher.name}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

