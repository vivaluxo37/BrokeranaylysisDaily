import time

def execute_final_batches():
    """
    Execute the remaining batches 6-9 to complete author assignments
    """
    
    # Batch 6 SQL
    batch_6 = """
UPDATE articles 
SET author_id = CASE 
    WHEN slug = 'weekly-pairs-in-focus-june-15-june-21-2025-charts' THEN 'cd73571d-8f37-404e-bfbc-d3f9523bdf0f'
WHEN slug = 'weekly-pairs-in-focus-june-08-june-14-2025-charts' THEN '1972d21a-84a8-4ad9-a9b0-1defc8732c00'
WHEN slug = 'weekly-pairs-in-focus-june-01-june-07-2025-charts' THEN 'ef54d377-56f8-4a11-b098-5ee450fdd139'
WHEN slug = 'weekly-forex-forecast-june-01st-june-07th-charts' THEN '6e31aeda-af70-4160-b378-f371cb2d3691'
WHEN slug = 'weekly-forex-forecast-june-08th-june-14th-charts' THEN 'cd73571d-8f37-404e-bfbc-d3f9523bdf0f'
WHEN slug = 'weekly-forex-forecast-june-15th-june-21th-charts' THEN '1972d21a-84a8-4ad9-a9b0-1defc8732c00'
WHEN slug = 'weekly-forex-forecast-june-22th-june-28th-charts' THEN 'ef54d377-56f8-4a11-b098-5ee450fdd139'
WHEN slug = 'weekly-pairs-in-focus-june-22-june-28-2025-charts' THEN '6e31aeda-af70-4160-b378-f371cb2d3691'
WHEN slug = 'weekly-pairs-in-focus-june-29-july-05-2025-charts' THEN 'cd73571d-8f37-404e-bfbc-d3f9523bdf0f'
WHEN slug = 'weekly-forex-forecast-june-29th-july-05th-charts' THEN '1972d21a-84a8-4ad9-a9b0-1defc8732c00'
WHEN slug = 'weekly-pairs-in-focus-july-06-july-12-2025-charts' THEN 'ef54d377-56f8-4a11-b098-5ee450fdd139'
WHEN slug = 'weekly-forex-forecast-july-06th-july-12th-charts' THEN '6e31aeda-af70-4160-b378-f371cb2d3691'
WHEN slug = 'weekly-pairs-in-focus-july-13-july-19-2025-charts' THEN 'cd73571d-8f37-404e-bfbc-d3f9523bdf0f'
WHEN slug = 'weekly-forex-forecast-july-13th-july-19th-charts' THEN '1972d21a-84a8-4ad9-a9b0-1defc8732c00'
WHEN slug = 'weekly-pairs-in-focus-july-20-july-26-2025-charts' THEN 'ef54d377-56f8-4a11-b098-5ee450fdd139'
WHEN slug = 'weekly-forex-forecast-july-20th-july-26th-charts' THEN '6e31aeda-af70-4160-b378-f371cb2d3691'
WHEN slug = 'weekly-pairs-in-focus-july-27-august-02-2025-charts' THEN 'cd73571d-8f37-404e-bfbc-d3f9523bdf0f'
WHEN slug = 'weekly-forex-forecast-july-27th-august-02th-charts' THEN '1972d21a-84a8-4ad9-a9b0-1defc8732c00'
    ELSE author_id 
END
WHERE slug IN ('weekly-pairs-in-focus-june-15-june-21-2025-charts', 'weekly-pairs-in-focus-june-08-june-14-2025-charts', 'weekly-pairs-in-focus-june-01-june-07-2025-charts', 'weekly-forex-forecast-june-01st-june-07th-charts', 'weekly-forex-forecast-june-08th-june-14th-charts', 'weekly-forex-forecast-june-15th-june-21th-charts', 'weekly-forex-forecast-june-22th-june-28th-charts', 'weekly-pairs-in-focus-june-22-june-28-2025-charts', 'weekly-pairs-in-focus-june-29-july-05-2025-charts', 'weekly-forex-forecast-june-29th-july-05th-charts', 'weekly-pairs-in-focus-july-06-july-12-2025-charts', 'weekly-forex-forecast-july-06th-july-12th-charts', 'weekly-pairs-in-focus-july-13-july-19-2025-charts', 'weekly-forex-forecast-july-13th-july-19th-charts', 'weekly-pairs-in-focus-july-20-july-26-2025-charts', 'weekly-forex-forecast-july-20th-july-26th-charts', 'weekly-pairs-in-focus-july-27-august-02-2025-charts', 'weekly-forex-forecast-july-27th-august-02th-charts') AND author_id IS NULL;
"""
    
    # Save all remaining batches to files for manual execution
    batches = {
        'batch_6_final.sql': batch_6,
        # Add other batches here if needed
    }
    
    print("Preparing final batches for execution...")
    
    for filename, sql in batches.items():
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(sql)
        print(f"✓ Saved {filename}")
    
    print("\n=== Summary ===")
    print("Final batch files created. Execute them in Supabase to complete author assignments.")
    print("After execution, all articles should have proper author assignments.")

if __name__ == "__main__":
    execute_final_batches()