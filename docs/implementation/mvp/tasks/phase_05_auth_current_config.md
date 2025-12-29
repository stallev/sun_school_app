# Текущая конфигурация Cognito - Phase 05 Auth

**Дата получения:** 27 декабря 2025  
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

**Текущее состояние (dev и prod идентичны):**
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
- Require: Uppercase, lowercase, number, special character ❌ (не настроено)

**Действие:** Необходимо обновить парольную политику для соответствия требованиям безопасности.

### Группы пользователей (Cognito Groups)

**Текущее состояние:**
- Группы не созданы (пустой список в обоих окружениях)

**Требуемые группы:**
- `TEACHER` (precedence: 1)
- `ADMIN` (precedence: 2)
- `SUPERADMIN` (precedence: 3)

**Действие:** Необходимо создать группы через конфигурацию или AWS CLI с последующим обновлением кода.

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

**Версия:** 1.0  
**Последнее обновление:** 27 декабря 2025

