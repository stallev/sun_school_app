/**
 * Grade List Skeleton Component
 * Skeleton placeholder for grades list table
 * Matches the structure of GradesList component
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
 * Skeleton for grades list table
 * Displays skeleton table with 5 rows
 * Matches the structure of GradesList component
 */
export const GradeListSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" aria-label="Loading table title" />
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">
                  <Skeleton className="h-4 w-24" />
                </TableHead>
                <TableHead className="min-w-[250px]">
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                <TableHead className="min-w-[120px]">
                  <Skeleton className="h-4 w-16" />
                </TableHead>
                <TableHead className="min-w-[100px] text-center">
                  <Skeleton className="h-4 w-16 mx-auto" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-32" aria-label="Loading grade name" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-full max-w-[200px]" aria-label="Loading grade description" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" aria-label="Loading age range" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-5 w-16 rounded-full mx-auto" aria-label="Loading grade status" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

