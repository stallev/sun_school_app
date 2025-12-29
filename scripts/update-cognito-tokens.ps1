# Script to update Cognito User Pool Client Token Settings
# Usage: .\scripts\update-cognito-tokens.ps1 -UserPoolId <USER_POOL_ID> -ClientId <CLIENT_ID> -Region <REGION>
# Example: .\scripts\update-cognito-tokens.ps1 -UserPoolId us-east-1_FORzY4ey4 -ClientId 5hq66dq341pt5peavra3bqpd7b -Region us-east-1

param(
    [Parameter(Mandatory=$true)]
    [string]$UserPoolId,
    
    [Parameter(Mandatory=$true)]
    [string]$ClientId,
    
    [Parameter(Mandatory=$true)]
    [string]$Region
)

$ErrorActionPreference = "Continue"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Updating Cognito Token Settings" -ForegroundColor Cyan
Write-Host "User Pool ID: $UserPoolId" -ForegroundColor Cyan
Write-Host "Client ID: $ClientId" -ForegroundColor Cyan
Write-Host "Region: $Region" -ForegroundColor Cyan
Write-Host "Date: $(Get-Date)" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Token expiration settings
$IdTokenValidity = 24        # 1 day in hours
$AccessTokenValidity = 24     # 1 day in hours
$RefreshTokenValidity = 30    # 30 days

Write-Host "Target token expiration settings:" -ForegroundColor Yellow
Write-Host "  ID Token: $IdTokenValidity hours (1 day)" -ForegroundColor Yellow
Write-Host "  Access Token: $AccessTokenValidity hours (1 day)" -ForegroundColor Yellow
Write-Host "  Refresh Token: $RefreshTokenValidity days" -ForegroundColor Yellow
Write-Host ""

# Update token settings
Write-Host "Updating token settings..." -ForegroundColor Yellow

aws cognito-idp update-user-pool-client `
    --user-pool-id $UserPoolId `
    --client-id $ClientId `
    --id-token-validity $IdTokenValidity `
    --access-token-validity $AccessTokenValidity `
    --refresh-token-validity $RefreshTokenValidity `
    --token-validity-units IdToken=hours,AccessToken=hours,RefreshToken=days `
    --region $Region `
    --output json | Out-Null

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Token settings updated successfully" -ForegroundColor Green
    Write-Host ""
    
    # Verify update
    Write-Host "Verifying updated settings..." -ForegroundColor Yellow
    $updatedConfigJson = aws cognito-idp describe-user-pool-client `
        --user-pool-id $UserPoolId `
        --client-id $ClientId `
        --region $Region `
        --output json
    
    if ($LASTEXITCODE -eq 0) {
        $updatedConfig = $updatedConfigJson | ConvertFrom-Json
        
        $updatedIdToken = $updatedConfig.UserPoolClient.IdTokenValidity
        $updatedAccessToken = $updatedConfig.UserPoolClient.AccessTokenValidity
        $updatedRefreshToken = $updatedConfig.UserPoolClient.RefreshTokenValidity
        $updatedUnits = $updatedConfig.UserPoolClient.TokenValidityUnits
        
        Write-Host "Updated settings:" -ForegroundColor Green
        Write-Host "  ID Token: $updatedIdToken $($updatedUnits.IdToken)" -ForegroundColor Green
        Write-Host "  Access Token: $updatedAccessToken $($updatedUnits.AccessToken)" -ForegroundColor Green
        Write-Host "  Refresh Token: $updatedRefreshToken $($updatedUnits.RefreshToken)" -ForegroundColor Green
    }
} else {
    Write-Host "✗ Failed to update token settings" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Token settings update completed!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
