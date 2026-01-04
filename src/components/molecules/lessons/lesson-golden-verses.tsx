import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { LessonGoldenVerseNestedData } from '@/types/nested-queries';

interface LessonGoldenVersesProps {
  goldenVerses: LessonGoldenVerseNestedData[];
}

/**
 * Lesson Golden Verses Component
 * Displays list of golden verses for the lesson
 */
export const LessonGoldenVerses = ({
  goldenVerses,
}: LessonGoldenVersesProps) => {
  const sortedVerses = [...goldenVerses].sort((a, b) => {
    const orderA = a.order ?? 0;
    const orderB = b.order ?? 0;
    return orderA - orderB;
  });

  if (sortedVerses.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Золотые стихи</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedVerses.map((lessonVerse) => {
            const verse = lessonVerse.goldenVerse;
            if (!verse) return null;

            const bookName = verse.book?.shortName || verse.book?.fullName || '';
            const reference = verse.reference || `${bookName} ${verse.chapter}:${verse.verseStart}${verse.verseEnd ? `-${verse.verseEnd}` : ''}`;

            return (
              <div key={lessonVerse.id} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{reference}</Badge>
                  {bookName && (
                    <span className="text-sm text-muted-foreground">
                      {bookName}
                    </span>
                  )}
                </div>
                <p className="text-sm leading-relaxed">{verse.text}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
