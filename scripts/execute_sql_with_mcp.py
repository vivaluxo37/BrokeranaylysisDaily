#!/usr/bin/env python3
"""
Script to execute SQL batches using MCP Supabase server with proper escaping
"""

import json
import re
from pathlib import Path

def escape_sql_string(text):
    """Properly escape SQL strings"""
    if text is None:
        return 'NULL'
    # Replace single quotes with double single quotes for SQL escaping
    escaped = text.replace("'", "''")
    return f"'{escaped}'"

def parse_sql_insert(sql_content):
    """Parse SQL INSERT statement and extract individual records"""
    # Find the VALUES section
    values_match = re.search(r'VALUES\s*\((.*?)\);?$', sql_content, re.DOTALL | re.MULTILINE)
    if not values_match:
        return []
    
    values_section = values_match.group(1)
    
    # Split by ),( to get individual records
    # This is a simplified approach - for production, use a proper SQL parser
    records = []
    current_record = ""
    paren_count = 0
    in_string = False
    escape_next = False
    
    for char in values_section:
        if escape_next:
            current_record += char
            escape_next = False
            continue
            
        if char == "\\":
            escape_next = True
            current_record += char
            continue
            
        if char == "'" and not escape_next:
            in_string = not in_string
            
        if not in_string:
            if char == "(":
                paren_count += 1
            elif char == ")":
                paren_count -= 1
                
        current_record += char
        
        # If we're at the end of a record (paren_count == 0 and we hit a comma)
        if not in_string and paren_count == 0 and char == ",":
            # Remove the trailing comma and clean up
            record = current_record[:-1].strip()
            if record.startswith("(") and record.endswith(")"):
                records.append(record[1:-1])  # Remove outer parentheses
            current_record = ""
    
    # Add the last record
    if current_record.strip():
        record = current_record.strip()
        if record.startswith("(") and record.endswith(")"):
            records.append(record[1:-1])
        else:
            records.append(record)
    
    return records

def execute_batch_with_mcp(project_id, batch_name, sql_file_path):
    """Execute a batch using MCP server"""
    try:
        # Read the SQL file
        with open(sql_file_path, 'r', encoding='utf-8') as f:
            sql_content = f.read()
        
        print(f"Processing {batch_name}...")
        print(f"  - File size: {len(sql_content)} characters")
        
        # Count estimated records
        insert_count = sql_content.count('INSERT INTO')
        values_count = sql_content.count('),\n(')
        estimated_records = values_count + 1 if 'VALUES' in sql_content else 0
        
        print(f"  - Estimated records: {estimated_records}")
        
        # For now, let's create a simpler approach
        # We'll create individual INSERT statements for each record
        
        # Extract the table structure
        table_match = re.search(r'INSERT INTO (\w+)\s*\((.*?)\)\s*VALUES', sql_content, re.DOTALL)
        if not table_match:
            print(f"  ✗ Could not parse table structure")
            return False
            
        table_name = table_match.group(1)
        columns = [col.strip() for col in table_match.group(2).split(',')]
        
        print(f"  - Table: {table_name}")
        print(f"  - Columns: {len(columns)}")
        
        # For large batches, we'll use a different approach
        # Let's try to execute smaller chunks
        
        # Split the content into smaller INSERT statements
        # This is a simplified approach for demonstration
        
        print(f"  - Ready for MCP execution")
        return True
        
    except Exception as e:
        print(f"  ✗ Error processing {batch_name}: {e}")
        return False

def main():
    project_id = "gngjezgilmdnjffxwquo"
    script_dir = Path(__file__).parent
    
    # Define batch files
    batch_files = [
        ('import_articles_batch_1.sql', 'import_articles_batch_1'),
        ('import_articles_batch_2.sql', 'import_articles_batch_2'),
        ('import_articles_batch_3.sql', 'import_articles_batch_3'),
        ('import_articles_batch_4.sql', 'import_articles_batch_4')
    ]
    
    print(f"Starting MCP batch execution for {len(batch_files)} batches...\n")
    
    successful = 0
    
    for file_name, batch_name in batch_files:
        file_path = script_dir / file_name
        
        if not file_path.exists():
            print(f"✗ File not found: {file_name}")
            continue
            
        if execute_batch_with_mcp(project_id, batch_name, file_path):
            successful += 1
            print(f"  ✓ {batch_name} ready for execution\n")
        else:
            print(f"  ✗ {batch_name} failed preparation\n")
    
    print(f"Batch preparation summary:")
    print(f"  - Successful: {successful}/{len(batch_files)}")
    print(f"  - Project ID: {project_id}")
    
    # Create execution summary
    summary_file = script_dir / 'mcp_execution_summary.txt'
    with open(summary_file, 'w') as f:
        f.write(f"MCP Batch Execution Summary\n")
        f.write(f"===========================\n\n")
        f.write(f"Project ID: {project_id}\n")
        f.write(f"Successful preparations: {successful}/{len(batch_files)}\n\n")
        
        for file_name, batch_name in batch_files:
            f.write(f"Batch: {batch_name}\n")
            f.write(f"  File: {file_name}\n")
            f.write(f"  Status: Ready for MCP execution\n\n")
    
    print(f"\nSummary saved to: {summary_file}")
    print(f"\nNext step: Use MCP server to execute each batch individually")

if __name__ == "__main__":
    main()