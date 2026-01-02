/**
 * Academic Years Table Component
 * Desktop table view for academic years list
 */

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
import { formatAcademicYearStatus } from '@/lib/utils/grades';
import { formatDateRange } from '@/lib/utils/date';
import { AcademicYearActivateButton } from './academic-year-activate-button';
import { AcademicYearDeleteButton } from './academic-year-delete-button';
import { AcademicYearCompleteButton } from './academic-year-complete-button';
import * as APITypes from '@/API';

interface AcademicYearsTableProps {
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
 * Academic years table component (desktop view)
 * @param academicYears - Array of academic years to display
 * @param gradeId - Grade ID for actions
 * @param isAdmin - Whether current user is Admin (for conditional rendering)
 */
export const AcademicYearsTable = ({
  academicYears,
  gradeId,
  isAdmin,
}: AcademicYearsTableProps) => {
  return (
    <div className="hidden md:block">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold md:text-xl">
            Список учебных годов
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Название</TableHead>
                  <TableHead className="min-w-[250px]">Период</TableHead>
                  <TableHead className="min-w-[120px] text-center">Статус</TableHead>
                  {isAdmin && (
                    <TableHead className="min-w-[200px] text-right">Действия</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {academicYears.map((year) => {
                  const isActive = year.status === APITypes.AcademicYearStatus.ACTIVE;
                  const status = formatAcademicYearStatus(year.status);
                  const dateRange = formatDateRange(year.startDate, year.endDate);

                  return (
                    <TableRow key={year.id}>
                      <TableCell className="font-medium">{year.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {dateRange}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={isActive ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {status}
                        </Badge>
                      </TableCell>
                      {isAdmin && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {year.status === APITypes.AcademicYearStatus.ACTIVE && (
                              <AcademicYearCompleteButton
                                gradeId={gradeId}
                                academicYearId={year.id}
                                academicYearName={year.name}
                                variant="outline"
                                size="sm"
                                className="h-8"
                              />
                            )}
                            {year.status === APITypes.AcademicYearStatus.FINISHED && (
                              <>
                                <AcademicYearActivateButton
                                  academicYearId={year.id}
                                  academicYearName={year.name}
                                  variant="outline"
                                  size="sm"
                                  className="h-8"
                                />
                                <AcademicYearDeleteButton
                                  academicYearId={year.id}
                                  academicYearName={year.name}
                                  variant="destructive"
                                  size="sm"
                                  className="h-8"
                                />
                              </>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

