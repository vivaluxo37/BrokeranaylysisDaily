import os
import re
from datetime import datetime

def extract_article_data(file_path):
    """Extract article data from SQL file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract INSERT statement
    insert_pattern = r"INSERT INTO news_articles \([^)]+\) VALUES\s*\(([^;]+)\);"
    match = re.search(insert_pattern, content, re.DOTALL)
    
    if not match:
        return None
    
    values = match.group(1).strip()
    
    # Parse the values - this is a simplified parser
    # Split by comma but be careful with quoted strings
    parts = []
    current_part = ""
    in_quotes = False
    quote_char = None
    paren_count = 0
    
    i = 0
    while i < len(values):
        char = values[i]
        
        if char in ["'", '"'] and (i == 0 or values[i-1] != '\\'):
            if not in_quotes:
                in_quotes = True
                quote_char = char
            elif char == quote_char:
                in_quotes = False
                quote_char = None
        elif char == '(' and not in_quotes:
            paren_count += 1
        elif char == ')' and not in_quotes:
            paren_count -= 1
        elif char == ',' and not in_quotes and paren_count == 0:
            parts.append(current_part.strip())
            current_part = ""
            i += 1
            continue
        
        current_part += char
        i += 1
    
    if current_part.strip():
        parts.append(current_part.strip())
    
    if len(parts) >= 11:  # We need at least 11 fields
        # Clean up the parts
        title = parts[0].strip("'\"")
        content = parts[1].strip("'\"")
        meta_desc = parts[2].strip("'\"")
        slug = parts[3].strip("'\"")
        category = parts[4].strip("'\"")
        author = parts[5].strip("'\"")
        
        # Generate appropriate tags based on title and content
        tags = []
        title_lower = title.lower()
        content_lower = content.lower()
        
        # Currency pairs
        currency_pairs = ['USD/MXN', 'EUR/USD', 'GBP/USD', 'USD/ZAR', 'USD/CHF']
        for pair in currency_pairs:
            if pair.lower() in title_lower or pair.lower() in content_lower:
                tags.append(pair)
        
        # Common forex terms
        forex_terms = {
            'forecast': 'forex forecast',
            'analysis': 'technical analysis', 
            'weekly': 'weekly analysis',
            'bitcoin': 'Bitcoin',
            'crypto': 'cryptocurrency',
            'solana': 'Solana',
            'trading': 'trading setups'
        }
        
        for term, tag in forex_terms.items():
            if term in title_lower or term in content_lower:
                tags.append(tag)
        
        if not tags:
            tags = ['market analysis']
        
        return {
            'title': title,
            'content': content,
            'author': 'Broker Analysis',
            'published_date': '2025-07-23T00:00:00',
            'category': 'General',
            'tags': tags,
            'slug': slug,
            'meta_description': meta_desc,
            'status': 'published',
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        }
    
    return None

def create_insert_statement(article_data):
    """Create INSERT statement with proper array syntax"""
    tags_array = "ARRAY[" + ", ".join([f"'{tag}'" for tag in article_data['tags']]) + "]"
    
    # Escape single quotes in content
    content = article_data['content'].replace("'", "''")
    title = article_data['title'].replace("'", "''")
    meta_desc = article_data['meta_description'].replace("'", "''")
    
    return f"""INSERT INTO news_articles (title, content, author, published_date, category, tags, slug, meta_description, status, created_at, updated_at) VALUES
('{title}', '{content}', '{article_data['author']}', '{article_data['published_date']}', '{article_data['category']}', {tags_array}, '{article_data['slug']}', '{meta_desc}', '{article_data['status']}', '{article_data['created_at']}', '{article_data['updated_at']}');"""

def main():
    """Process remaining articles and create migration batches"""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Known existing slugs to skip
    existing_slugs = {
        'usdmxn-monthly-forecast-july-2025-chart',
        'weekly-forex-forecast-june-01th-june-06th-charts'
    }
    
    articles_to_migrate = []
    
    # Process remaining batch files
    for i in range(8, 15):  # remaining_batch_008 to remaining_batch_014
        batch_file = os.path.join(script_dir, f'remaining_batch_{i:03d}.sql')
        
        if os.path.exists(batch_file):
            print(f"Processing {batch_file}...")
            
            with open(batch_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Extract all INSERT statements
            insert_pattern = r"\('([^']+)'[^;]+\)(?:,|;)"
            matches = re.findall(insert_pattern, content)
            
            for match in matches:
                # Extract slug from the line
                line_pattern = rf"\('{re.escape(match)}'[^;]+\)"
                line_match = re.search(line_pattern, content)
                if line_match:
                    line = line_match.group(0)
                    # Extract slug (4th field)
                    parts = line.split("', '")
                    if len(parts) >= 4:
                        slug = parts[3].split("'")[0]
                        if slug not in existing_slugs:
                            # Create a simple article entry
                            article = {
                                'title': match,
                                'content': 'Content extracted from migration',
                                'author': 'Broker Analysis',
                                'published_date': '2025-07-23T00:00:00',
                                'category': 'General',
                                'tags': ['market analysis'],
                                'slug': slug,
                                'meta_description': f'Analysis: {match}',
                                'status': 'published',
                                'created_at': datetime.now().isoformat(),
                                'updated_at': datetime.now().isoformat()
                            }
                            articles_to_migrate.append(article)
                            existing_slugs.add(slug)
    
    # Create migration batches
    batch_size = 10
    batch_num = 8
    
    for i in range(0, len(articles_to_migrate), batch_size):
        batch_articles = articles_to_migrate[i:i+batch_size]
        
        batch_content = f"-- Migration batch {batch_num:03d}\n"
        
        for j, article in enumerate(batch_articles):
            insert_stmt = create_insert_statement(article)
            if j < len(batch_articles) - 1:
                insert_stmt = insert_stmt.rstrip(';') + ',\n'
            batch_content += insert_stmt + "\n"
        
        batch_file = os.path.join(script_dir, f'migration_batch_{batch_num:03d}.sql')
        with open(batch_file, 'w', encoding='utf-8') as f:
            f.write(batch_content)
        
        print(f"Created {batch_file} with {len(batch_articles)} articles")
        batch_num += 1
    
    print(f"\nTotal articles to migrate: {len(articles_to_migrate)}")
    print(f"Created {batch_num - 8} migration batch files")

if __name__ == "__main__":
    main()