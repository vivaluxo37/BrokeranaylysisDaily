#!/usr/bin/env python3
"""
Script to execute remaining articles (11-191) using MCP server
"""

import os
import json
import time
from pathlib import Path

def read_sql_file(file_path):
    """Read SQL content from file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read().strip()
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return None

def extract_values_from_sql(sql_content):
    """Extract VALUES part from INSERT statement"""
    try:
        # Find the VALUES clause
        values_start = sql_content.find('VALUES')
        if values_start == -1:
            return None
        
        # Extract everything after VALUES
        values_part = sql_content[values_start + 6:].strip()
        
        # Remove trailing semicolon if present
        if values_part.endswith(';'):
            values_part = values_part[:-1]
        
        return values_part
    except Exception as e:
        print(f"Error extracting VALUES: {e}")
        return None

def create_insert_statement(values_part):
    """Create complete INSERT statement"""
    insert_prefix = """INSERT INTO news_articles (
    title, content, summary, slug, category, author, 
    published_date, status, created_at, updated_at, 
    source_file, meta_description
) VALUES"""
    
    return f"{insert_prefix}\n{values_part};"

def main():
    """Main execution function"""
    script_dir = Path(__file__).parent
    results = []
    
    print("Starting execution of remaining articles (11-191)...")
    
    # Process articles 11-191
    for i in range(11, 192):
        article_file = script_dir / f"article_{i:03d}.sql"
        
        if not article_file.exists():
            print(f"Warning: {article_file} not found")
            continue
        
        print(f"Processing article {i}...")
        
        # Read SQL content
        sql_content = read_sql_file(article_file)
        if not sql_content:
            results.append({
                'article_number': i,
                'file': str(article_file),
                'status': 'error',
                'error': 'Failed to read SQL content'
            })
            continue
        
        # Extract VALUES part
        values_part = extract_values_from_sql(sql_content)
        if not values_part:
            results.append({
                'article_number': i,
                'file': str(article_file),
                'status': 'error',
                'error': 'Failed to extract VALUES part'
            })
            continue
        
        # Create complete INSERT statement
        full_insert = create_insert_statement(values_part)
        
        # Prepare for MCP execution
        results.append({
            'article_number': i,
            'file': str(article_file),
            'migration_name': f'insert_article_{i:03d}',
            'sql_query': full_insert,
            'status': 'prepared',
            'ready_for_mcp': True
        })
        
        # Add small delay to avoid overwhelming
        if i % 10 == 0:
            print(f"Processed {i-10} articles...")
            time.sleep(0.1)
    
    # Save results
    results_file = script_dir / 'remaining_articles_for_mcp.json'
    with open(results_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print(f"\nProcessing complete!")
    print(f"Total articles prepared: {len([r for r in results if r['status'] == 'prepared'])}")
    print(f"Results saved to: {results_file}")
    print(f"\nNext step: Execute these articles using MCP server apply_migration")

if __name__ == "__main__":
    main()