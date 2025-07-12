// scripts/dev/fix-incorrect-imports.mts
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

async function fixIncorrectImports(filePath: string): Promise<{
  success: boolean;
  changes: string[];
}> {
  try {
    let content = await readFile(filePath, 'utf-8');
    const originalContent = content;
    const changes: string[] = [];
    
    console.log(`🔧 Checking incorrect imports: ${filePath}`);
    
    // Fix incorrect default imports from generated modules
    const incorrectImportPatterns = [
      {
        find: /import supabase from '@\/lib\/supabase\/_generated\/clients';?/g,
        replace: "// Removed incorrect default import - use specific clients from compatibility layer",
        description: 'Removed incorrect default import from clients'
      },
      {
        find: /import supabase from '@\/lib\/supabase\/_generated\/queries';?/g,
        replace: "// Removed incorrect default import - use specific queries from compatibility layer",
        description: 'Removed incorrect default import from queries'
      },
      {
        find: /import supabase from '@\/lib\/supabase\/_generated';?/g,
        replace: "// Removed incorrect default import - use specific imports",
        description: 'Removed incorrect default import from generated'
      }
    ];
    
    incorrectImportPatterns.forEach(pattern => {
      if (pattern.find.test(content)) {
        content = content.replace(pattern.find, pattern.replace);
        changes.push(pattern.description);
      }
    });
    
    // Fix any remaining usage of the default imported 'supabase' variable
    if (changes.length > 0) {
      // If we removed a supabase import, we need to add the proper one for auth
      if (content.includes('supabase.auth') || content.includes('supabase.from')) {
        const authImport = `import { supabase } from '@/lib/supabase/clients';\n`;
        
        // Find insertion point
        const typeImportMatch = content.match(/import type.*from '@\/lib\/supabase\/_generated\/generated-types'.*?\n/);
        const reactImportMatch = content.match(/import.*from 'react'.*?\n/);
        
        if (typeImportMatch) {
          const insertPoint = content.indexOf(typeImportMatch[0]) + typeImportMatch[0].length;
          content = content.slice(0, insertPoint) + authImport + content.slice(insertPoint);
        } else if (reactImportMatch) {
          const insertPoint = content.indexOf(reactImportMatch[0]) + reactImportMatch[0].length;
          content = content.slice(0, insertPoint) + authImport + content.slice(insertPoint);
        } else {
          content = authImport + content;
        }
        changes.push('Added correct supabase client import for auth calls');
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

async function main() {
  console.log('🚀 Fixing incorrect default imports...');
  
  const dirs = ['app', 'components', 'pages'];
  let allFiles: string[] = [];
  
  for (const dir of dirs) {
    if (existsSync(dir)) {
      const files = await findAllFiles(dir);
      allFiles.push(...files);
    }
  }
  
  console.log(`📁 Scanning ${allFiles.length} files for incorrect imports...`);
  
  let fixedFiles = 0;
  let totalChanges = 0;
  
  for (const file of allFiles) {
    const result = await fixIncorrectImports(file);
    
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
  console.log('2. Default import errors should be resolved');
  
  console.log('\n📝 Note:');
  console.log('   - Generated modules only export named exports');
  console.log('   - Use specific client functions from compatibility layer');
  console.log('   - Auth calls use { supabase } from clients.ts');
}

main().catch(console.error);