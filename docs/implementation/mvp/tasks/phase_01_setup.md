# Phase 01: Настройка проекта и окружения

## Описание фазы
Инициализация Next.js 15.5.9 проекта, установка всех необходимых зависимостей, настройка TypeScript, ESLint и инструментов разработки.

## Зависимости
Нет (первая фаза)

## Оценка времени
2-3 часа

## Требования к AI Agent

> [!IMPORTANT]
> - AI Agent при создании программного кода должен использовать актуальную документацию для конкретной версии библиотеки или фреймворка через Context7
> - Для NextJS должна быть использована документация для версии 15.5.9
> - Перед созданием кода необходимо проверять какой функционал NextJS поддерживается AWS Amplify. Это высокоприоритетное требование.
> - Следовать принципам из `docs/guidelines/prompts/general_prompt_guidelines.md`

## Задачи

### Task 01.01: Инициализация Next.js проекта
- [ ] Создать новый Next.js 15.5.9 проект с App Router используя `npx create-next-app@15.5.9`
- [ ] Выбрать опции: TypeScript, ESLint, App Router, Tailwind CSS
- [ ] Проверить версию Next.js в `package.json` (должна быть 15.5.9)
- [ ] Проверить совместимость версии Next.js 15.5.9 с AWS Amplify Hosting через документацию AWS

**Документация:**
- [ARCHITECTURE.md](../../../architecture/ARCHITECTURE.md) - раздел 3.1
- [TECH_STACK.md](../../../tech_stack.md) - раздел Frontend
- Context7: Next.js 15.5.9 документация

**Критерии приемки:**
- Проект успешно создан и запускается (`npm run dev`)
- Версия Next.js в `package.json` соответствует 15.5.9
- Структура проекта содержит папку `app/` (App Router)
- TypeScript конфигурация присутствует

---

### Task 01.02: Настройка TypeScript
- [ ] Открыть `tsconfig.json` и проверить настройки
- [ ] Убедиться, что включен `strict: true`
- [ ] Настроить `paths` для алиасов (`@/*` -> `./src/*` или `./*`)
- [ ] Проверить, что `target` установлен в `ES2020` или выше
- [ ] Убедиться, что `module` установлен в `ESNext`

**Документация:**
- [TECH_STACK.md](../../../tech_stack.md) - раздел TypeScript
- Context7: TypeScript документация

**Критерии приемки:**
- TypeScript компилируется без ошибок (`npx tsc --noEmit`)
- Алиасы `@/*` работают корректно
- Строгая типизация включена

---

### Task 01.03: Установка основных зависимостей
- [ ] Установить React 19: `npm install react@^19.0.0 react-dom@^19.0.0`
- [ ] Установить Zustand: `npm install zustand@latest`
- [ ] Установить Framer Motion: `npm install framer-motion@latest`
- [ ] Установить BlockNote: `npm install @blocknote/core @blocknote/react`
- [ ] Установить lucide-react для иконок: `npm install lucide-react`
- [ ] Проверить совместимость всех зависимостей с Next.js 15.5.9

**Документация:**
- [TECH_STACK.md](../../../tech_stack.md) - раздел зависимостей
- [ARCHITECTURE.md](../../../architecture/ARCHITECTURE.md) - раздел 3.1
- Context7: React 19 документация

**Критерии приемки:**
- Все зависимости установлены без конфликтов
- Версии соответствуют указанным в `tech_stack.md`
- `package.json` содержит все необходимые зависимости

---

### Task 01.04: Установка зависимостей для валидации
- [ ] Установить Zod: `npm install zod`
- [ ] Установить React Hook Form: `npm install react-hook-form`
- [ ] Установить @hookform/resolvers для интеграции Zod с React Hook Form: `npm install @hookform/resolvers`
- [ ] Проверить совместимость версий

**Документация:**
- [VALIDATION.md](../../../api/VALIDATION.md)
- [SERVER_ACTIONS.md](../../../api/SERVER_ACTIONS.md) - раздел валидации
- Context7: Zod документация

**Критерии приемки:**
- Zod установлен и работает
- React Hook Form интегрирован с Zod
- Можно создать простую форму с валидацией

---

### Task 01.05: Настройка ESLint
- [ ] Проверить наличие `eslint.config.mjs` или `.eslintrc.json`
- [ ] Установить ESLint конфигурацию для Next.js: `npm install --save-dev eslint-config-next@15.5.9`
- [ ] Настроить правила ESLint согласно стандартам проекта
- [ ] Добавить правила для TypeScript
- [ ] Проверить работу ESLint: `npm run lint`

**Документация:**
- [TECH_STACK.md](../../../tech_stack.md) - раздел Development Tools
- Context7: ESLint документация

**Критерии приемки:**
- ESLint запускается без ошибок
- Конфигурация соответствует стандартам Next.js
- Правила для TypeScript работают

---

### Task 01.06: Настройка Prettier (опционально)
- [ ] Установить Prettier: `npm install --save-dev prettier`
- [ ] Создать `.prettierrc` с настройками форматирования
- [ ] Создать `.prettierignore` для исключения файлов
- [ ] Добавить скрипт в `package.json`: `"format": "prettier --write ."`
- [ ] Проверить работу Prettier

**Документация:**
- [TECH_STACK.md](../../../tech_stack.md) - раздел Development Tools

**Критерии приемки:**
- Prettier установлен и настроен
- Скрипт `npm run format` работает корректно
- Форматирование применяется к файлам проекта

---

### Task 01.07: Проверка совместимости с AWS Amplify
- [ ] Изучить документацию AWS Amplify Hosting для Next.js 15.5.9
- [ ] Проверить поддержку App Router в AWS Amplify
- [ ] Проверить поддержку Server Actions в AWS Amplify
- [ ] Проверить поддержку Server Components в AWS Amplify
- [ ] Задокументировать найденные ограничения (если есть)

**Документация:**
- [AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md)
- [DEPLOYMENT_GUIDE.md](../../../deployment/DEPLOYMENT_GUIDE.md)
- AWS Amplify официальная документация (через Context7)

**Критерии приемки:**
- Подтверждена совместимость Next.js 15.5.9 с AWS Amplify Hosting
- Выявлены и задокументированы все ограничения
- План работы учитывает совместимость

---

### Task 01.08: Создание базовой структуры каталогов
- [ ] Создать каталог `src/app/` (если используется структура с `src/`)
- [ ] Создать каталог `src/components/` для React компонентов
- [ ] Создать каталог `src/lib/` для утилит и библиотек
- [ ] Создать каталог `src/actions/` для Server Actions
- [ ] Создать каталог `src/types/` для TypeScript типов
- [ ] Создать каталог `src/hooks/` для React hooks (если необходимо)

**Документация:**
- [ARCHITECTURE.md](../../../architecture/ARCHITECTURE.md) - раздел структуры проекта
- [COMPONENT_LIBRARY.md](../../../components/COMPONENT_LIBRARY.md)

**Критерии приемки:**
- Все необходимые каталоги созданы
- Структура соответствует архитектуре проекта
- Алиасы `@/*` настроены для работы с новой структурой

---

### Task 01.09: Настройка Git репозитория
- [ ] Инициализировать Git репозиторий (если еще не инициализирован)
- [ ] Создать `.gitignore` с правилами для Next.js, Node.js, AWS Amplify
- [ ] Добавить правила для игнорирования `.next/`, `node_modules/`, `.amplify/`
- [ ] Создать начальный commit с базовой структурой проекта
- [ ] Настроить remote репозиторий (если необходимо)

**Документация:**
- [DEPLOYMENT_GUIDE.md](../../../deployment/DEPLOYMENT_GUIDE.md) - раздел Git

**Критерии приемки:**
- Git репозиторий инициализирован
- `.gitignore` содержит все необходимые правила
- Начальный commit создан

---

### Task 01.10: Проверка работоспособности проекта
- [ ] Запустить dev сервер: `npm run dev`
- [ ] Проверить, что приложение открывается в браузере
- [ ] Проверить отсутствие ошибок в консоли браузера
- [ ] Проверить отсутствие ошибок в терминале
- [ ] Убедиться, что TypeScript компилируется без ошибок
- [ ] Убедиться, что ESLint не выдает критических ошибок

**Документация:**
- [ARCHITECTURE.md](../../../architecture/ARCHITECTURE.md)

**Критерии приемки:**
- Приложение успешно запускается
- Нет критических ошибок в консоли
- TypeScript и ESLint работают корректно
- Базовая страница Next.js отображается

---

## Ссылки на документацию проекта

- [ARCHITECTURE.md](../../../architecture/ARCHITECTURE.md) - Общая архитектура проекта
- [TECH_STACK.md](../../../tech_stack.md) - Технологический стек
- [MVP_SCOPE.md](../../../MVP_SCOPE.md) - Область MVP
- [AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md) - Настройка AWS Amplify
- [DEPLOYMENT_GUIDE.md](../../../deployment/DEPLOYMENT_GUIDE.md) - Руководство по развертыванию

---

## Примечания

- Убедитесь, что используется именно Next.js 15.5.9, не более новая версия
- Проверка совместимости с AWS Amplify критически важна перед началом разработки
- Все зависимости должны быть совместимы с React 19 и Next.js 15.5.9

---

**Версия:** 1.0  
**Последнее обновление:** 23 декабря 2025

