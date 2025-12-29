# Cognito Groups Configuration - Sunday School App

## Document Version: 1.0
**Creation Date:** 29 December 2025  
**Last Update:** 29 December 2025  
**Project:** Sunday School App  
**Technologies:** AWS Cognito, AWS CLI

---

## 1. Overview

This document describes the Cognito User Pool Groups configuration for the Sunday School App. Groups are used for Role-Based Access Control (RBAC) and are referenced in AppSync `@auth` directives for authorization.

**Important:** Amplify Gen 1 CLI does not support creating groups directly through configuration files. Groups must be created using AWS CLI scripts.

**See [AWS_CLI_SCRIPTS.md](./AWS_CLI_SCRIPTS.md) for detailed execution instructions.**

---

## 2. Groups Configuration

### 2.1. Required Groups

Three groups are required for RBAC:

1. **TEACHER** (precedence: 1)
   - Description: "Sunday School Teachers"
   - Purpose: Teachers can manage their own grade's lessons and homework
   - Precedence: 1 (lowest priority)

2. **ADMIN** (precedence: 2)
   - Description: "Sunday School Administrators"
   - Purpose: Admins can manage all grades, teachers, and pupils
   - Precedence: 2 (medium priority)

3. **SUPERADMIN** (precedence: 3)
   - Description: "Sunday School Super Administrators"
   - Purpose: Superadmins have full access to all resources
   - Precedence: 3 (highest priority)

### 2.2. Precedence Order

**Precedence determines group priority when a user belongs to multiple groups:**

- SUPERADMIN (3) > ADMIN (2) > TEACHER (1)

**Higher precedence groups take priority in authorization decisions.**

**See [SECURITY.md](./SECURITY.md) section 3.1 for RBAC details.**

---

## 3. Current Status

### 3.1. Dev Environment (us-east-1)

**Status:** ✅ Groups created

**User Pool ID:** `us-east-1_FORzY4ey4`

**Created Groups:**
- ✅ TEACHER (precedence: 1) - Created: 2025-12-29
- ✅ ADMIN (precedence: 2) - Created: 2025-12-29
- ✅ SUPERADMIN (precedence: 3) - Created: 2025-12-29

**Verification Command:**
```bash
aws cognito-idp list-groups --user-pool-id us-east-1_FORzY4ey4 --region us-east-1 --output table
```

### 3.2. Prod Environment (eu-west-1)

**Status:** ⏳ Pending (will be created after prod configuration deployment)

**User Pool ID:** `eu-west-1_iQ7XIxudA`

**Created Groups:**
- ⏳ TEACHER (precedence: 1) - Pending
- ⏳ ADMIN (precedence: 2) - Pending
- ⏳ SUPERADMIN (precedence: 3) - Pending

---

## 4. Group Creation

### 4.1. Scripts Location

**Scripts are stored in `scripts/` directory:**
- `scripts/create-cognito-groups.sh` - Bash script for Linux/Mac
- `scripts/create-cognito-groups.ps1` - PowerShell script for Windows

### 4.2. Execution Instructions

**For Dev Environment:**
```powershell
# Windows PowerShell
.\scripts\create-cognito-groups.ps1 -UserPoolId us-east-1_FORzY4ey4 -Region us-east-1

# Linux/Mac Bash
./scripts/create-cognito-groups.sh us-east-1_FORzY4ey4 us-east-1
```

**For Prod Environment:**
```powershell
# Windows PowerShell
.\scripts\create-cognito-groups.ps1 -UserPoolId eu-west-1_iQ7XIxudA -Region eu-west-1

# Linux/Mac Bash
./scripts/create-cognito-groups.sh eu-west-1_iQ7XIxudA eu-west-1
```

**See [AWS_CLI_SCRIPTS.md](./AWS_CLI_SCRIPTS.md) section 4 for detailed instructions.**

### 4.3. Verification

**List all groups:**
```bash
aws cognito-idp list-groups --user-pool-id <USER_POOL_ID> --region <REGION> --output table
```

**Get specific group details:**
```bash
aws cognito-idp get-group --user-pool-id <USER_POOL_ID> --group-name TEACHER --region <REGION>
aws cognito-idp get-group --user-pool-id <USER_POOL_ID> --group-name ADMIN --region <REGION>
aws cognito-idp get-group --user-pool-id <USER_POOL_ID> --group-name SUPERADMIN --region <REGION>
```

---

## 5. Important Notes

### 5.1. Description Language

**AWS CLI does not support Cyrillic characters in group descriptions.**

- ❌ **Not supported:** "Преподаватели воскресной школы"
- ✅ **Supported:** "Sunday School Teachers"

**All group descriptions use English to ensure compatibility with AWS CLI.**

### 5.2. Idempotency

**Scripts are idempotent:**
- Scripts check if groups exist before creating them
- Running scripts multiple times is safe
- Existing groups are skipped with a message

### 5.3. Precedence Importance

**Precedence is critical for RBAC:**
- Higher precedence groups override lower precedence groups
- Precedence determines which group's permissions apply when a user belongs to multiple groups
- Precedence values must be unique and correctly ordered

---

## 6. Related Documentation

### 6.1. Internal Documentation

- [SECURITY.md](./SECURITY.md) - Section 3.1 Role-Based Access Control
- [AWS_CLI_SCRIPTS.md](./AWS_CLI_SCRIPTS.md) - Detailed AWS CLI scripts documentation
- [INFRASTRUCTURE_AS_CODE.md](./INFRASTRUCTURE_AS_CODE.md) - Section 5 Cognito Groups Configuration
- [MVP_SCOPE.md](../MVP_SCOPE.md) - Section 2.1.2 User Roles

### 6.2. AWS Documentation

- [AWS Cognito User Pools](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html)
- [AWS Cognito Groups](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-user-groups.html)
- [AWS CLI Cognito Commands](https://docs.aws.amazon.com/cli/latest/reference/cognito-idp/)

---

## 7. Troubleshooting

### 7.1. Error: "Group already exists"

**Cause:** Group was already created

**Solution:** This is not an error. Scripts are idempotent and handle this automatically.

### 7.2. Error: "Invalid parameter: Description"

**Cause:** Description contains unsupported characters (e.g., Cyrillic)

**Solution:** Use English descriptions only. See section 5.1.

### 7.3. Error: "User Pool not found"

**Cause:** Incorrect User Pool ID or Region

**Solution:** Verify User Pool ID using methods from [AWS_CLI_SCRIPTS.md](./AWS_CLI_SCRIPTS.md) section 4.5.

### 7.4. Error: "Access Denied"

**Cause:** AWS credentials don't have permissions

**Solution:** Ensure IAM user/role has `cognito-idp:CreateGroup` and `cognito-idp:GetGroup` permissions.

---

**Version:** 1.0  
**Last Update:** 29 December 2025  
**Maintainer:** DevOps Team

