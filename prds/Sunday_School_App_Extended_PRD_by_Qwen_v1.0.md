Отлично. Ниже представлено **расширенное Product Requirements Document (PRD)** для **Sunday School App**, оформленное в формате Markdown. Документ включает:

- Цели и пользовательские роли  
- Структуру приложения (Public / Private / Dashboard)  
- Функциональные требования по каждой странице  
- Модель данных (без системы баллов, согласно указанию)  
- Технические требования и архитектурные решения  
- UX/UI-описания (wireframes в текстовом виде)

---

# Sunday School App — Extended Product Requirements Document (PRD)

## 1. Общая цель приложения

Приложение предназначено для цифровизации процессов воскресной школы в баптистской церкви:

- Учет посещаемости, выполнения домашних заданий, заучивания золотых стихов  
- Управление списками учеников, семей, преподавателей и групп  
- Обеспечение прозрачного и удобного интерфейса для преподавателей и администраторов  
- Поддержка мотивационной системы (в будущем — через систему баллов)

> **Примечание**: Система расчёта баллов **не включена** в текущую спецификацию и будет реализована на следующем этапе.

---

## 2. Пользовательские роли и права доступа

| Роль           | Доступ к страницам                                                                                   | Описание |
|----------------|------------------------------------------------------------------------------------------------------|----------|
| `pupil`        | Нет доступа к Private/Dashboard (в MVP не используется)                                              | Ученик воскресной школы |
| `parent`       | Только просмотр `/pupil-personal-data` своего ребёнка (в MVP — не реализовано)                        | Родитель ученика |
| `teacher`      | `/grade-data`, `/year-lessons-list`, `/lesson-data`, `/lesson-data-all`, `/checking-homework-all`, `/pupil-personal-data` | Преподаватель конкретной группы |
| `admin`        | Все Private Pages + `/teachers`, `/grades-list`, `/pupils`, `/families`                               | Администратор воскресной школы |
| `superadmin`   | То же, что `admin`, плюс возможность управлять ролями и настройками системы (в MVP — не реализовано) | Главный администратор |

> **MVP-ограничение**: Поддержка ролей `parent` и `superadmin` отложена. В MVP реализуются только `teacher` и `admin`.

---

## 3. Структура приложения

### 3.1 Public Pages

| Путь           | Назначение                              |
|----------------|-----------------------------------------|
| `/auth`        | Страница входа и регистрации            |
| `/not-found`   | Страница 404                            |

### 3.2 Private Pages (доступны после аутентификации)

| Путь                     | Назначение |
|--------------------------|-----------|
| `/grade-data`            | Список учебных годов для выбранной группы |
| `/year-lessons-list`     | Список уроков за выбранный учебный год с действиями (редактировать/удалить/создать) |
| `/grade-data-settings`   | Настройка видимости параметров оценки (золотые стихи, спевка, тетрадь, тест) для группы |
| `/new-lesson`            | Форма создания нового урока |
| `/edit-lesson`           | Форма редактирования существующего урока |
| `/lesson-data`           | Главная страница урока: кнопки перехода к `/lesson-data-all` и `/checking-homework-all` |
| `/lesson-data-all`       | Полная сводная таблица по уроку (все ученики, все параметры) |
| `/checking-homework-all` | Интерфейс массовой проверки ДЗ: список учеников → модалка ввода данных |
| `/pupil-personal-data`   | Полная история ученика по всем урокам с возможностью редактирования |

### 3.3 Dashboard Pages (только для `admin` и `teacher`)

| Путь           | Назначение |
|----------------|-----------|
| `/teachers`    | Управление преподавателями |
| `/grades-list` | Управление группами (grades) |
| `/pupils`      | Управление учениками |
| `/families`    | Управление семьями |

---

## 4. Функциональные требования по страницам

### 4.1 Public Pages

#### `/auth`
- Форма входа с email и паролем
- Форма регистрации (только для `admin` или через приглашение — в MVP: только вход)
- Защита от неавторизованного доступа ко всем Private/Dashboard страницам

#### `/not-found`
- Стандартная 404-страница с кнопкой «На главную» (редирект на `/auth`)

---

### 4.2 Private Pages

#### `/grade-data`
- Выбор группы (grade) происходит через `/grades-list` → редирект с `gradeId`
- Отображается список учебных годов (например, 2024–2025, 2025–2026)
- Каждый год — ссылка на `/year-lessons-list?gradeId=...&year=...`
- Кнопка «Настройки группы» → `/grade-data-settings`

#### `/year-lessons-list`
- Заголовок: «Уроки группы [Название] за 2025–2026»
- Список уроков: дата, тема, ответственный преподаватель
- Для каждого урока: кнопки **Редактировать** → `/edit-lesson?id=...`, **Удалить**
- Кнопка **+ Новый урок** → `/new-lesson?gradeId=...&year=...`

#### `/grade-data-settings`
- Чекбоксы для включения/отключения следующих параметров:
  - Золотые стихи
  - Посещение спевки
  - Оценка за тетрадь
  - Оценка за тест
- Сохранение настроек привязано к `gradeId`

#### `/new-lesson`
- Поля:
  - Дата урока (date)
  - Тема урока (string)
  - Ответственный преподаватель (select из списка активных teachers)
  - Список золотых стихов (массив `GoldenVerse` с возможностью добавления/удаления)
- Кнопка «Сохранить» → создаёт запись в `Lesson`

#### `/edit-lesson`
- То же, что `/new-lesson`, но с предзаполненными данными
- Возможность удалить урок

#### `/lesson-data`
- Кнопки:
  - «Сводная таблица» → `/lesson-data-all`
  - «Проверка ДЗ» → `/checking-homework-all`
- Информация о дате, теме, преподавателе

#### `/lesson-data-all`
- Таблица:
  - Столбцы: ФИО ученика, присутствие, золотые стихи (3 поля), спевка, тетрадь, тест
  - Только для чтения (в MVP)
- Экспорт в CSV (опционально, не в MVP)

#### `/checking-homework-all`
- Вертикальный список учеников (только из текущей группы)
- При клике на ученика → модальное окно с полями:
  - Присутствие: checkbox
  - Золотые стихи: 3 поля с оценками (0, 1, 2 балла — в MVP: просто числа)
  - Спевка: checkbox
  - Оценка за тетрадь: number (0–10)
  - Оценка за тест: number (0–10)
- Сохранение обновляет запись в `LessonAttendance` или аналогичной сущности

#### `/pupil-personal-data`
- Информация о ребёнке: ФИО, дата рождения, семья
- Таблица всех уроков с оценками по каждому параметру
- Возможность редактировать любую запись (через модалку, как в `/checking-homework-all`)

---

### 4.3 Dashboard Pages

#### `/teachers`
- Карточки: фото, ФИО, группа
- Кнопки: **Редактировать**, **Деактивировать**
- Кнопка **+ Новый преподаватель** → модалка с полями:
  - ФИО
  - Аватар (опционально)
  - Привязка к группе (grade)

#### `/grades-list`
- Карточки: название группы, возрастной диапазон, количество учеников
- Кнопки: **Редактировать**, **Деактивировать**
- Кнопка **+ Новая группа** → модалка:
  - Название
  - Возраст (например, «6–8 лет»)
  - Список учеников (множественный выбор из `/pupils`)
  - Список преподавателей (множественный выбор из `/teachers`)

#### `/pupils`
- Карточки: фото, ФИО, дата рождения, семья
- Кнопки: **Редактировать**, **Деактивировать**
- Кнопка **+ Новый ученик** → модалка:
  - ФИО
  - Дата рождения
  - Семья (select из `/families`)
  - Аватар (опционально)

#### `/families`
- Карточки: «Семья [Фамилия]», телефоны родителей
- Кнопки: **Редактировать**, **Деактивировать**
- Кнопка **+ Новая семья** → модалка:
  - ФИО отца
  - ФИО матери
  - Телефон отца
  - Телефон матери

---

## 5. Модель данных (Prisma Schema — основные сущности)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  role      Role     @default(TEACHER)
  teacher   Teacher?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  PUPIL
  PARENT
  TEACHER
  ADMIN
  SUPERADMIN
}

model Teacher {
  id        String   @id @default(cuid())
  fullName  String
  avatar    String?
  isActive  Boolean  @default(true)
  grade     Grade?   @relation(fields: [gradeId], references: [id])
  gradeId   String?
  user      User?    @relation(fields: [userId], references: [id])
  userId    String?  @unique
}

model Grade {
  id          String    @id @default(cuid())
  name        String    // e.g., "Младшая группа"
  ageRange    String    // e.g., "6–8 лет"
  isActive    Boolean   @default(true)
  pupils      Pupil[]
  teachers    Teacher[]
  lessons     Lesson[]
  settings    GradeSettings @relation(fields: [settingsId], references: [id])
  settingsId  String    @unique
}

model GradeSettings {
  id               String   @id @default(cuid())
  showGoldenVerses Boolean  @default(true)
  showChoir        Boolean  @default(true)
  showNotebook     Boolean  @default(true)
  showTest         Boolean  @default(true)
}

model Pupil {
  id        String   @id @default(cuid())
  fullName  String
  birthDate DateTime
  avatar    String?
  isActive  Boolean  @default(true)
  family    Family   @relation(fields: [familyId], references: [id])
  familyId  String
  grade     Grade    @relation(fields: [gradeId], references: [id])
  gradeId   String
  attendances LessonAttendance[]
}

model Family {
  id       String   @id @default(cuid())
  fatherName String
  motherName String
  fatherPhone String
  motherPhone String
  pupils   Pupil[]
}

model Lesson {
  id          String    @id @default(cuid())
  date        DateTime
  topic       String
  grade       Grade     @relation(fields: [gradeId], references: [id])
  gradeId     String
  teacher     Teacher   @relation(fields: [teacherId], references: [id])
  teacherId   String
  goldenVerses GoldenVerse[]
  attendances LessonAttendance[]
}

model GoldenVerse {
  id        String @id @default(cuid())
  reference String // e.g., "Ин. 3:16"
  text      String
  lesson    Lesson @relation(fields: [lessonId], references: [id])
  lessonId  String
}

model LessonAttendance {
  id           String   @id @default(cuid())
  pupil        Pupil    @relation(fields: [pupilId], references: [id])
  pupilId      String
  lesson       Lesson   @relation(fields: [lessonId], references: [id])
  lessonId     String
  present      Boolean  @default(false)
  choirPresent Boolean  @default(false)
  notebookScore Int?    // 0–10
  testScore    Int?     // 0–10
  verse1Score  Int?     // 0,1,2
  verse2Score  Int?
  verse3Score  Int?

  @@unique([pupilId, lessonId])
}
```

> **Примечание**: Связи `User ↔ Teacher` позволяют использовать Auth.js для аутентификации.

---

## 6. Технические требования

### Стек
- **Frontend**: React 19+, TypeScript, Vite
- **UI**: shadcn/ui + Tailwind CSS
- **State**: Zustand (глобальное состояние), React Query (серверное состояние)
- **Routing**: Next.js App Router (или React Router v6, если SPA)
- **Auth**: Auth.js (Credentials + Email/Password)
- **Backend**: Next.js API Routes или отдельный Express/NestJS (в MVP — API Routes)
- **ORM**: Prisma
- **DB**: PostgreSQL
- **Архитектура**: Feature-Sliced Design (FSD) + Atomic Design (atoms, molecules, organisms)

### Безопасность
- Пароли хэшируются (bcrypt)
- Защита маршрутов через middleware (на основе роли)
- Валидация всех форм на клиенте и сервере (Zod)

### Локализация
- Поддержка русского языка (в MVP — только ru)

---

## 7. UX/UI Wireframes (текстовое описание)

> Все страницы следуют единому стилю: шапка с логотипом и выходом, боковое меню (для Dashboard), карточки с тенью, кнопки с иконками.

### Пример: `/checking-homework-all`
```
[Header: "Проверка ДЗ — Урок от 25.10.2025"]
[Список учеников]
- [Иванов Иван] → клик → модалка:
  [ ] Присутствовал
  [ ] Был на спевке
  Золотой стих 1: [2] (select: 0/1/2)
  Золотой стих 2: [1]
  Золотой стих 3: [0]
  Тетрадь: [8]
  Тест: [9]
  [Сохранить] [Отмена]
```

### Пример: `/teachers`
```
[Кнопка: + Новый преподаватель]
[Карточка 1]
  [Аватар]
  Иванова Мария
  Группа: Средняя (9–11 лет)
  [Редактировать] [Деактивировать]
```

(Аналогично для `/pupils`, `/families`, `/grades-list`)

---

## 8. Дальнейшие шаги (после MVP)

- Реализация системы баллов и визуализации прогресса
- Поддержка роли `parent` с ограниченным доступом
- Уведомления (Telegram/email) о предстоящих уроках
- Экспорт отчётов в PDF/CSV
- Мобильная адаптация (PWA)
