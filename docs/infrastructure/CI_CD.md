# CI_CD - Sunday School App

## Document Version: 1.0
**Creation Date:** 23 December 2025  
**Last Update:** 23 December 2025  
**Project:** Sunday School App  
**Technologies:** GitHub Actions, Next.js 15.5.9, Node 20, AWS Amplify Gen 1 (backend), AWS Amplify Hosting, AppSync/DynamoDB, Docker (optional), Vercel (alternative)

> [!NOTE]
> Документация основана на актуальных источниках:
> - Next.js 15.5.9 — официальная документация Vercel  
> - AWS Amplify Gen 1 — официальная документация AWS (не Gen 2)  
> - GitHub Actions — официальная документация GitHub  
> - AWS AppSync/DynamoDB — AWS best practices

---

## 1. Обзор
- Цель: описать целевую CI/CD-пайплайн, задачи, quality gates и развертывание в окружения (dev/prod).
- Основной путь: GitHub Actions → Amplify Hosting (SSR, Server Components, Server Actions).
- Альтернативы: Vercel для фронтенда или Docker+ECS/Fargate (из DEPLOYMENT_GUIDE).

---

## 2. Архитектура пайплайна
```mermaid
flowchart TD
  dev[Push/PR to dev] --> gha[GitHub Actions]
  main[Push/PR to main] --> gha
  gha --> build[Build & Test]
  build --> qa[Quality Gates]
  qa --> deployDev[Deploy Dev (Amplify)]
  qa --> deployProd[Deploy Prod (Amplify)]
  deployProd --> notify[Notifications]
```

---

## 3. Jobs (GitHub Actions)
- `lint`: ESLint/TypeScript checks.
- `test`: (Post-MVP) unit/integration/E2E при появлении тестов.
- `build`: `npm ci && npm run build` (Next.js). Кеш: `~/.npm`, `.next/cache`.
- `amplify-push`: `amplifyPush --simple` (Gen 1) перед фронтенд-билдом, если изменились backend ресурсы.
- `deploy-dev`: branch `dev` → Amplify dev env.
- `deploy-prod`: branch `main` → Amplify prod env (manual approve gate).

---

## 4. Quality Gates
- Линт без ошибок.
- (Post-MVP) Тесты проходят.
- Build успешен, без warnings уровня error.
- (Опционально) Preview deployments для PR (Amplify preview/Vercel preview).

---

## 5. Кеширование и оптимизация сборки
- GitHub Actions cache: `npm` + `.next/cache`.
- Amplify build (amplify.yml): кеш `node_modules` и `.next/cache`.
- Turbopack для dev, `next build` для prod.

---

## 6. Секреты и окружения
- GitHub Secrets: `AMPLIFY_APP_ID`, `AMPLIFY_BRANCH`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, при необходимости Vercel токены.
- Amplify Console env vars: `NEXT_PUBLIC_*`, `NODE_ENV`, доп. интеграции.
- Разделение окружений: dev/prod профили в Amplify, ветки `dev`/`main`.

---

## 7. Rollback и инциденты
- Amplify: быстрый откат к предыдущему успешному билду из Console.
- GitHub Actions: ручной redeploy на предыдущий commit.
- Логи: Amplify build logs, CloudWatch для AppSync/DynamoDB.
- Механизм feature flags (если внедрен) — выключение проблемных функций без деплоя.

---

## 8. Наблюдаемость
- Метрики: Amplify build durations, Next.js telemetry (локально), CloudWatch (AppSync/DynamoDB).
- Алерты: опционально SNS/Slack webhook из GitHub Actions после провала/успеха prod деплоя.

---

## 9. Cross-reference
- Деплой: `docs/deployment/DEPLOYMENT_GUIDE.md`
- Безопасность: `docs/infrastructure/SECURITY.md`
- Архитектура данных: `docs/database/DYNAMODB_SCHEMA.md`, `docs/database/GRAPHQL_SCHEMA.md`
- Тестирование (план): `docs/testing/TESTING_STRATEGY.md` (когда появится)

---

**Версия:** 1.0  
**Последнее обновление:** 23 December 2025  
**Автор:** AI Documentation Team

