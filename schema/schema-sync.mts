import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';
import { createClient } from '@supabase/supabase-js';

import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- CONFIG ---- //
const SCHEMA_DIR = path.resolve(__dirname, './config');
const SCHEMA_FILE = path.join(SCHEMA_DIR, 'schema-config.json');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing environment variables:');
  console.error(`  NEXT_PUBLIC_SUPABASE_URL: ${SUPABASE_URL}`);
  console.error(`  SUPABASE_SERVICE_ROLE_KEY: ${SUPABASE_SERVICE_ROLE_KEY}`);
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ---- SCRIPT ---- //
async function fetchSchema() {
  console.log('Fetching database schema from Supabase...');

  const { data: tables, error } = await supabase.rpc('get_all_tables');

  if (error) {
    console.error('❌ Error fetching tables:', error);
    process.exit(1);
  }

  const schema: Record<string, any> = {};

  for (const tableName of tables as string[]) {
    const { data: columns, error: columnError } = await supabase.rpc('get_table_columns', {
      table_name_input: tableName,
    });

    if (columnError) {
      console.error(`❌ Error fetching columns for ${tableName}:`, columnError);
      continue;
    }

    schema[tableName] = {
      columns: columns?.map((col: any) => ({
        name: col.column_name,
        type: col.data_type,
      })) || [],
    };
  }

  await fs.mkdir(SCHEMA_DIR, { recursive: true });
  await fs.writeFile(SCHEMA_FILE, JSON.stringify(schema, null, 2));
  console.log(`✅ Schema written to ${SCHEMA_FILE}`);
}

(async () => {
  try {
    await fetchSchema();
  } catch (err) {
    console.error('❌ Schema sync failed:', err);
  }
})();