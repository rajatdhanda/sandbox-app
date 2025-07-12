// schema/copy-to-edits.mts
import { readFile, writeFile, appendFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname workaround for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const configPath = path.resolve(__dirname, 'config', 'schema-config.json');
const editsPath = path.resolve(__dirname, 'schema-edits.json');
const logPath = path.resolve(__dirname, 'schema-edits-log.json');

async function copySchemaConfigToEdits() {
  try {
    console.log(`📥 Reading schema from: ${configPath}`);
    const data = await readFile(configPath, 'utf-8');
    const parsed = JSON.parse(data);

    let tables;
    if (Array.isArray(parsed)) {
      tables = parsed;
    } else if (parsed && typeof parsed === 'object' && Array.isArray(parsed.tables)) {
      tables = parsed.tables;
    } else if (parsed && typeof parsed === 'object') {
      tables = Object.entries(parsed).map(([name, table]: [string, any]) => ({ name, ...table }));
    } else {
      throw new Error("Unrecognized schema format.");
    }

    const timestamp = new Date().toISOString();

    const transformed = tables.map((table: any) => {
      const transformedColumns = (table.columns || []).map((col: any) => ({
        old: col,
        new: { ...col },
        delete: false
      }));

      const transformedFields: any = {};
      for (const key in table.fields || {}) {
        transformedFields[key] = {
          old: table.fields[key],
          new: { ...table.fields[key] },
          delete: false
        };
      }

      const transformedRelations: any = {};
      for (const key in table.relations || {}) {
        transformedRelations[key] = {
          old: table.relations[key],
          new: { ...table.relations[key] },
          delete: false
        };
      }

      return {
        table: table.name || table.id || 'unknown_table',
        name: table.name,
        columns: transformedColumns,
        fields: transformedFields,
        relations: transformedRelations,
        timestamp
      };
    });

    console.log(`📤 Writing transformed schema to edits file: ${editsPath}`);
    await writeFile(editsPath, JSON.stringify(transformed, null, 2), 'utf-8');

    await appendFile(logPath, JSON.stringify({ timestamp, changes: transformed }, null, 2) + ',\n');

    console.log('✅ Transformed schema copied to schema-edits.json and logged.');
  } catch (err) {
    console.error('❌ Failed to copy and transform schema:', err);
  }
}

copySchemaConfigToEdits();