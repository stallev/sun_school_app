/**
 * Script to check for duplicates in all junction tables
 * Reports duplicates but does not delete them (use fix scripts for that)
 * 
 * Usage:
 *   AWS_BRANCH=prod npx tsx scripts/check-duplicates-in-junction-tables.ts
 *   or
 *   $env:AWS_BRANCH="prod"; npx tsx scripts/check-duplicates-in-junction-tables.ts
 */

import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { defaultProvider as credentialsProvider } from '@aws-sdk/credential-provider-node';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load Amplify configuration
const amplifyConfigPath = join(__dirname, '../src/amplifyconfiguration.json');
const amplifyConfig = JSON.parse(readFileSync(amplifyConfigPath, 'utf-8'));
const AWS_REGION = amplifyConfig.aws_project_region || 'us-east-1';

interface JunctionTableConfig {
  tableName: string;
  keyFields: string[]; // Fields that should be unique together
}

const junctionTables: JunctionTableConfig[] = [
  {
    tableName: 'UserGrade',
    keyFields: ['userId', 'gradeId'],
  },
  {
    tableName: 'UserFamily',
    keyFields: ['userId', 'familyId'],
  },
  {
    tableName: 'FamilyMember',
    keyFields: ['familyId', 'pupilId'],
  },
  {
    tableName: 'LessonGoldenVerse',
    keyFields: ['lessonId', 'goldenVerseId', 'order'],
  },
  {
    tableName: 'PupilAchievement',
    keyFields: ['pupilId', 'achievementId'],
  },
];

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
    const env = process.env.AWS_BRANCH || 'prod';

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
    const { ListTablesCommand } = await import('@aws-sdk/client-dynamodb');
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

  throw new Error(`Could not determine table name for ${modelName}`);
}

async function checkDuplicatesInTable(
  client: DynamoDBClient,
  config: JunctionTableConfig
): Promise<{ duplicates: number; totalRecords: number; duplicateGroups: Array<{ key: string; count: number }> }> {
  const tableName = await getTableName(client, config.tableName);
  
  // Scan all records (handle pagination if needed)
  const allItems: Array<Record<string, unknown>> = [];
  let lastEvaluatedKey: Record<string, unknown> | undefined = undefined;
  
  do {
    const scanCommand = new ScanCommand({ 
      TableName: tableName,
      ExclusiveStartKey: lastEvaluatedKey ? lastEvaluatedKey as never : undefined,
    });
    const result = await client.send(scanCommand);
    const items = (result.Items || []).map(item => unmarshall(item));
    allItems.push(...items);
    lastEvaluatedKey = result.LastEvaluatedKey ? unmarshall(result.LastEvaluatedKey) as Record<string, unknown> : undefined;
  } while (lastEvaluatedKey);
  
  // Group by key fields combination
  const groups = new Map<string, typeof allItems>();
  
  for (const item of allItems) {
    const key = config.keyFields.map(field => item[field]).join('#');
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(item);
  }
  
  // Count duplicates and collect duplicate groups
  let duplicates = 0;
  const duplicateGroups: Array<{ key: string; count: number }> = [];
  
  groups.forEach((group, key) => {
    if (group.length > 1) {
      duplicates += group.length - 1;
      duplicateGroups.push({ key, count: group.length });
    }
  });
  
  return { duplicates, totalRecords: allItems.length, duplicateGroups };
}

async function main() {
  const client = new DynamoDBClient({
    region: AWS_REGION,
    credentials: credentialsProvider(),
  });
  
  console.log('🔍 Checking all junction tables for duplicates...\n');
  
  for (const config of junctionTables) {
    try {
      const { duplicates, totalRecords, duplicateGroups } = await checkDuplicatesInTable(client, config);
      
      if (duplicates > 0) {
        console.log(`⚠️  ${config.tableName}: ${duplicates} duplicates found (${totalRecords} total records)`);
        if (duplicateGroups.length > 0 && duplicateGroups.length <= 10) {
          console.log(`   Duplicate groups:`);
          duplicateGroups.forEach(({ key, count }) => {
            console.log(`     - ${key}: ${count} records`);
          });
        } else if (duplicateGroups.length > 10) {
          console.log(`   (showing first 10 of ${duplicateGroups.length} duplicate groups)`);
          duplicateGroups.slice(0, 10).forEach(({ key, count }) => {
            console.log(`     - ${key}: ${count} records`);
          });
        }
      } else {
        console.log(`✅ ${config.tableName}: No duplicates (${totalRecords} total records)`);
      }
    } catch (error) {
      console.error(`❌ Error checking ${config.tableName}:`, error instanceof Error ? error.message : error);
    }
  }
  
  console.log('\n✅ Check completed');
}

main().catch(console.error);

