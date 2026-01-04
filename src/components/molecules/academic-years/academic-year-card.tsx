/**
 * Academic Year Card Component
 * Displays academic year with lessons, statistics, and actions
 * Mobile-first responsive design
 */

import Link from 'next/link';
import { Plus, Calendar, Settings } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RoutePath } from '@/lib/routes/RoutePath';
import { formatAcademicYearStatus } from '@/lib/utils/grades';
import { formatDateRange } from '@/lib/utils/date';
import { LessonsList } from '@/components/molecules/lessons/lessons-list';
import type { LessonWithStats, AcademicYearWithLessons } from '@/actions/grades';

interface AcademicYearCardProps {
  academicYear: AcademicYearWithLessons['academicYear'];
  lessons: LessonWithStats[];
  gradeId: string;
  pupilsCount: number;
  isAdmin: boolean;
}

/**
 * Academic year card component
 * @param academicYear - Academic year data
 * @param lessons - Array of lessons with statistics
 * @param gradeId - Grade ID for navigation
 * @param pupilsCount - Total number of pupils in the grade
 * @param isAdmin - Whether current user is Admin (for conditional rendering)
 */
export const AcademicYearCard = ({
  academicYear,
  lessons,
  gradeId,
  pupilsCount,
  isAdmin,
}: AcademicYearCardProps) => {
  const status = formatAcademicYearStatus(academicYear.status);
  const isActive = academicYear.status === 'ACTIVE';
  const lessonsCount = lessons.length;

  // Format date range
  const dateRange = formatDateRange(academicYear.startDate, academicYear.endDate);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl font-bold md:text-2xl">
                {academicYear.name}
              </CardTitle>
              <Badge variant={isActive ? 'default' : 'secondary'} className="text-xs">
                {status}
              </Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground md:text-base">{dateRange}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {isActive && (
              <Button
                asChild
                size="icon"
                className="h-10 w-10"
                variant="default"
                aria-label="Создать урок"
              >
                <Link href={`${RoutePath.lessons.new}?gradeId=${gradeId}`}>
                  <Plus className="h-5 w-5" />
                </Link>
              </Button>
            )}
            <Button
              asChild
              size="icon"
              className="h-10 w-10"
              variant="outline"
              aria-label="Расписание"
            >
              <Link href={RoutePath.grades.schedule.base(gradeId)}>
                <Calendar className="h-5 w-5" />
              </Link>
            </Button>
            {isAdmin && (
              <Button
                asChild
                size="icon"
                className="h-10 w-10"
                variant="outline"
                aria-label="Настройки"
              >
                <Link href={RoutePath.grades.settings(gradeId)}>
                  <Settings className="h-5 w-5" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Statistics */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <StatItem label="📖 Уроки" value={lessonsCount} />
          <StatItem label="👥 Учеников" value={pupilsCount} />
          {!isActive && (
            <div className="col-span-2 sm:col-span-1">
              <Button asChild variant="link" className="h-auto p-0 text-sm">
                <Link href={`/grades/${gradeId}/academic-years/${academicYear.id}/lessons`}>
                  📊 Просмотреть архив →
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Lessons List */}
        {lessons.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-4 text-sm font-semibold md:text-base">Уроки:</h3>
            <LessonsList lessons={lessons} />
          </div>
        )}

        {/* Empty state for lessons */}
        {lessons.length === 0 && isActive && (
          <div className="rounded-lg border bg-muted/50 p-4 text-center text-sm text-muted-foreground">
            Нет уроков. Создайте первый урок для начала работы.
          </div>
        )}
      </CardContent>
      {isActive && (
        <CardFooter>
          <Button asChild variant="link" className="w-full">
            <Link href={`/grades/${gradeId}/rating`}>📊 Посмотреть рейтинг группы →</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

interface StatItemProps {
  label: string;
  value: number;
}

/**
 * Single statistic item
 */
const StatItem = ({ label, value }: StatItemProps) => {
  return (
    <div className="flex flex-col">
      <span className="text-2xl font-bold md:text-3xl">{value}</span>
      <span className="text-xs text-muted-foreground md:text-sm">{label}</span>
    </div>
  );
};


