# AmplifyData и лимиты запросов к AppSync

## Обзор

Документация по использованию встроенной библиотеки `amplifyData` в AWS Amplify Gen 1, лимитам запросов к AWS AppSync, и возможностям оптимизации через SSR/SSG механизмы.

## AWS Amplify Gen 1 vs Gen 2

### Текущая реализация (Gen 1)

Проект использует **AWS Amplify Gen 1** с кастомной оберткой `amplifyData`:

```typescript
// src/lib/db/amplify.ts
export const amplifyData = {
  async create<T extends ModelName>(model: T, input: Record<string, unknown>): Promise<unknown>
  async get<T extends ModelName>(model: T, id: string): Promise<unknown | null>
  async list<T extends ModelName>(model: T, filter?: Record<string, unknown>, ...): Promise<{ items: unknown[]; nextToken?: string | null } | null>
  async update<T extends ModelName>(model: T, input: Record<string, unknown>): Promise<unknown>
  async delete<T extends ModelName>(model: T, id: string): Promise<unknown>
}
```

**Особенности**:
- Использует `generateServerClientUsingCookies` из `@aws-amplify/adapter-nextjs/api`
- Работает через GraphQL запросы к AWS AppSync
- Поддерживает SSR через cookies для аутентификации
- Кастомная обертка над GraphQL клиентом

### Amplify Gen 2 (альтернатива)

**Amplify Gen 2** предоставляет встроенную библиотеку `amplifyData`:

```typescript
// Gen 2 подход
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/data';
import { type Schema } from '@/amplify/data/resource';

export const cookieBasedClient = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
});

// Использование
const { data: todos, errors } = await cookieBasedClient.models.Todo.list();
```

**Преимущества Gen 2**:
- ✅ Встроенная типизация через TypeScript
- ✅ Автоматическая генерация типов из схемы
- ✅ Более простой API
- ✅ Лучшая поддержка SSR/SSG

**Недостатки Gen 2**:
- ⚠️ Требует миграции с Gen 1 на Gen 2
- ⚠️ Изменение структуры проекта
- ⚠️ Потенциальные breaking changes

## Лимиты AWS AppSync

### Общие лимиты

AWS AppSync имеет следующие лимиты на количество запросов:

| Тип лимита | Значение | Описание |
|------------|----------|----------|
| **Requests Per Second (RPS)** | ~1000 | Максимальное количество запросов в секунду для бесплатного tier |
| **Burst Capacity** | ~2000 | Кратковременное превышение RPS (burst) |
| **Concurrent Connections** | 1000 | Максимальное количество одновременных подключений |
| **Query Complexity** | 1000 | Максимальная сложность GraphQL запроса |

### Лимиты по типам операций

| Операция | Лимит | Примечание |
|----------|-------|------------|
| **Query** | 1000 RPS | Чтение данных |
| **Mutation** | 1000 RPS | Изменение данных |
| **Subscription** | 1000 RPS | Подписки в реальном времени |

### Ошибки при превышении лимита

При превышении лимита AppSync возвращает ошибку:

```typescript
{
  error: {
    message: "TooManyRequestsException: Rate exceeded",
    errorType: "TooManyRequestsException",
    errorCode: "429"
  }
}
```

### Увеличение лимитов

Для увеличения лимитов необходимо:
1. Обратиться в AWS Support
2. Обосновать необходимость увеличения
3. Возможны дополнительные расходы

## Лимиты для текущей реализации

### Текущая архитектура

Проект использует:
- **AWS Amplify Gen 1** с кастомной оберткой
- **GraphQL запросы** через `executeGraphQL`
- **Параллельные запросы** через `Promise.all`
- **SSR** через cookies

### Проблемы с лимитами

**Для страницы группы** (`/grades/[gradeId]`):

1. **Количество запросов**:
   - Базовая информация группы: ~5 запросов
   - Для каждого урока: 2-4 запроса (homework checks, golden verses, golden verse details)
   - Для группы с 20 уроками: ~85-100 запросов

2. **Параллельное выполнение**:
   - Все запросы выполняются через `Promise.all`
   - Может превысить лимит 1000 RPS при большом количестве параллельных запросов
   - Особенно проблематично при нескольких одновременных пользователях

3. **Отсутствие rate limiting**:
   - Нет ограничения на количество параллельных запросов
   - Нет retry логики для обработки ошибок "Rate exceeded"
   - Нет батчинга запросов

### Рекомендации по оптимизации

1. **Ограничение параллелизма**:
   - Использовать `p-limit` для ограничения количества параллельных запросов (5-10)
   - Это предотвратит превышение лимита

2. **Батчинг запросов**:
   - Группировать несколько запросов в один GraphQL запрос
   - Использовать GraphQL aliases для множественных запросов
   - Это значительно снизит количество запросов

3. **Кэширование**:
   - Кэшировать часто запрашиваемые данные (например, golden verses)
   - Использовать Next.js cache для статических данных
   - Это уменьшит нагрузку на AppSync

4. **Retry логика**:
   - Добавить автоматический retry для ошибок "Rate exceeded"
   - Использовать экспоненциальную задержку
   - Это улучшит надежность системы

## SSR/SSG механизмы

### Server-Side Rendering (SSR)

**Текущая реализация**: Используется SSR через Server Actions

```typescript
// src/app/(private)/grades/[gradeId]/page.tsx
export const dynamic = 'force-dynamic'; // Принудительная динамическая генерация

export default async function GradeDetailPage({ params }) {
  const gradeResult = await getGradeWithFullDataAction({ id: gradeId });
  // ...
}
```

**Особенности**:
- Страница генерируется на сервере при каждом запросе
- Данные всегда актуальные
- Требует выполнения всех запросов при каждом запросе
- Может быть медленным при большом количестве данных

### Static Site Generation (SSG)

**Возможная оптимизация**: Использовать SSG с ревалидацией

```typescript
// Вариант с SSG
export const revalidate = 3600; // Ревалидация каждый час

export default async function GradeDetailPage({ params }) {
  const gradeResult = await getGradeWithFullDataAction({ id: gradeId });
  // ...
}
```

**Преимущества**:
- ✅ Страница генерируется один раз и кэшируется
- ✅ Быстрая загрузка для пользователей
- ✅ Меньше нагрузки на AppSync
- ✅ Можно использовать ISR (Incremental Static Regeneration)

**Недостатки**:
- ⚠️ Данные могут быть не актуальными (зависит от revalidate)
- ⚠️ Не подходит для часто изменяющихся данных
- ⚠️ Требует настройки ревалидации

### Incremental Static Regeneration (ISR)

**Оптимальный вариант для страницы группы**:

```typescript
export const revalidate = 300; // Ревалидация каждые 5 минут

export default async function GradeDetailPage({ params }) {
  const gradeResult = await getGradeWithFullDataAction({ id: gradeId });
  // ...
}
```

**Преимущества**:
- ✅ Баланс между актуальностью данных и производительностью
- ✅ Страница генерируется один раз и обновляется периодически
- ✅ Меньше нагрузки на AppSync
- ✅ Быстрая загрузка для пользователей

**Недостатки**:
- ⚠️ Данные могут быть не актуальными в течение периода revalidate
- ⚠️ Требует настройки под конкретные требования

## Рекомендации по использованию amplifyData

### Текущая реализация (Gen 1)

**Рекомендуется**:
1. Сохранить текущую архитектуру для MVP
2. Добавить ограничение параллелизма
3. Добавить retry логику
4. Оптимизировать количество запросов через батчинг

### Миграция на Gen 2 (будущее)

**Рассмотреть миграцию**, если:
- Требуется лучшая типизация
- Нужна более простая работа с данными
- Планируется расширение функциональности

**Шаги миграции**:
1. Изучить различия между Gen 1 и Gen 2
2. Создать план миграции
3. Протестировать на dev окружении
4. Постепенно мигрировать компоненты

## Мониторинг использования лимитов

### Метрики для отслеживания

1. **Количество запросов в секунду**:
   - Отслеживать через CloudWatch
   - Настроить алерты при приближении к лимиту

2. **Ошибки "Rate exceeded"**:
   - Логировать все ошибки превышения лимита
   - Отслеживать частоту возникновения

3. **Время выполнения запросов**:
   - Мониторить среднее время выполнения
   - Выявлять медленные запросы

4. **Количество retry попыток**:
   - Отслеживать количество retry
   - Оптимизировать при частых retry

### Настройка алертов

```typescript
// Пример логирования для мониторинга
console.warn('Rate limit warning', {
  requestsPerSecond: currentRPS,
  limit: 1000,
  timestamp: new Date().toISOString()
});
```

## Заключение

1. **Текущая реализация** использует Gen 1 с кастомной оберткой
2. **Лимиты AppSync** составляют ~1000 RPS для бесплатного tier
3. **Проблема**: Параллельные запросы могут превысить лимит
4. **Решение**: Ограничение параллелизма + retry логика
5. **Оптимизация**: Рассмотреть SSG/ISR для снижения нагрузки

## Связанные документы

- [Issue: Ошибки аутентификации и превышения лимита](./GRADE_PAGE_AUTHENTICATION_AND_RATE_LIMIT_ERRORS.md)
- [Текущая реализация получения данных](./GRADE_PAGE_DATA_FETCHING.md)
- [AWS AppSync Limits](https://docs.aws.amazon.com/appsync/latest/devguide/limits.html)

