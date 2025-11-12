# Design Review Guidelines

## Версия: 1.0
**Дата:** 06.11.2025  
**Цель:** Обеспечить соответствие дизайна референсу Wirezo Template

---

## 🔍 Процесс Design Review

### Перед созданием компонента

1. **Изучите референс:** [Wirezo Template](https://fv.templateorbit.com/2/wirezo/)
2. **Проверьте Design System:** [`docs/DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md)
3. **Используйте существующие компоненты:** Проверьте `src/components/ui/` и `src/components/landing/`

### После создания компонента

1. **Визуальная проверка в браузере:**
   - Запустите `npm run dev`
   - Откройте страницу в браузере
   - Сравните с референсом Wirezo

2. **Проверка соответствия:**
   - [ ] Цветовая схема соответствует (Primary: #1e40af)
   - [ ] Типографика соответствует (крупные заголовки, правильные веса)
   - [ ] Тени и эффекты соответствуют (shadow-md, hover:shadow-xl)
   - [ ] Отступы соответствуют (py-24 для секций)
   - [ ] Контейнеры центрированы (container mx-auto)

3. **Техническая проверка:**
   - [ ] TypeScript: `npx tsc --noEmit` - без ошибок
   - [ ] Линтинг: `npm run lint` - без ошибок
   - [ ] Сборка: `npm run build` - успешна

---

## 🎨 Критерии соответствия референсу

### Цветовая схема
- ✅ Primary: `#1e40af` (Blue 800) - профессиональный синий
- ✅ Текст: `text-gray-900` для заголовков, `text-gray-600` для описаний
- ✅ Фоны: `bg-white` для карточек, `bg-gray-50` для секций
- ❌ НЕ используйте яркие цвета или несоответствующие оттенки

### Типографика
- ✅ H1: `text-5xl sm:text-6xl md:text-7xl font-bold`
- ✅ H2: `text-4xl sm:text-5xl font-bold`
- ✅ Badge: `text-sm font-semibold uppercase tracking-wider text-primary`
- ❌ НЕ используйте слишком маленькие заголовки

### Компоненты
- ✅ Карточки: `border-0 shadow-md hover:shadow-xl hover:-translate-y-1`
- ✅ Кнопки: `rounded-lg shadow-md hover:shadow-lg`
- ✅ Иконки: в контейнерах `bg-primary/10 h-12 w-12 rounded-lg`
- ❌ НЕ используйте границы на карточках (border-0)

### Spacing
- ✅ Секции: `py-24` (не py-20)
- ✅ Сетки: `gap-8` (не gap-6)
- ✅ Заголовки: `mb-16` после заголовка секции
- ❌ НЕ используйте слишком маленькие отступы

---

## 🚫 Частые ошибки

### 1. Отсутствие центрирования
```tsx
// ❌ Неправильно
<div className="container px-4">

// ✅ Правильно
<div className="container mx-auto px-4">
```

### 2. Хардкод цветов
```tsx
// ❌ Неправильно
className="text-blue-600 bg-blue-600"

// ✅ Правильно
className="text-primary bg-primary"
```

### 3. Неправильные тени
```tsx
// ❌ Неправильно
className="shadow-sm hover:shadow-md"

// ✅ Правильно
className="shadow-md hover:shadow-xl hover:-translate-y-1"
```

### 4. Маленькие отступы
```tsx
// ❌ Неправильно
<section className="py-20">

// ✅ Правильно
<section className="py-24">
```

### 5. Границы на карточках
```tsx
// ❌ Неправильно
<Card className="border">

// ✅ Правильно
<Card className="border-0 shadow-md">
```

---

## 📝 Шаблон для новых компонентов

```tsx
'use client'; // или без директивы для Server Component

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Описание компонента
 * Соответствует референсу Wirezo Template
 */
export function MyComponent() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-4 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Badge
          </span>
        </div>
        <h2 className="mb-16 text-center text-4xl font-bold text-gray-900 sm:text-5xl">
          Заголовок секции
        </h2>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-0 shadow-md transition-all hover:shadow-xl hover:-translate-y-1 bg-white">
            <CardHeader className="pb-4">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                {/* Иконка */}
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">
                Заголовок карточки
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-gray-600">
                Описание
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
```

---

## 🔗 Референс

**Основной референс:** [Wirezo Template](https://fv.templateorbit.com/2/wirezo/)

**Ключевые элементы для сравнения:**
- Цветовая схема (синий акцент)
- Типографика (крупные заголовки)
- Карточки (без границ, с тенями)
- Отступы (просторные)
- Hover эффекты (плавные переходы)

---

**Версия:** 1.0  
**Последнее обновление:** 06.11.2025

