/**
 * Grade Pupils Component
 * Displays list of pupils in the grade
 * Mobile-first responsive design with adaptive layout
 */

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

/**
 * Serializable pupil type (without __typename)
 */
type SerializablePupil = {
  id: string;
  gradeId: string;
  firstName: string;
  lastName: string;
  middleName?: string | null;
  dateOfBirth: string;
  photo?: string | null;
  active: boolean;
};

interface GradePupilsProps {
  pupils: SerializablePupil[];
}

/**
 * Grade pupils component
 * @param pupils - Array of pupils in the grade
 */
export const GradePupils = ({ pupils }: GradePupilsProps) => {
  if (pupils.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold md:text-xl">Ученики</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground md:text-base">Ученики не добавлены</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold md:text-xl">
          Ученики ({pupils.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {pupils.map((pupil) => (
            <PupilCard key={pupil.id} pupil={pupil} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

interface PupilCardProps {
  pupil: SerializablePupil;
}

/**
 * Single pupil card component
 * Mobile: card layout, Desktop: compact card
 */
const PupilCard = ({ pupil }: PupilCardProps) => {
  const fullName = `${pupil.lastName || ''} ${pupil.firstName || ''} ${pupil.middleName || ''}`.trim() || 'Без имени';

  return (
    <div className="rounded-lg border bg-card p-3 md:p-4">
      <h4 className="font-medium text-sm md:text-base">{fullName}</h4>
      {pupil.dateOfBirth && (
        <p className="mt-1 text-xs text-muted-foreground">
          {formatBirthDate(pupil.dateOfBirth)}
        </p>
      )}
    </div>
  );
};

/**
 * Format birth date for display
 */
const formatBirthDate = (date: string): string => {
  try {
    const d = new Date(date);
    return d.toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return date;
  }
};

