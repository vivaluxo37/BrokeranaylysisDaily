import os
import re
from typing import List, Tuple

def extract_articles_from_sql(file_path: str) -> List[str]:
    """Extract individual article INSERT statements from SQL file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the VALUES section and everything after it
    values_match = re.search(r'VALUES\s*(.+)', content, re.DOTALL)
    if not values_match:
        return []
    
    values_content = values_match.group(1)
    
    # Split by ),\n( to get individual articles (accounting for newlines)
    articles = []
    
    # Use a more robust pattern to split articles
    # Look for ),\n( pattern but be careful with the last entry
    pattern = r'\),\s*\n\s*\('
    parts = re.split(pattern, values_content)
    
    for i, part in enumerate(parts):
        if i == 0:
            # First part - starts with (
            if part.strip().startswith('('):
                article = part.strip()
            else:
                article = '(' + part.strip()
        elif i == len(parts) - 1:
            # Last part - ends with );
            article = '(' + part.strip().rstrip(';').rstrip(')')
        else:
            # Middle parts
            article = '(' + part.strip() + ')'
        
        if article.strip() and len(article) > 10:  # Basic validation
            articles.append(article)
    
    return articles

def create_single_article_sql(article_values: str, article_num: int) -> str:
    """Create a complete INSERT statement for a single article."""
    base_sql = """INSERT INTO news_articles (
    title, content, summary, slug, category, author, 
    published_date, status, created_at, updated_at, 
    source_file, meta_description
) VALUES
"""
    
    return base_sql + article_values + ";"

def process_batch_file(batch_file: str, start_num: int) -> Tuple[List[str], int]:
    """Process a batch file and return list of SQL files created and next start number."""
    print(f"Processing {batch_file}...")
    
    articles = extract_articles_from_sql(batch_file)
    sql_files = []
    
    for i, article in enumerate(articles):
        article_num = start_num + i
        sql_content = create_single_article_sql(article, article_num)
        
        output_file = f"article_{article_num:03d}.sql"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(sql_content)
        
        sql_files.append(output_file)
    
    print(f"Created {len(articles)} individual SQL files from {batch_file}")
    return sql_files, start_num + len(articles)

def main():
    """Process all batch files and create individual article SQL files."""
    batch_files = [
        'import_articles_batch_1.sql',
        'import_articles_batch_2.sql', 
        'import_articles_batch_3.sql',
        'import_articles_batch_4.sql'
    ]
    
    all_sql_files = []
    current_num = 1
    
    for batch_file in batch_files:
        if os.path.exists(batch_file):
            sql_files, current_num = process_batch_file(batch_file, current_num)
            all_sql_files.extend(sql_files)
        else:
            print(f"Warning: {batch_file} not found")
    
    print(f"\nTotal articles processed: {len(all_sql_files)}")
    print(f"Files created: article_001.sql to article_{len(all_sql_files):03d}.sql")
    
    # Create a summary file
    with open('article_processing_summary.txt', 'w') as f:
        f.write(f"Article Processing Summary\n")
        f.write(f"========================\n\n")
        f.write(f"Total articles processed: {len(all_sql_files)}\n")
        f.write(f"Files created: article_001.sql to article_{len(all_sql_files):03d}.sql\n\n")
        f.write("Batch file breakdown:\n")
        
        current_num = 1
        for batch_file in batch_files:
            if os.path.exists(batch_file):
                articles = extract_articles_from_sql(batch_file)
                f.write(f"- {batch_file}: {len(articles)} articles (article_{current_num:03d}.sql to article_{current_num + len(articles) - 1:03d}.sql)\n")
                current_num += len(articles)

if __name__ == "__main__":
    main()