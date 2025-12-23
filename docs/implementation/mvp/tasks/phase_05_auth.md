# Phase 05: Настройка аутентификации (Cognito)

## Описание фазы
Настройка AWS Cognito User Pools, создание групп (TEACHER, ADMIN, SUPERADMIN), настройка политик авторизации, интеграция с AppSync.

## Зависимости
Phase 04: Настройка GraphQL API (AppSync)

## Оценка времени
3-4 часа

## Требования к AI Agent

> [!IMPORTANT]
> - AI Agent при создании программного кода должен использовать актуальную документацию для конкретной версии библиотеки или фреймворка через Context7
> - Для AWS Cognito должна быть использована официальная документация AWS
> - Перед настройкой необходимо изучить SECURITY.md документацию проекта
> - Следовать принципам из `docs/guidelines/prompts/general_prompt_guidelines.md`

## Задачи

### Task 05.01: Добавление Auth ресурса в Amplify
- [ ] Запустить `amplify add auth`
- [ ] Выбрать опции:
  - Do you want to use the default authentication and security configuration? `Default configuration`
  - How do you want users to be able to sign in? `Email`
  - Do you want to configure advanced settings? `Yes`
  - What attributes are required for signing up? `Email` (и другие при необходимости)
  - Do you want to enable Multi-Factor Authentication (MFA)? `Off` (для MVP)
  - Email verification: `Required`
- [ ] Дождаться завершения настройки

**Документация:**
- [AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md) - раздел Auth Setup
- [SECURITY.md](../../../infrastructure/SECURITY.md) - раздел Authentication
- AWS Cognito документация (через Context7)

**Критерии приемки:**
- Auth ресурс добавлен в Amplify проект
- Cognito User Pool создан
- Конфигурация сохранена

---

### Task 05.02: Настройка парольной политики
- [ ] Открыть AWS Console -> Cognito -> User Pools
- [ ] Выбрать созданный User Pool
- [ ] Перейти в раздел "Sign-in experience" -> "Password policy"
- [ ] Настроить политику паролей согласно [SECURITY.md](../../../infrastructure/SECURITY.md):
  - Minimum length: 8 characters
  - Require: Uppercase, lowercase, number, special character
- [ ] Сохранить изменения

**Документация:**
- [SECURITY.md](../../../infrastructure/SECURITY.md) - раздел 2.1 Password Policy
- AWS Cognito Password Policy документация (через Context7)

**Критерии приемки:**
- Парольная политика настроена
- Требования соответствуют документации
- Политика применяется при регистрации

---

### Task 05.03: Создание групп пользователей (Cognito Groups)
- [ ] Открыть AWS Console -> Cognito -> User Pools
- [ ] Выбрать созданный User Pool
- [ ] Перейти в раздел "Groups"
- [ ] Создать группу `TEACHER`:
  - Group name: `TEACHER`
  - Description: `Преподаватели воскресной школы`
  - Precedence: `1`
- [ ] Создать группу `ADMIN`:
  - Group name: `ADMIN`
  - Description: `Администраторы воскресной школы`
  - Precedence: `2`
- [ ] Создать группу `SUPERADMIN`:
  - Group name: `SUPERADMIN`
  - Description: `Главные администраторы`
  - Precedence: `3`

**Документация:**
- [SECURITY.md](../../../infrastructure/SECURITY.md) - раздел 3.1 Role-Based Access Control
- [MVP_SCOPE.md](../../../MVP_SCOPE.md) - раздел 2.1.2 Роли пользователей
- AWS Cognito Groups документация (через Context7)

**Критерии приемки:**
- Все три группы созданы
- Precedence настроен правильно (ADMIN > TEACHER)
- Группы видны в Cognito Console

---

### Task 05.04: Настройка IAM ролей для групп
- [ ] Открыть AWS Console -> Cognito -> User Pools
- [ ] Выбрать созданный User Pool
- [ ] Перейти в раздел "Groups" -> выбрать группу `TEACHER`
- [ ] Настроить IAM роль для группы (если требуется)
- [ ] Повторить для групп `ADMIN` и `SUPERADMIN`
- [ ] Убедиться, что роли имеют правильные разрешения для AppSync

**Документация:**
- [SECURITY.md](../../../infrastructure/SECURITY.md) - раздел 3.2 IAM Roles
- AWS Cognito IAM Roles документация (через Context7)

**Критерии приемки:**
- IAM роли настроены для всех групп
- Роли имеют правильные разрешения
- Группы могут использовать AppSync API

---

### Task 05.05: Интеграция Cognito с AppSync
- [ ] Открыть AWS Console -> AppSync
- [ ] Выбрать созданный API
- [ ] Перейти в раздел "Settings" -> "Authorization"
- [ ] Убедиться, что Cognito User Pool добавлен как Authorization provider
- [ ] Проверить, что AppSync использует правильный User Pool
- [ ] Убедиться, что группы Cognito доступны в AppSync

**Документация:**
- [AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md) - раздел AppSync Integration
- [SECURITY.md](../../../infrastructure/SECURITY.md) - раздел 4.1 AppSync Authorization
- AWS AppSync Cognito Integration документация (через Context7)

**Критерии приемки:**
- Cognito интегрирован с AppSync
- AppSync использует правильный User Pool
- Группы доступны в AppSync для @auth директив

---

### Task 05.06: Настройка JWT токенов
- [ ] Открыть AWS Console -> Cognito -> User Pools
- [ ] Выбрать созданный User Pool
- [ ] Перейти в раздел "App integration" -> "App client settings"
- [ ] Настроить токены:
  - ID Token expiration: `1 day` (или другое значение)
  - Access Token expiration: `1 day`
  - Refresh Token expiration: `30 days`
- [ ] Включить необходимые OAuth scopes (если требуется)

**Документация:**
- [SECURITY.md](../../../infrastructure/SECURITY.md) - раздел 2.3 JWT Tokens
- [MVP_SCOPE.md](../../../MVP_SCOPE.md) - раздел 2.1.1 JWT токены
- AWS Cognito Token Settings документация (через Context7)

**Критерии приемки:**
- JWT токены настроены
- Время жизни токенов соответствует требованиям
- Refresh token имеет достаточное время жизни (30 дней)

---

### Task 05.07: Создание тестовых пользователей
- [ ] Открыть AWS Console -> Cognito -> User Pools
- [ ] Выбрать созданный User Pool
- [ ] Перейти в раздел "Users"
- [ ] Создать тестового пользователя с ролью TEACHER:
  - Email: `teacher@test.com`
  - Temporary password: создать надежный пароль
  - Mark email as verified: `Yes`
  - Add to group: `TEACHER`
- [ ] Создать тестового пользователя с ролью ADMIN:
  - Email: `admin@test.com`
  - Temporary password: создать надежный пароль
  - Mark email as verified: `Yes`
  - Add to group: `ADMIN`
- [ ] Создать тестового пользователя с ролью SUPERADMIN:
  - Email: `superadmin@test.com`
  - Temporary password: создать надежный пароль
  - Mark email as verified: `Yes`
  - Add to group: `SUPERADMIN`

**Документация:**
- [SECURITY.md](../../../infrastructure/SECURITY.md) - раздел Testing
- AWS Cognito User Management документация (через Context7)

**Критерии приемки:**
- Тестовые пользователи созданы для всех ролей
- Пользователи добавлены в соответствующие группы
- Email помечен как verified

---

### Task 05.08: Тестирование аутентификации
- [ ] Установить AWS Amplify библиотеки: `npm install aws-amplify`
- [ ] Настроить Amplify конфигурацию в проекте (будет сделано в Phase 08)
- [ ] Протестировать вход с тестовыми пользователями
- [ ] Проверить получение JWT токенов
- [ ] Проверить, что токены содержат правильные группы

**Документация:**
- [AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md) - раздел Frontend Integration
- [SECURITY.md](../../../infrastructure/SECURITY.md) - раздел Authentication Flow
- AWS Amplify Auth документация (через Context7)

**Критерии приемки:**
- Вход работает для всех тестовых пользователей
- JWT токены получаются корректно
- Токены содержат информацию о группах

---

### Task 05.09: Настройка email верификации (если требуется)
- [ ] Открыть AWS Console -> Cognito -> User Pools
- [ ] Выбрать созданный User Pool
- [ ] Перейти в раздел "Messaging" -> "Email"
- [ ] Настроить email отправку:
  - Use Cognito's default email: `Yes` (для MVP)
  - Или настроить SES (для production)
- [ ] Протестировать отправку email верификации

**Документация:**
- [SECURITY.md](../../../infrastructure/SECURITY.md) - раздел 2.1 Email Verification
- AWS Cognito Email Settings документация (через Context7)

**Критерии приемки:**
- Email верификация настроена
- Email отправляются корректно
- Пользователи могут верифицировать email

---

### Task 05.10: Push изменений в AWS
- [ ] Запустить `amplify push`
- [ ] Подтвердить обновление ресурсов
- [ ] Дождаться завершения обновления Cognito
- [ ] Проверить статус: `amplify status`

**Документация:**
- [AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md) - раздел Push

**Критерии приемки:**
- Команда `amplify push` выполнена успешно
- Cognito User Pool обновлен
- Нет ошибок при обновлении

---

### Task 05.11: Проверка конфигурации в amplifyconfiguration.json
- [ ] Открыть файл `amplifyconfiguration.json` (или `src/amplifyconfiguration.json`)
- [ ] Проверить наличие секции `Auth`:
  ```json
  {
    "Auth": {
      "Cognito": {
        "userPoolId": "...",
        "userPoolClientId": "...",
        "region": "..."
      }
    }
  }
  ```
- [ ] Убедиться, что конфигурация корректна
- [ ] Проверить, что User Pool ID и Client ID правильные

**Документация:**
- [AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md) - раздел Configuration Files
- [ARCHITECTURE.md](../../../architecture/ARCHITECTURE.md) - раздел Configuration

**Критерии приемки:**
- `amplifyconfiguration.json` содержит правильную конфигурацию Auth
- User Pool ID и Client ID корректны
- Конфигурация готова к использованию в приложении

---

### Task 05.12: Документирование настроек аутентификации
- [ ] Задокументировать созданные группы и их назначение
- [ ] Задокументировать парольную политику
- [ ] Задокументировать настройки токенов
- [ ] Задокументировать тестовых пользователей (для разработки)
- [ ] Обновить [SECURITY.md](../../../infrastructure/SECURITY.md) если необходимо

**Документация:**
- [SECURITY.md](../../../infrastructure/SECURITY.md)
- [AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md)

**Критерии приемки:**
- Документация обновлена
- Настройки задокументированы
- Тестовые пользователи записаны (для разработки)

---

### Task 05.13: Финальная проверка настройки
- [ ] Проверить, что все группы созданы
- [ ] Проверить, что Cognito интегрирован с AppSync
- [ ] Проверить, что тестовые пользователи могут входить
- [ ] Проверить, что JWT токены содержат группы
- [ ] Убедиться, что нет критических ошибок

**Документация:**
- [SECURITY.md](../../../infrastructure/SECURITY.md)
- [AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md)

**Критерии приемки:**
- Все настройки работают корректно
- Аутентификация функционирует
- Авторизация через группы работает
- Система готова к использованию в приложении

---

## Ссылки на документацию проекта

- [SECURITY.md](../../../infrastructure/SECURITY.md) - Безопасность и аутентификация
- [AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md) - Настройка AWS Amplify
- [MVP_SCOPE.md](../../../MVP_SCOPE.md) - Роли пользователей
- [GRAPHQL_SCHEMA.md](../../../database/GRAPHQL_SCHEMA.md) - Авторизация в GraphQL

---

## Примечания

- Группы Cognito используются для RBAC в AppSync через @auth директивы
- Precedence групп важен для правильной работы авторизации
- Тестовые пользователи создаются только для разработки, в production их не должно быть
- JWT токены содержат информацию о группах пользователя
- Email верификация обязательна для безопасности

---

**Версия:** 1.0  
**Последнее обновление:** 23 декабря 2025

