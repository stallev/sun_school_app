/**
 * My Grades Page (Teacher)
 * Server Component for Teacher to view their assigned grades
 * Mobile-first responsive design
 * Redirects to single grade if Teacher has only one grade
 */

export const revalidate = 60

import { redirect } from 'next/navigation';
import { getAuthenticatedUser, checkRole } from '@/lib/auth/cognito';
import { listGradesAction } from '@/actions/grades';
import { RoutePath } from '@/lib/routes/RoutePath';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GradesList } from '@/components/organisms/grades-list';

export default async function MyGradesPage() {
  // Check authentication
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect(RoutePath.auth);
  }

  // Check authorization (Teacher only for this page)
  const isTeacher = checkRole(user, ['TEACHER']);
  if (!isTeacher) {
    // Redirect Admin to grades list page
    redirect(RoutePath.grades.base);
  }

  // Fetch grades
  const result = await listGradesAction();

  // Handle error state
  if (!result.success) {
    return (
      <div className="container p-4 md:p-6 lg:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Ошибка загрузки групп</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">{result.error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const grades = result.data || [];

  // Redirect to single grade if Teacher has only one grade
  if (grades.length === 1) {
    redirect(RoutePath.grades.byId(grades[0].id));
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
          Мои группы
        </h1>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          Группы, назначенные вам для преподавания
        </p>
      </div>

      {grades.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Нет назначенных групп</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Вам еще не назначены группы. Обратитесь к администратору для назначения.
            </p>
          </CardContent>
        </Card>
      ) : (
        <GradesList grades={grades} />
      )}
    </div>
  );
}

