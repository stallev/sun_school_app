# Phase 05: Настройка аутентификации (Cognito) - Manual Guide

## Document Version: 1.0
**Creation Date:** 27 December 2025  
**Last Update:** 27 December 2025  
**Project:** Sunday School App  
**Phase:** Phase 05 - Authentication Setup

---

## 1. Введение

### 1.1. Цель фазы

Настройка AWS Cognito User Pools для аутентификации пользователей, создание групп пользователей (TEACHER, ADMIN, SUPERADMIN), настройка политик авторизации и интеграция с AppSync.

### 1.2. Принципы Infrastructure as Code

**⚠️ CRITICAL:** Все настройки Cognito должны быть сохранены в конфигурационных файлах Amplify. Ручные изменения через AWS Console **ЗАПРЕЩЕНЫ**.

**Ключевые принципы:**
- Вся конфигурация хранится в коде (`amplify/backend/auth/*/cli-inputs.json`, `amplify/backend/backend-config.json`)
- Dev и prod окружения должны иметь идентичную конфигурацию (кроме автоматически генерируемых значений)
- Все изменения проходят через Git commits
- Информация о текущей инфраструктуре получается через конфигурационные файлы или AWS CLI

**См. [INFRASTRUCTURE_AS_CODE.md](../../../../infrastructure/INFRASTRUCTURE_AS_CODE.md) для детальных требований.**

### 1.3. Обзор задач

1. **Task 05.00:** Получение информации о текущей конфигурации Cognito
2. **Task 05.01:** Обновление конфигурации Auth в Amplify
3. **Task 05.02:** Настройка парольной политики в коде
4. **Task 05.03:** Создание групп пользователей (Cognito Groups)
5. **Task 05.04:** Настройка IAM ролей для групп
6. **Task 05.05:** Интеграция Cognito с AppSync
7. **Task 05.06:** Проверка идентичности настроек dev и prod
8. **Task 05.07:** Создание тестовых пользователей
9. **Task 05.08:** Тестирование аутентификации
10. **Task 05.09:** Настройка email верификации
11. **Task 05.10:** Применение изменений к dev и prod окружениям
12. **Task 05.11:** Проверка конфигурации в amplifyconfiguration.json
13. **Task 05.12:** Документирование настроек аутентификации
14. **Task 05.13:** Финальная проверка настройки

---

## 2. Предварительные требования

### 2.1. Установка AWS CLI

**Проверка установки:**
```bash
aws --version
```

**Если не установлен:**
- Windows: https://aws.amazon.com/cli/
- Mac: `brew install awscli`
- Linux: `sudo apt-get install awscli`

### 2.2. Настройка AWS Credentials

**Проверка текущих credentials:**
```bash
aws configure list
```

**Настройка credentials (если необходимо):**
```bash
aws configure
```

**Введите:**
- AWS Access Key ID
- AWS Secret Access Key
- Default region: `us-east-1` (для dev) или `eu-west-1` (для prod)
- Default output format: `json`

### 2.3. Установка Amplify CLI

**Проверка установки:**
```bash
amplify --version
```

**Если не установлен:**
```bash
npm install -g @aws-amplify/cli
```

### 2.4. Доступ к окружениям

**Проверка доступных окружений:**
```bash
amplify env list
```

**Ожидаемый результат:**
```
| Environments |
| ------------ |
| *dev         |
|  prod        |
```

**Переключение между окружениями:**
```bash
amplify env checkout dev    # Переключиться на dev
amplify env checkout prod   # Переключиться на prod
```

---

## 3. Task 05.00: Получение информации о текущей конфигурации Cognito

### 3.1. Определение User Pool IDs

**Метод 1: Из amplifyconfiguration.json (для dev)**
```bash
cat src/amplifyconfiguration.json | grep aws_user_pools_id
```

**Метод 2: Из CloudFormation stack outputs**
```bash
# Dev окружение
aws cloudformation describe-stacks \
  --stack-name amplify-sunsch-dev-f567d \
  --region us-east-1 \
  --query "Stacks[0].Outputs"

# Prod окружение
aws cloudformation describe-stacks \
  --stack-name amplify-sunsch-prod-e50ea \
  --region eu-west-1 \
  --query "Stacks[0].Outputs"
```

**Метод 3: Через список User Pools**
```bash
# Dev окружение
aws cognito-idp list-user-pools --max-results 10 --region us-east-1 \
  --query "UserPools[?contains(Name, 'sunsche716d941')].{Id:Id,Name:Name}"

# Prod окружение
aws cognito-idp list-user-pools --max-results 10 --region eu-west-1 \
  --query "UserPools[?contains(Name, 'sunsche716d941')].{Id:Id,Name:Name}"
```

### 3.2. Получение детальной информации о User Pool

**Dev окружение:**
```bash
aws cognito-idp describe-user-pool \
  --user-pool-id us-east-1_FORzY4ey4 \
  --region us-east-1 \
  --output json > dev_user_pool_config.json
```

**Prod окружение:**
```bash
aws cognito-idp describe-user-pool \
  --user-pool-id eu-west-1_iQ7XIxudA \
  --region eu-west-1 \
  --output json > prod_user_pool_config.json
```

### 3.3. Получение информации о клиентах

**Dev окружение:**
```bash
aws cognito-idp list-user-pool-clients \
  --user-pool-id us-east-1_FORzY4ey4 \
  --region us-east-1 \
  --output json > dev_clients.json
```

**Prod окружение:**
```bash
aws cognito-idp list-user-pool-clients \
  --user-pool-id eu-west-1_iQ7XIxudA \
  --region eu-west-1 \
  --output json > prod_clients.json
```

### 3.4. Получение информации о группах

**Dev окружение:**
```bash
aws cognito-idp list-groups \
  --user-pool-id us-east-1_FORzY4ey4 \
  --region us-east-1 \
  --output json > dev_groups.json
```

**Prod окружение:**
```bash
aws cognito-idp list-groups \
  --user-pool-id eu-west-1_iQ7XIxudA \
  --region eu-west-1 \
  --output json > prod_groups.json
```

### 3.5. Сохранение информации

**Создать файл с текущей конфигурацией:**
```bash
# Создать файл docs/implementation/mvp/tasks/phase_05_auth_current_config.md
# Сохранить полученную информацию в структурированном виде
```

**См. [phase_05_auth_current_config.md](../tasks/phase_05_auth_current_config.md) для примера структуры.**

---

## 4. Task 05.01: Обновление конфигурации Auth в Amplify

### 4.1. Структура файлов конфигурации

**Основные файлы:**
- `amplify/backend/auth/sunsche716d941/cli-inputs.json` - основная конфигурация auth
- `amplify/backend/backend-config.json` - общая конфигурация backend

### 4.2. Обновление парольной политики

**Файл: `amplify/backend/auth/sunsche716d941/cli-inputs.json`**

**Найти секцию:**
```json
"passwordPolicyCharacters": []
```

**Обновить на:**
```json
"passwordPolicyCharacters": [
  "REQUIRE_UPPERCASE",
  "REQUIRE_LOWERCASE",
  "REQUIRE_NUMBERS",
  "REQUIRE_SYMBOLS"
]
```

**Файл: `amplify/backend/backend-config.json`**

**Найти секцию:**
```json
"passwordProtectionSettings": {
  "passwordPolicyCharacters": [],
  "passwordPolicyMinLength": 8
}
```

**Обновить на:**
```json
"passwordProtectionSettings": {
  "passwordPolicyCharacters": [
    "REQUIRE_UPPERCASE",
    "REQUIRE_LOWERCASE",
    "REQUIRE_NUMBERS",
    "REQUIRE_SYMBOLS"
  ],
  "passwordPolicyMinLength": 8
}
```

### 4.3. Проверка других настроек

**Убедиться, что следующие настройки корректны:**
- `passwordPolicyMinLength: 8` ✅
- `defaultPasswordPolicy: false` ✅
- `autoVerifiedAttributes: ["email"]` ✅
- `mfaConfiguration: "OFF"` ✅
- `usernameAttributes: ["email"]` ✅
- `userpoolClientRefreshTokenValidity: 30` ✅

---

## 5. Task 05.02: Применение парольной политики

### 5.1. Применение к dev окружению

**Шаг 1: Переключиться на dev окружение**
```bash
amplify env checkout dev
```

**Шаг 2: Проверить изменения**
```bash
amplify status
```

**Шаг 3: Применить изменения**
```bash
amplify push
```

**Подтвердить изменения:**
- Нажать `Y` для подтверждения
- Дождаться завершения обновления

### 5.2. Проверка примененных изменений

**Проверить парольную политику:**
```bash
aws cognito-idp describe-user-pool \
  --user-pool-id us-east-1_FORzY4ey4 \
  --region us-east-1 \
  --query "UserPool.Policies.PasswordPolicy"
```

**Ожидаемый результат:**
```json
{
  "MinimumLength": 8,
  "RequireUppercase": true,
  "RequireLowercase": true,
  "RequireNumbers": true,
  "RequireSymbols": true,
  "TemporaryPasswordValidityDays": 7
}
```

### 5.3. Применение к prod окружению

**Шаг 1: Переключиться на prod окружение**
```bash
amplify env checkout prod
```

**Шаг 2: Проверить изменения**
```bash
amplify status
```

**Шаг 3: Применить изменения**
```bash
amplify push
```

**Шаг 4: Проверить примененные изменения**
```bash
aws cognito-idp describe-user-pool \
  --user-pool-id eu-west-1_iQ7XIxudA \
  --region eu-west-1 \
  --query "UserPool.Policies.PasswordPolicy"
```

---

## 6. Task 05.03: Создание групп пользователей

### 6.1. Создание скрипта для создания групп

**Создать файл: `scripts/create-cognito-groups.sh` (Linux/Mac) или `scripts/create-cognito-groups.ps1` (Windows)**

**Содержимое скрипта (bash):**
```bash
#!/bin/bash

# Параметры
USER_POOL_ID=$1
REGION=$2

if [ -z "$USER_POOL_ID" ] || [ -z "$REGION" ]; then
  echo "Usage: ./create-cognito-groups.sh <USER_POOL_ID> <REGION>"
  exit 1
fi

# Создать группу TEACHER
echo "Creating TEACHER group..."
aws cognito-idp create-group \
  --user-pool-id $USER_POOL_ID \
  --group-name TEACHER \
  --description "Преподаватели воскресной школы" \
  --precedence 1 \
  --region $REGION

# Создать группу ADMIN
echo "Creating ADMIN group..."
aws cognito-idp create-group \
  --user-pool-id $USER_POOL_ID \
  --group-name ADMIN \
  --description "Администраторы воскресной школы" \
  --precedence 2 \
  --region $REGION

# Создать группу SUPERADMIN
echo "Creating SUPERADMIN group..."
aws cognito-idp create-group \
  --user-pool-id $USER_POOL_ID \
  --group-name SUPERADMIN \
  --description "Главные администраторы" \
  --precedence 3 \
  --region $REGION

echo "Groups created successfully!"
```

**Содержимое скрипта (PowerShell):**
```powershell
param(
    [Parameter(Mandatory=$true)]
    [string]$UserPoolId,
    
    [Parameter(Mandatory=$true)]
    [string]$Region
)

# Создать группу TEACHER
Write-Host "Creating TEACHER group..."
aws cognito-idp create-group `
  --user-pool-id $UserPoolId `
  --group-name TEACHER `
  --description "Преподаватели воскресной школы" `
  --precedence 1 `
  --region $Region

# Создать группу ADMIN
Write-Host "Creating ADMIN group..."
aws cognito-idp create-group `
  --user-pool-id $UserPoolId `
  --group-name ADMIN `
  --description "Администраторы воскресной школы" `
  --precedence 2 `
  --region $Region

# Создать группу SUPERADMIN
Write-Host "Creating SUPERADMIN group..."
aws cognito-idp create-group `
  --user-pool-id $UserPoolId `
  --group-name SUPERADMIN `
  --description "Главные администраторы" `
  --precedence 3 `
  --region $Region

Write-Host "Groups created successfully!"
```

### 6.2. Выполнение скрипта для dev окружения

**Linux/Mac:**
```bash
chmod +x scripts/create-cognito-groups.sh
./scripts/create-cognito-groups.sh us-east-1_FORzY4ey4 us-east-1
```

**Windows (PowerShell):**
```powershell
.\scripts\create-cognito-groups.ps1 -UserPoolId "us-east-1_FORzY4ey4" -Region "us-east-1"
```

### 6.3. Выполнение скрипта для prod окружения

**Linux/Mac:**
```bash
./scripts/create-cognito-groups.sh eu-west-1_iQ7XIxudA eu-west-1
```

**Windows (PowerShell):**
```powershell
.\scripts\create-cognito-groups.ps1 -UserPoolId "eu-west-1_iQ7XIxudA" -Region "eu-west-1"
```

### 6.4. Проверка созданных групп

**Dev окружение:**
```bash
aws cognito-idp list-groups \
  --user-pool-id us-east-1_FORzY4ey4 \
  --region us-east-1 \
  --output table
```

**Prod окружение:**
```bash
aws cognito-idp list-groups \
  --user-pool-id eu-west-1_iQ7XIxudA \
  --region eu-west-1 \
  --output table
```

**Ожидаемый результат:**
```
| GroupName   | Precedence | Description                    |
| ----------- | ---------- | ------------------------------ |
| TEACHER     | 1          | Преподаватели воскресной школы |
| ADMIN       | 2          | Администраторы воскресной школы|
| SUPERADMIN  | 3          | Главные администраторы         |
```

---

## 7. Task 05.06: Проверка идентичности настроек dev и prod

### 7.1. Получение конфигураций

**Сохранить конфигурации в файлы:**
```bash
# Dev
aws cognito-idp describe-user-pool \
  --user-pool-id us-east-1_FORzY4ey4 \
  --region us-east-1 \
  --output json > dev_config.json

# Prod
aws cognito-idp describe-user-pool \
  --user-pool-id eu-west-1_iQ7XIxudA \
  --region eu-west-1 \
  --output json > prod_config.json
```

### 7.2. Сравнение настроек

**Сравнить парольную политику:**
```bash
# Dev
aws cognito-idp describe-user-pool \
  --user-pool-id us-east-1_FORzY4ey4 \
  --region us-east-1 \
  --query "UserPool.Policies.PasswordPolicy"

# Prod
aws cognito-idp describe-user-pool \
  --user-pool-id eu-west-1_iQ7XIxudA \
  --region eu-west-1 \
  --query "UserPool.Policies.PasswordPolicy"
```

**Сравнить группы:**
```bash
# Dev
aws cognito-idp list-groups \
  --user-pool-id us-east-1_FORzY4ey4 \
  --region us-east-1

# Prod
aws cognito-idp list-groups \
  --user-pool-id eu-west-1_iQ7XIxudA \
  --region eu-west-1
```

### 7.3. Проверка идентичности

**Настройки, которые должны быть идентичны:**
- ✅ Парольная политика (PasswordPolicy)
- ✅ MFA настройки (MfaConfiguration)
- ✅ Email верификация (AutoVerifiedAttributes, VerificationMessageTemplate)
- ✅ Schema attributes
- ✅ Username configuration
- ✅ Account recovery settings
- ✅ Группы пользователей (названия, precedence, описания)

**Настройки, которые могут отличаться (автоматически генерируемые):**
- User Pool ID
- Client ID
- Region
- CloudFormation Stack names

---

## 8. Task 05.07: Создание тестовых пользователей

### 8.1. Создание пользователя через AWS CLI

**Создать пользователя TEACHER:**
```bash
aws cognito-idp admin-create-user \
  --user-pool-id us-east-1_FORzY4ey4 \
  --username teacher@test.com \
  --user-attributes Name=email,Value=teacher@test.com Name=email_verified,Value=true \
  --temporary-password "TempPass123!" \
  --message-action SUPPRESS \
  --region us-east-1
```

**Добавить пользователя в группу:**
```bash
aws cognito-idp admin-add-user-to-group \
  --user-pool-id us-east-1_FORzY4ey4 \
  --username teacher@test.com \
  --group-name TEACHER \
  --region us-east-1
```

**Повторить для ADMIN и SUPERADMIN:**
```bash
# ADMIN
aws cognito-idp admin-create-user \
  --user-pool-id us-east-1_FORzY4ey4 \
  --username admin@test.com \
  --user-attributes Name=email,Value=admin@test.com Name=email_verified,Value=true \
  --temporary-password "TempPass123!" \
  --message-action SUPPRESS \
  --region us-east-1

aws cognito-idp admin-add-user-to-group \
  --user-pool-id us-east-1_FORzY4ey4 \
  --username admin@test.com \
  --group-name ADMIN \
  --region us-east-1

# SUPERADMIN
aws cognito-idp admin-create-user \
  --user-pool-id us-east-1_FORzY4ey4 \
  --username superadmin@test.com \
  --user-attributes Name=email,Value=superadmin@test.com Name=email_verified,Value=true \
  --temporary-password "TempPass123!" \
  --message-action SUPPRESS \
  --region us-east-1

aws cognito-idp admin-add-user-to-group \
  --user-pool-id us-east-1_FORzY4ey4 \
  --username superadmin@test.com \
  --group-name SUPERADMIN \
  --region us-east-1
```

### 8.2. Проверка созданных пользователей

**Список пользователей:**
```bash
aws cognito-idp list-users \
  --user-pool-id us-east-1_FORzY4ey4 \
  --region us-east-1 \
  --output table
```

---

## 9. Task 05.10: Применение изменений к обоим окружениям

### 9.1. Процесс применения

**Шаг 1: Dev окружение**
```bash
amplify env checkout dev
amplify status
amplify push
```

**Шаг 2: Проверка dev**
```bash
aws cognito-idp describe-user-pool \
  --user-pool-id us-east-1_FORzY4ey4 \
  --region us-east-1 \
  --query "UserPool.Policies.PasswordPolicy"
```

**Шаг 3: Prod окружение**
```bash
amplify env checkout prod
amplify status
amplify push
```

**Шаг 4: Проверка prod**
```bash
aws cognito-idp describe-user-pool \
  --user-pool-id eu-west-1_iQ7XIxudA \
  --region eu-west-1 \
  --query "UserPool.Policies.PasswordPolicy"
```

**Шаг 5: Проверка идентичности (Task 05.06)**

---

## 10. Troubleshooting

### 10.1. Ошибки при amplify push

**Проблема:** CloudFormation stack update fails

**Решение:**
1. Проверить логи CloudFormation:
   ```bash
   aws cloudformation describe-stack-events \
     --stack-name amplify-sunsch-dev-f567d-authsunsche716d941-RQTD842J4ABV \
     --region us-east-1 \
     --max-items 10
   ```
2. Проверить конфигурационные файлы на синтаксические ошибки
3. Убедиться, что все зависимости выполнены

### 10.2. Группы не создаются

**Проблема:** Ошибка при создании группы через AWS CLI

**Решение:**
1. Проверить, что группа еще не существует:
   ```bash
   aws cognito-idp list-groups --user-pool-id <POOL_ID> --region <REGION>
   ```
2. Если группа существует, удалить и создать заново:
   ```bash
   aws cognito-idp delete-group \
     --user-pool-id <POOL_ID> \
     --group-name <GROUP_NAME> \
     --region <REGION>
   ```

### 10.3. Различия между dev и prod

**Проблема:** Настройки dev и prod не идентичны

**Решение:**
1. Определить различия через сравнение конфигураций
2. Обновить конфигурационные файлы для синхронизации
3. Применить изменения через `amplify push`
4. Документировать любые допустимые различия

---

## 11. Верификация Infrastructure as Code

### 11.1. Чеклист

**Перед завершением фазы проверить:**

- [ ] Все настройки хранятся в конфигурационных файлах
- [ ] Dev и prod окружения имеют идентичную конфигурацию (кроме автоматически генерируемых значений)
- [ ] Все изменения зафиксированы в Git
- [ ] Документация обновлена
- [ ] Нет ручных изменений в AWS Console (кроме тестовых пользователей)
- [ ] Скрипты для создания групп созданы и документированы
- [ ] Конфигурация может быть применена к новому окружению через `amplify push`

### 11.2. Команды для проверки

**Проверить конфигурационные файлы:**
```bash
cat amplify/backend/auth/sunsche716d941/cli-inputs.json | grep passwordPolicyCharacters
cat amplify/backend/backend-config.json | grep passwordPolicyCharacters
```

**Проверить примененную конфигурацию:**
```bash
# Dev
aws cognito-idp describe-user-pool \
  --user-pool-id us-east-1_FORzY4ey4 \
  --region us-east-1 \
  --query "UserPool.Policies.PasswordPolicy"

# Prod
aws cognito-idp describe-user-pool \
  --user-pool-id eu-west-1_iQ7XIxudA \
  --region eu-west-1 \
  --query "UserPool.Policies.PasswordPolicy"
```

---

## 12. Ссылки на документацию

- [INFRASTRUCTURE_AS_CODE.md](../../../../infrastructure/INFRASTRUCTURE_AS_CODE.md) - Принципы Infrastructure as Code
- [SECURITY.md](../../../../infrastructure/SECURITY.md) - Безопасность и аутентификация
- [AWS_AMPLIFY.md](../../../../infrastructure/AWS_AMPLIFY.md) - Настройка AWS Amplify
- [phase_05_auth.md](../tasks/phase_05_auth.md) - Задачи фазы
- [phase_05_auth_current_config.md](../tasks/phase_05_auth_current_config.md) - Текущая конфигурация

---

**Версия:** 1.0  
**Последнее обновление:** 27 декабря 2025

