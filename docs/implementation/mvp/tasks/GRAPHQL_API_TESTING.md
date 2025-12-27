# GraphQL API Testing Guide - Task 03.15

## Цель
Протестировать GraphQL API в AWS AppSync Console для подтверждения корректной работы queries, mutations и авторизации.

## Предварительные требования

1. ✅ Все таблицы созданы (Task 03.13 выполнена)
2. ✅ Доступ к AWS AppSync Console
3. ✅ Учетные данные для авторизации (ADMIN, TEACHER, неавторизованный пользователь)

## Шаги тестирования

### 1. Открытие AWS AppSync Console

1. Войдите в AWS Console
2. Перейдите в сервис **AWS AppSync**
3. Выберите ваш API (например, `sunsch`)
4. Перейдите в раздел **Queries**

### 2. Тестирование Queries

#### 2.1. Простой query: listBooks

**Query:**
```graphql
query ListBooks {
  listBooks {
    items {
      id
      fullName
      shortName
      abbreviation
      testament
      order
      createdAt
      updatedAt
    }
    nextToken
  }
}
```

**Ожидаемый результат:**
- Если таблица пуста: `items: []`
- Если таблица заполнена: массив из 66 книг Библии

#### 2.2. Query с фильтром: listBooks по завету

**Query:**
```graphql
query ListBooksByTestament {
  listBooks(filter: { testament: { eq: "OLD" } }) {
    items {
      id
      fullName
      shortName
      testament
      order
    }
  }
}
```

**Ожидаемый результат:**
- Массив из 39 книг Ветхого Завета
- Все книги имеют `testament: "OLD"`

**Query для Нового Завета:**
```graphql
query ListBooksNewTestament {
  listBooks(filter: { testament: { eq: "NEW" } }) {
    items {
      id
      fullName
      shortName
      testament
      order
    }
  }
}
```

**Ожидаемый результат:**
- Массив из 27 книг Нового Завета
- Все книги имеют `testament: "NEW"`

#### 2.3. Query по ID: getBook

**Query:**
```graphql
query GetBook($id: ID!) {
  getBook(id: $id) {
    id
    fullName
    shortName
    abbreviation
    testament
    order
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "id": "book-id-here"
}
```

**Ожидаемый результат:**
- Объект с данными книги или ошибка, если книга не найдена

### 3. Тестирование Mutations

#### 3.1. Создание книги: createBook

**Mutation:**
```graphql
mutation CreateBook($input: CreateBookInput!) {
  createBook(input: $input) {
    id
    fullName
    shortName
    abbreviation
    testament
    order
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "fullName": "Евангелие от Иоанна",
    "shortName": "Иоанна",
    "abbreviation": "Ин",
    "testament": "NEW",
    "order": 43
  }
}
```

**Ожидаемый результат:**
- Созданная книга с автоматически сгенерированным `id`
- Поля `createdAt` и `updatedAt` заполнены

**Проверка авторизации:**
- Попытайтесь выполнить mutation без авторизации
- Ожидаемая ошибка: `Unauthorized` или `Not Authorized`

#### 3.2. Обновление книги: updateBook

**Mutation:**
```graphql
mutation UpdateBook($input: UpdateBookInput!) {
  updateBook(input: $input) {
    id
    fullName
    shortName
    abbreviation
    testament
    order
    updatedAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "id": "book-id-here",
    "fullName": "Обновленное название"
  }
}
```

**Ожидаемый результат:**
- Обновленная книга с новым `updatedAt`

#### 3.3. Удаление книги: deleteBook

**Mutation:**
```graphql
mutation DeleteBook($input: DeleteBookInput!) {
  deleteBook(input: $input) {
    id
    fullName
  }
}
```

**Variables:**
```json
{
  "input": {
    "id": "book-id-here"
  }
}
```

**Ожидаемый результат:**
- Удаленная книга (данные возвращаются перед удалением)

### 4. Тестирование авторизации

#### 4.1. TEACHER может читать книги

1. Авторизуйтесь как пользователь с ролью `TEACHER`
2. Выполните query `listBooks`
3. **Ожидаемый результат:** ✅ Успешно возвращает список книг

#### 4.2. TEACHER не может создавать/обновлять/удалять книги

1. Авторизуйтесь как пользователь с ролью `TEACHER`
2. Попытайтесь выполнить mutation `createBook`
3. **Ожидаемый результат:** ❌ Ошибка `Forbidden` или `Not Authorized`

#### 4.3. ADMIN может выполнять все операции

1. Авторизуйтесь как пользователь с ролью `ADMIN`
2. Выполните query `listBooks` - ✅ Должно работать
3. Выполните mutation `createBook` - ✅ Должно работать
4. Выполните mutation `updateBook` - ✅ Должно работать
5. Выполните mutation `deleteBook` - ✅ Должно работать

#### 4.4. Неавторизованные пользователи не могут выполнять операции

1. Выйдите из системы (или используйте режим без авторизации)
2. Попытайтесь выполнить query `listBooks`
3. **Ожидаемый результат:** ❌ Ошибка `Unauthorized`

### 5. Документирование результатов

Заполните следующую таблицу результатов:

| Тест | Статус | Примечания |
|------|--------|------------|
| listBooks (пустая таблица) | ⬜ | |
| listBooks (заполненная таблица) | ⬜ | |
| listBooks с фильтром (OLD) | ⬜ | |
| listBooks с фильтром (NEW) | ⬜ | |
| getBook по ID | ⬜ | |
| createBook (ADMIN) | ⬜ | |
| createBook (TEACHER) | ⬜ | Ожидается ошибка |
| createBook (неавторизованный) | ⬜ | Ожидается ошибка |
| updateBook (ADMIN) | ⬜ | |
| updateBook (TEACHER) | ⬜ | Ожидается ошибка |
| deleteBook (ADMIN) | ⬜ | |
| deleteBook (TEACHER) | ⬜ | Ожидается ошибка |
| listBooks (TEACHER) | ⬜ | |
| listBooks (неавторизованный) | ⬜ | Ожидается ошибка |

## Критерии приемки

- ✅ GraphQL API работает корректно
- ✅ Queries возвращают данные
- ✅ Mutations создают/обновляют/удаляют записи
- ✅ Авторизация работает правильно:
  - TEACHER может читать, но не может изменять
  - ADMIN может выполнять все операции
  - Неавторизованные пользователи не могут выполнять операции
- ✅ Результаты тестирования задокументированы

## Примечания

- Если обнаружены проблемы, задокументируйте их с описанием и скриншотами
- Проверьте логи в AWS CloudWatch для детальной информации об ошибках
- Убедитесь, что все тесты выполнены перед переходом к следующей фазе

