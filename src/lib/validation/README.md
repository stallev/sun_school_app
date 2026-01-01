# Validation Schemas

This directory contains Zod validation schemas for all entities in the Sunday School App.

## Usage with React Hook Form

All schemas are compatible with React Hook Form via `@hookform/resolvers/zod`:

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createLessonSchema, type CreateLessonInput } from '@/lib/validation';

function LessonForm() {
  const form = useForm<CreateLessonInput>({
    resolver: zodResolver(createLessonSchema),
    defaultValues: {
      academicYearId: '',
      gradeId: '',
      teacherId: '',
      title: '',
      lessonDate: '',
      order: 1,
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    // data is typed as CreateLessonInput
    // Validation is already done by React Hook Form
    console.log(data);
  });

  return (
    <form onSubmit={onSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

## Usage in Server Actions

All schemas can be used directly in Server Actions for validation:

```ts
'use server';

import { createLessonSchema } from '@/lib/validation';
import { formatZodErrorForServer } from '@/lib/validation/utils';

export async function createLesson(input: unknown) {
  const result = createLessonSchema.safeParse(input);
  
  if (!result.success) {
    const { message, fieldErrors } = formatZodErrorForServer(result.error);
    return {
      success: false as const,
      error: message,
      fieldErrors,
    };
  }

  // result.data is typed as CreateLessonInput
  // Proceed with lesson creation
  return { success: true as const, data: result.data };
}
```

## Available Schemas

- **Common**: `uuidSchema`, `dateSchema`, `dateTimeSchema`, `emailSchema`, `passwordSchema`, `nonEmptyStringSchema`
- **Auth**: `signInSchema`, `signUpSchema`
- **Lessons**: `createLessonSchema`, `updateLessonSchema`, `lessonIdSchema`
- **Homework**: `createHomeworkCheckSchema`, `updateHomeworkCheckSchema`, `homeworkCheckIdSchema`
- **Pupils**: `createPupilSchema`, `updatePupilSchema`, `pupilIdSchema`
- **Grades**: `createGradeSchema`, `updateGradeSchema`, `assignTeacherSchema`, `gradeIdSchema`
- **Academic Years**: `createAcademicYearSchema`, `updateAcademicYearSchema`, `academicYearIdSchema`
- **Golden Verses**: `createGoldenVerseSchema`, `updateGoldenVerseSchema`, `goldenVerseIdSchema`
- **Books**: `createBookSchema`, `updateBookSchema`, `bookIdSchema`
- **Users**: `createUserSchema`, `updateUserSchema`, `userIdSchema`
- **Achievements**: `createAchievementSchema`, `updateAchievementSchema`, `awardAchievementSchema`, `achievementIdSchema`
- **Grade Events**: `createGradeEventSchema`, `updateGradeEventSchema`, `gradeEventIdSchema`
- **Grade Settings**: `createGradeSettingsSchema`, `updateGradeSettingsSchema`, `gradeSettingsIdSchema`
- **Families**: `createFamilySchema`, `updateFamilySchema`, `createFamilyMemberSchema`, `familyIdSchema`

## Utility Functions

- `formatValidationErrors(error)` - Format errors for form display
- `getFieldError(error, field)` - Get first error for a specific field
- `formatZodErrorForServer(error)` - Format errors for Server Actions response
- `safeParse(schema, data)` - Safely parse data with discriminated union result

