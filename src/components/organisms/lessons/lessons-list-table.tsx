/**
 * Lessons List Table Component
 * Client Component for displaying lessons list with filtering, sorting, and pagination
 * Mobile-first responsive design
 */

'use client';

import { useState, useMemo } from 'react';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RoutePath } from '@/lib/routes/RoutePath';
import { formatDate } from '@/lib/utils/date/format';
import { LessonDeleteButton } from '@/components/molecules/lessons/lesson-delete-button';

type SerializableLesson = {
  id: string;
  academicYearId: string;
  gradeId: string;
  teacherId: string;
  title: string;
  content: string | null;
  lessonDate: string;
  order: number;
  createdAt: string;
  updatedAt: string;
};

interface LessonsListTableProps {
  lessons: SerializableLesson[];
  gradeId: string;
  academicYearId: string;
  canEdit: boolean;
}

const ITEMS_PER_PAGE = 15;

/**
 * Lessons list table component with filtering, sorting, and pagination
 */
export const LessonsListTable = ({
  lessons,
  gradeId: _gradeId,
  academicYearId: _academicYearId,
  canEdit,
}: LessonsListTableProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter and sort lessons
  const filteredAndSortedLessons = useMemo(() => {
    let filtered = lessons;

    // Filter by search query (lesson title)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((lesson) =>
        lesson.title.toLowerCase().includes(query)
      );
    }

    // Sort by date (newest first by default)
    filtered = [...filtered].sort((a, b) => {
      const dateA = new Date(a.lessonDate).getTime();
      const dateB = new Date(b.lessonDate).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [lessons, searchQuery, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedLessons.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedLessons = filteredAndSortedLessons.slice(startIndex, endIndex);

  // Reset to first page when search query changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // Toggle sort order
  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="🔍 Поиск по теме урока..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full max-w-sm"
            aria-label="Поиск по теме урока"
          />
        </div>
        <Button
          variant="outline"
          onClick={handleSortToggle}
          className="min-h-[44px] w-full sm:w-auto"
          aria-label={`Сортировка: ${sortOrder === 'desc' ? 'новые сначала' : 'старые сначала'}`}
        >
          {sortOrder === 'desc' ? '📅 Новые сначала' : '📅 Старые сначала'}
        </Button>
      </div>

      {/* Desktop: Table view */}
      <div className="hidden md:block">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">№</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Тема урока</TableHead>
                <TableHead>Преподаватель</TableHead>
                {canEdit && <TableHead className="w-24">Действия</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedLessons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={canEdit ? 5 : 4} className="text-center text-muted-foreground">
                    {searchQuery ? 'Уроки не найдены' : 'Нет уроков'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedLessons.map((lesson) => (
                  <LessonTableRow
                    key={lesson.id}
                    lesson={lesson}
                    canEdit={canEdit}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile: Card view */}
      <div className="space-y-3 md:hidden">
        {paginatedLessons.length === 0 ? (
          <Card>
            <CardContent className="p-4 text-center text-muted-foreground">
              {searchQuery ? 'Уроки не найдены' : 'Нет уроков'}
            </CardContent>
          </Card>
        ) : (
          paginatedLessons.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} canEdit={canEdit} />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Показано {startIndex + 1}-{Math.min(endIndex, filteredAndSortedLessons.length)} из{' '}
            {filteredAndSortedLessons.length} уроков
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="min-h-[44px]"
            >
              ◄ Назад
            </Button>
            <span className="text-sm text-muted-foreground">
              Страница {currentPage} из {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage >= totalPages}
              className="min-h-[44px]"
            >
              Далее ►
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

interface LessonTableRowProps {
  lesson: SerializableLesson;
  canEdit: boolean;
}

/**
 * Single lesson table row (Desktop)
 */
const LessonTableRow = ({ lesson, canEdit }: LessonTableRowProps) => {
  const lessonUrl = RoutePath.lessons.byId(lesson.id);

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell>
        <Link href={lessonUrl} className="font-medium hover:underline">
          {lesson.order}
        </Link>
      </TableCell>
      <TableCell>
        <Link href={lessonUrl} className="hover:underline">
          {formatDate(lesson.lessonDate)}
        </Link>
      </TableCell>
      <TableCell>
        <Link href={lessonUrl} className="font-medium hover:underline">
          {lesson.title}
        </Link>
      </TableCell>
      <TableCell>
        <Link href={lessonUrl} className="text-sm text-muted-foreground hover:underline">
          {lesson.teacherId ? 'Преподаватель' : '—'}
        </Link>
      </TableCell>
      {canEdit && (
        <TableCell>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Link href={RoutePath.lessons.edit(lesson.id)} aria-label="Редактировать урок">
                ✏️
              </Link>
            </Button>
            <LessonDeleteButton
              lessonId={lesson.id}
              lessonTitle={lesson.title}
              redirectPath={RoutePath.grades.academicYearLessons(lesson.gradeId, lesson.academicYearId)}
            />
          </div>
        </TableCell>
      )}
    </TableRow>
  );
};

interface LessonCardProps {
  lesson: SerializableLesson;
  canEdit: boolean;
}

/**
 * Single lesson card (Mobile)
 */
const LessonCard = ({ lesson, canEdit }: LessonCardProps) => {
  const lessonUrl = RoutePath.lessons.byId(lesson.id);

  return (
    <Card className="transition-colors hover:bg-muted/50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <Link href={lessonUrl} className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Урок #{lesson.order}
              </span>
              <span className="text-sm text-muted-foreground">
                {formatDate(lesson.lessonDate)}
              </span>
            </div>
            <h4 className="mt-1 font-semibold">{lesson.title}</h4>
            <p className="mt-1 text-xs text-muted-foreground">
              Преподаватель: {lesson.teacherId ? 'Преподаватель' : '—'}
            </p>
          </Link>
          {canEdit && (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Link href={RoutePath.lessons.edit(lesson.id)} aria-label="Редактировать урок">
                  ✏️
                </Link>
              </Button>
              <LessonDeleteButton
              lessonId={lesson.id}
              lessonTitle={lesson.title}
              redirectPath={RoutePath.grades.academicYearLessons(lesson.gradeId, lesson.academicYearId)}
            />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

