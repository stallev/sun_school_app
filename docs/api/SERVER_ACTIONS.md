# Server Actions - Sunday School App

## Document Version: 1.1
**Creation Date:** 23 December 2025  
**Last Update:** 27 December 2025  
**Project:** Sunday School App  
**Technologies:** Next.js 15.5.9 (App Router, Server Actions), React 19, AWS Amplify Gen 1, AWS AppSync, Zod  
**Target Audience:** Frontend Developers, Backend Developers, API Consumers

---

## 1. Overview

This document defines all **Server Actions** for the Sunday School App. Server Actions are the primary API for data mutations and server-side business logic in Next.js 15.5.9. They provide type-safe, CSRF-protected endpoints that integrate seamlessly with React 19 Server Components and Client Components.

### 1.1 What are Server Actions?

-   **Server-side functions** marked with `'use server'` directive.
-   Automatically exposed as POST endpoints by Next.js.
-   Can be called directly from Client Components (`<form action={serverAction}>`) or programmatically (`await serverAction(data)`).
-   Support **progressive enhancement**: forms work without JavaScript.
-   **Type-safe**: Full TypeScript support for input/output types.

### 1.2 Architecture Principles

-   **Colocation by Domain:** Server Actions are organized by entity/domain (e.g., `actions/lessons.ts`, `actions/pupils.ts`).
-   **Single Responsibility:** Each action performs one specific task.
-   **Validation First:** All inputs are validated using **Zod** schemas.
-   **Authorization:** All actions check user roles via **AWS Cognito** (via Amplify Gen 1).
-   **Consistent Response Format:** Actions return discriminated unions for error handling.
-   **Revalidation:** Actions use `revalidatePath()` or `revalidateTag()` to update cached data.

---

## 2. File Structure

All Server Actions are located in the `actions/` directory at the project root:

```
actions/
├── lessons.ts          # Lesson CRUD operations
├── homework.ts         # Homework checking
├── pupils.ts           # Pupil management
├── grades.ts           # Grade management
├── academicYears.ts    # Academic year management
├── goldenVerses.ts     # Golden verse management
├── users.ts            # User management (Admin only)
├── achievements.ts     # Achievement management
├── gradeEvents.ts      # Calendar events
├── gradeSettings.ts    # Grade-specific settings
└── auth.ts             # Authentication helpers (login, logout)
```

---

## 3. Response Format Convention

All Server Actions return a **discriminated union** for consistent error handling:

### 3.1. Success Response

```typescript
type SuccessResponse<T> = {
  success: true
  data: T
  message?: string // Optional user-facing message (e.g., "Lesson created successfully")
}
```

### 3.2. Error Response

```typescript
type ErrorResponse = {
  success: false
  error: string // User-facing error message
  fieldErrors?: Record<string, string[]> // Zod validation errors (field-specific)
}
```

### 3.3. Combined Type

```typescript
type ActionResponse<T> = SuccessResponse<T> | ErrorResponse
```

**Example Usage in Components:**

```tsx
'use client'

import { createLesson } from '@/actions/lessons'
import { useTransition } from 'react'

export function CreateLessonForm() {
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createLesson(formData)

      if (result.success) {
        toast.success(result.message ?? 'Lesson created!')
        router.push(`/grades/${gradeId}/lessons/${result.data.id}`)
      } else {
        toast.error(result.error)
      }
    })
  }

  return <form action={handleSubmit}>{/* Form fields */}</form>
}
```

---

## 4. Authentication & Authorization

### 4.1. Getting Current User

All actions retrieve the authenticated user via AWS Cognito:

```typescript
import { getServerSession } from 'next-auth/next' // or Amplify Auth
import { authOptions } from '@/lib/auth'

export async function getAuthenticatedUser() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  
  return session.user
}
```

### 4.2. Role-Based Access Control (RBAC)

```typescript
type UserRole = 'TEACHER' | 'ADMIN' | 'SUPERADMIN' | 'PARENT' | 'PUPIL'

function checkRole(user: User, allowedRoles: UserRole[]) {
  if (!allowedRoles.includes(user.role)) {
    throw new Error('Forbidden: Insufficient permissions')
  }
}
```

**Example:**

```typescript
export async function deleteGrade(gradeId: string) {
  const user = await getAuthenticatedUser()
  checkRole(user, ['ADMIN', 'SUPERADMIN']) // Only admins can delete grades

  // ... deletion logic
}
```

---

## 5. Validation with Zod

### 5.1. Validation Pattern

```typescript
import { z } from 'zod'

const CreateLessonSchema = z.object({
  academicYearId: z.string().uuid(),
  title: z.string().min(1, 'Title is required').max(200),
  content: z.string().optional(),
  lessonDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  goldenVerseIds: z.array(z.string().uuid()).max(5, 'Maximum 5 golden verses per lesson'),
})

export async function createLesson(input: unknown): Promise<ActionResponse<Lesson>> {
  try {
    // 1. Validate input
    const validatedData = CreateLessonSchema.parse(input)

    // 2. Authenticate & authorize
    const user = await getAuthenticatedUser()
    checkRole(user, ['TEACHER', 'ADMIN', 'SUPERADMIN'])

    // 3. Business logic
    const lesson = await amplifyClient.models.Lesson.create({
      ...validatedData,
      order: await getNextLessonOrder(validatedData.academicYearId),
    })

    // 4. Revalidate cache
    revalidatePath(`/grades/${gradeId}/academic-years/${validatedData.academicYearId}/lessons`)

    // 5. Return success
    return { success: true, data: lesson, message: 'Lesson created successfully' }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Validation failed',
        fieldErrors: error.flatten().fieldErrors,
      }
    }

    return { success: false, error: error.message || 'Failed to create lesson' }
  }
}
```

---

## 6. Working with Related Data via Indexes

⚠️ **Important:** Since `@belongsTo` and `@hasMany` directives were removed from the GraphQL schema to eliminate CloudFormation circular dependencies, all relationships must be accessed via index-based queries.

**Key Principles:**
1. Use queries through indexes (GSI) instead of direct relationship fields
2. Create batch queries to fetch related data in a single request
3. Cache results on the client to reduce API calls
4. Use Server Actions to combine multiple queries into one call

**See also:**
- [GRAPHQL_SCHEMA.md](../database/GRAPHQL_SCHEMA.md) section 4.5 for query examples
- [SCHEMA_DIFFERENCES.md](../database/SCHEMA_DIFFERENCES.md) for complete list of changes
- [DATA_MODELING.md](../database/DATA_MODELING.md) section 8 for relationship patterns

### 6.1. Querying Related Data

Since `@belongsTo` and `@hasMany` directives were removed from the GraphQL schema, all relationships must be accessed via index-based queries.

**Example: Getting lesson with related data**

```typescript
'use server'

import { amplifyData } from '@/lib/db/amplify'

export async function getLessonWithRelations(lessonId: string) {
  // 1. Get lesson
  const lesson = await amplifyData.models.Lesson.get({ id: lessonId })
  
  if (!lesson.data) {
    return { success: false, error: 'Lesson not found' }
  }
  
  // 2. Get related academic year
  const academicYear = await amplifyData.models.AcademicYear.get({ 
    id: lesson.data.academicYearId 
  })
  
  // 3. Get golden verses via index
  const lessonGoldenVerses = await amplifyData.models.LessonGoldenVerse.list({
    lessonId,
    sortDirection: 'ASC'
  })
  
  // 4. Get homework checks via index
  const homeworkChecks = await amplifyData.models.HomeworkCheck.list({
    lessonId,
    sortDirection: 'ASC'
  })
  
  return {
    success: true,
    data: {
      lesson: lesson.data,
      academicYear: academicYear.data,
      goldenVerses: lessonGoldenVerses.data,
      homeworkChecks: homeworkChecks.data
    }
  }
}
```

**Example: Getting pupil with homework checks and achievements**

```typescript
'use server'

import { amplifyData } from '@/lib/db/amplify'

export async function getPupilComplete(pupilId: string) {
  // 1. Get pupil
  const pupil = await amplifyData.models.Pupil.get({ id: pupilId })
  
  if (!pupil.data) {
    return { success: false, error: 'Pupil not found' }
  }
  
  // 2. Get homework checks via index
  const homeworkChecks = await amplifyData.models.HomeworkCheck.list({
    pupilId,
    sortDirection: 'DESC'
  })
  
  // 3. Get achievements via index
  const achievements = await amplifyData.models.PupilAchievement.list({
    pupilId,
    sortDirection: 'DESC'
  })
  
  // 4. Get grade
  const grade = await amplifyData.models.Grade.get({ id: pupil.data.gradeId })
  
  return {
    success: true,
    data: {
      pupil: pupil.data,
      homeworkChecks: homeworkChecks.data,
      achievements: achievements.data,
      grade: grade.data
    }
  }
}
```

### 6.2. Batch Queries

Combine multiple queries in a single Server Action to reduce round trips and improve performance.

**Example: Batch query for lesson data**

```typescript
'use server'

import { amplifyData } from '@/lib/db/amplify'

export async function getLessonComplete(lessonId: string) {
  // Execute all queries in parallel using Promise.all
  const [lesson, goldenVerses, homeworkChecks] = await Promise.all([
    amplifyData.models.Lesson.get({ id: lessonId }),
    amplifyData.models.LessonGoldenVerse.list({ 
      lessonId,
      sortDirection: 'ASC' 
    }),
    amplifyData.models.HomeworkCheck.list({ 
      lessonId,
      sortDirection: 'ASC' 
    })
  ])
  
  if (!lesson.data) {
    return { success: false, error: 'Lesson not found' }
  }
  
  return {
    success: true,
    data: {
      lesson: lesson.data,
      goldenVerses: goldenVerses.data,
      homeworkChecks: homeworkChecks.data
    }
  }
}
```

**Example: Batch query with related entities**

```typescript
'use server'

import { amplifyData } from '@/lib/db/amplify'

export async function getGradeWithRelations(gradeId: string) {
  // Execute all queries in parallel
  const [grade, pupils, academicYears, events, settings] = await Promise.all([
    amplifyData.models.Grade.get({ id: gradeId }),
    amplifyData.models.Pupil.list({ gradeId }),
    amplifyData.models.AcademicYear.list({ gradeId }),
    amplifyData.models.GradeEvent.list({ 
      gradeId,
      sortDirection: 'ASC' 
    }),
    amplifyData.models.GradeSettings.list({ gradeId })
  ])
  
  if (!grade.data) {
    return { success: false, error: 'Grade not found' }
  }
  
  return {
    success: true,
    data: {
      grade: grade.data,
      pupils: pupils.data,
      academicYears: academicYears.data,
      events: events.data,
      settings: settings.data?.[0] || null
    }
  }
}
```

**Benefits of batch queries:**
- ✅ Reduced round trips to API
- ✅ Parallel execution (faster)
- ✅ Atomic fetching of related data
- ✅ Simplified client logic

### 6.3. Caching Strategies

Cache query results on the client to reduce API calls and improve performance.

**Recommendations:**

1. **Server Components (Next.js cache function):**
   ```typescript
   import { cache } from 'react'
   import { amplifyData } from '@/lib/db/amplify'
   
   // Cache at Server Component level
   const getCachedLesson = cache(async (lessonId: string) => {
     return await amplifyData.models.Lesson.get({ id: lessonId })
   })
   
   // Use in Server Component
   export default async function LessonPage({ params }: { params: { id: string } }) {
     const lesson = await getCachedLesson(params.id)
     // ...
   }
   ```

2. **Client Components (React useMemo):**
   ```typescript
   'use client'
   
   import { useMemo } from 'react'
   
   function LessonDetails({ lesson, goldenVerses, homeworkChecks }) {
     const lessonStats = useMemo(() => {
       return {
         totalChecks: homeworkChecks.length,
         averagePoints: homeworkChecks.reduce((sum, check) => sum + check.points, 0) / homeworkChecks.length,
         versesCount: goldenVerses.length
       }
     }, [homeworkChecks, goldenVerses])
     
     // ...
   }
   ```

3. **SWR or React Query (for client-side caching):**
   ```typescript
   'use client'
   
   import useSWR from 'swr'
   import { getLessonComplete } from '@/actions/lessons'
   
   function useLesson(lessonId: string) {
     const { data, error, isLoading } = useSWR(
       lessonId ? `lesson-${lessonId}` : null,
       async () => {
         const result = await getLessonComplete(lessonId)
         if (!result.success) throw new Error(result.error)
         return result.data
       },
       {
         revalidateOnFocus: false,
         revalidateOnReconnect: false,
         dedupingInterval: 5000 // Deduplicate requests within 5 seconds
       }
     )
     
     return { lesson: data, error, isLoading }
   }
   ```

4. **Request Deduplication:**
   ```typescript
   // Deduplicate parallel requests
   const requestCache = new Map<string, Promise<any>>()
   
   async function getCachedLesson(lessonId: string) {
     const cacheKey = `lesson-${lessonId}`
     
     if (requestCache.has(cacheKey)) {
       return requestCache.get(cacheKey)
     }
     
     const promise = amplifyData.models.Lesson.get({ id: lessonId })
     requestCache.set(cacheKey, promise)
     
     try {
       const result = await promise
       return result
     } finally {
       requestCache.delete(cacheKey)
     }
   }
   ```

**Caching Strategy Table:**

| Strategy | When to Use | Example |
|----------|-------------|---------|
| Server Component cache | Static data, rarely changing | List of grades, settings |
| React useMemo | Computed derived data | Statistics, aggregations |
| SWR/React Query | Dynamic data, needs synchronization | Lists of lessons, homework checks |
| Request deduplication | Parallel requests of same type | Batch queries in Server Actions |

**Important Notes:**
- ⚠️ Caching must respect user access rights
- ⚠️ Invalidate cache when data is mutated
- ⚠️ Use `revalidatePath()` or `revalidateTag()` in Server Actions after mutations
- ✅ For MVP, simple Server Component caching is sufficient

---

## 7. Actions by Domain

---

### 6.1. Lessons (`actions/lessons.ts`)

#### 6.1.1. `createLesson`

**Description:** Creates a new lesson for an academic year.

**Authorization:** `TEACHER`, `ADMIN`, `SUPERADMIN`

**Input Schema:**

```typescript
const CreateLessonSchema = z.object({
  academicYearId: z.string().uuid(),
  title: z.string().min(1).max(200),
  content: z.string().optional(), // Rich text from BlockNote
  lessonDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  goldenVerseIds: z.array(z.string().uuid()).max(5),
})

type CreateLessonInput = z.infer<typeof CreateLessonSchema>
```

**Output:**

```typescript
type CreateLessonOutput = {
  id: string
  academicYearId: string
  title: string
  content: string | null
  lessonDate: string
  order: number
  createdAt: string
  updatedAt: string
}
```

**Example:**

```typescript
const result = await createLesson({
  academicYearId: 'uuid-academic-year',
  title: 'Притча о сеятеле',
  content: '<h1>Lesson content</h1>',
  lessonDate: '2025-01-15',
  goldenVerseIds: ['uuid-verse-1', 'uuid-verse-2'],
})

if (result.success) {
  console.log('Lesson created:', result.data.id)
}
```

---

#### 6.1.2. `updateLesson`

**Description:** Updates an existing lesson.

**Authorization:** `TEACHER` (own grade), `ADMIN`, `SUPERADMIN`

**Input Schema:**

```typescript
const UpdateLessonSchema = z.object({
  lessonId: z.string().uuid(),
  title: z.string().min(1).max(200).optional(),
  content: z.string().optional(),
  lessonDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  goldenVerseIds: z.array(z.string().uuid()).max(5).optional(),
})

type UpdateLessonInput = z.infer<typeof UpdateLessonSchema>
```

**Output:** `UpdateLessonOutput` (same structure as `CreateLessonOutput`)

---

#### 6.1.3. `deleteLesson`

**Description:** Soft-deletes a lesson (sets `_deleted = true` in DynamoDB).

**Authorization:** `ADMIN`, `SUPERADMIN`

**Input:**

```typescript
type DeleteLessonInput = {
  lessonId: string
}
```

**Output:**

```typescript
type DeleteLessonOutput = {
  lessonId: string
  deletedAt: string
}
```

---

#### 6.1.4. `getLessonById`

**Description:** Fetches a single lesson with all related data (golden verses, homework checks).

**Authorization:** `TEACHER` (own grade), `ADMIN`, `SUPERADMIN`

**Input:**

```typescript
type GetLessonByIdInput = {
  lessonId: string
}
```

**Output:**

```typescript
type GetLessonByIdOutput = {
  id: string
  academicYearId: string
  title: string
  content: string | null
  lessonDate: string
  order: number
  goldenVerses: Array<{
    id: string
    book: string
    chapter: number
    verse: number
    text: string
  }>
  homeworkChecks: Array<{
    id: string
    pupilId: string
    isCompleted: boolean
    score: number | null
    teacherNotes: string | null
  }>
  createdAt: string
  updatedAt: string
}
```

---

### 6.2. Homework (`actions/homework.ts`)

#### 6.2.1. `checkHomework`

**Description:** Marks homework as checked for a pupil in a specific lesson.

**Authorization:** `TEACHER` (own grade), `ADMIN`, `SUPERADMIN`

**Input Schema:**

```typescript
const CheckHomeworkSchema = z.object({
  lessonId: z.string().uuid(),
  pupilId: z.string().uuid(),
  isCompleted: z.boolean(),
  score: z.number().int().min(0).max(100).optional(), // Max score from GradeSettings
  teacherNotes: z.string().max(500).optional(),
})

type CheckHomeworkInput = z.infer<typeof CheckHomeworkSchema>
```

**Output:**

```typescript
type CheckHomeworkOutput = {
  id: string
  lessonId: string
  pupilId: string
  isCompleted: boolean
  score: number | null
  teacherNotes: string | null
  checkedAt: string
  createdAt: string
  updatedAt: string
}
```

---

#### 6.2.2. `bulkCheckHomework`

**Description:** Batch operation to check homework for multiple pupils in a single lesson.

**Authorization:** `TEACHER`, `ADMIN`, `SUPERADMIN`

**Input Schema:**

```typescript
const BulkCheckHomeworkSchema = z.object({
  lessonId: z.string().uuid(),
  checks: z.array(
    z.object({
      pupilId: z.string().uuid(),
      isCompleted: z.boolean(),
      score: z.number().int().min(0).max(100).optional(),
      teacherNotes: z.string().max(500).optional(),
    })
  ),
})

type BulkCheckHomeworkInput = z.infer<typeof BulkCheckHomeworkSchema>
```

**Output:**

```typescript
type BulkCheckHomeworkOutput = {
  lessonId: string
  checksCreated: number
  checksUpdated: number
  errors: Array<{ pupilId: string; error: string }> // Partial failures
}
```

---

### 6.3. Pupils (`actions/pupils.ts`)

#### 6.3.1. `createPupil`

**Description:** Adds a new pupil to a grade.

**Authorization:** `ADMIN`, `SUPERADMIN`

**Input Schema:**

```typescript
const CreatePupilSchema = z.object({
  gradeId: z.string().uuid(),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  middleName: z.string().max(50).optional(),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  photo: z.string().url().optional(), // S3 URL
  active: z.boolean().default(true),
})

type CreatePupilInput = z.infer<typeof CreatePupilSchema>
```

**Output:**

```typescript
type CreatePupilOutput = {
  id: string
  gradeId: string
  firstName: string
  lastName: string
  middleName: string | null
  dateOfBirth: string
  photo: string | null
  active: boolean
  createdAt: string
  updatedAt: string
}
```

---

#### 6.3.2. `updatePupil`

**Description:** Updates pupil information.

**Authorization:** `ADMIN`, `SUPERADMIN`

**Input Schema:**

```typescript
const UpdatePupilSchema = z.object({
  pupilId: z.string().uuid(),
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  middleName: z.string().max(50).optional(),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  photo: z.string().url().optional(),
  active: z.boolean().optional(),
})

type UpdatePupilInput = z.infer<typeof UpdatePupilSchema>
```

**Output:** `UpdatePupilOutput` (same structure as `CreatePupilOutput`)

---

#### 6.3.3. `deletePupil`

**Description:** Soft-deletes a pupil (sets `active = false`).

**Authorization:** `ADMIN`, `SUPERADMIN`

**Input:**

```typescript
type DeletePupilInput = {
  pupilId: string
}
```

**Output:**

```typescript
type DeletePupilOutput = {
  pupilId: string
  active: false
  updatedAt: string
}
```

---

### 6.4. Grades (`actions/grades.ts`)

#### 6.4.1. `createGrade`

**Description:** Creates a new grade/group.

**Authorization:** `ADMIN`, `SUPERADMIN`

**Input Schema:**

```typescript
const CreateGradeSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  minAge: z.number().int().min(0).max(18),
  maxAge: z.number().int().min(0).max(18),
  active: z.boolean().default(true),
})

type CreateGradeInput = z.infer<typeof CreateGradeSchema>
```

**Output:**

```typescript
type CreateGradeOutput = {
  id: string
  name: string
  description: string | null
  minAge: number
  maxAge: number
  active: boolean
  createdAt: string
  updatedAt: string
}
```

---

#### 6.4.2. `updateGrade`

**Description:** Updates grade information.

**Authorization:** `ADMIN`, `SUPERADMIN`

**Input Schema:** Similar to `CreateGradeSchema` with `gradeId` and optional fields.

---

#### 6.4.3. `assignTeacherToGrade`

**Description:** Assigns a teacher (user) to a grade.

**Authorization:** `ADMIN`, `SUPERADMIN`

**Input Schema:**

```typescript
const AssignTeacherSchema = z.object({
  gradeId: z.string().uuid(),
  userId: z.string().uuid(), // Teacher's user ID
})

type AssignTeacherInput = z.infer<typeof AssignTeacherSchema>
```

**Output:**

```typescript
type AssignTeacherOutput = {
  id: string
  gradeId: string
  userId: string
  assignedAt: string
}
```

---

### 6.5. Academic Years (`actions/academicYears.ts`)

#### 6.5.1. `createAcademicYear`

**Description:** Creates a new academic year for a grade.

**Authorization:** `ADMIN`, `SUPERADMIN`

**Input Schema:**

```typescript
const CreateAcademicYearSchema = z.object({
  gradeId: z.string().uuid(),
  name: z.string().min(1).max(100), // e.g., "2024-2025"
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.enum(['ACTIVE', 'COMPLETED', 'PLANNED']).default('ACTIVE'),
})

type CreateAcademicYearInput = z.infer<typeof CreateAcademicYearSchema>
```

**Output:**

```typescript
type CreateAcademicYearOutput = {
  id: string
  gradeId: string
  name: string
  startDate: string
  endDate: string
  status: 'ACTIVE' | 'COMPLETED' | 'PLANNED'
  createdAt: string
  updatedAt: string
}
```

---

#### 6.5.2. `updateAcademicYear`

**Description:** Updates academic year details or status.

**Authorization:** `ADMIN`, `SUPERADMIN`

**Input Schema:** Similar to `CreateAcademicYearSchema` with `academicYearId` and optional fields.

---

### 6.6. Golden Verses (`actions/goldenVerses.ts`)

#### 6.6.1. `createGoldenVerse`

**Description:** Adds a new golden verse to the library.

**Authorization:** `TEACHER`, `ADMIN`, `SUPERADMIN`

**Input Schema:**

```typescript
const CreateGoldenVerseSchema = z.object({
  bookId: z.string().uuid(), // ID книги из таблицы Books
  reference: z.string().min(1).max(100), // e.g., "Иоанна 3:16"
  chapter: z.number().int().min(1),
  verseStart: z.number().int().min(1),
  verseEnd: z.number().int().min(1).optional(),
  text: z.string().min(1).max(1000),
})

type CreateGoldenVerseInput = z.infer<typeof CreateGoldenVerseSchema>
```

**Output:**

```typescript
type CreateGoldenVerseOutput = {
  id: string
  bookId: string
  book: {
    id: string
    fullName: string
    shortName: string
    abbreviation: string
  }
  reference: string
  chapter: number
  verseStart: number
  verseEnd?: number
  text: string
  createdAt: string
  updatedAt: string
}
```

---

#### 6.6.2. `searchGoldenVerses`

**Description:** Searches golden verses by book, chapter, or text.

**Authorization:** `TEACHER`, `ADMIN`, `SUPERADMIN`

**Input Schema:**

```typescript
const SearchGoldenVersesSchema = z.object({
  query: z.string().min(1).max(100),
  limit: z.number().int().min(1).max(50).default(10),
})

type SearchGoldenVersesInput = z.infer<typeof SearchGoldenVersesSchema>
```

**Output:**

```typescript
type SearchGoldenVersesOutput = Array<{
  id: string
  bookId: string
  book: {
    shortName: string
    fullName: string
  }
  reference: string
  chapter: number
  verseStart: number
  verseEnd?: number
  text: string
}>
```

---

### 6.7. Books (`actions/books.ts`)

#### 6.7.1. `listBooks`

**Description:** Returns a list of all Bible books, optionally filtered by testament.

**Authorization:** `TEACHER`, `ADMIN`, `SUPERADMIN`

**Input Schema:**

```typescript
const ListBooksSchema = z.object({
  testament: z.enum(['OLD', 'NEW']).optional(),
  limit: z.number().int().min(1).max(100).default(66),
})

type ListBooksInput = z.infer<typeof ListBooksSchema>
```

**Output:**

```typescript
type ListBooksOutput = Array<{
  id: string
  fullName: string
  shortName: string
  abbreviation: string
  testament: 'OLD' | 'NEW'
  order: number
  createdAt: string
  updatedAt: string
}>
```

---

#### 6.7.2. `getBook`

**Description:** Gets a single book by ID.

**Authorization:** `TEACHER`, `ADMIN`, `SUPERADMIN`

**Input Schema:**

```typescript
const GetBookSchema = z.object({
  id: z.string().uuid(),
})

type GetBookInput = z.infer<typeof GetBookSchema>
```

**Output:**

```typescript
type GetBookOutput = {
  id: string
  fullName: string
  shortName: string
  abbreviation: string
  testament: 'OLD' | 'NEW'
  order: number
  createdAt: string
  updatedAt: string
}
```

---

#### 6.7.3. `searchBooks`

**Description:** Searches books by name (fullName, shortName, or abbreviation).

**Authorization:** `TEACHER`, `ADMIN`, `SUPERADMIN`

**Input Schema:**

```typescript
const SearchBooksSchema = z.object({
  query: z.string().min(1).max(100),
  limit: z.number().int().min(1).max(66).default(10),
})

type SearchBooksInput = z.infer<typeof SearchBooksSchema>
```

**Output:**

```typescript
type SearchBooksOutput = Array<{
  id: string
  fullName: string
  shortName: string
  abbreviation: string
  testament: 'OLD' | 'NEW'
  order: number
}>
```

---

#### 6.7.4. `seedBooks` (Admin only)

**Description:** Fills the Books table with all 66 Bible books. Should be executed once during database initialization.

**Authorization:** `ADMIN`, `SUPERADMIN`

**Input Schema:**

```typescript
// No input required - uses predefined data from scripts/seed-books-data.ts
```

**Output:**

```typescript
type SeedBooksOutput = {
  success: true
  data: {
    created: number // Number of books created (should be 66)
  }
} | {
  success: false
  error: string
}
```

---

### 6.8. Users (`actions/users.ts`)

#### 6.7.1. `createUser`

**Description:** Creates a new user (Teacher, Admin).

**Authorization:** `ADMIN`, `SUPERADMIN`

**Input Schema:**

```typescript
const CreateUserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100), // Will be hashed
  role: z.enum(['TEACHER', 'ADMIN', 'SUPERADMIN']),
  image: z.string().url().optional(),
  active: z.boolean().default(true),
})

type CreateUserInput = z.infer<typeof CreateUserSchema>
```

**Output:**

```typescript
type CreateUserOutput = {
  id: string
  name: string
  email: string
  role: 'TEACHER' | 'ADMIN' | 'SUPERADMIN'
  image: string | null
  active: boolean
  createdAt: string
  updatedAt: string
}
```

---

#### 6.7.2. `updateUser`

**Description:** Updates user information or role.

**Authorization:** `ADMIN`, `SUPERADMIN` (only SUPERADMIN can update other admins)

**Input Schema:** Similar to `CreateUserSchema` with `userId` and optional fields.

---

#### 6.7.3. `deactivateUser`

**Description:** Deactivates a user (sets `active = false`).

**Authorization:** `ADMIN`, `SUPERADMIN`

**Input:**

```typescript
type DeactivateUserInput = {
  userId: string
}
```

**Output:**

```typescript
type DeactivateUserOutput = {
  userId: string
  active: false
  updatedAt: string
}
```

---

### 6.8. Achievements (`actions/achievements.ts`)

#### 6.8.1. `createAchievement`

**Description:** Creates a new achievement type.

**Authorization:** `ADMIN`, `SUPERADMIN`

**Input Schema:**

```typescript
const CreateAchievementSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  icon: z.string().max(100), // Icon name or URL
  points: z.number().int().min(0),
})

type CreateAchievementInput = z.infer<typeof CreateAchievementSchema>
```

**Output:**

```typescript
type CreateAchievementOutput = {
  id: string
  name: string
  description: string | null
  icon: string
  points: number
  createdAt: string
  updatedAt: string
}
```

---

#### 6.8.2. `awardAchievementToPupil`

**Description:** Awards an achievement to a pupil.

**Authorization:** `TEACHER` (own grade), `ADMIN`, `SUPERADMIN`

**Input Schema:**

```typescript
const AwardAchievementSchema = z.object({
  pupilId: z.string().uuid(),
  achievementId: z.string().uuid(),
})

type AwardAchievementInput = z.infer<typeof AwardAchievementSchema>
```

**Output:**

```typescript
type AwardAchievementOutput = {
  id: string
  pupilId: string
  achievementId: string
  awardedAt: string
  createdAt: string
}
```

---

### 6.9. Grade Events (`actions/gradeEvents.ts`)

#### 6.9.1. `createGradeEvent`

**Description:** Creates a calendar event for a grade (lesson, outdoor event, cancellation).

**Authorization:** `ADMIN`, `SUPERADMIN`

**Input Schema:**

```typescript
const CreateGradeEventSchema = z.object({
  gradeId: z.string().uuid(),
  academicYearId: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  eventType: z.enum(['LESSON', 'OUTDOOR_EVENT', 'LESSON_SKIPPING']),
})

type CreateGradeEventInput = z.infer<typeof CreateGradeEventSchema>
```

**Output:**

```typescript
type CreateGradeEventOutput = {
  id: string
  gradeId: string
  academicYearId: string
  title: string
  description: string | null
  eventDate: string
  eventType: 'LESSON' | 'OUTDOOR_EVENT' | 'LESSON_SKIPPING'
  createdAt: string
  updatedAt: string
}
```

---

### 6.10. Grade Settings (`actions/gradeSettings.ts`)

#### 6.10.1. `updateGradeSettings`

**Description:** Updates settings for a specific grade.

**Authorization:** `ADMIN`, `SUPERADMIN`

**Input Schema:**

```typescript
const UpdateGradeSettingsSchema = z.object({
  gradeId: z.string().uuid(),
  maxGoldenVersesPerLesson: z.number().int().min(1).max(10).optional(),
  maxHomeworkScore: z.number().int().min(1).max(100).optional(),
})

type UpdateGradeSettingsInput = z.infer<typeof UpdateGradeSettingsSchema>
```

**Output:**

```typescript
type UpdateGradeSettingsOutput = {
  id: string
  gradeId: string
  maxGoldenVersesPerLesson: number
  maxHomeworkScore: number
  updatedAt: string
}
```

---

### 6.11. Authentication (`actions/auth.ts`)

#### 6.11.1. `signIn`

**Description:** Authenticates a user with email and password (via AWS Cognito).

**Authorization:** Public

**Input Schema:**

```typescript
const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

type SignInInput = z.infer<typeof SignInSchema>
```

**Output:**

```typescript
type SignInOutput = {
  userId: string
  name: string
  email: string
  role: 'TEACHER' | 'ADMIN' | 'SUPERADMIN'
  sessionToken: string // JWT or session ID
}
```

---

#### 6.11.2. `signOut`

**Description:** Logs out the current user.

**Authorization:** Authenticated user

**Input:** None

**Output:**

```typescript
type SignOutOutput = {
  success: true
}
```

---

## 8. Error Handling Best Practices

### 7.1. Granular Error Messages

-   **User-facing errors:** Clear, actionable messages (e.g., "Lesson date must be in the future").
-   **Developer errors:** Log detailed error info to server logs (not returned to client).

### 7.2. Zod Validation Errors

```typescript
if (error instanceof z.ZodError) {
  return {
    success: false,
    error: 'Validation failed. Please check your input.',
    fieldErrors: error.flatten().fieldErrors,
  }
}
```

**Example `fieldErrors`:**

```json
{
  "title": ["Title is required"],
  "lessonDate": ["Invalid date format"]
}
```

### 7.3. Authorization Errors

```typescript
if (!hasPermission(user, 'ADMIN')) {
  return {
    success: false,
    error: 'You do not have permission to perform this action.',
  }
}
```

---

## 9. Revalidation Strategies

### 8.1. `revalidatePath()`

Use to invalidate cached pages/routes after mutations:

```typescript
import { revalidatePath } from 'next/cache'

export async function createLesson(input: CreateLessonInput) {
  // ... create lesson logic

  revalidatePath(`/grades/${gradeId}/academic-years/${academicYearId}/lessons`)
  revalidatePath(`/grades/${gradeId}`) // Also revalidate parent page
  
  return { success: true, data: lesson }
}
```

### 8.2. `revalidateTag()`

Use for more granular cache control with fetch tags:

```typescript
import { revalidateTag } from 'next/cache'

// When fetching data:
fetch('/api/lessons', {
  next: { tags: ['lessons', `grade-${gradeId}`] }
})

// In Server Action:
revalidateTag('lessons')
revalidateTag(`grade-${gradeId}`)
```

---

## 10. Testing Server Actions

### 9.1. Unit Testing

Use **Vitest** or **Jest** to test Server Actions in isolation:

```typescript
import { describe, it, expect, vi } from 'vitest'
import { createLesson } from './lessons'

vi.mock('@/lib/db/amplify', () => ({
  amplifyClient: {
    models: {
      Lesson: {
        create: vi.fn().mockResolvedValue({
          id: 'lesson-1',
          title: 'Test Lesson',
        }),
      },
    },
  },
}))

describe('createLesson', () => {
  it('should create a lesson with valid input', async () => {
    const result = await createLesson({
      academicYearId: 'year-1',
      title: 'Test Lesson',
      lessonDate: '2025-01-15',
      goldenVerseIds: [],
    })

    expect(result.success).toBe(true)
    expect(result.data?.title).toBe('Test Lesson')
  })

  it('should return error for invalid input', async () => {
    const result = await createLesson({
      academicYearId: 'year-1',
      title: '', // Invalid: empty title
      lessonDate: '2025-01-15',
      goldenVerseIds: [],
    })

    expect(result.success).toBe(false)
    expect(result.error).toContain('Title is required')
  })
})
```

### 9.2. Integration Testing

Use **Playwright** or **Cypress** to test Server Actions through the UI:

```typescript
test('Teacher can create a new lesson', async ({ page }) => {
  await page.goto('/grades/grade-1/lessons/new')
  
  await page.fill('input[name="title"]', 'New Lesson')
  await page.fill('input[name="lessonDate"]', '2025-02-01')
  await page.click('button[type="submit"]')

  await expect(page).toHaveURL(/\/lessons\/[a-z0-9-]+/)
  await expect(page.locator('h1')).toContainText('New Lesson')
})
```

---

## 11. Performance Optimization

### 10.1. Parallel Data Fetching

When fetching multiple related entities, use `Promise.all()`:

```typescript
export async function getLessonWithRelatedData(lessonId: string) {
  const [lesson, goldenVerses, homeworkChecks] = await Promise.all([
    amplifyClient.models.Lesson.get({ id: lessonId }),
    amplifyClient.models.LessonGoldenVerse.list({ lessonId }),
    amplifyClient.models.HomeworkCheck.list({ lessonId }),
  ])

  return { lesson, goldenVerses, homeworkChecks }
}
```

### 10.2. Debouncing Server Action Calls

For search or autocomplete, debounce client-side before calling Server Actions:

```tsx
import { useDebouncedCallback } from 'use-debounce'

const debouncedSearch = useDebouncedCallback(async (query) => {
  const results = await searchGoldenVerses({ query })
  setSearchResults(results.data)
}, 300)
```

---

## 12. Cross-References

-   **→ [VALIDATION.md](VALIDATION.md):** Full Zod schema definitions for all inputs.
-   **→ [GRAPHQL_SCHEMA.md](../database/GRAPHQL_SCHEMA.md):** AppSync GraphQL types and queries.
-   **→ [SCHEMA_DIFFERENCES.md](../database/SCHEMA_DIFFERENCES.md):** Differences between current and documented schema, reasons for removing @belongsTo/@hasMany.
-   **→ [DATA_MODELING.md](../database/DATA_MODELING.md):** Data modeling patterns and access patterns.
-   **→ [ARCHITECTURE.md](../architecture/ARCHITECTURE.md):** Overall system architecture.
-   **→ [SECURITY.md](../infrastructure/SECURITY.md):** Authentication and authorization details.
-   **→ [COMPONENT_LIBRARY.md](../components/COMPONENT_LIBRARY.md):** UI components that consume Server Actions.

---

## 13. Resources

-   **Next.js Server Actions Documentation:** https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
-   **Zod Documentation:** https://zod.dev
-   **AWS Amplify Gen 1 Documentation:** https://docs.amplify.aws/gen1/javascript/
-   **React 19 useTransition Hook:** https://react.dev/reference/react/useTransition

---

**End of Server Actions Documentation**

