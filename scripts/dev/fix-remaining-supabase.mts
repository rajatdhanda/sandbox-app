// scripts/dev/fix-remaining-supabase.mts
import { readFile, writeFile, readdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

interface SupabasePattern {
  name: string;
  find: RegExp;
  replace: string;
  clientImport: string;
  description: string;
}

// Patterns for all remaining supabase.from() calls
const SUPABASE_PATTERNS: SupabasePattern[] = [
  {
    name: 'config_fields',
    find: /supabase\s*\.from\(\s*['"`]config_fields['"`]\s*\)/g,
    replace: 'configFieldsClient()',
    clientImport: 'configFieldsClient',
    description: 'Replace config_fields queries'
  },
  {
    name: 'announcements',
    find: /supabase\s*\.from\(\s*['"`]announcements['"`]\s*\)/g,
    replace: 'announcementsClient()',
    clientImport: 'announcementsClient',
    description: 'Replace announcements queries'
  },
  {
    name: 'notifications',
    find: /supabase\s*\.from\(\s*['"`]notifications['"`]\s*\)/g,
    replace: 'notificationsClient()',
    clientImport: 'notificationsClient',
    description: 'Replace notifications queries'
  },
  {
    name: 'events',
    find: /supabase\s*\.from\(\s*['"`]events['"`]\s*\)/g,
    replace: 'eventsClient()',
    clientImport: 'eventsClient',
    description: 'Replace events queries'
  },
  {
    name: 'photos',
    find: /supabase\s*\.from\(\s*['"`]photos['"`]\s*\)/g,
    replace: 'photosClient()',
    clientImport: 'photosClient',
    description: 'Replace photos queries'
  },
  {
    name: 'reports',
    find: /supabase\s*\.from\(\s*['"`]reports['"`]\s*\)/g,
    replace: 'reportsClient()',
    clientImport: 'reportsClient',
    description: 'Replace reports queries'
  },
  {
    name: 'messages',
    find: /supabase\s*\.from\(\s*['"`]messages['"`]\s*\)/g,
    replace: 'messagesClient()',
    clientImport: 'messagesClient',
    description: 'Replace messages queries'
  },
  {
    name: 'attendance',
    find: /supabase\s*\.from\(\s*['"`]attendance['"`]\s*\)/g,
    replace: 'attendanceClient()',
    clientImport: 'attendanceClient',
    description: 'Replace attendance queries'
  },
  {
    name: 'curriculum_assignments',
    find: /supabase\s*\.from\(\s*['"`]curriculum_assignments['"`]\s*\)/g,
    replace: 'curriculumAssignmentsClient()',
    clientImport: 'curriculumAssignmentsClient',
    description: 'Replace curriculum_assignments queries'
  },
  // Add any other tables you use
];

// Additional patterns for edge cases
const ADDITIONAL_PATTERNS = [
  {
    name: 'remove_supabase_import',
    find: /import\s*{\s*supabase\s*}\s*from\s*['"`][^'"`]*['"`];?\s*\n?/g,
    replace: '',
    description: 'Remove remaining supabase imports'
  },
  {
    name: 'add_compatibility_import',
    find: /(import.*from.*['"`]@\/lib\/supabase\/_generated\/generated-types['"`];?\s*\n)/,
    replace: '$1import { INSERT_CLIENTS } from \'@/lib/supabase/compatibility\';\n',
    description: 'Add compatibility imports placeholder'
  }
];

async function findTSXFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        const subFiles = await findTSXFiles(fullPath);
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

async function fixSupabaseReferences(filePath: string): Promise<{
  success: boolean;
  changes: string[];
  clientsNeeded: string[];
  errors: string[];
}> {
  try {
    let content = await readFile(filePath, 'utf-8');
    const changes: string[] = [];
    const clientsNeeded: string[] = [];
    const errors: string[] = [];
    
    // Skip if no supabase references
    if (!content.includes('supabase.from(')) {
      return { success: true, changes: [], clientsNeeded: [], errors: [] };
    }
    
    console.log(`🔧 Fixing: ${filePath}`);
    
    // Apply supabase.from() patterns
    for (const pattern of SUPABASE_PATTERNS) {
      if (pattern.find.test(content)) {
        content = content.replace(pattern.find, pattern.replace);
        changes.push(pattern.description);
        clientsNeeded.push(pattern.clientImport);
        console.log(`  ✅ ${pattern.description}`);
      }
    }
    
    // Apply additional patterns
    for (const pattern of ADDITIONAL_PATTERNS) {
      const originalContent = content;
      content = content.replace(pattern.find, pattern.replace);
      
      if (content !== originalContent) {
        changes.push(pattern.description);
        console.log(`  ✅ ${pattern.description}`);
      }
    }
    
    // Add client imports if needed
    if (clientsNeeded.length > 0) {
      const uniqueClients = [...new Set(clientsNeeded)];
      const clientImportLine = `import { ${uniqueClients.join(', ')} } from '@/lib/supabase/compatibility';`;
      
      // Replace the placeholder or add new import
      if (content.includes('INSERT_CLIENTS')) {
        content = content.replace('INSERT_CLIENTS', uniqueClients.join(', '));
      } else {
        // Find a good place to insert the import
        const importMatch = content.match(/import.*from.*['"`]@\/lib\/supabase\/_generated\/generated-types['"`];?\s*\n/);
        if (importMatch) {
          content = content.replace(importMatch[0], importMatch[0] + clientImportLine + '\n');
        } else {
          // Add at the top after existing imports
          const lastImportMatch = content.match(/^import.*$/gm);
          if (lastImportMatch) {
            const lastImport = lastImportMatch[lastImportMatch.length - 1];
            content = content.replace(lastImport, lastImport + '\n' + clientImportLine);
          }
        }
      }
      changes.push(`Added client imports: ${uniqueClients.join(', ')}`);
    }
    
    // Write the fixed file
    if (changes.length > 0) {
      await writeFile(filePath, content);
    }
    
    return { success: true, changes, clientsNeeded, errors };
    
  } catch (error) {
    return {
      success: false,
      changes: [],
      clientsNeeded: [],
      errors: [error instanceof Error ? error.message : 'Unknown error']
    };
  }
}

async function updateCompatibilityLayer() {
  console.log('🔧 Updating compatibility layer with all client functions...');
  
  const compatPath = 'lib/supabase/compatibility.ts';
  
  if (!existsSync(compatPath)) {
    console.log('⚠️ Compatibility layer not found, creating basic version...');
    
    const compatContent = `// lib/supabase/compatibility.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Export all client functions
export const usersClient = () => supabase.from('users');
export const childrenClient = () => supabase.from('children');
export const classesClient = () => supabase.from('classes');
export const announcementsClient = () => supabase.from('announcements');
export const notificationsClient = () => supabase.from('notifications');
export const eventsClient = () => supabase.from('events');
export const photosClient = () => supabase.from('photos');
export const messagesClient = () => supabase.from('messages');
export const reportsClient = () => supabase.from('reports');
export const attendanceClient = () => supabase.from('attendance');
export const configFieldsClient = () => supabase.from('config_fields');
export const curriculumAssignmentsClient = () => supabase.from('curriculum_assignments');
export const parentChildRelationshipsClient = () => supabase.from('parent_child_relationships');

// Re-export types
export * from './_generated/generated-types';
`;
    
    await writeFile(compatPath, compatContent);
    console.log('✅ Created compatibility layer');
  }
}

async function main() {
  console.log('🚀 Fixing remaining supabase references...');
  
  // Update compatibility layer first
  await updateCompatibilityLayer();
  
  // Find all TypeScript files
  const dirs = ['app', 'components', 'pages'];
  let allFiles: string[] = [];
  
  for (const dir of dirs) {
    if (existsSync(dir)) {
      const files = await findTSXFiles(dir);
      allFiles.push(...files);
    }
  }
  
  console.log(`📁 Scanning ${allFiles.length} files for supabase references...`);
  
  let fixedFiles = 0;
  let totalChanges = 0;
  const allClientsNeeded = new Set<string>();
  
  for (const file of allFiles) {
    const result = await fixSupabaseReferences(file);
    
    if (result.success && result.changes.length > 0) {
      fixedFiles++;
      totalChanges += result.changes.length;
      result.clientsNeeded.forEach(client => allClientsNeeded.add(client));
      
      console.log(`✅ Fixed: ${file}`);
      result.changes.forEach(change => console.log(`    - ${change}`));
    } else if (!result.success) {
      console.log(`❌ Failed: ${file}`);
      result.errors.forEach(error => console.log(`    - ${error}`));
    }
  }
  
  console.log('\n📊 Fix Summary:');
  console.log(`   Files scanned: ${allFiles.length}`);
  console.log(`   Files fixed: ${fixedFiles}`);
  console.log(`   Total changes: ${totalChanges}`);
  console.log(`   Unique clients needed: ${allClientsNeeded.size}`);
  
  console.log('\n🎯 Next steps:');
  console.log('1. Run: npm run build');
  console.log('2. Check for any remaining type errors');
  console.log('3. Test the fixed components');
  
  if (fixedFiles === 0) {
    console.log('\n✅ No supabase references found - migration complete!');
  }
}

main().catch(console.error);