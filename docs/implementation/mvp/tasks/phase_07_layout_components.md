# Phase 07: Создание базовых layout компонентов

## Описание фазы
Создание базовых layout компонентов: Header, Sidebar, Footer, Navigation, адаптивная навигация для мобильных устройств.

## Зависимости
Phase 06: Настройка UI библиотеки (Shadcn UI)

## Оценка времени
4-5 часов

## Требования к AI Agent

> [!IMPORTANT]
> - AI Agent при создании программного кода должен использовать актуальную документацию для конкретной версии библиотеки или фреймворка через Context7
> - Для Next.js 15.5.9 должна быть использована документация версии 15.5.9
> - Перед созданием компонентов необходимо изучить WIREFRAMES.md и USER_FLOW.md документацию проекта
> - Следовать принципам из `docs/guidelines/prompts/general_prompt_guidelines.md`

## Задачи

### Task 07.01: Создание структуры layout компонентов
- [ ] Создать каталог `components/organisms/navigation/`
- [ ] Создать каталог `components/organisms/layout/`
- [ ] Создать базовую структуру файлов:
  - `components/organisms/navigation/header.tsx`
  - `components/organisms/navigation/sidebar.tsx`
  - `components/organisms/navigation/mobile-nav.tsx`
  - `components/organisms/layout/footer.tsx`
  - `components/organisms/layout/main-layout.tsx`

**Документация:**
- [COMPONENT_LIBRARY.md](../../../components/COMPONENT_LIBRARY.md) - раздел 2 Directory Structure
- [WIREFRAMES.md](../../../ui_ux/WIREFRAMES.md) - раздел Layout

**Критерии приемки:**
- Структура каталогов создана
- Файлы компонентов созданы
- Структура соответствует Atomic Design

---

### Task 07.02: Создание Header компонента
- [ ] Изучить wireframe Header из [WIREFRAMES.md](../../../ui_ux/WIREFRAMES.md)
- [ ] Создать Server Component `Header` с:
  - Логотипом приложения
  - Навигационным меню (для Desktop)
  - Кнопкой меню для мобильных (hamburger)
  - Информацией о текущем пользователе
  - Кнопкой выхода
- [ ] Использовать компоненты Shadcn UI (Button, Avatar, Dropdown Menu)
- [ ] Добавить адаптивность для мобильных устройств

**Документация:**
- [WIREFRAMES.md](../../../ui_ux/WIREFRAMES.md) - раздел Header
- [DESIGN_SYSTEM.md](../../../ui_ux/DESIGN_SYSTEM.md) - раздел 3 Component Library
- [USER_FLOW.md](../../../user_flows/USER_FLOW.md) - раздел Navigation

**Критерии приемки:**
- Header компонент создан
- Компонент соответствует wireframe
- Адаптивность работает корректно
- Навигация функционирует

---

### Task 07.03: Создание Sidebar компонента
- [ ] Изучить wireframe Sidebar из [WIREFRAMES.md](../../../ui_ux/WIREFRAMES.md)
- [ ] Создать Server Component `Sidebar` с:
  - Навигационными ссылками согласно роли пользователя
  - Активным состоянием текущей страницы
  - Иконками для каждого пункта меню
  - Группировкой пунктов меню (если необходимо)
- [ ] Реализовать логику отображения меню в зависимости от роли (Teacher/Admin)
- [ ] Использовать компоненты Shadcn UI (Navigation Menu)

**Документация:**
- [WIREFRAMES.md](../../../ui_ux/WIREFRAMES.md) - раздел Sidebar
- [USER_FLOW.md](../../../user_flows/USER_FLOW.md) - раздел Navigation
- [MVP_SCOPE.md](../../../MVP_SCOPE.md) - раздел 2.1.2 Роли пользователей

**Критерии приемки:**
- Sidebar компонент создан
- Меню отображается согласно роли пользователя
- Активное состояние работает
- Навигация функционирует

---

### Task 07.04: Создание Mobile Navigation компонента
- [ ] Создать Client Component `MobileNav` с:
  - Drawer/Sheet компонентом для мобильного меню
  - Списком навигационных ссылок
  - Кнопкой закрытия
  - Анимацией открытия/закрытия
- [ ] Использовать Shadcn UI Sheet компонент
- [ ] Интегрировать с Header (кнопка hamburger открывает MobileNav)

**Документация:**
- [WIREFRAMES.md](../../../ui_ux/WIREFRAMES.md) - раздел Mobile Navigation
- [DESIGN_SYSTEM.md](../../../ui_ux/DESIGN_SYSTEM.md) - раздел Responsive Design
- Shadcn UI Sheet документация (через Context7)

**Критерии приемки:**
- MobileNav компонент создан
- Drawer открывается/закрывается корректно
- Навигация работает на мобильных устройствах
- Анимация плавная

---

### Task 07.05: Создание Footer компонента
- [ ] Изучить wireframe Footer из [WIREFRAMES.md](../../../ui_ux/WIREFRAMES.md)
- [ ] Создать Server Component `Footer` с:
  - Информацией о приложении
  - Ссылками (если необходимы)
  - Копирайтом
  - Версией приложения (опционально)
- [ ] Использовать компоненты Shadcn UI для стилизации

**Документация:**
- [WIREFRAMES.md](../../../ui_ux/WIREFRAMES.md) - раздел Footer
- [DESIGN_SYSTEM.md](../../../ui_ux/DESIGN_SYSTEM.md)

**Критерии приемки:**
- Footer компонент создан
- Компонент соответствует wireframe
- Footer отображается на всех страницах

---

### Task 07.06: Создание MainLayout компонента
- [ ] Создать Server Component `MainLayout` который объединяет:
  - Header
  - Sidebar (для Desktop)
  - Main content area
  - Footer
- [ ] Реализовать адаптивный layout:
  - Desktop: Header + Sidebar + Content + Footer
  - Mobile: Header + Content + Footer (Sidebar скрыт, открывается через MobileNav)
- [ ] Использовать CSS Grid или Flexbox для layout

**Документация:**
- [WIREFRAMES.md](../../../ui_ux/WIREFRAMES.md) - раздел Layout Structure
- [ARCHITECTURE.md](../../../architecture/ARCHITECTURE.md) - раздел Frontend Architecture
- Next.js Layout документация (через Context7)

**Критерии приемки:**
- MainLayout компонент создан
- Layout адаптивен для всех размеров экрана
- Все компоненты интегрированы корректно

---

### Task 07.07: Интеграция layout с Next.js App Router
- [ ] Создать `app/(private)/layout.tsx` для защищенных маршрутов
- [ ] Использовать MainLayout в layout.tsx
- [ ] Настроить метаданные страниц
- [ ] Убедиться, что layout применяется ко всем страницам

**Документация:**
- [ARCHITECTURE.md](../../../architecture/ARCHITECTURE.md) - раздел 3.1 Next.js App Router
- [USER_FLOW.md](../../../user_flows/USER_FLOW.md) - раздел Navigation
- Next.js Layout документация (через Context7)

**Критерии приемки:**
- Layout интегрирован с App Router
- Layout применяется ко всем страницам
- Метаданные настроены

---

### Task 07.08: Реализация навигации в зависимости от роли
- [ ] Создать утилиту для получения роли пользователя: `lib/utils/auth.ts`
- [ ] Реализовать функцию `getUserRole()` которая возвращает роль из Cognito
- [ ] Обновить Sidebar и Header для отображения меню согласно роли
- [ ] Создать конфигурацию меню для каждой роли:
  - Teacher menu items
  - Admin menu items

**Документация:**
- [SECURITY.md](../../../infrastructure/SECURITY.md) - раздел 3 Role-Based Access Control
- [MVP_SCOPE.md](../../../MVP_SCOPE.md) - раздел 2.1.2 Роли пользователей
- [USER_FLOW.md](../../../user_flows/USER_FLOW.md) - раздел Navigation

**Критерии приемки:**
- Утилита для получения роли создана
- Меню отображается согласно роли пользователя
- Teacher видит только свои пункты меню
- Admin видит все пункты меню

---

### Task 07.09: Тестирование layout компонентов
- [ ] Протестировать Header на всех размерах экрана
- [ ] Протестировать Sidebar на Desktop
- [ ] Протестировать MobileNav на мобильных устройствах
- [ ] Протестировать Footer на всех страницах
- [ ] Протестировать навигацию с разными ролями (Teacher, Admin)
- [ ] Проверить keyboard navigation

**Документация:**
- [WIREFRAMES.md](../../../ui_ux/WIREFRAMES.md)
- [DESIGN_SYSTEM.md](../../../ui_ux/DESIGN_SYSTEM.md) - раздел 4 Accessibility

**Критерии приемки:**
- Все компоненты работают корректно
- Адаптивность работает на всех устройствах
- Навигация работает для всех ролей
- Keyboard navigation функционирует

---

### Task 07.10: Оптимизация производительности layout
- [ ] Убедиться, что layout компоненты являются Server Components
- [ ] Проверить, что нет ненужных re-renders
- [ ] Оптимизировать загрузку иконок (lazy loading если необходимо)
- [ ] Проверить размер bundle для layout компонентов

**Документация:**
- [ARCHITECTURE.md](../../../architecture/ARCHITECTURE.md) - раздел Server Components
- Next.js Performance документация (через Context7)

**Критерии приемки:**
- Layout компоненты оптимизированы
- Нет ненужных re-renders
- Bundle size приемлемый

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

**Версия:** 1.0  
**Последнее обновление:** 23 декабря 2025

