# Чек-лист: Подключение Git ветки к AWS Amplify

Этот чек-лист помогает правильно подключить Git ветку к AWS Amplify App и предотвратить создание дублирующих ресурсов.

## Перед подключением ветки

### Шаг 1: Проверка существующих backend окружений

```bash
amplify env list
```

**Ожидаемый результат:**
- Список всех доступных окружений (например, `dev`, `prod`)
- Активное окружение отмечено звездочкой `*`

**Действие:**
- [ ] Записать список доступных окружений
- [ ] Определить, какое окружение использовать для новой ветки

### Шаг 2: Определение маппинга ветка → окружение

**Стандартный маппинг:**
- Ветка `dev` → Backend environment: `dev`
- Ветка `master` → Backend environment: `prod`
- Ветка `main` → Backend environment: `prod` (если используется вместо `master`)
- Другие ветки → Backend environment: `dev` (по умолчанию)

**Действие:**
- [ ] Определить, какое backend окружение использовать для ветки
- [ ] Записать маппинг: `[ИМЯ_ВЕТКИ] → [ОКРУЖЕНИЕ]`

## Подключение ветки в AWS Amplify Console

### Шаг 3: Подключение ветки

1. Открыть AWS Amplify Console → Ваш App
2. Перейти в "App settings" → "General"
3. Нажать "Connect branch"
4. Выбрать Git репозиторий и ветку

**Действие:**
- [ ] Ветка выбрана правильно
- [ ] Репозиторий выбран правильно

### Шаг 4: Настройка backend окружения (КРИТИЧНО!)

**⚠️ ВАЖНО: Не оставлять поле "Backend environment" пустым!**

1. В разделе "Backend environment" **явно выбрать** существующее окружение
2. Использовать окружение, определенное на Шаге 2

**Действие:**
- [ ] Поле "Backend environment" заполнено
- [ ] Выбрано правильное окружение (из Шага 2)
- [ ] НЕ выбрано "Create new environment" или "Auto-create"

### Шаг 5: Проверка настроек Build

1. Перейти в "App settings" → "Build settings" для новой ветки
2. Проверить, что "Backend environment" соответствует выбранному на Шаге 4

**Действие:**
- [ ] Backend environment в Build settings совпадает с выбранным на Шаге 4
- [ ] `amplify.yml` содержит правильную логику выбора окружения (если используется)

## После подключения ветки

### Шаг 6: Проверка связи ветки с окружением

```bash
aws amplify list-branches --app-id <APP_ID> --region <REGION> --query "branches[?branchName=='<BRANCH_NAME>']"
```

**Ожидаемый результат:**
- Ветка связана с правильным backend окружением
- `BackendEnvironmentArn` указывает на выбранное окружение

**Действие:**
- [ ] Ветка связана с правильным окружением
- [ ] `BackendEnvironmentArn` корректен

### Шаг 7: Проверка отсутствия дублирующих ресурсов

**Проверить наличие ресурсов с именем ветки:**

```bash
# Проверить AppSync API
aws appsync list-graphql-apis --region <REGION> --query "graphqlApis[?contains(name, '<BRANCH_NAME>')]"

# Проверить Cognito User Pools
aws cognito-idp list-user-pools --max-results 10 --region <REGION> --query "UserPools[?contains(Name, '<BRANCH_NAME>')]"

# Проверить DynamoDB таблицы
aws dynamodb list-tables --region <REGION> --query "TableNames[?contains(@, '<BRANCH_NAME>')]"

# Проверить CloudFormation стеки
aws cloudformation list-stacks --region <REGION> --query "StackSummaries[?contains(StackName, '<BRANCH_NAME>')]"
```

**Или использовать скрипт:**

```bash
./scripts/check-duplicate-resources.sh <REGION>
```

**Ожидаемый результат:**
- Нет ресурсов с именем ветки (кроме ресурсов, связанных с правильным окружением)

**Действие:**
- [ ] Нет дублирующих AppSync API
- [ ] Нет дублирующих Cognito User Pools
- [ ] Нет дублирующих DynamoDB таблиц
- [ ] Нет дублирующих CloudFormation стеков

### Шаг 8: Обновление amplify.yml (если нужно)

Если ветка требует специальной логики выбора окружения, обновить `amplify.yml`:

```yaml
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
```

**Действие:**
- [ ] `amplify.yml` содержит логику для новой ветки (если нужно)
- [ ] Логика протестирована

## Если обнаружены дублирующие ресурсы

### Немедленные действия:

1. **НЕ использовать** дублирующие ресурсы
2. **Удалить** дублирующие ресурсы через AWS CLI
3. **Проверить** настройки ветки в AWS Amplify Console
4. **Исправить** связь ветки с правильным окружением
5. **Документировать** инцидент (см. `DUPLICATE_RESOURCES_INCIDENT.md`)

## Регулярная проверка

### Еженедельный аудит:

```bash
# Запустить скрипт проверки
./scripts/check-duplicate-resources.sh eu-west-1
```

**Действие:**
- [ ] Скрипт выполнен без ошибок
- [ ] Нет предупреждений о дублирующих ресурсах

## Связанные документы

- [DUPLICATE_RESOURCES_INCIDENT.md](./DUPLICATE_RESOURCES_INCIDENT.md) - Описание инцидента и шаги предотвращения
- [AWS_AMPLIFY.md](./AWS_AMPLIFY.md) - Документация по AWS Amplify
- [DEPLOYMENT_GUIDE.md](../deployment/DEPLOYMENT_GUIDE.md) - Руководство по развертыванию

## Контакты

При обнаружении проблем или вопросов:
1. Проверить документацию
2. Запустить скрипт проверки дублирующих ресурсов
3. Создать инцидент в документации (если нужно)

