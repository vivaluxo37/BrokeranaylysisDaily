import os
import re

def escape_single_quotes(text):
    """Escape single quotes in text by doubling them"""
    return text.replace("'", "''")

def extract_values_content(file_path):
    """Extract the VALUES content from an individual article SQL file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find the VALUES clause
        values_match = re.search(r'VALUES\s*\((.*?)\);', content, re.DOTALL)
        if values_match:
            values_content = values_match.group(1).strip()
            return values_content
        else:
            print(f"No VALUES clause found in {file_path}")
            return None
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return None

def create_corrected_batch(start_num, end_num, batch_name):
    """Create a batch SQL file with correct column structure"""
    
    # Correct INSERT statement without featured_image column
    insert_statement = """INSERT INTO news_articles (title, content, author, published_date, category, tags, slug, meta_description, status, created_at, updated_at) VALUES\n"""
    
    values_list = []
    
    for i in range(start_num, end_num + 1):
        article_file = f"scripts/article_{i:03d}.sql"
        
        if os.path.exists(article_file):
            values_content = extract_values_content(article_file)
            if values_content:
                # Parse the original values to extract individual fields
                # Remove the featured_image field (9th field) from the values
                values_parts = []
                in_quotes = False
                current_part = ""
                quote_char = None
                paren_count = 0
                
                for char in values_content:
                    if char in ["'", '"'] and not in_quotes:
                        in_quotes = True
                        quote_char = char
                        current_part += char
                    elif char == quote_char and in_quotes:
                        # Check if it's an escaped quote
                        if len(current_part) > 0 and current_part[-1] == quote_char:
                            current_part += char
                        else:
                            in_quotes = False
                            quote_char = None
                            current_part += char
                    elif char == ',' and not in_quotes and paren_count == 0:
                        values_parts.append(current_part.strip())
                        current_part = ""
                    elif char == '(' and not in_quotes:
                        paren_count += 1
                        current_part += char
                    elif char == ')' and not in_quotes:
                        paren_count -= 1
                        current_part += char
                    else:
                        current_part += char
                
                # Add the last part
                if current_part.strip():
                    values_parts.append(current_part.strip())
                
                # Remove the featured_image field (index 8, 0-based) if it exists
                if len(values_parts) >= 10:
                    # Remove featured_image field
                    corrected_parts = values_parts[:8] + values_parts[9:]
                    corrected_values = ', '.join(corrected_parts)
                    values_list.append(f"({corrected_values})")
                else:
                    # If the structure is different, just use as is
                    values_list.append(f"({values_content})")
        else:
            print(f"Article file {article_file} not found")
    
    if values_list:
        # Create the complete SQL statement
        complete_sql = insert_statement + ',\n'.join(values_list) + ';'
        
        # Write to file
        output_file = f"{batch_name}.sql"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(complete_sql)
        
        print(f"Created {output_file} with {len(values_list)} articles")
        return len(values_list)
    else:
        print(f"No articles found for batch {batch_name}")
        return 0

def main():
    # Create corrected batch files
    total_articles = 0
    
    # Batch 4: articles 061-080
    count = create_corrected_batch(61, 80, "corrected_batch_004")
    total_articles += count
    
    # Batch 5: articles 081-100
    count = create_corrected_batch(81, 100, "corrected_batch_005")
    total_articles += count
    
    # Batch 6: articles 101-120
    count = create_corrected_batch(101, 120, "corrected_batch_006")
    total_articles += count
    
    # Batch 7: articles 121-130 (remaining)
    count = create_corrected_batch(121, 130, "corrected_batch_007")
    total_articles += count
    
    print(f"\nTotal articles processed: {total_articles}")

if __name__ == "__main__":
    main()