import os
import json
from pathlib import Path

def read_article_sql(file_path):
    """Read and extract VALUES content from article SQL file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract the VALUES part
        values_start = content.find('VALUES')
        if values_start == -1:
            return None
            
        values_content = content[values_start + 6:].strip()
        # Remove the trailing semicolon if present
        if values_content.endswith(';'):
            values_content = values_content[:-1]
            
        return values_content
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return None

def create_batch_insert_sql():
    """Create a single SQL statement to insert all remaining articles"""
    scripts_dir = Path('C:/Users/LENOVO/Desktop/BrokeranalysisDaily/scripts')
    
    # We have 22 articles inserted, so start from article 23
    start_article = 23
    end_article = 191  # Based on the file listing
    
    all_values = []
    
    for i in range(start_article, end_article + 1):
        article_file = scripts_dir / f'article_{i:03d}.sql'
        
        if article_file.exists():
            values_content = read_article_sql(article_file)
            if values_content:
                all_values.append(values_content)
                print(f"Added article {i:03d}")
        else:
            print(f"File not found: {article_file}")
    
    if not all_values:
        print("No articles found to insert")
        return None
    
    # Create the complete INSERT statement
    insert_sql = """INSERT INTO news_articles (
    title, content, summary, slug, category, author, 
    published_date, status, created_at, updated_at, 
    source_file, meta_description
) VALUES\n"""
    
    # Join all VALUES with commas
    insert_sql += ',\n'.join(all_values) + ';'
    
    # Save to file
    output_file = 'batch_insert_all_remaining_articles.sql'
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(insert_sql)
    
    print(f"Created batch insert SQL with {len(all_values)} articles")
    print(f"Saved to: {output_file}")
    
    return insert_sql, len(all_values)

if __name__ == "__main__":
    result = create_batch_insert_sql()
    if result:
        sql_content, count = result
        print(f"\nReady to insert {count} articles in one batch operation.")
        print("The SQL file 'batch_insert_all_remaining_articles.sql' has been created.")
    else:
        print("Failed to create batch insert SQL.")