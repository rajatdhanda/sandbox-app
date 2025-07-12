// schema/migrate-to-generated.mts
import { readdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define migration mappings
const MIGRATION_MAPPINGS = {
  // Old imports to new imports
  imports: {
    "from './generated-types'": "from '@/lib/supabase/_generated/generated-types'",
    "from './types'": "from '@/lib/supabase/_generated/generated-types'", 
    "from '../types'": "from '@/lib/supabase/_generated/generated-types'",
    "from '@/lib/supabase/types'": "from '@/lib/supabase/_generated/generated-types'",
    "from './clients'": "from '@/lib/supabase/_generated/clients'",
    "from '../clients'": "from '@/lib/supabase/_generated/clients'",
    "from '@/lib/supabase/clients'": "from '@/lib/supabase/_generated/clients'",
    "from './queries'": "from '@/lib/supabase/_generated/queries'",
    "from '../queries'": "from '@/lib/supabase/_generated/queries'",
    "from '@/lib/supabase/queries'": "from '@/lib/supabase/_generated/queries'",
  },
  
  // Type name mappings (if needed)
  types: {
    "Database": "Database", // Keep the same
    "User": "Users", // Singular to plural
    "Class": "Classes",
    "Child": "Children",
    "Announcement": "Announcements",
    "Photo": "Photos",
    "CurriculumAssignment": "CurriculumAssignments",
  }
};

async function findTSFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        const subFiles = await findTSFiles(fullPath);
        files.push(...subFiles);
      } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.log(`Skipping directory ${dir}: ${error}`);
  }
  
  return files;
}

async function analyzeFile(filePath: string) {
  try {
    const content = await readFile(filePath, 'utf-8');
    const analysis = {
      file: filePath,
      hasOldImports: false,
      oldImports: [] as string[],
      potentialIssues: [] as string[],
      suggestions: [] as string[]
    };

    // Check for old import patterns
    const importRegex = /import\s+.*?\s+from\s+['"`]([^'"`]+)['"`]/g;
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];
      
      // Check if it's an old import pattern
      if (importPath.includes('/types') || 
          importPath.includes('/clients') || 
          importPath.includes('/queries') ||
          importPath.includes('supabase') && !importPath.includes('_generated')) {
        analysis.hasOldImports = true;
        analysis.oldImports.push(match[0]);
      }
    }

    // Check for type usage that might need updating
    Object.keys(MIGRATION_MAPPINGS.types).forEach(oldType => {
      if (content.includes(oldType) && !content.includes('_generated')) {
        analysis.potentialIssues.push(`Uses type "${oldType}" - might need to update to "${MIGRATION_MAPPINGS.types[oldType]}"`);
      }
    });

    // Check for direct supabase client usage
    if (content.includes('supabase.from(') && !content.includes('_generated')) {
      analysis.potentialIssues.push('Uses direct supabase.from() - consider using generated clients');
    }

    return analysis;
  } catch (error) {
    return {
      file: filePath,
      hasOldImports: false,
      oldImports: [],
      potentialIssues: [`Error reading file: ${error}`],
      suggestions: []
    };
  }
}

async function generateMigrationReport() {
  console.log('🔍 Analyzing codebase for migration opportunities...');
  
  const projectRoot = path.resolve(__dirname, '..');
  const appDir = path.join(projectRoot, 'app');
  const componentsDir = path.join(projectRoot, 'components');
  const libDir = path.join(projectRoot, 'lib');
  const pagesDir = path.join(projectRoot, 'pages');
  
  const allFiles: string[] = [];
  
  // Collect all TypeScript files
  for (const dir of [appDir, componentsDir, libDir, pagesDir]) {
    try {
      const files = await findTSFiles(dir);
      allFiles.push(...files);
    } catch (error) {
      console.log(`Skipping ${dir}: doesn't exist or not accessible`);
    }
  }
  
  console.log(`📁 Found ${allFiles.length} TypeScript files to analyze`);
  
  const analyses = await Promise.all(allFiles.map(analyzeFile));
  const filesToMigrate = analyses.filter(a => a.hasOldImports || a.potentialIssues.length > 0);
  
  // Generate report
  const report = {
    summary: {
      totalFiles: allFiles.length,
      filesToMigrate: filesToMigrate.length,
      migrationNeeded: filesToMigrate.length > 0
    },
    files: filesToMigrate,
    recommendations: [
      "1. Update import paths to use @/lib/supabase/_generated/*",
      "2. Update type names from singular to plural (User -> Users)",
      "3. Replace direct supabase.from() calls with generated clients",
      "4. Test each migrated component thoroughly",
      "5. Use the generated clients for type safety"
    ]
  };
  
  // Write report to file
  const reportPath = path.join(__dirname, 'migration-report.json');
  await writeFile(reportPath, JSON.stringify(report, null, 2));
  
  console.log(`📊 Migration report written to: ${reportPath}`);
  console.log(`🔧 Files needing migration: ${filesToMigrate.length}`);
  
  // Show top issues
  if (filesToMigrate.length > 0) {
    console.log('\n📝 Top files to migrate:');
    filesToMigrate.slice(0, 5).forEach(file => {
      console.log(`   ${file.file}`);
      file.oldImports.forEach(imp => console.log(`     - ${imp}`));
    });
  }
  
  return report;
}

// Run the analysis
generateMigrationReport().catch(console.error);