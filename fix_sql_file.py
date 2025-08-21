def fix_sql_file():
    """Fix the SQL file by removing duplicate headers and empty entries"""
    
    with open('batch_insert_truly_remaining.sql', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split into lines
    lines = content.split('\n')
    
    # Find the proper INSERT statement start
    insert_header = """INSERT INTO news_articles (
    title, content, summary, slug, category, author, 
    published_date, status, created_at, updated_at, 
    source_file, meta_description
) VALUES"""
    
    # Find where the actual data starts (after the first proper article entry)
    fixed_lines = []
    in_values = False
    skip_next_empty_entry = False
    
    for i, line in enumerate(lines):
        # Skip the duplicate header lines that appear in the middle
        if ('title, content, summary, slug, category, author' in line or 
            'published_date, status, created_at, updated_at' in line or 
            'source_file, meta_description' in line) and in_values:
            skip_next_empty_entry = True
            continue
            
        # Skip empty entries like "(),"
        if skip_next_empty_entry and (line.strip() == '(' or line.strip() == '),' or line.strip() == ')' or line.strip() == ''):
            if line.strip() == '),' or line.strip() == ')':
                skip_next_empty_entry = False
            continue
            
        # Mark when we're in the VALUES section
        if 'VALUES' in line:
            in_values = True
            
        fixed_lines.append(line)
    
    # Join back and write
    fixed_content = '\n'.join(fixed_lines)
    
    with open('batch_insert_final.sql', 'w', encoding='utf-8') as f:
        f.write(fixed_content)
    
    print("Fixed SQL file created: batch_insert_final.sql")
    
    # Count articles in the fixed file
    article_count = fixed_content.count("',\n    'published'")
    print(f"Estimated articles in fixed file: {article_count}")

if __name__ == "__main__":
    fix_sql_file()