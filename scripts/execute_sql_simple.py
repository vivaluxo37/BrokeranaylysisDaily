import os

def read_sql_file(file_path: str) -> str:
    """Read SQL file content"""
    with open(file_path, 'r', encoding='utf-8') as f:
        return f.read()

def split_sql_into_chunks(sql_content: str, max_size: int = 50000) -> list:
    """Split SQL content into smaller chunks based on VALUES entries"""
    # Find all individual value entries
    lines = sql_content.split('\n')
    
    # Find the INSERT statement header
    header_lines = []
    values_lines = []
    in_values = False
    
    for line in lines:
        if 'INSERT INTO' in line.upper():
            header_lines.append(line)
        elif ') VALUES' in line.upper():
            header_lines.append(line.replace(') VALUES', ') VALUES'))
            in_values = True
        elif in_values and line.strip().startswith('('):
            values_lines.append(line)
        elif not in_values:
            header_lines.append(line)
    
    # Create header
    header = '\n'.join(header_lines)
    
    # Split values into chunks
    chunks = []
    current_chunk_values = []
    current_size = len(header)
    
    for value_line in values_lines:
        line_size = len(value_line)
        
        if current_size + line_size > max_size and current_chunk_values:
            # Create chunk
            chunk_content = header + '\n' + ',\n'.join(current_chunk_values) + ';'
            chunks.append(chunk_content)
            
            # Start new chunk
            current_chunk_values = [value_line]
            current_size = len(header) + line_size
        else:
            current_chunk_values.append(value_line)
            current_size += line_size
    
    # Add final chunk
    if current_chunk_values:
        chunk_content = header + '\n' + ',\n'.join(current_chunk_values) + ';'
        chunks.append(chunk_content)
    
    return chunks

def main():
    """Process the first batch file into smaller chunks"""
    batch_file = 'import_articles_batch_1.sql'
    
    if not os.path.exists(batch_file):
        print(f"File {batch_file} not found")
        return
    
    try:
        # Read the SQL file
        sql_content = read_sql_file(batch_file)
        print(f"Read file: {len(sql_content)} characters")
        
        # Split into chunks
        chunks = split_sql_into_chunks(sql_content, max_size=30000)
        print(f"Created {len(chunks)} chunks")
        
        # Save each chunk
        for i, chunk in enumerate(chunks, 1):
            output_file = f"batch_1_chunk_{i}.sql"
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(chunk)
            print(f"Saved: {output_file} ({len(chunk)} characters)")
            
    except Exception as e:
        print(f"Error processing file: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()