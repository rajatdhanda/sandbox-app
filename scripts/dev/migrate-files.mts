// scripts/dev/migrate-files.mts
import { readFile, writeFile, readdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Define migration patterns
const MIGRATION_PATTERNS = [
  // 1. Import replacements
  {
    find: /import type { Database } from ['"](\.\/|\.\.\/).*generated-types['"];?/g,
    replace: "import type { Classes, Users, Children, Notifications, Announcements, Events, CurriculumAssignments } from '@/lib/supabase/_generated/generated-types';"
  },
  {
    find: /import type { (\w+) } from ['"](\.\/|\.\.\/).*types['"];?/g,
    replace: "// Migrated: $1 now comes from generated types"
  },
  {
    find: /import { supabase } from ['"](\.\/|\.\.\/).*client['"];?/g,
    replace: "import { usersClient, classesClient, childrenClient, announcementsClient, notificationsClient } from '@/lib/supabase/compatibility';"
  },

  // 2. Type definition replacements
  {
    find: /export type (\w+)Row = Database\['public'\]\['Tables'\]\['(\w+)'\]\['Row'\];/g,
    replace: "export type $1Row = $2 extends keyof GeneratedTypes ? GeneratedTypes[$2] : any; // TODO: Map to correct generated type"
  },

  // 3. Manual interface replacements
  {
    find: /export interface User \{[\s\S]*?\}/g,
    replace: "export type User = Users; // Migrated to generated type"
  },
  {
    find: /export interface Child \{[\s\S]*?\}/g,
    replace: "export type Child = Children; // Migrated to generated type"
  },
  {
    find: /export interface Class \{[\s\S]*?\}/g,
    replace: "export type Class = Classes; // Migrated to generated type"
  },

  // 4. Supabase query replacements
  {
    find: /supabase\.from\('users'\)/g,
    replace: "usersClient()"
  },
  {
    find: /supabase\.from\('classes'\)/g,
    replace: "classesClient()"
  },
  {
    find: /supabase\.from\('children'\)/g,
    replace: "childrenClient()"
  },
  {
    find: /supabase\.from\('notifications'\)/g,
    replace: "notificationsClient()"
  },
  {
    find: /supabase\.from\('announcements'\)/g,
    replace: "announcementsClient()"
  },
  {
    find: /supabase\.from\('events'\)/g,
    replace: "eventsClient()"
  },

  // 5. Type annotations in function signatures
  {
    find: /: Promise<Notification\[\]>/g,
    replace: ": Promise<Notifications[]>"
  },
  {
    find: /: Promise<Announcement\[\]>/g,
    replace: ": Promise<Announcements[]>"
  },
  {
    find: /: Promise<Event\[\]>/g,
    replace: ": Promise<Events[]>"
  },
  {
    find: /: Promise<User\[\]>/g,
    replace: ": Promise<Users[]>"
  },
  {
    find: /: Promise<Child\[\]>/g,
    replace: ": Promise<Children[]>"
  },
  {
    find: /: Promise<Class\[\]>/g,
    replace: ": Promise<Classes[]>"
  }
];

async function findFilesToMigrate(): Promise<string[]> {
  const files: string[] = [];
  
  // Search in common directories
  const searchDirs = [
    'lib/supabase',
    'app',
    'components',
    'pages/api'
  ];

  for (const dir of searchDirs) {
    if (existsSync(dir)) {
      const dirFiles = await findTSFiles(dir);
      files.push(...dirFiles);
    }
  }

  return files;
}

async function findTSFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
      const subFiles = await findTSFiles(fullPath);
      files.push(...subFiles);
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
      files.push(fullPath);
    }
  }

  return files;
}

async function migrateFile(filePath: string): Promise<{success: boolean, changes: number, errors: string[]}> {
  try {
    let content = await readFile(filePath, 'utf-8');
    let changes = 0;
    const errors: string[] = [];

    // Apply all migration patterns
    for (const pattern of MIGRATION_PATTERNS) {
      const originalContent = content;
      content = content.replace(pattern.find, pattern.replace);
      
      if (content !== originalContent) {
        changes++;
      }
    }

    // Only write if there were changes
    if (changes > 0) {
      await writeFile(filePath, content);
      return { success: true, changes, errors };
    }

    return { success: true, changes: 0, errors };
  } catch (error) {
    return { 
      success: false, 
      changes: 0, 
      errors: [error instanceof Error ? error.message : 'Unknown error'] 
    };
  }
}

async function main() {
  console.log('🚀 Starting automated migration...');
  
  const files = await findFilesToMigrate();
  console.log(`📁 Found ${files.length} TypeScript files to check`);

  let totalChanges = 0;
  let migratedFiles = 0;
  const errors: string[] = [];

  for (const file of files) {
    const result = await migrateFile(file);
    
    if (result.success) {
      if (result.changes > 0) {
        console.log(`✅ Migrated: ${file} (${result.changes} patterns replaced)`);
        migratedFiles++;
        totalChanges += result.changes;
      }
    } else {
      console.log(`❌ Failed: ${file} - ${result.errors.join(', ')}`);
      errors.push(...result.errors);
    }
  }

  console.log('\n📊 Migration Summary:');
  console.log(`   Files checked: ${files.length}`);
  console.log(`   Files migrated: ${migratedFiles}`);
  console.log(`   Total changes: ${totalChanges}`);
  console.log(`   Errors: ${errors.length}`);

  if (errors.length > 0) {
    console.log('\n❌ Errors encountered:');
    errors.forEach(error => console.log(`   - ${error}`));
  }

  console.log('\n🎯 Next steps:');
  console.log('1. Test your application to ensure everything works');
  console.log('2. Run: npm run type-check (if available)');
  console.log('3. Test API endpoints: ./scripts/dev/test-all-apis.sh');
  console.log('4. Fix any remaining manual imports');
}

main().catch(console.error);