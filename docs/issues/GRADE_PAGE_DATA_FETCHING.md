# Детальное описание процесса получения данных для страницы группы

## Обзор

Документация описывает полный процесс получения данных для страницы группы (`/grades/[gradeId]`) в текущей реализации приложения.

## Архитектура получения данных

### Схема потока данных

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Страница: src/app/(private)/grades/[gradeId]/page.tsx   │
│    - Извлекает gradeId из params                            │
│    - Проверяет аутентификацию                               │
│    - Вызывает getGradeWithFullDataAction()                  │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Server Action: actions/grades.ts                        │
│    getGradeWithFullDataAction()                             │
│    - Валидация входных данных                               │
│    - Проверка аутентификации и авторизации                   │
│    - Вызов getGradeWithRelations()                          │
│    - Обработка учебных годов и уроков                       │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Data Access Layer: src/lib/db/queries.ts                │
│    - getGradeWithRelations()                                │
│    - getLessonsByAcademicYear()                             │
│    - getHomeworkChecksByLesson()                             │
│    - getLessonGoldenVersesByLesson()                        │
│    - getGoldenVerse()                                       │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. GraphQL Client: src/lib/db/amplify.ts                    │
│    - executeGraphQL()                                       │
│    - getClient() через generateServerClientUsingCookies     │
│    - Выполнение GraphQL запросов к AWS AppSync             │
└─────────────────────────────────────────────────────────────┘
```

## Детальное описание каждого этапа

### Этап 1: Страница группы

**Файл**: `src/app/(private)/grades/[gradeId]/page.tsx`

**Код**:
```typescript
export default async function GradeDetailPage({
  params,
}: {
  params: Promise<{ gradeId: string }>;
}) {
  // 1. Извлечение gradeId из параметров маршрута
  const { gradeId } = await params;

  // 2. Проверка аутентификации
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect(RoutePath.auth);
  }

  // 3. Загрузка данных группы через Server Action
  const gradeResult = await getGradeWithFullDataAction({ id: gradeId });

  // 4. Обработка ошибок
  if (!gradeResult.success) {
    if (gradeResult.error.includes('not found') || gradeResult.error.includes('Forbidden')) {
      notFound();
    }
    redirect(RoutePath.grades.base);
  }

  // 5. Рендеринг компонентов с полученными данными
  const { grade, pupils, teachers, academicYears } = gradeResult.data;
  // ...
}
```

**Особенности**:
- Server Component (выполняется на сервере)
- Использует `export const dynamic = 'force-dynamic'` для принудительной динамической генерации
- Проверяет аутентификацию перед загрузкой данных
- Обрабатывает ошибки и перенаправления

### Этап 2: Server Action - getGradeWithFullDataAction

**Файл**: `actions/grades.ts`

**Полный процесс выполнения**:

#### Шаг 2.1: Валидация и аутентификация

```typescript
// 1. Валидация входных данных
const validationResult = gradeIdSchema.safeParse(input);
if (!validationResult.success) {
  return { success: false, error: 'Validation failed: ...' };
}

// 2. Проверка аутентификации
const user = await getAuthenticatedUser();
if (!user) {
  return { success: false, error: 'Unauthorized: ...' };
}

// 3. Проверка авторизации
const isAdmin = checkRole(user, ['ADMIN', 'SUPERADMIN']);
const isTeacher = checkRole(user, ['TEACHER']);

// 4. Проверка доступа для учителя
if (isTeacher && !isAdmin) {
  const hasAccess = await checkTeacherGradeAccess(user.id, id);
  if (!hasAccess) {
    return { success: false, error: 'Forbidden: ...' };
  }
}
```

#### Шаг 2.2: Получение базовых данных группы

```typescript
// 5. Получение данных группы с отношениями
const gradeData = await getGradeWithRelations(id);

// gradeData содержит:
// - grade: APITypes.Grade | null
// - pupils: APITypes.Pupil[]
// - academicYears: APITypes.AcademicYear[]
// - events: APITypes.GradeEvent[]
// - settings: APITypes.GradeSettings | null
// - teachers: APITypes.User[]
```

**Функция `getGradeWithRelations()`** выполняет следующие запросы параллельно:

1. `getGrade(gradeId)` - получение группы по ID
2. `getPupilsByGrade(gradeId)` - получение всех учеников группы
3. `getAcademicYearsByGrade(gradeId)` - получение всех учебных годов группы
4. `getGradeEventsByGrade(gradeId)` - получение всех событий группы
5. `getGradeSettingsByGrade(gradeId)` - получение настроек группы
6. `getUserGradesByGradeId(gradeId)` - получение связей учителей с группой
7. Для каждого учителя: `getUser(userId)` - получение данных учителя

**Использует**: `Promise.allSettled()` для обработки ошибок gracefully

#### Шаг 2.3: Обработка учебных годов и уроков

```typescript
// 6. Сортировка учебных годов по дате начала (новые первые)
const sortedAcademicYears = sortAcademicYearsByStartDate(gradeData.academicYears);

// 7. Обработка каждого учебного года
for (const academicYear of sortedAcademicYears) {
  // 7.1. Получение уроков для учебного года
  const lessonsResult = await getLessonsByAcademicYear(academicYear.id);
  const lessons = (lessonsResult?.items as APITypes.Lesson[]) || [];

  // 7.2. Обработка каждого урока (ПАРАЛЛЕЛЬНО через Promise.all)
  const lessonsWithStats: LessonWithStats[] = await Promise.all(
    lessons.map(async (lesson) => {
      // 7.2.1. Получение проверок домашних заданий
      const homeworkChecksResult = await getHomeworkChecksByLesson(lesson.id);
      const homeworkChecks = (homeworkChecksResult?.items as APITypes.HomeworkCheck[]) || [];

      // 7.2.2. Расчет статистики
      const homeworkStats = getHomeworkCheckStats(homeworkChecks, totalPupils);

      // 7.2.3. Получение золотых стихов урока
      const goldenVersesResult = await getLessonGoldenVersesByLesson(lesson.id);
      const lessonGoldenVerses = (goldenVersesResult?.items as APITypes.LessonGoldenVerse[]) || [];

      // 7.2.4. Получение деталей каждого золотого стиха (ПАРАЛЛЕЛЬНО)
      const goldenVersesPromises = lessonGoldenVerses.map(async (lgv) => {
        const goldenVerse = await getGoldenVerse(lgv.goldenVerseId);
        return {
          id: lgv.goldenVerseId,
          reference: goldenVerse?.reference || `Стих #${lgv.order || 0}`,
          order: lgv.order || 0,
        };
      });
      const goldenVerses = await Promise.all(goldenVersesPromises);
      goldenVerses.sort((a, b) => a.order - b.order);

      // 7.2.5. Сериализация урока для Server Component
      return {
        lesson: serializedLesson,
        homeworkStats,
        goldenVerses,
      };
    })
  );

  // 7.3. Добавление учебного года с уроками в результат
  academicYearsWithLessons.push({
    academicYear: serializedAcademicYear,
    lessons: lessonsWithStats,
  });
}
```

**Проблема**: Все запросы для уроков выполняются параллельно через `Promise.all`, что может привести к:
- Превышению лимита запросов к AppSync
- Потере контекста аутентификации

#### Шаг 2.4: Сериализация данных

```typescript
// 8. Сериализация учеников и учителей для Server Component
const serializedPupils = gradeData.pupils.map((pupil) => ({
  id: pupil.id,
  gradeId: pupil.gradeId,
  firstName: pupil.firstName,
  lastName: pupil.lastName,
  // ... остальные поля
}));

const serializedTeachers = gradeData.teachers.map((teacher) => ({
  id: teacher.id,
  email: teacher.email,
  name: teacher.name,
  // ... остальные поля
}));

// 9. Возврат полных данных
return {
  success: true,
  data: {
    grade: serializedGrade,
    pupils: serializedPupils,
    teachers: serializedTeachers,
    academicYears: academicYearsWithLessons,
    settings: gradeData.settings,
  },
};
```

### Этап 3: Data Access Layer - функции запросов

**Файл**: `src/lib/db/queries.ts`

#### Функция: getGradeWithRelations()

```typescript
export async function getGradeWithRelations(gradeId: string): Promise<{
  grade: APITypes.Grade | null;
  pupils: APITypes.Pupil[];
  academicYears: APITypes.AcademicYear[];
  events: APITypes.GradeEvent[];
  settings: APITypes.GradeSettings | null;
  teachers: APITypes.User[];
}> {
  // Параллельное выполнение базовых запросов
  const [grade, pupilsResult, academicYearsResult, eventsResult, settings] = 
    await Promise.allSettled([
      getGrade(gradeId),
      getPupilsByGrade(gradeId).catch(() => null),
      getAcademicYearsByGrade(gradeId).catch(() => null),
      getGradeEventsByGrade(gradeId).catch(() => null),
      getGradeSettingsByGrade(gradeId).catch(() => null),
    ]);

  // Получение учителей через UserGrade junction table
  const teachers = await (async () => {
    // 1. Получение связей UserGrade
    const userGrades = await getUserGradesByGradeId(gradeId);
    const userIds = userGrades.map((ug) => ug.userId).filter(Boolean);

    // 2. Получение данных каждого учителя (параллельно)
    const users = await Promise.allSettled(
      userIds.map((id: string) => getUser(id))
    );

    return users
      .filter((u): u is PromiseFulfilledResult<APITypes.User> => 
        u.status === 'fulfilled' && u.value !== null
      )
      .map((u) => u.value);
  })();

  return {
    grade: gradeValue,
    pupils: pupilsResultValue?.items || [],
    academicYears: academicYearsResultValue?.items || [],
    events: eventsResultValue?.items || [],
    settings: settingsValue,
    teachers,
  };
}
```

#### Функция: getLessonsByAcademicYear()

```typescript
export async function getLessonsByAcademicYear(
  academicYearId: string,
  limit?: number,
  nextToken?: string
): Promise<APITypes.ModelLessonConnection | null> {
  const queries = await import('../../graphql/queries');
  const { executeGraphQL } = await import('./amplify');
  
  const query = (queries as Record<string, string>).lessonsByAcademicYearIdAndOrder;
  if (!query) {
    throw new Error('Query lessonsByAcademicYearIdAndOrder not found');
  }
  
  const result = await executeGraphQL<{
    lessonsByAcademicYearIdAndOrder?: APITypes.ModelLessonConnection;
  }>(query, {
    academicYearId,
    limit,
    nextToken,
  });

  return result.data?.lessonsByAcademicYearIdAndOrder || null;
}
```

**Использует**: GraphQL индекс `lessonsByAcademicYearIdAndOrder`

#### Функция: getHomeworkChecksByLesson()

```typescript
export async function getHomeworkChecksByLesson(
  lessonId: string,
  limit?: number,
  nextToken?: string
): Promise<APITypes.ModelHomeworkCheckConnection | null> {
  const queries = await import('../../graphql/queries');
  const { executeGraphQL } = await import('./amplify');
  
  const query = (queries as Record<string, string>).homeworkChecksByLessonIdAndPupilId;
  if (!query) {
    throw new Error('Query homeworkChecksByLessonIdAndPupilId not found');
  }
  
  const result = await executeGraphQL<{
    homeworkChecksByLessonIdAndPupilId?: APITypes.ModelHomeworkCheckConnection;
  }>(query, {
    lessonId,
    limit,
    nextToken,
  });

  return result.data?.homeworkChecksByLessonIdAndPupilId || null;
}
```

**Использует**: GraphQL индекс `homeworkChecksByLessonIdAndPupilId`

#### Функция: getLessonGoldenVersesByLesson()

```typescript
export async function getLessonGoldenVersesByLesson(
  lessonId: string,
  limit?: number,
  nextToken?: string
): Promise<APITypes.ModelLessonGoldenVerseConnection | null> {
  const queries = await import('../../graphql/queries');
  const { executeGraphQL } = await import('./amplify');
  
  const query = (queries as Record<string, string>).lessonGoldenVersesByLessonIdAndOrder;
  if (!query) {
    throw new Error('Query lessonGoldenVersesByLessonIdAndOrder not found');
  }
  
  const result = await executeGraphQL<{
    lessonGoldenVersesByLessonIdAndOrder?: APITypes.ModelLessonGoldenVerseConnection;
  }>(query, {
    lessonId,
    limit,
    nextToken,
  });

  return result.data?.lessonGoldenVersesByLessonIdAndOrder || null;
}
```

**Использует**: GraphQL индекс `lessonGoldenVersesByLessonIdAndOrder`

#### Функция: getGoldenVerse()

```typescript
export async function getGoldenVerse(id: string): Promise<APITypes.GoldenVerse | null> {
  return (await amplifyData.get('GoldenVerse', id)) as APITypes.GoldenVerse | null;
}
```

**Использует**: `amplifyData.get()` для получения записи по ID

### Этап 4: GraphQL Client

**Файл**: `src/lib/db/amplify.ts`

#### Функция: executeGraphQL()

```typescript
export async function executeGraphQL<T = unknown>(
  query: string,
  variables?: Record<string, unknown>
): Promise<GraphQLResult<T>> {
  try {
    // 1. Создание клиента для каждого запроса
    const client = getClient();
    
    // 2. Выполнение GraphQL запроса
    const result = await client.graphql({
      query,
      variables: variables || {},
    });

    // 3. Проверка ошибок
    if ('errors' in result && result.errors && result.errors.length > 0) {
      throw new GraphQLErrorClass(
        `GraphQL errors: ${result.errors.map((e) => e.message).join(', ')}`,
        errors
      );
    }

    return result as GraphQLResult<T>;
  } catch (error) {
    // 4. Обработка ошибок
    const { parseError } = await import('./errors');
    throw parseError(error);
  }
}
```

#### Функция: getClient()

```typescript
function getClient() {
  return generateServerClientUsingCookies({
    config: amplifyConfig,
    cookies, // Функция из next/headers
  });
}
```

**Особенности**:
- Создает новый клиент для каждого запроса
- Использует cookies для аутентификации
- Может терять контекст при параллельных запросах

## Подсчет количества запросов

### Пример: Группа с 2 учебными годами, 10 уроками в каждом, 3 golden verses на урок, 5 учениками

#### Базовые запросы (getGradeWithRelations):
1. `getGrade(gradeId)` - 1 запрос
2. `getPupilsByGrade(gradeId)` - 1 запрос
3. `getAcademicYearsByGrade(gradeId)` - 1 запрос
4. `getGradeEventsByGrade(gradeId)` - 1 запрос
5. `getGradeSettingsByGrade(gradeId)` - 1 запрос
6. `getUserGradesByGradeId(gradeId)` - 1 запрос
7. `getUser(userId)` для каждого учителя - N запросов (например, 2 учителя = 2 запроса)

**Итого базовых запросов**: ~8 запросов

#### Запросы для учебных годов и уроков:
8. `getLessonsByAcademicYear(academicYear1Id)` - 1 запрос
9. `getLessonsByAcademicYear(academicYear2Id)` - 1 запрос

**Итого запросов для уроков**: 2 запроса

#### Запросы для каждого урока (выполняются параллельно через Promise.all):
10. `getHomeworkChecksByLesson(lessonId)` - 20 запросов (10 уроков × 2 года)
11. `getLessonGoldenVersesByLesson(lessonId)` - 20 запросов (10 уроков × 2 года)
12. `getGoldenVerse(goldenVerseId)` - 60 запросов (20 уроков × 3 verses)

**Итого запросов для данных уроков**: 100 запросов

#### Общее количество запросов:
**~110 запросов**, все выполняются параллельно через `Promise.all`

## Проблемные места

### 1. Параллельное выполнение всех запросов

**Проблема**: Все запросы для уроков выполняются через `Promise.all`, что может привести к:
- Превышению лимита AppSync (1000 RPS)
- Потере контекста аутентификации
- Ошибкам "Rate exceeded" и "No current user"

**Решение**: Ограничить параллелизм или использовать последовательную обработку

### 2. Создание нового клиента для каждого запроса

**Проблема**: `getClient()` создает новый клиент для каждого запроса, что может привести к потере контекста cookies при параллельных запросах

**Решение**: Использовать один клиент для всех запросов в рамках одного Server Action

### 3. Отсутствие retry логики

**Проблема**: При ошибке "Rate exceeded" запрос просто падает без повторной попытки

**Решение**: Добавить retry логику с экспоненциальной задержкой

### 4. Отсутствие кэширования

**Проблема**: Данные запрашиваются каждый раз заново, даже если они не изменились

**Решение**: Использовать Next.js cache или SSG/ISR для кэширования данных

## Рекомендации по оптимизации

1. **Ограничить параллелизм**: Использовать `p-limit` для ограничения количества параллельных запросов (5-10)
2. **Последовательная обработка**: Для MVP использовать последовательную обработку уроков
3. **Добавить retry логику**: Обрабатывать ошибки "Rate exceeded" с повторными попытками
4. **Использовать кэширование**: Рассмотреть SSG/ISR для статических данных
5. **Батчинг запросов**: Группировать несколько запросов в один GraphQL запрос

## Связанные документы

- [Issue: Ошибки аутентификации и превышения лимита](./GRADE_PAGE_AUTHENTICATION_AND_RATE_LIMIT_ERRORS.md)
- [AmplifyData и лимиты запросов](./AMPLIFY_DATA_AND_RATE_LIMITS.md)

