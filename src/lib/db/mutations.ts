/**
 * GraphQL Mutations Utilities
 * Provides type-safe functions for creating, updating, and deleting data via AWS AppSync GraphQL API
 * 
 * Uses amplifyData for executing mutations
 */

import { amplifyData } from './amplify';
import type * as APITypes from '../../API';

// ============================================
// User Mutations
// ============================================

/**
 * Create a new user
 */
export async function createUser(
  input: APITypes.CreateUserInput,
  condition?: APITypes.ModelUserConditionInput
): Promise<APITypes.User> {
  const result = await amplifyData.create('User', {
    input,
    condition,
  });
  return result as APITypes.User;
}

/**
 * Update an existing user
 */
export async function updateUser(
  input: APITypes.UpdateUserInput,
  condition?: APITypes.ModelUserConditionInput
): Promise<APITypes.User> {
  const result = await amplifyData.update('User', {
    input,
    condition,
  });
  return result as APITypes.User;
}

/**
 * Delete a user
 */
export async function deleteUser(
  id: string,
  _condition?: APITypes.ModelUserConditionInput
): Promise<APITypes.User> {
  const result = await amplifyData.delete('User', id);
  return result as APITypes.User;
}

// ============================================
// Grade Mutations
// ============================================

/**
 * Create a new grade
 */
export async function createGrade(
  input: APITypes.CreateGradeInput,
  condition?: APITypes.ModelGradeConditionInput
): Promise<APITypes.Grade> {
  const result = await amplifyData.create('Grade', {
    input,
    condition,
  });
  return result as APITypes.Grade;
}

/**
 * Update an existing grade
 */
export async function updateGrade(
  input: APITypes.UpdateGradeInput,
  condition?: APITypes.ModelGradeConditionInput
): Promise<APITypes.Grade> {
  const result = await amplifyData.update('Grade', {
    input,
    condition,
  });
  return result as APITypes.Grade;
}

/**
 * Delete a grade
 */
export async function deleteGrade(
  id: string,
  _condition?: APITypes.ModelGradeConditionInput
): Promise<APITypes.Grade> {
  const result = await amplifyData.delete('Grade', id);
  return result as APITypes.Grade;
}

// ============================================
// AcademicYear Mutations
// ============================================

/**
 * Create a new academic year
 */
export async function createAcademicYear(
  input: APITypes.CreateAcademicYearInput,
  condition?: APITypes.ModelAcademicYearConditionInput
): Promise<APITypes.AcademicYear> {
  const result = await amplifyData.create('AcademicYear', {
    input,
    condition,
  });
  return result as APITypes.AcademicYear;
}

/**
 * Update an existing academic year
 */
export async function updateAcademicYear(
  input: APITypes.UpdateAcademicYearInput,
  condition?: APITypes.ModelAcademicYearConditionInput
): Promise<APITypes.AcademicYear> {
  const result = await amplifyData.update('AcademicYear', {
    input,
    condition,
  });
  return result as APITypes.AcademicYear;
}

/**
 * Delete an academic year
 */
export async function deleteAcademicYear(
  id: string,
  _condition?: APITypes.ModelAcademicYearConditionInput
): Promise<APITypes.AcademicYear> {
  const result = await amplifyData.delete('AcademicYear', id);
  return result as APITypes.AcademicYear;
}

// ============================================
// Lesson Mutations
// ============================================

/**
 * Create a new lesson
 */
export async function createLesson(
  input: APITypes.CreateLessonInput,
  condition?: APITypes.ModelLessonConditionInput
): Promise<APITypes.Lesson> {
  const result = await amplifyData.create('Lesson', {
    input,
    condition,
  });
  return result as APITypes.Lesson;
}

/**
 * Update an existing lesson
 */
export async function updateLesson(
  input: APITypes.UpdateLessonInput,
  condition?: APITypes.ModelLessonConditionInput
): Promise<APITypes.Lesson> {
  const result = await amplifyData.update('Lesson', {
    input,
    condition,
  });
  return result as APITypes.Lesson;
}

/**
 * Delete a lesson
 */
export async function deleteLesson(
  id: string,
  _condition?: APITypes.ModelLessonConditionInput
): Promise<APITypes.Lesson> {
  const result = await amplifyData.delete('Lesson', id);
  return result as APITypes.Lesson;
}

// ============================================
// Book Mutations
// ============================================

/**
 * Create a new book
 */
export async function createBook(
  input: APITypes.CreateBookInput,
  condition?: APITypes.ModelBookConditionInput
): Promise<APITypes.Book> {
  const result = await amplifyData.create('Book', {
    input,
    condition,
  });
  return result as APITypes.Book;
}

/**
 * Update an existing book
 */
export async function updateBook(
  input: APITypes.UpdateBookInput,
  condition?: APITypes.ModelBookConditionInput
): Promise<APITypes.Book> {
  const result = await amplifyData.update('Book', {
    input,
    condition,
  });
  return result as APITypes.Book;
}

/**
 * Delete a book
 */
export async function deleteBook(
  id: string,
  _condition?: APITypes.ModelBookConditionInput
): Promise<APITypes.Book> {
  const result = await amplifyData.delete('Book', id);
  return result as APITypes.Book;
}

// ============================================
// GoldenVerse Mutations
// ============================================

/**
 * Create a new golden verse
 */
export async function createGoldenVerse(
  input: APITypes.CreateGoldenVerseInput,
  condition?: APITypes.ModelGoldenVerseConditionInput
): Promise<APITypes.GoldenVerse> {
  const result = await amplifyData.create('GoldenVerse', {
    input,
    condition,
  });
  return result as APITypes.GoldenVerse;
}

/**
 * Update an existing golden verse
 */
export async function updateGoldenVerse(
  input: APITypes.UpdateGoldenVerseInput,
  condition?: APITypes.ModelGoldenVerseConditionInput
): Promise<APITypes.GoldenVerse> {
  const result = await amplifyData.update('GoldenVerse', {
    input,
    condition,
  });
  return result as APITypes.GoldenVerse;
}

/**
 * Delete a golden verse
 */
export async function deleteGoldenVerse(
  id: string,
  _condition?: APITypes.ModelGoldenVerseConditionInput
): Promise<APITypes.GoldenVerse> {
  const result = await amplifyData.delete('GoldenVerse', id);
  return result as APITypes.GoldenVerse;
}

// ============================================
// LessonGoldenVerse Mutations (Junction Table)
// ============================================

/**
 * Create a new lesson-golden verse relationship
 */
export async function createLessonGoldenVerse(
  input: APITypes.CreateLessonGoldenVerseInput,
  condition?: APITypes.ModelLessonGoldenVerseConditionInput
): Promise<APITypes.LessonGoldenVerse> {
  const result = await amplifyData.create('LessonGoldenVerse', {
    input,
    condition,
  });
  return result as APITypes.LessonGoldenVerse;
}

/**
 * Update an existing lesson-golden verse relationship
 */
export async function updateLessonGoldenVerse(
  input: APITypes.UpdateLessonGoldenVerseInput,
  condition?: APITypes.ModelLessonGoldenVerseConditionInput
): Promise<APITypes.LessonGoldenVerse> {
  const result = await amplifyData.update('LessonGoldenVerse', {
    input,
    condition,
  });
  return result as APITypes.LessonGoldenVerse;
}

/**
 * Delete a lesson-golden verse relationship
 */
export async function deleteLessonGoldenVerse(
  id: string,
  _condition?: APITypes.ModelLessonGoldenVerseConditionInput
): Promise<APITypes.LessonGoldenVerse> {
  const result = await amplifyData.delete('LessonGoldenVerse', id);
  return result as APITypes.LessonGoldenVerse;
}

// ============================================
// Pupil Mutations
// ============================================

/**
 * Create a new pupil
 */
export async function createPupil(
  input: APITypes.CreatePupilInput,
  condition?: APITypes.ModelPupilConditionInput
): Promise<APITypes.Pupil> {
  const result = await amplifyData.create('Pupil', {
    input,
    condition,
  });
  return result as APITypes.Pupil;
}

/**
 * Update an existing pupil
 */
export async function updatePupil(
  input: APITypes.UpdatePupilInput,
  condition?: APITypes.ModelPupilConditionInput
): Promise<APITypes.Pupil> {
  const result = await amplifyData.update('Pupil', {
    input,
    condition,
  });
  return result as APITypes.Pupil;
}

/**
 * Delete a pupil
 */
export async function deletePupil(
  id: string,
  _condition?: APITypes.ModelPupilConditionInput
): Promise<APITypes.Pupil> {
  const result = await amplifyData.delete('Pupil', id);
  return result as APITypes.Pupil;
}

// ============================================
// HomeworkCheck Mutations
// ============================================

/**
 * Create a new homework check
 */
export async function createHomeworkCheck(
  input: APITypes.CreateHomeworkCheckInput,
  condition?: APITypes.ModelHomeworkCheckConditionInput
): Promise<APITypes.HomeworkCheck> {
  const result = await amplifyData.create('HomeworkCheck', {
    input,
    condition,
  });
  return result as APITypes.HomeworkCheck;
}

/**
 * Update an existing homework check
 */
export async function updateHomeworkCheck(
  input: APITypes.UpdateHomeworkCheckInput,
  condition?: APITypes.ModelHomeworkCheckConditionInput
): Promise<APITypes.HomeworkCheck> {
  const result = await amplifyData.update('HomeworkCheck', {
    input,
    condition,
  });
  return result as APITypes.HomeworkCheck;
}

/**
 * Delete a homework check
 */
export async function deleteHomeworkCheck(
  id: string,
  _condition?: APITypes.ModelHomeworkCheckConditionInput
): Promise<APITypes.HomeworkCheck> {
  const result = await amplifyData.delete('HomeworkCheck', id);
  return result as APITypes.HomeworkCheck;
}

// ============================================
// Achievement Mutations
// ============================================

/**
 * Create a new achievement
 */
export async function createAchievement(
  input: APITypes.CreateAchievementInput,
  condition?: APITypes.ModelAchievementConditionInput
): Promise<APITypes.Achievement> {
  const result = await amplifyData.create('Achievement', {
    input,
    condition,
  });
  return result as APITypes.Achievement;
}

/**
 * Update an existing achievement
 */
export async function updateAchievement(
  input: APITypes.UpdateAchievementInput,
  condition?: APITypes.ModelAchievementConditionInput
): Promise<APITypes.Achievement> {
  const result = await amplifyData.update('Achievement', {
    input,
    condition,
  });
  return result as APITypes.Achievement;
}

/**
 * Delete an achievement
 */
export async function deleteAchievement(
  id: string,
  _condition?: APITypes.ModelAchievementConditionInput
): Promise<APITypes.Achievement> {
  const result = await amplifyData.delete('Achievement', id);
  return result as APITypes.Achievement;
}

// ============================================
// PupilAchievement Mutations (Junction Table)
// ============================================

/**
 * Create a new pupil-achievement relationship
 */
export async function createPupilAchievement(
  input: APITypes.CreatePupilAchievementInput,
  condition?: APITypes.ModelPupilAchievementConditionInput
): Promise<APITypes.PupilAchievement> {
  const result = await amplifyData.create('PupilAchievement', {
    input,
    condition,
  });
  return result as APITypes.PupilAchievement;
}

/**
 * Update an existing pupil-achievement relationship
 */
export async function updatePupilAchievement(
  input: APITypes.UpdatePupilAchievementInput,
  condition?: APITypes.ModelPupilAchievementConditionInput
): Promise<APITypes.PupilAchievement> {
  const result = await amplifyData.update('PupilAchievement', {
    input,
    condition,
  });
  return result as APITypes.PupilAchievement;
}

/**
 * Delete a pupil-achievement relationship
 */
export async function deletePupilAchievement(
  id: string,
  _condition?: APITypes.ModelPupilAchievementConditionInput
): Promise<APITypes.PupilAchievement> {
  const result = await amplifyData.delete('PupilAchievement', id);
  return result as APITypes.PupilAchievement;
}

// ============================================
// Family Mutations
// ============================================

/**
 * Create a new family
 */
export async function createFamily(
  input: APITypes.CreateFamilyInput,
  condition?: APITypes.ModelFamilyConditionInput
): Promise<APITypes.Family> {
  const result = await amplifyData.create('Family', {
    input,
    condition,
  });
  return result as APITypes.Family;
}

/**
 * Update an existing family
 */
export async function updateFamily(
  input: APITypes.UpdateFamilyInput,
  condition?: APITypes.ModelFamilyConditionInput
): Promise<APITypes.Family> {
  const result = await amplifyData.update('Family', {
    input,
    condition,
  });
  return result as APITypes.Family;
}

/**
 * Delete a family
 */
export async function deleteFamily(
  id: string,
  _condition?: APITypes.ModelFamilyConditionInput
): Promise<APITypes.Family> {
  const result = await amplifyData.delete('Family', id);
  return result as APITypes.Family;
}

// ============================================
// FamilyMember Mutations (Junction Table)
// ============================================

/**
 * Create a new family member relationship
 */
export async function createFamilyMember(
  input: APITypes.CreateFamilyMemberInput,
  condition?: APITypes.ModelFamilyMemberConditionInput
): Promise<APITypes.FamilyMember> {
  const result = await amplifyData.create('FamilyMember', {
    input,
    condition,
  });
  return result as APITypes.FamilyMember;
}

/**
 * Update an existing family member relationship
 */
export async function updateFamilyMember(
  input: APITypes.UpdateFamilyMemberInput,
  condition?: APITypes.ModelFamilyMemberConditionInput
): Promise<APITypes.FamilyMember> {
  const result = await amplifyData.update('FamilyMember', {
    input,
    condition,
  });
  return result as APITypes.FamilyMember;
}

/**
 * Delete a family member relationship
 */
export async function deleteFamilyMember(
  id: string,
  _condition?: APITypes.ModelFamilyMemberConditionInput
): Promise<APITypes.FamilyMember> {
  const result = await amplifyData.delete('FamilyMember', id);
  return result as APITypes.FamilyMember;
}

// ============================================
// UserGrade Mutations (Junction Table)
// ============================================

/**
 * Create a new user-grade relationship
 */
export async function createUserGrade(
  input: APITypes.CreateUserGradeInput,
  condition?: APITypes.ModelUserGradeConditionInput
): Promise<APITypes.UserGrade> {
  const result = await amplifyData.create('UserGrade', {
    input,
    condition,
  });
  return result as APITypes.UserGrade;
}

/**
 * Update an existing user-grade relationship
 */
export async function updateUserGrade(
  input: APITypes.UpdateUserGradeInput,
  condition?: APITypes.ModelUserGradeConditionInput
): Promise<APITypes.UserGrade> {
  const result = await amplifyData.update('UserGrade', {
    input,
    condition,
  });
  return result as APITypes.UserGrade;
}

/**
 * Delete a user-grade relationship
 */
export async function deleteUserGrade(
  id: string,
  _condition?: APITypes.ModelUserGradeConditionInput
): Promise<APITypes.UserGrade> {
  const result = await amplifyData.delete('UserGrade', id);
  return result as APITypes.UserGrade;
}

// ============================================
// UserFamily Mutations (Junction Table)
// ============================================

/**
 * Create a new user-family relationship
 */
export async function createUserFamily(
  input: APITypes.CreateUserFamilyInput,
  condition?: APITypes.ModelUserFamilyConditionInput
): Promise<APITypes.UserFamily> {
  const result = await amplifyData.create('UserFamily', {
    input,
    condition,
  });
  return result as APITypes.UserFamily;
}

/**
 * Update an existing user-family relationship
 */
export async function updateUserFamily(
  input: APITypes.UpdateUserFamilyInput,
  condition?: APITypes.ModelUserFamilyConditionInput
): Promise<APITypes.UserFamily> {
  const result = await amplifyData.update('UserFamily', {
    input,
    condition,
  });
  return result as APITypes.UserFamily;
}

/**
 * Delete a user-family relationship
 */
export async function deleteUserFamily(
  id: string,
  _condition?: APITypes.ModelUserFamilyConditionInput
): Promise<APITypes.UserFamily> {
  const result = await amplifyData.delete('UserFamily', id);
  return result as APITypes.UserFamily;
}

// ============================================
// GradeEvent Mutations
// ============================================

/**
 * Create a new grade event
 */
export async function createGradeEvent(
  input: APITypes.CreateGradeEventInput,
  condition?: APITypes.ModelGradeEventConditionInput
): Promise<APITypes.GradeEvent> {
  const result = await amplifyData.create('GradeEvent', {
    input,
    condition,
  });
  return result as APITypes.GradeEvent;
}

/**
 * Update an existing grade event
 */
export async function updateGradeEvent(
  input: APITypes.UpdateGradeEventInput,
  condition?: APITypes.ModelGradeEventConditionInput
): Promise<APITypes.GradeEvent> {
  const result = await amplifyData.update('GradeEvent', {
    input,
    condition,
  });
  return result as APITypes.GradeEvent;
}

/**
 * Delete a grade event
 */
export async function deleteGradeEvent(
  id: string,
  _condition?: APITypes.ModelGradeEventConditionInput
): Promise<APITypes.GradeEvent> {
  const result = await amplifyData.delete('GradeEvent', id);
  return result as APITypes.GradeEvent;
}

// ============================================
// GradeSettings Mutations
// ============================================

/**
 * Create a new grade settings
 */
export async function createGradeSettings(
  input: APITypes.CreateGradeSettingsInput,
  condition?: APITypes.ModelGradeSettingsConditionInput
): Promise<APITypes.GradeSettings> {
  const result = await amplifyData.create('GradeSettings', {
    input,
    condition,
  });
  return result as APITypes.GradeSettings;
}

/**
 * Update an existing grade settings
 */
export async function updateGradeSettings(
  input: APITypes.UpdateGradeSettingsInput,
  condition?: APITypes.ModelGradeSettingsConditionInput
): Promise<APITypes.GradeSettings> {
  const result = await amplifyData.update('GradeSettings', {
    input,
    condition,
  });
  return result as APITypes.GradeSettings;
}

/**
 * Delete a grade settings
 */
export async function deleteGradeSettings(
  id: string,
  _condition?: APITypes.ModelGradeSettingsConditionInput
): Promise<APITypes.GradeSettings> {
  const result = await amplifyData.delete('GradeSettings', id);
  return result as APITypes.GradeSettings;
}

