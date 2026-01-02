/**
 * Academic Years Management Page
 * Server Component for displaying and managing academic years for a grade
 * Mobile-first responsive design
 */

export const revalidate = 60; // ISR: revalidate every 60 seconds

import { notFound, redirect } from 'next/navigation';
import { getAuthenticatedUser, checkRole } from '@/lib/auth/cognito';
import { listAcademicYearsAction } from '@/actions/academicYears';
import { getGradeWithFullDataAction } from '@/actions/grades';
import { RoutePath } from '@/lib/routes/RoutePath';
import { AcademicYearsPageHeader } from '@/components/molecules/academic-years/academic-years-page-header';
import { AcademicYearsTable } from '@/components/molecules/academic-years/academic-years-table';
import { AcademicYearsCardList } from '@/components/molecules/academic-years/academic-years-card-list';
import { AcademicYearsEmptyState } from '@/components/molecules/academic-years/academic-years-empty-state';
import { AcademicYearsErrorState } from '@/components/molecules/academic-years/academic-years-error-state';
import * as APITypes from '@/API';

/**
 * Academic years management page component
 * @param params - Promise containing gradeId from dynamic route
 */
export default async function AcademicYearsPage({
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

  // Check authorization (Admin/Teacher)
  const isAdmin = checkRole(user, ['ADMIN', 'SUPERADMIN']);
  const isTeacher = checkRole(user, ['TEACHER']);

  if (!isAdmin && !isTeacher) {
    redirect(RoutePath.grades.base);
  }

  // Load grade data for display
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

  const { grade } = gradeData;

  // Load academic years
  const academicYearsResult = await listAcademicYearsAction(gradeId);

  // Handle error states
  if (!academicYearsResult.success) {
    return (
      <div className="container mx-auto max-w-5xl p-4 md:p-6 lg:p-8">
        <AcademicYearsErrorState
          error={academicYearsResult.error}
          gradeId={gradeId}
        />
      </div>
    );
  }

  const academicYears = academicYearsResult.data || [];

  return (
    <div className="container mx-auto max-w-5xl p-4 md:p-6 lg:p-8">
      <AcademicYearActivateHandlerWrapper academicYears={academicYears} />
      <div className="space-y-4 md:space-y-6">
        <AcademicYearsPageHeader
          gradeId={gradeId}
          gradeName={grade.name}
          isAdmin={isAdmin}
        />

        {academicYears.length === 0 ? (
          <AcademicYearsEmptyState />
        ) : (
          <>
            <AcademicYearsTable
              academicYears={academicYears}
              gradeId={gradeId}
              isAdmin={isAdmin}
            />
            <AcademicYearsCardList
              academicYears={academicYears}
              gradeId={gradeId}
              isAdmin={isAdmin}
            />
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Client Component wrapper for handling activation query parameter
 * This is needed because Server Components cannot use useSearchParams
 * We need to import the component dynamically to avoid mixing server and client components
 */
import { AcademicYearActivateHandler } from '@/components/molecules/academic-years/academic-year-activate-handler';

function AcademicYearActivateHandlerWrapper({
  academicYears,
}: {
  academicYears: Array<{
    id: string;
    name: string;
    status: APITypes.AcademicYearStatus;
  }>;
}) {
  return <AcademicYearActivateHandler academicYears={academicYears} />;
}

