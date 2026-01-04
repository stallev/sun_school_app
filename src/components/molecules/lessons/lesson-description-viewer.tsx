'use client';

import { RichTextViewer } from './rich-text-viewer';

interface LessonDescriptionViewerProps {
  content?: string | null;
  className?: string;
}

/**
 * Client Component wrapper for RichTextViewer
 * Used in Server Components to avoid SSR issues with Novel
 */
export const LessonDescriptionViewer = ({
  content,
  className = '',
}: LessonDescriptionViewerProps) => {
  return <RichTextViewer content={content} className={className} />;
};

