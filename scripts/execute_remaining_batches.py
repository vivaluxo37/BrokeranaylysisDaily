import os
import time
from pathlib import Path

def execute_remaining_batches():
    """
    Execute batches 4-9 automatically
    """
    batch_files = [f'batch_{i}_update.sql' for i in range(4, 10)]
    
    print("Executing remaining batches (4-9)...")
    
    for batch_file in batch_files:
        if not os.path.exists(batch_file):
            print(f"Warning: {batch_file} not found, skipping...")
            continue
            
        print(f"\nProcessing {batch_file}...")
        
        # Read the batch SQL
        with open(batch_file, 'r', encoding='utf-8') as f:
            sql_content = f.read().strip()
        
        if not sql_content:
            print(f"Warning: {batch_file} is empty, skipping...")
            continue
            
        # Show preview
        lines = sql_content.split('\n')[:2]
        print(f"Preview: {' '.join(lines)}...")
        
        # Save to a combined file for manual execution
        with open('remaining_batches_combined.sql', 'a', encoding='utf-8') as f:
            f.write(f"\n-- {batch_file}\n")
            f.write(sql_content)
            f.write("\n\n")
        
        print(f"✓ {batch_file} added to combined file")
        time.sleep(0.1)
    
    print("\n=== Summary ===")
    print("All remaining batches have been combined into 'remaining_batches_combined.sql'")
    print("You can execute this file manually in Supabase or run each batch individually.")
    
    # Count total UPDATE statements
    if os.path.exists('remaining_batches_combined.sql'):
        with open('remaining_batches_combined.sql', 'r', encoding='utf-8') as f:
            content = f.read()
            update_count = content.count('UPDATE articles')
        print(f"Total UPDATE statements: {update_count}")

if __name__ == "__main__":
    execute_remaining_batches()