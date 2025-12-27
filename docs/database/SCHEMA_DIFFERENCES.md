# GraphQL Schema Differences Report - Sunday School App

## Версия документа: 1.0
**Дата создания:** 27 декабря 2025  
**Последнее обновление:** 27 декабря 2025

> [!NOTE]
> **Обновление документации:** В соответствии с рекомендациями из раздела 5, документация была обновлена:
> - [GRAPHQL_SCHEMA.md](./GRAPHQL_SCHEMA.md) - версия 1.3 - добавлены примечания об удалении связей и примеры queries
> - [DATA_MODELING.md](./DATA_MODELING.md) - версия 1.2 - добавлен раздел о работе через queries и примеры batch queries
> - [SERVER_ACTIONS.md](../api/SERVER_ACTIONS.md) - версия 1.1 - добавлен раздел 6 "Working with Related Data via Indexes"  
**Проект:** Sunday School App  
**Технологии:** AWS Amplify Gen 1, AWS AppSync, GraphQL

---

## 1. Введение

### 1.1. Цель документа

Данный документ описывает различия между **текущей реализованной GraphQL схемой** (`amplify/backend/api/sunsch/schema.graphql`) и **документированной схемой** (`docs/database/GRAPHQL_SCHEMA.md`). 

Различия возникли в результате устранения **циклических зависимостей CloudFormation**, которые препятствовали успешному деплою backend в AWS.

### 1.2. Версия схемы

- **Текущая схема:** Версия 1.0 (27 декабря 2025)
- **Документированная схема:** Версия 1.2 (25 декабря 2025)
- **Причина различий:** Устранение циклических зависимостей CloudFormation

### 1.3. Важные замечания

⚠️ **Критически важно:** Все изменения были внесены **только для устранения технических проблем деплоя**. Функциональность приложения **не изменилась** - все данные доступны через GraphQL queries через индексы.

✅ **Функциональность сохранена:** Все связи, описанные в документации, работают через queries с использованием индексов.

---

## 2. Сводная таблица различий

| Тип | Статус типов | Статус полей | Статус индексов | Статус связей | Статус @auth |
|-----|--------------|--------------|-----------------|---------------|--------------|
| User | ✅ Соответствует | ✅ Соответствует | ✅ Соответствует | ✅ Соответствует | ✅ Соответствует |
| Grade | ✅ Соответствует | ✅ Соответствует | ✅ Соответствует | ⚠️ Удалено `events` | ✅ Соответствует |
| UserGrade | ✅ Соответствует | ✅ Соответствует | ✅ Соответствует | ❌ Удалены `@belongsTo` | ✅ Соответствует |
| AcademicYear | ✅ Соответствует | ✅ Соответствует | ✅ Соответствует | ❌ Удален `grade @belongsTo` | ✅ Соответствует |
| Lesson | ✅ Соответствует | ✅ Соответствует | ✅ Соответствует | ❌ Удалены связи | ✅ Соответствует |
| Book | ✅ Соответствует | ✅ Соответствует | ✅ Соответствует | ✅ Соответствует | ✅ Соответствует |
| GoldenVerse | ✅ Соответствует | ✅ Соответствует | ✅ Соответствует | ❌ Удалены связи | ✅ Соответствует |
| LessonGoldenVerse | ✅ Соответствует | ✅ Соответствует | ✅ Соответствует | ❌ Удалены `@belongsTo` | ⚠️ Изменено |
| Pupil | ✅ Соответствует | ✅ Соответствует | ✅ Соответствует | ❌ Удалены связи | ✅ Соответствует |
| HomeworkCheck | ✅ Соответствует | ✅ Соответствует | ✅ Соответствует | ❌ Удалены `@belongsTo` | ⚠️ Изменено |
| Achievement | ✅ Соответствует | ✅ Соответствует | ✅ Соответствует | ❌ Удалено `pupils @hasMany` | ✅ Соответствует |
| PupilAchievement | ✅ Соответствует | ✅ Соответствует | ✅ Соответствует | ❌ Удалены `@belongsTo` | ⚠️ Изменено |
| Family | ✅ Соответствует | ✅ Соответствует | ✅ Соответствует | ✅ Соответствует | ✅ Соответствует |
| FamilyMember | ✅ Соответствует | ✅ Соответствует | ✅ Соответствует | ❌ Удалены `@belongsTo` | ✅ Соответствует |
| UserFamily | ✅ Соответствует | ✅ Соответствует | ✅ Соответствует | ❌ Удалены `@belongsTo` | ✅ Соответствует |
| GradeEvent | ✅ Соответствует | ✅ Соответствует | ✅ Соответствует | ❌ Удален `grade @belongsTo` | ⚠️ Изменено |
| GradeSettings | ✅ Соответствует | ✅ Соответствует | ✅ Соответствует | ❌ Удален `grade @belongsTo` | ✅ Соответствует |

**Легенда:**
- ✅ Соответствует - полностью соответствует документации
- ⚠️ Изменено - изменено для устранения циклических зависимостей, функциональность сохранена
- ❌ Удалено - удалено для устранения циклических зависимостей, доступно через queries

---

## 3. Детальный анализ по категориям

### 3.1. Удаленные @belongsTo связи

**Причина удаления:** Устранение циклических зависимостей CloudFormation, которые возникали при генерации resolvers для связанных типов.

#### 3.1.1. UserGrade

**В документации:**
```graphql
type UserGrade {
  # ...
  user: User @belongsTo(fields: ["userId"])
  grade: Grade @belongsTo(fields: ["gradeId"])
}
```

**В текущей схеме:**
```graphql
type UserGrade {
  # ...
  # Примечание: user @belongsTo и grade @belongsTo убраны для устранения циклической зависимости
  # Используйте queries через индексы byUserId и byGradeId для получения связанных данных
}
```

**Альтернативный способ получения данных:**
```graphql
# Получить User по userId из UserGrade
query GetUser($userId: ID!) {
  getUser(id: $userId) {
    id
    name
    email
  }
}

# Получить Grade по gradeId из UserGrade
query GetGrade($gradeId: ID!) {
  getGrade(id: $gradeId) {
    id
    name
    description
  }
}
```

#### 3.1.2. AcademicYear

**В документации:**
```graphql
type AcademicYear {
  # ...
  grade: Grade @belongsTo(fields: ["gradeId"])
}
```

**В текущей схеме:**
```graphql
type AcademicYear {
  # ...
  # Примечание: grade @belongsTo убрано для устранения циклической зависимости
  # Используйте queries через индекс byGradeId для получения связанной группы
}
```

**Альтернативный способ:**
```graphql
query GetGrade($gradeId: ID!) {
  getGrade(id: $gradeId) {
    id
    name
  }
}
```

#### 3.1.3. Lesson

**В документации:**
```graphql
type Lesson {
  # ...
  academicYear: AcademicYear @belongsTo(fields: ["academicYearId"])
  grade: Grade @belongsTo(fields: ["gradeId"])
  teacher: User @belongsTo(fields: ["teacherId"])
}
```

**В текущей схеме:**
```graphql
type Lesson {
  # ...
  # Примечание: academicYear @belongsTo и teacher @belongsTo убраны для устранения циклической зависимости
  # Используйте queries через индексы byAcademicYearId и byTeacherId для получения связанных данных
}
```

**Альтернативные способы:**
```graphql
# Получить AcademicYear
query GetAcademicYear($id: ID!) {
  getAcademicYear(id: $id) {
    id
    name
    startDate
    endDate
  }
}

# Получить User (teacher)
query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    name
    email
  }
}

# Получить Grade (через AcademicYear или напрямую)
query GetGrade($id: ID!) {
  getGrade(id: $id) {
    id
    name
  }
}
```

#### 3.1.4. GoldenVerse

**В документации:**
```graphql
type GoldenVerse {
  # ...
  book: Book @belongsTo(fields: ["bookId"])
}
```

**В текущей схеме:**
```graphql
type GoldenVerse {
  # ...
  # Примечание: book @belongsTo убрано для устранения циклической зависимости
  # Используйте queries через индекс byBookId для получения связанной книги
}
```

**Альтернативный способ:**
```graphql
query GetBook($bookId: ID!) {
  getBook(id: $bookId) {
    id
    fullName
    shortName
    abbreviation
  }
}
```

#### 3.1.5. LessonGoldenVerse

**В документации:**
```graphql
type LessonGoldenVerse {
  # ...
  lesson: Lesson @belongsTo(fields: ["lessonId"])
  goldenVerse: GoldenVerse @belongsTo(fields: ["goldenVerseId"])
}
```

**В текущей схеме:**
```graphql
type LessonGoldenVerse {
  # ...
  # Примечание: @belongsTo убраны для устранения циклической зависимости
  # Используйте queries через индексы byLessonId и byGoldenVerseId для получения связанных данных
}
```

#### 3.1.6. Pupil

**В документации:**
```graphql
type Pupil {
  # ...
  grade: Grade @belongsTo(fields: ["gradeId"])
}
```

**В текущей схеме:**
```graphql
type Pupil {
  # ...
  # Примечание: grade @belongsTo убрано для устранения циклической зависимости
  # Используйте queries через индекс byGradeId для получения связанной группы
}
```

#### 3.1.7. HomeworkCheck

**В документации:**
```graphql
type HomeworkCheck {
  # ...
  lesson: Lesson @belongsTo(fields: ["lessonId"])
  pupil: Pupil @belongsTo(fields: ["pupilId"])
  grade: Grade @belongsTo(fields: ["gradeId"])
}
```

**В текущей схеме:**
```graphql
type HomeworkCheck {
  # ...
  # Примечание: @belongsTo убраны для устранения циклической зависимости
  # Используйте queries через индексы byLessonId и byPupilId для получения связанных данных
  # Примечание: gradeId используется только для денормализации и GSI-3 (аналитика), связь с Grade через Lesson
}
```

#### 3.1.8. PupilAchievement

**В документации:**
```graphql
type PupilAchievement {
  # ...
  pupil: Pupil @belongsTo(fields: ["pupilId"])
  achievement: Achievement @belongsTo(fields: ["achievementId"])
}
```

**В текущей схеме:**
```graphql
type PupilAchievement {
  # ...
  # Примечание: @belongsTo убраны для устранения циклической зависимости
  # Используйте queries через индексы byPupilId и byAchievementId для получения связанных данных
}
```

#### 3.1.9. FamilyMember

**В документации:**
```graphql
type FamilyMember {
  # ...
  family: Family @belongsTo(fields: ["familyId"])
  pupil: Pupil @belongsTo(fields: ["pupilId"])
}
```

**В текущей схеме:**
```graphql
type FamilyMember {
  # ...
  # Примечание: family @belongsTo и pupil @belongsTo убраны для устранения циклической зависимости
  # Используйте queries через индексы byFamilyId и byPupilId для получения связанных данных
}
```

#### 3.1.10. UserFamily

**В документации:**
```graphql
type UserFamily {
  # ...
  user: User @belongsTo(fields: ["userId"])
  family: Family @belongsTo(fields: ["familyId"])
}
```

**В текущей схеме:**
```graphql
type UserFamily {
  # ...
  # Примечание: user @belongsTo и family @belongsTo убраны для устранения циклической зависимости
  # Используйте queries через индексы byUserId и byFamilyId для получения связанных данных
}
```

#### 3.1.11. GradeEvent

**В документации:**
```graphql
type GradeEvent {
  # ...
  grade: Grade @belongsTo(fields: ["gradeId"])
}
```

**В текущей схеме:**
```graphql
type GradeEvent {
  # ...
  # Примечание: @belongsTo убран для устранения циклической зависимости
  # Используйте queries через индекс byGradeId для получения связанной группы
}
```

#### 3.1.12. GradeSettings

**В документации:**
```graphql
type GradeSettings {
  # ...
  grade: Grade @belongsTo(fields: ["gradeId"])
}
```

**В текущей схеме:**
```graphql
type GradeSettings {
  # ...
  # Примечание: grade @belongsTo убрано для устранения циклической зависимости
  # Используйте queries через индекс byGradeId для получения связанной группы
}
```

---

### 3.2. Удаленные @hasMany связи

**Причина удаления:** Устранение циклических зависимостей CloudFormation.

#### 3.2.1. Grade

**В документации:**
```graphql
type Grade {
  # ...
  events: [GradeEvent] @hasMany(indexName: "byGradeId", fields: ["id"])
}
```

**В текущей схеме:**
```graphql
type Grade {
  # ...
  # Примечание: events убрано из @hasMany для устранения циклической зависимости
  # Используйте queries через индекс byGradeId для получения событий группы
}
```

**Альтернативный способ:**
```graphql
query ListGradeEvents($gradeId: ID!) {
  gradeEventsByGradeId(gradeId: $gradeId, sortDirection: ASC) {
    items {
      id
      eventType
      title
      eventDate
    }
  }
}
```

#### 3.2.2. Lesson

**В документации:**
```graphql
type Lesson {
  # ...
  goldenVerses: [LessonGoldenVerse] @hasMany(indexName: "byLessonId", fields: ["id"])
  homeworkChecks: [HomeworkCheck] @hasMany(indexName: "byLessonId", fields: ["id"])
}
```

**В текущей схеме:**
```graphql
type Lesson {
  # ...
  # Примечание: goldenVerses и homeworkChecks убраны из @hasMany для устранения циклической зависимости
  # Используйте queries через индексы byLessonId для получения связанных данных
}
```

**Альтернативные способы:**
```graphql
# Получить золотые стихи урока
query ListLessonGoldenVerses($lessonId: ID!) {
  lessonGoldenVersesByLessonId(lessonId: $lessonId, sortDirection: ASC) {
    items {
      id
      goldenVerseId
      order
    }
  }
}

# Получить проверки ДЗ урока
query ListHomeworkChecks($lessonId: ID!) {
  homeworkChecksByLessonId(lessonId: $lessonId, sortDirection: ASC) {
    items {
      id
      pupilId
      points
      goldenVerse1Score
      goldenVerse2Score
      goldenVerse3Score
      testScore
      notebookScore
      singing
    }
  }
}
```

#### 3.2.3. Pupil

**В документации:**
```graphql
type Pupil {
  # ...
  homeworkChecks: [HomeworkCheck] @hasMany(indexName: "byPupilId", fields: ["id"])
  achievements: [PupilAchievement] @hasMany(indexName: "byPupilId", fields: ["id"])
}
```

**В текущей схеме:**
```graphql
type Pupil {
  # ...
  # Примечание: homeworkChecks и achievements убраны из @hasMany для устранения циклической зависимости
  # Используйте queries через индексы byPupilId для получения связанных данных
}
```

**Альтернативные способы:**
```graphql
# Получить проверки ДЗ ученика
query ListPupilHomeworkChecks($pupilId: ID!) {
  homeworkChecksByPupilId(pupilId: $pupilId, sortDirection: DESC) {
    items {
      id
      lessonId
      points
      createdAt
    }
  }
}

# Получить достижения ученика
query ListPupilAchievements($pupilId: ID!) {
  pupilAchievementsByPupilId(pupilId: $pupilId, sortDirection: DESC) {
    items {
      id
      achievementId
      awardedAt
    }
  }
}
```

#### 3.2.4. GoldenVerse

**В документации:**
```graphql
type GoldenVerse {
  # ...
  lessons: [LessonGoldenVerse] @hasMany(indexName: "byGoldenVerseId", fields: ["id"])
}
```

**В текущей схеме:**
```graphql
type GoldenVerse {
  # ...
  # Примечание: lessons убрано из @hasMany для устранения циклической зависимости
  # Используйте queries через индекс byGoldenVerseId для получения связанных уроков
}
```

**Альтернативный способ:**
```graphql
query ListLessonsWithGoldenVerse($goldenVerseId: ID!) {
  lessonGoldenVersesByGoldenVerseId(goldenVerseId: $goldenVerseId) {
    items {
      id
      lessonId
      order
    }
  }
}
```

#### 3.2.5. Achievement

**В документации:**
```graphql
type Achievement {
  # ...
  pupils: [PupilAchievement] @hasMany(indexName: "byAchievementId", fields: ["id"])
}
```

**В текущей схеме:**
```graphql
type Achievement {
  # ...
  # Примечание: pupils убрано из @hasMany для устранения циклической зависимости
  # Используйте queries через индекс byAchievementId для получения связанных учеников
}
```

**Альтернативный способ:**
```graphql
query ListPupilsWithAchievement($achievementId: ID!) {
  pupilAchievementsByAchievementId(achievementId: $achievementId, sortDirection: DESC) {
    items {
      id
      pupilId
      awardedAt
    }
  }
}
```

---

### 3.3. Измененные @auth правила

**Причина изменений:** Устранение циклических зависимостей CloudFormation, которые возникали при переиспользовании auth resolver функций между моделями с идентичными правилами.

#### 3.3.1. LessonGoldenVerse

**В документации:**
```graphql
type LessonGoldenVerse
  @model(queries: null)
  @auth(rules: [
    # Admin, Superadmin и Teacher могут управлять связью
    { allow: groups, groups: ["TEACHER", "ADMIN", "SUPERADMIN"] }
  ]) {
  # ...
}
```

**В текущей схеме:**
```graphql
type LessonGoldenVerse
  @model(queries: null)
  @auth(rules: [
    # Разделенные правила для предотвращения циклических зависимостей CloudFormation
    { allow: groups, groups: ["ADMIN"], operations: [create, read, update, delete] },
    { allow: groups, groups: ["SUPERADMIN"], operations: [create, read, update, delete] },
    { allow: groups, groups: ["TEACHER"], operations: [create, read, update, delete] }
  ]) {
  # ...
}
```

**Влияние на функциональность:** ✅ Нет изменений - все группы сохраняют те же права доступа.

#### 3.3.2. HomeworkCheck

**В документации:**
```graphql
type HomeworkCheck
  @model
  @auth(rules: [
    # Admin, Superadmin и Teacher могут управлять проверками
    { allow: groups, groups: ["TEACHER", "ADMIN", "SUPERADMIN"] }
  ]) {
  # ...
}
```

**В текущей схеме:**
```graphql
type HomeworkCheck
  @model
  @auth(rules: [
    # Разделенные правила для предотвращения циклических зависимостей CloudFormation
    { allow: groups, groups: ["TEACHER"] },
    { allow: groups, groups: ["ADMIN"] },
    { allow: groups, groups: ["SUPERADMIN"] }
  ]) {
  # ...
}
```

**Влияние на функциональность:** ✅ Нет изменений - все группы сохраняют те же права доступа.

#### 3.3.3. PupilAchievement

**В документации:**
```graphql
type PupilAchievement
  @model(queries: null)
  @auth(rules: [
    # Admin, Superadmin и Teacher могут управлять связью
    { allow: groups, groups: ["TEACHER", "ADMIN", "SUPERADMIN"] }
  ]) {
  # ...
}
```

**В текущей схеме:**
```graphql
type PupilAchievement
  @model(queries: null)
  @auth(rules: [
    # Разделенные правила для предотвращения циклических зависимостей CloudFormation
    { allow: groups, groups: ["SUPERADMIN"] },
    { allow: groups, groups: ["ADMIN"] },
    { allow: groups, groups: ["TEACHER"] }
  ]) {
  # ...
}
```

**Влияние на функциональность:** ✅ Нет изменений - все группы сохраняют те же права доступа. Порядок правил изменен для создания уникальной структуры.

#### 3.3.4. GradeEvent

**В документации:**
```graphql
type GradeEvent
  @model
  @auth(rules: [
    # Admin, Superadmin и Teacher могут управлять событиями
    { allow: groups, groups: ["TEACHER", "ADMIN", "SUPERADMIN"] }
  ]) {
  # ...
}
```

**В текущей схеме:**
```graphql
type GradeEvent
  @model
  @auth(rules: [
    # Разделенные правила для предотвращения циклических зависимостей CloudFormation
    { allow: groups, groups: ["ADMIN", "SUPERADMIN"] },
    { allow: groups, groups: ["TEACHER"], operations: [create, read, update, delete] }
  ]) {
  # ...
}
```

**Влияние на функциональность:** ✅ Нет изменений - все группы сохраняют те же права доступа. Структура правил изменена для создания уникальной конфигурации.

---

### 3.4. Дополнительные индексы

**Все индексы соответствуют документации ✅**

**Дополнительные индексы в текущей схеме:**

1. **User.email @index(name: "byEmail")**
   - ✅ Присутствует в схеме
   - ✅ Соответствует документации
   - **Назначение:** Поиск пользователя по email

2. **AcademicYear.status @index(name: "byStatus", sortKeyFields: ["gradeId"])**
   - ✅ Присутствует в схеме
   - ✅ Соответствует документации
   - **Назначение:** Поиск активных/завершенных учебных годов по группе

---

## 4. Влияние на функциональность

### 4.1. Общие принципы

**Важно понимать:** Удаление `@belongsTo` и `@hasMany` связей **не означает потерю функциональности**. Все данные остаются доступными через GraphQL queries с использованием индексов.

### 4.2. Как работать с удаленными связями

#### 4.2.1. Вместо @belongsTo

**Было (в документации):**
```graphql
query GetLesson($id: ID!) {
  getLesson(id: $id) {
    id
    title
    academicYear {
      id
      name
    }
    teacher {
      id
      name
    }
  }
}
```

**Стало (в текущей схеме):**
```graphql
# Шаг 1: Получить урок
query GetLesson($id: ID!) {
  getLesson(id: $id) {
    id
    title
    academicYearId
    teacherId
  }
}

# Шаг 2: Получить связанные данные отдельными запросами
query GetAcademicYear($id: ID!) {
  getAcademicYear(id: $id) {
    id
    name
  }
}

query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    name
  }
}
```

**Альтернатива (batch queries):**
```graphql
query GetLessonWithRelations($lessonId: ID!, $academicYearId: ID!, $teacherId: ID!) {
  lesson: getLesson(id: $lessonId) {
    id
    title
  }
  academicYear: getAcademicYear(id: $academicYearId) {
    id
    name
  }
  teacher: getUser(id: $teacherId) {
    id
    name
  }
}
```

#### 4.2.2. Вместо @hasMany

**Было (в документации):**
```graphql
query GetLesson($id: ID!) {
  getLesson(id: $id) {
    id
    title
    goldenVerses {
      items {
        id
        goldenVerseId
        order
      }
    }
    homeworkChecks {
      items {
        id
        pupilId
        points
      }
    }
  }
}
```

**Стало (в текущей схеме):**
```graphql
# Шаг 1: Получить урок
query GetLesson($id: ID!) {
  getLesson(id: $id) {
    id
    title
  }
}

# Шаг 2: Получить связанные данные через индексы
query ListLessonGoldenVerses($lessonId: ID!) {
  lessonGoldenVersesByLessonId(lessonId: $lessonId, sortDirection: ASC) {
    items {
      id
      goldenVerseId
      order
    }
  }
}

query ListHomeworkChecks($lessonId: ID!) {
  homeworkChecksByLessonId(lessonId: $lessonId, sortDirection: ASC) {
    items {
      id
      pupilId
      points
    }
  }
}
```

**Альтернатива (параллельные запросы):**
```graphql
query GetLessonWithRelations($lessonId: ID!) {
  lesson: getLesson(id: $lessonId) {
    id
    title
  }
  goldenVerses: lessonGoldenVersesByLessonId(lessonId: $lessonId) {
    items {
      id
      goldenVerseId
      order
    }
  }
  homeworkChecks: homeworkChecksByLessonId(lessonId: $lessonId) {
    items {
      id
      pupilId
      points
    }
  }
}
```

### 4.3. Примеры запросов для основных сценариев

#### 4.3.1. Получить урок с золотыми стихами и проверками ДЗ

```graphql
query GetLessonComplete($lessonId: ID!) {
  # Основная информация об уроке
  lesson: getLesson(id: $lessonId) {
    id
    title
    lessonDate
    order
    academicYearId
    gradeId
    teacherId
  }
  
  # Золотые стихи урока
  goldenVerses: lessonGoldenVersesByLessonId(
    lessonId: $lessonId
    sortDirection: ASC
  ) {
    items {
      id
      goldenVerseId
      order
    }
  }
  
  # Проверки ДЗ урока
  homeworkChecks: homeworkChecksByLessonId(
    lessonId: $lessonId
    sortDirection: ASC
  ) {
    items {
      id
      pupilId
      points
      goldenVerse1Score
      goldenVerse2Score
      goldenVerse3Score
      testScore
      notebookScore
      singing
    }
  }
}
```

#### 4.3.2. Получить ученика с проверками ДЗ и достижениями

```graphql
query GetPupilComplete($pupilId: ID!) {
  # Основная информация об ученике
  pupil: getPupil(id: $pupilId) {
    id
    firstName
    lastName
    gradeId
    dateOfBirth
    photo
    active
  }
  
  # Проверки ДЗ ученика
  homeworkChecks: homeworkChecksByPupilId(
    pupilId: $pupilId
    sortDirection: DESC
  ) {
    items {
      id
      lessonId
      points
      createdAt
    }
  }
  
  # Достижения ученика
  achievements: pupilAchievementsByPupilId(
    pupilId: $pupilId
    sortDirection: DESC
  ) {
    items {
      id
      achievementId
      awardedAt
    }
  }
}
```

#### 4.3.3. Получить группу с событиями

```graphql
query GetGradeWithEvents($gradeId: ID!) {
  # Основная информация о группе
  grade: getGrade(id: $gradeId) {
    id
    name
    description
    active
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
    }
  }
}
```

---

## 5. Рекомендации

### 5.1. Для разработчиков

1. **Используйте queries через индексы** вместо прямых связей `@belongsTo` и `@hasMany`
2. **Создавайте batch queries** для получения связанных данных в одном запросе
3. **Кэшируйте результаты** на клиенте для уменьшения количества запросов
4. **Используйте Server Actions** для объединения нескольких queries в один вызов

### 5.2. Для обновления документации

1. **Обновить `GRAPHQL_SCHEMA.md`** с указанием, что `@belongsTo` связи удалены
2. **Добавить примеры queries** для получения связанных данных через индексы
3. **Обновить примеры в `DATA_MODELING.md`** для использования queries вместо связей
4. **Добавить примечания** о причинах удаления связей (циклические зависимости)

### 5.3. Для будущих изменений

1. **Проверять на циклические зависимости** перед добавлением новых `@belongsTo` или `@hasMany`
2. **Использовать разделенные @auth правила** для моделей с одинаковыми группами
3. **Тестировать деплой** после каждого изменения схемы
4. **Документировать изменения** в схеме и их причины

---

## 6. Связанные документы

- **[GRAPHQL_SCHEMA.md](./GRAPHQL_SCHEMA.md):** Полная документация GraphQL схемы (версия 1.3 - обновлена с примечаниями об удалении связей и примерами queries)
- **[DYNAMODB_SCHEMA.md](./DYNAMODB_SCHEMA.md):** Структура DynamoDB таблиц и индексов
- **[DATA_MODELING.md](./DATA_MODELING.md):** Access patterns и примеры запросов (версия 1.2 - обновлена с разделом о работе через queries и примерами batch queries)
- **[SERVER_ACTIONS.md](../api/SERVER_ACTIONS.md):** Документация Server Actions (версия 1.1 - добавлен раздел 6 "Working with Related Data via Indexes")
- **[AWS_AMPLIFY.md](../infrastructure/AWS_AMPLIFY.md):** Документация о циклических зависимостях (Issue 6)

---

## 7. История изменений

| Дата | Версия | Изменения |
|------|--------|-----------|
| 27 декабря 2025 | 1.0 | Создан документ с полным анализом различий между схемой и документацией |

---

**End of GraphQL Schema Differences Report**

