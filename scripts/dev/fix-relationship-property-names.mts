// scripts/dev/fix-relationship-property-names.mts
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

async function fixRelationshipPropertyNames(filePath: string): Promise<{
  success: boolean;
  changes: string[];
}> {
  try {
    let content = await readFile(filePath, 'utf-8');
    const originalContent = content;
    const changes: string[] = [];
    
    console.log(`🔧 Checking relationship property names: ${filePath}`);
    
    // Property name mappings based on generated relationships
    const propertyMappings = [
      {
        incorrect: '.children',
        correct: '.childrens', // Pluralized by the relationship detector
        description: 'Fixed .children to .childrens (generated relationship name)'
      },
      {
        incorrect: '.parent',
        correct: '.parents', // If pluralized
        description: 'Fixed .parent to .parents (generated relationship name)'
      },
      {
        incorrect: '.user',
        correct: '.users', // If pluralized
        description: 'Fixed .user to .users (generated relationship name)'
      },
      {
        incorrect: '.class',
        correct: '.classes', // If pluralized  
        description: 'Fixed .class to .classes (generated relationship name)'
      }
    ];
    
    // Apply property name fixes
    propertyMappings.forEach(mapping => {
      // Pattern for property access (with optional chaining)
      const regex = new RegExp(`\\${mapping.incorrect}\\??\\[`, 'g');
      if (regex.test(content)) {
        content = content.replace(regex, `${mapping.correct}?.[`);
        changes.push(mapping.description);
      }
      
      // Pattern for direct property access
      const directRegex = new RegExp(`\\${mapping.incorrect}\\??\\.(\\w+)`, 'g');
      if (directRegex.test(content)) {
        content = content.replace(directRegex, `${mapping.correct}?.$1`);
        changes.push(mapping.description + ' (direct access)');
      }
    });
    
    // Special case: Fix the specific error pattern
    const specificPatterns = [
      {
        find: /\.children\?\.\[0\]\?\.count/g,
        replace: '.childrens?.[0]?.count',
        description: 'Fixed children count access'
      },
      {
        find: /\.children\?\.\[(\d+)\]\?/g,
        replace: '.childrens?.[$1]?',
        description: 'Fixed children array access'
      },
      {
        find: /\.children\?\.length/g,
        replace: '.childrens?.length',
        description: 'Fixed children length access'
      },
      {
        find: /\.children\?\.map/g,
        replace: '.childrens?.map',
        description: 'Fixed children map access'
      }
    ];
    
    specificPatterns.forEach(pattern => {
      if (pattern.find.test(content)) {
        content = content.replace(pattern.find, pattern.replace);
        changes.push(pattern.description);
      }
    });
    
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
  console.log('🚀 Fixing relationship property names...');
  
  const dirs = ['app', 'components', 'pages'];
  let allFiles: string[] = [];
  
  for (const dir of dirs) {
    if (existsSync(dir)) {
      const files = await findAllFiles(dir);
      allFiles.push(...files);
    }
  }
  
  console.log(`📁 Scanning ${allFiles.length} files for incorrect relationship property names...`);
  
  let fixedFiles = 0;
  let totalChanges = 0;
  
  for (const file of allFiles) {
    const result = await fixRelationshipPropertyNames(file);
    
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
  console.log('2. Relationship property access should now work');
  
  console.log('\n📝 Fixed patterns:');
  console.log('   - .children → .childrens (generated relationship name)');
  console.log('   - .children?.[0]?.count → .childrens?.[0]?.count');
  console.log('   - .children?.length → .childrens?.length');
}

main().catch(console.error);