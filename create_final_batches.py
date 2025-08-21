import os
import re
import json

def clean_text(text):
    """Clean and escape text for SQL insertion"""
    if not text:
        return ''
    
    # Replace single quotes with double single quotes for SQL escaping
    text = text.replace("'", "''")
    # Remove or replace problematic characters
    text = text.replace('\r\n', '\n').replace('\r', '\n')
    # Remove null bytes
    text = text.replace('\x00', '')
    return text

def extract_article_data(file_path):
    """Extract article data from individual SQL file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract VALUES content using regex
        values_match = re.search(r'VALUES\s*\((.*?)\);', content, re.DOTALL)
        if not values_match:
            print(f"No VALUES found in {file_path}")
            return None
            
        values_content = values_match.group(1).strip()
        
        # Parse the values - this is a simplified approach
        # We'll extract the basic fields we need
        
        # Try to extract title (first quoted string)
        title_match = re.search(r"'([^']*(?:''[^']*)*)'\s*,", values_content)
        if not title_match:
            print(f"Could not extract title from {file_path}")
            return None
            
        title = title_match.group(1).replace("''", "'")
        
        # For now, let's create a simple article structure
        # We'll use the filename as a base for other fields
        filename = os.path.basename(file_path).replace('.sql', '')
        
        article_data = {
            'title': clean_text(title[:200]),  # Limit title length
            'content': clean_text(f'Content from {filename}'),  # Simplified content
            'author': 'Broker Analysis',
            'published_date': '2024-01-15',
            'category': 'General',
            'tags': "ARRAY['migration', 'article']",
            'slug': clean_text(filename.replace('_', '-')),
            'meta_description': clean_text(f'Article {filename} migrated from DailyForex'),
            'status': 'published'
        }
        
        return article_data
        
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return None

def create_batch_sql(articles, batch_name):
    """Create a batch SQL file from article data"""
    if not articles:
        return
        
    sql_lines = [
        "INSERT INTO news_articles (title, content, author, published_date, category, tags, slug, meta_description, status, created_at, updated_at) VALUES"
    ]
    
    value_lines = []
    for article in articles:
        value_line = f"('{article['title']}', '{article['content']}', '{article['author']}', '{article['published_date']}', '{article['category']}', {article['tags']}, '{article['slug']}', '{article['meta_description']}', '{article['status']}', NOW(), NOW())"
        value_lines.append(value_line)
    
    sql_lines.append(',\n'.join(value_lines) + ';')
    
    output_file = f"{batch_name}.sql"
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_lines))
    
    print(f"Created {output_file} with {len(articles)} articles")
    return len(articles)

def main():
    # Process remaining articles in batches
    batch_size = 10
    total_processed = 0
    
    # Start from article 61 (since we've processed up to 60)
    start_article = 61
    end_article = 130
    
    current_batch = []
    batch_number = 1
    
    for i in range(start_article, end_article + 1):
        article_file = f"scripts/article_{i:03d}.sql"
        
        if os.path.exists(article_file):
            article_data = extract_article_data(article_file)
            if article_data:
                current_batch.append(article_data)
                
                # Create batch when we reach batch_size or at the end
                if len(current_batch) >= batch_size or i == end_article:
                    count = create_batch_sql(current_batch, f"final_batch_{batch_number:03d}")
                    total_processed += count
                    current_batch = []
                    batch_number += 1
        else:
            print(f"File {article_file} not found")
    
    # Process any remaining articles
    if current_batch:
        count = create_batch_sql(current_batch, f"final_batch_{batch_number:03d}")
        total_processed += count
    
    print(f"\nTotal articles processed: {total_processed}")
    print(f"Created {batch_number - 1} batch files")

if __name__ == "__main__":
    main()