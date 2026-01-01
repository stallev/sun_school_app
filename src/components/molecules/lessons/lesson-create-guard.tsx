/**
 * Lesson Create Guard Component
 * Server Component wrapper that checks for active academic year before allowing lesson creation
 * Blocks UI and shows alert if no active year exists
 */

import { getActiveAcademicYearAction } from '@/actions/academicYears';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface LessonCreateGuardProps {
  gradeId: string;
  children: React.ReactNode;
}

/**
 * Lesson create guard component
 * Checks for active academic year and blocks lesson creation if none exists
 * @param gradeId - Grade ID to check
 * @param children - Content to render if active year exists
 */
export async function LessonCreateGuard({
  gradeId,
  children,
}: LessonCreateGuardProps) {
  // Check for active academic year
  const activeYearResult = await getActiveAcademicYearAction(gradeId);
  const hasActiveYear = activeYearResult.success && activeYearResult.data !== null;

  if (!hasActiveYear) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Нет активного учебного года</AlertTitle>
        <AlertDescription>
          Для создания урока необходимо наличие активного учебного года. Обратитесь к
          администратору для создания нового учебного года.
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
}

