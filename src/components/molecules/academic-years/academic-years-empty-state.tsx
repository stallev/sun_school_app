/**
 * Academic Years Empty State Component
 * Displays empty state when no academic years exist
 */

import { Card, CardContent } from '@/components/ui/card';

/**
 * Academic years empty state component
 */
export const AcademicYearsEmptyState = () => {
  return (
    <Card>
      <CardContent className="p-6 text-center text-muted-foreground">
        <p className="text-sm md:text-base">
          Нет учебных годов. Создайте первый учебный год для начала работы.
        </p>
      </CardContent>
    </Card>
  );
};

