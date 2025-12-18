# Миграция на AWS - Sunday School App

## Версия документа: 1.0
**Дата создания:** 11 ноября 2025  
**Проект:** Sunday School App (Приложение для управления воскресной школой)

---

## 📋 Обзор изменений

Проект мигрировал с **Prisma + Supabase + PostgreSQL** на **AWS Amplify + AWS SAM + AWS DynamoDB/RDS + AWS Cognito + AWS S3**.

---

## 🔄 Изменения в технологическом стеке

### До (Версия 1.0)
- **ORM:** Prisma ORM
- **База данных:** Supabase PostgreSQL
- **Аутентификация:** Auth.js v5 (NextAuth)
- **Storage:** Supabase Storage
- **Deployment:** Vercel
- **Connection Pooling:** PgBouncer

### После (Версия 2.0)
- **Data Layer:** AWS Amplify Data (GraphQL через AppSync)
- **База данных:** AWS DynamoDB (основной) или AWS RDS PostgreSQL (опционально)
- **Аутентификация:** AWS Cognito / Amplify Auth
- **Storage:** AWS S3 + CloudFront CDN
- **Deployment:** AWS Amplify Hosting или AWS SAM
- **Connection Management:** Автоматически через AWS AppSync и Lambda

---

## 📝 Обновленные документы

### Основные документы (обновлены до версии 2.0)

1. ✅ **`docs/prds/ARCHITECTURE.md`** (v2.0)
   - Заменены Prisma на AWS Amplify Data
   - Заменены Supabase на AWS сервисы
   - Обновлены диаграммы архитектуры
   - Обновлены примеры кода

2. ✅ **`docs/PROJECT_REQUIREMENTS.md`** (v2.0)
   - Обновлен технологический стек
   - Заменены требования к БД
   - Обновлены требования к deployment

3. ✅ **`docs/DEPLOYMENT_GUIDE.md`** (v2.0)
   - Заменен Vercel на AWS Amplify/SAM
   - Обновлены инструкции по deployment
   - Добавлены команды AWS CLI

4. ✅ **`docs/SETUP_GUIDE.md`** (v2.0)
   - Заменены инструкции по настройке Supabase на AWS
   - Добавлены команды Amplify CLI
   - Обновлены инструкции по созданию пользователей

5. ✅ **`docs/prds/IMPLEMENTATION_PLAN.md`** (v2.0)
   - Обновлены задачи установки зависимостей
   - Заменены Prisma миграции на GraphQL schema
   - Обновлены инструкции по настройке Auth

6. ✅ **`docs/prds/ERD.md`** (v2.0)
   - Добавлены примечания о миграции на AWS
   - Обновлены примеры использования

7. ✅ **`docs/technical/STATE_MANAGEMENT.md`** (v2.0)
   - Заменены примеры с Prisma на AWS Amplify Data
   - Обновлены примеры Server Actions

### Документы для референса (Legacy)

8. ⚠️ **`docs/technical/PRISMA_SCHEMA.md`** (v1.0 - Legacy)
   - Сохранен для референса структуры данных
   - Добавлено примечание о миграции на AWS
   - Структура данных теперь реализуется через GraphQL schema

---

## 🗂️ Структурные изменения проекта

### Удалено
- ❌ `prisma/` каталог (Prisma ORM)
- ❌ `prisma/schema.prisma`
- ❌ `prisma/migrations/`
- ❌ `src/lib/db/prisma.ts` (Prisma Client)

### Добавлено
- ✅ `amplify/` каталог (AWS Amplify конфигурация)
- ✅ `amplify/backend/api/schema.graphql` (GraphQL schema)
- ✅ `amplify/backend/auth/` (Cognito конфигурация)
- ✅ `amplify/backend/storage/` (S3 конфигурация)
- ✅ `sam/` каталог (AWS SAM templates, опционально)
- ✅ `src/lib/db/amplify.ts` (Amplify Data client)
- ✅ `src/lib/auth/amplify-auth.ts` (Amplify Auth)
- ✅ `src/lib/auth/cognito.ts` (Cognito SDK client)
- ✅ `src/lib/storage/s3.ts` (S3 client)

---

## 🔧 Изменения в коде

### Database Queries

**До (Prisma):**
```typescript
import { prisma } from '@/lib/db/prisma';

const lessons = await prisma.lesson.findMany({
  where: { academicYearId: yearId },
  include: { goldenVerses: true },
});
```

**После (AWS Amplify Data):**
```typescript
import { amplifyData } from '@/lib/db/amplify';
import * as queries from '@/amplify/data/queries';

const { data, errors } = await amplifyData.graphql({
  query: queries.listLessons,
  variables: {
    filter: { academicYearId: { eq: yearId } },
  },
});
```

### Authentication

**До (Auth.js):**
```typescript
import { auth, signIn, signOut } from '@/lib/auth/auth';

const session = await auth();
```

**После (AWS Cognito):**
```typescript
import { getCurrentUser, signIn, signOut } from '@/lib/auth/amplify-auth';

const user = await getCurrentUser();
```

### Storage

**До (Supabase Storage):**
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(url, key);
await supabase.storage.from('bucket').upload(path, file);
```

**После (AWS S3):**
```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({ region: 'us-east-1' });
await s3Client.send(new PutObjectCommand({
  Bucket: 'bucket-name',
  Key: path,
  Body: file,
}));
```

---

## 📦 Изменения в зависимостях

### Удалено
- ❌ `@prisma/client`
- ❌ `prisma`
- ❌ `next-auth@beta`
- ❌ `bcryptjs`
- ❌ `@supabase/supabase-js`

### Добавлено
- ✅ `aws-amplify`
- ✅ `@aws-amplify/backend`
- ✅ `@aws-amplify/backend-cli`
- ✅ `@aws-sdk/client-cognito-identity-provider`
- ✅ `@aws-sdk/client-dynamodb`
- ✅ `@aws-sdk/client-s3`
- ✅ `@aws-sdk/lib-dynamodb`

---

## 🚀 Миграция данных (если требуется)

Если у вас уже есть данные в Supabase PostgreSQL, потребуется миграция:

1. **Экспорт данных из Supabase:**
   ```bash
   pg_dump -h <supabase-host> -U <user> -d <database> > backup.sql
   ```

2. **Преобразование данных:**
   - Создать скрипт для преобразования SQL данных в формат для DynamoDB
   - Или использовать AWS DMS (Database Migration Service) для автоматической миграции

3. **Импорт в DynamoDB:**
   - Использовать AWS SDK для массовой загрузки данных
   - Или использовать AWS Data Pipeline

**⚠️ ВАЖНО:** Для MVP можно начать с пустой базы данных и использовать seed скрипты.

---

## 📚 Дополнительные ресурсы

### AWS Документация
- [AWS Amplify Documentation](https://docs.amplify.aws)
- [AWS AppSync Documentation](https://docs.aws.amazon.com/appsync)
- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito)
- [AWS DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb)
- [AWS SAM Documentation](https://docs.aws.amazon.com/serverless-application-model)

### GraphQL
- [GraphQL Schema Language](https://graphql.org/learn/schema/)
- [AWS AppSync GraphQL API](https://docs.aws.amazon.com/appsync/latest/devguide/graphql-api.html)

---

## ✅ Чеклист миграции

- [x] Обновлена документация проекта
- [ ] Установлены новые зависимости
- [ ] Настроен AWS аккаунт и credentials
- [ ] Инициализирован Amplify проект
- [ ] Создана GraphQL schema
- [ ] Настроен Cognito User Pool
- [ ] Настроен S3 bucket
- [ ] Обновлен код приложения
- [ ] Протестирована функциональность
- [ ] Выполнен deployment на AWS

---

## ⚠️ Важные замечания

1. **Стоимость:** AWS сервисы могут иметь затраты. Используйте Free Tier где возможно и настройте billing alerts.

2. **Регион:** Выберите AWS регион близкий к вашим пользователям для лучшей производительности.

3. **Безопасность:** Используйте IAM роли вместо access keys где возможно. Храните secrets в AWS Secrets Manager.

4. **Мониторинг:** Настройте CloudWatch для мониторинга использования и затрат.

5. **Backup:** Включите Point-in-time recovery для DynamoDB и automated backups для RDS (если используется).

---

**Последнее обновление:** 11 ноября 2025  
**Версия документа:** 1.0  
**Автор:** AI Senior Software Architect & Migration Specialist
