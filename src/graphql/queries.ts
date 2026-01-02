/* tslint:disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getUser = /* GraphQL */ `query GetUser($id: ID!) {
  getUser(id: $id) {
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
` as GeneratedQuery<APITypes.GetUserQueryVariables, APITypes.GetUserQuery>;
export const listUsers = /* GraphQL */ `query ListUsers(
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
) {
  listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      email
      name
      role
      photo
      active
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListUsersQueryVariables, APITypes.ListUsersQuery>;
export const getGrade = /* GraphQL */ `query GetGrade($id: ID!) {
  getGrade(id: $id) {
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
    events {
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
` as GeneratedQuery<APITypes.GetGradeQueryVariables, APITypes.GetGradeQuery>;
export const listGrades = /* GraphQL */ `query ListGrades(
  $filter: ModelGradeFilterInput
  $limit: Int
  $nextToken: String
) {
  listGrades(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      description
      minAge
      maxAge
      active
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListGradesQueryVariables,
  APITypes.ListGradesQuery
>;
export const getAcademicYear = /* GraphQL */ `query GetAcademicYear($id: ID!) {
  getAcademicYear(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetAcademicYearQueryVariables,
  APITypes.GetAcademicYearQuery
>;
export const listAcademicYears = /* GraphQL */ `query ListAcademicYears(
  $filter: ModelAcademicYearFilterInput
  $limit: Int
  $nextToken: String
) {
  listAcademicYears(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      gradeId
      name
      startDate
      endDate
      status
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAcademicYearsQueryVariables,
  APITypes.ListAcademicYearsQuery
>;
export const getLesson = /* GraphQL */ `query GetLesson($id: ID!) {
  getLesson(id: $id) {
    id
    academicYearId
    gradeId
    teacherId
    title
    content
    lessonDate
    order
    homeworkChecks {
      nextToken
      __typename
    }
    goldenVerses {
      nextToken
      __typename
    }
    files {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetLessonQueryVariables, APITypes.GetLessonQuery>;
export const listLessons = /* GraphQL */ `query ListLessons(
  $filter: ModelLessonFilterInput
  $limit: Int
  $nextToken: String
) {
  listLessons(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListLessonsQueryVariables,
  APITypes.ListLessonsQuery
>;
export const getBook = /* GraphQL */ `query GetBook($id: ID!) {
  getBook(id: $id) {
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
` as GeneratedQuery<APITypes.GetBookQueryVariables, APITypes.GetBookQuery>;
export const listBooks = /* GraphQL */ `query ListBooks(
  $filter: ModelBookFilterInput
  $limit: Int
  $nextToken: String
) {
  listBooks(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      fullName
      shortName
      abbreviation
      testament
      order
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListBooksQueryVariables, APITypes.ListBooksQuery>;
export const getGoldenVerse = /* GraphQL */ `query GetGoldenVerse($id: ID!) {
  getGoldenVerse(id: $id) {
    id
    reference
    bookId
    chapter
    verseStart
    verseEnd
    text
    book {
      id
      fullName
      shortName
      abbreviation
      testament
      order
      createdAt
      updatedAt
      __typename
    }
    lessons {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetGoldenVerseQueryVariables,
  APITypes.GetGoldenVerseQuery
>;
export const listGoldenVerses = /* GraphQL */ `query ListGoldenVerses(
  $filter: ModelGoldenVerseFilterInput
  $limit: Int
  $nextToken: String
) {
  listGoldenVerses(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListGoldenVersesQueryVariables,
  APITypes.ListGoldenVersesQuery
>;
export const getPupil = /* GraphQL */ `query GetPupil($id: ID!) {
  getPupil(id: $id) {
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
    homeworkChecks {
      nextToken
      __typename
    }
    achievements {
      nextToken
      __typename
    }
    bricksIssues {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetPupilQueryVariables, APITypes.GetPupilQuery>;
export const listPupils = /* GraphQL */ `query ListPupils(
  $filter: ModelPupilFilterInput
  $limit: Int
  $nextToken: String
) {
  listPupils(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      gradeId
      firstName
      lastName
      middleName
      dateOfBirth
      photo
      active
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPupilsQueryVariables,
  APITypes.ListPupilsQuery
>;
export const getHomeworkCheck = /* GraphQL */ `query GetHomeworkCheck($id: ID!) {
  getHomeworkCheck(id: $id) {
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
    lesson {
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
    pupil {
      id
      gradeId
      firstName
      lastName
      middleName
      dateOfBirth
      photo
      active
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetHomeworkCheckQueryVariables,
  APITypes.GetHomeworkCheckQuery
>;
export const listHomeworkChecks = /* GraphQL */ `query ListHomeworkChecks(
  $filter: ModelHomeworkCheckFilterInput
  $limit: Int
  $nextToken: String
) {
  listHomeworkChecks(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListHomeworkChecksQueryVariables,
  APITypes.ListHomeworkChecksQuery
>;
export const getAchievement = /* GraphQL */ `query GetAchievement($id: ID!) {
  getAchievement(id: $id) {
    id
    name
    description
    icon
    criteria
    pupils {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetAchievementQueryVariables,
  APITypes.GetAchievementQuery
>;
export const listAchievements = /* GraphQL */ `query ListAchievements(
  $filter: ModelAchievementFilterInput
  $limit: Int
  $nextToken: String
) {
  listAchievements(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      description
      icon
      criteria
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAchievementsQueryVariables,
  APITypes.ListAchievementsQuery
>;
export const getBricksIssue = /* GraphQL */ `query GetBricksIssue($id: ID!) {
  getBricksIssue(id: $id) {
    id
    pupilId
    academicYearId
    gradeId
    quantity
    issuedAt
    issuedBy
    pupil {
      id
      gradeId
      firstName
      lastName
      middleName
      dateOfBirth
      photo
      active
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetBricksIssueQueryVariables,
  APITypes.GetBricksIssueQuery
>;
export const listBricksIssues = /* GraphQL */ `query ListBricksIssues(
  $filter: ModelBricksIssueFilterInput
  $limit: Int
  $nextToken: String
) {
  listBricksIssues(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      pupilId
      academicYearId
      gradeId
      quantity
      issuedAt
      issuedBy
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListBricksIssuesQueryVariables,
  APITypes.ListBricksIssuesQuery
>;
export const getFamily = /* GraphQL */ `query GetFamily($id: ID!) {
  getFamily(id: $id) {
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
` as GeneratedQuery<APITypes.GetFamilyQueryVariables, APITypes.GetFamilyQuery>;
export const listFamilies = /* GraphQL */ `query ListFamilies(
  $filter: ModelFamilyFilterInput
  $limit: Int
  $nextToken: String
) {
  listFamilies(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListFamiliesQueryVariables,
  APITypes.ListFamiliesQuery
>;
export const getGradeEvent = /* GraphQL */ `query GetGradeEvent($id: ID!) {
  getGradeEvent(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetGradeEventQueryVariables,
  APITypes.GetGradeEventQuery
>;
export const listGradeEvents = /* GraphQL */ `query ListGradeEvents(
  $filter: ModelGradeEventFilterInput
  $limit: Int
  $nextToken: String
) {
  listGradeEvents(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListGradeEventsQueryVariables,
  APITypes.ListGradeEventsQuery
>;
export const getGradeSettings = /* GraphQL */ `query GetGradeSettings($id: ID!) {
  getGradeSettings(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetGradeSettingsQueryVariables,
  APITypes.GetGradeSettingsQuery
>;
export const listGradeSettings = /* GraphQL */ `query ListGradeSettings(
  $filter: ModelGradeSettingsFilterInput
  $limit: Int
  $nextToken: String
) {
  listGradeSettings(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListGradeSettingsQueryVariables,
  APITypes.ListGradeSettingsQuery
>;
export const usersByEmail = /* GraphQL */ `query UsersByEmail(
  $email: AWSEmail!
  $sortDirection: ModelSortDirection
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
) {
  usersByEmail(
    email: $email
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      email
      name
      role
      photo
      active
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.UsersByEmailQueryVariables,
  APITypes.UsersByEmailQuery
>;
export const usersByRoleAndCreatedAt = /* GraphQL */ `query UsersByRoleAndCreatedAt(
  $role: UserRole!
  $createdAt: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
) {
  usersByRoleAndCreatedAt(
    role: $role
    createdAt: $createdAt
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      email
      name
      role
      photo
      active
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.UsersByRoleAndCreatedAtQueryVariables,
  APITypes.UsersByRoleAndCreatedAtQuery
>;
export const userGradesByUserIdAndGradeId = /* GraphQL */ `query UserGradesByUserIdAndGradeId(
  $userId: ID!
  $gradeId: ModelIDKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelUserGradeFilterInput
  $limit: Int
  $nextToken: String
) {
  userGradesByUserIdAndGradeId(
    userId: $userId
    gradeId: $gradeId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      userId
      gradeId
      assignedAt
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.UserGradesByUserIdAndGradeIdQueryVariables,
  APITypes.UserGradesByUserIdAndGradeIdQuery
>;
export const userGradesByGradeIdAndUserId = /* GraphQL */ `query UserGradesByGradeIdAndUserId(
  $gradeId: ID!
  $userId: ModelIDKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelUserGradeFilterInput
  $limit: Int
  $nextToken: String
) {
  userGradesByGradeIdAndUserId(
    gradeId: $gradeId
    userId: $userId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      userId
      gradeId
      assignedAt
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.UserGradesByGradeIdAndUserIdQueryVariables,
  APITypes.UserGradesByGradeIdAndUserIdQuery
>;
export const academicYearsByGradeIdAndStartDate = /* GraphQL */ `query AcademicYearsByGradeIdAndStartDate(
  $gradeId: ID!
  $startDate: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelAcademicYearFilterInput
  $limit: Int
  $nextToken: String
) {
  academicYearsByGradeIdAndStartDate(
    gradeId: $gradeId
    startDate: $startDate
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      gradeId
      name
      startDate
      endDate
      status
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.AcademicYearsByGradeIdAndStartDateQueryVariables,
  APITypes.AcademicYearsByGradeIdAndStartDateQuery
>;
export const academicYearsByStatusAndGradeId = /* GraphQL */ `query AcademicYearsByStatusAndGradeId(
  $status: AcademicYearStatus!
  $gradeId: ModelIDKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelAcademicYearFilterInput
  $limit: Int
  $nextToken: String
) {
  academicYearsByStatusAndGradeId(
    status: $status
    gradeId: $gradeId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      gradeId
      name
      startDate
      endDate
      status
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.AcademicYearsByStatusAndGradeIdQueryVariables,
  APITypes.AcademicYearsByStatusAndGradeIdQuery
>;
export const lessonsByAcademicYearIdAndLessonDate = /* GraphQL */ `query LessonsByAcademicYearIdAndLessonDate(
  $academicYearId: ID!
  $lessonDate: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelLessonFilterInput
  $limit: Int
  $nextToken: String
) {
  lessonsByAcademicYearIdAndLessonDate(
    academicYearId: $academicYearId
    lessonDate: $lessonDate
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.LessonsByAcademicYearIdAndLessonDateQueryVariables,
  APITypes.LessonsByAcademicYearIdAndLessonDateQuery
>;
export const lessonsByGradeIdAndLessonDate = /* GraphQL */ `query LessonsByGradeIdAndLessonDate(
  $gradeId: ID!
  $lessonDate: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelLessonFilterInput
  $limit: Int
  $nextToken: String
) {
  lessonsByGradeIdAndLessonDate(
    gradeId: $gradeId
    lessonDate: $lessonDate
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.LessonsByGradeIdAndLessonDateQueryVariables,
  APITypes.LessonsByGradeIdAndLessonDateQuery
>;
export const lessonsByTeacherIdAndCreatedAt = /* GraphQL */ `query LessonsByTeacherIdAndCreatedAt(
  $teacherId: ID!
  $createdAt: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelLessonFilterInput
  $limit: Int
  $nextToken: String
) {
  lessonsByTeacherIdAndCreatedAt(
    teacherId: $teacherId
    createdAt: $createdAt
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.LessonsByTeacherIdAndCreatedAtQueryVariables,
  APITypes.LessonsByTeacherIdAndCreatedAtQuery
>;
export const lessonFilesByLessonIdAndOrder = /* GraphQL */ `query LessonFilesByLessonIdAndOrder(
  $lessonId: ID!
  $order: ModelIntKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelLessonFileFilterInput
  $limit: Int
  $nextToken: String
) {
  lessonFilesByLessonIdAndOrder(
    lessonId: $lessonId
    order: $order
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      lessonId
      fileName
      fileType
      mimeType
      fileSize
      s3Key
      s3Url
      order
      description
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.LessonFilesByLessonIdAndOrderQueryVariables,
  APITypes.LessonFilesByLessonIdAndOrderQuery
>;
export const booksByShortName = /* GraphQL */ `query BooksByShortName(
  $shortName: String!
  $sortDirection: ModelSortDirection
  $filter: ModelBookFilterInput
  $limit: Int
  $nextToken: String
) {
  booksByShortName(
    shortName: $shortName
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      fullName
      shortName
      abbreviation
      testament
      order
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.BooksByShortNameQueryVariables,
  APITypes.BooksByShortNameQuery
>;
export const booksByTestamentAndOrder = /* GraphQL */ `query BooksByTestamentAndOrder(
  $testament: String!
  $order: ModelIntKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelBookFilterInput
  $limit: Int
  $nextToken: String
) {
  booksByTestamentAndOrder(
    testament: $testament
    order: $order
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      fullName
      shortName
      abbreviation
      testament
      order
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.BooksByTestamentAndOrderQueryVariables,
  APITypes.BooksByTestamentAndOrderQuery
>;
export const goldenVersesByReference = /* GraphQL */ `query GoldenVersesByReference(
  $reference: String!
  $sortDirection: ModelSortDirection
  $filter: ModelGoldenVerseFilterInput
  $limit: Int
  $nextToken: String
) {
  goldenVersesByReference(
    reference: $reference
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GoldenVersesByReferenceQueryVariables,
  APITypes.GoldenVersesByReferenceQuery
>;
export const goldenVersesByBookIdAndChapter = /* GraphQL */ `query GoldenVersesByBookIdAndChapter(
  $bookId: ID!
  $chapter: ModelIntKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelGoldenVerseFilterInput
  $limit: Int
  $nextToken: String
) {
  goldenVersesByBookIdAndChapter(
    bookId: $bookId
    chapter: $chapter
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GoldenVersesByBookIdAndChapterQueryVariables,
  APITypes.GoldenVersesByBookIdAndChapterQuery
>;
export const lessonGoldenVersesByLessonIdAndOrder = /* GraphQL */ `query LessonGoldenVersesByLessonIdAndOrder(
  $lessonId: ID!
  $order: ModelIntKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelLessonGoldenVerseFilterInput
  $limit: Int
  $nextToken: String
) {
  lessonGoldenVersesByLessonIdAndOrder(
    lessonId: $lessonId
    order: $order
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      lessonId
      goldenVerseId
      order
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.LessonGoldenVersesByLessonIdAndOrderQueryVariables,
  APITypes.LessonGoldenVersesByLessonIdAndOrderQuery
>;
export const lessonGoldenVersesByGoldenVerseId = /* GraphQL */ `query LessonGoldenVersesByGoldenVerseId(
  $goldenVerseId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelLessonGoldenVerseFilterInput
  $limit: Int
  $nextToken: String
) {
  lessonGoldenVersesByGoldenVerseId(
    goldenVerseId: $goldenVerseId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      lessonId
      goldenVerseId
      order
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.LessonGoldenVersesByGoldenVerseIdQueryVariables,
  APITypes.LessonGoldenVersesByGoldenVerseIdQuery
>;
export const pupilsByGradeIdAndLastName = /* GraphQL */ `query PupilsByGradeIdAndLastName(
  $gradeId: ID!
  $lastName: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelPupilFilterInput
  $limit: Int
  $nextToken: String
) {
  pupilsByGradeIdAndLastName(
    gradeId: $gradeId
    lastName: $lastName
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      gradeId
      firstName
      lastName
      middleName
      dateOfBirth
      photo
      active
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.PupilsByGradeIdAndLastNameQueryVariables,
  APITypes.PupilsByGradeIdAndLastNameQuery
>;
export const homeworkChecksByLessonIdAndPupilId = /* GraphQL */ `query HomeworkChecksByLessonIdAndPupilId(
  $lessonId: ID!
  $pupilId: ModelIDKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelHomeworkCheckFilterInput
  $limit: Int
  $nextToken: String
) {
  homeworkChecksByLessonIdAndPupilId(
    lessonId: $lessonId
    pupilId: $pupilId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.HomeworkChecksByLessonIdAndPupilIdQueryVariables,
  APITypes.HomeworkChecksByLessonIdAndPupilIdQuery
>;
export const homeworkChecksByPupilIdAndCreatedAt = /* GraphQL */ `query HomeworkChecksByPupilIdAndCreatedAt(
  $pupilId: ID!
  $createdAt: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelHomeworkCheckFilterInput
  $limit: Int
  $nextToken: String
) {
  homeworkChecksByPupilIdAndCreatedAt(
    pupilId: $pupilId
    createdAt: $createdAt
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.HomeworkChecksByPupilIdAndCreatedAtQueryVariables,
  APITypes.HomeworkChecksByPupilIdAndCreatedAtQuery
>;
export const homeworkChecksByGradeIdAndCreatedAt = /* GraphQL */ `query HomeworkChecksByGradeIdAndCreatedAt(
  $gradeId: ID!
  $createdAt: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelHomeworkCheckFilterInput
  $limit: Int
  $nextToken: String
) {
  homeworkChecksByGradeIdAndCreatedAt(
    gradeId: $gradeId
    createdAt: $createdAt
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.HomeworkChecksByGradeIdAndCreatedAtQueryVariables,
  APITypes.HomeworkChecksByGradeIdAndCreatedAtQuery
>;
export const achievementsByName = /* GraphQL */ `query AchievementsByName(
  $name: String!
  $sortDirection: ModelSortDirection
  $filter: ModelAchievementFilterInput
  $limit: Int
  $nextToken: String
) {
  achievementsByName(
    name: $name
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      name
      description
      icon
      criteria
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.AchievementsByNameQueryVariables,
  APITypes.AchievementsByNameQuery
>;
export const pupilAchievementsByPupilIdAndAwardedAt = /* GraphQL */ `query PupilAchievementsByPupilIdAndAwardedAt(
  $pupilId: ID!
  $awardedAt: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelPupilAchievementFilterInput
  $limit: Int
  $nextToken: String
) {
  pupilAchievementsByPupilIdAndAwardedAt(
    pupilId: $pupilId
    awardedAt: $awardedAt
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      pupilId
      achievementId
      awardedAt
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.PupilAchievementsByPupilIdAndAwardedAtQueryVariables,
  APITypes.PupilAchievementsByPupilIdAndAwardedAtQuery
>;
export const pupilAchievementsByAchievementId = /* GraphQL */ `query PupilAchievementsByAchievementId(
  $achievementId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelPupilAchievementFilterInput
  $limit: Int
  $nextToken: String
) {
  pupilAchievementsByAchievementId(
    achievementId: $achievementId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      pupilId
      achievementId
      awardedAt
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.PupilAchievementsByAchievementIdQueryVariables,
  APITypes.PupilAchievementsByAchievementIdQuery
>;
export const bricksIssuesByPupilIdAndIssuedAt = /* GraphQL */ `query BricksIssuesByPupilIdAndIssuedAt(
  $pupilId: ID!
  $issuedAt: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelBricksIssueFilterInput
  $limit: Int
  $nextToken: String
) {
  bricksIssuesByPupilIdAndIssuedAt(
    pupilId: $pupilId
    issuedAt: $issuedAt
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      pupilId
      academicYearId
      gradeId
      quantity
      issuedAt
      issuedBy
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.BricksIssuesByPupilIdAndIssuedAtQueryVariables,
  APITypes.BricksIssuesByPupilIdAndIssuedAtQuery
>;
export const bricksIssuesByAcademicYearIdAndIssuedAt = /* GraphQL */ `query BricksIssuesByAcademicYearIdAndIssuedAt(
  $academicYearId: ID!
  $issuedAt: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelBricksIssueFilterInput
  $limit: Int
  $nextToken: String
) {
  bricksIssuesByAcademicYearIdAndIssuedAt(
    academicYearId: $academicYearId
    issuedAt: $issuedAt
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      pupilId
      academicYearId
      gradeId
      quantity
      issuedAt
      issuedBy
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.BricksIssuesByAcademicYearIdAndIssuedAtQueryVariables,
  APITypes.BricksIssuesByAcademicYearIdAndIssuedAtQuery
>;
export const bricksIssuesByGradeIdAndIssuedAt = /* GraphQL */ `query BricksIssuesByGradeIdAndIssuedAt(
  $gradeId: ID!
  $issuedAt: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelBricksIssueFilterInput
  $limit: Int
  $nextToken: String
) {
  bricksIssuesByGradeIdAndIssuedAt(
    gradeId: $gradeId
    issuedAt: $issuedAt
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      pupilId
      academicYearId
      gradeId
      quantity
      issuedAt
      issuedBy
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.BricksIssuesByGradeIdAndIssuedAtQueryVariables,
  APITypes.BricksIssuesByGradeIdAndIssuedAtQuery
>;
export const familiesByMotherPhone = /* GraphQL */ `query FamiliesByMotherPhone(
  $motherPhone: String!
  $sortDirection: ModelSortDirection
  $filter: ModelFamilyFilterInput
  $limit: Int
  $nextToken: String
) {
  familiesByMotherPhone(
    motherPhone: $motherPhone
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.FamiliesByMotherPhoneQueryVariables,
  APITypes.FamiliesByMotherPhoneQuery
>;
export const familiesByFatherPhone = /* GraphQL */ `query FamiliesByFatherPhone(
  $fatherPhone: String!
  $sortDirection: ModelSortDirection
  $filter: ModelFamilyFilterInput
  $limit: Int
  $nextToken: String
) {
  familiesByFatherPhone(
    fatherPhone: $fatherPhone
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.FamiliesByFatherPhoneQueryVariables,
  APITypes.FamiliesByFatherPhoneQuery
>;
export const familyMembersByFamilyId = /* GraphQL */ `query FamilyMembersByFamilyId(
  $familyId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelFamilyMemberFilterInput
  $limit: Int
  $nextToken: String
) {
  familyMembersByFamilyId(
    familyId: $familyId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      familyId
      pupilId
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.FamilyMembersByFamilyIdQueryVariables,
  APITypes.FamilyMembersByFamilyIdQuery
>;
export const familyMembersByPupilId = /* GraphQL */ `query FamilyMembersByPupilId(
  $pupilId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelFamilyMemberFilterInput
  $limit: Int
  $nextToken: String
) {
  familyMembersByPupilId(
    pupilId: $pupilId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      familyId
      pupilId
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.FamilyMembersByPupilIdQueryVariables,
  APITypes.FamilyMembersByPupilIdQuery
>;
export const userFamiliesByUserId = /* GraphQL */ `query UserFamiliesByUserId(
  $userId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelUserFamilyFilterInput
  $limit: Int
  $nextToken: String
) {
  userFamiliesByUserId(
    userId: $userId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      userId
      familyId
      phone
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.UserFamiliesByUserIdQueryVariables,
  APITypes.UserFamiliesByUserIdQuery
>;
export const userFamiliesByFamilyId = /* GraphQL */ `query UserFamiliesByFamilyId(
  $familyId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelUserFamilyFilterInput
  $limit: Int
  $nextToken: String
) {
  userFamiliesByFamilyId(
    familyId: $familyId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      userId
      familyId
      phone
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.UserFamiliesByFamilyIdQueryVariables,
  APITypes.UserFamiliesByFamilyIdQuery
>;
export const userFamiliesByPhone = /* GraphQL */ `query UserFamiliesByPhone(
  $phone: String!
  $sortDirection: ModelSortDirection
  $filter: ModelUserFamilyFilterInput
  $limit: Int
  $nextToken: String
) {
  userFamiliesByPhone(
    phone: $phone
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      userId
      familyId
      phone
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.UserFamiliesByPhoneQueryVariables,
  APITypes.UserFamiliesByPhoneQuery
>;
export const gradeEventsByGradeIdAndEventDate = /* GraphQL */ `query GradeEventsByGradeIdAndEventDate(
  $gradeId: ID!
  $eventDate: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelGradeEventFilterInput
  $limit: Int
  $nextToken: String
) {
  gradeEventsByGradeIdAndEventDate(
    gradeId: $gradeId
    eventDate: $eventDate
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GradeEventsByGradeIdAndEventDateQueryVariables,
  APITypes.GradeEventsByGradeIdAndEventDateQuery
>;
export const gradeSettingsByGradeId = /* GraphQL */ `query GradeSettingsByGradeId(
  $gradeId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelGradeSettingsFilterInput
  $limit: Int
  $nextToken: String
) {
  gradeSettingsByGradeId(
    gradeId: $gradeId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GradeSettingsByGradeIdQueryVariables,
  APITypes.GradeSettingsByGradeIdQuery
>;
