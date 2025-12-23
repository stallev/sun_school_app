# Phase 06: Настройка UI библиотеки (Shadcn UI)

## Описание фазы
Установка и настройка Shadcn UI компонентов, настройка Tailwind CSS, темизация, интеграция с дизайн-системой.

## Зависимости
Phase 01: Настройка проекта и окружения

## Оценка времени
3-4 часа

## Требования к AI Agent

> [!IMPORTANT]
> - AI Agent при создании программного кода должен использовать актуальную документацию для конкретной версии библиотеки или фреймворка через Context7
> - Для Shadcn UI должна быть использована официальная документация
> - Перед установкой компонентов необходимо изучить DESIGN_SYSTEM.md документацию проекта
> - Следовать принципам из `docs/guidelines/prompts/general_prompt_guidelines.md`

## Задачи

### Task 06.01: Инициализация Shadcn UI
- [ ] Установить Shadcn UI CLI: `npx shadcn@latest init`
- [ ] Выбрать опции:
  - Style: `Default` (или другой согласно дизайн-системе)
  - Base color: `Slate` (или другой согласно дизайн-системе)
  - CSS variables: `Yes`
- [ ] Дождаться создания конфигурационных файлов

**Документация:**
- [DESIGN_SYSTEM.md](../../../ui_ux/DESIGN_SYSTEM.md) - раздел 2 Design Tokens
- [COMPONENT_LIBRARY.md](../../../components/COMPONENT_LIBRARY.md) - раздел 2 Directory Structure
- Shadcn UI официальная документация (через Context7)

**Критерии приемки:**
- Shadcn UI инициализирован
- Создан файл `components.json`
- Создана папка `components/ui/`

---

### Task 06.02: Установка базовых компонентов Shadcn UI
- [ ] Установить Button: `npx shadcn@latest add button`
- [ ] Установить Card: `npx shadcn@latest add card`
- [ ] Установить Form: `npx shadcn@latest add form`
- [ ] Установить Input: `npx shadcn@latest add input`
- [ ] Установить Dialog: `npx shadcn@latest add dialog`
- [ ] Установить Table: `npx shadcn@latest add table`
- [ ] Установить Badge: `npx shadcn@latest add badge`
- [ ] Установить Dropdown Menu: `npx shadcn@latest add dropdown-menu`
- [ ] Установить Calendar: `npx shadcn@latest add calendar`
- [ ] Установить Avatar: `npx shadcn@latest add avatar`
- [ ] Установить другие необходимые компоненты согласно [COMPONENT_LIBRARY.md](../../../components/COMPONENT_LIBRARY.md)

**Документация:**
- [COMPONENT_LIBRARY.md](../../../components/COMPONENT_LIBRARY.md) - раздел 2 Directory Structure
- [DESIGN_SYSTEM.md](../../../ui_ux/DESIGN_SYSTEM.md) - раздел 3 Component Library
- Shadcn UI компоненты документация (через Context7)

**Критерии приемки:**
- Все базовые компоненты установлены
- Компоненты находятся в `components/ui/`
- Компоненты можно импортировать и использовать

---

### Task 06.03: Настройка Tailwind CSS конфигурации
- [ ] Открыть `tailwind.config.ts`
- [ ] Настроить цвета согласно [DESIGN_SYSTEM.md](../../../ui_ux/DESIGN_SYSTEM.md) раздел 2.1 Color Palette
- [ ] Настроить типографику согласно раздел 2.2 Typography
- [ ] Настроить spacing согласно раздел 2.3 Spacing
- [ ] Настроить border radius согласно раздел 2.4 Border Radius
- [ ] Настроить shadows согласно раздел 2.5 Shadows

**Документация:**
- [DESIGN_SYSTEM.md](../../../ui_ux/DESIGN_SYSTEM.md) - раздел 2 Design Tokens
- Tailwind CSS документация (через Context7)

**Критерии приемки:**
- Tailwind конфигурация соответствует дизайн-системе
- Все токены дизайна настроены
- CSS переменные работают корректно

---

### Task 06.04: Настройка CSS переменных для темизации
- [ ] Открыть `app/globals.css` (или `src/app/globals.css`)
- [ ] Проверить наличие CSS переменных для цветов
- [ ] Настроить переменные согласно [DESIGN_SYSTEM.md](../../../ui_ux/DESIGN_SYSTEM.md) раздел 2.1
- [ ] Убедиться, что переменные используются в компонентах
- [ ] Протестировать изменение цветов через переменные

**Документация:**
- [DESIGN_SYSTEM.md](../../../ui_ux/DESIGN_SYSTEM.md) - раздел 2 Design Tokens
- Shadcn UI Theming документация (через Context7)

**Критерии приемки:**
- CSS переменные настроены
- Переменные соответствуют дизайн-системе
- Изменение переменных влияет на компоненты

---

### Task 06.05: Создание кастомных компонентов-оберток
- [ ] Создать кастомные компоненты-обертки для часто используемых паттернов
- [ ] Создать `components/atoms/icon.tsx` для иконок
- [ ] Создать `components/atoms/logo.tsx` для логотипа
- [ ] Создать `components/atoms/spinner.tsx` для загрузки
- [ ] Убедиться, что компоненты следуют Atomic Design принципам

**Документация:**
- [COMPONENT_LIBRARY.md](../../../components/COMPONENT_LIBRARY.md) - раздел 2 Directory Structure
- [DESIGN_SYSTEM.md](../../../ui_ux/DESIGN_SYSTEM.md) - раздел 3 Component Library

**Критерии приемки:**
- Кастомные компоненты созданы
- Компоненты следуют структуре проекта
- Компоненты можно использовать в приложении

---

### Task 06.06: Настройка иконок (lucide-react)
- [ ] Убедиться, что `lucide-react` установлен (из Phase 01)
- [ ] Создать утилиту для иконок: `lib/utils/icons.ts`
- [ ] Экспортировать часто используемые иконки
- [ ] Протестировать использование иконок в компонентах

**Документация:**
- [DESIGN_SYSTEM.md](../../../ui_ux/DESIGN_SYSTEM.md) - раздел 2.6 Iconography
- lucide-react документация (через Context7)

**Критерии приемки:**
- Иконки доступны через утилиту
- Иконки используются в компонентах
- Размеры и стили иконок соответствуют дизайн-системе

---

### Task 06.07: Тестирование компонентов
- [ ] Создать тестовую страницу для проверки компонентов: `app/test-components/page.tsx`
- [ ] Добавить примеры использования всех установленных компонентов
- [ ] Проверить визуальное отображение компонентов
- [ ] Проверить работу интерактивных компонентов (Dialog, Dropdown и др.)
- [ ] Проверить адаптивность компонентов (Mobile, Tablet, Desktop)

**Документация:**
- [DESIGN_SYSTEM.md](../../../ui_ux/DESIGN_SYSTEM.md)
- [COMPONENT_LIBRARY.md](../../../components/COMPONENT_LIBRARY.md)

**Критерии приемки:**
- Все компоненты отображаются корректно
- Интерактивные компоненты работают
- Компоненты адаптивны для разных экранов

---

### Task 06.08: Настройка темной темы (опционально)
- [ ] Определить, нужна ли темная тема для MVP (согласно MVP_SCOPE.md)
- [ ] Если нужна, установить next-themes: `npm install next-themes`
- [ ] Создать ThemeProvider компонент
- [ ] Настроить переключение темы
- [ ] Протестировать темную тему

**Документация:**
- [MVP_SCOPE.md](../../../MVP_SCOPE.md) - раздел 3.4.4 Темная тема
- [DESIGN_SYSTEM.md](../../../ui_ux/DESIGN_SYSTEM.md) - раздел 2.1 Color Palette
- next-themes документация (через Context7)

**Критерии приемки:**
- Темная тема настроена (если требуется)
- Переключение темы работает
- Компоненты корректно отображаются в обеих темах

---

### Task 06.09: Проверка доступности (Accessibility)
- [ ] Проверить, что все компоненты имеют правильные ARIA атрибуты
- [ ] Проверить keyboard navigation для интерактивных компонентов
- [ ] Проверить цветовой контраст согласно WCAG 2.1 AA
- [ ] Протестировать с screen reader (если возможно)

**Документация:**
- [DESIGN_SYSTEM.md](../../../ui_ux/DESIGN_SYSTEM.md) - раздел 4 Accessibility
- [ACCESSIBILITY.md](../../../ui_ux/ACCESSIBILITY.md) - если существует
- WCAG 2.1 AA документация

**Критерии приемки:**
- Компоненты имеют правильные ARIA атрибуты
- Keyboard navigation работает
- Цветовой контраст соответствует WCAG 2.1 AA

---

### Task 06.10: Документирование установленных компонентов
- [ ] Создать список всех установленных компонентов
- [ ] Задокументировать кастомные компоненты
- [ ] Обновить [COMPONENT_LIBRARY.md](../../../components/COMPONENT_LIBRARY.md) если необходимо
- [ ] Создать примеры использования компонентов

**Документация:**
- [COMPONENT_LIBRARY.md](../../../components/COMPONENT_LIBRARY.md)
- [DESIGN_SYSTEM.md](../../../ui_ux/DESIGN_SYSTEM.md)

**Критерии приемки:**
- Документация обновлена
- Список компонентов актуален
- Примеры использования добавлены

---

## Ссылки на документацию проекта

- [DESIGN_SYSTEM.md](../../../ui_ux/DESIGN_SYSTEM.md) - Дизайн-система
- [COMPONENT_LIBRARY.md](../../../components/COMPONENT_LIBRARY.md) - Библиотека компонентов
- [MVP_SCOPE.md](../../../MVP_SCOPE.md) - Область MVP

---

## Примечания

- Shadcn UI компоненты копируются в проект (не npm пакет), что дает полный контроль
- Все компоненты должны следовать дизайн-системе проекта
- Темная тема не входит в MVP согласно MVP_SCOPE.md, но можно подготовить инфраструктуру
- Доступность критически важна - все компоненты должны быть доступны

---

**Версия:** 1.0  
**Последнее обновление:** 23 декабря 2025

