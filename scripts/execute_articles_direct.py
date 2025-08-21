import os
import subprocess
import json
import time
from typing import Dict, Any

def execute_article_mcp(article_num: int, project_id: str) -> Dict[str, Any]:
    """Execute a single article using MCP server via subprocess."""
    article_file = f"article_{article_num:03d}.sql"
    
    if not os.path.exists(article_file):
        return {"success": False, "error": f"File {article_file} not found"}
    
    try:
        # Read the SQL content
        with open(article_file, 'r', encoding='utf-8') as f:
            sql_content = f.read().strip()
        
        # Extract just the VALUES part for the migration
        if 'VALUES' in sql_content:
            values_part = sql_content.split('VALUES')[1].strip()
            if values_part.endswith(';'):
                values_part = values_part[:-1]
        else:
            return {"success": False, "error": "No VALUES section found"}
        
        migration_name = f"insert_article_{article_num:03d}"
        
        # Construct the full INSERT statement
        full_sql = f"""INSERT INTO news_articles (
    title, content, summary, slug, category, author, 
    published_date, status, created_at, updated_at, 
    source_file, meta_description
) VALUES{values_part};"""
        
        print(f"Executing {article_file} (migration: {migration_name})...")
        
        # For now, return success to test the flow
        # In actual implementation, we would call the MCP server here
        return {
            "success": True, 
            "article_num": article_num,
            "migration_name": migration_name,
            "file": article_file
        }
        
    except Exception as e:
        return {
            "success": False, 
            "article_num": article_num,
            "file": article_file,
            "error": str(e)
        }

def main():
    """Execute articles starting from article 6 (since we have 10 in DB, 5 were singles)."""
    project_id = "gngjezgilmdnjffxwquo"
    
    # We already have 10 articles in the database
    # Articles 1-5 were the single articles we just added
    # So we need to start from article 6 and skip the first 5 from our batch
    
    start_article = 6  # Start from article 6
    end_article = 191  # Process all 191 articles
    
    results = {
        "successful": [],
        "failed": [],
        "skipped": [],
        "total_processed": 0
    }
    
    print(f"Starting article execution from article {start_article:03d} to {end_article:03d}...\n")
    
    for article_num in range(start_article, end_article + 1):
        result = execute_article_mcp(article_num, project_id)
        
        if result["success"]:
            results["successful"].append(result)
            print(f"✓ Article {article_num:03d} prepared successfully")
        else:
            results["failed"].append(result)
            print(f"✗ Article {article_num:03d} failed: {result.get('error', 'Unknown error')}")
        
        results["total_processed"] += 1
        
        # Small delay
        time.sleep(0.05)
        
        # Progress update every 10 articles
        if article_num % 10 == 0:
            print(f"Progress: {article_num - start_article + 1}/{end_article - start_article + 1} articles processed\n")
    
    # Save results
    with open('article_execution_plan.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print("\n" + "="*60)
    print("EXECUTION PLAN SUMMARY")
    print("="*60)
    print(f"Total articles planned: {results['total_processed']}")
    print(f"Successfully prepared: {len(results['successful'])}")
    print(f"Failed to prepare: {len(results['failed'])}")
    
    if results["failed"]:
        print("\nFailed articles:")
        for failed in results["failed"][:10]:  # Show first 10 failures
            print(f"  - Article {failed.get('article_num', 'unknown')}: {failed['error']}")
        if len(results["failed"]) > 10:
            print(f"  ... and {len(results['failed']) - 10} more")
    
    print(f"\nExecution plan saved to: article_execution_plan.json")
    print(f"\nNext step: Execute the prepared articles using MCP server")

if __name__ == "__main__":
    main()