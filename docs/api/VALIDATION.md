# Validation Schemas - Sunday School App

## Document Version: 1.1
**Creation Date:** 23 December 2025  
**Last Update:** 24 December 2025  
**Project:** Sunday School App  
**Technologies:** Zod, TypeScript, Next.js 15.5.9, React Hook Form  
**Target Audience:** Frontend Developers, Backend Developers

---

## 1. Overview

This document defines all **Zod validation schemas** used in the Sunday School App for both client-side (React Hook Form) and server-side (Server Actions) validation. Zod provides type-safe, runtime validation with excellent TypeScript inference and error messaging.

### 1.1 Why Zod?

-   **Type Safety:** Automatically infers TypeScript types from schemas.
-   **Runtime Validation:** Validates data at runtime, catching errors before they reach the database.
-   **Composability:** Schemas can be composed, extended, and refined.
-   **Excellent Error Messages:** Human-readable validation errors for forms.
-   **Integration:** Works seamlessly with React Hook Form and Server Actions.

### 1.2 File Structure

All validation schemas are located in `lib/validation/`:

```
lib/
└── validation/
    ├── index.ts             # Re-exports all schemas
    ├── auth.ts              # Authentication schemas
    ├── lessons.ts           # Lesson schemas
    ├── homework.ts          # Homework schemas
    ├── pupils.ts            # Pupil schemas
    ├── grades.ts            # Grade schemas
    ├── academicYears.ts     # Academic year schemas
    ├── goldenVerses.ts      # Golden verse schemas
    ├── books.ts             # Bible books schemas
    ├── users.ts             # User management schemas
    ├── achievements.ts      # Achievement schemas
    ├── gradeEvents.ts       # Calendar event schemas
    └── gradeSettings.ts     # Grade settings schemas
```

---

## 2. Common Validation Patterns

### 2.1. UUID Validation

```typescript
import { z } from 'zod'

export const uuidSchema = z.string().uuid('Invalid UUID format')
```

### 2.2. Date Validation

```typescript
// ISO 8601 date string (YYYY-MM-DD)
export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')

// Optional date
export const optionalDateSchema = dateSchema.optional()
```

### 2.3. Email Validation

```typescript
export const emailSchema = z.string().email('Invalid email address')
```

### 2.4. Password Validation

```typescript
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password must be less than 100 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
```

### 2.5. Non-Empty String

```typescript
export const nonEmptyStringSchema = z.string().min(1, 'This field is required')
```

---

## 3. Authentication Schemas (`lib/validation/auth.ts`)

### 3.1. Sign In Schema

```typescript
import { z } from 'zod'

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type SignInInput = z.infer<typeof signInSchema>
```

**Example Usage:**

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInSchema, SignInInput } from '@/lib/validation/auth'

const form = useForm<SignInInput>({
  resolver: zodResolver(signInSchema),
  defaultValues: { email: '', password: '' },
})
```

---

### 3.2. Sign Up Schema

```typescript
export const signUpSchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain an uppercase letter')
      .regex(/[a-z]/, 'Password must contain a lowercase letter')
      .regex(/[0-9]/, 'Password must contain a number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type SignUpInput = z.infer<typeof signUpSchema>
```

---

## 4. Lesson Schemas (`lib/validation/lessons.ts`)

### 4.1. Create Lesson Schema

```typescript
import { z } from 'zod'

export const createLessonSchema = z.object({
  academicYearId: z.string().uuid('Invalid academic year ID'),
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  content: z.string().optional(), // Rich text content from Novel (Tiptap)
  lessonDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  goldenVerseIds: z
    .array(z.string().uuid('Invalid golden verse ID'))
    .max(5, 'Maximum 5 golden verses per lesson'),
})

export type CreateLessonInput = z.infer<typeof createLessonSchema>
```

---

### 4.2. Update Lesson Schema

```typescript
export const updateLessonSchema = z.object({
  lessonId: z.string().uuid('Invalid lesson ID'),
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .optional(),
  content: z.string().optional(),
  lessonDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format').optional(),
  goldenVerseIds: z.array(z.string().uuid()).max(5).optional(),
})

export type UpdateLessonInput = z.infer<typeof updateLessonSchema>
```

---

### 4.3. Delete Lesson Schema

```typescript
export const deleteLessonSchema = z.object({
  lessonId: z.string().uuid('Invalid lesson ID'),
})

export type DeleteLessonInput = z.infer<typeof deleteLessonSchema>
```

---

## 5. Homework Schemas (`lib/validation/homework.ts`)

### 5.1. Check Homework Schema

```typescript
import { z } from 'zod'

export const checkHomeworkSchema = z.object({
  lessonId: z.string().uuid('Invalid lesson ID'),
  pupilId: z.string().uuid('Invalid pupil ID'),
  isCompleted: z.boolean(),
  score: z.number().int().min(0, 'Score cannot be negative').max(100).optional(),
  teacherNotes: z.string().max(500, 'Notes are too long (max 500 characters)').optional(),
})

export type CheckHomeworkInput = z.infer<typeof checkHomeworkSchema>
```

---

### 5.2. Bulk Check Homework Schema

```typescript
export const bulkCheckHomeworkSchema = z.object({
  lessonId: z.string().uuid('Invalid lesson ID'),
  checks: z.array(
    z.object({
      pupilId: z.string().uuid('Invalid pupil ID'),
      isCompleted: z.boolean(),
      score: z.number().int().min(0).max(100).optional(),
      teacherNotes: z.string().max(500).optional(),
    })
  ),
})

export type BulkCheckHomeworkInput = z.infer<typeof bulkCheckHomeworkSchema>
```

---

## 6. Pupil Schemas (`lib/validation/pupils.ts`)

### 6.1. Create Pupil Schema

```typescript
import { z } from 'zod'

export const createPupilSchema = z.object({
  gradeId: z.string().uuid('Invalid grade ID'),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
  middleName: z.string().max(50).optional(),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  photo: z.string().url('Invalid photo URL').optional(),
  active: z.boolean().default(true),
})

export type CreatePupilInput = z.infer<typeof createPupilSchema>
```

---

### 6.2. Update Pupil Schema

```typescript
export const updatePupilSchema = z.object({
  pupilId: z.string().uuid('Invalid pupil ID'),
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  middleName: z.string().max(50).optional(),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  photo: z.string().url().optional(),
  active: z.boolean().optional(),
})

export type UpdatePupilInput = z.infer<typeof updatePupilSchema>
```

---

## 7. Grade Schemas (`lib/validation/grades.ts`)

### 7.1. Create Grade Schema

```typescript
import { z } from 'zod'

export const createGradeSchema = z.object({
  name: z.string().min(1, 'Grade name is required').max(100, 'Name is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  minAge: z.number().int().min(0, 'Minimum age must be positive').max(18, 'Invalid age range'),
  maxAge: z.number().int().min(0).max(18),
  active: z.boolean().default(true),
})
  .refine((data) => data.maxAge >= data.minAge, {
    message: 'Maximum age must be greater than or equal to minimum age',
    path: ['maxAge'],
  })

export type CreateGradeInput = z.infer<typeof createGradeSchema>
```

---

### 7.2. Update Grade Schema

```typescript
export const updateGradeSchema = z.object({
  gradeId: z.string().uuid('Invalid grade ID'),
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  minAge: z.number().int().min(0).max(18).optional(),
  maxAge: z.number().int().min(0).max(18).optional(),
  active: z.boolean().optional(),
})

export type UpdateGradeInput = z.infer<typeof updateGradeSchema>
```

---

### 7.3. Assign Teacher to Grade Schema

```typescript
export const assignTeacherSchema = z.object({
  gradeId: z.string().uuid('Invalid grade ID'),
  userId: z.string().uuid('Invalid user ID'),
})

export type AssignTeacherInput = z.infer<typeof assignTeacherSchema>
```

---

## 8. Academic Year Schemas (`lib/validation/academicYears.ts`)

### 8.1. Create Academic Year Schema

```typescript
import { z } from 'zod'

export const createAcademicYearSchema = z.object({
  gradeId: z.string().uuid('Invalid grade ID'),
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'), // e.g., "2024-2025"
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  status: z.enum(['ACTIVE', 'COMPLETED', 'PLANNED']).default('ACTIVE'),
})
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: 'End date must be after start date',
    path: ['endDate'],
  })

export type CreateAcademicYearInput = z.infer<typeof createAcademicYearSchema>
```

---

### 8.2. Update Academic Year Schema

```typescript
export const updateAcademicYearSchema = z.object({
  academicYearId: z.string().uuid('Invalid academic year ID'),
  name: z.string().min(1).max(100).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  status: z.enum(['ACTIVE', 'COMPLETED', 'PLANNED']).optional(),
})

export type UpdateAcademicYearInput = z.infer<typeof updateAcademicYearSchema>
```

---

## 9. Golden Verse Schemas (`lib/validation/goldenVerses.ts`)

### 9.1. Create Golden Verse Schema

```typescript
import { z } from 'zod'

export const createGoldenVerseSchema = z.object({
  bookId: z.string().uuid('Invalid book ID'),
  reference: z.string().min(1, 'Reference is required').max(100, 'Reference is too long'),
  chapter: z.number().int().min(1, 'Chapter must be at least 1'),
  verseStart: z.number().int().min(1, 'Verse start must be at least 1'),
  verseEnd: z.number().int().min(1, 'Verse end must be at least 1').optional(),
  text: z.string().min(1, 'Verse text is required').max(1000, 'Verse text is too long'),
}).refine(
  (data) => !data.verseEnd || data.verseEnd >= data.verseStart,
  {
    message: 'Verse end must be greater than or equal to verse start',
    path: ['verseEnd'],
  }
)

export type CreateGoldenVerseInput = z.infer<typeof createGoldenVerseSchema>
```

---

### 9.2. Search Golden Verses Schema

```typescript
export const searchGoldenVersesSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(100, 'Query is too long'),
  limit: z.number().int().min(1, 'Limit must be at least 1').max(50, 'Limit is too large').default(10),
})

export type SearchGoldenVersesInput = z.infer<typeof searchGoldenVersesSchema>
```

---

## 10. Book Schemas (`lib/validation/books.ts`)

### 10.1. List Books Schema

```typescript
import { z } from 'zod'

export const listBooksSchema = z.object({
  testament: z.enum(['OLD', 'NEW']).optional(),
  limit: z.number().int().min(1).max(100).default(66),
})

export type ListBooksInput = z.infer<typeof listBooksSchema>
```

---

### 10.2. Get Book Schema

```typescript
export const getBookSchema = z.object({
  id: z.string().uuid('Invalid book ID'),
})

export type GetBookInput = z.infer<typeof getBookSchema>
```

---

### 10.3. Search Books Schema

```typescript
export const searchBooksSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(100, 'Query is too long'),
  limit: z.number().int().min(1).max(66, 'Limit cannot exceed 66 books').default(10),
})

export type SearchBooksInput = z.infer<typeof searchBooksSchema>
```

---

### 10.4. Create Book Schema (Admin only)

```typescript
export const createBookSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100, 'Full name is too long'),
  shortName: z.string().min(1, 'Short name is required').max(50, 'Short name is too long'),
  abbreviation: z.string().min(1, 'Abbreviation is required').max(10, 'Abbreviation is too long'),
  testament: z.enum(['OLD', 'NEW'], {
    errorMap: () => ({ message: 'Testament must be OLD or NEW' }),
  }),
  order: z.number().int().min(1).max(66, 'Order must be between 1 and 66'),
})

export type CreateBookInput = z.infer<typeof createBookSchema>
```

---

## 11. User Schemas (`lib/validation/users.ts`)

### 10.1. Create User Schema

```typescript
import { z } from 'zod'

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[0-9]/, 'Password must contain a number'),
  role: z.enum(['TEACHER', 'ADMIN', 'SUPERADMIN'], {
    errorMap: () => ({ message: 'Invalid role' }),
  }),
  image: z.string().url('Invalid image URL').optional(),
  active: z.boolean().default(true),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
```

---

### 10.2. Update User Schema

```typescript
export const updateUserSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  role: z.enum(['TEACHER', 'ADMIN', 'SUPERADMIN']).optional(),
  image: z.string().url().optional(),
  active: z.boolean().optional(),
})

export type UpdateUserInput = z.infer<typeof updateUserSchema>
```

---

## 11. Achievement Schemas (`lib/validation/achievements.ts`)

### 11.1. Create Achievement Schema

```typescript
import { z } from 'zod'

export const createAchievementSchema = z.object({
  name: z.string().min(1, 'Achievement name is required').max(100, 'Name is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  icon: z.string().max(100, 'Icon name/URL is too long'),
  points: z.number().int().min(0, 'Points must be non-negative'),
})

export type CreateAchievementInput = z.infer<typeof createAchievementSchema>
```

---

### 11.2. Award Achievement to Pupil Schema

```typescript
export const awardAchievementSchema = z.object({
  pupilId: z.string().uuid('Invalid pupil ID'),
  achievementId: z.string().uuid('Invalid achievement ID'),
})

export type AwardAchievementInput = z.infer<typeof awardAchievementSchema>
```

---

## 12. Grade Event Schemas (`lib/validation/gradeEvents.ts`)

### 12.1. Create Grade Event Schema

```typescript
import { z } from 'zod'

export const createGradeEventSchema = z.object({
  gradeId: z.string().uuid('Invalid grade ID'),
  academicYearId: z.string().uuid('Invalid academic year ID'),
  title: z.string().min(1, 'Event title is required').max(200, 'Title is too long'),
  description: z.string().max(1000, 'Description is too long').optional(),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  eventType: z.enum(['LESSON', 'OUTDOOR_EVENT', 'LESSON_SKIPPING'], {
    errorMap: () => ({ message: 'Invalid event type' }),
  }),
})

export type CreateGradeEventInput = z.infer<typeof createGradeEventSchema>
```

---

### 12.2. Update Grade Event Schema

```typescript
export const updateGradeEventSchema = z.object({
  eventId: z.string().uuid('Invalid event ID'),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  eventType: z.enum(['LESSON', 'OUTDOOR_EVENT', 'LESSON_SKIPPING']).optional(),
})

export type UpdateGradeEventInput = z.infer<typeof updateGradeEventSchema>
```

---

## 13. Grade Settings Schemas (`lib/validation/gradeSettings.ts`)

### 13.1. Update Grade Settings Schema

```typescript
import { z } from 'zod'

export const updateGradeSettingsSchema = z.object({
  gradeId: z.string().uuid('Invalid grade ID'),
  maxGoldenVersesPerLesson: z
    .number()
    .int()
    .min(1, 'Must allow at least 1 golden verse')
    .max(10, 'Maximum 10 golden verses per lesson')
    .optional(),
  maxHomeworkScore: z
    .number()
    .int()
    .min(1, 'Score must be at least 1')
    .max(100, 'Score cannot exceed 100')
    .optional(),
})

export type UpdateGradeSettingsInput = z.infer<typeof updateGradeSettingsSchema>
```

---

## 14. Custom Validation Refinements

### 14.1. Date Range Validation

```typescript
import { z } from 'zod'

export const dateRangeSchema = z
  .object({
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: 'End date must be after start date',
    path: ['endDate'],
  })
```

---

### 14.2. Age Validation

```typescript
import { z } from 'zod'

export const ageRangeSchema = z
  .object({
    minAge: z.number().int().min(0).max(18),
    maxAge: z.number().int().min(0).max(18),
  })
  .refine((data) => data.maxAge >= data.minAge, {
    message: 'Maximum age must be greater than or equal to minimum age',
    path: ['maxAge'],
  })
```

---

### 14.3. Password Confirmation

```typescript
export const passwordWithConfirmationSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
```

---

## 15. Error Handling

### 15.1. Extracting Validation Errors

```typescript
import { z } from 'zod'

try {
  const validatedData = createLessonSchema.parse(input)
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error(error.flatten())
    // {
    //   formErrors: [],
    //   fieldErrors: {
    //     title: ['Title is required'],
    //     lessonDate: ['Invalid date format']
    //   }
    // }
  }
}
```

---

### 15.2. Formatting Errors for Forms

```typescript
import { z } from 'zod'

export function formatZodErrors(error: z.ZodError): Record<string, string[]> {
  return error.flatten().fieldErrors
}

// Usage in Server Action
if (error instanceof z.ZodError) {
  return {
    success: false,
    error: 'Validation failed',
    fieldErrors: formatZodErrors(error),
  }
}
```

---

## 16. Testing Validation Schemas

### 16.1. Unit Testing with Vitest

```typescript
import { describe, it, expect } from 'vitest'
import { createLessonSchema } from '@/lib/validation/lessons'

describe('createLessonSchema', () => {
  it('should validate a valid lesson input', () => {
    const validInput = {
      academicYearId: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Притча о сеятеле',
      lessonDate: '2025-01-15',
      goldenVerseIds: [],
    }

    expect(() => createLessonSchema.parse(validInput)).not.toThrow()
  })

  it('should reject an empty title', () => {
    const invalidInput = {
      academicYearId: '123e4567-e89b-12d3-a456-426614174000',
      title: '',
      lessonDate: '2025-01-15',
      goldenVerseIds: [],
    }

    expect(() => createLessonSchema.parse(invalidInput)).toThrow('Title is required')
  })

  it('should reject invalid date format', () => {
    const invalidInput = {
      academicYearId: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Test',
      lessonDate: '01/15/2025', // Invalid format
      goldenVerseIds: [],
    }

    expect(() => createLessonSchema.parse(invalidInput)).toThrow('Invalid date format')
  })
})
```

---

## 17. Best Practices

### 17.1. Schema Composition

```typescript
import { z } from 'zod'

// Shared sub-schemas
const baseEntitySchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

// Compose with entity-specific fields
export const lessonSchema = baseEntitySchema.extend({
  title: z.string().min(1).max(200),
  content: z.string().optional(),
  lessonDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})
```

---

### 17.2. Partial Schemas for Updates

```typescript
import { z } from 'zod'

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
})

// Automatically make all fields optional for updates
const updateSchema = createSchema.partial().extend({
  id: z.string().uuid(), // But require ID
})
```

---

### 17.3. Strict vs. Passthrough

```typescript
import { z } from 'zod'

// Strict: Reject unknown keys (default for security)
const strictSchema = z.object({
  title: z.string(),
}).strict()

// Passthrough: Allow unknown keys (use cautiously)
const passthroughSchema = z.object({
  title: z.string(),
}).passthrough()
```

---

## 18. Cross-References

-   **→ [SERVER_ACTIONS.md](SERVER_ACTIONS.md):** Server Actions that use these validation schemas.
-   **→ [COMPONENT_LIBRARY.md](../components/COMPONENT_LIBRARY.md):** Form components that integrate with React Hook Form.
-   **→ [GRAPHQL_SCHEMA.md](../database/GRAPHQL_SCHEMA.md):** GraphQL types that mirror these validation schemas.

---

## 19. Resources

-   **Zod Documentation:** https://zod.dev
-   **React Hook Form + Zod:** https://react-hook-form.com/get-started#SchemaValidation
-   **Zod Error Handling:** https://zod.dev/ERROR_HANDLING
-   **TypeScript Type Inference:** https://zod.dev/?id=type-inference

---

**End of Validation Schemas Documentation**

