/**
 * Grade Pupils Component
 * Displays list of pupils in the grade as a table
 * Mobile-first responsive design with table layout for desktop
 */

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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

  // Sort pupils alphabetically by last name
  const sortedPupils = [...pupils].sort((a, b) => {
    const lastNameA = a.lastName || '';
    const lastNameB = b.lastName || '';
    return lastNameA.localeCompare(lastNameB, 'ru', { sensitivity: 'base' });
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold md:text-xl">
          Ученики ({pupils.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">№</TableHead>
                <TableHead>Фамилия</TableHead>
                <TableHead>Имя</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPupils.map((pupil, index) => (
                <TableRow key={pupil.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{pupil.lastName || '—'}</TableCell>
                  <TableCell>{pupil.firstName || '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

