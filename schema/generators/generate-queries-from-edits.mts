// schema/generate-queries-from-edits.mts
import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const editsPath = path.resolve(__dirname, '../schema-edits.json');
const queriesDir = path.resolve(__dirname, '../../lib/supabase/_generated/queries');

async function ensureDir(dir: string) {
  try {
    await mkdir(dir, { recursive: true });
  } catch {}
}

const toPascalCase = (str: string): string =>
  str.replace(/_/g, ' ')
     .replace(/\w\S*/g, (txt) => txt[0].toUpperCase() + txt.slice(1))
     .replace(/\s+/g, '');

async function generateQueries() {
  try {
    const data = await readFile(editsPath, 'utf-8');
    const tables = JSON.parse(data);
    await ensureDir(queriesDir);

    for (const table of tables) {
      if (!table.name || !Array.isArray(table.columns)) continue;

      const activeColumns = table.columns.filter((column: any) => {
        return !column.delete && column.new !== 'DELETE';
      });

      if (activeColumns.length === 0) continue;

      const typeName = toPascalCase(table.name);
      const filePath = path.join(queriesDir, `${table.name}.ts`);

      // Use server client instead of regular client
      const content = `// AUTO-GENERATED — DO NOT EDIT
import { createClient } from '@supabase/supabase-js';
import type { ${typeName} } from '../generated-types';

// Create server client directly
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export const get${typeName} = () => {
  return supabase.from('${table.name}').select('*');
};

export const insert${typeName} = (payload: Partial<${typeName}>) => {
  return supabase.from('${table.name}').insert(payload);
};

export const update${typeName} = (id: string, payload: Partial<${typeName}>) => {
  return supabase.from('${table.name}').update(payload).eq('id', id);
};

export const delete${typeName} = (id: string) => {
  return supabase.from('${table.name}').delete().eq('id', id);
};
`;

      await writeFile(filePath, content, 'utf-8');
      console.log(`✅ Generated query file: ${filePath}`);
    }

    console.log(`🎉 Generated queries for ${tables.length} tables`);
  } catch (err) {
    console.error('❌ Failed to generate queries:', err instanceof Error ? err.message : err);
  }
}

generateQueries();