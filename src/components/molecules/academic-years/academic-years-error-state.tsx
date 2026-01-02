/**
 * Academic Years Error State Component
 * Displays error state when academic years loading fails
 */

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RoutePath } from '@/lib/routes/RoutePath';

interface AcademicYearsErrorStateProps {
  error: string;
  gradeId: string;
}

/**
 * Academic years error state component
 * @param error - Error message to display
 * @param gradeId - Grade ID for navigation
 */
export const AcademicYearsErrorState = ({
  error,
  gradeId,
}: AcademicYearsErrorStateProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ошибка загрузки учебных годов</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-destructive">{error}</p>
        <Button asChild className="mt-4">
          <Link href={RoutePath.grades.byId(gradeId)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Вернуться к группе
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

