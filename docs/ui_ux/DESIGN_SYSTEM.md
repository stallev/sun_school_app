# Design System - Sunday School App

## Document Version: 1.0
**Creation Date:** 23 December 2025  
**Last Update:** 23 December 2025  
**Project:** Sunday School App  
**Technologies:** Shadcn UI, Radix UI, Tailwind CSS, Next.js 15.5.9, React 19  
**Target Audience:** UI/UX Designers, Frontend Developers

---

## 1. Overview

This document defines the design system for the Sunday School App, built on **Shadcn UI**, **Radix UI**, and **Tailwind CSS**. It establishes a consistent visual language, component library, and design principles to ensure a cohesive, accessible, and maintainable user interface across the application.

### 1.1 Key Principles

-   **Consistency:** Uniform appearance and behavior across all UI elements.
-   **Accessibility (a11y):** WCAG 2.1 AA compliance for all interactive components.
-   **Modularity:** Reusable components that can be composed into complex interfaces.
-   **Customizability:** Easy to adapt colors, typography, and spacing via Tailwind CSS and CSS variables.
-   **Performance:** Lightweight components optimized for React 19 and Server Components.
-   **Developer Experience:** Clear documentation and type-safe props (TypeScript).

---

## 2. Design Tokens

Design tokens are the atomic values used throughout the design system. They are defined using Tailwind CSS configuration and CSS variables.

### 2.1. Color Palette

The color palette is defined in `tailwind.config.ts` and uses CSS variables for theming support (light/dark mode).

#### 2.1.1. Primary Colors

-   **Primary:** Main brand color, used for primary actions and key UI elements.
    -   `--primary`: `hsl(221.2, 83.2%, 53.3%)` (Blue)
    -   `--primary-foreground`: `hsl(210, 40%, 98%)` (White/Light)
-   **Secondary:** Supporting color for secondary actions and less prominent elements.
    -   `--secondary`: `hsl(210, 40%, 96.1%)`
    -   `--secondary-foreground`: `hsl(222.2, 47.4%, 11.2%)`

#### 2.1.2. Neutral Colors

-   **Background:** Main background color.
    -   `--background`: `hsl(0, 0%, 100%)` (White in light mode)
-   **Foreground:** Main text color.
    -   `--foreground`: `hsl(222.2, 47.4%, 11.2%)` (Dark gray)
-   **Muted:** For less prominent text and UI elements.
    -   `--muted`: `hsl(210, 40%, 96.1%)`
    -   `--muted-foreground`: `hsl(215.4, 16.3%, 46.9%)`
-   **Card:** Background color for card components.
    -   `--card`: `hsl(0, 0%, 100%)`
    -   `--card-foreground`: `hsl(222.2, 47.4%, 11.2%)`
-   **Popover:** Background color for popover/dropdown components.
    -   `--popover`: `hsl(0, 0%, 100%)`
    -   `--popover-foreground`: `hsl(222.2, 47.4%, 11.2%)`

#### 2.1.3. Semantic Colors

-   **Destructive:** For error states and destructive actions (e.g., delete).
    -   `--destructive`: `hsl(0, 84.2%, 60.2%)` (Red)
    -   `--destructive-foreground`: `hsl(210, 40%, 98%)`
-   **Success:** For success states and confirmations (custom addition).
    -   `--success`: `hsl(142, 76%, 36%)` (Green)
    -   `--success-foreground`: `hsl(210, 40%, 98%)`
-   **Warning:** For warning states (custom addition).
    -   `--warning`: `hsl(38, 92%, 50%)` (Orange)
    -   `--warning-foreground`: `hsl(222.2, 47.4%, 11.2%)`

#### 2.1.4. Border & Input

-   **Border:** Default border color.
    -   `--border`: `hsl(214.3, 31.8%, 91.4%)`
-   **Input:** Border color for input fields.
    -   `--input`: `hsl(214.3, 31.8%, 91.4%)`
-   **Ring:** Focus ring color for accessibility.
    -   `--ring`: `hsl(221.2, 83.2%, 53.3%)`

#### 2.1.5. Chart Colors (for visualizations)

-   `--chart-1`: `hsl(12, 76%, 61%)`
-   `--chart-2`: `hsl(173, 58%, 39%)`
-   `--chart-3`: `hsl(197, 37%, 24%)`
-   `--chart-4`: `hsl(43, 74%, 66%)`
-   `--chart-5`: `hsl(27, 87%, 67%)`

### 2.2. Typography

Typography is managed via Tailwind CSS classes, with the default font being the Next.js `geistSans` variable font.

#### 2.2.1. Font Families

-   **Sans-serif (default):** `font-sans` → `var(--font-geist-sans)`
-   **Monospace (code):** `font-mono` → `var(--font-geist-mono)`

#### 2.2.2. Font Sizes (Tailwind Scale)

-   `text-xs`: 0.75rem (12px)
-   `text-sm`: 0.875rem (14px)
-   `text-base`: 1rem (16px) — Default body text
-   `text-lg`: 1.125rem (18px)
-   `text-xl`: 1.25rem (20px)
-   `text-2xl`: 1.5rem (24px)
-   `text-3xl`: 1.875rem (30px)
-   `text-4xl`: 2.25rem (36px) — Headings

#### 2.2.3. Font Weights

-   `font-normal`: 400
-   `font-medium`: 500
-   `font-semibold`: 600
-   `font-bold`: 700

#### 2.2.4. Line Heights

-   `leading-none`: 1
-   `leading-tight`: 1.25
-   `leading-snug`: 1.375
-   `leading-normal`: 1.5 — Default
-   `leading-relaxed`: 1.625
-   `leading-loose`: 2

### 2.3. Spacing

Tailwind's default spacing scale is used (based on 4px increments: `0.25rem`).

-   `p-1`: 0.25rem (4px)
-   `p-2`: 0.5rem (8px)
-   `p-4`: 1rem (16px)
-   `p-6`: 1.5rem (24px)
-   `p-8`: 2rem (32px)
-   `p-12`: 3rem (48px)

Applies to: `padding`, `margin`, `gap`, `width`, `height`, etc.

### 2.4. Border Radius

-   `rounded-none`: 0px
-   `rounded-sm`: 0.125rem (2px)
-   `rounded`: 0.25rem (4px) — Default for buttons
-   `rounded-md`: 0.375rem (6px) — Default for cards
-   `rounded-lg`: 0.5rem (8px)
-   `rounded-xl`: 0.75rem (12px)
-   `rounded-full`: 9999px (circular)

Defined in `tailwind.config.ts`:

```typescript
borderRadius: {
  lg: "var(--radius)",
  md: "calc(var(--radius) - 2px)",
  sm: "calc(var(--radius) - 4px)",
}
```

Where `--radius: 0.5rem` by default.

### 2.5. Shadows

Tailwind's default shadow scale:

-   `shadow-sm`: subtle shadow for cards
-   `shadow`: default shadow for elevated elements
-   `shadow-md`: medium shadow for modals
-   `shadow-lg`: large shadow for popovers
-   `shadow-xl`: extra-large shadow for dialogs

---

## 3. Component Library (Shadcn UI)

Shadcn UI components are built on top of **Radix UI** primitives, providing unstyled, accessible base components that are then styled with Tailwind CSS.

### 3.1. Core Components

#### 3.1.1. Button

**Description:** Clickable button for actions and navigation.

**Import:**
```typescript
import { Button } from "@/components/ui/button"
```

**Variants:**
-   `default`: Primary action (blue background)
-   `destructive`: Destructive action (red background)
-   `outline`: Outlined button (border, no fill)
-   `secondary`: Secondary action (light gray background)
-   `ghost`: No background (only text)
-   `link`: Styled as a link

**Sizes:**
-   `default`: Standard size
-   `sm`: Small
-   `lg`: Large
-   `icon`: Icon-only button

**Example:**
```tsx
<Button variant="default" size="default">Сохранить</Button>
<Button variant="outline" size="sm">Отмена</Button>
<Button variant="destructive" size="lg">Удалить</Button>
<Button variant="ghost" size="icon"><Icon /></Button>
```

**Accessibility:**
-   Focus ring with `:focus-visible`
-   Disabled state with `disabled` prop

#### 3.1.2. Card

**Description:** Container for grouping related content.

**Import:**
```typescript
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
```

**Structure:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Заголовок карточки</CardTitle>
    <CardDescription>Описание</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Основное содержимое карточки</p>
  </CardContent>
  <CardFooter>
    <Button>Действие</Button>
  </CardFooter>
</Card>
```

**Styling:**
-   Background: `bg-card`
-   Border: `border border-border`
-   Border radius: `rounded-lg`
-   Shadow: `shadow-sm`

#### 3.1.3. Form (Input, Label, Textarea, Select)

**Description:** Form controls with validation and error handling.

**Import:**
```typescript
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
```

**Example (with React Hook Form + Zod):**
```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const formSchema = z.object({
  title: z.string().min(1, "Обязательное поле"),
  description: z.string().optional(),
})

export function MyForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", description: "" },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Server Action
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

**Styling:**
-   Input: `border border-input bg-background`, focus ring
-   Label: `text-sm font-medium`
-   Error message: `text-destructive text-sm`

#### 3.1.4. Dialog (Modal)

**Description:** Modal dialog for confirmations and forms.

**Import:**
```typescript
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
```

**Example:**
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">Открыть диалог</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Подтверждение</DialogTitle>
      <DialogDescription>
        Вы уверены, что хотите удалить этот урок?
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="ghost">Отмена</Button>
      <Button variant="destructive">Удалить</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**Accessibility:**
-   Focus trap within dialog
-   Escape key to close
-   `aria-labelledby` and `aria-describedby`

#### 3.1.5. Table

**Description:** Data table with sorting and pagination support.

**Import:**
```typescript
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
```

**Example:**
```tsx
<Table>
  <TableCaption>Список учеников</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Фамилия</TableHead>
      <TableHead>Имя</TableHead>
      <TableHead>Дата рождения</TableHead>
      <TableHead>Действия</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {pupils.map((pupil) => (
      <TableRow key={pupil.id}>
        <TableCell>{pupil.lastName}</TableCell>
        <TableCell>{pupil.firstName}</TableCell>
        <TableCell>{pupil.dateOfBirth}</TableCell>
        <TableCell>
          <Button variant="ghost" size="sm">Редактировать</Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

**Styling:**
-   Header: `bg-muted font-medium`
-   Rows: `border-b border-border`
-   Hover: `hover:bg-muted/50`

#### 3.1.6. Badge

**Description:** Small status indicator or label.

**Import:**
```typescript
import { Badge } from "@/components/ui/badge"
```

**Variants:**
-   `default`: Primary badge
-   `secondary`: Secondary badge
-   `destructive`: Error badge
-   `outline`: Outlined badge

**Example:**
```tsx
<Badge variant="default">Активно</Badge>
<Badge variant="secondary">Завершено</Badge>
<Badge variant="destructive">Отменено</Badge>
```

#### 3.1.7. Dropdown Menu

**Description:** Context menu with actions.

**Import:**
```typescript
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
```

**Example:**
```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost">Меню</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Действия</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Редактировать</DropdownMenuItem>
    <DropdownMenuItem>Удалить</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

#### 3.1.8. Toast (Notifications)

**Description:** Non-intrusive notification messages.

**Import:**
```typescript
import { useToast } from "@/hooks/use-toast"
import { toast } from "@/hooks/use-toast"
```

**Example:**
```tsx
const { toast } = useToast()

function showToast() {
  toast({
    title: "Урок создан",
    description: "Урок успешно сохранен в базе данных.",
    variant: "default", // or "destructive"
  })
}
```

**Positioning:**
-   Bottom-right by default
-   Auto-dismiss after 5 seconds

#### 3.1.9. Calendar / Date Picker

**Description:** Date selection component.

**Import:**
```typescript
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
```

**Example (with `react-day-picker`):**
```tsx
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"

<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">
      {date ? format(date, "PPP", { locale: ru }) : "Выберите дату"}
      <CalendarIcon className="ml-2 h-4 w-4" />
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-auto p-0">
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      initialFocus
    />
  </PopoverContent>
</Popover>
```

#### 3.1.10. Avatar

**Description:** User profile image or initial display.

**Import:**
```typescript
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
```

**Example:**
```tsx
<Avatar>
  <AvatarImage src={user.image} alt={user.name} />
  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
</Avatar>
```

### 3.2. Composite Components (Application-Specific)

These are custom components built by composing Shadcn UI primitives, specific to the Sunday School App.

#### 3.2.1. LessonCard

**Purpose:** Display a lesson summary in a list.

**Location:** `@/components/lessons/lesson-card.tsx`

**Usage:**
```tsx
<LessonCard
  lesson={{
    id: "lesson-1",
    title: "Притча о сеятеле",
    date: "2025-01-15",
    status: "active",
  }}
/>
```

**Structure:**
-   `Card` with `CardHeader` (Title, Date) and `CardFooter` (Action buttons)

#### 3.2.2. PupilTable

**Purpose:** Sortable, filterable table of pupils.

**Location:** `@/components/pupils/pupil-table.tsx`

**Usage:**
```tsx
<PupilTable pupils={pupilsData} />
```

**Features:**
-   Sorting by name, date of birth
-   Search/filter input
-   Row actions (Edit, View Profile)

#### 3.2.3. HomeworkCheckForm

**Purpose:** Form for checking homework with score and notes.

**Location:** `@/components/homework/homework-check-form.tsx`

**Structure:**
-   Form with checkbox (completed), input (score), textarea (notes)
-   Server Action for submission

---

## 4. Layout Patterns

### 4.1. Application Shell

**Description:** Consistent layout with sidebar and header.

**Structure:**

```tsx
<div className="flex min-h-screen">
  {/* Sidebar */}
  <aside className="w-64 border-r border-border bg-card">
    <nav>{/* Navigation items */}</nav>
  </aside>

  {/* Main Content */}
  <div className="flex-1">
    {/* Header */}
    <header className="border-b border-border bg-card px-6 py-4">
      <h1 className="text-2xl font-semibold">{pageTitle}</h1>
    </header>

    {/* Page Content */}
    <main className="p-6">{children}</main>
  </div>
</div>
```

**Mobile Version:**
-   Sidebar collapses into a hamburger menu (`Sheet` component from Shadcn UI)

### 4.2. Form Layout

**Pattern:** Vertical stacking of form fields with consistent spacing.

```tsx
<form className="space-y-6">
  <FormField {...field1} />
  <FormField {...field2} />
  <div className="flex justify-end gap-4">
    <Button variant="ghost">Отмена</Button>
    <Button type="submit">Сохранить</Button>
  </div>
</form>
```

### 4.3. List/Grid Layout

**Pattern:** Responsive grid for cards.

```tsx
<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
  {items.map((item) => (
    <Card key={item.id}>{/* Card content */}</Card>
  ))}
</div>
```

---

## 5. Iconography

**Icon Library:** **Lucide React** (recommended by Shadcn UI)

**Installation:**
```bash
npm install lucide-react
```

**Usage:**
```tsx
import { Home, User, Calendar, Settings } from "lucide-react"

<Button variant="ghost" size="icon">
  <Home className="h-5 w-5" />
</Button>
```

**Standard Sizes:**
-   `h-4 w-4`: 16px (small, inline with text)
-   `h-5 w-5`: 20px (standard, for buttons)
-   `h-6 w-6`: 24px (large, for headings)

---

## 6. Dark Mode Support

**Implementation:** CSS variables switch based on a `dark` class on the root element.

**Configuration:**
```typescript
// tailwind.config.ts
module.exports = {
  darkMode: ["class"], // Enable dark mode via class
  // ...
}
```

**Dark Mode CSS Variables (example):**
```css
.dark {
  --background: hsl(222.2, 84%, 4.9%);
  --foreground: hsl(210, 40%, 98%);
  --primary: hsl(217.2, 91.2%, 59.8%);
  --primary-foreground: hsl(222.2, 47.4%, 11.2%);
  /* ... other dark mode variables */
}
```

**Toggle Component:**
```tsx
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
```

---

## 7. Accessibility (a11y) Guidelines

### 7.1. Semantic HTML

-   Use semantic HTML elements: `<nav>`, `<main>`, `<header>`, `<footer>`, `<article>`, `<section>`.
-   Use `<button>` for actions, `<a>` for navigation.

### 7.2. Keyboard Navigation

-   All interactive elements must be keyboard accessible (Tab, Enter, Escape).
-   Focus indicators (`:focus-visible` ring) are visible.

### 7.3. ARIA Attributes

-   Use `aria-label`, `aria-labelledby`, `aria-describedby` for screen reader context.
-   Dialog components have proper `role="dialog"` and `aria-modal="true"`.

### 7.4. Color Contrast

-   Text on background must have a contrast ratio of at least 4.5:1 (WCAG AA).
-   Test with tools like **Lighthouse** or **axe DevTools**.

### 7.5. Screen Reader Testing

-   Test with **NVDA** (Windows), **JAWS** (Windows), or **VoiceOver** (macOS/iOS).

---

## 8. Responsive Design

### 8.1. Breakpoints (Tailwind CSS)

-   `sm`: 640px
-   `md`: 768px
-   `lg`: 1024px
-   `xl`: 1280px
-   `2xl`: 1536px

**Usage:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Cards */}
</div>
```

### 8.2. Mobile-First Approach

-   Default styles are for mobile (smallest screens).
-   Use breakpoint prefixes to apply styles for larger screens (`md:`, `lg:`, etc.).

---

## 9. Animation and Transitions

**Library:** Framer Motion (optional for complex animations)

**Default Transitions (Tailwind CSS):**
```tsx
<Button className="transition-colors hover:bg-primary/90">
  Hover me
</Button>
```

**Framer Motion Example:**
```tsx
import { motion } from "framer-motion"

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  <Card>{/* Content */}</Card>
</motion.div>
```

**Principles:**
-   Keep animations subtle (200-300ms).
-   Use `ease-in-out` for smooth transitions.
-   Respect `prefers-reduced-motion` for accessibility.

---

## 10. Component Documentation Standards

Each custom component should have:

1.  **JSDoc Comments:**
    ```tsx
    /**
     * LessonCard - Displays a summary of a lesson
     * @param lesson - Lesson object with id, title, date, status
     */
    export function LessonCard({ lesson }: LessonCardProps) {
      // ...
    }
    ```

2.  **TypeScript Props Interface:**
    ```tsx
    interface LessonCardProps {
      lesson: {
        id: string
        title: string
        date: string
        status: "active" | "completed"
      }
    }
    ```

3.  **Storybook Story (if applicable):**
    ```tsx
    // lesson-card.stories.tsx
    export default {
      title: "Components/LessonCard",
      component: LessonCard,
    }
    ```

---

## 11. Design System Maintenance

### 11.1. Adding New Components

1.  Check if a Shadcn UI component exists: https://ui.shadcn.com/docs/components
2.  Install via CLI:
    ```bash
    npx shadcn@latest add <component-name>
    ```
3.  Customize styles in the component file if needed.
4.  Document usage in this file or in component-specific docs.

### 11.2. Updating Tokens

-   Update color variables in `app/globals.css` (`:root` and `.dark` sections).
-   Update Tailwind config in `tailwind.config.ts` for spacing, typography, etc.

### 11.3. Version Control

-   Document any breaking changes to components in the changelog.
-   Use semantic versioning for design system updates (if packaged separately).

---

## 12. Cross-References

-   **→ [COMPONENT_LIBRARY.md](../components/COMPONENT_LIBRARY.md):** Detailed API documentation for all React components.
-   **→ [WIREFRAMES.md](WIREFRAMES.md):** Visual layout references.
-   **→ [ARCHITECTURE.md](../architecture/ARCHITECTURE.md):** Frontend architecture layer details.
-   **→ [USER_FLOW.md](../user_flows/USER_FLOW.md):** User interaction scenarios.

---

## 13. Resources

-   **Shadcn UI Documentation:** https://ui.shadcn.com
-   **Radix UI Documentation:** https://www.radix-ui.com
-   **Tailwind CSS Documentation:** https://tailwindcss.com/docs
-   **Lucide Icons:** https://lucide.dev
-   **Next.js Font Optimization:** https://nextjs.org/docs/app/building-your-application/optimizing/fonts
-   **WCAG Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/

---

**End of Design System Documentation**
