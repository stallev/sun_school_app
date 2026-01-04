import { LessonDetailSkeleton } from './lesson-detail-skeleton';

/**
 * Loading state for lesson detail page
 * Automatically shown during navigation to /lessons/[lessonId]
 */
export default function LessonDetailLoading() {
  return <LessonDetailSkeleton />;
}

