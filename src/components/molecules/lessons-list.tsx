/**
 * Lessons List Component
 * Displays list of lessons in table (Desktop) or cards (Mobile)
 * Mobile-first responsive design
 */

import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { LessonWithStats } from '../../../actions/grades';

interface LessonsListProps {
  lessons: LessonWithStats[];
}

/**
 * Lessons list component
 * @param lessons - Array of lessons with statistics
 */
export const LessonsList = ({ lessons }: LessonsListProps) => {
  if (lessons.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-4 text-center text-sm text-muted-foreground md:p-6">
        Нет уроков. Создайте первый урок для начала работы.
      </div>
    );
  }

  return (
    <>
      {/* Desktop: Table view */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">№</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead>Тема урока</TableHead>
              <TableHead>Золотые стихи</TableHead>
              <TableHead className="w-24">ДЗ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lessons.map((lessonData: LessonWithStats) => (
              <LessonTableRow
                key={lessonData.lesson.id}
                lessonData={lessonData}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile: Card view */}
      <div className="space-y-3 md:hidden">
        {lessons.map((lessonData: LessonWithStats) => (
          <LessonCard
            key={lessonData.lesson.id}
            lessonData={lessonData}
          />
        ))}
      </div>
    </>
  );
};

interface LessonTableRowProps {
  lessonData: LessonWithStats;
}

/**
 * Single lesson table row (Desktop)
 */
const LessonTableRow = ({ lessonData }: LessonTableRowProps) => {
  const { lesson, homeworkStats, goldenVerses } = lessonData;
  const lessonUrl = `/lessons/${lesson.id}`; // TODO: Add to RoutePath when lesson routes are defined

  // Format golden verses references
  const goldenVersesText =
    goldenVerses.length > 0
      ? goldenVerses.map((gv: { reference: string }) => gv.reference).join(', ')
      : '—';

  // Format homework check status
  const homeworkStatus = formatHomeworkStatus(homeworkStats);

  return (
    <TableRow className="cursor-pointer hover:bg-muted/50">
      <TableCell>
        <Link href={lessonUrl} className="font-medium">
          {lesson.order}
        </Link>
      </TableCell>
      <TableCell>
        <Link href={lessonUrl}>{formatDate(lesson.lessonDate)}</Link>
      </TableCell>
      <TableCell>
        <Link href={lessonUrl} className="font-medium">
          {lesson.title}
        </Link>
      </TableCell>
      <TableCell>
        <Link href={lessonUrl} className="text-sm text-muted-foreground">
          {goldenVersesText}
        </Link>
      </TableCell>
      <TableCell>
        <Link href={lessonUrl}>{homeworkStatus}</Link>
      </TableCell>
    </TableRow>
  );
};

interface LessonCardProps {
  lessonData: LessonWithStats;
}

/**
 * Single lesson card (Mobile)
 */
const LessonCard = ({ lessonData }: LessonCardProps) => {
  const { lesson, homeworkStats, goldenVerses } = lessonData;
  const lessonUrl = `/lessons/${lesson.id}`; // TODO: Add to RoutePath when lesson routes are defined

  // Format golden verses references
  const goldenVersesText =
    goldenVerses.length > 0
      ? goldenVerses.map((gv: { reference: string }) => gv.reference).join(', ')
      : '—';

  // Format homework check status
  const homeworkStatus = formatHomeworkStatus(homeworkStats);

  return (
    <Link href={lessonUrl}>
      <Card className="transition-colors hover:bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Урок #{lesson.order}
                </span>
                <span className="text-sm text-muted-foreground">
                  {formatDate(lesson.lessonDate)}
                </span>
              </div>
              <h4 className="mt-1 font-semibold">{lesson.title}</h4>
              {goldenVersesText !== '—' && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Золотые стихи: {goldenVersesText}
                </p>
              )}
            </div>
            <div className="flex-shrink-0">{homeworkStatus}</div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

/**
 * Format homework check status
 */
function formatHomeworkStatus(stats: {
  total: number;
  checked: number;
  percentage: number;
}): React.ReactNode {
  if (stats.checked === 0) {
    return (
      <Badge variant="outline" className="text-xs">
        ⏳ {stats.checked}/{stats.total}
      </Badge>
    );
  }

  if (stats.checked === stats.total) {
    return (
      <Badge variant="default" className="text-xs">
        ✅ {stats.checked}/{stats.total}
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="text-xs">
      {stats.checked}/{stats.total}
    </Badge>
  );
}

/**
 * Format date for display
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

