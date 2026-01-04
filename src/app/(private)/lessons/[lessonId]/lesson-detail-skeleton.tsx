import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

/**
 * Skeleton component for lesson detail page
 * Mirrors the structure of LessonDetailContent component
 */
export const LessonDetailSkeleton = () => {
  return (
    <div className="container mx-auto max-w-5xl p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-8 w-48" aria-label="Loading lesson title" />
              <Skeleton className="h-5 w-32" aria-label="Loading lesson date" />
            </div>
            <Skeleton className="h-10 w-24" aria-label="Loading action buttons" />
          </div>
        </CardHeader>
      </Card>

      {/* Description skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" aria-label="Loading description title" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>

      {/* Golden verses skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" aria-label="Loading golden verses title" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Files skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" aria-label="Loading files title" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Action cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

