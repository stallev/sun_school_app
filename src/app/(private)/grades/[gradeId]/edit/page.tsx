/**
 * Edit Grade Page
 * Server Component for editing an existing grade
 * Mobile-first responsive design
 * Authorization: ADMIN, SUPERADMIN only
 */

export const dynamic = 'force-dynamic';

import { notFound, redirect } from 'next/navigation';
import { getAuthenticatedUser, checkRole } from '@/lib/auth/cognito';
import { getGradeWithFullDataAction } from '@/actions/grades';
import { RoutePath } from '@/lib/routes/RoutePath';
import { GradeForm } from '@/components/admin/grades/grade-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

/**
 * Edit grade page component
 * Server Component with authentication and authorization checks
 * @param params - Promise containing gradeId from dynamic route
 */
export default async function EditGradePage({
  params,
}: {
  params: Promise<{ gradeId: string }>;
}) {
  // Extract gradeId from params (Next.js 15 format)
  const { gradeId } = await params;

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

  // 3. Load grade data
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

  const { grade, pupils, teachers } = gradeData;

  // 4. Prepare initial data for form
  const initialData = {
    id: grade.id,
    name: grade.name,
    description: grade.description || '',
    minAge: grade.minAge ?? undefined,
    maxAge: grade.maxAge ?? undefined,
    active: grade.active,
    pupilIds: pupils.map((pupil) => pupil.id),
    teacherIds: Array.from(new Set(teachers.map((teacher) => teacher.id))),
  };

  // 5. Render form
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <Button
          asChild
          variant="ghost"
          className="mb-4 min-h-[44px]"
        >
          <Link href={`/grades/${gradeId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад к группе
          </Link>
        </Button>

        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
            Редактирование группы
          </h1>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            Измените информацию о группе, назначьте преподавателей и управляйте учениками
          </p>
        </div>
      </div>

      <div className="md:max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Информация о группе</CardTitle>
          </CardHeader>
          <CardContent>
            <GradeForm gradeId={gradeId} initialData={initialData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

