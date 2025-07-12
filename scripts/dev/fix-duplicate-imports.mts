// scripts/dev/fix-duplicate-imports.mts
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

async function fixDuplicateImports(filePath: string): Promise<{
  success: boolean;
  changes: string[];
}> {
  try {
    let content = await readFile(filePath, 'utf-8');
    const originalContent = content;
    const changes: string[] = [];
    
    console.log(`🔧 Checking duplicates: ${filePath}`);
    
    // Find all import lines from the same source
    const compatibilityImports = content.match(/import \{[^}]+\} from '@\/lib\/supabase\/compatibility';/g);
    
    if (compatibilityImports && compatibilityImports.length > 1) {
      console.log(`  Found ${compatibilityImports.length} compatibility imports to merge`);
      
      // Extract all imported items
      const allImports = new Set<string>();
      compatibilityImports.forEach(importLine => {
        const match = importLine.match(/import \{([^}]+)\}/);
        if (match) {
          const items = match[1].split(',').map(item => item.trim());
          items.forEach(item => allImports.add(item));
        }
      });
      
      // Remove all existing import lines
      compatibilityImports.forEach(importLine => {
        content = content.replace(importLine + '\n', '');
      });
      
      // Add single merged import
      const mergedImport = `import { ${Array.from(allImports).join(', ')} } from '@/lib/supabase/compatibility';\n`;
      
      // Insert after type imports or React imports
      const typeImportMatch = content.match(/import type.*from '@\/lib\/supabase\/_generated\/generated-types'.*?\n/);
      if (typeImportMatch) {
        const insertPoint = content.indexOf(typeImportMatch[0]) + typeImportMatch[0].length;
        content = content.slice(0, insertPoint) + mergedImport + content.slice(insertPoint);
      } else {
        const reactImportMatch = content.match(/import.*from 'react'.*?\n/);
        if (reactImportMatch) {
          const insertPoint = content.indexOf(reactImportMatch[0]) + reactImportMatch[0].length;
          content = content.slice(0, insertPoint) + mergedImport + content.slice(insertPoint);
        }
      }
      
      changes.push(`Merged ${compatibilityImports.length} duplicate imports into one`);
    }
    
    // Also handle other duplicate patterns
    const typeImports = content.match(/import type \{[^}]+\} from '@\/lib\/supabase\/_generated\/generated-types';/g);
    
    if (typeImports && typeImports.length > 1) {
      console.log(`  Found ${typeImports.length} type imports to merge`);
      
      const allTypes = new Set<string>();
      typeImports.forEach(importLine => {
        const match = importLine.match(/import type \{([^}]+)\}/);
        if (match) {
          const items = match[1].split(',').map(item => item.trim());
          items.forEach(item => allTypes.add(item));
        }
      });
      
      // Remove all existing type import lines
      typeImports.forEach(importLine => {
        content = content.replace(importLine + '\n', '');
      });
      
      // Add single merged type import
      const mergedTypeImport = `import type { ${Array.from(allTypes).join(', ')} } from '@/lib/supabase/_generated/generated-types';\n`;
      
      // Insert after React imports
      const reactImportMatch = content.match(/import.*from 'react'.*?\n/);
      if (reactImportMatch) {
        const insertPoint = content.indexOf(reactImportMatch[0]) + reactImportMatch[0].length;
        content = content.slice(0, insertPoint) + mergedTypeImport + content.slice(insertPoint);
      } else {
        content = mergedTypeImport + content;
      }
      
      changes.push(`Merged ${typeImports.length} duplicate type imports into one`);
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
  console.log('🚀 Fixing duplicate imports...');
  
  const dirs = ['app', 'components', 'pages'];
  let allFiles: string[] = [];
  
  for (const dir of dirs) {
    if (existsSync(dir)) {
      const files = await findAllFiles(dir);
      allFiles.push(...files);
    }
  }
  
  console.log(`📁 Scanning ${allFiles.length} files for duplicate imports...`);
  
  let fixedFiles = 0;
  let totalChanges = 0;
  
  for (const file of allFiles) {
    const result = await fixDuplicateImports(file);
    
    if (result.changes.length > 0) {
      fixedFiles++;
      totalChanges += result.changes.length;
    }
  }
  
  console.log('\n📊 Summary:');
  console.log(`   Files scanned: ${allFiles.length}`);
  console.log(`   Files fixed: ${fixedFiles}`);
  console.log(`   Total fixes: ${totalChanges}`);
  
  console.log('\n🎯 Next steps:');
  console.log('1. Run: npm run build');
}

main().catch(console.error);