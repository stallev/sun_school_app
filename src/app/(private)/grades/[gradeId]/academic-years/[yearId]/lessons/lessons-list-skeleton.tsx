/**
 * Lessons List Skeleton Component
 * Skeleton placeholder for lessons list table
 * Matches the structure of lessons list table
 * Mobile-first responsive design
 */

import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';

/**
 * Skeleton for lessons list table
 * Displays skeleton table with 5 rows
 * Matches the structure of lessons list component
 */
export const LessonsListSkeleton = () => {
  return (
    <>
      {/* Desktop: Table skeleton */}
      <div className="hidden md:block">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">
                  <Skeleton className="h-4 w-8" aria-label="Loading column header" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-20" aria-label="Loading column header" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-32" aria-label="Loading column header" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-28" aria-label="Loading column header" />
                </TableHead>
                <TableHead className="w-24">
                  <Skeleton className="h-4 w-20" aria-label="Loading column header" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-6" aria-label="Loading lesson number" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" aria-label="Loading lesson date" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-48" aria-label="Loading lesson title" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" aria-label="Loading teacher name" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" aria-label="Loading actions" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile: Card skeleton */}
      <div className="space-y-3 md:hidden">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-16" aria-label="Loading lesson number" />
                    <Skeleton className="h-4 w-20" aria-label="Loading lesson date" />
                  </div>
                  <Skeleton className="h-5 w-full" aria-label="Loading lesson title" />
                  <Skeleton className="h-4 w-32" aria-label="Loading teacher name" />
                </div>
                <Skeleton className="h-8 w-16" aria-label="Loading actions" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

