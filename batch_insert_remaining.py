import os
import json
from pathlib import Path

def read_article_sql(file_path):
    """Read and extract VALUES content from an article SQL file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read().strip()
            
        # Extract the VALUES part
        if 'VALUES' in content:
            values_part = content.split('VALUES')[1].strip()
            # Remove the trailing semicolon if present
            if values_part.endswith(';'):
                values_part = values_part[:-1]
            return values_part
        return None
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return None

def create_batch_insert(start_num, end_num, batch_size=10):
    """Create batch insert statements for articles"""
    scripts_dir = Path('scripts')
    
    current_batch = []
    batch_count = 0
    
    for i in range(start_num, end_num + 1):
        article_file = scripts_dir / f'article_{i:03d}.sql'
        
        if article_file.exists():
            values_content = read_article_sql(article_file)
            if values_content:
                current_batch.append(values_content)
                
                # When batch is full, create insert statement
                if len(current_batch) >= batch_size:
                    batch_count += 1
                    batch_sql = create_insert_statement(current_batch, batch_count)
                    
                    # Save batch to file
                    batch_filename = f'batch_insert_{batch_count:03d}.sql'
                    with open(batch_filename, 'w', encoding='utf-8') as f:
                        f.write(batch_sql)
                    
                    print(f"Created {batch_filename} with {len(current_batch)} articles")
                    current_batch = []
    
    # Handle remaining articles
    if current_batch:
        batch_count += 1
        batch_sql = create_insert_statement(current_batch, batch_count)
        batch_filename = f'batch_insert_{batch_count:03d}.sql'
        with open(batch_filename, 'w', encoding='utf-8') as f:
            f.write(batch_sql)
        print(f"Created {batch_filename} with {len(current_batch)} articles")
    
    return batch_count

def create_insert_statement(values_list, batch_num):
    """Create a complete INSERT statement from VALUES list"""
    header = """INSERT INTO news_articles (
    title, content, summary, slug, category, author, 
    published_date, status, created_at, updated_at, 
    source_file, meta_description
) VALUES\n"""
    
    values_combined = ',\n'.join(values_list)
    return header + values_combined + ';'

if __name__ == "__main__":
    print("Creating batch insert files for remaining articles...")
    
    # Start from article 31 (since we've inserted up to 30)
    total_batches = create_batch_insert(31, 151, batch_size=10)
    
    print(f"\nCreated {total_batches} batch files")
    print("Ready to insert batches using MCP server")