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
      <CardHeader>
        <CardTitle className="text-lg font-semibold md:text-xl">Статистика</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
    <div className="flex flex-col">
      <span className="text-2xl font-bold md:text-3xl">{value}</span>
      <span className="text-sm text-muted-foreground md:text-base">{label}</span>
    </div>
  );
};

