# Phase 03: Настройка базы данных DynamoDB

## Описание фазы
Создание DynamoDB таблиц на основе ERD, настройка Partition Keys, Sort Keys, Global Secondary Indexes (GSI).

## Зависимости
Phase 02: Настройка AWS Amplify Gen 1

## Оценка времени
4-6 часов

## Требования к AI Agent

> [!IMPORTANT]
> - AI Agent при создании программного кода должен использовать актуальную документацию для конкретной версии библиотеки или фреймворка через Context7
> - Для DynamoDB должна быть использована официальная документация AWS
> - Перед созданием схемы необходимо изучить ERD и DYNAMODB_SCHEMA документацию проекта
> - Следовать принципам из `docs/guidelines/prompts/general_prompt_guidelines.md`

## Задачи

### Task 03.01: Изучение схемы базы данных
- [ ] Изучить [ERD.md](../../../database/ERD.md) - все сущности и их связи
- [ ] Изучить [DYNAMODB_SCHEMA.md](../../../database/DYNAMODB_SCHEMA.md) - структуру таблиц, ключи, индексы
- [ ] Изучить [DATA_MODELING.md](../../../database/DATA_MODELING.md) - стратегии моделирования данных
- [ ] Составить список всех таблиц, которые необходимо создать
- [ ] Составить список всех GSI, которые необходимо создать

**Документация:**
- [ERD.md](../../../database/ERD.md) - Entity Relationship Diagram
- [DYNAMODB_SCHEMA.md](../../../database/DYNAMODB_SCHEMA.md) - Схема DynamoDB
- [DATA_MODELING.md](../../../database/DATA_MODELING.md) - Моделирование данных

**Критерии приемки:**
- Понимание структуры всех сущностей
- Понимание access patterns для каждой сущности
- Список таблиц и индексов составлен

---

### Task 03.02: Добавление API ресурса в Amplify
- [ ] Запустить `amplify add api`
- [ ] Выбрать опции:
  - Please select from one of the below mentioned services: `GraphQL`
  - Provide API name: `sunschoolapi` (или другое имя)
  - Choose the default authorization type: `Amazon Cognito User Pool`
  - Do you want to configure advanced settings: `Yes`
  - Configure additional auth types: выбрать при необходимости
  - Configure conflict detection: `Yes` (для оптимистичной блокировки)
- [ ] Дождаться завершения настройки

**Документация:**
- [AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md) - раздел API Setup
- [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md) - GraphQL Schema

**Критерии приемки:**
- API ресурс добавлен в Amplify проект
- GraphQL API создан
- Конфигурация сохранена

---

### Task 03.03: Создание GraphQL Schema - Базовые типы
- [ ] Открыть файл `amplify/backend/api/[api-name]/schema.graphql`
- [ ] Создать базовые типы согласно [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md):
  - Тип `User` с полями из ERD
  - Тип `Grade` с полями из ERD
  - Тип `AcademicYear` с полями из ERD
  - Тип `Lesson` с полями из ERD
  - Тип `Pupil` с полями из ERD
  - Тип `Family` с полями из ERD
- [ ] Добавить все необходимые enum типы (Status, Role, EventType и др.)

**Документация:**
- [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md) - раздел Types
- [ERD.md](../../../database/ERD.md) - все сущности

**Критерии приемки:**
- Все базовые типы созданы в schema.graphql
- Типы соответствуют ERD
- Enum типы определены корректно

---

### Task 03.04: Создание GraphQL Schema - Связи и связи многие-ко-многим
- [ ] Добавить типы для связей многие-ко-многим:
  - `UserGrade` для связи User-Grade
  - `LessonGoldenVerse` для связи Lesson-GoldenVerse
  - `PupilFamily` для связи Pupil-Family (если необходимо)
- [ ] Добавить связи через поля в типах:
  - В `Grade` добавить поле `teachers: [User]`
  - В `Lesson` добавить поле `homeworkChecks: [HomeworkCheck]`
  - И другие связи согласно ERD

**Документация:**
- [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md) - раздел Relationships
- [ERD.md](../../../database/ERD.md) - связи между сущностями

**Критерии приемки:**
- Все связи определены в schema
- Связи многие-ко-многим реализованы через промежуточные типы
- Схема соответствует ERD

---

### Task 03.05: Настройка @auth директив для типов
- [ ] Добавить @auth директивы для каждого типа согласно [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md)
- [ ] Настроить правила авторизации:
  - `@auth(rules: [{ allow: owner }])` для личных данных
  - `@auth(rules: [{ allow: groups, groups: ["ADMIN"] }])` для Admin-only типов
  - `@auth(rules: [{ allow: groups, groups: ["TEACHER", "ADMIN"] }])` для Teacher и Admin
- [ ] Проверить, что все типы имеют правильные @auth директивы

**Документация:**
- [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md) - раздел Authorization
- [SECURITY.md](../../../infrastructure/SECURITY.md) - раздел RBAC
- AWS AppSync @auth документация (через Context7)

**Критерии приемки:**
- Все типы имеют @auth директивы
- Правила авторизации соответствуют требованиям безопасности
- Admin-only типы защищены правильно

---

### Task 03.06: Настройка DynamoDB таблиц через @model
- [ ] Добавить @model директиву к каждому типу, который должен быть таблицей
- [ ] Настроить Partition Keys и Sort Keys через @key директивы согласно [DYNAMODB_SCHEMA.md](../../../database/DYNAMODB_SCHEMA.md)
- [ ] Пример: `@model @key(name: "byGrade", fields: ["gradeId"], queryField: "lessonsByGrade")`
- [ ] Убедиться, что ключи соответствуют access patterns

**Документация:**
- [DYNAMODB_SCHEMA.md](../../../database/DYNAMODB_SCHEMA.md) - раздел Keys
- [DATA_MODELING.md](../../../database/DATA_MODELING.md) - раздел Access Patterns
- AWS AppSync @model документация (через Context7)

**Критерии приемки:**
- Все типы с @model имеют правильные ключи
- Partition Keys и Sort Keys настроены согласно схеме
- Access patterns поддерживаются через ключи

---

### Task 03.07: Создание Global Secondary Indexes (GSI)
- [ ] Добавить GSI через @key директивы согласно [DYNAMODB_SCHEMA.md](../../../database/DYNAMODB_SCHEMA.md)
- [ ] Создать GSI1 для каждого типа (если требуется)
- [ ] Создать GSI2 для каждого типа (если требуется)
- [ ] Убедиться, что GSI поддерживают необходимые access patterns

**Документация:**
- [DYNAMODB_SCHEMA.md](../../../database/DYNAMODB_SCHEMA.md) - раздел GSI
- [DATA_MODELING.md](../../../database/DATA_MODELING.md) - раздел GSI Usage
- AWS DynamoDB GSI документация (через Context7)

**Критерии приемки:**
- Все необходимые GSI созданы
- GSI поддерживают требуемые access patterns
- Индексы настроены корректно

---

### Task 03.08: Добавление Queries в GraphQL Schema
- [ ] Добавить queries согласно [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md):
  - `getUser(id: ID!): User`
  - `listGrades: [Grade]`
  - `getGrade(id: ID!): Grade`
  - `listLessons(gradeId: ID!): [Lesson]`
  - И другие queries согласно схеме
- [ ] Настроить @auth для queries
- [ ] Добавить фильтрацию и пагинацию где необходимо

**Документация:**
- [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md) - раздел Queries
- [SERVER_ACTIONS.md](../../../api/SERVER_ACTIONS.md) - использование queries

**Критерии приемки:**
- Все необходимые queries добавлены
- Queries имеют правильные @auth директивы
- Фильтрация и пагинация настроены

---

### Task 03.09: Добавление Mutations в GraphQL Schema
- [ ] Добавить mutations согласно [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md):
  - `createUser(input: CreateUserInput!): User`
  - `updateUser(input: UpdateUserInput!): User`
  - `createGrade(input: CreateGradeInput!): Grade`
  - `updateGrade(input: UpdateGradeInput!): Grade`
  - И другие mutations согласно схеме
- [ ] Настроить @auth для mutations
- [ ] Добавить Input типы для всех mutations

**Документация:**
- [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md) - раздел Mutations
- [SERVER_ACTIONS.md](../../../api/SERVER_ACTIONS.md) - использование mutations

**Критерии приемки:**
- Все необходимые mutations добавлены
- Mutations имеют правильные @auth директивы
- Input типы созданы для всех mutations

---

### Task 03.10: Добавление Subscriptions (опционально)
- [ ] Добавить subscriptions для real-time обновлений (если требуется):
  - `onCreateLesson: Lesson @aws_subscribe(mutations: ["createLesson"])`
  - `onUpdateLesson: Lesson @aws_subscribe(mutations: ["updateLesson"])`
  - И другие subscriptions при необходимости
- [ ] Настроить @auth для subscriptions

**Документация:**
- [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md) - раздел Subscriptions
- AWS AppSync Subscriptions документация (через Context7)

**Критерии приемки:**
- Subscriptions добавлены (если требуются)
- Subscriptions имеют правильные @auth директивы

---

### Task 03.11: Валидация GraphQL Schema
- [ ] Проверить синтаксис schema: `amplify api gql-compile`
- [ ] Убедиться, что нет синтаксических ошибок
- [ ] Проверить, что все типы правильно связаны
- [ ] Убедиться, что все @auth директивы корректны

**Документация:**
- [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md)
- AWS AppSync документация (через Context7)

**Критерии приемки:**
- Schema компилируется без ошибок
- Все типы и связи корректны
- @auth директивы валидны

---

### Task 03.12: Push схемы в AWS (создание таблиц)
- [ ] Запустить `amplify push`
- [ ] Подтвердить создание ресурсов: `Yes`
- [ ] Дождаться завершения создания таблиц DynamoDB
- [ ] Проверить статус: `amplify status`
- [ ] Убедиться, что все таблицы созданы в AWS Console

**Документация:**
- [AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md) - раздел Push
- AWS DynamoDB Console документация

**Критерии приемки:**
- Команда `amplify push` выполнена успешно
- Все таблицы DynamoDB созданы в AWS
- Все GSI созданы
- AppSync API создан и работает

---

### Task 03.13: Проверка созданных таблиц в AWS Console
- [ ] Открыть AWS Console -> DynamoDB
- [ ] Проверить наличие всех таблиц
- [ ] Проверить структуру каждой таблицы (ключи, индексы)
- [ ] Убедиться, что GSI созданы корректно
- [ ] Проверить настройки таблиц (read/write capacity, billing mode)

**Документация:**
- [DYNAMODB_SCHEMA.md](../../../database/DYNAMODB_SCHEMA.md)
- AWS DynamoDB Console документация

**Критерии приемки:**
- Все таблицы видны в AWS Console
- Структура таблиц соответствует схеме
- GSI созданы и работают

---

### Task 03.14: Тестирование GraphQL API
- [ ] Открыть AWS AppSync Console
- [ ] Перейти в раздел Queries
- [ ] Протестировать простой query (например, `listGrades`)
- [ ] Протестировать простую mutation (например, `createGrade`)
- [ ] Проверить работу авторизации

**Документация:**
- [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md)
- AWS AppSync Console документация

**Критерии приемки:**
- GraphQL API работает корректно
- Queries возвращают данные
- Mutations создают записи
- Авторизация работает

---

### Task 03.15: Документирование созданной схемы
- [ ] Обновить [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md) если были изменения
- [ ] Задокументировать любые отклонения от первоначальной схемы
- [ ] Создать заметки о важных решениях по моделированию данных

**Документация:**
- [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md)
- [DATA_MODELING.md](../../../database/DATA_MODELING.md)

**Критерии приемки:**
- Документация обновлена
- Изменения задокументированы
- Важные решения записаны

---

## Ссылки на документацию проекта

- [ERD.md](../../../database/ERD.md) - Entity Relationship Diagram
- [DYNAMODB_SCHEMA.md](../../../database/DYNAMODB_SCHEMA.md) - Схема DynamoDB
- [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md) - GraphQL Schema
- [DATA_MODELING.md](../../../database/DATA_MODELING.md) - Моделирование данных
- [AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md) - Настройка AWS Amplify

---

## Примечания

- Убедитесь, что все таблицы созданы согласно ERD
- Partition Keys и Sort Keys критически важны для производительности
- GSI должны поддерживать все необходимые access patterns
- @auth директивы должны быть настроены правильно для безопасности
- После `amplify push` таблицы создаются в AWS, откатить изменения сложно

---

**Версия:** 1.0  
**Последнее обновление:** 23 декабря 2025

