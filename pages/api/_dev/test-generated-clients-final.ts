import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const results: any = {
      tested_clients: [],
      successful: 0,
      failed: 0,
      debug_info: {}
    };

    // Test some common tables
    const tablesToTest = ['users', 'announcements', 'classes'];

    for (const tableName of tablesToTest) {
      try {
        // Use absolute path for import
        const clientPath = path.resolve(process.cwd(), 'lib', 'supabase', '_generated', 'clients', `${tableName}.ts`);
        results.debug_info[tableName] = { attempted_path: clientPath };
        
        // Try different import approaches
        let clientModule;
        try {
          // Try relative import first
          clientModule = await import(`../../../lib/supabase/_generated/clients/${tableName}`);
        } catch (relativeError) {
          try {
            // Try absolute import
            clientModule = await import(`/lib/supabase/_generated/clients/${tableName}`);
          } catch (absoluteError) {
            throw new Error(`Both relative and absolute imports failed: ${relativeError.message}`);
          }
        }
        
        // Test the client
        if (clientModule[`${tableName}Client`]) {
          const client = clientModule[`${tableName}Client`]();
          const { data, error } = await client.select('*').limit(1);
          
          results.tested_clients.push({
            table: tableName,
            status: error ? 'error' : 'success',
            data_count: data?.length || 0,
            error: error?.message,
            client_exists: true,
            exported_functions: Object.keys(clientModule).filter(key => typeof clientModule[key] === 'function')
          });
          
          if (!error) results.successful++;
          else results.failed++;
        } else {
          results.tested_clients.push({
            table: tableName,
            status: 'error',
            error: 'Client function not found',
            client_exists: false,
            available_exports: Object.keys(clientModule)
          });
          results.failed++;
        }
      } catch (importError: any) {
        results.tested_clients.push({
          table: tableName,
          status: 'error',
          error: `Import failed: ${importError.message}`,
          client_exists: false
        });
        results.failed++;
      }
    }

    // Also test direct client creation (bypassing imports)
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const directClient = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        }
      );

      const { data, error } = await directClient.from('announcements').select('*').limit(1);
      
      results.direct_test = {
        status: error ? 'error' : 'success',
        data_count: data?.length || 0,
        error: error?.message,
        message: 'Direct client creation test'
      };
    } catch (directError: any) {
      results.direct_test = {
        status: 'error',
        error: directError.message
      };
    }

    return res.status(200).json({
      message: 'Generated clients test completed',
      timestamp: new Date().toISOString(),
      summary: {
        total_tested: tablesToTest.length,
        successful: results.successful,
        failed: results.failed,
        success_rate: `${Math.round((results.successful / tablesToTest.length) * 100)}%`,
        direct_client_working: results.direct_test?.status === 'success'
      },
      results
    });

  } catch (error: unknown) {
    console.error('Generated clients test error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return res.status(500).json({ error: errorMessage });
  }
}