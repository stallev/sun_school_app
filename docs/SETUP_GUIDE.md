# Руководство по первоначальной настройке - Sunday School App

## Версия документа: 1.0
**Дата создания:** 11 ноября 2025  
**Проект:** Sunday School App (Приложение для управления воскресной школой)  
**Технологии:** Next.js 16, TypeScript, Prisma ORM, Auth.js v5, PostgreSQL (Supabase)

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
- **Prisma** - ORM для работы с БД
- **Auth.js v5** - аутентификация
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

## 3. Настройка `.env.local`

### 3.1. Создание файла `.env.local`

```bash
# Скопируйте шаблон
cp .env.example .env.local
```

### 3.2. Заполнение переменных окружения

Откройте файл `.env.local` и заполните все необходимые переменные:

#### 3.2.1. Database (Supabase PostgreSQL)

```env
# Pooled Connection (для обычных запросов)
DATABASE_URL="postgresql://postgres.bmummugjnlqsytywogqt:!@jh!2342^%@#@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&statement_cache_size=0"

# Direct Connection (для миграций)
DIRECT_URL="postgresql://postgres.bmummugjnlqsytywogqt:!@jh!2342^%@#@aws-1-eu-west-1.pooler.supabase.com:5432/postgres"
```

**Важно:**
- `DATABASE_URL` использует порт **6543** (PgBouncer connection pooling)
- `DIRECT_URL` использует порт **5432** (прямое подключение для миграций)
- Всегда добавляйте `statement_cache_size=0` для PgBouncer

#### 3.2.2. Auth.js (NextAuth v5)

```env
# Секретный ключ для JWT токенов
AUTH_SECRET="DgfL3Z0oECiNqdUunUVtNtTAchQ7Mz5lH+dzr4KVV0M="

# URL приложения
NEXTAUTH_URL="http://localhost:3000"
```

**Генерация нового AUTH_SECRET:**

```bash
# Linux/macOS
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

#### 3.2.3. Supabase Storage

```env
NEXT_PUBLIC_SUPABASE_URL="https://bmummugjnlqsytywogqt.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_STORAGE_BUCKET_NAME="sunschoolb"
SUPABASE_STORAGE_ENDPOINT="https://bmummugjnlqsytywogqt.storage.supabase.co/storage/v1/s3"
SUPABASE_STORAGE_REGION="eu-west-1"
SUPABASE_STORAGE_ACCESS_KEY_ID="91a3f85a48f9b7e919d48ef408be9199"
SUPABASE_STORAGE_SECRET_ACCESS_KEY="294d7d35c0c730c8c253fe70afede3baa5990f63d07ab467e3f3ddcdd186abd2"
```

#### 3.2.4. Node Environment

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

## 4. Инициализация базы данных

### 4.1. Настройка Prisma

#### 4.1.1. Проверка Prisma схемы

Убедитесь, что файл `prisma/schema.prisma` существует и настроен корректно:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")      // Connection pooling
  directUrl = env("DIRECT_URL")        // Direct connection
}
```

#### 4.1.2. Генерация Prisma Client

```bash
# Генерация Prisma Client на основе схемы
npx prisma generate
```

**Ожидаемый результат:**
```
✔ Generated Prisma Client (x.x.x) to ./node_modules/@prisma/client in xxxms
```

### 4.2. Создание миграций

#### 4.2.1. Создание первой миграции

```bash
# Создание миграции на основе схемы
npx prisma migrate dev --name init
```

**Что происходит:**
1. Prisma анализирует схему `schema.prisma`
2. Создает SQL миграции в `prisma/migrations/`
3. Применяет миграции к базе данных (используя `DIRECT_URL`)
4. Генерирует Prisma Client

**Ожидаемый результат:**
```
✔ Created migration `init` at prisma/migrations/20251111_init
✔ Applied migration `init` in xxxms
```

#### 4.2.2. Проверка миграций

```bash
# Просмотр статуса миграций
npx prisma migrate status
```

**Ожидаемый результат:**
```
Database schema is up to date!
```

### 4.3. Проверка подключения к БД

#### 4.3.1. Prisma Studio (GUI для БД)

```bash
# Запуск Prisma Studio
npx prisma studio
```

**Ожидаемый результат:**
- Откроется браузер на `http://localhost:5555`
- Вы увидите все таблицы базы данных
- Можно просматривать и редактировать данные

#### 4.3.2. Тестовый запрос (опционально)

Создайте временный файл `test-db.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  try {
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database connection successful!', result);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
```

Запустите:

```bash
npx tsx test-db.ts
```

---

## 5. Создание первого admin пользователя

### 5.1. Метод 1: Через Prisma Studio

1. Запустите Prisma Studio:
   ```bash
   npx prisma studio
   ```

2. Откройте таблицу `User`

3. Нажмите "Add record"

4. Заполните поля:
   - `id`: оставьте пустым (сгенерируется автоматически)
   - `name`: "Admin User"
   - `email`: "admin@example.com"
   - `password`: **ВАЖНО** - нужно хешировать пароль (см. метод 2)
   - `role`: `SUPERADMIN`
   - `emailVerified`: оставьте `null` или установите текущую дату

5. Сохраните запись

**⚠️ Внимание:** Пароль должен быть захеширован! Используйте метод 2 для правильного создания пользователя.

### 5.2. Метод 2: Через seed скрипт (рекомендуется)

#### 5.2.1. Создание seed скрипта

Создайте файл `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Хеширование пароля
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Создание первого admin пользователя
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'SUPERADMIN',
      emailVerified: new Date(),
    },
  });

  console.log('✅ Admin user created:', admin);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

#### 5.2.2. Настройка package.json

Добавьте в `package.json`:

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

Установите необходимые зависимости:

```bash
npm install bcryptjs @types/bcryptjs tsx
```

#### 5.2.3. Запуск seed скрипта

```bash
npx prisma db seed
```

**Ожидаемый результат:**
```
✅ Admin user created: { id: '...', email: 'admin@example.com', ... }
```

### 5.3. Метод 3: Через Server Action (после настройки Auth.js)

После настройки Auth.js можно создать пользователя через API endpoint или Server Action.

**Учетные данные по умолчанию:**
- **Email:** `admin@example.com`
- **Password:** `admin123`

**⚠️ ВАЖНО:** Смените пароль после первого входа!

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

### 7.2. Проблемы с подключением к БД

**Проблема:** `Error: Can't reach database server`

**Решения:**
1. Проверьте правильность `DATABASE_URL` и `DIRECT_URL` в `.env.local`
2. Убедитесь, что Supabase проект активен
3. Проверьте, что используете правильные порты:
   - `6543` для `DATABASE_URL` (PgBouncer)
   - `5432` для `DIRECT_URL` (Direct)
4. Проверьте firewall и сетевые настройки

**Проблема:** `Error: PgBouncer does not support transactions`

**Решение:** Убедитесь, что в `DATABASE_URL` есть `statement_cache_size=0`:
```env
DATABASE_URL="...?pgbouncer=true&statement_cache_size=0"
```

### 7.3. Проблемы с миграциями

**Проблема:** `Error: Migration failed`

**Решения:**
1. Проверьте, что используете `DIRECT_URL` для миграций (порт 5432)
2. Убедитесь, что схема `schema.prisma` синтаксически корректна
3. Проверьте статус миграций:
   ```bash
   npx prisma migrate status
   ```

4. Если миграция частично применена, сбросьте БД (⚠️ только для development):
   ```bash
   npx prisma migrate reset
   ```

### 7.4. Проблемы с Prisma Client

**Проблема:** `Module not found: @prisma/client`

**Решение:**
```bash
npx prisma generate
```

**Проблема:** Типы Prisma не обновляются

**Решение:**
```bash
# Удалите сгенерированный клиент и пересоздайте
rm -rf node_modules/.prisma
npx prisma generate
```

### 7.5. Проблемы с Auth.js

**Проблема:** `AUTH_SECRET is not set`

**Решение:**
1. Убедитесь, что `.env.local` существует
2. Проверьте, что `AUTH_SECRET` заполнен
3. Перезапустите dev сервер:
   ```bash
   # Остановите сервер (Ctrl+C) и запустите снова
   npm run dev
   ```

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

### 9.1. Prisma команды

```bash
# Генерация Prisma Client
npx prisma generate

# Создание миграции
npx prisma migrate dev --name migration_name

# Применение миграций (production)
npx prisma migrate deploy

# Открыть Prisma Studio
npx prisma studio

# Сброс БД и применение всех миграций (⚠️ только для dev)
npx prisma migrate reset

# Запуск seed скрипта
npx prisma db seed

# Форматирование schema.prisma
npx prisma format
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
**Версия документа:** 1.0

