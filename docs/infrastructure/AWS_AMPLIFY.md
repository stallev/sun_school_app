# AWS Amplify Gen 1 Configuration - Sunday School App

## Document Version: 1.0
**Creation Date:** 23 December 2025  
**Last Update:** 23 December 2025  
**Project:** Sunday School App  
**Technologies:** AWS Amplify Gen 1, AWS AppSync, AWS DynamoDB, AWS Cognito, AWS S3, AWS CloudFront  
**Target Audience:** DevOps Engineers, Backend Developers, System Administrators

---

## 1. Overview

This document provides a comprehensive guide to configuring **AWS Amplify Generation 1 (Gen 1)** for the Sunday School App. It covers initial setup, backend resource provisioning (Auth, API, Storage), configuration files, and deployment strategies.

### 1.1 What is AWS Amplify Gen 1?

-   **AWS Amplify Gen 1** is a mature, stable platform for building fullstack serverless applications.
-   Provides a CLI-driven workflow for provisioning AWS resources (Cognito, AppSync, DynamoDB, S3, etc.).
-   Generates configuration files (`amplifyconfiguration.json`) for seamless frontend-backend integration.
-   Offers a managed CI/CD pipeline via Amplify Console for automated deployments.

### 1.2 Why Gen 1 (Not Gen 2)?

-   **Stability:** Gen 1 is battle-tested and production-ready.
-   **Documentation:** Extensive documentation and community support.
-   **MVP Scope:** Gen 1 provides all features required for the MVP (Auth, API, Storage).
-   **Migration Path:** Gen 2 is newer but not necessary for this project's scope.

**⚠️ CRITICAL:** This project uses **Amplify Gen 1**, NOT Gen 2. All CLI commands and configurations follow Gen 1 conventions.

---

## 2. Prerequisites

### 2.1. Install Amplify CLI

**Global Installation:**

```bash
npm install -g @aws-amplify/cli
```

**Verify Installation:**

```bash
amplify --version
```

**Expected Output:** `12.x.x` (or latest Gen 1 version)

---

### 2.2. Configure Amplify CLI with AWS Credentials

**Run Configuration:**

```bash
amplify configure
```

**Follow Prompts:**

1.  **Sign in to AWS Console:** Opens a browser window for AWS login.
2.  **Specify AWS Region:** Choose your preferred region (e.g., `us-east-1`, `eu-west-1`).
3.  **Specify IAM User Name:** Create a new IAM user (e.g., `amplify-dev`).
4.  **Set Permissions:** Attach **AdministratorAccess** policy (for development) or custom policies (for production).
5.  **Access Key ID & Secret Access Key:** Store these securely (e.g., 1Password, AWS Secrets Manager).

**Verification:**

```bash
aws configure list
```

---

## 3. Project Initialization

### 3.1. Initialize Amplify in Your Next.js Project

**Navigate to Project Root:**

```bash
cd sunday-school-app
```

**Initialize Amplify:**

```bash
amplify init
```

**Configuration Prompts:**

```plaintext
? Enter a name for the project: sundayschoolapp
? Initialize the project with the above configuration? No
? Enter a name for the environment: dev
? Choose your default editor: Visual Studio Code
? Choose the type of app that you're building: javascript
? What javascript framework are you using: react
? Source Directory Path: src
? Distribution Directory Path: .next
? Build Command: npm run build
? Start Command: npm run dev
? Do you want to use an AWS profile? Yes
? Please choose the profile you want to use: default (or amplify-dev)
```

**Result:**

-   Creates `amplify/` directory with backend configuration.
-   Creates `amplifyconfiguration.json` in the project root.
-   Initializes the `dev` environment in AWS.

---

### 3.2. Amplify Directory Structure

After initialization, your project will have:

```
amplify/
├── backend/
│   ├── auth/                  # Cognito configuration
│   ├── api/                   # AppSync + DynamoDB configuration
│   ├── storage/               # S3 configuration
│   ├── function/              # Lambda functions (if needed)
│   └── backend-config.json    # Overall backend config
├── team-provider-info.json    # Environment-specific settings (AWS resources)
└── .config/                   # CLI configuration

amplifyconfiguration.json       # Frontend configuration file
```

---

## 4. Adding Backend Resources

### 4.1. Authentication (AWS Cognito)

**Add Auth Resource:**

```bash
amplify add auth
```

**Configuration Prompts:**

```plaintext
? Do you want to use the default authentication and security configuration? Default configuration
? How do you want users to be able to sign in? Email
? Do you want to configure advanced settings? Yes, I want to make some additional changes.
? What attributes are required for signing up? Email
? Do you want to enable any of the following capabilities? (Press <space> to select, <enter> to continue)
  - Add User to Group
  - Email Verification Link with Redirect
  - Override ID Token Claims
```

**Advanced Configuration (Optional):**

-   **MFA (Multi-Factor Authentication):** Optional (Post-MVP)
-   **Password Policy:** Minimum 8 characters, require uppercase, lowercase, number
-   **Email Verification:** Required for account activation

**Deploy Auth:**

```bash
amplify push
```

**Result:**

-   Cognito User Pool created in AWS.
-   `amplifyconfiguration.json` updated with Cognito configuration.

---

### 4.2. GraphQL API (AWS AppSync + DynamoDB)

**Add API Resource:**

```bash
amplify add api
```

**Configuration Prompts:**

```plaintext
? Select from one of the below mentioned services: GraphQL
? Here is the GraphQL API that we will create. Select a setting to edit or continue: Continue
? Choose a schema template: Blank Schema
```

**Define GraphQL Schema:**

Amplify will open the schema file at `amplify/backend/api/<api-name>/schema.graphql`.

**For Sunday School App, use the schema from:**

-   **→ [GRAPHQL_SCHEMA.md](../database/GRAPHQL_SCHEMA.md)**

**Example Schema (Simplified):**

```graphql
# amplify/backend/api/sundayschoolapi/schema.graphql

type User @model @auth(rules: [
  { allow: owner, ownerField: "id" },
  { allow: groups, groups: ["ADMIN", "SUPERADMIN"] }
]) {
  id: ID!
  name: String!
  email: String!
  role: UserRole!
  active: Boolean!
}

enum UserRole {
  TEACHER
  ADMIN
  SUPERADMIN
  PARENT
  PUPIL
}

type Grade @model @auth(rules: [
  { allow: groups, groups: ["TEACHER", "ADMIN", "SUPERADMIN"], operations: [read] }
]) {
  id: ID!
  name: String!
  description: String
  minAge: Int
  maxAge: Int
  active: Boolean!
  pupils: [Pupil] @hasMany(indexName: "byGrade", fields: ["id"])
}

type Pupil @model @auth(rules: [
  { allow: groups, groups: ["TEACHER", "ADMIN", "SUPERADMIN"], operations: [read] }
]) {
  id: ID!
  gradeId: ID! @index(name: "byGrade", sortKeyFields: ["lastName", "firstName"])
  grade: Grade @belongsTo(fields: ["gradeId"])
  firstName: String!
  lastName: String!
  dateOfBirth: AWSDate!
  photo: String
  active: Boolean!
}

# Add more types from GRAPHQL_SCHEMA.md...
```

**Authorization Configuration:**

-   **Cognito User Pools:** Primary authorization mode
-   **API Key:** For public data (optional, not recommended for production)

**Deploy API:**

```bash
amplify push
```

**Result:**

-   AppSync GraphQL API created in AWS.
-   DynamoDB tables provisioned with single-table design (see `DYNAMODB_SCHEMA.md`).
-   `amplifyconfiguration.json` updated with API endpoint and auth configuration.

---

### 4.3. Storage (AWS S3)

**Add Storage Resource:**

```bash
amplify add storage
```

**Configuration Prompts:**

```plaintext
? Select from one of the below mentioned services: Content (Images, audio, video, etc.)
? Provide a friendly name for your resource that will be used to label this category in the project: s3storage
? Provide bucket name: sundayschoolapp-storage-<unique-id>
? Who should have access: Auth users only
? What kind of access do you want for Authenticated users?
  - create/update
  - read
  - delete
? Do you want to add a Lambda Trigger for your S3 Bucket? No
```

**Access Patterns:**

-   **Pupil Photos:** `public/pupils/{pupilId}/avatar.jpg`
-   **Lesson Attachments:** `protected/lessons/{lessonId}/attachment.pdf` (Post-MVP)

**Deploy Storage:**

```bash
amplify push
```

**Result:**

-   S3 bucket created with CORS configuration.
-   CloudFront distribution (optional, for CDN) configured.
-   `amplifyconfiguration.json` updated with S3 bucket name and region.

---

## 5. Configuration Files

### 5.1. `amplifyconfiguration.json`

**Location:** Project root

**Purpose:** Frontend configuration for Amplify libraries (Auth, API, Storage).

**Example:**

```json
{
  "UserAgent": "aws-amplify-cli/2.0",
  "Version": "1.0",
  "api": {
    "plugins": {
      "awsAPIPlugin": {
        "sundayschoolapi": {
          "endpointType": "GraphQL",
          "endpoint": "https://abcdefghijk.appsync-api.us-east-1.amazonaws.com/graphql",
          "region": "us-east-1",
          "authorizationType": "AMAZON_COGNITO_USER_POOLS"
        }
      }
    }
  },
  "auth": {
    "plugins": {
      "awsCognitoAuthPlugin": {
        "UserAgent": "aws-amplify-cli/0.1.0",
        "Version": "0.1.0",
        "IdentityManager": {
          "Default": {}
        },
        "CredentialsProvider": {
          "CognitoIdentity": {
            "Default": {
              "PoolId": "us-east-1:12345678-1234-1234-1234-123456789012",
              "Region": "us-east-1"
            }
          }
        },
        "CognitoUserPool": {
          "Default": {
            "PoolId": "us-east-1_ABCDEFGHI",
            "AppClientId": "1234567890abcdefghijklmno",
            "Region": "us-east-1"
          }
        },
        "Auth": {
          "Default": {
            "authenticationFlowType": "USER_SRP_AUTH",
            "OAuth": {
              "WebDomain": "sundayschoolapp-dev.auth.us-east-1.amazoncognito.com",
              "AppClientId": "1234567890abcdefghijklmno",
              "SignInRedirectURI": "http://localhost:3000/",
              "SignOutRedirectURI": "http://localhost:3000/",
              "Scopes": ["email", "openid", "profile"]
            }
          }
        }
      }
    }
  },
  "storage": {
    "plugins": {
      "awsS3StoragePlugin": {
        "bucket": "sundayschoolapp-storage-dev-12345",
        "region": "us-east-1",
        "defaultAccessLevel": "guest"
      }
    }
  }
}
```

**Usage in Next.js:**

```typescript
// lib/db/amplify.ts
import { Amplify } from 'aws-amplify'
import amplifyConfig from '../../amplifyconfiguration.json'

Amplify.configure(amplifyConfig, { ssr: true })

export default Amplify
```

---

### 5.2. `team-provider-info.json`

**Location:** `amplify/team-provider-info.json`

**Purpose:** Environment-specific AWS resource metadata (e.g., ARNs, stack names).

**Security:** Add to `.gitignore` if it contains sensitive information (e.g., API keys for external services).

**Example:**

```json
{
  "dev": {
    "awscloudformation": {
      "AuthRoleName": "amplify-sundayschoolapp-dev-12345-authRole",
      "UnauthRoleArn": "arn:aws:iam::123456789012:role/amplify-sundayschoolapp-dev-12345-unauthRole",
      "AuthRoleArn": "arn:aws:iam::123456789012:role/amplify-sundayschoolapp-dev-12345-authRole",
      "Region": "us-east-1",
      "DeploymentBucketName": "amplify-sundayschoolapp-dev-12345-deployment",
      "UnauthRoleName": "amplify-sundayschoolapp-dev-12345-unauthRole",
      "StackName": "amplify-sundayschoolapp-dev-12345",
      "StackId": "arn:aws:cloudformation:us-east-1:123456789012:stack/amplify-sundayschoolapp-dev-12345/abcd1234",
      "AmplifyAppId": "d1234567890abc"
    },
    "categories": {
      "auth": {
        "sundayschoolappauth": {
          "userPoolId": "us-east-1_ABCDEFGHI",
          "userPoolName": "sundayschoolappauth",
          "appClientId": "1234567890abcdefghijklmno"
        }
      },
      "api": {
        "sundayschoolapi": {
          "GraphQLAPIIdOutput": "abcdefghijk123456",
          "GraphQLAPIEndpointOutput": "https://abcdefghijk.appsync-api.us-east-1.amazonaws.com/graphql"
        }
      },
      "storage": {
        "s3storage": {
          "BucketName": "sundayschoolapp-storage-dev-12345",
          "Region": "us-east-1"
        }
      }
    }
  }
}
```

---

## 6. Data Access Layer

### 6.1. Amplify Client Initialization

**File:** `lib/db/amplify.ts`

```typescript
import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/api'
import amplifyConfig from '../../amplifyconfiguration.json'

// Configure Amplify for SSR (Next.js App Router)
Amplify.configure(amplifyConfig, { ssr: true })

// Generate a type-safe GraphQL client
export const amplifyClient = generateClient()

export default Amplify
```

---

### 6.2. Authentication Helper

**File:** `lib/auth/amplify-auth.ts`

```typescript
import { fetchAuthSession, getCurrentUser, signIn, signOut } from 'aws-amplify/auth'

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

export async function authenticateUser(email: string, password: string) {
  try {
    const { isSignedIn, nextStep } = await signIn({ username: email, password })
    return { success: true, isSignedIn, nextStep }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

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

### 6.3. GraphQL Queries and Mutations

**File:** `lib/db/queries.ts`

```typescript
import { amplifyClient } from './amplify'

// Example: Fetch all lessons for an academic year
export async function getLessonsByAcademicYear(academicYearId: string) {
  try {
    const result = await amplifyClient.graphql({
      query: `
        query ListLessons($academicYearId: ID!) {
          lessonsByAcademicYear(academicYearId: $academicYearId) {
            items {
              id
              title
              lessonDate
              order
            }
          }
        }
      `,
      variables: { academicYearId },
    })

    return result.data.lessonsByAcademicYear.items
  } catch (error) {
    console.error('Error fetching lessons:', error)
    throw new Error('Failed to fetch lessons')
  }
}

// Example: Create a new lesson
export async function createLesson(input: {
  academicYearId: string
  title: string
  lessonDate: string
  content?: string
}) {
  try {
    const result = await amplifyClient.graphql({
      query: `
        mutation CreateLesson($input: CreateLessonInput!) {
          createLesson(input: $input) {
            id
            title
            lessonDate
          }
        }
      `,
      variables: { input },
    })

    return result.data.createLesson
  } catch (error) {
    console.error('Error creating lesson:', error)
    throw new Error('Failed to create lesson')
  }
}
```

---

## 7. Environment Management

### 7.1. Creating Multiple Environments

**Add a New Environment:**

```bash
amplify env add
```

**Prompts:**

```plaintext
? Enter a name for the environment: prod
? Do you want to use an existing service role for CloudFormation? No
? Choose the authentication method you want to use: AWS profile
? Please choose the profile you want to use: default
```

**Switch Between Environments:**

```bash
amplify env checkout dev   # Switch to dev
amplify env checkout prod  # Switch to prod
```

**List Environments:**

```bash
amplify env list
```

---

### 7.2. Environment-Specific Variables

**Use `team-provider-info.json` for environment-specific configuration:**

```json
{
  "dev": {
    "categories": {
      "function": {
        "myLambda": {
          "MY_ENV_VAR": "dev-value"
        }
      }
    }
  },
  "prod": {
    "categories": {
      "function": {
        "myLambda": {
          "MY_ENV_VAR": "prod-value"
        }
      }
    }
  }
}
```

---

## 8. Deployment

### 8.1. Deploy Backend Changes

**Push All Changes:**

```bash
amplify push
```

**Push Without Confirmation:**

```bash
amplify push --yes
```

**Review Changes Before Deploy:**

```bash
amplify status
```

---

### 8.2. Amplify Console CI/CD

**Connect Your Repository:**

1.  **Open Amplify Console:**
    ```bash
    amplify console
    ```

2.  **Connect GitHub/GitLab/Bitbucket:**
    -   Navigate to **Amplify Console** → **All apps** → **Connect app**.
    -   Select your repository and branch (e.g., `main`, `dev`).

3.  **Configure Build Settings:**
    ```yaml
    # amplify.yml (auto-generated)
    version: 1
    backend:
      phases:
        build:
          commands:
            - amplifyPush --simple
    frontend:
      phases:
        preBuild:
          commands:
            - npm ci
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: .next
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
    ```

4.  **Deploy:**
    -   Every push to the connected branch triggers an automatic build and deployment.

---

### 8.3. Manual Frontend Deployment

**Build Next.js App:**

```bash
npm run build
```

**Deploy to Amplify Hosting:**

```bash
amplify publish
```

---

## 9. Monitoring and Troubleshooting

### 9.1. Viewing Logs

**AppSync Logs (CloudWatch):**

```bash
amplify console api
```

-   Navigate to **AppSync Console** → **Logs** → **CloudWatch Logs Insights**.

**Cognito Logs:**

```bash
amplify console auth
```

-   Navigate to **Cognito Console** → **User Pool** → **Monitoring**.

---

### 9.2. Common Issues

#### Issue 1: `amplify push` Fails with "Deployment Failed"

**Solution:**

-   Check CloudFormation stack events in AWS Console.
-   Common causes: IAM permission errors, resource limits, invalid schema.

#### Issue 2: "Unauthorized" Errors in GraphQL Queries

**Solution:**

-   Verify `@auth` directives in GraphQL schema.
-   Ensure user is in the correct Cognito User Group.
-   Check that `amplifyconfiguration.json` has the correct `authorizationType`.

#### Issue 3: "Module not found: aws-amplify"

**Solution:**

```bash
npm install aws-amplify
```

---

## 10. Best Practices

### 10.1. Security

-   **Never commit `team-provider-info.json` with sensitive data** (add to `.gitignore`).
-   **Use environment variables** for secrets (e.g., third-party API keys).
-   **Enable MFA** for admin users in Cognito (Post-MVP).
-   **Regularly rotate AWS credentials** for CLI users.

### 10.2. Cost Optimization

-   **Use DynamoDB On-Demand Pricing** for unpredictable workloads (MVP).
-   **Enable S3 Lifecycle Policies** to archive old lesson attachments (Post-MVP).
-   **Monitor AppSync query costs** via CloudWatch metrics.

### 10.3. Schema Management

-   **Version your GraphQL schema** in the `amplify/backend/api/<api-name>/schema.graphql` file.
-   **Use `amplify update api`** to modify the schema incrementally.
-   **Test schema changes in `dev` environment** before deploying to `prod`.

---

## 11. Cross-References

-   **→ [GRAPHQL_SCHEMA.md](../database/GRAPHQL_SCHEMA.md):** Full GraphQL schema definition for AppSync.
-   **→ [DYNAMODB_SCHEMA.md](../database/DYNAMODB_SCHEMA.md):** DynamoDB table design and access patterns.
-   **→ [SECURITY.md](SECURITY.md):** Authentication and authorization details with Cognito.
-   **→ [DEPLOYMENT_GUIDE.md](../deployment/DEPLOYMENT_GUIDE.md):** Comprehensive deployment strategies.

---

## 12. Resources

-   **Amplify Gen 1 Documentation:** https://docs.amplify.aws/gen1/
-   **Amplify CLI Reference:** https://docs.amplify.aws/cli/
-   **AppSync Documentation:** https://docs.aws.amazon.com/appsync/
-   **Cognito Documentation:** https://docs.aws.amazon.com/cognito/
-   **DynamoDB Best Practices:** https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html

---

**End of AWS Amplify Gen 1 Configuration Documentation**

