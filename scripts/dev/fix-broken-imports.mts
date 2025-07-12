// scripts/dev/fix-broken-imports.mts
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

async function fixBrokenImports(filePath: string): Promise<{
  success: boolean;
  changes: string[];
}> {
  try {
    let content = await readFile(filePath, 'utf-8');
    const originalContent = content;
    const changes: string[] = [];
    
    console.log(`🔧 Checking broken imports: ${filePath}`);
    
    // Pattern 1: Fix malformed "as" imports like "{as UsersType, Classes}"
    const brokenAsImportRegex = /import type \{\s*as\s+(\w+),\s*([^}]+)\s*\}/g;
    if (brokenAsImportRegex.test(content)) {
      content = content.replace(brokenAsImportRegex, 'import type { $2 }');
      changes.push('Fixed malformed "as" import syntax');
    }
    
    // Pattern 2: Fix incomplete type imports
    const incompleteImportRegex = /import type \{\s*,\s*([^}]+)\s*\}/g;
    if (incompleteImportRegex.test(content)) {
      content = content.replace(incompleteImportRegex, 'import type { $1 }');
      changes.push('Fixed incomplete import with leading comma');
    }
    
    // Pattern 3: Fix empty imports
    const emptyImportRegex = /import type \{\s*\} from '[^']+';?\s*\n/g;
    if (emptyImportRegex.test(content)) {
      content = content.replace(emptyImportRegex, '');
      changes.push('Removed empty import statement');
    }
    
    // Pattern 4: Fix imports with only commas
    const onlyCommasRegex = /import type \{\s*,+\s*\} from '[^']+';?\s*\n/g;
    if (onlyCommasRegex.test(content)) {
      content = content.replace(onlyCommasRegex, '');
      changes.push('Removed import with only commas');
    }
    
    // Pattern 5: Check if we need to add specific imports based on usage
    const usagePatterns = [
      { usage: /\bUsers\[\]/g, type: 'Users' },
      { usage: /\bClasses\[\]/g, type: 'Classes' },
      { usage: /\bChildren\[\]/g, type: 'Children' },
      { usage: /\bChildrenWithRelations\[\]/g, type: 'ChildrenWithRelations' },
      { usage: /\busersClient\(\)/g, client: 'usersClient' },
      { usage: /\bclassesClient\(\)/g, client: 'classesClient' },
      { usage: /\bchildrenClient\(\)/g, client: 'childrenClient' },
    ];
    
    const neededTypes: string[] = [];
    const neededClients: string[] = [];
    
    usagePatterns.forEach(pattern => {
      if (pattern.usage.test(content)) {
        if (pattern.type && !content.includes(`import type { ${pattern.type}`)) {
          neededTypes.push(pattern.type);
        }
        if (pattern.client && !content.includes(`import { ${pattern.client}`)) {
          neededClients.push(pattern.client);
        }
      }
    });
    
    // Add missing imports after fixing broken ones
    if (neededTypes.length > 0) {
      const typeImport = `import type { ${neededTypes.join(', ')} } from '@/lib/supabase/_generated/generated-types';\n`;
      
      // Find insertion point (after React import or at top)
      const reactImportMatch = content.match(/import.*from 'react'.*?\n/);
      if (reactImportMatch) {
        const insertPoint = content.indexOf(reactImportMatch[0]) + reactImportMatch[0].length;
        content = content.slice(0, insertPoint) + typeImport + content.slice(insertPoint);
      } else {
        content = typeImport + content;
      }
      changes.push(`Added missing type imports: ${neededTypes.join(', ')}`);
    }
    
    if (neededClients.length > 0) {
      const clientImport = `import { ${neededClients.join(', ')} } from '@/lib/supabase/compatibility';\n`;
      
      // Add after type import or React import
      const typeImportMatch = content.match(/import type.*from '@\/lib\/supabase\/_generated\/generated-types'.*?\n/);
      if (typeImportMatch) {
        const insertPoint = content.indexOf(typeImportMatch[0]) + typeImportMatch[0].length;
        content = content.slice(0, insertPoint) + clientImport + content.slice(insertPoint);
      } else {
        const reactImportMatch = content.match(/import.*from 'react'.*?\n/);
        if (reactImportMatch) {
          const insertPoint = content.indexOf(reactImportMatch[0]) + reactImportMatch[0].length;
          content = content.slice(0, insertPoint) + clientImport + content.slice(insertPoint);
        }
      }
      changes.push(`Added missing client imports: ${neededClients.join(', ')}`);
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
  console.log('🚀 Fixing broken import statements...');
  
  // Find all TypeScript files
  const dirs = ['app', 'components', 'pages'];
  let allFiles: string[] = [];
  
  for (const dir of dirs) {
    if (existsSync(dir)) {
      const files = await findAllFiles(dir);
      allFiles.push(...files);
    }
  }
  
  console.log(`📁 Scanning ${allFiles.length} files for broken imports...`);
  
  let fixedFiles = 0;
  let totalChanges = 0;
  
  for (const file of allFiles) {
    const result = await fixBrokenImports(file);
    
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
  console.log('2. All broken import syntax should be fixed');
}

main().catch(console.error);