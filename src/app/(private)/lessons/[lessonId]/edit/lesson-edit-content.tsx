import { notFound, redirect } from 'next/navigation';
import { getLessonWithRelationsAction } from '@/actions/lessons';
import { getAuthenticatedUser, checkRole } from '@/lib/auth/cognito';
import { getGrade, getAcademicYear } from '@/lib/db/queries';
import { RoutePath } from '@/lib/routes/RoutePath';
import { AppBreadcrumb, type AppBreadcrumbItem } from '@/components/shared/breadcrumb';
import { LessonForm } from '@/components/teacher/LessonForm/LessonForm';
import type { LessonNestedData } from '@/types/nested-queries';

interface LessonEditContentProps {
  lessonId: string;
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
 * Server Component for lesson edit content
 * Loads lesson data and renders edit form
 */
export const LessonEditContent = async ({
  lessonId,
}: LessonEditContentProps) => {
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
    hasAccess = await checkTeacherGradeAccess(user.id, lesson.gradeId);
    if (!hasAccess) {
      redirect('/grades/my');
    }
  }

  // Transform golden verses data
  const goldenVerseIds =
    lesson.goldenVerses?.items
      ?.filter((gv): gv is NonNullable<typeof gv> => gv !== null)
      .map((gv) => gv.goldenVerseId) || [];

  // Transform lesson date to YYYY-MM-DD format
  const lessonDate = lesson.lessonDate
    ? new Date(lesson.lessonDate).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0];

  // Prepare initial data for form
  const initialData = {
    title: lesson.title,
    content: lesson.content ?? undefined,
    lessonDate,
    goldenVerseIds,
    academicYearId: lesson.academicYearId,
    gradeId: lesson.gradeId,
    teacherId: lesson.teacherId ?? undefined,
    order: lesson.order,
  };

  // Load grade and academic year for breadcrumb
  const [grade, academicYear] = await Promise.all([
    getGrade(lesson.gradeId),
    lesson.academicYearId ? getAcademicYear(lesson.academicYearId) : Promise.resolve(null),
  ]);

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

  breadcrumbItems.push({ label: 'Редактирование урока' });

  return (
    <div className="container mx-auto max-w-5xl p-4 md:p-6 lg:p-8">
      <AppBreadcrumb items={breadcrumbItems} />
      <div className="mt-4">
        <LessonForm
        mode="edit"
        gradeId={lesson.gradeId}
        lessonId={lessonId}
        initialData={initialData}
      />
      </div>
    </div>
  );
};

