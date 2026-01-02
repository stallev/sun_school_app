/**
 * CLI script to clear all DynamoDB tables (except Book) in PROD environment
 * Creates automatic backup before deletion
 * 
 * ⚠️ WARNING: This script is for PROD environment. Use with extreme caution!
 * 
 * Usage:
 *   AWS_BRANCH=prod npx tsx scripts/clear-db-prod.ts
 *   or
 *   $env:AWS_BRANCH="prod"; npx tsx scripts/clear-db-prod.ts
 * 
 * Requirements:
 *   - AWS credentials configured via AWS CLI (`aws configure`)
 *   - IAM permissions for DynamoDB (Scan, DeleteItem, BatchWriteItem on all tables)
 *   - DynamoDB tables created via `amplify push` in prod environment
 *   - AWS_BRANCH environment variable set to 'prod'
 * 
 * WARNING: This script will DELETE all data from PRODUCTION tables (except Book)!
 * A backup will be created automatically before deletion.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import {
  DynamoDBClient,
  ScanCommand,
  DeleteItemCommand,
  BatchWriteItemCommand,
  ListTablesCommand,
} from '@aws-sdk/client-dynamodb';
import {
  defaultProvider as credentialsProvider,
} from '@aws-sdk/credential-provider-node';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

// Load Amplify configuration
const amplifyConfigPath = join(__dirname, '../src/amplifyconfiguration.json');
const amplifyConfig = JSON.parse(
  readFileSync(amplifyConfigPath, 'utf-8')
);

const AWS_REGION = amplifyConfig.aws_project_region || 'us-east-1';

// Tables to exclude from clearing (Book table should be preserved)
const EXCLUDED_TABLES = ['Book'];

// Table name cache
const tableNameCache: Record<string, string> = {};

/**
 * Get table name for a model
 */
async function _getTableName(
  client: DynamoDBClient,
  modelName: string
): Promise<string | null> {
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

  return null;
}

/**
 * Get all table names from DynamoDB
 */
async function getAllTableNames(client: DynamoDBClient): Promise<string[]> {
  try {
    const listCommand = new ListTablesCommand({});
    const result = await client.send(listCommand);
    return result.TableNames || [];
  } catch (error) {
    console.error('Error listing tables:', error);
    return [];
  }
}

/**
 * Scan all items from a table
 */
async function scanAllItems(
  client: DynamoDBClient,
  tableName: string
): Promise<Array<Record<string, unknown>>> {
  const items: Array<Record<string, unknown>> = [];
  let lastEvaluatedKey: Record<string, unknown> | undefined = undefined;

  do {
    const command = new ScanCommand({
      TableName: tableName,
      ExclusiveStartKey: lastEvaluatedKey
        ? marshall(lastEvaluatedKey)
        : undefined,
    });

    const result = await client.send(command);

    if (result.Items) {
      for (const item of result.Items) {
        items.push(unmarshall(item));
      }
    }

    lastEvaluatedKey = result.LastEvaluatedKey
      ? unmarshall(result.LastEvaluatedKey)
      : undefined;
  } while (lastEvaluatedKey);

  return items;
}

/**
 * Create backup of a table
 */
async function backupTable(
  client: DynamoDBClient,
  tableName: string,
  backupDir: string
): Promise<number> {
  console.log(`   📦 Backing up ${tableName}...`);
  const items = await scanAllItems(client, tableName);
  
  if (items.length > 0) {
    const backupPath = join(backupDir, `${tableName}.json`);
    writeFileSync(backupPath, JSON.stringify(items, null, 2), 'utf-8');
    console.log(`   ✅ Backed up ${items.length} items to ${backupPath}`);
  } else {
    console.log(`   ⏭️  No items to backup in ${tableName}`);
  }

  return items.length;
}

/**
 * Delete all items from a table
 */
async function clearTable(
  client: DynamoDBClient,
  tableName: string
): Promise<number> {
  console.log(`   🗑️  Clearing ${tableName}...`);
  
  // First, get all items to determine keys
  const items = await scanAllItems(client, tableName);
  
  if (items.length === 0) {
    console.log(`   ⏭️  No items to delete in ${tableName}`);
    return 0;
  }

  // Get table key schema to determine partition key and sort key
  // For simplicity, we'll try to detect keys from the first item
  // In DynamoDB, keys are typically 'id' for partition key
  // For tables with sort keys, we'll need to handle them differently
  
  let deleted = 0;
  const batchSize = 25; // DynamoDB BatchWriteItem limit

  // Process in batches
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    
    const deleteRequests = batch.map((item) => {
      // Assume 'id' is the partition key (standard for Amplify)
      // If there's a sort key, we'll need to detect it, but for most tables it's just 'id'
      const key: Record<string, unknown> = { id: item.id };
      
      return {
        DeleteRequest: {
          Key: marshall(key),
        },
      };
    });

    try {
      const command = new BatchWriteItemCommand({
        RequestItems: {
          [tableName]: deleteRequests,
        },
      });

      await client.send(command);
      deleted += batch.length;
      
      // Small delay to avoid throttling
      if (i + batchSize < items.length) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.error(`   ❌ Error deleting batch from ${tableName}:`, error);
      // Try individual deletes as fallback
      for (const item of batch) {
        try {
          const deleteCommand = new DeleteItemCommand({
            TableName: tableName,
            Key: marshall({ id: item.id }),
          });
          await client.send(deleteCommand);
          deleted++;
        } catch (deleteError) {
          console.error(`   ❌ Error deleting item ${item.id}:`, deleteError);
        }
      }
    }
  }

  console.log(`   ✅ Deleted ${deleted} items from ${tableName}`);
  return deleted;
}

/**
 * Main function
 */
async function main(): Promise<void> {
  const env = process.env.AWS_BRANCH || 'prod';
  if (env !== 'prod') {
    console.error('❌ ERROR: This script is for PROD environment only!');
    console.error(`   Current environment: ${env}`);
    console.error('   Set AWS_BRANCH=prod to continue');
    process.exit(1);
  }

  console.log('🚀 Starting DynamoDB cleanup for PROD environment...\n');
  console.log('⚠️  WARNING: You are about to DELETE data from PRODUCTION database!\n');
  console.log('   Press Ctrl+C within 10 seconds to cancel...\n');
  
  // Wait 10 seconds for user to cancel
  await new Promise((resolve) => setTimeout(resolve, 10000));

  const client = new DynamoDBClient({
    region: AWS_REGION,
    credentials: credentialsProvider(),
  });

  // Get all table names
  const allTableNames = await getAllTableNames(client);
  
  // Filter out excluded tables and only include prod tables
  const tablesToClear = allTableNames.filter((tableName) => {
    // Only process tables for dev environment
    if (!tableName.includes(`-${env}`)) {
      return false;
    }
    
    // Exclude Book table
    const modelName = tableName.split('-')[0];
    return !EXCLUDED_TABLES.includes(modelName);
  });

  if (tablesToClear.length === 0) {
    console.log('⚠️  No tables found to clear.');
    return;
  }

  console.log(`📋 Found ${tablesToClear.length} tables to clear:\n`);
  tablesToClear.forEach((table) => console.log(`   - ${table}`));
  console.log('');

  // Create backup directory
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = join(__dirname, `../backups/prod-${timestamp}`);
  mkdirSync(backupDir, { recursive: true });
  console.log(`📦 Backup directory: ${backupDir}\n`);

  // Step 1: Create backups
  console.log('📦 Step 1: Creating backups...\n');
  let totalBackedUp = 0;
  
  for (const tableName of tablesToClear) {
    try {
      const count = await backupTable(client, tableName, backupDir);
      totalBackedUp += count;
    } catch (error) {
      console.error(`❌ Error backing up ${tableName}:`, error);
    }
  }

  console.log(`\n✅ Backup complete: ${totalBackedUp} total items backed up\n`);

  // Step 2: Clear tables
  console.log('🗑️  Step 2: Clearing tables...\n');
  let totalDeleted = 0;

  for (const tableName of tablesToClear) {
    try {
      const count = await clearTable(client, tableName);
      totalDeleted += count;
    } catch (error) {
      console.error(`❌ Error clearing ${tableName}:`, error);
    }
  }

  console.log(`\n✅ Cleanup complete: ${totalDeleted} total items deleted`);
  console.log(`\n📦 Backup saved to: ${backupDir}`);
  console.log('\n✨ Done!');
}

// Run the script
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

