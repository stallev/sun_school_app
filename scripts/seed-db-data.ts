/**
 * Данные для заполнения всех таблиц DynamoDB тестовыми данными
 * Используется при инициализации базы данных для тестирования интерфейса и функционала
 * 
 * Все данные типизированы строго по GraphQL схеме
 * 
 * ВАЖНО: Все ID должны быть UUID v4. Данные Book должны быть идентичны текущим в БД.
 */

import { randomUUID, createHash } from 'crypto';

/**
 * Генерирует детерминированный UUID на основе строки
 * Используется для создания фиксированных UUID в seed данных
 */
function deterministicUUID(seed: string): string {
  const hash = createHash('sha256').update(seed).digest('hex');
  return [
    hash.substring(0, 8),
    hash.substring(8, 12),
    '4' + hash.substring(13, 16), // версия 4
    ((parseInt(hash.substring(16, 18), 16) & 0x3f) | 0x80).toString(16) + hash.substring(18, 20), // вариант
    hash.substring(20, 32),
  ].join('-');
}

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

export interface BookSeedData {
  id: string;
  fullName: string;
  shortName: string;
  abbreviation: string;
  testament: 'OLD' | 'NEW';
  order: number;
}

export interface BricksIssueSeedData {
  id: string;
  pupilId: string;
  academicYearId: string;
  gradeId: string;
  quantity: number; // Количество выданных кирпичиков (1-5)
  issuedAt: string; // AWSDateTime ISO string
  issuedBy: string; // UUID из usersSeedData, роль TEACHER
}

// ============================================
// UUID CONSTANTS (для фиксированных ID)
// ============================================
// Все UUID генерируются один раз и используются для связей между записями

// Grade UUIDs (детерминированные для фиксированных seed данных)
const GRADE_1_UUID = deterministicUUID('grade-1');
const GRADE_2_UUID = deterministicUUID('grade-2');
const GRADE_3_UUID = deterministicUUID('grade-3');

// User UUIDs (для пользователей не из Cognito, детерминированные)
const USER_TEACHER_2_UUID = deterministicUUID('user-teacher-2');
const USER_TEACHER_3_UUID = deterministicUUID('user-teacher-3');
const USER_ADMIN_2_UUID = deterministicUUID('user-admin-2');
const USER_PARENT_1_UUID = deterministicUUID('user-parent-1');
const USER_PARENT_2_UUID = deterministicUUID('user-parent-2');
const USER_PARENT_3_UUID = deterministicUUID('user-parent-3');
const USER_PARENT_4_UUID = deterministicUUID('user-parent-4');
const USER_PARENT_5_UUID = deterministicUUID('user-parent-5');
const USER_PARENT_6_UUID = deterministicUUID('user-parent-6');
const USER_PARENT_7_UUID = deterministicUUID('user-parent-7');
const USER_PARENT_8_UUID = deterministicUUID('user-parent-8');

// AcademicYear UUIDs (детерминированные)
const ACADEMIC_YEAR_1_UUID = deterministicUUID('academicyear-1');
const ACADEMIC_YEAR_2_UUID = deterministicUUID('academicyear-2');
const ACADEMIC_YEAR_3_UUID = deterministicUUID('academicyear-3');

// Lesson UUIDs (детерминированные)
const LESSON_1_1_UUID = deterministicUUID('lesson-1-1');
const LESSON_1_2_UUID = deterministicUUID('lesson-1-2');
const LESSON_1_3_UUID = deterministicUUID('lesson-1-3');
const LESSON_1_4_UUID = deterministicUUID('lesson-1-4');
const LESSON_1_5_UUID = deterministicUUID('lesson-1-5');
const LESSON_2_1_UUID = deterministicUUID('lesson-2-1');
const LESSON_2_2_UUID = deterministicUUID('lesson-2-2');
const LESSON_2_3_UUID = deterministicUUID('lesson-2-3');
const LESSON_2_4_UUID = deterministicUUID('lesson-2-4');
const LESSON_2_5_UUID = deterministicUUID('lesson-2-5');
const LESSON_3_1_UUID = deterministicUUID('lesson-3-1');
const LESSON_3_2_UUID = deterministicUUID('lesson-3-2');
const LESSON_3_3_UUID = deterministicUUID('lesson-3-3');
const LESSON_3_4_UUID = deterministicUUID('lesson-3-4');
const LESSON_3_5_UUID = deterministicUUID('lesson-3-5');

// GoldenVerse UUIDs (детерминированные)
const GOLDEN_VERSE_1_UUID = deterministicUUID('goldenverse-1');
const GOLDEN_VERSE_2_UUID = deterministicUUID('goldenverse-2');
const GOLDEN_VERSE_3_UUID = deterministicUUID('goldenverse-3');
const GOLDEN_VERSE_4_UUID = deterministicUUID('goldenverse-4');
const GOLDEN_VERSE_5_UUID = deterministicUUID('goldenverse-5');
const GOLDEN_VERSE_6_UUID = deterministicUUID('goldenverse-6');
const GOLDEN_VERSE_7_UUID = deterministicUUID('goldenverse-7');
const GOLDEN_VERSE_8_UUID = deterministicUUID('goldenverse-8');
const GOLDEN_VERSE_9_UUID = deterministicUUID('goldenverse-9');
const GOLDEN_VERSE_10_UUID = deterministicUUID('goldenverse-10');
const GOLDEN_VERSE_11_UUID = deterministicUUID('goldenverse-11');
const GOLDEN_VERSE_12_UUID = deterministicUUID('goldenverse-12');
const GOLDEN_VERSE_13_UUID = deterministicUUID('goldenverse-13');
const GOLDEN_VERSE_14_UUID = deterministicUUID('goldenverse-14');
const GOLDEN_VERSE_15_UUID = deterministicUUID('goldenverse-15');

// Pupil UUIDs (детерминированные)
const PUPIL_1_1_UUID = deterministicUUID('pupil-1-1');
const PUPIL_1_2_UUID = deterministicUUID('pupil-1-2');
const PUPIL_1_3_UUID = deterministicUUID('pupil-1-3');
const PUPIL_1_4_UUID = deterministicUUID('pupil-1-4');
const PUPIL_1_5_UUID = deterministicUUID('pupil-1-5');
const PUPIL_2_1_UUID = deterministicUUID('pupil-2-1');
const PUPIL_2_2_UUID = deterministicUUID('pupil-2-2');
const PUPIL_2_3_UUID = deterministicUUID('pupil-2-3');
const PUPIL_2_4_UUID = deterministicUUID('pupil-2-4');
const PUPIL_2_5_UUID = deterministicUUID('pupil-2-5');
const PUPIL_3_1_UUID = deterministicUUID('pupil-3-1');
const PUPIL_3_2_UUID = deterministicUUID('pupil-3-2');
const PUPIL_3_3_UUID = deterministicUUID('pupil-3-3');
const PUPIL_3_4_UUID = deterministicUUID('pupil-3-4');
const PUPIL_3_5_UUID = deterministicUUID('pupil-3-5');

// Achievement UUIDs (детерминированные)
const ACHIEVEMENT_1_UUID = deterministicUUID('achievement-1');
const ACHIEVEMENT_2_UUID = deterministicUUID('achievement-2');
const ACHIEVEMENT_3_UUID = deterministicUUID('achievement-3');
const ACHIEVEMENT_4_UUID = deterministicUUID('achievement-4');
const ACHIEVEMENT_5_UUID = deterministicUUID('achievement-5');
const ACHIEVEMENT_6_UUID = deterministicUUID('achievement-6');

// Family UUIDs (детерминированные)
const FAMILY_1_UUID = deterministicUUID('family-1');
const FAMILY_2_UUID = deterministicUUID('family-2');
const FAMILY_3_UUID = deterministicUUID('family-3');
const FAMILY_4_UUID = deterministicUUID('family-4');
const FAMILY_5_UUID = deterministicUUID('family-5');

// GradeEvent UUIDs (12 событий, детерминированные)
const GRADE_EVENT_1_1_UUID = deterministicUUID('gradeevent-1-1');
const GRADE_EVENT_1_2_UUID = deterministicUUID('gradeevent-1-2');
const GRADE_EVENT_1_3_UUID = deterministicUUID('gradeevent-1-3');
const GRADE_EVENT_1_4_UUID = deterministicUUID('gradeevent-1-4');
const GRADE_EVENT_2_1_UUID = deterministicUUID('gradeevent-2-1');
const GRADE_EVENT_2_2_UUID = deterministicUUID('gradeevent-2-2');
const GRADE_EVENT_2_3_UUID = deterministicUUID('gradeevent-2-3');
const GRADE_EVENT_2_4_UUID = deterministicUUID('gradeevent-2-4');
const GRADE_EVENT_3_1_UUID = deterministicUUID('gradeevent-3-1');
const GRADE_EVENT_3_2_UUID = deterministicUUID('gradeevent-3-2');
const GRADE_EVENT_3_3_UUID = deterministicUUID('gradeevent-3-3');
const GRADE_EVENT_3_4_UUID = deterministicUUID('gradeevent-3-4');

// GradeSettings UUIDs (детерминированные)
const GRADE_SETTINGS_1_UUID = deterministicUUID('gradesettings-1');
const GRADE_SETTINGS_2_UUID = deterministicUUID('gradesettings-2');
const GRADE_SETTINGS_3_UUID = deterministicUUID('gradesettings-3');

// ============================================
// SEED DATA
// ============================================

// Book: 66 экземпляров (полностью идентичны текущим данным из БД)
// Данные получены из DynamoDB (dev) и должны оставаться неизменными
export const booksSeedData: BookSeedData[] = [
  { id: '19323632-6042-4564-a874-e5e6d7963b3a', fullName: 'Бытие', shortName: 'Бытие', abbreviation: 'Быт', testament: 'OLD', order: 1 },
  { id: 'a1f55838-8715-4758-8184-3405ff3f206a', fullName: 'Исход', shortName: 'Исход', abbreviation: 'Исх', testament: 'OLD', order: 2 },
  { id: 'f03d652c-35b9-4ae8-bc6f-d24e7ddaf99d', fullName: 'Левит', shortName: 'Левит', abbreviation: 'Лев', testament: 'OLD', order: 3 },
  { id: '058cf9ce-dcd3-4d29-a47f-ebb89b729b50', fullName: 'Числа', shortName: 'Числа', abbreviation: 'Чис', testament: 'OLD', order: 4 },
  { id: 'bccc05a4-5667-46a0-ad57-58675e942198', fullName: 'Второзаконие', shortName: 'Второзаконие', abbreviation: 'Втор', testament: 'OLD', order: 5 },
  { id: 'd8520553-972b-4aa7-bf78-84ffd1f1be52', fullName: 'Иисус Навин', shortName: 'Иисус Навин', abbreviation: 'Нав', testament: 'OLD', order: 6 },
  { id: '2ed79639-8fff-425b-bb61-503bcd1e2240', fullName: 'Судьи', shortName: 'Судьи', abbreviation: 'Суд', testament: 'OLD', order: 7 },
  { id: '85c0363c-18aa-4fbf-b2e9-db61e82bb264', fullName: 'Руфь', shortName: 'Руфь', abbreviation: 'Руф', testament: 'OLD', order: 8 },
  { id: '8fa7e7ef-bb1c-4066-86a3-e8214b0931d2', fullName: '1 Царств', shortName: '1 Царств', abbreviation: '1Цар', testament: 'OLD', order: 9 },
  { id: '9130a42d-2b34-459d-830e-3f74982404a3', fullName: '2 Царств', shortName: '2 Царств', abbreviation: '2Цар', testament: 'OLD', order: 10 },
  { id: 'fd60046c-3c3b-491f-bf0b-331eeb0c8270', fullName: '3 Царств', shortName: '3 Царств', abbreviation: '3Цар', testament: 'OLD', order: 11 },
  { id: 'ddd68d0d-ebec-4192-aa20-51deaf3b47b3', fullName: '4 Царств', shortName: '4 Царств', abbreviation: '4Цар', testament: 'OLD', order: 12 },
  { id: '49e5c132-bc8b-4cd0-b917-13c3191131da', fullName: '1 Паралипоменон', shortName: '1 Паралипоменон', abbreviation: '1Пар', testament: 'OLD', order: 13 },
  { id: '4d020f32-f319-485f-9dd2-018377b9f5ad', fullName: '2 Паралипоменон', shortName: '2 Паралипоменон', abbreviation: '2Пар', testament: 'OLD', order: 14 },
  { id: '3429fb80-c3af-4e35-aa7b-4328e632b59a', fullName: 'Ездра', shortName: 'Ездра', abbreviation: 'Езд', testament: 'OLD', order: 15 },
  { id: 'eaab06d7-398c-4a48-b85c-8409aea6b592', fullName: 'Неемия', shortName: 'Неемия', abbreviation: 'Неем', testament: 'OLD', order: 16 },
  { id: '30c3f3ca-d28a-4e78-bb66-4d988b9c4651', fullName: 'Есфирь', shortName: 'Есфирь', abbreviation: 'Есф', testament: 'OLD', order: 17 },
  { id: 'd853606e-a145-4b04-a6ec-963938de5268', fullName: 'Иов', shortName: 'Иов', abbreviation: 'Иов', testament: 'OLD', order: 18 },
  { id: '7a99aa7f-c5b8-4446-81fc-cc1af2eb77c4', fullName: 'Псалтирь', shortName: 'Псалтирь', abbreviation: 'Пс', testament: 'OLD', order: 19 },
  { id: 'c5942c50-f2c4-4ad1-84b6-9d1fdcd66658', fullName: 'Притчи Соломоновы', shortName: 'Притчи', abbreviation: 'Прит', testament: 'OLD', order: 20 },
  { id: 'e6438efd-379a-454b-b33a-2d3d276ae9c9', fullName: 'Екклесиаст', shortName: 'Екклесиаст', abbreviation: 'Екк', testament: 'OLD', order: 21 },
  { id: 'a72f76be-1bf1-4ded-8ce6-a255aa7eb3dc', fullName: 'Песнь песней Соломона', shortName: 'Песнь песней', abbreviation: 'Песн', testament: 'OLD', order: 22 },
  { id: '442db527-30d7-41e0-b151-5d12fc43573b', fullName: 'Исаия', shortName: 'Исаия', abbreviation: 'Ис', testament: 'OLD', order: 23 },
  { id: '6e5570c1-308f-4234-8f85-4ea16c1cf84a', fullName: 'Иеремия', shortName: 'Иеремия', abbreviation: 'Иер', testament: 'OLD', order: 24 },
  { id: '1613fa60-4388-4f24-8933-3d540be14573', fullName: 'Плач Иеремии', shortName: 'Плач Иеремии', abbreviation: 'Плач', testament: 'OLD', order: 25 },
  { id: 'e5d944e7-9ad6-4670-82ac-f33a71336547', fullName: 'Иезекииль', shortName: 'Иезекииль', abbreviation: 'Иез', testament: 'OLD', order: 26 },
  { id: '46af3143-82f8-45e5-b62d-7b346d9e3cf9', fullName: 'Даниил', shortName: 'Даниил', abbreviation: 'Дан', testament: 'OLD', order: 27 },
  { id: 'a2c560e8-c2e7-4583-810c-e6a820569d3e', fullName: 'Осия', shortName: 'Осия', abbreviation: 'Ос', testament: 'OLD', order: 28 },
  { id: 'a099b81f-de3f-4eec-8adc-ff13f5dd8f4b', fullName: 'Иоиль', shortName: 'Иоиль', abbreviation: 'Иоил', testament: 'OLD', order: 29 },
  { id: '79bb6674-e449-4b19-b91a-57d6a92f4bf2', fullName: 'Амос', shortName: 'Амос', abbreviation: 'Ам', testament: 'OLD', order: 30 },
  { id: '23edf1f5-7d5f-4b4f-97b8-8138a5743db0', fullName: 'Авдий', shortName: 'Авдий', abbreviation: 'Авд', testament: 'OLD', order: 31 },
  { id: '7c27119f-1592-49b4-8a09-af5f61358f56', fullName: 'Иона', shortName: 'Иона', abbreviation: 'Ион', testament: 'OLD', order: 32 },
  { id: 'a251fb51-5e90-4c8c-9825-ad357798133c', fullName: 'Михей', shortName: 'Михей', abbreviation: 'Мих', testament: 'OLD', order: 33 },
  { id: 'c7946382-69bf-4f9d-94a2-035d08419ecf', fullName: 'Наум', shortName: 'Наум', abbreviation: 'Наум', testament: 'OLD', order: 34 },
  { id: 'c67da010-9f32-4b25-b084-62f430042676', fullName: 'Аввакум', shortName: 'Аввакум', abbreviation: 'Авв', testament: 'OLD', order: 35 },
  { id: '7769974e-cd9f-4ada-a53a-434330bc777e', fullName: 'Софония', shortName: 'Софония', abbreviation: 'Соф', testament: 'OLD', order: 36 },
  { id: 'a3429c91-668b-4d71-bc1e-c57b3838bc14', fullName: 'Аггей', shortName: 'Аггей', abbreviation: 'Агг', testament: 'OLD', order: 37 },
  { id: 'e976431e-6717-4925-ab23-ab1e5a96e640', fullName: 'Захария', shortName: 'Захария', abbreviation: 'Зах', testament: 'OLD', order: 38 },
  { id: 'bab54497-301a-4f55-b179-dbd2265d8e4d', fullName: 'Малахия', shortName: 'Малахия', abbreviation: 'Мал', testament: 'OLD', order: 39 },
  { id: '7a0bebd7-55b2-4997-9cba-f707d9e4e15b', fullName: 'Евангелие от Матфея', shortName: 'Матфея', abbreviation: 'Мф', testament: 'NEW', order: 40 },
  { id: '11183229-9eec-453b-9e84-550c92702356', fullName: 'Евангелие от Марка', shortName: 'Марка', abbreviation: 'Мк', testament: 'NEW', order: 41 },
  { id: 'd2b2e6fe-4d28-4972-a078-222949d396bf', fullName: 'Евангелие от Луки', shortName: 'Луки', abbreviation: 'Лк', testament: 'NEW', order: 42 },
  { id: '721450b7-5c59-49ae-bf0f-f4756220e75b', fullName: 'Евангелие от Иоанна', shortName: 'Иоанна', abbreviation: 'Ин', testament: 'NEW', order: 43 },
  { id: 'b40f42f4-f345-49ea-8a14-045be4d274c3', fullName: 'Деяния святых Апостолов', shortName: 'Деяния', abbreviation: 'Деян', testament: 'NEW', order: 44 },
  { id: 'aa23cdaa-d2f1-4d93-8545-f25709eb4e78', fullName: 'Послание к Римлянам', shortName: 'Римлянам', abbreviation: 'Рим', testament: 'NEW', order: 45 },
  { id: '78b049a2-e15b-4d43-a0b4-94aab1104c87', fullName: '1 Послание к Коринфянам', shortName: '1 Коринфянам', abbreviation: '1Кор', testament: 'NEW', order: 46 },
  { id: 'd9ee050e-3b20-4d17-96ed-17e196173c3a', fullName: '2 Послание к Коринфянам', shortName: '2 Коринфянам', abbreviation: '2Кор', testament: 'NEW', order: 47 },
  { id: '80f7c729-e1b5-4006-a67d-51f7acb3633f', fullName: 'Послание к Галатам', shortName: 'Галатам', abbreviation: 'Гал', testament: 'NEW', order: 48 },
  { id: '656a538a-ec90-4569-98bd-3f5581d8a8c3', fullName: 'Послание к Ефесянам', shortName: 'Ефесянам', abbreviation: 'Еф', testament: 'NEW', order: 49 },
  { id: 'cede14f0-fbc2-4c2f-812c-3078e8737fbe', fullName: 'Послание к Филиппийцам', shortName: 'Филиппийцам', abbreviation: 'Флп', testament: 'NEW', order: 50 },
  { id: '50e7cf3a-44ff-4c83-b2b6-c25477a8de7f', fullName: 'Послание к Колоссянам', shortName: 'Колоссянам', abbreviation: 'Кол', testament: 'NEW', order: 51 },
  { id: 'a85ee039-dcf7-4170-857c-a9cd6f269052', fullName: '1 Послание к Фессалоникийцам', shortName: '1 Фессалоникийцам', abbreviation: '1Фес', testament: 'NEW', order: 52 },
  { id: '79452016-565d-4339-8371-eb0b48186365', fullName: '2 Послание к Фессалоникийцам', shortName: '2 Фессалоникийцам', abbreviation: '2Фес', testament: 'NEW', order: 53 },
  { id: 'c87386de-cae7-4651-9e83-71d12cd59c34', fullName: '1 Послание к Тимофею', shortName: '1 Тимофею', abbreviation: '1Тим', testament: 'NEW', order: 54 },
  { id: '396e44fc-2ec9-4b17-ae2c-7f346bbcfe37', fullName: '2 Послание к Тимофею', shortName: '2 Тимофею', abbreviation: '2Тим', testament: 'NEW', order: 55 },
  { id: '6b48720c-b078-4722-9177-89f785446b35', fullName: 'Послание к Титу', shortName: 'Титу', abbreviation: 'Тит', testament: 'NEW', order: 56 },
  { id: '2b88608e-5eea-4cae-8774-fe377c8d5428', fullName: 'Послание к Филимону', shortName: 'Филимону', abbreviation: 'Флм', testament: 'NEW', order: 57 },
  { id: '286b59fb-4814-4cf9-ac90-49588a638f27', fullName: 'Послание к Евреям', shortName: 'Евреям', abbreviation: 'Евр', testament: 'NEW', order: 58 },
  { id: '76509872-7763-4414-b271-4b6aa7bea6fa', fullName: 'Послание Иакова', shortName: 'Иакова', abbreviation: 'Иак', testament: 'NEW', order: 59 },
  { id: 'ccb772aa-6a73-41e0-a02b-d5fed8a85429', fullName: '1 Послание Петра', shortName: '1 Петра', abbreviation: '1Пет', testament: 'NEW', order: 60 },
  { id: '2e7d0333-3bb0-41f3-b3d9-f759c69a6bb6', fullName: '2 Послание Петра', shortName: '2 Петра', abbreviation: '2Пет', testament: 'NEW', order: 61 },
  { id: '6df97228-58bd-4612-896e-cff62a079dc5', fullName: '1 Послание Иоанна', shortName: '1 Иоанна', abbreviation: '1Ин', testament: 'NEW', order: 62 },
  { id: 'f4177f6f-299a-4904-8298-de5b980b3c72', fullName: '2 Послание Иоанна', shortName: '2 Иоанна', abbreviation: '2Ин', testament: 'NEW', order: 63 },
  { id: '84f00c9a-beab-4aa7-b0b5-6594e07947ec', fullName: '3 Послание Иоанна', shortName: '3 Иоанна', abbreviation: '3Ин', testament: 'NEW', order: 64 },
  { id: '7a1d444c-698a-4c5c-a0dc-cccf0049d689', fullName: 'Послание Иуды', shortName: 'Иуды', abbreviation: 'Иуд', testament: 'NEW', order: 65 },
  { id: 'cf0c5e74-985a-445e-8128-7849c9791492', fullName: 'Откровение Иоанна Богослова', shortName: 'Откровение', abbreviation: 'Откр', testament: 'NEW', order: 66 },
];

// User: 13 экземпляров (3 TEACHER + 2 ADMIN + 8 PARENT)
// ВАЖНО: Пользователи из Cognito используют их реальные sub как id
// Пользователи из Cognito (dev):
// - superadmin@test.com: 04b80498-b0d1-7025-3ba7-a22b99506dae (SUPERADMIN)
// - admin@test.com: c46814c8-9011-7070-d574-20d53a5d8ff8 (ADMIN)
// - teacher@test.com: 6418f488-8001-70b2-b88d-49bc855e72e3 (TEACHER)
export const usersSeedData: UserSeedData[] = [
  // TEACHER (3)
  // Пользователь из Cognito (teacher@test.com)
  {
    id: '6418f488-8001-70b2-b88d-49bc855e72e3', // sub из Cognito
    email: 'teacher@test.com',
    name: 'Иванова Мария Васильевна',
    role: 'TEACHER',
    photo: null,
    active: true,
  },
  {
    id: USER_TEACHER_2_UUID,
    email: 'teacher2@church.com',
    name: 'Петров Иван Сергеевич',
    role: 'TEACHER',
    photo: null,
    active: true,
  },
  {
    id: USER_TEACHER_3_UUID,
    email: 'teacher3@church.com',
    name: 'Сидорова Анна Петровна',
    role: 'TEACHER',
    photo: null,
    active: true,
  },
  // ADMIN (2)
  // Пользователь из Cognito (admin@test.com)
  {
    id: 'c46814c8-9011-7070-d574-20d53a5d8ff8', // sub из Cognito
    email: 'admin@test.com',
    name: 'Смирнов Алексей Николаевич',
    role: 'ADMIN',
    photo: null,
    active: true,
  },
  {
    id: USER_ADMIN_2_UUID,
    email: 'admin2@church.com',
    name: 'Козлова Елена Владимировна',
    role: 'ADMIN',
    photo: null,
    active: true,
  },
  // SUPERADMIN (1) - из Cognito
  {
    id: '04b80498-b0d1-7025-3ba7-a22b99506dae', // sub из Cognito
    email: 'superadmin@test.com',
    name: 'Супер Администратор',
    role: 'SUPERADMIN',
    photo: null,
    active: true,
  },
  // PARENT (8)
  {
    id: USER_PARENT_1_UUID,
    email: 'parent1@example.com',
    name: 'Иванов Иван Иванович',
    role: 'PARENT',
    photo: null,
    active: true,
  },
  {
    id: USER_PARENT_2_UUID,
    email: 'parent2@example.com',
    name: 'Иванова Мария Ивановна',
    role: 'PARENT',
    photo: null,
    active: true,
  },
  {
    id: USER_PARENT_3_UUID,
    email: 'parent3@example.com',
    name: 'Петров Петр Петрович',
    role: 'PARENT',
    photo: null,
    active: true,
  },
  {
    id: USER_PARENT_4_UUID,
    email: 'parent4@example.com',
    name: 'Петрова Ольга Петровна',
    role: 'PARENT',
    photo: null,
    active: true,
  },
  {
    id: USER_PARENT_5_UUID,
    email: 'parent5@example.com',
    name: 'Сидоров Сидор Сидорович',
    role: 'PARENT',
    photo: null,
    active: true,
  },
  {
    id: USER_PARENT_6_UUID,
    email: 'parent6@example.com',
    name: 'Сидорова Елена Сидоровна',
    role: 'PARENT',
    photo: null,
    active: true,
  },
  {
    id: USER_PARENT_7_UUID,
    email: 'parent7@example.com',
    name: 'Козлов Козел Козлович',
    role: 'PARENT',
    photo: null,
    active: true,
  },
  {
    id: USER_PARENT_8_UUID,
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
    id: GRADE_1_UUID,
    name: 'Младшая группа',
    description: 'Группа для детей 6-8 лет',
    minAge: 6,
    maxAge: 8,
    active: true,
  },
  {
    id: GRADE_2_UUID,
    name: 'Средняя группа',
    description: 'Группа для детей 9-11 лет',
    minAge: 9,
    maxAge: 11,
    active: true,
  },
  {
    id: GRADE_3_UUID,
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
    id: randomUUID(),
    userId: '6418f488-8001-70b2-b88d-49bc855e72e3', // teacher@test.com из Cognito
    gradeId: GRADE_1_UUID,
  },
  {
    id: randomUUID(),
    userId: USER_TEACHER_2_UUID,
    gradeId: GRADE_2_UUID,
  },
  {
    id: randomUUID(),
    userId: USER_TEACHER_3_UUID,
    gradeId: GRADE_3_UUID,
  },
];

// AcademicYear: 3 экземпляра (по 1 на каждую Grade)
export const academicYearsSeedData: AcademicYearSeedData[] = [
  {
    id: ACADEMIC_YEAR_1_UUID,
    gradeId: GRADE_1_UUID,
    name: '2024-2025',
    startDate: '2024-09-01',
    endDate: '2025-05-31',
    status: 'ACTIVE',
  },
  {
    id: ACADEMIC_YEAR_2_UUID,
    gradeId: GRADE_2_UUID,
    name: '2024-2025',
    startDate: '2024-09-01',
    endDate: '2025-05-31',
    status: 'ACTIVE',
  },
  {
    id: ACADEMIC_YEAR_3_UUID,
    gradeId: GRADE_3_UUID,
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
    id: LESSON_1_1_UUID,
    academicYearId: ACADEMIC_YEAR_1_UUID,
    gradeId: GRADE_1_UUID,
    teacherId: '6418f488-8001-70b2-b88d-49bc855e72e3', // teacher@test.com из Cognito
    title: 'Сотворение мира',
    content: null,
    lessonDate: '2024-09-08',
    order: 1,
  },
  {
    id: LESSON_1_2_UUID,
    academicYearId: ACADEMIC_YEAR_1_UUID,
    gradeId: GRADE_1_UUID,
    teacherId: '6418f488-8001-70b2-b88d-49bc855e72e3',
    title: 'Адам и Ева',
    content: null,
    lessonDate: '2024-09-15',
    order: 2,
  },
  {
    id: LESSON_1_3_UUID,
    academicYearId: ACADEMIC_YEAR_1_UUID,
    gradeId: GRADE_1_UUID,
    teacherId: '6418f488-8001-70b2-b88d-49bc855e72e3',
    title: 'Каин и Авель',
    content: null,
    lessonDate: '2024-09-22',
    order: 3,
  },
  {
    id: LESSON_1_4_UUID,
    academicYearId: ACADEMIC_YEAR_1_UUID,
    gradeId: GRADE_1_UUID,
    teacherId: '6418f488-8001-70b2-b88d-49bc855e72e3',
    title: 'Ной и потоп',
    content: null,
    lessonDate: '2024-09-29',
    order: 4,
  },
  {
    id: LESSON_1_5_UUID,
    academicYearId: ACADEMIC_YEAR_1_UUID,
    gradeId: GRADE_1_UUID,
    teacherId: '6418f488-8001-70b2-b88d-49bc855e72e3',
    title: 'Вавилонская башня',
    content: null,
    lessonDate: '2024-10-06',
    order: 5,
  },
  // Grade 2 (5 уроков)
  {
    id: LESSON_2_1_UUID,
    academicYearId: ACADEMIC_YEAR_2_UUID,
    gradeId: GRADE_2_UUID,
    teacherId: USER_TEACHER_2_UUID,
    title: 'Авраам - друг Божий',
    content: null,
    lessonDate: '2024-09-08',
    order: 1,
  },
  {
    id: LESSON_2_2_UUID,
    academicYearId: ACADEMIC_YEAR_2_UUID,
    gradeId: GRADE_2_UUID,
    teacherId: USER_TEACHER_2_UUID,
    title: 'Исаак и Ревекка',
    content: null,
    lessonDate: '2024-09-15',
    order: 2,
  },
  {
    id: LESSON_2_3_UUID,
    academicYearId: ACADEMIC_YEAR_2_UUID,
    gradeId: GRADE_2_UUID,
    teacherId: USER_TEACHER_2_UUID,
    title: 'Иаков и Исав',
    content: null,
    lessonDate: '2024-09-22',
    order: 3,
  },
  {
    id: LESSON_2_4_UUID,
    academicYearId: ACADEMIC_YEAR_2_UUID,
    gradeId: GRADE_2_UUID,
    teacherId: USER_TEACHER_2_UUID,
    title: 'Иосиф в Египте',
    content: null,
    lessonDate: '2024-09-29',
    order: 4,
  },
  {
    id: LESSON_2_5_UUID,
    academicYearId: ACADEMIC_YEAR_2_UUID,
    gradeId: GRADE_2_UUID,
    teacherId: USER_TEACHER_2_UUID,
    title: 'Моисей и исход из Египта',
    content: null,
    lessonDate: '2024-10-06',
    order: 5,
  },
  // Grade 3 (5 уроков)
  {
    id: LESSON_3_1_UUID,
    academicYearId: ACADEMIC_YEAR_3_UUID,
    gradeId: GRADE_3_UUID,
    teacherId: USER_TEACHER_3_UUID,
    title: 'Рождение Иисуса',
    content: null,
    lessonDate: '2024-09-08',
    order: 1,
  },
  {
    id: LESSON_3_2_UUID,
    academicYearId: ACADEMIC_YEAR_3_UUID,
    gradeId: GRADE_3_UUID,
    teacherId: USER_TEACHER_3_UUID,
    title: 'Крещение Иисуса',
    content: null,
    lessonDate: '2024-09-15',
    order: 2,
  },
  {
    id: LESSON_3_3_UUID,
    academicYearId: ACADEMIC_YEAR_3_UUID,
    gradeId: GRADE_3_UUID,
    teacherId: USER_TEACHER_3_UUID,
    title: 'Первые ученики',
    content: null,
    lessonDate: '2024-09-22',
    order: 3,
  },
  {
    id: LESSON_3_4_UUID,
    academicYearId: ACADEMIC_YEAR_3_UUID,
    gradeId: GRADE_3_UUID,
    teacherId: USER_TEACHER_3_UUID,
    title: 'Нагорная проповедь',
    content: null,
    lessonDate: '2024-09-29',
    order: 4,
  },
  {
    id: LESSON_3_5_UUID,
    academicYearId: ACADEMIC_YEAR_3_UUID,
    gradeId: GRADE_3_UUID,
    teacherId: USER_TEACHER_3_UUID,
    title: 'Чудеса Иисуса',
    content: null,
    lessonDate: '2024-10-06',
    order: 5,
  },
];

// GoldenVerse: 15 экземпляров (bookId из booksSeedData)
// Находим bookId по abbreviation из reference
const getBookIdByAbbreviation = (abbrev: string): string => {
  const book = booksSeedData.find((b) => b.abbreviation === abbrev);
  if (!book) {
    throw new Error(`Book not found for abbreviation: ${abbrev}`);
  }
  return book.id;
};

export const goldenVersesSeedData: GoldenVerseSeedData[] = [
  {
    id: GOLDEN_VERSE_1_UUID,
    reference: 'Быт. 1:1',
    bookId: getBookIdByAbbreviation('Быт'),
    chapter: 1,
    verseStart: 1,
    verseEnd: null,
    text: 'В начале сотворил Бог небо и землю.',
  },
  {
    id: GOLDEN_VERSE_2_UUID,
    reference: 'Быт. 1:27',
    bookId: getBookIdByAbbreviation('Быт'),
    chapter: 1,
    verseStart: 27,
    verseEnd: null,
    text: 'И сотворил Бог человека по образу Своему, по образу Божию сотворил его; мужчину и женщину сотворил их.',
  },
  {
    id: GOLDEN_VERSE_3_UUID,
    reference: 'Быт. 2:7',
    bookId: getBookIdByAbbreviation('Быт'),
    chapter: 2,
    verseStart: 7,
    verseEnd: null,
    text: 'И создал Господь Бог человека из праха земного, и вдунул в лице его дыхание жизни, и стал человек душею живою.',
  },
  {
    id: GOLDEN_VERSE_4_UUID,
    reference: 'Быт. 4:9',
    bookId: getBookIdByAbbreviation('Быт'),
    chapter: 4,
    verseStart: 9,
    verseEnd: null,
    text: 'И сказал Господь Каину: где Авель, брат твой? Он сказал: не знаю; разве я сторож брату моему?',
  },
  {
    id: GOLDEN_VERSE_5_UUID,
    reference: 'Быт. 6:9',
    bookId: getBookIdByAbbreviation('Быт'),
    chapter: 6,
    verseStart: 9,
    verseEnd: null,
    text: 'Вот житие Ноя: Ной был человек праведный и непорочный в роде своем; Ной ходил пред Богом.',
  },
  {
    id: GOLDEN_VERSE_6_UUID,
    reference: 'Быт. 12:2',
    bookId: getBookIdByAbbreviation('Быт'),
    chapter: 12,
    verseStart: 2,
    verseEnd: null,
    text: 'И Я произведу от тебя великий народ, и благословлю тебя, и возвеличу имя твое, и будешь ты в благословение.',
  },
  {
    id: GOLDEN_VERSE_7_UUID,
    reference: 'Быт. 22:14',
    bookId: getBookIdByAbbreviation('Быт'),
    chapter: 22,
    verseStart: 14,
    verseEnd: null,
    text: 'И нарек Авраам имя месту тому: Иегова-ире. Посему и ныне говорится: на горе Иеговы усмотрится.',
  },
  {
    id: GOLDEN_VERSE_8_UUID,
    reference: 'Быт. 37:3',
    bookId: getBookIdByAbbreviation('Быт'),
    chapter: 37,
    verseStart: 3,
    verseEnd: null,
    text: 'Израиль любил Иосифа более всех сыновей своих, потому что он был сын старости его, и сделал ему разноцветную одежду.',
  },
  {
    id: GOLDEN_VERSE_9_UUID,
    reference: 'Исх. 3:14',
    bookId: getBookIdByAbbreviation('Исх'),
    chapter: 3,
    verseStart: 14,
    verseEnd: null,
    text: 'Бог сказал Моисею: Я есмь Сущий. И сказал: так скажи сынам Израилевым: Сущий послал меня к вам.',
  },
  {
    id: GOLDEN_VERSE_10_UUID,
    reference: 'Исх. 20:3',
    bookId: getBookIdByAbbreviation('Исх'),
    chapter: 20,
    verseStart: 3,
    verseEnd: null,
    text: 'Да не будет у тебя других богов пред лицем Моим.',
  },
  {
    id: GOLDEN_VERSE_11_UUID,
    reference: 'Иоанна 3:16',
    bookId: getBookIdByAbbreviation('Ин'),
    chapter: 3,
    verseStart: 16,
    verseEnd: null,
    text: 'Ибо так возлюбил Бог мир, что отдал Сына Своего Единородного, дабы всякий верующий в Него, не погиб, но имел жизнь вечную.',
  },
  {
    id: GOLDEN_VERSE_12_UUID,
    reference: 'Иоанна 1:1',
    bookId: getBookIdByAbbreviation('Ин'),
    chapter: 1,
    verseStart: 1,
    verseEnd: null,
    text: 'В начале было Слово, и Слово было у Бога, и Слово было Бог.',
  },
  {
    id: GOLDEN_VERSE_13_UUID,
    reference: 'Матфея 5:16',
    bookId: getBookIdByAbbreviation('Мф'),
    chapter: 5,
    verseStart: 16,
    verseEnd: null,
    text: 'Так да светит свет ваш пред людьми, чтобы они видели ваши добрые дела и прославляли Отца вашего Небесного.',
  },
  {
    id: GOLDEN_VERSE_14_UUID,
    reference: 'Матфея 6:9',
    bookId: getBookIdByAbbreviation('Мф'),
    chapter: 6,
    verseStart: 9,
    verseEnd: null,
    text: 'Молитесь же так: Отче наш, сущий на небесах! да святится имя Твое.',
  },
  {
    id: GOLDEN_VERSE_15_UUID,
    reference: 'Марка 10:14',
    bookId: getBookIdByAbbreviation('Мк'),
    chapter: 10,
    verseStart: 14,
    verseEnd: null,
    text: 'Увидев то, Иисус вознегодовал и сказал им: пустите детей приходить ко Мне и не препятствуйте им, ибо таковых есть Царствие Божие.',
  },
];

// LessonGoldenVerse: 30 связей (по 2 стиха на каждый урок)
export const lessonGoldenVersesSeedData: LessonGoldenVerseSeedData[] = [
  // Lesson 1-1: 2 стиха
  { id: randomUUID(), lessonId: LESSON_1_1_UUID, goldenVerseId: GOLDEN_VERSE_1_UUID, order: 1 },
  { id: randomUUID(), lessonId: LESSON_1_1_UUID, goldenVerseId: GOLDEN_VERSE_2_UUID, order: 2 },
  // Lesson 1-2: 2 стиха
  { id: randomUUID(), lessonId: LESSON_1_2_UUID, goldenVerseId: GOLDEN_VERSE_2_UUID, order: 1 },
  { id: randomUUID(), lessonId: LESSON_1_2_UUID, goldenVerseId: GOLDEN_VERSE_3_UUID, order: 2 },
  // Lesson 1-3: 2 стиха
  { id: randomUUID(), lessonId: LESSON_1_3_UUID, goldenVerseId: GOLDEN_VERSE_4_UUID, order: 1 },
  { id: randomUUID(), lessonId: LESSON_1_3_UUID, goldenVerseId: GOLDEN_VERSE_1_UUID, order: 2 },
  // Lesson 1-4: 2 стиха
  { id: randomUUID(), lessonId: LESSON_1_4_UUID, goldenVerseId: GOLDEN_VERSE_5_UUID, order: 1 },
  { id: randomUUID(), lessonId: LESSON_1_4_UUID, goldenVerseId: GOLDEN_VERSE_1_UUID, order: 2 },
  // Lesson 1-5: 2 стиха
  { id: randomUUID(), lessonId: LESSON_1_5_UUID, goldenVerseId: GOLDEN_VERSE_1_UUID, order: 1 },
  { id: randomUUID(), lessonId: LESSON_1_5_UUID, goldenVerseId: GOLDEN_VERSE_2_UUID, order: 2 },
  // Lesson 2-1: 2 стиха
  { id: randomUUID(), lessonId: LESSON_2_1_UUID, goldenVerseId: GOLDEN_VERSE_6_UUID, order: 1 },
  { id: randomUUID(), lessonId: LESSON_2_1_UUID, goldenVerseId: GOLDEN_VERSE_7_UUID, order: 2 },
  // Lesson 2-2: 2 стиха
  { id: randomUUID(), lessonId: LESSON_2_2_UUID, goldenVerseId: GOLDEN_VERSE_6_UUID, order: 1 },
  { id: randomUUID(), lessonId: LESSON_2_2_UUID, goldenVerseId: GOLDEN_VERSE_8_UUID, order: 2 },
  // Lesson 2-3: 2 стиха
  { id: randomUUID(), lessonId: LESSON_2_3_UUID, goldenVerseId: GOLDEN_VERSE_8_UUID, order: 1 },
  { id: randomUUID(), lessonId: LESSON_2_3_UUID, goldenVerseId: GOLDEN_VERSE_6_UUID, order: 2 },
  // Lesson 2-4: 2 стиха
  { id: randomUUID(), lessonId: LESSON_2_4_UUID, goldenVerseId: GOLDEN_VERSE_8_UUID, order: 1 },
  { id: randomUUID(), lessonId: LESSON_2_4_UUID, goldenVerseId: GOLDEN_VERSE_9_UUID, order: 2 },
  // Lesson 2-5: 2 стиха
  { id: randomUUID(), lessonId: LESSON_2_5_UUID, goldenVerseId: GOLDEN_VERSE_9_UUID, order: 1 },
  { id: randomUUID(), lessonId: LESSON_2_5_UUID, goldenVerseId: GOLDEN_VERSE_10_UUID, order: 2 },
  // Lesson 3-1: 2 стиха
  { id: randomUUID(), lessonId: LESSON_3_1_UUID, goldenVerseId: GOLDEN_VERSE_11_UUID, order: 1 },
  { id: randomUUID(), lessonId: LESSON_3_1_UUID, goldenVerseId: GOLDEN_VERSE_12_UUID, order: 2 },
  // Lesson 3-2: 2 стиха
  { id: randomUUID(), lessonId: LESSON_3_2_UUID, goldenVerseId: GOLDEN_VERSE_11_UUID, order: 1 },
  { id: randomUUID(), lessonId: LESSON_3_2_UUID, goldenVerseId: GOLDEN_VERSE_13_UUID, order: 2 },
  // Lesson 3-3: 2 стиха
  { id: randomUUID(), lessonId: LESSON_3_3_UUID, goldenVerseId: GOLDEN_VERSE_13_UUID, order: 1 },
  { id: randomUUID(), lessonId: LESSON_3_3_UUID, goldenVerseId: GOLDEN_VERSE_14_UUID, order: 2 },
  // Lesson 3-4: 2 стиха
  { id: randomUUID(), lessonId: LESSON_3_4_UUID, goldenVerseId: GOLDEN_VERSE_14_UUID, order: 1 },
  { id: randomUUID(), lessonId: LESSON_3_4_UUID, goldenVerseId: GOLDEN_VERSE_15_UUID, order: 2 },
  // Lesson 3-5: 2 стиха
  { id: randomUUID(), lessonId: LESSON_3_5_UUID, goldenVerseId: GOLDEN_VERSE_15_UUID, order: 1 },
  { id: randomUUID(), lessonId: LESSON_3_5_UUID, goldenVerseId: GOLDEN_VERSE_11_UUID, order: 2 },
];

// Pupil: 15 экземпляров (по 5 на каждую Grade)
export const pupilsSeedData: PupilSeedData[] = [
  // Grade 1 (5 учеников)
  {
    id: PUPIL_1_1_UUID,
    gradeId: GRADE_1_UUID,
    firstName: 'Анна',
    lastName: 'Иванова',
    middleName: 'Ивановна',
    dateOfBirth: '2018-03-15',
    photo: null,
    active: true,
  },
  {
    id: PUPIL_1_2_UUID,
    gradeId: GRADE_1_UUID,
    firstName: 'Иван',
    lastName: 'Иванов',
    middleName: 'Иванович',
    dateOfBirth: '2017-07-20',
    photo: null,
    active: true,
  },
  {
    id: PUPIL_1_3_UUID,
    gradeId: GRADE_1_UUID,
    firstName: 'Мария',
    lastName: 'Петрова',
    middleName: 'Петровна',
    dateOfBirth: '2018-11-10',
    photo: null,
    active: true,
  },
  {
    id: PUPIL_1_4_UUID,
    gradeId: GRADE_1_UUID,
    firstName: 'Петр',
    lastName: 'Петров',
    middleName: 'Петрович',
    dateOfBirth: '2017-05-25',
    photo: null,
    active: true,
  },
  {
    id: PUPIL_1_5_UUID,
    gradeId: GRADE_1_UUID,
    firstName: 'София',
    lastName: 'Сидорова',
    middleName: 'Сидоровна',
    dateOfBirth: '2018-09-30',
    photo: null,
    active: true,
  },
  // Grade 2 (5 учеников)
  {
    id: PUPIL_2_1_UUID,
    gradeId: GRADE_2_UUID,
    firstName: 'Дмитрий',
    lastName: 'Сидоров',
    middleName: 'Сидорович',
    dateOfBirth: '2015-02-14',
    photo: null,
    active: true,
  },
  {
    id: PUPIL_2_2_UUID,
    gradeId: GRADE_2_UUID,
    firstName: 'Елена',
    lastName: 'Козлова',
    middleName: 'Козловна',
    dateOfBirth: '2014-08-18',
    photo: null,
    active: true,
  },
  {
    id: PUPIL_2_3_UUID,
    gradeId: GRADE_2_UUID,
    firstName: 'Алексей',
    lastName: 'Козлов',
    middleName: 'Козлович',
    dateOfBirth: '2015-12-05',
    photo: null,
    active: true,
  },
  {
    id: PUPIL_2_4_UUID,
    gradeId: GRADE_2_UUID,
    firstName: 'Ольга',
    lastName: 'Морозова',
    middleName: 'Морозовна',
    dateOfBirth: '2014-04-22',
    photo: null,
    active: true,
  },
  {
    id: PUPIL_2_5_UUID,
    gradeId: GRADE_2_UUID,
    firstName: 'Николай',
    lastName: 'Морозов',
    middleName: 'Морозович',
    dateOfBirth: '2015-10-11',
    photo: null,
    active: true,
  },
  // Grade 3 (5 учеников)
  {
    id: PUPIL_3_1_UUID,
    gradeId: GRADE_3_UUID,
    firstName: 'Татьяна',
    lastName: 'Волкова',
    middleName: 'Волковна',
    dateOfBirth: '2012-01-08',
    photo: null,
    active: true,
  },
  {
    id: PUPIL_3_2_UUID,
    gradeId: GRADE_3_UUID,
    firstName: 'Сергей',
    lastName: 'Волков',
    middleName: 'Волкович',
    dateOfBirth: '2011-06-16',
    photo: null,
    active: true,
  },
  {
    id: PUPIL_3_3_UUID,
    gradeId: GRADE_3_UUID,
    firstName: 'Виктория',
    lastName: 'Новикова',
    middleName: 'Новиковна',
    dateOfBirth: '2012-03-24',
    photo: null,
    active: true,
  },
  {
    id: PUPIL_3_4_UUID,
    gradeId: GRADE_3_UUID,
    firstName: 'Андрей',
    lastName: 'Новиков',
    middleName: 'Новикович',
    dateOfBirth: '2011-09-12',
    photo: null,
    active: true,
  },
  {
    id: PUPIL_3_5_UUID,
    gradeId: GRADE_3_UUID,
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
    id: ACHIEVEMENT_1_UUID,
    name: 'Отличник',
    description: 'Получение максимальных баллов за 5 уроков подряд',
    icon: '⭐',
    criteria: JSON.stringify({ type: 'consecutive_max_points', count: 5 }),
  },
  {
    id: ACHIEVEMENT_2_UUID,
    name: 'Активный ученик',
    description: 'Посещение всех уроков в течение месяца',
    icon: '🏃',
    criteria: JSON.stringify({ type: 'attendance', period: 'month', rate: 1.0 }),
  },
  {
    id: ACHIEVEMENT_3_UUID,
    name: 'Знаток Библии',
    description: 'Выучено 20 золотых стихов',
    icon: '📖',
    criteria: JSON.stringify({ type: 'golden_verses', count: 20 }),
  },
  {
    id: ACHIEVEMENT_4_UUID,
    name: 'Лучший помощник',
    description: 'Активное участие в жизни группы',
    icon: '🤝',
    criteria: JSON.stringify({ type: 'participation', level: 'high' }),
  },
  {
    id: ACHIEVEMENT_5_UUID,
    name: 'Творческий подход',
    description: 'Выполнение творческих заданий на отлично',
    icon: '🎨',
    criteria: JSON.stringify({ type: 'creative_tasks', score: 10 }),
  },
  {
    id: ACHIEVEMENT_6_UUID,
    name: 'Лидер группы',
    description: 'Первое место в рейтинге группы',
    icon: '👑',
    criteria: JSON.stringify({ type: 'leaderboard', position: 1 }),
  },
];

// PupilAchievement: 12 связей (по 2-3 достижения на разных учеников)
export const pupilAchievementsSeedData: PupilAchievementSeedData[] = [
  { id: randomUUID(), pupilId: PUPIL_1_1_UUID, achievementId: ACHIEVEMENT_1_UUID },
  { id: randomUUID(), pupilId: PUPIL_1_1_UUID, achievementId: ACHIEVEMENT_2_UUID },
  { id: randomUUID(), pupilId: PUPIL_1_2_UUID, achievementId: ACHIEVEMENT_3_UUID },
  { id: randomUUID(), pupilId: PUPIL_2_1_UUID, achievementId: ACHIEVEMENT_1_UUID },
  { id: randomUUID(), pupilId: PUPIL_2_1_UUID, achievementId: ACHIEVEMENT_4_UUID },
  { id: randomUUID(), pupilId: PUPIL_2_2_UUID, achievementId: ACHIEVEMENT_2_UUID },
  { id: randomUUID(), pupilId: PUPIL_2_3_UUID, achievementId: ACHIEVEMENT_5_UUID },
  { id: randomUUID(), pupilId: PUPIL_3_1_UUID, achievementId: ACHIEVEMENT_6_UUID },
  { id: randomUUID(), pupilId: PUPIL_3_1_UUID, achievementId: ACHIEVEMENT_1_UUID },
  { id: randomUUID(), pupilId: PUPIL_3_2_UUID, achievementId: ACHIEVEMENT_3_UUID },
  { id: randomUUID(), pupilId: PUPIL_3_3_UUID, achievementId: ACHIEVEMENT_4_UUID },
  { id: randomUUID(), pupilId: PUPIL_3_4_UUID, achievementId: ACHIEVEMENT_2_UUID },
];

// Family: 5 экземпляров
export const familiesSeedData: FamilySeedData[] = [
  {
    id: FAMILY_1_UUID,
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
    id: FAMILY_2_UUID,
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
    id: FAMILY_3_UUID,
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
    id: FAMILY_4_UUID,
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
    id: FAMILY_5_UUID,
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
  { id: randomUUID(), familyId: FAMILY_1_UUID, pupilId: PUPIL_1_1_UUID },
  { id: randomUUID(), familyId: FAMILY_1_UUID, pupilId: PUPIL_1_2_UUID },
  // Семья 2 (Петровы) - 2 ребенка
  { id: randomUUID(), familyId: FAMILY_2_UUID, pupilId: PUPIL_1_3_UUID },
  { id: randomUUID(), familyId: FAMILY_2_UUID, pupilId: PUPIL_1_4_UUID },
  // Семья 3 (Сидоровы) - 1 ребенок
  { id: randomUUID(), familyId: FAMILY_3_UUID, pupilId: PUPIL_1_5_UUID },
  // Семья 4 (Козловы) - 3 ребенка
  { id: randomUUID(), familyId: FAMILY_4_UUID, pupilId: PUPIL_2_1_UUID },
  { id: randomUUID(), familyId: FAMILY_4_UUID, pupilId: PUPIL_2_2_UUID },
  { id: randomUUID(), familyId: FAMILY_4_UUID, pupilId: PUPIL_2_3_UUID },
  // Семья 5 (Морозовы) - 2 ребенка
  { id: randomUUID(), familyId: FAMILY_5_UUID, pupilId: PUPIL_2_4_UUID },
  { id: randomUUID(), familyId: FAMILY_5_UUID, pupilId: PUPIL_2_5_UUID },
  // Остальные ученики распределяем по семьям
  { id: randomUUID(), familyId: FAMILY_1_UUID, pupilId: PUPIL_3_1_UUID },
  { id: randomUUID(), familyId: FAMILY_2_UUID, pupilId: PUPIL_3_2_UUID },
  { id: randomUUID(), familyId: FAMILY_3_UUID, pupilId: PUPIL_3_3_UUID },
  { id: randomUUID(), familyId: FAMILY_4_UUID, pupilId: PUPIL_3_4_UUID },
  { id: randomUUID(), familyId: FAMILY_5_UUID, pupilId: PUPIL_3_5_UUID },
];

// UserFamily: 12 связей (по 2-3 PARENT на каждую Family)
export const userFamiliesSeedData: UserFamilySeedData[] = [
  // Семья 1 (Ивановы) - 2 родителя
  { id: randomUUID(), userId: USER_PARENT_1_UUID, familyId: FAMILY_1_UUID, phone: '+7 (999) 123-45-69' },
  { id: randomUUID(), userId: USER_PARENT_2_UUID, familyId: FAMILY_1_UUID, phone: '+7 (999) 123-45-68' },
  // Семья 2 (Петровы) - 2 родителя
  { id: randomUUID(), userId: USER_PARENT_3_UUID, familyId: FAMILY_2_UUID, phone: '+7 (999) 234-56-80' },
  { id: randomUUID(), userId: USER_PARENT_4_UUID, familyId: FAMILY_2_UUID, phone: '+7 (999) 234-56-79' },
  // Семья 3 (Сидоровы) - 2 родителя
  { id: randomUUID(), userId: USER_PARENT_5_UUID, familyId: FAMILY_3_UUID, phone: '+7 (999) 345-67-91' },
  { id: randomUUID(), userId: USER_PARENT_6_UUID, familyId: FAMILY_3_UUID, phone: '+7 (999) 345-67-90' },
  // Семья 4 (Козловы) - 2 родителя
  { id: randomUUID(), userId: USER_PARENT_7_UUID, familyId: FAMILY_4_UUID, phone: '+7 (999) 456-78-92' },
  { id: randomUUID(), userId: USER_PARENT_8_UUID, familyId: FAMILY_4_UUID, phone: '+7 (999) 456-78-91' },
  // Семья 5 (Морозовы) - 2 родителя (используем первых двух родителей повторно для демонстрации)
  { id: randomUUID(), userId: USER_PARENT_1_UUID, familyId: FAMILY_5_UUID, phone: '+7 (999) 567-89-03' },
  { id: randomUUID(), userId: USER_PARENT_2_UUID, familyId: FAMILY_5_UUID, phone: '+7 (999) 567-89-02' },
  // Дополнительные связи для полноты
  { id: randomUUID(), userId: USER_PARENT_3_UUID, familyId: FAMILY_1_UUID, phone: '+7 (999) 123-45-67' },
  { id: randomUUID(), userId: USER_PARENT_4_UUID, familyId: FAMILY_3_UUID, phone: '+7 (999) 345-67-89' },
];

// GradeEvent: 12 экземпляров (по 4 на каждую Grade)
export const gradeEventsSeedData: GradeEventSeedData[] = [
  // Grade 1 (4 события)
  {
    id: GRADE_EVENT_1_1_UUID,
    gradeId: GRADE_1_UUID,
    eventType: 'LESSON',
    title: 'Обычный урок',
    description: 'Стандартное занятие по расписанию',
    eventDate: '2024-09-08',
  },
  {
    id: GRADE_EVENT_1_2_UUID,
    gradeId: GRADE_1_UUID,
    eventType: 'OUTDOOR_EVENT',
    title: 'Поездка в музей',
    description: 'Экскурсия для детей младшей группы',
    eventDate: '2024-09-22',
  },
  {
    id: GRADE_EVENT_1_3_UUID,
    gradeId: GRADE_1_UUID,
    eventType: 'LESSON',
    title: 'Обычный урок',
    description: 'Стандартное занятие по расписанию',
    eventDate: '2024-10-06',
  },
  {
    id: GRADE_EVENT_1_4_UUID,
    gradeId: GRADE_1_UUID,
    eventType: 'LESSON_SKIPPING',
    title: 'Отмена урока',
    description: 'Праздничный день',
    eventDate: '2024-10-13',
  },
  // Grade 2 (4 события)
  {
    id: GRADE_EVENT_2_1_UUID,
    gradeId: GRADE_2_UUID,
    eventType: 'LESSON',
    title: 'Обычный урок',
    description: 'Стандартное занятие по расписанию',
    eventDate: '2024-09-08',
  },
  {
    id: GRADE_EVENT_2_2_UUID,
    gradeId: GRADE_2_UUID,
    eventType: 'OUTDOOR_EVENT',
    title: 'Выездное мероприятие',
    description: 'Поездка на природу',
    eventDate: '2024-09-29',
  },
  {
    id: GRADE_EVENT_2_3_UUID,
    gradeId: GRADE_2_UUID,
    eventType: 'LESSON',
    title: 'Обычный урок',
    description: 'Стандартное занятие по расписанию',
    eventDate: '2024-10-06',
  },
  {
    id: GRADE_EVENT_2_4_UUID,
    gradeId: GRADE_2_UUID,
    eventType: 'LESSON',
    title: 'Обычный урок',
    description: 'Стандартное занятие по расписанию',
    eventDate: '2024-10-13',
  },
  // Grade 3 (4 события)
  {
    id: GRADE_EVENT_3_1_UUID,
    gradeId: GRADE_3_UUID,
    eventType: 'LESSON',
    title: 'Обычный урок',
    description: 'Стандартное занятие по расписанию',
    eventDate: '2024-09-08',
  },
  {
    id: GRADE_EVENT_3_2_UUID,
    gradeId: GRADE_3_UUID,
    eventType: 'OUTDOOR_EVENT',
    title: 'Молодежная встреча',
    description: 'Выездное мероприятие для старшей группы',
    eventDate: '2024-09-15',
  },
  {
    id: GRADE_EVENT_3_3_UUID,
    gradeId: GRADE_3_UUID,
    eventType: 'LESSON',
    title: 'Обычный урок',
    description: 'Стандартное занятие по расписанию',
    eventDate: '2024-10-06',
  },
  {
    id: GRADE_EVENT_3_4_UUID,
    gradeId: GRADE_3_UUID,
    eventType: 'LESSON',
    title: 'Обычный урок',
    description: 'Стандартное занятие по расписанию',
    eventDate: '2024-10-13',
  },
];

// GradeSettings: 3 экземпляра (по 1 на каждую Grade)
export const gradeSettingsSeedData: GradeSettingsSeedData[] = [
  {
    id: GRADE_SETTINGS_1_UUID,
    gradeId: GRADE_1_UUID,
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
    id: GRADE_SETTINGS_2_UUID,
    gradeId: GRADE_2_UUID,
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
    id: GRADE_SETTINGS_3_UUID,
    gradeId: GRADE_3_UUID,
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

// BricksIssue: 50-60 записей (по 2-3 выдачи на каждого ученика)
// ВАЖНО: Данные должны быть взаимосвязаны с HomeworkCheck
// Логика: 1 балл из HomeworkCheck = 1 кирпичик
// Сумма всех quantity из BricksIssue для ученика ≤ сумма всех points из HomeworkCheck для ученика за учебный год
// Данные будут созданы программно в seed-db-cli.ts после создания всех HomeworkCheck
// Функция-генератор для создания данных BricksIssue на основе HomeworkCheck
export function generateBricksIssuesSeedData(
  homeworkChecks: Array<{ pupilId: string; gradeId: string; academicYearId: string; points: number }>,
  pupils: Array<{ id: string; gradeId: string }>,
  academicYears: Array<{ id: string; gradeId: string; startDate: string; endDate: string }>,
  teachers: Array<{ id: string; role: UserRole }>
): BricksIssueSeedData[] {
  const bricksIssues: BricksIssueSeedData[] = [];
  
  // Рассчитываем сумму баллов для каждого ученика за учебный год
  const pupilPointsMap = new Map<string, number>();
  const pupilGradeMap = new Map<string, string>();
  const pupilAcademicYearMap = new Map<string, string>();
  
  for (const check of homeworkChecks) {
    const key = `${check.pupilId}-${check.academicYearId}`;
    const current = pupilPointsMap.get(key) || 0;
    pupilPointsMap.set(key, current + check.points);
    pupilGradeMap.set(key, check.gradeId);
    pupilAcademicYearMap.set(key, check.academicYearId);
  }
  
  // Получаем список учителей (TEACHER)
  const teacherIds = teachers.filter((t) => t.role === 'TEACHER').map((t) => t.id);
  
  // Генерируем данные BricksIssue для каждого ученика
  for (const [key, totalPoints] of Array.from(pupilPointsMap.entries())) {
    // Key format: `${pupilId}-${academicYearId}`
    // Both are UUIDs (36 chars), so we need to split correctly
    // UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (36 chars)
    // We'll use the last 36 chars for academicYearId, rest for pupilId
    const academicYearId = pupilAcademicYearMap.get(key) || '';
    const pupilId = key.substring(0, key.length - academicYearId.length - 1); // -1 for the separator '-'
    const gradeId = pupilGradeMap.get(key) || '';
    
    // Количество выдач: 2-3 на ученика
    const numIssues = Math.floor(Math.random() * 2) + 2; // 2 или 3
    
    // Распределяем выдачи так, чтобы сумма была 80-90% от totalPoints (оставляем остаток)
    const targetTotal = Math.floor(totalPoints * (0.8 + Math.random() * 0.1)); // 80-90%
    
    // Распределяем quantity между выдачами
    const quantities: number[] = [];
    let remaining = targetTotal;
    
    for (let i = 0; i < numIssues - 1; i++) {
      const maxForThis = Math.min(remaining - (numIssues - i - 1), 5); // Максимум 5, минимум 1
      const qty = Math.max(1, Math.floor(Math.random() * maxForThis) + 1);
      quantities.push(qty);
      remaining -= qty;
    }
    quantities.push(Math.max(1, remaining)); // Последняя выдача получает остаток
    
    // Создаем даты выдачи в пределах учебного года
    const academicYear = academicYears.find((ay) => ay.id === academicYearId);
    if (!academicYear) continue;
    
    const startDate = new Date(academicYear.startDate);
    const endDate = new Date(academicYear.endDate);
    const dateRange = endDate.getTime() - startDate.getTime();
    
    // Создаем записи BricksIssue
    for (let i = 0; i < numIssues; i++) {
      const quantity = quantities[i] || 1;
      const randomDate = new Date(startDate.getTime() + Math.random() * dateRange);
      const issuedBy = teacherIds[Math.floor(Math.random() * teacherIds.length)] || teacherIds[0] || '';
      
      bricksIssues.push({
        id: randomUUID(),
        pupilId,
        academicYearId,
        gradeId,
        quantity,
        issuedAt: randomDate.toISOString(),
        issuedBy,
      });
    }
  }
  
  return bricksIssues;
}

