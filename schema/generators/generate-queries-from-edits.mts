// schema/generators/generate-queries-from-edits.mts
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

async function generateQueriesIndex(outputDir: string, tableNames: string[]) {
  console.log('📦 Generating queries index file...');
  
  let indexContent = `// AUTO-GENERATED QUERIES INDEX - DO NOT EDIT
// This file exports all query functions from individual table query files
// Run schema/generators/generate-queries-from-edits.mts to regenerate

`;
  
  // Generate exports for each table
  for (const tableName of tableNames) {
    indexContent += `// Queries for ${tableName}
export * from './${tableName}';
`;
  }
  
  // Add QueryWithRelations export
  indexContent += `
// Re-export QueryWithRelations from generated-types for convenience
export { QueryWithRelations } from '../generated-types';

// Export types for convenience
export type * from '../generated-types';
`;
  
  const indexPath = path.join(outputDir, 'index.ts');
  await writeFile(indexPath, indexContent);
  
  console.log(`✅ Generated queries index: ${indexPath}`);
}

async function generateQueries() {
  try {
    const data = await readFile(editsPath, 'utf-8');
    const tables = JSON.parse(data);
    await ensureDir(queriesDir);

    const tableNames: string[] = [];

    for (const table of tables) {
      if (!table.name || !Array.isArray(table.columns)) continue;

      const activeColumns = table.columns.filter((column: any) => {
        return !column.delete && column.new !== 'DELETE';
      });

      if (activeColumns.length === 0) continue;

      const tableName = table.name;
      tableNames.push(tableName);
      
      const typeName = toPascalCase(tableName);
      const filePath = path.join(queriesDir, `${tableName}.ts`);

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
  return supabase.from('${tableName}').select('*');
};

export const insert${typeName} = (payload: Partial<${typeName}>) => {
  return supabase.from('${tableName}').insert(payload);
};

export const update${typeName} = (id: string, payload: Partial<${typeName}>) => {
  return supabase.from('${tableName}').update(payload).eq('id', id);
};

export const delete${typeName} = (id: string) => {
  return supabase.from('${tableName}').delete().eq('id', id);
};
`;

      await writeFile(filePath, content, 'utf-8');
      console.log(`✅ Generated query file: ${filePath}`);
    }

    console.log(`🎉 Generated queries for ${tableNames.length} tables`);
    
    // Generate the index file
    await generateQueriesIndex(queriesDir, tableNames);
    
  } catch (err) {
    console.error('❌ Failed to generate queries:', err instanceof Error ? err.message : err);
  }
}

generateQueries();