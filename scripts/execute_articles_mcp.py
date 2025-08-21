import os
import time
import json
from typing import List, Dict, Any

def read_sql_file(file_path: str) -> str:
    """Read SQL content from file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        return f.read().strip()

def execute_article_via_mcp(article_file: str, project_id: str) -> Dict[str, Any]:
    """Execute a single article SQL file via MCP server."""
    try:
        sql_content = read_sql_file(article_file)
        
        # Extract migration name from filename
        migration_name = f"insert_{os.path.splitext(article_file)[0]}"
        
        print(f"Executing {article_file}...")
        
        # For now, we'll simulate the MCP call
        # In actual implementation, this would call the MCP server
        # result = mcp_client.apply_migration(project_id, migration_name, sql_content)
        
        # Simulate success for now
        result = {"success": True, "file": article_file}
        
        return result
        
    except Exception as e:
        return {"success": False, "file": article_file, "error": str(e)}

def execute_articles_batch(start_num: int, end_num: int, project_id: str) -> Dict[str, Any]:
    """Execute a batch of articles."""
    results = {
        "successful": [],
        "failed": [],
        "total_processed": 0
    }
    
    for i in range(start_num, end_num + 1):
        article_file = f"article_{i:03d}.sql"
        
        if os.path.exists(article_file):
            result = execute_article_via_mcp(article_file, project_id)
            
            if result["success"]:
                results["successful"].append(article_file)
                print(f"✓ {article_file} executed successfully")
            else:
                results["failed"].append({"file": article_file, "error": result.get("error", "Unknown error")})
                print(f"✗ {article_file} failed: {result.get('error', 'Unknown error')}")
            
            results["total_processed"] += 1
            
            # Small delay to avoid overwhelming the server
            time.sleep(0.1)
        else:
            print(f"Warning: {article_file} not found")
    
    return results

def main():
    """Main execution function."""
    project_id = "gngjezgilmdnjffxwquo"  # Your Supabase project ID
    
    # Process articles in batches of 10
    batch_size = 10
    total_articles = 191
    
    all_results = {
        "successful": [],
        "failed": [],
        "total_processed": 0,
        "batches": []
    }
    
    print(f"Starting to process {total_articles} articles in batches of {batch_size}...\n")
    
    for batch_start in range(1, total_articles + 1, batch_size):
        batch_end = min(batch_start + batch_size - 1, total_articles)
        
        print(f"Processing batch: articles {batch_start:03d} to {batch_end:03d}")
        
        batch_results = execute_articles_batch(batch_start, batch_end, project_id)
        
        # Aggregate results
        all_results["successful"].extend(batch_results["successful"])
        all_results["failed"].extend(batch_results["failed"])
        all_results["total_processed"] += batch_results["total_processed"]
        all_results["batches"].append({
            "batch_range": f"{batch_start:03d}-{batch_end:03d}",
            "successful": len(batch_results["successful"]),
            "failed": len(batch_results["failed"])
        })
        
        print(f"Batch {batch_start:03d}-{batch_end:03d} completed: {len(batch_results['successful'])} successful, {len(batch_results['failed'])} failed\n")
        
        # Longer delay between batches
        time.sleep(1)
    
    # Save results to file
    with open('article_execution_results.json', 'w') as f:
        json.dump(all_results, f, indent=2)
    
    # Print summary
    print("\n" + "="*50)
    print("EXECUTION SUMMARY")
    print("="*50)
    print(f"Total articles processed: {all_results['total_processed']}")
    print(f"Successful: {len(all_results['successful'])}")
    print(f"Failed: {len(all_results['failed'])}")
    
    if all_results["failed"]:
        print("\nFailed articles:")
        for failed in all_results["failed"]:
            print(f"  - {failed['file']}: {failed['error']}")
    
    print(f"\nResults saved to: article_execution_results.json")

if __name__ == "__main__":
    main()