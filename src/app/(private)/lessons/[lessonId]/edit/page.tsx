import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getAuthenticatedUser, checkRole } from '@/lib/auth/cognito';
import { LessonEditContent } from './lesson-edit-content';
import { LessonEditSkeleton } from './lesson-edit-skeleton';

export const revalidate = 60; // ISR: revalidate every 60 seconds

interface LessonEditPageProps {
  params: Promise<{ lessonId: string }>;
}

/**
 * Lesson Edit Page
 * Server Component for editing lesson information
 * Uses ISR with 60-second revalidation for optimal performance
 * Mobile-first responsive design
 */
export default async function LessonEditPage({
  params,
}: LessonEditPageProps) {
  const { lessonId } = await params;

  // Check authentication
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect('/auth');
  }

  // Check authorization
  if (!checkRole(user, ['TEACHER', 'ADMIN', 'SUPERADMIN'])) {
    redirect('/grades/my');
  }

  // Page opens instantly, content loads asynchronously
  return (
    <Suspense fallback={<LessonEditSkeleton />}>
      <LessonEditContent lessonId={lessonId} />
    </Suspense>
  );
}

