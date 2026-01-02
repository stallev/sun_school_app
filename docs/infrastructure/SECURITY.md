# Security - Sunday School App

## Document Version: 1.2
**Creation Date:** 23 December 2025  
**Last Update:** 30 December 2025  
**Project:** Sunday School App  
**Technologies:** AWS Cognito, AWS AppSync, AWS IAM, Next.js 15.5.9, OWASP Best Practices  
**Target Audience:** Security Engineers, Backend Developers, System Administrators

---

## 1. Overview

This document outlines the security architecture, authentication, authorization (RBAC), and best practices for the Sunday School App. The application implements a defense-in-depth strategy, leveraging AWS Cognito for authentication, AppSync `@auth` directives for authorization, and Next.js Server Actions for server-side validation.

### 1.1 Security Principles

-   **Least Privilege:** Users and services have the minimum permissions required to perform their tasks.
-   **Defense in Depth:** Multiple layers of security controls (authentication, authorization, validation, encryption).
-   **Secure by Default:** All API endpoints require authentication unless explicitly marked as public.
-   **Data Encryption:** Encryption in transit (HTTPS) and at rest (DynamoDB, S3).
-   **Audit and Monitoring:** Logging of all authentication events and sensitive operations.
-   **Infrastructure as Code:** All security configurations (Cognito, IAM, AppSync) must be stored in code and version controlled. Manual changes via AWS Console are prohibited.

**See [INFRASTRUCTURE_AS_CODE.md](./INFRASTRUCTURE_AS_CODE.md) for detailed requirements.**

---

## 2. Authentication

### 2.1. AWS Cognito User Pools

**What is Cognito?**

-   Managed user directory service for authentication and user management.
-   Supports email/password, social login (Google, Facebook), and SAML/OIDC.
-   Issues **JSON Web Tokens (JWT)** for session management.

**Configuration:**

-   **User Pool Name (Dev):** `sunsche716d941_userpool_e716d941-dev`
-   **User Pool ID (Dev):** `us-east-1_FORzY4ey4`
-   **User Pool Name (Prod):** `sunsche716d941_userpool_e716d941-prod`
-   **User Pool ID (Prod):** `eu-west-1_iQ7XIxudA`
-   **Sign-In Methods:** Email and Password (MVP)
-   **Password Policy:**
    -   **Configured in code:** Minimum length: 8 characters, Require: Uppercase, number
    -   **Current state in AWS (dev and prod):** Minimum length: 8 characters, all Require* = false
    -   **Note:** Password policy requirements (RequireUppercase, RequireNumbers) are configured in `amplify/backend/auth/sunsche716d941/cli-inputs.json` but are not being applied through `amplify push`. This is a known limitation of Amplify Gen 1 CLI. For MVP, the minimum length requirement (8 characters) is enforced.
-   **MFA (Multi-Factor Authentication):** OFF (for MVP)
-   **Email Verification:** Required before first login
-   **Auto-Verified Attributes:** Email

**Setup:**

```bash
amplify add auth
```

**Prompts:**

```plaintext
? Do you want to use the default authentication and security configuration? Default configuration
? How do you want users to be able to sign in? Email
? Do you want to configure advanced settings? Yes
? What attributes are required for signing up? Email
? Do you want to enable Multi-Factor Authentication (MFA)? Off (for MVP)
```

---

### 2.2. User Registration Flow

**Step 1: Sign Up**

```typescript
// Server Action: actions/auth.ts
'use server'

import { signUp } from 'aws-amplify/auth'
import { createUserSchema } from '@/lib/validation/auth'

export async function registerUser(input: unknown) {
  // 1. Validate input
  const validatedData = createUserSchema.parse(input)

  try {
    // 2. Sign up with Cognito
    const { userId } = await signUp({
      username: validatedData.email,
      password: validatedData.password,
      options: {
        userAttributes: {
          email: validatedData.email,
          name: validatedData.name,
        },
      },
    })

    // 3. Create user record in DynamoDB (via AppSync)
    await amplifyClient.graphql({
      query: createUser,
      variables: {
        input: {
          id: userId,
          name: validatedData.name,
          email: validatedData.email,
          role: 'TEACHER', // Default role
          active: true,
        },
      },
    })

    return { success: true, message: 'Check your email for verification code' }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
```

**Step 2: Email Verification**

```typescript
import { confirmSignUp } from 'aws-amplify/auth'

export async function verifyEmail(email: string, code: string) {
  try {
    await confirmSignUp({ username: email, confirmationCode: code })
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
```

---

### 2.3. User Login Flow

**Step 1: Sign In**

```typescript
import { signIn } from 'aws-amplify/auth'

export async function loginUser(email: string, password: string) {
  try {
    const { isSignedIn, nextStep } = await signIn({ username: email, password })

    if (isSignedIn) {
      return { success: true }
    } else {
      return { success: false, error: 'Additional steps required', nextStep }
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
```

**Step 2: Get Current User**

```typescript
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth'

export async function getAuthenticatedUser() {
  try {
    const user = await getCurrentUser()
    const session = await fetchAuthSession()

    return {
      userId: user.userId,
      username: user.username,
      email: user.signInDetails?.loginId,
      groups: session.tokens?.accessToken.payload['cognito:groups'] as string[] || [],
    }
  } catch (error) {
    console.error('Not authenticated:', error)
    return null
  }
}
```

---

### 2.4. Password Reset Flow

**Step 1: Request Password Reset**

```typescript
import { resetPassword } from 'aws-amplify/auth'

export async function requestPasswordReset(email: string) {
  try {
    await resetPassword({ username: email })
    return { success: true, message: 'Check your email for reset code' }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
```

**Step 2: Confirm Password Reset**

```typescript
import { confirmResetPassword } from 'aws-amplify/auth'

export async function confirmPasswordReset(email: string, code: string, newPassword: string) {
  try {
    await confirmResetPassword({ username: email, confirmationCode: code, newPassword })
    return { success: true, message: 'Password reset successful' }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
```

---

### 2.5. Session Management

**JWT Tokens:**

-   **ID Token:** Contains user identity (userId, email, name).
    -   **Expiration:** 24 hours
    -   **Validity Unit:** hours
-   **Access Token:** Used for authorization (includes `cognito:groups` claim).
    -   **Expiration:** 24 hours
    -   **Validity Unit:** hours
    -   **Groups Claim:** User groups are included in the `cognito:groups` field in the AccessToken payload
-   **Refresh Token:** Used to obtain new ID/Access tokens.
    -   **Expiration:** 30 days
    -   **Validity Unit:** days

**Token Configuration:**

-   Token expiration settings are configured in `amplify/backend/auth/sunsche716d941/cli-inputs.json`
-   ID Token and Access Token expiration are set via AWS CLI scripts (not directly supported by Amplify Gen 1 CLI)
-   Refresh Token expiration is configured through `cli-inputs.json` and applied via `amplify push`
-   See [phase_05_auth_current_config.md](../implementation/mvp/tasks/phase_05_auth_current_config.md) for current configuration details

**Token Storage:**

-   Amplify automatically stores tokens in **httpOnly cookies** (Next.js App Router + SSR).
-   Tokens are refreshed automatically before expiration.

**Logout:**

```typescript
import { signOut } from 'aws-amplify/auth'

export async function logoutUser() {
  try {
    await signOut()
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
```

---

## 3. Authorization (RBAC)

### 3.1. Role-Based Access Control (RBAC)

**User Roles (MVP Scope):**

| Role         | Description                              | Capabilities                                                      |
| :----------- | :--------------------------------------- | :---------------------------------------------------------------- |
| `TEACHER`    | Sunday school teacher                    | Manage lessons and homework for assigned grades                   |
| `ADMIN`      | School administrator                     | Full CRUD for users, pupils, grades, lessons, and settings        |
| `SUPERADMIN` | Highest level administrator              | Same as Admin (Post-MVP: user role management, system settings)   |
| `PARENT`     | Parent of a pupil (Post-MVP)             | Read-only access to their children's data                         |
| `PUPIL`      | Sunday school pupil (Post-MVP)           | Read-only access to their own data (grades, achievements)         |

**Role Assignment:**

-   Roles are stored in **Cognito User Groups** (e.g., `TEACHER`, `ADMIN`, `SUPERADMIN`).
-   Assigned by Admins during user creation or via AWS CLI commands.
-   Groups are created using AWS CLI scripts (Amplify Gen 1 CLI does not support creating groups directly).

**Group Configuration:**

-   **TEACHER** (precedence: 1) - Sunday School Teachers
-   **ADMIN** (precedence: 2) - Sunday School Administrators  
-   **SUPERADMIN** (precedence: 3) - Sunday School Super Administrators

**Precedence Order:** SUPERADMIN (3) > ADMIN (2) > TEACHER (1)

Higher precedence groups take priority in authorization decisions when a user belongs to multiple groups.

**Setup:**

Groups are created using AWS CLI scripts. See [COGNITO_GROUPS.md](./COGNITO_GROUPS.md) for detailed documentation and [AWS_CLI_SCRIPTS.md](./AWS_CLI_SCRIPTS.md) for execution instructions.

**Current Status:**
- ✅ Groups created in dev environment (us-east-1): `us-east-1_FORzY4ey4`
- ✅ Groups created in prod environment (eu-west-1): `eu-west-1_iQ7XIxudA`
- ✅ All groups have correct precedence and descriptions

---

### 3.2. AppSync `@auth` Directive

**Authorization Modes:**

-   **Cognito User Pools:** Primary mode (authenticated users).
-   **API Key:** For public data (not used in MVP).
-   **IAM:** For backend services (e.g., Lambda).

**Example `@auth` Rules:**

```graphql
# Teachers, Admins, and Superadmins can read their own data
type User @model @auth(rules: [
  { allow: owner, ownerField: "id", operations: [read, update] },
  { allow: groups, groups: ["ADMIN", "SUPERADMIN"], operations: [read, create, update, delete] }
]) {
  id: ID!
  name: String!
  email: String!
  role: UserRole!
}

# Only Admins can create/update/delete grades
type Grade @model @auth(rules: [
  { allow: groups, groups: ["TEACHER", "ADMIN", "SUPERADMIN"], operations: [read] },
  { allow: groups, groups: ["ADMIN", "SUPERADMIN"], operations: [create, update, delete] }
]) {
  id: ID!
  name: String!
  description: String
}

# Teachers can read and update lessons for their assigned grades
type Lesson @model @auth(rules: [
  { allow: groups, groups: ["TEACHER", "ADMIN", "SUPERADMIN"], operations: [read, create, update] },
  { allow: groups, groups: ["ADMIN", "SUPERADMIN"], operations: [delete] }
]) {
  id: ID!
  title: String!
  lessonDate: AWSDate!
}

# Pupils can read their own homework (Post-MVP)
type HomeworkCheck @model @auth(rules: [
  { allow: groups, groups: ["TEACHER", "ADMIN", "SUPERADMIN"], operations: [read, create, update, delete] },
  { allow: owner, ownerField: "pupilId", operations: [read] }
]) {
  id: ID!
  lessonId: ID!
  pupilId: ID!
  isCompleted: Boolean!
  score: Int
}
```

**Authorization Logic:**

-   **`allow: owner`**: User can only access their own data (matched by `ownerField`).
-   **`allow: groups`**: User must belong to specified Cognito User Group.
-   **`operations`**: Restrict operations (create, read, update, delete).

---

### 3.3. Server-Side Authorization

**In Server Actions:**

```typescript
'use server'

import { getAuthenticatedUser } from '@/lib/auth/amplify-auth'

export async function deleteGrade(gradeId: string) {
  // 1. Authenticate
  const user = await getAuthenticatedUser()
  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  // 2. Authorize (check role)
  if (!user.groups.includes('ADMIN') && !user.groups.includes('SUPERADMIN')) {
    return { success: false, error: 'Forbidden: Admin access required' }
  }

  // 3. Perform action
  try {
    await amplifyClient.graphql({
      query: deleteGradeMutation,
      variables: { id: gradeId },
    })
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
```

---

## 4. Data Encryption

### 4.1. Encryption in Transit

-   **HTTPS Only:** All API requests are encrypted with TLS 1.2+.
-   **AWS Certificate Manager:** Automatic SSL certificate provisioning for custom domains.
-   **AppSync API:** All GraphQL requests are over HTTPS.

**Enforcement:**

-   Amplify Hosting automatically enforces HTTPS.
-   For self-hosted deployments, configure Nginx with SSL certificates.

---

### 4.2. Encryption at Rest

-   **DynamoDB:** Automatic encryption using AWS-managed keys (AES-256).
-   **S3:** Server-side encryption with S3-managed keys (SSE-S3).
-   **Cognito:** User passwords are hashed using bcrypt (AWS-managed).

**Optional (Post-MVP): Customer-Managed Keys (CMK)**

-   Use AWS KMS for custom encryption keys.
-   Provides audit logs for key usage.

---

## 5. Input Validation and Sanitization

### 5.1. Client-Side Validation

**React Hook Form + Zod:**

-   All form inputs are validated on the client before submission.
-   See **→ [VALIDATION.md](../api/VALIDATION.md)** for full schemas.

**Example:**

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createLessonSchema } from '@/lib/validation/lessons'

export function LessonForm() {
  const form = useForm({
    resolver: zodResolver(createLessonSchema),
    defaultValues: { title: '', lessonDate: '' },
  })

  async function onSubmit(values) {
    const result = await createLesson(values)
    // Handle result
  }

  return <form onSubmit={form.handleSubmit(onSubmit)}>...</form>
}
```

---

### 5.2. Server-Side Validation

**Server Actions:**

-   **Always validate** inputs on the server, even if client-side validation passes.
-   Use Zod schemas to ensure type safety and runtime validation.

**Example:**

```typescript
'use server'

import { createLessonSchema } from '@/lib/validation/lessons'

export async function createLesson(input: unknown) {
  try {
    // 1. Validate input
    const validatedData = createLessonSchema.parse(input)

    // 2. Authenticate & authorize
    const user = await getAuthenticatedUser()
    if (!user || !user.groups.includes('TEACHER')) {
      return { success: false, error: 'Unauthorized' }
    }

    // 3. Sanitize input (if needed)
    const sanitizedTitle = validatedData.title.trim()

    // 4. Perform action
    const lesson = await amplifyClient.graphql({
      query: createLessonMutation,
      variables: { input: { ...validatedData, title: sanitizedTitle } },
    })

    return { success: true, data: lesson }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Validation failed', fieldErrors: error.flatten().fieldErrors }
    }
    return { success: false, error: 'Failed to create lesson' }
  }
}
```

---

### 5.3. Sanitization for Rich Text (BlockNote)

**Prevent XSS Attacks:**

-   Use a sanitization library like **DOMPurify** to clean user-generated HTML.

**Example:**

```typescript
import DOMPurify from 'isomorphic-dompurify'

export function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: [],
  })
}

// In Server Action
const sanitizedContent = sanitizeHTML(validatedData.content)
```

---

## 6. API Security

### 6.1. CORS Configuration

**AppSync CORS Settings:**

-   Restrict API access to your frontend domain only.

**Configuration (via Amplify CLI or AWS Console):**

```json
{
  "allowedOrigins": [
    "https://sundayschool.com",
    "https://dev.sundayschool.com",
    "http://localhost:3000"
  ],
  "allowedMethods": ["POST", "OPTIONS"],
  "allowedHeaders": ["Content-Type", "Authorization"],
  "maxAge": 3600
}
```

---

### 6.2. Rate Limiting (Post-MVP)

**AWS WAF (Web Application Firewall):**

-   Protect AppSync API from DDoS attacks and brute-force login attempts.
-   Configure rate-limiting rules (e.g., 100 requests per minute per IP).

**Example WAF Rule:**

```json
{
  "Name": "RateLimitRule",
  "Priority": 1,
  "Statement": {
    "RateBasedStatement": {
      "Limit": 100,
      "AggregateKeyType": "IP"
    }
  },
  "Action": {
    "Block": {}
  }
}
```

---

### 6.3. SQL Injection Prevention

**Not Applicable:**

-   DynamoDB is a NoSQL database and does not support SQL queries.
-   AppSync GraphQL resolvers use parameterized queries, preventing injection attacks.

---

## 7. Secrets Management

### 7.1. Environment Variables

**Best Practices:**

-   **Never commit secrets** to Git.
-   Use **AWS Secrets Manager** or **Amplify Environment Variables** for sensitive data.

**Example:**

```bash
# .env.local (local development only - NOT committed)
NEXT_PUBLIC_APP_NAME=Sunday School App
AWS_REGION=us-east-1

# Do NOT store these in .env (use AWS Secrets Manager):
# DATABASE_PASSWORD=secret123
# API_KEY=abcdef123456
```

---

### 7.2. AWS Secrets Manager (Post-MVP)

**Store Secrets:**

```bash
aws secretsmanager create-secret \
  --name sundayschoolapp/prod/api-key \
  --secret-string "your-secret-api-key"
```

**Retrieve Secrets in Server Actions:**

```typescript
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager'

export async function getSecret(secretName: string): Promise<string> {
  const client = new SecretsManagerClient({ region: 'us-east-1' })
  const response = await client.send(new GetSecretValueCommand({ SecretId: secretName }))
  return response.SecretString || ''
}
```

---

## 8. Audit and Monitoring

### 8.1. CloudWatch Logs

> **Примечание для MVP:** CloudWatch Logs для AppSync не настраиваются на стадии MVP, так как это добавляет дополнительные затраты и сложность, которые не требуются на начальном этапе. Базовые метрики доступны в AWS Console без дополнительной настройки.

**AppSync Logs (Post-MVP):**

-   Enable detailed logging for all GraphQL operations.
-   Logs include: queries, mutations, authentication events, and errors.

**Configuration:**

```bash
amplify console api
```

-   Navigate to **AppSync Console** → **Settings** → **Logging** → Enable **Field resolver logging**.

---

### 8.2. Cognito Logs

**User Activity Logs:**

-   Track sign-up, sign-in, password reset, and MFA events.
-   Logs are sent to **CloudWatch Logs**.

**Configuration:**

```bash
amplify console auth
```

-   Navigate to **User Pool** → **Advanced security** → **Audit logging** → Enable.

---

### 8.3. AWS CloudTrail

**API Audit Logs:**

-   CloudTrail logs all AWS API calls (e.g., `amplify push`, `aws s3 cp`).
-   Useful for compliance and forensic analysis.

**Enable CloudTrail:**

```bash
aws cloudtrail create-trail --name sundayschoolapp-trail --s3-bucket-name sundayschoolapp-logs
aws cloudtrail start-logging --name sundayschoolapp-trail
```

---

## 9. Security Best Practices Checklist

### 9.1. Authentication

-   ✅ Use Cognito User Pools for authentication.
-   ✅ Enforce strong password policies (8+ characters, uppercase, number).
-   ✅ Require email verification before first login.
-   ⬜ Enable MFA for Admin/Superadmin users (Post-MVP).
-   ⬜ Implement account lockout after 5 failed login attempts (Post-MVP).

### 9.2. Authorization

-   ✅ Implement RBAC with Cognito User Groups.
-   ✅ Use AppSync `@auth` directives for fine-grained access control.
-   ✅ Always authorize requests in Server Actions.
-   ✅ Follow the principle of least privilege.

### 9.3. Data Protection

-   ✅ Enforce HTTPS for all traffic.
-   ✅ Encrypt data at rest (DynamoDB, S3).
-   ✅ Sanitize user-generated HTML content.
-   ⬜ Use AWS KMS for customer-managed encryption keys (Post-MVP).

### 9.4. Input Validation

-   ✅ Validate all inputs on the client (React Hook Form + Zod).
-   ✅ Validate all inputs on the server (Server Actions + Zod).
-   ✅ Sanitize rich text content (DOMPurify).

### 9.5. API Security

-   ✅ Configure CORS to restrict API access to frontend domain.
-   ⬜ Implement rate limiting with AWS WAF (Post-MVP).
-   ⬜ Monitor for anomalous API usage patterns (Post-MVP).

### 9.6. Secrets Management

-   ✅ Never commit secrets to Git.
-   ✅ Use environment variables for non-sensitive config.
-   ⬜ Use AWS Secrets Manager for sensitive data (Post-MVP).

### 9.7. Monitoring and Logging

-   ⬜ Enable CloudWatch Logs for AppSync (Post-MVP, не требуется для MVP).
-   ✅ Enable Cognito audit logging.
-   ⬜ Set up alerts for suspicious activity (Post-MVP).
-   ⬜ Enable AWS GuardDuty for threat detection (Post-MVP).

---

## 10. Incident Response Plan (Post-MVP)

### 10.1. Security Incident Types

-   **Unauthorized Access:** Compromised user credentials or API keys.
-   **Data Breach:** Exposure of sensitive user data.
-   **DDoS Attack:** Overwhelming the AppSync API with requests.

### 10.2. Response Steps

1.  **Detect:** Monitor CloudWatch alarms and GuardDuty findings.
2.  **Contain:** Disable compromised user accounts, rotate API keys, block malicious IPs.
3.  **Investigate:** Analyze CloudTrail and CloudWatch logs.
4.  **Recover:** Restore data from backups (if needed), patch vulnerabilities.
5.  **Document:** Create incident report with root cause analysis.

---

## 11. Compliance (Future Considerations)

### 11.1. GDPR (General Data Protection Regulation)

-   **Data Minimization:** Collect only necessary user data.
-   **Right to Erasure:** Implement user account deletion (soft delete in DynamoDB).
-   **Data Portability:** Provide data export functionality (Post-MVP).
-   **Consent:** Obtain explicit consent for data collection (e.g., cookies, analytics).

### 11.2. COPPA (Children's Online Privacy Protection Act)

-   **If collecting data from pupils under 13:**
    -   Obtain parental consent.
    -   Limit data collection to what is necessary.
    -   Provide parental access to pupil data.

---

## 12. Testing and Test Users

### 12.1. Test Users for Development

**Test users are created only for dev environment (not for production).**

Test user credentials are stored in `docs/secure_data/cognito_users.md` (this file is in `.gitignore` and should not be committed to Git).

**Test Users:**
- `teacher@test.com` - Group: TEACHER
- `admin@test.com` - Group: ADMIN
- `superadmin@test.com` - Group: SUPERADMIN

**Important:**
- ⚠️ Test users are for development only
- ⚠️ Do not use test users in production environment
- ⚠️ Test user credentials file should not be committed to Git
- ✅ All test users have email verified = true for easier testing
- ✅ All test users are added to their respective groups

**See [cognito_users.md](../secure_data/cognito_users.md) for test user credentials (dev environment only).**

---

## 12. Cross-References

### 12.1. Related Infrastructure Documentation

-   [COGNITO_DYNAMODB_USER_SYNC.md](./COGNITO_DYNAMODB_USER_SYNC.md) — Связь между Cognito User Pool и таблицей User в DynamoDB, причины рассинхронизации и процесс регистрации пользователей
-   [AWS_CLI_SCRIPTS.md](./AWS_CLI_SCRIPTS.md) — AWS CLI скрипты для управления Cognito группами и токенами
-   [AWS_AMPLIFY.md](./AWS_AMPLIFY.md) — Конфигурация AWS Amplify Gen 1
-   [INFRASTRUCTURE_AS_CODE.md](./INFRASTRUCTURE_AS_CODE.md) — Принципы Infrastructure as Code

## 13. Cross-References (Legacy)

-   **→ [AWS_AMPLIFY.md](AWS_AMPLIFY.md):** Cognito and AppSync configuration.
-   **→ [INFRASTRUCTURE_AS_CODE.md](./INFRASTRUCTURE_AS_CODE.md):** Infrastructure as Code principles and requirements.
-   **→ [COGNITO_GROUPS.md](./COGNITO_GROUPS.md):** Cognito User Pool Groups configuration and setup.
-   **→ [phase_05_auth_current_config.md](../implementation/mvp/tasks/phase_05_auth_current_config.md):** Current Cognito configuration details.
-   **→ [cognito_users.md](../secure_data/cognito_users.md):** Test user credentials (dev environment only, not committed to Git).
-   **→ [SERVER_ACTIONS.md](../api/SERVER_ACTIONS.md):** Server-side validation and authorization.
-   **→ [VALIDATION.md](../api/VALIDATION.md):** Zod schemas for input validation.
-   **→ [GRAPHQL_SCHEMA.md](../database/GRAPHQL_SCHEMA.md):** `@auth` directive usage in GraphQL schema.

---

## 13. Resources

-   **AWS Cognito Best Practices:** https://docs.aws.amazon.com/cognito/latest/developerguide/security-best-practices.html
-   **AppSync Security:** https://docs.aws.amazon.com/appsync/latest/devguide/security.html
-   **OWASP Top 10:** https://owasp.org/www-project-top-ten/
-   **OWASP Cheat Sheet Series:** https://cheatsheetseries.owasp.org
-   **DOMPurify Documentation:** https://github.com/cure53/DOMPurify
-   **AWS Security Hub:** https://aws.amazon.com/security-hub/

---

**End of Security Documentation**

