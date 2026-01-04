'use client';

import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CompleteLessonTableFilters } from './CompleteLessonTableFilters';
import { CompleteLessonTableRow } from './CompleteLessonTableRow';
import { CompleteLessonTableCard } from './CompleteLessonTableCard';
import { calculateHomeworkPoints } from '@/lib/utils/homework';
import type { LessonNestedData } from '@/types/nested-queries';
import type * as APITypes from '@/API';
import Link from 'next/link';

interface CompleteLessonTableProps {
  lesson: LessonNestedData;
  gradeSettings: APITypes.GradeSettings | null;
  lessonId: string;
  allPupils: APITypes.Pupil[];
}

/**
 * Complete lesson table component
 * Displays all homework checks for a lesson in table format
 * Supports filtering, inline editing, and modal editing
 */
export const CompleteLessonTable = ({
  lesson,
  gradeSettings,
  lessonId,
  allPupils,
}: CompleteLessonTableProps) => {
  const [showOnlyPresent, setShowOnlyPresent] = useState(false);
  const [showOnlyUnchecked, setShowOnlyUnchecked] = useState(false);

  // Get homework checks from lesson
  const homeworkChecks = lesson.homeworkChecks?.items?.filter(
    (hc): hc is NonNullable<typeof hc> => hc !== null
  ) || [];

  // Create a map of homework checks by pupilId for quick lookup
  const checksByPupilId = useMemo(() => {
    const map = new Map<string, typeof homeworkChecks[0]>();
    homeworkChecks.forEach((check) => {
      if (check.pupilId) {
        map.set(check.pupilId, check);
      }
    });
    return map;
  }, [homeworkChecks]);

  // Combine all pupils with their homework checks
  const tableData = useMemo(() => {
    return allPupils.map((pupil) => {
      const check = checksByPupilId.get(pupil.id);
      return {
        pupil,
        check,
        isPresent: check ? hasAnyScore(check) : false,
        isChecked: check !== undefined,
      };
    });
  }, [allPupils, checksByPupilId]);

  // Filter data based on filters
  const filteredData = useMemo(() => {
    let filtered = tableData;

    if (showOnlyPresent) {
      filtered = filtered.filter((item) => item.isPresent);
    }

    if (showOnlyUnchecked) {
      filtered = filtered.filter((item) => !item.isChecked);
    }

    return filtered;
  }, [tableData, showOnlyPresent, showOnlyUnchecked]);

  // Determine which columns to show based on grade settings
  const showGoldenVerses = gradeSettings?.enableGoldenVerse ?? true;
  const showTest = gradeSettings?.enableTest ?? true;
  const showNotebook = gradeSettings?.enableNotebook ?? true;
  const showSinging = gradeSettings?.enableSinging ?? true;

  // Get golden verses labels
  const goldenVerseLabels = useMemo(() => {
    if (!showGoldenVerses) return [];
    const verses = lesson.goldenVerses?.items?.filter(
      (gv): gv is NonNullable<typeof gv> => gv !== null
    ) || [];
    return verses
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .slice(0, 3)
      .map((gv, index) => ({
        order: index + 1,
        reference: gv.goldenVerse?.reference || `ЗС${index + 1}`,
      }));
  }, [lesson.goldenVerses, showGoldenVerses]);

  if (!gradeSettings) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">
            Настройки группы не найдены. Обратитесь к администратору.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (filteredData.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {homeworkChecks.length === 0
                ? 'Проверки еще не начаты'
                : 'Нет учеников, соответствующих выбранным фильтрам'}
            </p>
            {homeworkChecks.length === 0 && (
              <Link
                href={`/lessons/${lessonId}/checking-homework`}
                className="text-primary hover:underline"
              >
                Начать проверку
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <CompleteLessonTableFilters
        showOnlyPresent={showOnlyPresent}
        showOnlyUnchecked={showOnlyUnchecked}
        onShowOnlyPresentChange={setShowOnlyPresent}
        onShowOnlyUncheckedChange={setShowOnlyUnchecked}
      />

      {/* Desktop: Table view (≥ 1024px) */}
      <Card className="hidden lg:block">
        <CardHeader>
          <h2 className="text-lg font-semibold">Оценки учеников</h2>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">№</TableHead>
                  <TableHead>Ученик</TableHead>
                  <TableHead className="w-[80px]">При.</TableHead>
                  {showGoldenVerses &&
                    goldenVerseLabels.map((label) => (
                      <TableHead key={label.order} className="w-[80px]">
                        {label.reference}
                      </TableHead>
                    ))}
                  {showTest && (
                    <TableHead className="w-[80px]">
                      {gradeSettings.labelTest || 'Тест'}
                    </TableHead>
                  )}
                  {showNotebook && (
                    <TableHead className="w-[80px]">
                      {gradeSettings.labelNotebook || 'Тетрадь'}
                    </TableHead>
                  )}
                  {showSinging && (
                    <TableHead className="w-[80px]">
                      {gradeSettings.labelSinging || 'Спевка'}
                    </TableHead>
                  )}
                  <TableHead className="w-[80px]">Итого</TableHead>
                  <TableHead className="w-[80px]">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item, index) => (
                  <CompleteLessonTableRow
                    key={item.pupil.id}
                    index={index + 1}
                    pupil={item.pupil}
                    homeworkCheck={item.check}
                    gradeSettings={gradeSettings}
                    lessonId={lessonId}
                    showGoldenVerses={showGoldenVerses}
                    showTest={showTest}
                    showNotebook={showNotebook}
                    showSinging={showSinging}
                    goldenVerseLabels={goldenVerseLabels}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Mobile/Tablet: Card view (< 1024px) */}
      <div className="block lg:hidden space-y-4">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Оценки учеников</h2>
          </CardHeader>
        </Card>
        <div className="space-y-3">
          {filteredData.map((item, index) => (
            <CompleteLessonTableCard
              key={item.pupil.id}
              index={index + 1}
              pupil={item.pupil}
              homeworkCheck={item.check}
              gradeSettings={gradeSettings}
              lessonId={lessonId}
              showGoldenVerses={showGoldenVerses}
              showTest={showTest}
              showNotebook={showNotebook}
              showSinging={showSinging}
              goldenVerseLabels={goldenVerseLabels}
            />
          ))}
        </div>
      </div>

      {/* Legend */}
      <Card>
        <CardHeader>
          <h3 className="text-sm font-semibold">Легенда</h3>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>
              <strong>При.</strong> = Присутствие | <strong>ЗС</strong> = Золотой стих (0-2 балла)
            </p>
            <p>
              <strong>Тест</strong> = Баллы за тест (0-10) | <strong>Тетрадь</strong> = Баллы за
              тетрадь (0-10)
            </p>
            <p>
              <strong>Спевка</strong> = Посещение спевки | <strong>Итого</strong> = авторасчёт по
              формуле
            </p>
            <p>
              ✅ = Да | ❌ = Нет | ⚠️ = Не проверено | - = Нет данных
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

/**
 * Check if homework check has any score (pupil was present)
 */
function hasAnyScore(
  check: NonNullable<LessonNestedData['homeworkChecks']>['items'][0]
): boolean {
  if (!check) return false;
  return (
    (check.goldenVerse1Score ?? 0) > 0 ||
    (check.goldenVerse2Score ?? 0) > 0 ||
    (check.goldenVerse3Score ?? 0) > 0 ||
    (check.testScore ?? 0) > 0 ||
    (check.notebookScore ?? 0) > 0 ||
    check.singing === true
  );
}

