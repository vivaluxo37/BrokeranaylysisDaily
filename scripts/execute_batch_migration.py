import os
from pathlib import Path

def read_sql_file(file_path):
    """Read the complete SQL file content"""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    except Exception as e:
        print(f"Error reading file {file_path}: {e}")
        return None

def main():
    # Define the batch files
    batch_files = [
        'import_articles_batch_1.sql',
        'import_articles_batch_2.sql', 
        'import_articles_batch_3.sql',
        'import_articles_batch_4.sql'
    ]
    
    script_dir = Path(__file__).parent
    
    for batch_file in batch_files:
        file_path = script_dir / batch_file
        
        if file_path.exists():
            print(f"Reading {batch_file}...")
            sql_content = read_sql_file(file_path)
            
            if sql_content:
                print(f"Successfully read {batch_file} ({len(sql_content)} characters)")
                # Save the content to a temporary file for manual execution
                temp_file = script_dir / f"temp_{batch_file}"
                with open(temp_file, 'w', encoding='utf-8') as f:
                    f.write(sql_content)
                print(f"Saved content to {temp_file}")
            else:
                print(f"Failed to read {batch_file}")
        else:
            print(f"File {batch_file} not found")

if __name__ == "__main__":
    main()