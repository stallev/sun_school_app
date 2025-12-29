# Component Library - Sunday School App

## Document Version: 1.0
**Creation Date:** 23 December 2025  
**Last Update:** 23 December 2025  
**Project:** Sunday School App  
**Technologies:** React 19, Next.js 15.5.9 (App Router, Server Components), Shadcn UI, Tailwind CSS, TypeScript  
**Target Audience:** Frontend Developers, UI/UX Designers

---

## 1. Overview

This document provides a comprehensive catalog of all React components used in the Sunday School App. Components are organized using **Atomic Design** principles, built with **Shadcn UI**, and styled with **Tailwind CSS**. The library supports both **Server Components** (default) and **Client Components** (marked with `'use client'`).

### 1.1 Component Architecture Principles

-   **Atomic Design Hierarchy:**
    -   **Atoms:** Smallest, reusable UI elements (buttons, inputs, icons).
    -   **Molecules:** Combinations of atoms (form fields, cards).
    -   **Organisms:** Complex UI sections composed of molecules and atoms (navigation bars, forms, tables).
    -   **Templates:** Page-level layouts (application shell, content areas).
    -   **Pages:** Final rendered pages with data fetching (Next.js routes).

-   **Server Components First:** All components are Server Components by default for optimal performance. Client Components are used only when interactivity is required (e.g., forms, modals, state management).

-   **Composition Over Configuration:** Components are designed to be composable and flexible.

-   **Type Safety:** Full TypeScript support with strict prop types.

-   **Accessibility:** WCAG 2.1 AA compliance for all interactive components.

---

## 2. Directory Structure

```
components/
├── ui/                  # Shadcn UI primitives (atoms)
│   ├── button.tsx
│   ├── card.tsx
│   ├── form.tsx
│   ├── input.tsx
│   ├── dialog.tsx
│   ├── table.tsx
│   ├── badge.tsx
│   ├── dropdown-menu.tsx
│   ├── calendar.tsx
│   ├── avatar.tsx
│   └── ... (other Shadcn components)
│
├── atoms/               # Custom atomic components
│   ├── icon.tsx
│   ├── logo.tsx
│   └── spinner.tsx
│
├── molecules/           # Composite components
│   ├── form-field.tsx
│   ├── lesson-card.tsx
│   ├── pupil-avatar.tsx
│   ├── grade-selector.tsx
│   └── date-picker-field.tsx
│
├── organisms/           # Complex UI sections
│   ├── navigation/
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   └── mobile-nav.tsx
│   ├── lessons/
│   │   ├── lesson-list.tsx
│   │   ├── lesson-form.tsx
│   │   └── lesson-detail.tsx
│   ├── pupils/
│   │   ├── pupil-table.tsx
│   │   ├── pupil-form.tsx
│   │   └── pupil-profile.tsx
│   ├── homework/
│   │   ├── homework-check-form.tsx
│   │   └── homework-summary.tsx
│   └── grades/
│       ├── grade-list.tsx
│       └── grade-overview.tsx
│
└── templates/           # Page layouts
    ├── app-shell.tsx
    ├── auth-layout.tsx
    └── dashboard-layout.tsx
```

---

## 3. Shadcn UI Components (Atoms)

These are the foundational UI primitives from **Shadcn UI**. Full documentation: https://ui.shadcn.com

### 3.1. Button

**File:** `components/ui/button.tsx`

**Description:** Primary interactive element for actions.

**Props:**

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean // For rendering as a child element (e.g., <Link>)
}
```

**Example:**

```tsx
import { Button } from '@/components/ui/button'

<Button variant="default">Сохранить</Button>
<Button variant="outline" size="sm">Отмена</Button>
<Button variant="destructive">Удалить</Button>
```

---

### 3.2. Card

**File:** `components/ui/card.tsx`

**Description:** Container for grouping related content.

**Subcomponents:** `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`

**Example:**

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Урок 1</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Притча о сеятеле</p>
  </CardContent>
</Card>
```

---

### 3.3. Form

**File:** `components/ui/form.tsx`

**Description:** Form wrapper with validation support (React Hook Form + Zod).

**Subcomponents:** `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage`

**Example:**

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import * as z from 'zod'

const formSchema = z.object({
  title: z.string().min(1, 'Обязательное поле'),
})

export function LessonForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: '' },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await createLesson(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название урока</FormLabel>
              <FormControl>
                <Input placeholder="Введите название" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Создать урок</Button>
      </form>
    </Form>
  )
}
```

---

### 3.4. Input

**File:** `components/ui/input.tsx`

**Description:** Text input field.

**Props:**

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
```

**Example:**

```tsx
import { Input } from '@/components/ui/input'

<Input type="text" placeholder="Введите текст" />
```

---

### 3.5. Textarea

**File:** `components/ui/textarea.tsx`

**Description:** Multi-line text input field.

**Example:**

```tsx
import { Textarea } from '@/components/ui/textarea'

<Textarea placeholder="Комментарии преподавателя" rows={4} />
```

---

### 3.6. Select

**File:** `components/ui/select.tsx`

**Description:** Dropdown select menu.

**Subcomponents:** `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`

**Example:**

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

<Select onValueChange={handleChange}>
  <SelectTrigger>
    <SelectValue placeholder="Выберите группу" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="grade-1">Младшая группа</SelectItem>
    <SelectItem value="grade-2">Средняя группа</SelectItem>
  </SelectContent>
</Select>
```

---

### 3.7. Dialog (Modal)

**File:** `components/ui/dialog.tsx`

**Description:** Modal dialog for confirmations and forms.

**Subcomponents:** `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`

**Example:**

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">Открыть</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Подтверждение</DialogTitle>
    </DialogHeader>
    <p>Вы уверены?</p>
  </DialogContent>
</Dialog>
```

---

### 3.8. Table

**File:** `components/ui/table.tsx`

**Description:** Data table for displaying tabular data.

**Subcomponents:** `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`

**Example:**

```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Фамилия</TableHead>
      <TableHead>Имя</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Иванов</TableCell>
      <TableCell>Иван</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

---

### 3.9. Badge

**File:** `components/ui/badge.tsx`

**Description:** Status indicator or label.

**Props:**

```typescript
interface BadgeProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
}
```

**Example:**

```tsx
import { Badge } from '@/components/ui/badge'

<Badge variant="default">Активно</Badge>
<Badge variant="destructive">Отменено</Badge>
```

---

### 3.10. Calendar

**File:** `components/ui/calendar.tsx`

**Description:** Date picker calendar (powered by `react-day-picker`).

**Example:**

```tsx
import { Calendar } from '@/components/ui/calendar'
import { useState } from 'react'

export function DatePicker() {
  const [date, setDate] = useState<Date>()

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border"
    />
  )
}
```

---

### 3.11. Avatar

**File:** `components/ui/avatar.tsx`

**Description:** User profile image with fallback.

**Subcomponents:** `Avatar`, `AvatarImage`, `AvatarFallback`

**Example:**

```tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

<Avatar>
  <AvatarImage src="/avatars/user.jpg" alt="User" />
  <AvatarFallback>UI</AvatarFallback>
</Avatar>
```

---

## 4. Custom Atoms

### 4.1. Logo

**File:** `src/components/atoms/logo.tsx`

**Description:** Application logo placeholder component.

**Type:** Server Component

**Props:**

```typescript
interface LogoProps {
  size?: 'sm' | 'md' | 'lg' // Default: 'md'
  className?: string
}
```

**Example:**

```tsx
import { Logo } from '@/components/atoms/logo'

<Logo size="lg" />
```

**Note:** Currently displays "SS" as a placeholder. Can be replaced with actual logo SVG/image in the future.

---

### 4.2. Spinner

**File:** `src/components/atoms/spinner.tsx`

**Description:** Loading spinner component using Lucide React Loader2 icon.

**Type:** Server Component

**Props:**

```typescript
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' // Default: 'md'
  className?: string
}
```

**Example:**

```tsx
import { Spinner } from '@/components/atoms/spinner'

<Spinner size="md" />
```

---

### 4.3. Icon

**File:** `src/components/atoms/icon.tsx`

**Description:** Wrapper for Lucide React icons.

**Type:** Server Component (can be used in Client Components)

**Props:**

```typescript
import { type LucideIcon } from 'lucide-react'

interface IconProps {
  icon: LucideIcon
  size?: number // Default: 20
  className?: string
}
```

**Example:**

```tsx
import { Icon } from '@/components/atoms/icon'
import { Home } from '@/lib/utils/icons'

<Icon icon={Home} size={24} />
```

**Note:** Frequently used icons are exported from `@/lib/utils/icons` for convenience.

---

## 5. Molecules

### 5.1. LessonCard

**File:** `components/molecules/lesson-card.tsx`

**Description:** Card displaying lesson summary.

**Type:** Server Component

**Props:**

```typescript
interface LessonCardProps {
  lesson: {
    id: string
    title: string
    lessonDate: string
    order: number
  }
  gradeId: string
  academicYearId: string
}
```

**Example:**

```tsx
import { LessonCard } from '@/components/molecules/lesson-card'

<LessonCard
  lesson={{
    id: 'lesson-1',
    title: 'Притча о сеятеле',
    lessonDate: '2025-01-15',
    order: 1,
  }}
  gradeId="grade-1"
  academicYearId="year-1"
/>
```

**Implementation:**

```tsx
import { Card, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

export function LessonCard({ lesson, gradeId, academicYearId }: LessonCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>
            {lesson.order}. {lesson.title}
          </span>
          <span className="text-sm text-muted-foreground">
            {format(new Date(lesson.lessonDate), 'PPP', { locale: ru })}
          </span>
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href={`/grades/${gradeId}/academic-years/${academicYearId}/lessons/${lesson.id}`}>
            Просмотр
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link href={`/grades/${gradeId}/academic-years/${academicYearId}/lessons/${lesson.id}/edit`}>
            Редактировать
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
```

---

### 5.2. PupilAvatar

**File:** `components/molecules/pupil-avatar.tsx`

**Description:** Avatar displaying pupil's photo or initials.

**Type:** Server Component

**Props:**

```typescript
interface PupilAvatarProps {
  pupil: {
    firstName: string
    lastName: string
    photo?: string | null
  }
  size?: 'sm' | 'md' | 'lg'
}
```

**Example:**

```tsx
import { PupilAvatar } from '@/components/molecules/pupil-avatar'

<PupilAvatar
  pupil={{ firstName: 'Иван', lastName: 'Иванов', photo: null }}
  size="md"
/>
```

---

### 5.3. GradeSelector

**File:** `components/molecules/grade-selector.tsx`

**Description:** Dropdown for selecting a grade (for teachers with multiple grades).

**Type:** Client Component (`'use client'`)

**Props:**

```typescript
interface GradeSelectorProps {
  grades: Array<{ id: string; name: string }>
  currentGradeId: string
  onSelectGrade: (gradeId: string) => void
}
```

**Example:**

```tsx
'use client'

import { GradeSelector } from '@/components/molecules/grade-selector'
import { useRouter } from 'next/navigation'

export function GradeNav({ grades, currentGradeId }) {
  const router = useRouter()

  return (
    <GradeSelector
      grades={grades}
      currentGradeId={currentGradeId}
      onSelectGrade={(gradeId) => router.push(`/grades/${gradeId}`)}
    />
  )
}
```

---

### 5.4. DatePickerField

**File:** `components/molecules/date-picker-field.tsx`

**Description:** Date picker integrated with React Hook Form.

**Type:** Client Component

**Props:**

```typescript
import { Control, FieldPath, FieldValues } from 'react-hook-form'

interface DatePickerFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label: string
  placeholder?: string
}
```

**Example:**

```tsx
import { DatePickerField } from '@/components/molecules/date-picker-field'
import { useForm } from 'react-hook-form'

export function LessonForm() {
  const form = useForm()

  return (
    <DatePickerField
      control={form.control}
      name="lessonDate"
      label="Дата урока"
      placeholder="Выберите дату"
    />
  )
}
```

---

## 6. Organisms

### 6.1. Navigation

#### 6.1.1. Sidebar

**File:** `components/organisms/navigation/sidebar.tsx`

**Description:** Main navigation sidebar.

**Type:** Server Component

**Props:**

```typescript
interface SidebarProps {
  user: {
    name: string
    role: 'TEACHER' | 'ADMIN' | 'SUPERADMIN'
    image?: string | null
  }
  currentPath: string
}
```

**Example:**

```tsx
import { Sidebar } from '@/components/organisms/navigation/sidebar'

<Sidebar
  user={{ name: 'Иван Иванов', role: 'TEACHER', image: null }}
  currentPath="/grades/my"
/>
```

**Implementation (Simplified):**

```tsx
import Link from 'next/link'
import { Home, Users, Calendar, Settings } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function Sidebar({ user, currentPath }: SidebarProps) {
  const navItems = [
    { href: '/grades/my', label: 'Мои группы', icon: Home },
    { href: '/pupils', label: 'Ученики', icon: Users },
    { href: '/schedule', label: 'Расписание', icon: Calendar },
  ]

  if (user.role === 'ADMIN' || user.role === 'SUPERADMIN') {
    navItems.push({ href: '/settings', label: 'Настройки', icon: Settings })
  }

  return (
    <aside className="w-64 border-r border-border bg-card px-4 py-6">
      <div className="mb-8 flex items-center gap-3">
        <Avatar>
          <AvatarImage src={user.image || undefined} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.role}</p>
        </div>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              currentPath === item.href
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            }`}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
```

---

#### 6.1.2. Header

**File:** `components/organisms/navigation/header.tsx`

**Description:** Page header with breadcrumbs and actions.

**Type:** Server Component

**Props:**

```typescript
interface HeaderProps {
  title: string
  breadcrumbs?: Array<{ label: string; href: string }>
  actions?: React.ReactNode
}
```

**Example:**

```tsx
import { Header } from '@/components/organisms/navigation/header'
import { Button } from '@/components/ui/button'

<Header
  title="Уроки 2024-2025"
  breadcrumbs={[
    { label: 'Группы', href: '/grades' },
    { label: 'Младшая группа', href: '/grades/grade-1' },
  ]}
  actions={<Button>➕ Создать урок</Button>}
/>
```

---

### 6.2. Lessons

#### 6.2.1. LessonList

**File:** `components/organisms/lessons/lesson-list.tsx`

**Description:** Displays a list of lessons for an academic year.

**Type:** Server Component

**Props:**

```typescript
interface LessonListProps {
  lessons: Array<{
    id: string
    title: string
    lessonDate: string
    order: number
  }>
  gradeId: string
  academicYearId: string
}
```

**Example:**

```tsx
import { LessonList } from '@/components/organisms/lessons/lesson-list'

<LessonList
  lessons={lessonsData}
  gradeId="grade-1"
  academicYearId="year-1"
/>
```

---

#### 6.2.2. LessonForm

**File:** `components/organisms/lessons/lesson-form.tsx`

**Description:** Form for creating/editing lessons.

**Type:** Client Component (`'use client'`)

**Props:**

```typescript
interface LessonFormProps {
  mode: 'create' | 'edit'
  gradeId: string
  academicYearId: string
  initialData?: {
    id: string
    title: string
    content: string | null
    lessonDate: string
    goldenVerseIds: string[]
  }
}
```

**Example:**

```tsx
import { LessonForm } from '@/components/organisms/lessons/lesson-form'

<LessonForm
  mode="create"
  gradeId="grade-1"
  academicYearId="year-1"
/>
```

---

### 6.3. Pupils

#### 6.3.1. PupilTable

**File:** `components/organisms/pupils/pupil-table.tsx`

**Description:** Sortable, filterable table of pupils.

**Type:** Client Component (for sorting/filtering)

**Props:**

```typescript
interface PupilTableProps {
  pupils: Array<{
    id: string
    firstName: string
    lastName: string
    dateOfBirth: string
    gradeId: string
    active: boolean
  }>
}
```

**Example:**

```tsx
import { PupilTable } from '@/components/organisms/pupils/pupil-table'

<PupilTable pupils={pupilsData} />
```

---

#### 6.3.2. PupilForm

**File:** `components/organisms/pupils/pupil-form.tsx`

**Description:** Form for creating/editing pupil profiles.

**Type:** Client Component

**Props:**

```typescript
interface PupilFormProps {
  mode: 'create' | 'edit'
  gradeId: string
  initialData?: {
    id: string
    firstName: string
    lastName: string
    middleName: string | null
    dateOfBirth: string
    photo: string | null
  }
}
```

---

### 6.4. Homework

#### 6.4.1. HomeworkCheckForm

**File:** `components/organisms/homework/homework-check-form.tsx`

**Description:** Form for checking homework for pupils.

**Type:** Client Component

**Props:**

```typescript
interface HomeworkCheckFormProps {
  lessonId: string
  pupils: Array<{
    id: string
    firstName: string
    lastName: string
  }>
  maxScore: number
}
```

**Example:**

```tsx
import { HomeworkCheckForm } from '@/components/organisms/homework/homework-check-form'

<HomeworkCheckForm
  lessonId="lesson-1"
  pupils={pupilsData}
  maxScore={10}
/>
```

---

## 7. Templates

### 7.1. AppShell

**File:** `components/templates/app-shell.tsx`

**Description:** Main application layout with sidebar and header.

**Type:** Server Component

**Props:**

```typescript
interface AppShellProps {
  user: {
    name: string
    role: 'TEACHER' | 'ADMIN' | 'SUPERADMIN'
    image?: string | null
  }
  currentPath: string
  children: React.ReactNode
}
```

**Example:**

```tsx
import { AppShell } from '@/components/templates/app-shell'

export default function DashboardLayout({ children }) {
  const user = await getAuthenticatedUser()

  return (
    <AppShell user={user} currentPath="/grades/my">
      {children}
    </AppShell>
  )
}
```

---

### 7.2. AuthLayout

**File:** `components/templates/auth-layout.tsx`

**Description:** Layout for authentication pages (login, register).

**Type:** Server Component

**Props:**

```typescript
interface AuthLayoutProps {
  children: React.ReactNode
}
```

**Example:**

```tsx
import { AuthLayout } from '@/components/templates/auth-layout'

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  )
}
```

---

## 8. Component Best Practices

### 8.1. Server Component Default

-   Always create components as Server Components unless interactivity is required.
-   Only add `'use client'` when you need:
    -   `useState`, `useEffect`, `useContext`, etc.
    -   Event handlers (`onClick`, `onChange`, etc.)
    -   Browser APIs (`window`, `localStorage`, etc.)

### 8.2. Prop Types with TypeScript

-   Always define strict prop types using TypeScript interfaces.
-   Use `React.FC` or explicit function signatures.

```typescript
interface MyComponentProps {
  title: string
  count: number
  optional?: string
}

export function MyComponent({ title, count, optional }: MyComponentProps) {
  // ...
}
```

### 8.3. JSDoc Comments

-   Add JSDoc comments to all custom components for better developer experience.

```typescript
/**
 * LessonCard - Displays a summary of a lesson
 * @param lesson - Lesson object with id, title, date
 * @param gradeId - ID of the grade
 * @param academicYearId - ID of the academic year
 */
export function LessonCard({ lesson, gradeId, academicYearId }: LessonCardProps) {
  // ...
}
```

### 8.4. Composition

-   Prefer composition over props drilling for complex components.

```tsx
// Good: Composition
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// Bad: Props drilling
<Card title="Title" content="Content" />
```

### 8.5. Accessibility

-   Always include `aria-label`, `alt` text, and semantic HTML.
-   Test with keyboard navigation and screen readers.

```tsx
<Button aria-label="Создать новый урок">➕</Button>
<img src="/avatar.jpg" alt="Профиль ученика Иван Иванов" />
```

---

## 9. Testing Components

### 9.1. Unit Testing with Vitest + React Testing Library

```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { LessonCard } from './lesson-card'

describe('LessonCard', () => {
  it('renders lesson title', () => {
    render(
      <LessonCard
        lesson={{ id: '1', title: 'Test Lesson', lessonDate: '2025-01-15', order: 1 }}
        gradeId="grade-1"
        academicYearId="year-1"
      />
    )

    expect(screen.getByText('Test Lesson')).toBeInTheDocument()
  })
})
```

### 9.2. Component Testing with Storybook

```typescript
// lesson-card.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { LessonCard } from './lesson-card'

const meta: Meta<typeof LessonCard> = {
  title: 'Molecules/LessonCard',
  component: LessonCard,
}

export default meta
type Story = StoryObj<typeof LessonCard>

export const Default: Story = {
  args: {
    lesson: { id: '1', title: 'Притча о сеятеле', lessonDate: '2025-01-15', order: 1 },
    gradeId: 'grade-1',
    academicYearId: 'year-1',
  },
}
```

---

## 10. Cross-References

-   **→ [DESIGN_SYSTEM.md](../ui_ux/DESIGN_SYSTEM.md):** UI tokens, colors, typography, and Shadcn UI usage.
-   **→ [SERVER_ACTIONS.md](../api/SERVER_ACTIONS.md):** Server Actions consumed by Client Components.
-   **→ [VALIDATION.md](../api/VALIDATION.md):** Zod schemas used in form components.
-   **→ [WIREFRAMES.md](../ui_ux/WIREFRAMES.md):** Visual layout references for components.

---

## 11. Resources

-   **Shadcn UI Documentation:** https://ui.shadcn.com
-   **Radix UI Documentation:** https://www.radix-ui.com
-   **React 19 Documentation:** https://react.dev
-   **Next.js Server Components:** https://nextjs.org/docs/app/building-your-application/rendering/server-components
-   **React Testing Library:** https://testing-library.com/docs/react-testing-library/intro

---

**End of Component Library Documentation**

