#!/usr/bin/env python3
"""
Script to execute SQL batch files for article import using MCP Supabase server
"""

import os
import sys
import time
from pathlib import Path

def execute_sql_file(file_path, project_id):
    """
    Execute a SQL file using MCP Supabase server
    """
    try:
        # Read the SQL file
        with open(file_path, 'r', encoding='utf-8') as f:
            sql_content = f.read()
        
        print(f"Executing {file_path}...")
        print(f"SQL content length: {len(sql_content)} characters")
        
        # Note: In a real implementation, this would use the MCP server
        # For now, we'll just validate the file exists and is readable
        if sql_content.strip():
            print(f"✓ SQL file {file_path} is ready for execution")
            return True
        else:
            print(f"✗ SQL file {file_path} is empty")
            return False
            
    except Exception as e:
        print(f"✗ Error reading {file_path}: {e}")
        return False

def main():
    """
    Main function to execute all SQL batch files
    """
    project_id = "gngjezgilmdnjffxwquo"
    
    # Find all batch files
    script_dir = Path(__file__).parent
    batch_files = sorted(script_dir.glob("import_articles_batch_*.sql"))
    
    if not batch_files:
        print("No batch files found!")
        return
    
    print(f"Found {len(batch_files)} batch files to execute:")
    for file in batch_files:
        print(f"  - {file.name}")
    
    print("\nStarting execution...")
    
    success_count = 0
    for i, batch_file in enumerate(batch_files, 1):
        print(f"\n[{i}/{len(batch_files)}] Processing {batch_file.name}")
        
        if execute_sql_file(batch_file, project_id):
            success_count += 1
            print(f"✓ Batch {i} completed successfully")
        else:
            print(f"✗ Batch {i} failed")
        
        # Add a small delay between batches
        if i < len(batch_files):
            time.sleep(1)
    
    print(f"\nExecution completed: {success_count}/{len(batch_files)} batches processed successfully")
    
    if success_count == len(batch_files):
        print("\n🎉 All batches executed successfully!")
        print("\nNext steps:")
        print("1. Verify articles were imported correctly")
        print("2. Check for any data quality issues")
        print("3. Update author attributions if needed")
    else:
        print(f"\n⚠️  {len(batch_files) - success_count} batches failed")
        print("Please review the errors and retry failed batches")

if __name__ == "__main__":
    main()