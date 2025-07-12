// scripts/dev/fix-import-conflicts.mts
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

async function fixImportConflicts(filePath: string): Promise<{
  success: boolean;
  changes: string[];
}> {
  try {
    let content = await readFile(filePath, 'utf-8');
    const originalContent = content;
    const changes: string[] = [];
    
    console.log(`🔧 Checking conflicts: ${filePath}`);
    
    // Common conflict patterns
    const conflicts = [
      {
        icon: 'Users',
        type: 'Users',
        iconAlias: 'UsersIcon',
        typeAlias: 'UsersType'
      },
      {
        icon: 'Calendar', 
        type: 'Calendar',
        iconAlias: 'CalendarIcon',
        typeAlias: 'CalendarType'
      },
      {
        icon: 'Camera',
        type: 'Photos', 
        iconAlias: 'CameraIcon',
        typeAlias: 'PhotosType'
      },
      {
        icon: 'MessageCircle',
        type: 'Messages',
        iconAlias: 'MessageIcon', 
        typeAlias: 'MessagesType'
      },
      {
        icon: 'FileText',
        type: 'Reports',
        iconAlias: 'FileIcon',
        typeAlias: 'ReportsType'
      }
    ];
    
    for (const conflict of conflicts) {
      // Check if both icon and type are imported
      const hasLucideImport = content.includes(`from 'lucide-react-native'`) && 
                             content.includes(conflict.icon);
      const hasTypeImport = content.includes(`from '@/lib/supabase/_generated/generated-types'`) &&
                           content.includes(conflict.type);
      
      if (hasLucideImport && hasTypeImport) {
        console.log(`  ⚠️  Found conflict: ${conflict.icon} (icon) vs ${conflict.type} (type)`);
        
        // Fix the type import with alias
        const typeImportRegex = new RegExp(`(import type \\{[^}]*?)\\b${conflict.type}\\b([^}]*\\} from '@/lib/supabase/_generated/generated-types')`, 'g');
        if (typeImportRegex.test(content)) {
          content = content.replace(typeImportRegex, `$1${conflict.type} as ${conflict.typeAlias}$2`);
          changes.push(`Aliased type ${conflict.type} as ${conflict.typeAlias}`);
        }
        
        // Update usage of the type throughout the file
        const typeUsageRegex = new RegExp(`\\b${conflict.type}\\[\\]`, 'g');
        if (typeUsageRegex.test(content)) {
          content = content.replace(typeUsageRegex, `${conflict.typeAlias}[]`);
          changes.push(`Updated ${conflict.type}[] usage to ${conflict.typeAlias}[]`);
        }
        
        // Update other type usages
        const stateTypeRegex = new RegExp(`useState<${conflict.type}\\[\\]>`, 'g');
        if (stateTypeRegex.test(content)) {
          content = content.replace(stateTypeRegex, `useState<${conflict.typeAlias}[]>`);
          changes.push(`Updated useState<${conflict.type}[]> to useState<${conflict.typeAlias}[]>`);
        }
      }
    }
    
    // Specific fix for removing unused type imports
    if (content.includes('from \'lucide-react-native\'') && 
        content.includes('from \'@/lib/supabase/_generated/generated-types\'')) {
      
      // Remove types that are not actually used as types (only as icons)
      const typesToCheck = ['Users', 'Classes', 'Photos', 'Messages', 'Reports', 'Attendance'];
      
      for (const typeToCheck of typesToCheck) {
        // Check if the type is actually used for typing (not just as icon)
        const isUsedAsType = content.includes(`${typeToCheck}[]`) || 
                            content.includes(`${typeToCheck}WithRelations`) ||
                            content.includes(`useState<${typeToCheck}`) ||
                            content.includes(`: ${typeToCheck}`);
        
        const isIconConflict = content.includes(`{ ${typeToCheck},`) && 
                              content.includes('lucide-react-native');
        
        if (isIconConflict && !isUsedAsType) {
          // Remove the type from generated types import
          const removeTypeRegex = new RegExp(`(import type \\{[^}]*?),?\\s*\\b${typeToCheck}\\b\\s*,?([^}]*\\} from '@/lib/supabase/_generated/generated-types')`, 'g');
          content = content.replace(removeTypeRegex, (match, before, after) => {
            // Clean up the comma placement
            let cleaned = before + after;
            cleaned = cleaned.replace(/,\s*,/g, ',').replace(/{\s*,/g, '{').replace(/,\s*}/g, '}');
            return cleaned;
          });
          changes.push(`Removed unused type import: ${typeToCheck}`);
        }
      }
    }
    
    // Clean up empty type imports
    const emptyTypeImportRegex = /import type \{\s*\} from '@\/lib\/supabase\/_generated\/generated-types';\s*\n/g;
    if (emptyTypeImportRegex.test(content)) {
      content = content.replace(emptyTypeImportRegex, '');
      changes.push('Removed empty type import');
    }
    
    // Write the file if there were changes
    if (content !== originalContent) {
      await writeFile(filePath, content);
      console.log(`  ✅ Applied ${changes.length} conflict fixes`);
      changes.forEach(change => console.log(`    - ${change}`));
    }
    
    return { success: true, changes };
    
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error);
    return { success: false, changes: [] };
  }
}

async function main() {
  console.log('🚀 Fixing import conflicts (icons vs types)...');
  
  // Find all TypeScript files
  const dirs = ['app', 'components', 'pages'];
  let allFiles: string[] = [];
  
  for (const dir of dirs) {
    if (existsSync(dir)) {
      const files = await findAllFiles(dir);
      allFiles.push(...files);
    }
  }
  
  console.log(`📁 Scanning ${allFiles.length} files for import conflicts...`);
  
  let fixedFiles = 0;
  let totalChanges = 0;
  
  for (const file of allFiles) {
    const result = await fixImportConflicts(file);
    
    if (result.changes.length > 0) {
      fixedFiles++;
      totalChanges += result.changes.length;
    }
  }
  
  console.log('\n📊 Summary:');
  console.log(`   Files scanned: ${allFiles.length}`);
  console.log(`   Files fixed: ${fixedFiles}`);
  console.log(`   Total conflict fixes: ${totalChanges}`);
  
  console.log('\n🎯 Next steps:');
  console.log('1. Run: npm run build');
  console.log('2. All import conflicts should be resolved');
}

main().catch(console.error);