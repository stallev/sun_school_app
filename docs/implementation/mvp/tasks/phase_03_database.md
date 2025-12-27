# Phase 03: Настройка базы данных DynamoDB

## Описание фазы
Создание DynamoDB таблиц на основе ERD, настройка Partition Keys, Sort Keys, Global Secondary Indexes (GSI).

## Зависимости
Phase 02: Настройка AWS Amplify Gen 1

## Оценка времени
4-6 часов

## Требования к AI Agent

<requirements>
<role>
Ты — Senior AWS DynamoDB Architect с 5+ летним опытом проектирования NoSQL баз данных, специализирующийся на:
- AWS DynamoDB моделирование данных и access patterns
- GraphQL Schema design для AWS AppSync
- Partition Keys, Sort Keys и Global Secondary Indexes (GSI)
- AWS Amplify Gen 1 и @model директивы
- Оптимизация производительности DynamoDB queries
</role>

<context>
Проект: Sunday School Management System (MVP)
Технологии: AWS DynamoDB, AWS AppSync GraphQL, AWS Amplify Gen 1
Ограничения: MVP подход, правильное моделирование данных критически важно для производительности
Документация: ERD, DYNAMODB_SCHEMA, DATA_MODELING должны быть изучены перед началом
</context>

<critical_instructions>
Вдохни глубоко, расправь плечи и приступай к решению задачи шаг за шагом. Это критически важная фаза для создания базы данных. Правильное моделирование данных определит производительность всего приложения.

<CRITICAL>Перед началом работы:</CRITICAL>
1. Изучи ERD.md - все сущности и их связи
2. Изучи DYNAMODB_SCHEMA.md - структуру таблиц, ключи, индексы
3. Изучи DATA_MODELING.md - стратегии моделирования данных и access patterns
4. Используй Context7 для получения актуальной документации AWS DynamoDB
5. Следуй принципам из `docs/guidelines/prompts/general_prompt_guidelines.md`

<CONSTRAINT>Partition Keys и Sort Keys критически важны для производительности. Неправильный выбор ключей приведет к проблемам с производительностью!</CONSTRAINT>
</critical_instructions>
</requirements>

## Задачи

### Task 03.01: Изучение схемы базы данных

<context>
<CRITICAL>Это первая и критически важная задача фазы!</CRITICAL> Изучение схемы базы данных необходимо для понимания структуры всех сущностей, их связей и access patterns. Без правильного понимания схемы невозможно правильно создать базу данных.
</context>

<task>
Изучи всю документацию по схеме базы данных: ERD, DYNAMODB_SCHEMA и DATA_MODELING. Составь список всех таблиц и GSI, которые необходимо создать.
</task>

<constraints>
- Изучи ERD.md - все сущности и их связи
- Изучи DYNAMODB_SCHEMA.md - структуру таблиц, ключи, индексы
- Изучи DATA_MODELING.md - стратегии моделирования данных и access patterns
- Изучи ANALYTICS.md - аналитические access patterns (включая аналитику сложности золотых стихов)
- Обрати внимание на новые access patterns:
  - AP-25: Список стихов группы за учебный год
  - AP-26: Аналитика сложности золотых стихов
  - AP-30: Баллы ученика за учебный год (с посещаемостью)
  - AP-31: Баллы ученика за период дат (с посещаемостью)
- Составь полный список всех таблиц
- Составь полный список всех GSI
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Изучи ERD.md детально - все сущности и их связи
2. Изучи DYNAMODB_SCHEMA.md - структуру таблиц, ключи, индексы
3. Изучи DATA_MODELING.md - стратегии моделирования данных и access patterns
4. Пойми access patterns для каждой сущности
5. Только после этого составляй списки таблиц и GSI
</thinking>

**Действия:**
- [ ] Изучить [ERD.md](../../../database/ERD.md) - все сущности и их связи
- [ ] Изучить [DYNAMODB_SCHEMA.md](../../../database/DYNAMODB_SCHEMA.md) - структуру таблиц, ключи, индексы
- [ ] Изучить [DATA_MODELING.md](../../../database/DATA_MODELING.md) - стратегии моделирования данных и access patterns
- [ ] Изучить [ANALYTICS.md](../../../database/ANALYTICS.md) - аналитические access patterns, включая аналитику сложности золотых стихов
- [ ] Обратить внимание на новые access patterns для Golden Verses (AP-25, AP-26) и Pupils (AP-30, AP-31)
- [ ] Составить список всех таблиц, которые необходимо создать
- [ ] Составить список всех GSI, которые необходимо создать

**Документация:**
- <CRITICAL>[ERD.md](../../../database/ERD.md) - Entity Relationship Diagram</CRITICAL>
- <CRITICAL>[DYNAMODB_SCHEMA.md](../../../database/DYNAMODB_SCHEMA.md) - Схема DynamoDB</CRITICAL>
- <CRITICAL>[DATA_MODELING.md](../../../database/DATA_MODELING.md) - Моделирование данных и access patterns</CRITICAL>
- <CRITICAL>[ANALYTICS.md](../../../database/ANALYTICS.md) - Аналитические access patterns и метрики</CRITICAL>

**Критерии приемки:**
- Понимание структуры всех сущностей
- Понимание access patterns для каждой сущности, включая аналитические (AP-25, AP-26, AP-30, AP-31, AP-ANALYTICS-6, AP-ANALYTICS-7)
- Понимание использования GSI для аналитики сложности золотых стихов
- Список таблиц и индексов составлен

<output_format>
После выполнения задачи должно быть полное понимание схемы базы данных. Списки всех таблиц и GSI должны быть составлены и готовы для использования в следующих задачах.
</output_format>

---

### Task 03.02: Добавление API ресурса в Amplify

<context>
<CRITICAL>Это критически важная задача!</CRITICAL> Добавление API ресурса создает GraphQL API в AWS AppSync. Правильная настройка на этом этапе определит работу всего API.
</context>

<task>
Добавь API ресурс в Amplify проект используя команду `amplify add api`. Настрой GraphQL API с правильной авторизацией и conflict detection.
</task>

<constraints>
- Используй команду `amplify add api` (Gen 1, НЕ Gen 2!)
- Выбери GraphQL как тип API
- Выбери Amazon Cognito User Pool как тип авторизации
- Включи conflict detection для оптимистичной блокировки
- Настрой advanced settings при необходимости
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Изучи AWS_AMPLIFY.md раздел API Setup для понимания требований
2. Изучи GRAPHQL_SCHEMA.md для понимания требований к API
3. Подготовь все необходимые параметры для настройки API
4. Только после этого запускай `amplify add api`
</thinking>

**Действия:**
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
- <CRITICAL>[AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md) - раздел API Setup</CRITICAL>
- [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md) - GraphQL Schema

**Критерии приемки:**
- API ресурс добавлен в Amplify проект
- GraphQL API создан
- Конфигурация сохранена
- **Примечание:** При создании GraphQL schema необходимо обеспечить поддержку новых access patterns (AP-25, AP-26, AP-30, AP-31, AP-ANALYTICS-6, AP-ANALYTICS-7). Все необходимые GSI уже определены в схеме, дополнительные индексы не требуются для MVP. Опциональная оптимизация (GSI-3 в LessonGoldenVerses) может быть добавлена post-MVP.

<output_format>
После выполнения задачи API ресурс должен быть добавлен в Amplify проект, GraphQL API должен быть создан, и конфигурация должна быть сохранена.
</output_format>

---

### Task 03.03: Создание GraphQL Schema - Базовые типы

<context>
Создание базовых типов GraphQL Schema - это основа всей схемы базы данных. Все типы должны точно соответствовать ERD и GRAPHQL_SCHEMA документации.
</context>

<task>
Создай все базовые типы GraphQL Schema согласно GRAPHQL_SCHEMA.md и ERD. Добавь все необходимые enum типы.
</task>

<constraints>
- Все типы должны точно соответствовать ERD
- Все типы должны соответствовать GRAPHQL_SCHEMA.md раздел Types
- Enum типы должны быть определены корректно
- Используй правильный синтаксис GraphQL
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Изучи GRAPHQL_SCHEMA.md раздел Types детально
2. Изучи ERD.md - все сущности и их поля
3. Определи все необходимые enum типы
4. Продумай структуру каждого типа
5. Только после этого создавай типы в schema.graphql
</thinking>

**Действия:**
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
- <CRITICAL>[GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md) - раздел Types</CRITICAL>
- <CRITICAL>[ERD.md](../../../database/ERD.md) - все сущности</CRITICAL>

**Критерии приемки:**
- Все базовые типы созданы в schema.graphql
- Типы соответствуют ERD
- Enum типы определены корректно

<output_format>
После выполнения задачи все базовые типы должны быть созданы в schema.graphql. Типы должны соответствовать ERD и GRAPHQL_SCHEMA документации.
</output_format>

---

### Task 03.04: Создание GraphQL Schema - Связи и связи многие-ко-многим

<context>
Создание связей между типами критически важно для правильной работы базы данных. Связи многие-ко-многим должны быть реализованы через промежуточные типы.
</context>

<task>
Добавь все связи между типами в GraphQL Schema. Реализуй связи многие-ко-многим через промежуточные типы и добавь связи через поля в типах согласно ERD.
</task>

<constraints>
- Связи многие-ко-многим должны быть реализованы через промежуточные типы
- Все связи должны соответствовать ERD
- Связи через поля должны быть добавлены в соответствующие типы
- Схема должна соответствовать ERD
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Изучи GRAPHQL_SCHEMA.md раздел Relationships детально
2. Изучи ERD.md - все связи между сущностями
3. Определи, какие связи многие-ко-многим требуют промежуточных типов
4. Определи, какие связи можно реализовать через поля
5. Только после этого добавляй связи в schema
</thinking>

**Действия:**
- [ ] Добавить типы для связей многие-ко-многим:
  - `UserGrade` для связи User-Grade
  - `LessonGoldenVerse` для связи Lesson-GoldenVerse
  - `PupilFamily` для связи Pupil-Family (если необходимо)
- [ ] Добавить связи через поля в типах:
  - В `Grade` добавить поле `teachers: [User]`
  - В `Lesson` добавить поле `homeworkChecks: [HomeworkCheck]`
  - И другие связи согласно ERD

**Документация:**
- <CRITICAL>[GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md) - раздел Relationships</CRITICAL>
- <CRITICAL>[ERD.md](../../../database/ERD.md) - связи между сущностями</CRITICAL>

**Критерии приемки:**
- Все связи определены в schema
- Связи многие-ко-многим реализованы через промежуточные типы
- Схема соответствует ERD

<output_format>
После выполнения задачи все связи должны быть определены в schema. Связи многие-ко-многим должны быть реализованы через промежуточные типы, и схема должна соответствовать ERD.
</output_format>

---

### Task 03.05: Настройка @auth директив для типов

<context>
<CRITICAL>Это критически важная задача для безопасности!</CRITICAL> Настройка @auth директив определяет, кто может получать доступ к данным. Неправильная настройка авторизации приведет к уязвимостям безопасности.
</context>

<task>
Добавь @auth директивы для каждого типа согласно GRAPHQL_SCHEMA.md и SECURITY.md. Настрой правила авторизации для всех типов.
</task>

<constraints>
- Все типы должны иметь @auth директивы
- Правила авторизации должны соответствовать требованиям безопасности из SECURITY.md
- Admin-only типы должны быть защищены правильно
- Используй правильный синтаксис @auth директив
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Изучи GRAPHQL_SCHEMA.md раздел Authorization детально
2. Изучи SECURITY.md раздел RBAC для понимания требований безопасности
3. Используй Context7 для получения актуальной документации AWS AppSync @auth
4. Определи правила авторизации для каждого типа
5. Только после этого добавляй @auth директивы
</thinking>

**Действия:**
- [ ] Добавить @auth директивы для каждого типа согласно [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md)
- [ ] Настроить правила авторизации:
  - `@auth(rules: [{ allow: owner }])` для личных данных
  - `@auth(rules: [{ allow: groups, groups: ["ADMIN"] }])` для Admin-only типов
  - `@auth(rules: [{ allow: groups, groups: ["TEACHER", "ADMIN"] }])` для Teacher и Admin
- [ ] Проверить, что все типы имеют правильные @auth директивы

**Документация:**
- <CRITICAL>[GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md) - раздел Authorization</CRITICAL>
- <CRITICAL>[SECURITY.md](../../../infrastructure/SECURITY.md) - раздел RBAC</CRITICAL>
- <CRITICAL>AWS AppSync @auth документация (через Context7)</CRITICAL>

**Критерии приемки:**
- Все типы имеют @auth директивы
- Правила авторизации соответствуют требованиям безопасности
- Admin-only типы защищены правильно

<output_format>
После выполнения задачи все типы должны иметь правильные @auth директивы. Правила авторизации должны соответствовать требованиям безопасности.
</output_format>

---

### Task 03.06: Настройка DynamoDB таблиц через @model

<context>
<CRITICAL>Partition Keys и Sort Keys критически важны для производительности!</CRITICAL> Правильная настройка ключей определяет производительность всех queries. Неправильный выбор ключей приведет к проблемам с производительностью.
</context>

<task>
Добавь @model директиву к каждому типу, который должен быть таблицей. Настрой Partition Keys и Sort Keys через @key директивы согласно DYNAMODB_SCHEMA.md и access patterns.
</task>

<constraints>
- Все типы с @model должны иметь правильные ключи
- Partition Keys и Sort Keys должны соответствовать DYNAMODB_SCHEMA.md
- Ключи должны поддерживать все необходимые access patterns
- Используй правильный синтаксис @key директив
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Изучи DYNAMODB_SCHEMA.md раздел Keys детально
2. Изучи DATA_MODELING.md раздел Access Patterns для понимания требований
3. Используй Context7 для получения актуальной документации AWS AppSync @model
4. Определи Partition Keys и Sort Keys для каждого типа
5. Убедись, что ключи поддерживают все access patterns
6. Только после этого добавляй @model и @key директивы
</thinking>

**Действия:**
- [ ] Добавить @model директиву к каждому типу, который должен быть таблицей
- [ ] Настроить Partition Keys и Sort Keys через @key директивы согласно [DYNAMODB_SCHEMA.md](../../../database/DYNAMODB_SCHEMA.md)
- [ ] Пример: `@model @key(name: "byGrade", fields: ["gradeId"], queryField: "lessonsByGrade")`
- [ ] Убедиться, что ключи соответствуют access patterns

**Документация:**
- <CRITICAL>[DYNAMODB_SCHEMA.md](../../../database/DYNAMODB_SCHEMA.md) - раздел Keys</CRITICAL>
- <CRITICAL>[DATA_MODELING.md](../../../database/DATA_MODELING.md) - раздел Access Patterns</CRITICAL>
- AWS AppSync @model документация (через Context7)

**Критерии приемки:**
- Все типы с @model имеют правильные ключи
- Partition Keys и Sort Keys настроены согласно схеме
- Access patterns поддерживаются через ключи

<output_format>
После выполнения задачи все типы с @model должны иметь правильные ключи. Partition Keys и Sort Keys должны поддерживать все необходимые access patterns.
</output_format>

---

### Task 03.07: Создание Global Secondary Indexes (GSI)

<context>
GSI необходимы для поддержки access patterns, которые не могут быть реализованы через основные ключи. Правильная настройка GSI критически важна для производительности queries.
</context>

<task>
Создай все необходимые GSI через @key директивы согласно DYNAMODB_SCHEMA.md. Убедись, что GSI поддерживают все необходимые access patterns.
</task>

<constraints>
- GSI должны соответствовать DYNAMODB_SCHEMA.md раздел GSI
- GSI должны поддерживать все необходимые access patterns
- Используй правильный синтаксис @key директив для GSI
- Индексы должны быть настроены корректно
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Изучи DYNAMODB_SCHEMA.md раздел GSI детально
2. Изучи DATA_MODELING.md раздел GSI Usage для понимания требований
3. Используй Context7 для получения актуальной документации AWS DynamoDB GSI
4. Определи, какие GSI необходимы для каждого типа
5. Убедись, что GSI поддерживают все access patterns
6. Только после этого добавляй GSI через @key директивы
</thinking>

**Действия:**
- [ ] **⭐ КРИТИЧЕСКИ ВАЖНО:** Добавить поле `gradeId` в тип HomeworkCheck для поддержки GSI-3
  - Поле должно быть денормализовано из Lesson.gradeId
  - Поле обязательно для создания GSI-3 (gradeId-createdAt-index)
  - См. [DYNAMODB_SCHEMA.md](../../../database/DYNAMODB_SCHEMA.md) раздел 3.9 для деталей
- [ ] Добавить GSI через @key директивы согласно [DYNAMODB_SCHEMA.md](../../../database/DYNAMODB_SCHEMA.md)
- [ ] Создать GSI1 для каждого типа (если требуется)
- [ ] Создать GSI2 для каждого типа (если требуется)
- [ ] **⭐ КРИТИЧЕСКИ ВАЖНО:** Создать GSI-3 для HomeworkChecks (gradeId-createdAt-index) для поддержки аналитики post-MVP
  - Этот GSI должен быть создан на этапе MVP, даже если аналитика будет реализована post-MVP
  - GSI требует наличия поля gradeId в HomeworkCheck
  - См. [ANALYTICS.md](../../../database/ANALYTICS.md) для деталей
- [ ] Убедиться, что GSI поддерживают необходимые access patterns

**Документация:**
- <CRITICAL>[DYNAMODB_SCHEMA.md](../../../database/DYNAMODB_SCHEMA.md) - раздел GSI</CRITICAL>
- <CRITICAL>[DATA_MODELING.md](../../../database/DATA_MODELING.md) - раздел GSI Usage и Analytics Access Patterns</CRITICAL>
- <CRITICAL>[ANALYTICS.md](../../../database/ANALYTICS.md) - аналитика учебного процесса (Post-MVP, структура БД создается на этапе MVP)</CRITICAL>
- AWS DynamoDB GSI документация (через Context7)

**Критерии приемки:**
- Поле `gradeId` добавлено в тип HomeworkCheck в GraphQL схеме
- Поле `gradeId` имеет правильную директиву @index для GSI-3
- Все необходимые GSI созданы
- GSI поддерживают требуемые access patterns
- Индексы настроены корректно
- GSI-3 для HomeworkChecks (gradeId-createdAt-index) создан и работает

<output_format>
После выполнения задачи все необходимые GSI должны быть созданы. GSI должны поддерживать все требуемые access patterns.
</output_format>

---

### Task 03.08: Добавление Queries в GraphQL Schema

<context>
Queries необходимы для получения данных из базы данных. Все queries должны иметь правильные @auth директивы и поддерживать фильтрацию и пагинацию где необходимо.
</context>

<task>
Добавь все необходимые queries в GraphQL Schema согласно GRAPHQL_SCHEMA.md. Настрой @auth директивы для queries и добавь фильтрацию и пагинацию где необходимо.
</task>

<constraints>
- Все queries должны соответствовать GRAPHQL_SCHEMA.md раздел Queries
- Queries должны иметь правильные @auth директивы
- Фильтрация и пагинация должны быть настроены где необходимо
- Используй правильный синтаксис GraphQL
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Изучи GRAPHQL_SCHEMA.md раздел Queries детально
2. Изучи SERVER_ACTIONS.md для понимания использования queries
3. Определи, какие queries необходимы
4. Определи правила авторизации для каждого query
5. Определи, где нужна фильтрация и пагинация
6. Только после этого добавляй queries в schema
</thinking>

**Действия:**
- [ ] Добавить queries согласно [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md):
  - `getUser(id: ID!): User`
  - `listGrades: [Grade]`
  - `getGrade(id: ID!): Grade`
  - `listLessons(gradeId: ID!): [Lesson]`
  - И другие queries согласно схеме
- [ ] Настроить @auth для queries
- [ ] Добавить фильтрацию и пагинацию где необходимо

**Документация:**
- <CRITICAL>[GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md) - раздел Queries</CRITICAL>
- [SERVER_ACTIONS.md](../../../api/SERVER_ACTIONS.md) - использование queries

**Критерии приемки:**
- Все необходимые queries добавлены
- Queries имеют правильные @auth директивы
- Фильтрация и пагинация настроены

<output_format>
После выполнения задачи все необходимые queries должны быть добавлены в schema. Queries должны иметь правильные @auth директивы и поддерживать фильтрацию и пагинацию где необходимо.
</output_format>

---

### Task 03.09: Добавление Mutations в GraphQL Schema

<context>
Mutations необходимы для создания, обновления и удаления данных в базе данных. Все mutations должны иметь правильные @auth директивы и Input типы.
</context>

<task>
Добавь все необходимые mutations в GraphQL Schema согласно GRAPHQL_SCHEMA.md. Настрой @auth директивы для mutations и создай Input типы для всех mutations.
</task>

<constraints>
- Все mutations должны соответствовать GRAPHQL_SCHEMA.md раздел Mutations
- Mutations должны иметь правильные @auth директивы
- Input типы должны быть созданы для всех mutations
- Используй правильный синтаксис GraphQL
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Изучи GRAPHQL_SCHEMA.md раздел Mutations детально
2. Изучи SERVER_ACTIONS.md для понимания использования mutations
3. Определи, какие mutations необходимы
4. Определи правила авторизации для каждой mutation
5. Определи Input типы для каждой mutation
6. Только после этого добавляй mutations в schema
</thinking>

**Действия:**
- [ ] Добавить mutations согласно [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md):
  - `createUser(input: CreateUserInput!): User`
  - `updateUser(input: UpdateUserInput!): User`
  - `createGrade(input: CreateGradeInput!): Grade`
  - `updateGrade(input: UpdateGradeInput!): Grade`
  - И другие mutations согласно схеме
- [ ] Настроить @auth для mutations
- [ ] Добавить Input типы для всех mutations

**Документация:**
- <CRITICAL>[GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md) - раздел Mutations</CRITICAL>
- [SERVER_ACTIONS.md](../../../api/SERVER_ACTIONS.md) - использование mutations

**Критерии приемки:**
- Все необходимые mutations добавлены
- Mutations имеют правильные @auth директивы
- Input типы созданы для всех mutations

<output_format>
После выполнения задачи все необходимые mutations должны быть добавлены в schema. Mutations должны иметь правильные @auth директивы и Input типы.
</output_format>

---

### Task 03.10: Добавление Subscriptions (опционально)

<context>
Subscriptions необходимы для real-time обновлений данных. Хотя это опциональная задача, правильная настройка subscriptions улучшит пользовательский опыт.
</context>

<task>
Добавь subscriptions для real-time обновлений (если требуется) согласно GRAPHQL_SCHEMA.md. Настрой @auth директивы для subscriptions.
</task>

<constraints>
- Subscriptions должны соответствовать GRAPHQL_SCHEMA.md раздел Subscriptions
- Subscriptions должны иметь правильные @auth директивы
- Используй правильный синтаксис @aws_subscribe
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Изучи GRAPHQL_SCHEMA.md раздел Subscriptions для понимания требований
2. Используй Context7 для получения актуальной документации AWS AppSync Subscriptions
3. Определи, какие subscriptions необходимы для MVP
4. Определи правила авторизации для каждой subscription
5. Только после этого добавляй subscriptions в schema
</thinking>

**Действия:**
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

<output_format>
После выполнения задачи subscriptions должны быть добавлены в schema (если требуются). Subscriptions должны иметь правильные @auth директивы.
</output_format>

---

### Task 03.11: Валидация GraphQL Schema

<context>
<CRITICAL>Это критически важная задача перед push в AWS!</CRITICAL> Валидация GraphQL Schema необходима для выявления ошибок перед созданием таблиц в AWS. Ошибки на этом этапе легче исправить, чем после push.
</context>

<task>
Проведи валидацию GraphQL Schema используя команду `amplify api gql-compile`. Убедись, что schema компилируется без ошибок, все типы правильно связаны, и все @auth директивы корректны.
</task>

<constraints>
- Schema должна компилироваться без ошибок
- Все типы должны быть правильно связаны
- Все @auth директивы должны быть валидны
- Не должно быть синтаксических ошибок
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Убедись, что все предыдущие задачи выполнены
2. Изучи GRAPHQL_SCHEMA.md для понимания ожидаемой структуры
3. Используй Context7 для получения актуальной документации AWS AppSync
4. Только после этого запускай валидацию
</thinking>

**Действия:**
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

<output_format>
После выполнения задачи schema должна компилироваться без ошибок. Все типы и связи должны быть корректны, и все @auth директивы должны быть валидны.
</output_format>

---

### Task 03.12: Push схемы в AWS (создание таблиц)

<context>
<CRITICAL>Это критически важная задача!</CRITICAL> Push схемы в AWS создает все таблицы DynamoDB и настраивает AppSync API. После push откатить изменения сложно, поэтому важно убедиться, что все правильно настроено.
</context>

<task>
Запусти `amplify push` для создания всех таблиц DynamoDB и настройки AppSync API в AWS. Убедись, что все таблицы и GSI созданы корректно.
</task>

<constraints>
- Используй команду `amplify push` (Gen 1, НЕ Gen 2!)
- Подтверди создание ресурсов только после проверки
- Дождись завершения создания всех таблиц
- Проверь создание таблиц в AWS Console
- Все GSI должны быть созданы
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Убедись, что валидация schema прошла успешно (Task 03.11)
2. Изучи AWS_AMPLIFY.md раздел Push для понимания процесса
3. Подготовься к проверке созданных таблиц в AWS Console
4. Только после этого запускай `amplify push`
</thinking>

**Действия:**
- [ ] Запустить `amplify push`
- [ ] Подтвердить создание ресурсов: `Yes`
- [ ] Дождаться завершения создания таблиц DynamoDB
- [ ] Проверить статус: `amplify status`
- [ ] Убедиться, что все таблицы созданы в AWS Console

**Документация:**
- <CRITICAL>[AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md) - раздел Push</CRITICAL>
- AWS DynamoDB Console документация

**Критерии приемки:**
- Команда `amplify push` выполнена успешно
- Все таблицы DynamoDB созданы в AWS
- Все GSI созданы
- AppSync API создан и работает

<output_format>
После выполнения задачи все таблицы DynamoDB должны быть созданы в AWS, все GSI должны быть созданы, и AppSync API должен быть создан и работать.
</output_format>

---

### Task 03.13: Проверка созданных таблиц в AWS Console

<context>
Проверка созданных таблиц в AWS Console необходима для подтверждения правильности создания всех таблиц и GSI. Это важный шаг перед переходом к тестированию API.
</context>

<task>
Проверь созданные таблицы в AWS Console. Убедись, что все таблицы созданы, структура соответствует схеме, и GSI созданы корректно.
</task>

<constraints>
- Все таблицы должны быть видны в AWS Console
- Структура таблиц должна соответствовать DYNAMODB_SCHEMA.md
- GSI должны быть созданы и работать
- Настройки таблиц должны быть проверены
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Убедись, что push выполнен успешно (Task 03.12)
2. Изучи DYNAMODB_SCHEMA.md для понимания ожидаемой структуры
3. Подготовься к проверке всех таблиц и GSI
4. Только после этого проверяй таблицы в AWS Console
</thinking>

**Действия:**
- [ ] Открыть AWS Console -> DynamoDB
- [ ] Проверить наличие всех таблиц
- [ ] Проверить структуру каждой таблицы (ключи, индексы)
- [ ] Убедиться, что GSI созданы корректно
- [ ] Проверить настройки таблиц (read/write capacity, billing mode)

**Документация:**
- <CRITICAL>[DYNAMODB_SCHEMA.md](../../../database/DYNAMODB_SCHEMA.md)</CRITICAL>
- AWS DynamoDB Console документация

**Критерии приемки:**
- Все таблицы видны в AWS Console
- Структура таблиц соответствует схеме
- GSI созданы и работают

<output_format>
После выполнения задачи все таблицы должны быть видны в AWS Console, структура должна соответствовать схеме, и GSI должны быть созданы и работать.
</output_format>

---

### Task 03.14: Заполнение таблицы Books

<context>
<CRITICAL>Это важная задача для инициализации данных!</CRITICAL> Таблица Books должна быть заполнена всеми 66 книгами Библии при создании базы данных. Это справочная таблица, которая заполняется один раз.
</context>

<task>
Создай скрипт для заполнения таблицы Books всеми 66 книгами Библии (39 Ветхий Завет + 27 Новый Завет). Скрипт должен содержать данные: fullName, shortName, abbreviation, testament, order.
</task>

<constraints>
- Все 66 книг Библии должны быть включены
- Данные должны быть корректными (полные и сокращенные названия, аббревиатуры)
- Порядок книг должен соответствовать порядку в Библии
- Скрипт должен быть выполнен после создания таблиц (Task 03.13)
- Скрипт может быть Server Action или отдельный скрипт для выполнения через AppSync Console
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Изучи структуру таблицы Books из DYNAMODB_SCHEMA.md
2. Подготовь данные для всех 66 книг Библии
3. Определи формат скрипта (Server Action или отдельный скрипт)
4. Только после этого создавай скрипт
</thinking>

**Действия:**
- [ ] Создать файл с данными всех 66 книг Библии (JSON или TypeScript массив)
- [ ] Создать Server Action `actions/books.ts` с функцией `seedBooks()` для заполнения таблицы
- [ ] Или создать отдельный скрипт для выполнения через AppSync Console
- [ ] Выполнить скрипт после создания таблиц
- [ ] Проверить, что все 66 книг созданы

**Документация:**
- <CRITICAL>[DYNAMODB_SCHEMA.md](../../../database/DYNAMODB_SCHEMA.md) - раздел 3.16 Таблица Books</CRITICAL>
- [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md) - тип Book

**Критерии приемки:**
- Скрипт создан
- Все 66 книг Библии включены
- Данные корректны (fullName, shortName, abbreviation, testament, order)
- Таблица Books заполнена

<output_format>
После выполнения задачи должен быть создан скрипт для заполнения таблицы Books. Все 66 книг Библии должны быть включены с корректными данными. Таблица Books должна быть заполнена.
</output_format>

---

### Task 03.15: Тестирование GraphQL API

<context>
Тестирование GraphQL API необходимо для подтверждения правильности работы всех queries, mutations и авторизации. Это важный шаг перед переходом к следующей фазе.
</context>

<task>
Протестируй GraphQL API в AWS AppSync Console. Проверь работу queries, mutations и авторизации.
</task>

<constraints>
- GraphQL API должен работать корректно
- Queries должны возвращать данные
- Mutations должны создавать записи
- Авторизация должна работать правильно
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Убедись, что все таблицы созданы (Task 03.13)
2. Изучи GRAPHQL_SCHEMA.md для понимания доступных queries и mutations
3. Подготовь тестовые данные для проверки
4. Только после этого тестируй API
</thinking>

**Действия:**
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

<output_format>
После выполнения задачи GraphQL API должен работать корректно. Queries должны возвращать данные, mutations должны создавать записи, и авторизация должна работать.
</output_format>

---

### Task 03.16: Документирование созданной схемы

<context>
<CRITICAL>Это финальная задача фазы!</CRITICAL> Документирование созданной схемы критически важно для команды и будущей работы с проектом. Все изменения и важные решения должны быть задокументированы.
</context>

<task>
Задокументируй созданную схему базы данных. Обнови GRAPHQL_SCHEMA.md если были изменения, задокументируй отклонения от первоначальной схемы и создай заметки о важных решениях.
</task>

<constraints>
- Документация должна быть обновлена
- Все изменения должны быть задокументированы
- Важные решения должны быть записаны
- Документация должна быть доступна для команды
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Собери всю информацию о созданной схеме
2. Определи, какие изменения были внесены
3. Определи важные решения по моделированию данных
4. Изучи GRAPHQL_SCHEMA.md и DATA_MODELING.md для понимания структуры документации
5. Только после этого обновляй документацию
</thinking>

**Действия:**
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

<output_format>
После выполнения задачи вся документация должна быть обновлена. Все изменения должны быть задокументированы, и важные решения должны быть записаны.
</output_format>

---

## Ссылки на документацию проекта

- [ERD.md](../../../database/ERD.md) - Entity Relationship Diagram
- [DYNAMODB_SCHEMA.md](../../../database/DYNAMODB_SCHEMA.md) - Схема DynamoDB
- [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md) - GraphQL Schema
- [DATA_MODELING.md](../../../database/DATA_MODELING.md) - Моделирование данных
- [ANALYTICS.md](../../../database/ANALYTICS.md) - Аналитика учебного процесса (Post-MVP, структура БД создается на этапе MVP)
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

