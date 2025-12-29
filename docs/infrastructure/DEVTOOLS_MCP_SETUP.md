# Настройка DevTools MCP Server для тестирования через Chrome DevTools

**Версия:** 1.0  
**Дата создания:** 30 декабря 2025  
**Проект:** Sunday School App (MVP)  
**Окружение:** Windows 11

---

## Описание

DevTools MCP Server — это официальный MCP сервер от команды Chrome DevTools, который позволяет AI-ассистентам (таким как Cursor AI) взаимодействовать с браузером Chrome через протокол удаленной отладки (Chrome DevTools Protocol).

### Возможности

- Навигация по URL (`browser_navigate`)
- Получение снимков доступности страницы (`browser_snapshot`)
- Получение сообщений консоли и проблем (`browser_console_messages`)
- Проверка сетевых запросов (`browser_network_requests`)
- Создание скриншотов (`browser_take_screenshot`)
- Нажатие клавиш для тестирования интерактивных элементов (`press_key`)
- Перезагрузка страниц с игнорированием кэша
- Сохранение снимков дерева доступности

---

## Требования

- **Node.js** 18.0.0 или выше
- **Google Chrome** (последняя стабильная версия)
- **Cursor IDE** с поддержкой MCP
- **Windows 11** (для инструкций в этом документе)

---

## Установка и настройка

### Шаг 1: Проверка пакета

Пакет `chrome-devtools-mcp` доступен в npm registry. Версия 0.12.1+ поддерживает все необходимые функции.

### Шаг 2: Создание глобальной конфигурации MCP

**Файл:** `C:\Users\<ваше-имя-пользователя>\.cursor\mcp.json`

**В Windows 11:**
- Путь: `$env:USERPROFILE\.cursor\mcp.json`
- Или полный путь: `C:\Users\<username>\.cursor\mcp.json`

**Создание директории (если не существует):**
```powershell
$cursorDir = "$env:USERPROFILE\.cursor"
if (-not (Test-Path $cursorDir)) {
    New-Item -ItemType Directory -Path $cursorDir -Force
}
```

**Конфигурация `mcp.json`:**
```json
{
  "mcpServers": {
    "devtools": {
      "command": "npx",
      "args": [
        "-y",
        "chrome-devtools-mcp"
      ],
      "env": {
        "CHROME_REMOTE_DEBUGGING_PORT": "9222"
      }
    }
  }
}
```

**Если уже есть другие MCP серверы**, добавьте `devtools` в существующий объект `mcpServers`:

```json
{
  "mcpServers": {
    "console-ninja": {
      "command": "node",
      "args": ["~/.console-ninja/mcp/"]
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    },
    "devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp"],
      "env": {
        "CHROME_REMOTE_DEBUGGING_PORT": "9222"
      }
    }
  }
}
```

**Важно для Windows 11:**
- После создания/изменения файла необходимо **полностью перезапустить Cursor**
- Используйте двойные обратные слеши `\\` или одинарные прямые `/` в путях в JSON

### Шаг 3: Настройка Chrome для удаленной отладки

#### Вариант 1: Использование скрипта (рекомендуется)

Используйте готовый скрипт `scripts/start-chrome-debug.ps1`:

```powershell
.\scripts\start-chrome-debug.ps1
```

Скрипт автоматически:
- Находит Chrome в стандартных расположениях
- Создает временный профиль пользователя
- Запускает Chrome с правильными флагами для удаленной отладки

#### Вариант 2: Ручной запуск Chrome

Запустите Chrome с параметрами удаленной отладки:

```powershell
$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$userDataDir = "$env:TEMP\chrome-debug-mcp"

& $chromePath `
  --remote-debugging-port=9222 `
  --remote-debugging-address=127.0.0.1 `
  --user-data-dir=$userDataDir `
  --no-first-run `
  --disable-default-apps `
  --disable-extensions
```

#### Проверка доступности порта

Используйте скрипт для проверки:

```powershell
.\scripts\check-chrome-debug-port.ps1
```

Или вручную:

```powershell
Test-NetConnection -ComputerName localhost -Port 9222 -InformationLevel Quiet
```

Если порт занят, откройте в браузере: `http://localhost:9222/json`

---

## Использование

### Проверка подключения

1. **Перезапустите Cursor полностью** после настройки конфигурации
2. Откройте Output панель в Cursor
3. Выберите фильтр `MCP: user-devtools`
4. Убедитесь, что нет ошибок подключения

### Базовые инструменты

После успешного подключения доступны следующие инструменты:

- **`browser_navigate`** - навигация по URL
  ```typescript
  // Пример использования через Cursor AI
  // AI автоматически использует этот инструмент при проверке страниц
  ```

- **`browser_snapshot`** - получение снимка доступности страницы
  ```typescript
  // Используется для проверки структуры страницы и доступности
  ```

- **`browser_console_messages`** - получение сообщений консоли
  ```typescript
  // Альтернатива Console Ninja для получения логов и ошибок
  ```

- **`browser_network_requests`** - проверка сетевых запросов
  ```typescript
  // Проверка успешности API запросов, GraphQL запросов к AppSync
  ```

- **`browser_take_screenshot`** - создание скриншотов
  ```typescript
  // Визуальная проверка состояния страницы
  ```

- **`press_key`** - нажатие клавиш
  ```typescript
  // Тестирование интерактивных элементов через клавиатуру
  ```

### Интеграция в workflow разработки

DevTools MCP server автоматически используется CursorAI агентом при проверке UI компонентов согласно правилам в `.cursor/rules/aiagentworkflow.mdc`.

**Приоритет использования:**
- **Console Ninja MCP** - для runtime ошибок и логов (если доступен)
- **DevTools MCP** - для навигации, снимков доступности, сетевых запросов, скриншотов
- Оба инструмента могут использоваться совместно для комплексной проверки

---

## Troubleshooting

### Проблема 1: Пакет не найден

**Симптомы:** Ошибка при подключении MCP server, сообщение о том, что пакет не найден.

**Решения:**
- Проверьте доступность npm: `npm --version`
- Попробуйте установить пакет глобально: `npm install -g chrome-devtools-mcp`
- Проверьте интернет-соединение

### Проблема 2: Chrome не запускается с удаленной отладкой

**Симптомы:** Chrome не запускается или запускается без удаленной отладки.

**Решения:**
- Проверьте, что порт 9222 не занят другим процессом:
  ```powershell
  .\scripts\check-chrome-debug-port.ps1
  ```
- Используйте другой порт и обновьте конфигурацию:
  ```json
  "env": {
    "CHROME_REMOTE_DEBUGGING_PORT": "9223"
  }
  ```
- Проверьте права доступа к папке профиля
- Убедитесь, что Chrome установлен в стандартном расположении

### Проблема 3: MCP server не подключается

**Симптомы:** В Output панели Cursor нет логов от `MCP: user-devtools` или есть ошибки подключения.

**Решения:**
1. Проверьте логи в Output панели Cursor (MCP: user-devtools)
2. Убедитесь, что Chrome запущен с правильными флагами:
   ```powershell
   .\scripts\start-chrome-debug.ps1
   ```
3. Проверьте конфигурацию в `C:\Users\<username>\.cursor\mcp.json`
4. Проверьте доступность порта:
   ```powershell
   .\scripts\check-chrome-debug-port.ps1
   ```
5. **Полностью перезапустите Cursor** после изменения конфигурации

### Проблема 4: Проблемы с путями в Windows 11

**Симптомы:** Ошибки при чтении конфигурации или запуске скриптов.

**Решения:**
- Используйте двойные обратные слеши `\\` или одинарные прямые `/` в JSON путях
- Проверьте, что переменные окружения правильно экранированы в JSON
- Убедитесь, что директория `.cursor` существует:
  ```powershell
  Test-Path "$env:USERPROFILE\.cursor"
  ```

### Проблема 5: Инструменты не работают

**Симптомы:** Инструменты DevTools MCP server не выполняются или возвращают ошибки.

**Решения:**
- Убедитесь, что Chrome запущен с удаленной отладкой
- Проверьте, что порт 9222 доступен
- Убедитесь, что страница открыта в Chrome (для некоторых инструментов требуется открытая страница)
- Проверьте версию пакета: `npm view chrome-devtools-mcp version`

---

## Ссылки на ресурсы

- [Статья Chrome DevTools о MCP server](https://developer.chrome.com/blog/new-in-devtools-143?utm_source=devtools&utm_campaign=stable&hl=ru#mcp-server)
- [Официальный репозиторий Chrome DevTools](https://github.com/ChromeDevTools)
- [Документация MCP Protocol](https://modelcontextprotocol.io/)
- [npm пакет chrome-devtools-mcp](https://www.npmjs.com/package/chrome-devtools-mcp)
- [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/)

---

## Версия документа

**Версия:** 1.0  
**Последнее обновление:** 30 декабря 2025  
**Автор:** Cursor AI Agent

