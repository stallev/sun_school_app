/**
 * GraphQL Queries Utilities
 * Provides type-safe functions for querying data from AWS AppSync GraphQL API
 * 
 * Uses amplifyData for executing queries and handles related data via indexes
 */

import { amplifyData } from './amplify';
import type * as APITypes from '../../API';

// ============================================
// Basic Queries
// ============================================

/**
 * Get a user by ID
 */
export async function getUser(id: string): Promise<APITypes.User | null> {
  return (await amplifyData.get('User', id)) as APITypes.User | null;
}

/**
 * List all users with optional filter
 */
export async function listUsers(
  filter?: APITypes.ModelUserFilterInput,
  limit?: number,
  nextToken?: string
): Promise<APITypes.ModelUserConnection | null> {
  return (await amplifyData.list('User', filter, limit, nextToken)) as APITypes.ModelUserConnection | null;
}

/**
 * Get a grade by ID
 */
export async function getGrade(id: string): Promise<APITypes.Grade | null> {
  return (await amplifyData.get('Grade', id)) as APITypes.Grade | null;
}

/**
 * List all grades with optional filter
 */
export async function listGrades(
  filter?: APITypes.ModelGradeFilterInput,
  limit?: number,
  nextToken?: string
): Promise<APITypes.ModelGradeConnection | null> {
  return (await amplifyData.list('Grade', filter, limit, nextToken)) as APITypes.ModelGradeConnection | null;
}

/**
 * Get an academic year by ID
 */
export async function getAcademicYear(id: string): Promise<APITypes.AcademicYear | null> {
  return (await amplifyData.get('AcademicYear', id)) as APITypes.AcademicYear | null;
}

/**
 * List academic years with optional filter
 */
export async function listAcademicYears(
  filter?: APITypes.ModelAcademicYearFilterInput,
  limit?: number,
  nextToken?: string
): Promise<APITypes.ModelAcademicYearConnection | null> {
  return (await amplifyData.list('AcademicYear', filter, limit, nextToken)) as APITypes.ModelAcademicYearConnection | null;
}

/**
 * Get a lesson by ID
 */
export async function getLesson(id: string): Promise<APITypes.Lesson | null> {
  return (await amplifyData.get('Lesson', id)) as APITypes.Lesson | null;
}

/**
 * List lessons with optional filter
 */
export async function listLessons(
  filter?: APITypes.ModelLessonFilterInput,
  limit?: number,
  nextToken?: string
): Promise<APITypes.ModelLessonConnection | null> {
  return (await amplifyData.list('Lesson', filter, limit, nextToken)) as APITypes.ModelLessonConnection | null;
}

/**
 * Get a book by ID
 */
export async function getBook(id: string): Promise<APITypes.Book | null> {
  return (await amplifyData.get('Book', id)) as APITypes.Book | null;
}

/**
 * List books with optional filter
 */
export async function listBooks(
  filter?: APITypes.ModelBookFilterInput,
  limit?: number,
  nextToken?: string
): Promise<APITypes.ModelBookConnection | null> {
  return (await amplifyData.list('Book', filter, limit, nextToken)) as APITypes.ModelBookConnection | null;
}

/**
 * Get a golden verse by ID
 */
export async function getGoldenVerse(id: string): Promise<APITypes.GoldenVerse | null> {
  return (await amplifyData.get('GoldenVerse', id)) as APITypes.GoldenVerse | null;
}

/**
 * List golden verses with optional filter
 */
export async function listGoldenVerses(
  filter?: APITypes.ModelGoldenVerseFilterInput,
  limit?: number,
  nextToken?: string
): Promise<APITypes.ModelGoldenVerseConnection | null> {
  return (await amplifyData.list('GoldenVerse', filter, limit, nextToken)) as APITypes.ModelGoldenVerseConnection | null;
}

/**
 * Get a pupil by ID
 */
export async function getPupil(id: string): Promise<APITypes.Pupil | null> {
  return (await amplifyData.get('Pupil', id)) as APITypes.Pupil | null;
}

/**
 * List pupils with optional filter
 */
export async function listPupils(
  filter?: APITypes.ModelPupilFilterInput,
  limit?: number,
  nextToken?: string
): Promise<APITypes.ModelPupilConnection | null> {
  return (await amplifyData.list('Pupil', filter, limit, nextToken)) as APITypes.ModelPupilConnection | null;
}

/**
 * Get a homework check by ID
 */
export async function getHomeworkCheck(id: string): Promise<APITypes.HomeworkCheck | null> {
  return (await amplifyData.get('HomeworkCheck', id)) as APITypes.HomeworkCheck | null;
}

/**
 * List homework checks with optional filter
 */
export async function listHomeworkChecks(
  filter?: APITypes.ModelHomeworkCheckFilterInput,
  limit?: number,
  nextToken?: string
): Promise<APITypes.ModelHomeworkCheckConnection | null> {
  return (await amplifyData.list('HomeworkCheck', filter, limit, nextToken)) as APITypes.ModelHomeworkCheckConnection | null;
}

/**
 * Get an achievement by ID
 */
export async function getAchievement(id: string): Promise<APITypes.Achievement | null> {
  return (await amplifyData.get('Achievement', id)) as APITypes.Achievement | null;
}

/**
 * List achievements with optional filter
 */
export async function listAchievements(
  filter?: APITypes.ModelAchievementFilterInput,
  limit?: number,
  nextToken?: string
): Promise<APITypes.ModelAchievementConnection | null> {
  return (await amplifyData.list('Achievement', filter, limit, nextToken)) as APITypes.ModelAchievementConnection | null;
}

/**
 * Get a family by ID
 */
export async function getFamily(id: string): Promise<APITypes.Family | null> {
  return (await amplifyData.get('Family', id)) as APITypes.Family | null;
}

/**
 * List families with optional filter
 */
export async function listFamilies(
  filter?: APITypes.ModelFamilyFilterInput,
  limit?: number,
  nextToken?: string
): Promise<APITypes.ModelFamilyConnection | null> {
  return (await amplifyData.list('Family', filter, limit, nextToken)) as APITypes.ModelFamilyConnection | null;
}

/**
 * Get a grade event by ID
 */
export async function getGradeEvent(id: string): Promise<APITypes.GradeEvent | null> {
  return (await amplifyData.get('GradeEvent', id)) as APITypes.GradeEvent | null;
}

/**
 * List grade events with optional filter
 */
export async function listGradeEvents(
  filter?: APITypes.ModelGradeEventFilterInput,
  limit?: number,
  nextToken?: string
): Promise<APITypes.ModelGradeEventConnection | null> {
  return (await amplifyData.list('GradeEvent', filter, limit, nextToken)) as APITypes.ModelGradeEventConnection | null;
}

/**
 * Get grade settings by ID
 */
export async function getGradeSettings(id: string): Promise<APITypes.GradeSettings | null> {
  return (await amplifyData.get('GradeSettings', id)) as APITypes.GradeSettings | null;
}

/**
 * List grade settings with optional filter
 */
export async function listGradeSettings(
  filter?: APITypes.ModelGradeSettingsFilterInput,
  limit?: number,
  nextToken?: string
): Promise<APITypes.ModelGradeSettingsConnection | null> {
  return (await amplifyData.list('GradeSettings', filter, limit, nextToken)) as APITypes.ModelGradeSettingsConnection | null;
}

// ============================================
// Index-based Queries (for related data)
// ============================================

/**
 * Get lessons by academic year ID
 * Uses index: lessonsByAcademicYearIdAndLessonDate
 */
export async function getLessonsByAcademicYear(
  academicYearId: string,
  limit?: number,
  nextToken?: string
): Promise<APITypes.ModelLessonConnection | null> {
  const queries = await import('../../graphql/queries');
  const { executeGraphQL } = await import('./amplify');
  
  // Use executeGraphQL directly for index queries
  const query = (queries as Record<string, string>).lessonsByAcademicYearIdAndLessonDate;
  if (!query) {
    throw new Error('Query lessonsByAcademicYearIdAndLessonDate not found');
  }
  
  const result = await executeGraphQL<{
    lessonsByAcademicYearIdAndLessonDate?: APITypes.ModelLessonConnection;
  }>(query, {
    academicYearId,
    limit,
    nextToken,
  });

  return result.data?.lessonsByAcademicYearIdAndLessonDate || null;
}

/**
 * Get lessons by grade ID
 * Uses index: lessonsByGradeIdAndLessonDate
 */
export async function getLessonsByGrade(
  gradeId: string,
  limit?: number,
  nextToken?: string
): Promise<APITypes.ModelLessonConnection | null> {
  const queries = await import('../../graphql/queries');
  const { executeGraphQL } = await import('./amplify');
  
  const query = (queries as Record<string, string>).lessonsByGradeIdAndLessonDate;
  if (!query) {
    throw new Error('Query lessonsByGradeIdAndLessonDate not found');
  }
  
  const result = await executeGraphQL<{
    lessonsByGradeIdAndLessonDate?: APITypes.ModelLessonConnection;
  }>(query, {
    gradeId,
    limit,
    nextToken,
  });

  return result.data?.lessonsByGradeIdAndLessonDate || null;
}

/**
 * Get homework checks by lesson ID
 * Uses index: homeworkChecksByLessonIdAndPupilId
 */
export async function getHomeworkChecksByLesson(
  lessonId: string,
  limit?: number,
  nextToken?: string
): Promise<APITypes.ModelHomeworkCheckConnection | null> {
  const queries = await import('../../graphql/queries');
  const { executeGraphQL } = await import('./amplify');
  
  const query = (queries as Record<string, string>).homeworkChecksByLessonIdAndPupilId;
  if (!query) {
    throw new Error('Query homeworkChecksByLessonIdAndPupilId not found');
  }
  
  const result = await executeGraphQL<{
    homeworkChecksByLessonIdAndPupilId?: APITypes.ModelHomeworkCheckConnection;
  }>(query, {
    lessonId,
    limit,
    nextToken,
  });

  return result.data?.homeworkChecksByLessonIdAndPupilId || null;
}

/**
 * Get homework checks by pupil ID
 * Uses index: homeworkChecksByPupilIdAndCreatedAt
 */
export async function getHomeworkChecksByPupil(
  pupilId: string,
  limit?: number,
  nextToken?: string
): Promise<APITypes.ModelHomeworkCheckConnection | null> {
  const queries = await import('../../graphql/queries');
  const { executeGraphQL } = await import('./amplify');
  
  const query = (queries as Record<string, string>).homeworkChecksByPupilIdAndCreatedAt;
  if (!query) {
    throw new Error('Query homeworkChecksByPupilIdAndCreatedAt not found');
  }
  
  const result = await executeGraphQL<{
    homeworkChecksByPupilIdAndCreatedAt?: APITypes.ModelHomeworkCheckConnection;
  }>(query, {
    pupilId,
    limit,
    nextToken,
  });

  return result.data?.homeworkChecksByPupilIdAndCreatedAt || null;
}

/**
 * Get pupils by grade ID
 * Uses index: pupilsByGradeIdAndLastName
 */
export async function getPupilsByGrade(
  gradeId: string,
  limit?: number,
  nextToken?: string
): Promise<APITypes.ModelPupilConnection | null> {
  const queries = await import('../../graphql/queries');
  const { executeGraphQL } = await import('./amplify');
  
  const query = (queries as Record<string, string>).pupilsByGradeIdAndLastName;
  if (!query) {
    throw new Error('Query pupilsByGradeIdAndLastName not found');
  }
  
  const result = await executeGraphQL<{
    pupilsByGradeIdAndLastName?: APITypes.ModelPupilConnection;
  }>(query, {
    gradeId,
    limit,
    nextToken,
  });

  return result.data?.pupilsByGradeIdAndLastName || null;
}

/**
 * Get lesson golden verses by lesson ID
 * Uses index: lessonGoldenVersesByLessonIdAndOrder
 */
export async function getLessonGoldenVersesByLesson(
  lessonId: string,
  limit?: number,
  nextToken?: string
): Promise<APITypes.ModelLessonGoldenVerseConnection | null> {
  const queries = await import('../../graphql/queries');
  const { executeGraphQL } = await import('./amplify');
  
  const query = (queries as Record<string, string>).lessonGoldenVersesByLessonIdAndOrder;
  if (!query) {
    throw new Error('Query lessonGoldenVersesByLessonIdAndOrder not found');
  }
  
  const result = await executeGraphQL<{
    lessonGoldenVersesByLessonIdAndOrder?: APITypes.ModelLessonGoldenVerseConnection;
  }>(query, {
    lessonId,
    limit,
    nextToken,
  });

  return result.data?.lessonGoldenVersesByLessonIdAndOrder || null;
}

/**
 * Get pupil achievements by pupil ID
 * Uses index: pupilAchievementsByPupilIdAndAwardedAt
 */
export async function getPupilAchievementsByPupil(
  pupilId: string,
  limit?: number,
  nextToken?: string
): Promise<APITypes.ModelPupilAchievementConnection | null> {
  const queries = await import('../../graphql/queries');
  const { executeGraphQL } = await import('./amplify');
  
  const query = (queries as Record<string, string>).pupilAchievementsByPupilIdAndAwardedAt;
  if (!query) {
    throw new Error('Query pupilAchievementsByPupilIdAndAwardedAt not found');
  }
  
  const result = await executeGraphQL<{
    pupilAchievementsByPupilIdAndAwardedAt?: APITypes.ModelPupilAchievementConnection;
  }>(query, {
    pupilId,
    limit,
    nextToken,
  });

  return result.data?.pupilAchievementsByPupilIdAndAwardedAt || null;
}

/**
 * Get academic years by grade ID
 * Uses index: academicYearsByGradeIdAndStartDate
 */
export async function getAcademicYearsByGrade(
  gradeId: string,
  limit?: number,
  nextToken?: string
): Promise<APITypes.ModelAcademicYearConnection | null> {
  const queries = await import('../../graphql/queries');
  const { executeGraphQL } = await import('./amplify');
  
  const query = (queries as Record<string, string>).academicYearsByGradeIdAndStartDate;
  if (!query) {
    throw new Error('Query academicYearsByGradeIdAndStartDate not found');
  }
  
  const result = await executeGraphQL<{
    academicYearsByGradeIdAndStartDate?: APITypes.ModelAcademicYearConnection;
  }>(query, {
    gradeId,
    limit,
    nextToken,
  });

  return result.data?.academicYearsByGradeIdAndStartDate || null;
}

/**
 * Get grade events by grade ID
 * Uses index: gradeEventsByGradeIdAndEventDate
 */
export async function getGradeEventsByGrade(
  gradeId: string,
  limit?: number,
  nextToken?: string
): Promise<APITypes.ModelGradeEventConnection | null> {
  const queries = await import('../../graphql/queries');
  const { executeGraphQL } = await import('./amplify');
  
  const query = (queries as Record<string, string>).gradeEventsByGradeIdAndEventDate;
  if (!query) {
    throw new Error('Query gradeEventsByGradeIdAndEventDate not found');
  }
  
  const result = await executeGraphQL<{
    gradeEventsByGradeIdAndEventDate?: APITypes.ModelGradeEventConnection;
  }>(query, {
    gradeId,
    limit,
    nextToken,
  });

  return result.data?.gradeEventsByGradeIdAndEventDate || null;
}

/**
 * Get grade settings by grade ID
 * Uses index: gradeSettingsByGradeId
 */
export async function getGradeSettingsByGrade(
  gradeId: string
): Promise<APITypes.GradeSettings | null> {
  const queries = await import('../../graphql/queries');
  const { executeGraphQL } = await import('./amplify');
  
  const query = (queries as Record<string, string>).gradeSettingsByGradeId;
  if (!query) {
    throw new Error('Query gradeSettingsByGradeId not found');
  }
  
  const result = await executeGraphQL<{
    gradeSettingsByGradeId?: { items?: APITypes.GradeSettings[] };
  }>(query, {
    gradeId,
  });

  return result.data?.gradeSettingsByGradeId?.items?.[0] || null;
}

// ============================================
// Batch Queries (for related data)
// ============================================

/**
 * Get lesson with all related data (golden verses, homework checks)
 * Uses batch queries via Promise.all() for parallel execution
 */
export async function getLessonWithRelations(lessonId: string): Promise<{
  lesson: APITypes.Lesson | null;
  goldenVerses: APITypes.LessonGoldenVerse[];
  homeworkChecks: APITypes.HomeworkCheck[];
  academicYear: APITypes.AcademicYear | null;
  grade: APITypes.Grade | null;
  teacher: APITypes.User | null;
}> {
  // Execute all queries in parallel
  const [lesson, lessonGoldenVersesResult, homeworkChecksResult] = await Promise.all([
    getLesson(lessonId),
    getLessonGoldenVersesByLesson(lessonId),
    getHomeworkChecksByLesson(lessonId),
  ]);

  // Get related data if lesson exists
  const [academicYear, grade, teacher] = lesson
    ? await Promise.all([
        lesson.academicYearId ? getAcademicYear(lesson.academicYearId) : Promise.resolve(null),
        lesson.gradeId ? getGrade(lesson.gradeId) : Promise.resolve(null),
        lesson.teacherId ? getUser(lesson.teacherId) : Promise.resolve(null),
      ])
    : [Promise.resolve(null), Promise.resolve(null), Promise.resolve(null)];

  return {
    lesson,
    goldenVerses: lessonGoldenVersesResult?.items as APITypes.LessonGoldenVerse[] || [],
    homeworkChecks: homeworkChecksResult?.items as APITypes.HomeworkCheck[] || [],
    academicYear: await academicYear,
    grade: await grade,
    teacher: await teacher,
  };
}

/**
 * Get pupil with all related data (homework checks, achievements, families)
 * Uses batch queries via Promise.all() for parallel execution
 */
export async function getPupilComplete(pupilId: string): Promise<{
  pupil: APITypes.Pupil | null;
  homeworkChecks: APITypes.HomeworkCheck[];
  achievements: APITypes.PupilAchievement[];
  families: APITypes.FamilyMember[];
  grade: APITypes.Grade | null;
}> {
  // Execute all queries in parallel
  const [pupil, homeworkChecksResult, pupilAchievementsResult] = await Promise.all([
    getPupil(pupilId),
    getHomeworkChecksByPupil(pupilId),
    getPupilAchievementsByPupil(pupilId),
  ]);

  // Get families if pupil exists
  const familiesResult = pupil
    ? await (async () => {
        const queries = await import('../../graphql/queries');
        const { executeGraphQL } = await import('./amplify');
        
        const query = (queries as Record<string, string>).familyMembersByPupilId;
        if (!query) {
          throw new Error('Query familyMembersByPupilId not found');
        }
        
        const result = await executeGraphQL<{
          familyMembersByPupilId?: { items?: APITypes.FamilyMember[] };
        }>(query, { pupilId });
        return result.data?.familyMembersByPupilId?.items || [];
      })()
    : Promise.resolve([]);

  // Get grade if pupil exists
  const grade = pupil?.gradeId ? await getGrade(pupil.gradeId) : null;

  return {
    pupil,
    homeworkChecks: homeworkChecksResult?.items as APITypes.HomeworkCheck[] || [],
    achievements: pupilAchievementsResult?.items as APITypes.PupilAchievement[] || [],
    families: await familiesResult as APITypes.FamilyMember[],
    grade,
  };
}

/**
 * Get grade with all related data (pupils, academic years, events, settings)
 * Uses batch queries via Promise.all() for parallel execution
 */
export async function getGradeWithRelations(gradeId: string): Promise<{
  grade: APITypes.Grade | null;
  pupils: APITypes.Pupil[];
  academicYears: APITypes.AcademicYear[];
  events: APITypes.GradeEvent[];
  settings: APITypes.GradeSettings | null;
  teachers: APITypes.User[];
}> {
  // Execute all queries in parallel, but handle errors gracefully
  // Some queries may fail due to rate limits or auth issues, but we should still return what we can
  const [grade, pupilsResult, academicYearsResult, eventsResult, settings] = await Promise.allSettled([
    getGrade(gradeId),
    getPupilsByGrade(gradeId).catch(() => null),
    getAcademicYearsByGrade(gradeId).catch(() => null),
    getGradeEventsByGrade(gradeId).catch(() => null),
    getGradeSettingsByGrade(gradeId).catch(() => null),
  ]);

  // Extract values from settled promises
  const gradeValue = grade.status === 'fulfilled' ? grade.value : null;
  const pupilsResultValue = pupilsResult.status === 'fulfilled' ? pupilsResult.value : null;
  const academicYearsResultValue = academicYearsResult.status === 'fulfilled' ? academicYearsResult.value : null;
  const eventsResultValue = eventsResult.status === 'fulfilled' ? eventsResult.value : null;
  const settingsValue = settings.status === 'fulfilled' ? settings.value : null;

  // Get teachers via UserGrade junction table
  // Handle errors gracefully - if this fails, return empty array
  const teachers = await (async () => {
    try {
      const queries = await import('../../graphql/queries');
      const { executeGraphQL } = await import('./amplify');
      
      const query = (queries as Record<string, string>).userGradesByGradeIdAndUserId;
      if (!query) {
        throw new Error('Query userGradesByGradeIdAndUserId not found');
      }
      
      const result = await executeGraphQL<{
        userGradesByGradeIdAndUserId?: { items?: Array<{ userId: string }> };
      }>(query, { gradeId });
      
      const userGrades = result.data?.userGradesByGradeIdAndUserId?.items || [];
      const userIds = userGrades.map((ug) => ug.userId).filter(Boolean);
      
      if (userIds.length === 0) return [];
      
      const users = await Promise.allSettled(
        userIds.map((id: string) => getUser(id))
      );
      return users
        .filter((u): u is PromiseFulfilledResult<APITypes.User> => 
          u.status === 'fulfilled' && u.value !== null
        )
        .map((u) => u.value);
    } catch (error) {
      console.error('Error fetching teachers for grade:', error);
      return [];
    }
  })();

  return {
    grade: gradeValue,
    pupils: pupilsResultValue?.items as APITypes.Pupil[] || [],
    academicYears: academicYearsResultValue?.items as APITypes.AcademicYear[] || [],
    events: eventsResultValue?.items as APITypes.GradeEvent[] || [],
    settings: settingsValue,
    teachers,
  };
}

