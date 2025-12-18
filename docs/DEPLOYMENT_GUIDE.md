# Руководство по deployment - Sunday School App

## Версия документа: 2.0
**Дата создания:** 11 ноября 2025  
**Последнее обновление:** 11 ноября 2025  
**Проект:** Sunday School App (Приложение для управления воскресной школой)  
**Платформа:** AWS Amplify Hosting / AWS SAM (рекомендуется)  
**Технологии:** Next.js 16, AWS DynamoDB/RDS, AWS Cognito, AWS S3

---

## 1. Обзор

Данное руководство описывает процесс развертывания (deployment) приложения Sunday School App на AWS инфраструктуре. AWS Amplify Hosting и AWS SAM являются рекомендуемыми платформами, так как обеспечивают:

- Автоматическую оптимизацию Next.js
- Serverless архитектуру через Lambda Functions
- CDN для статических ресурсов через CloudFront
- Автоматические SSL сертификаты через AWS Certificate Manager
- Интеграцию с Git (автоматический деплой при push через Amplify)
- Масштабируемость и высокую доступность
- Интеграцию с другими AWS сервисами (Cognito, DynamoDB, S3)

---

## 2. Подготовка к deployment

### 2.1. Предварительные требования

Перед началом deployment убедитесь, что:

- ✅ Проект успешно собирается локально (`npm run build`)
- ✅ Все тесты пройдены
- ✅ Нет критических ошибок TypeScript (`npx tsc --noEmit`)
- ✅ Нет критических ошибок ESLint (`npm run lint`)
- ✅ AWS инфраструктура настроена (Cognito, DynamoDB/RDS, S3)
- ✅ GraphQL schema синхронизирована
- ✅ Все environment variables подготовлены

### 2.2. Финальная проверка

```bash
# 1. Проверка сборки
npm run build

# 2. Проверка типов
npx tsc --noEmit

# 3. Проверка линтера
npm run lint

# 4. Проверка GraphQL schema
amplify api gql-compile
```

**Ожидаемый результат:**
- ✅ Build успешно завершен
- ✅ Нет ошибок TypeScript
- ✅ Нет критических ошибок ESLint
- ✅ Все миграции применены

---

## 3. Deployment на AWS Amplify / AWS SAM

### 3.1. Подготовка AWS аккаунта

1. Создайте AWS аккаунт на [aws.amazon.com](https://aws.amazon.com)
2. Настройте IAM пользователя с необходимыми правами
3. Установите AWS CLI: `aws configure`
4. Установите AWS Amplify CLI: `npm install -g @aws-amplify/cli`

### 3.2. Инициализация Amplify проекта

#### 3.2.1. Через Amplify CLI

```bash
# Инициализация Amplify проекта
amplify init

# Следовать инструкциям:
# - Enter a name for the project: sun-sch
# - Initialize the project with the above configuration? Yes
# - Select the authentication method: AWS profile
# - Choose your default profile: [ваш профиль]
# - Select a region: us-east-1 (или ваш регион)
```

#### 3.2.2. Добавление сервисов

```bash
# Добавление GraphQL API (AppSync)
amplify add api

# Выбрать:
# - GraphQL
# - API name: sundayschoolapi
# - Authorization: Amazon Cognito User Pool
# - Edit schema: Yes (откроется schema.graphql)

# Добавление Authentication (Cognito)
amplify add auth

# Выбрать:
# - Default configuration
# - Email as username
# - No, I am done

# Добавление Storage (S3)
amplify add storage

# Выбрать:
# - Content (Images, audio, video, etc.)
# - Bucket name: sundayschool-storage
# - Access: Auth users only
```

### 3.3. Настройка проекта

#### 3.3.1. Build Configuration

В `amplify.yml` (создается автоматически):

```yaml
version: 1
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

#### 3.3.2. Node.js Version

В `package.json` или `.nvmrc`:
- **Node.js Version:** 20.x (LTS)

---

## 4. Настройка Environment Variables

### 4.1. Добавление переменных окружения

#### 4.1.1. Через AWS Amplify Console

1. Перейдите в **Amplify Console** → Ваш проект → **App settings** → **Environment variables**
2. Добавьте все переменные из `.env.local`:

#### 4.1.2. AWS Configuration Variables

```env
AWS_REGION=us-east-1
NEXT_PUBLIC_AWS_REGION=us-east-1
```

#### 4.1.3. AWS Cognito Variables

```env
NEXT_PUBLIC_AWS_USER_POOL_ID=us-east-1_XXXXXXXXX
NEXT_PUBLIC_AWS_USER_POOL_CLIENT_ID=your-client-id
AWS_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
```

**⚠️ ВАЖНО:** 
- Эти переменные генерируются автоматически при `amplify add auth`
- Можно найти в `amplify/backend/amplify-meta.json`

#### 4.1.4. AWS AppSync / GraphQL Variables

```env
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://xxxxxxxxxx.appsync-api.us-east-1.amazonaws.com/graphql
NEXT_PUBLIC_GRAPHQL_API_KEY=your-api-key
```

**⚠️ ВАЖНО:** 
- GraphQL endpoint генерируется автоматически при `amplify add api`
- API Key опционален, если используется Cognito авторизация

#### 4.1.5. AWS S3 Variables

```env
NEXT_PUBLIC_S3_BUCKET_NAME=sunday-school-storage
AWS_S3_BUCKET_NAME=sunday-school-storage
AWS_S3_REGION=us-east-1
```

#### 4.1.6. CloudFront Variables (опционально)

```env
NEXT_PUBLIC_CLOUDFRONT_URL=https://dxxxxxxxxxxxxx.cloudfront.net
```

#### 4.1.7. Node Environment

```env
NODE_ENV=production
```

### 4.2. Использование AWS Secrets Manager (рекомендуется)

Для чувствительных данных используйте AWS Secrets Manager:

```bash
# Создание secret
aws secretsmanager create-secret \
  --name sundayschool/production/database \
  --secret-string '{"username":"admin","password":"secret"}'

# В коде
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

const client = new SecretsManagerClient({ region: 'us-east-1' });
const command = new GetSecretValueCommand({ SecretId: 'sundayschool/production/database' });
const response = await client.send(command);
const secret = JSON.parse(response.SecretString);
```

### 4.3. Настройка окружений

В Amplify Console можно настроить разные переменные для:
- ✅ **Production** - для production deployment
- ✅ **Preview** - для preview deployments (pull requests)
- ✅ **Development** - для development окружения

---

## 5. GraphQL Schema и инфраструктура в production

### 5.1. Подготовка GraphQL Schema

Убедитесь, что GraphQL schema синхронизирована и протестирована локально:

```bash
# Проверка GraphQL schema
amplify api gql-compile

# Должно быть: "GraphQL schema compiled successfully"
```

### 5.2. Применение изменений в production

#### 5.2.1. Метод 1: Через Amplify CLI (рекомендуется)

```bash
# Push изменений в AWS
amplify push

# Следовать инструкциям:
# - Are you sure you want to continue? Yes
# - Do you want to generate code for your newly created GraphQL API? Yes
# - Choose the code generation language target: typescript
# - Enter the file name pattern of graphql queries, mutations and subscriptions: graphql/**/*.graphql
# - Do you want to generate/update all possible GraphQL operations? Yes
```

**Как это работает:**
1. `amplify push` - применяет изменения GraphQL schema к AppSync
2. Автоматически создает/обновляет DynamoDB таблицы
3. Генерирует TypeScript типы для GraphQL операций

**⚠️ ВАЖНО:** Убедитесь, что AWS credentials настроены правильно!

#### 5.2.2. Метод 2: Через Amplify Console (автоматический)

При push в Git репозиторий, Amplify автоматически:
1. Обнаруживает изменения в `amplify/backend/`
2. Компилирует GraphQL schema
3. Применяет изменения к AppSync и DynamoDB

#### 5.2.3. Метод 3: Через AWS SAM (если используется SAM)

```bash
# Сборка SAM приложения
sam build

# Деплой
sam deploy --guided

# При первом деплое SAM запросит параметры:
# - Stack Name: sundayschool-stack
# - AWS Region: us-east-1
# - Confirm changes before deploy: Yes
# - Allow SAM CLI IAM role creation: Yes
```

### 5.3. Проверка инфраструктуры

После deployment проверьте:

1. Откройте AWS Console → AppSync
2. Убедитесь, что GraphQL API создан и работает
3. Проверьте DynamoDB таблицы в AWS Console
4. Проверьте Cognito User Pool в AWS Console
5. Проверьте S3 bucket в AWS Console

---

## 6. Первый deployment

### 6.1. Запуск deployment

#### 6.1.1. Через AWS Amplify Console

1. Перейдите в [AWS Amplify Console](https://console.aws.amazon.com/amplify)
2. Нажмите "New app" → "Host web app"
3. Подключите Git репозиторий (GitHub, GitLab, Bitbucket)
4. Выберите ветку `main`
5. Нажмите "Save and deploy"

#### 6.1.2. Через Amplify CLI

```bash
# Публикация приложения
amplify publish

# Или только push инфраструктуры
amplify push
```

#### 6.1.3. Через Git Push (автоматический)

```bash
# Сделайте commit и push
git add .
git commit -m "Initial deployment"
git push origin main

# Amplify автоматически запустит deployment (если настроен)
```

### 6.2. Мониторинг deployment

В AWS Amplify Console:

1. Перейдите в **Deployments**
2. Откройте текущий deployment
3. Проверьте **Build logs** на наличие ошибок
4. Проверьте **App logs** для Server Actions/API Routes
5. Проверьте **CloudWatch Logs** для Lambda functions

### 6.3. Проверка после deployment

1. ✅ Откройте production URL (например, `https://main.xxxxxxxxxx.amplifyapp.com`)
2. ✅ Проверьте, что страница загружается
3. ✅ Проверьте консоль браузера (F12) на наличие ошибок
4. ✅ Проверьте Network tab на наличие failed requests
5. ✅ Протестируйте аутентификацию через Cognito (login/logout)
6. ✅ Проверьте работу GraphQL API через AppSync Console
7. ✅ Проверьте работу основных функций

---

## 7. Настройка домена (опционально)

### 7.1. Добавление кастомного домена

#### 7.1.1. Через AWS Amplify Console

1. В Amplify Console перейдите в **App settings** → **Domain management**
2. Нажмите "Add domain"
3. Введите ваш домен (например, `sundayschool.example.com`)
4. Следуйте инструкциям по настройке DNS:
   - Добавьте CNAME запись: `sundayschool.example.com` → `xxxxx.amplifyapp.com`
   - Или используйте Route 53 для автоматической настройки

5. Дождитесь подтверждения DNS (может занять до 24 часов)
6. AWS автоматически настроит SSL сертификат через Certificate Manager

#### 7.1.2. Через Route 53 (рекомендуется)

1. Создайте Hosted Zone в Route 53 для вашего домена
2. В Amplify Console добавьте домен и выберите Route 53 Hosted Zone
3. Amplify автоматически создаст необходимые DNS записи

### 7.2. Обновление переменных окружения

После настройки домена обновите переменные окружения в Amplify Console:

```env
NEXT_PUBLIC_APP_URL=https://sundayschool.example.com
```

Перезапустите deployment для применения изменений.

---

## 8. CI/CD (Continuous Integration / Continuous Deployment)

### 8.1. Автоматический deployment

AWS Amplify автоматически настраивает CI/CD:

- **Push в `main`/`master`** → Production deployment
- **Push в другие ветки** → Preview deployment
- **Pull Request** → Preview deployment с уникальным URL

### 8.2. Настройка веток

В **App settings** → **General**:

- **Production Branch:** `main` (или `master`)
- **Preview Branches:** Все остальные ветки (настраивается)

### 8.3. Build Settings

В **App settings** → **Build settings** можно настроить:

- Build commands
- Environment variables
- Build image (Node.js версия)
- Build timeout

### 8.4. Webhooks (опционально)

Для дополнительных действий после deployment:

1. Перейдите в **App settings** → **Notifications**
2. Настройте SNS topics для уведомлений
3. Используйте Lambda functions для post-deployment действий

---

## 9. Мониторинг и логирование

### 9.1. AWS CloudWatch

1. В **AWS Console** → **CloudWatch**
2. Просмотр логов Lambda functions
3. Метрики AppSync API
4. Метрики DynamoDB
5. Настройка CloudWatch Alarms для алертов

### 9.2. Amplify Console Logs

В Amplify Console:

- **Deployments** → выберите deployment → **Build logs**
- **App logs** для просмотра логов приложения
- Фильтрация по уровню (Error, Warning, Info)

### 9.3. AWS X-Ray (Distributed Tracing)

Для отслеживания запросов через все AWS сервисы:

1. Включите X-Ray в Lambda functions
2. Включите X-Ray в AppSync
3. Просмотр трассировок в X-Ray Console

### 9.4. Интеграция с Sentry (опционально)

Для отслеживания ошибок в production:

1. Создайте аккаунт на [sentry.io](https://sentry.io)
2. Создайте проект для Next.js
3. Установите Sentry:

```bash
npm install @sentry/nextjs
```

4. Инициализируйте Sentry:

```bash
npx @sentry/wizard@latest -i nextjs
```

5. Добавьте в Vercel Environment Variables:

```env
SENTRY_DSN=your-sentry-dsn
NEXT_PUBLIC_SENTRY_DSN=your-public-sentry-dsn
```

### 9.5. Интеграция с Google Analytics (опционально)

1. Создайте Google Analytics аккаунт
2. Получите Measurement ID (например, `G-XXXXXXXXXX`)
3. Добавьте в Amplify Environment Variables:

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

4. Настройте Google Analytics в коде (см. документацию Next.js)

---

## 10. Оптимизация production

### 10.1. Performance Optimization

#### 10.1.1. Next.js Optimizations

Убедитесь, что в `next.config.ts` включены оптимизации:

```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Оптимизация изображений
  images: {
    domains: ['bmummugjnlqsytywogqt.supabase.co'],
  },
  
  // Компрессия
  compress: true,
  
  // Production source maps (опционально, для debugging)
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;
```

#### 10.1.2. Database Connection Management

Убедитесь, что используете правильную конфигурацию:
- **DynamoDB:** Автоматическое управление соединениями через AWS SDK
- **RDS (если используется):** Используйте RDS Proxy для connection pooling
- **AppSync:** Автоматическое управление через GraphQL API

### 10.2. Caching Strategies

#### 10.2.1. Next.js Caching

Используйте React `cache()` для дедупликации запросов:

```typescript
import { cache } from 'react';

export const getLessons = cache(async (yearId: string) => {
  return await prisma.lesson.findMany({
    where: { academicYearId: yearId },
  });
});
```

#### 10.2.2. Vercel Edge Caching

Настройте заголовки кеширования в `next.config.ts` или через middleware.

### 10.3. Environment Variables Optimization

- Используйте только необходимые переменные
- Не добавляйте секреты в `NEXT_PUBLIC_*` переменные
- Регулярно ротируйте API keys и secrets

---

## 11. Backup и восстановление

### 11.1. Database Backup

#### 11.1.1. DynamoDB Backup

DynamoDB автоматически поддерживает Point-in-time recovery:
- **Continuous backups:** Включите в DynamoDB Console
- **On-demand backups:** Создавайте через AWS Console или CLI

**Ручной бэкап:**

```bash
aws dynamodb create-backup \
  --table-name sundayschool-lessons \
  --backup-name lessons-backup-$(date +%Y%m%d)
```

#### 11.1.2. RDS Backup (если используется)

RDS автоматически создает бэкапы:
- **Automated backups:** Ежедневные, хранятся 7 дней (настраивается)
- **Snapshot backups:** Ручные снимки

**Создание snapshot:**

```bash
aws rds create-db-snapshot \
  --db-instance-identifier sundayschool-db \
  --db-snapshot-identifier sundayschool-snapshot-$(date +%Y%m%d)
```

### 11.2. Environment Variables Backup

Экспортируйте environment variables из Amplify:

```bash
# Через AWS CLI
aws amplify get-app --app-id <app-id> > amplify-config.json

# Или через Amplify CLI
amplify env list
amplify env get --name production > amplify-env-production.json
```

Храните backup в безопасном месте (password manager, encrypted storage, AWS Secrets Manager).

### 11.3. Code Backup

Код автоматически бэкапится в Git репозитории. Убедитесь, что:
- Репозиторий настроен правильно
- Все важные изменения закоммичены
- Используются теги для версионирования

---

## 12. Troubleshooting

### 12.1. Build Failures

**Проблема:** Build завершается с ошибкой

**Решения:**
1. Проверьте Build Logs в Vercel Dashboard
2. Убедитесь, что все зависимости установлены (`package.json`)
3. Проверьте, что TypeScript компилируется без ошибок
4. Проверьте, что все environment variables настроены

### 12.2. Database Connection Errors

**Проблема:** Ошибки подключения к DynamoDB/AppSync в production

**Решения:**
1. Проверьте AWS credentials и IAM роли
2. Убедитесь, что GraphQL endpoint правильный в Environment Variables
3. Проверьте Security Groups и VPC settings (если используется VPC)
4. Проверьте CloudWatch Logs для детальных ошибок
5. Убедитесь, что Cognito User Pool правильно настроен

### 12.3. GraphQL Schema Deployment Failures

**Проблема:** GraphQL schema не применяется

**Решения:**
1. Убедитесь, что GraphQL schema синтаксически корректна: `amplify api gql-compile`
2. Проверьте, что изменения в `amplify/backend/api/schema.graphql` закоммичены
3. Проверьте Build Logs на наличие ошибок компиляции
4. Примените изменения вручную через `amplify push`
5. Проверьте AppSync Console для детальных ошибок

### 12.4. Authentication Issues

**Проблема:** Аутентификация через Cognito не работает в production

**Решения:**
1. Проверьте Cognito User Pool ID и Client ID в Environment Variables
2. Проверьте Cognito User Pool settings (Email verification, Password policy)
3. Убедитесь, что App Client правильно настроен (callback URLs, sign-out URLs)
4. Проверьте CloudWatch Logs для Cognito
5. Проверьте, что Amplify Auth правильно инициализирован в коде
6. Убедитесь, что CORS правильно настроен для API endpoints

### 12.5. Performance Issues

**Проблема:** Медленная загрузка страниц

**Решения:**
1. Проверьте CloudWatch Metrics для выявления узких мест
2. Оптимизируйте изображения (используйте Next.js Image + CloudFront)
3. Проверьте DynamoDB queries (используйте GSI для оптимизации)
4. Включите CloudFront кеширование для статических ресурсов
5. Проверьте размер bundle (используйте `npm run build` для анализа)
6. Используйте AWS X-Ray для трассировки медленных запросов
7. Оптимизируйте Lambda cold starts (используйте Provisioned Concurrency)

---

## 13. Обновление приложения

### 13.1. Процесс обновления

1. **Локальная разработка:**
   ```bash
   # Создайте новую ветку
   git checkout -b feature/new-feature
   
   # Внесите изменения
   # Протестируйте локально
   npm run build
   npm run dev
   
   # Если изменяется GraphQL schema:
   amplify api gql-compile
   amplify mock api  # для локального тестирования
   ```

2. **Создание Pull Request:**
   ```bash
   git push origin feature/new-feature
   # Создайте PR в GitHub/GitLab
   ```

3. **Review и Merge:**
   - Code review
   - Автоматические тесты (если настроены)
   - Merge в `main`

4. **Автоматический deployment:**
   - AWS Amplify автоматически задеплоит изменения
   - Проверьте deployment в Amplify Console

### 13.2. Rollback (откат)

Если что-то пошло не так:

1. В Amplify Console перейдите в **Deployments**
2. Найдите предыдущий успешный deployment
3. Нажмите "..." → **Redeploy this version**

**Или через CLI:**

```bash
# Откат GraphQL schema (если нужно)
amplify env checkout <previous-env-name>

# Откат приложения
# Используйте Git для отката кода и push
git revert <commit-hash>
git push origin main
```

---

## 14. Безопасность

### 14.1. Environment Variables Security

- ✅ Никогда не коммитьте `.env.local` в Git
- ✅ Используйте разные secrets для development и production
- ✅ Регулярно ротируйте API keys и passwords
- ✅ Используйте AWS Secrets Manager для чувствительных данных
- ✅ Используйте IAM роли вместо access keys где возможно
- ✅ Используйте AWS Systems Manager Parameter Store для конфигурации

### 14.2. Database Security

- ✅ Используйте IAM роли для доступа к DynamoDB
- ✅ Настройте DynamoDB table policies для ограничения доступа
- ✅ Используйте VPC endpoints для DynamoDB (если используется VPC)
- ✅ Включите encryption at rest для DynamoDB
- ✅ Используйте SSL/TLS для всех подключений
- ✅ Регулярно ротируйте access keys (если используются)

### 14.3. Application Security

- ✅ Используйте HTTPS (автоматически в Vercel)
- ✅ Настройте CORS правильно
- ✅ Используйте rate limiting (если необходимо)
- ✅ Валидируйте все входные данные (Zod)
- ✅ Защищайте от SQL injection (Prisma делает это автоматически)

---

## 15. Полезные команды

### 15.1. AWS Amplify CLI

```bash
# Инициализация проекта
amplify init

# Добавление сервисов
amplify add api      # GraphQL API
amplify add auth     # Cognito
amplify add storage  # S3

# Публикация изменений
amplify push

# Публикация приложения
amplify publish

# Просмотр статуса
amplify status

# Просмотр логов
amplify console

# Удаление сервисов
amplify remove <service>
```

### 15.2. AWS SAM CLI

```bash
# Сборка SAM приложения
sam build

# Локальное тестирование
sam local start-api

# Деплой
sam deploy --guided

# Просмотр логов
sam logs -n FunctionName --stack-name sundayschool-stack

# Удаление стека
sam delete
```

### 15.3. AWS CLI для DynamoDB

```bash
# Просмотр таблиц
aws dynamodb list-tables

# Просмотр данных (осторожно!)
aws dynamodb scan --table-name sundayschool-lessons --limit 10

# Создание backup
aws dynamodb create-backup --table-name sundayschool-lessons --backup-name backup-name
```

---

## 16. Чеклист перед deployment

- [ ] Проект собирается локально (`npm run build`)
- [ ] Нет ошибок TypeScript (`npx tsc --noEmit`)
- [ ] Нет критических ошибок ESLint (`npm run lint`)
- [ ] GraphQL schema компилируется (`amplify api gql-compile`)
- [ ] Все environment variables добавлены в Amplify Console
- [ ] AWS credentials настроены правильно
- [ ] Cognito User Pool создан и настроен
- [ ] DynamoDB таблицы созданы (или будут созданы автоматически)
- [ ] S3 bucket создан и настроен
- [ ] CloudFront distribution настроен (опционально)
- [ ] Тесты пройдены (если есть)
- [ ] Документация обновлена
- [ ] Backup базы данных создан (DynamoDB point-in-time recovery включен)

---

## 17. Контакты и поддержка

Если возникли проблемы с deployment:

1. Проверьте AWS Amplify Documentation: [docs.amplify.aws](https://docs.amplify.aws)
2. Проверьте AWS SAM Documentation: [docs.aws.amazon.com/serverless-application-model](https://docs.aws.amazon.com/serverless-application-model)
3. Проверьте Next.js Deployment Guide: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
4. Проверьте AWS AppSync Documentation: [docs.aws.amazon.com/appsync](https://docs.aws.amazon.com/appsync)
5. Проверьте AWS Cognito Documentation: [docs.aws.amazon.com/cognito](https://docs.aws.amazon.com/cognito)
6. Обратитесь к разработчику проекта

---

**Последнее обновление:** 11 ноября 2025  
**Версия документа:** 2.0

