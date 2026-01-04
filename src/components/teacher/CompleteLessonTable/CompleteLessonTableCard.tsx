'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { calculateHomeworkPoints } from '@/lib/utils/homework';
import { InlineEditCell } from './InlineEditCell';
import { HomeworkCheckModal } from './HomeworkCheckModal';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import type * as APITypes from '@/API';
import type { LessonNestedData } from '@/types/nested-queries';

interface CompleteLessonTableCardProps {
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
 * Card component for complete lesson table (mobile/tablet view)
 * Displays pupil data with homework check scores in card format
 * Supports inline editing and modal editing
 */
export const CompleteLessonTableCard = ({
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
}: CompleteLessonTableCardProps) => {
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

  // Determine card background color
  const cardClassName = cn(
    'transition-colors',
    !isPresent && 'bg-muted/30',
    !isChecked && 'bg-yellow-50 dark:bg-yellow-950/20'
  );

  return (
    <>
      <Card className={cardClassName}>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-muted-foreground">#{index}</span>
                <CardTitle className="text-base">
                  <Link
                    href={`/pupil-personal-data/${pupil.id}`}
                    className="text-primary hover:underline"
                  >
                    {pupilName || 'Без имени'}
                  </Link>
                </CardTitle>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              aria-label="Редактировать проверку"
              className="h-8 w-8 p-0"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Присутствие */}
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-sm font-medium">Присутствие</span>
            <InlineEditCell
              type="presence"
              value={isPresent}
              homeworkCheckId={homeworkCheck?.id}
              lessonId={lessonId}
              gradeSettings={gradeSettings}
            />
          </div>

          {/* Золотые стихи */}
          {showGoldenVerses && goldenVerseLabels.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Золотые стихи</h4>
              {goldenVerseLabels.map((label) => {
                const scoreKey = `goldenVerse${label.order}Score` as
                  | 'goldenVerse1Score'
                  | 'goldenVerse2Score'
                  | 'goldenVerse3Score';
                const score = homeworkCheck?.[scoreKey] ?? null;
                return (
                  <div key={label.order} className="flex items-center justify-between">
                    <span className="text-sm">{label.reference}</span>
                    <InlineEditCell
                      type="goldenVerse"
                      value={score}
                      homeworkCheckId={homeworkCheck?.id}
                      lessonId={lessonId}
                      gradeSettings={gradeSettings}
                      fieldName={scoreKey}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* Тест */}
          {showTest && (
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm font-medium">
                {gradeSettings.labelTest || 'Тест'}
              </span>
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
            </div>
          )}

          {/* Тетрадь */}
          {showNotebook && (
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm font-medium">
                {gradeSettings.labelNotebook || 'Тетрадь'}
              </span>
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
            </div>
          )}

          {/* Спевка */}
          {showSinging && (
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm font-medium">
                {gradeSettings.labelSinging || 'Спевка'}
              </span>
              <InlineEditCell
                type="singing"
                value={homeworkCheck?.singing ?? false}
                homeworkCheckId={homeworkCheck?.id}
                lessonId={lessonId}
                gradeSettings={gradeSettings}
              />
            </div>
          )}

          {/* Итого */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-base font-semibold">Итого</span>
            <span
              className={cn(
                'text-xl font-semibold',
                points >= 8 && 'text-green-600 dark:text-green-400',
                points > 0 && points < 4 && 'text-red-600 dark:text-red-400'
              )}
            >
              {points}
            </span>
          </div>
        </CardContent>
      </Card>

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

