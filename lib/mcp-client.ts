/**
 * MCP Client for server-side operations
 * This module provides utilities to interact with MCP servers from API routes
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Execute an MCP server tool call
 * @param serverName - The name of the MCP server
 * @param toolName - The name of the tool to execute
 * @param args - Arguments for the tool
 * @returns Promise with the tool result
 */
export async function run_mcp(serverName: string, toolName: string, args: any): Promise<any> {
  try {
    // For now, we'll use a direct approach since we're in a Next.js API route
    // In a real implementation, you'd want to use the actual MCP protocol
    
    if (serverName === 'mcp.config.usrlocalmcp.supabase') {
      if (toolName === 'execute_sql') {
        // Direct Supabase SQL execution using the project's Supabase client
        const { createClient } = require('@supabase/supabase-js');
        
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseAnonKey) {
          throw new Error('Missing Supabase configuration');
        }
        
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        
        // Execute the SQL query
        const { data, error } = await supabase.rpc('execute_sql', {
          sql_query: args.query
        });
        
        if (error) {
          throw new Error(`SQL execution error: ${error.message}`);
        }
        
        return data;
      }
    }
    
    throw new Error(`Unsupported MCP server or tool: ${serverName}/${toolName}`);
  } catch (error) {
    console.error('MCP client error:', error);
    throw error;
  }
}

/**
 * Alternative implementation using direct database queries
 * This bypasses MCP and uses Supabase directly for better reliability
 */
export async function executeSupabaseQuery(query: string): Promise<any> {
  try {
    const { createClient } = require('@supabase/supabase-js');
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase configuration');
    }
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // For SELECT queries, use the from() method
    if (query.trim().toUpperCase().startsWith('SELECT')) {
      const tableName = extractTableName(query);
      const { data, error } = await supabase.from(tableName).select('*');
      
      if (error) {
        throw new Error(`Query error: ${error.message}`);
      }
      
      return data;
    }
    
    // For other queries, we'll need to use RPC or direct SQL execution
    // This requires a custom function in Supabase
    const { data, error } = await supabase.rpc('execute_sql', {
      sql_query: query
    });
    
    if (error) {
      throw new Error(`SQL execution error: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Supabase query error:', error);
    throw error;
  }
}

/**
 * Extract table name from a SELECT query
 */
function extractTableName(query: string): string {
  const match = query.match(/FROM\s+(\w+)/i);
  return match ? match[1] : 'brokers'; // Default to brokers table
}