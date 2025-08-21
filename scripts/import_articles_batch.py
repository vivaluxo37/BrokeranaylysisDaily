#!/usr/bin/env python3
"""
Script to import articles from migration JSON files to Supabase
Handles both original articles (20) and additional articles (173)
"""

import json
import re
from datetime import datetime
from pathlib import Path
import requests

def clean_text(text):
    """Clean and normalize text content"""
    if not text:
        return None
    
    # Remove extra whitespace and normalize
    text = re.sub(r'\s+', ' ', text.strip())
    
    # Update brand references
    text = text.replace('DailyForex', 'Broker Analysis')
    text = text.replace('dailyforex', 'broker-analysis')
    
    return text

def generate_slug(title):
    """Generate URL-friendly slug from title"""
    if not title:
        return None
    
    # Clean title and convert to slug
    slug = title.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'\s+', '-', slug)
    slug = re.sub(r'-+', '-', slug)
    slug = slug.strip('-')
    
    # Update brand references in slug
    slug = slug.replace('dailyforex', 'broker-analysis')
    
    return slug[:100]  # Limit length

def extract_category_from_path(file_path):
    """Extract category from file path"""
    if not file_path:
        return 'General'
    
    path_parts = file_path.lower().split('\\')
    
    # Look for category indicators in path
    if 'authors' in path_parts:
        return 'Author Profile'
    elif 'news' in path_parts:
        return 'News'
    elif 'analysis' in path_parts:
        return 'Analysis'
    elif 'education' in path_parts:
        return 'Education'
    else:
        return 'General'

def get_existing_slugs():
    """Get existing slugs from Supabase to avoid duplicates"""
    try:
        # This would normally use Supabase client, but for now we'll return known slugs
        existing_slugs = {
            'united-states-federal-reserve-maintains-rates',
            'bitcoin-price-2805-stablecoins-steal-the-spotlight',
            'bitcoin-stalls-below-95k-monero-surges-43-chart',
            'forex-today-0508-risk-assets-hit-yen-franc-surge',
            'test-news-article'
        }
        return existing_slugs
    except Exception as e:
        print(f"Warning: Could not fetch existing slugs: {e}")
        return set()

def transform_article_data(article_data):
    """Transform article data to match news_articles table schema"""
    
    # Clean and transform fields
    title = clean_text(article_data.get('title', ''))
    content = clean_text(article_data.get('content', ''))
    description = clean_text(article_data.get('description', ''))
    
    # Generate slug from title
    slug = generate_slug(title)
    
    # Extract category from file path
    category = extract_category_from_path(article_data.get('file_path', ''))
    
    # Handle author - map to actual author names instead of "Broker Analysis"
    author = article_data.get('author', 'Broker Analysis')
    
    # Parse published date
    published_date = None
    if article_data.get('published_date'):
        try:
            # Try different date formats
            date_str = article_data['published_date']
            if '/' in date_str:
                published_date = datetime.strptime(date_str, '%m/%d/%Y').isoformat()
            else:
                published_date = date_str
        except:
            published_date = None
    
    # Handle timestamps
    created_at = article_data.get('created_at')
    updated_at = article_data.get('updated_at')
    
    return {
        'title': title,
        'content': content,
        'summary': description,  # Use description as summary
        'slug': slug,
        'category': category,
        'author': author,
        'published_date': published_date,
        'status': 'published',
        'created_at': created_at,
        'updated_at': updated_at,
        'source_file': article_data.get('file_path'),
        'meta_description': description[:160] if description else None,  # Limit meta description
        'tags': None  # Will be populated later if needed
    }

def generate_insert_sql(articles_batch, batch_number):
    """Generate SQL INSERT statement for a batch of articles"""
    
    if not articles_batch:
        return None
    
    sql_parts = []
    sql_parts.append("INSERT INTO news_articles (")
    sql_parts.append("    title, content, summary, slug, category, author, ")
    sql_parts.append("    published_date, status, created_at, updated_at, ")
    sql_parts.append("    source_file, meta_description")
    sql_parts.append(") VALUES")
    
    values_parts = []
    for article in articles_batch:
        # Escape single quotes in text fields
        def escape_sql(value):
            if value is None:
                return 'NULL'
            if isinstance(value, str):
                return "'" + value.replace("'", "''") + "'"
            return "'" + str(value) + "'"
        
        value_row = f"""(
    {escape_sql(article['title'])},
    {escape_sql(article['content'])},
    {escape_sql(article['summary'])},
    {escape_sql(article['slug'])},
    {escape_sql(article['category'])},
    {escape_sql(article['author'])},
    {escape_sql(article['published_date'])},
    {escape_sql(article['status'])},
    {escape_sql(article['created_at'])},
    {escape_sql(article['updated_at'])},
    {escape_sql(article['source_file'])},
    {escape_sql(article['meta_description'])}
)"""
        values_parts.append(value_row)
    
    sql_parts.append(',\n'.join(values_parts))
    sql_parts.append(';')
    
    return '\n'.join(sql_parts)

def main():
    """Main function to process and generate SQL for articles"""
    
    # Get existing slugs to avoid duplicates
    existing_slugs = get_existing_slugs()
    print(f"Found {len(existing_slugs)} existing articles to skip")
    
    # Define file paths
    base_dir = Path(r'C:\Users\LENOVO\Desktop\BrokeranalysisDaily')
    original_articles_file = base_dir / 'migration_2024_beyond' / 'articles_2024_beyond.json'
    additional_articles_file = base_dir / 'migration_2024_beyond' / 'additional_articles_2024_beyond.json'
    output_dir = base_dir / 'scripts'
    
    # Load articles data
    print("Loading articles data...")
    
    all_articles = []
    
    # Load original articles (20)
    if original_articles_file.exists():
        with open(original_articles_file, 'r', encoding='utf-8') as f:
            original_articles = json.load(f)
            print(f"Loaded {len(original_articles)} original articles")
            all_articles.extend(original_articles)
    
    # Load additional articles (173)
    if additional_articles_file.exists():
        with open(additional_articles_file, 'r', encoding='utf-8') as f:
            additional_articles = json.load(f)
            print(f"Loaded {len(additional_articles)} additional articles")
            all_articles.extend(additional_articles)
    
    print(f"Total articles to process: {len(all_articles)}")
    
    # Transform articles data and filter out duplicates
    print("Transforming articles data...")
    transformed_articles = []
    skipped_count = 0
    
    for i, article in enumerate(all_articles):
        try:
            transformed = transform_article_data(article)
            if transformed['title'] and transformed['slug']:  # Only include articles with title and slug
                # Check if slug already exists
                if transformed['slug'] in existing_slugs:
                    skipped_count += 1
                    print(f"Skipping duplicate article: {transformed['title']}")
                    continue
                
                transformed_articles.append(transformed)
            else:
                print(f"Skipping article {i+1}: missing title or slug")
        except Exception as e:
            print(f"Error transforming article {i+1}: {e}")
    
    print(f"Successfully transformed {len(transformed_articles)} articles")
    print(f"Skipped {skipped_count} duplicate articles")
    
    # Generate SQL in batches (to avoid overly large files)
    batch_size = 50
    batches = [transformed_articles[i:i + batch_size] for i in range(0, len(transformed_articles), batch_size)]
    
    print(f"Generating SQL in {len(batches)} batches...")
    
    for batch_num, batch in enumerate(batches, 1):
        sql_content = generate_insert_sql(batch, batch_num)
        
        if sql_content:
            output_file = output_dir / f'import_articles_batch_{batch_num}.sql'
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(sql_content)
            
            print(f"Generated {output_file} with {len(batch)} articles")
    
    # Generate summary
    summary_file = output_dir / 'articles_import_summary.txt'
    with open(summary_file, 'w', encoding='utf-8') as f:
        f.write(f"Articles Import Summary\n")
        f.write(f"======================\n\n")
        f.write(f"Total articles processed: {len(all_articles)}\n")
        f.write(f"Successfully transformed: {len(transformed_articles)}\n")
        f.write(f"Articles skipped (duplicates): {skipped_count}\n")
        f.write(f"Generated SQL batches: {len(batches)}\n")
        f.write(f"Batch size: {batch_size}\n\n")
        
        f.write(f"Categories found:\n")
        categories = {}
        for article in transformed_articles:
            cat = article['category']
            categories[cat] = categories.get(cat, 0) + 1
        
        for cat, count in sorted(categories.items()):
            f.write(f"  {cat}: {count}\n")
    
    print(f"\nImport preparation completed!")
    print(f"Generated {len(batches)} SQL batch files")
    print(f"Summary saved to {summary_file}")
    print(f"\nNext steps:")
    print(f"1. Review the generated SQL files")
    print(f"2. Execute each batch in Supabase")
    print(f"3. Verify the import results")

if __name__ == '__main__':
    main()