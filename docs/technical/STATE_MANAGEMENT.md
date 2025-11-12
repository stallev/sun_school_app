# Управление состоянием проекта - Sunday School App

## Версия документа: 1.0
**Дата создания:** 11 ноября 2025  
**Проект:** Sunday School App (Приложение для управления воскресной школой)  
**Технологии:** Next.js 16, React 19, Zustand, Server Components, Server Actions  
**Подход:** Server-First, Минимальное использование клиентского состояния

---

## 1. Обзор стратегии управления состоянием

### 1.1. Принципы

Проект использует **Server-First** подход к управлению состоянием:

1. **Server Components** - основной источник данных
2. **Server Actions** - для мутаций данных
3. **Zustand** - минимально, только для UI состояния
4. **React Query** - не используется (заменен Server Components)

### 1.2. Иерархия источников состояния

```
Server Components (данные с БД)
    ↓
Server Actions (мутации)
    ↓
Client Components (UI интерактивность)
    ↓
Zustand (только UI state)
```

---

## 2. Server-Side State через Server Components

### 2.1. Получение данных

**Принцип:** Данные получаются напрямую в Server Components через Prisma.

**Пример:**
```typescript
// src/app/(dashboard)/grades/[gradeId]/page.tsx
import { getLessonsByGrade } from '@/lib/db/queries';
import { LessonList } from '@/components/organisms/LessonList';

interface GradePageProps {
  params: { gradeId: string };
}

/**
 * Страница группы - Server Component
 * Получает данные напрямую из БД
 */
export default async function GradePage({ params }: GradePageProps) {
  // Данные получаются на сервере
  const lessons = await getLessonsByGrade(params.gradeId);
  const grade = await getGradeById(params.gradeId);

  // Данные передаются в компоненты через props
  return (
    <div>
      <h1>{grade.name}</h1>
      <LessonList lessons={lessons} gradeId={params.gradeId} />
    </div>
  );
}
```

### 2.2. Кеширование данных

**Next.js автоматически кеширует:**
- Результаты `fetch` запросов
- Результаты Server Components
- Данные из Prisma (через `unstable_cache`)

**Пример с кешированием:**
```typescript
// src/lib/db/queries.ts
import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/db';

/**
 * Получение уроков группы с кешированием
 */
export const getLessonsByGrade = unstable_cache(
  async (gradeId: string) => {
    return prisma.lesson.findMany({
      where: { gradeId },
      include: {
        academicYear: true,
        goldenVerses: true,
      },
      orderBy: { date: 'desc' },
    });
  },
  ['lessons-by-grade'], // Ключ кеша
  {
    revalidate: 60, // Перевалидация каждые 60 секунд
    tags: ['lessons'], // Теги для инвалидации
  }
);
```

### 2.3. Revalidation после мутаций

**После Server Actions используйте `revalidatePath` или `revalidateTag`:**

```typescript
// src/actions/lessons.ts
'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const createLessonSchema = z.object({
  title: z.string().min(1),
  gradeId: z.string(),
  date: z.date(),
});

/**
 * Создание урока
 */
export async function createLesson(data: z.infer<typeof createLessonSchema>) {
  // Валидация
  const validated = createLessonSchema.parse(data);

  // Создание в БД
  const lesson = await prisma.lesson.create({
    data: validated,
  });

  // Инвалидация кеша
  revalidatePath(`/grades/${validated.gradeId}`);
  revalidateTag('lessons');

  return { success: true, lesson };
}
```

---

## 3. Server Actions для мутаций

### 3.1. Структура Server Actions

**Расположение:** `src/actions/`

**Организация:**
```
src/actions/
├── lessons.ts          # Действия для уроков
├── homework.ts         # Действия для домашних заданий
├── pupils.ts           # Действия для учеников
├── grades.ts           # Действия для групп
└── ...
```

### 3.2. Паттерн Server Action

**Стандартная структура:**
```typescript
// src/actions/lessons.ts
'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

// 1. Zod схема для валидации
const createLessonSchema = z.object({
  title: z.string().min(1, 'Название обязательно'),
  gradeId: z.string().min(1),
  date: z.date(),
  description: z.string().optional(),
});

// 2. Тип результата (discriminated union)
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// 3. Server Action
export async function createLesson(
  input: z.infer<typeof createLessonSchema>
): Promise<ActionResult<Lesson>> {
  try {
    // Проверка аутентификации
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: 'Не авторизован' };
    }

    // Проверка прав доступа
    if (session.user.role !== 'TEACHER' && session.user.role !== 'ADMIN') {
      return { success: false, error: 'Недостаточно прав' };
    }

    // Валидация
    const validated = createLessonSchema.parse(input);

    // Бизнес-логика
    const activeYear = await prisma.academicYear.findFirst({
      where: {
        gradeId: validated.gradeId,
        status: 'ACTIVE',
      },
    });

    if (!activeYear) {
      return { 
        success: false, 
        error: 'Нет активного учебного года для группы' 
      };
    }

    // Создание в БД
    const lesson = await prisma.lesson.create({
      data: {
        ...validated,
        academicYearId: activeYear.id,
        createdById: session.user.id,
      },
    });

    // Инвалидация кеша
    revalidatePath(`/grades/${validated.gradeId}`);
    revalidatePath(`/lessons/${lesson.id}`);

    return { success: true, data: lesson };
  } catch (error) {
    console.error('Error creating lesson:', error);
    
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: error.errors[0].message 
      };
    }

    return { 
      success: false, 
      error: 'Ошибка при создании урока' 
    };
  }
}
```

### 3.3. Использование Server Actions в компонентах

**В Client Components:**
```typescript
// src/components/organisms/LessonForm/LessonForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createLesson } from '@/actions/lessons';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface LessonFormProps {
  gradeId: string;
}

export const LessonForm = ({ gradeId }: LessonFormProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await createLesson({
      title: formData.get('title') as string,
      gradeId,
      date: new Date(formData.get('date') as string),
    });

    setIsLoading(false);

    if (result.success) {
      toast({
        title: 'Успешно',
        description: 'Урок создан',
      });
      router.push(`/lessons/${result.data.id}`);
    } else {
      toast({
        title: 'Ошибка',
        description: result.error,
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input name="title" placeholder="Название урока" required />
      <Input name="date" type="date" required />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Создание...' : 'Создать урок'}
      </Button>
    </form>
  );
};
```

**В Server Components (через form action):**
```typescript
// src/app/(dashboard)/new-lesson/page.tsx
import { createLesson } from '@/actions/lessons';
import { redirect } from 'next/navigation';

export default function NewLessonPage() {
  async function handleCreateLesson(formData: FormData) {
    'use server';
    
    const result = await createLesson({
      title: formData.get('title') as string,
      gradeId: formData.get('gradeId') as string,
      date: new Date(formData.get('date') as string),
    });

    if (result.success) {
      redirect(`/lessons/${result.data.id}`);
    } else {
      // Обработка ошибки
      redirect(`/new-lesson?error=${encodeURIComponent(result.error)}`);
    }
  }

  return (
    <form action={handleCreateLesson}>
      {/* Поля формы */}
    </form>
  );
}
```

---

## 4. Zustand для UI состояния (минимально)

### 4.1. Когда использовать Zustand

**Используйте Zustand ТОЛЬКО для:**
- ✅ Состояние UI (открыт/закрыт sidebar, модалки)
- ✅ Локальное состояние формы (до отправки)
- ✅ Клиентские фильтры и сортировка
- ✅ Состояние drag & drop

**НЕ используйте Zustand для:**
- ❌ Данные с сервера (используйте Server Components)
- ❌ Состояние после мутаций (используйте Server Actions + revalidation)
- ❌ Глобальное состояние приложения (используйте Server Components)
- ❌ Кеширование данных (используйте Next.js кеширование)

### 4.2. Структура Zustand stores

**Расположение:** `src/store/`

**Организация:**
```
src/store/
├── ui-store.ts         # UI состояние (sidebar, modals)
├── form-store.ts       # Состояние форм (опционально)
└── index.ts           # Barrel export
```

### 4.3. UI Store пример

```typescript
// src/store/ui-store.ts
import { create } from 'zustand';

interface UIState {
  // Sidebar состояние
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Модальные окна
  modals: Record<string, boolean>;
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  isModalOpen: (modalId: string) => boolean;

  // Toast уведомления (если не используем shadcn toast)
  toasts: Array<{ id: string; message: string; type: 'success' | 'error' }>;
  addToast: (message: string, type: 'success' | 'error') => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  // Sidebar
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  // Modals
  modals: {},
  openModal: (modalId) =>
    set((state) => ({
      modals: { ...state.modals, [modalId]: true },
    })),
  closeModal: (modalId) =>
    set((state) => ({
      modals: { ...state.modals, [modalId]: false },
    })),
  isModalOpen: (modalId) => get().modals[modalId] || false,

  // Toasts
  toasts: [],
  addToast: (message, type) => {
    const id = Math.random().toString(36).substring(7);
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));
    
    // Автоматическое удаление через 3 секунды
    setTimeout(() => {
      get().removeToast(id);
    }, 3000);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));
```

### 4.4. Использование UI Store

```typescript
// src/components/organisms/NavigationSidebar/NavigationSidebar.tsx
'use client';

import { useUIStore } from '@/store/ui-store';
import { Button } from '@/components/atoms/Button';
import { Menu, X } from 'lucide-react';

export const NavigationSidebar = () => {
  const { sidebarOpen, setSidebarOpen, toggleSidebar } = useUIStore();

  return (
    <>
      <Button onClick={toggleSidebar}>
        {sidebarOpen ? <X /> : <Menu />}
      </Button>
      
      <aside className={sidebarOpen ? 'open' : 'closed'}>
        {/* Sidebar content */}
      </aside>
    </>
  );
};
```

### 4.5. Form Store (опционально)

**Используйте только для сложных форм с множеством шагов:**

```typescript
// src/store/form-store.ts
import { create } from 'zustand';

interface LessonFormState {
  // Данные формы
  title: string;
  gradeId: string | null;
  date: Date | null;
  description: string;
  
  // Методы
  setTitle: (title: string) => void;
  setGradeId: (gradeId: string) => void;
  setDate: (date: Date) => void;
  setDescription: (description: string) => void;
  reset: () => void;
  
  // Валидация
  isValid: () => boolean;
}

const initialState = {
  title: '',
  gradeId: null,
  date: null,
  description: '',
};

export const useLessonFormStore = create<LessonFormState>((set, get) => ({
  ...initialState,
  
  setTitle: (title) => set({ title }),
  setGradeId: (gradeId) => set({ gradeId }),
  setDate: (date) => set({ date }),
  setDescription: (description) => set({ description }),
  
  reset: () => set(initialState),
  
  isValid: () => {
    const state = get();
    return !!(
      state.title &&
      state.gradeId &&
      state.date
    );
  },
}));
```

**⚠️ Внимание:** Для большинства форм лучше использовать локальный `useState` или `react-hook-form`. Zustand для форм используйте только если форма очень сложная и данные нужны в разных компонентах.

---

## 5. Паттерны работы с состоянием

### 5.1. Оптимистичные обновления

**Для улучшения UX можно использовать оптимистичные обновления:**

```typescript
'use client';

import { useState, useTransition } from 'react';
import { updateLesson } from '@/actions/lessons';
import { Lesson } from '@prisma/client';

interface LessonEditorProps {
  lesson: Lesson;
}

export const LessonEditor = ({ lesson }: LessonEditorProps) => {
  const [isPending, startTransition] = useTransition();
  const [optimisticLesson, setOptimisticLesson] = useState(lesson);

  const handleUpdate = (data: Partial<Lesson>) => {
    // Оптимистичное обновление
    setOptimisticLesson((prev) => ({ ...prev, ...data }));

    // Server Action
    startTransition(async () => {
      const result = await updateLesson(lesson.id, data);
      
      if (!result.success) {
        // Откат при ошибке
        setOptimisticLesson(lesson);
      }
    });
  };

  return (
    <div>
      <input
        value={optimisticLesson.title}
        onChange={(e) => handleUpdate({ title: e.target.value })}
      />
      {isPending && <span>Сохранение...</span>}
    </div>
  );
};
```

### 5.2. Состояние загрузки

**Используйте `useTransition` для состояний загрузки:**

```typescript
'use client';

import { useTransition } from 'react';
import { saveHomeworkChecks } from '@/actions/homework';

export const HomeworkCheckButton = () => {
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      const result = await saveHomeworkChecks(/* ... */);
      // Обработка результата
    });
  };

  return (
    <Button onClick={handleSave} disabled={isPending}>
      {isPending ? 'Сохранение...' : 'Сохранить'}
    </Button>
  );
};
```

### 5.3. Обработка ошибок

**Используйте discriminated unions для обработки ошибок:**

```typescript
// В Server Action
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };

// В компоненте
const result = await createLesson(data);

if (result.success) {
  // Обработка успеха
  router.push(`/lessons/${result.data.id}`);
} else {
  // Обработка ошибки
  toast({
    title: 'Ошибка',
    description: result.error,
    variant: 'destructive',
  });
}
```

---

## 6. Миграция с React Query на Server Components

### 6.1. До (React Query)

```typescript
// ❌ Старый подход с React Query
'use client';

import { useQuery } from '@tanstack/react-query';

export const LessonList = ({ gradeId }: { gradeId: string }) => {
  const { data: lessons, isLoading } = useQuery({
    queryKey: ['lessons', gradeId],
    queryFn: () => fetch(`/api/lessons?gradeId=${gradeId}`).then(r => r.json()),
  });

  if (isLoading) return <div>Загрузка...</div>;
  
  return (
    <div>
      {lessons?.map(lesson => (
        <LessonCard key={lesson.id} lesson={lesson} />
      ))}
    </div>
  );
};
```

### 6.2. После (Server Components)

```typescript
// ✅ Новый подход с Server Components
import { getLessonsByGrade } from '@/lib/db/queries';
import { LessonCard } from '@/components/molecules/LessonCard';

export default async function LessonListPage({ 
  params 
}: { 
  params: { gradeId: string } 
}) {
  // Данные получаются на сервере
  const lessons = await getLessonsByGrade(params.gradeId);

  return (
    <div>
      {lessons.map(lesson => (
        <LessonCard key={lesson.id} lesson={lesson} />
      ))}
    </div>
  );
}
```

---

## 7. Best Practices

### 7.1. Чек-лист выбора источника состояния

**Используйте Server Components если:**
- [ ] Данные нужны для первоначального рендера
- [ ] Данные не требуют частого обновления
- [ ] Данные не зависят от пользовательского ввода

**Используйте Server Actions если:**
- [ ] Нужно создать/обновить/удалить данные
- [ ] Нужна валидация на сервере
- [ ] Нужна проверка прав доступа

**Используйте Zustand если:**
- [ ] Нужно состояние UI (sidebar, modals)
- [ ] Состояние нужно в нескольких компонентах
- [ ] Состояние не связано с серверными данными

**Используйте useState если:**
- [ ] Локальное состояние компонента
- [ ] Временное состояние формы
- [ ] Состояние не нужно в других компонентах

### 7.2. Правила работы с Zustand

1. **Минимальное использование** - только для UI состояния
2. **Не храните серверные данные** - используйте Server Components
3. **Используйте селекторы** для оптимизации:
   ```typescript
   // ✅ Хорошо - селектор
   const sidebarOpen = useUIStore((state) => state.sidebarOpen);
   
   // ❌ Плохо - весь store
   const { sidebarOpen } = useUIStore();
   ```
4. **Избегайте вложенных объектов** - используйте плоскую структуру

### 7.3. Правила работы с Server Actions

1. **Всегда валидируйте** через Zod
2. **Проверяйте аутентификацию** в начале action
3. **Проверяйте права доступа** перед операциями
4. **Используйте revalidatePath/revalidateTag** после мутаций
5. **Возвращайте discriminated unions** для обработки ошибок
6. **Логируйте ошибки** для отладки

---

## 8. Примеры для проекта

### 8.1. Управление уроками

```typescript
// Server Component получает данные
// src/app/(dashboard)/lessons/page.tsx
import { getLessonsByGrade } from '@/lib/db/queries';
import { LessonList } from '@/components/organisms/LessonList';

export default async function LessonsPage() {
  const lessons = await getLessonsByGrade(/* ... */);
  return <LessonList lessons={lessons} />;
}

// Client Component для интерактивности
// src/components/organisms/LessonList/LessonList.tsx
'use client';

import { useState, useTransition } from 'react';
import { deleteLesson } from '@/actions/lessons';
import { Lesson } from '@prisma/client';

export const LessonList = ({ lessons }: { lessons: Lesson[] }) => {
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState('');

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteLesson(id);
      // Обработка результата
    });
  };

  return (
    <div>
      <input 
        value={filter} 
        onChange={(e) => setFilter(e.target.value)} 
      />
      {lessons.map(lesson => (
        <LessonCard 
          key={lesson.id} 
          lesson={lesson} 
          onDelete={() => handleDelete(lesson.id)}
        />
      ))}
    </div>
  );
};
```

### 8.2. Проверка домашних заданий

```typescript
// Client Component с локальным состоянием
// src/components/organisms/HomeworkCheckTable/HomeworkCheckTable.tsx
'use client';

import { useState, useTransition } from 'react';
import { saveHomeworkChecks } from '@/actions/homework';

export const HomeworkCheckTable = ({ 
  pupils, 
  lessonId 
}: HomeworkCheckTableProps) => {
  const [checks, setChecks] = useState<Record<string, HomeworkCheck>>({});
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      const result = await saveHomeworkChecks({
        lessonId,
        checks: Object.values(checks),
      });
      // Обработка результата
    });
  };

  return (
    <div>
      {/* Таблица с чекбоксами */}
      <Button onClick={handleSave} disabled={isPending}>
        Сохранить
      </Button>
    </div>
  );
};
```

---

## 9. Troubleshooting

### 9.1. Проблема: Данные не обновляются после мутации

**Решение:** Убедитесь, что используете `revalidatePath` или `revalidateTag`:

```typescript
// ✅ Правильно
await prisma.lesson.create({ data });
revalidatePath(`/lessons`);

// ❌ Неправильно
await prisma.lesson.create({ data });
// Нет revalidation
```

### 9.2. Проблема: Zustand store не обновляется

**Решение:** Убедитесь, что используете правильный синтаксис:

```typescript
// ✅ Правильно
set((state) => ({ ...state, newField: value }));

// ❌ Неправильно
state.newField = value; // Мутация!
```

### 9.3. Проблема: Server Action не работает

**Решение:** Проверьте:
1. Есть ли `'use server'` в начале файла
2. Правильно ли настроена аутентификация
3. Правильно ли валидируются данные

---

## 10. Ссылки и ресурсы

- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [React useTransition](https://react.dev/reference/react/useTransition)
- [Zod Validation](https://zod.dev/)

---

**Последнее обновление:** 11 ноября 2025  
**Автор:** AI Senior Architect & Documentation Engineer

