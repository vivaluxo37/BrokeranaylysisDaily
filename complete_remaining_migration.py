import os
import re
from datetime import datetime

def extract_article_from_sql(file_path):
    """Extract article data from individual SQL file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Look for INSERT statement
        insert_pattern = r"INSERT INTO news_articles.*?VALUES\s*\(([^;]+)\);"
        match = re.search(insert_pattern, content, re.DOTALL | re.IGNORECASE)
        
        if not match:
            return None
        
        values_str = match.group(1).strip()
        
        # Simple parsing - split by comma but handle quoted strings
        parts = []
        current_part = ""
        in_quotes = False
        quote_char = None
        
        i = 0
        while i < len(values_str):
            char = values_str[i]
            
            if char in ["'", '"'] and (i == 0 or values_str[i-1] != '\\'):
                if not in_quotes:
                    in_quotes = True
                    quote_char = char
                elif char == quote_char:
                    in_quotes = False
                    quote_char = None
            elif char == ',' and not in_quotes:
                parts.append(current_part.strip())
                current_part = ""
                i += 1
                continue
            
            current_part += char
            i += 1
        
        if current_part.strip():
            parts.append(current_part.strip())
        
        if len(parts) >= 4:  # At least title, content, meta_desc, slug
            title = parts[0].strip("'\"")
            content = parts[1].strip("'\"")
            meta_desc = parts[2].strip("'\"")
            slug = parts[3].strip("'\"")
            
            # Determine category and tags based on title
            title_lower = title.lower()
            content_lower = content.lower()
            
            category = 'General'
            tags = ['market analysis']
            
            # Categorize based on content
            if any(term in title_lower for term in ['forex', 'eur/usd', 'gbp/usd', 'usd/', 'currency']):
                category = 'Forex'
                tags = ['forex', 'currency analysis']
            elif any(term in title_lower for term in ['bitcoin', 'crypto', 'ethereum', 'bnb']):
                category = 'Cryptocurrency'
                tags = ['cryptocurrency', 'digital assets']
            elif any(term in title_lower for term in ['gold', 'silver', 'oil', 'commodity']):
                category = 'Commodities'
                tags = ['commodities', 'precious metals']
            elif any(term in title_lower for term in ['stock', 'nasdaq', 'sp 500', 's&p']):
                category = 'Stocks'
                tags = ['stocks', 'equity markets']
            elif 'webinar' in title_lower:
                category = 'Education'
                tags = ['education', 'webinar']
            
            # Add specific tags based on content
            if 'forecast' in title_lower:
                tags.append('forecast')
            if 'analysis' in title_lower:
                tags.append('technical analysis')
            if 'monthly' in title_lower:
                tags.append('monthly outlook')
            if 'weekly' in title_lower:
                tags.append('weekly analysis')
            
            return {
                'title': title,
                'content': content if len(content) > 50 else f"Market analysis for {title}",
                'author': 'Broker Analysis',
                'published_date': '2025-07-23T00:00:00',
                'category': category,
                'tags': tags,
                'slug': slug,
                'meta_description': meta_desc if len(meta_desc) > 10 else f"Analysis: {title}"[:160],
                'status': 'published',
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat()
            }
    
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return None
    
    return None

def create_insert_statement(article):
    """Create properly formatted INSERT statement"""
    # Escape single quotes
    title = article['title'].replace("'", "''")
    content = article['content'].replace("'", "''")
    meta_desc = article['meta_description'].replace("'", "''")
    
    # Format tags as PostgreSQL array
    tags_array = "ARRAY[" + ", ".join([f"'{tag}'" for tag in article['tags']]) + "]"
    
    return f"""('{title}', '{content}', '{article['author']}', '{article['published_date']}', '{article['category']}', {tags_array}, '{article['slug']}', '{meta_desc}', '{article['status']}', '{article['created_at']}', '{article['updated_at']}')"""

def main():
    """Process all remaining articles from 116 onwards"""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    scripts_dir = os.path.join(script_dir, 'scripts')
    
    articles_to_migrate = []
    processed_count = 0
    
    # Process articles from 116 to 191
    for i in range(116, 192):
        article_file = os.path.join(scripts_dir, f'article_{i:03d}.sql')
        
        if os.path.exists(article_file):
            article_data = extract_article_from_sql(article_file)
            if article_data:
                articles_to_migrate.append(article_data)
                processed_count += 1
                print(f"Processed article_{i:03d}.sql: {article_data['title'][:50]}...")
            else:
                print(f"Failed to process article_{i:03d}.sql")
    
    print(f"\nTotal articles processed: {processed_count}")
    
    # Create migration batches
    batch_size = 15
    batch_num = 10
    
    for i in range(0, len(articles_to_migrate), batch_size):
        batch_articles = articles_to_migrate[i:i+batch_size]
        
        # Create INSERT statement with multiple values
        insert_statements = []
        for article in batch_articles:
            insert_statements.append(create_insert_statement(article))
        
        batch_content = f"-- Final migration batch {batch_num:03d}\n"
        batch_content += "INSERT INTO articles (title, slug, content, excerpt, category, subcategory, author_id, published_at, meta_description, meta_keywords, featured_image_url, status, view_count, tags, language) VALUES\n"
        batch_content += ",\n".join(insert_statements) + ";\n"
        
        batch_file = os.path.join(script_dir, f'final_migration_batch_{batch_num:03d}.sql')
        with open(batch_file, 'w', encoding='utf-8') as f:
            f.write(batch_content)
        
        print(f"Created {batch_file} with {len(batch_articles)} articles")
        batch_num += 1
    
    print(f"\nCreated {batch_num - 10} final migration batch files")
    print(f"Total articles ready for migration: {len(articles_to_migrate)}")

if __name__ == "__main__":
    main()