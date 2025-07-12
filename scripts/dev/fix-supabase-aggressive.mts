// scripts/dev/fix-supabase-aggressive.mts
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

async function fixFile(filePath: string): Promise<{
  success: boolean;
  changes: string[];
  hasSupabaseUsage: boolean;
}> {
  try {
    let content = await readFile(filePath, 'utf-8');
    const originalContent = content;
    const changes: string[] = [];
    
    // Check if file has any supabase usage
    const hasSupabaseUsage = content.includes('supabase') || content.includes('.from(');
    
    if (!hasSupabaseUsage) {
      return { success: true, changes: [], hasSupabaseUsage: false };
    }
    
    console.log(`🔧 Processing: ${filePath}`);
    
    // Pattern 1: Remove supabase import
    const supabaseImportRegex = /import\s*{\s*supabase\s*}\s*from\s*['"][^'"]*['"];?\s*\n?/g;
    if (supabaseImportRegex.test(content)) {
      content = content.replace(supabaseImportRegex, '');
      changes.push('Removed supabase import');
    }
    
    // Pattern 2: Replace all supabase.from() calls with specific clients
    const tableReplacements = [
      { table: 'config_fields', client: 'configFieldsClient' },
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
      { table: 'parent_child_relationships', client: 'parentChildRelationshipsClient' },
      { table: 'curriculum_assignments', client: 'curriculumAssignmentsClient' },
      { table: 'daily_logs', client: 'dailyLogsClient' },
      { table: 'milestones', client: 'milestonesClient' },
    ];
    
    const clientsNeeded: string[] = [];
    
    for (const { table, client } of tableReplacements) {
      const regex = new RegExp(`supabase\\s*\\.from\\(\\s*['"\`]${table}['"\`]\\s*\\)`, 'g');
      if (regex.test(content)) {
        content = content.replace(regex, `${client}()`);
        clientsNeeded.push(client);
        changes.push(`Replaced supabase.from('${table}') with ${client}()`);
      }
    }
    
    // Pattern 3: Add client imports if needed
    if (clientsNeeded.length > 0) {
      const uniqueClients = [...new Set(clientsNeeded)];
      const importLine = `import { ${uniqueClients.join(', ')} } from '@/lib/supabase/compatibility';\n`;
      
      // Find where to insert the import
      const importRegex = /^import.*$/gm;
      const imports = content.match(importRegex);
      
      if (imports && imports.length > 0) {
        // Add after the last import
        const lastImport = imports[imports.length - 1];
        const lastImportIndex = content.lastIndexOf(lastImport);
        const insertIndex = lastImportIndex + lastImport.length;
        content = content.slice(0, insertIndex) + '\n' + importLine + content.slice(insertIndex);
      } else {
        // Add at the beginning
        content = importLine + '\n' + content;
      }
      
      changes.push(`Added imports: ${uniqueClients.join(', ')}`);
    }
    
    // Write the file if there were changes
    if (content !== originalContent) {
      await writeFile(filePath, content);
      console.log(`  ✅ Applied ${changes.length} changes`);
      changes.forEach(change => console.log(`    - ${change}`));
    }
    
    return { success: true, changes, hasSupabaseUsage: true };
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error);
    return { success: false, changes: [], hasSupabaseUsage: false };
  }
}

async function ensureCompatibilityLayer() {
  const compatPath = 'lib/supabase/compatibility.ts';
  
  console.log('🔧 Ensuring compatibility layer exists...');
  
  const compatContent = `// lib/supabase/compatibility.ts - Auto-generated compatibility layer
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
export const dailyLogsClient = () => supabase.from('daily_logs');
export const milestonesClient = () => supabase.from('milestones');

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
  console.log('✅ Compatibility layer updated');
}

async function main() {
  console.log('🚀 Starting aggressive supabase reference fix...');
  
  // Ensure compatibility layer exists
  await ensureCompatibilityLayer();
  
  // Find all TypeScript files
  const dirs = ['app', 'components', 'pages'];
  let allFiles: string[] = [];
  
  for (const dir of dirs) {
    if (existsSync(dir)) {
      const files = await findAllFiles(dir);
      allFiles.push(...files);
    }
  }
  
  console.log(`📁 Scanning ${allFiles.length} files...`);
  
  let processedFiles = 0;
  let changedFiles = 0;
  let totalChanges = 0;
  
  for (const file of allFiles) {
    const result = await fixFile(file);
    
    if (result.hasSupabaseUsage) {
      processedFiles++;
      
      if (result.changes.length > 0) {
        changedFiles++;
        totalChanges += result.changes.length;
      }
    }
  }
  
  console.log('\n📊 Summary:');
  console.log(`   Total files scanned: ${allFiles.length}`);
  console.log(`   Files with supabase usage: ${processedFiles}`);
  console.log(`   Files changed: ${changedFiles}`);
  console.log(`   Total changes applied: ${totalChanges}`);
  
  console.log('\n🎯 Next steps:');
  console.log('1. Run: npm run build');
  console.log('2. Fix any remaining import path issues');
  console.log('3. Test the migrated functionality');
}

main().catch(console.error);