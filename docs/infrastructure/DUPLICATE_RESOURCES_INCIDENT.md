# Инцидент: Дублирование AWS ресурсов в prod окружении

## Дата обнаружения
27 декабря 2025

## Описание проблемы

В prod окружении (регион `eu-west-1`) обнаружено дублирование AWS ресурсов. Созданы два набора ресурсов для одного логического окружения:

- **AppSync API**: `sunsch-master` (ID: `snd7mfqgj5dwvkciwos5pij2se`) и `sunsch-prod` (ID: `bsmpk33brzgwdezgdyqkpfy6zu`)
- **Cognito User Pools**: `sunsche716d941_userpool_e716d941-master` (ID: `eu-west-1_rKqutWlOx`) и `sunsche716d941_userpool_e716d941-prod` (ID: `eu-west-1_iQ7XIxudA`)
- **DynamoDB таблицы**: 17 таблиц с суффиксом `-snd7mfqgj5dwvkciwos5pij2se-master` и 17 таблиц с суффиксом `-bsmpk33brzgwdezgdyqkpfy6zu-prod`
- **CloudFormation стеки**: 22 стека с именем, содержащим `master` и соответствующие стеки для `prod`

**Важно:** Все ресурсы с суффиксом `-master` пустые (0 элементов в таблицах, 0 пользователей в Cognito) и не содержат production данных.

## Причина

**Установленная причина:** AWS Amplify Console автоматически создал backend окружение с именем `master` при подключении Git ветки `master` к Amplify App, когда не было явно указано backend окружение.

### Детальный анализ:

1. **Создание ресурсов:**
   - CloudFormation стеки с `master` созданы: **26 декабря 2025**
   - Cognito User Pool `-master` создан: **27 декабря 2025, 21:38:53 UTC+3**
   - AppSync API `sunsch-master` создан вместе со стеками

2. **Текущее состояние:**
   - Ветка `master` в AWS Amplify Console **сейчас правильно** связана с backend окружением `prod`
   - В локальной конфигурации `amplify/team-provider-info.json` есть только `dev` и `prod`, но нет `master`
   - В `amplify.yml` отсутствует логика автоматического выбора backend окружения по ветке

3. **Последовательность событий:**
   - При подключении ветки `master` к Amplify App через AWS Console не было указано явное backend окружение
   - AWS Amplify Console автоматически создал новое backend окружение с именем `master` (по имени ветки)
   - Это привело к созданию полного набора ресурсов: CloudFormation стеки, AppSync API, Cognito User Pool, DynamoDB таблицы
   - Позже настройка была исправлена вручную - ветка `master` была связана с существующим backend окружением `prod`
   - Однако ресурсы окружения `master` остались в AWS и не были удалены

4. **Почему это произошло:**
   - Отсутствие явного указания backend окружения при подключении ветки в AWS Amplify Console
   - Отсутствие логики автоматического выбора окружения в `amplify.yml`
   - Отсутствие проверки существующих ресурсов после изменения настроек

## Затронутые ресурсы

### AppSync API
- **Имя:** `sunsch-master`
- **API ID:** `snd7mfqgj5dwvkciwos5pij2se`
- **Регион:** `eu-west-1`
- **Статус:** Активен, но не используется

### Cognito User Pool
- **Имя:** `sunsche716d941_userpool_e716d941-master`
- **ID:** `eu-west-1_rKqutWlOx`
- **Регион:** `eu-west-1`
- **Пользователей:** 0
- **Дата создания:** 27 декабря 2025, 21:38:53 UTC+3

### DynamoDB таблицы (17 таблиц)
Все таблицы пустые (0 элементов):
- `AcademicYear-snd7mfqgj5dwvkciwos5pij2se-master`
- `Achievement-snd7mfqgj5dwvkciwos5pij2se-master`
- `Book-snd7mfqgj5dwvkciwos5pij2se-master`
- `Family-snd7mfqgj5dwvkciwos5pij2se-master`
- `FamilyMember-snd7mfqgj5dwvkciwos5pij2se-master`
- `GoldenVerse-snd7mfqgj5dwvkciwos5pij2se-master`
- `Grade-snd7mfqgj5dwvkciwos5pij2se-master`
- `GradeEvent-snd7mfqgj5dwvkciwos5pij2se-master`
- `GradeSettings-snd7mfqgj5dwvkciwos5pij2se-master`
- `HomeworkCheck-snd7mfqgj5dwvkciwos5pij2se-master`
- `Lesson-snd7mfqgj5dwvkciwos5pij2se-master`
- `LessonGoldenVerse-snd7mfqgj5dwvkciwos5pij2se-master`
- `Pupil-snd7mfqgj5dwvkciwos5pij2se-master`
- `PupilAchievement-snd7mfqgj5dwvkciwos5pij2se-master`
- `User-snd7mfqgj5dwvkciwos5pij2se-master`
- `UserFamily-snd7mfqgj5dwvkciwos5pij2se-master`
- `UserGrade-snd7mfqgj5dwvkciwos5pij2se-master`

### CloudFormation стеки (22 стека)
Основной стек: `amplify-sunschoolapp-master-7f420`
Дата создания: 26 декабря 2025

## Шаги предотвращения

### 1. Явное указание backend окружения при подключении веток

**При подключении Git ветки к Amplify App через AWS Console:**

- ✅ **Всегда явно указывать** backend окружение в настройках ветки
- ✅ **Не оставлять поле "Backend environment" пустым** - это приведет к автоматическому созданию нового окружения
- ✅ **Использовать существующие окружения** (`dev`, `prod`) вместо создания новых

**Правильная настройка:**
- Ветка `dev` → Backend environment: `dev`
- Ветка `master` → Backend environment: `prod`

### 2. Добавление логики выбора окружения в amplify.yml

**Добавить в `amplify.yml` секцию `backend` с автоматическим выбором окружения:**

```yaml
version: 1
backend:
  phases:
    build:
      commands:
        - |
          if [ "$AWS_BRANCH" = "master" ]; then
            amplifyPush --simple --environment prod
          elif [ "$AWS_BRANCH" = "dev" ]; then
            amplifyPush --simple --environment dev
          else
            amplifyPush --simple --environment dev
          fi
frontend:
  phases:
    preBuild:
      commands:
        - npm ci --cache .npm --prefer-offline
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - .next/cache/**/*
      - .npm/**/*
```

**Преимущества:**
- Автоматический выбор правильного окружения при деплое
- Защита от случайного создания нового окружения
- Явная логика маппинга веток на окружения

### 3. Проверка существующих ресурсов после изменения настроек

**После изменения настроек ветки в AWS Amplify Console:**

1. Проверить, что ветка связана с правильным backend окружением:
   ```bash
   aws amplify list-branches --app-id <APP_ID> --region <REGION> --query "branches[?branchName=='master']"
   ```

2. Проверить наличие дублирующих ресурсов:
   ```bash
   # Проверить AppSync API
   aws appsync list-graphql-apis --region <REGION> --query "graphqlApis[?contains(name, 'master')]"
   
   # Проверить Cognito User Pools
   aws cognito-idp list-user-pools --max-results 10 --region <REGION> --query "UserPools[?contains(Name, 'master')]"
   
   # Проверить DynamoDB таблицы
   aws dynamodb list-tables --region <REGION> --query "TableNames[?contains(@, 'master')]"
   
   # Проверить CloudFormation стеки
   aws cloudformation list-stacks --region <REGION> --query "StackSummaries[?contains(StackName, 'master')]"
   ```

3. Если найдены дублирующие ресурсы - удалить их немедленно

### 4. Документирование процесса подключения веток

**Создать чек-лист для подключения новых веток:**

- [ ] Проверить существующие backend окружения: `amplify env list`
- [ ] Определить, какое окружение использовать для ветки
- [ ] При подключении ветки в AWS Console явно указать backend окружение
- [ ] Проверить настройки после подключения
- [ ] Убедиться, что не создались новые ресурсы
- [ ] Обновить `amplify.yml` с логикой выбора окружения (если нужно)

### 5. Регулярный аудит ресурсов

**Периодически проверять наличие неиспользуемых ресурсов:**

```bash
# Скрипт для проверки дублирующих ресурсов
#!/bin/bash
REGION="eu-west-1"

echo "Checking for duplicate resources..."

# AppSync APIs
echo "AppSync APIs:"
aws appsync list-graphql-apis --region $REGION --query "graphqlApis[*].{Name:name,ApiId:apiId}" --output table

# Cognito User Pools
echo "Cognito User Pools:"
aws cognito-idp list-user-pools --max-results 10 --region $REGION --query "UserPools[*].{Name:Name,Id:Id}" --output table

# DynamoDB tables
echo "DynamoDB Tables:"
aws dynamodb list-tables --region $REGION --output table

# CloudFormation stacks
echo "CloudFormation Stacks:"
aws cloudformation list-stacks --region $REGION --stack-status-filter CREATE_COMPLETE UPDATE_COMPLETE --query "StackSummaries[*].{Name:StackName,Status:StackStatus}" --output table
```

## Рекомендации

### 1. Использовать только явно определенные окружения

- ✅ Использовать только окружения, определенные в `amplify/team-provider-info.json`
- ✅ Не создавать новые окружения через AWS Console без обновления локальной конфигурации
- ✅ Всегда использовать `amplify env add` для создания новых окружений

### 2. Централизованное управление окружениями

- ✅ Хранить все настройки окружений в `amplify/team-provider-info.json`
- ✅ Использовать Git для версионирования конфигурации окружений
- ✅ Документировать назначение каждого окружения

### 3. Автоматизация проверок

- ✅ Добавить проверку дублирующих ресурсов в CI/CD pipeline
- ✅ Создать скрипт для автоматического обнаружения неиспользуемых ресурсов
- ✅ Настроить уведомления при обнаружении подозрительных ресурсов

### 4. Мониторинг стоимости

- ✅ Регулярно проверять стоимость AWS ресурсов
- ✅ Настроить CloudWatch alarms для неожиданного роста стоимости
- ✅ Удалять неиспользуемые ресурсы для снижения затрат

### 5. Документирование инцидентов

- ✅ Создавать документы для каждого инцидента (как этот)
- ✅ Обновлять документацию с извлеченными уроками
- ✅ Проводить ретроспективы после инцидентов

## Дата устранения

27 декабря 2025, 21:45 UTC+3

## Действия по устранению

1. ✅ Анализ причины дублирования
2. ✅ Документирование проблемы
3. ✅ Удаление дублирующих ресурсов через AWS CLI:
   - Удалено 17 таблиц DynamoDB с суффиксом `-master`
   - Удален AppSync API `sunsch-master` (ID: `snd7mfqgj5dwvkciwos5pij2se`)
   - Удален Cognito User Pool `sunsche716d941_userpool_e716d941-master` (ID: `eu-west-1_rKqutWlOx`)
   - Удалено 22 CloudFormation стека с именем, содержащим `master`
4. ✅ Проверка локальной конфигурации - подтверждено, что в `amplify/team-provider-info.json` только `dev` и `prod`
5. ✅ Финальная проверка - все дублирующие ресурсы удалены, ресурсы `prod` работают корректно

## Связанные документы

- [AWS_AMPLIFY.md](./AWS_AMPLIFY.md) - Документация по AWS Amplify
- [DEPLOYMENT_GUIDE.md](../deployment/DEPLOYMENT_GUIDE.md) - Руководство по развертыванию
- [CI_CD.md](./CI_CD.md) - Документация по CI/CD
- [BRANCH_SETUP_CHECKLIST.md](./BRANCH_SETUP_CHECKLIST.md) - Чек-лист для подключения Git веток
- Скрипты проверки:
  - `scripts/check-duplicate-resources.sh` - Bash скрипт для проверки дублирующих ресурсов
  - `scripts/check-duplicate-resources.ps1` - PowerShell скрипт для проверки дублирующих ресурсов

