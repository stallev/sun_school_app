# CLIENT_COMPONENTS - Sunday School App

## Document Version: 1.0
**Creation Date:** 23 December 2025  
**Last Update:** 23 December 2025  
**Project:** Sunday School App  
**Technologies:** Next.js 15.5.9 (Client Components, App Router), React 19, TypeScript, Zustand (минимально), React Hook Form + Zod, Server Actions

> [!NOTE]
> Документация основана на актуальных источниках:
> - Next.js 15.5.9 — официальная документация Vercel  
> - React 19 — официальная документация  
> - AWS Amplify Gen 1 / Server Actions — официальная документация AWS & Next.js

---

## 1. Обзор
- Цель: определить, когда использовать Client Components, как работать с состоянием, формами и событиями, сохраняя минимальный клиентский bundle.
- Принцип: Client Components только для интерактивности и локального состояния; данные приходят из RSC или Server Actions.

---

## 2. Критерии выбора Client Components
- Требуются browser API (`window`, `document`, media queries).
- Нужны интерактивные UI/анимации (Framer Motion), drag-n-drop.
- Формы с мгновенной валидацией и UX-обратной связью.
- Взаимодействие WebSockets/real-time (при появлении).

---

## 3. Состояние и события
- Zustand: только для UI-состояния (модалки, меню, local filters), не для серверных данных.
- Локальное состояние: `useState`, `useReducer`; избегать глобального состояния без надобности.
- События: debounce/throttle для дорогих операций; избегать лишних эффектов.

---

## 4. Формы (React Hook Form + Zod)
- Клиентская валидация дублирует серверную (Zod схемы те же типы).
- Отправка: `form action={serverAction}` или `handleSubmit` → `serverAction`.
- Обработка ошибок: отображать `fieldErrors` из ActionResponse; optimistic updates только при идемпотентных действиях.

---

## 5. Взаимодействие с Server Components
- Данные передаются из RSC в Client через props, без повторных fetch.
- Для фильтров/сортировки: RSC генерирует набор данных, Client меняет представление; при смене запросов — инициирует Server Action и revalidate.

---

## 6. Производительность
- Избегать крупных зависимостей в Client; выносить в RSC или динамический импорт.
- Сегментируйте boundary: маленькие Client-виджеты внутри RSC.
- Мемоизация: `useMemo/useCallback` только при измеримой выгоде.
- Suspense: использовать для ленивых Client-поддеревьев, если совместимо.

---

## 7. Тестирование
- React Testing Library: поведение форм, валидация, взаимодействия.
- Мокаем Server Actions (stub) и проверяем обработку ActionResponse.
- Accessibility: проверки фокуса/клавиатуры для интерактивных элементов.

---

## 8. Cross-reference
- Компонентная библиотека: `docs/components/COMPONENT_LIBRARY.md`
- Дизайн-система: `docs/ui_ux/DESIGN_SYSTEM.md`
- Валидация: `docs/api/VALIDATION.md`
- Server Actions: `docs/api/SERVER_ACTIONS.md`
- Архитектура: `docs/architecture/ARCHITECTURE.md`

---

**Версия:** 1.0  
**Последнее обновление:** 23 December 2025  
**Автор:** AI Documentation Team

