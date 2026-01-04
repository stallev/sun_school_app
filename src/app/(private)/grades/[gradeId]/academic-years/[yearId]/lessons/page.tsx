/**
 * Lessons List Page
 * Server Component for displaying lessons list for a grade and academic year
 * Uses ISR with 60-second revalidation for optimal performance
 * Mobile-first responsive design
 */

export const revalidate = 60; // ISR: revalidate every 60 seconds

import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getAuthenticatedUser, checkRole } from '@/lib/auth/cognito';
import { RoutePath } from '@/lib/routes/RoutePath';
import { LessonsListContent } from './lessons-list-content';
import { LessonsListSkeleton } from './lessons-list-skeleton';

interface LessonsListPageProps {
  params: Promise<{ gradeId: string; yearId: string }>;
}

/**
 * Lessons list page component
 * Only handles authentication check, content loads asynchronously via Suspense
 */
export default async function LessonsListPage({ params }: LessonsListPageProps) {
  const { gradeId, yearId: academicYearId } = await params;

  // Check authentication
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect(RoutePath.auth);
  }

  // Check authorization
  const isAdmin = checkRole(user, ['ADMIN', 'SUPERADMIN']);
  const isTeacher = checkRole(user, ['TEACHER']);

  if (!isAdmin && !isTeacher) {
    redirect(RoutePath.grades.base);
  }

  // Page opens instantly, content loads asynchronously
  return (
    <Suspense fallback={<LessonsListSkeleton />}>
      <LessonsListContent gradeId={gradeId} academicYearId={academicYearId} />
    </Suspense>
  );
}

