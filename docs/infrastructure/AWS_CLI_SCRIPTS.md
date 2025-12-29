# AWS CLI Scripts - Sunday School App

## Document Version: 1.1
**Creation Date:** 29 December 2025  
**Last Update:** 30 December 2025  
**Project:** Sunday School App  
**Technologies:** AWS CLI, AWS Cognito, AWS AppSync, Bash, PowerShell

---

## 1. Overview

This document provides instructions for configuring infrastructure through AWS CLI scripts when AWS Amplify Gen 1 CLI does not support the required settings through configuration files.

### 1.1. Purpose

**When to use AWS CLI scripts:**

- ✅ **Cognito Groups:** Amplify Gen 1 CLI does not support creating groups through `cli-inputs.json`
- ✅ **Token Expiration:** Limited support for ID/Access token expiration configuration
- ✅ **Advanced IAM Policies:** Complex IAM role configurations not supported by Amplify CLI
- ✅ **Custom CloudFormation Resources:** Resources that require manual AWS CLI configuration

**When NOT to use AWS CLI scripts:**

- ❌ Settings that can be configured through `amplify/backend/*/cli-inputs.json`
- ❌ Settings that can be configured through `amplify/backend/backend-config.json`
- ❌ Settings that can be configured through CloudFormation templates

**See [INFRASTRUCTURE_AS_CODE.md](./INFRASTRUCTURE_AS_CODE.md) for Infrastructure as Code principles.**

---

## 2. Principles

### 2.1. Version Control

**All scripts MUST be stored in Git:**

- Scripts are stored in `scripts/` directory
- Scripts are version controlled with code
- Scripts are documented in this file
- Scripts follow naming convention: `{purpose}-{resource}.{sh|ps1}`

### 2.2. Idempotency

**Scripts should be idempotent:**

- Scripts can be run multiple times safely
- Scripts check if resources exist before creating
- Scripts handle errors gracefully (e.g., "Resource already exists")
- Scripts provide clear output about what was done

### 2.3. Documentation

**All scripts MUST be documented:**

- Purpose and usage in this document
- Parameters and their meaning
- Expected output
- Error handling
- Verification commands

### 2.4. Environment Parity

**Scripts must work for both dev and prod:**

- Scripts accept environment parameters (User Pool ID, Region)
- Scripts are tested in dev before applying to prod
- Scripts produce identical results in both environments (except environment-specific values)

---

## 3. Scripts Location

**All AWS CLI scripts are stored in `scripts/` directory:**

```
scripts/
├── create-cognito-groups.sh      # Bash script for Linux/Mac
├── create-cognito-groups.ps1    # PowerShell script for Windows
├── update-cognito-tokens.sh      # Bash script for token settings (Linux/Mac)
├── update-cognito-tokens.ps1    # PowerShell script for token settings (Windows)
├── check-duplicate-resources.sh  # Monitoring script (existing)
└── check-duplicate-resources.ps1 # Monitoring script (existing)
```

**Script naming convention:**

- `{action}-{resource}.{sh|ps1}`
- Examples: `create-cognito-groups.sh`, `update-iam-roles.ps1`

---

## 4. Cognito Groups Configuration

### 4.1. Challenge

**Amplify Gen 1 CLI does not support creating Cognito Groups directly through `cli-inputs.json`.**

Groups must be created using AWS CLI after the User Pool is deployed.

### 4.2. Required Groups

**Three groups are required for RBAC:**

1. **TEACHER** (precedence: 1)
   - Description: "Преподаватели воскресной школы"
   - Purpose: Teachers can manage their own grade's lessons and homework

2. **ADMIN** (precedence: 2)
   - Description: "Администраторы воскресной школы"
   - Purpose: Admins can manage all grades, teachers, and pupils

3. **SUPERADMIN** (precedence: 3)
   - Description: "Главные администраторы"
   - Purpose: Superadmins have full access to all resources

**Precedence order:** SUPERADMIN (3) > ADMIN (2) > TEACHER (1)

**See [SECURITY.md](./SECURITY.md) section 3.1 for RBAC details.**

### 4.3. Bash Script

**File:** `scripts/create-cognito-groups.sh`

```bash
#!/bin/bash

# Script to create Cognito User Pool Groups
# Usage: ./scripts/create-cognito-groups.sh <USER_POOL_ID> <REGION>
# Example: ./scripts/create-cognito-groups.sh us-east-1_FORzY4ey4 us-east-1

set -e  # Exit on error

USER_POOL_ID=$1
REGION=$2

# Validate parameters
if [ -z "$USER_POOL_ID" ] || [ -z "$REGION" ]; then
  echo "Error: USER_POOL_ID and REGION are required"
  echo "Usage: ./scripts/create-cognito-groups.sh <USER_POOL_ID> <REGION>"
  exit 1
fi

echo "=========================================="
echo "Creating Cognito Groups"
echo "User Pool ID: $USER_POOL_ID"
echo "Region: $REGION"
echo "Date: $(date)"
echo "=========================================="
echo ""

# Function to create group (idempotent)
create_group() {
  local group_name=$1
  local description=$2
  local precedence=$3

  echo "Creating group: $group_name..."
  
  # Check if group already exists
  if aws cognito-idp get-group \
    --user-pool-id "$USER_POOL_ID" \
    --group-name "$group_name" \
    --region "$REGION" \
    >/dev/null 2>&1; then
    echo "  ✓ Group '$group_name' already exists, skipping..."
  else
    aws cognito-idp create-group \
      --user-pool-id "$USER_POOL_ID" \
      --group-name "$group_name" \
      --description "$description" \
      --precedence "$precedence" \
      --region "$REGION"
    
    if [ $? -eq 0 ]; then
      echo "  ✓ Group '$group_name' created successfully"
    else
      echo "  ✗ Failed to create group '$group_name'"
      exit 1
    fi
  fi
  echo ""
}

# Create TEACHER group
create_group "TEACHER" "Преподаватели воскресной школы" 1

# Create ADMIN group
create_group "ADMIN" "Администраторы воскресной школы" 2

# Create SUPERADMIN group
create_group "SUPERADMIN" "Главные администраторы" 3

echo "=========================================="
echo "All groups created successfully!"
echo "=========================================="
```

**Make script executable:**

```bash
chmod +x scripts/create-cognito-groups.sh
```

### 4.4. PowerShell Script

**File:** `scripts/create-cognito-groups.ps1`

```powershell
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
    try {
        $existingGroup = aws cognito-idp get-group `
            --user-pool-id $UserPoolId `
            --group-name $GroupName `
            --region $Region `
            2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✓ Group '$GroupName' already exists, skipping..." -ForegroundColor Green
            return
        }
    } catch {
        # Group doesn't exist, continue with creation
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
Create-Group -GroupName "TEACHER" -Description "Преподаватели воскресной школы" -Precedence 1

# Create ADMIN group
Create-Group -GroupName "ADMIN" -Description "Администраторы воскресной школы" -Precedence 2

# Create SUPERADMIN group
Create-Group -GroupName "SUPERADMIN" -Description "Главные администраторы" -Precedence 3

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "All groups created successfully!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
```

### 4.5. Getting User Pool ID

**Method 1: From amplifyconfiguration.json (for dev)**

```bash
# Linux/Mac
cat src/amplifyconfiguration.json | grep -A 5 "CognitoUserPool" | grep "PoolId" | cut -d'"' -f4

# Windows PowerShell
(Get-Content src/amplifyconfiguration.json | ConvertFrom-Json).auth.plugins.awsCognitoAuthPlugin.CognitoUserPool.Default.PoolId
```

**Method 2: From CloudFormation stack outputs**

```bash
# Dev environment
aws cloudformation describe-stacks \
  --stack-name amplify-sunsch-dev-f567d \
  --region us-east-1 \
  --query "Stacks[0].Outputs[?OutputKey=='UserPoolId'].OutputValue" \
  --output text

# Prod environment
aws cloudformation describe-stacks \
  --stack-name amplify-sunsch-prod-e50ea \
  --region eu-west-1 \
  --query "Stacks[0].Outputs[?OutputKey=='UserPoolId'].OutputValue" \
  --output text
```

**Method 3: From AWS CLI list command**

```bash
# Dev environment
aws cognito-idp list-user-pools --max-results 10 --region us-east-1 \
  --query "UserPools[?contains(Name, 'sunsche716d941')].{Id:Id,Name:Name}" \
  --output table

# Prod environment
aws cognito-idp list-user-pools --max-results 10 --region eu-west-1 \
  --query "UserPools[?contains(Name, 'sunsche716d941')].{Id:Id,Name:Name}" \
  --output table
```

### 4.6. Execution Instructions

**Step 1: Verify AWS credentials**

```bash
aws sts get-caller-identity
```

**Step 2: Switch to correct Amplify environment**

```bash
# For dev
amplify env checkout dev

# For prod
amplify env checkout prod
```

**Step 3: Get User Pool ID (use one of the methods from section 4.5)**

**Step 4: Execute script**

**Linux/Mac:**
```bash
# Dev environment
./scripts/create-cognito-groups.sh us-east-1_FORzY4ey4 us-east-1

# Prod environment
./scripts/create-cognito-groups.sh eu-west-1_iQ7XIxudA eu-west-1
```

**Windows PowerShell:**
```powershell
# Dev environment
.\scripts\create-cognito-groups.ps1 -UserPoolId us-east-1_FORzY4ey4 -Region us-east-1

# Prod environment
.\scripts\create-cognito-groups.ps1 -UserPoolId eu-west-1_iQ7XIxudA -Region eu-west-1
```

**Important:** Always execute scripts for dev environment first, verify results, then execute for prod.

### 4.7. Verification

**List all groups:**

```bash
aws cognito-idp list-groups \
  --user-pool-id <USER_POOL_ID> \
  --region <REGION> \
  --output table
```

**Get specific group details:**

```bash
aws cognito-idp get-group \
  --user-pool-id <USER_POOL_ID> \
  --group-name TEACHER \
  --region <REGION>
```

**Expected output:**

```
GroupName    Precedence  Description
----------   ----------  -------------------------------------------
TEACHER      1           Преподаватели воскресной школы
ADMIN        2           Администраторы воскресной школы
SUPERADMIN   3           Главные администраторы
```

### 4.8. Troubleshooting

**Error: "Group already exists"**

- **Cause:** Group was already created
- **Solution:** Script handles this automatically (idempotent). This is not an error.

**Error: "User Pool not found"**

- **Cause:** Incorrect User Pool ID or Region
- **Solution:** Verify User Pool ID using methods from section 4.5

**Error: "Access Denied"**

- **Cause:** AWS credentials don't have permissions
- **Solution:** Ensure IAM user/role has `cognito-idp:CreateGroup` and `cognito-idp:GetGroup` permissions

**Error: "Invalid parameter: Precedence"**

- **Cause:** Precedence value is invalid (must be positive integer)
- **Solution:** Verify precedence values in script (1, 2, 3)

---

## 5. Cognito Token Settings Configuration

### 5.1. Challenge

**Amplify Gen 1 CLI has limited support for token expiration configuration:**

- ✅ **Refresh Token expiration:** Supported in `cli-inputs.json` via `userpoolClientRefreshTokenValidity`
- ❌ **ID Token expiration:** Not directly supported (uses default: 1 hour)
- ❌ **Access Token expiration:** Not directly supported (uses default: 1 hour)

**Token expiration must be configured using AWS CLI after User Pool Client is deployed.**

### 5.2. Required Token Settings

**Token expiration configuration:**

1. **ID Token:** 24 hours (1 day)
   - Purpose: Contains user identity (userId, email, name, cognito:groups)
   - Used for: User identification in AppSync requests

2. **Access Token:** 24 hours (1 day)
   - Purpose: Used for authorization (includes cognito:groups claim)
   - Used for: Access to AWS resources

3. **Refresh Token:** 30 days
   - Purpose: Used to obtain new ID/Access tokens
   - Already configured in `cli-inputs.json` via `userpoolClientRefreshTokenValidity: 30`

**See [SECURITY.md](./SECURITY.md) section 2.3 JWT Tokens for requirements.**

### 5.3. Bash Script

**File:** `scripts/update-cognito-tokens.sh`

```bash
#!/bin/bash

# Script to update Cognito User Pool Client Token Settings
# Usage: ./scripts/update-cognito-tokens.sh <USER_POOL_ID> <CLIENT_ID> <REGION>
# Example: ./scripts/update-cognito-tokens.sh us-east-1_FORzY4ey4 5hq66dq341pt5peavra3bqpd7b us-east-1

set -e  # Exit on error

USER_POOL_ID=$1
CLIENT_ID=$2
REGION=$3

# Token expiration settings
ID_TOKEN_VALIDITY=24        # 1 day in hours
ACCESS_TOKEN_VALIDITY=24    # 1 day in hours
REFRESH_TOKEN_VALIDITY=30   # 30 days

# Update token settings
aws cognito-idp update-user-pool-client \
  --user-pool-id "$USER_POOL_ID" \
  --client-id "$CLIENT_ID" \
  --id-token-validity "$ID_TOKEN_VALIDITY" \
  --access-token-validity "$ACCESS_TOKEN_VALIDITY" \
  --refresh-token-validity "$REFRESH_TOKEN_VALIDITY" \
  --token-validity-units IdToken=hours,AccessToken=hours,RefreshToken=days \
  --region "$REGION"
```

**Make script executable:**

```bash
chmod +x scripts/update-cognito-tokens.sh
```

### 5.4. PowerShell Script

**File:** `scripts/update-cognito-tokens.ps1`

```powershell
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

# Token expiration settings
$IdTokenValidity = 24        # 1 day in hours
$AccessTokenValidity = 24     # 1 day in hours
$RefreshTokenValidity = 30    # 30 days

# Update token settings
aws cognito-idp update-user-pool-client `
    --user-pool-id $UserPoolId `
    --client-id $ClientId `
    --id-token-validity $IdTokenValidity `
    --access-token-validity $AccessTokenValidity `
    --refresh-token-validity $RefreshTokenValidity `
    --token-validity-units IdToken=hours,AccessToken=hours,RefreshToken=days `
    --region $Region
```

### 5.5. Getting Client ID

**Method 1: From AWS CLI list command**

```bash
# Dev environment
aws cognito-idp list-user-pool-clients \
  --user-pool-id us-east-1_FORzY4ey4 \
  --region us-east-1 \
  --query "UserPoolClients[?ClientName=='sunsche716d941_app_clientWeb'].ClientId" \
  --output text

# Prod environment
aws cognito-idp list-user-pool-clients \
  --user-pool-id eu-west-1_iQ7XIxudA \
  --region eu-west-1 \
  --query "UserPoolClients[?ClientName=='sunsche716d941_app_clientWeb'].ClientId" \
  --output text
```

**Method 2: From phase_05_auth_current_config.md**

- Dev Client ID: `5hq66dq341pt5peavra3bqpd7b`
- Prod Client ID: `16u9cvivepo40bp2hn5ipjcg2k`

### 5.6. Execution Instructions

**Step 1: Verify AWS credentials**

```bash
aws sts get-caller-identity
```

**Step 2: Get Client ID (use one of the methods from section 5.5)**

**Step 3: Execute script**

**Linux/Mac:**
```bash
# Dev environment
./scripts/update-cognito-tokens.sh us-east-1_FORzY4ey4 5hq66dq341pt5peavra3bqpd7b us-east-1

# Prod environment
./scripts/update-cognito-tokens.sh eu-west-1_iQ7XIxudA 16u9cvivepo40bp2hn5ipjcg2k eu-west-1
```

**Windows PowerShell:**
```powershell
# Dev environment
.\scripts\update-cognito-tokens.ps1 -UserPoolId us-east-1_FORzY4ey4 -ClientId 5hq66dq341pt5peavra3bqpd7b -Region us-east-1

# Prod environment
.\scripts\update-cognito-tokens.ps1 -UserPoolId eu-west-1_iQ7XIxudA -ClientId 16u9cvivepo40bp2hn5ipjcg2k -Region eu-west-1
```

**Important:** Always execute scripts for dev environment first, verify results, then execute for prod.

### 5.7. Verification

**Check token settings:**

```bash
aws cognito-idp describe-user-pool-client \
  --user-pool-id <USER_POOL_ID> \
  --client-id <CLIENT_ID> \
  --region <REGION> \
  --query "UserPoolClient.{IdTokenValidity:IdTokenValidity,AccessTokenValidity:AccessTokenValidity,RefreshTokenValidity:RefreshTokenValidity,TokenValidityUnits:TokenValidityUnits}" \
  --output json
```

**Expected output:**

```json
{
  "IdTokenValidity": 24,
  "AccessTokenValidity": 24,
  "RefreshTokenValidity": 30,
  "TokenValidityUnits": {
    "IdToken": "hours",
    "AccessToken": "hours",
    "RefreshToken": "days"
  }
}
```

### 5.8. Troubleshooting

**Error: "User Pool Client not found"**

- **Cause:** Incorrect Client ID or User Pool ID
- **Solution:** Verify Client ID using methods from section 5.5

**Error: "Invalid parameter: TokenValidityUnits"**

- **Cause:** Incorrect format for token validity units
- **Solution:** Use format: `IdToken=hours,AccessToken=hours,RefreshToken=days`

**Error: "Access Denied"**

- **Cause:** AWS credentials don't have permissions
- **Solution:** Ensure IAM user/role has `cognito-idp:UpdateUserPoolClient` permission

**Error: "Invalid parameter: IdTokenValidity"**

- **Cause:** Value is out of valid range (1-24 hours)
- **Solution:** Verify token validity values in script (24 hours for ID/Access tokens)

---

## 6. Script Execution Guidelines

### 5.1. Pre-Execution Checklist

**Before executing any AWS CLI script:**

- [ ] AWS CLI is installed and configured
- [ ] AWS credentials are valid (`aws sts get-caller-identity`)
- [ ] Correct Amplify environment is checked out (`amplify env list`)
- [ ] User Pool ID is obtained and verified
- [ ] Region is correct for the environment (dev: us-east-1, prod: eu-west-1)
- [ ] Script is executable (for bash scripts: `chmod +x scripts/script-name.sh`)

### 5.2. Execution Order

**Always execute scripts in this order:**

1. **Dev environment first**
   - Execute script for dev
   - Verify results
   - Test functionality

2. **Prod environment second**
   - Execute script for prod
   - Verify results match dev
   - Document any differences

### 5.3. Error Handling

**If script fails:**

1. **Read error message carefully**
   - Identify the failing command
   - Check error details

2. **Verify prerequisites**
   - AWS credentials
   - User Pool ID
   - Region
   - Permissions

3. **Check AWS Console**
   - Verify resource state
   - Check CloudWatch logs (if applicable)

4. **Retry if appropriate**
   - Some errors are transient (network, rate limits)
   - Wait and retry

5. **Document the issue**
   - Update this document with troubleshooting steps
   - Create issue/ticket if needed

### 5.4. Post-Execution Verification

**After executing script:**

- [ ] Verify resources were created/updated correctly
- [ ] Check AWS Console to confirm changes
- [ ] Run verification commands (see section 4.7)
- [ ] Test functionality in application
- [ ] Document execution in Git commit message

---

## 7. Future Scripts

### 6.1. Script Template

**When creating new AWS CLI scripts, follow this template:**

**Bash template:**

```bash
#!/bin/bash

# Script to {purpose}
# Usage: ./scripts/{script-name}.sh <PARAM1> <PARAM2>
# Example: ./scripts/{script-name}.sh value1 value2

set -e  # Exit on error

PARAM1=$1
PARAM2=$2

# Validate parameters
if [ -z "$PARAM1" ] || [ -z "$PARAM2" ]; then
  echo "Error: PARAM1 and PARAM2 are required"
  echo "Usage: ./scripts/{script-name}.sh <PARAM1> <PARAM2>"
  exit 1
fi

echo "=========================================="
echo "{Script Purpose}"
echo "Param1: $PARAM1"
echo "Param2: $PARAM2"
echo "Date: $(date)"
echo "=========================================="
echo ""

# {Script logic here}

echo "=========================================="
echo "Script completed successfully!"
echo "=========================================="
```

**PowerShell template:**

```powershell
# Script to {purpose}
# Usage: .\scripts\{script-name}.ps1 -Param1 <VALUE1> -Param2 <VALUE2>
# Example: .\scripts\{script-name}.ps1 -Param1 value1 -Param2 value2

param(
    [Parameter(Mandatory=$true)]
    [string]$Param1,
    
    [Parameter(Mandatory=$true)]
    [string]$Param2
)

$ErrorActionPreference = "Stop"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "{Script Purpose}" -ForegroundColor Cyan
Write-Host "Param1: $Param1" -ForegroundColor Cyan
Write-Host "Param2: $Param2" -ForegroundColor Cyan
Write-Host "Date: $(Get-Date)" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# {Script logic here}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Script completed successfully!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
```

### 6.2. Documentation Requirements

**When adding new scripts:**

1. **Add script to `scripts/` directory**
2. **Document in this file:**
   - Purpose and use case
   - Parameters and usage
   - Execution instructions
   - Verification commands
   - Troubleshooting
3. **Update section 3 (Scripts Location)**
4. **Add to Git with descriptive commit message**

---

## 8. Integration with Deployment

### 7.1. Deployment Workflow

**Standard deployment process with AWS CLI scripts:**

1. **Deploy infrastructure with Amplify:**
   ```bash
   amplify env checkout dev
   amplify push
   ```

2. **Execute AWS CLI scripts (if needed):**
   ```bash
   ./scripts/create-cognito-groups.sh <DEV_USER_POOL_ID> us-east-1
   ```

3. **Verify configuration:**
   ```bash
   aws cognito-idp list-groups --user-pool-id <DEV_USER_POOL_ID> --region us-east-1
   ```

4. **Repeat for prod:**
   ```bash
   amplify env checkout prod
   amplify push
   ./scripts/create-cognito-groups.sh <PROD_USER_POOL_ID> eu-west-1
   ```

### 7.2. CI/CD Integration

**For automated deployments:**

- Scripts can be added to CI/CD pipeline
- Scripts should be executed after `amplify push`
- Scripts should verify results before proceeding
- Scripts should fail pipeline on error

**Example GitHub Actions step:**

```yaml
- name: Create Cognito Groups
  run: |
    USER_POOL_ID=$(aws cloudformation describe-stacks \
      --stack-name ${{ env.AMPLIFY_STACK_NAME }} \
      --region ${{ env.AWS_REGION }} \
      --query "Stacks[0].Outputs[?OutputKey=='UserPoolId'].OutputValue" \
      --output text)
    ./scripts/create-cognito-groups.sh $USER_POOL_ID ${{ env.AWS_REGION }}
```

---

## 9. References

### 8.1. Related Documentation

- [INFRASTRUCTURE_AS_CODE.md](./INFRASTRUCTURE_AS_CODE.md) - Infrastructure as Code principles and requirements
- [SECURITY.md](./SECURITY.md) - Security requirements and RBAC configuration
- [AWS_AMPLIFY.md](./AWS_AMPLIFY.md) - AWS Amplify configuration guide
- [ARCHITECTURE.md](../architecture/ARCHITECTURE.md) - Overall architecture

### 8.2. AWS Documentation

- [AWS Cognito User Pools](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html)
- [AWS Cognito Groups](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-user-groups.html)
- [AWS CLI Reference](https://docs.aws.amazon.com/cli/latest/reference/)
- [AWS CLI Cognito Commands](https://docs.aws.amazon.com/cli/latest/reference/cognito-idp/)

### 8.3. Tools

- **AWS CLI:** For executing AWS operations
- **Bash:** For Linux/Mac script execution
- **PowerShell:** For Windows script execution
- **Git:** For version control of scripts

---

## 10. Compliance Checklist

**Before considering script setup complete:**

- [ ] Scripts are stored in `scripts/` directory
- [ ] Scripts are executable (bash scripts have +x permission)
- [ ] Scripts are documented in this file
- [ ] Scripts are tested in dev environment
- [ ] Scripts are tested in prod environment
- [ ] Verification commands are documented
- [ ] Troubleshooting section is complete
- [ ] Scripts are committed to Git
- [ ] Documentation is up to date

---

**Version:** 1.1  
**Last Update:** 30 December 2025  
**Maintainer:** DevOps Team

