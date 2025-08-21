import os
import re

def escape_single_quotes(text):
    """Properly escape single quotes in SQL string literals"""
    return text.replace("'", "''")

def extract_values_from_file(file_path):
    """Extract the VALUES content from an individual article SQL file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find the VALUES clause
        values_match = re.search(r'VALUES\s*\((.*?)\);', content, re.DOTALL)
        if values_match:
            values_content = values_match.group(1).strip()
            return f"({values_content})"
        return None
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return None

def create_large_batch_files():
    """Create larger batch files with 20 articles each"""
    scripts_dir = "C:\\Users\\LENOVO\\Desktop\\BrokeranalysisDaily\\scripts"
    
    # Start from article_041 (since we've inserted up to article_040)
    start_num = 41
    end_num = 151
    batch_size = 20
    
    batch_num = 1
    current_batch = []
    
    for i in range(start_num, end_num + 1):
        file_path = os.path.join(scripts_dir, f"article_{i:03d}.sql")
        
        if os.path.exists(file_path):
            values_content = extract_values_from_file(file_path)
            if values_content:
                current_batch.append(values_content)
                
                # When we reach batch_size articles, create a batch file
                if len(current_batch) == batch_size:
                    create_batch_file(current_batch, batch_num)
                    current_batch = []
                    batch_num += 1
    
    # Handle remaining articles in the last batch
    if current_batch:
        create_batch_file(current_batch, batch_num)
    
    print(f"Created {batch_num} large batch files with {batch_size} articles each (except possibly the last one)")

def create_batch_file(values_list, batch_num):
    """Create a batch SQL file with the given VALUES list"""
    sql_content = """INSERT INTO news_articles (
    title, content, summary, slug, category, author, 
    published_date, status, created_at, updated_at, 
    source_file, meta_description
) VALUES\n"""
    
    sql_content += ",\n".join(values_list) + ";"
    
    filename = f"large_batch_{batch_num:03d}.sql"
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(sql_content)
    
    print(f"Created {filename} with {len(values_list)} articles")

if __name__ == "__main__":
    create_large_batch_files()