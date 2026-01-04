/**
 * Lessons Empty State Component
 * Displays empty state when no lessons are found
 * Mobile-first responsive design
 */

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RoutePath } from '@/lib/routes/RoutePath';

interface LessonsEmptyStateProps {
  gradeId: string;
  academicYearId: string;
}

/**
 * Empty state component for lessons list
 * Shows message and button to create first lesson
 */
export const LessonsEmptyState = ({
  gradeId,
  academicYearId: _academicYearId,
}: LessonsEmptyStateProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Нет уроков</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          Уроки еще не созданы. Создайте первый урок для начала работы.
        </p>
        <Button asChild className="min-h-[44px] w-full sm:w-auto">
          <Link href={`${RoutePath.lessons.new}?gradeId=${gradeId}`}>
            Создать урок
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

