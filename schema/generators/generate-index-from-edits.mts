import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const editsPath = path.resolve(__dirname, '../schema-edits.json');
const outputPath = path.resolve(__dirname, '../lib/supabase/_generated/index.ts');

function toPascalCase(str: string): string {
  return str
    .replace(/_/g, ' ')
    .replace(/\w\S*/g, (txt) => txt[0].toUpperCase() + txt.slice(1))
    .replace(/\s+/g, '');
}

async function generateIndexFile() {
  try {
    const data = await readFile(editsPath, 'utf-8');
    const tables = JSON.parse(data);

    let content = `// AUTO-GENERATED — DO NOT EDIT\n\n`;

    for (const table of tables) {
      if (!table.name) continue;

      const typeName = toPascalCase(table.name);
      content += `export type { ${typeName} } from './generated-types';\n`;
      content += `export * as ${table.name}Queries from './queries/${table.name}';\n`;
      content += `export * as ${table.name}Client from './clients/${table.name}';\n\n`;
    }

    await writeFile(outputPath, content, 'utf-8');
    console.log(`✅ Generated index file: ${outputPath}`);
  } catch (err) {
    console.error('❌ Failed to generate index:', err instanceof Error ? err.message : err);
  }
}

generateIndexFile();