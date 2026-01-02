/**
 * Вспомогательный скрипт для генерации обновленного seed-db-data.ts с UUID
 * Генерирует фиксированные UUID для всех записей на основе их старых ID
 * 
 * Usage:
 *   npx tsx scripts/generate-uuid-seed-data.ts
 * 
 * Output:
 *   - Выводит обновленный код в консоль (можно перенаправить в файл)
 */

import { randomUUID } from 'crypto';
import { readFileSync } from 'fs';
import { join } from 'path';

// Маппинг старых ID -> новых UUID (для сохранения связей)
const idMapping: Record<string, string> = {};

/**
 * Получить или создать UUID для ID
 */
function getUUID(oldId: string): string {
  if (!idMapping[oldId]) {
    idMapping[oldId] = randomUUID();
  }
  return idMapping[oldId];
}

/**
 * Заменить все ID в строке на UUID
 */
function replaceIds(text: string): string {
  // Заменяем все строковые ID на UUID
  // Паттерн: 'old-id' -> 'new-uuid'
  const idPattern = /id:\s*['"]([^'"]+)['"]/g;
  
  return text.replace(idPattern, (match, oldId) => {
    // Пропускаем UUID (уже в формате UUID)
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(oldId)) {
      return match;
    }
    const newUUID = getUUID(oldId);
    return match.replace(oldId, newUUID);
  });
}

// Читаем текущий seed-db-data.ts
const seedDataPath = join(__dirname, 'seed-db-data.ts');
const seedDataContent = readFileSync(seedDataPath, 'utf-8');

// Заменяем ID на UUID
const updatedContent = replaceIds(seedDataContent);

// Выводим результат
console.log(updatedContent);

// Выводим маппинг для справки
console.error('\n// ID Mapping (для справки):');
console.error('// Старый ID -> Новый UUID');
for (const [oldId, newUUID] of Object.entries(idMapping)) {
  console.error(`// ${oldId} -> ${newUUID}`);
}

