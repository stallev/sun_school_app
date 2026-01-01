/**
 * Academic Years Management Page
 * Server Component for displaying and managing academic years for a grade
 * Mobile-first responsive design
 */

export const revalidate = 60; // ISR: revalidate every 60 seconds

import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getAuthenticatedUser, checkRole } from '@/lib/auth/cognito';
import { listAcademicYearsAction } from '@/actions/academicYears';
import { getGradeWithFullDataAction } from '@/actions/grades';
import { RoutePath } from '@/lib/routes/RoutePath';
import { formatAcademicYearStatus } from '@/lib/utils/grades';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AcademicYearsActions } from '@/components/molecules/academic-years/academic-years-actions';
import { AcademicYearActivateButton } from '@/components/molecules/academic-years/academic-year-activate-button';
import { AcademicYearDeleteButton } from '@/components/molecules/academic-years/academic-year-delete-button';
import { AcademicYearCompleteButton } from '@/components/molecules/academic-years/academic-year-complete-button';
import * as APITypes from '@/API';

/**
 * Format date range for display
 */
function formatDateRange(startDate: string, endDate: string): string {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const startFormatted = start.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const endFormatted = end.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    return `${startFormatted} - ${endFormatted}`;
  } catch {
    return `${startDate} - ${endDate}`;
  }
}

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
        <Card>
          <CardHeader>
            <CardTitle>Ошибка загрузки учебных годов</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">{academicYearsResult.error}</p>
            <Button asChild className="mt-4">
              <Link href={RoutePath.grades.byId(gradeId)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Вернуться к группе
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const academicYears = academicYearsResult.data || [];

  return (
    <div className="container mx-auto max-w-5xl p-4 md:p-6 lg:p-8">
      <AcademicYearActivateHandlerWrapper academicYears={academicYears} />
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div>
            <Button asChild variant="ghost" size="sm" className="mb-2">
              <Link href={RoutePath.grades.byId(gradeId)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Вернуться к группе
              </Link>
            </Button>
            <h1 className="text-2xl font-bold md:text-3xl">
              Учебные годы: {grade.name}
            </h1>
          </div>
          {isAdmin && (
            <AcademicYearsActions gradeId={gradeId} />
          )}
        </div>

        {/* Academic Years List */}
        {academicYears.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              <p className="text-sm md:text-base">
                Нет учебных годов. Создайте первый учебный год для начала работы.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Desktop: Table view */}
            <div className="hidden md:block">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold md:text-xl">
                    Список учебных годов
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[200px]">Название</TableHead>
                          <TableHead className="min-w-[250px]">Период</TableHead>
                          <TableHead className="min-w-[120px] text-center">Статус</TableHead>
                          {isAdmin && (
                            <TableHead className="min-w-[200px] text-right">Действия</TableHead>
                          )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {academicYears.map((year) => {
                          const isActive = year.status === APITypes.AcademicYearStatus.ACTIVE;
                          const status = formatAcademicYearStatus(year.status);
                          const dateRange = formatDateRange(year.startDate, year.endDate);

                          return (
                            <TableRow key={year.id}>
                              <TableCell className="font-medium">{year.name}</TableCell>
                              <TableCell className="text-muted-foreground">
                                {dateRange}
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge
                                  variant={isActive ? 'default' : 'secondary'}
                                  className="text-xs"
                                >
                                  {status}
                                </Badge>
                              </TableCell>
                              {isAdmin && (
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    {year.status === APITypes.AcademicYearStatus.ACTIVE && (
                                      <AcademicYearCompleteButton
                                        gradeId={gradeId}
                                        academicYearId={year.id}
                                        academicYearName={year.name}
                                        variant="outline"
                                        size="sm"
                                        className="h-8"
                                      />
                                    )}
                                    {year.status === APITypes.AcademicYearStatus.FINISHED && (
                                      <>
                                        <AcademicYearActivateButton
                                          academicYearId={year.id}
                                          academicYearName={year.name}
                                          variant="outline"
                                          size="sm"
                                          className="h-8"
                                        />
                                        <AcademicYearDeleteButton
                                          academicYearId={year.id}
                                          academicYearName={year.name}
                                          variant="destructive"
                                          size="sm"
                                          className="h-8"
                                        />
                                      </>
                                    )}
                                  </div>
                                </TableCell>
                              )}
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Mobile: Card view */}
            <div className="space-y-3 md:hidden">
              {academicYears.map((year) => {
                const isActive = year.status === APITypes.AcademicYearStatus.ACTIVE;
                const status = formatAcademicYearStatus(year.status);
                const dateRange = formatDateRange(year.startDate, year.endDate);

                return (
                  <Card key={year.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-base font-semibold">{year.name}</CardTitle>
                            <Badge
                              variant={isActive ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {status}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{dateRange}</p>
                        </div>
                      </div>
                    </CardHeader>
                    {isAdmin && (
                      <CardContent>
                        <div className="flex flex-col gap-2">
                          {year.status === APITypes.AcademicYearStatus.ACTIVE && (
                            <AcademicYearCompleteButton
                              gradeId={gradeId}
                              academicYearId={year.id}
                              academicYearName={year.name}
                              variant="outline"
                              size="sm"
                              fullWidth
                            />
                          )}
                          {year.status === APITypes.AcademicYearStatus.FINISHED && (
                            <>
                              <AcademicYearActivateButton
                                academicYearId={year.id}
                                academicYearName={year.name}
                                variant="outline"
                                size="sm"
                                fullWidth
                              />
                              <AcademicYearDeleteButton
                                academicYearId={year.id}
                                academicYearName={year.name}
                                variant="destructive"
                                size="sm"
                                fullWidth
                              />
                            </>
                          )}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
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

