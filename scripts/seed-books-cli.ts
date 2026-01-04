/**
 * CLI script to seed Books table with all 66 books of the Bible
 * Uses AWS CLI credentials to access DynamoDB directly
 * 
 * Usage:
 *   npm run seed:books
 *   or
 *   npx tsx scripts/seed-books-cli.ts
 * 
 * Requirements:
 *   - AWS credentials configured via AWS CLI (`aws configure`)
 *   - IAM permissions for DynamoDB (PutItem, Query, Scan on Book table)
 *   - DynamoDB table name (auto-detected from Amplify environment)
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { 
  DynamoDBClient,
  PutItemCommand,
  ScanCommand,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';
import { 
  defaultProvider as credentialsProvider 
} from '@aws-sdk/credential-provider-node';
import { marshall } from '@aws-sdk/util-dynamodb';
import { randomUUID } from 'crypto';
import { booksSeedData, type BookSeedData } from './seed-books-data';

// Load Amplify configuration
const amplifyConfigPath = join(__dirname, '../src/amplifyconfiguration.json');
const amplifyConfig = JSON.parse(
  readFileSync(amplifyConfigPath, 'utf-8')
);

const AWS_REGION = amplifyConfig.aws_project_region || 'us-east-1';

// DynamoDB table name pattern: Book-{apiId}-{env}
// For Amplify Gen 1, table names follow pattern: {ModelName}-{apiId}-{env}
const getTableName = async (client: DynamoDBClient): Promise<string> => {
  // Try to get from environment
  if (process.env.BOOK_TABLE_NAME) {
    return process.env.BOOK_TABLE_NAME;
  }

  // Try to detect from Amplify meta
  try {
    const amplifyMetaPath = join(__dirname, '../amplify/backend/amplify-meta.json');
    const amplifyMeta = JSON.parse(readFileSync(amplifyMetaPath, 'utf-8'));
    const apiId = amplifyMeta?.api?.sunsch?.GraphQLAPIIdOutput;
    const env = process.env.AWS_BRANCH || 'dev';
    
    if (apiId) {
      return `Book-${apiId}-${env}`;
    }
  } catch (_error) {
    // Fall through to list tables
  }

  // Fallback: List tables and find Book table
  try {
    const { ListTablesCommand } = await import('@aws-sdk/client-dynamodb');
    const listCommand = new ListTablesCommand({});
    const result = await client.send(listCommand);
    
    const bookTable = result.TableNames?.find(name => name.startsWith('Book-'));
    if (bookTable) {
      return bookTable;
    }
  } catch (_error) {
    console.warn('Could not auto-detect table name, using default pattern');
  }

  // Default pattern (from known report)
  return 'Book-2ito3uqzjbdcbonnabmm3io6x4-dev';
};

// Table name will be determined at runtime
let TABLE_NAME = '';

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
 * Check if books already exist
 */
async function checkExistingBooks(client: DynamoDBClient): Promise<number> {
  try {
    const command: ScanCommand = new ScanCommand({
      TableName: TABLE_NAME,
      Select: 'COUNT',
    });

    const result = await client.send(command);
    const count = result.Count || 0;
    console.log(`📚 Found ${count} existing books in database`);
    return count;
  } catch (error) {
    if (error instanceof Error && error.message.includes('ResourceNotFoundException')) {
      console.log('📚 Table not found or empty (0 books)');
      return 0;
    }
    console.error('❌ Error checking existing books:', error);
    return 0;
  }
}

/**
 * Check if book exists by shortName using GSI
 */
async function bookExists(
  client: DynamoDBClient,
  shortName: string
): Promise<boolean> {
  try {
    const command = new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: 'byShortName',
      KeyConditionExpression: 'shortName = :shortName',
      ExpressionAttributeValues: marshall({
        ':shortName': shortName,
      }),
    });

    const result = await client.send(command);
    return (result.Items?.length || 0) > 0;
  } catch (_error) {
    // If GSI doesn't exist or query fails, assume book doesn't exist
    return false;
  }
}

/**
 * Create a single book in DynamoDB
 */
async function createBookRecord(
  client: DynamoDBClient,
  bookData: BookSeedData
): Promise<{ success: boolean; error?: string }> {
  try {
    const now = new Date().toISOString();
    const id = randomUUID();

    const item = {
      id,
      fullName: bookData.fullName,
      shortName: bookData.shortName,
      abbreviation: bookData.abbreviation,
      testament: bookData.testament,
      order: bookData.order,
      createdAt: now,
      updatedAt: now,
      __typename: 'Book',
    };

    const command = new PutItemCommand({
      TableName: TABLE_NAME,
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
 * Main seed function
 */
async function seedBooks(): Promise<void> {
  console.log('🌱 Starting Books table seed using AWS CLI credentials...\n');

  // Verify AWS credentials
  let credentials;
  try {
    credentials = await credentialsProvider()();
    if (!credentials) {
      throw new Error('No AWS credentials found');
    }
    console.log('✅ AWS credentials loaded from AWS CLI');
    console.log(`   Region: ${AWS_REGION}`);
  } catch (_error) {
    console.error('❌ Failed to load AWS credentials!');
    console.error('   Make sure AWS CLI is configured:');
    console.error('   Run: aws configure');
    console.error('   Or set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables');
    process.exit(1);
  }

  // Initialize DynamoDB client
  const client = getDynamoDBClient();

  // Get table name
  TABLE_NAME = await getTableName(client);
  console.log(`   Table: ${TABLE_NAME}\n`);

  // Check existing books
  const existingCount = await checkExistingBooks(client);
  if (existingCount >= 66) {
    console.log('✅ Books table is already populated with all 66 books');
    process.exit(0);
  }

  // Create books
  console.log(`\n📖 Creating ${booksSeedData.length} books...\n`);
  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (let i = 0; i < booksSeedData.length; i++) {
    const bookData = booksSeedData[i];
    const progress = `[${i + 1}/${booksSeedData.length}]`;

    // Check if book already exists
    const exists = await bookExists(client, bookData.shortName);
    if (exists) {
      console.log(
        `${progress} ⏭️  Skipped: ${bookData.shortName} (already exists)`
      );
      skipped++;
      continue;
    }

    // Create book
    const result = await createBookRecord(client, bookData);

    if (result.success) {
      console.log(
        `${progress} ✅ Created: ${bookData.shortName} (${bookData.testament})`
      );
      created++;
    } else {
      // Check if error is about duplicate
      if (
        result.error?.includes('already exists') ||
        result.error?.includes('ConditionalCheckFailedException')
      ) {
        console.log(
          `${progress} ⏭️  Skipped: ${bookData.shortName} (duplicate)`
        );
        skipped++;
      } else {
        console.error(
          `${progress} ❌ Error: ${bookData.shortName} - ${result.error}`
        );
        errors++;
      }
    }

    // Small delay to avoid rate limiting
    if (i < booksSeedData.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Seed Summary:');
  console.log(`   ✅ Created: ${created}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log(`   📚 Total: ${booksSeedData.length}`);
  console.log('='.repeat(50) + '\n');

  if (errors > 0) {
    console.warn('⚠️  Some books failed to create. Check errors above.');
    process.exit(1);
  }

  if (created + skipped === booksSeedData.length) {
    console.log('✅ Seed completed successfully!');
    process.exit(0);
  } else {
    console.error('❌ Seed completed with issues');
    process.exit(1);
  }
}

// Run seed when script is executed
seedBooks().catch((error) => {
  console.error('❌ Fatal error:', error);
  if (error instanceof Error) {
    console.error('   Message:', error.message);
    if (error.stack) {
      console.error('   Stack:', error.stack);
    }
  }
  process.exit(1);
});

export { seedBooks };
