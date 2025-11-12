# UI/UX Спецификация - Sunday School App

## Версия документа: 1.0
**Дата создания:** 11 ноября 2025  
**Проект:** Sunday School App (Приложение для управления воскресной школой)  
**Технологии:** Next.js 16, TypeScript, Shadcn UI, Tailwind CSS, lucide-react  
**Подход:** Mobile-First Design, WCAG 2.1 AA Compliance

---

## 1. Дизайн-система

### 1.1. Design Tokens

#### 1.1.1. Цветовая палитра

**Primary Colors (Shadcn UI):**
```typescript
// Цвета по умолчанию из Shadcn UI
primary: {
  50: '#eff6ff',
  100: '#dbeafe',
  200: '#bfdbfe',
  300: '#93c5fd',
  400: '#60a5fa',
  500: '#3b82f6',  // Основной акцентный цвет
  600: '#2563eb',
  700: '#1d4ed8',
  800: '#1e40af',
  900: '#1e3a8a',
}
```

**Semantic Colors:**
```typescript
semantic: {
  success: '#10b981',    // Зеленый для успешных действий
  warning: '#f59e0b',    // Оранжевый для предупреждений
  error: '#ef4444',      // Красный для ошибок
  info: '#3b82f6',       // Синий для информации
}
```

**Neutral Colors:**
```typescript
neutral: {
  background: '#ffffff',        // Основной фон
  foreground: '#0f172a',        // Основной текст (slate-900)
  muted: '#f1f5f9',            // Фон для секций (slate-100)
  mutedForeground: '#64748b',  // Вторичный текст (slate-500)
  border: '#e2e8f0',           // Границы элементов (slate-200)
  card: '#ffffff',             // Фон карточек
  cardForeground: '#0f172a',   // Текст на карточках
  popover: '#ffffff',          // Фон popover
  popoverForeground: '#0f172a',// Текст в popover
  secondary: '#f1f5f9',        // Вторичный фон
  secondaryForeground: '#0f172a',// Вторичный текст
  accent: '#f1f5f9',          // Акцентный фон
  accentForeground: '#0f172a', // Акцентный текст
  destructive: '#ef4444',     // Деструктивные действия
  destructiveForeground: '#ffffff',// Текст на деструктивном фоне
  ring: '#3b82f6',            // Цвет фокуса
}
```

**Использование в Tailwind CSS:**
```css
/* Использование через CSS переменные Shadcn UI */
.text-primary { color: hsl(var(--primary)); }
.bg-primary { background-color: hsl(var(--primary)); }
.border-border { border-color: hsl(var(--border)); }
```

#### 1.1.2. Типографика

**Шрифты:**
```typescript
fontFamily: {
  sans: [
    'var(--font-geist-sans)',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
  ],
  mono: [
    'var(--font-geist-mono)',
    '"Fira Code"',
    'monospace',
  ],
}
```

**Размеры шрифтов (Tailwind CSS):**
```typescript
fontSize: {
  xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
  sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
  base: ['1rem', { lineHeight: '1.5rem' }],     // 16px
  lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
  xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
  '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px
  '3xl': ['1.875rem', { lineHeight: '2.25rem' }],// 30px
  '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
  '5xl': ['3rem', { lineHeight: '1' }],         // 48px
  '6xl': ['3.75rem', { lineHeight: '1' }],      // 60px
}
```

**Веса шрифтов:**
```typescript
fontWeight: {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
}
```

**Иерархия заголовков:**
```tsx
// H1 - Главные заголовки страниц
<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
  Заголовок страницы
</h1>

// H2 - Заголовки секций
<h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
  Заголовок секции
</h2>

// H3 - Подзаголовки
<h3 className="text-xl md:text-2xl font-semibold">
  Подзаголовок
</h3>

// H4 - Заголовки карточек
<h4 className="text-lg font-semibold">
  Заголовок карточки
</h4>

// Body - Основной текст
<p className="text-base text-foreground">
  Основной текст
</p>

// Small - Вторичный текст
<p className="text-sm text-muted-foreground">
  Вторичный текст
</p>
```

#### 1.1.3. Spacing (Отступы)

**Tailwind CSS Spacing Scale:**
```typescript
spacing: {
  0: '0px',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
}
```

**Рекомендации по использованию:**
- **Между элементами формы:** `gap-4` (16px)
- **Между секциями:** `py-8 md:py-12` (32px / 48px)
- **Внутренние отступы карточек:** `p-4 md:p-6` (16px / 24px)
- **Отступы контейнера:** `px-4 md:px-6 lg:px-8` (16px / 24px / 32px)
- **Отступы между строками таблицы:** `py-3` (12px)

#### 1.1.4. Border Radius

```typescript
borderRadius: {
  none: '0px',
  sm: '0.125rem',   // 2px
  DEFAULT: '0.375rem', // 6px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  full: '9999px',   // Полностью круглый
}
```

**Использование:**
- **Кнопки:** `rounded-md` (6px)
- **Карточки:** `rounded-lg` (8px)
- **Модальные окна:** `rounded-lg` (8px)
- **Input поля:** `rounded-md` (6px)
- **Badges:** `rounded-full` (круглые)

#### 1.1.5. Shadows (Тени)

```typescript
boxShadow: {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
}
```

**Использование:**
- **Карточки:** `shadow-md`
- **Модальные окна:** `shadow-xl`
- **Hover эффекты:** `hover:shadow-lg`
- **Кнопки:** `shadow-sm hover:shadow-md`

---

## 2. Компоненты Shadcn UI

### 2.1. Обзор компонентов

Shadcn UI предоставляет набор доступных, настраиваемых компонентов, построенных на Radix UI и Tailwind CSS.

**Основные компоненты:**
- `Button` - Кнопки различных вариантов
- `Input` - Поля ввода
- `Card` - Карточки для контента
- `Table` - Таблицы данных
- `Dialog` - Модальные окна
- `Toast` - Уведомления
- `Sidebar` - Боковая панель навигации
- `Breadcrumb` - Навигационные хлебные крошки
- `Select` - Выпадающие списки
- `Checkbox` - Чекбоксы
- `Label` - Метки для форм
- `Skeleton` - Индикаторы загрузки
- `Badge` - Значки и метки
- `Tabs` - Вкладки
- `Calendar` - Календарь
- `Popover` - Всплывающие окна

### 2.2. Button (Кнопки)

**Варианты:**
```tsx
// Primary (основная)
<Button variant="default">Сохранить</Button>

// Secondary (вторичная)
<Button variant="secondary">Отменить</Button>

// Destructive (деструктивная)
<Button variant="destructive">Удалить</Button>

// Outline (контурная)
<Button variant="outline">Редактировать</Button>

// Ghost (прозрачная)
<Button variant="ghost">Просмотр</Button>

// Link (ссылка)
<Button variant="link">Подробнее</Button>
```

**Размеры:**
```tsx
<Button size="sm">Маленькая</Button>
<Button size="default">Обычная</Button>
<Button size="lg">Большая</Button>
<Button size="icon">🔍</Button>
```

**Состояния:**
```tsx
<Button disabled>Отключена</Button>
<Button loading>Загрузка...</Button>
```

**Примеры использования:**
```tsx
// Кнопка с иконкой
<Button>
  <Plus className="mr-2 h-4 w-4" />
  Создать урок
</Button>

// Кнопка действия
<Button variant="destructive" onClick={handleDelete}>
  <Trash2 className="mr-2 h-4 w-4" />
  Удалить
</Button>
```

**Mobile требования:**
- Минимальный размер: 44x44px (для touch-friendly)
- Достаточные отступы между кнопками: `gap-2` (8px)

### 2.3. Input (Поля ввода)

**Базовое использование:**
```tsx
<Input
  type="email"
  placeholder="Введите email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

**С меткой:**
```tsx
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    placeholder="email@example.com"
  />
</div>
```

**С ошибкой:**
```tsx
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    className="border-destructive"
    aria-invalid="true"
  />
  <p className="text-sm text-destructive">
    Неверный формат email
  </p>
</div>
```

**Disabled состояние:**
```tsx
<Input disabled placeholder="Недоступно" />
```

**Mobile требования:**
- Минимальная высота: 44px
- Автоматическое появление клавиатуры (правильный `type`)
- Отключение автозаполнения где не нужно: `autoComplete="off"`

### 2.4. Card (Карточки)

**Базовое использование:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Заголовок карточки</CardTitle>
    <CardDescription>Описание карточки</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Содержимое карточки</p>
  </CardContent>
  <CardFooter>
    <Button>Действие</Button>
  </CardFooter>
</Card>
```

**Карточка с действиями:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Урок #15</CardTitle>
    <CardDescription>Любовь к ближнему</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Дата: 10.11.2024</p>
  </CardContent>
  <CardFooter className="flex justify-end gap-2">
    <Button variant="outline">Просмотр</Button>
    <Button>Редактировать</Button>
  </CardFooter>
</Card>
```

**Mobile адаптация:**
- На мобильных: `p-4` вместо `p-6`
- Вертикальное расположение элементов
- Полная ширина карточки

### 2.5. Table (Таблицы)

**Базовое использование:**
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Имя</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Роль</TableHead>
      <TableHead className="text-right">Действия</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Иван Петров</TableCell>
      <TableCell>ivan@example.com</TableCell>
      <TableCell>Teacher</TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>
```

**Mobile адаптация:**
- На экранах < 768px: преобразование в карточки
- Горизонтальная прокрутка для таблиц с множеством колонок
- Скрытие менее важных колонок на мобильных

**Пример адаптивной таблицы:**
```tsx
// Desktop: таблица
<div className="hidden md:block">
  <Table>...</Table>
</div>

// Mobile: карточки
<div className="md:hidden space-y-4">
  {data.map((item) => (
    <Card key={item.id}>
      <CardContent className="pt-6">
        {/* Данные в виде карточек */}
      </CardContent>
    </Card>
  ))}
</div>
```

### 2.6. Dialog (Модальные окна)

**Базовое использование:**
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Открыть</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Заголовок</DialogTitle>
      <DialogDescription>
        Описание модального окна
      </DialogDescription>
    </DialogHeader>
    <div className="py-4">
      {/* Содержимое */}
    </div>
    <DialogFooter>
      <Button variant="outline">Отменить</Button>
      <Button>Сохранить</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**Mobile требования:**
- Полная ширина на мобильных
- Закрытие по клику вне области или по кнопке "Отменить"
- Доступность через клавиатуру (ESC для закрытия)

### 2.7. Toast (Уведомления)

**Использование:**
```tsx
import { useToast } from '@/hooks/use-toast';

const { toast } = useToast();

// Успех
toast({
  title: "Успешно",
  description: "Урок успешно создан",
});

// Ошибка
toast({
  variant: "destructive",
  title: "Ошибка",
  description: "Не удалось создать урок",
});

// С действием
toast({
  title: "Урок создан",
  description: "Перейти к уроку?",
  action: (
    <ToastAction altText="Перейти">Перейти</ToastAction>
  ),
});
```

**Позиционирование:**
- По умолчанию: правый верхний угол
- На мобильных: нижний центр экрана

### 2.8. Skeleton (Индикаторы загрузки)

**Использование:**
```tsx
// Загрузка карточки
<Card>
  <CardHeader>
    <Skeleton className="h-6 w-32" />
    <Skeleton className="h-4 w-48 mt-2" />
  </CardHeader>
  <CardContent>
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4 mt-2" />
  </CardContent>
</Card>

// Загрузка таблицы
<div className="space-y-2">
  <Skeleton className="h-10 w-full" />
  <Skeleton className="h-10 w-full" />
  <Skeleton className="h-10 w-full" />
</div>
```

---

## 3. Иконки (lucide-react)

### 3.1. Обзор

Проект использует библиотеку `lucide-react` для всех иконок. Это обеспечивает:
- Консистентный стиль
- Легковесность (tree-shaking)
- TypeScript поддержку
- Настраиваемый размер и цвет

### 3.2. Основные иконки

**Навигация:**
```tsx
import {
  Home,           // Главная
  Menu,           // Меню
  ChevronRight,   // Стрелка вправо
  ChevronLeft,    // Стрелка влево
  ArrowLeft,      // Назад
  ArrowRight,     // Вперед
} from 'lucide-react';
```

**Действия:**
```tsx
import {
  Plus,           // Добавить
  Edit,           // Редактировать
  Trash2,         // Удалить
  Save,           // Сохранить
  X,              // Закрыть
  Check,          // Проверить
  Search,          // Поиск
} from 'lucide-react';
```

**Образование:**
```tsx
import {
  GraduationCap,  // Ученики/Образование
  BookOpen,       // Уроки/Книга
  Users,          // Группы/Пользователи
  Award,          // Достижения
  Calendar,       // Календарь/Расписание
  Trophy,         // Рейтинг
} from 'lucide-react';
```

**Интерфейс:**
```tsx
import {
  Settings,      // Настройки
  Bell,          // Уведомления
  User,          // Профиль
  LogOut,        // Выход
  Eye,           // Просмотр
  EyeOff,        // Скрыть
  Filter,        // Фильтры
  MoreHorizontal,// Еще
} from 'lucide-react';
```

### 3.3. Размеры иконок

**Стандартные размеры:**
```tsx
// Маленькие (16px) - для текста, меток
<Icon className="h-4 w-4" />

// Обычные (20px) - для кнопок, карточек
<Icon className="h-5 w-5" />

// Средние (24px) - для заголовков
<Icon className="h-6 w-6" />

// Большие (32px) - для hero секций
<Icon className="h-8 w-8" />
```

**Использование в кнопках:**
```tsx
<Button>
  <Plus className="mr-2 h-4 w-4" />
  Добавить
</Button>
```

**Использование в карточках:**
```tsx
<Card>
  <CardHeader>
    <div className="flex items-center gap-2">
      <BookOpen className="h-5 w-5 text-primary" />
      <CardTitle>Урок</CardTitle>
    </div>
  </CardHeader>
</Card>
```

### 3.4. Цвета иконок

```tsx
// Primary цвет
<Icon className="h-5 w-5 text-primary" />

// Muted цвет
<Icon className="h-5 w-5 text-muted-foreground" />

// Destructive цвет
<Icon className="h-5 w-5 text-destructive" />

// Success цвет
<Icon className="h-5 w-5 text-green-600" />
```

---

## 4. Mobile-First Guidelines

### 4.1. Принципы Mobile-First

1. **Разработка сначала для мобильных**
   - Начинаем с минимального экрана (375px)
   - Постепенно добавляем функциональность для больших экранов

2. **Progressive Enhancement**
   - Базовая функциональность работает на всех устройствах
   - Улучшения добавляются для больших экранов

3. **Touch-Friendly**
   - Минимальный размер кнопок: 44x44px
   - Достаточные отступы между элементами
   - Крупные области для нажатия

### 4.2. Responsive Breakpoints

```typescript
// Tailwind CSS breakpoints
breakpoints: {
  sm: '640px',   // Small tablets
  md: '768px',   // Tablets
  lg: '1024px', // Laptops
  xl: '1280px', // Desktops
  2xl: '1536px',// Large desktops
}
```

**Использование:**
```tsx
// Mobile-first подход
<div className="
  text-sm          // Mobile: 14px
  md:text-base     // Tablet+: 16px
  lg:text-lg       // Desktop+: 18px
">
  Текст
</div>

// Скрытие/показ элементов
<div className="hidden md:block">
  Desktop only
</div>

<div className="block md:hidden">
  Mobile only
</div>
```

### 4.3. Адаптивные компоненты

**Формы:**
```tsx
// Вертикальное расположение на мобильных
<form className="space-y-4 md:space-y-6">
  <div className="space-y-2">
    <Label>Email</Label>
    <Input className="w-full" />
  </div>
</form>
```

**Таблицы:**
```tsx
// Desktop: таблица, Mobile: карточки
<div className="hidden md:block">
  <Table>...</Table>
</div>
<div className="md:hidden space-y-4">
  {data.map(item => (
    <Card key={item.id}>...</Card>
  ))}
</div>
```

**Навигация:**
```tsx
// Desktop: горизонтальное меню
// Mobile: hamburger menu или bottom navigation
<nav className="hidden md:flex">
  {/* Desktop menu */}
</nav>
<Button className="md:hidden" variant="ghost">
  <Menu className="h-6 w-6" />
</Button>
```

### 4.4. Touch Interactions

**Минимальные размеры:**
- Кнопки: минимум 44x44px
- Чекбоксы: минимум 44x44px (включая область нажатия)
- Ссылки: минимум 44px высота
- Иконки в кнопках: минимум 24x24px

**Отступы:**
- Между интерактивными элементами: минимум 8px
- Внутренние отступы кнопок: минимум 12px по горизонтали

**Примеры:**
```tsx
// Touch-friendly кнопка
<Button className="min-h-[44px] min-w-[44px] px-4">
  Нажми меня
</Button>

// Touch-friendly чекбокс
<label className="flex items-center gap-3 min-h-[44px]">
  <Checkbox className="h-5 w-5" />
  <span>Опция</span>
</label>
```

---

## 5. Accessibility (WCAG 2.1 AA)

### 5.1. Цветовой контраст

**Требования:**
- Обычный текст (16px+): минимум 4.5:1
- Крупный текст (18px+ или bold 14px+): минимум 3:1
- Интерактивные элементы: минимум 3:1

**Проверка:**
- Используйте инструменты: WebAIM Contrast Checker, axe DevTools
- Shadcn UI компоненты уже соответствуют требованиям

**Примеры:**
```tsx
// ✅ Правильно - достаточный контраст
<p className="text-foreground">Текст</p>

// ❌ Неправильно - недостаточный контраст
<p className="text-gray-400">Текст</p>
```

### 5.2. Keyboard Navigation

**Требования:**
- Все интерактивные элементы доступны с клавиатуры
- Логический порядок табуляции
- Видимый индикатор фокуса

**Реализация:**
```tsx
// Кнопки автоматически доступны с клавиатуры
<Button>Нажми Enter</Button>

// Кастомные элементы требуют tabIndex
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Кликни или нажми Enter
</div>
```

**Focus стили:**
```tsx
// Shadcn UI автоматически добавляет focus-visible стили
<Button className="focus-visible:ring-2 focus-visible:ring-ring">
  Кнопка
</Button>
```

### 5.3. Screen Reader Support

**ARIA Labels:**
```tsx
// Иконки без текста требуют aria-label
<Button aria-label="Удалить">
  <Trash2 className="h-4 w-4" />
</Button>

// Декоративные изображения
<img src="..." alt="" aria-hidden="true" />

// Информативные изображения
<img src="..." alt="Описание изображения" />
```

**Семантическая разметка:**
```tsx
// ✅ Правильно - семантические теги
<header>
  <nav>
    <ul>
      <li><a href="/">Главная</a></li>
    </ul>
  </nav>
</header>

// ❌ Неправильно - div вместо семантических тегов
<div>
  <div>
    <div>Главная</div>
  </div>
</div>
```

**Формы:**
```tsx
// Связь Label и Input
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    aria-describedby="email-error"
  />
  <p id="email-error" className="text-sm text-destructive">
    Ошибка валидации
  </p>
</div>
```

### 5.4. Дополнительные требования

**Alt текст для изображений:**
```tsx
<Image
  src="/avatar.jpg"
  alt="Аватар пользователя Иван Петров"
  width={64}
  height={64}
/>
```

**Skip Links:**
```tsx
// Пропуск навигации для screen readers
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
>
  Перейти к основному контенту
</a>
```

**Live Regions:**
```tsx
// Для динамического контента
<div role="status" aria-live="polite" aria-atomic="true">
  {loading ? 'Загрузка...' : 'Загружено'}
</div>
```

---

## 6. Анимации и Transitions

### 6.1. Принципы

1. **Subtle (Ненавязчивые)**
   - Анимации должны быть быстрыми и плавными
   - Не отвлекать от контента

2. **Purposeful (Целесообразные)**
   - Анимации должны улучшать UX
   - Показывать изменения состояния

3. **Performant (Производительные)**
   - Использовать CSS transitions вместо JavaScript
   - Анимировать только transform и opacity

### 6.2. Transition Durations

```typescript
durations: {
  fast: '150ms',      // Быстрые взаимодействия
  normal: '200ms',    // Стандартные переходы
  slow: '300ms',      // Медленные переходы
}
```

**Использование:**
```tsx
// Tailwind CSS transitions
<Button className="transition-all duration-200 hover:scale-105">
  Кнопка
</Button>
```

### 6.3. Common Animations

**Hover эффекты:**
```tsx
// Кнопки
<Button className="transition-all hover:scale-105 hover:shadow-lg">
  Навести
</Button>

// Карточки
<Card className="transition-all hover:shadow-lg hover:-translate-y-1">
  Карточка
</Card>
```

**Loading состояния:**
```tsx
// Spinner
<div className="animate-spin">
  <Loader2 className="h-4 w-4" />
</div>

// Skeleton
<Skeleton className="animate-pulse" />
```

**Модальные окна:**
```tsx
// Shadcn UI Dialog автоматически анимируется
<Dialog>
  <DialogContent>
    {/* Fade in + scale animation */}
  </DialogContent>
</Dialog>
```

**Toast уведомления:**
```tsx
// Slide in animation (автоматически в Shadcn UI)
toast({
  title: "Уведомление",
  // Slide in from right
});
```

### 6.4. Reduced Motion

**Уважение к пользовательским настройкам:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Использование:**
```tsx
// Tailwind CSS автоматически уважает prefers-reduced-motion
<div className="transition-all motion-reduce:transition-none">
  Контент
</div>
```

---

## 7. Responsive Breakpoints

### 7.1. Детальные breakpoints

```typescript
breakpoints: {
  sm: '640px',   // Small tablets (портрет)
  md: '768px',   // Tablets (портрет)
  lg: '1024px',  // Tablets (ландшафт) / Laptops
  xl: '1280px',  // Desktops
  2xl: '1536px', // Large desktops
}
```

### 7.2. Стратегии адаптации

**Mobile (< 768px):**
- Вертикальная навигация
- Карточки вместо таблиц
- Полная ширина форм
- Bottom navigation (опционально)
- Hamburger menu

**Tablet (768px - 1023px):**
- Горизонтальная навигация
- Адаптивные таблицы (горизонтальная прокрутка)
- Sidebar сворачивается
- 2 колонки для карточек

**Desktop (≥ 1024px):**
- Полная навигация
- Таблицы в полном формате
- Sidebar всегда видим
- Множественные колонки
- Hover эффекты

### 7.3. Примеры адаптации

**Grid layout:**
```tsx
<div className="
  grid
  grid-cols-1        // Mobile: 1 колонка
  md:grid-cols-2     // Tablet: 2 колонки
  lg:grid-cols-3     // Desktop: 3 колонки
  gap-4
">
  {items.map(item => <Card key={item.id}>...</Card>)}
</div>
```

**Typography:**
```tsx
<h1 className="
  text-2xl          // Mobile: 24px
  md:text-3xl       // Tablet: 30px
  lg:text-4xl       // Desktop: 36px
  font-bold
">
  Заголовок
</h1>
```

**Spacing:**
```tsx
<section className="
  py-8              // Mobile: 32px
  md:py-12          // Tablet: 48px
  lg:py-16          // Desktop: 64px
">
  Контент
</section>
```

---

## 8. Touch Interactions для Mobile

### 8.1. Минимальные размеры

**Интерактивные элементы:**
- Кнопки: минимум 44x44px
- Чекбоксы: минимум 44x44px (включая область)
- Ссылки: минимум 44px высота
- Иконки: минимум 24x24px в кнопках

**Реализация:**
```tsx
// Touch-friendly кнопка
<Button className="min-h-[44px] min-w-[44px]">
  Нажми
</Button>

// Touch-friendly область
<div className="min-h-[44px] flex items-center">
  <Checkbox className="h-5 w-5" />
  <span>Опция</span>
</div>
```

### 8.2. Отступы

**Между элементами:**
- Минимум 8px между интерактивными элементами
- Рекомендуется 12-16px для комфорта

**Внутренние отступы:**
- Кнопки: минимум 12px по горизонтали
- Карточки: минимум 16px внутренние отступы

### 8.3. Жесты

**Swipe (опционально):**
- Swipe для удаления в списках
- Swipe для навигации в календаре

**Реализация:**
```tsx
// Использование библиотеки для жестов (опционально)
import { useSwipeable } from 'react-swipeable';

const handlers = useSwipeable({
  onSwipedLeft: () => handleNext(),
  onSwipedRight: () => handlePrev(),
});

<div {...handlers}>
  Контент
</div>
```

### 8.4. Feedback

**Визуальная обратная связь:**
```tsx
// Active состояние для touch
<Button className="
  active:scale-95
  transition-transform
">
  Нажми
</Button>
```

**Haptic feedback (опционально):**
- Использование Vibration API для тактильной обратной связи
- Только для важных действий

---

## 9. Адаптивный Sidebar для админки

### 9.1. Desktop версия

**Структура:**
```tsx
import { Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar';

<Sidebar className="w-64">
  <SidebarContent>
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <Link href="/grades-list">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Главная
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      {/* Другие пункты меню */}
    </SidebarMenu>
  </SidebarContent>
</Sidebar>
```

**Характеристики:**
- Фиксированная ширина: 256px (w-64)
- Всегда видим на экранах ≥ 1024px
- Вертикальная прокрутка при необходимости

### 9.2. Tablet версия

**Характеристики:**
- Сворачивается в иконку
- При клике открывается overlay
- Ширина: 256px при открытии

### 9.3. Mobile версия

**Использование Sheet (Drawer):**
```tsx
'use client';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useState } from 'react';

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SidebarContent>
          {/* Меню */}
        </SidebarContent>
      </SheetContent>
    </Sheet>
  );
}
```

**Характеристики:**
- Скрыт по умолчанию
- Открывается через hamburger menu
- Slide-in анимация слева
- Overlay при открытии
- Закрывается по клику вне области или по кнопке

### 9.4. Адаптивная реализация

```tsx
'use client';

import { useUIStore } from '@/store/ui-store';

export function AdminSidebar() {
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  
  return (
    <>
      {/* Desktop: постоянный Sidebar */}
      <aside className="hidden lg:block w-64 border-r">
        <SidebarContent />
      </aside>
      
      {/* Mobile: Sheet (drawer) */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
```

---

## 10. Breadcrumbs навигация

### 10.1. Обзор

Breadcrumbs используются на всех страницах админ-панели и в некоторых разделах для преподавателей.

### 10.2. Компонент Shadcn UI

**Базовое использование:**
```tsx
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Главная</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/grades">Группы</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Младшая группа</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### 10.3. Динамические Breadcrumbs

**С использованием usePathname:**
```tsx
'use client';

import { usePathname } from 'next/navigation';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';

const routeLabels: Record<string, string> = {
  'grades-list': 'Главная',
  'teachers-management': 'Преподаватели',
  'pupils-management': 'Ученики',
  'families-management': 'Семьи',
  'school-process-management': 'Учебный процесс',
};

export function AdminBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          const href = '/' + segments.slice(0, index + 1).join('/');
          const label = routeLabels[segment] || segment;
          
          return (
            <BreadcrumbItem key={segment}>
              {isLast ? (
                <BreadcrumbPage>{label}</BreadcrumbPage>
              ) : (
                <>
                  <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                  <BreadcrumbSeparator />
                </>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
```

### 10.4. С иконками

```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">
        <Home className="mr-2 h-4 w-4" />
        Главная
      </BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Текущая страница</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### 10.5. Mobile адаптация

**На мобильных:**
- Скрытие промежуточных элементов (показывать только первый и последний)
- Или горизонтальная прокрутка
- Компактный размер шрифта

```tsx
<Breadcrumb className="overflow-x-auto">
  <BreadcrumbList className="flex-nowrap">
    {/* Breadcrumbs */}
  </BreadcrumbList>
</Breadcrumb>
```

---

## 11. Best Practices

### 11.1. Компонентный подход

- Используйте существующие компоненты Shadcn UI
- Создавайте переиспользуемые компоненты
- Следуйте принципам Atomic Design

### 11.2. Консистентность

- Единый стиль для всех элементов
- Единые отступы и размеры
- Единая цветовая схема

### 11.3. Производительность

- Lazy loading для тяжелых компонентов
- Оптимизация изображений (next/image)
- Минимизация JavaScript

### 11.4. Тестирование

- Тестирование на реальных устройствах
- Проверка accessibility (axe DevTools)
- Проверка производительности (Lighthouse)

---

## 12. Заключение

Данная спецификация обеспечивает:

- ✅ Консистентный дизайн через Shadcn UI
- ✅ Mobile-First подход
- ✅ Accessibility (WCAG 2.1 AA)
- ✅ Производительные анимации
- ✅ Touch-friendly интерфейс
- ✅ Адаптивная навигация

**Следующие шаги:**
1. Настройка Shadcn UI компонентов
2. Создание кастомных компонентов на основе спецификации
3. Тестирование на различных устройствах
4. Проверка accessibility

---

**Версия:** 1.0  
**Последнее обновление:** 11 ноября 2025  
**Автор:** AI Senior UX/UI Designer & Information Architect

