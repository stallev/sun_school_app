/**
 * Grades List Component
 * Server Component for displaying a list of grades as a table
 * Mobile-first responsive design
 */

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RoutePath } from '@/lib/routes/RoutePath';
import type * as APITypes from '@/API';

interface GradesListProps {
  grades: APITypes.Grade[];
}

/**
 * Format age range for display
 */
const formatAgeRange = (minAge: number | null | undefined, maxAge: number | null | undefined): string => {
  if (minAge !== null && minAge !== undefined && maxAge !== null && maxAge !== undefined) {
    return `${minAge}-${maxAge} лет`;
  }
  if (minAge !== null && minAge !== undefined) {
    return `от ${minAge} лет`;
  }
  if (maxAge !== null && maxAge !== undefined) {
    return `до ${maxAge} лет`;
  }
  return '';
};

/**
 * Truncate text for mobile display
 */
const truncateText = (text: string | null | undefined, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

export const GradesList = ({ grades }: GradesListProps) => {
  if (grades.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold md:text-xl">Список групп</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">Название</TableHead>
                <TableHead className="min-w-[250px]">Описание</TableHead>
                <TableHead className="min-w-[120px]">Возраст</TableHead>
                <TableHead className="min-w-[100px] text-center">Статус</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grades.map((grade) => (
                <TableRow key={grade.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={RoutePath.grades.byId(grade.id)}
                      className="text-primary hover:underline transition-colors"
                    >
                      {grade.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {grade.description ? truncateText(grade.description, 100) : '—'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {(grade.minAge !== null && grade.minAge !== undefined) ||
                    (grade.maxAge !== null && grade.maxAge !== undefined)
                      ? formatAgeRange(grade.minAge, grade.maxAge)
                      : '—'}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={grade.active ? 'default' : 'secondary'} className="text-xs">
                      {grade.active ? '🟢 Активна' : '⚪ Неактивна'}
                    </Badge>
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

