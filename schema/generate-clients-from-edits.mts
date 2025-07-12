// schema/generate-clients-from-edits.mts
import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const editsPath = path.resolve(__dirname, 'schema-edits.json');
const clientsDir = path.resolve(__dirname, '../lib/supabase/_generated/clients');

async function ensureDir(dir: string) {
  try {
    await mkdir(dir, { recursive: true });
  } catch (err) {
    console.error('❌ Failed to create directory:', err);
  }
}

const toPascalCase = (str: string): string =>
  str.replace(/_/g, ' ')
     .replace(/\w\S*/g, (txt) => txt[0].toUpperCase() + txt.slice(1))
     .replace(/\s+/g, '');

async function generateClients() {
  try {
    const data = await readFile(editsPath, 'utf-8');
    const tables = JSON.parse(data);
    await ensureDir(clientsDir);

    for (const table of tables) {
      if (!table.name) continue;

      const typeName = toPascalCase(table.name);
      const filePath = path.join(clientsDir, `${table.name}.ts`);

      // Fixed version - creates client directly, no imports
      const content = `// AUTO-GENERATED — DO NOT EDIT
import { createClient } from '@supabase/supabase-js';

// Create the client directly here to avoid import issues
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

export const ${table.name}Client = () =>
  supabase.from('${table.name}');

// Export typed operations
export const get${typeName} = () => ${table.name}Client().select('*');
export const create${typeName} = (data: any) => ${table.name}Client().insert(data);
export const update${typeName} = (id: any, data: any) => ${table.name}Client().update(data).eq('id', id);
export const delete${typeName} = (id: any) => ${table.name}Client().delete().eq('id', id);
`;

      await writeFile(filePath, content, 'utf-8');
      console.log(`✅ Generated client file: ${filePath}`);
    }

    console.log(`🎉 Generated clients for ${tables.length} tables`);
  } catch (err) {
    console.error('❌ Failed to generate clients:', err instanceof Error ? err.message : err);
  }
}

generateClients();