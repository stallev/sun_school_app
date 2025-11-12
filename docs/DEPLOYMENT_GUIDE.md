# Руководство по deployment - Sunday School App

## Версия документа: 1.0
**Дата создания:** 11 ноября 2025  
**Проект:** Sunday School App (Приложение для управления воскресной школой)  
**Платформа:** Vercel (рекомендуется)  
**Технологии:** Next.js 16, PostgreSQL (Supabase), Auth.js v5

---

## 1. Обзор

Данное руководство описывает процесс развертывания (deployment) приложения Sunday School App на платформе Vercel. Vercel является рекомендуемой платформой для Next.js приложений, так как обеспечивает:

- Автоматическую оптимизацию Next.js
- Edge Functions и Serverless Functions
- CDN для статических ресурсов
- Автоматические SSL сертификаты
- Интеграцию с Git (автоматический деплой при push)

---

## 2. Подготовка к deployment

### 2.1. Предварительные требования

Перед началом deployment убедитесь, что:

- ✅ Проект успешно собирается локально (`npm run build`)
- ✅ Все тесты пройдены
- ✅ Нет критических ошибок TypeScript (`npx tsc --noEmit`)
- ✅ Нет критических ошибок ESLint (`npm run lint`)
- ✅ База данных настроена и миграции применены
- ✅ Все environment variables подготовлены

### 2.2. Финальная проверка

```bash
# 1. Проверка сборки
npm run build

# 2. Проверка типов
npx tsc --noEmit

# 3. Проверка линтера
npm run lint

# 4. Проверка миграций
npx prisma migrate status
```

**Ожидаемый результат:**
- ✅ Build успешно завершен
- ✅ Нет ошибок TypeScript
- ✅ Нет критических ошибок ESLint
- ✅ Все миграции применены

---

## 3. Deployment на Vercel

### 3.1. Создание аккаунта Vercel

1. Перейдите на [vercel.com](https://vercel.com)
2. Зарегистрируйтесь или войдите через GitHub/GitLab/Bitbucket
3. Подтвердите email (если требуется)

### 3.2. Подключение репозитория

#### 3.2.1. Через Vercel Dashboard

1. Нажмите "Add New Project"
2. Выберите репозиторий из списка (GitHub/GitLab/Bitbucket)
3. Выберите проект `sun_sch`
4. Нажмите "Import"

#### 3.2.2. Через Vercel CLI

```bash
# Установка Vercel CLI
npm i -g vercel

# Логин в Vercel
vercel login

# Инициализация проекта
vercel

# Следовать инструкциям:
# - Set up and deploy? Y
# - Which scope? [выберите ваш аккаунт]
# - Link to existing project? N
# - Project name? sun-sch (или оставьте по умолчанию)
# - Directory? ./
# - Override settings? N
```

### 3.3. Настройка проекта

#### 3.3.1. Framework Preset

Vercel автоматически определит Next.js, но убедитесь, что:
- **Framework Preset:** Next.js
- **Root Directory:** `./` (или оставьте пустым)
- **Build Command:** `npm run build` (по умолчанию)
- **Output Directory:** `.next` (по умолчанию)
- **Install Command:** `npm install` (по умолчанию)

#### 3.3.2. Node.js Version

В настройках проекта установите:
- **Node.js Version:** 20.x (LTS)

---

## 4. Настройка Environment Variables

### 4.1. Добавление переменных окружения

В Vercel Dashboard:

1. Перейдите в **Settings** → **Environment Variables**
2. Добавьте все переменные из `.env.local`:

#### 4.1.1. Database Variables

```env
DATABASE_URL=postgresql://postgres.bmummugjnlqsytywogqt:!@jh!2342^%@#@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&statement_cache_size=0
DIRECT_URL=postgresql://postgres.bmummugjnlqsytywogqt:!@jh!2342^%@#@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
```

#### 4.1.2. Auth.js Variables

```env
AUTH_SECRET=DgfL3Z0oECiNqdUunUVtNtTAchQ7Mz5lH+dzr4KVV0M=
NEXTAUTH_URL=https://your-domain.vercel.app
```

**⚠️ ВАЖНО:** 
- Для production используйте **новый** `AUTH_SECRET` (не тот же, что в development)
- `NEXTAUTH_URL` должен быть URL вашего production домена

#### 4.1.3. Supabase Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://bmummugjnlqsytywogqt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_STORAGE_BUCKET_NAME=sunschoolb
SUPABASE_STORAGE_ENDPOINT=https://bmummugjnlqsytywogqt.storage.supabase.co/storage/v1/s3
SUPABASE_STORAGE_REGION=eu-west-1
SUPABASE_STORAGE_ACCESS_KEY_ID=91a3f85a48f9b7e919d48ef408be9199
SUPABASE_STORAGE_SECRET_ACCESS_KEY=294d7d35c0c730c8c253fe70afede3baa5990f63d07ab467e3f3ddcdd186abd2
```

#### 4.1.4. Node Environment

```env
NODE_ENV=production
```

### 4.2. Настройка окружений

Для каждой переменной выберите окружения:
- ✅ **Production** - для production deployment
- ✅ **Preview** - для preview deployments (pull requests)
- ❌ **Development** - обычно не используется (используется локальный `.env.local`)

### 4.3. Генерация нового AUTH_SECRET для production

```bash
# Linux/macOS
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**⚠️ ВАЖНО:** Используйте **разные** `AUTH_SECRET` для development и production!

---

## 5. Миграции в production

### 5.1. Подготовка миграций

Убедитесь, что все миграции созданы и протестированы локально:

```bash
# Проверка статуса миграций
npx prisma migrate status

# Должно быть: "Database schema is up to date!"
```

### 5.2. Применение миграций в production

#### 5.2.1. Метод 1: Через Vercel Build Command (рекомендуется)

Добавьте в `package.json`:

```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "build": "prisma migrate deploy && next build"
  }
}
```

**Как это работает:**
1. `postinstall` - генерирует Prisma Client после установки зависимостей
2. `build` - применяет миграции перед сборкой Next.js

**⚠️ ВАЖНО:** Убедитесь, что `DIRECT_URL` настроен в Vercel Environment Variables!

#### 5.2.2. Метод 2: Через Vercel CLI (ручное применение)

```bash
# Установка Vercel CLI
npm i -g vercel

# Логин
vercel login

# Применение миграций
vercel env pull .env.production
npx prisma migrate deploy
```

#### 5.2.3. Метод 3: Через отдельный скрипт

Создайте файл `scripts/migrate-production.sh`:

```bash
#!/bin/bash
set -e

echo "Applying Prisma migrations..."
npx prisma migrate deploy

echo "Generating Prisma Client..."
npx prisma generate

echo "✅ Migrations applied successfully!"
```

Используйте этот скрипт в Vercel Build Command или через отдельный deployment step.

### 5.3. Проверка миграций

После deployment проверьте:

1. Откройте Vercel Deployment Logs
2. Убедитесь, что миграции применены успешно:
   ```
   ✔ Applied migration `init` in xxxms
   ```

3. Проверьте базу данных через Prisma Studio (локально с production credentials):
   ```bash
   # Временно установите production DATABASE_URL
   export DATABASE_URL="your-production-database-url"
   npx prisma studio
   ```

---

## 6. Первый deployment

### 6.1. Запуск deployment

#### 6.1.1. Через Vercel Dashboard

1. Нажмите "Deploy" в проекте
2. Дождитесь завершения сборки
3. Проверьте логи на наличие ошибок

#### 6.1.2. Через Git Push

```bash
# Сделайте commit и push
git add .
git commit -m "Initial deployment"
git push origin main

# Vercel автоматически запустит deployment
```

### 6.2. Мониторинг deployment

В Vercel Dashboard:

1. Перейдите в **Deployments**
2. Откройте текущий deployment
3. Проверьте **Build Logs** на наличие ошибок
4. Проверьте **Function Logs** для Server Actions/API Routes

### 6.3. Проверка после deployment

1. ✅ Откройте production URL (например, `https://sun-sch.vercel.app`)
2. ✅ Проверьте, что страница загружается
3. ✅ Проверьте консоль браузера (F12) на наличие ошибок
4. ✅ Проверьте Network tab на наличие failed requests
5. ✅ Протестируйте аутентификацию (login/logout)
6. ✅ Проверьте работу основных функций

---

## 7. Настройка домена (опционально)

### 7.1. Добавление кастомного домена

1. В Vercel Dashboard перейдите в **Settings** → **Domains**
2. Добавьте ваш домен (например, `sundayschool.example.com`)
3. Следуйте инструкциям по настройке DNS:
   - Добавьте CNAME запись: `sundayschool.example.com` → `cname.vercel-dns.com`
   - Или A запись: `sundayschool.example.com` → IP адрес Vercel

4. Дождитесь подтверждения DNS (может занять до 24 часов)
5. Vercel автоматически настроит SSL сертификат

### 7.2. Обновление NEXTAUTH_URL

После настройки домена обновите `NEXTAUTH_URL` в Vercel Environment Variables:

```env
NEXTAUTH_URL=https://sundayschool.example.com
```

Перезапустите deployment для применения изменений.

---

## 8. CI/CD (Continuous Integration / Continuous Deployment)

### 8.1. Автоматический deployment

Vercel автоматически настраивает CI/CD:

- **Push в `main`/`master`** → Production deployment
- **Push в другие ветки** → Preview deployment
- **Pull Request** → Preview deployment с уникальным URL

### 8.2. Настройка веток

В **Settings** → **Git**:

- **Production Branch:** `main` (или `master`)
- **Preview Branches:** Все остальные ветки

### 8.3. Deployment Hooks (опционально)

Для дополнительных действий после deployment:

1. Перейдите в **Settings** → **Deploy Hooks**
2. Создайте новый hook
3. Используйте URL hook в вашем CI/CD pipeline

---

## 9. Мониторинг и логирование

### 9.1. Vercel Analytics (опционально)

1. В **Settings** → **Analytics**
2. Включите **Web Analytics**
3. Получите доступ к метрикам производительности

### 9.2. Vercel Logs

В Vercel Dashboard:

- **Deployments** → выберите deployment → **Function Logs**
- Просмотр логов Server Actions и API Routes
- Фильтрация по уровню (Error, Warning, Info)

### 9.3. Интеграция с Sentry (опционально)

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

### 9.4. Интеграция с Google Analytics (опционально)

1. Создайте Google Analytics аккаунт
2. Получите Measurement ID (например, `G-XXXXXXXXXX`)
3. Добавьте в Vercel Environment Variables:

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

#### 10.1.2. Database Connection Pooling

Убедитесь, что используете PgBouncer для `DATABASE_URL`:
- Порт: **6543**
- Параметр: `pgbouncer=true&statement_cache_size=0`

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

Supabase автоматически создает бэкапы:
- **Daily backups:** Хранятся 7 дней
- **Weekly backups:** Хранятся 4 недели

**Ручной бэкап:**

```bash
pg_dump -h aws-1-eu-west-1.pooler.supabase.com \
  -U postgres.bmummugjnlqsytywogqt \
  -p 5432 \
  -d postgres \
  > backup_$(date +%Y%m%d).sql
```

### 11.2. Environment Variables Backup

Экспортируйте environment variables из Vercel:

```bash
vercel env pull .env.backup
```

Храните backup в безопасном месте (password manager, encrypted storage).

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

**Проблема:** Ошибки подключения к БД в production

**Решения:**
1. Проверьте `DATABASE_URL` и `DIRECT_URL` в Vercel Environment Variables
2. Убедитесь, что Supabase проект активен
3. Проверьте firewall и network settings
4. Убедитесь, что используете правильные порты (6543 для DATABASE_URL, 5432 для DIRECT_URL)

### 12.3. Migration Failures

**Проблема:** Миграции не применяются

**Решения:**
1. Убедитесь, что `DIRECT_URL` настроен (не `DATABASE_URL`)
2. Проверьте, что миграции существуют в `prisma/migrations/`
3. Проверьте Build Logs на наличие ошибок миграций
4. Примените миграции вручную через Vercel CLI

### 12.4. Authentication Issues

**Проблема:** Аутентификация не работает в production

**Решения:**
1. Проверьте `AUTH_SECRET` (должен быть уникальным для production)
2. Проверьте `NEXTAUTH_URL` (должен быть production URL)
3. Убедитесь, что cookies работают (проверьте домен)
4. Проверьте логи в Vercel Function Logs

### 12.5. Performance Issues

**Проблема:** Медленная загрузка страниц

**Решения:**
1. Проверьте Vercel Analytics для выявления узких мест
2. Оптимизируйте изображения (используйте Next.js Image)
3. Проверьте database queries (используйте индексы)
4. Включите кеширование где возможно
5. Проверьте размер bundle (используйте `npm run build` для анализа)

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
   - Vercel автоматически задеплоит изменения
   - Проверьте deployment в Vercel Dashboard

### 13.2. Rollback (откат)

Если что-то пошло не так:

1. В Vercel Dashboard перейдите в **Deployments**
2. Найдите предыдущий успешный deployment
3. Нажмите "..." → **Promote to Production**

---

## 14. Безопасность

### 14.1. Environment Variables Security

- ✅ Никогда не коммитьте `.env.local` в Git
- ✅ Используйте разные secrets для development и production
- ✅ Регулярно ротируйте API keys и passwords
- ✅ Используйте Vercel Environment Variables (не hardcode в коде)

### 14.2. Database Security

- ✅ Используйте connection pooling (PgBouncer)
- ✅ Ограничьте доступ к `DIRECT_URL` (только для миграций)
- ✅ Регулярно обновляйте пароли БД
- ✅ Используйте SSL для подключений

### 14.3. Application Security

- ✅ Используйте HTTPS (автоматически в Vercel)
- ✅ Настройте CORS правильно
- ✅ Используйте rate limiting (если необходимо)
- ✅ Валидируйте все входные данные (Zod)
- ✅ Защищайте от SQL injection (Prisma делает это автоматически)

---

## 15. Полезные команды

### 15.1. Vercel CLI

```bash
# Логин
vercel login

# Деплой
vercel

# Деплой в production
vercel --prod

# Просмотр логов
vercel logs

# Просмотр environment variables
vercel env ls

# Добавление environment variable
vercel env add VARIABLE_NAME

# Экспорт environment variables
vercel env pull .env.production
```

### 15.2. Prisma в production

```bash
# Применение миграций
DATABASE_URL="production-url" npx prisma migrate deploy

# Генерация Prisma Client
npx prisma generate

# Просмотр данных (осторожно!)
DATABASE_URL="production-url" npx prisma studio
```

---

## 16. Чеклист перед deployment

- [ ] Проект собирается локально (`npm run build`)
- [ ] Нет ошибок TypeScript (`npx tsc --noEmit`)
- [ ] Нет критических ошибок ESLint (`npm run lint`)
- [ ] Все миграции применены локально
- [ ] Все environment variables добавлены в Vercel
- [ ] `AUTH_SECRET` уникален для production
- [ ] `NEXTAUTH_URL` указывает на production URL
- [ ] Тесты пройдены (если есть)
- [ ] Документация обновлена
- [ ] Backup базы данных создан

---

## 17. Контакты и поддержка

Если возникли проблемы с deployment:

1. Проверьте Vercel Documentation: [vercel.com/docs](https://vercel.com/docs)
2. Проверьте Next.js Deployment Guide: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
3. Проверьте Prisma Deployment Guide: [prisma.io/docs/guides/deployment](https://www.prisma.io/docs/guides/deployment)
4. Обратитесь к разработчику проекта

---

**Последнее обновление:** 11 ноября 2025  
**Версия документа:** 1.0

