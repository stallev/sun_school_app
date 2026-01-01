/**
 * Grade Header Component
 * Displays grade name, description, and status
 * Mobile-first responsive design
 */

import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface GradeHeaderProps {
  grade: {
    id: string;
    name: string;
    description?: string | null;
    minAge?: number | null;
    maxAge?: number | null;
    active: boolean;
  };
}

/**
 * Grade header component
 * @param grade - Grade data to display
 */
export const GradeHeader = ({ grade }: GradeHeaderProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <CardTitle className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
              {grade.name}
            </CardTitle>
            {grade.description && (
              <CardDescription className="mt-2 text-sm md:text-base">
                {grade.description}
              </CardDescription>
            )}
            {(grade.minAge !== null && grade.minAge !== undefined) ||
            (grade.maxAge !== null && grade.maxAge !== undefined) ? (
              <p className="mt-2 text-sm text-muted-foreground md:text-base">
                Возраст: {formatAgeRange(grade.minAge, grade.maxAge)}
              </p>
            ) : null}
          </div>
          <Badge variant={grade.active ? 'default' : 'secondary'} className="w-fit">
            {grade.active ? 'Активна' : 'Неактивна'}
          </Badge>
        </div>
      </CardHeader>
    </Card>
  );
};

/**
 * Format age range for display
 */
const formatAgeRange = (
  minAge: number | null | undefined,
  maxAge: number | null | undefined
): string => {
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

