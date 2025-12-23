# Phase 08: Создание системы аутентификации UI

## Описание фазы
Создание UI для аутентификации: страница входа, middleware для защиты маршрутов, обработка сессий, редиректы.

## Зависимости
Phase 05: Настройка аутентификации (Cognito), Phase 07: Создание базовых layout компонентов

## Оценка времени
4-5 часов

## Требования к AI Agent

> [!IMPORTANT]
> - AI Agent при создании программного кода должен использовать актуальную документацию для конкретной версии библиотеки или фреймворка через Context7
> - Для Next.js 15.5.9 должна быть использована документация версии 15.5.9
> - Для AWS Amplify Auth должна быть использована официальная документация AWS Amplify Gen 1
> - Перед созданием кода необходимо проверять какой функционал NextJS поддерживается AWS Amplify. Это высокоприоритетное требование.
> - Следовать принципам из `docs/guidelines/prompts/general_prompt_guidelines.md`

## Задачи

### Task 08.01: Установка AWS Amplify библиотек
- [ ] Установить aws-amplify: `npm install aws-amplify`
- [ ] Проверить совместимость версии с Next.js 15.5.9
- [ ] Проверить совместимость с AWS Amplify Gen 1 (не Gen 2!)

**Документация:**
- [AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md) - раздел Frontend Integration
- [ARCHITECTURE.md](../../../architecture/ARCHITECTURE.md) - раздел Authentication
- AWS Amplify Auth документация (через Context7)

**Критерии приемки:**
- aws-amplify установлен
- Версия совместима с Next.js 15.5.9
- Версия совместима с Amplify Gen 1

---

### Task 08.02: Настройка Amplify конфигурации
- [ ] Создать файл `lib/amplify/config.ts`
- [ ] Импортировать конфигурацию из `amplifyconfiguration.json`
- [ ] Настроить Amplify.configure() с конфигурацией
- [ ] Создать утилиту для получения конфигурации
- [ ] Убедиться, что конфигурация загружается корректно

**Документация:**
- [AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md) - раздел Configuration Files
- [ARCHITECTURE.md](../../../architecture/ARCHITECTURE.md) - раздел Configuration
- AWS Amplify Configuration документация (через Context7)

**Критерии приемки:**
- Конфигурация Amplify настроена
- Конфигурация загружается из amplifyconfiguration.json
- Amplify.configure() вызывается при инициализации

---

### Task 08.03: Создание страницы входа
- [ ] Изучить wireframe страницы входа из [WIREFRAMES.md](../../../ui_ux/WIREFRAMES.md)
- [ ] Создать `app/(auth)/auth/page.tsx`
- [ ] Создать Client Component формы входа с:
  - Полями Email и Password
  - Валидацией через Zod
  - Обработкой ошибок
  - Кнопкой входа
  - Loading state
- [ ] Использовать компоненты Shadcn UI (Form, Input, Button)
- [ ] Интегрировать с AWS Amplify Auth (signIn)

**Документация:**
- [WIREFRAMES.md](../../../ui_ux/WIREFRAMES.md) - раздел Auth Page
- [USER_FLOW.md](../../../user_flows/USER_FLOW.md) - раздел Authentication Flow
- [VALIDATION.md](../../../api/VALIDATION.md) - раздел Auth Schemas
- AWS Amplify Auth signIn документация (через Context7)

**Критерии приемки:**
- Страница входа создана
- Форма работает корректно
- Валидация работает
- Вход через Cognito функционирует

---

### Task 08.04: Создание Server Actions для аутентификации
- [ ] Создать `app/actions/auth.ts`
- [ ] Реализовать Server Action `signIn`:
  - Принимает email и password
  - Валидирует через Zod
  - Вызывает Amplify Auth signIn
  - Возвращает результат или ошибку
- [ ] Реализовать Server Action `signOut`:
  - Вызывает Amplify Auth signOut
  - Очищает сессию
- [ ] Реализовать Server Action `getCurrentUser`:
  - Получает текущего пользователя из Cognito
  - Возвращает информацию о пользователе и роли

**Документация:**
- [SERVER_ACTIONS.md](../../../api/SERVER_ACTIONS.md) - раздел Auth Actions
- [VALIDATION.md](../../../api/VALIDATION.md) - раздел Auth Schemas
- AWS Amplify Auth Server Actions документация (через Context7)

**Критерии приемки:**
- Server Actions созданы
- signIn работает корректно
- signOut работает корректно
- getCurrentUser возвращает правильную информацию

---

### Task 08.05: Создание middleware для защиты маршрутов
- [ ] Создать `middleware.ts` в корне проекта
- [ ] Реализовать проверку JWT токена из cookies
- [ ] Реализовать редирект неавторизованных пользователей на `/auth`
- [ ] Реализовать проверку роли для админских страниц
- [ ] Реализовать редирект Teacher с админских страниц на `/grades/my`
- [ ] Использовать Next.js middleware API

**Документация:**
- [ARCHITECTURE.md](../../../architecture/ARCHITECTURE.md) - раздел 3.3 Middleware
- [SECURITY.md](../../../infrastructure/SECURITY.md) - раздел Route Protection
- [USER_FLOW.md](../../../user_flows/USER_FLOW.md) - раздел Authentication Flow
- Next.js Middleware документация (через Context7)

**Критерии приемки:**
- Middleware создан
- Защита маршрутов работает
- Редиректы работают корректно
- Проверка ролей функционирует

---

### Task 08.06: Создание утилит для работы с сессией
- [ ] Создать `lib/utils/auth.ts`
- [ ] Реализовать функцию `getSession()`:
  - Получает текущую сессию из Cognito
  - Возвращает информацию о пользователе
- [ ] Реализовать функцию `getUserRole()`:
  - Получает роль пользователя из Cognito групп
  - Возвращает роль (TEACHER, ADMIN, SUPERADMIN)
- [ ] Реализовать функцию `isAuthenticated()`:
  - Проверяет, авторизован ли пользователь
  - Возвращает boolean

**Документация:**
- [SECURITY.md](../../../infrastructure/SECURITY.md) - раздел Authentication
- [ARCHITECTURE.md](../../../architecture/ARCHITECTURE.md) - раздел Auth Utilities
- AWS Amplify Auth Session документация (через Context7)

**Критерии приемки:**
- Утилиты созданы
- getSession работает корректно
- getUserRole возвращает правильную роль
- isAuthenticated работает

---

### Task 08.07: Интеграция аутентификации с layout
- [ ] Обновить Header компонент для отображения информации о пользователе
- [ ] Добавить кнопку выхода в Header
- [ ] Реализовать обработку выхода
- [ ] Обновить Sidebar для скрытия пунктов меню для неавторизованных пользователей
- [ ] Убедиться, что layout работает с аутентификацией

**Документация:**
- [COMPONENT_LIBRARY.md](../../../components/COMPONENT_LIBRARY.md) - раздел Navigation
- [WIREFRAMES.md](../../../ui_ux/WIREFRAMES.md) - раздел Header

**Критерии приемки:**
- Header отображает информацию о пользователе
- Кнопка выхода работает
- Sidebar скрывает пункты для неавторизованных
- Layout интегрирован с аутентификацией

---

### Task 08.08: Обработка ошибок аутентификации
- [ ] Реализовать обработку ошибок входа:
  - Неверный email/password
  - Пользователь не подтвержден
  - Пользователь заблокирован
  - Другие ошибки Cognito
- [ ] Отображать понятные сообщения об ошибках пользователю
- [ ] Использовать Toast уведомления для ошибок
- [ ] Логировать ошибки для отладки

**Документация:**
- [USER_FLOW.md](../../../user_flows/USER_FLOW.md) - раздел Error Handling
- [DESIGN_SYSTEM.md](../../../ui_ux/DESIGN_SYSTEM.md) - раздел Error States
- AWS Cognito Error Codes документация (через Context7)

**Критерии приемки:**
- Ошибки обрабатываются корректно
- Сообщения понятны пользователю
- Toast уведомления работают
- Ошибки логируются

---

### Task 08.09: Тестирование аутентификации
- [ ] Протестировать вход с правильными учетными данными
- [ ] Протестировать вход с неверными учетными данными
- [ ] Протестировать защиту маршрутов (попытка доступа без авторизации)
- [ ] Протестировать проверку ролей (Teacher пытается зайти на админскую страницу)
- [ ] Протестировать выход
- [ ] Протестировать сохранение сессии (refresh страницы)

**Документация:**
- [USER_FLOW.md](../../../user_flows/USER_FLOW.md) - раздел Authentication Flow
- [SECURITY.md](../../../infrastructure/SECURITY.md) - раздел Testing

**Критерии приемки:**
- Все тесты пройдены успешно
- Аутентификация работает корректно
- Защита маршрутов работает
- Проверка ролей функционирует

---

### Task 08.10: Оптимизация производительности
- [ ] Убедиться, что проверка сессии не блокирует рендеринг
- [ ] Оптимизировать загрузку конфигурации Amplify
- [ ] Проверить, что нет ненужных запросов к Cognito
- [ ] Оптимизировать размер bundle для auth компонентов

**Документация:**
- [ARCHITECTURE.md](../../../architecture/ARCHITECTURE.md) - раздел Performance
- Next.js Performance документация (через Context7)

**Критерии приемки:**
- Производительность оптимизирована
- Нет блокирующих операций
- Bundle size приемлемый

---

## Ссылки на документацию проекта

- [SECURITY.md](../../../infrastructure/SECURITY.md) - Безопасность и аутентификация
- [AWS_AMPLIFY.md](../../../infrastructure/AWS_AMPLIFY.md) - Настройка AWS Amplify
- [USER_FLOW.md](../../../user_flows/USER_FLOW.md) - Пользовательские сценарии
- [WIREFRAMES.md](../../../ui_ux/WIREFRAMES.md) - Wireframes страниц

---

## Примечания

- ⚠️ **КРИТИЧНО:** Использовать AWS Amplify Gen 1, НЕ Gen 2!
- Middleware должен работать быстро и не блокировать рендеринг
- Ошибки аутентификации должны быть понятны пользователю
- Сессия должна сохраняться между перезагрузками страницы
- Проверка совместимости Next.js с AWS Amplify критически важна

---

**Версия:** 1.0  
**Последнее обновление:** 23 декабря 2025

