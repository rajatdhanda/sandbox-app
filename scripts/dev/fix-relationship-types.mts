// scripts/dev/fix-relationship-types.mts
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

async function fixRelationshipTypes(filePath: string): Promise<{
  success: boolean;
  changes: string[];
}> {
  try {
    let content = await readFile(filePath, 'utf-8');
    const originalContent = content;
    const changes: string[] = [];
    
    console.log(`🔧 Checking relationship types: ${filePath}`);
    
    // Pattern 1: Fix base types that need relationship types
    const relationshipPatterns = [
      {
        usage: /\.children\??\.\[?\d*\]?\??\./g,
        baseType: 'Classes',
        relationshipType: 'ClassesWithRelations',
        description: 'classes with children relationship'
      },
      {
        usage: /\.parent_child_relationships\??\./g,
        baseType: 'Children',
        relationshipType: 'ChildrenWithRelations',
        description: 'children with parent relationships'
      },
      {
        usage: /\.class\??\./g,
        baseType: 'Children',
        relationshipType: 'ChildrenWithRelations',
        description: 'children with class relationship'
      },
      {
        usage: /\.user\??\./g,
        baseType: 'Notifications',
        relationshipType: 'NotificationsWithRelations',
        description: 'notifications with user relationship'
      },
      {
        usage: /\.author\??\./g,
        baseType: 'Messages',
        relationshipType: 'MessagesWithRelations',
        description: 'messages with author relationship'
      }
    ];
    
    let needsRelationshipTypes = false;
    const typesNeeded = new Set<string>();
    
    // Check which relationship types are needed
    relationshipPatterns.forEach(pattern => {
      if (pattern.usage.test(content)) {
        needsRelationshipTypes = true;
        typesNeeded.add(pattern.relationshipType);
        
        // Update state declarations
        const stateRegex = new RegExp(`useState<${pattern.baseType}\\[\\]>`, 'g');
        if (stateRegex.test(content)) {
          content = content.replace(stateRegex, `useState<${pattern.relationshipType}[]>`);
          changes.push(`Updated state from ${pattern.baseType}[] to ${pattern.relationshipType}[]`);
        }
        
        // Update function parameters
        const paramRegex = new RegExp(`\\(\\s*\\w+:\\s*${pattern.baseType}\\s*\\)`, 'g');
        if (paramRegex.test(content)) {
          content = content.replace(paramRegex, (match) => 
            match.replace(pattern.baseType, pattern.relationshipType)
          );
          changes.push(`Updated function parameter from ${pattern.baseType} to ${pattern.relationshipType}`);
        }
        
        // Update variable declarations
        const varRegex = new RegExp(`:\\s*${pattern.baseType}\\[\\]`, 'g');
        if (varRegex.test(content)) {
          content = content.replace(varRegex, `: ${pattern.relationshipType}[]`);
          changes.push(`Updated variable type from ${pattern.baseType}[] to ${pattern.relationshipType}[]`);
        }
      }
    });
    
    // Add missing relationship type imports
    if (typesNeeded.size > 0) {
      const existingTypeImport = content.match(/import type \{([^}]+)\} from '@\/lib\/supabase\/_generated\/generated-types'/);
      
      if (existingTypeImport) {
        const existingTypes = existingTypeImport[1].split(',').map(t => t.trim());
        const allTypes = [...new Set([...existingTypes, ...Array.from(typesNeeded)])];
        const newImportLine = `import type { ${allTypes.join(', ')} } from '@/lib/supabase/_generated/generated-types'`;
        content = content.replace(existingTypeImport[0], newImportLine);
        changes.push(`Added relationship types: ${Array.from(typesNeeded).join(', ')}`);
      } else {
        // Add new type import
        const typeImportLine = `import type { ${Array.from(typesNeeded).join(', ')} } from '@/lib/supabase/_generated/generated-types';\n`;
        
        const reactImportMatch = content.match(/import.*from 'react'.*?\n/);
        if (reactImportMatch) {
          const insertPoint = content.indexOf(reactImportMatch[0]) + reactImportMatch[0].length;
          content = content.slice(0, insertPoint) + typeImportLine + content.slice(insertPoint);
        } else {
          content = typeImportLine + content;
        }
        changes.push(`Added new relationship type imports: ${Array.from(typesNeeded).join(', ')}`);
      }
    }
    
    // Pattern 2: Fix query calls to use QueryWithRelations
    if (needsRelationshipTypes && !content.includes('QueryWithRelations')) {
      // Check if there are select queries that could use QueryWithRelations
      const complexSelects = content.match(/\.select\(\s*[`'"][\s\S]*?class.*?children.*?[`'"]\s*\)/g);
      
      if (complexSelects) {
        complexSelects.forEach(selectQuery => {
          // Extract table name from the context
          const tableMatch = content.match(new RegExp(`(\\w+Client)\\(\\)[\\s\\S]*?${selectQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
          if (tableMatch) {
            const clientName = tableMatch[1];
            const tableName = clientName.replace('Client', '').toLowerCase();
            content = content.replace(selectQuery, `.select(QueryWithRelations.${tableName})`);
            changes.push(`Replaced complex select with QueryWithRelations.${tableName}`);
          }
        });
        
        // Add QueryWithRelations import
        const existingTypeImport = content.match(/import type \{([^}]+)\} from '@\/lib\/supabase\/_generated\/generated-types'/);
        if (existingTypeImport && !existingTypeImport[1].includes('QueryWithRelations')) {
          const types = existingTypeImport[1].split(',').map(t => t.trim());
          types.push('QueryWithRelations');
          const newImportLine = `import type { ${types.join(', ')} } from '@/lib/supabase/_generated/generated-types'`;
          content = content.replace(existingTypeImport[0], newImportLine);
          changes.push('Added QueryWithRelations import');
        }
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
  console.log('🚀 Fixing relationship type mismatches...');
  
  const dirs = ['app', 'components', 'pages'];
  let allFiles: string[] = [];
  
  for (const dir of dirs) {
    if (existsSync(dir)) {
      const files = await findAllFiles(dir);
      allFiles.push(...files);
    }
  }
  
  console.log(`📁 Scanning ${allFiles.length} files for relationship type issues...`);
  
  let fixedFiles = 0;
  let totalChanges = 0;
  
  for (const file of allFiles) {
    const result = await fixRelationshipTypes(file);
    
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
  console.log('2. Relationship type errors should be resolved');
  
  console.log('\n📝 Fixed patterns:');
  console.log('   - Classes → ClassesWithRelations (for .children access)');
  console.log('   - Children → ChildrenWithRelations (for .parent_child_relationships access)');
  console.log('   - Added QueryWithRelations for complex queries');
}

main().catch(console.error);