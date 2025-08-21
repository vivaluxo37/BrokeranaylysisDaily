import os
import re
from pathlib import Path

def fix_sql_quotes(content):
    """Fix SQL quotes by properly escaping single quotes"""
    # Replace single quotes with double single quotes for SQL escaping
    # But be careful not to affect the outer quotes of string literals
    
    # Split by VALUES to handle the header and values separately
    if 'VALUES' in content:
        header_part = content.split('VALUES')[0] + 'VALUES\n'
        values_part = content.split('VALUES')[1]
        
        # Fix quotes in the values part
        # Replace single quotes with double single quotes, but not the ones that wrap the strings
        fixed_values = fix_quotes_in_values(values_part)
        
        return header_part + fixed_values
    
    return content

def fix_quotes_in_values(values_content):
    """Fix quotes specifically in the VALUES section"""
    # This is a more sophisticated approach to handle quote escaping
    lines = values_content.split('\n')
    fixed_lines = []
    
    for line in lines:
        if line.strip():
            # For each line, we need to escape single quotes that are inside string literals
            # but not the ones that delimit the string literals
            fixed_line = escape_inner_quotes(line)
            fixed_lines.append(fixed_line)
        else:
            fixed_lines.append(line)
    
    return '\n'.join(fixed_lines)

def escape_inner_quotes(line):
    """Escape single quotes that are inside string literals"""
    # Find all string literals (content between single quotes)
    # and escape any single quotes inside them
    
    result = []
    i = 0
    while i < len(line):
        if line[i] == "'":
            # Found start of string literal
            result.append("'")
            i += 1
            
            # Find the end of this string literal
            string_content = []
            while i < len(line):
                if line[i] == "'":
                    # Check if this is an escaped quote or end of string
                    if i + 1 < len(line) and line[i + 1] == "'":
                        # This is already an escaped quote, keep it
                        string_content.append("''")
                        i += 2
                    else:
                        # This is the end of the string literal
                        break
                elif line[i] == "'":
                    # This is a single quote inside the string, escape it
                    string_content.append("''")
                    i += 1
                else:
                    string_content.append(line[i])
                    i += 1
            
            # Add the string content and closing quote
            result.append(''.join(string_content))
            if i < len(line):
                result.append("'")
                i += 1
        else:
            result.append(line[i])
            i += 1
    
    return ''.join(result)

def simple_quote_fix(content):
    """A simpler approach - replace all single quotes in content with double quotes for escaping"""
    # Split the content to identify string literals
    lines = content.split('\n')
    fixed_lines = []
    
    for line in lines:
        if "'," in line or line.strip().endswith("');") or line.strip().endswith("'),"):
            # This line contains string content that needs quote fixing
            # Use a simple replacement approach
            fixed_line = line.replace("'", "''")
            # But fix the outer quotes back
            fixed_line = re.sub(r"^(\s*)''''(.*?)'''',?$", r"\1'\2',", fixed_line)
            fixed_line = re.sub(r"^(\s*)''''(.*?)''''\);?$", r"\1'\2');", fixed_line)
            fixed_lines.append(fixed_line)
        else:
            fixed_lines.append(line)
    
    return '\n'.join(fixed_lines)

def process_batch_file(filename):
    """Process a single batch file to fix quotes"""
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Apply quote fixing
        fixed_content = simple_quote_fix(content)
        
        # Write back to file
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(fixed_content)
        
        print(f"Fixed quotes in {filename}")
        return True
    except Exception as e:
        print(f"Error processing {filename}: {e}")
        return False

if __name__ == "__main__":
    print("Fixing quotes in batch files...")
    
    # Process all batch files
    batch_files = [f for f in os.listdir('.') if f.startswith('batch_insert_') and f.endswith('.sql')]
    
    success_count = 0
    for batch_file in sorted(batch_files):
        if process_batch_file(batch_file):
            success_count += 1
    
    print(f"\nProcessed {success_count}/{len(batch_files)} batch files successfully")