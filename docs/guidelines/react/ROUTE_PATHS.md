# Route Paths Guidelines

## Версия документа: 1.0
**Дата создания:** 23 декабря 2025  
**Последнее обновление:** 23 декабря 2025  
**Проект:** Sunday School App

---

## 1. Обзор

**RoutePath.ts** является единым источником истины для всех путей страниц приложения. Все пути должны быть определены в `src/lib/routes/RoutePath.ts` и использоваться через импорт.

### 1.1. Зачем это нужно?

- ✅ **Единый источник истины** - все пути в одном месте
- ✅ **Типобезопасность** - TypeScript проверяет корректность путей
- ✅ **Легкость рефакторинга** - изменение пути в одном месте обновляет весь проект
- ✅ **Предотвращение опечаток** - невозможно использовать несуществующий путь
- ✅ **Автодополнение** - IDE подсказывает доступные пути

### 1.2. Критически важно

**⚠️ НЕДОПУСТИМО** использование захардкодженных строк путей в коде проекта. Все пути **ОБЯЗАТЕЛЬНО** должны импортироваться из `RoutePath.ts`.

---

## 2. Структура RoutePath.ts

### 2.1. Базовые пути

```typescript
import { RoutePath } from '@/lib/routes/RoutePath';

// Статические пути
RoutePath.auth                    // '/auth'
RoutePath.notFound                // '/not-found'
RoutePath.lessons.base            // '/lessons'
RoutePath.homeworkCheck           // '/homework-check'
RoutePath.goldenVersesLibrary.base // '/golden-verses-library'
```

### 2.2. Вложенные пути (Grades)

```typescript
// Базовые пути для grades
RoutePath.grades.base             // '/grades'
RoutePath.grades.my               // '/grades/my'
RoutePath.grades.new              // '/grades/new'

// Динамические пути (функции)
RoutePath.grades.byId(gradeId)                    // '/grades/:gradeId'
RoutePath.grades.settings(gradeId)                 // '/grades/:gradeId/settings'
RoutePath.grades.academicYears(gradeId)           // '/grades/:gradeId/academic-years'
RoutePath.grades.academicYearLessons(gradeId, yearId) // '/grades/:gradeId/academic-years/:yearId/lessons'
RoutePath.grades.rating(gradeId)                  // '/grades/:gradeId/rating'
RoutePath.grades.issueBricks(gradeId)             // '/grades/:gradeId/issue-bricks'
RoutePath.grades.schedule.base(gradeId)           // '/grades/:gradeId/schedule'
RoutePath.grades.schedule.new(gradeId)            // '/grades/:gradeId/schedule/new'
RoutePath.grades.schedule.edit(gradeId, eventId) // '/grades/:gradeId/schedule/:eventId/edit'
RoutePath.grades.lessons.new(gradeId)             // '/grades/:gradeId/lessons/new'
```

### 2.3. Lessons пути

```typescript
// Базовые пути для lessons
RoutePath.lessons.base            // '/lessons'
RoutePath.lessons.new             // '/lessons/new'

// Динамические пути (функции)
RoutePath.lessons.byId(lessonId)                 // '/lessons/:lessonId'
RoutePath.lessons.edit(lessonId)                  // '/lessons/:lessonId/edit'
RoutePath.lessons.completeTable(lessonId)         // '/lessons/:lessonId/complete-table'
RoutePath.lessons.checkingHomework(lessonId)       // '/lessons/:lessonId/checking-homework'
```

### 2.4. Pupil Personal Data пути

```typescript
// Базовые пути
RoutePath.pupilPersonalData.base  // '/pupil-personal-data'

// Динамические пути (функции)
RoutePath.pupilPersonalData.byId(pupilId)        // '/pupil-personal-data/:id'
RoutePath.pupilPersonalData.achievements(pupilId) // '/pupil-achievements/:id'
```

### 2.5. Golden Verses Library пути

```typescript
// Базовые пути
RoutePath.goldenVersesLibrary.base      // '/golden-verses-library'
RoutePath.goldenVersesLibrary.new       // '/golden-verses-library/new'
RoutePath.goldenVersesLibrary.statistics // '/golden-verses-library/statistics'

// Динамические пути (функции)
RoutePath.goldenVersesLibrary.edit(id)  // '/golden-verses-library/:id/edit'
```

### 2.6. Admin пути

```typescript
// Teachers Management
RoutePath.teachersManagement.base       // '/teachers-management'
RoutePath.teachersManagement.new        // '/teachers-management/new'
RoutePath.teachersManagement.edit(id)  // '/teachers-management/:id/edit'

// Pupils Management
RoutePath.pupilsManagement.base         // '/pupils-management'
RoutePath.pupilsManagement.new          // '/pupils-management/new'
RoutePath.pupilsManagement.edit(id)     // '/pupils-management/:id/edit'

// Families Management
RoutePath.familiesManagement.base       // '/families-management'
RoutePath.familiesManagement.new        // '/families-management/new'
RoutePath.familiesManagement.edit(id)   // '/families-management/:id/edit'

// School Process Management
RoutePath.schoolProcessManagement.base  // '/school-process-management'
RoutePath.schoolProcessManagement.academicYears.new // '/school-process-management/academic-years/new'
```

---

## 3. Правила использования

### 3.1. ✅ Правильное использование

#### В Server Components

```typescript
import { redirect } from 'next/navigation';
import { RoutePath } from '@/lib/routes/RoutePath';

export default async function MyPage() {
  if (!user) {
    redirect(RoutePath.auth);
  }
  
  return <Link href={RoutePath.grades.base}>Группы</Link>;
}
```

#### В Client Components

```typescript
'use client';

import { useRouter } from 'next/navigation';
import { RoutePath } from '@/lib/routes/RoutePath';

export function MyComponent() {
  const router = useRouter();
  
  const handleClick = () => {
    router.push(RoutePath.grades.byId(gradeId));
  };
  
  return <Link href={RoutePath.grades.my}>Мои группы</Link>;
}
```

#### В Server Actions

```typescript
'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { RoutePath } from '@/lib/routes/RoutePath';

export async function myAction() {
  // Редирект
  redirect(RoutePath.grades.base);
  
  // Revalidate
  revalidatePath(RoutePath.grades.base);
  revalidatePath(RoutePath.grades.byId(gradeId));
}
```

#### В Middleware

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { RoutePath, getPublicRoutes, getProtectedRoutes, getAdminRoutes } from '@/lib/routes/RoutePath';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const publicRoutes = getPublicRoutes();
  const protectedRoutes = getProtectedRoutes();
  const adminRoutes = getAdminRoutes();
  
  // Проверка публичных маршрутов
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }
  
  // Редирект
  return NextResponse.redirect(new URL(RoutePath.auth, request.url));
}
```

#### В компонентах навигации

```typescript
import { RoutePath } from '@/lib/routes/RoutePath';

const navItems = [
  {
    href: RoutePath.grades.my,
    label: 'Мои группы',
    roles: ['TEACHER'],
  },
  {
    href: RoutePath.grades.base,
    label: 'Все группы',
    roles: ['ADMIN', 'SUPERADMIN'],
  },
  {
    href: RoutePath.goldenVersesLibrary.base,
    label: 'Золотые стихи',
    roles: ['TEACHER', 'ADMIN', 'SUPERADMIN'],
  },
];
```

#### Примеры использования новых путей

**Lessons пути:**
```typescript
// Создание урока
router.push(RoutePath.lessons.new);

// Просмотр урока
router.push(RoutePath.lessons.byId(lessonId));

// Редактирование урока
router.push(RoutePath.lessons.edit(lessonId));

// Сводная таблица урока
router.push(RoutePath.lessons.completeTable(lessonId));

// Проверка ДЗ
router.push(RoutePath.lessons.checkingHomework(lessonId));
```

**Grades расширенные пути:**
```typescript
// Рейтинг группы
router.push(RoutePath.grades.rating(gradeId));

// Выдача кирпичиков
router.push(RoutePath.grades.issueBricks(gradeId));

// Создание события расписания
router.push(RoutePath.grades.schedule.new(gradeId));

// Редактирование события расписания
router.push(RoutePath.grades.schedule.edit(gradeId, eventId));

// Список уроков за учебный год
router.push(RoutePath.grades.academicYearLessons(gradeId, yearId));
```

**Pupil Personal Data пути:**
```typescript
// Просмотр карточки ученика
router.push(RoutePath.pupilPersonalData.byId(pupilId));

// Просмотр достижений ученика
router.push(RoutePath.pupilPersonalData.achievements(pupilId));
```

**Golden Verses Library пути:**
```typescript
// Создание золотого стиха
router.push(RoutePath.goldenVersesLibrary.new);

// Редактирование золотого стиха
router.push(RoutePath.goldenVersesLibrary.edit(verseId));

// Статистика по золотым стихам
router.push(RoutePath.goldenVersesLibrary.statistics);
```

**Admin пути:**
```typescript
// Создание преподавателя
router.push(RoutePath.teachersManagement.new);

// Редактирование преподавателя
router.push(RoutePath.teachersManagement.edit(teacherId));

// Создание ученика
router.push(RoutePath.pupilsManagement.new);

// Редактирование семьи
router.push(RoutePath.familiesManagement.edit(familyId));

// Создание учебного года
router.push(RoutePath.schoolProcessManagement.academicYears.new);
```

### 3.2. ❌ Неправильное использование

```typescript
// ❌ НЕДОПУСТИМО: захардкодженные строки
redirect('/auth');
router.push('/grades');
router.push(`/grades/${gradeId}`);

// ❌ НЕДОПУСТИМО: конкатенация строк
const path = '/grades/' + gradeId;
const path = `/grades/${gradeId}`;

// ❌ НЕДОПУСТИМО: создание путей вручную
const routes = {
  auth: '/auth',
  grades: '/grades',
};
```

---

## 4. Добавление новых путей

### 4.1. Процесс добавления

1. **Открыть** `src/lib/routes/RoutePath.ts`
2. **Добавить** новый путь в соответствующую категорию (public, protected, admin)
3. **Добавить** JSDoc комментарий с описанием
4. **Обновить** helper функции (`getPublicRoutes`, `getProtectedRoutes`, `getAdminRoutes`), если нужно
5. **Использовать** новый путь через импорт

### 4.2. Пример добавления нового пути

```typescript
// В RoutePath.ts
export const RoutePath = {
  // ... существующие пути
  
  /** New feature page */
  newFeature: {
    /** Base new feature page */
    base: '/new-feature',
    
    /** Create new feature page */
    new: '/new-feature/new',
    
    /** Get feature detail page by ID */
    byId: (id: string) => `/new-feature/${id}`,
    
    /** Get feature edit page by ID */
    edit: (id: string) => `/new-feature/${id}/edit`,
  },
} as const;

// Обновить helper функции, если путь защищенный
export const getProtectedRoutes = (): string[] => {
  return [
    // ... существующие пути
    RoutePath.newFeature.base,
  ];
};
```

---

## 5. Рефакторинг существующего кода

### 5.1. Поиск захардкодженных путей

Используйте поиск по проекту для нахождения всех захардкодженных путей:

```bash
# Поиск строковых литералов с путями
grep -r "['\"]/" src/
grep -r "redirect(" src/
grep -r "router.push(" src/
grep -r "href=" src/
```

### 5.2. Замена на RoutePath.ts

1. **Импортировать** `RoutePath` в файл
2. **Заменить** все строковые литералы на соответствующие константы
3. **Проверить** корректность работы после замены
4. **Запустить** линтер и TypeScript проверку

---

## 6. Best Practices

### 6.1. Группировка путей

Пути группируются по функциональности:
- `grades.*` - все пути, связанные с группами
- `lessons.*` - все пути, связанные с уроками
- Admin пути - отдельная категория

### 6.2. Именование

- Используйте camelCase для имен констант
- Используйте описательные имена (`homeworkCheck`, а не `hw`)
- Для динамических путей используйте функции с параметрами

### 6.3. Типобезопасность

```typescript
// ✅ TypeScript проверяет существование пути
const path: string = RoutePath.grades.base;

// ✅ TypeScript проверяет параметры функции
const path = RoutePath.grades.byId(gradeId); // gradeId должен быть string

// ❌ TypeScript выдаст ошибку, если путь не существует
const path = RoutePath.nonExistent; // Error: Property 'nonExistent' does not exist
```

---

## 7. Примеры использования в проекте

### 7.1. Middleware

```typescript
import { RoutePath, getPublicRoutes, getProtectedRoutes, getAdminRoutes } from '@/lib/routes/RoutePath';

export async function middleware(request: NextRequest) {
  const publicRoutes = getPublicRoutes();
  const protectedRoutes = getProtectedRoutes();
  const adminRoutes = getAdminRoutes();
  
  // ... логика проверки
  
  return NextResponse.redirect(new URL(RoutePath.auth, request.url));
}
```

### 7.2. Server Actions

```typescript
import { revalidatePath } from 'next/cache';
import { RoutePath } from '@/lib/routes/RoutePath';

export async function createGradeAction() {
  // ... логика создания
  
  revalidatePath(RoutePath.grades.base);
  revalidatePath(RoutePath.grades.byId(gradeId));
}
```

### 7.3. Navigation Components

```typescript
import { RoutePath } from '@/lib/routes/RoutePath';

const navItems = [
  { href: RoutePath.grades.my, label: 'Мои группы' },
  { href: RoutePath.grades.base, label: 'Все группы' },
  { href: RoutePath.schedule, label: 'Расписание' },
  { href: RoutePath.goldenVersesLibrary.base, label: 'Золотые стихи' },
  { href: RoutePath.teachersManagement.base, label: 'Преподаватели' },
  { href: RoutePath.pupilsManagement.base, label: 'Ученики' },
];
```

### 7.4. Lesson Management

```typescript
import { RoutePath } from '@/lib/routes/RoutePath';

// Создание урока
router.push(RoutePath.lessons.new);

// После создания урока - редирект на страницу урока
redirect(RoutePath.lessons.byId(newLessonId));

// Revalidate после обновления урока
revalidatePath(RoutePath.lessons.byId(lessonId));
revalidatePath(RoutePath.lessons.completeTable(lessonId));
```

### 7.5. Grade Schedule Management

```typescript
import { RoutePath } from '@/lib/routes/RoutePath';

// Создание события расписания
router.push(RoutePath.grades.schedule.new(gradeId));

// Редактирование события
router.push(RoutePath.grades.schedule.edit(gradeId, eventId));

// Revalidate после изменения расписания
revalidatePath(RoutePath.grades.schedule.base(gradeId));
```

---

## 8. Проверка соответствия

### 8.1. Автоматическая проверка

Создайте ESLint правило для проверки использования захардкодженных путей (опционально):

```javascript
// eslint.config.mjs
rules: {
  'no-hardcoded-paths': ['error', {
    allowedPaths: ['/api', '/_next'],
    routePathImport: '@/lib/routes/RoutePath',
  }],
}
```

### 8.2. Ручная проверка

Перед коммитом проверьте:
- ✅ Все пути импортируются из `RoutePath.ts`
- ✅ Нет захардкодженных строк с путями
- ✅ Нет конкатенации строк для создания путей
- ✅ TypeScript компилируется без ошибок

---

## 9. Ссылки

- [`src/lib/routes/RoutePath.ts`](../../../src/lib/routes/RoutePath.ts) - файл с константами путей
- [`docs/architecture/ARCHITECTURE.md`](../../architecture/ARCHITECTURE.md) - архитектура проекта, раздел 3.4

---

**Важно:** Следование этим правилам обеспечивает единообразие и поддерживаемость кода проекта. Все разработчики обязаны использовать `RoutePath.ts` для всех путей в приложении.

