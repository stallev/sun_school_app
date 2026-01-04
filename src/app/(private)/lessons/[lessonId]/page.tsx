import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getAuthenticatedUser, checkRole } from '@/lib/auth/cognito';
import { LessonDetailContent } from './lesson-detail-content';
import { LessonDetailSkeleton } from './lesson-detail-skeleton';

export const revalidate = 60; // ISR: revalidate every 60 seconds

interface LessonDetailPageProps {
  params: Promise<{ lessonId: string }>;
}

/**
 * Lesson Detail Page
 * Server Component for displaying full lesson information
 * Uses ISR with 60-second revalidation for optimal performance
 * Mobile-first responsive design
 */
export default async function LessonDetailPage({
  params,
}: LessonDetailPageProps) {
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
    <Suspense fallback={<LessonDetailSkeleton />}>
      <LessonDetailContent lessonId={lessonId} />
    </Suspense>
  );
}

