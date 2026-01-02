/* tslint:disable */
//  This file was automatically generated and should not be edited.

export type CreateUserInput = {
  id?: string | null,
  email: string,
  name: string,
  role: UserRole,
  photo?: string | null,
  active: boolean,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export enum UserRole {
  TEACHER = "TEACHER",
  ADMIN = "ADMIN",
  SUPERADMIN = "SUPERADMIN",
  PARENT = "PARENT",
  PUPIL = "PUPIL",
}


export type ModelUserConditionInput = {
  email?: ModelStringInput | null,
  name?: ModelStringInput | null,
  role?: ModelUserRoleInput | null,
  photo?: ModelStringInput | null,
  active?: ModelBooleanInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelUserConditionInput | null > | null,
  or?: Array< ModelUserConditionInput | null > | null,
  not?: ModelUserConditionInput | null,
  id?: ModelStringInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelUserRoleInput = {
  eq?: UserRole | null,
  ne?: UserRole | null,
};

export type ModelBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type User = {
  __typename: "User",
  id: string,
  email: string,
  name: string,
  role: UserRole,
  photo?: string | null,
  active: boolean,
  userGrades?: ModelUserGradeConnection | null,
  createdLessons?: ModelLessonConnection | null,
  userFamilies?: ModelUserFamilyConnection | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelUserGradeConnection = {
  __typename: "ModelUserGradeConnection",
  items:  Array<UserGrade | null >,
  nextToken?: string | null,
};

export type UserGrade = {
  __typename: "UserGrade",
  id: string,
  userId: string,
  gradeId: string,
  user?: User | null,
  grade?: Grade | null,
  assignedAt: string,
  createdAt: string,
  updatedAt: string,
};

export type Grade = {
  __typename: "Grade",
  id: string,
  name: string,
  description?: string | null,
  minAge?: number | null,
  maxAge?: number | null,
  active: boolean,
  teachers?: ModelUserGradeConnection | null,
  academicYears?: ModelAcademicYearConnection | null,
  pupils?: ModelPupilConnection | null,
  events?: ModelGradeEventConnection | null,
  settings?: GradeSettings | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelAcademicYearConnection = {
  __typename: "ModelAcademicYearConnection",
  items:  Array<AcademicYear | null >,
  nextToken?: string | null,
};

export type AcademicYear = {
  __typename: "AcademicYear",
  id: string,
  gradeId: string,
  name: string,
  startDate: string,
  endDate: string,
  status: AcademicYearStatus,
  lessons?: ModelLessonConnection | null,
  createdAt: string,
  updatedAt: string,
};

export enum AcademicYearStatus {
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}


export type ModelLessonConnection = {
  __typename: "ModelLessonConnection",
  items:  Array<Lesson | null >,
  nextToken?: string | null,
};

export type Lesson = {
  __typename: "Lesson",
  id: string,
  academicYearId: string,
  gradeId: string,
  teacherId: string,
  title: string,
  content?: string | null,
  lessonDate: string,
  order: number,
  homeworkChecks?: ModelHomeworkCheckConnection | null,
  goldenVerses?: ModelLessonGoldenVerseConnection | null,
  files?: ModelLessonFileConnection | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelHomeworkCheckConnection = {
  __typename: "ModelHomeworkCheckConnection",
  items:  Array<HomeworkCheck | null >,
  nextToken?: string | null,
};

export type HomeworkCheck = {
  __typename: "HomeworkCheck",
  id: string,
  lessonId: string,
  pupilId: string,
  gradeId: string,
  goldenVerse1Score?: number | null,
  goldenVerse2Score?: number | null,
  goldenVerse3Score?: number | null,
  testScore?: number | null,
  notebookScore?: number | null,
  singing: boolean,
  points: number,
  lesson?: Lesson | null,
  pupil?: Pupil | null,
  createdAt: string,
  updatedAt: string,
};

export type Pupil = {
  __typename: "Pupil",
  id: string,
  gradeId: string,
  firstName: string,
  lastName: string,
  middleName?: string | null,
  dateOfBirth: string,
  photo?: string | null,
  active: boolean,
  families?: ModelFamilyMemberConnection | null,
  homeworkChecks?: ModelHomeworkCheckConnection | null,
  achievements?: ModelPupilAchievementConnection | null,
  bricksIssues?: ModelBricksIssueConnection | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelFamilyMemberConnection = {
  __typename: "ModelFamilyMemberConnection",
  items:  Array<FamilyMember | null >,
  nextToken?: string | null,
};

export type FamilyMember = {
  __typename: "FamilyMember",
  id: string,
  familyId: string,
  pupilId: string,
  family?: Family | null,
  pupil?: Pupil | null,
  createdAt: string,
  updatedAt: string,
};

export type Family = {
  __typename: "Family",
  id: string,
  name: string,
  phone?: string | null,
  email?: string | null,
  address?: string | null,
  motherFirstName?: string | null,
  motherLastName?: string | null,
  motherMiddleName?: string | null,
  motherPhone?: string | null,
  fatherFirstName?: string | null,
  fatherLastName?: string | null,
  fatherMiddleName?: string | null,
  fatherPhone?: string | null,
  members?: ModelFamilyMemberConnection | null,
  userFamilies?: ModelUserFamilyConnection | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelUserFamilyConnection = {
  __typename: "ModelUserFamilyConnection",
  items:  Array<UserFamily | null >,
  nextToken?: string | null,
};

export type UserFamily = {
  __typename: "UserFamily",
  id: string,
  userId: string,
  familyId: string,
  phone: string,
  user?: User | null,
  family?: Family | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelPupilAchievementConnection = {
  __typename: "ModelPupilAchievementConnection",
  items:  Array<PupilAchievement | null >,
  nextToken?: string | null,
};

export type PupilAchievement = {
  __typename: "PupilAchievement",
  id: string,
  pupilId: string,
  achievementId: string,
  awardedAt: string,
  pupil?: Pupil | null,
  achievement?: Achievement | null,
  createdAt: string,
  updatedAt: string,
};

export type Achievement = {
  __typename: "Achievement",
  id: string,
  name: string,
  description: string,
  icon?: string | null,
  criteria: string,
  pupils?: ModelPupilAchievementConnection | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelBricksIssueConnection = {
  __typename: "ModelBricksIssueConnection",
  items:  Array<BricksIssue | null >,
  nextToken?: string | null,
};

export type BricksIssue = {
  __typename: "BricksIssue",
  id: string,
  pupilId: string,
  academicYearId: string,
  gradeId: string,
  quantity: number,
  issuedAt: string,
  issuedBy: string,
  pupil?: Pupil | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelLessonGoldenVerseConnection = {
  __typename: "ModelLessonGoldenVerseConnection",
  items:  Array<LessonGoldenVerse | null >,
  nextToken?: string | null,
};

export type LessonGoldenVerse = {
  __typename: "LessonGoldenVerse",
  id: string,
  lessonId: string,
  goldenVerseId: string,
  order: number,
  lesson?: Lesson | null,
  goldenVerse?: GoldenVerse | null,
  createdAt: string,
  updatedAt: string,
};

export type GoldenVerse = {
  __typename: "GoldenVerse",
  id: string,
  reference: string,
  bookId: string,
  chapter: number,
  verseStart: number,
  verseEnd?: number | null,
  text: string,
  book?: Book | null,
  lessons?: ModelLessonGoldenVerseConnection | null,
  createdAt: string,
  updatedAt: string,
};

export type Book = {
  __typename: "Book",
  id: string,
  fullName: string,
  shortName: string,
  abbreviation: string,
  testament: string,
  order: number,
  goldenVerses?: ModelGoldenVerseConnection | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelGoldenVerseConnection = {
  __typename: "ModelGoldenVerseConnection",
  items:  Array<GoldenVerse | null >,
  nextToken?: string | null,
};

export type ModelLessonFileConnection = {
  __typename: "ModelLessonFileConnection",
  items:  Array<LessonFile | null >,
  nextToken?: string | null,
};

export type LessonFile = {
  __typename: "LessonFile",
  id: string,
  lessonId: string,
  fileName: string,
  fileType: string,
  mimeType: string,
  fileSize: number,
  s3Key: string,
  s3Url: string,
  order: number,
  description?: string | null,
  lesson?: Lesson | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelPupilConnection = {
  __typename: "ModelPupilConnection",
  items:  Array<Pupil | null >,
  nextToken?: string | null,
};

export type ModelGradeEventConnection = {
  __typename: "ModelGradeEventConnection",
  items:  Array<GradeEvent | null >,
  nextToken?: string | null,
};

export type GradeEvent = {
  __typename: "GradeEvent",
  id: string,
  gradeId: string,
  eventType: GradeEventType,
  title: string,
  description?: string | null,
  eventDate: string,
  createdAt: string,
  updatedAt: string,
};

export enum GradeEventType {
  LESSON = "LESSON",
  OUTDOOR_EVENT = "OUTDOOR_EVENT",
  LESSON_SKIPPING = "LESSON_SKIPPING",
}


export type GradeSettings = {
  __typename: "GradeSettings",
  id: string,
  gradeId: string,
  enableGoldenVerse: boolean,
  enableTest: boolean,
  enableNotebook: boolean,
  enableSinging: boolean,
  pointsGoldenVerse: number,
  pointsTest: number,
  pointsNotebook: number,
  pointsSinging: number,
  labelGoldenVerse: string,
  labelTest: string,
  labelNotebook: string,
  labelSinging: string,
  createdAt: string,
  updatedAt: string,
};

export type UpdateUserInput = {
  id: string,
  email?: string | null,
  name?: string | null,
  role?: UserRole | null,
  photo?: string | null,
  active?: boolean | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteUserInput = {
  id: string,
};

export type CreateGradeInput = {
  id?: string | null,
  name: string,
  description?: string | null,
  minAge?: number | null,
  maxAge?: number | null,
  active: boolean,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type ModelGradeConditionInput = {
  name?: ModelStringInput | null,
  description?: ModelStringInput | null,
  minAge?: ModelIntInput | null,
  maxAge?: ModelIntInput | null,
  active?: ModelBooleanInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelGradeConditionInput | null > | null,
  or?: Array< ModelGradeConditionInput | null > | null,
  not?: ModelGradeConditionInput | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type UpdateGradeInput = {
  id: string,
  name?: string | null,
  description?: string | null,
  minAge?: number | null,
  maxAge?: number | null,
  active?: boolean | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteGradeInput = {
  id: string,
};

export type CreateUserGradeInput = {
  id?: string | null,
  userId: string,
  gradeId: string,
  assignedAt: string,
  createdAt?: string | null,
};

export type ModelUserGradeConditionInput = {
  userId?: ModelIDInput | null,
  gradeId?: ModelIDInput | null,
  assignedAt?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  and?: Array< ModelUserGradeConditionInput | null > | null,
  or?: Array< ModelUserGradeConditionInput | null > | null,
  not?: ModelUserGradeConditionInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type UpdateUserGradeInput = {
  id: string,
  userId?: string | null,
  gradeId?: string | null,
  assignedAt?: string | null,
  createdAt?: string | null,
};

export type DeleteUserGradeInput = {
  id: string,
};

export type CreateAcademicYearInput = {
  id?: string | null,
  gradeId: string,
  name: string,
  startDate: string,
  endDate: string,
  status: AcademicYearStatus,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type ModelAcademicYearConditionInput = {
  gradeId?: ModelIDInput | null,
  name?: ModelStringInput | null,
  startDate?: ModelStringInput | null,
  endDate?: ModelStringInput | null,
  status?: ModelAcademicYearStatusInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelAcademicYearConditionInput | null > | null,
  or?: Array< ModelAcademicYearConditionInput | null > | null,
  not?: ModelAcademicYearConditionInput | null,
};

export type ModelAcademicYearStatusInput = {
  eq?: AcademicYearStatus | null,
  ne?: AcademicYearStatus | null,
};

export type UpdateAcademicYearInput = {
  id: string,
  gradeId?: string | null,
  name?: string | null,
  startDate?: string | null,
  endDate?: string | null,
  status?: AcademicYearStatus | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteAcademicYearInput = {
  id: string,
};

export type CreateLessonInput = {
  id?: string | null,
  academicYearId: string,
  gradeId: string,
  teacherId: string,
  title: string,
  content?: string | null,
  lessonDate: string,
  order: number,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type ModelLessonConditionInput = {
  academicYearId?: ModelIDInput | null,
  gradeId?: ModelIDInput | null,
  teacherId?: ModelIDInput | null,
  title?: ModelStringInput | null,
  content?: ModelStringInput | null,
  lessonDate?: ModelStringInput | null,
  order?: ModelIntInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelLessonConditionInput | null > | null,
  or?: Array< ModelLessonConditionInput | null > | null,
  not?: ModelLessonConditionInput | null,
};

export type UpdateLessonInput = {
  id: string,
  academicYearId?: string | null,
  gradeId?: string | null,
  teacherId?: string | null,
  title?: string | null,
  content?: string | null,
  lessonDate?: string | null,
  order?: number | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteLessonInput = {
  id: string,
};

export type CreateLessonFileInput = {
  id?: string | null,
  lessonId: string,
  fileName: string,
  fileType: string,
  mimeType: string,
  fileSize: number,
  s3Key: string,
  s3Url: string,
  order: number,
  description?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type ModelLessonFileConditionInput = {
  lessonId?: ModelIDInput | null,
  fileName?: ModelStringInput | null,
  fileType?: ModelStringInput | null,
  mimeType?: ModelStringInput | null,
  fileSize?: ModelIntInput | null,
  s3Key?: ModelStringInput | null,
  s3Url?: ModelStringInput | null,
  order?: ModelIntInput | null,
  description?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelLessonFileConditionInput | null > | null,
  or?: Array< ModelLessonFileConditionInput | null > | null,
  not?: ModelLessonFileConditionInput | null,
};

export type UpdateLessonFileInput = {
  id: string,
  lessonId?: string | null,
  fileName?: string | null,
  fileType?: string | null,
  mimeType?: string | null,
  fileSize?: number | null,
  s3Key?: string | null,
  s3Url?: string | null,
  order?: number | null,
  description?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteLessonFileInput = {
  id: string,
};

export type CreateBookInput = {
  id?: string | null,
  fullName: string,
  shortName: string,
  abbreviation: string,
  testament: string,
  order: number,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type ModelBookConditionInput = {
  fullName?: ModelStringInput | null,
  shortName?: ModelStringInput | null,
  abbreviation?: ModelStringInput | null,
  testament?: ModelStringInput | null,
  order?: ModelIntInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelBookConditionInput | null > | null,
  or?: Array< ModelBookConditionInput | null > | null,
  not?: ModelBookConditionInput | null,
};

export type UpdateBookInput = {
  id: string,
  fullName?: string | null,
  shortName?: string | null,
  abbreviation?: string | null,
  testament?: string | null,
  order?: number | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteBookInput = {
  id: string,
};

export type CreateGoldenVerseInput = {
  id?: string | null,
  reference: string,
  bookId: string,
  chapter: number,
  verseStart: number,
  verseEnd?: number | null,
  text: string,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type ModelGoldenVerseConditionInput = {
  reference?: ModelStringInput | null,
  bookId?: ModelIDInput | null,
  chapter?: ModelIntInput | null,
  verseStart?: ModelIntInput | null,
  verseEnd?: ModelIntInput | null,
  text?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelGoldenVerseConditionInput | null > | null,
  or?: Array< ModelGoldenVerseConditionInput | null > | null,
  not?: ModelGoldenVerseConditionInput | null,
};

export type UpdateGoldenVerseInput = {
  id: string,
  reference?: string | null,
  bookId?: string | null,
  chapter?: number | null,
  verseStart?: number | null,
  verseEnd?: number | null,
  text?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteGoldenVerseInput = {
  id: string,
};

export type CreateLessonGoldenVerseInput = {
  id?: string | null,
  lessonId: string,
  goldenVerseId: string,
  order: number,
  createdAt?: string | null,
};

export type ModelLessonGoldenVerseConditionInput = {
  lessonId?: ModelIDInput | null,
  goldenVerseId?: ModelIDInput | null,
  order?: ModelIntInput | null,
  createdAt?: ModelStringInput | null,
  and?: Array< ModelLessonGoldenVerseConditionInput | null > | null,
  or?: Array< ModelLessonGoldenVerseConditionInput | null > | null,
  not?: ModelLessonGoldenVerseConditionInput | null,
  updatedAt?: ModelStringInput | null,
};

export type UpdateLessonGoldenVerseInput = {
  id: string,
  lessonId?: string | null,
  goldenVerseId?: string | null,
  order?: number | null,
  createdAt?: string | null,
};

export type DeleteLessonGoldenVerseInput = {
  id: string,
};

export type CreatePupilInput = {
  id?: string | null,
  gradeId: string,
  firstName: string,
  lastName: string,
  middleName?: string | null,
  dateOfBirth: string,
  photo?: string | null,
  active: boolean,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type ModelPupilConditionInput = {
  gradeId?: ModelIDInput | null,
  firstName?: ModelStringInput | null,
  lastName?: ModelStringInput | null,
  middleName?: ModelStringInput | null,
  dateOfBirth?: ModelStringInput | null,
  photo?: ModelStringInput | null,
  active?: ModelBooleanInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelPupilConditionInput | null > | null,
  or?: Array< ModelPupilConditionInput | null > | null,
  not?: ModelPupilConditionInput | null,
};

export type UpdatePupilInput = {
  id: string,
  gradeId?: string | null,
  firstName?: string | null,
  lastName?: string | null,
  middleName?: string | null,
  dateOfBirth?: string | null,
  photo?: string | null,
  active?: boolean | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeletePupilInput = {
  id: string,
};

export type CreateHomeworkCheckInput = {
  id?: string | null,
  lessonId: string,
  pupilId: string,
  gradeId: string,
  goldenVerse1Score?: number | null,
  goldenVerse2Score?: number | null,
  goldenVerse3Score?: number | null,
  testScore?: number | null,
  notebookScore?: number | null,
  singing: boolean,
  points: number,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type ModelHomeworkCheckConditionInput = {
  lessonId?: ModelIDInput | null,
  pupilId?: ModelIDInput | null,
  gradeId?: ModelIDInput | null,
  goldenVerse1Score?: ModelIntInput | null,
  goldenVerse2Score?: ModelIntInput | null,
  goldenVerse3Score?: ModelIntInput | null,
  testScore?: ModelIntInput | null,
  notebookScore?: ModelIntInput | null,
  singing?: ModelBooleanInput | null,
  points?: ModelIntInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelHomeworkCheckConditionInput | null > | null,
  or?: Array< ModelHomeworkCheckConditionInput | null > | null,
  not?: ModelHomeworkCheckConditionInput | null,
};

export type UpdateHomeworkCheckInput = {
  id: string,
  lessonId?: string | null,
  pupilId?: string | null,
  gradeId?: string | null,
  goldenVerse1Score?: number | null,
  goldenVerse2Score?: number | null,
  goldenVerse3Score?: number | null,
  testScore?: number | null,
  notebookScore?: number | null,
  singing?: boolean | null,
  points?: number | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteHomeworkCheckInput = {
  id: string,
};

export type CreateAchievementInput = {
  id?: string | null,
  name: string,
  description: string,
  icon?: string | null,
  criteria: string,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type ModelAchievementConditionInput = {
  name?: ModelStringInput | null,
  description?: ModelStringInput | null,
  icon?: ModelStringInput | null,
  criteria?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelAchievementConditionInput | null > | null,
  or?: Array< ModelAchievementConditionInput | null > | null,
  not?: ModelAchievementConditionInput | null,
};

export type UpdateAchievementInput = {
  id: string,
  name?: string | null,
  description?: string | null,
  icon?: string | null,
  criteria?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteAchievementInput = {
  id: string,
};

export type CreatePupilAchievementInput = {
  id?: string | null,
  pupilId: string,
  achievementId: string,
  awardedAt: string,
  createdAt?: string | null,
};

export type ModelPupilAchievementConditionInput = {
  pupilId?: ModelIDInput | null,
  achievementId?: ModelIDInput | null,
  awardedAt?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  and?: Array< ModelPupilAchievementConditionInput | null > | null,
  or?: Array< ModelPupilAchievementConditionInput | null > | null,
  not?: ModelPupilAchievementConditionInput | null,
  updatedAt?: ModelStringInput | null,
};

export type UpdatePupilAchievementInput = {
  id: string,
  pupilId?: string | null,
  achievementId?: string | null,
  awardedAt?: string | null,
  createdAt?: string | null,
};

export type DeletePupilAchievementInput = {
  id: string,
};

export type CreateBricksIssueInput = {
  id?: string | null,
  pupilId: string,
  academicYearId: string,
  gradeId: string,
  quantity: number,
  issuedAt: string,
  issuedBy: string,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type ModelBricksIssueConditionInput = {
  pupilId?: ModelIDInput | null,
  academicYearId?: ModelIDInput | null,
  gradeId?: ModelIDInput | null,
  quantity?: ModelIntInput | null,
  issuedAt?: ModelStringInput | null,
  issuedBy?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelBricksIssueConditionInput | null > | null,
  or?: Array< ModelBricksIssueConditionInput | null > | null,
  not?: ModelBricksIssueConditionInput | null,
};

export type UpdateBricksIssueInput = {
  id: string,
  pupilId?: string | null,
  academicYearId?: string | null,
  gradeId?: string | null,
  quantity?: number | null,
  issuedAt?: string | null,
  issuedBy?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteBricksIssueInput = {
  id: string,
};

export type CreateFamilyInput = {
  id?: string | null,
  name: string,
  phone?: string | null,
  email?: string | null,
  address?: string | null,
  motherFirstName?: string | null,
  motherLastName?: string | null,
  motherMiddleName?: string | null,
  motherPhone?: string | null,
  fatherFirstName?: string | null,
  fatherLastName?: string | null,
  fatherMiddleName?: string | null,
  fatherPhone?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type ModelFamilyConditionInput = {
  name?: ModelStringInput | null,
  phone?: ModelStringInput | null,
  email?: ModelStringInput | null,
  address?: ModelStringInput | null,
  motherFirstName?: ModelStringInput | null,
  motherLastName?: ModelStringInput | null,
  motherMiddleName?: ModelStringInput | null,
  motherPhone?: ModelStringInput | null,
  fatherFirstName?: ModelStringInput | null,
  fatherLastName?: ModelStringInput | null,
  fatherMiddleName?: ModelStringInput | null,
  fatherPhone?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelFamilyConditionInput | null > | null,
  or?: Array< ModelFamilyConditionInput | null > | null,
  not?: ModelFamilyConditionInput | null,
};

export type UpdateFamilyInput = {
  id: string,
  name?: string | null,
  phone?: string | null,
  email?: string | null,
  address?: string | null,
  motherFirstName?: string | null,
  motherLastName?: string | null,
  motherMiddleName?: string | null,
  motherPhone?: string | null,
  fatherFirstName?: string | null,
  fatherLastName?: string | null,
  fatherMiddleName?: string | null,
  fatherPhone?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteFamilyInput = {
  id: string,
};

export type CreateFamilyMemberInput = {
  id?: string | null,
  familyId: string,
  pupilId: string,
  createdAt?: string | null,
};

export type ModelFamilyMemberConditionInput = {
  familyId?: ModelIDInput | null,
  pupilId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  and?: Array< ModelFamilyMemberConditionInput | null > | null,
  or?: Array< ModelFamilyMemberConditionInput | null > | null,
  not?: ModelFamilyMemberConditionInput | null,
  updatedAt?: ModelStringInput | null,
};

export type UpdateFamilyMemberInput = {
  id: string,
  familyId?: string | null,
  pupilId?: string | null,
  createdAt?: string | null,
};

export type DeleteFamilyMemberInput = {
  id: string,
};

export type CreateUserFamilyInput = {
  id?: string | null,
  userId: string,
  familyId: string,
  phone: string,
  createdAt?: string | null,
};

export type ModelUserFamilyConditionInput = {
  userId?: ModelIDInput | null,
  familyId?: ModelIDInput | null,
  phone?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  and?: Array< ModelUserFamilyConditionInput | null > | null,
  or?: Array< ModelUserFamilyConditionInput | null > | null,
  not?: ModelUserFamilyConditionInput | null,
  updatedAt?: ModelStringInput | null,
};

export type UpdateUserFamilyInput = {
  id: string,
  userId?: string | null,
  familyId?: string | null,
  phone?: string | null,
  createdAt?: string | null,
};

export type DeleteUserFamilyInput = {
  id: string,
};

export type CreateGradeEventInput = {
  id?: string | null,
  gradeId: string,
  eventType: GradeEventType,
  title: string,
  description?: string | null,
  eventDate: string,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type ModelGradeEventConditionInput = {
  gradeId?: ModelIDInput | null,
  eventType?: ModelGradeEventTypeInput | null,
  title?: ModelStringInput | null,
  description?: ModelStringInput | null,
  eventDate?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelGradeEventConditionInput | null > | null,
  or?: Array< ModelGradeEventConditionInput | null > | null,
  not?: ModelGradeEventConditionInput | null,
};

export type ModelGradeEventTypeInput = {
  eq?: GradeEventType | null,
  ne?: GradeEventType | null,
};

export type UpdateGradeEventInput = {
  id: string,
  gradeId?: string | null,
  eventType?: GradeEventType | null,
  title?: string | null,
  description?: string | null,
  eventDate?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteGradeEventInput = {
  id: string,
};

export type CreateGradeSettingsInput = {
  id?: string | null,
  gradeId: string,
  enableGoldenVerse: boolean,
  enableTest: boolean,
  enableNotebook: boolean,
  enableSinging: boolean,
  pointsGoldenVerse: number,
  pointsTest: number,
  pointsNotebook: number,
  pointsSinging: number,
  labelGoldenVerse: string,
  labelTest: string,
  labelNotebook: string,
  labelSinging: string,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type ModelGradeSettingsConditionInput = {
  gradeId?: ModelIDInput | null,
  enableGoldenVerse?: ModelBooleanInput | null,
  enableTest?: ModelBooleanInput | null,
  enableNotebook?: ModelBooleanInput | null,
  enableSinging?: ModelBooleanInput | null,
  pointsGoldenVerse?: ModelIntInput | null,
  pointsTest?: ModelIntInput | null,
  pointsNotebook?: ModelIntInput | null,
  pointsSinging?: ModelIntInput | null,
  labelGoldenVerse?: ModelStringInput | null,
  labelTest?: ModelStringInput | null,
  labelNotebook?: ModelStringInput | null,
  labelSinging?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelGradeSettingsConditionInput | null > | null,
  or?: Array< ModelGradeSettingsConditionInput | null > | null,
  not?: ModelGradeSettingsConditionInput | null,
};

export type UpdateGradeSettingsInput = {
  id: string,
  gradeId?: string | null,
  enableGoldenVerse?: boolean | null,
  enableTest?: boolean | null,
  enableNotebook?: boolean | null,
  enableSinging?: boolean | null,
  pointsGoldenVerse?: number | null,
  pointsTest?: number | null,
  pointsNotebook?: number | null,
  pointsSinging?: number | null,
  labelGoldenVerse?: string | null,
  labelTest?: string | null,
  labelNotebook?: string | null,
  labelSinging?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteGradeSettingsInput = {
  id: string,
};

export type ModelUserFilterInput = {
  id?: ModelIDInput | null,
  email?: ModelStringInput | null,
  name?: ModelStringInput | null,
  role?: ModelUserRoleInput | null,
  photo?: ModelStringInput | null,
  active?: ModelBooleanInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelUserFilterInput | null > | null,
  or?: Array< ModelUserFilterInput | null > | null,
  not?: ModelUserFilterInput | null,
};

export type ModelUserConnection = {
  __typename: "ModelUserConnection",
  items:  Array<User | null >,
  nextToken?: string | null,
};

export type ModelGradeFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  description?: ModelStringInput | null,
  minAge?: ModelIntInput | null,
  maxAge?: ModelIntInput | null,
  active?: ModelBooleanInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelGradeFilterInput | null > | null,
  or?: Array< ModelGradeFilterInput | null > | null,
  not?: ModelGradeFilterInput | null,
};

export type ModelGradeConnection = {
  __typename: "ModelGradeConnection",
  items:  Array<Grade | null >,
  nextToken?: string | null,
};

export type ModelAcademicYearFilterInput = {
  id?: ModelIDInput | null,
  gradeId?: ModelIDInput | null,
  name?: ModelStringInput | null,
  startDate?: ModelStringInput | null,
  endDate?: ModelStringInput | null,
  status?: ModelAcademicYearStatusInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelAcademicYearFilterInput | null > | null,
  or?: Array< ModelAcademicYearFilterInput | null > | null,
  not?: ModelAcademicYearFilterInput | null,
};

export type ModelLessonFilterInput = {
  id?: ModelIDInput | null,
  academicYearId?: ModelIDInput | null,
  gradeId?: ModelIDInput | null,
  teacherId?: ModelIDInput | null,
  title?: ModelStringInput | null,
  content?: ModelStringInput | null,
  lessonDate?: ModelStringInput | null,
  order?: ModelIntInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelLessonFilterInput | null > | null,
  or?: Array< ModelLessonFilterInput | null > | null,
  not?: ModelLessonFilterInput | null,
};

export type ModelBookFilterInput = {
  id?: ModelIDInput | null,
  fullName?: ModelStringInput | null,
  shortName?: ModelStringInput | null,
  abbreviation?: ModelStringInput | null,
  testament?: ModelStringInput | null,
  order?: ModelIntInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelBookFilterInput | null > | null,
  or?: Array< ModelBookFilterInput | null > | null,
  not?: ModelBookFilterInput | null,
};

export type ModelBookConnection = {
  __typename: "ModelBookConnection",
  items:  Array<Book | null >,
  nextToken?: string | null,
};

export type ModelGoldenVerseFilterInput = {
  id?: ModelIDInput | null,
  reference?: ModelStringInput | null,
  bookId?: ModelIDInput | null,
  chapter?: ModelIntInput | null,
  verseStart?: ModelIntInput | null,
  verseEnd?: ModelIntInput | null,
  text?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelGoldenVerseFilterInput | null > | null,
  or?: Array< ModelGoldenVerseFilterInput | null > | null,
  not?: ModelGoldenVerseFilterInput | null,
};

export type ModelPupilFilterInput = {
  id?: ModelIDInput | null,
  gradeId?: ModelIDInput | null,
  firstName?: ModelStringInput | null,
  lastName?: ModelStringInput | null,
  middleName?: ModelStringInput | null,
  dateOfBirth?: ModelStringInput | null,
  photo?: ModelStringInput | null,
  active?: ModelBooleanInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelPupilFilterInput | null > | null,
  or?: Array< ModelPupilFilterInput | null > | null,
  not?: ModelPupilFilterInput | null,
};

export type ModelHomeworkCheckFilterInput = {
  id?: ModelIDInput | null,
  lessonId?: ModelIDInput | null,
  pupilId?: ModelIDInput | null,
  gradeId?: ModelIDInput | null,
  goldenVerse1Score?: ModelIntInput | null,
  goldenVerse2Score?: ModelIntInput | null,
  goldenVerse3Score?: ModelIntInput | null,
  testScore?: ModelIntInput | null,
  notebookScore?: ModelIntInput | null,
  singing?: ModelBooleanInput | null,
  points?: ModelIntInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelHomeworkCheckFilterInput | null > | null,
  or?: Array< ModelHomeworkCheckFilterInput | null > | null,
  not?: ModelHomeworkCheckFilterInput | null,
};

export type ModelAchievementFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  description?: ModelStringInput | null,
  icon?: ModelStringInput | null,
  criteria?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelAchievementFilterInput | null > | null,
  or?: Array< ModelAchievementFilterInput | null > | null,
  not?: ModelAchievementFilterInput | null,
};

export type ModelAchievementConnection = {
  __typename: "ModelAchievementConnection",
  items:  Array<Achievement | null >,
  nextToken?: string | null,
};

export type ModelBricksIssueFilterInput = {
  id?: ModelIDInput | null,
  pupilId?: ModelIDInput | null,
  academicYearId?: ModelIDInput | null,
  gradeId?: ModelIDInput | null,
  quantity?: ModelIntInput | null,
  issuedAt?: ModelStringInput | null,
  issuedBy?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelBricksIssueFilterInput | null > | null,
  or?: Array< ModelBricksIssueFilterInput | null > | null,
  not?: ModelBricksIssueFilterInput | null,
};

export type ModelFamilyFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  phone?: ModelStringInput | null,
  email?: ModelStringInput | null,
  address?: ModelStringInput | null,
  motherFirstName?: ModelStringInput | null,
  motherLastName?: ModelStringInput | null,
  motherMiddleName?: ModelStringInput | null,
  motherPhone?: ModelStringInput | null,
  fatherFirstName?: ModelStringInput | null,
  fatherLastName?: ModelStringInput | null,
  fatherMiddleName?: ModelStringInput | null,
  fatherPhone?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelFamilyFilterInput | null > | null,
  or?: Array< ModelFamilyFilterInput | null > | null,
  not?: ModelFamilyFilterInput | null,
};

export type ModelFamilyConnection = {
  __typename: "ModelFamilyConnection",
  items:  Array<Family | null >,
  nextToken?: string | null,
};

export type ModelGradeEventFilterInput = {
  id?: ModelIDInput | null,
  gradeId?: ModelIDInput | null,
  eventType?: ModelGradeEventTypeInput | null,
  title?: ModelStringInput | null,
  description?: ModelStringInput | null,
  eventDate?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelGradeEventFilterInput | null > | null,
  or?: Array< ModelGradeEventFilterInput | null > | null,
  not?: ModelGradeEventFilterInput | null,
};

export type ModelGradeSettingsFilterInput = {
  id?: ModelIDInput | null,
  gradeId?: ModelIDInput | null,
  enableGoldenVerse?: ModelBooleanInput | null,
  enableTest?: ModelBooleanInput | null,
  enableNotebook?: ModelBooleanInput | null,
  enableSinging?: ModelBooleanInput | null,
  pointsGoldenVerse?: ModelIntInput | null,
  pointsTest?: ModelIntInput | null,
  pointsNotebook?: ModelIntInput | null,
  pointsSinging?: ModelIntInput | null,
  labelGoldenVerse?: ModelStringInput | null,
  labelTest?: ModelStringInput | null,
  labelNotebook?: ModelStringInput | null,
  labelSinging?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelGradeSettingsFilterInput | null > | null,
  or?: Array< ModelGradeSettingsFilterInput | null > | null,
  not?: ModelGradeSettingsFilterInput | null,
};

export type ModelGradeSettingsConnection = {
  __typename: "ModelGradeSettingsConnection",
  items:  Array<GradeSettings | null >,
  nextToken?: string | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelStringKeyConditionInput = {
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type ModelIDKeyConditionInput = {
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type ModelUserGradeFilterInput = {
  id?: ModelIDInput | null,
  userId?: ModelIDInput | null,
  gradeId?: ModelIDInput | null,
  assignedAt?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  and?: Array< ModelUserGradeFilterInput | null > | null,
  or?: Array< ModelUserGradeFilterInput | null > | null,
  not?: ModelUserGradeFilterInput | null,
};

export type ModelIntKeyConditionInput = {
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelLessonFileFilterInput = {
  id?: ModelIDInput | null,
  lessonId?: ModelIDInput | null,
  fileName?: ModelStringInput | null,
  fileType?: ModelStringInput | null,
  mimeType?: ModelStringInput | null,
  fileSize?: ModelIntInput | null,
  s3Key?: ModelStringInput | null,
  s3Url?: ModelStringInput | null,
  order?: ModelIntInput | null,
  description?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelLessonFileFilterInput | null > | null,
  or?: Array< ModelLessonFileFilterInput | null > | null,
  not?: ModelLessonFileFilterInput | null,
};

export type ModelLessonGoldenVerseFilterInput = {
  id?: ModelIDInput | null,
  lessonId?: ModelIDInput | null,
  goldenVerseId?: ModelIDInput | null,
  order?: ModelIntInput | null,
  createdAt?: ModelStringInput | null,
  and?: Array< ModelLessonGoldenVerseFilterInput | null > | null,
  or?: Array< ModelLessonGoldenVerseFilterInput | null > | null,
  not?: ModelLessonGoldenVerseFilterInput | null,
};

export type ModelPupilAchievementFilterInput = {
  id?: ModelIDInput | null,
  pupilId?: ModelIDInput | null,
  achievementId?: ModelIDInput | null,
  awardedAt?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  and?: Array< ModelPupilAchievementFilterInput | null > | null,
  or?: Array< ModelPupilAchievementFilterInput | null > | null,
  not?: ModelPupilAchievementFilterInput | null,
};

export type ModelFamilyMemberFilterInput = {
  id?: ModelIDInput | null,
  familyId?: ModelIDInput | null,
  pupilId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  and?: Array< ModelFamilyMemberFilterInput | null > | null,
  or?: Array< ModelFamilyMemberFilterInput | null > | null,
  not?: ModelFamilyMemberFilterInput | null,
};

export type ModelUserFamilyFilterInput = {
  id?: ModelIDInput | null,
  userId?: ModelIDInput | null,
  familyId?: ModelIDInput | null,
  phone?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  and?: Array< ModelUserFamilyFilterInput | null > | null,
  or?: Array< ModelUserFamilyFilterInput | null > | null,
  not?: ModelUserFamilyFilterInput | null,
};

export type ModelSubscriptionUserFilterInput = {
  email?: ModelSubscriptionStringInput | null,
  name?: ModelSubscriptionStringInput | null,
  role?: ModelSubscriptionStringInput | null,
  photo?: ModelSubscriptionStringInput | null,
  active?: ModelSubscriptionBooleanInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionUserFilterInput | null > | null,
  or?: Array< ModelSubscriptionUserFilterInput | null > | null,
  id?: ModelStringInput | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
};

export type ModelSubscriptionGradeFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  minAge?: ModelSubscriptionIntInput | null,
  maxAge?: ModelSubscriptionIntInput | null,
  active?: ModelSubscriptionBooleanInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionGradeFilterInput | null > | null,
  or?: Array< ModelSubscriptionGradeFilterInput | null > | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionUserGradeFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  userId?: ModelSubscriptionIDInput | null,
  gradeId?: ModelSubscriptionIDInput | null,
  assignedAt?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionUserGradeFilterInput | null > | null,
  or?: Array< ModelSubscriptionUserGradeFilterInput | null > | null,
};

export type ModelSubscriptionAcademicYearFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  gradeId?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  startDate?: ModelSubscriptionStringInput | null,
  endDate?: ModelSubscriptionStringInput | null,
  status?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionAcademicYearFilterInput | null > | null,
  or?: Array< ModelSubscriptionAcademicYearFilterInput | null > | null,
};

export type ModelSubscriptionLessonFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  academicYearId?: ModelSubscriptionIDInput | null,
  gradeId?: ModelSubscriptionIDInput | null,
  title?: ModelSubscriptionStringInput | null,
  content?: ModelSubscriptionStringInput | null,
  lessonDate?: ModelSubscriptionStringInput | null,
  order?: ModelSubscriptionIntInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionLessonFilterInput | null > | null,
  or?: Array< ModelSubscriptionLessonFilterInput | null > | null,
  teacherId?: ModelStringInput | null,
};

export type ModelSubscriptionLessonFileFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  lessonId?: ModelSubscriptionIDInput | null,
  fileName?: ModelSubscriptionStringInput | null,
  fileType?: ModelSubscriptionStringInput | null,
  mimeType?: ModelSubscriptionStringInput | null,
  fileSize?: ModelSubscriptionIntInput | null,
  s3Key?: ModelSubscriptionStringInput | null,
  s3Url?: ModelSubscriptionStringInput | null,
  order?: ModelSubscriptionIntInput | null,
  description?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionLessonFileFilterInput | null > | null,
  or?: Array< ModelSubscriptionLessonFileFilterInput | null > | null,
};

export type ModelSubscriptionBookFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  fullName?: ModelSubscriptionStringInput | null,
  shortName?: ModelSubscriptionStringInput | null,
  abbreviation?: ModelSubscriptionStringInput | null,
  testament?: ModelSubscriptionStringInput | null,
  order?: ModelSubscriptionIntInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionBookFilterInput | null > | null,
  or?: Array< ModelSubscriptionBookFilterInput | null > | null,
};

export type ModelSubscriptionGoldenVerseFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  reference?: ModelSubscriptionStringInput | null,
  bookId?: ModelSubscriptionIDInput | null,
  chapter?: ModelSubscriptionIntInput | null,
  verseStart?: ModelSubscriptionIntInput | null,
  verseEnd?: ModelSubscriptionIntInput | null,
  text?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionGoldenVerseFilterInput | null > | null,
  or?: Array< ModelSubscriptionGoldenVerseFilterInput | null > | null,
};

export type ModelSubscriptionLessonGoldenVerseFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  lessonId?: ModelSubscriptionIDInput | null,
  goldenVerseId?: ModelSubscriptionIDInput | null,
  order?: ModelSubscriptionIntInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionLessonGoldenVerseFilterInput | null > | null,
  or?: Array< ModelSubscriptionLessonGoldenVerseFilterInput | null > | null,
};

export type ModelSubscriptionPupilFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  gradeId?: ModelSubscriptionIDInput | null,
  firstName?: ModelSubscriptionStringInput | null,
  lastName?: ModelSubscriptionStringInput | null,
  middleName?: ModelSubscriptionStringInput | null,
  dateOfBirth?: ModelSubscriptionStringInput | null,
  photo?: ModelSubscriptionStringInput | null,
  active?: ModelSubscriptionBooleanInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionPupilFilterInput | null > | null,
  or?: Array< ModelSubscriptionPupilFilterInput | null > | null,
};

export type ModelSubscriptionHomeworkCheckFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  lessonId?: ModelSubscriptionIDInput | null,
  pupilId?: ModelSubscriptionIDInput | null,
  gradeId?: ModelSubscriptionIDInput | null,
  goldenVerse1Score?: ModelSubscriptionIntInput | null,
  goldenVerse2Score?: ModelSubscriptionIntInput | null,
  goldenVerse3Score?: ModelSubscriptionIntInput | null,
  testScore?: ModelSubscriptionIntInput | null,
  notebookScore?: ModelSubscriptionIntInput | null,
  singing?: ModelSubscriptionBooleanInput | null,
  points?: ModelSubscriptionIntInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionHomeworkCheckFilterInput | null > | null,
  or?: Array< ModelSubscriptionHomeworkCheckFilterInput | null > | null,
};

export type ModelSubscriptionAchievementFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  icon?: ModelSubscriptionStringInput | null,
  criteria?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionAchievementFilterInput | null > | null,
  or?: Array< ModelSubscriptionAchievementFilterInput | null > | null,
};

export type ModelSubscriptionPupilAchievementFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  pupilId?: ModelSubscriptionIDInput | null,
  achievementId?: ModelSubscriptionIDInput | null,
  awardedAt?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionPupilAchievementFilterInput | null > | null,
  or?: Array< ModelSubscriptionPupilAchievementFilterInput | null > | null,
};

export type ModelSubscriptionBricksIssueFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  pupilId?: ModelSubscriptionIDInput | null,
  academicYearId?: ModelSubscriptionIDInput | null,
  gradeId?: ModelSubscriptionIDInput | null,
  quantity?: ModelSubscriptionIntInput | null,
  issuedAt?: ModelSubscriptionStringInput | null,
  issuedBy?: ModelSubscriptionIDInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionBricksIssueFilterInput | null > | null,
  or?: Array< ModelSubscriptionBricksIssueFilterInput | null > | null,
};

export type ModelSubscriptionFamilyFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  phone?: ModelSubscriptionStringInput | null,
  email?: ModelSubscriptionStringInput | null,
  address?: ModelSubscriptionStringInput | null,
  motherFirstName?: ModelSubscriptionStringInput | null,
  motherLastName?: ModelSubscriptionStringInput | null,
  motherMiddleName?: ModelSubscriptionStringInput | null,
  motherPhone?: ModelSubscriptionStringInput | null,
  fatherFirstName?: ModelSubscriptionStringInput | null,
  fatherLastName?: ModelSubscriptionStringInput | null,
  fatherMiddleName?: ModelSubscriptionStringInput | null,
  fatherPhone?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionFamilyFilterInput | null > | null,
  or?: Array< ModelSubscriptionFamilyFilterInput | null > | null,
};

export type ModelSubscriptionFamilyMemberFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  familyId?: ModelSubscriptionIDInput | null,
  pupilId?: ModelSubscriptionIDInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionFamilyMemberFilterInput | null > | null,
  or?: Array< ModelSubscriptionFamilyMemberFilterInput | null > | null,
};

export type ModelSubscriptionUserFamilyFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  familyId?: ModelSubscriptionIDInput | null,
  phone?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionUserFamilyFilterInput | null > | null,
  or?: Array< ModelSubscriptionUserFamilyFilterInput | null > | null,
  userId?: ModelStringInput | null,
};

export type ModelSubscriptionGradeEventFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  gradeId?: ModelSubscriptionIDInput | null,
  eventType?: ModelSubscriptionStringInput | null,
  title?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  eventDate?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionGradeEventFilterInput | null > | null,
  or?: Array< ModelSubscriptionGradeEventFilterInput | null > | null,
};

export type ModelSubscriptionGradeSettingsFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  gradeId?: ModelSubscriptionIDInput | null,
  enableGoldenVerse?: ModelSubscriptionBooleanInput | null,
  enableTest?: ModelSubscriptionBooleanInput | null,
  enableNotebook?: ModelSubscriptionBooleanInput | null,
  enableSinging?: ModelSubscriptionBooleanInput | null,
  pointsGoldenVerse?: ModelSubscriptionIntInput | null,
  pointsTest?: ModelSubscriptionIntInput | null,
  pointsNotebook?: ModelSubscriptionIntInput | null,
  pointsSinging?: ModelSubscriptionIntInput | null,
  labelGoldenVerse?: ModelSubscriptionStringInput | null,
  labelTest?: ModelSubscriptionStringInput | null,
  labelNotebook?: ModelSubscriptionStringInput | null,
  labelSinging?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionGradeSettingsFilterInput | null > | null,
  or?: Array< ModelSubscriptionGradeSettingsFilterInput | null > | null,
};

export type CreateUserMutationVariables = {
  input: CreateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type CreateUserMutation = {
  createUser?:  {
    __typename: "User",
    id: string,
    email: string,
    name: string,
    role: UserRole,
    photo?: string | null,
    active: boolean,
    userGrades?:  {
      __typename: "ModelUserGradeConnection",
      nextToken?: string | null,
    } | null,
    createdLessons?:  {
      __typename: "ModelLessonConnection",
      nextToken?: string | null,
    } | null,
    userFamilies?:  {
      __typename: "ModelUserFamilyConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateUserMutationVariables = {
  input: UpdateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type UpdateUserMutation = {
  updateUser?:  {
    __typename: "User",
    id: string,
    email: string,
    name: string,
    role: UserRole,
    photo?: string | null,
    active: boolean,
    userGrades?:  {
      __typename: "ModelUserGradeConnection",
      nextToken?: string | null,
    } | null,
    createdLessons?:  {
      __typename: "ModelLessonConnection",
      nextToken?: string | null,
    } | null,
    userFamilies?:  {
      __typename: "ModelUserFamilyConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteUserMutationVariables = {
  input: DeleteUserInput,
  condition?: ModelUserConditionInput | null,
};

export type DeleteUserMutation = {
  deleteUser?:  {
    __typename: "User",
    id: string,
    email: string,
    name: string,
    role: UserRole,
    photo?: string | null,
    active: boolean,
    userGrades?:  {
      __typename: "ModelUserGradeConnection",
      nextToken?: string | null,
    } | null,
    createdLessons?:  {
      __typename: "ModelLessonConnection",
      nextToken?: string | null,
    } | null,
    userFamilies?:  {
      __typename: "ModelUserFamilyConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateGradeMutationVariables = {
  input: CreateGradeInput,
  condition?: ModelGradeConditionInput | null,
};

export type CreateGradeMutation = {
  createGrade?:  {
    __typename: "Grade",
    id: string,
    name: string,
    description?: string | null,
    minAge?: number | null,
    maxAge?: number | null,
    active: boolean,
    teachers?:  {
      __typename: "ModelUserGradeConnection",
      nextToken?: string | null,
    } | null,
    academicYears?:  {
      __typename: "ModelAcademicYearConnection",
      nextToken?: string | null,
    } | null,
    pupils?:  {
      __typename: "ModelPupilConnection",
      nextToken?: string | null,
    } | null,
    events?:  {
      __typename: "ModelGradeEventConnection",
      nextToken?: string | null,
    } | null,
    settings?:  {
      __typename: "GradeSettings",
      id: string,
      gradeId: string,
      enableGoldenVerse: boolean,
      enableTest: boolean,
      enableNotebook: boolean,
      enableSinging: boolean,
      pointsGoldenVerse: number,
      pointsTest: number,
      pointsNotebook: number,
      pointsSinging: number,
      labelGoldenVerse: string,
      labelTest: string,
      labelNotebook: string,
      labelSinging: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateGradeMutationVariables = {
  input: UpdateGradeInput,
  condition?: ModelGradeConditionInput | null,
};

export type UpdateGradeMutation = {
  updateGrade?:  {
    __typename: "Grade",
    id: string,
    name: string,
    description?: string | null,
    minAge?: number | null,
    maxAge?: number | null,
    active: boolean,
    teachers?:  {
      __typename: "ModelUserGradeConnection",
      nextToken?: string | null,
    } | null,
    academicYears?:  {
      __typename: "ModelAcademicYearConnection",
      nextToken?: string | null,
    } | null,
    pupils?:  {
      __typename: "ModelPupilConnection",
      nextToken?: string | null,
    } | null,
    events?:  {
      __typename: "ModelGradeEventConnection",
      nextToken?: string | null,
    } | null,
    settings?:  {
      __typename: "GradeSettings",
      id: string,
      gradeId: string,
      enableGoldenVerse: boolean,
      enableTest: boolean,
      enableNotebook: boolean,
      enableSinging: boolean,
      pointsGoldenVerse: number,
      pointsTest: number,
      pointsNotebook: number,
      pointsSinging: number,
      labelGoldenVerse: string,
      labelTest: string,
      labelNotebook: string,
      labelSinging: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteGradeMutationVariables = {
  input: DeleteGradeInput,
  condition?: ModelGradeConditionInput | null,
};

export type DeleteGradeMutation = {
  deleteGrade?:  {
    __typename: "Grade",
    id: string,
    name: string,
    description?: string | null,
    minAge?: number | null,
    maxAge?: number | null,
    active: boolean,
    teachers?:  {
      __typename: "ModelUserGradeConnection",
      nextToken?: string | null,
    } | null,
    academicYears?:  {
      __typename: "ModelAcademicYearConnection",
      nextToken?: string | null,
    } | null,
    pupils?:  {
      __typename: "ModelPupilConnection",
      nextToken?: string | null,
    } | null,
    events?:  {
      __typename: "ModelGradeEventConnection",
      nextToken?: string | null,
    } | null,
    settings?:  {
      __typename: "GradeSettings",
      id: string,
      gradeId: string,
      enableGoldenVerse: boolean,
      enableTest: boolean,
      enableNotebook: boolean,
      enableSinging: boolean,
      pointsGoldenVerse: number,
      pointsTest: number,
      pointsNotebook: number,
      pointsSinging: number,
      labelGoldenVerse: string,
      labelTest: string,
      labelNotebook: string,
      labelSinging: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateUserGradeMutationVariables = {
  input: CreateUserGradeInput,
  condition?: ModelUserGradeConditionInput | null,
};

export type CreateUserGradeMutation = {
  createUserGrade?:  {
    __typename: "UserGrade",
    id: string,
    userId: string,
    gradeId: string,
    user?:  {
      __typename: "User",
      id: string,
      email: string,
      name: string,
      role: UserRole,
      photo?: string | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    grade?:  {
      __typename: "Grade",
      id: string,
      name: string,
      description?: string | null,
      minAge?: number | null,
      maxAge?: number | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    assignedAt: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateUserGradeMutationVariables = {
  input: UpdateUserGradeInput,
  condition?: ModelUserGradeConditionInput | null,
};

export type UpdateUserGradeMutation = {
  updateUserGrade?:  {
    __typename: "UserGrade",
    id: string,
    userId: string,
    gradeId: string,
    user?:  {
      __typename: "User",
      id: string,
      email: string,
      name: string,
      role: UserRole,
      photo?: string | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    grade?:  {
      __typename: "Grade",
      id: string,
      name: string,
      description?: string | null,
      minAge?: number | null,
      maxAge?: number | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    assignedAt: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteUserGradeMutationVariables = {
  input: DeleteUserGradeInput,
  condition?: ModelUserGradeConditionInput | null,
};

export type DeleteUserGradeMutation = {
  deleteUserGrade?:  {
    __typename: "UserGrade",
    id: string,
    userId: string,
    gradeId: string,
    user?:  {
      __typename: "User",
      id: string,
      email: string,
      name: string,
      role: UserRole,
      photo?: string | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    grade?:  {
      __typename: "Grade",
      id: string,
      name: string,
      description?: string | null,
      minAge?: number | null,
      maxAge?: number | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    assignedAt: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateAcademicYearMutationVariables = {
  input: CreateAcademicYearInput,
  condition?: ModelAcademicYearConditionInput | null,
};

export type CreateAcademicYearMutation = {
  createAcademicYear?:  {
    __typename: "AcademicYear",
    id: string,
    gradeId: string,
    name: string,
    startDate: string,
    endDate: string,
    status: AcademicYearStatus,
    lessons?:  {
      __typename: "ModelLessonConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateAcademicYearMutationVariables = {
  input: UpdateAcademicYearInput,
  condition?: ModelAcademicYearConditionInput | null,
};

export type UpdateAcademicYearMutation = {
  updateAcademicYear?:  {
    __typename: "AcademicYear",
    id: string,
    gradeId: string,
    name: string,
    startDate: string,
    endDate: string,
    status: AcademicYearStatus,
    lessons?:  {
      __typename: "ModelLessonConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteAcademicYearMutationVariables = {
  input: DeleteAcademicYearInput,
  condition?: ModelAcademicYearConditionInput | null,
};

export type DeleteAcademicYearMutation = {
  deleteAcademicYear?:  {
    __typename: "AcademicYear",
    id: string,
    gradeId: string,
    name: string,
    startDate: string,
    endDate: string,
    status: AcademicYearStatus,
    lessons?:  {
      __typename: "ModelLessonConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateLessonMutationVariables = {
  input: CreateLessonInput,
  condition?: ModelLessonConditionInput | null,
};

export type CreateLessonMutation = {
  createLesson?:  {
    __typename: "Lesson",
    id: string,
    academicYearId: string,
    gradeId: string,
    teacherId: string,
    title: string,
    content?: string | null,
    lessonDate: string,
    order: number,
    homeworkChecks?:  {
      __typename: "ModelHomeworkCheckConnection",
      nextToken?: string | null,
    } | null,
    goldenVerses?:  {
      __typename: "ModelLessonGoldenVerseConnection",
      nextToken?: string | null,
    } | null,
    files?:  {
      __typename: "ModelLessonFileConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateLessonMutationVariables = {
  input: UpdateLessonInput,
  condition?: ModelLessonConditionInput | null,
};

export type UpdateLessonMutation = {
  updateLesson?:  {
    __typename: "Lesson",
    id: string,
    academicYearId: string,
    gradeId: string,
    teacherId: string,
    title: string,
    content?: string | null,
    lessonDate: string,
    order: number,
    homeworkChecks?:  {
      __typename: "ModelHomeworkCheckConnection",
      nextToken?: string | null,
    } | null,
    goldenVerses?:  {
      __typename: "ModelLessonGoldenVerseConnection",
      nextToken?: string | null,
    } | null,
    files?:  {
      __typename: "ModelLessonFileConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteLessonMutationVariables = {
  input: DeleteLessonInput,
  condition?: ModelLessonConditionInput | null,
};

export type DeleteLessonMutation = {
  deleteLesson?:  {
    __typename: "Lesson",
    id: string,
    academicYearId: string,
    gradeId: string,
    teacherId: string,
    title: string,
    content?: string | null,
    lessonDate: string,
    order: number,
    homeworkChecks?:  {
      __typename: "ModelHomeworkCheckConnection",
      nextToken?: string | null,
    } | null,
    goldenVerses?:  {
      __typename: "ModelLessonGoldenVerseConnection",
      nextToken?: string | null,
    } | null,
    files?:  {
      __typename: "ModelLessonFileConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateLessonFileMutationVariables = {
  input: CreateLessonFileInput,
  condition?: ModelLessonFileConditionInput | null,
};

export type CreateLessonFileMutation = {
  createLessonFile?:  {
    __typename: "LessonFile",
    id: string,
    lessonId: string,
    fileName: string,
    fileType: string,
    mimeType: string,
    fileSize: number,
    s3Key: string,
    s3Url: string,
    order: number,
    description?: string | null,
    lesson?:  {
      __typename: "Lesson",
      id: string,
      academicYearId: string,
      gradeId: string,
      teacherId: string,
      title: string,
      content?: string | null,
      lessonDate: string,
      order: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateLessonFileMutationVariables = {
  input: UpdateLessonFileInput,
  condition?: ModelLessonFileConditionInput | null,
};

export type UpdateLessonFileMutation = {
  updateLessonFile?:  {
    __typename: "LessonFile",
    id: string,
    lessonId: string,
    fileName: string,
    fileType: string,
    mimeType: string,
    fileSize: number,
    s3Key: string,
    s3Url: string,
    order: number,
    description?: string | null,
    lesson?:  {
      __typename: "Lesson",
      id: string,
      academicYearId: string,
      gradeId: string,
      teacherId: string,
      title: string,
      content?: string | null,
      lessonDate: string,
      order: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteLessonFileMutationVariables = {
  input: DeleteLessonFileInput,
  condition?: ModelLessonFileConditionInput | null,
};

export type DeleteLessonFileMutation = {
  deleteLessonFile?:  {
    __typename: "LessonFile",
    id: string,
    lessonId: string,
    fileName: string,
    fileType: string,
    mimeType: string,
    fileSize: number,
    s3Key: string,
    s3Url: string,
    order: number,
    description?: string | null,
    lesson?:  {
      __typename: "Lesson",
      id: string,
      academicYearId: string,
      gradeId: string,
      teacherId: string,
      title: string,
      content?: string | null,
      lessonDate: string,
      order: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateBookMutationVariables = {
  input: CreateBookInput,
  condition?: ModelBookConditionInput | null,
};

export type CreateBookMutation = {
  createBook?:  {
    __typename: "Book",
    id: string,
    fullName: string,
    shortName: string,
    abbreviation: string,
    testament: string,
    order: number,
    goldenVerses?:  {
      __typename: "ModelGoldenVerseConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateBookMutationVariables = {
  input: UpdateBookInput,
  condition?: ModelBookConditionInput | null,
};

export type UpdateBookMutation = {
  updateBook?:  {
    __typename: "Book",
    id: string,
    fullName: string,
    shortName: string,
    abbreviation: string,
    testament: string,
    order: number,
    goldenVerses?:  {
      __typename: "ModelGoldenVerseConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteBookMutationVariables = {
  input: DeleteBookInput,
  condition?: ModelBookConditionInput | null,
};

export type DeleteBookMutation = {
  deleteBook?:  {
    __typename: "Book",
    id: string,
    fullName: string,
    shortName: string,
    abbreviation: string,
    testament: string,
    order: number,
    goldenVerses?:  {
      __typename: "ModelGoldenVerseConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateGoldenVerseMutationVariables = {
  input: CreateGoldenVerseInput,
  condition?: ModelGoldenVerseConditionInput | null,
};

export type CreateGoldenVerseMutation = {
  createGoldenVerse?:  {
    __typename: "GoldenVerse",
    id: string,
    reference: string,
    bookId: string,
    chapter: number,
    verseStart: number,
    verseEnd?: number | null,
    text: string,
    book?:  {
      __typename: "Book",
      id: string,
      fullName: string,
      shortName: string,
      abbreviation: string,
      testament: string,
      order: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    lessons?:  {
      __typename: "ModelLessonGoldenVerseConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateGoldenVerseMutationVariables = {
  input: UpdateGoldenVerseInput,
  condition?: ModelGoldenVerseConditionInput | null,
};

export type UpdateGoldenVerseMutation = {
  updateGoldenVerse?:  {
    __typename: "GoldenVerse",
    id: string,
    reference: string,
    bookId: string,
    chapter: number,
    verseStart: number,
    verseEnd?: number | null,
    text: string,
    book?:  {
      __typename: "Book",
      id: string,
      fullName: string,
      shortName: string,
      abbreviation: string,
      testament: string,
      order: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    lessons?:  {
      __typename: "ModelLessonGoldenVerseConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteGoldenVerseMutationVariables = {
  input: DeleteGoldenVerseInput,
  condition?: ModelGoldenVerseConditionInput | null,
};

export type DeleteGoldenVerseMutation = {
  deleteGoldenVerse?:  {
    __typename: "GoldenVerse",
    id: string,
    reference: string,
    bookId: string,
    chapter: number,
    verseStart: number,
    verseEnd?: number | null,
    text: string,
    book?:  {
      __typename: "Book",
      id: string,
      fullName: string,
      shortName: string,
      abbreviation: string,
      testament: string,
      order: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    lessons?:  {
      __typename: "ModelLessonGoldenVerseConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateLessonGoldenVerseMutationVariables = {
  input: CreateLessonGoldenVerseInput,
  condition?: ModelLessonGoldenVerseConditionInput | null,
};

export type CreateLessonGoldenVerseMutation = {
  createLessonGoldenVerse?:  {
    __typename: "LessonGoldenVerse",
    id: string,
    lessonId: string,
    goldenVerseId: string,
    order: number,
    lesson?:  {
      __typename: "Lesson",
      id: string,
      academicYearId: string,
      gradeId: string,
      teacherId: string,
      title: string,
      content?: string | null,
      lessonDate: string,
      order: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    goldenVerse?:  {
      __typename: "GoldenVerse",
      id: string,
      reference: string,
      bookId: string,
      chapter: number,
      verseStart: number,
      verseEnd?: number | null,
      text: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateLessonGoldenVerseMutationVariables = {
  input: UpdateLessonGoldenVerseInput,
  condition?: ModelLessonGoldenVerseConditionInput | null,
};

export type UpdateLessonGoldenVerseMutation = {
  updateLessonGoldenVerse?:  {
    __typename: "LessonGoldenVerse",
    id: string,
    lessonId: string,
    goldenVerseId: string,
    order: number,
    lesson?:  {
      __typename: "Lesson",
      id: string,
      academicYearId: string,
      gradeId: string,
      teacherId: string,
      title: string,
      content?: string | null,
      lessonDate: string,
      order: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    goldenVerse?:  {
      __typename: "GoldenVerse",
      id: string,
      reference: string,
      bookId: string,
      chapter: number,
      verseStart: number,
      verseEnd?: number | null,
      text: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteLessonGoldenVerseMutationVariables = {
  input: DeleteLessonGoldenVerseInput,
  condition?: ModelLessonGoldenVerseConditionInput | null,
};

export type DeleteLessonGoldenVerseMutation = {
  deleteLessonGoldenVerse?:  {
    __typename: "LessonGoldenVerse",
    id: string,
    lessonId: string,
    goldenVerseId: string,
    order: number,
    lesson?:  {
      __typename: "Lesson",
      id: string,
      academicYearId: string,
      gradeId: string,
      teacherId: string,
      title: string,
      content?: string | null,
      lessonDate: string,
      order: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    goldenVerse?:  {
      __typename: "GoldenVerse",
      id: string,
      reference: string,
      bookId: string,
      chapter: number,
      verseStart: number,
      verseEnd?: number | null,
      text: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreatePupilMutationVariables = {
  input: CreatePupilInput,
  condition?: ModelPupilConditionInput | null,
};

export type CreatePupilMutation = {
  createPupil?:  {
    __typename: "Pupil",
    id: string,
    gradeId: string,
    firstName: string,
    lastName: string,
    middleName?: string | null,
    dateOfBirth: string,
    photo?: string | null,
    active: boolean,
    families?:  {
      __typename: "ModelFamilyMemberConnection",
      nextToken?: string | null,
    } | null,
    homeworkChecks?:  {
      __typename: "ModelHomeworkCheckConnection",
      nextToken?: string | null,
    } | null,
    achievements?:  {
      __typename: "ModelPupilAchievementConnection",
      nextToken?: string | null,
    } | null,
    bricksIssues?:  {
      __typename: "ModelBricksIssueConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdatePupilMutationVariables = {
  input: UpdatePupilInput,
  condition?: ModelPupilConditionInput | null,
};

export type UpdatePupilMutation = {
  updatePupil?:  {
    __typename: "Pupil",
    id: string,
    gradeId: string,
    firstName: string,
    lastName: string,
    middleName?: string | null,
    dateOfBirth: string,
    photo?: string | null,
    active: boolean,
    families?:  {
      __typename: "ModelFamilyMemberConnection",
      nextToken?: string | null,
    } | null,
    homeworkChecks?:  {
      __typename: "ModelHomeworkCheckConnection",
      nextToken?: string | null,
    } | null,
    achievements?:  {
      __typename: "ModelPupilAchievementConnection",
      nextToken?: string | null,
    } | null,
    bricksIssues?:  {
      __typename: "ModelBricksIssueConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeletePupilMutationVariables = {
  input: DeletePupilInput,
  condition?: ModelPupilConditionInput | null,
};

export type DeletePupilMutation = {
  deletePupil?:  {
    __typename: "Pupil",
    id: string,
    gradeId: string,
    firstName: string,
    lastName: string,
    middleName?: string | null,
    dateOfBirth: string,
    photo?: string | null,
    active: boolean,
    families?:  {
      __typename: "ModelFamilyMemberConnection",
      nextToken?: string | null,
    } | null,
    homeworkChecks?:  {
      __typename: "ModelHomeworkCheckConnection",
      nextToken?: string | null,
    } | null,
    achievements?:  {
      __typename: "ModelPupilAchievementConnection",
      nextToken?: string | null,
    } | null,
    bricksIssues?:  {
      __typename: "ModelBricksIssueConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateHomeworkCheckMutationVariables = {
  input: CreateHomeworkCheckInput,
  condition?: ModelHomeworkCheckConditionInput | null,
};

export type CreateHomeworkCheckMutation = {
  createHomeworkCheck?:  {
    __typename: "HomeworkCheck",
    id: string,
    lessonId: string,
    pupilId: string,
    gradeId: string,
    goldenVerse1Score?: number | null,
    goldenVerse2Score?: number | null,
    goldenVerse3Score?: number | null,
    testScore?: number | null,
    notebookScore?: number | null,
    singing: boolean,
    points: number,
    lesson?:  {
      __typename: "Lesson",
      id: string,
      academicYearId: string,
      gradeId: string,
      teacherId: string,
      title: string,
      content?: string | null,
      lessonDate: string,
      order: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    pupil?:  {
      __typename: "Pupil",
      id: string,
      gradeId: string,
      firstName: string,
      lastName: string,
      middleName?: string | null,
      dateOfBirth: string,
      photo?: string | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateHomeworkCheckMutationVariables = {
  input: UpdateHomeworkCheckInput,
  condition?: ModelHomeworkCheckConditionInput | null,
};

export type UpdateHomeworkCheckMutation = {
  updateHomeworkCheck?:  {
    __typename: "HomeworkCheck",
    id: string,
    lessonId: string,
    pupilId: string,
    gradeId: string,
    goldenVerse1Score?: number | null,
    goldenVerse2Score?: number | null,
    goldenVerse3Score?: number | null,
    testScore?: number | null,
    notebookScore?: number | null,
    singing: boolean,
    points: number,
    lesson?:  {
      __typename: "Lesson",
      id: string,
      academicYearId: string,
      gradeId: string,
      teacherId: string,
      title: string,
      content?: string | null,
      lessonDate: string,
      order: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    pupil?:  {
      __typename: "Pupil",
      id: string,
      gradeId: string,
      firstName: string,
      lastName: string,
      middleName?: string | null,
      dateOfBirth: string,
      photo?: string | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteHomeworkCheckMutationVariables = {
  input: DeleteHomeworkCheckInput,
  condition?: ModelHomeworkCheckConditionInput | null,
};

export type DeleteHomeworkCheckMutation = {
  deleteHomeworkCheck?:  {
    __typename: "HomeworkCheck",
    id: string,
    lessonId: string,
    pupilId: string,
    gradeId: string,
    goldenVerse1Score?: number | null,
    goldenVerse2Score?: number | null,
    goldenVerse3Score?: number | null,
    testScore?: number | null,
    notebookScore?: number | null,
    singing: boolean,
    points: number,
    lesson?:  {
      __typename: "Lesson",
      id: string,
      academicYearId: string,
      gradeId: string,
      teacherId: string,
      title: string,
      content?: string | null,
      lessonDate: string,
      order: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    pupil?:  {
      __typename: "Pupil",
      id: string,
      gradeId: string,
      firstName: string,
      lastName: string,
      middleName?: string | null,
      dateOfBirth: string,
      photo?: string | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateAchievementMutationVariables = {
  input: CreateAchievementInput,
  condition?: ModelAchievementConditionInput | null,
};

export type CreateAchievementMutation = {
  createAchievement?:  {
    __typename: "Achievement",
    id: string,
    name: string,
    description: string,
    icon?: string | null,
    criteria: string,
    pupils?:  {
      __typename: "ModelPupilAchievementConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateAchievementMutationVariables = {
  input: UpdateAchievementInput,
  condition?: ModelAchievementConditionInput | null,
};

export type UpdateAchievementMutation = {
  updateAchievement?:  {
    __typename: "Achievement",
    id: string,
    name: string,
    description: string,
    icon?: string | null,
    criteria: string,
    pupils?:  {
      __typename: "ModelPupilAchievementConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteAchievementMutationVariables = {
  input: DeleteAchievementInput,
  condition?: ModelAchievementConditionInput | null,
};

export type DeleteAchievementMutation = {
  deleteAchievement?:  {
    __typename: "Achievement",
    id: string,
    name: string,
    description: string,
    icon?: string | null,
    criteria: string,
    pupils?:  {
      __typename: "ModelPupilAchievementConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreatePupilAchievementMutationVariables = {
  input: CreatePupilAchievementInput,
  condition?: ModelPupilAchievementConditionInput | null,
};

export type CreatePupilAchievementMutation = {
  createPupilAchievement?:  {
    __typename: "PupilAchievement",
    id: string,
    pupilId: string,
    achievementId: string,
    awardedAt: string,
    pupil?:  {
      __typename: "Pupil",
      id: string,
      gradeId: string,
      firstName: string,
      lastName: string,
      middleName?: string | null,
      dateOfBirth: string,
      photo?: string | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    achievement?:  {
      __typename: "Achievement",
      id: string,
      name: string,
      description: string,
      icon?: string | null,
      criteria: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdatePupilAchievementMutationVariables = {
  input: UpdatePupilAchievementInput,
  condition?: ModelPupilAchievementConditionInput | null,
};

export type UpdatePupilAchievementMutation = {
  updatePupilAchievement?:  {
    __typename: "PupilAchievement",
    id: string,
    pupilId: string,
    achievementId: string,
    awardedAt: string,
    pupil?:  {
      __typename: "Pupil",
      id: string,
      gradeId: string,
      firstName: string,
      lastName: string,
      middleName?: string | null,
      dateOfBirth: string,
      photo?: string | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    achievement?:  {
      __typename: "Achievement",
      id: string,
      name: string,
      description: string,
      icon?: string | null,
      criteria: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeletePupilAchievementMutationVariables = {
  input: DeletePupilAchievementInput,
  condition?: ModelPupilAchievementConditionInput | null,
};

export type DeletePupilAchievementMutation = {
  deletePupilAchievement?:  {
    __typename: "PupilAchievement",
    id: string,
    pupilId: string,
    achievementId: string,
    awardedAt: string,
    pupil?:  {
      __typename: "Pupil",
      id: string,
      gradeId: string,
      firstName: string,
      lastName: string,
      middleName?: string | null,
      dateOfBirth: string,
      photo?: string | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    achievement?:  {
      __typename: "Achievement",
      id: string,
      name: string,
      description: string,
      icon?: string | null,
      criteria: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateBricksIssueMutationVariables = {
  input: CreateBricksIssueInput,
  condition?: ModelBricksIssueConditionInput | null,
};

export type CreateBricksIssueMutation = {
  createBricksIssue?:  {
    __typename: "BricksIssue",
    id: string,
    pupilId: string,
    academicYearId: string,
    gradeId: string,
    quantity: number,
    issuedAt: string,
    issuedBy: string,
    pupil?:  {
      __typename: "Pupil",
      id: string,
      gradeId: string,
      firstName: string,
      lastName: string,
      middleName?: string | null,
      dateOfBirth: string,
      photo?: string | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateBricksIssueMutationVariables = {
  input: UpdateBricksIssueInput,
  condition?: ModelBricksIssueConditionInput | null,
};

export type UpdateBricksIssueMutation = {
  updateBricksIssue?:  {
    __typename: "BricksIssue",
    id: string,
    pupilId: string,
    academicYearId: string,
    gradeId: string,
    quantity: number,
    issuedAt: string,
    issuedBy: string,
    pupil?:  {
      __typename: "Pupil",
      id: string,
      gradeId: string,
      firstName: string,
      lastName: string,
      middleName?: string | null,
      dateOfBirth: string,
      photo?: string | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteBricksIssueMutationVariables = {
  input: DeleteBricksIssueInput,
  condition?: ModelBricksIssueConditionInput | null,
};

export type DeleteBricksIssueMutation = {
  deleteBricksIssue?:  {
    __typename: "BricksIssue",
    id: string,
    pupilId: string,
    academicYearId: string,
    gradeId: string,
    quantity: number,
    issuedAt: string,
    issuedBy: string,
    pupil?:  {
      __typename: "Pupil",
      id: string,
      gradeId: string,
      firstName: string,
      lastName: string,
      middleName?: string | null,
      dateOfBirth: string,
      photo?: string | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateFamilyMutationVariables = {
  input: CreateFamilyInput,
  condition?: ModelFamilyConditionInput | null,
};

export type CreateFamilyMutation = {
  createFamily?:  {
    __typename: "Family",
    id: string,
    name: string,
    phone?: string | null,
    email?: string | null,
    address?: string | null,
    motherFirstName?: string | null,
    motherLastName?: string | null,
    motherMiddleName?: string | null,
    motherPhone?: string | null,
    fatherFirstName?: string | null,
    fatherLastName?: string | null,
    fatherMiddleName?: string | null,
    fatherPhone?: string | null,
    members?:  {
      __typename: "ModelFamilyMemberConnection",
      nextToken?: string | null,
    } | null,
    userFamilies?:  {
      __typename: "ModelUserFamilyConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateFamilyMutationVariables = {
  input: UpdateFamilyInput,
  condition?: ModelFamilyConditionInput | null,
};

export type UpdateFamilyMutation = {
  updateFamily?:  {
    __typename: "Family",
    id: string,
    name: string,
    phone?: string | null,
    email?: string | null,
    address?: string | null,
    motherFirstName?: string | null,
    motherLastName?: string | null,
    motherMiddleName?: string | null,
    motherPhone?: string | null,
    fatherFirstName?: string | null,
    fatherLastName?: string | null,
    fatherMiddleName?: string | null,
    fatherPhone?: string | null,
    members?:  {
      __typename: "ModelFamilyMemberConnection",
      nextToken?: string | null,
    } | null,
    userFamilies?:  {
      __typename: "ModelUserFamilyConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteFamilyMutationVariables = {
  input: DeleteFamilyInput,
  condition?: ModelFamilyConditionInput | null,
};

export type DeleteFamilyMutation = {
  deleteFamily?:  {
    __typename: "Family",
    id: string,
    name: string,
    phone?: string | null,
    email?: string | null,
    address?: string | null,
    motherFirstName?: string | null,
    motherLastName?: string | null,
    motherMiddleName?: string | null,
    motherPhone?: string | null,
    fatherFirstName?: string | null,
    fatherLastName?: string | null,
    fatherMiddleName?: string | null,
    fatherPhone?: string | null,
    members?:  {
      __typename: "ModelFamilyMemberConnection",
      nextToken?: string | null,
    } | null,
    userFamilies?:  {
      __typename: "ModelUserFamilyConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateFamilyMemberMutationVariables = {
  input: CreateFamilyMemberInput,
  condition?: ModelFamilyMemberConditionInput | null,
};

export type CreateFamilyMemberMutation = {
  createFamilyMember?:  {
    __typename: "FamilyMember",
    id: string,
    familyId: string,
    pupilId: string,
    family?:  {
      __typename: "Family",
      id: string,
      name: string,
      phone?: string | null,
      email?: string | null,
      address?: string | null,
      motherFirstName?: string | null,
      motherLastName?: string | null,
      motherMiddleName?: string | null,
      motherPhone?: string | null,
      fatherFirstName?: string | null,
      fatherLastName?: string | null,
      fatherMiddleName?: string | null,
      fatherPhone?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    pupil?:  {
      __typename: "Pupil",
      id: string,
      gradeId: string,
      firstName: string,
      lastName: string,
      middleName?: string | null,
      dateOfBirth: string,
      photo?: string | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateFamilyMemberMutationVariables = {
  input: UpdateFamilyMemberInput,
  condition?: ModelFamilyMemberConditionInput | null,
};

export type UpdateFamilyMemberMutation = {
  updateFamilyMember?:  {
    __typename: "FamilyMember",
    id: string,
    familyId: string,
    pupilId: string,
    family?:  {
      __typename: "Family",
      id: string,
      name: string,
      phone?: string | null,
      email?: string | null,
      address?: string | null,
      motherFirstName?: string | null,
      motherLastName?: string | null,
      motherMiddleName?: string | null,
      motherPhone?: string | null,
      fatherFirstName?: string | null,
      fatherLastName?: string | null,
      fatherMiddleName?: string | null,
      fatherPhone?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    pupil?:  {
      __typename: "Pupil",
      id: string,
      gradeId: string,
      firstName: string,
      lastName: string,
      middleName?: string | null,
      dateOfBirth: string,
      photo?: string | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteFamilyMemberMutationVariables = {
  input: DeleteFamilyMemberInput,
  condition?: ModelFamilyMemberConditionInput | null,
};

export type DeleteFamilyMemberMutation = {
  deleteFamilyMember?:  {
    __typename: "FamilyMember",
    id: string,
    familyId: string,
    pupilId: string,
    family?:  {
      __typename: "Family",
      id: string,
      name: string,
      phone?: string | null,
      email?: string | null,
      address?: string | null,
      motherFirstName?: string | null,
      motherLastName?: string | null,
      motherMiddleName?: string | null,
      motherPhone?: string | null,
      fatherFirstName?: string | null,
      fatherLastName?: string | null,
      fatherMiddleName?: string | null,
      fatherPhone?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    pupil?:  {
      __typename: "Pupil",
      id: string,
      gradeId: string,
      firstName: string,
      lastName: string,
      middleName?: string | null,
      dateOfBirth: string,
      photo?: string | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateUserFamilyMutationVariables = {
  input: CreateUserFamilyInput,
  condition?: ModelUserFamilyConditionInput | null,
};

export type CreateUserFamilyMutation = {
  createUserFamily?:  {
    __typename: "UserFamily",
    id: string,
    userId: string,
    familyId: string,
    phone: string,
    user?:  {
      __typename: "User",
      id: string,
      email: string,
      name: string,
      role: UserRole,
      photo?: string | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    family?:  {
      __typename: "Family",
      id: string,
      name: string,
      phone?: string | null,
      email?: string | null,
      address?: string | null,
      motherFirstName?: string | null,
      motherLastName?: string | null,
      motherMiddleName?: string | null,
      motherPhone?: string | null,
      fatherFirstName?: string | null,
      fatherLastName?: string | null,
      fatherMiddleName?: string | null,
      fatherPhone?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateUserFamilyMutationVariables = {
  input: UpdateUserFamilyInput,
  condition?: ModelUserFamilyConditionInput | null,
};

export type UpdateUserFamilyMutation = {
  updateUserFamily?:  {
    __typename: "UserFamily",
    id: string,
    userId: string,
    familyId: string,
    phone: string,
    user?:  {
      __typename: "User",
      id: string,
      email: string,
      name: string,
      role: UserRole,
      photo?: string | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    family?:  {
      __typename: "Family",
      id: string,
      name: string,
      phone?: string | null,
      email?: string | null,
      address?: string | null,
      motherFirstName?: string | null,
      motherLastName?: string | null,
      motherMiddleName?: string | null,
      motherPhone?: string | null,
      fatherFirstName?: string | null,
      fatherLastName?: string | null,
      fatherMiddleName?: string | null,
      fatherPhone?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteUserFamilyMutationVariables = {
  input: DeleteUserFamilyInput,
  condition?: ModelUserFamilyConditionInput | null,
};

export type DeleteUserFamilyMutation = {
  deleteUserFamily?:  {
    __typename: "UserFamily",
    id: string,
    userId: string,
    familyId: string,
    phone: string,
    user?:  {
      __typename: "User",
      id: string,
      email: string,
      name: string,
      role: UserRole,
      photo?: string | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    family?:  {
      __typename: "Family",
      id: string,
      name: string,
      phone?: string | null,
      email?: string | null,
      address?: string | null,
      motherFirstName?: string | null,
      motherLastName?: string | null,
      motherMiddleName?: string | null,
      motherPhone?: string | null,
      fatherFirstName?: string | null,
      fatherLastName?: string | null,
      fatherMiddleName?: string | null,
      fatherPhone?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateGradeEventMutationVariables = {
  input: CreateGradeEventInput,
  condition?: ModelGradeEventConditionInput | null,
};

export type CreateGradeEventMutation = {
  createGradeEvent?:  {
    __typename: "GradeEvent",
    id: string,
    gradeId: string,
    eventType: GradeEventType,
    title: string,
    description?: string | null,
    eventDate: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateGradeEventMutationVariables = {
  input: UpdateGradeEventInput,
  condition?: ModelGradeEventConditionInput | null,
};

export type UpdateGradeEventMutation = {
  updateGradeEvent?:  {
    __typename: "GradeEvent",
    id: string,
    gradeId: string,
    eventType: GradeEventType,
    title: string,
    description?: string | null,
    eventDate: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteGradeEventMutationVariables = {
  input: DeleteGradeEventInput,
  condition?: ModelGradeEventConditionInput | null,
};

export type DeleteGradeEventMutation = {
  deleteGradeEvent?:  {
    __typename: "GradeEvent",
    id: string,
    gradeId: string,
    eventType: GradeEventType,
    title: string,
    description?: string | null,
    eventDate: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateGradeSettingsMutationVariables = {
  input: CreateGradeSettingsInput,
  condition?: ModelGradeSettingsConditionInput | null,
};

export type CreateGradeSettingsMutation = {
  createGradeSettings?:  {
    __typename: "GradeSettings",
    id: string,
    gradeId: string,
    enableGoldenVerse: boolean,
    enableTest: boolean,
    enableNotebook: boolean,
    enableSinging: boolean,
    pointsGoldenVerse: number,
    pointsTest: number,
    pointsNotebook: number,
    pointsSinging: number,
    labelGoldenVerse: string,
    labelTest: string,
    labelNotebook: string,
    labelSinging: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateGradeSettingsMutationVariables = {
  input: UpdateGradeSettingsInput,
  condition?: ModelGradeSettingsConditionInput | null,
};

export type UpdateGradeSettingsMutation = {
  updateGradeSettings?:  {
    __typename: "GradeSettings",
    id: string,
    gradeId: string,
    enableGoldenVerse: boolean,
    enableTest: boolean,
    enableNotebook: boolean,
    enableSinging: boolean,
    pointsGoldenVerse: number,
    pointsTest: number,
    pointsNotebook: number,
    pointsSinging: number,
    labelGoldenVerse: string,
    labelTest: string,
    labelNotebook: string,
    labelSinging: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteGradeSettingsMutationVariables = {
  input: DeleteGradeSettingsInput,
  condition?: ModelGradeSettingsConditionInput | null,
};

export type DeleteGradeSettingsMutation = {
  deleteGradeSettings?:  {
    __typename: "GradeSettings",
    id: string,
    gradeId: string,
    enableGoldenVerse: boolean,
    enableTest: boolean,
    enableNotebook: boolean,
    enableSinging: boolean,
    pointsGoldenVerse: number,
    pointsTest: number,
    pointsNotebook: number,
    pointsSinging: number,
    labelGoldenVerse: string,
    labelTest: string,
    labelNotebook: string,
    labelSinging: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetUserQueryVariables = {
  id: string,
};

export type GetUserQuery = {
  getUser?:  {
    __typename: "User",
    id: string,
    email: string,
    name: string,
    role: UserRole,
    photo?: string | null,
    active: boolean,
    userGrades?:  {
      __typename: "ModelUserGradeConnection",
      nextToken?: string | null,
    } | null,
    createdLessons?:  {
      __typename: "ModelLessonConnection",
      nextToken?: string | null,
    } | null,
    userFamilies?:  {
      __typename: "ModelUserFamilyConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListUsersQueryVariables = {
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUsersQuery = {
  listUsers?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      email: string,
      name: string,
      role: UserRole,
      photo?: string | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetGradeQueryVariables = {
  id: string,
};

export type GetGradeQuery = {
  getGrade?:  {
    __typename: "Grade",
    id: string,
    name: string,
    description?: string | null,
    minAge?: number | null,
    maxAge?: number | null,
    active: boolean,
    teachers?:  {
      __typename: "ModelUserGradeConnection",
      nextToken?: string | null,
    } | null,
    academicYears?:  {
      __typename: "ModelAcademicYearConnection",
      nextToken?: string | null,
    } | null,
    pupils?:  {
      __typename: "ModelPupilConnection",
      nextToken?: string | null,
    } | null,
    events?:  {
      __typename: "ModelGradeEventConnection",
      nextToken?: string | null,
    } | null,
    settings?:  {
      __typename: "GradeSettings",
      id: string,
      gradeId: string,
      enableGoldenVerse: boolean,
      enableTest: boolean,
      enableNotebook: boolean,
      enableSinging: boolean,
      pointsGoldenVerse: number,
      pointsTest: number,
      pointsNotebook: number,
      pointsSinging: number,
      labelGoldenVerse: string,
      labelTest: string,
      labelNotebook: string,
      labelSinging: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListGradesQueryVariables = {
  filter?: ModelGradeFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListGradesQuery = {
  listGrades?:  {
    __typename: "ModelGradeConnection",
    items:  Array< {
      __typename: "Grade",
      id: string,
      name: string,
      description?: string | null,
      minAge?: number | null,
      maxAge?: number | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetAcademicYearQueryVariables = {
  id: string,
};

export type GetAcademicYearQuery = {
  getAcademicYear?:  {
    __typename: "AcademicYear",
    id: string,
    gradeId: string,
    name: string,
    startDate: string,
    endDate: string,
    status: AcademicYearStatus,
    lessons?:  {
      __typename: "ModelLessonConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListAcademicYearsQueryVariables = {
  filter?: ModelAcademicYearFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListAcademicYearsQuery = {
  listAcademicYears?:  {
    __typename: "ModelAcademicYearConnection",
    items:  Array< {
      __typename: "AcademicYear",
      id: string,
      gradeId: string,
      name: string,
      startDate: string,
      endDate: string,
      status: AcademicYearStatus,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetLessonQueryVariables = {
  id: string,
};

export type GetLessonQuery = {
  getLesson?:  {
    __typename: "Lesson",
    id: string,
    academicYearId: string,
    gradeId: string,
    teacherId: string,
    title: string,
    content?: string | null,
    lessonDate: string,
    order: number,
    homeworkChecks?:  {
      __typename: "ModelHomeworkCheckConnection",
      nextToken?: string | null,
    } | null,
    goldenVerses?:  {
      __typename: "ModelLessonGoldenVerseConnection",
      nextToken?: string | null,
    } | null,
    files?:  {
      __typename: "ModelLessonFileConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListLessonsQueryVariables = {
  filter?: ModelLessonFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListLessonsQuery = {
  listLessons?:  {
    __typename: "ModelLessonConnection",
    items:  Array< {
      __typename: "Lesson",
      id: string,
      academicYearId: string,
      gradeId: string,
      teacherId: string,
      title: string,
      content?: string | null,
      lessonDate: string,
      order: number,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetBookQueryVariables = {
  id: string,
};

export type GetBookQuery = {
  getBook?:  {
    __typename: "Book",
    id: string,
    fullName: string,
    shortName: string,
    abbreviation: string,
    testament: string,
    order: number,
    goldenVerses?:  {
      __typename: "ModelGoldenVerseConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListBooksQueryVariables = {
  filter?: ModelBookFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListBooksQuery = {
  listBooks?:  {
    __typename: "ModelBookConnection",
    items:  Array< {
      __typename: "Book",
      id: string,
      fullName: string,
      shortName: string,
      abbreviation: string,
      testament: string,
      order: number,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetGoldenVerseQueryVariables = {
  id: string,
};

export type GetGoldenVerseQuery = {
  getGoldenVerse?:  {
    __typename: "GoldenVerse",
    id: string,
    reference: string,
    bookId: string,
    chapter: number,
    verseStart: number,
    verseEnd?: number | null,
    text: string,
    book?:  {
      __typename: "Book",
      id: string,
      fullName: string,
      shortName: string,
      abbreviation: string,
      testament: string,
      order: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    lessons?:  {
      __typename: "ModelLessonGoldenVerseConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListGoldenVersesQueryVariables = {
  filter?: ModelGoldenVerseFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListGoldenVersesQuery = {
  listGoldenVerses?:  {
    __typename: "ModelGoldenVerseConnection",
    items:  Array< {
      __typename: "GoldenVerse",
      id: string,
      reference: string,
      bookId: string,
      chapter: number,
      verseStart: number,
      verseEnd?: number | null,
      text: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetPupilQueryVariables = {
  id: string,
};

export type GetPupilQuery = {
  getPupil?:  {
    __typename: "Pupil",
    id: string,
    gradeId: string,
    firstName: string,
    lastName: string,
    middleName?: string | null,
    dateOfBirth: string,
    photo?: string | null,
    active: boolean,
    families?:  {
      __typename: "ModelFamilyMemberConnection",
      nextToken?: string | null,
    } | null,
    homeworkChecks?:  {
      __typename: "ModelHomeworkCheckConnection",
      nextToken?: string | null,
    } | null,
    achievements?:  {
      __typename: "ModelPupilAchievementConnection",
      nextToken?: string | null,
    } | null,
    bricksIssues?:  {
      __typename: "ModelBricksIssueConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListPupilsQueryVariables = {
  filter?: ModelPupilFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPupilsQuery = {
  listPupils?:  {
    __typename: "ModelPupilConnection",
    items:  Array< {
      __typename: "Pupil",
      id: string,
      gradeId: string,
      firstName: string,
      lastName: string,
      middleName?: string | null,
      dateOfBirth: string,
      photo?: string | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetHomeworkCheckQueryVariables = {
  id: string,
};

export type GetHomeworkCheckQuery = {
  getHomeworkCheck?:  {
    __typename: "HomeworkCheck",
    id: string,
    lessonId: string,
    pupilId: string,
    gradeId: string,
    goldenVerse1Score?: number | null,
    goldenVerse2Score?: number | null,
    goldenVerse3Score?: number | null,
    testScore?: number | null,
    notebookScore?: number | null,
    singing: boolean,
    points: number,
    lesson?:  {
      __typename: "Lesson",
      id: string,
      academicYearId: string,
      gradeId: string,
      teacherId: string,
      title: string,
      content?: string | null,
      lessonDate: string,
      order: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    pupil?:  {
      __typename: "Pupil",
      id: string,
      gradeId: string,
      firstName: string,
      lastName: string,
      middleName?: string | null,
      dateOfBirth: string,
      photo?: string | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListHomeworkChecksQueryVariables = {
  filter?: ModelHomeworkCheckFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListHomeworkChecksQuery = {
  listHomeworkChecks?:  {
    __typename: "ModelHomeworkCheckConnection",
    items:  Array< {
      __typename: "HomeworkCheck",
      id: string,
      lessonId: string,
      pupilId: string,
      gradeId: string,
      goldenVerse1Score?: number | null,
      goldenVerse2Score?: number | null,
      goldenVerse3Score?: number | null,
      testScore?: number | null,
      notebookScore?: number | null,
      singing: boolean,
      points: number,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetAchievementQueryVariables = {
  id: string,
};

export type GetAchievementQuery = {
  getAchievement?:  {
    __typename: "Achievement",
    id: string,
    name: string,
    description: string,
    icon?: string | null,
    criteria: string,
    pupils?:  {
      __typename: "ModelPupilAchievementConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListAchievementsQueryVariables = {
  filter?: ModelAchievementFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListAchievementsQuery = {
  listAchievements?:  {
    __typename: "ModelAchievementConnection",
    items:  Array< {
      __typename: "Achievement",
      id: string,
      name: string,
      description: string,
      icon?: string | null,
      criteria: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetBricksIssueQueryVariables = {
  id: string,
};

export type GetBricksIssueQuery = {
  getBricksIssue?:  {
    __typename: "BricksIssue",
    id: string,
    pupilId: string,
    academicYearId: string,
    gradeId: string,
    quantity: number,
    issuedAt: string,
    issuedBy: string,
    pupil?:  {
      __typename: "Pupil",
      id: string,
      gradeId: string,
      firstName: string,
      lastName: string,
      middleName?: string | null,
      dateOfBirth: string,
      photo?: string | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListBricksIssuesQueryVariables = {
  filter?: ModelBricksIssueFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListBricksIssuesQuery = {
  listBricksIssues?:  {
    __typename: "ModelBricksIssueConnection",
    items:  Array< {
      __typename: "BricksIssue",
      id: string,
      pupilId: string,
      academicYearId: string,
      gradeId: string,
      quantity: number,
      issuedAt: string,
      issuedBy: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetFamilyQueryVariables = {
  id: string,
};

export type GetFamilyQuery = {
  getFamily?:  {
    __typename: "Family",
    id: string,
    name: string,
    phone?: string | null,
    email?: string | null,
    address?: string | null,
    motherFirstName?: string | null,
    motherLastName?: string | null,
    motherMiddleName?: string | null,
    motherPhone?: string | null,
    fatherFirstName?: string | null,
    fatherLastName?: string | null,
    fatherMiddleName?: string | null,
    fatherPhone?: string | null,
    members?:  {
      __typename: "ModelFamilyMemberConnection",
      nextToken?: string | null,
    } | null,
    userFamilies?:  {
      __typename: "ModelUserFamilyConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListFamiliesQueryVariables = {
  filter?: ModelFamilyFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListFamiliesQuery = {
  listFamilies?:  {
    __typename: "ModelFamilyConnection",
    items:  Array< {
      __typename: "Family",
      id: string,
      name: string,
      phone?: string | null,
      email?: string | null,
      address?: string | null,
      motherFirstName?: string | null,
      motherLastName?: string | null,
      motherMiddleName?: string | null,
      motherPhone?: string | null,
      fatherFirstName?: string | null,
      fatherLastName?: string | null,
      fatherMiddleName?: string | null,
      fatherPhone?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetGradeEventQueryVariables = {
  id: string,
};

export type GetGradeEventQuery = {
  getGradeEvent?:  {
    __typename: "GradeEvent",
    id: string,
    gradeId: string,
    eventType: GradeEventType,
    title: string,
    description?: string | null,
    eventDate: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListGradeEventsQueryVariables = {
  filter?: ModelGradeEventFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListGradeEventsQuery = {
  listGradeEvents?:  {
    __typename: "ModelGradeEventConnection",
    items:  Array< {
      __typename: "GradeEvent",
      id: string,
      gradeId: string,
      eventType: GradeEventType,
      title: string,
      description?: string | null,
      eventDate: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetGradeSettingsQueryVariables = {
  id: string,
};

export type GetGradeSettingsQuery = {
  getGradeSettings?:  {
    __typename: "GradeSettings",
    id: string,
    gradeId: string,
    enableGoldenVerse: boolean,
    enableTest: boolean,
    enableNotebook: boolean,
    enableSinging: boolean,
    pointsGoldenVerse: number,
    pointsTest: number,
    pointsNotebook: number,
    pointsSinging: number,
    labelGoldenVerse: string,
    labelTest: string,
    labelNotebook: string,
    labelSinging: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListGradeSettingsQueryVariables = {
  filter?: ModelGradeSettingsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListGradeSettingsQuery = {
  listGradeSettings?:  {
    __typename: "ModelGradeSettingsConnection",
    items:  Array< {
      __typename: "GradeSettings",
      id: string,
      gradeId: string,
      enableGoldenVerse: boolean,
      enableTest: boolean,
      enableNotebook: boolean,
      enableSinging: boolean,
      pointsGoldenVerse: number,
      pointsTest: number,
      pointsNotebook: number,
      pointsSinging: number,
      labelGoldenVerse: string,
      labelTest: string,
      labelNotebook: string,
      labelSinging: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UsersByEmailQueryVariables = {
  email: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UsersByEmailQuery = {
  usersByEmail?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      email: string,
      name: string,
      role: UserRole,
      photo?: string | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UsersByRoleAndCreatedAtQueryVariables = {
  role: UserRole,
  createdAt?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UsersByRoleAndCreatedAtQuery = {
  usersByRoleAndCreatedAt?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      email: string,
      name: string,
      role: UserRole,
      photo?: string | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UserGradesByUserIdAndGradeIdQueryVariables = {
  userId: string,
  gradeId?: ModelIDKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserGradeFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UserGradesByUserIdAndGradeIdQuery = {
  userGradesByUserIdAndGradeId?:  {
    __typename: "ModelUserGradeConnection",
    items:  Array< {
      __typename: "UserGrade",
      id: string,
      userId: string,
      gradeId: string,
      assignedAt: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UserGradesByGradeIdAndUserIdQueryVariables = {
  gradeId: string,
  userId?: ModelIDKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserGradeFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UserGradesByGradeIdAndUserIdQuery = {
  userGradesByGradeIdAndUserId?:  {
    __typename: "ModelUserGradeConnection",
    items:  Array< {
      __typename: "UserGrade",
      id: string,
      userId: string,
      gradeId: string,
      assignedAt: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type AcademicYearsByGradeIdAndStartDateQueryVariables = {
  gradeId: string,
  startDate?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelAcademicYearFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type AcademicYearsByGradeIdAndStartDateQuery = {
  academicYearsByGradeIdAndStartDate?:  {
    __typename: "ModelAcademicYearConnection",
    items:  Array< {
      __typename: "AcademicYear",
      id: string,
      gradeId: string,
      name: string,
      startDate: string,
      endDate: string,
      status: AcademicYearStatus,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type AcademicYearsByStatusAndGradeIdQueryVariables = {
  status: AcademicYearStatus,
  gradeId?: ModelIDKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelAcademicYearFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type AcademicYearsByStatusAndGradeIdQuery = {
  academicYearsByStatusAndGradeId?:  {
    __typename: "ModelAcademicYearConnection",
    items:  Array< {
      __typename: "AcademicYear",
      id: string,
      gradeId: string,
      name: string,
      startDate: string,
      endDate: string,
      status: AcademicYearStatus,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type LessonsByAcademicYearIdAndLessonDateQueryVariables = {
  academicYearId: string,
  lessonDate?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelLessonFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type LessonsByAcademicYearIdAndLessonDateQuery = {
  lessonsByAcademicYearIdAndLessonDate?:  {
    __typename: "ModelLessonConnection",
    items:  Array< {
      __typename: "Lesson",
      id: string,
      academicYearId: string,
      gradeId: string,
      teacherId: string,
      title: string,
      content?: string | null,
      lessonDate: string,
      order: number,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type LessonsByGradeIdAndLessonDateQueryVariables = {
  gradeId: string,
  lessonDate?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelLessonFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type LessonsByGradeIdAndLessonDateQuery = {
  lessonsByGradeIdAndLessonDate?:  {
    __typename: "ModelLessonConnection",
    items:  Array< {
      __typename: "Lesson",
      id: string,
      academicYearId: string,
      gradeId: string,
      teacherId: string,
      title: string,
      content?: string | null,
      lessonDate: string,
      order: number,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type LessonsByTeacherIdAndCreatedAtQueryVariables = {
  teacherId: string,
  createdAt?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelLessonFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type LessonsByTeacherIdAndCreatedAtQuery = {
  lessonsByTeacherIdAndCreatedAt?:  {
    __typename: "ModelLessonConnection",
    items:  Array< {
      __typename: "Lesson",
      id: string,
      academicYearId: string,
      gradeId: string,
      teacherId: string,
      title: string,
      content?: string | null,
      lessonDate: string,
      order: number,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type LessonFilesByLessonIdAndOrderQueryVariables = {
  lessonId: string,
  order?: ModelIntKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelLessonFileFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type LessonFilesByLessonIdAndOrderQuery = {
  lessonFilesByLessonIdAndOrder?:  {
    __typename: "ModelLessonFileConnection",
    items:  Array< {
      __typename: "LessonFile",
      id: string,
      lessonId: string,
      fileName: string,
      fileType: string,
      mimeType: string,
      fileSize: number,
      s3Key: string,
      s3Url: string,
      order: number,
      description?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type BooksByShortNameQueryVariables = {
  shortName: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelBookFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type BooksByShortNameQuery = {
  booksByShortName?:  {
    __typename: "ModelBookConnection",
    items:  Array< {
      __typename: "Book",
      id: string,
      fullName: string,
      shortName: string,
      abbreviation: string,
      testament: string,
      order: number,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type BooksByTestamentAndOrderQueryVariables = {
  testament: string,
  order?: ModelIntKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelBookFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type BooksByTestamentAndOrderQuery = {
  booksByTestamentAndOrder?:  {
    __typename: "ModelBookConnection",
    items:  Array< {
      __typename: "Book",
      id: string,
      fullName: string,
      shortName: string,
      abbreviation: string,
      testament: string,
      order: number,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GoldenVersesByReferenceQueryVariables = {
  reference: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelGoldenVerseFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type GoldenVersesByReferenceQuery = {
  goldenVersesByReference?:  {
    __typename: "ModelGoldenVerseConnection",
    items:  Array< {
      __typename: "GoldenVerse",
      id: string,
      reference: string,
      bookId: string,
      chapter: number,
      verseStart: number,
      verseEnd?: number | null,
      text: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GoldenVersesByBookIdAndChapterQueryVariables = {
  bookId: string,
  chapter?: ModelIntKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelGoldenVerseFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type GoldenVersesByBookIdAndChapterQuery = {
  goldenVersesByBookIdAndChapter?:  {
    __typename: "ModelGoldenVerseConnection",
    items:  Array< {
      __typename: "GoldenVerse",
      id: string,
      reference: string,
      bookId: string,
      chapter: number,
      verseStart: number,
      verseEnd?: number | null,
      text: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type LessonGoldenVersesByLessonIdAndOrderQueryVariables = {
  lessonId: string,
  order?: ModelIntKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelLessonGoldenVerseFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type LessonGoldenVersesByLessonIdAndOrderQuery = {
  lessonGoldenVersesByLessonIdAndOrder?:  {
    __typename: "ModelLessonGoldenVerseConnection",
    items:  Array< {
      __typename: "LessonGoldenVerse",
      id: string,
      lessonId: string,
      goldenVerseId: string,
      order: number,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type LessonGoldenVersesByGoldenVerseIdQueryVariables = {
  goldenVerseId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelLessonGoldenVerseFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type LessonGoldenVersesByGoldenVerseIdQuery = {
  lessonGoldenVersesByGoldenVerseId?:  {
    __typename: "ModelLessonGoldenVerseConnection",
    items:  Array< {
      __typename: "LessonGoldenVerse",
      id: string,
      lessonId: string,
      goldenVerseId: string,
      order: number,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type PupilsByGradeIdAndLastNameQueryVariables = {
  gradeId: string,
  lastName?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelPupilFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type PupilsByGradeIdAndLastNameQuery = {
  pupilsByGradeIdAndLastName?:  {
    __typename: "ModelPupilConnection",
    items:  Array< {
      __typename: "Pupil",
      id: string,
      gradeId: string,
      firstName: string,
      lastName: string,
      middleName?: string | null,
      dateOfBirth: string,
      photo?: string | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type HomeworkChecksByLessonIdAndPupilIdQueryVariables = {
  lessonId: string,
  pupilId?: ModelIDKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelHomeworkCheckFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type HomeworkChecksByLessonIdAndPupilIdQuery = {
  homeworkChecksByLessonIdAndPupilId?:  {
    __typename: "ModelHomeworkCheckConnection",
    items:  Array< {
      __typename: "HomeworkCheck",
      id: string,
      lessonId: string,
      pupilId: string,
      gradeId: string,
      goldenVerse1Score?: number | null,
      goldenVerse2Score?: number | null,
      goldenVerse3Score?: number | null,
      testScore?: number | null,
      notebookScore?: number | null,
      singing: boolean,
      points: number,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type HomeworkChecksByPupilIdAndCreatedAtQueryVariables = {
  pupilId: string,
  createdAt?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelHomeworkCheckFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type HomeworkChecksByPupilIdAndCreatedAtQuery = {
  homeworkChecksByPupilIdAndCreatedAt?:  {
    __typename: "ModelHomeworkCheckConnection",
    items:  Array< {
      __typename: "HomeworkCheck",
      id: string,
      lessonId: string,
      pupilId: string,
      gradeId: string,
      goldenVerse1Score?: number | null,
      goldenVerse2Score?: number | null,
      goldenVerse3Score?: number | null,
      testScore?: number | null,
      notebookScore?: number | null,
      singing: boolean,
      points: number,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type HomeworkChecksByGradeIdAndCreatedAtQueryVariables = {
  gradeId: string,
  createdAt?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelHomeworkCheckFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type HomeworkChecksByGradeIdAndCreatedAtQuery = {
  homeworkChecksByGradeIdAndCreatedAt?:  {
    __typename: "ModelHomeworkCheckConnection",
    items:  Array< {
      __typename: "HomeworkCheck",
      id: string,
      lessonId: string,
      pupilId: string,
      gradeId: string,
      goldenVerse1Score?: number | null,
      goldenVerse2Score?: number | null,
      goldenVerse3Score?: number | null,
      testScore?: number | null,
      notebookScore?: number | null,
      singing: boolean,
      points: number,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type AchievementsByNameQueryVariables = {
  name: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelAchievementFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type AchievementsByNameQuery = {
  achievementsByName?:  {
    __typename: "ModelAchievementConnection",
    items:  Array< {
      __typename: "Achievement",
      id: string,
      name: string,
      description: string,
      icon?: string | null,
      criteria: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type PupilAchievementsByPupilIdAndAwardedAtQueryVariables = {
  pupilId: string,
  awardedAt?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelPupilAchievementFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type PupilAchievementsByPupilIdAndAwardedAtQuery = {
  pupilAchievementsByPupilIdAndAwardedAt?:  {
    __typename: "ModelPupilAchievementConnection",
    items:  Array< {
      __typename: "PupilAchievement",
      id: string,
      pupilId: string,
      achievementId: string,
      awardedAt: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type PupilAchievementsByAchievementIdQueryVariables = {
  achievementId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelPupilAchievementFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type PupilAchievementsByAchievementIdQuery = {
  pupilAchievementsByAchievementId?:  {
    __typename: "ModelPupilAchievementConnection",
    items:  Array< {
      __typename: "PupilAchievement",
      id: string,
      pupilId: string,
      achievementId: string,
      awardedAt: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type BricksIssuesByPupilIdAndIssuedAtQueryVariables = {
  pupilId: string,
  issuedAt?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelBricksIssueFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type BricksIssuesByPupilIdAndIssuedAtQuery = {
  bricksIssuesByPupilIdAndIssuedAt?:  {
    __typename: "ModelBricksIssueConnection",
    items:  Array< {
      __typename: "BricksIssue",
      id: string,
      pupilId: string,
      academicYearId: string,
      gradeId: string,
      quantity: number,
      issuedAt: string,
      issuedBy: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type BricksIssuesByAcademicYearIdAndIssuedAtQueryVariables = {
  academicYearId: string,
  issuedAt?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelBricksIssueFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type BricksIssuesByAcademicYearIdAndIssuedAtQuery = {
  bricksIssuesByAcademicYearIdAndIssuedAt?:  {
    __typename: "ModelBricksIssueConnection",
    items:  Array< {
      __typename: "BricksIssue",
      id: string,
      pupilId: string,
      academicYearId: string,
      gradeId: string,
      quantity: number,
      issuedAt: string,
      issuedBy: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type BricksIssuesByGradeIdAndIssuedAtQueryVariables = {
  gradeId: string,
  issuedAt?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelBricksIssueFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type BricksIssuesByGradeIdAndIssuedAtQuery = {
  bricksIssuesByGradeIdAndIssuedAt?:  {
    __typename: "ModelBricksIssueConnection",
    items:  Array< {
      __typename: "BricksIssue",
      id: string,
      pupilId: string,
      academicYearId: string,
      gradeId: string,
      quantity: number,
      issuedAt: string,
      issuedBy: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type FamiliesByMotherPhoneQueryVariables = {
  motherPhone: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelFamilyFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type FamiliesByMotherPhoneQuery = {
  familiesByMotherPhone?:  {
    __typename: "ModelFamilyConnection",
    items:  Array< {
      __typename: "Family",
      id: string,
      name: string,
      phone?: string | null,
      email?: string | null,
      address?: string | null,
      motherFirstName?: string | null,
      motherLastName?: string | null,
      motherMiddleName?: string | null,
      motherPhone?: string | null,
      fatherFirstName?: string | null,
      fatherLastName?: string | null,
      fatherMiddleName?: string | null,
      fatherPhone?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type FamiliesByFatherPhoneQueryVariables = {
  fatherPhone: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelFamilyFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type FamiliesByFatherPhoneQuery = {
  familiesByFatherPhone?:  {
    __typename: "ModelFamilyConnection",
    items:  Array< {
      __typename: "Family",
      id: string,
      name: string,
      phone?: string | null,
      email?: string | null,
      address?: string | null,
      motherFirstName?: string | null,
      motherLastName?: string | null,
      motherMiddleName?: string | null,
      motherPhone?: string | null,
      fatherFirstName?: string | null,
      fatherLastName?: string | null,
      fatherMiddleName?: string | null,
      fatherPhone?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type FamilyMembersByFamilyIdQueryVariables = {
  familyId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelFamilyMemberFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type FamilyMembersByFamilyIdQuery = {
  familyMembersByFamilyId?:  {
    __typename: "ModelFamilyMemberConnection",
    items:  Array< {
      __typename: "FamilyMember",
      id: string,
      familyId: string,
      pupilId: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type FamilyMembersByPupilIdQueryVariables = {
  pupilId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelFamilyMemberFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type FamilyMembersByPupilIdQuery = {
  familyMembersByPupilId?:  {
    __typename: "ModelFamilyMemberConnection",
    items:  Array< {
      __typename: "FamilyMember",
      id: string,
      familyId: string,
      pupilId: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UserFamiliesByUserIdQueryVariables = {
  userId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserFamilyFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UserFamiliesByUserIdQuery = {
  userFamiliesByUserId?:  {
    __typename: "ModelUserFamilyConnection",
    items:  Array< {
      __typename: "UserFamily",
      id: string,
      userId: string,
      familyId: string,
      phone: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UserFamiliesByFamilyIdQueryVariables = {
  familyId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserFamilyFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UserFamiliesByFamilyIdQuery = {
  userFamiliesByFamilyId?:  {
    __typename: "ModelUserFamilyConnection",
    items:  Array< {
      __typename: "UserFamily",
      id: string,
      userId: string,
      familyId: string,
      phone: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UserFamiliesByPhoneQueryVariables = {
  phone: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserFamilyFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UserFamiliesByPhoneQuery = {
  userFamiliesByPhone?:  {
    __typename: "ModelUserFamilyConnection",
    items:  Array< {
      __typename: "UserFamily",
      id: string,
      userId: string,
      familyId: string,
      phone: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GradeEventsByGradeIdAndEventDateQueryVariables = {
  gradeId: string,
  eventDate?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelGradeEventFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type GradeEventsByGradeIdAndEventDateQuery = {
  gradeEventsByGradeIdAndEventDate?:  {
    __typename: "ModelGradeEventConnection",
    items:  Array< {
      __typename: "GradeEvent",
      id: string,
      gradeId: string,
      eventType: GradeEventType,
      title: string,
      description?: string | null,
      eventDate: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GradeSettingsByGradeIdQueryVariables = {
  gradeId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelGradeSettingsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type GradeSettingsByGradeIdQuery = {
  gradeSettingsByGradeId?:  {
    __typename: "ModelGradeSettingsConnection",
    items:  Array< {
      __typename: "GradeSettings",
      id: string,
      gradeId: string,
      enableGoldenVerse: boolean,
      enableTest: boolean,
      enableNotebook: boolean,
      enableSinging: boolean,
      pointsGoldenVerse: number,
      pointsTest: number,
      pointsNotebook: number,
      pointsSinging: number,
      labelGoldenVerse: string,
      labelTest: string,
      labelNotebook: string,
      labelSinging: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
  id?: string | null,
};

export type OnCreateUserSubscription = {
  onCreateUser?:  {
    __typename: "User",
    id: string,
    email: string,
    name: string,
    role: UserRole,
    photo?: string | null,
    active: boolean,
    userGrades?:  {
      __typename: "ModelUserGradeConnection",
      nextToken?: string | null,
    } | null,
    createdLessons?:  {
      __typename: "ModelLessonConnection",
      nextToken?: string | null,
    } | null,
    userFamilies?:  {
      __typename: "ModelUserFamilyConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
  id?: string | null,
};

export type OnUpdateUserSubscription = {
  onUpdateUser?:  {
    __typename: "User",
    id: string,
    email: string,
    name: string,
    role: UserRole,
    photo?: string | null,
    active: boolean,
    userGrades?:  {
      __typename: "ModelUserGradeConnection",
      nextToken?: string | null,
    } | null,
    createdLessons?:  {
      __typename: "ModelLessonConnection",
      nextToken?: string | null,
    } | null,
    userFamilies?:  {
      __typename: "ModelUserFamilyConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
  id?: string | null,
};

export type OnDeleteUserSubscription = {
  onDeleteUser?:  {
    __typename: "User",
    id: string,
    email: string,
    name: string,
    role: UserRole,
    photo?: string | null,
    active: boolean,
    userGrades?:  {
      __typename: "ModelUserGradeConnection",
      nextToken?: string | null,
    } | null,
    createdLessons?:  {
      __typename: "ModelLessonConnection",
      nextToken?: string | null,
    } | null,
    userFamilies?:  {
      __typename: "ModelUserFamilyConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateGradeSubscriptionVariables = {
  filter?: ModelSubscriptionGradeFilterInput | null,
};

export type OnCreateGradeSubscription = {
  onCreateGrade?:  {
    __typename: "Grade",
    id: string,
    name: string,
    description?: string | null,
    minAge?: number | null,
    maxAge?: number | null,
    active: boolean,
    teachers?:  {
      __typename: "ModelUserGradeConnection",
      nextToken?: string | null,
    } | null,
    academicYears?:  {
      __typename: "ModelAcademicYearConnection",
      nextToken?: string | null,
    } | null,
    pupils?:  {
      __typename: "ModelPupilConnection",
      nextToken?: string | null,
    } | null,
    events?:  {
      __typename: "ModelGradeEventConnection",
      nextToken?: string | null,
    } | null,
    settings?:  {
      __typename: "GradeSettings",
      id: string,
      gradeId: string,
      enableGoldenVerse: boolean,
      enableTest: boolean,
      enableNotebook: boolean,
      enableSinging: boolean,
      pointsGoldenVerse: number,
      pointsTest: number,
      pointsNotebook: number,
      pointsSinging: number,
      labelGoldenVerse: string,
      labelTest: string,
      labelNotebook: string,
      labelSinging: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateGradeSubscriptionVariables = {
  filter?: ModelSubscriptionGradeFilterInput | null,
};

export type OnUpdateGradeSubscription = {
  onUpdateGrade?:  {
    __typename: "Grade",
    id: string,
    name: string,
    description?: string | null,
    minAge?: number | null,
    maxAge?: number | null,
    active: boolean,
    teachers?:  {
      __typename: "ModelUserGradeConnection",
      nextToken?: string | null,
    } | null,
    academicYears?:  {
      __typename: "ModelAcademicYearConnection",
      nextToken?: string | null,
    } | null,
    pupils?:  {
      __typename: "ModelPupilConnection",
      nextToken?: string | null,
    } | null,
    events?:  {
      __typename: "ModelGradeEventConnection",
      nextToken?: string | null,
    } | null,
    settings?:  {
      __typename: "GradeSettings",
      id: string,
      gradeId: string,
      enableGoldenVerse: boolean,
      enableTest: boolean,
      enableNotebook: boolean,
      enableSinging: boolean,
      pointsGoldenVerse: number,
      pointsTest: number,
      pointsNotebook: number,
      pointsSinging: number,
      labelGoldenVerse: string,
      labelTest: string,
      labelNotebook: string,
      labelSinging: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteGradeSubscriptionVariables = {
  filter?: ModelSubscriptionGradeFilterInput | null,
};

export type OnDeleteGradeSubscription = {
  onDeleteGrade?:  {
    __typename: "Grade",
    id: string,
    name: string,
    description?: string | null,
    minAge?: number | null,
    maxAge?: number | null,
    active: boolean,
    teachers?:  {
      __typename: "ModelUserGradeConnection",
      nextToken?: string | null,
    } | null,
    academicYears?:  {
      __typename: "ModelAcademicYearConnection",
      nextToken?: string | null,
    } | null,
    pupils?:  {
      __typename: "ModelPupilConnection",
      nextToken?: string | null,
    } | null,
    events?:  {
      __typename: "ModelGradeEventConnection",
      nextToken?: string | null,
    } | null,
    settings?:  {
      __typename: "GradeSettings",
      id: string,
      gradeId: string,
      enableGoldenVerse: boolean,
      enableTest: boolean,
      enableNotebook: boolean,
      enableSinging: boolean,
      pointsGoldenVerse: number,
      pointsTest: number,
      pointsNotebook: number,
      pointsSinging: number,
      labelGoldenVerse: string,
      labelTest: string,
      labelNotebook: string,
      labelSinging: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateUserGradeSubscriptionVariables = {
  filter?: ModelSubscriptionUserGradeFilterInput | null,
};

export type OnCreateUserGradeSubscription = {
  onCreateUserGrade?:  {
    __typename: "UserGrade",
    id: string,
    userId: string,
    gradeId: string,
    user?:  {
      __typename: "User",
      id: string,
      email: string,
      name: string,
      role: UserRole,
      photo?: string | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    grade?:  {
      __typename: "Grade",
      id: string,
      name: string,
      description?: string | null,
      minAge?: number | null,
      maxAge?: number | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    assignedAt: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateUserGradeSubscriptionVariables = {
  filter?: ModelSubscriptionUserGradeFilterInput | null,
};

export type OnUpdateUserGradeSubscription = {
  onUpdateUserGrade?:  {
    __typename: "UserGrade",
    id: string,
    userId: string,
    gradeId: string,
    user?:  {
      __typename: "User",
      id: string,
      email: string,
      name: string,
      role: UserRole,
      photo?: string | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    grade?:  {
      __typename: "Grade",
      id: string,
      name: string,
      description?: string | null,
      minAge?: number | null,
      maxAge?: number | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    assignedAt: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteUserGradeSubscriptionVariables = {
  filter?: ModelSubscriptionUserGradeFilterInput | null,
};

export type OnDeleteUserGradeSubscription = {
  onDeleteUserGrade?:  {
    __typename: "UserGrade",
    id: string,
    userId: string,
    gradeId: string,
    user?:  {
      __typename: "User",
      id: string,
      email: string,
      name: string,
      role: UserRole,
      photo?: string | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    grade?:  {
      __typename: "Grade",
      id: string,
      name: string,
      description?: string | null,
      minAge?: number | null,
      maxAge?: number | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    assignedAt: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateAcademicYearSubscriptionVariables = {
  filter?: ModelSubscriptionAcademicYearFilterInput | null,
};

export type OnCreateAcademicYearSubscription = {
  onCreateAcademicYear?:  {
    __typename: "AcademicYear",
    id: string,
    gradeId: string,
    name: string,
    startDate: string,
    endDate: string,
    status: AcademicYearStatus,
    lessons?:  {
      __typename: "ModelLessonConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateAcademicYearSubscriptionVariables = {
  filter?: ModelSubscriptionAcademicYearFilterInput | null,
};

export type OnUpdateAcademicYearSubscription = {
  onUpdateAcademicYear?:  {
    __typename: "AcademicYear",
    id: string,
    gradeId: string,
    name: string,
    startDate: string,
    endDate: string,
    status: AcademicYearStatus,
    lessons?:  {
      __typename: "ModelLessonConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteAcademicYearSubscriptionVariables = {
  filter?: ModelSubscriptionAcademicYearFilterInput | null,
};

export type OnDeleteAcademicYearSubscription = {
  onDeleteAcademicYear?:  {
    __typename: "AcademicYear",
    id: string,
    gradeId: string,
    name: string,
    startDate: string,
    endDate: string,
    status: AcademicYearStatus,
    lessons?:  {
      __typename: "ModelLessonConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateLessonSubscriptionVariables = {
  filter?: ModelSubscriptionLessonFilterInput | null,
};

export type OnCreateLessonSubscription = {
  onCreateLesson?:  {
    __typename: "Lesson",
    id: string,
    academicYearId: string,
    gradeId: string,
    teacherId: string,
    title: string,
    content?: string | null,
    lessonDate: string,
    order: number,
    homeworkChecks?:  {
      __typename: "ModelHomeworkCheckConnection",
      nextToken?: string | null,
    } | null,
    goldenVerses?:  {
      __typename: "ModelLessonGoldenVerseConnection",
      nextToken?: string | null,
    } | null,
    files?:  {
      __typename: "ModelLessonFileConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateLessonSubscriptionVariables = {
  filter?: ModelSubscriptionLessonFilterInput | null,
};

export type OnUpdateLessonSubscription = {
  onUpdateLesson?:  {
    __typename: "Lesson",
    id: string,
    academicYearId: string,
    gradeId: string,
    teacherId: string,
    title: string,
    content?: string | null,
    lessonDate: string,
    order: number,
    homeworkChecks?:  {
      __typename: "ModelHomeworkCheckConnection",
      nextToken?: string | null,
    } | null,
    goldenVerses?:  {
      __typename: "ModelLessonGoldenVerseConnection",
      nextToken?: string | null,
    } | null,
    files?:  {
      __typename: "ModelLessonFileConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteLessonSubscriptionVariables = {
  filter?: ModelSubscriptionLessonFilterInput | null,
};

export type OnDeleteLessonSubscription = {
  onDeleteLesson?:  {
    __typename: "Lesson",
    id: string,
    academicYearId: string,
    gradeId: string,
    teacherId: string,
    title: string,
    content?: string | null,
    lessonDate: string,
    order: number,
    homeworkChecks?:  {
      __typename: "ModelHomeworkCheckConnection",
      nextToken?: string | null,
    } | null,
    goldenVerses?:  {
      __typename: "ModelLessonGoldenVerseConnection",
      nextToken?: string | null,
    } | null,
    files?:  {
      __typename: "ModelLessonFileConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateLessonFileSubscriptionVariables = {
  filter?: ModelSubscriptionLessonFileFilterInput | null,
};

export type OnCreateLessonFileSubscription = {
  onCreateLessonFile?:  {
    __typename: "LessonFile",
    id: string,
    lessonId: string,
    fileName: string,
    fileType: string,
    mimeType: string,
    fileSize: number,
    s3Key: string,
    s3Url: string,
    order: number,
    description?: string | null,
    lesson?:  {
      __typename: "Lesson",
      id: string,
      academicYearId: string,
      gradeId: string,
      teacherId: string,
      title: string,
      content?: string | null,
      lessonDate: string,
      order: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateLessonFileSubscriptionVariables = {
  filter?: ModelSubscriptionLessonFileFilterInput | null,
};

export type OnUpdateLessonFileSubscription = {
  onUpdateLessonFile?:  {
    __typename: "LessonFile",
    id: string,
    lessonId: string,
    fileName: string,
    fileType: string,
    mimeType: string,
    fileSize: number,
    s3Key: string,
    s3Url: string,
    order: number,
    description?: string | null,
    lesson?:  {
      __typename: "Lesson",
      id: string,
      academicYearId: string,
      gradeId: string,
      teacherId: string,
      title: string,
      content?: string | null,
      lessonDate: string,
      order: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteLessonFileSubscriptionVariables = {
  filter?: ModelSubscriptionLessonFileFilterInput | null,
};

export type OnDeleteLessonFileSubscription = {
  onDeleteLessonFile?:  {
    __typename: "LessonFile",
    id: string,
    lessonId: string,
    fileName: string,
    fileType: string,
    mimeType: string,
    fileSize: number,
    s3Key: string,
    s3Url: string,
    order: number,
    description?: string | null,
    lesson?:  {
      __typename: "Lesson",
      id: string,
      academicYearId: string,
      gradeId: string,
      teacherId: string,
      title: string,
      content?: string | null,
      lessonDate: string,
      order: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateBookSubscriptionVariables = {
  filter?: ModelSubscriptionBookFilterInput | null,
};

export type OnCreateBookSubscription = {
  onCreateBook?:  {
    __typename: "Book",
    id: string,
    fullName: string,
    shortName: string,
    abbreviation: string,
    testament: string,
    order: number,
    goldenVerses?:  {
      __typename: "ModelGoldenVerseConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateBookSubscriptionVariables = {
  filter?: ModelSubscriptionBookFilterInput | null,
};

export type OnUpdateBookSubscription = {
  onUpdateBook?:  {
    __typename: "Book",
    id: string,
    fullName: string,
    shortName: string,
    abbreviation: string,
    testament: string,
    order: number,
    goldenVerses?:  {
      __typename: "ModelGoldenVerseConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteBookSubscriptionVariables = {
  filter?: ModelSubscriptionBookFilterInput | null,
};

export type OnDeleteBookSubscription = {
  onDeleteBook?:  {
    __typename: "Book",
    id: string,
    fullName: string,
    shortName: string,
    abbreviation: string,
    testament: string,
    order: number,
    goldenVerses?:  {
      __typename: "ModelGoldenVerseConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateGoldenVerseSubscriptionVariables = {
  filter?: ModelSubscriptionGoldenVerseFilterInput | null,
};

export type OnCreateGoldenVerseSubscription = {
  onCreateGoldenVerse?:  {
    __typename: "GoldenVerse",
    id: string,
    reference: string,
    bookId: string,
    chapter: number,
    verseStart: number,
    verseEnd?: number | null,
    text: string,
    book?:  {
      __typename: "Book",
      id: string,
      fullName: string,
      shortName: string,
      abbreviation: string,
      testament: string,
      order: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    lessons?:  {
      __typename: "ModelLessonGoldenVerseConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateGoldenVerseSubscriptionVariables = {
  filter?: ModelSubscriptionGoldenVerseFilterInput | null,
};

export type OnUpdateGoldenVerseSubscription = {
  onUpdateGoldenVerse?:  {
    __typename: "GoldenVerse",
    id: string,
    reference: string,
    bookId: string,
    chapter: number,
    verseStart: number,
    verseEnd?: number | null,
    text: string,
    book?:  {
      __typename: "Book",
      id: string,
      fullName: string,
      shortName: string,
      abbreviation: string,
      testament: string,
      order: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    lessons?:  {
      __typename: "ModelLessonGoldenVerseConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteGoldenVerseSubscriptionVariables = {
  filter?: ModelSubscriptionGoldenVerseFilterInput | null,
};

export type OnDeleteGoldenVerseSubscription = {
  onDeleteGoldenVerse?:  {
    __typename: "GoldenVerse",
    id: string,
    reference: string,
    bookId: string,
    chapter: number,
    verseStart: number,
    verseEnd?: number | null,
    text: string,
    book?:  {
      __typename: "Book",
      id: string,
      fullName: string,
      shortName: string,
      abbreviation: string,
      testament: string,
      order: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    lessons?:  {
      __typename: "ModelLessonGoldenVerseConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateLessonGoldenVerseSubscriptionVariables = {
  filter?: ModelSubscriptionLessonGoldenVerseFilterInput | null,
};

export type OnCreateLessonGoldenVerseSubscription = {
  onCreateLessonGoldenVerse?:  {
    __typename: "LessonGoldenVerse",
    id: string,
    lessonId: string,
    goldenVerseId: string,
    order: number,
    lesson?:  {
      __typename: "Lesson",
      id: string,
      academicYearId: string,
      gradeId: string,
      teacherId: string,
      title: string,
      content?: string | null,
      lessonDate: string,
      order: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    goldenVerse?:  {
      __typename: "GoldenVerse",
      id: string,
      reference: string,
      bookId: string,
      chapter: number,
      verseStart: number,
      verseEnd?: number | null,
      text: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateLessonGoldenVerseSubscriptionVariables = {
  filter?: ModelSubscriptionLessonGoldenVerseFilterInput | null,
};

export type OnUpdateLessonGoldenVerseSubscription = {
  onUpdateLessonGoldenVerse?:  {
    __typename: "LessonGoldenVerse",
    id: string,
    lessonId: string,
    goldenVerseId: string,
    order: number,
    lesson?:  {
      __typename: "Lesson",
      id: string,
      academicYearId: string,
      gradeId: string,
      teacherId: string,
      title: string,
      content?: string | null,
      lessonDate: string,
      order: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    goldenVerse?:  {
      __typename: "GoldenVerse",
      id: string,
      reference: string,
      bookId: string,
      chapter: number,
      verseStart: number,
      verseEnd?: number | null,
      text: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteLessonGoldenVerseSubscriptionVariables = {
  filter?: ModelSubscriptionLessonGoldenVerseFilterInput | null,
};

export type OnDeleteLessonGoldenVerseSubscription = {
  onDeleteLessonGoldenVerse?:  {
    __typename: "LessonGoldenVerse",
    id: string,
    lessonId: string,
    goldenVerseId: string,
    order: number,
    lesson?:  {
      __typename: "Lesson",
      id: string,
      academicYearId: string,
      gradeId: string,
      teacherId: string,
      title: string,
      content?: string | null,
      lessonDate: string,
      order: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    goldenVerse?:  {
      __typename: "GoldenVerse",
      id: string,
      reference: string,
      bookId: string,
      chapter: number,
      verseStart: number,
      verseEnd?: number | null,
      text: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreatePupilSubscriptionVariables = {
  filter?: ModelSubscriptionPupilFilterInput | null,
};

export type OnCreatePupilSubscription = {
  onCreatePupil?:  {
    __typename: "Pupil",
    id: string,
    gradeId: string,
    firstName: string,
    lastName: string,
    middleName?: string | null,
    dateOfBirth: string,
    photo?: string | null,
    active: boolean,
    families?:  {
      __typename: "ModelFamilyMemberConnection",
      nextToken?: string | null,
    } | null,
    homeworkChecks?:  {
      __typename: "ModelHomeworkCheckConnection",
      nextToken?: string | null,
    } | null,
    achievements?:  {
      __typename: "ModelPupilAchievementConnection",
      nextToken?: string | null,
    } | null,
    bricksIssues?:  {
      __typename: "ModelBricksIssueConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdatePupilSubscriptionVariables = {
  filter?: ModelSubscriptionPupilFilterInput | null,
};

export type OnUpdatePupilSubscription = {
  onUpdatePupil?:  {
    __typename: "Pupil",
    id: string,
    gradeId: string,
    firstName: string,
    lastName: string,
    middleName?: string | null,
    dateOfBirth: string,
    photo?: string | null,
    active: boolean,
    families?:  {
      __typename: "ModelFamilyMemberConnection",
      nextToken?: string | null,
    } | null,
    homeworkChecks?:  {
      __typename: "ModelHomeworkCheckConnection",
      nextToken?: string | null,
    } | null,
    achievements?:  {
      __typename: "ModelPupilAchievementConnection",
      nextToken?: string | null,
    } | null,
    bricksIssues?:  {
      __typename: "ModelBricksIssueConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeletePupilSubscriptionVariables = {
  filter?: ModelSubscriptionPupilFilterInput | null,
};

export type OnDeletePupilSubscription = {
  onDeletePupil?:  {
    __typename: "Pupil",
    id: string,
    gradeId: string,
    firstName: string,
    lastName: string,
    middleName?: string | null,
    dateOfBirth: string,
    photo?: string | null,
    active: boolean,
    families?:  {
      __typename: "ModelFamilyMemberConnection",
      nextToken?: string | null,
    } | null,
    homeworkChecks?:  {
      __typename: "ModelHomeworkCheckConnection",
      nextToken?: string | null,
    } | null,
    achievements?:  {
      __typename: "ModelPupilAchievementConnection",
      nextToken?: string | null,
    } | null,
    bricksIssues?:  {
      __typename: "ModelBricksIssueConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateHomeworkCheckSubscriptionVariables = {
  filter?: ModelSubscriptionHomeworkCheckFilterInput | null,
};

export type OnCreateHomeworkCheckSubscription = {
  onCreateHomeworkCheck?:  {
    __typename: "HomeworkCheck",
    id: string,
    lessonId: string,
    pupilId: string,
    gradeId: string,
    goldenVerse1Score?: number | null,
    goldenVerse2Score?: number | null,
    goldenVerse3Score?: number | null,
    testScore?: number | null,
    notebookScore?: number | null,
    singing: boolean,
    points: number,
    lesson?:  {
      __typename: "Lesson",
      id: string,
      academicYearId: string,
      gradeId: string,
      teacherId: string,
      title: string,
      content?: string | null,
      lessonDate: string,
      order: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    pupil?:  {
      __typename: "Pupil",
      id: string,
      gradeId: string,
      firstName: string,
      lastName: string,
      middleName?: string | null,
      dateOfBirth: string,
      photo?: string | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateHomeworkCheckSubscriptionVariables = {
  filter?: ModelSubscriptionHomeworkCheckFilterInput | null,
};

export type OnUpdateHomeworkCheckSubscription = {
  onUpdateHomeworkCheck?:  {
    __typename: "HomeworkCheck",
    id: string,
    lessonId: string,
    pupilId: string,
    gradeId: string,
    goldenVerse1Score?: number | null,
    goldenVerse2Score?: number | null,
    goldenVerse3Score?: number | null,
    testScore?: number | null,
    notebookScore?: number | null,
    singing: boolean,
    points: number,
    lesson?:  {
      __typename: "Lesson",
      id: string,
      academicYearId: string,
      gradeId: string,
      teacherId: string,
      title: string,
      content?: string | null,
      lessonDate: string,
      order: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    pupil?:  {
      __typename: "Pupil",
      id: string,
      gradeId: string,
      firstName: string,
      lastName: string,
      middleName?: string | null,
      dateOfBirth: string,
      photo?: string | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteHomeworkCheckSubscriptionVariables = {
  filter?: ModelSubscriptionHomeworkCheckFilterInput | null,
};

export type OnDeleteHomeworkCheckSubscription = {
  onDeleteHomeworkCheck?:  {
    __typename: "HomeworkCheck",
    id: string,
    lessonId: string,
    pupilId: string,
    gradeId: string,
    goldenVerse1Score?: number | null,
    goldenVerse2Score?: number | null,
    goldenVerse3Score?: number | null,
    testScore?: number | null,
    notebookScore?: number | null,
    singing: boolean,
    points: number,
    lesson?:  {
      __typename: "Lesson",
      id: string,
      academicYearId: string,
      gradeId: string,
      teacherId: string,
      title: string,
      content?: string | null,
      lessonDate: string,
      order: number,
      createdAt: string,
      updatedAt: string,
    } | null,
    pupil?:  {
      __typename: "Pupil",
      id: string,
      gradeId: string,
      firstName: string,
      lastName: string,
      middleName?: string | null,
      dateOfBirth: string,
      photo?: string | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateAchievementSubscriptionVariables = {
  filter?: ModelSubscriptionAchievementFilterInput | null,
};

export type OnCreateAchievementSubscription = {
  onCreateAchievement?:  {
    __typename: "Achievement",
    id: string,
    name: string,
    description: string,
    icon?: string | null,
    criteria: string,
    pupils?:  {
      __typename: "ModelPupilAchievementConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateAchievementSubscriptionVariables = {
  filter?: ModelSubscriptionAchievementFilterInput | null,
};

export type OnUpdateAchievementSubscription = {
  onUpdateAchievement?:  {
    __typename: "Achievement",
    id: string,
    name: string,
    description: string,
    icon?: string | null,
    criteria: string,
    pupils?:  {
      __typename: "ModelPupilAchievementConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteAchievementSubscriptionVariables = {
  filter?: ModelSubscriptionAchievementFilterInput | null,
};

export type OnDeleteAchievementSubscription = {
  onDeleteAchievement?:  {
    __typename: "Achievement",
    id: string,
    name: string,
    description: string,
    icon?: string | null,
    criteria: string,
    pupils?:  {
      __typename: "ModelPupilAchievementConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreatePupilAchievementSubscriptionVariables = {
  filter?: ModelSubscriptionPupilAchievementFilterInput | null,
};

export type OnCreatePupilAchievementSubscription = {
  onCreatePupilAchievement?:  {
    __typename: "PupilAchievement",
    id: string,
    pupilId: string,
    achievementId: string,
    awardedAt: string,
    pupil?:  {
      __typename: "Pupil",
      id: string,
      gradeId: string,
      firstName: string,
      lastName: string,
      middleName?: string | null,
      dateOfBirth: string,
      photo?: string | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    achievement?:  {
      __typename: "Achievement",
      id: string,
      name: string,
      description: string,
      icon?: string | null,
      criteria: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdatePupilAchievementSubscriptionVariables = {
  filter?: ModelSubscriptionPupilAchievementFilterInput | null,
};

export type OnUpdatePupilAchievementSubscription = {
  onUpdatePupilAchievement?:  {
    __typename: "PupilAchievement",
    id: string,
    pupilId: string,
    achievementId: string,
    awardedAt: string,
    pupil?:  {
      __typename: "Pupil",
      id: string,
      gradeId: string,
      firstName: string,
      lastName: string,
      middleName?: string | null,
      dateOfBirth: string,
      photo?: string | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    achievement?:  {
      __typename: "Achievement",
      id: string,
      name: string,
      description: string,
      icon?: string | null,
      criteria: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeletePupilAchievementSubscriptionVariables = {
  filter?: ModelSubscriptionPupilAchievementFilterInput | null,
};

export type OnDeletePupilAchievementSubscription = {
  onDeletePupilAchievement?:  {
    __typename: "PupilAchievement",
    id: string,
    pupilId: string,
    achievementId: string,
    awardedAt: string,
    pupil?:  {
      __typename: "Pupil",
      id: string,
      gradeId: string,
      firstName: string,
      lastName: string,
      middleName?: string | null,
      dateOfBirth: string,
      photo?: string | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    achievement?:  {
      __typename: "Achievement",
      id: string,
      name: string,
      description: string,
      icon?: string | null,
      criteria: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateBricksIssueSubscriptionVariables = {
  filter?: ModelSubscriptionBricksIssueFilterInput | null,
};

export type OnCreateBricksIssueSubscription = {
  onCreateBricksIssue?:  {
    __typename: "BricksIssue",
    id: string,
    pupilId: string,
    academicYearId: string,
    gradeId: string,
    quantity: number,
    issuedAt: string,
    issuedBy: string,
    pupil?:  {
      __typename: "Pupil",
      id: string,
      gradeId: string,
      firstName: string,
      lastName: string,
      middleName?: string | null,
      dateOfBirth: string,
      photo?: string | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateBricksIssueSubscriptionVariables = {
  filter?: ModelSubscriptionBricksIssueFilterInput | null,
};

export type OnUpdateBricksIssueSubscription = {
  onUpdateBricksIssue?:  {
    __typename: "BricksIssue",
    id: string,
    pupilId: string,
    academicYearId: string,
    gradeId: string,
    quantity: number,
    issuedAt: string,
    issuedBy: string,
    pupil?:  {
      __typename: "Pupil",
      id: string,
      gradeId: string,
      firstName: string,
      lastName: string,
      middleName?: string | null,
      dateOfBirth: string,
      photo?: string | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteBricksIssueSubscriptionVariables = {
  filter?: ModelSubscriptionBricksIssueFilterInput | null,
};

export type OnDeleteBricksIssueSubscription = {
  onDeleteBricksIssue?:  {
    __typename: "BricksIssue",
    id: string,
    pupilId: string,
    academicYearId: string,
    gradeId: string,
    quantity: number,
    issuedAt: string,
    issuedBy: string,
    pupil?:  {
      __typename: "Pupil",
      id: string,
      gradeId: string,
      firstName: string,
      lastName: string,
      middleName?: string | null,
      dateOfBirth: string,
      photo?: string | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateFamilySubscriptionVariables = {
  filter?: ModelSubscriptionFamilyFilterInput | null,
};

export type OnCreateFamilySubscription = {
  onCreateFamily?:  {
    __typename: "Family",
    id: string,
    name: string,
    phone?: string | null,
    email?: string | null,
    address?: string | null,
    motherFirstName?: string | null,
    motherLastName?: string | null,
    motherMiddleName?: string | null,
    motherPhone?: string | null,
    fatherFirstName?: string | null,
    fatherLastName?: string | null,
    fatherMiddleName?: string | null,
    fatherPhone?: string | null,
    members?:  {
      __typename: "ModelFamilyMemberConnection",
      nextToken?: string | null,
    } | null,
    userFamilies?:  {
      __typename: "ModelUserFamilyConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateFamilySubscriptionVariables = {
  filter?: ModelSubscriptionFamilyFilterInput | null,
};

export type OnUpdateFamilySubscription = {
  onUpdateFamily?:  {
    __typename: "Family",
    id: string,
    name: string,
    phone?: string | null,
    email?: string | null,
    address?: string | null,
    motherFirstName?: string | null,
    motherLastName?: string | null,
    motherMiddleName?: string | null,
    motherPhone?: string | null,
    fatherFirstName?: string | null,
    fatherLastName?: string | null,
    fatherMiddleName?: string | null,
    fatherPhone?: string | null,
    members?:  {
      __typename: "ModelFamilyMemberConnection",
      nextToken?: string | null,
    } | null,
    userFamilies?:  {
      __typename: "ModelUserFamilyConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteFamilySubscriptionVariables = {
  filter?: ModelSubscriptionFamilyFilterInput | null,
};

export type OnDeleteFamilySubscription = {
  onDeleteFamily?:  {
    __typename: "Family",
    id: string,
    name: string,
    phone?: string | null,
    email?: string | null,
    address?: string | null,
    motherFirstName?: string | null,
    motherLastName?: string | null,
    motherMiddleName?: string | null,
    motherPhone?: string | null,
    fatherFirstName?: string | null,
    fatherLastName?: string | null,
    fatherMiddleName?: string | null,
    fatherPhone?: string | null,
    members?:  {
      __typename: "ModelFamilyMemberConnection",
      nextToken?: string | null,
    } | null,
    userFamilies?:  {
      __typename: "ModelUserFamilyConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateFamilyMemberSubscriptionVariables = {
  filter?: ModelSubscriptionFamilyMemberFilterInput | null,
};

export type OnCreateFamilyMemberSubscription = {
  onCreateFamilyMember?:  {
    __typename: "FamilyMember",
    id: string,
    familyId: string,
    pupilId: string,
    family?:  {
      __typename: "Family",
      id: string,
      name: string,
      phone?: string | null,
      email?: string | null,
      address?: string | null,
      motherFirstName?: string | null,
      motherLastName?: string | null,
      motherMiddleName?: string | null,
      motherPhone?: string | null,
      fatherFirstName?: string | null,
      fatherLastName?: string | null,
      fatherMiddleName?: string | null,
      fatherPhone?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    pupil?:  {
      __typename: "Pupil",
      id: string,
      gradeId: string,
      firstName: string,
      lastName: string,
      middleName?: string | null,
      dateOfBirth: string,
      photo?: string | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateFamilyMemberSubscriptionVariables = {
  filter?: ModelSubscriptionFamilyMemberFilterInput | null,
};

export type OnUpdateFamilyMemberSubscription = {
  onUpdateFamilyMember?:  {
    __typename: "FamilyMember",
    id: string,
    familyId: string,
    pupilId: string,
    family?:  {
      __typename: "Family",
      id: string,
      name: string,
      phone?: string | null,
      email?: string | null,
      address?: string | null,
      motherFirstName?: string | null,
      motherLastName?: string | null,
      motherMiddleName?: string | null,
      motherPhone?: string | null,
      fatherFirstName?: string | null,
      fatherLastName?: string | null,
      fatherMiddleName?: string | null,
      fatherPhone?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    pupil?:  {
      __typename: "Pupil",
      id: string,
      gradeId: string,
      firstName: string,
      lastName: string,
      middleName?: string | null,
      dateOfBirth: string,
      photo?: string | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteFamilyMemberSubscriptionVariables = {
  filter?: ModelSubscriptionFamilyMemberFilterInput | null,
};

export type OnDeleteFamilyMemberSubscription = {
  onDeleteFamilyMember?:  {
    __typename: "FamilyMember",
    id: string,
    familyId: string,
    pupilId: string,
    family?:  {
      __typename: "Family",
      id: string,
      name: string,
      phone?: string | null,
      email?: string | null,
      address?: string | null,
      motherFirstName?: string | null,
      motherLastName?: string | null,
      motherMiddleName?: string | null,
      motherPhone?: string | null,
      fatherFirstName?: string | null,
      fatherLastName?: string | null,
      fatherMiddleName?: string | null,
      fatherPhone?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    pupil?:  {
      __typename: "Pupil",
      id: string,
      gradeId: string,
      firstName: string,
      lastName: string,
      middleName?: string | null,
      dateOfBirth: string,
      photo?: string | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateUserFamilySubscriptionVariables = {
  filter?: ModelSubscriptionUserFamilyFilterInput | null,
  userId?: string | null,
};

export type OnCreateUserFamilySubscription = {
  onCreateUserFamily?:  {
    __typename: "UserFamily",
    id: string,
    userId: string,
    familyId: string,
    phone: string,
    user?:  {
      __typename: "User",
      id: string,
      email: string,
      name: string,
      role: UserRole,
      photo?: string | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    family?:  {
      __typename: "Family",
      id: string,
      name: string,
      phone?: string | null,
      email?: string | null,
      address?: string | null,
      motherFirstName?: string | null,
      motherLastName?: string | null,
      motherMiddleName?: string | null,
      motherPhone?: string | null,
      fatherFirstName?: string | null,
      fatherLastName?: string | null,
      fatherMiddleName?: string | null,
      fatherPhone?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateUserFamilySubscriptionVariables = {
  filter?: ModelSubscriptionUserFamilyFilterInput | null,
  userId?: string | null,
};

export type OnUpdateUserFamilySubscription = {
  onUpdateUserFamily?:  {
    __typename: "UserFamily",
    id: string,
    userId: string,
    familyId: string,
    phone: string,
    user?:  {
      __typename: "User",
      id: string,
      email: string,
      name: string,
      role: UserRole,
      photo?: string | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    family?:  {
      __typename: "Family",
      id: string,
      name: string,
      phone?: string | null,
      email?: string | null,
      address?: string | null,
      motherFirstName?: string | null,
      motherLastName?: string | null,
      motherMiddleName?: string | null,
      motherPhone?: string | null,
      fatherFirstName?: string | null,
      fatherLastName?: string | null,
      fatherMiddleName?: string | null,
      fatherPhone?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteUserFamilySubscriptionVariables = {
  filter?: ModelSubscriptionUserFamilyFilterInput | null,
  userId?: string | null,
};

export type OnDeleteUserFamilySubscription = {
  onDeleteUserFamily?:  {
    __typename: "UserFamily",
    id: string,
    userId: string,
    familyId: string,
    phone: string,
    user?:  {
      __typename: "User",
      id: string,
      email: string,
      name: string,
      role: UserRole,
      photo?: string | null,
      active: boolean,
      createdAt: string,
      updatedAt: string,
    } | null,
    family?:  {
      __typename: "Family",
      id: string,
      name: string,
      phone?: string | null,
      email?: string | null,
      address?: string | null,
      motherFirstName?: string | null,
      motherLastName?: string | null,
      motherMiddleName?: string | null,
      motherPhone?: string | null,
      fatherFirstName?: string | null,
      fatherLastName?: string | null,
      fatherMiddleName?: string | null,
      fatherPhone?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateGradeEventSubscriptionVariables = {
  filter?: ModelSubscriptionGradeEventFilterInput | null,
};

export type OnCreateGradeEventSubscription = {
  onCreateGradeEvent?:  {
    __typename: "GradeEvent",
    id: string,
    gradeId: string,
    eventType: GradeEventType,
    title: string,
    description?: string | null,
    eventDate: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateGradeEventSubscriptionVariables = {
  filter?: ModelSubscriptionGradeEventFilterInput | null,
};

export type OnUpdateGradeEventSubscription = {
  onUpdateGradeEvent?:  {
    __typename: "GradeEvent",
    id: string,
    gradeId: string,
    eventType: GradeEventType,
    title: string,
    description?: string | null,
    eventDate: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteGradeEventSubscriptionVariables = {
  filter?: ModelSubscriptionGradeEventFilterInput | null,
};

export type OnDeleteGradeEventSubscription = {
  onDeleteGradeEvent?:  {
    __typename: "GradeEvent",
    id: string,
    gradeId: string,
    eventType: GradeEventType,
    title: string,
    description?: string | null,
    eventDate: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateGradeSettingsSubscriptionVariables = {
  filter?: ModelSubscriptionGradeSettingsFilterInput | null,
};

export type OnCreateGradeSettingsSubscription = {
  onCreateGradeSettings?:  {
    __typename: "GradeSettings",
    id: string,
    gradeId: string,
    enableGoldenVerse: boolean,
    enableTest: boolean,
    enableNotebook: boolean,
    enableSinging: boolean,
    pointsGoldenVerse: number,
    pointsTest: number,
    pointsNotebook: number,
    pointsSinging: number,
    labelGoldenVerse: string,
    labelTest: string,
    labelNotebook: string,
    labelSinging: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateGradeSettingsSubscriptionVariables = {
  filter?: ModelSubscriptionGradeSettingsFilterInput | null,
};

export type OnUpdateGradeSettingsSubscription = {
  onUpdateGradeSettings?:  {
    __typename: "GradeSettings",
    id: string,
    gradeId: string,
    enableGoldenVerse: boolean,
    enableTest: boolean,
    enableNotebook: boolean,
    enableSinging: boolean,
    pointsGoldenVerse: number,
    pointsTest: number,
    pointsNotebook: number,
    pointsSinging: number,
    labelGoldenVerse: string,
    labelTest: string,
    labelNotebook: string,
    labelSinging: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteGradeSettingsSubscriptionVariables = {
  filter?: ModelSubscriptionGradeSettingsFilterInput | null,
};

export type OnDeleteGradeSettingsSubscription = {
  onDeleteGradeSettings?:  {
    __typename: "GradeSettings",
    id: string,
    gradeId: string,
    enableGoldenVerse: boolean,
    enableTest: boolean,
    enableNotebook: boolean,
    enableSinging: boolean,
    pointsGoldenVerse: number,
    pointsTest: number,
    pointsNotebook: number,
    pointsSinging: number,
    labelGoldenVerse: string,
    labelTest: string,
    labelNotebook: string,
    labelSinging: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};
