# Phase 07: Создание базовых layout компонентов

## Описание фазы
Создание базовых layout компонентов: Header, Sidebar, Footer, Navigation, адаптивная навигация для мобильных устройств.

## Зависимости
Phase 06: Настройка UI библиотеки (Shadcn UI)

## Оценка времени
4-5 часов

## Требования к AI Agent

<requirements>
<role>
Ты — Senior Next.js Developer с 5+ летним опытом разработки layout компонентов, специализирующийся на:
- Next.js 15.5.9 App Router и Layouts
- React 19 Server Components и Client Components
- Адаптивный дизайн и мобильная навигация
- Accessibility (WCAG 2.1 AA)
- Atomic Design принципы
</role>

<context>
Проект: Sunday School Management System (MVP)
Технологии: Next.js 15.5.9, React 19, Shadcn UI, Tailwind CSS 4
Ограничения: MVP подход, Server Components по умолчанию, доступность критически важна
Документация: WIREFRAMES.md и USER_FLOW.md должны быть изучены перед началом работы
</context>

<critical_instructions>
Вдохни глубоко, расправь плечи и приступай к решению задачи шаг за шагом. Это критически важная фаза для создания layout компонентов. Правильная настройка layout определит структуру и навигацию всего приложения.

<CRITICAL>Перед началом работы:</CRITICAL>
1. Изучи WIREFRAMES.md - все wireframes layout компонентов
2. Изучи USER_FLOW.md - пользовательские сценарии навигации
3. Используй Context7 для получения актуальной документации Next.js 15.5.9
4. Используй Context7 для получения актуальной документации React 19
5. Следуй принципам из `docs/guidelines/prompts/general_prompt_guidelines.md`

<CONSTRAINT>Layout компоненты должны быть Server Components по умолчанию. MobileNav должен быть Client Component из-за интерактивности. Навигация должна адаптироваться к роли пользователя!</CONSTRAINT>
</critical_instructions>
</requirements>

## Задачи

### Task 07.01: Создание структуры layout компонентов

<context>
<CRITICAL>Это первая и критически важная задача фазы!</CRITICAL> Создание структуры layout компонентов определяет организацию всех layout компонентов проекта. Правильная структура обеспечит консистентность и поддерживаемость кода.
</context>

<task>
Создай структуру каталогов и файлов для layout компонентов согласно Atomic Design принципам. Создай каталоги для navigation и layout компонентов, а также базовые файлы компонентов.
</task>

<constraints>
- Структура должна соответствовать Atomic Design принципам
- Компоненты должны быть в правильных каталогах (organisms/navigation, organisms/layout)
- Файлы должны быть созданы с правильными именами
- Структура должна соответствовать COMPONENT_LIBRARY.md
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Изучи COMPONENT_LIBRARY.md раздел 2 Directory Structure для понимания структуры
2. Изучи WIREFRAMES.md раздел Layout для понимания требований
3. Определи структуру каталогов согласно Atomic Design
4. Только после этого создавай структуру
</thinking>

**Действия:**
- [x] Создать каталог `components/organisms/navigation/`
- [x] Создать каталог `components/organisms/layout/`
- [x] Создать базовую структуру файлов:
  - `components/organisms/navigation/header.tsx`
  - `components/organisms/navigation/sidebar.tsx`
  - `components/organisms/navigation/mobile-nav.tsx`
  - `components/organisms/layout/footer.tsx`
  - `components/organisms/layout/main-layout.tsx`

**Документация:**
- <CRITICAL>[COMPONENT_LIBRARY.md](../../../components/COMPONENT_LIBRARY.md) - раздел 2 Directory Structure</CRITICAL>
- [WIREFRAMES.md](../../../ui_ux/WIREFRAMES.md) - раздел Layout

**Критерии приемки:**
- Структура каталогов создана
- Файлы компонентов созданы
- Структура соответствует Atomic Design

<output_format>
После выполнения задачи структура каталогов должна быть создана, файлы компонентов должны быть созданы, и структура должна соответствовать Atomic Design.
</output_format>

---

### Task 07.02: Создание Header компонента

<context>
Создание Header компонента критически важно для навигации и пользовательского опыта. Header должен быть адаптивным и отображать информацию о пользователе.
</context>

<task>
Создай Server Component `Header` согласно wireframe из WIREFRAMES.md. Компонент должен включать логотип, навигационное меню, информацию о пользователе и кнопку выхода. Используй компоненты Shadcn UI и добавь адаптивность.
</task>

<constraints>
- Header должен быть Server Component
- Компонент должен соответствовать wireframe
- Должна быть адаптивность для мобильных устройств
- Навигация должна функционировать
- Используй компоненты Shadcn UI (Button, Avatar, Dropdown Menu)
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Изучи WIREFRAMES.md раздел Header детально
2. Изучи DESIGN_SYSTEM.md раздел 3 Component Library для понимания требований
3. Изучи USER_FLOW.md раздел Navigation для понимания навигации
4. Используй Context7 для получения актуальной документации Next.js 15.5.9 и React 19
5. Только после этого создавай компонент
</thinking>

**Действия:**
- [x] Изучить wireframe Header из [WIREFRAMES.md](../../../ui_ux/WIREFRAMES.md)
- [x] Создать Server Component `Header` с:
  - Логотипом приложения
  - Навигационным меню (для Desktop)
  - Кнопкой меню для мобильных (hamburger)
  - Информацией о текущем пользователе
  - Кнопкой выхода
- [x] Использовать компоненты Shadcn UI (Button, Avatar, Dropdown Menu)
- [x] Добавить адаптивность для мобильных устройств

**Документация:**
- <CRITICAL>[WIREFRAMES.md](../../../ui_ux/WIREFRAMES.md) - раздел Header</CRITICAL>
- [DESIGN_SYSTEM.md](../../../ui_ux/DESIGN_SYSTEM.md) - раздел 3 Component Library
- [USER_FLOW.md](../../../user_flows/USER_FLOW.md) - раздел Navigation

**Критерии приемки:**
- Header компонент создан
- Компонент соответствует wireframe
- Адаптивность работает корректно
- Навигация функционирует

<output_format>
После выполнения задачи Header компонент должен быть создан, компонент должен соответствовать wireframe, адаптивность должна работать корректно, и навигация должна функционировать.
</output_format>

---

### Task 07.03: Создание Sidebar компонента

<context>
Создание Sidebar компонента критически важно для навигации в зависимости от роли пользователя. Sidebar должен адаптироваться к роли (Teacher/Admin) и отображать соответствующие пункты меню.
</context>

<task>
Создай Server Component `Sidebar` согласно wireframe из WIREFRAMES.md. Компонент должен отображать навигационные ссылки согласно роли пользователя, активное состояние текущей страницы и иконки для каждого пункта меню. Реализуй логику отображения меню в зависимости от роли.
</task>

<constraints>
- Sidebar должен быть Server Component
- Меню должно отображаться согласно роли пользователя (Teacher/Admin)
- Активное состояние должно работать
- Навигация должна функционировать
- Используй компоненты Shadcn UI (Navigation Menu)
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Изучи WIREFRAMES.md раздел Sidebar детально
2. Изучи USER_FLOW.md раздел Navigation для понимания навигации
3. Изучи MVP_SCOPE.md раздел 2.1.2 Роли пользователей для понимания ролей
4. Определи логику отображения меню для каждой роли
5. Только после этого создавай компонент
</thinking>

**Действия:**
- [x] Изучить wireframe Sidebar из [WIREFRAMES.md](../../../ui_ux/WIREFRAMES.md)
- [x] Создать Server Component `Sidebar` с:
  - Навигационными ссылками согласно роли пользователя
  - Активным состоянием текущей страницы
  - Иконками для каждого пункта меню
  - Группировкой пунктов меню (если необходимо)
- [x] Реализовать логику отображения меню в зависимости от роли (Teacher/Admin)
- [x] Использовать компоненты Shadcn UI (Navigation Menu)

**Документация:**
- <CRITICAL>[WIREFRAMES.md](../../../ui_ux/WIREFRAMES.md) - раздел Sidebar</CRITICAL>
- [USER_FLOW.md](../../../user_flows/USER_FLOW.md) - раздел Navigation
- <CRITICAL>[MVP_SCOPE.md](../../../MVP_SCOPE.md) - раздел 2.1.2 Роли пользователей</CRITICAL>

**Критерии приемки:**
- Sidebar компонент создан
- Меню отображается согласно роли пользователя
- Активное состояние работает
- Навигация функционирует

<output_format>
После выполнения задачи Sidebar компонент должен быть создан, меню должно отображаться согласно роли пользователя, активное состояние должно работать, и навигация должна функционировать.
</output_format>

---

### Task 07.04: Создание Mobile Navigation компонента

<context>
<CRITICAL>MobileNav должен быть Client Component!</CRITICAL> Создание Mobile Navigation компонента критически важно для мобильной навигации. Компонент должен быть Client Component из-за интерактивности (открытие/закрытие drawer).
</context>

<task>
Создай Client Component `MobileNav` с Drawer/Sheet компонентом для мобильного меню. Компонент должен включать список навигационных ссылок, кнопку закрытия и анимацию открытия/закрытия. Интегрируй с Header (кнопка hamburger открывает MobileNav).
</task>

<constraints>
- MobileNav должен быть Client Component (из-за интерактивности)
- Drawer должен открываться/закрываться корректно
- Навигация должна работать на мобильных устройствах
- Анимация должна быть плавной
- Используй Shadcn UI Sheet компонент
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Изучи WIREFRAMES.md раздел Mobile Navigation детально
2. Изучи DESIGN_SYSTEM.md раздел Responsive Design для понимания требований
3. Используй Context7 для получения актуальной документации Shadcn UI Sheet
4. Определи логику открытия/закрытия drawer
5. Только после этого создавай компонент
</thinking>

**Действия:**
- [x] Создать Client Component `MobileNav` с:
  - Drawer/Sheet компонентом для мобильного меню
  - Списком навигационных ссылок
  - Кнопкой закрытия
  - Анимацией открытия/закрытия
- [x] Использовать Shadcn UI Sheet компонент
- [x] Интегрировать с Header (кнопка hamburger открывает MobileNav)

**Документация:**
- <CRITICAL>[WIREFRAMES.md](../../../ui_ux/WIREFRAMES.md) - раздел Mobile Navigation</CRITICAL>
- [DESIGN_SYSTEM.md](../../../ui_ux/DESIGN_SYSTEM.md) - раздел Responsive Design
- Shadcn UI Sheet документация (через Context7)

**Критерии приемки:**
- MobileNav компонент создан
- Drawer открывается/закрывается корректно
- Навигация работает на мобильных устройствах
- Анимация плавная

<output_format>
После выполнения задачи MobileNav компонент должен быть создан, drawer должен открываться/закрываться корректно, навигация должна работать на мобильных устройствах, и анимация должна быть плавной.
</output_format>

---

### Task 07.05: Создание Footer компонента

<context>
Создание Footer компонента важно для завершения layout структуры. Footer должен отображаться на всех страницах и содержать информацию о приложении.
</context>

<task>
Создай Server Component `Footer` согласно wireframe из WIREFRAMES.md. Компонент должен включать информацию о приложении, ссылки (если необходимы), копирайт и версию приложения (опционально). Используй компоненты Shadcn UI для стилизации.
</task>

<constraints>
- Footer должен быть Server Component
- Компонент должен соответствовать wireframe
- Footer должен отображаться на всех страницах
- Используй компоненты Shadcn UI для стилизации
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Изучи WIREFRAMES.md раздел Footer детально
2. Изучи DESIGN_SYSTEM.md для понимания требований к стилизации
3. Определи содержимое Footer согласно требованиям
4. Только после этого создавай компонент
</thinking>

**Действия:**
- [x] Изучить wireframe Footer из [WIREFRAMES.md](../../../ui_ux/WIREFRAMES.md)
- [x] Создать Server Component `Footer` с:
  - Информацией о приложении
  - Ссылками (если необходимы)
  - Копирайтом
  - Версией приложения (опционально)
- [x] Использовать компоненты Shadcn UI для стилизации

**Документация:**
- [WIREFRAMES.md](../../../ui_ux/WIREFRAMES.md) - раздел Footer
- [DESIGN_SYSTEM.md](../../../ui_ux/DESIGN_SYSTEM.md)

**Критерии приемки:**
- Footer компонент создан
- Компонент соответствует wireframe
- Footer отображается на всех страницах

<output_format>
После выполнения задачи Footer компонент должен быть создан, компонент должен соответствовать wireframe, и Footer должен отображаться на всех страницах.
</output_format>

---

### Task 07.06: Создание MainLayout компонента

<context>
<CRITICAL>Это критически важная задача!</CRITICAL> Создание MainLayout компонента объединяет все layout компоненты в единую структуру. Правильная настройка MainLayout определит структуру всех страниц приложения.
</context>

<task>
Создай Server Component `MainLayout` который объединяет Header, Sidebar (для Desktop), Main content area и Footer. Реализуй адаптивный layout для Desktop и Mobile устройств. Используй CSS Grid или Flexbox для layout.
</task>

<constraints>
- MainLayout должен быть Server Component
- Layout должен быть адаптивен для всех размеров экрана
- Desktop: Header + Sidebar + Content + Footer
- Mobile: Header + Content + Footer (Sidebar скрыт, открывается через MobileNav)
- Все компоненты должны быть интегрированы корректно
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Изучи WIREFRAMES.md раздел Layout Structure детально
2. Изучи ARCHITECTURE.md раздел Frontend Architecture для понимания требований
3. Используй Context7 для получения актуальной документации Next.js Layout
4. Определи структуру адаптивного layout
5. Только после этого создавай компонент
</thinking>

**Действия:**
- [x] Создать Server Component `MainLayout` который объединяет:
  - Header
  - Sidebar (для Desktop)
  - Main content area
  - Footer
- [x] Реализовать адаптивный layout:
  - Desktop: Header + Sidebar + Content + Footer
  - Mobile: Header + Content + Footer (Sidebar скрыт, открывается через MobileNav)
- [x] Использовать CSS Grid или Flexbox для layout

**Документация:**
- <CRITICAL>[WIREFRAMES.md](../../../ui_ux/WIREFRAMES.md) - раздел Layout Structure</CRITICAL>
- [ARCHITECTURE.md](../../../architecture/ARCHITECTURE.md) - раздел Frontend Architecture
- Next.js Layout документация (через Context7)

**Критерии приемки:**
- MainLayout компонент создан
- Layout адаптивен для всех размеров экрана
- Все компоненты интегрированы корректно

<output_format>
После выполнения задачи MainLayout компонент должен быть создан, layout должен быть адаптивен для всех размеров экрана, и все компоненты должны быть интегрированы корректно.
</output_format>

---

### Task 07.07: Интеграция layout с Next.js App Router

<context>
Интеграция layout с Next.js App Router критически важна для применения layout ко всем страницам приложения. Правильная интеграция обеспечит консистентность структуры всех страниц.
</context>

<task>
Интегрируй MainLayout с Next.js App Router. Создай `app/(private)/layout.tsx` для защищенных маршрутов, используй MainLayout в layout.tsx, настрой метаданные страниц и убедись, что layout применяется ко всем страницам.
</task>

<constraints>
- Layout должен быть интегрирован с App Router
- Layout должен применяться ко всем страницам
- Метаданные должны быть настроены
- Используй route groups для организации маршрутов
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Изучи ARCHITECTURE.md раздел 3.1 Next.js App Router для понимания структуры
2. Изучи USER_FLOW.md раздел Navigation для понимания маршрутов
3. Используй Context7 для получения актуальной документации Next.js Layout
4. Определи структуру route groups
5. Только после этого интегрируй layout
</thinking>

**Действия:**
- [x] Создать `app/(private)/layout.tsx` для защищенных маршрутов
- [x] Использовать MainLayout в layout.tsx
- [x] Настроить метаданные страниц
- [x] Убедиться, что layout применяется ко всем страницам

**Документация:**
- <CRITICAL>[ARCHITECTURE.md](../../../architecture/ARCHITECTURE.md) - раздел 3.1 Next.js App Router</CRITICAL>
- [USER_FLOW.md](../../../user_flows/USER_FLOW.md) - раздел Navigation
- Next.js Layout документация (через Context7)

**Критерии приемки:**
- Layout интегрирован с App Router
- Layout применяется ко всем страницам
- Метаданные настроены

<output_format>
После выполнения задачи layout должен быть интегрирован с App Router, layout должен применяться ко всем страницам, и метаданные должны быть настроены.
</output_format>

---

### Task 07.08: Реализация навигации в зависимости от роли

<context>
<CRITICAL>Это критически важная задача для безопасности!</CRITICAL> Реализация навигации в зависимости от роли критически важна для обеспечения правильного доступа к функциям приложения. Навигация должна адаптироваться к роли пользователя (Teacher/Admin).
</context>

<task>
Реализуй навигацию в зависимости от роли пользователя. Создай утилиту для получения роли из Cognito, обнови Sidebar и Header для отображения меню согласно роли, и создай конфигурацию меню для каждой роли.
</task>

<constraints>
- Утилита для получения роли должна быть создана
- Меню должно отображаться согласно роли пользователя
- Teacher должен видеть только свои пункты меню
- Admin должен видеть все пункты меню
- Роль должна получаться из Cognito
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Изучи SECURITY.md раздел 3 Role-Based Access Control для понимания требований
2. Изучи MVP_SCOPE.md раздел 2.1.2 Роли пользователей для понимания ролей
3. Изучи USER_FLOW.md раздел Navigation для понимания навигации
4. Определи конфигурацию меню для каждой роли
5. Только после этого реализуй навигацию
</thinking>

**Действия:**
- [x] Создать утилиту для получения роли пользователя: `lib/utils/auth.ts`
- [x] Реализовать функцию `getUserRole()` которая возвращает роль из Cognito
- [x] Обновить Sidebar и Header для отображения меню согласно роли
- [x] Создать конфигурацию меню для каждой роли:
  - Teacher menu items
  - Admin menu items

**Документация:**
- <CRITICAL>[SECURITY.md](../../../infrastructure/SECURITY.md) - раздел 3 Role-Based Access Control</CRITICAL>
- <CRITICAL>[MVP_SCOPE.md](../../../MVP_SCOPE.md) - раздел 2.1.2 Роли пользователей</CRITICAL>
- [USER_FLOW.md](../../../user_flows/USER_FLOW.md) - раздел Navigation

**Критерии приемки:**
- Утилита для получения роли создана
- Меню отображается согласно роли пользователя
- Teacher видит только свои пункты меню
- Admin видит все пункты меню

<output_format>
После выполнения задачи утилита для получения роли должна быть создана, меню должно отображаться согласно роли пользователя, Teacher должен видеть только свои пункты меню, и Admin должен видеть все пункты меню.
</output_format>

---

### Task 07.09: Тестирование layout компонентов

<context>
Тестирование layout компонентов необходимо для подтверждения правильности работы всех компонентов на разных устройствах и с разными ролями. Это важный шаг перед переходом к следующей фазе.
</context>

<task>
Протестируй все layout компоненты. Проверь работу Header, Sidebar, MobileNav и Footer на всех размерах экрана, протестируй навигацию с разными ролями и проверь keyboard navigation.
</task>

<constraints>
- Все компоненты должны работать корректно
- Адаптивность должна работать на всех устройствах
- Навигация должна работать для всех ролей
- Keyboard navigation должна функционировать
- Все компоненты должны быть доступны
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Подготовь тестовые сценарии для всех компонентов
2. Подготовь тестовые данные для разных ролей
3. Только после этого тестируй компоненты
</thinking>

**Действия:**
- [x] Протестировать Header на всех размерах экрана
- [x] Протестировать Sidebar на Desktop
- [x] Протестировать MobileNav на мобильных устройствах
- [x] Протестировать Footer на всех страницах
- [x] Протестировать навигацию с разными ролями (Teacher, Admin)
- [x] Проверить keyboard navigation

**Документация:**
- [WIREFRAMES.md](../../../ui_ux/WIREFRAMES.md)
- [DESIGN_SYSTEM.md](../../../ui_ux/DESIGN_SYSTEM.md) - раздел 4 Accessibility

**Критерии приемки:**
- Все компоненты работают корректно
- Адаптивность работает на всех устройствах
- Навигация работает для всех ролей
- Keyboard navigation функционирует

<output_format>
После выполнения задачи все компоненты должны работать корректно, адаптивность должна работать на всех устройствах, навигация должна работать для всех ролей, и keyboard navigation должна функционировать.
</output_format>

---

### Task 07.10: Оптимизация производительности layout

<context>
<CRITICAL>Это финальная задача фазы!</CRITICAL> Оптимизация производительности layout критически важна для обеспечения быстрой работы приложения. Правильная оптимизация улучшит пользовательский опыт.
</context>

<task>
Оптимизируй производительность layout компонентов. Убедись, что все layout компоненты являются Server Components, проверь отсутствие ненужных re-renders, оптимизируй загрузку иконок и проверь размер bundle.
</task>

<constraints>
- Layout компоненты должны быть Server Components
- Не должно быть ненужных re-renders
- Bundle size должен быть приемлемым
- Иконки должны загружаться оптимально (lazy loading если необходимо)
</constraints>

<thinking>
Прежде чем приступить к реализации:
1. Изучи ARCHITECTURE.md раздел Server Components для понимания требований
2. Используй Context7 для получения актуальной документации Next.js Performance
3. Определи области для оптимизации
4. Только после этого оптимизируй производительность
</thinking>

**Действия:**
- [x] Убедиться, что layout компоненты являются Server Components
- [x] Проверить, что нет ненужных re-renders
- [x] Оптимизировать загрузку иконок (lazy loading если необходимо)
- [x] Проверить размер bundle для layout компонентов

**Документация:**
- [ARCHITECTURE.md](../../../architecture/ARCHITECTURE.md) - раздел Server Components
- Next.js Performance документация (через Context7)

**Критерии приемки:**
- Layout компоненты оптимизированы
- Нет ненужных re-renders
- Bundle size приемлемый

<output_format>
После выполнения задачи layout компоненты должны быть оптимизированы, не должно быть ненужных re-renders, и bundle size должен быть приемлемым.
</output_format>

---

## Ссылки на документацию проекта

- [WIREFRAMES.md](../../../ui_ux/WIREFRAMES.md) - Wireframes всех страниц
- [COMPONENT_LIBRARY.md](../../../components/COMPONENT_LIBRARY.md) - Библиотека компонентов
- [USER_FLOW.md](../../../user_flows/USER_FLOW.md) - Пользовательские сценарии
- [DESIGN_SYSTEM.md](../../../ui_ux/DESIGN_SYSTEM.md) - Дизайн-система

---

## Примечания

- Layout компоненты должны быть Server Components по умолчанию
- MobileNav должен быть Client Component из-за интерактивности
- Навигация должна адаптироваться к роли пользователя
- Все компоненты должны быть доступны (WCAG 2.1 AA)

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

