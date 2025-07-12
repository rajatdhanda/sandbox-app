// scripts/dev/fix-auth-response-structure.mts
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

async function fixAuthResponseStructure(filePath: string): Promise<{
  success: boolean;
  changes: string[];
}> {
  try {
    let content = await readFile(filePath, 'utf-8');
    const originalContent = content;
    const changes: string[] = [];
    
    // Skip files that don't use auth
    if (!content.includes('supabase.auth.getUser()') && !content.includes('userData.users')) {
      return { success: true, changes: [] };
    }
    
    console.log(`🔧 Fixing auth response structure: ${filePath}`);
    
    // Fix incorrect auth response property access
    const authFixes = [
      {
        find: /userData\.users\?/g,
        replace: 'userData.user?',
        description: 'Fixed auth response: userData.users → userData.user'
      },
      {
        find: /authData\.users\?/g,
        replace: 'authData.user?',
        description: 'Fixed auth response: authData.users → authData.user'
      },
      {
        find: /userResponse\.users\?/g,
        replace: 'userResponse.user?',
        description: 'Fixed auth response: userResponse.users → userResponse.user'
      },
      {
        find: /\.users\.id/g,
        replace: '.user?.id',
        description: 'Fixed auth user ID access'
      },
      {
        find: /\.users\.email/g,
        replace: '.user?.email',
        description: 'Fixed auth user email access'
      }
    ];
    
    authFixes.forEach(fix => {
      if (fix.find.test(content)) {
        content = content.replace(fix.find, fix.replace);
        changes.push(fix.description);
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
  console.log('🚀 Fixing Supabase auth response structure...');
  
  const dirs = ['app', 'components', 'pages'];
  let allFiles: string[] = [];
  
  for (const dir of dirs) {
    if (existsSync(dir)) {
      const files = await findAllFiles(dir);
      allFiles.push(...files);
    }
  }
  
  console.log(`📁 Scanning ${allFiles.length} files for auth response structure issues...`);
  
  let fixedFiles = 0;
  let totalChanges = 0;
  
  for (const file of allFiles) {
    const result = await fixAuthResponseStructure(file);
    
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
  console.log('2. Auth response access should now be correct');
  
  console.log('\n📝 Fixed patterns:');
  console.log('   - userData.users?.id → userData.user?.id');
  console.log('   - Supabase auth returns { data: { user: User } }');
}

main().catch(console.error);