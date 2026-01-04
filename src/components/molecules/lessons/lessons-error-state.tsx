/**
 * Lessons Error State Component
 * Displays error state when lessons loading fails
 * Mobile-first responsive design
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface LessonsErrorStateProps {
  error: string;
  onRetry?: () => void;
}

/**
 * Error state component for lessons list
 * Shows error message and retry button
 */
export const LessonsErrorState = ({
  error,
  onRetry,
}: LessonsErrorStateProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ошибка загрузки уроков</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-destructive">{error}</p>
        {onRetry && (
          <Button onClick={onRetry} className="min-h-[44px] w-full sm:w-auto">
            Попробовать снова
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

