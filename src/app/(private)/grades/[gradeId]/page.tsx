/**
 * Grade Detail Page
 * Server Component for displaying full information about a grade
 * Mobile-first responsive design
 * Uses ISR with 60-second revalidation for optimal performance
 */

export const revalidate = 60; // ISR: revalidate every 60 seconds

import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { getAuthenticatedUser, checkRole } from '@/lib/auth/cognito';
import { getGradeWithFullDataAction } from '@/actions/grades';
import { RoutePath } from '@/lib/routes/RoutePath';
import { Button } from '@/components/ui/button';
import { AppBreadcrumb } from '@/components/shared/breadcrumb';
import { GradeHeader } from '@/components/molecules/grades/grade-header';
import { GradeActions } from '@/components/molecules/grades/grade-actions';
import { GradeInfo } from '@/components/molecules/grades/grade-info';
import { GradeStatistics } from '@/components/molecules/grades/grade-statistics';
import { GradeTeachers } from '@/components/molecules/grades/grade-teachers';
import { GradePupils } from '@/components/molecules/grades/grade-pupils';
import { AcademicYearCard } from '@/components/molecules/academic-years/academic-year-card';

/**
 * Generate static params for ISR (optional for MVP)
 * For MVP, returns empty array - paths will be generated on-demand
 */
export async function generateStaticParams() {
  return [];
}

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
    <div className="container max-w-5xl p-4 md:p-6 lg:p-8">
      <AppBreadcrumb
        items={[
          { label: 'Группы', href: RoutePath.grades.base },
          { label: grade.name },
        ]}
      />
      <div className="space-y-4 md:space-y-6 mt-4">
        <GradeHeader grade={grade} />

        <GradeActions gradeId={gradeId} isAdmin={isAdmin} />

        {/* Statistics and Info */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
          <GradeInfo createdAt={grade.createdAt} updatedAt={grade.updatedAt} />
          <GradeStatistics
            pupilsCount={pupils.length}
            teachersCount={teachers.length}
            academicYearsCount={academicYears.length}
          />
        </div>

        {/* Teachers */}
        {teachers.length > 0 && <GradeTeachers teachers={teachers} />}

        {/* Pupils */}
        {pupils.length > 0 && <GradePupils pupils={pupils} />}

        {/* Academic Years */}
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold md:text-2xl">📚 Учебные годы</h2>
            <Button asChild variant="outline" size="sm">
              <Link href={RoutePath.grades.academicYears(gradeId)}>
                Управление годами
              </Link>
            </Button>
          </div>
          {academicYears.length === 0 ? (
            <div className="rounded-lg border bg-card p-6 text-center text-sm text-muted-foreground">
              Нет учебных годов. Создайте первый учебный год для начала работы.
            </div>
          ) : (
            <div className="space-y-6">
              {academicYears.map((yearData) => (
                <AcademicYearCard
                  key={yearData.academicYear.id}
                  academicYear={yearData.academicYear}
                  lessons={yearData.lessons}
                  gradeId={gradeId}
                  pupilsCount={pupils.length}
                  isAdmin={isAdmin}
                />
              ))}
            </div>
          )}
        </div>

        {/* Lessons by Academic Year Links */}
        {academicYears.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold md:text-2xl">📖 Уроки по учебным годам</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {academicYears.map((yearData) => {
                const lessonsCount = yearData.lessons.length;
                const isActive = yearData.academicYear.status === 'ACTIVE';
                return (
                  <Link
                    key={yearData.academicYear.id}
                    href={RoutePath.grades.academicYearLessons(gradeId, yearData.academicYear.id)}
                    className="group rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-base md:text-lg group-hover:underline">
                          {yearData.academicYear.name}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {lessonsCount === 0
                            ? 'Нет уроков'
                            : `${lessonsCount} ${lessonsCount === 1 ? 'урок' : lessonsCount < 5 ? 'урока' : 'уроков'}`}
                        </p>
                      </div>
                      <span className="text-2xl opacity-60 transition-opacity group-hover:opacity-100">
                        →
                      </span>
                    </div>
                    {isActive && (
                      <div className="mt-2">
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                          Активный
                        </span>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

