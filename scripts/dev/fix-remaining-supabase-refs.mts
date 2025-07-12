// scripts/dev/fix-remaining-supabase-refs.mts
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

async function fixSupabaseRefs(filePath: string): Promise<{
  success: boolean;
  changes: string[];
}> {
  try {
    let content = await readFile(filePath, 'utf-8');
    const originalContent = content;
    const changes: string[] = [];
    
    // Skip if no supabase usage
    if (!content.includes('supabase.from(') && !content.includes('supabase\n')) {
      return { success: true, changes: [] };
    }
    
    console.log(`🔧 Fixing supabase refs: ${filePath}`);
    
    // Remove any remaining supabase imports
    content = content.replace(/import\s*{\s*supabase\s*}\s*from\s*['"][^'"]*['"];\s*\n?/g, '');
    
    // Table mappings
    const tableMappings = [
      { table: 'attendance_records', client: 'attendanceRecordsClient' },
      { table: 'users', client: 'usersClient' },
      { table: 'children', client: 'childrenClient' },
      { table: 'classes', client: 'classesClient' },
      { table: 'announcements', client: 'announcementsClient' },
      { table: 'notifications', client: 'notificationsClient' },
      { table: 'events', client: 'eventsClient' },
      { table: 'photos', client: 'photosClient' },
      { table: 'messages', client: 'messagesClient' },
      { table: 'reports', client: 'reportsClient' },
      { table: 'attendance', client: 'attendanceClient' },
      { table: 'config_fields', client: 'configFieldsClient' },
      { table: 'curriculum_assignments', client: 'curriculumAssignmentsClient' },
      { table: 'parent_child_relationships', client: 'parentChildRelationshipsClient' },
      { table: 'daily_logs', client: 'dailyLogsClient' },
      { table: 'milestones', client: 'milestonesClient' }
    ];
    
    const clientsNeeded = new Set<string>();
    
    // Replace supabase.from() calls
    tableMappings.forEach(({ table, client }) => {
      const regex = new RegExp(`supabase\\s*\\.from\\(\\s*['"\`]${table}['"\`]\\s*\\)`, 'g');
      if (regex.test(content)) {
        content = content.replace(regex, `${client}()`);
        clientsNeeded.add(client);
        changes.push(`Replaced supabase.from('${table}') with ${client}()`);
      }
    });
    
    // Add missing client imports
    if (clientsNeeded.size > 0) {
      const clientsArray = Array.from(clientsNeeded);
      const importLine = `import { ${clientsArray.join(', ')} } from '@/lib/supabase/compatibility';\n`;
      
      // Find insertion point
      const typeImportMatch = content.match(/import type.*from '@\/lib\/supabase\/_generated\/generated-types'.*?\n/);
      const reactImportMatch = content.match(/import.*from 'react'.*?\n/);
      const compatImportMatch = content.match(/import.*from '@\/lib\/supabase\/compatibility'.*?\n/);
      
      if (compatImportMatch) {
        // Merge with existing compatibility import
        const existingMatch = compatImportMatch[0].match(/import \{([^}]+)\}/);
        if (existingMatch) {
          const existingClients = existingMatch[1].split(',').map(c => c.trim());
          const allClients = [...new Set([...existingClients, ...clientsArray])];
          const newImportLine = `import { ${allClients.join(', ')} } from '@/lib/supabase/compatibility';\n`;
          content = content.replace(compatImportMatch[0], newImportLine);
          changes.push(`Merged client imports: ${clientsArray.join(', ')}`);
        }
      } else if (typeImportMatch) {
        const insertPoint = content.indexOf(typeImportMatch[0]) + typeImportMatch[0].length;
        content = content.slice(0, insertPoint) + importLine + content.slice(insertPoint);
        changes.push(`Added client imports: ${clientsArray.join(', ')}`);
      } else if (reactImportMatch) {
        const insertPoint = content.indexOf(reactImportMatch[0]) + reactImportMatch[0].length;
        content = content.slice(0, insertPoint) + importLine + content.slice(insertPoint);
        changes.push(`Added client imports: ${clientsArray.join(', ')}`);
      } else {
        content = importLine + content;
        changes.push(`Added client imports at top: ${clientsArray.join(', ')}`);
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
  console.log('🚀 Fixing remaining supabase references...');
  
  const dirs = ['app', 'components', 'pages'];
  let allFiles: string[] = [];
  
  for (const dir of dirs) {
    if (existsSync(dir)) {
      const files = await findAllFiles(dir);
      allFiles.push(...files);
    }
  }
  
  console.log(`📁 Scanning ${allFiles.length} files for supabase references...`);
  
  let fixedFiles = 0;
  let totalChanges = 0;
  
  for (const file of allFiles) {
    const result = await fixSupabaseRefs(file);
    
    if (result.changes.length > 0) {
      fixedFiles++;
      totalChanges += result.changes.length;
    }
  }
  
  console.log('\n📊 Summary:');
  console.log(`   Files scanned: ${allFiles.length}`);
  console.log(`   Files fixed: ${fixedFiles}`);
  console.log(`   Total fixes: ${totalChanges}`);
  
  console.log('\n🎯 Next steps:');
  console.log('1. Run: npm run build');
}

main().catch(console.error);