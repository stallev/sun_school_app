# GraphQL Schema - Sunday School App

## Версия документа: 1.0
**Дата создания:** 11 ноября 2025  
**Последнее обновление:** 11 ноября 2025  
**Проект:** Sunday School App (Приложение для управления воскресной школой)  
**Технологии:** AWS Amplify, AWS AppSync (GraphQL), AWS DynamoDB, AWS Cognito  
**Файл схемы:** `amplify/backend/api/schema.graphql`

---

## 1. Обзор

Данный документ содержит детальное описание GraphQL schema для Sunday School App. Схема реализуется через AWS Amplify и AWS AppSync, автоматически создавая DynamoDB таблицы и GraphQL API.

### 1.1. Структура документа

- **Раздел 2:** Полная GraphQL schema с комментариями
- **Раздел 3:** Детальное описание каждого типа
- **Раздел 4:** Директивы и их использование (@model, @auth, @belongsTo, @hasMany)
- **Раздел 5:** Связи между типами через GraphQL
- **Раздел 6:** Авторизация через Cognito Groups (@auth)
- **Раздел 7:** Генерация TypeScript типов из GraphQL schema
- **Раздел 8:** Примеры GraphQL queries и mutations

### 1.2. Принципы GraphQL Schema

- **Domain-first**: сущности отражают предметную область (`Lesson`, `Pupil`, `Grade`)
- **@model**: для каждой сущности, хранящейся в DynamoDB
- **@auth**: правила доступа через Cognito Groups
- **@belongsTo / @hasMany**: связи между сущностями
- **Избегать**: глубокой вложенности, избыточных полей

---

## 2. Полная GraphQL Schema

```graphql
# ============================================
# GRAPHQL SCHEMA - Sunday School App
# Версия: 1.0
# Дата: 11 ноября 2025
# База данных: AWS DynamoDB (через AppSync)
# ============================================

# ============================================
# ENUMS
# ============================================

enum UserRole {
  TEACHER      # Преподаватель - ведет группы, проверяет ДЗ
  ADMIN        # Администратор - управление школой, пользователями
  SUPERADMIN   # Главный администратор - полный доступ (в MVP = Admin)
  PARENT       # Родитель - просмотр данных детей (Post-MVP)
  PUPIL        # Ученик - просмотр своих данных (Post-MVP)
}

enum AcademicYearStatus {
  ACTIVE     # Активный (текущий учебный год) - в этом году создаются уроки
  COMPLETED  # Завершен - уроки больше не создаются
  PLANNED    # Запланирован - для будущего использования (Post-MVP)
}

enum GradeEventType {
  LESSON          # Обычный урок (🔵 Синий цвет в календаре)
  OUTDOOR_EVENT   # Выездное мероприятие (🟢 Зеленый цвет)
  LESSON_SKIPPING # Отмена урока (🔴 Красный цвет)
}

# ============================================
# AUTHENTICATION (AWS Cognito)
# ============================================

# Пользователи системы (преподаватели, администраторы, родители, ученики)
# Хранятся в Cognito User Pool + DynamoDB для дополнительных атрибутов
type User @model @auth(rules: [
  { allow: owner, ownerField: "id" },
  { allow: groups, groups: ["admins", "superadmins"] }
]) {
  id: ID!
  name: String!
  email: String! @index(name: "byEmail", queryField: "userByEmail")
  emailVerified: AWSDateTime
  image: String  # URL аватара (S3)
  role: UserRole! @default(value: "TEACHER")
  active: Boolean! @default(value: true)
  
  # Timestamps
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
  
  # Relations
  userGrades: [UserGrade!]! @hasMany(indexName: "byUser")
  createdLessons: [Lesson!]! @hasMany(indexName: "byCreatedBy")
}

# ============================================
# GROUPS & ACADEMIC YEARS
# ============================================

# Группы/классы воскресной школы
type Grade @model @auth(rules: [
  { allow: groups, groups: ["teachers", "admins", "superadmins"], operations: [read] },
  { allow: groups, groups: ["admins", "superadmins"], operations: [create, update, delete] }
]) {
  id: ID!
  name: String! @index(name: "byName", queryField: "gradeByName")
  description: String
  minAge: Int
  maxAge: Int
  active: Boolean! @default(value: true)
  
  # Timestamps
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
  
  # Relations
  userGrades: [UserGrade!]! @hasMany(indexName: "byGrade")
  academicYears: [AcademicYear!]! @hasMany(indexName: "byGrade")
  pupils: [Pupil!]! @hasMany(indexName: "byGrade")
  gradeEvents: [GradeEvent!]! @hasMany(indexName: "byGrade")
  gradeSettings: GradeSettings @hasOne
}

# Связь пользователь-группа (many-to-many)
# Определяет, какие группы ведет преподаватель
type UserGrade @model @auth(rules: [
  { allow: groups, groups: ["teachers", "admins", "superadmins"], operations: [read] },
  { allow: groups, groups: ["admins", "superadmins"], operations: [create, update, delete] }
]) {
  id: ID!
  userId: ID! @index(name: "byUser", queryField: "userGradesByUser")
  gradeId: ID! @index(name: "byGrade", queryField: "userGradesByGrade")
  assignedAt: AWSDateTime!
  
  # Timestamps
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
  
  # Relations
  user: User! @belongsTo(fields: ["userId"])
  grade: Grade! @belongsTo(fields: ["gradeId"])
}

# Учебные годы для групп
type AcademicYear @model @auth(rules: [
  { allow: groups, groups: ["teachers", "admins", "superadmins"], operations: [read] },
  { allow: groups, groups: ["admins", "superadmins"], operations: [create, update, delete] }
]) {
  id: ID!
  gradeId: ID! @index(name: "byGrade", queryField: "academicYearsByGrade")
  name: String!
  startDate: AWSDate!
  endDate: AWSDate!
  status: AcademicYearStatus! @default(value: "ACTIVE") @index(name: "byStatus", queryField: "academicYearsByStatus")
  
  # Timestamps
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
  
  # Relations
  grade: Grade! @belongsTo(fields: ["gradeId"])
  lessons: [Lesson!]! @hasMany(indexName: "byAcademicYear")
}

# ============================================
# LESSONS & GOLDEN VERSES
# ============================================

# Уроки воскресной школы
type Lesson @model @auth(rules: [
  { allow: groups, groups: ["teachers", "admins", "superadmins"], operations: [read] },
  { allow: groups, groups: ["teachers", "admins", "superadmins"], operations: [create, update, delete] }
]) {
  id: ID!
  academicYearId: ID! @index(name: "byAcademicYear", queryField: "lessonsByAcademicYear")
  createdById: ID @index(name: "byCreatedBy", queryField: "lessonsByCreatedBy")
  title: String!
  content: String  # BlockNote JSON
  lessonDate: AWSDate! @index(name: "byLessonDate", queryField: "lessonsByDate")
  order: Int! @default(value: 0)
  
  # Timestamps
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
  
  # Relations
  academicYear: AcademicYear! @belongsTo(fields: ["academicYearId"])
  createdBy: User @belongsTo(fields: ["createdById"])
  lessonGoldenVerses: [LessonGoldenVerse!]! @hasMany(indexName: "byLesson")
  homeworkChecks: [HomeworkCheck!]! @hasMany(indexName: "byLesson")
}

# Библиотека золотых стихов из Библии
type GoldenVerse @model @auth(rules: [
  { allow: groups, groups: ["teachers", "admins", "superadmins"], operations: [read] },
  { allow: groups, groups: ["admins", "superadmins"], operations: [create, update, delete] }
]) {
  id: ID!
  book: String! @index(name: "byBook", queryField: "goldenVersesByBook")
  chapter: Int!
  verse: Int!
  text: String!
  
  # Timestamps
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
  
  # Relations
  lessonGoldenVerses: [LessonGoldenVerse!]! @hasMany(indexName: "byGoldenVerse")
}

# Связь урок-золотой стих (many-to-many)
# Один урок может иметь до 3 золотых стихов
type LessonGoldenVerse @model @auth(rules: [
  { allow: groups, groups: ["teachers", "admins", "superadmins"], operations: [read] },
  { allow: groups, groups: ["teachers", "admins", "superadmins"], operations: [create, update, delete] }
]) {
  id: ID!
  lessonId: ID! @index(name: "byLesson", queryField: "lessonGoldenVersesByLesson")
  goldenVerseId: ID! @index(name: "byGoldenVerse", queryField: "lessonGoldenVersesByGoldenVerse")
  order: Int!  # Порядок стиха в уроке (1, 2, 3)
  
  # Timestamps
  createdAt: AWSDateTime!
  
  # Relations
  lesson: Lesson! @belongsTo(fields: ["lessonId"])
  goldenVerse: GoldenVerse! @belongsTo(fields: ["goldenVerseId"])
}

# ============================================
# PUPILS & FAMILIES
# ============================================

# Ученики воскресной школы
type Pupil @model @auth(rules: [
  { allow: groups, groups: ["teachers", "admins", "superadmins"], operations: [read] },
  { allow: groups, groups: ["admins", "superadmins"], operations: [create, update, delete] }
]) {
  id: ID!
  gradeId: ID @index(name: "byGrade", queryField: "pupilsByGrade")
  firstName: String!
  lastName: String! @index(name: "byLastName", queryField: "pupilsByLastName")
  middleName: String
  dateOfBirth: AWSDate
  photo: String  # URL фото (S3)
  active: Boolean! @default(value: true)
  
  # Timestamps
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
  
  # Relations
  grade: Grade @belongsTo(fields: ["gradeId"])
  homeworkChecks: [HomeworkCheck!]! @hasMany(indexName: "byPupil")
  pupilAchievements: [PupilAchievement!]! @hasMany(indexName: "byPupil")
  familyMembers: [FamilyMember!]! @hasMany(indexName: "byPupil")
}

# Семьи учеников
type Family @model @auth(rules: [
  { allow: groups, groups: ["teachers", "admins", "superadmins"], operations: [read] },
  { allow: groups, groups: ["admins", "superadmins"], operations: [create, update, delete] }
]) {
  id: ID!
  name: String! @index(name: "byName", queryField: "familiesByName")
  address: String
  phone: String @index(name: "byPhone", queryField: "familiesByPhone")
  email: String @index(name: "byEmail", queryField: "familiesByEmail")
  
  # Timestamps
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
  
  # Relations
  familyMembers: [FamilyMember!]! @hasMany(indexName: "byFamily")
}

# Связь семья-ученик (many-to-many)
# Один ученик может принадлежать только одной семье
type FamilyMember @model @auth(rules: [
  { allow: groups, groups: ["teachers", "admins", "superadmins"], operations: [read] },
  { allow: groups, groups: ["admins", "superadmins"], operations: [create, update, delete] }
]) {
  id: ID!
  familyId: ID! @index(name: "byFamily", queryField: "familyMembersByFamily")
  pupilId: ID! @index(name: "byPupil", queryField: "familyMembersByPupil")
  relationship: String!  # Родственная связь (e.g., "сын", "дочь", "брат")
  
  # Timestamps
  createdAt: AWSDateTime!
  
  # Relations
  family: Family! @belongsTo(fields: ["familyId"])
  pupil: Pupil! @belongsTo(fields: ["pupilId"])
}

# ============================================
# HOMEWORK CHECKS
# ============================================

# Проверка домашних заданий для каждого ученика по каждому уроку
type HomeworkCheck @model @auth(rules: [
  { allow: groups, groups: ["teachers", "admins", "superadmins"], operations: [read] },
  { allow: groups, groups: ["teachers", "admins", "superadmins"], operations: [create, update, delete] }
]) {
  id: ID!
  lessonId: ID! @index(name: "byLesson", queryField: "homeworkChecksByLesson")
  pupilId: ID! @index(name: "byPupil", queryField: "homeworkChecksByPupil")
  
  # Посещаемость
  isPresent: Boolean! @default(value: false)
  
  # Золотые стихи (до 3 стихов)
  goldenVerse1: Boolean! @default(value: false)
  goldenVerse1Score: Int  # Оценка за первый стих (0-2, опционально)
  goldenVerse2: Boolean! @default(value: false)
  goldenVerse2Score: Int  # Оценка за второй стих (0-2, опционально)
  goldenVerse3: Boolean! @default(value: false)
  goldenVerse3Score: Int  # Оценка за третий стих (0-2, опционально)
  
  # Тест
  test: Boolean! @default(value: false)
  testScore: Int  # Оценка за тест (0-5, опционально)
  
  # Тетрадь
  notebook: Boolean! @default(value: false)
  notebookScore: Int  # Оценка за тетрадь (0-5, опционально)
  
  # Спевка
  singing: Boolean! @default(value: false)
  
  # Баллы
  points: Int! @default(value: 0) @index(name: "byPoints", queryField: "homeworkChecksByPoints")
  
  # Timestamps
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
  
  # Relations
  lesson: Lesson! @belongsTo(fields: ["lessonId"])
  pupil: Pupil! @belongsTo(fields: ["pupilId"])
}

# ============================================
# ACHIEVEMENTS
# ============================================

# Шаблоны достижений (badges)
type Achievement @model @auth(rules: [
  { allow: groups, groups: ["teachers", "admins", "superadmins"], operations: [read] },
  { allow: groups, groups: ["admins", "superadmins"], operations: [create, update, delete] }
]) {
  id: ID!
  name: String! @index(name: "byName", queryField: "achievementsByName")
  description: String
  icon: String  # Иконка/изображение badge (URL или emoji)
  type: String! @index(name: "byType", queryField: "achievementsByType")
  criteria: AWSJSON!  # Критерии получения (JSON, e.g., {"minPoints": 100, "minLessons": 10})
  
  # Timestamps
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
  
  # Relations
  pupilAchievements: [PupilAchievement!]! @hasMany(indexName: "byAchievement")
}

# Достижения учеников
type PupilAchievement @model @auth(rules: [
  { allow: groups, groups: ["teachers", "admins", "superadmins"], operations: [read] },
  { allow: groups, groups: ["admins", "superadmins"], operations: [create, update, delete] }
]) {
  id: ID!
  pupilId: ID! @index(name: "byPupil", queryField: "pupilAchievementsByPupil")
  achievementId: ID! @index(name: "byAchievement", queryField: "pupilAchievementsByAchievement")
  awardedAt: AWSDateTime! @index(name: "byAwardedAt", queryField: "pupilAchievementsByAwardedAt")
  
  # Timestamps
  createdAt: AWSDateTime!
  
  # Relations
  pupil: Pupil! @belongsTo(fields: ["pupilId"])
  achievement: Achievement! @belongsTo(fields: ["achievementId"])
}

# ============================================
# SCHEDULE & EVENTS
# ============================================

# События в расписании группы
type GradeEvent @model @auth(rules: [
  { allow: groups, groups: ["teachers", "admins", "superadmins"], operations: [read] },
  { allow: groups, groups: ["teachers", "admins", "superadmins"], operations: [create, update, delete] }
]) {
  id: ID!
  gradeId: ID! @index(name: "byGrade", queryField: "gradeEventsByGrade")
  type: GradeEventType!
  title: String!
  description: String
  eventDate: AWSDate! @index(name: "byEventDate", queryField: "gradeEventsByDate")
  startTime: AWSTime
  endTime: AWSTime
  
  # Timestamps
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
  
  # Relations
  grade: Grade! @belongsTo(fields: ["gradeId"])
}

# ============================================
# GRADE SETTINGS
# ============================================

# Настройки оценивания для группы
type GradeSettings @model @auth(rules: [
  { allow: groups, groups: ["teachers", "admins", "superadmins"], operations: [read] },
  { allow: groups, groups: ["admins", "superadmins"], operations: [create, update, delete] }
]) {
  id: ID!
  gradeId: ID! @unique
  
  # Включение/выключение параметров
  showGoldenVerses: Boolean! @default(value: true)
  showTest: Boolean! @default(value: true)
  showNotebook: Boolean! @default(value: true)
  showSinging: Boolean! @default(value: true)
  
  # Кастомные метки для параметров
  goldenVersesLabel: String  # Кастомная метка для "Золотые стихи" (e.g., "Стихи наизусть")
  testLabel: String  # Кастомная метка для "Тест"
  notebookLabel: String  # Кастомная метка для "Тетрадь"
  singingLabel: String  # Кастомная метка для "Спевка"
  
  # Кастомные баллы за параметры (JSON)
  customPoints: AWSJSON  # e.g., {"goldenVerse": 5, "test": 10, "notebook": 5, "singing": 5}
  
  # Timestamps
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
  
  # Relations
  grade: Grade! @belongsTo(fields: ["gradeId"])
}
```

---

## 3. Детальное описание типов

### 3.1. User (Пользователи)

**Назначение:** Хранение информации о всех пользователях системы

**Особенности:**
- Пользователи аутентифицируются через AWS Cognito User Pool
- Дополнительные атрибуты (role, active) хранятся в DynamoDB
- Связь с группами через `UserGrade` (many-to-many)

**Директивы:**
- `@model` - создает DynamoDB таблицу и CRUD операции
- `@auth` - правила доступа через Cognito Groups
- `@hasMany` - связи с `UserGrade` и `Lesson`

**Пример запроса:**
```graphql
query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    name
    email
    role
    userGrades {
      items {
        grade {
          name
        }
      }
    }
  }
}
```

### 3.2. Grade (Группы)

**Назначение:** Хранение информации о группах воскресной школы

**Особенности:**
- Связь one-to-one с `GradeSettings`
- Связь one-to-many с `AcademicYear`, `Pupil`, `GradeEvent`
- Индекс по `name` для быстрого поиска

**Директивы:**
- `@model` - создает DynamoDB таблицу
- `@auth` - доступ для teachers, admins, superadmins
- `@hasOne` - связь с `GradeSettings`
- `@hasMany` - связи с учебными годами, учениками, событиями

### 3.3. AcademicYear (Учебные годы)

**Назначение:** Хранение информации об учебных годах для групп

**Особенности:**
- Статус `ACTIVE` определяет текущий учебный год
- Для одной группы может быть только один `ACTIVE` учебный год
- Уроки создаются только в `ACTIVE` учебном году

**Индексы:**
- `byGrade` - поиск учебных годов группы
- `byStatus` - фильтрация по статусу
- Составной индекс `[gradeId, status]` для поиска активного года

### 3.4. Lesson (Уроки)

**Назначение:** Хранение информации об уроках

**Особенности:**
- Содержание урока хранится в формате BlockNote JSON
- Связь many-to-many с `GoldenVerse` через `LessonGoldenVerse`
- Связь one-to-many с `HomeworkCheck`

**Директивы:**
- `@model` - создает DynamoDB таблицу
- `@auth` - доступ для teachers, admins, superadmins
- `@belongsTo` - связь с `AcademicYear` и `User`
- `@hasMany` - связи с золотыми стихами и проверками ДЗ

### 3.5. HomeworkCheck (Проверка домашних заданий)

**Назначение:** Хранение записей о проверке ДЗ для каждого ученика по каждому уроку

**Особенности:**
- Комбинация `lessonId + pupilId` должна быть уникальна
- Баллы рассчитываются автоматически на основе выполненных параметров
- Если все параметры выполнены, ученик получает "домик"

**Индексы:**
- `byLesson` - поиск всех проверок урока
- `byPupil` - поиск всех проверок ученика
- `byPoints` - сортировка по баллам для рейтинга

---

## 4. Директивы и их использование

### 4.1. @model

**Назначение:** Автоматическое создание DynamoDB таблицы и CRUD операций

**Что создается:**
- DynamoDB таблица с именем типа (например, `Lesson`)
- GraphQL queries: `get{Type}`, `list{Type}s`
- GraphQL mutations: `create{Type}`, `update{Type}`, `delete{Type}`
- GraphQL subscriptions: `onCreate{Type}`, `onUpdate{Type}`, `onDelete{Type}`

**Пример:**
```graphql
type Lesson @model {
  id: ID!
  title: String!
}
```

**Автоматически созданные операции:**
- `getLesson(id: ID!): Lesson`
- `listLessons(filter: ModelLessonFilterInput, limit: Int, nextToken: String): ModelLessonConnection`
- `createLesson(input: CreateLessonInput!): Lesson`
- `updateLesson(input: UpdateLessonInput!): Lesson`
- `deleteLesson(input: DeleteLessonInput!): Lesson`

### 4.2. @auth

**Назначение:** Правила авторизации через AWS Cognito Groups

**Типы правил:**
- `allow: owner` - доступ только владельцу записи
- `allow: groups` - доступ для групп Cognito
- `allow: public` - публичный доступ (не рекомендуется для production)

**Пример:**
```graphql
type Lesson @model @auth(rules: [
  { allow: groups, groups: ["teachers", "admins"], operations: [read] },
  { allow: groups, groups: ["admins"], operations: [create, update, delete] }
]) {
  id: ID!
  title: String!
}
```

**Операции:**
- `read` - чтение (queries)
- `create` - создание (mutations)
- `update` - обновление (mutations)
- `delete` - удаление (mutations)

### 4.3. @belongsTo

**Назначение:** Определение связи "принадлежит" (many-to-one)

**Использование:**
- Указывает, что тип принадлежит другому типу
- Создает foreign key в DynamoDB
- Позволяет запрашивать связанный объект

**Пример:**
```graphql
type Lesson @model {
  id: ID!
  academicYearId: ID!
  academicYear: AcademicYear! @belongsTo(fields: ["academicYearId"])
}
```

### 4.4. @hasMany

**Назначение:** Определение связи "имеет много" (one-to-many)

**Использование:**
- Указывает, что тип имеет множество связанных записей
- Требует индекс для связи

**Пример:**
```graphql
type AcademicYear @model {
  id: ID!
  lessons: [Lesson!]! @hasMany(indexName: "byAcademicYear")
}

type Lesson @model {
  id: ID!
  academicYearId: ID! @index(name: "byAcademicYear")
  academicYear: AcademicYear! @belongsTo(fields: ["academicYearId"])
}
```

### 4.5. @hasOne

**Назначение:** Определение связи "имеет один" (one-to-one)

**Пример:**
```graphql
type Grade @model {
  id: ID!
  gradeSettings: GradeSettings @hasOne
}

type GradeSettings @model {
  id: ID!
  gradeId: ID! @unique
  grade: Grade! @belongsTo(fields: ["gradeId"])
}
```

### 4.6. @index

**Назначение:** Создание индекса для быстрого поиска и фильтрации

**Типы индексов:**
- Single field index: `@index(name: "byName")`
- Composite index: `@index(name: "byGradeAndStatus", sortKeyFields: ["status"])`

**Пример:**
```graphql
type Lesson @model {
  id: ID!
  academicYearId: ID! @index(name: "byAcademicYear")
  lessonDate: AWSDate! @index(name: "byLessonDate")
}
```

**Автоматически созданные queries:**
- `lessonsByAcademicYear(academicYearId: ID!): [Lesson!]!`
- `lessonsByDate(lessonDate: AWSDate!): [Lesson!]!`

---

## 5. Связи между типами

### 5.1. One-to-Many (один ко многим)

#### Grade → AcademicYear, Pupil, GradeEvent

```graphql
type Grade @model {
  academicYears: [AcademicYear!]! @hasMany(indexName: "byGrade")
  pupils: [Pupil!]! @hasMany(indexName: "byGrade")
  gradeEvents: [GradeEvent!]! @hasMany(indexName: "byGrade")
}
```

#### AcademicYear → Lesson

```graphql
type AcademicYear @model {
  lessons: [Lesson!]! @hasMany(indexName: "byAcademicYear")
}
```

### 5.2. Many-to-Many (многие ко многим)

#### User ↔ Grade (через UserGrade)

```graphql
type User @model {
  userGrades: [UserGrade!]! @hasMany(indexName: "byUser")
}

type Grade @model {
  userGrades: [UserGrade!]! @hasMany(indexName: "byGrade")
}

type UserGrade @model {
  userId: ID! @index(name: "byUser")
  gradeId: ID! @index(name: "byGrade")
  user: User! @belongsTo(fields: ["userId"])
  grade: Grade! @belongsTo(fields: ["gradeId"])
}
```

#### Lesson ↔ GoldenVerse (через LessonGoldenVerse)

```graphql
type Lesson @model {
  lessonGoldenVerses: [LessonGoldenVerse!]! @hasMany(indexName: "byLesson")
}

type GoldenVerse @model {
  lessonGoldenVerses: [LessonGoldenVerse!]! @hasMany(indexName: "byGoldenVerse")
}

type LessonGoldenVerse @model {
  lessonId: ID! @index(name: "byLesson")
  goldenVerseId: ID! @index(name: "byGoldenVerse")
  order: Int!
  lesson: Lesson! @belongsTo(fields: ["lessonId"])
  goldenVerse: GoldenVerse! @belongsTo(fields: ["goldenVerseId"])
}
```

### 5.3. One-to-One (один к одному)

#### Grade ↔ GradeSettings

```graphql
type Grade @model {
  gradeSettings: GradeSettings @hasOne
}

type GradeSettings @model {
  gradeId: ID! @unique
  grade: Grade! @belongsTo(fields: ["gradeId"])
}
```

---

## 6. Авторизация через Cognito Groups (@auth)

### 6.1. Настройка групп в Cognito

В AWS Cognito User Pool создаются группы:
- `teachers` - преподаватели
- `admins` - администраторы
- `superadmins` - главные администраторы

### 6.2. Правила доступа

**Пример для Lesson:**
```graphql
type Lesson @model @auth(rules: [
  { allow: groups, groups: ["teachers", "admins", "superadmins"], operations: [read] },
  { allow: groups, groups: ["teachers", "admins", "superadmins"], operations: [create, update, delete] }
]) {
  id: ID!
  title: String!
}
```

**Логика:**
- Teachers, Admins, Superadmins могут читать уроки
- Teachers, Admins, Superadmins могут создавать, обновлять и удалять уроки

### 6.3. Проверка прав в Server Actions

```typescript
// Server Action проверяет Cognito Groups через JWT токен
export async function createLesson(input: CreateLessonInput) {
  const session = await getCurrentUser();
  const groups = session.signInUserSession.idToken.payload['cognito:groups'] || [];
  
  if (!groups.includes('teachers') && !groups.includes('admins')) {
    throw new Error('Недостаточно прав');
  }
  
  // Создание урока через GraphQL mutation
  const { data } = await amplifyData.graphql({
    query: mutations.createLesson,
    variables: { input },
  });
  
  return data.createLesson;
}
```

---

## 7. Генерация TypeScript типов из GraphQL schema

### 7.1. Автоматическая генерация

Amplify автоматически генерирует TypeScript типы при выполнении `amplify push`:

```bash
amplify push
```

**Результат:**
- Типы создаются в `src/amplify/data/resource.ts`
- Queries и mutations в `src/amplify/data/queries.ts` и `src/amplify/data/mutations.ts`

### 7.2. Использование типов

```typescript
import type { Schema } from '@/amplify/data/resource';
import { generateClient } from 'aws-amplify/data';

const client = generateClient<Schema>({
  authMode: 'userPool',
});

// Типизированные запросы
const { data } = await client.graphql({
  query: queries.getLesson,
  variables: { id: lessonId },
});

// data.getLesson имеет тип Lesson из Schema
```

### 7.3. Типы для Server Actions

```typescript
import type { Schema } from '@/amplify/data/resource';

type Lesson = Schema['Lesson']['type'];
type CreateLessonInput = Schema['Lesson']['input']['create'];
type UpdateLessonInput = Schema['Lesson']['input']['update'];
```

---

## 8. Примеры GraphQL queries и mutations

### 8.1. Queries (Запросы)

#### Получение урока с золотыми стихами

```graphql
query GetLesson($id: ID!) {
  getLesson(id: $id) {
    id
    title
    lessonDate
    content
    academicYear {
      name
      grade {
        name
      }
    }
    lessonGoldenVerses {
      items {
        order
        goldenVerse {
          book
          chapter
          verse
          text
        }
      }
    }
    homeworkChecks {
      items {
        pupil {
          firstName
          lastName
        }
        points
        isPresent
      }
    }
  }
}
```

#### Список уроков учебного года

```graphql
query ListLessonsByAcademicYear($academicYearId: ID!) {
  lessonsByAcademicYear(academicYearId: $academicYearId) {
    items {
      id
      title
      lessonDate
      order
    }
  }
}
```

#### Рейтинг учеников группы

```graphql
query GetPupilLeaderboard($gradeId: ID!, $academicYearId: ID!) {
  pupilsByGrade(gradeId: $gradeId) {
    items {
      id
      firstName
      lastName
      homeworkChecks {
        items {
          points
          lesson {
            academicYearId
          }
        }
      }
    }
  }
}
```

### 8.2. Mutations (Мутации)

#### Создание урока

```graphql
mutation CreateLesson($input: CreateLessonInput!) {
  createLesson(input: $input) {
    id
    title
    lessonDate
    createdAt
  }
}
```

**Переменные:**
```json
{
  "input": {
    "title": "Любовь к ближнему",
    "academicYearId": "year-2024-2025",
    "lessonDate": "2024-11-10",
    "order": 1,
    "createdById": "user-123"
  }
}
```

#### Обновление проверки ДЗ

```graphql
mutation UpdateHomeworkCheck($input: UpdateHomeworkCheckInput!) {
  updateHomeworkCheck(input: $input) {
    id
    points
    isPresent
    goldenVerse1
    test
    notebook
    singing
  }
}
```

**Переменные:**
```json
{
  "input": {
    "id": "check-123",
    "isPresent": true,
    "goldenVerse1": true,
    "goldenVerse2": true,
    "test": true,
    "notebook": true,
    "singing": true,
    "points": 30
  }
}
```

### 8.3. Subscriptions (Подписки)

#### Подписка на создание урока

```graphql
subscription OnCreateLesson($academicYearId: ID!) {
  onCreateLesson(filter: { academicYearId: { eq: $academicYearId } }) {
    id
    title
    lessonDate
    createdAt
  }
}
```

---

## 9. Best Practices

### 9.1. Проектирование схемы

- **Domain-first подход**: сущности отражают предметную область
- **Избегать глубокой вложенности**: максимум 2-3 уровня вложенности
- **Использовать индексы**: для часто используемых запросов
- **Минимизировать поля**: только необходимые поля в типах

### 9.2. Авторизация

- **Принцип наименьших привилегий**: минимальные права доступа
- **Группы Cognito**: использовать группы вместо индивидуальных прав
- **Проверка на сервере**: всегда проверять права в Server Actions

### 9.3. Производительность

- **Использовать индексы**: для быстрого поиска
- **Ограничивать выборку**: использовать `limit` в запросах
- **Избегать N+1 проблем**: использовать `@hasMany` с индексами

### 9.4. Типизация

- **Генерировать типы**: использовать автоматическую генерацию из schema
- **Типизировать Server Actions**: использовать типы из Amplify
- **Валидация**: использовать Zod для дополнительной валидации

---

## 10. Миграции и изменения схемы

### 10.1. Изменение схемы

При изменении `amplify/backend/api/schema.graphql`:

```bash
# Компиляция схемы
amplify api gql-compile

# Применение изменений
amplify push
```

**Что происходит:**
- AppSync обновляет GraphQL API
- DynamoDB таблицы обновляются (добавляются/удаляются поля)
- TypeScript типы перегенерируются

### 10.2. Обратная совместимость

- **Добавление полей**: новые поля должны быть nullable или иметь default значение
- **Удаление полей**: сначала пометить как deprecated, затем удалить
- **Изменение типов**: создать новое поле, мигрировать данные, удалить старое

---

## 11. Заключение

Данная GraphQL schema обеспечивает:

- ✅ **Полное покрытие функционала** - все сущности из ERD.md
- ✅ **Производительность** - оптимизированные индексы для DynamoDB
- ✅ **Безопасность** - авторизация через Cognito Groups
- ✅ **Масштабируемость** - автоматическое масштабирование DynamoDB
- ✅ **Типобезопасность** - автоматическая генерация TypeScript типов
- ✅ **Поддерживаемость** - понятная структура и комментарии

**Следующие шаги:**
1. Создать `amplify/backend/api/schema.graphql` на основе этого документа
2. Применить схему: `amplify push`
3. Использовать сгенерированные типы в Server Actions
4. Реализовать GraphQL queries/mutations в коде

---

**Версия:** 1.0  
**Последнее обновление:** 11 ноября 2025  
**Автор:** AI Senior Software Architect & Documentation Engineer
