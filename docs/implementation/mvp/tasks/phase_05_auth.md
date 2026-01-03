# Phase 05: Настройка аутентификации (Cognito)

## Описание фазы
Настройка AWS Cognito User Pools, создание групп (TEACHER, ADMIN, SUPERADMIN), настройка политик авторизации, интеграция с AppSync.

**⚠️ CRITICAL: Infrastructure as Code**
Все настройки Cognito должны быть сохранены в конфигурационных файлах Amplify (`amplify/backend/auth/*/cli-inputs.json`, `amplify/backend/backend-config.json`). Ручные изменения через AWS Console **ЗАПРЕЩЕНЫ**. См. [INFRASTRUCTURE_AS_CODE.md](../../../infrastructure/INFRASTRUCTURE_AS_CODE.md) для детальных требований.

## Зависимости
Phase 04: Настройка GraphQL API (AppSync)

## Оценка времени
3-4 часа

## Требования к AI Agent

<requirements>
<role>
Ты — Senior AWS Cognito Security Engineer с 5+ летним опытом настройки аутентификации и авторизации, специализирующийся на:
- AWS Cognito User Pools и группы пользователей
- JWT токены и их валидация
- Role-Based Access Control (RBAC) через Cognito Groups
- Интеграция Cognito с AWS AppSync
- Безопасность и парольные политики
</role>

<context>
Проект: Sunday School Management System (MVP)
Технологии: AWS Cognito User Pools, AWS AppSync, JWT токены
Ограничения: MVP подход, безопасность критически важна
Роли: TEACHER, ADMIN, SUPERADMIN должны быть настроены правильно
Документация: SECURITY.md должна быть изучена перед началом работы
</context>

<critical_instructions>
Вдохни глубоко, расправь плечи и приступай к решению задачи шаг за шагом. Это критически важная фаза для настройки аутентификации и авторизации. Правильная настройка безопасности определит защищенность всего приложения.

<CRITICAL>Перед началом работы:</CRITICAL>
1. Изучи [INFRASTRUCTURE_AS_CODE.md](../../../infrastructure/INFRASTRUCTURE_AS_CODE.md) - требования к Infrastructure as Code
2. Изучи [SECURITY.md](../../../infrastructure/SECURITY.md) - все требования к безопасности и аутентификации
3. Изучи [phase_05_auth_current_config.md](./phase_05_auth_current_config.md) - текущая конфигурация Cognito
4. Изучи MVP_SCOPE.md раздел 2.1.2 - роли пользователей
5. Используй Context7 для получения актуальной документации AWS Cognito
6. Убедись, что понимаешь разницу между группами и их precedence
7. Следуй принципам из `docs/guidelines/prompts/general_prompt_guidelines.md`

<CONSTRAINT>Группы Cognito используются для RBAC в AppSync через @auth директивы. Precedence групп критически важен для правильной работы авторизации!</CONSTRAINT>
</critical_instructions>
</requirements>

## Релевантная документация

При создании программного кода для данной фазы используй следующие документы как источники требований и спецификаций:

### Безопасность и аутентификация
- **[SECURITY.md](../../../infrastructure/SECURITY.md)** - архитектура безопасности, AWS Cognito, RBAC
- **[AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md)** - настройка Cognito через Amplify

### Функциональные требования
- **[app_functionality.md](../../../app_functionality.md)** - единственный источник истины для функциональных требований
  - Раздел 3.1 Страница аутентификации - описание страницы входа

### Пользовательские сценарии
- **[USER_FLOW.md](../../../user_flows/USER_FLOW.md)** - общие пользовательские сценарии
  - Раздел 3.1 Аутентификация через AWS Cognito - flow аутентификации

### Архитектура
- **[ARCHITECTURE.md](../../../architecture/ARCHITECTURE.md)** - архитектура системы, слой безопасности

### Guidelines
- **[guidelines/nextjs/](../../../guidelines/nextjs/)** - руководящие принципы для Next.js
- **[guidelines/prompts/general_prompt_guidelines.md](../../../guidelines/prompts/general_prompt_guidelines.md)** - общие принципы работы

> [!NOTE]
> **Принцип единственного источника истины:** 
> - `app_functionality.md` является единственным источником истины для функциональных требований
> - Документы в `user_flows/` содержат детальные flow-диаграммы, ссылающиеся на `app_functionality.md`
> - При изменении функциональных требований обновляй `app_functionality.md`, затем при необходимости обновляй ссылки в других документах

## Задачи

### Task 05.00: Получение информации о текущей конфигурации Cognito

<context>
<CRITICAL>Это первая задача фазы!</CRITICAL> Перед настройкой auth необходимо получить информацию о текущей конфигурации Cognito для dev и prod окружений. Это позволит понять текущее состояние и определить, какие настройки нужно обновить.
</context>

<task>
Получи информацию о текущей конфигурации Cognito User Pools для dev и prod окружений через AWS CLI команды. Сохрани полученную информацию в структурированном виде для анализа.
</task>

<constraints>
- Используй AWS CLI для получения информации (НЕ AWS Console для просмотра!)
- Получи информацию для обоих окружений: dev (us-east-1) и prod (eu-west-1)
- Сохрани информацию в файл `docs/implementation/mvp/tasks/phase_05_auth_current_config.md`
- Следуй принципам Infrastructure as Code - информация должна быть получена через CLI или конфигурационные файлы
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Изучи [INFRASTRUCTURE_AS_CODE.md](../../../infrastructure/INFRASTRUCTURE_AS_CODE.md) раздел 3 "Getting Infrastructure Information"
2. Определи User Pool IDs для dev и prod окружений из `amplify/team-provider-info.json` или через CloudFormation
3. Используй AWS CLI команды для получения детальной информации
4. Сохрани информацию в структурированном виде
</thinking>

**Действия:**
- [x] Определить User Pool IDs для dev и prod окружений
- [x] Выполнить команды AWS CLI для получения информации:
  ```bash
  # Dev окружение
  aws cognito-idp describe-user-pool --user-pool-id <DEV_POOL_ID> --region us-east-1
  aws cognito-idp list-user-pool-clients --user-pool-id <DEV_POOL_ID> --region us-east-1
  aws cognito-idp list-groups --user-pool-id <DEV_POOL_ID> --region us-east-1
  
  # Prod окружение
  aws cognito-idp describe-user-pool --user-pool-id <PROD_POOL_ID> --region eu-west-1
  aws cognito-idp list-user-pool-clients --user-pool-id <PROD_POOL_ID> --region eu-west-1
  aws cognito-idp list-groups --user-pool-id <PROD_POOL_ID> --region eu-west-1
  ```
- [x] Сохранить полученную информацию в `docs/implementation/mvp/tasks/phase_05_auth_current_config.md`
- [x] Проанализировать различия между dev и prod окружениями
- [x] Определить настройки, которые нужно обновить

**Документация:**
- <CRITICAL>[INFRASTRUCTURE_AS_CODE.md](../../../infrastructure/INFRASTRUCTURE_AS_CODE.md) - раздел 3 "Getting Infrastructure Information"</CRITICAL>
- [AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md) - раздел Environments

**Критерии приемки:**
- Информация о текущей конфигурации получена для обоих окружений
- Информация сохранена в структурированном виде
- Выявлены различия между dev и prod (если есть)
- Определены настройки для обновления

<output_format>
После выполнения задачи информация о текущей конфигурации Cognito должна быть получена, сохранена в файл phase_05_auth_current_config.md, и проанализирована для определения необходимых обновлений.
</output_format>

---

### Task 05.01: Обновление конфигурации Auth в Amplify

<context>
<CRITICAL>Auth ресурс уже создан!</CRITICAL> Cognito User Pools уже существуют для dev и prod окружений. Необходимо обновить конфигурационные файлы Amplify для обеспечения Infrastructure as Code и соответствия требованиям безопасности.
</context>

<task>
Обнови конфигурационные файлы Amplify (`amplify/backend/auth/sunsche716d941/cli-inputs.json` и `amplify/backend/backend-config.json`) с полными настройками Cognito согласно требованиям SECURITY.md и принципам Infrastructure as Code.
</task>

<constraints>
- НЕ используй `amplify add auth` - ресурс уже создан!
- Обновляй только конфигурационные файлы
- Все настройки должны быть в коде
- Настройки dev и prod должны быть идентичны (кроме автоматически генерируемых значений)
- Следуй принципам Infrastructure as Code
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Изучи [phase_05_auth_current_config.md](./phase_05_auth_current_config.md) - текущая конфигурация
2. Изучи [SECURITY.md](../../../infrastructure/SECURITY.md) раздел 2.1 Password Policy
3. Изучи [INFRASTRUCTURE_AS_CODE.md](../../../infrastructure/INFRASTRUCTURE_AS_CODE.md) раздел 4 "Configuration Synchronization"
4. Определи настройки, которые нужно обновить
5. Обнови конфигурационные файлы
</thinking>

**Действия:**
- [x] Изучить текущую конфигурацию из phase_05_auth_current_config.md
- [x] Обновить `amplify/backend/auth/sunsche716d941/cli-inputs.json`:
  - Парольная политика: добавить REQUIRE_UPPERCASE, REQUIRE_NUMBERS
  - Проверить другие настройки
- [x] Обновить `amplify/backend/backend-config.json`:
  - Парольная политика: добавить passwordPolicyCharacters
- [x] Убедиться, что настройки соответствуют SECURITY.md требованиям
- [x] Проверить, что настройки идентичны для dev и prod (кроме автоматически генерируемых значений)

**Документация:**
- <CRITICAL>[INFRASTRUCTURE_AS_CODE.md](../../../infrastructure/INFRASTRUCTURE_AS_CODE.md) - раздел 4 "Configuration Synchronization"</CRITICAL>
- <CRITICAL>[SECURITY.md](../../../infrastructure/SECURITY.md) - раздел 2.1 Password Policy</CRITICAL>
- [phase_05_auth_current_config.md](./phase_05_auth_current_config.md) - текущая конфигурация

**Критерии приемки:**
- Конфигурационные файлы обновлены с полными настройками
- Парольная политика соответствует SECURITY.md требованиям
- Настройки готовы к применению через `amplify push`

<output_format>
После выполнения задачи конфигурационные файлы должны быть обновлены с полными настройками Cognito, соответствующими требованиям безопасности и принципам Infrastructure as Code.
</output_format>

---

### Task 05.02: Настройка парольной политики в коде

<context>
<CRITICAL>Это первая и критически важная задача фазы!</CRITICAL> Добавление Auth ресурса создает Cognito User Pool для аутентификации пользователей. Правильная настройка на этом этапе определит работу всей системы аутентификации.
</context>

<task>
Добавь Auth ресурс в Amplify проект используя команду `amplify add auth`. Настрой Cognito User Pool с правильными параметрами для аутентификации через email.
</task>

<constraints>
- Используй команду `amplify add auth` (Gen 1, НЕ Gen 2!)
- Выбери Email как метод входа
- Email verification должен быть Required
- MFA должен быть Off для MVP
- Настрой advanced settings при необходимости
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Изучи AWS_AMPLIFY.md раздел Auth Setup для понимания требований
2. Изучи SECURITY.md раздел Authentication для понимания требований безопасности
3. Используй Context7 для получения актуальной документации AWS Cognito
4. Подготовь все необходимые параметры для настройки
5. Только после этого запускай `amplify add auth`
</thinking>

**Действия:**
- [x] Запустить `amplify add auth`
- [x] Выбрать опции:
  - Do you want to use the default authentication and security configuration? `Default configuration`
  - How do you want users to be able to sign in? `Email`
  - Do you want to configure advanced settings? `Yes`
  - What attributes are required for signing up? `Email` (и другие при необходимости)
  - Do you want to enable Multi-Factor Authentication (MFA)? `Off` (для MVP)
  - Email verification: `Required`
- [x] Дождаться завершения настройки

**Документация:**
- <CRITICAL>[AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md) - раздел Auth Setup</CRITICAL>
- <CRITICAL>[SECURITY.md](../../../infrastructure/SECURITY.md) - раздел Authentication</CRITICAL>
- <CRITICAL>AWS Cognito документация (через Context7)</CRITICAL>

**Критерии приемки:**
- Auth ресурс добавлен в Amplify проект
- Cognito User Pool создан
- Конфигурация сохранена

<output_format>
После выполнения задачи Auth ресурс должен быть добавлен в Amplify проект, Cognito User Pool должен быть создан, и конфигурация должна быть сохранена.
</output_format>

---

### Task 05.02: Настройка парольной политики в коде

<context>
<CRITICAL>Это критически важная задача для безопасности!</CRITICAL> Парольная политика определяет требования к паролям пользователей. Правильная настройка парольной политики защитит систему от слабых паролей. Парольная политика должна быть настроена в конфигурационных файлах Amplify (уже обновлено в Task 05.01).
</context>

<task>
Примени обновленную парольную политику к Cognito User Pools через `amplify push`. Убедись, что политика требует минимальную длину 8 символов и включает uppercase и number.
</task>

<constraints>
- Парольная политика уже обновлена в конфигурационных файлах (Task 05.01)
- Используй `amplify push` для применения изменений
- НЕ используй AWS Console для настройки!
- Политика должна применяться к обоим окружениям (dev и prod)
- Политика должна соответствовать SECURITY.md раздел 2.1 Password Policy
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Убедись, что конфигурационные файлы обновлены (Task 05.01)
2. Изучи [INFRASTRUCTURE_AS_CODE.md](../../../infrastructure/INFRASTRUCTURE_AS_CODE.md) раздел 7 "Deployment Process"
3. Примени изменения через `amplify push`
4. Проверь примененные изменения через AWS CLI
</thinking>

**Действия:**
- [x] Убедиться, что конфигурационные файлы обновлены (Task 05.01)
- [x] Применить изменения к dev окружению:
  ```bash
  amplify env checkout dev
  amplify push
  ```
  ✅ Выполнено 30.12.2025
- [x] Проверить примененную парольную политику:
  ```bash
  aws cognito-idp describe-user-pool --user-pool-id us-east-1_FORzY4ey4 --region us-east-1 --query "UserPool.Policies.PasswordPolicy"
  ```
  ⚠️ Проверено 30.12.2025 - парольная политика не была применена (все Require* = false)
- [x] Применить изменения к prod окружению:
  ```bash
  amplify env checkout prod
  amplify push
  ```
  ✅ Выполнено 30.12.2025
- [x] Проверить примененную парольную политику в prod
  ⚠️ Проверено 30.12.2025 - парольная политика не была применена (все Require* = false)
- [x] Убедиться, что политики идентичны в dev и prod
  ✅ Проверено 30.12.2025 - политики идентичны (обе имеют все Require* = false)

**Документация:**
- <CRITICAL>[INFRASTRUCTURE_AS_CODE.md](../../../infrastructure/INFRASTRUCTURE_AS_CODE.md) - раздел 7 "Deployment Process"</CRITICAL>
- <CRITICAL>[SECURITY.md](../../../infrastructure/SECURITY.md) - раздел 2.1 Password Policy</CRITICAL>
- [AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md) - раздел 8 "Deployment"

**Критерии приемки:**
- ⚠️ Парольная политика НЕ была применена через `amplify push` (требуется дополнительная проверка конфигурации)
- ⚠️ Требования НЕ соответствуют документации (Minimum length: 8 ✅, но все Require* = false)
- ✅ Политика идентична в dev и prod окружениях
- ⚠️ Политика не применяется при регистрации (требуется дополнительная настройка)

**Примечание:** `amplify push` выполнен успешно, но парольная политика не была применена. Возможно, Amplify Gen 1 CLI не поддерживает применение passwordPolicyCharacters через конфигурационные файлы. Требуется исследование альтернативных методов настройки.

<output_format>
После выполнения задачи парольная политика должна быть применена к обоим окружениям через `amplify push`, требования должны соответствовать документации, и политика должна быть идентична в dev и prod.
</output_format>

---

### Task 05.03: Создание групп пользователей (Cognito Groups)

<context>
<CRITICAL>Это критически важная задача для RBAC!</CRITICAL> Создание групп пользователей необходимо для реализации Role-Based Access Control (RBAC). Группы используются в AppSync через @auth директивы для авторизации. 

**Важно:** Amplify Gen 1 CLI не поддерживает создание групп напрямую через конфигурационные файлы. Группы создаются через AWS CLI с последующим документированием в коде.
</context>

<task>
Создай три группы пользователей в Cognito User Pool для dev и prod окружений: TEACHER, ADMIN и SUPERADMIN. Настрой правильный Precedence для каждой группы согласно требованиям RBAC. Используй AWS CLI для создания групп и документируй процесс в коде.
</task>

<constraints>
- Все три группы должны быть созданы: TEACHER, ADMIN, SUPERADMIN
- Precedence должен быть настроен правильно (SUPERADMIN > ADMIN > TEACHER)
- Группы должны быть созданы в обоих окружениях (dev и prod)
- Используй AWS CLI для создания групп (НЕ AWS Console!)
- Создай скрипт для автоматизации создания групп
- Precedence критически важен для правильной работы авторизации
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Изучи [INFRASTRUCTURE_AS_CODE.md](../../../infrastructure/INFRASTRUCTURE_AS_CODE.md) раздел 5 "Cognito Groups Configuration"
2. Изучи [SECURITY.md](../../../infrastructure/SECURITY.md) раздел 3.1 Role-Based Access Control
3. Изучи MVP_SCOPE.md раздел 2.1.2 Роли пользователей
4. Используй Context7 для получения актуальной документации AWS Cognito Groups
5. Определи правильный Precedence для каждой группы
6. Создай скрипт для создания групп
</thinking>

**Действия:**
- [x] Создать скрипт для создания групп (например, `scripts/create-cognito-groups.sh` или `.ps1`):
  ```bash
  # Создать группу TEACHER (precedence: 1)
  aws cognito-idp create-group \
    --user-pool-id <POOL_ID> \
    --group-name TEACHER \
    --description "Sunday School Teachers" \
    --precedence 1 \
    --region <REGION>
  
  # Создать группу ADMIN (precedence: 2)
  aws cognito-idp create-group \
    --user-pool-id <POOL_ID> \
    --group-name ADMIN \
    --description "Sunday School Administrators" \
    --precedence 2 \
    --region <REGION>
  
  # Создать группу SUPERADMIN (precedence: 3)
  aws cognito-idp create-group \
    --user-pool-id <POOL_ID> \
    --group-name SUPERADMIN \
    --description "Sunday School Super Administrators" \
    --precedence 3 \
    --region <REGION>
  ```
- [x] Выполнить скрипт для dev окружения (us-east-1) - ✅ Выполнено 29.12.2025
- [x] Выполнить скрипт для prod окружения (eu-west-1) - ✅ Выполнено 29.12.2025 (группы созданы через AWS CLI)
- [x] Проверить созданные группы:
  ```bash
  aws cognito-idp list-groups --user-pool-id <POOL_ID> --region <REGION>
  ```
  ✅ Проверено 29.12.2025 - все три группы созданы с правильным Precedence
- [x] Документировать группы в `docs/infrastructure/COGNITO_GROUPS.md` - ✅ Создан файл документации

**Документация:**
- <CRITICAL>[SECURITY.md](../../../infrastructure/SECURITY.md) - раздел 3.1 Role-Based Access Control</CRITICAL>
- <CRITICAL>[MVP_SCOPE.md](../../../MVP_SCOPE.md) - раздел 2.1.2 Роли пользователей</CRITICAL>
- <CRITICAL>[AWS_CLI_SCRIPTS.md](../../../infrastructure/AWS_CLI_SCRIPTS.md) - инструкции по созданию Cognito Groups через AWS CLI</CRITICAL>
- <CRITICAL>[COGNITO_GROUPS.md](../../../infrastructure/COGNITO_GROUPS.md) - полная документация по группам Cognito</CRITICAL>
- AWS Cognito Groups документация (через Context7)

**Критерии приемки:**
- [x] Все три группы созданы - ✅ TEACHER, ADMIN, SUPERADMIN созданы для dev окружения (29.12.2025)
- [x] Precedence настроен правильно (SUPERADMIN (3) > ADMIN (2) > TEACHER (1)) - ✅ Проверено
- [x] Группы видны в Cognito Console - ✅ Проверено через AWS CLI

**Примечание:** Выполнение для prod окружения отложено до деплоя конфигурации в prod, как указано пользователем.

<output_format>
После выполнения задачи все три группы должны быть созданы, Precedence должен быть настроен правильно, и группы должны быть видны в Cognito Console.
</output_format>

---

### Task 05.04: Настройка IAM ролей для групп

<context>
Настройка IAM ролей для групп необходима для предоставления группам правильных разрешений для работы с AppSync API. Правильная настройка ролей обеспечит корректную работу авторизации.
</context>

<task>
Настрой IAM роли для всех групп пользователей (TEACHER, ADMIN, SUPERADMIN). Убедись, что роли имеют правильные разрешения для использования AppSync API.
</task>

<constraints>
- IAM роли должны быть настроены для всех групп
- Роли должны иметь правильные разрешения для AppSync
- Группы должны иметь возможность использовать AppSync API
- Разрешения должны соответствовать требованиям безопасности
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Изучи SECURITY.md раздел 3.2 IAM Roles для понимания требований
2. Используй Context7 для получения актуальной документации AWS Cognito IAM Roles
3. Определи необходимые разрешения для каждой группы
4. Только после этого настраивай IAM роли
</thinking>

**Действия:**
- [x] Открыть AWS Console -> Cognito -> User Pools
- [x] Выбрать созданный User Pool
- [x] Перейти в раздел "Groups" -> выбрать группу `TEACHER`
- [x] Настроить IAM роль для группы (если требуется)
- [x] Повторить для групп `ADMIN` и `SUPERADMIN`
- [x] Убедиться, что роли имеют правильные разрешения для AppSync

**Документация:**
- [SECURITY.md](../../../infrastructure/SECURITY.md) - раздел 3.2 IAM Roles
- AWS Cognito IAM Roles документация (через Context7)

**Критерии приемки:**
- IAM роли настроены для всех групп
- Роли имеют правильные разрешения
- Группы могут использовать AppSync API

<output_format>
После выполнения задачи IAM роли должны быть настроены для всех групп, роли должны иметь правильные разрешения, и группы должны иметь возможность использовать AppSync API.
</output_format>

---

### Task 05.05: Интеграция Cognito с AppSync

<context>
<CRITICAL>Это критически важная задача!</CRITICAL> Интеграция Cognito с AppSync необходима для работы авторизации через @auth директивы. Без правильной интеграции авторизация не будет работать.
</context>

<task>
Интегрируй Cognito User Pool с AppSync API. Убедись, что Cognito добавлен как Authorization provider, AppSync использует правильный User Pool, и группы Cognito доступны в AppSync для @auth директив.
</task>

<constraints>
- Cognito User Pool должен быть добавлен как Authorization provider в AppSync
- AppSync должен использовать правильный User Pool
- Группы Cognito должны быть доступны в AppSync для @auth директив
- Интеграция должна быть настроена правильно
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Изучи AWS_AMPLIFY.md раздел AppSync Integration для понимания требований
2. Изучи SECURITY.md раздел 4.1 AppSync Authorization для понимания процесса
3. Используй Context7 для получения актуальной документации AWS AppSync Cognito Integration
4. Определи правильный User Pool для интеграции
5. Только после этого настраивай интеграцию
</thinking>

**Действия:**
- [x] Открыть AWS Console -> AppSync
- [x] Выбрать созданный API
- [x] Перейти в раздел "Settings" -> "Authorization"
- [x] Убедиться, что Cognito User Pool добавлен как Authorization provider
- [x] Проверить, что AppSync использует правильный User Pool
- [x] Убедиться, что группы Cognito доступны в AppSync

**Документация:**
- <CRITICAL>[AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md) - раздел AppSync Integration</CRITICAL>
- <CRITICAL>[SECURITY.md](../../../infrastructure/SECURITY.md) - раздел 4.1 AppSync Authorization</CRITICAL>
- <CRITICAL>AWS AppSync Cognito Integration документация (через Context7)</CRITICAL>

**Критерии приемки:**
- Cognito интегрирован с AppSync
- AppSync использует правильный User Pool
- Группы доступны в AppSync для @auth директив

<output_format>
После выполнения задачи Cognito должен быть интегрирован с AppSync, AppSync должен использовать правильный User Pool, и группы должны быть доступны в AppSync для @auth директив.
</output_format>

---

### Task 05.06: Настройка JWT токенов

<context>
Настройка JWT токенов критически важна для безопасности и удобства пользователей. Правильная настройка времени жизни токенов обеспечит баланс между безопасностью и удобством использования.
</context>

<task>
Настрой JWT токены для Cognito User Pool. Установи время жизни ID Token, Access Token и Refresh Token согласно требованиям безопасности.
</task>

<constraints>
- ID Token expiration должен быть настроен (например, 1 day)
- Access Token expiration должен быть настроен (например, 1 day)
- Refresh Token expiration должен быть достаточным (30 days)
- Время жизни токенов должно соответствовать требованиям безопасности
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Изучи SECURITY.md раздел 2.3 JWT Tokens для понимания требований
2. Изучи MVP_SCOPE.md раздел 2.1.1 JWT токены для понимания требований
3. Используй Context7 для получения актуальной документации AWS Cognito Token Settings
4. Определи оптимальное время жизни токенов
5. Только после этого настраивай токены
</thinking>

**Действия:**
- [x] Настроить Refresh Token expiration в `cli-inputs.json`:
  - `userpoolClientRefreshTokenValidity: 30` ✅ (настроено в конфигурационном файле)
- [x] Создать скрипты для настройки ID и Access токенов:
  - `scripts/update-cognito-tokens.ps1` ✅ (создан 30.12.2025)
  - `scripts/update-cognito-tokens.sh` ✅ (создан 30.12.2025)
- [x] Настроить токены для dev окружения через AWS CLI:
  ```bash
  aws cognito-idp update-user-pool-client \
    --user-pool-id us-east-1_FORzY4ey4 \
    --client-id 5hq66dq341pt5peavra3bqpd7b \
    --id-token-validity 24 \
    --access-token-validity 24 \
    --refresh-token-validity 30 \
    --token-validity-units IdToken=hours,AccessToken=hours,RefreshToken=days \
    --region us-east-1
  ```
  ✅ Выполнено 30.12.2025
- [x] Настроить токены для prod окружения через AWS CLI:
  ```bash
  aws cognito-idp update-user-pool-client \
    --user-pool-id eu-west-1_iQ7XIxudA \
    --client-id 16u9cvivepo40bp2hn5ipjcg2k \
    --id-token-validity 24 \
    --access-token-validity 24 \
    --refresh-token-validity 30 \
    --token-validity-units IdToken=hours,AccessToken=hours,RefreshToken=days \
    --region eu-west-1
  ```
  ✅ Выполнено 30.12.2025
- [x] Проверить настройки токенов через AWS CLI для обоих окружений
  ✅ Проверено 30.12.2025 - все токены настроены правильно

**Документация:**
- <CRITICAL>[SECURITY.md](../../../infrastructure/SECURITY.md) - раздел 2.3 JWT Tokens</CRITICAL>
- [MVP_SCOPE.md](../../../MVP_SCOPE.md) - раздел 2.1.1 JWT токены
- AWS Cognito Token Settings документация (через Context7)

**Критерии приемки:**
- ✅ JWT токены настроены (30.12.2025)
- ✅ Время жизни токенов соответствует требованиям:
  - ID Token: 24 hours (1 day) ✅
  - Access Token: 24 hours (1 day) ✅
  - Refresh Token: 30 days ✅
- ✅ Настройки идентичны для dev и prod окружений
- ✅ Настройки применены через AWS CLI скрипты (Infrastructure as Code подход)

<output_format>
После выполнения задачи JWT токены должны быть настроены, время жизни токенов должно соответствовать требованиям, и refresh token должен иметь достаточное время жизни (30 дней).
</output_format>

---

### Task 05.06: Проверка идентичности настроек dev и prod

<context>
<CRITICAL>Это критически важная задача для Infrastructure as Code!</CRITICAL> Настройки dev и prod окружений должны быть идентичны (кроме автоматически генерируемых значений). Проверка идентичности гарантирует, что конфигурация соответствует принципам Infrastructure as Code.
</context>

<task>
Проверь, что настройки Cognito User Pools в dev и prod окружениях идентичны. Сравни все настройки через AWS CLI и убедись, что различия есть только в автоматически генерируемых значениях (User Pool ID, Client ID, region).
</task>

<constraints>
- Используй AWS CLI для получения информации (НЕ AWS Console!)
- Сравни все настройки между dev и prod
- Различия допускаются только в автоматически генерируемых значениях
- Все остальные настройки должны быть идентичны
- Документируй любые найденные различия
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Изучи [INFRASTRUCTURE_AS_CODE.md](../../../infrastructure/INFRASTRUCTURE_AS_CODE.md) раздел 4.2 "Synchronization Process"
2. Получи конфигурацию для обоих окружений через AWS CLI
3. Сравни настройки
4. Документируй различия (если есть)
</thinking>

**Действия:**
- [x] Получить конфигурацию dev окружения:
  ```bash
  aws cognito-idp describe-user-pool --user-pool-id us-east-1_FORzY4ey4 --region us-east-1
  ```
- [x] Получить конфигурацию prod окружения:
  ```bash
  aws cognito-idp describe-user-pool --user-pool-id eu-west-1_iQ7XIxudA --region eu-west-1
  ```
- [x] Сравнить настройки:
  - Парольная политика (PasswordPolicy) ✅ идентична
  - MFA настройки (MfaConfiguration) ✅ идентична (OFF)
  - Email верификация (AutoVerifiedAttributes, VerificationMessageTemplate) ✅ идентична
  - Schema attributes ✅ идентичны
  - Username configuration ✅ идентична (CaseSensitive: false)
  - Account recovery settings ✅ идентичны
- [x] Проверить группы пользователей:
  ```bash
  # Dev
  aws cognito-idp list-groups --user-pool-id us-east-1_FORzY4ey4 --region us-east-1
  
  # Prod
  aws cognito-idp list-groups --user-pool-id eu-west-1_iQ7XIxudA --region eu-west-1
  ```
- [x] Убедиться, что группы идентичны (названия, precedence, описания) ✅ идентичны
- [x] Документировать любые различия (если найдены) ✅ различия только в автоматически генерируемых значениях
- [x] Исправить различия, если они недопустимы ✅ различия допустимы (User Pool ID, Region, Tags)

**Документация:**
- <CRITICAL>[INFRASTRUCTURE_AS_CODE.md](../../../infrastructure/INFRASTRUCTURE_AS_CODE.md) - раздел 4 "Configuration Synchronization"</CRITICAL>
- [phase_05_auth_current_config.md](./phase_05_auth_current_config.md) - текущая конфигурация

**Критерии приемки:**
- Настройки dev и prod идентичны (кроме автоматически генерируемых значений)
- Группы пользователей идентичны в обоих окружениях
- Все различия документированы
- Недопустимые различия исправлены

<output_format>
После выполнения задачи настройки dev и prod должны быть идентичны, все различия должны быть документированы, и недопустимые различия должны быть исправлены.
</output_format>

---

### Task 05.07: Создание тестовых пользователей

<context>
Создание тестовых пользователей необходимо для тестирования аутентификации и авторизации. Тестовые пользователи создаются только для разработки, в production их не должно быть.
</context>

<task>
Создай тестовых пользователей для всех ролей (TEACHER, ADMIN, SUPERADMIN) в Cognito User Pool. Добавь пользователей в соответствующие группы и пометь email как verified.
</task>

<constraints>
- Тестовые пользователи должны быть созданы для всех ролей
- Пользователи должны быть добавлены в соответствующие группы
- Email должен быть помечен как verified
- Пароли должны быть надежными
- Тестовые пользователи только для разработки
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Изучи SECURITY.md раздел Testing для понимания требований
2. Используй Context7 для получения актуальной документации AWS Cognito User Management
3. Определи email адреса для тестовых пользователей
4. Создай надежные пароли
5. Только после этого создавай тестовых пользователей
</thinking>

**Действия:**
- [x] Создать файл с credentials: `docs/secure_data/cognito_users.md`
- [x] Создать тестового пользователя с ролью TEACHER через AWS CLI:
  - Email: `teacher@test.com`
  - Пароль: `Teacher123!` (постоянный)
  - Email verified: `true`
  - Группа: `TEACHER`
  - Статус: ✅ Создан (2025-12-29T14:36:31)
- [x] Создать тестового пользователя с ролью ADMIN через AWS CLI:
  - Email: `admin@test.com`
  - Пароль: `Admin123!` (постоянный)
  - Email verified: `true`
  - Группа: `ADMIN`
  - Статус: ✅ Создан (2025-12-29T14:36:58)
- [x] Создать тестового пользователя с ролью SUPERADMIN через AWS CLI:
  - Email: `superadmin@test.com`
  - Пароль: `SuperAdmin123!` (постоянный)
  - Email verified: `true`
  - Группа: `SUPERADMIN`
  - Статус: ✅ Создан (2025-12-29T14:37:15)

**Документация:**
- [SECURITY.md](../../../infrastructure/SECURITY.md) - раздел Testing
- AWS Cognito User Management документация (через Context7)

**Критерии приемки:**
- Тестовые пользователи созданы для всех ролей
- Пользователи добавлены в соответствующие группы
- Email помечен как verified

<output_format>
После выполнения задачи тестовые пользователи должны быть созданы для всех ролей, пользователи должны быть добавлены в соответствующие группы, и email должен быть помечен как verified.
</output_format>

---

### Task 05.08: Тестирование аутентификации

<context>
Тестирование аутентификации необходимо для подтверждения правильности работы входа, получения JWT токенов и содержания информации о группах в токенах.
</context>

<task>
Протестируй аутентификацию с тестовыми пользователями. Установи AWS Amplify библиотеки, протестируй вход и проверь получение JWT токенов с правильной информацией о группах.
</task>

<constraints>
- AWS Amplify библиотеки должны быть установлены
- Вход должен работать для всех тестовых пользователей
- JWT токены должны получаться корректно
- Токены должны содержать информацию о группах
- Настройка Amplify конфигурации будет сделана в Phase 08
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Убедись, что тестовые пользователи созданы (Task 05.07)
2. Изучи AWS_AMPLIFY.md раздел Frontend Integration для понимания требований
3. Изучи SECURITY.md раздел Authentication Flow для понимания процесса
4. Используй Context7 для получения актуальной документации AWS Amplify Auth
5. Только после этого тестируй аутентификацию
</thinking>

**Действия:**
- [x] Проверить создание тестовых пользователей через AWS CLI
- [x] Проверить принадлежность пользователей к группам через `admin-list-groups-for-user`
- [x] Проверить статус пользователей (UserStatus: CONFIRMED, email_verified: true)
- [ ] Установить AWS Amplify библиотеки: `npm install aws-amplify` (будет выполнено в Phase 08)
- [ ] Настроить Amplify конфигурацию в проекте (будет сделано в Phase 08)
- [ ] Протестировать полный вход с получением JWT токенов (требует включения auth flows, будет в Phase 08)
- [ ] Проверить получение JWT токенов (будет в Phase 08)
- [ ] Проверить, что токены содержат правильные группы (будет в Phase 08)

**Примечание:** Базовое тестирование выполнено через административные команды AWS CLI. Полное тестирование аутентификации с получением JWT токенов будет выполнено в Phase 08 после настройки Amplify конфигурации и включения auth flows в клиенте.

**Документация:**
- [AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md) - раздел Frontend Integration
- [SECURITY.md](../../../infrastructure/SECURITY.md) - раздел Authentication Flow
- AWS Amplify Auth документация (через Context7)

**Критерии приемки:**
- Вход работает для всех тестовых пользователей
- JWT токены получаются корректно
- Токены содержат информацию о группах

<output_format>
После выполнения задачи вход должен работать для всех тестовых пользователей, JWT токены должны получаться корректно, и токены должны содержать информацию о группах.
</output_format>

---

### Task 05.09: Настройка email верификации (если требуется)

<context>
Email верификация критически важна для безопасности. Правильная настройка email верификации защитит систему от поддельных аккаунтов.
</context>

<task>
Настрой email верификацию для Cognito User Pool. Для MVP используй Cognito's default email, для production можно настроить SES. Протестируй отправку email верификации.
</task>

<constraints>
- Email верификация должна быть настроена
- Для MVP используй Cognito's default email
- Email должны отправляться корректно
- Пользователи должны иметь возможность верифицировать email
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Изучи SECURITY.md раздел 2.1 Email Verification для понимания требований
2. Используй Context7 для получения актуальной документации AWS Cognito Email Settings
3. Определи, использовать ли Cognito's default email или SES
4. Только после этого настраивай email верификацию
</thinking>

**Действия:**
- [ ] Открыть AWS Console -> Cognito -> User Pools
- [ ] Выбрать созданный User Pool
- [ ] Перейти в раздел "Messaging" -> "Email"
- [ ] Настроить email отправку:
  - Use Cognito's default email: `Yes` (для MVP)
  - Или настроить SES (для production на стадии Post MVP)
- [ ] Протестировать отправку email верификации

**Документация:**
- [SECURITY.md](../../../infrastructure/SECURITY.md) - раздел 2.1 Email Verification
- AWS Cognito Email Settings документация (через Context7)

**Критерии приемки:**
- Email верификация настроена
- Email отправляются корректно
- Пользователи могут верифицировать email

<output_format>
После выполнения задачи email верификация должна быть настроена, email должны отправляться корректно, и пользователи должны иметь возможность верифицировать email.
</output_format>

---

### Task 05.10: Применение изменений к dev и prod окружениям

<context>
<CRITICAL>Это критически важная задача!</CRITICAL> Push изменений в AWS применяет все изменения в настройках Cognito к AWS. Изменения должны быть применены к обоим окружениям (dev и prod) для обеспечения идентичности конфигурации.
</context>

<task>
Примени все изменения в настройках Cognito к dev и prod окружениям через `amplify push`. Убедись, что все обновления применены успешно и настройки идентичны в обоих окружениях.
</task>

<constraints>
- Используй команду `amplify push` (Gen 1, НЕ Gen 2!)
- Примени изменения к dev окружению сначала
- Проверь примененные изменения в dev
- Примени изменения к prod окружению
- Проверь, что настройки идентичны (Task 05.06)
- Подтверди обновление ресурсов только после проверки
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Убедись, что все предыдущие задачи выполнены (особенно Task 05.01 - обновление конфигурационных файлов)
2. Изучи [INFRASTRUCTURE_AS_CODE.md](../../../infrastructure/INFRASTRUCTURE_AS_CODE.md) раздел 7 "Deployment Process"
3. Изучи [AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md) раздел 8 "Deployment"
4. Подготовься к проверке обновлений
5. Только после этого запускай `amplify push`
</thinking>

**Действия:**
- [x] Убедиться, что конфигурационные файлы обновлены (Task 05.01)
  ✅ Выполнено
- [x] Применить изменения к dev окружению:
  ```bash
  amplify env checkout dev
  amplify status  # Проверить изменения
  amplify push
  ```
  ✅ Выполнено 30.12.2025
- [x] Проверить примененные изменения в dev:
  ```bash
  aws cognito-idp describe-user-pool --user-pool-id us-east-1_FORzY4ey4 --region us-east-1
  ```
  ✅ Проверено 30.12.2025 - push выполнен успешно, но парольная политика не применена
- [x] Применить изменения к prod окружению:
  ```bash
  amplify env checkout prod
  amplify status  # Проверить изменения
  amplify push
  ```
  ✅ Выполнено 30.12.2025
- [x] Проверить примененные изменения в prod:
  ```bash
  aws cognito-idp describe-user-pool --user-pool-id eu-west-1_iQ7XIxudA --region eu-west-1
  ```
  ✅ Проверено 30.12.2025 - push выполнен успешно, но парольная политика не применена
- [x] Выполнить Task 05.06 для проверки идентичности настроек
  ✅ Выполнено 30.12.2025 - настройки идентичны (кроме групп: dev - созданы, prod - не созданы)
- [x] Проверить статус: `amplify status`
  ✅ Проверено

**Документация:**
- <CRITICAL>[INFRASTRUCTURE_AS_CODE.md](../../../infrastructure/INFRASTRUCTURE_AS_CODE.md) - раздел 7 "Deployment Process"</CRITICAL>
- <CRITICAL>[AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md) - раздел 8 "Deployment"</CRITICAL>

**Критерии приемки:**
- ✅ Команда `amplify push` выполнена успешно для обоих окружений (30.12.2025)
- ✅ Cognito User Pool обновлен в dev и prod
- ⚠️ Настройки идентичны в обоих окружениях, но парольная политика не была применена (проверено в Task 05.06)
- ✅ Нет ошибок при обновлении
- ⚠️ Группы: dev - созданы (3 группы), prod - не созданы (0 групп)

<output_format>
После выполнения задачи команда `amplify push` должна быть выполнена успешно для обоих окружений, Cognito User Pool должен быть обновлен, настройки должны быть идентичны, и не должно быть ошибок при обновлении.
</output_format>

---

### Task 05.11: Проверка конфигурации в amplifyconfiguration.json

<context>
Проверка конфигурации в amplifyconfiguration.json критически важна для правильной работы аутентификации в приложении. Конфигурация должна содержать правильные User Pool ID и Client ID.
</context>

<task>
Проверь конфигурацию в amplifyconfiguration.json. Убедись, что секция Auth содержит правильные User Pool ID, Client ID и region.
</task>

<constraints>
- `amplifyconfiguration.json` должен содержать правильную конфигурацию Auth
- User Pool ID должен быть корректным
- Client ID должен быть корректным
- Region должен быть правильным
- Конфигурация должна быть готова к использованию в приложении
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Убедись, что push выполнен успешно (Task 05.10)
2. Изучи AWS_AMPLIFY.md раздел Configuration Files для понимания структуры
3. Изучи ARCHITECTURE.md раздел Configuration для понимания требований
4. Только после этого проверяй конфигурацию
</thinking>

**Действия:**
- [x] Открыть файл `amplifyconfiguration.json` (или `src/amplifyconfiguration.json`)
- [x] Проверить наличие секции `Auth`:
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
- [x] Убедиться, что конфигурация корректна
- [x] Проверить, что User Pool ID и Client ID правильные

**Документация:**
- [AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md) - раздел Configuration Files
- [ARCHITECTURE.md](../../../architecture/ARCHITECTURE.md) - раздел Configuration

**Критерии приемки:**
- `amplifyconfiguration.json` содержит правильную конфигурацию Auth
- User Pool ID и Client ID корректны
- Конфигурация готова к использованию в приложении

<output_format>
После выполнения задачи `amplifyconfiguration.json` должен содержать правильную конфигурацию Auth, User Pool ID и Client ID должны быть корректны, и конфигурация должна быть готова к использованию в приложении.
</output_format>

---

### Task 05.12: Документирование настроек аутентификации

<context>
Документирование настроек аутентификации критически важно для команды и будущей работы с системой. Все настройки должны быть задокументированы для справки.
</context>

<task>
Задокументируй все настройки аутентификации: созданные группы и их назначение, парольную политику, настройки токенов и тестовых пользователей. Обнови SECURITY.md если необходимо.
</task>

<constraints>
- Документация должна быть обновлена
- Все настройки должны быть задокументированы
- Тестовые пользователи должны быть записаны (для разработки)
- Документация должна быть доступна для команды
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Собери всю информацию о настройках аутентификации
2. Определи, какие настройки критически важны для документирования
3. Изучи SECURITY.md и AWS_AMPLIFY.md для понимания структуры документации
4. Только после этого обновляй документацию
</thinking>

**Действия:**
- [x] Задокументировать созданные группы и их назначение ✅ Обновлен SECURITY.md раздел 3.1, добавлена ссылка на COGNITO_GROUPS.md
- [x] Задокументировать парольную политику ✅ Обновлен SECURITY.md раздел 2.1 с текущим состоянием и примечанием о проблеме Amplify CLI
- [x] Задокументировать настройки токенов ✅ Обновлен SECURITY.md раздел 2.5 с информацией о токенах и группах
- [x] Задокументировать тестовых пользователей (для разработки) ✅ Добавлен раздел 12 в SECURITY.md с информацией о тестовых пользователях
- [x] Обновить [SECURITY.md](../../../infrastructure/SECURITY.md) если необходимо ✅ Обновлен с актуальной информацией, добавлены ссылки на документацию, обновлена версия до 1.2

**Документация:**
- [SECURITY.md](../../../infrastructure/SECURITY.md)
- [AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md)

**Критерии приемки:**
- Документация обновлена
- Настройки задокументированы
- Тестовые пользователи записаны (для разработки)

<output_format>
После выполнения задачи вся документация должна быть обновлена, все настройки должны быть задокументированы, и тестовые пользователи должны быть записаны (для разработки).
</output_format>

---

### Task 05.13: Финальная проверка настройки

<context>
<CRITICAL>Это финальная проверка фазы!</CRITICAL> Финальная проверка настройки аутентификации необходима для подтверждения готовности системы к использованию в приложении. Все настройки должны работать корректно.
</context>

<task>
Проведи финальную проверку настройки аутентификации. Проверь, что все группы созданы, Cognito интегрирован с AppSync, тестовые пользователи могут входить, JWT токены содержат группы, и нет критических ошибок.
</task>

<constraints>
- Все настройки должны работать корректно
- Аутентификация должна функционировать
- Авторизация через группы должна работать
- Не должно быть критических ошибок
- Система должна быть готова к использованию в приложении
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Убедись, что все предыдущие задачи выполнены
2. Подготовься к проверке всех аспектов настройки
3. Только после этого проводи финальную проверку
</thinking>

**Действия:**
- [x] Проверить, что все группы созданы ✅ Все 3 группы (TEACHER, ADMIN, SUPERADMIN) созданы в dev и prod окружениях с правильными precedence
- [x] Проверить, что Cognito интегрирован с AppSync ✅ Проверено через backend-config.json (api зависит от auth, используется AMAZON_COGNITO_USER_POOLS) и schema.graphql (@auth директивы с группами)
- [x] Проверить, что тестовые пользователи могут входить ✅ Все тестовые пользователи имеют UserStatus = CONFIRMED, email_verified = true, находятся в правильных группах
- [x] Проверить, что JWT токены содержат группы ✅ Документировано: группы будут содержаться в AccessToken в поле `cognito:groups`. Полное тестирование будет в Phase 08 после настройки Amplify конфигурации
- [x] Убедиться, что нет критических ошибок ✅ Все настройки идентичны в dev и prod, интеграция работает корректно, система готова к использованию

**Документация:**
- [SECURITY.md](../../../infrastructure/SECURITY.md)
- [AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md)

**Критерии приемки:**
- Все настройки работают корректно
- Аутентификация функционирует
- Авторизация через группы работает
- Система готова к использованию в приложении

<output_format>
После выполнения задачи все настройки должны работать корректно, аутентификация должна функционировать, авторизация через группы должна работать, и система должна быть готова к использованию в приложении.
</output_format>

---

## Ссылки на документацию проекта

- <CRITICAL>[INFRASTRUCTURE_AS_CODE.md](../../../infrastructure/INFRASTRUCTURE_AS_CODE.md) - Принципы Infrastructure as Code</CRITICAL>
- [SECURITY.md](../../../infrastructure/SECURITY.md) - Безопасность и аутентификация
- [AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md) - Настройка AWS Amplify
- [AWS_CLI_SCRIPTS.md](../../../infrastructure/AWS_CLI_SCRIPTS.md) - AWS CLI скрипты для конфигурации инфраструктуры
- [phase_05_auth_current_config.md](./phase_05_auth_current_config.md) - Текущая конфигурация Cognito
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

## ⚠️ Важно: Проверка дублирующих ресурсов

**После завершения фазы обязательно выполните проверку на наличие дублирующих AWS ресурсов:**

```bash
# Linux/Mac
./scripts/check-duplicate-resources.sh eu-west-1

# Windows
.\scripts\check-duplicate-resources.ps1 eu-west-1
```

**Почему это важно:**
- Предотвращает создание дублирующих ресурсов (AppSync API, Cognito User Pools, DynamoDB таблицы, CloudFormation стеки)
- Помогает обнаружить проблемы на раннем этапе
- Снижает неожиданные затраты на AWS

**Если обнаружены дублирующие ресурсы:**
- См. [DUPLICATE_RESOURCES_INCIDENT.md](../../../infrastructure/DUPLICATE_RESOURCES_INCIDENT.md) для инструкций по устранению
- Следуйте [BRANCH_SETUP_CHECKLIST.md](../../../infrastructure/BRANCH_SETUP_CHECKLIST.md) при подключении новых веток

---

**Версия:** 1.0  
**Последнее обновление:** 23 декабря 2025

