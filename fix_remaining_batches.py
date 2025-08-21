import os
import re

def fix_batch_file(input_file, output_file):
    """Fix a batch file to use proper array syntax for tags and correct table structure"""
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace news_articles table references and fix array syntax
    # First, extract all INSERT statements
    insert_pattern = r"INSERT INTO news_articles \([^)]+\) VALUES\s*\(([^;]+)\);"
    
    fixed_content = "-- Fixed batch file with proper array syntax\n"
    
    matches = re.findall(insert_pattern, content, re.DOTALL)
    
    for match in matches:
        # Split the values by comma, but be careful with nested content
        values = match.strip()
        
        # Fix the tags field - convert string to array format
        # Look for patterns like 'tag1, tag2, tag3' and convert to ARRAY['tag1', 'tag2', 'tag3']
        values = re.sub(r"'([^']*(?:USD/[A-Z]{3}|EUR/[A-Z]{3}|GBP/[A-Z]{3}|[^']*))'", 
                       lambda m: f"ARRAY['{m.group(1).replace(', ', "', '")}']" if any(x in m.group(1) for x in ['/', 'forecast', 'analysis', 'trading']) else f"'{m.group(1)}'", 
                       values)
        
        # Create the fixed INSERT statement
        fixed_insert = f"""INSERT INTO news_articles (title, content, author, published_date, category, tags, slug, meta_description, status, created_at, updated_at) VALUES
({values});\n\n"""
        
        fixed_content += fixed_insert
    
    # Write the fixed content
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(fixed_content)
    
    print(f"Fixed {input_file} -> {output_file}")

def main():
    """Fix all remaining batch files"""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Process remaining batch files
    for i in range(8, 15):  # remaining_batch_008 to remaining_batch_014
        input_file = os.path.join(script_dir, f'remaining_batch_{i:03d}.sql')
        output_file = os.path.join(script_dir, f'fixed_batch_{i:03d}.sql')
        
        if os.path.exists(input_file):
            fix_batch_file(input_file, output_file)
        else:
            print(f"File not found: {input_file}")

if __name__ == "__main__":
    main()