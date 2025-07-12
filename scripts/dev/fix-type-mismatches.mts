// scripts/dev/fix-type-mismatches.mts
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

async function fixTypeMismatches(filePath: string): Promise<{
  success: boolean;
  changes: string[];
}> {
  try {
    let content = await readFile(filePath, 'utf-8');
    const originalContent = content;
    const changes: string[] = [];
    
    console.log(`🔧 Checking type mismatches: ${filePath}`);
    
    // Pattern 1: Fix UserRole type conflicts
    if (content.includes('type UserRole') && content.includes('Users')) {
      // Replace local UserRole with string union or use generated type
      const userRoleRegex = /type UserRole = ['"][^'"]*['"] \| ['"][^'"]*['"] \| ['"][^'"]*['"] \| ['"][^'"]*['"];?/g;
      if (userRoleRegex.test(content)) {
        content = content.replace(userRoleRegex, '// Using role from generated Users type');
        changes.push('Removed local UserRole type');
      }
      
      // Also handle single-line definitions
      const singleLineUserRole = /type UserRole = '[^']*' \| '[^']*' \| '[^']*' \| '[^']*';?/g;
      if (singleLineUserRole.test(content)) {
        content = content.replace(singleLineUserRole, '// Using role from generated Users type');
        changes.push('Removed local UserRole type (single line)');
      }
    }
    
    // Pattern 2: Fix function parameter types
    const getRoleColorRegex = /const getRoleColor = \(role: UserRole\)/g;
    if (getRoleColorRegex.test(content)) {
      content = content.replace(getRoleColorRegex, 'const getRoleColor = (role: string)');
      changes.push('Fixed getRoleColor parameter type');
    }
    
    // Pattern 3: Fix state type declarations
    const roleStateRegex = /useState<UserRole>\(/g;
    if (roleStateRegex.test(content)) {
      content = content.replace(roleStateRegex, 'useState<string>(');
      changes.push('Fixed role state type');
    }
    
    // Pattern 4: Fix variable declarations
    const setRoleRegex = /setRole\(itemValue as UserRole\)/g;
    if (setRoleRegex.test(content)) {
      content = content.replace(setRoleRegex, 'setRole(itemValue as string)');
      changes.push('Fixed setRole type cast');
    }
    
    // Pattern 5: Add type assertion for user.role
    const userRoleAccessRegex = /getRoleColor\(user\.role\)/g;
    if (userRoleAccessRegex.test(content)) {
      content = content.replace(userRoleAccessRegex, 'getRoleColor(user.role as string)');
      changes.push('Added type assertion for user.role');
    }
    
    // Pattern 6: Fix other role-related type assertions
    const roleUpperCaseRegex = /user\.role\.toUpperCase\(\)/g;
    if (roleUpperCaseRegex.test(content)) {
      content = content.replace(roleUpperCaseRegex, '(user.role as string).toUpperCase()');
      changes.push('Added type assertion for role.toUpperCase()');
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
  console.log('🚀 Fixing type mismatches...');
  
  // Find all TypeScript files
  const dirs = ['app', 'components', 'pages'];
  let allFiles: string[] = [];
  
  for (const dir of dirs) {
    if (existsSync(dir)) {
      const files = await findAllFiles(dir);
      allFiles.push(...files);
    }
  }
  
  console.log(`📁 Scanning ${allFiles.length} files for type mismatches...`);
  
  let fixedFiles = 0;
  let totalChanges = 0;
  
  for (const file of allFiles) {
    const result = await fixTypeMismatches(file);
    
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
  console.log('2. Check for any remaining type errors');
}

main().catch(console.error);