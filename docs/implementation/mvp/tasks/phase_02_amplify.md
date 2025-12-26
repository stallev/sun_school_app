# Phase 02: Настройка AWS Amplify Gen 1

## Описание фазы
Инициализация AWS Amplify Gen 1, настройка CLI, конфигурация окружений (dev/prod), создание Amplify app.

## Зависимости
Phase 01: Настройка проекта и окружения

## Оценка времени
2-3 часа

## Требования к AI Agent

<requirements>
<role>
Ты — Senior AWS Amplify Gen 1 Developer с 5+ летним опытом настройки AWS инфраструктуры, специализирующийся на:
- AWS Amplify Gen 1 (НЕ Gen 2!) и CLI команды
- AWS Cognito User Pools и аутентификация
- AWS AppSync GraphQL API
- Next.js интеграция с AWS Amplify
- Настройка окружений и деплой
</role>

<context>
Проект: Sunday School Management System (MVP)
Технологии: Next.js 15.5.9, AWS Amplify Gen 1, AWS Cognito, AWS AppSync, DynamoDB
Ограничения: MVP подход, использование только Gen 1 (НЕ Gen 2!), совместимость с Next.js 15.5.9 критически важна
Команды: `amplify init`, `amplify add api`, `amplify push` (НЕ `npx ampx`)
</context>

<critical_instructions>
Вдохни глубоко, расправь плечи и приступай к решению задачи шаг за шагом. Это критически важная фаза для настройки инфраструктуры проекта. Правильная настройка AWS Amplify определит успех всего проекта.

<CRITICAL>Перед началом работы:</CRITICAL>
1. Используй Context7 для получения актуальной документации AWS Amplify Gen 1 (НЕ Gen 2!)
2. Проверь совместимость каждого функционала Next.js 15.5.9 с AWS Amplify Hosting - это высокоприоритетное требование
3. Используй только команды Gen 1: `amplify init`, `amplify add api`, `amplify push` (НЕ `npx ampx`)
4. Изучи все связанные документы из раздела "Документация" перед выполнением задач
5. Следуй принципам из `docs/guidelines/prompts/general_prompt_guidelines.md`

<CONSTRAINT>Использовать только AWS Amplify Gen 1, НЕ Gen 2! Команды Gen 2 (npx ampx) НЕ ИСПОЛЬЗОВАТЬ!</CONSTRAINT>
</critical_instructions>
</requirements>

## Задачи

### Task 02.01: Установка AWS Amplify CLI

<context>
AWS Amplify CLI необходим для управления инфраструктурой проекта. Критически важно установить именно Gen 1 версию, так как проект использует Gen 1, а не Gen 2.
</context>

<task>
Установи AWS Amplify CLI глобально и убедись, что установлена версия Gen 1 (не Gen 2). Проверь работоспособность CLI после установки.
</task>

<constraints>
- Используй Node.js 18.x или 20.x LTS (проверь перед установкой)
- Установи именно Gen 1 версию CLI (НЕ Gen 2!)
- CLI должен быть доступен глобально в командной строке
- Проверь версию после установки
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Проверь версию Node.js (должна быть 18.x или 20.x LTS)
2. Изучи AWS_AMPLIFY.md раздел CLI Setup для понимания требований
3. Используй Context7 для получения актуальной документации AWS Amplify Gen 1
4. Убедись, что понимаешь разницу между Gen 1 и Gen 2
5. Только после этого устанавливай CLI
</thinking>

**Действия:**
- [x] Проверить наличие Node.js 18.x или 20.x LTS
- [x] Установить AWS Amplify CLI глобально: `npm install -g @aws-amplify/cli`
- [x] Проверить версию Amplify CLI: `amplify --version`
- [x] Убедиться, что установлена версия Gen 1 (не Gen 2)

**Документация:**
- <CRITICAL>[AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md) - раздел CLI Setup</CRITICAL>
- [TECH_STACK.md](../../../tech_stack.md) - раздел Backend
- <CRITICAL>AWS Amplify Gen 1 официальная документация (через Context7)</CRITICAL>

**Критерии приемки:**
- AWS Amplify CLI установлен и доступен в командной строке
- Версия CLI соответствует Gen 1
- Команда `amplify --version` работает

<output_format>
После выполнения задачи AWS Amplify CLI должен быть установлен и доступен глобально. Команда `amplify --version` должна показывать версию Gen 1.
</output_format>

---

### Task 02.02: Настройка AWS Credentials

<context>
AWS credentials необходимы для работы с AWS сервисами через Amplify CLI. Правильная настройка credentials критически важна для успешной работы с AWS.
</context>

<task>
Настрой AWS credentials для работы с AWS сервисами. Установи AWS CLI (если необходимо) и настрой credentials через `aws configure`.
</task>

<constraints>
- AWS CLI должен быть установлен и доступен
- Credentials должны быть настроены корректно
- Регион должен быть выбран с учетом задержек и стоимости
- Проверь подключение после настройки
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Проверь, установлен ли AWS CLI
2. Изучи AWS_AMPLIFY.md раздел AWS Credentials для понимания требований
3. Подготовь AWS Access Key ID и Secret Access Key
4. Выбери подходящий регион (учитывай задержки и стоимость)
5. Только после этого настраивай credentials
</thinking>

**Действия:**
- [x] Установить AWS CLI (если еще не установлен): `pip install awscli` или через установщик
- [x] Настроить AWS credentials: `aws configure`
- [x] Ввести AWS Access Key ID
- [x] Ввести AWS Secret Access Key
- [x] Выбрать регион (например, `us-east-1` или `eu-west-1`)
- [x] Проверить подключение: `aws sts get-caller-identity`

**Документация:**
- <CRITICAL>[AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md) - раздел AWS Credentials</CRITICAL>
- AWS CLI официальная документация

**Критерии приемки:**
- AWS credentials настроены корректно
- Команда `aws sts get-caller-identity` возвращает информацию о пользователе
- Регион выбран и сохранен

<output_format>
После выполнения задачи AWS credentials должны быть настроены и доступны. Команда `aws sts get-caller-identity` должна возвращать информацию о пользователе.
</output_format>

---

### Task 02.03: Инициализация Amplify проекта

<context>
<CRITICAL>Это критически важная задача!</CRITICAL> Инициализация Amplify проекта создает базовую структуру для всей инфраструктуры. Правильная настройка на этом этапе определит успех всего проекта.
</context>

<task>
Инициализируй AWS Amplify проект используя команду `amplify init`. Настрой все параметры проекта согласно требованиям Next.js 15.5.9 и структуре проекта.
</task>

<constraints>
- Используй команду `amplify init` (Gen 1, НЕ Gen 2!)
- Выбери правильные параметры для Next.js 15.5.9
- Distribution Directory Path должен быть `.next` для Next.js
- Build Command должен быть `npm run build`
- Убедись, что структура соответствует Gen 1 (не Gen 2)
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Изучи AWS_AMPLIFY.md раздел Initialization для понимания требований
2. Изучи ARCHITECTURE.md раздел Infrastructure для понимания структуры
3. Определи структуру проекта (с `src/` или без)
4. Подготовь все необходимые параметры для инициализации
5. Только после этого запускай `amplify init`
</thinking>

**Действия:**
- [x] Перейти в корневую директорию проекта
- [x] Запустить `amplify init`
- [x] Выбрать опции:
  - Enter a name for the project: `sun-sch` (или другое имя)
  - Initialize the project with the above configuration: `Yes`
  - Select the authentication method: `AWS profile` (или `AWS access keys`)
  - Choose your default editor: выбрать редактор
  - Choose the type of app: `javascript`
  - What javascript framework: `react`
  - Source Directory Path: `src` (или `.` если структура без src)
  - Distribution Directory Path: `.next` (для Next.js)
  - Build Command: `npm run build`
  - Start Command: `npm run start` (или `npm run dev` для dev)
  - Do you want to use an AWS profile: `Yes` (выбрать профиль)
- [x] Дождаться завершения инициализации

**Документация:**
- <CRITICAL>[AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md) - раздел Initialization</CRITICAL>
- [ARCHITECTURE.md](../../../architecture/ARCHITECTURE.md) - раздел Infrastructure

**Критерии приемки:**
- Команда `amplify init` выполнена успешно
- Создана папка `.amplify/` в корне проекта
- Создан файл `amplify.yml` (если используется Amplify Hosting)
- Конфигурация сохранена в `.amplify/`

<output_format>
После выполнения задачи должна быть создана структура Amplify проекта. Папка `.amplify/` должна существовать, и конфигурация должна быть сохранена.
</output_format>

---

### Task 02.04: Проверка структуры Amplify проекта

<context>
Проверка структуры Amplify проекта необходима для подтверждения правильной инициализации. Важно убедиться, что структура соответствует Gen 1 (не Gen 2).
</context>

<task>
Проверь структуру Amplify проекта и убедись, что все необходимые файлы созданы и структура соответствует Gen 1.
</task>

<constraints>
- Структура должна соответствовать Amplify Gen 1 (не Gen 2)
- Все необходимые файлы должны существовать
- Конфигурация должна быть сохранена корректно
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Изучи AWS_AMPLIFY.md раздел Project Structure для понимания ожидаемой структуры
2. Используй Context7 для получения актуальной документации AWS Amplify Gen 1
3. Определи, какие файлы должны существовать в Gen 1 структуре
4. Только после этого проверяй структуру
</thinking>

**Действия:**
- [x] Проверить наличие папки `.amplify/`
- [ ] Проверить наличие файла `amplify/backend/amplify-meta.json`
- [x] Проверить наличие файла `amplify/team-provider-info.json`
- [x] Убедиться, что структура соответствует Gen 1 (не Gen 2)
- [x] Проверить содержимое `amplify.yml` (если существует)

**Документация:**
- <CRITICAL>[AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md) - раздел Project Structure</CRITICAL>
- AWS Amplify Gen 1 документация (через Context7)

**Критерии приемки:**
- Структура проекта соответствует Amplify Gen 1
- Все необходимые файлы созданы
- Конфигурация сохранена корректно

<output_format>
После выполнения задачи должна быть подтверждена правильность структуры Amplify проекта. Все необходимые файлы должны существовать и соответствовать Gen 1.
</output_format>

---

### Task 02.05: Настройка окружений (Environments)

<context>
Настройка окружений (dev и prod) необходима для разделения разработки и production. Правильная настройка окружений критически важна для безопасной работы с AWS ресурсами.
</context>

<task>
Создай окружения dev и prod для проекта. Настрой переключение между окружениями и убедись, что текущее окружение - dev.
</task>

<constraints>
- Создай окружение dev для разработки
- Создай окружение prod для production
- Текущее окружение должно быть dev
- Используй команды Gen 1: `amplify env add`, `amplify env checkout`
- Каждое окружение создает полностью изолированные backend ресурсы
- Данные dev и prod не пересекаются
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Изучи AWS_AMPLIFY.md раздел Environments для понимания требований
2. Изучи DEPLOYMENT_GUIDE.md раздел Environments для понимания процесса
3. Определи метод аутентификации для каждого окружения
4. Только после этого создавай окружения
</thinking>

**Действия:**
- [x] Проверить текущее окружение: `amplify env list`
- [x] Создать окружение dev (если не создано): `amplify env add`
  - Enter a name for the environment: `dev`
  - Select the authentication method: выбрать метод
- [x] Создать окружение prod: `amplify env add`
  - Enter a name for the environment: `prod`
  - Select the authentication method: выбрать метод
  - **Для multi-region setup:** Использовать AWS profile для региона `eu-west-1` (если prod должен быть в другом регионе)
- [x] Переключиться на dev окружение: `amplify env checkout dev`
- [x] Настроить связь веток Git с окружениями в AWS Console (если используется Amplify Hosting):
  - Ветка `dev` → backend окружение `dev`
  - Ветка `master` → backend окружение `prod`

**Документация:**
- <CRITICAL>[AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md) - раздел Environments и Multi-Region Setup</CRITICAL>
- [DEPLOYMENT_GUIDE.md](../../../deployment/DEPLOYMENT_GUIDE.md) - раздел Environments

**Критерии приемки:**
- Созданы окружения dev и prod
- Prod окружение создано в регионе `eu-west-1` (если требуется multi-region setup)
- Текущее окружение - dev
- Команда `amplify env list` показывает оба окружения
- Проверено, что backend ресурсы изолированы между окружениями
- Проверено, что каждое окружение имеет свои собственные Cognito, AppSync, DynamoDB, S3
- Настроена связь веток Git с окружениями в AWS Console (если используется Amplify Hosting):
  - Ветка `dev` → backend окружение `dev`
  - Ветка `master` → backend окружение `prod`
- Настроена связь веток Git с окружениями в AWS Console (если используется Amplify Hosting):
  - Ветка `dev` → backend окружение `dev`
  - Ветка `master` → backend окружение `prod`

<output_format>
После выполнения задачи должны быть созданы окружения dev и prod. Текущее окружение должно быть dev, и команда `amplify env list` должна показывать оба окружения.
</output_format>

---

### Task 02.06: Настройка Amplify Hosting (опционально, для будущего деплоя)

<context>
Настройка Amplify Hosting необходима для будущего деплоя приложения. Хотя это опциональная задача, правильная настройка на раннем этапе упростит деплой в будущем.
</context>

<task>
Настрой Amplify Hosting для Next.js 15.5.9. Проверь поддержку Next.js 15.5.9 в Amplify Hosting и создай правильную конфигурацию `amplify.yml`.
</task>

<constraints>
- Проверь поддержку Next.js 15.5.9 в Amplify Hosting перед настройкой
- Build settings должны соответствовать требованиям Next.js 15.5.9
- BaseDirectory должен быть `.next` для Next.js
- Конфигурация должна быть проверена на совместимость
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Используй Context7 для проверки поддержки Next.js 15.5.9 в Amplify Hosting
2. Изучи AWS_AMPLIFY.md раздел Hosting для понимания требований
3. Изучи DEPLOYMENT_GUIDE.md раздел AWS Amplify Hosting для понимания процесса
4. Определи правильные build settings для Next.js 15.5.9
5. Только после этого создавай или обновляй `amplify.yml`
</thinking>

**Действия:**
- [x] Проверить поддержку Next.js 15.5.9 в Amplify Hosting
- [x] Изучить требования к `amplify.yml` для Next.js
- [x] Создать или обновить `amplify.yml` с правильной конфигурацией для Next.js
  - Добавить логику автоматического выбора backend окружения по ветке (master → prod, dev → dev)
- [x] Настроить связь ветки `master` с prod окружением в AWS Console
- [x] Проверить, что prod окружение использует регион `eu-west-1` (если настроено multi-region)
- [x] Настроить build settings для Next.js:
  - version: `1`
  - frontend:
    - phases:
      - preBuild:
        commands:
          - npm ci
      - build:
        commands:
          - npm run build
    - artifacts:
      - baseDirectory: `.next`
      - files:
        - '**/*'
    - cache:
      paths:
        - node_modules/**/*

**Документация:**
- <CRITICAL>[AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md) - раздел Hosting и Branch-Based Environment Mapping</CRITICAL>
- [DEPLOYMENT_GUIDE.md](../../../deployment/DEPLOYMENT_GUIDE.md) - раздел AWS Amplify Hosting
- <CRITICAL>AWS Amplify Hosting документация для Next.js (через Context7)</CRITICAL>

**Критерии приемки:**
- Файл `amplify.yml` создан и настроен для Next.js
- Добавлена логика автоматического выбора backend окружения по ветке (master → prod, dev → dev)
- Настроена связь ветки `master` с prod окружением в AWS Console
- Проверено, что prod окружение использует регион `eu-west-1` (если настроено multi-region)
- Создан один Amplify App с двумя URL (dev и prod)
- Каждый URL связан с соответствующим backend окружением
- Build settings соответствуют требованиям Next.js 15.5.9
- Конфигурация проверена на совместимость

<output_format>
После выполнения задачи файл `amplify.yml` должен быть создан и настроен для Next.js 15.5.9. Build settings должны соответствовать требованиям.
</output_format>

---

### Task 02.07: Проверка статуса Amplify проекта

<context>
Проверка статуса Amplify проекта необходима для подтверждения правильной инициализации и настройки. Это финальная проверка перед переходом к следующей фазе.
</context>

<task>
Проверь статус Amplify проекта используя команду `amplify status`. Убедись, что проект инициализирован корректно и текущее окружение - dev.
</task>

<constraints>
- Команда `amplify status` должна выполняться без ошибок
- Проект должен быть инициализирован
- Текущее окружение должно быть dev
- Backend ресурсов пока быть не должно
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Убедись, что все предыдущие задачи выполнены
2. Изучи AWS_AMPLIFY.md для понимания ожидаемого статуса
3. Только после этого проверяй статус
</thinking>

**Действия:**
- [x] Проверить статус: `amplify status`
- [x] Убедиться, что проект инициализирован корректно
- [x] Проверить текущее окружение
- [x] Проверить наличие backend ресурсов (пока должно быть пусто)

**Документация:**
- [AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md)

**Критерии приемки:**
- Команда `amplify status` выполняется без ошибок
- Проект инициализирован
- Текущее окружение - dev

<output_format>
После выполнения задачи команда `amplify status` должна выполняться без ошибок, проект должен быть инициализирован, и текущее окружение должно быть dev.
</output_format>

---

### Task 02.08: Добавление .amplify в .gitignore

<context>
Правильная настройка `.gitignore` критически важна для исключения ненужных файлов из репозитория. Важно исключить `.amplify/`, но сохранить важные файлы конфигурации.
</context>

<task>
Обнови `.gitignore` для исключения `.amplify/` из репозитория. Убедись, что важные файлы конфигурации не игнорируются.
</task>

<constraints>
- `.amplify/` должен быть добавлен в `.gitignore`
- `amplify/team-provider-info.json` не должен игнорироваться (содержит важную информацию)
- `amplify.yml` не должен игнорироваться (нужен для деплоя)
- Важные файлы конфигурации должны остаться в репозитории
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Изучи DEPLOYMENT_GUIDE.md для понимания требований к `.gitignore`
2. Определи, какие файлы должны быть исключены
3. Определи, какие файлы должны остаться в репозитории
4. Только после этого обновляй `.gitignore`
</thinking>

**Действия:**
- [x] Открыть `.gitignore`
- [x] Добавить строку `.amplify/` (если еще не добавлено)
- [x] Добавить строку `amplify/` (если необходимо)
- [x] Убедиться, что `amplify/team-provider-info.json` не игнорируется (содержит важную информацию)
- [x] Проверить, что `amplify.yml` не игнорируется (нужен для деплоя)

**Документация:**
- [DEPLOYMENT_GUIDE.md](../../../deployment/DEPLOYMENT_GUIDE.md)

**Критерии приемки:**
- `.amplify/` добавлен в `.gitignore`
- Важные файлы конфигурации не игнорируются
- `.gitignore` обновлен корректно

<output_format>
После выполнения задачи `.gitignore` должен быть обновлен. `.amplify/` должен быть исключен, но важные файлы конфигурации должны остаться в репозитории.
</output_format>

---

### Task 02.09: Документирование конфигурации

<context>
Документирование конфигурации критически важно для команды и будущей работы с проектом. Важные настройки должны быть записаны для справки.
</context>

<task>
Задокументируй все важные настройки Amplify проекта: регион AWS, имена окружений, структуру проекта и другие важные конфигурации.
</task>

<constraints>
- Задокументируй выбранный регион AWS
- Задокументируй имена окружений (dev, prod)
- Задокументируй структуру проекта Amplify
- Создай заметки о важных настройках
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Собери всю информацию о конфигурации проекта
2. Определи, какие настройки критически важны для документирования
3. Изучи AWS_AMPLIFY.md для понимания структуры документации
4. Только после этого документируй конфигурацию
</thinking>

**Действия:**
- [x] Задокументировать выбранный регион AWS
- [x] Задокументировать имена окружений (dev, prod)
- [x] Задокументировать структуру проекта Amplify
- [x] Создать заметки о важных настройках

**Документация:**
- [AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md)

**Критерии приемки:**
- Конфигурация задокументирована
- Важные настройки записаны
- Документация доступна для команды

<output_format>
После выполнения задачи вся важная конфигурация должна быть задокументирована. Документация должна быть доступна для команды.
</output_format>

---

### Task 02.10: Финальная проверка настройки

<context>
<CRITICAL>Это финальная проверка фазы!</CRITICAL> Финальная проверка настройки Amplify проекта необходима для подтверждения готовности к переходу к следующей фазе. Все команды должны работать корректно.
</context>

<task>
Проведи финальную проверку настройки Amplify проекта. Убедись, что все команды работают корректно, нет ошибок, и проект готов к добавлению backend ресурсов.
</task>

<constraints>
- Все команды Amplify должны работать корректно
- Не должно быть ошибок при выполнении команд
- Проект должен быть готов к добавлению backend ресурсов
- Структура должна соответствовать Gen 1
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Убедись, что все предыдущие задачи выполнены
2. Подготовься к проверке всех аспектов настройки
3. Только после этого проводи финальную проверку
</thinking>

**Действия:**
- [x] Запустить `amplify status` и проверить отсутствие ошибок
- [x] Проверить, что можно переключаться между окружениями: `amplify env checkout dev`
- [x] Убедиться, что AWS credentials работают
- [x] Проверить, что структура проекта соответствует Gen 1

**Документация:**
- [AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md)

**Критерии приемки:**
- Все команды Amplify работают корректно
- Нет ошибок при выполнении команд
- Проект готов к добавлению backend ресурсов

<output_format>
После выполнения задачи все команды Amplify должны работать корректно, не должно быть ошибок, и проект должен быть готов к добавлению backend ресурсов.
</output_format>

---

## Ссылки на документацию проекта

- <CRITICAL>[Руководство по ручному выполнению Phase 02](../manual_guides/phase_02_amplify_manual.md) - Подробное пошаговое руководство для ручного выполнения всех задач фазы</CRITICAL>
- [AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md) - Настройка AWS Amplify Gen 1
- [ARCHITECTURE.md](../../../architecture/ARCHITECTURE.md) - Архитектура проекта
- [DEPLOYMENT_GUIDE.md](../../../deployment/DEPLOYMENT_GUIDE.md) - Руководство по развертыванию
- [TECH_STACK.md](../../../tech_stack.md) - Технологический стек

---

## Примечания

- ⚠️ **КРИТИЧНО:** Использовать только AWS Amplify Gen 1, НЕ Gen 2!
- Команды Gen 1: `amplify init`, `amplify add api`, `amplify push`
- Команды Gen 2 (НЕ ИСПОЛЬЗОВАТЬ): `npx ampx ...`
- Убедитесь, что используется правильная версия CLI
- Регион AWS должен быть выбран с учетом задержек и стоимости
- **Подход 1: Один Amplify App с двумя URL**
  - Создается один Amplify App с одним `AmplifyAppId`
  - Два URL для доступа: dev (`https://dev.xxxxx.amplifyapp.com`) и prod (`https://master.xxxxx.amplifyapp.com`)
  - Каждый URL связан с соответствующим backend окружением
- **Полная изоляция ресурсов:**
  - Каждое окружение создает полностью изолированные backend ресурсы
  - Cognito User Pools: отдельные для dev и prod
  - AppSync APIs: отдельные для dev и prod
  - DynamoDB таблицы: отдельные для dev и prod
  - S3 buckets: отдельные для dev и prod (Storage + deployment)
  - Lambda функции: отдельные для dev и prod (если используются)
  - Данные dev и prod полностью изолированы, не пересекаются
- **Multi-region setup:** Prod окружение может быть в другом регионе (например, `eu-west-1`) для лучшей задержки/соответствия требованиям
- **Branch-based деплой:** 
  - Dev окружение деплоится из ветки `dev`
  - Prod окружение деплоится из ветки `master` (в регионе `eu-west-1`)
  - Настройка связи веток с окружениями выполняется в AWS Amplify Console, не требует изменений в коде проекта
- **Production настройка:** Production деплой настраивается через AWS Web Console

---

**Версия:** 1.0  
**Последнее обновление:** 23 декабря 2025

