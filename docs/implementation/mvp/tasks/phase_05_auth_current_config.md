# Текущая конфигурация Cognito - Phase 05 Auth

**Дата получения:** 29 декабря 2025  
**Последнее обновление:** 29 декабря 2025  
**Метод получения:** AWS CLI команды

## Обзор окружений

### Dev окружение
- **Region:** us-east-1
- **User Pool ID:** `us-east-1_FORzY4ey4`
- **User Pool Name:** `sunsche716d941_userpool_e716d941-dev`
- **Client ID (Web):** `5hq66dq341pt5peavra3bqpd7b`
- **Client Name:** `sunsche716d941_app_clientWeb`
- **CloudFormation Stack:** `amplify-sunsch-dev-f567d-authsunsche716d941-RQTD842J4ABV`

### Prod окружение
- **Region:** eu-west-1
- **User Pool ID:** `eu-west-1_iQ7XIxudA`
- **User Pool Name:** `sunsche716d941_userpool_e716d941-prod`
- **CloudFormation Stack:** `amplify-sunsch-prod-e50ea-authsunsche716d941-MUMSWGI6BTJB`

## Детальная конфигурация

### Парольная политика (Password Policy)

**Текущее состояние в конфигурационных файлах:**
```json
{
  "passwordPolicyMinLength": 8,
  "passwordPolicyCharacters": [
    "REQUIRE_UPPERCASE",
    "REQUIRE_NUMBERS"
  ]
}
```

**Текущее состояние в AWS (dev и prod):**
```json
{
  "MinimumLength": 8,
  "RequireUppercase": false,
  "RequireLowercase": false,
  "RequireNumbers": false,
  "RequireSymbols": false,
  "TemporaryPasswordValidityDays": 7
}
```

**Требования из SECURITY.md:**
- Minimum length: 8 characters ✅ (соответствует)
- Require: Uppercase, number ✅ (настроено в конфигурационных файлах)

**Статус:**
- ✅ Конфигурация обновлена в `amplify/backend/auth/sunsche716d941/cli-inputs.json`
- ✅ Конфигурация обновлена в `amplify/backend/backend-config.json`
- ⏳ Требуется применение изменений через `amplify push` для dev окружения
- ⏳ Требуется применение изменений через `amplify push` для prod окружения

**Действие:** Применить изменения через `amplify push` для обоих окружений.

### Группы пользователей (Cognito Groups)

**Текущее состояние:**
- ✅ Группы созданы для dev окружения (29.12.2025)
- ⏳ Группы не созданы для prod окружения (ожидают деплоя конфигурации в prod)

**Созданные группы (dev окружение):**
- ✅ `TEACHER` (precedence: 1) - "Sunday School Teachers"
  - Creation Date: 2025-12-29T13:13:47.561000+03:00
  - User Pool ID: us-east-1_FORzY4ey4
  - Region: us-east-1
- ✅ `ADMIN` (precedence: 2) - "Sunday School Administrators"
  - Creation Date: 2025-12-29T13:13:57.961000+03:00
  - User Pool ID: us-east-1_FORzY4ey4
  - Region: us-east-1
- ✅ `SUPERADMIN` (precedence: 3) - "Sunday School Super Administrators"
  - Creation Date: 2025-12-29T13:14:02.939000+03:00
  - User Pool ID: us-east-1_FORzY4ey4
  - Region: us-east-1

**Проверка групп через AWS CLI:**
```bash
# Список всех групп
aws cognito-idp list-groups --user-pool-id us-east-1_FORzY4ey4 --region us-east-1 --output table

# Детали конкретной группы
aws cognito-idp get-group --user-pool-id us-east-1_FORzY4ey4 --group-name TEACHER --region us-east-1
aws cognito-idp get-group --user-pool-id us-east-1_FORzY4ey4 --group-name ADMIN --region us-east-1
aws cognito-idp get-group --user-pool-id us-east-1_FORzY4ey4 --group-name SUPERADMIN --region us-east-1
```

**Документация:**
- [COGNITO_GROUPS.md](../../../infrastructure/COGNITO_GROUPS.md) - полная документация по группам
- [AWS_CLI_SCRIPTS.md](../../../infrastructure/AWS_CLI_SCRIPTS.md) - инструкции по созданию групп через AWS CLI

**Статус:** ✅ Группы созданы для dev окружения (проверено через AWS CLI 29.12.2025)

### Настройки токенов (Token Settings)

**Текущее состояние (dev):**
```json
{
  "RefreshTokenValidity": 30,
  "TokenValidityUnits": {
    "RefreshToken": "days"
  },
  "AuthSessionValidity": 3
}
```

**Примечание:** ID Token и Access Token expiration не видны в текущем выводе, возможно используют значения по умолчанию (1 час).

**Требования:**
- ID Token expiration: 1 day
- Access Token expiration: 1 day
- Refresh Token expiration: 30 days ✅ (соответствует)

**Действие:** Необходимо проверить и настроить ID Token и Access Token expiration.

### Email верификация

**Текущее состояние (dev и prod идентичны):**
```json
{
  "AutoVerifiedAttributes": ["email"],
  "UsernameAttributes": ["email"],
  "EmailVerificationMessage": "Your verification code is {####}",
  "EmailVerificationSubject": "Your verification code",
  "VerificationMessageTemplate": {
    "EmailMessage": "Your verification code is {####}",
    "EmailSubject": "Your verification code",
    "DefaultEmailOption": "CONFIRM_WITH_CODE"
  },
  "EmailConfiguration": {
    "EmailSendingAccount": "COGNITO_DEFAULT"
  }
}
```

**Статус:** ✅ Настроено правильно для MVP

### MFA (Multi-Factor Authentication)

**Текущее состояние:**
- `MfaConfiguration: "OFF"` ✅ (соответствует требованиям MVP)

### Другие настройки

**Schema Attributes:**
- Email: required ✅
- Email verified: optional
- Другие стандартные атрибуты Cognito

**Username Configuration:**
- `CaseSensitive: false` ✅

**Account Recovery:**
- Priority 1: verified_email ✅
- Priority 2: verified_phone_number

**User Pool Tier:**
- `ESSENTIALS` (базовый уровень)

## Сравнение dev и prod

**Идентичность настроек:**
- ✅ Парольная политика идентична
- ✅ Email верификация идентична
- ✅ MFA настройки идентичны
- ✅ Schema attributes идентичны
- ✅ Группы пользователей: обе пустые (идентичны)

**Различия (ожидаемые):**
- User Pool ID (автоматически генерируется)
- Region (dev: us-east-1, prod: eu-west-1)
- CloudFormation Stack names

## Выводы и рекомендации

### Критические задачи

1. **Парольная политика:** Обновить для соответствия SECURITY.md требованиям
   - Добавить требования: Uppercase, Lowercase, Numbers, Symbols

2. **Группы пользователей:** Создать группы TEACHER, ADMIN, SUPERADMIN
   - Настроить правильный precedence
   - Настроить IAM роли для групп

3. **Настройки токенов:** Проверить и настроить ID Token и Access Token expiration

### Задачи для Infrastructure as Code

1. Обновить `amplify/backend/auth/sunsche716d941/cli-inputs.json` с полной конфигурацией
2. Добавить конфигурацию групп в код (если поддерживается Amplify CLI)
3. Документировать настройки, которые не поддерживаются через CLI
4. Создать процесс синхронизации между dev и prod

## Команды AWS CLI для получения информации

### Dev окружение
```bash
# Описание User Pool
aws cognito-idp describe-user-pool --user-pool-id us-east-1_FORzY4ey4 --region us-east-1

# Список клиентов
aws cognito-idp list-user-pool-clients --user-pool-id us-east-1_FORzY4ey4 --region us-east-1

# Описание клиента
aws cognito-idp describe-user-pool-client --user-pool-id us-east-1_FORzY4ey4 --client-id 5hq66dq341pt5peavra3bqpd7b --region us-east-1

# Список групп
aws cognito-idp list-groups --user-pool-id us-east-1_FORzY4ey4 --region us-east-1
```

### Prod окружение
```bash
# Описание User Pool
aws cognito-idp describe-user-pool --user-pool-id eu-west-1_iQ7XIxudA --region eu-west-1

# Список клиентов
aws cognito-idp list-user-pool-clients --user-pool-id eu-west-1_iQ7XIxudA --region eu-west-1

# Список групп
aws cognito-idp list-groups --user-pool-id eu-west-1_iQ7XIxudA --region eu-west-1
```

---

## Статус задач Phase 05 Auth

**Дата проверки:** 29 декабря 2025  
**Метод проверки:** AWS CLI команды и проверка конфигурационных файлов

### Выполненные задачи

- ✅ **Task 05.00:** Получение информации о текущей конфигурации Cognito
  - Файл `phase_05_auth_current_config.md` создан и содержит актуальную информацию
  - User Pool IDs определены для обоих окружений

- ✅ **Task 05.01:** Обновление конфигурации Auth в Amplify
  - Файл `amplify/backend/auth/sunsche716d941/cli-inputs.json` обновлен
  - Парольная политика настроена в коде: REQUIRE_UPPERCASE, REQUIRE_LOWERCASE, REQUIRE_NUMBERS, REQUIRE_SYMBOLS
  - ⚠️ **Примечание:** Изменения не применены через `amplify push` (см. Task 05.02 и 05.10)

- ✅ **Task 05.06:** Проверка идентичности настроек dev и prod
  - Настройки dev и prod идентичны:
    - Парольная политика: одинаковая (MinimumLength: 8, все Require* = false)
    - MFA: OFF в обоих окружениях
    - AutoVerifiedAttributes: ["email"] в обоих окружениях
  - Различия только в автоматически генерируемых значениях (User Pool ID, Client ID, Region)

- ✅ **Task 05.11:** Проверка конфигурации в amplifyconfiguration.json
  - Файл `src/amplifyconfiguration.json` существует
  - Содержит правильные User Pool ID и Client ID для dev окружения
  - ⚠️ **Примечание:** passwordPolicyCharacters пустой массив (изменения не применены)

### Не выполненные задачи

- ❌ **Task 05.02:** Настройка парольной политики в коде
  - **Проблема:** Парольная политика настроена в `cli-inputs.json`, но не применена в AWS
  - **Текущее состояние:**
    - Dev: MinimumLength: 8, RequireUppercase: false, RequireLowercase: false, RequireNumbers: false, RequireSymbols: false
    - Prod: MinimumLength: 8, RequireUppercase: false, RequireLowercase: false, RequireNumbers: false, RequireSymbols: false
  - **Требуется:** Выполнить `amplify push` для применения изменений (Task 05.10)

- ❌ **Task 05.03:** Создание групп пользователей (Cognito Groups)
  - **Проблема:** Группы не созданы в обоих окружениях
  - **Текущее состояние:**
    - Dev: Groups: [] (пустой список)
    - Prod: Groups: [] (пустой список)
  - **Требуется:** Выполнить скрипты `scripts/create-cognito-groups.sh` или `scripts/create-cognito-groups.ps1`
  - **Документация:** [AWS_CLI_SCRIPTS.md](../../../infrastructure/AWS_CLI_SCRIPTS.md)

- ❌ **Task 05.10:** Применение изменений к dev и prod окружениям
  - **Проблема:** Изменения в конфигурационных файлах не применены через `amplify push`
  - **Требуется:** Выполнить `amplify push` для обоих окружений

### Рекомендации

1. **Приоритет 1:** Выполнить Task 05.10 (amplify push) для применения парольной политики
2. **Приоритет 2:** Выполнить Task 05.03 (создание групп) через AWS CLI скрипты
3. **После выполнения:** Повторить проверку через AWS CLI для подтверждения применения изменений

---

**Версия:** 1.1  
**Последнее обновление:** 29 декабря 2025

