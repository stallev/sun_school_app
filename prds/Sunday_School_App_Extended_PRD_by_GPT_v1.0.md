# Sunday School App — Extended PRD (v1.0)

**Автор:** Alexandr Levshenko & ChatGPT (GPT-5)  
**Дата:** 30 октября 2025  
**Формат:** Markdown (Complete Extended PRD — Public, Private, Dashboard)

---
## Содержание
1. [Введение](#введение)  
2. [Цели и задачи проекта](#цели-и-задачи-проекта)  
3. [Архитектура и структура приложения](#архитектура-и-структура-приложения)  
4. [Public Pages](/auth, /not-found)  
5. [Private Pages](/grade-data, /year-lessons-list, /grade-data-settings, /new-lesson, /edit-lesson, /lesson-data, /lesson-data-all, /checking-homework-all, /pupil-personal-data)  
6. [Dashboard Pages](/teachers, /grades-list, /pupils, /families)  
7. [Модель данных и API-структура]  
8. [Заключение]  

---

## 1. Введение
**Название проекта:** Sunday School App  
**Версия документа:** v1.0  
**Цель:** Создать веб-приложение для управления воскресной школой: учет учеников, преподавателей, уроков, оценок, семей и мотивационной системы.
**Принцип:** Приложение должно быть безопасным, расширяемым и удобным для преподавателей и администраторов.

---
## 2. Цели и задачи проекта

### Основная цель
Создать удобную цифровую платформу для управления воскресной школой, предоставляющую функционал для учителей, родителей и администраторов.

### Задачи (кратко)
- Управление группами, уроками и годами обучения.  
- Управление учениками, семьями, преподавателями.  
- Ведение результатов по урокам (тест, тетрадь, золотые стихи, посещение спевки, поведение).  
- Мотивация детей через визуальную систему наград (кирпичики, домики).  
- Контроль доступа по ролям (pupil, parent, teacher, admin, superadmin).

---
## 3. Архитектура и структура приложения

### Технологический стек
- Frontend: React 19+, TypeScript.  
- State management: Zustand.  
- Data fetching / caching: React Query.  
- ORM / Backend: Prisma + PostgreSQL.  
- Auth: AuthJS (JWT).  
- UI: Shadcn/ui (Tailwind).  
- Архитектура: FSD (Feature-Sliced Design) + Atomic Design.

### Файловая структура (FSD + Atomic)
```
src/
├── app/              # Pages / routes (public / private / dashboard)
├── processes/        # Auth providers, api client, react-query setup
├── pages/            # Page containers (Page level)
├── widgets/          # Reusable widgets (card lists, lesson-table)
├── entities/         # Pupil, Teacher, Lesson, Grade, Family, GoldenVerse
├── features/         # feature-level logic (lesson-create, homework-check)
├── shared/           # ui atoms, lib, api, store (zustand)
└── styles/
```

### Роли и разрешения
- **pupil** — просмотр собственных данных.  
- **parent** — просмотр данных своих детей.  
- **teacher** — CRUD по урокам своей группы, проверка ДЗ.  
- **admin** — CRUD по всем сущностям (группы, ученики, учителя, семьи).  
- **superadmin** — полный доступ, управление ролями.

### Принципы безопасности
- Все API защищены middleware, проверяющим JWT и роль.  
- Критические операции (удаление, деактивация) требуют подтверждения.  
- Хранение аватаров и файлов в защищённом хранилище (Supabase Storage или S3).

---
## 4. Public Pages

### 4.1 /auth — Login / SignUp
**Цель:** Безопасная аутентификация и регистрация.
**UX:** Вкладки Login / SignUp, OAuth (опционально), redirect по роли после входа.

**Wireframe (ASCII):**
```
-----------------------------------------------------
|                 Sunday School App                 |
-----------------------------------------------------
| [ Tabs: Login | Sign Up ]                         |
| [ Email input ]                                   |
| [ Password input ]                                |
| [ Remember me ] [ Login Button ]                  |
| [ OAuth: Google ]                                 |
-----------------------------------------------------
```

**Shadcn компоненты:** `Card`, `Tabs`, `Input`, `Button`, `Checkbox`, `Alert`.

**Zustand Store (пример):**
```ts
// useAuthFormStore.ts
export const useAuthFormStore = create((set,get)=>({ mode:'login', email:'', password:'', loading:false, switchMode:(m)=>set({mode:m}), submit: async ()=>{/* call authService */}}));
```

**Redirect rules:** teacher -> /grade-data, admin/superadmin -> /dashboard, pupil -> /pupil-personal-data.

---
### 4.2 /not-found — 404 Page
**Цель:** Понятный UX при несуществующем маршруте.
**Wireframe:** простая карточка с кнопками назад и на страницу входа.
**Компоненты:** `Card`, `Button`, `Typography`.

---
## 5. Private Pages

> Доступ: teacher, admin, superadmin (в зависимости от действия — teacher ограничен своей группой)

### 5.1 /grade-data — Страница группы (список учебных годов)
**Цель:** Выбор учебного года, навигация к списку уроков.
**Wireframe:**
```
-------------------------------------------------------------
| Group: "9–10 лет"                                         |
| [2022–2023] [Edit] [Delete]                               |
| [2023–2024] [Edit] [Delete]                               |
| [+] Добавить учебный год                                  |
-------------------------------------------------------------
```

**Store (useGradeStore):** years, fetchYears, addYear, removeYear.

---
### 5.2 /year-lessons-list — Список уроков за учебный год
**Цель:** Просмотр, создание, редактирование, удаление уроков.
**Wireframe:**
```
-------------------------------------------------------------
| Уроки за 2023–2024                                         |
| [#1 | Тема | 14.09.2024 ] [Edit] [Delete]                 |
| [+] Добавить новый урок                                    |
-------------------------------------------------------------
```

**Компоненты:** `Table`, `Button`, `Dialog`, `Badge`.

**Store:** useLessonStore — lessons[], fetchLessons(yearId), deleteLesson(id).

---
### 5.3 /grade-data-settings — Настройка критериев оценки
**Цель:** Включение/выключение метрик оценки (goldenVerse, test, choir, notebook, behavior).
**Wireframe:**
```
[✓] Golden Verse
[✓] Test
[✓] Choir
[ ] Notebook
[✓] Behavior
[ Save ]
```

**Store:** useSettingsStore — settings, updateSetting.

---
### 5.4 /new-lesson — Создание урока
**Поля:** title, date, teacher, goldenVerses[].
**Wireframe:**
```
Тема: [____]
Дата: [____]
Преподаватель: [Select]
Золотые стихи: [ + Add ]
[ Save ] [ Cancel ]
```

**Store:** useNewLessonStore (form state, addGoldenVerse, saveLesson).

---
### 5.5 /edit-lesson — Редактирование урока
**Похожие поля**, возможность удалить отдельный goldenVerse.
**Store:** useEditLessonStore (lesson, updateField, saveChanges).

---
### 5.6 /lesson-data — Карточка урока (краткая сводка + переходы)
**Поля:** title, date, teacher, pupilsCount, avgTest, avgGoldenVerse.
**Кнопки:** Open full table, Check homework.
**Store:** useLessonSummaryStore (fetchSummary).

---
### 5.7 /lesson-data-all — Полная сводная таблица урока
**Таблица:** Перечень всех учеников и их показателей за урок (attendance, goldenVerse, test, notebook, behavior).
**Wireframe:**
```
№ | Ученик | Зол.стих | Тест | Тетрадь | Поведение
1 | Иванов | 2        | 9    | 5       | Хорошее
```

**Store:** useLessonDataStore (rows[], fetchData).

---
### 5.8 /checking-homework-all — Режим интерактивной проверки ДЗ
**UX:** Пошаговая проверка: список учеников слева/наверху, форма для ввода показателей текущего ученика.
**Wireframe (single pupil):**
```
Иванов П.
Attendance: [✓]
GoldenVerse1: [2/1/0]
GoldenVerse2: [2/1/0]
Choir: [✓]
Notebook: [10]
Test: [8]
[ Save ] [ Next ]
```

**Store:** useHomeworkCheckStore (current, nextPupil, saveCheck).

---
### 5.9 /pupil-personal-data — Профиль ученика
**Содержит:** Общая информация, история оценок по урокам, свод по годам.
**Wireframe:**
```
Профиль: Иванов П.
Age: 10, Group: 9-10
History table...
[Edit profile]
```

**Store:** usePupilStore (pupil, fetchPupil, updatePupil).

---
## 6. Dashboard Pages (Admin / Superadmin)

### 6.1 /teachers — Список преподавателей
**Wireframe:**
```
[ + Add teacher ]
[Avatar] Иванова Н. | Группа: 9-10 | [Edit] [Deactivate]
```

**Modal form:** avatar upload, fullName, grade selection.
**Store:** useTeacherStore (teachers[], fetch, add, update, deactivate).

---
### 6.2 /grades-list — Список групп
**Wireframe:**
```
[ + Add grade ]
[ Card ] Group title | Teacher | PupilsCount | [Edit] [Deactivate]
```

**Store:** useGradesListStore (grades[], fetchGrades, addGrade).

---
### 6.3 /pupils — Список учеников
**Wireframe:**
```
[ + Add pupil ]
[Avatar] Иванов П. | Age: 10 | Group: 9-10 | [Edit] [Deactivate]
```

**Store:** usePupilsListStore (pupils[], fetch, add, update, deactivate).

---
### 6.4 /families — Список семей
**Wireframe:**
```
[ + Add family ]
Ивановы A. и M. | Children: Иванов П. (9 y) | [Edit]
```

**Store:** useFamilyStore (families[], fetch, add).

---
## 7. Модель данных и API-структура

### 7.1 ER диаграмма (текстовая)
```
Family 1─* Pupil *─1 Grade
Grade 1─* Lesson 1─* GoldenVerse
Lesson *─* LessonMark (pupil results)
Teacher linked to Grade / Lesson
```

### 7.2 Prisma schema (key models)
```prisma
model Family { id String @id @default(cuid()) fatherName String motherName String phoneFather String phoneMother String pupils Pupil[] }
model Teacher { id String @id @default(cuid()) name String avatar String? gradeId String? active Boolean @default(true) }
model Grade { id String @id @default(cuid()) title String ageRange String? pupils Pupil[] lessons Lesson[] active Boolean @default(true) }
model Pupil { id String @id @default(cuid()) name String age Int avatar String? gradeId String? familyId String? marks LessonMark[] }
model Lesson { id String @id @default(cuid()) title String date DateTime gradeId String? teacherId String? goldenVerses GoldenVerse[] marks LessonMark[] }
model GoldenVerse { id String @id @default(cuid()) reference String text String lessonId String }
model LessonMark { id String @id @default(cuid()) lessonId String pupilId String attendance Boolean testScore Int notebookScore Int goldenVerseScore Int behavior String choir Boolean }
```

### 7.3 REST API (пример)
- `GET /api/pupils` — list pupils  
- `GET /api/pupils/:id` — pupil data  
- `POST /api/pupils` — create pupil  
- `PATCH /api/pupils/:id` — update pupil  
- `DELETE /api/pupils/:id` — deactivate pupil  
- `GET /api/lessons?grade=:id` — lessons by grade  
- `POST /api/lessons` — create lesson  
- `POST /api/lesson/:id/check` — submit homework check

### 7.4 React Query example
```ts
export const useLessons = (gradeId) => useQuery(['lessons',gradeId],()=>axios.get(`/api/lessons?grade=${gradeId}`).then(r=>r.data));
```

### 7.5 Security & RBAC
- Middleware проверяет JWT и role.  
- Teachers only see grades/lessons assigned to them.  
- Admins have broader access; superadmin — полный.

---
## 8. Заключение и дальнейшие шаги

### Что сделано
- Полный PRD (Public, Private, Dashboard).  
- Wireframes (ASCII) для всех страниц.  
- Примеры Zustand stores для ключевых функций.  
- Shadcn/ui компоненты, описанные для каждой страницы.  
- ER модель и пример Prisma схемы.  
- Примеры API и React Query.

### Предложения для следующего шага (recommended)
1. Добавить детальную спецификацию API (OpenAPI/Swagger).  
2. Разработать систему расчёта баллов (motivation system) и визуализацию «домика».  
3. Создать прототипы в Figma / Miro.  
4. Настроить CI/CD и окружения (dev/staging/prod).

---
**Конец документа.**
