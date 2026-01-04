import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

/**
 * Skeleton component for lesson new page
 * Mirrors the structure of LessonForm component
 */
export const LessonNewSkeleton = () => {
  return (
    <div className="container mx-auto max-w-5xl p-4 md:p-6 lg:p-8 space-y-4">
      {/* Lesson information card skeleton */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-48" aria-label="Loading lesson information title" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title field skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" aria-label="Loading title label" />
            <Skeleton className="h-10 w-full" aria-label="Loading title input" />
          </div>

          {/* Date field skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" aria-label="Loading date label" />
            <Skeleton className="h-10 w-48" aria-label="Loading date input" />
          </div>

          {/* Content field skeleton (Novel editor) */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" aria-label="Loading content label" />
            <Skeleton className="h-64 w-full" aria-label="Loading content editor" />
          </div>

          {/* Golden verses selector skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" aria-label="Loading golden verses label" />
            <Skeleton className="h-10 w-full" aria-label="Loading golden verses selector" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit button skeleton */}
      <div className="flex gap-2">
        <Skeleton className="h-11 w-32" aria-label="Loading submit button" />
        <Skeleton className="h-11 w-24" aria-label="Loading cancel button" />
      </div>
    </div>
  );
};

