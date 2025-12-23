# Phase 09: Создание Data Access Layer

## Описание фазы
Реализация Data Access Layer с использованием `amplifyData` из `@/lib/db/amplify`, утилиты для работы с AppSync GraphQL API.

## Зависимости
Phase 04: Настройка GraphQL API (AppSync)

## Оценка времени
3-4 часа

## Требования к AI Agent

> [!IMPORTANT]
> - AI Agent при создании программного кода должен использовать актуальную документацию для конкретной версии библиотеки или фреймворка через Context7
> - Для AWS Amplify Data должна быть использована официальная документация AWS Amplify Gen 1
> - Перед созданием кода необходимо проверять какой функционал NextJS поддерживается AWS Amplify. Это высокоприоритетное требование.
> - Следовать принципам из `docs/guidelines/prompts/general_prompt_guidelines.md`

## Задачи

### Task 09.01: Создание модуля amplifyData
- [ ] Создать каталог `lib/db/`
- [ ] Создать файл `lib/db/amplify.ts`
- [ ] Импортировать необходимые функции из `aws-amplify/data`
- [ ] Настроить amplifyData с правильной конфигурацией
- [ ] Экспортировать amplifyData для использования в Server Actions

**Документация:**
- [ARCHITECTURE.md](../../../architecture/ARCHITECTURE.md) - раздел 4.3 Data Access Layer
- [AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md) - раздел Data Access
- AWS Amplify Data документация (через Context7)

**Критерии приемки:**
- Модуль amplifyData создан
- Конфигурация настроена правильно
- amplifyData экспортируется корректно

---

### Task 09.02: Создание утилит для GraphQL queries
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
- [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md) - раздел Queries
- [SERVER_ACTIONS.md](../../../api/SERVER_ACTIONS.md) - использование queries
- AWS Amplify Data Queries документация (через Context7)

**Критерии приемки:**
- Утилиты для queries созданы
- Все основные queries реализованы
- Типизация работает корректно

---

### Task 09.03: Создание утилит для GraphQL mutations
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
- [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md) - раздел Mutations
- [SERVER_ACTIONS.md](../../../api/SERVER_ACTIONS.md) - использование mutations
- AWS Amplify Data Mutations документация (через Context7)

**Критерии приемки:**
- Утилиты для mutations созданы
- Все основные mutations реализованы
- Типизация работает корректно

---

### Task 09.04: Обработка ошибок в Data Access Layer
- [ ] Реализовать обработку ошибок GraphQL
- [ ] Реализовать обработку ошибок сети
- [ ] Реализовать обработку ошибок авторизации
- [ ] Создать типизированные ошибки
- [ ] Логировать ошибки для отладки

**Документация:**
- [SERVER_ACTIONS.md](../../../api/SERVER_ACTIONS.md) - раздел Error Handling
- AWS Amplify Data Error Handling документация (через Context7)

**Критерии приемки:**
- Ошибки обрабатываются корректно
- Типизированные ошибки созданы
- Ошибки логируются

---

### Task 09.05: Тестирование Data Access Layer
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

---

## Ссылки на документацию проекта

- [ARCHITECTURE.md](../../../architecture/ARCHITECTURE.md) - Data Access Layer
- [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md) - GraphQL Schema
- [AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md) - AWS Amplify

---

**Версия:** 1.0  
**Последнее обновление:** 23 декабря 2025

