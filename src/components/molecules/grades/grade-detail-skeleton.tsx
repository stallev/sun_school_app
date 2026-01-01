/**
 * Grade Detail Skeleton Component
 * Skeleton placeholder for grade detail page
 * Matches the structure of GradeDetailPage component
 * Mobile-first responsive design
 */

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

/**
 * Skeleton for grade detail page
 * Matches the structure of GradeDetailPage component
 */
export const GradeDetailSkeleton = () => {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Grade Header Skeleton */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <Skeleton className="h-9 w-64 mb-2 md:h-10 lg:h-11" aria-label="Loading grade name" />
              <Skeleton className="h-5 w-full mb-1" aria-label="Loading grade description" />
              <Skeleton className="h-4 w-32 mt-2" aria-label="Loading age range" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" aria-label="Loading grade status" />
          </div>
        </CardHeader>
      </Card>

      {/* Grade Actions Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-24" aria-label="Loading actions title" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-10 rounded-md" aria-label="Loading action button" />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Statistics and Info Skeleton */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
        <Card>
          <CardHeader className="pb-3">
            <Skeleton className="h-5 w-32" aria-label="Loading info title" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex flex-row items-center justify-between gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex flex-row items-center justify-between gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <Skeleton className="h-5 w-32" aria-label="Loading statistics title" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex flex-row items-center justify-between gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-8" />
              </div>
              <div className="flex flex-row items-center justify-between gap-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-8" />
              </div>
              <div className="flex flex-row items-center justify-between gap-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-5 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Teachers Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" aria-label="Loading teachers title" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="rounded-lg border bg-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pupils Table Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" aria-label="Loading pupils title" />
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">
                    <Skeleton className="h-4 w-8" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-4 w-16" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-6" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Academic Years Skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-7 w-48 md:h-8" aria-label="Loading academic years title" />
        <div className="space-y-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Skeleton className="h-6 w-48 md:h-7" />
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-64" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <Skeleton key={j} className="h-10 w-10 rounded-md" />
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="flex flex-col">
                      <Skeleton className="h-7 w-12 mb-1 md:h-8" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  ))}
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

