'use client';

import {
  EditorContent,
  EditorRoot,
  StarterKit,
  TiptapLink,
  TiptapImage,
  UpdatedImage,
  TaskList,
  TaskItem,
  HorizontalRule,
} from 'novel';
import { useMemo } from 'react';
import type { JSONContent } from 'novel';
import { cx } from 'class-variance-authority';

export interface RichTextViewerProps {
  /**
   * JSON string content (Tiptap/ProseMirror format)
   * If undefined or empty string, displays empty state
   */
  content?: string | null;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Configure extensions for read-only viewer
 * Same as editor but without Placeholder
 */
const createViewerExtensions = () => {
  const tiptapLink = TiptapLink.configure({
    HTMLAttributes: {
      class: cx(
        'text-muted-foreground underline underline-offset-[3px] hover:text-primary transition-colors'
      ),
    },
  });

  const taskList = TaskList.configure({
    HTMLAttributes: {
      class: cx('not-prose pl-2'),
    },
  });

  const taskItem = TaskItem.configure({
    HTMLAttributes: {
      class: cx('flex items-start my-4'),
    },
    nested: true,
  });

  const horizontalRule = HorizontalRule.configure({
    HTMLAttributes: {
      class: cx('mt-4 mb-6 border-t border-muted-foreground'),
    },
  });

  const starterKit = StarterKit.configure({
    bulletList: {
      HTMLAttributes: {
        class: cx('list-disc list-outside leading-3 -mt-2'),
      },
    },
    orderedList: {
      HTMLAttributes: {
        class: cx('list-decimal list-outside leading-3 -mt-2'),
      },
    },
    listItem: {
      HTMLAttributes: {
        class: cx('leading-normal -mb-2'),
      },
    },
    blockquote: {
      HTMLAttributes: {
        class: cx('border-l-4 border-primary'),
      },
    },
    codeBlock: {
      HTMLAttributes: {
        class: cx('rounded-sm bg-muted border p-5 font-mono font-medium'),
      },
    },
    code: {
      HTMLAttributes: {
        class: cx('rounded-md bg-muted px-1.5 py-1 font-mono font-medium'),
        spellcheck: 'false',
      },
    },
    horizontalRule: false,
    dropcursor: false,
    gapcursor: false,
  });

  return [
    starterKit,
    tiptapLink,
    TiptapImage,
    UpdatedImage,
    taskList,
    taskItem,
    horizontalRule,
  ];
};

/**
 * RichTextViewer Component
 * @description Read-only viewer for Novel JSON content
 * Used for displaying lesson descriptions without editing capability
 *
 * @example
 * ```tsx
 * <RichTextViewer content={lesson.content} />
 * ```
 */
export const RichTextViewer = ({
  content,
  className = '',
}: RichTextViewerProps) => {
  const extensions = useMemo(() => createViewerExtensions(), []);

  const initialContent = useMemo<JSONContent | undefined>(() => {
    if (!content || content.trim() === '') {
      return undefined;
    }

    try {
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === 'object') {
        return parsed as JSONContent;
      }
      return undefined;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('RichTextViewer: Failed to parse JSON content', error);
      }
      return undefined;
    }
  }, [content]);

  const viewerClassName = useMemo(() => {
    const baseClasses = 'prose prose-sm max-w-none [&_.tiptap]:pointer-events-none [&_.tiptap]:select-text';
    return className ? `${baseClasses} ${className}` : baseClasses;
  }, [className]);

  if (!initialContent) {
    return (
      <div className="text-muted-foreground text-sm italic">
        Описание урока отсутствует
      </div>
    );
  }

  return (
    <EditorRoot>
      <EditorContent
        extensions={extensions}
        initialContent={initialContent}
        className={viewerClassName}
      />
    </EditorRoot>
  );
};
