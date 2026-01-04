import { notFound, redirect } from 'next/navigation';
import { getLessonWithRelationsAction } from '@/actions/lessons';
import { getGradeSettingsByGrade, getPupilsByGrade, getGrade, getAcademicYear } from '@/lib/db/queries';
import { getUser } from '@/lib/db/queries';
import { RoutePath } from '@/lib/routes/RoutePath';
import { AppBreadcrumb, type AppBreadcrumbItem } from '@/components/shared/breadcrumb';
import { getAuthenticatedUser, checkRole } from '@/lib/auth/cognito';
import {
  checkGradeAccessForLesson,
  getUserRole,
} from '@/lib/utils/lessons';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LessonGoldenVerses } from '@/components/molecules/lessons/lesson-golden-verses';
import { LessonDescriptionSection } from '@/components/molecules/lessons/lesson-description-section';
import { LessonActionCards } from '@/components/molecules/lessons/lesson-action-cards';
import { LessonDeleteButton } from '@/components/molecules/lessons/lesson-delete-button';
import { Pencil, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils/date/format';
import type { LessonNestedData } from '@/types/nested-queries';

interface LessonDetailContentProps {
  lessonId: string;
}

/**
 * Server Component for lesson detail content
 * Loads and displays lesson data with all related information
 */
export const LessonDetailContent = async ({
  lessonId,
}: LessonDetailContentProps) => {
  // Check authentication
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect('/auth');
  }

  // Check authorization
  if (!checkRole(user, ['TEACHER', 'ADMIN', 'SUPERADMIN'])) {
    redirect('/grades/my');
  }

  // Load lesson data
  const lessonResult = await getLessonWithRelationsAction(lessonId);

  if (!lessonResult.success || !lessonResult.data) {
    if (!lessonResult.success && lessonResult.error?.includes('not found')) {
      notFound();
    }
    redirect('/grades/my');
  }

  const lesson: LessonNestedData = lessonResult.data;

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

  // Load grade settings and related data
  const [gradeSettings, pupilsResult, teacher, grade, academicYear] = await Promise.all([
    getGradeSettingsByGrade(lesson.gradeId),
    getPupilsByGrade(lesson.gradeId),
    lesson.teacherId ? getUser(lesson.teacherId) : Promise.resolve(null),
    getGrade(lesson.gradeId),
    lesson.academicYearId ? getAcademicYear(lesson.academicYearId) : Promise.resolve(null),
  ]);

  // Calculate progress
  const homeworkChecks = lesson.homeworkChecks?.items?.filter(
    (hc): hc is NonNullable<typeof hc> => hc !== null
  ) || [];
  
  // Get active pupil IDs
  const activePupilIds = new Set(
    pupilsResult?.items
      ?.filter((p): p is NonNullable<typeof p> => p !== null && p.active)
      .map((p) => p.id) || []
  );

  // Filter checks: only for active pupils, remove duplicates
  const uniqueCheckedPupilIds = new Set<string>();
  homeworkChecks.forEach((hc) => {
    const pupilId = hc.pupil?.id;
    if (pupilId && activePupilIds.has(pupilId)) {
      uniqueCheckedPupilIds.add(pupilId);
    }
  });

  const totalPupils = activePupilIds.size;
  const checkedCount = uniqueCheckedPupilIds.size;
  const progressPercentage = totalPupils > 0 
    ? Math.min(100, Math.round((checkedCount / totalPupils) * 100))
    : 0;

  // Check if user can edit/delete
  const canEdit = isAdmin || (isTeacher && hasAccess);

  // Format lesson date
  const lessonDate = lesson.lessonDate
    ? formatDate(lesson.lessonDate, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Дата не указана';

  // Build breadcrumb items
  const breadcrumbItems: AppBreadcrumbItem[] = [
    { label: 'Группы', href: RoutePath.grades.base },
  ];

  if (grade) {
    breadcrumbItems.push({ label: grade.name, href: RoutePath.grades.byId(lesson.gradeId) });
  }

  if (academicYear) {
    breadcrumbItems.push({
      label: academicYear.name,
      href: RoutePath.grades.academicYearLessons(lesson.gradeId, academicYear.id),
    });
    breadcrumbItems.push({ label: 'Уроки', href: RoutePath.grades.academicYearLessons(lesson.gradeId, academicYear.id) });
  }

  breadcrumbItems.push({ label: lesson.title });

  return (
    <div className="container mx-auto max-w-5xl p-4 md:p-6 lg:p-8 space-y-6">
      <AppBreadcrumb items={breadcrumbItems} />
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <CardTitle className="text-2xl">Урок #{lesson.order}</CardTitle>
                <Badge variant="secondary">{lessonDate}</Badge>
              </div>
              <h1 className="text-3xl font-bold">{lesson.title}</h1>
              {teacher && (
                <p className="text-muted-foreground">
                  Преподаватель: {teacher.name || teacher.email}
                </p>
              )}
            </div>
            {canEdit && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/lessons/${lessonId}/edit`}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Редактировать
                  </Link>
                </Button>
                <LessonDeleteButton
                  lessonId={lessonId}
                  lessonTitle={lesson.title}
                  redirectPath={
                    lesson.academicYearId
                      ? `/grades/${lesson.gradeId}/academic-years/${lesson.academicYearId}/lessons`
                      : `/grades/${lesson.gradeId}`
                  }
                />
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Description */}
      <LessonDescriptionSection content={lesson.content} />

      {/* Golden Verses */}
      {gradeSettings?.enableGoldenVerse && lesson.goldenVerses?.items && (
        <LessonGoldenVerses
          goldenVerses={lesson.goldenVerses.items.filter(
            (gv): gv is NonNullable<typeof gv> => gv !== null
          )}
        />
      )}

      {/* Progress */}
      {totalPupils > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Прогресс проверки</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>
                  Проверено: {checkedCount} из {totalPupils}
                </span>
                <span className="text-muted-foreground">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <Progress value={progressPercentage} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Cards */}
      <LessonActionCards lessonId={lessonId} />

      {/* Back button */}
      {lesson.academicYearId && (
        <div className="flex justify-start">
          <Button variant="ghost" asChild>
            <Link
              href={`/grades/${lesson.gradeId}/academic-years/${lesson.academicYearId}/lessons`}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад к списку уроков
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

