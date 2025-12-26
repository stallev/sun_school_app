# Руководство по ручному выполнению Phase 02: Настройка AWS Amplify Gen 1

## Версия документа: 1.0
**Дата создания:** 23 декабря 2025  
**Целевая аудитория:** Разработчики, выполняющие настройку вручную  
**Предварительные требования:** Завершена Phase 01 (Настройка проекта и окружения)

---

## Содержание

1. [Введение](#введение)
2. [Task 02.01: Установка AWS Amplify CLI](#task-0201-установка-aws-amplify-cli)
3. [Task 02.02: Настройка AWS Credentials](#task-0202-настройка-aws-credentials)
4. [Task 02.03: Инициализация Amplify проекта](#task-0203-инициализация-amplify-проекта)
5. [Task 02.04: Проверка структуры Amplify проекта](#task-0204-проверка-структуры-amplify-проекта)
6. [Task 02.05: Настройка окружений (Environments)](#task-0205-настройка-окружений-environments)
7. [Task 02.06: Настройка Amplify Hosting (опционально)](#task-0206-настройка-amplify-hosting-опционально)
8. [Task 02.07: Проверка статуса Amplify проекта](#task-0207-проверка-статуса-amplify-проекта)
9. [Task 02.08: Добавление .amplify в .gitignore](#task-0208-добавление-amplify-в-gitignore)
10. [Task 02.09: Документирование конфигурации](#task-0209-документирование-конфигурации)
11. [Task 02.10: Финальная проверка настройки](#task-0210-финальная-проверка-настройки)
12. [Устранение неполадок](#устранение-неполадок)
13. [Полезные ссылки](#полезные-ссылки)

---

## Введение

Это руководство предназначено для **ручного выполнения** задач Phase 02 по настройке AWS Amplify Gen 1. Все инструкции написаны для человека, который хочет разобраться в деталях процесса.

### ⚠️ Критически важно

- **Используется только AWS Amplify Gen 1**, НЕ Gen 2!
- Команды Gen 1: `amplify init`, `amplify add api`, `amplify push`
- Команды Gen 2 (НЕ ИСПОЛЬЗОВАТЬ): `npx ampx ...`
- Убедитесь, что используете правильную версию CLI

### ℹ️ Важная информация

**Если вы уже настроили Amplify Hosting через AWS Web Console:**

- Task 02.06 (Настройка Amplify Hosting) можно выполнить частично:
  - Выполните проверку существующей настройки (Шаг 0)
  - Создайте или обновите файл `amplify.yml` для контроля конфигурации
  - Проверьте соответствие настроек Next.js 15.5.9
- Настройки из Web Console будут работать параллельно с локальным `amplify.yml`
- При следующем деплое Amplify будет использовать настройки из `amplify.yml` или из консоли (в зависимости от того, что было настроено последним)

### Что вы получите после выполнения

- Настроенный AWS Amplify Gen 1 проект
- Два окружения: `dev` и `prod`
- Готовая структура для добавления backend ресурсов (Auth, API, Storage)
- Конфигурация для будущего деплоя (или проверка существующей настройки Hosting)

### Оценка времени

- **Общее время:** 2-3 часа
- **Task 02.01-02.02:** 15-20 минут
- **Task 02.03:** 10-15 минут
- **Task 02.04-02.05:** 10-15 минут
- **Task 02.06:** 15-20 минут (опционально)
- **Task 02.07-02.10:** 20-30 минут

---

## Task 02.01: Установка AWS Amplify CLI

### Цель задачи

Установить AWS Amplify CLI глобально и убедиться, что установлена версия Gen 1 (не Gen 2).

### Почему это важно

AWS Amplify CLI — это инструмент командной строки для управления инфраструктурой AWS Amplify. Без него невозможно инициализировать проект, добавлять ресурсы (Auth, API, Storage) и деплоить изменения.

### Пошаговая инструкция

#### Шаг 1: Проверка версии Node.js

**Почему:** AWS Amplify CLI требует Node.js версии 18.x или 20.x LTS.

**Действие:**

Откройте терминал (PowerShell, Command Prompt, или Terminal) и выполните:

```bash
node --version
```

**Ожидаемый результат:**

```
v20.11.0
```

или

```
v18.19.0
```

**Если версия не подходит:**

1. **Windows:** Скачайте и установите Node.js с официального сайта: https://nodejs.org/
   - Выберите версию 20.x LTS (Long Term Support)
   - Следуйте инструкциям установщика

2. **macOS:** Используйте Homebrew:
   ```bash
   brew install node@20
   ```

3. **Linux (Ubuntu/Debian):**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

**После установки:** Перезапустите терминал и снова проверьте версию.

#### Шаг 2: Установка AWS Amplify CLI

**Почему:** Нужно установить CLI глобально, чтобы команда `amplify` была доступна из любой директории.

**Действие:**

Выполните команду установки:

```bash
npm install -g @aws-amplify/cli
```

**Что происходит:**

- npm скачивает пакет `@aws-amplify/cli` из реестра npm
- Устанавливает его глобально (в системную папку node_modules)
- Создает символическую ссылку на исполняемый файл `amplify`

**Время выполнения:** 1-3 минуты (зависит от скорости интернета)

**Возможные проблемы:**

1. **Ошибка прав доступа (Permission denied):**
   - **Windows:** Запустите PowerShell или Command Prompt от имени администратора
   - **macOS/Linux:** Используйте `sudo`:
     ```bash
     sudo npm install -g @aws-amplify/cli
     ```

2. **Ошибка "npm не найден":**
   - Убедитесь, что Node.js установлен корректно
   - Проверьте, что npm доступен: `npm --version`

#### Шаг 3: Проверка версии Amplify CLI

**Почему:** Нужно убедиться, что установлена версия Gen 1, а не Gen 2.

**Действие:**

```bash
amplify --version
```

**Ожидаемый результат:**

```
12.15.0
```

или другая версия формата `12.x.x` (это Gen 1).

**Как отличить Gen 1 от Gen 2:**

- **Gen 1:** Версия начинается с `12.x.x` или `11.x.x`
- **Gen 2:** Использует команду `npx ampx` (не `amplify`)

**Если версия не отображается:**

1. Проверьте, что установка завершилась успешно
2. Перезапустите терминал
3. Проверьте PATH: `echo $PATH` (macOS/Linux) или `echo %PATH%` (Windows)
4. Попробуйте полный путь: `C:\Users\YourName\AppData\Roaming\npm\amplify.cmd` (Windows)

#### Шаг 4: Проверка работоспособности CLI

**Почему:** Убедиться, что CLI работает корректно.

**Действие:**

```bash
amplify help
```

**Ожидаемый результат:**

Должен отобразиться список доступных команд:

```
amplify <command> <subcommand>

Available Commands:
  init          Initializes a new project, sets up providers, and creates the project structure locally and in the cloud.
  configure     Configures the attributes of your project for amplify-cli, such as switching front-end framework and adding/removing cloud-provider plugins.
  push          Provisions cloud resources with the latest local developments.
  pull          Pulls the latest backend corresponding to the current cloud environment.
  publish       Executes amplify push, and then builds and publishes client-side application for hosting.
  ...
```

### Критерии успешного выполнения

- ✅ Node.js версии 18.x или 20.x установлен
- ✅ AWS Amplify CLI установлен глобально
- ✅ Команда `amplify --version` показывает версию Gen 1 (12.x.x)
- ✅ Команда `amplify help` работает

### Что дальше

После успешного выполнения переходите к **Task 02.02: Настройка AWS Credentials**.

---

## Task 02.02: Настройка AWS Credentials

### Цель задачи

Настроить AWS credentials для работы с AWS сервисами через Amplify CLI.

### Почему это важно

AWS credentials (Access Key ID и Secret Access Key) необходимы для:
- Аутентификации в AWS
- Создания и управления AWS ресурсами (Cognito, AppSync, DynamoDB, S3)
- Деплоя инфраструктуры через Amplify CLI

Без правильных credentials Amplify CLI не сможет создавать ресурсы в AWS.

### Пошаговая инструкция

#### Шаг 1: Установка AWS CLI (если еще не установлен)

**Почему:** AWS CLI позволяет управлять credentials и проверять подключение к AWS.

**Проверка установки:**

```bash
aws --version
```

**Если AWS CLI не установлен:**

**Windows:**

1. Скачайте установщик MSI: https://awscli.amazonaws.com/AWSCLIV2.msi
2. Запустите установщик и следуйте инструкциям
3. Перезапустите терминал

**macOS:**

```bash
brew install awscli
```

**Linux (Ubuntu/Debian):**

```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

#### Шаг 2: Получение AWS Access Key ID и Secret Access Key

**Почему:** Эти ключи необходимы для аутентификации в AWS.

**Вариант 1: Создание нового IAM пользователя (рекомендуется)**

1. **Войдите в AWS Console:**
   - Откройте https://console.aws.amazon.com/
   - Войдите в свой аккаунт

2. **Перейдите в IAM:**
   - В поиске введите "IAM"
   - Выберите "IAM" из результатов

3. **Создайте нового пользователя:**
   - Нажмите "Users" (Пользователи) в левом меню
   - Нажмите "Create user" (Создать пользователя)
   - Введите имя пользователя: `amplify-dev` (или другое имя)
   - Нажмите "Next"

4. **Назначьте права:**
   - Выберите "Attach policies directly" (Прикрепить политики напрямую)
   - Найдите и выберите политику: **`AdministratorAccess`** (для разработки)
   - ⚠️ **Важно:** Для production используйте более ограниченные права
   - Нажмите "Next"

5. **Создайте Access Key:**
   - Нажмите "Create user" (Создать пользователя)
   - После создания пользователя, нажмите на имя пользователя
   - Перейдите на вкладку "Security credentials" (Безопасность)
   - Прокрутите до раздела "Access keys"
   - Нажмите "Create access key"
   - Выберите "Command Line Interface (CLI)"
   - Нажмите "Next"
   - Добавьте описание (опционально): "Amplify CLI development"
   - Нажмите "Create access key"

6. **Скопируйте ключи:**
   - **Access Key ID:** Скопируйте и сохраните в безопасном месте
   - **Secret Access Key:** Скопируйте и сохраните в безопасном месте
   - ⚠️ **КРИТИЧЕСКИ ВАЖНО:** Secret Access Key показывается только один раз! Сохраните его сразу.

**Вариант 2: Использование существующих ключей**

Если у вас уже есть Access Key ID и Secret Access Key, используйте их.

#### Шаг 3: Настройка AWS credentials через AWS CLI

**Почему:** AWS CLI сохраняет credentials в файле `~/.aws/credentials`, который используется Amplify CLI.

**Действие:**

Выполните команду:

```bash
aws configure
```

**Интерактивный процесс:**

1. **AWS Access Key ID:** Вставьте ваш Access Key ID и нажмите Enter
2. **AWS Secret Access Key:** Вставьте ваш Secret Access Key и нажмите Enter
3. **Default region name:** Введите регион AWS (например, `us-east-1` или `eu-west-1`)
   - **Рекомендации по выбору региона:**
     - `us-east-1` (N. Virginia) — самый дешевый, хорошая задержка для США
     - `eu-west-1` (Ireland) — хорошая задержка для Европы
     - `ap-southeast-1` (Singapore) — для Азии
   - Выберите регион, ближайший к вашим пользователям
4. **Default output format:** Оставьте `json` (нажмите Enter)

**Пример сессии:**

```
AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
Default region name [None]: us-east-1
Default output format [None]: json
```

**Что происходит:**

- AWS CLI создает файл `~/.aws/credentials` (Windows: `C:\Users\YourName\.aws\credentials`)
- Сохраняет Access Key ID и Secret Access Key
- Создает файл `~/.aws/config` с настройками региона и формата вывода

#### Шаг 4: Проверка подключения к AWS

**Почему:** Убедиться, что credentials работают корректно.

**Действие:**

```bash
aws sts get-caller-identity
```

**Ожидаемый результат:**

```json
{
    "UserId": "AIDAXXXXXXXXXXXXXXXXX",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/amplify-dev"
}
```

**Если команда не работает:**

1. **Ошибка "Unable to locate credentials":**
   - Проверьте, что файл `~/.aws/credentials` существует
   - Убедитесь, что вы правильно ввели Access Key ID и Secret Access Key

2. **Ошибка "InvalidClientTokenId":**
   - Проверьте, что Access Key ID правильный
   - Убедитесь, что ключ не был удален в AWS Console

3. **Ошибка "SignatureDoesNotMatch":**
   - Проверьте, что Secret Access Key правильный
   - Убедитесь, что вы скопировали ключ полностью (без пробелов)

#### Шаг 5: Настройка Amplify CLI с AWS credentials (альтернативный метод)

**Почему:** Amplify CLI может использовать отдельную конфигурацию.

**Действие:**

```bash
amplify configure
```

**Интерактивный процесс:**

1. **Specify the AWS Region:** Выберите регион (например, `us-east-1`)
2. **Specify the user name:** Введите имя пользователя (например, `amplify-dev`)
3. **Complete the user creation using the AWS console:**
   - Откроется браузер с AWS Console
   - Следуйте инструкциям для создания пользователя
   - Или используйте существующего пользователя

4. **Enter the access key of the newly created user:**
   - Введите Access Key ID
   - Введите Secret Access Key

**Примечание:** Если вы уже настроили `aws configure`, этот шаг можно пропустить, так как Amplify CLI будет использовать credentials из `~/.aws/credentials`.

### Критерии успешного выполнения

- ✅ AWS CLI установлен и работает
- ✅ AWS credentials настроены через `aws configure`
- ✅ Команда `aws sts get-caller-identity` возвращает информацию о пользователе
- ✅ Регион выбран и сохранен

### Что дальше

После успешного выполнения переходите к **Task 02.03: Инициализация Amplify проекта**.

---

## Task 02.03: Инициализация Amplify проекта

### Цель задачи

Инициализировать AWS Amplify проект в вашем Next.js приложении, создав базовую структуру для управления инфраструктурой.

### Почему это важно

Инициализация создает:
- Структуру папок `amplify/` для конфигурации backend ресурсов
- Файлы конфигурации для управления окружениями
- Связь между локальным проектом и AWS Amplify Console

Без инициализации невозможно добавлять backend ресурсы (Auth, API, Storage).

### Пошаговая инструкция

#### Шаг 1: Переход в корневую директорию проекта

**Почему:** Команда `amplify init` должна выполняться в корне проекта, где находится `package.json`.

**Действие:**

```bash
cd C:\github\sun_sch
```

или путь к вашему проекту.

**Проверка:**

```bash
ls package.json
```

или

```bash
dir package.json
```

Должен отобразиться файл `package.json`.

#### Шаг 2: Запуск инициализации Amplify

**Почему:** Команда `amplify init` создает структуру проекта и настраивает связь с AWS.

**Действие:**

```bash
amplify init
```

**Интерактивный процесс:**

Amplify CLI задаст несколько вопросов. Ниже приведены рекомендации по ответам:

1. **Enter a name for the project:**
   ```
   sun-sch
   ```
   - Или другое имя проекта (без пробелов, только буквы, цифры и дефисы)
   - Это имя будет использоваться для создания AWS ресурсов

2. **Initialize the project with the above configuration?**
   ```
   Yes
   ```
   - Или `No`, если хотите настроить вручную

3. **Enter a name for the environment:**
   ```
   dev
   ```
   - Это имя окружения (environment)
   - Обычно используют `dev` для разработки, `prod` для production
   - Можно создать несколько окружений позже

4. **Choose your default editor:**
   ```
   Visual Studio Code
   ```
   - Или другой редактор (Notepad, vim, nano)
   - Используется для открытия файлов конфигурации

5. **Choose the type of app that you're building:**
   ```
   javascript
   ```
   - Выберите `javascript` для Next.js проекта

6. **What javascript framework are you using:**
   ```
   react
   ```
   - Next.js использует React, поэтому выберите `react`

7. **Source Directory Path:**
   ```
   .
   ```
   - Если структура проекта без папки `src/`, используйте `.` (текущая директория)
   - Если есть папка `src/`, используйте `src`

8. **Distribution Directory Path:**
   ```
   .next
   ```
   - Для Next.js это всегда `.next` (папка со скомпилированным приложением)

9. **Build Command:**
   ```
   npm run build
   ```
   - Команда для сборки Next.js приложения

10. **Start Command:**
    ```
    npm run dev
    ```
    - Команда для запуска dev сервера
    - Или `npm run start` для production

11. **Do you want to use an AWS profile?**
    ```
    Yes
    ```
    - Выберите `Yes`, если настроили AWS credentials через `aws configure`
    - Или `No`, если хотите ввести credentials вручную

12. **Please choose the profile you want to use:**
    ```
    default
    ```
    - Выберите профиль, созданный через `aws configure`
    - Обычно это `default`

**Пример полной сессии:**

```
? Enter a name for the project: sun-sch
? Initialize the project with the above configuration? Yes
? Enter a name for the environment: dev
? Choose your default editor: Visual Studio Code
? Choose the type of app that you're building: javascript
? What javascript framework are you using: react
? Source Directory Path: .
? Distribution Directory Path: .next
? Build Command: npm run build
? Start Command: npm run dev
? Do you want to use an AWS profile? Yes
? Please choose the profile you want to use: default
```

**Что происходит:**

1. Amplify CLI создает папку `amplify/` в корне проекта
2. Создает файлы конфигурации:
   - `amplify/backend/amplify-meta.json` — метаданные о backend ресурсах
   - `amplify/team-provider-info.json` — информация о окружениях и AWS ресурсах
   - `amplify/.config/` — конфигурация CLI
3. Создает CloudFormation stack в AWS (если это первый раз)
4. Создает S3 bucket для хранения артефактов деплоя

**Время выполнения:** 2-5 минут (зависит от скорости интернета и AWS)

#### Шаг 3: Ожидание завершения инициализации

**Почему:** Процесс может занять несколько минут, особенно при первом запуске.

**Что вы увидите:**

```
Initializing your environment: dev
⠋ Initializing provider plugins...
⠋ Checking for existing Amplify Console app...
⠋ Creating new Amplify Console app...
⠋ Initializing backend environment: dev
⠋ Creating CloudFormation stack...
⠋ Creating deployment bucket...
✅ Initialized your environment successfully.
```

**Если процесс завис:**

- Подождите 5-10 минут (особенно при первом запуске)
- Проверьте интернет-соединение
- Проверьте AWS credentials: `aws sts get-caller-identity`

**Если произошла ошибка:**

См. раздел [Устранение неполадок](#устранение-неполадок).

#### Шаг 4: Проверка созданных файлов

**Почему:** Убедиться, что структура создана корректно.

**Действие:**

```bash
ls amplify
```

или

```bash
dir amplify
```

**Ожидаемый результат:**

Должны быть видны папки:
- `amplify/backend/`
- `amplify/.config/`
- `amplify/team-provider-info.json`

**Проверка содержимого:**

```bash
cat amplify/team-provider-info.json
```

или

```bash
type amplify\team-provider-info.json
```

**Ожидаемый результат (пример):**

```json
{
  "dev": {
    "awscloudformation": {
      "Region": "us-east-1",
      "DeploymentBucketName": "amplify-sun-sch-dev-12345-deployment",
      "UnauthRoleName": "amplify-sun-sch-dev-12345-unauthRole",
      "StackName": "amplify-sun-sch-dev-12345",
      "StackId": "arn:aws:cloudformation:us-east-1:123456789012:stack/amplify-sun-sch-dev-12345/abc123",
      "AmplifyAppId": "d1234567890abc"
    }
  }
}
```

### Критерии успешного выполнения

- ✅ Команда `amplify init` выполнена без ошибок
- ✅ Создана папка `amplify/` в корне проекта
- ✅ Создан файл `amplify/team-provider-info.json`
- ✅ Создан файл `amplify/backend/amplify-meta.json`
- ✅ В AWS создан CloudFormation stack (можно проверить в AWS Console)

### Что дальше

После успешного выполнения переходите к **Task 02.04: Проверка структуры Amplify проекта**.

---

## Task 02.04: Проверка структуры Amplify проекта

### Цель задачи

Проверить, что структура Amplify проекта создана корректно и соответствует Gen 1 (не Gen 2).

### Почему это важно

Правильная структура гарантирует, что:
- Проект использует Gen 1 (не Gen 2)
- Все необходимые файлы созданы
- Конфигурация сохранена корректно

### Пошаговая инструкция

#### Шаг 1: Проверка наличия папки `.amplify/`

**Почему:** Папка `.amplify/` содержит локальные метаданные проекта (Gen 1).

**Действие:**

```bash
ls .amplify
```

или

```bash
dir .amplify
```

**Ожидаемый результат:**

Папка должна существовать (может быть скрыта).

**Если папка не видна:**

- В Windows: Включите показ скрытых файлов
- В macOS/Linux: Используйте `ls -la` для показа скрытых файлов

**Примечание:** В Gen 1 папка `.amplify/` может отсутствовать или быть пустой. Это нормально.

#### Шаг 2: Проверка наличия папки `amplify/`

**Почему:** Папка `amplify/` содержит конфигурацию backend ресурсов (Gen 1).

**Действие:**

```bash
ls amplify
```

**Ожидаемый результат:**

Должны быть видны:
- `amplify/backend/`
- `amplify/.config/`
- `amplify/team-provider-info.json`

#### Шаг 3: Проверка структуры `amplify/backend/`

**Почему:** Убедиться, что структура соответствует Gen 1.

**Действие:**

```bash
ls amplify/backend
```

**Ожидаемый результат:**

Должны быть видны:
- `amplify/backend/amplify-meta.json`
- `amplify/backend/backend-config.json`

**Проверка содержимого:**

```bash
cat amplify/backend/amplify-meta.json
```

**Ожидаемый результат (пример):**

```json
{
  "providers": {
    "awscloudformation": {
      "AuthRoleName": "amplify-sun-sch-dev-12345-authRole",
      "UnauthRoleName": "amplify-sun-sch-dev-12345-unauthRole",
      "AuthRoleArn": "arn:aws:iam::123456789012:role/amplify-sun-sch-dev-12345-authRole",
      "UnauthRoleArn": "arn:aws:iam::123456789012:role/amplify-sun-sch-dev-12345-unauthRole",
      "Region": "us-east-1"
    }
  }
}
```

#### Шаг 4: Проверка структуры `amplify/.config/`

**Почему:** Убедиться, что конфигурация CLI сохранена.

**Действие:**

```bash
ls amplify/.config
```

**Ожидаемый результат:**

Должны быть видны файлы конфигурации CLI.

#### Шаг 5: Проверка файла `amplify/team-provider-info.json`

**Почему:** Этот файл содержит информацию о окружениях и AWS ресурсах.

**Действие:**

```bash
cat amplify/team-provider-info.json
```

**Ожидаемый результат:**

Должен содержать информацию о текущем окружении (например, `dev`):

```json
{
  "dev": {
    "awscloudformation": {
      "Region": "us-east-1",
      "DeploymentBucketName": "amplify-sun-sch-dev-12345-deployment",
      "UnauthRoleName": "amplify-sun-sch-dev-12345-unauthRole",
      "AuthRoleName": "amplify-sun-sch-dev-12345-authRole",
      "StackName": "amplify-sun-sch-dev-12345",
      "StackId": "arn:aws:cloudformation:us-east-1:123456789012:stack/amplify-sun-sch-dev-12345/abc123",
      "AmplifyAppId": "d1234567890abc"
    }
  }
}
```

#### Шаг 6: Проверка отсутствия Gen 2 файлов

**Почему:** Убедиться, что проект использует Gen 1, а не Gen 2.

**Что НЕ должно быть:**

- ❌ Папка `amplify_outputs.json` (это Gen 2)
- ❌ Файл `amplify/data/resource.ts` (это Gen 2)
- ❌ Команды `npx ampx` в документации

**Что ДОЛЖНО быть:**

- ✅ Папка `amplify/backend/` (это Gen 1)
- ✅ Файл `amplify/team-provider-info.json` (это Gen 1)
- ✅ Команды `amplify init`, `amplify push` (это Gen 1)

#### Шаг 7: Проверка файла `amplify.yml` (если существует)

**Почему:** Файл `amplify.yml` используется для настройки Amplify Hosting (опционально).

**Действие:**

```bash
cat amplify.yml
```

**Ожидаемый результат:**

Если файл существует, он должен содержать конфигурацию для деплоя (см. Task 02.06).

**Если файл не существует:**

Это нормально на данном этапе. Файл будет создан в Task 02.06 (опционально).

### Критерии успешного выполнения

- ✅ Структура проекта соответствует Amplify Gen 1
- ✅ Все необходимые файлы созданы
- ✅ Конфигурация сохранена корректно
- ✅ Отсутствуют файлы Gen 2

### Что дальше

После успешного выполнения переходите к **Task 02.05: Настройка окружений (Environments)**.

---

## Task 02.05: Настройка окружений (Environments)

### Цель задачи

Создать окружения `dev` и `prod` для разделения разработки и production.

### Почему это важно

Окружения позволяют:
- Разделить разработку и production
- Тестировать изменения в `dev` перед деплоем в `prod`
- Использовать разные AWS ресурсы для разных окружений
- Безопасно экспериментировать без влияния на production

### Пошаговая инструкция

#### Шаг 1: Проверка текущего окружения

**Почему:** Убедиться, что текущее окружение — `dev`.

**Действие:**

```bash
amplify env list
```

**Ожидаемый результат:**

```
| Environments |
| ------------ |
| * dev        |
```

Звездочка (`*`) указывает на текущее активное окружение.

**Если команда не работает:**

- Убедитесь, что вы в корне проекта
- Проверьте, что `amplify init` был выполнен успешно

#### Шаг 2: Создание окружения `dev` (если не создано)

**Почему:** Окружение `dev` обычно создается автоматически при `amplify init`, но можно создать вручную.

**Действие:**

```bash
amplify env add
```

**Интерактивный процесс:**

1. **Enter a name for the environment:**
   ```
   dev
   ```

2. **Select the authentication method you want to use:**
   ```
   AWS profile
   ```
   - Или `AWS access keys`, если хотите ввести ключи вручную

3. **Please choose the profile you want to use:**
   ```
   default
   ```
   - Или другой профиль

**Если окружение `dev` уже существует:**

Вы увидите сообщение:
```
Environment 'dev' already exists.
```

В этом случае пропустите этот шаг.

#### Шаг 3: Создание окружения `prod`

**Почему:** Окружение `prod` необходимо для production деплоя.

**Действие:**

```bash
amplify env add
```

**Интерактивный процесс:**

1. **Enter a name for the environment:**
   ```
   prod
   ```

2. **Select the authentication method you want to use:**
   ```
   AWS profile
   ```

3. **Please choose the profile you want to use:**
   ```
   default
   ```
   - Или другой профиль (можно использовать отдельный профиль для production)

**Что происходит:**

- Amplify CLI создает новое окружение `prod`
- Создает отдельный CloudFormation stack в AWS для `prod`
- Создает отдельный S3 bucket для артефактов деплоя `prod`

**Время выполнения:** 2-5 минут

#### Шаг 4: Переключение на окружение `dev`

**Почему:** Убедиться, что текущее окружение — `dev` для разработки.

**Действие:**

```bash
amplify env checkout dev
```

**Ожидаемый результат:**

```
Switched to environment 'dev'
```

**Что происходит:**

- Amplify CLI переключает локальную конфигурацию на окружение `dev`
- Обновляет файлы конфигурации для использования ресурсов `dev`

#### Шаг 5: Проверка списка окружений

**Почему:** Убедиться, что оба окружения созданы.

**Действие:**

```bash
amplify env list
```

**Ожидаемый результат:**

```
| Environments |
| ------------ |
| * dev        |
|   prod       |
```

Звездочка (`*`) указывает на текущее активное окружение (`dev`).

#### Шаг 6: Проверка конфигурации окружений

**Почему:** Убедиться, что конфигурация сохранена корректно.

**Действие:**

```bash
cat amplify/team-provider-info.json
```

**Ожидаемый результат:**

Должны быть видны оба окружения:

```json
{
  "dev": {
    "awscloudformation": {
      "Region": "us-east-1",
      "DeploymentBucketName": "amplify-sun-sch-dev-12345-deployment",
      "StackName": "amplify-sun-sch-dev-12345",
      "AmplifyAppId": "d1234567890abc"
    }
  },
  "prod": {
    "awscloudformation": {
      "Region": "us-east-1",
      "DeploymentBucketName": "amplify-sun-sch-prod-67890-deployment",
      "StackName": "amplify-sun-sch-prod-67890",
      "AmplifyAppId": "d1234567890abc"
    }
  }
}
```

**Примечание:** Оба окружения используют один и тот же `AmplifyAppId`, но разные CloudFormation stacks.

### Критерии успешного выполнения

- ✅ Созданы окружения `dev` и `prod`
- ✅ Текущее окружение — `dev`
- ✅ Команда `amplify env list` показывает оба окружения
- ✅ Конфигурация сохранена в `amplify/team-provider-info.json`

### Что дальше

После успешного выполнения переходите к **Task 02.06: Настройка Amplify Hosting (опционально)** или **Task 02.07: Проверка статуса Amplify проекта**.

---

## Task 02.06: Настройка Amplify Hosting (опционально)

### Цель задачи

Настроить Amplify Hosting для будущего деплоя Next.js 15.5.9 приложения или проверить существующую настройку, если Hosting уже настроен через AWS Web Console.

### Почему это важно

Amplify Hosting предоставляет:
- Автоматический CI/CD pipeline (Git-based деплой)
- CloudFront CDN для быстрой доставки контента
- Автоматический SSL сертификат
- Preview environments для feature branches

**⚠️ Важно:** Эта задача опциональна на данном этапе. Можно выполнить позже, когда будет готово к деплою.

**ℹ️ Примечание:** Если вы уже настроили Amplify Hosting через AWS Web Console, выполните шаги проверки и синхронизации (Шаги 1-3), затем переходите к проверке конфигурации `amplify.yml` (Шаг 4).

### Пошаговая инструкция

#### Шаг 0: Проверка существующей настройки Hosting (если настроено через Web Console)

**Почему:** Если Hosting уже настроен через AWS Web Console, нужно проверить и синхронизировать локальную конфигурацию.

**Действие 1: Проверка в AWS Console**

1. **Откройте AWS Amplify Console:**
   - Перейдите на https://console.aws.amazon.com/amplify/
   - Войдите в свой AWS аккаунт

2. **Найдите ваш Amplify App:**
   - Найдите приложение по имени проекта (например, `sun-sch`)
   - Или используйте AmplifyAppId из `amplify/team-provider-info.json`

3. **Проверьте подключение Git репозитория:**
   - Перейдите в раздел "App settings" → "General"
   - Проверьте, подключен ли репозиторий (GitHub, GitLab, Bitbucket, CodeCommit)
   - Если репозиторий подключен, отметьте это: ✅

4. **Проверьте Build settings:**
   - Перейдите в раздел "Build settings"
   - Проверьте следующие параметры:
     - **Build command:** Должен быть `npm run build` (или `npm ci && npm run build`)
     - **Base directory:** Должен быть `.` (корень проекта) или пусто
     - **Artifacts directory:** Должен быть `.next` для Next.js
     - **Build image:** Должен поддерживать Node.js 18.x или 20.x

5. **Проверьте Environment variables (если настроены):**
   - Перейдите в раздел "App settings" → "Environment variables"
   - Убедитесь, что переменные окружения настроены корректно (если используются)

**Что проверить для Next.js 15.5.9:**

- ✅ Build command использует `npm run build`
- ✅ Artifacts directory установлен в `.next`
- ✅ Node.js версия 18.x или 20.x (проверьте в build logs)
- ✅ Build image поддерживает Next.js App Router и Server Components

**Действие 2: Проверка локальной конфигурации**

```bash
ls amplify.yml
```

**Если файл `amplify.yml` существует:**

- Откройте файл и проверьте конфигурацию (см. Шаг 4)
- Убедитесь, что настройки соответствуют Next.js 15.5.9

**Если файл `amplify.yml` не существует:**

- Amplify Console может использовать автоматически сгенерированную конфигурацию
- Рекомендуется создать файл `amplify.yml` вручную для контроля (см. Шаг 4)

**Действие 3: Синхронизация с локальным проектом (опционально)**

Если Hosting настроен через Web Console, но вы хотите управлять им через CLI:

```bash
amplify pull
```

Эта команда синхронизирует локальную конфигурацию с настройками в AWS.

**Примечание:** Если вы предпочитаете управлять Hosting только через Web Console, можете пропустить создание `amplify.yml` и использовать настройки из консоли.

#### Шаг 1: Проверка поддержки Next.js 15.5.9 в Amplify Hosting

**Почему:** Убедиться, что Amplify Hosting поддерживает Next.js 15.5.9.

**Действие:**

1. Откройте документацию AWS Amplify Hosting: https://docs.aws.amazon.com/amplify/latest/userguide/welcome.html
2. Проверьте раздел о поддержке Next.js
3. Или проверьте файл `docs/infrastructure/AMPLIFY_COMPATIBILITY.md` в проекте

**Ожидаемый результат:**

Amplify Hosting должен поддерживать Next.js 15.5.9, включая:
- App Router
- Server Components
- Server Actions

#### Шаг 2: Создание или обновление файла `amplify.yml`

**Почему:** Файл `amplify.yml` определяет процесс сборки и деплоя приложения. Если Hosting уже настроен через Web Console, этот файл может отсутствовать, но рекомендуется создать его для контроля конфигурации.

**Действие:**

**Если файл уже существует:**

Проверьте его содержимое и при необходимости обновите (см. Шаг 3).

**Если файл не существует:**

Создайте файл `amplify.yml` в корне проекта:

```bash
touch amplify.yml
```

или в Windows:

```bash
type nul > amplify.yml
```

**Важно:** Если Hosting уже настроен через Web Console, создание `amplify.yml` не перезапишет настройки в консоли автоматически. 

**Рекомендации:**

1. **Если настройки в Web Console правильные:**
   - Создайте `amplify.yml` с теми же настройками для контроля версий
   - При следующем push в Git Amplify будет использовать настройки из `amplify.yml` (если файл существует в репозитории)

2. **Если настройки в Web Console нужно обновить:**
   - Обновите настройки в Web Console вручную, ИЛИ
   - Создайте `amplify.yml` с правильными настройками и закоммитьте в Git — Amplify автоматически использует настройки из файла при следующем деплое

3. **Для синхронизации:**
   - Если вы хотите, чтобы локальный `amplify.yml` соответствовал настройкам в консоли, проверьте настройки в консоли и скопируйте их в `amplify.yml`
   - Или используйте `amplify pull` для синхронизации (если доступно)

#### Шаг 3: Настройка конфигурации `amplify.yml`

**Почему:** Правильная конфигурация обеспечивает корректную сборку Next.js приложения.

**Действие:**

Откройте файл `amplify.yml` в редакторе и добавьте следующую конфигурацию:

```yaml
version: 1
backend:
  phases:
    build:
      commands:
        - amplifyPush --simple
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

**Объяснение конфигурации:**

- **`version: 1`** — версия формата конфигурации
- **`backend.phases.build`** — команды для деплоя backend ресурсов (Auth, API, Storage)
  - `amplifyPush --simple` — деплой backend без интерактивных вопросов
- **`frontend.phases.preBuild`** — команды перед сборкой
  - `npm ci` — установка зависимостей (быстрее, чем `npm install`)
- **`frontend.phases.build`** — команды для сборки
  - `npm run build` — сборка Next.js приложения
- **`artifacts.baseDirectory`** — директория со скомпилированным приложением (`.next` для Next.js)
- **`artifacts.files`** — файлы для деплоя (`**/*` — все файлы)
- **`cache.paths`** — пути для кеширования (ускоряет последующие сборки)

**Сохранение файла:**

Сохраните файл `amplify.yml` в корне проекта.

#### Шаг 4: Проверка синтаксиса YAML

**Почему:** Убедиться, что файл `amplify.yml` имеет правильный синтаксис.

**Действие:**

Проверьте файл вручную:
- Убедитесь, что отступы правильные (используйте пробелы, не табы)
- Убедитесь, что нет синтаксических ошибок

**Или используйте онлайн валидатор YAML:** https://www.yamllint.com/

#### Шаг 5: Добавление Hosting через CLI (опционально)

**Почему:** Можно добавить Hosting через CLI, но это не обязательно на данном этапе.

**Действие:**

```bash
amplify add hosting
```

**Интерактивный процесс:**

1. **Select the plugin module to execute:**
   ```
   Hosting with Amplify Console
   ```

2. **Choose a type:**
   ```
   Continuous deployment (Git-based deployments)
   ```
   - Или `Manual deployment`, если хотите деплоить вручную

**Что происходит:**

- Amplify CLI открывает браузер с AWS Amplify Console
- Там можно подключить Git репозиторий для автоматического деплоя

**Примечание:** Этот шаг можно пропустить, если вы не готовы к деплою сейчас.

### Критерии успешного выполнения

- ✅ Проверена существующая настройка Hosting (если настроено через Web Console)
- ✅ Файл `amplify.yml` создан и настроен для Next.js (или обновлен, если уже существует)
- ✅ Build settings соответствуют требованиям Next.js 15.5.9
- ✅ Конфигурация проверена на синтаксические ошибки
- ✅ Настройки синхронизированы с AWS Console (если Hosting уже настроен)

**Примечание для пользователей, настроивших Hosting через Web Console:**

Если вы настроили Hosting через AWS Web Console:
- ✅ Проверьте, что настройки в консоли соответствуют требованиям Next.js 15.5.9
- ✅ Убедитесь, что `amplify.yml` создан для будущего контроля конфигурации
- ✅ При следующем push в Git (если настроен автоматический деплой) Amplify будет использовать настройки из `amplify.yml` или из консоли (в зависимости от того, что было настроено последним)

### Что дальше

После успешного выполнения переходите к **Task 02.07: Проверка статуса Amplify проекта**.

---

## Task 02.07: Проверка статуса Amplify проекта

### Цель задачи

Проверить статус Amplify проекта и убедиться, что все настроено корректно.

### Почему это важно

Проверка статуса позволяет:
- Убедиться, что проект инициализирован корректно
- Проверить текущее окружение
- Увидеть список backend ресурсов (пока пустой)

### Пошаговая инструкция

#### Шаг 1: Проверка статуса проекта

**Почему:** Команда `amplify status` показывает текущее состояние проекта.

**Действие:**

```bash
amplify status
```

**Ожидаемый результат:**

```
Current Environment: dev

| Category | Resource name | Operation | Provider plugin   |
| -------- | ------------- | --------- | ----------------- |
| No resources found |               |           |                   |
```

**Объяснение:**

- **Current Environment:** Текущее активное окружение (`dev`)
- **No resources found:** Это нормально на данном этапе, так как мы еще не добавили backend ресурсы (Auth, API, Storage)

#### Шаг 2: Проверка текущего окружения

**Почему:** Убедиться, что текущее окружение — `dev`.

**Действие:**

```bash
amplify env list
```

**Ожидаемый результат:**

```
| Environments |
| ------------ |
| * dev        |
|   prod       |
```

Звездочка (`*`) указывает на текущее активное окружение.

#### Шаг 3: Проверка наличия backend ресурсов

**Почему:** На данном этапе backend ресурсов быть не должно.

**Действие:**

```bash
amplify status
```

**Ожидаемый результат:**

```
No resources found
```

**Если видны ресурсы:**

- Это нормально, если вы уже добавили ресурсы вручную
- Или если ресурсы были добавлены в предыдущих сессиях

#### Шаг 4: Проверка конфигурации проекта

**Почему:** Убедиться, что конфигурация сохранена корректно.

**Действие:**

```bash
cat amplify/backend/amplify-meta.json
```

**Ожидаемый результат:**

Должен содержать информацию о провайдере (AWS):

```json
{
  "providers": {
    "awscloudformation": {
      "AuthRoleName": "amplify-sun-sch-dev-12345-authRole",
      "UnauthRoleName": "amplify-sun-sch-dev-12345-unauthRole",
      "AuthRoleArn": "arn:aws:iam::123456789012:role/amplify-sun-sch-dev-12345-authRole",
      "UnauthRoleArn": "arn:aws:iam::123456789012:role/amplify-sun-sch-dev-12345-unauthRole",
      "Region": "us-east-1"
    }
  }
}
```

### Критерии успешного выполнения

- ✅ Команда `amplify status` выполняется без ошибок
- ✅ Проект инициализирован
- ✅ Текущее окружение — `dev`
- ✅ Backend ресурсов пока нет (это нормально)

### Что дальше

После успешного выполнения переходите к **Task 02.08: Добавление .amplify в .gitignore**.

---

## Task 02.08: Добавление .amplify в .gitignore

### Цель задачи

Обновить `.gitignore` для исключения ненужных файлов из репозитория, но сохранить важные файлы конфигурации.

### Почему это важно

Правильная настройка `.gitignore`:
- Исключает локальные файлы, которые не должны быть в репозитории
- Сохраняет важные файлы конфигурации для команды
- Предотвращает случайный коммит чувствительных данных

### Пошаговая инструкция

#### Шаг 1: Открытие файла `.gitignore`

**Почему:** Нужно добавить правила для исключения файлов Amplify.

**Действие:**

Откройте файл `.gitignore` в корне проекта в вашем редакторе.

**Если файла нет:**

Создайте файл `.gitignore` в корне проекта.

#### Шаг 2: Добавление правил для `.amplify/`

**Почему:** Папка `.amplify/` содержит локальные метаданные, которые не должны быть в репозитории.

**Действие:**

Добавьте следующую строку в `.gitignore`:

```
.amplify/
```

**Где добавить:**

Добавьте в конец файла или в раздел, связанный с Amplify.

**Пример `.gitignore`:**

```
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
.next/
out/

# Production
build/
dist/

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local

# Amplify
.amplify/
```

#### Шаг 3: Проверка исключения `amplify/team-provider-info.json`

**Почему:** Файл `amplify/team-provider-info.json` содержит важную информацию о окружениях, но может содержать чувствительные данные.

**Рекомендация:**

**Вариант 1: Исключить из репозитория (рекомендуется для production):**

Добавьте в `.gitignore`:

```
amplify/team-provider-info.json
```

**Вариант 2: Включить в репозиторий (для разработки):**

Не добавляйте `amplify/team-provider-info.json` в `.gitignore`, если:
- Проект только для разработки
- Нет чувствительных данных в файле
- Команда должна видеть конфигурацию окружений

**Примечание:** В данном проекте рекомендуется **исключить** `amplify/team-provider-info.json` из репозитория для безопасности.

#### Шаг 4: Проверка включения `amplify.yml`

**Почему:** Файл `amplify.yml` нужен для деплоя и должен быть в репозитории.

**Действие:**

Убедитесь, что `amplify.yml` **НЕ** находится в `.gitignore`.

**Проверка:**

```bash
git check-ignore amplify.yml
```

**Ожидаемый результат:**

Команда не должна выводить ничего (файл не игнорируется).

**Если файл игнорируется:**

Удалите строку с `amplify.yml` из `.gitignore`.

#### Шаг 5: Проверка включения структуры `amplify/backend/`

**Почему:** Структура `amplify/backend/` содержит конфигурацию backend ресурсов и должна быть в репозитории.

**Действие:**

Убедитесь, что папка `amplify/backend/` **НЕ** находится в `.gitignore`.

**Проверка:**

```bash
git check-ignore amplify/backend
```

**Ожидаемый результат:**

Команда не должна выводить ничего (папка не игнорируется).

#### Шаг 6: Финальная проверка `.gitignore`

**Почему:** Убедиться, что все правила настроены корректно.

**Действие:**

Проверьте содержимое `.gitignore`:

```bash
cat .gitignore
```

**Ожидаемый результат:**

Должны быть видны:
- ✅ `.amplify/` — исключено
- ✅ `amplify.yml` — НЕ исключено (если файл существует)
- ✅ `amplify/backend/` — НЕ исключено
- ⚠️ `amplify/team-provider-info.json` — исключено (рекомендуется)

**Пример финального `.gitignore`:**

```
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
.next/
out/

# Production
build/
dist/

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local

# Amplify
.amplify/
amplify/team-provider-info.json
```

### Критерии успешного выполнения

- ✅ `.amplify/` добавлен в `.gitignore`
- ✅ Важные файлы конфигурации не игнорируются
- ✅ `.gitignore` обновлен корректно

### Что дальше

После успешного выполнения переходите к **Task 02.09: Документирование конфигурации**.

---

## Task 02.09: Документирование конфигурации

### Цель задачи

Задокументировать все важные настройки Amplify проекта для будущей справки.

### Почему это важно

Документация помогает:
- Вспомнить настройки проекта в будущем
- Поделиться информацией с командой
- Быстро восстановить конфигурацию при необходимости

### Пошаговая инструкция

#### Шаг 1: Сбор информации о конфигурации

**Почему:** Нужно собрать всю важную информацию о настройках проекта.

**Действие:**

Выполните следующие команды и сохраните результаты:

1. **Регион AWS:**
   ```bash
   cat amplify/team-provider-info.json | grep -i region
   ```
   Или откройте файл и найдите `"Region"`.

2. **Имена окружений:**
   ```bash
   amplify env list
   ```

3. **Amplify App ID:**
   ```bash
   cat amplify/team-provider-info.json | grep -i AmplifyAppId
   ```
   Или откройте файл и найдите `"AmplifyAppId"`.

4. **Имя проекта:**
   ```bash
   cat amplify/backend/amplify-meta.json
   ```
   Или проверьте имя в `amplify/team-provider-info.json`.

#### Шаг 2: Создание документа с конфигурацией

**Почему:** Сохранить информацию в удобном формате.

**Действие:**

Создайте файл `docs/infrastructure/AMPLIFY_CONFIG.md` (или обновите существующий) и добавьте следующую информацию:

```markdown
# Конфигурация AWS Amplify - Sunday School App

## Основная информация

- **Имя проекта:** sun-sch
- **Amplify App ID:** d1234567890abc
- **Регион AWS:** us-east-1
- **Дата инициализации:** 23 декабря 2025

## Окружения (Environments)

### dev
- **Имя:** dev
- **CloudFormation Stack:** amplify-sun-sch-dev-12345
- **Deployment Bucket:** amplify-sun-sch-dev-12345-deployment
- **Назначение:** Разработка и тестирование

### prod
- **Имя:** prod
- **CloudFormation Stack:** amplify-sun-sch-prod-67890
- **Deployment Bucket:** amplify-sun-sch-prod-67890-deployment
- **Назначение:** Production окружение

## Структура проекта

```
amplify/
├── backend/
│   ├── amplify-meta.json
│   └── backend-config.json
├── .config/
└── team-provider-info.json

amplify.yml (опционально, для Hosting)
```

## Важные файлы

- `amplify/team-provider-info.json` — информация о окружениях и AWS ресурсах
- `amplify/backend/amplify-meta.json` — метаданные о backend ресурсах
- `amplify.yml` — конфигурация для Amplify Hosting

## Команды

- `amplify status` — проверить статус проекта
- `amplify env list` — список окружений
- `amplify env checkout <env>` — переключиться на окружение
- `amplify push` — деплой изменений в AWS
```

#### Шаг 3: Добавление заметок о важных настройках

**Почему:** Сохранить информацию о выбранных настройках и их причинах.

**Действие:**

Добавьте в документ раздел с заметками:

```markdown
## Заметки о настройках

### Выбор региона
- **Выбран:** us-east-1 (N. Virginia)
- **Причина:** Низкая стоимость, хорошая задержка для целевой аудитории

### Окружения
- **dev:** Используется для разработки и тестирования
- **prod:** Используется для production (будет настроено позже)

### AWS Profile
- **Используемый профиль:** default
- **Пользователь IAM:** amplify-dev
- **Права:** AdministratorAccess (для разработки)

### Next.js настройки
- **Source Directory:** . (корень проекта)
- **Distribution Directory:** .next
- **Build Command:** npm run build
- **Start Command:** npm run dev
```

#### Шаг 4: Сохранение документа

**Почему:** Сохранить информацию для будущего использования.

**Действие:**

Сохраните файл `docs/infrastructure/AMPLIFY_CONFIG.md` (или обновите существующий).

**Примечание:** Если файл уже существует, обновите его с новой информацией.

### Критерии успешного выполнения

- ✅ Конфигурация задокументирована
- ✅ Важные настройки записаны
- ✅ Документация доступна для команды

### Что дальше

После успешного выполнения переходите к **Task 02.10: Финальная проверка настройки**.

---

## Task 02.10: Финальная проверка настройки

### Цель задачи

Провести финальную проверку настройки Amplify проекта и убедиться, что все готово к добавлению backend ресурсов.

### Почему это важно

Финальная проверка гарантирует:
- Все команды работают корректно
- Нет ошибок в конфигурации
- Проект готов к следующей фазе (добавление backend ресурсов)

### Пошаговая инструкция

#### Шаг 1: Проверка статуса проекта

**Почему:** Убедиться, что проект инициализирован корректно.

**Действие:**

```bash
amplify status
```

**Ожидаемый результат:**

```
Current Environment: dev

| Category | Resource name | Operation | Provider plugin   |
| -------- | ------------- | --------- | ----------------- |
| No resources found |               |           |                   |
```

**Если есть ошибки:**

См. раздел [Устранение неполадок](#устранение-неполадок).

#### Шаг 2: Проверка переключения между окружениями

**Почему:** Убедиться, что можно переключаться между окружениями.

**Действие:**

1. **Переключиться на prod:**
   ```bash
   amplify env checkout prod
   ```

2. **Проверить статус:**
   ```bash
   amplify status
   ```

3. **Переключиться обратно на dev:**
   ```bash
   amplify env checkout dev
   ```

4. **Проверить статус:**
   ```bash
   amplify status
   ```

**Ожидаемый результат:**

- Переключение должно происходить без ошибок
- Статус должен показывать правильное окружение

#### Шаг 3: Проверка AWS credentials

**Почему:** Убедиться, что AWS credentials работают.

**Действие:**

```bash
aws sts get-caller-identity
```

**Ожидаемый результат:**

```json
{
    "UserId": "AIDAXXXXXXXXXXXXXXXXX",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/amplify-dev"
}
```

**Если есть ошибки:**

- Проверьте, что credentials настроены: `aws configure list`
- Проверьте, что Access Key ID и Secret Access Key правильные

#### Шаг 4: Проверка структуры проекта

**Почему:** Убедиться, что структура соответствует Gen 1.

**Действие:**

```bash
ls amplify
```

**Ожидаемый результат:**

Должны быть видны:
- `amplify/backend/`
- `amplify/.config/`
- `amplify/team-provider-info.json`

**Проверка отсутствия Gen 2 файлов:**

```bash
ls amplify/data 2>/dev/null || echo "Gen 2 файлы не найдены (это хорошо)"
```

**Ожидаемый результат:**

```
Gen 2 файлы не найдены (это хорошо)
```

#### Шаг 5: Проверка команды `amplify help`

**Почему:** Убедиться, что CLI работает корректно.

**Действие:**

```bash
amplify help
```

**Ожидаемый результат:**

Должен отобразиться список доступных команд без ошибок.

#### Шаг 6: Финальная проверка готовности

**Почему:** Убедиться, что проект готов к следующей фазе.

**Чеклист:**

- ✅ `amplify status` работает без ошибок
- ✅ Можно переключаться между окружениями
- ✅ AWS credentials работают
- ✅ Структура проекта соответствует Gen 1
- ✅ Все команды CLI работают корректно

### Критерии успешного выполнения

- ✅ Все команды Amplify работают корректно
- ✅ Нет ошибок при выполнении команд
- ✅ Проект готов к добавлению backend ресурсов

### Что дальше

После успешного выполнения Phase 02:
- ✅ Проект готов к Phase 03: Настройка базы данных
- ✅ Можно начинать добавлять backend ресурсы (Auth, API, Storage)

---

## Устранение неполадок

### Проблема 1: Ошибка "amplify: command not found"

**Причина:** AWS Amplify CLI не установлен или не в PATH.

**Решение:**

1. Проверьте установку:
   ```bash
   npm list -g @aws-amplify/cli
   ```

2. Если не установлен, установите:
   ```bash
   npm install -g @aws-amplify/cli
   ```

3. Перезапустите терминал.

### Проблема 2: Ошибка "Unable to locate credentials"

**Причина:** AWS credentials не настроены.

**Решение:**

1. Настройте credentials:
   ```bash
   aws configure
   ```

2. Проверьте подключение:
   ```bash
   aws sts get-caller-identity
   ```

### Проблема 3: Ошибка при `amplify init`

**Причина:** Проблемы с AWS credentials или правами доступа.

**Решение:**

1. Проверьте AWS credentials:
   ```bash
   aws sts get-caller-identity
   ```

2. Проверьте права IAM пользователя (должен быть `AdministratorAccess` или аналогичные права).

3. Попробуйте снова:
   ```bash
   amplify init
   ```

### Проблема 4: Ошибка "Environment already exists"

**Причина:** Окружение уже создано.

**Решение:**

1. Проверьте список окружений:
   ```bash
   amplify env list
   ```

2. Если окружение существует, используйте его:
   ```bash
   amplify env checkout <env-name>
   ```

### Проблема 5: Ошибка при переключении окружений

**Причина:** Проблемы с конфигурацией окружения.

**Решение:**

1. Проверьте файл `amplify/team-provider-info.json`:
   ```bash
   cat amplify/team-provider-info.json
   ```

2. Убедитесь, что окружение существует в файле.

3. Попробуйте переключиться снова:
   ```bash
   amplify env checkout <env-name>
   ```

### Проблема 6: Ошибка "Stack does not exist"

**Причина:** CloudFormation stack был удален в AWS Console.

**Решение:**

1. Проверьте в AWS Console → CloudFormation → Stacks.

2. Если stack не существует, переинициализируйте проект:
   ```bash
   amplify init
   ```

### Проблема 7: Ошибка при проверке структуры проекта

**Причина:** Файлы не созданы или удалены.

**Решение:**

1. Проверьте наличие папки `amplify/`:
   ```bash
   ls amplify
   ```

2. Если папки нет, переинициализируйте проект:
   ```bash
   amplify init
   ```

---

## Полезные ссылки

### Официальная документация

- **AWS Amplify Gen 1 Documentation:** https://docs.amplify.aws/gen1/
- **Amplify CLI Reference:** https://docs.amplify.aws/cli/
- **AWS AppSync Documentation:** https://docs.aws.amazon.com/appsync/
- **AWS Cognito Documentation:** https://docs.aws.amazon.com/cognito/

### Документация проекта

- **AWS_AMPLIFY.md:** `docs/infrastructure/AWS_AMPLIFY.md`
- **ARCHITECTURE.md:** `docs/architecture/ARCHITECTURE.md`
- **DEPLOYMENT_GUIDE.md:** `docs/deployment/DEPLOYMENT_GUIDE.md`

### Полезные команды

```bash
# Проверка версии CLI
amplify --version

# Список команд
amplify help

# Статус проекта
amplify status

# Список окружений
amplify env list

# Переключение окружения
amplify env checkout <env-name>

# Проверка AWS credentials
aws sts get-caller-identity

# Список AWS профилей
aws configure list-profiles
```

---

## Заключение

После успешного выполнения всех задач Phase 02:

✅ AWS Amplify Gen 1 проект инициализирован  
✅ Настроены окружения `dev` и `prod`  
✅ Готова структура для добавления backend ресурсов  
✅ Конфигурация задокументирована  

**Следующий шаг:** Phase 03 — Настройка базы данных (GraphQL schema, DynamoDB)

---

**Версия документа:** 1.0  
**Последнее обновление:** 23 декабря 2025  
**Автор:** AI Documentation Team

