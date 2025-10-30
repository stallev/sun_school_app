# Sunday School App - Extended Product Requirements Document

## 1. Executive Summary

### 1.1 Product Overview
Sunday School App - это веб-приложение для управления воскресной школой баптистской церкви. Приложение обеспечивает комплексное управление учебным процессом, включая отслеживание успеваемости учеников, управление преподавателями, планирование уроков и ведение учета посещаемости.

### 1.2 Target Users
- **Pupils** (ученики) - могут просматривать свои данные
- **Parents** - родители учеников с ограниченным доступом к данным своих детей
- **Teachers** - преподаватели с доступом к данным своих групп
- **Admin** - администраторы с расширенным доступом к управлению
- **Superadmin** - полный доступ ко всем функциям системы

### 1.3 Key Goals
- Автоматизация учета успеваемости учеников воскресной школы
- Упрощение процесса проверки домашних заданий и запоминания золотых стихов
- Централизованное хранение данных о группах, учениках, преподавателях и семьях
- Обеспечение прозрачности учебного процесса для родителей и преподавателей

---

## 2. Technical Stack

### 2.1 Frontend
- **Framework**: React.js 19+
- **Language**: TypeScript
- **State Management**: Zustand (global state), React Query (server state)
- **UI Components**: Shadcn UI
- **Routing**: React Router v6+

### 2.2 Backend & Database
- **ORM**: Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: Auth.js (NextAuth.js)

### 2.3 Architecture
- **Architectural Approach**: Feature-Sliced Design (FSD) + Atomic Design
- **Design Patterns**: Component-based architecture, Custom Hooks, Context API

### 2.4 Development Constraints
- Автоматизированное тестирование на MVP этапе не производится
- Система мотивации с расчетом баллов будет добавлена в следующих итерациях

---

## 3. Information Architecture

### 3.1 Site Map

```
/
├── Public Routes
│   ├── /auth (Login/Signup)
│   └── /not-found (404)
│
├── Private Routes (Authenticated Users)
│   ├── /grade-data (Grade Overview)
│   ├── /year-lessons-list (Academic Year Lessons)
│   ├── /grade-data-settings (Grade Settings)
│   ├── /new-lesson (Create Lesson)
│   ├── /edit-lesson (Edit Lesson)
│   ├── /lesson-data (Lesson Overview)
│   ├── /lesson-data-all (Complete Lesson Table)
│   ├── /checking-homework-all (Homework Check)
│   └── /pupil-personal-data (Student Profile)
│
└── Dashboard Routes (Admin/Superadmin)
    ├── /teachers (Teachers Management)
    ├── /grades-list (Grades Management)
    ├── /pupils (Students Management)
    └── /families (Families Management)
```

### 3.2 User Flow Diagram

```
User Authentication → Role-Based Dashboard → 
    → [Teacher] → Grade Selection → Lessons Management → Homework Checking
    → [Admin] → Management Dashboard → CRUD Operations on Entities
    → [Pupil/Parent] → Personal Data View → Read-Only Access
```

---

## 4. Data Model & Entities

### 4.1 Core Entities

#### User
```typescript
interface User {
  id: string;
  email: string;
  password: string; // hashed
  role: 'pupil' | 'parent' | 'teacher' | 'admin' | 'superadmin';
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}
```

#### Teacher
```typescript
interface Teacher {
  id: string;
  userId: string; // FK to User
  firstName: string;
  lastName: string;
  middleName?: string;
  avatar?: string; // URL to image
  grades: Grade[]; // Many-to-Many relationship
  lessons: Lesson[]; // Lessons taught by this teacher
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Grade (Group/Class)
```typescript
interface Grade {
  id: string;
  name: string; // e.g., "Младшая группа", "Средняя группа"
  ageRange: string; // e.g., "6-8 лет"
  description?: string;
  teachers: Teacher[]; // Many-to-Many
  pupils: Pupil[]; // One-to-Many
  academicYears: AcademicYear[]; // One-to-Many
  gradeSettings: GradeSettings; // One-to-One
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Pupil (Student)
```typescript
interface Pupil {
  id: string;
  userId?: string; // FK to User (optional, for pupils with accounts)
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: Date;
  avatar?: string;
  familyId: string; // FK to Family
  gradeId: string; // FK to Grade
  lessonRecords: LessonRecord[]; // One-to-Many
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Family
```typescript
interface Family {
  id: string;
  fatherFirstName?: string;
  fatherLastName?: string;
  fatherPhone?: string;
  motherFirstName?: string;
  motherLastName?: string;
  motherPhone?: string;
  pupils: Pupil[]; // One-to-Many
  parentUsers: User[]; // Many-to-Many (users with parent role)
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### AcademicYear
```typescript
interface AcademicYear {
  id: string;
  gradeId: string; // FK to Grade
  year: string; // e.g., "2024-2025"
  startDate: Date;
  endDate: Date;
  lessons: Lesson[]; // One-to-Many
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Lesson
```typescript
interface Lesson {
  id: string;
  academicYearId: string; // FK to AcademicYear
  lessonNumber: number; // Sequential number within academic year
  topic: string;
  date: Date;
  teacherId: string; // FK to Teacher (responsible teacher)
  goldenVerses: GoldenVerse[]; // Many-to-Many (3 verses per lesson)
  lessonRecords: LessonRecord[]; // One-to-Many
  createdAt: Date;
  updatedAt: Date;
}
```

#### GoldenVerse
```typescript
interface GoldenVerse {
  id: string;
  reference: string; // e.g., "Ин. 3:16"
  text: string; // Full verse text
  lessons: Lesson[]; // Many-to-Many
  createdAt: Date;
  updatedAt: Date;
}
```

#### LessonRecord
```typescript
interface LessonRecord {
  id: string;
  lessonId: string; // FK to Lesson
  pupilId: string; // FK to Pupil
  
  // Attendance
  isPresent: boolean;
  
  // Golden Verses (3 verses per lesson)
  goldenVerse1Score: number; // 0, 1, or 2 points
  goldenVerse2Score: number; // 0, 1, or 2 points
  goldenVerse3Score: number; // 0, 1, or 2 points
  
  // Homework
  testScore: number; // 0-10 points
  notebookScore: number; // 0-10 points
  
  // Additional
  attendedRehearsal: boolean; // Посещение спевки
  
  createdAt: Date;
  updatedAt: Date;
}
```

#### GradeSettings
```typescript
interface GradeSettings {
  id: string;
  gradeId: string; // FK to Grade (One-to-One)
  
  // Visibility toggles for assessment parameters
  showGoldenVerses: boolean;
  showTestScore: boolean;
  showNotebookScore: boolean;
  showRehearsal: boolean;
  
  // Custom labels (optional)
  goldenVersesLabel?: string;
  testScoreLabel?: string;
  notebookScoreLabel?: string;
  rehearsalLabel?: string;
  
  updatedAt: Date;
}
```

### 4.2 Database Relationships Summary

```
User ←→ Teacher (1:1)
User ←→ Pupil (1:1, optional)
User ←→ Family (M:N for parents)

Grade ←→ Teacher (M:N)
Grade → Pupil (1:N)
Grade → AcademicYear (1:N)
Grade ←→ GradeSettings (1:1)

Family → Pupil (1:N)

AcademicYear → Lesson (1:N)

Lesson → LessonRecord (1:N)
Lesson ←→ GoldenVerse (M:N)
Lesson → Teacher (N:1)

Pupil → LessonRecord (1:N)
```

---

## 5. Feature Requirements

### 5.1 Public Pages

#### 5.1.1 Authentication Page (/auth)

**Purpose**: User login and registration

**Layout Components**:
- Logo and app branding
- Tab switcher (Login / Sign Up)
- Login form with fields:
  - Email input
  - Password input
  - "Remember me" checkbox
  - "Forgot password?" link
  - "Login" button
- Sign Up form with fields:
  - Email input
  - Password input
  - Confirm password input
  - Role selection (disabled for public signup)
  - "Sign Up" button

**Functionality**:
- Form validation (email format, password strength, matching passwords)
- Auth.js integration for authentication
- Redirect to appropriate dashboard based on user role
- Error handling and display
- Loading states during authentication

**Access Control**: Public (unauthenticated users only)

**Wireframe Description**:
```
+------------------------------------------+
|            Sunday School App             |
|              [LOGO]                      |
+------------------------------------------+
|                                          |
|     [ Login ]  [ Sign Up ]               |
|                                          |
|     Email:    [________________]         |
|     Password: [________________]         |
|                                          |
|     [ ] Remember me                      |
|                                          |
|     [      Login Button      ]           |
|                                          |
|     Forgot password?                     |
|                                          |
+------------------------------------------+
```

#### 5.1.2 Not Found Page (/not-found)

**Purpose**: Handle invalid routes

**Layout Components**:
- 404 error message
- Friendly explanation text
- Navigation button to home/dashboard
- Optional: Search functionality

**Access Control**: Public

**Wireframe Description**:
```
+------------------------------------------+
|                                          |
|              404                         |
|        Page Not Found                    |
|                                          |
|   The page you're looking for           |
|   doesn't exist or has been moved.      |
|                                          |
|     [  Go to Dashboard  ]                |
|                                          |
+------------------------------------------+
```

---

### 5.2 Private Pages (Authenticated Users)

#### 5.2.1 Grade Data Page (/grade-data)

**Purpose**: Display list of academic years for selected grade with navigation to year-specific lessons

**Layout Components**:
- Page header with grade information (name, age range)
- Breadcrumb navigation
- List/Grid of academic year cards:
  - Academic year title (e.g., "2024-2025")
  - Date range
  - Number of lessons in this year
  - Link to year lessons list
  - Quick stats (if available)
- Navigation to related pages:
  - Link to grade settings
  - Link to all pupils in this grade

**Functionality**:
- Display all academic years for the current grade
- Click on academic year card → navigate to /year-lessons-list
- Sort academic years (newest first by default)
- Filter options (active/archived years)

**Access Control**: Teachers (own grades), Admin, Superadmin

**Wireframe Description**:
```
+------------------------------------------+
| Home > Grades > [Grade Name]             |
+------------------------------------------+
| [Grade Name] - [Age Range]               |
| [Settings Icon] Grade Settings           |
+------------------------------------------+
|                                          |
| Academic Years:                          |
|                                          |
| +----------------------------------+     |
| | 2024-2025                        |     |
| | Sep 1, 2024 - May 31, 2025      |     |
| | 36 lessons                       |     |
| | [View Lessons →]                 |     |
| +----------------------------------+     |
|                                          |
| +----------------------------------+     |
| | 2023-2024                        |     |
| | Sep 1, 2023 - May 31, 2024      |     |
| | 34 lessons                       |     |
| | [View Lessons →]                 |     |
| +----------------------------------+     |
|                                          |
+------------------------------------------+
```

#### 5.2.2 Year Lessons List Page (/year-lessons-list)

**Purpose**: Display all lessons for a specific academic year with CRUD operations

**Layout Components**:
- Page header with academic year info
- Breadcrumb navigation
- "Create New Lesson" button (prominent, top right)
- Table/List of lessons with columns:
  - Lesson number
  - Date
  - Topic
  - Responsible teacher
  - Number of golden verses
  - Actions (Edit, Delete, View)
- Pagination controls (if needed)

**Functionality**:
- Display all lessons for selected academic year
- Click "Create New Lesson" → navigate to /new-lesson
- Click "Edit" icon → navigate to /edit-lesson
- Click "Delete" icon → confirmation modal → delete lesson
- Click on lesson row → navigate to /lesson-data
- Sort by date, lesson number, topic
- Search by topic or teacher name

**Access Control**: Teachers (own grades), Admin, Superadmin

**Wireframe Description**:
```
+------------------------------------------+
| Home > Grade > 2024-2025 Academic Year   |
+------------------------------------------+
| 2024-2025 Lessons                        |
|                    [+ Create New Lesson] |
+------------------------------------------+
|                                          |
| # | Date       | Topic      | Teacher |  |
|---|------------|------------|---------|  |
| 1 | 09/01/2024 | Creation   | John D. | ✏️ 🗑️|
| 2 | 09/08/2024 | Noah's Ark | Jane S. | ✏️ 🗑️|
| 3 | 09/15/2024 | Abraham    | John D. | ✏️ 🗑️|
|   |            |            |         |  |
+------------------------------------------+
| « Previous    Page 1 of 5    Next »     |
+------------------------------------------+
```

#### 5.2.3 Grade Data Settings Page (/grade-data-settings)

**Purpose**: Configure which assessment parameters are visible/hidden for specific grade

**Layout Components**:
- Page header with grade information
- Breadcrumb navigation
- Settings form with toggle switches:
  - Show/Hide Golden Verses assessment
  - Show/Hide Test Score
  - Show/Hide Notebook Score
  - Show/Hide Rehearsal Attendance
- Optional: Custom labels for each parameter
- "Save Settings" button
- "Reset to Default" button

**Functionality**:
- Load current grade settings
- Toggle visibility for each assessment parameter
- Edit custom labels (optional feature)
- Save changes to database
- Show confirmation message
- Reset to default settings option

**Access Control**: Admin, Superadmin

**Wireframe Description**:
```
+------------------------------------------+
| Home > Grades > [Grade Name] > Settings  |
+------------------------------------------+
| Grade Assessment Settings                |
| Configure visible parameters for this    |
| grade's lesson records.                  |
+------------------------------------------+
|                                          |
| Golden Verses:       [ON]  OFF           |
| Custom Label: [Golden Verses___]         |
|                                          |
| Test Score:          [ON]  OFF           |
| Custom Label: [Test Score_______]        |
|                                          |
| Notebook Score:      [ON]  OFF           |
| Custom Label: [Notebook Score___]        |
|                                          |
| Rehearsal:           [ON]  OFF           |
| Custom Label: [Rehearsal_________]       |
|                                          |
| [Reset to Default] [  Save Settings  ]   |
|                                          |
+------------------------------------------+
```

#### 5.2.4 New Lesson Page (/new-lesson)

**Purpose**: Create a new lesson for the academic year

**Layout Components**:
- Page header
- Breadcrumb navigation
- Form with fields:
  - Lesson number (auto-generated or manual)
  - Date picker
  - Topic (text input)
  - Responsible teacher (dropdown)
  - Golden verses section:
    - 3 verse selectors (search/create new verses)
    - Each verse shows: reference and text preview
  - Notes (optional textarea)
- "Cancel" and "Create Lesson" buttons

**Functionality**:
- Auto-generate next lesson number
- Date picker with validation
- Teacher dropdown populated from grade's teachers
- Golden verse selection:
  - Search existing verses by reference or text
  - Create new golden verse (inline or modal)
  - Must select exactly 3 verses
- Form validation
- Submit → create lesson in database
- Redirect to /year-lessons-list on success

**Access Control**: Teachers (own grades), Admin, Superadmin

**Wireframe Description**:
```
+------------------------------------------+
| Home > Grade > 2024-2025 > New Lesson    |
+------------------------------------------+
| Create New Lesson                        |
+------------------------------------------+
|                                          |
| Lesson Number: [37___] (auto)            |
|                                          |
| Date: [📅 10/30/2025]                    |
|                                          |
| Topic: [____________________________]    |
|                                          |
| Teacher: [Select Teacher ▼]             |
|                                          |
| Golden Verses:                           |
|                                          |
| 1. [Search or create verse...    ] 🔍   |
|    Selected: Ин. 3:16 - "Ибо так..."    |
|                                          |
| 2. [Search or create verse...    ] 🔍   |
|                                          |
| 3. [Search or create verse...    ] 🔍   |
|                                          |
| Notes: [_________________________]       |
|        [_________________________]       |
|                                          |
| [  Cancel  ]    [  Create Lesson  ]      |
|                                          |
+------------------------------------------+
```

#### 5.2.5 Edit Lesson Page (/edit-lesson)

**Purpose**: Modify existing lesson data

**Layout Components**:
- Same as New Lesson page, but:
  - Form pre-populated with existing data
  - "Delete Lesson" button (with confirmation)
  - "Cancel" and "Save Changes" buttons

**Functionality**:
- Load existing lesson data
- Same validation as new lesson form
- Update lesson in database
- Delete lesson option with confirmation
- Redirect to /year-lessons-list on success

**Access Control**: Teachers (own grades), Admin, Superadmin

**Wireframe Description**:
```
+------------------------------------------+
| Home > Grade > 2024-2025 > Edit Lesson   |
+------------------------------------------+
| Edit Lesson #15                          |
+------------------------------------------+
|                                          |
| Lesson Number: [15___]                   |
|                                          |
| Date: [📅 09/15/2024]                    |
|                                          |
| Topic: [Abraham's Faith__________]       |
|                                          |
| Teacher: [John Doe ▼]                   |
|                                          |
| Golden Verses:                           |
| 1. Быт. 12:1 - "И сказал Господь..."    |
| 2. Евр. 11:8 - "Верою Авраам..."        |
| 3. Рим. 4:3 - "Авраам поверил..."       |
|                                          |
| [Delete Lesson] [Cancel] [Save Changes]  |
|                                          |
+------------------------------------------+
```

#### 5.2.6 Lesson Data Page (/lesson-data)

**Purpose**: Overview page for a specific lesson with navigation to detailed views

**Layout Components**:
- Page header with lesson information
  - Lesson number, date, topic
  - Responsible teacher
  - Golden verses list
- Breadcrumb navigation
- Two main action buttons:
  - "Open Complete Lesson Table" → /lesson-data-all
  - "Check Homework" → /checking-homework-all
- Summary statistics:
  - Total pupils in grade
  - Number with records entered
  - Average scores (if available)
- Quick actions:
  - Edit lesson details
  - Export data

**Functionality**:
- Display lesson overview
- Navigate to detailed table view
- Navigate to homework checking interface
- Show progress indicator (records completed)

**Access Control**: Teachers (own grades), Admin, Superadmin

**Wireframe Description**:
```
+------------------------------------------+
| Home > Grade > 2024-2025 > Lesson #15    |
+------------------------------------------+
| Lesson #15 - Abraham's Faith             |
| Date: September 15, 2024                 |
| Teacher: John Doe                        |
+------------------------------------------+
|                                          |
| Golden Verses:                           |
| 1. Быт. 12:1 - "И сказал Господь..."    |
| 2. Евр. 11:8 - "Верою Авраам..."        |
| 3. Рим. 4:3 - "Авраам поверил..."       |
|                                          |
| Progress: 12/15 pupils recorded          |
| [████████░░░░░░░] 80%                    |
|                                          |
| [   Open Complete Lesson Table   ]       |
|                                          |
| [      Check Homework      ]             |
|                                          |
| [✏️ Edit Lesson]                         |
|                                          |
+------------------------------------------+
```

#### 5.2.7 Lesson Data All Page (/lesson-data-all)

**Purpose**: Display complete lesson data table with all pupils and their assessment results

**Layout Components**:
- Page header with lesson info
- Breadcrumb navigation
- Comprehensive table with columns:
  - Pupil name (with avatar)
  - Attendance (✓/✗)
  - Golden Verse 1 score (0/1/2)
  - Golden Verse 2 score (0/1/2)
  - Golden Verse 3 score (0/1/2)
  - Test score (0-10)
  - Notebook score (0-10)
  - Rehearsal attendance (✓/✗)
  - Actions (Edit icon)
- Export button (CSV/PDF)
- Filter options (show only present, show missing records)

**Functionality**:
- Display all lesson records for all pupils
- Click Edit icon → open modal to edit record
- Sort by any column
- Filter pupils (present/absent, records complete/incomplete)
- Export table data
- Real-time updates when records change
- Visual indicators for missing data

**Access Control**: Teachers (own grades), Admin, Superadmin

**Wireframe Description**:
```
+------------------------------------------+
| Home > Grade > 2024-2025 > Lesson #15    |
+------------------------------------------+
| Complete Lesson Table                    |
| Lesson #15 - Abraham's Faith             |
|                          [Export CSV ↓]  |
+------------------------------------------+
|                                          |
| Name    |Att|GV1|GV2|GV3|Test|NB|Reh|   |
|---------|---|---|---|---|----|----|---|  |
| 👤 Anna |✓  | 2 | 1 | 2 | 8  | 7  | ✓ |✏️|
| 👤 Boris|✓  | 2 | 2 | 2 | 10 | 9  | ✓ |✏️|
| 👤 Clara|✗  | - | - | - | -  | -  | ✗ |✏️|
| 👤 David|✓  | 1 | 2 | 2 | 7  | 8  | ✓ |✏️|
|         |   |   |   |   |    |    |   |  |
+------------------------------------------+
| GV = Golden Verse, NB = Notebook,        |
| Reh = Rehearsal, Att = Attendance        |
+------------------------------------------+
```

#### 5.2.8 Checking Homework All Page (/checking-homework-all)

**Purpose**: Streamlined interface for entering/editing lesson records for all pupils

**Layout Components**:
- Page header with lesson info
- Breadcrumb navigation
- List of pupil cards (vertical layout)
  - Each card shows:
    - Pupil avatar and name
    - Status indicator (record complete/incomplete)
    - Quick view of entered data (if any)
- Click on pupil card → open modal form

**Modal Form Components**:
- Pupil name and avatar
- Attendance toggle (Present/Absent)
- Golden Verses section:
  - Verse 1: Score selector (0/1/2)
  - Verse 2: Score selector (0/1/2)
  - Verse 3: Score selector (0/1/2)
- Test score input (0-10)
- Notebook score input (0-10)
- Rehearsal attendance toggle
- "Save" and "Cancel" buttons

**Functionality**:
- Display all pupils from grade
- Click pupil card → open modal with form
- If record exists → pre-populate form
- Save record → update database → close modal
- Visual feedback (saved, saving, error)
- Keyboard shortcuts (Enter to save, Esc to cancel)
- Navigate between pupils (Next/Previous buttons in modal)
- Progress indicator showing completion status

**Access Control**: Teachers (own grades), Admin, Superadmin

**Wireframe Description**:
```
+------------------------------------------+
| Home > Grade > 2024-2025 > Check HW      |
+------------------------------------------+
| Check Homework - Lesson #15              |
| Abraham's Faith                          |
|                                          |
| Progress: 12/15 completed                |
+------------------------------------------+
|                                          |
| [👤 Anna Smith        ] [✓ Complete]    |
| [👤 Boris Ivanov      ] [✓ Complete]    |
| [👤 Clara Johnson     ] [⚠ Incomplete]  |
| [👤 David Lee         ] [✓ Complete]    |
| [👤 Emma Wilson       ] [⚠ Incomplete]  |
| [👤 Frank Martin      ] [✓ Complete]    |
|                                          |
+------------------------------------------+

When clicked, Modal appears:
+------------------------------------------+
| Check Homework - Clara Johnson      [✕]  |
+------------------------------------------+
| 👤 Clara Johnson                         |
|                                          |
| Attendance:  [✓ Present]  [ Absent]     |
|                                          |
| Golden Verses:                           |
| Verse 1: [ 0 ] [ 1 ] [✓2 ]              |
| Verse 2: [ 0 ] [✓1 ] [ 2 ]              |
| Verse 3: [✓0 ] [ 1 ] [ 2 ]              |
|                                          |
| Test Score (0-10): [8__]                 |
| Notebook Score (0-10): [7__]             |
|                                          |
| Rehearsal: [✓ Yes]  [ No]               |
|                                          |
| [< Previous] [Cancel] [Save] [Next >]    |
+------------------------------------------+
```

#### 5.2.9 Pupil Personal Data Page (/pupil-personal-data)

**Purpose**: Comprehensive view of all data for a specific pupil across all lessons

**Layout Components**:
- Page header with pupil information
  - Avatar (if available)
  - Full name
  - Date of birth, age
  - Family information (read-only)
  - Current grade
- Breadcrumb navigation
- Tabs/Sections:
  - **Overview**: Summary statistics, charts
  - **All Lessons**: Table with all lesson records
  - **Performance Trends**: Visual graphs
- Lessons table with columns:
  - Lesson date
  - Topic
  - Attendance
  - Golden verses scores
  - Test score
  - Notebook score
  - Rehearsal
  - Edit action
- Filter options (by academic year, date range)
- Export functionality

**Functionality**:
- Display complete pupil profile
- Show all lesson records in table format
- Edit individual lesson record (inline or modal)
- Filter records by academic year, date range
- Visual performance indicators (charts/graphs)
- Export pupil data
- Navigation to family page
- Print-friendly view

**Access Control**:
- Pupil: Own data (read-only)
- Parent: Own children's data (read-only)
- Teacher: Pupils in own grades (read/write)
- Admin/Superadmin: All pupils (read/write)

**Wireframe Description**:
```
+------------------------------------------+
| Home > Pupils > Anna Smith               |
+------------------------------------------+
| 👤 Anna Smith                            |
| Age: 10 | DOB: 01/15/2014                |
| Grade: Middle Group                      |
| Family: Smith Family                     |
+------------------------------------------+
| [Overview] [All Lessons] [Trends]        |
+------------------------------------------+
|                                          |
| All Lessons:               [Export ↓]    |
|                                          |
| Date  |Topic  |Att|GV|Test|NB|Reh|      |
|-------|-------|---|--|----|----|---|     |
|09/01  |Create |✓  |6 | 8  | 7  | ✓ | ✏️ |
|09/08  |Noah   |✓  |5 | 9  | 8  | ✓ | ✏️ |
|09/15  |Abraham|✓  |5 | 8  | 7  | ✓ | ✏️ |
|09/22  |Isaac  |✗  |- | -  | -  | ✗ | ✏️ |
|                                          |
+------------------------------------------+
```

---

### 5.3 Dashboard Pages (Admin/Superadmin)

#### 5.3.1 Teachers Page (/teachers)

**Purpose**: Manage all Sunday School teachers

**Layout Components**:
- Page header with title "Teachers Management"
- "Add New Teacher" button (prominent, top right)
- Grid layout of teacher cards:
  - Teacher avatar/photo
  - Full name
  - List of grades teaching
  - Status indicator (Active/Inactive)
  - Action buttons (Edit, Deactivate/Activate)
- Search bar (by name)
- Filter options (by grade, active status)
- Sort options (by name, date added)

**Modal Form Components** (for Add/Edit):
- Avatar upload (with preview)
- First name (required)
- Last name (required)
- Middle name (optional)
- Email (for user account linking)
- Grades assignment (multi-select from available grades)
- Status toggle (Active/Inactive)
- "Cancel" and "Save" buttons

**Functionality**:
- Display all teachers in card grid
- Click "Add New Teacher" → open modal form
- Click "Edit" on card → open modal with pre-populated data
- Click "Deactivate" → confirmation dialog → set isActive = false
- Search teachers by name (real-time)
- Filter by grade or status
- Sort teachers
- Link teacher to user account (for login access)

**Access Control**: Admin, Superadmin

**Wireframe Description**:
```
+------------------------------------------+
| Dashboard > Teachers                     |
+------------------------------------------+
| Teachers Management                      |
|                      [+ Add New Teacher] |
+------------------------------------------+
| [Search teachers...        ] 🔍          |
| Filters: [All Grades ▼] [Active ▼]      |
+------------------------------------------+
|                                          |
| +-------------+  +-------------+         |
| |   [Photo]   |  |   [Photo]   |        |
| | John Doe    |  | Jane Smith  |        |
| | Middle,     |  | Junior,     |        |
| | Senior      |  | Middle      |        |
| | ✓ Active    |  | ✓ Active    |        |
| | [Edit] [⏸]  |  | [Edit] [⏸]  |        |
| +-------------+  +-------------+         |
|                                          |
| +-------------+  +-------------+         |
| |   [Photo]   |  |   [Photo]   |        |
| | Mike Jones  |  | Sarah Lee   |        |
| | Senior      |  | Junior      |        |
| | ✓ Active    |  | ⏸ Inactive  |        |
| | [Edit] [⏸]  |  | [Edit] [▶]  |        |
| +-------------+  +-------------+         |
|                                          |
+------------------------------------------+

Modal for Add/Edit Teacher:
+------------------------------------------+
| Add New Teacher                     [✕]  |
+------------------------------------------+
|                                          |
|   [   Upload Photo   ]                   |
|   [  or drag & drop  ]                   |
|                                          |
| First Name: [_____________________]      |
| Last Name:  [_____________________]      |
| Middle Name:[_____________________]      |
|                                          |
| Email: [_________________________]       |
|                                          |
| Assigned Grades:                         |
| [ ] Junior Group (6-8 years)             |
| [✓] Middle Group (9-11 years)            |
| [✓] Senior Group (12-14 years)           |
|                                          |
| Status: [✓ Active]  [ Inactive]         |
|                                          |
| [    Cancel    ]  [  Save Teacher  ]     |
|                                          |
+------------------------------------------+
```

#### 5.3.2 Grades List Page (/grades-list)

**Purpose**: Manage all Sunday School grades (groups/classes)

**Layout Components**:
- Page header with title "Grades Management"
- "Add New Grade" button (prominent, top right)
- Grid layout of grade cards:
  - Grade name
  - Age range
  - Number of pupils
  - Number of teachers
  - Status indicator (Active/Inactive)
  - Link to grade details (/grade-data)
  - Action buttons (Edit, Deactivate/Activate)
- Sort options

**Modal Form Components** (for Add/Edit):
- Grade name (required)
- Age range (text input, e.g., "6-8 years")
- Description (optional textarea)
- Pupils assignment:
  - Multi-select from available pupils
  - Show pupil cards with avatar, name, age
- Teachers assignment:
  - Multi-select from available teachers
  - Show teacher cards with avatar, name
- Status toggle (Active/Inactive)
- "Cancel" and "Save" buttons

**Functionality**:
- Display all grades in card grid
- Click on grade card → navigate to /grade-data
- Click "Add New Grade" → open modal form
- Click "Edit" → open modal with pre-populated data
- Click "Deactivate" → confirmation → set isActive = false
- Assign/remove pupils and teachers
- Create grade settings automatically when new grade created

**Access Control**: Admin, Superadmin

**Wireframe Description**:
```
+------------------------------------------+
| Dashboard > Grades                       |
+------------------------------------------+
| Grades Management                        |
|                        [+ Add New Grade] |
+------------------------------------------+
|                                          |
| +----------------------------------+     |
| | Junior Group (6-8 years)         |     |
| | 👥 12 pupils | 👨‍🏫 2 teachers      |     |
| | ✓ Active                         |     |
| | [View Details] [Edit] [⏸]        |     |
| +----------------------------------+     |
|                                          |
| +----------------------------------+     |
| | Middle Group (9-11 years)        |     |
| | 👥 15 pupils | 👨‍🏫 2 teachers      |     |
| | ✓ Active                         |     |
| | [View Details] [Edit] [⏸]        |     |
| +----------------------------------+     |
|                                          |
| +----------------------------------+     |
| | Senior Group (12-14 years)       |     |
| | 👥 10 pupils | 👨‍🏫 1 teacher       |     |
| | ✓ Active                         |     |
| | [View Details] [Edit] [⏸]        |     |
| +----------------------------------+     |
|                                          |
+------------------------------------------+

Modal for Add/Edit Grade:
+------------------------------------------+
| Add New Grade                       [✕]  |
+------------------------------------------+
|                                          |
| Grade Name: [_____________________]      |
| Age Range:  [_____________________]      |
|                                          |
| Description:                             |
| [________________________________]       |
| [________________________________]       |
|                                          |
| Assign Teachers:                         |
| [Search teachers...          ] 🔍        |
| Selected:                                |
| [👤 John Doe ✕] [👤 Jane Smith ✕]       |
|                                          |
| Assign Pupils:                           |
| [Search pupils...            ] 🔍        |
| Selected (15):                           |
| [👤 Anna ✕] [👤 Boris ✕] [👤 Clara ✕]   |
| [...and 12 more]                         |
|                                          |
| Status: [✓ Active]  [ Inactive]         |
|                                          |
| [    Cancel    ]  [   Save Grade   ]     |
|                                          |
+------------------------------------------+
```

#### 5.3.3 Pupils Page (/pupils)

**Purpose**: Manage all Sunday School pupils (students)

**Layout Components**:
- Page header with title "Pupils Management"
- "Add New Pupil" button (prominent, top right)
- Grid layout of pupil cards:
  - Pupil avatar/photo (optional)
  - Full name
  - Age/Date of birth
  - Current grade
  - Family name (clickable link)
  - Status indicator (Active/Inactive)
  - Link to pupil details (/pupil-personal-data)
  - Action buttons (Edit, Deactivate/Activate)
- Search bar (by name)
- Filter options (by grade, family, age range, status)
- Sort options (by name, age, grade)

**Modal Form Components** (for Add/Edit):
- Avatar upload (optional, with preview)
- First name (required)
- Last name (required)
- Middle name (optional)
- Date of birth (date picker, required)
- Family selection (dropdown, required)
  - Option to create new family inline
- Grade assignment (dropdown, required)
- Status toggle (Active/Inactive)
- "Cancel" and "Save" buttons

**Functionality**:
- Display all pupils in card grid
- Click on pupil card → navigate to /pupil-personal-data
- Click "Add New Pupil" → open modal form
- Click "Edit" → open modal with pre-populated data
- Click "Deactivate" → confirmation → set isActive = false
- Link pupil to family (required)
- Assign pupil to grade
- Search pupils by name
- Filter by multiple criteria
- Calculate age automatically from date of birth

**Access Control**: Admin, Superadmin

**Wireframe Description**:
```
+------------------------------------------+
| Dashboard > Pupils                       |
+------------------------------------------+
| Pupils Management                        |
|                        [+ Add New Pupil] |
+------------------------------------------+
| [Search pupils...          ] 🔍          |
| Filters: [All Grades ▼] [All Families ▼]|
+------------------------------------------+
|                                          |
| +-------------+  +-------------+         |
| |   [Photo]   |  |   [Photo]   |        |
| | Anna Smith  |  | Boris Ivanov|        |
| | Age: 10     |  | Age: 9      |        |
| | Middle Group|  | Middle Group|        |
| | Smith Family|  | Ivanov Fam. |        |
| | ✓ Active    |  | ✓ Active    |        |
| |[View][Edit] |  |[View][Edit] |        |
| |    [⏸]      |  |    [⏸]      |        |
| +-------------+  +-------------+         |
|                                          |
| +-------------+  +-------------+         |
| |   [Photo]   |  |   [No Photo]|        |
| | Clara John. |  | David Lee   |        |
| | Age: 11     |  | Age: 8      |        |
| | Middle Group|  | Junior Group|        |
| | Johnson Fam.|  | Lee Family  |        |
| | ✓ Active    |  | ⏸ Inactive  |        |
| |[View][Edit] |  |[View][Edit] |        |
| |    [⏸]      |  |    [▶]      |        |
| +-------------+  +-------------+         |
|                                          |
+------------------------------------------+

Modal for Add/Edit Pupil:
+------------------------------------------+
| Add New Pupil                       [✕]  |
+------------------------------------------+
|                                          |
|   [   Upload Photo   ]                   |
|   [  or drag & drop  ]                   |
|   (Optional)                             |
|                                          |
| First Name: [_____________________]      |
| Last Name:  [_____________________]      |
| Middle Name:[_____________________]      |
|                                          |
| Date of Birth: [📅 01/15/2014]          |
| Age: 10 years (auto-calculated)          |
|                                          |
| Family: [Select Family ▼]                |
|         [+ Create New Family]            |
|                                          |
| Grade: [Select Grade ▼]                  |
|                                          |
| Status: [✓ Active]  [ Inactive]         |
|                                          |
| [    Cancel    ]  [   Save Pupil   ]     |
|                                          |
+------------------------------------------+
```

#### 5.3.4 Families Page (/families)

**Purpose**: Manage family information for Sunday School pupils

**Layout Components**:
- Page header with title "Families Management"
- "Add New Family" button (prominent, top right)
- Grid/List layout of family cards:
  - Family name (derived from parents' last names)
  - Father's name and phone
  - Mother's name and phone
  - Number of children in Sunday School
  - List of children names (clickable)
  - Status indicator (Active/Inactive)
  - Link to family details (/family-data)
  - Action buttons (Edit, Deactivate/Activate)
- Search bar (by family name, parent name)
- Filter options (by number of children, status)
- Sort options

**Modal Form Components** (for Add/Edit):
- Father's information:
  - First name
  - Last name
  - Phone number
- Mother's information:
  - First name
  - Last name
  - Phone number
- Display list of children in this family (read-only)
  - Children are linked via pupil records
- Status toggle (Active/Inactive)
- "Cancel" and "Save" buttons

**Functionality**:
- Display all families
- Click "Add New Family" → open modal form
- Click "Edit" → open modal with pre-populated data
- Click "Deactivate" → confirmation → set isActive = false
- Phone number validation and formatting
- Show which pupils belong to each family
- Click on child name → navigate to /pupil-personal-data
- Search families by any parent name or family name
- Cannot delete family if pupils are assigned to it

**Access Control**: Admin, Superadmin

**Wireframe Description**:
```
+------------------------------------------+
| Dashboard > Families                     |
+------------------------------------------+
| Families Management                      |
|                      [+ Add New Family]  |
+------------------------------------------+
| [Search families...        ] 🔍          |
+------------------------------------------+
|                                          |
| +----------------------------------+     |
| | Smith Family                     |     |
| | 👨 John Smith: +44 123 456 7890  |     |
| | 👩 Mary Smith: +44 123 456 7891  |     |
| | 👥 Children (2):                 |     |
| |    • Anna Smith (10)             |     |
| |    • Tom Smith (8)               |     |
| | ✓ Active                         |     |
| | [View] [Edit] [⏸]                |     |
| +----------------------------------+     |
|                                          |
| +----------------------------------+     |
| | Ivanov Family                    |     |
| | 👨 Peter Ivanov: +44 234 567 8901|     |
| | 👩 Elena Ivanova: +44 234 567... |     |
| | 👥 Children (1):                 |     |
| |    • Boris Ivanov (9)            |     |
| | ✓ Active                         |     |
| | [View] [Edit] [⏸]                |     |
| +----------------------------------+     |
|                                          |
| +----------------------------------+     |
| | Johnson Family                   |     |
| | 👨 Robert Johnson: +44 345 678...|     |
| | 👩 Sarah Johnson: +44 345 678... |     |
| | 👥 Children (3):                 |     |
| |    • Clara (11), Mike (9), ...   |     |
| | ✓ Active                         |     |
| | [View] [Edit] [⏸]                |     |
| +----------------------------------+     |
|                                          |
+------------------------------------------+

Modal for Add/Edit Family:
+------------------------------------------+
| Add New Family                      [✕]  |
+------------------------------------------+
|                                          |
| Father's Information:                    |
| First Name: [_____________________]      |
| Last Name:  [_____________________]      |
| Phone:      [_____________________]      |
|                                          |
| Mother's Information:                    |
| First Name: [_____________________]      |
| Last Name:  [_____________________]      |
| Phone:      [_____________________]      |
|                                          |
| Children in Sunday School:               |
| (Managed via Pupils page)                |
| • Anna Smith (10)                        |
| • Tom Smith (8)                          |
|                                          |
| Status: [✓ Active]  [ Inactive]         |
|                                          |
| [    Cancel    ]  [   Save Family  ]     |
|                                          |
+------------------------------------------+
```

---

## 6. Component Architecture (FSD + Atomic Design)

### 6.1 Feature-Sliced Design Structure

```
src/
├── app/
│   ├── providers/          # App-level providers
│   │   ├── AuthProvider
│   │   ├── QueryProvider
│   │   └── ThemeProvider
│   ├── router/             # Routing configuration
│   │   └── AppRouter.tsx
│   └── App.tsx
│
├── pages/                  # Page components
│   ├── auth/
│   │   └── AuthPage.tsx
│   ├── not-found/
│   │   └── NotFoundPage.tsx
│   ├── grade-data/
│   │   └── GradeDataPage.tsx
│   ├── year-lessons-list/
│   │   └── YearLessonsListPage.tsx
│   └── ... (other pages)
│
├── widgets/                # Complex, self-contained blocks
│   ├── Header/
│   ├── Sidebar/
│   ├── LessonTable/
│   ├── PupilCard/
│   └── HomeworkCheckModal/
│
├── features/               # User interactions/features
│   ├── auth/
│   │   ├── login/
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
├── entities/               # Business entities
│   ├── user/
│   │   ├── model/
│   │   ├── ui/
│   │   └── api/
│   ├── teacher/
│   ├── pupil/
│   ├── grade/
│   ├── lesson/
│   ├── family/
│   └── golden-verse/
│
├── shared/                 # Reusable infrastructure
│   ├── ui/                 # Atomic components (shadcn)
│   │   ├── atoms/
│   │   │   ├── Button
│   │   │   ├── Input
│   │   │   ├── Label
│   │   │   └── Badge
│   │   ├── molecules/
│   │   │   ├── FormField
│   │   │   ├── SearchBar
│   │   │   └── Card
│   │   └── organisms/
│   │       ├── Modal
│   │       ├── DataTable
│   │       └── Form
│   ├── api/               # API client
│   ├── lib/               # Utilities
│   ├── hooks/             # Custom hooks
│   ├── constants/
│   └── types/
│
└── styles/                # Global styles
    └── globals.css
```

### 6.2 Key Shared Components (Atomic Design)

#### Atoms
- `Button` - Various button types (primary, secondary, danger, ghost)
- `Input` - Text inputs with validation
- `Label` - Form labels
- `Badge` - Status indicators
- `Avatar` - User/pupil avatars
- `Icon` - Icon components
- `Checkbox` - Checkbox inputs
- `RadioButton` - Radio button inputs
- `Switch` - Toggle switches
- `Select` - Dropdown selects
- `Textarea` - Multi-line text inputs
- `DatePicker` - Date selection
- `Spinner` - Loading indicator

#### Molecules
- `FormField` - Label + Input + Error message
- `SearchBar` - Search input with icon
- `Card` - Container with header and content
- `Breadcrumb` - Navigation breadcrumbs
- `Pagination` - Page navigation
- `StatusBadge` - Status indicator with text
- `ScoreSelector` - Golden verse score selector (0/1/2)
- `AttendanceToggle` - Present/Absent toggle

#### Organisms
- `Modal` - Modal dialog with backdrop
- `DataTable` - Complex data table with sorting/filtering
- `Form` - Form container with validation
- `Navigation` - Main navigation menu
- `EntityCard` - Reusable card for teachers/pupils/families
- `LessonRecordForm` - Form for lesson record entry
- `ConfirmDialog` - Confirmation dialog

---

## 7. State Management Strategy

### 7.1 Zustand Stores

#### Auth Store
```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}
```

#### UI Store
```typescript
interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}
```

#### Modal Store
```typescript
interface ModalState {
  modals: Record<string, boolean>;
  modalData: Record<string, any>;
  openModal: (modalId: string, data?: any) => void;
  closeModal: (modalId: string) => void;
}
```

### 7.2 React Query Usage

All server-side data fetching and mutations will use React Query:

```typescript
// Queries (GET)
useTeachers()
usePupils()
useGrades()
useFamilies()
useLessons(academicYearId)
useLessonRecords(lessonId)
usePupilData(pupilId)

// Mutations (POST, PUT, DELETE)
useCreateLesson()
useUpdateLesson()
useDeleteLesson()
useCreateLessonRecord()
useUpdateLessonRecord()
useCreateTeacher()
useUpdateTeacher()
// ... etc
```

---

## 8. API Endpoints

### 8.1 Authentication
```
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/session
```

### 8.2 Teachers
```
GET    /api/teachers
GET    /api/teachers/:id
POST   /api/teachers
PUT    /api/teachers/:id
DELETE /api/teachers/:id
PATCH  /api/teachers/:id/deactivate
```

### 8.3 Grades
```
GET    /api/grades
GET    /api/grades/:id
POST   /api/grades
PUT    /api/grades/:id
DELETE /api/grades/:id
GET    /api/grades/:id/settings
PUT    /api/grades/:id/settings
```

### 8.4 Pupils
```
GET    /api/pupils
GET    /api/pupils/:id
GET    /api/pupils/:id/records
POST   /api/pupils
PUT    /api/pupils/:id
DELETE /api/pupils/:id
PATCH  /api/pupils/:id/deactivate
```

### 8.5 Families
```
GET    /api/families
GET    /api/families/:id
POST   /api/families
PUT    /api/families/:id
DELETE /api/families/:id
```

### 8.6 Academic Years
```
GET    /api/academic-years
GET    /api/academic-years/:id
POST   /api/academic-years
PUT    /api/academic-years/:id
DELETE /api/academic-years/:id
GET    /api/grades/:gradeId/academic-years
```

### 8.7 Lessons
```
GET    /api/lessons
GET    /api/lessons/:id
POST   /api/lessons
PUT    /api/lessons/:id
DELETE /api/lessons/:id
GET    /api/academic-years/:yearId/lessons
```

### 8.8 Golden Verses
```
GET    /api/golden-verses
GET    /api/golden-verses/:id
POST   /api/golden-verses
PUT    /api/golden-verses/:id
DELETE /api/golden-verses/:id
GET    /api/golden-verses/search?q=<query>
```

### 8.9 Lesson Records
```
GET    /api/lesson-records
GET    /api/lesson-records/:id
POST   /api/lesson-records
PUT    /api/lesson-records/:id
DELETE /api/lesson-records/:id
GET    /api/lessons/:lessonId/records
GET    /api/pupils/:pupilId/records
```

---

## 9. Access Control & Permissions

### 9.1 Role-Based Access Control (RBAC)

#### Pupil Role
- **Can access**:
  - Own personal data (/pupil-personal-data) - READ ONLY
  - Own lesson records - READ ONLY
- **Cannot access**:
  - Dashboard pages
  - Other pupils' data
  - CRUD operations

#### Parent Role
- **Can access**:
  - Own children's personal data - READ ONLY
  - Own children's lesson records - READ ONLY
  - Family information - READ ONLY
- **Cannot access**:
  - Dashboard pages
  - Other families' data
  - CRUD operations

#### Teacher Role
- **Can access**:
  - Own grades and lessons - READ/WRITE
  - Pupils in own grades - READ/WRITE
  - Lesson records for own grades - READ/WRITE
  - Create, edit, delete lessons in own grades
  - Check homework for own grades
- **Cannot access**:
  - Dashboard management pages
  - Other grades' data
  - User management
  - System-wide settings

#### Admin Role
- **Can access**:
  - All teacher capabilities
  - Dashboard pages (teachers, grades, pupils, families)
  - Create, edit, deactivate all entities
  - Grade settings configuration
  - All lesson records across all grades
- **Cannot access**:
  - Critical system settings
  - Superadmin-only features

#### Superadmin Role
- **Full access** to all features and data
- Can manage admin users
- Can access system-wide settings
- Database maintenance capabilities

### 9.2 Route Protection Implementation

```typescript
// Example protected route component
<Route 
  path="/grade-data" 
  element={
    <ProtectedRoute 
      allowedRoles={['teacher', 'admin', 'superadmin']}
    >
      <GradeDataPage />
    </ProtectedRoute>
  } 
/>
```

---

## 10. User Interface Guidelines

### 10.1 Design Principles

1. **Simplicity**: Clean, uncluttered interfaces
2. **Consistency**: Uniform patterns across all pages
3. **Accessibility**: WCAG 2.1 AA compliance
4. **Responsiveness**: Mobile-first approach
5. **Feedback**: Clear loading states and error messages
6. **Efficiency**: Minimize clicks for common tasks

### 10.2 Color Scheme (Example)

- **Primary**: Blue (#3B82F6) - Actions, links, emphasis
- **Secondary**: Purple (#8B5CF6) - Secondary actions
- **Success**: Green (#10B981) - Positive feedback, completed states
- **Warning**: Yellow (#F59E0B) - Warnings, attention needed
- **Danger**: Red (#EF4444) - Errors, delete actions
- **Neutral**: Gray scale - Text, backgrounds, borders

### 10.3 Typography

- **Headings**: Inter or similar sans-serif font
- **Body**: Inter or similar sans-serif font
- **Code**: Monospace font for any technical content

### 10.4 Spacing System

Use consistent spacing scale (Tailwind default):
- 0.25rem (1), 0.5rem (2), 0.75rem (3), 1rem (4), 1.5rem (6), 2rem (8), etc.

### 10.5 Common UI Patterns

#### Loading States
- Skeleton loaders for data tables
- Spinners for button actions
- Progress indicators for long operations

#### Empty States
- Friendly illustrations
- Clear call-to-action
- Helpful guidance text

#### Error States
- Clear error messages
- Suggested actions
- Retry mechanisms

---

## 11. Validation Rules

### 11.1 Form Validation

#### User/Teacher/Pupil Forms
- **Email**: Valid email format, unique in system
- **Password**: Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number
- **Name fields**: 2-50 characters, letters only (with support for Cyrillic)
- **Phone**: Valid phone number format, 10-15 digits

#### Lesson Forms
- **Topic**: Required, 3-200 characters
- **Date**: Required, cannot be in far future (e.g., >2 years)
- **Golden Verses**: Exactly 3 verses required
- **Teacher**: Required selection

#### Lesson Record Forms
- **Attendance**: Boolean, required
- **Golden Verse Scores**: Integer 0-2, required for each verse
- **Test Score**: Integer 0-10, required if pupil present
- **Notebook Score**: Integer 0-10, required if pupil present
- **Rehearsal**: Boolean, required

#### Grade Forms
- **Name**: Required, 3-100 characters, unique
- **Age Range**: Required, descriptive text
- **Teachers**: At least 1 teacher required
- **Pupils**: Optional (can be empty for new grades)

### 11.2 Business Rules

1. **Lesson Creation**:
   - Cannot create lesson with past date older than 1 year
   - Lesson number must be sequential within academic year
   - Must have exactly 3 golden verses

2. **Lesson Records**:
   - Cannot edit records older than 30 days (configurable)
   - If pupil absent, all scores should be 0 or null
   - Cannot create duplicate records (same pupil + same lesson)

3. **Pupil Management**:
   - Pupil must belong to exactly one grade
   - Pupil must belong to exactly one family
   - Cannot deactivate pupil with lesson records from current academic year

4. **Grade Management**:
   - Cannot delete grade with associated pupils
   - Cannot delete grade with associated lessons
   - Can deactivate instead of delete

5. **Teacher Management**:
   - Teacher can teach multiple grades
   - Cannot delete teacher who is responsible for upcoming lessons
   - Can deactivate instead of delete

---

## 12. Performance Considerations

### 12.1 Optimization Strategies

1. **Code Splitting**: Lazy load route components
2. **Data Fetching**: Use React Query for caching and background updates
3. **Images**: Lazy load images, use optimized formats (WebP)
4. **Pagination**: Implement pagination for large lists (pupils, lessons)
5. **Virtualization**: Use virtual scrolling for very long lists
6. **Debouncing**: Debounce search inputs
7. **Memoization**: Use React.memo, useMemo, useCallback appropriately

### 12.2 Caching Strategy

**React Query Configuration**:
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
```

**Cache Invalidation**:
- Invalidate relevant queries after mutations
- Use optimistic updates for better UX
- Implement background refetching for critical data

---

## 13. Security Requirements

### 13.1 Authentication & Authorization

1. **Password Security**:
   - Hash passwords using bcrypt (minimum 10 rounds)
   - Implement password strength requirements
   - Support password reset flow (future feature)

2. **Session Management**:
   - Use Auth.js for secure session handling
   - HTTP-only cookies for session tokens
   - Implement session timeout (e.g., 24 hours)
   - Refresh token mechanism

3. **Authorization**:
   - Server-side role verification for all API endpoints
   - Client-side role checks for UI rendering
   - Prevent privilege escalation

### 13.2 Data Protection

1. **Input Validation**:
   - Sanitize all user inputs
   - Validate data types and formats
   - Prevent SQL injection (Prisma provides protection)
   - Prevent XSS attacks

2. **Sensitive Data**:
   - Encrypt sensitive data at rest (if required)
   - Use HTTPS for all communications (production)
   - Limit exposure of personal information based on role

3. **API Security**:
   - Rate limiting for API endpoints
   - CSRF protection
   - CORS configuration

### 13.3 Audit & Logging

1. **Audit Trail** (future feature):
   - Log all CRUD operations
   - Track who made changes and when
   - Maintain history of critical data changes

2. **Error Logging**:
   - Log server errors without exposing sensitive info
   - Client-side error tracking
   - Monitor failed login attempts

---

## 14. Error Handling

### 14.1 Client-Side Error Handling

**Error Boundaries**:
```typescript
<ErrorBoundary FallbackComponent={ErrorFallback}>
  <App />
</ErrorBoundary>
```

**Toast Notifications**:
- Success messages for completed actions
- Error messages for failed operations
- Warning messages for validation issues
- Info messages for important notifications

**Form Errors**:
- Inline validation messages
- Highlight invalid fields
- Clear, actionable error text

### 14.2 Server-Side Error Handling

**Error Response Format**:
```typescript
{
  error: {
    code: "VALIDATION_ERROR",
    message: "User-friendly error message",
    details: {} // Optional additional context
  }
}
```

**HTTP Status Codes**:
- 200: Success
- 201: Created
- 400: Bad Request (validation errors)
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict (duplicate data)
- 500: Internal Server Error

---

## 15. Database Schema (Prisma)

### 15.1 Core Schema

```prisma
// User model
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String
  role          Role      @default(PUPIL)
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  teacher       Teacher?
  pupil         Pupil?
  families      Family[]
  
  @@index([email])
}

enum Role {
  PUPIL
  PARENT
  TEACHER
  ADMIN
  SUPERADMIN
}

// Teacher model
model Teacher {
  id            String    @id @default(cuid())
  userId        String    @unique
  firstName     String
  lastName      String
  middleName    String?
  avatar        String?
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  grades        Grade[]
  lessons       Lesson[]
  
  @@index([userId])
}

// Grade model
model Grade {
  id            String    @id @default(cuid())
  name          String    @unique
  ageRange      String
  description   String?
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  teachers      Teacher[]
  pupils        Pupil[]
  academicYears AcademicYear[]
  settings      GradeSettings?
  
  @@index([name])
}

// GradeSettings model
model GradeSettings {
  id                  String    @id @default(cuid())
  gradeId             String    @unique
  showGoldenVerses    Boolean   @default(true)
  showTestScore       Boolean   @default(true)
  showNotebookScore   Boolean   @default(true)
  showRehearsal       Boolean   @default(true)
  goldenVersesLabel   String?
  testScoreLabel      String?
  notebookScoreLabel  String?
  rehearsalLabel      String?
  updatedAt           DateTime  @updatedAt
  
  grade               Grade     @relation(fields: [gradeId], references: [id], onDelete: Cascade)
  
  @@index([gradeId])
}

// Pupil model
model Pupil {
  id            String    @id @default(cuid())
  userId        String?   @unique
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
  
  user          User?     @relation(fields: [userId], references: [id], onDelete: SetNull)
  family        Family    @relation(fields: [familyId], references: [id])
  grade         Grade     @relation(fields: [gradeId], references: [id])
  lessonRecords LessonRecord[]
  
  @@index([familyId])
  @@index([gradeId])
  @@index([userId])
}

// Family model
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
  
  pupils            Pupil[]
  parentUsers       User[]
  
  @@index([fatherLastName])
  @@index([motherLastName])
}

// AcademicYear model
model AcademicYear {
  id            String    @id @default(cuid())
  gradeId       String
  year          String
  startDate     DateTime
  endDate       DateTime
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  grade         Grade     @relation(fields: [gradeId], references: [id], onDelete: Cascade)
  lessons       Lesson[]
  
  @@unique([gradeId, year])
  @@index([gradeId])
  @@index([year])
}

// Lesson model
model Lesson {
  id              String    @id @default(cuid())
  academicYearId  String
  lessonNumber    Int
  topic           String
  date            DateTime
  teacherId       String
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  academicYear    AcademicYear  @relation(fields: [academicYearId], references: [id], onDelete: Cascade)
  teacher         Teacher       @relation(fields: [teacherId], references: [id])
  goldenVerses    GoldenVerse[]
  lessonRecords   LessonRecord[]
  
  @@unique([academicYearId, lessonNumber])
  @@index([academicYearId])
  @@index([teacherId])
  @@index([date])
}

// GoldenVerse model
model GoldenVerse {
  id            String    @id @default(cuid())
  reference     String    @unique
  text          String    @db.Text
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  lessons       Lesson[]
  
  @@index([reference])
}

// LessonRecord model
model LessonRecord {
  id                  String    @id @default(cuid())
  lessonId            String
  pupilId             String
  isPresent           Boolean   @default(true)
  goldenVerse1Score   Int       @default(0)
  goldenVerse2Score   Int       @default(0)
  goldenVerse3Score   Int       @default(0)
  testScore           Int       @default(0)
  notebookScore       Int       @default(0)
  attendedRehearsal   Boolean   @default(false)
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
  
  lesson              Lesson    @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  pupil               Pupil     @relation(fields: [pupilId], references: [id], onDelete: Cascade)
  
  @@unique([lessonId, pupilId])
  @@index([lessonId])
  @@index([pupilId])
}
```

### 15.2 Database Indexes

Key indexes for performance:
- User email (unique, for login queries)
- Lesson academic year and date (for lesson lists)
- LessonRecord lessonId and pupilId (for queries)
- Pupil familyId and gradeId (for relationships)
- Grade name (unique, for lookups)

---

## 16. Development Phases & Milestones

### Phase 1: Foundation (Weeks 1-2)
- [ ] Project setup (React, TypeScript, Prisma, PostgreSQL)
- [ ] Database schema implementation
- [ ] Basic authentication (Auth.js setup)
- [ ] Core UI components (Shadcn UI integration)
- [ ] Routing structure
- [ ] FSD folder structure

**Deliverable**: Authentication working, database ready, basic navigation

### Phase 2: Dashboard Pages (Weeks 3-4)
- [ ] Teachers management page (CRUD)
- [ ] Grades management page (CRUD)
- [ ] Pupils management page (CRUD)
- [ ] Families management page (CRUD)
- [ ] Role-based access control implementation

**Deliverable**: Complete dashboard with all management pages

### Phase 3: Grade & Lesson Management (Weeks 5-6)
- [ ] Grade data page (academic years list)
- [ ] Year lessons list page
- [ ] Create/edit lesson pages
- [ ] Grade settings page
- [ ] Golden verses management

**Deliverable**: Complete lesson planning workflow

### Phase 4: Lesson Records & Homework Checking (Weeks 7-8)
- [ ] Lesson data overview page
- [ ] Complete lesson table view
- [ ] Homework checking interface
- [ ] Lesson record CRUD operations
- [ ] Pupil personal data page

**Deliverable**: Complete homework checking workflow

### Phase 5: Polish & Testing (Weeks 9-10)
- [ ] UI/UX refinements
- [ ] Error handling improvements
- [ ] Performance optimization
- [ ] Security audit
- [ ] User acceptance testing
- [ ] Documentation

**Deliverable**: Production-ready MVP

### Phase 6: Future Enhancements (Post-MVP)
- [ ] Points calculation system (motivation system v2.0)
- [ ] Reports and analytics
- [ ] Data export functionality (Excel, PDF)
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Offline support
- [ ] Multi-language support

---

## 17. Testing Strategy (Post-MVP)

While automated testing is not included in MVP, here's the strategy for future implementation:

### 17.1 Unit Tests
- Test utility functions
- Test custom hooks
- Test data transformations
- Coverage target: 70%+

### 17.2 Integration Tests
- Test API endpoints
- Test database operations
- Test authentication flows
- Test complex user interactions

### 17.3 End-to-End Tests
- Test critical user journeys
- Test role-based access
- Test CRUD operations
- Use Playwright or Cypress

### 17.4 Manual Testing
- User acceptance testing with teachers
- Cross-browser testing
- Mobile responsiveness testing
- Accessibility testing

---

## 18. Deployment Strategy

### 18.1 Environment Setup

**Development**:
- Local PostgreSQL database
- Local development server
- Hot module replacement

**Staging** (optional):
- Staging database
- Similar to production environment
- For user acceptance testing

**Production**:
- Production PostgreSQL database (managed service)
- Vercel/Netlify for frontend deployment
- Environment variables management
- SSL/HTTPS enabled
- CDN for static assets

### 18.2 Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# Auth
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="https://app.example.com"

# Application
NODE_ENV="production"
```

### 18.3 Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Seed data created (if needed)
- [ ] HTTPS enabled
- [ ] CORS configured
- [ ] Error tracking set up
- [ ] Backup strategy in place
- [ ] Monitoring enabled

---

## 19. Maintenance & Support

### 19.1 Backup Strategy

1. **Database Backups**:
   - Daily automated backups
   - Retention period: 30 days
   - Test restore procedures monthly

2. **File Backups**:
   - Backup uploaded files (avatars)
   - Version control for code

### 19.2 Monitoring

1. **Application Monitoring**:
   - Error tracking (Sentry or similar)
   - Performance monitoring
   - Uptime monitoring

2. **Database Monitoring**:
   - Query performance
   - Connection pool usage
   - Storage capacity

### 19.3 Support Plan

**User Support**:
- User documentation/help center
- FAQ section
- Contact form for issues
- Training sessions for teachers/admins

**Technical Support**:
- Bug tracking system
- Feature request process
- Regular updates and patches

---

## 20. Documentation Deliverables

### 20.1 Technical Documentation

1. **Developer Guide**:
   - Setup instructions
   - Architecture overview
   - Code style guide
   - API documentation

2. **Database Documentation**:
   - ERD diagram
   - Schema documentation
   - Migration procedures

3. **Deployment Guide**:
   - Environment setup
   - Deployment procedures
   - Troubleshooting guide

### 20.2 User Documentation

1. **User Manual**:
   - Getting started guide
   - Feature tutorials
   - Role-specific guides
   - FAQ

2. **Admin Guide**:
   - System configuration
   - User management
   - Data management
   - Backup/restore procedures

3. **Training Materials**:
   - Video tutorials (future)
   - Quick reference cards
   - Best practices guide

---

## 21. Key Decisions & Rationale

### 21.1 Why React 19?
- Latest features and performance improvements
- Modern React patterns (Server Components in future)
- Strong ecosystem and community support
- Easy integration with TypeScript

### 21.2 Why TypeScript?
- Type safety reduces runtime errors
- Better IDE support and autocomplete
- Improved maintainability
- Self-documenting code

### 21.3 Why Prisma ORM?
- Type-safe database access
- Excellent TypeScript integration
- Migration management
- Query optimization
- Great developer experience

### 21.4 Why PostgreSQL?
- Robust and reliable
- ACID compliance
- Advanced features (JSON support, full-text search)
- Excellent Prisma support
- Scalable

### 21.5 Why Auth.js?
- Industry standard for Next.js/React
- Secure by default
- Multiple authentication strategies
- Session management built-in
- Easy to configure

### 21.6 Why Zustand?
- Lightweight (compared to Redux)
- Simple API
- No boilerplate
- TypeScript-first
- Perfect for global UI state

### 21.7 Why React Query?
- Excellent caching strategy
- Automatic background refetching
- Optimistic updates
- Reduces boilerplate
- Great DevTools

### 21.8 Why Feature-Sliced Design?
- Clear separation of concerns
- Scalable architecture
- Easy to navigate codebase
- Team collaboration friendly
- Maintainable long-term

### 21.9 Why Shadcn UI?
- Customizable components
- Copy-paste approach (no package dependency)
- Built on Radix UI (accessible)
- Tailwind CSS integration
- Modern design

---

## 22. Risks & Mitigation

### 22.1 Technical Risks

**Risk**: Database performance issues with large datasets
- **Mitigation**: Proper indexing, pagination, query optimization
- **Monitoring**: Track query performance, set up alerts

**Risk**: Authentication/session vulnerabilities
- **Mitigation**: Use industry-standard Auth.js, regular security audits
- **Monitoring**: Monitor failed login attempts, implement rate limiting

**Risk**: Data loss
- **Mitigation**: Automated backups, test restore procedures
- **Monitoring**: Backup success monitoring, storage capacity alerts

### 22.2 User Experience Risks

**Risk**: Complex UI overwhelming for non-technical users
- **Mitigation**: User testing, iterative UI improvements, training materials
- **Monitoring**: User feedback collection, usage analytics

**Risk**: Slow performance on mobile devices
- **Mitigation**: Responsive design, performance optimization, lazy loading
- **Monitoring**: Performance monitoring on various devices

### 22.3 Project Risks

**Risk**: Scope creep
- **Mitigation**: Clear MVP definition, phased approach, change control process
- **Monitoring**: Regular sprint reviews, backlog management

**Risk**: Timeline delays
- **Mitigation**: Buffer time in estimates, prioritization, parallel workstreams
- **Monitoring**: Weekly progress tracking, milestone reviews

---

## 23. Success Metrics

### 23.1 MVP Success Criteria

1. **Functional Completeness**:
   - [ ] All public, private, and dashboard pages implemented
   - [ ] All CRUD operations working
   - [ ] Authentication and authorization functional
   - [ ] Role-based access control working

2. **Performance**:
   - [ ] Page load time < 3 seconds
   - [ ] Time to interactive < 5 seconds
   - [ ] No critical bugs

3. **User Satisfaction**:
   - [ ] Positive feedback from pilot users
   - [ ] Tasks can be completed efficiently
   - [ ] UI is intuitive

4. **Data Integrity**:
   - [ ] No data loss
   - [ ] Accurate calculations
   - [ ] Reliable backups

### 23.2 Post-Launch Metrics

1. **Usage Metrics**:
   - Number of active users
   - Lesson records created per week
   - Login frequency
   - Feature adoption rates

2. **Performance Metrics**:
   - Average response time
   - Error rate
   - Uptime percentage

3. **Business Metrics**:
   - Time saved vs. manual process
   - User satisfaction score
   - Support ticket volume

---

## 24. Future Enhancements Roadmap

### 24.1 Phase 2 Features (Post-MVP)

1. **Points System Implementation**:
   - Automatic calculation based on lesson records
   - Points history tracking
   - Leaderboards
   - Achievement badges

2. **Reporting & Analytics**:
   - Pupil progress reports
   - Grade statistics
   - Teacher performance metrics
   - Export functionality (PDF, Excel)

3. **Communication Features**:
   - Email notifications for parents
   - SMS reminders
   - Announcements system
   - Direct messaging (teacher-parent)

### 24.2 Phase 3 Features

1. **Advanced Features**:
   - Calendar integration
   - Attendance QR codes
   - Photo galleries per lesson
   - Resource library (lesson materials)

2. **Mobile Application**:
   - React Native mobile app
   - Offline mode
   - Push notifications
   - Photo upload from mobile

3. **Integration**:
   - Church management system integration
   - Payment system (if needed)
   - External calendar sync

---

## 25. Appendices

### 25.1 Glossary

- **Grade**: A group or class of students, typically organized by age
- **Academic Year**: A period of time (usually one year) for which lessons are organized
- **Golden Verse**: A Bible verse that students are required to memorize
- **Lesson Record**: Data about a student's performance in a specific lesson
- **Rehearsal**: Practice session (спевка) that students can attend
- **Motivation System**: Points-based reward system for student engagement

### 25.2 References

- React Documentation: https://react.dev
- TypeScript Documentation: https://www.typescriptlang.org/docs/
- Prisma Documentation: https://www.prisma.io/docs/
- Auth.js Documentation: https://authjs.dev/
- Shadcn UI Documentation: https://ui.shadcn.com/
- Feature-Sliced Design: https://feature-sliced.design/

### 25.3 Contact Information

**Project Stakeholders**:
- Product Owner: [TBD]
- Technical Lead: [TBD]
- Sunday School Coordinator: [TBD]

**Development Team**:
- [Team members to be added]

---

## 26. Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-30 | Claude | Initial PRD creation |

---

## 27. Approval & Sign-off

This document has been reviewed and approved by:

- [ ] Product Owner
- [ ] Technical Lead
- [ ] Sunday School Coordinator
- [ ] Church Leadership

---

**Document Status**: Draft  
**Last Updated**: October 30, 2025  
**Next Review Date**: TBD

---

## Notes

This PRD provides a comprehensive blueprint for developing the Sunday School App MVP. The motivation/points system (v2.0) will be designed and implemented in a future phase after the core functionality is stable and tested with real users.

The document should be treated as a living document and updated as requirements evolve or technical decisions change during the development process.