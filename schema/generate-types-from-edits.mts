// schema/generate-types-from-edits.mts
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const editsPath = path.resolve(__dirname, 'schema-edits.json');
const outputPath = path.resolve(__dirname, '../lib/supabase/_generated/generated-types.ts');

const sqlToTsType = (sqlType: string): string => {
  const map: Record<string, string> = {
    uuid: 'string',
    text: 'string',
    varchar: 'string',
    bool: 'boolean',
    boolean: 'boolean',
    int: 'number',
    integer: 'number',
    bigint: 'number',
    json: 'any',
    jsonb: 'any',
    timestamp: 'string',
    'timestamp with time zone': 'string',
    date: 'string',
    float: 'number',
    double: 'number',
  };
  return map[sqlType] || 'any';
};

function toPascalCase(str: string): string {
  return str
    .replace(/_/g, ' ')
    .replace(/\w\S*/g, (txt) => txt[0].toUpperCase() + txt.substring(1))
    .replace(/\s+/g, '');
}

async function generateTypes() {
  try {
    console.log(`📥 Reading schema edits from: ${editsPath}`);
    const data = await readFile(editsPath, 'utf-8');
    const tables = JSON.parse(data);

    let output = `// AUTO-GENERATED FILE — DO NOT EDIT
// This file is generated from schema-edits.json based on current schema state
// Run schema/generate-types-from-edits.mts to regenerate

`;

    for (const table of tables) {
      if (!table.name || !Array.isArray(table.columns)) {
        console.warn(`⚠️ Skipping table without columns:`, table.name);
        continue;
      }

      const typeName = toPascalCase(table.name);
      output += `// Table: ${table.name}
export type ${typeName} = {
`;

      // Process columns array instead of fields object
      for (const column of table.columns) {
        if (column.delete) continue;
        
        const colData = column.new || column.old;
        if (!colData?.name || !colData?.type) continue;
        
        const isOptional = colData.nullable === 'YES' || colData.nullable === true;
        const optionalMarker = isOptional ? '?' : '';
        
        output += `  ${colData.name}${optionalMarker}: ${sqlToTsType(colData.type)};
`;
      }

      output += `};

`;
    }

    await writeFile(outputPath, output, 'utf-8');
    console.log(`✅ Type definitions written to: ${outputPath}`);
    console.log(`📊 Generated types for ${tables.length} tables`);
  } catch (err) {
    console.error('❌ Failed to generate types:', err instanceof Error ? err.message : err);
  }
}

generateTypes();