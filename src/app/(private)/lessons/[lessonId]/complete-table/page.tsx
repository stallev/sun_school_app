import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getAuthenticatedUser, checkRole } from '@/lib/auth/cognito';
import { CompleteTableContent } from './complete-table-content';
import { CompleteTableSkeleton } from './complete-table-skeleton';

export const revalidate = 60; // ISR: revalidate every 60 seconds

interface CompleteTablePageProps {
  params: Promise<{ lessonId: string }>;
}

/**
 * Complete Lesson Table Page
 * Server Component for displaying complete table of all homework checks for a lesson
 * Uses ISR with 60-second revalidation for optimal performance
 * Mobile-first responsive design
 */
export default async function CompleteTablePage({
  params,
}: CompleteTablePageProps) {
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
    <Suspense fallback={<CompleteTableSkeleton />}>
      <CompleteTableContent lessonId={lessonId} />
    </Suspense>
  );
}

