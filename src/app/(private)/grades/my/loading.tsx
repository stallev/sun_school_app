/**
 * Loading state for "My Grades" page (Teacher)
 * Automatically shown during navigation to /grades/my
 * Mobile-first responsive design
 */

import { Skeleton } from '@/components/ui/skeleton';
import { GradeListSkeleton } from '@/components/molecules/grades/grade-list-skeleton';

/**
 * Loading component for "My Grades" page
 * Shows skeleton while page data is loading
 */
export default function MyGradesLoading() {
  return (
    <div className="container p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <Skeleton className="h-9 w-40 mb-2 md:h-10 lg:h-11" aria-label="Loading page title" />
        <Skeleton className="h-4 w-64 md:h-5" aria-label="Loading page description" />
      </div>
      <GradeListSkeleton />
    </div>
  );
}

