План создания технической документации — Sunday School App
1. Введение
Данный план определяет структуру и процесс создания полной технической документации для проекта Sunday School App — веб-приложения для автоматизации управления воскресной школой баптистской церкви.

Цель плана:

Создать исчерпывающую техническую документацию для успешной разработки приложения
Обеспечить единое понимание архитектуры, структуры данных и пользовательских сценариев всеми участниками проекта
Предоставить разработчикам детальные спецификации для реализации функционала
Особенности проекта:

Проект создается с нуля на современном стеке
Использование AWS Amplify Gen 1 (критично — НЕ Gen 2!)
Next.js 15.5.9 с App Router и Server Components
DynamoDB + AppSync для backend
Фокус на системе мотивации учеников и игрофикации
---

2. Структура каталогов документации
docs/
├── architecture/              # Архитектурная документация
│   ├── ARCHITECTURE.md        # Общая архитектура системы
│   ├── DATA_FLOW.md           # Потоки данных в приложении
│   ├── SECURITY.md            # Архитектура безопасности
│   └── DEPLOYMENT.md          # Архитектура развертывания
│
├── database/                  # База данных
│   ├── ERD.md                 # Entity Relationship Diagram
│   ├── DYNAMODB_SCHEMA.md     # Схема DynamoDB (таблицы, ключи, индексы)
│   ├── GRAPHQL_SCHEMA.md      # GraphQL Schema для AppSync
│   └── DATA_MODELING.md       # Стратегии моделирования данных для DynamoDB
│
├── user_flows/                # Пользовательские сценарии
│   ├── USER_FLOW.md           # Основные user flows с диаграммами
│   ├── TEACHER_FLOWS.md       # Детальные сценарии преподавателя
│   ├── ADMIN_FLOWS.md         # Детальные сценарии администратора
│   └── ERROR_HANDLING.md      # Обработка ошибок и edge cases
│
├── ui_ux/                     # UI/UX документация
│   ├── WIREFRAMES.md          # Wireframes всех страниц
│   ├── DESIGN_SYSTEM.md       # Дизайн-система (Shadcn UI)
│   ├── RESPONSIVE_DESIGN.md   # Адаптивный дизайн (Mobile-First)
│   └── ACCESSIBILITY.md       # Доступность (WCAG 2.1 AA)
│
├── api/                       # API документация
│   ├── SERVER_ACTIONS.md      # Next.js Server Actions (API контракты)
│   ├── GRAPHQL_API.md         # GraphQL API (AppSync endpoints)
│   ├── AUTH_API.md            # AWS Cognito Auth API
│   └── VALIDATION.md          # Zod валидация схем
│
├── components/                # Компоненты
│   ├── COMPONENT_LIBRARY.md   # Библиотека компонентов
│   ├── SERVER_COMPONENTS.md   # Server Components паттерны
│   └── CLIENT_COMPONENTS.md   # Client Components паттерны
│
├── infrastructure/            # Инфраструктура AWS
│   ├── AWS_AMPLIFY.md         # AWS Amplify Gen 1 конфигурация
│   ├── AWS_SERVICES.md        # Используемые AWS сервисы
│   ├── CI_CD.md               # CI/CD pipeline
│   └── ENVIRONMENTS.md        # Окружения (dev/prod)
│
├── testing/                   # Тестирование (Post-MVP)
│   ├── TESTING_STRATEGY.md    # Стратегия тестирования
│   └── TEST_CASES.md          # Тест-кейсы
│
└── deployment/                # Развертывание
    ├── DEPLOYMENT_GUIDE.md    # Руководство по развертыванию
    └── ROLLBACK_STRATEGY.md   # Стратегия отката
Обоснование организации:

Доменно-ориентированная структура — каждая папка отвечает за определенный аспект проекта
Логичная группировка — связанные документы находятся в одной папке
Масштабируемость — легко добавить новые документы без реорганизации
Навигация — интуитивно понятная структура для разработчиков
---

3. Приоритизация документов
| № | Документ | Описание | Приоритет | Фаза | Зависимости |

|---|----------|----------|-----------|------|-------------|

| 1 | ARCHITECTURE.md | Общая архитектура системы с компонентами и взаимодействием | Must-have | 1 | — |

| 2 | ERD.md | Визуализация всех сущностей и их связей | Must-have | 1 | — |

| 3 | DYNAMODB_SCHEMA.md | Схема таблиц DynamoDB с ключами и индексами | Must-have | 1 | ERD.md |

| 4 | GRAPHQL_SCHEMA.md | GraphQL Schema для AWS AppSync | Must-have | 1 | DYNAMODB_SCHEMA.md |

| 5 | DATA_MODELING.md | Стратегии моделирования для DynamoDB | Must-have | 1 | DYNAMODB_SCHEMA.md |

| 6 | USER_FLOW.md | Основные пользовательские сценарии с диаграммами | Must-have | 2 | ARCHITECTURE.md |

| 7 | WIREFRAMES.md | Wireframes всех страниц (Desktop, Tablet, Mobile) | Must-have | 2 | USER_FLOW.md |

| 8 | DESIGN_SYSTEM.md | Дизайн-система на основе Shadcn UI | Must-have | 2 | WIREFRAMES.md |

| 9 | SERVER_ACTIONS.md | API контракты для Next.js Server Actions | Must-have | 3 | ARCHITECTURE.md, GRAPHQL_SCHEMA.md |

| 10 | COMPONENT_LIBRARY.md | Переиспользуемые компоненты с примерами | Must-have | 3 | DESIGN_SYSTEM.md |

| 11 | VALIDATION.md | Zod схемы валидации для форм и API | Must-have | 3 | SERVER_ACTIONS.md |

| 12 | AWS_AMPLIFY.md | Конфигурация AWS Amplify Gen 1 | Should-have | 4 | ARCHITECTURE.md |

| 13 | DEPLOYMENT_GUIDE.md | Руководство по развертыванию приложения | Should-have | 4 | AWS_AMPLIFY.md |

| 14 | SECURITY.md | Архитектура безопасности (Cognito, RBAC) | Should-have | 4 | ARCHITECTURE.md |

| 15 | DATA_FLOW.md | Детальные потоки данных от UI до БД | Should-have | 4 | ARCHITECTURE.md |

| 16 | SERVER_COMPONENTS.md | Паттерны использования Server Components | Should-have | 3 | ARCHITECTURE.md |

| 17 | CLIENT_COMPONENTS.md | Паттерны использования Client Components | Should-have | 3 | ARCHITECTURE.md |

| 18 | RESPONSIVE_DESIGN.md | Mobile-First подход и адаптивность | Could-have | — | DESIGN_SYSTEM.md |

| 19 | ACCESSIBILITY.md | WCAG 2.1 AA compliance | Could-have | — | DESIGN_SYSTEM.md |

| 20 | TESTING_STRATEGY.md | Стратегия тестирования (Post-MVP) | Could-have | — | — |

| 21 | CI_CD.md | Детальный CI/CD pipeline | Could-have | — | DEPLOYMENT_GUIDE.md |

---

4. Детальное описание Must-have документов (Фазы 1-3)
ФАЗА 1: ОСНОВА (Критично для старта разработки)
4.1. ARCHITECTURE.md
Путь: docs/architecture/ARCHITECTURE.md

Цель документа:

Предоставить полное понимание архитектуры Sunday School App, описать все компоненты системы, их взаимодействие и ключевые архитектурные решения.

Детальная структура разделов:

Обзор архитектуры
Общее описание системы
Ключевые принципы (Server-First, Mobile-First, Type Safety)
Высокоуровневая диаграмма архитектуры
Диаграмма архитектуры (Mermaid)
Client Layer (Browser, Mobile)
Next.js Application (App Router, Server/Client Components, Server Actions)
Authentication Layer (AWS Cognito, JWT)
Data Layer (amplifyData, AppSync, DynamoDB)
AWS Infrastructure (Amplify Hosting, CloudFront, S3)
Frontend архитектура
Next.js 15.5.9 App Router
Server Components vs Client Components
State management (Zustand — минимально)
Routing и middleware (proxy.ts)
Backend архитектура
AWS Amplify Gen 1 (критично!)
Server Actions для CRUD операций
Data Access Layer: amplifyData from '@/lib/db/amplify'
Паттерн взаимодействия: Server Actions → amplifyData → AppSync → DynamoDB
Database архитектура
DynamoDB как основная БД
AppSync как GraphQL API поверх DynamoDB
Стратегия доступа к данным
Authentication & Authorization
AWS Cognito User Pools
Cognito Groups для ролей (Teacher, Admin, Superadmin)
JWT токены (ID, Access, Refresh)
Middleware для защиты маршрутов
Ключевые архитектурные решения
Почему AWS Amplify Gen 1 (а не Gen 2)
Почему DynamoDB (а не PostgreSQL)
Почему Server Actions (а не API Routes)
Обоснование выбора каждой технологии
Потоки данных
User Request → Next.js App → Server Action → amplifyData → AppSync → DynamoDB
Response flow обратно к клиенту
Кеширование и оптимизация
Ключевые темы для раскрытия:

Разделение ответственности между Frontend и Backend
Интеграция AWS Amplify Gen 1 с Next.js 15.5.9
Паттерны Server Components и их преимущества
Безопасность на уровне архитектуры
Необходимые диаграммы (Mermaid):

High-level architecture diagram (все компоненты системы)
Data flow diagram (от UI до БД и обратно)
Authentication flow diagram (вход пользователя)
Deployment architecture (AWS infrastructure)
Cross-reference:

См. также: docs/database/DYNAMODB_SCHEMA.md
См. также: docs/api/SERVER_ACTIONS.md
См. также: docs/infrastructure/AWS_AMPLIFY.md
Инструкции по использованию Context7:

Получить актуальную документацию Next.js 15.5.9: /vercel/next.js/v15.5.9
Темы: App Router, Server Components, Server Actions, Data Fetching
Получить документацию AWS Amplify Gen 1 (убедиться, что Gen 1!)
Темы: Amplify CLI, Auth, Data, Hosting
---

4.2. ERD.md
Путь: docs/database/ERD.md

Цель документа:

Визуализировать структуру базы данных, все сущности и их связи для полного понимания data model проекта.

Детальная структура разделов:

Обзор
Цель документа
Основные принципы проектирования БД
Используемая БД (DynamoDB)
Главная диаграмма ERD (Mermaid)
Все сущности проекта
Связи между сущностями (one-to-one, one-to-many, many-to-many)
Кардинальность связей
Описание сущностей
Для каждой сущности:

User (преподаватели и администраторы)
Grade (группы учеников)
AcademicYear (учебные годы)
Lesson (уроки)
GoldenVerse (золотые стихи)
LessonGoldenVerse (связь уроков и стихов)
Pupil (ученики)
HomeworkCheck (проверка домашних заданий)
Achievement (достижения/badges)
PupilAchievement (связь учеников и достижений)
Family (семьи)
FamilyMember (члены семей)
GradeEvent (события в расписании группы)
GradeSettings (настройки оценивания группы)
Описание связей
User ↔ Grade (many-to-many через UserGrade)
Grade ↔ AcademicYear (one-to-many)
AcademicYear ↔ Lesson (one-to-many)
Lesson ↔ GoldenVerse (many-to-many)
Pupil ↔ HomeworkCheck (one-to-many)
Pupil ↔ Achievement (many-to-many)
Pupil ↔ Family (many-to-many через FamilyMember)
Grade ↔ GradeSettings (one-to-one)
Grade ↔ GradeEvent (one-to-many)
Бизнес-правила
Lesson создается только для активного (ACTIVE) AcademicYear
Pupil может принадлежать только одной Grade
HomeworkCheck уникален для пары (Lesson, Pupil)
Домик начисляется автоматически при всех выполненных параметрах
Индексы и оптимизация
Часто запрашиваемые поля
Стратегии для быстрых запросов
Ключевые темы для раскрытия:

Полная структура данных приложения
Связи и зависимости между сущностями
Бизнес-правила на уровне данных
Интеграция с DynamoDB (специфика NoSQL)
Необходимые диаграммы (Mermaid):

Полная ERD диаграмма со всеми сущностями
Диаграммы по доменам (Users & Auth, Lessons, Pupils, Achievements)
Cross-reference:

См. также: docs/database/DYNAMODB_SCHEMA.md
См. также: docs/database/GRAPHQL_SCHEMA.md
См. также: docs/database/DATA_MODELING.md
---

4.3. DYNAMODB_SCHEMA.md
Путь: docs/database/DYNAMODB_SCHEMA.md

Цель документа:

Детально описать схему DynamoDB таблиц, включая partition keys, sort keys, GSI (Global Secondary Indexes) и стратегии доступа к данным.

Детальная структура разделов:

Обзор DynamoDB в проекте
Почему DynamoDB (serverless, автомасштабирование, AWS integration)
Особенности NoSQL vs SQL
Billing model (pay-per-request для MVP)
Стратегия моделирования данных
Single Table Design vs Multiple Tables
Выбор для Sunday School App (скорее всего Multiple Tables для простоты MVP)
Access patterns определяют дизайн таблиц
Детальное описание таблиц
Для каждой таблицы:

Название таблицы
Partition Key (PK)
Sort Key (SK) (если есть)
Атрибуты (со типами)
Global Secondary Indexes (GSI)
Local Secondary Indexes (LSI) (если есть)
TTL (Time To Live) (если применимо)
Пример для таблицы Users:

Таблица: Users
PK: userId (String)
SK: — (нет)
Атрибуты: email, name, role, passwordHash, active, createdAt, updatedAt
GSI-1: email-index (PK: email)
GSI-2: role-index (PK: role, SK: createdAt)
Access Patterns
Список всех запросов к БД
Для каждого запроса: какая таблица, какой индекс, как реализован
Примеры:

Получить пользователя по ID → Query Users по PK
Получить пользователя по email → Query GSI email-index
Получить все уроки для AcademicYear → Query Lessons по GSI academicYearId-index
Получить все HomeworkCheck для Lesson → Query HomeworkChecks по GSI lessonId-index
Оптимизация и Best Practices
Избегать сканов (Scan operations)
Использовать проекции для GSI
Batch операции где возможно
Кеширование на уровне приложения
Интеграция с AWS AppSync
Как GraphQL resolvers работают с DynamoDB
Автоматическая генерация таблиц через Amplify
Миграции и обновления схемы
Ключевые темы для раскрытия:

Специфика DynamoDB (PK/SK, GSI)
Стратегии доступа к данным
Оптимизация запросов
Интеграция с Amplify и AppSync
Необходимые диаграммы (Mermaid):

Диаграмма таблиц с PK/SK
Диаграмма GSI для каждой таблицы
Access patterns flow
Cross-reference:

См. также: docs/database/ERD.md
См. также: docs/database/GRAPHQL_SCHEMA.md
См. также: docs/database/DATA_MODELING.md
Инструкции по использованию Context7:

Получить документацию DynamoDB best practices
Темы: Partition Keys, Sort Keys, GSI, Query vs Scan
Получить документацию AWS AppSync
Темы: Resolvers, DynamoDB integration
---

4.4. GRAPHQL_SCHEMA.md
Путь: docs/database/GRAPHQL_SCHEMA.md

Цель документа:

Описать полную GraphQL схему для AWS AppSync, включая типы, queries, mutations, subscriptions и связь с DynamoDB таблицами.

Детальная структура разделов:

Обзор GraphQL API
Роль AppSync в архитектуре
Почему GraphQL (типобезопасность, гибкость запросов)
Связь с DynamoDB через resolvers
GraphQL Schema (полный код)
type User @model @auth(rules: [...]) {
  id: ID!
  email: String!
  name: String!
  role: UserRole!
  grades: [Grade] @manyToMany(relationName: "UserGrades")
  ...
}

type Grade @model @auth(rules: [...]) {
  id: ID!
  name: String!
  teachers: [User] @manyToMany(relationName: "UserGrades")
  academicYears: [AcademicYear] @hasMany
  pupils: [Pupil] @hasMany
  ...
}

# ... все остальные типы
Описание типов
Для каждого типа:

Поля и их типы
Обязательные поля (!)
Связи (@hasMany, @belongsTo, @manyToMany)
Auth rules (@auth директивы)
Queries
type Query {
  getUser(id: ID!): User
  listUsers(filter: UserFilterInput, limit: Int, nextToken: String): UserConnection
  getLesson(id: ID!): Lesson
  listLessons(academicYearId: ID!, limit: Int): LessonConnection
  ...
}
Mutations
type Mutation {
  createUser(input: CreateUserInput!): User
  updateUser(input: UpdateUserInput!): User
  deleteUser(id: ID!): User
  createLesson(input: CreateLessonInput!): Lesson
  createHomeworkCheck(input: CreateHomeworkCheckInput!): HomeworkCheck
  ...
}
Subscriptions (если используются)
type Subscription {
  onCreateLesson(academicYearId: ID): Lesson @aws_subscribe(mutations: ["createLesson"])
  ...
}
Input Types
CreateUserInput
UpdateUserInput
CreateLessonInput
Фильтры для списков
Enums
enum UserRole {
  TEACHER
  ADMIN
  SUPERADMIN
}

enum AcademicYearStatus {
  ACTIVE
  FINISHED
}
Authorization Rules
Правила доступа для каждого типа
Cognito Groups: Teacher, Admin, Superadmin
Примеры @auth директив
Связь с DynamoDB
Как типы маппятся на таблицы
Resolvers для queries и mutations
Автоматическая генерация через Amplify CLI
Ключевые темы для раскрытия:

Полная GraphQL схема приложения
Типобезопасность
Authorization через Cognito
Связи между сущностями в GraphQL
Необходимые диаграммы (Mermaid):

Диаграмма типов и их связей
Authorization flow
Cross-reference:

См. также: docs/database/ERD.md
См. также: docs/database/DYNAMODB_SCHEMA.md
См. также: docs/api/GRAPHQL_API.md
Инструкции по использованию Context7:

Получить документацию AWS AppSync
Темы: GraphQL Schema, @model directive, @auth rules, Resolvers
---

4.5. DATA_MODELING.md
Путь: docs/database/DATA_MODELING.md

Цель документа:

Описать стратегии моделирования данных для DynamoDB, access patterns, оптимизацию запросов и best practices для NoSQL.

Детальная структура разделов:

Обзор
Особенности NoSQL моделирования
Отличия от реляционных БД
Принцип "Access patterns first"
Access Patterns (полный список)
Для каждого паттерна:

Описание запроса
Частота использования
Используемая таблица и индекс
Пример запроса (GraphQL или DynamoDB API)
Примеры:

AP-1: Получить пользователя по ID
AP-2: Получить пользователя по email
AP-3: Получить все уроки для учебного года
AP-4: Получить все проверки ДЗ для урока
AP-5: Получить историю ученика
... (полный список ~30-40 паттернов)
Single Table Design vs Multiple Tables
Обзор подходов
Выбор для Sunday School App
Обоснование решения
Стратегия ключей
Выбор Partition Keys
Выбор Sort Keys
Composite keys
Примеры для каждой таблицы
Global Secondary Indexes (GSI)
Когда создавать GSI
Проектирование GSI для access patterns
Примеры GSI в проекте
Оптимизация запросов
Избегать Scan operations
Batch операции (BatchGetItem, BatchWriteItem)
Pagination для больших списков
Кеширование часто запрашиваемых данных
Денормализация данных
Когда дублировать данные
Trade-offs между storage и performance
Примеры в проекте (например, хранение имени ученика в HomeworkCheck)
Обработка связей
One-to-Many relationships
Many-to-Many relationships (через промежуточные таблицы)
Примеры в проекте
Best Practices
Uniform workload distribution
Hot partitions avoidance
Item size limits (400 KB)
Capacity planning
Ключевые темы для раскрытия:

Стратегии моделирования для DynamoDB
Access patterns как основа дизайна
Оптимизация производительности
Trade-offs NoSQL
Необходимые диаграммы (Mermaid):

Access patterns diagram
GSI strategy diagram
Cross-reference:

См. также: docs/database/DYNAMODB_SCHEMA.md
См. также: docs/database/GRAPHQL_SCHEMA.md
См. также: docs/architecture/ARCHITECTURE.md
---

ФАЗА 2: USER EXPERIENCE (Для разработки UI)
4.6. USER_FLOW.md
Путь: docs/user_flows/USER_FLOW.md

Цель документа:

Описать основные пользовательские сценарии (user flows) для всех ролей с диаграммами, включая happy path и edge cases.

Детальная структура разделов:

Обзор
Типы пользователей (Teacher, Admin, Superadmin)
Основные сценарии для каждой роли
Общие flow
2.1. Аутентификация

Диаграмма входа в систему
Обработка ошибок
Редирект после входа (зависит от роли)
2.2. Навигация

Главное меню
Breadcrumbs
Переходы между страницами
User Flow для Teacher
3.1. Первый вход

Диаграмма с Mermaid
Пошаговый сценарий
3.2. Создание урока

Переход к форме создания
Заполнение полей
Выбор золотых стихов
Сохранение
3.3. Проверка домашних заданий

Открытие урока
Массовая проверка ДЗ
Расчет баллов
Сохранение результатов
3.4. Просмотр личной карточки ученика

Переход к карточке
Просмотр истории
Просмотр достижений
User Flow для Admin
4.1. Управление преподавателями

Создание преподавателя
Назначение на группу
Деактивация
4.2. Управление группами

Создание группы
Настройка параметров оценивания
Назначение учеников
4.3. Завершение учебного года

Глобальное завершение
Создание нового года
Edge Cases и обработка ошибок
Потеря соединения
Валидационные ошибки
Недостаточно прав доступа
Пустые состояния (нет данных)
Mobile vs Desktop flows
Особенности на мобильных устройствах
Touch-friendly элементы
Адаптированная навигация
Ключевые темы для раскрытия:

Полные пользовательские сценарии
Happy path и edge cases
Обработка ошибок
Мобильная версия
Необходимые диаграммы (Mermaid):

Authentication flow
Teacher: Создание урока flow
Teacher: Проверка ДЗ flow
Admin: Управление пользователями flow
Error handling flows
Cross-reference:

См. также: docs/ui_ux/WIREFRAMES.md
См. также: docs/user_flows/TEACHER_FLOWS.md
См. также: docs/user_flows/ADMIN_FLOWS.md
---

4.7. WIREFRAMES.md
Путь: docs/ui_ux/WIREFRAMES.md

Цель документа:

Предоставить детальные wireframes для всех страниц приложения в трех версиях (Desktop, Tablet, Mobile) с описанием интерактивных элементов.

Детальная структура разделов:

Обзор
Цель wireframes
Используемый подход (ASCII art или ссылки на Figma)
Навигационная структура
Публичные страницы
2.1. Страница входа (/auth)

Desktop wireframe
Tablet wireframe
Mobile wireframe
Описание элементов (поля, кнопки, валидация)
Состояния (default, loading, error, success)
Страницы Teacher
3.1. Список учебных годов (/grades/:gradeId)

Wireframes для всех размеров
Элементы: карточки годов, кнопки действий
3.2. Список уроков (/grades/:gradeId/academic-years/:yearId/lessons)

Wireframes
Таблица/список уроков
Фильтры и поиск
Пагинация
3.3. Создание урока (/new-lesson)

Форма создания
Поля: тема, дата, описание, золотые стихи
BlockNote редактор
Валидация
3.4. Проверка ДЗ (/lessons/:lessonId/homework-check)

Таблица учеников
Чекбоксы параметров
Автоматический расчет баллов
Индикатор домика
3.5. Личная карточка ученика (/pupils/:pupilId)

Информация об ученике
Статистика (баллы, домики, badges)
История уроков
Графики прогресса
3.6. Рейтинг группы (/grades/:gradeId/rating)

Таблица рейтинга
Медали топ-3
Визуализация прогресса
Фильтры по периодам
3.7. Расписание группы (/grades/:gradeId/schedule)

Календарь
События (уроки, мероприятия, отмены)
CRUD операции для событий
Страницы Admin
4.1. Dashboard (/grades-list)

Список всех групп
Статистика по школе
4.2. Управление преподавателями (/teachers)

Список преподавателей
CRUD операции
4.3. Управление учениками (/pupils)

Список учеников
Фильтры по группам
CRUD операции
4.4. Управление семьями (/families)

Список семей
Связывание учеников с семьями
4.5. Настройки группы (/grades/:gradeId/settings)

Включение/выключение параметров оценивания
Кастомные метки
Баллы за параметры
4.6. Управление учебным процессом (/school-process-management)

Завершение текущего года
Создание нового года
4.7. Библиотека золотых стихов (/golden-verses)

Список стихов
Поиск и фильтры
Статистика использования
Общие компоненты
Навигационное меню (desktop, mobile)
Breadcrumbs
Модальные окна
Toast уведомления
Loading states
Empty states
Error states
Интерактивные элементы
Кнопки (primary, secondary, danger)
Формы (inputs, selects, checkboxes)
Таблицы
Карточки
Пагинация
Фильтры
Ключевые темы для раскрытия:

Полный набор wireframes для всех страниц
Responsive design (Desktop, Tablet, Mobile)
Интерактивные элементы
Состояния интерфейса
Необходимые диаграммы (Mermaid):

Site map (структура навигации)
Component hierarchy
Cross-reference:

См. также: docs/user_flows/USER_FLOW.md
См. также: docs/ui_ux/DESIGN_SYSTEM.md
См. также: docs/components/COMPONENT_LIBRARY.md
---

4.8. DESIGN_SYSTEM.md
Путь: docs/ui_ux/DESIGN_SYSTEM.md

Цель документа:

Определить единую дизайн-систему проекта на основе Shadcn UI, включая цветовую палитру, типографику, spacing, компоненты и их использование.

Детальная структура разделов:

Обзор дизайн-системы
Цель и принципы
Базирование на Shadcn UI
Интеграция с Tailwind CSS
Цветовая палитра
Primary colors (акцентные)
Secondary colors
Neutral colors (gray scale)
Semantic colors (success, warning, error, info)
Background colors
Text colors
Border colors
HEX коды для всех цветов
Применение в dark mode (если планируется)
Типографика
Font family (например, Inter, system fonts)
Font sizes (scale от xs до 5xl)
Font weights (regular, medium, semibold, bold)
Line heights
Letter spacing
Использование для заголовков (h1-h6)
Использование для body text
Использование для UI элементов
Spacing и Layout
Spacing scale (0, 1, 2, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128)
Margin и padding
Gap для flexbox/grid
Container widths
Breakpoints (mobile: 0-767px, tablet: 768-1023px, desktop: 1024px+)
Компоненты Shadcn UI
Для каждого компонента:

Button (variants: default, destructive, outline, secondary, ghost, link)
Input
Select
Checkbox
Radio
Textarea
Card
Dialog (Modal)
DropdownMenu
Table
Toast
Badge
Avatar
Calendar
Tabs
Accordion
Alert
Progress
Skeleton (loading state)
Для каждого: описание, варианты, примеры использования

Иконки
Используемая библиотека (lucide-react)
Размеры (16, 20, 24, 32px)
Часто используемые иконки в проекте
Анимации
Используемая библиотека (Framer Motion)
Типы анимаций (fade, slide, scale)
Длительность анимаций
Easing functions
Accessibility
ARIA labels
Keyboard navigation
Focus states
Color contrast (WCAG 2.1 AA compliance)
Screen reader support
Responsive Design
Mobile-First подход
Breakpoints и как их использовать
Адаптация компонентов для разных размеров
Примеры применения
Составные компоненты (например, форма входа)
Карточка ученика
Таблица уроков
Модальное окно подтверждения
Ключевые темы для раскрытия:

Полная дизайн-система
Компоненты Shadcn UI
Единообразие интерфейса
Accessibility
Необходимые диаграммы (Mermaid):

Color palette visualization (если возможно)
Typography scale
Spacing scale
Cross-reference:

См. также: docs/ui_ux/WIREFRAMES.md
См. также: docs/components/COMPONENT_LIBRARY.md
См. также: docs/ui_ux/RESPONSIVE_DESIGN.md
Инструкции по использованию Context7:

Получить документацию Shadcn UI (если доступно)
Получить документацию Tailwind CSS для кастомизации
---

ФАЗА 3: IMPLEMENTATION (Для разработки функционала)
4.9. SERVER_ACTIONS.md
Путь: docs/api/SERVER_ACTIONS.md

Цель документа:

Описать API контракты для всех Next.js Server Actions, включая входные/выходные типы, валидацию, обработку ошибок.

Детальная структура разделов:

Обзор Server Actions
Что такое Server Actions в Next.js 15
Почему Server Actions (а не API Routes)
Интеграция с amplifyData
Архитектура Server Actions
Расположение файлов (app/actions/)
Организация по доменам (lessons.ts, pupils.ts, users.ts, etc.)
Паттерн вызова из компонентов
Lessons Actions
Для каждого action:

Сигнатура функции
Входные параметры (типы)
Выходные данные (типы)
Пример использования
Обработка ошибок
Примеры:

createLesson(input: CreateLessonInput): Promise<Lesson>
updateLesson(id: string, input: UpdateLessonInput): Promise<Lesson>
deleteLesson(id: string): Promise<void>
getLesson(id: string): Promise<Lesson>
listLessons(academicYearId: string): Promise<Lesson[]>
Pupils Actions
createPupil(...)
updatePupil(...)
getPupil(...)
listPupils(...)
deactivatePupil(...)
HomeworkCheck Actions
createHomeworkCheck(...)
updateHomeworkCheck(...)
batchCreateHomeworkChecks(...)
getHomeworkChecksForLesson(...)
getHomeworkChecksForPupil(...)
Users (Teachers) Actions
createUser(...)
updateUser(...)
assignUserToGrade(...)
removeUserFromGrade(...)
Grades Actions
createGrade(...)
updateGrade(...)
getGrade(...)
listGrades(...)
AcademicYear Actions
createAcademicYear(...)
finishAcademicYear(...)
getActiveAcademicYear(...)
Families Actions
createFamily(...)
updateFamily(...)
addPupilToFamily(...)
removePupilFromFamily(...)
GoldenVerse Actions
listGoldenVerses(...)
getGoldenVerseStats(...)
Achievements Actions
checkAndAwardAchievements(pupilId: string): Promise<Achievement[]>
Валидация (Zod)
Схемы валидации для каждого Input типа
Пример валидации в Server Action
Обработка ошибок валидации
Обработка ошибок
Типы ошибок (ValidationError, AuthorizationError, NotFoundError)
Паттерн обработки в Server Actions
Возврат ошибок клиенту
Authorization
Проверка прав доступа в Server Actions
Получение userId из сессии
Проверка роли пользователя
Примеры для Teacher и Admin
Интеграция с amplifyData
Паттерн вызова: await amplifyData.create(...), await amplifyData.update(...), etc.
Обработка результатов от AppSync
Ключевые темы для раскрытия:

Полный список Server Actions
API контракты с типами
Валидация (Zod)
Обработка ошибок
Authorization
Необходимые диаграммы (Mermaid):

Server Action flow (from UI to DynamoDB)
Authorization flow
Cross-reference:

См. также: docs/architecture/ARCHITECTURE.md
См. также: docs/api/VALIDATION.md
См. также: docs/database/GRAPHQL_SCHEMA.md
Инструкции по использованию Context7:

Получить документацию Next.js 15.5.9 для Server Actions
Темы: Server Actions, use server directive, error handling
---

4.10. COMPONENT_LIBRARY.md
Путь: docs/components/COMPONENT_LIBRARY.md

Цель документа:

Описать все переиспользуемые компоненты проекта, включая props, типы, примеры использования и композицию компонентов.

Детальная структура разделов:

Обзор
Структура компонентов (атомарный дизайн)
Организация файлов (app/components/)
Server vs Client Components
Базовые компоненты (Atoms)
Для каждого компонента:

Название и путь
Описание
Props (типы)
Примеры использования
Server или Client Component
Примеры:

Button (from Shadcn UI, кастомизированный)
Input
Select
Checkbox
Badge
Avatar
Icon (lucide-react wrapper)
Составные компоненты (Molecules)
FormField (label + input + error message)
SearchBar (input + button)
PupilCard (avatar + name + stats)
LessonCard (lesson info card)
ToastNotification
Сложные компоненты (Organisms)
LessonForm (форма создания/редактирования урока)
HomeworkCheckTable (таблица проверки ДЗ)
PupilRatingTable (таблица рейтинга)
NavigationMenu (главное меню)
Breadcrumbs
CalendarSchedule (календарь расписания)
Layout компоненты
PageLayout (обертка страницы с навигацией)
DashboardLayout (layout для dashboard)
Container (responsive container)
Server Components
Какие компоненты должны быть Server Components
Примеры (LessonsList, PupilsList)
Data fetching в Server Components
Client Components
Какие компоненты должны быть Client Components
Примеры (FormComponents, Modals, Interactive UI)
"use client" directive
Композиция компонентов
Как комбинировать компоненты
Примеры составных UI
Best practices
Специальные компоненты
BlockNoteEditor (интеграция BlockNote для редактирования уроков)
AchievementBadge (визуализация достижений)
HouseProgressIndicator (индикатор домиков)
Стилизация
Использование Tailwind CSS
Кастомные классы
Responsive стили
Ключевые темы для раскрытия:

Полная библиотека компонентов
Props и типы
Server vs Client Components
Композиция
Примеры использования
Необходимые диаграммы (Mermaid):

Component hierarchy
Atomic design structure
Cross-reference:

См. также: docs/ui_ux/DESIGN_SYSTEM.md
См. также: docs/components/SERVER_COMPONENTS.md
См. также: docs/components/CLIENT_COMPONENTS.md
---

4.11. VALIDATION.md
Путь: docs/api/VALIDATION.md

Цель документа:

Описать все Zod схемы валидации для форм и API, включая валидацию на клиенте и сервере, обработку ошибок валидации.

Детальная структура разделов:

Обзор валидации
Почему Zod (типобезопасность, runtime validation)
Валидация на клиенте vs сервере
Интеграция с React Hook Form (если используется)
Базовые схемы
import { z } from 'zod';

const emailSchema = z.string().email("Некорректный email");
const passwordSchema = z.string().min(8, "Минимум 8 символов");
Схемы для Lessons
const CreateLessonSchema = z.object({
  title: z.string().min(3, "Минимум 3 символа"),
  lessonDate: z.date(),
  content: z.string().optional(),
  goldenVerseIds: z.array(z.string()).min(1, "Выберите хотя бы один золотой стих"),
  academicYearId: z.string(),
});

type CreateLessonInput = z.infer<typeof CreateLessonSchema>;
Схемы для Pupils
const CreatePupilSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  middleName: z.string().optional(),
  dateOfBirth: z.date(),
  gradeId: z.string(),
});
Схемы для HomeworkCheck
const CreateHomeworkCheckSchema = z.object({
  lessonId: z.string(),
  pupilId: z.string(),
  goldenVerse: z.boolean(),
  test: z.boolean(),
  notebook: z.boolean(),
  singing: z.boolean(),
  points: z.number().int().min(0),
});
Схемы для Users
const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(8),
  role: z.enum(['TEACHER', 'ADMIN', 'SUPERADMIN']),
});
Схемы для Grades
Схемы для Families
Схемы для GradeSettings
Валидация на клиенте
Использование в формах
Отображение ошибок валидации
Примеры с React Hook Form (если используется)
Валидация на сервере (Server Actions)
'use server';

export async function createLesson(input: unknown) {
  const validated = CreateLessonSchema.safeParse(input);
  if (!validated.success) {
    return { error: validated.error.format() };
  }
  
  // Продолжить с validated.data
  const lesson = await amplifyData.create('Lesson', validated.data);
  return { data: lesson };
}
Обработка ошибок валидации
Формат ошибок Zod
Отображение ошибок пользователю
Toast уведомления
Кастомные валидаторы
Валидация дат (например, lessonDate не в будущем для завершенных годов)
Валидация на основе business logic
Типобезопасность
Использование z.infer<typeof Schema> для генерации TypeScript типов
Согласованность типов между клиентом и сервером
Ключевые темы для раскрытия:

Полный набор Zod схем
Валидация на клиенте и сервере
Обработка ошибок
Типобезопасность
Cross-reference:

См. также: docs/api/SERVER_ACTIONS.md
См. также: docs/components/COMPONENT_LIBRARY.md
---

5. Описание Should-have документов (Фаза 4)
5.1. AWS_AMPLIFY.md
Путь: docs/infrastructure/AWS_AMPLIFY.md

Описание: Детальная конфигурация AWS Amplify Gen 1, включая amplify.yml, environment variables, backend ресурсы (Cognito, AppSync, DynamoDB), CLI команды.

Основные разделы:

Инициализация проекта (amplify init)
Добавление Auth (amplify add auth)
Добавление API (amplify add api)
Конфигурация GraphQL schema
Deployment (amplify push)
Environment variables
amplify.yml для CI/CD
Cross-reference: ARCHITECTURE.md, DEPLOYMENT_GUIDE.md

---

5.2. DEPLOYMENT_GUIDE.md
Путь: docs/deployment/DEPLOYMENT_GUIDE.md

Описание: Пошаговое руководство по развертыванию приложения на AWS Amplify, включая настройку CI/CD, environment variables, проверку после деплоя.

Основные разделы:

Prerequisites (AWS аккаунт, Amplify CLI)
Инициализация Amplify проекта
Подключение Git репозитория
Настройка build settings (amplify.yml)
Environment variables (secrets)
Deployment процесс
Проверка после деплоя
Troubleshooting
Cross-reference: AWS_AMPLIFY.md, CI_CD.md

---

5.3. SECURITY.md
Путь: docs/architecture/SECURITY.md

Описание: Архитектура безопасности, включая AWS Cognito конфигурацию, RBAC (Role-Based Access Control), защиту данных, CSRF protection.

Основные разделы:

Authentication (AWS Cognito)
Authorization (Cognito Groups, RBAC)
JWT токены (хранение, обновление)
Middleware защита маршрутов
CSRF protection (Server Actions)
Валидация входных данных
Защита от SQL injection (N/A для DynamoDB, но GraphQL injection)
HTTPS everywhere
Secrets management
Cross-reference: ARCHITECTURE.md, AUTH_API.md

---

5.4. DATA_FLOW.md
Путь: docs/architecture/DATA_FLOW.md

Описание: Детальные потоки данных в приложении от UI до БД и обратно, включая кеширование, оптимизацию, обработку ошибок.

Основные разделы:

Request flow (User → Next.js → Server Action → amplifyData → AppSync → DynamoDB)
Response flow (обратно)
Кеширование (Next.js cache, React cache)
Оптимизация запросов
Batch operations
Error propagation
Loading states
Real-time updates (Subscriptions, если используются)
Cross-reference: ARCHITECTURE.md, SERVER_ACTIONS.md

---

5.5. SERVER_COMPONENTS.md
Путь: docs/components/SERVER_COMPONENTS.md

Описание: Паттерны использования Server Components в Next.js 15, когда использовать, best practices, data fetching.

Основные разделы:

Что такое Server Components
Когда использовать Server Components
Data fetching в Server Components
Композиция Server и Client Components
Передача данных от Server к Client Components
Best practices
Типичные ошибки
Cross-reference: ARCHITECTURE.md, CLIENT_COMPONENTS.md

---

5.6. CLIENT_COMPONENTS.md
Путь: docs/components/CLIENT_COMPONENTS.md

Описание: Паттерны использования Client Components, когда использовать, state management, интерактивность.

Основные разделы:

Что такое Client Components
Когда использовать Client Components (интерактивность, hooks)
"use client" directive
State management (useState, Zustand)
Event handlers
Композиция с Server Components
Best practices
Типичные ошибки
Cross-reference: ARCHITECTURE.md, SERVER_COMPONENTS.md

---

6. Порядок создания документов (Фазирование)
Фаза 1: Основа (Критично для старта разработки)
Цель: Создать архитектурный фундамент и схему данных

Документы:

ARCHITECTURE.md — понимание системы
ERD.md — структура данных
DYNAMODB_SCHEMA.md — техническая реализация БД
GRAPHQL_SCHEMA.md — API над БД
DATA_MODELING.md — стратегии доступа к данным
Зависимости:

DYNAMODB_SCHEMA.md зависит от ERD.md
GRAPHQL_SCHEMA.md зависит от DYNAMODB_SCHEMA.md
DATA_MODELING.md зависит от DYNAMODB_SCHEMA.md
Срок: 1-2 недели

---

Фаза 2: User Experience (Для разработки UI)
Цель: Определить пользовательские сценарии и дизайн интерфейса

Документы:

USER_FLOW.md — как пользователи взаимодействуют с системой
WIREFRAMES.md — визуальное представление страниц
DESIGN_SYSTEM.md — единая дизайн-система
Зависимости:

USER_FLOW.md зависит от ARCHITECTURE.md
WIREFRAMES.md зависит от USER_FLOW.md
DESIGN_SYSTEM.md зависит от WIREFRAMES.md
Срок: 1-2 недели

---

Фаза 3: Implementation (Для разработки функционала)
Цель: Предоставить детальные спецификации для реализации

Документы:

SERVER_ACTIONS.md — API контракты
COMPONENT_LIBRARY.md — переиспользуемые компоненты
VALIDATION.md — схемы валидации
SERVER_COMPONENTS.md — паттерны Server Components
CLIENT_COMPONENTS.md — паттерны Client Components
Зависимости:

SERVER_ACTIONS.md зависит от ARCHITECTURE.md, GRAPHQL_SCHEMA.md
COMPONENT_LIBRARY.md зависит от DESIGN_SYSTEM.md
VALIDATION.md зависит от SERVER_ACTIONS.md
Срок: 2-3 недели

---

Фаза 4: Deployment (Для развертывания)
Цель: Подготовить инфраструктуру и процесс развертывания

Документы:

AWS_AMPLIFY.md — конфигурация Amplify Gen 1
DEPLOYMENT_GUIDE.md — руководство по деплою
SECURITY.md — архитектура безопасности
DATA_FLOW.md — детальные потоки данных
Зависимости:

AWS_AMPLIFY.md зависит от ARCHITECTURE.md
DEPLOYMENT_GUIDE.md зависит от AWS_AMPLIFY.md
SECURITY.md зависит от ARCHITECTURE.md
Срок: 1-2 недели

---

7. Обеспечение непротиворечивости
7.1. Единая терминология
Глоссарий терминов:

| Термин | Определение |

|--------|-------------|

| Teacher | Преподаватель воскресной школы |

| Admin | Администратор школы |

| Superadmin | Главный администратор |

| Pupil | Ученик |

| Grade | Группа учеников |

| Academic Year | Учебный год |

| Lesson | Урок |

| Golden Verse | Золотой стих (библейский стих для запоминания) |

| Homework Check | Проверка домашнего задания |

| Achievement / Badge | Достижение ученика |

| House | Домик (визуальный индикатор прогресса) |

| amplifyData | Data Access Layer для работы с AppSync/DynamoDB |

| Server Action | Next.js серверная функция для обработки запросов |

Правила:

Использовать термины консистентно во всех документах
Не использовать синонимы (например, "Teacher" и "Преподаватель" — выбрать один вариант для технической документации)
Обновлять глоссарий при добавлении новых терминов
---

7.2. Cross-reference стратегия
Правила:

В каждом документе указывать связанные документы в секции "Cross-reference"
Использовать относительные пути для ссылок: ARCHITECTURE.md
При изменении одного документа проверять связанные документы на непротиворечивость
Создать индексный документ (README.md в docs/) со ссылками на все документы
Пример cross-reference:

## Cross-reference

- См. также: [`docs/architecture/ARCHITECTURE.md`](../architecture/ARCHITECTURE.md) — общая архитектура
- См. также: [`docs/database/DYNAMODB_SCHEMA.md`](../database/DYNAMODB_SCHEMA.md) — схема БД
- См. также: [`docs/api/SERVER_ACTIONS.md`](../api/SERVER_ACTIONS.md) — API контракты
---

7.3. Процесс валидации документации
Чек-лист для каждого документа:

Полнота:
[ ] Все секции заполнены
[ ] Нет "TODO" или пустых секций
[ ] Диаграммы (Mermaid) созданы
Непротиворечивость:
[ ] Терминология совпадает с глоссарием
[ ] Нет противоречий с другими документами
[ ] Cross-reference ссылки корректны
Техническая точность:
[ ] Использованы актуальные версии технологий
[ ] Код примеров корректен
[ ] Диаграммы соответствуют реальной архитектуре
Качество изложения:
[ ] Ясность и понятность
[ ] Структурированность
[ ] Отсутствие опечаток
Процесс ревью:

Самопроверка автором (чек-лист)
Peer review (другой разработчик)
Проверка на непротиворечивость (сравнение с связанными документами)
Финальное утверждение
---

8. Диаграмма связей документов
ARCHITECTURE.md
ERD.md
DYNAMODB_SCHEMA.md
GRAPHQL_SCHEMA.md
DATA_MODELING.md
USER_FLOW.md
WIREFRAMES.md
DESIGN_SYSTEM.md
SERVER_ACTIONS.md
COMPONENT_LIBRARY.md
VALIDATION.md
AWS_AMPLIFY.md
DEPLOYMENT_GUIDE.md
SECURITY.md
DATA_FLOW.md
SERVER_COMPONENTS.md
CLIENT_COMPONENTS.md
Легенда:

🔵 Голубой (Фаза 1) — Архитектура и БД
🟡 Желтый (Фаза 2) — UX/UI
🟢 Зеленый (Фаза 3) — Implementation
🟣 Фиолетовый (Фаза 4) — Deployment
---

9. Критерии качества документации
9.1. Стандарты оформления
Структура каждого документа:

# [Название документа] - Sunday School App

## Версия документа: 1.0
**Дата создания:** [Дата]
**Последнее обновление:** [Дата]
**Проект:** Sunday School App
**Технологии:** [Релевантные технологии]

---

## 1. Обзор
[Краткое описание цели документа]

---

## [Основные секции]
[Содержание с диаграммами Mermaid где необходимо]

---

## Cross-reference
[Ссылки на связанные документы]

---

**Версия:** 1.0
**Последнее обновление:** [Дата]
**Автор:** AI Documentation Team
Правила Markdown:

Использовать заголовки (#, ##, ###) для иерархии
Использовать списки (-, *) для перечислений
Использовать таблицы для структурированных данных
Использовать блоки кода (```) с указанием языка
Использовать Mermaid диаграммы для визуализации
Использовать блоки Note/Warning/Important (> [!NOTE])
---

9.2. Критерии полноты
Для каждого документа:

Содержание:
Все запланированные секции заполнены
Достаточный уровень детализации для разработки
Примеры кода (где применимо)
Диаграммы (Mermaid)
Техническая точность:
Корректные версии технологий
Рабочие примеры кода
Актуальная информация (использование Context7)
Понятность:
Ясное изложение
Логичная структура
Примеры и пояснения
Актуальность:
Использование последних best practices
Соответствие современным стандартам
Актуальная документация технологий
---

9.3. Процесс ревью
Шаги ревью документа:

Самопроверка автором (30 мин)
Проверка по чек-листу
Исправление опечаток
Проверка ссылок
Техническое ревью (1-2 часа)
Проверка технической корректности
Валидация примеров кода
Проверка диаграмм
Проверка непротиворечивости (30 мин)
Сравнение с связанными документами
Проверка терминологии
Проверка cross-reference
Финальное утверждение
Одобрение документа
Публикация в репозиторий
---

10. Следующие шаги
10.1. Как использовать этот план
Для AI агента / разработчика:

Начать с Фазы 1 (критично для старта)
Прочитать обязательные документы проекта (app_functionality.md, tech_stack.md, MVP_SCOPE.md)
Создать ARCHITECTURE.md
Создать ERD.md
Создать DYNAMODB_SCHEMA.md
Создать GRAPHQL_SCHEMA.md
Создать DATA_MODELING.md
Перейти к Фазе 2 (для разработки UI)
Создать USER_FLOW.md
Создать WIREFRAMES.md
Создать DESIGN_SYSTEM.md
Перейти к Фазе 3 (для разработки функционала)
Создать SERVER_ACTIONS.md
Создать COMPONENT_LIBRARY.md
Создать VALIDATION.md
Создать SERVER_COMPONENTS.md и CLIENT_COMPONENTS.md
Завершить Фазой 4 (для развертывания)
Создать AWS_AMPLIFY.md
Создать DEPLOYMENT_GUIDE.md
Создать SECURITY.md
Создать DATA_FLOW.md
После каждого документа:

Проверить по чек-листу качества
Обновить cross-reference в связанных документах
Коммитить в Git с описательным сообщением
---

10.2. Рекомендации по процессу создания документации
Best Practices:

Использование Context7 для актуальности
Перед созданием документа получить актуальную документацию технологий
Особенно важно для Next.js 15.5.9 и AWS Amplify Gen 1
Итеративный подход
Создать базовую версию документа (MVP)
Получить обратную связь
Дополнить и улучшить
Фокус на применимости
Документация должна помогать разработке
Примеры кода должны быть рабочими
Диаграммы должны отражать реальную архитектуру
Поддержание актуальности
Обновлять документацию при изменениях в коде
Версионировать документы
Указывать дату последнего обновления
Непротиворечивость
Регулярно проверять связанные документы
Использовать единую терминологию
Обновлять cross-reference
---

10.3. Инструкции по Context7
Для получения актуальной документации используйте:

Next.js 15.5.9
Шаг 1: mcp_context7_resolve-library-id с libraryName: "next.js"
Шаг 2: mcp_context7_get-library-docs с context7CompatibleLibraryID: "/vercel/next.js/v15.5.9"
(или последняя доступная 15.x версия)
Темы для запросов:

App Router
Server Components vs Client Components
Server Actions
Data Fetching
Middleware
Route Handlers
Image Optimization
AWS Amplify Gen 1
Шаг 1: mcp_context7_resolve-library-id с libraryName: "aws-amplify"
Шаг 2: Убедиться, что документация относится к Gen 1 (НЕ Gen 2!)
⚠️ КРИТИЧНО: Проверить, что команды относятся к Gen 1:

amplify init, amplify add api, amplify push — ✅ Gen 1
npx ampx ... — ❌ Gen 2 (НЕ ИСПОЛЬЗОВАТЬ!)
Темы для запросов:

Amplify CLI (Gen 1)
Auth (Cognito)
Data (AppSync)
Storage (S3)
Hosting
DynamoDB + AppSync
Шаг 1: mcp_context7_resolve-library-id с libraryName: "aws-appsync"
Шаг 2: mcp_context7_resolve-library-id с libraryName: "dynamodb"
Темы для запросов:

DynamoDB data modeling
Partition keys и sort keys
Global Secondary Indexes (GSI)
AppSync GraphQL resolvers
Best practices для NoSQL
React 19
Шаг 1: mcp_context7_resolve-library-id с libraryName: "react"
Темы для запросов:

React Compiler
use() hook
Server Components
Suspense boundaries
---

Примечание в каждом документе:

> [!NOTE]
> Документация основана на актуальных источниках:
> - Next.js 15.5.9 — официальная документация
> - AWS Amplify Gen 1 — официальная документация
> - DynamoDB best practices — AWS документация
---

Заключение
Этот план предоставляет структурированный подход к созданию полной технической документации для проекта Sunday School App. Следование плану обеспечит:

✅ Полноту — охват всех аспектов проекта

✅ Непротиворечивость — согласованность между документами

✅ Актуальность — использование современных технологий и best practices

✅ Применимость — документация, которая помогает разработке

Начните с Фазы 1 и двигайтесь последовательно. Успехов в создании документации!