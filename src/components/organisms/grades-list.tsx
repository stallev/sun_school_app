/**
 * Grades List Component
 * Server Component for displaying a list of grades
 * Mobile-first responsive design
 */

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 md:gap-6 md:p-6 lg:grid-cols-3 lg:gap-8 lg:p-8">
      {grades.map((grade) => (
        <Link
          key={grade.id}
          href={RoutePath.grades.byId(grade.id)}
          className="block"
        >
          <Card className="flex flex-col transition-all hover:shadow-lg cursor-pointer h-full">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base md:text-lg lg:text-xl">
                  {grade.name}
                </CardTitle>
                <Badge variant={grade.active ? 'default' : 'secondary'}>
                  {grade.active ? 'Активна' : 'Неактивна'}
                </Badge>
              </div>
              {grade.description && (
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {truncateText(grade.description, 100)}
                </p>
              )}
            </CardHeader>
            <CardContent className="flex-1">
              {(grade.minAge !== null && grade.minAge !== undefined) ||
              (grade.maxAge !== null && grade.maxAge !== undefined) ? (
                <div className="text-sm text-muted-foreground">
                  Возраст: {formatAgeRange(grade.minAge, grade.maxAge)}
                </div>
              ) : null}
            </CardContent>
            <CardFooter>
              <div className="w-full min-h-[44px] flex items-center justify-center rounded-md border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                Открыть
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
};

