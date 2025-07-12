// schema/generators/generate-types-from-edits.mts (Dynamic Version)
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const editsPath = path.resolve(__dirname, '../schema-edits.json');
const outputPath = path.resolve(__dirname, '../../lib/supabase/_generated/generated-types.ts');

const sqlToTsType = (sqlType: string): string => {
  const map: Record<string, string> = {
    uuid: 'string',
    text: 'string',
    varchar: 'string',
    bool: 'boolean',
    boolean: 'boolean',
    int: 'number',
    integer: 'number',
    bigint: 'number',
    json: 'any',
    jsonb: 'any',
    timestamp: 'string',
    'timestamp with time zone': 'string',
    date: 'string',
    float: 'number',
    double: 'number',
  };
  return map[sqlType] || 'any';
};

function toPascalCase(str: string): string {
  return str
    .replace(/_/g, ' ')
    .replace(/\w\S*/g, (txt) => txt[0].toUpperCase() + txt.substring(1))
    .replace(/\s+/g, '');
}

async function generateTypes() {
  try {
    console.log(`📥 Reading schema edits from: ${editsPath}`);
    const data = await readFile(editsPath, 'utf-8');
    const tables = JSON.parse(data);

    let output = `// AUTO-GENERATED FILE — DO NOT EDIT
// This file is generated from schema-edits.json with dynamic relationships
// Run schema/generators/generate-types-from-edits.mts to regenerate

`;

    // Step 1: Generate base types for each table
    console.log('🏗️ Generating base types...');
    for (const table of tables) {
      if (!table.name || !Array.isArray(table.columns)) {
        console.warn(`⚠️ Skipping table without columns:`, table.name);
        continue;
      }

      const typeName = toPascalCase(table.name);
      output += `// Base type for ${table.name}
export interface ${typeName} {
`;

      for (const column of table.columns) {
        if (column.delete) continue;
        
        const colData = column.new || column.old;
        if (!colData?.name || !colData?.type) continue;
        
        const isOptional = colData.nullable === 'YES' || colData.nullable === true;
        const optionalMarker = isOptional ? '?' : '';
        
        output += `  ${colData.name}${optionalMarker}: ${sqlToTsType(colData.type)};
`;
      }

      output += `}

`;
    }

    // Step 2: Generate relationship types dynamically
    console.log('🔗 Generating relationship types...');
    output += `// Types with dynamic relationships
`;

    const relationshipMap: Record<string, any> = {};

    for (const table of tables) {
      if (!table.name || !table.relations) continue;

      const typeName = toPascalCase(table.name);
      const relations = table.relations;
      const activeRelations: any[] = [];

      // Process each relationship
      for (const [relName, relData] of Object.entries(relations)) {
        if ((relData as any).delete) continue;
        
        const rel = (relData as any).new || (relData as any).old;
        if (!rel) continue;

        activeRelations.push({ name: relName, ...rel });
      }

      if (activeRelations.length > 0) {
        relationshipMap[table.name] = activeRelations;
        
        output += `export interface ${typeName}WithRelations extends ${typeName} {
`;

        for (const rel of activeRelations) {
          const foreignTypeName = toPascalCase(rel.foreign_table);
          
          if (rel.type === 'belongs_to') {
            output += `  ${rel.name}?: ${foreignTypeName};
`;
          } else if (rel.type === 'has_many') {
            output += `  ${rel.name}?: ${foreignTypeName}[];
`;
          } else if (rel.type === 'many_to_many') {
            output += `  ${rel.name}?: ${foreignTypeName}[];
`;
          }
        }

        output += `}

`;
      }
    }

    // Step 3: Generate query helper constants
    output += `// Query helpers for relationships
export const QueryWithRelations = {
`;

    for (const [tableName, relations] of Object.entries(relationshipMap)) {
      const selectParts = ['*'];
      
      for (const rel of relations) {
        if (rel.type === 'belongs_to') {
          selectParts.push(`${rel.name}:${rel.foreign_table}(*)`);
        } else if (rel.type === 'has_many') {
          selectParts.push(`${rel.name}:${rel.foreign_table}(*)`);
        } else if (rel.type === 'many_to_many' && rel.junction_table) {
          selectParts.push(`${rel.name}:${rel.junction_table}(${rel.foreign_table}(*))`);
        }
      }
      
      output += `  ${tableName}: \`${selectParts.join(', ')}\`,
`;
    }

    output += `} as const;

`;

    // Step 4: Generate relationship query functions
    output += `// Dynamic relationship query builder
export function buildRelationQuery(tableName: string, includeRelations: string[] = []): string {
  const baseQuery = '*';
  const allRelations = QueryWithRelations[tableName as keyof typeof QueryWithRelations];
  
  if (!allRelations || includeRelations.length === 0) {
    return baseQuery;
  }
  
  return allRelations;
}

// Helper type for selecting with relations
export type TableWithRelations<T extends keyof typeof QueryWithRelations> = 
  T extends 'users' ? UsersWithRelations :
  T extends 'children' ? ChildrenWithRelations :
  T extends 'classes' ? ClassesWithRelations :
  T extends 'announcements' ? AnnouncementsWithRelations :
  T extends 'notifications' ? NotificationsWithRelations :
  any; // Fallback for other tables

`;

    await writeFile(outputPath, output, 'utf-8');
    console.log(`✅ Dynamic types written to: ${outputPath}`);
    console.log(`📊 Generated types for ${tables.length} tables`);
    console.log(`🔗 Generated relationships for ${Object.keys(relationshipMap).length} tables`);
  } catch (err) {
    console.error('❌ Failed to generate dynamic types:', err instanceof Error ? err.message : err);
  }
}

generateTypes();