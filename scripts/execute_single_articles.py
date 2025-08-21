import re

def extract_single_article_inserts(sql_file_path: str, max_articles: int = 5):
    """Extract individual article INSERT statements from the SQL file"""
    with open(sql_file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the INSERT statement header
    header_match = re.search(r'INSERT INTO news_articles \([^)]+\) VALUES', content, re.DOTALL)
    if not header_match:
        raise ValueError("Could not find INSERT header")
    
    header = header_match.group(0)
    
    # Find individual article entries
    # Look for patterns like "(\n    'title'," to start of next "(\n    '" or end
    article_pattern = r'\(\s*\'[^\'].*?\),(?=\s*\(\s*\'|\s*;)'
    articles = re.findall(article_pattern, content, re.DOTALL)
    
    # Create individual INSERT statements
    individual_inserts = []
    for i, article in enumerate(articles[:max_articles]):
        insert_statement = f"{header}\n{article};"
        individual_inserts.append(insert_statement)
        
        # Save to file
        filename = f"single_article_{i+1}.sql"
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(insert_statement)
        print(f"Created: {filename}")
    
    return individual_inserts

def main():
    """Extract first 5 articles as individual INSERT statements"""
    try:
        sql_file = 'import_articles_batch_1.sql'
        inserts = extract_single_article_inserts(sql_file, max_articles=5)
        print(f"\nExtracted {len(inserts)} individual article INSERT statements")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()