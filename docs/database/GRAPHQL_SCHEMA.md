# GraphQL Schema - Sunday School App

## Версия документа: 1.3
**Дата создания:** 23 декабря 2025  
**Последнее обновление:** 27 декабря 2025  
**Проект:** Sunday School App  
**Технологии:** AWS AppSync, GraphQL, AWS Amplify Gen 1, AWS Cognito  
**Authorization:** Cognito User Pools + Groups

> [!NOTE]
> Документация основана на актуальных источниках:
> - AWS AppSync GraphQL — официальная документация AWS
> - AWS Amplify Gen 1 @auth directive — официальная документация

---

## 1. Обзор GraphQL API

### 1.1. Роль AppSync в архитектуре

**AWS AppSync** — managed GraphQL API сервис, который выполняет роль абстракции над DynamoDB и обеспечивает:

✅ **GraphQL API:**
- Единая точка входа для всех данных
- Типобезопасный API с introspection
- Гибкие запросы (запрашиваем только нужные поля)
- Автоматическая генерация схемы через Amplify CLI

✅ **Автоматические resolvers:**
- CRUD операции для каждой @model
- Query, Mutation, Subscription для каждой сущности
- Оптимизированные запросы к DynamoDB

✅ **Авторизация:**
- Интеграция с Cognito User Pools
- Группы пользователей (TEACHER, ADMIN, SUPERADMIN)
- Fine-grained access control через @auth директивы

✅ **Realtime subscriptions:**
- WebSocket соединения для real-time обновлений
- onCreateX, onUpdateX, onDeleteX subscriptions
- Фильтрация по полям (если нужно)

### 1.2. Почему GraphQL

**Преимущества перед REST API:**

| Характеристика | GraphQL | REST API |
|----------------|---------|----------|
| Overfetching | ❌ Нет (запрашиваем только нужное) | ✅ Часто (получаем всё) |
| Underfetching | ❌ Нет (всё в одном запросе) | ✅ Часто (N+1 problem) |
| Типизация | ✅ Встроенная | ❌ Нужна документация |
| Versioning | ✅ Не нужен | ❌ /v1, /v2 |
| Realtime | ✅ Subscriptions | ❌ Нужен WebSocket |
| Documentation | ✅ Introspection | ❌ Ручная |

**Пример:**

**GraphQL (1 запрос):**
```graphql
query {
  getLesson(id: "lesson-789") {
    title
    lessonDate
    goldenVerses {
      items {
        goldenVerse {
          reference
          text
        }
      }
    }
  }
}
```

**REST API (3 запроса):**
```
GET /lessons/lesson-789
GET /lessons/lesson-789/golden-verses
GET /golden-verses/verse-1
GET /golden-verses/verse-2
...
```

### 1.3. Связь с DynamoDB через resolvers

**Паттерн:**

```
GraphQL Query → AppSync Resolver → DynamoDB Query → Response
```

**Пример:**

```graphql
query GetLesson {
  getLesson(id: "lesson-789") {
    id
    title
  }
}
```

**AppSync Resolver → DynamoDB:**
```json
{
  "version": "2018-05-29",
  "operation": "GetItem",
  "key": {
    "id": { "S": "lesson-789" }
  }
}
```

**Amplify Gen 1 автоматически генерирует resolvers** для всех @model директив!

### 1.4. Важное примечание о связях

⚠️ **Критически важно:** В текущей схеме удалены директивы `@belongsTo` и `@hasMany` для устранения циклических зависимостей CloudFormation. Все связи доступны через GraphQL queries с использованием индексов.

**Причина удаления:**
- Циклические зависимости CloudFormation при генерации resolvers для связанных типов
- Переиспользование auth resolver функций между моделями с идентичными @auth правилами
- Подробности см. в [SCHEMA_DIFFERENCES.md](./SCHEMA_DIFFERENCES.md)

**Как работать со связями:**
- Используйте queries через индексы (GSI) для получения связанных данных
- Создавайте batch queries для получения связанных данных в одном запросе
- Кэшируйте результаты на клиенте для уменьшения количества запросов
- Используйте Server Actions для объединения нескольких queries в один вызов

**Примеры получения связанных данных:**
- См. раздел "Примеры queries для связанных данных" ниже
- См. [SCHEMA_DIFFERENCES.md](./SCHEMA_DIFFERENCES.md) для полного списка изменений и альтернативных способов получения данных
- См. [DATA_MODELING.md](./DATA_MODELING.md) для примеров работы со связями через queries

---

## 2. Полная GraphQL Schema

```graphql
# ============================================
# GRAPHQL SCHEMA - Sunday School App
# Версия: 1.0
# Дата: 23 декабря 2025
# База данных: AWS DynamoDB (через AppSync)
# Authorization: AWS Cognito User Pools
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
  FINISHED   # Завершен - уроки больше не создаются
}

enum GradeEventType {
  LESSON          # Обычный урок (🔵 Синий цвет в календаре)
  OUTDOOR_EVENT   # Выездное мероприятие (🟢 Зеленый цвет)
  LESSON_SKIPPING # Отмена урока (🔴 Красный цвет)
}

# ============================================
# USER & AUTHENTICATION
# ============================================

# Пользователи системы (преподаватели, администраторы)
# Основные данные хранятся в Cognito User Pool
# Метаданные хранятся в DynamoDB
type User
  @model
  @auth(rules: [
    # Owner может читать и редактировать свой профиль
    { allow: owner, ownerField: "id", operations: [read, update] },
    # Admin и Superadmin могут управлять всеми пользователями
    { allow: groups, groups: ["ADMIN", "SUPERADMIN"], operations: [create, read, update, delete] },
    # Teacher может читать других пользователей (для списков преподавателей)
    { allow: groups, groups: ["TEACHER"], operations: [read] }
  ]) {
  id: ID! # Cognito sub (уникальный ID)
  email: AWSEmail! # Email из Cognito
  name: String! # Полное имя
  role: UserRole! # Роль в системе
  photo: String # S3 URL фото
  active: Boolean! # Активен ли пользователь
  
  # Связи
  # Примечание: @hasMany связи удалены для устранения циклических зависимостей CloudFormation
  # Используйте queries через индексы byUserId и byTeacherId для получения связанных данных
  # Примеры: userGradesByUserId, lessonsByTeacherId, userFamiliesByUserId
  
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}

# ============================================
# GRADE (ГРУППЫ)
# ============================================

# Группы учеников воскресной школы
type Grade
  @model
  @auth(rules: [
    # Admin и Superadmin могут управлять группами
    { allow: groups, groups: ["ADMIN", "SUPERADMIN"], operations: [create, update, delete] },
    # Teacher может читать группы
    { allow: groups, groups: ["TEACHER", "ADMIN", "SUPERADMIN"], operations: [read] }
  ]) {
  id: ID!
  name: String! # Название группы (например, "Младшая группа")
  description: String
  minAge: Int
  maxAge: Int
  active: Boolean! # Активна ли группа
  
  # Связи
  # Примечание: @hasMany и @hasOne связи удалены для устранения циклических зависимостей CloudFormation
  # Используйте queries через индексы byGradeId для получения связанных данных
  # Примеры: userGradesByGradeId, academicYearsByGradeId, pupilsByGradeId, gradeEventsByGradeId
  # Для settings используйте gradeSettingsByGradeId query
  
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}

# Связь многие-ко-многим между User и Grade
type UserGrade
  @model(queries: null) # Не создаем отдельные queries для этой таблицы
  @auth(rules: [
    # Admin и Superadmin могут управлять назначениями
    { allow: groups, groups: ["ADMIN", "SUPERADMIN"] },
    # Teacher может читать свои назначения
    { allow: groups, groups: ["TEACHER"], operations: [read] }
  ]) {
  id: ID!
  userId: ID! @index(name: "byUserId", sortKeyFields: ["gradeId"])
  gradeId: ID! @index(name: "byGradeId", sortKeyFields: ["userId"])
  
  # Связи
  # Примечание: @belongsTo связи удалены для устранения циклических зависимостей CloudFormation
  # Используйте queries через индексы byUserId и byGradeId для получения связанных данных
  # Примеры: getUser(id: userId), getGrade(id: gradeId)
  
  assignedAt: AWSDateTime!
  createdAt: AWSDateTime!
}

# ============================================
# ACADEMIC YEAR (УЧЕБНЫЕ ГОДЫ)
# ============================================

# Учебные годы для каждой группы
type AcademicYear
  @model
  @auth(rules: [
    # Admin и Superadmin могут управлять учебными годами
    { allow: groups, groups: ["ADMIN", "SUPERADMIN"], operations: [create, update, delete] },
    # Teacher может читать годы
    { allow: groups, groups: ["TEACHER", "ADMIN", "SUPERADMIN"], operations: [read] }
  ]) {
  id: ID!
  gradeId: ID! @index(name: "byGradeId", sortKeyFields: ["startDate"])
  name: String! # Название года (например, "2024-2025")
  startDate: AWSDate! # Дата начала
  endDate: AWSDate! # Дата окончания
  status: AcademicYearStatus! # ACTIVE | FINISHED
  
  # Связи
  # Примечание: @belongsTo и @hasMany связи удалены для устранения циклических зависимостей CloudFormation
  # Используйте queries через индексы для получения связанных данных
  # Примеры: getGrade(id: gradeId), lessonsByAcademicYearId(academicYearId: id)
  
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}

# ============================================
# LESSON (УРОКИ)
# ============================================

# Уроки в рамках учебного года
type Lesson
  @model
  @auth(rules: [
    # Admin и Superadmin могут управлять всеми уроками
    { allow: groups, groups: ["ADMIN", "SUPERADMIN"] },
    # Teacher может создавать уроки в своих группах
    { allow: owner, ownerField: "teacherId", operations: [create, update, delete] },
    # Все авторизованные могут читать уроки
    { allow: groups, groups: ["TEACHER", "ADMIN", "SUPERADMIN"], operations: [read] }
  ]) {
  id: ID!
  academicYearId: ID! @index(name: "byAcademicYearId", sortKeyFields: ["lessonDate"])
  gradeId: ID! @index(name: "byGradeId", sortKeyFields: ["lessonDate"]) # Денормализация
  teacherId: ID! @index(name: "byTeacherId", sortKeyFields: ["createdAt"])
  title: String! # Тема урока
  content: String # JSON от BlockNote редактора
  lessonDate: AWSDate! # Дата проведения урока
  order: Int! # Порядковый номер урока в году
  
  # Связи
  # Примечание: @belongsTo и @hasMany связи удалены для устранения циклических зависимостей CloudFormation
  # Используйте queries через индексы для получения связанных данных
  # Примеры: getAcademicYear(id: academicYearId), getGrade(id: gradeId), getUser(id: teacherId)
  # Примеры: lessonGoldenVersesByLessonId(lessonId: id), homeworkChecksByLessonId(lessonId: id)
  
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}

# ============================================
# BOOK (КНИГИ БИБЛИИ)
# ============================================

# Книги Библии (Ветхий и Новый Завет)
type Book
  @model
  @auth(rules: [
    # Admin и Superadmin могут управлять книгами
    { allow: groups, groups: ["ADMIN", "SUPERADMIN"], operations: [create, update, delete] },
    # Все авторизованные могут читать книги
    { allow: groups, groups: ["TEACHER", "ADMIN", "SUPERADMIN"], operations: [read] }
  ]) {
  id: ID!
  fullName: String! # Полное название (например, "Евангелие от Иоанна")
  shortName: String! @index(name: "byShortName") # Сокращенное название (например, "Иоанна")
  abbreviation: String! # Аббревиатура (например, "Ин")
  testament: String! @index(name: "byTestament", sortKeyFields: ["order"]) # Завет: "OLD" | "NEW"
  order: Int! # Порядок в Библии (1-66)
  
  # Связи
  # Примечание: @hasMany связи удалены для устранения циклических зависимостей CloudFormation
  # Используйте queries через индекс byBookId для получения связанных стихов
  # Пример: goldenVersesByBookId(bookId: id)
  
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}

# ============================================
# GOLDEN VERSE (ЗОЛОТЫЕ СТИХИ)
# ============================================

# Библейские стихи для запоминания
type GoldenVerse
  @model
  @auth(rules: [
    # Admin и Superadmin могут управлять стихами
    { allow: groups, groups: ["ADMIN", "SUPERADMIN"], operations: [create, update, delete] },
    # Все авторизованные могут читать стихи
    { allow: groups, groups: ["TEACHER", "ADMIN", "SUPERADMIN"], operations: [read] }
  ]) {
  id: ID!
  reference: String! # Ссылка (например, "Иоанна 3:16")
  bookId: ID! @index(name: "byBookId", sortKeyFields: ["chapter"]) # ID книги Библии
  chapter: Int! # Номер главы
  verseStart: Int! # Начальный стих
  verseEnd: Int # Конечный стих (если диапазон)
  text: String! # Текст стиха
  
  # Связи
  # Примечание: @belongsTo и @hasMany связи удалены для устранения циклических зависимостей CloudFormation
  # Используйте queries через индексы для получения связанных данных
  # Примеры: getBook(id: bookId), lessonGoldenVersesByGoldenVerseId(goldenVerseId: id)
  
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}

# Связь многие-ко-многим между Lesson и GoldenVerse
type LessonGoldenVerse
  @model(queries: null)
  @auth(rules: [
    # Admin, Superadmin и Teacher могут управлять связью
    { allow: groups, groups: ["TEACHER", "ADMIN", "SUPERADMIN"] }
  ]) {
  id: ID!
  lessonId: ID! @index(name: "byLessonId", sortKeyFields: ["order"])
  goldenVerseId: ID! @index(name: "byGoldenVerseId")
  order: Int! # Порядок стиха в уроке (1, 2, 3...)
  
  # Связи
  # Примечание: @belongsTo связи удалены для устранения циклических зависимостей CloudFormation
  # Используйте queries через индексы для получения связанных данных
  # Примеры: getLesson(id: lessonId), getGoldenVerse(id: goldenVerseId)
  
  createdAt: AWSDateTime!
}

# ============================================
# PUPIL (УЧЕНИКИ)
# ============================================

# Ученики воскресной школы
type Pupil
  @model
  @auth(rules: [
    # Admin и Superadmin могут управлять учениками
    { allow: groups, groups: ["ADMIN", "SUPERADMIN"] },
    # Teacher может читать учеников
    { allow: groups, groups: ["TEACHER", "ADMIN", "SUPERADMIN"], operations: [read] }
  ]) {
  id: ID!
  gradeId: ID! @index(name: "byGradeId", sortKeyFields: ["lastName"])
  firstName: String!
  lastName: String!
  middleName: String
  dateOfBirth: AWSDate!
  photo: String # S3 URL фото
  active: Boolean! # Активен ли ученик
  
  # Связи
  # Примечание: @belongsTo и @hasMany связи удалены для устранения циклических зависимостей CloudFormation
  # Используйте queries через индексы для получения связанных данных
  # Примеры: getGrade(id: gradeId), homeworkChecksByPupilId(pupilId: id), pupilAchievementsByPupilId(pupilId: id), familyMembersByPupilId(pupilId: id)
  
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}

# ============================================
# HOMEWORK CHECK (ПРОВЕРКА ДЗ)
# ============================================

# Результаты проверки домашних заданий учеников за урок
type HomeworkCheck
  @model
  @auth(rules: [
    # Admin, Superadmin и Teacher могут управлять проверками
    { allow: groups, groups: ["TEACHER", "ADMIN", "SUPERADMIN"] }
  ]) {
  id: ID!
  lessonId: ID! @index(name: "byLessonId", sortKeyFields: ["pupilId"])
  pupilId: ID! @index(name: "byPupilId", sortKeyFields: ["createdAt"])
  # Денормализация: gradeId хранится для поддержки GSI-3 (аналитика), хотя есть через Lesson.gradeId
  gradeId: ID! @index(name: "byGradeId", sortKeyFields: ["createdAt"])
  
  # Оценки за золотые стихи (0-2 балла за каждый)
  goldenVerse1Score: Int # Баллы за первый золотой стих (0-2)
  goldenVerse2Score: Int # Баллы за второй золотой стих (0-2)
  goldenVerse3Score: Int # Баллы за третий золотой стих (0-2)
  
  # Баллы за домашнее задание
  testScore: Int # Баллы за тест (0-10)
  notebookScore: Int # Баллы за тетрадь (0-10)
  
  # Посещение спевки
  singing: Boolean! # Был на спевке
  
  # Результаты (вычисляются автоматически)
  points: Int! # Баллы за урок (сумма всех компонентов)
  # Примечание: Поле hasHouse устарело и будет удалено (заменено на систему кирпичиков)
  
  # Связи
  # Примечание: @belongsTo связи удалены для устранения циклических зависимостей CloudFormation
  # Используйте queries через индексы для получения связанных данных
  # Примеры: getLesson(id: lessonId), getPupil(id: pupilId), getGrade(id: gradeId)
  # Примечание: gradeId используется только для денормализации и GSI-3 (аналитика), связь с Grade через Lesson
  
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}

# ============================================
# ACHIEVEMENT (ДОСТИЖЕНИЯ)
# ============================================

# Достижения (badges) для учеников
type Achievement
  @model
  @auth(rules: [
    # Admin и Superadmin могут управлять достижениями
    { allow: groups, groups: ["ADMIN", "SUPERADMIN"], operations: [create, update, delete] },
    # Все авторизованные могут читать достижения
    { allow: groups, groups: ["TEACHER", "ADMIN", "SUPERADMIN"], operations: [read] }
  ]) {
  id: ID!
  name: String! # Название достижения (например, "Отличник")
  description: String! # Описание
  icon: String # Emoji или URL иконки
  criteria: String! # JSON критерии получения
  
  # Связи
  # Примечание: @hasMany связи удалены для устранения циклических зависимостей CloudFormation
  # Используйте queries через индекс byAchievementId для получения связанных учеников
  # Пример: pupilAchievementsByAchievementId(achievementId: id)
  
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}

# Связь многие-ко-многим между Pupil и Achievement
type PupilAchievement
  @model(queries: null)
  @auth(rules: [
    # Admin, Superadmin и Teacher могут управлять связью
    { allow: groups, groups: ["TEACHER", "ADMIN", "SUPERADMIN"] }
  ]) {
  id: ID!
  pupilId: ID! @index(name: "byPupilId", sortKeyFields: ["awardedAt"])
  achievementId: ID! @index(name: "byAchievementId")
  awardedAt: AWSDateTime! # Дата получения достижения
  
  # Связи
  # Примечание: @belongsTo связи удалены для устранения циклических зависимостей CloudFormation
  # Используйте queries через индексы для получения связанных данных
  # Примеры: getPupil(id: pupilId), getAchievement(id: achievementId)
  
  createdAt: AWSDateTime!
}

# ============================================
# FAMILY (СЕМЬИ)
# ============================================

# Семьи учеников для связи и контактов
type Family
  @model
  @auth(rules: [
    # Admin и Superadmin могут управлять семьями
    { allow: groups, groups: ["ADMIN", "SUPERADMIN"] },
    # Teacher может читать семьи
    { allow: groups, groups: ["TEACHER", "ADMIN", "SUPERADMIN"], operations: [read] }
  ]) {
  id: ID!
  name: String! # Фамилия семьи
  phone: String # Телефон контактного лица
  email: AWSEmail # Email семьи
  address: String # Адрес (опционально)
  
  # Информация о матери
  motherFirstName: String # Имя матери
  motherLastName: String # Фамилия матери
  motherMiddleName: String # Отчество матери
  motherPhone: String @index(name: "byMotherPhone") # Телефон матери (для связи с PARENT)
  
  # Информация об отце
  fatherFirstName: String # Имя отца
  fatherLastName: String # Фамилия отца
  fatherMiddleName: String # Отчество отца
  fatherPhone: String @index(name: "byFatherPhone") # Телефон отца (для связи с PARENT)
  
  # Связи
  # Примечание: @hasMany связи удалены для устранения циклических зависимостей CloudFormation
  # Используйте queries через индекс byFamilyId для получения связанных данных
  # Примеры: familyMembersByFamilyId(familyId: id), userFamiliesByFamilyId(familyId: id)
  
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}

# Связь многие-ко-многим между Family и Pupil
type FamilyMember
  @model(queries: null)
  @auth(rules: [
    # Admin и Superadmin могут управлять связью
    { allow: groups, groups: ["ADMIN", "SUPERADMIN"] },
    # Teacher может читать связь
    { allow: groups, groups: ["TEACHER"], operations: [read] }
  ]) {
  id: ID!
  familyId: ID! @index(name: "byFamilyId")
  pupilId: ID! @index(name: "byPupilId")
  
  # Связи
  # Примечание: @belongsTo связи удалены для устранения циклических зависимостей CloudFormation
  # Используйте queries через индексы для получения связанных данных
  # Примеры: getFamily(id: familyId), getPupil(id: pupilId)
  
  createdAt: AWSDateTime!
}

# Связь пользователей с ролью PARENT с семьями
type UserFamily
  @model(queries: null)
  @auth(rules: [
    # Admin и Superadmin могут управлять связью
    { allow: groups, groups: ["ADMIN", "SUPERADMIN"] },
    # PARENT может читать свои связи
    { allow: owner, ownerField: "userId", operations: [read] }
  ]) {
  id: ID!
  userId: ID! @index(name: "byUserId")
  familyId: ID! @index(name: "byFamilyId")
  phone: String! @index(name: "byPhone") # Номер телефона, использованный для связи
  
  # Связи
  # Примечание: @belongsTo связи удалены для устранения циклических зависимостей CloudFormation
  # Используйте queries через индексы для получения связанных данных
  # Примеры: getUser(id: userId), getFamily(id: familyId)
  
  createdAt: AWSDateTime!
}

# ============================================
# GRADE EVENT (СОБЫТИЯ В РАСПИСАНИИ)
# ============================================

# События в календаре группы (уроки, мероприятия, отмены)
type GradeEvent
  @model
  @auth(rules: [
    # Admin, Superadmin и Teacher могут управлять событиями
    { allow: groups, groups: ["TEACHER", "ADMIN", "SUPERADMIN"] }
  ]) {
  id: ID!
  gradeId: ID! @index(name: "byGradeId", sortKeyFields: ["eventDate"])
  eventType: GradeEventType! # LESSON | OUTDOOR_EVENT | LESSON_SKIPPING
  title: String! # Название события
  description: String # Описание события
  eventDate: AWSDate! # Дата события
  
  # Связи
  # Примечание: @belongsTo связи удалены для устранения циклических зависимостей CloudFormation
  # Используйте queries через индекс byGradeId для получения связанной группы
  # Пример: getGrade(id: gradeId)
  
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}

# ============================================
# GRADE SETTINGS (НАСТРОЙКИ ОЦЕНИВАНИЯ)
# ============================================

# Настройки параметров оценивания для каждой группы
type GradeSettings
  @model
  @auth(rules: [
    # Admin и Superadmin могут управлять настройками
    { allow: groups, groups: ["ADMIN", "SUPERADMIN"], operations: [create, update, delete] },
    # Teacher может читать настройки
    { allow: groups, groups: ["TEACHER", "ADMIN", "SUPERADMIN"], operations: [read] }
  ]) {
  id: ID!
  gradeId: ID! @index(name: "byGradeId")
  
  # Включение/выключение параметров
  enableGoldenVerse: Boolean! # Использовать золотые стихи
  enableTest: Boolean! # Использовать тест
  enableNotebook: Boolean! # Использовать тетрадь
  enableSinging: Boolean! # Использовать спевку
  
  # Баллы за каждый параметр
  pointsGoldenVerse: Int! # Баллы за золотой стих
  pointsTest: Int! # Баллы за тест
  pointsNotebook: Int! # Баллы за тетрадь
  pointsSinging: Int! # Баллы за спевку
  
  # Кастомные метки (для адаптации названий)
  labelGoldenVerse: String! # Метка для стихов (по умолчанию "Золотые стихи")
  labelTest: String! # Метка для теста (по умолчанию "Тест")
  labelNotebook: String! # Метка для тетради (по умолчанию "Тетрадь")
  labelSinging: String! # Метка для спевки (по умолчанию "Спевка")
  
  # Связи
  # Примечание: @belongsTo связи удалены для устранения циклических зависимостей CloudFormation
  # Используйте queries через индекс byGradeId для получения связанной группы
  # Пример: getGrade(id: gradeId)
  
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}
```

---

## 3. Описание типов

### 3.1. Скалярные типы AWS

AppSync поддерживает специальные скалярные типы AWS:

| Тип | Описание | Пример |
|-----|----------|--------|
| `ID` | Уникальный идентификатор (String) | `"user-123"` |
| `String` | Строка | `"Иванов Иван"` |
| `Int` | Целое число | `42` |
| `Float` | Число с плавающей точкой | `3.14` |
| `Boolean` | true/false | `true` |
| `AWSDate` | Дата (ISO 8601) | `"2025-01-15"` |
| `AWSTime` | Время | `"14:30:00"` |
| `AWSDateTime` | Дата и время (ISO 8601) | `"2025-01-15T14:30:00Z"` |
| `AWSEmail` | Email адрес | `"user@church.com"` |
| `AWSURL` | URL | `"https://s3.amazonaws.com/..."` |
| `AWSJSON` | JSON string | `"{\"key\": \"value\"}"` |

### 3.2. Директивы Amplify

**@model:**
- Автоматически создает DynamoDB таблицу
- Генерирует CRUD queries и mutations
- Создает subscriptions (onCreateX, onUpdateX, onDeleteX)

**@auth:**
- Определяет правила авторизации
- Интегрируется с Cognito User Pools
- Поддерживает owner, groups, private, public стратегии

**@hasMany / @belongsTo / @hasOne:**
- ⚠️ **Примечание:** В текущей схеме эти директивы удалены для устранения циклических зависимостей CloudFormation
- Связи доступны через queries с использованием индексов (GSI)
- См. раздел "Примеры queries для связанных данных" ниже
- См. [SCHEMA_DIFFERENCES.md](./SCHEMA_DIFFERENCES.md) для полного списка изменений

**@index:**
- Создает Global Secondary Index (GSI) в DynamoDB
- Первый параметр — PK GSI
- sortKeyFields — SK GSI

---

## 4. Queries (Чтение данных)

Amplify автоматически генерирует queries для каждого @model типа:

### 4.1. Get (Получить одну запись)

**Для каждого типа:**

```graphql
# User
query GetUser {
  getUser(id: "user-123") {
    id
    name
    email
    role
    photo
    active
  }
}

# Lesson
query GetLesson {
  getLesson(id: "lesson-789") {
    id
    title
    lessonDate
    content
    teacher {
      name
    }
    goldenVerses {
      items {
        goldenVerse {
          reference
          text
        }
      }
    }
  }
}

# Pupil
query GetPupil {
  getPupil(id: "pupil-456") {
    id
    firstName
    lastName
    dateOfBirth
    grade {
      name
    }
  }
}
```

### 4.2. List (Получить список записей)

**Для каждого типа:**

```graphql
# Список уроков
query ListLessons {
  listLessons(
    filter: {
      gradeId: { eq: "grade-123" }
    }
    limit: 20
    nextToken: null
  ) {
    items {
      id
      title
      lessonDate
      order
    }
    nextToken
  }
}

# Список учеников группы
query ListPupils {
  listPupils(
    filter: {
      gradeId: { eq: "grade-123" }
      active: { eq: true }
    }
  ) {
    items {
      id
      firstName
      lastName
      dateOfBirth
    }
  }
}

# Список активных учебных годов
query ListActiveAcademicYears {
  listAcademicYears(
    filter: {
      status: { eq: ACTIVE }
    }
  ) {
    items {
      id
      name
      startDate
      endDate
      grade {
        name
      }
    }
  }
}
```

### 4.3. Queries by Index (Использование GSI)

**Для типов с @index:**

```graphql
# Уроки учебного года (GSI: byAcademicYearId)
query LessonsByAcademicYear {
  lessonsByAcademicYearId(
    academicYearId: "year-456"
    sortDirection: ASC
  ) {
    items {
      id
      title
      lessonDate
      order
    }
  }
}

# Ученики группы (GSI: byGradeId)
query PupilsByGrade {
  pupilsByGradeId(
    gradeId: "grade-123"
  ) {
    items {
      id
      firstName
      lastName
    }
  }
}

# Проверки ДЗ урока (GSI: byLessonId)
query HomeworkChecksByLesson {
  homeworkChecksByLessonId(
    lessonId: "lesson-789"
  ) {
    items {
      id
      pupil {
        firstName
        lastName
      }
      goldenVerse
      test
      notebook
      singing
      points
      # hasHouse устарело (заменено на систему кирпичиков)
    }
  }
}

# История ученика (GSI: byPupilId)
query HomeworkChecksByPupil {
  homeworkChecksByPupilId(
    pupilId: "pupil-222"
    sortDirection: DESC
  ) {
    items {
      id
      lesson {
        title
        lessonDate
      }
      points
      hasHouse
    }
  }
}

# Книги по завету (GSI: byTestament)
query BooksByTestament {
  booksByTestament(
    testament: "NEW"
    sortDirection: ASC
  ) {
    items {
      id
      fullName
      shortName
      abbreviation
      order
    }
  }
}

# Стихи из книги (GSI: byBookId)
query GoldenVersesByBook {
  goldenVersesByBookId(
    bookId: "book-123"
    sortDirection: ASC
  ) {
    items {
      id
      reference
      chapter
      verseStart
      verseEnd
      text
      book {
        shortName
        fullName
        abbreviation
      }
    }
  }
}

# Золотые стихи группы за учебный год (AP-25)
query GoldenVersesByAcademicYear {
  lessonsByAcademicYearId(
    academicYearId: "year-456"
    sortDirection: ASC
  ) {
    items {
      id
      title
      lessonDate
      goldenVerses {
        items {
          order
          goldenVerse {
            id
            reference
            text
            book {
              shortName
              fullName
            }
          }
        }
      }
    }
  }
}
# Примечание: На клиенте необходимо дедуплицировать стихи по goldenVerse.id

---

### 4.5. Примеры queries для связанных данных (без @belongsTo/@hasMany)

⚠️ **Важно:** Поскольку директивы `@belongsTo` и `@hasMany` удалены из схемы, все связанные данные необходимо получать через отдельные queries с использованием индексов.

**Паттерн работы со связями:**

1. Получить основную сущность через `getX(id: ...)`
2. Получить связанные данные через queries по индексам (например, `xByYId`)
3. Объединить результаты на клиенте или в Server Action

**Пример 1: Получить урок с золотыми стихами и проверками ДЗ**

```graphql
# Шаг 1: Получить урок
query GetLesson($lessonId: ID!) {
  getLesson(id: $lessonId) {
    id
    title
    lessonDate
    academicYearId
    gradeId
    teacherId
  }
}

# Шаг 2: Получить золотые стихи урока через индекс
query GetLessonGoldenVerses($lessonId: ID!) {
  lessonGoldenVersesByLessonId(
    lessonId: $lessonId
    sortDirection: ASC
  ) {
    items {
      id
      goldenVerseId
      order
    }
  }
}

# Шаг 3: Получить проверки ДЗ урока через индекс
query GetLessonHomeworkChecks($lessonId: ID!) {
  homeworkChecksByLessonId(
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

# Шаг 4: Получить связанные сущности (если нужно)
query GetRelatedEntities($academicYearId: ID!, $gradeId: ID!, $teacherId: ID!) {
  academicYear: getAcademicYear(id: $academicYearId) {
    id
    name
    startDate
    endDate
  }
  grade: getGrade(id: $gradeId) {
    id
    name
  }
  teacher: getUser(id: $teacherId) {
    id
    name
    email
  }
}
```

**Альтернатива: Batch query (все в одном запросе)**

```graphql
query GetLessonComplete($lessonId: ID!, $academicYearId: ID!, $gradeId: ID!, $teacherId: ID!) {
  # Основная информация об уроке
  lesson: getLesson(id: $lessonId) {
    id
    title
    lessonDate
    order
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
  
  # Связанные сущности
  academicYear: getAcademicYear(id: $academicYearId) {
    id
    name
  }
  grade: getGrade(id: $gradeId) {
    id
    name
  }
  teacher: getUser(id: $teacherId) {
    id
    name
  }
}
```

**Пример 2: Получить ученика с проверками ДЗ и достижениями**

```graphql
query GetPupilComplete($pupilId: ID!, $gradeId: ID!) {
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
  
  # Группа ученика
  grade: getGrade(id: $gradeId) {
    id
    name
    description
  }
}
```

**Пример 3: Получить группу с событиями**

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

**Рекомендации:**

- Используйте **batch queries** (несколько queries в одном запросе) для уменьшения количества round trips
- Используйте **Server Actions** для объединения нескольких queries в один вызов
- **Кэшируйте результаты** на клиенте для уменьшения количества запросов
- См. [SERVER_ACTIONS.md](../api/SERVER_ACTIONS.md) для примеров использования в Server Actions
- См. [SCHEMA_DIFFERENCES.md](./SCHEMA_DIFFERENCES.md) для полного списка изменений и альтернативных способов получения данных

---

# Баллы ученика за учебный год с посещаемостью (AP-30)
query PupilPerformanceByAcademicYear($pupilId: ID!, $startDate: AWSDateTime!, $endDate: AWSDateTime!) {
  homeworkChecksByPupilId(
    pupilId: $pupilId
    createdAt: {
      between: [$startDate, $endDate]
    }
    sortDirection: ASC
  ) {
    items {
      id
      lesson {
        title
        lessonDate
      }
      goldenVerse1Score
      goldenVerse2Score
      goldenVerse3Score
      testScore
      notebookScore
      singing
      points
      createdAt
    }
  }
}
# Примечание: На клиенте необходимо агрегировать данные:
# - totalPoints, averagePoints
# - lessonsCount, lessonsAttended, attendanceRate
# - goldenVerseTotal, testTotal, notebookTotal, singingCount

# Баллы ученика за период дат с посещаемостью (AP-31)
query PupilPerformanceByDateRange($pupilId: ID!, $startDate: AWSDateTime!, $endDate: AWSDateTime!) {
  homeworkChecksByPupilId(
    pupilId: $pupilId
    createdAt: {
      between: [$startDate, $endDate]
    }
    sortDirection: ASC
  ) {
    items {
      id
      lesson {
        title
        lessonDate
      }
      goldenVerse1Score
      goldenVerse2Score
      goldenVerse3Score
      testScore
      notebookScore
      singing
      points
      createdAt
    }
  }
}
# Примечание: Аналогично AP-30, агрегация на клиенте

# Аналитика сложности золотых стихов (AP-ANALYTICS-7)
query GoldenVerseDifficultyAnalysis($gradeId: ID!, $startDate: AWSDateTime!, $endDate: AWSDateTime!) {
  homeworkChecksByGradeId(
    gradeId: $gradeId
    createdAt: {
      between: [$startDate, $endDate]
    }
    sortDirection: ASC
  ) {
    items {
      id
      lessonId
      goldenVerse1Score
      goldenVerse2Score
      goldenVerse3Score
      lesson {
        id
        goldenVerses {
          items {
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
# Примечание: На клиенте необходимо:
# 1. Сопоставить goldenVerse1Score/2Score/3Score с соответствующими стихами по order
# 2. Агрегировать статистику по goldenVerseId:
#    - totalChecks, maxScoreCount, successRate, averageScore, difficultyLevel
```

---

## 5. Mutations (Изменение данных)

Amplify автоматически генерирует mutations для каждого @model типа:

### 5.1. Create (Создать запись)

```graphql
# Создать урок
mutation CreateLesson {
  createLesson(input: {
    academicYearId: "year-456"
    gradeId: "grade-123"
    teacherId: "user-abc"
    title: "Сотворение мира"
    content: "{\"type\":\"doc\",\"content\":[...]}"
    lessonDate: "2024-09-08"
    order: 1
  }) {
    id
    title
    lessonDate
  }
}

# Создать ученика
mutation CreatePupil {
  createPupil(input: {
    gradeId: "grade-123"
    firstName: "Иван"
    lastName: "Иванов"
    middleName: "Иванович"
    dateOfBirth: "2015-03-15"
    active: true
  }) {
    id
    firstName
    lastName
  }
}

# Создать проверку ДЗ
mutation CreateHomeworkCheck {
  createHomeworkCheck(input: {
    lessonId: "lesson-789"
    pupilId: "pupil-222"
    goldenVerse: true
    test: true
    notebook: true
    singing: false
    points: 30
    # hasHouse устарело (заменено на систему кирпичиков)
  }) {
    id
    points
    hasHouse
  }
}

# Создать книгу Библии
mutation CreateBook {
  createBook(input: {
    fullName: "Евангелие от Иоанна"
    shortName: "Иоанна"
    abbreviation: "Ин"
    testament: "NEW"
    order: 43
  }) {
    id
    fullName
    shortName
    abbreviation
  }
}

# Создать золотой стих
mutation CreateGoldenVerse {
  createGoldenVerse(input: {
    bookId: "book-123"
    reference: "Иоанна 3:16"
    chapter: 3
    verseStart: 16
    text: "Ибо так возлюбил Бог мир..."
  }) {
    id
    reference
    book {
      shortName
      fullName
    }
  }
}
```

### 5.2. Update (Обновить запись)

```graphql
# Обновить урок
mutation UpdateLesson {
  updateLesson(input: {
    id: "lesson-789"
    title: "Сотворение мира (обновлено)"
    content: "{\"type\":\"doc\",\"content\":[...]}"
  }) {
    id
    title
    updatedAt
  }
}

# Обновить ученика
mutation UpdatePupil {
  updatePupil(input: {
    id: "pupil-222"
    photo: "https://s3.amazonaws.com/..."
  }) {
    id
    photo
    updatedAt
  }
}

# Обновить настройки группы
mutation UpdateGradeSettings {
  updateGradeSettings(input: {
    id: "settings-001"
    pointsGoldenVerse: 15
    enableSinging: false
  }) {
    id
    pointsGoldenVerse
    enableSinging
  }
}
```

### 5.3. Delete (Удалить запись)

```graphql
# Удалить урок
mutation DeleteLesson {
  deleteLesson(input: {
    id: "lesson-789"
  }) {
    id
  }
}

# Удалить ученика
mutation DeletePupil {
  deletePupil(input: {
    id: "pupil-222"
  }) {
    id
  }
}
```

### 5.4. Batch Mutations (Массовые операции)

**Пример: Массовая проверка ДЗ**

Нужно вызвать несколько mutations в цикле:

```typescript
// В Next.js Server Action
const pupils = await amplifyData.list('Pupil', { gradeId });

const results = await Promise.all(
  pupils.map(pupil => 
    amplifyData.create('HomeworkCheck', {
      lessonId,
      pupilId: pupil.id,
      goldenVerse: false,
      test: false,
      notebook: false,
      singing: false,
      points: 0,
      # hasHouse устарело (заменено на систему кирпичиков)
    })
  )
);
```

---

## 6. Subscriptions (Realtime обновления)

Amplify автоматически генерирует subscriptions для каждого @model типа:

### 6.1. onCreate

```graphql
# Подписка на создание новых уроков
subscription OnCreateLesson {
  onCreateLesson(
    filter: {
      gradeId: { eq: "grade-123" }
    }
  ) {
    id
    title
    lessonDate
    teacher {
      name
    }
  }
}

# Подписка на создание новых проверок ДЗ
subscription OnCreateHomeworkCheck {
  onCreateHomeworkCheck(
    filter: {
      lessonId: { eq: "lesson-789" }
    }
  ) {
    id
    pupil {
      firstName
      lastName
    }
    points
    hasHouse
  }
}
```

### 6.2. onUpdate

```graphql
# Подписка на обновление урока
subscription OnUpdateLesson {
  onUpdateLesson(
    filter: {
      id: { eq: "lesson-789" }
    }
  ) {
    id
    title
    content
    updatedAt
  }
}
```

### 6.3. onDelete

```graphql
# Подписка на удаление ученика
subscription OnDeletePupil {
  onDeletePupil(
    filter: {
      gradeId: { eq: "grade-123" }
    }
  ) {
    id
  }
}
```

**Использование в Next.js (опционально для MVP):**

```typescript
'use client';

import { useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';

const client = generateClient();

function LessonsList() {
  useEffect(() => {
    const subscription = client.graphql({
      query: onCreateLesson,
      variables: { filter: { gradeId: { eq: 'grade-123' } } }
    }).subscribe({
      next: ({ data }) => {
        console.log('New lesson created:', data.onCreateLesson);
        // Обновить UI
      },
      error: (error) => console.error(error)
    });
    
    return () => subscription.unsubscribe();
  }, []);
  
  // ...
}
```

---

## 7. Input Types

Amplify автоматически генерирует Input types для каждого @model:

### 7.1. Create Input

```graphql
input CreateLessonInput {
  academicYearId: ID!
  gradeId: ID!
  teacherId: ID!
  title: String!
  content: String
  lessonDate: AWSDate!
  order: Int!
}

input CreatePupilInput {
  gradeId: ID!
  firstName: String!
  lastName: String!
  middleName: String
  dateOfBirth: AWSDate!
  photo: String
  active: Boolean!
}

input CreateHomeworkCheckInput {
  lessonId: ID!
  pupilId: ID!
  goldenVerse1Score: Int
  goldenVerse2Score: Int
  goldenVerse3Score: Int
  testScore: Int
  notebookScore: Int
  singing: Boolean!
  points: Int!
  # hasHouse устарело (заменено на систему кирпичиков)
}

input CreateBookInput {
  fullName: String!
  shortName: String!
  abbreviation: String!
  testament: String! # "OLD" | "NEW"
  order: Int!
}

input CreateGoldenVerseInput {
  bookId: ID!
  reference: String!
  chapter: Int!
  verseStart: Int!
  verseEnd: Int
  text: String!
}
```

### 7.2. Update Input

```graphql
input UpdateLessonInput {
  id: ID! # Обязательный ID для обновления
  title: String
  content: String
  lessonDate: AWSDate
  order: Int
}

input UpdatePupilInput {
  id: ID!
  gradeId: ID
  firstName: String
  lastName: String
  middleName: String
  dateOfBirth: AWSDate
  photo: String
  active: Boolean
}

input UpdateBookInput {
  id: ID!
  fullName: String
  shortName: String
  abbreviation: String
  testament: String
  order: Int
}

input UpdateGoldenVerseInput {
  id: ID!
  bookId: ID
  reference: String
  chapter: Int
  verseStart: Int
  verseEnd: Int
  text: String
}
```

### 7.3. Filter Input

```graphql
input ModelLessonFilterInput {
  id: ModelIDInput
  academicYearId: ModelIDInput
  gradeId: ModelIDInput
  teacherId: ModelIDInput
  title: ModelStringInput
  lessonDate: ModelStringInput
  order: ModelIntInput
  and: [ModelLessonFilterInput]
  or: [ModelLessonFilterInput]
  not: ModelLessonFilterInput
}

input ModelStringInput {
  eq: String
  ne: String
  contains: String
  notContains: String
  beginsWith: String
  between: [String]
  size: ModelSizeInput
}

input ModelIntInput {
  eq: Int
  ne: Int
  gt: Int
  gte: Int
  lt: Int
  lte: Int
  between: [Int]
}
```

**Пример использования:**

```graphql
query FilterLessons {
  listLessons(
    filter: {
      and: [
        { gradeId: { eq: "grade-123" } },
        { lessonDate: { gte: "2024-09-01" } },
        { title: { contains: "Сотворение" } }
      ]
    }
  ) {
    items {
      id
      title
      lessonDate
    }
  }
}
```

---

## 8. Authorization Rules (@auth)

### 8.1. Стратегии авторизации

**owner:**
- Владелец записи (по ownerField)
- Используется для профилей, личных данных

```graphql
type User @model @auth(rules: [
  { allow: owner, ownerField: "id" }
]) {
  id: ID!
  name: String!
}
```

**groups:**
- Cognito Groups (TEACHER, ADMIN, SUPERADMIN)
- Используется для ролевого доступа

```graphql
type Lesson @model @auth(rules: [
  { allow: groups, groups: ["TEACHER", "ADMIN", "SUPERADMIN"] }
]) {
  id: ID!
  title: String!
}
```

**private:**
- Любой авторизованный пользователь
- Используется для публичных внутри системы данных

```graphql
type GoldenVerse @model @auth(rules: [
  { allow: private }
]) {
  id: ID!
  text: String!
}
```

**public:**
- Без авторизации (API Key)
- НЕ используется в нашем проекте

### 8.2. Operations

Можно ограничить операции для каждой роли:

```graphql
type Lesson @model @auth(rules: [
  # Admin и Superadmin — полный доступ
  { allow: groups, groups: ["ADMIN", "SUPERADMIN"] },
  # Teacher — может создавать/редактировать свои уроки
  { allow: owner, ownerField: "teacherId", operations: [create, update, delete] },
  # Все могут читать
  { allow: groups, groups: ["TEACHER"], operations: [read] }
]) {
  id: ID!
  title: String!
  teacherId: ID!
}
```

**Operations:**
- `create` — создание
- `read` — чтение (get, list)
- `update` — обновление
- `delete` — удаление

### 8.3. Field-level authorization

Можно ограничить доступ к отдельным полям:

```graphql
type User @model @auth(rules: [
  { allow: groups, groups: ["ADMIN", "SUPERADMIN"] }
]) {
  id: ID!
  name: String!
  email: String! @auth(rules: [
    { allow: owner },
    { allow: groups, groups: ["ADMIN", "SUPERADMIN"] }
  ])
}
```

### 8.4. Таблица прав доступа по ролям

Краткая сводка прав доступа для каждой роли:

| Тип данных | TEACHER | ADMIN | SUPERADMIN |
|------------|---------|-------|------------|
| **User** | Read (все), Update (свой профиль) | Create, Read, Update, Delete (все) | Create, Read, Update, Delete (все) |
| **Grade** | Read | Create, Read, Update, Delete | Create, Read, Update, Delete |
| **UserGrade** | Read (свои назначения) | Create, Read, Update, Delete | Create, Read, Update, Delete |
| **AcademicYear** | Read | Create, Read, Update, Delete | Create, Read, Update, Delete |
| **Lesson** | Read (все), Create/Update/Delete (свои уроки) | Create, Read, Update, Delete | Create, Read, Update, Delete |
| **Book** | Read | Create, Read, Update, Delete | Create, Read, Update, Delete |
| **GoldenVerse** | Read | Create, Read, Update, Delete | Create, Read, Update, Delete |
| **LessonGoldenVerse** | Create, Read, Update, Delete | Create, Read, Update, Delete | Create, Read, Update, Delete |
| **Pupil** | Read | Create, Read, Update, Delete | Create, Read, Update, Delete |
| **HomeworkCheck** | Create, Read, Update, Delete | Create, Read, Update, Delete | Create, Read, Update, Delete |
| **Achievement** | Read | Create, Read, Update, Delete | Create, Read, Update, Delete |
| **PupilAchievement** | Create, Read, Update, Delete | Create, Read, Update, Delete | Create, Read, Update, Delete |
| **Family** | Read | Create, Read, Update, Delete | Create, Read, Update, Delete |
| **FamilyMember** | Read | Create, Read, Update, Delete | Create, Read, Update, Delete |
| **UserFamily** | — | Create, Read, Update, Delete | Create, Read, Update, Delete |
| **GradeEvent** | Create, Read, Update, Delete | Create, Read, Update, Delete | Create, Read, Update, Delete |
| **GradeSettings** | Read | Create, Read, Update, Delete | Create, Read, Update, Delete |

**Примечания:**
- **Owner-based access:** User может обновлять только свой профиль (ownerField: "id"). Lesson может создавать/обновлять/удалять только свои уроки (ownerField: "teacherId").
- **UserFamily:** Owner (userId) может читать свои связи (для роли PARENT, Post-MVP).
- **ADMIN и SUPERADMIN:** В MVP имеют одинаковые права. SUPERADMIN зарезервирован для будущего расширения.

---

## 9. Связь с DynamoDB

### 9.1. Как типы маппятся на таблицы

**GraphQL @model → DynamoDB Table:**

| GraphQL Type | DynamoDB Table | PK | SK |
|--------------|----------------|----|----|
| User | Users | id | — |
| Grade | Grades | id | — |
| Lesson | Lessons | id | — |
| Book | Books | id | — |
| GoldenVerse | GoldenVerses | id | — |
| Pupil | Pupils | id | — |
| HomeworkCheck | HomeworkChecks | id | — |

**@index → GSI:**

```graphql
type Lesson @model {
  id: ID!
  gradeId: ID! @index(name: "byGradeId", sortKeyFields: ["lessonDate"])
}
```

→ **GSI:** `byGradeId` с PK=gradeId, SK=lessonDate

### 9.2. Resolvers для queries и mutations

Amplify автоматически создает resolvers:

**Query GetLesson → DynamoDB GetItem:**
```json
{
  "version": "2018-05-29",
  "operation": "GetItem",
  "key": {
    "id": { "S": "lesson-789" }
  }
}
```

**Query ListLessons → DynamoDB Query (GSI):**
```json
{
  "version": "2018-05-29",
  "operation": "Query",
  "index": "byGradeId",
  "query": {
    "expression": "gradeId = :gradeId",
    "expressionValues": {
      ":gradeId": { "S": "grade-123" }
    }
  }
}
```

**Mutation CreateLesson → DynamoDB PutItem:**
```json
{
  "version": "2018-05-29",
  "operation": "PutItem",
  "key": {
    "id": { "S": "generated-uuid" }
  },
  "attributeValues": {
    "title": { "S": "Сотворение мира" },
    "lessonDate": { "S": "2024-09-08" },
    ...
  }
}
```

### 9.3. Автоматическая генерация через Amplify CLI

**Процесс:**

1. **Определить schema.graphql:**
```graphql
type Lesson @model {
  id: ID!
  title: String!
  lessonDate: AWSDate!
}
```

2. **Запустить `amplify push`**

3. **Amplify автоматически:**
   - Создает DynamoDB таблицу `Lesson-{env}-{id}`
   - Создает AppSync API
   - Генерирует resolvers
   - Создает TypeScript types в `src/API.ts`

4. **Использовать в коде:**
```typescript
import { generateClient } from 'aws-amplify/api';
import type { Schema } from '@/amplify/data/resource';

const client = generateClient<Schema>();

const lesson = await client.models.Lesson.get({ id: 'lesson-789' });
```

**Примечание о новых access patterns:**
- Новые access patterns (AP-25, AP-26, AP-30, AP-31, AP-ANALYTICS-6, AP-ANALYTICS-7) используют существующие GSI
- Для аналитики сложности стихов все необходимые индексы уже существуют в GraphQL schema
- Опциональная оптимизация через денормализацию (GSI-3 в LessonGoldenVerses) может быть добавлена post-MVP при необходимости

---

## Cross-reference

- См. также: [`docs/database/ERD.md`](../database/ERD.md) — визуализация сущностей
- См. также: [`docs/database/DYNAMODB_SCHEMA.md`](../database/DYNAMODB_SCHEMA.md) — детальная схема DynamoDB
- См. также: [`docs/database/DATA_MODELING.md`](../database/DATA_MODELING.md) — access patterns
- См. также: [`docs/database/SCHEMA_DIFFERENCES.md`](../database/SCHEMA_DIFFERENCES.md) — различия между текущей и документированной схемой, причины удаления @belongsTo/@hasMany
- См. также: [`docs/api/SERVER_ACTIONS.md`](../api/SERVER_ACTIONS.md) — использование в Next.js
- См. также: [`docs/architecture/ARCHITECTURE.md`](../architecture/ARCHITECTURE.md) — общая архитектура

---

**Версия:** 1.0  
**Последнее обновление:** 27 декабря 2025  
**Автор:** AI Documentation Team

