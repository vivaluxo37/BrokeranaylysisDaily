import os
from pathlib import Path

def read_and_fix_article(article_num):
    """Read an article file and return properly escaped VALUES content"""
    article_file = Path('scripts') / f'article_{article_num:03d}.sql'
    
    if not article_file.exists():
        return None
    
    try:
        with open(article_file, 'r', encoding='utf-8') as f:
            content = f.read().strip()
        
        # Extract the VALUES part
        if 'VALUES' in content:
            values_part = content.split('VALUES')[1].strip()
            # Remove the trailing semicolon if present
            if values_part.endswith(';'):
                values_part = values_part[:-1]
            
            # Fix quotes: replace single quotes with double single quotes for SQL escaping
            # But be careful not to break the structure
            return fix_sql_values(values_part)
        
        return None
    except Exception as e:
        print(f"Error reading article {article_num}: {e}")
        return None

def fix_sql_values(values_content):
    """Fix SQL values by properly escaping quotes"""
    # This is a simple approach - we'll parse the parentheses content
    # and escape quotes within string literals
    
    if not values_content.startswith('(') or not values_content.rstrip().endswith(')'):
        return values_content
    
    # Remove outer parentheses
    inner_content = values_content[1:-1].strip()
    
    # Split by commas, but be careful about commas within quoted strings
    parts = []
    current_part = ""
    in_quotes = False
    quote_char = None
    
    i = 0
    while i < len(inner_content):
        char = inner_content[i]
        
        if char in ["'", '"'] and not in_quotes:
            # Starting a quoted string
            in_quotes = True
            quote_char = char
            current_part += char
        elif char == quote_char and in_quotes:
            # Ending quoted string or escaped quote
            if i + 1 < len(inner_content) and inner_content[i + 1] == quote_char:
                # Escaped quote, keep both
                current_part += char + char
                i += 1  # Skip next character
            else:
                # End of quoted string
                in_quotes = False
                quote_char = None
                current_part += char
        elif char == ',' and not in_quotes:
            # Field separator
            parts.append(current_part.strip())
            current_part = ""
        else:
            current_part += char
        
        i += 1
    
    # Add the last part
    if current_part.strip():
        parts.append(current_part.strip())
    
    # Now fix each part - escape single quotes in string literals
    fixed_parts = []
    for part in parts:
        part = part.strip()
        if part.startswith("'") and part.endswith("'"):
            # This is a string literal, escape internal quotes
            inner = part[1:-1]  # Remove outer quotes
            # Escape single quotes by doubling them
            escaped_inner = inner.replace("'", "''")
            fixed_parts.append(f"'{escaped_inner}'")
        else:
            fixed_parts.append(part)
    
    return '(' + ', '.join(fixed_parts) + ')'

def create_simple_batch(start_article, count=5):
    """Create a simple batch with just a few articles"""
    values_list = []
    
    for i in range(start_article, start_article + count):
        values_content = read_and_fix_article(i)
        if values_content:
            values_list.append(values_content)
            print(f"Added article {i:03d}")
    
    if not values_list:
        print("No articles found to process")
        return
    
    # Create the INSERT statement
    header = """INSERT INTO news_articles (
    title, content, summary, slug, category, author, 
    published_date, status, created_at, updated_at, 
    source_file, meta_description
) VALUES\n"""
    
    values_combined = ',\n'.join(values_list)
    complete_sql = header + values_combined + ';'
    
    # Write to file
    filename = f'simple_batch_{start_article:03d}.sql'
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(complete_sql)
    
    print(f"Created {filename} with {len(values_list)} articles")
    return filename

if __name__ == "__main__":
    print("Creating a simple batch file with proper quote escaping...")
    
    # Create a batch starting from article 031 with 5 articles
    filename = create_simple_batch(31, 5)
    
    if filename:
        print(f"\nBatch file created: {filename}")
        print("You can now try to insert this batch into the database.")