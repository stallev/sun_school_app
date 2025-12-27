# Analytics - Sunday School App

## Версия документа: 1.0
**Дата создания:** 25 декабря 2025  
**Последнее обновление:** 25 декабря 2025  
**Проект:** Sunday School App  
**Технологии:** AWS DynamoDB, AWS AppSync, AWS Amplify Gen 1  
**Статус:** Post-MVP функционал (структура БД создается на этапе MVP)

> [!NOTE]
> Документация основана на актуальных источниках:
> - DynamoDB Analytics Patterns — AWS best practices
> - Time Series Data in DynamoDB — AWS официальная документация
> - Data Aggregation Strategies — AWS DynamoDB patterns

> [!IMPORTANT]
> **Критически важно:** Access patterns определяют дизайн базы данных в DynamoDB. Структуру БД для аналитики необходимо создать на этапе MVP (GSI-3 для HomeworkChecks), даже если сам функционал аналитики будет реализован post-MVP. Это предотвратит необходимость миграции данных в будущем.

---

## 1. Обзор аналитики учебного процесса

### 1.1. Назначение

Документация описывает систему аналитики учебного процесса для воскресной школы, включающую:

- **Показатели успеваемости учеников** с течением времени
- **Показатели успеваемости групп** с течением времени
- **Access patterns** для DynamoDB, необходимые для генерации аналитических отчетов
- **Структуру базы данных** для поддержки аналитики

### 1.2. Целевая аудитория

- **Учителя:** Отслеживание прогресса учеников, выявление проблемных зон
- **Администраторы:** Мониторинг эффективности групп, сравнение показателей
- **Родители:** Просмотр успеваемости своих детей (post-MVP)
- **Руководство:** Аналитические отчеты для принятия решений

### 1.3. Источники данных

Основные источники данных для аналитики:

- **HomeworkChecks** — результаты проверки ДЗ (баллы, компоненты, посещаемость)
- **Lessons** — информация об уроках (дата, группа, учебный год)
- **Pupils** — информация об учениках (группа, активность)
- **Grades** — информация о группах
- **AcademicYears** — информация об учебных годах

### 1.4. Временные периоды

Аналитика поддерживает следующие временные периоды:

- **По урокам:** Детальная статистика за каждый урок
- **По неделям:** Агрегированная статистика за неделю
- **По месяцам:** Агрегированная статистика за месяц
- **По учебному году:** Общая статистика за учебный год
- **Произвольный период:** Пользовательский выбор дат

---

## 2. Показатели успеваемости ученика

### 2.1. Общие показатели

#### 2.1.1. Баллы с течением времени

**Описание:** Общие баллы ученика за каждый урок, отслеживаемые во времени.

**Метрики:**
- `totalPoints` — суммарные баллы за период
- `averagePoints` — средний балл за урок
- `maxPoints` — максимальный балл за урок
- `minPoints` — минимальный балл за урок
- `pointsTrend` — тренд (улучшение/ухудшение/стабильно)

**Формула расчета среднего балла:**
```
averagePoints = totalPoints / numberOfLessons
```

**Визуализация:**
- Линейный график: баллы по датам уроков
- Тренд-линия: показ общего направления (улучшение/ухудшение)

#### 2.1.2. Процент посещаемости

**Описание:** Отношение уроков с проверкой ДЗ к общему количеству уроков в группе за период.

**Метрики:**
- `attendanceRate` — процент посещаемости (0-100%)
- `lessonsAttended` — количество уроков с проверкой
- `lessonsTotal` — общее количество уроков в группе за период

**Формула:**
```
attendanceRate = (lessonsAttended / lessonsTotal) * 100
```

**Интерпретация:**
- 90-100% — отличная посещаемость
- 70-89% — хорошая посещаемость
- 50-69% — средняя посещаемость
- < 50% — низкая посещаемость (требует внимания)

**Визуализация:**
- Круговая диаграмма: посещенные / пропущенные уроки
- Столбчатая диаграмма: посещаемость по месяцам

### 2.2. Компоненты успеваемости

#### 2.2.1. Золотые стихи

**Описание:** Статистика по запоминанию золотых стихов.

**Метрики:**
- `averageGoldenVerseScore` — средний балл за золотые стихи (0-6)
- `goldenVerseCompletionRate` — процент выполнения (>= 4 баллов)
- `perfectGoldenVerseCount` — количество уроков с максимальным баллом (6)
- `goldenVerseTrend` — тренд по золотым стихам

**Формула среднего балла:**
```
averageGoldenVerseScore = sum(goldenVerse1Score + goldenVerse2Score + goldenVerse3Score) / numberOfLessons
```

**Формула процента выполнения:**
```
goldenVerseCompletionRate = (lessonsWithScore >= 4 / lessonsTotal) * 100
```

**Визуализация:**
- Линейный график: баллы за золотые стихи по урокам
- Столбчатая диаграмма: распределение баллов (0-2, 3-4, 5-6)

#### 2.2.2. Тесты

**Описание:** Статистика по выполнению тестов.

**Метрики:**
- `averageTestScore` — средний балл за тесты (0-10)
- `testCompletionRate` — процент выполнения (>= 8 баллов)
- `perfectTestCount` — количество тестов с максимальным баллом (10)
- `testTrend` — тренд по тестам

**Формула среднего балла:**
```
averageTestScore = sum(testScore) / numberOfLessons
```

**Формула процента выполнения:**
```
testCompletionRate = (lessonsWithScore >= 8 / lessonsTotal) * 100
```

**Визуализация:**
- Линейный график: баллы за тесты по урокам
- Гистограмма: распределение баллов (0-3, 4-6, 7-8, 9-10)

#### 2.2.3. Тетради

**Описание:** Статистика по выполнению домашних заданий в тетради.

**Метрики:**
- `averageNotebookScore` — средний балл за тетради (0-10)
- `notebookCompletionRate` — процент выполнения (>= 8 баллов)
- `perfectNotebookCount` — количество тетрадей с максимальным баллом (10)
- `notebookTrend` — тренд по тетрадям

**Формула среднего балла:**
```
averageNotebookScore = sum(notebookScore) / numberOfLessons
```

**Формула процента выполнения:**
```
notebookCompletionRate = (lessonsWithScore >= 8 / lessonsTotal) * 100
```

**Визуализация:**
- Линейный график: баллы за тетради по урокам
- Столбчатая диаграмма: средний балл по месяцам

#### 2.2.4. Спевки

**Описание:** Статистика по посещению спевок.

**Метрики:**
- `singingAttendanceRate` — процент посещения спевок (0-100%)
- `singingCount` — количество посещенных спевок
- `singingTrend` — тренд по спевкам

**Формула:**
```
singingAttendanceRate = (singingCount / lessonsTotal) * 100
```

**Визуализация:**
- Круговая диаграмма: посещенные / пропущенные спевки
- Столбчатая диаграмма: посещаемость спевок по месяцам

#### 2.2.5. Домики

**Описание:** Статистика по получению домиков (hasHouse = true).

**Метрики:**
- `houseCount` — количество полученных домиков
- `houseRate` — процент уроков с домиком (0-100%)
- `houseTrend` — тренд по домикам

**Формула:**
```
houseRate = (houseCount / lessonsTotal) * 100
```

**Условие получения домика:**
```
hasHouse = (goldenVerse1Score + goldenVerse2Score + goldenVerse3Score >= 6) 
           && testScore >= 8 
           && notebookScore >= 8 
           && singing === true
```

**Визуализация:**
- Столбчатая диаграмма: количество домиков по месяцам
- Индикатор прогресса: процент уроков с домиком

### 2.5. Золотые стихи (Golden Verses Analytics)

#### 2.5.1. Общая статистика по золотым стихам

**Описание:** Статистика по запоминанию золотых стихов группой за учебный год.

**Метрики:**
- `goldenVersesCount` — количество уникальных стихов, которые учили в группе за учебный год
- `averageVersesPerLesson` — среднее количество стихов на урок
- `mostUsedVerses` — наиболее часто используемые стихи (топ-10)
- `versesByBook` — распределение стихов по книгам Библии

**Формула среднего количества стихов на урок:**
```
averageVersesPerLesson = totalVersesInLessons / lessonsCount
```

**Визуализация:**
- Таблица стихов: список всех стихов с reference и text
- Круговая диаграмма: распределение стихов по книгам Библии
- Столбчатая диаграмма: топ-10 наиболее используемых стихов

#### 2.5.2. Аналитика сложности золотых стихов

**Описание:** Определение легких и сложных стихов на основе успеваемости детей. Помогает учителям понять, какие стихи даются детям легко, а какие требуют дополнительного внимания.

**Метрики:**
- `totalChecks` — общее количество проверок стиха (сколько раз стих проверялся)
- `maxScoreCount` — количество проверок с максимальным баллом (2 балла)
- `successRate` — процент успешности (maxScoreCount / totalChecks * 100)
- `averageScore` — средний балл за стих (сумма всех баллов / количество проверок)
- `difficultyLevel` — уровень сложности: "легкий" (>80% успешности), "средний" (50-80%), "сложный" (<50%)

**Алгоритм расчета:**

1. Получить все HomeworkChecks для группы/учебного года (GSI-3: gradeId-createdAt)
2. Для каждого HomeworkCheck получить Lesson и LessonGoldenVerses
3. Сопоставить баллы:
   - `goldenVerse1Score` с `LessonGoldenVerse` где `order=1`
   - `goldenVerse2Score` с `LessonGoldenVerse` где `order=2`
   - `goldenVerse3Score` с `LessonGoldenVerse` где `order=3`
4. Агрегировать статистику по `goldenVerseId`:
   - Подсчитать общее количество проверок каждого стиха
   - Подсчитать количество максимальных баллов (2 балла)
   - Рассчитать процент успешности
   - Рассчитать средний балл

**Формулы:**
```
successRate = (maxScoreCount / totalChecks) * 100
averageScore = totalScore / totalChecks
difficultyLevel = successRate > 80 ? "легкий" : 
                  successRate > 50 ? "средний" : "сложный"
```

**Интерпретация:**
- **Легкий стих (>80% успешности):** Большинство детей легко запоминают стих, получают максимальные баллы
- **Средний стих (50-80% успешности):** Примерно половина детей справляется хорошо, требуется стандартная работа
- **Сложный стих (<50% успешности):** Меньше половины детей получают максимальные баллы, требуется дополнительное внимание и повторение

**Визуализация:**
- Таблица стихов с метриками: reference, text, totalChecks, successRate, averageScore, difficultyLevel
- График распределения сложности: столбчатая диаграмма по уровням сложности
- Топ-10 легких стихов: стихи с наивысшим процентом успешности
- Топ-10 сложных стихов: стихи с наименьшим процентом успешности
- Круговая диаграмма: распределение стихов по уровням сложности

**Использование:**
- Выявление стихов, которые требуют дополнительного внимания
- Планирование повторения сложных стихов
- Анализ эффективности методики запоминания
- Подбор стихов для разных групп (легкие для младших, сложные для старших)

### 2.3. Временные ряды

#### 2.3.1. По урокам

**Описание:** Детальная статистика за каждый урок.

**Данные:**
- Дата урока
- Баллы за урок (points)
- Компоненты (золотые стихи, тест, тетрадь, спевка)
- Получен ли домик

**Использование:**
- Детальный анализ успеваемости
- Выявление проблемных уроков
- Отслеживание прогресса по конкретным темам

#### 2.3.2. По неделям

**Описание:** Агрегированная статистика за неделю.

**Метрики:**
- Средний балл за неделю
- Количество уроков за неделю
- Процент посещаемости
- Процент выполнения по компонентам

**Использование:**
- Еженедельный мониторинг прогресса
- Выявление недель с низкой успеваемостью
- Сравнение недель между собой

#### 2.3.3. По месяцам

**Описание:** Агрегированная статистика за месяц.

**Метрики:**
- Средний балл за месяц
- Количество уроков за месяц
- Процент посещаемости
- Тренды по компонентам
- Сравнение с предыдущими месяцами

**Использование:**
- Месячный отчет для родителей
- Анализ долгосрочных трендов
- Выявление сезонных паттернов

#### 2.3.4. По учебному году

**Описание:** Общая статистика за учебный год.

**Метрики:**
- Общие баллы за год
- Средний балл за год
- Общая посещаемость
- Общая статистика по компонентам
- Прогресс за год (сравнение начала и конца года)

**Использование:**
- Годовой отчет для ученика
- Оценка прогресса за год
- Подготовка к следующему году

### 2.4. Сравнительные показатели

#### 2.4.1. Сравнение с группой

**Описание:** Сравнение показателей ученика со средними показателями группы.

**Метрики:**
- `pointsVsGroupAverage` — разница баллов со средним по группе
- `attendanceVsGroupAverage` — разница посещаемости со средним по группе
- `rankInGroup` — место в рейтинге группы

**Визуализация:**
- Сравнительная столбчатая диаграмма: ученик vs группа
- Индикатор позиции: место в рейтинге

#### 2.4.2. Тренды

**Описание:** Анализ трендов (улучшение/ухудшение показателей).

**Метрики:**
- `pointsTrend` — тренд по баллам (improving/declining/stable)
- `componentTrends` — тренды по каждому компоненту
- `overallTrend` — общий тренд успеваемости

**Алгоритм определения тренда:**
```
if (recentAverage > previousAverage * 1.1) → "improving"
else if (recentAverage < previousAverage * 0.9) → "declining"
else → "stable"
```

**Визуализация:**
- Линейный график с тренд-линией
- Индикатор тренда: стрелка вверх/вниз/стабильно

---

## 3. Показатели успеваемости группы

### 3.1. Агрегированные показатели

#### 3.1.1. Средний балл группы

**Описание:** Средний балл всех учеников группы за период.

**Метрики:**
- `groupAveragePoints` — средний балл группы
- `groupMaxPoints` — максимальный балл в группе
- `groupMinPoints` — минимальный балл в группе
- `groupPointsTrend` — тренд среднего балла группы

**Формула:**
```
groupAveragePoints = sum(allPupilsPoints) / (numberOfPupils * numberOfLessons)
```

**Визуализация:**
- Линейный график: средний балл группы с течением времени
- Область графика: минимальный и максимальный балл

#### 3.1.2. Средний процент посещаемости группы

**Описание:** Средний процент посещаемости всех учеников группы.

**Метрики:**
- `groupAverageAttendance` — средний процент посещаемости
- `groupAttendanceTrend` — тренд посещаемости

**Формула:**
```
groupAverageAttendance = sum(allPupilsAttendanceRate) / numberOfPupils
```

**Визуализация:**
- Линейный график: посещаемость группы по месяцам
- Индикатор: процент посещаемости с цветовой индикацией

#### 3.1.3. Средний процент выполнения ДЗ по компонентам

**Описание:** Средние показатели выполнения ДЗ по каждому компоненту.

**Метрики:**
- `groupAverageGoldenVerseRate` — средний процент выполнения золотых стихов
- `groupAverageTestRate` — средний процент выполнения тестов
- `groupAverageNotebookRate` — средний процент выполнения тетрадей
- `groupAverageSingingRate` — средний процент посещения спевок

**Визуализация:**
- Столбчатая диаграмма: сравнение компонентов
- Круговая диаграмма: распределение по компонентам

### 3.2. Сравнительные показатели

#### 3.2.1. Топ-10 учеников группы

**Описание:** Рейтинг лучших учеников группы по баллам за период.

**Метрики:**
- Ранг ученика (1-10)
- Общие баллы
- Средний балл за урок
- Процент посещаемости

**Визуализация:**
- Таблица рейтинга: топ-10 учеников
- Столбчатая диаграмма: баллы топ-10

#### 3.2.2. Распределение баллов

**Описание:** Распределение учеников по диапазонам баллов.

**Диапазоны:**
- 0-10 баллов — низкая успеваемость
- 11-20 баллов — средняя успеваемость
- 21-30 баллов — хорошая успеваемость
- 31+ баллов — отличная успеваемость

**Метрики:**
- Количество учеников в каждом диапазоне
- Процент учеников в каждом диапазоне

**Визуализация:**
- Гистограмма: распределение баллов
- Круговая диаграмма: процентное распределение

#### 3.2.3. Сравнение с другими группами

**Описание:** Сравнение показателей группы с другими группами (если доступно).

**Метрики:**
- Средний балл группы vs средний балл других групп
- Рейтинг группы среди всех групп
- Процент посещаемости vs другие группы

**Визуализация:**
- Сравнительная столбчатая диаграмма: группа vs другие группы
- Таблица сравнения: все группы

### 3.3. Временные ряды

#### 3.3.1. Динамика по месяцам

**Описание:** Агрегированная статистика группы по месяцам.

**Метрики:**
- Средний балл группы за месяц
- Средний процент посещаемости за месяц
- Количество проведенных уроков
- Тренды по компонентам

**Визуализация:**
- Линейный график: средний балл по месяцам
- Столбчатая диаграмма: количество уроков по месяцам

#### 3.3.2. Динамика по неделям

**Описание:** Агрегированная статистика группы по неделям.

**Метрики:**
- Средний балл группы за неделю
- Средний процент посещаемости за неделю
- Количество уроков за неделю

**Визуализация:**
- Линейный график: средний балл по неделям
- Область графика: минимальный и максимальный балл

### 3.4. Дополнительные показатели

#### 3.4.1. Эффективность учителя

**Описание:** Показатели эффективности работы учителя на основе успеваемости группы.

**Метрики:**
- Средний балл группы (индикатор качества преподавания)
- Процент посещаемости (индикатор вовлеченности)
- Прогресс группы за период (тренд улучшения)
- Количество проведенных уроков

**Визуализация:**
- Дашборд эффективности: все метрики в одном месте
- Индикатор прогресса: улучшение/ухудшение показателей

#### 3.4.2. Статистика по урокам

**Описание:** Статистика по проведенным урокам.

**Метрики:**
- `lessonsCount` — количество проведенных уроков за период
- `lessonsAveragePoints` — средний балл за урок
- `lessonsWithHighScores` — количество уроков с высоким средним баллом (>= 25)

**Визуализация:**
- Столбчатая диаграмма: количество уроков по месяцам
- Линейный график: средний балл за урок по времени

---

## 4. Access Patterns для аналитики

### 4.1. Обзор

Access patterns определяют, как данные будут запрашиваться из DynamoDB для генерации аналитических отчетов. Правильный выбор access patterns критически важен для производительности.

### 4.2. Access Patterns для ученика

#### AP-ANALYTICS-1: История успеваемости ученика за период

**Описание:** Получить все проверки ДЗ ученика за указанный период для построения временных рядов.

**Таблица:** `HomeworkChecks`  
**Index:** `GSI-2: pupilId-createdAt-index`  
**Операция:** Query

**Пример запроса:**
```typescript
await client.query({
  TableName: 'HomeworkChecks',
  IndexName: 'pupilId-createdAt-index',
  KeyConditionExpression: 'pupilId = :pupilId AND createdAt BETWEEN :start AND :end',
  ExpressionAttributeValues: {
    ':pupilId': 'pupil-123',
    ':start': '2024-09-01T00:00:00Z',
    ':end': '2024-12-31T23:59:59Z'
  },
  ScanIndexForward: true // ASC по дате
});
```

**Использование:**
- Построение графиков успеваемости
- Расчет агрегированных показателей
- Анализ трендов
- **Важно:** Отчет включает информацию о посещаемости занятий (lessonsAttended / lessonsTotal) и посещаемости спевок (singingCount)

**Производительность:**
- O(1) для одного ученика
- Зависит от количества уроков за период
- Рекомендуется ограничивать период (максимум 1 год)

#### AP-ANALYTICS-2: Агрегированная статистика ученика за период

**Описание:** Получить агрегированную статистику ученика (суммы, средние значения) за период.

**Таблица:** `HomeworkChecks`  
**Index:** `GSI-2: pupilId-createdAt-index`  
**Операция:** Query + агрегация на клиенте

**Пример запроса:**
```typescript
// 1. Получить все проверки
const checks = await client.query({
  TableName: 'HomeworkChecks',
  IndexName: 'pupilId-createdAt-index',
  KeyConditionExpression: 'pupilId = :pupilId AND createdAt BETWEEN :start AND :end',
  ExpressionAttributeValues: {
    ':pupilId': 'pupil-123',
    ':start': '2024-09-01T00:00:00Z',
    ':end': '2024-12-31T23:59:59Z'
  }
});

// 2. Агрегация на клиенте
const stats = {
  totalPoints: checks.Items.reduce((sum, check) => sum + check.points, 0),
  averagePoints: checks.Items.reduce((sum, check) => sum + check.points, 0) / checks.Items.length,
  lessonsCount: checks.Items.length,
  // ... другие метрики
};
```

**Использование:**
- Быстрое отображение общей статистики
- Сравнение периодов
- Дашборд ученика
- **Важно:** Отчет включает информацию о посещаемости занятий (lessonsAttended / lessonsTotal) и посещаемости спевок (singingCount)

**Оптимизация:**
- Для больших периодов использовать таблицу `AnalyticsAggregates` (кэширование)

### 4.3. Access Patterns для группы

#### AP-ANALYTICS-3: История успеваемости группы за период

**Описание:** Получить все проверки ДЗ всех учеников группы за период.

**Таблица:** `HomeworkChecks`  
**Index:** `GSI-3: gradeId-createdAt-index` (новый GSI для аналитики)  
**Операция:** Query

**Пример запроса:**
```typescript
await client.query({
  TableName: 'HomeworkChecks',
  IndexName: 'gradeId-createdAt-index', // Новый GSI-3
  KeyConditionExpression: 'gradeId = :gradeId AND createdAt BETWEEN :start AND :end',
  ExpressionAttributeValues: {
    ':gradeId': 'grade-123',
    ':start': '2024-09-01T00:00:00Z',
    ':end': '2024-12-31T23:59:59Z'
  },
  ScanIndexForward: true // ASC по дате
});
```

**Использование:**
- Построение графиков успеваемости группы
- Расчет агрегированных показателей группы
- Анализ трендов группы

**Производительность:**
- O(1) для одной группы
- Зависит от количества учеников и уроков
- Рекомендуется ограничивать период (максимум 1 год)

**Важно:** Этот GSI необходимо создать на этапе MVP для поддержки аналитики post-MVP.

#### AP-ANALYTICS-4: Топ учеников группы за период

**Описание:** Получить список лучших учеников группы по баллам за период.

**Таблица:** `HomeworkChecks`  
**Index:** `GSI-3: gradeId-createdAt-index`  
**Операция:** Query + сортировка + limit

**Пример запроса:**
```typescript
// 1. Получить все проверки группы
const checks = await client.query({
  TableName: 'HomeworkChecks',
  IndexName: 'gradeId-createdAt-index',
  KeyConditionExpression: 'gradeId = :gradeId AND createdAt BETWEEN :start AND :end',
  ExpressionAttributeValues: {
    ':gradeId': 'grade-123',
    ':start': '2024-09-01T00:00:00Z',
    ':end': '2024-12-31T23:59:59Z'
  }
});

// 2. Агрегация по ученикам и сортировка
const pupilStats = checks.Items.reduce((acc, check) => {
  if (!acc[check.pupilId]) {
    acc[check.pupilId] = { pupilId: check.pupilId, totalPoints: 0, lessonsCount: 0 };
  }
  acc[check.pupilId].totalPoints += check.points;
  acc[check.pupilId].lessonsCount += 1;
  return acc;
}, {});

// 3. Сортировка и топ-10
const topPupils = Object.values(pupilStats)
  .sort((a, b) => b.totalPoints - a.totalPoints)
  .slice(0, 10);
```

**Использование:**
- Рейтинг группы
- Мотивация учеников
- Выявление лидеров

#### AP-ANALYTICS-5: Сравнительная статистика групп

**Описание:** Получить статистику нескольких групп для сравнения.

**Таблица:** `HomeworkChecks` + `Grades`  
**Операция:** Multiple queries + агрегация

**Пример запроса:**
```typescript
// Параллельные запросы для нескольких групп
const [group1Stats, group2Stats, group3Stats] = await Promise.all([
  getGroupStats('grade-123', startDate, endDate),
  getGroupStats('grade-456', startDate, endDate),
  getGroupStats('grade-789', startDate, endDate)
]);

// Сравнение
const comparison = {
  group1: group1Stats,
  group2: group2Stats,
  group3: group3Stats,
  average: calculateAverage([group1Stats, group2Stats, group3Stats])
};
```

**Использование:**
- Сравнение эффективности групп
- Выявление лучших практик
- Анализ для руководства

**Производительность:**
- Использовать параллельные запросы (Promise.all)
- Ограничивать количество групп (максимум 5-10)

### 4.4. Дополнительные Access Patterns

#### AP-ANALYTICS-6: Список золотых стихов группы за учебный год

**Описание:** Получить список всех золотых стихов с ссылками на места в Библии и текстом стиха, которые учили в конкретной группе в конкретном учебном году.

**Таблица:** `Lessons` + `LessonGoldenVerses` + `GoldenVerses`  
**Index:** GSI-1 (Lessons: academicYearId-lessonDate) + GSI-1 (LessonGoldenVerses: lessonId-order) + Batch Get  
**Операция:** Multiple Queries + Batch Get

**Пример запроса:**
```typescript
// 1. Получить все уроки учебного года
const lessons = await client.query({
  TableName: 'Lessons',
  IndexName: 'academicYearId-lessonDate-index',
  KeyConditionExpression: 'academicYearId = :yearId',
  ExpressionAttributeValues: { ':yearId': 'year-456' },
  ScanIndexForward: true // ASC по дате
});

// 2. Для каждого урока получить стихи
const lessonVerseIds = [];
for (const lesson of lessons.Items) {
  const lessonVerses = await client.query({
    TableName: 'LessonGoldenVerses',
    IndexName: 'lessonId-order-index',
    KeyConditionExpression: 'lessonId = :lessonId',
    ExpressionAttributeValues: { ':lessonId': lesson.id }
  });
  lessonVerseIds.push(...lessonVerses.Items.map(lv => lv.goldenVerseId));
}

// 3. Дедупликация и Batch Get стихов
const uniqueVerseIds = [...new Set(lessonVerseIds)];
const verses = await client.batchGet({
  RequestItems: {
    'GoldenVerses': {
      Keys: uniqueVerseIds.map(id => ({ id }))
    }
  }
});

// Результат: список уникальных стихов с reference, text, bookId
```

**Использование:**
- Отображение списка всех стихов, которые учили в группе за год
- Создание печатных материалов для родителей
- Анализ распределения стихов по книгам Библии

**Производительность:**
- Зависит от количества уроков в году
- Рекомендуется использовать параллельные запросы для получения стихов уроков
- Batch Get эффективен для получения стихов (до 100 items за раз)

#### AP-ANALYTICS-7: Аналитика сложности золотых стихов

**Описание:** Определить, какие стихи легкие для детей (больше детей получило максимальное количество баллов), а какие сложные.

**Таблица:** `HomeworkChecks` + `Lessons` + `LessonGoldenVerses`  
**Index:** GSI-3 (HomeworkChecks: gradeId-createdAt) + GSI-1 (Lessons: academicYearId-lessonDate) + GSI-1 (LessonGoldenVerses: lessonId-order) + GSI-2 (LessonGoldenVerses: goldenVerseId)  
**Операция:** Query + агрегация на клиенте

**Пример запроса:**
```typescript
// 1. Получить все проверки группы за учебный год
const checks = await client.query({
  TableName: 'HomeworkChecks',
  IndexName: 'gradeId-createdAt-index',
  KeyConditionExpression: 'gradeId = :gradeId AND createdAt BETWEEN :start AND :end',
  ExpressionAttributeValues: {
    ':gradeId': 'grade-123',
    ':start': '2024-09-01T00:00:00Z',
    ':end': '2025-05-31T23:59:59Z'
  }
});

// 2. Для каждой проверки получить урок и стихи урока
const verseStats = new Map<string, { 
  totalChecks: number; 
  maxScoreCount: number; 
  totalScore: number 
}>();

for (const check of checks.Items) {
  // Получить урок
  const lesson = await amplifyData.get('Lesson', { id: check.lessonId });
  
  // Получить стихи урока
  const lessonVerses = await client.query({
    TableName: 'LessonGoldenVerses',
    IndexName: 'lessonId-order-index',
    KeyConditionExpression: 'lessonId = :lessonId',
    ExpressionAttributeValues: { ':lessonId': check.lessonId },
    ScanIndexForward: true // ASC по order
  });
  
  // Сопоставить баллы со стихами
  lessonVerses.Items.forEach((lv, index) => {
    const score = index === 0 ? check.goldenVerse1Score : 
                  index === 1 ? check.goldenVerse2Score : 
                  check.goldenVerse3Score;
    
    if (!verseStats.has(lv.goldenVerseId)) {
      verseStats.set(lv.goldenVerseId, { 
        totalChecks: 0, 
        maxScoreCount: 0, 
        totalScore: 0 
      });
    }
    
    const stats = verseStats.get(lv.goldenVerseId)!;
    stats.totalChecks++;
    stats.totalScore += score || 0;
    if (score === 2) stats.maxScoreCount++;
  });
}

// 3. Агрегация результатов
const difficultyAnalysis = Array.from(verseStats.entries()).map(([verseId, stats]) => ({
  goldenVerseId: verseId,
  totalChecks: stats.totalChecks,
  maxScoreCount: stats.maxScoreCount,
  successRate: (stats.maxScoreCount / stats.totalChecks) * 100,
  averageScore: stats.totalScore / stats.totalChecks,
  difficultyLevel: stats.maxScoreCount / stats.totalChecks > 0.8 ? 'легкий' :
                    stats.maxScoreCount / stats.totalChecks > 0.5 ? 'средний' : 'сложный'
}));

// Результат: список стихов с метриками сложности
```

**Использование:**
- Выявление стихов, которые требуют дополнительного внимания
- Планирование повторения сложных стихов
- Анализ эффективности методики запоминания
- Подбор стихов для разных групп

**Производительность:**
- Зависит от количества проверок и уроков
- Рекомендуется ограничивать период (максимум 1 учебный год)
- Можно оптимизировать через кэширование результатов (AnalyticsAggregates)

#### AP-ANALYTICS-8: Статистика по урокам группы

**Описание:** Получить статистику по каждому уроку группы.

**Таблица:** `Lessons` + `HomeworkChecks`  
**Операция:** Query + Join на клиенте

**Пример:**
```typescript
// 1. Получить уроки группы
const lessons = await client.query({
  TableName: 'Lessons',
  IndexName: 'gradeId-lessonDate-index',
  KeyConditionExpression: 'gradeId = :gradeId AND lessonDate BETWEEN :start AND :end',
  ExpressionAttributeValues: {
    ':gradeId': 'grade-123',
    ':start': '2024-09-01',
    ':end': '2024-12-31'
  }
});

// 2. Для каждого урока получить проверки
const lessonsWithStats = await Promise.all(
  lessons.Items.map(async (lesson) => {
    const checks = await client.query({
      TableName: 'HomeworkChecks',
      IndexName: 'lessonId-pupilId-index',
      KeyConditionExpression: 'lessonId = :lessonId',
      ExpressionAttributeValues: { ':lessonId': lesson.id }
    });
    
    return {
      ...lesson,
      averagePoints: checks.Items.reduce((sum, c) => sum + c.points, 0) / checks.Items.length,
      pupilsCount: checks.Items.length
    };
  })
);
```

---

## 5. Структура базы данных для аналитики

### 5.1. Дополнения к существующим таблицам

#### 5.1.1. HomeworkChecks: GSI-3 для аналитики

> [!IMPORTANT]
> **Критически важно:** Для создания GSI-3 в таблице HomeworkChecks необходимо добавить поле `gradeId` (денормализация из Lesson.gradeId). Это поле должно быть добавлено на этапе MVP вместе с GSI-3.

**Новый Global Secondary Index:**

**GSI-3: gradeId-createdAt-index**
- **Partition Key (PK):** `gradeId` (String)
- **Sort Key (SK):** `createdAt` (String, ISO 8601)
- **Projection:** ALL
- **Use Case:** История успеваемости группы, топ учеников, аналитика по группе

**Обоснование:**
- Необходим для эффективных запросов по группе за период
- Позволяет получить все проверки группы одним запросом
- Критически важен для аналитики post-MVP
- Требует наличия поля `gradeId` в HomeworkCheck (денормализация из Lesson.gradeId)

**Важно:** 
- Этот GSI должен быть создан на этапе MVP, даже если аналитика будет реализована post-MVP
- Поле `gradeId` должно быть добавлено в тип HomeworkCheck в GraphQL схеме
- Поле должно заполняться автоматически при создании HomeworkCheck из Lesson.gradeId

**Пример использования:**
```typescript
// Получить все проверки группы за сентябрь 2024
await client.query({
  TableName: 'HomeworkChecks',
  IndexName: 'gradeId-createdAt-index',
  KeyConditionExpression: 'gradeId = :gradeId AND createdAt BETWEEN :start AND :end',
  ExpressionAttributeValues: {
    ':gradeId': 'grade-123',
    ':start': '2024-09-01T00:00:00Z',
    ':end': '2024-09-30T23:59:59Z'
  }
});
```

### 5.2. Опциональная таблица для оптимизации

#### 5.2.1. AnalyticsAggregates (опционально)

**Назначение:** Кэширование агрегированных данных для оптимизации производительности аналитики.

**Структура:**

| Атрибут | Тип | Описание |
|---------|-----|----------|
| id | String | PK: entityType-entityId-period (например, "pupil-pupil-123-2024-09") |
| entityType | String | Тип сущности: "pupil" \| "grade" |
| entityId | String | ID сущности (pupilId или gradeId) |
| period | String | Период: "2024-09" (год-месяц) или "2024-W39" (год-неделя) |
| periodType | String | Тип периода: "month" \| "week" \| "year" |
| totalPoints | Number | Суммарные баллы за период |
| averagePoints | Number | Средний балл за период |
| lessonsCount | Number | Количество уроков за период |
| attendanceRate | Number | Процент посещаемости |
| goldenVerseAverage | Number | Средний балл за золотые стихи |
| testAverage | Number | Средний балл за тесты |
| notebookAverage | Number | Средний балл за тетради |
| singingRate | Number | Процент посещения спевок |
| houseCount | Number | Количество домиков |
| ttl | Number | TTL для автоматической очистки (timestamp) |
| createdAt | String | Дата создания агрегата |
| updatedAt | String | Дата обновления агрегата |

**Primary Key:**
- **Partition Key (PK):** `id` (String)
- **Sort Key (SK):** Нет

**Global Secondary Indexes:**

**GSI-1: entityType-entityId-period-index**
- **PK:** entityType (String)
- **SK:** entityId-period (String, composite)
- **Projection:** ALL
- **Use Case:** Получить агрегированные данные для сущности за период

**Пример использования:**
```typescript
// Получить агрегированные данные ученика за месяц
await client.query({
  TableName: 'AnalyticsAggregates',
  IndexName: 'entityType-entityId-period-index',
  KeyConditionExpression: 'entityType = :type AND entityId-period = :idPeriod',
  ExpressionAttributeValues: {
    ':type': 'pupil',
    ':idPeriod': 'pupil-123-2024-09'
  }
});
```

**TTL (Time To Live):**
- Автоматическая очистка старых агрегатов
- Рекомендуется: хранить агрегаты за последние 2 года
- TTL = createdAt + 2 years (в секундах)

**Обновление агрегатов:**
- При создании/обновлении HomeworkCheck обновлять соответствующие агрегаты
- Использовать DynamoDB Transactions для консистентности
- Можно обновлять асинхронно (через Lambda или AppSync Resolver)

**Когда использовать:**
- Для больших периодов (> 3 месяцев)
- Для часто запрашиваемых данных
- Для дашбордов с множеством метрик

**Когда НЕ использовать:**
- Для небольших периодов (< 1 месяца) — проще агрегировать на клиенте
- Для редко запрашиваемых данных — избыточно

---

## 6. Примеры запросов к DynamoDB

### 6.1. История успеваемости ученика

```typescript
/**
 * Получить историю успеваемости ученика за период
 */
async function getPupilPerformanceHistory(
  pupilId: string,
  startDate: string,
  endDate: string
) {
  const checks = await client.query({
    TableName: 'HomeworkChecks',
    IndexName: 'pupilId-createdAt-index',
    KeyConditionExpression: 'pupilId = :pupilId AND createdAt BETWEEN :start AND :end',
    ExpressionAttributeValues: {
      ':pupilId': pupilId,
      ':start': startDate,
      ':end': endDate
    },
    ScanIndexForward: true // ASC по дате
  });

  // Агрегация
  const stats = {
    totalPoints: 0,
    lessonsCount: checks.Items.length,
    goldenVerseTotal: 0,
    testTotal: 0,
    notebookTotal: 0,
    singingCount: 0,
    houseCount: 0
  };

  checks.Items.forEach(check => {
    stats.totalPoints += check.points;
    stats.goldenVerseTotal += (check.goldenVerse1Score || 0) + 
                              (check.goldenVerse2Score || 0) + 
                              (check.goldenVerse3Score || 0);
    stats.testTotal += check.testScore || 0;
    stats.notebookTotal += check.notebookScore || 0;
    if (check.singing) stats.singingCount++;
    if (check.hasHouse) stats.houseCount++;
  });

  return {
    history: checks.Items,
    aggregated: {
      averagePoints: stats.totalPoints / stats.lessonsCount,
      averageGoldenVerse: stats.goldenVerseTotal / stats.lessonsCount,
      averageTest: stats.testTotal / stats.lessonsCount,
      averageNotebook: stats.notebookTotal / stats.lessonsCount,
      singingRate: (stats.singingCount / stats.lessonsCount) * 100,
      houseRate: (stats.houseCount / stats.lessonsCount) * 100
    }
  };
}
```

### 6.2. История успеваемости группы

```typescript
/**
 * Получить историю успеваемости группы за период
 */
async function getGradePerformanceHistory(
  gradeId: string,
  startDate: string,
  endDate: string
) {
  const checks = await client.query({
    TableName: 'HomeworkChecks',
    IndexName: 'gradeId-createdAt-index', // GSI-3
    KeyConditionExpression: 'gradeId = :gradeId AND createdAt BETWEEN :start AND :end',
    ExpressionAttributeValues: {
      ':gradeId': gradeId,
      ':start': startDate,
      ':end': endDate
    },
    ScanIndexForward: true
  });

  // Агрегация по ученикам
  const pupilStats = checks.Items.reduce((acc, check) => {
    if (!acc[check.pupilId]) {
      acc[check.pupilId] = {
        pupilId: check.pupilId,
        totalPoints: 0,
        lessonsCount: 0,
        goldenVerseTotal: 0,
        testTotal: 0,
        notebookTotal: 0,
        singingCount: 0,
        houseCount: 0
      };
    }
    const stats = acc[check.pupilId];
    stats.totalPoints += check.points;
    stats.lessonsCount++;
    stats.goldenVerseTotal += (check.goldenVerse1Score || 0) + 
                              (check.goldenVerse2Score || 0) + 
                              (check.goldenVerse3Score || 0);
    stats.testTotal += check.testScore || 0;
    stats.notebookTotal += check.notebookScore || 0;
    if (check.singing) stats.singingCount++;
    if (check.hasHouse) stats.houseCount++;
    return acc;
  }, {});

  // Групповая агрегация
  const groupStats = Object.values(pupilStats).reduce((acc, pupil) => {
    acc.totalPoints += pupil.totalPoints;
    acc.lessonsCount += pupil.lessonsCount;
    acc.goldenVerseTotal += pupil.goldenVerseTotal;
    acc.testTotal += pupil.testTotal;
    acc.notebookTotal += pupil.notebookTotal;
    acc.singingCount += pupil.singingCount;
    acc.houseCount += pupil.houseCount;
    acc.pupilsCount++;
    return acc;
  }, {
    totalPoints: 0,
    lessonsCount: 0,
    goldenVerseTotal: 0,
    testTotal: 0,
    notebookTotal: 0,
    singingCount: 0,
    houseCount: 0,
    pupilsCount: 0
  });

  const totalLessons = groupStats.lessonsCount;

  return {
    groupAveragePoints: groupStats.totalPoints / totalLessons,
    groupAverageGoldenVerse: groupStats.goldenVerseTotal / totalLessons,
    groupAverageTest: groupStats.testTotal / totalLessons,
    groupAverageNotebook: groupStats.notebookTotal / totalLessons,
    groupSingingRate: (groupStats.singingCount / totalLessons) * 100,
    groupHouseRate: (groupStats.houseCount / totalLessons) * 100,
    pupilsCount: groupStats.pupilsCount,
    topPupils: Object.values(pupilStats)
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(0, 10)
  };
}
```

### 6.3. Использование агрегированных данных

```typescript
/**
 * Получить агрегированные данные ученика за месяц (из кэша)
 */
async function getPupilAggregatedData(
  pupilId: string,
  period: string // "2024-09"
) {
  const aggregate = await client.query({
    TableName: 'AnalyticsAggregates',
    IndexName: 'entityType-entityId-period-index',
    KeyConditionExpression: 'entityType = :type AND entityId-period = :idPeriod',
    ExpressionAttributeValues: {
      ':type': 'pupil',
      ':idPeriod': `${pupilId}-${period}`
    }
  });

  if (aggregate.Items.length > 0) {
    return aggregate.Items[0]; // Возвращаем кэшированные данные
  }

  // Если кэша нет, вычисляем и сохраняем
  const stats = await calculateAndCachePupilStats(pupilId, period);
  return stats;
}
```

---

## 7. Рекомендации по оптимизации

### 7.1. Производительность запросов

**Рекомендации:**

1. **Ограничивать период запросов:**
   - Максимум 1 год за раз
   - Для больших периодов использовать агрегированные данные

2. **Использовать параллельные запросы:**
   - Для нескольких групп использовать `Promise.all`
   - Для нескольких учеников использовать `Promise.all`

3. **Кэширование агрегированных данных:**
   - Использовать таблицу `AnalyticsAggregates` для больших периодов
   - Обновлять агрегаты при изменении данных

4. **Пагинация для больших результатов:**
   - Использовать `Limit` и `ExclusiveStartKey` для больших запросов
   - Загружать данные порциями

### 7.2. Стоимость запросов

**Оценка стоимости (US East):**

- **Read Request:** $0.25 за миллион запросов
- **Write Request:** $1.25 за миллион запросов

**Пример расчета:**
- 100 учеников, запрос истории за месяц (4 урока)
- 100 queries × 4 урока = 400 read requests
- Стоимость: ~$0.0001 (практически бесплатно)

**Оптимизация:**
- Использовать агрегированные данные для снижения количества запросов
- Кэшировать результаты на клиенте (если данные не изменились)

### 7.3. Масштабирование

**Рекомендации:**

1. **Для небольших групп (< 20 учеников):**
   - Агрегация на клиенте достаточна
   - Не требуется таблица `AnalyticsAggregates`

2. **Для средних групп (20-50 учеников):**
   - Рассмотреть использование `AnalyticsAggregates` для периодов > 3 месяцев
   - Агрегация на клиенте для небольших периодов

3. **Для больших групп (> 50 учеников):**
   - Обязательно использовать `AnalyticsAggregates`
   - Обновлять агрегаты асинхронно (Lambda/AppSync Resolver)

---

## 8. Интеграция с другими документами

### 8.1. Связанные документы

- **[DYNAMODB_SCHEMA.md](DYNAMODB_SCHEMA.md)** — структура таблиц и индексов
- **[DATA_MODELING.md](DATA_MODELING.md)** — стратегии моделирования данных и access patterns
- **[GRAPHQL_SCHEMA.md](GRAPHQL_SCHEMA.md)** — GraphQL API для аналитики (post-MVP)
- **[SERVER_ACTIONS.md](../api/SERVER_ACTIONS.md)** — Server Actions для аналитики (post-MVP)

### 8.2. Зависимости

**MVP:**
- Создание GSI-3 для `HomeworkChecks` (gradeId-createdAt-index)
- Документация access patterns

**Post-MVP:**
- Реализация аналитических отчетов
- Создание UI компонентов для графиков
- Реализация экспорта отчетов (PDF, Excel)
- Опционально: создание таблицы `AnalyticsAggregates`

---

## 9. Заключение

Документация по аналитике учебного процесса определяет:

✅ **Показатели успеваемости** учеников и групп с детальной разработкой  
✅ **Access patterns** для эффективных запросов к DynamoDB  
✅ **Структуру базы данных** для поддержки аналитики (GSI-3 для HomeworkChecks)  
✅ **Примеры запросов** и рекомендации по оптимизации  

**Критически важно:** Структура БД для аналитики (GSI-3) должна быть создана на этапе MVP, даже если сам функционал аналитики будет реализован post-MVP. Это предотвратит необходимость миграции данных в будущем.

---

**Документ статус:** Активный  
**Следующий обзор:** После реализации MVP  
**Поддерживается:** Development Team

