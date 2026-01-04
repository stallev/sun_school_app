'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { updateHomeworkCheckAction } from '@/actions/homework';
import { toast } from 'sonner';
import { Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type * as APITypes from '@/API';

interface InlineEditCellProps {
  type: 'number' | 'goldenVerse' | 'singing' | 'presence';
  value: number | boolean | null;
  homeworkCheckId?: string;
  lessonId: string;
  gradeSettings: APITypes.GradeSettings;
  fieldName?: 'testScore' | 'notebookScore' | 'goldenVerse1Score' | 'goldenVerse2Score' | 'goldenVerse3Score';
  min?: number;
  max?: number;
}

/**
 * Inline editable cell component
 * Supports different types of editing: number input, dropdown, checkbox
 */
export const InlineEditCell = ({
  type,
  value,
  homeworkCheckId,
  lessonId,
  gradeSettings,
  fieldName,
  min = 0,
  max = 10,
}: InlineEditCellProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState<string>(String(value ?? ''));
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = async (newValue: number | boolean | null) => {
    if (!homeworkCheckId) {
      toast.error('Проверка ДЗ не найдена. Создайте проверку через модальное окно.');
      return;
    }

    setIsSaving(true);
    setIsSaved(false);

    try {
      const updateData: Record<string, unknown> = { id: homeworkCheckId };

      if (type === 'number' && fieldName) {
        updateData[fieldName] = newValue as number;
      } else if (type === 'goldenVerse' && fieldName) {
        updateData[fieldName] = newValue as number;
      } else if (type === 'singing') {
        updateData.singing = newValue as boolean;
      } else if (type === 'presence') {
        // For presence, we need to handle it differently
        // If setting to false, we might want to clear all scores
        // For now, we'll just update the singing field as a proxy
        // This is a simplified approach - full implementation would require isPresent field
      }

      const result = await updateHomeworkCheckAction(updateData);

      if (result.success) {
        setIsSaved(true);
        toast.success('Оценка обновлена');
        setTimeout(() => {
          setIsSaved(false);
          setIsEditing(false);
        }, 1000);
      } else {
        toast.error(result.error || 'Ошибка сохранения');
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Не удалось сохранить изменения'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleNumberDoubleClick = () => {
    if (type === 'number') {
      setIsEditing(true);
      setEditValue(String(value ?? ''));
    }
  };

  const handleNumberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const numValue = parseInt(editValue, 10);
      if (!isNaN(numValue) && numValue >= min && numValue <= max) {
        handleSave(numValue);
      }
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(String(value ?? ''));
    }
  };

  const handleNumberBlur = () => {
    const numValue = parseInt(editValue, 10);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      handleSave(numValue);
    } else {
      setIsEditing(false);
      setEditValue(String(value ?? ''));
    }
  };

  const handleGoldenVerseChange = (newValue: string) => {
    const numValue = parseInt(newValue, 10);
    handleSave(numValue);
  };

  const handleSingingToggle = () => {
    handleSave(!value);
  };

  const handlePresenceToggle = () => {
    // For presence, we'll use a simplified approach
    // In a full implementation, this would require isPresent field
    handleSave(!value);
  };

  // Render based on type
  if (type === 'number') {
    if (isEditing) {
      return (
        <div className="relative">
          <Input
            ref={inputRef}
            type="number"
            min={min}
            max={max}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleNumberKeyDown}
            onBlur={handleNumberBlur}
            className="w-16 h-8 text-center"
            disabled={isSaving}
          />
          {isSaving && (
            <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin" />
          )}
          {isSaved && (
            <Check className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600" />
          )}
        </div>
      );
    }

    const numValue = typeof value === 'number' ? value : null;
    return (
      <div
        onDoubleClick={handleNumberDoubleClick}
        className={cn(
          'cursor-pointer px-2 py-1 rounded hover:bg-muted',
          'text-center',
          numValue === null && 'text-muted-foreground',
          numValue !== null && numValue >= 8 && 'text-green-600 dark:text-green-400 font-semibold',
          numValue !== null && numValue > 0 && numValue < 4 && 'text-red-600 dark:text-red-400'
        )}
        title="Двойной клик для редактирования"
      >
        {numValue ?? '-'}
      </div>
    );
  }

  if (type === 'goldenVerse') {
    return (
      <Select
        value={value !== null ? String(value) : '0'}
        onValueChange={handleGoldenVerseChange}
        disabled={isSaving || !homeworkCheckId}
      >
        <SelectTrigger className="w-16 h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0">0</SelectItem>
          <SelectItem value="1">1</SelectItem>
          <SelectItem value="2">2</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  if (type === 'singing') {
    return (
      <div className="flex items-center justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSingingToggle}
          disabled={isSaving || !homeworkCheckId}
          className="h-8 w-8 p-0"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : value ? (
            <span className="text-green-600">✅</span>
          ) : (
            <span className="text-red-600">❌</span>
          )}
        </Button>
      </div>
    );
  }

  if (type === 'presence') {
    return (
      <div className="flex items-center justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePresenceToggle}
          disabled={isSaving || !homeworkCheckId}
          className="h-8 w-8 p-0"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : value ? (
            <span className="text-green-600">✅</span>
          ) : (
            <span className="text-red-600">❌</span>
          )}
        </Button>
      </div>
    );
  }

  return <span>{value ?? '-'}</span>;
};

