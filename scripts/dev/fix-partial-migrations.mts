// scripts/dev/fix-partial-migrations.mts
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

async function fixPartialMigration(filePath: string): Promise<{
  success: boolean;
  changes: string[];
}> {
  try {
    let content = await readFile(filePath, 'utf-8');
    const originalContent = content;
    const changes: string[] = [];
    
    // Check for partial migration patterns
    const hasGeneratedTypes = content.includes('Users[]') || 
                             content.includes('Classes[]') || 
                             content.includes('Children[]') ||
                             content.includes('usersClient()') ||
                             content.includes('classesClient()');
    
    if (!hasGeneratedTypes) {
      return { success: true, changes: [] };
    }
    
    console.log(`🔧 Fixing partial migration: ${filePath}`);
    
    // Pattern 1: Add missing type imports
    const needsTypeImports = content.includes('Users[]') || 
                           content.includes('Classes[]') || 
                           content.includes('Children[]');
    
    if (needsTypeImports && !content.includes("from '@/lib/supabase/_generated/generated-types'")) {
      // Find the best place to add the import
      const hasReactImport = content.includes("import React");
      const reactImportLine = content.match(/import React.*?\n/)?.[0];
      
      if (reactImportLine) {
        const typesToImport = [];
        if (content.includes('Users[]')) typesToImport.push('Users');
        if (content.includes('Classes[]')) typesToImport.push('Classes');
        if (content.includes('Children[]')) typesToImport.push('Children');
        
        const typeImport = `import type { ${typesToImport.join(', ')} } from '@/lib/supabase/_generated/generated-types';\n`;
        content = content.replace(reactImportLine, reactImportLine + typeImport);
        changes.push(`Added type imports: ${typesToImport.join(', ')}`);
      }
    }
    
    // Pattern 2: Add missing client imports
    const needsClientImports = content.includes('usersClient()') || 
                              content.includes('classesClient()') || 
                              content.includes('childrenClient()');
    
    if (needsClientImports && !content.includes("from '@/lib/supabase/compatibility'")) {
      const clientsToImport = [];
      if (content.includes('usersClient()')) clientsToImport.push('usersClient');
      if (content.includes('classesClient()')) clientsToImport.push('classesClient');
      if (content.includes('childrenClient()')) clientsToImport.push('childrenClient');
      
      if (clientsToImport.length > 0) {
        const clientImport = `import { ${clientsToImport.join(', ')} } from '@/lib/supabase/compatibility';\n`;
        
        // Add after type imports or React imports
        const typeImportMatch = content.match(/import type.*?from '@\/lib\/supabase\/_generated\/generated-types';\s*\n/);
        if (typeImportMatch) {
          content = content.replace(typeImportMatch[0], typeImportMatch[0] + clientImport);
        } else {
          const reactImportLine = content.match(/import React.*?\n/)?.[0];
          if (reactImportLine) {
            content = content.replace(reactImportLine, reactImportLine + clientImport);
          }
        }
        changes.push(`Added client imports: ${clientsToImport.join(', ')}`);
      }
    }
    
    // Pattern 3: Fix User vs Users inconsistency
    if (content.includes('useState<Users[]>') && content.includes('interface User {')) {
      // Replace the local User interface with Users type
      const userInterfaceRegex = /interface User \{[\s\S]*?\}/g;
      if (userInterfaceRegex.test(content)) {
        content = content.replace(userInterfaceRegex, '// Using Users type from generated types');
        changes.push('Removed local User interface in favor of generated Users type');
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
  console.log('🚀 Fixing partial migrations...');
  
  // Find all TypeScript files
  const dirs = ['app', 'components', 'pages'];
  let allFiles: string[] = [];
  
  for (const dir of dirs) {
    if (existsSync(dir)) {
      const files = await findAllFiles(dir);
      allFiles.push(...files);
    }
  }
  
  console.log(`📁 Scanning ${allFiles.length} files for partial migrations...`);
  
  let fixedFiles = 0;
  let totalChanges = 0;
  
  for (const file of allFiles) {
    const result = await fixPartialMigration(file);
    
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
  console.log('2. Check for any remaining issues');
}

main().catch(console.error);