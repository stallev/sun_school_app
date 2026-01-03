# Примеры тестирования фильтрации и пагинации GraphQL API

**Дата создания:** 27 декабря 2025  
**Назначение:** Примеры GraphQL queries для тестирования фильтрации и пагинации после `amplify push`

---

## Важно

Эти примеры можно использовать только **после выполнения `amplify push`**, когда GraphQL API будет развернут в AWS AppSync.

---

## 1. Тестирование фильтрации

### 1.1. Фильтрация уроков по группе

```graphql
query ListLessonsByGrade {
  listLessons(
    filter: {
      gradeId: { eq: "grade-123" }
    }
    limit: 20
  ) {
    items {
      id
      title
      lessonDate
      order
      gradeId
    }
    nextToken
  }
}
```

### 1.2. Фильтрация уроков по группе и дате

```graphql
query ListLessonsByGradeAndDate {
  listLessons(
    filter: {
      gradeId: { eq: "grade-123" }
      lessonDate: { ge: "2025-01-01" }
    }
    limit: 10
  ) {
    items {
      id
      title
      lessonDate
    }
    nextToken
  }
}
```

### 1.3. Фильтрация учеников по группе и активности

```graphql
query ListActivePupilsByGrade {
  listPupils(
    filter: {
      gradeId: { eq: "grade-123" }
      active: { eq: true }
    }
  ) {
    items {
      id
      firstName
      lastName
      active
      gradeId
    }
    nextToken
  }
}
```

### 1.4. Фильтрация учебных годов по статусу

```graphql
query ListActiveAcademicYears {
  listAcademicYears(
    filter: {
      status: { eq: ACTIVE }
    }
  ) {
    items {
      id
      name
      startDate
      endDate
      status
      gradeId
    }
    nextToken
  }
}
```

### 1.5. Фильтрация с использованием операторов

```graphql
# Фильтрация уроков с использованием операторов
query ListLessonsWithOperators {
  listLessons(
    filter: {
      and: [
        { gradeId: { eq: "grade-123" } }
        { lessonDate: { ge: "2025-01-01" } }
        { lessonDate: { le: "2025-12-31" } }
      ]
    }
  ) {
    items {
      id
      title
      lessonDate
    }
    nextToken
  }
}
```

### 1.6. Фильтрация по частичному совпадению строк

```graphql
query ListLessonsByTitle {
  listLessons(
    filter: {
      title: { contains: "Библия" }
    }
  ) {
    items {
      id
      title
    }
    nextToken
  }
}
```

---

## 2. Тестирование пагинации

### 2.1. Базовая пагинация

```graphql
# Первая страница
query ListLessonsPage1 {
  listLessons(
    filter: { gradeId: { eq: "grade-123" } }
    limit: 5
  ) {
    items {
      id
      title
      lessonDate
    }
    nextToken
  }
}
```

### 2.2. Вторая страница (используя nextToken из первой страницы)

```graphql
# Вторая страница
query ListLessonsPage2 {
  listLessons(
    filter: { gradeId: { eq: "grade-123" } }
    limit: 5
    nextToken: "eyJ2ZXJzaW9uIjoxLCJ0b2tlbiI6IkFRSUNBSHh..."
  ) {
    items {
      id
      title
      lessonDate
    }
    nextToken
  }
}
```

### 2.3. Пагинация без фильтра

```graphql
query ListAllLessonsPaginated {
  listLessons(limit: 10) {
    items {
      id
      title
    }
    nextToken
  }
}
```

---

## 3. Комбинированное тестирование (фильтрация + пагинация)

### 3.1. Фильтрация и пагинация вместе

```graphql
query ListLessonsFilteredAndPaginated {
  listLessons(
    filter: {
      gradeId: { eq: "grade-123" }
      lessonDate: { ge: "2025-01-01" }
    }
    limit: 10
    nextToken: null
  ) {
    items {
      id
      title
      lessonDate
      order
    }
    nextToken
  }
}
```

---

## 4. Тестирование в AWS AppSync Console

### 4.1. Шаги для тестирования

1. Открыть AWS AppSync Console
2. Выбрать API (sunsch)
3. Перейти в раздел "Queries"
4. Вставить один из примеров queries выше
5. Нажать "Run query"
6. Проверить результаты

### 4.2. Проверка результатов

**Для фильтрации:**
- ✅ Проверить, что возвращаются только записи, соответствующие фильтру
- ✅ Проверить, что количество результатов не превышает `limit` (если указан)
- ✅ Проверить, что все поля в фильтре работают корректно

**Для пагинации:**
- ✅ Проверить, что `nextToken` присутствует, если есть еще результаты
- ✅ Проверить, что `nextToken` отсутствует, если это последняя страница
- ✅ Проверить, что использование `nextToken` возвращает следующую страницу результатов
- ✅ Проверить, что результаты не дублируются между страницами

---

## 5. Примеры для всех основных типов

### 5.1. User

```graphql
query ListUsers {
  listUsers(
    filter: {
      role: { eq: TEACHER }
      active: { eq: true }
    }
    limit: 20
  ) {
    items {
      id
      name
      email
      role
      active
    }
    nextToken
  }
}
```

### 5.2. Grade

```graphql
query ListGrades {
  listGrades(
    filter: {
      active: { eq: true }
    }
  ) {
    items {
      id
      name
      description
      active
    }
    nextToken
  }
}
```

### 5.3. Book

```graphql
query ListBooks {
  listBooks(
    filter: {
      testament: { eq: "NEW" }
    }
  ) {
    items {
      id
      fullName
      shortName
      testament
      order
    }
    nextToken
  }
}
```

### 5.4. GoldenVerse

```graphql
query ListGoldenVerses {
  listGoldenVerses(
    filter: {
      bookId: { eq: "book-123" }
    }
  ) {
    items {
      id
      reference
      chapter
      verseStart
      verseEnd
      text
    }
    nextToken
  }
}
```

### 5.5. HomeworkCheck

```graphql
query ListHomeworkChecks {
  listHomeworkChecks(
    filter: {
      lessonId: { eq: "lesson-789" }
    }
    limit: 50
  ) {
    items {
      id
      pupilId
      lessonId
      points
      goldenVerse1Score
      goldenVerse2Score
      goldenVerse3Score
      testScore
      notebookScore
      singing
    }
    nextToken
  }
}
```

### 5.6. Achievement

```graphql
query ListAchievements {
  listAchievements(
    filter: {
      name: { contains: "Отличник" }
    }
  ) {
    items {
      id
      name
      description
      icon
    }
    nextToken
  }
}
```

### 5.7. Family

```graphql
query ListFamilies {
  listFamilies(
    filter: {
      name: { beginsWith: "Иванов" }
    }
  ) {
    items {
      id
      name
      phone
      email
    }
    nextToken
  }
}
```

### 5.8. GradeEvent

```graphql
query ListGradeEvents {
  listGradeEvents(
    filter: {
      gradeId: { eq: "grade-123" }
      eventType: { eq: LESSON }
    }
    limit: 30
  ) {
    items {
      id
      gradeId
      eventType
      title
      eventDate
    }
    nextToken
  }
}
```

---

## 6. Тестирование сложных фильтров

### 6.1. Использование оператора OR

```graphql
query ListLessonsWithOR {
  listLessons(
    filter: {
      or: [
        { gradeId: { eq: "grade-123" } }
        { gradeId: { eq: "grade-456" } }
      ]
    }
  ) {
    items {
      id
      title
      gradeId
    }
    nextToken
  }
}
```

### 6.2. Комбинирование AND и OR

```graphql
query ListLessonsComplex {
  listLessons(
    filter: {
      and: [
        {
          or: [
            { gradeId: { eq: "grade-123" } }
            { gradeId: { eq: "grade-456" } }
          ]
        }
        { lessonDate: { ge: "2025-01-01" } }
      ]
    }
  ) {
    items {
      id
      title
      gradeId
      lessonDate
    }
    nextToken
  }
}
```

### 6.3. Фильтрация по диапазону дат

```graphql
query ListLessonsByDateRange {
  listLessons(
    filter: {
      lessonDate: {
        between: ["2025-01-01", "2025-12-31"]
      }
    }
  ) {
    items {
      id
      title
      lessonDate
    }
    nextToken
  }
}
```

---

## 7. Проверка производительности

### 7.1. Тестирование с большим количеством данных

```graphql
# Тест производительности с limit
query TestPerformance {
  listLessons(
    filter: { gradeId: { eq: "grade-123" } }
    limit: 100
  ) {
    items {
      id
      title
    }
    nextToken
  }
}
```

### 7.2. Проверка времени выполнения

В AppSync Console можно проверить:
- Время выполнения query (в миллисекундах)
- Количество записей, возвращенных за один запрос
- Использование индексов (GSI)

---

## 8. Ожидаемые результаты

### 8.1. Успешная фильтрация

- ✅ Возвращаются только записи, соответствующие фильтру
- ✅ Количество результатов соответствует ожиданиям
- ✅ Все поля в фильтре работают корректно

### 8.2. Успешная пагинация

- ✅ `nextToken` присутствует, если есть еще результаты
- ✅ `nextToken` отсутствует на последней странице
- ✅ Использование `nextToken` возвращает следующую страницу
- ✅ Результаты не дублируются между страницами
- ✅ Порядок результатов сохраняется между страницами

### 8.3. Возможные ошибки

- ❌ **Ошибка авторизации:** Проверить @auth директивы и группы пользователей
- ❌ **Ошибка фильтрации:** Проверить синтаксис фильтра и наличие индексов
- ❌ **Пустые результаты:** Проверить, что данные существуют в базе
- ❌ **Медленная работа:** Проверить использование индексов (GSI)

---

## 9. Дополнительные ресурсы

- [AWS AppSync Filtering Documentation](https://docs.aws.amazon.com/appsync/latest/devguide/using-your-api.html#using-your-api-query-filtering)
- [GraphQL Schema Documentation](../../../database/GRAPHQL_SCHEMA.md)
- [Результаты проверки Schema](./phase_04_graphql_verification_results.md)

---

**Примечание:** После выполнения `amplify push` используйте эти примеры для тестирования фильтрации и пагинации в AWS AppSync Console.


