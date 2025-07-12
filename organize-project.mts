// organize-project.mts - Safe restructuring within existing folders
import { mkdir, rename, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

async function organizeSchema() {
  console.log('📁 Organizing schema folder...');
  
  // Create subdirectories
  const schemaDirs = ['core', 'generators', 'migration'];
  for (const dir of schemaDirs) {
    await mkdir(path.join('schema', dir), { recursive: true });
  }
  
  // Move files to better locations
  const moves = [
    { from: 'schema/generate-clients-from-edits.mts', to: 'schema/generators/generate-clients-from-edits.mts' },
    { from: 'schema/generate-types-from-edits.mts', to: 'schema/generators/generate-types-from-edits.mts' },
    { from: 'schema/generate-queries-from-edits.mts', to: 'schema/generators/generate-queries-from-edits.mts' },
    { from: 'schema/generate-index-from-edits.mts', to: 'schema/generators/generate-index-from-edits.mts' },
    { from: 'schema/migrate-to-generated.mts', to: 'schema/migration/migrate-to-generated.mts' },
  ];
  
  for (const move of moves) {
    if (existsSync(move.from)) {
      await rename(move.from, move.to);
      console.log(`✅ Moved: ${move.from} → ${move.to}`);
    } else {
      console.log(`⚠️  File not found: ${move.from}`);
    }
  }
}

async function organizeSupabase() {
  console.log('📁 Organizing lib/supabase...');
  
  await mkdir('lib/supabase/core', { recursive: true });
  
  const moves = [
    { from: 'lib/supabase/server-client.ts', to: 'lib/supabase/core/server-client.ts' },
    { from: 'lib/supabase/types.ts', to: 'lib/supabase/core/types.ts' },
  ];
  
  for (const move of moves) {
    if (existsSync(move.from)) {
      await rename(move.from, move.to);
      console.log(`✅ Moved: ${move.from} → ${move.to}`);
    } else {
      console.log(`⚠️  File not found: ${move.from}`);
    }
  }
}

async function organizeAPIs() {
  console.log('📁 Organizing pages/api...');
  
  await mkdir('pages/api/_dev', { recursive: true });
  
  const testFiles = [
    'test-schema-robust.ts',
    'test-generated-clients-final.ts',
    'test-migration.ts',
    'debug-migration.ts',
    'test-notifications.ts'
  ];
  
  for (const file of testFiles) {
    const from = `pages/api/${file}`;
    const to = `pages/api/_dev/${file}`;
    
    if (existsSync(from)) {
      await rename(from, to);
      console.log(`✅ Moved test API: ${file} → _dev/`);
    } else {
      console.log(`⚠️  Test file not found: ${file}`);
    }
  }
}

async function createScripts() {
  console.log('📁 Creating scripts folder...');
  
  await mkdir('scripts/schema', { recursive: true });
  await mkdir('scripts/dev', { recursive: true });
  
  const generateAllScript = `#!/bin/bash
echo "🚀 Running complete schema generation pipeline..."

echo "⚡ Step 1: Fetch schema from database"
npx tsx schema/index.ts

echo "⚡ Step 2: Copy to edits format"  
npx tsx schema/copy-to-edits.mts

echo "⚡ Step 3: Generate types"
npx tsx schema/generators/generate-types-from-edits.mts

echo "⚡ Step 4: Generate clients"
npx tsx schema/generators/generate-clients-from-edits.mts

echo "⚡ Step 5: Generate queries"
npx tsx schema/generators/generate-queries-from-edits.mts

echo "⚡ Step 6: Generate index"
npx tsx schema/generators/generate-index-from-edits.mts

echo "✅ Schema generation complete!"
`;

  const testAllScript = `#!/bin/bash
echo "🧪 Testing all APIs..."

BASE_URL="http://localhost:3000"

echo "🔍 Testing production APIs..."
curl -s "$BASE_URL/api/hello"

echo "🔍 Testing generated clients..."
curl -s "$BASE_URL/api/_dev/test-generated-clients-final"

echo "🔍 Testing debug APIs..."
curl -s "$BASE_URL/api/_dev/debug-migration"

echo "✅ API testing complete!"
`;

  await writeFile('scripts/schema/generate-all.sh', generateAllScript);
  await writeFile('scripts/dev/test-all-apis.sh', testAllScript);
  
  console.log('✅ Created automation scripts');
}

async function createDocumentation() {
  const schemaReadme = `# Schema Management

## Quick Commands
\`\`\`bash
# Generate everything
./scripts/schema/generate-all.sh

# Individual steps  
npx tsx schema/index.ts
npx tsx schema/copy-to-edits.mts
npx tsx schema/generators/generate-clients-from-edits.mts
\`\`\`

## File Organization
- \`core/\` - Schema fetching and sync
- \`generators/\` - Code generation scripts  
- \`config/\` - Raw database schema
- \`migration/\` - Migration tools
`;

  const scriptsReadme = `# Automation Scripts

## Usage
\`\`\`bash
# Generate all schema files
chmod +x scripts/schema/generate-all.sh
./scripts/schema/generate-all.sh

# Test all APIs
chmod +x scripts/dev/test-all-apis.sh  
./scripts/dev/test-all-apis.sh
\`\`\`
`;

  await writeFile('schema/README.md', schemaReadme);
  await writeFile('scripts/README.md', scriptsReadme);
}

async function main() {
  try {
    await organizeSchema();
    await organizeSupabase(); 
    await organizeAPIs();
    await createScripts();
    await createDocumentation();
    
    console.log('\n🎉 Project organization complete!');
    console.log('\n📋 Next steps:');
    console.log('1. Make scripts executable: chmod +x scripts/**/*.sh');
    console.log('2. Test schema generation: ./scripts/schema/generate-all.sh');
    console.log('3. Test APIs: ./scripts/dev/test-all-apis.sh');
    
  } catch (error) {
    console.error('❌ Error during organization:', error);
  }
}

main();
