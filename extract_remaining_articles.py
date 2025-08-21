import re

def extract_remaining_articles():
    """Extract articles from the batch file, excluding already inserted ones"""
    
    # Read the complete batch file
    with open('batch_insert_all_remaining_articles.sql', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split the content into individual article entries
    # Find all VALUES entries
    values_pattern = r'\(([^)]+(?:\([^)]*\)[^)]*)*)\)'
    matches = re.findall(values_pattern, content, re.DOTALL)
    
    print(f"Found {len(matches)} articles in batch file")
    
    # Already inserted articles (based on our database check)
    inserted_slugs = [
        'crispus-nyaga-broker-analysis-authorscom',
        'cliff-wachtel-broker-analysis-authorscom', 
        'christopher-lewis-broker-analysis-authorscom'
    ]
    
    # Filter out already inserted articles
    remaining_articles = []
    
    for i, match in enumerate(matches):
        # Check if this article's slug is in the inserted list
        is_inserted = False
        for slug in inserted_slugs:
            if slug in match:
                print(f"Skipping already inserted article: {slug}")
                is_inserted = True
                break
        
        if not is_inserted:
            remaining_articles.append(f"({match})")
    
    print(f"Remaining articles to insert: {len(remaining_articles)}")
    
    if remaining_articles:
        # Create new batch insert SQL
        insert_base = """INSERT INTO news_articles (
    title, content, summary, slug, category, author, 
    published_date, status, created_at, updated_at, 
    source_file, meta_description
) VALUES"""
        
        complete_sql = insert_base + "\n" + ",\n".join(remaining_articles) + ";\n"
        
        # Write to new file
        output_file = "batch_insert_truly_remaining.sql"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(complete_sql)
        
        print(f"\nNew batch file created: {output_file}")
        print(f"Ready for insertion of {len(remaining_articles)} articles!")
        
        return output_file
    else:
        print("No remaining articles to insert")
        return None

if __name__ == "__main__":
    extract_remaining_articles()