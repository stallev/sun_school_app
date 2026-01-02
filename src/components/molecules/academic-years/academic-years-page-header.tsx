/**
 * Academic Years Page Header Component
 * Displays page header with back button, title, and actions
 */

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RoutePath } from '@/lib/routes/RoutePath';
import { AcademicYearsActions } from './academic-years-actions';

interface AcademicYearsPageHeaderProps {
  gradeId: string;
  gradeName: string;
  isAdmin: boolean;
}

/**
 * Academic years page header component
 * @param gradeId - Grade ID for navigation
 * @param gradeName - Grade name for display
 * @param isAdmin - Whether current user is Admin (for conditional rendering)
 */
export const AcademicYearsPageHeader = ({
  gradeId,
  gradeName,
  isAdmin,
}: AcademicYearsPageHeaderProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-2">
          <Link href={RoutePath.grades.byId(gradeId)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Вернуться к группе
          </Link>
        </Button>
        <h1 className="text-2xl font-bold md:text-3xl">
          Учебные годы: {gradeName}
        </h1>
      </div>
      {isAdmin && <AcademicYearsActions gradeId={gradeId} />}
    </div>
  );
};

