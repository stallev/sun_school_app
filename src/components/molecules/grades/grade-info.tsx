/**
 * Grade Info Component
 * Displays additional information about the grade (createdAt, updatedAt)
 * Mobile-first responsive design
 */

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface GradeInfoProps {
  createdAt: string;
  updatedAt: string;
}

/**
 * Grade info component
 * @param createdAt - Grade creation date
 * @param updatedAt - Grade last update date
 */
export const GradeInfo = ({ createdAt, updatedAt }: GradeInfoProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold md:text-lg">Информация</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <InfoItem label="Создана" value={formatDate(createdAt)} />
          <InfoItem label="Обновлена" value={formatDate(updatedAt)} />
        </div>
      </CardContent>
    </Card>
  );
};

interface InfoItemProps {
  label: string;
  value: string;
}

/**
 * Single info item component
 */
const InfoItem = ({ label, value }: InfoItemProps) => {
  return (
    <div className="flex flex-row items-center justify-between gap-2">
      <span className="text-sm text-muted-foreground">{label}:</span>
      <span className="text-sm font-medium text-right">{value}</span>
    </div>
  );
};

/**
 * Format date for display
 */
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
};

