/**
 * Script to find and remove duplicate UserGrade records
 * Duplicates are defined as multiple records with the same userId and gradeId
 * Keeps the oldest record (by createdAt) and deletes the rest
 * 
 * Usage:
 *   AWS_BRANCH=prod npx tsx scripts/fix-duplicate-usergrades.ts
 *   or
 *   $env:AWS_BRANCH="prod"; npx tsx scripts/fix-duplicate-usergrades.ts
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

async function findAndRemoveDuplicates(client: DynamoDBClient): Promise<void> {
  const tableName = await getTableName(client, 'UserGrade');
  
  // Scan all UserGrade records (handle pagination)
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
  
  // Group by userId + gradeId combination
  const groups = new Map<string, typeof allItems>();
  
  for (const item of allItems) {
    const key = `${item.userId}#${item.gradeId}`;
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
  
  console.log(`\nSummary:`);
  console.log(`  Duplicate records found: ${duplicatesFound}`);
  console.log(`  Duplicate records removed: ${duplicatesRemoved}`);
}

// Main execution
async function main() {
  const client = new DynamoDBClient({
    region: AWS_REGION,
    credentials: credentialsProvider(),
  });
  
  console.log('🔍 Scanning UserGrade table for duplicates...\n');
  await findAndRemoveDuplicates(client);
  console.log('\n✅ Duplicate removal completed');
}

main().catch(console.error);

