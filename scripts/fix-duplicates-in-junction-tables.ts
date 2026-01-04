/**
 * Script to find and remove duplicates in all junction tables
 * Duplicates are defined by unique key combinations for each table
 * Keeps the oldest record (by createdAt) and deletes the rest
 * 
 * Usage:
 *   AWS_BRANCH=prod npx tsx scripts/fix-duplicates-in-junction-tables.ts
 *   or
 *   $env:AWS_BRANCH="prod"; npx tsx scripts/fix-duplicates-in-junction-tables.ts
 */

import { DynamoDBClient, ScanCommand, DeleteItemCommand } from '@aws-sdk/client-dynamodb';
import { defaultProvider as credentialsProvider } from '@aws-sdk/credential-provider-node';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
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

async function findAndRemoveDuplicates(
  client: DynamoDBClient,
  config: JunctionTableConfig
): Promise<{ duplicatesFound: number; duplicatesRemoved: number }> {
  const tableName = await getTableName(client, config.tableName);
  
  // Scan all records (handle pagination)
  const allItems: Array<Record<string, unknown>> = [];
  let lastEvaluatedKey: Record<string, unknown> | undefined = undefined;
  
  do {
    const scanCommand: ScanCommand = new ScanCommand({
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
  
  // Find duplicates and remove them
  let duplicatesFound = 0;
  let duplicatesRemoved = 0;
  
  for (const [key, group] of Array.from(groups.entries())) {
    if (group.length > 1) {
      duplicatesFound += group.length - 1;
      
      // Sort by createdAt (oldest first)
      group.sort((a, b) => {
        const aDate = a.createdAt ? new Date(a.createdAt as string).getTime() : 0;
        const bDate = b.createdAt ? new Date(b.createdAt as string).getTime() : 0;
        return aDate - bDate;
      });
      
      // Keep the oldest, delete the rest
      const toKeep = group[0];
      const toDelete = group.slice(1);
      
      console.log(`Found ${group.length} duplicates for ${key}:`);
      console.log(`  Keeping: ${toKeep.id} (created: ${toKeep.createdAt || 'unknown'})`);
      
      for (const item of toDelete) {
        console.log(`  Deleting: ${item.id} (created: ${item.createdAt || 'unknown'})`);
        
        const deleteCommand = new DeleteItemCommand({
          TableName: tableName,
          Key: marshall({ id: item.id }),
        });
        
        await client.send(deleteCommand);
        duplicatesRemoved++;
        
        // Small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    }
  }
  
  return { duplicatesFound, duplicatesRemoved };
}

// Main execution
async function main() {
  const client = new DynamoDBClient({
    region: AWS_REGION,
    credentials: credentialsProvider(),
  });
  
  console.log('🔍 Scanning junction tables for duplicates...\n');
  
  for (const config of junctionTables) {
    try {
      console.log(`\n📋 Processing ${config.tableName}...`);
      const { duplicatesFound, duplicatesRemoved } = await findAndRemoveDuplicates(client, config);
      
      if (duplicatesRemoved > 0) {
        console.log(`✅ ${config.tableName}: Removed ${duplicatesRemoved} duplicates (${duplicatesFound} found)`);
      } else {
        console.log(`✅ ${config.tableName}: No duplicates found`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${config.tableName}:`, error instanceof Error ? error.message : error);
    }
  }
  
  console.log('\n✅ Duplicate removal completed for all junction tables');
}

main().catch(console.error);

