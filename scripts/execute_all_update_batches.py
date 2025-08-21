import re
import time
from pathlib import Path

def execute_all_update_batches():
    """
    Execute all update batches from the SQL file
    """
    sql_file = Path('update_articles_authors.sql')
    
    if not sql_file.exists():
        print(f"Error: {sql_file} not found")
        return
    
    # Read the SQL file
    with open(sql_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split into batches using the "-- Batch" comment pattern
    batches = re.split(r'-- Batch \d+', content)
    
    # Remove the header (first split will be the comments before first batch)
    batches = [batch.strip() for batch in batches if batch.strip() and 'UPDATE articles' in batch]
    
    print(f"Found {len(batches)} batches to execute")
    
    # Execute each batch
    for i, batch in enumerate(batches, 1):
        print(f"\nExecuting batch {i}/{len(batches)}...")
        
        # Clean up the batch SQL
        batch_sql = batch.strip()
        if not batch_sql:
            continue
            
        # Print first few lines for verification
        lines = batch_sql.split('\n')[:3]
        print(f"Preview: {' '.join(lines)}...")
        
        # Here you would execute the SQL
        # For now, just simulate execution
        print(f"✓ Batch {i} prepared for execution")
        
        # Add a small delay to avoid overwhelming the database
        time.sleep(0.5)
    
    print(f"\n=== Summary ===")
    print(f"Total batches processed: {len(batches)}")
    print("All update batches are ready for execution in Supabase")
    
    # Save individual batch files for manual execution if needed
    for i, batch in enumerate(batches, 1):
        batch_file = f"batch_{i}_update.sql"
        with open(batch_file, 'w', encoding='utf-8') as f:
            f.write(batch)
        print(f"Saved: {batch_file}")

if __name__ == "__main__":
    execute_all_update_batches()