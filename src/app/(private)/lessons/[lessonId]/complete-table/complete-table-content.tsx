import { redirect, notFound } from 'next/navigation';
import { getAuthenticatedUser, checkRole } from '@/lib/auth/cognito';
import { getLessonCompleteAction } from '@/actions/lessons';
import { checkGradeAccessForLesson, getUserRole } from '@/lib/utils/lessons';
import { getPupilsByGrade } from '@/lib/db/queries';
import { CompleteLessonTable } from '@/components/teacher/CompleteLessonTable/CompleteLessonTable';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { LessonNestedData } from '@/types/nested-queries';
import type * as APITypes from '@/API';

interface CompleteTableContentProps {
  lessonId: string;
}

/**
 * Server Component for complete table content
 * Loads and displays lesson data with all homework checks and grade settings
 */
export const CompleteTableContent = async ({
  lessonId,
}: CompleteTableContentProps) => {
  // Check authentication
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect('/auth');
  }

  // Check authorization
  if (!checkRole(user, ['TEACHER', 'ADMIN', 'SUPERADMIN'])) {
    redirect('/grades/my');
  }

  // Load lesson complete data
  const lessonResult = await getLessonCompleteAction(lessonId);

  if (!lessonResult.success || !lessonResult.data) {
    if (!lessonResult.success && lessonResult.error?.includes('not found')) {
      notFound();
    }
    redirect('/grades/my');
  }

  const { lesson, gradeSettings } = lessonResult.data;

  // Check access for Teacher
  const isAdmin = checkRole(user, ['ADMIN', 'SUPERADMIN']);
  const isTeacher = checkRole(user, ['TEACHER']);

  let hasAccess = true;
  if (isTeacher && !isAdmin) {
    const userRole = getUserRole(user);
    if (!userRole) {
      redirect('/grades/my');
    }
    hasAccess = await checkGradeAccessForLesson(user.id, lesson.gradeId, userRole);
    if (!hasAccess) {
      redirect('/grades/my');
    }
  }

  // Get all pupils for the grade to show all pupils in table (even without checks)
  const pupilsResult = await getPupilsByGrade(lesson.gradeId);
  const allPupils = pupilsResult?.items?.filter(
    (p): p is APITypes.Pupil => p !== null && p.active === true
  ) || [];

  // Format lesson date
  const lessonDate = new Date(lesson.lessonDate).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="container mx-auto max-w-7xl p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">
                📋 Сводная таблица: {lesson.title}
              </h1>
              <p className="text-muted-foreground">{lessonDate}</p>
            </div>
            <Button asChild variant="outline">
              <Link href={`/lessons/${lessonId}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад к обзору урока
              </Link>
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Table */}
      <CompleteLessonTable
        lesson={lesson}
        gradeSettings={gradeSettings}
        lessonId={lessonId}
        allPupils={allPupils}
      />
    </div>
  );
};

