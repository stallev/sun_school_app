'use client';

import { useState } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { calculateHomeworkPoints } from '@/lib/utils/homework';
import { InlineEditCell } from './InlineEditCell';
import { HomeworkCheckModal } from './HomeworkCheckModal';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import type * as APITypes from '@/API';
import type { LessonNestedData } from '@/types/nested-queries';

interface CompleteLessonTableRowProps {
  index: number;
  pupil: APITypes.Pupil;
  homeworkCheck: NonNullable<LessonNestedData['homeworkChecks']>['items'][0] | undefined;
  gradeSettings: APITypes.GradeSettings;
  lessonId: string;
  showGoldenVerses: boolean;
  showTest: boolean;
  showNotebook: boolean;
  showSinging: boolean;
  goldenVerseLabels: Array<{ order: number; reference: string }>;
}

/**
 * Table row component for complete lesson table
 * Displays pupil data with homework check scores
 * Supports inline editing and modal editing
 */
export const CompleteLessonTableRow = ({
  index,
  pupil,
  homeworkCheck,
  gradeSettings,
  lessonId,
  showGoldenVerses,
  showTest,
  showNotebook,
  showSinging,
  goldenVerseLabels,
}: CompleteLessonTableRowProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check if pupil was present (has any score)
  const isPresent = homeworkCheck
    ? hasAnyScore(homeworkCheck)
    : false;

  // Check if pupil is checked
  const isChecked = homeworkCheck !== undefined;

  // Calculate points
  const points = homeworkCheck
    ? calculateHomeworkPoints(homeworkCheck, gradeSettings)
    : 0;

  // Get pupil full name
  const pupilName = `${pupil.lastName || ''} ${pupil.firstName || ''} ${pupil.middleName || ''}`.trim();

  // Determine row background color
  const rowClassName = cn(
    'transition-colors',
    !isPresent && 'bg-muted/30',
    !isChecked && 'bg-yellow-50 dark:bg-yellow-950/20'
  );

  return (
    <>
      <TableRow className={rowClassName}>
        {/* № */}
        <TableCell className="font-medium">{index}</TableCell>

        {/* Ученик */}
        <TableCell>
          <Link
            href={`/pupil-personal-data/${pupil.id}`}
            className="text-primary hover:underline font-medium"
          >
            {pupilName || 'Без имени'}
          </Link>
        </TableCell>

        {/* Присутствие */}
        <TableCell>
          <InlineEditCell
            type="presence"
            value={isPresent}
            homeworkCheckId={homeworkCheck?.id}
            lessonId={lessonId}
            gradeSettings={gradeSettings}
          />
        </TableCell>

        {/* Золотые стихи */}
        {showGoldenVerses &&
          goldenVerseLabels.map((label) => {
            const scoreKey = `goldenVerse${label.order}Score` as
              | 'goldenVerse1Score'
              | 'goldenVerse2Score'
              | 'goldenVerse3Score';
            const score = homeworkCheck?.[scoreKey] ?? null;
            return (
              <TableCell key={label.order}>
                <InlineEditCell
                  type="goldenVerse"
                  value={score}
                  homeworkCheckId={homeworkCheck?.id}
                  lessonId={lessonId}
                  gradeSettings={gradeSettings}
                  fieldName={scoreKey}
                />
              </TableCell>
            );
          })}

        {/* Тест */}
        {showTest && (
          <TableCell>
            <InlineEditCell
              type="number"
              value={homeworkCheck?.testScore ?? null}
              homeworkCheckId={homeworkCheck?.id}
              lessonId={lessonId}
              gradeSettings={gradeSettings}
              fieldName="testScore"
              min={0}
              max={10}
            />
          </TableCell>
        )}

        {/* Тетрадь */}
        {showNotebook && (
          <TableCell>
            <InlineEditCell
              type="number"
              value={homeworkCheck?.notebookScore ?? null}
              homeworkCheckId={homeworkCheck?.id}
              lessonId={lessonId}
              gradeSettings={gradeSettings}
              fieldName="notebookScore"
              min={0}
              max={10}
            />
          </TableCell>
        )}

        {/* Спевка */}
        {showSinging && (
          <TableCell>
            <InlineEditCell
              type="singing"
              value={homeworkCheck?.singing ?? false}
              homeworkCheckId={homeworkCheck?.id}
              lessonId={lessonId}
              gradeSettings={gradeSettings}
            />
          </TableCell>
        )}

        {/* Итого */}
        <TableCell
          className={cn(
            'font-semibold',
            points >= 8 && 'text-green-600 dark:text-green-400',
            points > 0 && points < 4 && 'text-red-600 dark:text-red-400'
          )}
        >
          {points}
        </TableCell>

        {/* Действия */}
        <TableCell>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            aria-label="Редактировать проверку"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>

      {/* Modal for full editing */}
      {homeworkCheck && (
        <HomeworkCheckModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          homeworkCheck={homeworkCheck}
          pupil={pupil}
          lessonId={lessonId}
          gradeSettings={gradeSettings}
          goldenVerseLabels={goldenVerseLabels}
          showGoldenVerses={showGoldenVerses}
          showTest={showTest}
          showNotebook={showNotebook}
          showSinging={showSinging}
        />
      )}
    </>
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

