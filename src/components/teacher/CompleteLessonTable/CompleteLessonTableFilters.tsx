'use client';

import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CompleteLessonTableFiltersProps {
  showOnlyPresent: boolean;
  showOnlyUnchecked: boolean;
  onShowOnlyPresentChange: (value: boolean) => void;
  onShowOnlyUncheckedChange: (value: boolean) => void;
}

/**
 * Filters component for complete lesson table
 * Allows filtering by presence and check status
 */
export const CompleteLessonTableFilters = ({
  showOnlyPresent,
  showOnlyUnchecked,
  onShowOnlyPresentChange,
  onShowOnlyUncheckedChange,
}: CompleteLessonTableFiltersProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="show-only-present"
              checked={showOnlyPresent}
              onChange={(e) => onShowOnlyPresentChange(e.target.checked)}
              className={cn(
                'h-4 w-4 rounded border-primary text-primary',
                'focus:ring-2 focus:ring-ring focus:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-50'
              )}
            />
            <Label
              htmlFor="show-only-present"
              className="text-sm font-normal cursor-pointer"
            >
              Показать только присутствовавших
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="show-only-unchecked"
              checked={showOnlyUnchecked}
              onChange={(e) => onShowOnlyUncheckedChange(e.target.checked)}
              className={cn(
                'h-4 w-4 rounded border-primary text-primary',
                'focus:ring-2 focus:ring-ring focus:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-50'
              )}
            />
            <Label
              htmlFor="show-only-unchecked"
              className="text-sm font-normal cursor-pointer"
            >
              Показать только непроверенных
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

