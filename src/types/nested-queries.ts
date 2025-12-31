/**
 * TypeScript types for nested GraphQL queries
 * These types extend APITypes to include nested relationships via @belongsTo and @hasMany
 * 
 * Used for optimized single-query data fetching instead of multiple separate queries
 */

import type * as APITypes from '../API';

// ============================================
// Grade with nested data
// ============================================

/**
 * Grade with all nested relationships
 * Used in getGradeWithFullDataAction with single nested query
 */
export type GradeNestedData = Omit<APITypes.Grade, 'pupils' | 'academicYears' | 'events' | 'settings' | 'teachers'> & {
  pupils?: {
    items: Array<APITypes.Pupil | null>;
    nextToken?: string | null;
  } | null;
  academicYears?: {
    items: Array<AcademicYearNestedData | null>;
    nextToken?: string | null;
  } | null;
  events?: APITypes.ModelGradeEventConnection | null;
  settings?: APITypes.GradeSettings | null;
  teachers?: {
    items: Array<UserGradeNestedData | null>;
    nextToken?: string | null;
  } | null;
};

/**
 * Academic Year with nested lessons
 */
export type AcademicYearNestedData = Omit<APITypes.AcademicYear, 'lessons'> & {
  lessons?: {
    items: Array<LessonNestedData | null>;
    nextToken?: string | null;
  } | null;
};

/**
 * UserGrade with nested user data
 */
export type UserGradeNestedData = Omit<APITypes.UserGrade, 'user'> & {
  user?: APITypes.User | null;
};

// ============================================
// Lesson with nested data
// ============================================

/**
 * Lesson with all nested relationships
 * Used in getLessonWithRelationsAction with single nested query
 */
export type LessonNestedData = Omit<APITypes.Lesson, 'homeworkChecks' | 'goldenVerses' | 'files'> & {
  homeworkChecks?: {
    items: Array<HomeworkCheckNestedData | null>;
    nextToken?: string | null;
  } | null;
  goldenVerses?: {
    items: Array<LessonGoldenVerseNestedData | null>;
    nextToken?: string | null;
  } | null;
  files?: {
    items: Array<APITypes.LessonFile | null>;
    nextToken?: string | null;
  } | null;
};

/**
 * HomeworkCheck with nested pupil data (via @belongsTo)
 */
export type HomeworkCheckNestedData = Omit<APITypes.HomeworkCheck, 'pupil' | 'lesson'> & {
  pupil?: APITypes.Pupil | null;
  lesson?: APITypes.Lesson | null;
};

/**
 * LessonGoldenVerse with nested goldenVerse and book data
 */
export type LessonGoldenVerseNestedData = Omit<APITypes.LessonGoldenVerse, 'goldenVerse'> & {
  goldenVerse?: GoldenVerseNestedData | null;
};

/**
 * GoldenVerse with nested book data (via @belongsTo)
 */
export type GoldenVerseNestedData = Omit<APITypes.GoldenVerse, 'book'> & {
  book?: APITypes.Book | null;
};

// ============================================
// Pupil with nested data
// ============================================

/**
 * Pupil with all nested relationships
 * Used in getPupilWithNestedData with single nested query
 */
export type PupilNestedData = Omit<APITypes.Pupil, 'homeworkChecks' | 'achievements' | 'families'> & {
  homeworkChecks?: {
    items: Array<HomeworkCheckNestedData | null>;
    nextToken?: string | null;
  } | null;
  achievements?: {
    items: Array<PupilAchievementNestedData | null>;
    nextToken?: string | null;
  } | null;
  families?: {
    items: Array<FamilyMemberNestedData | null>;
    nextToken?: string | null;
  } | null;
};

/**
 * PupilAchievement with nested achievement data (via @belongsTo)
 */
export type PupilAchievementNestedData = Omit<APITypes.PupilAchievement, 'achievement'> & {
  achievement?: APITypes.Achievement | null;
};

/**
 * FamilyMember with nested family data (via @belongsTo)
 */
export type FamilyMemberNestedData = Omit<APITypes.FamilyMember, 'family'> & {
  family?: APITypes.Family | null;
};

