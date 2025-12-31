# Оптимизация получения данных для страницы группы через батчинг запросов

## Статус
🔍 **Исследование** - Анализ возможности оптимизации

## Вопрос

Возможно ли получить всю информацию, достаточную для рендеринга страницы группы (`/grades/[gradeId]`), за **1-5 запросов** к AppSync вместо текущих ~110 запросов? Какие изменения в GraphQL схеме необходимы для этого?

## Текущая ситуация

### Количество запросов в текущей реализации

Для страницы группы с типичными данными (2 учебных года, 10 уроков в каждом, 3 golden verses на урок, 5 учеников):

**Базовые запросы**: ~8 запросов
- `getGrade(gradeId)` - 1 запрос
- `getPupilsByGrade(gradeId)` - 1 запрос
- `getAcademicYearsByGrade(gradeId)` - 1 запрос
- `getGradeEventsByGrade(gradeId)` - 1 запрос
- `getGradeSettingsByGrade(gradeId)` - 1 запрос
- `getUserGradesByGradeId(gradeId)` - 1 запрос
- `getUser(userId)` для каждого учителя - N запросов

**Запросы для уроков**: ~2 запроса
- `getLessonsByAcademicYear(academicYearId)` для каждого учебного года

**Запросы для данных уроков**: ~100 запросов
- `getHomeworkChecksByLesson(lessonId)` - 20 запросов
- `getLessonGoldenVersesByLesson(lessonId)` - 20 запросов
- `getGoldenVerse(goldenVerseId)` - 60 запросов

**Итого: ~110 запросов**

### Проблемы текущей реализации

1. **Превышение лимита AppSync**: При параллельном выполнении через `Promise.all` может превысить лимит 1000 RPS
2. **Потеря контекста аутентификации**: При большом количестве параллельных запросов
3. **Медленная загрузка**: Множественные round trips к API
4. **Высокая нагрузка на AppSync**: Особенно при нескольких одновременных пользователях

## Анализ возможности батчинга

### Вариант 1: Один запрос через GraphQL Aliases

**Идея**: Использовать GraphQL aliases для группировки всех запросов в один GraphQL запрос.

**Пример запроса**:

```graphql
query GetGradeComplete($gradeId: ID!) {
  # Основная информация о группе
  grade: getGrade(id: $gradeId) {
    id
    name
    description
    minAge
    maxAge
    active
    createdAt
    updatedAt
  }
  
  # Ученики группы
  pupils: pupilsByGradeId(
    gradeId: $gradeId
    sortDirection: ASC
  ) {
    items {
      id
      firstName
      lastName
      middleName
      dateOfBirth
      photo
      active
      createdAt
      updatedAt
    }
  }
  
  # Учебные годы группы
  academicYears: academicYearsByGradeId(
    gradeId: $gradeId
    sortDirection: DESC
  ) {
    items {
      id
      name
      startDate
      endDate
      status
      createdAt
      updatedAt
    }
  }
  
  # События группы
  events: gradeEventsByGradeId(
    gradeId: $gradeId
    sortDirection: ASC
  ) {
    items {
      id
      eventType
      title
      description
      eventDate
      createdAt
      updatedAt
    }
  }
  
  # Настройки группы
  settings: gradeSettingsByGradeId(gradeId: $gradeId) {
    items {
      id
      enableGoldenVerse
      enableTest
      enableNotebook
      enableSinging
      pointsGoldenVerse
      pointsTest
      pointsNotebook
      pointsSinging
      labelGoldenVerse
      labelTest
      labelNotebook
      labelSinging
      createdAt
      updatedAt
    }
  }
  
  # Учителя группы
  userGrades: userGradesByGradeIdAndUserId(gradeId: $gradeId) {
    items {
      userId
    }
  }
}
```

**Проблема**: Этот запрос получает только базовую информацию. Для получения данных уроков (homework checks, golden verses) нужны дополнительные запросы, так как:
- Количество уроков неизвестно заранее
- Нужно получить данные для каждого урока отдельно
- GraphQL не поддерживает динамические aliases на основе массива

**Вывод**: Один запрос **невозможен** для полных данных страницы группы.

### Вариант 2: 3-5 запросов с батчингом

**Идея**: Разделить запросы на логические группы и использовать батчинг внутри каждой группы.

#### Запрос 1: Базовая информация о группе

```graphql
query GetGradeBase($gradeId: ID!) {
  grade: getGrade(id: $gradeId) {
    id
    name
    description
    minAge
    maxAge
    active
    createdAt
    updatedAt
  }
  
  pupils: pupilsByGradeId(gradeId: $gradeId) {
    items {
      id
      firstName
      lastName
      middleName
      dateOfBirth
      photo
      active
      createdAt
      updatedAt
    }
  }
  
  academicYears: academicYearsByGradeId(gradeId: $gradeId) {
    items {
      id
      name
      startDate
      endDate
      status
      createdAt
      updatedAt
    }
  }
  
  events: gradeEventsByGradeId(gradeId: $gradeId) {
    items {
      id
      eventType
      title
      description
      eventDate
      createdAt
      updatedAt
    }
  }
  
  settings: gradeSettingsByGradeId(gradeId: $gradeId) {
    items {
      id
      enableGoldenVerse
      enableTest
      enableNotebook
      enableSinging
      pointsGoldenVerse
      pointsTest
      pointsNotebook
      pointsSinging
      labelGoldenVerse
      labelTest
      labelNotebook
      labelSinging
      createdAt
      updatedAt
    }
  }
  
  userGrades: userGradesByGradeIdAndUserId(gradeId: $gradeId) {
    items {
      userId
    }
  }
}
```

**Результат**: 1 запрос вместо ~8 запросов

#### Запрос 2: Уроки для всех учебных годов

**Проблема**: Нужно получить уроки для каждого учебного года отдельно, так как индексы работают по `academicYearId`.

**Вариант 2.1**: Один запрос с aliases для каждого учебного года (если количество учебных годов ограничено)

```graphql
query GetLessonsForAcademicYears(
  $academicYear1Id: ID!
  $academicYear2Id: ID!
) {
  lessons1: lessonsByAcademicYearIdAndLessonDate(
    academicYearId: $academicYear1Id
    sortDirection: ASC
  ) {
    items {
      id
      title
      content
      lessonDate
      order
      teacherId
      createdAt
      updatedAt
    }
  }
  
  lessons2: lessonsByAcademicYearIdAndLessonDate(
    academicYearId: $academicYear2Id
    sortDirection: ASC
  ) {
    items {
      id
      title
      content
      lessonDate
      order
      teacherId
      createdAt
      updatedAt
    }
  }
}
```

**Проблема**: Количество учебных годов может быть разным (1, 2, 3...), поэтому нельзя использовать фиксированные aliases.

**Вариант 2.2**: Отдельный запрос для каждого учебного года

```graphql
# Запрос для каждого учебного года
query GetLessonsForAcademicYear($academicYearId: ID!) {
  lessons: lessonsByAcademicYearIdAndLessonDate(
    academicYearId: $academicYearId
    sortDirection: ASC
  ) {
    items {
      id
      title
      content
      lessonDate
      order
      teacherId
      createdAt
      updatedAt
    }
  }
}
```

**Результат**: N запросов (где N = количество учебных годов), обычно 1-3 запроса

#### Запрос 3: Данные для всех уроков (homework checks, golden verses)

**Проблема**: Нужно получить данные для каждого урока отдельно, так как индексы работают по `lessonId`.

**Вариант 3.1**: BatchGetItem через кастомный resolver (требует изменения схемы)

**Вариант 3.2**: Отдельные запросы для каждого урока (текущая реализация)

**Вариант 3.3**: Создать кастомный query в схеме, который принимает массив lessonId

**Необходимые изменения в схеме**:

```graphql
# Добавить в schema.graphql
type Query {
  # Существующие queries...
  
  # Новый query для получения данных всех уроков
  getLessonsData(lessonIds: [ID!]!): LessonsDataResponse
}

type LessonsDataResponse {
  lessons: [LessonData!]!
}

type LessonData {
  lessonId: ID!
  homeworkChecks: [HomeworkCheck!]!
  goldenVerses: [LessonGoldenVerseData!]!
}

type LessonGoldenVerseData {
  id: ID!
  goldenVerseId: ID!
  order: Int!
  goldenVerse: GoldenVerse
}
```

**Реализация resolver** (требует создания Lambda функции или VTL resolver):

```typescript
// Lambda resolver для getLessonsData
export async function getLessonsDataResolver(event: AppSyncResolverEvent<{ lessonIds: string[] }>) {
  const { lessonIds } = event.arguments;
  
  // Параллельно получить данные для всех уроков
  const results = await Promise.all(
    lessonIds.map(async (lessonId) => {
      const [homeworkChecks, lessonGoldenVerses] = await Promise.all([
        getHomeworkChecksByLesson(lessonId),
        getLessonGoldenVersesByLesson(lessonId),
      ]);
      
      // Получить детали golden verses
      const goldenVerseIds = lessonGoldenVerses.map(lgv => lgv.goldenVerseId);
      const goldenVerses = await Promise.all(
        goldenVerseIds.map(id => getGoldenVerse(id))
      );
      
      return {
        lessonId,
        homeworkChecks,
        goldenVerses: lessonGoldenVerses.map((lgv, index) => ({
          ...lgv,
          goldenVerse: goldenVerses[index],
        })),
      };
    })
  );
  
  return { lessons: results };
}
```

**Результат**: 1 запрос вместо ~100 запросов

#### Запрос 4: Учителя группы

```graphql
query GetTeachersForGrade($userIds: [ID!]!) {
  # Использовать batch query через aliases
  # Но GraphQL не поддерживает динамические aliases
  # Нужен кастомный query
}
```

**Необходимые изменения в схеме**:

```graphql
type Query {
  getUsersByIds(userIds: [ID!]!): [User!]!
}
```

**Реализация resolver**:

```typescript
export async function getUsersByIdsResolver(event: AppSyncResolverEvent<{ userIds: string[] }>) {
  const { userIds } = event.arguments;
  
  // Использовать BatchGetItem для получения всех пользователей
  const users = await Promise.all(
    userIds.map(id => getUser(id))
  );
  
  return users.filter(Boolean);
}
```

**Результат**: 1 запрос вместо N запросов (где N = количество учителей)

### Итоговый вариант: 3-5 запросов

1. **Запрос 1**: Базовая информация о группе (grade, pupils, academicYears, events, settings, userGrades) - **1 запрос**
2. **Запрос 2**: Уроки для каждого учебного года - **1-3 запроса** (в зависимости от количества учебных годов)
3. **Запрос 3**: Данные для всех уроков (homework checks, golden verses) - **1 запрос** (требует кастомный query)
4. **Запрос 4**: Учителя группы - **1 запрос** (требует кастомный query)

**Итого: 4-6 запросов** (вместо ~110)

## Необходимые изменения в schema.graphql

### 1. Добавить кастомный query для получения данных уроков

```graphql
type Query {
  # Существующие queries...
  
  # Новый query для получения данных всех уроков
  getLessonsData(lessonIds: [ID!]!): LessonsDataResponse
}

type LessonsDataResponse {
  lessons: [LessonData!]!
}

type LessonData {
  lessonId: ID!
  homeworkChecks: [HomeworkCheck!]!
  goldenVerses: [LessonGoldenVerseData!]!
}

type LessonGoldenVerseData {
  id: ID!
  goldenVerseId: ID!
  order: Int!
  goldenVerse: GoldenVerse
}
```

### 2. Добавить кастомный query для получения пользователей по массиву ID

```graphql
type Query {
  # Существующие queries...
  
  # Новый query для получения пользователей по массиву ID
  getUsersByIds(userIds: [ID!]!): [User!]!
}
```

### 3. Создать кастомные resolvers

**Вариант A: Lambda resolver** (рекомендуется)

```typescript
// amplify/backend/function/getLessonsData/resource.ts
export const getLessonsDataFunction = {
  name: 'getLessonsData',
  handler: 'index.handler',
  runtime: 'nodejs20.x',
  environment: {
    REGION: process.env.AWS_REGION,
  },
};
```

**Вариант B: VTL resolver** (сложнее, но быстрее)

```vtl
## getLessonsData.req.vtl
# Использовать BatchGetItem для получения данных
```

## Оценка целесообразности

### Преимущества батчинга

1. ✅ **Значительное снижение количества запросов**: С ~110 до 4-6 запросов
2. ✅ **Снижение нагрузки на AppSync**: Меньше вероятность превышения лимита
3. ✅ **Улучшение производительности**: Меньше round trips к API
4. ✅ **Упрощение кода**: Меньше параллельных запросов, проще обработка ошибок
5. ✅ **Решение проблемы с контекстом аутентификации**: Меньше параллельных запросов

### Недостатки и сложности

1. ⚠️ **Требует изменения схемы**: Добавление кастомных queries и resolvers
2. ⚠️ **Усложнение архитектуры**: Нужны Lambda функции или VTL resolvers
3. ⚠️ **Дополнительная разработка**: Требует времени на реализацию
4. ⚠️ **Тестирование**: Нужно протестировать новые resolvers
5. ⚠️ **Поддержка**: Больше кода для поддержки

### Альтернативные решения (проще)

1. **Ограничение параллелизма**: Использовать `p-limit` для ограничения количества параллельных запросов (5-10)
2. **Последовательная обработка**: Обрабатывать уроки последовательно вместо параллельно
3. **Кэширование**: Использовать Next.js cache для статических данных
4. **SSG/ISR**: Использовать Static Site Generation с ревалидацией

## Рекомендация

### Для MVP: НЕ рекомендуется

**Причины**:
1. Требует значительных изменений в схеме и архитектуре
2. Усложняет код и поддержку
3. Альтернативные решения (ограничение параллелизма, последовательная обработка) проще и решают проблему
4. Время разработки может быть потрачено на более важные функции

### Для продакшена: Рекомендуется рассмотреть

**Причины**:
1. Значительное улучшение производительности
2. Снижение нагрузки на AppSync
3. Масштабируемость при росте количества пользователей
4. Лучший пользовательский опыт

**План реализации**:
1. Сначала реализовать простые решения (ограничение параллелизма)
2. Мониторить использование AppSync
3. Если проблема сохраняется, реализовать батчинг запросов

## Пример реализации (для будущего)

### 1. Обновить schema.graphql

```graphql
type Query {
  # Существующие queries...
  
  getLessonsData(lessonIds: [ID!]!): LessonsDataResponse
  getUsersByIds(userIds: [ID!]!): [User!]!
}

type LessonsDataResponse {
  lessons: [LessonData!]!
}

type LessonData {
  lessonId: ID!
  homeworkChecks: [HomeworkCheck!]!
  goldenVerses: [LessonGoldenVerseData!]!
}

type LessonGoldenVerseData {
  id: ID!
  goldenVerseId: ID!
  order: Int!
  goldenVerse: GoldenVerse
}
```

### 2. Создать Lambda resolver

```typescript
// amplify/backend/function/getLessonsData/src/index.ts
import { AppSyncResolverEvent } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, BatchGetCommand } from '@aws-sdk/lib-dynamodb';

export const handler = async (event: AppSyncResolverEvent<{ lessonIds: string[] }>) => {
  const { lessonIds } = event.arguments;
  
  // Реализация получения данных для всех уроков
  // ...
  
  return { lessons: results };
};
```

### 3. Обновить Server Action

```typescript
// actions/grades.ts
export async function getGradeWithFullDataAction(input: unknown) {
  // ...
  
  // Запрос 1: Базовая информация
  const baseData = await executeGraphQL(GetGradeBaseQuery, { gradeId: id });
  
  // Запрос 2: Уроки для каждого учебного года
  const lessonsPromises = academicYears.map(ay => 
    executeGraphQL(GetLessonsForAcademicYearQuery, { academicYearId: ay.id })
  );
  const lessonsResults = await Promise.all(lessonsPromises);
  const allLessonIds = lessonsResults.flatMap(r => r.data.lessons.items.map(l => l.id));
  
  // Запрос 3: Данные для всех уроков
  const lessonsData = await executeGraphQL(GetLessonsDataQuery, { lessonIds: allLessonIds });
  
  // Запрос 4: Учителя
  const userIds = baseData.data.userGrades.items.map(ug => ug.userId);
  const teachers = await executeGraphQL(GetUsersByIdsQuery, { userIds });
  
  // Обработка и возврат данных
  // ...
}
```

## Заключение

**Техническая возможность**: ✅ Да, возможно получить данные за 4-6 запросов вместо ~110

**Необходимые изменения**: 
- Добавить кастомные queries в schema.graphql
- Создать Lambda resolvers или VTL resolvers
- Обновить Server Action для использования новых queries

**Целесообразность для MVP**: ❌ Нет, слишком сложно для MVP. Рекомендуется использовать простые решения (ограничение параллелизма, последовательная обработка).

**Целесообразность для продакшена**: ✅ Да, рекомендуется рассмотреть после MVP, если проблема с лимитами сохраняется.

## Связанные документы

- [Issue: Ошибки аутентификации и превышения лимита](./GRADE_PAGE_AUTHENTICATION_AND_RATE_LIMIT_ERRORS.md)
- [Текущая реализация получения данных](./GRADE_PAGE_DATA_FETCHING.md)
- [AmplifyData и лимиты запросов](./AMPLIFY_DATA_AND_RATE_LIMITS.md)

