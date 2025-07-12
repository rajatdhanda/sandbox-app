// schema/generators/detect-relationships.mts (Fixed)
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

// Load environment variables
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface RelationshipMap {
  [tableName: string]: {
    [relationshipName: string]: {
      type: 'belongs_to' | 'has_many' | 'many_to_many';
      foreign_table: string;
      foreign_key: string;
      local_key?: string;
      junction_table?: string;
    };
  };
}

async function detectRelationshipsByNaming(): Promise<RelationshipMap> {
  console.log('🔍 Detecting relationships by naming conventions...');
  
  const schemaPath = path.resolve(__dirname, '../schema-edits.json');
  const schemaData = await readFile(schemaPath, 'utf-8');
  const tables = JSON.parse(schemaData);
  
  const relationships: RelationshipMap = {};
  
  console.log(`📊 Analyzing ${tables.length} tables for relationships...`);
  
  for (const table of tables) {
    const tableName = table.name;
    relationships[tableName] = {};
    
    if (!table.columns) continue;
    
    console.log(`🔍 Analyzing table: ${tableName}`);
    
    for (const column of table.columns) {
      const colData = column.new || column.old;
      if (!colData?.name || !colData?.type) continue;
      
      const columnName = colData.name;
      
      // Detect foreign key patterns
      if (columnName.endsWith('_id') && (colData.type === 'uuid' || colData.type === 'text')) {
        const foreignTableSingular = columnName.replace('_id', '');
        const foreignTablePlural = pluralize(foreignTableSingular);
        
        // Check if the foreign table exists
        const foreignTable = tables.find((t: any) => 
          t.name === foreignTablePlural || 
          t.name === foreignTableSingular ||
          t.name === foreignTableSingular + 's'
        );
        
        if (foreignTable) {
          console.log(`  ✅ Found belongs_to: ${tableName}.${columnName} → ${foreignTable.name}`);
          
          const relationshipName = foreignTableSingular;
          relationships[tableName][relationshipName] = {
            type: 'belongs_to',
            foreign_table: foreignTable.name,
            foreign_key: columnName,
            local_key: 'id'
          };
          
          // Add reverse relationship (has_many)
          if (!relationships[foreignTable.name]) {
            relationships[foreignTable.name] = {};
          }
          
          const reverseRelationshipName = getHasManyName(tableName);
          relationships[foreignTable.name][reverseRelationshipName] = {
            type: 'has_many',
            foreign_table: tableName,
            foreign_key: columnName,
            local_key: 'id'
          };
          
          console.log(`  ✅ Found has_many: ${foreignTable.name}.${reverseRelationshipName} ← ${tableName}`);
        }
      }
    }
    
    // Detect many-to-many relationships (junction tables)
    if (tableName.includes('_')) {
      const parts = tableName.split('_');
      
      // Handle patterns like: parent_child_relationships, class_assignments, etc.
      if (parts.length >= 2) {
        // Try to find the two main entity tables
        const possibleTable1Names = [parts[0], pluralize(parts[0])];
        const possibleTable2Names = [parts[1], pluralize(parts[1])];
        
        const table1 = tables.find((t: any) => possibleTable1Names.includes(t.name));
        const table2 = tables.find((t: any) => possibleTable2Names.includes(t.name));
        
        if (table1 && table2 && table1.name !== table2.name) {
          console.log(`  ✅ Found junction table: ${tableName} (${table1.name} ↔ ${table2.name})`);
          
          // Add many-to-many relationships
          if (!relationships[table1.name]) relationships[table1.name] = {};
          if (!relationships[table2.name]) relationships[table2.name] = {};
          
          const table1Key = parts[0] + '_id';
          const table2Key = parts[1] + '_id';
          
          relationships[table1.name][pluralize(parts[1])] = {
            type: 'many_to_many',
            foreign_table: table2.name,
            foreign_key: table2Key,
            local_key: 'id',
            junction_table: tableName
          };
          
          relationships[table2.name][pluralize(parts[0])] = {
            type: 'many_to_many',
            foreign_table: table1.name,
            foreign_key: table1Key,
            local_key: 'id',
            junction_table: tableName
          };
        }
      }
    }
  }
  
  const totalRelationships = Object.values(relationships)
    .reduce((sum, tableRels) => sum + Object.keys(tableRels).length, 0);
  
  console.log(`📊 Detected ${totalRelationships} relationships across ${Object.keys(relationships).filter(t => Object.keys(relationships[t]).length > 0).length} tables`);
  
  return relationships;
}

function pluralize(word: string): string {
  // Enhanced pluralization rules
  const pluralRules: Record<string, string> = {
    'child': 'children',
    'person': 'people',
    'user': 'users',
    'class': 'classes',
    'photo': 'photos',
    'curriculum': 'curriculum',
    'parent': 'parents',
    'student': 'students',
    'teacher': 'teachers',
    'admin': 'admins',
  };
  
  if (pluralRules[word]) return pluralRules[word];
  if (word.endsWith('y')) return word.slice(0, -1) + 'ies';
  if (word.endsWith('s') || word.endsWith('x') || word.endsWith('z')) return word + 'es';
  if (word.endsWith('child')) return word.replace('child', 'children');
  return word + 's';
}

function getHasManyName(tableName: string): string {
  // Convert table name to appropriate has_many relationship name
  if (tableName.endsWith('ies')) return tableName;
  if (tableName.endsWith('s')) return tableName;
  return pluralize(tableName);
}

function toPascalCase(str: string): string {
  return str
    .replace(/_/g, ' ')
    .replace(/\w\S*/g, (txt) => txt[0].toUpperCase() + txt.substring(1))
    .replace(/\s+/g, '');
}

async function saveRelationshipsToSchema(relationships: RelationshipMap) {
  console.log('💾 Saving detected relationships to schema...');
  
  const schemaPath = path.resolve(__dirname, '../schema-edits.json');
  const schemaData = await readFile(schemaPath, 'utf-8');
  const tables = JSON.parse(schemaData);
  
  let updatedTables = 0;
  
  // Update each table with detected relationships
  for (const table of tables) {
    const tableName = table.name;
    if (relationships[tableName] && Object.keys(relationships[tableName]).length > 0) {
      table.relations = table.relations || {};
      
      for (const [relName, relData] of Object.entries(relationships[tableName])) {
        table.relations[relName] = {
          old: table.relations[relName]?.old || null,
          new: relData,
          delete: false
        };
      }
      
      updatedTables++;
      console.log(`  ✅ Updated ${tableName} with ${Object.keys(relationships[tableName]).length} relationships`);
    }
  }
  
  await writeFile(schemaPath, JSON.stringify(tables, null, 2));
  console.log(`✅ Updated ${updatedTables} tables with detected relationships`);
}

async function main() {
  try {
    console.log('🚀 Starting relationship detection (naming-based approach)...');
    
    // Step 1: Detect relationships by naming conventions
    const relationships = await detectRelationshipsByNaming();
    
    const tablesWithRelationships = Object.keys(relationships).filter(
      table => Object.keys(relationships[table]).length > 0
    );
    
    console.log(`📊 Summary:`);
    console.log(`  - Tables analyzed: ${Object.keys(relationships).length}`);
    console.log(`  - Tables with relationships: ${tablesWithRelationships.length}`);
    console.log(`  - Total relationships: ${Object.values(relationships).reduce((sum, rels) => sum + Object.keys(rels).length, 0)}`);
    
    if (tablesWithRelationships.length > 0) {
      // Step 2: Save relationships to schema
      await saveRelationshipsToSchema(relationships);
      console.log('✅ Relationship detection complete!');
    } else {
      console.log('⚠️ No relationships detected. Check your table naming conventions.');
      console.log('Expected patterns: user_id → users table, class_id → classes table, etc.');
    }
    
  } catch (error) {
    console.error('❌ Relationship detection failed:', error);
    process.exit(1);
  }
}

main();