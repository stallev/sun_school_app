# Связь между AWS Cognito User Pool и таблицей User в DynamoDB

## Document Version: 1.0
**Creation Date:** 30 December 2025  
**Last Update:** 30 December 2025  
**Project:** Sunday School App  
**Technologies:** AWS Cognito User Pools, AWS DynamoDB, AWS AppSync, AWS Amplify Gen 1

---

## 1. Обзор

В приложении Sunday School App данные пользователей (преподавателей и администраторов) хранятся в двух местах:

1. **AWS Cognito User Pool** — основные данные аутентификации (email, password, группы)
2. **AWS DynamoDB (таблица User)** — метаданные пользователей (имя, роль, фото, активность)

Связь между ними осуществляется через поле `id` в таблице User, которое должно совпадать с `sub` (subject) из JWT токена Cognito.

---

## 2. Архитектура хранения данных пользователей

### 2.1. Разделение данных

**AWS Cognito User Pool хранит:**
- Email (username для входа)
- Password (хешированный)
- User attributes (name, email)
- Cognito Groups (TEACHER, ADMIN, SUPERADMIN)
- JWT токены (ID Token, Access Token, Refresh Token)
- Статус пользователя (CONFIRMED, FORCE_CHANGE_PASSWORD, etc.)
- Email verification status

**DynamoDB таблица User хранит:**
- `id` (String) — Cognito sub (уникальный идентификатор, связь с Cognito)
- `email` (String) — Email адрес (копия из Cognito для удобства)
- `name` (String) — Полное имя пользователя
- `role` (String) — Роль: TEACHER, ADMIN, SUPERADMIN
- `photo` (String, nullable) — S3 URL фото
- `active` (Boolean) — Активен ли пользователь
- `createdAt` (AWSDateTime) — Дата создания
- `updatedAt` (AWSDateTime) — Дата обновления
- Связи с другими таблицами (UserGrade, Lesson, UserFamily)

### 2.2. Связь между системами

**Ключевое поле связи:** `User.id` = `Cognito User.sub`

- При создании пользователя в Cognito генерируется уникальный `sub` (subject)
- Этот `sub` используется как `id` при создании записи в DynamoDB
- При аутентификации JWT токен содержит `sub`, который используется для поиска пользователя в DynamoDB

**Схема связи:**

```
┌─────────────────────────────────┐
│   AWS Cognito User Pool         │
│                                 │
│   User Attributes:              │
│   - sub: "abc123..."            │
│   - email: "teacher@church.com"│
│   - name: "Иванова М.В."        │
│   - cognito:groups: ["TEACHER"] │
│                                 │
└──────────────┬──────────────────┘
               │
               │ id = sub
               │
               ▼
┌─────────────────────────────────┐
│   DynamoDB Table: User          │
│                                 │
│   Record:                        │
│   - id: "abc123..." (PK)        │
│   - email: "teacher@church.com"│
│   - name: "Иванова М.В."        │
│   - role: "TEACHER"             │
│   - active: true                │
│   - createdAt: "2024-01-01..."  │
│                                 │
└─────────────────────────────────┘
```

### 2.3. Почему два хранилища?

**Cognito User Pool:**
- Оптимизирован для аутентификации и авторизации
- Управление паролями, MFA, email verification
- Выдача JWT токенов
- Интеграция с AWS IAM и AppSync

**DynamoDB:**
- Гибкая схема для метаданных
- Связи с другими сущностями (UserGrade, Lesson)
- Индексы для быстрого поиска (по email, по роли)
- Интеграция с GraphQL API через AppSync

---

## 3. Процесс создания пользователя

### 3.1. Текущий процесс (только через Admin)

**В MVP приложения нет публичной регистрации.** Все пользователи создаются администратором через админ-панель.

**Процесс создания преподавателя (Server Action `createTeacher`):**

```typescript
'use server';

export async function createTeacher(input: CreateTeacherInput) {
  try {
    // Шаг 1: Создание пользователя в Cognito
    const cognitoUser = await adminCreateUser({
      userPoolId: process.env.COGNITO_USER_POOL_ID!,
      username: input.email,
      userAttributes: [
        { Name: 'email', Value: input.email },
        { Name: 'name', Value: input.name },
      ],
      temporaryPassword: generateTempPassword(),
    });
    
    // Шаг 2: Добавление в группу TEACHER в Cognito
    await adminAddUserToGroup({
      userPoolId: process.env.COGNITO_USER_POOL_ID!,
      username: input.email,
      groupName: 'TEACHER',
    });
    
    // Шаг 3: Создание метаданных в DynamoDB
    const user = await amplifyData.create('User', {
      id: cognitoUser.User.Username, // Cognito sub используется как id
      email: input.email,
      name: input.name,
      role: 'TEACHER',
      photo: null,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    // Шаг 4: Назначение на группы (если выбраны)
    if (input.gradeIds && input.gradeIds.length > 0) {
      await Promise.all(
        input.gradeIds.map(gradeId =>
          amplifyData.create('UserGrade', {
            userId: user.id,
            gradeId,
            assignedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          })
        )
      );
    }
    
    return { success: true, data: user };
  } catch (error) {
    console.error('Error creating teacher:', error);
    return { success: false, error: 'Ошибка при создании преподавателя' };
  }
}
```

**Последовательность операций:**

1. **Cognito:** `adminCreateUser` — создает пользователя в Cognito User Pool
2. **Cognito:** `adminAddUserToGroup` — добавляет пользователя в группу (TEACHER/ADMIN)
3. **DynamoDB:** `amplifyData.create('User')` — создает запись в таблице User
4. **DynamoDB:** `amplifyData.create('UserGrade')` — создает связи с группами (если выбраны)

### 3.2. Проблема: отсутствие транзакций

**Важно:** AWS не предоставляет распределенные транзакции между Cognito и DynamoDB. Это означает:

- Если создание в Cognito успешно, но создание в DynamoDB не удалось → пользователь в Cognito без записи в DynamoDB
- Если создание в Cognito не удалось → процесс останавливается, DynamoDB не создается
- Если создание в DynamoDB не удалось после успешного создания в Cognito → требуется ручная очистка

**Рекомендация:** В будущем можно добавить:
- Retry логику для создания в DynamoDB
- Обработку ошибок с откатом (удаление из Cognito, если DynamoDB не создался)
- Lambda функцию для синхронизации (Post-Confirmation trigger)

### 3.3. Создание администратора

Процесс аналогичен созданию преподавателя, но:
- Группа: `ADMIN` или `SUPERADMIN`
- Роль в DynamoDB: `ADMIN` или `SUPERADMIN`
- Обычно не назначается на группы (Admin имеет доступ ко всем группам)

---

## 4. Причины рассинхронизации данных

### 4.1. Пользователи в Cognito без записей в DynamoDB

**Сценарии возникновения:**

1. **Ошибка при создании записи в DynamoDB:**
   - Сетевая ошибка при вызове AppSync
   - Ошибка валидации данных (некорректный формат)
   - Ошибка прав доступа (IAM permissions)
   - Ошибка GraphQL схемы

2. **Ручное создание пользователя в Cognito:**
   - Администратор создал пользователя через AWS Console
   - Пользователь был создан через AWS CLI
   - Пользователь был создан через другой скрипт/инструмент

3. **Неполный процесс создания:**
   - Server Action был прерван после создания в Cognito
   - Ошибка в коде между шагами 1-2 и шагом 3

**Как обнаружить:**
```bash
# Получить список пользователей из Cognito
aws cognito-idp list-users \
  --user-pool-id us-east-1_FORzY4ey4 \
  --region us-east-1 \
  --query "Users[*].{Username:Username,Email:Attributes[?Name=='email'].Value|[0],Sub:Attributes[?Name=='sub'].Value|[0]}" \
  --output table

# Получить список записей из DynamoDB
aws dynamodb scan \
  --table-name User-2ito3uqzjbdcbonnabmm3io6x4-dev \
  --region us-east-1 \
  --projection-expression "id,email" \
  --output table

# Сравнить списки и найти пользователей в Cognito, которых нет в DynamoDB
```

### 4.2. Записи в DynamoDB без пользователей в Cognito

**Сценарии возникновения:**

1. **Использование seed скрипта:**
   - Скрипт `seed-db-cli.ts` создает записи **только в DynamoDB**
   - Не создает пользователей в Cognito
   - Используется для тестовых данных

2. **Удаление пользователя из Cognito:**
   - Пользователь был удален из Cognito через AWS Console
   - Запись в DynamoDB осталась (мягкое удаление через `active = false`)

3. **Ошибка при создании в Cognito:**
   - Создание в DynamoDB произошло до создания в Cognito
   - Создание в Cognito не удалось, но DynamoDB уже создан

**Как обнаружить:**
```bash
# Получить все записи из DynamoDB
aws dynamodb scan \
  --table-name User-2ito3uqzjbdcbonnabmm3io6x4-dev \
  --region us-east-1 \
  --projection-expression "id,email" \
  --output json > dynamodb-users.json

# Для каждой записи проверить существование в Cognito
aws cognito-idp admin-get-user \
  --user-pool-id us-east-1_FORzY4ey4 \
  --username <email> \
  --region us-east-1
```

### 4.3. Несоответствие данных

**Сценарии:**

1. **Email не совпадает:**
   - Email в Cognito изменен, но не обновлен в DynamoDB
   - Ошибка при копировании email при создании

2. **Имя не совпадает:**
   - Имя в Cognito изменено, но не обновлено в DynamoDB
   - Разные форматы имени (полное vs сокращенное)

3. **Роль не соответствует группе:**
   - Пользователь в группе TEACHER, но role в DynamoDB = ADMIN
   - Пользователь добавлен в несколько групп, но role не обновлен

---

## 5. Регистрация через клиентский интерфейс

### 5.1. Текущее состояние

**В MVP приложения нет публичной регистрации.**

- Все пользователи создаются администратором через админ-панель
- Нет страницы `/register` или `/signup`
- Нет Server Action для публичной регистрации

**Причины:**
- Контроль доступа (только авторизованные пользователи)
- Управление ролями (Admin назначает роли)
- Безопасность (избежание спам-регистраций)

### 5.2. Возможность добавления в будущем

**Если потребуется публичная регистрация (Post-MVP):**

**Вариант 1: Регистрация с подтверждением email**
```typescript
'use server';

export async function registerUser(input: SignUpInput) {
  try {
    // 1. Sign up в Cognito (требует подтверждения email)
    const { userId } = await signUp({
      username: input.email,
      password: input.password,
      options: {
        userAttributes: {
          email: input.email,
          name: input.name,
        },
      },
    });

    // 2. Создание записи в DynamoDB (после подтверждения email)
    // Это должно быть в Post-Confirmation Lambda trigger
    const user = await amplifyData.create('User', {
      id: userId, // Cognito sub
      email: input.email,
      name: input.name,
      role: 'TEACHER', // По умолчанию TEACHER
      active: true,
    });

    return { success: true, message: 'Check your email for verification code' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

**Вариант 2: Регистрация с назначением роли Admin**
- Пользователь регистрируется
- Admin подтверждает и назначает роль
- Пользователь добавляется в соответствующую группу Cognito

### 5.3. Требования для реализации

**Если добавить публичную регистрацию, потребуется:**

1. **Lambda функция (Post-Confirmation trigger):**
   - Автоматически создает запись в DynamoDB после подтверждения email
   - Добавляет пользователя в группу TEACHER по умолчанию
   - Обрабатывает ошибки и логирует

2. **Страница регистрации:**
   - Форма с полями: имя, email, пароль, подтверждение пароля
   - Валидация на клиенте и сервере
   - Интеграция с Server Action `registerUser`

3. **Обработка ошибок:**
   - Email уже существует
   - Пароль не соответствует политике
   - Ошибка создания в DynamoDB

4. **Безопасность:**
   - Rate limiting для предотвращения спама
   - CAPTCHA (опционально)
   - Email verification обязательна

---

## 6. AWS CLI команды для проверки данных

### 6.1. Получение списка пользователей из Cognito

**Dev environment:**
```bash
# Получить всех пользователей с их атрибутами
aws cognito-idp list-users \
  --user-pool-id us-east-1_FORzY4ey4 \
  --region us-east-1 \
  --query "Users[*].{Username:Username,Email:Attributes[?Name=='email'].Value|[0],Sub:Attributes[?Name=='sub'].Value|[0],Name:Attributes[?Name=='name'].Value|[0],Status:UserStatus}" \
  --output table

# Получить только email и sub
aws cognito-idp list-users \
  --user-pool-id us-east-1_FORzY4ey4 \
  --region us-east-1 \
  --query "Users[*].{Email:Attributes[?Name=='email'].Value|[0],Sub:Attributes[?Name=='sub'].Value|[0]}" \
  --output json > cognito-users.json

# Получить группы пользователя
aws cognito-idp admin-list-groups-for-user \
  --user-pool-id us-east-1_FORzY4ey4 \
  --username <email> \
  --region us-east-1 \
  --output table
```

**Prod environment:**
```bash
aws cognito-idp list-users \
  --user-pool-id eu-west-1_iQ7XIxudA \
  --region eu-west-1 \
  --query "Users[*].{Username:Username,Email:Attributes[?Name=='email'].Value|[0],Sub:Attributes[?Name=='sub'].Value|[0],Name:Attributes[?Name=='name'].Value|[0],Status:UserStatus}" \
  --output table
```

### 6.2. Получение записей из DynamoDB

**Шаг 1: Определить имя таблицы**

Таблица User в DynamoDB имеет паттерн имени: `User-{apiId}-{env}`

**Метод 1: Из amplify-meta.json**
```bash
# Linux/Mac
cat amplify/backend/amplify-meta.json | jq '.api.sunsch.GraphQLAPIIdOutput'

# Windows PowerShell
(Get-Content amplify/backend/amplify-meta.json | ConvertFrom-Json).api.sunsch.GraphQLAPIIdOutput
```

**Метод 2: Список всех таблиц**
```bash
aws dynamodb list-tables \
  --region us-east-1 \
  --query "TableNames[?starts_with(@, 'User-')]" \
  --output table
```

**Метод 3: Из CloudFormation**
```bash
aws cloudformation describe-stacks \
  --stack-name amplify-sunsch-dev-f567d \
  --region us-east-1 \
  --query "Stacks[0].Outputs[?OutputKey=='UserTableName'].OutputValue" \
  --output text
```

**Шаг 2: Получить все записи из таблицы User**

```bash
# Dev environment
aws dynamodb scan \
  --table-name User-2ito3uqzjbdcbonnabmm3io6x4-dev \
  --region us-east-1 \
  --projection-expression "id,email,name,role,active,createdAt" \
  --output json > dynamodb-users.json

# Или в табличном формате (первые 10 записей)
aws dynamodb scan \
  --table-name User-2ito3uqzjbdcbonnabmm3io6x4-dev \
  --region us-east-1 \
  --projection-expression "id,email,name,role,active" \
  --limit 10 \
  --output table
```

**Prod environment:**
```bash
# Сначала определите имя таблицы для prod
aws dynamodb list-tables \
  --region eu-west-1 \
  --query "TableNames[?starts_with(@, 'User-')]" \
  --output text

# Затем получите записи
aws dynamodb scan \
  --table-name <PROD_TABLE_NAME> \
  --region eu-west-1 \
  --projection-expression "id,email,name,role,active" \
  --output json > dynamodb-users-prod.json
```

### 6.3. Сравнение и выявление рассинхронизации

**Скрипт для сравнения (Bash):**

```bash
#!/bin/bash

# Сравнение пользователей Cognito и DynamoDB
# Usage: ./compare-users.sh <USER_POOL_ID> <TABLE_NAME> <REGION>

USER_POOL_ID=$1
TABLE_NAME=$2
REGION=$3

echo "=========================================="
echo "Сравнение пользователей Cognito и DynamoDB"
echo "User Pool ID: $USER_POOL_ID"
echo "Table Name: $TABLE_NAME"
echo "Region: $REGION"
echo "=========================================="
echo ""

# Получить пользователей из Cognito
echo "📋 Получение пользователей из Cognito..."
aws cognito-idp list-users \
  --user-pool-id "$USER_POOL_ID" \
  --region "$REGION" \
  --query "Users[*].{Email:Attributes[?Name=='email'].Value|[0],Sub:Attributes[?Name=='sub'].Value|[0]}" \
  --output json > /tmp/cognito-users.json

COGNITO_COUNT=$(jq '. | length' /tmp/cognito-users.json)
echo "   Найдено пользователей в Cognito: $COGNITO_COUNT"
echo ""

# Получить записи из DynamoDB
echo "📋 Получение записей из DynamoDB..."
aws dynamodb scan \
  --table-name "$TABLE_NAME" \
  --region "$REGION" \
  --projection-expression "id,email" \
  --output json > /tmp/dynamodb-users.json

DYNAMODB_COUNT=$(jq '.Items | length' /tmp/dynamodb-users.json)
echo "   Найдено записей в DynamoDB: $DYNAMODB_COUNT"
echo ""

# Найти пользователей в Cognito без записей в DynamoDB
echo "🔍 Поиск пользователей в Cognito без записей в DynamoDB..."
jq -r '.[] | .Sub' /tmp/cognito-users.json | while read sub; do
  email=$(jq -r ".[] | select(.Sub == \"$sub\") | .Email" /tmp/cognito-users.json)
  exists=$(jq -r ".Items[] | select(.id.S == \"$sub\") | .id.S" /tmp/dynamodb-users.json)
  
  if [ -z "$exists" ]; then
    echo "   ⚠️  Пользователь в Cognito без записи в DynamoDB:"
    echo "      Email: $email"
    echo "      Sub: $sub"
    echo ""
  fi
done

# Найти записи в DynamoDB без пользователей в Cognito
echo "🔍 Поиск записей в DynamoDB без пользователей в Cognito..."
jq -r '.Items[] | .id.S' /tmp/dynamodb-users.json | while read id; do
  email=$(jq -r ".Items[] | select(.id.S == \"$id\") | .email.S" /tmp/dynamodb-users.json)
  exists=$(jq -r ".[] | select(.Sub == \"$id\") | .Sub" /tmp/cognito-users.json)
  
  if [ -z "$exists" ]; then
    echo "   ⚠️  Запись в DynamoDB без пользователя в Cognito:"
    echo "      Email: $email"
    echo "      ID: $id"
    echo ""
  fi
done

echo "=========================================="
echo "Сравнение завершено"
echo "=========================================="

# Очистка временных файлов
rm /tmp/cognito-users.json /tmp/dynamodb-users.json
```

**PowerShell скрипт:**

```powershell
# Сравнение пользователей Cognito и DynamoDB
# Usage: .\compare-users.ps1 -UserPoolId <USER_POOL_ID> -TableName <TABLE_NAME> -Region <REGION>

param(
    [Parameter(Mandatory=$true)]
    [string]$UserPoolId,
    
    [Parameter(Mandatory=$true)]
    [string]$TableName,
    
    [Parameter(Mandatory=$true)]
    [string]$Region
)

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Сравнение пользователей Cognito и DynamoDB" -ForegroundColor Cyan
Write-Host "User Pool ID: $UserPoolId" -ForegroundColor Cyan
Write-Host "Table Name: $TableName" -ForegroundColor Cyan
Write-Host "Region: $Region" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Получить пользователей из Cognito
Write-Host "📋 Получение пользователей из Cognito..." -ForegroundColor Yellow
$cognitoUsers = aws cognito-idp list-users `
    --user-pool-id $UserPoolId `
    --region $Region `
    --query "Users[*].{Email:Attributes[?Name=='email'].Value|[0],Sub:Attributes[?Name=='sub'].Value|[0]}" `
    --output json | ConvertFrom-Json

Write-Host "   Найдено пользователей в Cognito: $($cognitoUsers.Count)" -ForegroundColor Green
Write-Host ""

# Получить записи из DynamoDB
Write-Host "📋 Получение записей из DynamoDB..." -ForegroundColor Yellow
$dynamodbUsers = aws dynamodb scan `
    --table-name $TableName `
    --region $Region `
    --projection-expression "id,email" `
    --output json | ConvertFrom-Json

Write-Host "   Найдено записей в DynamoDB: $($dynamodbUsers.Items.Count)" -ForegroundColor Green
Write-Host ""

# Найти пользователей в Cognito без записей в DynamoDB
Write-Host "🔍 Поиск пользователей в Cognito без записей в DynamoDB..." -ForegroundColor Yellow
$cognitoSubs = $cognitoUsers | ForEach-Object { $_.Sub }
$dynamodbIds = $dynamodbUsers.Items | ForEach-Object { $_.id.S }

foreach ($user in $cognitoUsers) {
    if ($dynamodbIds -notcontains $user.Sub) {
        Write-Host "   ⚠️  Пользователь в Cognito без записи в DynamoDB:" -ForegroundColor Red
        Write-Host "      Email: $($user.Email)" -ForegroundColor Red
        Write-Host "      Sub: $($user.Sub)" -ForegroundColor Red
        Write-Host ""
    }
}

# Найти записи в DynamoDB без пользователей в Cognito
Write-Host "🔍 Поиск записей в DynamoDB без пользователей в Cognito..." -ForegroundColor Yellow
foreach ($item in $dynamodbUsers.Items) {
    $id = $item.id.S
    if ($cognitoSubs -notcontains $id) {
        $email = $item.email.S
        Write-Host "   ⚠️  Запись в DynamoDB без пользователя в Cognito:" -ForegroundColor Red
        Write-Host "      Email: $email" -ForegroundColor Red
        Write-Host "      ID: $id" -ForegroundColor Red
        Write-Host ""
    }
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Сравнение завершено" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
```

### 6.4. Получение детальной информации о пользователе

**Из Cognito:**
```bash
# Получить информацию о пользователе
aws cognito-idp admin-get-user \
  --user-pool-id us-east-1_FORzY4ey4 \
  --username <email> \
  --region us-east-1 \
  --output json

# Получить группы пользователя
aws cognito-idp admin-list-groups-for-user \
  --user-pool-id us-east-1_FORzY4ey4 \
  --username <email> \
  --region us-east-1 \
  --output table
```

**Из DynamoDB:**
```bash
# Получить запись по id (Cognito sub)
aws dynamodb get-item \
  --table-name User-2ito3uqzjbdcbonnabmm3io6x4-dev \
  --region us-east-1 \
  --key '{"id": {"S": "<cognito-sub>"}}' \
  --output json

# Получить запись по email (через GSI)
aws dynamodb query \
  --table-name User-2ito3uqzjbdcbonnabmm3io6x4-dev \
  --region us-east-1 \
  --index-name email-index \
  --key-condition-expression "email = :email" \
  --expression-attribute-values '{":email": {"S": "<email>"}}' \
  --output json
```

---

## 7. Рекомендации и best practices

### 7.1. Как избежать рассинхронизации

**1. Использовать правильный порядок операций:**
- Всегда создавать пользователя в Cognito первым
- Использовать `sub` из Cognito как `id` в DynamoDB
- Обрабатывать ошибки и откатывать изменения при необходимости

**2. Добавить retry логику:**
```typescript
async function createUserWithRetry(input: CreateUserInput, maxRetries = 3) {
  let lastError: Error | null = null;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      // Создание в Cognito
      const cognitoUser = await adminCreateUser({...});
      
      // Создание в DynamoDB с retry
      const user = await amplifyData.create('User', {
        id: cognitoUser.User.Username,
        ...
      });
      
      return { success: true, data: user };
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
    }
  }
  
  // Если не удалось создать в DynamoDB, удалить из Cognito
  if (cognitoUser) {
    await adminDeleteUser({
      userPoolId: process.env.COGNITO_USER_POOL_ID!,
      username: input.email,
    });
  }
  
  throw lastError;
}
```

**3. Использовать Lambda Post-Confirmation trigger:**
- Автоматически создает запись в DynamoDB после подтверждения email
- Гарантирует синхронизацию
- Обрабатывает ошибки и логирует

**4. Не использовать seed скрипт для production:**
- Seed скрипт создает записи только в DynamoDB
- Использовать только для тестовых данных в dev
- Для production создавать пользователей через админ-панель

### 7.2. Процедуры синхронизации

**Если обнаружена рассинхронизация:**

**Сценарий 1: Пользователь в Cognito без записи в DynamoDB**

**Решение:** Создать запись в DynamoDB вручную или через скрипт:

```typescript
// Скрипт для синхронизации
async function syncCognitoToDynamoDB(cognitoEmail: string) {
  // 1. Получить информацию из Cognito
  const cognitoUser = await adminGetUser({
    userPoolId: process.env.COGNITO_USER_POOL_ID!,
    username: cognitoEmail,
  });
  
  // 2. Получить группы пользователя
  const groups = await adminListGroupsForUser({
    userPoolId: process.env.COGNITO_USER_POOL_ID!,
    username: cognitoEmail,
  });
  
  // 3. Определить роль из групп
  const role = groups.Groups?.some(g => g.GroupName === 'ADMIN' || g.GroupName === 'SUPERADMIN')
    ? 'ADMIN'
    : 'TEACHER';
  
  // 4. Создать запись в DynamoDB
  const user = await amplifyData.create('User', {
    id: cognitoUser.User.Username, // Cognito sub
    email: cognitoUser.User.Attributes?.find(a => a.Name === 'email')?.Value || cognitoEmail,
    name: cognitoUser.User.Attributes?.find(a => a.Name === 'name')?.Value || 'Unknown',
    role,
    active: cognitoUser.User.UserStatus === 'CONFIRMED',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  
  return user;
}
```

**Сценарий 2: Запись в DynamoDB без пользователя в Cognito**

**Решение:** 
- Если это seed данные → оставить как есть (для тестирования)
- Если это реальный пользователь → создать в Cognito или удалить из DynamoDB

```typescript
// Создать пользователя в Cognito на основе записи DynamoDB
async function syncDynamoDBToCognito(userId: string, email: string, name: string, role: string) {
  // 1. Создать пользователя в Cognito
  const cognitoUser = await adminCreateUser({
    userPoolId: process.env.COGNITO_USER_POOL_ID!,
    username: email,
    userAttributes: [
      { Name: 'email', Value: email },
      { Name: 'name', Value: name },
    ],
    temporaryPassword: generateTempPassword(),
  });
  
  // 2. Добавить в соответствующую группу
  const groupName = role === 'ADMIN' || role === 'SUPERADMIN' ? 'ADMIN' : 'TEACHER';
  await adminAddUserToGroup({
    userPoolId: process.env.COGNITO_USER_POOL_ID!,
    username: email,
    groupName,
  });
  
  // 3. Обновить id в DynamoDB (если отличается)
  if (cognitoUser.User.Username !== userId) {
    // Создать новую запись с правильным id
    await amplifyData.create('User', {
      id: cognitoUser.User.Username,
      email,
      name,
      role,
      active: true,
    });
    
    // Удалить старую запись
    await amplifyData.delete('User', { id: userId });
  }
}
```

### 7.3. Мониторинг и алерты

**Рекомендуется настроить:**

1. **CloudWatch метрики:**
   - Количество пользователей в Cognito
   - Количество записей в DynamoDB
   - Разница между ними (расхождение)

2. **Lambda функция для периодической проверки:**
   - Запускается по расписанию (например, раз в день)
   - Сравнивает пользователей Cognito и DynamoDB
   - Отправляет алерт при обнаружении рассинхронизации

3. **Логирование операций:**
   - Логировать все операции создания пользователей
   - Логировать ошибки при создании
   - Логировать попытки синхронизации

**Пример CloudWatch Alarm:**

```bash
# Создать метрику расхождения
aws cloudwatch put-metric-alarm \
  --alarm-name cognito-dynamodb-sync-alert \
  --alarm-description "Alert when Cognito and DynamoDB users are out of sync" \
  --metric-name UserSyncDifference \
  --namespace Custom/SundaySchool \
  --statistic Average \
  --period 3600 \
  --evaluation-periods 1 \
  --threshold 0 \
  --comparison-operator GreaterThanThreshold \
  --alarm-actions arn:aws:sns:us-east-1:ACCOUNT_ID:alerts-topic
```

---

## 8. Часто задаваемые вопросы

### 8.1. Можно ли регистрировать нового admin или teacher через клиентский интерфейс?

**Текущее состояние:** Нет, в MVP нет публичной регистрации.

**Как это работает сейчас:**
- Только администратор может создавать пользователей через админ-панель
- Администратор заполняет форму: имя, email, выбор групп
- Система создает пользователя в Cognito и DynamoDB
- Пользователь получает временный пароль (через email в будущем)

**В какие таблицы добавляются данные:**
1. **Cognito User Pool** — пользователь с email, name, временным паролем
2. **Cognito Group** — пользователь добавляется в группу (TEACHER/ADMIN)
3. **DynamoDB: User** — метаданные (id, email, name, role, active)
4. **DynamoDB: UserGrade** — связи с группами (если преподаватель назначен на группы)

### 8.2. Что происходит при использовании seed скрипта?

**Seed скрипт (`seed-db-cli.ts`):**
- Создает записи **только в DynamoDB**
- **Не создает** пользователей в Cognito
- Используется для тестовых данных
- Может создавать записи с произвольными `id` (не реальные Cognito sub)

**Важно:** Seed данные не могут использоваться для входа в систему, так как нет соответствующего пользователя в Cognito.

### 8.3. Как исправить рассинхронизацию?

**Если пользователь в Cognito без записи в DynamoDB:**
1. Получить информацию из Cognito (email, name, groups)
2. Создать запись в DynamoDB с `id = Cognito sub`
3. Установить правильную роль на основе групп

**Если запись в DynamoDB без пользователя в Cognito:**
1. Если это seed данные → оставить как есть
2. Если это реальный пользователь → создать в Cognito или удалить из DynamoDB

### 8.4. Можно ли использовать один Cognito sub для нескольких записей в DynamoDB?

**Нет.** Поле `id` в таблице User является Primary Key и должно быть уникальным. Один Cognito sub должен соответствовать одной записи в DynamoDB.

### 8.5. Что делать, если email изменился в Cognito?

**Рекомендуется:**
1. Обновить email в Cognito через `adminUpdateUserAttributes`
2. Обновить email в DynamoDB через `amplifyData.update('User')`
3. Убедиться, что оба обновления успешны

**Или использовать транзакцию (если доступна):**
- Обновить в Cognito
- Обновить в DynamoDB в той же транзакции (если поддерживается)

---

## 9. Связанная документация

- [SECURITY.md](./SECURITY.md) — конфигурация Cognito и безопасность
- [AWS_AMPLIFY.md](./AWS_AMPLIFY.md) — настройка AWS Amplify
- [AWS_CLI_SCRIPTS.md](./AWS_CLI_SCRIPTS.md) — AWS CLI скрипты для управления
- [ERD.md](../database/ERD.md) — описание сущности User
- [DYNAMODB_SCHEMA.md](../database/DYNAMODB_SCHEMA.md) — схема таблицы User
- [USER_FLOW.md](../user_flows/USER_FLOW.md) — процесс создания пользователя
- [ADMIN_FLOWS.md](../user_flows/ADMIN_FLOWS.md) — административные процессы

---

## 10. Заключение

Связь между Cognito User Pool и таблицей User в DynamoDB является критически важной для работы приложения. Понимание механизмов синхронизации и причин рассинхронизации помогает поддерживать целостность данных и обеспечивать корректную работу системы.

**Ключевые моменты:**
- Пользователи создаются только через админ-панель (нет публичной регистрации)
- Связь осуществляется через `User.id` = `Cognito User.sub`
- Seed скрипт создает записи только в DynamoDB (не в Cognito)
- Рекомендуется использовать Lambda Post-Confirmation trigger для автоматической синхронизации
- Регулярная проверка синхронизации помогает выявить проблемы на ранней стадии

---

**Version:** 1.0  
**Last Updated:** 30 December 2025  
**Author:** AI Documentation Team

