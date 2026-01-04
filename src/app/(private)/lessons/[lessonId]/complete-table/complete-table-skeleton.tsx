import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

/**
 * Skeleton component for complete table page
 * Mirrors the structure of CompleteTableContent component
 */
export const CompleteTableSkeleton = () => {
  return (
    <div className="container mx-auto max-w-7xl p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-8 w-64" aria-label="Loading lesson title" />
              <Skeleton className="h-5 w-40" aria-label="Loading lesson date" />
            </div>
            <Skeleton className="h-10 w-32" aria-label="Loading back button" />
          </div>
        </CardHeader>
      </Card>

      {/* Filters skeleton */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <Skeleton className="h-10 w-48" aria-label="Loading filter" />
            <Skeleton className="h-10 w-48" aria-label="Loading filter" />
          </div>
        </CardContent>
      </Card>

      {/* Table skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" aria-label="Loading table title" />
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Table header skeleton */}
              <div className="grid grid-cols-10 gap-4 pb-4 border-b">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
              {/* Table rows skeleton */}
              <div className="space-y-4 mt-4">
                {[1, 2, 3, 4, 5].map((row) => (
                  <div key={row} className="grid grid-cols-10 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((col) => (
                      <Skeleton key={col} className="h-10 w-full" />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend skeleton */}
      <Card>
        <CardContent className="pt-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

