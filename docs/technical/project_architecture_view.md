# 🏛️ Архитектура Sunday School App  
**Next.js 16 + AWS Amplify + AWS SAM**  
**Single Repository, Multi-Environment (QA/PROD), Unified CI/CD**

---

## ✅ Обновлённые принципы проектирования

На основе вашего уточнения:
> *Я хочу, чтобы код всего приложения был в одном репозитории. При этом git branch `dev` разворачивалась в QA окружение, git branch `master` — в PROD окружение.*

Это **полностью соответствует лучшим практикам** AWS и CI/CD:
- **Monorepo** — упрощает координацию версий, синхронизацию изменений, рефакторинг.
- **Git-ветка → Окружение** — стандартный паттерн (dev → QA, main/master → PROD).
- **Amplify Console поддерживает multi-env по веткам из коробки** — не требует ручного триггера через API.

> ❌ **Устаревший подход**: вызов `curl` к Amplify API из GitHub Actions.  
> ✅ **Правильный подход**: полная интеграция Amplify Hosting с Git-репозиторием без внешнего CI.

---

## 1. 🧱 Общая архитектурная модель

### Архитектурные роли

| Компонент | Ответственность | Инструмент |
|----------|------------------|------------|
| **Фронтенд** | UI, `server actions`, взаимодействие с пользователем | **Next.js 16 (App Router)** |
| **Backend Infrastructure** | Lambda, API Gateway, DynamoDB, S3 — через IaC | **AWS SAM** |
| **Auth + Data + Hosting** | Cognito, AppSync, Amplify Hosting, автосборка по веткам | **AWS Amplify** |

### Ключевые решения
- **Единый репозиторий** содержит:
  - `/app` — Next.js фронтенд
  - `/sam` — SAM-инфраструктура (`/sam/lessons`, `/sam/pupils` и т.д.)
  - `amplify/` — метаданные Amplify (schema, auth config и др.)
- **Amplify управляет фронтендом**, SAM — backend-инфраструктурой.
- **Frontend и backend развёртываются независимо**, но **согласованно** через CI/CD пайплайн.

---

## 2. 🌍 Управление окружениями: `dev` ↔ `main`

| Параметр | QA | PROD |
|--------|----|------|
| Git-ветка | `dev` | `main` |
| AWS Регион | `us-east-1` | `eu-central-1` |
| Префикс ресурсов | `qa-...` | `prod-...` |
| Amplify App Branch | `dev` | `main` |
| Переменные окружения | `.env.qa` | `.env.prod` |

> ✅ **Amplify Console сам отслеживает пуши в `dev` и `main` и запускает сборку.**  
> ❌ **Не нужно вызывать `curl` из GitHub Actions — это нарушает native workflow Amplify.**

---

## 3. 🛠️ Единый CI/CD пайплайн на GitHub Actions

**Цель**: обеспечить атомарное развёртывание backend → frontend при пуше в `dev` или `main`.

```yaml
name: Deploy Sunday School App

on:
  push:
    branches: [dev, main]

jobs:
  # 1. Определяем окружение на основе ветки
  setup:
    runs-on: ubuntu-latest
    outputs:
      env: ${{ steps.env.outputs.env }}
      region: ${{ steps.env.outputs.region }}
      branch: ${{ github.ref_name }}
    steps:
      - id: env
        run: |
          if [[ "${{ github.ref_name }}" == "dev" ]]; then
            echo "env=qa" >> $GITHUB_OUTPUT
            echo "region=us-east-1" >> $GITHUB_OUTPUT
          elif [[ "${{ github.ref_name }}" == "main" ]]; then
            echo "env=prod" >> $GITHUB_OUTPUT
            echo "region=eu-central-1" >> $GITHUB_OUTPUT
          fi

  # 2. Разворачиваем backend через SAM
  deploy-backend:
    name: Deploy Backend (${{ needs.setup.outputs.env }})
    needs: setup
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ needs.setup.outputs.region }}

      - name: Deploy SAM
        run: |
          cd sam
          sam build --use-container
          sam deploy \
            --stack-name ss-${{ needs.setup.outputs.env }}-stack \
            --parameter-overrides Environment=${{ needs.setup.outputs.env }} \
            --region ${{ needs.setup.outputs.region }} \
            --no-fail-on-empty-changeset \
            --capabilities CAPABILITY_IAM

  # 3. Обновляем env-файл для Amplify
  update-env:
    name: Update .env file for Amplify
    needs: [setup, deploy-backend]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Fetch AppSync URL from CloudFormation
        run: |
          APPSYNC_URL=$(aws cloudformation describe-stacks \
            --stack-name ss-${{ needs.setup.outputs.env }}-stack \
            --region ${{ needs.setup.outputs.region }} \
            --query "Stacks[0].Outputs[?OutputKey=='AppSyncUrl'].OutputValue" \
            --output text)

          echo "NEXT_PUBLIC_APPSYNC_URL=$APPSYNC_URL" > .env.${{ needs.setup.outputs.env }}
          echo "ENV=${{ needs.setup.outputs.env }}" >> .env.${{ needs.setup.outputs.env }}

      - name: Commit .env to git
        run: |
          git config --global user.name "CI Bot"
          git config --global user.email "ci@noreply.com"
          git checkout ${{ needs.setup.outputs.branch }}
          mv .env.${{ needs.setup.outputs.env }} .env.local
          git add .env.local
          git commit -m "chore: update .env.local for ${{ needs.setup.outputs.env }}"
          git push

  # 4. Amplify сам запустит сборку (благодаря Git integration)
  # Нет шага deploy-frontend — он не нужен!
```

> ✅ **Почему это лучше**:  
> - Backend разворачивается **до** фронтенда → `.env.local` содержит актуальные endpoint'ы.  
> - Amplify **сам запускает сборку** при пуше в `dev`/`main` → нет лишних HTTP-вызовов.  
> - Единый `.env.local` используется Next.js при сборке → типобезопасность, отсутствие runtime-ошибок.

---

## 4. 🔐 Авторизация: Cognito Groups + AppSync `@auth`

### Настройка ролей
- В Cognito User Pool создаются группы: `teacher`, `admin`, `superadmin`.
- При регистрации пользователь назначается в группу (вручную или через админку).

### Защита данных через GraphQL
```graphql
# amplify/schema.graphql
type Lesson @model @auth(rules: [
  { allow: groups, groups: ["admin", "superadmin"], operations: [create, update, delete] },
  { allow: groups, groups: ["teacher", "admin", "superadmin"], operations: [read] }
]) {
  id: ID!
  title: String!
  grade: Grade @belongsTo
}
```

> ✅ AppSync **автоматически проверяет `cognito:groups`** в JWT-токене.  
> ✅ Frontend вызывает GraphQL из `server actions` → безопасно, без утечки логики.

---

## 5. 🧵 Server Actions + AppSync

**Пример `server action`**:
```ts
// app/actions/lessons.ts
"use server";

import { cookies } from "next/headers";
import { createGraphQLClient } from "@/lib/graphql";

export async function createLesson(input: CreateLessonInput) {
  const token = cookies().get("CognitoIdentityServiceProvider...")?.value;
  if (!token) throw new Error("Unauthorized");

  const client = createGraphQLClient(process.env.NEXT_PUBLIC_APPSYNC_URL!, token);
  const { data } = await client.mutate({ mutation: CREATE_LESSON, variables: { input } });
  return data.createLesson;
}
```

> ✅ **JWT в HttpOnly cookie** → защита от XSS.  
> ✅ **AppSync как GraphQL-адаптер к DynamoDB** → типобезопасность, гибкость запросов.

---

## 6. 📦 Микросервисная структура SAM

```
/sam/
  ├── core/              # Общие ресурсы: Cognito, S3
  ├── lessons/           # CRUD уроков, золотые стихи
  ├── pupils/            # Ученики, семьи, группы
  ├── achievements/      # Достижения, рейтинг
  └── template.yaml      # master template (nested stacks)
```

Каждый модуль — независимый SAM-стек с собственным `template.yaml`.

---

## 7. 📐 Принципы GraphQL Schema в Amplify

- **Domain-first**: сущности отражают предметную область (`Lesson`, `Pupil`, `Grade`).
- **@model**: для каждой сущности, хранящейся в DynamoDB.
- **@auth**: правила доступа через Cognito Groups.
- **@belongsTo / @hasMany**: связи между сущностями.
- **Избегать**: глубокой вложенности, избыточных полей.

---

## 8. 📦 Функционал: AWS SAM vs AWS Amplify

| Функционал | Реализуется через |
|-----------|-------------------|
| **SAM** | |
| - Lambda-логика | ✅ |
| - DynamoDB таблицы | ✅ |
| - S3 бакеты (аватары) | ✅ |
| - EventBridge (уведомления) | ✅ |
| **Amplify** | |
| - Аутентификация (Cognito) | ✅ |
| - GraphQL API (AppSync) | ✅ |
| - Хостинг Next.js | ✅ |
| - CI/CD по веткам (`dev`/`main`) | ✅ |
| - Генерация TypeScript-типов | ✅ |

> ⚠️ **Важно**: AppSync можно использовать **без** Amplify CLI, но вы теряете:  
> - автоматическую генерацию `API.ts`  
> - интеграцию `@auth` с Cognito  
> - CLI-команды для миграций

---

## Заключение

Ваше решение — **монорепозиторий с ветками `dev`/`main` → QA/PROD** — является **золотым стандартом**.

**Итоговая архитектура**:
- ✅ **Amplify Console** сам развёртывает фронтенд при пуше в `dev`/`main`.
- ✅ **GitHub Actions** развёртывает SAM-инфраструктуру и обновляет `.env.local`.
- ✅ **Server actions** вызывают AppSync с JWT из HttpOnly cookie.
- ✅ **RBAC** реализована через Cognito Groups + `@auth` в GraphQL.

Такой подход **максимально автоматизирован**, **безопасен**, **соответствует best practices AWS** и **готов к масштабированию**.