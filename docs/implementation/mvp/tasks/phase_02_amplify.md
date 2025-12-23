# Phase 02: Настройка AWS Amplify Gen 1

## Описание фазы
Инициализация AWS Amplify Gen 1, настройка CLI, конфигурация окружений (dev/prod), создание Amplify app.

## Зависимости
Phase 01: Настройка проекта и окружения

## Оценка времени
2-3 часа

## Требования к AI Agent

> [!IMPORTANT]
> - AI Agent при создании программного кода должен использовать актуальную документацию для конкретной версии библиотеки или фреймворка через Context7
> - Для AWS Amplify должна быть использована документация для Gen 1 (НЕ Gen 2!)
> - Команды Amplify Gen 1: `amplify init`, `amplify add api`, `amplify push` (НЕ `npx ampx`)
> - Перед созданием кода необходимо проверять какой функционал NextJS поддерживается AWS Amplify. Это высокоприоритетное требование.
> - Следовать принципам из `docs/guidelines/prompts/general_prompt_guidelines.md`

## Задачи

### Task 02.01: Установка AWS Amplify CLI
- [ ] Проверить наличие Node.js 18.x или 20.x LTS
- [ ] Установить AWS Amplify CLI глобально: `npm install -g @aws-amplify/cli`
- [ ] Проверить версию Amplify CLI: `amplify --version`
- [ ] Убедиться, что установлена версия Gen 1 (не Gen 2)

**Документация:**
- [AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md) - раздел CLI Setup
- [TECH_STACK.md](../../../tech_stack.md) - раздел Backend
- AWS Amplify Gen 1 официальная документация (через Context7)

**Критерии приемки:**
- AWS Amplify CLI установлен и доступен в командной строке
- Версия CLI соответствует Gen 1
- Команда `amplify --version` работает

---

### Task 02.02: Настройка AWS Credentials
- [ ] Установить AWS CLI (если еще не установлен): `pip install awscli` или через установщик
- [ ] Настроить AWS credentials: `aws configure`
- [ ] Ввести AWS Access Key ID
- [ ] Ввести AWS Secret Access Key
- [ ] Выбрать регион (например, `us-east-1` или `eu-west-1`)
- [ ] Проверить подключение: `aws sts get-caller-identity`

**Документация:**
- [AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md) - раздел AWS Credentials
- AWS CLI официальная документация

**Критерии приемки:**
- AWS credentials настроены корректно
- Команда `aws sts get-caller-identity` возвращает информацию о пользователе
- Регион выбран и сохранен

---

### Task 02.03: Инициализация Amplify проекта
- [ ] Перейти в корневую директорию проекта
- [ ] Запустить `amplify init`
- [ ] Выбрать опции:
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
- [ ] Дождаться завершения инициализации

**Документация:**
- [AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md) - раздел Initialization
- [ARCHITECTURE.md](../../../architecture/ARCHITECTURE.md) - раздел Infrastructure

**Критерии приемки:**
- Команда `amplify init` выполнена успешно
- Создана папка `.amplify/` в корне проекта
- Создан файл `amplify.yml` (если используется Amplify Hosting)
- Конфигурация сохранена в `.amplify/`

---

### Task 02.04: Проверка структуры Amplify проекта
- [ ] Проверить наличие папки `.amplify/`
- [ ] Проверить наличие файла `amplify/backend/amplify-meta.json`
- [ ] Проверить наличие файла `amplify/team-provider-info.json`
- [ ] Убедиться, что структура соответствует Gen 1 (не Gen 2)
- [ ] Проверить содержимое `amplify.yml` (если существует)

**Документация:**
- [AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md) - раздел Project Structure
- AWS Amplify Gen 1 документация (через Context7)

**Критерии приемки:**
- Структура проекта соответствует Amplify Gen 1
- Все необходимые файлы созданы
- Конфигурация сохранена корректно

---

### Task 02.05: Настройка окружений (Environments)
- [ ] Проверить текущее окружение: `amplify env list`
- [ ] Создать окружение dev (если не создано): `amplify env add`
  - Enter a name for the environment: `dev`
  - Select the authentication method: выбрать метод
- [ ] Создать окружение prod: `amplify env add`
  - Enter a name for the environment: `prod`
  - Select the authentication method: выбрать метод
- [ ] Переключиться на dev окружение: `amplify env checkout dev`

**Документация:**
- [AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md) - раздел Environments
- [DEPLOYMENT_GUIDE.md](../../../deployment/DEPLOYMENT_GUIDE.md) - раздел Environments

**Критерии приемки:**
- Созданы окружения dev и prod
- Текущее окружение - dev
- Команда `amplify env list` показывает оба окружения

---

### Task 02.06: Настройка Amplify Hosting (опционально, для будущего деплоя)
- [ ] Проверить поддержку Next.js 15.5.9 в Amplify Hosting
- [ ] Изучить требования к `amplify.yml` для Next.js
- [ ] Создать или обновить `amplify.yml` с правильной конфигурацией для Next.js
- [ ] Настроить build settings для Next.js:
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
- [AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md) - раздел Hosting
- [DEPLOYMENT_GUIDE.md](../../../deployment/DEPLOYMENT_GUIDE.md) - раздел AWS Amplify Hosting
- AWS Amplify Hosting документация для Next.js (через Context7)

**Критерии приемки:**
- Файл `amplify.yml` создан и настроен для Next.js
- Build settings соответствуют требованиям Next.js 15.5.9
- Конфигурация проверена на совместимость

---

### Task 02.07: Проверка статуса Amplify проекта
- [ ] Проверить статус: `amplify status`
- [ ] Убедиться, что проект инициализирован корректно
- [ ] Проверить текущее окружение
- [ ] Проверить наличие backend ресурсов (пока должно быть пусто)

**Документация:**
- [AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md)

**Критерии приемки:**
- Команда `amplify status` выполняется без ошибок
- Проект инициализирован
- Текущее окружение - dev

---

### Task 02.08: Добавление .amplify в .gitignore
- [ ] Открыть `.gitignore`
- [ ] Добавить строку `.amplify/` (если еще не добавлено)
- [ ] Добавить строку `amplify/` (если необходимо)
- [ ] Убедиться, что `amplify/team-provider-info.json` не игнорируется (содержит важную информацию)
- [ ] Проверить, что `amplify.yml` не игнорируется (нужен для деплоя)

**Документация:**
- [DEPLOYMENT_GUIDE.md](../../../deployment/DEPLOYMENT_GUIDE.md)

**Критерии приемки:**
- `.amplify/` добавлен в `.gitignore`
- Важные файлы конфигурации не игнорируются
- `.gitignore` обновлен корректно

---

### Task 02.09: Документирование конфигурации
- [ ] Задокументировать выбранный регион AWS
- [ ] Задокументировать имена окружений (dev, prod)
- [ ] Задокументировать структуру проекта Amplify
- [ ] Создать заметки о важных настройках

**Документация:**
- [AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md)

**Критерии приемки:**
- Конфигурация задокументирована
- Важные настройки записаны
- Документация доступна для команды

---

### Task 02.10: Финальная проверка настройки
- [ ] Запустить `amplify status` и проверить отсутствие ошибок
- [ ] Проверить, что можно переключаться между окружениями: `amplify env checkout dev`
- [ ] Убедиться, что AWS credentials работают
- [ ] Проверить, что структура проекта соответствует Gen 1

**Документация:**
- [AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md)

**Критерии приемки:**
- Все команды Amplify работают корректно
- Нет ошибок при выполнении команд
- Проект готов к добавлению backend ресурсов

---

## Ссылки на документацию проекта

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

---

**Версия:** 1.0  
**Последнее обновление:** 23 декабря 2025

