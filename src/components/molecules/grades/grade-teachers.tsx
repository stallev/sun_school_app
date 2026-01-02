/**
 * Grade Teachers Component
 * Displays list of teachers assigned to the grade
 * Mobile-first responsive design
 */

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

/**
 * Serializable teacher type (without __typename)
 */
type SerializableTeacher = {
  id: string;
  email: string;
  name: string;
  role: string;
  photo?: string | null;
  active: boolean;
};

interface GradeTeachersProps {
  teachers: SerializableTeacher[];
}

/**
 * Grade teachers component
 * @param teachers - Array of teacher users assigned to the grade
 */
export const GradeTeachers = ({ teachers }: GradeTeachersProps) => {
  // Дедупликация преподавателей по id (защита от дубликатов)
  const uniqueTeachers = teachers.filter((teacher, index, self) => 
    index === self.findIndex((t) => t.id === teacher.id)
  );

  if (uniqueTeachers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold md:text-xl">Преподаватели</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground md:text-base">
            Преподаватели не назначены
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold md:text-xl">
          Преподаватели ({uniqueTeachers.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {uniqueTeachers.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

interface TeacherCardProps {
  teacher: SerializableTeacher;
}

/**
 * Single teacher card component
 */
const TeacherCard = ({ teacher }: TeacherCardProps) => {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h4 className="font-semibold text-sm md:text-base">{teacher.name || 'Без имени'}</h4>
          {teacher.email && (
            <p className="mt-1 text-xs text-muted-foreground md:text-sm">{teacher.email}</p>
          )}
        </div>
        {teacher.role && (
          <Badge variant="outline" className="text-xs">
            {teacher.role}
          </Badge>
        )}
      </div>
    </div>
  );
};

