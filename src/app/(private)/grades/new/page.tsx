/**
 * New Grade Page
 * Server Component for creating a new grade
 * Mobile-first responsive design
 * Authorization: ADMIN, SUPERADMIN only
 */

export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { getAuthenticatedUser, checkRole } from '@/lib/auth/cognito';
import { RoutePath } from '@/lib/routes/RoutePath';
import { GradeForm } from '@/components/admin/grades/grade-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

/**
 * New grade page component
 * Server Component with authentication and authorization checks
 */
export default async function NewGradePage() {
  // 1. Check authentication
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect(RoutePath.auth);
  }

  // 2. Check authorization (Admin only)
  const isAdmin = checkRole(user, ['ADMIN', 'SUPERADMIN']);
  if (!isAdmin) {
    // Redirect non-Admin users to their grades page
    redirect(RoutePath.grades.my);
  }

  // 3. Render form
  return (
    <div className="container p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <Button
          asChild
          variant="ghost"
          className="mb-4 min-h-[44px]"
        >
          <Link href={RoutePath.grades.base}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад к списку групп
          </Link>
        </Button>

        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
            Создание новой группы
          </h1>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            Заполните форму для создания новой группы учеников
          </p>
        </div>
      </div>

      <div className="mx-auto md:max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Информация о группе</CardTitle>
          </CardHeader>
          <CardContent>
            <GradeForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

