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
- ⏸️ Система мотивации (баллы) — следующая итерация

---

## 2. Technical Foundation

### 2.1 Технологический стек

```
Frontend:
├── Framework: React 19+ с TypeScript
├── UI: Shadcn UI + Tailwind CSS
├── Routing: React Router v6+
├── State: Zustand (global) + React Query (server)
└── Build: Vite

Backend:
├── Runtime: Node.js
├── Framework: Express/Next.js API Routes
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
│   ├── grade-data/               # Private
│   │   └── GradeDataPage.tsx
│   ├── year-lessons-list/
│   │   └── YearLessonsListPage.tsx
│   ├── checking-homework-all/
│   │   └── CheckingHomeworkPage.tsx
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
│   │   ├── edit-lesson/
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
│   │   └── roles.ts
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
│   ├── /grade-data              # Academic years list for grade
│   ├── /year-lessons-list       # Lessons list for academic year
│   ├── /grade-data-settings     # Grade assessment settings
│   ├── /new-lesson              # Create new lesson
│   ├── /edit-lesson/:id         # Edit existing lesson
│   ├── /lesson-data/:id         # Lesson overview (hub page)
│   ├── /lesson-data-all/:id     # Complete lesson table
│   ├── /checking-homework-all/:id # Homework checking interface
│   └── /pupil-personal-data/:id # Pupil profile and history
│
└── 📂 Dashboard Routes (admin only)
    ├── /teachers                # Teachers management
    ├── /grades-list             # Grades management
    ├── /pupils                  # Pupils management
    └── /families                # Families management
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
  grades        Grade[]   @relation("GradeTeachers")
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
  teachers      Teacher[] @relation("GradeTeachers")
  pupils        Pupil[]
  academicYears AcademicYear[]
  settings      GradeSettings?
  
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
// PUPIL (Student)
// ============================================

model Pupil {
  id            String    @id @default(cuid())
  userId        String?   @unique  // Optional: for pupil accounts
  firstName     String
  lastName      String
  middleName    String?
  dateOfBirth   DateTime
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
  motherFirstName   String?
  motherLastName    String?
  motherPhone       String?
  isActive          Boolean   @default(true)
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  // Relations
  pupils            Pupil[]
  parentUsers       User[]    @relation("ParentUsers")
  
  @@index([fatherLastName])
  @@index([motherLastName])
  @@index([isActive])
}

// ============================================
// ACADEMIC YEAR
// ============================================

model AcademicYear {
  id            String    @id @default(cuid())
  gradeId       String
  year          String    // e.g., "2024-2025"
  startDate     DateTime
  endDate       DateTime
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  grade         Grade     @relation(fields: [gradeId], references: [id], onDelete: Cascade)
  lessons       Lesson[]
  
  @@unique([gradeId, year])
  @@index([gradeId])
  @@index([year])
  @@index([isActive])
}

// ============================================
// LESSON
// ============================================

model Lesson {
  id              String    @id @default(cuid())
  academicYearId  String
  lessonNumber    Int       // Sequential within academic year
  topic           String
  date            DateTime
  teacherId       String
  isArchived      Boolean   @default(false)  // Soft delete
  archivedAt      DateTime?  // When archived
  archivedBy      String?    // Who archived
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  // Relations
  academicYear    AcademicYear  @relation(fields: [academicYearId], references: [id], onDelete: Cascade)
  teacher         Teacher       @relation(fields: [teacherId], references: [id])
  goldenVerses    GoldenVerse[] @relation("LessonGoldenVerses")
  lessonRecords   LessonRecord[]
  
  @@unique([academicYearId, lessonNumber])
  @@index([academicYearId])
  @@index([teacherId])
  @@index([date])
  @@index([isArchived])
}

// ============================================
// GOLDEN VERSE
// ============================================

model GoldenVerse {
  id            String    @id @default(cuid())
  reference     String    @unique  // e.g., "Ин. 3:16"
  text          String    @db.Text // Full verse text
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  lessons       Lesson[]  @relation("LessonGoldenVerses")
  
  @@index([reference])
}

// ============================================
// LESSON RECORD (Attendance & Scores)
// ============================================

model LessonRecord {
  id                  String    @id @default(cuid())
  lessonId            String
  pupilId             String
  
  // Attendance
  isPresent           Boolean   @default(true)
  
  // Golden Verses (3 verses per lesson)
  goldenVerse1Score   Int       @default(0)  // 0, 1, or 2 points
  goldenVerse2Score   Int       @default(0)  // 0, 1, or 2 points
  goldenVerse3Score   Int       @default(0)  // 0, 1, or 2 points
  
  // Homework
  testScore           Int       @default(0)  // 0-10 points
  notebookScore       Int       @default(0)  // 0-10 points
  
  // Additional
  attendedRehearsal   Boolean   @default(false)  // Посещение спевки
  
  // Timestamps
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
  
  // Relations
  lesson              Lesson    @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  pupil               Pupil     @relation(fields: [pupilId], references: [id], onDelete: Cascade)
  
  @@unique([lessonId, pupilId])
  @@index([lessonId])
  @@index([pupilId])
}
```

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

#### /grade-data — Grade Overview
**Purpose:** Display academic years for selected grade

**Components:**
- Grade header (name, age range)
- Academic year cards with lesson count
- Link to grade settings
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

---

#### /year-lessons-list — Lessons List
**Purpose:** CRUD operations on lessons for academic year

**Components:**
- Lessons table (number, date, topic, teacher)
- Create new lesson button
- Edit/Delete actions per lesson
- Pagination

**Store:**
```typescript
// entities/lesson/model/lessonStore.ts
interface LessonListState {
  lessons: Lesson[];
  archivedLessons: Lesson[];
  isLoading: boolean;
  
  fetchLessons: (academicYearId: string) => Promise<void>;
  fetchArchivedLessons: (academicYearId: string) => Promise<void>;
  archiveLesson: (lessonId: string, reason?: string) => Promise<void>;
  restoreLesson: (lessonId: string) => Promise<void>;
}
```

**Access:** Teacher (own grades), Admin

---

#### /grade-data-settings — Grade Settings
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

#### /new-lesson — Create Lesson
**Purpose:** Create new lesson with golden verses

**Components:**
- Lesson number (auto-generated)
- Date picker
- Topic input
- Teacher selector
- Golden verses selector (3 required)
- Save/Cancel buttons

**Form Store:**
```typescript
// features/lesson-management/create-lesson/model/createLessonStore.ts
interface CreateLessonState {
  form: {
    lessonNumber: number;
    date: Date | null;
    topic: string;
    teacherId: string;
    goldenVerses: GoldenVerse[];
  };
  
  updateField: (field: string, value: any) => void;
  addGoldenVerse: (verse: GoldenVerse) => void;
  removeGoldenVerse: (verseId: string) => void;
  submitLesson: () => Promise<void>;
  reset: () => void;
}
```

**Access:** Teacher (own grades), Admin

---

#### /lesson-data/:id — Lesson Overview (Hub Page)
**Purpose:** Central navigation point for lesson

**Components:**
- Lesson info card (topic, date, teacher, verses)
- Progress indicator (records completed)
- Two main action buttons:
  - "Open Complete Lesson Table" → /lesson-data-all
  - "Check Homework" → /checking-homework-all
- Edit lesson button

**Access:** Teacher (own grades), Admin

---

#### /lesson-data-all/:id — Complete Lesson Table
**Purpose:** View all pupils' results for lesson

**Components:**
- Comprehensive table with columns:
  - Pupil name + avatar
  - Attendance (✓/✗)
  - Golden Verse 1-3 scores (0/1/2)
  - Test score (0-10)
  - Notebook score (0-10)
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

#### /checking-homework-all/:id — Homework Checking Interface
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
**Purpose:** Complete pupil history and profile

**Components:**
- Profile card (avatar, name, DOB, age, family, grade)
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

### 5.3 Dashboard Pages (Admin Only)

#### /teachers — Teachers Management
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
- Family selection (with "Create new family" option)
- Grade assignment
- Status toggle

**Access:** Admin

---

#### /families — Families Management
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
  
  <Route
    path="/grade-data"
    element={
      <ProtectedRoute allowedRoles={['teacher', 'admin']}>
        <GradeDataPage />
      </ProtectedRoute>
    }
  />
  
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
  familyId: z.string().min(1, 'Выберите семью'),
  gradeId: z.string().min(1, 'Выберите группу'),
  avatar: z.string().url().optional(),
});

// Lesson validation
export const lessonSchema = z.object({
  topic: z.string().min(3, 'Минимум 3 символа').max(200, 'Максимум 200 символов'),
  date: z.date()
    .max(
      new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000),
      'Дата не может быть более чем на 2 года в будущем'
    ),
  teacherId: z.string().min(1, 'Выберите преподавателя'),
  goldenVerses: z.array(z.object({
    reference: z.string().min(1),
    text: z.string().min(1),
  })).length(3, 'Требуется ровно 3 золотых стиха'),
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
  goldenVerse1Score: z.number().int().min(0).max(2),
  goldenVerse2Score: z.number().int().min(0).max(2),
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
GET    /api/golden-verses        # List all verses
GET    /api/golden-verses/:id    # Get verse by ID
GET    /api/golden-verses/search?q=<query>  # Search verses
POST   /api/golden-verses        # Create new verse
PUT    /api/golden-verses/:id    # Update verse
DELETE /api/golden-verses/:id    # Delete verse

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

---

## 8. Development Roadmap

### Phase 1: Foundation (Weeks 1-2)
- [x] Project setup (React, TypeScript, Vite)
- [x] Database schema implementation (Prisma + PostgreSQL)
- [x] Basic authentication (Auth.js setup)
- [x] Core UI components (Shadcn UI integration)
- [x] Routing structure (React Router)
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

**Deliverable:** Complete homework checking workflow

---

### Phase 5: Polish & Testing (Weeks 9-10)
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

### Phase 6: Future Enhancements (Post-MVP)

**High Priority:**
- [ ] Points calculation system (motivation v2.0)
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

