# GraphQL Schema Optimization Roadmap

## AI Agent Instructions - Оптимизация GraphQL схемы

**Версия:** 2.0  
**Дата создания:** 31 декабря 2025  
**Формат:** Пошаговые инструкции для AI Agent  
**Статус:** Готов к выполнению

---

## Обзор

Данный документ содержит пошаговые инструкции для AI Agent по оптимизации GraphQL схемы проекта Sunday School App. Цель - получение всех данных каждой страницы приложения **одним запросом** к AWS AppSync вместо текущих 10-110 запросов.

### Ключевые изменения:
- Добавление новой модели `LessonFile` для прикрепления файлов к урокам
- Восстановление `@hasMany` связей для вложенных запросов
- Добавление `@belongsTo` связей для связующих таблиц
- Обновление Server Actions для использования вложенных запросов
- Обновление React компонентов для работы с файлами

### Связанная документация:
- [GraphQL Schema](../../amplify/backend/api/sunsch/schema.graphql)
- [DynamoDB Schema](../database/DYNAMODB_SCHEMA.md)
- [Server Actions](../api/SERVER_ACTIONS.md)
- [Wireframes](../ui_ux/WIREFRAMES.md)
- [MVP Scope](../MVP_SCOPE.md)

---

## Содержание

1. [Раздел 1: Изменения в GraphQL схеме (поэтапный деплой backend)](#раздел-1-изменения-в-graphql-схеме)
2. [Раздел 2: Изменения в src/graphql/generated/](#раздел-2-изменения-в-srcgraphqlgenerated)
3. [Раздел 3: Изменения в реализованном функционале](#раздел-3-изменения-в-реализованном-функционале)
4. [Раздел 4: Изменения в документации phase_11-25](#раздел-4-изменения-в-документации-phase_11-25)

---

# Раздел 1: Изменения в GraphQL схеме

## Этап 1.1: Добавление модели LessonFile

### Task 1.1.1: Создание модели LessonFile

**Статус:** [ ] Не начато | [ ] В процессе | [ ] Выполнено | [ ] Проверено

**Описание:**
Создать новую модель LessonFile для хранения метаданных файлов, прикрепленных к урокам. Файлы хранятся в AWS S3 Storage, метаданные - в DynamoDB.

**Файлы для изменения:**
- [amplify/backend/api/sunsch/schema.graphql](../../amplify/backend/api/sunsch/schema.graphql) - добавить модель LessonFile после модели Lesson (строка ~182)

**Документация:**
- [DynamoDB Schema](../database/DYNAMODB_SCHEMA.md) - структура таблиц
- [AWS Amplify Storage](../infrastructure/AWS_AMPLIFY.md) - конфигурация S3

**Код для добавления:**

```graphql
# ============================================
# LESSON FILE (ФАЙЛЫ УРОКОВ)
# ============================================

# Файлы, прикрепленные к урокам (изображения, PDF, документы)
# Хранение файлов в AWS S3 Storage
type LessonFile
  @model(queries: null)
  @auth(rules: [
    # Разделенные правила для предотвращения циклических зависимостей CloudFormation
    { allow: groups, groups: ["ADMIN"], operations: [create, read, update, delete] },
    { allow: groups, groups: ["SUPERADMIN"], operations: [create, read, update, delete] },
    { allow: groups, groups: ["TEACHER"], operations: [create, read, update, delete] }
  ]) {
  id: ID!
  lessonId: ID! @index(name: "byLessonId", sortKeyFields: ["order"])
  
  # Метаданные файла
  fileName: String! # Оригинальное имя файла (например, "План_урока.pdf")
  fileType: String! # Тип файла: "image", "pdf", "document"
  mimeType: String! # MIME тип (например, "image/jpeg", "application/pdf")
  fileSize: Int! # Размер файла в байтах
  
  # Хранение в S3
  s3Key: String! # Ключ файла в S3 (путь в bucket)
  s3Url: String! # Полный URL файла в S3 для доступа
  
  # Отображение
  order: Int! # Порядок отображения файлов (для сортировки)
  description: String # Описание файла (опционально)
  
  # Связи
  lesson: Lesson @belongsTo(fields: ["lessonId"])
  
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}
```

**Действия:**
- [ ] Открыть файл `amplify/backend/api/sunsch/schema.graphql`
- [ ] Найти модель `Lesson` (строка ~149)
- [ ] Добавить модель `LessonFile` после закрывающей скобки модели `Lesson`
- [ ] Сохранить файл

**Проверка:**
- [ ] Синтаксис GraphQL корректен
- [ ] Модель содержит все поля: id, lessonId, fileName, fileType, mimeType, fileSize, s3Key, s3Url, order, description
- [ ] @auth правила разделены для предотвращения циклических зависимостей
- [ ] @index byLessonId создан с sortKeyFields: ["order"]

---

### Task 1.1.2: Добавление связи files в модель Lesson

**Статус:** [ ] Не начато | [ ] В процессе | [ ] Выполнено | [ ] Проверено

**Описание:**
Добавить @hasMany связь files в модель Lesson для получения прикрепленных файлов.

**Файлы для изменения:**
- [amplify/backend/api/sunsch/schema.graphql](../../amplify/backend/api/sunsch/schema.graphql) - модель Lesson (строка ~149-181)

**Код для добавления в модель Lesson:**

Найти строку с комментарием `# Связи` в модели Lesson и добавить:

```graphql
  # Связи
  # Примечание: academicYear @belongsTo и teacher @belongsTo убраны для устранения циклической зависимости
  
  # Новая связь для файлов
  files: [LessonFile] @hasMany(indexName: "byLessonId", fields: ["id"])
```

**Действия:**
- [ ] Открыть файл `amplify/backend/api/sunsch/schema.graphql`
- [ ] Найти модель `Lesson`
- [ ] Найти раздел комментариев `# Связи` или `# Примечание:`
- [ ] Добавить строку: `files: [LessonFile] @hasMany(indexName: "byLessonId", fields: ["id"])`
- [ ] Сохранить файл

**Проверка:**
- [ ] Связь files добавлена в модель Lesson
- [ ] indexName соответствует индексу в модели LessonFile: "byLessonId"
- [ ] fields указывает на ["id"]

---

### Task 1.1.3: Проверка синтаксиса и первый деплой

**Статус:** [ ] Не начато | [ ] В процессе | [ ] Выполнено | [ ] Проверено

**Описание:**
Проверить синтаксис GraphQL схемы и выполнить первый деплой для создания модели LessonFile.

**Команды для выполнения:**

```bash
# Проверить синтаксис схемы
amplify api gql-compile

# Если успешно - деплой
amplify push --yes
```

**Действия:**
- [ ] Выполнить `amplify api gql-compile` для проверки синтаксиса
- [ ] Если есть ошибки - исправить их в schema.graphql
- [ ] Выполнить `amplify push --yes` для деплоя
- [ ] Дождаться успешного завершения деплоя

**Проверка после деплоя:**

**Проверка через AWS CLI:**
```bash
# Получить имя таблицы LessonFile (замените {apiId} и {env} на актуальные значения)
# Имя таблицы обычно в формате: LessonFile-{apiId}-{env}
TABLE_NAME="LessonFile-$(aws amplify get-app --app-id $(aws amplify list-apps --query 'apps[0].appId' --output text) --query 'app.appId' --output text)-$(aws amplify get-backend-environment --app-id $(aws amplify list-apps --query 'apps[0].appId' --output text) --environment-name $(aws amplify list-backend-environments --app-id $(aws amplify list-apps --query 'apps[0].appId' --output text) --query 'backendEnvironments[0].environmentName' --output text) --query 'backendEnvironment.environmentName' --output text)"

# Проверить существование таблицы
aws dynamodb describe-table --table-name "$TABLE_NAME"

# Проверить GSI byLessonId
aws dynamodb describe-table --table-name "$TABLE_NAME" --query 'Table.GlobalSecondaryIndexes[?IndexName==`byLessonId`]'

# Проверить структуру ключей таблицы
aws dynamodb describe-table --table-name "$TABLE_NAME" --query 'Table.{KeySchema:KeySchema,AttributeDefinitions:AttributeDefinitions}'
```

**Проверка:**
- [ ] Таблица LessonFile создана (проверено через AWS CLI)
- [ ] GSI byLessonId существует с sortKeyFields: ["order"] (проверено через AWS CLI)
- [ ] Структура ключей корректна: PK=id, GSI PK=lessonId, GSI SK=order (проверено через AWS CLI)
- [ ] В AWS Console → AppSync → Schema появился тип LessonFile
- [ ] Нет ошибок CloudFormation (циклические зависимости)

---

## Этап 1.2: Восстановление @hasMany связей

### Task 1.2.1: Добавление events в модель Grade

**Статус:** [ ] Не начато | [ ] В процессе | [ ] Выполнено | [ ] Проверено

**Описание:**
Восстановить @hasMany связь events в модели Grade для получения событий расписания.

**Файлы для изменения:**
- [amplify/backend/api/sunsch/schema.graphql](../../amplify/backend/api/sunsch/schema.graphql) - модель Grade (строка ~70-96)

**Текущее состояние модели Grade (найти строки ~88-92):**
```graphql
  # Примечание: events убрано из @hasMany для устранения циклической зависимости
  # Используйте queries через индекс byGradeId для получения событий группы
  settings: GradeSettings @hasOne(fields: ["id"])
```

**Изменить на:**
```graphql
  # Связь events восстановлена
  events: [GradeEvent] @hasMany(indexName: "byGradeId", fields: ["id"])
  settings: GradeSettings @hasOne(fields: ["id"])
```

**Действия:**
- [ ] Открыть файл `amplify/backend/api/sunsch/schema.graphql`
- [ ] Найти модель `Grade` (строка ~70)
- [ ] Найти комментарий про events (строка ~88-90)
- [ ] Удалить комментарий и добавить связь events
- [ ] Сохранить файл

**Проверка:**
- [ ] Связь events: [GradeEvent] добавлена
- [ ] indexName: "byGradeId" соответствует индексу в GradeEvent
- [ ] Старый комментарий удален

---

### Task 1.2.2: Деплой изменений Grade.events

**Статус:** [ ] Не начато | [ ] В процессе | [ ] Выполнено | [ ] Проверено

**Описание:**
Выполнить деплой после добавления events в Grade.

**Команды для выполнения:**

```bash
# Проверить синтаксис
amplify api gql-compile

# Деплой
amplify push --yes
```

**Действия:**
- [ ] Выполнить `amplify api gql-compile`
- [ ] Выполнить `amplify push --yes`
- [ ] Проверить отсутствие ошибок CloudFormation

**Проверка через AWS CLI:**
```bash
# Получить имя таблицы Grade
TABLE_NAME="Grade-{apiId}-{env}"  # Замените на актуальное имя

# Проверить что структура таблицы не изменилась (только связи в GraphQL схеме)
aws dynamodb describe-table --table-name "$TABLE_NAME" --query 'Table.{KeySchema:KeySchema,AttributeDefinitions:AttributeDefinitions,GlobalSecondaryIndexes:GlobalSecondaryIndexes}'

# Проверить что GSI byGradeId существует (для связи events)
aws dynamodb describe-table --table-name "$TABLE_NAME" --query 'Table.GlobalSecondaryIndexes[?IndexName==`byGradeId`]'
```

**Проверка:**
- [ ] Деплой завершен успешно
- [ ] Структура таблицы Grade не изменилась (проверено через AWS CLI)
- [ ] GSI byGradeId существует (проверено через AWS CLI)
- [ ] Нет ошибок циклических зависимостей
- [ ] В AppSync Console: тип Grade содержит поле events

---

### Task 1.2.3: Добавление homeworkChecks и goldenVerses в модель Lesson

**Статус:** [ ] Не начато | [ ] В процессе | [ ] Выполнено | [ ] Проверено

**Описание:**
Восстановить @hasMany связи homeworkChecks и goldenVerses в модели Lesson.

**Файлы для изменения:**
- [amplify/backend/api/sunsch/schema.graphql](../../amplify/backend/api/sunsch/schema.graphql) - модель Lesson (строка ~149-181)

**Текущее состояние (найти строки ~173-177):**
```graphql
  # Примечание: academicYear @belongsTo и teacher @belongsTo убраны для устранения циклической зависимости
  # Используйте queries через индексы byAcademicYearId и byTeacherId для получения связанных данных
  # Примечание: gradeId используется только для денормализации и индекса, связь с Grade через AcademicYear
  # Примечание: goldenVerses и homeworkChecks убраны из @hasMany для устранения циклической зависимости
  # Используйте queries через индексы byLessonId для получения связанных данных
```

**Изменить на:**
```graphql
  # Связи
  # Примечание: academicYear @belongsTo и teacher @belongsTo убраны для устранения циклической зависимости
  
  # Восстановленные @hasMany связи
  homeworkChecks: [HomeworkCheck] @hasMany(indexName: "byLessonId", fields: ["id"])
  goldenVerses: [LessonGoldenVerse] @hasMany(indexName: "byLessonId", fields: ["id"])
  files: [LessonFile] @hasMany(indexName: "byLessonId", fields: ["id"])
```

**Действия:**
- [ ] Открыть файл `amplify/backend/api/sunsch/schema.graphql`
- [ ] Найти модель `Lesson` (строка ~149)
- [ ] Найти раздел комментариев про связи (строки ~173-177)
- [ ] Заменить комментарии на @hasMany связи
- [ ] Убедиться, что files уже добавлено из Task 1.1.2
- [ ] Сохранить файл

**Проверка:**
- [ ] homeworkChecks: [HomeworkCheck] @hasMany добавлено
- [ ] goldenVerses: [LessonGoldenVerse] @hasMany добавлено
- [ ] files: [LessonFile] @hasMany добавлено
- [ ] Все indexName: "byLessonId"

---

### Task 1.2.4: Деплой изменений Lesson

**Статус:** [ ] Не начато | [ ] В процессе | [ ] Выполнено | [ ] Проверено

**Описание:**
Выполнить деплой после добавления связей в Lesson.

**Команды:**
```bash
amplify api gql-compile
amplify push --yes
```

**Действия:**
- [ ] Выполнить проверку синтаксиса
- [ ] Выполнить деплой
- [ ] Проверить отсутствие ошибок

**Проверка через AWS CLI:**
```bash
# Получить имя таблицы Lesson
TABLE_NAME="Lesson-{apiId}-{env}"  # Замените на актуальное имя

# Проверить что структура таблицы не изменилась
aws dynamodb describe-table --table-name "$TABLE_NAME" --query 'Table.{KeySchema:KeySchema,AttributeDefinitions:AttributeDefinitions,GlobalSecondaryIndexes:GlobalSecondaryIndexes}'

# Проверить что GSI byLessonId существует (для связей homeworkChecks, goldenVerses, files)
aws dynamodb describe-table --table-name "$TABLE_NAME" --query 'Table.GlobalSecondaryIndexes[?IndexName==`byLessonId`]'
```

**Проверка:**
- [ ] Деплой успешен
- [ ] Структура таблицы Lesson не изменилась (проверено через AWS CLI)
- [ ] GSI byLessonId существует (проверено через AWS CLI)
- [ ] В AppSync: тип Lesson содержит поля homeworkChecks, goldenVerses, files

---

### Task 1.2.5: Добавление homeworkChecks и achievements в модель Pupil

**Статус:** [ ] Не начато | [ ] В процессе | [ ] Выполнено | [ ] Проверено

**Описание:**
Восстановить @hasMany связи в модели Pupil для получения проверок ДЗ и достижений.

**Файлы для изменения:**
- [amplify/backend/api/sunsch/schema.graphql](../../amplify/backend/api/sunsch/schema.graphql) - модель Pupil (строка ~267-294)

**Текущее состояние (найти строки ~286-290):**
```graphql
  # Примечание: grade @belongsTo убрано для устранения циклической зависимости
  # Примечание: homeworkChecks и achievements убраны из @hasMany для устранения циклической зависимости
  families: [FamilyMember] @hasMany(indexName: "byPupilId", fields: ["id"])
```

**Изменить на:**
```graphql
  # Связи
  families: [FamilyMember] @hasMany(indexName: "byPupilId", fields: ["id"])
  
  # Восстановленные @hasMany связи
  homeworkChecks: [HomeworkCheck] @hasMany(indexName: "byPupilId", fields: ["id"])
  achievements: [PupilAchievement] @hasMany(indexName: "byPupilId", fields: ["id"])
```

**Действия:**
- [ ] Открыть файл `amplify/backend/api/sunsch/schema.graphql`
- [ ] Найти модель `Pupil` (строка ~267)
- [ ] Найти раздел связей (строки ~286-290)
- [ ] Добавить homeworkChecks и achievements после families
- [ ] Удалить устаревшие комментарии
- [ ] Сохранить файл

**Проверка:**
- [ ] homeworkChecks: [HomeworkCheck] @hasMany добавлено
- [ ] achievements: [PupilAchievement] @hasMany добавлено
- [ ] indexName для homeworkChecks: "byPupilId"
- [ ] indexName для achievements: "byPupilId"

---

### Task 1.2.6: Деплой изменений Pupil

**Статус:** [ ] Не начато | [ ] В процессе | [ ] Выполнено | [ ] Проверено

**Описание:**
Выполнить деплой после добавления связей в Pupil.

**Команды:**
```bash
amplify api gql-compile
amplify push --yes
```

**Действия:**
- [ ] Выполнить проверку синтаксиса
- [ ] Выполнить деплой
- [ ] Проверить отсутствие ошибок

**Проверка через AWS CLI:**
```bash
# Получить имя таблицы Pupil
TABLE_NAME="Pupil-{apiId}-{env}"  # Замените на актуальное имя

# Проверить что структура таблицы не изменилась
aws dynamodb describe-table --table-name "$TABLE_NAME" --query 'Table.{KeySchema:KeySchema,AttributeDefinitions:AttributeDefinitions,GlobalSecondaryIndexes:GlobalSecondaryIndexes}'

# Проверить что GSI byPupilId существует (для связей homeworkChecks, achievements)
aws dynamodb describe-table --table-name "$TABLE_NAME" --query 'Table.GlobalSecondaryIndexes[?IndexName==`byPupilId`]'
```

**Проверка:**
- [ ] Деплой успешен
- [ ] Структура таблицы Pupil не изменилась (проверено через AWS CLI)
- [ ] GSI byPupilId существует (проверено через AWS CLI)
- [ ] В AppSync: тип Pupil содержит поля homeworkChecks, achievements

---

## Этап 1.3: Добавление @belongsTo связей

### Task 1.3.1: Добавление @belongsTo в LessonGoldenVerse

**Статус:** [ ] Не начато | [ ] В процессе | [ ] Выполнено | [ ] Проверено

**Описание:**
Добавить @belongsTo связи lesson и goldenVerse в модель LessonGoldenVerse для получения связанных данных в одном запросе.

**Файлы для изменения:**
- [amplify/backend/api/sunsch/schema.graphql](../../amplify/backend/api/sunsch/schema.graphql) - модель LessonGoldenVerse (строка ~241-260)

**Текущее состояние (найти строки ~254-258):**
```graphql
  # Связи
  # Примечание: @belongsTo убраны для устранения циклической зависимости
  # Используйте queries через индексы byLessonId и byGoldenVerseId для получения связанных данных
  
  createdAt: AWSDateTime!
```

**Изменить на:**
```graphql
  # Связи
  lesson: Lesson @belongsTo(fields: ["lessonId"])
  goldenVerse: GoldenVerse @belongsTo(fields: ["goldenVerseId"])
  
  createdAt: AWSDateTime!
```

**Действия:**
- [ ] Открыть файл `amplify/backend/api/sunsch/schema.graphql`
- [ ] Найти модель `LessonGoldenVerse` (строка ~241)
- [ ] Найти раздел связей (строки ~254-258)
- [ ] Заменить комментарии на @belongsTo связи
- [ ] Сохранить файл

**Проверка:**
- [ ] lesson: Lesson @belongsTo(fields: ["lessonId"]) добавлено
- [ ] goldenVerse: GoldenVerse @belongsTo(fields: ["goldenVerseId"]) добавлено
- [ ] Старые комментарии удалены

---

### Task 1.3.2: Добавление @belongsTo в HomeworkCheck

**Статус:** [ ] Не начато | [ ] В процессе | [ ] Выполнено | [ ] Проверено

**Описание:**
Добавить @belongsTo связи lesson и pupil в модель HomeworkCheck.

**Файлы для изменения:**
- [amplify/backend/api/sunsch/schema.graphql](../../amplify/backend/api/sunsch/schema.graphql) - модель HomeworkCheck (строка ~299-337)

**Текущее состояние (найти строки ~331-334):**
```graphql
  # Связи
  # Примечание: @belongsTo убраны для устранения циклической зависимости
  # Используйте queries через индексы byLessonId и byPupilId для получения связанных данных
```

**Изменить на:**
```graphql
  # Связи
  lesson: Lesson @belongsTo(fields: ["lessonId"])
  pupil: Pupil @belongsTo(fields: ["pupilId"])
```

**Действия:**
- [ ] Открыть файл `amplify/backend/api/sunsch/schema.graphql`
- [ ] Найти модель `HomeworkCheck` (строка ~299)
- [ ] Найти раздел связей (строки ~331-334)
- [ ] Заменить комментарии на @belongsTo связи
- [ ] Сохранить файл

**Проверка:**
- [ ] lesson: Lesson @belongsTo добавлено
- [ ] pupil: Pupil @belongsTo добавлено

---

### Task 1.3.3: Добавление @belongsTo в PupilAchievement

**Статус:** [ ] Не начато | [ ] В процессе | [ ] Выполнено | [ ] Проверено

**Описание:**
Добавить @belongsTo связи pupil и achievement в модель PupilAchievement.

**Файлы для изменения:**
- [amplify/backend/api/sunsch/schema.graphql](../../amplify/backend/api/sunsch/schema.graphql) - модель PupilAchievement (строка ~366-385)

**Текущее состояние (найти строки ~379-382):**
```graphql
  # Связи
  # Примечание: @belongsTo убраны для устранения циклической зависимости
```

**Изменить на:**
```graphql
  # Связи
  pupil: Pupil @belongsTo(fields: ["pupilId"])
  achievement: Achievement @belongsTo(fields: ["achievementId"])
```

**Действия:**
- [ ] Найти модель `PupilAchievement`
- [ ] Заменить комментарии на @belongsTo связи
- [ ] Сохранить файл

**Проверка:**
- [ ] pupil: Pupil @belongsTo добавлено
- [ ] achievement: Achievement @belongsTo добавлено

---

### Task 1.3.4: Добавление @belongsTo в FamilyMember

**Статус:** [ ] Не начато | [ ] В процессе | [ ] Выполнено | [ ] Проверено

**Описание:**
Добавить @belongsTo связи family и pupil в модель FamilyMember.

**Файлы для изменения:**
- [amplify/backend/api/sunsch/schema.graphql](../../amplify/backend/api/sunsch/schema.graphql) - модель FamilyMember (строка ~426-444)

**Изменить раздел связей на:**
```graphql
  # Связи
  family: Family @belongsTo(fields: ["familyId"])
  pupil: Pupil @belongsTo(fields: ["pupilId"])
```

**Действия:**
- [ ] Найти модель `FamilyMember`
- [ ] Заменить комментарии на @belongsTo связи
- [ ] Сохранить файл

**Проверка:**
- [ ] family: Family @belongsTo добавлено
- [ ] pupil: Pupil @belongsTo добавлено

---

### Task 1.3.5: Добавление @belongsTo в UserGrade

**Статус:** [ ] Не начато | [ ] В процессе | [ ] Выполнено | [ ] Проверено

**Описание:**
Добавить @belongsTo связи user и grade в модель UserGrade.

**Файлы для изменения:**
- [amplify/backend/api/sunsch/schema.graphql](../../amplify/backend/api/sunsch/schema.graphql) - модель UserGrade (строка ~98-117)

**Изменить раздел связей на:**
```graphql
  # Связи
  user: User @belongsTo(fields: ["userId"])
  grade: Grade @belongsTo(fields: ["gradeId"])
```

**Действия:**
- [ ] Найти модель `UserGrade`
- [ ] Заменить комментарии на @belongsTo связи
- [ ] Сохранить файл

**Проверка:**
- [ ] user: User @belongsTo добавлено
- [ ] grade: Grade @belongsTo добавлено

---

### Task 1.3.6: Добавление @belongsTo в UserFamily

**Статус:** [ ] Не начато | [ ] В процессе | [ ] Выполнено | [ ] Проверено

**Описание:**
Добавить @belongsTo связи user и family в модель UserFamily.

**Файлы для изменения:**
- [amplify/backend/api/sunsch/schema.graphql](../../amplify/backend/api/sunsch/schema.graphql) - модель UserFamily (строка ~446-465)

**Изменить раздел связей на:**
```graphql
  # Связи
  user: User @belongsTo(fields: ["userId"])
  family: Family @belongsTo(fields: ["familyId"])
```

**Действия:**
- [ ] Найти модель `UserFamily`
- [ ] Заменить комментарии на @belongsTo связи
- [ ] Сохранить файл

**Проверка:**
- [ ] user: User @belongsTo добавлено
- [ ] family: Family @belongsTo добавлено

---

### Task 1.3.7: Финальный деплой @belongsTo связей

**Статус:** [ ] Не начато | [ ] В процессе | [ ] Выполнено | [ ] Проверено

**Описание:**
Выполнить финальный деплой после добавления всех @belongsTo связей.

**Команды:**
```bash
# Проверить синтаксис
amplify api gql-compile

# Деплой
amplify push --yes
```

**Действия:**
- [ ] Выполнить `amplify api gql-compile`
- [ ] Исправить ошибки если есть
- [ ] Выполнить `amplify push --yes`
- [ ] Дождаться успешного завершения

**Проверка через AWS CLI:**

Проверить структуру всех затронутых таблиц:

```bash
# Список всех таблиц проекта
aws dynamodb list-tables --query 'TableNames[?contains(@, `{apiId}`)]'  # Замените {apiId} на актуальное значение

# Проверить структуру связующих таблиц
TABLES=(
  "LessonGoldenVerse-{apiId}-{env}"
  "HomeworkCheck-{apiId}-{env}"
  "PupilAchievement-{apiId}-{env}"
  "FamilyMember-{apiId}-{env}"
  "UserGrade-{apiId}-{env}"
  "UserFamily-{apiId}-{env}"
)

for TABLE_NAME in "${TABLES[@]}"; do
  echo "Checking table: $TABLE_NAME"
  aws dynamodb describe-table --table-name "$TABLE_NAME" --query 'Table.{TableName:TableName,KeySchema:KeySchema,GlobalSecondaryIndexes:GlobalSecondaryIndexes}' || echo "Table $TABLE_NAME not found or error"
done

# Проверить что все GSI существуют для @belongsTo связей
# LessonGoldenVerse: byLessonId, byGoldenVerseId
aws dynamodb describe-table --table-name "LessonGoldenVerse-{apiId}-{env}" --query 'Table.GlobalSecondaryIndexes[*].IndexName'

# HomeworkCheck: byLessonId, byPupilId
aws dynamodb describe-table --table-name "HomeworkCheck-{apiId}-{env}" --query 'Table.GlobalSecondaryIndexes[*].IndexName'

# PupilAchievement: byPupilId, byAchievementId
aws dynamodb describe-table --table-name "PupilAchievement-{apiId}-{env}" --query 'Table.GlobalSecondaryIndexes[*].IndexName'

# FamilyMember: byFamilyId, byPupilId
aws dynamodb describe-table --table-name "FamilyMember-{apiId}-{env}" --query 'Table.GlobalSecondaryIndexes[*].IndexName'

# UserGrade: byUserId, byGradeId
aws dynamodb describe-table --table-name "UserGrade-{apiId}-{env}" --query 'Table.GlobalSecondaryIndexes[*].IndexName'

# UserFamily: byUserId, byFamilyId
aws dynamodb describe-table --table-name "UserFamily-{apiId}-{env}" --query 'Table.GlobalSecondaryIndexes[*].IndexName'
```

**Проверка:**
- [ ] Деплой завершен без ошибок
- [ ] Все таблицы существуют (проверено через AWS CLI)
- [ ] Все необходимые GSI существуют для @belongsTo связей (проверено через AWS CLI)
- [ ] Структура ключей всех таблиц корректна (проверено через AWS CLI)
- [ ] Нет ошибок циклических зависимостей CloudFormation
- [ ] В AppSync Console: все типы содержат добавленные связи

---

# Раздел 2: Изменения в src/graphql/generated/

## Task 2.1: Генерация новых типов через amplify codegen

**Статус:** [ ] Не начато | [ ] В процессе | [ ] Выполнено | [ ] Проверено

**Описание:**
После деплоя изменений в GraphQL схему необходимо сгенерировать новые TypeScript типы и GraphQL операции.

**Файлы которые будут обновлены автоматически:**
- [src/graphql/generated/types.ts](../../src/graphql/generated/types.ts) - TypeScript типы
- [src/graphql/queries.ts](../../src/graphql/queries.ts) - GraphQL queries
- [src/graphql/mutations.ts](../../src/graphql/mutations.ts) - GraphQL mutations
- [src/graphql/subscriptions.ts](../../src/graphql/subscriptions.ts) - GraphQL subscriptions
- [src/API.ts](../../src/API.ts) - API типы (если существует)

**Команды:**
```bash
# Генерация типов и операций
amplify codegen

# Проверка TypeScript типов
npx tsc --noEmit
```

**Действия:**
- [ ] Выполнить `amplify codegen`
- [ ] Проверить что файлы обновились
- [ ] Выполнить `npx tsc --noEmit` для проверки типов
- [ ] Исправить ошибки типизации если есть

**Проверка:**
- [ ] В types.ts появился тип LessonFile
- [ ] В types.ts появился тип ModelLessonFileConnection
- [ ] В types.ts типы Lesson, Pupil, Grade содержат новые связи
- [ ] TypeScript компиляция проходит без ошибок

---

## Task 2.2: Проверка сгенерированных queries

**Статус:** [ ] Не начато | [ ] В процессе | [ ] Выполнено | [ ] Проверено

**Описание:**
Проверить что сгенерированные queries содержат вложенные поля для новых связей.

**Файлы для проверки:**
- [src/graphql/queries.ts](../../src/graphql/queries.ts)

**Ожидаемые изменения в queries.ts:**

1. `getGrade` должен содержать:
```graphql
events {
  items {
    id
    eventType
    title
    eventDate
  }
}
```

2. `getLesson` должен содержать:
```graphql
homeworkChecks {
  items {
    id
    pupilId
    points
    pupil {
      id
      firstName
      lastName
    }
  }
}
goldenVerses {
  items {
    id
    order
    goldenVerse {
      id
      reference
      text
    }
  }
}
files {
  items {
    id
    fileName
    fileType
    s3Url
  }
}
```

**Действия:**
- [ ] Открыть `src/graphql/queries.ts`
- [ ] Найти query `getGrade`
- [ ] Проверить наличие вложенных полей events
- [ ] Найти query `getLesson`
- [ ] Проверить наличие вложенных полей homeworkChecks, goldenVerses, files
- [ ] Найти query `getPupil`
- [ ] Проверить наличие вложенных полей homeworkChecks, achievements

**Проверка:**
- [ ] getGrade содержит events с вложенными items
- [ ] getLesson содержит homeworkChecks, goldenVerses, files с вложенными items
- [ ] getPupil содержит homeworkChecks, achievements с вложенными items
- [ ] Все @belongsTo связи отражены (lesson.pupil, etc.)

---

## Task 2.3: Проверка сгенерированных mutations

**Статус:** [ ] Не начато | [ ] В процессе | [ ] Выполнено | [ ] Проверено

**Описание:**
Проверить наличие mutations для новой модели LessonFile.

**Файлы для проверки:**
- [src/graphql/mutations.ts](../../src/graphql/mutations.ts)

**Ожидаемые mutations:**
- createLessonFile
- updateLessonFile
- deleteLessonFile

**Действия:**
- [ ] Открыть `src/graphql/mutations.ts`
- [ ] Найти mutation `createLessonFile`
- [ ] Найти mutation `updateLessonFile`
- [ ] Найти mutation `deleteLessonFile`
- [ ] Проверить что все поля присутствуют

**Проверка:**
- [ ] createLessonFile существует с полями: id, lessonId, fileName, fileType, mimeType, fileSize, s3Key, s3Url, order, description
- [ ] updateLessonFile существует
- [ ] deleteLessonFile существует

---

# Раздел 3: Изменения в реализованном функционале

## Этап 3.1: Обновление Server Actions

### Task 3.1.1: Создание Server Action для файлов уроков

**Статус:** [ ] Не начато | [ ] В процессе | [ ] Выполнено | [ ] Проверено

**Описание:**
Создать новый файл Server Actions для работы с файлами уроков: загрузка, удаление, получение URL.

**Файлы для создания:**
- [src/actions/lesson-files.ts](../../src/actions/lesson-files.ts) - новый файл

**Документация:**
- [Server Actions](../api/SERVER_ACTIONS.md) - паттерны реализации
- [Validation](../api/VALIDATION.md) - схемы валидации

**Требования к реализации:**

1. **uploadLessonFileAction(formData: FormData)**
   - Проверка аутентификации через `getAuthenticatedUser()`
   - Проверка авторизации: роли TEACHER, ADMIN, SUPERADMIN
   - Валидация файла:
     - Тип: image (jpeg, png, gif, webp), pdf, document (doc, docx)
     - Максимальный размер: 10MB
     - Ограничение: максимум 10 файлов на урок
   - Загрузка файла в AWS S3 Storage (protected access level)
   - Создание записи LessonFile через GraphQL mutation
   - Revalidate cache для страницы урока
   - Возврат: `{ success: true, data: LessonFile } | { success: false, error: string }`

2. **deleteLessonFileAction(fileId: string)**
   - Проверка аутентификации и авторизации
   - Получение информации о файле через GraphQL query
   - Удаление файла из S3 Storage
   - Удаление записи LessonFile из DynamoDB
   - Revalidate cache
   - Возврат: `{ success: true } | { success: false, error: string }`

3. **getLessonFileUrlAction(s3Key: string)**
   - Получение временного URL для скачивания файла
   - Access level: protected
   - Время жизни URL: 1 час (3600 секунд)
   - Возврат: `{ success: true, url: string } | { success: false, error: string }`

**Используемые библиотеки:**
- `aws-amplify/storage` - для работы с S3 (uploadData, remove, getUrl)
- `aws-amplify/api` - для GraphQL запросов (generateClient)
- `zod` - для валидации (создать схему uploadFileSchema)
- `next/cache` - для revalidatePath
- `@/lib/auth/cognito` - для проверки аутентификации
- `uuid` - для генерации уникальных идентификаторов

**Zod схема для валидации:**
- lessonId: UUID
- fileName: string (1-255 символов)
- fileType: enum ['image', 'pdf', 'document']
- mimeType: string
- fileSize: number (1 - 10MB)
- order: integer (>= 0)
- description: string (max 500 символов, optional)

**Структура S3 ключа:**
- Формат: `protected/lessons/{lessonId}/{uuid}_{sanitizedFileName}`
- UUID для уникальности
- Санитизация имени файла (замена спецсимволов на _)

**Действия:**
- [ ] Создать файл `src/actions/lesson-files.ts`
- [ ] Реализовать uploadLessonFileAction согласно требованиям
- [ ] Реализовать deleteLessonFileAction согласно требованиям
- [ ] Реализовать getLessonFileUrlAction согласно требованиям
- [ ] Создать Zod схему валидации
- [ ] Добавить обработку ошибок
- [ ] Проверить импорты
- [ ] Запустить `npx tsc --noEmit` для проверки типов

**Проверка:**
- [ ] Файл создан
- [ ] Все три функции реализованы согласно требованиям
- [ ] Валидация работает корректно
- [ ] Обработка ошибок реализована
- [ ] TypeScript компиляция проходит без ошибок
- [ ] Соответствие паттернам из Server Actions документации

---

### Task 3.1.2: Обновление getGradeWithFullDataAction

**Статус:** [ ] Не начато | [ ] В процессе | [ ] Выполнено | [ ] Проверено

**Описание:**
Обновить Server Action для получения данных группы с использованием вложенного GraphQL запроса вместо множественных отдельных запросов.

**Файлы для изменения:**
- [src/actions/grades.ts](../../src/actions/grades.ts) - функция getGradeWithFullDataAction

**Документация:**
- [Server Actions](../api/SERVER_ACTIONS.md) - раздел Grades

**Текущая проблема:**
- Выполняется ~110 отдельных GraphQL запросов
- Высокая латентность и риск rate limiting

**Целевое решение:**
- 1 вложенный GraphQL запрос
- Снижение нагрузки на 99%

**Требования к реализации:**

1. **Заменить множественные запросы на один вложенный GraphQL запрос**
   - Использовать вложенные поля: pupils, academicYears.lessons, events, settings, teachers
   - В lessons включить: homeworkChecks, goldenVerses, files
   - В homeworkChecks использовать вложенные данные pupil (благодаря @belongsTo)
   - В goldenVerses использовать вложенные данные goldenVerse и book
   - В teachers использовать вложенные данные user

2. **Обновить трансформацию данных**
   - Сохранить совместимость с существующими типами возвращаемых данных
   - Обработать новое поле files для каждого урока
   - Обработать вложенные данные pupil в homeworkChecks
   - Обработать вложенные данные goldenVerse и book в goldenVerses

3. **Оптимизация**
   - Один запрос вместо ~110 отдельных запросов
   - Снижение нагрузки на AppSync на 99%
   - Улучшение производительности загрузки страницы

**Действия:**
- [ ] Открыть `src/actions/grades.ts`
- [ ] Найти функцию `getGradeWithFullDataAction`
- [ ] Заменить множественные запросы на один вложенный запрос
- [ ] Обновить трансформацию данных для соответствия существующим типам
- [ ] Добавить обработку нового поля files
- [ ] Проверить типизацию

**Проверка:**
- [ ] Функция использует один вложенный запрос
- [ ] Возвращаемые данные совместимы с существующими типами
- [ ] Поле files доступно для каждого урока
- [ ] TypeScript компиляция проходит

---

### Task 3.1.3: Создание getLessonWithRelationsAction

**Статус:** [ ] Не начато | [ ] В процессе | [ ] Выполнено | [ ] Проверено

**Описание:**
Создать новый Server Action для получения урока со всеми связанными данными одним запросом.

**Файлы для изменения:**
- [src/actions/lessons.ts](../../src/actions/lessons.ts) - добавить новую функцию

**Требования к реализации:**

1. **Создать функцию getLessonWithRelationsAction(lessonId: string)**
   - Проверка аутентификации и авторизации
   - Один вложенный GraphQL запрос с полями:
     - Основные поля урока: id, title, content, lessonDate, order, academicYearId, gradeId, teacherId
     - homeworkChecks с вложенными данными pupil (благодаря @belongsTo)
     - goldenVerses с вложенными данными goldenVerse и book
     - files (новое поле для прикрепленных файлов)

2. **Обработка вложенных данных**
   - homeworkChecks.items[].pupil - данные ученика из @belongsTo связи
   - goldenVerses.items[].goldenVerse.book - данные книги из @belongsTo связи
   - files.items[] - список прикрепленных файлов

3. **Возвращаемый тип**
   - Использовать тип LessonNestedData из `src/types/nested-queries.ts`
   - Возврат: `{ success: true, data: LessonNestedData } | { success: false, error: string }`

**Действия:**
- [ ] Открыть `src/actions/lessons.ts`
- [ ] Добавить функцию `getLessonWithRelationsAction`
- [ ] Реализовать проверку аутентификации
- [ ] Реализовать вложенный GraphQL запрос
- [ ] Добавить трансформацию данных
- [ ] Проверить типизацию

**Проверка:**
- [ ] Функция getLessonWithRelationsAction создана
- [ ] Возвращает урок с homeworkChecks, goldenVerses, files
- [ ] homeworkChecks содержит вложенные данные pupil
- [ ] goldenVerses содержит вложенные данные goldenVerse и book
- [ ] TypeScript компиляция проходит

---

## Этап 3.2: Обновление React компонентов

### Task 3.2.1: Создание компонента LessonFileUploader

**Статус:** [ ] Не начато | [ ] В процессе | [ ] Выполнено | [ ] Проверено

**Описание:**
Создать новый React компонент для загрузки файлов к уроку с drag-and-drop функциональностью.

**Файлы для создания:**
- [src/components/teacher/LessonFileUploader/LessonFileUploader.tsx](../../src/components/teacher/LessonFileUploader/LessonFileUploader.tsx)
- [src/components/teacher/LessonFileUploader/index.ts](../../src/components/teacher/LessonFileUploader/index.ts)

**Зависимости для установки:**
```bash
npm install react-dropzone
```

**Действия:**
- [ ] Установить react-dropzone
- [ ] Создать директорию `src/components/teacher/LessonFileUploader/`
- [ ] Создать файл `LessonFileUploader.tsx`
- [ ] Создать файл `index.ts` с экспортом
- [ ] Реализовать drag-and-drop загрузку
- [ ] Реализовать прогресс загрузки
- [ ] Реализовать валидацию типов и размера файлов

**Проверка:**
- [ ] Компонент создан и экспортирован
- [ ] Drag-and-drop работает
- [ ] Прогресс загрузки отображается
- [ ] Ошибки валидации отображаются
- [ ] TypeScript компиляция проходит

---

### Task 3.2.2: Создание компонента LessonFileList

**Статус:** [ ] Не начато | [ ] В процессе | [ ] Выполнено | [ ] Проверено

**Описание:**
Создать компонент для отображения списка прикрепленных файлов с возможностью удаления.

**Файлы для создания:**
- [src/components/teacher/LessonFileList/LessonFileList.tsx](../../src/components/teacher/LessonFileList/LessonFileList.tsx)
- [src/components/teacher/LessonFileList/LessonFileItem.tsx](../../src/components/teacher/LessonFileList/LessonFileItem.tsx)
- [src/components/teacher/LessonFileList/index.ts](../../src/components/teacher/LessonFileList/index.ts)

**Действия:**
- [ ] Создать директорию `src/components/teacher/LessonFileList/`
- [ ] Создать файл `LessonFileList.tsx`
- [ ] Создать файл `LessonFileItem.tsx`
- [ ] Создать файл `index.ts` с экспортами
- [ ] Реализовать отображение списка файлов
- [ ] Реализовать удаление файлов
- [ ] Реализовать открытие/скачивание файлов

**Проверка:**
- [ ] Компоненты созданы и экспортированы
- [ ] Список файлов отображается
- [ ] Удаление работает
- [ ] Скачивание/открытие работает
- [ ] TypeScript компиляция проходит

---

### Task 3.2.3: Обновление компонента LessonForm

**Статус:** [ ] Не начато | [ ] В процессе | [ ] Выполнено | [ ] Проверено

**Описание:**
Добавить секцию для работы с файлами в форму редактирования урока.

**Файлы для изменения:**
- [src/components/teacher/LessonForm/LessonForm.tsx](../../src/components/teacher/LessonForm/LessonForm.tsx) - если существует

**Действия:**
- [ ] Найти компонент формы урока (LessonForm или аналог)
- [ ] Добавить импорты LessonFileUploader и LessonFileList
- [ ] Добавить секцию "Прикрепленные файлы"
- [ ] Добавить состояние для списка файлов
- [ ] Добавить обработчики для загрузки/удаления файлов
- [ ] Проверить интеграцию с существующей формой

**Проверка:**
- [ ] Секция файлов добавлена в форму
- [ ] Список файлов отображается
- [ ] Загрузка файлов работает
- [ ] Удаление файлов работает
- [ ] Счетчик файлов отображается (X / 10)

---

## Этап 3.3: Обновление утилит и типов

### Task 3.3.1: Создание типов для вложенных запросов

**Статус:** [ ] Не начато | [ ] В процессе | [ ] Выполнено | [ ] Проверено

**Описание:**
Создать TypeScript типы для работы с данными из вложенных GraphQL запросов.

**Файлы для создания:**
- [src/types/nested-queries.ts](../../src/types/nested-queries.ts) - новый файл

**Требования к типам:**

1. **GradeNestedData**
   - Расширяет APITypes.Grade
   - Включает вложенные поля: pupils, academicYears, events, settings, teachers
   - В academicYears.lessons включает: homeworkChecks, goldenVerses, files
   - В homeworkChecks использует вложенные данные (без pupil, т.к. получается отдельно)
   - В goldenVerses включает вложенные данные goldenVerse и book
   - В teachers включает вложенные данные user

2. **LessonNestedData**
   - Расширяет APITypes.Lesson
   - Включает вложенные поля: homeworkChecks, goldenVerses, files
   - В homeworkChecks включает вложенные данные pupil (благодаря @belongsTo)
   - В goldenVerses включает вложенные данные goldenVerse и book
   - В files включает массив LessonFile

3. **PupilNestedData**
   - Расширяет APITypes.Pupil
   - Включает вложенные поля: homeworkChecks, achievements, families
   - В homeworkChecks включает вложенные данные lesson (благодаря @belongsTo)
   - В achievements включает вложенные данные achievement
   - В families включает вложенные данные family

**Структура типов:**
- Использовать опциональные поля для вложенных данных (items?)
- Использовать типы из APITypes (импортировать из '../API' или '../graphql/generated/types')
- Обеспечить корректную типизацию вложенных связей @belongsTo

**Действия:**
- [ ] Создать файл `src/types/nested-queries.ts`
- [ ] Добавить типы GradeNestedData, LessonNestedData, PupilNestedData
- [ ] Проверить типизацию

**Проверка:**
- [ ] Файл создан
- [ ] Типы корректно описывают вложенную структуру
- [ ] TypeScript компиляция проходит

---

### Task 3.3.2: Создание Zod схем для LessonFile

**Статус:** [ ] Не начато | [ ] В процессе | [ ] Выполнено | [ ] Проверено

**Описание:**
Создать Zod схемы валидации для операций с файлами уроков.

**Файлы для создания:**
- [src/lib/validation/lesson-files.ts](../../src/lib/validation/lesson-files.ts) - новый файл

**Действия:**
- [ ] Создать файл `src/lib/validation/lesson-files.ts`
- [ ] Добавить схему createLessonFileSchema
- [ ] Добавить схему updateLessonFileSchema
- [ ] Добавить схему deleteLessonFileSchema
- [ ] Экспортировать типы через z.infer

**Проверка:**
- [ ] Файл создан
- [ ] Схемы валидации корректны
- [ ] TypeScript типы выведены правильно

---

### Task 3.3.3: Обновление Data Access Layer

**Статус:** [ ] Не начато | [ ] В процессе | [ ] Выполнено | [ ] Проверено

**Описание:**
Добавить функции для работы с вложенными запросами в Data Access Layer.

**Файлы для изменения:**
- [src/lib/db/queries.ts](../../src/lib/db/queries.ts) - добавить новые функции

**Функции для добавления:**
- `getGradeWithNestedData(gradeId: string)`
- `getLessonWithNestedData(lessonId: string)`
- `getPupilWithNestedData(pupilId: string)`

**Действия:**
- [ ] Открыть `src/lib/db/queries.ts`
- [ ] Добавить функцию getGradeWithNestedData
- [ ] Добавить функцию getLessonWithNestedData
- [ ] Добавить функцию getPupilWithNestedData
- [ ] Проверить типизацию

**Проверка:**
- [ ] Функции добавлены
- [ ] Возвращаемые типы корректны
- [ ] TypeScript компиляция проходит

---

# Раздел 4: Изменения в документации phase_11-25

## Task 4.1: Обновление phase_11_grades.md

**Статус:** [ ] Не начато | [ ] В процессе | [ ] Выполнено | [ ] Проверено

**Описание:**
Обновить документацию фазы 11 (Управление группами) с учетом новых вложенных запросов.

**Файлы для изменения:**
- [docs/implementation/mvp/tasks/phase_11_grades.md](./mvp/tasks/phase_11_grades.md)

**Изменения для внесения:**

1. В раздел "Документация" добавить ссылку:
```markdown
- [GRAPHQL_SCHEMA_OPTIMIZATION_ROADMAP.md](../../GRAPHQL_SCHEMA_OPTIMIZATION_ROADMAP.md) - оптимизация запросов
```

2. В Task 11.01 добавить информацию о вложенных запросах:
```markdown
**Важно:** После реализации оптимизации GraphQL схемы используйте вложенные запросы вместо множественных:
- getGradeWithNestedData() - один запрос вместо ~110
- Данные содержат все связанные сущности включая files для уроков
```

**Действия:**
- [ ] Открыть `docs/implementation/mvp/tasks/phase_11_grades.md`
- [ ] Добавить ссылку на roadmap в раздел документации
- [ ] Обновить Task 11.01 с информацией о вложенных запросах
- [ ] Сохранить файл

**Проверка:**
- [ ] Ссылка на roadmap добавлена
- [ ] Информация о вложенных запросах добавлена

---

## Task 4.2: Обновление phase_13_lessons.md

**Статус:** [ ] Не начато | [ ] В процессе | [ ] Выполнено | [ ] Проверено

**Описание:**
Обновить документацию фазы 13 (Управление уроками) с учетом поддержки файлов.

**Файлы для изменения:**
- [docs/implementation/mvp/tasks/phase_13_lessons.md](./mvp/tasks/phase_13_lessons.md)

**Изменения для внесения:**

1. Добавить ссылку на roadmap в раздел документации

2. Добавить новую задачу для работы с файлами:
```markdown
### Task 13.XX: Реализация прикрепления файлов к урокам

**Статус:** [ ] Не начато | [ ] В процессе | [ ] Выполнено | [ ] Проверено

**Описание:**
Реализовать функционал прикрепления файлов (изображения, PDF, документы) к урокам.

**Файлы для изменения:**
- [src/actions/lesson-files.ts](../../../../src/actions/lesson-files.ts)
- [src/components/teacher/LessonFileUploader/](../../../../src/components/teacher/LessonFileUploader/)
- [src/components/teacher/LessonFileList/](../../../../src/components/teacher/LessonFileList/)

**Документация:**
- [GRAPHQL_SCHEMA_OPTIMIZATION_ROADMAP.md](../../GRAPHQL_SCHEMA_OPTIMIZATION_ROADMAP.md) - раздел 3.2

**Действия:**
- [ ] Создать Server Actions для файлов (upload, delete, getUrl)
- [ ] Создать компонент LessonFileUploader
- [ ] Создать компонент LessonFileList
- [ ] Интегрировать в форму редактирования урока
- [ ] Проверить ограничения (10MB, 10 файлов)
```

**Действия:**
- [ ] Открыть `docs/implementation/mvp/tasks/phase_13_lessons.md`
- [ ] Добавить ссылку на roadmap
- [ ] Добавить новую задачу для работы с файлами
- [ ] Сохранить файл

**Проверка:**
- [ ] Ссылка добавлена
- [ ] Новая задача добавлена с корректным форматом

---

## Task 4.3: Обновление phase_14_homework.md

**Статус:** [ ] Не начато | [ ] В процессе | [ ] Выполнено | [ ] Проверено

**Описание:**
Обновить документацию фазы 14 (Проверка ДЗ) с учетом вложенных запросов.

**Файлы для изменения:**
- [docs/implementation/mvp/tasks/phase_14_homework.md](./mvp/tasks/phase_14_homework.md)

**Изменения для внесения:**

1. Добавить ссылку на roadmap в раздел документации

2. Обновить информацию о запросах:
```markdown
**Важно:** После реализации оптимизации GraphQL схемы:
- Используйте getLessonWithNestedData() для получения урока с данными учеников
- HomeworkCheck содержит вложенные данные pupil благодаря @belongsTo
- Не требуются отдельные запросы для получения данных учеников
```

**Действия:**
- [ ] Открыть `docs/implementation/mvp/tasks/phase_14_homework.md`
- [ ] Добавить ссылку на roadmap
- [ ] Обновить информацию о вложенных запросах
- [ ] Сохранить файл

**Проверка:**
- [ ] Ссылка добавлена
- [ ] Информация о вложенных запросах добавлена

---

## Task 4.4: Обновление phase_12_academic_years.md

**Статус:** [ ] Не начато | [ ] В процессе | [ ] Выполнено | [ ] Проверено

**Описание:**
Обновить документацию фазы 12 (Управление учебными годами) с учетом вложенных запросов для получения уроков.

**Файлы для изменения:**
- [docs/implementation/mvp/tasks/phase_12_academic_years.md](./mvp/tasks/phase_12_academic_years.md)

**Изменения для внесения:**

1. Добавить ссылку на roadmap в раздел "Документация":
```markdown
- [GRAPHQL_SCHEMA_OPTIMIZATION_ROADMAP.md](../../GRAPHQL_SCHEMA_OPTIMIZATION_ROADMAP.md) - оптимизация вложенных запросов
```

2. В Task 12.01 (или соответствующую задачу для получения данных учебного года) добавить:
```markdown
**Важно:** После реализации оптимизации GraphQL схемы:
- Используйте вложенные запросы для получения academicYear с уроками
- Уроки содержат вложенные данные: homeworkChecks, goldenVerses, files
- Не требуются отдельные запросы для получения связанных данных
```

**Действия:**
- [ ] Открыть `docs/implementation/mvp/tasks/phase_12_academic_years.md`
- [ ] Найти раздел "Документация"
- [ ] Добавить ссылку на roadmap
- [ ] Найти задачу для получения данных учебного года
- [ ] Добавить информацию о вложенных запросах
- [ ] Сохранить файл

**Проверка:**
- [ ] Ссылка добавлена
- [ ] Информация о вложенных запросах добавлена

---

## Task 4.5: Обновление phase_15_points_houses.md

**Статус:** [ ] Не начато | [ ] В процессе | [ ] Выполнено | [ ] Проверено

**Описание:**
Обновить документацию фазы 15 (Система баллов и домов) с учетом вложенных запросов для получения данных учеников.

**Файлы для изменения:**
- [docs/implementation/mvp/tasks/phase_15_points_houses.md](./mvp/tasks/phase_15_points_houses.md)

**Изменения для внесения:**

1. Добавить ссылку на roadmap в раздел "Документация"

2. В задачах, связанных с получением данных учеников, добавить:
```markdown
**Важно:** После реализации оптимизации GraphQL схемы:
- Используйте getPupilWithNestedData() для получения ученика с достижениями и проверками ДЗ
- Pupil содержит вложенные данные: homeworkChecks, achievements, families
- Не требуются отдельные запросы для получения связанных данных
```

**Действия:**
- [ ] Открыть `docs/implementation/mvp/tasks/phase_15_points_houses.md`
- [ ] Добавить ссылку на roadmap
- [ ] Найти задачи, связанные с получением данных учеников
- [ ] Добавить информацию о вложенных запросах
- [ ] Сохранить файл

**Проверка:**
- [ ] Ссылка добавлена
- [ ] Информация о вложенных запросах добавлена

---

## Task 4.6: Обновление phase_16_pupils.md

**Статус:** [ ] Не начато | [ ] В процессе | [ ] Выполнено | [ ] Проверено

**Описание:**
Обновить документацию фазы 16 (Управление учениками) с учетом вложенных запросов.

**Файлы для изменения:**
- [docs/implementation/mvp/tasks/phase_16_pupils.md](./mvp/tasks/phase_16_pupils.md)

**Изменения для внесения:**

1. Добавить ссылку на roadmap в раздел "Документация"

2. В Task 16.01 (или соответствующую задачу для получения данных ученика) добавить:
```markdown
**Важно:** После реализации оптимизации GraphQL схемы:
- Используйте getPupilWithNestedData() для получения ученика со всеми связанными данными
- Pupil содержит вложенные данные: homeworkChecks (с lesson), achievements (с achievement), families (с family)
- HomeworkCheck содержит вложенные данные pupil благодаря @belongsTo
- Не требуются отдельные запросы для получения связанных данных
```

**Действия:**
- [ ] Открыть `docs/implementation/mvp/tasks/phase_16_pupils.md`
- [ ] Добавить ссылку на roadmap
- [ ] Найти задачу для получения данных ученика
- [ ] Добавить информацию о вложенных запросах
- [ ] Сохранить файл

**Проверка:**
- [ ] Ссылка добавлена
- [ ] Информация о вложенных запросах добавлена

---

## Task 4.7: Обновление phase_17_teachers.md

**Статус:** [ ] Не начато | [ ] В процессе | [ ] Выполнено | [ ] Проверено

**Описание:**
Обновить документацию фазы 17 (Управление преподавателями) с учетом вложенных запросов для получения данных групп.

**Файлы для изменения:**
- [docs/implementation/mvp/tasks/phase_17_teachers.md](./mvp/tasks/phase_17_teachers.md)

**Изменения для внесения:**

1. Добавить ссылку на roadmap в раздел "Документация"

2. В задачах, связанных с получением данных групп преподавателя, добавить:
```markdown
**Важно:** После реализации оптимизации GraphQL схемы:
- Используйте вложенные запросы для получения UserGrade с данными grade и user
- UserGrade содержит вложенные данные user и grade благодаря @belongsTo
- Не требуются отдельные запросы для получения связанных данных
```

**Действия:**
- [ ] Открыть `docs/implementation/mvp/tasks/phase_17_teachers.md`
- [ ] Добавить ссылку на roadmap
- [ ] Найти задачи, связанные с получением данных групп
- [ ] Добавить информацию о вложенных запросах
- [ ] Сохранить файл

**Проверка:**
- [ ] Ссылка добавлена
- [ ] Информация о вложенных запросах добавлена

---

## Task 4.8: Обновление phase_18_families.md

**Статус:** [ ] Не начато | [ ] В процессе | [ ] Выполнено | [ ] Проверено

**Описание:**
Обновить документацию фазы 18 (Управление семьями) с учетом вложенных запросов.

**Файлы для изменения:**
- [docs/implementation/mvp/tasks/phase_18_families.md](./mvp/tasks/phase_18_families.md)

**Изменения для внесения:**

1. Добавить ссылку на roadmap в раздел "Документация"

2. В задачах, связанных с получением данных семей, добавить:
```markdown
**Важно:** После реализации оптимизации GraphQL схемы:
- Используйте вложенные запросы для получения FamilyMember с данными family и pupil
- FamilyMember содержит вложенные данные family и pupil благодаря @belongsTo
- UserFamily содержит вложенные данные user и family благодаря @belongsTo
- Не требуются отдельные запросы для получения связанных данных
```

**Действия:**
- [ ] Открыть `docs/implementation/mvp/tasks/phase_18_families.md`
- [ ] Добавить ссылку на roadmap
- [ ] Найти задачи, связанные с получением данных семей
- [ ] Добавить информацию о вложенных запросах
- [ ] Сохранить файл

**Проверка:**
- [ ] Ссылка добавлена
- [ ] Информация о вложенных запросах добавлена

---

## Task 4.9: Обновление phase_19_golden_verses.md

**Статус:** [ ] Не начато | [ ] В процессе | [ ] Выполнено | [ ] Проверено

**Описание:**
Обновить документацию фазы 19 (Библиотека золотых стихов) с учетом вложенных запросов для получения данных уроков.

**Файлы для изменения:**
- [docs/implementation/mvp/tasks/phase_19_golden_verses.md](./mvp/tasks/phase_19_golden_verses.md)

**Изменения для внесения:**

1. Добавить ссылку на roadmap в раздел "Документация"

2. В задачах, связанных с получением данных уроков и золотых стихов, добавить:
```markdown
**Важно:** После реализации оптимизации GraphQL схемы:
- Используйте getLessonWithNestedData() для получения урока с золотыми стихами
- Lesson содержит вложенные данные goldenVerses с данными goldenVerse и book
- LessonGoldenVerse содержит вложенные данные lesson и goldenVerse благодаря @belongsTo
- GoldenVerse содержит вложенные данные book благодаря @belongsTo
- Не требуются отдельные запросы для получения связанных данных
```

**Действия:**
- [ ] Открыть `docs/implementation/mvp/tasks/phase_19_golden_verses.md`
- [ ] Добавить ссылку на roadmap
- [ ] Найти задачи, связанные с получением данных уроков и золотых стихов
- [ ] Добавить информацию о вложенных запросах
- [ ] Сохранить файл

**Проверка:**
- [ ] Ссылка добавлена
- [ ] Информация о вложенных запросах добавлена

---

## Task 4.10: Обновление phase_20_grade_settings.md

**Статус:** [ ] Не начато | [ ] В процессе | [ ] Выполнено | [ ] Проверено

**Описание:**
Обновить документацию фазы 20 (Настройки групп) с учетом вложенных запросов для получения данных группы.

**Файлы для изменения:**
- [docs/implementation/mvp/tasks/phase_20_grade_settings.md](./mvp/tasks/phase_20_grade_settings.md)

**Изменения для внесения:**

1. Добавить ссылку на roadmap в раздел "Документация"

2. В задачах, связанных с получением данных группы, добавить:
```markdown
**Важно:** После реализации оптимизации GraphQL схемы:
- Используйте getGradeWithNestedData() для получения группы с настройками
- Grade содержит вложенные данные settings через @hasOne
- Не требуются отдельные запросы для получения настроек группы
```

**Действия:**
- [ ] Открыть `docs/implementation/mvp/tasks/phase_20_grade_settings.md`
- [ ] Добавить ссылку на roadmap
- [ ] Найти задачи, связанные с получением данных группы
- [ ] Добавить информацию о вложенных запросах
- [ ] Сохранить файл

**Проверка:**
- [ ] Ссылка добавлена
- [ ] Информация о вложенных запросах добавлена

---

## Task 4.11: Обновление phase_21_pupil_profiles.md

**Статус:** [ ] Не начато | [ ] В процессе | [ ] Выполнено | [ ] Проверено

**Описание:**
Обновить документацию фазы 21 (Личные карточки учеников) с учетом вложенных запросов.

**Файлы для изменения:**
- [docs/implementation/mvp/tasks/phase_21_pupil_profiles.md](./mvp/tasks/phase_21_pupil_profiles.md)

**Изменения для внесения:**

1. Добавить ссылку на roadmap в раздел "Документация"

2. В задачах, связанных с получением данных ученика, добавить:
```markdown
**Важно:** После реализации оптимизации GraphQL схемы:
- Используйте getPupilWithNestedData() для получения ученика со всеми данными
- Pupil содержит вложенные данные: homeworkChecks (с lesson), achievements (с achievement), families (с family)
- Не требуются отдельные запросы для получения связанных данных
- Данные доступны в одном запросе для отображения полной карточки ученика
```

**Действия:**
- [ ] Открыть `docs/implementation/mvp/tasks/phase_21_pupil_profiles.md`
- [ ] Добавить ссылку на roadmap
- [ ] Найти задачи, связанные с получением данных ученика
- [ ] Добавить информацию о вложенных запросах
- [ ] Сохранить файл

**Проверка:**
- [ ] Ссылка добавлена
- [ ] Информация о вложенных запросах добавлена

---

## Task 4.12: Обновление phase_22_rating.md

**Статус:** [ ] Не начато | [ ] В процессе | [ ] Выполнено | [ ] Проверено

**Описание:**
Обновить документацию фазы 22 (Рейтинг группы) с учетом вложенных запросов для получения данных группы и учеников.

**Файлы для изменения:**
- [docs/implementation/mvp/tasks/phase_22_rating.md](./mvp/tasks/phase_22_rating.md)

**Изменения для внесения:**

1. Добавить ссылку на roadmap в раздел "Документация"

2. В задачах, связанных с получением данных для рейтинга, добавить:
```markdown
**Важно:** После реализации оптимизации GraphQL схемы:
- Используйте getGradeWithNestedData() для получения группы со всеми данными
- Grade содержит вложенные данные: pupils, academicYears.lessons.homeworkChecks
- Все данные для расчета рейтинга доступны в одном запросе
- Не требуются отдельные запросы для получения данных учеников и их проверок ДЗ
- Снижение количества запросов с ~110 до 1
```

**Действия:**
- [ ] Открыть `docs/implementation/mvp/tasks/phase_22_rating.md`
- [ ] Добавить ссылку на roadmap
- [ ] Найти задачи, связанные с получением данных для рейтинга
- [ ] Добавить информацию о вложенных запросах
- [ ] Сохранить файл

**Проверка:**
- [ ] Ссылка добавлена
- [ ] Информация о вложенных запросах добавлена

---

## Task 4.13: Обновление phase_23_calendar.md

**Статус:** [ ] Не начато | [ ] В процессе | [ ] Выполнено | [ ] Проверено

**Описание:**
Обновить документацию фазы 23 (Календарь событий) с учетом вложенных запросов для получения событий группы.

**Файлы для изменения:**
- [docs/implementation/mvp/tasks/phase_23_calendar.md](./mvp/tasks/phase_23_calendar.md)

**Изменения для внесения:**

1. Добавить ссылку на roadmap в раздел "Документация"

2. В задачах, связанных с получением событий группы, добавить:
```markdown
**Важно:** После реализации оптимизации GraphQL схемы:
- Используйте getGradeWithNestedData() для получения группы с событиями
- Grade содержит вложенные данные events через @hasMany
- Не требуются отдельные запросы для получения событий группы
```

**Действия:**
- [ ] Открыть `docs/implementation/mvp/tasks/phase_23_calendar.md`
- [ ] Добавить ссылку на roadmap
- [ ] Найти задачи, связанные с получением событий
- [ ] Добавить информацию о вложенных запросах
- [ ] Сохранить файл

**Проверка:**
- [ ] Ссылка добавлена
- [ ] Информация о вложенных запросах добавлена

---

## Task 4.14: Обновление phase_24_academic_process.md

**Статус:** [ ] Не начато | [ ] В процессе | [ ] Выполнено | [ ] Проверено

**Описание:**
Обновить документацию фазы 24 (Учебный процесс) с учетом вложенных запросов для получения данных уроков и проверок ДЗ.

**Файлы для изменения:**
- [docs/implementation/mvp/tasks/phase_24_academic_process.md](./mvp/tasks/phase_24_academic_process.md)

**Изменения для внесения:**

1. Добавить ссылку на roadmap в раздел "Документация"

2. В задачах, связанных с получением данных учебного процесса, добавить:
```markdown
**Важно:** После реализации оптимизации GraphQL схемы:
- Используйте getGradeWithNestedData() для получения всех данных учебного процесса
- Grade содержит вложенные данные: academicYears.lessons с homeworkChecks, goldenVerses, files
- Все данные для отображения учебного процесса доступны в одном запросе
- Не требуются отдельные запросы для получения связанных данных
```

**Действия:**
- [ ] Открыть `docs/implementation/mvp/tasks/phase_24_academic_process.md`
- [ ] Добавить ссылку на roadmap
- [ ] Найти задачи, связанные с получением данных учебного процесса
- [ ] Добавить информацию о вложенных запросах
- [ ] Сохранить файл

**Проверка:**
- [ ] Ссылка добавлена
- [ ] Информация о вложенных запросах добавлена

---

## Task 4.15: Обновление phase_25_testing_deployment.md

**Статус:** [ ] Не начато | [ ] В процессе | [ ] Выполнено | [ ] Проверено

**Описание:**
Обновить документацию фазы 25 (Тестирование и деплой) с учетом проверки оптимизированных запросов.

**Файлы для изменения:**
- [docs/implementation/mvp/tasks/phase_25_testing_deployment.md](./mvp/tasks/phase_25_testing_deployment.md)

**Изменения для внесения:**

1. Добавить ссылку на roadmap в раздел "Документация"

2. В раздел тестирования добавить:
```markdown
**Важно:** После реализации оптимизации GraphQL схемы:
- Проверьте, что все страницы используют вложенные запросы вместо множественных
- Убедитесь, что количество запросов к AppSync снижено на 90-99%
- Проверьте производительность загрузки страниц (должна улучшиться)
- Проверьте работу вложенных данных: files для уроков, pupil в homeworkChecks, и т.д.
- Убедитесь, что нет ошибок при получении вложенных данных через @belongsTo и @hasMany
```

**Действия:**
- [ ] Открыть `docs/implementation/mvp/tasks/phase_25_testing_deployment.md`
- [ ] Добавить ссылку на roadmap
- [ ] Найти раздел тестирования
- [ ] Добавить информацию о проверке оптимизированных запросов
- [ ] Сохранить файл

**Проверка:**
- [ ] Ссылка добавлена
- [ ] Информация о проверке оптимизированных запросов добавлена

---

# Приложение A: Чеклист выполнения

## Общий прогресс

| Раздел | Задачи | Выполнено | Процент |
|--------|--------|-----------|---------|
| 1. GraphQL схема | 10 | 0 | 0% |
| 2. Generated файлы | 3 | 0 | 0% |
| 3. Функционал | 7 | 0 | 0% |
| 4. Документация | 15 | 0 | 0% |
| **ИТОГО** | **35** | **0** | **0%** |

## Критерии завершения

- [ ] Все задачи раздела 1 выполнены и проверены
- [ ] Все задачи раздела 2 выполнены и проверены
- [ ] Все задачи раздела 3 выполнены и проверены
- [ ] Все задачи раздела 4 выполнены и проверены
- [ ] TypeScript компиляция проходит: `npx tsc --noEmit`
- [ ] ESLint проходит: `npm run lint`
- [ ] Build проходит: `npm run build`
- [ ] Все страницы загружаются без ошибок

---

# Приложение B: Ссылки на документацию

## Основные документы

| Документ | Путь | Описание |
|----------|------|----------|
| GraphQL Schema | [amplify/backend/api/sunsch/schema.graphql](../../amplify/backend/api/sunsch/schema.graphql) | Текущая GraphQL схема |
| DynamoDB Schema | [docs/database/DYNAMODB_SCHEMA.md](../database/DYNAMODB_SCHEMA.md) | Структура таблиц |
| Server Actions | [docs/api/SERVER_ACTIONS.md](../api/SERVER_ACTIONS.md) | Документация API |
| Validation | [docs/api/VALIDATION.md](../api/VALIDATION.md) | Схемы валидации |
| Wireframes | [docs/ui_ux/WIREFRAMES.md](../ui_ux/WIREFRAMES.md) | Дизайн страниц |
| MVP Scope | [docs/MVP_SCOPE.md](../MVP_SCOPE.md) | Scope проекта |

## Сгенерированные файлы

| Файл | Путь | Описание |
|------|------|----------|
| Types | [src/graphql/generated/types.ts](../../src/graphql/generated/types.ts) | TypeScript типы |
| Queries | [src/graphql/queries.ts](../../src/graphql/queries.ts) | GraphQL queries |
| Mutations | [src/graphql/mutations.ts](../../src/graphql/mutations.ts) | GraphQL mutations |

## Phase документы

| Фаза | Путь | Описание |
|------|------|----------|
| Phase 11 | [phase_11_grades.md](./mvp/tasks/phase_11_grades.md) | Управление группами |
| Phase 13 | [phase_13_lessons.md](./mvp/tasks/phase_13_lessons.md) | Управление уроками |
| Phase 14 | [phase_14_homework.md](./mvp/tasks/phase_14_homework.md) | Проверка ДЗ |

---

**Конец документа**

**Версия:** 2.0  
**Дата обновления:** 31 декабря 2025  
**Автор:** CursorAI Agent
