/**
 * Grades List Page (Admin)
 * Server Component for displaying all grades for Admin users
 * Mobile-first responsive design
 */

import { redirect } from 'next/navigation';
import { getAuthenticatedUser, checkRole } from '@/lib/auth/cognito';
import { listGradesAction } from '@/actions/grades';
import { RoutePath } from '@/lib/routes/RoutePath';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GradesList } from '@/components/organisms/grades-list';
import Link from 'next/link';

export default async function GradesPage() {
  // Check authentication
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect(RoutePath.auth);
  }

  // Check authorization (Admin only for this page)
  const isAdmin = checkRole(user, ['ADMIN', 'SUPERADMIN']);
  if (!isAdmin) {
    // Redirect Teacher to their grades page
    redirect(RoutePath.grades.my);
  }

  // Fetch grades
  const result = await listGradesAction();

  // Handle error state
  if (!result.success) {
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Ошибка загрузки групп</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">{result.error}</p>
            <Button
              asChild
              className="mt-4 min-h-[44px]"
            >
              <Link href={RoutePath.grades.base}>
                Попробовать снова
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const grades = result.data || [];

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
            Группы
          </h1>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            Управление группами учеников воскресной школы
          </p>
        </div>
        <Button
          asChild
          className="min-h-[44px] w-full sm:w-auto"
        >
          <Link href={RoutePath.grades.new}>
            Создать группу
          </Link>
        </Button>
      </div>

      {grades.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Нет групп</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Группы еще не созданы. Создайте первую группу для начала работы.
            </p>
            <Button
              asChild
              className="min-h-[44px]"
            >
              <Link href={RoutePath.grades.new}>
                Создать группу
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <GradesList grades={grades} />
      )}
    </div>
  );
}

