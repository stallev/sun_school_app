#!/bin/bash

# Скрипт для проверки дублирующих AWS ресурсов
# Использование: ./scripts/check-duplicate-resources.sh [REGION]
# По умолчанию: eu-west-1

REGION="${1:-eu-west-1}"

echo "=========================================="
echo "Checking for duplicate AWS resources"
echo "Region: $REGION"
echo "Date: $(date)"
echo "=========================================="
echo ""

# Проверка AppSync APIs
echo "📡 AppSync APIs:"
echo "----------------------------------------"
APIS=$(aws appsync list-graphql-apis --region $REGION --query "graphqlApis[*].{Name:name,ApiId:apiId}" --output json 2>/dev/null)
if [ $? -eq 0 ]; then
  echo "$APIS" | jq -r '.[] | "  - \(.Name) (ID: \(.ApiId))"'
  MASTER_APIS=$(echo "$APIS" | jq -r '.[] | select(.Name | contains("master")) | .Name')
  if [ ! -z "$MASTER_APIS" ]; then
    echo ""
    echo "⚠️  WARNING: Found AppSync APIs with 'master' in name:"
    echo "$MASTER_APIS" | while read api; do
      echo "    - $api"
    done
  fi
else
  echo "  ❌ Error checking AppSync APIs"
fi
echo ""

# Проверка Cognito User Pools
echo "👥 Cognito User Pools:"
echo "----------------------------------------"
POOLS=$(aws cognito-idp list-user-pools --max-results 10 --region $REGION --query "UserPools[*].{Name:Name,Id:Id}" --output json 2>/dev/null)
if [ $? -eq 0 ]; then
  echo "$POOLS" | jq -r '.[] | "  - \(.Name) (ID: \(.Id))"'
  MASTER_POOLS=$(echo "$POOLS" | jq -r '.[] | select(.Name | contains("master")) | .Name')
  if [ ! -z "$MASTER_POOLS" ]; then
    echo ""
    echo "⚠️  WARNING: Found Cognito User Pools with 'master' in name:"
    echo "$MASTER_POOLS" | while read pool; do
      echo "    - $pool"
    done
  fi
else
  echo "  ❌ Error checking Cognito User Pools"
fi
echo ""

# Проверка DynamoDB таблиц
echo "🗄️  DynamoDB Tables:"
echo "----------------------------------------"
TABLES=$(aws dynamodb list-tables --region $REGION --query "TableNames[]" --output json 2>/dev/null)
if [ $? -eq 0 ]; then
  TABLE_COUNT=$(echo "$TABLES" | jq 'length')
  echo "  Total tables: $TABLE_COUNT"
  echo "$TABLES" | jq -r '.[]' | while read table; do
    echo "  - $table"
  done
  MASTER_TABLES=$(echo "$TABLES" | jq -r '.[] | select(contains("master"))')
  if [ ! -z "$MASTER_TABLES" ]; then
    echo ""
    echo "⚠️  WARNING: Found DynamoDB tables with 'master' in name:"
    echo "$MASTER_TABLES" | while read table; do
      echo "    - $table"
    done
  fi
else
  echo "  ❌ Error checking DynamoDB tables"
fi
echo ""

# Проверка CloudFormation стеков
echo "☁️  CloudFormation Stacks:"
echo "----------------------------------------"
STACKS=$(aws cloudformation list-stacks --region $REGION --stack-status-filter CREATE_COMPLETE UPDATE_COMPLETE --query "StackSummaries[*].{Name:StackName,Status:StackStatus}" --output json 2>/dev/null)
if [ $? -eq 0 ]; then
  STACK_COUNT=$(echo "$STACKS" | jq 'length')
  echo "  Total stacks: $STACK_COUNT"
  echo "$STACKS" | jq -r '.[] | "  - \(.Name) (\(.Status))"'
  MASTER_STACKS=$(echo "$STACKS" | jq -r '.[] | select(.Name | contains("master")) | .Name')
  if [ ! -z "$MASTER_STACKS" ]; then
    echo ""
    echo "⚠️  WARNING: Found CloudFormation stacks with 'master' in name:"
    echo "$MASTER_STACKS" | while read stack; do
      echo "    - $stack"
    done
  fi
else
  echo "  ❌ Error checking CloudFormation stacks"
fi
echo ""

# Итоговый отчет
echo "=========================================="
echo "Summary:"
echo "----------------------------------------"

HAS_ISSUES=0

if [ ! -z "$MASTER_APIS" ]; then
  echo "⚠️  Found AppSync APIs with 'master' in name"
  HAS_ISSUES=1
fi

if [ ! -z "$MASTER_POOLS" ]; then
  echo "⚠️  Found Cognito User Pools with 'master' in name"
  HAS_ISSUES=1
fi

if [ ! -z "$MASTER_TABLES" ]; then
  echo "⚠️  Found DynamoDB tables with 'master' in name"
  HAS_ISSUES=1
fi

if [ ! -z "$MASTER_STACKS" ]; then
  echo "⚠️  Found CloudFormation stacks with 'master' in name"
  HAS_ISSUES=1
fi

if [ $HAS_ISSUES -eq 0 ]; then
  echo "✅ No duplicate resources found"
  exit 0
else
  echo ""
  echo "❌ Duplicate resources detected! Please review and remove them."
  echo "See docs/infrastructure/DUPLICATE_RESOURCES_INCIDENT.md for details."
  exit 1
fi

