#!/usr/bin/env python3
"""
Script to apply article migration batches using MCP Supabase server
"""

import json
import subprocess
import sys
from pathlib import Path

def read_sql_file(file_path):
    """Read SQL file content"""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read().strip()
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return None

def apply_migration_via_mcp(project_id, migration_name, sql_content):
    """Apply migration using MCP server via subprocess"""
    try:
        # Prepare the MCP command
        mcp_command = [
            'python', '-c', f'''
import json
import sys

# Mock MCP call - in real scenario this would use the actual MCP client
print(json.dumps({{
    "server_name": "mcp.config.usrlocalmcp.supabase",
    "tool_name": "apply_migration",
    "args": {{
        "project_id": "{project_id}",
        "name": "{migration_name}",
        "query": {json.dumps(sql_content)}
    }}
}}))
'''
        ]
        
        result = subprocess.run(mcp_command, capture_output=True, text=True)
        
        if result.returncode == 0:
            print(f"✓ Successfully applied migration: {migration_name}")
            return True
        else:
            print(f"✗ Failed to apply migration {migration_name}: {result.stderr}")
            return False
            
    except Exception as e:
        print(f"✗ Error applying migration {migration_name}: {e}")
        return False

def main():
    project_id = "gngjezgilmdnjffxwquo"
    script_dir = Path(__file__).parent
    
    # Define batch files in order
    batch_files = [
        ('import_articles_batch_1.sql', 'import_articles_batch_1'),
        ('import_articles_batch_2.sql', 'import_articles_batch_2'),
        ('import_articles_batch_3.sql', 'import_articles_batch_3'),
        ('import_articles_batch_4.sql', 'import_articles_batch_4')
    ]
    
    successful_migrations = 0
    total_migrations = len(batch_files)
    
    print(f"Starting migration of {total_migrations} batches...\n")
    
    for file_name, migration_name in batch_files:
        file_path = script_dir / file_name
        
        if not file_path.exists():
            print(f"✗ File not found: {file_name}")
            continue
            
        print(f"Processing {file_name}...")
        
        # Read SQL content
        sql_content = read_sql_file(file_path)
        if not sql_content:
            print(f"✗ Failed to read {file_name}")
            continue
            
        print(f"  - Read {len(sql_content)} characters")
        
        # For now, just print the migration info since we can't directly call MCP
        print(f"  - Would apply migration: {migration_name}")
        print(f"  - Project ID: {project_id}")
        print(f"  - SQL length: {len(sql_content)} characters")
        
        # Count INSERT statements
        insert_count = sql_content.count('INSERT INTO')
        values_count = sql_content.count('),\n(')
        estimated_records = values_count + 1 if 'VALUES' in sql_content else 0
        
        print(f"  - Estimated records: {estimated_records}")
        print(f"  ✓ Ready for migration\n")
        
        successful_migrations += 1
    
    print(f"\nMigration preparation complete:")
    print(f"  - Processed: {successful_migrations}/{total_migrations} batches")
    print(f"  - All batches are ready for MCP migration")
    
    # Generate summary
    summary_file = script_dir / 'migration_summary.txt'
    with open(summary_file, 'w') as f:
        f.write(f"Article Migration Summary\n")
        f.write(f"========================\n\n")
        f.write(f"Total batches processed: {successful_migrations}/{total_migrations}\n")
        f.write(f"Project ID: {project_id}\n\n")
        
        for file_name, migration_name in batch_files:
            file_path = script_dir / file_name
            if file_path.exists():
                sql_content = read_sql_file(file_path)
                if sql_content:
                    values_count = sql_content.count('),\n(')
                    estimated_records = values_count + 1 if 'VALUES' in sql_content else 0
                    f.write(f"Batch: {migration_name}\n")
                    f.write(f"  File: {file_name}\n")
                    f.write(f"  Size: {len(sql_content)} characters\n")
                    f.write(f"  Estimated records: {estimated_records}\n\n")
    
    print(f"Summary saved to: {summary_file}")

if __name__ == "__main__":
    main()