import json
import sys
from datetime import datetime

def load_prepared_articles():
    """Load the prepared articles with random author assignments"""
    try:
        with open('prepared_articles_random_authors.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print("Error: prepared_articles_random_authors.json not found")
        print("Please run migrate_articles_random_authors.py first")
        return []

def create_insert_queries(articles):
    """Create SQL INSERT queries for the articles"""
    if not articles:
        return []
    
    queries = []
    
    # Split articles into batches of 50 for better performance
    batch_size = 50
    for i in range(0, len(articles), batch_size):
        batch = articles[i:i + batch_size]
        
        # Create VALUES clause for batch insert
        values_list = []
        for article in batch:
            # Escape single quotes in content
            title = article['title'].replace("'", "''")
            slug = article['slug'].replace("'", "''")
            content = article['content'].replace("'", "''")
            excerpt = article['excerpt'].replace("'", "''")
            meta_title = article['meta_title'].replace("'", "''")
            meta_description = article['meta_description'].replace("'", "''")
            original_file = article['original_file'].replace("'", "''")
            
            values = f"('{title}', '{slug}', '{content}', '{excerpt}', '{article['author_slug']}', '{article['published_at']}', '{article['status']}', {article['category_id']}, '{meta_title}', '{meta_description}', '{original_file}')"
            values_list.append(values)
        
        # Create the INSERT query
        query = f"""
INSERT INTO articles (
    title, 
    slug, 
    content, 
    excerpt, 
    author_slug, 
    published_at, 
    status, 
    category_id, 
    meta_title, 
    meta_description, 
    original_file
) VALUES 
{',\n'.join(values_list)};
"""
        
        queries.append(query)
    
    return queries

def save_queries_to_file(queries):
    """Save the SQL queries to a file"""
    with open('import_articles_queries.sql', 'w', encoding='utf-8') as f:
        f.write("-- Import articles with random author assignments\n")
        f.write(f"-- Generated on: {datetime.now().isoformat()}\n\n")
        
        for i, query in enumerate(queries, 1):
            f.write(f"-- Batch {i}\n")
            f.write(query)
            f.write("\n\n")
    
    print(f"SQL queries saved to import_articles_queries.sql")

def main():
    """Main function to prepare and save import queries"""
    print("Loading prepared articles...")
    articles = load_prepared_articles()
    
    if not articles:
        print("No articles to import")
        return
    
    print(f"Creating import queries for {len(articles)} articles...")
    queries = create_insert_queries(articles)
    
    print(f"Generated {len(queries)} batch queries")
    save_queries_to_file(queries)
    
    # Print summary
    print("\nImport Summary:")
    print(f"Total articles: {len(articles)}")
    print(f"Batch queries: {len(queries)}")
    print(f"Articles per batch: ~{len(articles) // len(queries) if queries else 0}")
    
    # Show author distribution
    try:
        with open('random_author_distribution.json', 'r', encoding='utf-8') as f:
            distribution = json.load(f)
            print("\nAuthor Distribution:")
            for author, count in distribution['author_distribution'].items():
                print(f"  {author}: {count} articles")
    except FileNotFoundError:
        pass
    
    print("\nNext steps:")
    print("1. Review the generated SQL file: import_articles_queries.sql")
    print("2. Execute the queries in your Supabase database")
    print("3. Verify the import was successful")

if __name__ == '__main__':
    main()