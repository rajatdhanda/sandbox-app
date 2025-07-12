// scripts/dev/fix-supabase-auth-calls.mts
import { readFile, writeFile, readdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

async function findAllFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        const subFiles = await findAllFiles(fullPath);
        files.push(...subFiles);
      } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Directory doesn't exist, skip
  }
  
  return files;
}

async function fixSupabaseAuthCalls(filePath: string): Promise<{
  success: boolean;
  changes: string[];
}> {
  try {
    let content = await readFile(filePath, 'utf-8');
    const originalContent = content;
    const changes: string[] = [];
    
    // Skip files that don't use supabase.auth
    if (!content.includes('supabase.auth')) {
      return { success: true, changes: [] };
    }
    
    console.log(`🔧 Fixing auth calls: ${filePath}`);
    
    // Check if we need to add supabase client import for auth
    const hasAuthCalls = content.includes('supabase.auth.');
    
    if (hasAuthCalls) {
      // Add supabase client import specifically for auth
      const hasSupabaseImport = content.includes('import') && content.includes('supabase') && content.includes('@/lib/supabase');
      
      if (!hasSupabaseImport) {
        // Add supabase client import for auth calls
        const supabaseImport = `import { supabase } from '@/lib/supabase/clients';\n`;
        
        // Find insertion point
        const typeImportMatch = content.match(/import type.*from '@\/lib\/supabase\/_generated\/generated-types'.*?\n/);
        const reactImportMatch = content.match(/import.*from 'react'.*?\n/);
        const compatImportMatch = content.match(/import.*from '@\/lib\/supabase\/compatibility'.*?\n/);
        
        if (compatImportMatch) {
          const insertPoint = content.indexOf(compatImportMatch[0]) + compatImportMatch[0].length;
          content = content.slice(0, insertPoint) + supabaseImport + content.slice(insertPoint);
        } else if (typeImportMatch) {
          const insertPoint = content.indexOf(typeImportMatch[0]) + typeImportMatch[0].length;
          content = content.slice(0, insertPoint) + supabaseImport + content.slice(insertPoint);
        } else if (reactImportMatch) {
          const insertPoint = content.indexOf(reactImportMatch[0]) + reactImportMatch[0].length;
          content = content.slice(0, insertPoint) + supabaseImport + content.slice(insertPoint);
        } else {
          content = supabaseImport + content;
        }
        
        changes.push('Added supabase client import for auth calls');
      }
    }
    
    // Write the file if there were changes
    if (content !== originalContent) {
      await writeFile(filePath, content);
      console.log(`  ✅ Applied ${changes.length} fixes`);
      changes.forEach(change => console.log(`    - ${change}`));
    }
    
    return { success: true, changes };
    
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error);
    return { success: false, changes: [] };
  }
}

async function ensureSupabaseClient() {
  const clientPath = 'lib/supabase/clients.ts';
  
  console.log('🔧 Ensuring supabase client exists for auth calls...');
  
  if (!existsSync(clientPath)) {
    const clientContent = `// lib/supabase/clients.ts - Browser client for auth
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
`;
    
    await writeFile(clientPath, clientContent);
    console.log('✅ Created supabase client for auth calls');
  } else {
    console.log('✅ Supabase client already exists');
  }
}

async function main() {
  console.log('🚀 Fixing supabase.auth calls...');
  
  // Ensure supabase client exists for auth
  await ensureSupabaseClient();
  
  const dirs = ['app', 'components', 'pages'];
  let allFiles: string[] = [];
  
  for (const dir of dirs) {
    if (existsSync(dir)) {
      const files = await findAllFiles(dir);
      allFiles.push(...files);
    }
  }
  
  console.log(`📁 Scanning ${allFiles.length} files for supabase.auth calls...`);
  
  let fixedFiles = 0;
  let totalChanges = 0;
  
  for (const file of allFiles) {
    const result = await fixSupabaseAuthCalls(file);
    
    if (result.changes.length > 0) {
      fixedFiles++;
      totalChanges += result.changes.length;
    }
  }
  
  console.log('\n📊 Summary:');
  console.log(`   Files scanned: ${allFiles.length}`);
  console.log(`   Files fixed: ${fixedFiles}`);
  console.log(`   Total changes: ${totalChanges}`);
  
  console.log('\n🎯 Next steps:');
  console.log('1. Run: npm run build');
  console.log('2. Auth calls should now work with proper client');
  
  console.log('\n📝 Note: Auth calls need the browser client, not server client');
  console.log('   - supabase.auth.getUser() ✅');
  console.log('   - supabase.auth.signIn() ✅');
  console.log('   - Database calls use generated clients ✅');
}

main().catch(console.error);