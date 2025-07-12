// scripts/dev/smart-property-name-fix.mts
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

async function smartFixPropertyNames(filePath: string): Promise<{
  success: boolean;
  changes: string[];
}> {
  try {
    let content = await readFile(filePath, 'utf-8');
    const originalContent = content;
    const changes: string[] = [];
    
    console.log(`🔧 Smart fixing property names: ${filePath}`);
    
    // Analyze the context to determine correct property names
    const isUsingGeneratedTypes = content.includes('WithRelations') || 
                                 content.includes('QueryWithRelations') ||
                                 content.includes('@/lib/supabase/_generated/generated-types');
    
    const hasCustomDataStructures = content.includes('children: string[]') ||
                                   content.includes('children?:') ||
                                   content.includes('children &&');
    
    console.log(`  Generated types: ${isUsingGeneratedTypes}, Custom structures: ${hasCustomDataStructures}`);
    
    if (isUsingGeneratedTypes && !hasCustomDataStructures) {
      // This file uses generated relationship types - use pluralized names
      const generatedRelationshipFixes = [
        {
          find: /\.children\?\.\[/g,
          replace: '.childrens?.[',
          description: 'Fixed generated relationship: children → childrens'
        },
        {
          find: /\.children\?\.(\w+)/g,
          replace: '.childrens?.$1',
          description: 'Fixed generated relationship property access'
        }
      ];
      
      generatedRelationshipFixes.forEach(fix => {
        if (fix.find.test(content)) {
          content = content.replace(fix.find, fix.replace);
          changes.push(fix.description);
        }
      });
      
    } else if (hasCustomDataStructures) {
      // This file uses custom data structures - use original names
      const customDataFixes = [
        {
          find: /\.childrens\?\./g,
          replace: '.children?.',
          description: 'Fixed custom data structure: childrens → children'
        },
        {
          find: /user\.childrens\?/g,
          replace: 'user.children?',
          description: 'Fixed custom user data: childrens → children'
        }
      ];
      
      customDataFixes.forEach(fix => {
        if (fix.find.test(content)) {
          content = content.replace(fix.find, fix.replace);
          changes.push(fix.description);
        }
      });
      
    } else {
      // Mixed or unclear context - be more specific
      
      // Fix obvious custom data patterns
      if (content.includes('children: string[]') || content.includes('user.childrens?.join')) {
        content = content.replace(/user\.childrens\?/g, 'user.children?');
        changes.push('Fixed custom user data structure');
      }
      
      // Fix obvious generated relationship patterns  
      if (content.includes('ClassesWithRelations') || content.includes('ChildrenWithRelations')) {
        content = content.replace(/classItem\.children\?\.\[/g, 'classItem.childrens?.[');
        content = content.replace(/child\.parent_child_relationships\?\./g, 'child.parentChildRelationships?.');
        changes.push('Fixed generated relationship types');
      }
    }
    
    // Specific file-based fixes
    const fileName = filePath.split('/').pop();
    
    if (fileName === 'users.tsx' || fileName === 'user-management-page.tsx') {
      // These likely use custom user data structures
      content = content.replace(/user\.childrens\?/g, 'user.children?');
      content = content.replace(/\.childrens\?\.join/g, '.children?.join');
      if (content.includes('.children?.join')) {
        changes.push('Fixed custom user data in users component');
      }
    }
    
    if (fileName === 'ClassManagement.tsx' || fileName === 'ChildrenManagement.tsx') {
      // These likely use generated relationship types
      content = content.replace(/classItem\.children\?\.\[/g, 'classItem.childrens?.[');
      content = content.replace(/child\.parent_child_relationships\?\./g, 'child.parentChildRelationships?.');
      if (content.includes('classItem.childrens')) {
        changes.push('Fixed generated relationships in class/children management');
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
  console.log('🚀 Smart fixing property names based on context...');
  
  const dirs = ['app', 'components', 'pages'];
  let allFiles: string[] = [];
  
  for (const dir of dirs) {
    if (existsSync(dir)) {
      const files = await findAllFiles(dir);
      allFiles.push(...files);
    }
  }
  
  console.log(`📁 Scanning ${allFiles.length} files for context-aware property fixes...`);
  
  let fixedFiles = 0;
  let totalChanges = 0;
  
  for (const file of allFiles) {
    const result = await smartFixPropertyNames(file);
    
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
  console.log('2. Property names should now match their contexts');
  
  console.log('\n📝 Strategy:');
  console.log('   - Generated relationships → use pluralized names (childrens)');
  console.log('   - Custom data structures → use original names (children)');
  console.log('   - File-specific fixes for known patterns');
}

main().catch(console.error);