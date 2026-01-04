import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, CheckSquare } from 'lucide-react';
import Link from 'next/link';

interface LessonActionCardsProps {
  lessonId: string;
}

/**
 * Lesson Action Cards Component
 * Displays action cards for navigating to complete table and homework check
 */
export const LessonActionCards = ({ lessonId }: LessonActionCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Полная сводная таблица</CardTitle>
              <CardDescription>
                Просмотр всех оценок в табличном виде
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href={`/lessons/${lessonId}/complete-table`}>
              Открыть таблицу
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <CheckSquare className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Проверка домашних заданий</CardTitle>
              <CardDescription>
                Пошаговая проверка каждого ученика
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full" variant="outline">
            <Link href={`/lessons/${lessonId}/checking-homework`}>
              Начать проверку
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
