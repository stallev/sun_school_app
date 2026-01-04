/**
 * Lessons List Content Component
 * Server Component for loading and displaying lessons list
 * Mobile-first responsive design
 */

import { notFound, redirect } from 'next/navigation';
import { getAuthenticatedUser, checkRole } from '@/lib/auth/cognito';
import { listLessonsAction } from '@/actions/lessons';
import { getGradeWithFullDataAction } from '@/actions/grades';
import { getAcademicYear } from '@/lib/db/queries';
import { RoutePath } from '@/lib/routes/RoutePath';
import { LessonsListTable } from '@/components/organisms/lessons/lessons-list-table';
import { LessonsEmptyState } from '@/components/molecules/lessons/lessons-empty-state';
import { LessonsErrorState } from '@/components/molecules/lessons/lessons-error-state';
import { AppBreadcrumb } from '@/components/shared/breadcrumb';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface LessonsListContentProps {
  gradeId: string;
  academicYearId: string;
}

/**
 * Check if Teacher has access to a specific grade
 */
async function checkTeacherGradeAccess(
  userId: string,
  gradeId: string
): Promise<boolean> {
  try {
    const { executeGraphQL } = await import('@/lib/db/amplify');
    const queries = await import('@/graphql/queries');
    const query = (queries as Record<string, string>).userGradesByGradeIdAndUserId;

    if (!query) {
      return false;
    }

    const result = await executeGraphQL<{
      userGradesByGradeIdAndUserId?: {
        items?: Array<{ userId: string; gradeId: string }>;
      };
    }>(query, {
      gradeId,
      userId: { eq: userId },
      limit: 1,
    });

    const items = result.data?.userGradesByGradeIdAndUserId?.items || [];
    return items.length > 0 && items.some((item) => item.userId === userId);
  } catch (error) {
    console.error('Error checking teacher grade access:', error);
    return false;
  }
}

/**
 * Server Component for lessons list content
 * Loads lessons data and displays list with filtering and pagination
 */
export const LessonsListContent = async ({
  gradeId,
  academicYearId,
}: LessonsListContentProps) => {
  // Check authentication
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect(RoutePath.auth);
  }

  // Check authorization
  const isAdmin = checkRole(user, ['ADMIN', 'SUPERADMIN']);
  const isTeacher = checkRole(user, ['TEACHER']);

  if (!isAdmin && !isTeacher) {
    redirect(RoutePath.grades.base);
  }

  // Load grade data to verify access and get grade name
  const gradeResult = await getGradeWithFullDataAction({ id: gradeId });

  if (!gradeResult.success || !gradeResult.data) {
    if (!gradeResult.success && (gradeResult.error?.includes('not found') || gradeResult.error?.includes('Forbidden'))) {
      notFound();
    }
    redirect(RoutePath.grades.base);
  }

  const { grade } = gradeResult.data;

  // Check access for Teacher
  if (isTeacher && !isAdmin) {
    const hasAccess = await checkTeacherGradeAccess(user.id, gradeId);
    if (!hasAccess) {
      redirect(RoutePath.grades.my);
    }
  }

  // Load academic year data
  const academicYear = await getAcademicYear(academicYearId);
  if (!academicYear) {
    notFound();
  }

  // Load lessons
  const lessonsResult = await listLessonsAction({
    gradeId,
    academicYearId,
  });

  // Handle error state
  if (!lessonsResult.success) {
    return (
      <div className="container mx-auto max-w-5xl p-4 md:p-6 lg:p-8">
        <LessonsErrorState error={lessonsResult.error} />
      </div>
    );
  }

  const lessons = lessonsResult.data || [];

  // Check if user can create lessons
  const canCreate = isAdmin || isTeacher;

  return (
    <div className="container mx-auto max-w-5xl p-4 md:p-6 lg:p-8">
      <AppBreadcrumb
        items={[
          { label: 'Группы', href: RoutePath.grades.base },
          { label: grade.name, href: RoutePath.grades.byId(gradeId) },
          { label: 'Учебные годы', href: RoutePath.grades.academicYears(gradeId) },
          { label: academicYear.name },
          { label: 'Уроки' },
        ]}
      />

      <div className="mb-6 mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
            Уроки: {academicYear.name}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            Управление уроками группы {grade.name}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          {canCreate && (
            <Button asChild className="min-h-[44px] w-full sm:w-auto">
              <Link href={`${RoutePath.lessons.new}?gradeId=${gradeId}`}>
                ➕ Создать урок
              </Link>
            </Button>
          )}
          <Button asChild variant="outline" className="min-h-[44px] w-full sm:w-auto">
            <Link href={RoutePath.grades.schedule.base(gradeId)}>
              📅 Расписание
            </Link>
          </Button>
        </div>
      </div>

      {lessons.length === 0 ? (
        <LessonsEmptyState gradeId={gradeId} academicYearId={academicYearId} />
      ) : (
        <LessonsListTable
          lessons={lessons}
          gradeId={gradeId}
          academicYearId={academicYearId}
          canEdit={canCreate}
        />
      )}
    </div>
  );
};

