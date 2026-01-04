import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface LessonSubmitButtonProps {
  isPending: boolean;
  isEditMode: boolean;
  onCancel?: () => void;
}

export const LessonSubmitButton = ({
  isPending,
  isEditMode,
  onCancel,
}: LessonSubmitButtonProps) => {
  const router = useRouter();

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  return (
    <div className="flex gap-2">
      <Button type="submit" disabled={isPending} className="flex-1">
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isEditMode ? 'Сохранение...' : 'Создание...'}
          </>
        ) : (
          isEditMode ? 'Сохранить изменения' : 'Создать урок'
        )}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={handleCancel}
        disabled={isPending}
      >
        Отменить
      </Button>
    </div>
  );
};

