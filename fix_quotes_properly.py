import os
import re

def fix_sql_quotes_properly(content):
    """Properly fix SQL quotes by escaping single quotes inside string literals"""
    lines = content.split('\n')
    fixed_lines = []
    
    for line in lines:
        if line.strip() and ("'," in line or line.strip().endswith("');") or line.strip().endswith("'),")):
            # This line contains string values that need quote fixing
            fixed_line = fix_line_quotes(line)
            fixed_lines.append(fixed_line)
        else:
            fixed_lines.append(line)
    
    return '\n'.join(fixed_lines)

def fix_line_quotes(line):
    """Fix quotes in a single line containing SQL values"""
    # Find the pattern: ('value', 'value', ...)
    # We need to escape single quotes inside the values but keep the outer quotes
    
    # Split by commas to handle each value separately
    parts = []
    current_part = ""
    in_string = False
    quote_count = 0
    
    i = 0
    while i < len(line):
        char = line[i]
        
        if char == "'":
            if not in_string:
                # Starting a string
                in_string = True
                current_part += char
            else:
                # Could be end of string or escaped quote
                if i + 1 < len(line) and line[i + 1] == "'":
                    # This is an escaped quote, keep both
                    current_part += "''"
                    i += 1  # Skip the next quote
                else:
                    # End of string
                    in_string = False
                    current_part += char
        elif char == "," and not in_string:
            # End of this value
            parts.append(current_part.strip())
            current_part = ""
        else:
            current_part += char
        
        i += 1
    
    # Add the last part
    if current_part.strip():
        parts.append(current_part.strip())
    
    # Now fix each part
    fixed_parts = []
    for part in parts:
        if part.startswith("'") and part.endswith("'"):
            # This is a string value, fix internal quotes
            inner_content = part[1:-1]  # Remove outer quotes
            # Escape any single quotes that aren't already escaped
            fixed_inner = inner_content.replace("'", "''")
            fixed_parts.append(f"'{fixed_inner}'")
        else:
            fixed_parts.append(part)
    
    return ", ".join(fixed_parts)

def restore_from_original_and_fix(original_file, target_file):
    """Restore from original file and apply proper quote fixing"""
    try:
        with open(original_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Apply proper quote fixing
        fixed_content = fix_sql_quotes_properly(content)
        
        # Write to target file
        with open(target_file, 'w', encoding='utf-8') as f:
            f.write(fixed_content)
        
        print(f"Fixed {target_file} from {original_file}")
        return True
    except Exception as e:
        print(f"Error processing {original_file}: {e}")
        return False

def recreate_batch_files():
    """Recreate batch files from original article files with proper quote escaping"""
    from pathlib import Path
    
    def read_article_sql(file_path):
        """Read and extract VALUES content from an article SQL file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read().strip()
                
            # Extract the VALUES part
            if 'VALUES' in content:
                values_part = content.split('VALUES')[1].strip()
                # Remove the trailing semicolon if present
                if values_part.endswith(';'):
                    values_part = values_part[:-1]
                return values_part
            return None
        except Exception as e:
            print(f"Error reading {file_path}: {e}")
            return None
    
    def escape_sql_string(text):
        """Properly escape a string for SQL"""
        return text.replace("'", "''")
    
    def create_batch_insert(start_num, end_num, batch_size=10):
        """Create batch insert statements for articles with proper escaping"""
        scripts_dir = Path('scripts')
        
        current_batch = []
        batch_count = 0
        
        for i in range(start_num, end_num + 1):
            article_file = scripts_dir / f'article_{i:03d}.sql'
            
            if article_file.exists():
                values_content = read_article_sql(article_file)
                if values_content:
                    # Parse and fix the values content
                    fixed_values = fix_values_content(values_content)
                    current_batch.append(fixed_values)
                    
                    # When batch is full, create insert statement
                    if len(current_batch) >= batch_size:
                        batch_count += 1
                        batch_sql = create_insert_statement(current_batch, batch_count)
                        
                        # Save batch to file
                        batch_filename = f'batch_insert_{batch_count:03d}_fixed.sql'
                        with open(batch_filename, 'w', encoding='utf-8') as f:
                            f.write(batch_sql)
                        
                        print(f"Created {batch_filename} with {len(current_batch)} articles")
                        current_batch = []
        
        # Handle remaining articles
        if current_batch:
            batch_count += 1
            batch_sql = create_insert_statement(current_batch, batch_count)
            batch_filename = f'batch_insert_{batch_count:03d}_fixed.sql'
            with open(batch_filename, 'w', encoding='utf-8') as f:
                f.write(batch_sql)
            print(f"Created {batch_filename} with {len(current_batch)} articles")
        
        return batch_count
    
    def fix_values_content(values_content):
        """Fix quotes in VALUES content"""
        # Simple approach: escape all single quotes
        return values_content.replace("'", "''")
    
    def create_insert_statement(values_list, batch_num):
        """Create a complete INSERT statement from VALUES list"""
        header = """INSERT INTO news_articles (
    title, content, summary, slug, category, author, 
    published_date, status, created_at, updated_at, 
    source_file, meta_description
) VALUES\n"""
        
        values_combined = ',\n'.join(values_list)
        return header + values_combined + ';'
    
    # Recreate batch files
    total_batches = create_batch_insert(31, 151, batch_size=10)
    return total_batches

if __name__ == "__main__":
    print("Recreating batch files with proper quote escaping...")
    
    total_batches = recreate_batch_files()
    
    print(f"\nCreated {total_batches} properly formatted batch files")
    print("Files are named batch_insert_XXX_fixed.sql")