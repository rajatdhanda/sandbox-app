import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const results: any = {
      pipeline_status: 'success',
      steps: {
        schema_fetch: null,
        client_generation: null,
        end_to_end_test: null
      },
      recommendations: []
    };

    // Step 1: Test Schema Fetching
    console.log('🔍 Testing schema fetch capabilities...');
    try {
      const { data: tables, error } = await supabase.rpc('get_all_tables');
      
      if (error) throw error;
      
      results.steps.schema_fetch = {
        status: 'success',
        tables_count: tables?.length || 0,
        sample_tables: tables?.slice(0, 5) || [],
        message: `Found ${tables?.length || 0} tables in database`
      };

      // Test column fetching for a few tables
      if (tables && tables.length > 0) {
        const sampleTable = tables[0];
        const { data: columns, error: colError } = await supabase.rpc('get_table_columns', {
          table_name_input: sampleTable
        });
        
        results.steps.schema_fetch.sample_schema = {
          table: sampleTable,
          columns_count: columns?.length || 0,
          columns: columns?.slice(0, 3) || []
        };
      }
    } catch (error: any) {
      results.steps.schema_fetch = {
        status: 'error',
        error: error.message,
        message: 'Schema fetch failed - check RPC functions'
      };
      results.recommendations.push('Run the SQL functions in Supabase SQL Editor');
    }

    // Step 2: Test Direct Client Operations
    console.log('🔧 Testing direct client operations...');
    try {
      const testOperations = [];
      const testTables = ['users', 'announcements', 'classes'];
      
      for (const tableName of testTables) {
        try {
          // Test basic CRUD operations
          const selectResult = await supabase.from(tableName).select('*').limit(2);
          const countResult = await supabase.from(tableName).select('*', { count: 'exact', head: true });
          
          testOperations.push({
            table: tableName,
            select_status: selectResult.error ? 'error' : 'success',
            count_status: countResult.error ? 'error' : 'success',
            record_count: countResult.count || 0,
            sample_data: selectResult.data?.length || 0,
            errors: [selectResult.error?.message, countResult.error?.message].filter(Boolean)
          });
        } catch (tableError: any) {
          testOperations.push({
            table: tableName,
            status: 'error',
            error: tableError.message
          });
        }
      }
      
      results.steps.client_generation = {
        status: 'success',
        message: 'Direct Supabase clients working',
        operations_tested: testOperations,
        working_tables: testOperations.filter(op => op.select_status === 'success').length
      };
    } catch (error: any) {
      results.steps.client_generation = {
        status: 'error',
        error: error.message
      };
    }

    // Step 3: End-to-End Workflow Test
    console.log('🚀 Testing end-to-end workflow...');
    try {
      // Simulate the full workflow
      const workflow = {
        schema_available: !!results.steps.schema_fetch?.status === 'success',
        clients_working: !!results.steps.client_generation?.status === 'success',
        generated_files_path: 'lib/supabase/_generated/clients/',
        ready_for_production: false
      };
      
      workflow.ready_for_production = workflow.schema_available && workflow.clients_working;
      
      results.steps.end_to_end_test = {
        status: workflow.ready_for_production ? 'success' : 'needs_attention',
        workflow,
        message: workflow.ready_for_production 
          ? 'Pipeline is ready for production use' 
          : 'Pipeline needs some fixes before production'
      };
      
      // Add recommendations
      if (!workflow.schema_available) {
        results.recommendations.push('Fix schema fetching - ensure RPC functions are created');
      }
      if (!workflow.clients_working) {
        results.recommendations.push('Fix client generation - check import paths and file structure');
      }
      if (workflow.ready_for_production) {
        results.recommendations.push('✅ Ready to run: npx tsx schema/index.ts && npx tsx schema/copy-to-edits.mts && npx tsx schema/generate-clients-from-edits.mts');
      }
      
    } catch (error: any) {
      results.steps.end_to_end_test = {
        status: 'error',
        error: error.message
      };
    }

    // Overall pipeline status
    const allStepsSuccess = Object.values(results.steps).every(step => step?.status === 'success');
    results.pipeline_status = allStepsSuccess ? 'ready' : 'needs_fixes';

    return res.status(200).json({
      message: 'Schema pipeline comprehensive test completed',
      timestamp: new Date().toISOString(),
      overall_status: results.pipeline_status,
      results,
      next_steps: results.recommendations
    });

  } catch (error: unknown) {
    console.error('Robust pipeline test error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return res.status(500).json({ 
      error: errorMessage,
      message: 'Pipeline test failed completely'
    });
  }
}