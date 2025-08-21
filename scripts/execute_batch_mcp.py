import os
import time
import json
from typing import Dict, Any

def execute_single_article_mcp(article_num: int, project_id: str) -> Dict[str, Any]:
    """Execute a single article using MCP server."""
    article_file = f"article_{article_num:03d}.sql"
    
    if not os.path.exists(article_file):
        return {"success": False, "error": f"File {article_file} not found"}
    
    try:
        # Read the SQL content
        with open(article_file, 'r', encoding='utf-8') as f:
            sql_content = f.read().strip()
        
        migration_name = f"insert_article_{article_num:03d}"
        
        print(f"Executing article {article_num:03d}...", end=" ")
        
        # This would be the actual MCP call
        # We'll return the SQL content for manual execution
        return {
            "success": True,
            "article_num": article_num,
            "migration_name": migration_name,
            "sql_content": sql_content,
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
    """Execute articles 8-20 as a test batch."""
    project_id = "gngjezgilmdnjffxwquo"
    
    # Test with articles 8-20 first
    start_article = 8
    end_article = 20
    
    results = {
        "successful": [],
        "failed": [],
        "total_processed": 0
    }
    
    print(f"Processing articles {start_article:03d} to {end_article:03d} for MCP execution...\n")
    
    for article_num in range(start_article, end_article + 1):
        result = execute_single_article_mcp(article_num, project_id)
        
        if result["success"]:
            results["successful"].append(result)
            print("✓ Ready for MCP execution")
        else:
            results["failed"].append(result)
            print(f"✗ Error: {result.get('error', 'Unknown error')}")
        
        results["total_processed"] += 1
        time.sleep(0.05)
    
    # Save results for manual MCP execution
    with open('batch_8_20_for_mcp.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print("\n" + "="*50)
    print("BATCH 8-20 PREPARATION SUMMARY")
    print("="*50)
    print(f"Total articles prepared: {results['total_processed']}")
    print(f"Successfully prepared: {len(results['successful'])}")
    print(f"Failed to prepare: {len(results['failed'])}")
    
    if results["failed"]:
        print("\nFailed articles:")
        for failed in results["failed"]:
            print(f"  - Article {failed.get('article_num', 'unknown')}: {failed['error']}")
    
    print(f"\nBatch data saved to: batch_8_20_for_mcp.json")
    print("\nNext: Execute these articles manually using MCP server")
    
    # Show first article as example
    if results["successful"]:
        first_article = results["successful"][0]
        print(f"\nExample - Article {first_article['article_num']:03d}:")
        print(f"Migration name: {first_article['migration_name']}")
        print(f"SQL file: {first_article['file']}")

if __name__ == "__main__":
    main()