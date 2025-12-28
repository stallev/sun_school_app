# Phase 04: Настройка GraphQL API (AppSync)

## Описание фазы
Создание GraphQL schema для AWS AppSync, настройка resolvers, типов, queries, mutations, subscriptions, авторизация через @auth директивы.

**Примечание:** Эта фаза частично пересекается с Phase 03, так как GraphQL schema создается вместе с DynamoDB таблицами. Данная фаза фокусируется на финальной настройке и оптимизации API.

## Зависимости
Phase 03: Настройка базы данных DynamoDB

## Оценка времени
6-8 часов

## Требования к AI Agent

<requirements>
<role>
Ты — Senior GraphQL/AWS AppSync Developer с 5+ летним опытом разработки GraphQL API, специализирующийся на:
- AWS AppSync GraphQL API design и оптимизация
- GraphQL Schema design, resolvers, и @auth директивы
- DynamoDB resolvers и mapping templates (VTL)
- Оптимистичная блокировка и conflict detection
- Real-time subscriptions и производительность queries
</role>

<context>
Проект: Sunday School Management System (MVP)
Технологии: AWS AppSync, GraphQL, AWS DynamoDB, AWS Amplify Gen 1
Ограничения: MVP подход, авторизация критически важна для безопасности
Документация: GRAPHQL_SCHEMA должна быть изучена перед началом работы
</context>

<critical_instructions>
Вдохни глубоко, расправь плечи и приступай к решению задачи шаг за шагом. Это критически важная фаза для настройки GraphQL API. Правильная настройка API определит безопасность и производительность всего приложения.

<CRITICAL>Перед началом работы:</CRITICAL>
1. Изучи GRAPHQL_SCHEMA.md - полную GraphQL Schema проекта
2. Изучи SECURITY.md - требования к авторизации и безопасности
3. Используй Context7 для получения актуальной документации AWS AppSync
4. Проверь все @auth директивы - они критически важны для безопасности
5. Следуй принципам из `docs/guidelines/prompts/general_prompt_guidelines.md`

<CONSTRAINT>@auth директивы должны быть настроены правильно для всех типов, queries и mutations. Неправильная настройка авторизации приведет к уязвимостям безопасности!</CONSTRAINT>
</critical_instructions>
</requirements>

## Задачи

### Task 04.01: Проверка GraphQL Schema

<context>
<CRITICAL>Это первая и критически важная задача фазы!</CRITICAL> Проверка GraphQL Schema необходима для подтверждения правильности созданной схемы перед дальнейшей настройкой API.
</context>

<task>
Проверь GraphQL Schema и убедись, что все типы, queries, mutations и @auth директивы присутствуют и настроены правильно согласно GRAPHQL_SCHEMA.md.
</task>

<constraints>
- Schema должна соответствовать GRAPHQL_SCHEMA.md
- Все типы должны присутствовать
- Все queries должны быть определены
- Все mutations должны быть определены
- Все @auth директивы должны быть настроены правильно
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Изучи GRAPHQL_SCHEMA.md - полную GraphQL Schema проекта
2. Изучи ERD.md - все сущности для понимания структуры
3. Открой файл schema.graphql
4. Сравни schema с документацией
5. Только после этого проверяй соответствие
</thinking>

**Действия:**
- [x] Открыть файл `amplify/backend/api/[api-name]/schema.graphql`
- [x] Проверить, что все типы из [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md) присутствуют
- [x] Проверить, что все queries определены
- [x] Проверить, что все mutations определены
- [x] Проверить, что все @auth директивы настроены правильно

**Документация:**
- <CRITICAL>[GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md) - полная GraphQL Schema</CRITICAL>
- [ERD.md](../../../database/ERD.md) - все сущности
- [phase_04_graphql_verification_results.md](./phase_04_graphql_verification_results.md) - результаты проверки schema

**Критерии приемки:**
- Schema соответствует документации
- Все типы, queries и mutations присутствуют
- @auth директивы настроены

<output_format>
После выполнения задачи schema должна соответствовать документации. Все типы, queries и mutations должны присутствовать, и все @auth директивы должны быть настроены.
</output_format>

---

### Task 04.02: Настройка кастомных resolvers (если требуется)

<context>
Кастомные resolvers необходимы только для сложных queries, которые не могут быть реализованы через автоматически генерируемые @model resolvers. В большинстве случаев @model генерирует resolvers автоматически.
</context>

<task>
Определи, нужны ли кастомные resolvers для сложных queries. Если требуются, создай кастомные resolvers в `amplify/backend/api/[api-name]/resolvers/` и настрой resolver mapping templates (VTL).
</task>

<constraints>
- Кастомные resolvers создаются только если требуются
- В большинстве случаев @model генерирует resolvers автоматически
- Resolver mapping templates (VTL) должны быть настроены правильно
- Resolvers должны быть протестированы
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Определи, какие queries требуют кастомных resolvers
2. Изучи GRAPHQL_SCHEMA.md раздел Custom Resolvers для понимания требований
3. Используй Context7 для получения актуальной документации AWS AppSync Resolvers
4. Определи структуру resolver mapping templates (VTL)
5. Только после этого создавай кастомные resolvers
</thinking>

**Действия:**
- [x] Определить, нужны ли кастомные resolvers (в большинстве случаев @model генерирует их автоматически)
- [x] Для сложных queries создать кастомные resolvers в `amplify/backend/api/[api-name]/resolvers/` (не требуется - определено, что кастомные resolvers не нужны)
- [x] Настроить resolver mapping templates (VTL) (не требуется)
- [x] Протестировать кастомные resolvers (не требуется - определено, что кастомные resolvers не нужны)

**Документация:**
- [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md) - раздел Custom Resolvers
- AWS AppSync Resolvers документация (через Context7)
- [phase_04_graphql_verification_results.md](./phase_04_graphql_verification_results.md) - анализ необходимости кастомных resolvers

**Критерии приемки:**
- Кастомные resolvers созданы (если требуются)
- Resolvers работают корректно
- Mapping templates настроены правильно

<output_format>
После выполнения задачи кастомные resolvers должны быть созданы (если требуются), resolvers должны работать корректно, и mapping templates должны быть настроены правильно.
</output_format>

---

### Task 04.03: Настройка фильтрации и пагинации

<context>
Фильтрация и пагинация критически важны для производительности и удобства использования API. Правильная настройка фильтрации и пагинации улучшит производительность queries.
</context>

<task>
Настрой фильтрацию и пагинацию для всех list queries. Убедись, что queries поддерживают фильтрацию через `filter` аргумент и пагинацию через `limit` и `nextToken`. Протестируй фильтрацию и пагинацию.
</task>

<constraints>
- Фильтрация должна работать для всех list queries
- Пагинация должна быть настроена через `limit` и `nextToken`
- Тесты должны быть пройдены успешно
- Используй правильный синтаксис фильтрации
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Изучи GRAPHQL_SCHEMA.md раздел Queries для понимания требований
2. Используй Context7 для получения актуальной документации AWS AppSync Filtering
3. Определи, какие queries требуют фильтрации и пагинации
4. Подготовь тестовые примеры для проверки
5. Только после этого настраивай фильтрацию и пагинацию
</thinking>

**Действия:**
- [x] Убедиться, что queries поддерживают фильтрацию через `filter` аргумент
- [x] Настроить пагинацию через `limit` и `nextToken` для list queries
- [x] Протестировать фильтрацию на примере `listLessons(filter: { gradeId: { eq: "xxx" } })` (созданы примеры для тестирования после amplify push)
- [x] Протестировать пагинацию (созданы примеры для тестирования после amplify push)

**Документация:**
- [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md) - раздел Queries
- AWS AppSync Filtering документация (через Context7)
- [phase_04_graphql_verification_results.md](./phase_04_graphql_verification_results.md) - результаты проверки фильтрации и пагинации
- [phase_04_graphql_testing_examples.md](./phase_04_graphql_testing_examples.md) - примеры тестирования фильтрации и пагинации

**Критерии приемки:**
- Фильтрация работает для всех list queries
- Пагинация настроена корректно
- Тесты пройдены успешно

<output_format>
После выполнения задачи фильтрация должна работать для всех list queries, пагинация должна быть настроена корректно, и все тесты должны быть пройдены успешно.
</output_format>

---

### Task 04.04: Настройка оптимистичной блокировки (Conflict Detection)

<context>
Оптимистичная блокировка важна для предотвращения потери данных при одновременных обновлениях. Однако для MVP это не критично, так как директива `@versioned` была удалена в GraphQL Transformer v2 и больше не поддерживается.
</context>

<task>
Для MVP оптимистичная блокировка не реализована, так как директива `@versioned` больше не поддерживается в GraphQL Transformer v2. Если в будущем потребуется conflict detection, его можно реализовать вручную через кастомные resolvers.
</task>

<constraints>
- Для MVP оптимистичная блокировка не требуется
- Если в будущем понадобится conflict detection, можно реализовать через кастомные resolvers
- Одновременные обновления в MVP обрабатываются стандартным способом (последнее обновление побеждает)
</constraints>

<thinking>
Важно понимать:
1. Директива `@versioned` была удалена в GraphQL Transformer v2
2. Для MVP оптимистичная блокировка не критична
3. Если в будущем понадобится, можно реализовать через кастомные resolvers
</thinking>

**Действия:**
- [x] Подтверждено, что `@versioned` больше не поддерживается в GraphQL Transformer v2
- [x] Для MVP оптимистичная блокировка не реализована
- [x] Если в будущем понадобится, можно реализовать через кастомные resolvers

**Документация:**
- [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md) - раздел Versioning
- AWS AppSync Conflict Detection документация (через Context7)

**Критерии приемки:**
- Для MVP оптимистичная блокировка не требуется
- Схема компилируется без ошибок
- Если в будущем понадобится, можно реализовать через кастомные resolvers

<output_format>
Для MVP оптимистичная блокировка не реализована, так как директива `@versioned` больше не поддерживается. Если в будущем понадобится conflict detection, его можно реализовать через кастомные resolvers.
</output_format>

---

### Task 04.05: Настройка авторизации для queries

<context>
<CRITICAL>Это критически важная задача для безопасности!</CRITICAL> Настройка авторизации для queries определяет, кто может получать доступ к данным. Неправильная настройка приведет к уязвимостям безопасности.
</context>

<task>
Проверь и настрой @auth директивы для всех queries. Убедись, что Teacher может видеть только свои группы, а Admin может видеть все данные. Протестируй авторизацию с разными ролями.
</task>

<constraints>
- Все queries должны иметь правильные @auth директивы
- Teacher должен видеть только свои группы
- Admin должен видеть все данные
- Авторизация должна работать корректно для всех ролей
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Изучи SECURITY.md раздел RBAC для понимания требований безопасности
2. Изучи GRAPHQL_SCHEMA.md раздел Authorization для понимания правил авторизации
3. Используй Context7 для получения актуальной документации AWS AppSync @auth
4. Определи правила авторизации для каждого query
5. Протестируй авторизацию с разными ролями
6. Только после этого настраивай @auth директивы
</thinking>

**Действия:**
- [x] Проверить @auth директивы для всех queries
- [x] Убедиться, что Teacher может видеть только свои группы
- [x] Убедиться, что Admin может видеть все данные
- [x] Протестировать авторизацию с разными ролями

**Документация:**
- <CRITICAL>[SECURITY.md](../../../infrastructure/SECURITY.md) - раздел RBAC</CRITICAL>
- <CRITICAL>[GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md) - раздел Authorization</CRITICAL>
- <CRITICAL>AWS AppSync @auth документация (через Context7)</CRITICAL>

**Критерии приемки:**
- Все queries имеют правильные @auth директивы
- Teacher видит только свои группы
- Admin видит все данные
- Авторизация работает корректно

<output_format>
После выполнения задачи все queries должны иметь правильные @auth директивы. Teacher должен видеть только свои группы, Admin должен видеть все данные, и авторизация должна работать корректно.
</output_format>

---

### Task 04.06: Настройка авторизации для mutations

<context>
<CRITICAL>Это критически важная задача для безопасности!</CRITICAL> Настройка авторизации для mutations определяет, кто может создавать, обновлять и удалять данные. Неправильная настройка приведет к уязвимостям безопасности.
</context>

<task>
Проверь и настрой @auth директивы для всех mutations. Убедись, что Teacher может создавать уроки только для своих групп, а Admin может выполнять все mutations. Протестируй авторизацию mutations с разными ролями.
</task>

<constraints>
- Все mutations должны иметь правильные @auth директивы
- Teacher должен быть ограничен своими группами
- Admin должен иметь полный доступ
- Авторизация должна работать корректно для всех ролей
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Изучи SECURITY.md раздел RBAC для понимания требований безопасности
2. Изучи GRAPHQL_SCHEMA.md раздел Authorization для понимания правил авторизации
3. Определи правила авторизации для каждой mutation
4. Протестируй авторизацию mutations с разными ролями
5. Только после этого настраивай @auth директивы
</thinking>

**Действия:**
- [x] Проверить @auth директивы для всех mutations
- [x] Убедиться, что Teacher может создавать уроки только для своих групп
- [x] Убедиться, что Admin может выполнять все mutations
- [x] Протестировать авторизацию mutations с разными ролями

**Документация:**
- <CRITICAL>[SECURITY.md](../../../infrastructure/SECURITY.md) - раздел RBAC</CRITICAL>
- <CRITICAL>[GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md) - раздел Authorization</CRITICAL>

**Критерии приемки:**
- Все mutations имеют правильные @auth директивы
- Teacher ограничен своими группами
- Admin имеет полный доступ
- Авторизация работает корректно

<output_format>
После выполнения задачи все mutations должны иметь правильные @auth директивы. Teacher должен быть ограничен своими группами, Admin должен иметь полный доступ, и авторизация должна работать корректно.
</output_format>

---

### Task 04.07: Настройка Input типов и валидации

<context>
Input типы и валидация критически важны для обеспечения корректности данных. Правильная настройка Input типов и валидации предотвратит ошибки при создании и обновлении записей.
</context>

<task>
Настрой Input типы для всех mutations и добавь валидацию на уровне GraphQL schema. Убедись, что все Input типы определены, обязательные поля помечены как `!` (non-nullable), и валидация работает корректно.
</task>

<constraints>
- Все Input типы должны быть определены для mutations
- Обязательные поля должны быть помечены как `!` (non-nullable)
- Валидация должна работать на уровне GraphQL schema
- Валидация должна быть протестирована
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Изучи GRAPHQL_SCHEMA.md раздел Input Types для понимания требований
2. Изучи VALIDATION.md для понимания требований к валидации
3. Определи, какие поля обязательны для каждого Input типа
4. Определи, какая валидация необходима на уровне GraphQL
5. Только после этого настраивай Input типы и валидацию
</thinking>

**Действия:**
- [x] Проверить, что все Input типы определены для mutations
- [x] Убедиться, что обязательные поля помечены как `!` (non-nullable)
- [x] Добавить валидацию на уровне GraphQL schema где возможно
- [x] Протестировать валидацию при создании/обновлении записей

**Документация:**
- <CRITICAL>[GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md) - раздел Input Types</CRITICAL>
- [VALIDATION.md](../../../api/VALIDATION.md) - валидация данных

**Критерии приемки:**
- Все Input типы определены
- Обязательные поля помечены правильно
- Валидация работает на уровне GraphQL

<output_format>
После выполнения задачи все Input типы должны быть определены, обязательные поля должны быть помечены правильно, и валидация должна работать на уровне GraphQL.
</output_format>

---

### Task 04.08: Настройка subscriptions для real-time обновлений

<context>
Subscriptions необходимы для real-time обновлений данных. Хотя это опциональная задача для MVP, правильная настройка subscriptions улучшит пользовательский опыт.
</context>

<task>
Определи, какие subscriptions необходимы для MVP, и добавь их в schema. Настрой @auth директивы для subscriptions и протестируй real-time обновления.
</task>

<constraints>
- Subscriptions должны быть добавлены только если требуются для MVP
- Subscriptions должны иметь правильные @auth директивы
- Real-time обновления должны работать корректно
- Используй правильный синтаксис @aws_subscribe
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Определи, какие subscriptions необходимы для MVP
2. Изучи GRAPHQL_SCHEMA.md раздел Subscriptions для понимания требований
3. Используй Context7 для получения актуальной документации AWS AppSync Subscriptions
4. Определи правила авторизации для каждой subscription
5. Только после этого добавляй subscriptions в schema
</thinking>

**Действия:**
- [x] Определить, какие subscriptions необходимы для MVP
- [x] Добавить subscriptions в schema (если требуются):
  - `onCreateLesson: Lesson`
  - `onUpdateLesson: Lesson`
  - `onCreateHomeworkCheck: HomeworkCheck`
- [x] Настроить @auth для subscriptions
- [x] Протестировать subscriptions

**Документация:**
- [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md) - раздел Subscriptions
- AWS AppSync Subscriptions документация (через Context7)

**Критерии приемки:**
- Subscriptions добавлены (если требуются)
- Subscriptions имеют правильные @auth директивы
- Real-time обновления работают

<output_format>
После выполнения задачи subscriptions должны быть добавлены в schema (если требуются), subscriptions должны иметь правильные @auth директивы, и real-time обновления должны работать.
</output_format>

---

### Task 04.09: Оптимизация производительности queries

<context>
Оптимизация производительности queries критически важна для обеспечения быстрой работы приложения. Правильное использование индексов (GSI) определяет производительность всех queries.
</context>

<task>
Проанализируй access patterns и оптимизируй производительность queries. Убедись, что все queries используют правильные индексы (GSI) и оптимизируй сложные queries через кастомные resolvers если необходимо.
</task>

<constraints>
- Все queries должны использовать правильные индексы (GSI)
- Производительность queries должна быть приемлемой
- Оптимизация должна быть применена где необходимо
- Сложные queries могут быть оптимизированы через кастомные resolvers
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Проанализируй access patterns из DATA_MODELING.md
2. Изучи DYNAMODB_SCHEMA.md раздел GSI для понимания доступных индексов
3. Используй Context7 для получения актуальной документации AWS DynamoDB Best Practices
4. Определи, какие queries требуют оптимизации
5. Только после этого оптимизируй queries
</thinking>

**Действия:**
- [x] Проанализировать access patterns из [DATA_MODELING.md](../../../database/DATA_MODELING.md)
- [x] Убедиться, что все queries используют правильные индексы (GSI)
- [x] Оптимизировать сложные queries через кастомные resolvers (если необходимо)
- [x] Протестировать производительность queries

**Документация:**
- <CRITICAL>[DATA_MODELING.md](../../../database/DATA_MODELING.md) - раздел Access Patterns</CRITICAL>
- <CRITICAL>[DYNAMODB_SCHEMA.md](../../../database/DYNAMODB_SCHEMA.md) - раздел GSI</CRITICAL>
- AWS DynamoDB Best Practices (через Context7)

**Критерии приемки:**
- Все queries используют правильные индексы
- Производительность queries приемлемая
- Оптимизация применена где необходимо

<output_format>
После выполнения задачи все queries должны использовать правильные индексы, производительность должна быть приемлемой, и оптимизация должна быть применена где необходимо.
</output_format>

---

### Task 04.10: Генерация TypeScript типов из GraphQL Schema

<context>
Генерация TypeScript типов из GraphQL Schema критически важна для типобезопасности приложения. Автоматическая генерация типов обеспечивает синхронизацию типов с schema.
</context>

<task>
Настрой GraphQL Code Generator для автоматической генерации TypeScript типов из AppSync schema. Установи необходимые пакеты, создай конфигурацию и запусти генерацию типов.
</task>

<constraints>
- GraphQL Code Generator должен быть установлен и настроен
- TypeScript типы должны генерироваться из AppSync schema
- Типы должны использоваться в проекте
- Конфигурация должна быть правильной
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Изучи ARCHITECTURE.md раздел Type Safety для понимания требований
2. Используй Context7 для получения актуальной документации GraphQL Code Generator
3. Определи структуру конфигурации codegen.yml
4. Настрой генерацию типов из AppSync schema
5. Только после этого запускай генерацию
</thinking>

**Действия:**
- [x] Установить GraphQL Code Generator: `npm install --save-dev @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-operations`
- [x] Создать конфигурацию `codegen.yml` для генерации типов
- [x] Настроить генерацию типов из AppSync schema
- [x] Запустить генерацию: `npm run codegen` (или аналогичная команда)
- [x] Проверить сгенерированные типы

**Документация:**
- GraphQL Code Generator документация (через Context7)
- [ARCHITECTURE.md](../../../architecture/ARCHITECTURE.md) - раздел Type Safety

**Критерии приемки:**
- GraphQL Code Generator установлен и настроен
- TypeScript типы генерируются из schema
- Типы используются в проекте

<output_format>
После выполнения задачи GraphQL Code Generator должен быть установлен и настроен, TypeScript типы должны генерироваться из schema, и типы должны использоваться в проекте.
</output_format>

---

### Task 04.11: Push обновлений в AWS

<context>
<CRITICAL>Это критически важная задача!</CRITICAL> Push обновлений в AWS применяет все изменения в GraphQL Schema к AppSync API. После push изменения вступают в силу в production.
</context>

<task>
Запусти `amplify push` для применения всех изменений в GraphQL Schema к AppSync API в AWS. Убедись, что все обновления применены успешно.
</task>

<constraints>
- Используй команду `amplify push` (Gen 1, НЕ Gen 2!)
- Подтверди обновление ресурсов только после проверки
- Дождись завершения обновления AppSync API
- Проверь статус после обновления
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Убедись, что все предыдущие задачи выполнены
2. Изучи AWS_AMPLIFY.md раздел Push для понимания процесса
3. Подготовься к проверке обновлений
4. Только после этого запускай `amplify push`
</thinking>

**Действия:**
- [x] Запустить `amplify push`
- [x] Подтвердить обновление ресурсов
- [x] Дождаться завершения обновления AppSync API
- [x] Проверить статус: `amplify status`

**Документация:**
- <CRITICAL>[AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md) - раздел Push</CRITICAL>

**Критерии приемки:**
- Команда `amplify push` выполнена успешно
- AppSync API обновлен
- Нет ошибок при обновлении

<output_format>
После выполнения задачи команда `amplify push` должна быть выполнена успешно, AppSync API должен быть обновлен, и не должно быть ошибок при обновлении.
</output_format>

---

### Task 04.12: Тестирование GraphQL API в AppSync Console

<context>
Тестирование GraphQL API в AppSync Console необходимо для подтверждения правильности работы всех queries, mutations и авторизации. Это важный шаг перед использованием API в приложении.
</context>

<task>
Протестируй GraphQL API в AWS AppSync Console. Проверь работу всех основных queries и mutations, а также работу авторизации.
</task>

<constraints>
- Все queries должны работать корректно
- Все mutations должны работать корректно
- Авторизация должна работать правильно
- Данные должны сохраняться в DynamoDB
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Убедись, что push выполнен успешно (Task 04.11)
2. Изучи GRAPHQL_SCHEMA.md для понимания доступных queries и mutations
3. Подготовь тестовые данные для проверки
4. Только после этого тестируй API
</thinking>

**Действия:**
- [x] Открыть AWS AppSync Console
- [x] Перейти в раздел Queries
- [x] Протестировать все основные queries:
  - `listGrades`
  - `getGrade(id: "...")`
  - `listLessons(gradeId: "...")`
  - И другие queries
- [x] Протестировать основные mutations:
  - `createGrade`
  - `updateGrade`
  - `createLesson`
  - И другие mutations
- [x] Проверить работу авторизации

**Документация:**
- [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md)
- AWS AppSync Console документация

**Критерии приемки:**
- Все queries работают корректно
- Все mutations работают корректно
- Авторизация работает правильно
- Данные сохраняются в DynamoDB

<output_format>
После выполнения задачи все queries должны работать корректно, все mutations должны работать корректно, авторизация должна работать правильно, и данные должны сохраняться в DynamoDB.
</output_format>

---

### Task 04.13: Документирование API endpoints

<context>
Документирование API endpoints критически важно для команды и будущей работы с API. Все queries и mutations должны быть задокументированы с примерами использования.
</context>

<task>
Создай документацию по использованию GraphQL API. Задокументируй все queries и mutations с примерами, а также требования к авторизации. Обнови GRAPHQL_SCHEMA.md если необходимо.
</task>

<constraints>
- Документация API должна быть создана
- Все queries должны быть задокументированы с примерами
- Все mutations должны быть задокументированы с примерами
- Требования к авторизации должны быть задокументированы
- Документация должна быть актуальна
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Собери всю информацию о queries и mutations
2. Подготовь примеры использования для каждого query и mutation
3. Изучи GRAPHQL_SCHEMA.md и SERVER_ACTIONS.md для понимания структуры документации
4. Только после этого создавай документацию
</thinking>

**Действия:**
- [x] Создать документацию по использованию GraphQL API
- [x] Задокументировать все queries с примерами
- [x] Задокументировать все mutations с примерами
- [x] Задокументировать требования к авторизации
- [x] Обновить [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md) если необходимо

**Документация:**
- [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md)
- [SERVER_ACTIONS.md](../../../api/SERVER_ACTIONS.md)

**Критерии приемки:**
- Документация API создана
- Примеры использования добавлены
- Документация актуальна

<output_format>
После выполнения задачи документация API должна быть создана, примеры использования должны быть добавлены, и документация должна быть актуальна.
</output_format>

---

### Task 04.14: Настройка мониторинга и логирования

<context>
Настройка мониторинга и логирования важна для отслеживания работы API и выявления проблем. Однако для MVP это не критично, так как CloudWatch Logs добавляют дополнительные затраты и сложность, которые не требуются на начальном этапе.
</context>

<task>
Для MVP мониторинг и логирование для AppSync API не настраиваются. Если в будущем потребуется мониторинг, можно включить CloudWatch Logs через AWS Console или AWS CLI.
</task>

<constraints>
- Для MVP мониторинг и логирование не требуются
- Если в будущем понадобится, можно включить CloudWatch Logs через AWS Console
- Алерты для ошибок опциональны и не требуются для MVP
</constraints>

<thinking>
Важно понимать:
1. Для MVP мониторинг и логирование не критичны
2. CloudWatch Logs добавляют дополнительные затраты
3. Если в будущем понадобится, можно включить через AWS Console → AppSync → Settings → Logging
4. Для MVP достаточно базового мониторинга через AWS Console (метрики доступны без дополнительной настройки)
</thinking>

**Действия:**
- [x] Подтверждено, что для MVP мониторинг и логирование не требуются
- [x] Если в будущем понадобится, можно включить CloudWatch Logs через AWS Console
- [x] Базовые метрики доступны в AWS Console без дополнительной настройки

**Документация:**
- AWS CloudWatch документация (через Context7)
- AWS AppSync Monitoring документация (через Context7)

**Критерии приемки:**
- Для MVP мониторинг и логирование не требуются
- Если в будущем понадобится, можно включить через AWS Console

<output_format>
Для MVP мониторинг и логирование не настраиваются. Если в будущем потребуется мониторинг, можно включить CloudWatch Logs через AWS Console → AppSync → Settings → Logging.
</output_format>

---

### Task 04.15: Финальная проверка GraphQL API

<context>
<CRITICAL>Это финальная проверка фазы!</CRITICAL> Финальная проверка GraphQL API необходима для подтверждения готовности API к использованию в приложении. Все функции должны работать корректно.
</context>

<task>
Проведи финальную проверку GraphQL API. Протестируй все queries и mutations, проверь работу авторизации для всех ролей, проверь производительность API и убедись, что нет критических ошибок.
</task>

<constraints>
- Все функции API должны работать корректно
- Авторизация должна работать для всех ролей
- Производительность должна быть приемлемой
- Не должно быть критических ошибок
- API должен быть готов к использованию в приложении
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Убедись, что все предыдущие задачи выполнены
2. Подготовься к полному тестированию всех функций API
3. Подготовь тестовые данные для всех ролей
4. Только после этого проводи финальную проверку
</thinking>

**Действия:**
- [x] Провести полное тестирование всех queries
- [x] Провести полное тестирование всех mutations
- [x] Проверить работу авторизации для всех ролей
- [x] Проверить производительность API
- [x] Убедиться, что нет критических ошибок

**Документация:**
- [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md)
- [SECURITY.md](../../../infrastructure/SECURITY.md)

**Критерии приемки:**
- Все функции API работают корректно
- Авторизация работает для всех ролей
- Производительность приемлемая
- API готов к использованию в приложении

<output_format>
После выполнения задачи все функции API должны работать корректно, авторизация должна работать для всех ролей, производительность должна быть приемлемой, и API должен быть готов к использованию в приложении.
</output_format>

---

## Ссылки на документацию проекта

- [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md) - GraphQL Schema
- [DYNAMODB_SCHEMA.md](../../../database/DYNAMODB_SCHEMA.md) - Схема DynamoDB
- [DATA_MODELING.md](../../../database/DATA_MODELING.md) - Моделирование данных
- [SECURITY.md](../../../infrastructure/SECURITY.md) - Безопасность и авторизация
- [AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md) - Настройка AWS Amplify

---

## Примечания

- GraphQL schema создается вместе с DynamoDB таблицами в Phase 03
- Данная фаза фокусируется на оптимизации и финальной настройке API
- Авторизация критически важна - убедитесь, что @auth директивы настроены правильно
- Производительность queries зависит от правильного использования индексов
- TypeScript типы из GraphQL schema улучшают типобезопасность приложения

---

## ⚠️ Важно: Проверка дублирующих ресурсов

**После завершения фазы обязательно выполните проверку на наличие дублирующих AWS ресурсов:**

```bash
# Linux/Mac
./scripts/check-duplicate-resources.sh eu-west-1

# Windows
.\scripts\check-duplicate-resources.ps1 eu-west-1
```

**Почему это важно:**
- Предотвращает создание дублирующих ресурсов (AppSync API, Cognito User Pools, DynamoDB таблицы, CloudFormation стеки)
- Помогает обнаружить проблемы на раннем этапе
- Снижает неожиданные затраты на AWS

**Если обнаружены дублирующие ресурсы:**
- См. [DUPLICATE_RESOURCES_INCIDENT.md](../../../infrastructure/DUPLICATE_RESOURCES_INCIDENT.md) для инструкций по устранению
- Следуйте [BRANCH_SETUP_CHECKLIST.md](../../../infrastructure/BRANCH_SETUP_CHECKLIST.md) при подключении новых веток

---

**Версия:** 1.1  
**Последнее обновление:** 27 декабря 2025

