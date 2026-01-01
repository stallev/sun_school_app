import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface GradeSubmitButtonProps {
  isPending: boolean;
  isEditMode: boolean;
}

export const GradeSubmitButton = ({ isPending, isEditMode }: GradeSubmitButtonProps) => (
  <Button type="submit" disabled={isPending} className="w-full">
    {isPending ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        {isEditMode ? 'Сохранение...' : 'Создание...'}
      </>
    ) : (
      isEditMode ? 'Сохранить изменения' : 'Создать группу'
    )}
  </Button>
);

