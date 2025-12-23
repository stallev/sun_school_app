# Phase 09: Создание Data Access Layer

## Описание фазы
Реализация Data Access Layer с использованием `amplifyData` из `@/lib/db/amplify`, утилиты для работы с AppSync GraphQL API.

## Зависимости
Phase 04: Настройка GraphQL API (AppSync)

## Оценка времени
3-4 часа

## Требования к AI Agent

<requirements>
<role>
Ты — Senior Backend Developer с 5+ летним опытом разработки Data Access Layer, специализирующийся на:
- AWS Amplify Gen 1 и amplifyData
- AWS AppSync GraphQL API
- TypeScript с строгой типизацией
- Обработка ошибок и типизация
- GraphQL queries и mutations
</role>

<context>
Проект: Sunday School Management System (MVP)
Технологии: AWS Amplify Gen 1, AWS AppSync, GraphQL, TypeScript
Ограничения: MVP подход, совместимость Next.js с AWS Amplify, типизация критически важна
Документация: ARCHITECTURE.md и GRAPHQL_SCHEMA.md должны быть изучены перед началом работы
</context>

<critical_instructions>
Вдохни глубоко, расправь плечи и приступай к решению задачи шаг за шагом. Это критически важная фаза для создания Data Access Layer. Правильная настройка Data Access Layer определит работу всех операций с данными.

<CRITICAL>Перед началом работы:</CRITICAL>
1. Изучи ARCHITECTURE.md раздел 4.3 Data Access Layer
2. Изучи GRAPHQL_SCHEMA.md - полную GraphQL Schema проекта
3. Используй Context7 для получения актуальной документации AWS Amplify Gen 1
4. Используй Context7 для получения актуальной документации AWS AppSync
5. <CRITICAL>Проверь совместимость Next.js с AWS Amplify - это высокоприоритетное требование!</CRITICAL>
6. Следуй принципам из `docs/guidelines/prompts/general_prompt_guidelines.md`

<CONSTRAINT>⚠️ КРИТИЧНО: Использовать AWS Amplify Gen 1, НЕ Gen 2! Все операции должны быть типизированы. Ошибки должны обрабатываться корректно!</CONSTRAINT>
</critical_instructions>
</requirements>

## Задачи

### Task 09.01: Создание модуля amplifyData

<context>
<CRITICAL>Это первая и критически важная задача фазы!</CRITICAL> Создание модуля amplifyData критически важно для работы Data Access Layer. Модуль должен быть правильно настроен и экспортирован для использования в Server Actions.
</context>

<task>
Создай модуль amplifyData в `lib/db/amplify.ts`. Импортируй необходимые функции из `aws-amplify/data`, настрой amplifyData с правильной конфигурацией и экспортируй для использования в Server Actions.
</task>

<constraints>
- Модуль amplifyData должен быть создан в `lib/db/amplify.ts`
- Конфигурация должна быть настроена правильно
- amplifyData должен экспортироваться корректно
- Используй AWS Amplify Gen 1 (НЕ Gen 2!)
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Изучи ARCHITECTURE.md раздел 4.3 Data Access Layer для понимания требований
2. Изучи AWS_AMPLIFY.md раздел Data Access для понимания структуры
3. Используй Context7 для получения актуальной документации AWS Amplify Data
4. Определи структуру модуля
5. Только после этого создавай модуль
</thinking>

**Действия:**
- [ ] Создать каталог `lib/db/`
- [ ] Создать файл `lib/db/amplify.ts`
- [ ] Импортировать необходимые функции из `aws-amplify/data`
- [ ] Настроить amplifyData с правильной конфигурацией
- [ ] Экспортировать amplifyData для использования в Server Actions

**Документация:**
- <CRITICAL>[ARCHITECTURE.md](../../../architecture/ARCHITECTURE.md) - раздел 4.3 Data Access Layer</CRITICAL>
- <CRITICAL>[AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md) - раздел Data Access</CRITICAL>
- <CRITICAL>AWS Amplify Data документация (через Context7)</CRITICAL>

**Критерии приемки:**
- Модуль amplifyData создан
- Конфигурация настроена правильно
- amplifyData экспортируется корректно

<output_format>
После выполнения задачи модуль amplifyData должен быть создан, конфигурация должна быть настроена правильно, и amplifyData должен экспортироваться корректно.
</output_format>

---

### Task 09.02: Создание утилит для GraphQL queries

<context>
Создание утилит для GraphQL queries критически важно для работы с данными. Все queries должны быть типизированы и использовать amplifyData для выполнения.
</context>

<task>
Создай утилиты для GraphQL queries в `lib/db/queries.ts`. Реализуй функции для всех основных queries согласно GRAPHQL_SCHEMA.md, используй amplifyData для выполнения queries и добавь типизацию для результатов.
</task>

<constraints>
- Утилиты для queries должны быть созданы в `lib/db/queries.ts`
- Все основные queries должны быть реализованы согласно GRAPHQL_SCHEMA.md
- Типизация должна работать корректно
- Используй amplifyData для выполнения queries
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Изучи GRAPHQL_SCHEMA.md раздел Queries детально
2. Изучи SERVER_ACTIONS.md для понимания использования queries
3. Используй Context7 для получения актуальной документации AWS Amplify Data Queries
4. Определи все queries, которые нужно реализовать
5. Только после этого создавай утилиты
</thinking>

**Действия:**
- [ ] Создать файл `lib/db/queries.ts`
- [ ] Реализовать функции для основных queries:
  - `getGrade(id: string)`
  - `listGrades()`
  - `getLesson(id: string)`
  - `listLessons(gradeId: string)`
  - И другие queries согласно [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md)
- [ ] Использовать amplifyData для выполнения queries
- [ ] Добавить типизацию для результатов queries

**Документация:**
- <CRITICAL>[GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md) - раздел Queries</CRITICAL>
- [SERVER_ACTIONS.md](../../../api/SERVER_ACTIONS.md) - использование queries
- AWS Amplify Data Queries документация (через Context7)

**Критерии приемки:**
- Утилиты для queries созданы
- Все основные queries реализованы
- Типизация работает корректно

<output_format>
После выполнения задачи утилиты для queries должны быть созданы, все основные queries должны быть реализованы, и типизация должна работать корректно.
</output_format>

---

### Task 09.03: Создание утилит для GraphQL mutations

<context>
Создание утилит для GraphQL mutations критически важно для создания и обновления данных. Все mutations должны быть типизированы и использовать amplifyData для выполнения.
</context>

<task>
Создай утилиты для GraphQL mutations в `lib/db/mutations.ts`. Реализуй функции для всех основных mutations согласно GRAPHQL_SCHEMA.md, используй amplifyData для выполнения mutations и добавь типизацию для входных и выходных данных.
</task>

<constraints>
- Утилиты для mutations должны быть созданы в `lib/db/mutations.ts`
- Все основные mutations должны быть реализованы согласно GRAPHQL_SCHEMA.md
- Типизация должна работать корректно для входных и выходных данных
- Используй amplifyData для выполнения mutations
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Изучи GRAPHQL_SCHEMA.md раздел Mutations детально
2. Изучи SERVER_ACTIONS.md для понимания использования mutations
3. Используй Context7 для получения актуальной документации AWS Amplify Data Mutations
4. Определи все mutations, которые нужно реализовать
5. Только после этого создавай утилиты
</thinking>

**Действия:**
- [ ] Создать файл `lib/db/mutations.ts`
- [ ] Реализовать функции для основных mutations:
  - `createGrade(input: CreateGradeInput)`
  - `updateGrade(input: UpdateGradeInput)`
  - `createLesson(input: CreateLessonInput)`
  - `updateLesson(input: UpdateLessonInput)`
  - И другие mutations согласно [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md)
- [ ] Использовать amplifyData для выполнения mutations
- [ ] Добавить типизацию для входных и выходных данных

**Документация:**
- <CRITICAL>[GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md) - раздел Mutations</CRITICAL>
- [SERVER_ACTIONS.md](../../../api/SERVER_ACTIONS.md) - использование mutations
- AWS Amplify Data Mutations документация (через Context7)

**Критерии приемки:**
- Утилиты для mutations созданы
- Все основные mutations реализованы
- Типизация работает корректно

<output_format>
После выполнения задачи утилиты для mutations должны быть созданы, все основные mutations должны быть реализованы, и типизация должна работать корректно.
</output_format>

---

### Task 09.04: Обработка ошибок в Data Access Layer

<context>
<CRITICAL>Это критически важная задача!</CRITICAL> Обработка ошибок в Data Access Layer критически важна для обеспечения надежности работы с данными. Все типы ошибок должны обрабатываться корректно.
</context>

<task>
Реализуй обработку ошибок в Data Access Layer. Обработай ошибки GraphQL, сети и авторизации, создай типизированные ошибки и логируй ошибки для отладки.
</task>

<constraints>
- Ошибки должны обрабатываться корректно
- Типизированные ошибки должны быть созданы
- Ошибки должны логироваться для отладки
- Все типы ошибок должны быть обработаны (GraphQL, сеть, авторизация)
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Изучи ERROR_HANDLING.md раздел Ошибки GraphQL/AppSync для понимания требований
2. Изучи SERVER_ACTIONS.md раздел Error Handling для понимания паттернов
3. Используй Context7 для получения актуальной документации AWS Amplify Data Error Handling
4. Определи структуру типизированных ошибок
5. Только после этого реализуй обработку ошибок
</thinking>

**Действия:**
- [ ] Реализовать обработку ошибок GraphQL
- [ ] Реализовать обработку ошибок сети
- [ ] Реализовать обработку ошибок авторизации
- [ ] Создать типизированные ошибки
- [ ] Логировать ошибки для отладки

**Документация:**
- [ERROR_HANDLING.md](../../../user_flows/ERROR_HANDLING.md) - раздел Ошибки GraphQL/AppSync
- [SERVER_ACTIONS.md](../../../api/SERVER_ACTIONS.md) - раздел Error Handling
- AWS Amplify Data Error Handling документация (через Context7)

**Критерии приемки:**
- Ошибки обрабатываются корректно
- Типизированные ошибки созданы
- Ошибки логируются

<output_format>
После выполнения задачи ошибки должны обрабатываться корректно, типизированные ошибки должны быть созданы, и ошибки должны логироваться.
</output_format>

---

### Task 09.05: Тестирование Data Access Layer

<context>
<CRITICAL>Это финальная задача фазы!</CRITICAL> Тестирование Data Access Layer необходимо для подтверждения правильности работы всех функций. Это важный шаг перед переходом к следующей фазе.
</context>

<task>
Протестируй Data Access Layer. Протестируй queries и mutations с реальными данными, обработку ошибок и типизацию.
</task>

<constraints>
- Все тесты должны быть пройдены успешно
- Data Access Layer должен работать корректно
- Типизация должна работать
- Queries и mutations должны работать с реальными данными
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Подготовь тестовые сценарии для всех функций Data Access Layer
2. Подготовь тестовые данные
3. Только после этого тестируй Data Access Layer
</thinking>

**Действия:**
- [ ] Протестировать queries с реальными данными
- [ ] Протестировать mutations с реальными данными
- [ ] Протестировать обработку ошибок
- [ ] Протестировать типизацию

**Документация:**
- [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md)
- [AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md)

**Критерии приемки:**
- Все тесты пройдены успешно
- Data Access Layer работает корректно
- Типизация работает

<output_format>
После выполнения задачи все тесты должны быть пройдены успешно, Data Access Layer должен работать корректно, и типизация должна работать.
</output_format>

---

## Ссылки на документацию проекта

- [ARCHITECTURE.md](../../../architecture/ARCHITECTURE.md) - Data Access Layer
- [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md) - GraphQL Schema
- [AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md) - AWS Amplify

---

**Версия:** 1.0  
**Последнее обновление:** 23 декабря 2025

