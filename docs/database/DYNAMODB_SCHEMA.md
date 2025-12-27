# DynamoDB Schema - Sunday School App

## Версия документа: 1.2
**Дата создания:** 23 декабря 2025  
**Последнее обновление:** 25 декабря 2025  
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
| bookId | String (UUID) | ID книги Библии | ✅ |
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

**GSI-2: bookId-chapter-index**
- **PK:** bookId (String)
- **SK:** chapter (Number → String)
- **Projection:** ALL
- **Use Case:** Фильтрация по книге

**Access Patterns:**

| # | Pattern | Index | Example |
|---|---------|-------|---------|
| 1 | Получить стих по ID | Primary Key | `Query(PK=verseId)` |
| 2 | Поиск по ссылке | GSI-1 | `Query(GSI1PK="Иоанна 3:16")` |
| 3 | Стихи из книги | GSI-2 | `Query(GSI2PK=bookId)` |
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
- **Use Case:** Статистика использования стиха, аналитика сложности стихов

**Опционально (Post-MVP): GSI-3: academicYearId-goldenVerseId-index**
- **PK:** academicYearId (String) — требует денормализации academicYearId в LessonGoldenVerse
- **SK:** goldenVerseId (String)
- **Projection:** ALL
- **Use Case:** Оптимизация для получения списка стихов группы за учебный год (AP-25)
- **Примечание:** Это опциональная оптимизация для post-MVP. Для MVP достаточно существующих GSI.

**Access Patterns:**

| # | Pattern | Index | Example |
|---|---------|-------|---------|
| 1 | Стихи урока | GSI-1 | `Query(GSI1PK=lessonId)` |
| 2 | Статистика стиха | GSI-2 | `Query(GSI2PK=goldenVerseId)` + Count |
| 3 | Аналитика сложности стихов | GSI-2 + GSI-1 | Используется в комбинации с HomeworkChecks GSI-3 |

**Размер записи:** ~120 bytes

**Использование для аналитики:**
- GSI-2 используется для получения всех использований конкретного стиха (аналитика сложности)
- GSI-1 используется для получения стихов урока при анализе проверок ДЗ

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
| gradeId | String | ID группы (денормализация) | ✅ |
| goldenVerse1Score | Number | Баллы за первый золотой стих (0-2) | ❌ |
| goldenVerse2Score | Number | Баллы за второй золотой стих (0-2) | ❌ |
| goldenVerse3Score | Number | Баллы за третий золотой стих (0-2) | ❌ |
| testScore | Number | Баллы за тест (0-10) | ❌ |
| notebookScore | Number | Баллы за тетрадь (0-10) | ❌ |
| singing | Boolean | Был на спевке | ✅ (default: false) |
| points | Number | Баллы за урок (вычисляется автоматически) | ✅ (default: 0) |
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

**GSI-3: gradeId-createdAt-index** ⭐ **Для аналитики (Post-MVP)**
- **PK:** gradeId (String)
- **SK:** createdAt (String)
- **Projection:** ALL
- **Use Case:** История успеваемости группы, топ учеников, аналитика по группе
- **Важно:** Этот GSI должен быть создан на этапе MVP для поддержки аналитики post-MVP. См. [ANALYTICS.md](ANALYTICS.md) для деталей.

**Access Patterns:**

| # | Pattern | Index | Example |
|---|---------|-------|---------|
| 1 | Получить проверку | Primary Key | `Query(PK=checkId)` |
| 2 | Проверки урока | GSI-1 | `Query(GSI1PK=lessonId)` |
| 3 | История ученика | GSI-2 | `Query(GSI2PK=pupilId)` |
| 4 | Проверка существования | GSI-1 + filter | `Query(GSI1PK=lessonId, filter: pupilId)` |
| 5 | История группы (аналитика) | GSI-3 | `Query(GSI3PK=gradeId, SK BETWEEN start AND end)` |
| 6 | Топ учеников группы | GSI-3 | `Query(GSI3PK=gradeId) + сортировка` |
| 7 | Баллы ученика за учебный год | GSI-2 | `Query(GSI2PK=pupilId, SK BETWEEN startDate AND endDate)` |
| 8 | Баллы ученика за период дат | GSI-2 | `Query(GSI2PK=pupilId, SK BETWEEN startDate AND endDate)` |
| 9 | Аналитика сложности стихов | GSI-3 | `Query(GSI3PK=gradeId, SK BETWEEN start AND end)` + агрегация |

**Примерная запись:**

```json
{
  "id": "check-111",
  "lessonId": "lesson-789",
  "pupilId": "pupil-222",
  "gradeId": "grade-123",
  "goldenVerse1Score": 2,
  "goldenVerse2Score": 2,
  "goldenVerse3Score": 1,
  "testScore": 9,
  "notebookScore": 8,
  "singing": true,
  "points": 24,
  "hasHouse": false,
  "createdAt": "2024-09-08T14:00:00Z",
  "updatedAt": "2024-09-08T14:00:00Z"
}
```

**Размер записи:** ~250 bytes

**Денормализация:** gradeId хранится в HomeworkCheck для поддержки GSI-3 (аналитика), хотя есть через Lesson.gradeId. Это позволяет эффективно запрашивать историю успеваемости группы без дополнительных запросов к таблице Lessons.

**Использование GSI-3 для аналитики:**
- История успеваемости группы за период (AP-ANALYTICS-3)
- Топ учеников группы (AP-ANALYTICS-4)
- Аналитика сложности золотых стихов (AP-ANALYTICS-7): получение всех проверок группы для анализа успеваемости по стихам

**Пример запроса для аналитики сложности стихов:**
```typescript
// Получить все проверки группы за учебный год
await client.query({
  TableName: 'HomeworkChecks',
  IndexName: 'gradeId-createdAt-index',
  KeyConditionExpression: 'gradeId = :gradeId AND createdAt BETWEEN :start AND :end',
  ExpressionAttributeValues: {
    ':gradeId': 'grade-123',
    ':start': '2024-09-01T00:00:00Z',
    ':end': '2025-05-31T23:59:59Z'
  }
});
// Затем для каждой проверки получить Lesson и LessonGoldenVerses для сопоставления баллов со стихами
```

**Расчет баллов (points):**
Баллы за урок вычисляются автоматически как сумма всех компонентов:
- Баллы за золотые стихи: `goldenVerse1Score + goldenVerse2Score + goldenVerse3Score` (0-6 баллов)
- Баллы за тест: `testScore` (0-10 баллов)
- Баллы за тетрадь: `notebookScore` (0-10 баллов)
- Баллы за спевку: если `singing = true`, то добавляются баллы из `GradeSettings.pointsSinging` (обычно 1-10 баллов)

**Формула:**
```
points = (goldenVerse1Score + goldenVerse2Score + goldenVerse3Score) + testScore + notebookScore + (singing ? gradeSettings.pointsSinging : 0)
```

**Важно:** 
- Если ученик отсутствовал на уроке, все баллы = 0, `points = 0`
- Поле `hasHouse` устарело и будет удалено в будущих версиях (заменено на систему кирпичиков)

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

**Назначение:** Семьи учеников с информацией о родителях

**Primary Key:**
- **Partition Key (PK):** `id` (String)
- **Sort Key (SK):** Нет

**Атрибуты:**

| Атрибут | Тип | Описание | Обязательный |
|---------|-----|----------|--------------|
| id | String (UUID) | Уникальный ID семьи | ✅ |
| name | String | Фамилия семьи | ✅ |
| phone | String | Телефон контактного лица | ❌ |
| email | String | Email семьи | ❌ |
| address | String | Адрес | ❌ |
| motherFirstName | String | Имя матери | ❌ |
| motherLastName | String | Фамилия матери | ❌ |
| motherMiddleName | String | Отчество матери | ❌ |
| motherPhone | String | Телефон матери | ❌ |
| fatherFirstName | String | Имя отца | ❌ |
| fatherLastName | String | Фамилия отца | ❌ |
| fatherMiddleName | String | Отчество отца | ❌ |
| fatherPhone | String | Телефон отца | ❌ |
| createdAt | String (ISO 8601) | Дата создания | ✅ |
| updatedAt | String (ISO 8601) | Дата обновления | ✅ |

**Global Secondary Indexes:**

**GSI-1: motherPhone-index**
- **PK:** motherPhone (String)
- **SK:** Нет
- **Projection:** ALL
- **Use Case:** Поиск семьи по телефону матери (для связи с пользователем PARENT)

**GSI-2: fatherPhone-index**
- **PK:** fatherPhone (String)
- **SK:** Нет
- **Projection:** ALL
- **Use Case:** Поиск семьи по телефону отца (для связи с пользователем PARENT)

**Access Patterns:**

| # | Pattern | Index | Example |
|---|---------|-------|---------|
| 1 | Получить семью | Primary Key | `Query(PK=familyId)` |
| 2 | Все семьи | Scan | `Scan()` |
| 3 | Поиск по телефону матери | GSI-1 | `Query(GSI1PK=motherPhone)` |
| 4 | Поиск по телефону отца | GSI-2 | `Query(GSI2PK=fatherPhone)` |

**Примерная запись:**

```json
{
  "id": "family-123",
  "name": "Поповы",
  "phone": "+7 (912) 345-67-89",
  "email": "popov@example.com",
  "address": "г. Москва, ул. Примерная, д. 1",
  "motherFirstName": "Елена",
  "motherLastName": "Попова",
  "motherMiddleName": "Владимировна",
  "motherPhone": "+7 (912) 345-67-90",
  "fatherFirstName": "Андрей",
  "fatherLastName": "Попов",
  "fatherMiddleName": "Иванович",
  "fatherPhone": "+7 (912) 345-67-89",
  "createdAt": "2024-09-01T00:00:00Z",
  "updatedAt": "2024-09-01T00:00:00Z"
}
```

**Размер записи:** ~400 bytes

**Бизнес-правила:**
- Ученик может принадлежать только одной семье (через FamilyMember)
- Телефоны матери и отца используются для связи с пользователями с ролью PARENT (Post-MVP функционал)
- При регистрации пользователя PARENT вводится номер телефона, и система ищет соответствующую семью по полям motherPhone или fatherPhone

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

### 3.16. Таблица: Books

**Назначение:** Книги Библии (Ветхий и Новый Завет)

**Primary Key:**
- **Partition Key (PK):** `id` (String)
- **Sort Key (SK):** Нет

**Атрибуты:**

| Атрибут | Тип | Описание | Обязательный |
|---------|-----|----------|--------------|
| id | String (UUID) | Уникальный ID книги | ✅ |
| fullName | String | Полное название (например, "Евангелие от Иоанна") | ✅ |
| shortName | String | Сокращенное название (например, "Иоанна") | ✅ |
| abbreviation | String | Аббревиатура (например, "Ин") | ✅ |
| testament | String | Завет: "OLD" \| "NEW" | ✅ |
| order | Number | Порядок в Библии (1-66) | ✅ |
| createdAt | String (ISO 8601) | Дата создания | ✅ |
| updatedAt | String (ISO 8601) | Дата обновления | ✅ |

**Global Secondary Indexes:**

**GSI-1: shortName-index**
- **PK:** shortName (String)
- **SK:** Нет
- **Projection:** ALL
- **Use Case:** Поиск книги по сокращенному названию

**GSI-2: testament-order-index**
- **PK:** testament (String)
- **SK:** order (Number → String)
- **Projection:** ALL
- **Use Case:** Список книг по завету (отсортированные по порядку)

**Access Patterns:**

| # | Pattern | Index | Example |
|---|---------|-------|---------|
| 1 | Получить книгу по ID | Primary Key | `Query(PK=bookId)` |
| 2 | Поиск книги по названию | GSI-1 | `Query(GSI1PK="Иоанна")` |
| 3 | Книги по завету | GSI-2 | `Query(GSI2PK="NEW")` |
| 4 | Все книги | Scan | `Scan()` (маленькая таблица, 66 записей) |

**Примерная запись:**

```json
{
  "id": "book-123",
  "fullName": "Евангелие от Иоанна",
  "shortName": "Иоанна",
  "abbreviation": "Ин",
  "testament": "NEW",
  "order": 43,
  "createdAt": "2024-09-01T00:00:00Z",
  "updatedAt": "2024-09-01T00:00:00Z"
}
```

**Размер записи:** ~200 bytes

**Бизнес-правила:**
- Всего 66 книг Библии (39 Ветхий Завет + 27 Новый Завет)
- shortName должен быть уникальным
- order определяет порядок книг в Библии (1-66)
- Таблица заполняется один раз при инициализации базы данных

---

### 3.17. Таблица: UserFamilies

**Назначение:** Связь пользователей с ролью PARENT с семьями учеников

**Primary Key:**
- **Partition Key (PK):** `id` (String)
- **Sort Key (SK):** Нет

**Атрибуты:**

| Атрибут | Тип | Описание | Обязательный |
|---------|-----|----------|--------------|
| id | String (UUID) | Уникальный ID связи | ✅ |
| userId | String | ID пользователя (PARENT) | ✅ |
| familyId | String | ID семьи | ✅ |
| phone | String | Номер телефона, использованный для связи | ✅ |
| createdAt | String (ISO 8601) | Дата создания | ✅ |

**Global Secondary Indexes:**

**GSI-1: userId-index**
- **PK:** userId (String)
- **SK:** Нет
- **Projection:** ALL
- **Use Case:** Получить все семьи пользователя PARENT

**GSI-2: familyId-index**
- **PK:** familyId (String)
- **SK:** Нет
- **Projection:** ALL
- **Use Case:** Получить всех пользователей PARENT, связанных с семьей

**GSI-3: phone-index**
- **PK:** phone (String)
- **SK:** Нет
- **Projection:** ALL
- **Use Case:** Поиск связи по номеру телефона (для проверки при регистрации)

**Access Patterns:**

| # | Pattern | Index | Example |
|---|---------|-------|---------|
| 1 | Получить связь | Primary Key | `Query(PK=userFamilyId)` |
| 2 | Семьи пользователя | GSI-1 | `Query(GSI1PK=userId)` |
| 3 | Пользователи семьи | GSI-2 | `Query(GSI2PK=familyId)` |
| 4 | Проверка по телефону | GSI-3 | `Query(GSI3PK=phone)` |

**Примерная запись:**

```json
{
  "id": "userfamily-456",
  "userId": "user-parent-789",
  "familyId": "family-123",
  "phone": "+7 (912) 345-67-90",
  "createdAt": "2024-09-15T10:30:00Z"
}
```

**Размер записи:** ~150 bytes

**Бизнес-правила:**
- Связь создается при регистрации пользователя с ролью PARENT
- При регистрации пользователь вводит номер телефона
- Система ищет семью, где `motherPhone` или `fatherPhone` совпадает с введенным номером
- Если семья найдена, создается связь UserFamily
- Один пользователь PARENT может быть связан с несколькими семьями (если у него несколько детей в разных семьях)
- Одна семья может быть связана с несколькими пользователями PARENT (мать и отец)
- **Важно:** Это Post-MVP функционал, но структура базы данных создается на этапе MVP для будущей реализации

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

## 6. Аналитика (Post-MVP функционал)

### 6.1. Обзор

Для поддержки аналитики учебного процесса (post-MVP функционал) в таблице `HomeworkChecks` добавлен **GSI-3: gradeId-createdAt-index**. Этот индекс необходим для эффективных запросов по группе за период и должен быть создан на этапе MVP, даже если сам функционал аналитики будет реализован post-MVP.

**Критически важно:** Access patterns определяют дизайн базы данных в DynamoDB. Структуру БД для аналитики необходимо создать на этапе MVP, чтобы предотвратить необходимость миграции данных в будущем.

### 6.2. GSI-3 для HomeworkChecks

**GSI-3: gradeId-createdAt-index**
- **Partition Key (PK):** `gradeId` (String)
- **Sort Key (SK):** `createdAt` (String, ISO 8601)
- **Projection:** ALL
- **Use Case:** 
  - История успеваемости группы за период
  - Топ учеников группы по баллам
  - Агрегированная статистика группы
  - Сравнительная аналитика между группами

**Пример использования:**
```typescript
// Получить все проверки группы за период
await client.query({
  TableName: 'HomeworkChecks',
  IndexName: 'gradeId-createdAt-index',
  KeyConditionExpression: 'gradeId = :gradeId AND createdAt BETWEEN :start AND :end',
  ExpressionAttributeValues: {
    ':gradeId': 'grade-123',
    ':start': '2024-09-01T00:00:00Z',
    ':end': '2024-12-31T23:59:59Z'
  }
});
```

### 6.3. Опциональная таблица AnalyticsAggregates

Для оптимизации производительности аналитики (для больших периодов и частых запросов) может быть создана опциональная таблица `AnalyticsAggregates` для кэширования агрегированных данных.

**Структура (опционально):**

| Атрибут | Тип | Описание |
|---------|-----|----------|
| id | String | PK: entityType-entityId-period |
| entityType | String | "pupil" \| "grade" |
| entityId | String | pupilId или gradeId |
| period | String | "2024-09" (год-месяц) |
| totalPoints | Number | Суммарные баллы за период |
| averagePoints | Number | Средний балл за период |
| lessonsCount | Number | Количество уроков |
| attendanceRate | Number | Процент посещаемости |
| ttl | Number | TTL для автоматической очистки |

**Когда использовать:**
- Для больших периодов (> 3 месяцев)
- Для часто запрашиваемых данных
- Для дашбордов с множеством метрик

**Когда НЕ использовать:**
- Для небольших периодов (< 1 месяца) — проще агрегировать на клиенте
- Для редко запрашиваемых данных — избыточно

**Подробнее:** См. [ANALYTICS.md](ANALYTICS.md) для полной документации по аналитике.

---

## Cross-reference

- См. также: [`docs/database/ERD.md`](ERD.md) — визуализация сущностей
- См. также: [`docs/database/GRAPHQL_SCHEMA.md`](GRAPHQL_SCHEMA.md) — GraphQL типы
- См. также: [`docs/database/DATA_MODELING.md`](DATA_MODELING.md) — access patterns
- См. также: [`docs/database/ANALYTICS.md`](ANALYTICS.md) — аналитика учебного процесса (Post-MVP)
- См. также: [`docs/architecture/ARCHITECTURE.md`](../architecture/ARCHITECTURE.md) — общая архитектура

---

**Версия:** 1.1  
**Последнее обновление:** 27 декабря 2025  
**Автор:** AI Documentation Team
