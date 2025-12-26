# RESPONSIVE_DESIGN - Sunday School App

## Document Version: 1.0
**Creation Date:** 23 December 2025  
**Last Update:** 23 December 2025  
**Project:** Sunday School App  
**Technologies:** Next.js 15.5.9, React 19, Tailwind CSS, Shadcn UI, TypeScript

> [!NOTE]
> Документация основана на актуальных источниках:
> - Next.js 15.5.9 — официальная документация Vercel  
> - Tailwind CSS — официальная документация  
> - React 19 — официальная документация

---

## 1. Обзор
- Цель: стратегия адаптивного дизайна (mobile-first) для уроков, журналов, дашбордов и форм.
- Фокус: сетка/лейауты, типовые паттерны для списков/таблиц, интерактивные элементы и тестирование на разных девайсах.

---

## 2. Принципы Mobile-First
- Старт с `sm` (mobile) макета, расширение через Tailwind breakpoints (`sm`, `md`, `lg`, `xl`).
- Контент-приоритет: критичные данные/CTA выше, вторичные — сворачиваемые.
- Касания: оптимизировать hit area (минимум 44px).

---

## 3. Breakpoints и сетка
- Tailwind по умолчанию: `sm:640`, `md:768`, `lg:1024`, `xl:1280`, `2xl:1536`.
- Лейауты: `grid-cols-1` → `md:grid-cols-2` → `lg:grid-cols-3` для карточек; таблицы на mobile — карточки/stacked.
- Шапка/навигация: burger + slide-in drawer на mobile, sidebar на desktop.

---

## 4. Паттерны компонентов
- Таблицы оценок: на mobile — карточки с ключевыми полями; на desktop — полноценная таблица с сортировкой.
- Формы: одноколоночные на mobile, двухколоночные на `md+`; sticky actions снизу/сбоку.
- Карточки уроков/учеников: адаптивные изображения/аватары, текстовые триммеры.
- Графики/прогресс: использовать `aspect-video` и `min-w-0` для предотвращения переполнений.

---

## 5. Медиа и производительность
- Next.js Image: `sizes` для адаптивных загрузок; `priority` только для hero.
- Шрифты: переменные шрифты (Geist), `font-display: swap`.
- Анимации: снижать на mobile; уважать `prefers-reduced-motion`.

---

## 6. Тестирование и валидация
- Snapshots лейаутов в Storybook/RTTL, проверка на `sm/md/lg`.
- Lighthouse/Chrome DevTools: аудит layout shift (CLS), tap targets, performance.
- Device matrix: iPhone 13/SE, Pixel 6, iPad, Desktop 1440p.

---

## 7. Cross-reference
- Дизайн-система: `docs/ui_ux/DESIGN_SYSTEM.md`
- Компоненты: `docs/components/COMPONENT_LIBRARY.md`
- Доступность: `docs/ui_ux/ACCESSIBILITY.md`
- User flows/wireframes: `docs/user_flows/USER_FLOW.md`, `docs/ui_ux/WIREFRAMES.md`

---

**Версия:** 1.0  
**Последнее обновление:** 23 December 2025  
**Автор:** AI Documentation Team

