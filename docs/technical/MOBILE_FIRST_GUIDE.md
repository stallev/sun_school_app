# Mobile-First разработка - Sunday School App

## Версия документа: 1.0
**Дата создания:** 11 ноября 2025  
**Проект:** Sunday School App (Приложение для управления воскресной школой)  
**Технологии:** Next.js 16, Tailwind CSS, React 19  
**Подход:** Mobile-First Design, Responsive Design, Touch-Friendly UI

---

## 1. Принципы Mobile-First разработки

### 1.1. Что такое Mobile-First?

**Mobile-First** - это подход к разработке, при котором:
1. **Сначала разрабатывается мобильная версия** (начиная с минимального экрана 375px)
2. **Затем добавляется функциональность для больших экранов** (tablet, desktop)
3. **Мобильная версия является приоритетной** и должна работать идеально

### 1.2. Почему Mobile-First?

**Статистика использования:**
- Более 60% пользователей используют мобильные устройства
- Мобильный трафик растет быстрее десктопного
- Google использует Mobile-First индексацию

**Преимущества подхода:**
- ✅ Лучшая производительность на мобильных
- ✅ Улучшенный UX на всех устройствах
- ✅ Меньше кода и лучшая оптимизация
- ✅ Лучший SEO

### 1.3. Основные принципы

1. **Начинайте с мобильного** - проектируйте сначала для маленького экрана
2. **Progressive Enhancement** - добавляйте функции для больших экранов
3. **Touch-Friendly** - все элементы должны быть удобны для касания
4. **Performance First** - оптимизируйте для медленных сетей
5. **Content First** - контент важнее дизайна

---

## 2. Responsive Breakpoints

### 2.1. Tailwind CSS Breakpoints

**Стандартные breakpoints в Tailwind CSS:**

```typescript
breakpoints: {
  sm: '640px',   // Small tablets (портретная ориентация)
  md: '768px',   // Tablets (альбомная ориентация)
  lg: '1024px',  // Laptops
  xl: '1280px',  // Desktops
  '2xl': '1536px', // Large desktops
}
```

**Mobile-First подход:**
- Базовые стили применяются для мобильных (до 640px)
- `sm:` - для экранов от 640px
- `md:` - для экранов от 768px
- `lg:` - для экранов от 1024px
- И так далее

### 2.2. Использование Breakpoints

**Правильный подход (Mobile-First):**
```typescript
// ✅ ПРАВИЛЬНО: Начинаем с мобильного
<div className="
  grid 
  grid-cols-1        // Мобильный: 1 колонка
  sm:grid-cols-2     // Tablet: 2 колонки
  lg:grid-cols-3     // Desktop: 3 колонки
  gap-4
">
  {items.map(item => <ItemCard key={item.id} item={item} />)}
</div>
```

**Неправильный подход (Desktop-First):**
```typescript
// ❌ НЕПРАВИЛЬНО: Начинаем с десктопа
<div className="
  grid 
  grid-cols-3        // Desktop: 3 колонки
  md:grid-cols-2     // Tablet: 2 колонки
  sm:grid-cols-1     // Mobile: 1 колонка
  gap-4
">
  {items.map(item => <ItemCard key={item.id} item={item} />)}
</div>
```

### 2.3. Кастомные Breakpoints

**Если нужны дополнительные breakpoints:**

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      screens: {
        'xs': '375px',   // Extra small phones
        'sm': '640px',   // Small tablets
        'md': '768px',   // Tablets
        'lg': '1024px',  // Laptops
        'xl': '1280px',  // Desktops
        '2xl': '1536px', // Large desktops
      },
    },
  },
}
```

---

## 3. Touch Interactions

### 3.1. Размеры элементов

**Минимальные размеры для touch-элементов:**

```typescript
// ✅ ПРАВИЛЬНО: Минимум 44x44px для кликабельных элементов
<button className="
  h-11        // 44px высота
  px-4        // Отступы
  min-w-[44px] // Минимум 44px ширина
">
  Кнопка
</button>

// ❌ НЕПРАВИЛЬНО: Слишком маленькая кнопка
<button className="h-6 px-2">Кнопка</button>
```

**Рекомендуемые размеры:**
- Кнопки: минимум 44x44px (лучше 48x48px)
- Иконки: минимум 24x24px (лучше 32x32px)
- Отступы между элементами: минимум 8px (лучше 16px)

### 3.2. Touch Targets

**Правильное размещение touch-элементов:**

```typescript
// ✅ ПРАВИЛЬНО: Достаточные отступы
<div className="flex gap-4">
  <Button>Сохранить</Button>
  <Button variant="outline">Отменить</Button>
</div>

// ❌ НЕПРАВИЛЬНО: Элементы слишком близко
<div className="flex gap-1">
  <Button>Сохранить</Button>
  <Button variant="outline">Отменить</Button>
</div>
```

### 3.3. Touch Actions

**CSS свойство `touch-action`:**

```typescript
// Для элементов с прокруткой
<div className="overflow-auto touch-pan-y">
  {/* Контент */}
</div>

// Для элементов с зумом
<div className="touch-zoom">
  {/* Контент */}
</div>

// Отключение стандартных жестов
<button className="touch-none">
  Кнопка
</button>
```

### 3.4. Swipe Gestures

**Для swipe жестов используйте библиотеки:**

```typescript
// Пример с react-swipeable
import { useSwipeable } from 'react-swipeable';

export const SwipeableCard = ({ children }: { children: React.ReactNode }) => {
  const handlers = useSwipeable({
    onSwipedLeft: () => console.log('Swipe left'),
    onSwipedRight: () => console.log('Swipe right'),
    trackMouse: true,
  });

  return (
    <div {...handlers} className="touch-pan-y">
      {children}
    </div>
  );
};
```

---

## 4. Mobile Navigation Patterns

### 4.1. Bottom Navigation

**Для мобильных устройств используйте bottom navigation:**

```typescript
// src/components/organisms/BottomNavigation/BottomNavigation.tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, BookOpen, Users, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/grades', label: 'Группы', icon: Home },
  { href: '/lessons', label: 'Уроки', icon: BookOpen },
  { href: '/pupils', label: 'Ученики', icon: Users },
  { href: '/settings', label: 'Настройки', icon: Settings },
];

/**
 * Bottom Navigation для мобильных устройств
 */
export const BottomNavigation = () => {
  const pathname = usePathname();

  return (
    <nav className="
      fixed 
      bottom-0 
      left-0 
      right-0 
      z-50 
      bg-card 
      border-t 
      md:hidden        // Скрыто на tablet и desktop
      flex 
      justify-around 
      items-center 
      h-16
      safe-area-inset-bottom
    ">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center gap-1 px-4 py-2 min-w-[60px]',
              isActive
                ? 'text-primary'
                : 'text-muted-foreground'
            )}
          >
            <Icon className="h-6 w-6" />
            <span className="text-xs">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
```

### 4.2. Hamburger Menu

**Для sidebar навигации:**

```typescript
// src/components/organisms/NavigationSidebar/NavigationSidebar.tsx
'use client';

import { useUIStore } from '@/store/ui-store';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { cn } from '@/lib/utils';

export const NavigationSidebar = () => {
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X /> : <Menu />}
      </Button>

      {/* Overlay для мобильных */}
      {sidebarOpen && (
        <div
          className="
            fixed 
            inset-0 
            bg-black/50 
            z-40 
            md:hidden
          "
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-64 bg-card border-r transition-transform duration-300',
          // Desktop: всегда видим
          'lg:translate-x-0',
          // Mobile: скрыт по умолчанию
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Sidebar content */}
      </aside>
    </>
  );
};
```

### 4.3. Drawer Pattern

**Для модальных панелей:**

```typescript
// src/components/organisms/Drawer/Drawer.tsx
'use client';

import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { Button } from '@/components/atoms/Button';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  position?: 'left' | 'right' | 'bottom';
}

export const Drawer = ({ 
  isOpen, 
  onClose, 
  children, 
  position = 'right' 
}: DrawerProps) => {
  const positionClasses = {
    left: 'left-0 top-0 h-full',
    right: 'right-0 top-0 h-full',
    bottom: 'bottom-0 left-0 right-0 h-[80vh]',
  };

  const transformClasses = {
    left: isOpen ? 'translate-x-0' : '-translate-x-full',
    right: isOpen ? 'translate-x-0' : 'translate-x-full',
    bottom: isOpen ? 'translate-y-0' : 'translate-y-full',
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          'fixed z-50 bg-card border transition-transform duration-300',
          positionClasses[position],
          transformClasses[position]
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2>Заголовок</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100%-64px)]">
          {children}
        </div>
      </div>
    </>
  );
};
```

---

## 5. Performance для Mobile

### 5.1. Оптимизация изображений

**Используйте Next.js Image:**

```typescript
import Image from 'next/image';

// ✅ ПРАВИЛЬНО: Next.js Image с оптимизацией
<Image
  src="/avatar.jpg"
  alt="Avatar"
  width={64}
  height={64}
  className="rounded-full"
  loading="lazy"
  sizes="(max-width: 768px) 64px, 128px"
/>

// ❌ НЕПРАВИЛЬНО: Обычный img
<img src="/avatar.jpg" alt="Avatar" className="w-16 h-16" />
```

### 5.2. Lazy Loading

**Используйте lazy loading для тяжелых компонентов:**

```typescript
import { lazy, Suspense } from 'react';

// Lazy load тяжелого компонента
const HeavyComponent = lazy(() => import('./HeavyComponent'));

export const Page = () => {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <HeavyComponent />
    </Suspense>
  );
};
```

### 5.3. Code Splitting

**Next.js автоматически делает code splitting, но можно оптимизировать:**

```typescript
// Динамический импорт для Client Components
'use client';

import dynamic from 'next/dynamic';

// Загрузка только на клиенте
const ClientOnlyComponent = dynamic(
  () => import('./ClientOnlyComponent'),
  { ssr: false }
);

export const Page = () => {
  return (
    <div>
      <ClientOnlyComponent />
    </div>
  );
};
```

### 5.4. Оптимизация шрифтов

**Используйте next/font:**

```typescript
// src/app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  display: 'swap', // Для лучшей производительности
  variable: '--font-inter',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
```

### 5.5. Минимизация JavaScript

**Используйте Server Components для уменьшения bundle:**

```typescript
// ✅ ПРАВИЛЬНО: Server Component (не отправляется в bundle)
export default async function LessonPage({ params }: { params: { id: string } }) {
  const lesson = await getLesson(params.id);
  return <LessonContent lesson={lesson} />;
}

// ❌ НЕПРАВИЛЬНО: Client Component (отправляется в bundle)
'use client';
export default function LessonPage({ params }: { params: { id: string } }) {
  const [lesson, setLesson] = useState(null);
  useEffect(() => {
    fetchLesson(params.id).then(setLesson);
  }, [params.id]);
  return <LessonContent lesson={lesson} />;
}
```

---

## 6. Mobile-Specific Features

### 6.1. Safe Area Insets

**Для поддержки notch и безопасных зон:**

```typescript
// Используйте CSS переменные для safe area
<div className="
  pb-safe-bottom    // Отступ снизу для safe area
  pt-safe-top      // Отступ сверху для safe area
  pl-safe-left     // Отступ слева для safe area
  pr-safe-right    // Отступ справа для safe area
">
  Контент
</div>

// Или через Tailwind config
// tailwind.config.ts
export default {
  theme: {
    extend: {
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
    },
  },
}
```

### 6.2. Viewport Meta Tag

**Правильная настройка viewport:**

```typescript
// src/app/layout.tsx
export const metadata = {
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
};
```

### 6.3. PWA Support (опционально)

**Для превращения в Progressive Web App:**

```typescript
// src/app/manifest.ts
import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Sunday School App',
    short_name: 'SS App',
    description: 'Приложение для управления воскресной школой',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
```

### 6.4. Mobile Keyboard Handling

**Обработка виртуальной клавиатуры:**

```typescript
'use client';

import { useEffect, useState } from 'react';

export const useKeyboardHeight = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      const windowHeight = window.innerHeight;
      setKeyboardHeight(windowHeight - viewportHeight);
    };

    window.visualViewport?.addEventListener('resize', handleResize);
    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize);
    };
  }, []);

  return keyboardHeight;
};

// Использование
export const FormWithKeyboard = () => {
  const keyboardHeight = useKeyboardHeight();

  return (
    <div style={{ paddingBottom: `${keyboardHeight}px` }}>
      <input type="text" />
    </div>
  );
};
```

---

## 7. Testing на Mobile устройствах

### 7.1. Chrome DevTools

**Использование Device Toolbar:**

1. Откройте Chrome DevTools (F12)
2. Включите Device Toolbar (Ctrl+Shift+M)
3. Выберите устройство или создайте кастомное
4. Тестируйте на разных размерах экрана

### 7.2. Responsive Design Mode

**Проверка на разных breakpoints:**

```typescript
// Создайте утилиту для тестирования breakpoints
'use client';

import { useEffect, useState } from 'react';

export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<string>('');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 640) setBreakpoint('mobile');
      else if (width < 768) setBreakpoint('sm');
      else if (width < 1024) setBreakpoint('md');
      else if (width < 1280) setBreakpoint('lg');
      else setBreakpoint('xl');
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
};

// Использование
export const ResponsiveComponent = () => {
  const breakpoint = useBreakpoint();

  return (
    <div>
      <p>Текущий breakpoint: {breakpoint}</p>
    </div>
  );
};
```

### 7.3. Real Device Testing

**Тестирование на реальных устройствах:**

1. **Используйте ngrok или подобные сервисы** для доступа к localhost
2. **Тестируйте на разных устройствах:**
   - iPhone (разные модели)
   - Android (разные модели)
   - Планшеты
3. **Проверяйте производительность:**
   - Network throttling (3G, 4G)
   - CPU throttling
   - Memory usage

### 7.4. Automated Testing

**Используйте Playwright для E2E тестов:**

```typescript
// tests/mobile.spec.ts
import { test, expect, devices } from '@playwright/test';

test.describe('Mobile Tests', () => {
  test.use({
    ...devices['iPhone 13'],
  });

  test('should display mobile navigation', async ({ page }) => {
    await page.goto('/');
    const bottomNav = page.locator('[data-testid="bottom-navigation"]');
    await expect(bottomNav).toBeVisible();
  });

  test('should open sidebar on menu click', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="menu-button"]');
    const sidebar = page.locator('[data-testid="sidebar"]');
    await expect(sidebar).toBeVisible();
  });
});
```

---

## 8. Best Practices

### 8.1. Чек-лист Mobile-First разработки

**При создании компонента:**

- [ ] Компонент работает на экране 375px
- [ ] Все touch-элементы минимум 44x44px
- [ ] Достаточные отступы между элементами (минимум 8px)
- [ ] Текст читаем без зума (минимум 16px для body)
- [ ] Формы удобны для заполнения на мобильном
- [ ] Навигация доступна на мобильном
- [ ] Изображения оптимизированы (Next.js Image)
- [ ] Нет горизонтального скролла
- [ ] Протестировано на реальном устройстве

### 8.2. Правила работы с Tailwind

**Mobile-First классы:**

```typescript
// ✅ ПРАВИЛЬНО: Начинаем с мобильного
<div className="
  p-4           // Mobile: padding 16px
  md:p-6        // Tablet: padding 24px
  lg:p-8        // Desktop: padding 32px
  text-sm       // Mobile: маленький текст
  md:text-base  // Tablet: обычный текст
  lg:text-lg    // Desktop: большой текст
">
  Контент
</div>

// ❌ НЕПРАВИЛЬНО: Desktop-First
<div className="
  p-8           // Desktop: padding 32px
  md:p-6        // Tablet: padding 24px
  sm:p-4        // Mobile: padding 16px
">
  Контент
</div>
```

### 8.3. Оптимизация для медленных сетей

**Используйте:**

1. **Lazy loading** для изображений и компонентов
2. **Skeleton loaders** вместо спиннеров
3. **Progressive enhancement** - базовая функциональность работает без JS
4. **Минимизация запросов** - объединяйте данные где возможно
5. **Кеширование** - используйте Next.js кеширование

---

## 9. Примеры для проекта

### 9.1. Адаптивная таблица уроков

```typescript
// src/components/organisms/LessonList/LessonList.tsx
import { Lesson } from '@prisma/client';
import { LessonCard } from '@/components/molecules/LessonCard';

interface LessonListProps {
  lessons: Lesson[];
}

export const LessonList = ({ lessons }: LessonListProps) => {
  return (
    <div className="space-y-4">
      {/* Mobile: список карточек */}
      <div className="
        flex 
        flex-col 
        gap-4
        md:hidden
      ">
        {lessons.map(lesson => (
          <LessonCard key={lesson.id} lesson={lesson} />
        ))}
      </div>

      {/* Desktop: таблица */}
      <div className="
        hidden
        md:block
        overflow-x-auto
      ">
        <table className="w-full">
          <thead>
            <tr>
              <th>Название</th>
              <th>Дата</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map(lesson => (
              <tr key={lesson.id}>
                <td>{lesson.title}</td>
                <td>{formatDate(lesson.date)}</td>
                <td>{lesson.isCompleted ? 'Завершен' : 'Активен'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
```

### 9.2. Адаптивная форма

```typescript
// src/components/organisms/LessonForm/LessonForm.tsx
'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/atoms/Button';
import { Label } from '@/components/ui/label';

export const LessonForm = () => {
  return (
    <form className="
      space-y-4
      p-4          // Mobile: маленькие отступы
      md:p-6       // Tablet: средние отступы
      lg:p-8       // Desktop: большие отступы
    ">
      <div className="space-y-2">
        <Label htmlFor="title">Название урока</Label>
        <Input
          id="title"
          name="title"
          className="
            w-full
            text-base      // Mobile: читаемый размер
            md:text-lg     // Desktop: больше
          "
          placeholder="Введите название урока"
        />
      </div>

      <div className="
        flex
        flex-col      // Mobile: вертикально
        gap-2
        sm:flex-row   // Tablet+: горизонтально
        sm:gap-4
      ">
        <Button
          type="submit"
          className="
            w-full      // Mobile: полная ширина
            sm:w-auto   // Tablet+: авто ширина
            h-11        // Минимум 44px
          "
        >
          Создать урок
        </Button>
        <Button
          type="button"
          variant="outline"
          className="
            w-full
            sm:w-auto
            h-11
          "
        >
          Отменить
        </Button>
      </div>
    </form>
  );
};
```

### 9.3. Адаптивный календарь

```typescript
// src/components/organisms/ScheduleCalendar/ScheduleCalendar.tsx
'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';

export const ScheduleCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="
      w-full
      max-w-sm      // Mobile: ограниченная ширина
      mx-auto
      md:max-w-md   // Tablet: больше
      lg:max-w-lg   // Desktop: еще больше
    ">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="
          rounded-md
          border
          p-4
        "
      />
    </div>
  );
};
```

---

## 10. Troubleshooting

### 10.1. Проблема: Горизонтальный скролл

**Решение:**
```typescript
// ✅ Добавьте overflow-x-hidden на body
// src/app/globals.css
body {
  overflow-x: hidden;
}

// Или используйте контейнер
<div className="overflow-x-hidden">
  {/* Контент */}
</div>
```

### 10.2. Проблема: Элементы слишком маленькие для touch

**Решение:**
```typescript
// ✅ Увеличьте размеры
<button className="
  min-h-[44px]    // Минимум 44px
  min-w-[44px]
  px-4
  py-2
">
  Кнопка
</button>
```

### 10.3. Проблема: Клавиатура перекрывает input

**Решение:**
```typescript
// ✅ Используйте scrollIntoView
const inputRef = useRef<HTMLInputElement>(null);

const handleFocus = () => {
  setTimeout(() => {
    inputRef.current?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
  }, 300);
};

<input
  ref={inputRef}
  onFocus={handleFocus}
/>
```

---

## 11. Ссылки и ресурсы

- [Mobile-First Design](https://www.lukew.com/ff/entry.asp?933)
- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Touch Target Sizes](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Web.dev Mobile-Friendly](https://web.dev/mobile-friendly/)
- [Chrome DevTools Device Mode](https://developer.chrome.com/docs/devtools/device-mode/)

---

**Последнее обновление:** 11 ноября 2025  
**Автор:** AI Senior Architect & Documentation Engineer

