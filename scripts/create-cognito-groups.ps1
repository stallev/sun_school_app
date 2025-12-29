# Script to create Cognito User Pool Groups
# Usage: .\scripts\create-cognito-groups.ps1 -UserPoolId <USER_POOL_ID> -Region <REGION>
# Example: .\scripts\create-cognito-groups.ps1 -UserPoolId us-east-1_FORzY4ey4 -Region us-east-1

param(
    [Parameter(Mandatory=$true)]
    [string]$UserPoolId,
    
    [Parameter(Mandatory=$true)]
    [string]$Region
)

$ErrorActionPreference = "Stop"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Creating Cognito Groups" -ForegroundColor Cyan
Write-Host "User Pool ID: $UserPoolId" -ForegroundColor Cyan
Write-Host "Region: $Region" -ForegroundColor Cyan
Write-Host "Date: $(Get-Date)" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Function to create group (idempotent)
function Create-Group {
    param(
        [string]$GroupName,
        [string]$Description,
        [int]$Precedence
    )
    
    Write-Host "Creating group: $GroupName..." -ForegroundColor Yellow
    
    # Check if group already exists
    $null = aws cognito-idp get-group `
        --user-pool-id $UserPoolId `
        --group-name $GroupName `
        --region $Region `
        2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Group '$GroupName' already exists, skipping..." -ForegroundColor Green
        return
    }
    
    # Create group
    aws cognito-idp create-group `
        --user-pool-id $UserPoolId `
        --group-name $GroupName `
        --description $Description `
        --precedence $Precedence `
        --region $Region
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Group '$GroupName' created successfully" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Failed to create group '$GroupName'" -ForegroundColor Red
        exit 1
    }
    Write-Host ""
}

# Create TEACHER group
Create-Group -GroupName "TEACHER" -Description "Sunday School Teachers" -Precedence 1

# Create ADMIN group
Create-Group -GroupName "ADMIN" -Description "Sunday School Administrators" -Precedence 2

# Create SUPERADMIN group
Create-Group -GroupName "SUPERADMIN" -Description "Sunday School Super Administrators" -Precedence 3

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "All groups created successfully!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
