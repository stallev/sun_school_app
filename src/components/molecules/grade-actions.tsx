/**
 * Grade Actions Component
 * Displays action buttons for the grade (Create Lesson, Settings, Schedule)
 * Mobile-first responsive design with conditional rendering for Admin
 */

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RoutePath } from '@/lib/routes/RoutePath';

interface GradeActionsProps {
  gradeId: string;
  isAdmin: boolean;
}

/**
 * Grade actions component
 * @param gradeId - Grade ID for navigation
 * @param isAdmin - Whether current user is Admin (for conditional rendering)
 */
export const GradeActions = ({ gradeId, isAdmin }: GradeActionsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold md:text-xl">Действия</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button asChild className="min-h-[44px] flex-1 sm:flex-initial" variant="default">
            <Link href={RoutePath.grades.lessons.new(gradeId)}>Создать урок</Link>
          </Button>
          <Button asChild className="min-h-[44px] flex-1 sm:flex-initial" variant="outline">
            <Link href={RoutePath.grades.schedule(gradeId)}>Расписание</Link>
          </Button>
          {isAdmin && (
            <Button asChild className="min-h-[44px] flex-1 sm:flex-initial" variant="outline">
              <Link href={RoutePath.grades.settings(gradeId)}>Настройки</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

