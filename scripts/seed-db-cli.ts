/**
 * CLI script to seed all DynamoDB tables with test data
 * Uses AWS CLI credentials to access DynamoDB directly
 * 
 * Usage:
 *   npm run seed:db
 *   or
 *   npx tsx scripts/seed-db-cli.ts
 * 
 * Requirements:
 *   - AWS credentials configured via AWS CLI (`aws configure`)
 *   - IAM permissions for DynamoDB (PutItem, Query, Scan on all tables)
 *   - DynamoDB tables created via `amplify push`
 *   - Book table already populated (use `npm run seed:books` first)
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import {
  DynamoDBClient,
  PutItemCommand,
  ScanCommand,
  ListTablesCommand,
  DescribeTableCommand,
} from '@aws-sdk/client-dynamodb';
import {
  defaultProvider as credentialsProvider,
} from '@aws-sdk/credential-provider-node';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { randomUUID } from 'crypto';
import {
  usersSeedData,
  gradesSeedData,
  userGradesSeedData,
  academicYearsSeedData,
  lessonsSeedData,
  goldenVersesSeedData,
  lessonGoldenVersesSeedData,
  pupilsSeedData,
  homeworkChecksSeedData,
  achievementsSeedData,
  pupilAchievementsSeedData,
  familiesSeedData,
  familyMembersSeedData,
  userFamiliesSeedData,
  gradeEventsSeedData,
  gradeSettingsSeedData,
  type GoldenVerseSeedData,
  type HomeworkCheckSeedData,
  type LessonSeedData,
} from './seed-db-data';

// Load Amplify configuration
const amplifyConfigPath = join(__dirname, '../src/amplifyconfiguration.json');
const amplifyConfig = JSON.parse(
  readFileSync(amplifyConfigPath, 'utf-8')
);

const AWS_REGION = amplifyConfig.aws_project_region || 'us-east-1';

// Table name cache
const tableNameCache: Record<string, string> = {};

/**
 * Get table name for a model
 */
async function getTableName(
  client: DynamoDBClient,
  modelName: string
): Promise<string> {
  // Check cache
  if (tableNameCache[modelName]) {
    return tableNameCache[modelName];
  }

  // Try to get from environment
  const envVar = `${modelName.toUpperCase()}_TABLE_NAME`;
  const envTableName = process.env[envVar];
  if (envTableName) {
    tableNameCache[modelName] = envTableName;
    return envTableName;
  }

  // Try to detect from Amplify meta
  try {
    const amplifyMetaPath = join(__dirname, '../amplify/backend/amplify-meta.json');
    const amplifyMeta = JSON.parse(readFileSync(amplifyMetaPath, 'utf-8'));
    const apiId = amplifyMeta?.api?.sunsch?.GraphQLAPIIdOutput;
    const env = process.env.AWS_BRANCH || 'dev';

    if (apiId) {
      const tableName = `${modelName}-${apiId}-${env}`;
      tableNameCache[modelName] = tableName;
      return tableName;
    }
  } catch (_error) {
    // Fall through to list tables
  }

  // Fallback: List tables and find matching table
  try {
    const listCommand = new ListTablesCommand({});
    const result = await client.send(listCommand);

    const matchingTable = result.TableNames?.find((name) =>
      name.startsWith(`${modelName}-`)
    );
    if (matchingTable) {
      tableNameCache[modelName] = matchingTable;
      return matchingTable;
    }
  } catch (_error) {
    console.warn(`Could not auto-detect table name for ${modelName}`);
  }

  // Default pattern (will fail if incorrect, but provides a fallback)
  const defaultTableName = `${modelName}-2ito3uqzjbdcbonnabmm3io6x4-dev`;
  tableNameCache[modelName] = defaultTableName;
  return defaultTableName;
}

/**
 * Create a single record in DynamoDB
 */
async function createRecord<T extends Record<string, unknown>>(
  client: DynamoDBClient,
  tableName: string,
  data: T,
  modelName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const now = new Date().toISOString();

    // Add timestamps if not present
    const item = {
      ...data,
      createdAt: data.createdAt || now,
      updatedAt: data.updatedAt || now,
      __typename: modelName,
    } as Record<string, unknown>;

    const command = new PutItemCommand({
      TableName: tableName,
      Item: marshall(item),
      // Prevent overwriting if item already exists
      ConditionExpression: 'attribute_not_exists(id)',
    });

    await client.send(command);
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Check if error is about item already existing
    if (
      errorMessage.includes('ConditionalCheckFailedException') ||
      errorMessage.includes('already exists')
    ) {
      return { success: false, error: 'already exists' };
    }

    return { success: false, error: errorMessage };
  }
}

/**
 * Initialize DynamoDB client
 */
function getDynamoDBClient(): DynamoDBClient {
  return new DynamoDBClient({
    region: AWS_REGION,
    credentials: credentialsProvider(),
  });
}

/**
 * Inspect table structure
 */
async function inspectTableStructure(
  client: DynamoDBClient,
  tableName: string
): Promise<void> {
  try {
    const command = new DescribeTableCommand({ TableName: tableName });
    const result = await client.send(command);
    console.log(`   Table: ${tableName}`);
    console.log(`   Key Schema: ${JSON.stringify(result.Table?.KeySchema)}`);
  } catch (_error) {
    // Table might not exist yet, that's okay
    console.warn(`   Could not inspect table ${tableName}`);
  }
}

/**
 * Get existing books from database
 */
async function getExistingBooks(
  client: DynamoDBClient,
  limit: number = 10
): Promise<Array<{ id: string; shortName: string }>> {
  try {
    const tableName = await getTableName(client, 'Book');
    const command = new ScanCommand({
      TableName: tableName,
      Limit: limit,
    });

    const result = await client.send(command);
    if (!result.Items) {
      return [];
    }

    return result.Items.map((item) => {
      const unmarshalled = unmarshall(item);
      return {
        id: unmarshalled.id as string,
        shortName: unmarshalled.shortName as string,
      };
    });
  } catch (_error) {
    console.warn('Could not get existing books, using fallback');
    return [];
  }
}


/**
 * Seed Users
 */
async function seedUsers(client: DynamoDBClient): Promise<{
  created: number;
  skipped: number;
  errors: number;
}> {
  const tableName = await getTableName(client, 'User');
  let created = 0;
  let skipped = 0;
  let errors = 0;

  console.log(`\n👥 Creating ${usersSeedData.length} users...\n`);

  for (let i = 0; i < usersSeedData.length; i++) {
    const userData = usersSeedData[i];
    const progress = `[${i + 1}/${usersSeedData.length}]`;

    const result = await createRecord(client, tableName, userData as unknown as Record<string, unknown>, 'User');

    if (result.success) {
      console.log(`${progress} ✅ Created: ${userData.name} (${userData.role})`);
      created++;
    } else if (result.error === 'already exists') {
      console.log(`${progress} ⏭️  Skipped: ${userData.name} (already exists)`);
      skipped++;
    } else {
      console.error(`${progress} ❌ Error: ${userData.name} - ${result.error}`);
      errors++;
    }

    if (i < usersSeedData.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }

  return { created, skipped, errors };
}

/**
 * Seed Grades
 */
async function seedGrades(client: DynamoDBClient): Promise<{
  created: number;
  skipped: number;
  errors: number;
}> {
  const tableName = await getTableName(client, 'Grade');
  let created = 0;
  let skipped = 0;
  let errors = 0;

  console.log(`\n📚 Creating ${gradesSeedData.length} grades...\n`);

  for (let i = 0; i < gradesSeedData.length; i++) {
    const gradeData = gradesSeedData[i];
    const progress = `[${i + 1}/${gradesSeedData.length}]`;

    const result = await createRecord(client, tableName, gradeData as unknown as Record<string, unknown>, 'Grade');

    if (result.success) {
      console.log(`${progress} ✅ Created: ${gradeData.name}`);
      created++;
    } else if (result.error === 'already exists') {
      console.log(`${progress} ⏭️  Skipped: ${gradeData.name} (already exists)`);
      skipped++;
    } else {
      console.error(`${progress} ❌ Error: ${gradeData.name} - ${result.error}`);
      errors++;
    }

    if (i < gradesSeedData.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }

  return { created, skipped, errors };
}

/**
 * Seed UserGrades
 */
async function seedUserGrades(client: DynamoDBClient): Promise<{
  created: number;
  skipped: number;
  errors: number;
}> {
  const tableName = await getTableName(client, 'UserGrade');
  let created = 0;
  let skipped = 0;
  let errors = 0;

  console.log(`\n🔗 Creating ${userGradesSeedData.length} user-grade links...\n`);

  for (let i = 0; i < userGradesSeedData.length; i++) {
    const linkData = userGradesSeedData[i];
    const progress = `[${i + 1}/${userGradesSeedData.length}]`;

    const data = {
      ...linkData,
      assignedAt: new Date().toISOString(),
    };

    const result = await createRecord(client, tableName, data as unknown as Record<string, unknown>, 'UserGrade');

    if (result.success) {
      console.log(`${progress} ✅ Created: User-Grade link`);
      created++;
    } else if (result.error === 'already exists') {
      console.log(`${progress} ⏭️  Skipped: User-Grade link (already exists)`);
      skipped++;
    } else {
      console.error(`${progress} ❌ Error: User-Grade link - ${result.error}`);
      errors++;
    }

    if (i < userGradesSeedData.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }

  return { created, skipped, errors };
}

/**
 * Seed AcademicYears
 */
async function seedAcademicYears(client: DynamoDBClient): Promise<{
  created: number;
  skipped: number;
  errors: number;
}> {
  const tableName = await getTableName(client, 'AcademicYear');
  let created = 0;
  let skipped = 0;
  let errors = 0;

  console.log(`\n📅 Creating ${academicYearsSeedData.length} academic years...\n`);

  for (let i = 0; i < academicYearsSeedData.length; i++) {
    const yearData = academicYearsSeedData[i];
    const progress = `[${i + 1}/${academicYearsSeedData.length}]`;

    const result = await createRecord(client, tableName, yearData as unknown as Record<string, unknown>, 'AcademicYear');

    if (result.success) {
      console.log(`${progress} ✅ Created: ${yearData.name}`);
      created++;
    } else if (result.error === 'already exists') {
      console.log(`${progress} ⏭️  Skipped: ${yearData.name} (already exists)`);
      skipped++;
    } else {
      console.error(`${progress} ❌ Error: ${yearData.name} - ${result.error}`);
      errors++;
    }

    if (i < academicYearsSeedData.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }

  return { created, skipped, errors };
}

/**
 * Seed Lessons
 */
async function seedLessons(client: DynamoDBClient): Promise<{
  created: number;
  skipped: number;
  errors: number;
}> {
  const tableName = await getTableName(client, 'Lesson');
  let created = 0;
  let skipped = 0;
  let errors = 0;

  console.log(`\n📖 Creating ${lessonsSeedData.length} lessons...\n`);

  for (let i = 0; i < lessonsSeedData.length; i++) {
    const lessonData = lessonsSeedData[i];
    const progress = `[${i + 1}/${lessonsSeedData.length}]`;

    const result = await createRecord(client, tableName, lessonData as unknown as Record<string, unknown>, 'Lesson');

    if (result.success) {
      console.log(`${progress} ✅ Created: ${lessonData.title}`);
      created++;
    } else if (result.error === 'already exists') {
      console.log(`${progress} ⏭️  Skipped: ${lessonData.title} (already exists)`);
      skipped++;
    } else {
      console.error(`${progress} ❌ Error: ${lessonData.title} - ${result.error}`);
      errors++;
    }

    if (i < lessonsSeedData.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }

  return { created, skipped, errors };
}

/**
 * Seed GoldenVerses
 */
async function seedGoldenVerses(client: DynamoDBClient): Promise<{
  created: number;
  skipped: number;
  errors: number;
}> {
  const tableName = await getTableName(client, 'GoldenVerse');
  let created = 0;
  let skipped = 0;
  let errors = 0;

  // Get existing books
  const books = await getExistingBooks(client, 20);
  if (books.length === 0) {
    console.error('❌ No books found in database. Please run `npm run seed:books` first.');
    return { created: 0, skipped: 0, errors: goldenVersesSeedData.length };
  }

  // Map references to book IDs (simplified mapping)
  const bookMap: Record<string, string> = {};
  books.forEach((book) => {
    // Simple mapping based on reference
    if (book.shortName.includes('Быт') || book.shortName.includes('Бытие')) {
      bookMap['Быт'] = book.id;
    } else if (book.shortName.includes('Иоанна') || book.shortName.includes('Иоанн')) {
      bookMap['Иоанна'] = book.id;
    } else if (book.shortName.includes('Матфея') || book.shortName.includes('Матфей')) {
      bookMap['Матфея'] = book.id;
    } else if (book.shortName.includes('Марка') || book.shortName.includes('Марк')) {
      bookMap['Марка'] = book.id;
    } else if (book.shortName.includes('Исход') || book.shortName.includes('Исх')) {
      bookMap['Исх'] = book.id;
    }
  });

  // Use first book as fallback
  const fallbackBookId = books[0].id;

  console.log(`\n📜 Creating ${goldenVersesSeedData.length} golden verses...\n`);

  for (let i = 0; i < goldenVersesSeedData.length; i++) {
    const verseData = goldenVersesSeedData[i];
    const progress = `[${i + 1}/${goldenVersesSeedData.length}]`;

    // Determine bookId from reference
    let bookId = fallbackBookId;
    if (verseData.reference.startsWith('Быт.')) {
      bookId = bookMap['Быт'] || fallbackBookId;
    } else if (verseData.reference.startsWith('Иоанна')) {
      bookId = bookMap['Иоанна'] || fallbackBookId;
    } else if (verseData.reference.startsWith('Матфея')) {
      bookId = bookMap['Матфея'] || fallbackBookId;
    } else if (verseData.reference.startsWith('Марка')) {
      bookId = bookMap['Марка'] || fallbackBookId;
    } else if (verseData.reference.startsWith('Исх.')) {
      bookId = bookMap['Исх'] || fallbackBookId;
    }

    const data: GoldenVerseSeedData = {
      ...verseData,
      bookId,
    };

    const result = await createRecord(client, tableName, data as unknown as Record<string, unknown>, 'GoldenVerse');

    if (result.success) {
      console.log(`${progress} ✅ Created: ${verseData.reference}`);
      created++;
    } else if (result.error === 'already exists') {
      console.log(`${progress} ⏭️  Skipped: ${verseData.reference} (already exists)`);
      skipped++;
    } else {
      console.error(`${progress} ❌ Error: ${verseData.reference} - ${result.error}`);
      errors++;
    }

    if (i < goldenVersesSeedData.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }

  return { created, skipped, errors };
}

/**
 * Seed LessonGoldenVerses
 */
async function seedLessonGoldenVerses(client: DynamoDBClient): Promise<{
  created: number;
  skipped: number;
  errors: number;
}> {
  const tableName = await getTableName(client, 'LessonGoldenVerse');
  let created = 0;
  let skipped = 0;
  let errors = 0;

  console.log(`\n🔗 Creating ${lessonGoldenVersesSeedData.length} lesson-golden verse links...\n`);

  for (let i = 0; i < lessonGoldenVersesSeedData.length; i++) {
    const linkData = lessonGoldenVersesSeedData[i];
    const progress = `[${i + 1}/${lessonGoldenVersesSeedData.length}]`;

    const result = await createRecord(client, tableName, linkData as unknown as Record<string, unknown>, 'LessonGoldenVerse');

    if (result.success) {
      console.log(`${progress} ✅ Created: Lesson-GoldenVerse link`);
      created++;
    } else if (result.error === 'already exists') {
      console.log(`${progress} ⏭️  Skipped: Lesson-GoldenVerse link (already exists)`);
      skipped++;
    } else {
      console.error(`${progress} ❌ Error: Lesson-GoldenVerse link - ${result.error}`);
      errors++;
    }

    if (i < lessonGoldenVersesSeedData.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }

  return { created, skipped, errors };
}

/**
 * Seed Pupils
 */
async function seedPupils(client: DynamoDBClient): Promise<{
  created: number;
  skipped: number;
  errors: number;
}> {
  const tableName = await getTableName(client, 'Pupil');
  let created = 0;
  let skipped = 0;
  let errors = 0;

  console.log(`\n👶 Creating ${pupilsSeedData.length} pupils...\n`);

  for (let i = 0; i < pupilsSeedData.length; i++) {
    const pupilData = pupilsSeedData[i];
    const progress = `[${i + 1}/${pupilsSeedData.length}]`;

    const result = await createRecord(client, tableName, pupilData as unknown as Record<string, unknown>, 'Pupil');

    if (result.success) {
      console.log(
        `${progress} ✅ Created: ${pupilData.lastName} ${pupilData.firstName}`
      );
      created++;
    } else if (result.error === 'already exists') {
      console.log(
        `${progress} ⏭️  Skipped: ${pupilData.lastName} ${pupilData.firstName} (already exists)`
      );
      skipped++;
    } else {
      console.error(
        `${progress} ❌ Error: ${pupilData.lastName} ${pupilData.firstName} - ${result.error}`
      );
      errors++;
    }

    if (i < pupilsSeedData.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }

  return { created, skipped, errors };
}

/**
 * Seed HomeworkChecks
 */
async function seedHomeworkChecks(client: DynamoDBClient): Promise<{
  created: number;
  skipped: number;
  errors: number;
}> {
  const tableName = await getTableName(client, 'HomeworkCheck');
  let created = 0;
  let skipped = 0;
  let errors = 0;

  // Generate homework checks: 3 per pupil, distributed across lessons
  const checks: Array<{
    lessonId: string;
    pupilId: string;
    gradeId: string;
    data: Omit<HomeworkCheckSeedData, 'id' | 'lessonId' | 'pupilId' | 'gradeId' | 'points'>;
  }> = [];

  // Get lessons by grade
  const lessonsByGrade: Record<string, LessonSeedData[]> = {};
  lessonsSeedData.forEach((lesson) => {
    if (!lessonsByGrade[lesson.gradeId]) {
      lessonsByGrade[lesson.gradeId] = [];
    }
    lessonsByGrade[lesson.gradeId].push(lesson);
  });

  // Create 3 checks per pupil
  pupilsSeedData.forEach((pupil) => {
    const gradeLessons = lessonsByGrade[pupil.gradeId] || [];
    if (gradeLessons.length === 0) return;

    // Distribute across available lessons
    for (let i = 0; i < 3 && i < gradeLessons.length; i++) {
      const lesson = gradeLessons[i];
      const checkTemplate =
        homeworkChecksSeedData[i % homeworkChecksSeedData.length];

      checks.push({
        lessonId: lesson.id,
        pupilId: pupil.id,
        gradeId: pupil.gradeId,
        data: checkTemplate,
      });
    }
  });

  console.log(`\n✅ Creating ${checks.length} homework checks...\n`);

  for (let i = 0; i < checks.length; i++) {
    const check = checks[i];
    const progress = `[${i + 1}/${checks.length}]`;

    // Calculate points
    const points =
      (check.data.goldenVerse1Score || 0) +
      (check.data.goldenVerse2Score || 0) +
      (check.data.goldenVerse3Score || 0) +
      (check.data.testScore || 0) +
      (check.data.notebookScore || 0) +
      (check.data.singing ? 5 : 0);

    const data: HomeworkCheckSeedData = {
      id: randomUUID(),
      lessonId: check.lessonId,
      pupilId: check.pupilId,
      gradeId: check.gradeId,
      ...check.data,
      points,
    };

    const result = await createRecord(client, tableName, data as unknown as Record<string, unknown>, 'HomeworkCheck');

    if (result.success) {
      console.log(`${progress} ✅ Created: HomeworkCheck`);
      created++;
    } else if (result.error === 'already exists') {
      console.log(`${progress} ⏭️  Skipped: HomeworkCheck (already exists)`);
      skipped++;
    } else {
      console.error(`${progress} ❌ Error: HomeworkCheck - ${result.error}`);
      errors++;
    }

    if (i < checks.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }

  return { created, skipped, errors };
}

/**
 * Seed Achievements
 */
async function seedAchievements(client: DynamoDBClient): Promise<{
  created: number;
  skipped: number;
  errors: number;
}> {
  const tableName = await getTableName(client, 'Achievement');
  let created = 0;
  let skipped = 0;
  let errors = 0;

  console.log(`\n🏆 Creating ${achievementsSeedData.length} achievements...\n`);

  for (let i = 0; i < achievementsSeedData.length; i++) {
    const achievementData = achievementsSeedData[i];
    const progress = `[${i + 1}/${achievementsSeedData.length}]`;

    const result = await createRecord(client, tableName, achievementData as unknown as Record<string, unknown>, 'Achievement');

    if (result.success) {
      console.log(`${progress} ✅ Created: ${achievementData.name}`);
      created++;
    } else if (result.error === 'already exists') {
      console.log(`${progress} ⏭️  Skipped: ${achievementData.name} (already exists)`);
      skipped++;
    } else {
      console.error(`${progress} ❌ Error: ${achievementData.name} - ${result.error}`);
      errors++;
    }

    if (i < achievementsSeedData.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }

  return { created, skipped, errors };
}

/**
 * Seed PupilAchievements
 */
async function seedPupilAchievements(client: DynamoDBClient): Promise<{
  created: number;
  skipped: number;
  errors: number;
}> {
  const tableName = await getTableName(client, 'PupilAchievement');
  let created = 0;
  let skipped = 0;
  let errors = 0;

  console.log(`\n🔗 Creating ${pupilAchievementsSeedData.length} pupil-achievement links...\n`);

  for (let i = 0; i < pupilAchievementsSeedData.length; i++) {
    const linkData = pupilAchievementsSeedData[i];
    const progress = `[${i + 1}/${pupilAchievementsSeedData.length}]`;

    const data = {
      ...linkData,
      awardedAt: new Date().toISOString(),
    };

    const result = await createRecord(client, tableName, data as unknown as Record<string, unknown>, 'PupilAchievement');

    if (result.success) {
      console.log(`${progress} ✅ Created: Pupil-Achievement link`);
      created++;
    } else if (result.error === 'already exists') {
      console.log(`${progress} ⏭️  Skipped: Pupil-Achievement link (already exists)`);
      skipped++;
    } else {
      console.error(`${progress} ❌ Error: Pupil-Achievement link - ${result.error}`);
      errors++;
    }

    if (i < pupilAchievementsSeedData.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }

  return { created, skipped, errors };
}

/**
 * Seed Families
 */
async function seedFamilies(client: DynamoDBClient): Promise<{
  created: number;
  skipped: number;
  errors: number;
}> {
  const tableName = await getTableName(client, 'Family');
  let created = 0;
  let skipped = 0;
  let errors = 0;

  console.log(`\n👨‍👩‍👧 Creating ${familiesSeedData.length} families...\n`);

  for (let i = 0; i < familiesSeedData.length; i++) {
    const familyData = familiesSeedData[i];
    const progress = `[${i + 1}/${familiesSeedData.length}]`;

    const result = await createRecord(client, tableName, familyData as unknown as Record<string, unknown>, 'Family');

    if (result.success) {
      console.log(`${progress} ✅ Created: ${familyData.name}`);
      created++;
    } else if (result.error === 'already exists') {
      console.log(`${progress} ⏭️  Skipped: ${familyData.name} (already exists)`);
      skipped++;
    } else {
      console.error(`${progress} ❌ Error: ${familyData.name} - ${result.error}`);
      errors++;
    }

    if (i < familiesSeedData.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }

  return { created, skipped, errors };
}

/**
 * Seed FamilyMembers
 */
async function seedFamilyMembers(client: DynamoDBClient): Promise<{
  created: number;
  skipped: number;
  errors: number;
}> {
  const tableName = await getTableName(client, 'FamilyMember');
  let created = 0;
  let skipped = 0;
  let errors = 0;

  console.log(`\n🔗 Creating ${familyMembersSeedData.length} family-member links...\n`);

  for (let i = 0; i < familyMembersSeedData.length; i++) {
    const linkData = familyMembersSeedData[i];
    const progress = `[${i + 1}/${familyMembersSeedData.length}]`;

    const result = await createRecord(client, tableName, linkData as unknown as Record<string, unknown>, 'FamilyMember');

    if (result.success) {
      console.log(`${progress} ✅ Created: Family-Member link`);
      created++;
    } else if (result.error === 'already exists') {
      console.log(`${progress} ⏭️  Skipped: Family-Member link (already exists)`);
      skipped++;
    } else {
      console.error(`${progress} ❌ Error: Family-Member link - ${result.error}`);
      errors++;
    }

    if (i < familyMembersSeedData.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }

  return { created, skipped, errors };
}

/**
 * Seed UserFamilies
 */
async function seedUserFamilies(client: DynamoDBClient): Promise<{
  created: number;
  skipped: number;
  errors: number;
}> {
  const tableName = await getTableName(client, 'UserFamily');
  let created = 0;
  let skipped = 0;
  let errors = 0;

  console.log(`\n🔗 Creating ${userFamiliesSeedData.length} user-family links...\n`);

  for (let i = 0; i < userFamiliesSeedData.length; i++) {
    const linkData = userFamiliesSeedData[i];
    const progress = `[${i + 1}/${userFamiliesSeedData.length}]`;

    const result = await createRecord(client, tableName, linkData as unknown as Record<string, unknown>, 'UserFamily');

    if (result.success) {
      console.log(`${progress} ✅ Created: User-Family link`);
      created++;
    } else if (result.error === 'already exists') {
      console.log(`${progress} ⏭️  Skipped: User-Family link (already exists)`);
      skipped++;
    } else {
      console.error(`${progress} ❌ Error: User-Family link - ${result.error}`);
      errors++;
    }

    if (i < userFamiliesSeedData.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }

  return { created, skipped, errors };
}

/**
 * Seed GradeEvents
 */
async function seedGradeEvents(client: DynamoDBClient): Promise<{
  created: number;
  skipped: number;
  errors: number;
}> {
  const tableName = await getTableName(client, 'GradeEvent');
  let created = 0;
  let skipped = 0;
  let errors = 0;

  console.log(`\n📅 Creating ${gradeEventsSeedData.length} grade events...\n`);

  for (let i = 0; i < gradeEventsSeedData.length; i++) {
    const eventData = gradeEventsSeedData[i];
    const progress = `[${i + 1}/${gradeEventsSeedData.length}]`;

    const result = await createRecord(client, tableName, eventData as unknown as Record<string, unknown>, 'GradeEvent');

    if (result.success) {
      console.log(`${progress} ✅ Created: ${eventData.title} (${eventData.eventType})`);
      created++;
    } else if (result.error === 'already exists') {
      console.log(`${progress} ⏭️  Skipped: ${eventData.title} (already exists)`);
      skipped++;
    } else {
      console.error(`${progress} ❌ Error: ${eventData.title} - ${result.error}`);
      errors++;
    }

    if (i < gradeEventsSeedData.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }

  return { created, skipped, errors };
}

/**
 * Seed GradeSettings
 */
async function seedGradeSettings(client: DynamoDBClient): Promise<{
  created: number;
  skipped: number;
  errors: number;
}> {
  const tableName = await getTableName(client, 'GradeSettings');
  let created = 0;
  let skipped = 0;
  let errors = 0;

  console.log(`\n⚙️  Creating ${gradeSettingsSeedData.length} grade settings...\n`);

  for (let i = 0; i < gradeSettingsSeedData.length; i++) {
    const settingsData = gradeSettingsSeedData[i];
    const progress = `[${i + 1}/${gradeSettingsSeedData.length}]`;

    const result = await createRecord(client, tableName, settingsData as unknown as Record<string, unknown>, 'GradeSettings');

    if (result.success) {
      console.log(`${progress} ✅ Created: GradeSettings for grade`);
      created++;
    } else if (result.error === 'already exists') {
      console.log(`${progress} ⏭️  Skipped: GradeSettings (already exists)`);
      skipped++;
    } else {
      console.error(`${progress} ❌ Error: GradeSettings - ${result.error}`);
      errors++;
    }

    if (i < gradeSettingsSeedData.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }

  return { created, skipped, errors };
}

/**
 * Main seed function
 */
async function seedAll(): Promise<void> {
  console.log('🌱 Starting database seed using AWS CLI credentials...\n');

  // Verify AWS credentials
  let credentials;
  try {
    credentials = await credentialsProvider()();
    if (!credentials) {
      throw new Error('No AWS credentials found');
    }
    console.log('✅ AWS credentials loaded from AWS CLI');
    console.log(`   Region: ${AWS_REGION}\n`);
  } catch (_error) {
    console.error('❌ Failed to load AWS credentials!');
    console.error('   Make sure AWS CLI is configured:');
    console.error('   Run: aws configure');
    console.error('   Or set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables');
    process.exit(1);
  }

  // Initialize DynamoDB client
  const client = getDynamoDBClient();

  // Inspect table structures (optional, for debugging)
  console.log('📋 Inspecting table structures...\n');
  const modelNames = [
    'User',
    'Grade',
    'UserGrade',
    'AcademicYear',
    'Lesson',
    'GoldenVerse',
    'LessonGoldenVerse',
    'Pupil',
    'HomeworkCheck',
    'Achievement',
    'PupilAchievement',
    'Family',
    'FamilyMember',
    'UserFamily',
    'GradeEvent',
    'GradeSettings',
  ];

  for (const modelName of modelNames) {
    try {
      const tableName = await getTableName(client, modelName);
      await inspectTableStructure(client, tableName);
    } catch (_error) {
      console.warn(`   ⚠️  Could not inspect ${modelName}`);
    }
  }

  // Seed all entities in order
  const results: Record<string, { created: number; skipped: number; errors: number }> = {};

  results.Users = await seedUsers(client);
  results.Grades = await seedGrades(client);
  results.UserGrades = await seedUserGrades(client);
  results.AcademicYears = await seedAcademicYears(client);
  results.Lessons = await seedLessons(client);
  results.GoldenVerses = await seedGoldenVerses(client);
  results.LessonGoldenVerses = await seedLessonGoldenVerses(client);
  results.Pupils = await seedPupils(client);
  results.HomeworkChecks = await seedHomeworkChecks(client);
  results.Achievements = await seedAchievements(client);
  results.PupilAchievements = await seedPupilAchievements(client);
  results.Families = await seedFamilies(client);
  results.FamilyMembers = await seedFamilyMembers(client);
  results.UserFamilies = await seedUserFamilies(client);
  results.GradeEvents = await seedGradeEvents(client);
  results.GradeSettings = await seedGradeSettings(client);

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Seed Summary:');
  console.log('='.repeat(60));

  let totalCreated = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  Object.entries(results).forEach(([entity, stats]) => {
    console.log(`\n${entity}:`);
    console.log(`   ✅ Created: ${stats.created}`);
    console.log(`   ⏭️  Skipped: ${stats.skipped}`);
    console.log(`   ❌ Errors: ${stats.errors}`);
    totalCreated += stats.created;
    totalSkipped += stats.skipped;
    totalErrors += stats.errors;
  });

  console.log('\n' + '='.repeat(60));
  console.log('📈 Totals:');
  console.log(`   ✅ Created: ${totalCreated}`);
  console.log(`   ⏭️  Skipped: ${totalSkipped}`);
  console.log(`   ❌ Errors: ${totalErrors}`);
  console.log('='.repeat(60) + '\n');

  if (totalErrors > 0) {
    console.warn('⚠️  Some records failed to create. Check errors above.');
    process.exit(1);
  }

  if (totalCreated + totalSkipped > 0) {
    console.log('✅ Seed completed successfully!');
    process.exit(0);
  } else {
    console.error('❌ Seed completed with issues');
    process.exit(1);
  }
}

// Run seed when script is executed
seedAll().catch((err) => {
  console.error('❌ Fatal error:', err);
  if (err instanceof Error) {
    console.error('   Message:', err.message);
    if (err.stack) {
      console.error('   Stack:', err.stack);
    }
  }
  process.exit(1);
});

export { seedAll };

