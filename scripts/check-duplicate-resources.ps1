# Скрипт для проверки дублирующих AWS ресурсов (PowerShell)
# Использование: .\scripts\check-duplicate-resources.ps1 [REGION]
# По умолчанию: eu-west-1

param(
    [string]$Region = "eu-west-1"
)

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Checking for duplicate AWS resources" -ForegroundColor Cyan
Write-Host "Region: $Region" -ForegroundColor Cyan
Write-Host "Date: $(Get-Date)" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

$HasIssues = $false

# Проверка AppSync APIs
Write-Host "📡 AppSync APIs:" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
try {
    $apis = aws appsync list-graphql-apis --region $Region --query "graphqlApis[*].{Name:name,ApiId:apiId}" --output json | ConvertFrom-Json
    foreach ($api in $apis) {
        Write-Host "  - $($api.Name) (ID: $($api.ApiId))" -ForegroundColor White
        if ($api.Name -like "*master*") {
            Write-Host "    ⚠️  WARNING: Found AppSync API with 'master' in name" -ForegroundColor Red
            $HasIssues = $true
        }
    }
} catch {
    Write-Host "  ❌ Error checking AppSync APIs" -ForegroundColor Red
}
Write-Host ""

# Проверка Cognito User Pools
Write-Host "👥 Cognito User Pools:" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
try {
    $pools = aws cognito-idp list-user-pools --max-results 10 --region $Region --query "UserPools[*].{Name:Name,Id:Id}" --output json | ConvertFrom-Json
    foreach ($pool in $pools) {
        Write-Host "  - $($pool.Name) (ID: $($pool.Id))" -ForegroundColor White
        if ($pool.Name -like "*master*") {
            Write-Host "    ⚠️  WARNING: Found Cognito User Pool with 'master' in name" -ForegroundColor Red
            $HasIssues = $true
        }
    }
} catch {
    Write-Host "  ❌ Error checking Cognito User Pools" -ForegroundColor Red
}
Write-Host ""

# Проверка DynamoDB таблиц
Write-Host "🗄️  DynamoDB Tables:" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
try {
    $tables = aws dynamodb list-tables --region $Region --query "TableNames[]" --output json | ConvertFrom-Json
    Write-Host "  Total tables: $($tables.Count)" -ForegroundColor White
    foreach ($table in $tables) {
        Write-Host "  - $table" -ForegroundColor White
        if ($table -like "*master*") {
            Write-Host "    ⚠️  WARNING: Found DynamoDB table with 'master' in name" -ForegroundColor Red
            $HasIssues = $true
        }
    }
} catch {
    Write-Host "  ❌ Error checking DynamoDB tables" -ForegroundColor Red
}
Write-Host ""

# Проверка CloudFormation стеков
Write-Host "☁️  CloudFormation Stacks:" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
try {
    $stacks = aws cloudformation list-stacks --region $Region --stack-status-filter CREATE_COMPLETE UPDATE_COMPLETE --query "StackSummaries[*].{Name:StackName,Status:StackStatus}" --output json | ConvertFrom-Json
    Write-Host "  Total stacks: $($stacks.Count)" -ForegroundColor White
    foreach ($stack in $stacks) {
        Write-Host "  - $($stack.Name) ($($stack.Status))" -ForegroundColor White
        if ($stack.Name -like "*master*") {
            Write-Host "    ⚠️  WARNING: Found CloudFormation stack with 'master' in name" -ForegroundColor Red
            $HasIssues = $true
        }
    }
} catch {
    Write-Host "  ❌ Error checking CloudFormation stacks" -ForegroundColor Red
}
Write-Host ""

# Итоговый отчет
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Gray

if ($HasIssues) {
    Write-Host "❌ Duplicate resources detected! Please review and remove them." -ForegroundColor Red
    Write-Host "See docs/infrastructure/DUPLICATE_RESOURCES_INCIDENT.md for details." -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "✅ No duplicate resources found" -ForegroundColor Green
    exit 0
}

