/**
 * Loading state for grades list page
 * Automatically shown during navigation to /grades
 * Mobile-first responsive design
 */

import { Skeleton } from '@/components/ui/skeleton';
import { GradeListSkeleton } from '@/components/molecules/grades/grade-list-skeleton';

/**
 * Loading component for grades list page
 * Shows skeleton while page data is loading
 */
export default function GradesLoading() {
  return (
    <div className="container p-4 md:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-9 w-32 mb-2 md:h-10 lg:h-11" aria-label="Loading page title" />
          <Skeleton className="h-4 w-64 md:h-5" aria-label="Loading page description" />
        </div>
        <Skeleton className="h-11 w-full sm:w-40 rounded-md" aria-label="Loading create button" />
      </div>
      <GradeListSkeleton />
    </div>
  );
}

