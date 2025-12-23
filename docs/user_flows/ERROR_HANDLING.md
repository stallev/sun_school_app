# Error Handling (Обработка ошибок) - Sunday School App

## Версия документа: 1.0
**Дата создания:** 23 декабря 2025  
**Последнее обновление:** 23 декабря 2025  
**Проект:** Sunday School App  
**Технологии:** Next.js 15.5.9, React 19, AWS Amplify Gen 1, AWS AppSync, AWS Cognito, Zod, Shadcn UI  
**Целевая аудитория:** Frontend Developers, Backend Developers, QA Engineers

> [!NOTE]
> Документация основана на актуальных источниках:
> - Next.js 15 App Router — официальная документация
> - AWS Amplify Gen 1 — best practices
> - AWS Cognito — error codes и обработка
> - Zod — validation error handling
> - React 19 — Error Boundaries

---

## 1. Обзор

Данный документ описывает комплексную стратегию обработки ошибок в Sunday School App. Правильная обработка ошибок критически важна для обеспечения надежности приложения, хорошего пользовательского опыта и упрощения отладки проблем в production.

### 1.1. Философия обработки ошибок

**Принципы:**

1. **Пользователь всегда должен понимать, что произошло** — ошибки должны быть понятными и информативными
2. **Ошибки должны обрабатываться на соответствующем уровне** — клиентские ошибки в UI, серверные в Server Actions
3. **Все ошибки должны логироваться** — для отладки и мониторинга
4. **Graceful degradation** — приложение должно продолжать работать даже при частичных сбоях
5. **Типобезопасность** — использование TypeScript и discriminated unions для безопасной обработки ошибок

### 1.2. Структура документа

- **Раздел 2:** Типы ошибок — классификация всех типов ошибок в приложении
- **Раздел 3:** Обработка ошибок в Server Actions — discriminated unions, типизированные ошибки
- **Раздел 4:** Ошибки валидации — Zod validation errors, форматирование
- **Раздел 5:** Ошибки аутентификации — Cognito error codes, обработка в UI
- **Раздел 6:** Ошибки авторизации — 403, проверка прав доступа
- **Раздел 7:** Ошибки GraphQL/AppSync — обработка ошибок amplifyData
- **Раздел 8:** Ошибки сети — offline detection, retry logic
- **Раздел 9:** Ошибки в компонентах — React Error Boundaries, глобальные обработчики
- **Раздел 10:** Пустые состояния — Empty States компоненты
- **Раздел 11:** Логирование ошибок — стратегия логирования, отладка
- **Раздел 12:** Примеры кода — практические примеры для каждого типа ошибок

---

## 2. Типы ошибок

### 2.1. Классификация ошибок

Ошибки в приложении можно классифицировать по нескольким критериям:

#### По источнику:

1. **Клиентские ошибки** — ошибки валидации, ошибки ввода пользователя
2. **Серверные ошибки** — ошибки Server Actions, ошибки базы данных
3. **Сетевые ошибки** — потеря соединения, таймауты
4. **Ошибки инфраструктуры** — ошибки AWS (Cognito, AppSync, DynamoDB)

#### По критичности:

1. **Критические ошибки** — блокируют работу приложения (например, ошибка аутентификации)
2. **Важные ошибки** — блокируют конкретную операцию (например, ошибка создания урока)
3. **Предупреждения** — не блокируют работу, но требуют внимания (например, валидационные ошибки)

#### По типу обработки:

1. **Ошибки валидации** — обрабатываются на клиенте и сервере
2. **Ошибки аутентификации** — обрабатываются в middleware и UI
3. **Ошибки авторизации** — обрабатываются в Server Actions
4. **Ошибки бизнес-логики** — обрабатываются в Server Actions
5. **Технические ошибки** — обрабатываются в Error Boundaries

### 2.2. Матрица типов ошибок

| Тип ошибки | Источник | Критичность | Обработка | UI отображение |
|------------|----------|-------------|-----------|----------------|
| Валидация | Клиент/Сервер | Предупреждение | Zod + React Hook Form | Поля формы + Toast |
| Аутентификация | Cognito | Критическая | Middleware + UI | Toast + Redirect |
| Авторизация | Server Action | Важная | Server Action | Toast |
| GraphQL/AppSync | AppSync | Важная | Data Access Layer | Toast |
| Сеть | Браузер | Важная | Offline Detection | Toast + Retry |
| Компонент | React | Критическая | Error Boundary | Error Page |

---

## 3. Обработка ошибок в Server Actions

### 3.1. Discriminated Unions

Все Server Actions возвращают **discriminated union** для типобезопасной обработки ошибок:

```typescript
// Типы ответов
type SuccessResponse<T> = {
  success: true
  data: T
  message?: string // Опциональное сообщение для пользователя
}

type ErrorResponse = {
  success: false
  error: string // Понятное сообщение для пользователя
  fieldErrors?: Record<string, string[]> // Ошибки валидации по полям
}

type ActionResponse<T> = SuccessResponse<T> | ErrorResponse
```

### 3.2. Пример Server Action с обработкой ошибок

```typescript
// actions/lessons.ts
'use server'

import { z } from 'zod'
import { getCurrentUser } from '@/lib/auth/cognito'
import { amplifyData } from '@/lib/db/amplify'
import { CreateLessonSchema } from '@/lib/validation/lessons'

export async function createLesson(
  input: z.infer<typeof CreateLessonSchema>
): Promise<ActionResponse<Lesson>> {
  try {
    // 1. Проверка аутентификации
    const user = await getCurrentUser()
    if (!user) {
      return {
        success: false,
        error: 'Необходима авторизация для создания урока',
      }
    }

    // 2. Валидация входных данных
    const validationResult = CreateLessonSchema.safeParse(input)
    if (!validationResult.success) {
      return {
        success: false,
        error: 'Ошибка валидации данных',
        fieldErrors: validationResult.error.flatten().fieldErrors,
      }
    }

    // 3. Проверка прав доступа
    const hasAccess = await checkTeacherAccess(user.id, validationResult.data.gradeId)
    if (!hasAccess) {
      return {
        success: false,
        error: 'Недостаточно прав для создания урока в этой группе',
      }
    }

    // 4. Бизнес-логика (проверка активного года)
    const activeYear = await getActiveAcademicYear(validationResult.data.gradeId)
    if (!activeYear) {
      return {
        success: false,
        error: 'Для создания урока необходимо наличие активного учебного года. Обратитесь к администратору.',
      }
    }

    // 5. Выполнение операции
    const lesson = await amplifyData.create('Lesson', {
      ...validationResult.data,
      academicYearId: activeYear.id,
    })

    // 6. Успешный ответ
    return {
      success: true,
      data: lesson,
      message: 'Урок успешно создан',
    }
  } catch (error) {
    // 7. Обработка неожиданных ошибок
    console.error('Error creating lesson:', error)
    
    // Проверка типа ошибки
    if (error instanceof Error) {
      // GraphQL ошибки
      if (error.message.includes('GraphQL')) {
        return {
          success: false,
          error: 'Ошибка при сохранении урока. Попробуйте позже.',
        }
      }
      
      // Cognito ошибки
      if (error.message.includes('NotAuthorizedException')) {
        return {
          success: false,
          error: 'Сессия истекла. Пожалуйста, войдите снова.',
        }
      }
    }

    // Общая ошибка
    return {
      success: false,
      error: 'Произошла ошибка при создании урока. Попробуйте позже.',
    }
  }
}
```

### 3.3. Использование в компонентах

```typescript
'use client'

import { createLesson } from '@/actions/lessons'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function CreateLessonForm() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const input = {
        gradeId: formData.get('gradeId') as string,
        title: formData.get('title') as string,
        // ... другие поля
      }

      const result = await createLesson(input)

      if (result.success) {
        // Успешный результат
        toast.success(result.message ?? 'Урок успешно создан')
        router.push(`/grades/${input.gradeId}/lessons/${result.data.id}`)
        router.refresh() // Обновить кэш
      } else {
        // Обработка ошибок
        if (result.fieldErrors) {
          // Ошибки валидации по полям
          Object.entries(result.fieldErrors).forEach(([field, errors]) => {
            toast.error(`${field}: ${errors.join(', ')}`)
          })
        } else {
          // Общая ошибка
          toast.error(result.error)
        }
      }
    })
  }

  return (
    <form action={handleSubmit}>
      {/* Поля формы */}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Создание...' : 'Создать урок'}
      </button>
    </form>
  )
}
```

### 3.4. Типизированные ошибки

Для более структурированной обработки можно создать типизированные классы ошибок:

```typescript
// lib/errors/action-errors.ts

export class ValidationError extends Error {
  constructor(
    message: string,
    public fieldErrors?: Record<string, string[]>
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthorizationError'
  }
}

export class BusinessLogicError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'BusinessLogicError'
  }
}

export class DatabaseError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message)
    this.name = 'DatabaseError'
  }
}
```

Использование в Server Actions:

```typescript
try {
  // ... логика
} catch (error) {
  if (error instanceof ValidationError) {
    return {
      success: false,
      error: error.message,
      fieldErrors: error.fieldErrors,
    }
  }
  
  if (error instanceof AuthorizationError) {
    return {
      success: false,
      error: error.message,
    }
  }
  
  // ... другие типы ошибок
}
```

---

## 4. Ошибки валидации

### 4.1. Zod Validation Errors

Zod предоставляет детальную информацию об ошибках валидации:

```typescript
import { z } from 'zod'

const CreateLessonSchema = z.object({
  title: z.string().min(1, 'Название урока обязательно').max(200, 'Название слишком длинное'),
  lessonDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Неверный формат даты (YYYY-MM-DD)'),
  goldenVerseIds: z.array(z.string().uuid('Неверный формат UUID')).max(5, 'Максимум 5 золотых стихов'),
})

// Валидация
const result = CreateLessonSchema.safeParse(input)

if (!result.success) {
  // Структура ошибок Zod
  const errors = result.error.flatten()
  
  // Ошибки по полям
  console.log(errors.fieldErrors)
  // {
  //   title: ['Название урока обязательно'],
  //   lessonDate: ['Неверный формат даты (YYYY-MM-DD)'],
  //   goldenVerseIds: ['Неверный формат UUID', 'Максимум 5 золотых стихов']
  // }
  
  // Общие ошибки формы
  console.log(errors.formErrors)
}
```

### 4.2. Форматирование ошибок валидации

```typescript
// lib/validation/utils.ts

import { ZodError } from 'zod'

export function formatValidationErrors(error: ZodError): {
  fieldErrors: Record<string, string[]>
  formErrors: string[]
} {
  const flattened = error.flatten()
  
  return {
    fieldErrors: flattened.fieldErrors as Record<string, string[]>,
    formErrors: flattened.formErrors,
  }
}

export function getFieldError(
  fieldErrors: Record<string, string[]>,
  fieldName: string
): string | undefined {
  const errors = fieldErrors[fieldName]
  return errors && errors.length > 0 ? errors[0] : undefined
}
```

### 4.3. Интеграция с React Hook Form

```typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateLessonSchema } from '@/lib/validation/lessons'
import { createLesson } from '@/actions/lessons'

export function CreateLessonForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(CreateLessonSchema),
  })

  async function onSubmit(data: z.infer<typeof CreateLessonSchema>) {
    const result = await createLesson(data)

    if (!result.success) {
      // Установка ошибок валидации по полям
      if (result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, fieldErrors]) => {
          setError(field as keyof typeof data, {
            type: 'server',
            message: fieldErrors[0],
          })
        })
      } else {
        // Общая ошибка
        toast.error(result.error)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Название урока</label>
        <input {...register('title')} />
        {errors.title && (
          <span className="text-red-500">{errors.title.message}</span>
        )}
      </div>
      
      {/* Другие поля */}
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Создание...' : 'Создать'}
      </button>
    </form>
  )
}
```

### 4.4. Отображение ошибок валидации в UI

```typescript
// components/shared/FormField.tsx

interface FormFieldProps {
  label: string
  error?: string
  children: React.ReactNode
}

export function FormField({ label, error, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      {children}
      {error && (
        <p className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
```

---

## 5. Ошибки аутентификации

### 5.1. AWS Cognito Error Codes

AWS Cognito возвращает специфичные коды ошибок:

| Код ошибки | Описание | Обработка |
|------------|----------|-----------|
| `NotAuthorizedException` | Неверный email/password | Показать сообщение "Неверный email или пароль" |
| `UserNotConfirmedException` | Пользователь не подтвержден | Показать сообщение "Пожалуйста, подтвердите email" |
| `UserNotFoundException` | Пользователь не найден | Показать сообщение "Пользователь не найден" |
| `TooManyRequestsException` | Слишком много запросов | Показать сообщение "Слишком много попыток. Попробуйте позже" |
| `ExpiredCodeException` | Код подтверждения истек | Показать сообщение "Код подтверждения истек" |
| `CodeMismatchException` | Неверный код подтверждения | Показать сообщение "Неверный код подтверждения" |
| `InvalidPasswordException` | Неверный формат пароля | Показать сообщение с требованиями к паролю |
| `LimitExceededException` | Превышен лимит | Показать сообщение "Превышен лимит операций" |

### 5.2. Обработка ошибок входа

```typescript
// actions/auth.ts
'use server'

import { signIn } from 'aws-amplify/auth'
import { getCurrentUser } from '@/lib/auth/cognito'

export async function signInAction(
  email: string,
  password: string
): Promise<ActionResponse<{ userId: string }>> {
  try {
    const { isSignedIn, nextStep } = await signIn({
      username: email,
      password,
    })

    if (isSignedIn) {
      const user = await getCurrentUser()
      return {
        success: true,
        data: { userId: user?.id ?? '' },
        message: 'Вход выполнен успешно',
      }
    }

    return {
      success: false,
      error: 'Не удалось войти. Попробуйте снова.',
    }
  } catch (error) {
    console.error('Sign in error:', error)

    // Обработка специфичных ошибок Cognito
    if (error instanceof Error) {
      if (error.name === 'NotAuthorizedException') {
        return {
          success: false,
          error: 'Неверный email или пароль',
        }
      }

      if (error.name === 'UserNotConfirmedException') {
        return {
          success: false,
          error: 'Пожалуйста, подтвердите ваш email перед входом',
        }
      }

      if (error.name === 'TooManyRequestsException') {
        return {
          success: false,
          error: 'Слишком много попыток входа. Попробуйте позже.',
        }
      }

      if (error.name === 'UserNotFoundException') {
        return {
          success: false,
          error: 'Пользователь с таким email не найден',
        }
      }
    }

    return {
      success: false,
      error: 'Произошла ошибка при входе. Попробуйте позже.',
    }
  }
}
```

### 5.3. Отображение ошибок в UI

```typescript
// app/(auth)/auth/page.tsx
'use client'

import { signInAction } from '@/actions/auth'
import { useState } from 'react'
import { toast } from 'sonner'

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const result = await signInAction(email, password)

    setIsLoading(false)

    if (result.success) {
      toast.success(result.message)
      router.push('/grades/my')
    } else {
      // Отображение ошибки в Toast
      toast.error(result.error)
      
      // Дополнительно можно показать ошибку под полями формы
      if (result.error.includes('email')) {
        setError('email', { message: result.error })
      } else if (result.error.includes('пароль')) {
        setError('password', { message: result.error })
      }
    }
  }

  return (
    <form action={handleSubmit}>
      <div>
        <label>Email</label>
        <input type="email" name="email" required />
      </div>
      
      <div>
        <label>Пароль</label>
        <input type="password" name="password" required />
      </div>
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Вход...' : 'Войти'}
      </button>
    </form>
  )
}
```

### 5.4. Обработка истекшей сессии

```typescript
// lib/auth/cognito.ts

export async function getCurrentUser() {
  try {
    const { userId } = await getCurrentUser()
    return userId
  } catch (error) {
    // Сессия истекла
    if (error instanceof Error && error.name === 'NotAuthorizedException') {
      // Очистить токены
      await signOut()
      // Редирект на страницу входа
      redirect('/auth')
    }
    throw error
  }
}
```

---

## 6. Ошибки авторизации

### 6.1. Проверка прав доступа

```typescript
// lib/auth/authorization.ts

export async function checkTeacherAccess(
  userId: string,
  gradeId: string
): Promise<boolean> {
  try {
    // Получить роль пользователя
    const user = await getCurrentUser()
    if (!user) return false

    // Admin и Superadmin имеют доступ ко всем группам
    if (user.role === 'ADMIN' || user.role === 'SUPERADMIN') {
      return true
    }

    // Teacher имеет доступ только к назначенным группам
    if (user.role === 'TEACHER') {
      const teacherGrades = await getTeacherGrades(userId)
      return teacherGrades.some(grade => grade.id === gradeId)
    }

    return false
  } catch (error) {
    console.error('Error checking teacher access:', error)
    return false
  }
}
```

### 6.2. Обработка ошибок авторизации в Server Actions

```typescript
// actions/lessons.ts

export async function createLesson(input: CreateLessonInput) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return {
        success: false,
        error: 'Необходима авторизация',
      }
    }

    // Проверка прав доступа
    const hasAccess = await checkTeacherAccess(user.id, input.gradeId)
    if (!hasAccess) {
      return {
        success: false,
        error: 'Недостаточно прав для выполнения этого действия',
      }
    }

    // ... остальная логика
  } catch (error) {
    // ...
  }
}
```

### 6.3. Middleware для защиты маршрутов

```typescript
// middleware.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getCurrentUser } from '@/lib/auth/cognito'

export async function middleware(request: NextRequest) {
  // Проверка защищенных маршрутов
  if (request.nextUrl.pathname.startsWith('/grades')) {
    try {
      const user = await getCurrentUser()
      
      if (!user) {
        return NextResponse.redirect(new URL('/auth', request.url))
      }

      // Проверка роли для админских страниц
      if (request.nextUrl.pathname.startsWith('/admin')) {
        if (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
          return NextResponse.redirect(new URL('/grades/my', request.url))
        }
      }
    } catch (error) {
      // Ошибка аутентификации
      return NextResponse.redirect(new URL('/auth', request.url))
    }
  }

  return NextResponse.next()
}
```

---

## 7. Ошибки GraphQL/AppSync

### 7.1. Обработка ошибок amplifyData

```typescript
// lib/db/amplify.ts

import { generateClient } from 'aws-amplify/data'
import type { Schema } from '@/amplify/data/resource'

export const amplifyData = generateClient<Schema>()

// Обертка для обработки ошибок
export async function safeAmplifyQuery<T>(
  operation: () => Promise<T>
): Promise<ActionResponse<T>> {
  try {
    const data = await operation()
    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error('GraphQL/AppSync error:', error)

    // Проверка типа ошибки
    if (error instanceof Error) {
      // Ошибки авторизации
      if (error.message.includes('Unauthorized') || error.message.includes('NotAuthorized')) {
        return {
          success: false,
          error: 'Недостаточно прав для выполнения операции',
        }
      }

      // Ошибки валидации GraphQL
      if (error.message.includes('ValidationError')) {
        return {
          success: false,
          error: 'Ошибка валидации данных',
        }
      }

      // Ошибки сети
      if (error.message.includes('Network') || error.message.includes('fetch')) {
        return {
          success: false,
          error: 'Ошибка сети. Проверьте подключение к интернету.',
        }
      }
    }

    return {
      success: false,
      error: 'Произошла ошибка при выполнении операции',
    }
  }
}
```

### 7.2. Использование в Server Actions

```typescript
// actions/lessons.ts

import { safeAmplifyQuery } from '@/lib/db/amplify'

export async function getLessonById(lessonId: string) {
  return safeAmplifyQuery(async () => {
    const { data, errors } = await amplifyData.models.Lesson.get({
      id: lessonId,
    })

    if (errors && errors.length > 0) {
      throw new Error(errors[0].message)
    }

    if (!data) {
      throw new Error('Урок не найден')
    }

    return data
  })
}
```

### 7.3. Обработка ошибок GraphQL в компонентах

```typescript
'use client'

import { getLessonById } from '@/actions/lessons'
import { useEffect, useState } from 'react'

export function LessonView({ lessonId }: { lessonId: string }) {
  const [lesson, setLesson] = useState(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadLesson() {
      const result = await getLessonById(lessonId)

      if (result.success) {
        setLesson(result.data)
      } else {
        setError(result.error)
        toast.error(result.error)
      }
    }

    loadLesson()
  }, [lessonId])

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <button onClick={() => window.location.reload()}>
          Попробовать снова
        </button>
      </div>
    )
  }

  // ... отображение урока
}
```

---

## 8. Ошибки сети

### 8.1. Offline Detection

```typescript
// components/shared/OfflineDetector.tsx
'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'

export function OfflineDetector() {
  useEffect(() => {
    function handleOffline() {
      toast.error('Нет подключения к интернету', {
        duration: Infinity, // Toast остается до восстановления соединения
        id: 'offline', // Уникальный ID для обновления
      })
    }

    function handleOnline() {
      toast.success('Соединение восстановлено', {
        id: 'offline', // Обновить существующий Toast
      })
    }

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [])

  return null
}
```

### 8.2. Retry Logic

```typescript
// lib/utils/retry.ts

export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error')

      // Не повторяем для ошибок авторизации
      if (lastError.message.includes('Unauthorized')) {
        throw lastError
      }

      // Задержка перед повторной попыткой
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * attempt))
      }
    }
  }

  throw lastError ?? new Error('Operation failed')
}
```

### 8.3. Использование Retry в Server Actions

```typescript
// actions/lessons.ts

import { retryOperation } from '@/lib/utils/retry'

export async function createLesson(input: CreateLessonInput) {
  return retryOperation(async () => {
    const result = await amplifyData.create('Lesson', input)
    return result
  }, 3, 1000) // 3 попытки с задержкой 1 секунда
}
```

### 8.4. Блокировка форм при отсутствии сети

```typescript
'use client'

import { useState, useEffect } from 'react'

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof window !== 'undefined' ? navigator.onLine : true
  )

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true)
    }

    function handleOffline() {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}

// Использование в форме
export function CreateLessonForm() {
  const isOnline = useOnlineStatus()

  return (
    <form>
      {/* Поля формы */}
      <button type="submit" disabled={!isOnline}>
        {isOnline ? 'Создать урок' : 'Нет подключения к интернету'}
      </button>
    </form>
  )
}
```

---

## 9. Ошибки в компонентах

### 9.1. React Error Boundaries

```typescript
// app/error.tsx
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Логирование ошибки
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Что-то пошло не так!</h2>
        <p className="text-gray-600">
          Произошла ошибка при загрузке страницы.
        </p>
        {process.env.NODE_ENV === 'development' && (
          <pre className="text-sm text-red-500 bg-red-50 p-4 rounded">
            {error.message}
          </pre>
        )}
        <Button onClick={reset}>Попробовать снова</Button>
      </div>
    </div>
  )
}
```

### 9.2. Global Error Handler

```typescript
// app/global-error.tsx
'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Критическая ошибка!</h2>
            <p className="text-gray-600">
              Произошла критическая ошибка приложения.
            </p>
            <button
              onClick={reset}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Перезагрузить
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
```

### 9.3. Error Boundary для конкретных компонентов

```typescript
// components/shared/ErrorBoundary.tsx
'use client'

import React from 'react'
import { Button } from '@/components/ui/button'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-8 space-y-4">
          <h3 className="text-lg font-semibold">Произошла ошибка</h3>
          <p className="text-gray-600">
            {this.state.error?.message ?? 'Неизвестная ошибка'}
          </p>
          <Button
            onClick={() => {
              this.setState({ hasError: false, error: null })
              window.location.reload()
            }}
          >
            Перезагрузить страницу
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
```

### 9.4. Использование Error Boundary

```typescript
// app/grades/[gradeId]/lessons/page.tsx

import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { LessonList } from '@/components/teacher/LessonList'

export default function LessonsPage() {
  return (
    <ErrorBoundary>
      <LessonList />
    </ErrorBoundary>
  )
}
```

---

## 10. Пустые состояния (Empty States)

### 10.1. Компонент Empty State

```typescript
// components/shared/EmptyState.tsx

import { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Icon className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4 max-w-md">{description}</p>
      {action && (
        <Button onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  )
}
```

### 10.2. Примеры использования

```typescript
// Пустое состояние для отсутствия групп
<EmptyState
  icon={Users}
  title="Нет назначенных групп"
  description="Вы не назначены ни на одну группу. Обратитесь к администратору для назначения."
/>

// Пустое состояние для отсутствия уроков
<EmptyState
  icon={BookOpen}
  title="Нет уроков"
  description="В этом учебном году еще не создано ни одного урока."
  action={{
    label: 'Создать первый урок',
    onClick: () => router.push(`/grades/${gradeId}/lessons/new`),
  }}
/>

// Пустое состояние для отсутствия учеников
<EmptyState
  icon={User}
  title="Нет учеников"
  description="В этой группе пока нет учеников."
  action={{
    label: 'Добавить ученика',
    onClick: () => router.push('/admin/pupils-management'),
  }}
/>
```

### 10.3. Loading States

```typescript
// components/shared/LoadingSpinner.tsx

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
    </div>
  )
}

// Использование
export function LessonList() {
  const { data, isLoading, error } = useLessons()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorMessage error={error} />
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="Нет уроков"
        description="В этом учебном году еще не создано ни одного урока."
      />
    )
  }

  return <div>{/* Список уроков */}</div>
}
```

---

## 11. Логирование ошибок

### 11.1. Стратегия логирования

**Уровни логирования:**

1. **Development** — детальное логирование всех ошибок
2. **Production** — логирование критических ошибок, общие сообщения для пользователей

```typescript
// lib/utils/logger.ts

type LogLevel = 'error' | 'warn' | 'info' | 'debug'

export function logError(
  level: LogLevel,
  message: string,
  error?: unknown,
  context?: Record<string, unknown>
) {
  const isDevelopment = process.env.NODE_ENV === 'development'

  const logData = {
    level,
    message,
    error: error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: isDevelopment ? error.stack : undefined,
    } : error,
    context,
    timestamp: new Date().toISOString(),
  }

  // В development выводим в консоль
  if (isDevelopment) {
    console.error(`[${level.toUpperCase()}]`, logData)
  }

  // В production можно отправлять в CloudWatch, Sentry и т.д.
  if (process.env.NODE_ENV === 'production') {
    // TODO: Интеграция с CloudWatch или Sentry
    // sendToCloudWatch(logData)
  }
}
```

### 11.2. Использование в Server Actions

```typescript
// actions/lessons.ts

import { logError } from '@/lib/utils/logger'

export async function createLesson(input: CreateLessonInput) {
  try {
    // ... логика
  } catch (error) {
    logError('error', 'Failed to create lesson', error, {
      userId: user?.id,
      gradeId: input.gradeId,
      input,
    })

    return {
      success: false,
      error: 'Произошла ошибка при создании урока. Попробуйте позже.',
    }
  }
}
```

### 11.3. Логирование в компонентах

```typescript
'use client'

import { useEffect } from 'react'
import { logError } from '@/lib/utils/logger'

export function LessonView({ lessonId }: { lessonId: string }) {
  useEffect(() => {
    async function loadLesson() {
      try {
        const result = await getLessonById(lessonId)
        // ...
      } catch (error) {
        logError('error', 'Failed to load lesson', error, {
          lessonId,
        })
      }
    }

    loadLesson()
  }, [lessonId])

  // ...
}
```

### 11.4. Мониторинг ошибок (Post-MVP)

В будущем можно интегрировать:

- **AWS CloudWatch** — для логирования ошибок сервера
- **Sentry** — для отслеживания ошибок на клиенте и сервере
- **AWS X-Ray** — для трейсинга запросов

---

## 12. Примеры кода

### 12.1. Полный пример: Создание урока с обработкой всех типов ошибок

```typescript
// actions/lessons.ts
'use server'

import { z } from 'zod'
import { getCurrentUser } from '@/lib/auth/cognito'
import { checkTeacherAccess } from '@/lib/auth/authorization'
import { amplifyData } from '@/lib/db/amplify'
import { CreateLessonSchema } from '@/lib/validation/lessons'
import { logError } from '@/lib/utils/logger'
import { retryOperation } from '@/lib/utils/retry'

export async function createLesson(
  input: z.infer<typeof CreateLessonSchema>
): Promise<ActionResponse<Lesson>> {
  try {
    // 1. Аутентификация
    const user = await getCurrentUser()
    if (!user) {
      return {
        success: false,
        error: 'Необходима авторизация для создания урока',
      }
    }

    // 2. Валидация
    const validationResult = CreateLessonSchema.safeParse(input)
    if (!validationResult.success) {
      return {
        success: false,
        error: 'Ошибка валидации данных',
        fieldErrors: validationResult.error.flatten().fieldErrors,
      }
    }

    // 3. Авторизация
    const hasAccess = await checkTeacherAccess(user.id, validationResult.data.gradeId)
    if (!hasAccess) {
      return {
        success: false,
        error: 'Недостаточно прав для создания урока в этой группе',
      }
    }

    // 4. Бизнес-логика
    const activeYear = await getActiveAcademicYear(validationResult.data.gradeId)
    if (!activeYear) {
      return {
        success: false,
        error: 'Для создания урока необходимо наличие активного учебного года. Обратитесь к администратору.',
      }
    }

    // 5. Выполнение операции с retry
    const lesson = await retryOperation(async () => {
      const { data, errors } = await amplifyData.models.Lesson.create({
        ...validationResult.data,
        academicYearId: activeYear.id,
      })

      if (errors && errors.length > 0) {
        throw new Error(errors[0].message)
      }

      if (!data) {
        throw new Error('Failed to create lesson')
      }

      return data
    })

    // 6. Успешный ответ
    return {
      success: true,
      data: lesson,
      message: 'Урок успешно создан',
    }
  } catch (error) {
    // 7. Логирование и обработка ошибок
    logError('error', 'Failed to create lesson', error, {
      userId: user?.id,
      input,
    })

    // Проверка типа ошибки
    if (error instanceof Error) {
      if (error.message.includes('Unauthorized')) {
        return {
          success: false,
          error: 'Сессия истекла. Пожалуйста, войдите снова.',
        }
      }

      if (error.message.includes('Network') || error.message.includes('fetch')) {
        return {
          success: false,
          error: 'Ошибка сети. Проверьте подключение к интернету.',
        }
      }
    }

    return {
      success: false,
      error: 'Произошла ошибка при создании урока. Попробуйте позже.',
    }
  }
}
```

### 12.2. Полный пример: Компонент формы с обработкой ошибок

```typescript
// components/teacher/LessonForm.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createLesson } from '@/actions/lessons'
import { CreateLessonSchema } from '@/lib/validation/lessons'
import { FormField } from '@/components/shared/FormField'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'

export function LessonForm({ gradeId }: { gradeId: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const isOnline = useOnlineStatus()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(CreateLessonSchema),
    defaultValues: {
      gradeId,
    },
  })

  async function onSubmit(data: z.infer<typeof CreateLessonSchema>) {
    if (!isOnline) {
      toast.error('Нет подключения к интернету')
      return
    }

    startTransition(async () => {
      const result = await createLesson(data)

      if (result.success) {
        toast.success(result.message ?? 'Урок успешно создан')
        router.push(`/grades/${gradeId}/lessons/${result.data.id}`)
        router.refresh()
      } else {
        // Обработка ошибок валидации
        if (result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([field, fieldErrors]) => {
            setError(field as keyof typeof data, {
              type: 'server',
              message: fieldErrors[0],
            })
          })
        } else {
          // Общая ошибка
          toast.error(result.error)
        }
      }
    })
  }

  return (
    <ErrorBoundary>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          label="Название урока"
          error={errors.title?.message}
        >
          <input
            {...register('title')}
            className="w-full px-3 py-2 border rounded"
            aria-invalid={errors.title ? 'true' : 'false'}
          />
        </FormField>

        <FormField
          label="Дата урока"
          error={errors.lessonDate?.message}
        >
          <input
            type="date"
            {...register('lessonDate')}
            className="w-full px-3 py-2 border rounded"
            aria-invalid={errors.lessonDate ? 'true' : 'false'}
          />
        </FormField>

        <button
          type="submit"
          disabled={isPending || !isOnline}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {isPending
            ? 'Создание...'
            : !isOnline
            ? 'Нет подключения к интернету'
            : 'Создать урок'}
        </button>
      </form>
    </ErrorBoundary>
  )
}
```

---

## 13. Ссылки на связанные документы

### Архитектура и API

- [ARCHITECTURE.md](../architecture/ARCHITECTURE.md) - раздел Error Handling
- [SERVER_ACTIONS.md](../api/SERVER_ACTIONS.md) - раздел Response Format Convention и Error Handling
- [VALIDATION.md](../api/VALIDATION.md) - раздел Error Handling
- [DATA_FLOW.md](../architecture/DATA_FLOW.md) - раздел Error Propagation

### Пользовательские сценарии

- [USER_FLOW.md](USER_FLOW.md) - раздел 6: Edge Cases и обработка ошибок
- [TEACHER_FLOWS.md](TEACHER_FLOWS.md) - обработка ошибок в сценариях преподавателя
- [ADMIN_FLOWS.md](ADMIN_FLOWS.md) - обработка ошибок в сценариях администратора

### Инфраструктура

- [SECURITY.md](../infrastructure/SECURITY.md) - раздел Error Handling и Security
- [AWS_AMPLIFY.md](../infrastructure/AWS_AMPLIFY.md) - раздел Error Handling

### Компоненты

- [COMPONENT_LIBRARY.md](../components/COMPONENT_LIBRARY.md) - раздел Error States и Empty States
- [CLIENT_COMPONENTS.md](../components/CLIENT_COMPONENTS.md) - раздел Error Handling

### Реализация

- [phase_08_auth_ui.md](../implementation/mvp/tasks/phase_08_auth_ui.md) - Task 08.08: Обработка ошибок аутентификации
- [phase_09_data_access.md](../implementation/mvp/tasks/phase_09_data_access.md) - Task 09.04: Обработка ошибок в Data Access Layer
- [phase_10_validation.md](../implementation/mvp/tasks/phase_10_validation.md) - Task 10.06: Создание утилит для обработки ошибок валидации

---

## 14. Best Practices

### 14.1. Общие рекомендации

1. **Всегда используйте discriminated unions** для типобезопасной обработки ошибок
2. **Логируйте все ошибки** с контекстом для отладки
3. **Показывайте понятные сообщения** пользователям (не технические детали)
4. **Обрабатывайте ошибки на соответствующем уровне** (клиент/сервер)
5. **Используйте Error Boundaries** для критических компонентов
6. **Реализуйте retry logic** для сетевых операций
7. **Проверяйте онлайн-статус** перед выполнением операций

### 14.2. Чего избегать

1. ❌ Не показывайте технические детали ошибок пользователям
2. ❌ Не игнорируйте ошибки (всегда обрабатывайте)
3. ❌ Не используйте `any` для типов ошибок
4. ❌ Не логируйте чувствительные данные (пароли, токены)
5. ❌ Не создавайте бесконечные циклы retry

---

**Версия:** 1.0  
**Последнее обновление:** 23 декабря 2025  
**Поддерживается:** Development Team

