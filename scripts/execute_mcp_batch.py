#!/usr/bin/env python3
"""
Script to execute articles in batches using MCP server
"""

import json
import time
from pathlib import Path

def load_prepared_articles():
    """Load prepared articles from JSON file"""
    script_dir = Path(__file__).parent
    json_file = script_dir / 'remaining_articles_for_mcp.json'
    
    try:
        with open(json_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading prepared articles: {e}")
        return []

def execute_batch_mcp(articles, start_idx, batch_size=5):
    """Execute a batch of articles using MCP server"""
    batch_articles = articles[start_idx:start_idx + batch_size]
    
    print(f"\nExecuting batch: articles {start_idx + 1} to {min(start_idx + batch_size, len(articles))}")
    
    for i, article in enumerate(batch_articles):
        article_num = article['article_number']
        migration_name = article['migration_name']
        sql_query = article['sql_query']
        
        print(f"  Executing article {article_num}...")
        
        # Here you would call the MCP server
        # For now, we'll simulate the execution
        print(f"    Migration: {migration_name}")
        print(f"    Status: Ready for MCP execution")
        
        # Add small delay between articles
        time.sleep(0.2)
    
    return len(batch_articles)

def main():
    """Main execution function"""
    print("Loading prepared articles...")
    articles = load_prepared_articles()
    
    if not articles:
        print("No articles found to execute")
        return
    
    print(f"Found {len(articles)} articles ready for execution")
    
    # Execute in batches of 5
    batch_size = 5
    total_executed = 0
    
    for start_idx in range(0, len(articles), batch_size):
        executed_count = execute_batch_mcp(articles, start_idx, batch_size)
        total_executed += executed_count
        
        # Add delay between batches
        if start_idx + batch_size < len(articles):
            print(f"  Batch complete. Waiting 2 seconds before next batch...")
            time.sleep(2)
    
    print(f"\nExecution plan complete!")
    print(f"Total articles processed: {total_executed}")
    print(f"\nTo execute these articles, use the MCP server with:")
    print(f"- Project ID: gngjezgilmdnjffxwquo")
    print(f"- Tool: apply_migration")
    print(f"- Each article has its migration_name and sql_query ready")

if __name__ == "__main__":
    main()