/**
 * Grade Detail Page
 * Server Component for displaying full information about a grade
 * Mobile-first responsive design
 */

export const dynamic = 'force-dynamic';

import { notFound, redirect } from 'next/navigation';
import { getAuthenticatedUser, checkRole } from '@/lib/auth/cognito';
import { getGradeWithFullDataAction } from '@/actions/grades';
import { RoutePath } from '@/lib/routes/RoutePath';
import { GradeHeader } from '@/components/molecules/grade-header';
import { GradeActions } from '@/components/molecules/grade-actions';
import { GradeInfo } from '@/components/molecules/grade-info';
import { GradeStatistics } from '@/components/molecules/grade-statistics';
import { GradeTeachers } from '@/components/molecules/grade-teachers';
import { GradePupils } from '@/components/molecules/grade-pupils';
import { AcademicYearCard } from '@/components/molecules/academic-year-card';

/**
 * Grade detail page component
 * @param params - Promise containing gradeId from dynamic route
 */
export default async function GradeDetailPage({
  params,
}: {
  params: Promise<{ gradeId: string }>;
}) {
  // Extract gradeId from params (Next.js 15 format)
  const { gradeId } = await params;

  // Check authentication
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect(RoutePath.auth);
  }

  // Load grade data with full relations and access check
  const gradeResult = await getGradeWithFullDataAction({ id: gradeId });

  // Handle error states
  if (!gradeResult.success) {
    if (gradeResult.error.includes('not found') || gradeResult.error.includes('Forbidden')) {
      notFound();
    }
    redirect(RoutePath.grades.base);
  }

  const gradeData = gradeResult.data;
  if (!gradeData) {
    notFound();
  }

  const { grade, pupils, teachers, academicYears } = gradeData;

  // Check if user is Admin for conditional rendering
  const isAdmin = checkRole(user, ['ADMIN', 'SUPERADMIN']);

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <GradeHeader grade={grade} />

      <div className="mt-6">
        <GradeActions gradeId={gradeId} isAdmin={isAdmin} />
      </div>

      {/* Statistics and Info */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <GradeInfo createdAt={grade.createdAt} updatedAt={grade.updatedAt} />
        <GradeStatistics
          pupilsCount={pupils.length}
          teachersCount={teachers.length}
          academicYearsCount={academicYears.length}
        />
      </div>

      {/* Teachers */}
      {teachers.length > 0 && (
        <div className="mt-6">
          <GradeTeachers teachers={teachers} />
        </div>
      )}

      {/* Pupils */}
      {pupils.length > 0 && (
        <div className="mt-6">
          <GradePupils pupils={pupils} />
        </div>
      )}

      {/* Academic Years */}
      <div className="mt-6 space-y-6">
        <h2 className="text-xl font-bold md:text-2xl">📚 Учебные годы</h2>
        {academicYears.length === 0 ? (
          <div className="rounded-lg border bg-card p-6 text-center text-sm text-muted-foreground">
            Нет учебных годов. Создайте первый учебный год для начала работы.
          </div>
        ) : (
          academicYears.map((yearData) => (
            <AcademicYearCard
              key={yearData.academicYear.id}
              academicYear={yearData.academicYear}
              lessons={yearData.lessons}
              gradeId={gradeId}
              pupilsCount={pupils.length}
              isAdmin={isAdmin}
            />
          ))
        )}
      </div>
    </div>
  );
}

