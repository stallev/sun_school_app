/**
 * Данные для заполнения таблицы Books (66 книг Библии)
 * Используется при инициализации базы данных
 */

export interface BookSeedData {
  fullName: string;
  shortName: string;
  abbreviation: string;
  testament: 'OLD' | 'NEW';
  order: number;
}

export const booksSeedData: BookSeedData[] = [
  // Ветхий Завет (39 книг)
  { fullName: 'Бытие', shortName: 'Бытие', abbreviation: 'Быт', testament: 'OLD', order: 1 },
  { fullName: 'Исход', shortName: 'Исход', abbreviation: 'Исх', testament: 'OLD', order: 2 },
  { fullName: 'Левит', shortName: 'Левит', abbreviation: 'Лев', testament: 'OLD', order: 3 },
  { fullName: 'Числа', shortName: 'Числа', abbreviation: 'Чис', testament: 'OLD', order: 4 },
  { fullName: 'Второзаконие', shortName: 'Второзаконие', abbreviation: 'Втор', testament: 'OLD', order: 5 },
  { fullName: 'Иисус Навин', shortName: 'Иисус Навин', abbreviation: 'Нав', testament: 'OLD', order: 6 },
  { fullName: 'Судьи', shortName: 'Судьи', abbreviation: 'Суд', testament: 'OLD', order: 7 },
  { fullName: 'Руфь', shortName: 'Руфь', abbreviation: 'Руф', testament: 'OLD', order: 8 },
  { fullName: '1 Царств', shortName: '1 Царств', abbreviation: '1Цар', testament: 'OLD', order: 9 },
  { fullName: '2 Царств', shortName: '2 Царств', abbreviation: '2Цар', testament: 'OLD', order: 10 },
  { fullName: '3 Царств', shortName: '3 Царств', abbreviation: '3Цар', testament: 'OLD', order: 11 },
  { fullName: '4 Царств', shortName: '4 Царств', abbreviation: '4Цар', testament: 'OLD', order: 12 },
  { fullName: '1 Паралипоменон', shortName: '1 Паралипоменон', abbreviation: '1Пар', testament: 'OLD', order: 13 },
  { fullName: '2 Паралипоменон', shortName: '2 Паралипоменон', abbreviation: '2Пар', testament: 'OLD', order: 14 },
  { fullName: 'Ездра', shortName: 'Ездра', abbreviation: 'Езд', testament: 'OLD', order: 15 },
  { fullName: 'Неемия', shortName: 'Неемия', abbreviation: 'Неем', testament: 'OLD', order: 16 },
  { fullName: 'Есфирь', shortName: 'Есфирь', abbreviation: 'Есф', testament: 'OLD', order: 17 },
  { fullName: 'Иов', shortName: 'Иов', abbreviation: 'Иов', testament: 'OLD', order: 18 },
  { fullName: 'Псалтирь', shortName: 'Псалтирь', abbreviation: 'Пс', testament: 'OLD', order: 19 },
  { fullName: 'Притчи Соломоновы', shortName: 'Притчи', abbreviation: 'Прит', testament: 'OLD', order: 20 },
  { fullName: 'Екклесиаст', shortName: 'Екклесиаст', abbreviation: 'Екк', testament: 'OLD', order: 21 },
  { fullName: 'Песнь песней Соломона', shortName: 'Песнь песней', abbreviation: 'Песн', testament: 'OLD', order: 22 },
  { fullName: 'Исаия', shortName: 'Исаия', abbreviation: 'Ис', testament: 'OLD', order: 23 },
  { fullName: 'Иеремия', shortName: 'Иеремия', abbreviation: 'Иер', testament: 'OLD', order: 24 },
  { fullName: 'Плач Иеремии', shortName: 'Плач Иеремии', abbreviation: 'Плач', testament: 'OLD', order: 25 },
  { fullName: 'Иезекииль', shortName: 'Иезекииль', abbreviation: 'Иез', testament: 'OLD', order: 26 },
  { fullName: 'Даниил', shortName: 'Даниил', abbreviation: 'Дан', testament: 'OLD', order: 27 },
  { fullName: 'Осия', shortName: 'Осия', abbreviation: 'Ос', testament: 'OLD', order: 28 },
  { fullName: 'Иоиль', shortName: 'Иоиль', abbreviation: 'Иоил', testament: 'OLD', order: 29 },
  { fullName: 'Амос', shortName: 'Амос', abbreviation: 'Ам', testament: 'OLD', order: 30 },
  { fullName: 'Авдий', shortName: 'Авдий', abbreviation: 'Авд', testament: 'OLD', order: 31 },
  { fullName: 'Иона', shortName: 'Иона', abbreviation: 'Ион', testament: 'OLD', order: 32 },
  { fullName: 'Михей', shortName: 'Михей', abbreviation: 'Мих', testament: 'OLD', order: 33 },
  { fullName: 'Наум', shortName: 'Наум', abbreviation: 'Наум', testament: 'OLD', order: 34 },
  { fullName: 'Аввакум', shortName: 'Аввакум', abbreviation: 'Авв', testament: 'OLD', order: 35 },
  { fullName: 'Софония', shortName: 'Софония', abbreviation: 'Соф', testament: 'OLD', order: 36 },
  { fullName: 'Аггей', shortName: 'Аггей', abbreviation: 'Агг', testament: 'OLD', order: 37 },
  { fullName: 'Захария', shortName: 'Захария', abbreviation: 'Зах', testament: 'OLD', order: 38 },
  { fullName: 'Малахия', shortName: 'Малахия', abbreviation: 'Мал', testament: 'OLD', order: 39 },
  
  // Новый Завет (27 книг)
  { fullName: 'Евангелие от Матфея', shortName: 'Матфея', abbreviation: 'Мф', testament: 'NEW', order: 40 },
  { fullName: 'Евангелие от Марка', shortName: 'Марка', abbreviation: 'Мк', testament: 'NEW', order: 41 },
  { fullName: 'Евангелие от Луки', shortName: 'Луки', abbreviation: 'Лк', testament: 'NEW', order: 42 },
  { fullName: 'Евангелие от Иоанна', shortName: 'Иоанна', abbreviation: 'Ин', testament: 'NEW', order: 43 },
  { fullName: 'Деяния святых Апостолов', shortName: 'Деяния', abbreviation: 'Деян', testament: 'NEW', order: 44 },
  { fullName: 'Послание к Римлянам', shortName: 'Римлянам', abbreviation: 'Рим', testament: 'NEW', order: 45 },
  { fullName: '1 Послание к Коринфянам', shortName: '1 Коринфянам', abbreviation: '1Кор', testament: 'NEW', order: 46 },
  { fullName: '2 Послание к Коринфянам', shortName: '2 Коринфянам', abbreviation: '2Кор', testament: 'NEW', order: 47 },
  { fullName: 'Послание к Галатам', shortName: 'Галатам', abbreviation: 'Гал', testament: 'NEW', order: 48 },
  { fullName: 'Послание к Ефесянам', shortName: 'Ефесянам', abbreviation: 'Еф', testament: 'NEW', order: 49 },
  { fullName: 'Послание к Филиппийцам', shortName: 'Филиппийцам', abbreviation: 'Флп', testament: 'NEW', order: 50 },
  { fullName: 'Послание к Колоссянам', shortName: 'Колоссянам', abbreviation: 'Кол', testament: 'NEW', order: 51 },
  { fullName: '1 Послание к Фессалоникийцам', shortName: '1 Фессалоникийцам', abbreviation: '1Фес', testament: 'NEW', order: 52 },
  { fullName: '2 Послание к Фессалоникийцам', shortName: '2 Фессалоникийцам', abbreviation: '2Фес', testament: 'NEW', order: 53 },
  { fullName: '1 Послание к Тимофею', shortName: '1 Тимофею', abbreviation: '1Тим', testament: 'NEW', order: 54 },
  { fullName: '2 Послание к Тимофею', shortName: '2 Тимофею', abbreviation: '2Тим', testament: 'NEW', order: 55 },
  { fullName: 'Послание к Титу', shortName: 'Титу', abbreviation: 'Тит', testament: 'NEW', order: 56 },
  { fullName: 'Послание к Филимону', shortName: 'Филимону', abbreviation: 'Флм', testament: 'NEW', order: 57 },
  { fullName: 'Послание к Евреям', shortName: 'Евреям', abbreviation: 'Евр', testament: 'NEW', order: 58 },
  { fullName: 'Послание Иакова', shortName: 'Иакова', abbreviation: 'Иак', testament: 'NEW', order: 59 },
  { fullName: '1 Послание Петра', shortName: '1 Петра', abbreviation: '1Пет', testament: 'NEW', order: 60 },
  { fullName: '2 Послание Петра', shortName: '2 Петра', abbreviation: '2Пет', testament: 'NEW', order: 61 },
  { fullName: '1 Послание Иоанна', shortName: '1 Иоанна', abbreviation: '1Ин', testament: 'NEW', order: 62 },
  { fullName: '2 Послание Иоанна', shortName: '2 Иоанна', abbreviation: '2Ин', testament: 'NEW', order: 63 },
  { fullName: '3 Послание Иоанна', shortName: '3 Иоанна', abbreviation: '3Ин', testament: 'NEW', order: 64 },
  { fullName: 'Послание Иуды', shortName: 'Иуды', abbreviation: 'Иуд', testament: 'NEW', order: 65 },
  { fullName: 'Откровение Иоанна Богослова', shortName: 'Откровение', abbreviation: 'Откр', testament: 'NEW', order: 66 },
];

