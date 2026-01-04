'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { Search, X, BookOpen } from 'lucide-react';
import { listGoldenVersesForSelectionAction } from '@/actions/golden-verses';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { CreateLessonInput, UpdateLessonInput } from '@/lib/validation/lessons';

interface GoldenVerse {
  id: string;
  reference: string;
  text: string;
  bookId: string;
  chapter: number;
  verseStart: number;
  verseEnd?: number | null;
}

interface GoldenVerseSelectorProps {
  disabled?: boolean;
}

/**
 * GoldenVerseSelector component
 * Multi-select component for selecting golden verses in lesson form
 * Follows the same pattern as TeacherSelector for consistency
 */
export const GoldenVerseSelector = ({ disabled = false }: GoldenVerseSelectorProps) => {
  const { control, watch, setValue } = useFormContext<CreateLessonInput | UpdateLessonInput>();
  const [verses, setVerses] = useState<GoldenVerse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const watchedVerseIds = watch('goldenVerseIds');
  const selectedVerseIds = useMemo(
    () => (Array.isArray(watchedVerseIds) ? watchedVerseIds : []),
    [watchedVerseIds]
  );

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load golden verses on mount
  useEffect(() => {
    const loadVerses = async () => {
      setIsLoading(true);
      try {
        const result = await listGoldenVersesForSelectionAction();
        if (result.success && result.data) {
          setVerses(result.data);
        }
      } catch (error) {
        console.error('Error loading golden verses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadVerses();
  }, []);

  // Filter verses by search query (search in text and reference)
  const filteredVerses = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return verses;
    }

    const query = debouncedSearchQuery.toLowerCase();
    return verses.filter((verse) => {
      const text = verse.text.toLowerCase();
      const reference = verse.reference.toLowerCase();
      return text.includes(query) || reference.includes(query);
    });
  }, [verses, debouncedSearchQuery]);

  // Get selected verses
  const selectedVerses = useMemo(() => {
    return verses.filter((verse) => selectedVerseIds.includes(verse.id));
  }, [verses, selectedVerseIds]);

  // Toggle verse selection
  const toggleVerse = useCallback(
    (verseId: string) => {
      const currentIds = selectedVerseIds;
      const isSelected = currentIds.includes(verseId);
      
      if (isSelected) {
        const newIds = currentIds.filter((id) => id !== verseId);
        setValue('goldenVerseIds', newIds, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: false,
        });
      } else {
        setValue('goldenVerseIds', [...currentIds, verseId], {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: false,
        });
      }
    },
    [selectedVerseIds, setValue]
  );

  // Remove verse from selection
  const removeVerse = useCallback(
    (verseId: string) => {
      const currentIds = selectedVerseIds;
      if (!currentIds.includes(verseId)) {
        return; // Already removed, no need to update
      }
      
      const newIds = currentIds.filter((id) => id !== verseId);
      setValue('goldenVerseIds', newIds, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: false,
      });
    },
    [selectedVerseIds, setValue]
  );

  return (
    <FormField
      control={control}
      name="goldenVerseIds"
      render={() => (
        <FormItem>
          <FormLabel>Золотые стихи * (минимум 1)</FormLabel>
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
                    {isLoading ? 'Загрузка...' : '🔍 Поиск стиха...'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[500px] p-0" align="start">
                  <div className="flex items-center border-b px-3">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <Input
                      placeholder="Поиск по тексту или ссылке стиха..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="border-0 focus-visible:ring-0"
                    />
                  </div>
                  <div className="max-h-[300px] overflow-y-auto p-1">
                    {filteredVerses.length === 0 ? (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        {debouncedSearchQuery
                          ? 'Стихи не найдены'
                          : 'Нет доступных золотых стихов'}
                      </div>
                    ) : (
                      filteredVerses.map((verse) => {
                        const isSelected = selectedVerseIds.includes(verse.id);
                        return (
                          <button
                            key={verse.id}
                            type="button"
                            onClick={() => toggleVerse(verse.id)}
                            className={`w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent ${
                              isSelected ? 'bg-accent' : ''
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <BookOpen className="h-4 w-4 mt-0.5 shrink-0" />
                              <div className="flex flex-col flex-1 min-w-0">
                                <span className="font-medium">{verse.reference}</span>
                                <span className="text-xs text-muted-foreground line-clamp-2">
                                  {verse.text}
                                </span>
                              </div>
                              {isSelected && (
                                <span className="ml-auto text-xs text-muted-foreground shrink-0">
                                  ✓
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Selected verses */}
              {selectedVerses.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Выбранные стихи ({selectedVerses.length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedVerses.map((verse) => (
                      <Badge
                        key={verse.id}
                        variant="secondary"
                        className="flex items-center gap-1 pr-1 max-w-full"
                      >
                        <BookOpen className="h-3 w-3 shrink-0" />
                        <span className="truncate">{verse.reference}</span>
                        <button
                          type="button"
                          onClick={() => removeVerse(verse.id)}
                          disabled={disabled}
                          className="ml-1 rounded-full hover:bg-destructive/20 focus:outline-none focus:ring-2 focus:ring-ring shrink-0"
                          aria-label={`Удалить ${verse.reference}`}
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
