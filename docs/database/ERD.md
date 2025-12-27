# Entity Relationship Diagram (ERD) - Sunday School App

## Версия документа: 1.2
**Дата создания:** 23 декабря 2025  
**Последнее обновление:** 25 декабря 2025  
**Проект:** Sunday School App  
**Технологии:** AWS DynamoDB, AWS AppSync (GraphQL), AWS Cognito  
**База данных:** AWS DynamoDB

> [!NOTE]
> Документация основана на актуальных источниках:
> - DynamoDB best practices — AWS документация
> - AWS AppSync GraphQL — официальная документация

---

## 1. Обзор

Данный документ описывает структуру базы данных для веб-приложения управления воскресной школой баптистской церкви. База данных спроектирована с учетом масштабируемости, производительности и специфики NoSQL (DynamoDB).

### 1.1. Основные принципы проектирования

- **NoSQL Design Patterns:** Использование Partition Keys и Sort Keys для эффективных запросов
- **Multiple Tables:** Отдельные таблицы для каждой сущности (не Single Table Design)
- **Масштабируемость:** Global Secondary Indexes (GSI) для альтернативных запросов
- **Интеграция с Cognito:** Пользователи хранятся в Cognito User Pools, метаданные в DynamoDB
- **Гибкость:** Поддержка различных ролей и настроек групп
- **Производительность:** Оптимизация запросов через правильный выбор ключей

### 1.2. Архитектурные решения

**Аутентификация:**
- Пользователи (User) управляются через AWS Cognito User Pools
- JWT токены выдаются Cognito
- Дополнительные метаданные пользователей хранятся в DynamoDB

**Авторизация:**
- Роли определены через Cognito Groups (TEACHER, ADMIN, SUPERADMIN)
- AppSync @auth директивы для контроля доступа
- Проверка прав в Server Actions

---

## 2. Главная диаграмма ERD

```mermaid
erDiagram
    User ||--o{ UserGrade : "teaches"
    User {
        string id PK
        string email UK
        string name
        enum role
        string photo
        boolean active
        datetime createdAt
        datetime updatedAt
    }
    
    Grade ||--o{ UserGrade : "has teachers"
    Grade ||--o{ AcademicYear : "has"
    Grade ||--o{ Pupil : "contains"
    Grade ||--o{ GradeEvent : "has events"
    Grade ||--|| GradeSettings : "has settings"
    Grade {
        string id PK
        string name
        string description
        int minAge
        int maxAge
        boolean active
        datetime createdAt
        datetime updatedAt
    }
    
    UserGrade {
        string id PK
        string userId FK
        string gradeId FK
        datetime assignedAt
        datetime createdAt
    }
    
    AcademicYear ||--o{ Lesson : "contains"
    AcademicYear {
        string id PK
        string gradeId FK
        string name
        date startDate
        date endDate
        enum status
        datetime createdAt
        datetime updatedAt
    }
    
    Lesson ||--o{ LessonGoldenVerse : "has verses"
    Lesson ||--o{ HomeworkCheck : "has checks"
    Lesson {
        string id PK
        string academicYearId FK
        string gradeId FK
        string teacherId FK
        string title
        string content
        date lessonDate
        int order
        datetime createdAt
        datetime updatedAt
    }
    
    Book ||--o{ GoldenVerse : "has verses"
    Book {
        string id PK
        string fullName
        string shortName
        string abbreviation
        string testament
        int order
        datetime createdAt
        datetime updatedAt
    }
    
    GoldenVerse ||--o{ LessonGoldenVerse : "used in lessons"
    GoldenVerse {
        string id PK
        string reference
        string bookId FK
        int chapter
        int verseStart
        int verseEnd
        string text
        datetime createdAt
        datetime updatedAt
    }
    
    LessonGoldenVerse {
        string id PK
        string lessonId FK
        string goldenVerseId FK
        int order
        datetime createdAt
    }
    
    Pupil ||--o{ HomeworkCheck : "has checks"
    Pupil ||--o{ PupilAchievement : "has achievements"
    Pupil ||--o{ FamilyMember : "belongs to family"
    Pupil {
        string id PK
        string gradeId FK
        string firstName
        string lastName
        string middleName
        date dateOfBirth
        string photo
        boolean active
        datetime createdAt
        datetime updatedAt
    }
    
    HomeworkCheck {
        string id PK
        string lessonId FK
        string pupilId FK
        int goldenVerse1Score
        int goldenVerse2Score
        int goldenVerse3Score
        int testScore
        int notebookScore
        boolean singing
        int points
        boolean hasHouse
        datetime createdAt
        datetime updatedAt
    }
    
    Achievement ||--o{ PupilAchievement : "awarded to pupils"
    Achievement {
        string id PK
        string name
        string description
        string icon
        string criteria
        datetime createdAt
        datetime updatedAt
    }
    
    PupilAchievement {
        string id PK
        string pupilId FK
        string achievementId FK
        datetime awardedAt
        datetime createdAt
    }
    
    User ||--o{ UserFamily : "has families"
    Family ||--o{ FamilyMember : "has members"
    Family ||--o{ UserFamily : "has parent users"
    Family {
        string id PK
        string name
        string phone
        string email
        string address
        string motherFirstName
        string motherLastName
        string motherMiddleName
        string motherPhone
        string fatherFirstName
        string fatherLastName
        string fatherMiddleName
        string fatherPhone
        datetime createdAt
        datetime updatedAt
    }
    
    FamilyMember {
        string id PK
        string familyId FK
        string pupilId FK
        datetime createdAt
    }
    
    UserFamily {
        string id PK
        string userId FK
        string familyId FK
        string phone
        datetime createdAt
    }
    
    GradeEvent {
        string id PK
        string gradeId FK
        enum eventType
        string title
        string description
        date eventDate
        datetime createdAt
        datetime updatedAt
    }
    
    GradeSettings {
        string id PK
        string gradeId FK
        boolean enableGoldenVerse
        boolean enableTest
        boolean enableNotebook
        boolean enableSinging
        int pointsGoldenVerse
        int pointsTest
        int pointsNotebook
        int pointsSinging
        string labelGoldenVerse
        string labelTest
        string labelNotebook
        string labelSinging
        datetime createdAt
        datetime updatedAt
    }
```

---

## 3. Детальное описание сущностей

### 3.1. User (Пользователи)

**Назначение:** Преподаватели и администраторы системы

**Хранение:**
- Основные данные (email, password): **AWS Cognito User Pool**
- Метаданные (photo, активность): **DynamoDB таблица Users**

**Таблица DynamoDB:** `Users`

| Поле | Тип | Описание | Ограничения |
|------|-----|----------|-------------|
| id | String (UUID) | Уникальный идентификатор (совпадает с Cognito sub) | PK |
| email | String | Email адрес (копия из Cognito) | UNIQUE |
| name | String | Полное имя пользователя | NOT NULL |
| role | String (Enum) | Роль: TEACHER, ADMIN, SUPERADMIN | NOT NULL |
| photo | String | URL аватара (S3) | Nullable |
| active | Boolean | Активен ли пользователь | DEFAULT true |
| createdAt | String (ISO 8601) | Дата создания | Auto-generated |
| updatedAt | String (ISO 8601) | Дата обновления | Auto-updated |

**DynamoDB Keys:**
- **Partition Key (PK):** `id`
- **Sort Key (SK):** Нет

**Global Secondary Indexes (GSI):**
- **GSI-1:** email (PK: email) — для поиска по email
- **GSI-2:** role-createdAt (PK: role, SK: createdAt) — для списков по роли

**Enum UserRole:**
- `TEACHER` — Преподаватель
- `ADMIN` — Администратор
- `SUPERADMIN` — Главный администратор
- `PARENT` — Родитель (Post-MVP)
- `PUPIL` — Ученик (Post-MVP)

**Связи:**
- `userGrades` → UserGrade[] (многие ко многим через UserGrade)
- Cognito User Pool (внешняя связь по id = sub)

**Бизнес-правила:**
- Email должен быть уникальным
- Роль TEACHER может создавать/редактировать уроки только в назначенных группах
- Роль ADMIN имеет полный доступ ко всем данным
- При деактивации (active = false) пользователь не может войти, но данные сохраняются

---

### 3.2. Grade (Группы учеников)

**Назначение:** Классы/группы в воскресной школе

**Таблица DynamoDB:** `Grades`

| Поле | Тип | Описание | Ограничения |
|------|-----|----------|-------------|
| id | String (UUID) | Уникальный идентификатор | PK |
| name | String | Название группы (например, "Младшая группа") | NOT NULL |
| description | String | Описание группы | Nullable |
| minAge | Number | Минимальный возраст учеников | Nullable |
| maxAge | Number | Максимальный возраст учеников | Nullable |
| active | Boolean | Активна ли группа | DEFAULT true |
| createdAt | String (ISO 8601) | Дата создания | Auto-generated |
| updatedAt | String (ISO 8601) | Дата обновления | Auto-updated |

**DynamoDB Keys:**
- **Partition Key (PK):** `id`
- **Sort Key (SK):** Нет

**Global Secondary Indexes (GSI):**
- **GSI-1:** active-createdAt (PK: active, SK: createdAt) — для списка активных групп

**Связи:**
- `teachers` → User[] (многие ко многим через UserGrade)
- `academicYears` → AcademicYear[] (один ко многим)
- `pupils` → Pupil[] (один ко многим)
- `events` → GradeEvent[] (один ко многим)
- `settings` → GradeSettings (один к одному)

**Бизнес-правила:**
- Группа должна иметь хотя бы одного назначенного преподавателя
- Перед удалением группы нужно перенести всех учеников в другие группы
- При деактивации группы (active = false) нельзя создавать новые уроки

---

### 3.3. UserGrade (Связь преподавателей и групп)

**Назначение:** Таблица связи многие-ко-многим между User и Grade

**Таблица DynamoDB:** `UserGrades`

| Поле | Тип | Описание | Ограничения |
|------|-----|----------|-------------|
| id | String (UUID) | Уникальный идентификатор | PK |
| userId | String | ID преподавателя | FK → Users.id |
| gradeId | String | ID группы | FK → Grades.id |
| assignedAt | String (ISO 8601) | Дата назначения | Auto-generated |
| createdAt | String (ISO 8601) | Дата создания записи | Auto-generated |

**DynamoDB Keys:**
- **Partition Key (PK):** `id`
- **Sort Key (SK):** Нет

**Global Secondary Indexes (GSI):**
- **GSI-1:** userId (PK: userId) — для получения всех групп преподавателя
- **GSI-2:** gradeId (PK: gradeId) — для получения всех преподавателей группы

**Бизнес-правила:**
- Уникальная пара (userId, gradeId) — один преподаватель не может быть назначен на группу дважды
- При удалении преподавателя или группы, связи удаляются (CASCADE)

---

### 3.4. AcademicYear (Учебные годы)

**Назначение:** Учебные годы для каждой группы

**Таблица DynamoDB:** `AcademicYears`

| Поле | Тип | Описание | Ограничения |
|------|-----|----------|-------------|
| id | String (UUID) | Уникальный идентификатор | PK |
| gradeId | String | ID группы | FK → Grades.id |
| name | String | Название года (например, "2024-2025") | NOT NULL |
| startDate | String (ISO 8601 Date) | Дата начала | NOT NULL |
| endDate | String (ISO 8601 Date) | Дата окончания | NOT NULL |
| status | String (Enum) | Статус года: ACTIVE, FINISHED | DEFAULT ACTIVE |
| createdAt | String (ISO 8601) | Дата создания | Auto-generated |
| updatedAt | String (ISO 8601) | Дата обновления | Auto-updated |

**DynamoDB Keys:**
- **Partition Key (PK):** `id`
- **Sort Key (SK):** Нет

**Global Secondary Indexes (GSI):**
- **GSI-1:** gradeId-startDate (PK: gradeId, SK: startDate) — для списка годов группы
- **GSI-2:** status-gradeId (PK: status, SK: gradeId) — для получения активных годов

**Enum AcademicYearStatus:**
- `ACTIVE` — Активный (текущий учебный год)
- `FINISHED` — Завершен

**Связи:**
- `grade` → Grade (многие к одному)
- `lessons` → Lesson[] (один ко многим)

**Бизнес-правила:**
- ✅ **КРИТИЧНО:** Уроки могут создаваться только для ACTIVE учебного года
- Только один ACTIVE год на группу одновременно
- При завершении года (Admin → "Завершить учебный год") статус меняется на FINISHED
- Даты не должны пересекаться для годов одной группы

---

### 3.5. Lesson (Уроки)

**Назначение:** Уроки в рамках учебного года

**Таблица DynamoDB:** `Lessons`

| Поле | Тип | Описание | Ограничения |
|------|-----|----------|-------------|
| id | String (UUID) | Уникальный идентификатор | PK |
| academicYearId | String | ID учебного года | FK → AcademicYears.id |
| gradeId | String | ID группы (денормализация) | FK → Grades.id |
| teacherId | String | ID создавшего преподавателя | FK → Users.id |
| title | String | Тема урока | NOT NULL, min 3 chars |
| content | String | Описание урока (JSON от BlockNote) | Nullable |
| lessonDate | String (ISO 8601 Date) | Дата проведения урока | NOT NULL |
| order | Number | Порядковый номер урока в году | Auto-generated |
| createdAt | String (ISO 8601) | Дата создания | Auto-generated |
| updatedAt | String (ISO 8601) | Дата обновления | Auto-updated |

**DynamoDB Keys:**
- **Partition Key (PK):** `id`
- **Sort Key (SK):** Нет

**Global Secondary Indexes (GSI):**
- **GSI-1:** academicYearId-lessonDate (PK: academicYearId, SK: lessonDate) — для списка уроков года
- **GSI-2:** gradeId-lessonDate (PK: gradeId, SK: lessonDate) — для списка уроков группы
- **GSI-3:** teacherId-createdAt (PK: teacherId, SK: createdAt) — для уроков преподавателя

**Связи:**
- `academicYear` → AcademicYear (многие к одному)
- `grade` → Grade (многие к одному)
- `teacher` → User (многие к одному)
- `goldenVerses` → GoldenVerse[] (многие ко многим через LessonGoldenVerse)
- `homeworkChecks` → HomeworkCheck[] (один ко многим)

**Бизнес-правила:**
- Урок создается только для ACTIVE учебного года
- Teacher может создавать уроки только в своих группах
- Admin может создавать уроки в любых группах
- Должен быть выбран хотя бы один золотой стих (минимум 1)
- При удалении урока удаляются все связанные HomeworkChecks (CASCADE)

---

### 3.6. Book (Книги Библии)

**Назначение:** Книги Библии (Ветхий и Новый Завет)

**Таблица DynamoDB:** `Books`

| Поле | Тип | Описание | Ограничения |
|------|-----|----------|-------------|
| id | String (UUID) | Уникальный идентификатор | PK |
| fullName | String | Полное название (например, "Евангелие от Иоанна") | NOT NULL |
| shortName | String | Сокращенное название (например, "Иоанна") | NOT NULL, UNIQUE |
| abbreviation | String | Аббревиатура (например, "Ин") | NOT NULL |
| testament | String (Enum) | Завет: OLD \| NEW | NOT NULL |
| order | Number | Порядок в Библии (1-66) | NOT NULL |
| createdAt | String (ISO 8601) | Дата создания | Auto-generated |
| updatedAt | String (ISO 8601) | Дата обновления | Auto-updated |

**DynamoDB Keys:**
- **Partition Key (PK):** `id`
- **Sort Key (SK):** Нет

**Global Secondary Indexes (GSI):**
- **GSI-1:** shortName (PK: shortName) — для поиска по сокращенному названию
- **GSI-2:** testament-order (PK: testament, SK: order) — для списка книг по завету

**Enum Testament:**
- `OLD` — Ветхий Завет (39 книг)
- `NEW` — Новый Завет (27 книг)

**Связи:**
- `goldenVerses` → GoldenVerse[] (один ко многим)

**Бизнес-правила:**
- Всего 66 книг Библии (39 Ветхий Завет + 27 Новый Завет)
- shortName должен быть уникальным
- order определяет порядок книг в Библии (1-66)
- Таблица заполняется один раз при инициализации базы данных
- Книги не удаляются после создания (только чтение)

---

### 3.7. GoldenVerse (Золотые стихи)

**Назначение:** Библейские стихи для запоминания

**Таблица DynamoDB:** `GoldenVerses`

| Поле | Тип | Описание | Ограничения |
|------|-----|----------|-------------|
| id | String (UUID) | Уникальный идентификатор | PK |
| reference | String | Ссылка (например, "Иоанна 3:16") | UNIQUE, NOT NULL |
| bookId | String (UUID) | ID книги Библии | FK → Books.id, NOT NULL |
| chapter | Number | Номер главы | NOT NULL |
| verseStart | Number | Начальный стих | NOT NULL |
| verseEnd | Number | Конечный стих (если диапазон) | Nullable |
| text | String | Текст стиха | NOT NULL |
| createdAt | String (ISO 8601) | Дата добавления | Auto-generated |
| updatedAt | String (ISO 8601) | Дата обновления | Auto-updated |

**DynamoDB Keys:**
- **Partition Key (PK):** `id`
- **Sort Key (SK):** Нет

**Global Secondary Indexes (GSI):**
- **GSI-1:** reference (PK: reference) — для поиска по ссылке
- **GSI-2:** bookId-chapter (PK: bookId, SK: chapter) — для фильтрации по книге

**Связи:**
- `book` → Book (многие к одному)
- `lessons` → Lesson[] (многие ко многим через LessonGoldenVerse)

**Бизнес-правила:**
- reference должна быть уникальной (например, "Иоанна 3:16")
- Если диапазон стихов, verseEnd > verseStart
- Нельзя удалить стих, если он используется в уроках (проверка перед удалением)

---

### 3.8. LessonGoldenVerse (Связь уроков и стихов)

**Назначение:** Таблица связи многие-ко-многим между Lesson и GoldenVerse

**Таблица DynamoDB:** `LessonGoldenVerses`

| Поле | Тип | Описание | Ограничения |
|------|-----|----------|-------------|
| id | String (UUID) | Уникальный идентификатор | PK |
| lessonId | String | ID урока | FK → Lessons.id |
| goldenVerseId | String | ID золотого стиха | FK → GoldenVerses.id |
| order | Number | Порядок стиха в уроке | NOT NULL |
| createdAt | String (ISO 8601) | Дата добавления | Auto-generated |

**DynamoDB Keys:**
- **Partition Key (PK):** `id`
- **Sort Key (SK):** Нет

**Global Secondary Indexes (GSI):**
- **GSI-1:** lessonId-order (PK: lessonId, SK: order) — для списка стихов урока
- **GSI-2:** goldenVerseId (PK: goldenVerseId) — для статистики использования стиха, аналитики сложности стихов
- **Опционально (Post-MVP): GSI-3:** academicYearId-goldenVerseId (PK: academicYearId, SK: goldenVerseId) — оптимизация для получения списка стихов группы за учебный год (требует денормализации academicYearId)

**Бизнес-правила:**
- Уникальная пара (lessonId, goldenVerseId) — один стих не может быть добавлен в урок дважды
- order начинается с 1 для каждого урока
- При удалении урока или стиха, связи удаляются (CASCADE)

**Использование для аналитики:**
- GSI-2 используется для получения всех использований конкретного стиха (аналитика сложности)
- GSI-1 используется для получения стихов урока при анализе проверок ДЗ

---

### 3.8. Pupil (Ученики)

**Назначение:** Ученики воскресной школы

**Таблица DynamoDB:** `Pupils`

| Поле | Тип | Описание | Ограничения |
|------|-----|----------|-------------|
| id | String (UUID) | Уникальный идентификатор | PK |
| gradeId | String | ID группы | FK → Grades.id |
| firstName | String | Имя | NOT NULL, min 2 chars |
| lastName | String | Фамилия | NOT NULL, min 2 chars |
| middleName | String | Отчество | Nullable |
| dateOfBirth | String (ISO 8601 Date) | Дата рождения | NOT NULL |
| photo | String | URL фото (S3) | Nullable |
| active | Boolean | Активен ли ученик | DEFAULT true |
| createdAt | String (ISO 8601) | Дата создания | Auto-generated |
| updatedAt | String (ISO 8601) | Дата обновления | Auto-updated |

**DynamoDB Keys:**
- **Partition Key (PK):** `id`
- **Sort Key (SK):** Нет

**Global Secondary Indexes (GSI):**
- **GSI-1:** gradeId-lastName (PK: gradeId, SK: lastName) — для списка учеников группы
- **GSI-2:** active-gradeId (PK: active, SK: gradeId) — для фильтрации активных учеников

**Связи:**
- `grade` → Grade (многие к одному)
- `homeworkChecks` → HomeworkCheck[] (один ко многим)
- `achievements` → Achievement[] (многие ко многим через PupilAchievement)
- `families` → Family[] (многие ко многим через FamilyMember)

**Бизнес-правила:**
- Ученик может принадлежать только одной группе одновременно
- При переносе в другую группу изменяется gradeId
- При деактивации (active = false) ученик не отображается в списках, но история сохраняется
- Нельзя удалить ученика, если есть HomeworkChecks (только деактивация)

---

### 3.9. HomeworkCheck (Проверка домашних заданий)

**Назначение:** Результаты проверки ДЗ учеников за урок

**Таблица DynamoDB:** `HomeworkChecks`

| Поле | Тип | Описание | Ограничения |
|------|-----|----------|-------------|
| id | String (UUID) | Уникальный идентификатор | PK |
| lessonId | String | ID урока | FK → Lessons.id |
| pupilId | String | ID ученика | FK → Pupils.id |
| gradeId | String | ID группы (денормализация) | FK → Grades.id, NOT NULL |
| goldenVerse1Score | Number | Баллы за первый золотой стих (0-2) | Nullable |
| goldenVerse2Score | Number | Баллы за второй золотой стих (0-2) | Nullable |
| goldenVerse3Score | Number | Баллы за третий золотой стих (0-2) | Nullable |
| testScore | Number | Баллы за тест (0-10) | Nullable |
| notebookScore | Number | Баллы за тетрадь (0-10) | Nullable |
| singing | Boolean | Был на спевке | DEFAULT false |
| points | Number | Баллы за урок (вычисляется автоматически) | DEFAULT 0 |
| hasHouse | Boolean | Получил домик (вычисляется автоматически) | AUTO |
| createdAt | String (ISO 8601) | Дата создания | Auto-generated |
| updatedAt | String (ISO 8601) | Дата обновления | Auto-updated |

**DynamoDB Keys:**
- **Partition Key (PK):** `id`
- **Sort Key (SK):** Нет

**Global Secondary Indexes (GSI):**
- **GSI-1:** lessonId-pupilId (PK: lessonId, SK: pupilId) — для проверок урока
- **GSI-2:** pupilId-createdAt (PK: pupilId, SK: createdAt) — для истории ученика
- **GSI-3:** gradeId-createdAt (PK: gradeId, SK: createdAt) — для аналитики группы (Post-MVP, создается на этапе MVP)

**Денормализация:**
- Поле `gradeId` хранится в HomeworkCheck для поддержки GSI-3 (аналитика), хотя есть через Lesson.gradeId. Это позволяет эффективно запрашивать историю успеваемости группы без дополнительных запросов к таблице Lessons.

**Связи:**
- `lesson` → Lesson (многие к одному)
- `pupil` → Pupil (многие к одному)
- `grade` → Grade (многие к одному, через денормализованное поле gradeId)

**Бизнес-правила:**
- ✅ **КРИТИЧНО:** Уникальная пара (lessonId, pupilId) — одна проверка на ученика за урок
- `points` рассчитываются автоматически как сумма всех компонентов
- Если ученик отсутствовал на уроке, все баллы = 0, `points = 0`
- При удалении урока или ученика, проверки удаляются (CASCADE)
- **Примечание:** Поле `hasHouse` устарело и будет удалено (заменено на систему кирпичиков)

**Расчет баллов:**
```typescript
points = 
  (goldenVerse1Score || 0) + 
  (goldenVerse2Score || 0) + 
  (goldenVerse3Score || 0) + 
  (testScore || 0) + 
  (notebookScore || 0) + 
  (singing ? gradeSettings.pointsSinging : 0);
```

---

### 3.10. Achievement (Достижения)

**Назначение:** Достижения (badges) для учеников

**Таблица DynamoDB:** `Achievements`

| Поле | Тип | Описание | Ограничения |
|------|-----|----------|-------------|
| id | String (UUID) | Уникальный идентификатор | PK |
| name | String | Название достижения | NOT NULL, UNIQUE |
| description | String | Описание достижения | NOT NULL |
| icon | String | Emoji или URL иконки | Nullable |
| criteria | String | Критерии получения (JSON) | NOT NULL |
| createdAt | String (ISO 8601) | Дата создания | Auto-generated |
| updatedAt | String (ISO 8601) | Дата обновления | Auto-updated |

**DynamoDB Keys:**
- **Partition Key (PK):** `id`
- **Sort Key (SK):** Нет

**Global Secondary Indexes (GSI):**
- **GSI-1:** name (PK: name) — для поиска по названию

**Связи:**
- `pupils` → Pupil[] (многие ко многим через PupilAchievement)

**Примеры достижений:**
- "Отличник" — 10 домиков подряд
- "Постоянный ученик" — посещение 30 уроков подряд
- "Знаток Писания" — выучено 50 золотых стихов

**Бизнес-правила:**
- name должно быть уникальным
- criteria хранится в JSON формате для гибкости проверки

---

### 3.11. PupilAchievement (Связь учеников и достижений)

**Назначение:** Таблица связи многие-ко-многим между Pupil и Achievement

**Таблица DynamoDB:** `PupilAchievements`

| Поле | Тип | Описание | Ограничения |
|------|-----|----------|-------------|
| id | String (UUID) | Уникальный идентификатор | PK |
| pupilId | String | ID ученика | FK → Pupils.id |
| achievementId | String | ID достижения | FK → Achievements.id |
| awardedAt | String (ISO 8601) | Дата получения достижения | Auto-generated |
| createdAt | String (ISO 8601) | Дата создания записи | Auto-generated |

**DynamoDB Keys:**
- **Partition Key (PK):** `id`
- **Sort Key (SK):** Нет

**Global Secondary Indexes (GSI):**
- **GSI-1:** pupilId-awardedAt (PK: pupilId, SK: awardedAt) — для достижений ученика
- **GSI-2:** achievementId (PK: achievementId) — для статистики достижения

**Бизнес-правила:**
- Уникальная пара (pupilId, achievementId) — достижение можно получить только один раз
- awardedAt определяет момент получения (важно для хронологии)

---

### 3.12. Family (Семьи)

**Назначение:** Семьи учеников с информацией о родителях

**Таблица DynamoDB:** `Families`

| Поле | Тип | Описание | Ограничения |
|------|-----|----------|-------------|
| id | String (UUID) | Уникальный идентификатор | PK |
| name | String | Фамилия семьи | NOT NULL |
| phone | String | Телефон контактного лица | Nullable |
| email | String | Email семьи | Nullable |
| address | String | Адрес (опционально) | Nullable |
| motherFirstName | String | Имя матери | Nullable |
| motherLastName | String | Фамилия матери | Nullable |
| motherMiddleName | String | Отчество матери | Nullable |
| motherPhone | String | Телефон матери | Nullable |
| fatherFirstName | String | Имя отца | Nullable |
| fatherLastName | String | Фамилия отца | Nullable |
| fatherMiddleName | String | Отчество отца | Nullable |
| fatherPhone | String | Телефон отца | Nullable |
| createdAt | String (ISO 8601) | Дата создания | Auto-generated |
| updatedAt | String (ISO 8601) | Дата обновления | Auto-updated |

**DynamoDB Keys:**
- **Partition Key (PK):** `id`
- **Sort Key (SK):** Нет

**Global Secondary Indexes (GSI):**
- **GSI-1:** motherPhone (PK: motherPhone) — для поиска семьи по телефону матери (для связи с PARENT)
- **GSI-2:** fatherPhone (PK: fatherPhone) — для поиска семьи по телефону отца (для связи с PARENT)

**Связи:**
- `members` → Pupil[] (многие ко многим через FamilyMember)
- `userFamilies` → UserFamily[] (многие ко многим через UserFamily)

**Бизнес-правила:**
- Ученик может принадлежать только одной семье (через FamilyMember)
- Телефоны матери и отца используются для связи с пользователями с ролью PARENT (Post-MVP функционал)
- При регистрации пользователя PARENT вводится номер телефона, и система ищет соответствующую семью по полям motherPhone или fatherPhone

---

### 3.13. FamilyMember (Члены семей)

**Назначение:** Таблица связи многие-ко-многим между Family и Pupil

**Таблица DynamoDB:** `FamilyMembers`

| Поле | Тип | Описание | Ограничения |
|------|-----|----------|-------------|
| id | String (UUID) | Уникальный идентификатор | PK |
| familyId | String | ID семьи | FK → Families.id |
| pupilId | String | ID ученика | FK → Pupils.id |
| createdAt | String (ISO 8601) | Дата добавления | Auto-generated |

**DynamoDB Keys:**
- **Partition Key (PK):** `id`
- **Sort Key (SK):** Нет

**Global Secondary Indexes (GSI):**
- **GSI-1:** familyId (PK: familyId) — для членов семьи
- **GSI-2:** pupilId (PK: pupilId) — для семей ученика

**Бизнес-правила:**
- Уникальная пара (familyId, pupilId) — ученик не может быть добавлен в семью дважды

---

### 3.13a. UserFamily (Связь пользователей PARENT с семьями)

**Назначение:** Связь пользователей с ролью PARENT с семьями учеников

**Таблица DynamoDB:** `UserFamilies`

| Поле | Тип | Описание | Ограничения |
|------|-----|----------|-------------|
| id | String (UUID) | Уникальный идентификатор | PK |
| userId | String | ID пользователя (PARENT) | FK → Users.id |
| familyId | String | ID семьи | FK → Families.id |
| phone | String | Номер телефона, использованный для связи | NOT NULL |
| createdAt | String (ISO 8601) | Дата создания | Auto-generated |

**DynamoDB Keys:**
- **Partition Key (PK):** `id`
- **Sort Key (SK):** Нет

**Global Secondary Indexes (GSI):**
- **GSI-1:** userId (PK: userId) — для получения всех семей пользователя PARENT
- **GSI-2:** familyId (PK: familyId) — для получения всех пользователей PARENT, связанных с семьей
- **GSI-3:** phone (PK: phone) — для поиска связи по номеру телефона (для проверки при регистрации)

**Связи:**
- `user` → User (многие к одному)
- `family` → Family (многие к одному)

**Бизнес-правила:**
- Связь создается при регистрации пользователя с ролью PARENT
- При регистрации пользователь вводит номер телефона
- Система ищет семью, где `motherPhone` или `fatherPhone` совпадает с введенным номером
- Если семья найдена, создается связь UserFamily
- Один пользователь PARENT может быть связан с несколькими семьями (если у него несколько детей в разных семьях)
- Одна семья может быть связана с несколькими пользователями PARENT (мать и отец)
- **Важно:** Это Post-MVP функционал, но структура базы данных создается на этапе MVP для будущей реализации

---

### 3.14. GradeEvent (События в расписании)

**Назначение:** События в календаре группы (уроки, мероприятия, отмены)

**Таблица DynamoDB:** `GradeEvents`

| Поле | Тип | Описание | Ограничения |
|------|-----|----------|-------------|
| id | String (UUID) | Уникальный идентификатор | PK |
| gradeId | String | ID группы | FK → Grades.id |
| eventType | String (Enum) | Тип события | NOT NULL |
| title | String | Название события | NOT NULL |
| description | String | Описание события | Nullable |
| eventDate | String (ISO 8601 Date) | Дата события | NOT NULL |
| createdAt | String (ISO 8601) | Дата создания | Auto-generated |
| updatedAt | String (ISO 8601) | Дата обновления | Auto-updated |

**DynamoDB Keys:**
- **Partition Key (PK):** `id`
- **Sort Key (SK):** Нет

**Global Secondary Indexes (GSI):**
- **GSI-1:** gradeId-eventDate (PK: gradeId, SK: eventDate) — для календаря группы

**Enum GradeEventType:**
- `LESSON` — Обычный урок (🔵 синий)
- `OUTDOOR_EVENT` — Выездное мероприятие (🟢 зеленый)
- `LESSON_SKIPPING` — Отмена урока (🔴 красный)

**Связи:**
- `grade` → Grade (многие к одному)

**Бизнес-правила:**
- Событие типа LESSON может быть связано с реальным Lesson (опционально)
- Календарь показывает события за выбранный месяц/период

---

### 3.15. GradeSettings (Настройки оценивания группы)

**Назначение:** Настройки параметров оценивания для каждой группы

**Таблица DynamoDB:** `GradeSettings`

| Поле | Тип | Описание | Ограничения |
|------|-----|----------|-------------|
| id | String (UUID) | Уникальный идентификатор | PK |
| gradeId | String | ID группы | FK → Grades.id, UNIQUE |
| enableGoldenVerse | Boolean | Использовать золотые стихи | DEFAULT true |
| enableTest | Boolean | Использовать тест | DEFAULT true |
| enableNotebook | Boolean | Использовать тетрадь | DEFAULT true |
| enableSinging | Boolean | Использовать спевку | DEFAULT true |
| pointsGoldenVerse | Number | Баллы за золотой стих | DEFAULT 10 |
| pointsTest | Number | Баллы за тест | DEFAULT 10 |
| pointsNotebook | Number | Баллы за тетрадь | DEFAULT 10 |
| pointsSinging | Number | Баллы за спевку | DEFAULT 10 |
| labelGoldenVerse | String | Кастомная метка для стихов | DEFAULT "Золотые стихи" |
| labelTest | String | Кастомная метка для теста | DEFAULT "Тест" |
| labelNotebook | String | Кастомная метка для тетради | DEFAULT "Тетрадь" |
| labelSinging | String | Кастомная метка для спевки | DEFAULT "Спевка" |
| createdAt | String (ISO 8601) | Дата создания | Auto-generated |
| updatedAt | String (ISO 8601) | Дата обновления | Auto-updated |

**DynamoDB Keys:**
- **Partition Key (PK):** `id`
- **Sort Key (SK):** Нет

**Global Secondary Indexes (GSI):**
- **GSI-1:** gradeId (PK: gradeId) — для быстрого доступа по группе

**Связи:**
- `grade` → Grade (один к одному)

**Бизнес-правила:**
- Каждая группа имеет ровно одну запись GradeSettings
- При создании группы автоматически создаются настройки с дефолтными значениями
- Изменение баллов не пересчитывает старые HomeworkChecks (только новые)
- Отключение параметра (enable = false) скрывает его в форме проверки ДЗ

---

## 4. Диаграммы по доменам

### 4.1. Домен: Users & Authentication

```mermaid
erDiagram
    User ||--o{ UserGrade : "teaches"
    Grade ||--o{ UserGrade : "has teachers"
    
    User {
        string id PK
        string email
        string name
        enum role
    }
    
    UserGrade {
        string id PK
        string userId FK
        string gradeId FK
    }
    
    Grade {
        string id PK
        string name
    }
```

### 4.2. Домен: Lessons & Academic Years

```mermaid
erDiagram
    Grade ||--o{ AcademicYear : "has"
    AcademicYear ||--o{ Lesson : "contains"
    Lesson ||--o{ LessonGoldenVerse : "has verses"
    Book ||--o{ GoldenVerse : "has verses"
    GoldenVerse ||--o{ LessonGoldenVerse : "used in"
    
    AcademicYear {
        string id PK
        string gradeId FK
        enum status
    }
    
    Lesson {
        string id PK
        string academicYearId FK
        string title
        date lessonDate
    }
    
    Book {
        string id PK
        string fullName
        string shortName
        string abbreviation
    }
    
    GoldenVerse {
        string id PK
        string bookId FK
        string reference
        string text
    }
```

### 4.3. Домен: Pupils & Homework

```mermaid
erDiagram
    Grade ||--o{ Pupil : "contains"
    Grade ||--o{ HomeworkCheck : "has checks"
    Pupil ||--o{ HomeworkCheck : "has checks"
    Lesson ||--o{ HomeworkCheck : "has checks"
    
    Pupil {
        string id PK
        string gradeId FK
        string firstName
        string lastName
    }
    
    HomeworkCheck {
        string id PK
        string lessonId FK
        string pupilId FK
        string gradeId FK
        boolean goldenVerse
        boolean test
        boolean notebook
        boolean singing
        int points
        boolean hasHouse
    }
```

### 4.4. Домен: Achievements

```mermaid
erDiagram
    Pupil ||--o{ PupilAchievement : "has achievements"
    Achievement ||--o{ PupilAchievement : "awarded to"
    
    Achievement {
        string id PK
        string name
        string description
        string criteria
    }
    
    PupilAchievement {
        string id PK
        string pupilId FK
        string achievementId FK
        datetime awardedAt
    }
```

---

## 5. Бизнес-правила

### 5.1. Правила создания уроков

1. ✅ **Урок создается только для ACTIVE учебного года**
   - Проверка в Server Action перед созданием
   - Если нет ACTIVE года, показать ошибку

2. ✅ **Teacher может создавать уроки только в своих группах**
   - Проверка через UserGrade связь
   - Admin может создавать везде

3. ✅ **Урок должен иметь минимум 1 золотой стих**
   - Валидация через Zod schema
   - Связь через LessonGoldenVerse

### 5.2. Правила проверки ДЗ

1. ✅ **Одна проверка на пару (Lesson, Pupil)**
   - Уникальность контролируется на уровне Server Action
   - При повторном сохранении — UPDATE, а не CREATE

2. ✅ **Автоматический расчет hasHouse**
   ```typescript
   hasHouse = goldenVerse && test && notebook && singing
   ```

3. ✅ **Автоматический расчет points**
   - На основе GradeSettings группы
   - Сумма баллов за выполненные параметры

### 5.3. Правила учебных годов

1. ✅ **Только один ACTIVE год на группу**
   - При создании нового года нужно завершить предыдущий
   - Admin функция "Завершить учебный год" меняет все ACTIVE → FINISHED

2. ✅ **Даты годов не пересекаются**
   - Валидация при создании нового года
   - startDate нового года > endDate предыдущего

### 5.4. Правила учеников

1. ✅ **Ученик принадлежит только одной группе**
   - При переносе — изменение gradeId
   - История HomeworkChecks сохраняется

2. ✅ **Деактивация вместо удаления**
   - При active = false ученик скрывается из списков
   - История полностью сохраняется

### 5.5. Правила групп

1. ✅ **Группа должна иметь хотя бы одного преподавателя**
   - Проверка при удалении связи UserGrade
   - Предупреждение Admin

2. ✅ **При создании группы создаются GradeSettings**
   - Автоматически с дефолтными значениями
   - Связь один к одному

---

## 6. Индексы и оптимизация

### 6.1. Часто запрашиваемые данные

**Список уроков группы:**
```
GSI: gradeId-lessonDate на таблице Lessons
```

**Список учеников группы:**
```
GSI: gradeId-lastName на таблице Pupils
```

**История ученика:**
```
GSI: pupilId-createdAt на таблице HomeworkChecks
```

**Проверки ДЗ для урока:**
```
GSI: lessonId-pupilId на таблице HomeworkChecks
```

**История успеваемости группы (аналитика):**
```
GSI-3: gradeId-createdAt на таблице HomeworkChecks
```

**Золотые стихи группы за учебный год:**
```
GSI-1: academicYearId-lessonDate на таблице Lessons
GSI-1: lessonId-order на таблице LessonGoldenVerses
Batch Get для GoldenVerses
```

**Аналитика сложности золотых стихов:**
```
GSI-3: gradeId-createdAt на таблице HomeworkChecks
GSI-1: lessonId-order на таблице LessonGoldenVerses
GSI-2: goldenVerseId на таблице LessonGoldenVerses
Агрегация на клиенте
```

### 6.2. Стратегии для быстрых запросов

1. **Использовать Query вместо Scan:**
   - Всегда используем GSI для фильтрации
   - Scan только для маленьких таблиц (Achievements, GradeSettings)

2. **Денормализация где нужно:**
   - gradeId в Lesson (хотя есть через AcademicYear)
   - gradeId в HomeworkCheck (хотя есть через Lesson, необходимо для GSI-3 аналитики)
   - Имя ученика можно добавить в HomeworkCheck для быстрого отображения (не реализовано в MVP)

3. **Batch операции:**
   - BatchGetItem для загрузки нескольких учеников
   - BatchWriteItem для массовой проверки ДЗ
   - BatchGetItem для получения золотых стихов (AP-25)

### 6.3. Access Patterns для аналитики

#### 6.3.1. Золотые стихи группы за учебный год (AP-25)

**Описание:** Получить список всех золотых стихов с ссылками на места в Библии и текстом стиха, которые учили в конкретной группе в конкретном учебном году.

**Используемые таблицы и GSI:**
- `Lessons` — GSI-1: academicYearId-lessonDate (получение уроков года)
- `LessonGoldenVerses` — GSI-1: lessonId-order (получение стихов каждого урока)
- `GoldenVerses` — Batch Get (получение данных стихов)

**Алгоритм:**
1. Query Lessons по academicYearId (GSI-1)
2. Для каждого урока Query LessonGoldenVerses (GSI-1)
3. Дедупликация goldenVerseId
4. Batch Get GoldenVerses

**Результат:** Список уникальных стихов с reference, text, bookId

#### 6.3.2. Баллы ученика за учебный год (AP-30)

**Описание:** Получить все баллы по каждому показателю за конкретный учебный год, отчет должен включать информацию о посещаемости занятий и спевок.

**Используемые таблицы и GSI:**
- `HomeworkChecks` — GSI-2: pupilId-createdAt (история ученика)
- `AcademicYears` — получение startDate и endDate

**Алгоритм:**
1. Получить AcademicYear для получения дат
2. Query HomeworkChecks по pupilId с фильтрацией по датам учебного года (GSI-2)
3. Агрегация на клиенте: totalPoints, lessonsCount, lessonsAttended, attendanceRate, goldenVerseTotal, testTotal, notebookTotal, singingCount

**Результат:** Агрегированная статистика с посещаемостью и спевками

#### 6.3.3. Баллы ученика за период дат (AP-31)

**Описание:** Получить все баллы по каждому показателю за указанный период дат, отчет должен включать информацию о посещаемости занятий и спевок.

**Используемые таблицы и GSI:**
- `HomeworkChecks` — GSI-2: pupilId-createdAt (история ученика)

**Алгоритм:**
1. Query HomeworkChecks по pupilId с фильтрацией по указанным датам (GSI-2)
2. Агрегация на клиенте (аналогично AP-30)

**Результат:** Агрегированная статистика за период с посещаемостью и спевками

#### 6.3.4. Аналитика сложности золотых стихов (AP-ANALYTICS-7)

**Описание:** Определить, какие стихи легкие для детей (больше детей получило максимальное количество баллов), а какие сложные.

**Используемые таблицы и GSI:**
- `HomeworkChecks` — GSI-3: gradeId-createdAt (получение всех проверок группы)
- `Lessons` — получение уроков (опционально, если фильтруем по учебному году)
- `LessonGoldenVerses` — GSI-1: lessonId-order (получение стихов урока)
- `LessonGoldenVerses` — GSI-2: goldenVerseId (статистика использования стиха)

**Алгоритм:**
1. Query HomeworkChecks по gradeId за период (GSI-3)
2. Для каждой проверки получить Lesson
3. Для каждого Lesson получить LessonGoldenVerses (GSI-1)
4. Сопоставить баллы:
   - goldenVerse1Score с LessonGoldenVerse где order=1
   - goldenVerse2Score с LessonGoldenVerse где order=2
   - goldenVerse3Score с LessonGoldenVerse где order=3
5. Агрегировать статистику по goldenVerseId:
   - totalChecks, maxScoreCount, successRate, averageScore, difficultyLevel

**Результат:** Список стихов с метриками сложности (легкий/средний/сложный)

**Важно:** Все необходимые GSI для аналитики сложности стихов уже существуют, дополнительные индексы не требуются.

---

## Cross-reference

- См. также: [`docs/database/DYNAMODB_SCHEMA.md`](../database/DYNAMODB_SCHEMA.md) — детальная схема DynamoDB
- См. также: [`docs/database/GRAPHQL_SCHEMA.md`](../database/GRAPHQL_SCHEMA.md) — GraphQL типы и queries
- См. также: [`docs/database/DATA_MODELING.md`](../database/DATA_MODELING.md) — стратегии моделирования
- См. также: [`docs/architecture/ARCHITECTURE.md`](../architecture/ARCHITECTURE.md) — общая архитектура

---

**Версия:** 1.0  
**Последнее обновление:** 23 декабря 2025  
**Автор:** AI Documentation Team

