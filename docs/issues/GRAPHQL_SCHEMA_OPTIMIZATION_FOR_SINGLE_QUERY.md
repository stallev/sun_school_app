# Оптимизация GraphQL схемы для получения данных одним запросом

## Статус
🔍 **Исследование** - Анализ возможности оптимизации схемы

## Вопросы исследования

1. Как изменить `amplify/backend/api/sunsch/schema.graphql` для получения данных страницы группы одним запросом к AppSync?
2. Возможно ли это в режиме FreeTier?
3. Изменится ли структура базы DynamoDB?
4. Необходима ли миграция данных?
5. Как обеспечить получение данных для каждой страницы проекта одним запросом?

---

## 1. Возможность получения данных одним запросом

### 1.1. Текущая ситуация

**Текущая реализация страницы группы** (`/grades/[gradeId]`) использует:
- ~110 запросов к AppSync для типичной группы (2 учебных года, 10 уроков в каждом)
- Параллельное выполнение через `Promise.all`
- Отдельные запросы для каждой сущности (grade, pupils, academicYears, lessons, homeworkChecks, goldenVerses)

**Проблемы**:
- Превышение лимита AppSync (1000 RPS)
- Потеря контекста аутентификации при параллельных запросах
- Медленная загрузка из-за множественных round trips

### 1.2. Техническая возможность

#### ✅ Вариант 1: GraphQL Aliases (без изменений схемы)

**Возможность**: ✅ **Частично возможно**

Можно объединить несколько queries в один GraphQL запрос используя aliases:

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
  
  # Связи учителей с группой
  userGrades: userGradesByGradeIdAndUserId(gradeId: $gradeId) {
    items {
      userId
      gradeId
      assignedAt
    }
  }
}
```

**Результат**: 1 запрос вместо ~8 базовых запросов

**Ограничения**:
- ❌ Нельзя использовать динамические aliases для массива неизвестной длины
- ❌ Для уроков нужно знать количество учебных годов заранее
- ❌ Для данных уроков (homework checks, golden verses) нужны отдельные запросы

**Вывод**: Можно получить базовую информацию одним запросом, но не полные данные страницы.

#### ⚠️ Вариант 2: Восстановление @hasMany/@belongsTo директив

**Возможность**: ⚠️ **Технически возможно, но проблематично**

**Текущая ситуация**: Директивы `@hasMany` и `@belongsTo` удалены из схемы для устранения циклических зависимостей CloudFormation.

**Если восстановить директивы**:

```graphql
type Grade @model {
  id: ID!
  name: String!
  # ... другие поля
  
  # Восстановленные связи
  pupils: [Pupil] @hasMany(indexName: "byGradeId", fields: ["id"])
  academicYears: [AcademicYear] @hasMany(indexName: "byGradeId", fields: ["id"])
  events: [GradeEvent] @hasMany(indexName: "byGradeId", fields: ["id"])
  settings: GradeSettings @hasOne(fields: ["id"])
  teachers: [UserGrade] @hasMany(indexName: "byGradeId", fields: ["id"])
}

type AcademicYear @model {
  id: ID!
  gradeId: ID! @index(name: "byGradeId", sortKeyFields: ["startDate"])
  # ... другие поля
  
  # Восстановленные связи
  grade: Grade @belongsTo(fields: ["gradeId"])
  lessons: [Lesson] @hasMany(indexName: "byAcademicYearId", fields: ["id"])
}

type Lesson @model {
  id: ID!
  academicYearId: ID! @index(name: "byAcademicYearId", sortKeyFields: ["lessonDate"])
  # ... другие поля
  
  # Восстановленные связи
  academicYear: AcademicYear @belongsTo(fields: ["academicYearId"])
  homeworkChecks: [HomeworkCheck] @hasMany(indexName: "byLessonId", fields: ["id"])
  goldenVerses: [LessonGoldenVerse] @hasMany(indexName: "byLessonId", fields: ["id"])
}
```

**Запрос с вложенными данными**:

```graphql
query GetGradeWithNestedData($gradeId: ID!) {
  getGrade(id: $gradeId) {
    id
    name
    description
    pupils {
      items {
        id
        firstName
        lastName
      }
    }
    academicYears {
      items {
        id
        name
        lessons {
          items {
            id
            title
            lessonDate
            homeworkChecks {
              items {
                id
                pupilId
                points
              }
            }
            goldenVerses {
              items {
                id
                order
                goldenVerse {
                  id
                  reference
                  text
                }
              }
            }
          }
        }
      }
    }
  }
}
```

**Проблемы**:
- ⚠️ **Циклические зависимости CloudFormation**: Могут возникнуть при генерации resolvers
- ⚠️ **Переиспользование auth resolver функций**: Может вызвать конфликты между моделями с идентичными @auth правилами
- ⚠️ **Сложность отладки**: Resolvers генерируются автоматически, сложнее отлаживать
- ⚠️ **Производительность**: Вложенные запросы могут быть медленнее из-за N+1 проблемы в resolvers

**Вывод**: Технически возможно, но может вызвать проблемы с CloudFormation и усложнить поддержку.

#### ✅ Вариант 3: Кастомные queries с batch операциями

**Возможность**: ✅ **Рекомендуется для продакшена**

**Необходимые изменения в схеме**:

```graphql
type Query {
  # Существующие queries...
  
  # Новый query для получения полных данных группы
  getGradeComplete(gradeId: ID!): GradeCompleteResponse
  
  # Новый query для получения данных уроков
  getLessonsData(lessonIds: [ID!]!): LessonsDataResponse
  
  # Новый query для получения пользователей по массиву ID
  getUsersByIds(userIds: [ID!]!): [User!]!
}

type GradeCompleteResponse {
  grade: Grade
  pupils: [Pupil!]!
  academicYears: [AcademicYearWithLessons!]!
  events: [GradeEvent!]!
  settings: GradeSettings
  teachers: [User!]!
}

type AcademicYearWithLessons {
  academicYear: AcademicYear!
  lessons: [LessonWithData!]!
}

type LessonWithData {
  lesson: Lesson!
  homeworkChecks: [HomeworkCheck!]!
  goldenVerses: [LessonGoldenVerseWithDetails!]!
}

type LessonGoldenVerseWithDetails {
  id: ID!
  goldenVerseId: ID!
  order: Int!
  goldenVerse: GoldenVerse!
}

type LessonsDataResponse {
  lessons: [LessonWithData!]!
}
```

**Реализация через Lambda resolver**:

```typescript
// amplify/backend/function/getGradeComplete/src/index.ts
import { AppSyncResolverEvent } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, BatchGetCommand } from '@aws-sdk/lib-dynamodb';

export const handler = async (
  event: AppSyncResolverEvent<{ gradeId: string }>
) => {
  const { gradeId } = event.arguments;
  const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));
  
  // Параллельно получить все данные
  const [grade, pupils, academicYears, events, settings, userGrades] = await Promise.all([
    getGrade(client, gradeId),
    getPupilsByGrade(client, gradeId),
    getAcademicYearsByGrade(client, gradeId),
    getGradeEventsByGrade(client, gradeId),
    getGradeSettingsByGrade(client, gradeId),
    getUserGradesByGrade(client, gradeId),
  ]);
  
  // Получить учителей
  const userIds = userGrades.map(ug => ug.userId);
  const teachers = await getUsersByIds(client, userIds);
  
  // Получить уроки для каждого учебного года
  const academicYearsWithLessons = await Promise.all(
    academicYears.map(async (ay) => {
      const lessons = await getLessonsByAcademicYear(client, ay.id);
      const lessonsWithData = await getLessonsData(client, lessons.map(l => l.id));
      
      return {
        academicYear: ay,
        lessons: lessonsWithData,
      };
    })
  );
  
  return {
    grade,
    pupils,
    academicYears: academicYearsWithLessons,
    events,
    settings,
    teachers,
  };
};
```

**Преимущества**:
- ✅ Один запрос для получения всех данных
- ✅ Контроль над производительностью (batch операции DynamoDB)
- ✅ Оптимизация запросов на уровне resolver
- ✅ Нет проблем с циклическими зависимостями

**Недостатки**:
- ⚠️ Требует создания Lambda функций
- ⚠️ Усложнение архитектуры
- ⚠️ Дополнительные расходы на Lambda (но минимальные)

**Вывод**: ✅ **Рекомендуется для продакшена** после MVP.

---

## 2. Ограничения FreeTier

### 2.1. AWS AppSync FreeTier лимиты

**Бесплатный уровень AWS AppSync** (первые 12 месяцев):

| Лимит | Значение | Описание |
|-------|----------|----------|
| **API Operations** | 250,000/месяц | Общее количество операций (queries, mutations, subscriptions) |
| **Real-time Updates** | 250,000/месяц | Количество сообщений через subscriptions |
| **Data Transfer Out** | 1 GB/месяц | Исходящий трафик |

**После FreeTier** (платные тарифы):
- $4.00 за миллион операций
- $0.08 за GB исходящего трафика

### 2.2. Лимиты производительности

**Независимо от тарифа**:

| Лимит | Значение | Описание |
|-------|----------|----------|
| **Requests Per Second (RPS)** | ~1000 | Максимальное количество запросов в секунду |
| **Burst Capacity** | ~2000 | Кратковременное превышение RPS |
| **Concurrent Connections** | 1000 | Максимальное количество одновременных подключений |
| **Query Complexity** | 1000 | Максимальная сложность GraphQL запроса |

### 2.3. Влияние оптимизации на FreeTier

**Текущая реализация** (110 запросов на страницу):
- При 10 пользователях в день: ~1,100 запросов/день = ~33,000/месяц
- При 100 пользователях в день: ~11,000 запросов/день = ~330,000/месяц ❌ **Превышение FreeTier**

**С оптимизацией** (1-5 запросов на страницу):
- При 10 пользователях в день: ~10-50 запросов/день = ~300-1,500/месяц ✅
- При 100 пользователях в день: ~100-500 запросов/день = ~3,000-15,000/месяц ✅
- При 1,000 пользователях в день: ~1,000-5,000 запросов/день = ~30,000-150,000/месяц ✅

**Вывод**: ✅ **Оптимизация критически важна для FreeTier** - позволяет уложиться в лимит 250,000 операций/месяц даже при росте пользователей.

---

## 3. Изменения в структуре DynamoDB

### 3.1. Вариант 1: GraphQL Aliases (без изменений схемы)

**Изменения в DynamoDB**: ❌ **Не требуются**

- Используются существующие таблицы и индексы
- Изменяется только способ выполнения запросов (один запрос вместо нескольких)
- Структура данных остается прежней

### 3.2. Вариант 2: Восстановление @hasMany/@belongsTo

**Изменения в DynamoDB**: ⚠️ **Минимальные**

- Amplify автоматически создаст resolvers для связей
- Существующие таблицы и индексы остаются без изменений
- Могут быть добавлены дополнительные GSI для оптимизации связей (автоматически)

**Потенциальные изменения**:
- Новые GSI для оптимизации @hasMany связей (если Amplify сочтет необходимым)
- Изменения в структуре resolvers (но не в данных)

### 3.3. Вариант 3: Кастомные queries с Lambda resolvers

**Изменения в DynamoDB**: ❌ **Не требуются**

- Используются существующие таблицы и индексы
- Lambda resolver выполняет batch операции через существующие индексы
- Структура данных остается прежней

**Вывод**: ✅ **Для всех вариантов структура DynamoDB практически не меняется**. Изменения касаются только GraphQL схемы и способа выполнения запросов.

---

## 4. Необходимость миграции данных

### 4.1. Вариант 1: GraphQL Aliases

**Миграция данных**: ❌ **Не требуется**

- Данные остаются в том же формате
- Изменяется только способ запроса

### 4.2. Вариант 2: Восстановление @hasMany/@belongsTo

**Миграция данных**: ⚠️ **Возможна, но маловероятна**

**Сценарии, когда миграция может потребоваться**:
- Если Amplify создаст новые GSI и потребуется переиндексация
- Если структура resolvers изменится и потребуется обновление данных

**Вероятность**: Низкая, так как:
- Существующие индексы уже созданы
- Данные уже соответствуют схеме
- Amplify обычно не требует миграции при добавлении связей

**Если миграция потребуется**:
```bash
# Amplify автоматически обработает изменения при push
amplify push

# Если потребуется ручная миграция (маловероятно)
# 1. Создать backup данных
# 2. Выполнить amplify push
# 3. Проверить целостность данных
```

### 4.3. Вариант 3: Кастомные queries

**Миграция данных**: ❌ **Не требуется**

- Данные остаются в том же формате
- Используются существующие таблицы и индексы

**Вывод**: ✅ **Миграция данных не требуется** для всех вариантов. Тестовые данные останутся без изменений.

---

## 5. Получение данных для каждой страницы одним запросом

### 5.1. Стратегия оптимизации

Для обеспечения получения данных для каждой страницы проекта одним запросом рекомендуется:

#### Шаг 1: Анализ требований каждой страницы

**Необходимо определить для каждой страницы**:
- Какие данные требуются для рендеринга
- Какие связи между сущностями используются
- Какие данные можно кэшировать

**Примеры страниц проекта**:

1. **Страница группы** (`/grades/[gradeId]`):
   - Grade, Pupils, AcademicYears, Lessons, HomeworkChecks, GoldenVerses, Teachers, Settings, Events
   - **Текущее**: ~110 запросов
   - **Цель**: 1-5 запросов

2. **Страница урока** (`/lessons/[lessonId]`):
   - Lesson, AcademicYear, Grade, Teacher, HomeworkChecks, GoldenVerses
   - **Текущее**: ~10-15 запросов
   - **Цель**: 1 запрос

3. **Страница ученика** (`/pupils/[pupilId]`):
   - Pupil, Grade, HomeworkChecks, Achievements, Family
   - **Текущее**: ~20-30 запросов
   - **Цель**: 1-2 запроса

4. **Страница списка групп** (`/grades`):
   - Grades (список)
   - **Текущее**: 1 запрос ✅
   - **Цель**: 1 запрос (уже оптимизировано)

#### Шаг 2: Создание кастомных queries для каждой страницы

**Паттерн**: Создать кастомный query для каждой страницы, который возвращает все необходимые данные.

**Пример для страницы урока**:

```graphql
type Query {
  # Существующие queries...
  
  # Кастомный query для страницы урока
  getLessonComplete(lessonId: ID!): LessonCompleteResponse
}

type LessonCompleteResponse {
  lesson: Lesson!
  academicYear: AcademicYear!
  grade: Grade!
  teacher: User!
  homeworkChecks: [HomeworkCheck!]!
  goldenVerses: [LessonGoldenVerseWithDetails!]!
}

type LessonGoldenVerseWithDetails {
  id: ID!
  goldenVerseId: ID!
  order: Int!
  goldenVerse: GoldenVerse!
}
```

**Реализация Lambda resolver**:

```typescript
export const getLessonCompleteHandler = async (
  event: AppSyncResolverEvent<{ lessonId: string }>
) => {
  const { lessonId } = event.arguments;
  
  // Параллельно получить все данные
  const [lesson, homeworkChecks, lessonGoldenVerses] = await Promise.all([
    getLesson(lessonId),
    getHomeworkChecksByLesson(lessonId),
    getLessonGoldenVersesByLesson(lessonId),
  ]);
  
  // Получить связанные сущности
  const [academicYear, grade, teacher] = await Promise.all([
    getAcademicYear(lesson.academicYearId),
    getGrade(lesson.gradeId),
    getUser(lesson.teacherId),
  ]);
  
  // Получить детали golden verses
  const goldenVerseIds = lessonGoldenVerses.map(lgv => lgv.goldenVerseId);
  const goldenVerses = await batchGetGoldenVerses(goldenVerseIds);
  
  // Объединить данные
  const goldenVersesWithDetails = lessonGoldenVerses.map(lgv => ({
    ...lgv,
    goldenVerse: goldenVerses.find(gv => gv.id === lgv.goldenVerseId),
  }));
  
  return {
    lesson,
    academicYear,
    grade,
    teacher,
    homeworkChecks,
    goldenVerses: goldenVersesWithDetails,
  };
};
```

#### Шаг 3: Оптимизация через batch операции DynamoDB

**Использование BatchGetItem** для получения множественных записей:

```typescript
// Получение множественных golden verses за один запрос
async function batchGetGoldenVerses(ids: string[]): Promise<GoldenVerse[]> {
  const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));
  
  // BatchGetItem поддерживает до 100 элементов за запрос
  const batches = chunkArray(ids, 100);
  const results = await Promise.all(
    batches.map(batch =>
      client.send(
        new BatchGetCommand({
          RequestItems: {
            'GoldenVerse-table': {
              Keys: batch.map(id => ({ id })),
            },
          },
        })
      )
    )
  );
  
  return results.flatMap(r => r.Responses?.['GoldenVerse-table'] || []);
}
```

#### Шаг 4: Кэширование на уровне resolver

**Использование AppSync Response Caching**:

```graphql
type Query {
  getGradeComplete(gradeId: ID!): GradeCompleteResponse
    @aws_cached(ttl: 300) # Кэш на 5 минут
}
```

**Или кэширование в Lambda resolver**:

```typescript
import { createClient } from 'redis';

const redis = createClient({ url: process.env.REDIS_URL });

export const getGradeCompleteHandler = async (event) => {
  const { gradeId } = event.arguments;
  
  // Проверить кэш
  const cached = await redis.get(`grade:${gradeId}:complete`);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Получить данные
  const data = await fetchGradeComplete(gradeId);
  
  // Сохранить в кэш на 5 минут
  await redis.setex(`grade:${gradeId}:complete`, 300, JSON.stringify(data));
  
  return data;
};
```

### 5.2. План реализации

#### Фаза 1: MVP (текущая)

**Действия**:
- ✅ Использовать GraphQL aliases для базовых данных (1 запрос вместо 8)
- ✅ Ограничить параллелизм через последовательную обработку
- ✅ Добавить retry логику для обработки ошибок

**Результат**: Снижение с ~110 до ~20-30 запросов

#### Фаза 2: Оптимизация (после MVP)

**Действия**:
- Создать кастомные queries для основных страниц:
  - `getGradeComplete` - страница группы
  - `getLessonComplete` - страница урока
  - `getPupilComplete` - страница ученика
- Реализовать Lambda resolvers с batch операциями
- Добавить кэширование на уровне resolver

**Результат**: Снижение до 1-2 запросов на страницу

#### Фаза 3: Продвинутая оптимизация (продакшен)

**Действия**:
- Восстановить @hasMany/@belongsTo директивы (если проблемы с CloudFormation решены)
- Использовать AppSync Response Caching
- Реализовать инкрементальную загрузку данных (lazy loading)

**Результат**: Оптимальная производительность и минимальная нагрузка на AppSync

---

## 6. Рекомендации

### 6.1. Для MVP

**Рекомендуется**: ✅ **Вариант 1 (GraphQL Aliases) + последовательная обработка**

**Причины**:
- Минимальные изменения в коде
- Не требует изменения схемы
- Не требует создания Lambda функций
- Быстрая реализация
- Снижение запросов с ~110 до ~20-30

**План действий**:
1. Создать batch query для базовых данных группы (1 запрос)
2. Обрабатывать уроки последовательно (вместо параллельно)
3. Добавить retry логику
4. Мониторить использование AppSync

### 6.2. Для продакшена

**Рекомендуется**: ✅ **Вариант 3 (Кастомные queries с Lambda resolvers)**

**Причины**:
- Максимальная оптимизация (1-2 запроса на страницу)
- Полный контроль над производительностью
- Возможность использования batch операций DynamoDB
- Кэширование на уровне resolver
- Масштабируемость

**План действий**:
1. Создать кастомные queries для основных страниц
2. Реализовать Lambda resolvers с batch операциями
3. Добавить кэширование (AppSync Response Caching или Redis)
4. Мониторить производительность и оптимизировать

### 6.3. Не рекомендуется

**❌ Вариант 2 (Восстановление @hasMany/@belongsTo)** для MVP

**Причины**:
- Риск циклических зависимостей CloudFormation
- Сложность отладки автоматически сгенерированных resolvers
- Потенциальные проблемы с производительностью (N+1)
- Требует больше времени на реализацию и тестирование

**Когда рассмотреть**:
- После решения проблем с CloudFormation
- При необходимости упрощения схемы для разработчиков
- Если Amplify улучшит генерацию resolvers

---

## 7. Примеры реализации

### 7.1. Batch query для базовых данных (Вариант 1)

**GraphQL query**:

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
      gradeId
      assignedAt
    }
  }
}
```

**Использование в Server Action**:

```typescript
// actions/grades.ts
export async function getGradeWithFullDataAction(input: unknown) {
  // ... валидация и авторизация ...
  
  // Запрос 1: Базовая информация (1 запрос вместо 8)
  const baseData = await executeGraphQL(GetGradeBaseQuery, { gradeId: id });
  
  // Запрос 2: Уроки для каждого учебного года (N запросов, где N = количество учебных годов)
  const academicYears = baseData.data.academicYears.items;
  const lessonsPromises = academicYears.map(ay =>
    executeGraphQL(GetLessonsForAcademicYearQuery, { academicYearId: ay.id })
  );
  const lessonsResults = await Promise.all(lessonsPromises);
  
  // Запрос 3: Данные для уроков (последовательно, чтобы избежать rate limit)
  const allLessons = lessonsResults.flatMap(r => r.data.lessons.items);
  const lessonsWithData = [];
  
  for (const lesson of allLessons) {
    const [homeworkChecks, lessonGoldenVerses] = await Promise.all([
      executeGraphQL(GetHomeworkChecksQuery, { lessonId: lesson.id }),
      executeGraphQL(GetLessonGoldenVersesQuery, { lessonId: lesson.id }),
    ]);
    
    // Получить детали golden verses
    const goldenVerseIds = lessonGoldenVerses.data.items.map(lgv => lgv.goldenVerseId);
    const goldenVerses = await Promise.all(
      goldenVerseIds.map(id => getGoldenVerse(id))
    );
    
    lessonsWithData.push({
      lesson,
      homeworkChecks: homeworkChecks.data.items,
      goldenVerses: lessonGoldenVerses.data.items.map((lgv, index) => ({
        ...lgv,
        goldenVerse: goldenVerses[index],
      })),
    });
  }
  
  // Запрос 4: Учителя (batch через aliases, если количество ограничено)
  const userIds = baseData.data.userGrades.items.map(ug => ug.userId);
  const teachers = await Promise.all(userIds.map(id => getUser(id)));
  
  // Объединить и вернуть данные
  return {
    success: true,
    data: {
      grade: baseData.data.grade,
      pupils: baseData.data.pupils.items,
      academicYears: academicYears.map((ay, index) => ({
        academicYear: ay,
        lessons: lessonsWithData.filter(l => 
          l.lesson.academicYearId === ay.id
        ),
      })),
      events: baseData.data.events.items,
      settings: baseData.data.settings.items[0] || null,
      teachers,
    },
  };
}
```

**Результат**: Снижение с ~110 до ~20-30 запросов

### 7.2. Кастомный query с Lambda resolver (Вариант 3)

**Изменения в schema.graphql**:

```graphql
type Query {
  # Существующие queries...
  
  # Новый query для получения полных данных группы
  getGradeComplete(gradeId: ID!): GradeCompleteResponse
    @aws_auth(cognito_groups: ["ADMIN", "SUPERADMIN", "TEACHER"])
}

type GradeCompleteResponse {
  grade: Grade
  pupils: [Pupil!]!
  academicYears: [AcademicYearWithLessons!]!
  events: [GradeEvent!]!
  settings: GradeSettings
  teachers: [User!]!
}

type AcademicYearWithLessons {
  academicYear: AcademicYear!
  lessons: [LessonWithData!]!
}

type LessonWithData {
  lesson: Lesson!
  homeworkChecks: [HomeworkCheck!]!
  goldenVerses: [LessonGoldenVerseWithDetails!]!
}

type LessonGoldenVerseWithDetails {
  id: ID!
  goldenVerseId: ID!
  order: Int!
  goldenVerse: GoldenVerse!
}
```

**Lambda resolver** (`amplify/backend/function/getGradeComplete/src/index.ts`):

```typescript
import { AppSyncResolverEvent } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, BatchGetCommand } from '@aws-sdk/lib-dynamodb';

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler = async (
  event: AppSyncResolverEvent<{ gradeId: string }>
) => {
  const { gradeId } = event.arguments;
  
  try {
    // Параллельно получить базовые данные
    const [grade, pupils, academicYears, events, settings, userGrades] = await Promise.all([
      getGrade(client, gradeId),
      getPupilsByGrade(client, gradeId),
      getAcademicYearsByGrade(client, gradeId),
      getGradeEventsByGrade(client, gradeId),
      getGradeSettingsByGrade(client, gradeId),
      getUserGradesByGrade(client, gradeId),
    ]);
    
    // Получить учителей batch операцией
    const userIds = userGrades.map(ug => ug.userId);
    const teachers = await batchGetUsers(client, userIds);
    
    // Получить уроки для каждого учебного года
    const academicYearsWithLessons = await Promise.all(
      academicYears.map(async (ay) => {
        const lessons = await getLessonsByAcademicYear(client, ay.id);
        const lessonsWithData = await Promise.all(
          lessons.map(async (lesson) => {
            const [homeworkChecks, lessonGoldenVerses] = await Promise.all([
              getHomeworkChecksByLesson(client, lesson.id),
              getLessonGoldenVersesByLesson(client, lesson.id),
            ]);
            
            // Получить golden verses batch операцией
            const goldenVerseIds = lessonGoldenVerses.map(lgv => lgv.goldenVerseId);
            const goldenVerses = await batchGetGoldenVerses(client, goldenVerseIds);
            
            const goldenVersesWithDetails = lessonGoldenVerses.map(lgv => ({
              ...lgv,
              goldenVerse: goldenVerses.find(gv => gv.id === lgv.goldenVerseId),
            }));
            
            return {
              lesson,
              homeworkChecks,
              goldenVerses: goldenVersesWithDetails,
            };
          })
        );
        
        return {
          academicYear: ay,
          lessons: lessonsWithData,
        };
      })
    );
    
    return {
      grade,
      pupils,
      academicYears: academicYearsWithLessons,
      events,
      settings,
      teachers,
    };
  } catch (error) {
    console.error('Error in getGradeComplete:', error);
    throw error;
  }
};

// Вспомогательные функции для работы с DynamoDB
async function getGrade(client: DynamoDBDocumentClient, gradeId: string) {
  const result = await client.send(
    new GetCommand({
      TableName: process.env.GRADE_TABLE_NAME!,
      Key: { id: gradeId },
    })
  );
  return result.Item;
}

async function getPupilsByGrade(client: DynamoDBDocumentClient, gradeId: string) {
  const result = await client.send(
    new QueryCommand({
      TableName: process.env.PUPIL_TABLE_NAME!,
      IndexName: 'byGradeId-lastName-index',
      KeyConditionExpression: 'gradeId = :gradeId',
      ExpressionAttributeValues: { ':gradeId': gradeId },
    })
  );
  return result.Items || [];
}

// ... остальные вспомогательные функции ...

async function batchGetGoldenVerses(
  client: DynamoDBDocumentClient,
  ids: string[]
): Promise<GoldenVerse[]> {
  if (ids.length === 0) return [];
  
  // BatchGetItem поддерживает до 100 элементов за запрос
  const batches = chunkArray(ids, 100);
  const results = await Promise.all(
    batches.map(batch =>
      client.send(
        new BatchGetCommand({
          RequestItems: {
            [process.env.GOLDEN_VERSE_TABLE_NAME!]: {
              Keys: batch.map(id => ({ id })),
            },
          },
        })
      )
    )
  );
  
  return results.flatMap(r => r.Responses?.[process.env.GOLDEN_VERSE_TABLE_NAME!] || []);
}

function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}
```

**Использование в Server Action**:

```typescript
// actions/grades.ts
export async function getGradeWithFullDataAction(input: unknown) {
  // ... валидация и авторизация ...
  
  // Один запрос для получения всех данных
  const result = await executeGraphQL(GetGradeCompleteQuery, { gradeId: id });
  
  return {
    success: true,
    data: result.data.getGradeComplete,
  };
}
```

**Результат**: 1 запрос вместо ~110

---

## 8. Заключение

### 8.1. Ответы на вопросы исследования

1. **Как изменить schema.graphql для получения данных одним запросом?**
   - ✅ **Вариант 1 (GraphQL Aliases)**: Без изменений схемы, только изменение запросов
   - ✅ **Вариант 3 (Кастомные queries)**: Добавить кастомные queries и Lambda resolvers
   - ⚠️ **Вариант 2 (@hasMany/@belongsTo)**: Восстановить директивы (риск проблем)

2. **Возможно ли это в режиме FreeTier?**
   - ✅ **Да**, все варианты работают в FreeTier
   - ✅ **Критически важно** для укладывания в лимит 250,000 операций/месяц
   - ✅ Оптимизация позволяет масштабироваться без превышения FreeTier

3. **Изменится ли структура DynamoDB?**
   - ✅ **Нет**, структура таблиц не меняется
   - ✅ Используются существующие таблицы и индексы
   - ⚠️ Могут быть добавлены новые GSI (автоматически Amplify)

4. **Необходима ли миграция данных?**
   - ✅ **Нет**, миграция данных не требуется
   - ✅ Тестовые данные остаются без изменений
   - ✅ Изменения касаются только GraphQL схемы и способа запросов

5. **Как обеспечить получение данных для каждой страницы одним запросом?**
   - ✅ Создать кастомный query для каждой страницы
   - ✅ Реализовать Lambda resolver с batch операциями
   - ✅ Использовать кэширование на уровне resolver
   - ✅ Оптимизировать через DynamoDB BatchGetItem

### 8.2. Рекомендации

**Для MVP**:
- ✅ Использовать **Вариант 1 (GraphQL Aliases) + последовательная обработка**
- ✅ Снижение запросов с ~110 до ~20-30
- ✅ Минимальные изменения в коде
- ✅ Быстрая реализация

**Для продакшена**:
- ✅ Реализовать **Вариант 3 (Кастомные queries с Lambda resolvers)**
- ✅ Снижение до 1-2 запросов на страницу
- ✅ Максимальная оптимизация и масштабируемость
- ✅ Кэширование и batch операции

**Не рекомендуется для MVP**:
- ❌ Вариант 2 (Восстановление @hasMany/@belongsTo) - риск проблем с CloudFormation

---

## 9. Связанные документы

- [Текущая реализация получения данных](./GRADE_PAGE_DATA_FETCHING.md)
- [Батчинг запросов для страницы группы](./GRADE_PAGE_BATCH_QUERIES_OPTIMIZATION.md)
- [Ошибки аутентификации и превышения лимита](./GRADE_PAGE_AUTHENTICATION_AND_RATE_LIMIT_ERRORS.md)
- [AmplifyData и лимиты запросов](./AMPLIFY_DATA_AND_RATE_LIMITS.md)
- [GraphQL схема проекта](../database/GRAPHQL_SCHEMA.md)
- [Архитектура проекта](../architecture/ARCHITECTURE.md)

---

**Последнее обновление**: 30 декабря 2025  
**Статус**: 🔍 Исследование завершено

