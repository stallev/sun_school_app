# GradeForm Submit Handler - Анализ работы обработчика формы

## Документ версии: 1.0
**Дата создания:** 31 декабря 2025  
**Проект:** Sunday School App  
**Компонент:** `src/components/admin/grades/grade-form.tsx`  
**Технологии:** React Hook Form, Zod, Next.js 15

---

## 1. Обзор проблемы

При клике на кнопку submit формы `GradeForm` в консоли появляется только сообщение:
```
Form submit event handler called
```

Но не появляется сообщение:
```
Form submit triggered, data: ...
```

Это означает, что функция `onSubmit` не вызывается, хотя событие submit обрабатывается.

---

## 2. Архитектура обработчика формы

### 2.1. Структура обработчиков

```typescript
// Строка 144-148: Обработчик события submit формы
const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  console.log('Form submit event handler called');
  // form.handleSubmit уже обрабатывает preventDefault внутри
  form.handleSubmit(onSubmit)(e);
};

// Строка 108-142: Функция обработки валидированных данных
const onSubmit = (data: CreateGradeInput | UpdateGradeInput) => {
  console.log('Form submit triggered, data:', data);
  startTransition(async () => {
    // ... логика отправки данных
  });
};
```

### 2.2. Цепочка вызовов

```
1. Пользователь кликает на кнопку <Button type="submit">
   ↓
2. Браузер генерирует событие submit на элементе <form>
   ↓
3. Вызывается handleFormSubmit (строка 144)
   ↓
4. handleFormSubmit вызывает form.handleSubmit(onSubmit)(e)
   ↓
5. form.handleSubmit (из react-hook-form):
   a. Выполняет e.preventDefault() автоматически
   b. Выполняет валидацию всех полей формы через Zod
   c. Если валидация успешна → вызывает onSubmit(data)
   d. Если валидация не прошла → НЕ вызывает onSubmit, показывает ошибки
   ↓
6. onSubmit вызывается ТОЛЬКО если валидация успешна
```

---

## 3. Как работает form.handleSubmit из React Hook Form

### 3.1. Внутренняя логика form.handleSubmit

`form.handleSubmit` из `react-hook-form` работает следующим образом:

1. **Автоматический preventDefault**: Предотвращает стандартное поведение формы (перезагрузку страницы)

2. **Валидация полей**: Выполняет валидацию всех полей формы через resolver (в данном случае Zod)

3. **Условный вызов onSubmit**:
   - ✅ **Если валидация успешна**: Вызывает `onSubmit` с валидированными данными
   - ❌ **Если валидация не прошла**: НЕ вызывает `onSubmit`, но:
     - Устанавливает ошибки валидации в `form.formState.errors`
     - Обновляет состояние формы
     - Позволяет компонентам `FormMessage` отобразить ошибки

### 3.2. Сигнатура form.handleSubmit

```typescript
form.handleSubmit(
  onValid: (data) => void,      // Вызывается при успешной валидации
  onInvalid?: (errors) => void    // Опционально: вызывается при ошибках валидации
): (e?: React.BaseSyntheticEvent) => Promise<void>
```

---

## 4. Почему onSubmit не вызывается

### 4.1. Основная причина

Если в консоли видно только `"Form submit event handler called"`, но не видно `"Form submit triggered, data:"`, это означает, что **валидация формы не прошла**.

`form.handleSubmit` выполнил валидацию, обнаружил ошибки и **не вызвал** `onSubmit`.

### 4.2. Возможные причины ошибок валидации

1. **Обязательные поля не заполнены**:
   - Поле `name` (название группы) - обязательное
   - Другие обязательные поля согласно схеме валидации

2. **Некорректные значения полей**:
   - `minAge` или `maxAge` не соответствуют типам (должны быть числами)
   - Значения не соответствуют правилам Zod схемы

3. **Проблемы с вложенными компонентами**:
   - `TeacherSelector` или `PupilSelector` могут не синхронизировать значения с формой
   - Значения `teacherIds` или `pupilIds` могут быть некорректными

4. **Проблемы с defaultValues**:
   - Значения по умолчанию могут не соответствовать схеме валидации
   - Проблемы с инициализацией формы

---

## 5. Как диагностировать проблему

### 5.1. Проверка ошибок валидации

Добавьте в компонент `GradeForm` проверку ошибок валидации:

```typescript
// После строки 148, перед return
console.log('Form errors:', form.formState.errors);
console.log('Form values:', form.getValues());
console.log('Form is valid:', form.formState.isValid);
```

### 5.2. Добавление обработчика ошибок валидации

Модифицируйте `handleFormSubmit` для обработки ошибок:

```typescript
const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  console.log('Form submit event handler called');
  
  // Добавьте обработчик ошибок валидации
  form.handleSubmit(
    onSubmit, // Вызывается при успешной валидации
    (errors) => { // Вызывается при ошибках валидации
      console.log('Validation errors:', errors);
      console.log('Form values:', form.getValues());
    }
  )(e);
};
```

### 5.3. Проверка состояния формы

Добавьте отладочную информацию в JSX:

```typescript
{/* Добавьте перед кнопкой submit для отладки */}
{Object.keys(form.formState.errors).length > 0 && (
  <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
    <p className="text-sm font-semibold text-destructive">
      Ошибки валидации:
    </p>
    <pre className="mt-2 text-xs">
      {JSON.stringify(form.formState.errors, null, 2)}
    </pre>
  </div>
)}
```

---

## 6. Типичные проблемы и решения

### 6.1. Проблема: TeacherSelector/PupilSelector не синхронизирует значения

**Симптомы**: Форма не проходит валидацию из-за отсутствующих или некорректных `teacherIds`/`pupilIds`.

**Решение**: Убедитесь, что компоненты `TeacherSelector` и `PupilSelector` правильно используют `useFormContext()` и обновляют значения через `form.setValue()`.

### 6.2. Проблема: Значения полей не соответствуют типам

**Симптомы**: Поля `minAge`/`maxAge` могут быть строками вместо чисел.

**Решение**: В компоненте `AgeField` уже есть преобразование:
```typescript
onChange={(e) => {
  const value = e.target.value;
  field.onChange(value === '' ? undefined : Number(value));
}}
```
Убедитесь, что это работает корректно.

### 6.3. Проблема: Схема валидации не соответствует данным

**Симптомы**: Схема `createGradeSchema` или `updateGradeSchema` требует поля, которых нет в форме.

**Решение**: Проверьте схемы валидации в `@/lib/validation/grades` и убедитесь, что все обязательные поля присутствуют в форме.

---

## 7. Рекомендуемое решение

### 7.1. Улучшенная версия handleFormSubmit

```typescript
const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  console.log('Form submit event handler called');
  
  form.handleSubmit(
    // onValid - вызывается при успешной валидации
    (data) => {
      console.log('Form submit triggered, data:', data);
      onSubmit(data);
    },
    // onInvalid - вызывается при ошибках валидации
    (errors) => {
      console.error('Form validation failed:', errors);
      console.log('Current form values:', form.getValues());
      
      // Показываем первую ошибку пользователю
      const firstError = Object.values(errors)[0];
      if (firstError?.message) {
        toast.error(firstError.message);
      } else {
        toast.error('Пожалуйста, заполните все обязательные поля корректно');
      }
    }
  )(e);
};
```

### 7.2. Альтернативный подход (без handleFormSubmit)

Можно использовать `form.handleSubmit` напрямую в JSX:

```typescript
// Удалите handleFormSubmit
// Измените строку 152:
<form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
```

React Hook Form автоматически обработает `preventDefault` и валидацию.

---

## 8. Проверка схем валидации

Убедитесь, что схемы валидации соответствуют структуре формы:

```typescript
// Проверьте @/lib/validation/grades.ts
// createGradeSchema должен требовать:
// - name (обязательное)
// - teacherIds (может быть обязательным или опциональным)
// - minAge, maxAge (опциональные)
// - active (опциональное, по умолчанию true)
```

---

## 9. Выводы

1. **Проблема**: `onSubmit` не вызывается из-за ошибок валидации формы.

2. **Причина**: `form.handleSubmit` выполняет валидацию перед вызовом `onSubmit`. Если валидация не проходит, `onSubmit` не вызывается.

3. **Решение**: 
   - Добавьте обработчик ошибок валидации в `handleFormSubmit`
   - Проверьте `form.formState.errors` для диагностики
   - Убедитесь, что все обязательные поля заполнены корректно
   - Проверьте синхронизацию значений из `TeacherSelector` и `PupilSelector`

4. **Рекомендация**: Используйте второй параметр `form.handleSubmit` для обработки ошибок валидации и отображения понятных сообщений пользователю.

---

## 10. Ссылки

- [React Hook Form - handleSubmit](https://react-hook-form.com/docs/useform/handlesubmit)
- [React Hook Form - Form Validation](https://react-hook-form.com/docs/useform/formstate)
- [Zod Validation](https://zod.dev/)
- Компонент формы: `src/components/admin/grades/grade-form.tsx`
- Схемы валидации: `src/lib/validation/grades.ts`

---

**Документ версии:** 1.0  
**Последнее обновление:** 31 декабря 2025

