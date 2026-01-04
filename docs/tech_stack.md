# Технологический стек chr_games

## Frontend

### Core Framework

| Технология | Версия | Назначение | Обоснование |
|------------|--------|-----------|-------------|
| **Next.js** | 15.5.9 | Основной фреймворк | SSR/SSG, App Router, Server Actions, оптимизация |
| **React** | Latest | UI библиотека | Стандарт индустрии, богатая экосистема |
| **TypeScript** | Latest | Типизация | Типобезопасность, лучший DX, снижение ошибок |

**Почему Next.js 15?**
- ✅ App Router с Server Components
- ✅ Server Actions для работы с данными
- ✅ Встроенная оптимизация (Image, Font, Bundle)
- ✅ Поддержка AWS Amplify hosting
- ✅ Отличная производительность

**Альтернативы:**
- ❌ Remix: менее зрелая AWS интеграция
- ❌ Astro: недостаточно интерактивности
- ❌ Vite + React: нет SSR из коробки

---

### State Management

| Технология | Версия | Назначение |
|------------|--------|-----------|
| **Zustand** | Latest | Глобальное состояние |

**Почему Zustand?**
- ✅ Легковесный (~3 KB gzipped)
- ✅ Простой API без boilerplate
- ✅ Встроенная поддержка persist middleware
- ✅ TypeScript-first
- ✅ React 18+ compatible

**Альтернативы:**
- ❌ Redux Toolkit: избыточен для MVP
- ❌ Recoil: меньше документации
- ❌ Jotai: атомарный подход излишен
- ❌ Context API: проблемы с производительностью

---

### UI библиотеки

| Технология | Версия | Назначение |
|------------|--------|-----------|
| **shadcn/ui** | Latest | UI компоненты |
| **Tailwind CSS** | Latest | Utility-first CSS |
| **Framer Motion** | Latest | Анимации |
| **Novel** | Latest | WYSIWYG редактор для уроков |

**Почему shadcn/ui?**
- ✅ Копирование компонентов в проект (не npm пакет)
- ✅ Полный контроль и кастомизация
- ✅ Built on Radix UI (accessibility)
- ✅ Tailwind CSS интеграция
- ✅ TypeScript support

**Почему Framer Motion?**
- ✅ Лучшая библиотека для React анимаций
- ✅ Declarative API
- ✅ Отличная производительность
- ✅ Поддержка Layout Animations

**Почему Novel?**
- ✅ Построен на Shadcn UI (нативная интеграция с проектом)
- ✅ Tiptap/ProseMirror под капотом (production-ready)
- ✅ Меньший bundle size чем BlockNote
- ✅ TypeScript-first
- ✅ Slash commands и Markdown shortcuts

**Альтернативы UI:**
- ❌ Material-UI: слишком тяжелый bundle
- ❌ Ant Design: не подходит для проекторов
- ❌ Chakra UI: меньше контроля

---

## Backend

### AWS Services

| Сервис | Назначение |
|--------|-----------|
| **AWS Amplify Gen 1** | Backend инфраструктура |
| **AWS DynamoDB** | NoSQL база данных |
| **AWS S3** | Хранение статических ресурсов (future) |
| **AWS CloudFront** | CDN через Amplify |
| **AWS Lambda** | Serverless функции (через SAM, future) |

**Почему AWS Amplify Gen 1?**
- ✅ Готовая инфраструктура для Next.js
- ✅ Автоматический CI/CD
- ✅ Интеграция с DynamoDB
- ✅ Environment variables management
- ✅ CloudFront CDN из коробки

**⚠️ КРИТИЧНО: AWS Amplify Gen 1, НЕ Gen 2!**
- Gen 2 имеет несовместимый API
- Gen 1 команды: `amplify init`, `amplify add api`, `amplify push`
- Gen 2 команды (НЕ ИСПОЛЬЗУЕМ): `npx ampx ...`

**Почему DynamoDB?**
- ✅ Serverless, автомасштабирование
- ✅ Низкая latency
- ✅ Pay-per-request модель (MVP friendly)
- ✅ Интеграция с Amplify

**Альтернативы:**
- ❌ PostgreSQL: требует управления сервером
- ❌ MongoDB: дополнительный vendor
- ❌ Firebase: vendor lock-in, меньше AWS интеграции

---

### API Layer

| Технология | Назначение |
|------------|-----------|
| **Next.js Server Actions** | CRUD операции |
| **@/lib/db/amplify** | Data Access Layer |
| **AWS SDK for JavaScript** | DynamoDB клиент (внутри amplify.ts) |

**Почему Server Actions?**
- ✅ Нативная Next.js функциональность
- ✅ Типобезопасность
- ✅ Automatic CSRF protection
- ✅ Серверная валидация
- ✅ Не нужны API routes

**Data Access Layer паттерн:**
```typescript
// Абстракция
import { amplifyData } from '@/lib/db/amplify';

// Использование в Server Action
'use server';
export async function getQuestions(topic: string) {
  return await amplifyData.get(topic);
}
```

---

## Deployment

### Hosting

| Сервис | Назначение |
|--------|-----------|
| **AWS Amplify Hosting** | Frontend хостинг |
| **CloudFront** | CDN (автоматически через Amplify) |
| **Git** | Source control и CI/CD trigger |

**CI/CD Pipeline:**
```
Git Push (dev branch) → Amplify Build → Deploy to QA (future)
Git Push (master branch) → Amplify Build → Deploy to Production
```

**Build конфигурация:**
- `amplify.yml` для build settings
- Next.js static export + SSR
- Automatic cache invalidation
- Environment variables per branch

---

## Development Tools

### Обязательные

| Инструмент | Назначение |
|-----------|-----------|
| **Node.js** | 18.x или 20.x LTS |
| **npm** | Package manager |
| **AWS Amplify CLI** | Backend management |
| **AWS SAM CLI** | Serverless development (future) |

### Рекомендуемые

| Инструмент | Назначение |
|-----------|-----------|
| **Cursor AI** | AI-powered IDE |
| **ESLint** | Линтинг |
| **Prettier** | Форматирование |
| **Chrome DevTools** | Debugging, Performance |
| **React DevTools** | React инспекция |

---

## Версии зависимостей (package.json)

### Production

```json
{
  "dependencies": {
    "next": "15.5.9",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "zustand": "^5.0.2",
    "framer-motion": "^12.0.0",
    "@radix-ui/react-*": "latest",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.7.0"
  }
}
```

### Development

```json
{
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "15.5.9",
    "postcss": "^8",
    "typescript": "^5.7.0"
  }
}
```

**Проверка совместимости:**
- Используй [context7](https://context7.dev) для актуальных версий
- Проверяй Next.js 15 compatibility
- AWS Amplify требует специфичные версии AWS SDK

---

## Ограничения MVP

### Не используется в MVP

| Технология | Причина |
|------------|---------|
| Интернационализация (i18n) | Post-MVP feature |
| Testing frameworks | Post-MVP (Jest, Playwright) |
| AWS Cognito (Auth) | Нет авторизации в MVP |
| AWS CloudWatch (Monitoring) | Базовый logging в MVP |

### Планы на Post-MVP

**Phase 2: QA/Prod разделение**
- Разные AWS regions
- Разные Amplify apps
- Environment-specific configs

**Phase 3: Интернационализация - Post-MVP**
- Next.js i18n routing
- Локализованные вопросы в DynamoDB
- UI переводы (ru, en, uk, de)

**Phase 4: Testing**
- Jest для unit tests
- React Testing Library
- Playwright для E2E

**Phase 5: Мониторинг**
- AWS CloudWatch RUM
- Error tracking
- Performance monitoring

---

## Browser Targets

### Поддерживаемые браузеры

```json
{
  "browserslist": {
    "production": [
      ">0.5%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

### Минимальные версии
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Обоснование:**
- Проектор обычно подключен к современному ПК
- ES2020+ features
- CSS Grid/Flexbox
- WebGL для анимаций

---

## Performance Targets

### Core Web Vitals

| Метрика | Target | Важность |
|---------|--------|----------|
| LCP | < 2.0s | 🔴 Критично |
| FID | < 50ms | 🔴 Критично |
| CLS | < 0.05 | 🔴 Критично |
| TTI | < 2.5s | 🟡 Важно |
| Bundle size | < 300 KB | 🟡 Важно |

**Стратегии оптимизации:**
- Server Components по умолчанию
- Dynamic imports для тяжелых компонентов
- Image optimization (next/image)
- Font optimization (next/font)
- Bundle analysis (`npm run bundle:report`)

---

## Чеклист выбора технологий для новых features

При добавлении новой технологии проверь:
- [ ] Совместимость с Next.js 15.5.9
- [ ] Совместимость с React 19
- [ ] TypeScript support
- [ ] Bundle size impact
- [ ] AWS Amplify compatibility
- [ ] Документация и community support
- [ ] Licensing (MIT/Apache preferred)

---

**Последнее обновление**: 2025-12-23  
**Статус**: Active  
