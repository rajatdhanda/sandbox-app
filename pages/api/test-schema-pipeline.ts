import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const results: any = {
      step1_fetch_schema: null,
      step2_generated_clients: [],
      step3_test_clients: [],
      errors: []
    };

    // Step 1: Test fetching schema
    try {
      console.log('Testing schema fetch...');
      const { data: tables, error } = await supabase.rpc('get_all_tables');
      
      if (error) throw error;
      
      results.step1_fetch_schema = {
        success: true,
        tables_found: tables?.length || 0,
        tables: tables || []
      };
      
      // Test getting columns for first table
      if (tables && tables.length > 0) {
        const { data: columns, error: colError } = await supabase.rpc('get_table_columns', {
          table_name_input: tables[0]
        });
        
        results.step1_fetch_schema.sample_columns = {
          table: tables[0],
          columns: columns || [],
          error: colError?.message
        };
      }
    } catch (error: any) {
      results.errors.push(`Schema fetch failed: ${error.message}`);
      results.step1_fetch_schema = { success: false, error: error.message };
    }

    // Step 2: Test existing generated clients
    try {
      console.log('Testing generated clients...');
      const clientsDir = path.resolve(process.cwd(), 'lib/supabase/_generated/clients');
      
      try {
        const files = await fs.readdir(clientsDir);
        const tsFiles = files.filter(f => f.endsWith('.ts'));
        
        for (const file of tsFiles.slice(0, 3)) { // Test first 3 clients
          try {
            const tableName = file.replace('.ts', '');
            const clientModule = await import(`../../../lib/supabase/_generated/clients/${tableName}`);
            
            // Test if client can be created
            const client = clientModule[`${tableName}Client`]?.();
            if (client) {
              results.step2_generated_clients.push({
                table: tableName,
                status: 'success',
                has_client: true
              });
            } else {
              results.step2_generated_clients.push({
                table: tableName,
                status: 'warning',
                has_client: false,
                message: 'Client function not found'
              });
            }
          } catch (importError: any) {
            results.step2_generated_clients.push({
              table: file,
              status: 'error',
              error: importError.message
            });
          }
        }
      } catch (dirError: any) {
        results.errors.push(`Clients directory not found: ${dirError.message}`);
      }
    } catch (error: any) {
      results.errors.push(`Generated clients test failed: ${error.message}`);
    }

    // Step 3: Test actual database operations with working clients
    try {
      console.log('Testing database operations...');
      
      // Test with a direct client approach
      const testTables = ['users', 'announcements']; // Common tables
      
      for (const tableName of testTables) {
        try {
          const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .limit(1);
            
          results.step3_test_clients.push({
            table: tableName,
            status: error ? 'error' : 'success',
            data_count: data?.length || 0,
            error: error?.message
          });
        } catch (tableError: any) {
          results.step3_test_clients.push({
            table: tableName,
            status: 'error',
            error: tableError.message
          });
        }
      }
    } catch (error: any) {
      results.errors.push(`Database operations test failed: ${error.message}`);
    }

    return res.status(200).json({
      message: 'Schema pipeline test completed',
      timestamp: new Date().toISOString(),
      results,
      summary: {
        schema_fetch_working: results.step1_fetch_schema?.success || false,
        generated_clients_count: results.step2_generated_clients.length,
        database_operations_working: results.step3_test_clients.filter(t => t.status === 'success').length,
        total_errors: results.errors.length
      }
    });

  } catch (error: unknown) {
    console.error('Pipeline test error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return res.status(500).json({ error: errorMessage });
  }
}