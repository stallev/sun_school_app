# Sunday School App — Master PRD v2.0
**Усовершенствованная спецификация на основе анализа Claude, GPT и Qwen версий**

**Дата:** 30 октября 2025  
**Автор:** AI Master Specification (объединение лучших практик)  
**Статус:** Production-Ready

---

## Содержание
1. [Executive Summary](#1-executive-summary)
2. [Technical Foundation](#2-technical-foundation)
3. [Information Architecture](#3-information-architecture)
4. [Data Model](#4-data-model)
5. [Feature Requirements](#5-feature-requirements)
6. [Security & Validation](#6-security--validation)
7. [State Management & API](#7-state-management--api)
8. [Development Roadmap](#8-development-roadmap)

---

## 1. Executive Summary

### 1.1 Обзор продукта
Sunday School App — веб-приложение для автоматизации процессов воскресной школы баптистской церкви, обеспечивающее:
- Управление учениками, преподавателями, группами и семьями
- Отслеживание посещаемости и успеваемости
- Проверку домашних заданий и запоминания золотых стихов
- **Систему мотивации с баллами, достижениями и визуализацией прогресса**
- Прозрачность учебного процесса для всех участников

### 1.2 Целевые пользователи и роли

| Роль | Описание | Основные возможности |
|------|----------|---------------------|
| **Teacher** | Преподаватель группы | Управление уроками своей группы, проверка ДЗ, просмотр данных учеников |
| **Admin** | Администратор школы | Полный CRUD для всех сущностей, управление настройками |
| **Superadmin** | Главный администратор | Полный доступ + управление ролями (Post-MVP) |
| **Parent** | Родитель ученика | Просмотр данных своих детей (Post-MVP) |
| **Pupil** | Ученик | Просмотр собственных данных (Post-MVP) |

### 1.3 Ключевые цели MVP
- ✅ Автоматизация учёта успеваемости и посещаемости
- ✅ Упрощение процесса проверки домашних заданий
- ✅ Централизованное хранение данных
- ✅ Реализация ролевого доступа (Teacher, Admin)
- ✅ **Система мотивации с баллами, достижениями и игрофикацией**

---

## 2. Technical Foundation

### 2.1 Технологический стек

```
Frontend:
├── Framework: Next.js 14+ (App Router, React 19) с TypeScript
├── UI: Shadcn UI + Tailwind CSS
├── Routing: Next.js App Router (file-based)
├── State: Zustand (global) + React Query (server)
└── Build: Next.js build pipeline (Turbopack/webpack)

Backend:
├── Runtime: Node.js
├── Framework: Next.js API Routes (Route Handlers)
├── ORM: Prisma
├── Database: PostgreSQL
└── Auth: Auth.js (NextAuth.js)
```

### 2.2 Архитектура: Feature-Sliced Design + Atomic Design

```
src/
├── app/                          # Application layer
│   ├── providers/                # App-level providers
│   │   ├── AuthProvider.tsx     # Authentication context
│   │   ├── QueryProvider.tsx    # React Query setup
│   │   └── ThemeProvider.tsx    # Theme context
│   ├── router/                   # Routing configuration
│   │   ├── AppRouter.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── routes.ts
│   └── App.tsx
│
├── pages/                        # Page-level components
│   ├── auth/                     # Public
│   │   └── AuthPage.tsx
│   ├── grades/
│   │   └── [gradeId]/
│   │       ├── GradeDataPage.tsx
│   │       ├── GradeSettingsPage.tsx
│   │       ├── GradeSchedulePage.tsx
│   │       └── academic-years/
│   │           └── [yearId]/
│   │               ├── YearLessonsListPage.tsx
│   │               └── LessonsArchivePage.tsx
│   ├── lessons/
│   │   └── [lessonId]/
│   │       ├── LessonOverviewPage.tsx
│   │       ├── EditLessonPage.tsx
│   │       ├── CompleteTablePage.tsx
│   │       └── CheckingHomeworkPage.tsx
│   ├── pupil-personal-data/
│   │   └── PupilPersonalDataPage.tsx
│   └── dashboard/                # Dashboard
│       ├── teachers/
│       ├── grades-list/
│       ├── pupils/
│       └── families/
│
├── widgets/                      # Complex UI blocks
│   ├── Header/
│   │   └── Header.tsx
│   ├── Sidebar/
│   │   └── Sidebar.tsx
│   ├── LessonTable/
│   │   └── LessonTable.tsx
│   ├── HomeworkCheckModal/
│   │   └── HomeworkCheckModal.tsx
│   └── EntityCard/
│       └── EntityCard.tsx
│
├── features/                     # Business features
│   ├── auth/
│   │   ├── login/
│   │   │   ├── ui/
│   │   │   ├── model/
│   │   │   └── api/
│   │   └── signup/
│   ├── lesson-management/
│   │   ├── create-lesson/
│   │   ├── lesson-management/
│   │   └── delete-lesson/
│   ├── homework-check/
│   │   └── check-pupil-homework/
│   └── entity-management/
│       ├── manage-teachers/
│       ├── manage-pupils/
│       └── manage-families/
│
├── entities/                     # Domain entities
│   ├── user/
│   │   ├── model/               # Types, stores
│   │   ├── ui/                  # Entity-specific UI
│   │   └── api/                 # Entity API calls
│   ├── teacher/
│   ├── pupil/
│   ├── grade/
│   ├── lesson/
│   ├── family/
│   ├── golden-verse/
│   └── lesson-record/
│
├── shared/                       # Shared resources
│   ├── ui/                      # Atomic design components
│   │   ├── atoms/
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Label/
│   │   │   ├── Badge/
│   │   │   ├── Avatar/
│   │   │   ├── Checkbox/
│   │   │   ├── Select/
│   │   │   └── DatePicker/
│   │   ├── molecules/
│   │   │   ├── FormField/
│   │   │   ├── SearchBar/
│   │   │   ├── Card/
│   │   │   ├── Breadcrumb/
│   │   │   └── ScoreSelector/
│   │   └── organisms/
│   │       ├── Modal/
│   │       ├── DataTable/
│   │       ├── Form/
│   │       ├── Navigation/
│   │       └── ConfirmDialog/
│   ├── api/                     # API client
│   │   ├── client.ts
│   │   └── endpoints.ts
│   ├── lib/                     # Utilities
│   │   ├── utils.ts
│   │   ├── validators.ts
│   │   └── formatters.ts
│   ├── hooks/                   # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useModal.ts
│   │   └── useDebounce.ts
│   ├── store/                   # Zustand stores
│   │   ├── authStore.ts
│   │   ├── uiStore.ts
│   │   └── modalStore.ts
│   ├── constants/
│   │   ├── routes.ts
│   │   ├── roles.ts
│   │   └── bibleBooks.ts  // BIBLE_BOOKS_SHORT_NAMES constant
│   └── types/
│       └── index.ts
│
└── styles/
    └── globals.css
```

**Ключевые принципы:**
- ✅ Однонаправленный поток зависимостей (снизу вверх)
- ✅ Shared не зависит ни от чего
- ✅ Entities не зависят от features
- ✅ Features могут использовать entities
- ✅ Widgets могут использовать features и entities
- ✅ Pages используют всё нижележащее

---

## 3. Information Architecture

### 3.1 Карта сайта

```
/
├── 📂 Public Routes (unauthenticated)
│   ├── /auth                    # Login/Signup page
│   └── /not-found               # 404 page
│
├── 📂 Private Routes (authenticated: teacher, admin)
│   ├── /grades/:gradeId         # Academic years list for grade
│   │   # Breadcrumb: Главная > Группы > [Название группы]
│   │   # Note: Teacher uses /grades/my → redirects to /grades/:actualGradeId
│   ├── /grades/:gradeId/settings # Grade assessment settings
│   │   # Breadcrumb: Главная > Группы > [Группа] > Настройки
│   ├── /grades/:gradeId/schedule # Grade schedule calendar
│   │   # Breadcrumb: Главная > Группы > [Группа] > Расписание
│   ├── /grades/:gradeId/academic-years/:yearId/lessons  # Lessons list for academic year
│   │   # Breadcrumb: Главная > Группы > [Группа] > [Учебный год]
│   ├── /grades/:gradeId/academic-years/:yearId/lessons/archive  # Archive lessons
│   │   # Breadcrumb: Главная > Группы > [Группа] > [Учебный год] > Архив уроков
│   ├── /new-lesson              # Create new lesson
│   │   # Breadcrumb: Главная > Группы > [Группа] > [Учебный год] > Новый урок
│   ├── /lessons/:lessonId       # Lesson overview (hub page) - index route
│   │   # Breadcrumb: Главная > Группы > [Группа] > [Учебный год] > Урок #X
│   ├── /lessons/:lessonId/edit  # Edit existing lesson
│   │   # Breadcrumb: Главная > Группы > [Группа] > [Учебный год] > Редактировать урок #X
│   ├── /lessons/:lessonId/complete-table # Complete lesson table
│   │   # Breadcrumb: Главная > Группы > [Группа] > [Учебный год] > Урок #X > Сводная таблица
│   ├── /lessons/:lessonId/checking-homework # Homework checking interface
│   │   # Breadcrumb: Главная > Группы > [Группа] > [Учебный год] > Урок #X > Проверка
│   ├── /pupil-personal-data/:id # Pupil profile and history
│   │   # Breadcrumb: Главная > Ученики > [Имя ученика]
│   ├── /grade-leaderboard/:id   # Grade ranking & motivation
│   │   # Breadcrumb: Главная > Группы > [Группа] > Рейтинг
│   ├── /pupil-achievements/:id   # Pupil achievements page
│   │   # Breadcrumb: Главная > Ученики > [Имя ученика] > Достижения
│   ├── /golden-verses           # Golden verses list (teacher, admin)
│   │   # Breadcrumb: Главная > Золотые стихи
│   └── /golden-verses/statistics # Golden verses statistics (teacher, admin)
│       # Breadcrumb: Главная > Золотые стихи > Статистика
│
└── 📂 Dashboard Routes (admin only)
    ├── /teachers                # Teachers management
    │   # Breadcrumb: Dashboard > Преподаватели
    ├── /grades-list             # Grades management
    │   # Breadcrumb: Dashboard > Группы
    ├── /pupils                  # Pupils management
    │   # Breadcrumb: Dashboard > Ученики
    ├── /families                # Families management
    │   # Breadcrumb: Dashboard > Семьи
    ├── /school-process-management # School year management (global)
    │   # Breadcrumb: Dashboard > Управление учебным процессом
    └── /admin/lessons-archive    # Centralized lessons archive (admin only)
        # Breadcrumb: Dashboard > Архив уроков
```

### 3.2 User Flow

```
┌─────────────┐
│   Login     │
└──────┬──────┘
       │
       ├──────────────────────────────────────┐
       │                                      │
       ▼                                      ▼
┌─────────────────┐                  ┌──────────────┐
│  Teacher Flow   │                  │  Admin Flow  │
└────────┬────────┘                  └──────┬───────┘
         │                                  │
         ▼                                  ▼
   Select Grade                      Dashboard Menu
         │                          ┌────┬────┬────┐
         ▼                          │    │    │    │
   Academic Years        Teachers Grades Pupils Families
         │                     │     │     │      │
         ▼                     └─────┴─────┴──────┘
   Lessons List                       │
    ┌────┼────┐                       ▼
    │    │    │                   CRUD Operations
 Create Edit View
    │    │    │
    │    │    ├──► Lesson Overview
    │    │    │         │
    │    │    │    ┌────┴────┐
    │    │    │    │         │
    │    │    ▼    ▼         ▼
    │    │  Full Table  Check Homework
    │    │    │              │
    │    │    │              ▼
    │    │    │     Select Pupil → Modal
    │    │    │              │
    │    │    │              ▼
    │    │    │        Enter Scores
    │    │    │              │
    │    │    │              ▼
    │    │    └──────────► Save
    │    │
    │    └──► Edit Lesson Form
    │
    └──► Create Lesson Form
```

---

## 4. Data Model

### 4.1 ERD (Entity Relationship Diagram)

```
┌──────────┐
│   User   │ 1:1
│          ├──────────┐
│ - id     │          │
│ - email  │          ▼
│ - pass   │    ┌──────────┐
│ - role   │    │ Teacher  │ M:N
└──────────┘    │          ├──────┐
                │ - id     │      │
                │ - name   │      │
           ┌────┤ - avatar │      │
           │    └────┬─────┘      │
           │         │            │
           │         │ 1:N        │
           │         │            │
           │    ┌────▼─────┐      │
           │    │  Lesson  │      │
           │    │          │      │
           │    │ - id     │◄─────┘
           │    │ - topic  │ M:N
           │    │ - date   ├──────┐
           │    └────┬─────┘      │
           │         │            │
           │         │ 1:N        │
           │         │            │
           │    ┌────▼──────────┐ │
           │    │ LessonRecord  │ │
           │    │               │ │
           │    │ - attendance  │ │
           │    │ - verse1-3    │ │
           │    │ - test        │ │
           │    │ - notebook    │ │
           │    │ - rehearsal   │ │
           │    └────┬──────────┘ │
           │         │            │
           │         │ N:1        │
           │         │            │
           │    ┌────▼─────┐      │
           │    │  Pupil   │      │
           │    │          │      │
           │    │ - id     │      │
           │    │ - name   │      │
           │    │ - dob    │      │
           │    └────┬─────┘      │
           │         │            │
           │         │ N:1        │
           │         │            │
           │    ┌────▼─────┐      │
           │    │  Family  │      │
           │    │          │      │
           │    │ - father │      │
           │    │ - mother │      │
           │    │ - phones │      │
           │    └──────────┘      │
           │                      │
           │    ┌──────────────┐  │
           │    │ GoldenVerse  │◄─┘
           └───►│              │
         M:N    │ - reference  │
                │ - text       │
                └──────────────┘

┌──────────────┐
│    Grade     │ 1:1
│              ├──────┐
│ - id         │      │
│ - name       │      ▼
│ - ageRange   │ ┌────────────────┐
└───┬──────────┘ │ GradeSettings  │
    │            │                │
    │ 1:N        │ - showVerses   │
    │            │ - showTest     │
    ├────────────┤ - showNotebook │
    │            │ - showRehearsal│
    │            └────────────────┘
    │
    │ 1:N
    │
    ▼
┌──────────────┐
│ AcademicYear │
│              │
│ - year       │
│ - startDate  │
│ - endDate    │
└───┬──────────┘
    │
    │ 1:N
    │
    ▼
To Lesson
```

### 4.2 Полная Prisma Schema

```prisma
// ============================================
// USER & AUTHENTICATION
// ============================================

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String    // bcrypt hashed
  role          Role      @default(TEACHER)
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  teacher       Teacher?
  pupil         Pupil?
  families      Family[]  @relation("ParentUsers")
  
  @@index([email])
  @@index([role])
}

enum Role {
  PUPIL
  PARENT
  TEACHER
  ADMIN
  SUPERADMIN
}

// ============================================
// TEACHER
// ============================================

model Teacher {
  id            String    @id @default(cuid())
  userId        String    @unique
  firstName     String
  lastName      String
  middleName    String?
  avatar        String?   // URL to uploaded image
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  grades        Grade[]   @relation("GradeTeachers")  // M:N — может быть пустым массивом; назначение групп делается в /grades-list
  lessons       Lesson[]
  
  @@index([userId])
  @@index([isActive])
}

// ============================================
// GRADE (Group/Class)
// ============================================

model Grade {
  id            String    @id @default(cuid())
  name          String    @unique  // e.g., "Младшая группа"
  ageRange      String              // e.g., "6-8 лет"
  description   String?
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  teachers      Teacher[] @relation("GradeTeachers")  // M:N — один учитель может преподавать в нескольких группах
  pupils        Pupil[]
  academicYears AcademicYear[]
  settings      GradeSettings?
  scheduleEvents GradeEvent[]  // Calendar events for the grade
  
  @@index([name])
  @@index([isActive])
}

// ============================================
// GRADE SETTINGS
// ============================================

model GradeSettings {
  id                  String    @id @default(cuid())
  gradeId             String    @unique
  
  // Visibility toggles
  showGoldenVerses    Boolean   @default(true)
  showTestScore       Boolean   @default(true)
  showNotebookScore   Boolean   @default(true)
  showRehearsal       Boolean   @default(true)
  
  // Custom labels (optional)
  goldenVersesLabel   String?
  testScoreLabel      String?
  notebookScoreLabel  String?
  rehearsalLabel      String?
  
  updatedAt           DateTime  @updatedAt
  
  // Relations
  grade               Grade     @relation(fields: [gradeId], references: [id], onDelete: Cascade)
  
  @@index([gradeId])
}

// ============================================
// GRADE EVENT (Schedule/Calendar)
// ============================================

enum GradeEventType {
  LESSON           // Обычный урок
  OUTDOOR_EVENT    // Выездное мероприятие
  LESSON_SKIPPING  // Отмена урока
}

model GradeEvent {
  id            String         @id @default(cuid())
  gradeId       String
  date          DateTime       // Date of the event (without time, or with time if needed)
  eventType     GradeEventType
  title         String?        // Optional title (e.g., "Поездка в музей")
  description   String?        @db.Text  // Optional detailed description
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  createdBy     String?        // User ID who created the event
  
  // Relations
  grade         Grade          @relation(fields: [gradeId], references: [id], onDelete: Cascade)
  
  @@index([gradeId])
  @@index([date])
  @@index([eventType])
}

// ============================================
// PUPIL (Student)
// ============================================

model Pupil {
  id            String    @id @default(cuid())
  userId        String?   @unique  // Optional: for pupil accounts
  firstName     String
  lastName      String
  middleName    String?
  dateOfBirth   DateTime
  gender        String?   // Пол ученика (e.g., "Мужской", "Женский", "Другой")
  avatar        String?
  familyId      String
  gradeId       String
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  user          User?     @relation(fields: [userId], references: [id], onDelete: SetNull)
  family        Family    @relation(fields: [familyId], references: [id])
  grade         Grade     @relation(fields: [gradeId], references: [id])
  lessonRecords LessonRecord[]
  points        PupilPoints?
  achievements  PupilAchievement[]
  
  @@index([familyId])
  @@index([gradeId])
  @@index([userId])
  @@index([isActive])
}

// ============================================
// FAMILY
// ============================================

model Family {
  id                String    @id @default(cuid())
  fatherFirstName   String?
  fatherLastName    String?
  fatherPhone       String?
  fatherInitials    String?   // Например: "А.В." (инициалы отца)
  motherFirstName   String?
  motherLastName    String?
  motherPhone       String?
  motherInitials    String?   // Например: "Е.С." (инициалы матери)
  isActive          Boolean   @default(true)
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  // Relations
  pupils            Pupil[]
  parentUsers       User[]    @relation("ParentUsers")
  
  @@index([fatherLastName])
  @@index([motherLastName])
  @@index([fatherLastName, fatherInitials])
}

// ============================================
// ACADEMIC YEAR
// ============================================

model AcademicYear {
  id            String    @id @default(cuid())
  year          String    @unique // e.g., "2024-2025"
  startDate     DateTime
  endDate       DateTime
  status        AcademicYearStatus @default(ACTIVE)
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  lessons       Lesson[]
  pupilPoints   PupilPoints[]
  pupilAchievements PupilAchievement[]
  
  @@index([year])
  @@index([status])
  @@index([isActive])
}

enum AcademicYearStatus {
  ACTIVE
  FINISHED
}

// ============================================
// LESSON
// ============================================

enum LessonStatus {
  PUBLISHED
  ARCHIVED
  REQUESTED_FOR_RESTORE
}

model Lesson {
  id              String        @id @default(cuid())
  academicYearId  String
  gradeId         String
  lessonNumber    Int           // Sequential within academic year
  topic           String
  date            DateTime
  teacherId       String
  status          LessonStatus  @default(PUBLISHED)
  description     Json?         // RichText (BlockNote) payload, optional
  archivedAt      DateTime?
  archivedBy      String?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  
  // Relations
  academicYear    AcademicYear  @relation(fields: [academicYearId], references: [id], onDelete: Restrict)
  grade           Grade         @relation(fields: [gradeId], references: [id])
  teacher         Teacher       @relation(fields: [teacherId], references: [id])
  goldenVerses    GoldenVerse[] @relation("LessonGoldenVerses")  // 0-3 verses depending on GradeSettings.showGoldenVerses
  lessonRecords   LessonRecord[]
  
  // Business Rule:
  // - If grade.settings.showGoldenVerses = false: goldenVerses.length must be 0
  // - If grade.settings.showGoldenVerses = true: goldenVerses.length must be exactly 3
  // This is enforced at application level (validation), not at DB level
  
  @@unique([academicYearId, gradeId, lessonNumber])
  @@index([academicYearId])
  @@index([gradeId])
  @@index([teacherId])
  @@index([date])
  @@index([status])
}

// Rich text editor recommendation:
// Use @blocknote/shadcn + @blocknote/core to produce/stores JSON in Lesson.description

// ============================================
// GOLDEN VERSE
// ============================================

model GoldenVerse {
  id            String    @id @default(cuid())
  reference     Json      @unique  // { bookNumber: Int, chapter: Int, verse: Int }
  text          String    @db.Text // Full verse text
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  lessons       Lesson[]  @relation("LessonGoldenVerses")  // M:N - урок может иметь 0-3 стиха в зависимости от группы
  lessonRecordsAsVerse1  LessonRecord[] @relation("GoldenVerse1")
  lessonRecordsAsVerse2  LessonRecord[] @relation("GoldenVerse2")
  lessonRecordsAsVerse3  LessonRecord[] @relation("GoldenVerse3")
  
  @@index([reference])
}

// IMPORTANT: Golden Verses Usage Rules
// 1. Groups with showGoldenVerses = false: Lessons have 0 golden verses (not used)
// 2. Groups with showGoldenVerses = true: Lessons must have exactly 3 golden verses
// 3. Validation: Check GradeSettings.showGoldenVerses when creating/editing lessons
// 4. Statistics: Only calculate for groups with showGoldenVerses = true

// Reference structure example:
// {
//   "bookNumber": 43,  // John (Ин. = Ин. = 43rd book)
//   "chapter": 3,
//   "verse": 16
// }

// Helper function to format reference:
// formatReference({ bookNumber: 43, chapter: 3, verse: 16 }) => "Ин. 3:16"
// Uses BIBLE_BOOKS_SHORT_NAMES constant

// ============================================
// LESSON RECORD (Attendance & Scores)
// ============================================

model LessonRecord {
  id                  String    @id @default(cuid())
  lessonId            String
  pupilId             String
  
  // Attendance
  isPresent           Boolean   @default(true)
  
  // Golden Verses (optional - only if grade.settings.showGoldenVerses = true)
  // For groups without golden verses: all goldenVerse*Id = null, all scores = 0
  goldenVerse1Id      String?   // FK to GoldenVerse (for statistics, null if group doesn't use verses)
  goldenVerse1Score   Int       @default(0)  // 0, 1, or 2 points (always 0 if group doesn't use verses)
  goldenVerse2Id      String?   // FK to GoldenVerse (for statistics, null if group doesn't use verses)
  goldenVerse2Score   Int       @default(0)  // 0, 1, or 2 points (always 0 if group doesn't use verses)
  goldenVerse3Id      String?   // FK to GoldenVerse (for statistics, null if group doesn't use verses)
  goldenVerse3Score   Int       @default(0)  // 0, 1, or 2 points (always 0 if group doesn't use verses)
  
  // Homework
  testScore           Int       @default(0)  // 0-10 points
  notebookScore       Int       @default(0)  // 0-10 points
  
  // Additional
  attendedRehearsal   Boolean   @default(false)  // Посещение спевки
  
  // Points calculation (auto-calculated)
  totalPoints         Float     @default(0)  // Auto-calculated based on formula
  
  // Timestamps
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
  
  // Relations
  lesson              Lesson    @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  pupil               Pupil     @relation(fields: [pupilId], references: [id], onDelete: Cascade)
  goldenVerse1        GoldenVerse? @relation("GoldenVerse1", fields: [goldenVerse1Id], references: [id], onDelete: SetNull)
  goldenVerse2        GoldenVerse? @relation("GoldenVerse2", fields: [goldenVerse2Id], references: [id], onDelete: SetNull)
  goldenVerse3        GoldenVerse? @relation("GoldenVerse3", fields: [goldenVerse3Id], references: [id], onDelete: SetNull)
  
  @@unique([lessonId, pupilId])
  @@index([lessonId])
  @@index([pupilId])
  @@index([goldenVerse1Id])
  @@index([goldenVerse2Id])
  @@index([goldenVerse3Id])
}

// ============================================
// POINTS SYSTEM (Motivation v2.0)
// ============================================

model PupilPoints {
  id              String    @id @default(cuid())
  pupilId         String    @unique
  gradeId         String
  academicYearId  String
  
  // Points tracking
  totalPoints     Float     @default(0)  // All-time total
  currentPoints   Float     @default(0)  // Current academic year
  
  // Progress visualization (домики)
  bricks          Int       @default(0)  // 1 кирпичик = 1 балл
  floors          Int       @default(0)  // 10 кирпичиков = 1 этаж
  
  // Streaks
  currentStreak   Int       @default(0)  // Consecutive lessons attended
  bestStreak      Int       @default(0)  // Best streak ever
  
  // Statistics
  lessonsAttended Int       @default(0)
  perfectLessons  Int       @default(0)  // Lessons with max points
  
  // Timestamps
  updatedAt       DateTime  @updatedAt
  
  // Relations
  pupil           Pupil     @relation(fields: [pupilId], references: [id], onDelete: Cascade)
  grade           Grade     @relation(fields: [gradeId], references: [id])
  academicYear    AcademicYear @relation(fields: [academicYearId], references: [id])
  
  @@index([pupilId])
  @@index([gradeId])
  @@index([academicYearId])
  @@index([currentPoints])
}

// ============================================
// ACHIEVEMENTS (Badges)
// ============================================

enum AchievementType {
  // Лёгкие достижения (быстрый старт)
  FIRST_BRICK         // "Первый кирпичик" — набрать 1 балл
  FIRST_FLOOR         // "Первый этаж" — набрать 10 баллов
  FIRST_VERSE_PERFECT // "Первый идеальный стих" — любой стих на "2"
  THREE_VERSES_PERFECT_ONCE // "Три стиха идеально (разово)" — все 3 стиха на "2" в одном уроке
  GOOD_NOTEBOOK_ONCE  // "Хорошая тетрадь" — тетрадь ≥ 8
  GOOD_TEST_ONCE      // "Хороший тест" — тест ≥ 8
  THREE_ATTENDANCES   // "Первые 3 посещения" — посетить 3 урока
  FIVE_ATTENDANCES    // "Пять посещений" — посетить 5 уроков
  CHOIR_FIRST_TIME    // "Первая спевка" — впервые отметиться на спевке
  STREAK_TWO          // "Серия 2 урока" — 2 посещённых урока подряд
  
  // Основные достижения
  EXCELLENT_STUDENT   // "Отличник" - 5 уроков подряд с максимальным баллом
  PERFECT_ATTENDANCE  // "Без пропусков" - посетил все уроки месяца
  VERSE_MASTER        // "Знаток стихов" - 10 раз подряд все стихи на "2"
  DILIGENT_STUDENT    // "Прилежный" - средний балл за домашку > 9
  FIRST_LESSON        // "Первый урок" - посетил первый урок
  HOUSE_BUILDER       // "Строитель" - построил 1 дом (1000 баллов)
  CENTURY             // "Столетие" - набрал 100 баллов
  HALF_YEAR           // "Полгода" - посетил все уроки полугодия
}

model Achievement {
  id              String    @id @default(cuid())
  type            AchievementType @unique
  name            String    // "Отличник", "Без пропусков" etc.
  description     String    @db.Text
  icon            String    // emoji or icon name
  points          Int       @default(0)  // Bonus points for achievement
  
  // Relations
  pupilAchievements PupilAchievement[]
  
  @@index([type])
}

model PupilAchievement {
  id              String    @id @default(cuid())
  pupilId         String
  achievementId   String
  
  // When earned
  earnedAt        DateTime  @default(now())
  academicYearId  String
  
  // Context (optional)
  context         String?   @db.Text  // e.g., "За период: сентябрь 2024"
  
  // Relations
  pupil           Pupil     @relation(fields: [pupilId], references: [id], onDelete: Cascade)
  achievement     Achievement @relation(fields: [achievementId], references: [id])
  academicYear    AcademicYear @relation(fields: [academicYearId], references: [id])
  
  @@unique([pupilId, achievementId, academicYearId])
  @@index([pupilId])
  @@index([achievementId])
  @@index([earnedAt])
}

**Лёгкие достижения (критерии и проверка):**

| Код | Название | Критерий | Источник данных |
|-----|----------|----------|-----------------|
| FIRST_BRICK | Первый кирпичик | totalPoints ≥ 1 (any time) | PupilPoints.totalPoints |
| FIRST_FLOOR | Первый этаж | floors ≥ 1 (10 баллов) | calculateProgress(totalPoints) |
| FIRST_VERSE_PERFECT | Первый идеальный стих | любой из goldenVerseXScore == 2 | LessonRecord |
| THREE_VERSES_PERFECT_ONCE | Три стиха идеально (разово) | все три стиха == 2 в одном уроке | LessonRecord |
| GOOD_NOTEBOOK_ONCE | Хорошая тетрадь | notebookScore ≥ 8 | LessonRecord |
| GOOD_TEST_ONCE | Хороший тест | testScore ≥ 8 | LessonRecord |
| THREE_ATTENDANCES | Первые 3 посещения | lessonsAttended ≥ 3 | PupilPoints.lessonsAttended |
| FIVE_ATTENDANCES | Пять посещений | lessonsAttended ≥ 5 | PupilPoints.lessonsAttended |
| CHOIR_FIRST_TIME | Первая спевка | attendedRehearsal == true (любое занятие) | LessonRecord |
| STREAK_TWO | Серия 2 урока | currentStreak ≥ 2 | PupilPoints.currentStreak |

Проверка лёгких достижений выполняется вместе с пересчётом баллов после сохранения `LessonRecord` и при ночной переиндексации (batch job).

### 4.3 Ключевые индексы для производительности

```sql
-- Критически важные индексы (уже включены в схему выше):

-- User lookups
CREATE INDEX idx_user_email ON User(email);
CREATE INDEX idx_user_role ON User(role);

-- Lesson queries
CREATE INDEX idx_lesson_date ON Lesson(date);
CREATE INDEX idx_lesson_academic_year ON Lesson(academicYearId);
CREATE INDEX idx_lesson_teacher ON Lesson(teacherId);

-- Record queries
CREATE INDEX idx_lesson_record_lesson ON LessonRecord(lessonId);
CREATE INDEX idx_lesson_record_pupil ON LessonRecord(pupilId);

-- Pupil queries
CREATE INDEX idx_pupil_grade ON Pupil(gradeId);
CREATE INDEX idx_pupil_family ON Pupil(familyId);
CREATE INDEX idx_pupil_active ON Pupil(isActive);

-- Family queries
CREATE INDEX idx_family_father_name ON Family(fatherLastName);
CREATE INDEX idx_family_mother_name ON Family(motherLastName);

-- Points system queries
CREATE INDEX idx_pupil_points_current ON PupilPoints(currentPoints);
CREATE INDEX idx_pupil_points_pupil ON PupilPoints(pupilId);
CREATE INDEX idx_pupil_achievement_earned ON PupilAchievement(earnedAt);
```

### 4.4 Формула расчёта баллов (Points Calculation)

**Автоматический расчёт баллов за урок:**

```typescript
function calculateLessonPoints(record: LessonRecord, gradeSettings: GradeSettings): number {
  let points = 0;
  
  // Присутствие: 1 балл
  if (record.isPresent) {
    points += 1;
  }
  
  // Золотые стихи: 0/1/2 балла за каждый (максимум 6)
  // Note: For groups with showGoldenVerses = false, all scores are 0 (not counted)
  if (gradeSettings.showGoldenVerses) {
    points += record.goldenVerse1Score;  // 0, 1, or 2
    points += record.goldenVerse2Score;  // 0, 1, or 2
    points += record.goldenVerse3Score;  // 0, 1, or 2
  }
  
  // Тест: балл * 1 (максимум 10)
  points += record.testScore;  // 0-10
  
  // Тетрадь: балл * 0.5 (максимум 5)
  points += record.notebookScore * 0.5;  // 0-10 => 0-5
  
  // Спевка: 1 балл
  if (record.attendedRehearsal) {
    points += 1;
  }
  
  // Итого: до 23 баллов за урок (с золотыми стихами) или до 17 (без золотых стихов)
  return points;
}
```

**Максимальные баллы за урок:**
- Присутствие: 1
- Золотые стихи (3 × 2): 6 (только если showGoldenVerses = true)
- Тест: 10
- Тетрадь: 5
- Спевка: 1
- **ИТОГО: 23 балла** (для групп с золотыми стихами)
- **ИТОГО: 17 баллов** (для групп без золотых стихов)

**Визуализация прогресса (домики):**
- 1 кирпичик = 1 балл
- 10 кирпичиков = 1 этаж = 10 баллов
- 100 кирпичиков = 10 этажей = 100 баллов = дом построен

**Формула конвертации:**
```typescript
function calculateProgress(totalPoints: number) {
  const bricks = Math.floor(totalPoints); // 1 балл = 1 кирпичик
  const floors = Math.floor(bricks / 10);
  const houses = Math.floor(floors / 10);
  
  return {
    bricks,
    floors,
    houses,
    currentBricks: bricks % 10,  // Кирпичи текущего этажа
    currentFloors: floors % 10,  // Этажи текущего дома
  };
}
```

**Критерии достижений:**

| Достижение | Критерий | Иконка |
|------------|----------|--------|
| Отличник | 5 уроков подряд с максимальным баллом (23) | 🏆 |
| Без пропусков | Посетил все уроки месяца | 📅 |
| Знаток стихов | 10 раз подряд все стихи на "2" | 📖 |
| Прилежный | Средний балл за домашку > 9 | ⭐ |
| Первый урок | Посетил первый урок | 🎓 |
| Столетие | Набрал 100 баллов | 💯 |
| Строитель | Построил 1 дом (1000 баллов) | 🏠 |
| Полгода | Посетил все уроки полугодия | 📆 |

### 4.5 Константы и вспомогательные функции

**BIBLE_BOOKS_SHORT_NAMES:**
```typescript
// shared/constants/bibleBooks.ts

export const BIBLE_BOOKS_SHORT_NAMES: Record<number, string> = {
  1: "Быт.",    // Бытие
  2: "Исх.",    // Исход
  3: "Лев.",    // Левит
  4: "Чис.",    // Числа
  5: "Втор.",   // Второзаконие
  6: "Ис.Нав.", // Иисус Навин
  7: "Суд.",    // Судей
  8: "Руф.",    // Руфь
  9: "1Цар.",   // 1 Царств
  10: "2Цар.",  // 2 Царств
  11: "3Цар.",  // 3 Царств
  12: "4Цар.",  // 4 Царств
  13: "1Пар.",  // 1 Паралипоменон
  14: "2Пар.",  // 2 Паралипоменон
  15: "Ездр.",  // Ездра
  16: "Неем.",  // Неемия
  17: "Есф.",   // Есфирь
  18: "Иов",    // Иов
  19: "Пс.",    // Псалтирь
  20: "Прит.",  // Притчи
  21: "Еккл.",  // Екклесиаст
  22: "Песн.",  // Песня Песней
  23: "Ис.",    // Исаия
  24: "Иер.",   // Иеремия
  25: "Плач",   // Плач Иеремии
  26: "Иез.",   // Иезекииль
  27: "Дан.",   // Даниил
  28: "Осии",   // Осия
  29: "Иоил",   // Иоиль
  30: "Ам.",    // Амос
  31: "Авд.",   // Авдий
  32: "Ион.",   // Иона
  33: "Мих.",   // Михей
  34: "Наум",   // Наум
  35: "Авв.",   // Аввакум
  36: "Соф.",   // Софония
  37: "Агг.",   // Аггей
  38: "Зах.",   // Захария
  39: "Мал.",   // Малахия
  40: "Мф.",    // Матфея
  41: "Мк.",    // Марка
  42: "Лк.",    // Луки
  43: "Ин.",    // Иоанна
  44: "Деян.",  // Деяния
  45: "Рим.",   // Римлянам
  46: "1Кор.",  // 1 Коринфянам
  47: "2Кор.",  // 2 Коринфянам
  48: "Гал.",   // Галатам
  49: "Еф.",    // Ефесянам
  50: "Флп.",   // Филиппийцам
  51: "Кол.",   // Колоссянам
  52: "1Фес.",  // 1 Фессалоникийцам
  53: "2Фес.",  // 2 Фессалоникийцам
  54: "1Тим.",  // 1 Тимофею
  55: "2Тим.",  // 2 Тимофею
  56: "Тит.",   // Титу
  57: "Флм.",   // Филимону
  58: "Евр.",   // Евреям
  59: "Иак.",   // Иакова
  60: "1Пет.",  // 1 Петра
  61: "2Пет.",  // 2 Петра
  62: "1Ин.",   // 1 Иоанна
  63: "2Ин.",   // 2 Иоанна
  64: "3Ин.",   // 3 Иоанна
  65: "Иуд.",   // Иуды
  66: "Откр.",  // Откровение
};

// Helper function to format reference
export function formatVerseReference(reference: { bookNumber: number; chapter: number; verse: number }): string {
  const bookShortName = BIBLE_BOOKS_SHORT_NAMES[reference.bookNumber];
  if (!bookShortName) {
    return `??? ${reference.chapter}:${reference.verse}`;
  }
  return `${bookShortName} ${reference.chapter}:${reference.verse}`;
}
```

---

## 5. Feature Requirements

### 5.1 Public Pages

#### /auth — Authentication Page
**Purpose:** Secure login and registration

**Components:**
- Logo and branding
- Tab switcher (Login / Sign Up)
- Login form: email, password, remember me, forgot password link
- Sign up form: email, password, confirm password
- Form validation with Zod
- Auth.js integration
- Role-based redirect after login

**Store Example:**
```typescript
// shared/store/authStore.ts
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authAPI.login(credentials);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  logout: async () => {
    await authAPI.logout();
    set({ user: null, isAuthenticated: false });
  },
  
  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const user = await authAPI.getSession();
      set({ user, isAuthenticated: !!user, isLoading: false });
    } catch {
      set({ isAuthenticated: false, isLoading: false });
    }
  },
  
  clearError: () => set({ error: null }),
}));
```

**Access:** Public (unauthenticated only)

---

### 5.2 Private Pages

#### /grades/:gradeId — Grade Overview

**Breadcrumb:** 🏠 Главная > Группы > [Название группы]

**Purpose:** Display academic years for selected grade

**Components:**
- Grade header (name, age range)
- Academic year cards with lesson count
- Link to grade settings (/grades/:gradeId/settings)
- Create new academic year button

**Store:**
```typescript
// entities/grade/model/gradeStore.ts
interface GradeState {
  selectedGrade: Grade | null;
  academicYears: AcademicYear[];
  
  setGrade: (grade: Grade) => void;
  fetchAcademicYears: (gradeId: string) => Promise<void>;
}
```

**Access:** Teacher (own grades), Admin

**Note:** Teacher uses `/grades/my` which automatically redirects to `/grades/:actualGradeId`

---

#### /school-process-management — School Year Management (Admin only)

**Breadcrumb:** 🏠 Dashboard > Управление учебным процессом

**Purpose:** Manage global academic year status (ACTIVE/FINISHED) for entire school. All grades share the same academic year.

**Components:**
- Display current active academic year (global, single for whole school)
- Year start/end dates
- Status badge: 🟢 ACTIVE / 🟡 FINISHED
- Two action buttons:
  - "Finish Current Year" (enabled only if status = ACTIVE)
  - "Create New Year" (enabled only if current year = FINISHED)
- Confirmation modals for destructive actions
- Information panel about consequences of year finalization

**Store:**
```typescript
// entities/academic-year/model/academicYearStore.ts
interface AcademicYearState {
  currentYear: AcademicYear | null;
  
  fetchCurrentYear: () => Promise<void>;
  finishYear: (yearId: string) => Promise<void>;
  createNextYear: (yearData: CreateYearDTO) => Promise<void>;
}
```

**Access:** Admin, Superadmin

**Business Rules:**
- Only ONE AcademicYear can have status = ACTIVE globally (for entire school)
- When finishing a year: ALL grades transition to FINISHED status
- FINISHED years are read-only for all grades
- New academic year applies to ALL grades immediately after creation
- Teachers can only create lessons in grades with ACTIVE year

**API Usage:**
- GET /api/academic-years/current
- PATCH /api/academic-years/:id/finish-and-create-next
- POST /api/academic-years

---

#### /grades/:gradeId — Grade Overview

**Breadcrumb:** 🏠 Главная > Группы > [Название группы]

**Purpose:** Display academic years for selected grade

**Components:**
- Grade header (name, age range)
- Global year status indicator (ACTIVE/FINISHED)
- Academic year cards with lesson count for this grade
- Link to grade settings
- Reference to /school-process-management for year management

**Store:**
```typescript
// entities/grade/model/gradeStore.ts
interface GradeState {
  selectedGrade: Grade | null;
  academicYears: AcademicYear[];
  
  setGrade: (grade: Grade) => void;
  fetchAcademicYears: (gradeId: string) => Promise<void>;
}
```

**UI-Rules:**
- Display read-only information about academic years for this specific grade
- Show global year status from AcademicYear.status
- For FINISHED years: display "read-only" warning on lesson pages
- No direct actions to change year status (this is done only on /school-process-management)

**Access:** Teacher (own grades), Admin

---

#### /grades/:gradeId/academic-years/:yearId/lessons — Lessons List

**Breadcrumb:** 🏠 Главная > Группы > [Название группы] > [Учебный год]

**Purpose:** CRUD operations on lessons for academic year

**Note:** This route requires both `gradeId` and `yearId` to properly identify the context

**Components:**
- Lessons table (number, date, topic, teacher)
- Create new lesson button
- Edit/Delete actions per lesson
- Pagination (15 items per page)

**Store:**
```typescript
// entities/lesson/model/lessonStore.ts
interface LessonListState {
  lessons: Lesson[];
  archivedLessons: Lesson[];
  isLoading: boolean;
  totalCount: number;
  currentPage: number;
  
  fetchLessons: (gradeId: string, academicYearId: string, page?: number, pageSize?: number) => Promise<void>;
  fetchArchivedLessons: (gradeId: string, academicYearId: string, page?: number, pageSize?: number) => Promise<void>;
  archiveLesson: (lessonId: string, reason?: string) => Promise<void>;
  restoreLesson: (lessonId: string) => Promise<void>;
}
```

**Access:** Teacher (own grades), Admin

---

#### /grades/:gradeId/settings — Grade Settings

**Breadcrumb:** 🏠 Главная > Группы > [Название группы] > Настройки

**Purpose:** Configure assessment parameters visibility

**Components:**
- Toggle switches for: Golden Verses, Test Score, Notebook Score, Rehearsal
- Custom labels (optional)
- Save/Reset buttons

**Store:**
```typescript
// entities/grade/model/gradeSettingsStore.ts
interface GradeSettingsState {
  settings: GradeSettings | null;
  
  fetchSettings: (gradeId: string) => Promise<void>;
  updateSettings: (settings: Partial<GradeSettings>) => Promise<void>;
  resetToDefaults: () => Promise<void>;
}
```

**Access:** Admin only

---

#### /grades/:gradeId/schedule — Grade Schedule Calendar

**Breadcrumb:** 🏠 Главная > Группы > [Название группы] > Расписание

**Purpose:** Calendar view of group schedule with events (lessons, outdoor events, lesson skipping). Teachers and Admins can add/edit/delete events, Parents can view only.

**Components:**
- Calendar grid (monthly view)
- Month navigation (previous/next, "Today" button)
- Event display in calendar cells:
  - Color coding by event type:
    - 🔵 Blue — LESSON (regular lesson)
    - 🟢 Green — OUTDOOR_EVENT (outdoor activity)
    - 🔴 Red — LESSON_SKIPPING (cancelled lesson)
  - Small text label with event type (in Russian)
  - Hover/click tooltip with event details
- "➕ Add Event" button (Teacher/Admin only)
- Event creation/editing modal
- Legend explaining color codes

**Store:**
```typescript
// entities/grade/model/gradeScheduleStore.ts
interface GradeScheduleState {
  events: GradeEvent[];
  currentMonth: Date;
  
  fetchEvents: (gradeId: string, month?: Date) => Promise<void>;
  createEvent: (event: CreateGradeEventDTO) => Promise<void>;
  updateEvent: (eventId: string, updates: UpdateGradeEventDTO) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  navigateMonth: (direction: 'prev' | 'next' | 'today') => void;
}

interface CreateGradeEventDTO {
  gradeId: string;
  date: Date;
  eventType: 'LESSON' | 'OUTDOOR_EVENT' | 'LESSON_SKIPPING';
  title?: string;
  description?: string;
}

interface UpdateGradeEventDTO {
  date?: Date;
  eventType?: 'LESSON' | 'OUTDOOR_EVENT' | 'LESSON_SKIPPING';
  title?: string;
  description?: string;
}
```

**Event Types (GradeEventType):**
- `LESSON` — Regular lesson (🔵 Blue)
- `OUTDOOR_EVENT` — Outdoor activity/trip (🟢 Green)
- `LESSON_SKIPPING` — Cancelled lesson (🔴 Red)

**Access:** Teacher (own grades), Admin (all grades), Parent (read-only, for their children's grades)

---

#### /new-lesson — Create Lesson

**Breadcrumb:** 🏠 Главная > Группы > [Название группы] > [Учебный год] > Новый урок

**Purpose:** Create new lesson with golden verses

**Components:**
- Lesson number (auto-generated)
- Date picker
- Topic input
- Teacher selector
- Golden verses selector (3 required):
  - For each verse (1-3):
    - Book selector (dropdown with BIBLE_BOOKS_SHORT_NAMES)
    - Chapter input (number, 1-150)
    - Verse input (number, 1-176)
    - Text input (auto-populated if verse exists, editable)
    - Search/Select existing verse button
- Save/Cancel buttons

**Golden Verse Selection Logic:**
1. User selects book, enters chapter and verse
2. System checks if verse exists in database by reference (bookNumber, chapter, verse)
3. If exists: auto-populate text field, disable by default (can enable editing if incorrect)
4. If not exists: empty text field, required input
5. User can manually search/select existing verses

**Form Store:**
```typescript
// features/lesson-management/create-lesson/model/createLessonStore.ts
interface GoldenVerseFormData {
  bookNumber: number;
  chapter: number;
  verse: number;
  text: string;
  existingVerseId?: string; // If verse exists in DB
}

interface CreateLessonState {
  form: {
    lessonNumber: number;
    date: Date | null;
    topic: string;
    teacherId: string;
    goldenVerses: GoldenVerseFormData[]; // Exactly 3
  };
  
  updateField: (field: string, value: any) => void;
  updateGoldenVerse: (index: number, verse: Partial<GoldenVerseFormData>) => void;
  checkVerseExists: (bookNumber: number, chapter: number, verse: number) => Promise<GoldenVerse | null>;
  submitLesson: () => Promise<void>;
  reset: () => void;
}
```

**Access:** Teacher (own grades), Admin

---

#### /lessons/:lessonId/edit — Edit Lesson
**Purpose:** Edit existing lesson with golden verses

**Breadcrumb:** 🏠 Главная > Группы > [Название группы] > [Учебный год] > Редактировать урок #X

**Components:**
- Same as /new-lesson with pre-filled data
- Golden verses selector with existing verses loaded:
  - Shows current book, chapter, verse for each verse
  - Allows changing reference (will update text if verse exists)
  - Allows editing text (will update database verse if changed)

**Logic:**
- When reference changes: check if new verse exists, auto-populate if yes
- When text is edited: save updated text to database (update existing verse or create new if reference changed)
- Validation: depends on GradeSettings.showGoldenVerses (0 verses if false, exactly 3 if true)

**Access:** Teacher (own grades), Admin

---

#### /golden-verses — Golden Verses List

**Breadcrumb:** 🏠 Главная > Золотые стихи

**Purpose:** Browse and manage golden verses library

**Components:**
- Table with columns:
  - Reference (formatted: "Ин. 3:16")
  - Text preview (first 50 chars)
  - Used in lessons count
  - Created date
  - Edit button
- Pagination (15 items per page)
- Filters:
  - Search by reference (book, chapter, verse)
  - Filter by book
  - Filter by chapter range
- Actions:
  - View full verse
  - Edit verse text
  - View statistics → /golden-verses/statistics?verseId=:id

**Store:**
```typescript
// entities/golden-verse/model/goldenVerseStore.ts
interface GoldenVerseListState {
  verses: GoldenVerse[];
  totalCount: number;
  currentPage: number;
  filters: {
    bookNumber?: number;
    chapterMin?: number;
    chapterMax?: number;
    searchQuery?: string;
  };
  
  fetchVerses: (page: number, filters?: Filters) => Promise<void>;
  updateVerse: (verseId: string, text: string) => Promise<void>;
}
```

**Access:** Teacher, Admin

---

#### /golden-verses/statistics — Golden Verses Statistics

**Breadcrumb:** 🏠 Главная > Золотые стихи > Статистика

**Purpose:** View statistics on how pupils learn golden verses

**Components:**
- Table with columns:
  - Reference (formatted: "Ин. 3:16")
  - Total attempts (how many times verse was checked)
  - Perfect scores (score = 2): count and percentage
  - Average score (0-2)
  - Groups where used (list of grade names)
  - View details button
- Pagination (15 items per page)
- Filters:
  - Filter by book
  - Filter by date range (lessons date)
  - Filter by grade
- Detail view (modal or expandable row):
  - Score distribution (0/1/2 counts)
  - Timeline chart (attempts over time)
  - Performance by grade (comparison)

**Statistics Calculation:**
- Query LessonRecord where goldenVerse1Id/2Id/3Id = verseId
- **Important:** Only count records from grades where showGoldenVerses = true
- Exclude records where grade.settings.showGoldenVerses = false
- Count total records (excluding absent pupils: isPresent = false)
- Count perfect scores (score = 2)
- Calculate average: sum(scores) / count
- Group by grade, date ranges
- Filter statistics by grade if needed (only show grades that use golden verses)

**Store:**
```typescript
// entities/golden-verse/model/goldenVerseStatisticsStore.ts
interface VerseStatistics {
  verseId: string;
  reference: string;
  totalAttempts: number;
  perfectCount: number;
  perfectPercentage: number;
  averageScore: number;
  gradeUsage: { gradeId: string; gradeName: string; count: number }[];
  scoreDistribution: { score: 0 | 1 | 2; count: number }[];
}

interface GoldenVerseStatisticsState {
  statistics: VerseStatistics[];
  totalCount: number;
  currentPage: number;
  filters: {
    bookNumber?: number;
    gradeId?: string;
    dateFrom?: Date;
    dateTo?: Date;
  };
  
  fetchStatistics: (page: number, filters?: Filters) => Promise<void>;
}
```

**Access:** Teacher, Admin

---

#### /lessons/:lessonId — Lesson Overview (Hub Page)

**Breadcrumb:** 🏠 Главная > Группы > [Название группы] > [Учебный год] > Урок #X

**Purpose:** Central navigation point for lesson (index route for nested lesson routes)

**Components:**
- Lesson info card (topic, date, teacher, verses)
- Progress indicator (records completed)
- Two main action buttons:
  - "Open Complete Lesson Table" → /lessons/:lessonId/complete-table
  - "Check Homework" → /lessons/:lessonId/checking-homework
- Edit lesson button → /lessons/:lessonId/edit

**Access:** Teacher (own grades), Admin

**Note:** This is the index route for the `/lessons/:lessonId` nested route structure. Other lesson-related pages are nested under this path.

---

#### /lessons/:lessonId/complete-table — Complete Lesson Table

**Breadcrumb:** 🏠 Главная > Группы > [Название группы] > [Учебный год] > Урок #X > Сводная таблица

**Purpose:** View all pupils' results for lesson

**Components:**
- Comprehensive table with columns:
  - Pupil name + avatar
  - Attendance (✓/✗)
  - Golden Verse 1-3 scores (0/1/2)
  - **Тест** — баллы за тест (0-10 или "-")
  - **Тетрадь** — баллы за тетрадь (0-10 или "-")
  - Rehearsal (✓/✗)
  - Edit icon
- Export button (CSV/PDF)
- Filters (present/absent, complete/incomplete)

**Store:**
```typescript
// entities/lesson-record/model/lessonRecordsStore.ts
interface LessonRecordsState {
  records: LessonRecord[];
  pupils: Pupil[];
  
  fetchRecords: (lessonId: string) => Promise<void>;
  exportData: (format: 'csv' | 'pdf') => Promise<void>;
}
```

**Access:** Teacher (own grades), Admin

---

#### /lessons/:lessonId/checking-homework — Homework Checking Interface

**Breadcrumb:** 🏠 Главная > Группы > [Название группы] > [Учебный год] > Урок #X > Проверка

**Purpose:** Streamlined batch homework entry

**Components:**
- List of pupil cards (vertical)
- Click pupil → Modal with form:
  - Attendance toggle
  - Golden Verse scores (3x 0/1/2 selector)
  - Test score input (0-10)
  - Notebook score input (0-10)
  - Rehearsal toggle
  - Save/Cancel + Previous/Next buttons
- Progress indicator

**Modal Wireframe:**
```
┌──────────────────────────────────────────────┐
│ Проверка ДЗ — Иванов Пётр             [✕]   │
├──────────────────────────────────────────────┤
│                                              │
│ 👤 Иванов Пётр                               │
│                                              │
│ Присутствие:  [✓ Да]    [ Нет]              │
│                                              │
│ ─────────────────────────────────────────    │
│ Золотые стихи:                               │
│                                              │
│ Стих 1 (Ин. 3:16):                           │
│   [ 0 ]  [ 1 ]  [✓2 ]                        │
│                                              │
│ Стих 2 (Рим. 8:28):                          │
│   [ 0 ]  [✓1 ]  [ 2 ]                        │
│                                              │
│ Стих 3 (Быт. 1:1):                           │
│   [✓0 ]  [ 1 ]  [ 2 ]                        │
│                                              │
│ ─────────────────────────────────────────    │
│ Домашнее задание:                            │
│                                              │
│ Оценка за тест (0-10):  [█8█████]            │
│ Оценка за тетрадь (0-10): [███████7█]        │
│                                              │
│ Посещение спевки: [✓ Да]    [ Нет]          │
│                                              │
├──────────────────────────────────────────────┤
│ [← Предыдущий] [Отмена] [Сохранить] [Далее →]│
└──────────────────────────────────────────────┘
```

**Store:**
```typescript
// features/homework-check/model/homeworkCheckStore.ts
interface HomeworkCheckState {
  currentPupilIndex: number;
  pupils: Pupil[];
  currentRecord: Partial<LessonRecord>;
  
  nextPupil: () => void;
  previousPupil: () => void;
  updateRecord: (field: string, value: any) => void;
  saveRecord: () => Promise<void>;
}
```

**Access:** Teacher (own grades), Admin

---

#### /pupil-personal-data/:id — Pupil Profile

**Breadcrumb:** 🏠 Главная > Ученики > [Имя ученика]

**Purpose:** Complete pupil history and profile

**Components:**
- Profile card (avatar, name, DOB, age, gender, family, grade)
- Tabs: Overview / All Lessons / Trends
- Lessons history table (all lesson records)
- Edit record modal (same as homework check)
- Export functionality
- Filter by academic year / date range

**Access:**
- Pupil: Own data (read-only, Post-MVP)
- Parent: Own children (read-only, Post-MVP)
- Teacher: Pupils in own grades (read/write)
- Admin: All pupils (read/write)

---

#### /grade-leaderboard/:id — Grade Ranking & Motivation

**Breadcrumb:** 🏠 Главная > Группы > [Название группы] > Рейтинг

**Purpose:** Visualize pupil progress and rankings

**Components:**
- **Leaderboard Table:**
  - Rank (1, 2, 3... with medals for top 3)
  - Pupil avatar + name
  - Current points
  - House visualization (compact)
  - Badges earned (icons)
  
- **House Visualization (Expanded View):**
  ```
  ┌────────────────────────────┐
  │    🏠 Попова Виктория      │
  ├────────────────────────────┤
  │                            │
  │   ╔═══╗                    │
  │   ║ ▓ ║  ← Этаж 2 (9/10)   │
  │   ║ ▓ ║                    │
  │   ╠═══╣                    │
  │   ║ ▓ ║  ← Этаж 1 (10/10)  │
  │   ║ ▓ ║     ✅ завершён    │
  │   ╚═══╝                    │
  │                            │
  │   Кирпичей: 19/100         │
  │   Этажей: 1/10             │
  │   Баллы: 190               │
  └────────────────────────────┘
  ```

- **Achievement Display:**
  - Grid of earned badges
  - Locked/unlocked states
  - Tooltip with achievement criteria
  
- **Statistics Panel:**
  - Total pupils in grade
  - Average points
  - Top performer of the week
  - Recent achievements feed

**Wireframe (Leaderboard):**
```
╔═══════════════════════════════════════════════════════════╗
║ 🏠 Рейтинг группы: Младшая группа (6-8 лет)              ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  [Все ученики] [Этот месяц] [Этот год]                   ║
║                                                           ║
║  ┌─────────────────────────────────────────────────────┐ ║
║  │ #  │ Ученик          │ Баллы │ Прогресс │ Достижения│ ║
║  ├────┼─────────────────┼───────┼──────────┼───────────┤ ║
║  │ 🥇 │ 👧 Попова В.     │  190  │ 🏠▓▓▓▓▓▓▓▓▓░│ 🏆📖💯 │ ║
║  ├────┼─────────────────┼───────┼──────────┼───────────┤ ║
║  │ 🥈 │ 👦 Иванов П.     │  175  │ 🏠▓▓▓▓▓▓▓▓░░│ 📖💯   │ ║
║  ├────┼─────────────────┼───────┼──────────┼───────────┤ ║
║  │ 🥉 │ 👧 Сидорова М.   │  163  │ 🏠▓▓▓▓▓▓▓░░░│ 🎓     │ ║
║  ├────┼─────────────────┼───────┼──────────┼───────────┤ ║
║  │ 4  │ 👦 Петров С.     │  145  │ 🏠▓▓▓▓▓▓░░░░│ 🎓     │ ║
║  ├────┼─────────────────┼───────┼──────────┼───────────┤ ║
║  │ 5  │ 👧 Козлова А.    │  132  │ 🏠▓▓▓▓▓░░░░░│        │ ║
║  └────┴─────────────────┴───────┴──────────┴───────────┘ ║
║                                                           ║
║  📊 Средний балл: 161  |  👑 Лучший месяц: Попова В.     ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

**Store:**
```typescript
// features/leaderboard/model/leaderboardStore.ts
interface LeaderboardState {
  rankings: GradeRanking[];
  isLoading: boolean;
  filter: 'all' | 'month' | 'year';
  
  fetchRankings: (gradeId: string) => Promise<void>;
  setFilter: (filter: 'all' | 'month' | 'year') => void;
}
```

**Access:** Teacher (own grades), Admin (all grades)

---

#### /pupil-achievements/:id — Pupil Achievements Page

**Breadcrumb:** 🏠 Главная > Ученики > [Имя ученика] > Достижения

**Purpose:** Display all achievements earned by pupil

**Components:**
- Achievement grid (earned + locked)
- Progress bars for partial achievements
- Recent achievements timeline
- Share achievements feature (Post-MVP)

**Modal - Achievement Details:**
```
┌──────────────────────────────────────────┐
│ 🏆 Отличник                       [✕]   │
├──────────────────────────────────────────┤
│                                          │
│  Получено: 15 октября 2024               │
│                                          │
│  Описание:                               │
│  5 уроков подряд с максимальным баллом   │
│  (23 балла за урок)                      │
│                                          │
│  Бонус: +10 баллов 🎁                    │
│                                          │
│  История получения:                      │
│  • Урок #5: 23/23 ✓                      │
│  • Урок #6: 23/23 ✓                      │
│  • Урок #7: 23/23 ✓                      │
│  • Урок #8: 23/23 ✓                      │
│  • Урок #9: 23/23 ✓                      │
│                                          │
│                [   Закрыть   ]           │
│                                          │
└──────────────────────────────────────────┘
```

**Access:** 
- Pupil: Own achievements (read-only, Post-MVP)
- Parent: Own children (read-only, Post-MVP)
- Teacher: Pupils in own grades (read-only)
- Admin: All pupils (read-only)

---

### 5.3 Dashboard Pages (Admin Only)

#### /teachers — Teachers Management

**Breadcrumb:** 🏠 Dashboard > Преподаватели

**Purpose:** CRUD for teachers

**Components:**
- Teacher cards grid (avatar, name, grades, status)
- Add new teacher button
- Edit/Deactivate actions
- Search bar
- Filters (by grade, status)

**Modal Form:**
- Avatar upload
- First/Last/Middle name
- Email (for user account)
- Grade assignment (multi-select)
- Status toggle

**Access:** Admin

---

#### /grades-list — Grades Management

**Breadcrumb:** 🏠 Dashboard > Группы

**Purpose:** CRUD for grades

**Components:**
- Grade cards (name, age range, pupil count, teacher count)
- Add new grade button
- Edit/Deactivate actions
- Link to grade details

**Modal Form:**
- Grade name
- Age range
- Description
- Pupil assignment (multi-select)
- Teacher assignment (multi-select)
- Status toggle

**Access:** Admin

---

#### /pupils — Pupils Management

**Breadcrumb:** 🏠 Dashboard > Ученики

**Purpose:** CRUD for pupils

**Components:**
- Pupil cards (avatar, name, age, grade, family)
- Add new pupil button
- Edit/Deactivate actions
- Search/Filters (by grade, family, age)

**Modal Form:**
- Avatar upload
- First/Last/Middle name
- Date of birth
- Gender (optional dropdown: "Мужской", "Женский", "Другой")
- Family selection (with "Create new family" option)
- Grade assignment
- Status toggle

**Access:** Admin

---

#### /families — Families Management

**Breadcrumb:** 🏠 Dashboard > Семьи

**Purpose:** CRUD for families

**Components:**
- Family cards (parents names, phones, children list)
- Add new family button
- Edit actions
- Search

**Modal Form:**
- Father: First name, Last name, Phone
- Mother: First name, Last name, Phone
- Children list (read-only, managed via Pupils)
- Status toggle

**Access:** Admin

---

#### /admin/lessons-archive — Centralized Lessons Archive (Admin Only)

**Breadcrumb:** 🏠 Dashboard > Архив уроков

**Purpose:** Centralized view of archived lessons across all grades and academic years; handling restoration requests

**Components:**
- Filters: grade, academic year, status (archived/requestedForRestore)
- Table of archived lessons (all grades)
- Section for restoration requests: list of lessons with status requestedForRestore with actions (Approve/Reject)
- Bulk operations: mass archive/restore with checkboxes

**Access:** Admin, Superadmin

---

## 6. Security & Validation

### 6.1 Authentication & Session Management

**Password Security:**
```typescript
// shared/lib/auth.ts
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
```

**Session Configuration:**
```typescript
// app/providers/AuthProvider.tsx
import { SessionProvider } from 'next-auth/react';

export const authOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        // Verify credentials and return user
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
};
```

### 6.2 Authorization (RBAC)

**Middleware для защиты маршрутов:**
```typescript
// app/router/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/shared/store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: Role[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/not-found" replace />;
  }
  
  return <>{children}</>;
}
```

**Применение:**
```typescript
// app/router/AppRouter.tsx
<Routes>
  <Route path="/auth" element={<AuthPage />} />
  
  {/* Grade routes */}
  <Route
    path="/grades/my"
    element={
      <ProtectedRoute allowedRoles={['teacher']}>
        <GradeRedirectPage /> {/* Redirects to /grades/:actualGradeId */}
      </ProtectedRoute>
    }
  />
  <Route
    path="/grades/:gradeId"
    element={
      <ProtectedRoute allowedRoles={['teacher', 'admin']}>
        <GradeLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<GradeDataPage />} />
    <Route path="settings" element={<GradeSettingsPage />} />
    <Route path="schedule" element={<GradeSchedulePage />} />
    <Route path="academic-years/:yearId/lessons" element={<YearLessonsListPage />} />
    <Route path="academic-years/:yearId/lessons/archive" element={<LessonsArchivePage />} />
  </Route>
  
  {/* Nested routes for lessons */}
  <Route
    path="/lessons/:lessonId"
    element={
      <ProtectedRoute allowedRoles={['teacher', 'admin']}>
        <LessonLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<LessonOverviewPage />} />
    <Route path="edit" element={<EditLessonPage />} />
    <Route path="complete-table" element={<CompleteTablePage />} />
    <Route path="checking-homework" element={<CheckingHomeworkPage />} />
  </Route>
  
  <Route
    path="/teachers"
    element={
      <ProtectedRoute allowedRoles={['admin']}>
        <TeachersPage />
      </ProtectedRoute>
    }
  />
</Routes>
```

**Server-side Authorization:**
```typescript
// Backend API middleware
export function requireRole(...roles: Role[]) {
  return async (req, res, next) => {
    const user = await getUserFromToken(req.headers.authorization);
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    if (!roles.includes(user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    req.user = user;
    next();
  };
}

// Usage:
app.get('/api/teachers', requireRole('admin'), getTeachers);
app.post('/api/lessons', requireRole('teacher', 'admin'), createLesson);
```

### 6.3 Validation Rules

**Form Validation with Zod:**
```typescript
// shared/lib/validators.ts
import { z } from 'zod';

// User/Auth validation
export const loginSchema = z.object({
  email: z.string().email('Неверный формат email'),
  password: z.string().min(8, 'Минимум 8 символов'),
});

export const signupSchema = z.object({
  email: z.string().email('Неверный формат email'),
  password: z.string()
    .min(8, 'Минимум 8 символов')
    .regex(/[A-Z]/, 'Требуется хотя бы одна заглавная буква')
    .regex(/[a-z]/, 'Требуется хотя бы одна строчная буква')
    .regex(/[0-9]/, 'Требуется хотя бы одна цифра'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
});

// Teacher validation
export const teacherSchema = z.object({
  firstName: z.string().min(2, 'Минимум 2 символа').max(50, 'Максимум 50 символов'),
  lastName: z.string().min(2, 'Минимум 2 символа').max(50, 'Максимум 50 символов'),
  middleName: z.string().max(50).optional(),
  email: z.string().email('Неверный формат email'),
  avatar: z.string().url('Неверный формат URL').optional(),
  gradeIds: z.array(z.string()).min(1, 'Выберите хотя бы одну группу'),
});

// Pupil validation
export const pupilSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  middleName: z.string().max(50).optional(),
  dateOfBirth: z.date()
    .max(new Date(), 'Дата рождения не может быть в будущем')
    .refine(date => {
      const age = new Date().getFullYear() - date.getFullYear();
      return age >= 3 && age <= 18;
    }, 'Возраст должен быть от 3 до 18 лет'),
  gender: z.string().max(50).optional(), // Пол ученика (опционально)
  familyId: z.string().min(1, 'Выберите семью'),
  gradeId: z.string().min(1, 'Выберите группу'),
  avatar: z.string().url().optional(),
});

// Lesson validation
// Note: Validation depends on GradeSettings.showGoldenVerses
// - If showGoldenVerses = false: goldenVerses.length must be 0
// - If showGoldenVerses = true: goldenVerses.length must be exactly 3
export const lessonSchema = z.object({
  topic: z.string().min(3, 'Минимум 3 символа').max(200, 'Максимум 200 символов'),
  date: z.date()
    .max(
      new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000),
      'Дата не может быть более чем на 2 года в будущем'
    ),
  teacherId: z.string().min(1, 'Выберите преподавателя'),
  goldenVerses: z.array(z.object({
    reference: z.object({
      bookNumber: z.number().int().min(1).max(66),
      chapter: z.number().int().min(1).max(150),
      verse: z.number().int().min(1).max(176),
    }),
    text: z.string().min(1, 'Текст стиха обязателен'),
    existingVerseId: z.string().optional(),
  })).refine((verses, ctx) => {
    // This validation must check GradeSettings.showGoldenVerses at runtime
    // If showGoldenVerses = false: verses.length === 0
    // If showGoldenVerses = true: verses.length === 3
    // This is enforced in the form component, not in schema
    return true;
  }),
}).refine((data, ctx) => {
  // Runtime validation: check grade settings
  // This should be done in the form/component that has access to GradeSettings
  return true;
});

// Lesson archive validation
export const archiveLessonSchema = z.object({
  lessonId: z.string().min(1, 'ID урока обязателен'),
  reason: z.string().max(500, 'Максимум 500 символов').optional(),
});

// Lesson restore validation
export const restoreLessonSchema = z.object({
  lessonId: z.string().min(1, 'ID урока обязателен'),
});

// Lesson Record validation
export const lessonRecordSchema = z.object({
  pupilId: z.string(),
  lessonId: z.string(),
  isPresent: z.boolean(),
  goldenVerse1Id: z.string().optional(),
  goldenVerse1Score: z.number().int().min(0).max(2),
  goldenVerse2Id: z.string().optional(),
  goldenVerse2Score: z.number().int().min(0).max(2),
  goldenVerse3Id: z.string().optional(),
  goldenVerse3Score: z.number().int().min(0).max(2),
  testScore: z.number().int().min(0).max(10),
  notebookScore: z.number().int().min(0).max(10),
  attendedRehearsal: z.boolean(),
}).refine(data => {
  // If pupil absent, scores should be 0
  if (!data.isPresent) {
    return data.goldenVerse1Score === 0 &&
           data.goldenVerse2Score === 0 &&
           data.goldenVerse3Score === 0 &&
           data.testScore === 0 &&
           data.notebookScore === 0 &&
           !data.attendedRehearsal;
  }
  return true;
}, {
  message: 'Для отсутствующего ученика все оценки должны быть 0',
});

// Family validation
export const familySchema = z.object({
  fatherFirstName: z.string().min(2).max(50).optional(),
  fatherLastName: z.string().min(2).max(50).optional(),
  fatherPhone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Неверный формат телефона').optional(),
  motherFirstName: z.string().min(2).max(50).optional(),
  motherLastName: z.string().min(2).max(50).optional(),
  motherPhone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Неверный формат телефона').optional(),
}).refine(data => {
  // At least one parent must be specified
  return (data.fatherFirstName && data.fatherLastName) ||
         (data.motherFirstName && data.motherLastName);
}, {
  message: 'Необходимо указать хотя бы одного родителя',
});
```

**Usage in Forms:**
```typescript
// Example: features/auth/login/ui/LoginForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/shared/lib/validators';

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  
  const onSubmit = async (data) => {
    await login(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register('email')}
        error={errors.email?.message}
      />
      <Input
        type="password"
        {...register('password')}
        error={errors.password?.message}
      />
      <Button type="submit">Войти</Button>
    </form>
  );
}
```

### 6.4 Input Sanitization

```typescript
// shared/lib/sanitizers.ts
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [], // Strip all HTML
    ALLOWED_ATTR: [],
  });
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .slice(0, 1000); // Limit length
}

export function sanitizePhone(phone: string): string {
  return phone.replace(/[^0-9+]/g, '');
}
```

### 6.5 API Security

**Rate Limiting:**
```typescript
// Backend: API rate limiter
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Слишком много запросов с этого IP, попробуйте позже',
});

app.use('/api/', limiter);

// Stricter limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
});

app.post('/api/auth/login', authLimiter, loginHandler);
```

**CORS Configuration:**
```typescript
// Backend: CORS setup
import cors from 'cors';

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
```

---

## 7. State Management & API

### 7.1 Zustand Stores Architecture

**Global Stores (shared/store/):**
```typescript
// authStore.ts - Authentication state
// uiStore.ts - UI preferences (theme, sidebar)
// modalStore.ts - Modal management
```

**Entity Stores (entities/*/model/):**
```typescript
// entities/teacher/model/teacherStore.ts
// entities/pupil/model/pupilStore.ts
// entities/lesson/model/lessonStore.ts
// etc.
```

**Feature Stores (features/*/model/):**
```typescript
// features/lesson-management/create-lesson/model/createLessonStore.ts
// features/homework-check/model/homeworkCheckStore.ts
// etc.
```

### 7.2 React Query Setup

```typescript
// app/providers/QueryProvider.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
});

export function QueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

**Query Hooks:**
```typescript
// entities/lesson/api/lessonQueries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lessonAPI } from './lessonAPI';

export const LESSON_KEYS = {
  all: ['lessons'] as const,
  lists: () => [...LESSON_KEYS.all, 'list'] as const,
  list: (academicYearId: string) => [...LESSON_KEYS.lists(), academicYearId] as const,
  details: () => [...LESSON_KEYS.all, 'detail'] as const,
  detail: (lessonId: string) => [...LESSON_KEYS.details(), lessonId] as const,
};

// Fetch lessons for academic year
export function useLessons(academicYearId: string) {
  return useQuery({
    queryKey: LESSON_KEYS.list(academicYearId),
    queryFn: () => lessonAPI.getByAcademicYear(academicYearId),
    enabled: !!academicYearId,
  });
}

// Fetch single lesson
export function useLesson(lessonId: string) {
  return useQuery({
    queryKey: LESSON_KEYS.detail(lessonId),
    queryFn: () => lessonAPI.getById(lessonId),
    enabled: !!lessonId,
  });
}

// Create lesson
export function useCreateLesson() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: lessonAPI.create,
    onSuccess: (newLesson) => {
      // Invalidate lessons list
      queryClient.invalidateQueries(LESSON_KEYS.list(newLesson.academicYearId));
      
      // Optimistically add to cache
      queryClient.setQueryData(
        LESSON_KEYS.detail(newLesson.id),
        newLesson
      );
    },
  });
}

// Update lesson
export function useUpdateLesson() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ lessonId, data }) => lessonAPI.update(lessonId, data),
    onSuccess: (updatedLesson) => {
      queryClient.invalidateQueries(LESSON_KEYS.list(updatedLesson.academicYearId));
      queryClient.setQueryData(
        LESSON_KEYS.detail(updatedLesson.id),
        updatedLesson
      );
    },
  });
}

// Delete lesson
export function useDeleteLesson() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: lessonAPI.delete,
    onSuccess: (_, lessonId) => {
      queryClient.invalidateQueries(LESSON_KEYS.lists());
      queryClient.removeQueries(LESSON_KEYS.detail(lessonId));
    },
  });
}
```

### 7.3 API Client

```typescript
// shared/api/client.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies for auth
});

// Request interceptor (add auth token)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (handle errors)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      window.location.href = '/auth';
    }
    
    if (error.response?.status === 403) {
      // Forbidden - show error
      console.error('Access denied');
    }
    
    return Promise.reject(error);
  }
);
```

### 7.4 Complete API Specification

```typescript
// shared/api/endpoints.ts

// ============================================
// AUTHENTICATION
// ============================================
POST   /api/auth/signup          # Create new account
POST   /api/auth/login           # Login
POST   /api/auth/logout          # Logout
GET    /api/auth/session         # Get current session
POST   /api/auth/refresh         # Refresh token

// ============================================
// USERS
// ============================================
GET    /api/users                # List users (admin only)
GET    /api/users/:id            # Get user by ID
PATCH  /api/users/:id            # Update user
PATCH  /api/users/:id/role       # Change user role (superadmin only)
DELETE /api/users/:id            # Delete user (superadmin only)

// ============================================
// TEACHERS
// ============================================
GET    /api/teachers             # List all teachers
GET    /api/teachers/:id         # Get teacher by ID
POST   /api/teachers             # Create new teacher
PUT    /api/teachers/:id         # Update teacher
DELETE /api/teachers/:id         # Delete teacher
PATCH  /api/teachers/:id/deactivate  # Deactivate teacher
PATCH  /api/teachers/:id/activate    # Reactivate teacher

// ============================================
// GRADES
// ============================================
GET    /api/grades               # List all grades
GET    /api/grades/:id           # Get grade by ID
POST   /api/grades               # Create new grade
PUT    /api/grades/:id           # Update grade
DELETE /api/grades/:id           # Delete grade
PATCH  /api/grades/:id/deactivate  # Deactivate grade
GET    /api/grades/:id/pupils    # Get pupils in grade
GET    /api/grades/:id/teachers  # Get teachers of grade

// ============================================
// GRADE SETTINGS
// ============================================
GET    /api/grades/:id/settings  # Get grade settings
PUT    /api/grades/:id/settings  # Update grade settings
PATCH  /api/grades/:id/settings/reset  # Reset to defaults

// ============================================
// PUPILS
// ============================================
GET    /api/pupils               # List all pupils
GET    /api/pupils/:id           # Get pupil by ID
GET    /api/pupils/:id/records   # Get all records for pupil
POST   /api/pupils               # Create new pupil
PUT    /api/pupils/:id           # Update pupil
DELETE /api/pupils/:id           # Delete pupil
PATCH  /api/pupils/:id/deactivate  # Deactivate pupil

// ============================================
// FAMILIES
// ============================================
GET    /api/families             # List all families
GET    /api/families/:id         # Get family by ID
GET    /api/families/:id/pupils  # Get pupils in family
POST   /api/families             # Create new family
PUT    /api/families/:id         # Update family
DELETE /api/families/:id         # Delete family

// ============================================
// ACADEMIC YEARS
// ============================================
GET    /api/academic-years       # List all academic years
GET    /api/academic-years/:id   # Get academic year by ID
POST   /api/academic-years       # Create new academic year
PUT    /api/academic-years/:id   # Update academic year
DELETE /api/academic-years/:id   # Delete academic year
GET    /api/grades/:id/academic-years  # Get years for grade

// ============================================
// LESSONS
// ============================================
GET    /api/lessons              # List all lessons (active by default)
GET    /api/lessons?archived=true  # List archived lessons
GET    /api/lessons/:id          # Get lesson by ID
POST   /api/lessons              # Create new lesson
PUT    /api/lessons/:id          # Update lesson
PATCH  /api/lessons/:id/archive  # Archive lesson (soft delete)
PATCH  /api/lessons/:id/restore  # Restore lesson from archive
GET    /api/academic-years/:id/lessons  # Get lessons for year
GET    /api/lessons/:id/records  # Get all records for lesson

// ============================================
// GOLDEN VERSES
// ============================================
GET    /api/golden-verses                              # List verses (paginated, 15 per page)
GET    /api/golden-verses?page=1&bookNumber=43&chapter=3  # Filtered list with pagination
GET    /api/golden-verses/:id                          # Get verse by ID
GET    /api/golden-verses/by-reference                # Get verse by reference (POST body: {bookNumber, chapter, verse})
POST   /api/golden-verses                             # Create new verse (body: {reference: {bookNumber, chapter, verse}, text})
PUT    /api/golden-verses/:id                         # Update verse text
PATCH  /api/golden-verses/:id/text                    # Update only text
GET    /api/golden-verses/statistics                  # List verse statistics (paginated, 15 per page)
GET    /api/golden-verses/statistics?page=1&bookNumber=43&gradeId=:id  # Filtered statistics
GET    /api/golden-verses/:id/statistics              # Detailed statistics for specific verse
GET    /api/golden-verses/:id/usage                   # Usage count and lesson list
DELETE /api/golden-verses/:id                        # Delete verse (only if not used)

// ============================================
// GRADE EVENTS (Schedule/Calendar)
// ============================================
GET    /api/grades/:gradeId/events                   # List events for grade (optionally filtered by month)
GET    /api/grades/:gradeId/events?month=2024-10    # Get events for specific month
GET    /api/grades/:gradeId/events/:id               # Get event by ID
POST   /api/grades/:gradeId/events                   # Create new event (body: {date, eventType, title?, description?})
PUT    /api/grades/:gradeId/events/:id               # Update event
DELETE /api/grades/:gradeId/events/:id               # Delete event

// ============================================
// LESSON RECORDS
// ============================================
GET    /api/lesson-records       # List all records
GET    /api/lesson-records/:id   # Get record by ID
POST   /api/lesson-records       # Create new record
PUT    /api/lesson-records/:id   # Update record
DELETE /api/lesson-records/:id   # Delete record
POST   /api/lessons/:id/records/batch  # Batch create/update records

// ============================================
// POINTS SYSTEM
// ============================================
GET    /api/points/pupil/:id     # Get pupil points
GET    /api/points/grade/:id     # Get grade leaderboard
POST   /api/points/calculate     # Manually recalculate points
GET    /api/points/grade/:id/ranking  # Get grade ranking with progress

// ============================================
// ACHIEVEMENTS
// ============================================
GET    /api/achievements         # List all achievement types
GET    /api/achievements/pupil/:id  # Get pupil achievements
POST   /api/achievements/check   # Check and award achievements (auto)
GET    /api/achievements/recent  # Recent achievements in grade

// ============================================
// STATISTICS (Future)
// ============================================
GET    /api/statistics/pupil/:id      # Pupil statistics
GET    /api/statistics/grade/:id      # Grade statistics
GET    /api/statistics/lesson/:id     # Lesson statistics
```

### 7.5 Example API Implementation

```typescript
// entities/lesson/api/lessonAPI.ts
import { apiClient } from '@/shared/api/client';
import type { Lesson, CreateLessonDTO, UpdateLessonDTO } from '../model/types';

export const lessonAPI = {
  // Get all lessons for academic year (active only by default)
  getByAcademicYear: async (academicYearId: string, includeArchived = false): Promise<Lesson[]> => {
    const params = includeArchived ? '?archived=true' : '';
    const { data } = await apiClient.get(`/academic-years/${academicYearId}/lessons${params}`);
    return data;
  },
  
  // Get archived lessons for academic year
  getArchivedByAcademicYear: async (academicYearId: string): Promise<Lesson[]> => {
    const { data } = await apiClient.get(`/academic-years/${academicYearId}/lessons?archived=true`);
    return data;
  },
  
  // Get single lesson
  getById: async (lessonId: string): Promise<Lesson> => {
    const { data } = await apiClient.get(`/lessons/${lessonId}`);
    return data;
  },
  
  // Create lesson
  create: async (dto: CreateLessonDTO): Promise<Lesson> => {
    const { data } = await apiClient.post('/lessons', dto);
    return data;
  },
  
  // Update lesson
  update: async (lessonId: string, dto: UpdateLessonDTO): Promise<Lesson> => {
    const { data } = await apiClient.put(`/lessons/${lessonId}`, dto);
    return data;
  },
  
  // Archive lesson (soft delete)
  archive: async (lessonId: string, reason?: string): Promise<void> => {
    await apiClient.patch(`/lessons/${lessonId}/archive`, { reason });
  },
  
  // Restore lesson from archive
  restore: async (lessonId: string): Promise<void> => {
    await apiClient.patch(`/lessons/${lessonId}/restore`);
  },
  
  // Get lesson records
  getRecords: async (lessonId: string) => {
    const { data } = await apiClient.get(`/lessons/${lessonId}/records`);
    return data;
  },
};
```

**Points & Achievements API:**

```typescript
// entities/points/api/pointsAPI.ts
import { apiClient } from '@/shared/api/client';
import type { PupilPoints, GradeRanking, Achievement, PupilAchievement } from '../model/types';

export const pointsAPI = {
  // Get pupil points
  getPupilPoints: async (pupilId: string): Promise<PupilPoints> => {
    const { data } = await apiClient.get(`/points/pupil/${pupilId}`);
    return data;
  },
  
  // Get grade leaderboard
  getGradeLeaderboard: async (gradeId: string): Promise<GradeRanking[]> => {
    const { data } = await apiClient.get(`/points/grade/${gradeId}/ranking`);
    return data;
  },
  
  // Manually recalculate points (admin only)
  recalculatePoints: async (): Promise<void> => {
    await apiClient.post('/points/calculate');
  },
};

export const achievementsAPI = {
  // Get all achievement types
  getAllAchievements: async (): Promise<Achievement[]> => {
    const { data } = await apiClient.get('/achievements');
    return data;
  },
  
  // Get pupil achievements
  getPupilAchievements: async (pupilId: string): Promise<PupilAchievement[]> => {
    const { data } = await apiClient.get(`/achievements/pupil/${pupilId}`);
    return data;
  },
  
  // Get recent achievements in grade
  getRecentAchievements: async (gradeId: string): Promise<PupilAchievement[]> => {
    const { data } = await apiClient.get(`/achievements/recent?gradeId=${gradeId}`);
    return data;
  },
};
```

**Types для Points System:**

```typescript
// entities/points/model/types.ts

export interface PupilPoints {
  id: string;
  pupilId: string;
  gradeId: string;
  academicYearId: string;
  totalPoints: number;
  currentPoints: number;
  bricks: number;
  floors: number;
  currentStreak: number;
  bestStreak: number;
  lessonsAttended: number;
  perfectLessons: number;
}

export interface GradeRanking {
  rank: number;
  pupil: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  points: PupilPoints;
  progress: {
    houses: number;
    currentFloors: number;
    currentBricks: number;
    percentage: number;
  };
}

export interface Achievement {
  id: string;
  type: AchievementType;
  name: string;
  description: string;
  icon: string;
  points: number;
}

export interface PupilAchievement {
  id: string;
  pupilId: string;
  achievement: Achievement;
  earnedAt: Date;
  context?: string;
}

export enum AchievementType {
  EXCELLENT_STUDENT = 'EXCELLENT_STUDENT',
  PERFECT_ATTENDANCE = 'PERFECT_ATTENDANCE',
  VERSE_MASTER = 'VERSE_MASTER',
  DILIGENT_STUDENT = 'DILIGENT_STUDENT',
  FIRST_LESSON = 'FIRST_LESSON',
  HOUSE_BUILDER = 'HOUSE_BUILDER',
  CENTURY = 'CENTURY',
  HALF_YEAR = 'HALF_YEAR',
}
```

---

## 8. Development Roadmap

### Phase 1: Foundation (Weeks 1-2)
- [x] Project setup (React, TypeScript, Vite)
- [x] Database schema implementation (Prisma + PostgreSQL)
- [x] Basic authentication (Auth.js setup)
- [x] Core UI components (Shadcn UI integration)
- [x] Routing structure (Next.js App Router)
- [x] FSD folder structure
- [x] API client setup

**Deliverable:** Authentication working, database ready, basic navigation

---

### Phase 2: Dashboard Pages (Weeks 3-4)
- [ ] Teachers management page (CRUD)
- [ ] Grades management page (CRUD)
- [ ] Pupils management page (CRUD)
- [ ] Families management page (CRUD)
- [ ] Role-based access control implementation
- [ ] Search and filters for all entities

**Deliverable:** Complete dashboard with all management pages

---

### Phase 3: Grade & Lesson Management (Weeks 5-6)
- [ ] Grade data page (academic years list)
- [ ] Year lessons list page
- [ ] Create/edit lesson pages
- [ ] Lesson archive functionality (soft delete)
- [ ] Archived lessons view and restore
- [ ] Grade settings page
- [ ] Golden verses management
- [ ] Golden verses search/autocomplete

**Deliverable:** Complete lesson planning workflow with archive management

---

### Phase 4: Lesson Records & Homework Checking (Weeks 7-8)
- [ ] Lesson data overview page (hub)
- [ ] Complete lesson table view
- [ ] Homework checking interface
- [ ] Lesson record CRUD operations
- [ ] Pupil personal data page
- [ ] Batch record operations
- [ ] **Points calculation system (auto-calculate on save)**
- [ ] **Points display in pupil cards**

**Deliverable:** Complete homework checking workflow with points tracking

---

### Phase 5: Motivation System & Polish (Weeks 9-10)
- [ ] **House visualization component (домики)**
- [ ] **Grade leaderboard/ranking page**
- [ ] **Achievement system implementation**
- [ ] **Badge display in pupil profiles**
- [ ] **Achievement notification toasts**
- [ ] UI/UX refinements
- [ ] Error handling improvements
- [ ] Performance optimization
  - [ ] Code splitting
  - [ ] Image optimization
  - [ ] Query optimization
- [ ] Security audit
- [ ] User acceptance testing
- [ ] Documentation

**Deliverable:** Production-ready MVP with gamification

---

### Phase 6: Testing & Deployment (Week 11)
- [ ] UI/UX refinements
- [ ] Error handling improvements
- [ ] Performance optimization
  - [ ] Code splitting
  - [ ] Image optimization
  - [ ] Query optimization
- [ ] Security audit
- [ ] User acceptance testing
- [ ] Documentation

**Deliverable:** Production-ready MVP

---

### Phase 7: Future Enhancements (Post-MVP)

**High Priority:**
- [ ] Parent role implementation
- [ ] Pupil role implementation (limited access)
- [ ] Email notifications
- [ ] Reports and analytics
- [ ] Data export (Excel, PDF)

**Medium Priority:**
- [ ] Multi-language support (en, uk)
- [ ] Mobile app (React Native)
- [ ] Offline support (PWA)
- [ ] Calendar integration
- [ ] Photo galleries per lesson
- [ ] Resource library (lesson materials)

**Low Priority:**
- [ ] Attendance QR codes
- [ ] SMS notifications
- [ ] Direct messaging (teacher-parent)
- [ ] Payment system integration
- [ ] Church management system integration
- [ ] Automatic archive cleanup (configurable retention policy)
- [ ] Bulk archive/restore operations
- [ ] Archive export for long-term storage

---

## 9. Success Metrics

### MVP Success Criteria

**Functional Completeness:**
- [ ] All public, private, and dashboard pages implemented
- [ ] All CRUD operations working
- [ ] Authentication and authorization functional
- [ ] Role-based access control working correctly

**Performance:**
- [ ] Page load time < 3 seconds
- [ ] Time to interactive < 5 seconds
- [ ] No critical bugs
- [ ] Mobile responsive

**Data Integrity:**
- [ ] No data loss
- [ ] Accurate calculations
- [ ] Reliable backups working

**User Satisfaction:**
- [ ] Positive feedback from 3+ pilot users
- [ ] Tasks completable efficiently (< 3 clicks for common operations)
- [ ] UI intuitive (< 30 min onboarding time)

---

## 10. Deployment Strategy

### Environment Variables
```env
# Database
DATABASE_URL="postgresql://user:pass@host:5432/sunday_school"

# Auth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://app.example.com"

# Application
NODE_ENV="production"
FRONTEND_URL="https://app.example.com"
API_URL="https://api.example.com"

# Optional: File storage
S3_BUCKET="sunday-school-uploads"
S3_REGION="us-east-1"
S3_ACCESS_KEY="..."
S3_SECRET_KEY="..."
```

### Deployment Checklist
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Seed data created (initial admin user)
- [ ] HTTPS enabled
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Error tracking set up (Sentry)
- [ ] Backup strategy in place (daily automated)
- [ ] Monitoring enabled (uptime, performance)
- [ ] Domain configured
- [ ] SSL certificate installed

### Recommended Hosting
- **Frontend:** Vercel / Netlify
- **Backend:** Railway / Render / Fly.io
- **Database:** Supabase / Neon / Railway Postgres
- **File Storage:** Supabase Storage / AWS S3 / Cloudinary

---

## 11. Key Decisions & Rationale

### Why React 19?
- Latest features and performance improvements
- Modern patterns (use, Suspense improvements)
- Strong ecosystem
- Easy TypeScript integration

### Why TypeScript?
- Type safety reduces runtime errors
- Better IDE support and autocomplete
- Improved maintainability
- Self-documenting code

### Why Prisma ORM?
- Type-safe database access
- Excellent TypeScript integration
- Migration management
- Great developer experience

### Why PostgreSQL?
- Robust and reliable
- ACID compliance
- Advanced features (JSON, full-text search)
- Excellent Prisma support
- Scalable

### Why Auth.js?
- Industry standard
- Secure by default
- Multiple authentication strategies
- Session management built-in

### Why Zustand?
- Lightweight (< 1KB)
- Simple API
- No boilerplate
- TypeScript-first
- Perfect for global UI state

### Why React Query?
- Excellent caching strategy
- Automatic background refetching
- Optimistic updates
- Reduces boilerplate
- Great DevTools

### Why Feature-Sliced Design?
- Clear separation of concerns
- Scalable architecture
- Easy to navigate codebase
- Team collaboration friendly
- Maintainable long-term

### Why Shadcn UI?
- Customizable components
- Copy-paste approach (no dependency bloat)
- Built on Radix UI (accessible)
- Tailwind CSS integration
- Modern design

---

## 12. Appendix

### Glossary
- **Grade** — группа учеников, организованная по возрасту
- **Academic Year** — учебный год (обычно с сентября по май)
- **Golden Verse** — библейский стих для запоминания
- **Lesson Record** — запись об успеваемости ученика на конкретном уроке
- **Rehearsal** — спевка (репетиция), которую могут посещать ученики
- **CRUD** — Create, Read, Update, Delete (базовые операции)
- **RBAC** — Role-Based Access Control (контроль доступа на основе ролей)
- **MVP** — Minimum Viable Product (минимально жизнеспособный продукт)

### Technical References
- [React Documentation](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [Auth.js Docs](https://authjs.dev/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [React Query Docs](https://tanstack.com/query/latest)
- [Zustand Docs](https://github.com/pmndrs/zustand)

---

**Конец Master PRD v2.0**

*Документ подготовлен на основе анализа и объединения лучших практик из трёх спецификаций: Claude v1.0, GPT v1.0, и Qwen v1.0*

*Дата создания: 30 октября 2025*  
*Версия: 2.0 (Master Specification)*  
*Статус: Production-Ready*

**Модальное окно проверки ученика:**
```
┌──────────────────────────────────────────────────────────────┐
│ Проверка ДЗ — Попова Виктория                        [✕]     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  👤 Попова Виктория (10 лет)                                 │
│  Урок #6: Жертвоприношение Авраама                          │
│                                                              │
│  ══════════════════════════════════════════                  │
│                                                              │
│  ПРИСУТСТВИЕ:                                                │
│  ┌──────────────────────────────────────┐                   │
│  │   [✓ Присутствовал]   [ Отсутствовал]│                   │
│  └──────────────────────────────────────┘                   │
│                                                              │
│  ──────────────────────────────────────────                  │
│                                                              │
│  📖 ЗОЛОТЫЕ СТИХИ:                                           │
│                                                              │
│  Стих 1: Быт. 22:14                                          │
│  "И нарек Авраам имя месту тому: Иегова-ире..."             │
│  ┌──────────────────────────────────────────────┐           │
│  │  Баллы: [ 0 ]  [ 1 ]  [✓2 ]                │           │
│  │  0 - не знает | 1 - с подсказкой | 2 - назубок│         │
│  └──────────────────────────────────────────────┘           │
│  (аналогично для Стиха 2 и Стиха 3)                         │
│                                                              │
│  ──────────────────────────────────────────                  │
│                                                              │
│  📝 ДОМАШНЕЕ ЗАДАНИЕ:                                         │
│                                                              │
│  Баллы за тест (0-10):  [███████████8████████]              │
│                                                              │
│  Баллы за тетрадь (0-10): [█████████7█████████]             │
│                                                              │
│  ──────────────────────────────────────────                  │
│                                                              │
│  🎵 ПОСЕЩЕНИЕ СПЕВКИ:                                         │
│  ┌──────────────────────────────────────┐                   │
│  │   [✓ Был(а)]   [ Не был(а)]          │                   │
│  └──────────────────────────────────────┘                   │
│                                                              │
│  ══════════════════════════════════════════                  │
│                                                              │
│  [← Предыдущий]  [Отмена]  [Сохранить]  [Следующий →]       │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Модальное окно проверки ученика:**
```
┌──────────────────────────────────────────────────────────────┐
│ Проверка ДЗ — Попова Виктория                        [✕]     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  👤 Попова Виктория (10 лет)                                 │
│  Урок #6: Жертвоприношение Авраама                          │
│                                                              │
│  ══════════════════════════════════════════                  │
│                                                              │
│  ПРИСУТСТВИЕ:                                                │
│  ┌──────────────────────────────────────┐                   │
│  │   [✓ Присутствовал]   [ Отсутствовал]│                   │
│  └──────────────────────────────────────┘                   │
│                                                              │
│  ──────────────────────────────────────────                  │
│                                                              │
│  📖 ЗОЛОТЫЕ СТИХИ:                                           │
│                                                              │
│  Стих 1: Быт. 22:14                                          │
│  "И нарек Авраам имя месту тому: Иегова-ире..."             │
│  ┌──────────────────────────────────────────────┐           │
│  │  Баллы: [ 0 ]  [ 1 ]  [✓2 ]                │           │
│  │  0 - не знает | 1 - с подсказкой | 2 - назубок│         │
│  └──────────────────────────────────────────────┘           │
│  (аналогично для Стиха 2 и Стиха 3)                         │
│                                                              │
│  ──────────────────────────────────────────                  │
│                                                              │
│  📝 ДОМАШНЕЕ ЗАДАНИЕ:                                         │
│                                                              │
│  Баллы за тест (0-10):                                        │
│  ┌──────────────────────────────────┐                       │
│  │ [███████████8████████]            │                       │
│  │  0 1 2 3 4 5 6 7 8 9 10          │                       │
│  └──────────────────────────────────┘                       │
│                                                              │
│  Баллы за тетрадь (0-10):                                     │
│  ┌──────────────────────────────────┐                       │
│  │ [█████████7█████████]             │                       │
│  │  0 1 2 3 4 5 6 7 8 9 10          │                       │
│  └──────────────────────────────────┘                       │
│                                                              │
│  ──────────────────────────────────────────                  │
│                                                              │
│  🎵 ПОСЕЩЕНИЕ СПЕВКИ:                                         │
│  ┌──────────────────────────────────────┐                   │
│  │   [✓ Был(а)]   [ Не был(а)]          │                   │
│  └──────────────────────────────────────┘                   │
│                                                              │
│  ══════════════════════════════════════════                  │
│                                                              │
│  [← Предыдущий]  [Отмена]  [Сохранить]  [Следующий →]       │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**UI-Rules для слайдеров:**
- Каждый слайдер (тест, тетрадь) должен содержать:
  - Визуальный бар с ползунком для выбора значения
  - Текущее числовое значение рядом с бором
  - Шкала значений (0, 1, 2, 3... 10) снизу под слайдером для быстрой ориентации пользователя

**Вкладка "Статистика":**
- Посещаемость по месяцам (процент)
- Золотые стихи: распределение по оценкам (%)
- Домашние задания: средние баллы за тест и тетрадь
- Посещение спевок: общий процент

**Вкладка "Статистика":**
- Посещаемость по месяцам (процент)
- Золотые стихи: распределение по оценкам (%)
- Домашние задания: средние баллы за тест и тетрадь
- **Посещение спевок (расширенное):**
  - Всего спевок в период
  - Посещено (абс. число и %)
  - **Анализ пропусков:**
    - Был на уроке, но не пришёл на спевку (абс. число и %)
    - Не мог прийти (отсутствовал на уроке) (абс. число и %)
  - **UI-Rules:**
    - Расчёт: для каждого урока проверяется: если `isPresent=true` И `attendedRehearsal=false`, то это пропуск "был, не пришёл"
    - Отображение: помогает учителю выявить нежелание участвовать в спевке при наличии возможности
    - Информационная заметка: объяснить смысл метрики "был, но не пришёл"

**Lesson Statuses:**
- PUBLISHED — активный урок (виден в основном списке)
- ARCHIVED — перемещён в архив
- REQUESTED_FOR_RESTORE — отправлен запрос на восстановление (ожидает решения Admin)

**Routes:**
- GET /grades/:gradeId/archives                # Архив выбранной группы (секции по учебным годам)
- GET /admin/lessons-archive                   # Централизованный архив (admin-only)
- PATCH /lessons/:id/archive                   # Перевести урок в ARCHIVED
- PATCH /lessons/:id/request-restore           # Пометить как REQUESTED_FOR_RESTORE
- PATCH /lessons/:id/publish                   # Вернуть в PUBLISHED

**UI Rules (Archives):**
- Страница архива группы: путь содержит gradeId, контент разбит на секции учебных годов
- Для REQUESTED_FOR_RESTORE показывать информер и скрывать редактирование до решения
- Admin-страница: отдельная секция "Запросы на восстановление" с действиями Одобрить/Отклонить

