// scripts/dev/migrate-components.mts
import { readFile, writeFile, readdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

interface MigrationPattern {
  name: string;
  find: RegExp;
  replace: string | ((match: string, ...groups: string[]) => string);
  description: string;
}

// Define comprehensive migration patterns based on your example
const COMPONENT_MIGRATION_PATTERNS: MigrationPattern[] = [
  // 1. Import migrations
  {
    name: 'supabase_client_import',
    find: /import\s*{\s*supabase\s*}\s*from\s*['"`]@\/lib\/supabase\/clients['"`];?/g,
    replace: '',
    description: 'Remove direct supabase client imports'
  },
  {
    name: 'core_types_import',
    find: /import\s*{\s*([^}]+)\s*}\s*from\s*['"`]@\/lib\/supabase\/core\/types['"`];?/g,
    replace: (match, types) => {
      // Convert old type names to new relationship types
      const typeMap: Record<string, string> = {
        'Child': 'ChildrenWithRelations',
        'Class': 'Classes', 
        'User': 'Users',
        'Announcement': 'Announcements',
        'Notification': 'Notifications',
        'Event': 'Events'
      };
      
      const oldTypes = types.split(',').map((t: string) => t.trim());
      const newTypes = oldTypes.map((type: string) => typeMap[type] || type);
      
      return `import type { ${newTypes.join(', ')} } from '@/lib/supabase/_generated/generated-types';\nimport { ${generateClientImports(oldTypes)} } from '@/lib/supabase/compatibility';`;
    },
    description: 'Convert type imports to generated types with relationship support'
  },

  // 2. State type migrations
  {
    name: 'state_child_array',
    find: /useState<Child\[\]>\(\[\]\)/g,
    replace: 'useState<ChildrenWithRelations[]>([])',
    description: 'Update Child[] state to ChildrenWithRelations[]'
  },
  {
    name: 'state_class_array', 
    find: /useState<Class\[\]>\(\[\]\)/g,
    replace: 'useState<Classes[]>([])',
    description: 'Update Class[] state to Classes[]'
  },
  {
    name: 'state_user_array',
    find: /useState<User\[\]>\(\[\]\)/g,
    replace: 'useState<Users[]>([])',
    description: 'Update User[] state to Users[]'
  },
  {
    name: 'editing_child_state',
    find: /useState<Child\s*\|\s*null>\(null\)/g,
    replace: 'useState<ChildrenWithRelations | null>(null)',
    description: 'Update editing child state type'
  },

  // 3. Function parameter types
  {
    name: 'function_child_param',
    find: /\(\s*child:\s*Child\s*\)\s*=>/g,
    replace: '(child: ChildrenWithRelations) =>',
    description: 'Update function parameters to use relationship types'
  },

  // 4. Supabase query migrations
  {
    name: 'supabase_from_children',
    find: /supabase\s*\.from\(\s*['"`]children['"`]\s*\)/g,
    replace: 'childrenClient()',
    description: 'Replace supabase.from("children") with childrenClient()'
  },
  {
    name: 'supabase_from_classes',
    find: /supabase\s*\.from\(\s*['"`]classes['"`]\s*\)/g,
    replace: 'classesClient()',
    description: 'Replace supabase.from("classes") with classesClient()'
  },
  {
    name: 'supabase_from_users',
    find: /supabase\s*\.from\(\s*['"`]users['"`]\s*\)/g,
    replace: 'usersClient()',
    description: 'Replace supabase.from("users") with usersClient()'
  },
  {
    name: 'supabase_from_parent_child',
    find: /supabase\s*\.from\(\s*['"`]parent_child_relationships['"`]\s*\)/g,
    replace: 'parentChildRelationshipsClient()',
    description: 'Replace parent_child_relationships queries'
  },

  // 5. Complex relationship queries
  {
    name: 'children_with_relationships_query',
    find: /\.select\(\s*[`'"][\s\S]*?\*[\s\S]*?class:classes\(\*\)[\s\S]*?parent_child_relationships\([\s\S]*?\)[\s\S]*?[`'"]\s*\)/g,
    replace: '.select(QueryWithRelations.children)',
    description: 'Replace complex relationship queries with generated query helpers'
  },

  // 6. Relationship access patterns
  {
    name: 'parent_relationship_access',
    find: /child\.parent_child_relationships\?\.\s*map\(\s*rel\s*=>\s*rel\.parent\.([a-zA-Z_]+)\s*\)/g,
    replace: (match, field) => `child.parent_child_relationships?.map(rel =>rel.parent_id?.${field}).filter(Boolean)`,
    description: 'Add null safety to relationship access'
  },

  // 7. SetState calls with data
  {
    name: 'set_children_data',
    find: /setChildren\(\s*childrenData\s*\|\|\s*\[\]\s*\)/g,
    replace: 'setChildren(childrenData as ChildrenWithRelations[] || [])',
    description: 'Add type assertion for children data'
  },

  // 8. JSX relationship display
  {
    name: 'parent_names_display',
    find: /child\.parent_child_relationships\.map\(\s*rel\s*=>\s*rel\.parent\.full_name\s*\)\.join\(\s*['"],['"]\s*\)/g,
    replace: 'child.parent_child_relationships?.map(rel =>rel.parent_id?.full_name).filter(Boolean).join(", ") || "No parents"',
    description: 'Add null safety to parent name display'
  },

  // 9. Class relationship access
  {
    name: 'class_name_access',
    find: /child\.class\.name/g,
    replace: 'child.class?.name',
    description: 'Add null safety to class name access'
  }
];

function generateClientImports(oldTypes: string[]): string {
  const clientMap: Record<string, string> = {
    'Child': 'childrenClient',
    'Class': 'classesClient',
    'User': 'usersClient',
    'Announcement': 'announcementsClient',
    'Notification': 'notificationsClient'
  };
  
  const clients = oldTypes
    .map(type => clientMap[type])
    .filter(Boolean);
  
  // Always include common clients
  const commonClients = ['childrenClient', 'classesClient', 'usersClient', 'parentChildRelationshipsClient'];
  const allClients = [...new Set([...clients, ...commonClients])];
  
  return allClients.join(', ');
}

async function findComponentFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      
      if (entry.isDirectory() && !entry.name.startsWith('.')) {
        const subFiles = await findComponentFiles(fullPath);
        files.push(...subFiles);
      } else if (entry.isFile() && entry.name.endsWith('.tsx')) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.log(`Skipping directory ${dir}: doesn't exist`);
  }
  
  return files;
}

async function migrateComponent(filePath: string): Promise<{
  success: boolean;
  changes: string[];
  errors: string[];
}> {
  try {
    let content = await readFile(filePath, 'utf-8');
    const changes: string[] = [];
    const errors: string[] = [];
    
    // Skip if file doesn't contain supabase usage
    if (!content.includes('supabase') && !content.includes('@/lib/supabase')) {
      return { success: true, changes: [], errors: [] };
    }
    
    console.log(`🔄 Migrating: ${filePath}`);
    
    // Apply all migration patterns
    for (const pattern of COMPONENT_MIGRATION_PATTERNS) {
      const originalContent = content;
      
      if (typeof pattern.replace === 'function') {
        content = content.replace(pattern.find, pattern.replace);
      } else {
        content = content.replace(pattern.find, pattern.replace);
      }
      
      if (content !== originalContent) {
        changes.push(pattern.description);
        console.log(`  ✅ ${pattern.description}`);
      }
    }
    
    // Add necessary imports at the top if they don't exist
    if (changes.length > 0) {
      // Check if QueryWithRelations import is needed
      if (content.includes('QueryWithRelations') && !content.includes('QueryWithRelations') || content.includes('import')) {
        if (!content.includes('QueryWithRelations')) {
          content = content.replace(
            /import type {([^}]+)} from '@\/lib\/supabase\/_generated\/generated-types'/,
            'import type { $1, QueryWithRelations } from \'@/lib/supabase/_generated/generated-types\''
          );
        }
      }
    }
    
    // Write the migrated file
    if (changes.length > 0) {
      await writeFile(filePath, content);
    }
    
    return { success: true, changes, errors };
    
  } catch (error) {
    return {
      success: false,
      changes: [],
      errors: [error instanceof Error ? error.message : 'Unknown error']
    };
  }
}

async function main() {
  console.log('🚀 Starting automated component migration...');
  
  // Find all component files
  const componentDirs = ['components', 'app', 'pages'];
  let allFiles: string[] = [];
  
  for (const dir of componentDirs) {
    if (existsSync(dir)) {
      const files = await findComponentFiles(dir);
      allFiles.push(...files);
    }
  }
  
  console.log(`📁 Found ${allFiles.length} component files to analyze`);
  
  let totalChanges = 0;
  let migratedFiles = 0;
  const migrationSummary: Record<string, number> = {};
  
  for (const file of allFiles) {
    const result = await migrateComponent(file);
    
    if (result.success && result.changes.length > 0) {
      migratedFiles++;
      totalChanges += result.changes.length;
      
      console.log(`✅ Migrated: ${file}`);
      result.changes.forEach(change => {
        migrationSummary[change] = (migrationSummary[change] || 0) + 1;
        console.log(`    - ${change}`);
      });
    } else if (!result.success) {
      console.log(`❌ Failed: ${file}`);
      result.errors.forEach(error => console.log(`    - ${error}`));
    }
  }
  
  console.log('\n📊 Migration Summary:');
  console.log(`   Total files analyzed: ${allFiles.length}`);
  console.log(`   Files migrated: ${migratedFiles}`);
  console.log(`   Total changes applied: ${totalChanges}`);
  
  console.log('\n🔧 Changes by type:');
  Object.entries(migrationSummary).forEach(([change, count]) => {
    console.log(`   ${count}x ${change}`);
  });
  
  console.log('\n🎯 Next steps:');
  console.log('1. Test your migrated components');
  console.log('2. Run: npm run build');
  console.log('3. Check for any remaining type errors');
  console.log('4. Test relationship functionality');
  
  if (migratedFiles > 0) {
    console.log('\n⚠️  Manual review recommended for:');
    console.log('   - Complex custom queries');
    console.log('   - Business logic around relationships');
    console.log('   - Error handling patterns');
  }
}

main().catch(console.error);