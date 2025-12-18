# Руководство по первоначальной настройке - Sunday School App

## Версия документа: 2.0
**Дата создания:** 11 ноября 2025  
**Последнее обновление:** 11 ноября 2025  
**Проект:** Sunday School App (Приложение для управления воскресной школой)  
**Технологии:** Next.js 16, TypeScript, AWS Amplify, AWS Cognito, AWS DynamoDB/RDS, AWS S3

---

## 1. Требования к системе

### 1.1. Минимальные требования

- **Node.js:** версия 20.x или выше
- **npm:** версия 10.x или выше (или `yarn`, `pnpm`)
- **Git:** для работы с репозиторием
- **Операционная система:** Windows 10+, macOS 10.15+, или Linux (Ubuntu 20.04+)

### 1.2. Рекомендуемые требования

- **Node.js:** версия 20.x LTS
- **npm:** версия 10.x или выше
- **Редактор кода:** VS Code с расширениями:
  - ESLint
  - Prettier
  - Prisma
  - TypeScript

### 1.3. Проверка версий

```bash
# Проверка версии Node.js
node --version
# Должно быть: v20.x.x или выше

# Проверка версии npm
npm --version
# Должно быть: 10.x.x или выше

# Проверка версии Git
git --version
```

---

## 2. Установка зависимостей

### 2.1. Клонирование репозитория

```bash
# Клонируйте репозиторий
git clone <repository-url>
cd sun_sch
```

### 2.2. Установка npm пакетов

```bash
# Установка всех зависимостей
npm install
```

**Основные зависимости, которые будут установлены:**

- **Next.js 16.0.1** - React фреймворк
- **React 19.2.0** - UI библиотека
- **TypeScript 5.x** - типизация
- **AWS Amplify** - Backend-as-a-Service
- **AWS Cognito** - аутентификация
- **AWS DynamoDB** - NoSQL база данных
- **AWS S3** - хранилище файлов
- **Zustand** - state management
- **Shadcn UI** - UI компоненты
- **Tailwind CSS 4** - стилизация
- **BlockNote** - rich text editor
- **Zod** - валидация схем

**Время установки:** 2-5 минут (зависит от скорости интернета)

### 2.3. Проверка установки

```bash
# Проверка, что все установлено корректно
npm list --depth=0
```

---

## 3. Настройка AWS и `.env.local`

### 3.1. Установка AWS CLI и Amplify CLI

```bash
# Установка AWS CLI (если еще не установлен)
# Windows: https://aws.amazon.com/cli/
# macOS: brew install awscli
# Linux: sudo apt-get install awscli

# Настройка AWS credentials
aws configure

# Установка AWS Amplify CLI
npm install -g @aws-amplify/cli

# Инициализация Amplify (будет создан amplify/ каталог)
amplify init
```

### 3.2. Инициализация AWS сервисов

```bash
# Добавление Authentication (Cognito)
amplify add auth

# Выбрать:
# - Default configuration
# - Email as username
# - No, I am done

# Добавление GraphQL API (AppSync + DynamoDB)
amplify add api

# Выбрать:
# - GraphQL
# - API name: sundayschoolapi
# - Authorization: Amazon Cognito User Pool
# - Edit schema: Yes

# Добавление Storage (S3)
amplify add storage

# Выбрать:
# - Content (Images, audio, video, etc.)
# - Bucket name: sundayschool-storage
# - Access: Auth users only
```

### 3.3. Создание файла `.env.local`

```bash
# Скопируйте шаблон
cp .env.example .env.local
```

### 3.4. Заполнение переменных окружения

После выполнения `amplify push`, Amplify автоматически создаст файл `.env.local` с необходимыми переменными. Или заполните вручную:

#### 3.4.1. AWS Configuration

```env
AWS_REGION="us-east-1"
NEXT_PUBLIC_AWS_REGION="us-east-1"
```

#### 3.4.2. AWS Cognito (генерируется автоматически)

```env
NEXT_PUBLIC_AWS_USER_POOL_ID="us-east-1_XXXXXXXXX"
NEXT_PUBLIC_AWS_USER_POOL_CLIENT_ID="your-client-id"
AWS_COGNITO_USER_POOL_ID="us-east-1_XXXXXXXXX"
```

**Важно:** Эти значения можно найти в `amplify/backend/amplify-meta.json` после `amplify push`

#### 3.4.3. AWS AppSync / GraphQL (генерируется автоматически)

```env
NEXT_PUBLIC_GRAPHQL_ENDPOINT="https://xxxxxxxxxx.appsync-api.us-east-1.amazonaws.com/graphql"
NEXT_PUBLIC_GRAPHQL_API_KEY="your-api-key"  # Опционально
```

#### 3.4.4. AWS S3 (генерируется автоматически)

```env
NEXT_PUBLIC_S3_BUCKET_NAME="sunday-school-storage"
AWS_S3_BUCKET_NAME="sunday-school-storage"
AWS_S3_REGION="us-east-1"
```

#### 3.4.5. Node Environment

```env
NODE_ENV="development"
```

### 3.3. Проверка `.env.local`

Убедитесь, что:
- ✅ Все переменные заполнены
- ✅ Нет лишних пробелов вокруг знака `=`
- ✅ Строки в кавычках (если содержат специальные символы)
- ✅ Файл сохранен как `.env.local` (не `.env.local.txt`)

**Важно:** Файл `.env.local` уже добавлен в `.gitignore` и не будет закоммичен в Git.

---

## 4. Инициализация базы данных и инфраструктуры

### 4.1. Настройка GraphQL Schema

#### 4.1.1. Создание GraphQL Schema

Создайте файл `amplify/backend/api/schema.graphql` с вашей схемой данных:

```graphql
type Lesson @model @auth(rules: [{ allow: owner }, { allow: groups, groups: ["teachers", "admins"] }]) {
  id: ID!
  title: String!
  academicYearId: ID!
  lessonDate: AWSDate!
  content: String
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}

type Pupil @model @auth(rules: [{ allow: groups, groups: ["teachers", "admins"] }]) {
  id: ID!
  firstName: String!
  lastName: String!
  gradeId: ID
  active: Boolean!
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}

# ... другие типы
```

#### 4.1.2. Компиляция GraphQL Schema

```bash
# Компиляция GraphQL schema
amplify api gql-compile
```

**Ожидаемый результат:**
```
GraphQL schema compiled successfully.
```

### 4.2. Применение изменений в AWS

#### 4.2.1. Push изменений в AWS

```bash
# Применение всех изменений (Cognito, AppSync, DynamoDB, S3)
amplify push
```

**Что происходит:**
1. Amplify анализирует изменения в `amplify/backend/`
2. Создает/обновляет Cognito User Pool
3. Создает/обновляет AppSync GraphQL API
4. Создает/обновляет DynamoDB таблицы на основе GraphQL schema
5. Создает/обновляет S3 bucket
6. Генерирует TypeScript типы для GraphQL операций

**Ожидаемый результат:**
```
✔ Successfully pulled backend environment dev from the cloud.

Current Environment: dev

| Category | Resource name        | Operation | Provider plugin   |
| -------- | ------------------- | --------- | ----------------- |
| Auth     | sundayschoolauth    | Create    | awscloudformation |
| Api      | sundayschoolapi     | Create    | awscloudformation |
| Storage  | sundayschoolstorage | Create    | awscloudformation |

✔ All resources are updated in the cloud
```

#### 4.2.2. Проверка статуса

```bash
# Просмотр статуса всех сервисов
amplify status
```

**Ожидаемый результат:**
```
Current Environment: dev

| Category | Resource name        | Operation | Provider plugin   |
| -------- | ------------------- | --------- | ----------------- |
| Auth     | sundayschoolauth    | No Change | awscloudformation |
| Api      | sundayschoolapi     | No Change | awscloudformation |
| Storage  | sundayschoolstorage | No Change | awscloudformation |
```

### 4.3. Проверка подключения к AWS сервисам

#### 4.3.1. AWS Console

1. Откройте [AWS Console](https://console.aws.amazon.com)
2. Проверьте созданные ресурсы:
   - **Cognito** → User Pools → ваш User Pool
   - **AppSync** → APIs → ваш GraphQL API
   - **DynamoDB** → Tables → ваши таблицы
   - **S3** → Buckets → ваш bucket

#### 4.3.2. AppSync Console (GraphQL Playground)

```bash
# Открыть AppSync Console в браузере
amplify console api
```

**Ожидаемый результат:**
- Откроется AppSync Console с GraphQL Playground
- Можно тестировать GraphQL queries и mutations
- Можно просматривать schema

#### 4.3.3. Тестовый запрос (опционально)

Создайте временный файл `test-api.ts`:

```typescript
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';

Amplify.configure({
  API: {
    GraphQL: {
      endpoint: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!,
      region: process.env.NEXT_PUBLIC_AWS_REGION!,
      defaultAuthMode: 'apiKey',
      apiKey: process.env.NEXT_PUBLIC_GRAPHQL_API_KEY!,
    },
  },
});

const client = generateClient<Schema>();

async function test() {
  try {
    const { data, errors } = await client.graphql({
      query: `query ListLessons {
        listLessons {
          items {
            id
            title
          }
        }
      }`,
    });
    
    if (errors) {
      console.error('❌ GraphQL errors:', errors);
    } else {
      console.log('✅ GraphQL API connection successful!', data);
    }
  } catch (error) {
    console.error('❌ API connection failed:', error);
  }
}

test();
```

Запустите:

```bash
npx tsx test-api.ts
```

---

## 5. Создание первого admin пользователя

### 5.1. Метод 1: Через AWS Cognito Console (рекомендуется)

1. Откройте [AWS Cognito Console](https://console.aws.amazon.com/cognito)
2. Выберите ваш User Pool
3. Перейдите в **Users** → **Create user**
4. Заполните поля:
   - **Email:** `admin@example.com`
   - **Temporary password:** `TempPassword123!` (временный пароль)
   - **Mark email address as verified:** ✅
   - **Send an invitation to this new user?** ❌ (опционально)

5. Нажмите **Create user**

6. Добавьте пользователя в группу **admins**:
   - Перейдите в **Groups** → **Create group**
   - **Group name:** `admins`
   - **Precedence:** `1`
   - Создайте группу
   - Вернитесь в **Users** → выберите пользователя → **Add to group** → выберите `admins`

7. Пользователь должен сменить пароль при первом входе

**⚠️ Внимание:** Пользователь получит временный пароль и должен будет его сменить при первом входе.

### 5.2. Метод 2: Через AWS CLI

```bash
# Создание пользователя
aws cognito-idp admin-create-user \
  --user-pool-id us-east-1_XXXXXXXXX \
  --username admin@example.com \
  --user-attributes Name=email,Value=admin@example.com Name=email_verified,Value=true \
  --temporary-password TempPassword123! \
  --message-action SUPPRESS

# Добавление в группу admins
aws cognito-idp admin-add-user-to-group \
  --user-pool-id us-east-1_XXXXXXXXX \
  --username admin@example.com \
  --group-name admins
```

### 5.3. Метод 3: Через Amplify CLI

```bash
# Создание пользователя через Amplify
amplify auth console

# Откроется Cognito Console в браузере
# Следуйте инструкциям из Метода 1
```

### 5.4. Создание групп пользователей

Создайте необходимые группы в Cognito:

```bash
# Создание группы teachers
aws cognito-idp create-group \
  --user-pool-id us-east-1_XXXXXXXXX \
  --group-name teachers \
  --precedence 2

# Создание группы admins
aws cognito-idp create-group \
  --user-pool-id us-east-1_XXXXXXXXX \
  --group-name admins \
  --precedence 1
```

**Учетные данные по умолчанию:**
- **Email:** `admin@example.com`
- **Temporary Password:** `TempPassword123!` (будет запрошена смена при первом входе)

**⚠️ ВАЖНО:** 
- Пользователь должен сменить временный пароль при первом входе
- После первого входа установите постоянный пароль

---

## 6. Запуск development сервера

### 6.1. Запуск Next.js dev сервера

```bash
npm run dev
```

**Ожидаемый результат:**
```
▲ Next.js 16.0.1
- Local:        http://localhost:3000
- Ready in xxxms
```

### 6.2. Проверка работы приложения

1. Откройте браузер: `http://localhost:3000`
2. Проверьте, что страница загружается без ошибок
3. Откройте DevTools (F12) и проверьте Console на наличие ошибок

### 6.3. Проверка TypeScript

```bash
# Проверка типов TypeScript
npx tsc --noEmit
```

**Ожидаемый результат:** Нет ошибок типизации

### 6.4. Проверка ESLint

```bash
# Проверка кода линтером
npm run lint
```

**Ожидаемый результат:** Нет критических ошибок

---

## 7. Troubleshooting (Решение проблем)

### 7.1. Проблемы с установкой зависимостей

**Проблема:** `npm install` завершается с ошибкой

**Решения:**
1. Очистите кеш npm:
   ```bash
   npm cache clean --force
   ```

2. Удалите `node_modules` и `package-lock.json`:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. Используйте другой менеджер пакетов:
   ```bash
   yarn install
   # или
   pnpm install
   ```

### 7.2. Проблемы с подключением к AWS сервисам

**Проблема:** `Error: Unable to connect to AWS services`

**Решения:**
1. Проверьте правильность AWS credentials: `aws configure list`
2. Убедитесь, что переменные окружения заполнены в `.env.local`
3. Проверьте, что AWS сервисы созданы: `amplify status`
4. Проверьте IAM права пользователя/роли
5. Проверьте регион AWS (должен совпадать во всех переменных)

**Проблема:** `Error: GraphQL API endpoint not found`

**Решение:** 
1. Убедитесь, что GraphQL API создан: `amplify status`
2. Проверьте `NEXT_PUBLIC_GRAPHQL_ENDPOINT` в `.env.local`
3. Примените изменения: `amplify push`

### 7.3. Проблемы с GraphQL Schema

**Проблема:** `Error: GraphQL schema compilation failed`

**Решения:**
1. Проверьте синтаксис GraphQL schema: `amplify api gql-compile`
2. Убедитесь, что schema файл существует: `amplify/backend/api/schema.graphql`
3. Проверьте ошибки компиляции в выводе команды
4. Убедитесь, что все типы правильно определены

**Проблема:** `Error: DynamoDB table not found`

**Решение:**
1. Убедитесь, что `amplify push` выполнен успешно
2. Проверьте DynamoDB таблицы в AWS Console
3. Проверьте, что GraphQL schema содержит `@model` директиву для типов

### 7.4. Проблемы с Amplify Data Client

**Проблема:** `Module not found: aws-amplify`

**Решение:**
```bash
npm install aws-amplify
```

**Проблема:** Типы GraphQL не генерируются

**Решение:**
```bash
# Генерация типов после изменений schema
amplify codegen

# Или при push
amplify push
# Выбрать: "Do you want to generate code for your newly created GraphQL API? Yes"
```

### 7.5. Проблемы с AWS Cognito

**Проблема:** `Error: User Pool not found`

**Решение:**
1. Убедитесь, что Cognito создан: `amplify status`
2. Проверьте `NEXT_PUBLIC_AWS_USER_POOL_ID` в `.env.local`
3. Примените изменения: `amplify push`

**Проблема:** `Error: Invalid credentials`

**Решение:**
1. Проверьте правильность User Pool ID и Client ID
2. Убедитесь, что Amplify Auth правильно инициализирован в коде
3. Проверьте, что пользователь существует в Cognito
4. Проверьте, что email подтвержден (если требуется)

### 7.6. Проблемы с портом 3000

**Проблема:** `Port 3000 is already in use`

**Решения:**
1. Остановите другой процесс на порту 3000:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   
   # Linux/macOS
   lsof -ti:3000 | xargs kill -9
   ```

2. Используйте другой порт:
   ```bash
   PORT=3001 npm run dev
   ```

### 7.7. Проблемы с TypeScript

**Проблема:** Множество ошибок типизации

**Решения:**
1. Убедитесь, что используете правильную версию TypeScript:
   ```bash
   npm install typescript@^5 --save-dev
   ```

2. Проверьте `tsconfig.json` на корректность настроек

3. Перезапустите TypeScript сервер в VS Code:
   - `Ctrl+Shift+P` (или `Cmd+Shift+P` на macOS)
   - Выберите "TypeScript: Restart TS Server"

---

## 8. Следующие шаги

После успешной настройки:

1. ✅ Прочитайте `docs/prds/ARCHITECTURE.md` для понимания архитектуры
2. ✅ Изучите `docs/prds/IMPLEMENTATION_PLAN.md` для плана разработки
3. ✅ Ознакомьтесь с `docs/prds/UI_UX_SPECIFICATION.md` для дизайн-системы
4. ✅ Начните разработку согласно плану реализации

---

## 9. Полезные команды

### 9.1. AWS Amplify команды

```bash
# Инициализация проекта
amplify init

# Добавление сервисов
amplify add api      # GraphQL API
amplify add auth     # Cognito
amplify add storage  # S3

# Компиляция GraphQL schema
amplify api gql-compile

# Применение изменений в AWS
amplify push

# Публикация приложения
amplify publish

# Просмотр статуса
amplify status

# Открыть AWS Console
amplify console      # Amplify Console
amplify console api  # AppSync Console
amplify console auth # Cognito Console
amplify console storage # S3 Console

# Генерация TypeScript типов
amplify codegen

# Удаление сервисов
amplify remove <service>

# Удаление всего проекта (⚠️ осторожно!)
amplify delete
```

### 9.2. AWS CLI команды (полезные)

```bash
# Просмотр DynamoDB таблиц
aws dynamodb list-tables

# Просмотр Cognito User Pools
aws cognito-idp list-user-pools --max-results 10

# Создание пользователя в Cognito
aws cognito-idp admin-create-user --user-pool-id <pool-id> --username <email>

# Просмотр AppSync APIs
aws appsync list-graphql-apis
```

### 9.2. Next.js команды

```bash
# Development сервер
npm run dev

# Production build
npm run build

# Запуск production сервера
npm run start

# Проверка линтера
npm run lint
```

### 9.3. TypeScript команды

```bash
# Проверка типов без компиляции
npx tsc --noEmit

# Компиляция TypeScript
npx tsc
```

---

## 10. Контакты и поддержка

Если возникли проблемы:

1. Проверьте документацию в папке `docs/`
2. Изучите `docs/secure_data.md` для проверки credentials
3. Обратитесь к разработчику проекта

---

**Последнее обновление:** 11 ноября 2025  
**Версия документа:** 2.0

