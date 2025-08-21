import os
import re

def read_article_sql(file_path):
    """Read an individual article SQL file and extract the VALUES content"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read().strip()
            
        # Extract the VALUES part from the INSERT statement
        values_match = re.search(r'VALUES\s*\((.*?)\);?$', content, re.DOTALL)
        if values_match:
            return values_match.group(1)
        else:
            print(f"Warning: Could not extract VALUES from {file_path}")
            return None
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return None

def create_batch_insert_sql(start_article=24, end_article=191):
    """Create a single INSERT statement for all articles from start to end"""
    
    # Base INSERT statement
    insert_base = """INSERT INTO news_articles (
    title, content, summary, slug, category, author, 
    published_date, status, created_at, updated_at, 
    source_file, meta_description
) VALUES"""
    
    values_list = []
    
    for i in range(start_article, end_article + 1):
        file_path = f"article_{i:03d}.sql"
        
        if os.path.exists(file_path):
            values_content = read_article_sql(file_path)
            if values_content:
                values_list.append(f"({values_content})")
                print(f"Added article {i}")
        else:
            print(f"File not found: {file_path}")
    
    if values_list:
        # Combine all VALUES
        complete_sql = insert_base + "\n" + ",\n".join(values_list) + ";\n"
        
        # Write to file
        output_file = "batch_insert_remaining_from_24.sql"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(complete_sql)
        
        print(f"\nBatch insert SQL created: {output_file}")
        print(f"Total articles: {len(values_list)}")
        print(f"Articles range: {start_article} to {end_article}")
        print("Ready for batch insertion!")
        
        return output_file
    else:
        print("No articles found to process")
        return None

if __name__ == "__main__":
    create_batch_insert_sql(24, 191)