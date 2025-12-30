/**
 * Данные для заполнения всех таблиц DynamoDB тестовыми данными
 * Используется при инициализации базы данных для тестирования интерфейса и функционала
 * 
 * Все данные типизированы строго по GraphQL схеме
 */

// ============================================
// TYPES
// ============================================

export type UserRole = 'TEACHER' | 'ADMIN' | 'SUPERADMIN' | 'PARENT';
export type AcademicYearStatus = 'ACTIVE' | 'FINISHED';
export type GradeEventType = 'LESSON' | 'OUTDOOR_EVENT' | 'LESSON_SKIPPING';

export interface UserSeedData {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  photo: string | null;
  active: boolean;
}

export interface GradeSeedData {
  id: string;
  name: string;
  description: string | null;
  minAge: number | null;
  maxAge: number | null;
  active: boolean;
}

export interface UserGradeSeedData {
  id: string;
  userId: string;
  gradeId: string;
}

export interface AcademicYearSeedData {
  id: string;
  gradeId: string;
  name: string;
  startDate: string; // AWSDate YYYY-MM-DD
  endDate: string; // AWSDate YYYY-MM-DD
  status: AcademicYearStatus;
}

export interface LessonSeedData {
  id: string;
  academicYearId: string;
  gradeId: string;
  teacherId: string;
  title: string;
  content: string | null;
  lessonDate: string; // AWSDate YYYY-MM-DD
  order: number;
}

export interface GoldenVerseSeedData {
  id: string;
  reference: string;
  bookId: string; // Используется существующая книга из БД
  chapter: number;
  verseStart: number;
  verseEnd: number | null;
  text: string;
}

export interface LessonGoldenVerseSeedData {
  id: string;
  lessonId: string;
  goldenVerseId: string;
  order: number;
}

export interface PupilSeedData {
  id: string;
  gradeId: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  dateOfBirth: string; // AWSDate YYYY-MM-DD
  photo: string | null;
  active: boolean;
}

export interface HomeworkCheckSeedData {
  id: string;
  lessonId: string;
  pupilId: string;
  gradeId: string;
  goldenVerse1Score: number | null; // 0-2
  goldenVerse2Score: number | null; // 0-2
  goldenVerse3Score: number | null; // 0-2
  testScore: number | null; // 0-10
  notebookScore: number | null; // 0-10
  singing: boolean;
  points: number; // Сумма всех компонентов
}

export interface AchievementSeedData {
  id: string;
  name: string;
  description: string;
  icon: string | null;
  criteria: string; // JSON
}

export interface PupilAchievementSeedData {
  id: string;
  pupilId: string;
  achievementId: string;
}

export interface FamilySeedData {
  id: string;
  name: string; // Фамилия семьи
  phone: string | null;
  email: string | null;
  address: string | null;
  motherFirstName: string | null;
  motherLastName: string | null;
  motherMiddleName: string | null;
  motherPhone: string | null;
  fatherFirstName: string | null;
  fatherLastName: string | null;
  fatherMiddleName: string | null;
  fatherPhone: string | null;
}

export interface FamilyMemberSeedData {
  id: string;
  familyId: string;
  pupilId: string;
}

export interface UserFamilySeedData {
  id: string;
  userId: string; // PARENT
  familyId: string;
  phone: string;
}

export interface GradeEventSeedData {
  id: string;
  gradeId: string;
  eventType: GradeEventType;
  title: string;
  description: string | null;
  eventDate: string; // AWSDate YYYY-MM-DD
}

export interface GradeSettingsSeedData {
  id: string;
  gradeId: string;
  enableGoldenVerse: boolean;
  enableTest: boolean;
  enableNotebook: boolean;
  enableSinging: boolean;
  pointsGoldenVerse: number;
  pointsTest: number;
  pointsNotebook: number;
  pointsSinging: number;
  labelGoldenVerse: string;
  labelTest: string;
  labelNotebook: string;
  labelSinging: string;
}

// ============================================
// SEED DATA
// ============================================

// User: 13 экземпляров (3 TEACHER + 2 ADMIN + 8 PARENT)
export const usersSeedData: UserSeedData[] = [
  // TEACHER (3)
  {
    id: 'user-teacher-1',
    email: 'teacher1@church.com',
    name: 'Иванова Мария Васильевна',
    role: 'TEACHER',
    photo: null,
    active: true,
  },
  {
    id: 'user-teacher-2',
    email: 'teacher2@church.com',
    name: 'Петров Иван Сергеевич',
    role: 'TEACHER',
    photo: null,
    active: true,
  },
  {
    id: 'user-teacher-3',
    email: 'teacher3@church.com',
    name: 'Сидорова Анна Петровна',
    role: 'TEACHER',
    photo: null,
    active: true,
  },
  // ADMIN (2)
  {
    id: 'user-admin-1',
    email: 'admin@church.com',
    name: 'Смирнов Алексей Николаевич',
    role: 'ADMIN',
    photo: null,
    active: true,
  },
  {
    id: 'user-admin-2',
    email: 'admin2@church.com',
    name: 'Козлова Елена Владимировна',
    role: 'ADMIN',
    photo: null,
    active: true,
  },
  // PARENT (8)
  {
    id: 'user-parent-1',
    email: 'parent1@example.com',
    name: 'Иванов Иван Иванович',
    role: 'PARENT',
    photo: null,
    active: true,
  },
  {
    id: 'user-parent-2',
    email: 'parent2@example.com',
    name: 'Иванова Мария Ивановна',
    role: 'PARENT',
    photo: null,
    active: true,
  },
  {
    id: 'user-parent-3',
    email: 'parent3@example.com',
    name: 'Петров Петр Петрович',
    role: 'PARENT',
    photo: null,
    active: true,
  },
  {
    id: 'user-parent-4',
    email: 'parent4@example.com',
    name: 'Петрова Ольга Петровна',
    role: 'PARENT',
    photo: null,
    active: true,
  },
  {
    id: 'user-parent-5',
    email: 'parent5@example.com',
    name: 'Сидоров Сидор Сидорович',
    role: 'PARENT',
    photo: null,
    active: true,
  },
  {
    id: 'user-parent-6',
    email: 'parent6@example.com',
    name: 'Сидорова Елена Сидоровна',
    role: 'PARENT',
    photo: null,
    active: true,
  },
  {
    id: 'user-parent-7',
    email: 'parent7@example.com',
    name: 'Козлов Козел Козлович',
    role: 'PARENT',
    photo: null,
    active: true,
  },
  {
    id: 'user-parent-8',
    email: 'parent8@example.com',
    name: 'Козлова Татьяна Козловна',
    role: 'PARENT',
    photo: null,
    active: true,
  },
];

// Grade: 3 группы
export const gradesSeedData: GradeSeedData[] = [
  {
    id: 'grade-1',
    name: 'Младшая группа',
    description: 'Группа для детей 6-8 лет',
    minAge: 6,
    maxAge: 8,
    active: true,
  },
  {
    id: 'grade-2',
    name: 'Средняя группа',
    description: 'Группа для детей 9-11 лет',
    minAge: 9,
    maxAge: 11,
    active: true,
  },
  {
    id: 'grade-3',
    name: 'Старшая группа',
    description: 'Группа для детей 12-14 лет',
    minAge: 12,
    maxAge: 14,
    active: true,
  },
];

// UserGrade: 3 связи (по 1 TEACHER на каждую Grade)
export const userGradesSeedData: UserGradeSeedData[] = [
  {
    id: 'usergrade-1',
    userId: 'user-teacher-1',
    gradeId: 'grade-1',
  },
  {
    id: 'usergrade-2',
    userId: 'user-teacher-2',
    gradeId: 'grade-2',
  },
  {
    id: 'usergrade-3',
    userId: 'user-teacher-3',
    gradeId: 'grade-3',
  },
];

// AcademicYear: 3 экземпляра (по 1 на каждую Grade)
export const academicYearsSeedData: AcademicYearSeedData[] = [
  {
    id: 'academicyear-1',
    gradeId: 'grade-1',
    name: '2024-2025',
    startDate: '2024-09-01',
    endDate: '2025-05-31',
    status: 'ACTIVE',
  },
  {
    id: 'academicyear-2',
    gradeId: 'grade-2',
    name: '2024-2025',
    startDate: '2024-09-01',
    endDate: '2025-05-31',
    status: 'ACTIVE',
  },
  {
    id: 'academicyear-3',
    gradeId: 'grade-3',
    name: '2024-2025',
    startDate: '2024-09-01',
    endDate: '2025-05-31',
    status: 'ACTIVE',
  },
];

// Lesson: 15 экземпляров (по 5 на каждый AcademicYear)
export const lessonsSeedData: LessonSeedData[] = [
  // Grade 1 (5 уроков)
  {
    id: 'lesson-1-1',
    academicYearId: 'academicyear-1',
    gradeId: 'grade-1',
    teacherId: 'user-teacher-1',
    title: 'Сотворение мира',
    content: null,
    lessonDate: '2024-09-08',
    order: 1,
  },
  {
    id: 'lesson-1-2',
    academicYearId: 'academicyear-1',
    gradeId: 'grade-1',
    teacherId: 'user-teacher-1',
    title: 'Адам и Ева',
    content: null,
    lessonDate: '2024-09-15',
    order: 2,
  },
  {
    id: 'lesson-1-3',
    academicYearId: 'academicyear-1',
    gradeId: 'grade-1',
    teacherId: 'user-teacher-1',
    title: 'Каин и Авель',
    content: null,
    lessonDate: '2024-09-22',
    order: 3,
  },
  {
    id: 'lesson-1-4',
    academicYearId: 'academicyear-1',
    gradeId: 'grade-1',
    teacherId: 'user-teacher-1',
    title: 'Ной и потоп',
    content: null,
    lessonDate: '2024-09-29',
    order: 4,
  },
  {
    id: 'lesson-1-5',
    academicYearId: 'academicyear-1',
    gradeId: 'grade-1',
    teacherId: 'user-teacher-1',
    title: 'Вавилонская башня',
    content: null,
    lessonDate: '2024-10-06',
    order: 5,
  },
  // Grade 2 (5 уроков)
  {
    id: 'lesson-2-1',
    academicYearId: 'academicyear-2',
    gradeId: 'grade-2',
    teacherId: 'user-teacher-2',
    title: 'Авраам - друг Божий',
    content: null,
    lessonDate: '2024-09-08',
    order: 1,
  },
  {
    id: 'lesson-2-2',
    academicYearId: 'academicyear-2',
    gradeId: 'grade-2',
    teacherId: 'user-teacher-2',
    title: 'Исаак и Ревекка',
    content: null,
    lessonDate: '2024-09-15',
    order: 2,
  },
  {
    id: 'lesson-2-3',
    academicYearId: 'academicyear-2',
    gradeId: 'grade-2',
    teacherId: 'user-teacher-2',
    title: 'Иаков и Исав',
    content: null,
    lessonDate: '2024-09-22',
    order: 3,
  },
  {
    id: 'lesson-2-4',
    academicYearId: 'academicyear-2',
    gradeId: 'grade-2',
    teacherId: 'user-teacher-2',
    title: 'Иосиф в Египте',
    content: null,
    lessonDate: '2024-09-29',
    order: 4,
  },
  {
    id: 'lesson-2-5',
    academicYearId: 'academicyear-2',
    gradeId: 'grade-2',
    teacherId: 'user-teacher-2',
    title: 'Моисей и исход из Египта',
    content: null,
    lessonDate: '2024-10-06',
    order: 5,
  },
  // Grade 3 (5 уроков)
  {
    id: 'lesson-3-1',
    academicYearId: 'academicyear-3',
    gradeId: 'grade-3',
    teacherId: 'user-teacher-3',
    title: 'Рождение Иисуса',
    content: null,
    lessonDate: '2024-09-08',
    order: 1,
  },
  {
    id: 'lesson-3-2',
    academicYearId: 'academicyear-3',
    gradeId: 'grade-3',
    teacherId: 'user-teacher-3',
    title: 'Крещение Иисуса',
    content: null,
    lessonDate: '2024-09-15',
    order: 2,
  },
  {
    id: 'lesson-3-3',
    academicYearId: 'academicyear-3',
    gradeId: 'grade-3',
    teacherId: 'user-teacher-3',
    title: 'Первые ученики',
    content: null,
    lessonDate: '2024-09-22',
    order: 3,
  },
  {
    id: 'lesson-3-4',
    academicYearId: 'academicyear-3',
    gradeId: 'grade-3',
    teacherId: 'user-teacher-3',
    title: 'Нагорная проповедь',
    content: null,
    lessonDate: '2024-09-29',
    order: 4,
  },
  {
    id: 'lesson-3-5',
    academicYearId: 'academicyear-3',
    gradeId: 'grade-3',
    teacherId: 'user-teacher-3',
    title: 'Чудеса Иисуса',
    content: null,
    lessonDate: '2024-10-06',
    order: 5,
  },
];

// GoldenVerse: 15 экземпляров (bookId будет получен из БД)
// Временные данные, bookId будет заменен при создании
export const goldenVersesSeedData: Omit<GoldenVerseSeedData, 'bookId'>[] = [
  {
    id: 'goldenverse-1',
    reference: 'Быт. 1:1',
    chapter: 1,
    verseStart: 1,
    verseEnd: null,
    text: 'В начале сотворил Бог небо и землю.',
  },
  {
    id: 'goldenverse-2',
    reference: 'Быт. 1:27',
    chapter: 1,
    verseStart: 27,
    verseEnd: null,
    text: 'И сотворил Бог человека по образу Своему, по образу Божию сотворил его; мужчину и женщину сотворил их.',
  },
  {
    id: 'goldenverse-3',
    reference: 'Быт. 2:7',
    chapter: 2,
    verseStart: 7,
    verseEnd: null,
    text: 'И создал Господь Бог человека из праха земного, и вдунул в лице его дыхание жизни, и стал человек душею живою.',
  },
  {
    id: 'goldenverse-4',
    reference: 'Быт. 4:9',
    chapter: 4,
    verseStart: 9,
    verseEnd: null,
    text: 'И сказал Господь Каину: где Авель, брат твой? Он сказал: не знаю; разве я сторож брату моему?',
  },
  {
    id: 'goldenverse-5',
    reference: 'Быт. 6:9',
    chapter: 6,
    verseStart: 9,
    verseEnd: null,
    text: 'Вот житие Ноя: Ной был человек праведный и непорочный в роде своем; Ной ходил пред Богом.',
  },
  {
    id: 'goldenverse-6',
    reference: 'Быт. 12:2',
    chapter: 12,
    verseStart: 2,
    verseEnd: null,
    text: 'И Я произведу от тебя великий народ, и благословлю тебя, и возвеличу имя твое, и будешь ты в благословение.',
  },
  {
    id: 'goldenverse-7',
    reference: 'Быт. 22:14',
    chapter: 22,
    verseStart: 14,
    verseEnd: null,
    text: 'И нарек Авраам имя месту тому: Иегова-ире. Посему и ныне говорится: на горе Иеговы усмотрится.',
  },
  {
    id: 'goldenverse-8',
    reference: 'Быт. 37:3',
    chapter: 37,
    verseStart: 3,
    verseEnd: null,
    text: 'Израиль любил Иосифа более всех сыновей своих, потому что он был сын старости его, и сделал ему разноцветную одежду.',
  },
  {
    id: 'goldenverse-9',
    reference: 'Исх. 3:14',
    chapter: 3,
    verseStart: 14,
    verseEnd: null,
    text: 'Бог сказал Моисею: Я есмь Сущий. И сказал: так скажи сынам Израилевым: Сущий послал меня к вам.',
  },
  {
    id: 'goldenverse-10',
    reference: 'Исх. 20:3',
    chapter: 20,
    verseStart: 3,
    verseEnd: null,
    text: 'Да не будет у тебя других богов пред лицем Моим.',
  },
  {
    id: 'goldenverse-11',
    reference: 'Иоанна 3:16',
    chapter: 3,
    verseStart: 16,
    verseEnd: null,
    text: 'Ибо так возлюбил Бог мир, что отдал Сына Своего Единородного, дабы всякий верующий в Него, не погиб, но имел жизнь вечную.',
  },
  {
    id: 'goldenverse-12',
    reference: 'Иоанна 1:1',
    chapter: 1,
    verseStart: 1,
    verseEnd: null,
    text: 'В начале было Слово, и Слово было у Бога, и Слово было Бог.',
  },
  {
    id: 'goldenverse-13',
    reference: 'Матфея 5:16',
    chapter: 5,
    verseStart: 16,
    verseEnd: null,
    text: 'Так да светит свет ваш пред людьми, чтобы они видели ваши добрые дела и прославляли Отца вашего Небесного.',
  },
  {
    id: 'goldenverse-14',
    reference: 'Матфея 6:9',
    chapter: 6,
    verseStart: 9,
    verseEnd: null,
    text: 'Молитесь же так: Отче наш, сущий на небесах! да святится имя Твое.',
  },
  {
    id: 'goldenverse-15',
    reference: 'Марка 10:14',
    chapter: 10,
    verseStart: 14,
    verseEnd: null,
    text: 'Увидев то, Иисус вознегодовал и сказал им: пустите детей приходить ко Мне и не препятствуйте им, ибо таковых есть Царствие Божие.',
  },
];

// LessonGoldenVerse: 30 связей (по 2 стиха на каждый урок)
export const lessonGoldenVersesSeedData: LessonGoldenVerseSeedData[] = [
  // Lesson 1-1: 2 стиха
  { id: 'lessongoldenverse-1', lessonId: 'lesson-1-1', goldenVerseId: 'goldenverse-1', order: 1 },
  { id: 'lessongoldenverse-2', lessonId: 'lesson-1-1', goldenVerseId: 'goldenverse-2', order: 2 },
  // Lesson 1-2: 2 стиха
  { id: 'lessongoldenverse-3', lessonId: 'lesson-1-2', goldenVerseId: 'goldenverse-2', order: 1 },
  { id: 'lessongoldenverse-4', lessonId: 'lesson-1-2', goldenVerseId: 'goldenverse-3', order: 2 },
  // Lesson 1-3: 2 стиха
  { id: 'lessongoldenverse-5', lessonId: 'lesson-1-3', goldenVerseId: 'goldenverse-4', order: 1 },
  { id: 'lessongoldenverse-6', lessonId: 'lesson-1-3', goldenVerseId: 'goldenverse-1', order: 2 },
  // Lesson 1-4: 2 стиха
  { id: 'lessongoldenverse-7', lessonId: 'lesson-1-4', goldenVerseId: 'goldenverse-5', order: 1 },
  { id: 'lessongoldenverse-8', lessonId: 'lesson-1-4', goldenVerseId: 'goldenverse-1', order: 2 },
  // Lesson 1-5: 2 стиха
  { id: 'lessongoldenverse-9', lessonId: 'lesson-1-5', goldenVerseId: 'goldenverse-1', order: 1 },
  { id: 'lessongoldenverse-10', lessonId: 'lesson-1-5', goldenVerseId: 'goldenverse-2', order: 2 },
  // Lesson 2-1: 2 стиха
  { id: 'lessongoldenverse-11', lessonId: 'lesson-2-1', goldenVerseId: 'goldenverse-6', order: 1 },
  { id: 'lessongoldenverse-12', lessonId: 'lesson-2-1', goldenVerseId: 'goldenverse-7', order: 2 },
  // Lesson 2-2: 2 стиха
  { id: 'lessongoldenverse-13', lessonId: 'lesson-2-2', goldenVerseId: 'goldenverse-6', order: 1 },
  { id: 'lessongoldenverse-14', lessonId: 'lesson-2-2', goldenVerseId: 'goldenverse-8', order: 2 },
  // Lesson 2-3: 2 стиха
  { id: 'lessongoldenverse-15', lessonId: 'lesson-2-3', goldenVerseId: 'goldenverse-8', order: 1 },
  { id: 'lessongoldenverse-16', lessonId: 'lesson-2-3', goldenVerseId: 'goldenverse-6', order: 2 },
  // Lesson 2-4: 2 стиха
  { id: 'lessongoldenverse-17', lessonId: 'lesson-2-4', goldenVerseId: 'goldenverse-8', order: 1 },
  { id: 'lessongoldenverse-18', lessonId: 'lesson-2-4', goldenVerseId: 'goldenverse-9', order: 2 },
  // Lesson 2-5: 2 стиха
  { id: 'lessongoldenverse-19', lessonId: 'lesson-2-5', goldenVerseId: 'goldenverse-9', order: 1 },
  { id: 'lessongoldenverse-20', lessonId: 'lesson-2-5', goldenVerseId: 'goldenverse-10', order: 2 },
  // Lesson 3-1: 2 стиха
  { id: 'lessongoldenverse-21', lessonId: 'lesson-3-1', goldenVerseId: 'goldenverse-11', order: 1 },
  { id: 'lessongoldenverse-22', lessonId: 'lesson-3-1', goldenVerseId: 'goldenverse-12', order: 2 },
  // Lesson 3-2: 2 стиха
  { id: 'lessongoldenverse-23', lessonId: 'lesson-3-2', goldenVerseId: 'goldenverse-11', order: 1 },
  { id: 'lessongoldenverse-24', lessonId: 'lesson-3-2', goldenVerseId: 'goldenverse-13', order: 2 },
  // Lesson 3-3: 2 стиха
  { id: 'lessongoldenverse-25', lessonId: 'lesson-3-3', goldenVerseId: 'goldenverse-13', order: 1 },
  { id: 'lessongoldenverse-26', lessonId: 'lesson-3-3', goldenVerseId: 'goldenverse-14', order: 2 },
  // Lesson 3-4: 2 стиха
  { id: 'lessongoldenverse-27', lessonId: 'lesson-3-4', goldenVerseId: 'goldenverse-14', order: 1 },
  { id: 'lessongoldenverse-28', lessonId: 'lesson-3-4', goldenVerseId: 'goldenverse-15', order: 2 },
  // Lesson 3-5: 2 стиха
  { id: 'lessongoldenverse-29', lessonId: 'lesson-3-5', goldenVerseId: 'goldenverse-15', order: 1 },
  { id: 'lessongoldenverse-30', lessonId: 'lesson-3-5', goldenVerseId: 'goldenverse-11', order: 2 },
];

// Pupil: 15 экземпляров (по 5 на каждую Grade)
export const pupilsSeedData: PupilSeedData[] = [
  // Grade 1 (5 учеников)
  {
    id: 'pupil-1-1',
    gradeId: 'grade-1',
    firstName: 'Анна',
    lastName: 'Иванова',
    middleName: 'Ивановна',
    dateOfBirth: '2018-03-15',
    photo: null,
    active: true,
  },
  {
    id: 'pupil-1-2',
    gradeId: 'grade-1',
    firstName: 'Иван',
    lastName: 'Иванов',
    middleName: 'Иванович',
    dateOfBirth: '2017-07-20',
    photo: null,
    active: true,
  },
  {
    id: 'pupil-1-3',
    gradeId: 'grade-1',
    firstName: 'Мария',
    lastName: 'Петрова',
    middleName: 'Петровна',
    dateOfBirth: '2018-11-10',
    photo: null,
    active: true,
  },
  {
    id: 'pupil-1-4',
    gradeId: 'grade-1',
    firstName: 'Петр',
    lastName: 'Петров',
    middleName: 'Петрович',
    dateOfBirth: '2017-05-25',
    photo: null,
    active: true,
  },
  {
    id: 'pupil-1-5',
    gradeId: 'grade-1',
    firstName: 'София',
    lastName: 'Сидорова',
    middleName: 'Сидоровна',
    dateOfBirth: '2018-09-30',
    photo: null,
    active: true,
  },
  // Grade 2 (5 учеников)
  {
    id: 'pupil-2-1',
    gradeId: 'grade-2',
    firstName: 'Дмитрий',
    lastName: 'Сидоров',
    middleName: 'Сидорович',
    dateOfBirth: '2015-02-14',
    photo: null,
    active: true,
  },
  {
    id: 'pupil-2-2',
    gradeId: 'grade-2',
    firstName: 'Елена',
    lastName: 'Козлова',
    middleName: 'Козловна',
    dateOfBirth: '2014-08-18',
    photo: null,
    active: true,
  },
  {
    id: 'pupil-2-3',
    gradeId: 'grade-2',
    firstName: 'Алексей',
    lastName: 'Козлов',
    middleName: 'Козлович',
    dateOfBirth: '2015-12-05',
    photo: null,
    active: true,
  },
  {
    id: 'pupil-2-4',
    gradeId: 'grade-2',
    firstName: 'Ольга',
    lastName: 'Морозова',
    middleName: 'Морозовна',
    dateOfBirth: '2014-04-22',
    photo: null,
    active: true,
  },
  {
    id: 'pupil-2-5',
    gradeId: 'grade-2',
    firstName: 'Николай',
    lastName: 'Морозов',
    middleName: 'Морозович',
    dateOfBirth: '2015-10-11',
    photo: null,
    active: true,
  },
  // Grade 3 (5 учеников)
  {
    id: 'pupil-3-1',
    gradeId: 'grade-3',
    firstName: 'Татьяна',
    lastName: 'Волкова',
    middleName: 'Волковна',
    dateOfBirth: '2012-01-08',
    photo: null,
    active: true,
  },
  {
    id: 'pupil-3-2',
    gradeId: 'grade-3',
    firstName: 'Сергей',
    lastName: 'Волков',
    middleName: 'Волкович',
    dateOfBirth: '2011-06-16',
    photo: null,
    active: true,
  },
  {
    id: 'pupil-3-3',
    gradeId: 'grade-3',
    firstName: 'Виктория',
    lastName: 'Новикова',
    middleName: 'Новиковна',
    dateOfBirth: '2012-03-24',
    photo: null,
    active: true,
  },
  {
    id: 'pupil-3-4',
    gradeId: 'grade-3',
    firstName: 'Андрей',
    lastName: 'Новиков',
    middleName: 'Новикович',
    dateOfBirth: '2011-09-12',
    photo: null,
    active: true,
  },
  {
    id: 'pupil-3-5',
    gradeId: 'grade-3',
    firstName: 'Екатерина',
    lastName: 'Лебедева',
    middleName: 'Лебедевна',
    dateOfBirth: '2012-07-28',
    photo: null,
    active: true,
  },
];

// HomeworkCheck: 45 экземпляров (по 3 на каждого ученика)
// Будет создано программно в скрипте, так как нужно связать с разными уроками
export const homeworkChecksSeedData: Omit<HomeworkCheckSeedData, 'id' | 'lessonId' | 'pupilId' | 'gradeId' | 'points'>[] = [
  // Варианты проверок для генерации
  {
    goldenVerse1Score: 2,
    goldenVerse2Score: 2,
    goldenVerse3Score: null,
    testScore: 10,
    notebookScore: 9,
    singing: true,
  },
  {
    goldenVerse1Score: 1,
    goldenVerse2Score: 2,
    goldenVerse3Score: null,
    testScore: 8,
    notebookScore: 8,
    singing: true,
  },
  {
    goldenVerse1Score: 2,
    goldenVerse2Score: 1,
    goldenVerse3Score: null,
    testScore: 7,
    notebookScore: 7,
    singing: false,
  },
  {
    goldenVerse1Score: 0,
    goldenVerse2Score: 1,
    goldenVerse3Score: null,
    testScore: 6,
    notebookScore: 6,
    singing: false,
  },
  {
    goldenVerse1Score: 2,
    goldenVerse2Score: 2,
    goldenVerse3Score: 2,
    testScore: 10,
    notebookScore: 10,
    singing: true,
  },
];

// Achievement: 6 экземпляров
export const achievementsSeedData: AchievementSeedData[] = [
  {
    id: 'achievement-1',
    name: 'Отличник',
    description: 'Получение максимальных баллов за 5 уроков подряд',
    icon: '⭐',
    criteria: JSON.stringify({ type: 'consecutive_max_points', count: 5 }),
  },
  {
    id: 'achievement-2',
    name: 'Активный ученик',
    description: 'Посещение всех уроков в течение месяца',
    icon: '🏃',
    criteria: JSON.stringify({ type: 'attendance', period: 'month', rate: 1.0 }),
  },
  {
    id: 'achievement-3',
    name: 'Знаток Библии',
    description: 'Выучено 20 золотых стихов',
    icon: '📖',
    criteria: JSON.stringify({ type: 'golden_verses', count: 20 }),
  },
  {
    id: 'achievement-4',
    name: 'Лучший помощник',
    description: 'Активное участие в жизни группы',
    icon: '🤝',
    criteria: JSON.stringify({ type: 'participation', level: 'high' }),
  },
  {
    id: 'achievement-5',
    name: 'Творческий подход',
    description: 'Выполнение творческих заданий на отлично',
    icon: '🎨',
    criteria: JSON.stringify({ type: 'creative_tasks', score: 10 }),
  },
  {
    id: 'achievement-6',
    name: 'Лидер группы',
    description: 'Первое место в рейтинге группы',
    icon: '👑',
    criteria: JSON.stringify({ type: 'leaderboard', position: 1 }),
  },
];

// PupilAchievement: 12 связей (по 2-3 достижения на разных учеников)
export const pupilAchievementsSeedData: PupilAchievementSeedData[] = [
  { id: 'pupilachievement-1', pupilId: 'pupil-1-1', achievementId: 'achievement-1' },
  { id: 'pupilachievement-2', pupilId: 'pupil-1-1', achievementId: 'achievement-2' },
  { id: 'pupilachievement-3', pupilId: 'pupil-1-2', achievementId: 'achievement-3' },
  { id: 'pupilachievement-4', pupilId: 'pupil-2-1', achievementId: 'achievement-1' },
  { id: 'pupilachievement-5', pupilId: 'pupil-2-1', achievementId: 'achievement-4' },
  { id: 'pupilachievement-6', pupilId: 'pupil-2-2', achievementId: 'achievement-2' },
  { id: 'pupilachievement-7', pupilId: 'pupil-2-3', achievementId: 'achievement-5' },
  { id: 'pupilachievement-8', pupilId: 'pupil-3-1', achievementId: 'achievement-6' },
  { id: 'pupilachievement-9', pupilId: 'pupil-3-1', achievementId: 'achievement-1' },
  { id: 'pupilachievement-10', pupilId: 'pupil-3-2', achievementId: 'achievement-3' },
  { id: 'pupilachievement-11', pupilId: 'pupil-3-3', achievementId: 'achievement-4' },
  { id: 'pupilachievement-12', pupilId: 'pupil-3-4', achievementId: 'achievement-2' },
];

// Family: 5 экземпляров
export const familiesSeedData: FamilySeedData[] = [
  {
    id: 'family-1',
    name: 'Ивановы',
    phone: '+7 (999) 123-45-67',
    email: 'ivanov@example.com',
    address: 'г. Москва, ул. Примерная, д. 1',
    motherFirstName: 'Мария',
    motherLastName: 'Иванова',
    motherMiddleName: 'Ивановна',
    motherPhone: '+7 (999) 123-45-68',
    fatherFirstName: 'Иван',
    fatherLastName: 'Иванов',
    fatherMiddleName: 'Иванович',
    fatherPhone: '+7 (999) 123-45-69',
  },
  {
    id: 'family-2',
    name: 'Петровы',
    phone: '+7 (999) 234-56-78',
    email: 'petrov@example.com',
    address: 'г. Москва, ул. Примерная, д. 2',
    motherFirstName: 'Ольга',
    motherLastName: 'Петрова',
    motherMiddleName: 'Петровна',
    motherPhone: '+7 (999) 234-56-79',
    fatherFirstName: 'Петр',
    fatherLastName: 'Петров',
    fatherMiddleName: 'Петрович',
    fatherPhone: '+7 (999) 234-56-80',
  },
  {
    id: 'family-3',
    name: 'Сидоровы',
    phone: '+7 (999) 345-67-89',
    email: 'sidorov@example.com',
    address: 'г. Москва, ул. Примерная, д. 3',
    motherFirstName: 'Елена',
    motherLastName: 'Сидорова',
    motherMiddleName: 'Сидоровна',
    motherPhone: '+7 (999) 345-67-90',
    fatherFirstName: 'Сидор',
    fatherLastName: 'Сидоров',
    fatherMiddleName: 'Сидорович',
    fatherPhone: '+7 (999) 345-67-91',
  },
  {
    id: 'family-4',
    name: 'Козловы',
    phone: '+7 (999) 456-78-90',
    email: 'kozlov@example.com',
    address: 'г. Москва, ул. Примерная, д. 4',
    motherFirstName: 'Татьяна',
    motherLastName: 'Козлова',
    motherMiddleName: 'Козловна',
    motherPhone: '+7 (999) 456-78-91',
    fatherFirstName: 'Козел',
    fatherLastName: 'Козлов',
    fatherMiddleName: 'Козлович',
    fatherPhone: '+7 (999) 456-78-92',
  },
  {
    id: 'family-5',
    name: 'Морозовы',
    phone: '+7 (999) 567-89-01',
    email: 'morozov@example.com',
    address: 'г. Москва, ул. Примерная, д. 5',
    motherFirstName: 'Анна',
    motherLastName: 'Морозова',
    motherMiddleName: 'Морозовна',
    motherPhone: '+7 (999) 567-89-02',
    fatherFirstName: 'Мороз',
    fatherLastName: 'Морозов',
    fatherMiddleName: 'Морозович',
    fatherPhone: '+7 (999) 567-89-03',
  },
];

// FamilyMember: 15 связей (все Pupil связаны с семьями)
// Распределение: 2 семьи с 2 детьми, 2 семьи с 1 ребенком, 1 семья с 3 детьми
export const familyMembersSeedData: FamilyMemberSeedData[] = [
  // Семья 1 (Ивановы) - 2 ребенка
  { id: 'familymember-1', familyId: 'family-1', pupilId: 'pupil-1-1' },
  { id: 'familymember-2', familyId: 'family-1', pupilId: 'pupil-1-2' },
  // Семья 2 (Петровы) - 2 ребенка
  { id: 'familymember-3', familyId: 'family-2', pupilId: 'pupil-1-3' },
  { id: 'familymember-4', familyId: 'family-2', pupilId: 'pupil-1-4' },
  // Семья 3 (Сидоровы) - 1 ребенок
  { id: 'familymember-5', familyId: 'family-3', pupilId: 'pupil-1-5' },
  // Семья 4 (Козловы) - 3 ребенка
  { id: 'familymember-6', familyId: 'family-4', pupilId: 'pupil-2-1' },
  { id: 'familymember-7', familyId: 'family-4', pupilId: 'pupil-2-2' },
  { id: 'familymember-8', familyId: 'family-4', pupilId: 'pupil-2-3' },
  // Семья 5 (Морозовы) - 2 ребенка
  { id: 'familymember-9', familyId: 'family-5', pupilId: 'pupil-2-4' },
  { id: 'familymember-10', familyId: 'family-5', pupilId: 'pupil-2-5' },
  // Остальные ученики распределяем по семьям
  { id: 'familymember-11', familyId: 'family-1', pupilId: 'pupil-3-1' },
  { id: 'familymember-12', familyId: 'family-2', pupilId: 'pupil-3-2' },
  { id: 'familymember-13', familyId: 'family-3', pupilId: 'pupil-3-3' },
  { id: 'familymember-14', familyId: 'family-4', pupilId: 'pupil-3-4' },
  { id: 'familymember-15', familyId: 'family-5', pupilId: 'pupil-3-5' },
];

// UserFamily: 12 связей (по 2-3 PARENT на каждую Family)
export const userFamiliesSeedData: UserFamilySeedData[] = [
  // Семья 1 (Ивановы) - 2 родителя
  { id: 'userfamily-1', userId: 'user-parent-1', familyId: 'family-1', phone: '+7 (999) 123-45-69' },
  { id: 'userfamily-2', userId: 'user-parent-2', familyId: 'family-1', phone: '+7 (999) 123-45-68' },
  // Семья 2 (Петровы) - 2 родителя
  { id: 'userfamily-3', userId: 'user-parent-3', familyId: 'family-2', phone: '+7 (999) 234-56-80' },
  { id: 'userfamily-4', userId: 'user-parent-4', familyId: 'family-2', phone: '+7 (999) 234-56-79' },
  // Семья 3 (Сидоровы) - 2 родителя
  { id: 'userfamily-5', userId: 'user-parent-5', familyId: 'family-3', phone: '+7 (999) 345-67-91' },
  { id: 'userfamily-6', userId: 'user-parent-6', familyId: 'family-3', phone: '+7 (999) 345-67-90' },
  // Семья 4 (Козловы) - 2 родителя
  { id: 'userfamily-7', userId: 'user-parent-7', familyId: 'family-4', phone: '+7 (999) 456-78-92' },
  { id: 'userfamily-8', userId: 'user-parent-8', familyId: 'family-4', phone: '+7 (999) 456-78-91' },
  // Семья 5 (Морозовы) - 2 родителя (используем первых двух родителей повторно для демонстрации)
  { id: 'userfamily-9', userId: 'user-parent-1', familyId: 'family-5', phone: '+7 (999) 567-89-03' },
  { id: 'userfamily-10', userId: 'user-parent-2', familyId: 'family-5', phone: '+7 (999) 567-89-02' },
  // Дополнительные связи для полноты
  { id: 'userfamily-11', userId: 'user-parent-3', familyId: 'family-1', phone: '+7 (999) 123-45-67' },
  { id: 'userfamily-12', userId: 'user-parent-4', familyId: 'family-3', phone: '+7 (999) 345-67-89' },
];

// GradeEvent: 12 экземпляров (по 4 на каждую Grade)
export const gradeEventsSeedData: GradeEventSeedData[] = [
  // Grade 1 (4 события)
  {
    id: 'gradeevent-1-1',
    gradeId: 'grade-1',
    eventType: 'LESSON',
    title: 'Обычный урок',
    description: 'Стандартное занятие по расписанию',
    eventDate: '2024-09-08',
  },
  {
    id: 'gradeevent-1-2',
    gradeId: 'grade-1',
    eventType: 'OUTDOOR_EVENT',
    title: 'Поездка в музей',
    description: 'Экскурсия для детей младшей группы',
    eventDate: '2024-09-22',
  },
  {
    id: 'gradeevent-1-3',
    gradeId: 'grade-1',
    eventType: 'LESSON',
    title: 'Обычный урок',
    description: 'Стандартное занятие по расписанию',
    eventDate: '2024-10-06',
  },
  {
    id: 'gradeevent-1-4',
    gradeId: 'grade-1',
    eventType: 'LESSON_SKIPPING',
    title: 'Отмена урока',
    description: 'Праздничный день',
    eventDate: '2024-10-13',
  },
  // Grade 2 (4 события)
  {
    id: 'gradeevent-2-1',
    gradeId: 'grade-2',
    eventType: 'LESSON',
    title: 'Обычный урок',
    description: 'Стандартное занятие по расписанию',
    eventDate: '2024-09-08',
  },
  {
    id: 'gradeevent-2-2',
    gradeId: 'grade-2',
    eventType: 'OUTDOOR_EVENT',
    title: 'Выездное мероприятие',
    description: 'Поездка на природу',
    eventDate: '2024-09-29',
  },
  {
    id: 'gradeevent-2-3',
    gradeId: 'grade-2',
    eventType: 'LESSON',
    title: 'Обычный урок',
    description: 'Стандартное занятие по расписанию',
    eventDate: '2024-10-06',
  },
  {
    id: 'gradeevent-2-4',
    gradeId: 'grade-2',
    eventType: 'LESSON',
    title: 'Обычный урок',
    description: 'Стандартное занятие по расписанию',
    eventDate: '2024-10-13',
  },
  // Grade 3 (4 события)
  {
    id: 'gradeevent-3-1',
    gradeId: 'grade-3',
    eventType: 'LESSON',
    title: 'Обычный урок',
    description: 'Стандартное занятие по расписанию',
    eventDate: '2024-09-08',
  },
  {
    id: 'gradeevent-3-2',
    gradeId: 'grade-3',
    eventType: 'OUTDOOR_EVENT',
    title: 'Молодежная встреча',
    description: 'Выездное мероприятие для старшей группы',
    eventDate: '2024-09-15',
  },
  {
    id: 'gradeevent-3-3',
    gradeId: 'grade-3',
    eventType: 'LESSON',
    title: 'Обычный урок',
    description: 'Стандартное занятие по расписанию',
    eventDate: '2024-10-06',
  },
  {
    id: 'gradeevent-3-4',
    gradeId: 'grade-3',
    eventType: 'LESSON',
    title: 'Обычный урок',
    description: 'Стандартное занятие по расписанию',
    eventDate: '2024-10-13',
  },
];

// GradeSettings: 3 экземпляра (по 1 на каждую Grade)
export const gradeSettingsSeedData: GradeSettingsSeedData[] = [
  {
    id: 'gradesettings-1',
    gradeId: 'grade-1',
    enableGoldenVerse: true,
    enableTest: true,
    enableNotebook: true,
    enableSinging: true,
    pointsGoldenVerse: 2,
    pointsTest: 10,
    pointsNotebook: 10,
    pointsSinging: 5,
    labelGoldenVerse: 'Золотые стихи',
    labelTest: 'Тест',
    labelNotebook: 'Тетрадь',
    labelSinging: 'Спевка',
  },
  {
    id: 'gradesettings-2',
    gradeId: 'grade-2',
    enableGoldenVerse: true,
    enableTest: true,
    enableNotebook: true,
    enableSinging: false,
    pointsGoldenVerse: 2,
    pointsTest: 10,
    pointsNotebook: 10,
    pointsSinging: 5,
    labelGoldenVerse: 'Золотые стихи',
    labelTest: 'Тест',
    labelNotebook: 'Тетрадь',
    labelSinging: 'Спевка',
  },
  {
    id: 'gradesettings-3',
    gradeId: 'grade-3',
    enableGoldenVerse: true,
    enableTest: true,
    enableNotebook: true,
    enableSinging: true,
    pointsGoldenVerse: 2,
    pointsTest: 10,
    pointsNotebook: 10,
    pointsSinging: 5,
    labelGoldenVerse: 'Золотые стихи',
    labelTest: 'Письменная работа',
    labelNotebook: 'Тетрадь',
    labelSinging: 'Спевка',
  },
];

