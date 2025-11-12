# Архитектура проекта - Sunday School App

## Версия документа: 1.0
**Дата создания:** 11 ноября 2025  
**Проект:** Sunday School App (Приложение для управления воскресной школой)  
**Технологии:** Next.js 16, TypeScript, Prisma ORM, Auth.js v5, Zustand, Shadcn UI, BlockNote, PostgreSQL (Supabase)

---

## 1. Обзор архитектуры

Проект построен на современном стеке технологий с использованием Next.js 16 App Router, обеспечивающем высокую производительность, SEO-оптимизацию и отличный Developer Experience. Приложение предназначено для управления учебным процессом воскресной школы баптистской церкви.

### 1.1. Ключевые принципы

- **Server-First Architecture** - максимальное использование серверных компонентов
- **Mobile-First Design** - приоритет мобильной версии интерфейса
- **Progressive Enhancement** - работа без JavaScript с постепенным улучшением
- **Type Safety** - полная типизация с TypeScript, запрет `any` типов
- **Component-Driven Development** - атомарный дизайн компонентов
- **Performance First** - оптимизация Core Web Vitals
- **Security by Default** - безопасность на всех уровнях
- **Educational Focus** - фокус на образовательных процессах и мотивации учеников

---

## 2. Диаграмма архитектуры

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[Browser]
        Mobile[Mobile Browser]
    end
    
    subgraph "Next.js Application"
        AppRouter[App Router]
        ServerComponents[Server Components]
        ClientComponents[Client Components]
        ServerActions[Server Actions]
        Proxy[proxy.ts - Middleware]
    end
    
    subgraph "State Management"
        Zustand[Zustand Store - минимально]
    end
    
    subgraph "Authentication & Authorization"
        AuthJS[Auth.js v5]
        JWT[JWT Tokens]
        ProxyAuth[Proxy Authorization]
    end
    
    subgraph "Data Layer"
        Prisma[Prisma ORM]
        PostgreSQL[(PostgreSQL - Supabase)]
        PgBouncer[PgBouncer Connection Pooling]
    end
    
    subgraph "Storage"
        SupabaseStorage[Supabase Storage]
    end
    
    subgraph "Business Logic"
        ServerActionsLogic[Server Actions]
        Validation[Zod Validation]
        BusinessRules[Business Rules]
    end
    
    subgraph "UI Components"
        ShadcnUI[Shadcn UI Components]
        BlockNote[BlockNote Editor]
        CustomComponents[Custom Components]
    end
    
    Browser --> AppRouter
    Mobile --> AppRouter
    AppRouter --> ServerComponents
    AppRouter --> ClientComponents
    ServerComponents --> ServerActions
    ClientComponents --> Zustand
    ClientComponents --> ServerActions
    Proxy --> AuthJS
    Proxy --> ProxyAuth
    ServerActions --> Prisma
    Prisma --> PgBouncer
    PgBouncer --> PostgreSQL
    ServerActions --> SupabaseStorage
    AuthJS --> JWT
    ServerActions --> Validation
    ServerActions --> BusinessRules
    ClientComponents --> ShadcnUI
    ClientComponents --> BlockNote
    ClientComponents --> CustomComponents
```

---

## 3. Структура проекта

```
sun_sch/
├── .next/                          # Next.js build output
├── docs/                           # Документация проекта
│   ├── guidelines/                 # Guidelines для разработки
│   │   └── react/                  # React guidelines
│   ├── prds/                       # Product Requirements Documents
│   │   ├── ERD.md                  # Entity Relationship Diagram
│   │   ├── USER_FLOW.md            # Пользовательские сценарии
│   │   ├── ARCHITECTURE.md         # Архитектура проекта (этот документ)
│   │   ├── WIREFRAMES.md           # Wireframes страниц
│   │   └── IMPLEMENTATION_PLAN.md  # План реализации
│   ├── technical/                  # Техническая документация
│   │   ├── PRISMA_SCHEMA.md        # Описание схемы Prisma
│   │   ├── SERVER_ACTIONS_GUIDE.md # Руководство по Server Actions
│   │   ├── COMPONENT_STRUCTURE.md  # Структура компонентов
│   │   ├── STATE_MANAGEMENT.md     # Управление состоянием
│   │   └── MOBILE_FIRST_GUIDE.md   # Mobile-first разработка
│   ├── user/                       # Пользовательская документация
│   ├── PROJECT_REQUIREMENTS.md     # Требования к проекту
│   └── secure_data.md              # Безопасные данные (не коммитится)
├── prisma/                         # Prisma ORM
│   ├── migrations/                 # Database migrations
│   ├── seed.ts                     # Seed data
│   └── schema.prisma               # Database schema
├── public/                         # Static assets
│   ├── images/                     # Images
│   ├── icons/                      # Icons
│   └── fonts/                      # Custom fonts
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (auth)/                 # Auth route group
│   │   │   ├── layout.tsx          # Auth layout
│   │   │   └── login/              # Страница входа
│   │   │       └── page.tsx
│   │   ├── (dashboard)/            # Dashboard route group
│   │   │   ├── layout.tsx          # Dashboard layout
│   │   │   ├── grades/             # Управление группами
│   │   │   │   ├── my/             # Мои группы
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [gradeId]/      # Детали группы
│   │   │   │       ├── page.tsx
│   │   │   │       ├── academic-years/
│   │   │   │       │   └── [yearId]/
│   │   │   │       │       └── lessons/
│   │   │   │       │           └── page.tsx
│   │   │   │       ├── schedule/   # Расписание группы
│   │   │   │       │   └── page.tsx
│   │   │   │       └── settings/   # Настройки группы (Admin only)
│   │   │   │           └── page.tsx
│   │   │   ├── new-lesson/         # Создание урока
│   │   │   │   └── page.tsx
│   │   │   ├── lessons/            # Уроки
│   │   │   │   └── [lessonId]/
│   │   │   │       ├── page.tsx    # Детали урока
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx
│   │   │   ├── homework-check/     # Проверка ДЗ
│   │   │   │   └── [lessonId]/
│   │   │   │       └── page.tsx
│   │   │   ├── pupil-personal-data/ # Личные карточки учеников
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── grade-leaderboard/   # Рейтинг группы
│   │   │   │   └── [gradeId]/
│   │   │   │       └── page.tsx
│   │   │   └── golden-verses-library/ # Библиотека золотых стихов
│   │   │       └── page.tsx
│   │   ├── (admin)/                # Admin route group
│   │   │   ├── layout.tsx          # Admin layout (с Sidebar и Breadcrumbs)
│   │   │   ├── page.tsx            # Admin dashboard
│   │   │   ├── grades-list/        # Список всех групп
│   │   │   │   └── page.tsx
│   │   │   ├── teachers-management/ # Управление преподавателями
│   │   │   │   └── page.tsx
│   │   │   ├── pupils-management/  # Управление учениками
│   │   │   │   └── page.tsx
│   │   │   ├── families-management/ # Управление семьями
│   │   │   │   └── page.tsx
│   │   │   └── school-process-management/ # Управление учебным процессом
│   │   │       └── page.tsx
│   │   ├── api/                    # API routes (опционально)
│   │   │   └── auth/
│   │   │       └── [...nextauth]/
│   │   │           └── route.ts
│   │   ├── layout.tsx             # Root layout
│   │   ├── globals.css             # Global styles
│   │   ├── error.tsx               # Error boundary
│   │   ├── not-found.tsx           # 404 page
│   │   └── loading.tsx             # Loading state
│   ├── actions/                    # Server Actions (CRUD)
│   │   ├── auth.ts                 # Аутентификация
│   │   ├── lessons.ts              # Управление уроками
│   │   ├── homework.ts             # Проверка домашних заданий
│   │   ├── pupils.ts               # Управление учениками
│   │   ├── teachers.ts             # Управление преподавателями
│   │   ├── grades.ts               # Управление группами
│   │   ├── academic-years.ts       # Управление учебными годами
│   │   ├── golden-verses.ts        # Управление золотыми стихами
│   │   ├── achievements.ts         # Управление достижениями
│   │   ├── families.ts             # Управление семьями
│   │   ├── schedule.ts             # Управление расписанием
│   │   └── admin.ts                # Административные действия
│   ├── components/                 # React компоненты
│   │   ├── ui/                     # Shadcn UI components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── table.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── breadcrumb.tsx
│   │   │   └── ...                 # Другие Shadcn UI компоненты
│   │   ├── shared/                 # Общие компоненты
│   │   │   ├── Header/
│   │   │   ├── Footer/
│   │   │   ├── LoadingSpinner/
│   │   │   ├── ErrorMessage/
│   │   │   └── ...
│   │   ├── teacher/                # Компоненты для преподавателей
│   │   │   ├── LessonForm/
│   │   │   ├── HomeworkCheckTable/
│   │   │   ├── PupilCard/
│   │   │   ├── LeaderboardTable/
│   │   │   ├── ScheduleCalendar/
│   │   │   └── ...
│   │   └── admin/                  # Компоненты для админ-панели
│   │       ├── AdminSidebar/
│   │       ├── AdminBreadcrumbs/
│   │       ├── TeachersTable/
│   │       ├── PupilsTable/
│   │       ├── FamiliesTable/
│   │       ├── GradeSettingsForm/
│   │       └── ...
│   ├── hooks/                      # Custom React hooks
│   │   ├── use-mobile.ts           # Определение мобильного устройства
│   │   ├── use-grade.ts            # Работа с группой
│   │   ├── use-lesson.ts           # Работа с уроком
│   │   └── ...
│   ├── lib/                        # Utility libraries
│   │   ├── auth/                   # Auth.js конфигурация
│   │   │   ├── auth.config.ts      # Auth.js configuration
│   │   │   ├── auth.ts             # Auth.js setup
│   │   │   └── session.ts          # Session utilities
│   │   ├── db/                     # Database utilities
│   │   │   ├── prisma.ts           # Prisma client (singleton)
│   │   │   └── queries/            # Database queries
│   │   │       ├── lessons.ts
│   │   │       ├── pupils.ts
│   │   │       ├── grades.ts
│   │   │       ├── academic-years.ts
│   │   │       └── ...
│   │   ├── validations/            # Zod schemas
│   │   │   ├── auth.ts
│   │   │   ├── lesson.ts
│   │   │   ├── homework.ts
│   │   │   ├── pupil.ts
│   │   │   └── ...
│   │   ├── utils/                  # Utility functions
│   │   │   ├── format.ts           # Форматирование данных
│   │   │   ├── date.ts             # Работа с датами
│   │   │   ├── calculate.ts        # Расчеты (баллы, рейтинг)
│   │   │   └── ...
│   │   └── storage/                # Storage utilities
│   │       └── supabase.ts         # Supabase storage client
│   ├── store/                      # Zustand stores (минимально)
│   │   ├── ui-store.ts             # UI состояние (модалки, sidebar)
│   │   └── ...
│   ├── types/                      # TypeScript types
│   │   ├── auth.ts                 # Типы аутентификации
│   │   ├── database.ts             # Типы базы данных
│   │   ├── lesson.ts               # Типы уроков
│   │   ├── pupil.ts                # Типы учеников
│   │   ├── grade.ts                # Типы групп
│   │   └── index.ts                # Общие типы
│   └── proxy.ts                    # Next.js middleware (авторизация)
├── .env.local                      # Environment variables (не коммитится)
├── .env.example                    # Example environment variables
├── .eslintrc.json                  # ESLint configuration
├── .gitignore                      # Git ignore rules
├── next.config.ts                  # Next.js configuration
├── package.json                    # Dependencies
├── postcss.config.mjs              # PostCSS configuration
├── tailwind.config.ts              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # Project documentation
```

---

## 4. Слои приложения

### 4.1. Presentation Layer (Слой представления)

**Ответственность:**
- Отображение UI
- Обработка пользовательского ввода
- Навигация
- Адаптивный дизайн (Mobile-first)

**Компоненты:**
- React Server Components (RSC) - по умолчанию
- React Client Components - только при необходимости интерактивности
- Shadcn UI компоненты
- BlockNote редактор (для создания уроков)

**Принципы:**

```typescript
// Server Component (по умолчанию в App Router)
// app/(dashboard)/grades/[gradeId]/page.tsx
import { getGradeById } from '@/lib/db/queries/grades';
import { GradeDetails } from '@/components/teacher/GradeDetails';

export default async function GradePage({ params }: { params: { gradeId: string } }) {
  const grade = await getGradeById(params.gradeId);
  
  if (!grade) {
    notFound();
  }
  
  return (
    <div>
      <h1>{grade.name}</h1>
      <GradeDetails grade={grade} />
    </div>
  );
}
```

```typescript
// Client Component (с интерактивностью)
// components/teacher/HomeworkCheckTable.tsx
'use client';

import { useState } from 'react';
import { checkHomework } from '@/actions/homework';
import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';

export function HomeworkCheckTable({ lessonId, pupils }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    const result = await checkHomework(formData);
    if (result.success) {
      // Показать toast уведомление
    }
    setIsSubmitting(false);
  };
  
  return (
    <form action={handleSubmit}>
      <Table>
        {/* Таблица с чекбоксами для проверки ДЗ */}
      </Table>
      <Button type="submit" disabled={isSubmitting}>
        Сохранить
      </Button>
    </form>
  );
}
```

**Mobile-First подход:**
- Все компоненты сначала разрабатываются для мобильных устройств
- Использование Tailwind CSS breakpoints: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- Адаптивные таблицы (горизонтальная прокрутка на мобильных)
- Сворачивающийся Sidebar в админ-панели
- Touch-friendly элементы управления

---

### 4.2. Business Logic Layer (Слой бизнес-логики)

**Ответственность:**
- Валидация данных (Zod)
- Бизнес-правила
- Обработка ошибок
- Авторизация на уровне действий

**Компоненты:**
- Server Actions
- Custom Hooks (для клиентской логики)
- Validation Schemas (Zod)

**Пример Server Action:**

```typescript
// actions/lessons.ts
'use server';

import { z } from 'zod';
import { prisma } from '@/lib/db/prisma';
import { auth } from '@/lib/auth/auth';
import { lessonSchema } from '@/lib/validations/lesson';

export async function createLesson(formData: FormData) {
  try {
    // 1. Проверка аутентификации
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: 'Необходима авторизация' };
    }
    
    // 2. Проверка прав доступа (Teacher или Admin)
    if (session.user.role !== 'TEACHER' && session.user.role !== 'ADMIN') {
      return { success: false, error: 'Недостаточно прав' };
    }
    
    // 3. Валидация данных
    const data = lessonSchema.parse({
      title: formData.get('title'),
      gradeId: formData.get('gradeId'),
      date: formData.get('date'),
      goldenVerseIds: formData.getAll('goldenVerseIds'),
    });
    
    // 4. Получение активного учебного года для группы
    const activeYear = await prisma.academicYear.findFirst({
      where: {
        gradeId: data.gradeId,
        status: 'ACTIVE',
      },
    });
    
    if (!activeYear) {
      return { 
        success: false, 
        error: 'Для группы нет активного учебного года. Создайте учебный год перед созданием урока.' 
      };
    }
    
    // 5. Создание урока
    const lesson = await prisma.lesson.create({
      data: {
        title: data.title,
        date: new Date(data.date),
        academicYearId: activeYear.id,
        createdById: session.user.id,
        goldenVerses: {
          create: data.goldenVerseIds.map((verseId: string) => ({
            goldenVerseId: verseId,
          })),
        },
      },
      include: {
        goldenVerses: {
          include: {
            goldenVerse: true,
          },
        },
      },
    });
    
    return { success: true, data: lesson };
  } catch (error) {
    console.error('Error creating lesson:', error);
    
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: 'Ошибка валидации данных',
        errors: error.errors,
      };
    }
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Ошибка создания урока' 
    };
  }
}
```

**Бизнес-правила:**

1. **Уроки могут создаваться только в активном учебном году:**
   - При создании урока система автоматически определяет активный год для группы
   - Если активного года нет, создание урока блокируется

2. **Проверка домашних заданий:**
   - Преподаватель может проверять ДЗ только для своей группы
   - Admin может проверять ДЗ для любой группы
   - Баллы начисляются согласно настройкам группы

3. **Система достижений:**
   - Домик выдается, если все параметры урока выполнены
   - Badges начисляются автоматически на основе критериев

4. **Рейтинг:**
   - Рассчитывается на основе баллов за активный учебный год
   - Учитываются только выполненные задания

---

### 4.3. Data Access Layer (Слой доступа к данным)

**Ответственность:**
- Взаимодействие с БД через Prisma ORM
- Кеширование запросов
- Оптимизация запросов
- Connection pooling

**Компоненты:**
- Prisma ORM
- Database Queries (в `lib/db/queries/`)
- Caching Strategies (React cache)

#### 4.3.1. Prisma Client

**Важно:** Все обращения к базе данных должны использовать единый экземпляр Prisma Client из `@/lib/db/prisma`.

**Файл:** `src/lib/db/prisma.ts`

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

**Использование:**

```typescript
// ✅ Правильно - используйте единый экземпляр
import { prisma } from '@/lib/db/prisma';

const lessons = await prisma.lesson.findMany({
  where: { academicYearId: yearId },
});
```

```typescript
// ❌ Неправильно - не создавайте новые экземпляры
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); // НЕ ДЕЛАЙТЕ ТАК!
```

#### 4.3.2. Database Queries

**Примеры оптимизированных запросов:**

```typescript
// lib/db/queries/lessons.ts
import { prisma } from '@/lib/db/prisma';
import { cache } from 'react';

// React cache для дедупликации запросов
export const getLessonById = cache(async (lessonId: string) => {
  return await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      academicYear: {
        include: {
          grade: true,
        },
      },
      goldenVerses: {
        include: {
          goldenVerse: true,
        },
      },
      homeworkChecks: {
        include: {
          pupil: {
            select: {
              id: true,
              name: true,
              surname: true,
            },
          },
        },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
});

export async function getLessonsByAcademicYear(academicYearId: string) {
  return await prisma.lesson.findMany({
    where: { academicYearId },
    include: {
      goldenVerses: {
        include: {
          goldenVerse: true,
        },
      },
      homeworkChecks: {
        include: {
          pupil: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      date: 'desc',
    },
  });
}

export async function getPupilLeaderboard(gradeId: string, academicYearId: string) {
  // Агрегация баллов для рейтинга
  const pupils = await prisma.pupil.findMany({
    where: { gradeId },
    include: {
      homeworkChecks: {
        where: {
          lesson: {
            academicYearId,
          },
        },
        include: {
          lesson: true,
        },
      },
    },
  });
  
  // Расчет баллов и домиков
  return pupils.map(pupil => {
    const totalPoints = pupil.homeworkChecks.reduce((sum, check) => {
      return sum + (check.points || 0);
    }, 0);
    
    const houses = pupil.homeworkChecks.filter(check => {
      // Домик выдается, если все параметры выполнены
      return check.goldenVerseChecked && 
             check.testChecked && 
             check.notebookChecked && 
             check.choirChecked;
    }).length;
    
    return {
      ...pupil,
      totalPoints,
      houses,
    };
  }).sort((a, b) => b.totalPoints - a.totalPoints);
}
```

#### 4.3.3. Connection Pooling

**Конфигурация Supabase:**

- `DATABASE_URL` - для обычных запросов через PgBouncer (порт 6543)
- `DIRECT_URL` - для миграций Prisma (порт 5432)

```typescript
// prisma/schema.prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

**Важно:** 
- Используйте `DATABASE_URL` для всех запросов через Prisma Client
- Используйте `DIRECT_URL` только для миграций (`prisma migrate`)
- Не используйте транзакции через connection pooling (PgBouncer в transaction mode)

---

## 5. Аутентификация и авторизация

### 5.1. Auth.js v5 Configuration

**Стратегия:** JWT (без database sessions)

```typescript
// lib/auth/auth.config.ts
import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db/prisma';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        
        if (!parsed.success) {
          return null;
        }
        
        const { email, password } = parsed.data;
        
        const user = await prisma.user.findUnique({
          where: { email },
        });
        
        if (!user || !user.password) {
          return null;
        }
        
        const isValid = await bcrypt.compare(password, user.password);
        
        if (!isValid) {
          return null;
        }
        
        if (!user.active) {
          throw new Error('Аккаунт деактивирован');
        }
        
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 дней
  },
} satisfies NextAuthConfig;
```

```typescript
// lib/auth/auth.ts
import NextAuth from 'next-auth';
import { prisma } from '@/lib/db/prisma';
import authConfig from './auth.config';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
});
```

### 5.2. Middleware (proxy.ts)

**Файл:** `src/proxy.ts`

```typescript
import { auth } from '@/lib/auth/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Защищенные маршруты
const protectedRoutes = ['/grades', '/lessons', '/homework-check', '/pupil-personal-data', '/grade-leaderboard', '/golden-verses-library'];
const adminRoutes = ['/grades-list', '/teachers-management', '/pupils-management', '/families-management', '/school-process-management'];
const authRoutes = ['/login'];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;
  
  const isProtectedRoute = protectedRoutes.some(route => 
    nextUrl.pathname.startsWith(route)
  );
  const isAdminRoute = adminRoutes.some(route => 
    nextUrl.pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some(route => 
    nextUrl.pathname.startsWith(route)
  );
  
  // Redirect to login if accessing protected route without auth
  if (isProtectedRoute && !isLoggedIn) {
    const callbackUrl = encodeURIComponent(nextUrl.pathname + nextUrl.search);
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl)
    );
  }
  
  // Redirect to dashboard if accessing auth routes while logged in
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/grades/my', nextUrl));
  }
  
  // Check admin access
  if (isAdminRoute) {
    if (!isLoggedIn) {
      const callbackUrl = encodeURIComponent(nextUrl.pathname);
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl)
      );
    }
    
    if (userRole !== 'ADMIN' && userRole !== 'SUPERADMIN') {
      return NextResponse.redirect(new URL('/grades/my', nextUrl));
    }
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

### 5.3. Роли пользователей

**UserRole enum:**
- `TEACHER` - Преподаватель (доступ к своей группе)
- `ADMIN` - Администратор (доступ ко всем группам + управление)
- `SUPERADMIN` - Главный администратор (все возможности Admin + системные настройки)
- `PARENT` - Родитель (Post-MVP, просмотр данных детей)
- `PUPIL` - Ученик (Post-MVP, просмотр своих данных)

**Проверка прав в Server Actions:**

```typescript
// Пример проверки прав доступа
const session = await auth();
if (!session?.user) {
  return { success: false, error: 'Необходима авторизация' };
}

// Teacher может работать только со своей группой
if (session.user.role === 'TEACHER') {
  const hasAccess = await prisma.userGrade.findFirst({
    where: {
      userId: session.user.id,
      gradeId: data.gradeId,
    },
  });
  
  if (!hasAccess) {
    return { success: false, error: 'Нет доступа к этой группе' };
  }
}

// Admin и Superadmin имеют доступ ко всем группам
```

---

## 6. State Management (Zustand)

**Принцип:** Минимальное использование Zustand, только для клиентского UI состояния.

### 6.1. UI Store

```typescript
// store/ui-store.ts
import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  
  modals: Record<string, boolean>;
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  modals: {},
  openModal: (modalId) =>
    set((state) => ({
      modals: { ...state.modals, [modalId]: true },
    })),
  closeModal: (modalId) =>
    set((state) => ({
      modals: { ...state.modals, [modalId]: false },
    })),
}));
```

**Когда использовать Zustand:**
- Состояние UI (открыт/закрыт sidebar, модалки)
- Локальное состояние формы (до отправки)
- Клиентские фильтры и сортировка

**Когда НЕ использовать Zustand:**
- Данные с сервера (используйте Server Components)
- Состояние после мутаций (используйте Server Actions + revalidation)
- Глобальное состояние приложения (используйте Server Components)

---

## 7. Mobile-First подход

### 7.1. Принципы

1. **Разработка сначала для мобильных устройств**
   - Начинаем с минимального экрана (375px)
   - Постепенно добавляем функциональность для больших экранов

2. **Responsive Breakpoints (Tailwind CSS):**
   ```css
   sm:  640px  /* Small tablets */
   md:  768px  /* Tablets */
   lg:  1024px /* Laptops */
   xl:  1280px /* Desktops */
  2xl:  1536px /* Large desktops */
   ```

3. **Touch-Friendly элементы:**
   - Минимальный размер кнопок: 44x44px
   - Достаточные отступы между элементами
   - Swipe жесты для навигации (опционально)

### 7.2. Адаптивные компоненты

**Пример адаптивной таблицы:**

```typescript
// components/teacher/HomeworkCheckTable.tsx
'use client';

export function HomeworkCheckTable({ pupils, lessonId }: Props) {
  return (
    <div className="overflow-x-auto">
      {/* Desktop версия */}
      <div className="hidden md:block">
        <Table>
          {/* Полная таблица с колонками */}
        </Table>
      </div>
      
      {/* Mobile версия */}
      <div className="md:hidden space-y-4">
        {pupils.map((pupil) => (
          <Card key={pupil.id}>
            <CardHeader>
              <CardTitle>{pupil.name} {pupil.surname}</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Компактная форма для мобильных */}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

### 7.3. Адаптивный Sidebar

```typescript
// components/admin/AdminSidebar.tsx
'use client';

import { useUIStore } from '@/store/ui-store';
import { Sheet, SheetContent } from '@/components/ui/sheet';

export function AdminSidebar() {
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  
  return (
    <>
      {/* Desktop: постоянный Sidebar */}
      <aside className="hidden lg:block w-64 border-r">
        <SidebarContent />
      </aside>
      
      {/* Mobile: Sheet (drawer) */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
```

---

## 8. Админ-панель (Layout с Sidebar и Breadcrumbs)

### 8.1. Admin Layout

**Структура:**

```typescript
// app/(admin)/layout.tsx
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminBreadcrumbs } from '@/components/admin/AdminBreadcrumbs';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-4 lg:p-6">
        <AdminBreadcrumbs />
        {children}
      </main>
    </div>
  );
}
```

### 8.2. Sidebar (Shadcn UI)

```typescript
// components/admin/AdminSidebar.tsx
'use client';

import { Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { LayoutDashboard, Users, GraduationCap, Home, Settings } from 'lucide-react';
import Link from 'next/link';

const menuItems = [
  {
    title: 'Главная',
    url: '/grades-list',
    icon: LayoutDashboard,
  },
  {
    title: 'Преподаватели',
    url: '/teachers-management',
    icon: Users,
  },
  {
    title: 'Ученики',
    url: '/pupils-management',
    icon: GraduationCap,
  },
  {
    title: 'Семьи',
    url: '/families-management',
    icon: Home,
  },
  {
    title: 'Учебный процесс',
    url: '/school-process-management',
    icon: Settings,
  },
];

export function AdminSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild>
                <Link href={item.url}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
```

### 8.3. Breadcrumbs

```typescript
// components/admin/AdminBreadcrumbs.tsx
'use client';

import { usePathname } from 'next/navigation';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

const routeLabels: Record<string, string> = {
  'grades-list': 'Главная',
  'teachers-management': 'Преподаватели',
  'pupils-management': 'Ученики',
  'families-management': 'Семьи',
  'school-process-management': 'Учебный процесс',
};

export function AdminBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          const href = '/' + segments.slice(0, index + 1).join('/');
          const label = routeLabels[segment] || segment;
          
          return (
            <BreadcrumbItem key={segment}>
              {isLast ? (
                <span>{label}</span>
              ) : (
                <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
              )}
              {!isLast && <BreadcrumbSeparator />}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
```

---

## 9. Кеширование и оптимизация

### 9.1. Next.js Caching Strategies

**Статическая генерация с revalidation:**

```typescript
// app/(dashboard)/golden-verses-library/page.tsx
export const revalidate = 3600; // 1 час

export default async function GoldenVersesLibraryPage() {
  const verses = await prisma.goldenVerse.findMany({
    orderBy: { createdAt: 'desc' },
  });
  
  return <GoldenVersesList verses={verses} />;
}
```

**Динамический рендеринг с кешированием:**

```typescript
// lib/db/queries/golden-verses.ts
import { cache } from 'react';
import { prisma } from '@/lib/db/prisma';

export const getAllGoldenVerses = cache(async () => {
  return await prisma.goldenVerse.findMany({
    orderBy: { text: 'asc' },
  });
});
```

**Отключение кеширования для динамических данных:**

```typescript
// app/(dashboard)/lessons/[lessonId]/page.tsx
export const dynamic = 'force-dynamic';

export default async function LessonPage({ params }: { params: { lessonId: string } }) {
  const lesson = await getLessonById(params.lessonId);
  // ...
}
```

### 9.2. React Cache

**Использование React cache для дедупликации запросов:**

```typescript
import { cache } from 'react';
import { prisma } from '@/lib/db/prisma';

export const getGradeById = cache(async (gradeId: string) => {
  return await prisma.grade.findUnique({
    where: { id: gradeId },
    include: {
      pupils: true,
      academicYears: true,
    },
  });
});
```

### 9.3. Image Optimization

```typescript
// Использование next/image для оптимизации изображений
import Image from 'next/image';

export function PupilAvatar({ src, alt }: Props) {
  return (
    <Image
      src={src}
      alt={alt}
      width={64}
      height={64}
      className="rounded-full"
      loading="lazy"
    />
  );
}
```

---

## 10. Обработка ошибок

### 10.1. Error Boundaries

```typescript
// app/error.tsx
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);
  
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Что-то пошло не так!</h2>
        <p className="text-gray-600 mb-6">
          Произошла ошибка при загрузке страницы.
        </p>
        <Button onClick={reset}>Попробовать снова</Button>
      </div>
    </div>
  );
}
```

### 10.2. Global Error Handler

```typescript
// app/global-error.tsx
'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h2>Критическая ошибка!</h2>
        <button onClick={reset}>Перезагрузить</button>
      </body>
    </html>
  );
}
```

### 10.3. Обработка ошибок в Server Actions

```typescript
// actions/lessons.ts
export async function createLesson(formData: FormData) {
  try {
    // ... логика создания урока
  } catch (error) {
    console.error('Error creating lesson:', error);
    
    // Возвращаем структурированную ошибку
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Ошибка создания урока',
    };
  }
}
```

---

## 11. Безопасность

### 11.1. CSRF Protection

Next.js автоматически защищает от CSRF атак для Server Actions. Дополнительная защита:

```typescript
// lib/security/csrf.ts
import { headers } from 'next/headers';

export async function validateCSRF() {
  const headersList = headers();
  const origin = headersList.get('origin');
  const host = headersList.get('host');
  
  if (origin && new URL(origin).host !== host) {
    throw new Error('CSRF validation failed');
  }
}
```

### 11.2. Rate Limiting

```typescript
// lib/security/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
});

// Использование в Server Action
export async function createLesson(formData: FormData) {
  'use server';
  
  const ip = headers().get('x-forwarded-for') ?? 'anonymous';
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    throw new Error('Слишком много запросов. Попробуйте позже.');
  }
  
  // ... остальная логика
}
```

### 11.3. Input Sanitization

**Валидация через Zod:**

```typescript
// lib/validations/lesson.ts
import { z } from 'zod';

export const lessonSchema = z.object({
  title: z.string().min(1, 'Название урока обязательно').max(200),
  gradeId: z.string().cuid('Неверный ID группы'),
  date: z.string().datetime('Неверный формат даты'),
  goldenVerseIds: z.array(z.string().cuid()).min(1, 'Выберите хотя бы один золотой стих'),
});
```

**Санитизация HTML (для BlockNote):**

```typescript
// lib/security/sanitize.ts
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: [],
  });
}
```

### 11.4. SQL Injection Prevention

**Использование Prisma ORM предотвращает SQL инъекции:**

```typescript
// ✅ Безопасно - Prisma экранирует параметры
const lesson = await prisma.lesson.findUnique({
  where: { id: lessonId },
});

// ❌ НЕ ДЕЛАЙТЕ ТАК - прямой SQL запрос
// const result = await prisma.$queryRaw`SELECT * FROM Lesson WHERE id = ${lessonId}`;
```

---

## 12. Мониторинг и логирование

### 12.1. Error Tracking

```typescript
// lib/monitoring/sentry.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

export function captureError(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, {
    extra: context,
  });
}
```

### 12.2. Логирование

```typescript
// lib/utils/logger.ts
export function logError(error: Error, context?: Record<string, any>) {
  console.error('Error:', error.message, context);
  
  // В production отправляем в Sentry
  if (process.env.NODE_ENV === 'production') {
    captureError(error, context);
  }
}

export function logInfo(message: string, data?: any) {
  if (process.env.NODE_ENV === 'development') {
    console.log(message, data);
  }
}
```

### 12.3. Analytics (опционально)

```typescript
// lib/analytics/gtag.ts
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

export function pageview(url: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID!, {
      page_path: url,
    });
  }
}
```

---

## 13. Масштабирование

### 13.1. Horizontal Scaling

- **Vercel**: Автоматическое масштабирование
- **Load Balancing**: Распределение нагрузки
- **CDN**: Cloudflare для статических ресурсов

### 13.2. Database Scaling

- **Connection Pooling**: PgBouncer (Supabase)
- **Read Replicas**: Для чтения данных (опционально)
- **Caching**: Redis для кеширования (опционально)

### 13.3. Performance Optimization

- **Code Splitting**: Автоматическое через Next.js
- **Image Optimization**: next/image для всех изображений
- **Lazy Loading**: Для тяжелых компонентов
- **React Compiler**: Автоматические оптимизации

### 13.4. Monitoring

- **Vercel Analytics**: Мониторинг производительности
- **Sentry**: Отслеживание ошибок
- **Uptime Monitoring**: Статус сервиса

---

## 14. Deployment (Развертывание)

### 14.1. Environment Variables

> 📝 **Важно:** Все credentials проекта хранятся в [`docs/secure_data.md`](../../secure_data.md).  
> Файл `.env.local` создан локально и не коммитится в Git.

```bash
# .env.example

# ============================================
# DATABASE (Supabase PostgreSQL)
# ============================================

# Connect to Supabase via connection pooling (для приложения)
DATABASE_URL="postgresql://postgres.PROJECT_REF:[YOUR-PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&statement_cache_size=0"

# Direct connection to the database (для миграций Prisma)
DIRECT_URL="postgresql://postgres.PROJECT_REF:[YOUR-PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:5432/postgres"

# ============================================
# AUTH (Auth.js v5)
# ============================================

# Секретный ключ для JWT
# Сгенерировать: openssl rand -base64 32
AUTH_SECRET="your-auth-secret-key-here"

# URL приложения
NEXTAUTH_URL="http://localhost:3000"

# ============================================
# SUPABASE STORAGE (для изображений)
# ============================================

NEXT_PUBLIC_SUPABASE_URL="https://PROJECT_REF.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

SUPABASE_STORAGE_BUCKET_NAME="sunschoolb"
SUPABASE_STORAGE_ENDPOINT="https://PROJECT_REF.storage.supabase.co/storage/v1/s3"
SUPABASE_STORAGE_REGION="eu-west-1"
SUPABASE_STORAGE_ACCESS_KEY_ID="your-access-key"
SUPABASE_STORAGE_SECRET_ACCESS_KEY="your-secret-key"

# ============================================
# NODE ENVIRONMENT
# ============================================

NODE_ENV="development"
```

**Примечания:**
- `DATABASE_URL` используется для обычных запросов через Prisma Client (connection pooling)
- `DIRECT_URL` используется для миграций Prisma (`prisma migrate`)
- Supabase Storage использует S3-совместимый API для загрузки изображений
- Все реальные credentials хранятся в `docs/secure_data.md` (не коммитится в Git)

### 14.2. Build Configuration

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/grades/my',
        destination: '/grades',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
```

### 14.3. Deployment на Vercel

**Шаги:**

1. Подключить репозиторий к Vercel
2. Настроить Environment Variables в Vercel Dashboard
3. Настроить Build Command: `npm run build`
4. Настроить Output Directory: `.next`
5. Запустить миграции: `npx prisma migrate deploy`
6. Запустить seed (опционально): `npx prisma db seed`

**Post-deployment:**

- Проверить работу приложения
- Настроить мониторинг (Sentry, Analytics)
- Настроить домен (опционально)

---

## 15. Заключение

Данная архитектура обеспечивает:

- ✅ Высокую производительность (Server Components, кеширование)
- ✅ Масштабируемость (горизонтальное масштабирование, connection pooling)
- ✅ Безопасность (CSRF protection, input validation, SQL injection prevention)
- ✅ Отличный DX (Developer Experience) - TypeScript, Server Actions, React Compiler
- ✅ Простоту поддержки (четкая структура, документация)
- ✅ Mobile-first подход (адаптивный дизайн, touch-friendly)
- ✅ SEO-оптимизацию (Server Components, мета-теги)

**Следующие шаги:**

1. Настройка окружения разработки (см. `docs/SETUP_GUIDE.md`)
2. Инициализация базы данных (Prisma migrations)
3. Создание базовых компонентов (Shadcn UI)
4. Реализация аутентификации (Auth.js v5)
5. Разработка основного функционала (см. `docs/prds/IMPLEMENTATION_PLAN.md`)

---

**Версия:** 1.0  
**Последнее обновление:** 11 ноября 2025  
**Автор:** AI Senior Software Architect & Documentation Engineer

