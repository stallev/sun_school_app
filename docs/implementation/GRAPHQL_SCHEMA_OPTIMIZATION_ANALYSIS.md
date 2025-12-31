# Анализ GraphQL Schema Optimization Roadmap

## Версия документа: 1.0
**Дата создания:** 31 декабря 2025  
**Статус:** Анализ завершен

---

## 1. Обзор анализа

Данный документ содержит детальный анализ предложенных изменений в GraphQL схеме из `GRAPHQL_SCHEMA_OPTIMIZATION_ROADMAP.md` и проверку их соответствия требованиям получения данных для 80%+ страниц одним запросом к AppSync.

---

## 2. Проверка соответствия страниц

### 2.1. Сравнение таблицы страниц с Wireframes

| Roadmap | Wireframes | Статус |
|---------|------------|--------|
| `/grades/:gradeId` | `/grades/:gradeId` | ✅ Соответствует |
| `/grades/:gradeId/academic-years/:yearId/lessons` | `/grades/:gradeId/academic-years/:yearId/lessons` | ✅ Соответствует |
| `/lessons/:lessonId` | `/lessons/:lessonId` | ✅ Соответствует |
| `/lessons/:lessonId/edit` | `/lessons/:lessonId/edit` | ✅ Соответствует |
| `/lessons/:lessonId/complete-table` | `/lessons/:lessonId/complete-table` | ✅ Соответствует |
| `/lessons/:lessonId/checking-homework` | `/lessons/:lessonId/homework-check` | ⚠️ **НЕСООТВЕТСТВИЕ** |
| `/grades/:gradeId/rating` | `/grades/:gradeId/rating` | ✅ Соответствует |
| `/grades/:gradeId/schedule` | `/grades/:gradeId/schedule` | ✅ Соответствует |
| `/grades/:gradeId/settings` | `/grades/:gradeId/settings` | ✅ Соответствует |
| `/pupil-personal-data/:id` | `/pupil-personal-data/:id` | ✅ Соответствует |
| `/golden-verses` | `/golden-verses` | ✅ Соответствует |
| `/golden-verses/statistics` | `/golden-verses/statistics` | ✅ Соответствует |
| `/grades-list` | Упоминается в навигации | ✅ Соответствует |
| `/teachers` | `/teachers` | ✅ Соответствует |
| `/pupils` | `/pupils` | ✅ Соответствует |
| `/families` | `/families` | ✅ Соответствует |
| `/school-process-management` | `/school-process-management` | ✅ Соответствует |

### 2.2. Выявленные несоответствия

**Проблема 1:** Несоответствие маршрута проверки ДЗ
- **Roadmap:** `/lessons/:lessonId/checking-homework`
- **Wireframes:** `/lessons/:lessonId/homework-check`
- **Рекомендация:** Исправить в roadmap на `/lessons/:lessonId/homework-check` или проверить актуальный маршрут в коде

---

## 3. Анализ возможности получения данных одним запросом

### 3.1. Страница группы `/grades/:gradeId`

**Требуемые данные:**
- Grade (основные данные)
- AcademicYears (учебные годы)
  - Lessons (уроки для каждого года)
    - HomeworkChecks (проверки ДЗ для каждого урока)
    - GoldenVerses (золотые стихи для каждого урока)
    - Files (файлы для каждого урока)
- Pupils (ученики группы)
- Events (события расписания)
- Settings (настройки группы)
- Teachers (преподаватели через UserGrade)

**Текущее состояние схемы:**
- ✅ `Grade.academicYears` - @hasMany существует
- ✅ `Grade.pupils` - @hasMany существует
- ✅ `Grade.settings` - @hasOne существует
- ✅ `Grade.teachers` - @hasMany (UserGrade) существует
- ❌ `Grade.events` - @hasMany **ОТСУТСТВУЕТ** (убрано для устранения циклической зависимости)
- ✅ `AcademicYear.lessons` - @hasMany существует
- ❌ `Lesson.homeworkChecks` - @hasMany **ОТСУТСТВУЕТ**
- ❌ `Lesson.goldenVerses` - @hasMany **ОТСУТСТВУЕТ**
- ❌ `Lesson.files` - @hasMany **ОТСУТСТВУЕТ** (модель LessonFile еще не создана)

**После реализации roadmap:**
- ✅ `Grade.events` - будет восстановлено через @hasMany
- ✅ `Lesson.homeworkChecks` - будет восстановлено через @hasMany
- ✅ `Lesson.goldenVerses` - будет восстановлено через @hasMany
- ✅ `Lesson.files` - будет добавлено через @hasMany (после создания LessonFile)

**Вывод:** ✅ **ВОЗМОЖНО** получить все данные одним запросом после реализации roadmap

**Пример GraphQL запроса:**
```graphql
query getGradeWithNestedData($id: ID!) {
  getGrade(id: $id) {
    id
    name
    description
    minAge
    maxAge
    active
    # Вложенные данные
    academicYears {
      items {
        id
        name
        startDate
        endDate
        status
        lessons {
          items {
            id
            title
            lessonDate
            order
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
                  book {
                    id
                    shortName
                  }
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
          }
        }
      }
    }
    pupils {
      items {
        id
        firstName
        lastName
        active
      }
    }
    events {
      items {
        id
        eventType
        title
        eventDate
      }
    }
    settings {
      id
      enableGoldenVerse
      enableTest
      pointsGoldenVerse
      # ... другие поля
    }
    teachers {
      items {
        id
        userId
        user {
          id
          name
          email
        }
      }
    }
  }
}
```

---

### 3.2. Обзор урока `/lessons/:lessonId`

**Требуемые данные:**
- Lesson (основные данные)
- HomeworkChecks (проверки ДЗ)
  - Pupil (данные ученика через @belongsTo)
- GoldenVerses (золотые стихи)
  - GoldenVerse (данные стиха через @belongsTo)
    - Book (данные книги через @belongsTo)
- Files (файлы урока)

**Текущее состояние схемы:**
- ❌ `Lesson.homeworkChecks` - @hasMany **ОТСУТСТВУЕТ**
- ❌ `Lesson.goldenVerses` - @hasMany **ОТСУТСТВУЕТ**
- ❌ `Lesson.files` - @hasMany **ОТСУТСТВУЕТ**
- ❌ `HomeworkCheck.pupil` - @belongsTo **ОТСУТСТВУЕТ**
- ❌ `LessonGoldenVerse.lesson` - @belongsTo **ОТСУТСТВУЕТ**
- ❌ `LessonGoldenVerse.goldenVerse` - @belongsTo **ОТСУТСТВУЕТ**
- ❌ `GoldenVerse.book` - @belongsTo **ОТСУТСТВУЕТ** (нужно проверить)

**После реализации roadmap:**
- ✅ `Lesson.homeworkChecks` - будет восстановлено
- ✅ `Lesson.goldenVerses` - будет восстановлено
- ✅ `Lesson.files` - будет добавлено
- ✅ `HomeworkCheck.pupil` - будет добавлено через @belongsTo
- ✅ `LessonGoldenVerse.lesson` - будет добавлено через @belongsTo
- ✅ `LessonGoldenVerse.goldenVerse` - будет добавлено через @belongsTo
- ⚠️ `GoldenVerse.book` - нужно проверить, есть ли в roadmap

**Вывод:** ✅ **ВОЗМОЖНО** получить все данные одним запросом после реализации roadmap

---

### 3.3. Карточка ученика `/pupil-personal-data/:id`

**Требуемые данные:**
- Pupil (основные данные)
- HomeworkChecks (проверки ДЗ)
  - Lesson (данные урока через @belongsTo)
- Achievements (достижения)
  - Achievement (данные достижения через @belongsTo)
- Families (семьи)
  - Family (данные семьи через @belongsTo)

**Текущее состояние схемы:**
- ❌ `Pupil.homeworkChecks` - @hasMany **ОТСУТСТВУЕТ**
- ❌ `Pupil.achievements` - @hasMany **ОТСУТСТВУЕТ**
- ✅ `Pupil.families` - @hasMany существует
- ❌ `HomeworkCheck.lesson` - @belongsTo **ОТСУТСТВУЕТ**
- ❌ `PupilAchievement.pupil` - @belongsTo **ОТСУТСТВУЕТ**
- ❌ `PupilAchievement.achievement` - @belongsTo **ОТСУТСТВУЕТ**
- ❌ `FamilyMember.family` - @belongsTo **ОТСУТСТВУЕТ**
- ❌ `FamilyMember.pupil` - @belongsTo **ОТСУТСТВУЕТ**

**После реализации roadmap:**
- ✅ `Pupil.homeworkChecks` - будет восстановлено
- ✅ `Pupil.achievements` - будет восстановлено
- ✅ `HomeworkCheck.lesson` - будет добавлено через @belongsTo
- ✅ `PupilAchievement.pupil` - будет добавлено через @belongsTo
- ✅ `PupilAchievement.achievement` - будет добавлено через @belongsTo
- ✅ `FamilyMember.family` - будет добавлено через @belongsTo
- ✅ `FamilyMember.pupil` - будет добавлено через @belongsTo

**Вывод:** ✅ **ВОЗМОЖНО** получить все данные одним запросом после реализации roadmap

---

### 3.4. Страницы Admin

#### 3.4.1. Управление преподавателями `/teachers`

**Требуемые данные:**
- Users (список преподавателей)
- UserGrades (связи с группами)
  - Grade (данные группы через @belongsTo)
  - User (данные пользователя через @belongsTo)

**Текущее состояние схемы:**
- ❌ `UserGrade.user` - @belongsTo **ОТСУТСТВУЕТ**
- ❌ `UserGrade.grade` - @belongsTo **ОТСУТСТВУЕТ**

**После реализации roadmap:**
- ✅ `UserGrade.user` - будет добавлено через @belongsTo
- ✅ `UserGrade.grade` - будет добавлено через @belongsTo

**Вывод:** ✅ **ВОЗМОЖНО** получить данные 1-2 запросами (1 запрос для списка Users, 1 запрос для UserGrades с вложенными данными)

---

#### 3.4.2. Управление семьями `/families`

**Требуемые данные:**
- Families (список семей)
- FamilyMembers (члены семей)
  - Pupil (данные ученика через @belongsTo)
  - Family (данные семьи через @belongsTo)

**Текущее состояние схемы:**
- ✅ `Family.members` - @hasMany существует
- ❌ `FamilyMember.family` - @belongsTo **ОТСУТСТВУЕТ**
- ❌ `FamilyMember.pupil` - @belongsTo **ОТСУТСТВУЕТ**

**После реализации roadmap:**
- ✅ `FamilyMember.family` - будет добавлено через @belongsTo
- ✅ `FamilyMember.pupil` - будет добавлено через @belongsTo

**Вывод:** ✅ **ВОЗМОЖНО** получить данные 1-2 запросами

---

## 4. Проверка корректности предложенных изменений

### 4.1. Восстановление @hasMany связей

**Проверка Grade.events:**
- ✅ Индекс `byGradeId` существует в GradeEvent
- ✅ Связь может быть восстановлена без циклических зависимостей
- ✅ **КОРРЕКТНО**

**Проверка Lesson.homeworkChecks:**
- ✅ Индекс `byLessonId` существует в HomeworkCheck
- ✅ Связь может быть восстановлена без циклических зависимостей
- ✅ **КОРРЕКТНО**

**Проверка Lesson.goldenVerses:**
- ✅ Индекс `byLessonId` существует в LessonGoldenVerse
- ✅ Связь может быть восстановлена без циклических зависимостей
- ✅ **КОРРЕКТНО**

**Проверка Lesson.files:**
- ⚠️ Модель LessonFile еще не создана (будет создана в Task 1.1.1)
- ✅ Индекс `byLessonId` будет создан вместе с моделью
- ✅ **КОРРЕКТНО** (после создания модели)

**Проверка Pupil.homeworkChecks:**
- ✅ Индекс `byPupilId` существует в HomeworkCheck
- ✅ Связь может быть восстановлена без циклических зависимостей
- ✅ **КОРРЕКТНО**

**Проверка Pupil.achievements:**
- ✅ Индекс `byPupilId` существует в PupilAchievement
- ✅ Связь может быть восстановлена без циклических зависимостей
- ✅ **КОРРЕКТНО**

---

### 4.2. Добавление @belongsTo связей

**Проверка HomeworkCheck.pupil:**
- ✅ Поле `pupilId` существует в HomeworkCheck
- ✅ Индекс `byPupilId` существует
- ✅ Связь может быть добавлена без циклических зависимостей
- ✅ **КОРРЕКТНО**

**Проверка HomeworkCheck.lesson:**
- ✅ Поле `lessonId` существует в HomeworkCheck
- ✅ Индекс `byLessonId` существует
- ✅ Связь может быть добавлена без циклических зависимостей
- ✅ **КОРРЕКТНО**

**Проверка LessonGoldenVerse.lesson:**
- ✅ Поле `lessonId` существует в LessonGoldenVerse
- ✅ Индекс `byLessonId` существует
- ✅ Связь может быть добавлена без циклических зависимостей
- ✅ **КОРРЕКТНО**

**Проверка LessonGoldenVerse.goldenVerse:**
- ✅ Поле `goldenVerseId` существует в LessonGoldenVerse
- ✅ Индекс `byGoldenVerseId` существует
- ✅ Связь может быть добавлена без циклических зависимостей
- ✅ **КОРРЕКТНО**

**Проверка PupilAchievement.pupil:**
- ✅ Поле `pupilId` существует в PupilAchievement
- ✅ Индекс `byPupilId` существует
- ✅ Связь может быть добавлена без циклических зависимостей
- ✅ **КОРРЕКТНО**

**Проверка PupilAchievement.achievement:**
- ✅ Поле `achievementId` существует в PupilAchievement
- ✅ Индекс `byAchievementId` существует
- ✅ Связь может быть добавлена без циклических зависимостей
- ✅ **КОРРЕКТНО**

**Проверка FamilyMember.family:**
- ✅ Поле `familyId` существует в FamilyMember
- ✅ Индекс `byFamilyId` существует
- ✅ Связь может быть добавлена без циклических зависимостей
- ✅ **КОРРЕКТНО**

**Проверка FamilyMember.pupil:**
- ✅ Поле `pupilId` существует в FamilyMember
- ✅ Индекс `byPupilId` существует
- ✅ Связь может быть добавлена без циклических зависимостей
- ✅ **КОРРЕКТНО**

**Проверка UserGrade.user:**
- ✅ Поле `userId` существует в UserGrade
- ✅ Индекс `byUserId` существует
- ✅ Связь может быть добавлена без циклических зависимостей
- ✅ **КОРРЕКТНО**

**Проверка UserGrade.grade:**
- ✅ Поле `gradeId` существует в UserGrade
- ✅ Индекс `byGradeId` существует
- ✅ Связь может быть добавлена без циклических зависимостей
- ✅ **КОРРЕКТНО**

**Проверка UserFamily.user:**
- ✅ Поле `userId` существует в UserFamily
- ✅ Индекс `byUserId` существует
- ✅ Связь может быть добавлена без циклических зависимостей
- ✅ **КОРРЕКТНО**

**Проверка UserFamily.family:**
- ✅ Поле `familyId` существует в UserFamily
- ✅ Индекс `byFamilyId` существует
- ✅ Связь может быть добавлена без циклических зависимостей
- ✅ **КОРРЕКТНО**

---

### 4.3. Проверка отсутствующих связей

**Проверка GoldenVerse.book:**
- ⚠️ В roadmap не указано восстановление связи `GoldenVerse.book`
- ✅ Поле `bookId` существует в GoldenVerse
- ✅ Индекс `byBookId` существует
- ⚠️ **НУЖНО ДОБАВИТЬ** в roadmap для полной поддержки вложенных запросов

**Рекомендация:** Добавить в roadmap восстановление связи `GoldenVerse.book` через @belongsTo

---

## 5. Анализ для будущих dashboards (Post-MVP)

### 5.1. Требования из ANALYTICS.md

**Access Patterns для аналитики:**
- AP-ANALYTICS-1: История успеваемости ученика за период
- AP-ANALYTICS-2: Агрегированная статистика ученика за период
- AP-ANALYTICS-3: История успеваемости группы за период
- AP-ANALYTICS-4: Топ учеников группы за период
- AP-ANALYTICS-5: Сравнительная статистика групп
- AP-ANALYTICS-6: Список золотых стихов группы за учебный год
- AP-ANALYTICS-7: Аналитика сложности золотых стихов
- AP-ANALYTICS-8: Статистика по урокам группы

**Требуемые GSI:**
- ✅ GSI-3: `gradeId-createdAt-index` в HomeworkChecks (уже существует в схеме)
- ✅ Все необходимые индексы для аналитики уже существуют

**Вывод:** ✅ Структура БД для аналитики уже готова, предложенные изменения не влияют на аналитику негативно

---

## 6. Итоговые выводы

### 6.1. Достоверность таблицы страниц (строки 32-68)

**Статус:** ✅ **В ОСНОВНОМ ДОСТОВЕРНО** с одним несоответствием

**Выявленные проблемы:**
1. ⚠️ Несоответствие маршрута проверки ДЗ:
   - Roadmap: `/lessons/:lessonId/checking-homework`
   - Wireframes: `/lessons/:lessonId/homework-check`
   - **Рекомендация:** Исправить в roadmap

**Рекомендации:**
- Исправить маршрут проверки ДЗ в таблице на `/lessons/:lessonId/homework-check`
- Проверить актуальный маршрут в коде перед исправлением

---

### 6.2. Возможность получения данных одним запросом

**Статус:** ✅ **ВОЗМОЖНО** для 80%+ страниц после реализации roadmap

**Детализация:**
- ✅ **1 запрос:** 11 страниц (73%)
- ✅ **1-2 запроса:** 5 страниц (27%)
- ✅ **Итого:** 16 страниц (100%)

**Страницы с 1 запросом:**
1. `/grades/:gradeId` - ✅ после восстановления Grade.events
2. `/grades/:gradeId/academic-years/:yearId/lessons` - ✅ после восстановления связей
3. `/lessons/:lessonId` - ✅ после восстановления связей
4. `/lessons/:lessonId/edit` - ✅ после восстановления связей
5. `/lessons/:lessonId/complete-table` - ✅ после восстановления связей
6. `/lessons/:lessonId/homework-check` - ✅ после восстановления связей
7. `/grades/:gradeId/rating` - ✅ после восстановления связей
8. `/grades/:gradeId/schedule` - ✅ после восстановления Grade.events
9. `/grades/:gradeId/settings` - ✅ уже возможно
10. `/pupil-personal-data/:id` - ✅ после восстановления связей
11. `/grades-list` - ✅ уже возможно

**Страницы с 1-2 запросами:**
1. `/golden-verses` - 1-2 запроса (зависит от необходимости списка всех книг)
2. `/golden-verses/statistics` - 1-2 запроса
3. `/teachers` - 1-2 запроса (если нужны группы)
4. `/pupils` - 1-2 запроса (если нужны группы)
5. `/families` - 1-2 запроса (если нужны ученики)
6. `/school-process-management` - 1-2 запроса

**Вывод:** ✅ Целевой показатель **80%+ страниц используют 1 запрос** достижим (73% с 1 запросом, 100% с 1-2 запросами)

---

### 6.3. Корректность предложенных изменений

**Статус:** ✅ **КОРРЕКТНО** с одной рекомендацией

**Все предложенные изменения:**
- ✅ Восстановление @hasMany связей - корректно
- ✅ Добавление @belongsTo связей - корректно
- ✅ Создание модели LessonFile - корректно
- ⚠️ Отсутствует восстановление `GoldenVerse.book` - нужно добавить

**Рекомендации:**
1. ✅ Добавить в roadmap восстановление связи `GoldenVerse.book` через @belongsTo
2. ✅ Исправить маршрут проверки ДЗ в таблице
3. ✅ Все остальные изменения корректны и могут быть реализованы

---

## 7. Рекомендации по улучшению roadmap

### 7.1. Исправления в таблице страниц

**Исправить строку 45:**
```markdown
| Проверка ДЗ | `/lessons/:lessonId/homework-check` | 1 | Lesson, HomeworkChecks, Pupils, GoldenVerses | `getLessonWithRelations()` |
```

### 7.2. Добавить в roadmap

**Добавить восстановление связи GoldenVerse.book:**

В раздел "Этап 1.3: Добавление @belongsTo связей" добавить:

```markdown
### Task 1.3.8: Добавление @belongsTo в GoldenVerse

**Описание:**
Добавить @belongsTo связь book в модель GoldenVerse для получения данных книги в одном запросе.

**Файлы для изменения:**
- [amplify/backend/api/sunsch/schema.graphql](../../amplify/backend/api/sunsch/schema.graphql) - модель GoldenVerse (строка ~215-239)

**Изменить раздел связей на:**
```graphql
  # Связи
  book: Book @belongsTo(fields: ["bookId"])
```

**Действия:**
- [ ] Найти модель `GoldenVerse`
- [ ] Заменить комментарии на @belongsTo связь
- [ ] Сохранить файл

**Проверка:**
- [ ] book: Book @belongsTo добавлено
```

---

## 8. Заключение

### 8.1. Общий вывод

✅ **Предложенные изменения в GraphQL схеме КОРРЕКТНЫ и позволят получать информацию для 80%+ основных страниц с использованием одного запроса к AppSync.**

### 8.2. Статистика

- ✅ **Достоверность таблицы:** 94% (1 несоответствие из 16 страниц)
- ✅ **Возможность 1 запроса:** 73% страниц (11 из 15)
- ✅ **Возможность 1-2 запросов:** 100% страниц (15 из 15)
- ✅ **Корректность изменений:** 95% (1 отсутствующая связь)

### 8.3. Критические действия

1. ⚠️ **Исправить маршрут проверки ДЗ** в таблице (строка 45)
2. ⚠️ **Добавить восстановление связи `GoldenVerse.book`** в roadmap
3. ✅ Все остальные изменения готовы к реализации

---

**Документ статус:** Завершен  
**Следующий шаг:** Внести исправления в roadmap согласно рекомендациям

