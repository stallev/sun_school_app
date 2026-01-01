/**
 * Grade Statistics Component
 * Displays statistics about the grade (pupils, teachers, academic years)
 * Mobile-first responsive design
 */

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface GradeStatisticsProps {
  pupilsCount: number;
  teachersCount: number;
  academicYearsCount: number;
}

/**
 * Grade statistics component
 * @param pupilsCount - Number of pupils in the grade
 * @param teachersCount - Number of teachers assigned to the grade
 * @param academicYearsCount - Number of academic years for the grade
 */
export const GradeStatistics = ({
  pupilsCount,
  teachersCount,
  academicYearsCount,
}: GradeStatisticsProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold md:text-lg">Статистика</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <StatItem label="Учеников" value={pupilsCount} />
          <StatItem label="Преподавателей" value={teachersCount} />
          <StatItem label="Учебных годов" value={academicYearsCount} />
        </div>
      </CardContent>
    </Card>
  );
};

interface StatItemProps {
  label: string;
  value: number;
}

/**
 * Single statistic item
 */
const StatItem = ({ label, value }: StatItemProps) => {
  return (
    <div className="flex flex-row items-center justify-between gap-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-lg font-bold">{value}</span>
    </div>
  );
};

