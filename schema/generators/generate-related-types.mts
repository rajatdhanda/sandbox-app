import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemaEditsPath = path.resolve(__dirname, '../../schema/schema-edits.json');
const outputPath = path.resolve(__dirname, '../../lib/supabase/core/types.ts');

function toPascalCase(str: string) {
  return str
    .replace(/_/g, ' ')
    .replace(/\w\S*/g, (txt) => txt[0].toUpperCase() + txt.slice(1))
    .replace(/\s+/g, '');
}

async function generateRelatedTypes() {
  try {
    const raw = await readFile(schemaEditsPath, 'utf-8');
    const schema = JSON.parse(raw);

    const lines: string[] = [];
    lines.push(`// RELATION TYPES — AUTO-GENERATED BELOW`);
    lines.push(`import type { Database } from '../_generated/database.types';`);

    for (const table of schema) {
      const tableName = table.name;
      const pascalName = toPascalCase(tableName);
      const relationships = table.relations || {};

      const relKeys = Object.keys(relationships);
      if (relKeys.length === 0) continue;

      lines.push(``);
      lines.push(`export type ${pascalName}WithRelations = Database['public']['Tables']['${tableName}']['Row'] & {`);

      for (const relKey of relKeys) {
        const rel = relationships[relKey];
        if (rel.new?.type === 'has_many') {
          const foreignTable = rel.new.foreign_table;
          const foreignField = rel.new.foreign_key_column || 'id';
          lines.push(`  ${relKey}: { ${foreignField}: any }[]; // from ${foreignTable}`);
        } else if (rel.new?.type === 'belongs_to') {
          const foreignTable = rel.new.foreign_table;
          lines.push(`  ${relKey}: Database['public']['Tables']['${foreignTable}']['Row'];`);
        }
      }

      lines.push(`};`);
    }

    const generatedBlock = lines.join('\n') + '\n';

    const existing = await readFile(outputPath, 'utf-8');
    const marker = '// RELATION TYPES — AUTO-GENERATED BELOW';
    const base = existing.includes(marker)
      ? existing.split(marker)[0].trimEnd()
      : existing.trimEnd();

    const final = `${base}\n\n${generatedBlock}`;
    await writeFile(outputPath, final, 'utf-8');
    console.log(`✅ Appended related types to: ${outputPath}`);
  } catch (err) {
    console.error('❌ Failed to generate related types:', err);
  }
}

generateRelatedTypes();