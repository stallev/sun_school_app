# Phase 04: Настройка GraphQL API (AppSync)

## Описание фазы
Создание GraphQL schema для AWS AppSync, настройка resolvers, типов, queries, mutations, subscriptions, авторизация через @auth директивы.

**Примечание:** Эта фаза частично пересекается с Phase 03, так как GraphQL schema создается вместе с DynamoDB таблицами. Данная фаза фокусируется на финальной настройке и оптимизации API.

## Зависимости
Phase 03: Настройка базы данных DynamoDB

## Оценка времени
6-8 часов

## Требования к AI Agent

> [!IMPORTANT]
> - AI Agent при создании программного кода должен использовать актуальную документацию для конкретной версии библиотеки или фреймворка через Context7
> - Для AWS AppSync должна быть использована официальная документация AWS
> - Перед созданием resolvers необходимо изучить GraphQL Schema документацию проекта
> - Следовать принципам из `docs/guidelines/prompts/general_prompt_guidelines.md`

## Задачи

### Task 04.01: Проверка GraphQL Schema
- [ ] Открыть файл `amplify/backend/api/[api-name]/schema.graphql`
- [ ] Проверить, что все типы из [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md) присутствуют
- [ ] Проверить, что все queries определены
- [ ] Проверить, что все mutations определены
- [ ] Проверить, что все @auth директивы настроены правильно

**Документация:**
- [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md) - полная GraphQL Schema
- [ERD.md](../../../database/ERD.md) - все сущности

**Критерии приемки:**
- Schema соответствует документации
- Все типы, queries и mutations присутствуют
- @auth директивы настроены

---

### Task 04.02: Настройка кастомных resolvers (если требуется)
- [ ] Определить, нужны ли кастомные resolvers (в большинстве случаев @model генерирует их автоматически)
- [ ] Для сложных queries создать кастомные resolvers в `amplify/backend/api/[api-name]/resolvers/`
- [ ] Настроить resolver mapping templates (VTL)
- [ ] Протестировать кастомные resolvers

**Документация:**
- [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md) - раздел Custom Resolvers
- AWS AppSync Resolvers документация (через Context7)

**Критерии приемки:**
- Кастомные resolvers созданы (если требуются)
- Resolvers работают корректно
- Mapping templates настроены правильно

---

### Task 04.03: Настройка фильтрации и пагинации
- [ ] Убедиться, что queries поддерживают фильтрацию через `filter` аргумент
- [ ] Настроить пагинацию через `limit` и `nextToken` для list queries
- [ ] Протестировать фильтрацию на примере `listLessons(filter: { gradeId: { eq: "xxx" } })`
- [ ] Протестировать пагинацию

**Документация:**
- [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md) - раздел Queries
- AWS AppSync Filtering документация (через Context7)

**Критерии приемки:**
- Фильтрация работает для всех list queries
- Пагинация настроена корректно
- Тесты пройдены успешно

---

### Task 04.04: Настройка оптимистичной блокировки (Conflict Detection)
- [ ] Убедиться, что в schema включен `@versioned` для типов, требующих оптимистичной блокировки
- [ ] Проверить настройку conflict detection в Amplify
- [ ] Протестировать работу conflict detection при одновременных обновлениях

**Документация:**
- [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md) - раздел Versioning
- AWS AppSync Conflict Detection документация (через Context7)

**Критерии приемки:**
- Conflict detection настроен для критичных типов
- Одновременные обновления обрабатываются корректно
- Конфликты разрешаются правильно

---

### Task 04.05: Настройка авторизации для queries
- [ ] Проверить @auth директивы для всех queries
- [ ] Убедиться, что Teacher может видеть только свои группы
- [ ] Убедиться, что Admin может видеть все данные
- [ ] Протестировать авторизацию с разными ролями

**Документация:**
- [SECURITY.md](../../../infrastructure/SECURITY.md) - раздел RBAC
- [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md) - раздел Authorization
- AWS AppSync @auth документация (через Context7)

**Критерии приемки:**
- Все queries имеют правильные @auth директивы
- Teacher видит только свои группы
- Admin видит все данные
- Авторизация работает корректно

---

### Task 04.06: Настройка авторизации для mutations
- [ ] Проверить @auth директивы для всех mutations
- [ ] Убедиться, что Teacher может создавать уроки только для своих групп
- [ ] Убедиться, что Admin может выполнять все mutations
- [ ] Протестировать авторизацию mutations с разными ролями

**Документация:**
- [SECURITY.md](../../../infrastructure/SECURITY.md) - раздел RBAC
- [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md) - раздел Authorization

**Критерии приемки:**
- Все mutations имеют правильные @auth директивы
- Teacher ограничен своими группами
- Admin имеет полный доступ
- Авторизация работает корректно

---

### Task 04.07: Настройка Input типов и валидации
- [ ] Проверить, что все Input типы определены для mutations
- [ ] Убедиться, что обязательные поля помечены как `!` (non-nullable)
- [ ] Добавить валидацию на уровне GraphQL schema где возможно
- [ ] Протестировать валидацию при создании/обновлении записей

**Документация:**
- [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md) - раздел Input Types
- [VALIDATION.md](../../../api/VALIDATION.md) - валидация данных

**Критерии приемки:**
- Все Input типы определены
- Обязательные поля помечены правильно
- Валидация работает на уровне GraphQL

---

### Task 04.08: Настройка subscriptions для real-time обновлений
- [ ] Определить, какие subscriptions необходимы для MVP
- [ ] Добавить subscriptions в schema (если требуются):
  - `onCreateLesson: Lesson`
  - `onUpdateLesson: Lesson`
  - `onCreateHomeworkCheck: HomeworkCheck`
- [ ] Настроить @auth для subscriptions
- [ ] Протестировать subscriptions

**Документация:**
- [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md) - раздел Subscriptions
- AWS AppSync Subscriptions документация (через Context7)

**Критерии приемки:**
- Subscriptions добавлены (если требуются)
- Subscriptions имеют правильные @auth директивы
- Real-time обновления работают

---

### Task 04.09: Оптимизация производительности queries
- [ ] Проанализировать access patterns из [DATA_MODELING.md](../../../database/DATA_MODELING.md)
- [ ] Убедиться, что все queries используют правильные индексы (GSI)
- [ ] Оптимизировать сложные queries через кастомные resolvers (если необходимо)
- [ ] Протестировать производительность queries

**Документация:**
- [DATA_MODELING.md](../../../database/DATA_MODELING.md) - раздел Access Patterns
- [DYNAMODB_SCHEMA.md](../../../database/DYNAMODB_SCHEMA.md) - раздел GSI
- AWS DynamoDB Best Practices (через Context7)

**Критерии приемки:**
- Все queries используют правильные индексы
- Производительность queries приемлемая
- Оптимизация применена где необходимо

---

### Task 04.10: Генерация TypeScript типов из GraphQL Schema
- [ ] Установить GraphQL Code Generator: `npm install --save-dev @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-operations`
- [ ] Создать конфигурацию `codegen.yml` для генерации типов
- [ ] Настроить генерацию типов из AppSync schema
- [ ] Запустить генерацию: `npm run codegen` (или аналогичная команда)
- [ ] Проверить сгенерированные типы

**Документация:**
- GraphQL Code Generator документация (через Context7)
- [ARCHITECTURE.md](../../../architecture/ARCHITECTURE.md) - раздел Type Safety

**Критерии приемки:**
- GraphQL Code Generator установлен и настроен
- TypeScript типы генерируются из schema
- Типы используются в проекте

---

### Task 04.11: Push обновлений в AWS
- [ ] Запустить `amplify push`
- [ ] Подтвердить обновление ресурсов
- [ ] Дождаться завершения обновления AppSync API
- [ ] Проверить статус: `amplify status`

**Документация:**
- [AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md) - раздел Push

**Критерии приемки:**
- Команда `amplify push` выполнена успешно
- AppSync API обновлен
- Нет ошибок при обновлении

---

### Task 04.12: Тестирование GraphQL API в AppSync Console
- [ ] Открыть AWS AppSync Console
- [ ] Перейти в раздел Queries
- [ ] Протестировать все основные queries:
  - `listGrades`
  - `getGrade(id: "...")`
  - `listLessons(gradeId: "...")`
  - И другие queries
- [ ] Протестировать основные mutations:
  - `createGrade`
  - `updateGrade`
  - `createLesson`
  - И другие mutations
- [ ] Проверить работу авторизации

**Документация:**
- [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md)
- AWS AppSync Console документация

**Критерии приемки:**
- Все queries работают корректно
- Все mutations работают корректно
- Авторизация работает правильно
- Данные сохраняются в DynamoDB

---

### Task 04.13: Документирование API endpoints
- [ ] Создать документацию по использованию GraphQL API
- [ ] Задокументировать все queries с примерами
- [ ] Задокументировать все mutations с примерами
- [ ] Задокументировать требования к авторизации
- [ ] Обновить [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md) если необходимо

**Документация:**
- [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md)
- [SERVER_ACTIONS.md](../../../api/SERVER_ACTIONS.md)

**Критерии приемки:**
- Документация API создана
- Примеры использования добавлены
- Документация актуальна

---

### Task 04.14: Настройка мониторинга и логирования
- [ ] Включить CloudWatch Logs для AppSync API
- [ ] Настроить логирование запросов (если необходимо)
- [ ] Настроить алерты для ошибок (опционально)
- [ ] Проверить работу логирования

**Документация:**
- AWS CloudWatch документация (через Context7)
- AWS AppSync Monitoring документация (через Context7)

**Критерии приемки:**
- CloudWatch Logs включены
- Логирование работает
- Можно отслеживать запросы к API

---

### Task 04.15: Финальная проверка GraphQL API
- [ ] Провести полное тестирование всех queries
- [ ] Провести полное тестирование всех mutations
- [ ] Проверить работу авторизации для всех ролей
- [ ] Проверить производительность API
- [ ] Убедиться, что нет критических ошибок

**Документация:**
- [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md)
- [SECURITY.md](../../../infrastructure/SECURITY.md)

**Критерии приемки:**
- Все функции API работают корректно
- Авторизация работает для всех ролей
- Производительность приемлемая
- API готов к использованию в приложении

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

**Версия:** 1.0  
**Последнее обновление:** 23 декабря 2025

