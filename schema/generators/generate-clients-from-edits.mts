// schema/generators/generate-clients-from-edits.mts
import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const editsPath = path.resolve(__dirname, '../schema-edits.json');
const clientsDir = path.resolve(__dirname, '../../lib/supabase/_generated/clients');

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

async function generateClientsIndex(outputDir: string, tableNames: string[]) {
  console.log('📦 Generating clients index file...');
  
  let indexContent = `// AUTO-GENERATED CLIENTS INDEX - DO NOT EDIT
// This file exports all client functions from individual table client files
// Run schema/generators/generate-clients-from-edits.mts to regenerate

`;
  
  // Generate exports for each table
  for (const tableName of tableNames) {
    indexContent += `// Client for ${tableName}
export * from './${tableName}';
`;
  }
  
  const indexPath = path.join(outputDir, 'index.ts');
  await writeFile(indexPath, indexContent);
  
  console.log(`✅ Generated clients index: ${indexPath}`);
}

async function generateClients() {
  try {
    const data = await readFile(editsPath, 'utf-8');
    const tables = JSON.parse(data);
    await ensureDir(clientsDir);

    const activeTables = tables.filter(
      (table: any) => table.delete !== true && typeof table.name === 'string'
    );

    const tableNames: string[] = [];

    for (const table of activeTables) {
      const tableName = table.name;
      tableNames.push(tableName);
      
      const typeName = toPascalCase(tableName);
      const filePath = path.join(clientsDir, `${tableName}.ts`);

      const content = `// AUTO-GENERATED — DO NOT EDIT
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !key) {
    throw new Error('supabaseKey is required.');
  }
  return createClient<Database>(url, key);
}

export const ${tableName}Client = () =>
  getSupabaseClient().from<Database['public']['Tables']['${tableName}']['Row']>('${tableName}');
`;

      await writeFile(filePath, content, 'utf-8');
      console.log(`✅ Generated client file: ${filePath}`);
    }

    console.log(`🎉 Generated clients for ${activeTables.length} tables`);
    
    // Generate the index file
    await generateClientsIndex(clientsDir, tableNames);
    
  } catch (err) {
    console.error('❌ Failed to generate clients:', err instanceof Error ? err.message : err);
  }
}

generateClients();