/**
 * Academic Years Card List Component
 * Mobile card view for academic years list
 */

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatAcademicYearStatus } from '@/lib/utils/grades';
import { formatDateRange } from '@/lib/utils/date';
import { AcademicYearActivateButton } from './academic-year-activate-button';
import { AcademicYearDeleteButton } from './academic-year-delete-button';
import { AcademicYearCompleteButton } from './academic-year-complete-button';
import * as APITypes from '@/API';

interface AcademicYearsCardListProps {
  academicYears: Array<{
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    status: APITypes.AcademicYearStatus;
  }>;
  gradeId: string;
  isAdmin: boolean;
}

/**
 * Academic years card list component (mobile view)
 * @param academicYears - Array of academic years to display
 * @param gradeId - Grade ID for actions
 * @param isAdmin - Whether current user is Admin (for conditional rendering)
 */
export const AcademicYearsCardList = ({
  academicYears,
  gradeId,
  isAdmin,
}: AcademicYearsCardListProps) => {
  return (
    <div className="space-y-3 md:hidden">
      {academicYears.map((year) => {
        const isActive = year.status === APITypes.AcademicYearStatus.ACTIVE;
        const status = formatAcademicYearStatus(year.status);
        const dateRange = formatDateRange(year.startDate, year.endDate);

        return (
          <Card key={year.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-semibold">{year.name}</CardTitle>
                    <Badge
                      variant={isActive ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{dateRange}</p>
                </div>
              </div>
            </CardHeader>
            {isAdmin && (
              <CardContent>
                <div className="flex flex-col gap-2">
                  {year.status === APITypes.AcademicYearStatus.ACTIVE && (
                    <AcademicYearCompleteButton
                      gradeId={gradeId}
                      academicYearId={year.id}
                      academicYearName={year.name}
                      variant="outline"
                      size="sm"
                      fullWidth
                    />
                  )}
                  {year.status === APITypes.AcademicYearStatus.FINISHED && (
                    <>
                      <AcademicYearActivateButton
                        academicYearId={year.id}
                        academicYearName={year.name}
                        variant="outline"
                        size="sm"
                        fullWidth
                      />
                      <AcademicYearDeleteButton
                        academicYearId={year.id}
                        academicYearName={year.name}
                        variant="destructive"
                        size="sm"
                        fullWidth
                      />
                    </>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
};

