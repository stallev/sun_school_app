import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RichTextViewer } from './rich-text-viewer';

interface LessonDescriptionSectionProps {
  content?: string | null;
}

/**
 * Lesson Description Section Component
 * Displays lesson description using RichTextViewer
 */
export const LessonDescriptionSection = ({
  content,
}: LessonDescriptionSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Описание урока</CardTitle>
      </CardHeader>
      <CardContent>
        <RichTextViewer content={content} />
      </CardContent>
    </Card>
  );
};
