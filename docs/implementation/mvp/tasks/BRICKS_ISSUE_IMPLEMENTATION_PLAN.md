# План реализации функционала истории выдачи кирпичиков

## Цель
Добавить в GraphQL схему поддержку истории выдачи кирпичиков ученикам. Кирпичики выдаются учителем ученикам за каждый набранный балл (1 балл = 1 кирпичик). Необходимо отслеживать, сколько кирпичиков было выдано каждому ученику и когда.

## Зависимости
- Phase 14: Проверка домашних заданий (Homework Checks) - для расчета набранных баллов
- Phase 15: Система баллов и кирпичиков - для логики расчета кирпичиков

## Оценка времени
2-3 часа

## Задачи

### Task 1: Изменение GraphQL схемы

**Файл:** `amplify/backend/api/sunsch/schema.graphql`

**Действия:**
- [ ] Добавить тип `BricksIssue` после типа `PupilAchievement` (примерно после строки 421)
- [ ] Настроить правила авторизации:
  - Admin/Superadmin: полный доступ (create, read, update, delete)
  - Teacher: create, read (только для своих групп)
- [ ] Добавить индексы для эффективных запросов
- [ ] Добавить связь `bricksIssues` в тип `Pupil`

**Структура типа `BricksIssue`:**
```graphql
# Выдача кирпичиков ученику
type BricksIssue
  @model
  @auth(rules: [
    # Admin и Superadmin могут управлять выдачей
    { allow: groups, groups: ["ADMIN", "SUPERADMIN"] },
    # Teacher может создавать и читать выдачу (только для своих групп)
    { allow: groups, groups: ["TEACHER"], operations: [create, read] }
  ]) {
  id: ID!
  pupilId: ID! @index(name: "byPupilId", sortKeyFields: ["issuedAt"])
  academicYearId: ID! @index(name: "byAcademicYearId", sortKeyFields: ["issuedAt"])
  gradeId: ID! @index(name: "byGradeId", sortKeyFields: ["issuedAt"]) # Денормализация для удобства
  
  quantity: Int! # Количество выданных кирпичиков
  issuedAt: AWSDateTime! # Дата выдачи (автоматически при создании)
  issuedBy: ID! # ID учителя, который выдал (teacherId из Cognito)
  
  # Связи
  pupil: Pupil @belongsTo(fields: ["pupilId"])
  # Примечание: academicYear @belongsTo убрано для устранения циклической зависимости
  # Используйте queries через индекс byAcademicYearId для получения связанного года
  
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}
```

**Изменение типа `Pupil`:**
```graphql
type Pupil {
  # ... существующие поля ...
  
  # История выдачи кирпичиков
  bricksIssues: [BricksIssue] @hasMany(indexName: "byPupilId", fields: ["id"])
}
```

**Критерии приемки:**
- Тип `BricksIssue` добавлен в схему
- Индексы созданы для эффективных запросов
- Связь `bricksIssues` добавлена в тип `Pupil`
- Правила авторизации настроены корректно

---

### Task 2: Создание GraphQL queries

**Файл:** `src/graphql/queries.ts` (или соответствующий файл с queries)

**Действия:**
- [ ] Создать query `bricksIssuesByPupilIdAndIssuedAt` для получения истории выдачи для ученика
- [ ] Создать query `bricksIssuesByAcademicYearIdAndIssuedAt` для получения истории по учебному году
- [ ] Создать query `bricksIssuesByGradeIdAndIssuedAt` для получения истории по группе (опционально)

**Пример query для получения истории по ученику:**
```graphql
query BricksIssuesByPupilIdAndIssuedAt(
  $pupilId: ID!
  $issuedAt: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelBricksIssueFilterInput
  $limit: Int
  $nextToken: String
) {
  bricksIssuesByPupilIdAndIssuedAt(
    pupilId: $pupilId
    issuedAt: $issuedAt
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      pupilId
      academicYearId
      gradeId
      quantity
      issuedAt
      issuedBy
      createdAt
      updatedAt
    }
    nextToken
  }
}
```

**Критерии приемки:**
- Queries созданы и корректно используют индексы
- Queries поддерживают фильтрацию и пагинацию
- Queries возвращают данные в правильном формате

---

### Task 3: Создание GraphQL mutations

**Файл:** `src/graphql/mutations.ts` (или соответствующий файл с mutations)

**Действия:**
- [ ] Создать mutation `createBricksIssue` для создания записи о выдаче
- [ ] Опционально: создать mutation `updateBricksIssue` для редактирования записи (если требуется)
- [ ] Опционально: создать mutation `deleteBricksIssue` для удаления записи (если требуется)

**Пример mutation для создания записи:**
```graphql
mutation CreateBricksIssue(
  $input: CreateBricksIssueInput!
  $condition: ModelBricksIssueConditionInput
) {
  createBricksIssue(input: $input, condition: $condition) {
    id
    pupilId
    academicYearId
    gradeId
    quantity
    issuedAt
    issuedBy
    createdAt
    updatedAt
  }
}
```

**Критерии приемки:**
- Mutation `createBricksIssue` создана и работает корректно
- Mutation поддерживает все необходимые поля
- Валидация входных данных работает

---

### Task 4: Обновление типов TypeScript

**Действия:**
- [ ] Запустить `amplify codegen` для генерации TypeScript типов из GraphQL схемы
- [ ] Проверить сгенерированные типы в `src/graphql/API.ts` (или соответствующем файле)
- [ ] Убедиться, что типы `BricksIssue`, `CreateBricksIssueInput`, `UpdateBricksIssueInput` и т.д. созданы корректно

**Команда:**
```bash
amplify codegen
```

**Критерии приемки:**
- Типы TypeScript сгенерированы корректно
- Все поля типа `BricksIssue` имеют правильные типы
- Input типы для mutations созданы

---

### Task 5: Валидация схемы

**Действия:**
- [ ] Запустить `amplify push` в dev окружении для проверки схемы
- [ ] Проверить созданные ресурсы в AWS:
  - DynamoDB таблица `BricksIssue` создана
  - GSI индексы созданы (`byPupilId`, `byAcademicYearId`, `byGradeId`)
  - AppSync API обновлен с новыми типами и queries/mutations
- [ ] Проверить правила авторизации в AWS Console

**Команда:**
```bash
amplify push
```

**Критерии приемки:**
- Схема валидирована без ошибок
- Все ресурсы созданы в AWS
- Индексы работают корректно
- Правила авторизации применяются правильно

---

## Важные замечания

### Логика работы
- **Набранные кирпичики** = сумма всех баллов из `HomeworkCheck.points` за учебный год для ученика
- **Выданные кирпичики** = сумма всех `BricksIssue.quantity` для ученика за учебный год
- **Остаток** = набранные - выданные

### Авторизация
- Teacher может создавать записи о выдаче только для учеников своей группы
- Teacher может читать записи о выдаче только для учеников своей группы
- Admin/Superadmin имеют полный доступ ко всем записям

### Индексы
- `byPupilId` с sortKey `issuedAt` - для получения истории выдачи ученика, отсортированной по дате
- `byAcademicYearId` с sortKey `issuedAt` - для получения истории по учебному году
- `byGradeId` с sortKey `issuedAt` - для получения истории по группе (опционально, для аналитики)

### Связи
- `BricksIssue` связан с `Pupil` через `pupilId`
- Связь с `AcademicYear` не создается напрямую (для избежания циклических зависимостей), используется через индекс `byAcademicYearId`

---

## Следующие шаги после выполнения плана

После успешного выполнения всех задач:
1. Обновить Server Actions в `actions/bricks.ts` для использования новых queries и mutations
2. Создать компоненты React для отображения истории выдачи (accordion)
3. Интегрировать функционал в страницу `/grades/:gradeId/issue-bricks`

См. также:
- [phase_15_points_houses.md](./phase_15_points_houses.md) - задачи реализации компонентов и Server Actions
- [app_functionality.md](../../../app_functionality.md) - раздел 4.14 Выдача кирпичиков
- [WIREFRAMES.md](../../../ui_ux/WIREFRAMES.md) - wireframes страницы выдачи кирпичиков

---

**Версия:** 1.0  
**Дата создания:** 25 декабря 2025  
**Статус:** В разработке

