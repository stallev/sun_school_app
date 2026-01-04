import { notFound, redirect } from 'next/navigation';
import { RoutePath } from '@/lib/routes/RoutePath';
import { AppBreadcrumb } from '@/components/shared/breadcrumb';
import { LessonForm } from '@/components/teacher/LessonForm/LessonForm';
import { getGrade } from '@/lib/db/queries';

interface LessonNewContentProps {
  gradeId: string;
}

/**
 * Content component for lesson new page
 * Loads data and renders LessonForm with gradeId
 */
export const LessonNewContent = async ({ gradeId }: LessonNewContentProps) => {
  if (!gradeId) {
    redirect(RoutePath.grades.base);
  }

  // Load grade data for breadcrumb
  const grade = await getGrade(gradeId);
  if (!grade) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-5xl p-4 md:p-6 lg:p-8">
      <AppBreadcrumb
        items={[
          { label: 'Группы', href: RoutePath.grades.base },
          { label: grade.name, href: RoutePath.grades.byId(gradeId) },
          { label: 'Создание урока' },
        ]}
      />
      <div className="mt-4">
        <LessonForm mode="create" gradeId={gradeId} />
      </div>
    </div>
  );
};

