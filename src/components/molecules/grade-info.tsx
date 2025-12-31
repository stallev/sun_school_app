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
      <CardHeader>
        <CardTitle className="text-lg font-semibold md:text-xl">Информация</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm md:text-base">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Создана:</span>
            <span>{formatDate(createdAt)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Обновлена:</span>
            <span>{formatDate(updatedAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
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




