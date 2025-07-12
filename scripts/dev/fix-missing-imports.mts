// scripts/dev/fix-missing-imports.mts
import { readFile, writeFile, readdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Map of types that need imports
const TYPE_IMPORT_MAP = {
  'Users': '@/lib/supabase/_generated/generated-types',
  'Classes': '@/lib/supabase/_generated/generated-types',
  'Children': '@/lib/supabase/_generated/generated-types',
  'ChildrenWithRelations': '@/lib/supabase/_generated/generated-types',
  'UsersWithRelations': '@/lib/supabase/_generated/generated-types',
  'ClassesWithRelations': '@/lib/supabase/_generated/generated-types',
  'Announcements': '@/lib/supabase/_generated/generated-types',
  'AnnouncementsWithRelations': '@/lib/supabase/_generated/generated-types',
  'Notifications': '@/lib/supabase/_generated/generated-types',
  'NotificationsWithRelations': '@/lib/supabase/_generated/generated-types',
  'Events': '@/lib/supabase/_generated/generated-types',
  'EventsWithRelations': '@/lib/supabase/_generated/generated-types',
  'Photos': '@/lib/supabase/_generated/generated-types',
  'PhotosWithRelations': '@/lib/supabase/_generated/generated-types',
  'Messages': '@/lib/supabase/_generated/generated-types',
  'MessagesWithRelations': '@/lib/supabase/_generated/generated-types',
  'Reports': '@/lib/supabase/_generated/generated-types',
  'ReportsWithRelations': '@/lib/supabase/_generated/generated-types',
  'Attendance': '@/lib/supabase/_generated/generated-types',
  'AttendanceWithRelations': '@/lib/supabase/_generated/generated-types',
  'QueryWithRelations': '@/lib/supabase/_generated/generated-types'
};

const CLIENT_IMPORT_MAP = {
  'usersClient': '@/lib/supabase/compatibility',
  'childrenClient': '@/lib/supabase/compatibility',
  'classesClient': '@/lib/supabase/compatibility',
  'announcementsClient': '@/lib/supabase/compatibility',
  'notificationsClient': '@/lib/supabase/compatibility',
  'eventsClient': '@/lib/supabase/compatibility',
  'photosClient': '@/lib/supabase/compatibility',
  'messagesClient': '@/lib/supabase/compatibility',
  'reportsClient': '@/lib/supabase/compatibility',
  'attendanceClient': '@/lib/supabase/compatibility',
  'configFieldsClient': '@/lib/supabase/compatibility',
  'curriculumAssignmentsClient': '@/lib/supabase/compatibility',
  'parentChildRelationshipsClient': '@/lib/supabase/compatibility',
  'dailyLogsClient': '@/lib/supabase/compatibility',
  'milestonesClient': '@/lib/supabase/compatibility'
};

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

function findMissingTypes(content: string): string[] {
  const missingTypes: string[] = [];
  
  for (const [typeName, importPath] of Object.entries(TYPE_IMPORT_MAP)) {
    // Check if type is used but not imported
    const typeUsageRegex = new RegExp(`\\b${typeName}\\b`, 'g');
    const importRegex = new RegExp(`import.*\\b${typeName}\\b.*from.*${importPath.replace('/', '\\/')}`);
    
    if (typeUsageRegex.test(content) && !importRegex.test(content)) {
      missingTypes.push(typeName);
    }
  }
  
  return [...new Set(missingTypes)];
}

function findMissingClients(content: string): string[] {
  const missingClients: string[] = [];
  
  for (const [clientName, importPath] of Object.entries(CLIENT_IMPORT_MAP)) {
    // Check if client is used but not imported
    const clientUsageRegex = new RegExp(`\\b${clientName}\\(\\)`, 'g');
    const importRegex = new RegExp(`import.*\\b${clientName}\\b.*from.*${importPath.replace('/', '\\/')}`);
    
    if (clientUsageRegex.test(content) && !importRegex.test(content)) {
      missingClients.push(clientName);
    }
  }
  
  return [...new Set(missingClients)];
}

function addImports(content: string, types: string[], clients: string[]): string {
  let updatedContent = content;
  
  // Group imports by source
  const importGroups: Record<string, string[]> = {};
  
  // Add types to groups
  types.forEach(type => {
    const source = TYPE_IMPORT_MAP[type as keyof typeof TYPE_IMPORT_MAP];
    if (!importGroups[source]) importGroups[source] = [];
    importGroups[source].push(type);
  });
  
  // Add clients to groups
  clients.forEach(client => {
    const source = CLIENT_IMPORT_MAP[client as keyof typeof CLIENT_IMPORT_MAP];
    if (!importGroups[source]) importGroups[source] = [];
    importGroups[source].push(client);
  });
  
  // Find the best insertion point (after React import or at the top)
  const reactImportMatch = updatedContent.match(/import React.*?\n/);
  let insertionPoint = 0;
  
  if (reactImportMatch) {
    insertionPoint = updatedContent.indexOf(reactImportMatch[0]) + reactImportMatch[0].length;
  }
  
  // Create import statements
  let importsToAdd = '';
  
  Object.entries(importGroups).forEach(([source, items]) => {
    if (source === '@/lib/supabase/_generated/generated-types') {
      importsToAdd += `import type { ${items.join(', ')} } from '${source}';\n`;
    } else {
      importsToAdd += `import { ${items.join(', ')} } from '${source}';\n`;
    }
  });
  
  // Insert the imports
  if (importsToAdd) {
    updatedContent = 
      updatedContent.slice(0, insertionPoint) + 
      importsToAdd + 
      updatedContent.slice(insertionPoint);
  }
  
  return updatedContent;
}

async function fixMissingImports(filePath: string): Promise<{
  success: boolean;
  changes: string[];
}> {
  try {
    let content = await readFile(filePath, 'utf-8');
    const originalContent = content;
    const changes: string[] = [];
    
    // Find missing types and clients
    const missingTypes = findMissingTypes(content);
    const missingClients = findMissingClients(content);
    
    if (missingTypes.length === 0 && missingClients.length === 0) {
      return { success: true, changes: [] };
    }
    
    console.log(`🔧 Fixing imports: ${filePath}`);
    
    if (missingTypes.length > 0) {
      console.log(`  📝 Missing types: ${missingTypes.join(', ')}`);
      changes.push(`Added type imports: ${missingTypes.join(', ')}`);
    }
    
    if (missingClients.length > 0) {
      console.log(`  🔌 Missing clients: ${missingClients.join(', ')}`);
      changes.push(`Added client imports: ${missingClients.join(', ')}`);
    }
    
    // Add the missing imports
    content = addImports(content, missingTypes, missingClients);
    
    // Write the file
    await writeFile(filePath, content);
    console.log(`  ✅ Applied ${changes.length} import fixes`);
    
    return { success: true, changes };
    
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error);
    return { success: false, changes: [] };
  }
}

async function main() {
  console.log('🚀 Fixing missing imports across the entire codebase...');
  
  // Find all TypeScript files
  const dirs = ['app', 'components', 'pages'];
  let allFiles: string[] = [];
  
  for (const dir of dirs) {
    if (existsSync(dir)) {
      const files = await findAllFiles(dir);
      allFiles.push(...files);
    }
  }
  
  console.log(`📁 Scanning ${allFiles.length} files for missing imports...`);
  
  let fixedFiles = 0;
  let totalChanges = 0;
  
  for (const file of allFiles) {
    const result = await fixMissingImports(file);
    
    if (result.changes.length > 0) {
      fixedFiles++;
      totalChanges += result.changes.length;
    }
  }
  
  console.log('\n📊 Summary:');
  console.log(`   Files scanned: ${allFiles.length}`);
  console.log(`   Files fixed: ${fixedFiles}`);
  console.log(`   Total import fixes: ${totalChanges}`);
  
  console.log('\n🎯 Next steps:');
  console.log('1. Run: npm run build');
  console.log('2. All missing import errors should be resolved');
  
  if (fixedFiles === 0) {
    console.log('\n✅ No missing imports found - all files properly imported!');
  }
}

main().catch(console.error);