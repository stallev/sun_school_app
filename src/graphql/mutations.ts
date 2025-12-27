/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createUser = /* GraphQL */ `mutation CreateUser(
  $input: CreateUserInput!
  $condition: ModelUserConditionInput
) {
  createUser(input: $input, condition: $condition) {
    id
    email
    name
    role
    photo
    active
    userGrades {
      nextToken
      __typename
    }
    createdLessons {
      nextToken
      __typename
    }
    userFamilies {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateUserMutationVariables,
  APITypes.CreateUserMutation
>;
export const updateUser = /* GraphQL */ `mutation UpdateUser(
  $input: UpdateUserInput!
  $condition: ModelUserConditionInput
) {
  updateUser(input: $input, condition: $condition) {
    id
    email
    name
    role
    photo
    active
    userGrades {
      nextToken
      __typename
    }
    createdLessons {
      nextToken
      __typename
    }
    userFamilies {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateUserMutationVariables,
  APITypes.UpdateUserMutation
>;
export const deleteUser = /* GraphQL */ `mutation DeleteUser(
  $input: DeleteUserInput!
  $condition: ModelUserConditionInput
) {
  deleteUser(input: $input, condition: $condition) {
    id
    email
    name
    role
    photo
    active
    userGrades {
      nextToken
      __typename
    }
    createdLessons {
      nextToken
      __typename
    }
    userFamilies {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteUserMutationVariables,
  APITypes.DeleteUserMutation
>;
export const createGrade = /* GraphQL */ `mutation CreateGrade(
  $input: CreateGradeInput!
  $condition: ModelGradeConditionInput
) {
  createGrade(input: $input, condition: $condition) {
    id
    name
    description
    minAge
    maxAge
    active
    teachers {
      nextToken
      __typename
    }
    academicYears {
      nextToken
      __typename
    }
    pupils {
      nextToken
      __typename
    }
    settings {
      id
      gradeId
      enableGoldenVerse
      enableTest
      enableNotebook
      enableSinging
      pointsGoldenVerse
      pointsTest
      pointsNotebook
      pointsSinging
      labelGoldenVerse
      labelTest
      labelNotebook
      labelSinging
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateGradeMutationVariables,
  APITypes.CreateGradeMutation
>;
export const updateGrade = /* GraphQL */ `mutation UpdateGrade(
  $input: UpdateGradeInput!
  $condition: ModelGradeConditionInput
) {
  updateGrade(input: $input, condition: $condition) {
    id
    name
    description
    minAge
    maxAge
    active
    teachers {
      nextToken
      __typename
    }
    academicYears {
      nextToken
      __typename
    }
    pupils {
      nextToken
      __typename
    }
    settings {
      id
      gradeId
      enableGoldenVerse
      enableTest
      enableNotebook
      enableSinging
      pointsGoldenVerse
      pointsTest
      pointsNotebook
      pointsSinging
      labelGoldenVerse
      labelTest
      labelNotebook
      labelSinging
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateGradeMutationVariables,
  APITypes.UpdateGradeMutation
>;
export const deleteGrade = /* GraphQL */ `mutation DeleteGrade(
  $input: DeleteGradeInput!
  $condition: ModelGradeConditionInput
) {
  deleteGrade(input: $input, condition: $condition) {
    id
    name
    description
    minAge
    maxAge
    active
    teachers {
      nextToken
      __typename
    }
    academicYears {
      nextToken
      __typename
    }
    pupils {
      nextToken
      __typename
    }
    settings {
      id
      gradeId
      enableGoldenVerse
      enableTest
      enableNotebook
      enableSinging
      pointsGoldenVerse
      pointsTest
      pointsNotebook
      pointsSinging
      labelGoldenVerse
      labelTest
      labelNotebook
      labelSinging
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteGradeMutationVariables,
  APITypes.DeleteGradeMutation
>;
export const createUserGrade = /* GraphQL */ `mutation CreateUserGrade(
  $input: CreateUserGradeInput!
  $condition: ModelUserGradeConditionInput
) {
  createUserGrade(input: $input, condition: $condition) {
    id
    userId
    gradeId
    assignedAt
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateUserGradeMutationVariables,
  APITypes.CreateUserGradeMutation
>;
export const updateUserGrade = /* GraphQL */ `mutation UpdateUserGrade(
  $input: UpdateUserGradeInput!
  $condition: ModelUserGradeConditionInput
) {
  updateUserGrade(input: $input, condition: $condition) {
    id
    userId
    gradeId
    assignedAt
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateUserGradeMutationVariables,
  APITypes.UpdateUserGradeMutation
>;
export const deleteUserGrade = /* GraphQL */ `mutation DeleteUserGrade(
  $input: DeleteUserGradeInput!
  $condition: ModelUserGradeConditionInput
) {
  deleteUserGrade(input: $input, condition: $condition) {
    id
    userId
    gradeId
    assignedAt
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteUserGradeMutationVariables,
  APITypes.DeleteUserGradeMutation
>;
export const createAcademicYear = /* GraphQL */ `mutation CreateAcademicYear(
  $input: CreateAcademicYearInput!
  $condition: ModelAcademicYearConditionInput
) {
  createAcademicYear(input: $input, condition: $condition) {
    id
    gradeId
    name
    startDate
    endDate
    status
    lessons {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateAcademicYearMutationVariables,
  APITypes.CreateAcademicYearMutation
>;
export const updateAcademicYear = /* GraphQL */ `mutation UpdateAcademicYear(
  $input: UpdateAcademicYearInput!
  $condition: ModelAcademicYearConditionInput
) {
  updateAcademicYear(input: $input, condition: $condition) {
    id
    gradeId
    name
    startDate
    endDate
    status
    lessons {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateAcademicYearMutationVariables,
  APITypes.UpdateAcademicYearMutation
>;
export const deleteAcademicYear = /* GraphQL */ `mutation DeleteAcademicYear(
  $input: DeleteAcademicYearInput!
  $condition: ModelAcademicYearConditionInput
) {
  deleteAcademicYear(input: $input, condition: $condition) {
    id
    gradeId
    name
    startDate
    endDate
    status
    lessons {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteAcademicYearMutationVariables,
  APITypes.DeleteAcademicYearMutation
>;
export const createLesson = /* GraphQL */ `mutation CreateLesson(
  $input: CreateLessonInput!
  $condition: ModelLessonConditionInput
) {
  createLesson(input: $input, condition: $condition) {
    id
    academicYearId
    gradeId
    teacherId
    title
    content
    lessonDate
    order
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateLessonMutationVariables,
  APITypes.CreateLessonMutation
>;
export const updateLesson = /* GraphQL */ `mutation UpdateLesson(
  $input: UpdateLessonInput!
  $condition: ModelLessonConditionInput
) {
  updateLesson(input: $input, condition: $condition) {
    id
    academicYearId
    gradeId
    teacherId
    title
    content
    lessonDate
    order
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateLessonMutationVariables,
  APITypes.UpdateLessonMutation
>;
export const deleteLesson = /* GraphQL */ `mutation DeleteLesson(
  $input: DeleteLessonInput!
  $condition: ModelLessonConditionInput
) {
  deleteLesson(input: $input, condition: $condition) {
    id
    academicYearId
    gradeId
    teacherId
    title
    content
    lessonDate
    order
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteLessonMutationVariables,
  APITypes.DeleteLessonMutation
>;
export const createBook = /* GraphQL */ `mutation CreateBook(
  $input: CreateBookInput!
  $condition: ModelBookConditionInput
) {
  createBook(input: $input, condition: $condition) {
    id
    fullName
    shortName
    abbreviation
    testament
    order
    goldenVerses {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateBookMutationVariables,
  APITypes.CreateBookMutation
>;
export const updateBook = /* GraphQL */ `mutation UpdateBook(
  $input: UpdateBookInput!
  $condition: ModelBookConditionInput
) {
  updateBook(input: $input, condition: $condition) {
    id
    fullName
    shortName
    abbreviation
    testament
    order
    goldenVerses {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateBookMutationVariables,
  APITypes.UpdateBookMutation
>;
export const deleteBook = /* GraphQL */ `mutation DeleteBook(
  $input: DeleteBookInput!
  $condition: ModelBookConditionInput
) {
  deleteBook(input: $input, condition: $condition) {
    id
    fullName
    shortName
    abbreviation
    testament
    order
    goldenVerses {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteBookMutationVariables,
  APITypes.DeleteBookMutation
>;
export const createGoldenVerse = /* GraphQL */ `mutation CreateGoldenVerse(
  $input: CreateGoldenVerseInput!
  $condition: ModelGoldenVerseConditionInput
) {
  createGoldenVerse(input: $input, condition: $condition) {
    id
    reference
    bookId
    chapter
    verseStart
    verseEnd
    text
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateGoldenVerseMutationVariables,
  APITypes.CreateGoldenVerseMutation
>;
export const updateGoldenVerse = /* GraphQL */ `mutation UpdateGoldenVerse(
  $input: UpdateGoldenVerseInput!
  $condition: ModelGoldenVerseConditionInput
) {
  updateGoldenVerse(input: $input, condition: $condition) {
    id
    reference
    bookId
    chapter
    verseStart
    verseEnd
    text
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateGoldenVerseMutationVariables,
  APITypes.UpdateGoldenVerseMutation
>;
export const deleteGoldenVerse = /* GraphQL */ `mutation DeleteGoldenVerse(
  $input: DeleteGoldenVerseInput!
  $condition: ModelGoldenVerseConditionInput
) {
  deleteGoldenVerse(input: $input, condition: $condition) {
    id
    reference
    bookId
    chapter
    verseStart
    verseEnd
    text
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteGoldenVerseMutationVariables,
  APITypes.DeleteGoldenVerseMutation
>;
export const createLessonGoldenVerse = /* GraphQL */ `mutation CreateLessonGoldenVerse(
  $input: CreateLessonGoldenVerseInput!
  $condition: ModelLessonGoldenVerseConditionInput
) {
  createLessonGoldenVerse(input: $input, condition: $condition) {
    id
    lessonId
    goldenVerseId
    order
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateLessonGoldenVerseMutationVariables,
  APITypes.CreateLessonGoldenVerseMutation
>;
export const updateLessonGoldenVerse = /* GraphQL */ `mutation UpdateLessonGoldenVerse(
  $input: UpdateLessonGoldenVerseInput!
  $condition: ModelLessonGoldenVerseConditionInput
) {
  updateLessonGoldenVerse(input: $input, condition: $condition) {
    id
    lessonId
    goldenVerseId
    order
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateLessonGoldenVerseMutationVariables,
  APITypes.UpdateLessonGoldenVerseMutation
>;
export const deleteLessonGoldenVerse = /* GraphQL */ `mutation DeleteLessonGoldenVerse(
  $input: DeleteLessonGoldenVerseInput!
  $condition: ModelLessonGoldenVerseConditionInput
) {
  deleteLessonGoldenVerse(input: $input, condition: $condition) {
    id
    lessonId
    goldenVerseId
    order
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteLessonGoldenVerseMutationVariables,
  APITypes.DeleteLessonGoldenVerseMutation
>;
export const createPupil = /* GraphQL */ `mutation CreatePupil(
  $input: CreatePupilInput!
  $condition: ModelPupilConditionInput
) {
  createPupil(input: $input, condition: $condition) {
    id
    gradeId
    firstName
    lastName
    middleName
    dateOfBirth
    photo
    active
    families {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreatePupilMutationVariables,
  APITypes.CreatePupilMutation
>;
export const updatePupil = /* GraphQL */ `mutation UpdatePupil(
  $input: UpdatePupilInput!
  $condition: ModelPupilConditionInput
) {
  updatePupil(input: $input, condition: $condition) {
    id
    gradeId
    firstName
    lastName
    middleName
    dateOfBirth
    photo
    active
    families {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdatePupilMutationVariables,
  APITypes.UpdatePupilMutation
>;
export const deletePupil = /* GraphQL */ `mutation DeletePupil(
  $input: DeletePupilInput!
  $condition: ModelPupilConditionInput
) {
  deletePupil(input: $input, condition: $condition) {
    id
    gradeId
    firstName
    lastName
    middleName
    dateOfBirth
    photo
    active
    families {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeletePupilMutationVariables,
  APITypes.DeletePupilMutation
>;
export const createHomeworkCheck = /* GraphQL */ `mutation CreateHomeworkCheck(
  $input: CreateHomeworkCheckInput!
  $condition: ModelHomeworkCheckConditionInput
) {
  createHomeworkCheck(input: $input, condition: $condition) {
    id
    lessonId
    pupilId
    gradeId
    goldenVerse1Score
    goldenVerse2Score
    goldenVerse3Score
    testScore
    notebookScore
    singing
    points
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateHomeworkCheckMutationVariables,
  APITypes.CreateHomeworkCheckMutation
>;
export const updateHomeworkCheck = /* GraphQL */ `mutation UpdateHomeworkCheck(
  $input: UpdateHomeworkCheckInput!
  $condition: ModelHomeworkCheckConditionInput
) {
  updateHomeworkCheck(input: $input, condition: $condition) {
    id
    lessonId
    pupilId
    gradeId
    goldenVerse1Score
    goldenVerse2Score
    goldenVerse3Score
    testScore
    notebookScore
    singing
    points
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateHomeworkCheckMutationVariables,
  APITypes.UpdateHomeworkCheckMutation
>;
export const deleteHomeworkCheck = /* GraphQL */ `mutation DeleteHomeworkCheck(
  $input: DeleteHomeworkCheckInput!
  $condition: ModelHomeworkCheckConditionInput
) {
  deleteHomeworkCheck(input: $input, condition: $condition) {
    id
    lessonId
    pupilId
    gradeId
    goldenVerse1Score
    goldenVerse2Score
    goldenVerse3Score
    testScore
    notebookScore
    singing
    points
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteHomeworkCheckMutationVariables,
  APITypes.DeleteHomeworkCheckMutation
>;
export const createAchievement = /* GraphQL */ `mutation CreateAchievement(
  $input: CreateAchievementInput!
  $condition: ModelAchievementConditionInput
) {
  createAchievement(input: $input, condition: $condition) {
    id
    name
    description
    icon
    criteria
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateAchievementMutationVariables,
  APITypes.CreateAchievementMutation
>;
export const updateAchievement = /* GraphQL */ `mutation UpdateAchievement(
  $input: UpdateAchievementInput!
  $condition: ModelAchievementConditionInput
) {
  updateAchievement(input: $input, condition: $condition) {
    id
    name
    description
    icon
    criteria
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateAchievementMutationVariables,
  APITypes.UpdateAchievementMutation
>;
export const deleteAchievement = /* GraphQL */ `mutation DeleteAchievement(
  $input: DeleteAchievementInput!
  $condition: ModelAchievementConditionInput
) {
  deleteAchievement(input: $input, condition: $condition) {
    id
    name
    description
    icon
    criteria
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteAchievementMutationVariables,
  APITypes.DeleteAchievementMutation
>;
export const createPupilAchievement = /* GraphQL */ `mutation CreatePupilAchievement(
  $input: CreatePupilAchievementInput!
  $condition: ModelPupilAchievementConditionInput
) {
  createPupilAchievement(input: $input, condition: $condition) {
    id
    pupilId
    achievementId
    awardedAt
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreatePupilAchievementMutationVariables,
  APITypes.CreatePupilAchievementMutation
>;
export const updatePupilAchievement = /* GraphQL */ `mutation UpdatePupilAchievement(
  $input: UpdatePupilAchievementInput!
  $condition: ModelPupilAchievementConditionInput
) {
  updatePupilAchievement(input: $input, condition: $condition) {
    id
    pupilId
    achievementId
    awardedAt
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdatePupilAchievementMutationVariables,
  APITypes.UpdatePupilAchievementMutation
>;
export const deletePupilAchievement = /* GraphQL */ `mutation DeletePupilAchievement(
  $input: DeletePupilAchievementInput!
  $condition: ModelPupilAchievementConditionInput
) {
  deletePupilAchievement(input: $input, condition: $condition) {
    id
    pupilId
    achievementId
    awardedAt
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeletePupilAchievementMutationVariables,
  APITypes.DeletePupilAchievementMutation
>;
export const createFamily = /* GraphQL */ `mutation CreateFamily(
  $input: CreateFamilyInput!
  $condition: ModelFamilyConditionInput
) {
  createFamily(input: $input, condition: $condition) {
    id
    name
    phone
    email
    address
    motherFirstName
    motherLastName
    motherMiddleName
    motherPhone
    fatherFirstName
    fatherLastName
    fatherMiddleName
    fatherPhone
    members {
      nextToken
      __typename
    }
    userFamilies {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateFamilyMutationVariables,
  APITypes.CreateFamilyMutation
>;
export const updateFamily = /* GraphQL */ `mutation UpdateFamily(
  $input: UpdateFamilyInput!
  $condition: ModelFamilyConditionInput
) {
  updateFamily(input: $input, condition: $condition) {
    id
    name
    phone
    email
    address
    motherFirstName
    motherLastName
    motherMiddleName
    motherPhone
    fatherFirstName
    fatherLastName
    fatherMiddleName
    fatherPhone
    members {
      nextToken
      __typename
    }
    userFamilies {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateFamilyMutationVariables,
  APITypes.UpdateFamilyMutation
>;
export const deleteFamily = /* GraphQL */ `mutation DeleteFamily(
  $input: DeleteFamilyInput!
  $condition: ModelFamilyConditionInput
) {
  deleteFamily(input: $input, condition: $condition) {
    id
    name
    phone
    email
    address
    motherFirstName
    motherLastName
    motherMiddleName
    motherPhone
    fatherFirstName
    fatherLastName
    fatherMiddleName
    fatherPhone
    members {
      nextToken
      __typename
    }
    userFamilies {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteFamilyMutationVariables,
  APITypes.DeleteFamilyMutation
>;
export const createFamilyMember = /* GraphQL */ `mutation CreateFamilyMember(
  $input: CreateFamilyMemberInput!
  $condition: ModelFamilyMemberConditionInput
) {
  createFamilyMember(input: $input, condition: $condition) {
    id
    familyId
    pupilId
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateFamilyMemberMutationVariables,
  APITypes.CreateFamilyMemberMutation
>;
export const updateFamilyMember = /* GraphQL */ `mutation UpdateFamilyMember(
  $input: UpdateFamilyMemberInput!
  $condition: ModelFamilyMemberConditionInput
) {
  updateFamilyMember(input: $input, condition: $condition) {
    id
    familyId
    pupilId
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateFamilyMemberMutationVariables,
  APITypes.UpdateFamilyMemberMutation
>;
export const deleteFamilyMember = /* GraphQL */ `mutation DeleteFamilyMember(
  $input: DeleteFamilyMemberInput!
  $condition: ModelFamilyMemberConditionInput
) {
  deleteFamilyMember(input: $input, condition: $condition) {
    id
    familyId
    pupilId
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteFamilyMemberMutationVariables,
  APITypes.DeleteFamilyMemberMutation
>;
export const createUserFamily = /* GraphQL */ `mutation CreateUserFamily(
  $input: CreateUserFamilyInput!
  $condition: ModelUserFamilyConditionInput
) {
  createUserFamily(input: $input, condition: $condition) {
    id
    userId
    familyId
    phone
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateUserFamilyMutationVariables,
  APITypes.CreateUserFamilyMutation
>;
export const updateUserFamily = /* GraphQL */ `mutation UpdateUserFamily(
  $input: UpdateUserFamilyInput!
  $condition: ModelUserFamilyConditionInput
) {
  updateUserFamily(input: $input, condition: $condition) {
    id
    userId
    familyId
    phone
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateUserFamilyMutationVariables,
  APITypes.UpdateUserFamilyMutation
>;
export const deleteUserFamily = /* GraphQL */ `mutation DeleteUserFamily(
  $input: DeleteUserFamilyInput!
  $condition: ModelUserFamilyConditionInput
) {
  deleteUserFamily(input: $input, condition: $condition) {
    id
    userId
    familyId
    phone
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteUserFamilyMutationVariables,
  APITypes.DeleteUserFamilyMutation
>;
export const createGradeEvent = /* GraphQL */ `mutation CreateGradeEvent(
  $input: CreateGradeEventInput!
  $condition: ModelGradeEventConditionInput
) {
  createGradeEvent(input: $input, condition: $condition) {
    id
    gradeId
    eventType
    title
    description
    eventDate
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateGradeEventMutationVariables,
  APITypes.CreateGradeEventMutation
>;
export const updateGradeEvent = /* GraphQL */ `mutation UpdateGradeEvent(
  $input: UpdateGradeEventInput!
  $condition: ModelGradeEventConditionInput
) {
  updateGradeEvent(input: $input, condition: $condition) {
    id
    gradeId
    eventType
    title
    description
    eventDate
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateGradeEventMutationVariables,
  APITypes.UpdateGradeEventMutation
>;
export const deleteGradeEvent = /* GraphQL */ `mutation DeleteGradeEvent(
  $input: DeleteGradeEventInput!
  $condition: ModelGradeEventConditionInput
) {
  deleteGradeEvent(input: $input, condition: $condition) {
    id
    gradeId
    eventType
    title
    description
    eventDate
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteGradeEventMutationVariables,
  APITypes.DeleteGradeEventMutation
>;
export const createGradeSettings = /* GraphQL */ `mutation CreateGradeSettings(
  $input: CreateGradeSettingsInput!
  $condition: ModelGradeSettingsConditionInput
) {
  createGradeSettings(input: $input, condition: $condition) {
    id
    gradeId
    enableGoldenVerse
    enableTest
    enableNotebook
    enableSinging
    pointsGoldenVerse
    pointsTest
    pointsNotebook
    pointsSinging
    labelGoldenVerse
    labelTest
    labelNotebook
    labelSinging
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateGradeSettingsMutationVariables,
  APITypes.CreateGradeSettingsMutation
>;
export const updateGradeSettings = /* GraphQL */ `mutation UpdateGradeSettings(
  $input: UpdateGradeSettingsInput!
  $condition: ModelGradeSettingsConditionInput
) {
  updateGradeSettings(input: $input, condition: $condition) {
    id
    gradeId
    enableGoldenVerse
    enableTest
    enableNotebook
    enableSinging
    pointsGoldenVerse
    pointsTest
    pointsNotebook
    pointsSinging
    labelGoldenVerse
    labelTest
    labelNotebook
    labelSinging
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateGradeSettingsMutationVariables,
  APITypes.UpdateGradeSettingsMutation
>;
export const deleteGradeSettings = /* GraphQL */ `mutation DeleteGradeSettings(
  $input: DeleteGradeSettingsInput!
  $condition: ModelGradeSettingsConditionInput
) {
  deleteGradeSettings(input: $input, condition: $condition) {
    id
    gradeId
    enableGoldenVerse
    enableTest
    enableNotebook
    enableSinging
    pointsGoldenVerse
    pointsTest
    pointsNotebook
    pointsSinging
    labelGoldenVerse
    labelTest
    labelNotebook
    labelSinging
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteGradeSettingsMutationVariables,
  APITypes.DeleteGradeSettingsMutation
>;
