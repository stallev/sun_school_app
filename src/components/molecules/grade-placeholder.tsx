/**
 * Grade Placeholder Component
 * Displays placeholder message for sections that are not yet available
 * Mobile-first responsive design
 */

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface GradePlaceholderProps {
  title: string;
  message: string;
}

/**
 * Grade placeholder component
 * @param title - Title of the placeholder section
 * @param message - Message to display
 */
export const GradePlaceholder = ({ title, message }: GradePlaceholderProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold md:text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground md:text-base">{message}</p>
      </CardContent>
    </Card>
  );
};

