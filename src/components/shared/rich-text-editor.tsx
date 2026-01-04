'use client';

import {
  EditorContent,
  EditorRoot,
  StarterKit,
  Placeholder,
  TiptapLink,
  TiptapImage,
  UpdatedImage,
  TaskList,
  TaskItem,
  HorizontalRule,
  EditorInstance,
} from 'novel';
import { useCallback, useMemo, useEffect, useRef, useState } from 'react';
import type { JSONContent } from 'novel';
import { cx } from 'class-variance-authority';

export interface RichTextEditorProps {
  /**
   * JSON string content (Tiptap/ProseMirror format)
   * If undefined or empty string, editor starts empty
   */
  value?: string;
  /**
   * Callback when content changes
   * Receives JSON string (Tiptap/ProseMirror format)
   */
  onChange?: (value: string) => void;
  /**
   * Callback when editor loses focus
   */
  onBlur?: () => void;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Whether the editor is disabled
   */
  disabled?: boolean;
}

/**
 * Configure default extensions for the editor
 * Basic setup without AI features
 */
const createDefaultExtensions = (placeholderText: string) => {
  const placeholder = Placeholder.configure({
    placeholder: placeholderText,
  });

  const tiptapLink = TiptapLink.configure({
    HTMLAttributes: {
      class: cx(
        'text-muted-foreground underline underline-offset-[3px] hover:text-primary transition-colors cursor-pointer'
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
    dropcursor: {
      color: '#DBEAFE',
      width: 4,
    },
    gapcursor: false,
  });

  return [
    starterKit,
    placeholder,
    tiptapLink,
    TiptapImage,
    UpdatedImage,
    taskList,
    taskItem,
    horizontalRule,
  ];
};

/**
 * Internal component that manages editor instance
 * Uses onCreate callback to get editor instance
 */
const EditorContentWrapper = ({
  value,
  onChange,
  onBlur,
  className,
  disabled,
  extensions,
  initialContent,
}: {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  className: string;
  disabled: boolean;
  extensions: ReturnType<typeof createDefaultExtensions>;
  initialContent: JSONContent | undefined;
}) => {
  // Store editor instance
  const [editor, setEditor] = useState<EditorInstance | null>(null);
  
  // Track if update is from user input to prevent circular updates
  const isUserUpdateRef = useRef(false);
  const previousValueRef = useRef<string | undefined>(value);

  // Handle editor creation
  const handleCreate = useCallback(({ editor: editorInstance }: { editor: EditorInstance }) => {
    setEditor(editorInstance);
    // Set initial disabled state
    if (disabled) {
      editorInstance.setEditable(false);
    }
  }, [disabled]);

  // Update editor content when value prop changes (from external source)
  useEffect(() => {
    if (!editor) return;
    
    // Skip update if it's from user input
    if (isUserUpdateRef.current) {
      isUserUpdateRef.current = false;
      previousValueRef.current = value;
      return;
    }

    // Skip if value hasn't changed
    if (previousValueRef.current === value) {
      return;
    }

    // Parse and update editor content
    try {
      const currentContent = JSON.stringify(editor.getJSON());
      
      // Only update if content is different
      if (currentContent !== value) {
        if (!value || value.trim() === '') {
          editor.commands.clearContent();
        } else {
          const parsed = JSON.parse(value);
          if (parsed && typeof parsed === 'object') {
            editor.commands.setContent(parsed);
          }
        }
        previousValueRef.current = value;
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('RichTextEditor: Failed to update editor content', error);
      }
    }
  }, [editor, value]);

  // Handle disabled state
  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [editor, disabled]);

  // Handle editor updates
  const handleUpdate = useCallback(
    ({ editor: editorInstance }: { editor: EditorInstance }) => {
      if (!onChange) return;

      // Mark as user update to prevent circular updates
      isUserUpdateRef.current = true;

      try {
        const json = editorInstance.getJSON();
        const jsonString = JSON.stringify(json);
        previousValueRef.current = jsonString;
        onChange(jsonString);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('RichTextEditor: Failed to serialize JSON content', error);
        }
      }
    },
    [onChange]
  );

  return (
    <EditorContent
      extensions={extensions}
      initialContent={initialContent}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onBlur={onBlur}
      className={className}
    />
  );
};

/**
 * RichTextEditor Component
 * @description Rich text editor for lesson descriptions using Novel (Tiptap-based)
 * Integrates with React Hook Form via Controller
 *
 * @example
 * ```tsx
 * <Controller
 *   name="content"
 *   control={control}
 *   render={({ field }) => (
 *     <RichTextEditor
 *       value={field.value}
 *       onChange={field.onChange}
 *       onBlur={field.onBlur}
 *     />
 *   )}
 * />
 * ```
 */
export const RichTextEditor = ({
  value,
  onChange,
  onBlur,
  className = '',
  placeholder = 'Начните вводить описание урока...',
  disabled = false,
}: RichTextEditorProps) => {
  // Create extensions with placeholder
  const extensions = useMemo(
    () => createDefaultExtensions(placeholder),
    [placeholder]
  );

  // Parse JSON string to JSONContent object for initialContent
  // Note: We intentionally use empty dependency array because initialContent is only used
  // for initial render. Dynamic updates are handled via useEffect with editor.commands.setContent()
   
  const initialContent = useMemo<JSONContent | undefined>(() => {
    if (!value || value.trim() === '') {
      return undefined;
    }

    try {
      const parsed = JSON.parse(value);
      // Validate that parsed value is a valid JSONContent object
      if (parsed && typeof parsed === 'object') {
        return parsed as JSONContent;
      }
      return undefined;
    } catch (error) {
      // Log error in development mode
      if (process.env.NODE_ENV === 'development') {
        console.error('RichTextEditor: Failed to parse JSON content', error);
      }
      return undefined;
    }
  }, []); // Only parse on initial mount - dynamic updates handled via useEffect

  // Combine default className with custom className
  // Add styles to ensure contenteditable div fills entire container
  // EditorContent structure: EditorContent (root) > div (wrapper) > .ProseMirror (contenteditable)
  // We need to ensure contenteditable div fills the entire clickable area
  const editorClassName = useMemo(() => {
    const baseClasses =
      'min-h-[300px] rounded-md border border-input bg-background ' +
      // Make EditorContent wrapper div fill container
      '[&>div]:h-full [&>div]:min-h-[300px] [&>div]:w-full ' +
      // Make ProseMirror contenteditable div fill wrapper completely with padding and box-sizing
      '[&_.ProseMirror]:h-full [&_.ProseMirror]:min-h-[300px] [&_.ProseMirror]:w-full [&_.ProseMirror]:box-border [&_.ProseMirror]:px-3 [&_.ProseMirror]:py-2 [&_.ProseMirror]:outline-none [&_.ProseMirror]:cursor-text';
    return className ? `${baseClasses} ${className}` : baseClasses;
  }, [className]);

  return (
    <EditorRoot>
      <EditorContentWrapper
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={editorClassName}
        disabled={disabled}
        extensions={extensions}
        initialContent={initialContent}
      />
    </EditorRoot>
  );
};

