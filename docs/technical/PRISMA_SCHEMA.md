# Prisma Schema (Детальное описание схемы Prisma) - Sunday School App

## Версия документа: 1.0
**Дата создания:** 11 ноября 2025  
**Проект:** Sunday School App (Приложение для управления воскресной школой)  
**Технологии:** Prisma ORM, PostgreSQL 15.x (Supabase)  
**База данных:** Supabase PostgreSQL с PgBouncer connection pooling

---

## 1. Обзор

Данный документ содержит детальное описание Prisma схемы для Sunday School App. Схема основана на ERD.md и включает все модели, связи, индексы и ограничения, необходимые для работы приложения.

### 1.1. Структура документа

- **Раздел 2:** Полная Prisma схема с комментариями
- **Раздел 3:** Детальное описание каждой модели
- **Раздел 4:** Объяснение всех связей (Relations)
- **Раздел 5:** Индексы и их назначение
- **Раздел 6:** Миграции и стратегии
- **Раздел 7:** Seed данные

---

## 2. Полная Prisma схема

```prisma
// ============================================
// PRISMA SCHEMA - Sunday School App
// Версия: 1.0
// Дата: 11 ноября 2025
// База данных: PostgreSQL (Supabase)
// ============================================

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")      // Connection pooling (PgBouncer, порт 6543)
  directUrl = env("DIRECT_URL")        // Direct connection (для миграций, порт 5432)
}

// ============================================
// ENUMS
// ============================================

/// Роли пользователей в системе
enum UserRole {
  TEACHER      // Преподаватель - ведет группы, проверяет ДЗ
  ADMIN        // Администратор - управление школой, пользователями
  SUPERADMIN   // Главный администратор - полный доступ (в MVP = Admin)
  PARENT       // Родитель - просмотр данных детей (Post-MVP)
  PUPIL        // Ученик - просмотр своих данных (Post-MVP)
}

/// Статус учебного года
enum AcademicYearStatus {
  ACTIVE     // Активный (текущий учебный год) - в этом году создаются уроки
  COMPLETED  // Завершен - уроки больше не создаются
  PLANNED    // Запланирован - для будущего использования (Post-MVP)
}

/// Тип события в расписании группы
enum GradeEventType {
  LESSON          // Обычный урок (🔵 Синий цвет в календаре)
  OUTDOOR_EVENT   // Выездное мероприятие (🟢 Зеленый цвет)
  LESSON_SKIPPING // Отмена урока (🔴 Красный цвет)
}

// ============================================
// AUTHENTICATION (Auth.js v5)
// ============================================

/// Пользователи системы (преподаватели, администраторы, родители, ученики)
model User {
  id            String    @id @default(cuid())
  name          String    // Полное имя пользователя
  email         String    @unique // Email для входа (уникальный)
  emailVerified DateTime? // Дата подтверждения email (опционально)
  password      String    // Хешированный пароль (bcrypt, 10 rounds)
  image         String?   // URL аватара (Supabase Storage)
  role          UserRole  @default(TEACHER) // Роль пользователя
  active        Boolean   @default(true) // Активен ли пользователь
  
  // Timestamps
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  accounts            Account[]            // OAuth аккаунты (Auth.js)
  sessions            Session[]            // Сессии (Auth.js, опционально для JWT)
  verificationTokens VerificationToken[] // Токены верификации (Auth.js)
  userGrades          UserGrade[]         // Связь с группами (many-to-many)
  createdLessons      Lesson[]            @relation("LessonCreator") // Уроки, созданные пользователем

  @@index([email])        // Быстрый поиск по email
  @@index([role])         // Фильтрация по роли
  @@index([active])       // Фильтрация активных пользователей
  @@index([createdAt])    // Сортировка по дате регистрации
  @@map("users")
}

/// OAuth аккаунты для пользователей (Auth.js)
model Account {
  id                String  @id @default(cuid())
  userId            String  // ID пользователя
  type              String  // Тип провайдера (e.g., "oauth", "email")
  provider          String  // Название провайдера (e.g., "google", "credentials")
  providerAccountId String  // ID аккаунта у провайдера
  refresh_token     String? @db.Text // Refresh token (для OAuth)
  access_token      String? @db.Text // Access token (для OAuth)
  expires_at        Int?    // Время истечения токена
  token_type        String? // Тип токена
  scope             String? // Область доступа
  id_token          String? @db.Text // ID token (для OAuth)
  session_state     String? // Состояние сессии

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId]) // Комбинация провайдера и ID аккаунта уникальна
  @@index([userId]) // Быстрый поиск аккаунтов пользователя
  @@map("accounts")
}

/// Сессии пользователей (Auth.js, опционально для JWT стратегии)
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique // Токен сессии (уникальный)
  userId       String   // ID пользователя
  expires      DateTime // Время истечения сессии

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])     // Быстрый поиск сессий пользователя
  @@index([expires])    // Очистка истекших сессий
  @@map("sessions")
}

/// Токены верификации (Auth.js - для email верификации и сброса пароля)
model VerificationToken {
  identifier String   // Идентификатор (обычно email)
  token      String   @unique // Токен верификации (уникальный)
  expires    DateTime // Время истечения токена

  @@unique([identifier, token]) // Составной уникальный ключ
  @@index([expires])             // Очистка истекших токенов
  @@map("verification_tokens")
}

// ============================================
// GROUPS & ACADEMIC YEARS
// ============================================

/// Группы/классы воскресной школы
model Grade {
  id          String   @id @default(cuid())
  name        String   // Название группы (e.g., "Младшая (5-7 лет)")
  description String?  @db.Text // Описание группы
  minAge      Int?     // Минимальный возраст учеников
  maxAge      Int?     // Максимальный возраст учеников
  active      Boolean  @default(true) // Активна ли группа
  
  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  userGrades      UserGrade[]      // Преподаватели группы (many-to-many)
  academicYears   AcademicYear[]   // Учебные годы группы
  pupils          Pupil[]          // Ученики группы
  gradeEvents     GradeEvent[]     // События в расписании группы
  gradeSettings   GradeSettings?   // Настройки оценивания группы (one-to-one)

  @@index([name])        // Поиск группы по названию
  @@index([active])      // Фильтрация активных групп
  @@index([createdAt])   // Сортировка по дате создания
  @@map("grades")
}

/// Связь пользователь-группа (many-to-many)
/// Определяет, какие группы ведет преподаватель
model UserGrade {
  id         String   @id @default(cuid())
  userId     String   // ID пользователя (преподавателя)
  gradeId    String   // ID группы
  assignedAt DateTime @default(now()) // Дата назначения
  
  // Timestamps
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  // Relations
  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)
  grade Grade @relation(fields: [gradeId], references: [id], onDelete: Cascade)

  @@unique([userId, gradeId]) // Один преподаватель не может быть дважды в одной группе
  @@index([userId])          // Поиск групп преподавателя
  @@index([gradeId])         // Поиск преподавателей группы
  @@map("user_grades")
}

/// Учебные годы для групп
model AcademicYear {
  id        String              @id @default(cuid())
  gradeId   String              // ID группы
  name      String              // Название учебного года (e.g., "2024-2025")
  startDate DateTime           @db.Date // Дата начала учебного года
  endDate   DateTime           @db.Date // Дата окончания учебного года
  status    AcademicYearStatus @default(ACTIVE) // Статус учебного года
  
  // Timestamps
  createdAt DateTime            @default(now())
  updatedAt DateTime            @updatedAt

  // Relations
  grade   Grade    @relation(fields: [gradeId], references: [id], onDelete: Cascade)
  lessons Lesson[] // Уроки учебного года

  @@index([gradeId])              // Поиск учебных годов группы
  @@index([status])               // Фильтрация по статусу
  @@index([gradeId, status])      // Поиск активных учебных годов группы (составной)
  @@index([startDate])            // Сортировка по дате начала
  @@index([endDate])              // Сортировка по дате окончания
  @@map("academic_years")
}

// ============================================
// LESSONS & GOLDEN VERSES
// ============================================

/// Уроки воскресной школы
model Lesson {
  id             String    @id @default(cuid())
  academicYearId String    // ID учебного года
  createdById    String?   // ID пользователя, создавшего урок
  title          String    // Тема/название урока
  content        String?   @db.Text // Содержание урока (BlockNote JSON)
  lessonDate     DateTime  @db.Date // Дата проведения урока
  order          Int       @default(0) // Порядковый номер урока
  
  // Timestamps
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  // Relations
  academicYear      AcademicYear      @relation(fields: [academicYearId], references: [id], onDelete: Cascade)
  createdBy         User?             @relation("LessonCreator", fields: [createdById], references: [id], onDelete: SetNull)
  lessonGoldenVerses LessonGoldenVerse[] // Золотые стихи урока (many-to-many)
  homeworkChecks    HomeworkCheck[]      // Проверки домашних заданий

  @@index([academicYearId])              // Поиск уроков учебного года
  @@index([lessonDate])                  // Сортировка по дате
  @@index([academicYearId, lessonDate])   // Сортировка уроков (составной)
  @@index([academicYearId, order])       // Сортировка по порядку (составной)
  @@index([createdById])                 // Поиск уроков по создателю
  @@map("lessons")
}

/// Библиотека золотых стихов из Библии
model GoldenVerse {
  id        String   @id @default(cuid())
  book      String   // Название книги Библии (e.g., "Бытие", "Иоанн")
  chapter   Int      // Номер главы (1-150)
  verse     Int      // Номер стиха (1-200)
  text      String   @db.Text // Текст стиха
  
  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  lessonGoldenVerses LessonGoldenVerse[] // Связь с уроками (many-to-many)

  @@unique([book, chapter, verse]) // Комбинация книги, главы и стиха уникальна
  @@index([book])                  // Фильтрация по книге
  @@index([createdAt])             // Сортировка по дате создания
  @@map("golden_verses")
}

/// Связь урок-золотой стих (many-to-many)
/// Один урок может иметь до 3 золотых стихов
model LessonGoldenVerse {
  id            String  @id @default(cuid())
  lessonId      String  // ID урока
  goldenVerseId String  // ID золотого стиха
  order         Int     // Порядок стиха в уроке (1, 2, 3)
  
  // Timestamps
  createdAt     DateTime @default(now())

  // Relations
  lesson       Lesson      @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  goldenVerse  GoldenVerse @relation(fields: [goldenVerseId], references: [id], onDelete: Cascade)

  @@unique([lessonId, order]) // Один урок не может иметь два стиха с одинаковым порядком
  @@index([lessonId])         // Поиск стихов урока
  @@index([goldenVerseId])    // Поиск использований стиха
  @@map("lesson_golden_verses")
}

// ============================================
// PUPILS & FAMILIES
// ============================================

/// Ученики воскресной школы
model Pupil {
  id          String   @id @default(cuid())
  gradeId     String?  // ID группы (может быть NULL при создании)
  firstName   String   // Имя
  lastName    String   // Фамилия
  middleName  String?  // Отчество (опционально)
  dateOfBirth DateTime? @db.Date // Дата рождения
  photo       String?  // URL фото (Supabase Storage)
  active      Boolean  @default(true) // Активен ли ученик
  
  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  grade            Grade?            @relation(fields: [gradeId], references: [id], onDelete: SetNull)
  homeworkChecks   HomeworkCheck[]  // Проверки домашних заданий
  pupilAchievements PupilAchievement[] // Достижения ученика
  familyMembers    FamilyMember[]   // Связь с семьями

  @@index([gradeId])              // Поиск учеников группы
  @@index([active])               // Фильтрация активных учеников
  @@index([gradeId, active])       // Поиск активных учеников группы (составной)
  @@index([lastName])              // Поиск по фамилии
  @@index([createdAt])             // Сортировка по дате создания
  @@map("pupils")
}

/// Семьи учеников
model Family {
  id        String   @id @default(cuid())
  name      String   // Название семьи (фамилия)
  address   String?  @db.Text // Адрес
  phone     String?  // Телефон
  email     String?  // Email
  
  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  familyMembers FamilyMember[] // Члены семьи

  @@index([name])        // Поиск семьи по названию
  @@index([phone])       // Поиск по телефону
  @@index([email])       // Поиск по email
  @@index([createdAt])   // Сортировка по дате создания
  @@map("families")
}

/// Связь семья-ученик (many-to-many)
/// Один ученик может принадлежать только одной семье
model FamilyMember {
  id           String   @id @default(cuid())
  familyId     String   // ID семьи
  pupilId      String   // ID ученика
  relationship String   // Родственная связь (e.g., "сын", "дочь", "брат")
  
  // Timestamps
  createdAt    DateTime @default(now())

  // Relations
  family Family @relation(fields: [familyId], references: [id], onDelete: Cascade)
  pupil  Pupil  @relation(fields: [pupilId], references: [id], onDelete: Cascade)

  @@unique([familyId, pupilId]) // Один ученик не может быть дважды в одной семье
  @@index([familyId])           // Поиск членов семьи
  @@index([pupilId])            // Поиск семьи ученика
  @@map("family_members")
}

// ============================================
// HOMEWORK CHECKS
// ============================================

/// Проверка домашних заданий для каждого ученика по каждому уроку
model HomeworkCheck {
  id                String   @id @default(cuid())
  lessonId          String   // ID урока
  pupilId           String   // ID ученика
  
  // Посещаемость
  isPresent         Boolean  @default(false) // Присутствовал ли на уроке
  
  // Золотые стихи (до 3 стихов)
  goldenVerse1      Boolean  @default(false) // Выучил первый стих
  goldenVerse1Score Int?     // Оценка за первый стих (0-2, опционально)
  goldenVerse2      Boolean  @default(false) // Выучил второй стих
  goldenVerse2Score Int?     // Оценка за второй стих (0-2, опционально)
  goldenVerse3      Boolean  @default(false) // Выучил третий стих
  goldenVerse3Score Int?     // Оценка за третий стих (0-2, опционально)
  
  // Тест
  test              Boolean  @default(false) // Сдал тест
  testScore         Int?     // Оценка за тест (0-5, опционально)
  
  // Тетрадь
  notebook          Boolean  @default(false) // Сдал тетрадь
  notebookScore     Int?     // Оценка за тетрадь (0-5, опционально)
  
  // Спевка
  singing           Boolean  @default(false) // Посетил спевку
  
  // Баллы
  points            Int      @default(0) // Начисленные баллы (рассчитываются автоматически)
  
  // Timestamps
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  // Relations
  lesson Lesson @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  pupil  Pupil  @relation(fields: [pupilId], references: [id], onDelete: Cascade)

  @@unique([lessonId, pupilId]) // Один ученик не может иметь две записи по одному уроку
  @@index([lessonId])           // Поиск проверок урока
  @@index([pupilId])            // Поиск проверок ученика
  @@index([points])             // Сортировка по баллам для рейтинга
  @@index([createdAt])          // Сортировка по дате создания
  @@map("homework_checks")
}

// ============================================
// ACHIEVEMENTS
// ============================================

/// Шаблоны достижений (badges)
model Achievement {
  id          String   @id @default(cuid())
  name        String   // Название достижения (e.g., "Отличник", "Постоянный ученик")
  description String?  @db.Text // Описание достижения
  icon        String?  // Иконка/изображение badge (URL или emoji)
  type        String   // Тип достижения (e.g., "points", "attendance", "verses")
  criteria    Json     // Критерии получения (JSON, e.g., {"minPoints": 100, "minLessons": 10})
  
  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  pupilAchievements PupilAchievement[] // Награждения учеников

  @@index([type])        // Фильтрация по типу
  @@index([name])        // Поиск по названию
  @@index([createdAt])   // Сортировка по дате создания
  @@map("achievements")
}

/// Достижения учеников
model PupilAchievement {
  id            String   @id @default(cuid())
  pupilId       String   // ID ученика
  achievementId String   // ID достижения
  awardedAt     DateTime @default(now()) // Дата награждения
  
  // Timestamps
  createdAt     DateTime @default(now())

  // Relations
  pupil      Pupil      @relation(fields: [pupilId], references: [id], onDelete: Cascade)
  achievement Achievement @relation(fields: [achievementId], references: [id], onDelete: Cascade)

  @@unique([pupilId, achievementId]) // Один ученик не может получить одно достижение дважды
  @@index([pupilId])                 // Поиск достижений ученика
  @@index([achievementId])           // Поиск награжденных учеников
  @@index([awardedAt])               // Сортировка по дате награждения
  @@map("pupil_achievements")
}

// ============================================
// SCHEDULE & EVENTS
// ============================================

/// События в расписании группы
model GradeEvent {
  id          String          @id @default(cuid())
  gradeId     String          // ID группы
  type        GradeEventType  // Тип события
  title       String          // Название события
  description String?         @db.Text // Описание события
  eventDate   DateTime        @db.Date // Дата события
  startTime   DateTime?       @db.Time // Время начала (опционально)
  endTime     DateTime?       @db.Time // Время окончания (опционально)
  
  // Timestamps
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt

  // Relations
  grade Grade @relation(fields: [gradeId], references: [id], onDelete: Cascade)

  @@index([gradeId])              // Поиск событий группы
  @@index([eventDate])            // Сортировка по дате
  @@index([type])                 // Фильтрация по типу
  @@index([gradeId, eventDate])   // Календарь группы (составной)
  @@index([createdAt])            // Сортировка по дате создания
  @@map("grade_events")
}

// ============================================
// GRADE SETTINGS
// ============================================

/// Настройки оценивания для группы
model GradeSettings {
  id                String   @id @default(cuid())
  gradeId           String   @unique // ID группы (one-to-one)
  
  // Включение/выключение параметров
  showGoldenVerses  Boolean  @default(true) // Показывать параметр "Золотые стихи"
  showTest          Boolean  @default(true) // Показывать параметр "Тест"
  showNotebook      Boolean  @default(true) // Показывать параметр "Тетрадь"
  showSinging       Boolean  @default(true) // Показывать параметр "Спевка"
  
  // Кастомные метки для параметров
  goldenVersesLabel String?  // Кастомная метка для "Золотые стихи" (e.g., "Стихи наизусть")
  testLabel         String?  // Кастомная метка для "Тест"
  notebookLabel     String?  // Кастомная метка для "Тетрадь"
  singingLabel      String?  // Кастомная метка для "Спевка"
  
  // Кастомные баллы за параметры (JSON)
  customPoints      Json?    // e.g., {"goldenVerse": 5, "test": 10, "notebook": 5, "singing": 5}
  
  // Timestamps
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  // Relations
  grade Grade @relation(fields: [gradeId], references: [id], onDelete: Cascade)

  @@index([gradeId])        // Поиск настроек группы
  @@index([createdAt])      // Сортировка по дате создания
  @@map("grade_settings")
}
```

---

## 3. Детальное описание моделей

### 3.1. User (Пользователи)

**Назначение:** Хранение информации о всех пользователях системы

**Ключевые поля:**
- `id` - CUID, первичный ключ
- `email` - уникальный email для входа
- `password` - хешированный пароль (bcrypt, 10 rounds)
- `role` - роль пользователя (enum UserRole)
- `active` - флаг активности (деактивированные пользователи не могут войти)

**Связи:**
- `accounts` → Account[] (OAuth аккаунты, CASCADE DELETE)
- `sessions` → Session[] (сессии, CASCADE DELETE)
- `verificationTokens` → VerificationToken[] (токены верификации, CASCADE DELETE)
- `userGrades` → UserGrade[] (связь с группами, CASCADE DELETE)
- `createdLessons` → Lesson[] (созданные уроки, SET NULL)

**Индексы:**
- `email` (UNIQUE) - быстрый поиск пользователя при входе
- `role` - фильтрация пользователей по роли
- `active` - фильтрация активных пользователей
- `createdAt` - сортировка по дате регистрации

**Бизнес-правила:**
- Email должен быть уникальным
- Пароль хранится в хешированном виде (никогда в открытом виде)
- При деактивации (active = false) пользователь не может войти
- При удалении пользователя удаляются все связанные данные (аккаунты, сессии, назначения на группы)

**Пример использования:**
```typescript
// Поиск пользователя по email
const user = await prisma.user.findUnique({
  where: { email: 'teacher@example.com' },
  include: { userGrades: { include: { grade: true } } }
});

// Проверка прав доступа
if (user.role === 'TEACHER') {
  // Доступ только к своим группам
}
```

---

### 3.2. Grade (Группы)

**Назначение:** Хранение информации о группах воскресной школы

**Ключевые поля:**
- `name` - название группы (e.g., "Младшая (5-7 лет)")
- `minAge` / `maxAge` - возрастные ограничения (опционально)
- `active` - флаг активности группы

**Связи:**
- `userGrades` → UserGrade[] (преподаватели группы, CASCADE DELETE)
- `academicYears` → AcademicYear[] (учебные годы, CASCADE DELETE)
- `pupils` → Pupil[] (ученики группы, SET NULL)
- `gradeEvents` → GradeEvent[] (события в расписании, CASCADE DELETE)
- `gradeSettings` → GradeSettings? (настройки оценивания, one-to-one, CASCADE DELETE)

**Индексы:**
- `name` - поиск группы по названию
- `active` - фильтрация активных групп
- `createdAt` - сортировка по дате создания

**Бизнес-правила:**
- При создании группы автоматически создается GradeSettings с дефолтными значениями
- При удалении группы:
  - Ученики остаются, но `gradeId` становится NULL (SET NULL)
  - Удаляются учебные годы, события, настройки (CASCADE DELETE)
  - Удаляются связи с преподавателями (CASCADE DELETE)

**Пример использования:**
```typescript
// Получение группы с настройками
const grade = await prisma.grade.findUnique({
  where: { id: gradeId },
  include: {
    gradeSettings: true,
    academicYears: { where: { status: 'ACTIVE' } },
    pupils: { where: { active: true } }
  }
});
```

---

### 3.3. AcademicYear (Учебные годы)

**Назначение:** Хранение информации об учебных годах для групп

**Ключевые поля:**
- `name` - название года (e.g., "2024-2025")
- `startDate` / `endDate` - период учебного года
- `status` - статус (ACTIVE, COMPLETED, PLANNED)

**Связи:**
- `grade` → Grade (группа, CASCADE DELETE)
- `lessons` → Lesson[] (уроки учебного года, CASCADE DELETE)

**Индексы:**
- `gradeId` - поиск учебных годов группы
- `status` - фильтрация по статусу
- `[gradeId, status]` (составной) - **критический индекс** для поиска активного года группы
- `startDate` / `endDate` - сортировка по датам

**Бизнес-правила:**
- **Для одной группы может быть только один ACTIVE учебный год**
- Уроки могут создаваться только в ACTIVE учебном году
- При завершении года (status = COMPLETED) создается новый ACTIVE год
- `endDate` должен быть > `startDate`

**Пример использования:**
```typescript
// Поиск активного учебного года для группы
const activeYear = await prisma.academicYear.findFirst({
  where: {
    gradeId: gradeId,
    status: 'ACTIVE'
  }
});

// Если активного года нет - блокируем создание урока
if (!activeYear) {
  throw new Error('Для группы нет активного учебного года');
}
```

---

### 3.4. Lesson (Уроки)

**Назначение:** Хранение информации об уроках

**Ключевые поля:**
- `title` - тема/название урока
- `content` - содержание урока (BlockNote JSON, опционально)
- `lessonDate` - дата проведения урока
- `order` - порядковый номер для сортировки

**Связи:**
- `academicYear` → AcademicYear (учебный год, CASCADE DELETE)
- `createdBy` → User? (создатель урока, SET NULL)
- `lessonGoldenVerses` → LessonGoldenVerse[] (золотые стихи, CASCADE DELETE)
- `homeworkChecks` → HomeworkCheck[] (проверки ДЗ, CASCADE DELETE)

**Индексы:**
- `academicYearId` - поиск уроков учебного года
- `lessonDate` - сортировка по дате
- `[academicYearId, lessonDate]` (составной) - сортировка уроков в рамках года
- `[academicYearId, order]` (составной) - сортировка по порядку
- `createdById` - поиск уроков по создателю

**Бизнес-правила:**
- Урок должен принадлежать ACTIVE учебному году
- При создании урока система автоматически определяет активный год группы
- `lessonDate` должна быть в пределах [startDate, endDate] учебного года
- При удалении учебного года удаляются все его уроки

**Пример использования:**
```typescript
// Создание урока с золотыми стихами
const lesson = await prisma.lesson.create({
  data: {
    title: 'Любовь к ближнему',
    lessonDate: new Date('2024-11-10'),
    academicYearId: activeYear.id,
    createdById: session.user.id,
    lessonGoldenVerses: {
      create: [
        { goldenVerseId: verse1Id, order: 1 },
        { goldenVerseId: verse2Id, order: 2 }
      ]
    }
  },
  include: {
    lessonGoldenVerses: { include: { goldenVerse: true } }
  }
});
```

---

### 3.5. HomeworkCheck (Проверка домашних заданий)

**Назначение:** Хранение записей о проверке ДЗ для каждого ученика по каждому уроку

**Ключевые поля:**
- `isPresent` - присутствовал ли на уроке
- `goldenVerse1/2/3` - выучил ли стихи (boolean)
- `goldenVerse1/2/3Score` - оценки за стихи (0-2, опционально)
- `test` / `testScore` - тест и оценка (0-5)
- `notebook` / `notebookScore` - тетрадь и оценка (0-5)
- `singing` - посещение спевки (boolean)
- `points` - начисленные баллы (рассчитываются автоматически)

**Связи:**
- `lesson` → Lesson (урок, CASCADE DELETE)
- `pupil` → Pupil (ученик, CASCADE DELETE)

**Индексы:**
- `[lessonId, pupilId]` (UNIQUE, составной) - **критический индекс** - один ученик не может иметь две записи по одному уроку
- `lessonId` - поиск всех проверок урока
- `pupilId` - поиск всех проверок ученика
- `points` - сортировка по баллам для рейтинга
- `createdAt` - сортировка по дате

**Бизнес-правила:**
- Комбинация `lessonId + pupilId` уникальна
- Если `isPresent = false`, все остальные параметры должны быть false
- Баллы рассчитываются автоматически на основе выполненных параметров и `GradeSettings.customPoints`
- Если все параметры выполнены (все чекбоксы = true), ученик получает "домик" (визуализация)

**Логика расчета баллов:**
```typescript
// Пример расчета баллов
function calculatePoints(homeworkCheck: HomeworkCheck, gradeSettings: GradeSettings): number {
  let points = 0;
  const customPoints = gradeSettings.customPoints as {
    goldenVerse?: number;
    test?: number;
    notebook?: number;
    singing?: number;
  };
  
  if (!homeworkCheck.isPresent) return 0;
  
  if (homeworkCheck.goldenVerse1 && gradeSettings.showGoldenVerses) {
    points += customPoints.goldenVerse || 5;
  }
  if (homeworkCheck.test && gradeSettings.showTest) {
    points += customPoints.test || 10;
  }
  if (homeworkCheck.notebook && gradeSettings.showNotebook) {
    points += customPoints.notebook || 5;
  }
  if (homeworkCheck.singing && gradeSettings.showSinging) {
    points += customPoints.singing || 5;
  }
  
  return points;
}
```

**Пример использования:**
```typescript
// Массовая проверка ДЗ
await prisma.$transaction(
  pupils.map(pupil =>
    prisma.homeworkCheck.upsert({
      where: {
        lessonId_pupilId: {
          lessonId: lesson.id,
          pupilId: pupil.id
        }
      },
      create: {
        lessonId: lesson.id,
        pupilId: pupil.id,
        isPresent: true,
        goldenVerse1: true,
        test: true,
        points: calculatedPoints
      },
      update: {
        goldenVerse1: true,
        test: true,
        points: calculatedPoints
      }
    })
  )
);
```

---

### 3.6. Pupil (Ученики)

**Назначение:** Хранение информации об учениках

**Ключевые поля:**
- `firstName` / `lastName` / `middleName` - ФИО
- `dateOfBirth` - дата рождения (опционально)
- `photo` - URL фото (Supabase Storage)
- `gradeId` - группа (может быть NULL)
- `active` - флаг активности

**Связи:**
- `grade` → Grade? (группа, SET NULL)
- `homeworkChecks` → HomeworkCheck[] (проверки ДЗ, CASCADE DELETE)
- `pupilAchievements` → PupilAchievement[] (достижения, CASCADE DELETE)
- `familyMembers` → FamilyMember[] (связь с семьями, CASCADE DELETE)

**Индексы:**
- `gradeId` - поиск учеников группы
- `active` - фильтрация активных учеников
- `[gradeId, active]` (составной) - поиск активных учеников группы
- `lastName` - поиск по фамилии
- `createdAt` - сортировка по дате

**Бизнес-правила:**
- Ученик может быть без группы при создании
- При удалении группы `gradeId` становится NULL (ученик не удаляется)
- При деактивации ученик скрывается из интерфейса

---

### 3.7. GradeSettings (Настройки оценивания)

**Назначение:** Настройки параметров оценивания для каждой группы

**Ключевые поля:**
- `showGoldenVerses` / `showTest` / `showNotebook` / `showSinging` - включение/выключение параметров
- `goldenVersesLabel` / `testLabel` / `notebookLabel` / `singingLabel` - кастомные метки
- `customPoints` - кастомные баллы за параметры (JSON)

**Связи:**
- `grade` → Grade (группа, one-to-one, CASCADE DELETE)

**Индексы:**
- `gradeId` (UNIQUE) - одна группа = одни настройки

**Бизнес-правила:**
- Каждая группа должна иметь ровно одну запись GradeSettings
- При создании группы автоматически создается GradeSettings с дефолтными значениями
- Если `showGoldenVerses = false`, в уроках не требуются золотые стихи
- `customPoints` хранится в JSON для гибкости

**Пример customPoints:**
```json
{
  "goldenVerse": 5,
  "test": 10,
  "notebook": 5,
  "singing": 5
}
```

---

## 4. Объяснение всех связей (Relations)

### 4.1. One-to-Many (один ко многим)

#### 4.1.1. User → Account, Session, VerificationToken

```prisma
User {
  accounts            Account[]
  sessions            Session[]
  verificationTokens  VerificationToken[]
}
```

**Объяснение:**
- Один пользователь может иметь несколько OAuth аккаунтов
- Один пользователь может иметь несколько активных сессий
- Один пользователь может иметь несколько токенов верификации

**Каскадная операция:** CASCADE DELETE - при удалении пользователя удаляются все связанные записи

#### 4.1.2. Grade → AcademicYear, Pupil, GradeEvent

```prisma
Grade {
  academicYears  AcademicYear[]
  pupils         Pupil[]
  gradeEvents    GradeEvent[]
}
```

**Объяснение:**
- Одна группа может иметь несколько учебных годов
- Одна группа может содержать несколько учеников
- Одна группа может иметь несколько событий в расписании

**Каскадная операция:**
- AcademicYear, GradeEvent: CASCADE DELETE
- Pupil: SET NULL (ученик остается, но `gradeId` становится NULL)

#### 4.1.3. AcademicYear → Lesson

```prisma
AcademicYear {
  lessons Lesson[]
}
```

**Объяснение:**
- Один учебный год может содержать множество уроков

**Каскадная операция:** CASCADE DELETE - при удалении учебного года удаляются все уроки

#### 4.1.4. Lesson → LessonGoldenVerse, HomeworkCheck

```prisma
Lesson {
  lessonGoldenVerses LessonGoldenVerse[]
  homeworkChecks     HomeworkCheck[]
}
```

**Объяснение:**
- Один урок может иметь до 3 золотых стихов
- Один урок может иметь множество проверок ДЗ (по одной на каждого ученика)

**Каскадная операция:** CASCADE DELETE

### 4.2. Many-to-Many (многие ко многим)

#### 4.2.1. User ↔ Grade (через UserGrade)

```prisma
User {
  userGrades UserGrade[]
}

Grade {
  userGrades UserGrade[]
}

UserGrade {
  user  User
  grade Grade
}
```

**Объяснение:**
- Один преподаватель может вести несколько групп
- Одна группа может иметь несколько преподавателей
- Связь реализована через промежуточную таблицу UserGrade

**Уникальное ограничение:** `[userId, gradeId]` - один преподаватель не может быть дважды в одной группе

**Каскадная операция:** CASCADE DELETE с обеих сторон

#### 4.2.2. Lesson ↔ GoldenVerse (через LessonGoldenVerse)

```prisma
Lesson {
  lessonGoldenVerses LessonGoldenVerse[]
}

GoldenVerse {
  lessonGoldenVerses LessonGoldenVerse[]
}

LessonGoldenVerse {
  lesson      Lesson
  goldenVerse GoldenVerse
  order       Int // 1, 2, 3
}
```

**Объяснение:**
- Один урок может иметь до 3 золотых стихов
- Один стих может использоваться в разных уроках
- Поле `order` определяет порядок стиха в уроке (1, 2, 3)

**Уникальное ограничение:** `[lessonId, order]` - один урок не может иметь два стиха с одинаковым порядком

**Каскадная операция:** CASCADE DELETE с обеих сторон

#### 4.2.3. Family ↔ Pupil (через FamilyMember)

```prisma
Family {
  familyMembers FamilyMember[]
}

Pupil {
  familyMembers FamilyMember[]
}

FamilyMember {
  family Family
  pupil  Pupil
  relationship String // "сын", "дочь", "брат"
}
```

**Объяснение:**
- Одна семья может содержать несколько учеников
- Один ученик может принадлежать только одной семье (в MVP)
- Поле `relationship` определяет родственную связь

**Уникальное ограничение:** `[familyId, pupilId]` - один ученик не может быть дважды в одной семье

**Каскадная операция:** CASCADE DELETE с обеих сторон

#### 4.2.4. Pupil ↔ Achievement (через PupilAchievement)

```prisma
Pupil {
  pupilAchievements PupilAchievement[]
}

Achievement {
  pupilAchievements PupilAchievement[]
}

PupilAchievement {
  pupil      Pupil
  achievement Achievement
  awardedAt  DateTime
}
```

**Объяснение:**
- Один ученик может получить множество достижений
- Одно достижение может быть получено множеством учеников
- Поле `awardedAt` хранит дату награждения

**Уникальное ограничение:** `[pupilId, achievementId]` - один ученик не может получить одно достижение дважды

**Каскадная операция:** CASCADE DELETE с обеих сторон

### 4.3. One-to-One (один к одному)

#### 4.3.1. Grade ↔ GradeSettings

```prisma
Grade {
  gradeSettings GradeSettings?
}

GradeSettings {
  grade   Grade @relation(fields: [gradeId], references: [id])
  gradeId String @unique
}
```

**Объяснение:**
- Каждая группа имеет ровно одни настройки оценивания
- Одна запись настроек принадлежит одной группе
- Реализовано через `@unique` на `gradeId` в GradeSettings

**Каскадная операция:** CASCADE DELETE - при удалении группы удаляются настройки

**Бизнес-правило:** При создании группы автоматически создается GradeSettings с дефолтными значениями

---

## 5. Индексы и их назначение

### 5.1. Primary Keys (Первичные ключи)

Все таблицы используют **CUID** (Collision-resistant Unique Identifier):

```prisma
id String @id @default(cuid())
```

**Преимущества CUID:**
- Уникальность без централизованного координатора
- Сортировка по времени создания (встроена в CUID)
- Безопасность (не раскрывает количество записей)
- Формат: `clxxx...` (25 символов)

### 5.2. Unique Constraints (Уникальные ограничения)

#### 5.2.1. Single Column Unique

```prisma
// User.email
email String @unique

// Session.sessionToken
sessionToken String @unique

// VerificationToken.token
token String @unique

// GradeSettings.gradeId
gradeId String @unique
```

#### 5.2.2. Composite Unique (Составные уникальные ключи)

```prisma
// Account: комбинация провайдера и ID аккаунта
@@unique([provider, providerAccountId])

// VerificationToken: комбинация идентификатора и токена
@@unique([identifier, token])

// UserGrade: один преподаватель не может быть дважды в одной группе
@@unique([userId, gradeId])

// LessonGoldenVerse: один урок не может иметь два стиха с одинаковым порядком
@@unique([lessonId, order])

// HomeworkCheck: один ученик не может иметь две записи по одному уроку
@@unique([lessonId, pupilId])

// FamilyMember: один ученик не может быть дважды в одной семье
@@unique([familyId, pupilId])

// PupilAchievement: один ученик не может получить одно достижение дважды
@@unique([pupilId, achievementId])

// GoldenVerse: комбинация книги, главы и стиха уникальна
@@unique([book, chapter, verse])
```

### 5.3. Indexes (Индексы для производительности)

#### 5.3.1. Single Column Indexes

**Для поиска и фильтрации:**
```prisma
// User
@@index([email])        // Поиск пользователя при входе
@@index([role])         // Фильтрация по роли
@@index([active])       // Фильтрация активных пользователей

// Grade
@@index([name])         // Поиск группы по названию
@@index([active])       // Фильтрация активных групп

// Pupil
@@index([lastName])     // Поиск ученика по фамилии
@@index([active])       // Фильтрация активных учеников

// GoldenVerse
@@index([book])         // Фильтрация стихов по книге

// Achievement
@@index([type])         // Фильтрация достижений по типу
@@index([name])         // Поиск достижения по названию
```

**Для связей (Foreign Keys):**
```prisma
// Account, Session
@@index([userId])       // Быстрый JOIN с User

// UserGrade
@@index([userId])      // Поиск групп преподавателя
@@index([gradeId])     // Поиск преподавателей группы

// AcademicYear
@@index([gradeId])     // Поиск учебных годов группы

// Lesson
@@index([academicYearId]) // Поиск уроков учебного года
@@index([createdById])    // Поиск уроков по создателю

// HomeworkCheck
@@index([lessonId])    // Поиск проверок урока
@@index([pupilId])     // Поиск проверок ученика

// FamilyMember
@@index([familyId])    // Поиск членов семьи
@@index([pupilId])     // Поиск семьи ученика

// PupilAchievement
@@index([pupilId])     // Поиск достижений ученика
@@index([achievementId]) // Поиск награжденных учеников
```

**Для сортировки:**
```prisma
// HomeworkCheck
@@index([points])      // Сортировка по баллам для рейтинга

// Lesson
@@index([lessonDate]) // Сортировка уроков по дате

// PupilAchievement
@@index([awardedAt])   // Сортировка достижений по дате

// GradeEvent
@@index([eventDate])   // Сортировка событий по дате
```

**Для очистки истекших данных:**
```prisma
// Session
@@index([expires])     // Очистка истекших сессий

// VerificationToken
@@index([expires])     // Очистка истекших токенов
```

#### 5.3.2. Composite Indexes (Составные индексы)

**Критические составные индексы:**

```prisma
// AcademicYear: поиск активного учебного года группы
@@index([gradeId, status])
// Использование: WHERE gradeId = ? AND status = 'ACTIVE'

// Lesson: сортировка уроков в рамках учебного года
@@index([academicYearId, lessonDate])
// Использование: WHERE academicYearId = ? ORDER BY lessonDate DESC

// Lesson: сортировка по порядку
@@index([academicYearId, order])
// Использование: WHERE academicYearId = ? ORDER BY order ASC

// Pupil: поиск активных учеников группы
@@index([gradeId, active])
// Использование: WHERE gradeId = ? AND active = true

// GradeEvent: календарь группы
@@index([gradeId, eventDate])
// Использование: WHERE gradeId = ? AND eventDate BETWEEN ? AND ?
```

**Почему составные индексы важны:**
- Ускоряют запросы с несколькими условиями WHERE
- Поддерживают сортировку (ORDER BY)
- Критичны для производительности при больших объемах данных

### 5.4. Стратегия индексирования

**Принципы:**
1. **Индексируем Foreign Keys** - для быстрых JOIN операций
2. **Индексируем часто используемые поля в WHERE** - для фильтрации
3. **Индексируем поля в ORDER BY** - для сортировки
4. **Создаем составные индексы** - для запросов с несколькими условиями
5. **Не переиндексируем** - каждый индекс замедляет INSERT/UPDATE

**Мониторинг индексов:**
- Использование `EXPLAIN ANALYZE` для проверки использования индексов
- Мониторинг размера индексов
- Удаление неиспользуемых индексов

---

## 6. Миграции и стратегии

### 6.1. Создание первой миграции

**Команда:**
```bash
npx prisma migrate dev --name init
```

**Что происходит:**
1. Prisma создает SQL миграцию на основе schema.prisma
2. Применяет миграцию к базе данных
3. Генерирует Prisma Client
4. Сохраняет миграцию в `prisma/migrations/`

**Структура миграции:**
```
prisma/
├── migrations/
│   └── 20241111000000_init/
│       └── migration.sql
├── schema.prisma
└── seed.ts
```

### 6.2. Стратегия миграций

#### 6.2.1. Development миграции

**Использование:**
```bash
# Создание и применение миграции
npx prisma migrate dev --name add_new_field

# Сброс базы данных и применение всех миграций
npx prisma migrate reset
```

**Особенности:**
- Автоматически применяет миграцию к dev базе
- Генерирует Prisma Client
- Можно откатить через `migrate reset`

#### 6.2.2. Production миграции

**Использование:**
```bash
# Применение миграций в production
npx prisma migrate deploy
```

**Особенности:**
- Применяет только непримененные миграции
- Не генерирует Prisma Client (нужно отдельно: `npx prisma generate`)
- Безопасно для production (не изменяет схему, только применяет)

#### 6.2.3. Миграции на Supabase

**Важно:**
- Использовать `DIRECT_URL` для миграций (порт 5432)
- `DATABASE_URL` с PgBouncer не поддерживает некоторые операции миграций
- Настройка в `schema.prisma`:
  ```prisma
  datasource db {
    provider  = "postgresql"
    url       = env("DATABASE_URL")      // PgBouncer (для приложения)
    directUrl = env("DIRECT_URL")        // Direct (для миграций)
  }
  ```

### 6.3. Версионирование схемы

**Структура миграций:**
```
prisma/migrations/
├── 20241111000000_init/
│   └── migration.sql
├── 20241112000000_add_created_by_to_lessons/
│   └── migration.sql
├── 20241113000000_add_custom_points/
│   └── migration.sql
└── migration_lock.toml
```

**Именование миграций:**
- Формат: `YYYYMMDDHHMMSS_description`
- Описательные имена: `add_field_name`, `remove_table_name`, `update_index_name`

**Пример миграции:**
```sql
-- Migration: add_created_by_to_lessons
-- Created: 2024-11-12

-- AlterTable
ALTER TABLE "lessons" ADD COLUMN "createdById" TEXT;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_createdById_fkey" 
FOREIGN KEY ("createdById") REFERENCES "users"("id") 
ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "lessons_createdById_idx" ON "lessons"("createdById");
```

### 6.4. Обратная совместимость

#### 6.4.1. Добавление новых полей

**Правило:** Новые поля должны быть nullable или иметь DEFAULT значение

```prisma
// ✅ Правильно
model Lesson {
  newField String?  // Nullable
  // или
  newField String @default("default") // С DEFAULT
}

// ❌ Неправильно (сломает существующие записи)
model Lesson {
  newField String // NOT NULL без DEFAULT
}
```

#### 6.4.2. Удаление полей

**Процесс:**
1. Пометить поле как deprecated в коде
2. Удалить использование в коде
3. Создать миграцию для удаления поля

```prisma
// Шаг 1: Удалить использование в коде
// Шаг 2: Создать миграцию
// migration.sql
ALTER TABLE "lessons" DROP COLUMN "old_field";
```

#### 6.4.3. Изменение типов

**Процесс:**
1. Создать новую колонку с новым типом
2. Мигрировать данные из старой колонки
3. Обновить код для использования новой колонки
4. Удалить старую колонку

```sql
-- Шаг 1: Добавить новую колонку
ALTER TABLE "lessons" ADD COLUMN "content_new" TEXT;

-- Шаг 2: Мигрировать данные
UPDATE "lessons" SET "content_new" = "content"::TEXT;

-- Шаг 3: Удалить старую колонку (после обновления кода)
ALTER TABLE "lessons" DROP COLUMN "content";
ALTER TABLE "lessons" RENAME COLUMN "content_new" TO "content";
```

### 6.5. Откат миграций

**В development:**
```bash
# Сброс базы данных и применение всех миграций заново
npx prisma migrate reset
```

**В production:**
- Создать новую миграцию для отката изменений
- Или восстановить из бэкапа

---

## 7. Seed данные

### 7.1. Настройка seed скрипта

**package.json:**
```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

**Установка зависимостей:**
```bash
npm install -D tsx
```

### 7.2. Структура seed скрипта

**prisma/seed.ts:**
```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Начало seed данных...');

  // 1. Создание пользователей
  const admin = await prisma.user.upsert({
    where: { email: 'admin@church.com' },
    update: {},
    create: {
      name: 'Главный Администратор',
      email: 'admin@church.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'ADMIN',
      active: true,
    },
  });

  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@church.com' },
    update: {},
    create: {
      name: 'Мария Иванова',
      email: 'teacher@church.com',
      password: await bcrypt.hash('teacher123', 10),
      role: 'TEACHER',
      active: true,
    },
  });

  console.log('✅ Пользователи созданы');

  // 2. Создание групп
  const grade = await prisma.grade.upsert({
    where: { id: 'grade-mladshaya' },
    update: {},
    create: {
      id: 'grade-mladshaya',
      name: 'Младшая (5-7 лет)',
      description: 'Группа для детей 5-7 лет',
      minAge: 5,
      maxAge: 7,
      active: true,
      gradeSettings: {
        create: {
          showGoldenVerses: true,
          showTest: true,
          showNotebook: true,
          showSinging: true,
          customPoints: {
            goldenVerse: 5,
            test: 10,
            notebook: 5,
            singing: 5,
          },
        },
      },
    },
    include: { gradeSettings: true },
  });

  console.log('✅ Группы созданы');

  // 3. Назначение преподавателя на группу
  await prisma.userGrade.upsert({
    where: {
      userId_gradeId: {
        userId: teacher.id,
        gradeId: grade.id,
      },
    },
    update: {},
    create: {
      userId: teacher.id,
      gradeId: grade.id,
    },
  });

  console.log('✅ Преподаватели назначены на группы');

  // 4. Создание учебного года
  const academicYear = await prisma.academicYear.upsert({
    where: { id: 'year-2024-2025' },
    update: {},
    create: {
      id: 'year-2024-2025',
      gradeId: grade.id,
      name: '2024-2025',
      startDate: new Date('2024-09-01'),
      endDate: new Date('2025-05-31'),
      status: 'ACTIVE',
    },
  });

  console.log('✅ Учебные годы созданы');

  // 5. Создание золотых стихов
  const verse1 = await prisma.goldenVerse.upsert({
    where: {
      book_chapter_verse: {
        book: 'Иоанна',
        chapter: 3,
        verse: 16,
      },
    },
    update: {},
    create: {
      book: 'Иоанна',
      chapter: 3,
      verse: 16,
      text: 'Ибо так возлюбил Бог мир, что отдал Сына Своего Единородного, дабы всякий верующий в Него не погиб, но имел жизнь вечную.',
    },
  });

  const verse2 = await prisma.goldenVerse.upsert({
    where: {
      book_chapter_verse: {
        book: 'Матфея',
        chapter: 5,
        verse: 14,
      },
    },
    update: {},
    create: {
      book: 'Матфея',
      chapter: 5,
      verse: 14,
      text: 'Вы - свет мира. Не может укрыться город, стоящий на верху горы.',
    },
  });

  console.log('✅ Золотые стихи созданы');

  // 6. Создание учеников
  const pupil1 = await prisma.pupil.create({
    data: {
      gradeId: grade.id,
      firstName: 'Иван',
      lastName: 'Петров',
      middleName: 'Сергеевич',
      dateOfBirth: new Date('2018-05-15'),
      active: true,
    },
  });

  const pupil2 = await prisma.pupil.create({
    data: {
      gradeId: grade.id,
      firstName: 'Маша',
      lastName: 'Сидорова',
      middleName: 'Александровна',
      dateOfBirth: new Date('2017-08-20'),
      active: true,
    },
  });

  console.log('✅ Ученики созданы');

  // 7. Создание семьи
  const family = await prisma.family.create({
    data: {
      name: 'Петровы',
      phone: '+7 (999) 123-45-67',
      email: 'petrov@example.com',
      familyMembers: {
        create: {
          pupilId: pupil1.id,
          relationship: 'сын',
        },
      },
    },
  });

  console.log('✅ Семьи созданы');

  // 8. Создание урока
  const lesson = await prisma.lesson.create({
    data: {
      academicYearId: academicYear.id,
      createdById: teacher.id,
      title: 'Любовь к ближнему',
      content: JSON.stringify({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'На этом уроке мы изучаем, как проявлять любовь к ближним.' }],
          },
        ],
      }),
      lessonDate: new Date('2024-11-10'),
      order: 1,
      lessonGoldenVerses: {
        create: [
          {
            goldenVerseId: verse1.id,
            order: 1,
          },
          {
            goldenVerseId: verse2.id,
            order: 2,
          },
        ],
      },
    },
  });

  console.log('✅ Уроки созданы');

  // 9. Создание проверок ДЗ
  await prisma.homeworkCheck.createMany({
    data: [
      {
        lessonId: lesson.id,
        pupilId: pupil1.id,
        isPresent: true,
        goldenVerse1: true,
        goldenVerse2: true,
        test: true,
        notebook: true,
        singing: true,
        points: 30, // 5 + 5 + 10 + 5 + 5
      },
      {
        lessonId: lesson.id,
        pupilId: pupil2.id,
        isPresent: true,
        goldenVerse1: true,
        goldenVerse2: false,
        test: true,
        notebook: false,
        singing: true,
        points: 20, // 5 + 10 + 5
      },
    ],
  });

  console.log('✅ Проверки ДЗ созданы');

  // 10. Создание достижений
  const achievement1 = await prisma.achievement.create({
    data: {
      name: 'Отличник',
      description: 'За высокие баллы',
      icon: '🏆',
      type: 'points',
      criteria: {
        minPoints: 100,
        minLessons: 5,
      },
    },
  });

  const achievement2 = await prisma.achievement.create({
    data: {
      name: 'Постоянный ученик',
      description: 'За посещаемость',
      icon: '⭐',
      type: 'attendance',
      criteria: {
        minLessons: 10,
        minAttendanceRate: 0.8,
      },
    },
  });

  console.log('✅ Достижения созданы');

  // 11. Награждение ученика достижением
  await prisma.pupilAchievement.create({
    data: {
      pupilId: pupil1.id,
      achievementId: achievement1.id,
      awardedAt: new Date(),
    },
  });

  console.log('✅ Достижения учеников созданы');

  // 12. Создание события в расписании
  await prisma.gradeEvent.create({
    data: {
      gradeId: grade.id,
      type: 'LESSON',
      title: 'Урок: Любовь к ближнему',
      description: 'Обычный урок воскресной школы',
      eventDate: new Date('2024-11-10'),
      startTime: new Date('1970-01-01T10:00:00Z'),
      endTime: new Date('1970-01-01T11:30:00Z'),
    },
  });

  console.log('✅ События в расписании созданы');

  console.log('🎉 Seed данные успешно созданы!');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при создании seed данных:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### 7.3. Запуск seed скрипта

**Команда:**
```bash
npx prisma db seed
```

**Или напрямую:**
```bash
npx tsx prisma/seed.ts
```

### 7.4. Структура seed данных

**Порядок создания:**
1. Пользователи (User) - сначала создаем, так как они нужны для связей
2. Группы (Grade) - создаются с настройками (GradeSettings)
3. Связи пользователь-группа (UserGrade)
4. Учебные годы (AcademicYear) - требуют группу
5. Золотые стихи (GoldenVerse) - независимые данные
6. Ученики (Pupil) - требуют группу
7. Семьи (Family) и связи (FamilyMember) - требуют учеников
8. Уроки (Lesson) - требуют учебный год и создателя
9. Связи урок-стих (LessonGoldenVerse) - требуют урок и стих
10. Проверки ДЗ (HomeworkCheck) - требуют урок и ученика
11. Достижения (Achievement) - независимые данные
12. Награждения (PupilAchievement) - требуют ученика и достижение
13. События (GradeEvent) - требуют группу

**Важно:**
- Использовать `upsert` для предотвращения дубликатов
- Использовать `createMany` для массового создания
- Использовать транзакции для атомарности (опционально)

---

## 8. Best Practices

### 8.1. Работа с Prisma Client

**Singleton Pattern:**
```typescript
// src/lib/db/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

**Использование:**
```typescript
// ✅ Правильно
import { prisma } from '@/lib/db/prisma';
const users = await prisma.user.findMany();

// ❌ Неправильно
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); // НЕ ДЕЛАЙТЕ ТАК!
```

### 8.2. Оптимизация запросов

**Использование include:**
```typescript
// ✅ Правильно - один запрос
const lesson = await prisma.lesson.findUnique({
  where: { id: lessonId },
  include: {
    academicYear: { include: { grade: true } },
    lessonGoldenVerses: { include: { goldenVerse: true } },
    homeworkChecks: { include: { pupil: true } },
  },
});

// ❌ Неправильно - множественные запросы
const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
const academicYear = await prisma.academicYear.findUnique({ where: { id: lesson.academicYearId } });
// ...
```

**Использование select:**
```typescript
// ✅ Выбираем только нужные поля
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
    role: true,
    // password не выбираем!
  },
});
```

### 8.3. Транзакции

**Использование для атомарности:**
```typescript
// Массовая проверка ДЗ
await prisma.$transaction(
  pupils.map(pupil =>
    prisma.homeworkCheck.upsert({
      where: {
        lessonId_pupilId: {
          lessonId: lesson.id,
          pupilId: pupil.id,
        },
      },
      create: { /* ... */ },
      update: { /* ... */ },
    })
  )
);
```

**Важно:** 
- Транзакции через PgBouncer (connection pooling) могут не работать
- Использовать только для атомарных операций в пределах одного HTTP-запроса
- Для больших batch операций рассмотреть альтернативы

### 8.4. Обработка ошибок

**Типичные ошибки Prisma:**
```typescript
try {
  const user = await prisma.user.create({ data: { /* ... */ } });
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      // Unique constraint violation
      console.error('Email уже существует');
    } else if (error.code === 'P2003') {
      // Foreign key constraint violation
      console.error('Связанная запись не найдена');
    }
  }
  throw error;
}
```

---

## 9. Мониторинг и оптимизация

### 9.1. Prisma Studio

**Запуск:**
```bash
npx prisma studio
```

**Использование:**
- Просмотр данных в браузере
- Редактирование записей
- Отладка структуры данных

### 9.2. Логирование запросов

**В development:**
```typescript
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

**В production:**
```typescript
const prisma = new PrismaClient({
  log: ['error'],
});
```

### 9.3. Анализ производительности

**Медленные запросы:**
- Использование `EXPLAIN ANALYZE` в PostgreSQL
- Мониторинг через Supabase Dashboard
- Оптимизация через индексы

---

## 10. Заключение

Данная Prisma схема обеспечивает:

- ✅ **Полное покрытие функционала** - все сущности из ERD.md
- ✅ **Производительность** - оптимизированные индексы
- ✅ **Целостность данных** - Foreign Keys и ограничения
- ✅ **Масштабируемость** - готовность к росту данных
- ✅ **Безопасность** - защита чувствительных данных
- ✅ **Поддерживаемость** - понятная структура и комментарии

**Следующие шаги:**
1. Создать `prisma/schema.prisma` на основе этого документа
2. Запустить первую миграцию: `npx prisma migrate dev --name init`
3. Создать seed скрипт с тестовыми данными
4. Начать разработку с использованием Prisma Client

---

**Версия:** 1.0  
**Последнее обновление:** 11 ноября 2025  
**Автор:** AI Senior Database Architect & Prisma Expert

