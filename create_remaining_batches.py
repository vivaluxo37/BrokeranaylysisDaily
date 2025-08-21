import os
import re

def clean_text_for_sql(text):
    """Clean and escape text for SQL insertion"""
    if not text:
        return ''
    
    # Replace single quotes with two single quotes for SQL escaping
    text = text.replace("'", "''")
    
    # Clean up any problematic characters
    text = text.replace('\r\n', '\n').replace('\r', '\n')
    text = text.replace('\\', '\\\\')
    
    return text

def extract_article_data(file_path):
    """Extract article data from SQL file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Look for VALUES clause
        values_match = re.search(r'VALUES\s*\((.*?)\);', content, re.DOTALL | re.IGNORECASE)
        if not values_match:
            return None
        
        values_content = values_match.group(1).strip()
        
        # Split by comma, but be careful with quoted strings
        parts = []
        current_part = ''
        in_quotes = False
        quote_char = None
        
        i = 0
        while i < len(values_content):
            char = values_content[i]
            
            if not in_quotes and char in ["'", '"']:
                in_quotes = True
                quote_char = char
                current_part += char
            elif in_quotes and char == quote_char:
                # Check if it's an escaped quote
                if i + 1 < len(values_content) and values_content[i + 1] == quote_char:
                    current_part += char + char
                    i += 1
                else:
                    in_quotes = False
                    quote_char = None
                    current_part += char
            elif not in_quotes and char == ',':
                parts.append(current_part.strip())
                current_part = ''
            else:
                current_part += char
            
            i += 1
        
        if current_part.strip():
            parts.append(current_part.strip())
        
        if len(parts) < 11:
            return None
        
        # Clean each part
        cleaned_parts = []
        for part in parts:
            part = part.strip()
            if part.startswith("'") and part.endswith("'"):
                part = part[1:-1]  # Remove outer quotes
            cleaned_parts.append(clean_text_for_sql(part))
        
        return {
            'title': cleaned_parts[0],
            'content': cleaned_parts[1],
            'author': cleaned_parts[2],
            'published_date': cleaned_parts[3],
            'category': cleaned_parts[4],
            'tags': cleaned_parts[5],
            'slug': cleaned_parts[6],
            'meta_description': cleaned_parts[7],
            'status': cleaned_parts[8],
            'created_at': cleaned_parts[9],
            'updated_at': cleaned_parts[10]
        }
    
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return None

def create_batch_sql(articles, batch_name):
    """Create batch SQL file from article data"""
    sql_content = f"-- {batch_name}\n"
    sql_content += "INSERT INTO news_articles (title, content, author, published_date, category, tags, slug, meta_description, status, created_at, updated_at) VALUES\n"
    
    values_list = []
    for article in articles:
        values = f"('{article['title']}', '{article['content']}', '{article['author']}', '{article['published_date']}', '{article['category']}', '{article['tags']}', '{article['slug']}', '{article['meta_description']}', '{article['status']}', '{article['created_at']}', '{article['updated_at']}')"
        values_list.append(values)
    
    sql_content += ',\n'.join(values_list) + ';\n'
    
    return sql_content

def main():
    scripts_dir = 'scripts'
    
    # Process articles 123-191 (the remaining ones)
    start_article = 123
    end_article = 191
    batch_size = 10
    
    all_articles = []
    
    for i in range(start_article, end_article + 1):
        file_path = os.path.join(scripts_dir, f'article_{i:03d}.sql')
        
        if os.path.exists(file_path):
            article_data = extract_article_data(file_path)
            if article_data:
                all_articles.append(article_data)
                print(f"Processed article_{i:03d}.sql")
            else:
                print(f"No VALUES found in article_{i:03d}.sql")
        else:
            print(f"File not found: article_{i:03d}.sql")
    
    # Create batch files
    batch_num = 8  # Starting from batch 8 since we already have 1-7
    for i in range(0, len(all_articles), batch_size):
        batch_articles = all_articles[i:i + batch_size]
        batch_name = f"remaining_batch_{batch_num:03d}"
        
        sql_content = create_batch_sql(batch_articles, batch_name)
        
        with open(f'{batch_name}.sql', 'w', encoding='utf-8') as f:
            f.write(sql_content)
        
        print(f"Created {batch_name}.sql with {len(batch_articles)} articles")
        batch_num += 1
    
    print(f"\nTotal articles processed: {len(all_articles)}")
    print(f"Expected total after migration: {113 + len(all_articles)}")

if __name__ == '__main__':
    main()