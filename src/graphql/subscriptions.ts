/* tslint:disable */
 
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateUser = /* GraphQL */ `subscription OnCreateUser(
  $filter: ModelSubscriptionUserFilterInput
  $id: String
) {
  onCreateUser(filter: $filter, id: $id) {
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
` as GeneratedSubscription<
  APITypes.OnCreateUserSubscriptionVariables,
  APITypes.OnCreateUserSubscription
>;
export const onUpdateUser = /* GraphQL */ `subscription OnUpdateUser(
  $filter: ModelSubscriptionUserFilterInput
  $id: String
) {
  onUpdateUser(filter: $filter, id: $id) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateUserSubscriptionVariables,
  APITypes.OnUpdateUserSubscription
>;
export const onDeleteUser = /* GraphQL */ `subscription OnDeleteUser(
  $filter: ModelSubscriptionUserFilterInput
  $id: String
) {
  onDeleteUser(filter: $filter, id: $id) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteUserSubscriptionVariables,
  APITypes.OnDeleteUserSubscription
>;
export const onCreateGrade = /* GraphQL */ `subscription OnCreateGrade($filter: ModelSubscriptionGradeFilterInput) {
  onCreateGrade(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateGradeSubscriptionVariables,
  APITypes.OnCreateGradeSubscription
>;
export const onUpdateGrade = /* GraphQL */ `subscription OnUpdateGrade($filter: ModelSubscriptionGradeFilterInput) {
  onUpdateGrade(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateGradeSubscriptionVariables,
  APITypes.OnUpdateGradeSubscription
>;
export const onDeleteGrade = /* GraphQL */ `subscription OnDeleteGrade($filter: ModelSubscriptionGradeFilterInput) {
  onDeleteGrade(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteGradeSubscriptionVariables,
  APITypes.OnDeleteGradeSubscription
>;
export const onCreateUserGrade = /* GraphQL */ `subscription OnCreateUserGrade($filter: ModelSubscriptionUserGradeFilterInput) {
  onCreateUserGrade(filter: $filter) {
    id
    userId
    gradeId
    assignedAt
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateUserGradeSubscriptionVariables,
  APITypes.OnCreateUserGradeSubscription
>;
export const onUpdateUserGrade = /* GraphQL */ `subscription OnUpdateUserGrade($filter: ModelSubscriptionUserGradeFilterInput) {
  onUpdateUserGrade(filter: $filter) {
    id
    userId
    gradeId
    assignedAt
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateUserGradeSubscriptionVariables,
  APITypes.OnUpdateUserGradeSubscription
>;
export const onDeleteUserGrade = /* GraphQL */ `subscription OnDeleteUserGrade($filter: ModelSubscriptionUserGradeFilterInput) {
  onDeleteUserGrade(filter: $filter) {
    id
    userId
    gradeId
    assignedAt
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteUserGradeSubscriptionVariables,
  APITypes.OnDeleteUserGradeSubscription
>;
export const onCreateAcademicYear = /* GraphQL */ `subscription OnCreateAcademicYear(
  $filter: ModelSubscriptionAcademicYearFilterInput
) {
  onCreateAcademicYear(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateAcademicYearSubscriptionVariables,
  APITypes.OnCreateAcademicYearSubscription
>;
export const onUpdateAcademicYear = /* GraphQL */ `subscription OnUpdateAcademicYear(
  $filter: ModelSubscriptionAcademicYearFilterInput
) {
  onUpdateAcademicYear(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateAcademicYearSubscriptionVariables,
  APITypes.OnUpdateAcademicYearSubscription
>;
export const onDeleteAcademicYear = /* GraphQL */ `subscription OnDeleteAcademicYear(
  $filter: ModelSubscriptionAcademicYearFilterInput
) {
  onDeleteAcademicYear(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteAcademicYearSubscriptionVariables,
  APITypes.OnDeleteAcademicYearSubscription
>;
export const onCreateLesson = /* GraphQL */ `subscription OnCreateLesson($filter: ModelSubscriptionLessonFilterInput) {
  onCreateLesson(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateLessonSubscriptionVariables,
  APITypes.OnCreateLessonSubscription
>;
export const onUpdateLesson = /* GraphQL */ `subscription OnUpdateLesson($filter: ModelSubscriptionLessonFilterInput) {
  onUpdateLesson(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateLessonSubscriptionVariables,
  APITypes.OnUpdateLessonSubscription
>;
export const onDeleteLesson = /* GraphQL */ `subscription OnDeleteLesson($filter: ModelSubscriptionLessonFilterInput) {
  onDeleteLesson(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteLessonSubscriptionVariables,
  APITypes.OnDeleteLessonSubscription
>;
export const onCreateBook = /* GraphQL */ `subscription OnCreateBook($filter: ModelSubscriptionBookFilterInput) {
  onCreateBook(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateBookSubscriptionVariables,
  APITypes.OnCreateBookSubscription
>;
export const onUpdateBook = /* GraphQL */ `subscription OnUpdateBook($filter: ModelSubscriptionBookFilterInput) {
  onUpdateBook(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateBookSubscriptionVariables,
  APITypes.OnUpdateBookSubscription
>;
export const onDeleteBook = /* GraphQL */ `subscription OnDeleteBook($filter: ModelSubscriptionBookFilterInput) {
  onDeleteBook(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteBookSubscriptionVariables,
  APITypes.OnDeleteBookSubscription
>;
export const onCreateGoldenVerse = /* GraphQL */ `subscription OnCreateGoldenVerse(
  $filter: ModelSubscriptionGoldenVerseFilterInput
) {
  onCreateGoldenVerse(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateGoldenVerseSubscriptionVariables,
  APITypes.OnCreateGoldenVerseSubscription
>;
export const onUpdateGoldenVerse = /* GraphQL */ `subscription OnUpdateGoldenVerse(
  $filter: ModelSubscriptionGoldenVerseFilterInput
) {
  onUpdateGoldenVerse(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateGoldenVerseSubscriptionVariables,
  APITypes.OnUpdateGoldenVerseSubscription
>;
export const onDeleteGoldenVerse = /* GraphQL */ `subscription OnDeleteGoldenVerse(
  $filter: ModelSubscriptionGoldenVerseFilterInput
) {
  onDeleteGoldenVerse(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteGoldenVerseSubscriptionVariables,
  APITypes.OnDeleteGoldenVerseSubscription
>;
export const onCreateLessonGoldenVerse = /* GraphQL */ `subscription OnCreateLessonGoldenVerse(
  $filter: ModelSubscriptionLessonGoldenVerseFilterInput
) {
  onCreateLessonGoldenVerse(filter: $filter) {
    id
    lessonId
    goldenVerseId
    order
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateLessonGoldenVerseSubscriptionVariables,
  APITypes.OnCreateLessonGoldenVerseSubscription
>;
export const onUpdateLessonGoldenVerse = /* GraphQL */ `subscription OnUpdateLessonGoldenVerse(
  $filter: ModelSubscriptionLessonGoldenVerseFilterInput
) {
  onUpdateLessonGoldenVerse(filter: $filter) {
    id
    lessonId
    goldenVerseId
    order
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateLessonGoldenVerseSubscriptionVariables,
  APITypes.OnUpdateLessonGoldenVerseSubscription
>;
export const onDeleteLessonGoldenVerse = /* GraphQL */ `subscription OnDeleteLessonGoldenVerse(
  $filter: ModelSubscriptionLessonGoldenVerseFilterInput
) {
  onDeleteLessonGoldenVerse(filter: $filter) {
    id
    lessonId
    goldenVerseId
    order
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteLessonGoldenVerseSubscriptionVariables,
  APITypes.OnDeleteLessonGoldenVerseSubscription
>;
export const onCreatePupil = /* GraphQL */ `subscription OnCreatePupil($filter: ModelSubscriptionPupilFilterInput) {
  onCreatePupil(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreatePupilSubscriptionVariables,
  APITypes.OnCreatePupilSubscription
>;
export const onUpdatePupil = /* GraphQL */ `subscription OnUpdatePupil($filter: ModelSubscriptionPupilFilterInput) {
  onUpdatePupil(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdatePupilSubscriptionVariables,
  APITypes.OnUpdatePupilSubscription
>;
export const onDeletePupil = /* GraphQL */ `subscription OnDeletePupil($filter: ModelSubscriptionPupilFilterInput) {
  onDeletePupil(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeletePupilSubscriptionVariables,
  APITypes.OnDeletePupilSubscription
>;
export const onCreateHomeworkCheck = /* GraphQL */ `subscription OnCreateHomeworkCheck(
  $filter: ModelSubscriptionHomeworkCheckFilterInput
) {
  onCreateHomeworkCheck(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateHomeworkCheckSubscriptionVariables,
  APITypes.OnCreateHomeworkCheckSubscription
>;
export const onUpdateHomeworkCheck = /* GraphQL */ `subscription OnUpdateHomeworkCheck(
  $filter: ModelSubscriptionHomeworkCheckFilterInput
) {
  onUpdateHomeworkCheck(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateHomeworkCheckSubscriptionVariables,
  APITypes.OnUpdateHomeworkCheckSubscription
>;
export const onDeleteHomeworkCheck = /* GraphQL */ `subscription OnDeleteHomeworkCheck(
  $filter: ModelSubscriptionHomeworkCheckFilterInput
) {
  onDeleteHomeworkCheck(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteHomeworkCheckSubscriptionVariables,
  APITypes.OnDeleteHomeworkCheckSubscription
>;
export const onCreateAchievement = /* GraphQL */ `subscription OnCreateAchievement(
  $filter: ModelSubscriptionAchievementFilterInput
) {
  onCreateAchievement(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateAchievementSubscriptionVariables,
  APITypes.OnCreateAchievementSubscription
>;
export const onUpdateAchievement = /* GraphQL */ `subscription OnUpdateAchievement(
  $filter: ModelSubscriptionAchievementFilterInput
) {
  onUpdateAchievement(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateAchievementSubscriptionVariables,
  APITypes.OnUpdateAchievementSubscription
>;
export const onDeleteAchievement = /* GraphQL */ `subscription OnDeleteAchievement(
  $filter: ModelSubscriptionAchievementFilterInput
) {
  onDeleteAchievement(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteAchievementSubscriptionVariables,
  APITypes.OnDeleteAchievementSubscription
>;
export const onCreatePupilAchievement = /* GraphQL */ `subscription OnCreatePupilAchievement(
  $filter: ModelSubscriptionPupilAchievementFilterInput
) {
  onCreatePupilAchievement(filter: $filter) {
    id
    pupilId
    achievementId
    awardedAt
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreatePupilAchievementSubscriptionVariables,
  APITypes.OnCreatePupilAchievementSubscription
>;
export const onUpdatePupilAchievement = /* GraphQL */ `subscription OnUpdatePupilAchievement(
  $filter: ModelSubscriptionPupilAchievementFilterInput
) {
  onUpdatePupilAchievement(filter: $filter) {
    id
    pupilId
    achievementId
    awardedAt
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdatePupilAchievementSubscriptionVariables,
  APITypes.OnUpdatePupilAchievementSubscription
>;
export const onDeletePupilAchievement = /* GraphQL */ `subscription OnDeletePupilAchievement(
  $filter: ModelSubscriptionPupilAchievementFilterInput
) {
  onDeletePupilAchievement(filter: $filter) {
    id
    pupilId
    achievementId
    awardedAt
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeletePupilAchievementSubscriptionVariables,
  APITypes.OnDeletePupilAchievementSubscription
>;
export const onCreateFamily = /* GraphQL */ `subscription OnCreateFamily($filter: ModelSubscriptionFamilyFilterInput) {
  onCreateFamily(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateFamilySubscriptionVariables,
  APITypes.OnCreateFamilySubscription
>;
export const onUpdateFamily = /* GraphQL */ `subscription OnUpdateFamily($filter: ModelSubscriptionFamilyFilterInput) {
  onUpdateFamily(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateFamilySubscriptionVariables,
  APITypes.OnUpdateFamilySubscription
>;
export const onDeleteFamily = /* GraphQL */ `subscription OnDeleteFamily($filter: ModelSubscriptionFamilyFilterInput) {
  onDeleteFamily(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteFamilySubscriptionVariables,
  APITypes.OnDeleteFamilySubscription
>;
export const onCreateFamilyMember = /* GraphQL */ `subscription OnCreateFamilyMember(
  $filter: ModelSubscriptionFamilyMemberFilterInput
) {
  onCreateFamilyMember(filter: $filter) {
    id
    familyId
    pupilId
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateFamilyMemberSubscriptionVariables,
  APITypes.OnCreateFamilyMemberSubscription
>;
export const onUpdateFamilyMember = /* GraphQL */ `subscription OnUpdateFamilyMember(
  $filter: ModelSubscriptionFamilyMemberFilterInput
) {
  onUpdateFamilyMember(filter: $filter) {
    id
    familyId
    pupilId
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateFamilyMemberSubscriptionVariables,
  APITypes.OnUpdateFamilyMemberSubscription
>;
export const onDeleteFamilyMember = /* GraphQL */ `subscription OnDeleteFamilyMember(
  $filter: ModelSubscriptionFamilyMemberFilterInput
) {
  onDeleteFamilyMember(filter: $filter) {
    id
    familyId
    pupilId
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteFamilyMemberSubscriptionVariables,
  APITypes.OnDeleteFamilyMemberSubscription
>;
export const onCreateUserFamily = /* GraphQL */ `subscription OnCreateUserFamily(
  $filter: ModelSubscriptionUserFamilyFilterInput
  $userId: String
) {
  onCreateUserFamily(filter: $filter, userId: $userId) {
    id
    userId
    familyId
    phone
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateUserFamilySubscriptionVariables,
  APITypes.OnCreateUserFamilySubscription
>;
export const onUpdateUserFamily = /* GraphQL */ `subscription OnUpdateUserFamily(
  $filter: ModelSubscriptionUserFamilyFilterInput
  $userId: String
) {
  onUpdateUserFamily(filter: $filter, userId: $userId) {
    id
    userId
    familyId
    phone
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateUserFamilySubscriptionVariables,
  APITypes.OnUpdateUserFamilySubscription
>;
export const onDeleteUserFamily = /* GraphQL */ `subscription OnDeleteUserFamily(
  $filter: ModelSubscriptionUserFamilyFilterInput
  $userId: String
) {
  onDeleteUserFamily(filter: $filter, userId: $userId) {
    id
    userId
    familyId
    phone
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteUserFamilySubscriptionVariables,
  APITypes.OnDeleteUserFamilySubscription
>;
export const onCreateGradeEvent = /* GraphQL */ `subscription OnCreateGradeEvent(
  $filter: ModelSubscriptionGradeEventFilterInput
) {
  onCreateGradeEvent(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateGradeEventSubscriptionVariables,
  APITypes.OnCreateGradeEventSubscription
>;
export const onUpdateGradeEvent = /* GraphQL */ `subscription OnUpdateGradeEvent(
  $filter: ModelSubscriptionGradeEventFilterInput
) {
  onUpdateGradeEvent(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateGradeEventSubscriptionVariables,
  APITypes.OnUpdateGradeEventSubscription
>;
export const onDeleteGradeEvent = /* GraphQL */ `subscription OnDeleteGradeEvent(
  $filter: ModelSubscriptionGradeEventFilterInput
) {
  onDeleteGradeEvent(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteGradeEventSubscriptionVariables,
  APITypes.OnDeleteGradeEventSubscription
>;
export const onCreateGradeSettings = /* GraphQL */ `subscription OnCreateGradeSettings(
  $filter: ModelSubscriptionGradeSettingsFilterInput
) {
  onCreateGradeSettings(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateGradeSettingsSubscriptionVariables,
  APITypes.OnCreateGradeSettingsSubscription
>;
export const onUpdateGradeSettings = /* GraphQL */ `subscription OnUpdateGradeSettings(
  $filter: ModelSubscriptionGradeSettingsFilterInput
) {
  onUpdateGradeSettings(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateGradeSettingsSubscriptionVariables,
  APITypes.OnUpdateGradeSettingsSubscription
>;
export const onDeleteGradeSettings = /* GraphQL */ `subscription OnDeleteGradeSettings(
  $filter: ModelSubscriptionGradeSettingsFilterInput
) {
  onDeleteGradeSettings(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteGradeSettingsSubscriptionVariables,
  APITypes.OnDeleteGradeSettingsSubscription
>;
