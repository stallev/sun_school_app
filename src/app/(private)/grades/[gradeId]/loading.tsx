/**
 * Loading state for grade detail page
 * Automatically shown during navigation to /grades/[gradeId]
 * Mobile-first responsive design
 */

import { GradeDetailSkeleton } from '@/components/molecules/grades/grade-detail-skeleton';

/**
 * Loading component for grade detail page
 * Shows skeleton while page data is loading
 */
export default function GradeDetailLoading() {
  return (
    <div className="container max-w-5xl p-4 md:p-6 lg:p-8">
      <GradeDetailSkeleton />
    </div>
  );
}

