# DynamoDB Schema - Sunday School App

## Версия документа: 1.0
**Дата создания:** 23 декабря 2025  
**Последнее обновление:** 23 декабря 2025  
**Проект:** Sunday School App  
**Технологии:** AWS DynamoDB, AWS AppSync, AWS Amplify Gen 1  
**Billing Model:** Pay-per-request (On-Demand)

> [!NOTE]
> Документация основана на актуальных источниках:
> - DynamoDB Best Practices — AWS документация
> - AWS AppSync + DynamoDB — официальная документация AWS

---

## 1. Обзор DynamoDB в проекте

### 1.1. Почему DynamoDB

**Выбор DynamoDB обусловлен:**

✅ **Serverless архитектура:**
- Нет управления серверами
- Автоматическое масштабирование под нагрузку
- Высокая доступность (99.99% SLA)

✅ **Производительность:**
- Низкая latency (< 10ms для read/write)
- Predictable performance при любой нагрузке
- Built-in caching через DAX (опционально)

✅ **Экономичность для MVP:**
- Pay-per-request модель (платим только за использование)
- Нет минимальных затрат
- Free tier: 25 GB storage, 25 WCU/RCU

✅ **Интеграция с AWS:**
- Seamless integration с Amplify Gen 1
- Автоматическая генерация через Amplify CLI
- AppSync GraphQL API "из коробки"

✅ **Безопасность:**
- Encryption at rest (по умолчанию)
- Encryption in transit (TLS)
- Fine-grained access control через IAM

**Сравнение с альтернативами:**

| Характеристика | DynamoDB | PostgreSQL (RDS) | MongoDB Atlas |
|----------------|----------|------------------|---------------|
| Serverless | ✅ Полностью | ⚠️ Aurora Serverless | ✅ Да |
| Latency | < 10ms | 10-50ms | 10-30ms |
| Масштабирование | ✅ Автоматическое | ❌ Ручное | ✅ Автоматическое |
| Amplify интеграция | ✅ Отличная | ⚠️ Требует настройки | ❌ Нет |
| Стоимость MVP | $ Низкая | $$ Средняя | $$ Средняя |
| Управление | ✅ Минимальное | ❌ Требует настройки | ⚠️ Среднее |

### 1.2. Особенности NoSQL vs SQL

**Ключевые отличия:**

| Аспект | SQL (PostgreSQL) | NoSQL (DynamoDB) |
|--------|------------------|------------------|
| Schema | Rigid (fixed schema) | Flexible (schemaless) |
| Queries | Мощный SQL | Key-based queries |
| Joins | ✅ Поддерживаются | ❌ Денормализация |
| Transactions | ✅ ACID | ✅ Limited ACID |
| Indexing | Множество индексов | PK/SK + GSI/LSI |
| Scaling | Vertical (сложно) | Horizontal (просто) |

**Последствия для дизайна:**
- ❌ Нет JOINs → Денормализация данных где нужно
- ❌ Нет сложных запросов → Access patterns определяют дизайн
- ✅ Быстрые key-based queries → Правильный выбор ключей критичен
- ✅ Гибкая схема → Легко добавлять новые поля

### 1.3. Billing Model (Pay-per-request)

**Выбор для MVP:** On-Demand (Pay-per-request)

**Стоимость (US East):**
- **Write Request:** $1.25 за миллион запросов
- **Read Request:** $0.25 за миллион запросов
- **Storage:** $0.25 за GB/месяц

**Пример расчета для MVP:**
- 10,000 учеников, 50 преподавателей
- ~500,000 read requests/месяц
- ~100,000 write requests/месяц
- ~5 GB storage

**Стоимость:** ~$0.50/месяц (в рамках Free Tier бесплатно)

**Альтернатива:** Provisioned mode (если трафик предсказуем)
- Дешевле при постоянной высокой нагрузке
- Требует планирования WCU/RCU

---

## 2. Стратегия моделирования данных

### 2.1. Single Table Design vs Multiple Tables

**Выбор для Sunday School App:** **Multiple Tables Design**

**Обоснование:**

✅ **Преимущества Multiple Tables для MVP:**
- Простота разработки и понимания
- Amplify CLI автоматически создает таблицы из GraphQL schema
- Легко добавлять новые сущности
- Достаточная производительность для нашей нагрузки
- Проще отладка и мониторинг

❌ **Недостатки Single Table (почему НЕ выбрали):**
- Сложность проектирования (steep learning curve)
- Сложно адаптировать под изменения требований
- Amplify не поддерживает Single Table из коробки
- Избыточен для размера данных MVP

**Когда рассмотреть Single Table:**
- Если нагрузка превысит 10,000 req/sec
- Если нужны сложные транзакции между сущностями
- Если стоимость запросов станет критичной

### 2.2. Access Patterns определяют дизайн

**Принцип:** В DynamoDB дизайн таблиц основывается на том, **как** мы будем запрашивать данные, а не на том, **что** мы храним.

**Процесс проектирования:**
1. Определить все access patterns (что будем запрашивать)
2. Для каждого паттерна определить PK/SK или GSI
3. Оптимизировать схему для частых запросов
4. Добавить денормализацию где нужно

**Пример:**
```
Access Pattern: "Получить все уроки группы за учебный год, отсортированные по дате"

Решение:
- GSI: academicYearId-lessonDate
- PK: academicYearId
- SK: lessonDate
- Результат: Query в 1 запрос, отсортированный результат
```

---

## 3. Детальное описание таблиц

### 3.1. Таблица: Users

**Назначение:** Метаданные пользователей (дополняют Cognito)

**Primary Key:**
- **Partition Key (PK):** `id` (String)
- **Sort Key (SK):** Нет

**Атрибуты:**

| Атрибут | Тип | Описание | Обязательный |
|---------|-----|----------|--------------|
| id | String (UUID) | Cognito sub (уникальный ID) | ✅ |
| email | String | Email (копия из Cognito) | ✅ |
| name | String | Полное имя | ✅ |
| role | String | TEACHER \| ADMIN \| SUPERADMIN | ✅ |
| photo | String | S3 URL фото | ❌ |
| active | Boolean | Активен ли пользователь | ✅ (default: true) |
| createdAt | String (ISO 8601) | Дата создания | ✅ |
| updatedAt | String (ISO 8601) | Дата обновления | ✅ |

**Global Secondary Indexes:**

**GSI-1: email-index**
- **PK:** email (String)
- **SK:** Нет
- **Projection:** ALL
- **Use Case:** Поиск пользователя по email

**GSI-2: role-createdAt-index**
- **PK:** role (String)
- **SK:** createdAt (String)
- **Projection:** ALL
- **Use Case:** Список пользователей по роли

**Access Patterns:**

| # | Pattern | Index | Example |
|---|---------|-------|---------|
| 1 | Получить пользователя по ID | Primary Key | `Query(PK=userId)` |
| 2 | Найти пользователя по email | GSI-1 | `Query(GSI1PK=email)` |
| 3 | Список всех преподавателей | GSI-2 | `Query(GSI2PK="TEACHER")` |
| 4 | Список всех админов | GSI-2 | `Query(GSI2PK="ADMIN")` |

**Примерная запись:**

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "email": "maria.ivanova@church.com",
  "name": "Иванова Мария Владимировна",
  "role": "TEACHER",
  "photo": "https://s3.amazonaws.com/bucket/users/photo.jpg",
  "active": true,
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-01-15T10:30:00Z"
}
```

**Размер записи:** ~250 bytes

---

### 3.2. Таблица: Grades

**Назначение:** Группы учеников

**Primary Key:**
- **Partition Key (PK):** `id` (String)
- **Sort Key (SK):** Нет

**Атрибуты:**

| Атрибут | Тип | Описание | Обязательный |
|---------|-----|----------|--------------|
| id | String (UUID) | Уникальный ID группы | ✅ |
| name | String | Название группы | ✅ |
| description | String | Описание | ❌ |
| minAge | Number | Минимальный возраст | ❌ |
| maxAge | Number | Максимальный возраст | ❌ |
| active | Boolean | Активна ли группа | ✅ (default: true) |
| createdAt | String (ISO 8601) | Дата создания | ✅ |
| updatedAt | String (ISO 8601) | Дата обновления | ✅ |

**Global Secondary Indexes:**

**GSI-1: active-createdAt-index**
- **PK:** active (Boolean → String: "true"/"false")
- **SK:** createdAt (String)
- **Projection:** ALL
- **Use Case:** Список активных групп

**Access Patterns:**

| # | Pattern | Index | Example |
|---|---------|-------|---------|
| 1 | Получить группу по ID | Primary Key | `Query(PK=gradeId)` |
| 2 | Список всех групп | Scan | `Scan()` (таблица маленькая) |
| 3 | Список активных групп | GSI-1 | `Query(GSI1PK="true")` |

**Примерная запись:**

```json
{
  "id": "grade-123",
  "name": "Младшая группа (6-8 лет)",
  "description": "Группа для самых маленьких учеников",
  "minAge": 6,
  "maxAge": 8,
  "active": true,
  "createdAt": "2024-09-01T00:00:00Z",
  "updatedAt": "2024-09-01T00:00:00Z"
}
```

**Размер записи:** ~200 bytes

---

### 3.3. Таблица: UserGrades

**Назначение:** Связь многие-ко-многим между User и Grade

**Primary Key:**
- **Partition Key (PK):** `id` (String)
- **Sort Key (SK):** Нет

**Атрибуты:**

| Атрибут | Тип | Описание | Обязательный |
|---------|-----|----------|--------------|
| id | String (UUID) | Уникальный ID связи | ✅ |
| userId | String | ID преподавателя | ✅ |
| gradeId | String | ID группы | ✅ |
| assignedAt | String (ISO 8601) | Дата назначения | ✅ |
| createdAt | String (ISO 8601) | Дата создания | ✅ |

**Global Secondary Indexes:**

**GSI-1: userId-index**
- **PK:** userId (String)
- **SK:** Нет
- **Projection:** ALL
- **Use Case:** Все группы преподавателя

**GSI-2: gradeId-index**
- **PK:** gradeId (String)
- **SK:** Нет
- **Projection:** ALL
- **Use Case:** Все преподаватели группы

**Access Patterns:**

| # | Pattern | Index | Example |
|---|---------|-------|---------|
| 1 | Группы преподавателя | GSI-1 | `Query(GSI1PK=userId)` |
| 2 | Преподаватели группы | GSI-2 | `Query(GSI2PK=gradeId)` |
| 3 | Проверка доступа | GSI-1 + filter | `Query(GSI1PK=userId, filter: gradeId)` |

**Размер записи:** ~150 bytes

---

### 3.4. Таблица: AcademicYears

**Назначение:** Учебные годы для каждой группы

**Primary Key:**
- **Partition Key (PK):** `id` (String)
- **Sort Key (SK):** Нет

**Атрибуты:**

| Атрибут | Тип | Описание | Обязательный |
|---------|-----|----------|--------------|
| id | String (UUID) | Уникальный ID года | ✅ |
| gradeId | String | ID группы | ✅ |
| name | String | Название (2024-2025) | ✅ |
| startDate | String (ISO Date) | Дата начала | ✅ |
| endDate | String (ISO Date) | Дата окончания | ✅ |
| status | String | ACTIVE \| FINISHED | ✅ (default: ACTIVE) |
| createdAt | String (ISO 8601) | Дата создания | ✅ |
| updatedAt | String (ISO 8601) | Дата обновления | ✅ |

**Global Secondary Indexes:**

**GSI-1: gradeId-startDate-index**
- **PK:** gradeId (String)
- **SK:** startDate (String)
- **Projection:** ALL
- **Use Case:** Список годов группы (отсортированные)

**GSI-2: status-gradeId-index**
- **PK:** status (String)
- **SK:** gradeId (String)
- **Projection:** ALL
- **Use Case:** Все активные годы

**Access Patterns:**

| # | Pattern | Index | Example |
|---|---------|-------|---------|
| 1 | Получить год по ID | Primary Key | `Query(PK=yearId)` |
| 2 | Годы группы | GSI-1 | `Query(GSI1PK=gradeId)` |
| 3 | Активные годы | GSI-2 | `Query(GSI2PK="ACTIVE")` |
| 4 | Активный год группы | GSI-2 + filter | `Query(GSI2PK="ACTIVE", filter: gradeId)` |

**Примерная запись:**

```json
{
  "id": "year-456",
  "gradeId": "grade-123",
  "name": "2024-2025",
  "startDate": "2024-09-01",
  "endDate": "2025-05-31",
  "status": "ACTIVE",
  "createdAt": "2024-08-15T00:00:00Z",
  "updatedAt": "2024-08-15T00:00:00Z"
}
```

**Размер записи:** ~180 bytes

---

### 3.5. Таблица: Lessons

**Назначение:** Уроки в рамках учебного года

**Primary Key:**
- **Partition Key (PK):** `id` (String)
- **Sort Key (SK):** Нет

**Атрибуты:**

| Атрибут | Тип | Описание | Обязательный |
|---------|-----|----------|--------------|
| id | String (UUID) | Уникальный ID урока | ✅ |
| academicYearId | String | ID учебного года | ✅ |
| gradeId | String | ID группы (денормализация) | ✅ |
| teacherId | String | ID создавшего преподавателя | ✅ |
| title | String | Тема урока | ✅ |
| content | String | JSON от BlockNote | ❌ |
| lessonDate | String (ISO Date) | Дата проведения | ✅ |
| order | Number | Порядковый номер | ✅ |
| createdAt | String (ISO 8601) | Дата создания | ✅ |
| updatedAt | String (ISO 8601) | Дата обновления | ✅ |

**Global Secondary Indexes:**

**GSI-1: academicYearId-lessonDate-index**
- **PK:** academicYearId (String)
- **SK:** lessonDate (String)
- **Projection:** ALL
- **Use Case:** Список уроков года (отсортированные по дате)

**GSI-2: gradeId-lessonDate-index**
- **PK:** gradeId (String)
- **SK:** lessonDate (String)
- **Projection:** ALL
- **Use Case:** Список уроков группы

**GSI-3: teacherId-createdAt-index**
- **PK:** teacherId (String)
- **SK:** createdAt (String)
- **Projection:** KEYS_ONLY
- **Use Case:** Уроки созданные преподавателем

**Access Patterns:**

| # | Pattern | Index | Example |
|---|---------|-------|---------|
| 1 | Получить урок по ID | Primary Key | `Query(PK=lessonId)` |
| 2 | Уроки года | GSI-1 | `Query(GSI1PK=academicYearId)` |
| 3 | Уроки группы | GSI-2 | `Query(GSI2PK=gradeId)` |
| 4 | Уроки преподавателя | GSI-3 | `Query(GSI3PK=teacherId)` |

**Примерная запись:**

```json
{
  "id": "lesson-789",
  "academicYearId": "year-456",
  "gradeId": "grade-123",
  "teacherId": "user-abc",
  "title": "Сотворение мира",
  "content": "{\"type\":\"doc\",\"content\":[...]}",
  "lessonDate": "2024-09-08",
  "order": 1,
  "createdAt": "2024-09-01T10:00:00Z",
  "updatedAt": "2024-09-01T10:00:00Z"
}
```

**Размер записи:** ~300-500 bytes (зависит от content)

**Денормализация:** gradeId хранится в Lesson хотя есть через AcademicYear, чтобы избежать дополнительного запроса при фильтрации уроков группы.

---

### 3.6. Таблица: GoldenVerses

**Назначение:** Библейские стихи для запоминания

**Primary Key:**
- **Partition Key (PK):** `id` (String)
- **Sort Key (SK):** Нет

**Атрибуты:**

| Атрибут | Тип | Описание | Обязательный |
|---------|-----|----------|--------------|
| id | String (UUID) | Уникальный ID стиха | ✅ |
| reference | String | Ссылка (Иоанна 3:16) | ✅ (UNIQUE) |
| book | String | Книга Библии | ✅ |
| chapter | Number | Номер главы | ✅ |
| verseStart | Number | Начальный стих | ✅ |
| verseEnd | Number | Конечный стих | ❌ |
| text | String | Текст стиха | ✅ |
| createdAt | String (ISO 8601) | Дата добавления | ✅ |
| updatedAt | String (ISO 8601) | Дата обновления | ✅ |

**Global Secondary Indexes:**

**GSI-1: reference-index**
- **PK:** reference (String)
- **SK:** Нет
- **Projection:** ALL
- **Use Case:** Поиск по ссылке

**GSI-2: book-chapter-index**
- **PK:** book (String)
- **SK:** chapter (Number → String)
- **Projection:** ALL
- **Use Case:** Фильтрация по книге

**Access Patterns:**

| # | Pattern | Index | Example |
|---|---------|-------|---------|
| 1 | Получить стих по ID | Primary Key | `Query(PK=verseId)` |
| 2 | Поиск по ссылке | GSI-1 | `Query(GSI1PK="Иоанна 3:16")` |
| 3 | Стихи из книги | GSI-2 | `Query(GSI2PK="Иоанна")` |
| 4 | Все стихи | Scan | `Scan()` (для библиотеки) |

**Размер записи:** ~200-400 bytes (зависит от длины текста)

---

### 3.7. Таблица: LessonGoldenVerses

**Назначение:** Связь многие-ко-многим между Lesson и GoldenVerse

**Primary Key:**
- **Partition Key (PK):** `id` (String)
- **Sort Key (SK):** Нет

**Атрибуты:**

| Атрибут | Тип | Описание | Обязательный |
|---------|-----|----------|--------------|
| id | String (UUID) | Уникальный ID связи | ✅ |
| lessonId | String | ID урока | ✅ |
| goldenVerseId | String | ID стиха | ✅ |
| order | Number | Порядок в уроке | ✅ |
| createdAt | String (ISO 8601) | Дата добавления | ✅ |

**Global Secondary Indexes:**

**GSI-1: lessonId-order-index**
- **PK:** lessonId (String)
- **SK:** order (Number → String padded)
- **Projection:** ALL
- **Use Case:** Стихи урока (отсортированные)

**GSI-2: goldenVerseId-index**
- **PK:** goldenVerseId (String)
- **SK:** Нет
- **Projection:** KEYS_ONLY
- **Use Case:** Статистика использования стиха

**Access Patterns:**

| # | Pattern | Index | Example |
|---|---------|-------|---------|
| 1 | Стихи урока | GSI-1 | `Query(GSI1PK=lessonId)` |
| 2 | Статистика стиха | GSI-2 | `Query(GSI2PK=goldenVerseId)` + Count |

**Размер записи:** ~120 bytes

---

### 3.8. Таблица: Pupils

**Назначение:** Ученики воскресной школы

**Primary Key:**
- **Partition Key (PK):** `id` (String)
- **Sort Key (SK):** Нет

**Атрибуты:**

| Атрибут | Тип | Описание | Обязательный |
|---------|-----|----------|--------------|
| id | String (UUID) | Уникальный ID ученика | ✅ |
| gradeId | String | ID группы | ✅ |
| firstName | String | Имя | ✅ |
| lastName | String | Фамилия | ✅ |
| middleName | String | Отчество | ❌ |
| dateOfBirth | String (ISO Date) | Дата рождения | ✅ |
| photo | String | S3 URL фото | ❌ |
| active | Boolean | Активен ли ученик | ✅ (default: true) |
| createdAt | String (ISO 8601) | Дата создания | ✅ |
| updatedAt | String (ISO 8601) | Дата обновления | ✅ |

**Global Secondary Indexes:**

**GSI-1: gradeId-lastName-index**
- **PK:** gradeId (String)
- **SK:** lastName (String)
- **Projection:** ALL
- **Use Case:** Список учеников группы (отсортированные по фамилии)

**GSI-2: active-gradeId-index**
- **PK:** active (Boolean → String)
- **SK:** gradeId (String)
- **Projection:** ALL
- **Use Case:** Активные ученики

**Access Patterns:**

| # | Pattern | Index | Example |
|---|---------|-------|---------|
| 1 | Получить ученика по ID | Primary Key | `Query(PK=pupilId)` |
| 2 | Ученики группы | GSI-1 | `Query(GSI1PK=gradeId)` |
| 3 | Активные ученики группы | GSI-2 | `Query(GSI2PK="true", SK=gradeId)` |

**Размер записи:** ~250 bytes

---

### 3.9. Таблица: HomeworkChecks

**Назначение:** Результаты проверки ДЗ

**Primary Key:**
- **Partition Key (PK):** `id` (String)
- **Sort Key (SK):** Нет

**Атрибуты:**

| Атрибут | Тип | Описание | Обязательный |
|---------|-----|----------|--------------|
| id | String (UUID) | Уникальный ID проверки | ✅ |
| lessonId | String | ID урока | ✅ |
| pupilId | String | ID ученика | ✅ |
| goldenVerse | Boolean | Выучил золотой стих | ✅ (default: false) |
| test | Boolean | Сделал тест | ✅ (default: false) |
| notebook | Boolean | Сделал тетрадь | ✅ (default: false) |
| singing | Boolean | Был на спевке | ✅ (default: false) |
| points | Number | Баллы за урок | ✅ (default: 0) |
| hasHouse | Boolean | Получил домик | ✅ (вычисляется) |
| createdAt | String (ISO 8601) | Дата создания | ✅ |
| updatedAt | String (ISO 8601) | Дата обновления | ✅ |

**Global Secondary Indexes:**

**GSI-1: lessonId-pupilId-index**
- **PK:** lessonId (String)
- **SK:** pupilId (String)
- **Projection:** ALL
- **Use Case:** Проверки для урока (массовая проверка ДЗ)

**GSI-2: pupilId-createdAt-index**
- **PK:** pupilId (String)
- **SK:** createdAt (String)
- **Projection:** ALL
- **Use Case:** История ученика (личная карточка)

**Access Patterns:**

| # | Pattern | Index | Example |
|---|---------|-------|---------|
| 1 | Получить проверку | Primary Key | `Query(PK=checkId)` |
| 2 | Проверки урока | GSI-1 | `Query(GSI1PK=lessonId)` |
| 3 | История ученика | GSI-2 | `Query(GSI2PK=pupilId)` |
| 4 | Проверка существования | GSI-1 + filter | `Query(GSI1PK=lessonId, filter: pupilId)` |

**Примерная запись:**

```json
{
  "id": "check-111",
  "lessonId": "lesson-789",
  "pupilId": "pupil-222",
  "goldenVerse": true,
  "test": true,
  "notebook": true,
  "singing": false,
  "points": 30,
  "hasHouse": false,
  "createdAt": "2024-09-08T14:00:00Z",
  "updatedAt": "2024-09-08T14:00:00Z"
}
```

**Размер записи:** ~180 bytes

**Важно:** hasHouse = goldenVerse && test && notebook && singing

---

### 3.10. Таблица: Achievements

**Назначение:** Достижения (badges)

**Primary Key:**
- **Partition Key (PK):** `id` (String)
- **Sort Key (SK):** Нет

**Атрибуты:**

| Атрибут | Тип | Описание | Обязательный |
|---------|-----|----------|--------------|
| id | String (UUID) | Уникальный ID достижения | ✅ |
| name | String | Название | ✅ (UNIQUE) |
| description | String | Описание | ✅ |
| icon | String | Emoji или URL | ❌ |
| criteria | String | JSON критерии | ✅ |
| createdAt | String (ISO 8601) | Дата создания | ✅ |
| updatedAt | String (ISO 8601) | Дата обновления | ✅ |

**Global Secondary Indexes:**

**GSI-1: name-index**
- **PK:** name (String)
- **SK:** Нет
- **Projection:** ALL
- **Use Case:** Поиск по названию

**Access Patterns:**

| # | Pattern | Index | Example |
|---|---------|-------|---------|
| 1 | Получить достижение | Primary Key | `Query(PK=achievementId)` |
| 2 | Все достижения | Scan | `Scan()` (маленькая таблица) |
| 3 | Поиск по названию | GSI-1 | `Query(GSI1PK="Отличник")` |

**Размер записи:** ~200 bytes

---

### 3.11. Таблица: PupilAchievements

**Назначение:** Связь учеников и достижений

**Primary Key:**
- **Partition Key (PK):** `id` (String)
- **Sort Key (SK):** Нет

**Атрибуты:**

| Атрибут | Тип | Описание | Обязательный |
|---------|-----|----------|--------------|
| id | String (UUID) | Уникальный ID связи | ✅ |
| pupilId | String | ID ученика | ✅ |
| achievementId | String | ID достижения | ✅ |
| awardedAt | String (ISO 8601) | Дата получения | ✅ |
| createdAt | String (ISO 8601) | Дата создания | ✅ |

**Global Secondary Indexes:**

**GSI-1: pupilId-awardedAt-index**
- **PK:** pupilId (String)
- **SK:** awardedAt (String)
- **Projection:** ALL
- **Use Case:** Достижения ученика

**GSI-2: achievementId-index**
- **PK:** achievementId (String)
- **SK:** Нет
- **Projection:** KEYS_ONLY
- **Use Case:** Статистика достижения

**Access Patterns:**

| # | Pattern | Index | Example |
|---|---------|-------|---------|
| 1 | Достижения ученика | GSI-1 | `Query(GSI1PK=pupilId)` |
| 2 | Кто получил достижение | GSI-2 | `Query(GSI2PK=achievementId)` + Count |

**Размер записи:** ~130 bytes

---

### 3.12. Таблица: Families

**Назначение:** Семьи учеников

**Primary Key:**
- **Partition Key (PK):** `id` (String)
- **Sort Key (SK):** Нет

**Атрибуты:**

| Атрибут | Тип | Описание | Обязательный |
|---------|-----|----------|--------------|
| id | String (UUID) | Уникальный ID семьи | ✅ |
| name | String | Фамилия семьи | ✅ |
| phone | String | Телефон | ❌ |
| email | String | Email | ❌ |
| address | String | Адрес | ❌ |
| createdAt | String (ISO 8601) | Дата создания | ✅ |
| updatedAt | String (ISO 8601) | Дата обновления | ✅ |

**Access Patterns:**

| # | Pattern | Index | Example |
|---|---------|-------|---------|
| 1 | Получить семью | Primary Key | `Query(PK=familyId)` |
| 2 | Все семьи | Scan | `Scan()` |

**Размер записи:** ~200 bytes

---

### 3.13. Таблица: FamilyMembers

**Назначение:** Связь семей и учеников

**Primary Key:**
- **Partition Key (PK):** `id` (String)
- **Sort Key (SK):** Нет

**Атрибуты:**

| Атрибут | Тип | Описание | Обязательный |
|---------|-----|----------|--------------|
| id | String (UUID) | Уникальный ID связи | ✅ |
| familyId | String | ID семьи | ✅ |
| pupilId | String | ID ученика | ✅ |
| createdAt | String (ISO 8601) | Дата добавления | ✅ |

**Global Secondary Indexes:**

**GSI-1: familyId-index**
- **PK:** familyId (String)
- **SK:** Нет
- **Projection:** ALL
- **Use Case:** Члены семьи

**GSI-2: pupilId-index**
- **PK:** pupilId (String)
- **SK:** Нет
- **Projection:** ALL
- **Use Case:** Семьи ученика

**Access Patterns:**

| # | Pattern | Index | Example |
|---|---------|-------|---------|
| 1 | Члены семьи | GSI-1 | `Query(GSI1PK=familyId)` |
| 2 | Семьи ученика | GSI-2 | `Query(GSI2PK=pupilId)` |

**Размер записи:** ~100 bytes

---

### 3.14. Таблица: GradeEvents

**Назначение:** События в расписании группы

**Primary Key:**
- **Partition Key (PK):** `id` (String)
- **Sort Key (SK):** Нет

**Атрибуты:**

| Атрибут | Тип | Описание | Обязательный |
|---------|-----|----------|--------------|
| id | String (UUID) | Уникальный ID события | ✅ |
| gradeId | String | ID группы | ✅ |
| eventType | String | LESSON \| OUTDOOR_EVENT \| LESSON_SKIPPING | ✅ |
| title | String | Название | ✅ |
| description | String | Описание | ❌ |
| eventDate | String (ISO Date) | Дата события | ✅ |
| createdAt | String (ISO 8601) | Дата создания | ✅ |
| updatedAt | String (ISO 8601) | Дата обновления | ✅ |

**Global Secondary Indexes:**

**GSI-1: gradeId-eventDate-index**
- **PK:** gradeId (String)
- **SK:** eventDate (String)
- **Projection:** ALL
- **Use Case:** Календарь группы

**Access Patterns:**

| # | Pattern | Index | Example |
|---|---------|-------|---------|
| 1 | Получить событие | Primary Key | `Query(PK=eventId)` |
| 2 | События группы | GSI-1 | `Query(GSI1PK=gradeId)` |
| 3 | События за месяц | GSI-1 + filter | `Query(GSI1PK=gradeId, SK between "2024-09-01" and "2024-09-30")` |

**Размер записи:** ~180 bytes

---

### 3.15. Таблица: GradeSettings

**Назначение:** Настройки оценивания группы

**Primary Key:**
- **Partition Key (PK):** `id` (String)
- **Sort Key (SK):** Нет

**Атрибуты:**

| Атрибут | Тип | Описание | Обязательный |
|---------|-----|----------|--------------|
| id | String (UUID) | Уникальный ID настроек | ✅ |
| gradeId | String | ID группы (UNIQUE) | ✅ |
| enableGoldenVerse | Boolean | Использовать стихи | ✅ (default: true) |
| enableTest | Boolean | Использовать тест | ✅ (default: true) |
| enableNotebook | Boolean | Использовать тетрадь | ✅ (default: true) |
| enableSinging | Boolean | Использовать спевку | ✅ (default: true) |
| pointsGoldenVerse | Number | Баллы за стихи | ✅ (default: 10) |
| pointsTest | Number | Баллы за тест | ✅ (default: 10) |
| pointsNotebook | Number | Баллы за тетрадь | ✅ (default: 10) |
| pointsSinging | Number | Баллы за спевку | ✅ (default: 10) |
| labelGoldenVerse | String | Метка стихов | ✅ |
| labelTest | String | Метка теста | ✅ |
| labelNotebook | String | Метка тетради | ✅ |
| labelSinging | String | Метка спевки | ✅ |
| createdAt | String (ISO 8601) | Дата создания | ✅ |
| updatedAt | String (ISO 8601) | Дата обновления | ✅ |

**Global Secondary Indexes:**

**GSI-1: gradeId-index**
- **PK:** gradeId (String)
- **SK:** Нет
- **Projection:** ALL
- **Use Case:** Настройки группы

**Access Patterns:**

| # | Pattern | Index | Example |
|---|---------|-------|---------|
| 1 | Получить настройки | Primary Key | `Query(PK=settingsId)` |
| 2 | Настройки по группе | GSI-1 | `Query(GSI1PK=gradeId)` |

**Примерная запись:**

```json
{
  "id": "settings-001",
  "gradeId": "grade-123",
  "enableGoldenVerse": true,
  "enableTest": true,
  "enableNotebook": true,
  "enableSinging": false,
  "pointsGoldenVerse": 15,
  "pointsTest": 10,
  "pointsNotebook": 10,
  "pointsSinging": 5,
  "labelGoldenVerse": "Золотые стихи",
  "labelTest": "Тест",
  "labelNotebook": "Тетрадь",
  "labelSinging": "Спевка",
  "createdAt": "2024-09-01T00:00:00Z",
  "updatedAt": "2024-09-01T00:00:00Z"
}
```

**Размер записи:** ~300 bytes

---

## 4. Оптимизация и Best Practices

### 4.1. Избегать Scan operations

**Правило:** Scan читает всю таблицу → дорого и медленно

**✅ Хорошо:**
```typescript
// Query с PK
await client.query({
  TableName: 'Lessons',
  IndexName: 'academicYearId-lessonDate-index',
  KeyConditionExpression: 'academicYearId = :yearId',
  ExpressionAttributeValues: {
    ':yearId': 'year-456'
  }
});
```

**❌ Плохо:**
```typescript
// Scan всей таблицы
await client.scan({
  TableName: 'Lessons',
  FilterExpression: 'academicYearId = :yearId',
  ExpressionAttributeValues: {
    ':yearId': 'year-456'
  }
});
```

**Когда Scan допустим:**
- Маленькие таблицы (< 1000 записей): Achievements, GradeSettings
- Export данных (background job)

### 4.2. Использовать проекции для GSI

**Зачем:** Экономия storage и ускорение запросов

**Типы проекций:**
- **KEYS_ONLY:** Только ключи (минимальный размер)
- **INCLUDE:** Ключи + выбранные атрибуты
- **ALL:** Все атрибуты (по умолчанию)

**Пример:**
```
GSI: teacherId-createdAt-index
Projection: KEYS_ONLY
→ Хранит только id, teacherId, createdAt (экономия 80% storage)
```

### 4.3. Batch операции

**BatchGetItem:**
```typescript
// Получить несколько учеников одним запросом
await client.batchGet({
  RequestItems: {
    'Pupils': {
      Keys: [
        { id: 'pupil-1' },
        { id: 'pupil-2' },
        { id: 'pupil-3' }
      ]
    }
  }
});
```

**BatchWriteItem:**
```typescript
// Создать несколько HomeworkChecks одним запросом
await client.batchWrite({
  RequestItems: {
    'HomeworkChecks': [
      { PutRequest: { Item: check1 } },
      { PutRequest: { Item: check2 } },
      { PutRequest: { Item: check3 } }
    ]
  }
});
```

**Лимиты:**
- BatchGetItem: до 100 items
- BatchWriteItem: до 25 items

### 4.4. Кеширование на уровне приложения

**Где кешировать:**
- GradeSettings (меняются редко)
- Список Achievements
- Список GoldenVerses

**Как:**
```typescript
// Next.js cache
const gradeSettings = cache(async (gradeId: string) => {
  return await amplifyData.get('GradeSettings', { gradeId });
});

// Revalidate каждые 60 секунд
export const revalidate = 60;
```

---

## 5. Интеграция с AWS AppSync

### 5.1. Как GraphQL resolvers работают с DynamoDB

**Автоматические resolvers:**

Amplify Gen 1 автоматически создает resolvers для:
- Queries: `getX`, `listX`
- Mutations: `createX`, `updateX`, `deleteX`
- Subscriptions: `onCreateX`, `onUpdateX`, `onDeleteX`

**Пример GraphQL → DynamoDB:**

```graphql
query GetLesson {
  getLesson(id: "lesson-789") {
    id
    title
    lessonDate
  }
}
```

**→ DynamoDB Query:**
```json
{
  "TableName": "Lessons",
  "Key": {
    "id": { "S": "lesson-789" }
  }
}
```

### 5.2. Автоматическая генерация таблиц через Amplify

**Процесс:**

1. Определить GraphQL schema:
```graphql
type Lesson @model {
  id: ID!
  title: String!
  lessonDate: AWSDate!
}
```

2. Запустить `amplify push`

3. Amplify автоматически:
   - Создает DynamoDB таблицу `Lesson`
   - Создает AppSync resolvers
   - Генерирует TypeScript types

**Результат:**
- Таблица в DynamoDB с правильными ключами
- GraphQL API готов к использованию
- Type-safe клиент для Next.js

### 5.3. Миграции и обновления схемы

**Добавление поля:**
```graphql
type Lesson @model {
  id: ID!
  title: String!
  lessonDate: AWSDate!
  duration: Int  # ← новое поле
}
```

`amplify push` → Поле добавляется без миграции (DynamoDB schemaless)

**Изменение типа поля:**
⚠️ Требует миграция данных:
1. Создать новое поле с новым типом
2. Скрипт миграции: скопировать данные
3. Удалить старое поле

**Удаление поля:**
- Просто удалить из schema
- Данные в DynamoDB останутся (не влияет на размер)

---

## Cross-reference

- См. также: [`docs/database/ERD.md`](../database/ERD.md) — визуализация сущностей
- См. также: [`docs/database/GRAPHQL_SCHEMA.md`](../database/GRAPHQL_SCHEMA.md) — GraphQL типы
- См. также: [`docs/database/DATA_MODELING.md`](../database/DATA_MODELING.md) — access patterns
- См. также: [`docs/architecture/ARCHITECTURE.md`](../architecture/ARCHITECTURE.md) — общая архитектура

---

**Версия:** 1.0  
**Последнее обновление:** 23 декабря 2025  
**Автор:** AI Documentation Team

