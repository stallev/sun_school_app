'use client';

import { useState, useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { Search, X, User } from 'lucide-react';
import { listPupilsForSelectionAction } from '@/actions/grades';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { UpdateGradeInput } from '@/lib/validation/grades';

interface Pupil {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string | null;
  dateOfBirth: string;
  age?: number;
}

interface PupilSelectorProps {
  disabled?: boolean;
}

/**
 * PupilSelector component
 * Multi-select component for selecting pupils in grade edit form
 * Only shown in edit mode
 */
export const PupilSelector = ({ disabled = false }: PupilSelectorProps) => {
  const { control, watch, setValue } = useFormContext<UpdateGradeInput>();
  const [pupils, setPupils] = useState<Pupil[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const watchedPupilIds = watch('pupilIds');
  const selectedPupilIds = useMemo(() => watchedPupilIds || [], [watchedPupilIds]);

  // Load pupils on mount
  useEffect(() => {
    const loadPupils = async () => {
      setIsLoading(true);
      try {
        const result = await listPupilsForSelectionAction();
        if (result.success && result.data) {
          setPupils(result.data);
        }
      } catch (error) {
        console.error('Error loading pupils:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPupils();
  }, []);

  // Filter pupils by search query
  const filteredPupils = useMemo(() => {
    if (!searchQuery.trim()) {
      return pupils;
    }

    const query = searchQuery.toLowerCase();
    return pupils.filter((pupil) => {
      const fullName = `${pupil.firstName} ${pupil.lastName} ${pupil.middleName || ''}`.toLowerCase();
      return fullName.includes(query);
    });
  }, [pupils, searchQuery]);

  // Get selected pupils
  const selectedPupils = useMemo(() => {
    return pupils.filter((pupil) => selectedPupilIds.includes(pupil.id));
  }, [pupils, selectedPupilIds]);

  // Toggle pupil selection
  const togglePupil = (pupilId: string) => {
    const currentIds = selectedPupilIds;
    if (currentIds.includes(pupilId)) {
      setValue('pupilIds', currentIds.filter((id) => id !== pupilId), {
        shouldValidate: true,
      });
    } else {
      setValue('pupilIds', [...currentIds, pupilId], {
        shouldValidate: true,
      });
    }
  };

  // Remove pupil from selection
  const removePupil = (pupilId: string) => {
    const currentIds = selectedPupilIds;
    setValue(
      'pupilIds',
      currentIds.filter((id) => id !== pupilId),
      {
        shouldValidate: true,
      }
    );
  };

  // Format pupil name with age
  const formatPupilName = (pupil: Pupil): string => {
    const name = `${pupil.firstName} ${pupil.lastName}`;
    const age = pupil.age !== undefined ? ` (${pupil.age} лет)` : '';
    return `${name}${age}`;
  };

  return (
    <FormField
      control={control}
      name="pupilIds"
      render={() => (
        <FormItem>
          <FormLabel>Добавить учеников</FormLabel>
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
                    {isLoading ? 'Загрузка...' : '🔍 Поиск учеников...'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0" align="start">
                  <div className="flex items-center border-b px-3">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <Input
                      placeholder="Поиск по имени или фамилии..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="border-0 focus-visible:ring-0"
                    />
                  </div>
                  <div className="max-h-[300px] overflow-y-auto p-1">
                    {filteredPupils.length === 0 ? (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        {searchQuery ? 'Ученики не найдены' : 'Нет доступных учеников'}
                      </div>
                    ) : (
                      filteredPupils.map((pupil) => {
                        const isSelected = selectedPupilIds.includes(pupil.id);
                        return (
                          <button
                            key={pupil.id}
                            type="button"
                            onClick={() => togglePupil(pupil.id)}
                            className={`w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent ${
                              isSelected ? 'bg-accent' : ''
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span>{formatPupilName(pupil)}</span>
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

              {/* Selected pupils */}
              {selectedPupils.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Выбранные ученики ({selectedPupils.length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedPupils.map((pupil) => (
                      <Badge
                        key={pupil.id}
                        variant="secondary"
                        className="flex items-center gap-1 pr-1"
                      >
                        <User className="h-3 w-3" />
                        <span>{formatPupilName(pupil)}</span>
                        <button
                          type="button"
                          onClick={() => removePupil(pupil.id)}
                          disabled={disabled}
                          className="ml-1 rounded-full hover:bg-destructive/20 focus:outline-none focus:ring-2 focus:ring-ring"
                          aria-label={`Удалить ${formatPupilName(pupil)}`}
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

