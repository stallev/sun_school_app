# Структура компонентов проекта - Sunday School App

## Версия документа: 1.0
**Дата создания:** 11 ноября 2025  
**Проект:** Sunday School App (Приложение для управления воскресной школой)  
**Технологии:** Next.js 16, React 19, TypeScript, Shadcn UI, Tailwind CSS  
**Подход:** Atomic Design, Server-First Architecture, Mobile-First Design

---

## 1. Обзор архитектуры компонентов

### 1.1. Принципы организации

Проект использует **Atomic Design** методологию для организации компонентов, адаптированную под Next.js 16 App Router с приоритетом Server Components.

**Иерархия компонентов:**
```
Pages/Views → Layouts → Organisms → Molecules → Atoms
```

### 1.2. Server Components vs Client Components

**Server Components (по умолчанию):**
- Используются для всех компонентов, которые не требуют интерактивности
- Выполняются на сервере, не отправляются в bundle клиента
- Могут напрямую обращаться к базе данных через Prisma
- Не могут использовать hooks (`useState`, `useEffect`, и т.д.)
- Не могут использовать браузерные API

**Client Components (только при необходимости):**
- Используются только когда требуется интерактивность
- Помечаются директивой `'use client'` в начале файла
- Могут использовать React hooks
- Могут обрабатывать события пользователя
- Отправляются в bundle клиента

**Правило выбора:**
> Начинайте с Server Component. Добавляйте `'use client'` только если компоненту нужна интерактивность.

---

## 2. Atomic Design иерархия

### 2.1. Atoms (Атомы)

**Назначение:** Базовые UI элементы, неразложимые компоненты.

**Характеристики:**
- Одна ответственность
- Высокая переиспользуемость
- Не зависят от других компонентов
- Могут быть Server или Client компонентами

**Примеры для проекта:**
- `Button` - кнопка
- `Input` - поле ввода
- `Label` - метка поля
- `Badge` - значок/бейдж
- `Icon` - иконка (lucide-react)
- `Avatar` - аватар пользователя
- `Skeleton` - скелетон для loading состояния

**Структура директории:**
```
src/components/atoms/
├── Button/
│   ├── Button.tsx
│   └── index.ts
├── Input/
│   ├── Input.tsx
│   └── index.ts
└── ...
```

**Пример Atom компонента:**
```typescript
// src/components/atoms/Badge/Badge.tsx
import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error';
  children: React.ReactNode;
  className?: string;
}

/**
 * Badge компонент для отображения статусов и меток
 * @example
 * ```tsx
 * <Badge variant="success">Активен</Badge>
 * ```
 */
export const Badge = ({ 
  variant = 'default', 
  children, 
  className 
}: BadgeProps) => {
  const variantClasses = {
    default: 'bg-primary text-primary-foreground',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
    error: 'bg-red-500 text-white',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
```

### 2.2. Molecules (Молекулы)

**Назначение:** Простые комбинации атомов, выполняющие одну функцию.

**Характеристики:**
- Состоят из 2-3 атомов
- Имеют одну четкую функцию
- Могут содержать простую логику
- Часто являются Client Components

**Примеры для проекта:**
- `SearchField` - поле поиска с кнопкой
- `FormField` - поле формы с меткой и ошибкой
- `UserAvatar` - аватар с именем
- `LessonCard` - карточка урока
- `PupilCard` - карточка ученика
- `GradeSelector` - селектор группы
- `DatePicker` - выбор даты

**Структура директории:**
```
src/components/molecules/
├── SearchField/
│   ├── SearchField.tsx
│   └── index.ts
├── FormField/
│   ├── FormField.tsx
│   └── index.ts
└── ...
```

**Пример Molecule компонента:**
```typescript
// src/components/molecules/SearchField/SearchField.tsx
'use client';

import { useState } from 'react';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { Search } from 'lucide-react';

interface SearchFieldProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
}

/**
 * Поле поиска с кнопкой
 * @example
 * ```tsx
 * <SearchField 
 *   placeholder="Поиск уроков..." 
 *   onSearch={(query) => console.log(query)}
 * />
 * ```
 */
export const SearchField = ({ 
  placeholder = 'Поиск...', 
  onSearch, 
  className 
}: SearchFieldProps) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" variant="default">
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};
```

### 2.3. Organisms (Организмы)

**Назначение:** Сложные компоненты, состоящие из молекул и атомов.

**Характеристики:**
- Состоят из множества молекул и атомов
- Имеют сложную структуру и логику
- Могут быть Server или Client компонентами
- Часто связаны с бизнес-логикой

**Примеры для проекта:**
- `LessonList` - список уроков с фильтрами
- `HomeworkCheckTable` - таблица проверки ДЗ
- `PupilProfile` - профиль ученика
- `GradeLeaderboard` - рейтинг группы
- `ScheduleCalendar` - календарь расписания
- `LessonForm` - форма создания/редактирования урока
- `NavigationSidebar` - боковая панель навигации
- `Breadcrumbs` - навигационная цепочка

**Структура директории:**
```
src/components/organisms/
├── LessonList/
│   ├── LessonList.tsx
│   └── index.ts
├── HomeworkCheckTable/
│   ├── HomeworkCheckTable.tsx
│   └── index.ts
└── ...
```

**Пример Organism компонента:**
```typescript
// src/components/organisms/LessonList/LessonList.tsx
import { Lesson } from '@prisma/client';
import { LessonCard } from '@/components/molecules/LessonCard';
import { SearchField } from '@/components/molecules/SearchField';
import { Badge } from '@/components/atoms/Badge';

interface LessonListProps {
  lessons: Lesson[];
  gradeId: string;
}

/**
 * Список уроков с поиском и фильтрацией
 * @example
 * ```tsx
 * <LessonList lessons={lessons} gradeId="grade-123" />
 * ```
 */
export const LessonList = ({ lessons, gradeId }: LessonListProps) => {
  // Server Component - может получать данные напрямую
  // Для интерактивности используем Client Component внутри
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Уроки группы</h2>
        <Badge variant="default">{lessons.length} уроков</Badge>
      </div>
      
      {/* Client Component для поиска */}
      <SearchField 
        placeholder="Поиск уроков..." 
        onSearch={(query) => {
          // Логика поиска через Client Component
        }}
      />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} />
        ))}
      </div>
    </div>
  );
};
```

### 2.4. Layouts (Макеты)

**Назначение:** Структурные компоненты, определяющие общую компоновку страниц.

**Характеристики:**
- Определяют структуру страницы
- Содержат общие элементы (header, sidebar, footer)
- Обычно Server Components
- Используются в Next.js layouts

**Примеры для проекта:**
- `MainLayout` - основной layout для публичных страниц
- `DashboardLayout` - layout для dashboard (Teacher)
- `AdminLayout` - layout для админ-панели с sidebar
- `AuthLayout` - layout для страниц аутентификации

**Структура директории:**
```
src/components/layouts/
├── MainLayout/
│   ├── MainLayout.tsx
│   └── index.ts
├── DashboardLayout/
│   ├── DashboardLayout.tsx
│   └── index.ts
└── ...
```

**Пример Layout компонента:**
```typescript
// src/components/layouts/DashboardLayout/DashboardLayout.tsx
import { NavigationSidebar } from '@/components/organisms/NavigationSidebar';
import { Breadcrumbs } from '@/components/organisms/Breadcrumbs';

interface DashboardLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

/**
 * Layout для dashboard страниц с sidebar и breadcrumbs
 * @example
 * ```tsx
 * <DashboardLayout breadcrumbs={[{ label: 'Группы', href: '/grades' }]}>
 *   <PageContent />
 * </DashboardLayout>
 * ```
 */
export const DashboardLayout = ({ 
  children, 
  breadcrumbs = [] 
}: DashboardLayoutProps) => {
  return (
    <div className="flex min-h-screen">
      <NavigationSidebar />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        {breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
        {children}
      </main>
    </div>
  );
};
```

### 2.5. Pages/Views (Страницы)

**Назначение:** Полные страницы приложения, композиция организмов и layouts.

**Характеристики:**
- Определяются в `src/app/` (Next.js App Router)
- Используют layouts и organisms
- Обычно Server Components
- Могут содержать Server Actions

**Примеры для проекта:**
- `app/(dashboard)/grades/[gradeId]/page.tsx` - страница группы
- `app/(dashboard)/lessons/[lessonId]/page.tsx` - страница урока
- `app/(admin)/teachers-management/page.tsx` - управление преподавателями
- `app/(auth)/login/page.tsx` - страница входа

**Пример Page компонента:**
```typescript
// src/app/(dashboard)/grades/[gradeId]/page.tsx
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { LessonList } from '@/components/organisms/LessonList';
import { getLessonsByGrade } from '@/lib/db/queries';

interface GradePageProps {
  params: { gradeId: string };
}

/**
 * Страница группы с списком уроков
 */
export default async function GradePage({ params }: GradePageProps) {
  const lessons = await getLessonsByGrade(params.gradeId);

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: 'Группы', href: '/grades' },
        { label: `Группа ${params.gradeId}` },
      ]}
    >
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Уроки группы</h1>
        <LessonList lessons={lessons} gradeId={params.gradeId} />
      </div>
    </DashboardLayout>
  );
}
```

---

## 3. Интеграция с Shadcn UI

### 3.1. Использование Shadcn UI компонентов

Shadcn UI компоненты находятся в `src/components/ui/` и используются как базовые атомы.

**Структура:**
```
src/components/ui/
├── button.tsx          # Shadcn Button
├── input.tsx          # Shadcn Input
├── card.tsx           # Shadcn Card
├── dialog.tsx         # Shadcn Dialog
├── table.tsx          # Shadcn Table
└── ...
```

**Правила использования:**
1. **Не модифицируйте напрямую** компоненты в `src/components/ui/`
2. **Создавайте обертки** в `src/components/atoms/` если нужна кастомизация
3. **Используйте напрямую** Shadcn компоненты в molecules и organisms
4. **Следуйте документации** Shadcn UI для правильного использования

**Пример обертки Shadcn компонента:**
```typescript
// src/components/atoms/Button/Button.tsx
'use client';

import { Button as ShadcnButton } from '@/components/ui/button';
import { ButtonProps as ShadcnButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ButtonProps extends ShadcnButtonProps {
  // Дополнительные пропсы для проекта
  icon?: React.ReactNode;
}

/**
 * Кастомная кнопка на основе Shadcn UI Button
 */
export const Button = ({ 
  icon, 
  children, 
  className, 
  ...props 
}: ButtonProps) => {
  return (
    <ShadcnButton className={cn(className)} {...props}>
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </ShadcnButton>
  );
};
```

### 3.2. Кастомизация Shadcn UI

**Темизация через CSS переменные:**
```css
/* src/app/globals.css */
:root {
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  /* ... */
}
```

**Кастомизация компонентов:**
- Используйте `cn()` утилиту для объединения классов
- Создавайте варианты через TypeScript интерфейсы
- Следуйте паттернам Shadcn UI для консистентности

---

## 4. Guidelines из docs/guidelines/react/

### 4.1. Обязательные правила

**1. Arrow Functions (ОБЯЗАТЕЛЬНО):**
```typescript
// ✅ ПРАВИЛЬНО
export const Component = ({ prop1, prop2 }: ComponentProps) => {
  return <div>...</div>;
};

// ❌ НЕПРАВИЛЬНО
export function Component({ prop1, prop2 }: ComponentProps) {
  return <div>...</div>;
}
```

**2. Explicit Typing (вместо React.FC):**
```typescript
// ✅ ПРАВИЛЬНО
interface ComponentProps {
  title: string;
}

export const Component = ({ title }: ComponentProps) => {
  return <h1>{title}</h1>;
};

// ❌ НЕПРАВИЛЬНО
export const Component: React.FC<ComponentProps> = ({ title }) => {
  return <h1>{title}</h1>;
};
```

**3. TypeScript интерфейсы:**
- Все компоненты должны иметь явные TypeScript интерфейсы для props
- Используйте `interface` для props (не `type`)
- Документируйте сложные props через JSDoc

**4. React Compiler:**
- Если `reactCompiler: true` в `next.config.ts`, не используйте `memo`, `useMemo`, `useCallback` без необходимости
- Пишите чистый код, React Compiler оптимизирует автоматически

### 4.2. Структура файла компонента

**Стандартная структура:**
```typescript
// 1. Импорты
import React from 'react';
import { cn } from '@/lib/utils';
import { SomeComponent } from '@/components/...';

// 2. TypeScript интерфейсы
interface ComponentProps {
  // props definition
}

// 3. JSDoc комментарий (для сложных компонентов)
/**
 * Описание компонента
 * @example
 * ```tsx
 * <Component prop1="value" />
 * ```
 */

// 4. Компонент
export const Component = ({ prop1, prop2 }: ComponentProps) => {
  // Implementation
  return <div>...</div>;
};

// 5. Экспорт (опционально)
export default Component;
```

---

## 5. Примеры компонентов для проекта

### 5.1. LessonCard (Molecule)

```typescript
// src/components/molecules/LessonCard/LessonCard.tsx
import { Lesson } from '@prisma/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/atoms/Badge';
import { formatDate } from '@/lib/utils/date';
import Link from 'next/link';

interface LessonCardProps {
  lesson: Lesson;
  gradeId: string;
}

/**
 * Карточка урока для отображения в списке
 */
export const LessonCard = ({ lesson, gradeId }: LessonCardProps) => {
  return (
    <Link href={`/lessons/${lesson.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <CardTitle className="line-clamp-2">{lesson.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {formatDate(lesson.date)}
            </p>
            <div className="flex gap-2">
              <Badge variant="default">Урок</Badge>
              {lesson.isCompleted && (
                <Badge variant="success">Завершен</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
```

### 5.2. HomeworkCheckTable (Organism)

```typescript
// src/components/organisms/HomeworkCheckTable/HomeworkCheckTable.tsx
'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/atoms/Button';
import { Pupil, HomeworkCheck } from '@prisma/client';
import { saveHomeworkChecks } from '@/actions/homework';

interface HomeworkCheckTableProps {
  pupils: Pupil[];
  lessonId: string;
  initialChecks?: HomeworkCheck[];
}

/**
 * Таблица для массовой проверки домашних заданий
 */
export const HomeworkCheckTable = ({ 
  pupils, 
  lessonId, 
  initialChecks = [] 
}: HomeworkCheckTableProps) => {
  const [checks, setChecks] = useState<Record<string, HomeworkCheck>>(
    initialChecks.reduce((acc, check) => {
      acc[check.pupilId] = check;
      return acc;
    }, {} as Record<string, HomeworkCheck>)
  );

  const updateCheck = (pupilId: string, field: keyof HomeworkCheck, value: boolean | number) => {
    setChecks(prev => ({
      ...prev,
      [pupilId]: {
        ...prev[pupilId],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    const result = await saveHomeworkChecks({
      lessonId,
      checks: Object.values(checks),
    });
    
    if (result.success) {
      // Показать toast уведомление
    }
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ученик</TableHead>
            <TableHead>Золотые стихи</TableHead>
            <TableHead>Тест</TableHead>
            <TableHead>Тетрадь</TableHead>
            <TableHead>Спевка</TableHead>
            <TableHead>Баллы</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pupils.map((pupil) => (
            <TableRow key={pupil.id}>
              <TableCell>{pupil.name}</TableCell>
              <TableCell>
                <Checkbox
                  checked={checks[pupil.id]?.goldenVerse || false}
                  onCheckedChange={(checked) =>
                    updateCheck(pupil.id, 'goldenVerse', checked as boolean)
                  }
                />
              </TableCell>
              <TableCell>
                <Checkbox
                  checked={checks[pupil.id]?.test || false}
                  onCheckedChange={(checked) =>
                    updateCheck(pupil.id, 'test', checked as boolean)
                  }
                />
              </TableCell>
              <TableCell>
                <Checkbox
                  checked={checks[pupil.id]?.notebook || false}
                  onCheckedChange={(checked) =>
                    updateCheck(pupil.id, 'notebook', checked as boolean)
                  }
                />
              </TableCell>
              <TableCell>
                <Checkbox
                  checked={checks[pupil.id]?.singing || false}
                  onCheckedChange={(checked) =>
                    updateCheck(pupil.id, 'singing', checked as boolean)
                  }
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={checks[pupil.id]?.points || 0}
                  onChange={(e) =>
                    updateCheck(pupil.id, 'points', parseInt(e.target.value) || 0)
                  }
                  className="w-20"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-end gap-2">
        <Button variant="outline">Отменить</Button>
        <Button onClick={handleSave}>Сохранить</Button>
      </div>
    </div>
  );
};
```

### 5.3. NavigationSidebar (Organism)

```typescript
// src/components/organisms/NavigationSidebar/NavigationSidebar.tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { 
  Home, 
  BookOpen, 
  Users, 
  Calendar, 
  Trophy,
  Settings 
} from 'lucide-react';
import { useUIStore } from '@/store/ui-store';

const navigationItems = [
  { href: '/grades', label: 'Группы', icon: Home },
  { href: '/lessons', label: 'Уроки', icon: BookOpen },
  { href: '/pupils', label: 'Ученики', icon: Users },
  { href: '/schedule', label: 'Расписание', icon: Calendar },
  { href: '/leaderboard', label: 'Рейтинг', icon: Trophy },
  { href: '/settings', label: 'Настройки', icon: Settings },
];

/**
 * Боковая панель навигации для dashboard
 */
export const NavigationSidebar = () => {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-64 bg-card border-r transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent'
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};
```

---

## 6. Best Practices

### 6.1. Именование компонентов

- **PascalCase** для компонентов: `LessonCard`, `HomeworkCheckTable`
- **camelCase** для файлов: `LessonCard.tsx`, `homeworkCheckTable.tsx`
- **Описательные имена**: избегайте аббревиатур, используйте полные названия

### 6.2. Организация импортов

```typescript
// 1. React и Next.js
import React from 'react';
import Link from 'next/link';

// 2. Сторонние библиотеки
import { format } from 'date-fns';
import { Search } from 'lucide-react';

// 3. Внутренние компоненты (по уровням)
import { Button } from '@/components/atoms/Button';
import { LessonCard } from '@/components/molecules/LessonCard';
import { LessonList } from '@/components/organisms/LessonList';

// 4. Утилиты и типы
import { cn } from '@/lib/utils';
import { Lesson } from '@prisma/client';

// 5. Actions
import { deleteLesson } from '@/actions/lessons';
```

### 6.3. Обработка состояний

**Server Components:**
- Получают данные напрямую через Prisma
- Не используют useState, useEffect
- Передают данные в Client Components через props

**Client Components:**
- Используют useState для локального состояния
- Используют Server Actions для мутаций
- Используют Zustand для глобального UI состояния (минимально)

### 6.4. Обработка ошибок

```typescript
// Используйте error.tsx для обработки ошибок на уровне страниц
// src/app/(dashboard)/grades/[gradeId]/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold">Что-то пошло не так</h2>
      <p className="text-muted-foreground">{error.message}</p>
      <Button onClick={reset}>Попробовать снова</Button>
    </div>
  );
}
```

### 6.5. Loading состояния

```typescript
// Используйте loading.tsx для loading состояний
// src/app/(dashboard)/grades/[gradeId]/loading.tsx
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}
```

---

## 7. Mobile-First подход

### 7.1. Responsive компоненты

Все компоненты должны быть адаптивными:

```typescript
// Используйте Tailwind responsive классы
<div className="
  grid 
  grid-cols-1 
  md:grid-cols-2 
  lg:grid-cols-3 
  gap-4
">
  {items.map(item => (
    <ItemCard key={item.id} item={item} />
  ))}
</div>
```

### 7.2. Touch-friendly элементы

- Минимальный размер кликабельных элементов: 44x44px
- Достаточные отступы между элементами
- Используйте `touch-action` CSS свойство где необходимо

---

## 8. Тестирование компонентов

### 8.1. Unit тесты

```typescript
// src/components/atoms/Badge/Badge.test.tsx
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders children correctly', () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    const { container } = render(<Badge variant="success">Success</Badge>);
    expect(container.firstChild).toHaveClass('bg-green-500');
  });
});
```

### 8.2. Accessibility тесты

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('should have no accessibility violations', async () => {
  const { container } = render(<Badge>Test</Badge>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## 9. Чек-лист создания компонента

- [ ] Определен уровень компонента (Atom/Molecule/Organism/Layout)
- [ ] Создан TypeScript интерфейс для props
- [ ] Компонент использует arrow function синтаксис
- [ ] Определено, Server или Client Component
- [ ] Добавлен `'use client'` если нужна интерактивность
- [ ] Используются Shadcn UI компоненты где возможно
- [ ] Компонент адаптивен (mobile-first)
- [ ] Добавлены ARIA атрибуты для accessibility
- [ ] Добавлен JSDoc комментарий для сложных компонентов
- [ ] Импорты организованы правильно
- [ ] Компонент следует naming conventions
- [ ] Обработаны loading и error состояния

---

## 10. Ссылки и ресурсы

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [React Server Components](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)
- [Shadcn UI Documentation](https://ui.shadcn.com/)
- [Atomic Design Methodology](https://atomicdesign.bradfrost.com/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Последнее обновление:** 11 ноября 2025  
**Автор:** AI Senior Architect & Documentation Engineer


