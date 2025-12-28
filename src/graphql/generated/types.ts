export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  AWSDate: { input: string; output: string; }
  AWSDateTime: { input: string; output: string; }
  AWSEmail: { input: string; output: string; }
};

export type AcademicYear = {
  createdAt: Scalars['AWSDateTime']['output'];
  endDate: Scalars['AWSDate']['output'];
  gradeId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  lessons?: Maybe<ModelLessonConnection>;
  name: Scalars['String']['output'];
  startDate: Scalars['AWSDate']['output'];
  status: AcademicYearStatus;
  updatedAt: Scalars['AWSDateTime']['output'];
};


export type AcademicYearLessonsArgs = {
  filter?: InputMaybe<ModelLessonFilterInput>;
  lessonDate?: InputMaybe<ModelStringKeyConditionInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

export type AcademicYearStatus =
  | 'ACTIVE'
  | 'FINISHED';

export type Achievement = {
  createdAt: Scalars['AWSDateTime']['output'];
  criteria: Scalars['String']['output'];
  description: Scalars['String']['output'];
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['AWSDateTime']['output'];
};

export type Book = {
  abbreviation: Scalars['String']['output'];
  createdAt: Scalars['AWSDateTime']['output'];
  fullName: Scalars['String']['output'];
  goldenVerses?: Maybe<ModelGoldenVerseConnection>;
  id: Scalars['ID']['output'];
  order: Scalars['Int']['output'];
  shortName: Scalars['String']['output'];
  testament: Scalars['String']['output'];
  updatedAt: Scalars['AWSDateTime']['output'];
};


export type BookGoldenVersesArgs = {
  chapter?: InputMaybe<ModelIntKeyConditionInput>;
  filter?: InputMaybe<ModelGoldenVerseFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

export type CreateAcademicYearInput = {
  createdAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
  endDate: Scalars['AWSDate']['input'];
  gradeId: Scalars['ID']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  startDate: Scalars['AWSDate']['input'];
  status: AcademicYearStatus;
  updatedAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
};

export type CreateAchievementInput = {
  createdAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
  criteria: Scalars['String']['input'];
  description: Scalars['String']['input'];
  icon?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
};

export type CreateBookInput = {
  abbreviation: Scalars['String']['input'];
  createdAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
  fullName: Scalars['String']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  order: Scalars['Int']['input'];
  shortName: Scalars['String']['input'];
  testament: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
};

export type CreateFamilyInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
  email?: InputMaybe<Scalars['AWSEmail']['input']>;
  fatherFirstName?: InputMaybe<Scalars['String']['input']>;
  fatherLastName?: InputMaybe<Scalars['String']['input']>;
  fatherMiddleName?: InputMaybe<Scalars['String']['input']>;
  fatherPhone?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  motherFirstName?: InputMaybe<Scalars['String']['input']>;
  motherLastName?: InputMaybe<Scalars['String']['input']>;
  motherMiddleName?: InputMaybe<Scalars['String']['input']>;
  motherPhone?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
};

export type CreateFamilyMemberInput = {
  createdAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
  familyId: Scalars['ID']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  pupilId: Scalars['ID']['input'];
};

export type CreateGoldenVerseInput = {
  bookId: Scalars['ID']['input'];
  chapter: Scalars['Int']['input'];
  createdAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  reference: Scalars['String']['input'];
  text: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
  verseEnd?: InputMaybe<Scalars['Int']['input']>;
  verseStart: Scalars['Int']['input'];
};

export type CreateGradeEventInput = {
  createdAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  eventDate: Scalars['AWSDate']['input'];
  eventType: GradeEventType;
  gradeId: Scalars['ID']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  title: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
};

export type CreateGradeInput = {
  active: Scalars['Boolean']['input'];
  createdAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  maxAge?: InputMaybe<Scalars['Int']['input']>;
  minAge?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
};

export type CreateGradeSettingsInput = {
  createdAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
  enableGoldenVerse: Scalars['Boolean']['input'];
  enableNotebook: Scalars['Boolean']['input'];
  enableSinging: Scalars['Boolean']['input'];
  enableTest: Scalars['Boolean']['input'];
  gradeId: Scalars['ID']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  labelGoldenVerse: Scalars['String']['input'];
  labelNotebook: Scalars['String']['input'];
  labelSinging: Scalars['String']['input'];
  labelTest: Scalars['String']['input'];
  pointsGoldenVerse: Scalars['Int']['input'];
  pointsNotebook: Scalars['Int']['input'];
  pointsSinging: Scalars['Int']['input'];
  pointsTest: Scalars['Int']['input'];
  updatedAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
};

export type CreateHomeworkCheckInput = {
  createdAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
  goldenVerse1Score?: InputMaybe<Scalars['Int']['input']>;
  goldenVerse2Score?: InputMaybe<Scalars['Int']['input']>;
  goldenVerse3Score?: InputMaybe<Scalars['Int']['input']>;
  gradeId: Scalars['ID']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  lessonId: Scalars['ID']['input'];
  notebookScore?: InputMaybe<Scalars['Int']['input']>;
  points: Scalars['Int']['input'];
  pupilId: Scalars['ID']['input'];
  singing: Scalars['Boolean']['input'];
  testScore?: InputMaybe<Scalars['Int']['input']>;
  updatedAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
};

export type CreateLessonGoldenVerseInput = {
  createdAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
  goldenVerseId: Scalars['ID']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  lessonId: Scalars['ID']['input'];
  order: Scalars['Int']['input'];
};

export type CreateLessonInput = {
  academicYearId: Scalars['ID']['input'];
  content?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
  gradeId: Scalars['ID']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  lessonDate: Scalars['AWSDate']['input'];
  order: Scalars['Int']['input'];
  teacherId: Scalars['ID']['input'];
  title: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
};

export type CreatePupilAchievementInput = {
  achievementId: Scalars['ID']['input'];
  awardedAt: Scalars['AWSDateTime']['input'];
  createdAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  pupilId: Scalars['ID']['input'];
};

export type CreatePupilInput = {
  active: Scalars['Boolean']['input'];
  createdAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
  dateOfBirth: Scalars['AWSDate']['input'];
  firstName: Scalars['String']['input'];
  gradeId: Scalars['ID']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  lastName: Scalars['String']['input'];
  middleName?: InputMaybe<Scalars['String']['input']>;
  photo?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
};

export type CreateUserFamilyInput = {
  createdAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
  familyId: Scalars['ID']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  phone: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};

export type CreateUserGradeInput = {
  assignedAt: Scalars['AWSDateTime']['input'];
  createdAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
  gradeId: Scalars['ID']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  userId: Scalars['ID']['input'];
};

export type CreateUserInput = {
  active: Scalars['Boolean']['input'];
  createdAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
  email: Scalars['AWSEmail']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  photo?: InputMaybe<Scalars['String']['input']>;
  role: UserRole;
  updatedAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
};

export type DeleteAcademicYearInput = {
  id: Scalars['ID']['input'];
};

export type DeleteAchievementInput = {
  id: Scalars['ID']['input'];
};

export type DeleteBookInput = {
  id: Scalars['ID']['input'];
};

export type DeleteFamilyInput = {
  id: Scalars['ID']['input'];
};

export type DeleteFamilyMemberInput = {
  id: Scalars['ID']['input'];
};

export type DeleteGoldenVerseInput = {
  id: Scalars['ID']['input'];
};

export type DeleteGradeEventInput = {
  id: Scalars['ID']['input'];
};

export type DeleteGradeInput = {
  id: Scalars['ID']['input'];
};

export type DeleteGradeSettingsInput = {
  id: Scalars['ID']['input'];
};

export type DeleteHomeworkCheckInput = {
  id: Scalars['ID']['input'];
};

export type DeleteLessonGoldenVerseInput = {
  id: Scalars['ID']['input'];
};

export type DeleteLessonInput = {
  id: Scalars['ID']['input'];
};

export type DeletePupilAchievementInput = {
  id: Scalars['ID']['input'];
};

export type DeletePupilInput = {
  id: Scalars['ID']['input'];
};

export type DeleteUserFamilyInput = {
  id: Scalars['ID']['input'];
};

export type DeleteUserGradeInput = {
  id: Scalars['ID']['input'];
};

export type DeleteUserInput = {
  id: Scalars['ID']['input'];
};

export type Family = {
  address?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['AWSDateTime']['output'];
  email?: Maybe<Scalars['AWSEmail']['output']>;
  fatherFirstName?: Maybe<Scalars['String']['output']>;
  fatherLastName?: Maybe<Scalars['String']['output']>;
  fatherMiddleName?: Maybe<Scalars['String']['output']>;
  fatherPhone?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  members?: Maybe<ModelFamilyMemberConnection>;
  motherFirstName?: Maybe<Scalars['String']['output']>;
  motherLastName?: Maybe<Scalars['String']['output']>;
  motherMiddleName?: Maybe<Scalars['String']['output']>;
  motherPhone?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['AWSDateTime']['output'];
  userFamilies?: Maybe<ModelUserFamilyConnection>;
};


export type FamilyMembersArgs = {
  filter?: InputMaybe<ModelFamilyMemberFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


export type FamilyUserFamiliesArgs = {
  filter?: InputMaybe<ModelUserFamilyFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

export type FamilyMember = {
  createdAt: Scalars['AWSDateTime']['output'];
  familyId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  pupilId: Scalars['ID']['output'];
  updatedAt: Scalars['AWSDateTime']['output'];
};

export type GoldenVerse = {
  bookId: Scalars['ID']['output'];
  chapter: Scalars['Int']['output'];
  createdAt: Scalars['AWSDateTime']['output'];
  id: Scalars['ID']['output'];
  reference: Scalars['String']['output'];
  text: Scalars['String']['output'];
  updatedAt: Scalars['AWSDateTime']['output'];
  verseEnd?: Maybe<Scalars['Int']['output']>;
  verseStart: Scalars['Int']['output'];
};

export type Grade = {
  academicYears?: Maybe<ModelAcademicYearConnection>;
  active: Scalars['Boolean']['output'];
  createdAt: Scalars['AWSDateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  maxAge?: Maybe<Scalars['Int']['output']>;
  minAge?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  pupils?: Maybe<ModelPupilConnection>;
  settings?: Maybe<GradeSettings>;
  teachers?: Maybe<ModelUserGradeConnection>;
  updatedAt: Scalars['AWSDateTime']['output'];
};


export type GradeAcademicYearsArgs = {
  filter?: InputMaybe<ModelAcademicYearFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
  startDate?: InputMaybe<ModelStringKeyConditionInput>;
};


export type GradePupilsArgs = {
  filter?: InputMaybe<ModelPupilFilterInput>;
  lastName?: InputMaybe<ModelStringKeyConditionInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


export type GradeTeachersArgs = {
  filter?: InputMaybe<ModelUserGradeFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
  userId?: InputMaybe<ModelIdKeyConditionInput>;
};

export type GradeEvent = {
  createdAt: Scalars['AWSDateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  eventDate: Scalars['AWSDate']['output'];
  eventType: GradeEventType;
  gradeId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['AWSDateTime']['output'];
};

export type GradeEventType =
  | 'LESSON'
  | 'LESSON_SKIPPING'
  | 'OUTDOOR_EVENT';

export type GradeSettings = {
  createdAt: Scalars['AWSDateTime']['output'];
  enableGoldenVerse: Scalars['Boolean']['output'];
  enableNotebook: Scalars['Boolean']['output'];
  enableSinging: Scalars['Boolean']['output'];
  enableTest: Scalars['Boolean']['output'];
  gradeId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  labelGoldenVerse: Scalars['String']['output'];
  labelNotebook: Scalars['String']['output'];
  labelSinging: Scalars['String']['output'];
  labelTest: Scalars['String']['output'];
  pointsGoldenVerse: Scalars['Int']['output'];
  pointsNotebook: Scalars['Int']['output'];
  pointsSinging: Scalars['Int']['output'];
  pointsTest: Scalars['Int']['output'];
  updatedAt: Scalars['AWSDateTime']['output'];
};

export type HomeworkCheck = {
  createdAt: Scalars['AWSDateTime']['output'];
  goldenVerse1Score?: Maybe<Scalars['Int']['output']>;
  goldenVerse2Score?: Maybe<Scalars['Int']['output']>;
  goldenVerse3Score?: Maybe<Scalars['Int']['output']>;
  gradeId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  lessonId: Scalars['ID']['output'];
  notebookScore?: Maybe<Scalars['Int']['output']>;
  points: Scalars['Int']['output'];
  pupilId: Scalars['ID']['output'];
  singing: Scalars['Boolean']['output'];
  testScore?: Maybe<Scalars['Int']['output']>;
  updatedAt: Scalars['AWSDateTime']['output'];
};

export type Lesson = {
  academicYearId: Scalars['ID']['output'];
  content?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['AWSDateTime']['output'];
  gradeId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  lessonDate: Scalars['AWSDate']['output'];
  order: Scalars['Int']['output'];
  teacherId: Scalars['ID']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['AWSDateTime']['output'];
};

export type LessonGoldenVerse = {
  createdAt: Scalars['AWSDateTime']['output'];
  goldenVerseId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  lessonId: Scalars['ID']['output'];
  order: Scalars['Int']['output'];
  updatedAt: Scalars['AWSDateTime']['output'];
};

export type ModelAcademicYearConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelAcademicYearConditionInput>>>;
  createdAt?: InputMaybe<ModelStringInput>;
  endDate?: InputMaybe<ModelStringInput>;
  gradeId?: InputMaybe<ModelIdInput>;
  name?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelAcademicYearConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelAcademicYearConditionInput>>>;
  startDate?: InputMaybe<ModelStringInput>;
  status?: InputMaybe<ModelAcademicYearStatusInput>;
  updatedAt?: InputMaybe<ModelStringInput>;
};

export type ModelAcademicYearConnection = {
  items: Array<Maybe<AcademicYear>>;
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type ModelAcademicYearFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelAcademicYearFilterInput>>>;
  createdAt?: InputMaybe<ModelStringInput>;
  endDate?: InputMaybe<ModelStringInput>;
  gradeId?: InputMaybe<ModelIdInput>;
  id?: InputMaybe<ModelIdInput>;
  name?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelAcademicYearFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelAcademicYearFilterInput>>>;
  startDate?: InputMaybe<ModelStringInput>;
  status?: InputMaybe<ModelAcademicYearStatusInput>;
  updatedAt?: InputMaybe<ModelStringInput>;
};

export type ModelAcademicYearStatusInput = {
  eq?: InputMaybe<AcademicYearStatus>;
  ne?: InputMaybe<AcademicYearStatus>;
};

export type ModelAchievementConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelAchievementConditionInput>>>;
  createdAt?: InputMaybe<ModelStringInput>;
  criteria?: InputMaybe<ModelStringInput>;
  description?: InputMaybe<ModelStringInput>;
  icon?: InputMaybe<ModelStringInput>;
  name?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelAchievementConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelAchievementConditionInput>>>;
  updatedAt?: InputMaybe<ModelStringInput>;
};

export type ModelAchievementConnection = {
  items: Array<Maybe<Achievement>>;
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type ModelAchievementFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelAchievementFilterInput>>>;
  createdAt?: InputMaybe<ModelStringInput>;
  criteria?: InputMaybe<ModelStringInput>;
  description?: InputMaybe<ModelStringInput>;
  icon?: InputMaybe<ModelStringInput>;
  id?: InputMaybe<ModelIdInput>;
  name?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelAchievementFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelAchievementFilterInput>>>;
  updatedAt?: InputMaybe<ModelStringInput>;
};

export type ModelAttributeTypes =
  | '_null'
  | 'binary'
  | 'binarySet'
  | 'bool'
  | 'list'
  | 'map'
  | 'number'
  | 'numberSet'
  | 'string'
  | 'stringSet';

export type ModelBookConditionInput = {
  abbreviation?: InputMaybe<ModelStringInput>;
  and?: InputMaybe<Array<InputMaybe<ModelBookConditionInput>>>;
  createdAt?: InputMaybe<ModelStringInput>;
  fullName?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelBookConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelBookConditionInput>>>;
  order?: InputMaybe<ModelIntInput>;
  shortName?: InputMaybe<ModelStringInput>;
  testament?: InputMaybe<ModelStringInput>;
  updatedAt?: InputMaybe<ModelStringInput>;
};

export type ModelBookConnection = {
  items: Array<Maybe<Book>>;
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type ModelBookFilterInput = {
  abbreviation?: InputMaybe<ModelStringInput>;
  and?: InputMaybe<Array<InputMaybe<ModelBookFilterInput>>>;
  createdAt?: InputMaybe<ModelStringInput>;
  fullName?: InputMaybe<ModelStringInput>;
  id?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelBookFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelBookFilterInput>>>;
  order?: InputMaybe<ModelIntInput>;
  shortName?: InputMaybe<ModelStringInput>;
  testament?: InputMaybe<ModelStringInput>;
  updatedAt?: InputMaybe<ModelStringInput>;
};

export type ModelBooleanInput = {
  attributeExists?: InputMaybe<Scalars['Boolean']['input']>;
  attributeType?: InputMaybe<ModelAttributeTypes>;
  eq?: InputMaybe<Scalars['Boolean']['input']>;
  ne?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ModelFamilyConditionInput = {
  address?: InputMaybe<ModelStringInput>;
  and?: InputMaybe<Array<InputMaybe<ModelFamilyConditionInput>>>;
  createdAt?: InputMaybe<ModelStringInput>;
  email?: InputMaybe<ModelStringInput>;
  fatherFirstName?: InputMaybe<ModelStringInput>;
  fatherLastName?: InputMaybe<ModelStringInput>;
  fatherMiddleName?: InputMaybe<ModelStringInput>;
  fatherPhone?: InputMaybe<ModelStringInput>;
  motherFirstName?: InputMaybe<ModelStringInput>;
  motherLastName?: InputMaybe<ModelStringInput>;
  motherMiddleName?: InputMaybe<ModelStringInput>;
  motherPhone?: InputMaybe<ModelStringInput>;
  name?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelFamilyConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelFamilyConditionInput>>>;
  phone?: InputMaybe<ModelStringInput>;
  updatedAt?: InputMaybe<ModelStringInput>;
};

export type ModelFamilyConnection = {
  items: Array<Maybe<Family>>;
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type ModelFamilyFilterInput = {
  address?: InputMaybe<ModelStringInput>;
  and?: InputMaybe<Array<InputMaybe<ModelFamilyFilterInput>>>;
  createdAt?: InputMaybe<ModelStringInput>;
  email?: InputMaybe<ModelStringInput>;
  fatherFirstName?: InputMaybe<ModelStringInput>;
  fatherLastName?: InputMaybe<ModelStringInput>;
  fatherMiddleName?: InputMaybe<ModelStringInput>;
  fatherPhone?: InputMaybe<ModelStringInput>;
  id?: InputMaybe<ModelIdInput>;
  motherFirstName?: InputMaybe<ModelStringInput>;
  motherLastName?: InputMaybe<ModelStringInput>;
  motherMiddleName?: InputMaybe<ModelStringInput>;
  motherPhone?: InputMaybe<ModelStringInput>;
  name?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelFamilyFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelFamilyFilterInput>>>;
  phone?: InputMaybe<ModelStringInput>;
  updatedAt?: InputMaybe<ModelStringInput>;
};

export type ModelFamilyMemberConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelFamilyMemberConditionInput>>>;
  createdAt?: InputMaybe<ModelStringInput>;
  familyId?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelFamilyMemberConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelFamilyMemberConditionInput>>>;
  pupilId?: InputMaybe<ModelIdInput>;
  updatedAt?: InputMaybe<ModelStringInput>;
};

export type ModelFamilyMemberConnection = {
  items: Array<Maybe<FamilyMember>>;
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type ModelFamilyMemberFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelFamilyMemberFilterInput>>>;
  createdAt?: InputMaybe<ModelStringInput>;
  familyId?: InputMaybe<ModelIdInput>;
  id?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelFamilyMemberFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelFamilyMemberFilterInput>>>;
  pupilId?: InputMaybe<ModelIdInput>;
};

export type ModelFloatInput = {
  attributeExists?: InputMaybe<Scalars['Boolean']['input']>;
  attributeType?: InputMaybe<ModelAttributeTypes>;
  between?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  eq?: InputMaybe<Scalars['Float']['input']>;
  ge?: InputMaybe<Scalars['Float']['input']>;
  gt?: InputMaybe<Scalars['Float']['input']>;
  le?: InputMaybe<Scalars['Float']['input']>;
  lt?: InputMaybe<Scalars['Float']['input']>;
  ne?: InputMaybe<Scalars['Float']['input']>;
};

export type ModelGoldenVerseConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelGoldenVerseConditionInput>>>;
  bookId?: InputMaybe<ModelIdInput>;
  chapter?: InputMaybe<ModelIntInput>;
  createdAt?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelGoldenVerseConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelGoldenVerseConditionInput>>>;
  reference?: InputMaybe<ModelStringInput>;
  text?: InputMaybe<ModelStringInput>;
  updatedAt?: InputMaybe<ModelStringInput>;
  verseEnd?: InputMaybe<ModelIntInput>;
  verseStart?: InputMaybe<ModelIntInput>;
};

export type ModelGoldenVerseConnection = {
  items: Array<Maybe<GoldenVerse>>;
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type ModelGoldenVerseFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelGoldenVerseFilterInput>>>;
  bookId?: InputMaybe<ModelIdInput>;
  chapter?: InputMaybe<ModelIntInput>;
  createdAt?: InputMaybe<ModelStringInput>;
  id?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelGoldenVerseFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelGoldenVerseFilterInput>>>;
  reference?: InputMaybe<ModelStringInput>;
  text?: InputMaybe<ModelStringInput>;
  updatedAt?: InputMaybe<ModelStringInput>;
  verseEnd?: InputMaybe<ModelIntInput>;
  verseStart?: InputMaybe<ModelIntInput>;
};

export type ModelGradeConditionInput = {
  active?: InputMaybe<ModelBooleanInput>;
  and?: InputMaybe<Array<InputMaybe<ModelGradeConditionInput>>>;
  createdAt?: InputMaybe<ModelStringInput>;
  description?: InputMaybe<ModelStringInput>;
  maxAge?: InputMaybe<ModelIntInput>;
  minAge?: InputMaybe<ModelIntInput>;
  name?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelGradeConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelGradeConditionInput>>>;
  updatedAt?: InputMaybe<ModelStringInput>;
};

export type ModelGradeConnection = {
  items: Array<Maybe<Grade>>;
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type ModelGradeEventConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelGradeEventConditionInput>>>;
  createdAt?: InputMaybe<ModelStringInput>;
  description?: InputMaybe<ModelStringInput>;
  eventDate?: InputMaybe<ModelStringInput>;
  eventType?: InputMaybe<ModelGradeEventTypeInput>;
  gradeId?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelGradeEventConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelGradeEventConditionInput>>>;
  title?: InputMaybe<ModelStringInput>;
  updatedAt?: InputMaybe<ModelStringInput>;
};

export type ModelGradeEventConnection = {
  items: Array<Maybe<GradeEvent>>;
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type ModelGradeEventFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelGradeEventFilterInput>>>;
  createdAt?: InputMaybe<ModelStringInput>;
  description?: InputMaybe<ModelStringInput>;
  eventDate?: InputMaybe<ModelStringInput>;
  eventType?: InputMaybe<ModelGradeEventTypeInput>;
  gradeId?: InputMaybe<ModelIdInput>;
  id?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelGradeEventFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelGradeEventFilterInput>>>;
  title?: InputMaybe<ModelStringInput>;
  updatedAt?: InputMaybe<ModelStringInput>;
};

export type ModelGradeEventTypeInput = {
  eq?: InputMaybe<GradeEventType>;
  ne?: InputMaybe<GradeEventType>;
};

export type ModelGradeFilterInput = {
  active?: InputMaybe<ModelBooleanInput>;
  and?: InputMaybe<Array<InputMaybe<ModelGradeFilterInput>>>;
  createdAt?: InputMaybe<ModelStringInput>;
  description?: InputMaybe<ModelStringInput>;
  id?: InputMaybe<ModelIdInput>;
  maxAge?: InputMaybe<ModelIntInput>;
  minAge?: InputMaybe<ModelIntInput>;
  name?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelGradeFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelGradeFilterInput>>>;
  updatedAt?: InputMaybe<ModelStringInput>;
};

export type ModelGradeSettingsConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelGradeSettingsConditionInput>>>;
  createdAt?: InputMaybe<ModelStringInput>;
  enableGoldenVerse?: InputMaybe<ModelBooleanInput>;
  enableNotebook?: InputMaybe<ModelBooleanInput>;
  enableSinging?: InputMaybe<ModelBooleanInput>;
  enableTest?: InputMaybe<ModelBooleanInput>;
  gradeId?: InputMaybe<ModelIdInput>;
  labelGoldenVerse?: InputMaybe<ModelStringInput>;
  labelNotebook?: InputMaybe<ModelStringInput>;
  labelSinging?: InputMaybe<ModelStringInput>;
  labelTest?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelGradeSettingsConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelGradeSettingsConditionInput>>>;
  pointsGoldenVerse?: InputMaybe<ModelIntInput>;
  pointsNotebook?: InputMaybe<ModelIntInput>;
  pointsSinging?: InputMaybe<ModelIntInput>;
  pointsTest?: InputMaybe<ModelIntInput>;
  updatedAt?: InputMaybe<ModelStringInput>;
};

export type ModelGradeSettingsConnection = {
  items: Array<Maybe<GradeSettings>>;
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type ModelGradeSettingsFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelGradeSettingsFilterInput>>>;
  createdAt?: InputMaybe<ModelStringInput>;
  enableGoldenVerse?: InputMaybe<ModelBooleanInput>;
  enableNotebook?: InputMaybe<ModelBooleanInput>;
  enableSinging?: InputMaybe<ModelBooleanInput>;
  enableTest?: InputMaybe<ModelBooleanInput>;
  gradeId?: InputMaybe<ModelIdInput>;
  id?: InputMaybe<ModelIdInput>;
  labelGoldenVerse?: InputMaybe<ModelStringInput>;
  labelNotebook?: InputMaybe<ModelStringInput>;
  labelSinging?: InputMaybe<ModelStringInput>;
  labelTest?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelGradeSettingsFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelGradeSettingsFilterInput>>>;
  pointsGoldenVerse?: InputMaybe<ModelIntInput>;
  pointsNotebook?: InputMaybe<ModelIntInput>;
  pointsSinging?: InputMaybe<ModelIntInput>;
  pointsTest?: InputMaybe<ModelIntInput>;
  updatedAt?: InputMaybe<ModelStringInput>;
};

export type ModelHomeworkCheckConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelHomeworkCheckConditionInput>>>;
  createdAt?: InputMaybe<ModelStringInput>;
  goldenVerse1Score?: InputMaybe<ModelIntInput>;
  goldenVerse2Score?: InputMaybe<ModelIntInput>;
  goldenVerse3Score?: InputMaybe<ModelIntInput>;
  gradeId?: InputMaybe<ModelIdInput>;
  lessonId?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelHomeworkCheckConditionInput>;
  notebookScore?: InputMaybe<ModelIntInput>;
  or?: InputMaybe<Array<InputMaybe<ModelHomeworkCheckConditionInput>>>;
  points?: InputMaybe<ModelIntInput>;
  pupilId?: InputMaybe<ModelIdInput>;
  singing?: InputMaybe<ModelBooleanInput>;
  testScore?: InputMaybe<ModelIntInput>;
  updatedAt?: InputMaybe<ModelStringInput>;
};

export type ModelHomeworkCheckConnection = {
  items: Array<Maybe<HomeworkCheck>>;
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type ModelHomeworkCheckFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelHomeworkCheckFilterInput>>>;
  createdAt?: InputMaybe<ModelStringInput>;
  goldenVerse1Score?: InputMaybe<ModelIntInput>;
  goldenVerse2Score?: InputMaybe<ModelIntInput>;
  goldenVerse3Score?: InputMaybe<ModelIntInput>;
  gradeId?: InputMaybe<ModelIdInput>;
  id?: InputMaybe<ModelIdInput>;
  lessonId?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelHomeworkCheckFilterInput>;
  notebookScore?: InputMaybe<ModelIntInput>;
  or?: InputMaybe<Array<InputMaybe<ModelHomeworkCheckFilterInput>>>;
  points?: InputMaybe<ModelIntInput>;
  pupilId?: InputMaybe<ModelIdInput>;
  singing?: InputMaybe<ModelBooleanInput>;
  testScore?: InputMaybe<ModelIntInput>;
  updatedAt?: InputMaybe<ModelStringInput>;
};

export type ModelIdInput = {
  attributeExists?: InputMaybe<Scalars['Boolean']['input']>;
  attributeType?: InputMaybe<ModelAttributeTypes>;
  beginsWith?: InputMaybe<Scalars['ID']['input']>;
  between?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contains?: InputMaybe<Scalars['ID']['input']>;
  eq?: InputMaybe<Scalars['ID']['input']>;
  ge?: InputMaybe<Scalars['ID']['input']>;
  gt?: InputMaybe<Scalars['ID']['input']>;
  le?: InputMaybe<Scalars['ID']['input']>;
  lt?: InputMaybe<Scalars['ID']['input']>;
  ne?: InputMaybe<Scalars['ID']['input']>;
  notContains?: InputMaybe<Scalars['ID']['input']>;
  size?: InputMaybe<ModelSizeInput>;
};

export type ModelIdKeyConditionInput = {
  beginsWith?: InputMaybe<Scalars['ID']['input']>;
  between?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  eq?: InputMaybe<Scalars['ID']['input']>;
  ge?: InputMaybe<Scalars['ID']['input']>;
  gt?: InputMaybe<Scalars['ID']['input']>;
  le?: InputMaybe<Scalars['ID']['input']>;
  lt?: InputMaybe<Scalars['ID']['input']>;
};

export type ModelIntInput = {
  attributeExists?: InputMaybe<Scalars['Boolean']['input']>;
  attributeType?: InputMaybe<ModelAttributeTypes>;
  between?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  eq?: InputMaybe<Scalars['Int']['input']>;
  ge?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  le?: InputMaybe<Scalars['Int']['input']>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  ne?: InputMaybe<Scalars['Int']['input']>;
};

export type ModelIntKeyConditionInput = {
  between?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  eq?: InputMaybe<Scalars['Int']['input']>;
  ge?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  le?: InputMaybe<Scalars['Int']['input']>;
  lt?: InputMaybe<Scalars['Int']['input']>;
};

export type ModelLessonConditionInput = {
  academicYearId?: InputMaybe<ModelIdInput>;
  and?: InputMaybe<Array<InputMaybe<ModelLessonConditionInput>>>;
  content?: InputMaybe<ModelStringInput>;
  createdAt?: InputMaybe<ModelStringInput>;
  gradeId?: InputMaybe<ModelIdInput>;
  lessonDate?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelLessonConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelLessonConditionInput>>>;
  order?: InputMaybe<ModelIntInput>;
  teacherId?: InputMaybe<ModelIdInput>;
  title?: InputMaybe<ModelStringInput>;
  updatedAt?: InputMaybe<ModelStringInput>;
};

export type ModelLessonConnection = {
  items: Array<Maybe<Lesson>>;
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type ModelLessonFilterInput = {
  academicYearId?: InputMaybe<ModelIdInput>;
  and?: InputMaybe<Array<InputMaybe<ModelLessonFilterInput>>>;
  content?: InputMaybe<ModelStringInput>;
  createdAt?: InputMaybe<ModelStringInput>;
  gradeId?: InputMaybe<ModelIdInput>;
  id?: InputMaybe<ModelIdInput>;
  lessonDate?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelLessonFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelLessonFilterInput>>>;
  order?: InputMaybe<ModelIntInput>;
  teacherId?: InputMaybe<ModelIdInput>;
  title?: InputMaybe<ModelStringInput>;
  updatedAt?: InputMaybe<ModelStringInput>;
};

export type ModelLessonGoldenVerseConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelLessonGoldenVerseConditionInput>>>;
  createdAt?: InputMaybe<ModelStringInput>;
  goldenVerseId?: InputMaybe<ModelIdInput>;
  lessonId?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelLessonGoldenVerseConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelLessonGoldenVerseConditionInput>>>;
  order?: InputMaybe<ModelIntInput>;
  updatedAt?: InputMaybe<ModelStringInput>;
};

export type ModelLessonGoldenVerseConnection = {
  items: Array<Maybe<LessonGoldenVerse>>;
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type ModelLessonGoldenVerseFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelLessonGoldenVerseFilterInput>>>;
  createdAt?: InputMaybe<ModelStringInput>;
  goldenVerseId?: InputMaybe<ModelIdInput>;
  id?: InputMaybe<ModelIdInput>;
  lessonId?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelLessonGoldenVerseFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelLessonGoldenVerseFilterInput>>>;
  order?: InputMaybe<ModelIntInput>;
};

export type ModelPupilAchievementConditionInput = {
  achievementId?: InputMaybe<ModelIdInput>;
  and?: InputMaybe<Array<InputMaybe<ModelPupilAchievementConditionInput>>>;
  awardedAt?: InputMaybe<ModelStringInput>;
  createdAt?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelPupilAchievementConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelPupilAchievementConditionInput>>>;
  pupilId?: InputMaybe<ModelIdInput>;
  updatedAt?: InputMaybe<ModelStringInput>;
};

export type ModelPupilAchievementConnection = {
  items: Array<Maybe<PupilAchievement>>;
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type ModelPupilAchievementFilterInput = {
  achievementId?: InputMaybe<ModelIdInput>;
  and?: InputMaybe<Array<InputMaybe<ModelPupilAchievementFilterInput>>>;
  awardedAt?: InputMaybe<ModelStringInput>;
  createdAt?: InputMaybe<ModelStringInput>;
  id?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelPupilAchievementFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelPupilAchievementFilterInput>>>;
  pupilId?: InputMaybe<ModelIdInput>;
};

export type ModelPupilConditionInput = {
  active?: InputMaybe<ModelBooleanInput>;
  and?: InputMaybe<Array<InputMaybe<ModelPupilConditionInput>>>;
  createdAt?: InputMaybe<ModelStringInput>;
  dateOfBirth?: InputMaybe<ModelStringInput>;
  firstName?: InputMaybe<ModelStringInput>;
  gradeId?: InputMaybe<ModelIdInput>;
  lastName?: InputMaybe<ModelStringInput>;
  middleName?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelPupilConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelPupilConditionInput>>>;
  photo?: InputMaybe<ModelStringInput>;
  updatedAt?: InputMaybe<ModelStringInput>;
};

export type ModelPupilConnection = {
  items: Array<Maybe<Pupil>>;
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type ModelPupilFilterInput = {
  active?: InputMaybe<ModelBooleanInput>;
  and?: InputMaybe<Array<InputMaybe<ModelPupilFilterInput>>>;
  createdAt?: InputMaybe<ModelStringInput>;
  dateOfBirth?: InputMaybe<ModelStringInput>;
  firstName?: InputMaybe<ModelStringInput>;
  gradeId?: InputMaybe<ModelIdInput>;
  id?: InputMaybe<ModelIdInput>;
  lastName?: InputMaybe<ModelStringInput>;
  middleName?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelPupilFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelPupilFilterInput>>>;
  photo?: InputMaybe<ModelStringInput>;
  updatedAt?: InputMaybe<ModelStringInput>;
};

export type ModelSizeInput = {
  between?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  eq?: InputMaybe<Scalars['Int']['input']>;
  ge?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  le?: InputMaybe<Scalars['Int']['input']>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  ne?: InputMaybe<Scalars['Int']['input']>;
};

export type ModelSortDirection =
  | 'ASC'
  | 'DESC';

export type ModelStringInput = {
  attributeExists?: InputMaybe<Scalars['Boolean']['input']>;
  attributeType?: InputMaybe<ModelAttributeTypes>;
  beginsWith?: InputMaybe<Scalars['String']['input']>;
  between?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  contains?: InputMaybe<Scalars['String']['input']>;
  eq?: InputMaybe<Scalars['String']['input']>;
  ge?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  le?: InputMaybe<Scalars['String']['input']>;
  lt?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  notContains?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<ModelSizeInput>;
};

export type ModelStringKeyConditionInput = {
  beginsWith?: InputMaybe<Scalars['String']['input']>;
  between?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  eq?: InputMaybe<Scalars['String']['input']>;
  ge?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  le?: InputMaybe<Scalars['String']['input']>;
  lt?: InputMaybe<Scalars['String']['input']>;
};

export type ModelSubscriptionAcademicYearFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionAcademicYearFilterInput>>>;
  createdAt?: InputMaybe<ModelSubscriptionStringInput>;
  endDate?: InputMaybe<ModelSubscriptionStringInput>;
  gradeId?: InputMaybe<ModelSubscriptionIdInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  name?: InputMaybe<ModelSubscriptionStringInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionAcademicYearFilterInput>>>;
  startDate?: InputMaybe<ModelSubscriptionStringInput>;
  status?: InputMaybe<ModelSubscriptionStringInput>;
  updatedAt?: InputMaybe<ModelSubscriptionStringInput>;
};

export type ModelSubscriptionAchievementFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionAchievementFilterInput>>>;
  createdAt?: InputMaybe<ModelSubscriptionStringInput>;
  criteria?: InputMaybe<ModelSubscriptionStringInput>;
  description?: InputMaybe<ModelSubscriptionStringInput>;
  icon?: InputMaybe<ModelSubscriptionStringInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  name?: InputMaybe<ModelSubscriptionStringInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionAchievementFilterInput>>>;
  updatedAt?: InputMaybe<ModelSubscriptionStringInput>;
};

export type ModelSubscriptionBookFilterInput = {
  abbreviation?: InputMaybe<ModelSubscriptionStringInput>;
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionBookFilterInput>>>;
  createdAt?: InputMaybe<ModelSubscriptionStringInput>;
  fullName?: InputMaybe<ModelSubscriptionStringInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionBookFilterInput>>>;
  order?: InputMaybe<ModelSubscriptionIntInput>;
  shortName?: InputMaybe<ModelSubscriptionStringInput>;
  testament?: InputMaybe<ModelSubscriptionStringInput>;
  updatedAt?: InputMaybe<ModelSubscriptionStringInput>;
};

export type ModelSubscriptionBooleanInput = {
  eq?: InputMaybe<Scalars['Boolean']['input']>;
  ne?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ModelSubscriptionFamilyFilterInput = {
  address?: InputMaybe<ModelSubscriptionStringInput>;
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionFamilyFilterInput>>>;
  createdAt?: InputMaybe<ModelSubscriptionStringInput>;
  email?: InputMaybe<ModelSubscriptionStringInput>;
  fatherFirstName?: InputMaybe<ModelSubscriptionStringInput>;
  fatherLastName?: InputMaybe<ModelSubscriptionStringInput>;
  fatherMiddleName?: InputMaybe<ModelSubscriptionStringInput>;
  fatherPhone?: InputMaybe<ModelSubscriptionStringInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  motherFirstName?: InputMaybe<ModelSubscriptionStringInput>;
  motherLastName?: InputMaybe<ModelSubscriptionStringInput>;
  motherMiddleName?: InputMaybe<ModelSubscriptionStringInput>;
  motherPhone?: InputMaybe<ModelSubscriptionStringInput>;
  name?: InputMaybe<ModelSubscriptionStringInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionFamilyFilterInput>>>;
  phone?: InputMaybe<ModelSubscriptionStringInput>;
  updatedAt?: InputMaybe<ModelSubscriptionStringInput>;
};

export type ModelSubscriptionFamilyMemberFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionFamilyMemberFilterInput>>>;
  createdAt?: InputMaybe<ModelSubscriptionStringInput>;
  familyId?: InputMaybe<ModelSubscriptionIdInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionFamilyMemberFilterInput>>>;
  pupilId?: InputMaybe<ModelSubscriptionIdInput>;
  updatedAt?: InputMaybe<ModelSubscriptionStringInput>;
};

export type ModelSubscriptionFloatInput = {
  between?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  eq?: InputMaybe<Scalars['Float']['input']>;
  ge?: InputMaybe<Scalars['Float']['input']>;
  gt?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  le?: InputMaybe<Scalars['Float']['input']>;
  lt?: InputMaybe<Scalars['Float']['input']>;
  ne?: InputMaybe<Scalars['Float']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};

export type ModelSubscriptionGoldenVerseFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionGoldenVerseFilterInput>>>;
  bookId?: InputMaybe<ModelSubscriptionIdInput>;
  chapter?: InputMaybe<ModelSubscriptionIntInput>;
  createdAt?: InputMaybe<ModelSubscriptionStringInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionGoldenVerseFilterInput>>>;
  reference?: InputMaybe<ModelSubscriptionStringInput>;
  text?: InputMaybe<ModelSubscriptionStringInput>;
  updatedAt?: InputMaybe<ModelSubscriptionStringInput>;
  verseEnd?: InputMaybe<ModelSubscriptionIntInput>;
  verseStart?: InputMaybe<ModelSubscriptionIntInput>;
};

export type ModelSubscriptionGradeEventFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionGradeEventFilterInput>>>;
  createdAt?: InputMaybe<ModelSubscriptionStringInput>;
  description?: InputMaybe<ModelSubscriptionStringInput>;
  eventDate?: InputMaybe<ModelSubscriptionStringInput>;
  eventType?: InputMaybe<ModelSubscriptionStringInput>;
  gradeId?: InputMaybe<ModelSubscriptionIdInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionGradeEventFilterInput>>>;
  title?: InputMaybe<ModelSubscriptionStringInput>;
  updatedAt?: InputMaybe<ModelSubscriptionStringInput>;
};

export type ModelSubscriptionGradeFilterInput = {
  active?: InputMaybe<ModelSubscriptionBooleanInput>;
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionGradeFilterInput>>>;
  createdAt?: InputMaybe<ModelSubscriptionStringInput>;
  description?: InputMaybe<ModelSubscriptionStringInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  maxAge?: InputMaybe<ModelSubscriptionIntInput>;
  minAge?: InputMaybe<ModelSubscriptionIntInput>;
  name?: InputMaybe<ModelSubscriptionStringInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionGradeFilterInput>>>;
  updatedAt?: InputMaybe<ModelSubscriptionStringInput>;
};

export type ModelSubscriptionGradeSettingsFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionGradeSettingsFilterInput>>>;
  createdAt?: InputMaybe<ModelSubscriptionStringInput>;
  enableGoldenVerse?: InputMaybe<ModelSubscriptionBooleanInput>;
  enableNotebook?: InputMaybe<ModelSubscriptionBooleanInput>;
  enableSinging?: InputMaybe<ModelSubscriptionBooleanInput>;
  enableTest?: InputMaybe<ModelSubscriptionBooleanInput>;
  gradeId?: InputMaybe<ModelSubscriptionIdInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  labelGoldenVerse?: InputMaybe<ModelSubscriptionStringInput>;
  labelNotebook?: InputMaybe<ModelSubscriptionStringInput>;
  labelSinging?: InputMaybe<ModelSubscriptionStringInput>;
  labelTest?: InputMaybe<ModelSubscriptionStringInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionGradeSettingsFilterInput>>>;
  pointsGoldenVerse?: InputMaybe<ModelSubscriptionIntInput>;
  pointsNotebook?: InputMaybe<ModelSubscriptionIntInput>;
  pointsSinging?: InputMaybe<ModelSubscriptionIntInput>;
  pointsTest?: InputMaybe<ModelSubscriptionIntInput>;
  updatedAt?: InputMaybe<ModelSubscriptionStringInput>;
};

export type ModelSubscriptionHomeworkCheckFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionHomeworkCheckFilterInput>>>;
  createdAt?: InputMaybe<ModelSubscriptionStringInput>;
  goldenVerse1Score?: InputMaybe<ModelSubscriptionIntInput>;
  goldenVerse2Score?: InputMaybe<ModelSubscriptionIntInput>;
  goldenVerse3Score?: InputMaybe<ModelSubscriptionIntInput>;
  gradeId?: InputMaybe<ModelSubscriptionIdInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  lessonId?: InputMaybe<ModelSubscriptionIdInput>;
  notebookScore?: InputMaybe<ModelSubscriptionIntInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionHomeworkCheckFilterInput>>>;
  points?: InputMaybe<ModelSubscriptionIntInput>;
  pupilId?: InputMaybe<ModelSubscriptionIdInput>;
  singing?: InputMaybe<ModelSubscriptionBooleanInput>;
  testScore?: InputMaybe<ModelSubscriptionIntInput>;
  updatedAt?: InputMaybe<ModelSubscriptionStringInput>;
};

export type ModelSubscriptionIdInput = {
  beginsWith?: InputMaybe<Scalars['ID']['input']>;
  between?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contains?: InputMaybe<Scalars['ID']['input']>;
  eq?: InputMaybe<Scalars['ID']['input']>;
  ge?: InputMaybe<Scalars['ID']['input']>;
  gt?: InputMaybe<Scalars['ID']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  le?: InputMaybe<Scalars['ID']['input']>;
  lt?: InputMaybe<Scalars['ID']['input']>;
  ne?: InputMaybe<Scalars['ID']['input']>;
  notContains?: InputMaybe<Scalars['ID']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};

export type ModelSubscriptionIntInput = {
  between?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  eq?: InputMaybe<Scalars['Int']['input']>;
  ge?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  le?: InputMaybe<Scalars['Int']['input']>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  ne?: InputMaybe<Scalars['Int']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
};

export type ModelSubscriptionLessonFilterInput = {
  academicYearId?: InputMaybe<ModelSubscriptionIdInput>;
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionLessonFilterInput>>>;
  content?: InputMaybe<ModelSubscriptionStringInput>;
  createdAt?: InputMaybe<ModelSubscriptionStringInput>;
  gradeId?: InputMaybe<ModelSubscriptionIdInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  lessonDate?: InputMaybe<ModelSubscriptionStringInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionLessonFilterInput>>>;
  order?: InputMaybe<ModelSubscriptionIntInput>;
  teacherId?: InputMaybe<ModelStringInput>;
  title?: InputMaybe<ModelSubscriptionStringInput>;
  updatedAt?: InputMaybe<ModelSubscriptionStringInput>;
};

export type ModelSubscriptionLessonGoldenVerseFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionLessonGoldenVerseFilterInput>>>;
  createdAt?: InputMaybe<ModelSubscriptionStringInput>;
  goldenVerseId?: InputMaybe<ModelSubscriptionIdInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  lessonId?: InputMaybe<ModelSubscriptionIdInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionLessonGoldenVerseFilterInput>>>;
  order?: InputMaybe<ModelSubscriptionIntInput>;
  updatedAt?: InputMaybe<ModelSubscriptionStringInput>;
};

export type ModelSubscriptionPupilAchievementFilterInput = {
  achievementId?: InputMaybe<ModelSubscriptionIdInput>;
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionPupilAchievementFilterInput>>>;
  awardedAt?: InputMaybe<ModelSubscriptionStringInput>;
  createdAt?: InputMaybe<ModelSubscriptionStringInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionPupilAchievementFilterInput>>>;
  pupilId?: InputMaybe<ModelSubscriptionIdInput>;
  updatedAt?: InputMaybe<ModelSubscriptionStringInput>;
};

export type ModelSubscriptionPupilFilterInput = {
  active?: InputMaybe<ModelSubscriptionBooleanInput>;
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionPupilFilterInput>>>;
  createdAt?: InputMaybe<ModelSubscriptionStringInput>;
  dateOfBirth?: InputMaybe<ModelSubscriptionStringInput>;
  firstName?: InputMaybe<ModelSubscriptionStringInput>;
  gradeId?: InputMaybe<ModelSubscriptionIdInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  lastName?: InputMaybe<ModelSubscriptionStringInput>;
  middleName?: InputMaybe<ModelSubscriptionStringInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionPupilFilterInput>>>;
  photo?: InputMaybe<ModelSubscriptionStringInput>;
  updatedAt?: InputMaybe<ModelSubscriptionStringInput>;
};

export type ModelSubscriptionStringInput = {
  beginsWith?: InputMaybe<Scalars['String']['input']>;
  between?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  contains?: InputMaybe<Scalars['String']['input']>;
  eq?: InputMaybe<Scalars['String']['input']>;
  ge?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  le?: InputMaybe<Scalars['String']['input']>;
  lt?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  notContains?: InputMaybe<Scalars['String']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ModelSubscriptionUserFamilyFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionUserFamilyFilterInput>>>;
  createdAt?: InputMaybe<ModelSubscriptionStringInput>;
  familyId?: InputMaybe<ModelSubscriptionIdInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionUserFamilyFilterInput>>>;
  phone?: InputMaybe<ModelSubscriptionStringInput>;
  updatedAt?: InputMaybe<ModelSubscriptionStringInput>;
  userId?: InputMaybe<ModelStringInput>;
};

export type ModelSubscriptionUserFilterInput = {
  active?: InputMaybe<ModelSubscriptionBooleanInput>;
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionUserFilterInput>>>;
  createdAt?: InputMaybe<ModelSubscriptionStringInput>;
  email?: InputMaybe<ModelSubscriptionStringInput>;
  id?: InputMaybe<ModelStringInput>;
  name?: InputMaybe<ModelSubscriptionStringInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionUserFilterInput>>>;
  photo?: InputMaybe<ModelSubscriptionStringInput>;
  role?: InputMaybe<ModelSubscriptionStringInput>;
  updatedAt?: InputMaybe<ModelSubscriptionStringInput>;
};

export type ModelSubscriptionUserGradeFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionUserGradeFilterInput>>>;
  assignedAt?: InputMaybe<ModelSubscriptionStringInput>;
  createdAt?: InputMaybe<ModelSubscriptionStringInput>;
  gradeId?: InputMaybe<ModelSubscriptionIdInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionUserGradeFilterInput>>>;
  updatedAt?: InputMaybe<ModelSubscriptionStringInput>;
  userId?: InputMaybe<ModelSubscriptionIdInput>;
};

export type ModelUserConditionInput = {
  active?: InputMaybe<ModelBooleanInput>;
  and?: InputMaybe<Array<InputMaybe<ModelUserConditionInput>>>;
  createdAt?: InputMaybe<ModelStringInput>;
  email?: InputMaybe<ModelStringInput>;
  id?: InputMaybe<ModelStringInput>;
  name?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelUserConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelUserConditionInput>>>;
  photo?: InputMaybe<ModelStringInput>;
  role?: InputMaybe<ModelUserRoleInput>;
  updatedAt?: InputMaybe<ModelStringInput>;
};

export type ModelUserConnection = {
  items: Array<Maybe<User>>;
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type ModelUserFamilyConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelUserFamilyConditionInput>>>;
  createdAt?: InputMaybe<ModelStringInput>;
  familyId?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelUserFamilyConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelUserFamilyConditionInput>>>;
  phone?: InputMaybe<ModelStringInput>;
  updatedAt?: InputMaybe<ModelStringInput>;
  userId?: InputMaybe<ModelIdInput>;
};

export type ModelUserFamilyConnection = {
  items: Array<Maybe<UserFamily>>;
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type ModelUserFamilyFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelUserFamilyFilterInput>>>;
  createdAt?: InputMaybe<ModelStringInput>;
  familyId?: InputMaybe<ModelIdInput>;
  id?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelUserFamilyFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelUserFamilyFilterInput>>>;
  phone?: InputMaybe<ModelStringInput>;
  userId?: InputMaybe<ModelIdInput>;
};

export type ModelUserFilterInput = {
  active?: InputMaybe<ModelBooleanInput>;
  and?: InputMaybe<Array<InputMaybe<ModelUserFilterInput>>>;
  createdAt?: InputMaybe<ModelStringInput>;
  email?: InputMaybe<ModelStringInput>;
  id?: InputMaybe<ModelIdInput>;
  name?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelUserFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelUserFilterInput>>>;
  photo?: InputMaybe<ModelStringInput>;
  role?: InputMaybe<ModelUserRoleInput>;
  updatedAt?: InputMaybe<ModelStringInput>;
};

export type ModelUserGradeConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelUserGradeConditionInput>>>;
  assignedAt?: InputMaybe<ModelStringInput>;
  createdAt?: InputMaybe<ModelStringInput>;
  gradeId?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelUserGradeConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelUserGradeConditionInput>>>;
  updatedAt?: InputMaybe<ModelStringInput>;
  userId?: InputMaybe<ModelIdInput>;
};

export type ModelUserGradeConnection = {
  items: Array<Maybe<UserGrade>>;
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type ModelUserGradeFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelUserGradeFilterInput>>>;
  assignedAt?: InputMaybe<ModelStringInput>;
  createdAt?: InputMaybe<ModelStringInput>;
  gradeId?: InputMaybe<ModelIdInput>;
  id?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelUserGradeFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelUserGradeFilterInput>>>;
  userId?: InputMaybe<ModelIdInput>;
};

export type ModelUserRoleInput = {
  eq?: InputMaybe<UserRole>;
  ne?: InputMaybe<UserRole>;
};

export type Mutation = {
  createAcademicYear?: Maybe<AcademicYear>;
  createAchievement?: Maybe<Achievement>;
  createBook?: Maybe<Book>;
  createFamily?: Maybe<Family>;
  createFamilyMember?: Maybe<FamilyMember>;
  createGoldenVerse?: Maybe<GoldenVerse>;
  createGrade?: Maybe<Grade>;
  createGradeEvent?: Maybe<GradeEvent>;
  createGradeSettings?: Maybe<GradeSettings>;
  createHomeworkCheck?: Maybe<HomeworkCheck>;
  createLesson?: Maybe<Lesson>;
  createLessonGoldenVerse?: Maybe<LessonGoldenVerse>;
  createPupil?: Maybe<Pupil>;
  createPupilAchievement?: Maybe<PupilAchievement>;
  createUser?: Maybe<User>;
  createUserFamily?: Maybe<UserFamily>;
  createUserGrade?: Maybe<UserGrade>;
  deleteAcademicYear?: Maybe<AcademicYear>;
  deleteAchievement?: Maybe<Achievement>;
  deleteBook?: Maybe<Book>;
  deleteFamily?: Maybe<Family>;
  deleteFamilyMember?: Maybe<FamilyMember>;
  deleteGoldenVerse?: Maybe<GoldenVerse>;
  deleteGrade?: Maybe<Grade>;
  deleteGradeEvent?: Maybe<GradeEvent>;
  deleteGradeSettings?: Maybe<GradeSettings>;
  deleteHomeworkCheck?: Maybe<HomeworkCheck>;
  deleteLesson?: Maybe<Lesson>;
  deleteLessonGoldenVerse?: Maybe<LessonGoldenVerse>;
  deletePupil?: Maybe<Pupil>;
  deletePupilAchievement?: Maybe<PupilAchievement>;
  deleteUser?: Maybe<User>;
  deleteUserFamily?: Maybe<UserFamily>;
  deleteUserGrade?: Maybe<UserGrade>;
  updateAcademicYear?: Maybe<AcademicYear>;
  updateAchievement?: Maybe<Achievement>;
  updateBook?: Maybe<Book>;
  updateFamily?: Maybe<Family>;
  updateFamilyMember?: Maybe<FamilyMember>;
  updateGoldenVerse?: Maybe<GoldenVerse>;
  updateGrade?: Maybe<Grade>;
  updateGradeEvent?: Maybe<GradeEvent>;
  updateGradeSettings?: Maybe<GradeSettings>;
  updateHomeworkCheck?: Maybe<HomeworkCheck>;
  updateLesson?: Maybe<Lesson>;
  updateLessonGoldenVerse?: Maybe<LessonGoldenVerse>;
  updatePupil?: Maybe<Pupil>;
  updatePupilAchievement?: Maybe<PupilAchievement>;
  updateUser?: Maybe<User>;
  updateUserFamily?: Maybe<UserFamily>;
  updateUserGrade?: Maybe<UserGrade>;
};


export type MutationCreateAcademicYearArgs = {
  condition?: InputMaybe<ModelAcademicYearConditionInput>;
  input: CreateAcademicYearInput;
};


export type MutationCreateAchievementArgs = {
  condition?: InputMaybe<ModelAchievementConditionInput>;
  input: CreateAchievementInput;
};


export type MutationCreateBookArgs = {
  condition?: InputMaybe<ModelBookConditionInput>;
  input: CreateBookInput;
};


export type MutationCreateFamilyArgs = {
  condition?: InputMaybe<ModelFamilyConditionInput>;
  input: CreateFamilyInput;
};


export type MutationCreateFamilyMemberArgs = {
  condition?: InputMaybe<ModelFamilyMemberConditionInput>;
  input: CreateFamilyMemberInput;
};


export type MutationCreateGoldenVerseArgs = {
  condition?: InputMaybe<ModelGoldenVerseConditionInput>;
  input: CreateGoldenVerseInput;
};


export type MutationCreateGradeArgs = {
  condition?: InputMaybe<ModelGradeConditionInput>;
  input: CreateGradeInput;
};


export type MutationCreateGradeEventArgs = {
  condition?: InputMaybe<ModelGradeEventConditionInput>;
  input: CreateGradeEventInput;
};


export type MutationCreateGradeSettingsArgs = {
  condition?: InputMaybe<ModelGradeSettingsConditionInput>;
  input: CreateGradeSettingsInput;
};


export type MutationCreateHomeworkCheckArgs = {
  condition?: InputMaybe<ModelHomeworkCheckConditionInput>;
  input: CreateHomeworkCheckInput;
};


export type MutationCreateLessonArgs = {
  condition?: InputMaybe<ModelLessonConditionInput>;
  input: CreateLessonInput;
};


export type MutationCreateLessonGoldenVerseArgs = {
  condition?: InputMaybe<ModelLessonGoldenVerseConditionInput>;
  input: CreateLessonGoldenVerseInput;
};


export type MutationCreatePupilArgs = {
  condition?: InputMaybe<ModelPupilConditionInput>;
  input: CreatePupilInput;
};


export type MutationCreatePupilAchievementArgs = {
  condition?: InputMaybe<ModelPupilAchievementConditionInput>;
  input: CreatePupilAchievementInput;
};


export type MutationCreateUserArgs = {
  condition?: InputMaybe<ModelUserConditionInput>;
  input: CreateUserInput;
};


export type MutationCreateUserFamilyArgs = {
  condition?: InputMaybe<ModelUserFamilyConditionInput>;
  input: CreateUserFamilyInput;
};


export type MutationCreateUserGradeArgs = {
  condition?: InputMaybe<ModelUserGradeConditionInput>;
  input: CreateUserGradeInput;
};


export type MutationDeleteAcademicYearArgs = {
  condition?: InputMaybe<ModelAcademicYearConditionInput>;
  input: DeleteAcademicYearInput;
};


export type MutationDeleteAchievementArgs = {
  condition?: InputMaybe<ModelAchievementConditionInput>;
  input: DeleteAchievementInput;
};


export type MutationDeleteBookArgs = {
  condition?: InputMaybe<ModelBookConditionInput>;
  input: DeleteBookInput;
};


export type MutationDeleteFamilyArgs = {
  condition?: InputMaybe<ModelFamilyConditionInput>;
  input: DeleteFamilyInput;
};


export type MutationDeleteFamilyMemberArgs = {
  condition?: InputMaybe<ModelFamilyMemberConditionInput>;
  input: DeleteFamilyMemberInput;
};


export type MutationDeleteGoldenVerseArgs = {
  condition?: InputMaybe<ModelGoldenVerseConditionInput>;
  input: DeleteGoldenVerseInput;
};


export type MutationDeleteGradeArgs = {
  condition?: InputMaybe<ModelGradeConditionInput>;
  input: DeleteGradeInput;
};


export type MutationDeleteGradeEventArgs = {
  condition?: InputMaybe<ModelGradeEventConditionInput>;
  input: DeleteGradeEventInput;
};


export type MutationDeleteGradeSettingsArgs = {
  condition?: InputMaybe<ModelGradeSettingsConditionInput>;
  input: DeleteGradeSettingsInput;
};


export type MutationDeleteHomeworkCheckArgs = {
  condition?: InputMaybe<ModelHomeworkCheckConditionInput>;
  input: DeleteHomeworkCheckInput;
};


export type MutationDeleteLessonArgs = {
  condition?: InputMaybe<ModelLessonConditionInput>;
  input: DeleteLessonInput;
};


export type MutationDeleteLessonGoldenVerseArgs = {
  condition?: InputMaybe<ModelLessonGoldenVerseConditionInput>;
  input: DeleteLessonGoldenVerseInput;
};


export type MutationDeletePupilArgs = {
  condition?: InputMaybe<ModelPupilConditionInput>;
  input: DeletePupilInput;
};


export type MutationDeletePupilAchievementArgs = {
  condition?: InputMaybe<ModelPupilAchievementConditionInput>;
  input: DeletePupilAchievementInput;
};


export type MutationDeleteUserArgs = {
  condition?: InputMaybe<ModelUserConditionInput>;
  input: DeleteUserInput;
};


export type MutationDeleteUserFamilyArgs = {
  condition?: InputMaybe<ModelUserFamilyConditionInput>;
  input: DeleteUserFamilyInput;
};


export type MutationDeleteUserGradeArgs = {
  condition?: InputMaybe<ModelUserGradeConditionInput>;
  input: DeleteUserGradeInput;
};


export type MutationUpdateAcademicYearArgs = {
  condition?: InputMaybe<ModelAcademicYearConditionInput>;
  input: UpdateAcademicYearInput;
};


export type MutationUpdateAchievementArgs = {
  condition?: InputMaybe<ModelAchievementConditionInput>;
  input: UpdateAchievementInput;
};


export type MutationUpdateBookArgs = {
  condition?: InputMaybe<ModelBookConditionInput>;
  input: UpdateBookInput;
};


export type MutationUpdateFamilyArgs = {
  condition?: InputMaybe<ModelFamilyConditionInput>;
  input: UpdateFamilyInput;
};


export type MutationUpdateFamilyMemberArgs = {
  condition?: InputMaybe<ModelFamilyMemberConditionInput>;
  input: UpdateFamilyMemberInput;
};


export type MutationUpdateGoldenVerseArgs = {
  condition?: InputMaybe<ModelGoldenVerseConditionInput>;
  input: UpdateGoldenVerseInput;
};


export type MutationUpdateGradeArgs = {
  condition?: InputMaybe<ModelGradeConditionInput>;
  input: UpdateGradeInput;
};


export type MutationUpdateGradeEventArgs = {
  condition?: InputMaybe<ModelGradeEventConditionInput>;
  input: UpdateGradeEventInput;
};


export type MutationUpdateGradeSettingsArgs = {
  condition?: InputMaybe<ModelGradeSettingsConditionInput>;
  input: UpdateGradeSettingsInput;
};


export type MutationUpdateHomeworkCheckArgs = {
  condition?: InputMaybe<ModelHomeworkCheckConditionInput>;
  input: UpdateHomeworkCheckInput;
};


export type MutationUpdateLessonArgs = {
  condition?: InputMaybe<ModelLessonConditionInput>;
  input: UpdateLessonInput;
};


export type MutationUpdateLessonGoldenVerseArgs = {
  condition?: InputMaybe<ModelLessonGoldenVerseConditionInput>;
  input: UpdateLessonGoldenVerseInput;
};


export type MutationUpdatePupilArgs = {
  condition?: InputMaybe<ModelPupilConditionInput>;
  input: UpdatePupilInput;
};


export type MutationUpdatePupilAchievementArgs = {
  condition?: InputMaybe<ModelPupilAchievementConditionInput>;
  input: UpdatePupilAchievementInput;
};


export type MutationUpdateUserArgs = {
  condition?: InputMaybe<ModelUserConditionInput>;
  input: UpdateUserInput;
};


export type MutationUpdateUserFamilyArgs = {
  condition?: InputMaybe<ModelUserFamilyConditionInput>;
  input: UpdateUserFamilyInput;
};


export type MutationUpdateUserGradeArgs = {
  condition?: InputMaybe<ModelUserGradeConditionInput>;
  input: UpdateUserGradeInput;
};

export type Pupil = {
  active: Scalars['Boolean']['output'];
  createdAt: Scalars['AWSDateTime']['output'];
  dateOfBirth: Scalars['AWSDate']['output'];
  families?: Maybe<ModelFamilyMemberConnection>;
  firstName: Scalars['String']['output'];
  gradeId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  middleName?: Maybe<Scalars['String']['output']>;
  photo?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['AWSDateTime']['output'];
};


export type PupilFamiliesArgs = {
  filter?: InputMaybe<ModelFamilyMemberFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

export type PupilAchievement = {
  achievementId: Scalars['ID']['output'];
  awardedAt: Scalars['AWSDateTime']['output'];
  createdAt: Scalars['AWSDateTime']['output'];
  id: Scalars['ID']['output'];
  pupilId: Scalars['ID']['output'];
  updatedAt: Scalars['AWSDateTime']['output'];
};

export type Query = {
  academicYearsByGradeIdAndStartDate?: Maybe<ModelAcademicYearConnection>;
  academicYearsByStatusAndGradeId?: Maybe<ModelAcademicYearConnection>;
  achievementsByName?: Maybe<ModelAchievementConnection>;
  booksByShortName?: Maybe<ModelBookConnection>;
  booksByTestamentAndOrder?: Maybe<ModelBookConnection>;
  familiesByFatherPhone?: Maybe<ModelFamilyConnection>;
  familiesByMotherPhone?: Maybe<ModelFamilyConnection>;
  familyMembersByFamilyId?: Maybe<ModelFamilyMemberConnection>;
  familyMembersByPupilId?: Maybe<ModelFamilyMemberConnection>;
  getAcademicYear?: Maybe<AcademicYear>;
  getAchievement?: Maybe<Achievement>;
  getBook?: Maybe<Book>;
  getFamily?: Maybe<Family>;
  getGoldenVerse?: Maybe<GoldenVerse>;
  getGrade?: Maybe<Grade>;
  getGradeEvent?: Maybe<GradeEvent>;
  getGradeSettings?: Maybe<GradeSettings>;
  getHomeworkCheck?: Maybe<HomeworkCheck>;
  getLesson?: Maybe<Lesson>;
  getPupil?: Maybe<Pupil>;
  getUser?: Maybe<User>;
  goldenVersesByBookIdAndChapter?: Maybe<ModelGoldenVerseConnection>;
  goldenVersesByReference?: Maybe<ModelGoldenVerseConnection>;
  gradeEventsByGradeIdAndEventDate?: Maybe<ModelGradeEventConnection>;
  gradeSettingsByGradeId?: Maybe<ModelGradeSettingsConnection>;
  homeworkChecksByGradeIdAndCreatedAt?: Maybe<ModelHomeworkCheckConnection>;
  homeworkChecksByLessonIdAndPupilId?: Maybe<ModelHomeworkCheckConnection>;
  homeworkChecksByPupilIdAndCreatedAt?: Maybe<ModelHomeworkCheckConnection>;
  lessonGoldenVersesByGoldenVerseId?: Maybe<ModelLessonGoldenVerseConnection>;
  lessonGoldenVersesByLessonIdAndOrder?: Maybe<ModelLessonGoldenVerseConnection>;
  lessonsByAcademicYearIdAndLessonDate?: Maybe<ModelLessonConnection>;
  lessonsByGradeIdAndLessonDate?: Maybe<ModelLessonConnection>;
  lessonsByTeacherIdAndCreatedAt?: Maybe<ModelLessonConnection>;
  listAcademicYears?: Maybe<ModelAcademicYearConnection>;
  listAchievements?: Maybe<ModelAchievementConnection>;
  listBooks?: Maybe<ModelBookConnection>;
  listFamilies?: Maybe<ModelFamilyConnection>;
  listGoldenVerses?: Maybe<ModelGoldenVerseConnection>;
  listGradeEvents?: Maybe<ModelGradeEventConnection>;
  listGradeSettings?: Maybe<ModelGradeSettingsConnection>;
  listGrades?: Maybe<ModelGradeConnection>;
  listHomeworkChecks?: Maybe<ModelHomeworkCheckConnection>;
  listLessons?: Maybe<ModelLessonConnection>;
  listPupils?: Maybe<ModelPupilConnection>;
  listUsers?: Maybe<ModelUserConnection>;
  pupilAchievementsByAchievementId?: Maybe<ModelPupilAchievementConnection>;
  pupilAchievementsByPupilIdAndAwardedAt?: Maybe<ModelPupilAchievementConnection>;
  pupilsByGradeIdAndLastName?: Maybe<ModelPupilConnection>;
  userFamiliesByFamilyId?: Maybe<ModelUserFamilyConnection>;
  userFamiliesByPhone?: Maybe<ModelUserFamilyConnection>;
  userFamiliesByUserId?: Maybe<ModelUserFamilyConnection>;
  userGradesByGradeIdAndUserId?: Maybe<ModelUserGradeConnection>;
  userGradesByUserIdAndGradeId?: Maybe<ModelUserGradeConnection>;
  usersByEmail?: Maybe<ModelUserConnection>;
  usersByRoleAndCreatedAt?: Maybe<ModelUserConnection>;
};


export type QueryAcademicYearsByGradeIdAndStartDateArgs = {
  filter?: InputMaybe<ModelAcademicYearFilterInput>;
  gradeId: Scalars['ID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
  startDate?: InputMaybe<ModelStringKeyConditionInput>;
};


export type QueryAcademicYearsByStatusAndGradeIdArgs = {
  filter?: InputMaybe<ModelAcademicYearFilterInput>;
  gradeId?: InputMaybe<ModelIdKeyConditionInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
  status: AcademicYearStatus;
};


export type QueryAchievementsByNameArgs = {
  filter?: InputMaybe<ModelAchievementFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


export type QueryBooksByShortNameArgs = {
  filter?: InputMaybe<ModelBookFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  shortName: Scalars['String']['input'];
  sortDirection?: InputMaybe<ModelSortDirection>;
};


export type QueryBooksByTestamentAndOrderArgs = {
  filter?: InputMaybe<ModelBookFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<ModelIntKeyConditionInput>;
  sortDirection?: InputMaybe<ModelSortDirection>;
  testament: Scalars['String']['input'];
};


export type QueryFamiliesByFatherPhoneArgs = {
  fatherPhone: Scalars['String']['input'];
  filter?: InputMaybe<ModelFamilyFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


export type QueryFamiliesByMotherPhoneArgs = {
  filter?: InputMaybe<ModelFamilyFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  motherPhone: Scalars['String']['input'];
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


export type QueryFamilyMembersByFamilyIdArgs = {
  familyId: Scalars['ID']['input'];
  filter?: InputMaybe<ModelFamilyMemberFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


export type QueryFamilyMembersByPupilIdArgs = {
  filter?: InputMaybe<ModelFamilyMemberFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  pupilId: Scalars['ID']['input'];
  sortDirection?: InputMaybe<ModelSortDirection>;
};


export type QueryGetAcademicYearArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetAchievementArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetBookArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetFamilyArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetGoldenVerseArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetGradeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetGradeEventArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetGradeSettingsArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetHomeworkCheckArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetLessonArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetPupilArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGoldenVersesByBookIdAndChapterArgs = {
  bookId: Scalars['ID']['input'];
  chapter?: InputMaybe<ModelIntKeyConditionInput>;
  filter?: InputMaybe<ModelGoldenVerseFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


export type QueryGoldenVersesByReferenceArgs = {
  filter?: InputMaybe<ModelGoldenVerseFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  reference: Scalars['String']['input'];
  sortDirection?: InputMaybe<ModelSortDirection>;
};


export type QueryGradeEventsByGradeIdAndEventDateArgs = {
  eventDate?: InputMaybe<ModelStringKeyConditionInput>;
  filter?: InputMaybe<ModelGradeEventFilterInput>;
  gradeId: Scalars['ID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


export type QueryGradeSettingsByGradeIdArgs = {
  filter?: InputMaybe<ModelGradeSettingsFilterInput>;
  gradeId: Scalars['ID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


export type QueryHomeworkChecksByGradeIdAndCreatedAtArgs = {
  createdAt?: InputMaybe<ModelStringKeyConditionInput>;
  filter?: InputMaybe<ModelHomeworkCheckFilterInput>;
  gradeId: Scalars['ID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


export type QueryHomeworkChecksByLessonIdAndPupilIdArgs = {
  filter?: InputMaybe<ModelHomeworkCheckFilterInput>;
  lessonId: Scalars['ID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  pupilId?: InputMaybe<ModelIdKeyConditionInput>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


export type QueryHomeworkChecksByPupilIdAndCreatedAtArgs = {
  createdAt?: InputMaybe<ModelStringKeyConditionInput>;
  filter?: InputMaybe<ModelHomeworkCheckFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  pupilId: Scalars['ID']['input'];
  sortDirection?: InputMaybe<ModelSortDirection>;
};


export type QueryLessonGoldenVersesByGoldenVerseIdArgs = {
  filter?: InputMaybe<ModelLessonGoldenVerseFilterInput>;
  goldenVerseId: Scalars['ID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


export type QueryLessonGoldenVersesByLessonIdAndOrderArgs = {
  filter?: InputMaybe<ModelLessonGoldenVerseFilterInput>;
  lessonId: Scalars['ID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<ModelIntKeyConditionInput>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


export type QueryLessonsByAcademicYearIdAndLessonDateArgs = {
  academicYearId: Scalars['ID']['input'];
  filter?: InputMaybe<ModelLessonFilterInput>;
  lessonDate?: InputMaybe<ModelStringKeyConditionInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


export type QueryLessonsByGradeIdAndLessonDateArgs = {
  filter?: InputMaybe<ModelLessonFilterInput>;
  gradeId: Scalars['ID']['input'];
  lessonDate?: InputMaybe<ModelStringKeyConditionInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


export type QueryLessonsByTeacherIdAndCreatedAtArgs = {
  createdAt?: InputMaybe<ModelStringKeyConditionInput>;
  filter?: InputMaybe<ModelLessonFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
  teacherId: Scalars['ID']['input'];
};


export type QueryListAcademicYearsArgs = {
  filter?: InputMaybe<ModelAcademicYearFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
};


export type QueryListAchievementsArgs = {
  filter?: InputMaybe<ModelAchievementFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
};


export type QueryListBooksArgs = {
  filter?: InputMaybe<ModelBookFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
};


export type QueryListFamiliesArgs = {
  filter?: InputMaybe<ModelFamilyFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
};


export type QueryListGoldenVersesArgs = {
  filter?: InputMaybe<ModelGoldenVerseFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
};


export type QueryListGradeEventsArgs = {
  filter?: InputMaybe<ModelGradeEventFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
};


export type QueryListGradeSettingsArgs = {
  filter?: InputMaybe<ModelGradeSettingsFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
};


export type QueryListGradesArgs = {
  filter?: InputMaybe<ModelGradeFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
};


export type QueryListHomeworkChecksArgs = {
  filter?: InputMaybe<ModelHomeworkCheckFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
};


export type QueryListLessonsArgs = {
  filter?: InputMaybe<ModelLessonFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
};


export type QueryListPupilsArgs = {
  filter?: InputMaybe<ModelPupilFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
};


export type QueryListUsersArgs = {
  filter?: InputMaybe<ModelUserFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
};


export type QueryPupilAchievementsByAchievementIdArgs = {
  achievementId: Scalars['ID']['input'];
  filter?: InputMaybe<ModelPupilAchievementFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


export type QueryPupilAchievementsByPupilIdAndAwardedAtArgs = {
  awardedAt?: InputMaybe<ModelStringKeyConditionInput>;
  filter?: InputMaybe<ModelPupilAchievementFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  pupilId: Scalars['ID']['input'];
  sortDirection?: InputMaybe<ModelSortDirection>;
};


export type QueryPupilsByGradeIdAndLastNameArgs = {
  filter?: InputMaybe<ModelPupilFilterInput>;
  gradeId: Scalars['ID']['input'];
  lastName?: InputMaybe<ModelStringKeyConditionInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


export type QueryUserFamiliesByFamilyIdArgs = {
  familyId: Scalars['ID']['input'];
  filter?: InputMaybe<ModelUserFamilyFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


export type QueryUserFamiliesByPhoneArgs = {
  filter?: InputMaybe<ModelUserFamilyFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  phone: Scalars['String']['input'];
  sortDirection?: InputMaybe<ModelSortDirection>;
};


export type QueryUserFamiliesByUserIdArgs = {
  filter?: InputMaybe<ModelUserFamilyFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
  userId: Scalars['ID']['input'];
};


export type QueryUserGradesByGradeIdAndUserIdArgs = {
  filter?: InputMaybe<ModelUserGradeFilterInput>;
  gradeId: Scalars['ID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
  userId?: InputMaybe<ModelIdKeyConditionInput>;
};


export type QueryUserGradesByUserIdAndGradeIdArgs = {
  filter?: InputMaybe<ModelUserGradeFilterInput>;
  gradeId?: InputMaybe<ModelIdKeyConditionInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
  userId: Scalars['ID']['input'];
};


export type QueryUsersByEmailArgs = {
  email: Scalars['AWSEmail']['input'];
  filter?: InputMaybe<ModelUserFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


export type QueryUsersByRoleAndCreatedAtArgs = {
  createdAt?: InputMaybe<ModelStringKeyConditionInput>;
  filter?: InputMaybe<ModelUserFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  role: UserRole;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

export type Subscription = {
  onCreateAcademicYear?: Maybe<AcademicYear>;
  onCreateAchievement?: Maybe<Achievement>;
  onCreateBook?: Maybe<Book>;
  onCreateFamily?: Maybe<Family>;
  onCreateFamilyMember?: Maybe<FamilyMember>;
  onCreateGoldenVerse?: Maybe<GoldenVerse>;
  onCreateGrade?: Maybe<Grade>;
  onCreateGradeEvent?: Maybe<GradeEvent>;
  onCreateGradeSettings?: Maybe<GradeSettings>;
  onCreateHomeworkCheck?: Maybe<HomeworkCheck>;
  onCreateLesson?: Maybe<Lesson>;
  onCreateLessonGoldenVerse?: Maybe<LessonGoldenVerse>;
  onCreatePupil?: Maybe<Pupil>;
  onCreatePupilAchievement?: Maybe<PupilAchievement>;
  onCreateUser?: Maybe<User>;
  onCreateUserFamily?: Maybe<UserFamily>;
  onCreateUserGrade?: Maybe<UserGrade>;
  onDeleteAcademicYear?: Maybe<AcademicYear>;
  onDeleteAchievement?: Maybe<Achievement>;
  onDeleteBook?: Maybe<Book>;
  onDeleteFamily?: Maybe<Family>;
  onDeleteFamilyMember?: Maybe<FamilyMember>;
  onDeleteGoldenVerse?: Maybe<GoldenVerse>;
  onDeleteGrade?: Maybe<Grade>;
  onDeleteGradeEvent?: Maybe<GradeEvent>;
  onDeleteGradeSettings?: Maybe<GradeSettings>;
  onDeleteHomeworkCheck?: Maybe<HomeworkCheck>;
  onDeleteLesson?: Maybe<Lesson>;
  onDeleteLessonGoldenVerse?: Maybe<LessonGoldenVerse>;
  onDeletePupil?: Maybe<Pupil>;
  onDeletePupilAchievement?: Maybe<PupilAchievement>;
  onDeleteUser?: Maybe<User>;
  onDeleteUserFamily?: Maybe<UserFamily>;
  onDeleteUserGrade?: Maybe<UserGrade>;
  onUpdateAcademicYear?: Maybe<AcademicYear>;
  onUpdateAchievement?: Maybe<Achievement>;
  onUpdateBook?: Maybe<Book>;
  onUpdateFamily?: Maybe<Family>;
  onUpdateFamilyMember?: Maybe<FamilyMember>;
  onUpdateGoldenVerse?: Maybe<GoldenVerse>;
  onUpdateGrade?: Maybe<Grade>;
  onUpdateGradeEvent?: Maybe<GradeEvent>;
  onUpdateGradeSettings?: Maybe<GradeSettings>;
  onUpdateHomeworkCheck?: Maybe<HomeworkCheck>;
  onUpdateLesson?: Maybe<Lesson>;
  onUpdateLessonGoldenVerse?: Maybe<LessonGoldenVerse>;
  onUpdatePupil?: Maybe<Pupil>;
  onUpdatePupilAchievement?: Maybe<PupilAchievement>;
  onUpdateUser?: Maybe<User>;
  onUpdateUserFamily?: Maybe<UserFamily>;
  onUpdateUserGrade?: Maybe<UserGrade>;
};


export type SubscriptionOnCreateAcademicYearArgs = {
  filter?: InputMaybe<ModelSubscriptionAcademicYearFilterInput>;
};


export type SubscriptionOnCreateAchievementArgs = {
  filter?: InputMaybe<ModelSubscriptionAchievementFilterInput>;
};


export type SubscriptionOnCreateBookArgs = {
  filter?: InputMaybe<ModelSubscriptionBookFilterInput>;
};


export type SubscriptionOnCreateFamilyArgs = {
  filter?: InputMaybe<ModelSubscriptionFamilyFilterInput>;
};


export type SubscriptionOnCreateFamilyMemberArgs = {
  filter?: InputMaybe<ModelSubscriptionFamilyMemberFilterInput>;
};


export type SubscriptionOnCreateGoldenVerseArgs = {
  filter?: InputMaybe<ModelSubscriptionGoldenVerseFilterInput>;
};


export type SubscriptionOnCreateGradeArgs = {
  filter?: InputMaybe<ModelSubscriptionGradeFilterInput>;
};


export type SubscriptionOnCreateGradeEventArgs = {
  filter?: InputMaybe<ModelSubscriptionGradeEventFilterInput>;
};


export type SubscriptionOnCreateGradeSettingsArgs = {
  filter?: InputMaybe<ModelSubscriptionGradeSettingsFilterInput>;
};


export type SubscriptionOnCreateHomeworkCheckArgs = {
  filter?: InputMaybe<ModelSubscriptionHomeworkCheckFilterInput>;
};


export type SubscriptionOnCreateLessonArgs = {
  filter?: InputMaybe<ModelSubscriptionLessonFilterInput>;
};


export type SubscriptionOnCreateLessonGoldenVerseArgs = {
  filter?: InputMaybe<ModelSubscriptionLessonGoldenVerseFilterInput>;
};


export type SubscriptionOnCreatePupilArgs = {
  filter?: InputMaybe<ModelSubscriptionPupilFilterInput>;
};


export type SubscriptionOnCreatePupilAchievementArgs = {
  filter?: InputMaybe<ModelSubscriptionPupilAchievementFilterInput>;
};


export type SubscriptionOnCreateUserArgs = {
  filter?: InputMaybe<ModelSubscriptionUserFilterInput>;
  id?: InputMaybe<Scalars['String']['input']>;
};


export type SubscriptionOnCreateUserFamilyArgs = {
  filter?: InputMaybe<ModelSubscriptionUserFamilyFilterInput>;
  userId?: InputMaybe<Scalars['String']['input']>;
};


export type SubscriptionOnCreateUserGradeArgs = {
  filter?: InputMaybe<ModelSubscriptionUserGradeFilterInput>;
};


export type SubscriptionOnDeleteAcademicYearArgs = {
  filter?: InputMaybe<ModelSubscriptionAcademicYearFilterInput>;
};


export type SubscriptionOnDeleteAchievementArgs = {
  filter?: InputMaybe<ModelSubscriptionAchievementFilterInput>;
};


export type SubscriptionOnDeleteBookArgs = {
  filter?: InputMaybe<ModelSubscriptionBookFilterInput>;
};


export type SubscriptionOnDeleteFamilyArgs = {
  filter?: InputMaybe<ModelSubscriptionFamilyFilterInput>;
};


export type SubscriptionOnDeleteFamilyMemberArgs = {
  filter?: InputMaybe<ModelSubscriptionFamilyMemberFilterInput>;
};


export type SubscriptionOnDeleteGoldenVerseArgs = {
  filter?: InputMaybe<ModelSubscriptionGoldenVerseFilterInput>;
};


export type SubscriptionOnDeleteGradeArgs = {
  filter?: InputMaybe<ModelSubscriptionGradeFilterInput>;
};


export type SubscriptionOnDeleteGradeEventArgs = {
  filter?: InputMaybe<ModelSubscriptionGradeEventFilterInput>;
};


export type SubscriptionOnDeleteGradeSettingsArgs = {
  filter?: InputMaybe<ModelSubscriptionGradeSettingsFilterInput>;
};


export type SubscriptionOnDeleteHomeworkCheckArgs = {
  filter?: InputMaybe<ModelSubscriptionHomeworkCheckFilterInput>;
};


export type SubscriptionOnDeleteLessonArgs = {
  filter?: InputMaybe<ModelSubscriptionLessonFilterInput>;
};


export type SubscriptionOnDeleteLessonGoldenVerseArgs = {
  filter?: InputMaybe<ModelSubscriptionLessonGoldenVerseFilterInput>;
};


export type SubscriptionOnDeletePupilArgs = {
  filter?: InputMaybe<ModelSubscriptionPupilFilterInput>;
};


export type SubscriptionOnDeletePupilAchievementArgs = {
  filter?: InputMaybe<ModelSubscriptionPupilAchievementFilterInput>;
};


export type SubscriptionOnDeleteUserArgs = {
  filter?: InputMaybe<ModelSubscriptionUserFilterInput>;
  id?: InputMaybe<Scalars['String']['input']>;
};


export type SubscriptionOnDeleteUserFamilyArgs = {
  filter?: InputMaybe<ModelSubscriptionUserFamilyFilterInput>;
  userId?: InputMaybe<Scalars['String']['input']>;
};


export type SubscriptionOnDeleteUserGradeArgs = {
  filter?: InputMaybe<ModelSubscriptionUserGradeFilterInput>;
};


export type SubscriptionOnUpdateAcademicYearArgs = {
  filter?: InputMaybe<ModelSubscriptionAcademicYearFilterInput>;
};


export type SubscriptionOnUpdateAchievementArgs = {
  filter?: InputMaybe<ModelSubscriptionAchievementFilterInput>;
};


export type SubscriptionOnUpdateBookArgs = {
  filter?: InputMaybe<ModelSubscriptionBookFilterInput>;
};


export type SubscriptionOnUpdateFamilyArgs = {
  filter?: InputMaybe<ModelSubscriptionFamilyFilterInput>;
};


export type SubscriptionOnUpdateFamilyMemberArgs = {
  filter?: InputMaybe<ModelSubscriptionFamilyMemberFilterInput>;
};


export type SubscriptionOnUpdateGoldenVerseArgs = {
  filter?: InputMaybe<ModelSubscriptionGoldenVerseFilterInput>;
};


export type SubscriptionOnUpdateGradeArgs = {
  filter?: InputMaybe<ModelSubscriptionGradeFilterInput>;
};


export type SubscriptionOnUpdateGradeEventArgs = {
  filter?: InputMaybe<ModelSubscriptionGradeEventFilterInput>;
};


export type SubscriptionOnUpdateGradeSettingsArgs = {
  filter?: InputMaybe<ModelSubscriptionGradeSettingsFilterInput>;
};


export type SubscriptionOnUpdateHomeworkCheckArgs = {
  filter?: InputMaybe<ModelSubscriptionHomeworkCheckFilterInput>;
};


export type SubscriptionOnUpdateLessonArgs = {
  filter?: InputMaybe<ModelSubscriptionLessonFilterInput>;
};


export type SubscriptionOnUpdateLessonGoldenVerseArgs = {
  filter?: InputMaybe<ModelSubscriptionLessonGoldenVerseFilterInput>;
};


export type SubscriptionOnUpdatePupilArgs = {
  filter?: InputMaybe<ModelSubscriptionPupilFilterInput>;
};


export type SubscriptionOnUpdatePupilAchievementArgs = {
  filter?: InputMaybe<ModelSubscriptionPupilAchievementFilterInput>;
};


export type SubscriptionOnUpdateUserArgs = {
  filter?: InputMaybe<ModelSubscriptionUserFilterInput>;
  id?: InputMaybe<Scalars['String']['input']>;
};


export type SubscriptionOnUpdateUserFamilyArgs = {
  filter?: InputMaybe<ModelSubscriptionUserFamilyFilterInput>;
  userId?: InputMaybe<Scalars['String']['input']>;
};


export type SubscriptionOnUpdateUserGradeArgs = {
  filter?: InputMaybe<ModelSubscriptionUserGradeFilterInput>;
};

export type UpdateAcademicYearInput = {
  createdAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
  endDate?: InputMaybe<Scalars['AWSDate']['input']>;
  gradeId?: InputMaybe<Scalars['ID']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['AWSDate']['input']>;
  status?: InputMaybe<AcademicYearStatus>;
  updatedAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
};

export type UpdateAchievementInput = {
  createdAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
  criteria?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
};

export type UpdateBookInput = {
  abbreviation?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
  fullName?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  order?: InputMaybe<Scalars['Int']['input']>;
  shortName?: InputMaybe<Scalars['String']['input']>;
  testament?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
};

export type UpdateFamilyInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
  email?: InputMaybe<Scalars['AWSEmail']['input']>;
  fatherFirstName?: InputMaybe<Scalars['String']['input']>;
  fatherLastName?: InputMaybe<Scalars['String']['input']>;
  fatherMiddleName?: InputMaybe<Scalars['String']['input']>;
  fatherPhone?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  motherFirstName?: InputMaybe<Scalars['String']['input']>;
  motherLastName?: InputMaybe<Scalars['String']['input']>;
  motherMiddleName?: InputMaybe<Scalars['String']['input']>;
  motherPhone?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
};

export type UpdateFamilyMemberInput = {
  createdAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
  familyId?: InputMaybe<Scalars['ID']['input']>;
  id: Scalars['ID']['input'];
  pupilId?: InputMaybe<Scalars['ID']['input']>;
};

export type UpdateGoldenVerseInput = {
  bookId?: InputMaybe<Scalars['ID']['input']>;
  chapter?: InputMaybe<Scalars['Int']['input']>;
  createdAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
  id: Scalars['ID']['input'];
  reference?: InputMaybe<Scalars['String']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
  verseEnd?: InputMaybe<Scalars['Int']['input']>;
  verseStart?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateGradeEventInput = {
  createdAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  eventDate?: InputMaybe<Scalars['AWSDate']['input']>;
  eventType?: InputMaybe<GradeEventType>;
  gradeId?: InputMaybe<Scalars['ID']['input']>;
  id: Scalars['ID']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
};

export type UpdateGradeInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  createdAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  maxAge?: InputMaybe<Scalars['Int']['input']>;
  minAge?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
};

export type UpdateGradeSettingsInput = {
  createdAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
  enableGoldenVerse?: InputMaybe<Scalars['Boolean']['input']>;
  enableNotebook?: InputMaybe<Scalars['Boolean']['input']>;
  enableSinging?: InputMaybe<Scalars['Boolean']['input']>;
  enableTest?: InputMaybe<Scalars['Boolean']['input']>;
  gradeId?: InputMaybe<Scalars['ID']['input']>;
  id: Scalars['ID']['input'];
  labelGoldenVerse?: InputMaybe<Scalars['String']['input']>;
  labelNotebook?: InputMaybe<Scalars['String']['input']>;
  labelSinging?: InputMaybe<Scalars['String']['input']>;
  labelTest?: InputMaybe<Scalars['String']['input']>;
  pointsGoldenVerse?: InputMaybe<Scalars['Int']['input']>;
  pointsNotebook?: InputMaybe<Scalars['Int']['input']>;
  pointsSinging?: InputMaybe<Scalars['Int']['input']>;
  pointsTest?: InputMaybe<Scalars['Int']['input']>;
  updatedAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
};

export type UpdateHomeworkCheckInput = {
  createdAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
  goldenVerse1Score?: InputMaybe<Scalars['Int']['input']>;
  goldenVerse2Score?: InputMaybe<Scalars['Int']['input']>;
  goldenVerse3Score?: InputMaybe<Scalars['Int']['input']>;
  gradeId?: InputMaybe<Scalars['ID']['input']>;
  id: Scalars['ID']['input'];
  lessonId?: InputMaybe<Scalars['ID']['input']>;
  notebookScore?: InputMaybe<Scalars['Int']['input']>;
  points?: InputMaybe<Scalars['Int']['input']>;
  pupilId?: InputMaybe<Scalars['ID']['input']>;
  singing?: InputMaybe<Scalars['Boolean']['input']>;
  testScore?: InputMaybe<Scalars['Int']['input']>;
  updatedAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
};

export type UpdateLessonGoldenVerseInput = {
  createdAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
  goldenVerseId?: InputMaybe<Scalars['ID']['input']>;
  id: Scalars['ID']['input'];
  lessonId?: InputMaybe<Scalars['ID']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateLessonInput = {
  academicYearId?: InputMaybe<Scalars['ID']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
  gradeId?: InputMaybe<Scalars['ID']['input']>;
  id: Scalars['ID']['input'];
  lessonDate?: InputMaybe<Scalars['AWSDate']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  teacherId?: InputMaybe<Scalars['ID']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
};

export type UpdatePupilAchievementInput = {
  achievementId?: InputMaybe<Scalars['ID']['input']>;
  awardedAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
  createdAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
  id: Scalars['ID']['input'];
  pupilId?: InputMaybe<Scalars['ID']['input']>;
};

export type UpdatePupilInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  createdAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
  dateOfBirth?: InputMaybe<Scalars['AWSDate']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  gradeId?: InputMaybe<Scalars['ID']['input']>;
  id: Scalars['ID']['input'];
  lastName?: InputMaybe<Scalars['String']['input']>;
  middleName?: InputMaybe<Scalars['String']['input']>;
  photo?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
};

export type UpdateUserFamilyInput = {
  createdAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
  familyId?: InputMaybe<Scalars['ID']['input']>;
  id: Scalars['ID']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['ID']['input']>;
};

export type UpdateUserGradeInput = {
  assignedAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
  createdAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
  gradeId?: InputMaybe<Scalars['ID']['input']>;
  id: Scalars['ID']['input'];
  userId?: InputMaybe<Scalars['ID']['input']>;
};

export type UpdateUserInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  createdAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
  email?: InputMaybe<Scalars['AWSEmail']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  photo?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<UserRole>;
  updatedAt?: InputMaybe<Scalars['AWSDateTime']['input']>;
};

export type User = {
  active: Scalars['Boolean']['output'];
  createdAt: Scalars['AWSDateTime']['output'];
  createdLessons?: Maybe<ModelLessonConnection>;
  email: Scalars['AWSEmail']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  photo?: Maybe<Scalars['String']['output']>;
  role: UserRole;
  updatedAt: Scalars['AWSDateTime']['output'];
  userFamilies?: Maybe<ModelUserFamilyConnection>;
  userGrades?: Maybe<ModelUserGradeConnection>;
};


export type UserCreatedLessonsArgs = {
  createdAt?: InputMaybe<ModelStringKeyConditionInput>;
  filter?: InputMaybe<ModelLessonFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


export type UserUserFamiliesArgs = {
  filter?: InputMaybe<ModelUserFamilyFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


export type UserUserGradesArgs = {
  filter?: InputMaybe<ModelUserGradeFilterInput>;
  gradeId?: InputMaybe<ModelIdKeyConditionInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

export type UserFamily = {
  createdAt: Scalars['AWSDateTime']['output'];
  familyId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  phone: Scalars['String']['output'];
  updatedAt: Scalars['AWSDateTime']['output'];
  userId: Scalars['ID']['output'];
};

export type UserGrade = {
  assignedAt: Scalars['AWSDateTime']['output'];
  createdAt: Scalars['AWSDateTime']['output'];
  gradeId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  updatedAt: Scalars['AWSDateTime']['output'];
  userId: Scalars['ID']['output'];
};

export type UserRole =
  | 'ADMIN'
  | 'PARENT'
  | 'PUPIL'
  | 'SUPERADMIN'
  | 'TEACHER';
