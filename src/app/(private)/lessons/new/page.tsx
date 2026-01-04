import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getAuthenticatedUser, checkRole } from '@/lib/auth/cognito';
import { RoutePath } from '@/lib/routes/RoutePath';
import { LessonNewContent } from './lesson-new-content';
import { LessonNewSkeleton } from './lesson-new-skeleton';

interface LessonNewPageProps {
  searchParams: Promise<{ gradeId?: string }>;
}

/**
 * Lesson New Page
 * Server Component for creating a new lesson
 * Uses Suspense boundaries for fast navigation
 * Mobile-first responsive design
 */
export default async function LessonNewPage({
  searchParams,
}: LessonNewPageProps) {
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

  // Get gradeId from query parameters
  const { gradeId } = await searchParams;

  if (!gradeId) {
    redirect(RoutePath.grades.base);
  }

  // Page opens instantly, content loads asynchronously
  return (
    <Suspense fallback={<LessonNewSkeleton />}>
      <LessonNewContent gradeId={gradeId} />
    </Suspense>
  );
}

