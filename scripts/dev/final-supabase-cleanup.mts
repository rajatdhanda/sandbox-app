// scripts/dev/final-supabase-cleanup.mts
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

async function fixAllSupabaseRefs(filePath: string): Promise<{
  success: boolean;
  changes: string[];
}> {
  try {
    let content = await readFile(filePath, 'utf-8');
    const originalContent = content;
    const changes: string[] = [];
    
    // Skip files that don't use supabase
    if (!content.includes('supabase')) {
      return { success: true, changes: [] };
    }
    
    console.log(`🔧 Final cleanup: ${filePath}`);
    
    // Remove any remaining supabase imports
    const importPatterns = [
      /import\s*{\s*supabase\s*}\s*from\s*['"][^'"]*['"];\s*\n?/g,
      /import\s+{\s*supabase\s*}\s+from\s+['"][^'"]*['"];\s*\n?/g,
      /import\s*{\s*supabase\s*,\s*[^}]*}\s*from\s*['"][^'"]*['"];\s*\n?/g
    ];
    
    importPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        content = content.replace(pattern, '');
        changes.push('Removed supabase import');
      }
    });
    
    // Complete table mappings
    const tableMappings = [
      { table: 'class_assignments', client: 'classAssignmentsClient' },
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
      { table: 'milestones', client: 'milestonesClient' },
      { table: 'student_progress', client: 'studentProgressClient' },
      { table: 'photo_albums', client: 'photoAlbumsClient' },
      { table: 'photo_tags', client: 'photoTagsClient' },
      { table: 'message_threads', client: 'messageThreadsClient' },
      { table: 'curriculum', client: 'curriculumClient' },
      { table: 'curriculum_items', client: 'curriculumItemsClient' },
      { table: 'curriculum_templates', client: 'curriculumTemplatesClient' },
      { table: 'curriculum_executions', client: 'curriculumExecutionsClient' },
      { table: 'curriculum_imports', client: 'curriculumImportsClient' },
      { table: 'time_slots', client: 'timeSlotsClient' },
      { table: 'system_logs', client: 'systemLogsClient' },
      { table: 'worksheets', client: 'worksheetsClient' }
    ];
    
    const clientsNeeded = new Set<string>();
    
    // Replace all supabase.from() patterns
    tableMappings.forEach(({ table, client }) => {
      const patterns = [
        new RegExp(`supabase\\s*\\.from\\(\\s*['"\`]${table}['"\`]\\s*\\)`, 'g'),
        new RegExp(`supabase\\.from\\(['"\`]${table}['"\`]\\)`, 'g')
      ];
      
      patterns.forEach(regex => {
        if (regex.test(content)) {
          content = content.replace(regex, `${client}()`);
          clientsNeeded.add(client);
          changes.push(`Replaced supabase.from('${table}') with ${client}()`);
        }
      });
    });
    
    // Also catch any remaining generic supabase.from() calls
    const genericFromRegex = /supabase\s*\.from\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
    let match;
    while ((match = genericFromRegex.exec(content)) !== null) {
      const tableName = match[1];
      const clientName = `${tableName.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())}Client`;
      content = content.replace(match[0], `${clientName}()`);
      clientsNeeded.add(clientName);
      changes.push(`Replaced generic supabase.from('${tableName}') with ${clientName}()`);
    }
    
    // Add missing client imports
    if (clientsNeeded.size > 0) {
      const clientsArray = Array.from(clientsNeeded);
      
      // Check if there's already a compatibility import
      const existingImportMatch = content.match(/import\s*{\s*([^}]+)\s*}\s*from\s*['"`]@\/lib\/supabase\/compatibility['"`]/);
      
      if (existingImportMatch) {
        // Merge with existing import
        const existingClients = existingImportMatch[1].split(',').map(c => c.trim());
        const allClients = [...new Set([...existingClients, ...clientsArray])];
        const newImportLine = `import { ${allClients.join(', ')} } from '@/lib/supabase/compatibility'`;
        content = content.replace(existingImportMatch[0], newImportLine);
        changes.push(`Merged client imports: ${clientsArray.join(', ')}`);
      } else {
        // Add new import
        const importLine = `import { ${clientsArray.join(', ')} } from '@/lib/supabase/compatibility';\n`;
        
        // Find best insertion point
        const typeImportMatch = content.match(/import type.*from '@\/lib\/supabase\/_generated\/generated-types'.*?\n/);
        const reactImportMatch = content.match(/import.*from 'react'.*?\n/);
        
        if (typeImportMatch) {
          const insertPoint = content.indexOf(typeImportMatch[0]) + typeImportMatch[0].length;
          content = content.slice(0, insertPoint) + importLine + content.slice(insertPoint);
        } else if (reactImportMatch) {
          const insertPoint = content.indexOf(reactImportMatch[0]) + reactImportMatch[0].length;
          content = content.slice(0, insertPoint) + importLine + content.slice(insertPoint);
        } else {
          content = importLine + content;
        }
        changes.push(`Added client imports: ${clientsArray.join(', ')}`);
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

async function ensureCompatibilityLayer() {
  const compatPath = 'lib/supabase/compatibility.ts';
  
  console.log('🔧 Ensuring compatibility layer has all clients...');
  
  const compatContent = `// lib/supabase/compatibility.ts - Complete compatibility layer
import { createClient } from '@supabase/supabase-js';

// Create supabase client
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

// Export all client functions for every table
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
export const dailyLogsClient = () => supabase.from('daily_logs');
export const milestonesClient = () => supabase.from('milestones');
export const classAssignmentsClient = () => supabase.from('class_assignments');
export const attendanceRecordsClient = () => supabase.from('attendance_records');
export const studentProgressClient = () => supabase.from('student_progress');
export const photoAlbumsClient = () => supabase.from('photo_albums');
export const photoTagsClient = () => supabase.from('photo_tags');
export const messageThreadsClient = () => supabase.from('message_threads');
export const curriculumClient = () => supabase.from('curriculum');
export const curriculumItemsClient = () => supabase.from('curriculum_items');
export const curriculumTemplatesClient = () => supabase.from('curriculum_templates');
export const curriculumExecutionsClient = () => supabase.from('curriculum_executions');
export const curriculumImportsClient = () => supabase.from('curriculum_imports');
export const timeSlotsClient = () => supabase.from('time_slots');
export const systemLogsClient = () => supabase.from('system_logs');
export const worksheetsClient = () => supabase.from('worksheets');

// Re-export types for convenience
export type {
  Users,
  Children,
  Classes,
  Announcements,
  Notifications,
  Events,
  Photos,
  Messages,
  Reports
} from './_generated/generated-types';

// Legacy type aliases for backward compatibility
export type User = Users;
export type Child = Children;
export type Class = Classes;
export type Announcement = Announcements;
export type Notification = Notifications;
export type Event = Events;
export type Photo = Photos;
export type Message = Messages;
export type Report = Reports;
`;
  
  await writeFile(compatPath, compatContent);
  console.log('✅ Updated compatibility layer with all clients');
}

async function main() {
  console.log('🚀 Final cleanup of ALL supabase references...');
  
  // Ensure compatibility layer is complete
  await ensureCompatibilityLayer();
  
  const dirs = ['app', 'components', 'pages'];
  let allFiles: string[] = [];
  
  for (const dir of dirs) {
    if (existsSync(dir)) {
      const files = await findAllFiles(dir);
      allFiles.push(...files);
    }
  }
  
  console.log(`📁 Scanning ${allFiles.length} files for any remaining supabase references...`);
  
  let fixedFiles = 0;
  let totalChanges = 0;
  
  for (const file of allFiles) {
    const result = await fixAllSupabaseRefs(file);
    
    if (result.changes.length > 0) {
      fixedFiles++;
      totalChanges += result.changes.length;
    }
  }
  
  console.log('\n📊 Final Summary:');
  console.log(`   Files scanned: ${allFiles.length}`);
  console.log(`   Files fixed: ${fixedFiles}`);
  console.log(`   Total fixes: ${totalChanges}`);
  
  console.log('\n🎯 Next steps:');
  console.log('1. Run: npm run build');
  console.log('2. ALL supabase references should now be fixed');
  
  if (fixedFiles === 0) {
    console.log('\n✅ No remaining supabase references found!');
  }
}

main().catch(console.error);